import { useState, useEffect, useCallback } from 'react';
import { Tab, RecentActivity, ProductivityStats, CategoryStats } from '../types';
import { tabTracker } from '../utils/tabTracker';

const SIMULATED_TABS = [
  { url: 'https://docs.google.com/document/d/abc123', title: 'Project Proposal - Google Docs' },
  { url: 'https://github.com/user/project', title: 'GitHub - user/project' },
  { url: 'https://stackoverflow.com/questions/12345', title: 'JavaScript async/await - Stack Overflow' },
  { url: 'https://youtube.com/watch?v=abc123', title: 'React Tutorial - YouTube' },
  { url: 'https://twitter.com/home', title: 'Twitter / Home' },
  { url: 'https://netflix.com/browse', title: 'Netflix - Browse' },
  { url: 'https://reddit.com/r/programming', title: 'r/programming - Reddit' },
  { url: 'https://linkedin.com/feed', title: 'LinkedIn | Feed' },
  { url: 'https://news.google.com', title: 'Google News' },
  { url: 'https://amazon.com/dp/B08N5WRWNW', title: 'Amazon.com: Product Page' },
  { url: 'https://coursera.org/learn/machine-learning', title: 'Machine Learning Course - Coursera' },
  { url: 'https://zoom.us/j/123456789', title: 'Zoom Meeting' },
  { url: 'https://slack.com/messages/general', title: 'Slack - #general' },
  { url: 'https://discord.com/channels/123', title: 'Discord - General' },
  { url: 'https://twitch.tv/streamer', title: 'Twitch - Live Stream' },
  { url: 'https://figma.com/file/123', title: 'Design System - Figma' },
  { url: 'https://notion.so/workspace', title: 'Workspace - Notion' },
  { url: 'https://w3schools.com/js/', title: 'JavaScript Tutorial - W3Schools' },
  { url: 'https://medium.com/@author/article', title: 'How to Build React Apps - Medium' }
];

export const useTabTracker = () => {
  const [tabs, setTabs] = useState<Map<string, Tab>>(new Map());
  const [currentTab, setCurrentTab] = useState<Tab | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isTracking, setIsTracking] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  // Session timer
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTracking]);

  // Simulate tab switching
  useEffect(() => {
    if (!isTracking) return;

    const simulateTabSwitch = () => {
      // End current tab session if exists
      if (currentTab) {
        const timeSpent = Date.now() - (currentTab.startTime || Date.now());
        
        setTabs(prevTabs => {
          const newTabs = new Map(prevTabs);
          const key = currentTab.url;
          
          if (newTabs.has(key)) {
            const existing = newTabs.get(key)!;
            existing.timeSpent += timeSpent;
            existing.visits += 1;
            existing.lastVisit = Date.now();
          } else {
            newTabs.set(key, {
              ...currentTab,
              timeSpent,
              visits: 1,
              lastVisit: Date.now()
            });
          }
          
          return newTabs;
        });
      }

      // Start new tab session
      const tab = SIMULATED_TABS[currentTabIndex % SIMULATED_TABS.length];
      const category = tabTracker.categorizeUrl(tab.url, tab.title);
      const favicon = tabTracker.getFaviconUrl(tab.url);
      
      const newTab: Tab = {
        ...tab,
        category,
        favicon,
        timeSpent: 0,
        visits: 0,
        lastVisit: Date.now(),
        startTime: Date.now()
      };

      setCurrentTab(newTab);
      setCurrentTabIndex(prev => prev + 1);

      // Add to recent activity
      const activity: RecentActivity = {
        ...newTab,
        action: 'switched',
        timestamp: new Date().toISOString()
      };

      setRecentActivity(prev => [activity, ...prev.slice(0, 19)]);
    };

    // Initial delay then random intervals
    const timeout = setTimeout(() => {
      simulateTabSwitch();
      
      const scheduleNext = () => {
        const nextInterval = Math.random() * 75000 + 15000; // 15-90 seconds
        setTimeout(() => {
          if (isTracking) {
            simulateTabSwitch();
            scheduleNext();
          }
        }, nextInterval);
      };
      
      scheduleNext();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isTracking, currentTab, currentTabIndex]);

  const getTopTabs = useCallback(() => {
    return Array.from(tabs.values())
      .sort((a, b) => b.timeSpent - a.timeSpent)
      .slice(0, 10);
  }, [tabs]);

  const getCategoryStats = useCallback((): CategoryStats => {
    const stats: CategoryStats = {};
    
    tabs.forEach(tab => {
      if (!stats[tab.category]) {
        stats[tab.category] = 0;
      }
      stats[tab.category] += tab.timeSpent;
    });

    return stats;
  }, [tabs]);

  const getProductivityStats = useCallback((): ProductivityStats => {
    let productiveTime = 0;
    let entertainmentTime = 0;
    let totalTime = 0;

    tabs.forEach(tab => {
      totalTime += tab.timeSpent;
      if (tab.category === 'productive' || tab.category === 'work' || tab.category === 'educational') {
        productiveTime += tab.timeSpent;
      } else if (tab.category === 'entertainment' || tab.category === 'social') {
        entertainmentTime += tab.timeSpent;
      }
    });

    const productivityScore = totalTime > 0 ? Math.round((productiveTime / totalTime) * 100) : 0;

    return {
      productiveTime,
      entertainmentTime,
      totalTime,
      productivityScore
    };
  }, [tabs]);

  const startTracking = () => setIsTracking(true);
  const pauseTracking = () => setIsTracking(false);
  
  const resetData = () => {
    setTabs(new Map());
    setRecentActivity([]);
    setCurrentTab(null);
    setSessionTime(0);
  };

  const exportData = () => {
    const data = {
      tabs: Array.from(tabs.entries()),
      recentActivity,
      sessionTime,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusboost-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    tabs,
    currentTab,
    recentActivity,
    isTracking,
    sessionTime,
    getTopTabs,
    getCategoryStats,
    getProductivityStats,
    startTracking,
    pauseTracking,
    resetData,
    exportData
  };
};