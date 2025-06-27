console.log("🎯 FocusBoost - Full Tracking Version Starting...");

class TabTracker {
  constructor() {
    this.currentSession = null;
    this.sessionStartTime = Date.now();
    this.isTracking = true;
    this.tabSessions = new Map();
    this.dailyStats = new Map();
    this.categoryRules = this.initializeCategoryRules();

    this.init();
  }

  init() {
    this.loadStoredData();
    this.setupEventListeners();
    this.getCurrentActiveTab();
    this.startPeriodicSave();
    console.log("✅ Tab tracking initialized");
  }

  initializeCategoryRules() {
    return {
      productive: [
        "github.com",
        "stackoverflow.com",
        "codepen.io",
        "jsfiddle.net",
        "docs.google.com",
        "notion.so",
        "trello.com",
        "asana.com",
        "figma.com",
        "vscode.dev",
        "replit.com",
      ],
      entertainment: [
        "youtube.com",
        "netflix.com",
        "twitch.tv",
        "spotify.com",
        "tiktok.com",
        "instagram.com",
        "reddit.com",
      ],
      educational: [
        "coursera.org",
        "udemy.com",
        "khanacademy.org",
        "wikipedia.org",
        "w3schools.com",
        "mdn.mozilla.org",
        "freecodecamp.org",
        "codecademy.com",
      ],
      work: [
        "slack.com",
        "zoom.us",
        "teams.microsoft.com",
        "office.com",
        "salesforce.com",
        "jira.atlassian.com",
        "gmail.com",
      ],
      social: [
        "facebook.com",
        "twitter.com",
        "x.com",
        "linkedin.com",
        "discord.com",
        "whatsapp.com",
        "telegram.org",
      ],
      news: [
        "news.google.com",
        "cnn.com",
        "bbc.com",
        "techcrunch.com",
        "theverge.com",
        "medium.com",
        "hackernews",
      ],
      shopping: ["amazon.com", "ebay.com", "etsy.com", "shopify.com"],
    };
  }

