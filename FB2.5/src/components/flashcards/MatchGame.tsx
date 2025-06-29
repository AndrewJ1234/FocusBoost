import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Clock, Target } from 'lucide-react';

interface MatchGameProps {
  deckId: string | null;
  onBack: () => void;
}

const MatchGame: React.FC<MatchGameProps> = ({ deckId, onBack }) => {
  const [selectedTerm, setSelectedTerm] = useState<any>(null);
  const [selectedDefinition, setSelectedDefinition] = useState<any>(null);
  const [matches, setMatches] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('2:30');
  const [showResults, setShowResults] = useState(false);

  const terms = [
    { id: 1, text: '政府', phonetic: 'zhèng fǔ', matched: false },
    { id: 2, text: '经济', phonetic: 'jīng jì', matched: false },
    { id: 3, text: '社会', phonetic: 'shè huì', matched: false },
    { id: 4, text: '文化', phonetic: 'wén huà', matched: false }
  ];

  const definitions = [
    { id: 1, text: 'Government; the system by which a state is governed', termId: 1, matched: false },
    { id: 2, text: 'Economy; the wealth and resources of a country', termId: 2, matched: false },
    { id: 3, text: 'Society; the community of people living together', termId: 3, matched: false },
    { id: 4, text: 'Culture; the arts and customs of a civilization', termId: 4, matched: false }
  ];

  const totalPairs = terms.length;

  const selectTerm = (term: any) => {
    if (term.matched) return;
    setSelectedTerm(term);
    
    if (selectedDefinition && selectedDefinition.termId === term.id) {
      // Match found!
      setMatches(matches + 1);
      setScore(score + 100);
      setSelectedTerm(null);
      setSelectedDefinition(null);
      
      // Mark as matched (in real implementation, update state)
      console.log('Match found!', term, selectedDefinition);
    }
  };

  const selectDefinition = (definition: any) => {
    if (definition.matched) return;
    setSelectedDefinition(definition);
    
    if (selectedTerm && selectedTerm.id === definition.termId) {
      // Match found!
      setMatches(matches + 1);
      setScore(score + 100);
      setSelectedTerm(null);
      setSelectedDefinition(null);
      
      // Mark as matched (in real implementation, update state)
      console.log('Match found!', selectedTerm, definition);
    }
  };

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="professional-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Match Game</h1>
              <div className="text-neutral-600">Match terms with their definitions</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-2xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-neutral-600">Score</div>
            </motion.div>
            
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-2xl font-bold text-orange-600 flex items-center space-x-1">
                <Clock size={20} />
                <span>{timeRemaining}</span>
              </div>
              <div className="text-sm text-neutral-600">Time</div>
            </motion.div>
            
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-2xl font-bold text-purple-600">{matches}/{totalPairs}</div>
              <div className="text-sm text-neutral-600">Matches</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-2 gap-8">
        
        {/* Terms Column */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center space-x-2">
            <span>Terms</span>
            <Target size={20} className="text-blue-500" />
          </h3>
          {terms.map((term, index) => (
            <motion.div
              key={term.id}
              onClick={() => selectTerm(term)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedTerm?.id === term.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                  : term.matched
                  ? 'border-green-500 bg-green-50 opacity-50'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: term.matched ? 1 : 1.02 }}
              whileTap={{ scale: term.matched ? 1 : 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-neutral-900">{term.text}</div>
                  {term.phonetic && (
                    <div className="text-sm text-blue-600 font-mono">/{term.phonetic}/</div>
                  )}
                </div>
                {term.matched && <span className="text-green-600 text-xl">✓</span>}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Definitions Column */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center space-x-2">
            <span>Definitions</span>
            <Trophy size={20} className="text-purple-500" />
          </h3>
          {definitions.map((definition, index) => (
            <motion.div
              key={definition.id}
              onClick={() => selectDefinition(definition)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedDefinition?.id === definition.id
                  ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                  : definition.matched
                  ? 'border-green-500 bg-green-50 opacity-50'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md'
              }`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: definition.matched ? 1 : 1.02 }}
              whileTap={{ scale: definition.matched ? 1 : 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="text-neutral-900">{definition.text}</div>
                {definition.matched && <span className="text-green-600 text-xl">✓</span>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Game Results Modal */}
      <AnimatePresence>
        {showResults && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="professional-card p-8 max-w-md w-full mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Game Complete!</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                    <span className="text-green-700">Final Score</span>
                    <span className="font-bold text-green-800">{score}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                    <span className="text-blue-700">Time Taken</span>
                    <span className="font-bold text-blue-800">1:45</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                    <span className="text-purple-700">Accuracy</span>
                    <span className="font-bold text-purple-800">100%</span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <motion.button 
                    className="flex-1 py-3 btn-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Play Again
                  </motion.button>
                  <motion.button 
                    onClick={onBack}
                    className="flex-1 py-3 btn-secondary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back to Deck
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MatchGame;