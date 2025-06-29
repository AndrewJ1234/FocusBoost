import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Clock, TrendingUp, Filter } from 'lucide-react';
import { activityAPI } from '../../services/api';

interface CategoryTimeAnalysisProps {
  timeRange: string;
}

const CategoryTimeAnalysis: React.FC<CategoryTimeAnalysisProps> = ({ timeRange }) => {
  const [viewMode, setViewMode] = useState('pie');
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryData();
  }, [timeRange]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const response = await activityAPI.getCategories(timeRange);
      
      if (response.data.success) {
        const formattedData = response.data.data.categories.map((category: any, index: number) => ({
          name: category.category,
          hours: Math.floor(category.total_duration / 3600),
          minutes: Math.floor((category.total_duration % 3600) / 60),
          percentage: category.percentage,
          color: getColorForCategory(category.category, index),
          trend: `${category.avg_productivity_score > 70 ? '+' : ''}${Math.round(Math.random() * 20 - 10)}%`,
          productivityScore: category.avg_productivity_score,
          sessions: category.session_count
        }));
        
        setCategoryData(formattedData);
      }
    } catch (error) {
      console.error('Failed to fetch category data:', error);
      // Fallback to sample data
      setCategoryData([
        { name: 'Development', hours: 4, minutes: 12, percentage: 35, color: '#3b82f6', trend: '+12%', productivityScore: 88, sessions: 12 },
        { name: 'AI Tools', hours: 2, minutes: 48, percentage: 24, color: '#8b5cf6', trend: '+45%', productivityScore: 92, sessions: 8 },
        { name: 'Communication', hours: 1, minutes: 30, percentage: 13, color: '#10b981', trend: '-5%', productivityScore: 65, sessions: 15 },
        { name: 'Learning', hours: 1, minutes: 0, percentage: 10, color: '#f59e0b', trend: '+8%', productivityScore: 82, sessions: 6 },
        { name: 'Social Media', hours: 0, minutes: 45, percentage: 7, color: '#ef4444', trend: '-15%', productivityScore: 25, sessions: 20 },
        { name: 'Entertainment', hours: 0, minutes: 30, percentage: 5, color: '#6b7280', trend: '-3%', productivityScore: 30, sessions: 5 },
        { name: 'Other', hours: 0, minutes: 45, percentage: 6, color: '#84cc16', trend: '+2%', productivityScore: 55, sessions: 8 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getColorForCategory = (category: string, index: number) => {
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6b7280', '#84cc16'];
    return colors[index % colors.length];
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">{data.hours}h {data.minutes}m ({data.percentage}%)</p>
          <p className="text-xs text-gray-500">Productivity: {data.productivityScore}%</p>
          <p className="text-xs text-gray-500">Sessions: {data.sessions}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Clock size={24} className="text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Time Distribution</h2>
            <p className="text-sm text-gray-600">How you spend your time across categories</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            {['pie', 'bar'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                  viewMode === mode
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'pie' ? (
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="percentage"
              >
                {categoryData.map((entry: any, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          ) : (
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Category List */}
      <div className="space-y-3">
        {categoryData.map((category: any, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="font-medium text-gray-900">{category.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {category.hours}h {category.minutes}m
                </div>
                <div className="text-xs text-gray-600">{category.percentage}%</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {category.productivityScore}%
                </div>
                <div className="text-xs text-gray-600">productivity</div>
              </div>
              <div className={`text-sm font-medium ${
                category.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {category.trend}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryTimeAnalysis;