const express = require('express');
const { body, param, query } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

/**
 * @route   GET /api/goals
 * @desc    Get all goals for the authenticated user
 * @access  Private
 */
router.get(
  '/',
  [
    query('category').optional().isIn(['fitness', 'nutrition', 'job_search']),
    query('status').optional().isIn(['active', 'completed', 'paused', 'abandoned'])
  ],
  validate,
  async (req, res) => {
    const { category, status } = req.query;
    const userId = req.user.userId;

    try {
      let query = 'SELECT * FROM goals WHERE user_id = $1';
      const params = [userId];
      let paramIndex = 2;

      if (category) {
        query += ` AND category = $${paramIndex}`;
        params.push(category);
        paramIndex++;
      }

      if (status) {
        query += ` AND status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
      }

      query += ' ORDER BY created_at DESC';

      const result = await pool.query(query, params);

      res.json({
        goals: result.rows.map(goal => ({
          id: goal.id,
          category: goal.category,
          title: goal.title,
          description: goal.description,
          targetValue: goal.target_value,
          targetUnit: goal.target_unit,
          startDate: goal.start_date,
          endDate: goal.end_date,
          status: goal.status,
          createdAt: goal.created_at,
          updatedAt: goal.updated_at
        }))
      });
    } catch (error) {
      console.error('Get goals error:', error);
      res.status(500).json({ error: 'Failed to fetch goals' });
    }
  }
);

/**
 * @route   GET /api/goals/:id
 * @desc    Get a specific goal by ID
 * @access  Private
 */
router.get('/:id', param('id').isUUID(), validate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      'SELECT * FROM goals WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const goal = result.rows[0];

    res.json({
      goal: {
        id: goal.id,
        category: goal.category,
        title: goal.title,
        description: goal.description,
        targetValue: goal.target_value,
        targetUnit: goal.target_unit,
        startDate: goal.start_date,
        endDate: goal.end_date,
        status: goal.status,
        createdAt: goal.created_at,
        updatedAt: goal.updated_at
      }
    });
  } catch (error) {
    console.error('Get goal error:', error);
    res.status(500).json({ error: 'Failed to fetch goal' });
  }
});

/**
 * @route   POST /api/goals
 * @desc    Create a new goal
 * @access  Private
 */
router.post(
  '/',
  [
    body('category').isIn(['fitness', 'nutrition', 'job_search']).withMessage('Invalid category'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().trim(),
    body('targetValue').optional().isNumeric().withMessage('Target value must be a number'),
    body('targetUnit').optional().trim(),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate').optional().isISO8601().withMessage('End date must be a valid date')
  ],
  validate,
  async (req, res) => {
    const {
      category,
      title,
      description,
      targetValue,
      targetUnit,
      startDate,
      endDate
    } = req.body;
    const userId = req.user.userId;

    try {
      const result = await pool.query(
        `INSERT INTO goals (user_id, category, title, description, target_value, target_unit, start_date, end_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [userId, category, title, description || null, targetValue || null, targetUnit || null, startDate, endDate || null]
      );

      const goal = result.rows[0];

      res.status(201).json({
        message: 'Goal created successfully',
        goal: {
          id: goal.id,
          category: goal.category,
          title: goal.title,
          description: goal.description,
          targetValue: goal.target_value,
          targetUnit: goal.target_unit,
          startDate: goal.start_date,
          endDate: goal.end_date,
          status: goal.status,
          createdAt: goal.created_at,
          updatedAt: goal.updated_at
        }
      });
    } catch (error) {
      console.error('Create goal error:', error);
      res.status(500).json({ error: 'Failed to create goal' });
    }
  }
);

/**
 * @route   PUT /api/goals/:id
 * @desc    Update a goal
 * @access  Private
 */
router.put(
  '/:id',
  [
    param('id').isUUID(),
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('targetValue').optional().isNumeric(),
    body('targetUnit').optional().trim(),
    body('endDate').optional().isISO8601(),
    body('status').optional().isIn(['active', 'completed', 'paused', 'abandoned'])
  ],
  validate,
  async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const updates = req.body;

    try {
      // Check if goal exists and belongs to user
      const checkResult = await pool.query(
        'SELECT id FROM goals WHERE id = $1 AND user_id = $2',
        [id, userId]
      );

      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: 'Goal not found' });
      }

      // Build dynamic update query
      const fields = [];
      const values = [];
      let paramIndex = 1;

      Object.keys(updates).forEach(key => {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${dbKey} = $${paramIndex}`);
        values.push(updates[key]);
        paramIndex++;
      });

      if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      values.push(id);
      values.push(userId);

      const query = `
        UPDATE goals 
        SET ${fields.join(', ')} 
        WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
        RETURNING *
      `;

      const result = await pool.query(query, values);
      const goal = result.rows[0];

      res.json({
        message: 'Goal updated successfully',
        goal: {
          id: goal.id,
          category: goal.category,
          title: goal.title,
          description: goal.description,
          targetValue: goal.target_value,
          targetUnit: goal.target_unit,
          startDate: goal.start_date,
          endDate: goal.end_date,
          status: goal.status,
          createdAt: goal.created_at,
          updatedAt: goal.updated_at
        }
      });
    } catch (error) {
      console.error('Update goal error:', error);
      res.status(500).json({ error: 'Failed to update goal' });
    }
  }
);

/**
 * @route   DELETE /api/goals/:id
 * @desc    Delete a goal
 * @access  Private
 */
router.delete('/:id', param('id').isUUID(), validate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      'DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

module.exports = router;
