extends Node

signal character_level_up(new_level: int)
signal experience_gained(amount: int)
signal room_unlocked(room_name: String)
signal achievement_unlocked(achievement: Dictionary)

# Character progression
var character_level: int = 1
var character_experience: int = 0
var experience_to_next_level: int = 100

# Room customization
var current_room_theme: String = "cozy"
var unlocked_furniture: Array[String] = ["basic_chair", "basic_desk", "basic_bed"]
var placed_furniture: Array[Dictionary] = []

# Pets
var owned_pets: Array[Dictionary] = []
var active_pet: Dictionary = {}

# Productivity tracking
var current_session: Dictionary = {}
var session_history: Array[Dictionary] = []
var daily_stats: Dictionary = {}

# Weather and environment
var current_weather: String = "clear"
var time_of_day: float = 12.0  # 24-hour format

# User data
var user_id: String = ""

func _ready():
	load_game_data()
	setup_daily_reset()

func setup_daily_reset():
	# Reset daily stats at midnight
	var timer = Timer.new()
	timer.wait_time = 3600.0  # Check every hour
	timer.timeout.connect(_check_daily_reset)
	add_child(timer)
	timer.start()

func _check_daily_reset():
	var current_date = Time.get_date_string_from_system()
	var last_reset_date = daily_stats.get("last_reset_date", "")
	
	if current_date != last_reset_date:
		reset_daily_stats()

func reset_daily_stats():
	daily_stats = {
		"last_reset_date": Time.get_date_string_from_system(),
		"productivity_sessions": 0,
		"study_sessions": 0,
		"habits_completed": 0,
		"total_focus_time": 0
	}
	save_game_data()

# Character progression methods
func update_character_productivity(productivity_score: int, activity_type: String, duration: int):
	var experience_gain = calculate_experience_gain(productivity_score, activity_type, duration)
	gain_experience(experience_gain)
	
	# Update current session
	current_session = {
		"activity_type": activity_type,
		"productivity_score": productivity_score,
		"duration": duration,
		"timestamp": Time.get_unix_time_from_system()
	}
	
	# Update daily stats
	daily_stats["productivity_sessions"] += 1
	daily_stats["total_focus_time"] += duration
	
	# Trigger room updates based on productivity
	update_room_atmosphere(productivity_score)

func calculate_experience_gain(productivity_score: int, activity_type: String, duration: int) -> int:
	var base_exp = duration / 60  # 1 exp per minute
	var productivity_multiplier = productivity_score / 100.0
	var activity_multiplier = get_activity_multiplier(activity_type)
	
	return int(base_exp * productivity_multiplier * activity_multiplier)

func get_activity_multiplier(activity_type: String) -> float:
	match activity_type:
		"deep_work": return 1.5
		"coding": return 1.4
		"studying": return 1.3
		"writing": return 1.2
		"reading": return 1.1
		_: return 1.0

func gain_experience(amount: int):
	character_experience += amount
	experience_gained.emit(amount)
	
	# Check for level up
	while character_experience >= experience_to_next_level:
		level_up()

func level_up():
	character_experience -= experience_to_next_level
	character_level += 1
	experience_to_next_level = int(experience_to_next_level * 1.2)  # Increase requirement
	
	character_level_up.emit(character_level)
	unlock_level_rewards()

func unlock_level_rewards():
	match character_level:
		5:
			unlock_furniture("comfortable_chair")
			unlock_pet("cat")
		10:
			unlock_furniture("gaming_setup")
			unlock_room_theme("modern")
		15:
			unlock_pet("dog")
			unlock_furniture("bookshelf")
		20:
			unlock_room_theme("nature")
			unlock_weather_control()

func unlock_furniture(furniture_name: String):
	if furniture_name not in unlocked_furniture:
		unlocked_furniture.append(furniture_name)
		achievement_unlocked.emit({
			"type": "furniture",
			"name": furniture_name,
			"title": "New Furniture Unlocked!",
			"description": "You can now place " + furniture_name + " in your room"
		})

func unlock_pet(pet_type: String):
	var pet_data = {
		"type": pet_type,
		"name": generate_pet_name(pet_type),
		"happiness": 100,
		"energy": 100,
		"unlocked_at": Time.get_unix_time_from_system()
	}
	owned_pets.append(pet_data)
	
	achievement_unlocked.emit({
		"type": "pet",
		"name": pet_type,
		"title": "New Pet Unlocked!",
		"description": "Meet your new " + pet_type + " companion!"
	})

func unlock_room_theme(theme_name: String):
	achievement_unlocked.emit({
		"type": "theme",
		"name": theme_name,
		"title": "New Room Theme Unlocked!",
		"description": "You can now use the " + theme_name + " theme"
	})

func unlock_weather_control():
	achievement_unlocked.emit({
		"type": "feature",
		"name": "weather_control",
		"title": "Weather Control Unlocked!",
		"description": "You can now change the weather in your cottage"
	})

