const express = require('express');
const { body, param, query } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

/**
 * @route   GET /api/progress
 * @desc    Get all progress entries for a specific goal
 * @access  Private
 */
router.get(
  '/',
  [
    query('goalId').notEmpty().isUUID().withMessage('Valid goal ID is required'),
    query('startDate').optional().isISO8601().withMessage('Start date must be valid'),
    query('endDate').optional().isISO8601().withMessage('End date must be valid')
  ],
  validate,
  async (req, res) => {
    const { goalId, startDate, endDate } = req.query;
    const userId = req.user.userId;

    try {
      // Verify goal belongs to user
      const goalCheck = await pool.query(
        'SELECT id FROM goals WHERE id = $1 AND user_id = $2',
        [goalId, userId]
      );

      if (goalCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Goal not found' });
      }

      // Build query
      let query = 'SELECT * FROM progress_entries WHERE goal_id = $1';
      const params = [goalId];
      let paramIndex = 2;

      if (startDate) {
        query += ` AND entry_date >= $${paramIndex}`;
        params.push(startDate);
        paramIndex++;
      }

      if (endDate) {
        query += ` AND entry_date <= $${paramIndex}`;
        params.push(endDate);
        paramIndex++;
      }

      query += ' ORDER BY entry_date DESC';

      const result = await pool.query(query, params);

      res.json({
        entries: result.rows.map(entry => ({
          id: entry.id,
          goalId: entry.goal_id,
          entryDate: entry.entry_date,
          value: entry.value,
          unit: entry.unit,
          notes: entry.notes,
          createdAt: entry.created_at,
          updatedAt: entry.updated_at
        }))
      });
    } catch (error) {
      console.error('Get progress entries error:', error);
      res.status(500).json({ error: 'Failed to fetch progress entries' });
    }
  }
);

/**
 * @route   GET /api/progress/:id
 * @desc    Get a specific progress entry by ID
 * @access  Private
 */
router.get('/:id', param('id').isUUID(), validate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT pe.* FROM progress_entries pe
       JOIN goals g ON pe.goal_id = g.id
       WHERE pe.id = $1 AND g.user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Progress entry not found' });
    }

    const entry = result.rows[0];

    res.json({
      entry: {
        id: entry.id,
        goalId: entry.goal_id,
        entryDate: entry.entry_date,
        value: entry.value,
        unit: entry.unit,
        notes: entry.notes,
        createdAt: entry.created_at,
        updatedAt: entry.updated_at
      }
    });
  } catch (error) {
    console.error('Get progress entry error:', error);
    res.status(500).json({ error: 'Failed to fetch progress entry' });
  }
});

/**
 * @route   POST /api/progress
 * @desc    Create a new progress entry
 * @access  Private
 */
router.post(
  '/',
  [
    body('goalId').isUUID().withMessage('Valid goal ID is required'),
    body('entryDate').isISO8601().withMessage('Valid entry date is required'),
    body('value').isNumeric().withMessage('Value must be a number'),
    body('unit').optional().trim(),
    body('notes').optional().trim()
  ],
  validate,
  async (req, res) => {
    const { goalId, entryDate, value, unit, notes } = req.body;
    const userId = req.user.userId;

    try {
      // Verify goal belongs to user
      const goalCheck = await pool.query(
        'SELECT id FROM goals WHERE id = $1 AND user_id = $2',
        [goalId, userId]
      );

      if (goalCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Goal not found' });
      }

      // Check for duplicate entry on same date
      const duplicateCheck = await pool.query(
        'SELECT id FROM progress_entries WHERE goal_id = $1 AND entry_date = $2',
        [goalId, entryDate]
      );

      if (duplicateCheck.rows.length > 0) {
        return res.status(400).json({ 
          error: 'Progress entry already exists for this date. Use PUT to update.' 
        });
      }

      // Insert new progress entry
      const result = await pool.query(
        `INSERT INTO progress_entries (goal_id, entry_date, value, unit, notes)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [goalId, entryDate, value, unit || null, notes || null]
      );

      const entry = result.rows[0];

      res.status(201).json({
        message: 'Progress entry created successfully',
        entry: {
          id: entry.id,
          goalId: entry.goal_id,
          entryDate: entry.entry_date,
          value: entry.value,
          unit: entry.unit,
          notes: entry.notes,
          createdAt: entry.created_at,
          updatedAt: entry.updated_at
        }
      });
    } catch (error) {
      console.error('Create progress entry error:', error);
      res.status(500).json({ error: 'Failed to create progress entry' });
    }
  }
);

/**
 * @route   PUT /api/progress/:id
 * @desc    Update a progress entry
 * @access  Private
 */
router.put(
  '/:id',
  [
    param('id').isUUID(),
    body('value').optional().isNumeric(),
    body('unit').optional().trim(),
    body('notes').optional().trim()
  ],
  validate,
  async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const updates = req.body;

    try {
      // Check if entry exists and belongs to user's goal
      const checkResult = await pool.query(
        `SELECT pe.id FROM progress_entries pe
         JOIN goals g ON pe.goal_id = g.id
         WHERE pe.id = $1 AND g.user_id = $2`,
        [id, userId]
      );

      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: 'Progress entry not found' });
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

      const query = `
        UPDATE progress_entries 
        SET ${fields.join(', ')} 
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await pool.query(query, values);
      const entry = result.rows[0];

      res.json({
        message: 'Progress entry updated successfully',
        entry: {
          id: entry.id,
          goalId: entry.goal_id,
          entryDate: entry.entry_date,
          value: entry.value,
          unit: entry.unit,
          notes: entry.notes,
          createdAt: entry.created_at,
          updatedAt: entry.updated_at
        }
      });
    } catch (error) {
      console.error('Update progress entry error:', error);
      res.status(500).json({ error: 'Failed to update progress entry' });
    }
  }
);

/**
 * @route   DELETE /api/progress/:id
 * @desc    Delete a progress entry
 * @access  Private
 */
router.delete('/:id', param('id').isUUID(), validate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `DELETE FROM progress_entries pe
       USING goals g
       WHERE pe.id = $1 AND pe.goal_id = g.id AND g.user_id = $2
       RETURNING pe.id`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Progress entry not found' });
    }

    res.json({ message: 'Progress entry deleted successfully' });
  } catch (error) {
    console.error('Delete progress entry error:', error);
    res.status(500).json({ error: 'Failed to delete progress entry' });
  }
});

module.exports = router;
