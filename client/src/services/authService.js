import api from './api';

export const authService = {
  // Login admin
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('adminToken', response.data.data.token);
      localStorage.setItem('adminEmail', response.data.data.admin.email);
    }
    return response.data;
  },

  // Logout admin
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
  },

  // Check if admin is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },

  // Get current admin
  getCurrentAdmin: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Setup initial admin account
  setupAdmin: async (email, password) => {
    const response = await api.post('/auth/setup', { email, password });
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('adminToken', response.data.data.token);
      localStorage.setItem('adminEmail', response.data.data.admin.email);
    }
    return response.data;
  },
};

export default authService;
