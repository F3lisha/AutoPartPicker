const express = require('express');
const router = express.Router({ mergeParams: true });
const { param, validationResult } = require('express-validator');

// Get all photos for a listing
router.get('/:listingId/photos', [
  param('listingId').isInt({ min: 1 })
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { data, error } = await req.supabase
      .from('listing_photos')
      .select('*')
      .eq('listing_id', req.params.listingId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Add a photo to a listing
router.post('/:listingId/photos', [
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

    // Insert the photo
    const { data, error } = await req.supabase
      .from('listing_photos')
      .insert([{
        listing_id: req.params.listingId,
        photo_url: req.body.photoUrl,
        is_primary: req.body.isPrimary || false,
        caption: req.body.caption
      }])
      .select();
    
    if (error) throw error;
    
    // If this is the first photo, set it as primary
    if (req.body.isPrimary) {
      await req.supabase
        .from('listing_photos')
        .update({ is_primary: false })
        .eq('listing_id', req.params.listingId)
        .neq('photo_id', data[0].photo_id);
    }
    
    res.status(201).json(data[0]);
  } catch (err) {
    next(err);
  }
});

// Delete a photo
router.delete('/:photoId', [
  param('photoId').isInt({ min: 1 })
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // First get the photo to check if it exists and get its listing ID
    const { data: photo, error: photoError } = await req.supabase
      .from('listing_photos')
      .select('photo_id, listing_id, is_primary')
      .eq('photo_id', req.params.photoId)
      .single();
    
    if (photoError || !photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Delete the photo
    const { error } = await req.supabase
      .from('listing_photos')
      .delete()
      .eq('photo_id', req.params.photoId);
    
    if (error) throw error;

    // If the deleted photo was primary, set another photo as primary if available
    if (photo.is_primary) {
      const { data: otherPhotos, error: otherPhotosError } = await req.supabase
        .from('listing_photos')
        .select('photo_id')
        .eq('listing_id', photo.listing_id)
        .limit(1);
      
      if (!otherPhotosError && otherPhotos.length > 0) {
        await req.supabase
          .from('listing_photos')
          .update({ is_primary: true })
          .eq('photo_id', otherPhotos[0].photo_id);
      }
    }
    
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Set a photo as primary
router.post('/:photoId/set-primary', [
  param('photoId').isInt({ min: 1 })
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // First get the photo to check if it exists and get its listing ID
    const { data: photo, error: photoError } = await req.supabase
      .from('listing_photos')
      .select('photo_id, listing_id')
      .eq('photo_id', req.params.photoId)
      .single();
    
    if (photoError || !photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Start a transaction to update the primary photo
    const { data, error } = await req.supabase.rpc('set_primary_photo', {
      p_photo_id: req.params.photoId,
      p_listing_id: photo.listing_id
    });
    
    if (error) throw error;
    
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
