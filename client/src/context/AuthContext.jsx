import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in on mount
    const token = localStorage.getItem('token');
    const savedAdmin = localStorage.getItem('admin');
    
    if (token && savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    const { token, ...adminData } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('admin', JSON.stringify(adminData));
    setAdmin(adminData);
    
    return response;
  };

  const logout = () => {
    authAPI.logout();
    setAdmin(null);
  };

  const value = {
    admin,
    isAuthenticated: !!admin,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
