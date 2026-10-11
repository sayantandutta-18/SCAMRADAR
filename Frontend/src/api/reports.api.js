import api from './axios';

// Create a new scam report
export const createReport = async (reportData) => {
  const response = await api.post('/reports', reportData);
  return response.data;
};

// Get all reports with pagination and filters
export const getReports = async ({ page = 1, limit = 10, scamType, city, state } = {}) => {
  const params = { page, limit };
  if (scamType) params.scamType = scamType;
  if (city) params.city = city;
  if (state) params.state = state;
  const response = await api.get('/reports', { params });
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
