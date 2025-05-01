import { useState, useEffect } from 'react';
import { getMenuItems, getCategories } from '../utils/api';
import MenuItem from '../components/MenuItem';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        
        // Fetch menu items
        const menuItemsData = await getMenuItems();
        setMenuItems(menuItemsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load menu items. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter menu items by selected category
  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading menu items...</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Menu</h1>
      
      {/* Category filter */}
      <div className="mb-8">
        <div className="flex items-center justify-center flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-full ${
              selectedCategory === 'All'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </button>
          
          {categories.map((category) => (
            <button
              key={category._id}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category.name
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {filteredItems.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No menu items found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuItem key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu; 