import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, CheckCircle } from 'lucide-react';

interface TestModeProps {
  deckId: string | null;
  onBack: () => void;
}

const TestMode: React.FC<TestModeProps> = ({ deckId, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [testType, setTestType] = useState('multiple-choice');
  const [timeRemaining, setTimeRemaining] = useState('12:34');

  const questions = [
    {
      id: 1,
      term: '政府',
      type: 'multiple-choice',
      options: [
        'Government',
        'Economy',
        'Society',
        'Culture'
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      term: '经济',
      type: 'multiple-choice',
      options: [
        'Politics',
        'Economy',
        'Education',
        'Technology'
      ],
      correctAnswer: 1
    }
  ];

  const question = questions[currentQuestion] || questions[0];
  const totalQuestions = questions.length;

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Test Header */}
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
              <h1 className="text-2xl font-bold text-neutral-900">Chinese HSK 5 Test</h1>
              <div className="text-neutral-600">Question {currentQuestion + 1} of {totalQuestions}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-neutral-600">Time Remaining</div>
              <div className="text-xl font-bold text-orange-600 flex items-center space-x-1">
                <Clock size={20} />
                <span>{timeRemaining}</span>
              </div>
            </div>
            
            <select 
              value={testType} 
              onChange={(e) => setTestType(e.target.value)}
              className="px-3 py-2 border border-neutral-200 rounded-lg bg-white"
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="written">Written Response</option>
              <option value="audio">Audio Recognition</option>
              <option value="mixed">Mixed Mode</option>
            </select>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="professional-card p-8">
        <div className="text-center space-y-8">
          
          {/* Question */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-neutral-600">What does this term mean?</div>
            <motion.div 
              className="text-6xl font-bold text-neutral-900"
              key={question.term}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {question.term}
            </motion.div>
          </div>
          
          {/* Answer Options */}
          {testType === 'multiple-choice' && (
            <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedAnswer(index)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-lg'
                      : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index 
                        ? 'border-blue-500 bg-blue-500 text-white' 
                        : 'border-neutral-300'
                    }`}>
                      {selectedAnswer === index && <CheckCircle size={16} />}
                    </div>
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                    <span className="text-lg">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
          
          {testType === 'written' && (
            <div className="max-w-2xl mx-auto">
              <textarea 
                className="w-full h-32 p-4 border border-neutral-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type your answer here..."
              />
            </div>
          )}
          
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <motion.button 
          onClick={previousQuestion}
          disabled={currentQuestion === 0}
          className="px-6 py-3 professional-card hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          whileHover={{ scale: currentQuestion > 0 ? 1.02 : 1 }}
        >
          <ArrowLeft size={16} />
          <span>Previous</span>
        </motion.button>
        
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalQuestions }, (_, i) => (
            <motion.div 
              key={i}
              className={`w-3 h-3 rounded-full ${
                i === currentQuestion 
                  ? 'bg-blue-500' 
                  : i < currentQuestion 
                  ? 'bg-green-500' 
                  : 'bg-neutral-200'
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
        
        <motion.button 
          onClick={nextQuestion}
          disabled={currentQuestion === totalQuestions - 1}
          className="px-6 py-3 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          whileHover={{ scale: currentQuestion < totalQuestions - 1 ? 1.02 : 1 }}
        >
          <span>{currentQuestion === totalQuestions - 1 ? 'Finish Test' : 'Next'}</span>
          <ArrowRight size={16} />
        </motion.button>
      </div>
    </div>
  );
};

export default TestMode;