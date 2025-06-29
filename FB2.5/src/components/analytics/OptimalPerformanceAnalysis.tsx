import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Zap, Clock, Brain, TrendingUp } from 'lucide-react';

interface OptimalPerformanceAnalysisProps {
  timeRange: string;
}

const OptimalPerformanceAnalysis: React.FC<OptimalPerformanceAnalysisProps> = ({ timeRange }) => {
  const [selectedMetric, setSelectedMetric] = useState('productivity');

  const hourlyData = [
    { hour: '6 AM', productivity: 45, focus: 40, energy: 50 },
    { hour: '7 AM', productivity: 55, focus: 50, energy: 60 },
    { hour: '8 AM', productivity: 70, focus: 65, energy: 75 },
    { hour: '9 AM', productivity: 85, focus: 80, energy: 85 },
    { hour: '10 AM', productivity: 92, focus: 90, energy: 88 },
    { hour: '11 AM', productivity: 88, focus: 85, energy: 82 },
    { hour: '12 PM', productivity: 75, focus: 70, energy: 70 },
    { hour: '1 PM', productivity: 65, focus: 60, energy: 65 },
    { hour: '2 PM', productivity: 80, focus: 85, energy: 75 },
    { hour: '3 PM', productivity: 90, focus: 92, energy: 80 },
    { hour: '4 PM', productivity: 85, focus: 88, energy: 75 },
    { hour: '5 PM', productivity: 70, focus: 65, energy: 65 },
    { hour: '6 PM', productivity: 55, focus: 50, energy: 55 },
    { hour: '7 PM', productivity: 45, focus: 40, energy: 50 },
    { hour: '8 PM', productivity: 35, focus: 30, energy: 40 },
    { hour: '9 PM', productivity: 25, focus: 20, energy: 30 }
  ];

  const peakWindows = [
    {
      time: '9:00 - 11:00 AM',
      type: 'Primary Peak',
      score: 92,
      description: 'Highest cognitive performance',
      recommendation: 'Schedule complex analytical tasks',
      color: 'emerald'
    },
    {
      time: '2:00 - 4:00 PM',
      type: 'Secondary Peak',
      score: 88,
      description: 'Strong focus and creativity',
      recommendation: 'Ideal for creative work and problem-solving',
      color: 'blue'
    },
    {
      time: '12:00 - 1:00 PM',
      type: 'Energy Dip',
      score: 65,
      description: 'Natural circadian low',
      recommendation: 'Take lunch break or do light tasks',
      color: 'orange'
    }
  ];

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'productivity': return '#10b981';
      case 'focus': return '#3b82f6';
      case 'energy': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Zap size={24} className="text-purple-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Optimal Performance Windows</h2>
            <p className="text-sm text-gray-600">Your peak performance times throughout the day</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {['productivity', 'focus', 'energy'].map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                selectedMetric === metric
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Performance Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="hour" 
              tick={{ fontSize: 12 }}
              interval={1}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={getMetricColor(selectedMetric)}
              fill={getMetricColor(selectedMetric)}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Peak Windows */}
      <div className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">Performance Windows</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {peakWindows.map((window, index) => (
            <motion.div
              key={window.time}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border-2 ${
                window.color === 'emerald' ? 'bg-emerald-50 border-emerald-200' :
                window.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                'bg-orange-50 border-orange-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`text-lg font-bold ${
                  window.color === 'emerald' ? 'text-emerald-600' :
                  window.color === 'blue' ? 'text-blue-600' :
                  'text-orange-600'
                }`}>
                  {window.score}%
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  window.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                  window.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {window.type}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="font-medium text-gray-900">{window.time}</div>
                <div className="text-sm text-gray-600">{window.description}</div>
                <div className="text-xs text-gray-500 italic">{window.recommendation}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Brain size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900 mb-1">AI Performance Optimization</div>
            <div className="text-sm text-gray-700">
              Based on your patterns, scheduling demanding tasks during your 9-11 AM peak could increase 
              productivity by 23%. Consider moving routine tasks to your 12-1 PM dip period.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimalPerformanceAnalysis;