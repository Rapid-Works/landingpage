import React, { useState, useEffect, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Plus, Minus, ChevronLeft, ChevronRight, CheckCircle, ChevronDown, Menu, X, CalendarCheck, Palette, Package } from "lucide-react"
import HeroImage2 from "../images/heroimage3.jpg"
import RapidWorksWebsite from "../images/laptop.png"
import RapidWorksLogo from "../images/logo512.png"
import QRCodeLogo from "../images/qrcode.png"
import PlaceholderImage from "../images/more.png"
import RapidWorksHoodie from "../images/hoodie.png"
import RapidWorksBanner from "../images/banner.png"
import RapidWorksEmailSignature from "../images/rapidworksemailsignature.png"
import BusinessCard from "../images/card.png"
import PhoneMockLogo from "../images/phonelap.png"
import RollupBanner from "../images/rollup.png"
import PitchDeck from "../images/pitchdeck.jpg"
import GuidelineBrand from "../images/guidelinebrand.jpg"
import Calendar from "../images/calendar.png"
import RLogo from "../images/rlogo.jpg"
import VisibilityHero from "../images/background.png"
import { Link, useNavigate } from "react-router-dom"
import BundleForm from "./BundleForm"
import { LanguageContext as AppLanguageContext } from "../App"
import Modal from './Modal'
import NewsletterPopup from "./NewsletterPopup"
import FAQModal, { FAQItem } from './FAQModal'

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
          className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === index
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
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-light">Subscribe to Our Newsletter</h3>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
            onFocus={() => setIsPopupOpen(true)} // Open popup on focus
            readOnly // Make it read-only since we're using the popup
          />
          <button
            onClick={() => setIsPopupOpen(true)}
            className="px-4 py-2 bg-violet-600 text-white rounded-md text-sm hover:bg-violet-700 transition-colors"
          >
            Subscribe
          </button>
        </div>
      </div>

      {/* Controlled Newsletter Popup */}
      {isPopupOpen && (
        <NewsletterPopup 
          isOpen={isPopupOpen} 
          onClose={() => setIsPopupOpen(false)} 
        />
      )}
    </>
  )
}

