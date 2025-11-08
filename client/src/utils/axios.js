import axios from 'axios';

// Set base URL
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

// Add request interceptor to automatically attach token
axios.interceptors.request.use(
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

// Add response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to home page if not already there or on auth pages
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/signup') && 
          window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
