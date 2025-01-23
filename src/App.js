import React, { useState, createContext, useContext, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Rocket,
  Lightbulb,
  Code,
  CheckCircle,
  ChevronDown,
  X,
  Menu,
  DollarSign,
  Clock,
  UserCheck,
  CreditCard,
} from "lucide-react"
import { Input } from "./components/ui/input"
import { Textarea } from "./components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import HeroImage from "./images/heroimage.jpg"
import HeroImage1 from "./images/heroimage2.jpg"
import HeroImage2 from "./images/heroimage3.jpg"
import NRWLogo from "./images/nwrlogo.png"
import { Link, Routes, Route } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import BundleForm from "./components/BundleForm"
import VisibiltyBundle from "./components/visibilitypage"

// Create Language Context
const LanguageContext = createContext()

// Translation Object
const translations = {
  en: {
    nav: {
      services: "Services",
      approach: "Our Approach",
      contact: "Contact",
      getStarted: "Get Started",
      impressum: "Legal Notice",
      visibility: "Visibility Bundle",
    },
    hero: {
      title: "Your Idea, Live in 2 Weeks",
      subtitle: "Get your MVP free of charge, only pay when you are amazed by the result.",
      cta: "Book Your Free Consultation",
    },
    services: {
      title: "Our Services",
      subtitle: "Tailored solutions to launch your idea faster than ever",
      strategic: {
        title: "Strategic Coaching",
        description:
          "One-on-one expert coaching by an experienced founder to help validate and refine your idea. We'll work together to define your MVP and create a roadmap for success.",
        features: ["Idea validation and refinement", "Market analysis and positioning", "MVP feature prioritization"],
      },
      development: {
        title: "Rapid MVP Development",
        description:
          "We bring your MVP to life in just 2 weeks. Focus on your core business while we handle the technical implementation, delivering a fully functional product ready for user testing.",
        features: ["Full-stack development", "User-centric design", "Core feature implementation"],
      },
      funding: {
        title: "Funding Guidance",
        description: "We assist startups in securing government funding to support their growth and development.",
        features: [
          "Up to €35,000 in government funding",
          "Guidance through the application process",
          "Support for startups in North Rhine-Westphalia",
        ],
        specialNote: "* This funding is specific to NRW, but we can support startups in other regions as well.",
      },
    },
    approach: {
      title: "Our 3D Approach to MVP Success",
      subtitle: "A proven methodology to turn your idea into a market-ready product",
      steps: {
        discovery: {
          title: "Discovery",
          description:
            "Together we dive deep into your idea, market, and goals to create a solid foundation for your MVP. Our guidance helps refine your concept for maximum customer validation.",
        },
        development: {
          title: "Development",
          description:
            "We bring your MVP to life in just 2 weeks, using cutting-edge technologies. We focus on core features that demonstrate your product's value to real customers.",
        },
        delivery: {
          title: "Delivery",
          description:
            "We present your fully functional MVP, ready for user testing. So far this has been completely free of charge. If you're not amazed by your MVP right now, you don't have to buy it. The only thing you have to invest is 2 weeks of our time.",
        },
      },
    },
    why: {
      title: "Why Founders Choose RapidWorks",
      subtitle: "Unmatched speed, expertise, and support for your journey",
      features: {
        founders: {
          title: "Built By Founders, For Founders",
          description: "We understand your unique challenges and time constraints because we've been there ourselves.",
        },
        speed: {
          title: "Lightning Fast Development",
          description: "Get your MVP in just 2 weeks, accelerating your time to market and investor pitches.",
        },
        risk: {
          title: "Risk-Free Engagement",
          description: "Free consultation and 2-week development period. Pay only when you're satisfied with your MVP.",
        },
        funding: {
          title: "Government Funding Support",
          description:
            "For startups in North Rhine-Westphalia, we assist in applying for government funding covering 70% of our services.",
        },
      },
    },
    postMVP: {
      title: "Our Offer After Your MVP",
      subtitle: "Continue your journey with flexible, high-quality development support",
      features: {
        hours: {
          title: "1,000 Hours of Development",
          description: "Access a pool of 1,000 development hours to use as needed. Start and stop at your convenience.",
        },
        developer: {
          title: "Dedicated Developer",
          description:
            "Work with the same developer throughout the year, ensuring consistency and deep understanding of your project.",
        },
        payment: {
          title: "Flexible Payment",
          description:
            "Pay only for the hours worked, billed at the end of each month. Cancel anytime with no long-term commitment.",
        },
      },
    },
    contact: {
      title: "Ready to Launch Your Idea?",
      subtitle:
        "Take the first step towards bringing your idea to life. Schedule your free consultation today and let's build something amazing together.",
      form: {
        name: "Your Name",
        email: "Your Email",
        idea: "Tell us about your project idea",
        submit: "Request Free Consultation",
        terms: "By submitting this form, you agree to our",
        termsLink: "terms of service",
        and: "and",
        privacyLink: "privacy policy",
      },
    },
    footer: {
      copyright: "© 2025 RapidWorks Agency. All rights reserved.",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
    },
    impressum: {
      title: "Legal Notice",
      companyInfo: {
        title: "Company Information",
        name: "RapidWorks Agency GmbH",
        street: "Innovationsstraße 42",
        city: "50667 Köln",
        country: "Germany",
        email: "contact@rapidworks.de",
        phone: "+49 (0) 221 123456",
        managing: "Managing Director",
        managingName: "Max Mustermann",
      },
      registration: {
        title: "Registration",
        court: "District Court Köln",
        number: "HRB 123456",
        vatId: "VAT ID: DE123456789",
      },
      responsibility: {
        title: "Responsible for Content",
        name: "Max Mustermann",
        address: "Address same as above",
      },
    },
  },
  de: {
    nav: {
      services: "Leistungen",
      approach: "Unser Ansatz",
      contact: "Kontakt",
      getStarted: "Jetzt Starten",
      impressum: "Impressum",
      visibility: "Sichtbarkeits-Bundle",
    },
    hero: {
      title: "Ihre Idea, live in 2 Wochen",
      subtitle: "Wir entwickeln Ihren MVP in nur 14 Tagen - kostenfrei bis Sie von den Ergebnissen begeistert sind.",
      cta: "Kostenloses Beratungsgespräch",
    },
    services: {
      title: "Unsere Rapid MVP Services",
      subtitle: "Maßgeschneiderte Lösungen, um Ihre Idee schneller als je zuvor zu verwirklichen",
      strategic: {
        title: "Strategische Beratung",
        description:
          "Individuelle Expertenberatung durch einen erfahrenen Gründer, um Ihre Idee zu validieren und zu verfeinern. Gemeinsam definieren wir Ihren MVP und erstellen einen Fahrplan zum Erfolg.",
        features: [
          "Ideenvalidierung und -verfeinerung",
          "Marktanalyse und Positionierung",
          "MVP Feature-Priorisierung",
        ],
      },
      development: {
        title: "Schnelle MVP-Entwicklung",
        description:
          "Wir erwecken Ihren MVP in nur 2 Wochen zum Leben. Konzentrieren Sie sich auf Ihr Kerngeschäft, während wir die technische Umsetzung übernehmen und ein voll funktionsfähiges Produkt für Benutzertests liefern.",
        features: ["Full-Stack-Entwicklung", "Benutzerorientiertes Design", "Kernfunktionen-Implementierung"],
      },
      funding: {
        title: "Fördermittelberatung",
        description:
          "Wir unterstützen Startups bei der Beschaffung von staatlichen Fördermitteln zur Förderung ihres Wachstums und ihrer Entwicklung.",
        features: [
          "Bis zu 35.000 € staatliche Förderung",
          "Betreuung während des Antragsverfahrens",
          "Unterstützung für Startups in Nordrhein-Westfalen",
        ],
        specialNote:
          "* Diese Förderung gilt speziell für NRW, wir können aber auch Startups in anderen Regionen unterstützen.",
      },
    },
    approach: {
      title: "Unser 3D-Ansatz zum MVP-Erfolg",
      subtitle: "Eine bewährte Methodik, um Ihre Idee in ein marktreifes Produkt zu verwandeln",
      steps: {
        discovery: {
          title: "Entdeckung",
          description:
            "Gemeinsam tauchen wir tief in Ihre Idee, den Markt und Ihre Ziele ein, um eine solide Grundlage für Ihren MVP zu schaffen. Unsere Beratung hilft, Ihr Konzept für maximale Kundenvalidierung zu verfeinern.",
        },
        development: {
          title: "Entwicklung",
          description:
            "Wir bringen Ihren MVP in nur 2 Wochen zum Leben und nutzen modernste Technologien. Wir konzentrieren uns auf Kernfunktionen, die den Wert Ihres Produkts für echte Kunden demonstrieren.",
        },
        delivery: {
          title: "Übergabe",
          description:
            "Wir präsentieren Ihren voll funktionsfähigen MVP, bereit für Benutzertests. Bis hierhin ist alles komplett kostenfrei. Wenn Sie von Ihrem MVP nicht begeistert sind, müssen Sie ihn nicht kaufen. Das Einzige, was Sie investieren müssen, sind 2 Wochen unserer Zeit.",
        },
      },
    },
    why: {
      title: "Warum Gründer RapidWorks wählen",
      subtitle: "Unübertroffene Geschwindigkeit, Expertise und Unterstützung für Ihre Reise",
      features: {
        founders: {
          title: "Von Gründern für Gründer",
          description:
            "Wir verstehen Ihre einzigartigen Herausforderungen und zeitlichen Einschränkungen, weil wir selbst dort waren.",
        },
        speed: {
          title: "Blitzschnelle Entwicklung",
          description:
            "Erhalten Sie Ihren MVP in nur 2 Wochen und beschleunigen Sie Ihren Markteintritt und Investorenpräsentationen.",
        },
        risk: {
          title: "Risikofreies Engagement",
          description:
            "Kostenlose Beratung und 2-wöchige Entwicklungsphase. Zahlen Sie nur, wenn Sie mit Ihrem MVP zufrieden sind.",
        },
        funding: {
          title: "Förderung durch die öffentliche Hand",
          description:
            "Für Startups in Nordrhein-Westfalen unterstützen wir Sie bei der Beantragung von öffentlichen Fördermitteln, die 70% unserer Leistungen abdecken.",
        },
      },
    },
    postMVP: {
      title: "Unser Angebot nach Ihrem MVP",
      subtitle: "Setzen Sie Ihre Reise mit flexibler, hochwertiger Entwicklungsunterstützung fort",
      features: {
        hours: {
          title: "1.000 Stunden Entwicklung",
          description:
            "Zugriff auf einen Pool von 1.000 Entwicklungsstunden nach Bedarf. Starten und stoppen Sie ganz bequem.",
        },
        developer: {
          title: "Dedizierter Entwickler",
          description:
            "Arbeiten Sie das ganze Jahr über mit demselben Entwickler zusammen, um Konsistenz und ein tiefes Verständnis Ihres Projekts zu gewährleisten.",
        },
        payment: {
          title: "Flexible Zahlung",
          description:
            "Bezahlen Sie nur die geleisteten Stunden, die am Ende jedes Monats abgerechnet werden. Jederzeit kündbar ohne langfristige Bindung.",
        },
      },
    },
    contact: {
      title: "Bereit, Ihre Idee zu starten?",
      subtitle:
        "Machen Sie den ersten Schritt, um Ihre Idee zum Leben zu erwecken. Vereinbaren Sie noch heute Ihr kostenloses Beratungsgespräch und lassen Sie uns gemeinsam etwas Erstaunliches aufbauen.",
      form: {
        name: "Ihr Name",
        email: "Ihre E-Mail",
        idea: "Erzählen Sie uns von Ihrer Projektidee",
        submit: "Kostenloses Beratungsgespräch anfragen",
        terms: "Mit dem Absenden des Formulars stimmen Sie unseren",
        termsLink: "AGBs",
        and: "und der",
        privacyLink: "Datenschutzerklärung",
      },
    },
    footer: {
      copyright: "© 2025 RapidWorks Agency. Alle Rechte vorbehalten.",
      terms: "AGB",
      privacy: "Datenschutz",
    },
    impressum: {
      title: "Impressum",
      companyInfo: {
        title: "Unternehmensangaben",
        name: "RapidWorks Agency GmbH",
        street: "Innovationsstraße 42",
        city: "50667 Köln",
        country: "Deutschland",
        email: "contact@rapidworks.de",
        phone: "+49 (0) 221 123456",
        managing: "Geschäftsführer",
        managingName: "Max Mustermann",
      },
      registration: {
        title: "Registereintrag",
        court: "Amtsgericht Köln",
        number: "HRB 123456",
        vatId: "USt-IdNr.: DE123456789",
      },
      responsibility: {
        title: "Verantwortlich für den Inhalt",
        name: "Max Mustermann",
        address: "Adresse wie oben",
      },
    },
  },
}

