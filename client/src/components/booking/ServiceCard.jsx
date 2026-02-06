const ServiceCard = ({ service, onSelect }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={onSelect}>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
      <p className="text-gray-600 mb-4">{service.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-blue-600">${service.price}</span>
        <span className="text-sm text-gray-500">{service.duration} min</span>
      </div>
    </div>
  );
};

export default ServiceCard;
