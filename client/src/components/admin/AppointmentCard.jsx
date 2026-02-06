import { format } from 'date-fns';

const AppointmentCard = ({ appointment, onStatusChange, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatService = (serviceId) => {
    const serviceNames = {
      'haircut': 'Classic Haircut',
      'fade': 'Fade Haircut',
      'beard-trim': 'Beard Trim',
      'haircut-beard': 'Haircut & Beard',
      'kids-haircut': "Kids' Haircut",
      'buzz-cut': 'Buzz Cut',
    };
    return serviceNames[serviceId] || serviceId;
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {appointment.customerName}
          </h3>
          <p className="text-sm text-gray-600">{appointment.customerEmail}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
          {appointment.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm">
          <span className="font-medium text-gray-700 w-20">Service:</span>
          <span className="text-gray-600">{formatService(appointment.service)}</span>
        </div>
        <div className="flex items-center text-sm">
          <span className="font-medium text-gray-700 w-20">Date:</span>
          <span className="text-gray-600">
            {format(new Date(appointment.date), 'MMM d, yyyy')}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <span className="font-medium text-gray-700 w-20">Time:</span>
          <span className="text-gray-600">{appointment.timeSlot}</span>
        </div>
      </div>

      {appointment.status === 'upcoming' && (
        <div className="flex gap-2 pt-4 border-t">
          <button
            onClick={() => onStatusChange(appointment._id, 'completed')}
            className="btn-success flex-1 text-sm py-1.5"
          >
            Complete
          </button>
          <button
            onClick={() => onStatusChange(appointment._id, 'canceled')}
            className="btn-danger flex-1 text-sm py-1.5"
          >
            Cancel
          </button>
        </div>
      )}

      {appointment.status !== 'upcoming' && (
        <div className="pt-4 border-t">
          <button
            onClick={() => onDelete(appointment._id)}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Delete Appointment
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
