import { useAuth } from '../context/AuthContext';
import {
  Crown,
  Eraser,
  FileText,
  Hash,
  Home,
  House,
  Image,
  Lock,
  LogOut,
  Scissors,
  SquarePen,
  Users,
} from 'lucide-react'
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: House, free: true },
  { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen, free: true },
  { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash, free: true },
  { to: '/ai/generate-images', label: 'Generate Images', Icon: Image, premium: true },
  { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser, premium: true },
  { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors, premium: true },
  { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText, premium: true },
  { to: '/ai/community', label: 'Community', Icon: Users, free: true },
]

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const hasPremiumPlan = user?.plan === 'premium';

  return (
    <div
      className={`w-64 bg-gradient-to-b from-orange-50 via-white to-orange-100 border-r border-orange-200 flex flex-col justify-between items-center shadow-md max-sm:absolute top-14 bottom-0 z-40 ${
        sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'
      } transition-all duration-300 ease-in-out`}
    >
      {/* Top section */}
      <div className="my-7 w-full">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full ring-2 ring-orange-400 shadow-md bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h1 className="mt-2 text-lg font-semibold text-gray-800">
            {user?.name}
          </h1>
        </div>

        {/* Home Button */}
        <div className="px-5 mt-6">
          <button
            onClick={() => {
              navigate('/');
              setSidebar(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 text-gray-700 hover:bg-orange-100 hover:text-orange-600 text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            <span className="flex-1">Back to Home</span>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="px-5 mt-4 text-sm font-medium space-y-2">
          {navItems.map(({ to, label, Icon, premium }) => {
            const isLocked = premium && !hasPremiumPlan;
            return (
              <NavLink
                key={to}
                to={to}
                end={to === '/ai'}
                onClick={() => setSidebar(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 relative ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg scale-[1.02]'
                      : isLocked
                      ? 'text-gray-400 hover:bg-orange-50'
                      : 'text-gray-700 hover:bg-orange-100 hover:text-orange-600'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-white' : isLocked ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    />
                    <span className="flex-1">{label}</span>
                    {isLocked && (
                      <Lock className="w-3 h-3 text-gray-400" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Upgrade to Premium Button (for free users) */}
        {!hasPremiumPlan && (
          <div className="px-5 mt-4">
            <button
              onClick={() => {
                navigate('/');
                setSidebar(false);
                // Scroll to pricing section after navigation
                setTimeout(() => {
                  const pricingSection = document.querySelector('#pricing');
                  if (pricingSection) {
                    pricingSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg text-sm font-semibold"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade to Premium</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom user profile + logout */}
      <div className="w-full border-t border-orange-200 p-4 px-6 flex items-center justify-between bg-white/80 backdrop-blur-sm">
        <div className="flex gap-2 items-center">
          <div className="w-9 h-9 rounded-full ring-1 ring-orange-400 bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-sm font-medium text-gray-800">
              {user?.name}
            </h1>
            <p className="text-xs text-orange-600 font-semibold">
              {hasPremiumPlan ? 'Premium' : 'Free'} Plan
            </p>
          </div>
        </div>
        <LogOut
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="w-5 h-5 text-gray-500 hover:text-orange-600 transition cursor-pointer"
        />
      </div>
    </div>
  )
}

export default Sidebar
