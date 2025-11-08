import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import aivoraIcon from '../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="flex justify-between items-center py-3 px-4 sm:px-10 lg:px-20">
        
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="relative">
          <img
  src={aivoraIcon}
  alt="Aivora AI Icon"
  className="w-20 h-20 sm:w-14 sm:h-14 object-contain transition-transform group-hover:scale-110 duration-300"
/>
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-orange-400 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-gray-900">
            Aivora <span className="text-orange-600">AI</span>
          </span>
        </div>

        {/* Right side */}
        {user ? (
          <div className="flex items-center gap-3">
            {/* Dashboard Button */}
            <button
              onClick={() => navigate('/ai')}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-md hover:shadow-lg font-medium"
            >
              <LayoutDashboard size={18} />
              <span className="text-sm">Dashboard</span>
            </button>
            
            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 hover:bg-orange-200 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-800 max-sm:hidden">{user.name}</span>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-orange-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-orange-100">
                    <p className="text-sm font-medium text-gray-800 truncate" title={user.email}>{user.email}</p>
                    <p className="text-xs text-orange-600 mt-1 capitalize">{user.plan} Plan</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="group flex items-center gap-2 rounded-full text-sm font-semibold cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2.5 shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-300 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Sign In
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;