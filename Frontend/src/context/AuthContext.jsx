import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMe, updatePreferences } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('scamradar_token') || null);
  const [loading, setLoading] = useState(true);

  // Restore authenticated session on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('scamradar_token');
      if (storedToken) {
        try {
          const res = await getMe();
          if (res.success && res.data) {
            setUser(res.data);
          } else {
            // Invalid session
            localStorage.removeItem('scamradar_token');
            setUser(null);
            setToken(null);
          }
        } catch (err) {
          console.warn('Session expired or invalid, logging out:', err.message);
          localStorage.removeItem('scamradar_token');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    if (res.success && res.data) {
      localStorage.setItem('scamradar_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.message || 'Authentication failed');
  };

  const register = async (userData) => {
    const res = await registerUser(userData);
    if (res.success && res.data) {
      localStorage.setItem('scamradar_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('scamradar_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await getMe();
      if (res.success && res.data) {
        setUser(res.data);
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  const updateAlertPreferences = async (newPrefs) => {
    const res = await updatePreferences(newPrefs);
    if (res.success && res.data) {
      setUser((prev) => (prev ? { ...prev, alertPreferences: res.data } : null));
      return res.data;
    }
    throw new Error(res.message || 'Failed to update preferences');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        role: user?.role || 'GUEST',
        isModerator: user?.role === 'MODERATOR' || user?.role === 'ADMIN',
        isAdmin: user?.role === 'ADMIN',
        loading,
        login,
        register,
        logout,
        refreshUser,
        updateAlertPreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
