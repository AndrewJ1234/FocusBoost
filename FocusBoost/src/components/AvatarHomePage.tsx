// components/AvatarHomePage.tsx - Main Avatar Dashboard
import React, { useState, useEffect } from 'react';
import { 
  Star, Zap, Coins, Heart, Award, Settings, ShoppingBag, 
  Target, Bed, Brain, TreePine, Home, Sparkles, User
} from 'lucide-react';
import { Avatar, Currency, Quest, AvatarMood } from '../types/avatar';
// import SimpleStudyRoom from './SimpleStudyRoom'; // Component not available

interface AvatarHomePageProps {
  avatar: Avatar;
  currency: Currency;
  quests: Quest[];
  currentSession?: {
    title: string;
    domain: string;
    category: string;
  } | null;
  onQuestComplete: (questId: string) => void;
  onOpenShop: () => void;
  onOpenCustomizer: () => void;
  onOpenCottageEditor: () => void;
}

const AvatarHomePage: React.FC<AvatarHomePageProps> = ({
  avatar,
  currency,
  quests,
  currentSession,
  onQuestComplete,
  onOpenShop,
  onOpenCustomizer,
  onOpenCottageEditor
}) => {
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [showMoodTooltip, setShowMoodTooltip] = useState(false);
  const [ownedFurniture, setOwnedFurniture] = useState<string[]>([]);
  const [ownedPets, setOwnedPets] = useState<string[]>([]);

  const getMoodMessage = (mood: AvatarMood): string => {
    switch (mood) {
      case 'energetic': return 'Feeling great and ready to tackle any challenge!';
      case 'focused': return 'In the zone and highly productive!';
      case 'sleepy': return 'Could use some more rest...';
      case 'distracted': return 'Having trouble concentrating today.';
      case 'happy': return 'Life is good and goals are being crushed!';
      case 'stressed': return 'Feeling overwhelmed. Take a break!';
      default: return 'Ready for whatever comes next.';
    }
  };

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

  const getXPPercentage = (): number => {
    return (avatar.xp / avatar.xpToNextLevel) * 100;
  };

  const dailyQuests = quests.filter((quest: Quest) => quest.duration === 'daily' && !quest.completed).slice(0, 3);

  useEffect(() => {
    // Check if avatar should level up
    if (avatar.xp >= avatar.xpToNextLevel) {
      setIsLevelingUp(true);
      setTimeout(() => setIsLevelingUp(false), 3000);
    }
  }, [avatar.xp, avatar.xpToNextLevel]);

  // Simulate owned items based on level and currency
  useEffect(() => {
    const furniture: string[] = [];
    const pets: string[] = [];
    
    // Add items based on level
    if (avatar.level >= 3) furniture.push('plant');
    if (avatar.level >= 5) furniture.push('lamp');
    if (avatar.level >= 7) furniture.push('bookshelf');
    
    if (avatar.level >= 10) pets.push('cat');
    if (avatar.level >= 15) pets.push('dog');
    
    setOwnedFurniture(furniture);
    setOwnedPets(pets);
  }, [avatar.level]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Simplified Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {avatar.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-800">{avatar.name}</h1>
                  <p className="text-sm text-gray-600">Level {avatar.level} • Focus Twin</p>
                </div>
              </div>
              
              {/* Compact XP Bar */}
              <div className="flex items-center gap-2">
                <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${getXPPercentage()}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {avatar.xp}/{avatar.xpToNextLevel}
                </span>
              </div>
            </div>

            {/* Compact Currency */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-lg">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-blue-800">{currency.focusPoints}</span>
              </div>
              <div className="flex items-center gap-1 bg-purple-100 px-3 py-1 rounded-lg">
                <Coins className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-purple-800">{currency.sleepCoins}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Main Study Environment */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Study Room - Takes up more space */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-white/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Your Study Space</h2>
                {currentSession && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Currently: {currentSession.category}</span>
                  </div>
                )}
              </div>
              
              {/* Enhanced SVG-based Study Room */}
              <div className="relative h-80 bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-900 rounded-xl overflow-hidden border-4 border-indigo-700 shadow-2xl">
                <svg viewBox="0 0 400 320" className="w-full h-full">
                  {/* Room Background */}
                  <defs>
                    <linearGradient id="wallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{stopColor:"#fef3c7", stopOpacity:1}} />
                      <stop offset="100%" style={{stopColor:"#fcd34d", stopOpacity:1}} />
                    </linearGradient>
                    <linearGradient id="floorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{stopColor:"#92400e", stopOpacity:1}} />
                      <stop offset="100%" style={{stopColor:"#451a03", stopOpacity:1}} />
                    </linearGradient>
                    <linearGradient id="screenGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor:"#3b82f6", stopOpacity:0.8}} />
                      <stop offset="100%" style={{stopColor:"#1d4ed8", stopOpacity:0.6}} />
                    </linearGradient>
                  </defs>
                  
                  {/* Back Wall */}
                  <rect x="0" y="0" width="400" height="200" fill="url(#wallGradient)" />
                  
                  {/* Floor */}
                  <polygon points="0,200 400,200 400,320 0,320" fill="url(#floorGradient)" />
                  
                  {/* Window */}
                  <rect x="320" y="30" width="60" height="80" fill="#87ceeb" stroke="#8b4513" strokeWidth="4" rx="5"/>
                  <line x1="350" y1="30" x2="350" y2="110" stroke="#8b4513" strokeWidth="2"/>
                  <line x1="320" y1="70" x2="380" y2="70" stroke="#8b4513" strokeWidth="2"/>
                  
                  {/* Desk with Computer */}
                  <rect x="150" y="180" width="120" height="60" fill="#8b4513" rx="8"/>
                  <rect x="155" y="175" width="110" height="8" fill="#a0522d" rx="4"/>
                  
                  {/* Computer Monitor - Visible Screen */}
                  <rect x="180" y="140" width="60" height="45" fill="#2c2c2c" rx="3"/>
                  <rect x="185" y="145" width="50" height="35" fill="#000" rx="2"/>
                  
                  {/* Computer Screen Content */}
                  <rect x="187" y="147" width="46" height="31" fill="url(#screenGlow)" rx="1"/>
                  <text x="210" y="160" fill="#fff" fontSize="8" textAnchor="middle">Code Editor</text>
                  <rect x="189" y="162" width="42" height="2" fill="#10b981" opacity="0.8"/>
                  <rect x="189" y="166" width="35" height="2" fill="#3b82f6" opacity="0.6"/>
                  <rect x="189" y="170" width="38" height="2" fill="#f59e0b" opacity="0.7"/>
                  <circle cx="235" cy="150" r="2" fill="#ef4444" opacity="0.8"/>
                  <circle cx="230" cy="150" r="2" fill="#f59e0b" opacity="0.8"/>
                  <circle cx="225" cy="150" r="2" fill="#10b981" opacity="0.8"/>
                  
                  {/* Monitor Stand */}
                  <rect x="205" y="185" width="10" height="15" fill="#666"/>
                  <rect x="195" y="195" width="30" height="5" fill="#555" rx="2"/>
                  
                  {/* Keyboard */}
                  <rect x="170" y="200" width="40" height="15" fill="#333" rx="2"/>
                  <rect x="172" y="202" width="36" height="11" fill="#555" rx="1"/>
                  
                  {/* Mouse */}
                  <ellipse cx="220" cy="207" rx="5" ry="8" fill="#666"/>
                  
                  {/* Chair */}
                  <ellipse cx="200" cy="250" rx="25" ry="35" fill="#8b0000"/>
                  <rect x="190" y="230" width="20" height="30" fill="#a0522d" rx="3"/>
                  <rect x="195" y="280" width="3" height="25" fill="#333"/>
                  <rect x="202" y="280" width="3" height="25" fill="#333"/>
                  
                  {/* Enhanced Avatar - Monster Style */}
                  <g transform="translate(200, 220)">
                    {/* Body */}
                    <ellipse cx="0" cy="10" rx="18" ry="25" fill="#60a5fa"/>
                    <ellipse cx="0" cy="8" rx="15" ry="20" fill="#93c5fd"/>
                    
                    {/* Arms */}
                    <ellipse cx="-20" cy="5" rx="8" ry="15" fill="#60a5fa" transform="rotate(-20)"/>
                    <ellipse cx="20" cy="5" rx="8" ry="15" fill="#60a5fa" transform="rotate(20)"/>
                    
                    {/* Legs */}
                    <ellipse cx="-8" cy="30" rx="6" ry="12" fill="#1e40af"/>
                    <ellipse cx="8" cy="30" rx="6" ry="12" fill="#1e40af"/>
                    
                    {/* Head */}
                    <ellipse cx="0" cy="-15" rx="16" ry="18" fill="#60a5fa"/>
                    <ellipse cx="0" cy="-17" rx="13" ry="15" fill="#93c5fd"/>
                    
                    {/* Eyes */}
                    <circle cx="-6" cy="-18" r="4" fill="#fff"/>
                    <circle cx="6" cy="-18" r="4" fill="#fff"/>
                    <circle cx="-6" cy="-17" r="2" fill="#000"/>
                    <circle cx="6" cy="-17" r="2" fill="#000"/>
                    <circle cx="-5" cy="-18" r="1" fill="#fff"/>
                    <circle cx="7" cy="-18" r="1" fill="#fff"/>
                    
                    {/* Nose */}
                    <ellipse cx="0" cy="-12" rx="2" ry="3" fill="#3b82f6"/>
                    
                    {/* Mouth based on mood */}
                    <path d="M -6 -8 Q 0 -4 6 -8" stroke="#1e40af" strokeWidth="2" fill="none"/>
                    
                    {/* Small horns */}
                    <polygon points="-8,-30 -6,-35 -4,-30" fill="#ef4444"/>
                    <polygon points="4,-30 6,-35 8,-30" fill="#ef4444"/>
                    
                    {/* Mood indicator floating above */}
                    <circle cx="15" cy="-25" r="8" fill="#fff" stroke="#fbbf24" strokeWidth="2"/>
                    <text x="15" y="-20" fontSize="10" textAnchor="middle">{getMoodEmoji(avatar.mood)}</text>
                  </g>
                  
                  {/* Enhanced Furniture */}
                  {ownedFurniture.includes('plant') && (
                    <g transform="translate(320, 200)">
                      <rect x="-8" y="15" width="16" height="12" fill="#8b4513" rx="2"/>
                      <ellipse cx="0" cy="0" rx="12" ry="20" fill="#22c55e"/>
                      <ellipse cx="-8" cy="-5" rx="6" ry="12" fill="#16a34a"/>
                      <ellipse cx="8" cy="-3" rx="5" ry="10" fill="#16a34a"/>
                      <ellipse cx="0" cy="-12" rx="4" ry="8" fill="#15803d"/>
                    </g>
                  )}
                  
                  {ownedFurniture.includes('lamp') && (
                    <g transform="translate(80, 180)">
                      <rect x="-2" y="20" width="4" height="30" fill="#8b4513"/>
                      <rect x="-15" y="45" width="30" height="8" fill="#654321" rx="4"/>
                      <ellipse cx="0" cy="0" rx="20" ry="25" fill="#fef3c7" opacity="0.9"/>
                      <ellipse cx="0" cy="0" rx="18" ry="22" fill="#fbbf24" opacity="0.7"/>
                      <circle cx="0" cy="25" r="25" fill="#fef080" opacity="0.3"/>
                    </g>
                  )}
                  
                  {ownedFurniture.includes('bookshelf') && (
                    <g transform="translate(50, 120)">
                      <rect x="0" y="0" width="40" height="80" fill="#8b4513"/>
                      <rect x="2" y="5" width="36" height="8" fill="#dc2626"/>
                      <rect x="2" y="15" width="36" height="8" fill="#2563eb"/>
                      <rect x="2" y="25" width="36" height="8" fill="#16a34a"/>
                      <rect x="2" y="35" width="36" height="8" fill="#9333ea"/>
                      <rect x="2" y="45" width="36" height="8" fill="#ea580c"/>
                      <rect x="2" y="55" width="36" height="8" fill="#0891b2"/>
                      <rect x="2" y="65" width="36" height="8" fill="#be123c"/>
                    </g>
                  )}
                  
                  {/* Enhanced Pets */}
                  {ownedPets.includes('cat') && (
                    <g transform="translate(120, 240)" className="animate-pulse">
                      <ellipse cx="0" cy="5" rx="12" ry="8" fill="#9ca3af"/>
                      <ellipse cx="0" cy="0" rx="8" ry="6" fill="#9ca3af"/>
                      <polygon points="-5,-8 -3,-12 -1,-8" fill="#6b7280"/>
                      <polygon points="1,-8 3,-12 5,-8" fill="#6b7280"/>
                      <circle cx="-3" cy="-2" r="1.5" fill="#22c55e"/>
                      <circle cx="3" cy="-2" r="1.5" fill="#22c55e"/>
                      <ellipse cx="12" cy="3" rx="3" ry="12" fill="#9ca3af"/>
                      <path d="M -2 2 Q 0 4 2 2" stroke="#374151" strokeWidth="1" fill="none"/>
                    </g>
                  )}
                  
                  {ownedPets.includes('dog') && (
                    <g transform="translate(280, 240)" className="animate-bounce">
                      <ellipse cx="0" cy="8" rx="15" ry="12" fill="#d97706"/>
                      <ellipse cx="0" cy="0" rx="10" ry="8" fill="#d97706"/>
                      <ellipse cx="-8" cy="-3" rx="4" ry="6" fill="#b45309"/>
                      <ellipse cx="8" cy="-3" rx="4" ry="6" fill="#b45309"/>
                      <circle cx="-3" cy="-1" r="1.5" fill="#000"/>
                      <circle cx="3" cy="-1" r="1.5" fill="#000"/>
                      <ellipse cx="0" cy="2" rx="2" ry="3" fill="#000"/>
                      <ellipse cx="15" cy="5" rx="4" ry="8" fill="#d97706"/>
                      <path d="M -4 4 Q 0 7 4 4" stroke="#000" strokeWidth="1" fill="none"/>
                    </g>
                  )}
                  
                  {/* Ambient lighting */}
                  <circle cx="200" cy="100" r="80" fill="#fbbf24" opacity="0.1"/>
                  <circle cx="210" cy="162" r="30" fill="#3b82f6" opacity="0.15"/>
                </svg>

                {/* Activity indicator overlay */}
                {currentSession && (
                  <div className="absolute top-4 left-4 px-3 py-2 bg-gradient-to-r from-white/95 to-gray-100/95 backdrop-blur-sm rounded-xl text-sm font-bold text-gray-800 shadow-lg border border-white/50">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {currentSession.category === 'ai' ? '🤖' :
                         currentSession.category === 'development' ? '💻' :
                         currentSession.category === 'educational' ? '📖' :
                         currentSession.category === 'entertainment' ? '🎮' :
                         currentSession.category === 'social' ? '💬' : '🌐'}
                      </span>
                      <span className="capitalize">{currentSession.category}</span>
                    </div>
                  </div>
                )}

                {/* Screen reflection effect */}
                <div className="absolute top-[18%] left-[45%] w-[15%] h-[14%] bg-blue-400 opacity-20 rounded-sm pointer-events-none animate-pulse"></div>
              </div>
              
              {/* Self-Awareness Message */}
              {currentSession && (
                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    🪞 Mirror Mode Active
                  </p>
                  <p className="text-sm text-blue-700">
                    Your avatar is {currentSession.category === 'ai' ? 'using AI tools' :
                    currentSession.category === 'development' ? 'coding' :
                    currentSession.category === 'educational' ? 'learning' :
                    currentSession.category === 'entertainment' ? 'taking a break' :
                    currentSession.category === 'social' ? 'socializing' :
                    'browsing'} on <span className="font-medium">{currentSession.domain}</span>
                  </p>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex justify-center gap-3 mt-6">
                <button 
                  onClick={onOpenCustomizer}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
                >
                  <User className="w-4 h-4" />
                  Style Avatar
                </button>
                <button 
                  onClick={onOpenCottageEditor}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
                >
                  <Home className="w-4 h-4" />
                  Decorate Room
                </button>
                <button 
                  onClick={onOpenShop}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Shop
                </button>
              </div>
            </div>
          </div>

          {/* Compact Side Panel */}
          <div className="space-y-4">
            {/* Daily Quests - Compact */}
            <div className="bg-white rounded-xl p-4 shadow-lg border border-white/50">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-orange-500" />
                <h3 className="font-bold text-gray-800">Daily Goals</h3>
              </div>
              
              <div className="space-y-3">
                {dailyQuests.length > 0 ? (
                  dailyQuests.map((quest: Quest) => (
                    <div key={quest.id} className="p-3 bg-gray-50 rounded-lg border">
                      <h4 className="font-medium text-gray-800 text-sm mb-1">{quest.title}</h4>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-gradient-to-r from-orange-400 to-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((quest.progress / quest.target) * 100, 100)}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          {Math.round((quest.progress / quest.target) * 100)}% done
                        </span>
                        {quest.progress >= quest.target && (
                          <button 
                            onClick={() => onQuestComplete(quest.id)}
                            className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                          >
                            Claim
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Award className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">All done! 🎉</p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Stats - Compact */}
            <div className="bg-white rounded-xl p-4 shadow-lg border border-white/50">
              <h3 className="font-bold text-gray-800 mb-3 text-sm">Progress</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-700">Focus Streak</span>
                  </div>
                  <span className="font-bold text-blue-600">{avatar.stats.focusStreak}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-700">Sleep Streak</span>
                  </div>
                  <span className="font-bold text-purple-600">{avatar.stats.sleepStreak}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-700">Tasks Done</span>
                  </div>
                  <span className="font-bold text-yellow-600">{avatar.stats.tasksCompleted}</span>
                </div>
              </div>
            </div>

            {/* Room Items Unlock Progress */}
            <div className="bg-white rounded-xl p-4 shadow-lg border border-white/50">
              <h3 className="font-bold text-gray-800 mb-3 text-sm">Room Progress</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Furniture</span>
                  <span className="font-medium">{ownedFurniture.length}/3</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-green-400 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${(ownedFurniture.length / 3) * 100}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Pets</span>
                  <span className="font-medium">{ownedPets.length}/2</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-pink-400 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${(ownedPets.length / 2) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="mt-3 text-xs text-gray-500">
                Next unlock: Level {avatar.level + 1}
              </div>
            </div>
          </div>
        </div>

        {/* Level Up Animation */}
        {isLevelingUp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center animate-bounce">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold text-purple-600 mb-2">Level Up!</h3>
              <p className="text-gray-600 text-lg">You reached Level {avatar.level}!</p>
              <p className="text-sm text-gray-500 mt-2">New items unlocked in the shop!</p>
            </div>
          </div>
        )}

        {/* Mood Tooltip */}
        {showMoodTooltip && (
          <div className="fixed bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border max-w-xs">
            <p className="text-sm font-medium text-gray-800 mb-1">Current Mood</p>
            <p className="text-sm text-gray-600">{getMoodMessage(avatar.mood)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarHomePage;