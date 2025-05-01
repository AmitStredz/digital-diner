import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    updateQuantity(item._id, newQuantity);
  };
  
  const handleRemove = () => {
    removeFromCart(item._id);
  };
  
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center space-x-4">
        {item.image_url && (
          <img 
            src={item.image_url} 
            alt={item.name} 
            className="w-16 h-16 object-cover rounded-md"
          />
        )}
        
        <div>
          <h3 className="text-base font-medium text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-500">₹{item.price.toFixed(2)} each</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <button
            className="px-2 py-1 bg-gray-200 rounded-l-md"
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
          >
            -
          </button>
          
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={handleQuantityChange}
            className="w-12 text-center border-t border-b border-gray-200 py-1"
          />
          
          <button
            className="px-2 py-1 bg-gray-200 rounded-r-md"
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
          >
            +
          </button>
        </div>
        
        <div className="text-right">
          <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
          <button
            onClick={handleRemove}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem; 