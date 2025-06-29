import { Server as SocketIOServer } from 'socket.io';
import { AnalyticsService } from './AnalyticsService';
import { logger } from '../utils/logger';

export class RealTimeService {
  constructor(
    private io: SocketIOServer,
    private analyticsService: AnalyticsService
  ) {
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      logger.info(`Real-time client connected: ${socket.id}`);

      socket.on('join_user_room', (userId: string) => {
        socket.join(`user_${userId}`);
        logger.debug(`User ${userId} joined real-time room`);
      });

      socket.on('activity_update', async (data) => {
        await this.handleActivityUpdate(socket, data);
      });

      socket.on('request_analytics', async (data) => {
        await this.handleAnalyticsRequest(socket, data);
      });

      socket.on('disconnect', () => {
        logger.info(`Real-time client disconnected: ${socket.id}`);
      });
    });
  }

  private async handleActivityUpdate(socket: any, data: any): Promise<void> {
    try {
      const { userId, activity } = data;

      // Broadcast to user's room
      this.io.to(`user_${userId}`).emit('activity_updated', {
        activity,
        timestamp: new Date().toISOString()
      });

      // Update analytics if it's a completed session
      if (activity.endTime) {
        await this.analyticsService.updateUserAnalytics(userId);
        
        // Send updated analytics
        const metrics = await this.analyticsService.calculateProductivityMetrics(userId);
        this.io.to(`user_${userId}`).emit('analytics_updated', metrics);
      }

    } catch (error) {
      logger.error('Error handling activity update:', error);
      socket.emit('error', { message: 'Failed to process activity update' });
    }
  }

  private async handleAnalyticsRequest(socket: any, data: any): Promise<void> {
    try {
      const { userId, type, period } = data;

      let analyticsData;
      
      switch (type) {
        case 'trends':
          analyticsData = await this.analyticsService.getProductivityTrends(userId, period);
          break;
        case 'sleep_correlation':
          analyticsData = await this.analyticsService.getSleepProductivityCorrelation(userId);
          break;
        case 'performance_windows':
          analyticsData = await this.analyticsService.getOptimalPerformanceWindows(userId);
          break;
        default:
          throw new Error(`Unknown analytics type: ${type}`);
      }

      socket.emit('analytics_data', {
        type,
        data: analyticsData,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error handling analytics request:', error);
      socket.emit('error', { message: 'Failed to fetch analytics data' });
    }
  }

  public broadcastToUser(userId: string, event: string, data: any): void {
    this.io.to(`user_${userId}`).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  public broadcastGlobal(event: string, data: any): void {
    this.io.emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  public sendNotification(userId: string, notification: any): void {
    this.io.to(`user_${userId}`).emit('notification', {
      ...notification,
      timestamp: new Date().toISOString()
    });
  }

  public sendAwarenessAlert(userId: string, alert: any): void {
    this.io.to(`user_${userId}`).emit('awareness_alert', {
      ...alert,
      timestamp: new Date().toISOString()
    });
  }
}