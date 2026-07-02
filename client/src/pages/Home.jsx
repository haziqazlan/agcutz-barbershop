import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-barber-cream">
          <div className="absolute top-0 left-0 w-32 h-screen barber-pole opacity-20"></div>
          <div className="absolute top-0 right-0 w-32 h-screen barber-pole opacity-20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in">
            <h1 className="section-title mb-6">
              AG+ CUTZ
              <span className="block text-barber-red mt-2">Barbershop</span>
            </h1>
            <p className="text-xl md:text-2xl text-barber-dark/80 mb-4 font-light max-w-2xl mx-auto">
              One barber, one chair. A student side hustle, weekends only.
            </p>
            <div className="inline-block border-t-4 border-barber-gold w-32 mb-8"></div>
          </div>

          <div className="fade-in-delay-1 mb-12">
            <div className="inline-block card p-8 mb-8">
              <p className="text-5xl md:text-6xl font-bold text-barber-red mb-2">$15</p>
              <p className="text-barber-dark/70 font-semibold">Flat rate — scissor cut or fade</p>
            </div>
          </div>

          <div className="fade-in-delay-2 mb-12">
            <button
              onClick={() => navigate('/book')}
              className="btn-primary text-lg"
            >
              Book Your Appointment
            </button>
            <p className="text-sm text-barber-dark/60 mt-4 font-semibold">
              Sat &amp; Sun only · max 3 slots a day · first come, first served
            </p>
          </div>

          <div className="fade-in-delay-3 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
            <div className="card p-6">
              <div className="text-barber-red text-4xl mb-4">🏠</div>
              <h3 className="font-display text-2xl font-bold mb-3">At My Place</h3>
              <p className="text-barber-dark/70">
                Swing by my apartment for a classic, no-frills cut
              </p>
            </div>
            <div className="card p-6">
              <div className="text-barber-blue text-4xl mb-4">🚗</div>
              <h3 className="font-display text-2xl font-bold mb-3">I Come to You</h3>
              <p className="text-barber-dark/70">
                I'll travel to your place if it's within reach that weekend
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white border-t-4 border-barber-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-12">
            What I Cut
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-16">
            <div className="card p-6 text-center">
              <h3 className="font-display text-2xl font-bold mb-2">Scissor Cut</h3>
              <p className="text-3xl font-bold text-barber-red mb-2">$15</p>
              <p className="text-barber-dark/70 text-sm">Clean, classic, precise</p>
            </div>
            <div className="card p-6 text-center">
              <h3 className="font-display text-2xl font-bold mb-2">Fade</h3>
              <p className="text-3xl font-bold text-barber-red mb-2">$15</p>
              <p className="text-barber-dark/70 text-sm">Sharp blend, your choice of length</p>
            </div>
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-12">
            Availability
          </h2>
          <div className="card p-8 max-w-lg mx-auto">
            <div className="space-y-4 text-center">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Saturday</span>
                <span className="text-barber-dark/70">Up to 3 slots</span>
              </div>
              <div className="border-t-2 border-barber-dark/10"></div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Sunday</span>
                <span className="text-barber-dark/70">Up to 3 slots</span>
              </div>
              <div className="border-t-2 border-barber-dark/10"></div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Mon – Fri</span>
                <span className="text-gray-500">Closed (I'm in class)</span>
              </div>
            </div>
            <p className="text-center text-sm text-barber-dark/60 mt-6">
              Slots depend on my availability that week — book early to lock in a spot.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-barber-dark text-barber-cream py-8 border-t-4 border-barber-gold">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="font-display text-2xl font-bold mb-2">AG+ CUTZ Barbershop</p>
          <p className="text-barber-cream/70">Run solo, one weekend cut at a time</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
