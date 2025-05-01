import { useState, useEffect } from 'react';
import { getMenuItems, getCategories } from '../utils/api';
import MenuItem from '../components/MenuItem';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
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
        
        // Set initial load to false after a short delay to allow animations to complete
        setTimeout(() => {
          setIsInitialLoad(false);
        }, 1000);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="w-24 h-24 relative">
          {/* Loading spinner with vibrant colors */}
          <div className="absolute w-full h-full rounded-full border-4 border-t-indigo-500 border-r-purple-500 border-b-pink-500 border-l-transparent animate-spin"></div>
          <div className="absolute top-2 left-2 w-20 h-20 rounded-full border-4 border-t-blue-500 border-r-indigo-500 border-b-transparent border-l-purple-500 animate-spin-slow"></div>
          <div className="absolute top-4 left-4 w-16 h-16 rounded-full border-4 border-t-transparent border-r-pink-500 border-b-indigo-500 border-l-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16 px-4">
        <div className="container mx-auto max-w-6xl py-12">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-900/30 via-red-800/30 to-red-900/30 backdrop-blur-md p-8 border border-red-500/30">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-red-200">Error Loading Menu</h3>
                <p className="text-red-300">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 ripple px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 focus:outline-none"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Decorative glow elements */}
      <div className="fixed top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 blur-3xl rounded-full mix-blend-screen pointer-events-none"></div>
      <div className="fixed top-3/4 right-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 blur-3xl rounded-full mix-blend-screen pointer-events-none"></div>
      
      <div className="relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 py-24">
          {/* Hero section */}
          <div className="mb-16 text-center relative animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4 inline-block">
              Explore Our Menu
            </h1>
            <p className="mt-4 text-gray-300 text-lg max-w-2xl mx-auto mb-8">
              Discover a world of flavors crafted with passion and precision
            </p>
            
            {/* Animated underline */}
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mx-auto rounded-full"></div>
          </div>
          
          {/* Category filter */}
          <div className="mb-12">
            <div className="flex items-center justify-center flex-wrap gap-3">
              <CategoryButton 
                active={selectedCategory === 'All'} 
                onClick={() => setSelectedCategory('All')}
                delay={0}
                isInitialLoad={isInitialLoad}
              >
                All
              </CategoryButton>
              
              {categories.map((category, index) => (
                <CategoryButton 
                  key={category._id}
                  active={selectedCategory === category.name} 
                  onClick={() => setSelectedCategory(category.name)}
                  delay={(index + 1) * 0.1}
                  isInitialLoad={isInitialLoad}
                >
                  {category.name}
                </CategoryButton>
              ))}
            </div>
          </div>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 backdrop-blur-sm bg-gray-800/30 rounded-xl border border-gray-700 animate-fade-in">
              <div className="inline-flex flex-col items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-6 text-gray-500 animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
                </svg>
                <h3 className="text-2xl font-bold text-gradient mb-2">Nothing Found</h3>
                <p className="text-gray-400 max-w-md mb-6">No menu items found in this category. Try selecting a different category.</p>
                <button 
                  onClick={() => setSelectedCategory('All')}
                  className="ripple px-5 py-2.5 rounded-full bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20"
                >
                  View All Items
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredItems.map((item, index) => (
                <div 
                  key={item._id} 
                  className="animate-fade-in" 
                  style={{ 
                    animationDelay: isInitialLoad ? `${index * 0.1}s` : '0s', 
                    animationDuration: isInitialLoad ? '0.5s' : '0.3s' 
                  }}
                >
                  <MenuItem item={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Custom category button component
const CategoryButton = ({ children, active, onClick, delay, isInitialLoad }) => {
  return (
    <button
      className={`ripple px-5 py-2.5 rounded-full backdrop-blur-lg transition-all duration-300 transform hover:scale-105 border-2 animate-fade-in ${
        active
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-500/30'
          : 'bg-gray-800/50 text-gray-300 border-gray-700 hover:border-indigo-500/50 hover:text-white'
      }`}
      onClick={onClick}
      style={{ 
        animationDelay: isInitialLoad ? `${delay}s` : '0s' 
      }}
    >
      <span className="relative">
        {children}
        {active && (
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white/70 rounded-full"></span>
        )}
      </span>
    </button>
  );
};

export default Menu; 