import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Clock, Zap, Brain } from 'lucide-react';
import { useProductivityData } from '../../hooks/useProductivityData';

const ProductivityOverview: React.FC = () => {
  const { todayScore, weeklyAverage, trend, focusTime, distractionTime } = useProductivityData();

  const stats = [
    {
      label: 'Today\'s Score',
      value: todayScore,
      suffix: '%',
      icon: Zap,
      color: 'var(--color-primary)',
      bgColor: 'var(--color-surface)',
      trend: trend.today
    },
    {
      label: 'Weekly Average',
      value: weeklyAverage,
      suffix: '%', 
      icon: Target,
      color: 'var(--color-success)',
      bgColor: 'var(--color-surface)',
      trend: trend.weekly
    },
    {
      label: 'Focus Time',
      value: Math.floor(focusTime / 60),
      suffix: 'h',
      icon: Brain,
      color: 'var(--color-secondary)',
      bgColor: 'var(--color-surface)',
      trend: trend.focus
    },
    {
      label: 'Distraction Time',
      value: Math.floor(distractionTime / 60),
      suffix: 'h',
      icon: Clock,
      color: 'var(--color-warning)',
      bgColor: 'var(--color-surface)',
      trend: trend.distraction
    }
  ];

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
      <div className="flex items-center justify-between mb-6">
        <h2 
          className="text-xl font-bold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Productivity Overview
        </h2>
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-success)' }}></div>
          <span style={{ color: 'var(--color-text-muted)' }}>Live tracking active</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositiveTrend = stat.trend > 0;
          const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl p-4 hover:shadow-md transition-all duration-200"
              style={{ backgroundColor: stat.bgColor }}
            >
              <div className="flex items-center justify-between mb-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  <Icon size={20} style={{ color: stat.color }} />
                </div>
                <div className={`flex items-center space-x-1`}>
                  <TrendIcon 
                    size={14} 
                    style={{ color: isPositiveTrend ? 'var(--color-success)' : 'var(--color-error)' }}
                  />
                  <span 
                    className="text-xs font-medium"
                    style={{ color: isPositiveTrend ? 'var(--color-success)' : 'var(--color-error)' }}
                  >
                    {Math.abs(stat.trend)}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-baseline space-x-1">
                  <span 
                    className="text-2xl font-bold"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {stat.value}
                  </span>
                  <span 
                    className="text-sm"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {stat.suffix}
                  </span>
                </div>
                <p 
                  className="text-xs"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {stat.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 rounded-xl transition-colors duration-300"
        style={{ 
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)'
        }}
      >
        <div className="flex items-start space-x-3">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: 'var(--color-background)' }}
          >
            <Brain size={16} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div className="flex-1">
            <h3 
              className="text-sm font-semibold mb-1"
              style={{ color: 'var(--color-text-primary)' }}
            >
              AI Insight
            </h3>
            <p 
              className="text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Your productivity peaks between 9-11 AM. Consider scheduling your most important tasks during this window for optimal performance.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductivityOverview;