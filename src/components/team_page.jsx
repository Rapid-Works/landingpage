"use client"

// import type React from "react"
import React from "react"
import { useState, useEffect, useContext, useRef } from "react"
import {
  ArrowRight,
  ChevronDown,
  Calendar,
  Users,
  DollarSign,
  Clock,
  Star,
  Code,
  Megaphone,
  Palette,
  Euro,
  Loader2,
  Landmark,
  Tag,
  MessageSquareText,
  Info,
  BarChart,
  Bot,
  Bug,
  Database,
  Infinity
} from "lucide-react"
import RapidWorksHeader from "./new_landing_page_header" 
import { LanguageContext as AppLanguageContext } from "../App"
import { useAuth } from '../contexts/AuthContext'
import { checkFrameworkAgreementStatus } from '../utils/frameworkAgreementService'
import { getCurrentUserContext } from '../utils/organizationService'
import ExploreMoreSection from "./ExploreMoreSection" // Import the new component
import { testimonials } from "../testimonialsData"
import TestimonialCard from "./TestimonialCard"
import ExpertRequestModal from "./ExpertRequestModal" // <-- Import the new modal
import NewTaskModal from "./NewTaskModal" // <-- Import the task request modal
import LoginModal from "./LoginModal" // <-- Import the login modal
import FrameworkAgreementModal from "./FrameworkAgreementModal" // <-- Import the framework agreement modal
// import { submitExpertRequestToAirtable } from '../utils/airtableService' // <-- Import the Airtable function

// Import team profile images
import SamuelProfile from "../images/SamuelProfile.jpg"
import PrinceArdiabah from "../images/princeardiabah.png"
import LandingExperts from "../images/landing_experts.png"
import TeamCtaImage from "../images/team_cta_image.png"
import TeamMarketingImage from "../images/team_marketing_image.png"
import TeamSoftwareImage from "../images/team_software_image.png"
import TeamDesignBg from "../images/team_design_bg.png"
import TeamFinancialBg from "../images/team_financial_bg.png"
import TeamsDesignExpert from "../images/teams_design_expert.png"
import TeamsAiExpert from "../images/teams_ai_expert.png"
import TeamsSoftwareTester from "../images/teams_software_tester.png"
import TeamsDatabaseExpert from "../images/teams_database_expert.png"
import TeamsDataAnalysis from "../images/teams_data_analysis.png"
import TeamsDevopsExpert from "../images/teams_devops_expert.png"
import TeamsSocialMedia from "../images/teams_social_media.png"

