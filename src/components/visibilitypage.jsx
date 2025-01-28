import React, { useState, useEffect, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Plus, Minus, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"
import HeroImage2 from "../images/heroimage3.jpg"
import RapidWorksWebsite from "../images/laptop.png"
import RapidWorksLogo from "../images/logo512.png"
import QRCodeLogo from "../images/qrcode.png"
import PlaceholderImage from "../images/more.png"
import RapidWorksHoodie from "../images/hoodie.png"
import RapidWorksBanner from "../images/banner.png"
import RapidWorksEmailSignature from "../images/rapidworksemailsignature.png"
import BusinessCard from "../images/card.png"
import PhoneMockLogo from "../images/phone.png"
import RollupBanner from "../images/rollup.png"
import PitchDeck from "../images/pitchdeck.jpg"
import GuidelineBrand from "../images/guidelinebrand.jpg"
import Calendar from "../images/calendar.png"
import RLogo from "../images/rlogo.jpg"
import VisibilityHero from "../images/background.png"
import { Link, useNavigate } from "react-router-dom"
import BundleForm from "./BundleForm"
import { LanguageContext as AppLanguageContext } from "../App"

const BundleItem = ({ title, description, index, imageSrc }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="mb-12"
  >
    <div className="relative w-full h-64 mb-4 overflow-hidden">
      <img
        src={imageSrc || PlaceholderImage}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
    <h3 className="text-2xl font-light mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
)

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 py-4">
      <button className="flex justify-between items-center w-full text-left" onClick={() => setIsOpen(!isOpen)}>
        <span className="text-lg font-light">{question}</span>
        {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
      </button>
      {isOpen && <p className="mt-2 text-gray-600 font-light">{answer}</p>}
    </div>
  )
}

