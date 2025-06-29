import { DatabaseManager } from '../database/DatabaseManager';
import { RedisManager } from '../cache/RedisManager';
import { logger } from '../utils/logger';

export class AnalyticsService {
  constructor(
    private dbManager: DatabaseManager,
    private redisManager: RedisManager
  ) {}

  public async updateUserAnalytics(userId: string): Promise<void> {
    try {
      // Calculate productivity metrics
      const metrics = await this.calculateProductivityMetrics(userId);
      
      // Update user profile
      await this.dbManager.query(`
        UPDATE user_profiles 
        SET 
          productivity_score = $1,
          total_focus_time = $2,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $3
      `, [
        metrics.productivityScore,
        metrics.totalFocusTime,
        userId
      ]);

      // Cache metrics for quick access
      await this.redisManager.cacheSet(
        `user_analytics:${userId}`,
        metrics,
        3600 // 1 hour TTL
      );

      logger.debug(`Updated analytics for user ${userId}`);

    } catch (error) {
      logger.error('Failed to update user analytics:', error);
      throw error;
    }
  }

  private async calculateProductivityMetrics(userId: string): Promise<any> {
    // Get recent activity data
    const activities = await this.dbManager.query(`
      SELECT 
        category,
        productivity_score,
        focus_quality,
        duration,
        start_time
      FROM activity_sessions
      WHERE user_id = $1 
        AND start_time >= NOW() - INTERVAL '30 days'
      ORDER BY start_time DESC
    `, [userId]);

    if (activities.length === 0) {
      return {
        productivityScore: 0,
        totalFocusTime: 0,
        averageFocusQuality: 0,
        categoryBreakdown: {}
      };
    }

    // Calculate weighted productivity score
    const totalDuration = activities.reduce((sum, act) => sum + act.duration, 0);
    const weightedScore = activities.reduce((sum, act) => {
      const weight = act.duration / totalDuration;
      return sum + (act.productivity_score * weight);
    }, 0);

    // Calculate total focus time (high productivity sessions)
    const focusTime = activities
      .filter(act => act.productivity_score >= 70)
      .reduce((sum, act) => sum + act.duration, 0);

    // Calculate average focus quality
    const avgFocusQuality = activities.reduce((sum, act) => sum + (act.focus_quality || 0), 0) / activities.length;

    // Category breakdown
    const categoryBreakdown = activities.reduce((breakdown, act) => {
      if (!breakdown[act.category]) {
        breakdown[act.category] = {
          duration: 0,
          sessions: 0,
          avgProductivity: 0
        };
      }
      
      breakdown[act.category].duration += act.duration;
      breakdown[act.category].sessions += 1;
      breakdown[act.category].avgProductivity = 
        (breakdown[act.category].avgProductivity + act.productivity_score) / 2;
      
      return breakdown;
    }, {});

    return {
      productivityScore: Math.round(weightedScore),
      totalFocusTime: Math.round(focusTime / 60), // Convert to minutes
      averageFocusQuality: Math.round(avgFocusQuality),
      categoryBreakdown
    };
  }

  public async getProductivityTrends(userId: string, period: string = 'week'): Promise<any> {
    const cacheKey = `productivity_trends:${userId}:${period}`;
    
    // Try to get from cache first
    const cached = await this.redisManager.cacheGet(cacheKey);
    if (cached) {
      return cached;
    }

    // Calculate date range
    let interval: string;
    let groupBy: string;
    
    switch (period) {
      case 'day':
        interval = '24 hours';
        groupBy = "DATE_TRUNC('hour', start_time)";
        break;
      case 'week':
        interval = '7 days';
        groupBy = "DATE_TRUNC('day', start_time)";
        break;
      case 'month':
        interval = '30 days';
        groupBy = "DATE_TRUNC('day', start_time)";
        break;
      case 'year':
        interval = '365 days';
        groupBy = "DATE_TRUNC('week', start_time)";
        break;
      default:
        interval = '7 days';
        groupBy = "DATE_TRUNC('day', start_time)";
    }

    const trends = await this.dbManager.query(`
      SELECT 
        ${groupBy} as period,
        AVG(productivity_score) as avg_productivity,
        AVG(focus_quality) as avg_focus_quality,
        SUM(duration) as total_duration,
        COUNT(*) as session_count
      FROM activity_sessions
      WHERE user_id = $1 
        AND start_time >= NOW() - INTERVAL '${interval}'
      GROUP BY ${groupBy}
      ORDER BY period ASC
    `, [userId]);

    // Cache for 30 minutes
    await this.redisManager.cacheSet(cacheKey, trends, 1800);

    return trends;
  }

