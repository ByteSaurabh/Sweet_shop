import axios from 'axios';

// API base URL - uses Vite proxy in development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (email: string, password: string, fullName: string) =>
    api.post('/auth/register', { email, password, fullName }),
  
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Sweets API
export const sweetsAPI = {
  getAll: () => api.get('/sweets'),
  
  search: (params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => api.get('/sweets/search', { params }),
  
  getCategories: () => api.get('/sweets/categories'),
  
  create: (sweet: {
    name: string;
    description?: string;
    category: string;
    price: number;
    quantity?: number;
    image_url?: string;
  }) => api.post('/sweets', sweet),
  
  update: (id: string, sweet: Partial<{
    name: string;
    description: string;
    category: string;
    price: number;
    quantity: number;
    image_url: string;
  }>) => api.put(`/sweets/${id}`, sweet),
  
  delete: (id: string) => api.delete(`/sweets/${id}`),
  
  purchase: (id: string, quantity: number) =>
    api.post(`/sweets/${id}/purchase`, { quantity }),
  
  restock: (id: string, quantity: number) =>
    api.post(`/sweets/${id}/restock`, { quantity }),
};

// Purchases API
export const purchasesAPI = {
  getAll: (all?: boolean) =>
    api.get('/purchases', { params: { all } }),
};

export default api;