// Language Flag Component
const LanguageFlag = ({ code }) => {
  const flags = {
    en: (
      <svg className="w-5 h-5" viewBox="0 0 640 480">
        <path fill="#012169" d="M0 0h640v480H0z" />
        <path
          fill="#FFF"
          d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"
        />
        <path
          fill="#C8102E"
          d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"
        />
        <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z" />
        <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" />
      </svg>
    ),
    de: (
      <svg className="w-5 h-5" viewBox="0 0 640 480">
        <path fill="#FFCE00" d="M0 320h640v160H0z" />
        <path d="M0 0h640v160H0z" />
        <path fill="#DD0000" d="M0 160h640v160H0z" />
      </svg>
    ),
  }

  return flags[code] || null
}

// Language Selector Component
const LanguageSelector = ({ isMobile = false, onSelect }) => {
  const { language, setLanguage } = useContext(LanguageContext)

  const buttonClass = isMobile
    ? "flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md"
    : "flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"

  const handleChange = (e) => {
    e.stopPropagation() // Prevent event from bubbling up
    setLanguage(e.target.value)
    if (onSelect) onSelect()
  }

  return (
    <div className={isMobile ? "w-full" : "relative inline-flex items-center"}>
      <select
        value={language}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()} // Prevent click from bubbling up
        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
      >
        <option value="en">English</option>
        <option value="de">Deutsch</option>
      </select>
      <div className={buttonClass} onClick={(e) => e.stopPropagation()}>
        {" "}
        {/* Prevent click from bubbling up */}
        <LanguageFlag code={language} />
        <span className="ml-2">{language.toUpperCase()}</span>
      </div>
    </div>
  )
}