// Sample team member data
const teamMembers = [
  {
    id: 1,
    name: "Prince Ardiabah",
    role: "Marketing Expert",
    image: PrinceArdiabah,
    bgImage: TeamMarketingImage,
    icon: <Megaphone className="h-5 w-5" />,
    calendlyLink: "https://calendly.com/princeardiabah/15min",
    skills: ["Digital Marketing", "SEO", "Content Strategy"],
    quote: "Driving growth through strategic digital marketing solutions",
  },
  {
    id: 2,
    name: "Samuel Donkor",
    role: "Software Expert",
    image: SamuelProfile,
    bgImage: TeamSoftwareImage,
    icon: <Code className="h-5 w-5" />,
    calendlyLink: "https://calendly.com/calvinsamueldonkor/15min",
    skills: ["Backend Development", "Frontend Development", "API Integration"],
    quote: "Building scalable solutions with cutting-edge technologies",
  },
  {
    id: 3,
    name: "Olena Donchenko",
    role: "Design Expert",
    image: TeamsDesignExpert,
    bgImage: TeamDesignBg,
    icon: <Palette className="h-5 w-5" />,
    calendlyLink: null,
    skills: ["UI/UX Design", "Branding", "Visual Design"],
    quote: "Creating beautiful, functional designs that delight users",
  },
  {
    id: 4,
    name: "Coming Soon",
    role: "Finance Expert",
    image: null,
    bgImage: TeamFinancialBg,
    icon: <Euro className="h-5 w-5" />,
    calendlyLink: null,
    skills: ["Financial Planning", "Investment Strategy", "Budget Management"],
    quote: "Optimizing financial strategies for sustainable growth",
  },
  {
    id: 5,
    name: "Coming Soon",
    role: "Data Analysis Expert",
    image: null,
    bgImage: TeamsDataAnalysis,
    icon: <BarChart className="h-5 w-5" />,
    calendlyLink: null,
    skills: ["Data Mining", "Data Visualization", "Business Intelligence"],
    quote: "Transform data into valuable insights that enable strategic decisions",
  },
  {
    id: 6,
    name: "Coming Soon",
    role: "AI Expert",
    image: null,
    bgImage: TeamsAiExpert,
    icon: <Bot className="h-5 w-5" />,
    calendlyLink: null,
    skills: ["Machine Learning", "Natural Language Processing", "AI Strategy"],
    quote: "Develop intelligent systems that automate processes and promote innovation",
  },
  {
    id: 7,
    name: "Coming Soon",
    role: "DevOps Expert",
    image: null,
    bgImage: TeamsDevopsExpert,
    icon: <Infinity className="h-5 w-5" />,
    calendlyLink: null,
    skills: ["CI/CD Pipelines", "Cloud Infrastructure", "Container & Kubernetes"],
    quote: "Create efficient development and deployment processes for sustainable scalability",
  },
  {
    id: 8,
    name: "Coming Soon",
    role: "Software Test Expert",
    image: null,
    bgImage: TeamsSoftwareTester,
    icon: <Bug className="h-5 w-5" />,
    calendlyLink: null,
    skills: ["Test Automation", "Quality Assurance", "Bug Tracking"],
    quote: "Ensure reliable software through targeted testing and quality assurance",
  },
  {
    id: 9,
    name: "Coming Soon",
    role: "Database Expert",
    image: null,
    bgImage: TeamsDatabaseExpert,
    icon: <Database className="h-5 w-5" />,
    calendlyLink: null,
    skills: ["SQL & NoSQL", "Data Modeling", "Performance Tuning"],
    quote: "Design performant and secure data architecture for modern applications",
  },
  {
    id: 10,
    name: "Coming Soon",
    role: "Social Media Expert",
    image: null,
    bgImage: TeamsSocialMedia,
    icon: <MessageSquareText className="h-5 w-5" />,
    calendlyLink: null,
    skills: ["Content Creation", "Social Ads", "Community Management"],
    quote: "Build digital reach through creative and data-driven social media strategies",
  },
]

