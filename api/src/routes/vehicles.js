const express = require('express');
const router = express.Router();
const { query, param, validationResult } = require('express-validator');

// Get all vehicles with optional filtering
router.get('/', [
  query('make').optional().isString().trim(),
  query('model').optional().isString().trim(),
  query('year').optional().isInt({ min: 1900, max: new Date().getFullYear() + 1 })
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let query = req.supabase
      .from('vehicles')
      .select('*');

    // Apply filters if provided
    if (req.query.make) {
      query = query.ilike('make', `%${req.query.make}%`);
    }
    if (req.query.model) {
      query = query.ilike('model', `%${req.query.model}%`);
    }
    if (req.query.year) {
      query = query.eq('year', parseInt(req.query.year));
    }

    const { data, error } = await query;
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Get a specific vehicle by ID
router.get('/:vehicleId', [
  param('vehicleId').isInt({ min: 1 })
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { data, error } = await req.supabase
      .from('vehicles')
      .select('*')
      .eq('vehicle_id', req.params.vehicleId)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Vehicle not found' });
    
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Create a new vehicle
router.post('/', [
  // Add validation middleware here
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { data, error } = await req.supabase
      .from('vehicles')
      .insert([{
        vin: req.body.vin,
        license_plate: req.body.licensePlate,
        year: req.body.year,
        make: req.body.make,
        model: req.body.model,
        engine: req.body.engine,
        // Add other fields as needed
      }])
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (err) {
    next(err);
  }
});

// Update a vehicle
router.patch('/:vehicleId', [
  param('vehicleId').isInt({ min: 1 })
  // Add validation middleware here
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updates = {};
    if (req.body.vin) updates.vin = req.body.vin;
    if (req.body.licensePlate) updates.license_plate = req.body.licensePlate;
    if (req.body.year) updates.year = req.body.year;
    if (req.body.make) updates.make = req.body.make;
    if (req.body.model) updates.model = req.body.model;
    if (req.body.engine) updates.engine = req.body.engine;

    const { data, error } = await req.supabase
      .from('vehicles')
      .update(updates)
      .eq('vehicle_id', req.params.vehicleId)
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    res.json(data[0]);
  } catch (err) {
    next(err);
  }
});

// Delete a vehicle
router.delete('/:vehicleId', [
  param('vehicleId').isInt({ min: 1 })
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // First check if the vehicle exists
    const { data: vehicle, error: checkError } = await req.supabase
      .from('vehicles')
      .select('vehicle_id')
      .eq('vehicle_id', req.params.vehicleId)
      .single();
    
    if (checkError || !vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Delete the vehicle
    const { error } = await req.supabase
      .from('vehicles')
      .delete()
      .eq('vehicle_id', req.params.vehicleId);
    
    if (error) throw error;
    
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
