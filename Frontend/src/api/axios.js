import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const serverError = {
        status: error.response.status,
        message: error.response.data?.message || 'Something went wrong',
        errors: error.response.data?.errors || [],
        existingReport: error.response.data?.existingReport || null,
        success: false,
      };
      return Promise.reject(serverError);
    } else if (error.request) {
      // Network error
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
        success: false,
      });
    }
    return Promise.reject({
      status: 0,
      message: 'An unexpected error occurred.',
      success: false,
    });
  }
);

export default api;
