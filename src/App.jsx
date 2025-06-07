import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import { useAuth } from './context/AuthContext';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <div className="relative">
      {/* Outer ring */}
      <div className="w-16 h-16 rounded-full border-2 border-t-indigo-500 border-r-purple-500 border-b-pink-500 border-l-transparent animate-spin"></div>
      
      {/* Inner ring */}
      <div className="absolute inset-1 w-14 h-14 rounded-full border-2 border-t-transparent border-r-indigo-400 border-b-purple-400 border-l-pink-400 animate-spin-slow"></div>
      
      {/* Center dot with pulse */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin route component
const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (!user || !isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// App component needs to be defined after the hooks
const AppContent = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Track mouse position for interactive effects
  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);
  
  return (
    <BrowserRouter>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
        {/* Decorative background elements */}
        <div 
          className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(
              circle at ${mousePosition.x}px ${mousePosition.y}px,
              rgba(99, 102, 241, 0.15) 0%,
              rgba(99, 102, 241, 0.05) 25%,
              transparent 50%
            )`
          }}
        ></div>
        
        {/* Background glow effects */}
        <div className="fixed -top-20 -left-20 w-96 h-96 bg-indigo-600/10 blur-3xl rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="fixed -bottom-20 -right-20 w-96 h-96 bg-purple-600/10 blur-3xl rounded-full mix-blend-screen pointer-events-none"></div>
        
        <Navbar />
        
        <main className="relative z-10 pt-16">
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
          </Routes>
        </main>

        {/* Footer with subtle gradient border */}
        <footer className="relative z-10 mt-auto pb-6 pt-12 border-t border-gray-800/50 bg-gradient-to-b from-transparent to-gray-900/50">
          <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
            <div className="w-32 h-px mx-auto mb-6 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
            <p className="hover:text-white transition-colors duration-300 cursor-default">
              &copy; {new Date().getFullYear()} Digital Diner. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

// Main App component with providers
const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
