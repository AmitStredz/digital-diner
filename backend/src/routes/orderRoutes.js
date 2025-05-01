const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create a new order
router.post('/', orderController.createOrder);

// Get orders by email
router.get('/email/:email', orderController.getOrdersByEmail);

// Get order by ID
router.get('/:id', orderController.getOrderById);

module.exports = router; 