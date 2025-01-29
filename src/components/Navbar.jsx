import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LanguageContext } from '../App'
import RapidWorksLogo from '../images/logo512.png'

const Navbar = () => {
  const location = useLocation()
  const { language, setLanguage } = React.useContext(LanguageContext)

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Name */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={RapidWorksLogo} alt="RapidWorks" className="h-8 w-8" />
            <span className="font-medium text-gray-900">RapidWorks</span>
          </Link>

          {/* Middle: Navigation */}
          <div className="flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-full text-sm font-light transition-colors ${
                isActive('/') 
                  ? 'bg-violet-50 text-violet-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              MVP Development
            </Link>
            <Link
              to="/visibility"
              className={`px-4 py-2 rounded-full text-sm font-light transition-colors ${
                isActive('/visibility') 
                  ? 'bg-violet-50 text-violet-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Visibility Bundle
            </Link>
          </div>

          {/* Right: CTA & Language */}
          <div className="flex items-center space-x-4">
            <button
            //   onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              className="px-4 py-2 text-sm font-light text-white rounded-full bg-gradient-to-r from-violet-600 to-violet-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              Book a Call
            </button>
            <div className="flex items-center space-x-1 text-sm">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-l ${
                  language === 'en' ? 'text-violet-600' : 'text-gray-400'
                }`}
              >
                EN
              </button>
              <span className="text-gray-300">/</span>
              <button
                onClick={() => setLanguage('de')}
                className={`px-2 py-1 rounded-r ${
                  language === 'de' ? 'text-violet-600' : 'text-gray-400'
                }`}
              >
                DE
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 