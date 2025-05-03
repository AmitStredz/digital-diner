const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Setup connection caching for serverless environment
let cachedConnection = null;

const connectMongoDB = async () => {
  // If we have a cached connection and it's connected, use it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('Using existing MongoDB connection');
    return cachedConnection;
  }

  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    // Important: For serverless, set serverApi options and timeouts
    const options = {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      },
      // Set reasonable timeouts for serverless functions
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      // These help with connection in serverless environments
      maxPoolSize: 10,
      minPoolSize: 0,
      maxIdleTimeMS: 10000,
      serverSelectionTimeoutMS: 10000,
      family: 4 // Use IPv4, skip trying IPv6
    };

    // Close previous connection if exists
    if (mongoose.connection.readyState !== 0) {
      console.log('Closing previous MongoDB connection');
      await mongoose.disconnect();
    }

    // Connect with new options
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