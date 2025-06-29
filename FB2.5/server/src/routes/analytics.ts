import express from 'express';
import { query, validationResult } from 'express-validator';

import { DatabaseManager } from '../database/DatabaseManager';
import { RedisManager } from '../cache/RedisManager';
import { AnalyticsService } from '../services/AnalyticsService';
import { logger } from '../utils/logger';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
const dbManager = new DatabaseManager();
const redisManager = new RedisManager();
const analyticsService = new AnalyticsService(dbManager, redisManager);

/**
 * @swagger
 * /api/analytics/trends:
 *   get:
 *     summary: Get productivity trends
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: week
 *     responses:
 *       200:
 *         description: Productivity trends retrieved successfully
 */
router.get('/trends', [
  authMiddleware,
  query('period').optional().isIn(['day', 'week', 'month', 'year'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.user.userId;
    const period = req.query.period as string || 'week';

    const trends = await analyticsService.getProductivityTrends(userId, period);

    res.json({
      success: true,
      data: trends
    });

  } catch (error) {
    logger.error('Get productivity trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/analytics/sleep-correlation:
 *   get:
 *     summary: Get sleep-productivity correlation
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sleep correlation data retrieved successfully
 */
router.get('/sleep-correlation', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const correlation = await analyticsService.getSleepProductivityCorrelation(userId);

    res.json({
      success: true,
      data: correlation
    });

  } catch (error) {
    logger.error('Get sleep correlation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/analytics/performance-windows:
 *   get:
 *     summary: Get optimal performance windows
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Performance windows retrieved successfully
 */
router.get('/performance-windows', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const windows = await analyticsService.getOptimalPerformanceWindows(userId);

    res.json({
      success: true,
      data: windows
    });

  } catch (error) {
    logger.error('Get performance windows error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/analytics/heatmap:
 *   get:
 *     summary: Get productivity heatmap data
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: timeRange
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 1y, 3y, 5y]
 *           default: 30d
 *     responses:
 *       200:
 *         description: Heatmap data retrieved successfully
 */
router.get('/heatmap', [
  authMiddleware,
  query('timeRange').optional().isIn(['7d', '30d', '90d', '1y', '3y', '5y'])
], async (req, res) => {
  try {
    const userId = req.user.userId;
    const timeRange = req.query.timeRange as string || '30d';

    // Calculate date range
    let daysBack: number;
    switch (timeRange) {
      case '7d': daysBack = 7; break;
      case '30d': daysBack = 30; break;
      case '90d': daysBack = 90; break;
      case '1y': daysBack = 365; break;
      case '3y': daysBack = 1095; break;
      case '5y': daysBack = 1825; break;
      default: daysBack = 30;
    }

    const heatmapData = await dbManager.query(`
      SELECT 
        DATE(start_time) as date,
        AVG(productivity_score) as avg_score,
        SUM(duration) as total_duration,
        COUNT(*) as session_count
      FROM activity_sessions
      WHERE user_id = $1 
        AND start_time >= CURRENT_DATE - INTERVAL '${daysBack} days'
      GROUP BY DATE(start_time)
      ORDER BY date ASC
    `, [userId]);

    // Fill in missing dates with zero values
    const filledData = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    for (let i = 0; i < daysBack; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];

      const existingData = heatmapData.find(d => d.date === dateStr);
      
      filledData.push({
        date: dateStr,
        score: existingData ? Math.round(parseFloat(existingData.avg_score)) : 0,
        duration: existingData ? parseInt(existingData.total_duration) : 0,
        sessions: existingData ? parseInt(existingData.session_count) : 0
      });
    }

    res.json({
      success: true,
      data: {
        timeRange,
        heatmapData: filledData,
        summary: {
          totalDays: daysBack,
          activeDays: heatmapData.length,
          avgScore: Math.round(
            heatmapData.reduce((sum, d) => sum + parseFloat(d.avg_score), 0) / 
            Math.max(heatmapData.length, 1)
          )
        }
      }
    });

  } catch (error) {
    logger.error('Get heatmap data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;