import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-orange-500 font-bold text-2xl">Digital Diner</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium">
                Menu
              </Link>
              
              {user ? (
                <>
                  {isAdmin() && (
                    <Link to="/admin" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium">
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <Link to="/orders" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium">
                    My Orders
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium">
                    Login
                  </Link>
                  <Link to="/signup" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium">
                    Sign Up
                  </Link>
                </>
              )}
              
              <Link to="/cart" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium relative">
                <span>Cart</span>
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-orange-500 rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-500 focus:outline-none">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, toggle classes based on menu state */}
      <div className="hidden md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500">
            Menu
          </Link>
          
          {user ? (
            <>
              {isAdmin() && (
                <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500">
                  Admin Dashboard
                </Link>
              )}
              
              <Link to="/orders" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500">
                My Orders
              </Link>
              
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500">
                Login
              </Link>
              <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500">
                Sign Up
              </Link>
            </>
          )}
          
          <Link to="/cart" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 relative">
            <span>Cart</span>
            {cartItems.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-orange-500 rounded-full">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 