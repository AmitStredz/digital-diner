const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

// Register new user
const signup = async (req, res) => {
  try {
    const { name, phone_number, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please provide name, email, and password'
      });
    }
    
    // Check if user with email exists
    const existingUser = await User.findOne({
      where: {
        email
      }
    });
    
    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      name,
      phone_number,
      email,
      password: hashedPassword,
      role: 'customer' // Default role
    });
    
    // Generate token
    const token = generateToken(user);
    
    // Return user info (excluding password)
    const userToReturn = { ...user.toJSON() };
    delete userToReturn.password;
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userToReturn,
      token
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      message: 'Error registering user',
      error: error.message
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    // User login with email
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password'
      });
    }
    
    // Check if user exists
    const user = await User.findOne({
      where: {
        email
      }
    });
    
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }
    
    // Check if user has password
    if (!user.password) {
      return res.status(401).json({
        message: 'Account does not have a password set'
      });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Return user info (excluding password)
    const userToReturn = { ...user.toJSON() };
    delete userToReturn.password;
    
    res.status(200).json({
      message: 'Login successful',
      user: userToReturn,
      token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: error,
      error: error.message
    });
  }
};

module.exports = {
  signup,
  login
}; 