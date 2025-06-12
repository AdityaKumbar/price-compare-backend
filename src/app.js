// Entry point for the backend application
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/products'));

// Scrapers routes
app.use('/api/scrapers', require('./routes/scrapers'));

// Default route for root path
app.get('/', (req, res) => {
  res.send('Welcome to the Price Comparison API!');
});

// Test route to verify MongoDB connection
app.get('/api/test', (req, res) => {
  res.send('MongoDB connection is working!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
