extends Control

@onready var current_session_label: Label = $VBoxContainer/CurrentSession
@onready var productivity_score_label: Label = $VBoxContainer/ProductivityScore
@onready var session_timer_label: Label = $VBoxContainer/SessionTimer
@onready var activity_type_label: Label = $VBoxContainer/ActivityType

var current_session_start: float = 0.0
var is_session_active: bool = false

func _ready():
	update_display()

func _process(delta):
	if is_session_active:
		update_session_timer()

func update_productivity_data(data: Dictionary):
	var productivity_score = data.get("productivity_score", 0)
	var activity_type = data.get("activity_type", "Unknown")
	var duration = data.get("duration", 0)
	
	productivity_score_label.text = "Productivity: " + str(productivity_score) + "%"
	activity_type_label.text = "Activity: " + activity_type
	
	# Start session timer if not already active
	if not is_session_active:
		start_session()
	
	# Update session display
	current_session_label.text = "Current Session: " + activity_type

func start_session():
	is_session_active = true
	current_session_start = Time.get_unix_time_from_system()

func stop_session():
	is_session_active = false

func update_session_timer():
	if is_session_active:
		var elapsed_time = Time.get_unix_time_from_system() - current_session_start
		var minutes = int(elapsed_time / 60)
		var seconds = int(elapsed_time) % 60
		session_timer_label.text = "Time: %02d:%02d" % [minutes, seconds]

func update_display():
	var current_session = GameManager.get_current_session()
	if current_session.has("activity_type"):
		current_session_label.text = "Current: " + current_session["activity_type"]
		productivity_score_label.text = "Score: " + str(current_session.get("productivity_score", 0)) + "%"
	else:
		current_session_label.text = "No active session"
		productivity_score_label.text = "Score: --"