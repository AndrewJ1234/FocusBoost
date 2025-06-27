class PopupController {
  constructor() {
    this.data = null;
    this.retryCount = 0;
    this.maxRetries = 3;
    this.init();
  }

  async init() {
    try {
      // Wait a bit for extension context to be ready
      await this.waitForExtensionContext();

      await this.updateStats();
      this.setupEventListeners();
      this.showContent();

      // Update every 10 seconds
      setInterval(() => this.updateStats(), 10000);
    } catch (error) {
      console.error("Popup initialization error:", error);
      this.showError("Failed to initialize popup");
    }
  }

  async waitForExtensionContext() {
    return new Promise((resolve, reject) => {
      const checkContext = () => {
        if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
          resolve();
        } else if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          setTimeout(checkContext, 500);
        } else {
          reject(new Error("Extension context not available"));
        }
      };
      checkContext();
    });
  }

  setupEventListeners() {
    const startBtn = document.getElementById("startBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const openDashboard = document.getElementById("openDashboard");

    if (startBtn) {
      startBtn.addEventListener("click", () => {
        this.sendMessage("startTracking");
      });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => {
        this.sendMessage("pauseTracking");
      });
    }

    if (openDashboard) {
      openDashboard.addEventListener("click", (e) => {
        e.preventDefault();
        if (chrome && chrome.tabs && chrome.tabs.create) {
          chrome.tabs.create({ url: "http://localhost:5173" });
          window.close();
        } else {
          // Fallback for when chrome.tabs is not available
          window.open("http://localhost:5173", "_blank");
        }
      });
    }
  }

  async sendMessage(action, payload = {}) {
    try {
      // Double-check chrome runtime is available
      if (!chrome || !chrome.runtime || !chrome.runtime.sendMessage) {
        throw new Error("Chrome runtime not available");
      }

      return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action, ...payload }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Message error:", chrome.runtime.lastError.message);
            resolve(null);
          } else {
            resolve(response);
          }
        });
      });
    } catch (error) {
      console.error("Send message error:", error);
      return null;
    }
  }

  async updateStats() {
    try {
      const stats = await this.sendMessage("getStats");

      if (stats && !stats.error) {
        this.data = stats;
        this.renderStats();
      } else if (stats && stats.error) {
        console.error("Stats error:", stats.error);
        this.showDemoData();
      } else {
        // No response, show demo data
        this.showDemoData();
      }
    } catch (error) {
      console.error("Stats update error:", error);
      this.showDemoData();
    }
  }

  showDemoData() {
    // Show placeholder data when extension isn't responding
    this.data = {
      productivityStats: {
        productivityScore: 0,
        productiveTime: 0,
        sessionCount: 0,
      },
      categoryStats: {},
      currentSession: null,
      sessionTime: 0,
      isTracking: false,
    };
    this.renderStats();

    // Add a notice about demo data
    const currentSiteInfo = document.getElementById("currentSiteInfo");
    if (currentSiteInfo) {
      currentSiteInfo.textContent = "Extension loading... (showing demo data)";
    }
  }

  renderStats() {
    if (!this.data) return;

    try {
      const {
        productivityStats,
        categoryStats,
        currentSession,
        sessionTime,
        isTracking,
      } = this.data;

      // Update status indicators
      this.updateStatus(isTracking);

      // Update session time
      this.updateSessionTime(sessionTime);

      // Update current site info
      this.updateCurrentSite(currentSession);

      // Update statistics
      this.updateStatistics(productivityStats, categoryStats);

      // Update button states
      this.updateButtons(isTracking);
    } catch (error) {
      console.error("Render error:", error);
    }
  }

  updateStatus(isTracking) {
    const statusDot = document.getElementById("statusDot");
    const statusText = document.getElementById("statusText");

    if (statusDot && statusText) {
      if (isTracking) {
        statusDot.classList.add("active");
        statusDot.classList.remove("paused");
        statusText.textContent = "Tracking Active";
      } else {
        statusDot.classList.remove("active");
        statusDot.classList.add("paused");
        statusText.textContent = "Paused";
      }
    }
  }

  updateSessionTime(sessionTime) {
    const sessionTimeEl = document.getElementById("sessionTime");
    if (sessionTimeEl) {
      sessionTimeEl.textContent = this.formatSessionTime(sessionTime || 0);
    }
  }

  updateCurrentSite(currentSession) {
    const currentSiteInfo = document.getElementById("currentSiteInfo");
    if (currentSiteInfo) {
      if (currentSession && currentSession.title) {
        currentSiteInfo.textContent = `${currentSession.title} (${
          currentSession.category || "other"
        })`;
      } else {
        currentSiteInfo.textContent = "No active session";
      }
    }
  }

  updateStatistics(productivityStats, categoryStats) {
    // Update productivity score
    const productivityScore = document.getElementById("productivityScore");
    if (productivityScore) {
      productivityScore.textContent = `${
        productivityStats?.productivityScore || 0
      }%`;
    }

    // Update productive time
    const productiveTime = document.getElementById("productiveTime");
    if (productiveTime) {
      productiveTime.textContent = this.formatTime(
        productivityStats?.productiveTime || 0
      );
    }

    // Update session count
    const sessionCount = document.getElementById("sessionCount");
    if (sessionCount) {
      sessionCount.textContent = productivityStats?.sessionCount || 0;
    }

    // Update top category
    const topCategory = document.getElementById("topCategory");
    if (topCategory) {
      const top = this.getTopCategory(categoryStats);
      topCategory.textContent = top || "None";
    }
  }

  updateButtons(isTracking) {
    const startBtn = document.getElementById("startBtn");
    const pauseBtn = document.getElementById("pauseBtn");

    if (startBtn) startBtn.disabled = isTracking;
    if (pauseBtn) pauseBtn.disabled = !isTracking;
  }

  getTopCategory(categoryStats) {
    if (!categoryStats || Object.keys(categoryStats).length === 0) return null;

    const entries = Object.entries(categoryStats);
    entries.sort(([, a], [, b]) => b - a);
    return entries[0] ? this.capitalize(entries[0][0]) : null;
  }

  formatTime(ms) {
    const minutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else {
      return `${minutes}m`;
    }
  }

  formatSessionTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  showContent() {
    const loading = document.getElementById("loading");
    const content = document.getElementById("content");

    if (loading) loading.style.display = "none";
    if (content) content.style.display = "block";
  }

  showError(message = "Error loading extension data") {
    const loading = document.getElementById("loading");
    if (loading) {
      loading.innerHTML = `<p style="color: #ef4444; margin-bottom: 8px;">${message}</p>
                 <p style="font-size: 0.75rem; color: #6b7280;">Try refreshing or reinstalling the extension</p>`;
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new PopupController();
  });
} else {
  new PopupController();
}
