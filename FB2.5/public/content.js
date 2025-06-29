// FocusBoost Content Script - Injected into all pages
class FocusBoostContentScript {
  constructor() {
    this.isActive = true;
    this.pageStartTime = Date.now();
    this.scrollDepth = 0;
    this.clickCount = 0;
    this.keystrokes = 0;
    this.idleTime = 0;
    this.lastActivity = Date.now();
    
    this.initializeTracking();
  }

  initializeTracking() {
    // Track user engagement
    this.trackScrollDepth();
    this.trackClicks();
    this.trackKeystrokes();
    this.trackIdleTime();
    this.trackPageVisibility();
    
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
    });

    // Send page load event
    this.sendPageEvent('page_load', {
      url: window.location.href,
      title: document.title,
      timestamp: new Date().toISOString()
    });
  }

  trackScrollDepth() {
    let maxScroll = 0;
    
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        this.scrollDepth = maxScroll;
      }
      
      this.updateLastActivity();
    });
  }

  trackClicks() {
    document.addEventListener('click', (event) => {
      this.clickCount++;
      this.updateLastActivity();
      
      // Track specific click types
      const clickData = {
        element: event.target.tagName,
        className: event.target.className,
        id: event.target.id,
        timestamp: new Date().toISOString()
      };
      
      this.sendPageEvent('click', clickData);
    });
  }

  trackKeystrokes() {
    document.addEventListener('keydown', () => {
      this.keystrokes++;
      this.updateLastActivity();
    });
  }

  trackIdleTime() {
    setInterval(() => {
      const now = Date.now();
      const timeSinceActivity = now - this.lastActivity;
      
      if (timeSinceActivity > 30000) { // 30 seconds idle
        this.idleTime += 1000;
        
        if (timeSinceActivity > 300000) { // 5 minutes idle
          this.sendPageEvent('idle_detected', {
            idleTime: timeSinceActivity,
            timestamp: new Date().toISOString()
          });
        }
      }
    }, 1000);
  }

  trackPageVisibility() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.sendPageEvent('page_hidden', {
          timeOnPage: Date.now() - this.pageStartTime,
          engagement: this.calculateEngagement(),
          timestamp: new Date().toISOString()
        });
      } else {
        this.sendPageEvent('page_visible', {
          timestamp: new Date().toISOString()
        });
        this.updateLastActivity();
      }
    });
  }

  calculateEngagement() {
    const timeOnPage = Date.now() - this.pageStartTime;
    const activeTime = timeOnPage - this.idleTime;
    
    return {
      timeOnPage: timeOnPage,
      activeTime: activeTime,
      scrollDepth: this.scrollDepth,
      clickCount: this.clickCount,
      keystrokes: this.keystrokes,
      engagementScore: Math.min(100, (activeTime / timeOnPage) * 100)
    };
  }

  updateLastActivity() {
    this.lastActivity = Date.now();
  }

  sendPageEvent(type, data) {
    // Send to background script
    chrome.runtime.sendMessage({
      type: 'PAGE_EVENT',
      eventType: type,
      data: data,
      url: window.location.href,
      title: document.title
    }).catch(() => {
      // Background script might not be ready
    });
  }

  handleMessage(request, sender, sendResponse) {
    switch (request.type) {
      case 'FOCUSBOOST_UPDATE':
        // Forward to dashboard if this is the dashboard page
        if (window.location.href.includes('localhost:5173')) {
          window.postMessage({
            type: 'FOCUSBOOST_EXTENSION_DATA',
            ...request
          }, '*');
        }
        break;
        
      case 'GET_PAGE_ENGAGEMENT':
        sendResponse(this.calculateEngagement());
        break;
        
      case 'INJECT_AWARENESS_NOTIFICATION':
        this.showAwarenessNotification(request.data);
        break;
    }
  }

  showAwarenessNotification(data) {
    // Create non-intrusive awareness notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      max-width: 320px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.2);
      animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="font-size: 24px;">${data.icon || '🎯'}</div>
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">${data.title}</div>
          <div style="opacity: 0.9; font-size: 13px;">${data.message}</div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" 
                style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; opacity: 0.7; hover: opacity: 1;">×</button>
      </div>
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
      }
    }, 8000);
  }
}

// Initialize content script
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new FocusBoostContentScript();
  });
} else {
  new FocusBoostContentScript();
}