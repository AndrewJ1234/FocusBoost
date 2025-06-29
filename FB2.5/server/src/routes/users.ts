import express from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';

import { DatabaseManager } from '../database/DatabaseManager';
import { RedisManager } from '../cache/RedisManager';
import { logger } from '../utils/logger';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
const dbManager = new DatabaseManager();
const redisManager = new RedisManager();

// Configure multer for avatar uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const users = await dbManager.query(`
      SELECT 
        u.id, u.email, u.first_name, u.last_name, u.avatar_url, 
        u.timezone, u.preferences, u.is_verified, u.created_at,
        up.productivity_score, up.global_rank, up.focus_streak, 
        up.total_focus_time, up.level, up.experience_points,
        up.avatar_data, up.cottage_data, up.achievements
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.id = $1
    `, [userId]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        avatarUrl: user.avatar_url,
        timezone: user.timezone,
        preferences: user.preferences,
        isVerified: user.is_verified,
        createdAt: user.created_at,
        profile: {
          productivityScore: user.productivity_score || 0,
          globalRank: user.global_rank,
          focusStreak: user.focus_streak || 0,
          totalFocusTime: user.total_focus_time || 0,
          level: user.level || 1,
          experiencePoints: user.experience_points || 0,
          avatarData: user.avatar_data || {},
          cottageData: user.cottage_data || {},
          achievements: user.achievements || []
        }
      }
    });

  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               timezone:
 *                 type: string
 *               preferences:
 *                 type: object
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/profile', [
  authMiddleware,
  body('firstName').optional().trim().isLength({ min: 1, max: 100 }),
  body('lastName').optional().trim().isLength({ min: 1, max: 100 }),
  body('timezone').optional().isString(),
  body('preferences').optional().isObject()
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
    const { firstName, lastName, timezone, preferences } = req.body;

    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    if (firstName !== undefined) {
      updateFields.push(`first_name = $${paramIndex}`);
      updateValues.push(firstName);
      paramIndex++;
    }

    if (lastName !== undefined) {
      updateFields.push(`last_name = $${paramIndex}`);
      updateValues.push(lastName);
      paramIndex++;
    }

    if (timezone !== undefined) {
      updateFields.push(`timezone = $${paramIndex}`);
      updateValues.push(timezone);
      paramIndex++;
    }

    if (preferences !== undefined) {
      updateFields.push(`preferences = $${paramIndex}`);
      updateValues.push(JSON.stringify(preferences));
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    updateValues.push(userId);

    await dbManager.query(`
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
    `, updateValues);

    logger.info(`Profile updated for user ${userId}`);

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/users/avatar:
 *   post:
 *     summary: Upload user avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 */
router.post('/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No avatar file provided'
      });
    }

    const userId = req.user.userId;
    const filename = `avatar_${userId}_${Date.now()}.webp`;
    const avatarPath = path.join('uploads', 'avatars', filename);

    // Process image with sharp
    await sharp(req.file.buffer)
      .resize(200, 200)
      .webp({ quality: 80 })
      .toFile(avatarPath);

    const avatarUrl = `/uploads/avatars/${filename}`;

    // Update user avatar URL
    await dbManager.query(`
      UPDATE users 
      SET avatar_url = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [avatarUrl, userId]);

    logger.info(`Avatar uploaded for user ${userId}`);

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatarUrl
      }
    });

  } catch (error) {
    logger.error('Avatar upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: Get user statistics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 */
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get comprehensive user statistics
    const stats = await dbManager.query(`
      SELECT 
        COUNT(DISTINCT DATE(start_time)) as active_days,
        SUM(duration) as total_focus_time,
        AVG(productivity_score) as avg_productivity,
        COUNT(*) as total_sessions,
        MAX(productivity_score) as best_session
      FROM activity_sessions
      WHERE user_id = $1 
        AND start_time >= NOW() - INTERVAL '30 days'
    `, [userId]);

    const todayStats = await dbManager.query(`
      SELECT 
        COUNT(*) as today_sessions,
        SUM(duration) as today_focus_time,
        AVG(productivity_score) as today_productivity
      FROM activity_sessions
      WHERE user_id = $1 
        AND DATE(start_time) = CURRENT_DATE
    `, [userId]);

    const streakData = await dbManager.query(`
      SELECT focus_streak, level, experience_points
      FROM user_profiles
      WHERE user_id = $1
    `, [userId]);

    res.json({
      success: true,
      data: {
        monthly: {
          activeDays: parseInt(stats[0].active_days) || 0,
          totalFocusTime: parseInt(stats[0].total_focus_time) || 0,
          avgProductivity: Math.round(parseFloat(stats[0].avg_productivity)) || 0,
          totalSessions: parseInt(stats[0].total_sessions) || 0,
          bestSession: parseInt(stats[0].best_session) || 0
        },
        today: {
          sessions: parseInt(todayStats[0].today_sessions) || 0,
          focusTime: parseInt(todayStats[0].today_focus_time) || 0,
          productivity: Math.round(parseFloat(todayStats[0].today_productivity)) || 0
        },
        progression: {
          focusStreak: streakData[0]?.focus_streak || 0,
          level: streakData[0]?.level || 1,
          experiencePoints: streakData[0]?.experience_points || 0
        }
      }
    });

  } catch (error) {
    logger.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;