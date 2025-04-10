"use client"

import { ArrowRight, Euro, X, Loader2 } from "lucide-react"
import RapidWorksHeader from "./new_landing_page_header"
import { useState, useEffect, useRef, useContext } from "react"
import { LanguageContext as AppLanguageContext } from "../App"
import ExploreMoreSection from "./ExploreMoreSection"

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
                description: "Jede Phase Ihrer Startup-Reise erfordert unterschiedliche Finanzierungsstrategien. Wir arbeiten mit Ihnen zusammen, um den optimalen Finanzierungsmix für Ihre aktuellen Bedürfnisse und zukünftigen Wachstumspläne zu identifizieren.",
                buttonText: "Kostenlose Beratung"
            },
            modal: {
                title: "Kostenlose Beratung planen",
                loading: "Terminkalender wird geladen..."
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
            <section className="bg-gradient-to-br from-rose-600 to-pink-600 text-white relative overflow-hidden min-h-[400px]">
                <div className="container mx-auto px-6 pt-32 pb-24">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center mb-4 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium text-sm">
                            <Euro className="h-4 w-4 inline mr-1" />
                            {content.badge.text}
                        </div>
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

            {/* Main Content */}
            <main ref={contentSectionRef} className="py-20">
                <div className="container mx-auto px-6">
                    
                    {/* Add ref to the content section */}
                    <div className="bg-gradient-to-br from-white to-rose-50 rounded-3xl overflow-hidden mb-20 relative p-8 md:p-12 text-center shadow-lg border border-rose-100">
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                {content.mainSection.title}
                            </h2>
                            <p className="text-gray-700 text-lg mb-8 mx-auto max-w-3xl">
                                {content.mainSection.description}
                            </p>

                            <button 
                                className="bg-rose-600 text-white px-8 py-4 rounded-full font-medium hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-900/20 transition-all flex items-center gap-2 group mx-auto"
                                onClick={() => {
                                    setIsCalendlyLoading(true);
                                    setIsModalOpen(true);
                                }}
                            >
                                {content.mainSection.buttonText}
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Add the new component */}
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

