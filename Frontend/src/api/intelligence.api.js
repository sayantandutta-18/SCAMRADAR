import api from './axios';

/**
 * Extract text from screenshot via backend OCR
 */
export const scanScreenshotOcr = async ({ imageBase64, mimeType }) => {
  const response = await api.post('/intelligence/scan-ocr', { imageBase64, mimeType });
  return response.data;
};

/**
 * Analyze suspicious text / message content for scam indicators
 */
export const analyzeEvidenceText = async ({ text, context = 'manual' }) => {
  const response = await api.post('/intelligence/analyze-evidence', { text, context });
  return response.data;
};

/**
 * Analyze URL for structure, TLD risk, spoofed brands, and reputation with SSRF guard
 */
export const analyzeUrlIntelligence = async ({ url }) => {
  const response = await api.post('/intelligence/analyze-url', { url });
  return response.data;
};

/**
 * Analyze email body content and optional RFC 822/5322 headers
 */
export const analyzeEmailIntelligence = async ({ emailContent, emailHeaders = '' }) => {
  const response = await api.post('/intelligence/analyze-email', { emailContent, emailHeaders });
  return response.data;
};

/**
 * Retrieve scam pattern correlation graph nodes and edges
 */
export const getScamPatternGraph = async ({ scamType, city, riskLevel, limit = 35 } = {}) => {
  const params = { limit };
  if (scamType) params.scamType = scamType;
  if (city) params.city = city;
  if (riskLevel) params.riskLevel = riskLevel;

  const response = await api.get('/intelligence/patterns', { params });
  return response.data;
};
