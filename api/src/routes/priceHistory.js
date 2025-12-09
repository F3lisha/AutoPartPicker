const express = require('express');
const router = express.Router({ mergeParams: true });
const { param, query, validationResult } = require('express-validator');

// Get price history for a listing
router.get('/:listingId/price-history', [
  param('listingId').isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('order').optional().isIn(['asc', 'desc'])
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

    let query = req.supabase
      .from('price_history')
      .select('*')
      .eq('listing_id', req.params.listingId);
    
    // Apply sorting
    const order = req.query.order === 'asc' ? 'asc' : 'desc';
    query = query.order('changed_at', { ascending: order === 'asc' });
    
    // Apply limit if provided
    if (req.query.limit) {
      query = query.limit(parseInt(req.query.limit));
    }

    const { data, error } = await query;
    
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Add a price history entry
router.post('/:listingId/price-history', [
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

    // Get current price from listings table
    const { data: currentListing, error: currentError } = await req.supabase
      .from('listings')
      .select('price, status')
      .eq('listing_id', req.params.listingId)
      .single();
    
    if (currentError) throw currentError;
    
    // Only add a new price history entry if the price has changed
    if (currentListing.price !== req.body.price || currentListing.status !== req.body.status) {
      // Update the listing's current price and status
      const { error: updateError } = await req.supabase
        .from('listings')
        .update({
          price: req.body.price,
          status: req.body.status || currentListing.status
        })
        .eq('listing_id', req.params.listingId);
      
      if (updateError) throw updateError;
      
      // Add the new price history entry
      const { data, error } = await req.supabase
        .from('price_history')
        .insert([{
          listing_id: req.params.listingId,
          price: req.body.price,
          status: req.body.status || currentListing.status,
          changed_by: req.body.changedBy || 'system',
          change_reason: req.body.changeReason || 'Price update'
        }])
        .select();
      
      if (error) throw error;
      
      res.status(201).json(data[0]);
    } else {
      // No change in price or status, return the most recent history entry
      const { data: latestEntry } = await req.supabase
        .from('price_history')
        .select('*')
        .eq('listing_id', req.params.listingId)
        .order('changed_at', { ascending: false })
        .limit(1)
        .single();
      
      if (latestEntry) {
        res.json(latestEntry);
      } else {
        // No history exists yet, create the first entry
        const { data, error } = await req.supabase
          .from('price_history')
          .insert([{
            listing_id: req.params.listingId,
            price: req.body.price,
            status: req.body.status || currentListing.status,
            changed_by: req.body.changedBy || 'system',
            change_reason: req.body.changeReason || 'Initial price'
          }])
          .select();
        
        if (error) throw error;
        
        res.status(201).json(data[0]);
      }
    }
  } catch (err) {
    next(err);
  }
});

// Get price statistics for a listing
router.get('/:listingId/price-stats', [
  param('listingId').isInt({ min: 1 })
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if listing exists
    const { data: listing, error: listingError } = await req.supabase
      .from('listings')
      .select('listing_id, price')
      .eq('listing_id', req.params.listingId)
      .single();
    
    if (listingError || !listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Get price history
    const { data: history, error: historyError } = await req.supabase
      .from('price_history')
      .select('price, changed_at')
      .eq('listing_id', req.params.listingId)
      .order('changed_at', { ascending: false });
    
    if (historyError) throw historyError;

    // Calculate statistics
    const stats = {
      currentPrice: listing.price,
      priceChanges: history.length,
      priceHistory: history,
      priceChange: history.length > 1 
        ? listing.price - history[history.length - 1].price 
        : 0,
      priceChangePercentage: history.length > 1 
        ? ((listing.price - history[history.length - 1].price) / history[history.length - 1].price) * 100 
        : 0,
      daysListed: history.length > 0 
        ? Math.ceil((new Date() - new Date(history[0].changed_at)) / (1000 * 60 * 60 * 24))
        : 0
    };
    
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
