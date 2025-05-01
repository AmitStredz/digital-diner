const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgres');
const Order = require('./order');

const OrderItem = sequelize.define('OrderItem', {
  order_item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'order_id'
    }
  },
  menu_item_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  price_at_time: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  special_instructions: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'order_items'
});

// Define the relationship
OrderItem.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order'
});

Order.hasMany(OrderItem, {
  foreignKey: 'order_id',
  as: 'order_items'
});

// SQL to create the table (for reference)
/*
CREATE TABLE order_items (
  order_item_id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(order_id),
  menu_item_id VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_time DECIMAL(10, 2) NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/

module.exports = OrderItem; 