// Benefits data
const benefits = [
  {
    id: 1,
    text: "No upfront cost",
    icon: <DollarSign className="h-8 w-8" />,
    description: "Start working with our experts without any initial investment",
  },
  {
    id: 2,
    text: "Up to 70% cheaper with subsidies",
    icon: <Landmark className="h-8 w-8" />,
    description: "Save significantly with our Rapid Financing subsidy solutions",
    linkTo: "/financing",
    linkText: "Learn about subsidies"
  },
  {
    id: 5,
    text: "First hour for free",
    icon: <Tag className="h-8 w-8" />,
    description: "Try our services with no risk or obligation",
  },
  {
    id: 6,
    text: "Transparent Communication",
    icon: <Info className="h-8 w-8" />,
    description: "Receive clear information about project status and direct communication with your personal expert."
  },
  {
    id: 3,
    text: "Pay by the hour",
    icon: <Clock className="h-8 w-8" />,
    description: "Flexible payment model - only pay for the time you need",
  },
  {
    id: 4,
    text: "Always available",
    icon: <Calendar className="h-8 w-8" />,
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
           <div className="inline-flex items-center gap-2 text-blue-700 text-sm font-semibold mb-4 px-4 py-2 rounded-full border-2 border-blue-200 bg-white shadow-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>{content.testimonials?.badge || "Testimonials"}</span>
           </div>
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
  const { currentUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const benefitsRef = useRef(null)
  const [isModalOpen, setIsModalOpen] = useState(false); // <-- State for expert request modal visibility
  const [selectedExpertType, setSelectedExpertType] = useState(''); // <-- State for expert type
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false); // <-- State for task request modal visibility
  const [selectedExpertName, setSelectedExpertName] = useState(''); // <-- State for selected expert name
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // <-- State for login modal visibility
  const [isFrameworkModalOpen, setIsFrameworkModalOpen] = useState(false); // <-- State for framework agreement modal visibility
  // const [hasSignedFramework, setHasSignedFramework] = useState(false); // <-- Track if user has signed framework agreement

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
        subtitle: "Your advantage with Rapid Experts – flexibility, efficiency, and zero risk",
        items: [
          { text: "No upfront cost", description: "Start working with our experts without any initial investment" },
          { text: "Up to 70% cheaper with subsidies", description: "Save significantly with our Rapid Financing subsidy solutions", linkText: "Learn about subsidies" },
          { text: "First hour for free", description: "Try our services with no risk or obligation" },
          { text: "Transparent Communication", description: "Receive clear information about project status and direct communication with your personal expert." },
          { text: "Pay by the hour", description: "Flexible payment model - only pay for the time you need" },
          { text: "Always available", description: "Our experts are ready to start within a day" },
        ],
        discoverMore: "Discover more benefits",
      },
      cta: {
        title: "Ready to get started?",
        description: "Request a fixed price offer and get help from our experts.",
        buttonText: "Request Fixed Price Task",
      },
      team: {
        expertiseTitle: "Expertise",
        moreSkills: "...and more",
        growingTitle: "Our team is growing!",
        growingDescription: "We're constantly expanding our team of experts to better serve your needs. If you are interested in an expert we don't have yet, let us know by requesting the expert, you will then be the first to be informed as soon as the expert becomes available.",
        getNotified: "Get notified when new experts join",
        comingSoon: "Coming Soon",
        requestExpertButton: "Request this Expert",
        bookNowButton: "Request Fixed Price Task"
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
        getNotified: "Benachrichtigt werden, wenn neue Experten beitreten",
        comingSoon: "Demnächst verfügbar",
        requestExpertButton: "Diesen Experten anfragen",
        bookNowButton: "Jetzt buchen"
      },
      memberRoles: {
        "Marketing Expert": "Marketing Expert",
        "Software Expert": "Software Expert",
        "Design Expert": "Design Expert",
        "Finance Expert": "Finance Expert",
        "Data Analysis Expert": "Data Analysis Expert",
        "AI Expert": "AI Expert",
        "DevOps Expert": "DevOps Expert",
        "Software Test Expert": "Software Test Expert",
        "Database Expert": "Database Expert",
        "Social Media Expert": "Social Media Expert",
      },
      memberQuotes: {
        "prince": "Driving growth through strategic digital marketing solutions",
        "samuel": "Building scalable solutions with cutting-edge technologies",
        "design": "Creating beautiful, functional designs that delight users",
        "finance": "Optimizing financial strategies for sustainable growth",
        "data": "Transform data into valuable insights that enable strategic decisions",
        "ai": "Develop intelligent systems that automate processes and promote innovation",
        "devops": "Create efficient development and deployment processes for sustainable scalability",
        "test": "Ensure reliable software through targeted testing and quality assurance",
        "database": "Design performant and secure data architecture for modern applications",
        "social": "Build digital reach through creative and data-driven social media strategies",
      },
      memberExperienceSuffix: "years",
      testimonials: {
        badge: "Customer Experiences",
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
        subtitle: "Dein Vorteil mit Rapid Experts – Flexibilität, Effizienz und null Risiko",
        items: [
          { text: "Keine Vorauskosten", description: "Beginne die Zusammenarbeit mit unseren Experten ohne anfängliche Investition" },
          { text: "Bis zu 80% günstiger mit Förderungen", description: "Spare erheblich mit unseren Rapid Financing Förderlösungen", linkText: "Erfahre mehr über Förderungen" },
          { text: "Kostenlose Fixpreisanfrage", description: "Lass uns einfach deine Aufgabe wissen, wir erstellen dir ein kostenfreies Fixpreisangebot." },
          { text: "Transparente Kommunikation", description: "Du erhältst klare Informationen über den Projektstatus und direkte Kommunikation mit deinen Experten." },
          { text: "Stundenweise bezahlen", description: "Du erhältst von uns für jede Aufgabe immer ein Fixpreisangebot und zahlst erst nach Durchführung." },
          { text: "Immer verfügbar", description: "Unsere Experten sind bereit, innerhalb eines Tages zu starten" },
        ],
        discoverMore: "Entdecke weitere Vorteile",
      },
      cta: {
        title: "Bereit loszulegen?",
        description: "Fordere ein Fixpreis-Angebot an und erhalte Hilfe von unseren Experten.",
        buttonText: "Fixpreis-Aufgabe anfordern",
      },
      team: {
        expertiseTitle: "Expertise",
        moreSkills: "...und mehr",
        growingTitle: "Unser Team wächst!",
        growingDescription: "Wir erweitern ständig unser Expertenteam, um deine Bedürfnisse besser zu erfüllen. Wenn du an einem Experten interessiert bist, den wir noch nicht haben, sag uns Bescheid, indem du den Experten anfragst. Du wirst dann als Erstes informiert, sobald der Experte verfügbar ist.",
        getNotified: "Benachrichtigt werden, wenn neue Experten beitreten",
        comingSoon: "Demnächst verfügbar",
        requestExpertButton: "Diesen Experten anfragen",
        bookNowButton: "Fixpreis-Aufgabe anfordern"
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
        getNotified: "Benachrichtigt werden, wenn neue Experten beitreten",
        comingSoon: "Demnächst verfügbar",
        requestExpertButton: "Diesen Experten anfragen",
        bookNowButton: "Jetzt buchen"
      },
      memberRoles: {
        "Marketing Expert": "Marketing Experte",
        "Software Expert": "Software Experte",
        "Design Expert": "Design Experte",
        "Finance Expert": "Finanz Experte",
        "Data Analysis Expert": "Datenanalyse Experte",
        "AI Expert": "KI Experte",
        "DevOps Expert": "DevOps Experte",
        "Software Test Expert": "Softwaretest Experte",
        "Database Expert": "Datenbank Experte",
        "Social Media Expert": "Social Media Experte",
      },
      memberQuotes: {
        "prince": "Wachstum durch strategische digitale Marketinglösungen vorantreiben",
        "samuel": "Skalierbare Lösungen mit Spitzentechnologien entwickeln",
        "design": "Schöne, funktionale Designs schaffen, die Benutzer begeistern",
        "finance": "Finanzstrategien für nachhaltiges Wachstum optimieren",
        "data": "Daten in wertvolle Erkenntnisse verwandeln, die strategische Entscheidungen ermöglichen",
        "ai": "Intelligente Systeme entwickeln, die Prozesse automatisieren und Innovation fördern",
        "devops": "Effiziente Entwicklungs- und Deployment-Prozesse für nachhaltige Skalierbarkeit schaffen",
        "test": "Zuverlässige Software durch gezieltes Testing und Qualitätssicherung gewährleisten",
        "database": "Performante und sichere Datenarchitektur für moderne Anwendungen gestalten",
        "social": "Digitale Reichweite aufbauen durch kreative und datenbasierte Social Media Strategien",
      },
      memberExperienceSuffix: "Jahre",
      testimonials: {
        badge: "Kundenerfahrungen",
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

  // Function to handle task request with authentication and framework agreement flow
  const handleRequestTask = async (expertRole, expertName = '') => {
    const translatedRole = content.memberRoles[expertRole] || expertRole;
    setSelectedExpertType(translatedRole);
    
    // Store expert name for the modal
    const expertInfo = teamMembers.find(member => member.role === expertRole);
    const actualExpertName = expertInfo?.name && expertInfo.name !== "Coming Soon" ? expertInfo.name : '';
    setSelectedExpertName(actualExpertName);
    
    // Check if user is logged in
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return;
    }
    
    try {
      // Check user's current context (personal vs organization)
      const userContext = await getCurrentUserContext(currentUser.uid);
      
      // If user is in organization context, check if they have permission to request experts
      if (userContext.type === 'organization') {
        const canRequestExperts = userContext.permissions?.role === 'admin' || 
                                  userContext.permissions?.permissions?.canRequestExperts;
        
        if (!canRequestExperts) {
          alert('You do not have permission to request experts in this organization. Please contact your administrator.');
          return;
        }
      }
      
      // Check if user has signed framework agreement using Firebase
      const frameworkStatus = await checkFrameworkAgreementStatus(currentUser.uid);
      console.log('Framework status:', frameworkStatus);
      
      if (!frameworkStatus.signed) {
        setIsFrameworkModalOpen(true);
        return;
      }
      
      // User is logged in, has framework signed, and has permissions - show task modal
      setIsTaskModalOpen(true);
    } catch (error) {
      console.error('Error checking framework status or organization permissions:', error);
      // If there's an error checking, assume they haven't signed and show framework modal
      setIsFrameworkModalOpen(true);
    }
  };

  // Function to close the task modal
  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedExpertType(''); // Clear selected type on close
    setSelectedExpertName(''); // Clear selected expert name on close
  };

  // Function to handle successful login
  const handleLoginSuccess = async (user) => {
    setIsLoginModalOpen(false);
    
    // Use the user parameter if currentUser is not immediately available
    const userId = user?.uid || currentUser?.uid;
    
    if (!userId) {
      // If no user ID available, show framework modal as default for new users
      setIsFrameworkModalOpen(true);
      return;
    }
    
    try {
      // Check user's current context (personal vs organization)
      const userContext = await getCurrentUserContext(userId);
      
      // If user is in organization context, check if they have permission to request experts
      if (userContext.type === 'organization') {
        const canRequestExperts = userContext.permissions?.role === 'admin' || 
                                  userContext.permissions?.permissions?.canRequestExperts;
        
        if (!canRequestExperts) {
          alert('You do not have permission to request experts in this organization. Please contact your administrator.');
          return;
        }
      }
      
      // After login, check framework agreement using Firebase
      const frameworkStatus = await checkFrameworkAgreementStatus(userId);
      console.log('Framework status after login:', frameworkStatus);
      
      if (!frameworkStatus.signed) {
        setIsFrameworkModalOpen(true);
      } else {
        setIsTaskModalOpen(true);
      }
    } catch (error) {
      console.error('Error checking framework status or organization permissions after login:', error);
      // If there's an error checking, assume they haven't signed and show framework modal
      setIsFrameworkModalOpen(true);
    }
  };

  // Function to handle framework agreement completion
  const handleFrameworkSigned = () => {
    // Firebase tracking is now handled in the FrameworkAgreementModal
    setIsFrameworkModalOpen(false);
    setIsTaskModalOpen(true);
    // Keep expert data for the task modal
  };

  // Function to close login modal
  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
    setSelectedExpertType(''); // Clear selections on close
    setSelectedExpertName('');
  };

  // Function to close framework modal
  const handleCloseFrameworkModal = () => {
    setIsFrameworkModalOpen(false);
    // Keep expert data - it will be cleared when task modal closes
    // This preserves the expert selection through the framework signing process
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
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden text-white">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={LandingExperts} 
            alt="Rapid Experts Hero Background" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        {/* Color overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A75DA]/90 to-[#0E3E74]/90 z-10"></div>

        {/* Apply consistent padding and z-index */}
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 lg:py-32 flex flex-col justify-center relative z-20 h-full">
          <div className="text-center max-w-3xl mx-auto">
            {/* Ensure standardized font size */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight tracking-tight text-white">
              {content.hero.title1}
              {content.hero.titleHighlight && (
                <span className="relative inline-block">
                    {content.hero.titleHighlight}
                </span>
              )}
              {content.hero.title2}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed font-medium px-2">
              {content.hero.subtitle}
            </p>
          </div>
        </div>
        <button
            onClick={scrollToBenefits}
            className="absolute bottom-6 sm:bottom-12 left-0 right-0 flex justify-center animate-bounce cursor-pointer bg-transparent border-none focus:outline-none z-30"
            aria-label={content.hero.scrollIndicatorAria}
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white/70 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
        </button>
      </section>
      {/* === End Updated Hero Section === */}

      {/* Main Content */}
      <main className="bg-gray-50/50">
        <section ref={benefitsRef} className="pt-24">
        <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                {content.benefits.title}
                  </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {content.benefits.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {benefitsContent.map((benefit, index) => {
                const originalBenefit = benefits.find(b => b.text.toLowerCase() === benefit.text.toLowerCase()) || benefits[index];
                      
                      return (
                        <div
                          key={index}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100/80 p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        >
                    <div className="flex items-center gap-6">
                      <div
                        className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-white"
                        style={{ background: 'linear-gradient(to bottom right, #1A75DA, #0E3E74)' }}
                      >
                        {originalBenefit?.icon || <Star className="h-8 w-8" />}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{benefit.text}</h3>
                          </div>
                    <div className="mt-4">
                      <p className="text-gray-600 text-base leading-relaxed">{benefit.description}</p>
                            {benefit.linkText && (
                              <a 
                                href={originalBenefit?.linkTo}
                          className="text-blue-600 font-semibold mt-3 inline-flex items-center gap-1.5 group"
                              >
                          {benefit.linkText} 
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div 
              className="rounded-3xl p-12 relative overflow-hidden max-w-6xl mx-auto bg-cover bg-right"
              style={{ backgroundImage: `url(${TeamCtaImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#0E3E74]/90 via-[#1A75DA]/70 to-transparent"></div>
              
              <div className="relative z-10 text-left max-w-2xl">
                <h2 className="text-4xl font-extrabold text-white mb-4">
                  {content.cta.title}
                </h2>
                <p className="text-white/90 text-lg mb-8 leading-relaxed">
                    {content.cta.description}
                  </p>

                <div className="relative inline-block w-full sm:w-auto">
                  <button
                    className="appearance-none bg-white text-blue-800 font-bold py-4 pl-6 pr-12 rounded-full shadow-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 cursor-pointer w-full sm:min-w-[400px] md:min-w-[500px] lg:min-w-[600px] text-left"
                    onClick={() => {
                      setSelectedExpertName(''); // No specific expert for general CTA
                      handleRequestTask('General', ''); // Use the same flow with permissions checking
                    }}
                  >
                      {content.cta.buttonText}
                  </button>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-blue-800" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {teamMembers.map((member) => {
                  const memberName = member.name === "Coming Soon" ? content.team.comingSoon : member.name;
                  const memberRole = content.memberRoles[member.role] || member.role;
                  let memberQuote;
                  if (member.id === 1) memberQuote = content.memberQuotes.prince;
                  else if (member.id === 2) memberQuote = content.memberQuotes.samuel;
                  else if (member.id === 3) memberQuote = content.memberQuotes.design;
                  else if (member.id === 4) memberQuote = content.memberQuotes.finance;
                  else if (member.id === 5) memberQuote = content.memberQuotes.data;
                  else if (member.id === 6) memberQuote = content.memberQuotes.ai;
                  else if (member.id === 7) memberQuote = content.memberQuotes.devops;
                  else if (member.id === 8) memberQuote = content.memberQuotes.test;
                  else if (member.id === 9) memberQuote = content.memberQuotes.database;
                  else if (member.id === 10) memberQuote = content.memberQuotes.social;
                  else memberQuote = member.quote;

                  return (
                  <div key={member.id} className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200/80 flex flex-col">
                    {/* Header */}
                    <div className="h-28 relative" style={{ backgroundImage: `url(${member.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1A75DA]/80 to-[#0E3E74]/80"></div>
                      {/* Role Badge */}
                      <div className="absolute bottom-3 right-6">
                          <div className="bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1.5">
                            {React.cloneElement(member.icon, {className: "h-3 w-3"})}
                            <span>{memberRole}</span>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="px-6 pt-4 pb-8 flex-grow flex flex-col relative">
                      {/* Floating Profile Image */}
                      <div className="absolute -top-14 left-6">
                        {member.image ? (
                          <img src={member.image} alt={memberName} className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-md" />
                        ) : (
                          <div className="w-24 h-24 rounded-xl bg-gray-200 flex items-center justify-center border-4 border-white shadow-md">
                            <Users className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="pt-14">
                        <h3 className="text-xl font-bold text-gray-900">{memberName}</h3>
                        <p className="text-gray-500 text-sm mt-1 italic">"{memberQuote}"</p>
                </div>

                      <div className="mt-6 flex-grow">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Expertise</h4>
                        <div className="mt-2 space-y-2">
                        {member.skills.map((skill, index) => (
                            <div key={index} className="text-left border border-gray-300 rounded-lg py-1.5 px-3 text-gray-700 font-medium text-sm">
                            {skill}
                          </div>
                        ))}
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-between items-center">
                        <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                          {content.team.moreSkills}
                        </span>
                        {member.calendlyLink ? (
                          <button onClick={() => handleRequestTask(member.role, member.name)} className="bg-[#FF6B6B] hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
                            {content.team.bookNowButton}
                          </button>
                        ) : (
                          <button onClick={() => handleRequestExpert(member.role)} className="bg-[#FF6B6B] hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
                            {content.team.requestExpertButton}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  )
                })}
              </div>

              {/* Team expansion note */}
            <div className="mt-12 bg-gray-100 rounded-3xl p-12 text-center max-w-6xl mx-auto">
                <h3 className="text-3xl font-bold mb-4 text-gray-800">{content.team.growingTitle}</h3>
                <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                    {content.team.growingDescription}
                  </p>
            </div>
          </div>
        </section>
      </main>
      
      {/* Add the new component */}
      <ExpertsTestimonialsSection content={content} />

      <ExploreMoreSection excludeService="Experts" />

      {/* Add the modal components here */}
      <ExpertRequestModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        expertType={selectedExpertType}
        content={content.modalContent}
        language={language}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        onLoginSuccess={handleLoginSuccess}
        context="task"
      />

      {/* Framework Agreement Modal */}
      <FrameworkAgreementModal
        isOpen={isFrameworkModalOpen}
        onClose={handleCloseFrameworkModal}
        onAgreementSigned={handleFrameworkSigned}
        userName={currentUser?.displayName || currentUser?.email}
      />

      {/* Task Request Modal */}
      <NewTaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        selectedExpertType={selectedExpertType}
        expertName={selectedExpertName}
      />

    </div>
  )
}

export default TeamPage

