import { useState, useEffect, useCallback } from 'react';
import { Tab, RecentActivity, ProductivityStats, CategoryStats } from '../types';

interface ExtensionData {
  currentTab: Tab | null;
  topTabs: Tab[];
  categoryStats: CategoryStats;
  productivityStats: ProductivityStats;
  sessionTime: number;
  isTracking: boolean;
  recentActivity?: RecentActivity[];
}

export const useExtensionIntegration = () => {
  const [extensionAvailable, setExtensionAvailable] = useState(false);
  const [extensionData, setExtensionData] = useState<ExtensionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for extension messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== window) return;

      switch (event.data.type) {
        case 'FOCUSBOOST_EXTENSION_READY':
          setExtensionAvailable(true);
          setIsLoading(false);
          requestExtensionData();
          break;

        case 'FOCUSBOOST_EXTENSION_DATA':
          if (event.data.payload.type === 'tabSwitch') {
            // Handle real-time tab switch
            setExtensionData(prev => prev ? {
              ...prev,
              currentTab: event.data.payload.data
            } : null);
          }
          break;

        case 'FOCUSBOOST_RESPONSE':
          if (event.data.action === 'getStats') {
            setExtensionData(event.data.payload);
          }
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    // Check if extension is available after a short delay
    setTimeout(() => {
      if (!extensionAvailable) {
        setIsLoading(false);
      }
    }, 2000);

    return () => window.removeEventListener('message', handleMessage);
  }, [extensionAvailable]);

  const requestExtensionData = useCallback(() => {
    if (!extensionAvailable) return;

    window.postMessage({
      type: 'FOCUSBOOST_REQUEST',
      action: 'getStats'
    }, '*');
  }, [extensionAvailable]);

  const sendExtensionCommand = useCallback((action: string, payload?: any) => {
    if (!extensionAvailable) return;

    window.postMessage({
      type: 'FOCUSBOOST_REQUEST',
      action,
      payload
    }, '*');

    // Refresh data after command
    setTimeout(requestExtensionData, 500);
  }, [extensionAvailable, requestExtensionData]);

  // Periodically refresh data
  useEffect(() => {
    if (!extensionAvailable) return;

    const interval = setInterval(requestExtensionData, 5000);
    return () => clearInterval(interval);
  }, [extensionAvailable, requestExtensionData]);

  const startTracking = () => sendExtensionCommand('startTracking');
  const pauseTracking = () => sendExtensionCommand('pauseTracking');
  const resetData = () => sendExtensionCommand('resetData');
  const exportData = () => sendExtensionCommand('exportData');

  return {
    extensionAvailable,
    extensionData,
    isLoading,
    startTracking,
    pauseTracking,
    resetData,
    exportData,
    refreshData: requestExtensionData
  };
};