extends Node3D

@onready var rain_particles: GPUParticles3D = $RainParticles
@onready var snow_particles: GPUParticles3D = $SnowParticles
@onready var storm_particles: GPUParticles3D = $StormParticles
@onready var weather_audio: AudioStreamPlayer3D = $WeatherAudio

var current_weather: String = "clear"

func _ready():
	setup_weather_systems()

func setup_weather_systems():
	# Setup rain particles
	rain_particles.emitting = false
	rain_particles.amount = 1000
	
	# Setup snow particles
	snow_particles.emitting = false
	snow_particles.amount = 500
	
	# Setup storm particles
	storm_particles.emitting = false
	storm_particles.amount = 2000

func set_weather(weather_type: String):
	if current_weather == weather_type:
		return
	
	# Stop current weather
	stop_all_weather()
	
	current_weather = weather_type
	
	match weather_type:
		"clear":
			set_clear_weather()
		"rain":
			set_rain_weather()
		"snow":
			set_snow_weather()
		"storm":
			set_storm_weather()

func stop_all_weather():
	rain_particles.emitting = false
	snow_particles.emitting = false
	storm_particles.emitting = false
	weather_audio.stop()

func set_clear_weather():
	# No particles, just ambient lighting
	AudioManager.stop_ambient()

func set_rain_weather():
	rain_particles.emitting = true
	AudioManager.play_ambient("rain", true)

func set_snow_weather():
	snow_particles.emitting = true
	# Snow is usually quiet, maybe just wind
	AudioManager.play_ambient("wind", true)

func set_storm_weather():
	storm_particles.emitting = true
	rain_particles.emitting = true
	AudioManager.play_ambient("rain", true)
	
	# Add lightning effects
	start_lightning_effects()

func start_lightning_effects():
	var lightning_timer = Timer.new()
	lightning_timer.wait_time = randf_range(3.0, 8.0)
	lightning_timer.timeout.connect(_flash_lightning)
	add_child(lightning_timer)
	lightning_timer.start()

func _flash_lightning():
	# Create lightning flash effect
	var flash_light = OmniLight3D.new()
	flash_light.light_energy = 5.0
	flash_light.light_color = Color.WHITE
	add_child(flash_light)
	
	# Flash duration
	await get_tree().create_timer(0.1).timeout
	flash_light.queue_free()
	
	# Schedule next lightning
	if current_weather == "storm":
		var timer = Timer.new()
		timer.wait_time = randf_range(3.0, 8.0)
		timer.timeout.connect(_flash_lightning)
		add_child(timer)
		timer.start()