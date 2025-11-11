import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:8000/api';

  // Function to get CSRF token
  const getCSRFToken = async () => {
    try {
      const response = await axios.get(`${API_BASE}/auth/csrf/`, {
        withCredentials: true
      });
      return response.data.csrfToken;
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
      return null;
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const csrfToken = await getCSRFToken();
      const response = await axios.get(`${API_BASE}/auth/check/`, {
        withCredentials: true,
        headers: csrfToken ? { 'X-CSRFToken': csrfToken } : {}
      });
      if (response.data.authenticated) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const csrfToken = await getCSRFToken();
      
      const response = await axios.post(`${API_BASE}/auth/login/`, {
        username,
        password
      }, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json'
        }
      });
      
      setUser(response.data.user);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const csrfToken = await getCSRFToken();
      
      const response = await axios.post(`${API_BASE}/auth/register/`, userData, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json'
        }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      const csrfToken = await getCSRFToken();
      
      await axios.post(`${API_BASE}/auth/logout/`, {}, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};