require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Import routes
const userProfilesRouter = require('./routes/userProfiles');
const vehiclesRouter = require('./routes/vehicles');
const listingsRouter = require('./routes/listings');
const listingPhotosRouter = require('./routes/listingPhotos');
const vehicleConditionsRouter = require('./routes/vehicleConditions');
const priceHistoryRouter = require('./routes/priceHistory');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required environment variables: SUPABASE_URL and SUPABASE_ANON_KEY must be set');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Make supabase client available in all routes
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/user-profiles', userProfilesRouter);
app.use('/vehicles', vehiclesRouter);
app.use('/listings', listingsRouter);
app.use('/listings', listingPhotosRouter); // Nested under /listings/:listingId/photos
app.use('/listings', vehicleConditionsRouter); // Nested under /listings/:listingId/condition
app.use('/listings', priceHistoryRouter); // Nested under /listings/:listingId/price-history
app.use('/listing-photos', listingPhotosRouter); // For direct photo access

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
