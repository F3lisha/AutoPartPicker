const express = require('express');
const router = express.Router();
const { query, param, validationResult } = require('express-validator');

// Get all user profiles
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from('user_profiles')
      .select('*');
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Get a specific user profile
router.get('/:userId', [
  param('userId').isUUID()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { data, error } = await req.supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', req.params.userId)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'User profile not found' });
    
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Create a new user profile
router.post('/', [
  // Add validation middleware here
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { data, error } = await req.supabase
      .from('user_profiles')
      .insert([{
        user_id: req.body.userId,
        display_name: req.body.displayName,
        role: req.body.role,
        star_rating: req.body.starRating
      }])
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (err) {
    next(err);
  }
});

// Update a user profile
router.patch('/:userId', [
  param('userId').isUUID()
  // Add validation middleware here
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updates = {};
    if (req.body.displayName) updates.display_name = req.body.displayName;
    if (req.body.role) updates.role = req.body.role;
    if (req.body.starRating) updates.star_rating = req.body.starRating;

    const { data, error } = await req.supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', req.params.userId)
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    
    res.json(data[0]);
  } catch (err) {
    next(err);
  }
});

// Delete a user profile
router.delete('/:userId', [
  param('userId').isUUID()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { error } = await req.supabase
      .from('user_profiles')
      .delete()
      .eq('user_id', req.params.userId);
    
    if (error) throw error;
    
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
