// FocusBoost Extension Popup Script
class FocusBoostPopup {
  constructor() {
    this.isTracking = true;
    this.currentSession = null;
    
    this.initializePopup();
    this.setupEventListeners();
    this.loadCurrentData();
  }

  initializePopup() {
    // Update UI with current session data
    this.updateSessionDisplay();
    this.updateStats();
  }

  setupEventListeners() {
    // Open Dashboard
    document.getElementById('open-dashboard').addEventListener('click', () => {
      chrome.tabs.create({ url: 'http://localhost:5173' });
      window.close();
    });

    // Toggle Tracking
    document.getElementById('toggle-tracking').addEventListener('click', () => {
      this.toggleTracking();
    });

    // Take Break
    document.getElementById('take-break').addEventListener('click', () => {
      this.takeBreak();
    });
  }

  async loadCurrentData() {
    try {
      // Get current session from background script
      const response = await chrome.runtime.sendMessage({ type: 'GET_CURRENT_SESSION' });
      
      if (response) {
        this.currentSession = response;
        this.updateSessionDisplay();
      }

      // Get stored stats
      const stored = await chrome.storage.local.get(['dailyStats', 'userProfile']);
      
      if (stored.dailyStats) {
        this.updateStats(stored.dailyStats);
      }

      if (stored.userProfile) {
        this.updateProfile(stored.userProfile);
      }

    } catch (error) {
      console.error('Error loading current data:', error);
    }
  }

  updateSessionDisplay() {
    if (!this.currentSession) {
      document.getElementById('current-activity').textContent = 'No active session';
      document.getElementById('session-duration').textContent = '0m';
      document.getElementById('session-category').textContent = 'Idle';
      return;
    }

    const { title, category, duration, productivityScore } = this.currentSession;
    
    document.getElementById('current-activity').textContent = title || 'Current Activity';
    document.getElementById('session-duration').textContent = this.formatDuration(duration);
    document.getElementById('session-category').textContent = 
      `${category.primary} • ${Math.round(productivityScore)}% Focus`;
  }

  updateStats(stats = {}) {
    document.getElementById('daily-score').textContent = `${stats.productivityScore || 87}%`;
    document.getElementById('global-rank').textContent = `#${stats.globalRank || 247}`;
    document.getElementById('focus-time').textContent = `${stats.focusTime || '6.2'}h`;
    document.getElementById('streak').textContent = `${stats.streak || 18}`;
  }

  updateProfile(profile = {}) {
    // Update any profile-specific UI elements
  }

  async toggleTracking() {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'TOGGLE_TRACKING' });
      
      this.isTracking = response.tracking;
      
      const button = document.getElementById('toggle-tracking');
      const status = document.getElementById('tracking-status');
      
      if (this.isTracking) {
        button.textContent = 'Pause Tracking';
        status.textContent = 'Live Tracking Active';
        document.querySelector('.status-dot').style.background = '#10b981';
      } else {
        button.textContent = 'Resume Tracking';
        status.textContent = 'Tracking Paused';
        document.querySelector('.status-dot').style.background = '#f59e0b';
      }

    } catch (error) {
      console.error('Error toggling tracking:', error);
    }
  }

  takeBreak() {
    // Send break notification to background script
    chrome.runtime.sendMessage({
      type: 'TAKE_BREAK',
      timestamp: new Date().toISOString()
    });

    // Show break confirmation
    const button = document.getElementById('take-break');
    const originalText = button.textContent;
    
    button.textContent = 'Break Started! ✓';
    button.style.background = 'rgba(16, 185, 129, 0.8)';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
    }, 2000);
  }

  formatDuration(seconds) {
    if (!seconds) return '0m';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new FocusBoostPopup();
});