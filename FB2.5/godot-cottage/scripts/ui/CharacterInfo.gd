extends Control

@onready var level_label: Label = $VBoxContainer/Level
@onready var experience_bar: ProgressBar = $VBoxContainer/ExperienceBar
@onready var experience_label: Label = $VBoxContainer/ExperienceLabel

func _ready():
	update_display()

func update_display():
	var level = GameManager.get_character_level()
	var experience = GameManager.get_character_experience()
	var experience_progress = GameManager.get_experience_progress()
	
	level_label.text = "Level " + str(level)
	experience_bar.value = experience_progress * 100
	experience_label.text = str(experience) + " / " + str(GameManager.experience_to_next_level) + " XP"