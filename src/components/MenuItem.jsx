import Button from './Button';
import { useCart } from '../context/CartContext';

const MenuItem = ({ item }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(item);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      {item.image_url && (
        <div className="h-48 overflow-hidden">
          <img 
            src={item.image_url} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
          <span className="text-orange-500 font-bold">₹{item.price.toFixed(2)}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
        
        {item.dietary_info && item.dietary_info.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {item.dietary_info.map((info, index) => (
              <span 
                key={index} 
                className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
              >
                {info}
              </span>
            ))}
          </div>
        )}
        
        <Button 
          onClick={handleAddToCart} 
          className="w-full"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default MenuItem; 