const BundleSlider = ({ items, currentIndex, setCurrentIndex }) => {
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [items.length, setCurrentIndex])

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <div className="absolute -left-12 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)}
          className="p-2 bg-black text-white hover:bg-gray-900 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
      <div className="absolute -right-12 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
          className="p-2 bg-black text-white hover:bg-gray-900 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Slider Content */}
      <div className="overflow-hidden">
            <motion.div
          className="flex"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {items.map((item, index) => (
            <div key={index} className="min-w-full">
              <div className="grid grid-cols-2 gap-12">
                <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.imageSrc || PlaceholderImage}
                  alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-3xl font-light mb-4">{item.title}</h3>
                  <p className="text-gray-600 text-lg mb-8">{item.description}</p>
                  <button className="inline-flex items-center text-black hover:text-gray-600 transition-colors group">
                    Learn More 
                    <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                  </div>
                </div>
              </div>
          ))}
            </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="mt-12 flex items-center gap-4">
        <div className="text-sm text-gray-500">
          {String(currentIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </div>
        <div className="flex-1 bg-gray-100 h-[2px]">
          <motion.div 
            className="bg-black h-full origin-left"
            animate={{ scaleX: (currentIndex + 1) / items.length }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  )
}

const BundleGrid = ({ items, currentIndex, setCurrentIndex }) => (
  <div className="flex justify-center mt-8">
    <div className="flex gap-2 p-2 bg-white/5 backdrop-blur-sm rounded-full">
      {items.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentIndex(index)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            currentIndex === index 
              ? "bg-violet-500 w-8" 
              : "bg-white/20 hover:bg-white/40"
          }`}
          />
      ))}
    </div>
  </div>
)

// Update the BundleGridItem component to remove the Learn More button
const BundleGridItem = ({ title, description, imageSrc }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group"
  >
    <div className="aspect-[4/3] overflow-hidden mb-4">
      <img
        src={imageSrc || PlaceholderImage}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <h3 className="text-2xl font-light mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
)

const NewsletterForm = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle newsletter signup logic here
    console.log('Newsletter signup:', email)
  }

  return (
    <div className="bg-[#0F1115] text-white p-8 rounded-lg">
      <div className="max-w-md">
        <img src={RapidWorksLogo} alt="Logo" className="h-8 w-8 mb-4" />
        <p className="text-gray-400 mb-6">
          All-in-one brand identity platform for your business to manage design assets and much more
        </p>
        <h3 className="text-xl font-light mb-4">Join our Newsletter</h3>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Your Email Here"
            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-md transition-colors"
          >
            →
          </button>
        </form>
      </div>
    </div>
  )
}

const VisibiltyBundle = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const navigate = useNavigate();
  const context = useContext(AppLanguageContext)
  const [currentLanguage, setCurrentLanguage] = useState(context?.language || 'de')

  // Update local state when context language changes
  useEffect(() => {
    if (context?.language) {
      setCurrentLanguage(context.language)
      console.log("Language updated to:", context.language)
    }
  }, [context?.language])

  // Add safety check after all hooks
  if (!context) {
    console.log("No context available - rendering loading state")
    return <div>Loading...</div>
  }

  const { language, setLanguage } = context

  const handleLanguageChange = (newLang) => {
    console.log("handleLanguageChange called with:", newLang)
    setLanguage(newLang)
    setCurrentLanguage(newLang) // Update local state immediately
  }
  
  const handleGetBundle = () => {
    // navigate('/get-bundle'); // Comment out the old navigation
    window.open('https://forms.office.com/r/Q4RB42z9ni', '_blank'); // Open in new tab
  }

  // Update the pageContent object with more translations
  const pageContent = {
    en: {
      title: "Transform Your Brand Identity",
      subtitle: "Complete brand identity package, delivered in 48 hours.",
      subtext: "Join the brands that trust RapidWorks for their identity needs.",
      cta: "Get Your Bundle Now",
      seeMore: "See What's Included",
      bundleLabel: "Visibility Bundle",
      // Bundle items
      bundleItems: {
        website: {
          title: "Curated Website",
          description: "An elegant, responsive website tailored to your unique aesthetic."
        },
        qrCode: {
          title: "Signature QR Code",
          description: "A custom QR code that seamlessly integrates with your brand identity."
        },
        socialMedia: {
          title: "Social Media Presence",
          description: "Striking banners and profile images for a cohesive online presence."
        },
        stationery: {
          title: "Branded Stationery",
          description: "Luxurious letterheads and business cards that exude quality."
        },
        wallpapers: {
          title: "Digital Wallpapers",
          description: "Chic smartphone and desktop backgrounds that showcase your brand."
        },
        rollup: {
          title: "Rollup",
          description: "Eye-catching rollup banners and flyers for your brand events."
        },
        apparel: {
          title: "Curated Apparel",
          description: "Stylish t-shirt and hoodie designs for brand ambassadors."
        },
        calendar: {
          title: "Seamless Calendar Integration",
          description: "Effortless booking integration for your digital platforms."
        },
        more: {
          title: "And More...",
          description: "Additional brand assets and resources to ensure your complete brand success."
        }
      },
      // FAQ section
      faq: {
        title: "Frequently Asked Questions",
        items: [
          {
            question: "What is the turnaround time for the Visibility Bundle?",
            answer: "We pride ourselves on swift, high-quality delivery. Your complete Visibility Bundle will be ready within 48 hours of receiving your order and brand information."
          },
          {
            question: "Can I request modifications to the designs?",
            answer: "Absolutely. We offer one round of refinements for each item in the bundle to ensure the final result aligns perfectly with your vision."
          },
          {
            question: "Do I receive the source files for the designs?",
            answer: "Yes, we provide all necessary source files, allowing you or your team to make future adjustments as your brand evolves."
          },
          {
            question: "Is the website fully customizable?",
            answer: "The included website is a sophisticated, responsive design. For more advanced customization, we offer bespoke web development services. Please contact us for a personalized quote."
          }
        ]
      },
      // MVP section
      mvp: {
        title: "Need an MVP in 2 Weeks?",
        description: "Transform your idea into a working product with our rapid MVP development service. Zero upfront cost, pay only when amazed.",
        cta: "Learn More",
        weeks: "Weeks"
      },
      // Final CTA section
      finalCta: {
        title: "Ready to Transform Your Brand?",
        subtitle: "Get your complete brand identity package today.",
        cta: "Get Your Bundle Now"
      },
      // How it Works section
      howItWorks: {
        title: "How It Works",
        steps: [
          {
            icon: "1",
            title: "Submit Your Brand Info",
            description: "Share your brand vision, colors, and preferences through our simple form."
          },
          {
            icon: "2",
            title: "We Create Your Assets",
            description: "Our team crafts your complete brand identity package within 48 hours."
          },
          {
            icon: "3",
            title: "Review & Refine",
            description: "Review your brand assets and request any refinements to perfect your identity."
          }
        ]
      },
      // Features section
      features: {
        title: "Complete Brand Package",
        subtitle: "Everything you need to establish a strong brand presence"
      },
      // Process section
      process: {
        title: "Our Process",
        steps: [
          {
            title: "Discovery",
            description: "We learn about your brand vision and goals"
          },
          {
            title: "Creation",
            description: "Our team develops your complete brand identity"
          },
          {
            title: "Refinement",
            description: "Fine-tune your assets until they're perfect"
          },
          {
            title: "Delivery",
            description: "Receive your complete brand package"
          }
        ]
      }
    },
    de: {
      title: "Transformieren Sie Ihre Markenidentität",
      subtitle: "Komplettes Markenidentitätspaket, geliefert in 48 Stunden.",
      subtext: "Schließen Sie sich den Marken an, die RapidWorks für ihre Identitätsbedürfnisse vertrauen.",
      cta: "Holen Sie sich Ihr Paket",
      seeMore: "Sehen Sie, was enthalten ist",
      bundleLabel: "Sichtbarkeits-Paket",
      // Bundle items
      bundleItems: {
        website: {
          title: "Kuratierte Website",
          description: "Eine elegante, responsive Website, maßgeschneidert für Ihre einzigartige Ästhetik."
        },
        qrCode: {
          title: "Signatur-QR-Code",
          description: "Ein individueller QR-Code, der sich nahtlos in Ihre Markenidentität integriert."
        },
        socialMedia: {
          title: "Social Media Präsenz",
          description: "Auffällige Banner und Profilbilder für eine kohärente Online-Präsenz."
        },
        stationery: {
          title: "Geschäftsausstattung",
          description: "Hochwertige Briefköpfe und Visitenkarten, die Qualität ausstrahlen."
        },
        wallpapers: {
          title: "Digitale Hintergründe",
          description: "Stilvolle Smartphone- und Desktop-Hintergründe, die Ihre Marke präsentieren."
        },
        rollup: {
          title: "Roll-up Banner",
          description: "Auffällige Roll-up Banner und Flyer für Ihre Markenveranstaltungen."
        },
        apparel: {
          title: "Kuratierte Kleidung",
          description: "Stilvolle T-Shirt- und Hoodie-Designs für Markenbotschafter."
        },
        calendar: {
          title: "Nahtlose Kalenderintegration",
          description: "Mühelose Buchungsintegration für Ihre digitalen Plattformen."
        },
        more: {
          title: "Und mehr...",
          description: "Zusätzliche Markenelemente und Ressourcen für Ihren vollständigen Markenerfolg."
        }
      },
      // FAQ section
      faq: {
        title: "Häufig gestellte Fragen",
        items: [
          {
            question: "Wie lange dauert die Lieferung des Visibility Bundles?",
            answer: "Wir sind stolz auf unsere schnelle, hochwertige Lieferung. Ihr komplettes Visibility Bundle ist innerhalb von 48 Stunden nach Erhalt Ihrer Bestellung und Markeninformationen fertig."
          },
          {
            question: "Kann ich Änderungen an den Designs anfordern?",
            answer: "Absolut. Wir bieten eine Überarbeitungsrunde für jedes Element im Bundle an, um sicherzustellen, dass das Endergebnis perfekt zu Ihrer Vision passt."
          },
          {
            question: "Erhalte ich die Quelldateien der Designs?",
            answer: "Ja, wir stellen alle notwendigen Quelldateien zur Verfügung, damit Sie oder Ihr Team zukünftige Anpassungen vornehmen können, wenn sich Ihre Marke weiterentwickelt."
          },
          {
            question: "Ist die Website vollständig anpassbar?",
            answer: "Die enthaltene Website ist ein anspruchsvolles, responsives Design. Für fortgeschrittene Anpassungen bieten wir maßgeschneiderte Webentwicklungsdienste an. Bitte kontaktieren Sie uns für ein personalisiertes Angebot."
          }
        ]
      },
      // MVP section
      mvp: {
        title: "Benötigen Sie einen MVP in 2 Wochen?",
        description: "Verwandeln Sie Ihre Idee in ein funktionierendes Produkt mit unserem schnellen MVP-Entwicklungsservice. Keine Vorabkosten, Zahlung nur bei Zufriedenheit.",
        cta: "Mehr erfahren",
        weeks: "Wochen"
      },
      // Final CTA section
      finalCta: {
        title: "Bereit, Ihre Marke zu transformieren?",
        subtitle: "Holen Sie sich heute Ihr komplettes Markenidentitätspaket.",
        cta: "Jetzt Bundle sichern"
      },
      // How it Works section
      howItWorks: {
        title: "So Funktioniert's",
        steps: [
          {
            icon: "1",
            title: "Teilen Sie Ihre Markeninfo",
            description: "Teilen Sie Ihre Markenvision, Farben und Präferenzen über unser einfaches Formular mit."
          },
          {
            icon: "2",
            title: "Wir Erstellen Ihre Assets",
            description: "Unser Team erstellt Ihr komplettes Markenidentitätspaket innerhalb von 48 Stunden."
          },
          {
            icon: "3",
            title: "Prüfen & Verfeinern",
            description: "Überprüfen Sie Ihre Markenelemente und fordern Sie Anpassungen an, um Ihre Identität zu perfektionieren."
          }
        ]
      },
      // Features section
      features: {
        title: "Komplettes Markenpaket",
        subtitle: "Alles, was Sie für eine starke Markenpräsenz benötigen"
      },
      // Process section
      process: {
        title: "Unser Prozess",
        steps: [
          {
            title: "Entdeckung",
            description: "Wir lernen Ihre Markenvision und Ziele kennen"
          },
          {
            title: "Erstellung",
            description: "Unser Team entwickelt Ihre komplette Markenidentität"
          },
          {
            title: "Verfeinerung",
            description: "Optimieren Sie Ihre Assets bis zur Perfektion"
          },
          {
            title: "Lieferung",
            description: "Erhalten Sie Ihr komplettes Markenpaket"
          }
        ]
      }
    }
  }

  // Use currentLanguage instead of language from context
  const content = pageContent[currentLanguage]

  const bundleItems = [
    {
      title: content.bundleItems.website.title,
      description: content.bundleItems.website.description,
      imageSrc: RapidWorksWebsite,
    },
    {
      title: content.bundleItems.qrCode.title,
      description: content.bundleItems.qrCode.description,
      imageSrc: QRCodeLogo,
    },
    {
      title: content.bundleItems.socialMedia.title,
      description: content.bundleItems.socialMedia.description,
      imageSrc: RapidWorksBanner,
    },
    {
      title: content.bundleItems.stationery.title,
      description: content.bundleItems.stationery.description,
      imageSrc: BusinessCard,
    },
    {
      title: content.bundleItems.wallpapers.title,
      description: content.bundleItems.wallpapers.description,
      imageSrc: PhoneMockLogo,
    },
    {
      title: content.bundleItems.rollup.title,
      description: content.bundleItems.rollup.description,
      imageSrc: RollupBanner,
    },
    {
      title: content.bundleItems.apparel.title,
      description: content.bundleItems.apparel.description,
      imageSrc: RapidWorksHoodie,
    },
    {
      title: content.bundleItems.calendar.title,
      description: content.bundleItems.calendar.description,
      imageSrc: Calendar,
    },
    {
      title: content.bundleItems.more.title,
      description: content.bundleItems.more.description,
      imageSrc: PlaceholderImage,
    }
  ]

  const faqItems = content.faq.items;

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="w-full px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2 pl-8 sm:pl-12 lg:pl-16">
              <img src={RapidWorksLogo} alt="Logo" className="h-6 w-6" />
              <Link to="/" className="text-xl font-light hover:text-gray-600 transition-colors">
                RapidWorks
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => handleLanguageChange('en')}
                className={`text-sm transition-colors ${language === 'en' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                EN
              </button>
              <button 
                onClick={() => handleLanguageChange('de')}
                className={`text-sm transition-colors ${language === 'de' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                DE
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative w-full overflow-x-hidden">
        {/* Hero Section */}
        <div className="relative w-full">
          <div className="relative min-h-screen flex flex-col md:items-center">
            {/* Desktop Background Image - Unchanged */}
            <div className="absolute inset-0 translate-y-16 mr-0 md:mr-4 lg:mr-8 xl:mr-16 hidden md:block">
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full w-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                src={VisibilityHero}
                alt="Hero background"
              />
            </div>

            {/* Mobile Layout - Flex column for vertical stacking */}
            <div className="flex flex-col md:hidden">
              {/* Mobile Image First */}
              <div className="w-full h-[60vh]">
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full w-full object-contain scale-[1.3] transform transition-transform duration-700 px-4 sm:px-8"
                  src={PlaceholderImage}
                alt="Hero background"
              />
            </div>

              {/* Mobile Text Content Below */}
              <div className="w-full bg-white px-6 py-8">
                <div className="max-w-[480px] mx-auto space-y-4 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="animate-float"
                  >
                    <span className="inline-block text-violet-600 text-xs md:text-sm uppercase tracking-wider font-light
                      px-2 py-0.5 md:px-4 md:py-1 rounded-full bg-violet-50/80 md:bg-violet-50 border border-violet-100 backdrop-blur-sm shadow-sm"
                    >
                      {content.bundleLabel}
                    </span>
                  </motion.div>

                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-2xl md:text-5xl lg:text-6xl font-bold text-gray-900 md:text-black leading-[1.1] tracking-tight"
                  >
                    {content.title}
                  </motion.h1>

                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-sm md:text-lg font-light leading-relaxed max-w-xl mx-auto md:mx-0"
                  >
                    {content.subtitle}
                    <span className="block mt-1 md:mt-2 text-xs md:text-base text-gray-500 md:text-gray-600">
                      {content.subtext}
                    </span>
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-2 md:gap-4 pt-2 md:pt-4 justify-center md:justify-start"
                  >
                    <button 
                      onClick={handleGetBundle}
                      className="group relative inline-flex items-center justify-center px-4 py-2 md:px-6 md:py-3 text-sm font-light 
                        overflow-hidden rounded-full text-white bg-black transition-all duration-300
                        shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
                    >
                      <span className="relative z-10 flex items-center">
                        {content.cta}
                        <ArrowRight className="ml-2 -mr-1 h-4 w-4 transition-transform group-hover:translate-x-2" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-violet-500 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                    <a 
                      href="#features" 
                      className="group inline-flex items-center justify-center px-4 py-2 md:px-6 md:py-3 text-sm font-light
                        rounded-full text-gray-600 bg-gray-50 hover:bg-gray-100 transition-all duration-300
                        border border-gray-200 hover:border-gray-300 hover:scale-105 hover:shadow-lg"
                    >
                      {content.seeMore}
                      <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Desktop Content - Unchanged */}
            <div className="hidden md:block relative w-full">
              <div className="relative min-h-screen flex items-center">
              <div className="w-full pl-0 sm:pl-4 md:pl-8 lg:pl-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-32 items-center">
                  {/* Text Content */}
                  <div className="w-full max-w-[480px] mx-auto md:mx-0">
                    <div className="space-y-2 md:space-y-6 text-center md:text-left px-6 py-3 md:p-0">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="animate-float"
                      >
                        <span className="inline-block text-violet-600 text-xs md:text-sm uppercase tracking-wider font-light
                          px-2 py-0.5 md:px-4 md:py-1 rounded-full bg-violet-50/80 md:bg-violet-50 border border-violet-100 backdrop-blur-sm shadow-sm"
                        >
                          {content.bundleLabel}
                        </span>
                      </motion.div>

                      <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-2xl md:text-5xl lg:text-6xl font-bold text-gray-900 md:text-black leading-[1.1] tracking-tight"
                      >
                        {content.title}
                      </motion.h1>

                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-sm md:text-lg font-light leading-relaxed max-w-xl mx-auto md:mx-0"
                      >
                        {content.subtitle}
                        <span className="block mt-1 md:mt-2 text-xs md:text-base text-gray-500 md:text-gray-600">
                          {content.subtext}
                        </span>
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-2 md:gap-4 pt-2 md:pt-4 justify-center md:justify-start"
                      >
                        <button 
                          onClick={handleGetBundle}
                          className="group relative inline-flex items-center justify-center px-4 py-2 md:px-6 md:py-3 text-sm font-light 
                            overflow-hidden rounded-full text-white bg-black transition-all duration-300
                            shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
                        >
                          <span className="relative z-10 flex items-center">
                            {content.cta}
                            <ArrowRight className="ml-2 -mr-1 h-4 w-4 transition-transform group-hover:translate-x-2" />
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-violet-500 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                        <a 
                          href="#features" 
                          className="group inline-flex items-center justify-center px-4 py-2 md:px-6 md:py-3 text-sm font-light
                            rounded-full text-gray-600 bg-gray-50 hover:bg-gray-100 transition-all duration-300
                            border border-gray-200 hover:border-gray-300 hover:scale-105 hover:shadow-lg"
                        >
                          {content.seeMore}
                          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                      </motion.div>
                    </div>
                  </div>

                  {/* Right Column - Unchanged */}
                  <div className="hidden lg:block">
                    {/* Empty for image placement */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comment out the slider section */}
        {/* <section id="features" className="py-24">
          <div className="max-w-6xl mx-auto px-16">
            <h2 className="text-3xl font-light mb-16">
              Complete Brand Package
            </h2>
            <BundleSlider
              items={bundleItems}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
          </div>
        </section> */}

        {/* Grid section */}
        {/* <section className="pt-32 pb-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-light mb-16 text-center">
              Everything You Need
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {bundleItems.map((item, index) => (
                <BundleGridItem
                  key={index}
                  title={item.title}
                  description={item.description}
                  imageSrc={item.imageSrc}
                />
              ))}
            </div>
          </div>
        </section> */}

        {/* Features Section (Everything You Need) */}
        <section id="features" className="py-40 overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white relative">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-violet-50/50 rounded-full blur-3xl" />
            <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] bg-violet-50/30 rounded-full blur-3xl" />
            <div className="absolute top-1/4 left-1/2 w-4 h-4 bg-violet-200/20 rounded-full blur-sm" />
            <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-violet-200/30 rounded-full blur-md" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-40 relative"
            >
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 text-violet-600 text-sm uppercase tracking-wider font-light mb-6 px-6 py-2 rounded-full bg-violet-50/80 border border-violet-100 shadow-sm backdrop-blur-sm"
              >
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                Designed for Impact
              </motion.span>

              <h2 className="text-4xl md:text-6xl font-light mb-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                {content.features.title}
              </h2>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                {content.features.subtitle}
              </p>

              {/* Enhanced Decorative Elements */}
              <div className="absolute left-1/2 -translate-x-1/2 mt-12">
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-violet-300 to-transparent" />
                <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-violet-200 to-transparent mt-2" />
                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-violet-100 to-transparent mt-2" />
              </div>
            </motion.div>
            
            {/* Alternating List Items */}
            <div className="space-y-56 relative">
              {/* Enhanced Connecting Line with Animation */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] hidden md:block">
                <motion.div 
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full origin-top"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-violet-200 via-violet-200/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-violet-200/30 via-transparent to-transparent" />
                </motion.div>
              </div>
              
              {bundleItems.map((item, index) => (
                <motion.div 
                  key={index} 
                  className="relative group"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {/* Enhanced Connecting Dot */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-100 to-violet-200 border-2 border-violet-300 relative shadow-lg">
                      <div className="absolute -inset-1 rounded-full border border-violet-200/50 animate-ping" />
                      <div className="absolute inset-0 rounded-full bg-violet-400/20 animate-pulse" />
                      <div className="absolute -inset-2 rounded-full border border-violet-200/50" />
                      <div className="absolute -inset-3 rounded-full border border-violet-100/30" />
                    </div>
                  </div>

                  {/* Content Container */}
                  <motion.div 
                    className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 md:gap-32`}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Image Side with Enhanced Effects */}
                    <div className="w-full md:w-1/2">
                      <div className="relative aspect-[4/3] overflow-hidden group rounded-3xl">
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
                          className="h-full transform-gpu"
                        >
                          <img
                            src={item.imageSrc || PlaceholderImage}
                            alt={item.title}
                            className="w-full h-full object-contain mix-blend-multiply filter contrast-125"
                          />
                          {/* Enhanced Gradient Effects */}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50/30 group-hover:opacity-0 transition-all duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-tr from-violet-50/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
                          {/* Enhanced Border and Shadow */}
                          <div className="absolute inset-0 border border-gray-200/20 rounded-3xl shadow-[0_8px_32px_-4px_rgba(0,0,0,0.1)] group-hover:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.15)] transition-all duration-700" />
                        </motion.div>
                      </div>
                    </div>
                    
                    {/* Content Side with Enhanced Typography */}
                    <div className="w-full md:w-1/2">
                      <motion.div
                        className="relative pl-16 md:pl-0"
                        whileHover={{ x: index % 2 === 0 ? 10 : -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Enhanced Item Number */}
                        <span className="absolute -left-4 md:-left-12 top-1 text-8xl md:text-[10rem] font-extralight text-violet-200/10 select-none">
                          {(index + 1).toString().padStart(2, '0')}
                        </span>
                        
                        <div className="space-y-8">
                          <div className="space-y-6">
                            <h3 className="text-3xl md:text-5xl font-light tracking-tight bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                          
                          {/* Enhanced Decorative Elements */}
                          <div className="relative">
                            <div className="w-32 h-[2px] bg-gradient-to-r from-violet-500 to-violet-300 rounded-full opacity-40" />
                            <div className="absolute top-0 left-0 w-16 h-[2px] bg-gradient-to-r from-violet-400 to-transparent rounded-full animate-pulse" />
                            <div className="absolute top-2 left-0 w-24 h-[1px] bg-gradient-to-r from-violet-300 to-transparent rounded-full opacity-20" />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section - Moved under Features */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-light text-center mb-16">
              {content.howItWorks.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {content.howItWorks.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="relative bg-white p-8 group hover:bg-black transition-colors duration-500"
                  >
                    <div className="absolute -top-8 left-8 text-7xl font-light text-black/10 group-hover:text-white/10 transition-colors duration-500">
                      {step.icon}
                    </div>
                    <div className="relative">
                      <h3 className="text-2xl font-light mb-4 group-hover:text-white transition-colors duration-500">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 group-hover:text-gray-300 transition-colors duration-500">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>

        {/* MVP Section */}
        <section className="py-12 sm:py-32 bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
              <div className="flex-1">
                <h2 className="text-xl sm:text-4xl font-light mb-2 sm:mb-4">
                  {content.mvp.title}
                </h2>
                <p className="text-sm sm:text-xl text-gray-300 mb-4 sm:mb-8">
                  {content.mvp.description}
                </p>
                <Link 
                  to="/" 
                  className="inline-flex items-center px-3 sm:px-6 py-2 sm:py-3 bg-white text-black hover:bg-gray-100 transition-colors font-light text-xs sm:text-base"
                >
                  {content.mvp.cta}
                  <ArrowRight className="ml-1 sm:ml-2 -mr-1 h-3 w-3 sm:h-5 sm:w-5" />
                </Link>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 blur-3xl opacity-20"></div>
                  <div className="relative text-4xl sm:text-6xl md:text-8xl font-bold">
                    2<span className="text-violet-500">{content.mvp.weeks}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-light mb-8">{content.finalCta.title}</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
              {content.finalCta.subtitle}
            </p>
            <button 
              onClick={handleGetBundle}
              className="bg-black text-white px-8 py-3 rounded-none font-light hover:bg-gray-900 transition duration-300 inline-flex items-center text-lg"
            >
              {content.finalCta.cta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </section>
      </main>

      {showForm && <BundleForm onClose={() => setShowForm(false)} />}

      <footer className="bg-[#0F1115] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12">
            {/* Newsletter Section */}
            <div className="max-w-md">
              <NewsletterForm />
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-400">
                Copyright © 2024 RapidWorks. All rights reserved.
              </div>
              <div className="flex gap-6">
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">Impressum</Link>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default VisibiltyBundle

