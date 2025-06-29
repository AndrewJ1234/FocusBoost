import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp } from 'lucide-react';

const ProductivityHeatmap: React.FC = () => {
  // Generate sample heatmap data for the last 12 weeks
  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    
    for (let week = 11; week >= 0; week--) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (week * 7 + (6 - day)));
        
        // Generate realistic productivity scores
        const baseScore = Math.random() * 60 + 40; // 40-100
        const weekendPenalty = day === 0 || day === 6 ? -15 : 0;
        const score = Math.max(0, Math.min(100, baseScore + weekendPenalty));
        
        weekData.push({
          date,
          score: Math.round(score),
          day: day
        });
      }
      data.push(weekData);
    }
    return data;
  };

  const heatmapData = generateHeatmapData();
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getIntensityColor = (score: number) => {
    const opacity = score / 100;
    return `rgba(37, 99, 235, ${opacity})`; // Using blue with varying opacity
  };

  const averageScore = Math.round(
    heatmapData.flat().reduce((sum, day) => sum + day.score, 0) / 
    heatmapData.flat().length
  );

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
        <div className="flex items-center space-x-3">
          <Calendar size={24} style={{ color: 'var(--color-text-muted)' }} />
          <h2 
            className="text-xl font-bold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Productivity Heatmap
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <TrendingUp size={16} style={{ color: 'var(--color-success)' }} />
            <span 
              className="text-sm font-semibold"
              style={{ color: 'var(--color-success)' }}
            >
              {averageScore}% avg
            </span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="space-y-1">
        {/* Day labels */}
        <div className="grid grid-cols-8 gap-1 mb-2">
          <div></div>
          {dayLabels.map(day => (
            <div 
              key={day} 
              className="text-xs text-center font-medium"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Heatmap rows */}
        {heatmapData.map((week, weekIndex) => (
          <motion.div
            key={weekIndex}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: weekIndex * 0.05 }}
            className="grid grid-cols-8 gap-1"
          >
            <div 
              className="text-xs flex items-center"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {weekIndex === 0 ? 'This week' : `${weekIndex}w ago`}
            </div>
            {week.map((day, dayIndex) => (
              <motion.div
                key={`${weekIndex}-${dayIndex}`}
                className="w-6 h-6 rounded-sm cursor-pointer hover:ring-2 transition-all"
                style={{ 
                  backgroundColor: getIntensityColor(day.score),
                  border: '1px solid var(--color-border)'
                }}
                whileHover={{ 
                  scale: 1.2,
                  boxShadow: `0 0 0 2px var(--color-primary)`
                }}
                title={`${day.date.toLocaleDateString()}: ${day.score}% productive`}
              />
            ))}
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div 
        className="flex items-center justify-between mt-6 pt-4"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center space-x-2">
          <span 
            className="text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Less
          </span>
          {[0, 20, 40, 60, 80, 100].map(threshold => (
            <div
              key={threshold}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getIntensityColor(threshold) }}
            />
          ))}
          <span 
            className="text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            More
          </span>
        </div>
        
        <div 
          className="text-xs"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Last 12 weeks • {heatmapData.flat().filter(day => day.score > 0).length} active days
        </div>
      </div>
    </motion.div>
  );
};

export default ProductivityHeatmap;