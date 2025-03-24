import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { LanguageContext } from '../App'
import RapidWorksLogo from '../images/logo512.png'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { language, setLanguage } = React.useContext(LanguageContext)

  // Retrieve language from localStorage on component mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language')
    if (storedLanguage) {
      setLanguage(storedLanguage)
    }
  }, [setLanguage])

  // Function to change language and store it in localStorage
  const changeLanguage = (lang) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Name */}
          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="flex items-center space-x-2"
          >
            <img src={RapidWorksLogo} alt="RapidWorks" className="h-8 w-8" />
            <span className="font-medium text-gray-900">RapidWorks</span>
          </Link>

          {/* Middle: Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              onClick={() => window.scrollTo(0, 0)}
              className={`px-4 py-2 rounded-full text-sm font-light transition-colors ${isActive('/')
                  ? 'bg-violet-50 text-violet-600'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              MVP Development
            </Link>
            <Link
              to="/visibility"
              onClick={() => window.scrollTo(0, 0)}
              className={`px-4 py-2 rounded-full text-sm font-light transition-colors ${isActive('/visibility')
                  ? 'bg-violet-50 text-violet-600'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Visibility Bundle
            </Link>
          </div>

          {/* Right: CTA & Language - Visible on all views */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.open('https://calendly.com/yannick-familie-heeren/30min', '_blank')}
              className="px-4 py-2 text-sm font-light text-white rounded-full bg-gradient-to-r from-violet-600 to-violet-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              Book a Call
            </button>
            <div className="hidden md:flex items-center space-x-1 text-sm">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 rounded-l ${language === 'en' ? 'text-violet-600' : 'text-gray-400'
                  }`}
              >
                EN
              </button>
              <span className="text-gray-300">/</span>
              <button
                onClick={() => changeLanguage('de')}
                className={`px-2 py-1 rounded-r ${language === 'de' ? 'text-violet-600' : 'text-gray-400'
                  }`}
              >
                DE
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-4">
              <Link
                to="/"
                onClick={() => {
                  window.scrollTo(0, 0)
                  setIsMenuOpen(false)
                }}
                className={`block px-4 py-2 rounded-lg text-sm font-light ${isActive('/') ? 'bg-violet-50 text-violet-600' : 'text-gray-600'
                  }`}
              >
                MVP Development
              </Link>
              <Link
                to="/visibility"
                onClick={() => {
                  window.scrollTo(0, 0)
                  setIsMenuOpen(false)
                }}
                className={`block px-4 py-2 rounded-lg text-sm font-light ${isActive('/visibility') ? 'bg-violet-50 text-violet-600' : 'text-gray-600'
                  }`}
              >
                Visibility Bundle
              </Link>
              <div className="flex justify-center items-center space-x-1 text-sm border-t border-gray-100 pt-4">
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-4 py-2 rounded ${language === 'en' ? 'text-violet-600' : 'text-gray-400'
                    }`}
                >
                  EN
                </button>
                <span className="text-gray-300">/</span>
                <button
                  onClick={() => changeLanguage('de')}
                  className={`px-4 py-2 rounded ${language === 'de' ? 'text-violet-600' : 'text-gray-400'
                    }`}
                >
                  DE
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar 