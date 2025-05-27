"use client"

import { useState, useEffect, useContext, useRef } from "react"
import {
  ChevronDown,
  Presentation,
  Check,
  X,
  Mail,
  Calendar,
  Shield,
  AlertCircle,
  BookOpen,
  Users,
  ArrowDown,
  Loader2,
  DollarSign,
  Target,
  TrendingUp,
  MessageSquareText
} from "lucide-react"
import RapidWorksHeader from "./new_landing_page_header"
import { submitToAirtable } from '../utils/airtableService'
import { LanguageContext as AppLanguageContext } from "../App"
import ExploreMoreSection from "./ExploreMoreSection"
import { testimonials } from "../testimonialsData"
import TestimonialCard from "./TestimonialCard"

const WorkshopTestimonialsSection = ({ content }) => {
  const workshopTestimonials = testimonials.filter(
    t => t.services.includes("workshop")
  )

  if (workshopTestimonials.length === 0) {
    return null
  }

  const gridColsClass = `grid-cols-1 ${workshopTestimonials.length >= 2 ? 'md:grid-cols-2' : ''
    } ${workshopTestimonials.length >= 3 ? 'lg:grid-cols-3' : ''
    }`

  return (
    <section className="py-24 bg-emerald-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-emerald-600 text-sm uppercase tracking-wider font-light mb-4 px-4 py-1.5 rounded-full bg-white border border-emerald-100 shadow-sm">
            <MessageSquareText className="h-4 w-4" />
            Participant Feedback
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {content.testimonials?.title || "Learning Experiences"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {content.testimonials?.subtitle || "Hear from founders who gained valuable skills in our workshops."}
          </p>
        </div>
        <div className={`grid ${gridColsClass} gap-8 max-w-7xl mx-auto`}>
          {workshopTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              quote={testimonial.quote}
              authorName={testimonial.authorName}
              authorTitle={testimonial.authorTitle}
              imageUrl={testimonial.imageUrl}
              companyLogoUrl={testimonial.companyLogoUrl}
              borderColor="border-emerald-300"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

const WorkshopsPage = () => {
  const context = useContext(AppLanguageContext);
  const [scrolled, setScrolled] = useState(false)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [selectedWorkshops, setSelectedWorkshops] = useState([])
  const [showSelectionPrompt, setShowSelectionPrompt] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const contentSectionRef = useRef(null);

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

  useEffect(() => {
    if (selectedWorkshops.length > 0) {
      setShowSelectionPrompt(false)
    }
  }, [selectedWorkshops])

  const scrollToContentSection = () => {
    contentSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      setError("Please enter your email address")
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    try {
      // Format the selected workshops as a string for the Notes field
      const workshopNotes = selectedWorkshops.map(id => {
        const workshopContent = getWorkshopContent(id);
        return workshopContent ? workshopContent.title : id;
      }).join(", ");

      await submitToAirtable({
        email,
        service: "Workshops",
        notes: `Selected workshops: ${workshopNotes}`
      })

      setSubmitted(true)
      setError("")
    } catch (error) {
      setError("Failed to submit your request. Please try again.")
      console.error("Submission error:", error)
    }
  }

  const toggleWorkshop = (workshopId) => {
    setSelectedWorkshops(prev => {
      if (prev.includes(workshopId)) {
        return prev.filter(id => id !== workshopId)
      } else {
        return [...prev, workshopId]
      }
    })
  }

  // Page content object with translations
  const pageContent = {
    en: {
      badge: {
        text: "Coming Soon"
      },
      hero: {
        title: "All you Need to know",
        subtitle: "Close your business knowledge gaps. Don't become reliant on consultants! Our expert-led workshops will empower you with practical skills and knowledge.",
        scrollIndicatorAria: "Scroll to workshops"
      },
      workshops: {
        title: "Interactive Learning Experience",
        subtitle: "Our workshops combine theory with hands-on practice to ensure you can immediately apply what you learn.",
        selectionTitle: "Select Workshop Topics",
        selectionSubtitle: "(Select multiple)",
        items: [
          {
            id: "startup-finance",
            title: "Startup Finance Essentials",
            description: "Master the fundamentals of startup financial planning and fundraising"
          },
          {
            id: "product-market-fit",
            title: "Finding Product-Market Fit",
            description: "Strategies to validate your product and find your ideal market"
          },
          {
            id: "team-building",
            title: "Building High-Performance Teams",
            description: "Learn how to recruit, manage, and retain top talent for your startup"
          },
          {
            id: "growth-hacking",
            title: "Growth Hacking Masterclass",
            description: "Proven tactics to accelerate your startup growth on a limited budget"
          }
        ],
        limitedSeats: {
          title: "Limited Seats Available",
          subtitle: "Each workshop is limited to 20 participants to ensure personalized attention and maximum value.",
          launchDate: "Launching Q3 2025",
          waitlist: "Join the waitlist to secure your spot"
        },
        testimonials: {
          title: "Valuable Learning Experiences",
          subtitle: "See how participants benefited from our practical, expert-led workshops."
        }
      },
      form: {
        title: "Join the Waitlist",
        emailLabel: "Email Address",
        emailPlaceholder: "you@example.com",
        selectedTopics: "Selected Workshop Topics",
        consent: {
          checkbox: "I agree to receive updates about Rapid Workshops",
          subtitle: "We'll never share your email with anyone else."
        },
        button: "Join the Waitlist",
        success: {
          title: "You're on the List!",
          message: "Thank you for your interest in our workshops. We'll notify you when registration opens.",
          anotherEmail: "Sign up with another email"
        }
      },
      promise: {
        title: "Our Promise",
        text: "Every workshop comes with a satisfaction guarantee. If you're not completely satisfied, we'll refund your registration fee."
      },
      selectionPrompt: {
        title: "Select Workshops First",
        message: "Please select at least one workshop topic that interests you from the left panel.",
        mobileText: "Scroll up to select",
        desktopText: "Select from the left"
      }
    },
    de: {
      badge: {
        text: "Bald verfügbar"
      },
      hero: {
        title: "Alles, was du wissen musst",
        subtitle: "Schließe deine Wissenslücken im Business. Werde nicht von Beratern abhängig! Unsere von Experten geleiteten Workshops vermitteln dir praktische Fähigkeiten und Wissen.",
        scrollIndicatorAria: "Zu den Workshops scrollen"
      },
      workshops: {
        title: "Interaktive Lernerfahrung",
        subtitle: "Unsere Workshops kombinieren Theorie mit praktischen Übungen, damit du das Gelernte sofort anwenden kannst.",
        selectionTitle: "Wähle Workshop-Themen aus",
        selectionSubtitle: "(Mehrfachauswahl möglich)",
        items: [
          {
            id: "startup-finance",
            title: "Grundlagen der Startup-Finanzierung",
            description: "Meistere die Grundlagen der Finanzplanung und Mittelbeschaffung für Startups"
          },
          {
            id: "product-market-fit",
            title: "Product-Market Fit finden",
            description: "Strategien zur Validierung deines Produkts und zur Findung deines idealen Marktes"
          },
          {
            id: "team-building",
            title: "Aufbau von Hochleistungsteams",
            description: "Lerne, wie du Top-Talente für dein Startup rekrutierst, managst und hältst"
          },
          {
            id: "growth-hacking",
            title: "Growth Hacking Meisterkurs",
            description: "Bewährte Taktiken, um das Wachstum deines Startups mit begrenztem Budget zu beschleunigen"
          }
        ],
        limitedSeats: {
          title: "Begrenzte Plätze verfügbar",
          subtitle: "Jeder Workshop ist auf 20 Teilnehmer begrenzt, um persönliche Betreuung und maximalen Nutzen zu gewährleisten.",
          launchDate: "Startet Q3 2025",
          waitlist: "Trage dich auf die Warteliste ein, um deinen Platz zu sichern"
        },
        testimonials: {
          title: "Wertvolle Lernerfahrungen",
          subtitle: "Sieh, wie Teilnehmer von unseren praxisnahen, von Experten geleiteten Workshops profitiert haben."
        }
      },
      form: {
        title: "Sichere dir deinen Platz!",
        description: "Wähle deine gewünschten Workshops und hinterlasse deine E-Mail-Adresse. Wir benachrichtigen dich, sobald die Termine feststehen und die Anmeldung geöffnet ist.",
        emailPlaceholder: "Deine E-Mail-Adresse",
        buttonText: "Auf die Warteliste setzen",
        successMessage: "Danke! Du stehst auf der Warteliste. Wir melden uns bald.",
        errorMessage: "Fehler beim Senden. Bitte versuche es erneut.",
        noSelectionError: "Bitte wähle mindestens einen Workshop aus."
      },
      exploreMore: {
        title: "Entdecke mehr RapidWorks Services",
        description: "Neben Workshops bieten wir eine Reihe von Lösungen, um dein Startup auf jeder Stufe zu unterstützen – vom MVP bis zur Skalierung."
      }
    }
  };

  if (isLoading || !context) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-emerald-600" /></div>;
  }

  const { language } = context;
  const content = pageContent[language];

  const getWorkshopContent = (workshopId) => {
    const workshopItem = content.workshops.items.find(item => item.id === workshopId);
    return {
      id: workshopId,
      title: workshopItem?.title || '',
      description: workshopItem?.description || '',
      icon: getWorkshopIcon(workshopId), // Helper function to get the icon
    };
  };

  const getWorkshopIcon = (workshopId) => {
    switch (workshopId) {
      case 'startup-finance':
        return <DollarSign className="h-5 w-5" />;
      case 'product-market-fit':
        return <Target className="h-5 w-5" />;
      case 'team-building':
        return <Users className="h-5 w-5" />;
      case 'growth-hacking':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Noise overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-30 pointer-events-none z-0"></div>

      {/* Decorative elements */}
      {/* <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-emerald-200 rounded-full filter blur-3xl opacity-20 -z-10 transform translate-x-1/3 -translate-y-1/3"></div> */}
      {/* <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-green-200 rounded-full filter blur-3xl opacity-20 -z-10 transform -translate-x-1/3 translate-y-1/3"></div> */}

      {/* Import the shared header component */}
      <RapidWorksHeader />

      {/* === Updated Hero Section === */}
      <section className="bg-gradient-to-br from-emerald-600 to-green-600 text-white relative overflow-hidden min-h-[400px]">
        {/* Apply consistent padding */}
        <div className="container mx-auto px-6 pt-32 pb-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center mb-5 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium text-xs shadow-sm">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {content.badge.text}
            </div>
            {/* Ensure standardized font size */}
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

          {/* Add ref to the main content container */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Combined Card with shared border */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200 w-full">
              <div className="lg:flex">
                {/* Left Column - Workshop Selection */}
                <div className="lg:w-1/2 lg:border-r border-gray-200">
                  <div className="p-8">
                    <div className="flex items-start gap-4 mb-8">
                      <div className="bg-emerald-100 p-3 rounded-xl">
                        <Presentation className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold mb-2">{content.workshops.title}</h2>
                        <p className="text-gray-600">
                          {content.workshops.subtitle}
                        </p>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-emerald-600" />
                      {content.workshops.selectionTitle}
                      <span className="text-xs font-normal text-emerald-600 ml-2">{content.workshops.selectionSubtitle}</span>
                    </h3>

                    <div className="space-y-4">
                      {content.workshops.items.map((workshop) => {
                        const workshopContent = getWorkshopContent(workshop.id);
                        return (
                          <div
                            key={workshop.id}
                            className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${selectedWorkshops.includes(workshop.id)
                                ? "border-emerald-300 bg-emerald-50"
                                : "border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50"
                              }`}
                            onClick={() => toggleWorkshop(workshop.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`p-2 rounded-lg ${selectedWorkshops.includes(workshop.id) ? "bg-emerald-100" : "bg-gray-100"
                                  }`}
                              >
                                {getWorkshopIcon(workshop.id)}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">{workshop.title}</h4>
                                <p className="text-gray-600 text-sm">{workshop.description}</p>
                              </div>
                              <div className="ml-auto">
                                <div
                                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${selectedWorkshops.includes(workshop.id)
                                      ? "border-emerald-500 bg-emerald-500"
                                      : "border-gray-300"
                                    }`}
                                >
                                  {selectedWorkshops.includes(workshop.id) && <Check className="h-3 w-3 text-white" />}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6 rounded-xl text-white relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10">
                          <h3 className="text-lg font-bold mb-2">{content.workshops.limitedSeats.title}</h3>
                          <p className="text-white/80 mb-4 text-sm">
                            {content.workshops.limitedSeats.subtitle}
                          </p>

                          <div className="flex items-center gap-3">
                            <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg">
                              <Calendar className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{content.workshops.limitedSeats.launchDate}</p>
                              <p className="text-white/80 text-sm">{content.workshops.limitedSeats.waitlist}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Email Form */}
                <div className="lg:w-1/2 relative">
                  {/* Selection prompt overlay */}
                  {showSelectionPrompt && selectedWorkshops.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-20 lg:flex">
                      <div className="bg-white rounded-xl p-6 max-w-sm mx-8">
                        <h3 className="font-bold text-lg mb-2 text-emerald-700">{content.selectionPrompt.title}</h3>
                        <p className="text-gray-600 mb-4">{content.selectionPrompt.message}</p>
                        <div className="text-emerald-600 flex items-center justify-center gap-2 font-medium">
                          <ArrowDown className="h-5 w-5 lg:hidden" />
                          <span className="lg:hidden">{content.selectionPrompt.mobileText}</span>
                          <ArrowDown className="h-5 w-5 transform -rotate-90 hidden lg:block" />
                          <span className="hidden lg:block">{content.selectionPrompt.desktopText}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    <h2 className="text-2xl font-bold mb-6">{content.form.title}</h2>

                    {!submitted ? (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            {content.form.emailLabel}
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="email"
                              id="email"
                              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder={content.form.emailPlaceholder}
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                        </div>

                        {selectedWorkshops.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {content.form.selectedTopics}
                            </label>
                            <div className="space-y-2 mt-2">
                              {selectedWorkshops.map((workshopId) => {
                                const workshopContent = getWorkshopContent(workshopId);
                                return (
                                  <div key={workshopId} className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-3">
                                    <div className="bg-emerald-100 p-2 rounded-lg">
                                      {getWorkshopIcon(workshopId)}
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-gray-900">
                                        {workshopContent.title}
                                      </h4>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => toggleWorkshop(workshopId)}
                                      className="ml-auto text-gray-400 hover:text-red-500"
                                    >
                                      <X className="h-5 w-5" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="terms"
                              name="terms"
                              type="checkbox"
                              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                              required
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="font-medium text-gray-700">
                              {content.form.consent.checkbox}
                            </label>
                            <p className="text-gray-500">{content.form.consent.subtitle}</p>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${selectedWorkshops.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          disabled={selectedWorkshops.length === 0}
                        >
                          {content.form.button}
                        </button>
                      </form>
                    ) : (
                      <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Check className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{content.form.success.title}</h3>
                        <p className="text-gray-600 mb-4">
                          {content.form.success.message}
                        </p>
                        <button
                          onClick={() => {
                            setSubmitted(false)
                            setEmail("")
                            setSelectedWorkshops([])
                            setShowSelectionPrompt(true)
                          }}
                          className="text-emerald-600 font-medium hover:text-emerald-700"
                        >
                          {content.form.success.anotherEmail}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-6 border-t border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className="bg-emerald-100 p-2 rounded-xl">
                        <Shield className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{content.promise.title}</h3>
                        <p className="text-gray-600 text-sm">
                          {content.promise.text}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add the new component */}
      <WorkshopTestimonialsSection content={content} />
      <ExploreMoreSection excludeService="Workshops" />

    </div>
  )
}

export default WorkshopsPage