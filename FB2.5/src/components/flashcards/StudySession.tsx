import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Volume2, RotateCcw, Eye, EyeOff, Settings, Home } from 'lucide-react';

interface StudySessionProps {
  deckId: string | null;
  onBack: () => void;
}

const StudySession: React.FC<StudySessionProps> = ({ deckId, onBack }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState('recognition');
  const [hiddenElements, setHiddenElements] = useState({
    term: false,
    definition: false,
    phonetic: false
  });

  // Sample card data
  const cards = [
    {
      id: 1,
      term: '政府',
      definition: 'Government; the system by which a state or community is governed',
      phonetic: 'zhèng fǔ',
      partOfSpeech: 'noun',
      example: '政府决定增加教育预算。(The government decided to increase the education budget.)',
      etymology: 'From 政 (politics) + 府 (office/mansion)',
      relatedTerms: ['国家', '人民', '法律', '政策'],
      difficulty: 3,
      successRate: 78,
      reviewCount: 12
    },
    {
      id: 2,
      term: '经济',
      definition: 'Economy; the wealth and resources of a country or region',
      phonetic: 'jīng jì',
      partOfSpeech: 'noun',
      example: '中国的经济发展很快。(China\'s economic development is very fast.)',
      etymology: 'From 经 (manage) + 济 (help/benefit)',
      relatedTerms: ['金融', '市场', '贸易', '投资'],
      difficulty: 2,
      successRate: 85,
      reviewCount: 8
    }
  ];

  const card = cards[currentCard] || cards[0];
  const totalCards = cards.length;

  const toggleHidden = (element: keyof typeof hiddenElements) => {
    setHiddenElements(prev => ({
      ...prev,
      [element]: !prev[element]
    }));
  };

  const nextCard = () => {
    if (currentCard < totalCards - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    }
  };

  const previousCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
  };

  const playAudio = () => {
    // Audio playback functionality would go here
    console.log('Playing audio for:', card.term);
  };

  const rateDifficulty = (rating: number) => {
    console.log('Rating difficulty:', rating);
    // Update card difficulty logic would go here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="professional-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={onBack}
              className="p-2 rounded-lg transition-colors"
              style={{ 
                color: 'var(--color-text-muted)',
                ':hover': { backgroundColor: 'var(--color-surface)' }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
            </motion.button>
            <div>
              <h2 
                className="text-2xl font-bold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Chinese HSK 5
              </h2>
              <div 
                className="text-sm"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Card {currentCard + 1} of {totalCards}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Study Mode Selector */}
            <select 
              value={studyMode} 
              onChange={(e) => setStudyMode(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors duration-200"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)'
              }}
            >
              <option value="recognition">Term → Definition</option>
              <option value="recall">Definition → Term</option>
              <option value="pronunciation">Term → Phonetic</option>
              <option value="comprehensive">All Modes</option>
            </select>
            
            {/* Hide/Show Controls */}
            <div className="flex space-x-1">
              {Object.entries(hiddenElements).map(([key, hidden]) => (
                <motion.button
                  key={key}
                  onClick={() => toggleHidden(key as keyof typeof hiddenElements)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    hidden 
                      ? 'bg-red-100 text-red-700' 
                      : 'text-neutral-700'
                  }`}
                  style={{
                    backgroundColor: hidden ? 'rgb(254 242 242)' : 'var(--color-surface)',
                    color: hidden ? 'rgb(185 28 28)' : 'var(--color-text-muted)'
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  {hidden ? <EyeOff size={12} /> : <Eye size={12} />}
                  <span className="ml-1 capitalize">{key}</span>
                </motion.button>
              ))}
            </div>
            
            <motion.button
              className="p-2 rounded-lg transition-colors"
              style={{ 
                color: 'var(--color-text-muted)',
                ':hover': { backgroundColor: 'var(--color-surface)' }
              }}
              whileHover={{ scale: 1.05 }}
            >
              <Settings size={20} />
            </motion.button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div 
            className="w-full rounded-full h-2"
            style={{ backgroundColor: 'var(--color-border)' }}
          >
            <motion.div 
              className="h-2 rounded-full"
              style={{ backgroundColor: 'var(--color-primary)' }}
              initial={{ width: 0 }}
              animate={{ width: `${((currentCard + 1) / totalCards) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Main Flashcard */}
      <div className="relative perspective-1000">
        <motion.div 
          className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
          whileHover={{ scale: 1.01 }}
          style={{ cursor: 'pointer' }}
        >
          {/* Front Side */}
          <div 
            className="flashcard-front professional-card p-12"
            style={{ 
              backgroundColor: 'var(--color-background)',
              border: '1px solid var(--color-border)'
            }}
          >
            <div className="text-center space-y-8 h-full flex flex-col justify-center">
              
              {/* Term Section */}
              <AnimatePresence>
                {!hiddenElements.term && (
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div 
                      className="text-6xl font-bold mb-4"
                      style={{ 
                        color: 'var(--color-text-primary)',
                        wordBreak: 'keep-all',
                        overflow: 'visible'
                      }}
                    >
                      {card.term}
                    </div>
                    <div 
                      className="text-lg"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {card.partOfSpeech}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Phonetic Section */}
              <AnimatePresence>
                {!hiddenElements.phonetic && (
                  <motion.div 
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div 
                      className="text-2xl font-mono"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      /{card.phonetic}/
                    </div>
                    <motion.button 
                      onClick={(e) => { e.stopPropagation(); playAudio(); }}
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
                      style={{ 
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-primary)'
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Volume2 size={16} />
                      <span>Play Audio</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Definition Section */}
              <AnimatePresence>
                {!hiddenElements.definition && (
                  <motion.div 
                    className="max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div 
                      className="text-xl leading-relaxed"
                      style={{ 
                        color: 'var(--color-text-secondary)',
                        wordBreak: 'break-word'
                      }}
                    >
                      {card.definition}
                    </div>
                    {card.example && (
                      <div 
                        className="mt-4 p-4 rounded-xl"
                        style={{ backgroundColor: 'var(--color-surface)' }}
                      >
                        <div 
                          className="text-sm mb-1"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          Example:
                        </div>
                        <div 
                          className="italic"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          "{card.example}"
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Difficulty Indicator */}
              <div className="flex justify-center items-center space-x-2">
                {[1,2,3,4,5].map(level => (
                  <div 
                    key={level}
                    className={`w-3 h-3 rounded-full ${
                      level <= card.difficulty 
                        ? 'bg-orange-400' 
                        : ''
                    }`}
                    style={{
                      backgroundColor: level <= card.difficulty ? '#fb923c' : 'var(--color-border)'
                    }}
                  />
                ))}
              </div>
              
            </div>
          </div>
          
          {/* Back Side - Additional Info */}
          <div 
            className="flashcard-back professional-card p-12"
            style={{ 
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)'
            }}
          >
            <div className="space-y-6 h-full flex flex-col justify-center">
              <h3 
                className="text-2xl font-bold text-center"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Additional Information
              </h3>
              
              {/* Etymology */}
              {card.etymology && (
                <div 
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: 'var(--color-background)' }}
                >
                  <div 
                    className="text-sm font-medium mb-2"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    Etymology
                  </div>
                  <div style={{ color: 'var(--color-text-muted)' }}>
                    {card.etymology}
                  </div>
                </div>
              )}
              
              {/* Related Terms */}
              {card.relatedTerms && (
                <div 
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: 'var(--color-background)' }}
                >
                  <div 
                    className="text-sm font-medium mb-3"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    Related Terms
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {card.relatedTerms.map(term => (
                      <span 
                        key={term} 
                        className="px-3 py-1 rounded-full text-sm"
                        style={{ 
                          backgroundColor: 'var(--color-surface)',
                          color: 'var(--color-primary)'
                        }}
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Study Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className="p-4 rounded-xl text-center"
                  style={{ backgroundColor: 'var(--color-background)' }}
                >
                  <div 
                    className="text-2xl font-bold text-green-600"
                  >
                    {card.successRate}%
                  </div>
                  <div 
                    className="text-sm"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Success Rate
                  </div>
                </div>
                <div 
                  className="p-4 rounded-xl text-center"
                  style={{ backgroundColor: 'var(--color-background)' }}
                >
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {card.reviewCount}
                  </div>
                  <div 
                    className="text-sm"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Times Reviewed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <motion.button 
          onClick={previousCard}
          disabled={currentCard === 0}
          className="flex items-center space-x-2 px-6 py-3 professional-card transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: currentCard > 0 ? 1.02 : 1 }}
          whileTap={{ scale: currentCard > 0 ? 0.98 : 1 }}
        >
          <ArrowLeft size={16} />
          <span>Previous</span>
        </motion.button>
        
        {/* Difficulty Rating */}
        <div 
          className="flex items-center space-x-3 professional-card px-6 py-3"
        >
          <span 
            className="text-sm font-medium"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Rate Difficulty:
          </span>
          {['😴', '😊', '🤔', '😅', '😵'].map((emoji, index) => (
            <motion.button 
              key={index}
              onClick={() => rateDifficulty(index + 1)}
              className="text-2xl transition-transform"
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
        
        <motion.button 
          onClick={nextCard}
          disabled={currentCard === totalCards - 1}
          className="flex items-center space-x-2 px-6 py-3 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--color-primary)' }}
          whileHover={{ scale: currentCard < totalCards - 1 ? 1.02 : 1 }}
          whileTap={{ scale: currentCard < totalCards - 1 ? 0.98 : 1 }}
        >
          <span>Next</span>
          <ArrowRight size={16} />
        </motion.button>
      </div>
    </div>
  );
};

export default StudySession;