import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const GoalsProgress: React.FC = () => {
  const goals = [
    {
      id: 1,
      title: 'Code 4 hours daily',
      progress: 75,
      current: '3h 15m',
      target: '4h 0m',
      status: 'on-track',
      timeLeft: '45m left today'
    },
    {
      id: 2,
      title: 'Learn React Advanced',
      progress: 60,
      current: '6/10 modules',
      target: '10 modules',
      status: 'ahead',
      timeLeft: 'Due next week'
    },
    {
      id: 3,
      title: 'Limit social media',
      progress: 40,
      current: '1h 30m',
      target: '1h 0m',
      status: 'behind',
      timeLeft: 'Over by 30m'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track': return CheckCircle;
      case 'ahead': return Target;
      case 'behind': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'var(--color-success)';
      case 'ahead': return 'var(--color-primary)';
      case 'behind': return 'var(--color-error)';
      default: return 'var(--color-text-muted)';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'var(--color-success)';
      case 'ahead': return 'var(--color-primary)';
      case 'behind': return 'var(--color-error)';
      default: return 'var(--color-text-muted)';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6 shadow-sm transition-colors duration-300"
      style={{ 
        backgroundColor: 'var(--color-background)',
        border: '1px solid var(--color-border)'
      }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <Target size={24} style={{ color: 'var(--color-primary)' }} />
        <h2 
          className="text-xl font-bold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Goals Progress
        </h2>
      </div>

      <div className="space-y-4">
        {goals.map((goal, index) => {
          const StatusIcon = getStatusIcon(goal.status);
          const statusColor = getStatusColor(goal.status);
          const progressColor = getProgressColor(goal.status);
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl hover:shadow-sm transition-all duration-200"
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 
                    className="font-semibold"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {goal.title}
                  </h3>
                  <p 
                    className="text-sm mt-1"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {goal.current} of {goal.target}
                  </p>
                </div>
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: 'var(--color-background)' }}
                >
                  <StatusIcon size={16} style={{ color: statusColor }} />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div 
                  className="w-full rounded-full h-2"
                  style={{ backgroundColor: 'var(--color-border)' }}
                >
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: progressColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span 
                    className="text-sm font-semibold"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {goal.progress}%
                  </span>
                  <span 
                    className="text-xs"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {goal.timeLeft}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-3 font-semibold rounded-xl transition-colors duration-200"
        style={{ 
          backgroundColor: 'var(--color-primary)',
          color: 'white'
        }}
      >
        Add New Goal
      </motion.button>
    </motion.div>
  );
};

export default GoalsProgress;