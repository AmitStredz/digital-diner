const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Setup connection caching for serverless environment
let cachedConnection = null;

const connectMongoDB = async () => {
  // If we have a cached connection, use it
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const uri = process.env.MONGODB_URI;
    
    // Important: For serverless, set serverApi options and timeouts
    const options = {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      },
      // Set reasonable timeouts for serverless functions
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000
    };

    const connection = await mongoose.connect(uri, options);
    console.log('MongoDB connected successfully');
    
    // Cache connection for reuse in subsequent invocations
    cachedConnection = connection;
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Don't exit the process in serverless - just throw the error
    throw error;
  }
};

module.exports = { connectMongoDB }; 