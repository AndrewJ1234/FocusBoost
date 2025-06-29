extends Node3D

@onready var sun_light: DirectionalLight3D = $SunLight
@onready var ambient_light: OmniLight3D = $AmbientLight
@onready var room_lights: Array[OmniLight3D] = []

var current_time: float = 12.0
var ambient_color: Color = Color.WHITE

func _ready():
	setup_lighting()

func setup_lighting():
	# Setup sun light
	sun_light.light_energy = 1.0
	sun_light.shadow_enabled = true
	
	# Setup ambient light
	ambient_light.light_energy = 0.3
	ambient_light.light_color = Color(1.0, 0.9, 0.7)
	
	# Find all room lights
	find_room_lights()

func find_room_lights():
	room_lights.clear()
	for child in get_children():
		if child is OmniLight3D and child != ambient_light:
			room_lights.append(child)

func set_time_of_day(hour: float):
	current_time = hour
	update_lighting_for_time()

func update_lighting_for_time():
	# Calculate sun angle based on time
	var sun_angle = (current_time - 6.0) * 15.0  # 15 degrees per hour, sunrise at 6 AM
	sun_light.rotation_degrees.x = -sun_angle
	
	# Calculate sun intensity
	var sun_intensity = 0.0
	if current_time >= 6.0 and current_time <= 18.0:
		# Daytime
		var day_progress = (current_time - 6.0) / 12.0
		sun_intensity = sin(day_progress * PI)
	
	sun_light.light_energy = sun_intensity
	
	# Calculate sun color (warmer at sunrise/sunset)
	var sun_color = Color.WHITE
	if current_time < 8.0 or current_time > 16.0:
		sun_color = Color(1.0, 0.8, 0.6)  # Warm color
	
	sun_light.light_color = sun_color
	
	# Adjust room lights (turn on at night)
	var room_light_intensity = 0.0
	if current_time < 7.0 or current_time > 19.0:
		room_light_intensity = 1.0
	elif current_time < 8.0 or current_time > 18.0:
		# Transition period
		if current_time < 8.0:
			room_light_intensity = (8.0 - current_time) / 1.0
		else:
			room_light_intensity = (current_time - 18.0) / 1.0
	
	for light in room_lights:
		light.light_energy = room_light_intensity

func set_ambient_color(color: Color):
	ambient_color = color
	ambient_light.light_color = color

func set_lighting_mood(mood: String):
	match mood:
		"productive":
			set_ambient_color(Color(1.0, 1.0, 1.0))
			for light in room_lights:
				light.light_color = Color(1.0, 1.0, 1.0)
		
		"relaxed":
			set_ambient_color(Color(1.0, 0.9, 0.7))
			for light in room_lights:
				light.light_color = Color(1.0, 0.8, 0.6)
		
		"focused":
			set_ambient_color(Color(0.9, 0.95, 1.0))
			for light in room_lights:
				light.light_color = Color(0.9, 0.95, 1.0)
		
		"party":
			start_party_lighting()

func start_party_lighting():
	var colors = [
		Color.RED, Color.GREEN, Color.BLUE,
		Color.YELLOW, Color.MAGENTA, Color.CYAN
	]
	
	for light in room_lights:
		var tween = create_tween()
		tween.set_loops()
		tween.tween_method(
			func(color): light.light_color = color,
			light.light_color,
			colors[randi() % colors.size()],
			1.0
		)