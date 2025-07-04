import { useState, useEffect, useContext } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  Rocket,
  Users,
  FileText,
  Menu,
  X,
  Euro,
  Megaphone,
  Compass,
  Globe,
  Handshake,
  Newspaper,
  User,
  LogOut,
  Settings,
  Calendar
} from "lucide-react"
import { LanguageContext as AppLanguageContext } from "../App"
import { useAuth } from "../contexts/AuthContext"
import logo from "../images/logo.png"

export default function RapidWorksHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [imgError, setImgError] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const context = useContext(AppLanguageContext)
  const { currentUser, logout } = useAuth()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest(".user-menu-container")) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isUserMenuOpen])

  if (!context) {
    console.error("LanguageContext not found in RapidWorksHeader")
    return null;
  }

  const { language, setLanguage, translate } = context

  const handleLanguageButtonClick = (newLang) => {
    if (newLang !== language) {
      setLanguage(newLang)
      localStorage.setItem('language', newLang)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setIsUserMenuOpen(false)
    } catch (error) {
      console.error("Failed to log out:", error)
    }
  }

  const handleLoginRedirect = () => {
    const currentPath = location.pathname + location.search
    navigate(`/login?redirect=${encodeURIComponent(currentPath)}`)
  }

  const handleDashboardRedirect = () => {
    navigate("/dashboard")
    setIsUserMenuOpen(false)
  }

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return false;
    const currentPath = location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname;
    const itemPath = path.endsWith('/') ? path.slice(0, -1) : path;
    if (itemPath !== "/" && currentPath.startsWith(itemPath)) return true;
    return false;
  }

  const getInitials = (name) => {
    if (!name) return "NN"; // Not Found
    const names = name.trim().split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const navItems = [
    { name: "Branding", icon: <Megaphone className="h-4 w-4" />, path: "/branding", color: "[#7C3BEC]" },
    { name: "Experts", icon: <Users className="h-4 w-4" />, path: "/experts", color: "[#7C3BEC]" },
    { name: "Coaching", icon: <Compass className="h-4 w-4" />, path: "/coaching", color: "[#7C3BEC]" },
    { name: "Financing", icon: <Euro className="h-4 w-4" />, path: "/financing", color: "[#7C3BEC]" },
    { name: "Partners", icon: <Handshake className="h-4 w-4" />, path: "/partners", color: "[#7C3BEC]" },
    // { name: "Blog", icon: <Newspaper className="h-4 w-4" />, path: "/blogs", color: "[#7C3BEC]" },
  ]

  const renderUserAvatar = (isMobile = false) => {
    const hasPhoto = currentUser && currentUser.photoURL && currentUser.photoURL.trim() !== '' && !imgError;
    return (
      <div className={`bg-[#7C3BEC] rounded-full flex items-center justify-center overflow-hidden ${isMobile ? 'w-7 h-7' : 'w-8 h-8'}`}>
        {hasPhoto ? (
          <img
            src={currentUser.photoURL}
            alt={currentUser.displayName || 'User'}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className={`font-bold text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>
            {getInitials(currentUser.displayName)}
          </span>
        )}
      </div>
    );
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white py-4 shadow-sm`}
    >
      <div className="w-full px-8">
        {/* --- Main Layout Container --- */}
        <div className="h-6">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between h-full">
            <Link to="/" className="flex items-center group">
              <img src={logo} alt="RapidWorks" className="h-10 w-auto" />
            </Link>
            <button
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-center h-full relative">
            {/* Centered Group */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <Link to="/" className="flex items-center group flex-shrink-0">
                <img src={logo} alt="RapidWorks" className="h-10 w-auto" />
              </Link>

              {/* Navigation */}
              <nav className="flex items-center gap-6">
                {navItems.map((item) => (
                  <div key={item.name} className="relative group">
                    <Link
                      to={item.path}
                      className={`relative px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 text-sm font-medium z-10 ${
                        isActive(item.path)
                          ? `bg-[#7C3BEC]/10 text-[#7C3BEC]`
                          : `text-gray-700 hover:text-[#7C3BEC]`
                      }`}
                    >
                      <span className="w-4 h-4">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                    <div className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-[#7C3BEC] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${isActive(item.path) ? 'scale-x-100' : ''}`}></div>
                    {!isActive(item.path) && (
                      <div className={`absolute inset-0 bg-[#7C3BEC]/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Centered Controls */}
              <div className="flex items-center gap-4">
                <a
                  href="https://calendly.com/yannick-familie-heeren/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-8 py-2.5 bg-[#7C3BEC] hover:bg-[#6B2BD1] text-white rounded-full hover:shadow-lg hover:translate-y-[-2px] active:translate-y-[0px] transition-all duration-300 font-medium text-sm`}
                >
                  {translate('nav.bookCall')}
                </a>
                <div className="flex items-center gap-1 p-1.5 bg-gray-100 rounded-full">
                  <button
                    onClick={() => handleLanguageButtonClick('en')}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                      language === 'en'
                        ? `bg-[#7C3BEC] text-white shadow-sm`
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => handleLanguageButtonClick('de')}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                      language === 'de'
                        ? `bg-[#7C3BEC] text-white shadow-sm`
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    DE
                  </button>
                </div>
              </div>
            </div>

            {/* Right-aligned Auth */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              {currentUser ? (
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center"
                  >
                    {renderUserAvatar()}
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                      <div className="p-2">
                        <div className="ml-1 mb-1">
                          <p className="font-medium text-sm text-gray-800 truncate">{currentUser.displayName}</p>
                          <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                        </div>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button onClick={handleDashboardRedirect} className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                          <Settings className="h-4 w-4 mr-2" />
                          Dashboard
                        </button>
                        <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleLoginRedirect}
                  className="px-6 py-2.5 text-gray-700 hover:text-[#7C3BEC] border border-gray-300 hover:border-[#7C3BEC] rounded-full hover:bg-gray-50 transition-all duration-300 font-medium text-sm"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg p-4 border-t border-gray-100 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 font-medium w-full text-left ${
                isActive(item.path)
                  ? `bg-[#7C3BEC]/10 text-[#7C3BEC]`
                  : `hover:bg-[#7C3BEC]/5 text-gray-700 hover:text-[#7C3BEC]`
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-3 mt-2 space-y-2">
            {currentUser ? (
              <>
                <div className="flex items-center px-4 py-2 text-sm text-gray-700">
                  {renderUserAvatar(true)}
                  <span className="truncate ml-3 font-medium">
                    {currentUser.displayName || currentUser.email}
                  </span>
                </div>
                <button onClick={() => { handleDashboardRedirect(); setMobileMenuOpen(false); }} className="flex items-center w-full px-4 py-3 text-gray-700 hover:text-[#7C3BEC] hover:bg-[#7C3BEC]/5 rounded-lg transition-all duration-300">
                  <Settings className="h-4 w-4 mr-3" />
                  Dashboard
                </button>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex items-center w-full px-4 py-3 text-gray-700 hover:text-[#7C3BEC] hover:bg-[#7C3BEC]/5 rounded-lg transition-all duration-300">
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { handleLoginRedirect(); setMobileMenuOpen(false); }} className="flex items-center w-full px-4 py-3 text-gray-700 hover:text-[#7C3BEC] hover:bg-[#7C3BEC]/5 rounded-lg transition-all duration-300">
                  <User className="h-4 w-4 mr-3" />
                  Sign In
                </button>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="flex items-center w-full px-4 py-3 text-[#7C3BEC] border border-[#7C3BEC] rounded-lg hover:bg-[#7C3BEC]/5 transition-all duration-300">
                  <User className="h-4 w-4 mr-3" />
                  Sign Up
                </Link>
              </>
            )}
            <a href="https://calendly.com/yannick-familie-heeren/30min" target="_blank" rel="noopener noreferrer" className="flex items-center w-full px-4 py-3 bg-[#7C3BEC] text-white rounded-lg hover:bg-[#6B2BD1] transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
              <Calendar className="h-4 w-4 mr-3" />
              {translate("nav.bookCall")}
            </a>
            <div className="flex justify-center items-center pt-3 gap-2">
              <button
                onClick={() => handleLanguageButtonClick("en")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                  language === "en"
                    ? "bg-[#7C3BEC] text-white shadow-sm"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageButtonClick("de")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                  language === "de"
                    ? "bg-[#7C3BEC] text-white shadow-sm"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                DE
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 