import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  gradient: string;
  subtitle?: string;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  trend,
  icon,
  gradient,
  subtitle,
  onClick
}) => {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trend === 'up' ? 'text-emerald-600' : 'text-red-600';
  const trendBg = trend === 'up' ? 'bg-emerald-50' : 'bg-red-50';

  return (
    <motion.div
      className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg`}>
          {icon}
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${trendBg}`}>
          <TrendIcon size={14} className={trendColor} />
          <span className={`text-xs font-semibold ${trendColor}`}>
            {change}
          </span>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="text-3xl font-bold text-gray-900">
          {value}
        </div>
        <div className="text-sm text-gray-600 font-medium">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-gray-500">
            {subtitle}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;