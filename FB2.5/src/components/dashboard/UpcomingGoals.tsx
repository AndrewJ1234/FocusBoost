import React from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const UpcomingGoals: React.FC = () => {
  const goals = [
    {
      id: 1,
      title: 'Complete React Dashboard',
      deadline: 'Today, 6:00 PM',
      progress: 75,
      status: 'on-track',
      timeLeft: '2h 30m left'
    },
    {
      id: 2,
      title: 'Study Chinese (30 cards)',
      deadline: 'Today, 8:00 PM',
      progress: 60,
      status: 'behind',
      timeLeft: '18 cards remaining'
    },
    {
      id: 3,
      title: 'Weekly Exercise Goal',
      deadline: 'This week',
      progress: 85,
      status: 'ahead',
      timeLeft: '1 session ahead'
    },
    {
      id: 4,
      title: 'Read 2 Articles',
      deadline: 'Tomorrow',
      progress: 50,
      status: 'on-track',
      timeLeft: '1 article left'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ahead': return CheckCircle;
      case 'on-track': return Target;
      case 'behind': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'text-emerald-600';
      case 'on-track': return 'text-blue-600';
      case 'behind': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'bg-emerald-500';
      case 'on-track': return 'bg-blue-500';
      case 'behind': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Target size={24} className="text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Goals</h2>
      </div>

      <div className="space-y-4">
        {goals.map((goal, index) => {
          const StatusIcon = getStatusIcon(goal.status);
          const statusColor = getStatusColor(goal.status);
          const progressColor = getProgressColor(goal.status);
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{goal.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{goal.deadline}</p>
                </div>
                <StatusIcon size={16} className={statusColor} />
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${progressColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium text-gray-900">{goal.progress}%</span>
                  <span className="text-xs text-gray-500">{goal.timeLeft}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors"
      >
        Add New Goal
      </motion.button>
    </div>
  );
};

export default UpcomingGoals;