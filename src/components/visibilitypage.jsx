import React, { useState, useEffect, useContext, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Plus, Minus, ChevronLeft, ChevronRight, CheckCircle, ChevronDown, Menu, X, CalendarCheck, Palette, Package, Megaphone, FileText, Users, BookOpen, Euro, Compass, Presentation, Loader2, MessageSquareText, ExternalLink, Quote } from "lucide-react"
import HeroImage2 from "../images/heroimage3.jpg"
import RapidWorksWebsite from "../images/laptop.png"
import RapidWorksLogo from "../images/logo512.png"
import QRCodeLogo from "../images/qrcode.png"
import PlaceholderImage from "../images/more.png"
import RapidWorksHoodie from "../images/hoodie.png"
import RapidWorksBanner from "../images/banner2.png"
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
import Footer from './Footer'
import AirtableForm from "./AirtableForm"
import RapidWorksHeader from "./new_landing_page_header"
import ExploreMoreSection from "./ExploreMoreSection"
import { testimonials } from "../testimonialsData"
import TestimonialCard from "./TestimonialCard"
import BrandingBg from '../images/branding bg.png'
import HoodieBg from '../images/hoodiebg.png'
import PricingBg from '../images/pricing_bg.png'
import VisibilityAllInclusive from '../images/visibility_all_inclusive.png'
import VisibilityProfessional from '../images/visibility_professional.png'

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
    }, 1000)
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

