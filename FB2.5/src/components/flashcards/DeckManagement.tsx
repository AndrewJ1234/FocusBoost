import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Star, Play, TestTube, Shuffle, TrendingUp, BookOpen, Clock } from 'lucide-react';

interface DeckManagementProps {
  onSelectDeck: (deckId: string) => void;
  onViewChange: (view: string) => void;
}

const DeckManagement: React.FC<DeckManagementProps> = ({ onSelectDeck, onViewChange }) => {
  const decks = [
    {
      id: '1',
      name: 'Chinese HSK 5',
      emoji: '🇨🇳',
      cardCount: 150,
      masteredCards: 98,
      starred: true,
      lastStudied: '2 hours ago',
      averageScore: 87,
      gradient: 'from-red-400 to-orange-500',
      bgGradient: 'from-red-50 to-orange-50'
    },
    {
      id: '2',
      name: 'JavaScript Concepts',
      emoji: '💻',
      cardCount: 89,
      masteredCards: 67,
      starred: false,
      lastStudied: '1 day ago',
      averageScore: 92,
      gradient: 'from-blue-400 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      id: '3',
      name: 'Spanish Vocabulary',
      emoji: '🇪🇸',
      cardCount: 75,
      masteredCards: 45,
      starred: true,
      lastStudied: '3 days ago',
      averageScore: 78,
      gradient: 'from-yellow-400 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50'
    },
    {
      id: '4',
      name: 'React Hooks',
      emoji: '⚛️',
      cardCount: 42,
      masteredCards: 38,
      starred: false,
      lastStudied: '5 days ago',
      averageScore: 95,
      gradient: 'from-cyan-400 to-blue-500',
      bgGradient: 'from-cyan-50 to-blue-50'
    },
    {
      id: '5',
      name: 'Medical Terminology',
      emoji: '🏥',
      cardCount: 200,
      masteredCards: 120,
      starred: false,
      lastStudied: '1 week ago',
      averageScore: 82,
      gradient: 'from-green-400 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      id: '6',
      name: 'French Grammar',
      emoji: '🇫🇷',
      cardCount: 65,
      masteredCards: 32,
      starred: true,
      lastStudied: '2 weeks ago',
      averageScore: 74,
      gradient: 'from-purple-400 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50'
    }
  ];

  const handleDeckAction = (deckId: string, action: string) => {
    onSelectDeck(deckId);
    onViewChange(action);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-1 text-neutral-900 mb-2">Study Decks</h1>
          <p className="body-large text-neutral-600">Master your knowledge with spaced repetition</p>
        </div>
        <motion.button
          className="btn-primary flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={20} />
          <span>Create New Deck</span>
        </motion.button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div 
          className="professional-card p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-3xl font-bold text-blue-600 mb-1">6</div>
          <div className="text-sm text-neutral-600">Active Decks</div>
        </motion.div>
        
        <motion.div 
          className="professional-card p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-3xl font-bold text-green-600 mb-1">621</div>
          <div className="text-sm text-neutral-600">Total Cards</div>
        </motion.div>
        
        <motion.div 
          className="professional-card p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-3xl font-bold text-purple-600 mb-1">400</div>
          <div className="text-sm text-neutral-600">Mastered</div>
        </motion.div>
        
        <motion.div 
          className="professional-card p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-3xl font-bold text-orange-600 mb-1">85%</div>
          <div className="text-sm text-neutral-600">Avg Score</div>
        </motion.div>
      </div>

      {/* Deck Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck, index) => (
          <motion.div
            key={deck.id}
            className="professional-card p-6 hover:shadow-2xl transition-all duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-14 h-14 bg-gradient-to-br ${deck.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {deck.emoji}
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-lg">{deck.name}</h3>
                  <p className="text-sm text-neutral-600">{deck.cardCount} cards</p>
                </div>
              </div>
              <motion.button 
                className={`text-2xl transition-colors ${deck.starred ? 'text-yellow-500' : 'text-neutral-300 hover:text-yellow-500'}`}
                whileHover={{ scale: 1.2, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
              >
                {deck.starred ? '⭐' : '☆'}
              </motion.button>
            </div>
            
            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-neutral-600 mb-2">
                <span>Progress</span>
                <span>{deck.masteredCards}/{deck.cardCount}</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className={`bg-gradient-to-r ${deck.gradient} h-3 rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(deck.masteredCards / deck.cardCount) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.8 }}
                />
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className={`p-3 bg-gradient-to-r ${deck.bgGradient} rounded-xl text-center`}>
                <div className="text-lg font-bold text-neutral-900">{deck.averageScore}%</div>
                <div className="text-xs text-neutral-600">Avg Score</div>
              </div>
              <div className={`p-3 bg-gradient-to-r ${deck.bgGradient} rounded-xl text-center`}>
                <div className="text-lg font-bold text-neutral-900">{deck.cardCount - deck.masteredCards}</div>
                <div className="text-xs text-neutral-600">To Review</div>
              </div>
            </div>
            
            {/* Last Studied */}
            <div className="flex items-center space-x-2 text-xs text-neutral-500 mb-4">
              <Clock size={12} />
              <span>Last studied {deck.lastStudied}</span>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <motion.button
                onClick={() => handleDeckAction(deck.id, 'study')}
                className="py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play size={12} />
                <span>Study</span>
              </motion.button>
              
              <motion.button
                onClick={() => handleDeckAction(deck.id, 'test')}
                className="py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors flex items-center justify-center space-x-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <TestTube size={12} />
                <span>Test</span>
              </motion.button>
              
              <motion.button
                onClick={() => handleDeckAction(deck.id, 'match')}
                className="py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors flex items-center justify-center space-x-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shuffle size={12} />
                <span>Match</span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.button
          onClick={() => onViewChange('analytics')}
          className="professional-card p-6 text-left hover:shadow-xl transition-all group"
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900">Study Analytics</h3>
              <p className="text-sm text-neutral-600">View your learning progress</p>
            </div>
          </div>
        </motion.button>
        
        <motion.button
          className="professional-card p-6 text-left hover:shadow-xl transition-all group"
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <BookOpen size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900">Import Deck</h3>
              <p className="text-sm text-neutral-600">Add cards from file or URL</p>
            </div>
          </div>
        </motion.button>
        
        <motion.button
          className="professional-card p-6 text-left hover:shadow-xl transition-all group"
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Star size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900">Browse Community</h3>
              <p className="text-sm text-neutral-600">Discover popular decks</p>
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default DeckManagement;