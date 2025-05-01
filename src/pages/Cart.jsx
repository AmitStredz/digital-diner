import { useState } from 'react';
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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your order has been received and is being processed. 
              {orderId && <span> Your order ID is <span className="font-medium">{orderId}</span>.</span>}
            </p>
            
            <div className="space-y-4">
              <Button onClick={() => navigate('/')} className="w-full">
                Continue Shopping
              </Button>
              
              <Button variant="outline" onClick={() => navigate('/orders')} className="w-full">
                View Your Orders
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Cart</h1>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 max-w-4xl mx-auto">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500 mb-6">Your cart is empty</p>
          <Button onClick={() => navigate('/')}>Browse Menu</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Cart Items</h2>
              </div>
              
              <div>
                {cartItems.map(item => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
              </div>
              
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-200 pb-4">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
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
                    className="w-full"
                    disabled={loading}
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
  );
};

export default Cart; 