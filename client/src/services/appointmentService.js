import api from './api';

export const appointmentService = {
  // Create new appointment (public)
  createAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  // Get available time slots for a date (public)
  getAvailableSlots: async (date) => {
    const response = await api.get(`/appointments/availability/${date}`);
    return response.data;
  },

  // Get all appointments (admin)
  getAllAppointments: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.date) params.append('date', filters.date);
    if (filters.status) params.append('status', filters.status);
    
    const response = await api.get(`/appointments?${params.toString()}`);
    return response.data;
  },

  // Get single appointment (admin)
  getAppointment: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  // Update appointment status (admin)
  updateAppointmentStatus: async (id, status) => {
    const response = await api.patch(`/appointments/${id}`, { status });
    return response.data;
  },

  // Delete appointment (admin)
  deleteAppointment: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },
};

export default appointmentService;
