"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"

export default function RapidWorksPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-purple-200 selection:text-purple-900">
      {/* Noise overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-30 pointer-events-none z-0"></div>

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-3 bg-white/80 backdrop-blur-lg shadow-sm" : "py-6 bg-transparent"}`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center group">
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
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              {[
                { name: "Branding", icon: <Paintbrush className="h-4 w-4" /> },
                { name: "Team", icon: <Users className="h-4 w-4" /> },
                { name: "Blueprint", icon: <FileText className="h-4 w-4" /> },
                { name: "Coaching", icon: <BookOpen className="h-4 w-4" /> },
                { name: "Workshops", icon: <Presentation className="h-4 w-4" /> },
                { name: "Financing", icon: <DollarSign className="h-4 w-4" /> },
                { name: "Bundle", icon: <Package className="h-4 w-4" /> },
              ].map((item) => (
                <button
                  key={item.name}
                  className="px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-gray-100 transition-all duration-300 text-gray-700 font-medium text-xs"
                >
                  {item.icon}
                  {item.name}
                </button>
              ))}

              <button className="ml-4 px-8 py-2.5 bg-black text-white rounded-full hover:shadow-lg hover:translate-y-[-2px] active:translate-y-[0px] transition-all duration-300 font-medium text-sm">
                Book a Call
              </button>

              <div className="text-gray-600 font-medium ml-2">
                <select className="bg-transparent border-none focus:ring-0 cursor-pointer text-sm">
                  <option>EN</option>
                  <option>DE</option>
                </select>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-3">
              <button className="px-5 py-2 bg-black text-white rounded-full hover:bg-gray-900 transition-all duration-300 font-medium text-sm">
                Book a Call
              </button>
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
            {[
              { name: "Branding", icon: <Paintbrush className="h-4 w-4" /> },
              { name: "Team", icon: <Users className="h-4 w-4" /> },
              { name: "Blueprint", icon: <FileText className="h-4 w-4" /> },
              { name: "Coaching", icon: <BookOpen className="h-4 w-4" /> },
              { name: "Workshops", icon: <Presentation className="h-4 w-4" /> },
              { name: "Financing", icon: <DollarSign className="h-4 w-4" /> },
              { name: "Bundle", icon: <Package className="h-4 w-4" /> },
            ].map((item) => (
              <button
                key={item.name}
                className="px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition-all duration-300 text-gray-700 font-medium w-full text-left"
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </div>
        )}
      </header>

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
                <span className="relative z-10">Startups</span>
                <span className="absolute bottom-2 left-0 w-full h-4 bg-red-300 rounded-lg -z-10 opacity-70"></span>
              </span>
            </h2>

            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-600 leading-relaxed mb-10">
              Being a founder is the hardest job in the world. With our services we adress the main challenges of
              building an aspiring company.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-4 bg-black text-white rounded-full hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0px] transition-all duration-300 font-medium">
                Get Started
              </button>
              <button className="px-8 py-4 bg-white border border-gray-200 text-gray-800 rounded-full hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0px] transition-all duration-300 font-medium">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 relative">
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
                {/* Image with gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 via-purple-600/80 to-indigo-600/90 mix-blend-multiply z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Branding illustration"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Content */}
                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between">
                  <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center">
                    <Paintbrush className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">Rapid Branding</h3>
                    <p className="text-white/90 max-w-md">
                      Get visible to your market in 1 week cheaper than building it yourself!
                    </p>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-r from-purple-400/30 to-indigo-400/30 rounded-full -translate-x-1/4 -translate-y-1/2 blur-xl z-0"></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Starting at</span>
                <button className="flex items-center gap-2 text-purple-600 font-medium group-hover:gap-3 transition-all">
                  Learn more <ArrowRight className="h-4 w-4" />
                </button>
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
                  <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">Rapid Team</h3>
                    <p className="text-white/90 max-w-md">Find your expert the same day cheaper than own employees!</p>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-r from-blue-400/30 to-sky-400/30 rounded-full -translate-x-1/4 -translate-y-1/2 blur-xl z-0"></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Starting at</span>
                <button className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
                  Learn more <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Services */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Rapid Blueprint */}
            <div className="group bg-white hover:bg-gray-50 rounded-2xl transition-colors duration-300 overflow-hidden shadow-sm hover:shadow-md">
              <div className="relative h-40 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-indigo-800/90 z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Blueprint illustration"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 z-20 bg-white/20 backdrop-blur-md p-3 rounded-xl">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="absolute top-4 right-4 z-20">
                  <span className="text-xs font-medium text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                    Process
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-600 transition-colors">
                  Rapid Blueprint
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Own your processes in 1 week. You don't need dozens of tools!
                </p>

                <div className="pt-4 border-t border-gray-100">
                  <button className="text-indigo-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Rapid Coaching */}
            <div className="group bg-white hover:bg-gray-50 rounded-2xl transition-colors duration-300 overflow-hidden shadow-sm hover:shadow-md">
              <div className="relative h-40 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/90 to-amber-800/90 z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Coaching illustration"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 z-20 bg-white/20 backdrop-blur-md p-3 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="absolute top-4 right-4 z-20">
                  <span className="text-xs font-medium text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                    Growth
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-amber-600 transition-colors">Rapid Coaching</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Unleash your full potential with year-round coaching by a veteran founder!
                </p>

                <div className="pt-4 border-t border-gray-100">
                  <button className="text-amber-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Rapid Workshops */}
            <div className="group bg-white hover:bg-gray-50 rounded-2xl transition-colors duration-300 overflow-hidden shadow-sm hover:shadow-md">
              <div className="relative h-40 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-emerald-800/90 z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1558403194-611308249627?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Workshops illustration"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 z-20 bg-white/20 backdrop-blur-md p-3 rounded-xl">
                  <Presentation className="h-6 w-6 text-white" />
                </div>
                <div className="absolute top-4 right-4 z-20">
                  <span className="text-xs font-medium text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                    Knowledge
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-emerald-600 transition-colors">
                  Rapid Workshops
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Close your business knowledge gaps. Don't become reliant on consultants!
                </p>

                <div className="pt-4 border-t border-gray-100">
                  <button className="text-emerald-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Financing Card - Special Design */}
          <div className="mb-16">
            <div className="relative overflow-hidden rounded-2xl h-80">
              {/* Image with gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-rose-600/90 via-rose-600/80 to-orange-600/90 mix-blend-multiply z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                alt="Financing illustration"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />

              {/* Content */}
              <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3">Rapid Financing</h3>
                  <p className="text-white/90 max-w-md text-lg">
                    Don't know how to finance your growth now? Reach out to us!
                  </p>
                </div>

                <button className="bg-white text-rose-600 px-8 py-4 rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2">
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
                  Reach the next level with all our services in one epic bundle!
                </p>

                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl mb-8">
                  <p className="text-white font-medium">
                    Think it's expensive? No, together with you we prepare the financing of our services and look out
                    for subsidies to make our services ridiculously cheap for you!
                  </p>
                </div>

                <button className="bg-white text-black px-8 py-4 rounded-full font-medium hover:shadow-lg hover:shadow-white/20 transition-all flex items-center gap-2">
                  Get the Bundle <ArrowRight className="h-5 w-5" />
                </button>
              </div>

              <div className="md:w-1/2 relative min-h-[300px]">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/30 rounded-full translate-y-1/2 -translate-x-1/4"></div>

                {/* Service icons in a grid */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-6 p-8">
                    {[
                      { icon: <Paintbrush className="h-8 w-8" />, color: "bg-purple-500/20" },
                      { icon: <Users className="h-8 w-8" />, color: "bg-blue-500/20" },
                      { icon: <FileText className="h-8 w-8" />, color: "bg-indigo-500/20" },
                      { icon: <BookOpen className="h-8 w-8" />, color: "bg-amber-500/20" },
                      { icon: <Presentation className="h-8 w-8" />, color: "bg-emerald-500/20" },
                      { icon: <DollarSign className="h-8 w-8" />, color: "bg-rose-500/20" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className={`${item.color} backdrop-blur-sm p-6 rounded-2xl flex items-center justify-center text-white`}
                      >
                        {item.icon}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Ready to accelerate your startup?</h3>
            <p className="text-xl text-gray-600 mb-10">
              Book a call with our team and discover how RapidWorks can help you build and scale your company.
            </p>
            <button className="px-8 py-4 bg-black text-white rounded-full hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0px] transition-all duration-300 font-medium text-lg">
              Book a Call Now
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

