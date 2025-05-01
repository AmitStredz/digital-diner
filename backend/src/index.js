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
const PORT = process.env.PORT || 50001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to databases
connectMongoDB();
connectPostgres();

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Digital Diner API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 