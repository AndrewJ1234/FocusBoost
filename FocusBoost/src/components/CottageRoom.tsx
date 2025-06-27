import React, { useState } from 'react';
import { Avatar, AvatarMood } from '../types/avatar';

interface CottageRoomProps {
  avatar: Avatar;
  cleanliness: number;
  brightness: number;
  organization: number;
  isLevelingUp: boolean;
  onMoodHover: (show: boolean) => void;
}

const CottageRoom: React.FC<CottageRoomProps> = ({
  avatar,
  cleanliness,
  brightness,
  organization,
  isLevelingUp,
  onMoodHover
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const getMoodEmoji = (mood: AvatarMood): string => {
    switch (mood) {
      case 'energetic': return '⚡';
      case 'focused': return '🎯';
      case 'sleepy': return '😴';
      case 'distracted': return '😵‍💫';
      case 'happy': return '😊';
      case 'stressed': return '😰';
      default: return '😐';
    }
  };

  const getAvatarAnimation = (mood: AvatarMood): string => {
    switch (mood) {
      case 'energetic': return 'animate-bounce';
      case 'focused': return 'animate-pulse';
      case 'sleepy': return 'animate-bounce';
      case 'happy': return 'animate-bounce';
      default: return '';
    }
  };

  const getRoomStyle = () => {
    const cleanlinessColor = cleanliness > 70 ? 'from-green-100' : cleanliness > 40 ? 'from-yellow-100' : 'from-red-100';
    const brightnessOpacity = brightness > 70 ? 'opacity-100' : brightness > 40 ? 'opacity-80' : 'opacity-60';
    
    return {
      background: `linear-gradient(135deg, ${cleanlinessColor.replace('from-', '')}, #f0f9ff)`,
      filter: `brightness(${brightness}%)`,
    };
  };

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-2xl shadow-2xl">
      <div 
        className="relative w-full h-full"
        style={getRoomStyle()}
      >
        <div className="absolute inset-0">
          <div 
            className="absolute top-0 left-1/4 right-0 h-3/4 bg-gradient-to-b from-orange-200 to-orange-300 transform skew-y-12 origin-top-left"
            style={{
              clipPath: 'polygon(0 0, 75% 0, 100% 100%, 25% 100%)'
            }}
          />
          
          <div 
            className="absolute top-0 left-0 w-1/3 h-3/4 bg-gradient-to-b from-orange-300 to-orange-400 transform -skew-y-12 origin-top-right"
            style={{
              clipPath: 'polygon(0 0, 100% 25%, 100% 100%, 0 75%)'
            }}
          />
          
          <div 
            className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-b from-amber-200 to-amber-300 transform"
            style={{
              clipPath: 'polygon(0 25%, 25% 0, 100% 0, 75% 25%)'
            }}
          />
        </div>

        <div className="absolute top-12 right-16 w-20 h-16">
          <div className="w-full h-full bg-sky-200 rounded-lg border-4 border-white shadow-lg">
            <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-sky-300 rounded">
              <div className="absolute inset-0 border-2 border-white"></div>
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white transform -translate-y-1/2"></div>
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white transform -translate-x-1/2"></div>
            </div>
          </div>
          <div className="absolute -bottom-4 -left-4 w-16 h-8 bg-yellow-200 opacity-30 rounded-full blur-sm"></div>
        </div>

        <div 
          className="absolute bottom-24 left-12 w-24 h-16 cursor-pointer transition-transform hover:scale-105"
          onMouseEnter={() => setHoveredItem('desk')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="absolute bottom-4 w-full h-3 bg-amber-800 rounded-sm shadow-lg transform perspective-100 rotate-x-12"></div>
         
          <div className="absolute bottom-0 left-2 w-1 h-6 bg-amber-900"></div>
          <div className="absolute bottom-0 right-2 w-1 h-6 bg-amber-900"></div>
          
         
          <div className="absolute bottom-7 left-3 w-4 h-3 bg-gray-800 rounded-sm"></div>
          <div className="absolute bottom-7 right-3 w-3 h-2 bg-green-500 rounded-full"></div>
          
          {hoveredItem === 'desk' && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
              Study Desk 📚
            </div>
          )}
        </div>

        <div 
          className="absolute top-16 left-4 w-12 h-32 cursor-pointer transition-transform hover:scale-105"
          onMouseEnter={() => setHoveredItem('bookshelf')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="w-full h-full bg-amber-900 rounded-sm shadow-lg">
            <div className="absolute top-2 left-1 w-2 h-8 bg-red-600"></div>
            <div className="absolute top-2 left-3 w-2 h-8 bg-blue-600"></div>
            <div className="absolute top-2 right-1 w-2 h-8 bg-green-600"></div>
            <div className="absolute top-12 left-1 w-2 h-6 bg-purple-600"></div>
            <div className="absolute top-12 right-2 w-2 h-6 bg-yellow-600"></div>
            <div className="absolute top-20 left-2 w-2 h-8 bg-pink-600"></div>
          </div>
          
          {hoveredItem === 'bookshelf' && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
              Knowledge Library 📖
            </div>
          )}
        </div>

        <div 
          className="absolute bottom-20 right-12 cursor-pointer transition-transform hover:scale-110"
          onMouseEnter={() => setHoveredItem('plant')}
          onMouseLeave={() => setHoveredItem(null)}
        >

          <div className="w-8 h-6 bg-gradient-to-b from-red-800 to-red-900 rounded-b-lg"></div>

          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            {avatar.stats.focusStreak > 7 ? (
              <div className="text-2xl">🌳</div>
            ) : avatar.stats.focusStreak > 3 ? (
              <div className="text-xl">🌱</div>
            ) : (
              <div className="text-lg">🌿</div>
            )}
          </div>
          
          {hoveredItem === 'plant' && (
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
              Focus Plant (Streak: {avatar.stats.focusStreak} days) 🌱
            </div>
          )}
        </div>

        <div 
          className="absolute bottom-16 right-20 w-20 h-12 cursor-pointer transition-transform hover:scale-105"
          onMouseEnter={() => setHoveredItem('bed')}
          onMouseLeave={() => setHoveredItem(null)}
        >

          <div className="absolute bottom-0 w-full h-8 bg-amber-700 rounded-sm shadow-lg"></div>

          <div className="absolute bottom-6 w-full h-4 bg-white rounded-sm shadow-md"></div>

          <div className="absolute bottom-8 right-2 w-6 h-3 bg-blue-200 rounded-full"></div>

          <div className="absolute bottom-6 left-2 w-12 h-3 bg-pink-300 rounded-sm"></div>
          

          {avatar.stats.sleepStreak > 5 && (
            <div className="absolute -top-2 right-0 text-lg">✨</div>
          )}
          
          {hoveredItem === 'bed' && (
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
              Cozy Bed (Sleep Streak: {avatar.stats.sleepStreak} days) 😴
            </div>
          )}
        </div>

        <div 
          className="absolute bottom-32 left-20 cursor-pointer transition-transform hover:scale-110"
          onMouseEnter={() => setHoveredItem('lamp')}
          onMouseLeave={() => setHoveredItem(null)}
        >

          <div className="w-3 h-8 bg-gray-600 rounded-sm"></div>

          <div className="absolute -top-4 -left-2 w-7 h-6 bg-yellow-200 rounded-full shadow-lg border-2 border-yellow-300"></div>

          {brightness > 70 && (
            <div className="absolute -top-6 -left-4 w-11 h-10 bg-yellow-100 rounded-full opacity-50 blur-sm"></div>
          )}
          
          {hoveredItem === 'lamp' && (
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
              Focus Lamp 💡
            </div>
          )}
        </div>


        <div className="absolute bottom-8 left-1/4 w-32 h-20">
          <div 
            className="w-full h-full bg-gradient-to-br from-red-400 to-red-600 rounded-lg opacity-80 shadow-lg"
            style={{
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 90%, 0% 100%)'
            }}
          >

            <div className="absolute inset-2 border-2 border-red-300 rounded"></div>
            <div className="absolute inset-4 border border-red-200 rounded"></div>
          </div>
        </div>


        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <div className="relative group">

            <div className={`w-16 h-20 ${getAvatarAnimation(avatar.mood)} cursor-pointer`}>
              
              <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full mx-auto mb-1 shadow-lg">
              
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                </div>
              
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                  {avatar.mood === 'happy' && <div className="w-3 h-1 border-b-2 border-black rounded-full"></div>}
                  {avatar.mood === 'focused' && <div className="w-2 h-0.5 bg-black rounded-full"></div>}
                  {avatar.mood === 'sleepy' && <div className="w-2 h-2 border border-black rounded-full opacity-50"></div>}
                </div>
              </div>
              
              
              <div className="w-8 h-8 bg-gradient-to-b from-blue-400 to-blue-500 rounded-lg mx-auto shadow-md">
              
                <div className="absolute -left-1 top-1 w-2 h-4 bg-pink-300 rounded-full"></div>
                <div className="absolute -right-1 top-1 w-2 h-4 bg-pink-300 rounded-full"></div>
              </div>
            </div>
            
            
            <div 
              className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-lg shadow-lg cursor-pointer hover:scale-110 transition-transform"
              onMouseEnter={() => onMoodHover(true)}
              onMouseLeave={() => onMoodHover(false)}
            >
              {getMoodEmoji(avatar.mood)}
            </div>
            
            
            {avatar.mood === 'focused' && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
                  <div className="w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>
        </div>

        
        
        {cleanliness < 50 && (
          <>
            <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-gray-400 rounded-full opacity-50 animate-float"></div>
            <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-gray-400 rounded-full opacity-30 animate-float-delayed"></div>
            <div className="absolute top-1/2 left-1/4 w-0.5 h-0.5 bg-gray-500 rounded-full opacity-40 animate-float"></div>
          </>
        )}

        {isLevelingUp && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-2xl backdrop-blur-sm">
            <div className="text-center animate-bounce">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold text-purple-600 mb-2">Level Up!</h3>
              <p className="text-gray-600 text-lg">You reached Level {avatar.level}!</p>
              <div className="mt-4 flex justify-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        
        <div className="absolute top-4 left-4 space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${cleanliness > 70 ? 'bg-green-400' : cleanliness > 40 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
            <span className="text-gray-600">Cleanliness: {cleanliness}%</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${organization > 70 ? 'bg-green-400' : organization > 40 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
            <span className="text-gray-600">Organization: {organization}%</span>
          </div>
        </div>
      </div>

    
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-180deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 1.5s;
        }
      `}</style>
    </div>
  );
};

export default CottageRoom;