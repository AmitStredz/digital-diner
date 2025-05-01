import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../utils/api';
import CartItem from '../components/CartItem';
import Button from '../components/Button';
import Input from '../components/Input';

const Cart = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [orderInfo, setOrderInfo] = useState({
    name: user?.name || '',
    phone_number: user?.phone_number || '',
    email: user?.email || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [isAnimating, setIsAnimating] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderInfo({ ...orderInfo, [name]: value });
  };
  
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      setError('Your cart is empty. Please add items to your cart before placing an order.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const orderData = {
        name: orderInfo.name,
        phone_number: orderInfo.phone_number,
        email: orderInfo.email,
        items: cartItems.map(item => ({
          menu_item_id: item._id,
          quantity: item.quantity,
          price_at_time: item.price,
          special_instructions: item.special_instructions || ''
        })),
        total_price: totalPrice
      };
      
      const response = await createOrder(orderData);
      setOrderPlaced(true);
      setOrderId(response.order_id);
      clearCart();
      
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.response?.data?.message || 'Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (orderPlaced) {
    return (
      <div className="min-h-screen pt-24 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-md mx-auto glass p-8 rounded-2xl border border-gray-700/50 backdrop-blur-md animate-fade-in">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 mb-6 animate-pulse-vibrant">
              <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300 mb-4">Order Placed Successfully!</h2>
            <p className="text-gray-300 mb-8">
              Your order has been received and is being processed. 
              {orderId && <span> Your order ID is <span className="font-medium text-emerald-400">{orderId}</span>.</span>}
            </p>
            
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/')} 
                variant="vibrant" 
                className="w-full"
              >
                Continue Shopping
              </Button>
              
              <Button 
                variant="glass" 
                onClick={() => navigate('/orders')} 
                className="w-full"
              >
                View Your Orders
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 mb-8 text-center animate-fade-in">
          Your Cart
        </h1>
        
        {error && (
          <div className="mb-6 rounded-xl bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-500/40 p-4 max-w-4xl mx-auto backdrop-blur-sm animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}
        
        {cartItems.length === 0 ? (
          <div className="text-center py-16 animate-fade-in glass rounded-xl max-w-2xl mx-auto backdrop-blur-md border border-gray-700/50">
            <div className="inline-flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-500 mb-6 animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-gradient mb-2">Your cart is empty</h2>
              <p className="text-gray-400 max-w-md mb-8">Add items from our menu to begin your order.</p>
              <Button 
                variant="vibrant" 
                onClick={() => navigate('/')} 
                className="px-6"
              >
                Browse Menu
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="lg:col-span-2">
              <div className="glass rounded-xl overflow-hidden backdrop-blur-md border border-gray-700/50 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="p-4 bg-gray-800/70 border-b border-gray-700/60">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Cart Items ({cartItems.length})
                  </h2>
                </div>
                
                <div>
                  {cartItems.map((item, index) => (
                    <div 
                      key={item._id} 
                      className="animate-fade-in" 
                      style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                    >
                      <CartItem item={item} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <div className="glass rounded-xl overflow-hidden backdrop-blur-md border border-gray-700/50 sticky top-24 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="p-4 bg-gray-800/70 border-b border-gray-700/60">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Order Summary
                  </h2>
                </div>
                
                <div className="p-5">
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-gray-700/50 pb-4">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="font-medium text-gray-200">₹{totalPrice.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-white">Total</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">₹{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <form className="mt-6 space-y-4" onSubmit={handlePlaceOrder}>
                    <Input
                      label="Name"
                      type="text"
                      id="name"
                      name="name"
                      value={orderInfo.name}
                      onChange={handleChange}
                      required
                    />
                    
                    <Input
                      label="Email"
                      type="email"
                      id="email"
                      name="email"
                      value={orderInfo.email}
                      onChange={handleChange}
                      required
                    />
                    
                    <Input
                      label="Phone Number (optional)"
                      type="text"
                      id="phone_number"
                      name="phone_number"
                      value={orderInfo.phone_number}
                      onChange={handleChange}
                    />
                    
                    <Button
                      type="submit"
                      variant="vibrant"
                      className="w-full mt-4"
                      disabled={loading}
                      loading={loading}
                    >
                      {loading ? 'Processing...' : 'Place Order'}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart; 