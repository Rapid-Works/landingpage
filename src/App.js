import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Lightbulb, Code, CheckCircle, ChevronDown, X, Menu } from 'lucide-react';
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import HeroImage from "./images/heroimage.jpg"
import HeroImage1 from "./images/heroimage2.jpg"
import HeroImage2 from "./images/heroimage3.jpg"

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('en');

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <a className="flex items-center justify-center" href="/">
        <Rocket className="h-6 w-6 text-primary" />
        <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-violet-600">
          RapidWorks
        </span>
      </a>
      <nav className="hidden md:flex ml-auto gap-4 sm:gap-6">
        <a className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" href="#services">
          Services
        </a>
        <a className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" href="#approach">
          Our Approach
        </a>
        <a className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" href="#contact">
          Contact
        </a>
      </nav>
      {/* Language Selector */}
      <select 
        className="hidden md:block ml-4 text-sm font-medium text-gray-600 bg-transparent border-none cursor-pointer hover:text-gray-900 transition-colors"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="en">EN</option>
        <option value="de">DE</option>
      </select>
      <button
        className="hidden md:block ml-4 px-4 py-2 bg-black text-white rounded-md hover:bg-black/90"
        onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
      >
        Get Started
      </button>
      <button
        className="ml-auto md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <a 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" 
              href="#services"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </a>
            <a 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" 
              href="#approach"
              onClick={() => setIsMenuOpen(false)}
            >
              Our Approach
            </a>
            <a 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" 
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
            {/* Language Selector in Mobile Menu */}
            <select 
              className="text-sm font-medium text-gray-600 bg-transparent border-none cursor-pointer w-full"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
            <button
              className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-black/90"
              onClick={() => {
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                setIsMenuOpen(false);
              }}
            >
              Get Started
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

function HeroSection({ fadeIn }) {
  return (
    <section className="w-full min-h-[100vh] md:min-h-[80vh] py-12 md:py-24 lg:py-32 xl:py-48 bg-black relative overflow-hidden flex items-center">
      <div className="absolute inset-0 opacity-10">
        <img src={HeroImage} alt="Background" className="w-full h-full object-cover" />
      </div>
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          className="flex flex-col items-center space-y-4 text-center"
          initial="initial"
          animate="animate"
          variants={fadeIn}
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-white">
              Your Idea, Live in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cb5eee] to-[#4be1ec]">2 Weeks</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
              We'll build your MVP in just 14 days - completely free until you're amazed by the results.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <button
              className="w-full px-6 py-4 text-lg font-medium bg-white text-black rounded-md hover:bg-gray-100"
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
            >
              Book Your Free Consultation
            </button>
          </div>
        </motion.div>
      </div>
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <ChevronDown className="h-8 w-8 text-white" />
      </motion.div>
    </section>
  );
}

const ServicesSection = ({ fadeIn }) => (
  <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-white">
    <div className="container px-4 md:px-6">
      <motion.div
        className="text-center mb-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Rapid MVP Services</h2>
        <p className="mt-4 text-gray-500 md:text-xl">Tailored solutions to launch your idea faster than ever</p>
      </motion.div>
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
        <ServiceCard
          icon={Lightbulb}
          title="Strategic Guidance"
          description="One-on-one expert guidance by an experienced founder to help validate and refine your idea. We'll work together to define your MVP and create a roadmap for success."
          features={[
            "Idea validation and refinement",
            "Market analysis and positioning",
            "MVP feature prioritization"
          ]}
        />
        <ServiceCard
          icon={Code}
          title="Rapid MVP Development"
          description="We bring your MVP to life in just 2 weeks. Focus on your core business while we handle the technical implementation, delivering a fully functional product ready for user testing."
          features={[
            "Full-stack development",
            "User-centric design",
            ""
            // "Core feature implementation"
          ]}
        />
      </div>
    </div>
  </section>
);

const ServiceCard = ({ icon: Icon, title, description, features }) => (
  <motion.div
    initial="initial"
    whileInView="animate"
    viewport={{ once: true }}
  >
    <Card className="bg-gray-50 border-none shadow-lg hover:shadow-xl transition-shadow">
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
      </CardContent>
    </Card>
  </motion.div>
);