// Navigation Link Component
const NavLink = ({ href, onClick, children }) => {
  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      if (onClick) onClick()
    }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
    >
      {children}
    </a>
  )
}

function Header() {
  const { language, setLanguage, translate } = useContext(LanguageContext)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <Rocket className="h-6 w-6 text-violet-600" />
              <span className="text-xl font-light">RapidWorks</span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-8">
            <Link to="/#services" className="text-gray-600 hover:text-gray-900">
              {translate("nav.services")}
            </Link>
            <Link to="/#approach" className="text-gray-600 hover:text-gray-900">
              {translate("nav.approach")}
            </Link>
            <Link to="/visibility" className="text-gray-600 hover:text-gray-900">
              {translate("nav.visibility")}
            </Link>
            <Link to="/#contact" className="text-gray-600 hover:text-gray-900">
              {translate("nav.contact")}
            </Link>
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            <Link
              to="/#contact"
              className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-900 rounded-none"
            >
              {translate("nav.getStarted")}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/#services"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
              >
                {translate("nav.services")}
              </Link>
              <Link
                to="/#approach"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
              >
                {translate("nav.approach")}
              </Link>
              <Link
                to="/visibility"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
              >
                {translate("nav.visibility")}
              </Link>
              <Link
                to="/#contact"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
              >
                {translate("nav.contact")}
              </Link>
              <div className="px-3 py-2">
                <LanguageSelector isMobile={true} onSelect={() => setIsOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

function HeroSection({ fadeIn }) {
  const { translate, language } = useContext(LanguageContext)

  const renderTitle = () => {
    const beforeText = language === "en" ? "Your Idea, Live in " : "Ihre Idee, live in "
    const highlightedText = language === "en" ? "2 Weeks" : "2 Wochen"

    return (
      <>
        {beforeText}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cb5eee] to-[#4be1ec]">
          {highlightedText}
        </span>
      </>
    )
  }

  return (
    <section className="w-full min-h-[70vh] md:min-h-[80vh] py-12 md:py-24 lg:py-32 xl:py-48 bg-black relative overflow-hidden flex items-center">
      <div className="absolute inset-0 opacity-10">
        <img src={HeroImage || "/placeholder.svg"} alt="Background" className="w-full h-full object-cover" />
      </div>
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          className="flex flex-col items-center space-y-6 md:space-y-4 text-center"
          initial="initial"
          animate="animate"
          variants={fadeIn}
        >
          <div className="space-y-4 md:space-y-2">
            <h1 className="text-5xl md:text-6xl lg:text-7xl/none font-bold tracking-tighter text-white px-2">
              {renderTitle()}
            </h1>
            <p className="mx-auto max-w-[700px] text-lg md:text-xl text-gray-300 px-4 mt-4">
              {translate("hero.subtitle")}
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2 px-4 mt-8 md:mt-6">
            <button
              className="w-full px-6 py-4 text-lg font-medium bg-white text-black rounded-md hover:bg-gray-100 transform transition hover:scale-105"
              onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })}
            >
              {translate("hero.cta")}
            </button>
          </div>
        </motion.div>
      </div>
      <motion.div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
      >
        <ChevronDown className="h-8 w-8 text-white" />
      </motion.div>
    </section>
  )
}

