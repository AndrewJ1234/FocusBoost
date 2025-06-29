import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Lightbulb, TrendingUp, Clock } from 'lucide-react';

const QuickInsights: React.FC = () => {
  const insights = [
    {
      id: 1,
      type: 'performance',
      icon: TrendingUp,
      title: 'Peak Performance Window',
      message: 'You\'re most productive between 2-4 PM',
      confidence: 94,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 2,
      type: 'suggestion',
      icon: Lightbulb,
      title: 'Break Recommendation',
      message: 'Take a 5-minute break in 15 minutes',
      confidence: 87,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 3,
      type: 'pattern',
      icon: Clock,
      title: 'Focus Pattern',
      message: 'Your focus improves 23% after coffee',
      confidence: 91,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Brain size={24} className="text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900">AI Insights</h2>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl ${insight.bgColor} border border-opacity-20`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                  <Icon size={16} className={insight.color} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">{insight.title}</h3>
                  <p className="text-sm text-gray-700 mt-1">{insight.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {insight.confidence}% confidence
                    </span>
                    <button className={`text-xs font-medium ${insight.color} hover:underline`}>
                      Learn more
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-2 text-indigo-600 font-medium text-sm hover:bg-indigo-50 rounded-lg transition-colors"
      >
        View All Insights
      </motion.button>
    </div>
  );
};

export default QuickInsights;