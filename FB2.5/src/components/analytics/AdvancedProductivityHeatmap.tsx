import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Filter } from 'lucide-react';
import { analyticsAPI } from '../../services/api';

interface AdvancedProductivityHeatmapProps {
  timeRange: string;
}

const AdvancedProductivityHeatmap: React.FC<AdvancedProductivityHeatmapProps> = ({ timeRange }) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalDays: 0, activeDays: 0, avgScore: 0 });

  useEffect(() => {
    fetchHeatmapData();
  }, [timeRange]);

  const fetchHeatmapData = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getHeatmapData(timeRange);
      
      if (response.data.success) {
        setHeatmapData(response.data.data.heatmapData);
        setSummary(response.data.data.summary);
      }
    } catch (error) {
      console.error('Failed to fetch heatmap data:', error);
      // Fallback to sample data
      generateSampleData();
    } finally {
      setLoading(false);
    }
  };

  const generateSampleData = () => {
    const data = [];
    const today = new Date();
    const daysToShow = getDaysForTimeRange(timeRange);
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate realistic productivity scores
      const baseScore = Math.random() * 60 + 40; // 40-100
      const weekendPenalty = date.getDay() === 0 || date.getDay() === 6 ? -15 : 0;
      const score = Math.max(0, Math.min(100, baseScore + weekendPenalty));
      
      data.push({
        date: date.toISOString().split('T')[0],
        score: Math.round(score),
        duration: Math.floor(Math.random() * 480) + 60, // 1-8 hours in minutes
        sessions: Math.floor(Math.random() * 8) + 1
      });
    }
    
    setHeatmapData(data);
    setSummary({
      totalDays: daysToShow,
      activeDays: data.filter(d => d.score > 0).length,
      avgScore: Math.round(data.reduce((sum, d) => sum + d.score, 0) / data.length)
    });
  };

  const getDaysForTimeRange = (range: string): number => {
    switch (range) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
      case '3y': return 1095;
      case '5y': return 1825;
      default: return 30;
    }
  };

  const getIntensityColor = (score: number): string => {
    if (score === 0) return '#f3f4f6'; // gray-100
    if (score < 20) return '#dcfce7'; // green-100
    if (score < 40) return '#bbf7d0'; // green-200
    if (score < 60) return '#86efac'; // green-300
    if (score < 80) return '#4ade80'; // green-400
    return '#22c55e'; // green-500
  };

  const renderHeatmapGrid = () => {
    if (loading) {
      return (
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      );
    }

    // Group data by weeks for better visualization
    const weeks = [];
    let currentWeek = [];
    
    heatmapData.forEach((day: any, index) => {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay();
      
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
      
      currentWeek.push(day);
      
      if (index === heatmapData.length - 1) {
        weeks.push(currentWeek);
      }
    });

    return (
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex space-x-1">
            {week.map((day: any, dayIndex) => (
              <motion.div
                key={day.date}
                className="w-3 h-3 rounded-sm cursor-pointer transition-all hover:scale-125"
                style={{ backgroundColor: getIntensityColor(day.score) }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (weekIndex * 7 + dayIndex) * 0.01 }}
                title={`${day.date}: ${day.score}% productive, ${Math.floor(day.duration / 60)}h ${day.duration % 60}m`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar size={24} className="text-purple-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Productivity Heatmap</h2>
            <p className="text-sm text-gray-600">Your productivity patterns over time</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <TrendingUp size={16} className="text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-600">{summary.avgScore}% avg</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-emerald-50 rounded-xl">
          <div className="text-2xl font-bold text-emerald-600">{summary.avgScore}%</div>
          <div className="text-sm text-emerald-700">Avg Productivity</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-xl">
          <div className="text-2xl font-bold text-blue-600">{summary.activeDays}</div>
          <div className="text-sm text-blue-700">Active Days</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-xl">
          <div className="text-2xl font-bold text-purple-600">{summary.totalDays}</div>
          <div className="text-sm text-purple-700">Total Days</div>
        </div>
      </div>

      {/* Heatmap Visualization */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            {timeRange === '7d' ? 'Last 7 days' : 
             timeRange === '30d' ? 'Last 30 days' :
             timeRange === '90d' ? 'Last 3 months' :
             timeRange === '1y' ? 'Last year' :
             timeRange === '3y' ? 'Last 3 years' : 'Last 5 years'}
          </h3>
        </div>
        
        {renderHeatmapGrid()}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-sm text-gray-600 mt-4">
        <span>Less productive</span>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
          <div className="w-3 h-3 rounded-sm bg-green-100"></div>
          <div className="w-3 h-3 rounded-sm bg-green-200"></div>
          <div className="w-3 h-3 rounded-sm bg-green-300"></div>
          <div className="w-3 h-3 rounded-sm bg-green-400"></div>
          <div className="w-3 h-3 rounded-sm bg-green-500"></div>
        </div>
        <span>More productive</span>
      </div>
    </div>
  );
};

export default AdvancedProductivityHeatmap;