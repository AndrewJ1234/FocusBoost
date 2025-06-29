extends Control

@onready var notification_container: VBoxContainer = $NotificationContainer

var notification_scene = preload("res://ui/Notification.tscn")

func show_notification(title: String, message: String, type: String = "info"):
	var notification = notification_scene.instantiate()
	notification.setup(title, message, type)
	
	notification_container.add_child(notification)
	
	# Auto-remove after 5 seconds
	await get_tree().create_timer(5.0).timeout
	if notification and is_instance_valid(notification):
		notification.queue_free()