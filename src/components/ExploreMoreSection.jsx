import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, Users, FileText, Compass, Presentation, Euro, ArrowRight, Handshake } from 'lucide-react';
import { LanguageContext as AppLanguageContext } from "../App";

const ExploreMoreSection = ({ excludeService }) => {
  const context = useContext(AppLanguageContext);

  // Minimal loading state until context is ready
  if (!context) {
    return null; // Or a minimal loader if preferred
  }

  const { language } = context;

  // Content object specific to this section
  const sectionContent = {
    en: {
      badge: "Explore More",
      title: "Did you know we do more than just this?",
      description: "Check out our other services to help you grow your startup - from expert assistance to MVP development, coaching, and financing solutions.",
      cta: "Explore all services",
      services: {
        Branding: "Branding",
        Experts: "Experts",
        Partners: "Partners",
        Coaching: "Coaching",
        Workshops: "Workshops",
        Financing: "Financing"
      }
    },
    de: {
      badge: "Mehr Entdecken",
      title: "Wussten Sie, dass wir mehr als nur das anbieten?",
      description: "Entdecken Sie unsere weiteren Dienstleistungen, die Ihnen beim Wachstum Ihres Startups helfen - von Expertenunterstützung über MVP-Entwicklung bis hin zu Coaching und Finanzierungslösungen.",
      cta: "Alle Services entdecken",
      services: {
        Branding: "Branding",
        Experts: "Experten",
        Partners: "Partner",
        Coaching: "Coaching",
        Workshops: "Workshops",
        Financing: "Finanzierung"
      }
    }
  };

  const content = sectionContent[language];

  // Define all possible services
  const allServices = [
    { icon: <Megaphone className="h-6 w-6" />, labelKey: "Branding", path: "/branding" },
    { icon: <Users className="h-6 w-6" />, labelKey: "Experts", path: "/experts" },
    { icon: <Handshake className="h-6 w-6" />, labelKey: "Partners", path: "/partners" },
    { icon: <Compass className="h-6 w-6" />, labelKey: "Coaching", path: "/coaching" },
    { icon: <Presentation className="h-6 w-6" />, labelKey: "Workshops", path: "/workshop" },
    { icon: <Euro className="h-6 w-6" />, labelKey: "Financing", path: "/financing" }
  ];

  // Filter out the service specified by the prop
  const servicesToShow = allServices.filter(service => service.labelKey !== excludeService);

  // Dynamically adjust title
  let dynamicTitle;
  const serviceToBeMentioned = excludeService 
    ? (content.services[excludeService] || excludeService) 
    : (content.services["Branding"] || "Branding");

  if (language === 'en') {
    // English title: "Did you know we do more than just this?"
    // We replace "just this" with "just [Service Name]"
    // The original question mark at the end of content.title is preserved.
    dynamicTitle = content.title.replace(
      "just this", 
      `just ${serviceToBeMentioned}`
    );
  } else if (language === 'de') {
    // German title: "Wussten Sie, dass wir mehr als nur das anbieten?"
    // We replace "nur das" with "nur [Service Name]"
    // The original question mark at the end of content.title is preserved.
    dynamicTitle = content.title.replace(
      "nur das", 
      `nur ${serviceToBeMentioned}`
    );
  } else {
    // Fallback for any other languages or if content.title is structured differently
    dynamicTitle = content.title;
  }


  const containerClass = "max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative";

  return (
    <section className="py-16 sm:py-32 bg-gradient-to-br from-violet-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/30 rounded-full translate-y-1/2 -translate-x-1/4 blur-xl"></div>
      
      <div className={`${containerClass} relative z-10`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-violet-300 text-sm uppercase tracking-wider font-light mb-6 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mx-auto">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
            {content.badge}
          </div>
          
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-light mb-6 bg-gradient-to-r from-violet-200 via-white to-indigo-200 bg-clip-text text-transparent md:leading-snug">
            {dynamicTitle}
          </h2>
          
          <p className="text-sm sm:text-xl text-indigo-100 mb-10 leading-relaxed max-w-2xl mx-auto">
            {content.description}
          </p>
          
          {/* Render filtered services in a flex row */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10">
            {servicesToShow.map((item, index) => (
              <Link 
                to={item.path}
                key={index} 
                className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-white/20 transition-colors cursor-pointer w-28 sm:w-32 flex-shrink-0"
              >
                {item.icon}
                <span className="text-sm text-center">{content.services[item.labelKey]}</span>
              </Link>
            ))}
          </div>
          
          <Link
            to="/" // Link to the main landing page
            className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium overflow-hidden rounded-full text-violet-900 bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span className="relative z-10 flex items-center">
              {content.cta}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExploreMoreSection; 