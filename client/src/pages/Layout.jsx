import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { SignIn, useUser } from '@clerk/clerk-react'
import aivoraIcon from '../assets/logo.png'

const Layout = () => {
  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)
  const { user } = useUser()

  return user ? (
    <div className="flex flex-col items-start justify-start h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-white">
      {/* Navbar */}
      <nav className="w-full px-8 min-h-14 flex items-center justify-between border-b border-orange-200/70 backdrop-blur-md bg-white/70 shadow-sm sticky top-0 z-50">
        {/* Logo and Name */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="relative">
            <img
              src={aivoraIcon}
              alt="Aivora AI Icon"
               className="w-20 h-20 sm:w-20 sm:h-20 object-contain transition-transform group-hover:scale-110 duration-300"
            />
            {/* Soft glow */}
            <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
          </div>
          <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Aivora <span className="text-orange-500">AI</span>
          </span>
        </div>

        {/* Menu Toggle */}
        {sidebar ? (
          <X
            onClick={() => setSidebar(false)}
            className="w-6 h-6 text-gray-700 sm:hidden hover:text-orange-600 transition-colors"
          />
        ) : (
          <Menu
            onClick={() => setSidebar(true)}
            className="w-6 h-6 text-gray-700 sm:hidden hover:text-orange-600 transition-colors"
          />
        )}
      </nav>

      {/* Main layout */}
      <div className="flex-1 w-full flex h-[calc(100vh-64px)]">
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div className="flex-1 bg-gradient-to-br from-white via-orange-50 to-orange-100 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-white">
      <SignIn />
    </div>
  )
}

export default Layout
