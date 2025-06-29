import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useProductivityData } from '../../hooks/useProductivityData';

const CategoryBreakdown: React.FC = () => {
  const { categoryData } = useProductivityData();

  const COLORS = [
    'var(--color-primary)',
    'var(--color-success)',
    'var(--color-secondary)',
    'var(--color-warning)',
    'var(--color-error)',
    'var(--color-text-muted)',
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div 
          className="p-3 rounded-lg shadow-lg"
          style={{ 
            backgroundColor: 'var(--color-background)',
            border: '1px solid var(--color-border)'
          }}
        >
          <p 
            className="font-semibold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {data.name}
          </p>
          <p 
            className="text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {data.hours}h {data.minutes}m ({data.percentage}%)
          </p>
          <p 
            className="text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Productivity: {data.productivityScore}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
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
          Time by Category
        </h2>
        <select 
          className="text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition-colors duration-200"
          style={{ 
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)'
          }}
        >
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category List */}
      <div className="space-y-3 mt-6">
        {categoryData.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-xl transition-colors duration-200"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span 
                className="font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {category.name}
              </span>
            </div>
            <div className="text-right">
              <div 
                className="text-sm font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {category.hours}h {category.minutes}m
              </div>
              <div 
                className="text-xs"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {category.productivityScore}% productive
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryBreakdown;