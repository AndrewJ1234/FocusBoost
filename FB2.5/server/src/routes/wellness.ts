import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';

import { DatabaseManager } from '../database/DatabaseManager';
import { RedisManager } from '../cache/RedisManager';
import { logger } from '../utils/logger';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
const dbManager = new DatabaseManager();
const redisManager = new RedisManager();

/**
 * @swagger
 * /api/wellness/log:
 *   post:
 *     summary: Log wellness data
 *     tags: [Wellness]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               sleepHours:
 *                 type: number
 *               sleepQuality:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *               waterIntake:
 *                 type: integer
 *               exerciseMinutes:
 *                 type: integer
 *               weight:
 *                 type: number
 *               moodRating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *               stressLevel:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *               nutritionScore:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 100
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Wellness data logged successfully
 */
router.post('/log', [
  authMiddleware,
  body('date').isISO8601().toDate(),
  body('sleepHours').optional().isFloat({ min: 0, max: 24 }),
  body('sleepQuality').optional().isInt({ min: 1, max: 10 }),
  body('waterIntake').optional().isInt({ min: 0 }),
  body('exerciseMinutes').optional().isInt({ min: 0 }),
  body('weight').optional().isFloat({ min: 0 }),
  body('moodRating').optional().isInt({ min: 1, max: 10 }),
  body('stressLevel').optional().isInt({ min: 1, max: 10 }),
  body('nutritionScore').optional().isInt({ min: 1, max: 100 }),
  body('notes').optional().trim().isLength({ max: 1000 })
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
      date,
      sleepHours,
      sleepQuality,
      waterIntake,
      exerciseMinutes,
      weight,
      moodRating,
      stressLevel,
      nutritionScore,
      notes
    } = req.body;

    const wellnessId = uuidv4();

    // Insert or update wellness data
    await dbManager.query(`
      INSERT INTO wellness_data (
        id, user_id, date, sleep_hours, sleep_quality, water_intake,
        exercise_minutes, weight, mood_rating, stress_level, 
        nutrition_score, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (user_id, date) 
      DO UPDATE SET
        sleep_hours = EXCLUDED.sleep_hours,
        sleep_quality = EXCLUDED.sleep_quality,
        water_intake = EXCLUDED.water_intake,
        exercise_minutes = EXCLUDED.exercise_minutes,
        weight = EXCLUDED.weight,
        mood_rating = EXCLUDED.mood_rating,
        stress_level = EXCLUDED.stress_level,
        nutrition_score = EXCLUDED.nutrition_score,
        notes = EXCLUDED.notes,
        created_at = CURRENT_TIMESTAMP
    `, [
      wellnessId, userId, date, sleepHours, sleepQuality, waterIntake,
      exerciseMinutes, weight, moodRating, stressLevel, nutritionScore, notes
    ]);

    logger.info(`Wellness data logged for user ${userId} on ${date}`);

    res.status(201).json({
      success: true,
      message: 'Wellness data logged successfully',
      data: {
        id: wellnessId,
        date,
        sleepHours,
        sleepQuality,
        waterIntake,
        exerciseMinutes,
        weight,
        moodRating,
        stressLevel,
        nutritionScore
      }
    });

  } catch (error) {
    logger.error('Log wellness data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/wellness/data:
 *   get:
 *     summary: Get wellness data
 *     tags: [Wellness]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Wellness data retrieved successfully
 */
router.get('/data', [
  authMiddleware,
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], async (req, res) => {
  try {
    const userId = req.user.userId;
    const startDate = req.query.startDate as string || 
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = req.query.endDate as string || 
      new Date().toISOString().split('T')[0];

    const wellnessData = await dbManager.query(`
      SELECT 
        date, sleep_hours, sleep_quality, water_intake, exercise_minutes,
        weight, mood_rating, stress_level, nutrition_score, notes, created_at
      FROM wellness_data
      WHERE user_id = $1 
        AND date >= $2 
        AND date <= $3
      ORDER BY date DESC
    `, [userId, startDate, endDate]);

    res.json({
      success: true,
      data: {
        wellnessData: wellnessData.map(item => ({
          date: item.date,
          sleepHours: parseFloat(item.sleep_hours) || null,
          sleepQuality: item.sleep_quality,
          waterIntake: item.water_intake,
          exerciseMinutes: item.exercise_minutes,
          weight: parseFloat(item.weight) || null,
          moodRating: item.mood_rating,
          stressLevel: item.stress_level,
          nutritionScore: item.nutrition_score,
          notes: item.notes,
          createdAt: item.created_at
        })),
        dateRange: {
          startDate,
          endDate
        }
      }
    });

  } catch (error) {
    logger.error('Get wellness data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/wellness/correlations:
 *   get:
 *     summary: Get wellness-productivity correlations
 *     tags: [Wellness]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Correlation data retrieved successfully
 */
router.get('/correlations', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get wellness and productivity correlation data
    const correlationData = await dbManager.query(`
      SELECT 
        w.date,
        w.sleep_hours,
        w.sleep_quality,
        w.exercise_minutes,
        w.mood_rating,
        w.stress_level,
        AVG(a.productivity_score) as daily_productivity,
        SUM(a.duration) as daily_focus_time,
        COUNT(a.id) as daily_sessions
      FROM wellness_data w
      LEFT JOIN activity_sessions a ON DATE(a.start_time) = w.date + INTERVAL '1 day'
        AND a.user_id = w.user_id
      WHERE w.user_id = $1 
        AND w.date >= CURRENT_DATE - INTERVAL '90 days'
      GROUP BY w.date, w.sleep_hours, w.sleep_quality, w.exercise_minutes, w.mood_rating, w.stress_level
      ORDER BY w.date DESC
    `, [userId]);

    // Calculate correlations
    const sleepProductivityCorr = calculateCorrelation(
      correlationData.map(d => parseFloat(d.sleep_hours) || 0),
      correlationData.map(d => parseFloat(d.daily_productivity) || 0)
    );

    const exerciseProductivityCorr = calculateCorrelation(
      correlationData.map(d => parseInt(d.exercise_minutes) || 0),
      correlationData.map(d => parseFloat(d.daily_productivity) || 0)
    );

    const moodProductivityCorr = calculateCorrelation(
      correlationData.map(d => parseInt(d.mood_rating) || 0),
      correlationData.map(d => parseFloat(d.daily_productivity) || 0)
    );

    res.json({
      success: true,
      data: {
        correlations: {
          sleepProductivity: Math.round(sleepProductivityCorr * 100) / 100,
          exerciseProductivity: Math.round(exerciseProductivityCorr * 100) / 100,
          moodProductivity: Math.round(moodProductivityCorr * 100) / 100
        },
        rawData: correlationData,
        insights: generateWellnessInsights(correlationData, {
          sleepProductivity: sleepProductivityCorr,
          exerciseProductivity: exerciseProductivityCorr,
          moodProductivity: moodProductivityCorr
        })
      }
    });

  } catch (error) {
    logger.error('Get wellness correlations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Helper function to calculate correlation coefficient
function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n === 0) return 0;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
}

// Generate insights based on correlation data
function generateWellnessInsights(data: any[], correlations: any): string[] {
  const insights: string[] = [];

  if (correlations.sleepProductivity > 0.5) {
    insights.push('Strong positive correlation between sleep and productivity detected');
    
    // Find optimal sleep duration
    const sleepGroups = data.reduce((groups, item) => {
      const sleepRange = Math.floor(parseFloat(item.sleep_hours) || 0);
      if (!groups[sleepRange]) groups[sleepRange] = [];
      groups[sleepRange].push(parseFloat(item.daily_productivity) || 0);
      return groups;
    }, {});

    let bestSleepHours = 8;
    let bestProductivity = 0;
    Object.entries(sleepGroups).forEach(([hours, productivities]: [string, number[]]) => {
      const avgProductivity = productivities.reduce((a, b) => a + b, 0) / productivities.length;
      if (avgProductivity > bestProductivity) {
        bestProductivity = avgProductivity;
        bestSleepHours = parseInt(hours);
      }
    });

    insights.push(`Optimal sleep duration appears to be around ${bestSleepHours} hours`);
  }

  if (correlations.exerciseProductivity > 0.3) {
    insights.push('Exercise positively impacts your productivity');
  }

  if (correlations.moodProductivity > 0.4) {
    insights.push('Your mood significantly affects your productivity levels');
  }

  return insights;
}

export default router;