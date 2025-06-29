import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import MainDashboard from './components/MainDashboard';
import AnalyticsPage from './components/AnalyticsPage';
import FlashcardSystem from './components/flashcards/FlashcardSystem';
import Sidebar from './components/Sidebar';
import { useRealTimeData } from './hooks/useRealTimeData';
import { ProductivityProvider } from './contexts/ProductivityContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './hooks/useAuth';
import { extensionBridge } from './services/extensionBridge';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const { currentActivity, isConnected } = useRealTimeData();

  useEffect(() => {
    // Initialize extension bridge and send auth token if available
    const token = localStorage.getItem('accessToken');
    if (token && extensionBridge.isAvailable()) {
      extensionBridge.sendToExtension({
        type: 'SET_AUTH_TOKEN',
        token: token
      });
    }
  }, []);

  const views = {
    dashboard: 'Dashboard',
    analytics: 'Analytics',
    flashcards: 'Study',
    avatar: 'Avatar',
    settings: 'Settings'
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <MainDashboard />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'flashcards':
        return <FlashcardSystem />;
      case 'avatar':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Avatar System</h1>
              <p className="text-gray-600">Coming soon with advanced body type integration</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Settings</h1>
              <p className="text-gray-600">Advanced configuration options coming soon</p>
            </div>
          </div>
        );
      default:
        return <MainDashboard />;
    }
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <ProductivityProvider>
          <div className="min-h-screen font-inter bg-gray-50">
            {/* Professional Header */}
            <Header 
              currentActivity={currentActivity}
              isConnected={isConnected}
              onMenuClick={() => setSidebarOpen(!sidebarOpen)}
              currentView={currentView}
              onViewChange={setCurrentView}
              views={views}
            />

            <div className="flex">
              {/* Enhanced Sidebar */}
              <AnimatePresence mode="wait">
                {sidebarOpen && (
                  <motion.div
                    initial={{ x: -320, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -320, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="fixed inset-y-0 left-0 z-50 w-80 shadow-xl lg:relative lg:translate-x-0"
                  >
                    <Sidebar 
                      onClose={() => setSidebarOpen(false)} 
                      currentView={currentView}
                      onViewChange={setCurrentView}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Content with View Switching */}
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentView}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderCurrentView()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </div>
        </ProductivityProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;