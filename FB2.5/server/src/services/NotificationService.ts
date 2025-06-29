import { DatabaseManager } from '../database/DatabaseManager';
import { RedisManager } from '../cache/RedisManager';
import { logger } from '../utils/logger';
import { sendEmail } from '../utils/email';

export class NotificationService {
  constructor(
    private dbManager: DatabaseManager,
    private redisManager: RedisManager
  ) {}

  public async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    data: any = {},
    scheduledFor?: Date
  ): Promise<string> {
    try {
      const notificationId = await this.dbManager.query(`
        INSERT INTO notifications (user_id, type, title, message, data, scheduled_for)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `, [userId, type, title, message, JSON.stringify(data), scheduledFor]);

      const id = notificationId[0].id;
      
      // If not scheduled, send immediately
      if (!scheduledFor) {
        await this.sendNotification(id);
      }

      return id;
    } catch (error) {
      logger.error('Failed to create notification:', error);
      throw error;
    }
  }

  public async sendNotification(notificationId: string): Promise<void> {
    try {
      const notifications = await this.dbManager.query(`
        SELECT n.*, u.email, u.first_name, u.last_name
        FROM notifications n
        JOIN users u ON n.user_id = u.id
        WHERE n.id = $1 AND n.is_sent = false
      `, [notificationId]);

      if (notifications.length === 0) {
        logger.warn(`Notification ${notificationId} not found or already sent`);
        return;
      }

      const notification = notifications[0];

      // Send based on notification type
      switch (notification.type) {
        case 'email':
          await this.sendEmailNotification(notification);
          break;
        case 'awareness_alert':
          await this.sendAwarenessAlert(notification);
          break;
        case 'goal_reminder':
          await this.sendGoalReminder(notification);
          break;
        case 'achievement':
          await this.sendAchievementNotification(notification);
          break;
        default:
          logger.warn(`Unknown notification type: ${notification.type}`);
          return;
      }

      // Mark as sent
      await this.dbManager.query(`
        UPDATE notifications 
        SET is_sent = true, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [notificationId]);

      logger.info(`Notification ${notificationId} sent successfully`);

    } catch (error) {
      logger.error(`Failed to send notification ${notificationId}:`, error);
      throw error;
    }
  }

  private async sendEmailNotification(notification: any): Promise<void> {
    await sendEmail({
      to: notification.email,
      subject: notification.title,
      template: 'notification',
      data: {
        firstName: notification.first_name,
        title: notification.title,
        message: notification.message,
        ...notification.data
      }
    });
  }

  private async sendAwarenessAlert(notification: any): Promise<void> {
    // Store in Redis for real-time delivery
    await this.redisManager.lpush(
      `awareness_alerts:${notification.user_id}`,
      JSON.stringify({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        timestamp: new Date().toISOString()
      })
    );

    // Keep only last 10 alerts
    await this.redisManager.ltrim(`awareness_alerts:${notification.user_id}`, 0, 9);
  }

  private async sendGoalReminder(notification: any): Promise<void> {
    // Implementation for goal reminders
    logger.info(`Sending goal reminder to user ${notification.user_id}`);
  }

  private async sendAchievementNotification(notification: any): Promise<void> {
    // Implementation for achievement notifications
    logger.info(`Sending achievement notification to user ${notification.user_id}`);
  }

  public async getUnreadNotifications(userId: string): Promise<any[]> {
    return await this.dbManager.query(`
      SELECT id, type, title, message, data, created_at
      FROM notifications
      WHERE user_id = $1 AND is_read = false
      ORDER BY created_at DESC
      LIMIT 50
    `, [userId]);
  }

  public async markAsRead(notificationId: string, userId: string): Promise<void> {
    await this.dbManager.query(`
      UPDATE notifications 
      SET is_read = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
    `, [notificationId, userId]);
  }

  public async processScheduledNotifications(): Promise<void> {
    try {
      const scheduledNotifications = await this.dbManager.query(`
        SELECT id
        FROM notifications
        WHERE scheduled_for <= CURRENT_TIMESTAMP 
          AND is_sent = false
        LIMIT 100
      `);

      for (const notification of scheduledNotifications) {
        await this.sendNotification(notification.id);
      }

      if (scheduledNotifications.length > 0) {
        logger.info(`Processed ${scheduledNotifications.length} scheduled notifications`);
      }

    } catch (error) {
      logger.error('Failed to process scheduled notifications:', error);
    }
  }
}