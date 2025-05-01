import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrdersByEmail } from '../utils/api';
import Button from '../components/Button';
import moment from 'moment';

const OrderItem = ({ item }) => (
  <div className="flex justify-between border-b border-gray-200 py-2">
    <div>
      <span className="font-medium">{item.menu_item?.name || 'Unknown Item'}</span>
      <span className="text-gray-500 ml-2">x{item.quantity}</span>
    </div>
    <span>₹{(item.price_at_time * item.quantity).toFixed(2)}</span>
  </div>
);

const Order = ({ order }) => {
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
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">Order ID: {order.order_id}</span>
            <h3 className="text-lg font-semibold mt-1">
              {formattedDate} {formattedTime && `at ${formattedTime}`}
            </h3>
          </div>
          
          <div className="text-right">
            <span className="font-bold text-lg">₹{parseFloat(order.total_price).toFixed(2)}</span>
            <div className="text-sm">
              <span className={`inline-block px-2 py-1 rounded-full ${
                order.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
        
        <Button
          variant="outline"
          className="mt-2 text-sm"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Hide Details' : 'View Details'}
        </Button>
      </div>
      
      {expanded && (
        <div className="p-4 bg-gray-50">
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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-xl text-gray-600 mb-4">Please log in to view your orders</p>
          <Button onClick={() => window.location.href = '/login'}>Go to Login</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Orders</h1>
      
      {loading && (
        <div className="text-center py-8">
          <p className="text-xl text-gray-500">Loading your orders...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 max-w-2xl mx-auto">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {!loading && orders.length > 0 && (
        <div className="max-w-2xl mx-auto">
          <div className="space-y-4">
            {orders.map(order => (
              <Order key={order.order_id} order={order} />
            ))}
          </div>
        </div>
      )}
      
      {!loading && orders.length === 0 && !error && (
        <div className="text-center py-8">
          <p className="text-xl text-gray-500 mb-4">You haven't placed any orders yet</p>
          <Button onClick={() => window.location.href = '/'}>Browse Menu</Button>
        </div>
      )}
    </div>
  );
};

export default Orders; 