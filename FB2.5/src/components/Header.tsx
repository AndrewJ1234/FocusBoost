import React from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, 
  Zap, 
  Wifi,
  WifiOff,
  BarChart3,
  BookOpen,
  User,
  Settings,
  Activity,
  Bell
} from 'lucide-react';
import ThemeSelector from './ThemeSelector';

interface HeaderProps {
  currentActivity: {
    name: string;
    category: string;
    duration: number;
    productivityScore: number;
  };
  isConnected: boolean;
  onMenuClick: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
  views: Record<string, string>;
}

const Header: React.FC<HeaderProps> = ({ 
  currentActivity, 
  isConnected, 
  onMenuClick,
  currentView,
  onViewChange,
  views
}) => {
  const getConnectionStatus = () => {
    if (!isConnected) return { 
      label: 'Extension Disconnected', 
      color: 'var(--color-error)',
      bgColor: 'rgb(254 242 242)',
      description: 'Install browser extension for real-time tracking'
    };
    return { 
      label: 'Live', 
      color: 'var(--color-success)',
      bgColor: 'rgb(220 252 231)',
      description: 'Chrome extension actively tracking'
    };
  };

  const status = getConnectionStatus();

  const getViewIcon = (view: string) => {
    switch (view) {
      case 'dashboard': return BarChart3;
      case 'flashcards': return BookOpen;
      case 'analytics': return Activity;
      case 'avatar': return User;
      case 'settings': return Settings;
      default: return BarChart3;
    }
  };

  return (
    <header 
      className="sticky top-0 z-50 backdrop-blur-xl border-b theme-transition"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Clean Brand */}
          <div className="flex items-center space-x-8">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg transition-colors lg:hidden hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Zap size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FocusBoost
              </h1>
            </div>

            {/* Clean Navigation */}
            <nav className="hidden md:flex space-x-1">
              {Object.entries(views).map(([key, label]) => {
                const Icon = getViewIcon(key);
                const isActive = currentView === key;
                
                return (
                  <motion.button
                    key={key}
                    onClick={() => onViewChange(key)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* Right Section - Status & User */}
          <div className="flex items-center space-x-4">
            {/* Live Status Indicator */}
            <div 
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-medium"
              style={{
                backgroundColor: status.bgColor,
                borderColor: status.color,
                color: status.color
              }}
            >
              {isConnected ? (
                <Wifi size={12} />
              ) : (
                <WifiOff size={12} />
              )}
              <span>{status.label}</span>
            </div>

            {/* Current Activity (Desktop) */}
            <motion.div 
              className="hidden lg:flex items-center space-x-3 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              key={currentActivity.name}
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                  {currentActivity.name}
                </p>
                <p className="text-xs text-gray-500">
                  {currentActivity.productivityScore}% Focus
                </p>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              whileHover={{ scale: 1.05 }}
            >
              <Bell size={18} className="text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </motion.button>

            <ThemeSelector />

            {/* User Avatar */}
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer shadow-md">
                <span className="text-white font-medium text-sm">JS</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;