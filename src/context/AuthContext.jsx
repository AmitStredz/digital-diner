import { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, signup as apiSignup } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);
  
  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const data = await apiLogin(credentials);
      
      // Store user and token in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Something went wrong' 
      };
    } finally {
      setLoading(false);
    }
  };
  
  // Signup function
  const signup = async (userData) => {
    try {
      setLoading(true);
      const data = await apiSignup(userData);
      
      // Store user and token in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Something went wrong' 
      };
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };
  
  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };
  
  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAdmin
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 