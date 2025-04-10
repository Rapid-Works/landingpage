"use client"

import { useEffect, useState, useContext, useRef } from "react"
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
  Presentation,
  Loader2
} from "lucide-react"
import { LanguageContext as AppLanguageContext } from "../App"
import RapidWorksHeader from "./new_landing_page_header"
import EmailWaitlistForm from "./EmailWaitlistForm"
import { submitToAirtable } from '../utils/airtableService'

const BundlePage = () => {
  const context = useContext(AppLanguageContext);
  const [scrolled, setScrolled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const contentSectionRef = useRef(null);

  // Page content with translations
  const pageContent = {
    en: {
      badge: {
        text: "Coming Soon"
      },
      hero: {
        title: "Everything in one bundle",
        subtitle: "Focus on what really matters. Let us handle everything else.",
        scrollIndicatorAria: "Scroll to content"
      },
      mainCard: {
        title: "The Perfect Time to Start",
        description: "There has never been a better time to found a startup in North Rhine Westphalia. Current subsidies can finance up to 70% of your startup costs!",
        bundleDescription: "Our bundle provides everything your startup needs - from brand development to product creation, coaching to marketing. You focus on your vision while we handle the rest.",
        financing: {
          title: "Subsidized Excellence",
          description: "We'll help you navigate available subsidies and assist with your application - completely free of charge. Schedule a call to discuss your financing options.",
          buttonText: "Discuss Financing Options"
        }
      },
      services: {
        title: "Everything Your Startup Needs",
        items: [
          {
            title: "Rapid Branding",
            description: "Establish your market presence with a complete branding package"
          },
          {
            title: "Rapid Coaching",
            description: "Receive strategic guidance from experienced startup founders"
          },
          {
            title: "Rapid Team",
            description: "Access expert talent on-demand without the cost of full-time hires"
          },
          {
            title: "Rapid Blueprint",
            description: "Streamline your operational processes and tool infrastructure"
          },
          {
            title: "Rapid Workshops",
            description: "Build your team's knowledge with targeted training sessions"
          },
          {
            title: "Rapid Financing",
            description: "Navigate subsidies and funding options for maximum value"
          }
        ]
      },
      opportunity: {
        title: "Limited Time Opportunity",
        description: "Current subsidies make this an unprecedented opportunity to launch or scale your startup with significant cost savings. Don't miss out!",
        benefits: [
          "Up to 70% of costs covered by subsidies",
          "Free consultation on available financing options",
          "Assistance with subsidy application process"
        ]
      },
      waitlist: {
        title: "Join the Waitlist",
        description: "Be the first to know when our comprehensive Rapid Bundle becomes available. We'll notify you with exclusive early access opportunities.",
        buttonText: "Get Early Access",
        successText: "You're on the List!",
        successDescription: "Thank you for your interest in our Rapid Bundle. We'll notify you as soon as it's available.",
        checkboxText: "I agree to receive updates about Rapid Bundle and financing options"
      },
      consultation: {
        buttonText: "Schedule a Free Consultation"
      }
    },
    de: {
      badge: {
        text: "Demnächst verfügbar"
      },
      hero: {
        title: "Alles in einem Paket",
        subtitle: "Konzentrieren Sie sich auf das Wesentliche. Wir kümmern uns um den Rest.",
        scrollIndicatorAria: "Zum Inhalt scrollen"
      },
      mainCard: {
        title: "Der perfekte Zeitpunkt zum Start",
        description: "Es gab nie einen besseren Zeitpunkt, ein Startup in Nordrhein-Westfalen zu gründen. Aktuelle Fördermittel können bis zu 70% Ihrer Startup-Kosten finanzieren!",
        bundleDescription: "Unser Bundle bietet alles, was Ihr Startup braucht - von der Markenentwicklung bis zur Produkterstellung, vom Coaching bis zum Marketing. Sie konzentrieren sich auf Ihre Vision, während wir uns um den Rest kümmern.",
        financing: {
          title: "Geförderte Exzellenz",
          description: "Wir helfen Ihnen bei der Navigation durch verfügbare Fördermittel und unterstützen Sie bei Ihrer Bewerbung - völlig kostenfrei. Vereinbaren Sie ein Gespräch, um Ihre Finanzierungsmöglichkeiten zu besprechen.",
          buttonText: "Finanzierungsoptionen besprechen"
        }
      },
      services: {
        title: "Alles, was Ihr Startup braucht",
        items: [
          {
            title: "Rapid Branding",
            description: "Etablieren Sie Ihre Marktpräsenz mit einem kompletten Branding-Paket"
          },
          {
            title: "Rapid Coaching",
            description: "Erhalten Sie strategische Beratung von erfahrenen Startup-Gründern"
          },
          {
            title: "Rapid Team",
            description: "Greifen Sie bei Bedarf auf Experten zu, ohne die Kosten für Vollzeitmitarbeiter"
          },
          {
            title: "Rapid Blueprint",
            description: "Optimieren Sie Ihre Betriebsprozesse und Tool-Infrastruktur"
          },
          {
            title: "Rapid Workshops",
            description: "Erweitern Sie das Wissen Ihres Teams durch gezielte Schulungen"
          },
          {
            title: "Rapid Financing",
            description: "Navigieren Sie durch Fördermittel und Finanzierungsoptionen für maximalen Mehrwert"
          }
        ]
      },
      opportunity: {
        title: "Zeitlich begrenzte Gelegenheit",
        description: "Die aktuellen Fördermittel bieten eine einmalige Gelegenheit, Ihr Startup mit erheblichen Kosteneinsparungen zu starten oder zu skalieren. Verpassen Sie diese Chance nicht!",
        benefits: [
          "Bis zu 70% der Kosten durch Fördermittel gedeckt",
          "Kostenlose Beratung zu verfügbaren Finanzierungsoptionen",
          "Unterstützung beim Förderantragsprozess"
        ]
      },
      waitlist: {
        title: "Warteliste beitreten",
        description: "Seien Sie der Erste, der erfährt, wenn unser umfassendes Rapid Bundle verfügbar wird. Wir informieren Sie über exklusive Frühzugangs-Möglichkeiten.",
        buttonText: "Frühzugang sichern",
        successText: "Sie sind auf der Liste!",
        successDescription: "Vielen Dank für Ihr Interesse an unserem Rapid Bundle. Wir benachrichtigen Sie, sobald es verfügbar ist.",
        checkboxText: "Ich stimme zu, Updates über Rapid Bundle und Finanzierungsoptionen zu erhalten"
      },
      consultation: {
        buttonText: "Kostenlose Beratung vereinbaren"
      }
    }
  };

  useEffect(() => {
    if (context) {
      setIsLoading(false);
    }
  }, [context]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSubmit = async (email) => {
    try {
      await submitToAirtable({
        email,
        service: "Bundle",
        notes: "Requested early access to Rapid Bundle"
      });
      console.log('Email submitted to Airtable:', email);
      return true; // Return success for the EmailWaitlistForm component
    } catch (error) {
      console.error("Error submitting to Airtable:", error);
      return false; // Return failure for the EmailWaitlistForm component
    }
  }

  const openCalendly = () => {
    window.open('https://calendly.com/yannick-familie-heeren/30min?a1=Rapid%20Bundle', '_blank')
  }

  const getServiceIcon = (index) => {
    const icons = [
      <Megaphone className="h-5 w-5" />,
      <Compass className="h-5 w-5" />,
      <Users className="h-5 w-5" />,
      <FileText className="h-5 w-5" />,
      <Presentation className="h-5 w-5" />,
      <Euro className="h-5 w-5" />
    ];
    return icons[index];
  };

  const getServiceColors = (index) => {
    const colors = [
      { bg: "bg-purple-100", text: "text-purple-600" },
      { bg: "bg-amber-100", text: "text-amber-600" },
      { bg: "bg-blue-100", text: "text-blue-600" },
      { bg: "bg-indigo-100", text: "text-indigo-600" },
      { bg: "bg-emerald-100", text: "text-emerald-600" },
      { bg: "bg-rose-100", text: "text-rose-600" }
    ];
    return colors[index];
  };

  const scrollToContent = () => {
    contentSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  if (isLoading || !context) {
    return <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-gray-600" />
    </div>;
  }

  const { language } = context;
  const content = pageContent[language];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-violet-200 selection:text-violet-900">
      {/* Noise overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-30 pointer-events-none z-0"></div>

      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-gray-200 rounded-full filter blur-3xl opacity-20 -z-10 transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-gray-200 rounded-full filter blur-3xl opacity-20 -z-10 transform -translate-x-1/3 translate-y-1/3"></div>

      {/* Import shared header component */}
      <RapidWorksHeader />

      {/* === Updated Hero Section === */}
      <section className="bg-gradient-to-br from-violet-600 to-purple-600 text-white relative overflow-hidden min-h-[400px]">
        {/* Apply consistent top padding, increased bottom padding */}
        <div className="container mx-auto px-6 pt-32 pb-32"> {/* Increased pb-32 */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center mb-5 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium text-xs shadow-sm mx-auto">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-500"></span>
              </span>
              {content.badge.text}
            </div>
            {/* Standardized Font Size */}
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold mb-6 leading-tight tracking-tight text-white">
              {content.hero.title}
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              {content.hero.subtitle}
            </p>
          </div>
        </div>
      </section>
      {/* === End Updated Hero Section === */}

      {/* Main Content - Adjust padding */}
      <main ref={contentSectionRef} className="py-20">
        <div className="container mx-auto px-6">

          {/* Add ref to the content section */}
          <div ref={contentSectionRef} className="flex flex-col lg:flex-row gap-16 items-start">
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
                  
                  <h2 className="text-3xl font-bold text-white mb-4">{content.mainCard.title}</h2>
                  <p className="text-white/90 text-lg mb-6 leading-relaxed">
                    {content.mainCard.description}
                  </p>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl mb-6">
                    <p className="text-white font-medium">
                      {content.mainCard.bundleDescription}
                    </p>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Euro className="h-5 w-5" /> 
                    {content.mainCard.financing.title}
                  </h3>
                  <p className="text-white/80 mb-6">
                    {content.mainCard.financing.description}
                  </p>
                  
                  <button
                    onClick={openCalendly}
                    className="bg-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 hover:text-white text-black px-8 py-4 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
                  >
                    {content.mainCard.financing.buttonText}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                <h3 className="text-xl font-bold mb-6">{content.services.title}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.services.items.map((service, index) => {
                    const colors = getServiceColors(index);
                    return (
                      <div key={index} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                        <div className={`${colors.bg} p-2 rounded-lg ${colors.text}`}>
                          {getServiceIcon(index)}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{service.title}</h4>
                          <p className="text-gray-600 text-sm">{service.description}</p>
                        </div>
                      </div>
                    );
                  })}
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
                        <h3 className="font-bold text-xl mb-2">{content.opportunity.title}</h3>
                        <p className="text-white/80">
                          {content.opportunity.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {content.opportunity.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="bg-green-500/20 p-1 rounded-full mt-1">
                            <Check className="h-4 w-4 text-green-500" />
                          </div>
                          <p className="text-white/90">{benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-700" />
                      {content.waitlist.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {content.waitlist.description}
                    </p>
                    
                    <EmailWaitlistForm 
                      buttonText={content.waitlist.buttonText}
                      successText={content.waitlist.successText}
                      successDescription={content.waitlist.successDescription}
                      checkboxText={content.waitlist.checkboxText}
                      primaryColor="gray"
                      onSubmit={handleSubmit}
                    />
                  </div>
                  
                  <button
                    onClick={openCalendly}
                    className="w-full bg-black hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 text-white py-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {content.consultation.buttonText}
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