  public async getSleepProductivityCorrelation(userId: string): Promise<any> {
    const cacheKey = `sleep_correlation:${userId}`;
    
    // Try cache first
    const cached = await this.redisManager.cacheGet(cacheKey);
    if (cached) {
      return cached;
    }

    // Get sleep and productivity data
    const correlationData = await this.dbManager.query(`
      SELECT 
        w.date,
        w.sleep_hours,
        w.sleep_quality,
        AVG(a.productivity_score) as daily_productivity,
        AVG(a.focus_quality) as daily_focus_quality,
        SUM(a.duration) as daily_focus_time
      FROM wellness_data w
      LEFT JOIN activity_sessions a ON DATE(a.start_time) = w.date + INTERVAL '1 day'
        AND a.user_id = w.user_id
      WHERE w.user_id = $1 
        AND w.date >= CURRENT_DATE - INTERVAL '90 days'
        AND w.sleep_hours IS NOT NULL
      GROUP BY w.date, w.sleep_hours, w.sleep_quality
      ORDER BY w.date DESC
    `, [userId]);

    if (correlationData.length < 7) {
      return {
        correlation: 0,
        insights: [],
        data: []
      };
    }

    // Calculate correlation coefficient
    const correlation = this.calculateCorrelation(
      correlationData.map(d => d.sleep_hours),
      correlationData.map(d => d.daily_productivity || 0)
    );

    // Generate insights
    const insights = this.generateSleepInsights(correlationData, correlation);

    const result = {
      correlation: Math.round(correlation * 100) / 100,
      insights,
      data: correlationData
    };

    // Cache for 2 hours
    await this.redisManager.cacheSet(cacheKey, result, 7200);

    return result;
  }

  private calculateCorrelation(x: number[], y: number[]): number {
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

  private generateSleepInsights(data: any[], correlation: number): string[] {
    const insights: string[] = [];

    if (correlation > 0.5) {
      insights.push('Strong positive correlation between sleep and productivity detected');
    } else if (correlation > 0.3) {
      insights.push('Moderate correlation between sleep and productivity');
    } else {
      insights.push('Weak correlation between sleep and productivity');
    }

    // Find optimal sleep duration
    const sleepGroups = data.reduce((groups, item) => {
      const sleepRange = Math.floor(item.sleep_hours);
      if (!groups[sleepRange]) {
        groups[sleepRange] = [];
      }
      groups[sleepRange].push(item.daily_productivity || 0);
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

    return insights;
  }

  public async getOptimalPerformanceWindows(userId: string): Promise<any> {
    const cacheKey = `performance_windows:${userId}`;
    
    const cached = await this.redisManager.cacheGet(cacheKey);
    if (cached) {
      return cached;
    }

    // Get hourly performance data
    const hourlyData = await this.dbManager.query(`
      SELECT 
        EXTRACT(HOUR FROM start_time) as hour,
        AVG(productivity_score) as avg_productivity,
        AVG(focus_quality) as avg_focus_quality,
        COUNT(*) as session_count,
        SUM(duration) as total_duration
      FROM activity_sessions
      WHERE user_id = $1 
        AND start_time >= NOW() - INTERVAL '30 days'
      GROUP BY EXTRACT(HOUR FROM start_time)
      ORDER BY hour ASC
    `, [userId]);

    // Identify peak windows
    const peakWindows = this.identifyPeakWindows(hourlyData);

    const result = {
      hourlyData,
      peakWindows,
      recommendations: this.generatePerformanceRecommendations(peakWindows)
    };

    // Cache for 1 hour
    await this.redisManager.cacheSet(cacheKey, result, 3600);

    return result;
  }

  private identifyPeakWindows(hourlyData: any[]): any[] {
    if (hourlyData.length === 0) return [];

    const avgProductivity = hourlyData.reduce((sum, h) => sum + parseFloat(h.avg_productivity), 0) / hourlyData.length;
    
    return hourlyData
      .filter(h => parseFloat(h.avg_productivity) > avgProductivity * 1.1) // 10% above average
      .sort((a, b) => parseFloat(b.avg_productivity) - parseFloat(a.avg_productivity))
      .slice(0, 3) // Top 3 windows
      .map(h => ({
        hour: parseInt(h.hour),
        productivity: Math.round(parseFloat(h.avg_productivity)),
        focusQuality: Math.round(parseFloat(h.avg_focus_quality)),
        sessionCount: parseInt(h.session_count)
      }));
  }

  private generatePerformanceRecommendations(peakWindows: any[]): string[] {
    const recommendations: string[] = [];

    if (peakWindows.length > 0) {
      const topWindow = peakWindows[0];
      recommendations.push(`Schedule your most important tasks around ${topWindow.hour}:00`);
      
      if (peakWindows.length > 1) {
        const secondWindow = peakWindows[1];
        recommendations.push(`Consider a secondary focus block at ${secondWindow.hour}:00`);
      }
    }

    return recommendations;
  }
}