import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, TrendingUp, Clock } from 'lucide-react';

const FlashcardQuickAccess: React.FC = () => {
  const decks = [
    {
      id: 1,
      name: 'Chinese HSK 5',
      emoji: '🇨🇳',
      cardsDue: 47,
      totalCards: 150,
      gradient: 'from-red-400 to-orange-500',
      bgGradient: 'from-red-50 to-orange-50',
      borderColor: 'border-red-200'
    },
    {
      id: 2,
      name: 'JavaScript Concepts',
      emoji: '💻',
      cardsDue: 23,
      totalCards: 89,
      gradient: 'from-blue-400 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 3,
      name: 'Spanish Vocabulary',
      emoji: '🇪🇸',
      cardsDue: 12,
      totalCards: 75,
      gradient: 'from-yellow-400 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-200'
    }
  ];

  return (
    <div className="professional-card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <BookOpen size={20} className="text-white" />
          </div>
          <h3 
            className="text-xl font-bold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Study Session
          </h3>
        </div>
        <button 
          className="text-sm font-medium transition-colors"
          style={{ 
            color: 'var(--color-primary)',
            ':hover': { color: 'var(--color-secondary)' }
          }}
        >
          View All
        </button>
      </div>
      
      {/* Study Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div 
          className="text-center p-3 rounded-xl border"
          style={{ 
            backgroundColor: 'rgb(220 252 231)',
            borderColor: 'rgb(187 247 208)',
            color: 'rgb(22 163 74)'
          }}
        >
          <div className="text-2xl font-bold">82</div>
          <div className="text-xs">Cards Due</div>
        </div>
        <div 
          className="text-center p-3 rounded-xl border"
          style={{ 
            backgroundColor: 'rgb(243 232 255)',
            borderColor: 'rgb(221 214 254)',
            color: 'rgb(147 51 234)'
          }}
        >
          <div className="text-2xl font-bold">15m</div>
          <div className="text-xs">Avg Session</div>
        </div>
      </div>
      
      {/* Deck List */}
      <div className="space-y-3 mb-6">
        {decks.map((deck, index) => (
          <motion.div
            key={deck.id}
            className={`flashcard-deck-item p-4 bg-gradient-to-r ${deck.bgGradient} rounded-xl border ${deck.borderColor} cursor-pointer`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <div className="flashcard-content">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${deck.gradient} rounded-lg flex items-center justify-center text-lg shadow-sm`}>
                    {deck.emoji}
                  </div>
                  <div>
                    <div 
                      className="font-semibold text-sm"
                      style={{ 
                        color: 'var(--color-text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '120px'
                      }}
                    >
                      {deck.name}
                    </div>
                    <div 
                      className="text-xs"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {deck.cardsDue} cards due
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div 
                    className="text-sm font-bold"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {deck.cardsDue}
                  </div>
                  <div 
                    className="text-xs"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    /{deck.totalCards}
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-white/50 rounded-full h-1.5">
                  <div 
                    className={`bg-gradient-to-r ${deck.gradient} h-1.5 rounded-full transition-all`}
                    style={{ width: `${((deck.totalCards - deck.cardsDue) / deck.totalCards) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-3">
        <motion.button
          className="w-full py-3 text-white rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center space-x-2"
          style={{ 
            background: 'linear-gradient(135deg, var(--color-primary), var(--accent-purple))'
          }}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <Play size={18} />
          <span>Start Study Session</span>
        </motion.button>
        
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            className="py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
            style={{ 
              backgroundColor: 'rgb(220 252 231)',
              color: 'rgb(22 163 74)'
            }}
            whileHover={{ scale: 1.02 }}
          >
            <TrendingUp size={14} />
            <span>Review</span>
          </motion.button>
          <motion.button
            className="py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
            style={{ 
              backgroundColor: 'rgb(255 237 213)',
              color: 'rgb(194 65 12)'
            }}
            whileHover={{ scale: 1.02 }}
          >
            <Clock size={14} />
            <span>Timed</span>
          </motion.button>
        </div>
      </div>
      
      {/* Study Streak */}
      <div 
        className="mt-6 p-4 rounded-xl border"
        style={{ 
          background: 'linear-gradient(135deg, rgb(255 251 235), rgb(254 243 199))',
          borderColor: 'rgb(252 211 77)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🔥</span>
            <div>
              <div 
                className="font-semibold"
                style={{ color: 'rgb(146 64 14)' }}
              >
                7-Day Streak!
              </div>
              <div 
                className="text-xs"
                style={{ color: 'rgb(180 83 9)' }}
              >
                Keep it up!
              </div>
            </div>
          </div>
          <div 
            className="text-2xl font-bold"
            style={{ color: 'rgb(217 119 6)' }}
          >
            7
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardQuickAccess;