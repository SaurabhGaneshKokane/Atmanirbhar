import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Bearer Token from localStorage ('atmanirbhar_token')
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('atmanirbhar_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle auth errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('API Unauthorized: Token might be expired or invalid');
    }
    return Promise.reject(error);
  }
);

// Authentication Endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  demoLogin: (payload) => api.post('/auth/demo-login', payload),
  getMe: () => api.get('/auth/me'),
};

// Products Endpoints
export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => api.post('/products', productData),
  toggleStockStatus: (id, data) => api.patch(`/products/${id}/stock`, data || {}),
};

// Orders Endpoints
export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getConsumerOrders: () => api.get('/orders/my'),
  getFarmerOrders: () => api.get('/orders/farmer'),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

// Admin Endpoints
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getPendingVerifications: () => api.get('/admin/verifications'),
  verifyFarmer: (id, data) => api.patch(`/admin/verify/${id}`, data),
};

export default api;
