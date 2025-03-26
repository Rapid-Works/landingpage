"use client"

// import type React from "react"
import { useState, useEffect } from "react"
import {
  Rocket,
  ArrowRight,
  ChevronDown,
  Calendar,
  Users,
  DollarSign,
  Clock,
  Check,
  ChevronRight,
  Menu,
  X,
  Star,
  Shield,
  Zap,
} from "lucide-react"

// Import the header component from new_landing_page.jsx
import RapidWorksHeader from "./new_landing_page_header" 
// Import team profile images
import SamuelProfile from "../images/SamuelProfile.jpg"
import PrinceArdiabah from "../images/princeardiabah.jpg"

// Sample team member data
const teamMembers = [
  {
    id: 1,
    name: "Prince Ardiabah",
    role: "Marketing Expert",
    image: PrinceArdiabah, // Using Prince's profile image
    calendlyLink: "https://calendly.com/example-link",
    skills: ["Strategic Marketing Planning", "Content Marketing & SEO", "Social Media Advertisement"],
    color: "from-purple-600 to-indigo-600",
    lightColor: "bg-purple-100",
    textColor: "text-purple-700",
    accentColor: "border-purple-300",
    quote: "Driving growth through strategic digital marketing solutions",
    experience: "8+ years",
  },
  {
    id: 2,
    name: "Samuel Donkor",
    role: "Software Expert",
    image: SamuelProfile, // Using Samuel's profile image
    calendlyLink: "https://calendly.com/example-link",
    skills: ["Full Stack Development", "Agile Software Development", "Cloud Computing & DevOps"],
    color: "from-blue-600 to-sky-600",
    lightColor: "bg-blue-100",
    textColor: "text-blue-700",
    accentColor: "border-blue-300",
    quote: "Building scalable solutions with cutting-edge technologies",
    experience: "5+ years",
  },
  {
    id: 3,
    name: "Coming Soon",
    role: "Design Expert",
    image: null,
    calendlyLink: "https://calendly.com/example-link",
    skills: ["UI/UX Design", "Prototyping & Wireframing", "Brand Identity Design"],
    color: "from-rose-600 to-pink-600",
    lightColor: "bg-rose-100",
    textColor: "text-rose-700",
    accentColor: "border-rose-300",
    quote: "Creating beautiful, functional designs that delight users",
    experience: null,
  },
  {
    id: 4,
    name: "Coming Soon",
    role: "Finance Expert",
    image: null,
    calendlyLink: "https://calendly.com/example-link",
    skills: ["Financial Planning & Analysis", "Investment Strategy", "Accounting & Tax Optimization"],
    color: "from-emerald-600 to-teal-600",
    lightColor: "bg-emerald-100",
    textColor: "text-emerald-700",
    accentColor: "border-emerald-300",
    quote: "Optimizing financial strategies for sustainable growth",
    experience: null,
  },
]

// Benefits data
const benefits = [
  {
    id: 1,
    text: "No upfront cost",
    icon: <DollarSign className="h-5 w-5" />,
    description: "Start working with our experts without any initial investment",
  },
  {
    id: 2,
    text: "Cheaper than german salaries",
    icon: <Check className="h-5 w-5" />,
    description: "Save up to 70% compared to hiring locally in Germany",
  },
  {
    id: 3,
    text: "Pay by the hour",
    icon: <Clock className="h-5 w-5" />,
    description: "Flexible payment model - only pay for the time you need",
  },
  {
    id: 4,
    text: "Always available",
    icon: <Calendar className="h-5 w-5" />,
    description: "Our experts are ready to start within a day",
  },
  {
    id: 5,
    text: "First hour for free",
    icon: <Star className="h-5 w-5" />,
    description: "Try our services with no risk or obligation",
  },
]

