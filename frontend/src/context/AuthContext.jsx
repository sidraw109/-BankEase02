import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, getToken, setToken, mapUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(() => getToken());
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken());
  const [loading, setLoading] = useState(() => !!getToken());

  // Restore session on load if a token exists.
  const refreshUser = useCallback(async () => {
    const t = getToken();
    if (!t) {
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
    try {
      const res = await api.getProfile();
      const mapped = mapUser(res.data);
      setUser((prev) => ({ ...(prev || {}), ...mapped }));
      setIsAuthenticated(true);
      return mapped;
    } catch (err) {
      // Token invalid/expired -> clear session.
      setToken(null);
      setTokenState(null);
      setUser(null);
      setIsAuthenticated(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (getToken()) refreshUser();
  }, [refreshUser]);

  const applyAuth = (data) => {
    setToken(data.accessToken);
    setTokenState(data.accessToken);
    const mapped = mapUser(data.user);
    setUser(mapped);
    setIsAuthenticated(true);
    if (data.remember !== undefined) {
      if (data.remember) localStorage.setItem('bankease_remember', data.user?.email || '');
      else localStorage.removeItem('bankease_remember');
    }
    return mapped;
  };

  // Real backend login. `identifier` must be the registered email.
  const login = async (identifier, password, remember = false) => {
    if (!identifier || !password) {
      return { success: false, error: 'Please enter both Email and Password.' };
    }
    try {
      const res = await api.login(identifier.trim(), password);
      applyAuth({ ...res.data, remember });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed.' };
    }
  };

  // Real backend registration.
  const register = async (payload) => {
    try {
      const res = await api.register(payload);
      applyAuth(res.data);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Registration failed.',
        fieldErrors: err.payload && err.payload.success === false && err.payload.data && typeof err.payload.data === 'object' ? err.payload.data : null,
      };
    }
  };

  const logout = () => {
    setToken(null);
    setTokenState(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('bankease_remember');
  };

  // No profile-update endpoint on the backend; keep a local override layer.
  const updateProfile = (updatedFields) => {
    setUser((prev) => ({ ...(prev || {}), ...updatedFields }));
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, loading, login, register, logout, updateProfile, refreshUser }}
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
