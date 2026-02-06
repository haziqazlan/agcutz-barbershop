const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Service price is required'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Service duration is required'],
    min: [15, 'Duration must be at least 15 minutes']
  },
  serviceId: {
    type: String,
    required: true,
    unique: true
  },
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Service', serviceSchema);
