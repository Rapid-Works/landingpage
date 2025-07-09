"use client"

import { ArrowRight, Euro, X, Loader2 } from "lucide-react"
import LandingFinancing from "../images/landing_financing.png"
import RapidWorksHeader from "./new_landing_page_header"
import { useState, useEffect, useRef, useContext } from "react"
import { LanguageContext as AppLanguageContext } from "../App"
import ExploreMoreSection from "./ExploreMoreSection"
import { testimonials } from "../testimonialsData"
import TestimonialCard from "./TestimonialCard"
import { MessageSquareText } from 'lucide-react'

const FinancingTestimonialsSection = ({ content }) => {
  const financingTestimonials = testimonials.filter(
    t => t.services.includes("financing")
  )

  if (financingTestimonials.length === 0) {
    return null
  }

  return (
    <section className="py-24 bg-rose-50/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-4xl mx-auto">
           <div className="inline-flex items-center gap-3 text-rose-600 text-sm font-semibold mb-6 px-5 py-2.5 rounded-full border-2 border-rose-300 bg-white shadow-sm">
              <div className="w-2.5 h-2.5 bg-rose-500 rounded-full"></div>
              <span>KUNDENERFAHRUNGEN</span>
           </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Erfolgsgeschichten Finanzierung
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Lies, wie Startups mit unserer Unterstützung die Finanzierungslandschaft gemeistert haben.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {financingTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-3xl shadow-lg p-8 md:p-12 border-t-4 border-rose-400 relative flex flex-col h-full">
              <div className="absolute -top-4 -left-4 text-rose-100 z-0">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <p className="text-gray-600 text-lg italic leading-relaxed flex-grow mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="mt-auto pt-6 border-t border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-2xl border-2 border-rose-200">
                      {testimonial.authorName[0]}
                    </div>
                    <div className="ml-4">
                      <p className="font-bold text-gray-900">{testimonial.authorName}</p>
                      <p className="text-gray-500 text-sm">{testimonial.authorTitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const FinancingPage = () => {
    const context = useContext(AppLanguageContext);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isCalendlyLoading, setIsCalendlyLoading] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const iframeRef = useRef(null)
    const contentSectionRef = useRef(null);

    useEffect(() => {
        if (context) {
            setIsLoading(false);
        }
    }, [context]);

    // Function to scroll
    const scrollToContent = () => {
        contentSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    // Page content with translations
    const pageContent = {
        en: {
            badge: {
                text: "Rapid Financing"
            },
            hero: {
                title: "Need help getting Financing?",
                subtitle: "We help startups navigate the complex world of financing, from grants and subsidies to venture capital and strategic partnerships.",
                scrollIndicatorAria: "Scroll to content"
            },
            mainSection: {
                title: "The right financing at the right time",
                description: "Every stage of your startup journey requires different financing strategies. We work with you to identify the optimal funding mix for your current needs and future growth plans.",
                buttonText: "Free Consultation"
            },
            modal: {
                title: "Schedule a Free Consultation",
                loading: "Loading scheduling calendar..."
            },
            testimonials: {
                title: "Funding Success Stories",
                subtitle: "Read how startups navigated the financing landscape with our support."
            }
        },
        de: {
            badge: {
                text: "Rapid Finanzierung"
            },
            hero: {
                title: "Hilfe bei der Finanzierung benötigt?",
                subtitle: "Wir helfen Startups, sich in der komplexen Welt der Finanzierung zurechtzufinden - von Zuschüssen und Subventionen bis hin zu Risikokapital und strategischen Partnerschaften.",
                scrollIndicatorAria: "Zum Inhalt scrollen"
            },
            mainSection: {
                title: "Die richtige Finanzierung zum richtigen Zeitpunkt",
                description: "Jede Phase deiner Startup-Reise erfordert unterschiedliche Finanzierungsstrategien. Wir arbeiten mit dir zusammen, um den optimalen Finanzierungsmix für deine aktuellen Bedürfnisse und zukünftigen Wachstumspläne zu identifizieren.",
                buttonText: "Kostenlose Beratung"
            },
            modal: {
                title: "Kostenlose Beratung planen",
                loading: "Terminkalender wird geladen..."
            },
            testimonials: {
                title: "Erfolgsgeschichten Finanzierung",
                subtitle: "Lies, wie Startups mit unserer Unterstützung die Finanzierungslandschaft gemeistert haben."
            }
        }
    };

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [isModalOpen])

    // Handle iframe load event
    const handleIframeLoad = () => {
        setIsCalendlyLoading(false)
    }

    if (isLoading || !context) {
        return <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-rose-600" />
        </div>;
    }

    const { language } = context;
    const content = pageContent[language];

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-rose-200 selection:text-rose-900">
            {/* Noise overlay */}
            <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-30 pointer-events-none z-0"></div>

            {/* Decorative elements */}
            <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-rose-200 rounded-full filter blur-3xl opacity-20 -z-10 transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-orange-200 rounded-full filter blur-3xl opacity-20 -z-10 transform -translate-x-1/3 translate-y-1/3"></div>

            {/* Import shared header component */}
            <RapidWorksHeader />

            {/* === Updated Hero Section === */}
            <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
                {/* Background image */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={LandingFinancing} 
                    alt="Rapid Financing Hero Background" 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                {/* Color overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-600/70 to-pink-600/70 z-10"></div>

                {/* Apply consistent padding and z-index */}
                <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 lg:py-32 flex flex-col justify-center relative z-20 h-full">
                    <div className="text-center max-w-3xl mx-auto">
                    {/* Ensure standardized font size */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight tracking-tight text-white">
                            {content.hero.title}
                        </h1>
                    <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed font-medium px-2">
                            {content.hero.subtitle}
                        </p>
                    </div>
                </div>
                <button
                    onClick={scrollToContent}
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
            <main ref={contentSectionRef} className="py-20">
                <div className="container mx-auto px-6">
                    
                    {/* Updated main section to match Figma */}
                    <div className="bg-rose-50/50 rounded-3xl overflow-hidden mb-20 relative p-16 md:p-20 text-center shadow-xl max-w-6xl mx-auto">
                        {/* Subtle background pattern */}
                        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzAwMCIvPgo8L3N2Zz4K')] z-0"></div>
                        
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 leading-tight max-w-4xl mx-auto">
                                {content.mainSection.title}
                            </h2>
                            <p className="text-gray-700 text-xl md:text-2xl mb-14 mx-auto max-w-5xl leading-relaxed font-light">
                                {content.mainSection.description}
                            </p>

                            <button 
                                className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white px-12 py-5 rounded-full font-semibold transition-all flex items-center gap-3 group mx-auto text-lg shadow-lg hover:shadow-xl hover:scale-105"
                                onClick={() => {
                                    setIsCalendlyLoading(true);
                                    setIsModalOpen(true);
                                }}
                            >
                                {content.mainSection.buttonText}
                                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Add the new component */}
            <FinancingTestimonialsSection content={content} />

            <ExploreMoreSection excludeService="Financing" />

            {/* Calendly Modal - Making it even larger */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2">
                    <div className="bg-white rounded-2xl w-full max-w-7xl h-[95vh] relative flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="font-bold text-lg">{content.modal.title}</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex-grow relative">
                            {isCalendlyLoading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
                                    <Loader2 className="h-10 w-10 text-rose-600 animate-spin mb-4" />
                                    <p className="text-gray-600">{content.modal.loading}</p>
                                </div>
                            )}
                            <iframe
                                ref={iframeRef}
                                src="https://calendly.com/yannick-familie-heeren/30min?primary_color=dc2626&text_color=374151&hide_gdpr_banner=1&name_field=0&a1=Rapid%20Financing"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                title="Schedule a meeting"
                                onLoad={handleIframeLoad}
                                className={isCalendlyLoading ? "opacity-0" : "opacity-100"}
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FinancingPage

