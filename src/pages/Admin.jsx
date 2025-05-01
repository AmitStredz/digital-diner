import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getMenuItems, 
  getCategories, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  createCategory
} from '../utils/api';
import Button from '../components/Button';
import Input from '../components/Input';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [activeTab, setActiveTab] = useState('items');
  
  // Menu Item form state
  const [menuItemForm, setMenuItemForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    ingredients: '',
    dietary_info: ''
  });
  
  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    display_order: ''
  });
  
  // Selected item for editing
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Fetch menu items and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [menuItemsData, categoriesData] = await Promise.all([
          getMenuItems(),
          getCategories()
        ]);
        
        setMenuItems(menuItemsData);
        setCategories(categoriesData);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please refresh and try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Check if user is admin
  useEffect(() => {
    if (user && !isAdmin()) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);
  
  // Handle menu item form change
  const handleMenuItemChange = (e) => {
    const { name, value } = e.target;
    setMenuItemForm({ ...menuItemForm, [name]: value });
  };
  
  // Handle category form change
  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm({ ...categoryForm, [name]: value });
  };
  
  // Submit menu item form
  const handleMenuItemSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      setLoading(true);
      
      // Convert comma-separated strings to arrays
      const formData = {
        ...menuItemForm,
        price: parseFloat(menuItemForm.price),
        ingredients: menuItemForm.ingredients ? menuItemForm.ingredients.split(',').map(item => item.trim()) : [],
        dietary_info: menuItemForm.dietary_info ? menuItemForm.dietary_info.split(',').map(item => item.trim()) : []
      };
      
      if (selectedItem) {
        // Update existing item
        await updateMenuItem(selectedItem._id, formData);
        setSuccess('Menu item updated successfully!');
      } else {
        // Create new item
        await createMenuItem(formData);
        setSuccess('Menu item created successfully!');
      }
      
      // Refresh menu items
      const menuItemsData = await getMenuItems();
      setMenuItems(menuItemsData);
      
      // Reset form
      setMenuItemForm({
        name: '',
        description: '',
        price: '',
        category: '',
        image_url: '',
        ingredients: '',
        dietary_info: ''
      });
      setSelectedItem(null);
      
    } catch (err) {
      console.error('Error saving menu item:', err);
      setError(err.response?.data?.message || 'Error saving menu item. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Submit category form
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      setLoading(true);
      
      const formData = {
        ...categoryForm,
        display_order: categoryForm.display_order ? parseInt(categoryForm.display_order) : 0
      };
      
      await createCategory(formData);
      setSuccess('Category created successfully!');
      
      // Refresh categories
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      
      // Reset form
      setCategoryForm({
        name: '',
        display_order: ''
      });
      
    } catch (err) {
      console.error('Error saving category:', err);
      setError(err.response?.data?.message || 'Error saving category. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle edit menu item
  const handleEditMenuItem = (item) => {
    setSelectedItem(item);
    setMenuItemForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image_url: item.image_url || '',
      ingredients: item.ingredients ? item.ingredients.join(', ') : '',
      dietary_info: item.dietary_info ? item.dietary_info.join(', ') : ''
    });
    setActiveTab('items');
    window.scrollTo(0, 0);
  };
  
  // Handle delete menu item
  const handleDeleteMenuItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await deleteMenuItem(id);
      
      // Refresh menu items
      const menuItemsData = await getMenuItems();
      setMenuItems(menuItemsData);
      
      setSuccess('Menu item deleted successfully!');
    } catch (err) {
      console.error('Error deleting menu item:', err);
      setError(err.response?.data?.message || 'Error deleting menu item. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) {
    return <div className="text-center py-8">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Admin Dashboard</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'items'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('items')}
        >
          Menu Items
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'categories'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <p className="text-green-700">{success}</p>
        </div>
      )}
      
      {activeTab === 'items' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Item Form */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                {selectedItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h2>
              
              <form onSubmit={handleMenuItemSubmit}>
                <Input
                  label="Name"
                  id="name"
                  name="name"
                  value={menuItemForm.name}
                  onChange={handleMenuItemChange}
                  required
                />
                
                <div className="mb-4">
                  <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={menuItemForm.description}
                    onChange={handleMenuItemChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  ></textarea>
                </div>
                
                <Input
                  label="Price"
                  type="number"
                  id="price"
                  name="price"
                  value={menuItemForm.price}
                  onChange={handleMenuItemChange}
                  step="0.01"
                  min="0"
                  required
                />
                
                <div className="mb-4">
                  <label htmlFor="category" className="block text-gray-700 font-medium mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={menuItemForm.category}
                    onChange={handleMenuItemChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <Input
                  label="Image URL (optional)"
                  id="image_url"
                  name="image_url"
                  value={menuItemForm.image_url}
                  onChange={handleMenuItemChange}
                />
                
                <Input
                  label="Ingredients (comma separated, optional)"
                  id="ingredients"
                  name="ingredients"
                  value={menuItemForm.ingredients}
                  onChange={handleMenuItemChange}
                  placeholder="e.g., Chicken, Rice, Vegetables"
                />
                
                <Input
                  label="Dietary Info (comma separated, optional)"
                  id="dietary_info"
                  name="dietary_info"
                  value={menuItemForm.dietary_info}
                  onChange={handleMenuItemChange}
                  placeholder="e.g., Gluten-free, Vegetarian"
                />
                
                <div className="flex space-x-2 mt-6">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Saving...' : selectedItem ? 'Update Item' : 'Add Item'}
                  </Button>
                  
                  {selectedItem && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setSelectedItem(null);
                        setMenuItemForm({
                          name: '',
                          description: '',
                          price: '',
                          category: '',
                          image_url: '',
                          ingredients: '',
                          dietary_info: ''
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
          
          {/* Menu Items List */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Menu Items</h2>
              </div>
              
              {loading && menuItems.length === 0 ? (
                <div className="p-4 text-center text-gray-500">Loading menu items...</div>
              ) : menuItems.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No menu items found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {menuItems.map(item => (
                        <tr key={item._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">${item.price.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditMenuItem(item)}
                              className="text-orange-500 hover:text-orange-700 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMenuItem(item._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Form */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
              
              <form onSubmit={handleCategorySubmit}>
                <Input
                  label="Category Name"
                  id="name"
                  name="name"
                  value={categoryForm.name}
                  onChange={handleCategoryChange}
                  required
                />
                
                <Input
                  label="Display Order (optional)"
                  type="number"
                  id="display_order"
                  name="display_order"
                  value={categoryForm.display_order}
                  onChange={handleCategoryChange}
                  min="0"
                />
                
                <Button type="submit" disabled={loading} className="w-full mt-6">
                  {loading ? 'Saving...' : 'Add Category'}
                </Button>
              </form>
            </div>
          </div>
          
          {/* Categories List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Categories</h2>
              </div>
              
              {loading && categories.length === 0 ? (
                <div className="p-4 text-center text-gray-500">Loading categories...</div>
              ) : categories.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No categories found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Display Order</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categories.map(category => (
                        <tr key={category._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{category.display_order}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin; 