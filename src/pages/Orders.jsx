import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrdersByEmail } from '../utils/api';
import Button from '../components/Button';
import moment from 'moment';

const OrderItem = ({ item }) => (
  <div className="flex justify-between border-b border-gray-700/30 py-2 animate-fadeIn">
    <div>
      <span className="font-medium text-gray-100">{item.menu_item?.name || 'Unknown Item'}</span>
      <span className="text-purple-300 ml-2">x{item.quantity}</span>
    </div>
    <span className="text-emerald-300 font-semibold">₹{(item.price_at_time * item.quantity).toFixed(2)}</span>
  </div>
);

const Order = ({ order, index }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Use moment.js to format the date
  let formattedDate = 'N/A';
  let formattedTime = '';
  
  try {
    if (order.createdAt) {
      const orderDate = moment(order.createdAt);
      if (orderDate.isValid()) {
        formattedDate = orderDate.format('DD MMM YYYY');
        formattedTime = orderDate.format('hh:mm A');
      }
    }
  } catch (error) {
    console.error('Error formatting date:', error);
  }
  
  // Animation delay based on index for staggered reveal
  const animationDelay = `${index * 0.1}s`;
  
  return (
    <div 
      className="bg-gray-900/60 backdrop-blur-sm rounded-lg border border-gray-800 shadow-lg shadow-purple-900/20 overflow-hidden mb-4 hover:shadow-purple-500/10 hover:border-purple-800/50 transition-all duration-300"
      style={{ animationDelay, animation: 'fadeInUp 0.5s ease-out backwards' }}
    >
      <div className="p-4 border-b border-gray-700/30 relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500/10 to-transparent"></div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-purple-300">Order ID: {order.order_id}</span>
            <h3 className="text-lg font-semibold mt-1 text-white">
              {formattedDate} {formattedTime && `at ${formattedTime}`}
            </h3>
          </div>
          
          <div className="text-right relative">
            <span className="font-bold text-lg bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              ₹{parseFloat(order.total_price).toFixed(2)}
            </span>
            <div className="text-sm mt-1">
              <span className={`inline-block px-3 py-1 rounded-full ${
                order.status === 'completed' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
              } shadow-sm`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
        
        <Button
          variant="vibrant"
          className="mt-3 text-sm group"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="group-hover:mr-2 transition-all">
            {expanded ? 'Hide Details' : 'View Details'}
          </span>
          <span className="transform transition-transform group-hover:translate-x-1">
            {expanded ? '↑' : '↓'}
          </span>
        </Button>
      </div>
      
      {expanded && (
        <div className="p-4 bg-gray-900/40 animate-fadeIn">
          <div className="space-y-2 mb-4">
            {order.order_items.map(item => (
              <OrderItem key={item.order_item_id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fetchOrders = async () => {
    if (!user || !user.email) {
      setError('You must be logged in to view your orders');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const ordersData = await getOrdersByEmail(user.email);
      console.log('Fetched orders:', ordersData);
      setOrders(ordersData);
      
      if (ordersData.length === 0) {
        setError('You have no orders yet');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Error fetching orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user?.email) {
      fetchOrders();
    }
  }, [user]);
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[70vh] flex items-center justify-center">
        <div className="text-center py-8 max-w-md w-full bg-gray-900/60 backdrop-blur-md rounded-xl p-8 border border-gray-800 shadow-xl animate-fadeIn">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-transparent flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-xl text-gray-300 mb-5">Please log in to view your orders</p>
          <Button onClick={() => window.location.href = '/login'} variant="vibrant">Go to Login</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative">
        {/* Decorative background elements */}
        <div className="absolute -top-20 -left-10 w-72 h-72 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -right-10 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl"></div>
      
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-200 mb-8 text-center animate-fadeIn">
          Your Orders
        </h1>
        
        {loading && (
          <div className="text-center py-16 animate-pulse">
            <div className="w-16 h-16 mx-auto border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xl text-gray-400">Loading your orders...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/20 backdrop-blur-sm border border-red-800 rounded-lg p-5 mb-6 max-w-2xl mx-auto animate-fadeIn">
            <p className="text-red-300">{error}</p>
          </div>
        )}
        
        {!loading && orders.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="space-y-4">
              {orders.map((order, index) => (
                <Order key={order.order_id} order={order} index={index} />
              ))}
            </div>
          </div>
        )}
        
        {!loading && orders.length === 0 && !error && (
          <div className="text-center py-16 max-w-md mx-auto bg-gray-900/60 backdrop-blur-md rounded-xl p-8 border border-gray-800 shadow-xl animate-fadeIn">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-transparent flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-xl text-gray-300 mb-5">You haven't placed any orders yet</p>
            <Button onClick={() => window.location.href = '/'} variant="vibrant">Browse Menu</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders; 