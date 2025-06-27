// components/AnalyticsPage.tsx
import React from 'react';
import { TrendingUp, Moon, BarChart3, Brain } from 'lucide-react';
import TimePeriodSelector from './TimePeriodSelector';
import { ExtensionData, ChartType } from '../types';

interface AnalyticsPageProps {
  data: ExtensionData;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  selectedChart: ChartType;
  setSelectedChart: (chart: ChartType) => void;
}

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ 
  data, 
  selectedPeriod, 
  setSelectedPeriod, 
  selectedChart, 
  setSelectedChart 
}) => {
  const chartData = data.historicalData?.[selectedPeriod];
  
  if (!chartData || chartData.length === 0) {
    return (
      <div className="space-y-8">
        {/* Chart Controls */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 capitalize mb-2">
                Analytics Dashboard
              </h3>
              <p className="text-sm text-gray-600">
                Track your productivity and sleep patterns over time
              </p>
            </div>
            
            {/* Chart Type Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSelectedChart('productivity')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  selectedChart === 'productivity' 
                    ? 'bg-white shadow-sm text-blue-600 ring-1 ring-blue-100' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Productivity
              </button>
              <button
                onClick={() => setSelectedChart('sleep')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  selectedChart === 'sleep' 
                    ? 'bg-white shadow-sm text-purple-600 ring-1 ring-purple-100' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Moon className="w-4 h-4" />
                Sleep
              </button>
            </div>
          </div>

          {/* Time Period Selector */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">Time Period</label>
            <TimePeriodSelector selected={selectedPeriod} onChange={setSelectedPeriod} />
          </div>
        </div>

        {/* No Data State */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Data Yet</h4>
            <p className="text-gray-500 text-center max-w-md">
              Start using FocusBoost to track your productivity patterns. Analytics data will appear here 
              once you have sufficient browsing history.
            </p>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Use different websites and AI tools to see detailed category breakdowns and productivity insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getYValue = (item: any): number => {
    switch (selectedChart) {
      case 'productivity': return item.productivityScore;
      case 'sleep': return item.sleepHours;
      default: return 0;
    }
  };

  const yValues = chartData.map(getYValue);
  const average = yValues.reduce((sum, val) => sum + val, 0) / yValues.length;
  const best = Math.max(...yValues);
  const lowest = Math.min(...yValues);
  const trend = yValues.length > 1 ? ((yValues[yValues.length - 1] - yValues[0]) / yValues[0]) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 capitalize mb-2">
              {selectedChart} Analytics
            </h3>
            <p className="text-sm text-gray-600">
              Track your {selectedChart} patterns over time with detailed insights
            </p>
          </div>
          
          {/* Chart Type Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedChart('productivity')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                selectedChart === 'productivity' 
                  ? 'bg-white shadow-sm text-blue-600 ring-1 ring-blue-100' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Productivity
            </button>
            <button
              onClick={() => setSelectedChart('sleep')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                selectedChart === 'sleep' 
                  ? 'bg-white shadow-sm text-purple-600 ring-1 ring-purple-100' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Moon className="w-4 h-4" />
              Sleep
            </button>
          </div>
        </div>

        {/* Time Period Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Time Period</label>
          <TimePeriodSelector selected={selectedPeriod} onChange={setSelectedPeriod} />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Average</p>
                <p className="text-2xl font-bold text-blue-900">
                  {selectedChart === 'productivity' ? `${Math.round(average)}%` : `${average.toFixed(1)}h`}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Peak</p>
                <p className="text-2xl font-bold text-green-900">
                  {selectedChart === 'productivity' ? `${Math.round(best)}%` : `${best.toFixed(1)}h`}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-600 uppercase tracking-wide">Lowest</p>
                <p className="text-2xl font-bold text-orange-900">
                  {selectedChart === 'productivity' ? `${Math.round(lowest)}%` : `${lowest.toFixed(1)}h`}
                </p>
              </div>
              <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </div>

          <div className={`bg-gradient-to-br ${trend >= 0 ? 'from-emerald-50 to-emerald-100' : 'from-red-50 to-red-100'} rounded-lg p-4 border ${trend >= 0 ? 'border-emerald-200' : 'border-red-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'} uppercase tracking-wide`}>Trend</p>
                <p className={`text-2xl font-bold ${trend >= 0 ? 'text-emerald-900' : 'text-red-900'}`}>
                  {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
                </p>
              </div>
              <div className={`w-8 h-8 ${trend >= 0 ? 'bg-emerald-200' : 'bg-red-200'} rounded-full flex items-center justify-center`}>
                <TrendingUp className={`w-4 h-4 ${trend >= 0 ? 'text-emerald-600' : 'text-red-600 rotate-180'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bar Chart Visualization */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            {selectedChart === 'productivity' ? 'Productivity Trend' : 'Sleep Pattern'}
          </h4>
          <div className="space-y-3">
            {chartData.slice(-14).map((item, index) => {
              const value = getYValue(item);
              const maxValue = selectedChart === 'productivity' ? 100 : 12;
              const percentage = Math.min((value / maxValue) * 100, 100);
              const date = new Date(item.date);
              
              return (
                <div key={index} className="flex items-center gap-4 hover:bg-white hover:shadow-sm rounded-lg p-2 transition-all">
                  <div className="w-20 text-xs text-gray-600 font-medium">
                    {date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      weekday: 'short'
                    })}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ease-out ${
                        selectedChart === 'productivity' 
                          ? value >= 70 ? 'bg-green-500' : value >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          : value >= 7 ? 'bg-purple-500' : 'bg-orange-500'
                      }`}
                      style={{ 
                        width: `${percentage}%`,
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                      }}
                    />
                    {/* Value label inside bar */}
                    <div className="absolute inset-0 flex items-center justify-end pr-2">
                      <span className="text-xs font-medium text-white drop-shadow-sm">
                        {selectedChart === 'productivity' ? `${Math.round(value)}%` : `${value.toFixed(1)}h`}
                      </span>
                    </div>
                  </div>
                  <div className="w-16 text-xs text-gray-700 font-medium text-right">
                    {selectedChart === 'productivity' ? `${Math.round(value)}%` : `${value.toFixed(1)}h`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Insights */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Insights
          </h4>
          <p className="text-sm text-blue-800 leading-relaxed">
            {selectedChart === 'productivity' 
              ? trend > 5 
                ? `Excellent progress! Your productivity has improved by ${trend.toFixed(1)}% over this period. Your consistent effort is paying off.`
                : trend < -5 
                ? `Your productivity has declined by ${Math.abs(trend).toFixed(1)}%. Consider reviewing your habits, eliminating distractions, and focusing on high-value tasks.`
                : `Your productivity is stable at ${Math.round(average)}%. Try new productivity techniques or set specific goals to reach the next level.`
              : average < 7 
              ? `You're averaging ${average.toFixed(1)} hours of sleep. Research shows 7-9 hours is optimal for cognitive performance and productivity.`
              : average > 9 
              ? `You're getting ${average.toFixed(1)}h of sleep on average. While adequate rest is important, ensure it's not impacting your daily schedule.`
              : `Great sleep habits! Your ${average.toFixed(1)}h average is in the optimal range for peak productivity and cognitive function.`
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;