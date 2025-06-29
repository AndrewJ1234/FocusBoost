extends Node

var music_player: AudioStreamPlayer
var sfx_player: AudioStreamPlayer
var ambient_player: AudioStreamPlayer

var music_volume: float = 0.7
var sfx_volume: float = 0.8
var ambient_volume: float = 0.5

# Audio resources
var music_tracks: Dictionary = {}
var sfx_sounds: Dictionary = {}
var ambient_sounds: Dictionary = {}

func _ready():
	setup_audio_players()
	load_audio_resources()

func setup_audio_players():
	# Music player
	music_player = AudioStreamPlayer.new()
	music_player.bus = "Music"
	add_child(music_player)
	
	# SFX player
	sfx_player = AudioStreamPlayer.new()
	sfx_player.bus = "SFX"
	add_child(sfx_player)
	
	# Ambient player
	ambient_player = AudioStreamPlayer.new()
	ambient_player.bus = "Ambient"
	add_child(ambient_player)

func load_audio_resources():
	# Load music tracks
	music_tracks = {
		"cottage_theme": preload("res://audio/music/cottage_theme.ogg"),
		"productive": preload("res://audio/music/productive.ogg"),
		"relaxed": preload("res://audio/music/relaxed.ogg"),
		"study": preload("res://audio/music/study.ogg")
	}
	
	# Load SFX
	sfx_sounds = {
		"level_up": preload("res://audio/sfx/level_up.ogg"),
		"achievement": preload("res://audio/sfx/achievement.ogg"),
		"furniture_place": preload("res://audio/sfx/furniture_place.ogg"),
		"pet_happy": preload("res://audio/sfx/pet_happy.ogg"),
		"notification": preload("res://audio/sfx/notification.ogg")
	}
	
	# Load ambient sounds
	ambient_sounds = {
		"rain": preload("res://audio/ambient/rain.ogg"),
		"fireplace": preload("res://audio/ambient/fireplace.ogg"),
		"birds": preload("res://audio/ambient/birds.ogg"),
		"wind": preload("res://audio/ambient/wind.ogg")
	}

func play_music(track_name: String, fade_in: bool = true):
	if track_name in music_tracks:
		if fade_in and music_player.playing:
			fade_out_music()
			await get_tree().create_timer(1.0).timeout
		
		music_player.stream = music_tracks[track_name]
		music_player.volume_db = linear_to_db(music_volume)
		music_player.play()

func play_sfx(sound_name: String):
	if sound_name in sfx_sounds:
		sfx_player.stream = sfx_sounds[sound_name]
		sfx_player.volume_db = linear_to_db(sfx_volume)
		sfx_player.play()

func play_ambient(sound_name: String, loop: bool = true):
	if sound_name in ambient_sounds:
		ambient_player.stream = ambient_sounds[sound_name]
		ambient_player.volume_db = linear_to_db(ambient_volume)
		if loop:
			ambient_player.stream.loop = true
		ambient_player.play()

func stop_ambient():
	ambient_player.stop()

func fade_out_music():
	var tween = create_tween()
	tween.tween_property(music_player, "volume_db", -80, 1.0)
	await tween.finished
	music_player.stop()

func set_music_volume(volume: float):
	music_volume = clamp(volume, 0.0, 1.0)
	music_player.volume_db = linear_to_db(music_volume)

func set_sfx_volume(volume: float):
	sfx_volume = clamp(volume, 0.0, 1.0)

func set_ambient_volume(volume: float):
	ambient_volume = clamp(volume, 0.0, 1.0)
	ambient_player.volume_db = linear_to_db(ambient_volume)