func generate_pet_name(pet_type: String) -> String:
	var names = {
		"cat": ["Whiskers", "Luna", "Shadow", "Mittens", "Felix"],
		"dog": ["Buddy", "Max", "Bella", "Charlie", "Lucy"],
		"bird": ["Chirpy", "Sky", "Feather", "Sunny", "Echo"]
	}
	
	var pet_names = names.get(pet_type, ["Pet"])
	return pet_names[randi() % pet_names.size()]

# Study and flashcard methods
func update_study_progress(cards_studied: int, accuracy: int, duration: int):
	var study_exp = cards_studied * 2 + (accuracy / 10)
	gain_experience(study_exp)
	
	daily_stats["study_sessions"] += 1
	
	# Update pet happiness based on study performance
	if accuracy > 80:
		increase_pet_happiness(10)

# Habit completion
func complete_habit(habit_type: String, streak: int, points: int):
	gain_experience(points)
	daily_stats["habits_completed"] += 1
	
	# Streak bonuses
	if streak >= 7:
		gain_experience(50)  # Weekly streak bonus
	if streak >= 30:
		gain_experience(200)  # Monthly streak bonus

# Session completion
func complete_session(session_type: String, total_time: int, achievements: Array):
	session_history.append({
		"type": session_type,
		"duration": total_time,
		"achievements": achievements,
		"timestamp": Time.get_unix_time_from_system()
	})
	
	# Bonus experience for session completion
	var completion_bonus = total_time / 300  # 1 exp per 5 minutes
	gain_experience(completion_bonus)

# Room and environment methods
func update_room_atmosphere(productivity_score: int):
	# Change lighting based on productivity
	if productivity_score > 80:
		set_room_lighting("bright")
	elif productivity_score > 60:
		set_room_lighting("warm")
	else:
		set_room_lighting("dim")

func set_room_lighting(lighting_type: String):
	# This will be handled by the room controller
	pass

func change_weather(weather_type: String):
	if character_level >= 20:  # Weather control unlocked
		current_weather = weather_type
		# Trigger weather change in environment

func change_time_of_day(hour: float):
	time_of_day = clamp(hour, 0.0, 24.0)
	# Trigger time change in environment

# Pet management
func increase_pet_happiness(amount: int):
	if active_pet.has("happiness"):
		active_pet["happiness"] = min(100, active_pet["happiness"] + amount)

func set_active_pet(pet_index: int):
	if pet_index < owned_pets.size():
		active_pet = owned_pets[pet_index]

# Furniture placement
func place_furniture(furniture_type: String, position: Vector3, rotation: Vector3):
	if furniture_type in unlocked_furniture:
		var furniture_data = {
			"type": furniture_type,
			"position": position,
			"rotation": rotation,
			"placed_at": Time.get_unix_time_from_system()
		}
		placed_furniture.append(furniture_data)
		save_game_data()
		return true
	return false

func remove_furniture(index: int):
	if index < placed_furniture.size():
		placed_furniture.remove_at(index)
		save_game_data()

# Data persistence
func save_game_data():
	var save_data = {
		"character_level": character_level,
		"character_experience": character_experience,
		"experience_to_next_level": experience_to_next_level,
		"unlocked_furniture": unlocked_furniture,
		"placed_furniture": placed_furniture,
		"owned_pets": owned_pets,
		"active_pet": active_pet,
		"current_room_theme": current_room_theme,
		"session_history": session_history,
		"daily_stats": daily_stats,
		"current_weather": current_weather,
		"time_of_day": time_of_day
	}
	
	SaveManager.save_game(save_data)

func load_game_data():
	var save_data = SaveManager.load_game()
	if save_data:
		character_level = save_data.get("character_level", 1)
		character_experience = save_data.get("character_experience", 0)
		experience_to_next_level = save_data.get("experience_to_next_level", 100)
		unlocked_furniture = save_data.get("unlocked_furniture", ["basic_chair", "basic_desk", "basic_bed"])
		placed_furniture = save_data.get("placed_furniture", [])
		owned_pets = save_data.get("owned_pets", [])
		active_pet = save_data.get("active_pet", {})
		current_room_theme = save_data.get("current_room_theme", "cozy")
		session_history = save_data.get("session_history", [])
		daily_stats = save_data.get("daily_stats", {})
		current_weather = save_data.get("current_weather", "clear")
		time_of_day = save_data.get("time_of_day", 12.0)

# Getters
func get_user_id() -> String:
	return user_id

func get_character_level() -> int:
	return character_level

func get_character_experience() -> int:
	return character_experience

func get_experience_progress() -> float:
	return float(character_experience) / float(experience_to_next_level)

func get_unlocked_furniture() -> Array[String]:
	return unlocked_furniture

func get_placed_furniture() -> Array[Dictionary]:
	return placed_furniture

func get_owned_pets() -> Array[Dictionary]:
	return owned_pets

func get_current_session() -> Dictionary:
	return current_session

func get_session_history() -> Array[Dictionary]:
	return session_history

func get_daily_stats() -> Dictionary:
	return daily_stats