import { useState, useEffect } from 'react';

interface ExtensionData {
  currentActivity: {
    name: string;
    category: string;
    duration: number;
    productivityScore: number;
    url?: string;
    domain?: string;
  };
  isConnected: boolean;
  recentActivities: Activity[];
  dailyStats: {
    productivityScore: number;
    focusTime: number;
    distractions: number;
    categoriesUsed: string[];
  };
}

interface Activity {
  id: string;
  name: string;
  category: string;
  duration: number;
  productivityScore: number;
  timestamp: number;
  url?: string;
  domain?: string;
}

export const useExtensionData = (): ExtensionData => {
  const [extensionData, setExtensionData] = useState<ExtensionData>({
    currentActivity: {
      name: 'VS Code - React Development',
      category: 'Development',
      duration: 9252, // 2h 34m 12s
      productivityScore: 85
    },
    isConnected: false,
    recentActivities: [],
    dailyStats: {
      productivityScore: 87,
      focusTime: 6.2,
      distractions: 12,
      categoriesUsed: ['Development', 'AI Tools', 'Communication', 'Learning']
    }
  });

  useEffect(() => {
    // Check if extension is available
    const checkExtension = () => {
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
        setExtensionData(prev => ({ ...prev, isConnected: true }));
        setupExtensionListeners();
      } else {
        // Extension not available, use simulated data
        setExtensionData(prev => ({ ...prev, isConnected: false }));
        setupSimulatedData();
      }
    };

    const setupExtensionListeners = () => {
      // Listen for messages from extension
      window.addEventListener('message', (event) => {
        if (event.data.type === 'FOCUSBOOST_EXTENSION_DATA') {
          handleExtensionData(event.data);
        }
      });

      // Request initial data from extension
      if (chrome.runtime) {
        chrome.runtime.sendMessage({ type: 'GET_CURRENT_SESSION' }, (response) => {
          if (response) {
            updateCurrentActivity(response);
          }
        });
      }
    };

    const setupSimulatedData = () => {
      // Simulate real-time updates for demo purposes
      const interval = setInterval(() => {
        setExtensionData(prev => ({
          ...prev,
          currentActivity: {
            ...prev.currentActivity,
            duration: prev.currentActivity.duration + 1
          }
        }));
      }, 1000);

      // Simulate activity changes
      const activityInterval = setInterval(() => {
        const activities = [
          { name: 'VS Code - React Development', category: 'Development', score: 85 },
          { name: 'Chrome - Stack Overflow', category: 'Learning', score: 75 },
          { name: 'Slack - Team Chat', category: 'Communication', score: 60 },
          { name: 'ChatGPT - Code Review', category: 'AI Tools', score: 90 },
          { name: 'GitHub - Pull Request', category: 'Development', score: 88 }
        ];

        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        
        setExtensionData(prev => ({
          ...prev,
          currentActivity: {
            name: randomActivity.name,
            category: randomActivity.category,
            duration: Math.floor(Math.random() * 300) + 60, // 1-5 minutes
            productivityScore: randomActivity.score
          },
          recentActivities: [
            {
              id: Date.now().toString(),
              name: prev.currentActivity.name,
              category: prev.currentActivity.category,
              duration: prev.currentActivity.duration,
              productivityScore: prev.currentActivity.productivityScore,
              timestamp: Date.now()
            },
            ...prev.recentActivities.slice(0, 19) // Keep last 20
          ]
        }));
      }, 30000 + Math.random() * 60000); // 30-90 seconds

      return () => {
        clearInterval(interval);
        clearInterval(activityInterval);
      };
    };

    const handleExtensionData = (data: any) => {
      switch (data.eventType) {
        case 'session_start':
          updateCurrentActivity(data.data);
          break;
        case 'session_update':
          updateSessionDuration(data.data);
          break;
        case 'session_end':
          addToRecentActivities(data.data);
          break;
        case 'daily_stats_update':
          updateDailyStats(data.data);
          break;
      }
    };

    const updateCurrentActivity = (sessionData: any) => {
      setExtensionData(prev => ({
        ...prev,
        currentActivity: {
          name: `${sessionData.title || sessionData.domain}`,
          category: sessionData.category?.primary || 'General',
          duration: sessionData.duration || 0,
          productivityScore: sessionData.productivityScore || 0,
          url: sessionData.url,
          domain: sessionData.domain
        }
      }));
    };

    const updateSessionDuration = (updateData: any) => {
      setExtensionData(prev => ({
        ...prev,
        currentActivity: {
          ...prev.currentActivity,
          duration: updateData.duration,
          productivityScore: updateData.productivityScore
        }
      }));
    };

    const addToRecentActivities = (sessionData: any) => {
      const activity: Activity = {
        id: sessionData.id,
        name: sessionData.title || sessionData.domain,
        category: sessionData.category?.primary || 'General',
        duration: sessionData.duration,
        productivityScore: sessionData.productivityScore,
        timestamp: new Date(sessionData.endTime).getTime(),
        url: sessionData.url,
        domain: sessionData.domain
      };

      setExtensionData(prev => ({
        ...prev,
        recentActivities: [activity, ...prev.recentActivities.slice(0, 19)]
      }));
    };

    const updateDailyStats = (statsData: any) => {
      setExtensionData(prev => ({
        ...prev,
        dailyStats: {
          ...prev.dailyStats,
          ...statsData
        }
      }));
    };

    checkExtension();
  }, []);

  return extensionData;
};