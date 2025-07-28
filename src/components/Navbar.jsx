import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, LogOut, Settings, Edit, Bell } from 'lucide-react'
import { LanguageContext } from '../App'
import { useAuth } from '../contexts/AuthContext'
import RapidWorksLogo from '../images/logo512.png'
import ProfileEditModal from './ProfileEditModal'
import NotificationSettingsModal from './NotificationSettingsModal'
import { useSmartNotificationStatus } from '../hooks/useSmartNotificationStatus'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { language, setLanguage } = React.useContext(LanguageContext)
  const { currentUser, logout } = useAuth()
  const { forceRefresh } = useSmartNotificationStatus()

  // Retrieve language from localStorage on component mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language')
    if (storedLanguage) {
      setLanguage(storedLanguage)
    }
  }, [setLanguage])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  // Function to change language and store it in localStorage
  const changeLanguage = (lang) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
      setIsUserMenuOpen(false)
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  const handleEditProfile = () => {
    setIsProfileModalOpen(true)
    setIsUserMenuOpen(false)
  }

  const handleNotificationSettings = () => {
    setIsSettingsModalOpen(true)
    setIsUserMenuOpen(false)
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

          {/* Right: CTA & Language & Auth - Visible on all views */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.open('https://calendly.com/yannick-familie-heeren/30min', '_blank')}
              className="px-4 py-2 text-sm font-light text-white rounded-full bg-gradient-to-r from-violet-600 to-violet-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              Book a Call
            </button>
            
            {/* Authentication section */}
            {currentUser ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-light text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden md:inline">
                    {currentUser.displayName || currentUser.email}
                  </span>
                </button>
                
                {/* User dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                    <div className="py-2">
                      <button
                        onClick={handleEditProfile}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </button>
                      <button
                        onClick={handleNotificationSettings}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Bell className="h-4 w-4 mr-2" />
                        Notification Settings
                      </button>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-light text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-light text-violet-600 border border-violet-600 rounded-full hover:bg-violet-50 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            <div className="hidden md:flex items-center space-x-1 text-sm font-sans">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 rounded-l font-sans ${language === 'en' ? 'text-violet-600' : 'text-gray-400'
                  }`}
              >
                EN
              </button>
              <span className="text-gray-300">/</span>
              <button
                onClick={() => changeLanguage('de')}
                className={`px-2 py-1 rounded-r font-sans ${language === 'de' ? 'text-violet-600' : 'text-gray-400'
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
              
              {/* Mobile Authentication Section */}
              {currentUser ? (
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex items-center px-4 py-2 text-sm text-gray-700">
                    <User className="h-4 w-4 mr-2" />
                    {currentUser.displayName || currentUser.email}
                  </div>
                  <button
                    onClick={() => {
                      handleEditProfile()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      handleNotificationSettings()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notification Settings
                  </button>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-violet-600 border border-violet-600 rounded-lg hover:bg-violet-50 text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              
              <div className="flex justify-center items-center space-x-1 text-sm border-t border-gray-100 pt-4 font-sans">
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-4 py-2 rounded font-sans ${language === 'en' ? 'text-violet-600' : 'text-gray-400'
                    }`}
                >
                  EN
                </button>
                <span className="text-gray-300">/</span>
                <button
                  onClick={() => changeLanguage('de')}
                  className={`px-4 py-2 rounded font-sans ${language === 'de' ? 'text-violet-600' : 'text-gray-400'
                    }`}
                >
                  DE
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Edit Modal */}
      <ProfileEditModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />

      {/* Notification Settings Modal */}
      <NotificationSettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)}
        onPreferencesSaved={forceRefresh}
      />
    </nav>
  )
}

export default Navbar 