const ServicesSection = ({ fadeIn }) => {
  const { translate } = useContext(LanguageContext)

  return (
    <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <motion.div
          className="text-center mb-12"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{translate("services.title")}</h2>
          <p className="mt-4 text-gray-500 md:text-xl">{translate("services.subtitle")}</p>
        </motion.div>
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
          <ServiceCard
            icon={DollarSign}
            title={translate("services.funding.title")}
            description={translate("services.funding.description")}
            features={translate("services.funding.features")}
            specialNote={translate("services.funding.specialNote")}
            logo={NRWLogo}
          />
          <ServiceCard
            icon={Lightbulb}
            title={translate("services.strategic.title")}
            description={translate("services.strategic.description")}
            features={translate("services.strategic.features")}
          />
          <ServiceCard
            icon={Code}
            title={translate("services.development.title")}
            description={translate("services.development.description")}
            features={translate("services.development.features")}
          />
        </div>
      </div>
    </section>
  )
}

const ServiceCard = ({ icon: Icon, title, description, features, specialNote, logo }) => (
  <motion.div initial="initial" whileInView="animate" viewport={{ once: true }}>
    <Card className="bg-gray-50 border-none shadow-lg hover:shadow-xl transition-shadow relative">
      {logo && <img src={logo || "/placeholder.svg"} alt="NRW Logo" className="absolute top-4 right-4 w-12 h-12" />}
      <CardHeader>
        <Icon className="w-10 h-10 text-violet-500 mb-2" />
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
        <ul className="mt-4 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckCircle className="h-5 w-5 text-violet-500 mr-2" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        {specialNote && <p className="mt-4 text-xs text-gray-500">{specialNote}</p>}
      </CardContent>
    </Card>
  </motion.div>
)

