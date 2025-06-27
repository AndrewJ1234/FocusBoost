import React from 'react';
import { Home, BarChart3, Moon, Settings, User, Star } from 'lucide-react';
import { ExtensionStatus, Page } from '../types';
import { GameState } from '../types/avatar';

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  extensionStatus: ExtensionStatus;
  gameState?: GameState;
}

const Navigation: React.FC<NavigationProps> = ({ 
  currentPage, 
  setCurrentPage, 
  extensionStatus,
  gameState
}) => {
  const pages: Page[] = [
    { id: 'avatar', label: 'Avatar', icon: User },
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'sleep', label: 'Sleep', icon: Moon },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-gray-800">🎯 FocusBoost</h1>
            <div className="flex space-x-1">
              {pages.map(page => {
                const IconComponent = page.icon;
                return (
                  <button
                    key={page.id}
                    onClick={() => setCurrentPage(page.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {page.label}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {gameState && (
              <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {gameState.avatar.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Lv.{gameState.avatar.level}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-gray-600">{gameState.avatar.xp} XP</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                extensionStatus === 'connected' ? 'bg-green-400' : 'bg-gray-400'
              }`}></div>
              <span className="text-sm text-gray-600">
                {extensionStatus === 'connected' ? 'Connected' : 'Demo Mode'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;