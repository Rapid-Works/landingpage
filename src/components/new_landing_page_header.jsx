import { useState, useEffect, useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Rocket,
  Users,
  FileText,
  Package,
  Menu,
  X,
  Euro,
  Megaphone,
  Compass,
  Presentation,
  Globe
} from "lucide-react"
import { LanguageContext as AppLanguageContext } from "../App"

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

  const { language, setLanguage } = context

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

  const getColorScheme = () => {
    const path = location.pathname;
    if (path.startsWith("/branding")) {
      return {
        logoGradient: "from-purple-600 to-indigo-600",
        logoText: "from-purple-600 to-indigo-600",
        buttonHover: "hover:from-purple-600 hover:to-indigo-600"
      }
    } else if (path.startsWith("/experts")) {
      return {
        logoGradient: "from-blue-600 to-blue-700",
        logoText: "from-blue-600 to-blue-700",
        buttonHover: "hover:from-blue-600 hover:to-blue-700"
      }
    } else if (path.startsWith("/blueprint")) {
      return {
        logoGradient: "from-indigo-600 to-indigo-700",
        logoText: "from-indigo-600 to-indigo-700",
        buttonHover: "hover:from-indigo-600 hover:to-indigo-700"
      }
    } else if (path.startsWith("/coaching")) {
      return {
        logoGradient: "from-orange-600 to-amber-600",
        logoText: "from-orange-600 to-amber-600",
        buttonHover: "hover:from-orange-600 hover:to-amber-600"
      }
    } else if (path.startsWith("/workshop")) {
      return {
        logoGradient: "from-green-600 to-emerald-600",
        logoText: "from-green-600 to-emerald-600",
        buttonHover: "hover:from-green-600 hover:to-emerald-600"
      }
    } else if (path.startsWith("/financing")) {
      return {
        logoGradient: "from-rose-600 to-pink-600",
        logoText: "from-rose-600 to-pink-600",
        buttonHover: "hover:from-rose-600 hover:to-pink-600"
      }
    } else if (path.startsWith("/bundle")) {
      return {
        logoGradient: "from-violet-600 to-violet-500",
        logoText: "from-violet-600 to-violet-500",
        buttonHover: "hover:from-violet-600 hover:to-violet-500"
      }
    } else {
      return {
        logoGradient: "from-purple-600 to-indigo-600",
        logoText: "from-purple-600 to-indigo-600",
        buttonHover: "hover:from-purple-600 hover:to-indigo-600"
      }
    }
  }

  const colors = getColorScheme()

  const navItems = [
    { name: "Branding", icon: <Megaphone className="h-4 w-4" />, path: "/branding", color: "purple" },
    { name: "Experts", icon: <Users className="h-4 w-4" />, path: "/experts", color: "blue" },
    { name: "Blueprint", icon: <FileText className="h-4 w-4" />, path: "/blueprint", color: "indigo" },
    { name: "Coaching", icon: <Compass className="h-4 w-4" />, path: "/coaching", color: "orange" },
    { name: "Workshops", icon: <Presentation className="h-4 w-4" />, path: "/workshop", color: "green" },
    { name: "Financing", icon: <Euro className="h-4 w-4" />, path: "/financing", color: "rose" },
    { name: "Bundle", icon: <Package className="h-4 w-4" />, path: "/bundle", color: "violet" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white py-2 shadow-sm`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <div className={`bg-gradient-to-br ${colors.logoGradient} group-hover:from-purple-600 group-hover:to-indigo-600 p-1 rounded-lg shadow-lg transform group-hover:rotate-12 transition-all duration-300`}>
              <Rocket className="h-4 w-4 text-white" />
            </div>
            <div className="ml-2 hidden md:block">
              <h1 className={`text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${colors.logoText} group-hover:from-purple-600 group-hover:to-indigo-600 transition-all duration-300`}>
                RapidWorks
              </h1>
              <p className="text-[8px] text-gray-500 font-medium tracking-wider uppercase leading-tight">
                EMPOWERING ENTREPRENEURS
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  to={item.path}
                  className={`relative px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all duration-300 text-xs font-medium z-10 ${
                    isActive(item.path)
                      ? `bg-${item.color}-100 text-${item.color}-700`
                      : `text-gray-700 hover:text-${item.color}-700`
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
                <div className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-${item.color}-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                {!isActive(item.path) && (
                  <div className={`absolute inset-0 bg-${item.color}-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
                )}
              </div>
            ))}

            <a 
              href="https://calendly.com/yannick-familie-heeren/30min" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`ml-2 px-6 py-2 bg-black hover:bg-gradient-to-r ${colors.buttonHover} text-white rounded-full hover:shadow-lg hover:translate-y-[-2px] active:translate-y-[0px] transition-all duration-300 font-medium text-xs`}
            >
              Book a Call
            </a>

            <div className="flex items-center gap-1 ml-4 p-1 bg-gray-100 rounded-full">
               <button
                 onClick={() => handleLanguageButtonClick('en')}
                 className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                   language === 'en'
                     ? `bg-gradient-to-r ${colors.logoGradient} text-white shadow-sm`
                     : 'text-gray-500 hover:text-gray-700'
                 }`}
               >
                 EN
               </button>
               <button
                 onClick={() => handleLanguageButtonClick('de')}
                 className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                   language === 'de'
                     ? `bg-gradient-to-r ${colors.logoGradient} text-white shadow-sm`
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
              className={`px-4 py-2 bg-black hover:bg-gradient-to-r ${colors.buttonHover} text-white rounded-full hover:shadow-lg transition-all duration-300 font-medium text-xs whitespace-nowrap`}
            >
              Book a Call
            </a>
            <div className="flex items-center gap-0.5 p-0.5 bg-gray-100 rounded-full">
               <button
                 onClick={() => handleLanguageButtonClick('en')}
                 className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                   language === 'en'
                     ? 'bg-purple-600 text-white shadow-sm'
                     : 'text-gray-500'
                 }`}
               >
                 EN
               </button>
               <button
                 onClick={() => handleLanguageButtonClick('de')}
                 className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                   language === 'de'
                     ? 'bg-purple-600 text-white shadow-sm'
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
                  ? `bg-${item.color}-50 text-${item.color}-700`
                  : `hover:bg-${item.color}-50/50 text-gray-700 hover:text-${item.color}-700`
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