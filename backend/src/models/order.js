const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgres');
// Only try to import User if we're not using the mock connection
let User;
try {
  User = require('./user');
} catch (error) {
  console.error('Error importing User model:', error.message);
}

// Check if we're using the mock sequelize in production
const isMockSequelize = process.env.NODE_ENV === 'production' && 
                        (!sequelize.authenticate || 
                         typeof sequelize.authenticate !== 'function' ||
                         sequelize.authenticate.toString().includes('skipped'));

let Order;

// Define model differently based on environment
if (isMockSequelize) {
  console.log('Using mock Order model for Vercel deployment');
  // Create a simplified mock Order model for Vercel
  Order = {
    findAll: async () => [],
    findOne: async () => null,
    findByPk: async () => null,
    create: async (data) => ({ 
      order_id: Math.floor(Math.random() * 1000),
      ...data, 
      createdAt: new Date() 
    }),
    update: async () => [0],
    destroy: async () => 0,
    // Mock relationships
    belongsTo: () => {},
    hasMany: () => {},
  };
} else {
  // Normal model definition for local/non-Vercel environments
  Order = sequelize.define('Order', {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },
    pickup_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'orders'
  });

  // Only define relationships if User model exists
  if (User) {
    // Define the relationship
    Order.belongsTo(User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    User.hasMany(Order, {
      foreignKey: 'user_id',
      as: 'orders'
    });
  }
}

// SQL to create the table (for reference)
/*
CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id),
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  pickup_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/

module.exports = Order; 