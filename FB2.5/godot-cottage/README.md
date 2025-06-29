# FocusBoost Virtual Cottage

A 3D virtual cottage application built with Godot 4 that responds to your productivity habits in real-time through WebSocket integration.

## Features

### 🏠 **Virtual Environment**
- **Customizable 3D Room**: Change wall colors, flooring, lighting, and furniture placement
- **Dynamic Weather System**: Rain, snow, clear skies, and storms with particle effects
- **Day/Night Cycle**: Realistic lighting that changes based on time of day
- **Multiple Room Themes**: Cozy, Modern, Nature, and Cyberpunk themes

### 👤 **Character Progression**
- **Level-Based Progression**: Gain experience through productive activities
- **Habit Tracking Integration**: Level up based on good habits tracked externally
- **Achievement System**: Unlock new furniture, pets, and room features
- **Visual Character Growth**: Avatar customization and progression rewards

### 🐾 **Pet Companions**
- **Multiple Pet Types**: Cats, dogs, and birds with unique behaviors
- **AI-Driven Behavior**: Pets wander, interact, and respond to your productivity
- **Pet Care System**: Happiness and energy levels that respond to your habits
- **Interactive Companions**: Pet your companions and watch them react

### 💻 **Productivity Integration**
- **Real-Time WebSocket Connection**: Receives live productivity data
- **In-Game Computer Screen**: Displays current and past productivity sessions
- **Session Visualization**: Visual feedback on your work patterns
- **Productivity-Responsive Environment**: Room atmosphere changes based on your focus

### 🎮 **Interactive Features**
- **First-Person Exploration**: Move around your cottage with smooth controls
- **Furniture Placement**: Drag and drop furniture to customize your space
- **Weather Control**: Change weather conditions (unlocked through progression)
- **Time Control**: Adjust time of day to match your preferences

## Technical Architecture

### **WebSocket Integration**
```gdscript
# Connects to your productivity tracking backend
WebSocketManager.connect_to_server("ws://localhost:3001")

# Receives real-time updates
- Productivity scores and activity types
- Flashcard study sessions
- Habit completions
- Session achievements
```

### **Modular Design**
- **GameManager**: Central state management and progression logic
- **WebSocketManager**: Real-time communication with external systems
- **AudioManager**: Dynamic audio and ambient sound system
- **SaveManager**: Persistent data storage for user progress

### **Performance Optimized**
- **Efficient Particle Systems**: Weather effects with minimal performance impact
- **LOD System**: Optimized rendering for smooth gameplay
- **Smart Caching**: Efficient asset loading and memory management

## Getting Started

### **Prerequisites**
- Godot 4.2 or later
- WebSocket server running (connects to FocusBoost backend)

### **Installation**
1. Clone the repository
2. Open the project in Godot 4
3. Configure WebSocket connection URL in `WebSocketManager.gd`
4. Run the project

### **WebSocket Data Format**
The application expects JSON messages in this format:

```json
{
  "type": "productivity_update",
  "data": {
    "productivity_score": 85,
    "activity_type": "coding",
    "duration": 1800,
    "timestamp": 1640995200
  }
}
```

### **Supported Message Types**
- `productivity_update`: Real-time productivity scoring
- `flashcard_session`: Study session data
- `habit_completion`: Habit tracking updates
- `session_complete`: Completed work session data

## Customization

### **Adding New Furniture**
1. Create 3D model in Blender or similar
2. Export as `.glb` file
3. Add to `furniture_prefabs` dictionary in `RoomController.gd`
4. Configure unlock conditions in `GameManager.gd`

### **Creating New Pet Types**
1. Design pet model with animations
2. Extend `PetController.gd` with new pet behaviors
3. Add pet-specific interactions and sounds
4. Configure unlock requirements

### **Weather Effects**
1. Create particle systems in Godot
2. Add to `WeatherSystem.gd`
3. Configure audio and visual effects
4. Set unlock conditions based on user level

## Integration with FocusBoost Backend

The cottage connects to the FocusBoost productivity tracking system:

```javascript
// Backend sends productivity updates
websocket.send(JSON.stringify({
  type: "productivity_update",
  data: {
    productivity_score: userScore,
    activity_type: currentActivity,
    duration: sessionLength
  }
}));
```

### **Real-Time Features**
- **Live Activity Tracking**: See your current work session reflected in the cottage
- **Productivity Visualization**: Room lighting and atmosphere change based on focus
- **Achievement Notifications**: Instant feedback for reaching productivity goals
- **Session History**: Review past work sessions on the in-game computer

## Export and Deployment

### **Web Export**
```bash
# Export for web deployment
godot --headless --export-release "Web" build/index.html
```

### **Desktop Export**
```bash
# Export for Windows
godot --headless --export-release "Windows Desktop" build/cottage.exe

# Export for macOS
godot --headless --export-release "macOS" build/cottage.app

# Export for Linux
godot --headless --export-release "Linux/X11" build/cottage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Virtual Cottage and similar cozy productivity applications
- Built with Godot 4 game engine
- Integrates with the FocusBoost productivity ecosystem