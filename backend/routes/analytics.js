const express = require('express');
const { query } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get dashboard summary statistics
 * @access  Private
 */
router.get('/dashboard', async (req, res) => {
  const userId = req.user.userId;

  try {
    // Get total goals by category and status
    const goalsStats = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE category = 'fitness') as fitness_goals,
        COUNT(*) FILTER (WHERE category = 'nutrition') as nutrition_goals,
        COUNT(*) FILTER (WHERE category = 'job_search') as job_search_goals,
        COUNT(*) FILTER (WHERE status = 'active') as active_goals,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_goals,
        COUNT(*) as total_goals
       FROM goals 
       WHERE user_id = $1`,
      [userId]
    );

    // Get recent progress entries count (last 7 days)
    const recentProgress = await pool.query(
      `SELECT COUNT(*) as recent_entries
       FROM progress_entries pe
       JOIN goals g ON pe.goal_id = g.id
       WHERE g.user_id = $1 
       AND pe.entry_date >= CURRENT_DATE - INTERVAL '7 days'`,
      [userId]
    );

    // Get total progress entries
    const totalProgress = await pool.query(
      `SELECT COUNT(*) as total_entries
       FROM progress_entries pe
       JOIN goals g ON pe.goal_id = g.id
       WHERE g.user_id = $1`,
      [userId]
    );

    // Get recent progress entries with goal details (last 7 days, limit 5)
    const recentProgressEntries = await pool.query(
      `SELECT 
        pe.id,
        pe.entry_date as date,
        pe.value,
        pe.unit,
        pe.notes,
        g.title as goal_title,
        g.category
       FROM progress_entries pe
       JOIN goals g ON pe.goal_id = g.id
       WHERE g.user_id = $1
       ORDER BY pe.entry_date DESC, pe.created_at DESC
       LIMIT 5`,
      [userId]
    );

    res.json({
      totalGoals: parseInt(goalsStats.rows[0].total_goals),
      activeGoals: parseInt(goalsStats.rows[0].active_goals),
      completedGoals: parseInt(goalsStats.rows[0].completed_goals),
      totalProgress: parseInt(totalProgress.rows[0].total_entries),
      recentProgressCount: parseInt(recentProgress.rows[0].recent_entries),
      recentProgress: recentProgressEntries.rows.map(entry => ({
        id: entry.id,
        date: entry.date,
        value: parseFloat(entry.value),
        unit: entry.unit,
        notes: entry.notes,
        goalTitle: entry.goal_title,
        category: entry.category
      })),
      categoryBreakdown: [
        { category: 'fitness', count: parseInt(goalsStats.rows[0].fitness_goals) },
        { category: 'nutrition', count: parseInt(goalsStats.rows[0].nutrition_goals) },
        { category: 'job_search', count: parseInt(goalsStats.rows[0].job_search_goals) }
      ]
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard analytics' });
  }
});

/**
 * @route   GET /api/analytics/goal/:goalId
 * @desc    Get detailed analytics for a specific goal
 * @access  Private
 */
router.get(
  '/goal/:goalId',
  [
    query('period').optional().isIn(['7d', '30d', '90d', 'all']).withMessage('Invalid period')
  ],
  validate,
  async (req, res) => {
    const { goalId } = req.params;
    const { period = '30d' } = req.query;
    const userId = req.user.userId;

    try {
      // Verify goal belongs to user
      const goalCheck = await pool.query(
        'SELECT id, title, target_value, target_unit FROM goals WHERE id = $1 AND user_id = $2',
        [goalId, userId]
      );

      if (goalCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Goal not found' });
      }

      const goal = goalCheck.rows[0];

      // Calculate date range
      let dateFilter = '';
      if (period !== 'all') {
        const days = parseInt(period);
        dateFilter = `AND entry_date >= CURRENT_DATE - INTERVAL '${days} days'`;
      }

      // Get progress entries with statistics
      const progressData = await pool.query(
        `SELECT 
          entry_date,
          value,
          unit,
          notes
         FROM progress_entries
         WHERE goal_id = $1 ${dateFilter}
         ORDER BY entry_date ASC`,
        [goalId]
      );

      // Calculate statistics
      const values = progressData.rows.map(row => parseFloat(row.value));
      const stats = {
        count: values.length,
        average: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0,
        min: values.length > 0 ? Math.min(...values) : 0,
        max: values.length > 0 ? Math.max(...values) : 0,
        latest: values.length > 0 ? values[values.length - 1] : 0
      };

      // Calculate progress toward target (if target exists)
      let progressPercentage = null;
      if (goal.target_value && stats.latest) {
        progressPercentage = (stats.latest / parseFloat(goal.target_value)) * 100;
      }

      // Calculate trend (comparing first half vs second half)
      let trend = 'stable';
      if (values.length >= 4) {
        const midpoint = Math.floor(values.length / 2);
        const firstHalfAvg = values.slice(0, midpoint).reduce((a, b) => a + b, 0) / midpoint;
        const secondHalfAvg = values.slice(midpoint).reduce((a, b) => a + b, 0) / (values.length - midpoint);
        
        const changePercent = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
        if (changePercent > 5) trend = 'increasing';
        else if (changePercent < -5) trend = 'decreasing';
      }

      res.json({
        goalId: goal.id,
        goalTitle: goal.title,
        targetValue: goal.target_value,
        targetUnit: goal.target_unit,
        period,
        statistics: {
          ...stats,
          progressPercentage,
          trend
        },
        data: progressData.rows.map(row => ({
          date: row.entry_date,
          value: row.value,
          unit: row.unit,
          notes: row.notes
        }))
      });
    } catch (error) {
      console.error('Goal analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch goal analytics' });
    }
  }
);

/**
 * @route   GET /api/analytics/trends
 * @desc    Get trend analysis across all goals by category
 * @access  Private
 */
router.get('/trends', async (req, res) => {
  const userId = req.user.userId;

  try {
    // Get progress trends for the last 30 days by category
    const trends = await pool.query(
      `SELECT 
        g.category,
        DATE(pe.entry_date) as date,
        COUNT(pe.id) as entries_count,
        AVG(pe.value) as avg_value
       FROM progress_entries pe
       JOIN goals g ON pe.goal_id = g.id
       WHERE g.user_id = $1
       AND pe.entry_date >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY g.category, DATE(pe.entry_date)
       ORDER BY date ASC, g.category`,
      [userId]
    );

    // Group by category
    const trendsByCategory = {
      fitness: [],
      nutrition: [],
      job_search: []
    };

    trends.rows.forEach(row => {
      trendsByCategory[row.category].push({
        date: row.date,
        entriesCount: parseInt(row.entries_count),
        avgValue: parseFloat(row.avg_value)
      });
    });

    res.json({
      period: '30 days',
      trends: trendsByCategory
    });
  } catch (error) {
    console.error('Trends analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

/**
 * @route   GET /api/analytics/streak
 * @desc    Get current streak of consecutive days with progress entries
 * @access  Private
 */
router.get('/streak', async (req, res) => {
  const userId = req.user.userId;

  try {
    // Get all unique dates with progress entries
    const entries = await pool.query(
      `SELECT DISTINCT DATE(pe.entry_date) as entry_date
       FROM progress_entries pe
       JOIN goals g ON pe.goal_id = g.id
       WHERE g.user_id = $1
       ORDER BY entry_date DESC`,
      [userId]
    );

    // Calculate current streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    if (entries.rows.length > 0) {
      const dates = entries.rows.map(row => new Date(row.entry_date));
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if there's an entry today or yesterday
      const lastEntry = dates[0];
      const daysDiff = Math.floor((today - lastEntry) / (1000 * 60 * 60 * 24));

      if (daysDiff <= 1) {
        currentStreak = 1;
        tempStreak = 1;

        // Count consecutive days
        for (let i = 1; i < dates.length; i++) {
          const diff = Math.floor((dates[i - 1] - dates[i]) / (1000 * 60 * 60 * 24));
          if (diff === 1) {
            currentStreak++;
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
      }

      longestStreak = Math.max(longestStreak, tempStreak);
    }

    res.json({
      currentStreak,
      longestStreak
    });
  } catch (error) {
    console.error('Streak analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch streak data' });
  }
});

module.exports = router;
