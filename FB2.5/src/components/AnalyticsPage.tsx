import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Brain, Activity, TrendingUp, Moon } from 'lucide-react';
import SleepProductivityCorrelation from './analytics/SleepProductivityCorrelation';
import AdvancedProductivityHeatmap from './analytics/AdvancedProductivityHeatmap';
import SleepQualityDashboard from './analytics/SleepQualityDashboard';
import CategoryTimeAnalysis from './analytics/CategoryTimeAnalysis';
import OptimalPerformanceAnalysis from './analytics/OptimalPerformanceAnalysis';
import AIInsightsDashboard from './analytics/AIInsightsDashboard';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [viewMode, setViewMode] = useState('overview');

  const analyticsMetrics = [
    {
      title: 'Avg Productivity',
      value: '87%',
      change: '+12%',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Sleep Quality',
      value: '8.2/10',
      change: '+0.8',
      icon: Moon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Focus Sessions',
      value: '156',
      change: '+23',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Active Hours',
      value: '6.4h',
      change: '+1.2h',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Analytics Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">Deep insights into your productivity patterns</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
              <option value="1y">Last year</option>
            </select>
            
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['overview', 'sleep', 'performance'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    viewMode === mode 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {analyticsMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                    <Icon size={20} className={metric.color} />
                  </div>
                  <span className="text-sm font-medium text-emerald-600">{metric.change}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.title}</div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Core Analytics Grid */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Productivity Heatmap - Full Width */}
          <section className="col-span-12">
            <AdvancedProductivityHeatmap timeRange={timeRange} />
          </section>
          
          {/* Sleep-Productivity Correlation */}
          <section className="col-span-12 lg:col-span-8">
            <SleepProductivityCorrelation timeRange={timeRange} />
          </section>
          
          {/* Sleep Quality Metrics */}
          <section className="col-span-12 lg:col-span-4">
            <SleepQualityDashboard timeRange={timeRange} />
          </section>
          
          {/* Time Distribution Analysis */}
          <section className="col-span-12 lg:col-span-6">
            <CategoryTimeAnalysis timeRange={timeRange} />
          </section>
          
          {/* Optimal Performance Windows */}
          <section className="col-span-12 lg:col-span-6">
            <OptimalPerformanceAnalysis timeRange={timeRange} />
          </section>
          
          {/* Advanced Insights */}
          <section className="col-span-12">
            <AIInsightsDashboard timeRange={timeRange} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;