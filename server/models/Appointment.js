import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    customerEmail: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    customerPhone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[\d\s\-\+\(\)]+$/, 'Please provide a valid phone number'],
    },
    appointmentType: {
      type: String,
      required: [true, 'Appointment type is required'],
      enum: {
        values: ['inPerson', 'outcall'],
        message: 'Appointment type must be either inPerson or outcall',
      },
    },
    address: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      zip: {
        type: String,
        trim: true,
      },
    },
    date: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
      match: [/^\d{2}:\d{2}$/, 'Time slot must be in HH:MM format'],
    },
    price: {
      type: Number,
      default: 15,
      required: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'canceled'],
      default: 'upcoming',
    },
  },
  {
    timestamps: true,
  }
);

// Validate address is provided for outcall appointments
appointmentSchema.pre('save', function (next) {
  if (this.appointmentType === 'outcall') {
    if (!this.address || !this.address.street || !this.address.city || !this.address.zip) {
      return next(new Error('Address is required for outcall appointments'));
    }
  }
  next();
});

// Create compound index to prevent double booking
appointmentSchema.index({ date: 1, timeSlot: 1 }, { unique: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
