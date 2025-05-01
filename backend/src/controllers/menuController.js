const { MenuItem, Category } = require('../models');

// Get all menu items
const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ available: true });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items', error: error.message });
  }
};

// Get menu items by category
const getMenuItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const menuItems = await MenuItem.find({ category, available: true });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items by category', error: error.message });
  }
};

// Get a single menu item by ID
const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await MenuItem.findById(id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.status(200).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu item', error: error.message });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ display_order: 1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// [ADMIN] Create a new menu item
const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image_url, ingredients, dietary_info } = req.body;
    
    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Name, description, price, and category are required' });
    }
    
    // Create new menu item
    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      image_url: image_url || null,
      ingredients: ingredients || [],
      dietary_info: dietary_info || [],
      available: true
    });
    
    const savedMenuItem = await menuItem.save();
    res.status(201).json(savedMenuItem);
  } catch (error) {
    res.status(500).json({ message: 'Error creating menu item', error: error.message });
  }
};

// [ADMIN] Update a menu item
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Find menu item
    const menuItem = await MenuItem.findById(id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Update fields
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedMenuItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu item', error: error.message });
  }
};

// [ADMIN] Delete a menu item
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find menu item
    const menuItem = await MenuItem.findById(id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Delete menu item
    await MenuItem.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu item', error: error.message });
  }
};

// [ADMIN] Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, display_order } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    // Create new category
    const category = new Category({
      name,
      display_order: display_order || 0
    });
    
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

// [ADMIN] Update a category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Find category
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Update fields
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

// [ADMIN] Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find category
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if any menu items use this category
    const menuItemsCount = await MenuItem.countDocuments({ category: category.name });
    
    if (menuItemsCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category that is being used by menu items',
        itemsCount: menuItemsCount
      });
    }
    
    // Delete category
    await Category.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};

module.exports = {
  getAllMenuItems,
  getMenuItemsByCategory,
  getMenuItemById,
  getAllCategories,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  createCategory,
  updateCategory,
  deleteCategory
}; 