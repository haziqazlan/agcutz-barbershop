import express from 'express';
import Appointment from '../models/Appointment.js';
import { protect } from '../middleware/auth.js';
import { appointmentValidation, validate } from '../middleware/validation.js';
import { sendBookingNotification } from '../utils/emailService.js';

const router = express.Router();
// const { sendBookingNotification } = require('../utils/emailService');

// @route   POST /api/appointments
// @desc    Create a new appointment (public)
// @access  Public
router.post('/', appointmentValidation, validate, async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      appointmentType,
      address,
      date,
      timeSlot,
    } = req.body;

    // Check if time slot is already booked
    const existingAppointment = await Appointment.findOne({
      date: new Date(date),
      timeSlot,
      status: { $ne: 'canceled' },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: 'This time slot is already booked. Please choose another time.',
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      customerName,
      customerEmail,
      customerPhone,
      appointmentType,
      address: appointmentType === 'outcall' ? address : undefined,
      date: new Date(date),
      timeSlot,
      price: 15,
      status: 'upcoming',
    });

    // Send email notification (non-blocking - don't wait for it)
    sendBookingNotification(appointment).catch(err => 
      console.error('Email notification failed:', err.message)
    );

    res.status(201).json({
      message: 'Appointment booked successfully!',
      appointment,
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    
    // Handle duplicate key error (double booking)
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'This time slot is already booked. Please choose another time.',
      });
    }

    res.status(500).json({ message: 'Failed to create appointment. Please try again.' });
  }
});

// @route   GET /api/appointments
// @desc    Get all appointments (with optional date filter)
// @access  Private (Admin only)
router.get('/', protect, async (req, res) => {
  try {
    const { date, status } = req.query;
    
    let query = {};

    // Filter by date if provided
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.date = {
        $gte: searchDate,
        $lt: nextDay,
      };
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query).sort({ date: 1, timeSlot: 1 });

    res.json({
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Failed to retrieve appointments' });
  }
});

// @route   GET /api/appointments/available-slots
// @desc    Get available time slots for a specific date
// @access  Public
router.get('/available-slots', async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    const searchDate = new Date(date);
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Find all booked appointments for the date
    const bookedAppointments = await Appointment.find({
      date: {
        $gte: searchDate,
        $lt: nextDay,
      },
      status: { $ne: 'canceled' },
    }).select('timeSlot');

    const bookedSlots = bookedAppointments.map(apt => apt.timeSlot);

    // Available time slots: 12pm-9pm (noon to 9pm)
    const allSlots = [
      '12:00', '13:00', '14:00', '15:00', '16:00', 
      '17:00', '18:00', '19:00', '20:00', '21:00'
    ];

    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({
      date: searchDate,
      availableSlots,
      bookedSlots,
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({ message: 'Failed to retrieve available slots' });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get single appointment
// @access  Private (Admin only)
router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Get appointment error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.status(500).json({ message: 'Failed to retrieve appointment' });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment status
// @access  Private (Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['upcoming', 'completed', 'canceled'].includes(status)) {
      return res.status(400).json({
        message: 'Valid status is required (upcoming, completed, or canceled)',
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      message: 'Appointment status updated successfully',
      appointment,
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.status(500).json({ message: 'Failed to update appointment' });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Delete appointment
// @access  Private (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await appointment.deleteOne();

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Delete appointment error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.status(500).json({ message: 'Failed to delete appointment' });
  }
});

export default router;