const VisibiltyBundle = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const navigate = useNavigate();
  const context = useContext(AppLanguageContext)
  const [currentLanguage, setCurrentLanguage] = useState(context?.language || 'de')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false)
  const formUrl = "https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAMAANEznbRUMkVHMFpWTTVaTjREWlc4Wk5WOEdNOFhMTi4u"

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
    setIsModalOpen(true)
  }

  // Update the pageContent object with more translations
  const pageContent = {
    en: {
      title: "VISIBILITY BUNDLE",
      subtitle: "Transform Your Brand Visibility",
      mainText: "Convince us of your startup idea and get your free Visibility Bundle within one week free of charge, including:",
      keyPoints: [
        "Market Orientation Consulting",
        "Logo & Brand Design",
        "Startup Website",
        "Startup Apparel",
        "Business Cards",
        "Rollup"
      ],
      subtext: "No hidden costs, no bullshit.",
      cta: "Apply for your bundle",
      seeMore: "and more...",
      bundleLabel: "Visibility Bundle",
      nav: {
        mvpDev: "MVP Development",
        visibilityBundle: "Visibility Bundle",
        bookCall: "Book a Call"
      },
      // Bundle items
      bundleItems: {
        website: {
          title: "Your Startup Website",
          description: "An elegant, responsive website with a clear call to action for your target group. We coach you on what components a startup website needs to generate leads and attract customers and create it for you."
        },
        qrCode: {
          title: "QR code and Calendar link integration",
          description: "We link the online and offline world for you. In our intuitive form, you can specify a calendar link for each founder and where it should appear (email signature, business card, website). You can also specify where we should insert the QR code to your website (business card, rollup)"
        },
        socialMedia: {
          title: "Social Media Banner",
          description: "A meaningful social media banner through which founders and employees can show their affiliation to the startup. The purpose of the banner is to communicate your mission at a glance."
        },
        stationery: {
          title: "Business Card print file & Email signature",
          description: "Your business card doesn't have to win a design competition, instead it has to create a recognizable value for you and your startup. That's why we add your profile picture, the QR code of your landing page and a graphic background that matches your startup's activity as standard."
        },
        wallpapers: {
          title: "Digital Wallpapers",
          description: "A discreet wallpaper in your startup's brand design for smartphones and laptops. In our intuitive form, every founder can specify which smartphone they use."
        },
        rollup: {
          title: "Rollup template print file",
          description: "A roll-up in your brand design. Rollups don't have to appeal to everyone and don't have to make your startup look bigger than it is. But your target group needs to understand what problem you solve for them just by looking at it. We help you find the most important message for your rollup and integrate the QR code of your website on it."
        },
        apparel: {
          title: "Hoodie print file",
          description: "Without a hoodie you wouldn't be a startup. You would just be self employed. Luckily we got your cofounders and you covered with a hoodie print file."
        }
      },
      // FAQ section
      faq: {
        title: "Frequently Asked Questions",
        showAll: "Show all questions and answers",
        items: [
          {
            question: "What is a Visibility Bundle worth?",
            answer: "Only you can determine its true value to your business. At agencies, the combined cost of all Visibility Bundle components would typically range between €10,000 and €15,000, involving several weeks of waiting time and countless additional hours of coordination on your part. We drastically reduce costs by using a combination of automation and smart processes."
          },
          {
            question: "Why is a Visibility Bundle so important for startups?",
            answer: "Our honest opinion? It's not. Startup founders have more important things to do than worry about design. We believe the founding team's most important task is to focus on their market and product. However, from both our own founding experience and consulting over 50 startups, we've recognized that developing brand visibility consumes a disproportionate amount of resources in terms of time and money, and contains too many pitfalls for inexperienced founders. While not as complex as the problems startups solve, the connection and coordination of visibility elements is detailed and meticulous. We handle these details for you, aiming to deliver your complete Visibility Bundle within days, making you operational for the next year."
          },
          {
            question: "Why should I have RapidWorks create my Visibility Bundle?",
            answer: "Our team combines startup founding experience with design and development expertise. We know exactly what a startup needs to reach and convince customers. We're also cost and time-efficient in creating Visibility Bundles, having semi-automated the creation of several bundle components."
          },
          {
            question: "In what form do I receive the Visibility Bundle contents?",
            answer: "Upon completion, you'll receive an email with access to cloud storage containing all components of your Visibility Bundle in digital form. Each file is saved in an appropriate format and clearly named. You'll also receive each file in an editable format. Our goal is to make you self-sufficient rather than creating dependency on us or other service providers. We don't provide physical materials, but you can use our files to have them produced at any print shop."
          },
          {
            question: "Why is RapidWorks giving away 3 Visibility Bundles?",
            answer: "As a startup ourselves, we value speed and happy customers over profit. Through free distribution, we're turning the tables and carefully selecting our first customers. We validate our own assumptions about workload, coordination effort, customer value, and more through initial test customers."
          },
          {
            question: "What happens if my startup isn't among the top 3?",
            answer: "Everyone wins with us. Even if you don't win during our application phase, you'll receive an unbeatable offer within a few days."
          },
          {
            question: "Does RapidWorks offer other services?",
            answer: "Yes, the Visibility Bundle is our market entry, but our mission goes much further. We offer personal coaching with Yannick, MVP development, software development services at unbeatable prices, and free financing consultation. See <a href='https://rapidworks.vercel.app/' target='_blank' rel='noopener noreferrer' class='text-violet-600 hover:text-violet-700 underline'>RapidWorks</a> for more information."
          },
          {
            question: "What's the quality level of the Visibility Bundle?",
            answer: "Comparable to the RapidWorks Visibility Bundle you see showcased on this website. Your bundle will be created by Yannick and Samuel, exactly like the RapidWorks Visibility Bundle. We're transparent that you shouldn't expect Apple-level design from us, but we're convinced that few startups need that level of design quality in the early stage."
          },
          {
            question: "What if I have special requests for my Visibility Bundle?",
            answer: "You can note special requests in our form. We'll review them and inform you whether we can implement them within the offer or arrange an alternative solution."
          },
          {
            question: "Do I give up rights to my Visibility Bundle or startup idea?",
            answer: "You retain all rights to your idea and Visibility Bundle. We don't share any data with third parties. However, if your startup targets other startups with design, coaching, or development services, there might be a conflict of interest."
          },
          {
            question: "Who is the Startup Visibility Bundle offer for?",
            answer: "In short - startups. See <a href='https://de.wikipedia.org/wiki/Start-up-Unternehmen' target='_blank' rel='noopener noreferrer' class='text-violet-600 hover:text-violet-700 underline'>Start-up-Unternehmen – Wikipedia</a>. If you're not sure whether you're a startup but need the Visibility Bundle, feel free to fill out our form."
          },
          {
            question: "Do I need to have already founded my startup to receive a Visibility Bundle?",
            answer: "No, you can fill out our application form even if you haven't founded your company yet."
          },
          {
            question: "What if I already have some contents of the Visibility Bundle?",
            answer: "No problem. In our form, you can upload any files you already have and tell us how to incorporate them into your Visibility Bundle."
          },
          {
            question: "When will I receive my Visibility Bundle?",
            answer: "Since we've semi-automated the creation of several bundle components and are an experienced team in creating Visibility Bundles, we complete at least one bundle per week. We process orders on a <a href='https://de.wikipedia.org/wiki/First_In_%E2%80%93_First_Out' target='_blank' rel='noopener noreferrer' class='text-violet-600 hover:text-violet-700 underline'>First In – First Out – Wikipedia</a> basis and intentionally keep our pipeline small. Your bundle will be completed promptly and quickly - significantly faster than you could likely create or outsource it yourself."
          },
          {
            question: "How much does it cost to print all the media?",
            answer: "Depending on the provider, around €100 per rollup, €30 per hoodie, €20 for 500 business cards. We will soon recommend providers with whom we have had good experiences."
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
            title: "Submit Your Brand Info",
            description: "Share your brand vision, colors preferences and potentially existing graphics to include through our simple form."
          },
          {
            title: "We Create Your Assets",
            description: "We craft your complete visibility bundle and present it to you once finished. If you are not satisfied with the bundle you don't have to pay."
          },
          {
            title: "Review & Refine",
            description: "We are also happy to help you if you notice any small adjustment requests afterwards. A minor feedback iteration after a few days is already included in the offer."
          }
        ]
      },
      // Features section
      features: {
        title: "Contents",
        subtitle: "The Visibility Bundle contains everything you need to draw the attention of customers, partners, investors and employees to your startup. You immediately become visible and a uniform brand design makes your brand recognizable."
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
      title: "SICHTBARKEITSPAKET",
      subtitle: "Transformieren Sie Ihre Markensichtbarkeit",
      mainText: "Überzeugen Sie uns von Ihrer Startup-Idee und erhalten Sie Ihr kostenloses Visibility Bundle innerhalb einer Woche,",
      keyPoints: [
        "Marktorientierungsberatung",
        "Logo & Brand Design",
        "Startup Website",
        "Startup Bekleidung",
        "Visitenkarten",
        "Rollup"
      ],
      subtext: "Keine versteckten Kosten, kein Bullshit.",
      cta: "Bewerben Sie sich für Ihr Bundle",
      seeMore: "und mehr...",
      bundleLabel: "Sichtbarkeits-Paket",
      nav: {
        mvpDev: "MVP-Entwicklung",
        visibilityBundle: "Sichtbarkeitspaket",
        bookCall: "Gespräch Buchen"
      },
      // Bundle items
      bundleItems: {
        website: {
          title: "Ihre Startup-Website",
          description: "Eine elegante, responsive Website mit klarem Call-to-Action für Ihre Zielgruppe. Wir beraten Sie, welche Komponenten eine Startup-Website benötigt, um Leads zu generieren und Kunden zu gewinnen, und erstellen diese für Sie."
        },
        qrCode: {
          title: "QR-Code und Kalender-Link Integration",
          description: "Wir verbinden die Online- und Offline-Welt für Sie. In unserem intuitiven Formular können Sie einen Kalender-Link für jeden Gründer angeben und wo dieser erscheinen soll (E-Mail-Signatur, Visitenkarte, Website). Sie können auch festlegen, wo wir den QR-Code zu Ihrer Website einfügen sollen (Visitenkarte, Rollup)."
        },
        socialMedia: {
          title: "Social-Media Banner",
          description: "Ein aussagekräftiges Social-Media-Banner, durch das Gründer und Mitarbeiter ihre Zugehörigkeit zum Startup zeigen können. Der Zweck des Banners ist es, Ihre Mission auf einen Blick zu kommunizieren."
        },
        stationery: {
          title: "Visitenkarten-Druckdatei & E-Mail-Signatur",
          description: "Ihre Visitenkarte muss keinen Design-Wettbewerb gewinnen, sondern einen erkennbaren Wert für Sie und Ihr Startup schaffen. Deshalb fügen wir standardmäßig Ihr Profilbild, den QR-Code Ihrer Landing Page und einen zu Ihrer Startup-Aktivität passenden grafischen Hintergrund hinzu."
        },
        wallpapers: {
          title: "Digitale Wallpaper",
          description: "Ein dezentes Wallpaper im Brand Design Ihres Startups für Smartphones und Laptops. In unserem intuitiven Formular kann jeder Gründer angeben, welches Smartphone er verwendet."
        },
        rollup: {
          title: "Rollup-Template Druckdatei",
          description: "Ein Roll-up in Ihrem Brand Design. Roll-ups müssen nicht jedem gefallen und Ihr Startup nicht größer erscheinen lassen als es ist. Aber Ihre Zielgruppe muss auf einen Blick verstehen, welches Problem Sie für sie lösen. Wir helfen Ihnen, die wichtigste Botschaft für Ihr Roll-up zu finden und integrieren den QR-Code Ihrer Website."
        },
        apparel: {
          title: "Hoodie-Druckdatei",
          description: "Ohne Hoodie wären Sie kein Startup. Sie wären einfach nur selbstständig. Zum Glück haben wir Sie und Ihre Mitgründer mit einer Hoodie-Druckdatei abgedeckt."
        }
      },
      // FAQ section
      faq: {
        title: "Häufig gestellte Fragen",
        showAll: "Alle Fragen und Antworten anzeigen",
        items: [
          {
            question: "Was ist ein Visibility Bundle Wert?",
            answer: "Was es Wert ist, kannst nur du selbst bestimmen, was alle Inhalte des Visibility Bundles zusammengerechnet bei Agenturen kosten würden, liegt etwa zwischen 10.000€ und 15.000€ und wäre mit mehreren Wochen an Wartezeit und unzähligen zusätzlichen Stunden an Koordinationsaufwand von deiner Seite verbunden. Wir reduzieren die Kosten drastisch, indem wir auf eine Kombination aus Automation und smarten Prozessen setzen."
          },
          {
            question: "Warum ist ein Visibility Bundle so wichtig für Startups?",
            answer: "Unsere ehrliche Meinung? Ist es nicht. Startup Gründer haben wichtigeres zu tun, als sich mit Design zu beschäftigen. Wir sind davon überzeugt, dass es die wichtigste Aufgabe des Gründerteams ist, sich mit ihrem Markt und ihrem Produkt zu beschäftigen. Wir haben jedoch sowohl aus eigener Gründungserfahrung als auch aus der Beratung von über 50 Startups erkannt, dass die Entwicklung der Markenvisibilität eine überdimensionierte Menge der Ressourcen eines jungen Startups in Form von Zeit und Geld verschlingt und zu viele Fallstricke für unerfahrene Gründer beinhaltet. Die Verbindung und Abstimmung der einzelnen Elemente des Visibility Bundles eines Startups ist im Vergleich zu den Problemen, die ein Startup löst, nicht komplex. Aber sie ist kleinteilig und penibel. Genau diese kleinteiligen Schritte nehmen wir euch ab. Unser Ziel ist es, dass ihr in nur wenigen Tagen euer vollständiges Visibility Bundle in den Händen haltet und somit lauffähig für das nächste Jahr seid. Wir halten unser Visibility Bundle nicht für das finale Brand Design, dass ihr in 5 Jahren mit einer Million Kunden noch haben werdet, aber für den effizientesten Einstieg, der euch die Schaffensruhe gibt, um diese Skalierung erreichen zu können"
          },
          {
            question: "Warum sollte ich mein Visibility Bundle von RapidWorks erstellen lassen?",
            answer: "Wir vereinen in unserem Team Startup-Gründungserfahrung, Design- und Development-Erfahrung. Wir wissen exakt, was ein Startup benötigt, um Kunden erreichen und überzeugen zu können. Zudem sind wir Kosten- und Zeiteffektiv in der Erstellung von Visibility Bundles, da wir bereits die Erstellung einiger Inhalte des Bundles semi-automatisiert haben."
          },
          {
            question: "In welcher Form erhalte ich die Inhalte des Visibility Bundles?",
            answer: "Nach Fertigstellung erhältst du von uns eine E-Mail mit Zugriffslink zu einem Cloud-Storage, welcher sämtliche Bestandteile deines Visibility Bundles in digitaler Form enthält. Jede Datei ist in geeignetem Dateiformat für die jeweilige Rolle abgespeichert und sprechend benannt. Du erhältst zudem jede Datei in einem bearbeitungsoffenen Format. Unser Ziel ist es, dich für die Zukunft handlungsfähig zu machen, anstatt dich in ein Abhängigkeitsverhältnis von uns oder anderen Dienstleistern herein zu zwingen. Du erhältst von uns explizit keine physischen Materialien, du kannst dir diese aber mit unseren Dateien bei jeder Druckerei direkt in beliebiger Stückzahl fertigen lassen."
          },
          {
            question: "Warum verschenkt Rapid Works 3 Visibility Bundles?",
            answer: "Weil wir selbst ein Startup sind und Geschwindigkeit und glückliche Kunden über Profit wertschätzen. Durch die kostenfreie Vergabe drehen wir den Spieß um und suchen uns gezielt unsere ersten Kunden aus. Anhand der ersten Testkunde validieren wir unsere eigenen Annahmen zu Arbeitsaufwand, Abstimmungsaufwand, geschaffenem Wert für den Kunden und vieles mehr. Im Anschluss werden wir Umfang und Preis unserer Leistung entsprechend den Erfahrungen der kostenfreien Phase anpassen und mit einem unschlagbaren Angebot an jeden herantreten, der sich bis dahin beworben hat. Du brauchst also keine Angst zu haben, auch wenn du nicht in unserer Bewerbungsphase gewinnen solltest, erwartet dich in wenigen Tagen ein unschlagbares Angebot."
          },
          {
            question: "Was geschieht, wenn mein Startup nicht unter den Top 3 landet?",
            answer: "Bei uns gewinnt jeder. Auch wenn du nicht in unserer Bewerbungsphase gewinnen solltest, erwartet dich in wenigen Tagen ein unschlagbares Angebot."
          },
          {
            question: "Bietet Rapid Works noch weitere Services an?",
            answer: "Ja, das Visibility Bundle ist unser Markteintritt, unsere Mission geht aber noch viel weiter. Unabhängig vom Visibility Bundle bieten wir Startups persönliches Coaching mit Yannick, MVP-Development und Software-Developmentleistungen zu unschlagbaren Preisen und kostenfreie Finanzierungsberatung an. Für weitere Infos siehe <a href='https://rapidworks.vercel.app/' target='_blank' rel='noopener noreferrer' class='text-violet-600 hover:text-violet-700 underline'>RapidWorks</a>."
          },
          {
            question: "Wie hoch ist die Qualität des Visibility Bundles?",
            answer: "Vergleichbar mit der Qualität des Rapid Works Visibility Bundles, welches du als Showcase auf dieser Webseite hier siehst. Dein Visibility Bundle wird in Zusammenarbeit von Yannick und Samuel erstellt, exakt so wie das Rapid Works Visibility Bundle. Wir gehen transparent damit um, dass du bei uns kein Design auf dem Level von Apple erwarten kannst. Wir sind allerdings davon überzeugt, dass auch nur kaum ein Startup dieses Level an Design-Qualität bereits in der Early-Stage braucht. Der Dreh und Angelpunkt des Services deines Startups dreht sich um Brand Design auf Weltklasse? Dann sind wir nicht der richtige Partner für dich. In jedem anderen Fall vermutlich schon"
          },
          {
            question: "Was ist, wenn ich Extrawünsche zu meinem Visibility Bundle habe?",
            answer: "In unserem Formular kannst du Extrawünsche gerne notieren, wir werden diese sichten und dich darüber informieren, ob wir diese im Rahmen des Angebots mit umsetzen, oder uns anderweitig arrangieren können."
          },
          {
            question: "Trete ich Rechte an meinem Visibility Bundle oder meiner Startup Idee ab?",
            answer: "Dein Startup richtig sich ebenfalls an andere Startups als Zielgruppe und bietet Design-, Coaching-, oder Development-Leistungen an? In diesen Fällen könnte ein Interessenskonflikt zwischen uns vorliegen. Tu uns beiden einen Gefallen und schreib uns nicht deine Billion Dollar Startup Idee für explizit diese Zielgruppe und Leistungen in unser Formular. Wir haben selbst eine Menge weitere innovative Lösungen in diesem Bereich geplant und werden uns mit niemandem die Lorbeeren dafür teilen, weil jemand meint, dass wir seine Idee geklaut hätten. Insofern deine Idee nicht explizit in diesem Bereich liegt, kannst du sie uns bedenkenlos mitteilen. Du behältst ausdrücklich sämtliche Rechte an deiner Idee und deinem Visibility Bundle. Wir geben keinerlei Daten an Dritte weiter. Unabhängig davon fragen wir dich nicht ab, wie deine Idee unter der Haube funktioniert. Alle Daten, die du uns gibst, sind Daten, die du scheinbar sowieso öffentlich sichtbar machen möchtest."
          },
          {
            question: "An wen richtet sich das Startup Visibility Bundle Angebot?",
            answer: "Kurzum - An Startups. Siehe <a href='https://de.wikipedia.org/wiki/Start-up-Unternehmen' target='_blank' rel='noopener noreferrer' class='text-violet-600 hover:text-violet-700 underline'>Start-up-Unternehmen – Wikipedia</a>. Du bist kein Startup, oder bist dir nicht sicher, ob du eins bist, aber das Visibility Bundle ist genau das was du brauchst? Dann füll gerne unser Formular aus, wir melden uns bei dir."
          },
          {
            question: "Muss ich mein Startup bereits gegründet haben, um ein Visibility Bundle erhalten zu können?",
            answer: "Nein, du kannst unser Bewerbungsformular auch ausfüllen, wenn du noch nicht gegründet hast."
          },
          {
            question: "Was ist, wenn ich bereits einige Inhalte des Visibility Bundles habe?",
            answer: "Das ist kein Problem, in unserem Formular kannst du uns beliebige Dateien Hochladen, die du bereits hast und uns dazu schreiben, welche davon wir in welcher Form beim Erstellen des Visibility Bundels aufgreifen sollen."
          },
          {
            question: "Wann bekomme ich mein Visibility Bundle?",
            answer: "Da wir die Erstellung mehrerer Inhalte des Visibility Bundles bereits zu einem gewissen Grad semi-automatisiert haben, ein eingespieltes Team in der Erstellung von Visibility Bundles sind und eine Menge Erfahrung in der Betreuung von Startups haben, erstellen wir mindestens ein Visibility Bundle pro Woche. Wir arbeiten die Aufträge nach <a href='https://de.wikipedia.org/wiki/First_In_%E2%80%93_First_Out' target='_blank' rel='noopener noreferrer' class='text-violet-600 hover:text-violet-700 underline'>First In – First Out – Wikipedia</a> ab und halten die Anzahl von Aufträgen in unserer Pipeline beabsichtigt sehr klein. Dein Visibility Bundle wird also in jedem Fall sehr zeitnah und schnell abgearbeitet. Deutlich schneller, als du es vermutlich selbst anfertigen oder outsourcen könntest."
          },
          {
            question: "Wie viel kostet es, alle Printmedien drucken zu lassen?",
            answer: "Je nach Anbieter um die 100€ pro Rollup, 30€ pro Hoodie, 20€ für 500 Visitenkarten. Wir werden in Kürze auch Anbieter empfehlen mit denen wir gute Erfahrungen gemacht haben."
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
            title: "Teilen Sie Ihre Markeninfo",
            description: "Teilen Sie uns Ihre Markenvision, Farbpräferenzen und eventuell vorhandene Grafiken über unser einfaches Formular mit."
          },
          {
            title: "Wir erstellen Ihre Assets",
            description: "Wir erstellen Ihr komplettes Visibility Bundle und präsentieren es Ihnen nach Fertigstellung. Wenn Sie mit dem Bundle nicht zufrieden sind, müssen Sie nicht zahlen."
          },
          {
            title: "Prüfen & Verfeinern",
            description: "Wir helfen Ihnen auch gerne, wenn Sie nachträglich kleine Anpassungswünsche bemerken. Eine kleine Feedback-Iteration nach einigen Tagen ist bereits im Angebot enthalten."
          }
        ]
      },
      // Features section
      features: {
        title: "Inhalt",
        subtitle: "Das Visibility Bundle enthält alles, was Sie brauchen, um die Aufmerksamkeit von Kunden, Partnern, Investoren und Mitarbeitern auf Ihr Startup zu lenken. Sie werden sofort sichtbar und ein einheitliches Markendesign macht Ihre Marke erkennbar."
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
    }
  ]

  const faqItems = content.faq.items;

  const scrollToFeatures = (e) => {
    e.preventDefault()
    const featuresSection = document.getElementById('features')
    featuresSection.scrollIntoView({ behavior: 'smooth' })
  }

  // Update the container class definition
  const containerClass = "max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative"

  return (
    <>
    <div className="min-h-screen bg-white">
        {/* Updated Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left: Logo & Name */}
              <Link 
                to="/" 
                onClick={() => window.scrollTo(0, 0)} 
                className="flex items-center space-x-2"
              >
                <img src={RapidWorksLogo} alt="RapidWorks" className="h-8 w-8" />
                <span className="font-medium text-gray-900">RapidWorks</span>
              </Link>

              {/* Middle: Navigation - Hidden on mobile */}
              <div className="hidden md:flex items-center space-x-1">
                <Link
                  to="/"
                  className="px-4 py-2 rounded-full text-sm font-light text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {content.nav.mvpDev}
                </Link>
                <Link
                  to="/visibility"
                  className="px-4 py-2 rounded-full text-sm font-light bg-violet-50 text-violet-600"
                >
                  {content.nav.visibilityBundle}
              </Link>
            </div>

              {/* Right: CTA & Language - Hidden on mobile */}
              <div className="hidden md:flex items-center space-x-4">
              <button 
                  onClick={() => window.open('https://calendly.com/yannick-familie-heeren/30min', '_blank')}
                  className="px-4 py-2 text-sm font-light text-white rounded-full bg-gradient-to-r from-violet-600 to-violet-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  {content.nav.bookCall}
                </button>
                <div className="flex items-center space-x-1 text-sm">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`px-2 py-1 rounded-l transition-colors ${
                      currentLanguage === 'en' 
                        ? 'text-violet-600 font-medium'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    EN
                  </button>
                  <span className="text-gray-300">/</span>
                  <button
                    onClick={() => handleLanguageChange('de')}
                    className={`px-2 py-1 rounded-r transition-colors ${
                      currentLanguage === 'de' 
                        ? 'text-violet-600 font-medium'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                      DE
              </button>
            </div>
          </div>

              {/* Mobile menu button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-gray-600" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-600" />
                )}
              </button>
        </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white border-t border-gray-100"
              >
                <div className="px-4 py-4 space-y-4">
                  <Link
                    to="/"
                    onClick={() => {
                      window.scrollTo(0, 0)
                      setIsMenuOpen(false)
                    }}
                    className="block px-4 py-2 rounded-lg text-sm font-light text-gray-600"
                  >
                    {content.nav.mvpDev}
                  </Link>
                  <Link
                    to="/visibility"
                    onClick={() => {
                      window.scrollTo(0, 0)
                      setIsMenuOpen(false)
                    }}
                    className="block px-4 py-2 rounded-lg text-sm font-light bg-violet-50 text-violet-600"
                  >
                    {content.nav.visibilityBundle}
                  </Link>
                  <button
                    onClick={() => window.open('https://calendly.com/yannick-familie-heeren/30min', '_blank')}
                    className="w-full px-4 py-2 text-sm font-light text-white rounded-lg bg-gradient-to-r from-violet-600 to-violet-500"
                  >
                    {content.nav.bookCall}
                  </button>
                  <div className="flex justify-center items-center space-x-1 text-sm border-t border-gray-100 pt-4">
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={`px-4 py-2 rounded transition-colors ${
                        currentLanguage === 'en' 
                          ? 'text-violet-600 font-medium'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      EN
                    </button>
                    <span className="text-gray-300">/</span>
                    <button
                      onClick={() => handleLanguageChange('de')}
                      className={`px-4 py-2 rounded transition-colors ${
                        currentLanguage === 'de' 
                          ? 'text-violet-600 font-medium'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      DE
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

      <main className="relative w-full overflow-x-hidden">
        <div className={containerClass}>
            <div className="relative min-h-screen flex flex-col md:items-center">
              {/* Desktop Background Image - Unchanged */}
              <div className="absolute inset-0 translate-y-16 mr-0 md:mr-4 lg:mr-8 xl:mr-16 hidden md:block">
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full w-full object-cover object-center transition-transform duration-700"
                src={VisibilityHero}
                alt="Hero background"
              />
            </div>

              {/* Mobile Layout - Flex column for vertical stacking */}
              <div className="flex flex-col md:hidden">
                {/* Mobile Image First - Adjusted scaling and padding */}
                <div className="w-full h-[70vh] pt-16">
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full w-full object-contain scale-100 transform transition-transform duration-700 px-4 sm:px-8"
                    src={PlaceholderImage}
                    alt="Hero background"
                  />
            </div>

                {/* Mobile Text Content Below */}
                <div className="w-full bg-white px-6 py-8">
                  <div className="max-w-[480px] mx-auto space-y-4 text-center">
                      <motion.div className="animate-float pt-16 md:pt-0">
                        <span className="inline-block text-violet-600 text-xs md:text-sm uppercase tracking-wider font-light
                          px-2 py-0.5 md:px-4 md:py-1 rounded-full bg-violet-50 border border-violet-100 backdrop-blur-sm shadow-sm"
                        >
                          {content.title}
                        </span>
                      </motion.div>

                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-2xl md:text-5xl lg:text-6xl font-bold text-gray-900 md:text-black leading-[1.1] tracking-tight"
                      >
                        {content.subtitle}
                      </motion.h1>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-sm md:text-lg font-light leading-relaxed"
                      >
                        {content.mainText}
                      </motion.p>

                      {/* New key points list - horizontal pills */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-wrap gap-2 py-2"
                      >
                        {content.keyPoints.map((point, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full 
                              bg-violet-50 border border-violet-100 text-violet-800
                              text-sm font-light whitespace-nowrap"
                          >
                            {point}
                          </span>
                        ))}
                      </motion.div>

                      {/* "and more..." link - adjusted spacing */}
                      <motion.a
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        href="#features"
                        onClick={scrollToFeatures}
                        className="inline-block text-violet-600 hover:text-violet-700 text-sm mt-2"
                      >
                        {content.seeMore}
                      </motion.a>

                      {/* Apply button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="pt-4"
                      >
                        {/* <CurvedArrow /> */}
                        <button
                          onClick={() => setIsModalOpen(true)}
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
                        <div className="space-y-2 md:space-y-4 text-center md:text-left px-6 py-3 md:p-0">
                          <motion.div className="animate-float pt-16 md:pt-0">
                            <span className="inline-block text-violet-600 text-xs md:text-sm uppercase tracking-wider font-light
                            px-2 py-0.5 md:px-4 md:py-1 rounded-full bg-violet-50 border border-violet-100 backdrop-blur-sm shadow-sm"
                            >
                              {content.title}
                        </span>
                      </motion.div>

                      <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-2xl md:text-5xl lg:text-6xl font-bold text-gray-900 md:text-black leading-[1.1] tracking-tight"
                      >
                            {content.subtitle}
                      </motion.h1>

                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-sm md:text-lg font-light leading-relaxed"
                      >
                            {content.mainText}
                      </motion.p>

                          {/* New key points list - horizontal pills */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-wrap gap-2 py-2"
                          >
                            {content.keyPoints.map((point, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full 
                                  bg-violet-50 border border-violet-100 text-violet-800
                                  text-sm font-light whitespace-nowrap"
                              >
                                {point}
                          </span>
                            ))}
                          </motion.div>

                          {/* "and more..." link - adjusted spacing */}
                          <motion.a
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                          href="#features" 
                            onClick={scrollToFeatures}
                            className="inline-block text-violet-600 hover:text-violet-700 text-sm mt-2"
                          >
                            {content.seeMore}
                          </motion.a>

                          {/* Apply button */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="pt-4"
                          >
                            {/* <CurvedArrow /> */}
                        <button 
                              onClick={() => setIsModalOpen(true)}
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

              {/* Down Arrow */}
            
          </div>
        </div>

          {/* Features Section (Everything You Need) */}
          <section id="features" className="py-40 overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white relative">
            <div className={containerClass}>
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
              <div className="space-y-24 relative">
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
                    <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 md:gap-32`}>
                      {/* Image Side */}
                      <div className="w-full md:w-1/2">
                        <div className="relative aspect-[4/3] overflow-hidden group rounded-3xl">
                          <div className="h-full transform-gpu">
                            <img
                              src={item.imageSrc || PlaceholderImage}
                              alt={item.title}
                              className="w-full h-full object-contain mix-blend-multiply filter contrast-125"
                            />
                            {/* Keep gradient effects but remove hover transitions */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50/30" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-violet-50/10 to-transparent" />
                            <div className="absolute inset-0 border border-gray-200/20 rounded-3xl shadow-[0_8px_32px_-4px_rgba(0,0,0,0.1)]" />
                          </div>
                        </div>
                      </div>

                      {/* Content Side */}
                      <div className="w-full md:w-1/2">
                        <div className="relative pl-16 md:pl-0">
                          {/* Enhanced Item Number */}
                          <span className="absolute -left-4 md:-left-12 top-1 text-8xl md:text-[10rem] font-extralight text-violet-200/10 select-none">
                            {(index + 1).toString().padStart(2, '0')}
                          </span>

                          <div className="space-y-8">
                            <div className="space-y-6">
                              <h3 className="text-3xl md:text-5xl font-light tracking-tight bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent leading-relaxed pb-1">
                                {item.title}
                              </h3>
                              <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
                                {item.description}
                              </p>
                            </div>

                            {/* Enhanced Decorative Elements */}
                            <div className="relative">
                              <div className="w-32 h-[2px] bg-gradient-to-r from-gray-900 to-gray-700 rounded-full opacity-40" />
                              <div className="absolute top-0 left-0 w-16 h-[2px] bg-gradient-to-r from-gray-800 to-transparent rounded-full animate-pulse" />
                              <div className="absolute top-2 left-0 w-24 h-[1px] bg-gradient-to-r from-gray-700 to-transparent rounded-full opacity-20" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
              ))}
            </div>
          </div>
        </section>

          {/* FAQ Section */}
          <section className="py-24 bg-gray-50">
          <div className={containerClass}>
              <div className="text-center mb-16">
                <h2 className="text-3xl font-light mb-4">
                  {content.faq.title}
            </h2>
              </div>
              
              <div className="max-w-3xl mx-auto divide-y divide-gray-200">
                {/* Show only first 5 FAQs */}
                {content.faq.items.slice(0, 5).map((item, index) => (
                  <FAQItem
                    key={index}
                    question={item.question}
                    answer={item.answer}
                  />
                ))}
                
                {/* Show all questions button */}
                <div className="pt-8 text-center">
                  <button
                    onClick={() => setIsFAQModalOpen(true)}
                    className="inline-flex items-center text-violet-600 hover:text-violet-700 font-light"
                  >
                    {content.faq.showAll}
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </button>
                    </div>
                    </div>
              </div>
          </section>

          {/* FAQ Modal */}
          <FAQModal
            isOpen={isFAQModalOpen}
            onClose={() => setIsFAQModalOpen(false)}
            faqItems={content.faq.items}
          />

          {/* Final CTA Section */}
          <section className="py-20">
            <div className={containerClass}>
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-4xl font-light mb-8">
                  {content.finalCta.title}
                </h2>
                <p className="text-xl mb-8 text-gray-600">
                  {content.finalCta.subtitle}
                </p>
                <button 
                  onClick={() => window.open('https://calendly.com/yannick-familie-heeren/30min', '_blank')}
                  className="bg-black text-white px-8 py-3 rounded-none font-light hover:bg-gray-900 transition duration-300 inline-flex items-center text-lg"
                >
                  {content.finalCta.cta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
            </div>
          </div>
        </section>

          {/* MVP Section - Moved below Final CTA */}
          <section className="py-12 sm:py-32 bg-black text-white">
          <div className={containerClass}>
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
                      2 <span className="text-violet-500">{content.mvp.weeks}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {showForm && <BundleForm onClose={() => setShowForm(false)} />}

        {/* MS Forms Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        <NewsletterPopup />

        <footer className="bg-[#0F1115] text-white py-16">
          <div className={containerClass}>
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
            <button 
                    onClick={() => setIsFAQModalOpen(true)}
                    className="text-gray-400 hover:text-white transition-colors"
            >
                    FAQ
            </button>
                  <Link to="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                  <Link to="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link>
          </div>
    </div>
            </div>
          </div>
        </footer>
    </div>
    </>
  )
}




const CurvedArrow = () => {
  return (
    <div className="absolute w-full h-24 bottom-0 left-0 overflow-visible pointer-events-none">
      <svg
        viewBox="0 0 400 100"
        className="w-full h-full"
        style={{ transform: 'translateY(50%)' }}
      >
        <path
          d="M350,10 Q200,120 50,10"
          fill="none"
          stroke="#FF4500"
          strokeWidth="3"
          strokeLinecap="round"
          className="animate-draw"
        >
          <animate
            attributeName="strokeDashoffset"
            from="1000"
            to="0"
            dur="2s"
            fill="freeze"
          />
        </path>
        {/* Arrow head pointing to the button */}
        <path
          d="M60,10 L50,10 L55,20"
          fill="none"
          stroke="#FF4500"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default VisibiltyBundle

