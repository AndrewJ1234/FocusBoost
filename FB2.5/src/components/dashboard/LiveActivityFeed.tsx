import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Code, MessageCircle, BookOpen, Coffee, Monitor } from 'lucide-react';
import { useRealTimeData } from '../../hooks/useRealTimeData';

const LiveActivityFeed: React.FC = () => {
  const { recentActivities } = useRealTimeData();

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'development': return Code;
      case 'communication': return MessageCircle;
      case 'learning': return BookOpen;
      case 'break': return Coffee;
      default: return Monitor;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'development': return 'var(--color-primary)';
      case 'communication': return 'var(--color-success)';
      case 'learning': return 'var(--color-secondary)';
      case 'break': return 'var(--color-warning)';
      default: return 'var(--color-text-muted)';
    }
  };

  const getProductivityColor = (score: number) => {
    if (score >= 80) return 'var(--color-success)';
    if (score >= 60) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-2xl p-6 shadow-sm transition-colors duration-300"
      style={{ 
        backgroundColor: 'var(--color-background)',
        border: '1px solid var(--color-border)'
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 
          className="text-xl font-bold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Live Activity Feed
        </h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-success)' }}></div>
          <span 
            className="text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Real-time
          </span>
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {recentActivities.map((activity, index) => {
            const Icon = getCategoryIcon(activity.category);
            const categoryColor = getCategoryColor(activity.category);
            const productivityColor = getProductivityColor(activity.productivityScore);
            
            return (
              <motion.div
                key={`${activity.timestamp}-${index}`}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-4 p-4 rounded-xl hover:shadow-sm transition-all duration-200"
                style={{ backgroundColor: 'var(--color-surface)' }}
              >
                <div 
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: 'var(--color-background)' }}
                >
                  <Icon size={20} style={{ color: categoryColor }} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 
                      className="font-semibold truncate"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {activity.name}
                    </h3>
                    <div className="flex items-center space-x-2 ml-4">
                      <span 
                        className="text-sm font-semibold"
                        style={{ color: productivityColor }}
                      >
                        {activity.productivityScore}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 mt-1">
                    <span 
                      className="text-sm"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {activity.category}
                    </span>
                    <span style={{ color: 'var(--color-border)' }}>•</span>
                    <div className="flex items-center space-x-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      <Clock size={14} />
                      <span>{Math.floor(activity.duration / 60)}m {activity.duration % 60}s</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Awareness Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 p-4 rounded-xl transition-colors duration-300"
        style={{ 
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)'
        }}
      >
        <p 
          className="text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <strong style={{ color: 'var(--color-primary)' }}>Awareness Alert:</strong> You've been coding for 45 minutes straight. 
          Consider taking a 5-minute break soon to maintain peak performance. 💪
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LiveActivityFeed;