import { useState, useCallback } from 'react';

// Generic hook for API calls with loading/error/data states
export const useApi = (defaultApiCall) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(
    async (...args) => {
      let fn = defaultApiCall;
      let callArgs = args;

      if (typeof args[0] === 'function') {
        fn = args[0];
        callArgs = args.slice(1);
      }

      if (typeof fn !== 'function') {
        const noFnError = {
          status: 400,
          message: 'No API function provided to execute',
          errors: [],
          existingReport: null,
        };
        setError(noFnError);
        throw noFnError;
      }

      setLoading(true);
      setError(null);
      try {
        const result = await fn(...callArgs);
        setData(result);
        return result;
      } catch (err) {
        const errorInfo = {
          status: err.status || 500,
          message: err.message || 'Something went wrong',
          errors: err.errors || [],
          existingReport: err.existingReport || err.data?.existingReport || null,
          data: err.data || null,
        };
        setError(errorInfo);
        throw errorInfo;
      } finally {
        setLoading(false);
      }
    },
    [defaultApiCall]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { loading, error, data, execute, reset, setData };
};

export default useApi;
