// App.tsx - Integrated with Avatar System
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import StatusBanner from './components/StatusBanner';
import OverviewPage from './components/OverviewPage';
import AnalyticsPage from './components/AnalyticsPage';
import SleepPage from './components/SleepPage';
import SettingsPage from './components/SettingsPage';
import AvatarHomePage from './components/AvatarHomePage';
import AvatarShop from './components/AvatarShop';
import { ExtensionData, ExtensionStatus } from './types';
import { GameState, Quest, Achievement } from './types/avatar';
import QuestSystem from './utils/questSystem';

const App: React.FC = () => {
  const [data, setData] = useState<ExtensionData | null>(null);
  const [extensionStatus, setExtensionStatus] = useState<ExtensionStatus>('checking');
  const [retryCount, setRetryCount] = useState(0);
  const [currentPage, setCurrentPage] = useState('avatar'); // Start with avatar page
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedChart, setSelectedChart] = useState<'productivity' | 'sleep'>('productivity');
  const [sleepInput, setSleepInput] = useState({ sleepTime: '', wakeTime: '' });
  
  // Avatar system state
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('focusboost_gamestate');
    return saved ? JSON.parse(saved) : QuestSystem.createDefaultGameState();
  });
  const [questSystem] = useState(() => new QuestSystem(gameState));
  const [showShop, setShowShop] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showCottageEditor, setShowCottageEditor] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('focusboost_gamestate', JSON.stringify(gameState));
  }, [gameState]);

  // Extension connection logic (same as before)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;
    
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== window) return;
      
      if (event.data.type === 'FOCUSBOOST_EXTENSION_READY') {
        console.log('✅ FocusBoost extension detected');
        setExtensionStatus('connected');
        setRetryCount(0);
        requestData();
      } 
      else if (event.data.type === 'FOCUSBOOST_RESPONSE') {
        console.log('📊 Received data from extension:', event.data);
        
        if (event.data.action === 'getStats' && event.data.payload) {
          setData(event.data.payload);
          setExtensionStatus('connected');
          
          // Update avatar system with new data
          updateAvatarSystem(event.data.payload);
        }
      }
      else if (event.data.type === 'FOCUSBOOST_ERROR') {
        console.error('❌ Extension error:', event.data.error);
        setExtensionStatus('disconnected');
      }
    };

    const requestData = () => {
      console.log('📡 Requesting data from extension...');
      window.postMessage({ 
        type: 'FOCUSBOOST_REQUEST', 
        action: 'getStats' 
      }, '*');
    };

    const checkExtension = () => {
      if (extensionStatus === 'checking' && retryCount < 5) {
        console.log(`🔍 Checking for extension... attempt ${retryCount + 1}/5`);
        setRetryCount(prev => prev + 1);
        window.postMessage({ type: 'FOCUSBOOST_PING' }, '*');
        requestData();
      } else if (retryCount >= 5 && extensionStatus === 'checking') {
        console.log('⚠️ Extension not found after 5 attempts');
        setExtensionStatus('disconnected');
      }
    };

    window.addEventListener('message', handleMessage);
    timeoutId = setTimeout(checkExtension, 1000);
    
    if (extensionStatus === 'checking') {
      intervalId = setInterval(checkExtension, 2000);
    }

    const maxTimeout = setTimeout(() => {
      if (extensionStatus === 'checking') {
        console.log('⏰ Extension check timeout - switching to disconnected mode');
        setExtensionStatus('disconnected');
      }
    }, 15000);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
      clearTimeout(maxTimeout);
    };
  }, [extensionStatus, retryCount]);

  // Periodic data refresh and avatar updates
  useEffect(() => {
    if (extensionStatus === 'connected') {
      console.log('🔄 Setting up periodic data refresh');
      const interval = setInterval(() => {
        window.postMessage({ type: 'FOCUSBOOST_REQUEST', action: 'getStats' }, '*');
      }, 10000); // Refresh every 10 seconds for more responsive avatar updates
      
      return () => {
        console.log('🛑 Stopping periodic refresh');
        clearInterval(interval);
      };
    }
  }, [extensionStatus]);

  // Update avatar system when extension data changes
  const updateAvatarSystem = (extensionData: ExtensionData) => {
    setGameState(prevState => {
      const newState = { ...prevState };
      
      // Update quest progress
      questSystem.updateQuestProgress(extensionData);
      
      // Update avatar mood
      questSystem.updateAvatarMood(extensionData);
      
      // Update avatar stats
      newState.avatar.stats.totalFocusTime = extensionData.productivityStats.productiveTime;
      newState.avatar.stats.tasksCompleted = extensionData.productivityStats.sessionCount;
      
      // Check for achievements
      const newAchievements = questSystem.checkAchievements(extensionData);
      if (newAchievements.length > 0) {
        const achievementNames = newAchievements.map(a => a.title).join(', ');
        setNotifications(prev => [...prev, `🏆 Achievement unlocked: ${achievementNames}!`]);
      }
      
      // Award XP for current activity
      const currentCategory = extensionData.currentSession?.category;
      if (currentCategory && ['ai', 'development', 'productive', 'educational'].includes(currentCategory)) {
        const xpGain = questSystem.calculateActivityXP(currentCategory, 10000); // 10 seconds
        if (xpGain > 0) {
          newState.avatar.xp += xpGain;
          
          // Check for level up
          if (newState.avatar.xp >= newState.avatar.xpToNextLevel) {
            const oldLevel = newState.avatar.level;
            newState.avatar.level += 1;
            newState.avatar.xp -= newState.avatar.xpToNextLevel;
            newState.avatar.xpToNextLevel = Math.floor(100 * Math.pow(1.2, newState.avatar.level - 1));
            
            // Level up rewards
            newState.currency.focusPoints += newState.avatar.level * 10;
            newState.currency.sleepCoins += newState.avatar.level * 5;
            
            setNotifications(prev => [...prev, `🎉 Level up! You reached level ${newState.avatar.level}!`]);
          }
        }
      }
      
      return newState;
    });
  };

  // Generate new daily quests
  const generateNewQuests = () => {
    setGameState(prevState => ({
      ...prevState,
      quests: [
        ...prevState.quests.filter(q => q.duration !== 'daily'),
        ...questSystem.generateDailyQuests()
      ]
    }));
  };

  // Handle quest completion
  const handleQuestComplete = (questId: string) => {
    const result = questSystem.completeQuest(questId);
    
    if (result.xpGained > 0) {
      setGameState(prevState => ({ ...prevState })); // Trigger re-render
      
      const quest = gameState.quests.find(q => q.id === questId);
      if (quest) {
        setNotifications(prev => [...prev, 
          `✅ Quest completed: ${quest.title}! +${result.xpGained} XP`
        ]);
      }
    }
  };

  // Handle shop purchases
  const handlePurchase = (itemId: string) => {
    // This would implement the actual purchase logic
    console.log('🛒 Purchase item:', itemId);
    setNotifications(prev => [...prev, '🛍️ Item purchased successfully!']);
  };

  // Handle sleep logging
  const handleSleepLog = (sleepTime: string, wakeTime: string) => {
    if (extensionStatus === 'connected') {
      const sleepTimestamp = new Date(`${new Date().toDateString()} ${sleepTime}`).getTime();
      const wakeTimestamp = new Date(`${new Date().toDateString()} ${wakeTime}`).getTime();
      
      console.log('😴 Logging sleep data to extension');
      window.postMessage({
        type: 'FOCUSBOOST_REQUEST',
        action: 'logSleep',
        payload: { sleepTime: sleepTimestamp, wakeTime: wakeTimestamp }
      }, '*');
    }
    
    // Update avatar system
    const sleepHours = (new Date(`${new Date().toDateString()} ${wakeTime}`).getTime() - 
                      new Date(`${new Date().toDateString()} ${sleepTime}`).getTime()) / (1000 * 60 * 60);
    
    setGameState(prevState => {
      const newState = { ...prevState };
      
      // Update sleep quest progress
      const sleepQuest = newState.quests.find(q => q.type === 'sleep' && !q.completed);
      if (sleepQuest && sleepHours >= 7) {
        sleepQuest.progress = sleepHours;
        sleepQuest.completed = true;
        
        // Award quest rewards
        newState.avatar.xp += sleepQuest.reward.xp;
        newState.currency.sleepCoins += sleepQuest.reward.sleepCoins || 0;
        
        setNotifications(prev => [...prev, '😴 Good sleep logged! Quest completed!']);
      }
      
      return newState;
    });
  };

  // Handle settings actions
  const handleExportData = () => {
    if (extensionStatus === 'connected') {
      window.postMessage({ type: 'FOCUSBOOST_REQUEST', action: 'exportData' }, '*');
    }
    
    // Also export avatar data
    const exportData = {
      extensionData: data,
      gameState: gameState,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusboost-complete-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (extensionStatus === 'connected' && 
        confirm('Are you sure you want to reset ALL data including your avatar? This action cannot be undone.')) {
      window.postMessage({ type: 'FOCUSBOOST_REQUEST', action: 'resetData' }, '*');
      
      // Reset avatar data
      setGameState(QuestSystem.createDefaultGameState());
      localStorage.removeItem('focusboost_gamestate');
    }
  };

  // Auto-dismiss notifications
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  // Generate new daily quests at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timeout = setTimeout(() => {
      generateNewQuests();
      setNotifications(prev => [...prev, '🌅 New daily quests available!']);
    }, msUntilMidnight);
    
    return () => clearTimeout(timeout);
  }, []);

  const renderCurrentPage = (): JSX.Element => {
    // Show loading state while checking for extension
    if (extensionStatus === 'checking') {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Connecting to FocusBoost extension...</p>
            <p className="text-sm text-gray-500">Attempt {retryCount}/5</p>
          </div>
        </div>
      );
    }

    // Avatar page doesn't require extension data, can always be shown
    if (currentPage === 'avatar') {
      return (
        <AvatarHomePage
          avatar={gameState.avatar}
          currency={gameState.currency}
          quests={gameState.quests}
          currentSession={data?.currentSession}
          onQuestComplete={handleQuestComplete}
          onOpenShop={() => setShowShop(true)}
          onOpenCustomizer={() => setShowCustomizer(true)}
          onOpenCottageEditor={() => setShowCottageEditor(true)}
        />
      );
    }

    // Settings page doesn't require extension data
    if (currentPage === 'settings') {
      return (
        <SettingsPage 
          extensionStatus={extensionStatus}
          onExportData={handleExportData}
          onResetData={handleResetData}
        />
      );
    }

    // For other pages that require extension data, check if data exists
    if (!data) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Collecting Data...</h3>
            <p className="text-gray-600 mb-4">
              {extensionStatus === 'disconnected' 
                ? 'Please install and enable the FocusBoost browser extension to track your productivity.'
                : 'Start browsing to see your productivity insights appear here.'
              }
            </p>
            {extensionStatus === 'disconnected' && (
              <button 
                onClick={() => {
                  setExtensionStatus('checking');
                  setRetryCount(0);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      );
    }

    // Now we know data is not null, safe to pass to components
    const pageProps = {
      data, // TypeScript now knows data is ExtensionData, not null
      selectedPeriod,
      setSelectedPeriod,
      selectedChart,
      setSelectedChart,
      extensionStatus
    };

    switch (currentPage) {
      case 'overview': 
        return <OverviewPage {...pageProps} />;
      case 'analytics': 
        return <AnalyticsPage {...pageProps} />;
      case 'sleep': 
        return (
          <SleepPage 
            {...pageProps} 
            sleepInput={sleepInput} 
            setSleepInput={setSleepInput}
            onSleepLog={handleSleepLog}
          />
        );
      default: 
        return (
          <AvatarHomePage
            avatar={gameState.avatar}
            currency={gameState.currency}
            quests={gameState.quests}
            currentSession={data.currentSession}
            onQuestComplete={handleQuestComplete}
            onOpenShop={() => setShowShop(true)}
            onOpenCustomizer={() => setShowCustomizer(true)}
            onOpenCottageEditor={() => setShowCottageEditor(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Updated Navigation with Avatar Page */}
      <Navigation 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        extensionStatus={extensionStatus}
        gameState={gameState} // Pass game state for avatar info in nav
      />
      
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-6 z-50 space-y-2">
          {notifications.slice(0, 3).map((notification, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in-right"
            >
              {notification}
            </div>
          ))}
        </div>
      )}
      
      {/* Main Content */}
      <div className={currentPage === 'avatar' ? '' : 'max-w-7xl mx-auto p-6'}>
        {currentPage !== 'avatar' && (
          <StatusBanner 
            extensionStatus={extensionStatus} 
            retryCount={retryCount} 
          />
        )}
        {renderCurrentPage()}
      </div>

      {/* Modals */}
      {showShop && (
        <AvatarShop
          currency={gameState.currency}
          inventory={gameState.inventory}
          avatarLevel={gameState.avatar.level}
          onPurchase={handlePurchase}
          onClose={() => setShowShop(false)}
        />
      )}

      {showCustomizer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Avatar Customizer</h2>
              <button
                onClick={() => setShowCustomizer(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                👤
              </div>
              <p className="text-gray-600">Avatar customization coming soon!</p>
              <p className="text-sm text-gray-500 mt-2">
                Unlock new appearances and outfits by completing quests and leveling up.
              </p>
            </div>
          </div>
        </div>
      )}

      {showCottageEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Cottage Editor</h2>
              <button
                onClick={() => setShowCottageEditor(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                🏠
              </div>
              <p className="text-gray-600">Cottage editor coming soon!</p>
              <p className="text-sm text-gray-500 mt-2">
                Customize your cozy digital space with furniture and decorations from the shop.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;