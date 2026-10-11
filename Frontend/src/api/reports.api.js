import api from './axios';

// Create a new scam report
export const createReport = async (reportData) => {
  const response = await api.post('/reports', reportData);
  return response.data;
};

// Get all reports with pagination and filters
export const getReports = async (filters = {}) => {
  const response = await api.get('/reports', { params: filters });
  return response.data;
};

// Search reports by identifier
export const searchReports = async (identifierOrParams, maybeType) => {
  let identifier = '';
  let identifierType = '';

  if (typeof identifierOrParams === 'object' && identifierOrParams !== null) {
    identifier = identifierOrParams.identifier;
    identifierType = identifierOrParams.identifierType;
  } else {
    identifier = identifierOrParams;
    identifierType = maybeType;
  }

  const response = await api.get('/reports/search', {
    params: { identifier, identifierType },
  });
  return response.data;
};

// Get report by ID
export const getReportById = async (id) => {
  const response = await api.get(`/reports/${id}`);
  return response.data;
};

// Get report statistics
export const getReportStats = async () => {
  const response = await api.get('/reports/stats');
  return response.data;
};

// Get map reports
export const getMapReports = async () => {
  const response = await api.get('/reports/map');
  return response.data;
};

// Health check
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Verify report on blockchain
export const verifyReportOnChain = async (id) => {
  const response = await api.get(`/reports/${id}/verify`);
  return response.data;
};

// Threat intelligence trends (daily/weekly/monthly time-series)
export const getTimeSeriesTrends = async (params = {}) => {
  const response = await api.get('/reports/trends', { params });
  return response.data;
};

// Category deep-dive analytics
export const getCategoryAnalytics = async () => {
  const response = await api.get('/reports/category-analytics');
  return response.data;
};

// Geographic threat hotspots
export const getGeographicHotspots = async () => {
  const response = await api.get('/reports/hotspots');
  return response.data;
};

