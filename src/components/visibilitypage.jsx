import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Plus, Minus, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"
import HeroImage2 from "../images/heroimage3.jpg"
import RapidWorksWebsite from "../images/rapidworkswebsite.png"
import RapidWorksLogo from "../images/logo512.png"
import QRCodeLogo from "../images/qrcodelogo.jpg"
import PlaceholderImage from "../images/visibilityher.png"
import RapidWorksHoodie from "../images/rapiworkshoddie.png"
import RapidWorksBanner from "../images/rapidworksbanner.png"
import RapidWorksEmailSignature from "../images/rapidworksemailsignature.png"
import BusinessCard from "../images/businesscard.png"
import PhoneMockLogo from "../images/phonemocklogo.jpg"
import RollupBanner from "../images/rollup.png"
import PitchDeck from "../images/pitchdeck.jpg"
import GuidelineBrand from "../images/guidelinebrand.jpg"
import Calendar from "../images/calendar.jpg"
import RLogo from "../images/rlogo.jpg"
import VisibilityHero from "../images/visibilityher.png"
import { Link, useNavigate } from "react-router-dom"
import BundleForm from "./BundleForm"

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

const VisibiltyBundle = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const navigate = useNavigate();
  
  const handleGetBundle = () => {
    navigate('/get-bundle');
  }

  const bundleItems = [
    {
      title: "Curated Website",
      description: "An elegant, responsive website tailored to your unique aesthetic.",
      imageSrc: RapidWorksWebsite,
    },
    {
      title: "Signature QR Code",
      description: "A custom QR code that seamlessly integrates with your brand identity.",
      imageSrc: QRCodeLogo,
    },
    {
      title: "Social Media Presence",
      description: "Striking banners and profile images for a cohesive online presence.",
      imageSrc: RapidWorksBanner,
    },
    {
      title: "Branded Stationery",
      description: "Luxurious letterheads and business cards that exude quality.",
      imageSrc: BusinessCard,
    },
    {
      title: "Digital Wallpapers",
      description: "Chic smartphone and desktop backgrounds that showcase your brand.",
      imageSrc: PhoneMockLogo,
    },
    {
      title: "Rollup",
      description: "Eye-catching rollup banners and flyers for your brand events.",
      imageSrc: RollupBanner,
    },
    {
      title: "Curated Apparel",
      description: "Stylish t-shirt and hoodie designs for brand ambassadors.",
      imageSrc: RapidWorksHoodie,
    },
    {
      title: "Seamless Calendar Integration",
      description: "Effortless booking integration for your digital platforms.",
      imageSrc: Calendar,
    },
    {
      title: "And More...",
      description: "Additional brand assets and resources to ensure your complete brand success.",
      imageSrc: PlaceholderImage,
    }
  ]

  const faqItems = [
    {
      question: "What is the turnaround time for the Visibility Bundle?",
      answer:
        "We pride ourselves on swift, high-quality delivery. Your complete Visibility Bundle will be ready within 48 hours of receiving your order and brand information.",
    },
    {
      question: "Can I request modifications to the designs?",
      answer:
        "Absolutely. We offer one round of refinements for each item in the bundle to ensure the final result aligns perfectly with your vision.",
    },
    {
      question: "Do I receive the source files for the designs?",
      answer:
        "Yes, we provide all necessary source files, allowing you or your team to make future adjustments as your brand evolves.",
    },
    {
      question: "Is the website fully customizable?",
      answer:
        "The included website is a sophisticated, responsive design. For more advanced customization, we offer bespoke web development services. Please contact us for a personalized quote.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed w-full z-10 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link to="/" className="text-xl font-light hover:text-gray-600 transition-colors">
                RapidWorks
              </Link>
            </div>
            <div className="flex items-center justify-end md:flex-1 lg:w-0">
              <button 
                onClick={handleGetBundle}
                className="ml-8 inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-light rounded-none text-white bg-black hover:bg-gray-900"
              >
                Get Your Bundle Now
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="relative">
          <div className="relative min-h-[100vh] flex items-center">
            <div className="absolute inset-0">
              <img
                className="h-full w-full object-cover"
                src={VisibilityHero}
                alt="Hero background"
              />
              {/* Minimal gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent" />
            </div>

            <div className="relative w-full mt-32">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Left content */}
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="flex items-center space-x-4"
                    >
                      <span className="inline-block text-violet-600 text-base uppercase tracking-wider font-light
                                    px-4 py-1 rounded-full bg-violet-50/80 border border-violet-100">
                        Visibility Bundle
                      </span>
                    </motion.div>

                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black leading-[1.1] tracking-tight"
                    >
                      Transform Your{' '}
                      <span className="block">Brand Identity</span>
                    </motion.h1>

                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="text-xl text-gray-600 font-light leading-relaxed max-w-xl"
                    >
                      Complete brand identity package, delivered in 48 hours.
                      <span className="block mt-4 text-base">
                        Join the brands that trust RapidWorks for their identity needs.
                      </span>
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="flex flex-col sm:flex-row gap-4 pt-4"
                    >
                      <button 
                        onClick={handleGetBundle}
                        className="group relative inline-flex items-center px-8 py-4 text-base font-light 
                          overflow-hidden rounded-full text-white bg-black transition-all duration-300
                          shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <span className="relative z-10 flex items-center">
                          Get Your Bundle Now
                          <ArrowRight className="ml-2 -mr-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-violet-500 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </button>
                      <a 
                        href="#features" 
                        className="group inline-flex items-center justify-center px-8 py-4 text-base font-light
                          rounded-full text-gray-600 bg-gray-50 hover:bg-gray-100 transition-all duration-300
                          border border-gray-200 hover:border-gray-300"
                      >
                        See What's Included
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </a>
                    </motion.div>
                  </div>

                  {/* Right side - Floating elements */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative hidden lg:block"
                  >
                    <div className="relative w-full h-full">
                      {/* Add floating UI elements, mockups, or decorative shapes */}
                    </div>
                  </motion.div>
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
        <section className="pt-32 pb-16 bg-gray-50">
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
        </section>

        <section id="process" className="pt-16 pb-32 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-light text-center mb-24">
              How It Works
            </h2>
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/10" />
              
              <div className="grid md:grid-cols-3 gap-16 relative">
                {[
                  {
                    title: "Share Your Vision",
                    description: "Tell us about your brand and what makes it unique. We'll understand your goals and requirements.",
                    icon: "01"
                  },
                  {
                    title: "We Create",
                    description: "Our team rapidly crafts your complete brand identity package using our proven process.",
                    icon: "02"
                  },
                  {
                    title: "48hr Delivery",
                    description: "Receive your full Visibility Bundle within 48 hours, ready to elevate your brand.",
                    icon: "03"
                  },
                ].map((step, index) => (
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
          </div>
        </section>

        <section className="py-32 bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1">
                <h2 className="text-4xl font-light mb-4">
                  Need an MVP in 2 Weeks?
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Transform your idea into a working product with our rapid MVP development service.
                  Zero upfront cost, pay only when amazed.
                </p>
                <Link 
                  to="/" 
                  className="inline-flex items-center px-6 py-3 bg-white text-black hover:bg-gray-100 transition-colors font-light"
                >
                  Learn More
                  <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                </Link>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 blur-3xl opacity-20"></div>
                  <div className="relative text-8xl font-bold">
                    2<span className="text-violet-500">Weeks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-light mb-8">Ready to Transform Your Brand?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
              Get your complete brand identity package today.
            </p>
            <button 
              onClick={handleGetBundle}
              className="bg-black text-white px-8 py-3 rounded-none font-light hover:bg-gray-900 transition duration-300 inline-flex items-center text-lg"
            >
              Get Your Bundle Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </section>
      </main>

      {showForm && <BundleForm onClose={() => setShowForm(false)} />}
    </div>
  )
}

export default VisibiltyBundle

