"use client"

// Correctly import the image
import YannickProfile from "../images/yannickprofile.jpg"
import { useState } from "react"
import { ArrowRight, BookOpen, Calendar, Check, Target, TrendingUp, MessageSquare } from "lucide-react"
import RapidWorksHeader from "./new_landing_page_header"

// Single coach data
const coach = {
  name: "Yannick Heeren",
  role: "Lead Startup Strategist",
  // Correctly use the imported image - no curly braces needed
  image: YannickProfile,
  bio: "Former founder with multiple successful ventures and over 15 years of experience in the startup ecosystem. Yannick specializes in go-to-market strategy, product-market fit, and scaling operations for early-stage companies. He has helped over 50 startups achieve significant growth and secure funding.",
  expertise: [
    "Product Strategy", 
    "Market Validation", 
    "Growth Hacking", 
    "Pitch Development", 
    "Investor Relations",
    "Team Building"
  ],
    experience: "15+ years",
  education: "MSc in Business Strategy, University of Amsterdam",
  achievements: [
    "Led multiple companies to successful exits",
    "Helped startups raise over €50M in funding",
    "Published author on startup methodology",
    "Guest lecturer at leading business schools"
  ]
}

const CoachingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-purple-200 selection:text-purple-900">
      {/* Noise overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-30 pointer-events-none z-0"></div>

      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-purple-200 rounded-full filter blur-3xl opacity-20 -z-10 transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-blue-200 rounded-full filter blur-3xl opacity-20 -z-10 transform -translate-x-1/3 translate-y-1/3"></div>

      {/* Replace custom header with shared header component */}
      <RapidWorksHeader />

      {/* Main Content */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Page intro */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-block mb-4 px-4 py-1.5 bg-purple-100 rounded-full text-purple-700 font-medium text-sm">
              <BookOpen className="h-4 w-4 inline mr-1" />
              Rapid Coaching
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              Unleash your{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                  Full Potential
                </span>
                <span className="absolute bottom-2 left-0 w-full h-4 bg-purple-200 rounded-lg -z-10 opacity-70"></span>
              </span>
            </h1>

            <p className="text-xl text-gray-700 leading-relaxed">
              Year-round coaching by veteran founders who have been in your shoes and know what it takes to succeed.
            </p>
          </div>

          {/* Hero Section */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl overflow-hidden mb-20 relative">
            <div className="absolute inset-0 opacity-10">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Coaching session"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative z-10 p-8 md:p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Founder Coaching Matters</h2>
              <p className="text-white/90 text-lg mb-8 mx-auto max-w-3xl">
                  Being a founder is the hardest job in the world. Our coaching program provides the guidance,
                  accountability, and support you need to navigate challenges and accelerate your growth.
                </p>

              <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-medium hover:shadow-lg hover:shadow-purple-900/20 transition-all flex items-center gap-2 group mx-auto">
                  Schedule a Free Session
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
          </div>

          {/* Single Coach Profile Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Your Coach</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Work directly with an experienced founder who understands the challenges and opportunities of building a successful startup.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 max-w-5xl mx-auto">
              <div className="md:flex">
                <div className="md:w-2/5">
                  <div className="h-full relative">
                    <img
                      src={coach.image}
                      alt={coach.name}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent md:bg-gradient-to-r"></div>
                    <div className="absolute bottom-0 left-0 p-6 md:p-8">
                      <div className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full inline-block mb-2">
                        {coach.experience}
                      </div>
                      <h3 className="text-2xl font-bold text-white">{coach.name}</h3>
                      <p className="text-white/80">{coach.role}</p>
                      <p className="text-white/70 text-sm mt-1">{coach.education}</p>
                    </div>
                  </div>
                </div>

                <div className="md:w-3/5 p-6 md:p-8">
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    {coach.bio}
                  </p>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Key Achievements</h4>
                    <ul className="space-y-2">
                      {coach.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="text-purple-600 mt-1">
                            <Check className="h-4 w-4" />
                          </div>
                          <span className="text-gray-700">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Areas of Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {coach.expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="w-full py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 mt-6">
                    <Calendar className="h-5 w-5" />
                    Schedule a Session with Yannick
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Section - Simple Version */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How Our Coaching Works</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                A structured approach designed to deliver measurable results for your business.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="mb-4">
                  <div className="bg-purple-100 p-3 rounded-xl inline-block">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Initial Assessment</h3>
                <p className="text-gray-600">
                  We start with a comprehensive assessment of your business, goals, challenges, and opportunities.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="mb-4">
                  <div className="bg-purple-100 p-3 rounded-xl inline-block">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Strategy Development</h3>
                <p className="text-gray-600">
                  Together, we create a customized coaching plan with clear objectives and key results (OKRs).
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="mb-4">
                  <div className="bg-purple-100 p-3 rounded-xl inline-block">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Regular Sessions</h3>
                <p className="text-gray-600">
                  Ongoing coaching sessions focused on implementation, problem-solving, and accountability.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div className="mb-4">
                  <div className="bg-purple-100 p-3 rounded-xl inline-block">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Measure & Adjust</h3>
                <p className="text-gray-600">
                  Regular progress reviews to celebrate wins, learn from setbacks, and refine your strategy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CoachingPage

