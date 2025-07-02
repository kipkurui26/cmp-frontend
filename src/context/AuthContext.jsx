import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance, { setupTokenRefresh } from '../utils/AxiosInstance';
import { useToast } from '../context/ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Check authentication status on mount
  useEffect(() => {
    // Always fetch CSRF token on mount
    axiosInstance.get('/auth/csrf/').finally(() => {
    const checkAuth = async () => {
      // Skip auth check if we're on the login or register page
      if (['/login', '/register'].includes(window.location.pathname)) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get('/auth/user/');
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        showToast("Authentication failed. Please log in again.", "error");
        // Redirect to login only if not already there
        if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
    });
  }, []);

  useEffect(() => {
    let cleanup;
    if (isAuthenticated) {
      cleanup = setupTokenRefresh();
    }
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [isAuthenticated]);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      // Attempt to call the backend logout endpoint
      await axiosInstance.post('/auth/logout/');
    } catch (error) {
      showToast("Logout failed. Please try again.", "error");
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/login'; 
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
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
