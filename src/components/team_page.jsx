"use client"

// import type React from "react"
import { useState, useEffect, useContext, useRef } from "react"
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
  Code,
  Megaphone,
  Palette,
  Euro,
  Loader2,
  Landmark,
  Tag
} from "lucide-react"
import RapidWorksHeader from "./new_landing_page_header" 
import { LanguageContext as AppLanguageContext } from "../App"
import ExploreMoreSection from "./ExploreMoreSection" // Import the new component

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
    icon: <Megaphone className="h-5 w-5" />,
    calendlyLink: "https://calendly.com/example-link",
    skills: ["Digital Marketing", "SEO", "Content Strategy"],
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
    icon: <Code className="h-5 w-5" />,
    calendlyLink: "https://calendly.com/example-link",
    skills: ["Backend Development", "Frontend Development", "API Integration"],
    color: "from-purple-600 to-indigo-600",
    lightColor: "bg-purple-100",
    textColor: "text-purple-700",
    accentColor: "border-purple-300",
    quote: "Building scalable solutions with cutting-edge technologies",
    experience: "5+ years",
  },
  {
    id: 3,
    name: "Coming Soon",
    role: "Design Expert",
    image: null,
    icon: <Palette className="h-5 w-5" />,
    calendlyLink: "https://calendly.com/example-link",
    skills: ["UI/UX Design", "Branding", "Visual Design"],
    color: "from-purple-600 to-indigo-600",
    lightColor: "bg-purple-100",
    textColor: "text-purple-700",
    accentColor: "border-purple-300",
    quote: "Creating beautiful, functional designs that delight users",
    experience: null,
  },
  {
    id: 4,
    name: "Coming Soon",
    role: "Finance Expert",
    image: null,
    icon: <Euro className="h-5 w-5" />,
    calendlyLink: "https://calendly.com/example-link",
    skills: ["Financial Planning", "Investment Strategy", "Budget Management"],
    color: "from-purple-600 to-indigo-600",
    lightColor: "bg-purple-100",
    textColor: "text-purple-700",
    accentColor: "border-purple-300",
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
    text: "Up to 70% cheaper with subsidies",
    icon: <Landmark className="h-5 w-5" />,
    description: "Save significantly with our Rapid Financing subsidy solutions",
    linkTo: "/financing",
    linkText: "Learn about subsidies"
  },
  {
    id: 5,
    text: "First hour for free",
    icon: <Tag className="h-5 w-5" />,
    description: "Try our services with no risk or obligation",
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
]

const TeamPage = () => {
  const context = useContext(AppLanguageContext)
  const [isLoading, setIsLoading] = useState(true)
  const benefitsRef = useRef(null)

  useEffect(() => {
    if (context) {
      setIsLoading(false);
    }
  }, [context]);

  const scrollToBenefits = () => {
    benefitsRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const pageContent = {
    en: {
      pageTitle: "Rapid Experts",
      hero: {
        title1: "All the ",
        titleHighlight: "Expertise",
        title2: " you need",
        subtitle: "Why build an expensive team in Germany with 3+ months of hiring time when our team can start work on your project in just 1 day?",
        scrollIndicatorAria: "Scroll to benefits"
      },
      benefits: {
        title: "Why Choose The Rapid Experts?",
        items: [
          { text: "No upfront cost", description: "Start working with our experts without any initial investment" },
          { text: "Up to 70% cheaper with subsidies", description: "Save significantly with our Rapid Financing subsidy solutions", linkText: "Learn about subsidies" },
          { text: "First hour for free", description: "Try our services with no risk or obligation" },
          { text: "Pay by the hour", description: "Flexible payment model - only pay for the time you need" },
          { text: "Always available", description: "Our experts are ready to start within a day" },
        ],
        discoverMore: "Discover more benefits",
      },
      cta: {
        title: "Ready to get started?",
        description: "Book a free consultation and experience our expertise firsthand.",
        buttonText: "Get your first hour free",
      },
      team: {
        expertiseTitle: "Expertise",
        moreSkills: "...and more",
        growingTitle: "Our team is growing!",
        growingDescription: "We're constantly expanding our team of experts to better serve your needs. Check back soon to meet our new Design and Finance specialists.",
        getNotified: "Get notified when new experts join",
        comingSoon: "Coming Soon"
      },
      memberRoles: {
        "Marketing Expert": "Marketing Expert",
        "Software Expert": "Software Expert",
        "Design Expert": "Design Expert",
        "Finance Expert": "Finance Expert",
      },
      memberQuotes: {
        "prince": "Driving growth through strategic digital marketing solutions",
        "samuel": "Building scalable solutions with cutting-edge technologies",
        "design": "Creating beautiful, functional designs that delight users",
        "finance": "Optimizing financial strategies for sustainable growth",
      },
      memberExperienceSuffix: "years"
    },
    de: {
      pageTitle: "Rapid Experts",
      hero: {
        title1: "",
        titleHighlight: "Alle Expertise",
        title2: ", die du brauchst",
        subtitle: "Warum ein teures Team in Deutschland aufbauen mit 3+ Monaten Einstellungszeit, wenn unser Team in nur 1 Tag mit der Arbeit an deinem Projekt beginnen kann?",
        scrollIndicatorAria: "Zu den Vorteilen scrollen"
      },
      benefits: {
        title: "Warum die Rapid Experts wählen?",
        items: [
          { text: "Keine Vorauskosten", description: "Beginne die Zusammenarbeit mit unseren Experten ohne anfängliche Investition" },
          { text: "Bis zu 70% günstiger mit Förderungen", description: "Spare erheblich mit unseren Rapid Financing Förderlösungen", linkText: "Erfahre mehr über Förderungen" },
          { text: "Erste Stunde kostenlos", description: "Teste unsere Dienstleistungen ohne Risiko oder Verpflichtung" },
          { text: "Stundenweise bezahlen", description: "Flexibles Zahlungsmodell - bezahle nur für die Zeit, die du benötigst" },
          { text: "Immer verfügbar", description: "Unsere Experten sind bereit, innerhalb eines Tages zu starten" },
        ],
        discoverMore: "Entdecke weitere Vorteile",
      },
      cta: {
        title: "Bereit loszulegen?",
        description: "Buche eine kostenlose Beratung und erlebe unsere Expertise aus erster Hand.",
        buttonText: "Sichere dir deine erste Stunde kostenlos",
      },
      team: {
        expertiseTitle: "Expertise",
        moreSkills: "...und mehr",
        growingTitle: "Unser Team wächst!",
        growingDescription: "Wir erweitern ständig unser Expertenteam, um deine Bedürfnisse besser zu erfüllen. Schau bald wieder vorbei, um unsere neuen Design- und Finanzspezialisten kennenzulernen.",
        getNotified: "Benachrichtigt werden, wenn neue Experten beitreten",
        comingSoon: "Demnächst verfügbar"
      },
      memberRoles: {
        "Marketing Expert": "Marketing Experte",
        "Software Expert": "Software Experte",
        "Design Expert": "Design Experte",
        "Finance Expert": "Finanz Experte",
      },
      memberQuotes: {
        "prince": "Wachstum durch strategische digitale Marketinglösungen vorantreiben",
        "samuel": "Skalierbare Lösungen mit Spitzentechnologien entwickeln",
        "design": "Schöne, funktionale Designs schaffen, die Benutzer begeistern",
        "finance": "Finanzstrategien für nachhaltiges Wachstum optimieren",
      },
      memberExperienceSuffix: "Jahre"
    }
  }

  if (isLoading || !context) {
     return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-purple-600" /></div>;
  }

  const { language } = context;
  const content = pageContent[language];

  const benefitsContent = content.benefits.items;

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-purple-200 selection:text-purple-900">
      {/* Noise overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-30 pointer-events-none z-0"></div>

      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full filter blur-3xl opacity-20 -z-10 transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-indigo-200 to-pink-200 rounded-full filter blur-3xl opacity-20 -z-10 transform -translate-x-1/3 translate-y-1/3"></div>
      <div className="fixed bottom-1/2 right-1/4 w-1/4 h-1/4 bg-gradient-to-br from-amber-200 to-emerald-200 rounded-full filter blur-3xl opacity-10 -z-10"></div>

      {/* Import header from new_landing_page.jsx instead of using the built-in header */}
      <RapidWorksHeader />

      {/* Hero Section Wrapper */}
      <section className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 pt-28 pb-28">
          {/* Page intro */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center mb-4 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium text-sm">
              <Users className="h-4 w-4 inline mr-1.5" />
              {content.pageTitle}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-white">
              {content.hero.title1} 
              {content.hero.titleHighlight && (
                <span className="relative inline-block">
                  <span className="relative z-10">
                    {content.hero.titleHighlight}
                  </span>
                  <span className="absolute bottom-2 left-0 w-full h-4 bg-white/20 rounded-lg -z-10"></span>
                </span>
              )}
              {content.hero.title2}
            </h1>

            <p className="text-xl text-white/90 leading-relaxed">
              {content.hero.subtitle}
            </p>
          </div>
        </div>

        {/* Scroll Down Arrow */}
        <button 
          onClick={scrollToBenefits}
          className="absolute bottom-6 left-0 right-0 flex justify-center animate-bounce cursor-pointer bg-transparent border-none focus:outline-none"
          aria-label={content.hero.scrollIndicatorAria}
        >
          <svg className="w-8 h-8 text-white/70 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </section>

      {/* Main Content - Add ref to the benefits container */}
      <main className="py-20">
        <div className="container mx-auto px-6">
          {/* Add ref={benefitsRef} to the container holding the benefits section */}
          <div ref={benefitsRef} className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Left Column - Benefits */}
            <div className="lg:w-5/12 lg:sticky lg:top-32">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Shield className="h-6 w-6 text-purple-600" />
                    <span>{content.benefits.title}</span>
                  </h2>

                  {/* Benefits */}
                  <div className="space-y-4">
                    {benefitsContent.map((benefit, index) => {
                      const gradients = [
                        "from-purple-600 to-indigo-600",
                        "from-blue-600 to-indigo-600",
                        "from-rose-500 to-pink-600",
                        "from-amber-500 to-orange-600",
                        "from-emerald-500 to-teal-600"
                      ];
                      const gradient = gradients[index % gradients.length];
                      const originalBenefit = benefits[index];
                      
                      return (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                        >
                          <div className={`bg-gradient-to-br ${gradient} p-3 rounded-xl text-white shadow-md`}>
                            {originalBenefit?.icon || <Star className="h-5 w-5" />}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{benefit.text}</h3>
                            <p className="text-gray-600 text-sm mt-1">{benefit.description}</p>
                            {benefit.linkText && (
                              <a 
                                href={originalBenefit?.linkTo}
                                className="text-purple-600 text-sm font-medium mt-1 flex items-center gap-1 hover:gap-2 transition-all"
                              >
                                {benefit.linkText} <ChevronRight className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <button className="text-purple-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                      {content.benefits.discoverMore} <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                  <h3 className="text-xl font-bold text-white mb-4 relative z-10">{content.cta.title}</h3>
                  <p className="text-white/80 mb-6 relative z-10">
                    {content.cta.description}
                  </p>

                  <button className="group w-full py-4 bg-white text-purple-700 rounded-xl hover:shadow-xl hover:shadow-purple-700/20 transition-all duration-300 font-medium flex items-center justify-center gap-3 relative z-10">
                    {content.cta.buttonText}
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
                {teamMembers.map((member) => {
                  const memberName = member.name === "Coming Soon" ? content.team.comingSoon : member.name;
                  const memberRole = content.memberRoles[member.role] || member.role;
                  let memberQuote;
                  if (member.id === 1) memberQuote = content.memberQuotes.prince;
                  else if (member.id === 2) memberQuote = content.memberQuotes.samuel;
                  else if (member.id === 3) memberQuote = content.memberQuotes.design;
                  else if (member.id === 4) memberQuote = content.memberQuotes.finance;
                  else memberQuote = member.quote;

                  return (
                  <div
                    key={member.id}
                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    {/* Header with gradient */}
                    <div className={`h-24 bg-gradient-to-r ${member.color} relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                      {/* Role badge */}
                      <div className="absolute bottom-0 right-0 m-4">
                        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm font-medium flex items-center gap-2">
                          {member.icon}
                            {memberRole}
                        </div>
                      </div>
                    </div>

                    {/* Profile section */}
                    <div className="px-8 pt-8 pb-6 relative">
                      <div className="absolute -top-12 left-8">
                        {member.image ? (
                          <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                            <img
                                src={member.image}
                                alt={memberName}
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
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{memberName}</h3>
                          <p className={`${member.textColor} text-sm italic mb-4`}>"{memberQuote}"</p>
                  </div>
                </div>

                    {/* Skills section */}
                    <div className="px-8 pb-8">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{content.team.expertiseTitle}</h4>
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
                            {content.team.moreSkills}
                        </button>
                  </div>
                  </div>
                  </div>
                  )
                })}
              </div>

              {/* Team expansion note */}
              <div className="mt-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSJub25lIj48Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMiIgZmlsbD0iI0UwRTdGRiIvPjwvc3ZnPg==')] opacity-20"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700">{content.team.growingTitle}</h3>
                  <p className="text-gray-700 mb-4">
                    {content.team.growingDescription}
                  </p>
                  <button className="text-purple-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                    {content.team.getNotified} <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Add the new component */}
      <ExploreMoreSection excludeService="Experts" />

    </div>
  )
}

export default TeamPage

