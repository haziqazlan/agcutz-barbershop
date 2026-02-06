const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Classic Cuts Barbershop</h3>
            <p className="text-gray-400">
              Professional grooming services for the modern gentleman.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Hours</h4>
            <p className="text-gray-400">Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p className="text-gray-400">Saturday: 9:00 AM - 4:00 PM</p>
            <p className="text-gray-400">Sunday: Closed</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">123 Main Street</p>
            <p className="text-gray-400">Anytown, ST 12345</p>
            <p className="text-gray-400">Phone: (555) 123-4567</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Classic Cuts Barbershop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
