const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgres');

// Check if we're using the mock sequelize in production
const isMockSequelize = process.env.NODE_ENV === 'production' && 
                        (!sequelize.authenticate || 
                         typeof sequelize.authenticate !== 'function' ||
                         sequelize.authenticate.toString().includes('skipped'));

let User;

// Define model differently based on environment
if (isMockSequelize) {
  console.log('Using mock User model for Vercel deployment');
  // Create a simplified mock User model for Vercel
  User = {
    findAll: async () => [],
    findOne: async () => null,
    findByPk: async () => null,
    create: async (data) => ({ 
      user_id: Math.floor(Math.random() * 1000),
      ...data, 
      createdAt: new Date() 
    }),
    update: async () => [0],
    destroy: async () => 0,
    // Mock relationships
    hasMany: () => {},
    belongsTo: () => {},
  };
} else {
  // Normal model definition for local/non-Vercel environments
  User = sequelize.define('User', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'customer',
      validate: {
        isIn: [['customer', 'admin']]
      }
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'users'
  });
}

// SQL to create the table (for reference)
/*
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/

module.exports = User; 