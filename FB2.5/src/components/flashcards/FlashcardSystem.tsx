import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DeckManagement from './DeckManagement';
import StudySession from './StudySession';
import TestMode from './TestMode';
import MatchGame from './MatchGame';
import StudyAnalytics from './StudyAnalytics';

const FlashcardSystem: React.FC = () => {
  const [currentView, setCurrentView] = useState('decks');
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);

  const views = {
    decks: 'My Decks',
    study: 'Study Session',
    test: 'Test Mode',
    match: 'Match Game',
    analytics: 'Analytics'
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'decks':
        return <DeckManagement onSelectDeck={setSelectedDeck} onViewChange={setCurrentView} />;
      case 'study':
        return <StudySession deckId={selectedDeck} onBack={() => setCurrentView('decks')} />;
      case 'test':
        return <TestMode deckId={selectedDeck} onBack={() => setCurrentView('decks')} />;
      case 'match':
        return <MatchGame deckId={selectedDeck} onBack={() => setCurrentView('decks')} />;
      case 'analytics':
        return <StudyAnalytics onBack={() => setCurrentView('decks')} />;
      default:
        return <DeckManagement onSelectDeck={setSelectedDeck} onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FlashcardSystem;