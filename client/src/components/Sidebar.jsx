import { Protect, useClerk, useUser } from '@clerk/clerk-react'
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  LogOut,
  Scissors,
  SquarePen,
  Users,
} from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: House },
  { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
  { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
  { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
  { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
  { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors },
  { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
  { to: '/ai/community', label: 'Community', Icon: Users },
]

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser()
  const { signOut, openUserProfile } = useClerk()
  
  // Check if user has premium plan from metadata
  const hasPremiumPlan = user?.publicMetadata?.plan === 'premium' || 
                        user?.publicMetadata?.subscription_plan === 'premium' ||
                        user?.publicMetadata?.hasPremiumPlan === true ||
                        user?.privateMetadata?.plan === 'premium' ||
                        user?.unsafeMetadata?.plan === 'premium'

  return (
    <div
      className={`w-64 bg-gradient-to-b from-orange-50 via-white to-orange-100 border-r border-orange-200 flex flex-col justify-between items-center shadow-md max-sm:absolute top-14 bottom-0 z-40 ${
        sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'
      } transition-all duration-300 ease-in-out`}
    >
      {/* Top section */}
      <div className="my-7 w-full">
        <div className="flex flex-col items-center">
          <img
            src={user.imageUrl}
            alt="User avatar"
            className="w-16 h-16 rounded-full ring-2 ring-orange-400 shadow-md"
          />
          <h1 className="mt-2 text-lg font-semibold text-gray-800">
            {user.fullName}
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="px-5 mt-6 text-sm font-medium space-y-2">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/ai'}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg scale-[1.02]'
                    : 'text-gray-700 hover:bg-orange-100 hover:text-orange-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-gray-600'
                    }`}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Bottom user profile + logout */}
      <div className="w-full border-t border-orange-200 p-4 px-6 flex items-center justify-between bg-white/80 backdrop-blur-sm">
        <div
          onClick={openUserProfile}
          className="flex gap-2 items-center cursor-pointer hover:scale-[1.02] transition-transform"
        >
          <img
            src={user.imageUrl}
            className="w-9 h-9 rounded-full ring-1 ring-orange-400"
            alt=""
          />
          <div>
            <h1 className="text-sm font-medium text-gray-800">
              {user.fullName}
            </h1>
            <p className="text-xs text-orange-600 font-semibold">
              {hasPremiumPlan ? 'Premium' : 'Free'} Plan
            </p>
          </div>
        </div>
        <LogOut
          onClick={signOut}
          className="w-5 h-5 text-gray-500 hover:text-orange-600 transition cursor-pointer"
        />
      </div>
    </div>
  )
}

export default Sidebar
