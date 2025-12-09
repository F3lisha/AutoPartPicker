const express = require('express');
const router = express.Router({ mergeParams: true });
const { param, validationResult } = require('express-validator');

// Get vehicle condition for a listing
router.get('/:listingId/condition', [
  param('listingId').isInt({ min: 1 })
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { data, error } = await req.supabase
      .from('vehicle_conditions')
      .select('*')
      .eq('listing_id', req.params.listingId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows returned"
    
    if (!data) {
      return res.status(404).json({ error: 'Vehicle condition not found for this listing' });
    }
    
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Create or update vehicle condition
router.put('/:listingId/condition', [
  param('listingId').isInt({ min: 1 })
  // Add validation middleware here
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if listing exists
    const { data: listing, error: listingError } = await req.supabase
      .from('listings')
      .select('listing_id')
      .eq('listing_id', req.params.listingId)
      .single();
    
    if (listingError || !listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Check if condition already exists
    const { data: existingCondition } = await req.supabase
      .from('vehicle_conditions')
      .select('condition_id')
      .eq('listing_id', req.params.listingId)
      .single();

    let result;
    if (existingCondition) {
      // Update existing condition
      const { data, error } = await req.supabase
        .from('vehicle_conditions')
        .update({
          condition_level: req.body.conditionLevel,
          mileage: req.body.mileage,
          accident_history: req.body.accidentHistory,
          service_history: req.body.serviceHistory,
          exterior_condition: req.body.exteriorCondition,
          interior_condition: req.body.interiorCondition,
          mechanical_condition: req.body.mechanicalCondition,
          title_status: req.body.titleStatus,
          notes: req.body.notes
        })
        .eq('condition_id', existingCondition.condition_id)
        .select();
      
      if (error) throw error;
      result = data[0];
    } else {
      // Create new condition
      const { data, error } = await req.supabase
        .from('vehicle_conditions')
        .insert([{
          listing_id: req.params.listingId,
          condition_level: req.body.conditionLevel,
          mileage: req.body.mileage,
          accident_history: req.body.accidentHistory,
          service_history: req.body.serviceHistory,
          exterior_condition: req.body.exteriorCondition,
          interior_condition: req.body.interiorCondition,
          mechanical_condition: req.body.mechanicalCondition,
          title_status: req.body.titleStatus,
          notes: req.body.notes
        }])
        .select();
      
      if (error) throw error;
      result = data[0];
    }
    
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
