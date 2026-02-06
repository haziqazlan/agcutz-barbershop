import Appointment from '../models/Appointment.js';
import { isValidTimeSlot, availableTimeSlots } from '../utils/timeSlots.js';

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
export const createAppointment = async (req, res) => {
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

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !appointmentType || !date || !timeSlot) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate appointment type
    if (!['inPerson', 'outcall'].includes(appointmentType)) {
      return res.status(400).json({ message: 'Invalid appointment type' });
    }

    // Validate time slot
    if (!isValidTimeSlot(timeSlot)) {
      return res.status(400).json({ message: 'Invalid time slot' });
    }

    // Validate address for outcall appointments
    if (appointmentType === 'outcall') {
      if (!address || !address.street || !address.city || !address.zip) {
        return res.status(400).json({ 
          message: 'Address (street, city, zip) is required for outcall appointments' 
        });
      }
    }

    // Check if time slot is already booked
    const existingAppointment = await Appointment.findOne({
      date: new Date(date),
      timeSlot,
      status: 'upcoming',
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
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

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all appointments (admin only)
// @route   GET /api/appointments
// @access  Private
export const getAppointments = async (req, res) => {
  try {
    const { date, status } = req.query;
    
    let query = {};

    // Filter by date if provided
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      query.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query).sort({ date: 1, timeSlot: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available time slots for a specific date
// @route   GET /api/appointments/available-slots/:date
// @access  Public
export const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.params;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    // Get all booked slots for the date
    const bookedAppointments = await Appointment.find({
      date: new Date(date),
      status: 'upcoming',
    }).select('timeSlot');

    const bookedSlots = bookedAppointments.map(apt => apt.timeSlot);

    // Filter out booked slots from available slots
    const availableSlots = availableTimeSlots.filter(
      slot => !bookedSlots.includes(slot)
    );

    res.json({ availableSlots, bookedSlots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private
export const updateAppointment = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['upcoming', 'completed', 'canceled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await appointment.deleteOne();

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
