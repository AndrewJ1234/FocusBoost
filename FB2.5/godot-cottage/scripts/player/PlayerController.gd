extends CharacterBody3D

@export var movement_speed: float = 5.0
@export var jump_velocity: float = 4.5
@export var mouse_sensitivity: float = 0.002
@export var camera_max_angle: float = 75.0

@onready var camera_pivot: Node3D = $CameraPivot
@onready var camera: Camera3D = $CameraPivot/Camera3D
@onready var interaction_raycast: RayCast3D = $CameraPivot/Camera3D/InteractionRaycast
@onready var ui_manager: Control = get_node("/root/Main/UIManager")

var gravity = ProjectSettings.get_setting("physics/3d/default_gravity")
var is_menu_open: bool = false

func _ready():
	Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)

func _input(event):
	if event is InputEventMouseMotion and not is_menu_open:
		handle_mouse_look(event)
	
	if event.is_action_pressed("menu"):
		toggle_menu()
	
	if event.is_action_pressed("interact"):
		handle_interaction()

func handle_mouse_look(event: InputEventMouseMotion):
	# Horizontal rotation (Y-axis)
	rotate_y(-event.relative.x * mouse_sensitivity)
	
	# Vertical rotation (X-axis) - camera pivot
	camera_pivot.rotate_x(-event.relative.y * mouse_sensitivity)
	camera_pivot.rotation.x = clamp(
		camera_pivot.rotation.x,
		-deg_to_rad(camera_max_angle),
		deg_to_rad(camera_max_angle)
	)

func _physics_process(delta):
	if is_menu_open:
		return
	
	# Add gravity
	if not is_on_floor():
		velocity.y -= gravity * delta
	
	# Handle jump
	if Input.is_action_just_pressed("ui_accept") and is_on_floor():
		velocity.y = jump_velocity
	
	# Handle movement
	var input_dir = Vector2.ZERO
	if Input.is_action_pressed("move_forward"):
		input_dir.y -= 1
	if Input.is_action_pressed("move_backward"):
		input_dir.y += 1
	if Input.is_action_pressed("move_left"):
		input_dir.x -= 1
	if Input.is_action_pressed("move_right"):
		input_dir.x += 1
	
	if input_dir != Vector2.ZERO:
		var direction = (transform.basis * Vector3(input_dir.x, 0, input_dir.y)).normalized()
		velocity.x = direction.x * movement_speed
		velocity.z = direction.z * movement_speed
	else:
		velocity.x = move_toward(velocity.x, 0, movement_speed)
		velocity.z = move_toward(velocity.z, 0, movement_speed)
	
	move_and_slide()

func handle_interaction():
	if interaction_raycast.is_colliding():
		var collider = interaction_raycast.get_collider()
		if collider.has_method("interact"):
			collider.interact()

func toggle_menu():
	is_menu_open = !is_menu_open
	
	if is_menu_open:
		Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE)
		ui_manager.show_main_menu()
	else:
		Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)
		ui_manager.hide_main_menu()

func set_menu_state(open: bool):
	is_menu_open = open
	if open:
		Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE)
	else:
		Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)