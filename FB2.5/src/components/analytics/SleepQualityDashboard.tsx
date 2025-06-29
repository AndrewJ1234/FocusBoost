import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Clock, Brain, Heart } from 'lucide-react';

interface SleepQualityDashboardProps {
  timeRange: string;
}

const SleepQualityDashboard: React.FC<SleepQualityDashboardProps> = ({ timeRange }) => {
  const sleepMetrics = [
    {
      label: 'Avg Sleep Duration',
      value: '7h 34m',
      target: '8h',
      progress: 94,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Sleep Efficiency',
      value: '89%',
      target: '85%',
      progress: 89,
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Deep Sleep',
      value: '1h 47m',
      target: '1h 30m',
      progress: 118,
      icon: Moon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      label: 'REM Sleep',
      value: '1h 23m',
      target: '1h 15m',
      progress: 111,
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  const sleepTrends = [
    { day: 'Mon', duration: 7.2, quality: 8.1 },
    { day: 'Tue', duration: 7.8, quality: 8.5 },
    { day: 'Wed', duration: 6.9, quality: 7.2 },
    { day: 'Thu', duration: 8.1, quality: 9.0 },
    { day: 'Fri', duration: 7.5, quality: 8.3 },
    { day: 'Sat', duration: 8.3, quality: 8.8 },
    { day: 'Sun', duration: 7.9, quality: 8.6 }
  ];

  const recommendations = [
    {
      icon: '🌙',
      title: 'Optimal Bedtime',
      description: 'Go to bed at 10:30 PM for best results',
      priority: 'high'
    },
    {
      icon: '📱',
      title: 'Screen Time',
      description: 'Reduce screen time 1 hour before bed',
      priority: 'medium'
    },
    {
      icon: '🌡️',
      title: 'Room Temperature',
      description: 'Keep bedroom at 65-68°F (18-20°C)',
      priority: 'low'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Moon size={24} className="text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900">Sleep Quality</h2>
      </div>

      {/* Sleep Metrics */}
      <div className="space-y-4 mb-6">
        {sleepMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl ${metric.bgColor}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <Icon size={16} className={metric.color} />
                  <span className="text-sm font-medium text-gray-900">{metric.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{metric.value}</span>
              </div>
              
              <div className="w-full bg-white rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${metric.progress >= 100 ? 'bg-emerald-500' : 'bg-gray-400'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(metric.progress, 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Target: {metric.target}</span>
                <span>{metric.progress}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sleep Trends Mini Chart */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Weekly Trend</h3>
        <div className="grid grid-cols-7 gap-1">
          {sleepTrends.map((day, index) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div 
                className="w-full bg-indigo-200 rounded-sm mb-1"
                style={{ height: `${day.quality * 6}px` }}
              />
              <div className="text-xs text-gray-600">{day.day}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Recommendations</h3>
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.title}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <span className="text-lg">{rec.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{rec.title}</div>
                <div className="text-xs text-gray-600">{rec.description}</div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {rec.priority}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SleepQualityDashboard;