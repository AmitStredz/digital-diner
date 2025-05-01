import { useState } from 'react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    updateQuantity(item._id, newQuantity);
  };
  
  const handleRemove = () => {
    setIsRemoving(true);
    // Delay the actual removal to allow for animation
    setTimeout(() => {
      removeFromCart(item._id);
    }, 300);
  };
  
  return (
    <div 
      className={`relative overflow-hidden transition-all duration-500 ${isRemoving ? 'transform -translate-x-full opacity-0' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flex items-center justify-between p-4 border-b border-gray-700/50 backdrop-blur-sm transition-all duration-300 ${isHovered ? 'bg-gray-800/50' : 'bg-gray-900/30'}`}>
        {/* Item info */}
        <div className="flex items-center space-x-4">
          {item.image_url && (
            <div className="relative overflow-hidden rounded-lg h-16 w-16 group">
              <img 
                src={item.image_url} 
                alt={item.name} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          )}
          
          <div>
            <h3 className="text-base font-medium text-gray-100 group-hover:text-gradient-vibrant transition-colors duration-300">{item.name}</h3>
            <p className="text-sm text-gray-400">₹{item.price.toFixed(2)} each</p>
          </div>
        </div>
        
        {/* Quantity and controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <button
              className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-l-md transition-colors duration-200 border-y border-l border-gray-700 hover:border-gray-600 ripple"
              onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={handleQuantityChange}
              className="w-12 text-center border-y border-gray-700 bg-gray-800 text-white py-1.5 focus:outline-none focus:ring-0"
            />
            
            <button
              className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-r-md transition-colors duration-200 border-y border-r border-gray-700 hover:border-gray-600 ripple"
              onClick={() => updateQuantity(item._id, item.quantity + 1)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
              </svg>
            </button>
          </div>
          
          <div className="text-right min-w-[80px]">
            <p className="font-medium text-gray-100">₹{(item.price * item.quantity).toFixed(2)}</p>
            <button
              onClick={handleRemove}
              className="text-sm text-red-400 hover:text-red-300 transition-colors duration-200 flex items-center group"
            >
              <span className="mr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </span>
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem; 