import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Apple, Weight, Heart } from 'lucide-react';

const WellnessWidget: React.FC = () => {
  const wellnessData = [
    {
      label: 'Water Intake',
      current: 6,
      target: 8,
      unit: 'glasses',
      icon: Droplets,
      color: 'var(--color-primary)',
      bgColor: 'var(--color-surface)',
      progressColor: 'var(--color-primary)'
    },
    {
      label: 'Nutrition Score',
      current: 85,
      target: 100,
      unit: '%',
      icon: Apple,
      color: 'var(--color-success)',
      bgColor: 'var(--color-surface)',
      progressColor: 'var(--color-success)'
    },
    {
      label: 'Weight Progress',
      current: 172,
      target: 170,
      unit: 'lbs',
      icon: Weight,
      color: 'var(--color-secondary)',
      bgColor: 'var(--color-surface)',
      progressColor: 'var(--color-secondary)'
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
      <div className="flex items-center space-x-3 mb-6">
        <Heart size={24} style={{ color: 'var(--color-error)' }} />
        <h2 
          className="text-xl font-bold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Wellness Tracker
        </h2>
      </div>

      <div className="space-y-4">
        {wellnessData.map((item, index) => {
          const Icon = item.icon;
          const progress = (item.current / item.target) * 100;
          
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl transition-colors duration-200"
              style={{ backgroundColor: item.bgColor }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: 'var(--color-background)' }}
                  >
                    <Icon size={16} style={{ color: item.color }} />
                  </div>
                  <span 
                    className="font-medium"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {item.label}
                  </span>
                </div>
                <span 
                  className="text-sm font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {item.current}{item.unit}
                </span>
              </div>

              <div 
                className="w-full rounded-full h-2 mb-2"
                style={{ backgroundColor: 'var(--color-border)' }}
              >
                <motion.div
                  className="h-2 rounded-full"
                  style={{ backgroundColor: item.progressColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>

              <div className="flex justify-between text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <span>Target: {item.target}{item.unit}</span>
                <span>{Math.round(progress)}%</span>
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
          backgroundColor: 'var(--color-error)',
          color: 'white'
        }}
      >
        Log Wellness Data
      </motion.button>
    </motion.div>
  );
};

export default WellnessWidget;