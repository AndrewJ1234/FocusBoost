// components/PieChartComponent.tsx
import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import { CategoryStats } from '../types';
import { formatTimeDisplay } from '../utils';

interface PieChartComponentProps {
  data: CategoryStats;
  title: string;
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({ data, title }) => {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  if (total === 0) return null;

  const colors: Record<string, string> = {
    productive: '#10b981',
    ai: '#8b5cf6',
    development: '#3b82f6',
    educational: '#f59e0b',
    work: '#6b7280',
    entertainment: '#ef4444',
    social: '#ec4899',
    news: '#06b6d4',
    shopping: '#f97316',
    other: '#9ca3af'
  };

  let currentAngle = 0;
  const radius = 90;
  const center = 110;

  const handleMouseMove = (e: React.MouseEvent, category: string, time: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setHoveredSegment(category);
  };

  const getPercentage = (time: number): string => {
    return ((time / total) * 100).toFixed(1);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border relative">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="flex items-center justify-between">
        <div className="relative">
          <svg 
            width="220" 
            height="220" 
            className="flex-shrink-0"
            onMouseLeave={() => setHoveredSegment(null)}
          >
            {Object.entries(data).map(([category, time]) => {
              const percentage = time / total;
              const angle = percentage * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              
              const x1 = center + radius * Math.cos((startAngle * Math.PI) / 180);
              const y1 = center + radius * Math.sin((startAngle * Math.PI) / 180);
              const x2 = center + radius * Math.cos((endAngle * Math.PI) / 180);
              const y2 = center + radius * Math.sin((endAngle * Math.PI) / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M ${center} ${center}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');

              currentAngle += angle;

              return (
                <path
                  key={category}
                  d={pathData}
                  fill={colors[category] || colors.other}
                  className={`transition-all duration-200 cursor-pointer ${
                    hoveredSegment === category 
                      ? 'opacity-100 transform scale-105' 
                      : hoveredSegment 
                      ? 'opacity-60' 
                      : 'opacity-90 hover:opacity-100'
                  }`}
                  style={{ 
                    filter: hoveredSegment === category 
                      ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' 
                      : 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                    transformOrigin: `${center}px ${center}px`
                  }}
                  onMouseMove={(e) => handleMouseMove(e, category, time)}
                />
              );
            })}
          </svg>
          
          {/* Tooltip */}
          {hoveredSegment && (
            <div 
              className="absolute z-10 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium pointer-events-none"
              style={{
                left: mousePosition.x + 10,
                top: mousePosition.y - 10,
                transform: 'translate(0, -100%)'
              }}
            >
              <div className="flex items-center gap-2">
                {hoveredSegment === 'ai' && <Brain className="w-3 h-3" />}
                <span className="capitalize">{hoveredSegment}</span>
              </div>
              <div className="text-xs text-gray-300">
                {formatTimeDisplay(data[hoveredSegment])} ({getPercentage(data[hoveredSegment])}%)
              </div>
            </div>
          )}
        </div>
        
        <div className="ml-6 space-y-3 flex-1">
          {Object.entries(data)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 6)
            .map(([category, time]) => (
              <div 
                key={category} 
                className={`flex items-center justify-between text-sm p-2 rounded-lg transition-colors cursor-pointer ${
                  hoveredSegment === category ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
                onMouseEnter={() => setHoveredSegment(category)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[category] || colors.other }}
                  />
                  <span className="capitalize text-gray-700 flex items-center gap-1 font-medium">
                    {category === 'ai' && <Brain className="w-3 h-3" />}
                    {category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-gray-900">{formatTimeDisplay(time)}</span>
                  <div className="text-xs text-gray-500">{getPercentage(time)}%</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PieChartComponent;