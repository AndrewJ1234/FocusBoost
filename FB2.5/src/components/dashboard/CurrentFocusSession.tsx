import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Brain, Zap, Clock } from 'lucide-react';

const CurrentFocusSession: React.FC = () => {
  const [isActive, setIsActive] = React.useState(true);
  const [isPaused, setIsPaused] = React.useState(false);

  return (
    <div className="professional-card p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="heading-3 text-neutral-900">Current Focus Session</h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-700">Active</span>
        </div>
      </div>
      
      {/* Main Session Display */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-6 border border-blue-100">
        <div className="flex items-center space-x-6">
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <span className="text-3xl">💻</span>
          </motion.div>
          
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-neutral-900 mb-1">Development Work</h3>
            <p className="text-neutral-600 body-medium">Building FocusBoost Dashboard</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1 text-sm text-blue-600">
                <Brain size={14} />
                <span>Deep Focus Mode</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-purple-600">
                <Zap size={14} />
                <span>87% Productivity</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <motion.div 
              className="text-5xl font-bold text-blue-600 mb-1"
              key={Math.floor(Date.now() / 1000)}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              2:34:12
            </motion.div>
            <div className="text-sm text-neutral-500 flex items-center space-x-1">
              <Clock size={14} />
              <span>Started at 1:15 PM</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Session Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <motion.button
            className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-blue-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </motion.button>
          
          <motion.button
            className="w-12 h-12 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-red-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Square size={20} />
          </motion.button>
          
          <div className="text-sm text-neutral-600">
            <span className="font-medium">Target:</span> 3 hours
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-neutral-600">
            <span className="font-medium">Break in:</span> 10 minutes
          </div>
          <motion.button
            className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200"
            whileHover={{ scale: 1.02 }}
          >
            Take Break Now
          </motion.button>
        </div>
      </div>
      
      {/* AI Insights */}
      <div className="space-y-3">
        <h4 className="font-semibold text-neutral-900 mb-3">Real-time Insights</h4>
        
        <motion.div 
          className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl border border-green-100"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-green-700">You're in your peak productivity window (2-4 PM)</span>
        </motion.div>
        
        <motion.div 
          className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-100"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-blue-700">Excellent focus - only 2 distractions in the last hour</span>
        </motion.div>
        
        <motion.div 
          className="flex items-center space-x-3 p-3 bg-orange-50 rounded-xl border border-orange-100"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span className="text-sm text-orange-700">Consider a 5-minute break in 10 minutes for optimal performance</span>
        </motion.div>
      </div>
    </div>
  );
};

export default CurrentFocusSession;