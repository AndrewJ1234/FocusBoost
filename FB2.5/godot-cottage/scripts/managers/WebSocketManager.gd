extends Node

signal productivity_update(data: Dictionary)
signal flashcard_update(data: Dictionary)
signal habit_update(data: Dictionary)
signal session_complete(data: Dictionary)
signal connection_status_changed(connected: bool)

var websocket: WebSocketPeer
var connection_url: String = "ws://localhost:3001"
var is_connected: bool = false
var reconnect_timer: Timer
var heartbeat_timer: Timer

# Message types
enum MessageType {
	PRODUCTIVITY_UPDATE,
	FLASHCARD_SESSION,
	HABIT_COMPLETION,
	SESSION_COMPLETE,
	HEARTBEAT,
	USER_AUTH
}

func _ready():
	setup_timers()
	connect_to_server()

func setup_timers():
	# Reconnection timer
	reconnect_timer = Timer.new()
	reconnect_timer.wait_time = 5.0
	reconnect_timer.timeout.connect(_attempt_reconnect)
	add_child(reconnect_timer)
	
	# Heartbeat timer
	heartbeat_timer = Timer.new()
	heartbeat_timer.wait_time = 30.0
	heartbeat_timer.timeout.connect(_send_heartbeat)
	add_child(heartbeat_timer)

func connect_to_server():
	websocket = WebSocketPeer.new()
	var error = websocket.connect_to_url(connection_url)
	
	if error != OK:
		print("Failed to connect to WebSocket server: ", error)
		_start_reconnect_timer()
	else:
		print("Attempting to connect to: ", connection_url)

func _process(_delta):
	if websocket:
		websocket.poll()
		var state = websocket.get_ready_state()
		
		match state:
			WebSocketPeer.STATE_OPEN:
				if not is_connected:
					_on_connection_established()
				_handle_incoming_messages()
			
			WebSocketPeer.STATE_CLOSED:
				if is_connected:
					_on_connection_lost()

func _on_connection_established():
	is_connected = true
	print("WebSocket connected successfully!")
	connection_status_changed.emit(true)
	heartbeat_timer.start()
	
	# Send authentication message
	send_message({
		"type": MessageType.USER_AUTH,
		"user_id": GameManager.get_user_id(),
		"timestamp": Time.get_unix_time_from_system()
	})

func _on_connection_lost():
	is_connected = false
	print("WebSocket connection lost")
	connection_status_changed.emit(false)
	heartbeat_timer.stop()
	_start_reconnect_timer()

func _handle_incoming_messages():
	while websocket.get_available_packet_count() > 0:
		var packet = websocket.get_packet()
		var message_text = packet.get_string_from_utf8()
		
		var json = JSON.new()
		var parse_result = json.parse(message_text)
		
		if parse_result != OK:
			print("Failed to parse WebSocket message: ", message_text)
			continue
		
		var message = json.data
		_process_message(message)

func _process_message(message: Dictionary):
	if not message.has("type"):
		print("Message missing type field: ", message)
		return
	
	var msg_type = message.get("type")
	var data = message.get("data", {})
	
	match msg_type:
		"productivity_update":
			productivity_update.emit(data)
			_handle_productivity_update(data)
		
		"flashcard_session":
			flashcard_update.emit(data)
			_handle_flashcard_session(data)
		
		"habit_completion":
			habit_update.emit(data)
			_handle_habit_completion(data)
		
		"session_complete":
			session_complete.emit(data)
			_handle_session_complete(data)
		
		_:
			print("Unknown message type: ", msg_type)

func _handle_productivity_update(data: Dictionary):
	print("Productivity update received: ", data)
	
	# Update character state based on productivity
	var productivity_score = data.get("productivity_score", 0)
	var activity_type = data.get("activity_type", "unknown")
	var duration = data.get("duration", 0)
	
	GameManager.update_character_productivity(productivity_score, activity_type, duration)

func _handle_flashcard_session(data: Dictionary):
	print("Flashcard session update: ", data)
	
	var cards_studied = data.get("cards_studied", 0)
	var accuracy = data.get("accuracy", 0)
	var session_duration = data.get("duration", 0)
	
	GameManager.update_study_progress(cards_studied, accuracy, session_duration)

func _handle_habit_completion(data: Dictionary):
	print("Habit completion: ", data)
	
	var habit_type = data.get("habit_type", "")
	var streak = data.get("streak", 0)
	var points = data.get("points", 0)
	
	GameManager.complete_habit(habit_type, streak, points)

func _handle_session_complete(data: Dictionary):
	print("Session complete: ", data)
	
	var session_type = data.get("session_type", "")
	var total_time = data.get("total_time", 0)
	var achievements = data.get("achievements", [])
	
	GameManager.complete_session(session_type, total_time, achievements)

func send_message(message: Dictionary):
	if not is_connected:
		print("Cannot send message: not connected")
		return false
	
	var json_string = JSON.stringify(message)
	var error = websocket.send_text(json_string)
	
	if error != OK:
		print("Failed to send WebSocket message: ", error)
		return false
	
	return true

func _send_heartbeat():
	send_message({
		"type": MessageType.HEARTBEAT,
		"timestamp": Time.get_unix_time_from_system()
	})

func _start_reconnect_timer():
	if not reconnect_timer.is_stopped():
		return
	
	print("Starting reconnection attempts...")
	reconnect_timer.start()

func _attempt_reconnect():
	print("Attempting to reconnect...")
	connect_to_server()

func _exit_tree():
	if websocket:
		websocket.close()