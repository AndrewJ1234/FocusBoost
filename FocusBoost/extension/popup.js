// Popup script for FocusBoost extension
class PopupController {
  constructor() {
    this.init();
  }

  async init() {
    try {
      // Get initial stats
      await this.updateStats();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Show content
      document.getElementById('loading').style.display = 'none';
      document.getElementById('content').style.display = 'block';
      
      // Update stats every 5 seconds
      setInterval(() => this.updateStats(), 5000);
    } catch (error) {
      console.error('Error initializing popup:', error);
      document.getElementById('loading').textContent = 'Error loading extension';
    }
  }

  setupEventListeners() {
    document.getElementById('startBtn').addEventListener('click', () => {
      this.sendMessage('startTracking');
    });

    document.getElementById('pauseBtn').addEventListener('click', () => {
      this.sendMessage('pauseTracking');
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all tracking data?')) {
        this.sendMessage('resetData');
      }
    });

    document.getElementById('openDashboard').addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: 'http://localhost:5173' });
      window.close();
    });
  }

  async sendMessage(action, payload = {}) {
    try {
      const response = await chrome.runtime.sendMessage({ action, ...payload });
      if (response.success !== undefined) {
        await this.updateStats();
      }
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  async updateStats() {
    try {
      const stats = await this.sendMessage('getStats');
      if (stats) {
        this.renderStats(stats);
      }
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  }

  renderStats(stats) {
    // Update status
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    
    if (stats.isTracking) {
      statusDot.classList.remove('paused');
      statusText.textContent = 'Actively Tracking';
    } else {
      statusDot.classList.add('paused');
      statusText.textContent = 'Tracking Paused';
    }

    // Update session time
    const sessionTime = this.formatSessionTime(stats.sessionTime);
    document.getElementById('sessionTime').textContent = sessionTime;

    // Update current tab
    const currentTabInfo = document.getElementById('currentTabInfo');
    if (stats.currentTab) {
      currentTabInfo.textContent = `${stats.currentTab.title} (${stats.currentTab.category})`;
    } else {
      currentTabInfo.textContent = 'No active tab';
    }

    // Update productivity stats
    document.getElementById('productiveTime').textContent = 
      this.formatTime(stats.productivityStats.productiveTime);
    document.getElementById('entertainmentTime').textContent = 
      this.formatTime(stats.productivityStats.entertainmentTime);
    document.getElementById('productivityScore').textContent = 
      `${stats.productivityStats.productivityScore}%`;
    document.getElementById('totalTabs').textContent = stats.topTabs.length;

    // Update button states
    document.getElementById('startBtn').disabled = stats.isTracking;
    document.getElementById('pauseBtn').disabled = !stats.isTracking;
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

  formatSessionTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});