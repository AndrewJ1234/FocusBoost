extends CharacterBody3D

@export var pet_type: String = "cat"
@export var movement_speed: float = 3.0
@export var wander_radius: float = 5.0

@onready var mesh_instance: MeshInstance3D = $MeshInstance3D
@onready var animation_player: AnimationPlayer = $AnimationPlayer
@onready var happiness_indicator: Node3D = $HappinessIndicator

var home_position: Vector3
var target_position: Vector3
var current_state: String = "idle"
var happiness: int = 100
var energy: int = 100

# AI behavior
var wander_timer: Timer
var interaction_timer: Timer

func _ready():
	setup_pet()
	setup_behavior_timers()
	home_position = global_position

func setup_pet():
	# Load pet-specific mesh and animations
	match pet_type:
		"cat":
			setup_cat()
		"dog":
			setup_dog()
		"bird":
			setup_bird()

func setup_cat():
	# Load cat mesh and animations
	var cat_mesh = preload("res://models/pets/cat.glb")
	# Setup cat-specific behavior

func setup_dog():
	# Load dog mesh and animations
	var dog_mesh = preload("res://models/pets/dog.glb")
	# Setup dog-specific behavior

func setup_bird():
	# Load bird mesh and animations
	var bird_mesh = preload("res://models/pets/bird.glb")
	# Setup bird-specific behavior

func setup_behavior_timers():
	# Wander timer
	wander_timer = Timer.new()
	wander_timer.wait_time = randf_range(3.0, 8.0)
	wander_timer.timeout.connect(_start_wandering)
	add_child(wander_timer)
	wander_timer.start()
	
	# Interaction timer
	interaction_timer = Timer.new()
	interaction_timer.wait_time = randf_range(10.0, 30.0)
	interaction_timer.timeout.connect(_random_interaction)
	add_child(interaction_timer)
	interaction_timer.start()

func _physics_process(delta):
	match current_state:
		"wandering":
			move_to_target(delta)
		"following":
			follow_player(delta)
		"idle":
			idle_behavior(delta)

func move_to_target(delta):
	var direction = (target_position - global_position).normalized()
	velocity = direction * movement_speed
	
	if global_position.distance_to(target_position) < 0.5:
		current_state = "idle"
		velocity = Vector3.ZERO
		animation_player.play("idle")
	else:
		animation_player.play("walk")
	
	move_and_slide()

func follow_player(delta):
	var player = get_tree().get_first_node_in_group("player")
	if player:
		var distance_to_player = global_position.distance_to(player.global_position)
		
		if distance_to_player > 3.0:
			target_position = player.global_position
			move_to_target(delta)
		else:
			current_state = "idle"

func idle_behavior(delta):
	# Random idle animations
	if randf() < 0.01:  # 1% chance per frame
		play_random_idle_animation()

func _start_wandering():
	if current_state == "idle":
		# Choose random position within wander radius
		var random_offset = Vector3(
			randf_range(-wander_radius, wander_radius),
			0,
			randf_range(-wander_radius, wander_radius)
		)
		target_position = home_position + random_offset
		current_state = "wandering"
	
	# Reset timer
	wander_timer.wait_time = randf_range(3.0, 8.0)
	wander_timer.start()

func _random_interaction():
	match pet_type:
		"cat":
			cat_interaction()
		"dog":
			dog_interaction()
		"bird":
			bird_interaction()
	
	# Reset timer
	interaction_timer.wait_time = randf_range(10.0, 30.0)
	interaction_timer.start()

func cat_interaction():
	var interactions = ["meow", "purr", "stretch", "groom"]
	var interaction = interactions[randi() % interactions.size()]
	
	match interaction:
		"meow":
			AudioManager.play_sfx("cat_meow")
			animation_player.play("meow")
		"purr":
			AudioManager.play_sfx("cat_purr")
		"stretch":
			animation_player.play("stretch")
		"groom":
			animation_player.play("groom")

func dog_interaction():
	var interactions = ["bark", "wag", "sit", "play"]
	var interaction = interactions[randi() % interactions.size()]
	
	match interaction:
		"bark":
			AudioManager.play_sfx("dog_bark")
			animation_player.play("bark")
		"wag":
			animation_player.play("wag_tail")
		"sit":
			animation_player.play("sit")
		"play":
			animation_player.play("play_bow")

func bird_interaction():
	var interactions = ["chirp", "fly", "preen", "sing"]
	var interaction = interactions[randi() % interactions.size()]
	
	match interaction:
		"chirp":
			AudioManager.play_sfx("bird_chirp")
		"fly":
			animation_player.play("fly_around")
		"preen":
			animation_player.play("preen")
		"sing":
			AudioManager.play_sfx("bird_song")
			animation_player.play("sing")

func play_random_idle_animation():
	var idle_animations = ["idle_1", "idle_2", "idle_3"]
	var animation = idle_animations[randi() % idle_animations.size()]
	animation_player.play(animation)

func interact():
	# Player interaction
	increase_happiness(10)
	increase_energy(-5)
	
	match pet_type:
		"cat":
			AudioManager.play_sfx("cat_purr")
			animation_player.play("happy")
		"dog":
			AudioManager.play_sfx("dog_happy")
			animation_player.play("excited")
		"bird":
			AudioManager.play_sfx("bird_happy")
			animation_player.play("flutter")
	
	# Show happiness effect
	show_happiness_effect()

func increase_happiness(amount: int):
	happiness = clamp(happiness + amount, 0, 100)
	update_happiness_indicator()
	
	if amount > 0:
		AudioManager.play_sfx("pet_happy")

func increase_energy(amount: int):
	energy = clamp(energy + amount, 0, 100)

func update_happiness_indicator():
	# Update visual happiness indicator
	if happiness_indicator:
		var scale = happiness / 100.0
		happiness_indicator.scale = Vector3.ONE * scale

func show_happiness_effect():
	# Create heart particles or similar effect
	var heart_effect = preload("res://effects/HeartParticles.tscn")
	var effect_instance = heart_effect.instantiate()
	add_child(effect_instance)
	
	# Remove effect after animation
	await get_tree().create_timer(2.0).timeout
	effect_instance.queue_free()

func set_follow_mode(follow: bool):
	if follow:
		current_state = "following"
	else:
		current_state = "idle"
		target_position = home_position

# Save/Load pet state
func get_pet_data() -> Dictionary:
	return {
		"type": pet_type,
		"happiness": happiness,
		"energy": energy,
		"position": global_position,
		"home_position": home_position
	}

func load_pet_data(data: Dictionary):
	pet_type = data.get("type", "cat")
	happiness = data.get("happiness", 100)
	energy = data.get("energy", 100)
	global_position = data.get("position", Vector3.ZERO)
	home_position = data.get("home_position", Vector3.ZERO)
	
	setup_pet()
	update_happiness_indicator()