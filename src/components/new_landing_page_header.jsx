import { useState, useEffect, useContext } from "react"
import { Link, useLocation } from "react-router-dom"
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
  Newspaper
} from "lucide-react"
import { LanguageContext as AppLanguageContext } from "../App"
import logo from "../images/logo.png"

export default function RapidWorksHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const context = useContext(AppLanguageContext)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return false;
    const currentPath = location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname;
    const itemPath = path.endsWith('/') ? path.slice(0, -1) : path;
    if (itemPath !== "/" && currentPath.startsWith(itemPath)) return true;
    return false;
  }

  // Fixed color scheme using brand colors
  const colors = {
    logoGradient: "from-[#1D0D37] to-[#7C3BEC]",
    logoText: "from-[#1D0D37] to-[#7C3BEC]",
    buttonHover: "hover:from-[#1D0D37] hover:to-[#7C3BEC]"
      }

  const navItems = [
    { name: "Branding", icon: <Megaphone className="h-4 w-4" />, path: "/branding", color: "[#7C3BEC]" },
    { name: "Experts", icon: <Users className="h-4 w-4" />, path: "/experts", color: "[#7C3BEC]" },
    { name: "Coaching", icon: <Compass className="h-4 w-4" />, path: "/coaching", color: "[#7C3BEC]" },
    { name: "Financing", icon: <Euro className="h-4 w-4" />, path: "/financing", color: "[#7C3BEC]" },
    { name: "Partners", icon: <Handshake className="h-4 w-4" />, path: "/partners", color: "[#7C3BEC]" },
    // { name: "Blog", icon: <Newspaper className="h-4 w-4" />, path: "/blogs", color: "[#7C3BEC]" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white py-2 shadow-sm`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <img src={logo} alt="RapidWorks" className="h-8 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-3">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  to={item.path}
                  className={`relative px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all duration-300 text-xs font-medium z-10 ${
                    isActive(item.path)
                      ? `bg-[#7C3BEC]/10 text-[#7C3BEC]`
                      : `text-gray-700 hover:text-[#7C3BEC]`
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
                <div className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-[#7C3BEC] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${isActive(item.path) ? 'scale-x-100' : ''}`}></div>
                {!isActive(item.path) && (
                  <div className={`absolute inset-0 bg-[#7C3BEC]/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
                )}
              </div>
            ))}

            <a
              href="https://calendly.com/yannick-familie-heeren/30min"
              target="_blank"
              rel="noopener noreferrer"
              className={`ml-2 px-6 py-2 bg-[#7C3BEC] hover:bg-[#6B2BD1] text-white rounded-full hover:shadow-lg hover:translate-y-[-2px] active:translate-y-[0px] transition-all duration-300 font-medium text-xs`}
            >
              {translate('nav.bookCall')}
            </a>

            <div className="flex items-center gap-1 ml-4 p-1 bg-gray-100 rounded-full">
               <button
                 onClick={() => handleLanguageButtonClick('en')}
                 className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                   language === 'en'
                     ? `bg-[#7C3BEC] text-white shadow-sm`
                     : 'text-gray-500 hover:text-gray-700'
                 }`}
               >
                 EN
               </button>
               <button
                 onClick={() => handleLanguageButtonClick('de')}
                 className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                   language === 'de'
                     ? `bg-[#7C3BEC] text-white shadow-sm`
                     : 'text-gray-500 hover:text-gray-700'
                 }`}
               >
                 DE
               </button>
             </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <a
              href="https://calendly.com/yannick-familie-heeren/30min"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-2 bg-[#7C3BEC] hover:bg-[#6B2BD1] text-white rounded-full hover:shadow-lg transition-all duration-300 font-medium text-xs whitespace-nowrap`}
            >
              {translate('nav.bookCall')}
            </a>
            <div className="flex items-center gap-0.5 p-0.5 bg-gray-100 rounded-full">
               <button
                 onClick={() => handleLanguageButtonClick('en')}
                 className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                   language === 'en'
                     ? `bg-[#7C3BEC] text-white shadow-sm`
                     : 'text-gray-500'
                 }`}
               >
                 EN
               </button>
               <button
                 onClick={() => handleLanguageButtonClick('de')}
                 className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                   language === 'de'
                     ? `bg-[#7C3BEC] text-white shadow-sm`
                     : 'text-gray-500'
                 }`}
               >
                 DE
               </button>
             </div>
            <button
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
            </button>
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
        </div>
      )}
    </header>
  )
} 