const ApproachSection = ({ fadeIn }) => {
  const { translate } = useContext(LanguageContext)

  return (
    <section id="approach" className="w-full py-12 md:py-24 lg:py-32 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src={HeroImage1 || "/placeholder.svg"} alt="Background" className="w-full h-full object-cover" />
      </div>
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{translate("approach.title")}</h2>
          <p className="mt-4 text-gray-400 md:text-xl">{translate("approach.subtitle")}</p>
        </motion.div>
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
          {[
            {
              icon: Lightbulb,
              title: translate("approach.steps.discovery.title"),
              description: translate("approach.steps.discovery.description"),
            },
            {
              icon: Code,
              title: translate("approach.steps.development.title"),
              description: translate("approach.steps.development.description"),
            },
            {
              icon: Rocket,
              title: translate("approach.steps.delivery.title"),
              description: translate("approach.steps.delivery.description"),
            },
          ].map((step, index) => (
            <ApproachStep key={step.title} {...step} index={index} fadeIn={fadeIn} />
          ))}
        </div>
      </div>
    </section>
  )
}

const ApproachStep = ({ icon: Icon, title, description, index, fadeIn }) => (
  <motion.div
    className="flex flex-col items-center text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
    initial="initial"
    whileInView="animate"
    viewport={{ once: true }}
    variants={fadeIn}
    transition={{ delay: index * 0.2 }}
  >
    <div className="rounded-full bg-white/10 p-3 mb-4">
      <Icon className="w-6 h-6 text-violet-400" />
    </div>
    <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>
)

