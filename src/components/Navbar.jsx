import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoverItem, setHoverItem] = useState(null);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <nav 
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-gray-900/90 backdrop-blur-xl border-b border-gray-800/70' 
          : 'bg-transparent backdrop-blur-sm'
      }`}
    >
      {/* Animated top border */}
      <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex-shrink-0 flex items-center group relative spotlight"
              onMouseEnter={() => setHoverItem('logo')}
              onMouseLeave={() => setHoverItem(null)}
            >
              <span className="text-2xl font-bold">
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${
                  hoverItem === 'logo' 
                    ? 'from-pink-400 via-purple-400 to-indigo-400 animate-textShimmer' 
                    : 'from-indigo-400 via-purple-400 to-pink-400'
                } transition-all duration-500`}>
                  Digital Diner
                </span>
              </span>
              <div className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="flex items-center">
            <div className="hidden md:flex md:space-x-3">
              <NavLink to="/" active={isActive('/')} onHover={(hover) => setHoverItem(hover ? 'menu' : null)}>
                Menu
              </NavLink>
              
              {user ? (
                <>
                  {isAdmin() && (
                    <NavLink to="/admin" active={isActive('/admin')} onHover={(hover) => setHoverItem(hover ? 'admin' : null)}>
                      Admin
                    </NavLink>
                  )}
                  
                  <NavLink to="/orders" active={isActive('/orders')} onHover={(hover) => setHoverItem(hover ? 'orders' : null)}>
                    My Orders
                  </NavLink>
                  
                  <button
                    onClick={handleLogout}
                    className="group relative px-4 py-2 text-gray-300 hover:text-white transition-all duration-300 ripple"
                    onMouseEnter={() => setHoverItem('logout')}
                    onMouseLeave={() => setHoverItem(null)}
                  >
                    <span className="relative z-10">Logout</span>
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-rose-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" active={isActive('/login')} onHover={(hover) => setHoverItem(hover ? 'login' : null)}>
                    Login
                  </NavLink>
                  
                  <NavLink to="/signup" active={isActive('/signup')} onHover={(hover) => setHoverItem(hover ? 'signup' : null)}>
                    Sign Up
                  </NavLink>
                </>
              )}
              
              <NavLink 
                to="/cart" 
                active={isActive('/cart')} 
                onHover={(hover) => setHoverItem(hover ? 'cart' : null)}
                className="pr-4"
              >
                <div className="relative">
                  <span>Cart</span>
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-4 flex items-center justify-center h-5 w-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 pulse-ring">
                      {cartItems.length}
                    </span>
                  )}
                </div>
              </NavLink>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/70 hover:bg-gray-700/70 transition-colors duration-300 text-gray-300 focus:outline-none ripple"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                <div className="relative w-5 h-5">
                  <span className={`absolute block h-0.5 w-5 bg-current transform transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'}`}></span>
                  <span className={`absolute block h-0.5 bg-current transform transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-0 w-0' : 'opacity-100 w-5'}`}></span>
                  <span className={`absolute block h-0.5 w-5 bg-current transform transition-all duration-300 ease-in-out ${mobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          mobileMenuOpen ? 'max-h-[400px] border-t border-gray-800/50' : 'max-h-0'
        }`}
      >
        <div className={`px-4 py-3 space-y-2 bg-gray-900/90 backdrop-blur-xl transition-all duration-500 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0'
        }`}>
          <MobileNavLink to="/" active={isActive('/')}>
            Menu
          </MobileNavLink>
          
          {user ? (
            <>
              {isAdmin() && (
                <MobileNavLink to="/admin" active={isActive('/admin')}>
                  Admin
                </MobileNavLink>
              )}
              
              <MobileNavLink to="/orders" active={isActive('/orders')}>
                My Orders
              </MobileNavLink>
              
              <button
                onClick={handleLogout}
                className="ripple w-full text-left px-4 py-3 rounded-lg bg-gray-800/70 text-gray-300 hover:bg-gray-700/70 hover:text-white transition-colors duration-300 border border-gray-700/50 hover:border-gray-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <MobileNavLink to="/login" active={isActive('/login')}>
                Login
              </MobileNavLink>
              
              <MobileNavLink to="/signup" active={isActive('/signup')}>
                Sign Up
              </MobileNavLink>
            </>
          )}
          
          <MobileNavLink to="/cart" active={isActive('/cart')}>
            <div className="flex justify-between items-center">
              <span>Cart</span>
              {cartItems.length > 0 && (
                <span className="flex items-center justify-center h-6 min-w-6 px-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-xs font-semibold text-white animate-pulse-vibrant">
                  {cartItems.length}
                </span>
              )}
            </div>
          </MobileNavLink>
        </div>
      </div>
    </nav>
  );
};

// Desktop NavLink component
const NavLink = ({ to, active, children, onHover, className = '' }) => {
  return (
    <Link 
      to={to} 
      className={`group relative px-4 py-2 text-gray-300 hover:text-white transition-all duration-300 ripple ${className}`}
      onMouseEnter={() => onHover && onHover(true)}
      onMouseLeave={() => onHover && onHover(false)}
    >
      <span className="relative z-10">{children}</span>
      
      {active ? (
        // Active state with gradient underline
        <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></span>
      ) : (
        // Hover state with animated underline
        <span className="absolute bottom-0 inset-x-0 h-0.5 bg-white/60 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full"></span>
      )}
      
      {/* Subtle background hover effect */}
      <span className="absolute inset-0 bg-white/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></span>
    </Link>
  );
};

// Mobile NavLink component
const MobileNavLink = ({ to, active, children }) => {
  return (
    <Link 
      to={to}
      className={`ripple block px-4 py-3 rounded-lg transition-all duration-300 border ${
        active
          ? 'bg-gradient-to-r from-indigo-600/60 to-purple-600/60 text-white border-indigo-500/50 shadow-lg shadow-indigo-500/10'
          : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/70 hover:text-white border-gray-700/50 hover:border-gray-600'
      }`}
    >
      {children}
    </Link>
  );
};

export default Navbar; 