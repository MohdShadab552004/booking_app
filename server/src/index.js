const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Routes
const experienceRoutes = require('./routes/experience.routes');
const bookingRoutes = require('./routes/booking.routes');
const { connectDB } = require('./config/db.config');

// Load env vars
dotenv.config();

// Init express
const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routes
app.use('/api/experiences', experienceRoutes);
app.use('/api/bookings', bookingRoutes);

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// Connect to MongoDB
connectDB()

// Start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

// For testing
module.exports = app;