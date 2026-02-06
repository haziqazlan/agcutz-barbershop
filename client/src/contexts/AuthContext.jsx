import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const response = await authService.getCurrentAdmin();
          setAdmin(response.data.admin);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth check failed:', error);
          authService.logout();
          setIsAuthenticated(false);
          setAdmin(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setIsAuthenticated(true);
    setAdmin(response.data.admin);
    return response;
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setAdmin(null);
  };

  const value = {
    isAuthenticated,
    admin,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
