import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { CurrentActivity } from './components/CurrentActivity';
import { TabList, RecentActivityList } from './components/TabList';
import { StatsPanel } from './components/StatsPanel';
import { ExtensionPrompt } from './components/ExtensionPrompt';
import { useTabTracker } from './hooks/useTabTracker';
import { useExtensionIntegration } from './hooks/useExtensionIntegration';

function App() {
  const {
    currentTab: simulatedCurrentTab,
    recentActivity: simulatedRecentActivity,
    isTracking: simulatedIsTracking,
    sessionTime: simulatedSessionTime,
    getTopTabs: getSimulatedTopTabs,
    getCategoryStats: getSimulatedCategoryStats,
    getProductivityStats: getSimulatedProductivityStats,
    startTracking: startSimulatedTracking,
    pauseTracking: pauseSimulatedTracking,
    resetData: resetSimulatedData,
    exportData: exportSimulatedData
  } = useTabTracker();

  const {
    extensionAvailable,
    extensionData,
    isLoading,
    startTracking: startExtensionTracking,
    pauseTracking: pauseExtensionTracking,
    resetData: resetExtensionData,
    exportData: exportExtensionData
  } = useExtensionIntegration();

  const [notification, setNotification] = useState<{ title: string; message: string } | null>(null);

  // Use extension data if available, otherwise fall back to simulated data
  const isUsingExtension = extensionAvailable && extensionData;
  
  const currentTab = isUsingExtension ? extensionData.currentTab : simulatedCurrentTab;
  const recentActivity = isUsingExtension ? (extensionData.recentActivity || []) : simulatedRecentActivity;
  const isTracking = isUsingExtension ? extensionData.isTracking : simulatedIsTracking;
  const sessionTime = isUsingExtension ? extensionData.sessionTime : simulatedSessionTime;
  const topTabs = isUsingExtension ? extensionData.topTabs : getSimulatedTopTabs();
  const categoryStats = isUsingExtension ? extensionData.categoryStats : getSimulatedCategoryStats();
  const productivityStats = isUsingExtension ? extensionData.productivityStats : getSimulatedProductivityStats();

  const showNotification = (title: string, message: string) => {
    setNotification({ title, message });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    if (currentTab) {
      showNotification('Tab Switch Detected', `Now tracking: ${currentTab.title}`);
    }
  }, [currentTab]);

  useEffect(() => {
    if (extensionAvailable) {
      showNotification('Extension Connected', 'FocusBoost extension is now tracking your real browser activity!');
    }
  }, [extensionAvailable]);

  const handleStart = () => {
    if (isUsingExtension) {
      startExtensionTracking();
    } else {
      startSimulatedTracking();
    }
    showNotification('Tracking Started', 'FocusBoost is now monitoring your activity');
  };

  const handlePause = () => {
    if (isUsingExtension) {
      pauseExtensionTracking();
    } else {
      pauseSimulatedTracking();
    }
    showNotification('Tracking Paused', 'Tab monitoring has been paused');
  };

  const handleReset = () => {
    if (isUsingExtension) {
      resetExtensionData();
    } else {
      resetSimulatedData();
    }
    showNotification('Data Reset', 'All tracking data has been cleared');
  };

  const handleExport = () => {
    if (isUsingExtension) {
      exportExtensionData();
    } else {
      exportSimulatedData();
    }
    showNotification('Data Exported', 'Your tracking data has been downloaded');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Connecting to FocusBoost Extension...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {!extensionAvailable && <ExtensionPrompt />}
        
        <Header
          isTracking={isTracking}
          sessionTime={sessionTime}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
          onExport={handleExport}
          isUsingExtension={isUsingExtension}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            <CurrentActivity currentTab={currentTab} />
            
            <TabList
              tabs={topTabs}
              title="Top 10 Most Visited Tabs"
              icon="trophy"
              isLive={true}
            />

            <RecentActivityList activities={recentActivity} />
          </div>

          <div className="xl:col-span-1">
            <StatsPanel
              productivityStats={productivityStats}
              categoryStats={categoryStats}
            />
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed top-6 right-6 bg-white rounded-xl p-4 shadow-2xl border-l-4 border-blue-500 transform transition-all duration-300 animate-slide-in-right max-w-sm z-50">
          <div className="font-semibold text-gray-900 mb-1">{notification.title}</div>
          <div className="text-sm text-gray-600">{notification.message}</div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;