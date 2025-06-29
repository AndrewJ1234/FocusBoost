extends Control

@onready var main_menu: Control = $MainMenu
@onready var customization_menu: Control = $CustomizationMenu
@onready var productivity_display: Control = $ProductivityDisplay
@onready var character_info: Control = $CharacterInfo
@onready var notification_system: Control = $NotificationSystem

var is_menu_visible: bool = false

func _ready():
	setup_ui()
	connect_signals()

func setup_ui():
	# Initially hide all menus
	main_menu.visible = false
	customization_menu.visible = false
	
	# Setup productivity display
	productivity_display.visible = true
	character_info.visible = true

func connect_signals():
	# Connect to GameManager signals
	GameManager.character_level_up.connect(_on_character_level_up)
	GameManager.experience_gained.connect(_on_experience_gained)
	GameManager.achievement_unlocked.connect(_on_achievement_unlocked)
	
	# Connect to WebSocket signals
	WebSocketManager.productivity_update.connect(_on_productivity_update)
	WebSocketManager.connection_status_changed.connect(_on_connection_status_changed)

func show_main_menu():
	main_menu.visible = true
	is_menu_visible = true

func hide_main_menu():
	main_menu.visible = false
	customization_menu.visible = false
	is_menu_visible = false

func show_customization_menu():
	customization_menu.visible = true

func hide_customization_menu():
	customization_menu.visible = false

func _on_character_level_up(new_level: int):
	show_notification("Level Up!", "You reached level " + str(new_level) + "!", "achievement")
	AudioManager.play_sfx("level_up")

func _on_experience_gained(amount: int):
	# Show floating experience text
	show_floating_text("+" + str(amount) + " XP", Color.YELLOW)

func _on_achievement_unlocked(achievement: Dictionary):
	var title = achievement.get("title", "Achievement Unlocked!")
	var description = achievement.get("description", "")
	show_notification(title, description, "achievement")
	AudioManager.play_sfx("achievement")

func _on_productivity_update(data: Dictionary):
	productivity_display.update_productivity_data(data)

func _on_connection_status_changed(connected: bool):
	if connected:
		show_notification("Connected", "WebSocket connection established", "info")
	else:
		show_notification("Disconnected", "Lost connection to server", "warning")

func show_notification(title: String, message: String, type: String = "info"):
	notification_system.show_notification(title, message, type)

func show_floating_text(text: String, color: Color):
	# Create floating text effect
	var floating_text = preload("res://ui/FloatingText.tscn")
	var text_instance = floating_text.instantiate()
	text_instance.setup(text, color)
	add_child(text_instance)

func update_character_info():
	character_info.update_display()