  setupEventListeners() {
    // Tab switch detection
    chrome.tabs.onActivated.addListener((activeInfo) => {
      this.handleTabSwitch(activeInfo.tabId);
    });

    // Page navigation detection
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === "complete" && tab.active) {
        this.handleTabSwitch(tabId);
      }
    });

    // Tab close detection
    chrome.tabs.onRemoved.addListener((tabId) => {
      this.handleTabClose(tabId);
    });

    // Window focus detection
    chrome.windows.onFocusChanged.addListener((windowId) => {
      if (windowId === chrome.windows.WINDOW_ID_NONE) {
        this.handleWindowBlur();
      } else {
        this.handleWindowFocus(windowId);
      }
    });

    console.log("🎧 Event listeners registered");
  }

  async handleTabSwitch(tabId) {
    if (!this.isTracking) return;

    try {
      // End current session
      this.endCurrentSession();

      // Get new tab info
      const tab = await chrome.tabs.get(tabId);

      if (!this.isValidTab(tab)) {
        console.log("⏭️ Skipping invalid tab:", tab.url);
        return;
      }

      // Start new session
      this.startNewSession(tab);
      console.log("🔄 Tab switch:", tab.title);
    } catch (error) {
      console.error("❌ Tab switch error:", error);
    }
  }

  isValidTab(tab) {
    if (!tab.url) return false;
    if (tab.url.startsWith("chrome://")) return false;
    if (tab.url.startsWith("chrome-extension://")) return false;
    if (tab.url.startsWith("moz-extension://")) return false;
    if (tab.url === "about:blank") return false;
    return true;
  }

  startNewSession(tab) {
    const category = this.categorizeUrl(tab.url, tab.title);
    const domain = this.extractDomain(tab.url);

    this.currentSession = {
      id: tab.id,
      url: tab.url,
      domain,
      title: tab.title,
      category,
      startTime: Date.now(),
      isActive: true,
    };

    // Notify dashboard of real-time change
    this.notifyDashboard("tabSwitch", this.currentSession);
  }

  endCurrentSession() {
    if (!this.currentSession) return;

    const sessionTime = Date.now() - this.currentSession.startTime;
    if (sessionTime < 1000) return; // Ignore very short sessions

    const sessionData = {
      ...this.currentSession,
      timeSpent: sessionTime,
      endTime: Date.now(),
    };

    this.recordSessionData(sessionData);
    this.updateDailyStats(sessionData);

    console.log(
      `⏰ Session ended: ${this.currentSession.domain} (${this.formatTime(
        sessionTime
      )})`
    );
  }

  recordSessionData(sessionData) {
    const key = sessionData.domain;
    const existing = this.tabSessions.get(key) || {
      domain: key,
      title: sessionData.title,
      category: sessionData.category,
      totalTime: 0,
      visits: 0,
      lastVisit: 0,
    };

    existing.totalTime += sessionData.timeSpent;
    existing.visits += 1;
    existing.lastVisit = sessionData.endTime;
    existing.title = sessionData.title; // Update to latest title

    this.tabSessions.set(key, existing);
  }

  updateDailyStats(sessionData) {
    const today = this.getTodayKey();
    const stats = this.dailyStats.get(today) || {
      date: today,
      totalTime: 0,
      productiveTime: 0,
      categories: {},
      sessionCount: 0,
    };

    stats.totalTime += sessionData.timeSpent;
    stats.sessionCount += 1;

    if (this.isProductiveCategory(sessionData.category)) {
      stats.productiveTime += sessionData.timeSpent;
    }

    stats.categories[sessionData.category] =
      (stats.categories[sessionData.category] || 0) + sessionData.timeSpent;

    this.dailyStats.set(today, stats);
  }

  categorizeUrl(url, title = "") {
    const urlLower = url.toLowerCase();
    const titleLower = title.toLowerCase();

    for (const [category, domains] of Object.entries(this.categoryRules)) {
      if (
        domains.some(
          (domain) => urlLower.includes(domain) || titleLower.includes(domain)
        )
      ) {
        return category;
      }
    }

    return "other";
  }

  isProductiveCategory(category) {
    return ["productive", "work", "educational"].includes(category);
  }

  extractDomain(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }

  getTodayKey() {
    return new Date().toISOString().split("T")[0];
  }

  formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  }

  async getCurrentActiveTab() {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab && this.isValidTab(tab)) {
        this.handleTabSwitch(tab.id);
      }
    } catch (error) {
      console.error("❌ Error getting active tab:", error);
    }
  }

  handleTabClose(tabId) {
    if (this.currentSession && this.currentSession.id === tabId) {
      this.endCurrentSession();
      this.currentSession = null;
    }
  }

  handleWindowBlur() {
    if (this.currentSession) {
      this.currentSession.isActive = false;
    }
  }

  async handleWindowFocus(windowId) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, windowId });
      if (tab && this.isValidTab(tab)) {
        this.handleTabSwitch(tab.id);
      }
    } catch (error) {
      console.error("❌ Window focus error:", error);
    }
  }

  startPeriodicSave() {
    setInterval(() => {
      this.saveData();
      this.notifyDashboard("statsUpdate", this.getComprehensiveStats());
    }, 10000); // Save and update every 10 seconds
  }

  async loadStoredData() {
    try {
      const result = await chrome.storage.local.get([
        "tabSessions",
        "dailyStats",
        "sessionStartTime",
        "isTracking",
      ]);

      if (result.tabSessions) {
        this.tabSessions = new Map(Object.entries(result.tabSessions));
      }

      if (result.dailyStats) {
        this.dailyStats = new Map(Object.entries(result.dailyStats));
      }

      if (result.sessionStartTime) {
        this.sessionStartTime = result.sessionStartTime;
      }

      if (result.isTracking !== undefined) {
        this.isTracking = result.isTracking;
      }

      console.log("💾 Data loaded from storage");
    } catch (error) {
      console.error("❌ Error loading data:", error);
    }
  }

  async saveData() {
    try {
      const data = {
        tabSessions: Object.fromEntries(this.tabSessions),
        dailyStats: Object.fromEntries(this.dailyStats),
        sessionStartTime: this.sessionStartTime,
        isTracking: this.isTracking,
        lastSaved: Date.now(),
      };

      await chrome.storage.local.set(data);
    } catch (error) {
      console.error("❌ Error saving data:", error);
    }
  }

  notifyDashboard(type, data) {
    // Send to all localhost tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.url && tab.url.includes("localhost")) {
          chrome.tabs
            .sendMessage(tab.id, {
              type: "FOCUSBOOST_UPDATE",
              payload: { type, data },
            })
            .catch(() => {
              // Dashboard might not be ready, ignore
            });
        }
      });
    });
  }

  getComprehensiveStats() {
    const today = this.getTodayKey();
    const todayStats = this.dailyStats.get(today) || {
      totalTime: 0,
      productiveTime: 0,
      categories: {},
      sessionCount: 0,
    };

    const topSites = Array.from(this.tabSessions.values())
      .sort((a, b) => b.totalTime - a.totalTime)
      .slice(0, 10);

    const productivityScore =
      todayStats.totalTime > 0
        ? Math.round((todayStats.productiveTime / todayStats.totalTime) * 100)
        : 0;

    return {
      currentSession: this.currentSession,
      topSites,
      categoryStats: todayStats.categories,
      productivityStats: {
        productiveTime: todayStats.productiveTime,
        entertainmentTime:
          (todayStats.categories.entertainment || 0) +
          (todayStats.categories.social || 0),
        totalTime: todayStats.totalTime,
        productivityScore,
        sessionCount: todayStats.sessionCount,
      },
      sessionTime: Math.floor((Date.now() - this.sessionStartTime) / 1000),
      isTracking: this.isTracking,
      weeklyTrend: this.getWeeklyTrend(),
    };
  }

  getWeeklyTrend() {
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split("T")[0];
      const dayStats = this.dailyStats.get(key);

      weekData.push({
        date: key,
        productiveTime: dayStats?.productiveTime || 0,
        totalTime: dayStats?.totalTime || 0,
        score:
          dayStats?.totalTime > 0
            ? Math.round((dayStats.productiveTime / dayStats.totalTime) * 100)
            : 0,
      });
    }
    return weekData;
  }

  startTracking() {
    this.isTracking = true;
    this.saveData();
    this.getCurrentActiveTab();
    console.log("▶️ Tracking started");
  }

  pauseTracking() {
    this.isTracking = false;
    this.endCurrentSession();
    this.currentSession = null;
    this.saveData();
    console.log("⏸️ Tracking paused");
  }

  resetData() {
    this.tabSessions.clear();
    this.dailyStats.clear();
    this.currentSession = null;
    this.sessionStartTime = Date.now();
    chrome.storage.local.clear();
    console.log("🗑️ Data reset");
  }
}

// Initialize tracker
const tracker = new TabTracker();

// Enhanced message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("📨 Background received:", request.action);

  try {
    switch (request.action) {
      case "getStats":
        const stats = tracker.getComprehensiveStats();
        console.log("📊 Sending real stats");
        sendResponse(stats);
        break;

      case "startTracking":
        tracker.startTracking();
        sendResponse({ success: true });
        break;

      case "pauseTracking":
        tracker.pauseTracking();
        sendResponse({ success: true });
        break;

      case "resetData":
        tracker.resetData();
        sendResponse({ success: true });
        break;

      default:
        sendResponse({ error: "Unknown action: " + request.action });
    }
  } catch (error) {
    console.error("❌ Message handler error:", error);
    sendResponse({ error: error.message });
  }

  return true;
});

console.log("🚀 FocusBoost ready - Real tab tracking active!");
