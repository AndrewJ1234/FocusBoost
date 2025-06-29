import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Lightbulb, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface AIInsightsDashboardProps {
  timeRange: string;
}

const AIInsightsDashboard: React.FC<AIInsightsDashboardProps> = ({ timeRange }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const insights = [
    {
      id: 1,
      type: 'pattern',
      category: 'productivity',
      title: 'Peak Performance Pattern Detected',
      description: 'You consistently perform 34% better on Tuesdays and Wednesdays. This aligns with your sleep quality being highest on Monday and Tuesday nights.',
      confidence: 94,
      impact: 'high',
      actionable: true,
      recommendation: 'Schedule your most important tasks for Tuesday-Wednesday',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      id: 2,
      type: 'correlation',
      category: 'wellness',
      title: 'Sleep-Focus Correlation Strong',
      description: 'Your focus quality increases by 18% for every additional hour of sleep above 7 hours, with diminishing returns after 8.5 hours.',
      confidence: 91,
      impact: 'high',
      actionable: true,
      recommendation: 'Target 8-8.5 hours of sleep for optimal focus',
      icon: Brain,
      color: 'purple'
    },
    {
      id: 3,
      type: 'prediction',
      category: 'behavior',
      title: 'Distraction Risk Alert',
      description: 'Based on current patterns, you have a 73% chance of getting distracted by social media in the next 2 hours.',
      confidence: 87,
      impact: 'medium',
      actionable: true,
      recommendation: 'Enable focus mode or use website blocker',
      icon: AlertCircle,
      color: 'orange'
    },
    {
      id: 4,
      type: 'achievement',
      category: 'progress',
      title: 'Habit Formation Success',
      description: 'Your morning routine has been consistent for 18 days. Research shows habits typically solidify around 21 days.',
      confidence: 100,
      impact: 'medium',
      actionable: false,
      recommendation: 'Keep up the excellent work - you\'re almost there!',
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 5,
      type: 'optimization',
      category: 'environment',
      title: 'Environment Impact Analysis',
      description: 'Your productivity drops 15% when room temperature exceeds 74°F. Consider adjusting your workspace climate.',
      confidence: 82,
      impact: 'medium',
      actionable: true,
      recommendation: 'Maintain room temperature between 68-72°F',
      icon: Lightbulb,
      color: 'cyan'
    },
    {
      id: 6,
      type: 'trend',
      category: 'learning',
      title: 'Learning Velocity Increasing',
      description: 'Your flashcard retention rate has improved 28% over the past month, indicating optimized spaced repetition.',
      confidence: 89,
      impact: 'high',
      actionable: false,
      recommendation: 'Continue current study schedule and consider adding new decks',
      icon: TrendingUp,
      color: 'emerald'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Insights', count: insights.length },
    { id: 'productivity', name: 'Productivity', count: insights.filter(i => i.category === 'productivity').length },
    { id: 'wellness', name: 'Wellness', count: insights.filter(i => i.category === 'wellness').length },
    { id: 'behavior', name: 'Behavior', count: insights.filter(i => i.category === 'behavior').length },
    { id: 'learning', name: 'Learning', count: insights.filter(i => i.category === 'learning').length }
  ];

  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === selectedCategory);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getInsightColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-50',
      purple: 'text-purple-600 bg-purple-50',
      orange: 'text-orange-600 bg-orange-50',
      green: 'text-green-600 bg-green-50',
      cyan: 'text-cyan-600 bg-cyan-50',
      emerald: 'text-emerald-600 bg-emerald-50'
    };
    return colors[color as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Brain size={24} className="text-indigo-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Insights Dashboard</h2>
            <p className="text-sm text-gray-600">Personalized insights powered by machine learning</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock size={16} className="text-gray-400" />
          <span className="text-sm text-gray-500">Updated 5 min ago</span>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Insights Grid */}
      <div className="space-y-4">
        {filteredInsights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${getInsightColor(insight.color)}`}>
                  <Icon size={20} />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                        {insight.impact.toUpperCase()} IMPACT
                      </div>
                      <div className="text-xs text-gray-500">
                        {insight.confidence}% confidence
                      </div>
                    </div>
                  </div>
                  
                  {insight.actionable && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2">
                        <Lightbulb size={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Recommendation:</span>
                      </div>
                      <p className="text-sm text-blue-800 mt-1">{insight.recommendation}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Model Info */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Brain size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">AI Model Performance</div>
            <div className="text-sm text-gray-600">
              Analyzing {timeRange} of data • 94% prediction accuracy • Next update in 2 hours
            </div>
          </div>
          <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsDashboard;