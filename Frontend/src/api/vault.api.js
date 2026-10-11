import api from './axios';

/**
 * Get all cases for the current authenticated user
 */
export const getVaultCases = async (params = {}) => {
  const response = await api.get('/vault/cases', { params });
  return response.data;
};

/**
 * Get a specific case dossier by ID
 */
export const getVaultCaseById = async (id) => {
  const response = await api.get(`/vault/cases/${id}`);
  return response.data;
};

/**
 * Create a new private case dossier
 */
export const createVaultCase = async (caseData) => {
  const response = await api.post('/vault/cases', caseData);
  return response.data;
};

/**
 * Update case dossier
 */
export const updateVaultCase = async (id, updateData) => {
  const response = await api.put(`/vault/cases/${id}`, updateData);
  return response.data;
};

/**
 * Delete case dossier permanently
 */
export const deleteVaultCase = async (id) => {
  const response = await api.delete(`/vault/cases/${id}`);
  return response.data;
};

/**
 * Add timeline milestone to case
 */
export const addVaultTimelineEvent = async (id, eventData) => {
  const response = await api.post(`/vault/cases/${id}/timeline`, eventData);
  return response.data;
};

/**
 * Add private note to case
 */
export const addVaultNote = async (id, content) => {
  const response = await api.post(`/vault/cases/${id}/notes`, { content });
  return response.data;
};

/**
 * Attach evidence file to case
 */
export const addVaultEvidenceFile = async (id, fileData) => {
  const response = await api.post(`/vault/cases/${id}/files`, fileData);
  return response.data;
};

/**
 * Log transaction reference to case
 */
export const addVaultTransaction = async (id, txData) => {
  const response = await api.post(`/vault/cases/${id}/transactions`, txData);
  return response.data;
};
