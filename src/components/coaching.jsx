"use client"

import { useState, useEffect, useContext, useRef } from "react"
import { ArrowRight, Compass, Calendar, Check, Target, TrendingUp, MessageSquare, MapPin, Loader2, MessageSquareText, User } from "lucide-react"
import YannickProfile from "../images/yannick_plain_bg.png"
import LandingCoaching from "../images/landing_coaching.png"
import RapidWorksHeader from "./new_landing_page_header"
import { LanguageContext as AppLanguageContext } from "../App"
import ExploreMoreSection from "./ExploreMoreSection"
import { testimonials } from "../testimonialsData"
import TestimonialCard from "./TestimonialCard"

// Single coach data
const coach = {
  name: "Yannick Heeren",
  role: "CEO RapidWorks",
  image: YannickProfile,
  bio: "I am Yannick, the Founder and CEO of RapidWorks, the 3rd Startup I cofounded so far. In my Startup journey until now I built amazing software products, recruited hundreds of employees, sold amazing services to thousands of customers, scaled Startups quickly bootstrapped as well as investor financed but crucially made tons of mistakes down the road. As your Coach I will help you gaining the best results for your Startup and avoiding unnecessary mistakes.",
  expertise: [
    "Product Strategy",
    "Process optimization",
    "Market Validation",
    "Growth Hacking",
    "Team Building",
    "Fundraising"
  ],
  experience: "Coached 50+ Startups",
  education: "BSc Mathematical Technical Software Engineer, FH Aachen",
  achievements: [
    "Recruited 1,700 freelancers and 40 FTEs",
    "Served 6,500 customers making 7 figure revenue",
    "Scaled both Startups to 8 figure valuations",
    "Coached 50 Startups in the DigitalHUB Aachen"
  ]
}

// +++ Add Coaching Testimonials Section +++
const CoachingTestimonialsSection = ({ content }) => {
  const coachingTestimonials = testimonials.filter(
    t => t.services.includes("coaching") // Find coaching testimonials
  );

  if (coachingTestimonials.length === 0) {
    return null;
  }

  // Determine grid columns based on the number of testimonials
  const gridColsClass = `grid-cols-1 ${
    coachingTestimonials.length >= 2 ? 'md:grid-cols-2' : ''
  } ${
    coachingTestimonials.length >= 3 ? 'lg:grid-cols-3' : ''
  }`;

  return (
    <section className="py-24 bg-[#FFFBF5]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-4xl mx-auto">
           <div className="inline-flex items-center gap-3 text-orange-600 text-sm font-semibold mb-6 px-5 py-2.5 rounded-full border-2 border-orange-300 bg-white shadow-sm">
              <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
              <span>{content.testimonials?.badge || "KUNDENERFAHRUNGEN"}</span>
           </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {content.testimonials?.title || "Durch Coaching transformiert"}
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            {content.testimonials?.subtitle || "Erfahre, wie unser persönliches Coaching Gründern half, Herausforderungen zu meistern und dein Unternehmenswachstum zu beschleunigen."}
          </p>
        </div>
        <div className={`grid ${gridColsClass} gap-8 max-w-7xl mx-auto`}>
          {coachingTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              quote={testimonial.quote}
              authorName={testimonial.authorName}
              authorTitle={testimonial.authorTitle}
              imageUrl={testimonial.imageUrl}
              companyLogoUrl={testimonial.companyLogoUrl}
              borderColor="border-orange-400" // Use orange border
            />
          ))}
        </div>
      </div>
    </section>
  );
};
// +++ End of Coaching Testimonials Section +++

