import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, VolumeX, Settings, User, Home, ShoppingBag, 
  Play, Pause, SkipForward, SkipBack, Heart, Star, 
  Coffee, Book, Moon, Sun, Cloud, X, Check
} from 'lucide-react';

// Types
interface Avatar {
  id: string;
  name: string;
  level: number;
  mood: 'chill' | 'focused' | 'sleepy' | 'energetic' | 'cozy';
  outfit: string;
  position: { x: number; y: number };
  activity: 'reading' | 'coffee' | 'music' | 'sleeping' | 'working';
}

interface RoomState {
  lighting: 'warm' | 'cool' | 'sunset' | 'dawn' | 'night';
  weather: 'clear' | 'rain' | 'snow' | 'clouds';
  furniture: string[];
  plants: string[];
  decorations: string[];
  pets: string[];
}

interface MusicState {
  isPlaying: boolean;
  currentTrack: string;
  volume: number;
  playlist: string[];
}

// Chill Corner Main Component
const ChillCornerGame: React.FC = () => {
  // Game State
  const [avatar, setAvatar] = useState<Avatar>({
    id: 'player',
    name: 'You',
    level: 1,
    mood: 'chill',
    outfit: 'casual',
    position: { x: 50, y: 60 },
    activity: 'music'
  });

  const [room, setRoom] = useState<RoomState>({
    lighting: 'warm',
    weather: 'clear',
    furniture: ['bed', 'desk', 'chair', 'bookshelf'],
    plants: ['small-plant', 'hanging-plant'],
    decorations: ['poster', 'lamp'],
    pets: ['cat']
  });

  const [music, setMusic] = useState<MusicState>({
    isPlaying: true,
    currentTrack: 'Lo-fi Hip Hop Mix',
    volume: 0.7,
    playlist: ['Lo-fi Hip Hop Mix', 'Rainy Day Jazz', 'Study Beats', 'Chill Synthwave']
  });

  // UI State
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('afternoon');

  // Refs for animations
  const roomRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Time simulation
  useEffect(() => {
    const timer = setInterval(() => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 12) setTimeOfDay('morning');
      else if (hour >= 12 && hour < 18) setTimeOfDay('afternoon');
      else if (hour >= 18 && hour < 22) setTimeOfDay('evening');
      else setTimeOfDay('night');
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Dynamic lighting based on time
  const getLightingStyle = () => {
    const base = {
      transition: 'all 2s ease-in-out',
    };

    switch (timeOfDay) {
      case 'morning':
        return { ...base, filter: 'brightness(1.1) contrast(1.05) hue-rotate(10deg)' };
      case 'afternoon':
        return { ...base, filter: 'brightness(1) contrast(1)' };
      case 'evening':
        return { ...base, filter: 'brightness(0.9) contrast(1.1) hue-rotate(-10deg) sepia(0.1)' };
      case 'night':
        return { ...base, filter: 'brightness(0.7) contrast(1.2) hue-rotate(-20deg) sepia(0.2)' };
      default:
        return base;
    }
  };

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 3000);
  };

  const handleAvatarClick = (activity: Avatar['activity']) => {
    setAvatar(prev => ({ ...prev, activity }));
    addNotification(`Started ${activity}!`);
  };

  const toggleMusic = () => {
    setMusic(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const changeTrack = (direction: 'next' | 'prev') => {
    const currentIndex = music.playlist.indexOf(music.currentTrack);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % music.playlist.length;
    } else {
      newIndex = currentIndex === 0 ? music.playlist.length - 1 : currentIndex - 1;
    }
    
    setMusic(prev => ({ 
      ...prev, 
      currentTrack: prev.playlist[newIndex],
      isPlaying: true 
    }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Atmospheric Background */}
      <div className="absolute inset-0">
        {/* Animated gradient overlay */}
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(236, 72, 153, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)
            `,
            animation: 'float 20s ease-in-out infinite'
          }}
        />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Room View */}
      <div 
        ref={roomRef}
        className="relative h-screen flex items-center justify-center p-8"
        style={getLightingStyle()}
      >
        {/* Room Container */}
        <div className="relative w-full max-w-6xl aspect-video bg-gradient-to-b from-pink-200/20 to-purple-300/20 rounded-3xl backdrop-blur-sm border border-white/10 overflow-hidden shadow-2xl">
          
          {/* Room Background with Perspective */}
          <div className="absolute inset-0 bg-gradient-to-b from-orange-100/30 to-pink-200/30 rounded-3xl">
            
            {/* Floor */}
            <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-amber-900/40 to-transparent rounded-b-3xl" />
            
            {/* Back Wall */}
            <div className="absolute top-0 w-full h-2/3 bg-gradient-to-b from-sky-200/20 to-transparent" />

            {/* Window with dynamic lighting */}
            <div className="absolute top-8 right-12 w-32 h-24 bg-gradient-to-b from-sky-300/60 to-blue-400/40 rounded-lg border-4 border-amber-800/50 overflow-hidden shadow-xl">
              <div className="absolute inset-2 bg-gradient-to-b from-sky-100/80 to-sky-300/60 rounded">
                {/* Window frame */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-2">
                  <div className="border border-amber-800/30"></div>
                  <div className="border border-amber-800/30"></div>
                  <div className="border border-amber-800/30"></div>
                  <div className="border border-amber-800/30"></div>
                </div>
                
                {/* Weather effects */}
                {room.weather === 'rain' && (
                  <div className="absolute inset-0">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-0.5 h-4 bg-blue-400/60"
                        style={{
                          left: `${Math.random() * 100}%`,
                          animation: `rain 1s linear infinite`,
                          animationDelay: `${Math.random()}s`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Furniture with soft shadows */}
            
            {/* Bed */}
            {room.furniture.includes('bed') && (
              <div className="absolute bottom-16 left-8 w-28 h-16 transform perspective-1000 rotate-x-45">
                <div className="w-full h-full bg-gradient-to-br from-pink-300/80 to-pink-400/60 rounded-lg shadow-lg">
                  <div className="absolute inset-2 bg-white/40 rounded"></div>
                  <div className="absolute top-1 left-2 w-6 h-4 bg-pink-200/60 rounded"></div>
                </div>
              </div>
            )}

            {/* Desk with computer */}
            {room.furniture.includes('desk') && (
              <div className="absolute bottom-20 right-24 w-32 h-20">
                {/* Desk surface */}
                <div className="w-full h-12 bg-gradient-to-br from-amber-600/80 to-amber-800/60 rounded-lg shadow-xl">
                  <div className="absolute inset-1 bg-amber-500/40 rounded-md"></div>
                </div>
                
                {/* Computer setup */}
                <div className="absolute top-[-2rem] left-8 w-16 h-12 bg-gray-800/90 rounded border border-gray-600/50">
                  <div className="absolute inset-1 bg-gradient-to-b from-blue-400/80 to-purple-500/60 rounded overflow-hidden">
                    {/* Screen content */}
                    <div className="absolute top-1 left-1 text-[4px] text-white/80">
                      <div className="mb-0.5 w-8 h-0.5 bg-green-400/60 rounded"></div>
                      <div className="mb-0.5 w-6 h-0.5 bg-blue-400/60 rounded"></div>
                      <div className="mb-0.5 w-7 h-0.5 bg-yellow-400/60 rounded"></div>
                    </div>
                  </div>
                </div>
                
                {/* Keyboard */}
                <div className="absolute top-4 left-4 w-12 h-4 bg-gray-700/80 rounded-sm shadow-md">
                  <div className="absolute inset-0.5 bg-gray-600/60 rounded-sm"></div>
                </div>
              </div>
            )}

            {/* Bookshelf */}
            {room.furniture.includes('bookshelf') && (
              <div className="absolute bottom-12 left-32 w-12 h-20 bg-gradient-to-b from-amber-700/80 to-amber-900/60 rounded shadow-xl">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-10 h-2 rounded-sm shadow-sm`}
                    style={{
                      top: `${4 + i * 2.5}px`,
                      left: '4px',
                      backgroundColor: [
                        'rgba(220, 38, 38, 0.8)',
                        'rgba(37, 99, 235, 0.8)',
                        'rgba(22, 163, 74, 0.8)',
                        'rgba(147, 51, 234, 0.8)',
                        'rgba(234, 88, 12, 0.8)',
                        'rgba(8, 145, 178, 0.8)'
                      ][i]
                    }}
                  />
                ))}
              </div>
            )}

            {/* Plants */}
            {room.plants.includes('small-plant') && (
              <div className="absolute bottom-16 right-12 flex flex-col items-center">
                <div className="w-8 h-12 relative">
                  <div className="absolute bottom-0 w-8 h-3 bg-amber-800/80 rounded-full shadow-lg"></div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-10 bg-green-500/80 rounded-t-full">
                    <div className="absolute -top-1 -left-1 w-3 h-6 bg-green-400/70 rounded-full transform -rotate-12"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-6 bg-green-400/70 rounded-full transform rotate-12"></div>
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-green-600/80 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Lamp */}
            {room.decorations.includes('lamp') && (
              <div className="absolute bottom-18 left-16 flex flex-col items-center">
                <div className="relative">
                  <div className="w-12 h-8 bg-gradient-to-b from-yellow-200/90 to-yellow-300/70 rounded-t-full border-2 border-yellow-600/50 shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-yellow-100/50 to-yellow-400/30"></div>
                  </div>
                  <div className="w-2 h-8 bg-amber-700/80 mx-auto shadow-sm"></div>
                  <div className="w-8 h-2 bg-amber-800/80 rounded shadow-md"></div>
                  
                  {/* Light glow effect */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-yellow-300/30 rounded-full blur-md"></div>
                </div>
              </div>
            )}

            {/* Avatar */}
            <div 
              className="absolute transition-all duration-1000 ease-in-out cursor-pointer group"
              style={{
                left: `${avatar.position.x}%`,
                bottom: `${avatar.position.y}%`,
                transform: 'translate(-50%, 0)'
              }}
              onClick={() => handleAvatarClick('music')}
            >
              <div className="relative">
                {/* Avatar body */}
                <div className="w-16 h-20 relative">
                  {/* Shadow */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-3 bg-black/20 rounded-full blur-sm"></div>
                  
                  {/* Character */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                    {/* Body */}
                    <div className="w-8 h-12 bg-gradient-to-b from-blue-400/90 to-blue-600/80 rounded-full relative">
                      {/* Arms */}
                      <div className="absolute top-3 -left-2 w-3 h-6 bg-blue-400/80 rounded-full transform -rotate-12"></div>
                      <div className="absolute top-3 -right-2 w-3 h-6 bg-blue-400/80 rounded-full transform rotate-12"></div>
                      
                      {/* Head */}
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-b from-peach-200 to-peach-300 rounded-full">
                        {/* Eyes */}
                        <div className="absolute top-1.5 left-1 w-1 h-1 bg-black rounded-full"></div>
                        <div className="absolute top-1.5 right-1 w-1 h-1 bg-black rounded-full"></div>
                        
                        {/* Mouth based on activity */}
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-pink-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity indicator */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white/90 px-2 py-1 rounded-full text-xs font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  {avatar.activity === 'music' && '🎵'}
                  {avatar.activity === 'reading' && '📖'}
                  {avatar.activity === 'coffee' && '☕'}
                  {avatar.activity === 'working' && '💻'}
                  {avatar.activity === 'sleeping' && '😴'}
                </div>

                {/* Mood glow */}
                <div 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-8 rounded-full blur-lg opacity-50"
                  style={{
                    backgroundColor: {
                      'chill': '#8b5cf6',
                      'focused': '#3b82f6',
                      'sleepy': '#ec4899',
                      'energetic': '#f59e0b',
                      'cozy': '#ef4444'
                    }[avatar.mood]
                  }}
                ></div>
              </div>
            </div>

            {/* Pet */}
            {room.pets.includes('cat') && (
              <div 
                className="absolute bottom-14 left-24 cursor-pointer hover:scale-110 transition-transform"
                onClick={() => addNotification('Cat purrs softly 🐱')}
              >
                <div className="relative animate-pulse">
                  <div className="w-6 h-4 bg-gradient-to-b from-gray-400/90 to-gray-600/80 rounded-full shadow-lg">
                    {/* Cat ears */}
                    <div className="absolute -top-1 left-1 w-1.5 h-2 bg-gray-500/80 rounded-t-full"></div>
                    <div className="absolute -top-1 right-1 w-1.5 h-2 bg-gray-500/80 rounded-t-full"></div>
                    
                    {/* Eyes */}
                    <div className="absolute top-1 left-1.5 w-1 h-1 bg-green-400/90 rounded-full"></div>
                    <div className="absolute top-1 right-1.5 w-1 h-1 bg-green-400/90 rounded-full"></div>
                    
                    {/* Tail */}
                    <div className="absolute -right-2 top-1 w-3 h-1 bg-gray-500/80 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Bar */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-auto">
          {/* Game Title */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20">
            <h1 className="text-2xl font-bold text-white">Chill Corner</h1>
            <p className="text-white/70 text-sm">Level {avatar.level} • {avatar.mood} mood</p>
          </div>

          {/* Weather & Time */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/20 text-center">
            <div className="text-white text-lg mb-1">
              {timeOfDay === 'morning' && '🌅'}
              {timeOfDay === 'afternoon' && '☀️'}
              {timeOfDay === 'evening' && '🌇'}
              {timeOfDay === 'night' && '🌙'}
            </div>
            <p className="text-white/70 text-xs capitalize">{timeOfDay}</p>
          </div>
        </div>

        {/* Music Player */}
        <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 pointer-events-auto">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => changeTrack('prev')}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <SkipBack className="w-4 h-4 text-white" />
            </button>
            
            <button 
              onClick={toggleMusic}
              className="p-3 rounded-full bg-purple-500/80 hover:bg-purple-600/80 transition-colors"
            >
              {music.isPlaying ? 
                <Pause className="w-5 h-5 text-white" /> : 
                <Play className="w-5 h-5 text-white" />
              }
            </button>
            
            <button 
              onClick={() => changeTrack('next')}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <SkipForward className="w-4 h-4 text-white" />
            </button>
            
            <div className="ml-2">
              <p className="text-white font-medium text-sm">{music.currentTrack}</p>
              <div className="w-32 h-1 bg-white/20 rounded-full mt-1">
                <div className="w-1/3 h-full bg-purple-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-3 pointer-events-auto">
          <button 
            onClick={() => setActiveModal('character')}
            className="p-4 rounded-full bg-pink-500/80 hover:bg-pink-600/80 transition-all hover:scale-110 shadow-lg"
            title="Customize Character"
          >
            <User className="w-6 h-6 text-white" />
          </button>
          
          <button 
            onClick={() => setActiveModal('room')}
            className="p-4 rounded-full bg-blue-500/80 hover:bg-blue-600/80 transition-all hover:scale-110 shadow-lg"
            title="Decorate Room"
          >
            <Home className="w-6 h-6 text-white" />
          </button>
          
          <button 
            onClick={() => setActiveModal('shop')}
            className="p-4 rounded-full bg-green-500/80 hover:bg-green-600/80 transition-all hover:scale-110 shadow-lg"
            title="Shop"
          >
            <ShoppingBag className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Notifications */}
        <div className="absolute top-24 right-6 space-y-2 pointer-events-auto">
          {notifications.map((notification, index) => (
            <div 
              key={index}
              className="bg-green-500/90 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce"
            >
              {notification}
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'character' && (
        <CharacterModal 
          avatar={avatar} 
          onClose={() => setActiveModal(null)}
          onUpdate={setAvatar}
        />
      )}

      {activeModal === 'room' && (
        <RoomModal 
          room={room} 
          onClose={() => setActiveModal(null)}
          onUpdate={setRoom}
        />
      )}

      {activeModal === 'shop' && (
        <ShopModal 
          onClose={() => setActiveModal(null)}
          onPurchase={(item) => addNotification(`Purchased ${item}!`)}
        />
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        
        @keyframes rain {
          0% { transform: translateY(-100px); opacity: 1; }
          100% { transform: translateY(100px); opacity: 0; }
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .rotate-x-45 {
          transform: rotateX(45deg);
        }
      `}</style>
    </div>
  );
};

// Character Customization Modal
const CharacterModal: React.FC<{
  avatar: Avatar;
  onClose: () => void;
  onUpdate: (avatar: Avatar) => void;
}> = ({ avatar, onClose, onUpdate }) => {
  const [tempAvatar, setTempAvatar] = useState(avatar);

  const moods = ['chill', 'focused', 'sleepy', 'energetic', 'cozy'] as const;
  const outfits = ['casual', 'comfy', 'stylish', 'cozy', 'sporty'];

  const handleSave = () => {
    onUpdate(tempAvatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full mx-4 border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Character</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Avatar Preview */}
        <div className="flex justify-center mb-8 p-8 bg-white/5 rounded-2xl">
          <div className="w-20 h-24 relative">
            <div className="w-12 h-16 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full mx-auto relative">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-b from-orange-200 to-orange-300 rounded-full">
                <div className="absolute top-2 left-1.5 w-1.5 h-1.5 bg-black rounded-full"></div>
                <div className="absolute top-2 right-1.5 w-1.5 h-1.5 bg-black rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mood Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Mood</h3>
          <div className="grid grid-cols-3 gap-2">
            {moods.map((mood) => (
              <button
                key={mood}
                className={`p-3 rounded-xl text-sm font-medium transition-all ${
                  tempAvatar.mood === mood
                    ? 'bg-purple-500/80 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                onClick={() => setTempAvatar(prev => ({ ...prev, mood }))}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Outfit Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-3">Outfit</h3>
          <div className="grid grid-cols-2 gap-2">
            {outfits.map((outfit) => (
              <button
                key={outfit}
                className={`p-3 rounded-xl text-sm font-medium transition-all ${
                  tempAvatar.outfit === outfit
                    ? 'bg-pink-500/80 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                onClick={() => setTempAvatar(prev => ({ ...prev, outfit }))}
              >
                {outfit}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

// Room Customization Modal
const RoomModal: React.FC<{
  room: RoomState;
  onClose: () => void;
  onUpdate: (room: RoomState) => void;
}> = ({ room, onClose, onUpdate }) => {
  const [tempRoom, setTempRoom] = useState(room);

  const lightingOptions = ['warm', 'cool', 'sunset', 'dawn', 'night'] as const;
  const weatherOptions = ['clear', 'rain', 'snow', 'clouds'] as const;
  
  const furnitureItems = [
    { id: 'bed', name: 'Cozy Bed', icon: '🛏️' },
    { id: 'desk', name: 'Work Desk', icon: '🪑' },
    { id: 'bookshelf', name: 'Bookshelf', icon: '📚' },
    { id: 'sofa', name: 'Comfy Sofa', icon: '🛋️' },
    { id: 'tv', name: 'TV Stand', icon: '📺' },
    { id: 'piano', name: 'Piano', icon: '🎹' }
  ];

  const plantItems = [
    { id: 'small-plant', name: 'Small Plant', icon: '🪴' },
    { id: 'hanging-plant', name: 'Hanging Plant', icon: '🌿' },
    { id: 'big-plant', name: 'Large Plant', icon: '🌳' },
    { id: 'succulent', name: 'Succulent', icon: '🌵' }
  ];

  const decorationItems = [
    { id: 'lamp', name: 'Warm Lamp', icon: '💡' },
    { id: 'poster', name: 'Art Poster', icon: '🖼️' },
    { id: 'mirror', name: 'Mirror', icon: '🪞' },
    { id: 'clock', name: 'Wall Clock', icon: '🕐' }
  ];

  const toggleItem = (category: keyof RoomState, itemId: string) => {
    setTempRoom(prev => ({
      ...prev,
      [category]: Array.isArray(prev[category])
        ? (prev[category] as string[]).includes(itemId)
          ? (prev[category] as string[]).filter(id => id !== itemId)
          : [...(prev[category] as string[]), itemId]
        : prev[category]
    }));
  };

  const handleSave = () => {
    onUpdate(tempRoom);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Room Designer</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Lighting */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Lighting</h3>
          <div className="grid grid-cols-3 gap-2">
            {lightingOptions.map((lighting) => (
              <button
                key={lighting}
                className={`p-3 rounded-xl text-sm font-medium transition-all ${
                  tempRoom.lighting === lighting
                    ? 'bg-yellow-500/80 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                onClick={() => setTempRoom(prev => ({ ...prev, lighting }))}
              >
                {lighting}
              </button>
            ))}
          </div>
        </div>

        {/* Weather */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Weather</h3>
          <div className="grid grid-cols-4 gap-2">
            {weatherOptions.map((weather) => (
              <button
                key={weather}
                className={`p-3 rounded-xl text-sm font-medium transition-all ${
                  tempRoom.weather === weather
                    ? 'bg-blue-500/80 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                onClick={() => setTempRoom(prev => ({ ...prev, weather }))}
              >
                {weather}
              </button>
            ))}
          </div>
        </div>

        {/* Furniture */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Furniture</h3>
          <div className="grid grid-cols-2 gap-2">
            {furnitureItems.map((item) => (
              <button
                key={item.id}
                className={`p-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  tempRoom.furniture.includes(item.id)
                    ? 'bg-green-500/80 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                onClick={() => toggleItem('furniture', item.id)}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
                {tempRoom.furniture.includes(item.id) && <Check className="w-4 h-4 ml-auto" />}
              </button>
            ))}
          </div>
        </div>

        {/* Plants */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Plants</h3>
          <div className="grid grid-cols-2 gap-2">
            {plantItems.map((item) => (
              <button
                key={item.id}
                className={`p-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  tempRoom.plants.includes(item.id)
                    ? 'bg-green-500/80 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                onClick={() => toggleItem('plants', item.id)}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
                {tempRoom.plants.includes(item.id) && <Check className="w-4 h-4 ml-auto" />}
              </button>
            ))}
          </div>
        </div>

        {/* Decorations */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-3">Decorations</h3>
          <div className="grid grid-cols-2 gap-2">
            {decorationItems.map((item) => (
              <button
                key={item.id}
                className={`p-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  tempRoom.decorations.includes(item.id)
                    ? 'bg-purple-500/80 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                onClick={() => toggleItem('decorations', item.id)}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
                {tempRoom.decorations.includes(item.id) && <Check className="w-4 h-4 ml-auto" />}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};

// Shop Modal
const ShopModal: React.FC<{
  onClose: () => void;
  onPurchase: (item: string) => void;
}> = ({ onClose, onPurchase }) => {
  const [selectedCategory, setSelectedCategory] = useState('furniture');
  
  const shopItems = {
    furniture: [
      { id: 'premium-bed', name: 'Premium Bed', price: 50, icon: '🛏️', description: 'Ultra comfy sleeping' },
      { id: 'gaming-chair', name: 'Gaming Chair', price: 75, icon: '🪑', description: 'Perfect for long sessions' },
      { id: 'standing-desk', name: 'Standing Desk', price: 100, icon: '🪑', description: 'Healthy workspace' },
      { id: 'bean-bag', name: 'Bean Bag', price: 30, icon: '🛋️', description: 'Casual seating' }
    ],
    plants: [
      { id: 'bonsai', name: 'Bonsai Tree', price: 40, icon: '🌲', description: 'Zen vibes' },
      { id: 'flower-pot', name: 'Flower Pot', price: 25, icon: '🌸', description: 'Colorful blooms' },
      { id: 'herb-garden', name: 'Herb Garden', price: 60, icon: '🌿', description: 'Fresh herbs' }
    ],
    decorations: [
      { id: 'neon-sign', name: 'Neon Sign', price: 80, icon: '💫', description: 'Cool lighting' },
      { id: 'vintage-poster', name: 'Vintage Poster', price: 35, icon: '🖼️', description: 'Retro style' },
      { id: 'fairy-lights', name: 'Fairy Lights', price: 45, icon: '✨', description: 'Magical ambiance' }
    ],
    pets: [
      { id: 'goldfish', name: 'Goldfish', price: 90, icon: '🐠', description: 'Peaceful companion' },
      { id: 'hamster', name: 'Hamster', price: 70, icon: '🐹', description: 'Playful friend' },
      { id: 'bird', name: 'Canary', price: 85, icon: '🐦', description: 'Melodic tweets' }
    ]
  };

  const categories = Object.keys(shopItems) as Array<keyof typeof shopItems>;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Chill Shop</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Currency Display */}
        <div className="flex justify-center gap-6 mb-6 p-4 bg-white/5 rounded-2xl">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="font-bold text-white">250 Coins</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-400" />
            <span className="font-bold text-white">15 Hearts</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-6 py-3 rounded-xl font-semibold capitalize whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-purple-500/80 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shopItems[selectedCategory as keyof typeof shopItems]?.map((item) => (
            <div key={item.id} className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{item.icon}</div>
                <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                <p className="text-white/70 text-sm">{item.description}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="font-bold text-white">{item.price}</span>
                </div>
                
                <button
                  onClick={() => onPurchase(item.name)}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all"
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChillCornerGame;