import React, { useState, useEffect, useContext, useRef } from 'react';
import { Calendar, Clock, Shield, AlertCircle, FileText, Check, Loader2 } from 'lucide-react';
import RapidWorksHeader from './new_landing_page_header';
import EmailWaitlistForm from './EmailWaitlistForm';
import { submitToAirtable } from '../utils/airtableService';
import { LanguageContext as AppLanguageContext } from "../App";
import ExploreMoreSection from "./ExploreMoreSection"; // Import the new component

const BlueprintPage = () => {
  const context = useContext(AppLanguageContext);
  const [isLoading, setIsLoading] = useState(true);
  const contentSectionRef = useRef(null);

  useEffect(() => {
    if (context) {
      setIsLoading(false);
    }
  }, [context]);

  const scrollToContent = () => {
    contentSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const handleSubmit = async (email) => {
    try {
      await submitToAirtable({
        email,
        service: "Blueprint",
        notes: "Joined Blueprint waitlist"
      });
      // console.log('Email submitted to Airtable:', email);
      return true;
    } catch (error) {
      console.error("Error submitting to Airtable:", error);
      return false;
    }
  };

  const pageContent = {
    en: {
      comingSoon: "Coming Soon",
      title: "Streamline your Processes",
      subtitle: "Own your processes in 1 week. You don't need dozens of tools! Our Blueprint service is designed to streamline your business operations and create efficient workflows.",
      scrollIndicatorAria: "Scroll to content",
      features: [
        { title: "Streamlined Processes", description: "Optimize your business operations with custom-designed workflows" },
        { title: "Tool Consolidation", description: "Reduce tool sprawl and integrate only what you need" },
        { title: "Documentation & Training", description: "Comprehensive documentation and team training included" }
      ],
      launchInfo: {
        title: "Launch Date",
        description: "We're launching Rapid Blueprint in Q2 2025. Be the first to know!"
      },
      waitlist: {
        title: "Get Early Access",
        description: "Join our waitlist and be among the first to experience Rapid Blueprint.",
        buttonText: "Notify Me When It Launches",
        successText: "Thank You!",
        successDescription: "You're on the list! We'll notify you when Rapid Blueprint launches.",
        checkboxText: "I agree to receive updates about Rapid Blueprint"
      }
    },
    de: {
      comingSoon: "Kommt Bald",
      title: "Optimiere deine Prozesse",
      subtitle: "Beherrsche deine Prozesse in 1 Woche. Du brauchst keine Dutzend Tools! Unser Blueprint-Service wurde entwickelt, um deine Geschäftsabläufe zu optimieren und effiziente Workflows zu erstellen.",
      scrollIndicatorAria: "Zum Inhalt scrollen",
      features: [
        { title: "Optimierte Prozesse", description: "Optimiere deine Geschäftsabläufe mit individuell gestalteten Workflows" },
        { title: "Tool-Konsolidierung", description: "Reduziere die Tool-Vielfalt und integriere nur das, was du brauchst" },
        { title: "Dokumentation & Schulung", description: "Umfassende Dokumentation und Team-Schulung inklusive" }
      ],
      launchInfo: {
        title: "Startdatum",
        description: "Wir starten Rapid Blueprint im Q2 2025. Sei der Erste, der es erfährt!"
      },
      waitlist: {
        title: "Erhalte Frühzugang",
        description: "Tritt unserer Warteliste bei und gehöre zu den Ersten, die Rapid Blueprint erleben.",
        buttonText: "Benachrichtigt mich zum Start",
        successText: "Vielen Dank!",
        successDescription: "Du bist auf der Liste! Wir benachrichtigen dich, wenn Rapid Blueprint startet.",
        checkboxText: "Ich stimme zu, Updates zu Rapid Blueprint zu erhalten"
      }
    }
  };

  if (isLoading || !context) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-indigo-600" /></div>;
  }

  const { language } = context;
  const content = pageContent[language];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-200 selection:text-indigo-900">
      {/* Noise overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-30 pointer-events-none z-0"></div>

      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-indigo-200 rounded-full filter blur-3xl opacity-20 -z-10 transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-blue-200 rounded-full filter blur-3xl opacity-20 -z-10 transform -translate-x-1/3 translate-y-1/3"></div>

      {/* Import shared header component */}
      <RapidWorksHeader />

      {/* === Updated Hero Section === */}
      {/* Removed min-h, flex, items-center */}
      <section className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white relative overflow-hidden">
        {/* Apply consistent padding, remove flex centering */}
        <div className="container mx-auto px-6 pt-32 pb-24"> {/* Consistent Padding */}
          <div className="text-center max-w-3xl mx-auto">
             <div className="inline-flex items-center justify-center mb-5 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium text-xs shadow-sm">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              {content.comingSoon}
            </div>
            {/* Standardized Font Size */}
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold mb-6 leading-tight tracking-tight text-white">
              {content.title}
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              {content.subtitle}
            </p>
          </div>
        </div>
      </section>
      {/* === End Updated Hero Section === */}

      {/* Main Content */}
      <main ref={contentSectionRef} className="py-20">
        <div className="container mx-auto px-6">
          {/* Add ref to the main content flex container */}
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Left Column - Content */}
            <div className="lg:w-1/2">
              <div className="space-y-4 mb-10">
                {content.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-indigo-100 p-1 rounded-full mt-1">
                      <Check className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100 mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 p-2 rounded-xl">
                    <Calendar className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{content.launchInfo.title}</h3>
                    <p className="text-gray-600">{content.launchInfo.description}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Email Form */}
            <div className="lg:w-1/2">
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full -translate-y-1/2 translate-x-1/2 -z-10"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100 rounded-full translate-y-1/2 -translate-x-1/2 -z-10"></div>
                
                <div className="relative z-10">
                  <div className="bg-indigo-600 text-white p-4 rounded-2xl mb-8 flex items-start gap-4">
                    <div className="bg-white/20 p-2 rounded-xl">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{content.waitlist.title}</h3>
                      <p className="text-white/80">{content.waitlist.description}</p>
                    </div>
                  </div>
                  
                  <EmailWaitlistForm 
                    buttonText={content.waitlist.buttonText}
                    successText={content.waitlist.successText}
                    successDescription={content.waitlist.successDescription}
                    checkboxText={content.waitlist.checkboxText}
                    primaryColor="indigo"
                    onSubmit={handleSubmit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add the new component */}
      <ExploreMoreSection excludeService="Blueprint" />

    </div>
  );
};

export default BlueprintPage;