const TeamPage = () => {
  const [activeTab, setActiveTab] = useState("team")

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-purple-200 selection:text-purple-900">
      {/* Noise overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-30 pointer-events-none z-0"></div>

      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-purple-200 rounded-full filter blur-3xl opacity-20 -z-10 transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-blue-200 rounded-full filter blur-3xl opacity-20 -z-10 transform -translate-x-1/3 translate-y-1/3"></div>

      {/* Import header from new_landing_page.jsx instead of using the built-in header */}
      <RapidWorksHeader />

      {/* Main Content */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Page intro */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
              <div className="inline-block mb-4 px-4 py-1.5 bg-purple-100 rounded-full text-purple-700 font-medium text-sm">
                Rapid Team
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              We have all the{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                  Expertise
                </span>
                <span className="absolute bottom-2 left-0 w-full h-4 bg-purple-200 rounded-lg -z-10 opacity-70"></span>
              </span>{" "}
              you need
            </h1>

            <p className="text-xl text-gray-700 leading-relaxed">
              Why build an expensive team in Germany with 3+ months of hiring time when our team can start work on your
              project in just 1 day?
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Left Column - Benefits */}
            <div className="lg:w-5/12 lg:sticky lg:top-32">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Shield className="h-6 w-6 text-purple-600" />
                    <span>Why Choose Our Team?</span>
                  </h2>

                  {/* Benefits */}
                  <div className="space-y-4">
                    {benefits.map((benefit) => (
                      <div
                        key={benefit.id}
                        className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                      >
                        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-3 rounded-xl text-white shadow-md">
                          {benefit.icon}
              </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{benefit.text}</h3>
                          <p className="text-gray-600 text-sm mt-1">{benefit.description}</p>
                </div>
                  </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <button className="text-purple-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                      Discover more benefits <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                  <h3 className="text-xl font-bold text-white mb-4 relative z-10">Ready to get started?</h3>
                  <p className="text-white/80 mb-6 relative z-10">
                    Book a free consultation and experience our expertise firsthand.
                  </p>

                  <button className="group w-full py-4 bg-white text-purple-700 rounded-xl hover:shadow-xl hover:shadow-purple-700/20 transition-all duration-300 font-medium flex items-center justify-center gap-3 relative z-10">
                    Get your first hour free
                    <span className="bg-purple-100 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Team Members */}
            <div className="lg:w-7/12">
              <div className="grid md:grid-cols-2 gap-8">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    {/* Header with gradient */}
                    <div className={`h-24 bg-gradient-to-r ${member.color} relative overflow-hidden`}>
                      {/* Decorative circles */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                      {/* Role badge */}
                      <div className="absolute bottom-0 right-0 m-4">
                        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm font-medium">
                          {member.role}
                        </div>
                      </div>
              </div>

                    {/* Profile section */}
                    <div className="px-8 pt-8 pb-6 relative">
                      {/* Profile image - positioned to overlap the header */}
                      <div className="absolute -top-12 left-8">
                        {member.image ? (
                          <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                            <img
                              src={member.image || "/placeholder.svg"}
                              alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                        ) : (
                          <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <Users className="h-10 w-10 text-gray-400" />
                  </div>
                        )}
                  </div>

                      {/* Name and quote */}
                      <div className="mt-12">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                        <p className={`${member.textColor} text-sm italic mb-4`}>"{member.quote}"</p>
                  </div>
                </div>

                    {/* Skills section */}
                    <div className="px-8 pb-8">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Expertise</h4>
                      <div className="space-y-2">
                        {member.skills.map((skill, index) => (
                          <div
                            key={index}
                            className={`${member.lightColor} ${member.textColor} px-4 py-2 rounded-lg text-sm font-medium`}
                          >
                            {skill}
              </div>
                        ))}
            </div>

                      <div className="mt-4">
                        <button
                          className={`${member.textColor} font-medium text-sm`}
                        >
                          ...and more
                        </button>
                  </div>
                  </div>
                  </div>
                ))}
              </div>

              {/* Team expansion note */}
              <div className="mt-12 bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold mb-3">Our team is growing!</h3>
                <p className="text-gray-700 mb-4">
                  We're constantly expanding our team of experts to better serve your needs. Check back soon to meet our
                  new Design and Finance specialists.
                </p>
                <button className="text-purple-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  Get notified when new experts join <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TeamPage

