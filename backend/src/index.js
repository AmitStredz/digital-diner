const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

// Import database connections
const { connectMongoDB } = require('./config/mongodb');
const { connectPostgres } = require('./config/postgres');

// Initialize app
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

// Health check route - always works even if DB fails
app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy');
});

// Setup database connection middleware for serverless
const withDatabase = async (req, res, next) => {
  try {
    // Only connect if we haven't already
    if (process.env.NODE_ENV === 'production') {
      await connectMongoDB();
      await connectPostgres();
    }
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
};

// Apply database middleware to all API routes
app.use('/api', withDatabase);

// Connect to databases in development
if (process.env.NODE_ENV !== 'production') {
  connectMongoDB().catch(console.error);
  connectPostgres().catch(console.error);
}

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Digital Diner API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Server error', 
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack 
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 50001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for serverless use
module.exports = app; 