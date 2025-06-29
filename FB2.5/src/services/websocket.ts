import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  public connect(userId?: string): void {
    if (this.socket?.connected) {
      return;
    }

    const token = localStorage.getItem('accessToken');
    
    this.socket = io(WS_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      maxReconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventHandlers(userId);
  }

  private setupEventHandlers(userId?: string): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;

      // Join user room for personalized updates
      if (userId) {
        this.socket?.emit('join_user_room', userId);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.isConnected = false;
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.disconnect();
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('WebSocket reconnected after', attemptNumber, 'attempts');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('WebSocket reconnection error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('WebSocket reconnection failed');
      this.isConnected = false;
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  public emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('WebSocket not connected, cannot emit event:', event);
    }
  }

  public on(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  public off(event: string, callback?: (data: any) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Real-time activity updates
  public sendActivityUpdate(activity: any): void {
    this.emit('activity_update', activity);
  }

  public onActivityUpdate(callback: (activity: any) => void): void {
    this.on('activity_updated', callback);
  }

  // Analytics updates
  public requestAnalytics(type: string, period?: string): void {
    this.emit('request_analytics', { type, period });
  }

  public onAnalyticsUpdate(callback: (data: any) => void): void {
    this.on('analytics_updated', callback);
  }

  public onAnalyticsData(callback: (data: any) => void): void {
    this.on('analytics_data', callback);
  }

  // Notifications
  public onNotification(callback: (notification: any) => void): void {
    this.on('notification', callback);
  }

  public onAwarenessAlert(callback: (alert: any) => void): void {
    this.on('awareness_alert', callback);
  }

  // Leaderboard updates
  public onLeaderboardUpdate(callback: (data: any) => void): void {
    this.on('leaderboard_updated', callback);
  }

  // Connection status
  public get connected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  public getConnectionStatus(): {
    connected: boolean;
    reconnectAttempts: number;
    socketId?: string;
  } {
    return {
      connected: this.connected,
      reconnectAttempts: this.reconnectAttempts,
      socketId: this.socket?.id,
    };
  }
}

// Create singleton instance
export const websocketService = new WebSocketService();

// React hook for WebSocket
export const useWebSocket = (userId?: string) => {
  const [connectionStatus, setConnectionStatus] = React.useState(
    websocketService.getConnectionStatus()
  );

  React.useEffect(() => {
    // Connect when component mounts
    websocketService.connect(userId);

    // Update connection status
    const updateStatus = () => {
      setConnectionStatus(websocketService.getConnectionStatus());
    };

    websocketService.on('connect', updateStatus);
    websocketService.on('disconnect', updateStatus);
    websocketService.on('connect_error', updateStatus);
    websocketService.on('reconnect', updateStatus);

    // Cleanup on unmount
    return () => {
      websocketService.off('connect', updateStatus);
      websocketService.off('disconnect', updateStatus);
      websocketService.off('connect_error', updateStatus);
      websocketService.off('reconnect', updateStatus);
    };
  }, [userId]);

  return {
    ...websocketService,
    connectionStatus,
  };
};

export default websocketService;