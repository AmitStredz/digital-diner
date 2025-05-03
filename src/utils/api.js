import axios from 'axios';

// Use environment variable if available, otherwise use production URL, or fallback to local development URL
const API_URL = import.meta.env && import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL 
  : 'https://digital-diner-backend.vercel.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API calls
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

// Menu API calls
export const getMenuItems = async () => {
  const response = await api.get('/menu');
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/menu/categories');
  return response.data;
};

export const getMenuItemsByCategory = async (category) => {
  const response = await api.get(`/menu/category/${category}`);
  return response.data;
};

// Admin Menu API calls
export const createMenuItem = async (menuItemData) => {
  const response = await api.post('/menu', menuItemData);
  return response.data;
};

export const updateMenuItem = async (id, menuItemData) => {
  const response = await api.put(`/menu/${id}`, menuItemData);
  return response.data;
};

export const deleteMenuItem = async (id) => {
  const response = await api.delete(`/menu/${id}`);
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await api.post('/menu/categories', categoryData);
  return response.data;
};

// Order API calls
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getOrdersByEmail = async (email) => {
  const response = await api.get(`/orders/email/${email}`);
  return response.data;
};

export default api; 