"use client"

import { useEffect, useState } from "react"
import {
  Rocket,
  Package,
  Calendar,
  Check,
  ArrowRight,
  Euro,
  AlertCircle,
  Megaphone,
  Users,
  FileText,
  Compass,
  Presentation
} from "lucide-react"
import RapidWorksHeader from "./new_landing_page_header"
import EmailWaitlistForm from "./EmailWaitlistForm"

const BundlePage = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSubmit = (email) => {
    console.log("Email submitted:", email)
  }

  const openCalendly = () => {
    window.open('https://calendly.com/yannick-familie-heeren/30min?a1=Rapid%20Bundle', '_blank')
  }

  const bundleServices = [
    {
      title: "Rapid Branding",
      description: "Establish your market presence with a complete branding package",
      icon: <Megaphone className="h-5 w-5" />,
      color: "bg-purple-100",
      textColor: "text-purple-600"
    },
    {
      title: "Rapid Coaching",
      description: "Receive strategic guidance from experienced startup founders",
      icon: <Compass className="h-5 w-5" />,
      color: "bg-amber-100",
      textColor: "text-amber-600"
    },
    {
      title: "Rapid Team",
      description: "Access expert talent on-demand without the cost of full-time hires",
      icon: <Users className="h-5 w-5" />,
      color: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      title: "Rapid Blueprint",
      description: "Streamline your operational processes and tool infrastructure",
      icon: <FileText className="h-5 w-5" />,
      color: "bg-indigo-100",
      textColor: "text-indigo-600"
    },
    {
      title: "Rapid Workshops",
      description: "Build your team's knowledge with targeted training sessions",
      icon: <Presentation className="h-5 w-5" />,
      color: "bg-emerald-100",
      textColor: "text-emerald-600"
    },
    {
      title: "Rapid Financing",
      description: "Navigate subsidies and funding options for maximum value",
      icon: <Euro className="h-5 w-5" />,
      color: "bg-rose-100",
      textColor: "text-rose-600"
    }
  ]

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-gray-200 selection:text-gray-900">
      {/* Noise overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-30 pointer-events-none z-0"></div>

      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-gray-200 rounded-full filter blur-3xl opacity-20 -z-10 transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-gray-200 rounded-full filter blur-3xl opacity-20 -z-10 transform -translate-x-1/3 translate-y-1/3"></div>

      {/* Import shared header component */}
      <RapidWorksHeader />

      {/* Main Content */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Page intro */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center mb-5 px-4 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-gray-700 font-medium text-xs shadow-sm mx-auto">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Coming Soon
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              Rapid{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900">
                  Bundle
                </span>
                <span className="absolute bottom-2 left-0 w-full h-4 bg-gray-200 rounded-lg -z-10 opacity-70"></span>
              </span>
            </h1>

            <p className="text-xl text-gray-700 leading-relaxed">
              Focus on what really matters. Let us handle everything else.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Left Column - Bundle Info */}
            <div className="lg:w-1/2">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden shadow-xl relative mb-8">
                <div className="absolute inset-0 opacity-10">
                  <img
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
                    alt="Abstract background"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-8 relative z-10">
                  <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm inline-block mb-6">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-4">The Perfect Time to Start</h2>
                  <p className="text-white/90 text-lg mb-6 leading-relaxed">
                    There has never been a better time to found a startup in North Rhine Westphalia. 
                    Current subsidies can finance up to <span className="font-bold">70%</span> of your startup costs!
                  </p>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl mb-6">
                    <p className="text-white font-medium">
                      Our bundle provides everything your startup needs - from brand development to product creation, 
                      coaching to marketing. You focus on your vision while we handle the rest.
                    </p>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Euro className="h-5 w-5" /> 
                    Subsidized Excellence
                  </h3>
                  <p className="text-white/80 mb-6">
                    We'll help you navigate available subsidies and assist with your application - completely free of charge.
                    Schedule a call to discuss your financing options.
                  </p>
                  
                  <button
                    onClick={openCalendly}
                    className="bg-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 hover:text-white text-black px-8 py-4 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
                  >
                    Discuss Financing Options
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                <h3 className="text-xl font-bold mb-6">Everything Your Startup Needs</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bundleServices.map((service, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                      <div className={`${service.color} p-2 rounded-lg ${service.textColor}`}>
                        {service.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{service.title}</h4>
                        <p className="text-gray-600 text-sm">{service.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Email Form */}
            <div className="lg:w-1/2">
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gray-100 rounded-full -translate-y-1/2 translate-x-1/2 -z-10"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gray-100 rounded-full translate-y-1/2 -translate-x-1/2 -z-10"></div>
                
                <div className="relative z-10">
                  <div className="bg-gray-900 text-white p-8 rounded-2xl mb-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="bg-white/20 p-2 rounded-xl">
                        <AlertCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl mb-2">Limited Time Opportunity</h3>
                        <p className="text-white/80">
                          Current subsidies make this an unprecedented opportunity to launch or scale your startup with 
                          significant cost savings. Don't miss out!
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-500/20 p-1 rounded-full mt-1">
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                        <p className="text-white/90">Up to 70% of costs covered by subsidies</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-green-500/20 p-1 rounded-full mt-1">
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                        <p className="text-white/90">Free consultation on available financing options</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-green-500/20 p-1 rounded-full mt-1">
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                        <p className="text-white/90">Assistance with subsidy application process</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-700" />
                      Join the Waitlist
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Be the first to know when our comprehensive Rapid Bundle becomes available. 
                      We'll notify you with exclusive early access opportunities.
                    </p>
                    
                    <EmailWaitlistForm 
                      buttonText="Get Early Access"
                      successText="You're on the List!"
                      successDescription="Thank you for your interest in our Rapid Bundle. We'll notify you as soon as it's available."
                      checkboxText="I agree to receive updates about Rapid Bundle and financing options"
                      primaryColor="gray"
                      onSubmit={handleSubmit}
                    />
                  </div>
                  
                  <button
                    onClick={openCalendly}
                    className="w-full bg-black hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 text-white py-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Schedule a Free Consultation
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default BundlePage 