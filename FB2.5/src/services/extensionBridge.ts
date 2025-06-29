// Bridge service for Chrome Extension communication
class ExtensionBridge {
  private isExtensionAvailable: boolean = false;
  private messageHandlers: Map<string, Function[]> = new Map();

  constructor() {
    this.checkExtensionAvailability();
    this.setupMessageListeners();
  }

  private checkExtensionAvailability(): void {
    // Check if extension is installed and available
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
      this.isExtensionAvailable = true;
      console.log('FocusBoost Extension detected');
    } else {
      console.log('FocusBoost Extension not available - using demo mode');
    }
  }

  private setupMessageListeners(): void {
    // Listen for messages from extension content script
    window.addEventListener('message', (event) => {
      if (event.data.type === 'FOCUSBOOST_EXTENSION_DATA') {
        this.handleExtensionMessage(event.data);
      }
    });

    // Listen for direct extension messages
    if (this.isExtensionAvailable) {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        this.handleExtensionMessage(message);
        return true;
      });
    }
  }

  private handleExtensionMessage(message: any): void {
    const { eventType, data } = message;
    
    // Notify registered handlers
    const handlers = this.messageHandlers.get(eventType) || [];
    handlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error('Error in extension message handler:', error);
      }
    });
  }

  // Public API
  public isAvailable(): boolean {
    return this.isExtensionAvailable;
  }

  public onMessage(eventType: string, handler: Function): void {
    if (!this.messageHandlers.has(eventType)) {
      this.messageHandlers.set(eventType, []);
    }
    this.messageHandlers.get(eventType)!.push(handler);
  }

  public removeMessageHandler(eventType: string, handler: Function): void {
    const handlers = this.messageHandlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  public sendToExtension(message: any): void {
    if (this.isExtensionAvailable) {
      try {
        chrome.runtime.sendMessage(message);
      } catch (error) {
        console.error('Failed to send message to extension:', error);
      }
    }
  }

  public requestCurrentSession(): void {
    this.sendToExtension({ type: 'GET_CURRENT_SESSION' });
  }

  public requestActivityHistory(): void {
    this.sendToExtension({ type: 'GET_ACTIVITY_HISTORY' });
  }

  public toggleTracking(): void {
    this.sendToExtension({ type: 'TOGGLE_TRACKING' });
  }
}

// Create singleton instance
export const extensionBridge = new ExtensionBridge();

// React hook for extension integration
export const useExtensionBridge = () => {
  const [isConnected, setIsConnected] = React.useState(extensionBridge.isAvailable());
  const [currentActivity, setCurrentActivity] = React.useState(null);
  const [recentActivities, setRecentActivities] = React.useState([]);

  React.useEffect(() => {
    // Set up message handlers
    const handleSessionUpdate = (data: any) => {
      setCurrentActivity(data);
    };

    const handleActivityHistory = (data: any) => {
      setRecentActivities(data.activities || []);
    };

    const handleConnectionStatus = (data: any) => {
      setIsConnected(data.connected);
    };

    // Register handlers
    extensionBridge.onMessage('session_update', handleSessionUpdate);
    extensionBridge.onMessage('activity_history', handleActivityHistory);
    extensionBridge.onMessage('connection_status', handleConnectionStatus);

    // Request initial data
    extensionBridge.requestCurrentSession();
    extensionBridge.requestActivityHistory();

    // Cleanup
    return () => {
      extensionBridge.removeMessageHandler('session_update', handleSessionUpdate);
      extensionBridge.removeMessageHandler('activity_history', handleActivityHistory);
      extensionBridge.removeMessageHandler('connection_status', handleConnectionStatus);
    };
  }, []);

  return {
    isConnected,
    currentActivity,
    recentActivities,
    toggleTracking: () => extensionBridge.toggleTracking(),
    requestUpdate: () => extensionBridge.requestCurrentSession()
  };
};

export default extensionBridge;