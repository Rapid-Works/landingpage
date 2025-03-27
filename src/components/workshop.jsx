"use client"

import { useEffect, useState } from "react"
import {
  Rocket,
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
} from "lucide-react"
import RapidWorksHeader from "./new_landing_page_header"
import EmailWaitlistForm from "./EmailWaitlistForm"

const WorkshopsPage = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedWorkshops, setSelectedWorkshops] = useState([])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSubmit = (email, workshop) => {
    console.log("Email submitted:", email, "Workshop:", workshop)
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

  // Function to toggle workshop selection
  const toggleWorkshopSelection = (workshopId) => {
    setSelectedWorkshops((prevSelected) => {
      if (prevSelected.includes(workshopId)) {
        return prevSelected.filter((id) => id !== workshopId);
      } else {
        return [...prevSelected, workshopId];
      }
    });
  };

  // Additional form field for Workshop selection
  const workshopSelection = (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Which workshop are you most interested in?
      </label>
      <p className="text-sm text-gray-500 mb-3">
        Select a workshop above to indicate your preference (optional)
      </p>

      {selectedWorkshops.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <div className="bg-amber-100 p-2 rounded-lg">
            {workshops.find((w) => w.id === selectedWorkshops[0])?.icon}
          </div>
          <div>
            <h4 className="font-bold text-gray-900">
              {workshops.find((w) => w.id === selectedWorkshops[0])?.title}
            </h4>
            <p className="text-gray-600 text-sm">
              {workshops.find((w) => w.id === selectedWorkshops[0])?.description}
            </p>
            {selectedWorkshops.length > 1 && (
              <span className="ml-2 bg-amber-200 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                +{selectedWorkshops.length - 1} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* Noise overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-30 pointer-events-none z-0"></div>

      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-amber-200 rounded-full filter blur-3xl opacity-20 -z-10 transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-orange-200 rounded-full filter blur-3xl opacity-20 -z-10 transform -translate-x-1/3 translate-y-1/3"></div>

      {/* Import shared header component */}
      <RapidWorksHeader />

      {/* Main Content */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Page intro */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center mb-5 px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-700 font-medium text-xs shadow-sm mx-auto">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Coming Soon
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              Rapid{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600">
                  Workshops
                </span>
                <span className="absolute bottom-2 left-0 w-full h-4 bg-amber-200 rounded-lg -z-10 opacity-70"></span>
              </span>
            </h1>

            <p className="text-xl text-gray-700 leading-relaxed">
              Close your business knowledge gaps. Don't become reliant on consultants! Our expert-led workshops will
              empower you with practical skills and knowledge.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Left Column - Workshop Info */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-8">
                <div className="p-8">
                  <div className="flex items-start gap-4 mb-8">
                    <div className="bg-amber-100 p-3 rounded-xl">
                      <Presentation className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Interactive Learning Experience</h2>
                      <p className="text-gray-600">
                        Our workshops combine theory with hands-on practice to ensure you can immediately apply what you
                        learn to your business.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-amber-600" />
                    Upcoming Workshop Topics
                  </h3>

                  <div className="space-y-4">
                    {workshops.map((workshop) => (
                      <div
                        key={workshop.id}
                        className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                          selectedWorkshops.includes(workshop.id)
                            ? "border-amber-300 bg-amber-50"
                            : "border-gray-200 hover:border-amber-200 hover:bg-amber-50/50"
                        }`}
                        onClick={() => toggleWorkshopSelection(workshop.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              selectedWorkshops.includes(workshop.id) ? "bg-amber-100" : "bg-gray-100"
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
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedWorkshops.includes(workshop.id) ? "border-amber-500 bg-amber-500" : "border-gray-300"
                              }`}
                            >
                              {selectedWorkshops.includes(workshop.id) && <Check className="h-3 w-3 text-white" />}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                  <div className="relative z-10">
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

            {/* Right Column - Email Form */}
            <div className="lg:w-1/2">
              <EmailWaitlistForm 
                buttonText="Join the Waitlist"
                successText="You're on the List!"
                successDescription="Thank you for your interest in our workshops. We'll notify you when registration opens."
                checkboxText="I agree to receive updates about Rapid Workshops"
                primaryColor="amber"
                onSubmit={handleSubmit}
                additionalFields={workshopSelection}
                selectedItem={selectedWorkshops.length > 0 ? selectedWorkshops[0] : null}
              />
              
              <div className="bg-gray-50 p-6 border-t border-gray-100 rounded-b-3xl border border-gray-100 border-t-0 shadow-xl mt-[-20px]">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 p-2 rounded-xl">
                      <Shield className="h-5 w-5 text-amber-600" />
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

