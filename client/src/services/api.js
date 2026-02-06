import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  },
};

export const appointmentsAPI = {
  create: (appointmentData) => api.post('/appointments', appointmentData),
  getAvailableSlots: (date) => api.get(`/appointments/available-slots?date=${date}`),
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/appointments${params ? `?${params}` : ''}`);
  },
  getById: (id) => api.get(`/appointments/${id}`),
  updateStatus: (id, status) => api.put(`/appointments/${id}`, { status }),
  delete: (id) => api.delete(`/appointments/${id}`),
};

export default api;
