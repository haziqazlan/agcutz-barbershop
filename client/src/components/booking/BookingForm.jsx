import { useState, useEffect } from 'react';
import { format, addDays, startOfDay } from 'date-fns';
import api from '../../utils/api';

const BookingForm = ({ selectedService, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    date: '',
    timeSlot: '',
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate next 14 days for date selection (excluding Sundays)
  const generateAvailableDates = () => {
    const dates = [];
    let currentDate = startOfDay(new Date());
    
    while (dates.length < 14) {
      // Skip Sundays (0 = Sunday)
      if (currentDate.getDay() !== 0) {
        dates.push(currentDate);
      }
      currentDate = addDays(currentDate, 1);
    }
    
    return dates;
  };

  const availableDates = generateAvailableDates();

  // Fetch available time slots when date changes
  useEffect(() => {
    if (formData.date) {
      fetchAvailableSlots(formData.date);
    }
  }, [formData.date]);

  const fetchAvailableSlots = async (date) => {
    try {
      const response = await api.get('/appointments/available-slots', {
        params: { date }
      });
      
      if (response.data.success) {
        setAvailableSlots(response.data.data.availableSlots);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      setError('Failed to load available time slots');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/appointments', {
        ...formData,
        service: selectedService.id,
      });

      if (response.data.success) {
        onSuccess(response.data.data);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Booking failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Book Your Appointment
      </h2>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900">{selectedService.name}</h3>
        <p className="text-blue-700 text-sm">{selectedService.description}</p>
        <p className="text-blue-900 font-bold mt-2">
          ${selectedService.price} • {selectedService.duration} minutes
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name *
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
            Select Date *
          </label>
          <select
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="input-field"
          >
            <option value="">Choose a date</option>
            {availableDates.map((date) => (
              <option key={date.toISOString()} value={date.toISOString()}>
                {format(date, 'EEEE, MMMM d, yyyy')}
              </option>
            ))}
          </select>
        </div>

        {formData.date && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Time *
            </label>
            {availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setFormData({ ...formData, timeSlot: slot })}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      formData.timeSlot === slot
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No available slots for this date
              </p>
            )}
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
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
  );
};

export default BookingForm;
