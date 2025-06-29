import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, User, Trophy, Star, Settings } from 'lucide-react';

const AvatarCottage: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState('study');

  const rooms = [
    { id: 'study', name: 'Study Room', icon: '📚', unlocked: true },
    { id: 'kitchen', name: 'Kitchen', icon: '🍳', unlocked: true },
    { id: 'garden', name: 'Garden', icon: '🌱', unlocked: false },
    { id: 'library', name: 'Library', icon: '📖', unlocked: false }
  ];

  const achievements = [
    { name: '7-Day Streak', icon: '🔥', earned: true },
    { name: 'Early Bird', icon: '🌅', earned: true },
    { name: 'Focus Master', icon: '🎯', earned: false },
    { name: 'Wellness Warrior', icon: '💪', earned: false }
  ];

  const avatarStats = {
    level: 12,
    exp: 2350,
    nextLevel: 3000,
    coins: 847
  };

  const expProgress = (avatarStats.exp / avatarStats.nextLevel) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6 shadow-sm transition-colors duration-300"
      style={{ 
        backgroundColor: 'var(--color-background)',
        border: '1px solid var(--color-border)'
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Home size={24} style={{ color: 'var(--color-secondary)' }} />
          <h2 
            className="text-xl font-bold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            My Cottage
          </h2>
        </div>
        <button 
          className="p-2 rounded-lg transition-colors duration-200"
          style={{ 
            color: 'var(--color-text-muted)',
            ':hover': { backgroundColor: 'var(--color-surface)' }
          }}
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Avatar Display */}
      <div className="text-center mb-6">
        <motion.div
          className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl"
          style={{ background: 'var(--color-primary)' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          👨‍💻
        </motion.div>
        <h3 
          className="font-semibold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          John Smith
        </h3>
        <p 
          className="text-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Level {avatarStats.level} Productivity Master
        </p>
      </div>

      {/* Experience Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span 
            className="text-sm font-medium"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Experience
          </span>
          <span 
            className="text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {avatarStats.exp}/{avatarStats.nextLevel} XP
          </span>
        </div>
        <div 
          className="w-full rounded-full h-3"
          style={{ backgroundColor: 'var(--color-border)' }}
        >
          <motion.div
            className="h-3 rounded-full"
            style={{ background: 'var(--color-primary)' }}
            initial={{ width: 0 }}
            animate={{ width: `${expProgress}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Room Selection */}
      <div className="mb-6">
        <h4 
          className="text-sm font-semibold mb-3"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Cottage Rooms
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {rooms.map((room) => (
            <motion.button
              key={room.id}
              onClick={() => setSelectedRoom(room.id)}
              className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                !room.unlocked ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{
                backgroundColor: selectedRoom === room.id ? 'var(--color-surface)' : 'transparent',
                borderColor: selectedRoom === room.id ? 'var(--color-primary)' : 'var(--color-border)'
              }}
              whileHover={room.unlocked ? { scale: 1.05 } : {}}
              whileTap={room.unlocked ? { scale: 0.95 } : {}}
              disabled={!room.unlocked}
            >
              <div className="text-2xl mb-1">{room.icon}</div>
              <div 
                className="text-xs font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {room.name}
              </div>
              {!room.unlocked && (
                <div 
                  className="text-xs mt-1"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  🔒 Locked
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-6">
        <h4 
          className="text-sm font-semibold mb-3"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Recent Achievements
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {achievements.slice(0, 4).map((achievement, index) => (
            <motion.div
              key={achievement.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-xl text-center border-2 ${
                !achievement.earned ? 'opacity-60' : ''
              }`}
              style={{
                backgroundColor: achievement.earned ? 'var(--color-surface)' : 'var(--color-background)',
                borderColor: achievement.earned ? 'var(--color-warning)' : 'var(--color-border)'
              }}
            >
              <div className="text-xl mb-1">{achievement.icon}</div>
              <div 
                className="text-xs font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {achievement.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div 
        className="flex items-center justify-between p-4 rounded-xl"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="flex items-center space-x-2">
          <Star size={16} style={{ color: 'var(--color-warning)' }} />
          <span 
            className="text-sm font-semibold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {avatarStats.coins} coins
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          style={{ backgroundColor: 'var(--color-secondary)' }}
        >
          Shop
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AvatarCottage;