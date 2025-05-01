const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectMongoDB = async () => {
  try {
    // Make sure to replace <db_username> and <db_password> with actual values
    const uri = process.env.MONGODB_URI;
    console.log("mongo URI: ", uri);
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = { connectMongoDB }; 