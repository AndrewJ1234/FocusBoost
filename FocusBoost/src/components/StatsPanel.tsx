import React from 'react';
import { BarChart, PieChart, TrendingUp } from 'lucide-react';
import { ProductivityStats, CategoryStats } from '../types';
import { tabTracker } from '../utils/tabTracker';

interface StatsPanelProps {
  productivityStats: ProductivityStats;
  categoryStats: CategoryStats;
}

const categoryColors: Record<string, string> = {
  productive: '#10B981',
  entertainment: '#F59E0B',
  social: '#EF4444',
  educational: '#3B82F6',
  news: '#8B5CF6',
  shopping: '#F97316',
  work: '#6B7280',
  other: '#6B7280'
};

export const StatsPanel: React.FC<StatsPanelProps> = ({ productivityStats, categoryStats }) => {
  const { productiveTime, entertainmentTime, productivityScore } = productivityStats;

  // Calculate progress circle
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(productivityScore / 100) * circumference} ${circumference}`;

  return (
    <div className="space-y-6">
      {/* Today's Overview */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
          <BarChart className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-blue-600">Today's Overview</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl text-center border border-green-200">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {tabTracker.formatTime(productiveTime)}
            </div>
            <div className="text-sm font-medium text-green-700 uppercase tracking-wide">
              Productive
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-xl text-center border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {tabTracker.formatTime(entertainmentTime)}
            </div>
            <div className="text-sm font-medium text-yellow-700 uppercase tracking-wide">
              Entertainment
            </div>
          </div>
        </div>

        {/* Productivity Score Ring */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="#E5E7EB"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="#10B981"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{productivityScore}%</span>
            </div>
          </div>
          <div className="text-sm text-gray-600 font-medium">Productivity Score</div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
          <PieChart className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-blue-600">Category Breakdown</h2>
        </div>

        <div className="space-y-3">
          {Object.entries(categoryStats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8)
            .map(([category, time]) => (
              <div
                key={category}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: categoryColors[category] || categoryColors.other }}
                  ></div>
                  <span className="font-medium capitalize text-gray-900">{category}</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {tabTracker.formatTime(time)}
                </span>
              </div>
            ))}
        </div>

        {Object.keys(categoryStats).length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No categories tracked yet
          </div>
        )}
      </div>

      {/* Productivity Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-bold text-blue-700">Quick Insights</h3>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-600">Most productive category:</span>
            <span className="font-medium capitalize text-blue-800">
              {Object.entries(categoryStats).find(([cat]) => ['productive', 'work', 'educational'].includes(cat))?.[0] || 'None yet'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-600">Time until break suggested:</span>
            <span className="font-medium text-blue-800">
              {productiveTime > 3600000 ? 'Take a break!' : '25 minutes'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-600">Focus score trend:</span>
            <span className="font-medium text-blue-800">
              {productivityScore > 60 ? '📈 Excellent' : productivityScore > 30 ? '📊 Good' : '📉 Needs focus'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};