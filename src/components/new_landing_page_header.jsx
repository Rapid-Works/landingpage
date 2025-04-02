import { useState, useEffect } from "react"
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
  Presentation
} from "lucide-react"

export default function RapidWorksHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Determine which nav item is active based on current path
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return false;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  }

  // Define color schemes for each product page
  const getColorScheme = () => {
    if (location.pathname.startsWith("/branding")) {
      return {
        logoGradient: "from-purple-600 to-indigo-600",
        logoText: "from-purple-600 to-indigo-600",
        buttonHover: "hover:from-purple-600 hover:to-indigo-600"
      }
    } else if (location.pathname.startsWith("/experts")) {
      return {
        logoGradient: "from-blue-600 to-blue-700",
        logoText: "from-blue-600 to-blue-700",
        buttonHover: "hover:from-blue-600 hover:to-blue-700"
      }
    } else if (location.pathname.startsWith("/blueprint")) {
      return {
        logoGradient: "from-indigo-600 to-indigo-700",
        logoText: "from-indigo-600 to-indigo-700",
        buttonHover: "hover:from-indigo-600 hover:to-indigo-700"
      }
    } else if (location.pathname.startsWith("/coaching")) {
      return {
        logoGradient: "from-orange-600 to-amber-600",
        logoText: "from-orange-600 to-amber-600",
        buttonHover: "hover:from-orange-600 hover:to-amber-600"
      }
    } else if (location.pathname.startsWith("/workshop")) {
      return {
        logoGradient: "from-green-600 to-emerald-600",
        logoText: "from-green-600 to-emerald-600",
        buttonHover: "hover:from-green-600 hover:to-emerald-600"
      }
    } else if (location.pathname.startsWith("/financing")) {
      return {
        logoGradient: "from-rose-600 to-pink-600",
        logoText: "from-rose-600 to-pink-600",
        buttonHover: "hover:from-rose-600 hover:to-pink-600"
      }
    } else if (location.pathname.startsWith("/bundle")) {
      return {
        logoGradient: "from-gray-700 to-gray-900",
        logoText: "from-gray-700 to-gray-900",
        buttonHover: "hover:from-gray-700 hover:to-gray-900"
      }
    } else {
      // Default/home page
      return {
        logoGradient: "from-purple-600 to-indigo-600",
        logoText: "from-purple-600 to-indigo-600",
        buttonHover: "hover:from-purple-600 hover:to-indigo-600"
      }
    }
  }

  const colors = getColorScheme()

  // Navigation items with paths and their specific colors
  const navItems = [
    { name: "Branding", icon: <Megaphone className="h-4 w-4" />, path: "/branding", color: "purple" },
    { name: "Experts", icon: <Users className="h-4 w-4" />, path: "/experts", color: "blue" },
    { name: "Blueprint", icon: <FileText className="h-4 w-4" />, path: "/blueprint", color: "indigo" },
    { name: "Coaching", icon: <Compass className="h-4 w-4" />, path: "/coaching", color: "orange" },
    { name: "Workshops", icon: <Presentation className="h-4 w-4" />, path: "/workshop", color: "green" },
    { name: "Financing", icon: <Euro className="h-4 w-4" />, path: "/financing", color: "rose" },
    { name: "Bundle", icon: <Package className="h-4 w-4" />, path: "/bundle", color: "gray" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white py-3 shadow-sm`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <div className={`bg-gradient-to-br ${colors.logoGradient} group-hover:from-purple-600 group-hover:to-indigo-600 p-1.5 rounded-lg shadow-lg transform group-hover:rotate-12 transition-all duration-300`}>
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <div className="ml-2">
              <h1 className={`text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${colors.logoText} group-hover:from-purple-600 group-hover:to-indigo-600 transition-all duration-300`}>
                RapidWorks
              </h1>
              <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">
                Empowering Entrepreneurs
              </p>
            </div>
          </Link>

          {/* Desktop Navigation with colored indicators */}
          <div className="hidden md:flex items-center gap-3">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                <Link
                  to={item.path}
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all duration-300 text-xs font-medium ${
                    isActive(item.path)
                      ? `bg-${item.color}-100 text-${item.color}-700`
                      : `hover:bg-${item.color}-50 text-gray-700 hover:text-${item.color}-700`
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
                {!isActive(item.path) && (
                  <div className={`h-0.5 w-full bg-${item.color}-300/50 absolute -bottom-1 left-0 rounded-full opacity-70`}></div>
                )}
              </div>
            ))}

            <a 
              href="https://calendly.com/yannick-familie-heeren/30min" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`ml-4 px-8 py-2.5 bg-black hover:bg-gradient-to-r ${colors.buttonHover} text-white rounded-full hover:shadow-lg hover:translate-y-[-2px] active:translate-y-[0px] transition-all duration-300 font-medium text-sm`}
            >
              Book a Call
            </a>

            <div className="text-gray-600 font-medium ml-2">
              <select className="bg-transparent border-none focus:ring-0 cursor-pointer text-sm">
                <option>EN</option>
                <option>DE</option>
              </select>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <a 
              href="https://calendly.com/yannick-familie-heeren/30min" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`px-5 py-2 bg-black hover:bg-gradient-to-r ${colors.buttonHover} text-white rounded-full hover:shadow-lg transition-all duration-300 font-medium text-sm`}
            >
              Book a Call
            </a>
            <button
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
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