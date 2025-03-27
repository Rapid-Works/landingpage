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
  Compass
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

  // Navigation items with paths
  const navItems = [
    { name: "Branding", icon: <Megaphone className="h-4 w-4" />, path: "/visibility" },
    { name: "Team", icon: <Users className="h-4 w-4" />, path: "/team" },
    { name: "Blueprint", icon: <FileText className="h-4 w-4" />, path: "/blueprint" },
    { name: "Coaching", icon: <Compass className="h-4 w-4" />, path: "/coaching" },
    { name: "Workshops", icon: <FileText className="h-4 w-4" />, path: "/workshop" },
    { name: "Financing", icon: <Euro className="h-4 w-4" />, path: "/financing" },
    { name: "Bundle", icon: <Package className="h-4 w-4" />, path: "/bundle" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-3 bg-white/80 backdrop-blur-lg shadow-sm" : "py-6 bg-transparent"}`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-1.5 rounded-lg shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <div className="ml-2">
              <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                RapidWorks
              </h1>
              <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">
                Empowering Entrepreneurs
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                <Link
                  to={item.path}
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all duration-300 text-xs font-medium ${
                    isActive(item.path)
                      ? "bg-purple-100 text-purple-700"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </div>
            ))}

            <a 
              href="https://calendly.com/yannick-familie-heeren/30min" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-4 px-8 py-2.5 bg-black hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 text-white rounded-full hover:shadow-lg hover:translate-y-[-2px] active:translate-y-[0px] transition-all duration-300 font-medium text-sm"
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
              className="px-5 py-2 bg-black hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 text-white rounded-full hover:shadow-lg transition-all duration-300 font-medium text-sm"
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
                  ? "bg-purple-50 text-purple-700"
                  : "hover:bg-gray-100 text-gray-700"
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