import express from 'express';
import {
  createAppointment,
  getAllAppointments,
  getAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getAvailableSlots,
} from '../controllers/appointmentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', createAppointment);
router.get('/availability/:date', getAvailableSlots);

// Protected routes (Admin only)
router.get('/', authMiddleware, getAllAppointments);
router.get('/:id', authMiddleware, getAppointment);
router.patch('/:id', authMiddleware, updateAppointmentStatus);
router.delete('/:id', authMiddleware, deleteAppointment);

export default router;
