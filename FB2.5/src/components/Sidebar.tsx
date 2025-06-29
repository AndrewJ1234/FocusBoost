import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  BarChart3, 
  Target, 
  Trophy, 
  Heart, 
  Settings, 
  Users, 
  Calendar,
  Brain,
  Clock,
  Zap,
  BookOpen,
  TrendingUp,
  User
} from 'lucide-react';

interface SidebarProps {
  onClose: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose, currentView, onViewChange }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'var(--primary-600)' },
    { id: 'flashcards', label: 'Flashcards', icon: BookOpen, color: 'var(--accent-purple)' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, color: 'var(--accent-green)' },
    { id: 'avatar', label: 'Avatar', icon: User, color: 'var(--accent-orange)' },
    { id: 'goals', label: 'Goals & Tasks', icon: Target, color: 'var(--success)' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, color: 'var(--warning)' },
    { id: 'wellness', label: 'Wellness', icon: Heart, color: 'var(--error)' },
    { id: 'social', label: 'Community', icon: Users, color: 'var(--accent-cyan)' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, color: 'var(--info)' },
    { id: 'insights', label: 'AI Insights', icon: Brain, color: 'var(--accent-purple)' },
    { id: 'time', label: 'Time Tracking', icon: Clock, color: 'var(--warning)' },
  ];

  const quickActions = [
    { label: 'Start Focus Session', icon: Zap, color: 'var(--primary-600)' },
    { label: 'Study Flashcards', icon: BookOpen, color: 'var(--accent-purple)' },
    { label: 'Log Water Intake', icon: Heart, color: 'var(--info)' },
    { label: 'Set New Goal', icon: Target, color: 'var(--success)' },
    { label: 'View Progress', icon: BarChart3, color: 'var(--accent-cyan)' },
  ];

  return (
    <div className="h-full flex flex-col professional-card rounded-none lg:rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900">Navigation</h2>
        <motion.button
          onClick={onClose}
          className="p-2 rounded-lg transition-colors lg:hidden hover:bg-neutral-100"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <X size={20} />
        </motion.button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 overflow-y-auto">
        <nav className="space-y-2">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  onClose();
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 shadow-sm' 
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon 
                  size={20} 
                  style={{ color: isActive ? 'var(--primary-600)' : item.color }} 
                />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 rounded-full bg-blue-600"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-wide mb-4 text-neutral-500 px-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={index}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all hover:shadow-md professional-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (navigationItems.length * 0.05) + (index * 0.1) }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: action.color }}
                  >
                    <Icon size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-neutral-900">
                    {action.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-neutral-200">
        <motion.button 
          onClick={() => {
            onViewChange('settings');
            onClose();
          }}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all hover:bg-neutral-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Settings size={20} className="text-neutral-500" />
          <span className="font-medium text-neutral-700">Settings</span>
        </motion.button>
      </div>
    </div>
  );
};

export default Sidebar;