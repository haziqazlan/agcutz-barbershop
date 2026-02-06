import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import appointmentService from '../services/appointmentService';

const BookingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    appointmentType: 'inPerson',
    date: '',
    timeSlot: '',
    address: {
      street: '',
      city: '',
      zipCode: '',
    },
  });

  // Fetch available slots when date changes
  useEffect(() => {
    if (formData.date) {
      fetchAvailableSlots(formData.date);
    }
  }, [formData.date]);

  const fetchAvailableSlots = async (date) => {
    try {
      const response = await appointmentService.getAvailableSlots(date);
      setAvailableSlots(response.data.availableSlots);
    } catch (err) {
      console.error('Failed to fetch available slots:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear time slot when date changes
    if (name === 'date') {
      setFormData((prev) => ({ ...prev, timeSlot: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const appointmentData = {
        ...formData,
        address: formData.appointmentType === 'outcall' ? formData.address : undefined,
      };

      await appointmentService.createAppointment(appointmentData);
      setSuccess(true);

      // Reset form
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
        <div className="card max-w-md text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked!</h2>
          <p className="text-gray-600 mb-6">
            Your appointment has been successfully scheduled. You'll receive a confirmation email shortly.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-gray-300 hover:text-white mb-4 inline-flex items-center"
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Book Your Appointment</h1>
          <p className="text-gray-300">Fill out the form below to schedule your haircut</p>
        </div>

        {/* Booking Form */}
        <div className="card bg-white">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Appointment Type */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Type</h3>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                    formData.appointmentType === 'inPerson'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="appointmentType"
                    value="inPerson"
                    checked={formData.appointmentType === 'inPerson'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-3xl mb-2">🏠</div>
                    <div className="font-semibold">In-Shop</div>
                    <div className="text-sm text-gray-600">Visit our location</div>
                  </div>
                </label>

                <label
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                    formData.appointmentType === 'outcall'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="appointmentType"
                    value="outcall"
                    checked={formData.appointmentType === 'outcall'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-3xl mb-2">🚗</div>
                    <div className="font-semibold">Outcall</div>
                    <div className="text-sm text-gray-600">We come to you</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Address (for outcall) */}
            {formData.appointmentType === 'outcall' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Address</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      required={formData.appointmentType === 'outcall'}
                      className="input-field"
                      placeholder="123 Main St"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        required={formData.appointmentType === 'outcall'}
                        className="input-field"
                        placeholder="New York"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zip Code *
                      </label>
                      <input
                        type="text"
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleChange}
                        required={formData.appointmentType === 'outcall'}
                        className="input-field"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Date and Time */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date & Time</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={getMinDate()}
                    required
                    className="input-field"
                  />
                </div>

                {formData.date && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Slot *
                    </label>
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots.map((slot) => (
                          <label
                            key={slot}
                            className={`cursor-pointer border-2 rounded-lg p-3 text-center transition-all ${
                              formData.timeSlot === slot
                                ? 'border-primary-600 bg-primary-50 font-semibold'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <input
                              type="radio"
                              name="timeSlot"
                              value={slot}
                              checked={formData.timeSlot === slot}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            {slot}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No available slots for this date
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Price Display */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Total Price:</span>
                <span className="text-2xl font-bold text-primary-600">$15</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || availableSlots.length === 0}
              className="btn-primary w-full"
            >
              {loading ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
