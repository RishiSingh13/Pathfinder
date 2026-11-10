import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setCsrfToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const res = await api.auth.me();
      if (res.data && res.data.authenticated && res.data.user) {
        setUser(res.data.user);
        if (res.data.csrfToken) setCsrfToken(res.data.csrfToken);
      } else {
        setUser(null);
      }
      setError(null);
    } catch (err) {
      console.warn('[AuthContext] Session check:', err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.auth.login({ email, password });
      const userData = res.data?.user || res.user;
      setUser(userData);
      if (res.data?.csrfToken) setCsrfToken(res.data.csrfToken);
      return { success: true, user: userData };
    } catch (err) {
      const message = err.message || 'Login failed.';
      setError(message);
      return { success: false, message, fields: err.fields };
    }
  };

  const register = async (displayName, email, password) => {
    setError(null);
    try {
      const res = await api.auth.register({ displayName, email, password });
      const userData = res.data?.user || res.user;
      setUser(userData);
      if (res.data?.csrfToken) setCsrfToken(res.data.csrfToken);
      return { success: true, user: userData };
    } catch (err) {
      const message = err.message || 'Registration failed.';
      setError(message);
      return { success: false, message, fields: err.fields };
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (err) {
      console.error('[AuthContext] Logout error:', err);
    } finally {
      setUser(null);
      setError(null);
    }
  };

  const deleteAccount = async (password) => {
    try {
      await api.auth.deleteAccount(password);
      setUser(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    deleteAccount,
    refreshUser: checkAuth,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
