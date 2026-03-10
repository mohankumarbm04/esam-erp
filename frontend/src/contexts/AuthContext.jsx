import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for stored token on initial load
  useEffect(() => {
    const storedToken =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedUser =
      localStorage.getItem('user') || sessionStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function - calls real backend API
  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    setError(null);

    try {
      const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const data = isJson ? await response.json() : null;

      if (!response.ok || !data?.success) {
        if (!isJson) {
          const text = await response.text();
          throw new Error(
            `Login failed: server returned non-JSON response (${response.status}). ${text.slice(0, 120)}`,
          );
        }
        throw new Error(data?.error || 'Login failed');
      }

      const { token: receivedToken, user: userData } = data;

      if (!receivedToken || !userData) {
        throw new Error('Invalid response from server');
      }

      // Store based on remember me
      if (rememberMe) {
        localStorage.setItem('token', receivedToken);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('token', receivedToken);
        sessionStorage.setItem('user', JSON.stringify(userData));
      }

      setToken(receivedToken);
      setUser(userData);

      return { success: true, role: userData.role };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        success: true,
        message: 'Registration successful! Please check your email to verify.',
      };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Forgot password
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        success: true,
        message: 'Password reset link sent to your email!',
      };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        success: true,
        message: 'Password reset successful! Please login with your new password.',
      };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    clearError,
    isAuthenticated: !!user,
    role: user?.role || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
