import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-barber-red via-white to-barber-blue w-12 h-12 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✂️</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Classic Cuts Barbershop</h1>
            </div>
            <button
              onClick={() => navigate('/admin/login')}
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              Admin
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Premium Haircuts,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-barber-red to-barber-blue">
              Your Place or Ours
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Professional barbering service with the convenience of outcall appointments
          </p>
          <button
            onClick={() => navigate('/book')}
            className="btn-primary text-lg px-12 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Book Your Appointment
          </button>
        </div>
      </section>

      {/* Service Card */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="card bg-white/10 backdrop-blur-md border border-gray-700">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">Standard Haircut</h3>
              <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-barber-red to-barber-blue">
                $15
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-6 border border-gray-600">
                <h4 className="text-xl font-semibold text-white mb-3">🏠 In-Shop Service</h4>
                <p className="text-gray-300">
                  Visit our shop for a classic barbershop experience with quality cuts in a comfortable environment.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6 border border-gray-600">
                <h4 className="text-xl font-semibold text-white mb-3">🚗 Outcall Service</h4>
                <p className="text-gray-300">
                  We come to you! Enjoy professional barbering services at your home or office location.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-white/10 backdrop-blur-md border border-gray-700 text-center">
            <h3 className="text-2xl font-bold text-white mb-6">Business Hours</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Monday - Friday</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Saturday</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Sunday</span>
                <span className="text-gray-500">Closed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm border-t border-gray-700 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2024 Classic Cuts Barbershop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
