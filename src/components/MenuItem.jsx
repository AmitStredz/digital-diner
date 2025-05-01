import { useState } from 'react';
import Button from './Button';
import { useCart } from '../context/CartContext';

const MenuItem = ({ item }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [animateAdd, setAnimateAdd] = useState(false);
  
  const handleAddToCart = () => {
    addToCart(item);
    
    // Add animation
    setAnimateAdd(true);
    setTimeout(() => setAnimateAdd(false), 700);
  };
  
  const formatPrice = (price) => {
    return `₹${price.toFixed(2)}`;
  };
  
  return (
    <div 
      className="spotlight group relative h-full overflow-hidden rounded-xl shadow-lg transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl hover-vibrant cursor-pointer bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Card border glow */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-xl"></div>
      </div>
      
      {/* Image container */}
      {item.image_url && (
        <div className="relative h-48 overflow-hidden rounded-t-xl">
          <img 
            src={item.image_url} 
            alt={item.name} 
            className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110 filter brightness-75' : 'scale-100'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
          
          {/* Price badge */}
          <div className="absolute top-3 right-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg blur-sm bg-gradient-to-r from-indigo-600/80 to-purple-600/80"></div>
              <div className="relative vibrant-glass py-1 px-3 rounded-lg z-10 backdrop-blur-md">
                <span className="text-base font-mono font-bold text-white">
                  {formatPrice(item.price)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Dietary tags */}
          {item.dietary_info && item.dietary_info.length > 0 && (
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
              {item.dietary_info.map((info, index) => (
                <span 
                  key={index} 
                  className="badge bg-gradient-to-r from-slate-700/80 to-slate-800/80 backdrop-blur-md text-white border border-slate-600/30 shadow-lg"
                >
                  {info}
                </span>
              ))}
            </div>
          )}
          
          {/* Overlay info on hover */}
          <div 
            className={`absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-t from-slate-900/90 via-slate-800/80 to-slate-900/70 backdrop-blur-sm transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <p className="text-gray-200 text-sm line-clamp-3">{item.description}</p>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="p-5 relative">
        {/* Shimmering line */}
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
        
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gradient-vibrant transition-all duration-300">
          {item.name}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>
        
        <div className="mt-auto">
          <Button 
            onClick={handleAddToCart}
            variant="vibrant"
            size="md"
            className={`w-full ${animateAdd ? 'animate-pulse-vibrant' : ''}`}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            Add to Cart
          </Button>
        </div>
      </div>
      
      {/* Best value badge */}
      {item.price < 10 && (
        <div className="absolute -top-2 -right-2 z-20 animate-pulse-vibrant">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-lg bg-gradient-to-r from-emerald-400 to-teal-400 opacity-80"></div>
            <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-xl border border-emerald-400/50">
              Best Value
            </div>
          </div>
        </div>
      )}
      
      {/* Hover feedback corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-transparent group-hover:border-indigo-500/70 transition-all duration-300 rounded-tl-lg"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-transparent group-hover:border-purple-500/70 transition-all duration-300 rounded-tr-lg"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-transparent group-hover:border-purple-500/70 transition-all duration-300 rounded-bl-lg"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-transparent group-hover:border-indigo-500/70 transition-all duration-300 rounded-br-lg"></div>
    </div>
  );
};

export default MenuItem; 