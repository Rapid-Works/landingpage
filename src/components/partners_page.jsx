"use client"

import { useState, useEffect, useContext, useRef } from "react"
import {
  Mail,
  Check,
  X,
  Loader2,
  Landmark, // Notary
  Calculator, // Tax Advisor
  Briefcase, // Auditor
  Scale, // Legal Advisor
  HandCoins, // Funding Consultant
  ShieldCheck, // Data Protection Officer
  Users, // General Partner icon
  ArrowDown, // For prompt
  CheckCircle // Used for badge
} from "lucide-react"
import LandingPartners from "../images/landing_partners.png"
import RapidWorksHeader from "./new_landing_page_header"
// Import the new Airtable service function
import { submitPartnerInterestToAirtable } from '../utils/airtableService'
import { LanguageContext as AppLanguageContext } from "../App"
// import ExploreMoreSection from "./ExploreMoreSection" // Can remove this import if not used elsewhere

const PartnersPage = () => {
  const context = useContext(AppLanguageContext);
  const [scrolled, setScrolled] = useState(false)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  // State to store partner needs: { partnerId: monthsValue, ... }
  // monthsValue: '1', '2', '3', '4', '5', '6', '6+'
  const [partnerNeeds, setPartnerNeeds] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const contentSectionRef = useRef(null);
  const [showSelectionPrompt, setShowSelectionPrompt] = useState(true); // Add state for the prompt

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

  // Effect to hide prompt once a selection is made
  useEffect(() => {
    if (Object.keys(partnerNeeds).length > 0) {
      setShowSelectionPrompt(false);
    } else {
      // Optional: Show prompt again if all selections are removed
      setShowSelectionPrompt(true);
    }
  }, [partnerNeeds]);

  const handleNeedChange = (partnerId, value) => {
    setPartnerNeeds(prev => {
      const newNeeds = { ...prev };
      if (value === "" || value === "0") { // Treat "" or "0" as unselected
        delete newNeeds[partnerId];
      } else {
        newNeeds[partnerId] = value;
      }
      return newNeeds;
    });
    setError(""); // Clear error when selection changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("") // Clear previous errors

    if (!email) {
      setError("Please enter your email address")
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (Object.keys(partnerNeeds).length === 0) {
      setError("Please indicate when you might need at least one partner.");
      return;
    }

    // Format the partner needs for Airtable Notes
    const partnerNeedsString = Object.entries(partnerNeeds).map(([id, months]) => {
      const partnerContent = getPartnerContent(id);
      const monthText = months === '6+' ? '6+ months' : `${months} month(s)`;
      return `${partnerContent.title}: ${monthText}`;
    }).join(", ");

    try {
      await submitPartnerInterestToAirtable({
        email,
        partnerNeedsString // Send the formatted string
      })

      setSubmitted(true)
      setError("")
    } catch (error) {
      setError("Failed to submit your interest. Please try again.")
      console.error("Submission error:", error)
    }
  }

  // Page content object with translations
  const pageContent = {
    en: {
      badge: { // Add badge content
        text: "Coming Soon" // Or adjust as needed
      },
      hero: {
        title: "Find Your Advisors",
        subtitle: "Not every advisor is suited for a startup's needs. We know that, so we help you find the right one. Let us know which advisors you need in the next months and we'll find them.",
      },
      partners: {
        title: "Indicate Your Needs",
        subtitle: "Select the timeframe (in months) when you anticipate needing each type of expert.",
        selectionTitle: "Required Partners & Timeline",
        items: [
          { id: "notary", title: "Notary", description: "For company formation, contracts, certifications." },
          { id: "tax-advisor", title: "Tax Advisor", description: "For tax declarations, optimization, bookkeeping setup." },
          { id: "auditor", title: "Auditor", description: "For financial statement audits, compliance checks." },
          { id: "legal-advisor", title: "Legal Advisor", description: "For contracts, investment rounds, legal disputes." },
          { id: "funding-consultant", title: "Funding Consultant", description: "For grant applications, funding strategies." },
          { id: "data-protection", title: "Data Protection Officer", description: "For GDPR compliance, data privacy policies." }
        ],
        demandInfo: {
          title: "Demand-Driven Network",
          subtitle: "We connect with experts once sufficient demand is identified. Your input shapes our partner network!",
          cta: "Indicate your needs above"
        }
      },
      form: {
        title: "Submit Your Interest",
        emailLabel: "Your Email Address",
        emailPlaceholder: "you@example.com",
        selectedNeedsTitle: "Selected Partner Needs", // Title for the summary
        consent: {
          checkbox: "I agree to be contacted regarding potential partner matches",
          subtitle: "We respect your privacy and will only share relevant opportunities."
        },
        button: "Submit Interest",
        success: {
          title: "Thank You!",
          message: "Your interest has been recorded. We'll reach out when we have relevant partner matches based on collective demand.",
          anotherEmail: "Submit for another email"
        }
      },
       errorPrompt: {
         noSelection: "Please indicate when you might need at least one partner.",
         invalidEmail: "Please enter a valid email address.",
         noEmail: "Please enter your email address.",
         submitFailed: "Failed to submit your interest. Please try again."
       },
       selectionPrompt: { // Add prompt text
         title: "Indicate Needs First",
         message: "Please select a timeframe for at least one partner from the left panel.",
         mobileText: "Scroll up to select",
         desktopText: "Select from the left"
       }
    },
    de: {
      badge: { // Add badge content (German)
        text: "Demnächst verfügbar"
      },
      hero: {
        title: "Finde deine Berater",
        subtitle: "Nicht jeder Berater ist für die Bedürfnisse eines Startups geeignet. Das wissen wir, deshalb helfen wir dir, den Richtigen zu finden. Sag uns, welche Berater du in den nächsten Monaten brauchst, und wir finden sie für dich.",
      },
      partners: {
        title: "Gib deinen Bedarf an",
        subtitle: "Wähle den Zeitraum (in Monaten), wann du voraussichtlich jeden Expertentyp brauchst.",
        selectionTitle: "Benötigte Partner & Zeitplan",
        items: [
          { id: "notary", title: "Notar", description: "Für Firmengründung, Verträge, Beglaubigungen." },
          { id: "tax-advisor", title: "Steuerberater", description: "Für Steuererklärungen, Optimierung, Buchhaltungseinrichtung." },
          { id: "auditor", title: "Wirtschaftsprüfer", description: "Für Jahresabschlussprüfungen, Compliance-Prüfungen." },
          { id: "legal-advisor", title: "Rechtsberater", description: "Für Verträge, Investitionsrunden, Rechtsstreitigkeiten." },
          { id: "funding-consultant", title: "Fördermittelberater", description: "Für Förderanträge, Finanzierungsstrategien." },
          { id: "data-protection", title: "Datenschutzbeauftragter", description: "Für DSGVO-Konformität, Datenschutzrichtlinien." }
        ],
        demandInfo: {
          title: "Nachfragebasiertes Netzwerk",
          subtitle: "Wir knüpfen Kontakte zu Experten, sobald genügend Nachfrage besteht. Dein Input formt unser Partnernetzwerk!",
          cta: "Gib oben deinen Bedarf an"
        }
      },
      form: {
        title: "Interesse bekunden",
        emailLabel: "Deine E-Mail-Adresse",
        emailPlaceholder: "du@example.com",
        selectedNeedsTitle: "Ausgewählter Partnerbedarf", // Title for the summary
        consent: {
          checkbox: "Ich stimme zu, dass du mich bezüglich potenzieller Partner kontaktierst",
          subtitle: "Wir respektieren deine Privatsphäre und teilen nur relevante Möglichkeiten."
        },
        button: "Interesse bekunden",
        success: {
          title: "Vielen Dank!",
          message: "Dein Interesse wurde registriert. Wir melden uns, sobald wir basierend auf der Gesamtnachfrage relevante Partner-Matches haben.",
          anotherEmail: "Für eine andere E-Mail eintragen"
        }
      },
      errorPrompt: {
          noSelection: "Bitte gib an, wann du mindestens einen Partner brauchen könntest.",
          invalidEmail: "Bitte gib eine gültige E-Mail-Adresse ein.",
          noEmail: "Bitte gib deine E-Mail-Adresse ein.",
          submitFailed: "Interesse konnte nicht übermittelt werden. Bitte versuche es erneut."
        },
      selectionPrompt: { // Add prompt text (German)
        title: "Zuerst Bedarf angeben",
        message: "Bitte wähle einen Zeitraum für mindestens einen Partner im linken Bereich aus.",
        mobileText: "Hochscrollen zum Auswählen",
        desktopText: "Links auswählen"
        }
    }
  };

  if (isLoading || !context) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-blue-600" /></div>;
  }

  const { language } = context;
  const content = pageContent[language];

  // Update error messages based on language
  if (error === "Please enter your email address") setError(content.errorPrompt.noEmail);
  if (error === "Please enter a valid email address") setError(content.errorPrompt.invalidEmail);
  if (error === "Please indicate when you might need at least one partner.") setError(content.errorPrompt.noSelection);
  if (error === "Failed to submit your interest. Please try again.") setError(content.errorPrompt.submitFailed);


  const getPartnerContent = (partnerId) => {
    const partnerItem = content.partners.items.find(item => item.id === partnerId);
    return {
      id: partnerId,
      title: partnerItem?.title || '',
      description: partnerItem?.description || '',
    };
  };

  const getPartnerIcon = (partnerId) => {
    switch (partnerId) {
      case 'notary': return <Landmark className="h-5 w-5 text-white" />;
      case 'tax-advisor': return <Calculator className="h-5 w-5 text-white" />;
      case 'auditor': return <Briefcase className="h-5 w-5 text-white" />;
      case 'legal-advisor': return <Scale className="h-5 w-5 text-white" />;
      case 'funding-consultant': return <HandCoins className="h-5 w-5 text-white" />;
      case 'data-protection': return <ShieldCheck className="h-5 w-5 text-white" />;
      default: return <Users className="h-5 w-5 text-white" />; // Default icon
    }
  };

  const monthOptions = [
      { value: "0", label: language === 'de' ? "Nicht benötigt" : "Not Needed" },
      { value: "ASAP", label: language === 'de' ? "Sofort" : "ASAP" },
      { value: "1", label: language === 'de' ? "In 1 Monat" : "In 1 Month" },
      { value: "2", label: language === 'de' ? "In 2 Monaten" : "In 2 Months" },
      { value: "3", label: language === 'de' ? "In 3 Monaten" : "In 3 Months" },
      { value: "4", label: language === 'de' ? "In 4 Monaten" : "In 4 Months" },
      { value: "5", label: language === 'de' ? "In 5 Monaten" : "In 5 Months" },
      { value: "6+", label: language === 'de' ? "In 6+ Monaten" : "In 6+ Months" },
  ];

  // Function to scroll to content
  const scrollToContent = () => {
    contentSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#073E47]/20 selection:text-[#073E47]">
      {/* Noise overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-30 pointer-events-none z-0"></div>

      <RapidWorksHeader />

      {/* === Updated Hero Section === */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={LandingPartners} 
            alt="Rapid Partners Hero Background" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        {/* Color overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#073E47]/90 to-[#185E53]/90 z-10"></div>

        {/* Apply consistent padding and z-index */}
        <div className="container mx-auto px-6 py-20 md:py-24 lg:py-32 flex flex-col justify-center relative z-20 h-full">
          <div className="text-center max-w-3xl mx-auto">
            {/* Ensure standardized font size */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-white">
              {content.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-medium">
              {content.hero.subtitle}
            </p>
          </div>
        </div>
        <button
            onClick={scrollToContent}
            className="absolute bottom-12 left-0 right-0 flex justify-center animate-bounce cursor-pointer bg-transparent border-none focus:outline-none z-30"
            aria-label="Scroll to content"
          >
            <svg className="w-8 h-8 text-white/70 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
        </button>
      </section>
      {/* === End Updated Hero Section === */}

      {/* Main Content */}
      <main ref={contentSectionRef} className="py-20">
        <div className="container mx-auto px-6">
          {/* Header section outside and centered above the card */}
          <div className="text-center mb-12 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.partners.title}</h2>
            <p className="text-gray-600 text-lg mb-8">
              {content.partners.subtitle}
            </p>
            <h3 className="text-xl font-semibold mb-6">{content.partners.selectionTitle}</h3>
          </div>

          <div className="bg-white rounded-3xl shadow-lg overflow-hidden w-full">
            <div className="lg:flex">
              {/* Left Column - Partner Selection */}
              <div className="lg:w-1/2 lg:border-r border-gray-200">
                <div className="px-8 pb-8 pt-0">
                  <div className="space-y-4">
                    {content.partners.items.map((partner) => (
                      <div
                        key={partner.id}
                        className={`p-4 rounded-xl border border-gray-200 transition-all duration-300 ${
                          partnerNeeds[partner.id] ? "bg-teal-50 border-teal-200" : ""
                        }`}
                      >
                        <div className="flex flex-wrap items-start gap-3">
                          <div className="p-2 rounded-lg flex-shrink-0 bg-teal-800">
                            {getPartnerIcon(partner.id)}
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-bold text-gray-900">{partner.title}</h4>
                            <p className="text-gray-600 text-sm">{partner.description}</p>
                          </div>
                          <div className="w-full sm:w-36 mt-2 sm:mt-0 sm:ml-auto flex-shrink-0">
                            <select
                              value={partnerNeeds[partner.id] || "0"}
                              onChange={(e) => handleNeedChange(partner.id, e.target.value)}
                              className="block w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#073E47] focus:border-[#073E47]"
                            >
                              {monthOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Demand Info Box */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="bg-gradient-to-r from-[#073E47] to-[#185E53] p-6 rounded-xl text-white relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                       <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                      <div className="relative z-10">
                        <h3 className="text-lg font-bold mb-2">{content.partners.demandInfo.title}</h3>
                        <p className="text-white/80 mb-4 text-sm">
                          {content.partners.demandInfo.subtitle}
                        </p>
                        <p className="text-white font-medium">{content.partners.demandInfo.cta}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Email Form */}
              <div className="lg:w-1/2 relative">
                 {/* ADD BACK: Selection prompt overlay */}
                 {showSelectionPrompt && Object.keys(partnerNeeds).length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-20 lg:flex p-4">
                      <div className="bg-white rounded-xl p-6 max-w-sm text-center">
                        <h3 className="font-bold text-lg mb-2 text-[#073E47]">{content.selectionPrompt.title}</h3>
                        <p className="text-gray-600 mb-4">{content.selectionPrompt.message}</p>
                        <div className="text-[#185E53] flex items-center justify-center gap-2 font-medium">
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
                              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#073E47] focus:border-[#073E47]"
                              placeholder={content.form.emailPlaceholder}
                              value={email}
                              onChange={(e) => { setEmail(e.target.value); setError(""); }} // Clear error on change
                            />
                          </div>
                          {error && error !== content.errorPrompt.noSelection && <p className="mt-2 text-sm text-red-600">{error}</p>}
                        </div>

                        {/* ADD BACK: Selected Needs Summary */}
                        {Object.keys(partnerNeeds).length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {content.form.selectedNeedsTitle}
                            </label>
                            <div className="space-y-2 mt-2">
                              {Object.entries(partnerNeeds).map(([partnerId, months]) => {
                                const partnerContent = getPartnerContent(partnerId);
                                const monthLabel = monthOptions.find(opt => opt.value === months)?.label || months;
                                return (
                                  <div key={partnerId} className="bg-[#185E53]/5 border border-[#185E53]/20 rounded-xl p-3 flex items-start gap-3">
                                    <div className="bg-teal-800 p-2 rounded-lg">
                                      {getPartnerIcon(partnerId)}
                                    </div>
                                    <div className="flex-grow">
                                      <h4 className="font-bold text-gray-900 text-sm">
                                        {partnerContent.title}
                                      </h4>
                                      <p className="text-xs text-[#073E47]">{monthLabel}</p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleNeedChange(partnerId, "0")} // Use handler to deselect
                                      className="ml-auto text-gray-400 hover:text-red-500 p-1 -m-1"
                                      aria-label={`Remove ${partnerContent.title}`}
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        {/* Display noSelection error here if applicable */}
                         {error && error === content.errorPrompt.noSelection && (
                              <p className="mt-2 text-sm text-red-600">{error}</p>
                          )}

                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                              <input
                                  id="terms"
                                  name="terms"
                                  type="checkbox"
                                  className="h-4 w-4 text-[#073E47] focus:ring-[#073E47] border-gray-300 rounded"
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
                          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#073E47] to-[#185E53] hover:from-[#073E47]/90 hover:to-[#185E53]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#073E47] ${Object.keys(partnerNeeds).length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                          disabled={Object.keys(partnerNeeds).length === 0}
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
                                 setPartnerNeeds({})
                                 setShowSelectionPrompt(true); // Show prompt again after success reset
                             }}
                             className="text-[#073E47] font-medium hover:text-[#185E53]"
                         >
                             {content.form.success.anotherEmail}
                         </button>
                     </div>
                    )}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Removed the ExploreMoreSection component */}
      {/* <ExploreMoreSection excludeService="Partners" /> */}

    </div>
  )
}

export default PartnersPage 