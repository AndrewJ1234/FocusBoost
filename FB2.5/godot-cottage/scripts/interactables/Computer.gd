extends StaticBody3D

@onready var screen: MeshInstance3D = $Screen
@onready var interaction_area: Area3D = $InteractionArea

var is_player_nearby: bool = false
var screen_material: StandardMaterial3D

signal computer_interacted

func _ready():
	setup_computer()
	connect_signals()

func setup_computer():
	# Setup screen material
	screen_material = StandardMaterial3D.new()
	screen_material.albedo_color = Color.BLACK
	screen_material.emission_enabled = true
	screen_material.emission = Color(0.1, 0.1, 0.3)
	
	if screen:
		screen.set_surface_override_material(0, screen_material)

func connect_signals():
	interaction_area.body_entered.connect(_on_player_entered)
	interaction_area.body_exited.connect(_on_player_exited)
	
	# Connect to productivity updates
	WebSocketManager.productivity_update.connect(_on_productivity_update)
	WebSocketManager.session_complete.connect(_on_session_complete)

func _on_player_entered(body):
	if body.is_in_group("player"):
		is_player_nearby = true
		show_interaction_prompt()

func _on_player_exited(body):
	if body.is_in_group("player"):
		is_player_nearby = false
		hide_interaction_prompt()

func interact():
	if is_player_nearby:
		open_computer_interface()
		computer_interacted.emit()

func open_computer_interface():
	# Show computer screen UI
	var ui_manager = get_node("/root/Main/UIManager")
	ui_manager.show_computer_interface()

func _on_productivity_update(data: Dictionary):
	update_screen_display(data)

func _on_session_complete(data: Dictionary):
	show_session_complete_animation(data)

func update_screen_display(data: Dictionary):
	var productivity_score = data.get("productivity_score", 0)
	
	# Change screen color based on productivity
	if productivity_score > 80:
		screen_material.emission = Color(0.2, 0.8, 0.2)  # Green
	elif productivity_score > 60:
		screen_material.emission = Color(0.8, 0.8, 0.2)  # Yellow
	elif productivity_score > 40:
		screen_material.emission = Color(0.8, 0.5, 0.2)  # Orange
	else:
		screen_material.emission = Color(0.8, 0.2, 0.2)  # Red

func show_session_complete_animation(data: Dictionary):
	# Flash screen to indicate session completion
	var original_emission = screen_material.emission
	
	# Flash bright white
	screen_material.emission = Color.WHITE
	await get_tree().create_timer(0.2).timeout
	
	# Return to normal
	screen_material.emission = original_emission

func show_interaction_prompt():
	# Show "Press E to interact" prompt
	pass

func hide_interaction_prompt():
	# Hide interaction prompt
	pass