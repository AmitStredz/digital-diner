const { User, Order, OrderItem, MenuItem } = require('../models');
const { sequelize } = require('../config/postgres');
const moment = require('moment');

// Format order data with properly formatted dates
const formatOrderData = (order) => {
  const orderData = typeof order.toJSON === 'function' ? order.toJSON() : order;
  
  // Format the created_at date using moment
  if (orderData.created_at) {
    orderData.created_at = moment(orderData.created_at).format();
  }
  
  return orderData;
};

// Create a new order
const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { name, phone_number, email, items, total_price } = req.body;
    
    if (!name || !email || !items || !total_price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Find or create user
    let user = await User.findOne({ where: { email } });
    
    if (!user) {
      user = await User.create({ name, phone_number, email, password: null }, { transaction });
    }
    
    // Create the order
    const order = await Order.create({
      user_id: user.user_id,
      total_price,
      status: 'pending'
    }, { transaction });
    
    // Validate menu items and create order items
    const orderItems = [];
    
    for (const item of items) {
      // Verify menu item exists
      const menuItem = await MenuItem.findById(item.menu_item_id);
      
      if (!menuItem) {
        await transaction.rollback();
        return res.status(404).json({ message: `Menu item with ID ${item.menu_item_id} not found` });
      }
      
      // Create order item
      const orderItem = await OrderItem.create({
        order_id: order.order_id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price_at_time: menuItem.price,
        special_instructions: item.special_instructions
      }, { transaction });
      
      orderItems.push(orderItem);
    }
    
    await transaction.commit();
    
    res.status(201).json({
      message: 'Order created successfully',
      order_id: order.order_id,
      order_items: orderItems
    });
    
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Get orders by phone number
const getOrdersByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
    
    // Find user by phone number
    const user = await User.findOne({ where: { phone_number: phone } });
    
    if (!user) {
      return res.status(404).json({ message: 'No orders found for this phone number' });
    }
    
    // Get all orders for the user
    const orders = await Order.findAll({
      where: { user_id: user.user_id },
      include: [{
        model: OrderItem,
        as: 'order_items'
      }],
      order: [['created_at', 'DESC']]
    });
    
    // Fetch menu item details for each order item
    const ordersWithDetails = await Promise.all(orders.map(async (order) => {
      const orderData = formatOrderData(order);
      
      const orderItemsWithDetails = await Promise.all(orderData.order_items.map(async (item) => {
        const menuItem = await MenuItem.findById(item.menu_item_id);
        return {
          ...item,
          menu_item: menuItem ? {
            name: menuItem.name,
            description: menuItem.description,
            category: menuItem.category
          } : null
        };
      }));
      
      return {
        ...orderData,
        order_items: orderItemsWithDetails
      };
    }));
    
    res.status(200).json(ordersWithDetails);
    
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get orders by email
const getOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: 'No orders found for this email' });
    }
    
    // Get all orders for the user
    const orders = await Order.findAll({
      where: { user_id: user.user_id },
      include: [{
        model: OrderItem,
        as: 'order_items'
      }],
      order: [['created_at', 'DESC']]
    });
    
    // Fetch menu item details for each order item
    const ordersWithDetails = await Promise.all(orders.map(async (order) => {
      const orderData = formatOrderData(order);
      
      const orderItemsWithDetails = await Promise.all(orderData.order_items.map(async (item) => {
        const menuItem = await MenuItem.findById(item.menu_item_id);
        return {
          ...item,
          menu_item: menuItem ? {
            name: menuItem.name,
            description: menuItem.description,
            category: menuItem.category
          } : null
        };
      }));
      
      return {
        ...orderData,
        order_items: orderItemsWithDetails
      };
    }));
    
    res.status(200).json(ordersWithDetails);
    
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findByPk(id, {
      include: [{
        model: OrderItem,
        as: 'order_items'
      }, {
        model: User,
        as: 'user'
      }]
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Format order data with proper dates
    const orderData = formatOrderData(order);
    
    // Fetch menu item details for each order item
    const orderItemsWithDetails = await Promise.all(orderData.order_items.map(async (item) => {
      const menuItem = await MenuItem.findById(item.menu_item_id);
      return {
        ...item,
        menu_item: menuItem ? {
          name: menuItem.name,
          description: menuItem.description,
          category: menuItem.category
        } : null
      };
    }));
    
    const result = {
      ...orderData,
      order_items: orderItemsWithDetails
    };
    
    res.status(200).json(result);
    
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrdersByPhone,
  getOrdersByEmail,
  getOrderById
}; 