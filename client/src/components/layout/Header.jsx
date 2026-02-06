import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { admin, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            <span className="text-blue-600">Classic</span> Cuts Barbershop
          </Link>
          
          <div className="flex items-center gap-4">
            {admin ? (
              <>
                <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
