// FocusBoost Chrome Extension - Background Service Worker
class FocusBoostTracker {
  constructor() {
    this.currentSession = null;
    this.sessionStartTime = null;
    this.isTracking = true;
    this.apiEndpoint = 'http://localhost:3001/api';
    this.activityBuffer = [];
    this.lastActiveTab = null;
    
    this.initializeExtension();
  }

  initializeExtension() {
    // Listen for tab changes
    chrome.tabs.onActivated.addListener((activeInfo) => {
      this.handleTabChange(activeInfo.tabId);
    });

    // Listen for tab updates (URL changes)
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.active) {
        this.handleTabChange(tabId);
      }
    });

    // Listen for window focus changes
    chrome.windows.onFocusChanged.addListener((windowId) => {
      if (windowId === chrome.windows.WINDOW_ID_NONE) {
        this.handleWindowBlur();
      } else {
        this.handleWindowFocus(windowId);
      }
    });

    // Periodic data sync with backend
    setInterval(() => {
      this.syncActivityData();
    }, 30000); // Sync every 30 seconds

    // Track session duration
    setInterval(() => {
      this.updateSessionDuration();
    }, 1000); // Update every second
  }

  async handleTabChange(tabId) {
    try {
      const tab = await chrome.tabs.get(tabId);
      
      if (this.currentSession && this.lastActiveTab) {
        // End previous session
        await this.endCurrentSession();
      }

      // Start new session
      await this.startNewSession(tab);
      
    } catch (error) {
      console.error('Error handling tab change:', error);
    }
  }

  async startNewSession(tab) {
    const now = new Date();
    
    this.currentSession = {
      id: this.generateSessionId(),
      url: tab.url,
      title: tab.title,
      domain: this.extractDomain(tab.url),
      category: await this.categorizeActivity(tab.url, tab.title),
      startTime: now,
      endTime: null,
      duration: 0,
      productivityScore: 0,
      distractions: 0,
      focusQuality: 0
    };

    this.sessionStartTime = now;
    this.lastActiveTab = tab;

    // Send real-time update to dashboard
    this.sendRealTimeUpdate('session_start', this.currentSession);
  }

  async endCurrentSession() {
    if (!this.currentSession) return;

    const now = new Date();
    const duration = Math.floor((now - this.sessionStartTime) / 1000);

    this.currentSession.endTime = now;
    this.currentSession.duration = duration;
    this.currentSession.productivityScore = this.calculateProductivityScore();
    this.currentSession.focusQuality = this.calculateFocusQuality();

    // Add to activity buffer for backend sync
    this.activityBuffer.push({ ...this.currentSession });

    // Send to dashboard
    this.sendRealTimeUpdate('session_end', this.currentSession);

    // Store in local storage
    await this.storeActivity(this.currentSession);

    // Sync with backend
    await this.syncWithBackend(this.currentSession);
  }

  updateSessionDuration() {
    if (this.currentSession && this.sessionStartTime) {
      const now = new Date();
      const duration = Math.floor((now - this.sessionStartTime) / 1000);
      this.currentSession.duration = duration;

      // Send real-time duration update
      this.sendRealTimeUpdate('session_update', {
        id: this.currentSession.id,
        duration: duration,
        productivityScore: this.calculateProductivityScore()
      });
    }
  }

  async categorizeActivity(url, title) {
    // Enhanced AI-powered categorization
    const domain = this.extractDomain(url);
    
    // AI/Development Tools
    const aiDomains = [
      'openai.com', 'chatgpt.com', 'claude.ai', 'anthropic.com',
      'github.com', 'stackoverflow.com', 'cursor.sh', 'bolt.new',
      'vercel.com', 'replit.com', 'codepen.io', 'codesandbox.io'
    ];

    // Social Media
    const socialDomains = [
      'facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com',
      'tiktok.com', 'snapchat.com', 'reddit.com', 'discord.com'
    ];

    // Learning Platforms
    const learningDomains = [
      'youtube.com', 'coursera.org', 'udemy.com', 'khanacademy.org',
      'edx.org', 'pluralsight.com', 'skillshare.com', 'masterclass.com'
    ];

    // Entertainment
    const entertainmentDomains = [
      'netflix.com', 'hulu.com', 'disney.com', 'amazon.com/prime',
      'twitch.tv', 'spotify.com', 'apple.com/music'
    ];

    // Productivity Tools
    const productivityDomains = [
      'notion.so', 'obsidian.md', 'todoist.com', 'trello.com',
      'asana.com', 'slack.com', 'zoom.us', 'google.com/drive'
    ];

    if (aiDomains.some(d => domain.includes(d))) {
      return this.determineAISubcategory(url, title);
    } else if (socialDomains.some(d => domain.includes(d))) {
      return { primary: 'Social Media', secondary: 'Communication', productivity: 0.2 };
    } else if (learningDomains.some(d => domain.includes(d))) {
      return { primary: 'Learning', secondary: 'Education', productivity: 0.8 };
    } else if (entertainmentDomains.some(d => domain.includes(d))) {
      return { primary: 'Entertainment', secondary: 'Leisure', productivity: 0.1 };
    } else if (productivityDomains.some(d => domain.includes(d))) {
      return { primary: 'Productivity', secondary: 'Tools', productivity: 0.9 };
    } else {
      return this.analyzeContentCategory(url, title);
    }
  }

  determineAISubcategory(url, title) {
    const content = (url + ' ' + title).toLowerCase();
    
    if (content.includes('code') || content.includes('programming') || content.includes('development')) {
      return { primary: 'AI Tools', secondary: 'Development', productivity: 0.95 };
    } else if (content.includes('learn') || content.includes('tutorial') || content.includes('course')) {
      return { primary: 'AI Tools', secondary: 'Learning', productivity: 0.85 };
    } else if (content.includes('write') || content.includes('content') || content.includes('blog')) {
      return { primary: 'AI Tools', secondary: 'Content Creation', productivity: 0.8 };
    } else {
      return { primary: 'AI Tools', secondary: 'General', productivity: 0.9 };
    }
  }

  analyzeContentCategory(url, title) {
    const content = (url + ' ' + title).toLowerCase();
    
    // Development indicators
    if (content.includes('github') || content.includes('code') || content.includes('programming')) {
      return { primary: 'Development', secondary: 'Coding', productivity: 0.9 };
    }
    
    // Research indicators
    if (content.includes('research') || content.includes('documentation') || content.includes('wiki')) {
      return { primary: 'Research', secondary: 'Information', productivity: 0.7 };
    }
    
    // Default categorization
    return { primary: 'General', secondary: 'Browsing', productivity: 0.5 };
  }

  calculateProductivityScore() {
    if (!this.currentSession) return 0;
    
    const baseScore = this.currentSession.category.productivity * 100;
    const durationBonus = Math.min(this.currentSession.duration / 1800, 1) * 10; // Bonus for longer sessions (up to 30 min)
    const distractionPenalty = this.currentSession.distractions * 5;
    
    return Math.max(0, Math.min(100, baseScore + durationBonus - distractionPenalty));
  }

  calculateFocusQuality() {
    if (!this.currentSession) return 0;
    
    const sessionDuration = this.currentSession.duration;
    const distractions = this.currentSession.distractions;
    
    if (sessionDuration < 60) return 0; // Too short to measure
    
    const focusTime = sessionDuration - (distractions * 30); // Assume 30s lost per distraction
    return Math.max(0, Math.min(100, (focusTime / sessionDuration) * 100));
  }

  async sendRealTimeUpdate(type, data) {
    try {
      // Send to dashboard via postMessage
      const tabs = await chrome.tabs.query({ url: 'http://localhost:5173/*' });
      
      for (const tab of tabs) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'FOCUSBOOST_UPDATE',
          eventType: type,
          data: data,
          timestamp: new Date().toISOString()
        }).catch(() => {
          // Tab might not have content script loaded
        });
      }

    } catch (error) {
      console.error('Error sending real-time update:', error);
    }
  }

  async syncWithBackend(sessionData) {
    try {
      // Get auth token from storage
      const result = await chrome.storage.local.get(['accessToken']);
      const token = result.accessToken;

      if (!token) {
        console.log('No auth token available for backend sync');
        return;
      }

      // Send session data to backend
      const response = await fetch(`${this.apiEndpoint}/activity/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          url: sessionData.url,
          title: sessionData.title,
          domain: sessionData.domain,
          category: sessionData.category.primary,
          subcategory: sessionData.category.secondary,
          productivityScore: sessionData.productivityScore,
          focusQuality: sessionData.focusQuality,
          duration: sessionData.duration,
          distractions: sessionData.distractions,
          startTime: sessionData.startTime.toISOString(),
          endTime: sessionData.endTime?.toISOString(),
          metadata: {
            sessionId: sessionData.id,
            userAgent: navigator.userAgent
          }
        })
      });

      if (response.ok) {
        console.log('Session synced with backend successfully');
      } else {
        console.error('Failed to sync with backend:', response.statusText);
      }

    } catch (error) {
      console.error('Backend sync error:', error);
    }
  }

  async syncActivityData() {
    if (this.activityBuffer.length === 0) return;

    try {
      // Get auth token
      const result = await chrome.storage.local.get(['accessToken']);
      const token = result.accessToken;

      if (!token) return;

      const response = await fetch(`${this.apiEndpoint}/activity/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          activities: this.activityBuffer,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        this.activityBuffer = []; // Clear buffer on successful sync
        console.log('Activity buffer synced with backend');
      }
    } catch (error) {
      console.error('Error syncing activity data:', error);
    }
  }

  async storeActivity(activity) {
    try {
      const stored = await chrome.storage.local.get(['activities']);
      const activities = stored.activities || [];
      
      activities.push(activity);
      
      // Keep only last 1000 activities
      if (activities.length > 1000) {
        activities.splice(0, activities.length - 1000);
      }
      
      await chrome.storage.local.set({ activities });
    } catch (error) {
      console.error('Error storing activity:', error);
    }
  }

  handleWindowBlur() {
    if (this.currentSession) {
      this.currentSession.distractions++;
      this.sendRealTimeUpdate('distraction', {
        sessionId: this.currentSession.id,
        type: 'window_blur',
        timestamp: new Date().toISOString()
      });
    }
  }

  handleWindowFocus(windowId) {
    // Window regained focus
    this.sendRealTimeUpdate('focus_regained', {
      windowId: windowId,
      timestamp: new Date().toISOString()
    });
  }

  extractDomain(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return 'unknown';
    }
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

// Initialize the tracker
const tracker = new FocusBoostTracker();

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: 'http://localhost:5173' });
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_CURRENT_SESSION') {
    sendResponse(tracker.currentSession);
  } else if (request.type === 'TOGGLE_TRACKING') {
    tracker.isTracking = !tracker.isTracking;
    sendResponse({ tracking: tracker.isTracking });
  } else if (request.type === 'SET_AUTH_TOKEN') {
    // Store auth token for backend API calls
    chrome.storage.local.set({ accessToken: request.token });
    sendResponse({ success: true });
  }
});