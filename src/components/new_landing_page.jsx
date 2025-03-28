"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import {
  Rocket,
  Paintbrush,
  Users,
  FileText,
  BookOpen,
  Presentation,
  DollarSign,
  Package,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  Megaphone,
  Euro,
  Compass,
  Loader2
} from "lucide-react"
import RapidWorksHeader from "./new_landing_page_header"

// Import custom images
import YannickProfile from "../images/yannickprofile.png"
import BrandingImage from "../images/more.png"
import RapidWorkLaptop from "../images/rapidworkdlaptop.png"

export default function RapidWorksPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const servicesRef = useRef(null)
  const ctaRef = useRef(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCalendlyLoading, setIsCalendlyLoading] = useState(true)
  const iframeRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isModalOpen])

  const handleIframeLoad = () => {
    setIsCalendlyLoading(false)
  }

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToCTA = () => {
    ctaRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const openCalendly = () => {
    window.open('https://calendly.com/yannick-familie-heeren/30min', '_blank')
  }

  const openCalendlyModal = () => {
    setIsCalendlyLoading(true)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-purple-200 selection:text-purple-900">
      {/* Noise overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-30 pointer-events-none z-0"></div>

      <RapidWorksHeader />

      {/* Hero Section */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-20 -z-10"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-1.5 bg-purple-100 rounded-full text-purple-700 font-medium text-sm">
              Startup Acceleration Platform
            </div>

            <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
              The{" "}
              <span className="relative inline-block px-2">
                <span className="relative z-10">Full Service</span>
                <span className="absolute bottom-2 left-0 w-full h-4 bg-red-300 rounded-lg -z-10 opacity-70"></span>
              </span>{" "}
              Agency for{" "}
              <span className="relative inline-block px-2">
                <span className="relative z-10">your Startup</span>
                <span className="absolute bottom-2 left-0 w-full h-4 bg-red-300 rounded-lg -z-10 opacity-70"></span>
              </span>
            </h2>

            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-600 leading-relaxed mb-10">
              You are not alone, 80% of the problems faced by startups are identical. We solve these 80% at unbeatable prices, so you can spend your time and capital on your core business.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={scrollToCTA}
                className="px-8 py-4 bg-black hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 text-white rounded-full hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0px] transition-all duration-300 font-medium">
                Get Started
              </button>
              <button
                onClick={scrollToServices}
                className="px-8 py-4 bg-white border border-gray-200 text-gray-800 rounded-full hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0px] transition-all duration-300 font-medium"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to build and scale your startup, all in one place.
            </p>
          </div>

          {/* Featured Services - First Row with larger cards */}
          <div className="grid md:grid-cols-2 gap-10 mb-16">
            {/* Rapid Branding */}
            <div className="group">
              <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-6">
                {/* Using the custom laptop image with overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 via-purple-600/80 to-indigo-600/90 mix-blend-multiply z-10"></div>
                <img
                  src={RapidWorkLaptop}
                  alt="Rapid Works Laptop Display"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Content */}
                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between">
                  <div className="flex justify-between items-start w-full">
                  <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center">
                      <Megaphone className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                      Visibility
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">Rapid Branding</h3>
                    <p className="text-white/90 max-w-md mb-3">
                      Get visible to your market in 1 week cheaper than building it yourself!
                    </p>
                    <Link
                      to="/visibility"
                      className="inline-flex items-center gap-2 text-white font-medium bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
                    >
                      Learn more <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-r from-purple-400/30 to-indigo-400/30 rounded-full -translate-x-1/4 -translate-y-1/2 blur-xl z-0"></div>
              </div>
            </div>

            {/* Rapid Team */}
            <div className="group">
              <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-6">
                {/* Image with gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-blue-600/80 to-sky-600/90 mix-blend-multiply z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Team illustration"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Content */}
                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between">
                  <div className="flex justify-between items-start w-full">
                  <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                      Experts
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">Rapid Team</h3>
                    <p className="text-white/90 max-w-md mb-3">Find your expert the same day cheaper than own employees!</p>
                    <Link
                      to="/team"
                      className="inline-flex items-center gap-2 text-white font-medium bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
                    >
                      Learn more <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-r from-blue-400/30 to-sky-400/30 rounded-full -translate-x-1/4 -translate-y-1/2 blur-xl z-0"></div>
              </div>
            </div>
          </div>

          {/* Secondary Services */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Rapid Blueprint */}
            <div className="group">
              <div className="relative overflow-hidden rounded-2xl aspect-[3/2] mb-6">
                {/* Image with gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-indigo-600/80 to-indigo-800/90 mix-blend-multiply z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Blueprint illustration"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Content */}
                <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start w-full">
                    <div className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                </div>
                  <span className="text-xs font-medium text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                    Process
                  </span>
                </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Rapid Blueprint</h3>
                    <p className="text-white/90 max-w-md text-sm mb-3">
                  Own your processes in 1 week. You don't need dozens of tools!
                </p>
                    <Link
                      to="/blueprint"
                      className="inline-flex items-center gap-2 text-white font-medium bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm hover:bg-white/30 transition-all"
                    >
                      Learn more <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-1/2 right-0 w-40 h-40 bg-gradient-to-r from-indigo-400/30 to-indigo-600/30 rounded-full -translate-x-1/4 -translate-y-1/2 blur-xl z-0"></div>
              </div>
            </div>

            {/* Rapid Coaching */}
            <div className="group">
              <div className="relative overflow-hidden rounded-2xl aspect-[3/2] mb-6">
                {/* Using Yannick's profile image for coaching with overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/90 via-amber-600/80 to-amber-800/90 mix-blend-multiply z-10"></div>
                <img
                  src={YannickProfile}
                  alt="Coaching with Yannick"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Content */}
                <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start w-full">
                    <div className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center">
                      <Compass className="h-5 w-5 text-white" />
                </div>
                  <span className="text-xs font-medium text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                    Growth
                  </span>
                </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Rapid Coaching</h3>
                    <p className="text-white/90 max-w-md text-sm mb-3">
                  Unleash your full potential with year-round coaching by a veteran founder!
                </p>
                    <Link
                      to="/coaching"
                      className="inline-flex items-center gap-2 text-white font-medium bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm hover:bg-white/30 transition-all"
                    >
                      Learn more <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-1/2 right-0 w-40 h-40 bg-gradient-to-r from-amber-400/30 to-amber-600/30 rounded-full -translate-x-1/4 -translate-y-1/2 blur-xl z-0"></div>
              </div>
            </div>

            {/* Rapid Workshops */}
            <div className="group">
              <div className="relative overflow-hidden rounded-2xl aspect-[3/2] mb-6">
                {/* Image with gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 via-emerald-600/80 to-emerald-800/90 mix-blend-multiply z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1558403194-611308249627?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Workshops illustration"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Content */}
                <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start w-full">
                    <div className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center">
                      <Presentation className="h-5 w-5 text-white" />
                </div>
                  <span className="text-xs font-medium text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                    Knowledge
                  </span>
                </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Rapid Workshops</h3>
                    <p className="text-white/90 max-w-md text-sm mb-3">
                  Close your business knowledge gaps. Don't become reliant on consultants!
                </p>
                    <Link
                      to="/workshop"
                      className="inline-flex items-center gap-2 text-white font-medium bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm hover:bg-white/30 transition-all"
                    >
                      Learn more <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-1/2 right-0 w-40 h-40 bg-gradient-to-r from-emerald-400/30 to-emerald-600/30 rounded-full -translate-x-1/4 -translate-y-1/2 blur-xl z-0"></div>
              </div>
            </div>
          </div>

          {/* Financing Card - Special Design */}
          <div className="mb-16">
            <div className="relative overflow-hidden rounded-2xl h-auto min-h-[300px] md:h-80">
              {/* Image with gradient overlay - Using the specific image you requested */}
              <div className="absolute inset-0 bg-gradient-to-r from-rose-600/90 via-rose-600/80 to-orange-600/90 mix-blend-multiply z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1415&q=80"
                alt="Person using MacBook Pro with financial data"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />

              {/* Content */}
              <div className="absolute inset-0 z-20 p-6 md:p-12 flex flex-col md:flex-row items-center justify-between">
                <div className="mb-8 md:mb-0 w-full md:w-3/5">
                  <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                    <Euro className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3">Rapid Financing</h3>
                  <p className="text-white/90 text-sm md:text-lg mb-4">
                    Don't know how to finance your growth now? Did you know you can get up to 70% of our services subsidized?
                    There are multiple options, reach out to us to find out for free!
                  </p>
                  <Link to="/financing" className="inline-flex items-center gap-2 text-white font-medium bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg hover:bg-white/30 transition-all">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <button 
                  onClick={openCalendlyModal}
                  className="bg-white text-rose-600 px-8 py-4 rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  Free Consultation <ArrowRight className="h-5 w-5" />
                </button>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-rose-400/30 to-orange-400/30 rounded-full -translate-y-1/2 blur-xl z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Bundle Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTJlOGYwIiBzdHJva2Utd2lkdGg9IjEuNSI+PHBhdGggZD0iTTIgMmg1NnY1NkgyeiIvPjwvZz48L3N2Zz4=')] opacity-50 pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="bg-gradient-to-br from-black to-gray-800 rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 opacity-20 z-0">
              <img
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
                alt="Abstract background"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="md:flex relative z-10">
              <div className="md:w-1/2 p-10 md:p-16">
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm inline-block mb-8">
                  <Package className="h-12 w-12 text-white" />
                </div>

                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">Rapid Bundle</h3>
                <p className="text-white/80 text-xl mb-8">
                  Reach the next level with all our Services combined in one bundle!
                </p>

                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl mb-8">
                  <p className="text-white font-medium">
                    Think it's expensive? No, together with you we prepare the financing of our services and look out
                    for subsidies to make our services ridiculously cheap for you!
                  </p>
                </div>

                <Link to="/bundle" className="bg-white text-black px-8 py-4 rounded-full font-medium hover:shadow-lg hover:shadow-white/20 transition-all flex items-center gap-2 inline-flex">
                  Get Your Bundle <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              <div className="md:w-1/2 relative min-h-[300px]">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/30 rounded-full translate-y-1/2 -translate-x-1/4"></div>

                {/* Service icons in a grid - now with links */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-6 p-8">
                    {[
                      { icon: <Megaphone className="h-8 w-8" />, color: "bg-purple-500/20", path: "/" },
                      { icon: <Users className="h-8 w-8" />, color: "bg-blue-500/20", path: "/team" },
                      { icon: <FileText className="h-8 w-8" />, color: "bg-indigo-500/20", path: "/blueprint" },
                      { icon: <Compass className="h-8 w-8" />, color: "bg-amber-500/20", path: "/coaching" },
                      { icon: <Presentation className="h-8 w-8" />, color: "bg-emerald-500/20", path: "/workshop" },
                      { icon: <Euro className="h-8 w-8" />, color: "bg-rose-500/20", path: "/financing" },
                    ].map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        className={`${item.color} backdrop-blur-sm p-6 rounded-2xl flex items-center justify-center text-white hover:scale-105 transition-transform cursor-pointer`}
                      >
                        {item.icon}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Ready to accelerate your startup?</h3>
            <p className="text-xl text-gray-600 mb-10">
              Book a call with our team and discover how RapidWorks can help you build and scale your company.
            </p>
            <button
              onClick={openCalendly}
              className="px-8 py-4 bg-black hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 text-white rounded-full hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0px] transition-all duration-300 font-medium text-lg"
            >
              Book a Call Now
            </button>
          </div>
        </div>
      </section>

      {/* Add Calendly Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-2xl w-full max-w-7xl h-[95vh] relative flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-lg">Schedule a Free Consultation</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-grow relative">
              {isCalendlyLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
                  <Loader2 className="h-10 w-10 text-rose-600 animate-spin mb-4" />
                  <p className="text-gray-600">Loading scheduling calendar...</p>
                </div>
              )}
              <iframe
                ref={iframeRef}
                src="https://calendly.com/yannick-familie-heeren/30min?primary_color=dc2626&text_color=374151&hide_gdpr_banner=1&name_field=0&a1=Rapid%20Financing"
                width="100%"
                height="100%"
                frameBorder="0"
                title="Schedule a meeting"
                onLoad={handleIframeLoad}
                className={isCalendlyLoading ? "opacity-0" : "opacity-100"}
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