const ApproachSection = ({ fadeIn }) => (
  <section id="approach" className="w-full py-12 md:py-24 lg:py-32 bg-black text-white relative overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <img src={HeroImage1} alt="Background" className="w-full h-full object-cover" />
    </div>
    <div className="container px-4 md:px-6 relative z-10">
      <motion.div
        className="text-center mb-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our 3D Approach to MVP Success</h2>
        <p className="mt-4 text-gray-400 md:text-xl">A proven methodology to turn your idea into a market-ready product</p>
      </motion.div>
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
        {[
          { 
            icon: Lightbulb, 
            title: 'Discovery', 
            description: 'Together we dive deep into your idea, market, and goals to create a solid foundation for your MVP. Our guidance helps refine your concept for maximum customer validation.' 
          },
          { 
            icon: Code, 
            title: 'Development', 
            description: 'We bring your MVP to life in just 2 weeks, using cutting-edge technologies. We focus on core features that demonstrate your product\'s value to real customers.' 
          },
          { 
            icon: Rocket, 
            title: 'Delivery', 
            description: 'We present your fully functional MVP, ready for user testing. So far this has been completely free of charge. If you\'re not amazed by your MVP right now, you don\'t have to buy it. The only thing you have to invest is 2 weeks of our time.' 
          }
        ].map((step, index) => (
          <ApproachStep key={step.title} {...step} index={index} fadeIn={fadeIn} />
        ))}
      </div>
    </div>
  </section>
);

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
);

const WhyChooseUsSection = ({ fadeIn }) => (
  <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
    <div className="container px-4 md:px-6">
      <motion.div
        className="text-center mb-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Founders Choose RapidWorks</h2>
        <p className="mt-4 text-gray-500 md:text-xl">Unmatched speed, expertise, and support for your journey</p>
      </motion.div>
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
        {[
          { 
            title: 'Built By Founders, For Founders', 
            description: 'We understand your unique challenges and time constraints because we\'ve been there ourselves.' 
          },
          { 
            title: 'Lightning Fast Development', 
            description: 'Get your MVP in just 2 weeks, accelerating your time to market and investor pitches.' 
          },
          { 
            title: 'Risk-Free Engagement', 
            description: 'Free consultation and 2-week development period. Pay only when you\'re satisfied with your MVP.' 
          },
          { 
            title: 'Government Funding Support', 
            description: 'For startups in North Rhine-Westphalia, we assist in applying for government funding covering 70% of our services.' 
          }
        ].map((feature, index) => (
          <FeatureItem key={feature.title} {...feature} index={index} fadeIn={fadeIn} />
        ))}
      </div>
    </div>
  </section>
);

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
);

const ContactSection = ({ fadeIn }) => (
  <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-black text-white relative overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <img src={HeroImage2} alt="Background" className="w-full h-full object-cover" />
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
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">Ready to Launch Your Idea?</h2>
          <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
            Take the first step towards bringing your idea to life. Schedule your free consultation today and let's build something amazing together.
          </p>
        </div>
        <div className="w-full max-w-sm space-y-2">
          <form className="grid gap-4">
            <Input placeholder="Your Name" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400" />
            <Input type="email" placeholder="Your Email" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400" />
            <Textarea 
              placeholder="Tell us about your project idea" 
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400" 
            />
            <button type="submit" className="px-6 py-3 text-lg font-medium bg-white text-black rounded-md hover:bg-gray-100">
              Request Free Consultation
            </button>
          </form>
          <p className="text-xs text-gray-400">
            By submitting this form, you agree to our <a href="#" className="underline">terms of service</a> and <a href="#" className="underline">privacy policy</a>.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="w-full py-6 bg-white border-t border-gray-200">
    <div className="container px-4 md:px-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Rocket className="h-6 w-6 text-violet-500" />
          <p className="text-center text-sm leading-loose text-gray-600 md:text-left">
            © 2025 RapidWorks Agency. All rights reserved.
          </p>
        </div>
        <nav className="flex gap-4 sm:gap-6">
          <a className="text-sm font-medium hover:underline underline-offset-4 text-gray-500" href="#">
            Terms of Service
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4 text-gray-500" href="#">
            Privacy Policy
          </a>
          {/* Optional language selector */}
          <select 
            className="text-sm font-medium text-gray-500 bg-transparent border-none cursor-pointer"
            defaultValue="en"
          >
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>
        </nav>
      </div>
    </div>
  </footer>
);

function App() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1 pt-16">
        <HeroSection fadeIn={fadeIn} />
        <ServicesSection fadeIn={fadeIn} />
        <ApproachSection fadeIn={fadeIn} />
        <WhyChooseUsSection fadeIn={fadeIn} />
        <ContactSection fadeIn={fadeIn} />
      </main>
      <Footer />
    </div>
  );
}

export default App;