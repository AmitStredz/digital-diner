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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-950 pt-24 pb-16 px-4">
      <div className="container mx-auto">
        {/* Decorative background elements */}
        <div className="fixed -z-10 top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-600/5 rounded-full blur-3xl"></div>
        </div>
      
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-300 to-blue-300 mb-8 text-center animate-fadeIn">
          Admin Dashboard
        </h1>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-800 mb-8 justify-center">
          <button
            className={`py-3 px-6 font-medium relative group transition-all duration-300 ${
              activeTab === 'items'
                ? 'text-purple-300'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('items')}
          >
            Menu Items
            {activeTab === 'items' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500"></span>
            )}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 group-hover:w-full transition-all duration-300"></span>
          </button>
          <button
            className={`py-3 px-6 font-medium relative group transition-all duration-300 ${
              activeTab === 'categories'
                ? 'text-indigo-300'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('categories')}
          >
            Categories
            {activeTab === 'categories' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-blue-500"></span>
            )}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-900/30 backdrop-blur-sm border border-red-800/50 rounded-lg p-4 mb-6 max-w-4xl mx-auto animate-fadeIn">
            <p className="text-red-300">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-900/30 backdrop-blur-sm border border-green-800/50 rounded-lg p-4 mb-6 max-w-4xl mx-auto animate-fadeIn">
            <p className="text-green-300">{success}</p>
          </div>
        )}
        
        {activeTab === 'items' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Menu Item Form */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-gray-900/60 backdrop-blur-md rounded-xl shadow-xl p-6 border border-gray-800 animate-fadeIn">
                <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">
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
                  
                  <div className="mb-5">
                    <label htmlFor="description" className="block text-gray-200 font-medium mb-1.5">
                      Description <span className="text-pink-400">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={menuItemForm.description}
                      onChange={handleMenuItemChange}
                      rows="3"
                      className="w-full px-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 hover:border-indigo-400/50 transition-all duration-300 text-gray-100 placeholder-gray-500 backdrop-blur-sm"
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
                  
                  <div className="mb-5">
                    <label htmlFor="category" className="block text-gray-200 font-medium mb-1.5">
                      Category <span className="text-pink-400">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={menuItemForm.category}
                      onChange={handleMenuItemChange}
                      className="w-full px-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 hover:border-indigo-400/50 transition-all duration-300 text-gray-100 backdrop-blur-sm"
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
                  
                  <div className="flex space-x-3 mt-6">
                    <Button type="submit" disabled={loading} variant="vibrant" className="flex-1">
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          <span>Saving...</span>
                        </div>
                      ) : (
                        selectedItem ? 'Update Item' : 'Add Item'
                      )}
                    </Button>
                    
                    {selectedItem && (
                      <Button
                        type="button"
                        variant="glass"
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
              <div className="bg-gray-900/60 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-gray-800 animate-fadeIn">
                <div className="p-4 bg-gray-800/70 border-b border-gray-700/60">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Menu Items
                  </h2>
                </div>
                
                {loading && menuItems.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 animate-pulse">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    Loading menu items...
                  </div>
                ) : menuItems.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">No menu items found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-800">
                      <thead className="bg-gray-800/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-indigo-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/50">
                        {menuItems.map((item, index) => (
                          <tr key={item._id} className="bg-gray-900/40 hover:bg-gray-800/30 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-100">{item.name}</div>
                              <div className="text-sm text-gray-400 truncate max-w-xs">{item.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-emerald-400">₹{item.price.toFixed(2)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-purple-300">{item.category}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleEditMenuItem(item)}
                                className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 mr-4"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteMenuItem(item._id)}
                                className="text-red-400 hover:text-red-300 transition-colors duration-200"
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Category Form */}
            <div>
              <div className="bg-gray-900/60 backdrop-blur-md rounded-xl shadow-xl p-6 border border-gray-800 animate-fadeIn">
                <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-300">
                  Add New Category
                </h2>
                
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
                  
                  <Button type="submit" disabled={loading} variant="vibrant" className="w-full mt-6">
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span>Saving...</span>
                      </div>
                    ) : 'Add Category'}
                  </Button>
                </form>
              </div>
            </div>
            
            {/* Categories List */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900/60 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-gray-800 animate-fadeIn">
                <div className="p-4 bg-gray-800/70 border-b border-gray-700/60">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Categories
                  </h2>
                </div>
                
                {loading && categories.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 animate-pulse">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    Loading categories...
                  </div>
                ) : categories.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">No categories found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-800">
                      <thead className="bg-gray-800/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Display Order</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/50">
                        {categories.map(category => (
                          <tr key={category._id} className="bg-gray-900/40 hover:bg-gray-800/30 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-100">{category.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-300">{category.display_order}</div>
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
    </div>
  );
};

export default Admin; 