const PostMVPOfferSection = ({ fadeIn }) => {
  const { translate } = useContext(LanguageContext)

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container px-4 md:px-6">
        <motion.div
          className="text-center mb-12"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{translate("postMVP.title")}</h2>
          <p className="mt-4 text-gray-500 md:text-xl">{translate("postMVP.subtitle")}</p>
        </motion.div>
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
          <OfferFeature
            icon={Clock}
            title={translate("postMVP.features.hours.title")}
            description={translate("postMVP.features.hours.description")}
            fadeIn={fadeIn}
          />
          <OfferFeature
            icon={UserCheck}
            title={translate("postMVP.features.developer.title")}
            description={translate("postMVP.features.developer.description")}
            fadeIn={fadeIn}
          />
          <OfferFeature
            icon={CreditCard}
            title={translate("postMVP.features.payment.title")}
            description={translate("postMVP.features.payment.description")}
            fadeIn={fadeIn}
          />
        </div>
      </div>
    </section>
  )
}

const OfferFeature = ({ icon: Icon, title, description, fadeIn }) => (
  <motion.div
    className="flex flex-col items-center text-center"
    initial="initial"
    whileInView="animate"
    viewport={{ once: true }}
    variants={fadeIn}
  >
    <div className="rounded-full bg-violet-100 p-3 mb-4">
      <Icon className="w-6 h-6 text-violet-500" />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
)