const CoachingPage = () => {
  const context = useContext(AppLanguageContext);
  const [isLoading, setIsLoading] = useState(true);
  const whySectionRef = useRef(null);

  useEffect(() => {
    if (context) {
      setIsLoading(false);
    }
  }, [context]);

  const scrollToWhySection = () => {
    whySectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // --- Page Content Object ---
  const pageContent = {
    en: {
      pageBadge: "Rapid Coaching",
      heroTitle: "Unleash your",
      heroHighlight: "Full Potential",
      heroSubtitle: "Year-round coaching by veteran founders who have been in your shoes and know what it takes to succeed.",
      scrollIndicatorAria: "Scroll to why coaching matters",
      whySection: {
        title: "Why Founder Coaching Matters",
        description: "Being a founder is the hardest job in the world. Our coaching program provides the guidance, accountability, and support you need to navigate challenges and accelerate your growth.",
        ctaButton: "Schedule a Free Session"
      },
      coachSection: {
        title: "Meet Your Coach",
        subtitle: "Work directly with an experienced founder who understands the challenges and opportunities of building a successful startup.",
        coachRole: "CEO RapidWorks",
        coachBio: "I am Yannick, the Founder and CEO of RapidWorks, the 3rd Startup I cofounded so far. In my Startup journey until now I built amazing software products, recruited hundreds of employees, sold amazing services to thousands of customers, scaled Startups quickly bootstrapped as well as investor financed but crucially made tons of mistakes down the road. As your Coach I will help you gaining the best results for your Startup and avoiding unnecessary mistakes.",
        achievementsTitle: "Key Achievements",
        expertiseTitle: "Areas of Expertise",
        education: "BSc Mathematical Technical Software Engineer, FH Aachen",
        experience: "Coached 50+ Startups",
        ctaButton: "Schedule a Session with Yannick",
        badgeText: "Your Coach",
        subtext: "Founded 3 Startups and coached 50+ Startups"
      },
      howItWorks: {
        title: "How Our Coaching Works",
        subtitle: "A structured approach designed to deliver measurable results for your business.",
        steps: [
          { title: "Initial Assessment", description: "We start with a comprehensive assessment of your business, goals, challenges, and opportunities." },
          { title: "Strategy Development", description: "Together, we create a customized coaching plan with clear objectives and key results (OKRs)." },
          { title: "Regular Sessions", description: "Ongoing coaching sessions focused on implementation, problem-solving, and accountability." },
          { title: "Measure & Adjust", description: "Regular progress reviews to celebrate wins, learn from setbacks, and refine your strategy." }
        ],
        ctaButton: "Sitzung mit Yannick vereinbaren",
        badgeText: "Dein Coach",
        subtext: "3 Startups gegründet und 50+ Startups gecoacht"
      },
      expertise: {
        productStrategy: "Product Strategy",
        processOptimization: "Process optimization",
        marketValidation: "Market Validation",
        growthHacking: "Growth Hacking",
        teamBuilding: "Team Building",
        fundraising: "Fundraising"
      },
      achievements: {
        recruited: "Recruited 1,700 freelancers and 40 FTEs",
        servedCustomers: "Served 6,500 customers making 7 figure revenue",
        scaledStartups: "Scaled both Startups to 8 figure valuations",
        coachedStartups: "Coached 50 Startups in the DigitalHUB Aachen"
      },
      testimonials: {
        badge: "KUNDENERFAHRUNGEN",
        title: "Durch Coaching transformiert",
        subtitle: "Erfahre, wie unser persönliches Coaching Gründern half, Herausforderungen zu meistern und dein Unternehmenswachstum zu beschleunigen."
      }
    },
    de: {
      pageBadge: "Rapid Coaching",
      heroTitle: "Entfessle dein",
      heroHighlight: "volles Potenzial",
      heroSubtitle: "Ganzjähriges Coaching durch erfahrene Gründer, die in deinen Schuhen gesteckt haben und wissen, was zum Erfolg führt.",
      scrollIndicatorAria: "Scrollen, warum Coaching wichtig ist",
      whySection: {
        title: "Warum Gründer-Coaching wichtig ist",
        description: "Gründer zu sein ist der härteste Job der Welt. Unser Coaching-Programm bietet die Anleitung, Verantwortlichkeit und Unterstützung, die du brauchst, um Herausforderungen zu meistern und dein Wachstum zu beschleunigen.",
        ctaButton: "Kostenlose Sitzung vereinbaren"
      },
      coachSection: {
        title: "Triff deinen Coach",
        subtitle: "Arbeite direkt mit einem erfahrenen Gründer zusammen, der die Herausforderungen und Chancen beim Aufbau eines erfolgreichen Startups versteht.",
        coachRole: "CEO RapidWorks",
        coachBio: "Ich bin Yannick, Gründer und CEO von RapidWorks, dem dritten Startup, das ich bisher mitgegründet habe. Auf meiner Startup-Reise habe ich bisher erstaunliche Softwareprodukte entwickelt, Hunderte von Mitarbeitern eingestellt, großartige Dienstleistungen an Tausende von Kunden verkauft, Startups schnell gebootstrapped sowie investorenfinanziert skaliert, aber entscheidend auch Unmengen an Fehlern auf dem Weg gemacht. Als dein Coach helfe ich dir, die besten Ergebnisse für dein Startup zu erzielen und unnötige Fehler zu vermeiden.",
        achievementsTitle: "Wichtige Erfolge",
        expertiseTitle: "Kompetenzbereiche",
        education: "BSc Mathematisch-technischer Softwareentwickler, FH Aachen",
        experience: "50+ Startups gecoacht",
        ctaButton: "Sitzung mit Yannick vereinbaren",
        badgeText: "Dein Coach",
        subtext: "3 Startups gegründet und 50+ Startups gecoacht"
      },
      howItWorks: {
        title: "Wie unser Coaching funktioniert",
        subtitle: "Ein strukturierter Ansatz, der darauf ausgelegt ist, messbare Ergebnisse für dein Unternehmen zu liefern.",
        steps: [
          { title: "Erstbewertung", description: "Wir beginnen mit einer umfassenden Bewertung deines Unternehmens, deiner Ziele, Herausforderungen und Chancen." },
          { title: "Strategieentwicklung", description: "Gemeinsam erstellen wir einen maßgeschneiderten Coaching-Plan mit klaren Zielen und Schlüsselergebnissen (OKRs)." },
          { title: "Regelmäßige Sitzungen", description: "Laufende Coaching-Sitzungen mit Fokus auf Umsetzung, Problemlösung und Verantwortlichkeit." },
          { title: "Messen & Anpassen", description: "Regelmäßige Fortschrittsüberprüfungen, um Erfolge zu feiern, aus Rückschlägen zu lernen und deine Strategie zu verfeinern." }
        ],
        ctaButton: "Sitzung mit Yannick vereinbaren",
        badgeText: "Dein Coach",
        subtext: "3 Startups gegründet und 50+ Startups gecoacht"
      },
      expertise: {
        productStrategy: "Produktstrategie",
        processOptimization: "Prozessoptimierung",
        marketValidation: "Marktvalidierung",
        growthHacking: "Growth Hacking",
        teamBuilding: "Teambildung",
        fundraising: "Fundraising"
      },
      achievements: {
        recruited: "1.700 Freelancer und 40 FTEs rekrutiert",
        servedCustomers: "6.500 Kunden bedient und 7-stelligen Umsatz erzielt",
        scaledStartups: "Beide Startups auf 8-stellige Bewertungen skaliert",
        coachedStartups: "50 Startups im DigitalHUB Aachen gecoacht"
      },
      testimonials: {
        badge: "KUNDENERFAHRUNGEN",
        title: "Durch Coaching transformiert",
        subtitle: "Erfahre, wie unser persönliches Coaching Gründern half, Herausforderungen zu meistern und dein Unternehmenswachstum zu beschleunigen."
      }
    }
  };

  if (isLoading || !context) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-orange-600" /></div>;
  }

  const { language } = context;
  const content = pageContent[language];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-orange-200 selection:text-orange-900">
      {/* Noise overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-30 pointer-events-none z-0"></div>

      {/* Decorative elements */}
      {/* <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-orange-200 rounded-full filter blur-3xl opacity-20 -z-10 transform translate-x-1/3 -translate-y-1/3"></div> */}
      {/* <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-amber-200 rounded-full filter blur-3xl opacity-20 -z-10 transform -translate-x-1/3 translate-y-1/3"></div> */}

      {/* Replace custom header with shared header component */}
      <RapidWorksHeader />

      {/* === Updated Hero Section === */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden text-white">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={LandingCoaching} 
            alt="Rapid Coaching Hero Background" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        {/* Color overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/70 to-amber-600/70 z-10"></div>

        {/* Apply consistent padding and z-index */}
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 lg:py-32 flex flex-col justify-center relative z-20 h-full">
          <div className="text-center max-w-3xl mx-auto">
            {/* Ensure standardized font size */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight tracking-tight text-white">
              {content.heroTitle}{" "}
              {content.heroHighlight && (
              <span className="relative inline-block">
                  {content.heroHighlight}
                </span>
              )}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed font-medium px-2">
              {content.heroSubtitle}
            </p>
          </div>
        </div>
        <button
            onClick={scrollToWhySection}
            className="absolute bottom-6 sm:bottom-12 left-0 right-0 flex justify-center animate-bounce cursor-pointer bg-transparent border-none focus:outline-none z-30"
            aria-label={content.scrollIndicatorAria}
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white/70 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
        </button>
      </section>
      {/* === End Updated Hero Section === */}

      {/* Main Content */}
      <main className="py-20">
        <div className="container mx-auto px-6">
          {/* Add ref to the "Why" Section */}
          <div ref={whySectionRef} className="bg-white rounded-3xl overflow-hidden mb-20 relative p-16 md:p-20 text-center shadow-xl max-w-6xl mx-auto">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzAwMCIvPgo8L3N2Zz4K')] z-0"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 leading-tight max-w-4xl mx-auto">{content.whySection.title}</h2>
              <p className="text-gray-700 text-xl md:text-2xl mb-14 mx-auto max-w-5xl leading-relaxed font-light">
                {content.whySection.description}
              </p>

              <button
                className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white px-12 py-5 rounded-full font-semibold transition-all flex items-center gap-3 group mx-auto text-lg shadow-lg hover:shadow-xl hover:scale-105"
                onClick={() => window.open("https://calendly.com/yannick-familie-heeren/30min", "_blank")}
              >
                {content.whySection.ctaButton}
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </main>

          {/* Single Coach Profile Section */}
      <section className="py-20 bg-gradient-to-br from-orange-400 to-orange-600 text-white">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">{content.coachSection.title}</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                {content.coachSection.subtitle}
              </p>
            </div>

          {/* Main Coach Card */}
          <div className="bg-transparent rounded-3xl overflow-hidden mb-8 max-w-6xl mx-auto border-2 border-white relative pt-12">
            <div className="absolute top-8 left-8 z-10">
              <div className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full inline-flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{content.coachSection.badgeText}</span>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-2/5 relative">
                <div className="aspect-[4/5] lg:aspect-auto lg:h-full relative">
                    <img
                      src={coach.image}
                      alt={coach.name}
                    className="w-full h-full object-cover object-center filter drop-shadow-[0_15px_45px_rgba(255,193,7,0.6)]"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 pt-12" style={{ background: 'linear-gradient(to top, rgba(217, 119, 6, 0.5) 10%, transparent 100%)' }}>
                    <h3 className="text-3xl font-bold text-white mb-1">{coach.name}</h3>
                    <p className="text-white/90 text-lg">{coach.role}</p>
                    <p className="text-white/80 text-sm mt-1">{content.coachSection.subtext}</p>
                    </div>
                  </div>
                </div>

              <div className="lg:w-3/5 p-8 lg:p-12">
                <p className="text-white/95 text-lg lg:text-xl leading-relaxed">
                    {content.coachSection.coachBio}
                  </p>
              </div>
            </div>
          </div>

          {/* Achievement and Expertise Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* Achievements Card */}
            <div className="bg-transparent rounded-3xl p-8 border-2 border-white">
              <h4 className="text-white font-bold text-lg uppercase tracking-wider mb-6">{content.coachSection.achievementsTitle}</h4>
              <ul className="space-y-4">
                      {Object.keys(content.achievements).map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <div className="text-white mt-1 flex-shrink-0">
                      <Check className="h-5 w-5" />
                          </div>
                    <span className="text-white/90 text-base leading-relaxed">{content.achievements[key]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

            {/* Expertise Card */}
            <div className="bg-transparent rounded-3xl p-8 border-2 border-white">
              <h4 className="text-white font-bold text-lg uppercase tracking-wider mb-6">{content.coachSection.expertiseTitle}</h4>
              <div className="grid grid-cols-2 gap-3">
                      {Object.keys(content.expertise).map((key) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border-2 border-white bg-transparent relative flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>
                    <span className="text-white/90 text-sm font-medium">
                      {content.expertise[key]}
                    </span>
                  </div>
                ))}
                  </div>

                  <button
                className="w-full mt-8 py-4 bg-[#FF6B6B] text-white rounded-2xl hover:bg-[#FF5252] transition-all flex items-center justify-center gap-2 font-semibold text-lg shadow-lg hover:shadow-xl"
                    onClick={() => window.open("https://calendly.com/yannick-familie-heeren/30min", "_blank")}
                  >
                    {content.coachSection.ctaButton}
                <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
      </section>

      <div className="container mx-auto px-6">
          {/* How It Works Section */}
        <div className="mb-20 pt-20">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{content.howItWorks.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {content.howItWorks.subtitle}
              </p>
            </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {content.howItWorks.steps.map((step, index) => {
              const icons = [<MapPin className="h-7 w-7 text-orange-500" />, <Target className="h-7 w-7 text-orange-500" />, <Calendar className="h-7 w-7 text-orange-500" />, <TrendingUp className="h-7 w-7 text-orange-500" />];
                return (
                <div key={index} className="relative">
                  <div className="absolute -top-8 left-4 w-16 h-16 bg-orange-300 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {index + 1}
                    </div>
                  <div className="bg-white rounded-2xl shadow-lg p-8 h-full border border-gray-100 pt-12">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-shrink-0">
                        {icons[index % icons.length]}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* +++ Render the Coaching Testimonials Section +++ */}
        

        </div>
      <CoachingTestimonialsSection content={content} />
      {/* Add the new component */}
      <ExploreMoreSection excludeService="Coaching" />

    </div>
  )
}

export default CoachingPage

