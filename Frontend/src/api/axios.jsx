import axios from 'axios';

// Base URL - will be replaced with actual backend URL later
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add token
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
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;

        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden:', data.message);
          break;

        case 404:
          // Not found
          console.error('Resource not found:', data.message);
          break;

        case 500:
          // Server error
          console.error('Server error:', data.message);
          break;

        default:
          console.error('API error:', data.message);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error: No response from server');
    } else {
      // Error in setting up request
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

// Export convenience methods for different HTTP methods
export const apiGet = (url, config) => api.get(url, config);
export const apiPost = (url, data, config) => api.post(url, data, config);
export const apiPut = (url, data, config) => api.put(url, data, config);
export const apiPatch = (url, data, config) => api.patch(url, data, config);
export const apiDelete = (url, config) => api.delete(url, config);