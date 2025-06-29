extends Node3D

@export var room_themes: Array[String] = ["cozy", "modern", "nature", "cyberpunk"]
@export var weather_types: Array[String] = ["clear", "rain", "snow", "storm"]

@onready var lighting_system: Node3D = $LightingSystem
@onready var weather_system: Node3D = $WeatherSystem
@onready var furniture_container: Node3D = $FurnitureContainer
@onready var walls: Node3D = $Walls
@onready var floor: Node3D = $Floor

var current_theme: String = "cozy"
var current_weather: String = "clear"
var current_time: float = 12.0

# Furniture prefabs
var furniture_prefabs: Dictionary = {}

func _ready():
	load_furniture_prefabs()
	setup_room()
	
	# Connect to GameManager signals
	GameManager.character_level_up.connect(_on_character_level_up)

func load_furniture_prefabs():
	furniture_prefabs = {
		"basic_chair": preload("res://prefabs/furniture/BasicChair.tscn"),
		"basic_desk": preload("res://prefabs/furniture/BasicDesk.tscn"),
		"basic_bed": preload("res://prefabs/furniture/BasicBed.tscn"),
		"comfortable_chair": preload("res://prefabs/furniture/ComfortableChair.tscn"),
		"gaming_setup": preload("res://prefabs/furniture/GamingSetup.tscn"),
		"bookshelf": preload("res://prefabs/furniture/Bookshelf.tscn"),
		"plant": preload("res://prefabs/furniture/Plant.tscn"),
		"lamp": preload("res://prefabs/furniture/Lamp.tscn")
	}

func setup_room():
	apply_theme(GameManager.current_room_theme)
	set_weather(GameManager.current_weather)
	set_time_of_day(GameManager.time_of_day)
	load_placed_furniture()

func apply_theme(theme_name: String):
	current_theme = theme_name
	
	match theme_name:
		"cozy":
			apply_cozy_theme()
		"modern":
			apply_modern_theme()
		"nature":
			apply_nature_theme()
		"cyberpunk":
			apply_cyberpunk_theme()

func apply_cozy_theme():
	# Warm lighting
	lighting_system.set_ambient_color(Color(1.0, 0.9, 0.7))
	
	# Wood textures for walls and floor
	set_wall_material("res://materials/wood_wall.tres")
	set_floor_material("res://materials/wood_floor.tres")

func apply_modern_theme():
	# Cool white lighting
	lighting_system.set_ambient_color(Color(0.9, 0.95, 1.0))
	
	# Clean materials
	set_wall_material("res://materials/modern_wall.tres")
	set_floor_material("res://materials/modern_floor.tres")

func apply_nature_theme():
	# Green tinted lighting
	lighting_system.set_ambient_color(Color(0.8, 1.0, 0.8))
	
	# Natural materials
	set_wall_material("res://materials/stone_wall.tres")
	set_floor_material("res://materials/grass_floor.tres")

func apply_cyberpunk_theme():
	# Neon lighting
	lighting_system.set_ambient_color(Color(0.7, 0.8, 1.0))
	
	# Tech materials
	set_wall_material("res://materials/tech_wall.tres")
	set_floor_material("res://materials/metal_floor.tres")

func set_wall_material(material_path: String):
	var material = load(material_path)
	for wall in walls.get_children():
		if wall.has_method("set_surface_override_material"):
			wall.set_surface_override_material(0, material)

func set_floor_material(material_path: String):
	var material = load(material_path)
	if floor.has_method("set_surface_override_material"):
		floor.set_surface_override_material(0, material)

func set_weather(weather_type: String):
	current_weather = weather_type
	weather_system.set_weather(weather_type)

func set_time_of_day(hour: float):
	current_time = hour
	lighting_system.set_time_of_day(hour)

func place_furniture(furniture_type: String, position: Vector3, rotation: Vector3) -> bool:
	if furniture_type in furniture_prefabs:
		var furniture_scene = furniture_prefabs[furniture_type]
		var furniture_instance = furniture_scene.instantiate()
		
		furniture_instance.position = position
		furniture_instance.rotation = rotation
		
		furniture_container.add_child(furniture_instance)
		
		# Add to GameManager
		GameManager.place_furniture(furniture_type, position, rotation)
		
		AudioManager.play_sfx("furniture_place")
		return true
	
	return false

func load_placed_furniture():
	# Clear existing furniture
	for child in furniture_container.get_children():
		child.queue_free()
	
	# Load from GameManager
	var placed_furniture = GameManager.get_placed_furniture()
	for furniture_data in placed_furniture:
		var furniture_type = furniture_data.get("type", "")
		var position = furniture_data.get("position", Vector3.ZERO)
		var rotation = furniture_data.get("rotation", Vector3.ZERO)
		
		if furniture_type in furniture_prefabs:
			var furniture_scene = furniture_prefabs[furniture_type]
			var furniture_instance = furniture_scene.instantiate()
			
			furniture_instance.position = position
			furniture_instance.rotation = rotation
			
			furniture_container.add_child(furniture_instance)

func _on_character_level_up(new_level: int):
	# Unlock new room features based on level
	match new_level:
		5:
			unlock_weather_effect("rain")
		10:
			unlock_lighting_mode("party")
		15:
			unlock_weather_effect("snow")
		20:
			unlock_weather_effect("storm")

func unlock_weather_effect(weather_type: String):
	print("Unlocked weather effect: ", weather_type)

func unlock_lighting_mode(lighting_mode: String):
	print("Unlocked lighting mode: ", lighting_mode)