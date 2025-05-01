const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Get all menu items
router.get('/', menuController.getAllMenuItems);

// Get all categories
router.get('/categories', menuController.getAllCategories);

// Get menu items by category
router.get('/category/:category', menuController.getMenuItemsByCategory);

// Get a single menu item by ID
router.get('/:id', menuController.getMenuItemById);

// Admin routes
router.post('/', menuController.createMenuItem);
router.put('/:id', menuController.updateMenuItem);
router.delete('/:id', menuController.deleteMenuItem);

// Admin category routes
router.post('/categories', menuController.createCategory);
router.put('/categories/:id', menuController.updateCategory);
router.delete('/categories/:id', menuController.deleteCategory);

module.exports = router; 