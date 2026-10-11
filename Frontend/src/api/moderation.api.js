import api from './axios';

/**
 * File formal dispute against a report (public or authenticated)
 */
export const fileReportDispute = async (reportId, disputeData) => {
  const response = await api.post(`/reports/${reportId}/dispute`, disputeData);
  return response.data;
};

/**
 * List reports for moderation review (moderators/admins)
 */
export const getModerationReports = async (params = {}) => {
  const response = await api.get('/moderation/reports', { params });
  return response.data;
};

/**
 * Update report moderation status & credibility (moderators/admins)
 */
export const updateReportModerationStatus = async (reportId, data) => {
  const response = await api.put(`/moderation/reports/${reportId}/status`, data);
  return response.data;
};

/**
 * List disputes filed (moderators/admins)
 */
export const getDisputes = async (params = {}) => {
  const response = await api.get('/moderation/disputes', { params });
  return response.data;
};

/**
 * Resolve dispute (moderators/admins)
 */
export const resolveDispute = async (disputeId, data) => {
  const response = await api.put(`/moderation/disputes/${disputeId}/resolve`, data);
  return response.data;
};
