const express = require('express');
const router = express.Router({ mergeParams: true });
const { query, param, validationResult } = require('express-validator');

// Get all listings with optional filtering
router.get('/', [
  query('status').optional().isString().trim(),
  query('source').optional().isIn(['dealer', 'private'])
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let query = req.supabase
      .from('listings')
      .select(`
        *,
        vehicles (*)
      `);

    // Apply filters if provided
    if (req.query.status) {
      query = query.eq('status', req.query.status);
    }
    if (req.query.source) {
      query = query.eq('source', req.query.source);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Get a specific listing by ID with vehicle info
router.get('/:listingId', [
  param('listingId').isInt({ min: 1 })
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { data, error } = await req.supabase
      .from('listings')
      .select(`
        *,
        vehicles (*)
      `)
      .eq('listing_id', req.params.listingId)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Listing not found' });
    
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Create a new listing
router.post('/', [
  // Add validation middleware here
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Start a transaction
    const { data, error } = await req.supabase.rpc('create_listing_with_vehicle', {
      p_vehicle_data: {
        vin: req.body.vin,
        license_plate: req.body.licensePlate,
        year: req.body.year,
        make: req.body.make,
        model: req.body.model,
        engine: req.body.engine
      },
      p_listing_data: {
        seller_id: req.body.sellerId,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        status: req.body.status || 'active',
        source: req.body.source
      }
    });

    if (error) throw error;
    
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

// Update a listing
router.patch('/:listingId', [
  param('listingId').isInt({ min: 1 })
  // Add validation middleware here
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updates = {};
    if (req.body.title) updates.title = req.body.title;
    if (req.body.description) updates.description = req.body.description;
    if (req.body.price) updates.price = req.body.price;
    if (req.body.status) updates.status = req.body.status;
    if (req.body.source) updates.source = req.body.source;

    const { data, error } = await req.supabase
      .from('listings')
      .update(updates)
      .eq('listing_id', req.params.listingId)
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    res.json(data[0]);
  } catch (err) {
    next(err);
  }
});

// Delete a listing
router.delete('/:listingId', [
  param('listingId').isInt({ min: 1 })
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // First check if the listing exists
    const { data: listing, error: checkError } = await req.supabase
      .from('listings')
      .select('listing_id')
      .eq('listing_id', req.params.listingId)
      .single();
    
    if (checkError || !listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Delete the listing
    const { error } = await req.supabase
      .from('listings')
      .delete()
      .eq('listing_id', req.params.listingId);
    
    if (error) throw error;
    
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
