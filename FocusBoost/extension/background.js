// Background service worker for FocusBoost extension
class TabTracker {
  constructor() {
    this.currentTab = null;
    this.sessionStartTime = Date.now();
    this.isTracking = true;
    this.tabSessions = new Map();
    this.categoryRules = this.initializeCategoryRules();
    
    this.init();
  }

  init() {
    // Load saved data
    this.loadData();
    
    // Set up event listeners
    chrome.tabs.onActivated.addListener((activeInfo) => {
      this.handleTabSwitch(activeInfo.tabId);
    });

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.active) {
        this.handleTabSwitch(tabId);
      }
    });

    chrome.tabs.onRemoved.addListener((tabId) => {
      this.handleTabClose(tabId);
    });

    chrome.windows.onFocusChanged.addListener((windowId) => {
      if (windowId === chrome.windows.WINDOW_ID_NONE) {
        this.handleWindowBlur();
      } else {
        this.handleWindowFocus(windowId);
      }
    });

    // Periodic data save
    setInterval(() => {
      this.saveData();
    }, 30000); // Save every 30 seconds

    // Get initial active tab
    this.getCurrentActiveTab();
  }

  initializeCategoryRules() {
    return {
      productive: [
        'docs.google.com', 'github.com', 'stackoverflow.com', 'codepen.io',
        'jsfiddle.net', 'codesandbox.io', 'notion.so', 'obsidian.md',
        'trello.com', 'asana.com', 'slack.com', 'zoom.us', 'teams.microsoft.com',
        'office.com', 'figma.com', 'canva.com', 'adobe.com', 'vscode.dev'
      ],
      entertainment: [
        'youtube.com', 'netflix.com', 'twitch.tv', 'spotify.com',
        'soundcloud.com', 'hulu.com', 'disneyplus.com', 'primevideo.com',
        'tiktok.com', 'instagram.com', 'snapchat.com'
      ],
      social: [
        'facebook.com', 'twitter.com', 'x.com', 'linkedin.com', 'reddit.com',
        'discord.com', 'telegram.org', 'whatsapp.com', 'messenger.com'
      ],
      educational: [
        'coursera.org', 'udemy.com', 'khanacademy.org', 'edx.org',
        'wikipedia.org', 'w3schools.com', 'mdn.mozilla.org', 'freecodecamp.org',
        'codecademy.com', 'pluralsight.com', 'lynda.com'
      ],
      news: [
        'news.google.com', 'cnn.com', 'bbc.com', 'reuters.com',
        'techcrunch.com', 'theverge.com', 'ycombinator.com', 'medium.com',
        'hackernews', 'news.ycombinator.com'
      ],
      shopping: [
        'amazon.com', 'ebay.com', 'etsy.com', 'shopify.com',
        'walmart.com', 'target.com', 'alibaba.com', 'bestbuy.com'
      ],
      work: [
        'office.com', 'google.com/drive', 'dropbox.com', 'onedrive.com',
        'salesforce.com', 'hubspot.com', 'mailchimp.com', 'jira.atlassian.com'
      ]
    };
  }

  categorizeUrl(url, title = '') {
    const urlLower = url.toLowerCase();
    const titleLower = title.toLowerCase();
    
    for (const [category, domains] of Object.entries(this.categoryRules)) {
      for (const domain of domains) {
        if (urlLower.includes(domain) || titleLower.includes(domain)) {
          return category;
        }
      }
    }
    
    return 'other';
  }

  async getCurrentActiveTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        this.handleTabSwitch(tab.id);
      }
    } catch (error) {
      console.error('Error getting active tab:', error);
    }
  }

  async handleTabSwitch(tabId) {
    if (!this.isTracking) return;

    try {
      // End current session
      if (this.currentTab) {
        this.endCurrentSession();
      }

      // Get new tab info
      const tab = await chrome.tabs.get(tabId);
      if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        return;
      }

      // Start new session
      this.startNewSession(tab);
    } catch (error) {
      console.error('Error handling tab switch:', error);
    }
  }

  handleTabClose(tabId) {
    if (this.currentTab && this.currentTab.id === tabId) {
      this.endCurrentSession();
      this.currentTab = null;
    }
  }

  handleWindowBlur() {
    if (this.currentTab) {
      this.currentTab.isActive = false;
    }
  }

  async handleWindowFocus(windowId) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, windowId: windowId });
      if (tab) {
        this.handleTabSwitch(tab.id);
      }
    } catch (error) {
      console.error('Error handling window focus:', error);
    }
  }

  startNewSession(tab) {
    const category = this.categorizeUrl(tab.url, tab.title);
    const favicon = tab.favIconUrl || this.getFaviconUrl(tab.url);

    this.currentTab = {
      id: tab.id,
      url: tab.url,
      title: tab.title,
      category,
      favicon,
      startTime: Date.now(),
      isActive: true
    };

    // Add to recent activity
    this.addToRecentActivity({
      ...this.currentTab,
      action: 'switched',
      timestamp: new Date().toISOString()
    });

    // Notify dashboard
    this.notifyDashboard('tabSwitch', this.currentTab);
  }

  endCurrentSession() {
    if (!this.currentTab) return;

    const sessionTime = Date.now() - this.currentTab.startTime;
    const key = this.currentTab.url;

    // Get existing data or create new
    let tabData = this.tabSessions.get(key) || {
      url: this.currentTab.url,
      title: this.currentTab.title,
      category: this.currentTab.category,
      favicon: this.currentTab.favicon,
      timeSpent: 0,
      visits: 0,
      lastVisit: 0
    };

    // Update data
    tabData.timeSpent += sessionTime;
    tabData.visits += 1;
    tabData.lastVisit = Date.now();
    tabData.title = this.currentTab.title; // Update title in case it changed

    this.tabSessions.set(key, tabData);
    this.saveData();
  }

  addToRecentActivity(activity) {
    chrome.storage.local.get(['recentActivity'], (result) => {
      let recentActivity = result.recentActivity || [];
      recentActivity.unshift(activity);
      
      // Keep only last 50 activities
      if (recentActivity.length > 50) {
        recentActivity = recentActivity.slice(0, 50);
      }
      
      chrome.storage.local.set({ recentActivity });
    });
  }

  getFaviconUrl(url) {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?sz=32&domain=${domain}`;
    } catch {
      return '';
    }
  }

  async loadData() {
    try {
      const result = await chrome.storage.local.get([
        'tabSessions', 
        'sessionStartTime', 
        'isTracking'
      ]);
      
      if (result.tabSessions) {
        this.tabSessions = new Map(Object.entries(result.tabSessions));
      }
      
      if (result.sessionStartTime) {
        this.sessionStartTime = result.sessionStartTime;
      }
      
      if (result.isTracking !== undefined) {
        this.isTracking = result.isTracking;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  async saveData() {
    try {
      const data = {
        tabSessions: Object.fromEntries(this.tabSessions),
        sessionStartTime: this.sessionStartTime,
        isTracking: this.isTracking,
        lastSaved: Date.now()
      };
      
      await chrome.storage.local.set(data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  notifyDashboard(type, data) {
    // Send message to dashboard if it's open
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.url && tab.url.includes('localhost') && tab.url.includes('5173')) {
          chrome.tabs.sendMessage(tab.id, {
            type: 'FOCUSBOOST_UPDATE',
            payload: { type, data }
          }).catch(() => {
            // Dashboard tab might not be ready, ignore error
          });
        }
      });
    });
  }

  // API methods for popup and dashboard
  async getStats() {
    const tabs = Array.from(this.tabSessions.values());
    const categoryStats = {};
    let productiveTime = 0;
    let entertainmentTime = 0;
    let totalTime = 0;

    tabs.forEach(tab => {
      totalTime += tab.timeSpent;
      
      if (!categoryStats[tab.category]) {
        categoryStats[tab.category] = 0;
      }
      categoryStats[tab.category] += tab.timeSpent;

      if (['productive', 'work', 'educational'].includes(tab.category)) {
        productiveTime += tab.timeSpent;
      } else if (['entertainment', 'social'].includes(tab.category)) {
        entertainmentTime += tab.timeSpent;
      }
    });

    const productivityScore = totalTime > 0 ? Math.round((productiveTime / totalTime) * 100) : 0;

    return {
      currentTab: this.currentTab,
      topTabs: tabs.sort((a, b) => b.timeSpent - a.timeSpent).slice(0, 10),
      categoryStats,
      productivityStats: {
        productiveTime,
        entertainmentTime,
        totalTime,
        productivityScore
      },
      sessionTime: Math.floor((Date.now() - this.sessionStartTime) / 1000),
      isTracking: this.isTracking
    };
  }

  startTracking() {
    this.isTracking = true;
    this.saveData();
    this.getCurrentActiveTab();
  }

  pauseTracking() {
    this.isTracking = false;
    if (this.currentTab) {
      this.endCurrentSession();
      this.currentTab = null;
    }
    this.saveData();
  }

  resetData() {
    this.tabSessions.clear();
    this.currentTab = null;
    this.sessionStartTime = Date.now();
    chrome.storage.local.clear();
  }

  async exportData() {
    const stats = await this.getStats();
    const result = await chrome.storage.local.get(['recentActivity']);
    
    const exportData = {
      ...stats,
      recentActivity: result.recentActivity || [],
      exportedAt: new Date().toISOString()
    };

    return exportData;
  }
}

// Initialize tracker
const tracker = new TabTracker();

// Message handler for popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'getStats':
      tracker.getStats().then(sendResponse);
      return true;
    
    case 'startTracking':
      tracker.startTracking();
      sendResponse({ success: true });
      break;
    
    case 'pauseTracking':
      tracker.pauseTracking();
      sendResponse({ success: true });
      break;
    
    case 'resetData':
      tracker.resetData();
      sendResponse({ success: true });
      break;
    
    case 'exportData':
      tracker.exportData().then(sendResponse);
      return true;
    
    default:
      sendResponse({ error: 'Unknown action' });
  }
});