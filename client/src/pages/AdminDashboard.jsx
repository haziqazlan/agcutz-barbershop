import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentsAPI } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    } else {
      fetchAppointments();
    }
  }, [isAuthenticated, navigate, filterDate, filterStatus]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (filterDate) filters.date = filterDate;
      if (filterStatus) filters.status = filterStatus;

      const response = await appointmentsAPI.getAll(filters);
      setAppointments(response.data.appointments);
    } catch (err) {
      setError('Failed to load appointments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await appointmentsAPI.updateStatus(id, newStatus);
      fetchAppointments();
    } catch (err) {
      alert('Failed to update appointment status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentsAPI.delete(id);
        fetchAppointments();
      } catch (err) {
        alert('Failed to delete appointment');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-barber-blue text-white';
      case 'completed':
        return 'bg-green-600 text-white';
      case 'canceled':
        return 'bg-barber-dark/50 text-white';
      default:
        return 'bg-barber-dark/20';
    }
  };

  return (
    <div className="min-h-screen bg-barber-cream">
      <header className="bg-barber-dark text-barber-cream border-b-4 border-barber-gold">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-barber-cream/70">Manage your appointments</p>
            </div>
            <button onClick={handleLogout} className="btn-secondary bg-white">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="card p-6 mb-8">
          <h2 className="font-display text-2xl font-bold mb-4">Filters</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-2">Filter by Date</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
              >
                <option value="">All Statuses</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterDate('');
                  setFilterStatus('');
                }}
                className="btn-secondary w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 bg-barber-blue text-white">
            <h3 className="text-lg font-semibold mb-2">Total Appointments</h3>
            <p className="text-4xl font-bold">{appointments.length}</p>
          </div>
          <div className="card p-6 bg-green-600 text-white">
            <h3 className="text-lg font-semibold mb-2">Upcoming</h3>
            <p className="text-4xl font-bold">
              {appointments.filter(a => a.status === 'upcoming').length}
            </p>
          </div>
          <div className="card p-6 bg-barber-gold text-barber-dark">
            <h3 className="text-lg font-semibold mb-2">Completed</h3>
            <p className="text-4xl font-bold">
              {appointments.filter(a => a.status === 'completed').length}
            </p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-2xl font-bold mb-6">Appointments</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-barber-red border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-barber-dark/70">Loading appointments...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-barber-red">{error}</div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 text-barber-dark/70">
              No appointments found
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="border-2 border-barber-dark p-6 hover:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-shadow"
                >
                  <div className="grid md:grid-cols-4 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{appointment.customerName}</h3>
                      <p className="text-sm text-barber-dark/70">{appointment.customerEmail}</p>
                      <p className="text-sm text-barber-dark/70">{appointment.customerPhone}</p>
                    </div>

                    <div>
                      <p className="font-semibold mb-1">Date & Time</p>
                      <p className="text-barber-dark/70">{formatDate(appointment.date)}</p>
                      <p className="text-barber-dark/70">{appointment.timeSlot}</p>
                      <p className="mt-2">
                        <span className={`px-3 py-1 text-sm font-semibold ${
                          appointment.appointmentType === 'outcall'
                            ? 'bg-barber-blue/20 text-barber-blue'
                            : 'bg-barber-red/20 text-barber-red'
                        }`}>
                          {appointment.appointmentType === 'outcall' ? 'Outcall' : 'In-Person'}
                        </span>
                      </p>
                    </div>

                    <div>
                      {appointment.appointmentType === 'outcall' && appointment.address && (
                        <>
                          <p className="font-semibold mb-1">Service Address</p>
                          <p className="text-sm text-barber-dark/70">{appointment.address.street}</p>
                          <p className="text-sm text-barber-dark/70">
                            {appointment.address.city}, {appointment.address.zip}
                          </p>
                        </>
                      )}
                      <p className="mt-2 text-lg font-bold text-barber-red">${appointment.price}</p>
                    </div>

                    <div className="space-y-2">
                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusUpdate(appointment._id, e.target.value)}
                        className={`w-full px-3 py-2 border-2 border-barber-dark rounded-none font-semibold ${getStatusColor(appointment.status)}`}
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                        <option value="canceled">Canceled</option>
                      </select>

                      <button
                        onClick={() => handleDelete(appointment._id)}
                        className="w-full px-3 py-2 bg-barber-red text-white font-semibold hover:bg-opacity-90 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
