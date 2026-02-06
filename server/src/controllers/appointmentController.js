import Appointment from '../models/Appointment.js';

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
export const createAppointment = async (req, res, next) => {
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
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Validate address for outcall appointments
    if (appointmentType === 'outcall') {
      if (!address || !address.street || !address.city || !address.zipCode) {
        return res.status(400).json({
          success: false,
          message: 'Complete address is required for outcall appointments',
        });
      }
    }

    // Check if time slot is already booked
    const existingAppointment = await Appointment.findOne({
      date: new Date(date),
      timeSlot,
      status: { $ne: 'canceled' }, // Exclude canceled appointments
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
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

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: { appointment },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments (with optional filters)
// @route   GET /api/appointments
// @access  Private (Admin only)
export const getAllAppointments = async (req, res, next) => {
  try {
    const { date, status } = req.query;

    // Build filter object
    const filter = {};

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      filter.date = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    if (status) {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter).sort({ date: 1, timeSlot: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: { appointments },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private (Admin only)
export const getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { appointment },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id
// @access  Private (Admin only)
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['upcoming', 'completed', 'canceled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be upcoming, completed, or canceled',
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment status updated',
      data: { appointment },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private (Admin only)
export const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available time slots for a specific date
// @route   GET /api/appointments/availability/:date
// @access  Public
export const getAvailableSlots = async (req, res, next) => {
  try {
    const { date } = req.params;

    // Define business hours (9 AM to 6 PM, 30-minute slots)
    const businessHours = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    ];

    // Get booked appointments for this date
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const bookedAppointments = await Appointment.find({
      date: {
        $gte: startDate,
        $lt: endDate,
      },
      status: { $ne: 'canceled' },
    }).select('timeSlot');

    const bookedSlots = bookedAppointments.map((apt) => apt.timeSlot);

    // Filter out booked slots
    const availableSlots = businessHours.filter((slot) => !bookedSlots.includes(slot));

    res.status(200).json({
      success: true,
      data: {
        date,
        availableSlots,
        bookedSlots,
      },
    });
  } catch (error) {
    next(error);
  }
};
