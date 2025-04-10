"use client"

import { useState, useEffect, useContext, useRef } from "react"
import { ArrowRight, Compass, Calendar, Check, Target, TrendingUp, MessageSquare, MapPin, Loader2 } from "lucide-react"
import YannickProfile from "../images/yannickprofile.png"
import RapidWorksHeader from "./new_landing_page_header"
import { LanguageContext as AppLanguageContext } from "../App"
import ExploreMoreSection from "./ExploreMoreSection"

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

      {/* Hero Section Wrapper */}
      <section className="bg-gradient-to-br from-orange-600 to-amber-600 text-white relative overflow-hidden min-h-[400px]">
        <div className="container mx-auto px-6 pt-32 pb-24">
          {/* Page intro */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center mb-4 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium text-sm">
              <Compass className="h-4 w-4 inline mr-1" />
              {content.pageBadge}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold mb-6 leading-tight tracking-tight text-white">
              {content.heroTitle}{" "}
              <span className="relative inline-block">
                <span className="relative z-10">
                  {content.heroHighlight}
                </span>
                <span className="absolute bottom-2 left-0 w-full h-4 bg-white/20 rounded-lg -z-10"></span>
              </span>
            </h1>

            <p className="text-xl text-white/90 leading-relaxed">
              {content.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-20">
        <div className="container mx-auto px-6">
          {/* Add ref to the "Why" Section */}
          <div ref={whySectionRef} className="bg-gradient-to-br from-white to-orange-50 rounded-3xl overflow-hidden mb-20 relative p-8 md:p-12 text-center shadow-lg border border-orange-100">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{content.whySection.title}</h2>
              <p className="text-gray-700 text-lg mb-8 mx-auto max-w-3xl">
                {content.whySection.description}
              </p>

              <button
                className="bg-orange-600 text-white px-8 py-4 rounded-full font-medium hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-900/20 transition-all flex items-center gap-2 group mx-auto"
                onClick={() => window.open("https://calendly.com/yannick-familie-heeren/30min", "_blank")}
              >
                {content.whySection.ctaButton}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Single Coach Profile Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{content.coachSection.title}</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {content.coachSection.subtitle}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 max-w-5xl mx-auto">
              <div className="md:flex">
                <div className="md:w-2/5">
                  <div className="h-full relative">
                    <img
                      src={coach.image}
                      alt={coach.name}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent md:bg-gradient-to-r"></div>
                    <div className="absolute bottom-0 left-0 p-6 md:p-8">
                      <div className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded-full inline-block mb-2">
                        {content.coachSection.badgeText}
                      </div>
                      <h3 className="text-2xl font-bold text-white">{coach.name}</h3>
                      <p className="text-white/80">{coach.role}</p>
                      <p className="text-white/70 text-sm mt-1">{content.coachSection.subtext}</p>
                    </div>
                  </div>
                </div>

                <div className="md:w-3/5 p-6 md:p-8">
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    {content.coachSection.coachBio}
                  </p>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{content.coachSection.achievementsTitle}</h4>
                    <ul className="space-y-2">
                      {Object.keys(content.achievements).map((key) => (
                        <li key={key} className="flex items-start gap-2">
                          <div className="text-orange-600 mt-1">
                            <Check className="h-4 w-4" />
                          </div>
                          <span className="text-gray-700">{content.achievements[key]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{content.coachSection.expertiseTitle}</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(content.expertise).map((key) => (
                        <span
                          key={key}
                          className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {content.expertise[key]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    className="w-full py-4 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 mt-6"
                    onClick={() => window.open("https://calendly.com/yannick-familie-heeren/30min", "_blank")}
                  >
                    <Calendar className="h-5 w-5" />
                    {content.coachSection.ctaButton}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{content.howItWorks.title}</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {content.howItWorks.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {content.howItWorks.steps.map((step, index) => {
                const icons = [<MapPin className="h-6 w-6 text-orange-600" />, <Target className="h-6 w-6 text-orange-600" />, <MessageSquare className="h-6 w-6 text-orange-600" />, <TrendingUp className="h-6 w-6 text-orange-600" />];
                return (
                  <div key={index} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 relative">
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="mb-4">
                      <div className="bg-orange-100 p-3 rounded-xl inline-block">
                        {icons[index % icons.length]}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Add the new component */}
      <ExploreMoreSection excludeService="Coaching" />

    </div>
  )
}

export default CoachingPage

