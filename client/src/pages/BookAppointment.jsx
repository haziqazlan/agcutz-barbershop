import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentsAPI } from '../services/api';

const BookAppointment = () => {
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
      zip: '',
    },
  });

  useEffect(() => {
    if (formData.date) {
      fetchAvailableSlots(formData.date);
    }
  }, [formData.date]);

  const fetchAvailableSlots = async (date) => {
    try {
      const response = await appointmentsAPI.getAvailableSlots(date);
      setAvailableSlots(response.data.availableSlots);
    } catch (err) {
      console.error('Error fetching slots:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await appointmentsAPI.create(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card p-12 max-w-md text-center">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="font-display text-3xl font-bold mb-4 text-barber-red">
            Booking Confirmed!
          </h2>
          <p className="text-barber-dark/70 mb-6">
            We've received your appointment request. You'll receive a confirmation email shortly.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="section-title mb-4">Book Your Appointment</h1>
          <p className="text-xl text-barber-dark/70">Fill out the form below to reserve your time slot</p>
          <div className="inline-block border-t-4 border-barber-gold w-32 mt-6"></div>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-barber-red/10 border-2 border-barber-red text-barber-red px-4 py-3 rounded-none">
                {error}
              </div>
            )}

            {/* Personal Information */}
            <div>
              <h3 className="font-display text-2xl font-bold mb-4">Personal Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Appointment Type */}
            <div>
              <h3 className="font-display text-2xl font-bold mb-4">Appointment Type *</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <label className={`cursor-pointer border-2 p-6 transition-all ${
                  formData.appointmentType === 'inPerson'
                    ? 'border-barber-red bg-barber-red/5'
                    : 'border-barber-dark hover:border-barber-red'
                }`}>
                  <input
                    type="radio"
                    name="appointmentType"
                    value="inPerson"
                    checked={formData.appointmentType === 'inPerson'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <span className="font-semibold">In-Person</span>
                  <p className="text-sm text-barber-dark/70 mt-2">Visit our barbershop</p>
                </label>

                <label className={`cursor-pointer border-2 p-6 transition-all ${
                  formData.appointmentType === 'outcall'
                    ? 'border-barber-red bg-barber-red/5'
                    : 'border-barber-dark hover:border-barber-red'
                }`}>
                  <input
                    type="radio"
                    name="appointmentType"
                    value="outcall"
                    checked={formData.appointmentType === 'outcall'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <span className="font-semibold">Outcall Service</span>
                  <p className="text-sm text-barber-dark/70 mt-2">We come to you</p>
                </label>
              </div>
            </div>

            {/* Address for Outcall */}
            {formData.appointmentType === 'outcall' && (
              <div className="bg-barber-blue/5 p-6 border-2 border-barber-blue">
                <h3 className="font-display text-2xl font-bold mb-4">Service Address *</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold mb-2">Street Address</label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-2">City</label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">Zip Code</label>
                      <input
                        type="text"
                        name="address.zip"
                        value={formData.address.zip}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Date and Time */}
            <div>
              <h3 className="font-display text-2xl font-bold mb-4">Select Date & Time *</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={getMinDate()}
                    className="input-field"
                    required
                  />
                </div>

                {formData.date && (
                  <div>
                    <label className="block font-semibold mb-2">Available Time Slots</label>
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {availableSlots.map(slot => (
                          <label
                            key={slot}
                            className={`cursor-pointer border-2 p-3 text-center transition-all ${
                              formData.timeSlot === slot
                                ? 'border-barber-red bg-barber-red text-white'
                                : 'border-barber-dark hover:border-barber-red'
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
                            <span className="font-semibold">{slot}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-barber-dark/70 p-4 bg-barber-cream border-2 border-barber-dark/20">
                        No available slots for this date. Please choose another day.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Price Display */}
            <div className="bg-barber-gold/10 border-2 border-barber-gold p-6">
              <div className="flex justify-between items-center">
                <span className="font-display text-2xl font-bold">Total Price:</span>
                <span className="text-4xl font-bold text-barber-red">$15</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.timeSlot}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
