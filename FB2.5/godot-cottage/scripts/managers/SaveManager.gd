extends Node

const SAVE_FILE_PATH = "user://cottage_save.dat"

func save_game(data: Dictionary) -> bool:
	var file = FileAccess.open(SAVE_FILE_PATH, FileAccess.WRITE)
	if file == null:
		print("Failed to open save file for writing")
		return false
	
	var json_string = JSON.stringify(data)
	file.store_string(json_string)
	file.close()
	
	print("Game saved successfully")
	return true

func load_game() -> Dictionary:
	if not FileAccess.file_exists(SAVE_FILE_PATH):
		print("Save file does not exist")
		return {}
	
	var file = FileAccess.open(SAVE_FILE_PATH, FileAccess.READ)
	if file == null:
		print("Failed to open save file for reading")
		return {}
	
	var json_string = file.get_as_text()
	file.close()
	
	var json = JSON.new()
	var parse_result = json.parse(json_string)
	
	if parse_result != OK:
		print("Failed to parse save file")
		return {}
	
	print("Game loaded successfully")
	return json.data

func delete_save() -> bool:
	if FileAccess.file_exists(SAVE_FILE_PATH):
		DirAccess.remove_absolute(SAVE_FILE_PATH)
		print("Save file deleted")
		return true
	return false