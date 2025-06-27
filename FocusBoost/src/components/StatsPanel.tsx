import React from 'react';
import { Clock, TrendingUp, Brain, Activity } from 'lucide-react';
import { ProductivityStats, CategoryStats } from '../types';
import { formatTimeDisplay } from '../utils';

interface StatsPanelProps {
  productivityStats: ProductivityStats;
  categoryStats: CategoryStats;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ 
  productivityStats, 
  categoryStats 
}) => {
  const statsCards = [
    {
      title: 'Session Time',
      value: formatTimeDisplay(productivityStats.totalTime),
      icon: Clock,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: 'Productivity Score',
      value: `${productivityStats.productivityScore}%`,
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      title: 'AI Tools Used',
      value: formatTimeDisplay(categoryStats.ai || 0),
      icon: Brain,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      title: 'Sessions Today',
      value: productivityStats.sessionCount.toString(),
      icon: Activity,
      color: 'orange',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div 
            key={index} 
            className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <IconComponent className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsPanel;