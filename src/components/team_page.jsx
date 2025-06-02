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
  Tag,
  MessageSquareText
} from "lucide-react"
import RapidWorksHeader from "./new_landing_page_header" 
import { LanguageContext as AppLanguageContext } from "../App"
import ExploreMoreSection from "./ExploreMoreSection" // Import the new component
import { testimonials } from "../testimonialsData"
import TestimonialCard from "./TestimonialCard"
import ExpertRequestModal from "./ExpertRequestModal" // <-- Import the new modal
import { submitExpertRequestToAirtable } from '../utils/airtableService' // <-- Import the Airtable function

// Import team profile images
import SamuelProfile from "../images/SamuelProfile.jpg"
import PrinceArdiabah from "../images/princeardiabah.png"

// Sample team member data
const teamMembers = [
  {
    id: 1,
    name: "Prince Ardiabah",
    role: "Marketing Expert",
    image: PrinceArdiabah,
    icon: <Megaphone className="h-5 w-5" />,
    calendlyLink: "https://calendly.com/princeardiabah/15min",
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
    image: SamuelProfile,
    icon: <Code className="h-5 w-5" />,
    calendlyLink: "https://calendly.com/calvinsamueldonkor/15min",
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
    calendlyLink: null,
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
    calendlyLink: null,
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

// +++ Add Experts Testimonials Section +++
const ExpertsTestimonialsSection = ({ content }) => {
  const expertsTestimonials = testimonials.filter(
    t => t.services.includes("experts") // Find experts testimonials
  );

  if (expertsTestimonials.length === 0) {
    return null;
  }

  const gridColsClass = `grid-cols-1 ${
    expertsTestimonials.length >= 2 ? 'md:grid-cols-2' : ''
  } ${
    expertsTestimonials.length >= 3 ? 'lg:grid-cols-3' : ''
  }`;

  return (
    <section className="py-24 bg-blue-50"> {/* Use blue theme background */}
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
           <span className="inline-flex items-center gap-2 text-blue-600 text-sm uppercase tracking-wider font-light mb-4 px-4 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm">
              <MessageSquareText className="h-4 w-4" />
              Client Experiences
           </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {content.testimonials?.title || "Success with Rapid Experts"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {content.testimonials?.subtitle || "See how on-demand expertise made a difference."}
          </p>
        </div>
        <div className={`grid ${gridColsClass} gap-8 max-w-7xl mx-auto`}>
          {expertsTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              quote={testimonial.quote}
              authorName={testimonial.authorName}
              authorTitle={testimonial.authorTitle}
              imageUrl={testimonial.imageUrl}
              companyLogoUrl={testimonial.companyLogoUrl}
              borderColor="border-blue-300" // Use blue border
            />
          ))}
        </div>
      </div>
    </section>
  );
};
// +++ End of Experts Testimonials Section +++

const TeamPage = () => {
  const context = useContext(AppLanguageContext)
  const [isLoading, setIsLoading] = useState(true)
  const benefitsRef = useRef(null)
  const [isModalOpen, setIsModalOpen] = useState(false); // <-- State for modal visibility
  const [selectedExpertType, setSelectedExpertType] = useState(''); // <-- State for expert type

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
        growingDescription: "We're constantly expanding our team of experts to better serve your needs. If you are interested in an expert we don't have yet, let us know by requesting the expert, you will then be the first to be informed as soon as the expert becomes available.",
        getNotified: "Get notified when new experts join",
        comingSoon: "Coming Soon",
        requestExpertButton: "Request this Expert"
      },
      modalContent: {
        title: "Request Expert Access",
        subtitle1: "Enter your email to be notified when our",
        subtitle2: "becomes available.",
        emailLabel: "Your Email",
        emailPlaceholder: "you@example.com",
        expertNeededLabel: "Expert Needed",
        successTitle: "Thank You!",
        successMessage: "We've received your request and will notify you.",
        submitButton: "Notify Me",
        submittingButton: "Submitting...",
        defaultError: "Failed to submit request. Please try again.",
        closeAriaLabel: "Close modal",
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
      memberExperienceSuffix: "years",
      testimonials: {
        title: "Accelerated Development with Rapid Experts",
        subtitle: "Discover how founders leveraged our on-demand talent to build and scale faster."
      }
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
        growingDescription: "Wir erweitern ständig unser Expertenteam, um deine Bedürfnisse besser zu erfüllen. Wenn du an einem Experten interessiert bist, den wir noch nicht haben, lass es uns wissen, indem du den Experten anfragst. Du wirst dann als Erster informiert, sobald der Experte verfügbar ist.",
        getNotified: "Benachrichtigt werden, wenn neue Experten beitreten",
        comingSoon: "Demnächst verfügbar",
        requestExpertButton: "Diesen Experten anfragen"
      },
      modalContent: {
        title: "Expertenzugang anfordern",
        subtitle1: "Gib deine E-Mail-Adresse ein, um benachrichtigt zu werden, wenn unser",
        subtitle2: "verfügbar wird.",
        emailLabel: "Deine E-Mail",
        emailPlaceholder: "du@beispiel.com",
        expertNeededLabel: "Benötigter Experte",
        successTitle: "Vielen Dank!",
        successMessage: "Wir haben deine Anfrage erhalten und werden dich benachrichtigen.",
        submitButton: "Benachrichtige mich",
        submittingButton: "Wird gesendet...",
        defaultError: "Anfrage konnte nicht gesendet werden. Bitte versuche es erneut.",
        closeAriaLabel: "Modal schließen",
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
      memberExperienceSuffix: "Jahre",
      testimonials: {
        title: "Beschleunigte Entwicklung mit Rapid Experts",
        subtitle: "Entdecke, wie Gründer unsere On-Demand-Experten nutzten, um ihre Unternehmen schneller zu skalieren."
      }
    }
  }

  if (isLoading || !context) {
     return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-purple-600" /></div>;
  }

  const { language } = context;
  const content = pageContent[language];

  const benefitsContent = content.benefits.items;

  // Function to open the modal
  const handleRequestExpert = (expertRole) => {
    const translatedRole = content.memberRoles[expertRole] || expertRole; // Get translated role
    setSelectedExpertType(translatedRole);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExpertType(''); // Clear selected type on close
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-200 selection:text-blue-900">
      {/* Noise overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-30 pointer-events-none z-0"></div>

      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full filter blur-3xl opacity-20 -z-10 transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-indigo-200 to-pink-200 rounded-full filter blur-3xl opacity-20 -z-10 transform -translate-x-1/3 translate-y-1/3"></div>
      <div className="fixed bottom-1/2 right-1/4 w-1/4 h-1/4 bg-gradient-to-br from-amber-200 to-emerald-200 rounded-full filter blur-3xl opacity-10 -z-10"></div>

      {/* Import header from new_landing_page.jsx instead of using the built-in header */}
      <RapidWorksHeader />

      {/* === Updated Hero Section === */}
      <section className="bg-gradient-to-br from-blue-600 to-sky-600 text-white relative overflow-hidden min-h-[400px]">
        {/* Apply consistent padding */}
        <div className="container mx-auto px-6 pt-32 pb-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center mb-4 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium text-sm">
              <Users className="h-4 w-4 inline mr-1.5" />
              {content.pageTitle}
            </div>
            {/* Ensure standardized font size */}
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold mb-6 leading-tight tracking-tight text-white">
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
      </section>
      {/* === End Updated Hero Section === */}

      {/* Main Content - Add ref to the benefits container */}
      <main ref={benefitsRef} className="py-20">
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

                  {/* Dropdown for available experts */}
                  <select
                    className="w-full py-4 px-4 bg-white text-purple-700 rounded-xl font-medium mb-2"
                    defaultValue=""
                    onChange={e => {
                      if (e.target.value) window.open(e.target.value, '_blank');
                    }}
                  >
                    <option value="" disabled>
                      {content.cta.buttonText}
                    </option>
                    {teamMembers
                      .filter(m => m.calendlyLink)
                      .map(m => (
                        <option key={m.id} value={m.calendlyLink}>
                          {m.name} – {m.role}
                        </option>
                      ))}
                  </select>
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
                                className="w-full h-full object-cover [image-rendering:smooth]"
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
                      {/* Flex row for "...and more" and Book Now */}
                      <div className="mt-2 flex items-center justify-between gap-2">
                        {/* ...and more badge */}
                        <span className="inline-block px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full shadow-sm">
                          {content.team.moreSkills}
                        </span>
                        {/* Button */}
                        {member.calendlyLink ? (
                          <a
                            href={member.calendlyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow hover:from-purple-700 hover:to-indigo-700 transition"
                          >
                            <ArrowRight className="w-4 h-4 mr-1" />
                            Book Now
                          </a>
                        ) : (
                          <button
                            className="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold text-purple-700 border-2 border-purple-300 bg-white rounded-full shadow hover:bg-purple-50 hover:border-purple-500 transition"
                            onClick={() => handleRequestExpert(member.role)} // <-- Call handler to open modal
                          >
                            <ArrowRight className="w-4 h-4 mr-1" />
                            {/* Use translated text for button if available */}
                            {content.team?.requestExpertButton || "Request this Expert"}
                          </button>
                        )}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Add the new component */}
      <ExpertsTestimonialsSection content={content} />

      <ExploreMoreSection excludeService="Experts" />

      {/* Add the modal component here */}
      <ExpertRequestModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        expertType={selectedExpertType}
        content={content.modalContent}
        language={language}
      />

    </div>
  )
}

export default TeamPage

