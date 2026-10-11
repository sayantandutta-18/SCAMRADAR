import { useState, useCallback } from 'react';

// Generic hook for API calls with loading/error/data states
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (apiCall, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorInfo = {
        status: err.status || 500,
        message: err.message || 'Something went wrong',
        errors: err.errors || [],
        existingReport: err.existingReport || null,
      };
      setError(errorInfo);
      throw errorInfo;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { loading, error, data, execute, reset, setData };
};
