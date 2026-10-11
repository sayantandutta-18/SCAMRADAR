import api from './axios';

/**
 * Register a new user
 */
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

/**
 * Log in with email and password
 */
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Fetch authenticated user profile
 */
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

/**
 * Update alert preferences
 */
export const updatePreferences = async (preferences) => {
  const response = await api.put('/auth/preferences', preferences);
  return response.data;
};