const BrandingTestimonialsSection = ({ content }) => {
  const brandingTestimonials = testimonials.filter(
    t => t.services.includes("branding") && !t.isFeatured
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (brandingTestimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === brandingTestimonials.length - 1 ? 0 : prev + 1));
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [brandingTestimonials.length]);

  if (brandingTestimonials.length === 0) {
    return null;
  }

  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + brandingTestimonials.length) % brandingTestimonials.length);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % brandingTestimonials.length);

  const currentTestimonial = brandingTestimonials[currentIndex];

  return (
    <section className="py-24 bg-[#F8F7FF]">
      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-4xl mx-auto">
           <div className="inline-flex items-center gap-3 text-[#7C3AED] text-sm font-semibold mb-6 px-5 py-2.5 rounded-full border-2 border-[#E9D5FF] bg-white shadow-sm">
              <FileText className="w-4 h-4 text-[#7C3AED]" />
              <span>CLIENT FEEDBACK</span>
           </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Success with Rapid Branding
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Hear from founders who quickly established their market presence with our package.
          </p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 border-t-4 border-[#A78BFA] relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side: Text content */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 text-purple-100 z-0">
                <Quote className="w-24 h-24" strokeWidth={1} />
          </div>
              <div className="relative z-10 flex flex-col h-full">
                <p className="text-gray-600 text-lg italic leading-relaxed flex-grow">
                  "{currentTestimonial.quote}"
                </p>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-2xl border-2 border-purple-200">
                      {currentTestimonial.authorName[0]}
                    </div>
                    <div className="ml-4">
                      <p className="font-bold text-gray-900">{currentTestimonial.authorName}</p>
                      <p className="text-gray-500 text-sm">{currentTestimonial.authorTitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Image slider */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <AnimatePresence initial={false}>
                <motion.img
                  key={currentIndex}
                  src={currentTestimonial.projectShowcaseImage}
                  alt={`${currentTestimonial.authorName}'s project showcase`}
                  className="absolute inset-0 w-full h-full object-contain"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </AnimatePresence>
              {brandingTestimonials.length > 1 && (
                <>
                  <button onClick={handlePrev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white rounded-full p-2 transition-colors z-20 shadow-md">
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
                  <button onClick={handleNext} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white rounded-full p-2 transition-colors z-20 shadow-md">
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>
                </>
        )}
            </div>
          </div>
        </div>
        
        {brandingTestimonials.length > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              {brandingTestimonials.map((_, index) => (
              <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'w-8 bg-[#7C3AED]' : 'w-2.5 bg-gray-300 hover:bg-gray-400'}`}
              />
            ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const VisibiltyBundle = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const context = useContext(AppLanguageContext)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [openFaqIndex, setOpenFaqIndex] = useState(null)

  const contentSectionRef = useRef(null)

  useEffect(() => {
      if (context) {
          setIsLoading(false);
      }
  }, [context]);

  if (isLoading || !context) {
    console.log("VisibilityBundle: Waiting for context or still loading...")
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-purple-600" /></div>;
  }

  const { language } = context

  const formUrls = {
    en: "https://vbforms.vercel.app/?lang=en",
    de: "https://vbforms.vercel.app/?lang=de"
  }

  const getFormUrl = () => {
    return formUrls[language] || formUrls.en
  }

  const handleGetBundle = () => {
    setIsModalOpen(true)
  }

  const pageContent = {
    en: {
      hero: {
        badgeText: "Rapid Branding",
        title: "Transform Your Brand Visibility",
        subtitle: "Establish a strong market presence quickly with a complete, professional brand identity package delivered in just one week.",
        scrollIndicatorAria: "Scroll to details"
      },
      mainText: "Establish your market presence quickly with our comprehensive Rapid Branding package, delivered in just one week and including:",
      keyPoints: [
        "Logo & Brand Design",
        "Startup Website",
        "Startup Apparel",
        "Business Cards",
        "Rollup"
      ],
      subtext: "No hidden costs, no bullshit.",
      cta: "Get Rapid Branding",
      seeMore: "and more...",
      bundleLabel: "Rapid Branding",
      nav: {
        mvpDev: "MVP Development",
        visibilityBundle: "Rapid Branding",
        bookCall: "Book a Call"
      },
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
      faq: {
        title: "Frequently Asked Questions",
        showAll: "Show all questions and answers",
        items: [
          {
            question: "What is a Rapid Branding worth?",
            answer: "Only you can determine its true value to your business. At agencies, the combined cost of all Rapid Branding components would typically range between €10,000 and €15,000, involving several weeks of waiting time and countless additional hours of coordination on your part. We drastically reduce costs by using a combination of automation and smart processes."
          },
          {
            question: "Why is a Rapid Branding so important for startups?",
            answer: "Our honest opinion? It's not. Startup founders have more important things to do than worry about design. We believe the founding team's most important task is to focus on their market and product. However, from both our own founding experience and consulting over 50 startups, we've recognized that developing brand visibility consumes a disproportionate amount of resources in terms of time and money, and contains too many pitfalls for inexperienced founders. While not as complex as the problems startups solve, the connection and coordination of visibility elements is detailed and meticulous. We handle these details for you, aiming to deliver your complete Rapid Branding within days, making you operational for the next year."
          },
          {
            question: "Why should I have RapidWorks create my Rapid Branding?",
            answer: "Our team combines startup founding experience with design and development expertise. We know exactly what a startup needs to reach and convince customers. We're also cost and time-efficient in creating Rapid Brandings, having semi-automated the creation of several bundle components."
          },
          {
            question: "In what form do I receive the Rapid Branding contents?",
            answer: "Upon completion, you'll receive an email with access to cloud storage containing all components of your Rapid Branding in digital form. Each file is saved in an appropriate format and clearly named. You'll also receive each file in an editable format. Our goal is to make you self-sufficient rather than creating dependency on us or other service providers. We don't provide physical materials, but you can use our files to have them produced at any print shop."
          },
          {
            question: "Does RapidWorks offer other services?",
            answer: "Yes, the Rapid Branding is our market entry, but our mission goes much further. We offer personal coaching with Yannick, MVP development, software development services at unbeatable prices, and free financing consultation. See <a href='https://rapidworks.vercel.app/' target='_blank' rel='noopener noreferrer' class='text-violet-600 hover:text-violet-700 underline'>RapidWorks</a> for more information."
          },
          {
            question: "What's the quality level of the Rapid Branding?",
            answer: "Comparable to the RapidWorks Rapid Branding you see showcased on this website. Your bundle will be created by Yannick and Samuel, exactly like the RapidWorks Rapid Branding. We're transparent that you shouldn't expect Apple-level design from us, but we're convinced that few startups need that level of design quality in the early stage."
          },
          {
            question: "What if I have special requests for my Rapid Branding?",
            answer: "You can note special requests in our form. We'll review them and inform you whether we can implement them within the offer or arrange an alternative solution."
          },
          {
            question: "Do I give up rights to my Rapid Branding or startup idea?",
            answer: "You retain all rights to your idea and Rapid Branding. We don't share any data with third parties. However, if your startup targets other startups with design, coaching, or development services, there might be a conflict of interest."
          },
          {
            question: "Who is the Startup Rapid Branding offer for?",
            answer: "In short - startups. See <a href='https://de.wikipedia.org/wiki/Start-up-Unternehmen' target='_blank' rel='noopener noreferrer' class='text-violet-600 hover:text-violet-700 underline'>Start-up-Unternehmen – Wikipedia</a>. If you're not sure whether you're a startup but need the Rapid Branding, feel free to fill out our form."
          },
          {
            question: "Do I need to have already founded my startup to receive a Rapid Branding?",
            answer: "No, you can fill out our application form even if you haven't founded your company yet."
          },
          {
            question: "What if I already have some contents of the Rapid Branding?",
            answer: "No problem. In our form, you can upload any files you already have and tell us how to incorporate them into your Rapid Branding."
          },
          {
            question: "When will I receive my Rapid Branding?",
            answer: "Since we've semi-automated the creation of several bundle components and are an experienced team in creating Rapid Brandings, we complete at least one bundle per week. We process orders on a <a href='https://de.wikipedia.org/wiki/First_In_%E2%80%93_First_Out' target='_blank' rel='noopener noreferrer' class='text-violet-600 hover:text-violet-700 underline'>First In – First Out – Wikipedia</a> basis and intentionally keep our pipeline small. Your bundle will be completed promptly and quickly - significantly faster than you could likely create or outsource it yourself."
          },
          {
            question: "How much does it cost to print all the media?",
            answer: "Depending on the provider, around €100 per rollup, €30 per hoodie, €20 for 500 business cards. We will soon recommend providers with whom we have had good experiences."
          }
        ]
      },
      mvp: {
        title: "Need an MVP in 2 Weeks?",
        description: "Transform your idea into a working product with our rapid MVP development service. Zero upfront cost, pay only when amazed.",
        cta: "Learn More",
        weeks: "Weeks"
      },
      finalCta: {
        title: "Ready to Transform Your Brand?",
        subtitle: "Get your complete brand identity package today.",
        cta: "Get Your Bundle Now"
      },
      howItWorks: {
        title: "How It Works",
        steps: [
          {
            title: "Submit Your Brand Info",
            description: "Share your brand vision, colors preferences and potentially existing graphics to include through our simple form."
          },
          {
            title: "We Create Your Assets",
            description: "We craft your complete Rapid Branding and present it to you once finished. If you are not satisfied with the bundle you don't have to pay."
          },
          {
            title: "Review & Refine",
            description: "We are also happy to help you if you notice any small adjustment requests afterwards. A minor feedback iteration after a few days is already included in the offer."
          }
        ]
      },
      features: {
        title: "Contents",
        subtitle: "The Rapid Branding contains everything you need to draw the attention of customers, partners, investors and employees to your startup. You immediately become visible and a uniform brand design makes your brand recognizable."
      },
      inhalt: {
        badge: "MAXIMUM IMPACT",
        title: "Contents",
        description: "The Rapid Branding contains everything you need to draw the attention of customers, partners, investors and employees to your startup. You immediately become visible and a uniform brand design makes your brand recognizable."
      },
      cookies: {
        banner: {
          title: "We use cookies to optimize our website and our service.",
          description: "You can decide for yourself which categories you want to allow.",
          privacy: "You can find more information in our",
          privacyLink: "privacy policy",
          acceptAll: "Accept all",
          adjustSettings: "Adjust settings",
          decline: "Decline"
        },
        modal: {
          title: "Manage Cookie Settings",
          necessary: {
            title: "Necessary",
            status: "Always active",
            description: "These cookies are required to enable basic website functions and save your language preferences or other preferred options."
          },
          analytics: {
            title: "Performance and Analytics",
            description: "These cookies provide statistical information about the use of our website. With their help, we can count visits and traffic sources to improve the performance of our website."
          },
          marketing: {
            title: "Marketing & Advertising",
            description: "These cookies are used by third parties to display personalized advertising that is relevant to your interests."
          },
          savePreferences: "Save preferences",
          decline: "Decline"
        }
      },
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
      },
      pricing: {
        title: "The Rapid Branding Package",
        subtitle: "Your complete brand identity – in just 7 days",
        price: "999 €",
        whatYouGet: "What you get:",
        items: [
          "Logo Design",
          "Business Cards",
          "Roll-up Banner",
          "Branding Guide",
          "Modern Landing Page",
          "Protected Download Area"
        ],
        cta: "Start now for 999 €",
        editableFiles: {
          title: "Editable files included",
          description: "All included elements are delivered in editable format (e.g. PDF, PNG, SVG). You receive all files digitally. You can print your elements as often as you like with the partners of your choice."
        },
        flexibleAdjustments: {
          description: "Further adjustments are possible at any time – for only 40 €/hour. We always offer you an effort-based fixed price, so you always have full cost control."
        }
      },
      benefits: {
        badge: "OUR ADVANTAGES",
        title: "Why Rapid Branding is the best choice",
        items: [
          {
            title: "Speed",
            description: "Get your complete branding package within just 7 days. Perfect for startups."
          },
          {
            title: "All inclusive",
            description: "You get everything you need from one source. This saves you unnecessary communication with multiple parties."
          },
          {
            title: "Professional appearance",
            description: "Cross-media visual and image language signals competence and creates trust."
          },
          {
            title: "Flexibly adaptable",
            description: "You can request adjustments at any time - For full cost control, we always give you a fixed price."
          }
        ]
      },
      faqSection: {
        title: "Frequently Asked Questions",
        showAll: "Show all questions and answers"
      },
      exploreMore: {
        badge: "Explore More",
        title: "Did you know we do more than just Branding?",
        description: "Check out our other services to help you grow your startup - from expert assistance to MVP development, coaching, and financing solutions.",
        cta: "Explore all services"
      },
      testimonials: {
        title: "Success with Rapid Branding",
        subtitle: "Hear from founders who quickly established their market presence with our package."
      }
    },
    de: {
      hero: {
        badgeText: "Rapid Branding",
        title: "Transformiere deine Markensichtbarkeit",
        subtitle: "Baue schnell eine starke Marktpräsenz auf mit einem kompletten, professionellen Markenidentitätspaket – geliefert in nur einer Woche.",
        scrollIndicatorAria: "Zu den Details scrollen"
      },
      mainText: "Etabliere schnell deine Marktpräsenz mit unserem umfassenden Rapid Branding-Paket, geliefert in nur einer Woche und inklusive:",
      keyPoints: [
        "Logo & Brand Design",
        "Startup Website",
        "Startup Bekleidung",
        "Visitenkarten",
        "Rollup"
      ],
      subtext: "Keine versteckten Kosten, kein Bullshit.",
      cta: "Rapid Branding erhalten",
      seeMore: "und mehr...",
      bundleLabel: "Rapid Branding",
      nav: {
        mvpDev: "MVP-Entwicklung",
        visibilityBundle: "Sichtbarkeitspaket",
        bookCall: "Gespräch Buchen"
      },
      bundleItems: {
        website: {
          title: "Deine Startup-Website",
          description: "Eine elegante, responsive Website mit klarem Call-to-Action für deine Zielgruppe. Wir beraten dich, welche Komponenten eine Startup-Website benötigt, um Leads zu generieren und Kunden zu gewinnen, und erstellen diese für dich."
        },
        qrCode: {
          title: "QR-Code und Kalender-Link Integration",
          description: "Wir verbinden die Online- und Offline-Welt für dich. In unserem intuitiven Formular kannst du einen Kalender-Link für jeden Gründer angeben und wo dieser erscheinen soll (E-Mail-Signatur, Visitenkarte, Website). Du kannst auch festlegen, wo wir den QR-Code zu deiner Website einfügen sollen (Visitenkarte, Rollup)."
        },
        socialMedia: {
          title: "Social-Media Banner",
          description: "Ein aussagekräftiges Social-Media-Banner, durch das Gründer und Mitarbeiter ihre Zugehörigkeit zum Startup zeigen können. Der Zweck des Banners ist es, deine Mission auf einen Blick zu kommunizieren."
        },
        stationery: {
          title: "Visitenkarten-Druckdatei & E-Mail-Signatur",
          description: "Deine Visitenkarte muss keinen Design-Wettbewerb gewinnen, sondern einen erkennbaren Wert für dich und dein Startup schaffen. Deshalb fügen wir standardmäßig dein Profilbild, den QR-Code deiner Landing Page und einen zu deiner Startup-Aktivität passenden grafischen Hintergrund hinzu."
        },
        wallpapers: {
          title: "Digitale Wallpaper",
          description: "Ein dezentes Wallpaper im Brand Design deines Startups für Smartphones und Laptops. In unserem intuitiven Formular kann jeder Gründer angeben, welches Smartphone er verwendet."
        },
        rollup: {
          title: "Rollup-Template Druckdatei",
          description: "Ein Roll-up in deinem Brand Design. Roll-ups müssen nicht jedem gefallen und dein Startup nicht größer erscheinen lassen als es ist. Aber deine Zielgruppe muss auf einen Blick verstehen, welches Problem du für sie löst. Wir helfen dir, die wichtigste Botschaft für dein Roll-up zu finden und integrieren den QR-Code deiner Website."
        },
        apparel: {
          title: "Hoodie-Druckdatei",
          description: "Ohne Hoodie wärst du kein Startup. Du wärst einfach nur selbstständig. Zum Glück haben wir dich und deine Mitgründer mit einer Hoodie-Druckdatei abgedeckt."
        }
      },
      faq: {
        title: "Häufig gestellte Fragen",
        showAll: "Alle Fragen und Antworten anzeigen",
        items: [
          {
            question: "Was ist ein Rapid Branding wert?",
            answer: "Was es wert ist, kannst nur du selbst bestimmen. Was alle Inhalte des Rapid Brandings zusammengerechnet bei Agenturen kosten würde, liegt etwa zwischen 10.000€ und 15.000€ und wäre mit mehreren Wochen an Wartezeit und unzähligen zusätzlichen Stunden an Koordinationsaufwand von deiner Seite verbunden. Wir reduzieren die Kosten drastisch, indem wir auf eine Kombination aus Automation und smarten Prozessen setzen."
          },
          {
            question: "Warum ist ein Rapid Branding so wichtig für Startups?",
            answer: "Unsere ehrliche Meinung? Ist es nicht. Startup Gründer haben wichtigeres zu tun, als sich mit Design zu beschäftigen. Wir sind davon überzeugt, dass es die wichtigste Aufgabe des Gründerteams ist, sich mit ihrem Markt und ihrem Produkt zu beschäftigen. Wir haben jedoch sowohl aus eigener Gründungserfahrung als auch aus der Beratung von über 50 Startups erkannt, dass die Entwicklung der Markenvisibilität eine überdimensionierte Menge der Ressourcen eines jungen Startups in Form von Zeit und Geld verschlingt und zu viele Fallstricke für unerfahrene Gründer beinhaltet. Die Verbindung und Abstimmung der einzelnen Elemente des Rapid Brandings eines Startups ist im Vergleich zu den Problemen, die ein Startup löst, nicht komplex. Aber sie ist kleinteilig und penibel. Genau diese kleinteiligen Schritte nehmen wir euch ab. Unser Ziel ist es, dass ihr in nur wenigen Tagen euer vollständiges Rapid Branding in den Händen haltet und somit lauffähig für das nächste Jahr seid. Wir halten unser Rapid Branding nicht für das finale Brand Design, welches ihr in 5 Jahren mit einer Million Kunden noch haben werdet, aber für den effizientesten Einstieg, der euch die Schaffensruhe gibt, um diese Skalierung erreichen zu können."
          },
          {
            question: "Warum sollte ich mein Rapid Branding von RapidWorks erstellen lassen?",
            answer: "Wir vereinen in unserem Team Startup-Gründungserfahrung, Design- und Development-Erfahrung. Wir wissen exakt, was ein Startup benötigt, um Kunden erreichen und überzeugen zu können. Zudem sind wir kosten- und zeiteffektiv in der Erstellung von Rapid Brandings, da wir bereits die Erstellung einiger Inhalte des Bundles semi-automatisiert haben."
          },
          {
            question: "In welcher Form erhalte ich die Inhalte des Rapid Brandings?",
            answer: "Nach Fertigstellung erhältst du von uns eine E-Mail mit Zugriffslink zu einem Cloud-Storage, welcher sämtliche Bestandteile deines Rapid Brandings in digitaler Form enthält. Jede Datei ist in geeignetem Dateiformat für die jeweilige Rolle abgespeichert und sprechend benannt. Du erhältst zudem jede Datei in einem bearbeitungsoffenen Format. Unser Ziel ist es, dich für die Zukunft handlungsfähig zu machen, anstatt dich in ein Abhängigkeitsverhältnis von uns oder anderen Dienstleistern hinein zu zwingen. Du erhältst von uns explizit keine physischen Materialien, du kannst dir diese aber mit unseren Dateien bei jeder Druckerei direkt in beliebiger Stückzahl fertigen lassen."
          },
          {
            question: "Bietet RapidWorks noch weitere Services an?",
            answer: "Ja, das Rapid Branding ist unser Markteintritt, unsere Mission geht aber noch viel weiter. Unabhängig vom Rapid Branding bieten wir Startups persönliches Coaching mit Yannick, MVP-Development und Software-Developmentleistungen zu unschlagbaren Preisen und kostenfreie Finanzierungsberatung an. Für weitere Infos siehe <a href='https://rapidworks.vercel.app/' target='_blank' rel='noopener noreferrer' class='text-violet-600 hover:text-violet-700 underline'>RapidWorks</a>."
          },
          {
            question: "Wie hoch ist die Qualität des Rapid Brandings?",
            answer: "Vergleichbar mit der Qualität des RapidWorks Rapid Brandings, welches du als Showcase auf dieser Webseite hier siehst. Dein Rapid Branding wird in Zusammenarbeit von Yannick und Samuel erstellt, exakt so wie das RapidWorks Rapid Branding. Wir gehen transparent damit um, dass du bei uns kein Design auf dem Level von Apple erwarten kannst. Wir sind allerdings davon überzeugt, dass auch nur kaum ein Startup dieses Level an Design-Qualität bereits in der Early-Stage braucht. Der Dreh- und Angelpunkt des Services deines Startups dreht sich um Brand Design auf Weltklasse? Dann sind wir nicht der richtige Partner für dich. In jedem anderen Fall vermutlich schon."
          },
          {
            question: "Was ist, wenn ich Extrawünsche zu meinem Rapid Branding habe?",
            answer: "In unserem Formular kannst du Extrawünsche gerne notieren, wir werden diese sichten und dich darüber informieren, ob wir diese im Rahmen des Angebots mit umsetzen, oder uns anderweitig arrangieren können."
          },
          {
            question: "Trete ich Rechte an meinem Rapid Branding oder meiner Startup Idee ab?",
            answer: "Dein Startup richtet sich ebenfalls an andere Startups als Zielgruppe und bietet Design-, Coaching-, oder Development-Leistungen an? In diesen Fällen könnte ein Interessenskonflikt zwischen uns vorliegen. Tu uns beiden einen Gefallen und schreib uns nicht deine Billion Dollar Startup Idee für explizit diese Zielgruppe und Leistungen in unser Formular. Wir haben selbst eine Menge weitere innovative Lösungen in diesem Bereich geplant und werden uns mit niemandem die Lorbeeren dafür teilen, weil jemand meint, dass wir seine Idee geklaut hätten. Insofern deine Idee nicht explizit in diesem Bereich liegt, kannst du sie uns bedenkenlos mitteilen. Du behältst ausdrücklich sämtliche Rechte an deiner Idee und deinem Rapid Branding. Wir geben keinerlei Daten an Dritte weiter. Unabhängig davon fragen wir dich nicht ab, wie deine Idee unter der Haube funktioniert. Alle Daten, die du uns gibst, sind Daten, die du scheinbar sowieso öffentlich sichtbar machen möchtest."
          },
          {
            question: "An wen richtet sich das Startup Rapid Branding Angebot?",
            answer: "Kurzum - An Startups. Siehe <a href='https://de.wikipedia.org/wiki/Start-up-Unternehmen' target='_blank' rel='noopener noreferrer' class='text-violet-600 hover:text-violet-700 underline'>Start-up-Unternehmen – Wikipedia</a>. Du bist kein Startup, oder bist dir nicht sicher, ob du eins bist, aber das Rapid Branding ist genau das was du brauchst? Dann füll gerne unser Formular aus, wir melden uns bei dir."
          },
          {
            question: "Muss ich mein Startup bereits gegründet haben, um ein Rapid Branding erhalten zu können?",
            answer: "Nein, du kannst unser Bewerbungsformular auch ausfüllen, wenn du noch nicht gegründet hast."
          },
          {
            question: "Was ist, wenn ich bereits einige Inhalte des Rapid Brandings habe?",
            answer: "Das ist kein Problem, in unserem Formular kannst du uns beliebige Dateien hochladen, die du bereits hast und uns dazu schreiben, welche davon wir in welcher Form beim Erstellen des Rapid Brandings aufgreifen sollen."
          },
          {
            question: "Wann bekomme ich mein Rapid Branding?",
            answer: "Da wir die Erstellung mehrerer Inhalte des Rapid Brandings bereits zu einem gewissen Grad semi-automatisiert haben, ein eingespieltes Team in der Erstellung von Rapid Brandings sind und eine Menge Erfahrung in der Betreuung von Startups haben, erstellen wir mindestens ein Rapid Branding pro Woche. Wir arbeiten die Aufträge nach <a href='https://de.wikipedia.org/wiki/First_In_%E2%80%93_First_Out' target='_blank' rel='noopener noreferrer' class='text-violet-600 hover:text-violet-700 underline'>First In – First Out – Wikipedia</a> ab und halten die Anzahl von Aufträgen in unserer Pipeline beabsichtigt sehr klein. Dein Rapid Branding wird also in jedem Fall sehr zeitnah und schnell abgearbeitet. Deutlich schneller, als du es vermutlich selbst anfertigen oder outsourcen könntest."
          },
          {
            question: "Wie viel kostet es, alle Printmedien drucken zu lassen?",
            answer: "Je nach Anbieter um die 100€ pro Rollup, 30€ pro Hoodie, 20€ für 500 Visitenkarten. Wir werden in Kürze auch Anbieter empfehlen mit denen wir gute Erfahrungen gemacht haben."
          }
        ]
      },
      mvp: {
        title: "Benötigst du einen MVP in 2 Wochen?",
        description: "Verwandle deine Idee in ein funktionierendes Produkt mit unserem schnellen MVP-Entwicklungsservice. Keine Vorabkosten, Zahlung nur bei Zufriedenheit.",
        cta: "Mehr erfahren",
        weeks: "Wochen"
      },
      finalCta: {
        title: "Bereit, deine Marke zu transformieren?",
        subtitle: "Hole dir heute dein komplettes Markenidentitätspaket.",
        cta: "Jetzt Bundle sichern"
      },
      howItWorks: {
        title: "So funktioniert's",
        steps: [
          {
            title: "Teile deine Markeninfo",
            description: "Teile uns deine Markenvision, Farbpräferenzen und eventuell vorhandene Grafiken über unser einfaches Formular mit."
          },
          {
            title: "Wir erstellen deine Assets",
            description: "Wir erstellen dein komplettes Rapid Branding und präsentieren es dir nach Fertigstellung. Wenn du mit dem Bundle nicht zufrieden bist, musst du nicht zahlen."
          },
          {
            title: "Prüfen & Verfeinern",
            description: "Wir helfen dir auch gerne, wenn du nachträglich kleine Anpassungswünsche bemerkst. Eine kleine Feedback-Iteration nach einigen Tagen ist bereits im Angebot enthalten."
          }
        ]
      },
      features: {
        title: "Was ist enthalten?",
        subtitle: "Entdecke alle Komponenten deines Rapid Branding Pakets"
      },
      cookies: {
        banner: {
          title: "Wir verwenden Cookies, um unsere Website und unseren Service zu optimieren.",
          description: "Du kannst selbst entscheiden, welche Kategorien du zulassen möchtest.",
          privacy: "Weitere Informationen findest du in unserer",
          privacyLink: "Datenschutzerklärung",
          acceptAll: "Alle akzeptieren",
          adjustSettings: "Einstellungen anpassen",
          decline: "Ablehnen"
        },
        modal: {
          title: "Cookie-Einstellungen verwalten",
          necessary: {
            title: "Notwendig",
            status: "Immer aktiv",
            description: "Diese Cookies sind erforderlich, um grundlegende Website-Funktionen zu ermöglichen und deine Sprachpräferenzen oder andere bevorzugte Optionen zu speichern."
          },
          analytics: {
            title: "Leistung und Analyse",
            description: "Diese Cookies liefern statistische Informationen über die Nutzung unserer Website. Mit ihrer Hilfe können wir Besuche und Traffic-Quellen zählen, um die Leistung unserer Website zu verbessern."
          },
          marketing: {
            title: "Marketing & Werbung",
            description: "Diese Cookies werden von Dritten verwendet, um personalisierte Werbung anzuzeigen, die für deine Interessen relevant ist."
          },
          savePreferences: "Präferenzen speichern",
          decline: "Ablehnen"
        }
      },
      process: {
        title: "Unser Prozess",
        steps: [
          {
            title: "Entdeckung",
            description: "Wir lernen deine Markenvision und Ziele kennen"
          },
          {
            title: "Erstellung",
            description: "Unser Team entwickelt deine komplette Markenidentität"
          },
          {
            title: "Verfeinerung",
            description: "Wir verfeinern deine Assets, bis sie perfekt sind"
          },
          {
            title: "Lieferung",
            description: "Erhalte dein komplettes Markenpaket"
          }
        ]
      },
      pricing: {
        title: "Das Rapid Branding Paket",
        subtitle: "Dein kompletter Markenauftritt – in nur 7 Tagen",
        price: "999 €",
        whatYouGet: "Was du bekommst:",
        items: [
          "Logo-Design",
          "Visitenkarte",
          "Roll-up Banner",
          "Branding-Guide",
          "Moderne Landingpage",
          "Geschützter Download-Bereich"
        ],
        cta: "Jetzt starten für 999 €",
        editableFiles: {
          title: "Bearbeitbare Dateien inklusive",
          description: "Alle enthaltenen Elemente werden in bearbeitbarem Format (z. B. PDF, PNG, SVG) geliefert. Du erhältst sämtliche Dateien digital. Du kannst deine Elemente beliebig oft mit den Partnern deiner Wahl ausdrucken."
        },
        flexibleAdjustments: {
          description: "Weitere Anpassungen sind jederzeit möglich – für nur 40 €/Stunde. Wir bieten dir jedes mal einen aufwandsbasierten Fixpreis, so behältst du zu jederzeit volle Kostenkontrolle."
        }
      },
      benefits: {
        badge: "UNSERE VORTEILE",
        title: "Warum Rapid Branding die beste Wahl ist",
        items: [
          {
            title: "Geschwindigkeit",
            description: "Erhalte dein komplettes Branding-Paket innerhalb von nur 7 Tagen. Perfekt für Startups."
          },
          {
            title: "Alles inklusive",
            description: "Von uns erhältst du alles was du brauchst aus einer Hand. Das spart dir unnötige Kommunikation mit mehreren Parteien."
          },
          {
            title: "Professioneller Auftritt",
            description: "Medienübergreifende Form- und Bildsprache signalisiert Kompetenz und schafft Vertrauen."
          },
          {
            title: "Flexibel anpassbar",
            description: "Du kannst jederzeit Anpassungen anfragen - Zur vollen Kostenkontrolle machen wir dir immer einen Fixpreis."
          }
        ]
      },
      inhalt: {
        badge: "MAXIMALE AUßENWIRKUNG",
        title: "Inhalt",
        description: "Das Rapid Branding enthält alles, was du brauchst, um die Aufmerksamkeit von Kunden, Partnern, Investoren und Mitarbeitern auf dein Startup zu lenken. Du wirst sofort sichtbar und ein einheitliches Markendesign macht deine Marke erkennbar."
      },
      faqSection: {
        title: "Häufig gestellte Fragen",
        showAll: "Alle Fragen und Antworten anzeigen"
      },
      exploreMore: {
        badge: "Mehr Entdecken",
        title: "Wusstest du, dass wir mehr als nur Branding anbieten?",
        description: "Entdecke unsere weiteren Dienstleistungen, die dir beim Wachstum deines Startups helfen - von Expertenunterstützung über MVP-Entwicklung bis hin zu Coaching und Finanzierungslösungen.",
        cta: "Alle Services entdecken"
      },
      testimonials: {
        title: "Erfolge mit Rapid Branding",
        subtitle: "Höre von Gründern, die mit unserem Paket schnell ihre Marktpräsenz aufgebaut haben."
      }
    }
  }

  const content = pageContent[language]

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

  const scrollToContent = () => {
    if (contentSectionRef.current) {
      contentSectionRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const containerClass = "max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative"



  return (
    <>
      <RapidWorksHeader />
      <div className="min-h-screen bg-white">
        <main className="relative w-full overflow-x-hidden">

          <section className="relative h-[70vh] min-h-[500px] overflow-hidden text-white">
            {/* Background image */}
            <div className="absolute inset-0 z-0">
              <img 
                src={BrandingBg} 
                alt="Branding Background" 
                className="w-full h-full object-cover object-[center_20%]"
              />
                </div>
            {/* Color overlay */}
            <div className="absolute inset-0 bg-[#270A5C]/90 z-10"></div>
            
            <div className="container mx-auto px-6 py-20 md:py-24 lg:py-32 relative z-20 flex items-center justify-center h-full">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight tracking-tight text-white">
                  {content.hero.title}
                </h1>
                <p className="text-2xl text-white/90 leading-relaxed font-medium">
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

          <section ref={contentSectionRef} className="py-20 bg-white">
            <div className={containerClass}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left Content */}
                <div className="space-y-8">
                  {/* Title */}
                  <h2 className="text-5xl md:text-6xl font-bold text-[#7C3BEC] leading-tight">
                    Rapid Branding
                  </h2>
                  
                  {/* Description */}
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    {content.mainText}
                  </p>

                  {/* Service Tags */}
                  <div className="space-y-4">
                    {/* First row - 2 items */}
                    <div className="flex gap-4">
                      {content.keyPoints.slice(0, 2).map((point, index) => (
                      <div
                        key={index}
                          className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[#7C3BEC] text-black hover:bg-[#7C3BEC]/5 transition-colors bg-white"
                      >
                          <div className="w-3 h-3 rounded-full border-2 border-[#7C3BEC] bg-transparent relative flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#7C3BEC]"></div>
                        </div>
                          <span className="text-base font-medium">{point}</span>
                      </div>
                    ))}
                  </div>
                    
                    {/* Second row - 2 items */}
                    <div className="flex gap-4">
                      {content.keyPoints.slice(2, 4).map((point, index) => (
                        <div
                          key={index + 2}
                          className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[#7C3BEC] text-black hover:bg-[#7C3BEC]/5 transition-colors bg-white"
                        >
                          <div className="w-3 h-3 rounded-full border-2 border-[#7C3BEC] bg-transparent relative flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#7C3BEC]"></div>
                          </div>
                          <span className="text-base font-medium">{point}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Third row - 1 item and "und mehr..." text */}
                    <div className="flex items-center gap-4">
                      {content.keyPoints.length > 4 && (
                        <div
                          className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[#7C3BEC] text-black hover:bg-[#7C3BEC]/5 transition-colors bg-white"
                        >
                          <div className="w-3 h-3 rounded-full border-2 border-[#7C3BEC] bg-transparent relative flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#7C3BEC]"></div>
                          </div>
                          <span className="text-base font-medium">{content.keyPoints[4]}</span>
                        </div>
                      )}
                  
                  {/* "und mehr..." text */}
                  <p className="text-gray-600 text-lg font-medium">
                    {content.seeMore}
                  </p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center px-8 py-4 text-white font-medium rounded-3xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                    style={{ backgroundColor: '#FF6B6B' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#FF5252'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#FF6B6B'}
                  >
                      {content.cta}
                  </button>
                </div>

                {/* Right Visual */}
                <div className="relative">
                  <img
                    src={PlaceholderImage}
                    alt="Rapid Branding Showcase"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Inhalt Section */}
          <section className="py-20 md:py-32" style={{ backgroundColor: '#8B2CDF' }}>
            <div className={containerClass}>
              <div className="text-center text-white max-w-4xl mx-auto">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 mb-8">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                  <span className="text-sm font-medium uppercase tracking-wider">
                    {content.inhalt.badge}
                  </span>
                </div>
                
                {/* Title */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
                  {content.inhalt.title}
                </h2>
                
                {/* Description */}
                <p className="text-lg md:text-xl lg:text-2xl leading-loose font-light opacity-95">
                  {content.inhalt.description}
                </p>
              </div>
            </div>
          </section>

          <section id="features" className="py-20 md:py-40 overflow-hidden relative" style={{ backgroundColor: '#492c6f' }}>
            <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 md:px-12 relative">
              <div className="space-y-24 relative">
                {bundleItems.slice(0, 6).map((item, index) => {
                  // Special styling for QR-Code (index 1) and Rollup (index 5)
                  const isSpecialCard = index === 1 || index === 5;
                  // Special styling with white border for Business Card (index 3)
                  const isWhiteBorderCard = index === 3;
                  
                  if (isSpecialCard) {
                    return (
              <motion.div
                        key={index}
                        className="relative group"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      >
                        <div className="bg-[#301d49] rounded-[3rem] p-8 md:p-12 text-white">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            {/* Text Content */}
                            <div className="space-y-6">
                              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                                {item.title}
                              </h3>
                              <p className="text-white/90 text-base md:text-lg leading-[40px]">
                                {item.description}
                              </p>
                            </div>
                            
                            {/* Visual */}
                            <div className="relative aspect-[4/3] flex items-center justify-center">
                              <img
                                src={item.imageSrc || PlaceholderImage}
                                alt={item.title}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }
                  
                  if (isWhiteBorderCard) {
                    return (
                      <motion.div
                        key={index}
                        className="relative group"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      >
                        <div className="border-2 border-white/60 rounded-[3rem] p-8 md:p-12 bg-transparent">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            {/* Text Content */}
                            <div className="space-y-6">
                              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                                {item.title}
                              </h3>
                              <p className="text-white/90 text-base md:text-lg leading-[40px]">
                                {item.description}
                              </p>
                            </div>
                            
                            {/* Visual */}
                            <div className="relative aspect-[4/3] flex items-center justify-center">
                              <img
                                src={item.imageSrc || PlaceholderImage}
                                alt={item.title}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                          </div>
                        </div>
              </motion.div>
                    );
                  }

                  // Default styling for other items
                  return (
                  <motion.div
                    key={index}
                    className="relative group"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16 lg:gap-24`}>
                      <div className="w-full md:w-1/2">
                        <div className="relative aspect-[4/3] overflow-hidden group rounded-3xl">
                            <div className="h-full transform-gpu flex items-center justify-center">
                            <img
                              src={item.imageSrc || PlaceholderImage}
                              alt={item.title}
                                className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="w-full md:w-1/2">
                        <div className="relative">
                          <div className="space-y-6 md:space-y-8">
                            <div className="space-y-4 md:space-y-6">
                                <h3 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-tight text-white leading-relaxed pb-1">
                                {item.title}
                              </h3>
                                <p className={`text-white/90 text-base md:text-lg lg:text-xl leading-[40px]`}>
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Hoodie Section with Background */}
          <section className="pt-6 md:pt-8 pb-20 md:pb-40 overflow-hidden relative" style={{ backgroundColor: '#492c6f' }}>
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img 
                src={HoodieBg} 
                alt="Background" 
                className="w-full h-full object-cover opacity-10"
              />
              {/* Top fade overlay */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#492c6f] to-transparent z-10"></div>
            </div>
            <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 md:px-12 relative z-10">
              <div className="space-y-24 relative">
                {bundleItems.slice(6).map((item, index) => {
                  const actualIndex = index + 6;
                  const isHoodie = actualIndex === 6;
                  
                  return (
                    <motion.div
                      key={actualIndex}
                      className="relative group"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <div className="border-2 border-white/60 rounded-[3rem] p-8 md:p-12 bg-transparent">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center lg:grid-flow-col-dense">
                          {/* Text Content */}
                          <div className="space-y-6 lg:col-start-2">
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                              {item.title}
                            </h3>
                            <p className="text-white/90 text-base md:text-lg leading-[40px]">
                              {item.description}
                            </p>
                          </div>
                          
                          {/* Visual */}
                          <div className="relative aspect-[4/3] flex items-center justify-center lg:col-start-1">
                            <img
                              src={item.imageSrc || PlaceholderImage}
                              alt={item.title}
                              className="max-w-full max-h-full object-contain drop-shadow-2xl"
                              style={{ filter: 'drop-shadow(0 0 40px rgba(124, 59, 236, 0.8))' }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Why Rapid Branding Section */}
          <section className="py-20 md:py-32" style={{ backgroundColor: '#F3F0FF' }}>
            <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 md:px-12">
              <div className="text-center mb-16">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-purple-300 text-purple-600 mb-8 bg-white/50">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm font-medium uppercase tracking-wider">
                    {content.benefits.badge}
                  </span>
                </div>
                
                {/* Title */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-16">
                  {content.benefits.title}
                </h2>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {content.benefits.items.map((benefit, index) => {
                  const icons = [
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>,
                    <img src={VisibilityAllInclusive} alt="All inclusive icon" className="w-12 h-12" />,
                    <img src={VisibilityProfessional} alt="Professional appearance icon" className="w-12 h-12" />,
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ];
                  
                  return (
                    <div key={index} className="rounded-[32px] p-8 text-center text-white min-h-[400px] flex flex-col relative overflow-hidden" 
                         style={{ 
                           backgroundColor: '#BB86FF',
                           boxShadow: '0 20px 40px rgba(146, 87, 221, 0.3)'
                         }}>
                      {/* Bottom gradient border */}
                      <div className="absolute bottom-0 left-0 right-0 h-1" 
                           style={{ background: 'linear-gradient(270deg, #9257DD 23.12%, rgba(255, 107, 107, 0.3) 49.61%, #9257DD 81.85%)' }}></div>
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8" style={{ background: 'linear-gradient(to bottom right, #9257DD, #540E92)' }}>
                        {icons[index]}
                      </div>
                      <h3 className="text-xl font-black mb-6 text-[#2D1B69]">{benefit.title}</h3>
                      <p className="text-[#2D1B69] leading-relaxed flex-grow">
                        {benefit.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="py-16 md:py-24 relative overflow-hidden" style={{ backgroundColor: '#270A5C' }}>
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img 
                src={PricingBg} 
                alt="Pricing Background" 
                className="w-full h-full object-cover opacity-25"
              />
              {/* Color overlay */}
              <div className="absolute inset-0 bg-[#270A5C]/70"></div>
            </div>
            <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 md:px-12 relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  {content.pricing.title}
                </h2>
                <p className="text-xl md:text-2xl text-white/90 font-light">
                  {content.pricing.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
                {/* Pricing Card */}
                <div className="order-1 lg:order-1 lg:col-span-2">
                  <div className="rounded-[32px] p-8 md:p-10 text-center h-full flex flex-col relative overflow-hidden border-2 border-white/60"
                       style={{ 
                         background: 'linear-gradient(140.21deg, #6A20AA 27.33%, #390866 56.88%)'
                       }}>
                    {/* Price */}
                    <div className="mb-6">
                      <div className="text-7xl md:text-8xl font-bold text-white mb-2">
                        {content.pricing.price}
                      </div>
                    </div>

                    {/* What you get */}
                    <div className="mb-6 flex-grow">
                      <h3 className="text-xl font-black text-white mb-6">
                        {content.pricing.whatYouGet}
                      </h3>
                      <div className="flex justify-center">
                        <div className="space-y-4">
                        {content.pricing.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                            <span className="text-white text-lg">{item}</span>
                          </div>
                        ))}
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full py-4 px-8 rounded-3xl font-semibold text-white transition-all duration-300 hover:scale-105 text-lg"
                      style={{ backgroundColor: '#FF6B6B' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#FF5252'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#FF6B6B'}
                    >
                      {content.pricing.cta}
                    </button>
                  </div>
                </div>

                {/* Information Cards */}
                <div className="order-2 lg:order-2 lg:col-span-3 h-full flex flex-col gap-6">
                  {/* Editable Files Card */}
                  <div className="rounded-[32px] p-8 border-2 border-white/60 bg-transparent flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-white mb-6">
                      {content.pricing.editableFiles.title}
                    </h3>
                    <p className="text-white/90 text-lg leading-relaxed flex-grow">
                      {content.pricing.editableFiles.description}
                    </p>
                  </div>

                  {/* Flexible Adjustments Card */}
                  <div className="rounded-[32px] p-8 border-2 border-white/60 bg-transparent flex-1 flex flex-col justify-center">
                    <p className="text-white/90 text-lg leading-relaxed">
                      {content.pricing.flexibleAdjustments.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <BrandingTestimonialsSection content={content} />

          <section className="py-16 md:py-20 relative overflow-hidden" 
                   style={{ background: 'linear-gradient(63.21deg, #19042C 36.84%, #3B2888 96.53%)' }}>
            <div className={containerClass}>
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  {content.faqSection.title}
                </h2>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="rounded-[32px] p-6 md:p-8" 
                     style={{ background: 'linear-gradient(63.21deg, #3B2888 36.84%, #19042C 96.53%)' }}>
                  <div className="space-y-4">
                {faqItems.slice(0, 5).map((item, index) => (
                      <div key={index} className="border-b border-white/20 last:border-b-0 pb-4 last:pb-0">
                  <FAQItem
                    key={index}
                    question={item.question}
                    answer={item.answer}
                          isDark={true}
                          isOpen={openFaqIndex === index}
                          onToggle={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  />
                      </div>
                ))}
                  </div>

                  <div className="pt-6 text-center border-t border-white/20 mt-6">
                  <button
                    onClick={() => setIsFAQModalOpen(true)}
                      className="inline-flex items-center text-white hover:text-white/80 font-medium text-lg transition-colors"
                  >
                      {content.faqSection.showAll}
                      <ChevronRight className="ml-2 w-5 h-5" />
                  </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className={containerClass}>
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-black mb-8">
                  {content.finalCta.title}
                </h2>
                <p className="text-xl mb-8 text-gray-600">
                  {content.finalCta.subtitle}
                </p>
                <button
                  onClick={() => window.open('https://calendly.com/yannick-familie-heeren/30min', '_blank')}
                  className="text-white px-8 py-3 rounded-3xl font-light transition duration-300 inline-flex items-center text-lg"
                  style={{ backgroundColor: '#7C3BEC' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#6B2DD4'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#7C3BEC'}
                >
                  {content.finalCta.cta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          </section>

          <ExploreMoreSection excludeService="Branding" />

        </main>

        {showForm && <BundleForm onClose={() => setShowForm(false)} />}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formUrl={getFormUrl()}
        />

        <FAQModal 
          isOpen={isFAQModalOpen}
          onClose={() => setIsFAQModalOpen(false)}
          faqItems={faqItems}
        />

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