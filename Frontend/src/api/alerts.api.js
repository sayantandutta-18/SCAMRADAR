import api from './axios';

/**
 * Get user alerts
 */
export const getAlerts = async (params = {}) => {
  const response = await api.get('/alerts', { params });
  return response.data;
};

/**
 * Get unread alert count
 */
export const getUnreadAlertCount = async () => {
  const response = await api.get('/alerts/unread-count');
  return response.data;
};

/**
 * Mark a single alert as read
 */
export const markAlertAsRead = async (id) => {
  const response = await api.put(`/alerts/${id}/read`);
  return response.data;
};

/**
 * Mark all alerts as read
 */
export const markAllAlertsAsRead = async () => {
  const response = await api.put('/alerts/read-all');
  return response.data;
};

/**
 * Sync / generate alerts based on user preferences and recent reports
 */
export const syncAlerts = async () => {
  const response = await api.post('/alerts/generate');
  return response.data;
};
