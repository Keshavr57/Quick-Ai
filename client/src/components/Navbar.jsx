import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';

import aivoraIcon from '../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

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
              className="w-10 h-10 sm:w-12 sm:h-12 transition-transform group-hover:scale-110 duration-300"
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
          <div className="flex items-center gap-4">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 border-2 border-orange-200 hover:border-orange-400 transition-colors"
                }
              }}
            />
          </div>
        ) : (
          <button
            onClick={openSignIn}
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