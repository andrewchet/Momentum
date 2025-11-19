import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="bg-primary-600 rounded-lg p-2">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Momentum</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-1">
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/goals"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/goals')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Goals
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-sm text-gray-700">
              <span className="font-medium">{user.firstName} {user.lastName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
