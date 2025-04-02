"use client"

import { useState, useEffect } from "react"
import {
  ChevronDown,
  Presentation,
  Check,
  X,
  Mail,
  Calendar,
  Shield,
  AlertCircle,
  BookOpen,
  Users,
  ArrowDown,
} from "lucide-react"
import RapidWorksHeader from "./new_landing_page_header"
import { submitToAirtable } from '../utils/airtableService'

const WorkshopsPage = () => {
  const [scrolled, setScrolled] = useState(false)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [selectedWorkshops, setSelectedWorkshops] = useState([])
  const [showSelectionPrompt, setShowSelectionPrompt] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (selectedWorkshops.length > 0) {
      setShowSelectionPrompt(false)
    }
  }, [selectedWorkshops])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      setError("Please enter your email address")
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    try {
      // Format the selected workshops as a string for the Notes field
      const workshopNotes = selectedWorkshops.map(id => {
        const workshop = workshops.find(w => w.id === id)
        return workshop ? workshop.title : id
      }).join(", ")

      await submitToAirtable({
        email,
        service: "Workshops",
        notes: `Selected workshops: ${workshopNotes}`
      })
      
      setSubmitted(true)
      setError("")
    } catch (error) {
      setError("Failed to submit your request. Please try again.")
      console.error("Submission error:", error)
    }
  }

  const toggleWorkshop = (workshopId) => {
    setSelectedWorkshops(prev => {
      if (prev.includes(workshopId)) {
        return prev.filter(id => id !== workshopId)
      } else {
        return [...prev, workshopId]
      }
    })
  }

  // Workshop data
  const workshops = [
    {
      id: "startup-finance",
      title: "Startup Finance Essentials",
      icon: <DollarSign className="h-5 w-5" />,
      description: "Master the fundamentals of startup financial planning and fundraising",
    },
    {
      id: "product-market-fit",
      title: "Finding Product-Market Fit",
      icon: <Target className="h-5 w-5" />,
      description: "Strategies to validate your product and find your ideal market",
    },
    {
      id: "team-building",
      title: "Building High-Performance Teams",
      icon: <Users className="h-5 w-5" />,
      description: "Learn how to recruit, manage, and retain top talent for your startup",
    },
    {
      id: "growth-hacking",
      title: "Growth Hacking Masterclass",
      icon: <TrendingUp className="h-5 w-5" />,
      description: "Proven tactics to accelerate your startup growth on a limited budget",
    },
  ]

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Noise overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-30 pointer-events-none z-0"></div>

      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-emerald-200 rounded-full filter blur-3xl opacity-20 -z-10 transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-green-200 rounded-full filter blur-3xl opacity-20 -z-10 transform -translate-x-1/3 translate-y-1/3"></div>

      {/* Import the shared header component */}
      <RapidWorksHeader />

      {/* Main Content */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Page intro */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center mb-5 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 font-medium text-xs shadow-sm">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Coming Soon
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              Rapid{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-600">
                  Workshops
                </span>
                <span className="absolute bottom-2 left-0 w-full h-4 bg-emerald-200 rounded-lg -z-10 opacity-70"></span>
              </span>
            </h1>

            <p className="text-xl text-gray-700 leading-relaxed">
              Close your business knowledge gaps. Don't become reliant on consultants! Our expert-led workshops will
              empower you with practical skills and knowledge.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Combined Card with shared border */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200 w-full">
              <div className="lg:flex">
                {/* Left Column - Workshop Selection */}
                <div className="lg:w-1/2 lg:border-r border-gray-200">
                  <div className="p-8">
                    <div className="flex items-start gap-4 mb-8">
                      <div className="bg-emerald-100 p-3 rounded-xl">
                        <Presentation className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Interactive Learning Experience</h2>
                        <p className="text-gray-600">
                          Our workshops combine theory with hands-on practice to ensure you can immediately apply what you learn.
                        </p>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-emerald-600" />
                      Select Workshop Topics
                      <span className="text-xs font-normal text-emerald-600 ml-2">(Select multiple)</span>
                    </h3>

                    <div className="space-y-4">
                      {workshops.map((workshop) => (
                        <div
                          key={workshop.id}
                          className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                            selectedWorkshops.includes(workshop.id)
                              ? "border-emerald-300 bg-emerald-50"
                              : "border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50"
                          }`}
                          onClick={() => toggleWorkshop(workshop.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                selectedWorkshops.includes(workshop.id) ? "bg-emerald-100" : "bg-gray-100"
                              }`}
                            >
                              {workshop.icon}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{workshop.title}</h4>
                              <p className="text-gray-600 text-sm">{workshop.description}</p>
                            </div>
                            <div className="ml-auto">
                              <div
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                                  selectedWorkshops.includes(workshop.id) 
                                    ? "border-emerald-500 bg-emerald-500" 
                                    : "border-gray-300"
                                }`}
                              >
                                {selectedWorkshops.includes(workshop.id) && <Check className="h-3 w-3 text-white" />}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6 rounded-xl text-white relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10">
                          <h3 className="text-lg font-bold mb-2">Limited Seats Available</h3>
                          <p className="text-white/80 mb-4 text-sm">
                            Each workshop is limited to 20 participants to ensure personalized attention and maximum value.
                          </p>

                          <div className="flex items-center gap-3">
                            <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg">
                              <Calendar className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium">Launching Q3 2025</p>
                              <p className="text-white/80 text-sm">Join the waitlist to secure your spot</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Email Form */}
                <div className="lg:w-1/2 relative">
                  {/* Selection prompt overlay */}
                  {showSelectionPrompt && selectedWorkshops.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-20 lg:flex">
                      <div className="bg-white rounded-xl p-6 max-w-sm mx-8">
                        <h3 className="font-bold text-lg mb-2 text-emerald-700">Select Workshops First</h3>
                        <p className="text-gray-600 mb-4">Please select at least one workshop topic that interests you from the left panel.</p>
                        <div className="text-emerald-600 flex items-center justify-center gap-2 font-medium">
                          <ArrowDown className="h-5 w-5 lg:hidden" />
                          <span className="lg:hidden">Scroll up to select</span>
                          <ArrowDown className="h-5 w-5 transform -rotate-90 hidden lg:block" />
                          <span className="hidden lg:block">Select from the left</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Join the Waitlist</h2>

                    {!submitted ? (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="email"
                              id="email"
                              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="you@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                        </div>

                        {selectedWorkshops.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Selected Workshop Topics
                            </label>
                            <div className="space-y-2 mt-2">
                              {selectedWorkshops.map((workshopId) => {
                                const workshop = workshops.find(w => w.id === workshopId);
                                return (
                                  <div key={workshopId} className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-3">
                                    <div className="bg-emerald-100 p-2 rounded-lg">
                                      {workshop?.icon}
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-gray-900">
                                        {workshop?.title}
                                      </h4>
                                    </div>
                                    <button 
                                      type="button"
                                      onClick={() => toggleWorkshop(workshopId)}
                                      className="ml-auto text-gray-400 hover:text-red-500"
                                    >
                                      <X className="h-5 w-5" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="terms"
                              name="terms"
                              type="checkbox"
                              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                              required
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="font-medium text-gray-700">
                              I agree to receive updates about Rapid Workshops
                            </label>
                            <p className="text-gray-500">We'll never share your email with anyone else.</p>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                            selectedWorkshops.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={selectedWorkshops.length === 0}
                        >
                          Join the Waitlist
                        </button>
                      </form>
                    ) : (
                      <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Check className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">You're on the List!</h3>
                        <p className="text-gray-600 mb-4">
                          Thank you for your interest in our workshops. We'll notify you when registration opens.
                        </p>
                        <button
                          onClick={() => {
                            setSubmitted(false)
                            setEmail("")
                            setSelectedWorkshops([])
                            setShowSelectionPrompt(true)
                          }}
                          className="text-emerald-600 font-medium hover:text-emerald-700"
                        >
                          Sign up with another email
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-6 border-t border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className="bg-emerald-100 p-2 rounded-xl">
                        <Shield className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">Our Promise</h3>
                        <p className="text-gray-600 text-sm">
                          Every workshop comes with a satisfaction guarantee. If you're not completely satisfied, we'll
                          refund your registration fee.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Missing imports
const DollarSign = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
)
const Target = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
)
const TrendingUp = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
)

export default WorkshopsPage

