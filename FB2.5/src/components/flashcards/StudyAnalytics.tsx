import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Calendar, Target, Brain } from 'lucide-react';

interface StudyAnalyticsProps {
  onBack: () => void;
}

const StudyAnalytics: React.FC<StudyAnalyticsProps> = ({ onBack }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="professional-card p-6">
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
            <h1 className="text-2xl font-bold text-neutral-900">Study Analytics</h1>
            <div className="text-neutral-600">Track your learning progress and insights</div>
          </div>
        </div>
      </div>

      {/* Analytics Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          className="professional-card p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <TrendingUp size={24} className="text-white" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-1">87%</div>
          <div className="text-sm text-neutral-600">Average Score</div>
        </motion.div>
        
        <motion.div 
          className="professional-card p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Calendar size={24} className="text-white" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1">12</div>
          <div className="text-sm text-neutral-600">Study Streak</div>
        </motion.div>
        
        <motion.div 
          className="professional-card p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Target size={24} className="text-white" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-1">621</div>
          <div className="text-sm text-neutral-600">Cards Mastered</div>
        </motion.div>
        
        <motion.div 
          className="professional-card p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Brain size={24} className="text-white" />
          </div>
          <div className="text-3xl font-bold text-orange-600 mb-1">45h</div>
          <div className="text-sm text-neutral-600">Study Time</div>
        </motion.div>
      </div>

      {/* Placeholder for charts and detailed analytics */}
      <div className="professional-card p-8">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Detailed Analytics Coming Soon</h2>
        <p className="text-neutral-600">
          This section will include comprehensive study analytics, progress charts, 
          performance insights, and personalized recommendations.
        </p>
      </div>
    </div>
  );
};

export default StudyAnalytics;