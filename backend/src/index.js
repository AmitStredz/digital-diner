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

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Digital Diner API is running');
});

// Database connection status
let isMongoConnected = false;
let isPostgresConnected = false;

// Setup database connection middleware for serverless
const withDatabase = async (req, res, next) => {
  try {
    // Skip if already connected
    if (!isMongoConnected) {
      await connectMongoDB().catch(err => {
        console.error("MongoDB connection error in middleware:", err.message);
        throw err;
      });
      isMongoConnected = true;
    }
    
    if (!isPostgresConnected && process.env.NODE_ENV !== 'production') {
      // Only try to connect to Postgres in non-production environments
      // In production, we have a fallback in place
      await connectPostgres().catch(err => {
        console.error("PostgreSQL connection error in middleware:", err.message);
        throw err;
      });
      isPostgresConnected = true;
    }
    
    next();
  } catch (error) {
    console.error('Database middleware error:', error.message);
    // In production, try to continue even if DB connection fails
    if (process.env.NODE_ENV === 'production') {
      console.warn('WARNING: Continuing despite database connection failure');
      next();
    } else {
      res.status(500).json({ error: 'Database connection failed', details: error.message });
    }
  }
};

// Apply database middleware to all API routes
app.use('/api', withDatabase);

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

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