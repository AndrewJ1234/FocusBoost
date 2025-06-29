import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';

import { DatabaseManager } from '../database/DatabaseManager';
import { RedisManager } from '../cache/RedisManager';
import { logger } from '../utils/logger';
import { AnalyticsService } from '../services/AnalyticsService';

const router = express.Router();
const dbManager = new DatabaseManager();
const redisManager = new RedisManager();
const analyticsService = new AnalyticsService(dbManager, redisManager);

/**
 * @swagger
 * /api/activity/sessions:
 *   post:
 *     summary: Create a new activity session
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *               - title
 *               - startTime
 *               - duration
 *             properties:
 *               url:
 *                 type: string
 *               title:
 *                 type: string
 *               domain:
 *                 type: string
 *               category:
 *                 type: string
 *               subcategory:
 *                 type: string
 *               productivityScore:
 *                 type: integer
 *               focusQuality:
 *                 type: integer
 *               duration:
 *                 type: integer
 *               distractions:
 *                 type: integer
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Activity session created successfully
 *       400:
 *         description: Validation error
 */
router.post('/sessions', [
  body('url').isURL(),
  body('title').trim().isLength({ min: 1, max: 500 }),
  body('duration').isInt({ min: 1 }),
  body('startTime').isISO8601(),
  body('productivityScore').optional().isInt({ min: 0, max: 100 }),
  body('focusQuality').optional().isInt({ min: 0, max: 100 }),
  body('distractions').optional().isInt({ min: 0 })
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
    const {
      url,
      title,
      domain,
      category,
      subcategory,
      productivityScore,
      focusQuality,
      duration,
      distractions,
      startTime,
      endTime,
      metadata
    } = req.body;

    const sessionId = uuidv4();

    // Insert activity session
    await dbManager.query(`
      INSERT INTO activity_sessions (
        id, user_id, url, title, domain, category, subcategory,
        productivity_score, focus_quality, duration, distractions,
        start_time, end_time, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `, [
      sessionId, userId, url, title, domain, category, subcategory,
      productivityScore, focusQuality, duration, distractions,
      startTime, endTime, JSON.stringify(metadata || {})
    ]);

    // Update user analytics asynchronously
    analyticsService.updateUserAnalytics(userId).catch(error => {
      logger.error('Failed to update user analytics:', error);
    });

    logger.info(`Activity session created for user ${userId}: ${title}`);

    res.status(201).json({
      success: true,
      message: 'Activity session created successfully',
      data: {
        sessionId,
        url,
        title,
        category,
        duration,
        productivityScore
      }
    });

  } catch (error) {
    logger.error('Create activity session error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/activity/sessions:
 *   get:
 *     summary: Get user activity sessions
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Activity sessions retrieved successfully
 */
router.get('/sessions', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().trim(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const category = req.query.category as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    const offset = (page - 1) * limit;

    // Build query conditions
    let whereConditions = ['user_id = $1'];
    let queryParams: any[] = [userId];
    let paramIndex = 2;

    if (category) {
      whereConditions.push(`category = $${paramIndex}`);
      queryParams.push(category);
      paramIndex++;
    }

    if (startDate) {
      whereConditions.push(`start_time >= $${paramIndex}`);
      queryParams.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      whereConditions.push(`start_time <= $${paramIndex}`);
      queryParams.push(endDate);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    // Get sessions
    const sessions = await dbManager.query(`
      SELECT 
        id, url, title, domain, category, subcategory,
        productivity_score, focus_quality, duration, distractions,
        start_time, end_time, metadata, created_at
      FROM activity_sessions
      WHERE ${whereClause}
      ORDER BY start_time DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...queryParams, limit, offset]);

    // Get total count
    const countResult = await dbManager.query(`
      SELECT COUNT(*) as total
      FROM activity_sessions
      WHERE ${whereClause}
    `, queryParams);

    const total = parseInt(countResult[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        sessions,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    logger.error('Get activity sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/activity/realtime:
 *   post:
 *     summary: Receive real-time activity data from extension
 *     tags: [Activity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               data:
 *                 type: object
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Real-time data received successfully
 */
router.post('/realtime', async (req, res) => {
  try {
    const { type, data, timestamp } = req.body;

    // Store in Redis for real-time processing
    const key = `realtime:${Date.now()}:${Math.random()}`;
    await redisManager.setex(key, 3600, JSON.stringify({
      type,
      data,
      timestamp,
      receivedAt: new Date().toISOString()
    }));

    // Process based on type
    switch (type) {
      case 'session_start':
        // Handle session start
        break;
      case 'session_update':
        // Handle session update
        break;
      case 'session_end':
        // Handle session end
        break;
      default:
        logger.warn(`Unknown real-time event type: ${type}`);
    }

    res.json({
      success: true,
      message: 'Real-time data received successfully'
    });

  } catch (error) {
    logger.error('Real-time activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/activity/sync:
 *   post:
 *     summary: Sync activity data from extension
 *     tags: [Activity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - activities
 *             properties:
 *               activities:
 *                 type: array
 *                 items:
 *                   type: object
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Activities synced successfully
 */
router.post('/sync', async (req, res) => {
  try {
    const { activities, timestamp } = req.body;

    if (!Array.isArray(activities) || activities.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Activities array is required'
      });
    }

    // Process activities in batch
    const processedCount = await dbManager.transaction(async (client) => {
      let count = 0;
      
      for (const activity of activities) {
        try {
          await client.query(`
            INSERT INTO activity_sessions (
              id, user_id, url, title, domain, category, subcategory,
              productivity_score, focus_quality, duration, distractions,
              start_time, end_time, metadata
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            ON CONFLICT (id) DO NOTHING
          `, [
            activity.id || uuidv4(),
            req.user?.userId || 'anonymous',
            activity.url,
            activity.title,
            activity.domain,
            activity.category?.primary || 'General',
            activity.category?.secondary,
            activity.productivityScore,
            activity.focusQuality,
            activity.duration,
            activity.distractions || 0,
            activity.startTime,
            activity.endTime,
            JSON.stringify(activity.metadata || {})
          ]);
          count++;
        } catch (error) {
          logger.error('Failed to insert activity:', error);
        }
      }
      
      return count;
    });

    logger.info(`Synced ${processedCount} activities`);

    res.json({
      success: true,
      message: 'Activities synced successfully',
      data: {
        processed: processedCount,
        total: activities.length
      }
    });

  } catch (error) {
    logger.error('Activity sync error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/activity/categories:
 *   get:
 *     summary: Get activity categories with statistics
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [today, week, month, year]
 *           default: week
 *     responses:
 *       200:
 *         description: Activity categories retrieved successfully
 */
router.get('/categories', [
  query('period').optional().isIn(['today', 'week', 'month', 'year'])
], async (req, res) => {
  try {
    const userId = req.user.userId;
    const period = req.query.period as string || 'week';

    // Calculate date range
    let startDate: string;
    const endDate = new Date().toISOString();

    switch (period) {
      case 'today':
        startDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
        break;
      case 'week':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        startDate = weekAgo.toISOString();
        break;
      case 'month':
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        startDate = monthAgo.toISOString();
        break;
      case 'year':
        const yearAgo = new Date();
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        startDate = yearAgo.toISOString();
        break;
      default:
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    }

    const categories = await dbManager.query(`
      SELECT 
        category,
        COUNT(*) as session_count,
        SUM(duration) as total_duration,
        AVG(productivity_score) as avg_productivity_score,
        AVG(focus_quality) as avg_focus_quality,
        SUM(distractions) as total_distractions
      FROM activity_sessions
      WHERE user_id = $1 
        AND start_time >= $2 
        AND start_time <= $3
        AND category IS NOT NULL
      GROUP BY category
      ORDER BY total_duration DESC
    `, [userId, startDate, endDate]);

    // Calculate percentages
    const totalDuration = categories.reduce((sum, cat) => sum + parseInt(cat.total_duration), 0);
    
    const categoriesWithPercentages = categories.map(cat => ({
      ...cat,
      total_duration: parseInt(cat.total_duration),
      avg_productivity_score: Math.round(parseFloat(cat.avg_productivity_score) || 0),
      avg_focus_quality: Math.round(parseFloat(cat.avg_focus_quality) || 0),
      percentage: totalDuration > 0 ? Math.round((parseInt(cat.total_duration) / totalDuration) * 100) : 0
    }));

    res.json({
      success: true,
      data: {
        categories: categoriesWithPercentages,
        period,
        totalDuration,
        dateRange: {
          startDate,
          endDate
        }
      }
    });

  } catch (error) {
    logger.error('Get activity categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;