const WhyChooseUsSection = ({ fadeIn }) => {
  const { translate } = useContext(LanguageContext)

  return (
    <section className="w-full py-12 md:py-24 lg:py-32bg-white">
      <div className="container px-4 md:px-6">
        <motion.div
          className="text-center mb-12"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{translate("why.title")}</h2>
          <p className="mt-4 text-gray-500 md:text-xl">{translate("why.subtitle")}</p>
        </motion.div>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          {Object.entries(translate("why.features")).map(([key, feature], index) => (
            <FeatureItem
              key={key}
              title={feature.title}
              description={feature.description}
              index={index}
              fadeIn={fadeIn}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

const FeatureItem = ({ title, description, index, fadeIn }) => (
  <motion.div
    className="flex items-start space-x-4 p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
    initial="initial"
    whileInView="animate"
    viewport={{ once: true }}
    variants={fadeIn}
    transition={{ delay: index * 0.1 }}
  >
    <CheckCircle className="w-6 h-6 text-violet-500 flex-shrink-0" />
    <div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </motion.div>
)

const ContactSection = ({ fadeIn }) => {
  const { translate } = useContext(LanguageContext)

  return (
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src={HeroImage2 || "/placeholder.svg"} alt="Background" className="w-full h-full object-cover" />
      </div>
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          className="flex flex-col items-center space-y-4 text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
              {translate("contact.title")}
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">{translate("contact.subtitle")}</p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <form className="grid gap-4">
              <Input
                placeholder={translate("contact.form.name")}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Input
                type="email"
                placeholder={translate("contact.form.email")}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Textarea
                placeholder={translate("contact.form.idea")}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="px-6 py-3 text-lg font-medium bg-white text-black rounded-md hover:bg-gray-100"
              >
                {translate("contact.form.submit")}
              </button>
            </form>
            <p className="text-xs text-gray-400">
              {translate("contact.form.terms")}{" "}
              <a href="#" className="underline">
                {translate("contact.form.termsLink")}
              </a>{" "}
              {translate("contact.form.and")}{" "}
              <a href="#" className="underline">
                {translate("contact.form.privacyLink")}
              </a>
              .
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const VisibilityCTA = ({ fadeIn }) => {
  const { translate } = useContext(LanguageContext)

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-violet-600 to-indigo-600">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center space-y-4 text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
            Transform Your Brand in 24 Hours
          </h2>
          <p className="mx-auto max-w-[700px] text-xl text-violet-100 md:text-2xl">
            Get a complete professional brand identity package, website, and marketing essentials - all delivered in just one day.
          </p>
          <Link
            to="/visibility"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-violet-600 bg-white rounded-full hover:bg-violet-50 transition-colors duration-300"
          >
            Explore Visibility Bundle
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

const ImpressumSection = () => {
  const { translate } = useContext(LanguageContext)

  return (
    <section className="w-full py-12 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold mb-8">{translate("impressum.title")}</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">{translate("impressum.companyInfo.title")}</h3>
            <p>{translate("impressum.companyInfo.name")}</p>
            <p>{translate("impressum.companyInfo.street")}</p>
            <p>{translate("impressum.companyInfo.city")}</p>
            <p>{translate("impressum.companyInfo.country")}</p>
            <p>Email: {translate("impressum.companyInfo.email")}</p>
            <p>Tel: {translate("impressum.companyInfo.phone")}</p>
            <p>
              {translate("impressum.companyInfo.managing")}: {translate("impressum.companyInfo.managingName")}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">{translate("impressum.registration.title")}</h3>
            <p>{translate("impressum.registration.court")}</p>
            <p>{translate("impressum.registration.number")}</p>
            <p>{translate("impressum.registration.vatId")}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">{translate("impressum.responsibility.title")}</h3>
            <p>{translate("impressum.responsibility.name")}</p>
            <p>{translate("impressum.responsibility.address")}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

const Footer = () => {
  const { translate } = useContext(LanguageContext)
  const [showImpressum, setShowImpressum] = useState(false)

  return (
    <>
      <footer className="w-full py-6 bg-white border-t border-gray-200">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
              <Rocket className="h-6 w-6 text-violet-500" />
              <p className="text-center text-sm leading-loose text-gray-600 md:text-left">
                {translate("footer.copyright")}
              </p>
            </div>
            <nav className="flex gap-4 sm:gap-6">
              <button
                className="text-sm font-medium hover:underline underline-offset-4 text-gray-500"
                onClick={() => setShowImpressum(true)}
              >
                {translate("nav.impressum")}
              </button>
              <a className="text-sm font-medium hover:underline underline-offset-4 text-gray-500" href="#">
                {translate("footer.terms")}
              </a>
              <a className="text-sm font-medium hover:underline underline-offset-4 text-gray-500" href="#">
                {translate("footer.privacy")}
              </a>
            </nav>
          </div>
        </div>
      </footer>

      {/* Impressum Modal */}
      {showImpressum && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImpressum(false)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <div className="p-6 relative">
              <button
                onClick={() => setShowImpressum(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
              <ImpressumSection />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function App() {
  // Initialize language from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("language")
    return saved || "de"
  })

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  // Translation helper function
  const translate = (key) => {
    const keys = key.split(".")
    let value = translations[language]
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-1">
          <HeroSection fadeIn={fadeIn} />
          <ServicesSection fadeIn={fadeIn} />
          <ApproachSection fadeIn={fadeIn} />
          <WhyChooseUsSection fadeIn={fadeIn} />
          <PostMVPOfferSection fadeIn={fadeIn} />
          <ContactSection fadeIn={fadeIn} />
          <VisibilityCTA fadeIn={fadeIn} />
        </main>
        <Footer />
      </div>
    </LanguageContext.Provider>
  )
}

export default App

