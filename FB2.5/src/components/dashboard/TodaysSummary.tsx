import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Target, TrendingUp } from 'lucide-react';

const TodaysSummary: React.FC = () => {
  const todayMetrics = [
    { label: 'Focus Sessions', value: '4', icon: Target, color: 'text-blue-600' },
    { label: 'Deep Work', value: '3.2h', icon: Clock, color: 'text-purple-600' },
    { label: 'Productivity', value: '87%', icon: TrendingUp, color: 'text-emerald-600' },
  ];

  const recentActivities = [
    { name: 'React Development', duration: '2h 15m', score: 92, category: 'Development' },
    { name: 'Code Review', duration: '45m', score: 78, category: 'Development' },
    { name: 'Team Meeting', duration: '30m', score: 65, category: 'Communication' },
    { name: 'Documentation', duration: '1h 5m', score: 82, category: 'Writing' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Calendar size={24} className="text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Today's Summary</h2>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {todayMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-3 bg-gray-50 rounded-xl"
            >
              <Icon size={20} className={`mx-auto mb-2 ${metric.color}`} />
              <div className="text-xl font-bold text-gray-900">{metric.value}</div>
              <div className="text-xs text-gray-600">{metric.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Activities</h3>
        <div className="space-y-2">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{activity.name}</div>
                <div className="text-xs text-gray-500">{activity.category} • {activity.duration}</div>
              </div>
              <div className={`text-sm font-semibold ${
                activity.score >= 80 ? 'text-emerald-600' : 
                activity.score >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {activity.score}%
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodaysSummary;