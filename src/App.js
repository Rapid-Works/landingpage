import React, { useState, createContext, useContext, useEffect, useMemo, Component } from "react"
import { motion } from "framer-motion"
import { Analytics } from "@vercel/analytics/react"
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
import HeroImage1 from "./images/heroimage2.jpg"
import HeroImage2 from "./images/heroimage3.jpg"
import NRWLogo from "./images/nwrlogo.png"
import { Link, Routes, Route, useLocation } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import VisibiltyBundle from "./components/visibilitypage"
import platformBg from "./images/platform-bg.png"
import ScrollToTop from './components/ScrollToTop'
import Footer from './components/Footer'
import RapidWorksPage from "./components/new_landing_page"
import TeamPage from "./components/team_page"
import BlueprintPage from "./components/blueprint"
import WorkshopsPage from "./components/workshop"
import CoachingPage from "./components/coaching"
import FinancingPage from "./components/financing"
import MVPpage from "./components/mvppage"
import BundlePage from "./components/bundle"
// import WebinarFAB from "./components/WebinarFAB" // Commented out - replaced with AI Assistant
import AIAssistantChatbot from "./components/AIAssistantChatbot"
import PartnersPage from "./components/partners_page"
import WebinarModal from './components/WebinarModal'
import { getNextWebinarDates } from './utils/dateUtils'
import BlogListPage from './components/BlogListPage'
import BlogPostPage from './components/BlogPostPage'
import QRCodeRedirect from './components/QRCodeRedirect'
import AGBPage from './components/AGBPage'
import PrivacyPage from './components/PrivacyPage'
import ImpressumPage from './components/ImpressumPage'
import CookieConsent from './components/CookieConsent'
import PublicBrandingKits from './components/PublicBrandingKits'
import TrackingRedirect from './components/TrackingRedirect'

// Authentication imports
import { AuthProvider } from './contexts/AuthContext'
import Dashboard from './components/Dashboard'
import ForgotPassword from './components/ForgotPassword'
import ProtectedRoute from './components/ProtectedRoute'
// import { NotificationProvider } from './contexts/NotificationContext' // DISABLED
import OrganizationInvite from './components/OrganizationInvite'

// PUSH NOTIFICATIONS COMPLETELY DISABLED - TO PREVENT iOS ISSUES
console.log('🔕 Push notifications are disabled to ensure iOS Safari compatibility');

// Create and export Language Context with initial values
export const LanguageContext = createContext({
  language: 'de',
  setLanguage: () => { },
  translate: () => ''
})

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
      bookCall: "Book a Call"
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
          "35,000€ in government funding",
          "Guidance through the application process",
          "Support for startups in North Rhine-Westphalia",
        ],
        specialNote: "* This funding is specific to NRW, but we can support startups in other regions as well. Learn more at: ",
        specialNoteLink: "https://www.wirtschaft.nrw/go-to-market",
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
      impressum: "Legal Notice",
      faq: "FAQ",
      contact: "Contact"
    },
    newsletter: {
      title: "Subscribe to Our Newsletter",
      placeholder: "Enter your email",
      button: "Subscribe",
      popup: {
        title: "Stay Updated",
        subtitle: "Subscribe to our newsletter for the latest updates and exclusive offers.",
        success: "✓ Successfully subscribed!",
        error: "× Something went wrong. Please try again."
      }
    },
    impressum: {
      title: "Legal Notice",
      accordingTo: "Information pursuant to § 5 TMG:",
      companyInfo: {
        title: "Company Information",
        name: "HappyStay UG",
        street: "Tulpenweg 24a",
        city: "52222 Stolberg",
        country: "Germany",
        email: "Email: contact@rapid-works.io",
        phone: "Phone: +49 (0) 157 823 244 53",
        managing: "Managing Director: Yannick Heeren"
      },
      registration: {
        title: "Registry Entry",
        court: "Amtsgericht Aachen",
        number: "HRB 22303",
        vatId: "VAT ID: DE321168712"
      },
      responsibility: {
        title: "Responsible for Content",
        name: "Yannick Heeren",
        street: "Tulpenweg 24a",
        city: "52222 Stolberg"
      }
    },
    agb: {
      title: "Terms and Conditions (AGB)",
      sections: {
        section1: {
          title: "§1 Scope and Provider",
          content: "These General Terms and Conditions (AGB) apply to all contracts between the customer and RapidWorks – [full company name], [address], E-Mail: yannick.heeren@rapid-works.io, hereinafter referred to as \"Provider\". Deviating conditions of the customer only apply if the provider expressly agrees in writing."
        },
        section2: {
          title: "§2 Subject Matter of Contract",
          content: "The provider offers digital services in the areas of branding, web design, content creation, UI/UX and digital marketing solutions. The specific scope of services results from the offer or package selected by the customer. The implementation is digital. Physical services (e.g. printing of business cards) are not part of the offer, unless otherwise agreed."
        },
        section3: {
          title: "§3 Contract Formation",
          content: "The presentation of services on the website does not constitute a legally binding offer, but a non-binding invitation to submit an inquiry. The contract is concluded when the provider sends the customer a written order confirmation or begins with the service provision."
        },
        section4: {
          title: "§4 Prices and Payment Terms",
          content: "The Rapid Branding Package costs 999 €. Payment is made in advance. Delivery takes place within 7 working days after receipt of payment. Subsequent changes or extensions to delivered project content will be charged at 40 €/hour and only carried out after express consent of the customer."
        },
        section5: {
          title: "§5 Usage Rights",
          content: "Upon full payment, the customer receives a simple, non-transferable right of use to the content created within the project. All delivered files (e.g. logos, templates, layouts) are handed over in editable format (e.g. SVG, Figma). Transfer to third parties or commercial further use beyond the agreed purpose requires written consent of the provider."
        },
        section6: {
          title: "§6 Liability",
          content: "The provider is liable for intent and gross negligence. For slight negligence only in case of violation of essential contractual obligations. Liability is limited in amount to the contractually typical foreseeable damages. Liability for indirect damages, especially lost profits or data loss, is excluded."
        },
        section7: {
          title: "§7 Data Protection and Rights of Data Subjects (GDPR)",
          content: "The processing of personal data is carried out in accordance with the General Data Protection Regulation (GDPR) and the Federal Data Protection Act (BDSG). The customer has the right to: information, correction, deletion, restriction of processing, data portability and objection to processing. When using the newsletter form, the specified email address is used exclusively for sending information about products and services from RapidWorks and is not passed on to third parties."
        },
        section8: {
          title: "§8 Use of AI Tools and Data Processing Outside the EU",
          content: "To support creative processes, design automation and text creation, we partially use automated systems (so-called \"AI tools\"). These tools are used in compliance with data protection regulations. Some services are provided by employees outside the European Economic Area (EEA), particularly in Ghana. Appropriate protective measures are implemented in accordance with Art. 44 ff. GDPR (e.g. standard contractual clauses)."
        },
        section9: {
          title: "§9 Changes to the AGB",
          content: "The provider is entitled to change these AGB with effect for the future. Customers will be informed of changes at least 14 days in advance. If the customer does not object within this period, the changes are deemed accepted."
        },
        section10: {
          title: "§10 Final Provisions",
          content: "The law of the Federal Republic of Germany applies, excluding the UN Convention on Contracts for the International Sale of Goods. The place of jurisdiction is the registered office of the provider, provided the customer is a merchant or legal entity. Should a provision of these AGB be invalid, the validity of the remaining provisions remains unaffected."
        }
      }
    },
    privacy: {
      title: "Privacy Policy",
      sections: {
        section1: {
          title: "1. General Information",
          content: "The protection of your personal data is of particular concern to us. This privacy policy informs you about the type, scope and purpose of processing personal data on our website www.rapid-works.io in accordance with the General Data Protection Regulation (GDPR)."
        },
        section2: {
          title: "2. Responsible Party",
          content: "Responsible for data processing is:\nRapidWorks\nYannick Heeren\n(c/o RapidWorks – in foundation)\nTulpenweg 24a\n52222 Stolberg\nGermany\nE-Mail: yannick.heeren@rapid-works.io"
        },
        section3: {
          title: "3. Collection and Processing of Personal Data",
          content: "We only process personal data if you provide it to us in the context of your inquiry, booking or use of our services. This includes, for example:\n- First and last name\n- Email address (e.g. for newsletter registration)\n- IP address\n- Usage behavior on our website"
        },
        section4: {
          title: "4. Purposes of Data Processing",
          content: "Processing is carried out for the following purposes:\n- Provision of the online offering\n- Communication with users\n- Sending email newsletters (only with consent)\n- Analysis and improvement of our website\n- Security measures"
        },
        section5: {
          title: "5. Legal Basis",
          content: "Data processing is based on Art. 6 Para. 1 lit. a (consent), lit. b (contract fulfillment) and lit. f (legitimate interest) GDPR."
        },
        section6: {
          title: "6. Use of Cookies",
          content: "Our website uses cookies. Some cookies are necessary, others help us improve our online offering. You can adjust your cookie settings at any time. More information can be found in the cookie banner."
        },
        section7: {
          title: "7. Use of Third-Party Services",
          content: "We use the following third-party services:\n- Google Analytics (analysis tool)\n- Google Fonts (locally integrated)\n- OpenAI / AI tools for automation\n- possibly Meta Pixel (marketing)\n\nThese services may process personal data. Use only occurs with your consent."
        },
        section8: {
          title: "8. Newsletter & Email Communication",
          content: "If you sign up for our newsletter, we use your email address exclusively to send you information about our products and services. You can unsubscribe at any time via the corresponding link in each email."
        },
        section9: {
          title: "9. Data Transfer to Third Countries",
          content: "Part of the data processing is carried out by employees in Ghana. We ensure that appropriate data protection measures are taken in accordance with Art. 44 ff. GDPR (e.g. standard contractual clauses)."
        },  
        section10: {
          title: "10. Your Rights",
          content: "You have the right to:\n- Information (Art. 15 GDPR)\n- Correction (Art. 16 GDPR)\n- Deletion (Art. 17 GDPR)\n- Restriction of processing (Art. 18 GDPR)\n- Data portability (Art. 20 GDPR)\n- Objection to processing (Art. 21 GDPR)"
        },
        section11: {
          title: "11. Contact for Data Protection Inquiries",
          content: "For questions or concerns about data protection, please contact:\nyannick.heeren@rapid-works.io"
        },
        section12: {
          title: "12. Update of this Privacy Policy",
          content: "This privacy policy may be updated as needed. The current version can be viewed on our website."
        }
      }
    },
  },
  de: {
    nav: {
      services: "Leistungen",
      approach: "Unser Ansatz",
      contact: "Kontakt",
      getStarted: "Jetzt starten",
      impressum: "Impressum",
      visibility: "Sichtbarkeits-Bundle",
      bookCall: "Call buchen"
    },
    hero: {
      title: "Deine Idee, live in 2 Wochen",
      subtitle: "Wir entwickeln deinen MVP in nur 14 Tagen – kostenfrei, bis du von den Ergebnissen begeistert bist.",
      cta: "Kostenloses Beratungsgespräch",
    },
    services: {
      title: "Unsere Rapid MVP Services",
      subtitle: "Maßgeschneiderte Lösungen, um deine Idee schneller als je zuvor zu verwirklichen",
      strategic: {
        title: "Strategische Beratung",
        description:
          "Individuelle Expertenberatung durch einen erfahrenen Gründer, um deine Idee zu validieren und zu verfeinern. Gemeinsam definieren wir deinen MVP und erstellen einen Fahrplan zum Erfolg.",
        features: [
          "Ideenvalidierung und -verfeinerung",
          "Marktanalyse und Positionierung",
          "MVP Feature-Priorisierung",
        ],
      },
      development: {
        title: "Schnelle MVP-Entwicklung",
        description:
          "Wir erwecken deinen MVP in nur 2 Wochen zum Leben. Konzentriere dich auf dein Kerngeschäft, während wir die technische Umsetzung übernehmen und ein voll funktionsfähiges Produkt für Benutzertests liefern.",
        features: ["Full-Stack-Entwicklung", "Benutzerorientiertes Design", "Kernfunktionen-Implementierung"],
      },
      funding: {
        title: "Fördermittelberatung",
        description: "Wir unterstützen Startups bei der Beschaffung von staatlichen Fördermitteln zur Förderung ihres Wachstums und ihrer Entwicklung.",
        features: [
          "35.000€ staatliche Förderung",
          "Betreuung während des Antragsverfahrens",
          "Unterstützung für Startups in Nordrhein-Westfalen",
        ],
        specialNote: "* Diese Förderung gilt speziell für NRW, wir können aber auch Startups in anderen Regionen unterstützen. Mehr Informationen unter: ",
        specialNoteLink: "https://www.wirtschaft.nrw/go-to-market",
      },
    },
    approach: {
      title: "Unser 3D-Ansatz zum MVP-Erfolg",
      subtitle: "Eine bewährte Methodik, um deine Idee in ein marktreifes Produkt zu verwandeln",
      steps: {
        discovery: {
          title: "Entdeckung",
          description:
            "Gemeinsam tauchen wir tief in deine Idee, den Markt und deine Ziele ein, um eine solide Grundlage für deinen MVP zu schaffen. Unsere Beratung hilft, dein Konzept für maximale Kundenvalidierung zu verfeinern.",
        },
        development: {
          title: "Entwicklung",
          description:
            "Wir bringen deinen MVP in nur 2 Wochen zum Leben und nutzen modernste Technologien. Wir konzentrieren uns auf Kernfunktionen, die den Wert deines Produkts für echte Kunden demonstrieren.",
        },
        delivery: {
          title: "Übergabe",
          description:
            "Wir präsentieren deinen voll funktionsfähigen MVP, bereit für Benutzertests. Bis hierhin ist alles komplett kostenfrei. Wenn du von deinem MVP nicht begeistert bist, musst du ihn nicht kaufen. Das Einzige, was du investieren musst, sind 2 Wochen unserer Zeit.",
        },
      },
    },
    why: {
      title: "Warum Gründer RapidWorks wählen",
      subtitle: "Unübertroffene Geschwindigkeit, Expertise und Unterstützung für deine Reise",
      features: {
        founders: {
          title: "Von Gründern für Gründer",
          description:
            "Wir verstehen deine einzigartigen Herausforderungen und zeitlichen Einschränkungen, weil wir selbst dort waren.",
        },
        speed: {
          title: "Blitzschnelle Entwicklung",
          description:
            "Erhalte deinen MVP in nur 2 Wochen und beschleunige deinen Markteintritt und Investorenpräsentationen.",
        },
        risk: {
          title: "Risikofreies Engagement",
          description:
            "Kostenlose Beratung und 2-wöchige Entwicklungsphase. Du zahlst nur, wenn du mit deinem MVP zufrieden bist.",
        },
        funding: {
          title: "Förderung durch die öffentliche Hand",
          description:
            "Für Startups in Nordrhein-Westfalen unterstützen wir dich bei der Beantragung von öffentlichen Fördermitteln, die 70% unserer Leistungen abdecken.",
        },
      },
    },
    postMVP: {
      title: "Unser Angebot nach deinem MVP",
      subtitle: "Setze deine Reise mit flexibler, hochwertiger Entwicklungsunterstützung fort",
      features: {
        hours: {
          title: "1.000 Stunden Entwicklung",
          description:
            "Zugriff auf einen Pool von 1.000 Entwicklungsstunden nach Bedarf. Starte und stoppe ganz bequem.",
        },
        developer: {
          title: "Dedizierter Entwickler",
          description:
            "Arbeite das ganze Jahr über mit demselben Entwickler zusammen, um Konsistenz und ein tiefes Verständnis deines Projekts zu gewährleisten.",
        },
        payment: {
          title: "Flexible Zahlung",
          description:
            "Bezahle nur die geleisteten Stunden, die am Ende jedes Monats abgerechnet werden. Jederzeit kündbar ohne langfristige Bindung.",
        },
      },
    },
    contact: {
      title: "Bereit, deine Idee zu starten?",
      subtitle:
        "Mache den ersten Schritt, um deine Idee zum Leben zu erwecken. Vereinbare noch heute dein kostenloses Beratungsgespräch und lass uns gemeinsam etwas Erstaunliches aufbauen.",
      form: {
        name: "Dein Name",
        email: "Deine E-Mail",
        idea: "Erzähl uns von deiner Projektidee",
        submit: "Kostenloses Beratungsgespräch anfragen",
        terms: "Mit dem Absenden des Formulars stimmst du unseren",
        termsLink: "AGBs",
        and: "und der",
        privacyLink: "Datenschutzerklärung",
      },
    },
    footer: {
      copyright: "© 2025 RapidWorks Agency. Alle Rechte vorbehalten.",
      terms: "AGB",
      privacy: "Datenschutz",
      impressum: "Impressum",
      faq: "FAQ",
      contact: "Kontakt"
    },
    newsletter: {
      title: "Abonniere unseren Newsletter",
      placeholder: "E-Mail eingeben",
      button: "Abonnieren",
      popup: {
        title: "Bleib auf dem Laufenden",
        subtitle: "Abonniere unseren Newsletter für die neuesten Updates und exklusive Angebote.",
        success: "✓ Erfolgreich abonniert!",
        error: "× Etwas ist schiefgelaufen. Bitte versuche es erneut."
      }
    },
    impressum: {
      title: "Impressum",
      accordingTo: "Angaben gemäß § 5 TMG:",
      companyInfo: {
        title: "Unternehmensangaben",
        name: "HappyStay UG",
        street: "Tulpenweg 24a",
        city: "52222 Stolberg",
        country: "Deutschland",
        email: "Email: contact@rapid-works.io",
        phone: "Tel: +49 (0) 157 823 244 53",
        managing: "Geschäftsführer: Yannick Heeren"
      },
      registration: {
        title: "Registereintrag",
        court: "Amtsgericht Aachen",
        number: "HRB 22303",
        vatId: "USt-IdNr.: DE321168712"
      },
      responsibility: {
        title: "Verantwortlich für den Inhalt",
        name: "Yannick Heeren",
        street: "Tulpenweg 24a",
        city: "52222 Stolberg"
      }
    },
    agb: {
      title: "Allgemeine Geschäftsbedingungen (AGB)",
      sections: {
        section1: {
          title: "§1 Geltungsbereich und Anbieter",
          content: "Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen dem Kunden und RapidWorks – [vollständiger Unternehmensname], [Adresse], E-Mail: yannick.heeren@rapid-works.io, nachfolgend \"Anbieter\" genannt. Abweichende Bedingungen des Kunden gelten nur, wenn der Anbieter ausdrücklich schriftlich zustimmt."
        },
        section2: {
          title: "§2 Vertragsgegenstand",
          content: "Der Anbieter bietet digitale Dienstleistungen im Bereich Branding, Webdesign, Content Creation, UI/UX und digitale Marketinglösungen an. Der konkrete Leistungsumfang ergibt sich aus dem vom Kunden gewählten Angebot oder Paket. Die Umsetzung erfolgt digital. Physische Leistungen (z. B. Druck von Visitenkarten) sind nicht Bestandteil des Angebots, außer anders vereinbart."
        },
        section3: {
          title: "§3 Vertragsschluss",
          content: "Die Präsentation der Leistungen auf der Website stellt kein rechtlich bindendes Angebot dar, sondern eine unverbindliche Aufforderung zur Abgabe einer Anfrage. Der Vertrag kommt zustande, wenn der Anbieter dem Kunden eine schriftliche Auftragsbestätigung sendet oder mit der Leistungserbringung beginnt."
        },
        section4: {
          title: "§4 Preise und Zahlungsbedingungen",
          content: "Das Rapid Branding Paket kostet 999 €. Die Zahlung erfolgt im Voraus. Die Lieferung erfolgt innerhalb von 7 Werktagen nach Zahlungseingang. Nachträgliche Änderungen oder Erweiterungen an gelieferten Projektinhalte werden mit 40 €/Stunde berechnet und nur nach ausdrücklicher Zustimmung des Kunden durchgeführt."
        },
        section5: {
          title: "§5 Nutzungsrechte",
          content: "Mit vollständiger Zahlung erhält der Kunde ein einfaches, nicht übertragbares Nutzungsrecht an den im Rahmen des Projekts erstellten Inhalten. Alle gelieferten Dateien (z. B. Logos, Vorlagen, Layouts) werden in bearbeitbarem Format (z. B. SVG, Figma) übergeben. Die Weitergabe an Dritte oder kommerzielle Weiterverwendung über den vereinbarten Zweck hinaus bedarf der schriftlichen Zustimmung des Anbieters."
        },
        section6: {
          title: "§6 Haftung",
          content: "Der Anbieter haftet für Vorsatz und grobe Fahrlässigkeit. Für leichte Fahrlässigkeit nur bei Verletzung wesentlicher Vertragspflichten. Die Haftung ist der Höhe nach auf den vertragstypischen vorhersehbaren Schäden begrenzt. Eine Haftung für mittelbare Schäden, insbesondere entgangenen Gewinn oder Datenverlust, ist ausgeschlossen."
        },
        section7: {
          title: "§7 Datenschutz und Rechte der Betroffenen (DSGVO)",
          content: "Die Verarbeitung personenbezogener Daten erfolgt gemäß der Datenschutz-Grundverordnung (DSGVO) und dem Bundesdatenschutzgesetz (BDSG). Der Kunde hat das Recht auf: Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch gegen die Verarbeitung. Bei Nutzung des Newsletter-Formulars wird die angegebene E-Mail-Adresse ausschließlich für den Versand von Informationen über Produkte und Dienstleistungen von RapidWorks verwendet und nicht an Dritte weitergegeben."
        },
        section8: {
          title: "§8 Einsatz von KI-Tools und Datenverarbeitung außerhalb der EU",
          content: "Zur Unterstützung kreativer Prozesse, Designautomatisierung und Texterstellung setzen wir teilweise automatisierte Systeme (sog. \"KI-Tools\") ein. Diese Tools werden datenschutzkonform eingesetzt. Bei der Dienstleistungserbringung durch Mitarbeiter außerhalb des Europäischen Wirtschaftsraums (EWR), insbesondere in Ghana, erbracht werden. Dabei werden geeignete Schutzmaßnahmen gemäß Art. 44 ff. DSGVO umgesetzt (z. B. Standardvertragsklauseln)."
        },
        section9: {
          title: "§9 Änderungen der AGB",
          content: "Der Anbieter ist berechtigt, diese AGB mit Wirkung für die Zukunft zu ändern. Kunden werden mindestens 14 Tage im Voraus über Änderungen informiert. Widerspricht der Kunde nicht innerhalb dieser Frist, gelten die Änderungen als akzeptiert."
        },
        section10: {
          title: "§10 Schlussbestimmungen",
          content: "Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist der Sitz des Anbieters, sofern der Kunde Kaufmann oder juristische Person ist. Sollte eine Bestimmung dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt."
        }
      }
    },
    privacy: {
      title: "Datenschutzerklärung",
      sections: {
        section1: {
          title: "1. Allgemeine Hinweise",
          content: "Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Diese Datenschutzerklärung informiert Sie über die Art, den Umfang und den Zweck der Verarbeitung personenbezogener Daten auf unserer Website www.rapid-works.io gemäß der Datenschutz-Grundverordnung (DSGVO)."
        },
        section2: {
          title: "2. Verantwortlicher",
          content: "Verantwortlich für die Datenverarbeitung ist:\nRapidWorks\nYannick Heeren\n(c/o RapidWorks – in Gründung)\nTulpenweg 24a\n52222 Stolberg\nDeutschland\nE-Mail: yannick.heeren@rapid-works.io"
        },
        section3: {
          title: "3. Erhebung und Verarbeitung personenbezogener Daten",
          content: "Wir verarbeiten personenbezogene Daten nur, wenn Sie uns diese im Rahmen Ihrer Anfrage, Buchung oder Nutzung unserer Dienste mitteilen. Dazu zählen z. B.:\n- Name und Nachname\n- E-Mail-Adresse (z. B. bei Newsletter-Anmeldung)\n- IP-Adresse\n- Nutzungsverhalten auf unserer Website"
        },
        section4: {
          title: "4. Zwecke der Datenverarbeitung",
          content: "Die Verarbeitung erfolgt zu folgenden Zwecken:\n- Zurverführungsstellung des Onlineangebotes\n- Kommunikation mit Nutzern\n- Versand von E-Mail-Newslettern (nur bei Einwilligung)\n- Analyse und Verbesserung unserer Website\n- Sicherheitsmaßnahmen"
        },
        section5: {
          title: "5. Rechtsgrundlagen",
          content: "Die Datenverarbeitung erfolgt auf Basis von Art. 6 Abs. 1 lit. a (Einwilligung), lit. b (Vertragserfüllung) und lit. f (berechtigtes Interesse) DSGVO."
        },
        section6: {
          title: "6. Verwendung von Cookies",
          content: "Unsere Website verwendet Cookies. Einige Cookies sind notwendig, andere helfen uns, unser Onlineangebot zu verbessern. Sie können Ihre Cookie-Einstellungen jederzeit anpassen. Mehr Informationen finden Sie im Cookie-Banner."
        },
        section7: {
          title: "7. Einsatz von Drittanbietern",
          content: "Wir nutzen folgende Drittanbieter:\n- Google Analytics (Analyse-Tool)\n- Google Fonts (lokal eingebunden)\n- OpenAI / KI-Tools für Automatisierung\n- ggf. Meta Pixel (Marketing)\n\nDiese Dienste können personenbezogene Daten verarbeiten. Die Nutzung erfolgt nur nach Ihrer Einwilligung."
        },
        section8: {
          title: "8. Newsletter & E-Mail-Kommunikation",
          content: "Wenn Sie sich für unseren Newsletter anmelden, verwenden wir Ihre E-Mail-Adresse ausschließlich, um Ihnen Informationen über unsere Produkte und Dienstleistungen zukommen zu lassen. Eine Abmeldung ist jederzeit über den entsprechenden Link in jeder E-Mail möglich."
        },
        section9: {
          title: "9. Datenübermittlung in Drittländer",
          content: "Ein Teil der Datenverarbeitung erfolgt durch Mitarbeiter in Ghana. Wir stellen sicher, dass geeignete Datenschutzmaßnahmen gemäß Art. 44 ff. DSGVO getroffen werden (z. B. Standardvertragsklauseln)."
        },
        section10: {
          title: "10. Ihre Rechte",
          content: "Sie haben das Recht auf:\n- Auskunft (Art. 15 DSGVO)\n- Berichtigung (Art. 16 DSGVO)\n- Löschung (Art. 17 DSGVO)\n- Einschränkung der Verarbeitung (Art. 18 DSGVO)\n- Datenübertragbarkeit (Art. 20 DSGVO)\n- Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)"
        },
        section11: {
          title: "11. Kontakt für Datenschutzanfragen",
          content: "Bei Fragen oder Anliegen zum Datenschutz wenden Sie sich bitte an:\nyannick.heeren@rapid-works.io"
        },
        section12: {
          title: "12. Aktualisierung dieser Datenschutzerklärung",
          content: "Diese Datenschutzerklärung kann bei Bedarf angepasst werden. Die jeweils aktuelle Version ist auf unserer Website einsehbar."
        }
      }
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
            <Link to="/branding" className="text-gray-600 hover:text-gray-900">
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
                to="/branding"
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
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-violet-500">
          {highlightedText}
        </span>
      </>
    )
  }

  return (
    <div className="relative w-full">
      <div className="relative min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 translate-y-16 lg:w-[60%] lg:left-[40%]">
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full w-full object-contain object-right-top transition-transform duration-700 scale-90"
            src={platformBg}
            alt="Platform dashboard interface"
          />
        </div>

        {/* Content Container */}
        <div className="relative w-full">
          <div className="w-full pl-0 sm:pl-4 md:pl-8 lg:pl-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-32 items-center">
              {/* Text Content */}
              <div className="w-full max-w-[480px] mx-auto md:mx-0">
                <div className="space-y-6 text-center md:text-left pt-40 md:pt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="animate-float pt-4 md:pt-0"
                  >
                    <span className="inline-block text-violet-600 text-sm uppercase tracking-wider font-light
                      px-4 py-1 rounded-full bg-violet-50 border border-violet-100 backdrop-blur-sm shadow-sm"
                    >
                      RapidWorks
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight"
                  >
                    {renderTitle()}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg font-light leading-relaxed max-w-xl mx-auto md:mx-0 text-gray-600"
                  >
                    {translate("hero.subtitle")}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                  >
                    <button
                      onClick={() => window.open('https://calendly.com/yannick-familie-heeren/30min', '_blank')}
                      className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-light 
                        overflow-hidden rounded-full text-white bg-black transition-all duration-300
                        shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105
                        w-auto mx-auto sm:mx-0"
                    >
                      <span className="relative z-10 flex items-center whitespace-nowrap">
                        {translate("hero.cta")}
                        <ArrowRight className="ml-2 -mr-1 h-4 w-4 transition-transform group-hover:translate-x-2" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-violet-500 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Down Arrow */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer hidden md:block"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
        >
          <ChevronDown className="h-8 w-8 text-gray-400 hover:text-violet-500 transition-colors" />
        </motion.div>
      </div>
    </div>
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
            specialNoteLink={translate("services.funding.specialNoteLink")}
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

const ServiceCard = ({ icon: Icon, title, description, features, specialNote, specialNoteLink, logo }) => (
  <motion.div initial="initial" whileInView="animate" viewport={{ once: true }}>
    <Card className="bg-gray-50 border-none shadow-lg hover:shadow-xl transition-shadow relative min-h-[420px]">
      {logo && <img src={logo || "/placeholder.svg"} alt="NRW Logo" className="absolute top-4 right-4 w-12 h-12" />}
      <CardHeader>
        <Icon className="w-10 h-10 text-violet-500 mb-2" />
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full">
        <p className="text-gray-600">{description}</p>
        <ul className="mt-4 space-y-2 flex-grow">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckCircle className="h-5 w-5 text-violet-500 mr-2" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        {specialNote && (
          <p className="mt-4 text-xs text-gray-500">
            {specialNote}
            <a
              href={specialNoteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-600 hover:text-violet-700 hover:underline"
            >
              {specialNoteLink}
            </a>
          </p>
        )}
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
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
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
            Transform Your Brand
          </h2>
          <p className="mx-auto max-w-[700px] text-xl text-violet-100 md:text-2xl">
            Get a complete professional brand identity package, website, and marketing essentials - all delivered within days.
          </p>
          <Link
            to="/branding"
            onClick={() => window.scrollTo(0, 0)}
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


// Error Boundary Component for React errors
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
    
    // Mobile-specific error logging
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      console.error('📱 Mobile browser error detected:', error.message);
    }
  }

  render() {
    if (this.state.hasError) {
      // Remove loading screen immediately if there's an error
      const fallback = document.getElementById('loading-fallback');
      if (fallback) {
        fallback.remove();
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">We're having technical difficulties. Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Mobile PWA installation prompt component - DISABLED
 * PWA prompt disabled since notifications are disabled
 */
function MobilePWAPrompt() {
  // Component disabled - no PWA prompt needed without notifications
  return null;
}

/**
 * Automatic notification registration component - DISABLED
 * Push notifications are disabled to ensure iOS Safari compatibility
 */
function AutoNotificationRegistration() {
  // Component disabled - no auto registration to prevent iOS issues
  console.log('🔕 Auto-notification registration disabled for iOS compatibility');
  return null;
}


function App() {
  const [language, setLanguage] = useState(() => {
      return localStorage.getItem('language') || 'de'
  })
  const [showTimedWebinarModal, setShowTimedWebinarModal] = useState(false);
  const location = useLocation();

  // Remove loading screen when React app successfully mounts
  useEffect(() => {
    const removeLoadingScreen = () => {
      const fallback = document.getElementById('loading-fallback');
      if (fallback) {
        console.log('🚀 React App mounted - removing loading screen');
        fallback.style.opacity = '0';
        setTimeout(() => {
          if (fallback.parentNode) {
            fallback.remove();
          }
        }, 300);
      }
    };
    
    // More aggressive removal for mobile browsers
    const isMobileBrowser = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Remove immediately when component mounts
    removeLoadingScreen();
    
    // Multiple attempts for mobile browsers
    if (isMobileBrowser) {
      setTimeout(removeLoadingScreen, 50);
      setTimeout(removeLoadingScreen, 200);
      setTimeout(removeLoadingScreen, 500);
      setTimeout(removeLoadingScreen, 1000);
        } else {
      // Also try after a short delay to ensure DOM is ready
      setTimeout(removeLoadingScreen, 100);
    }
  }, []);
  
  // Check if we're on a dashboard page
  const isDashboardPage = location.pathname.startsWith('/dashboard');

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  // Temporarily disabled webinar modal popup
  // useEffect(() => {
  //   const lastShown = localStorage.getItem('webinarModalLastShown');
  //   const oneDayInMs = 24 * 60 * 60 * 1000; // 24 hours

  //   if (!lastShown || Date.now() - parseInt(lastShown) > oneDayInMs) {
  //     const timer = setTimeout(() => {
  //       console.log("Showing timed webinar modal");
  //       setShowTimedWebinarModal(true);
  //       localStorage.setItem('webinarModalLastShown', Date.now().toString());
  //     }, 30000); // 30 seconds timeout

  //     return () => clearTimeout(timer); // Cleanup timer on unmount
  //   }
  // }, []);

  const nextWebinarDateForPopup = useMemo(() => getNextWebinarDates(1), []);

  const contextValue = useMemo(() => ({
    language,
    setLanguage: (newLang) => {
      setLanguage(newLang)
    },
    translate: (key) => {
      const keys = key.split(".")
      let value = translations[language]
      for (const k of keys) {
        value = value?.[k]
      }
      return value || key
    }
  }), [language])

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

    return (
      <ErrorBoundary>
        <AuthProvider>
          {/* NotificationProvider disabled to prevent iOS issues */}
          <AutoNotificationRegistration />
          <MobilePWAPrompt />
          <LanguageContext.Provider value={contextValue}>
            <ScrollToTop />
            <Analytics />
            <Routes>
            {/* Authentication Routes */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/:kitId" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/task/:taskId" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Organization Invite Route */}
            <Route path="/organization/invite/:token" element={<OrganizationInvite />} />
            
            {/* Tracking Redirect Route */}
            <Route path="/t/:trackingCode" element={<TrackingRedirect />} />
            
            {/* QR Code Routes */}
            <Route path="/qrcodebranding" element={<QRCodeRedirect />} />
            <Route path="/qrcodevisibility" element={<QRCodeRedirect />} />
            <Route path="/qrcodemvp" element={<QRCodeRedirect />} />
            <Route path="/qrcodecoaching" element={<QRCodeRedirect />} />
            <Route path="/qrcodefinancing" element={<QRCodeRedirect />} />
            <Route path="/qrcodeworkshop" element={<QRCodeRedirect />} />
            <Route path="/qrcodeblueprint" element={<QRCodeRedirect />} />
            <Route path="/qrcodebundle" element={<QRCodeRedirect />} />
            <Route path="/qrcodepartners" element={<QRCodeRedirect />} />
            
            {/* Main App Routes */}
            <Route path="/" element={<RapidWorksPage />} />
            <Route path="/experts" element={<TeamPage />} />
            <Route path="/blueprint" element={<BlueprintPage />} />
            <Route path="/workshop" element={<WorkshopsPage />} />
            <Route path="/branding" element={<VisibiltyBundle />} />
            <Route path="/coaching" element={<CoachingPage />} />
            <Route path="/financing" element={<FinancingPage />} />
            <Route path="/mvp" element={<MVPpage />} />
            <Route path="/bundle" element={<BundlePage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/kits" element={<PublicBrandingKits />} />
            <Route path="/blogs" element={<BlogListPage />} />
            <Route path="/blogs/:slug" element={<BlogPostPage />} />
            <Route path="/agb" element={<AGBPage />} />
            <Route path="/datenschutz" element={<PrivacyPage />} />
            <Route path="/impressum" element={<ImpressumPage />} />
          </Routes>
          {/* <WebinarFAB /> */}
          {!isDashboardPage && <AIAssistantChatbot />}
          {/* Temporarily disabled timed webinar modal */}
          {/* <WebinarModal
            isOpen={showTimedWebinarModal}
            onClose={() => setShowTimedWebinarModal(false)}
            webinarDates={nextWebinarDateForPopup}
          /> */}
          {!isDashboardPage && <Footer />}
          <CookieConsent />
          </LanguageContext.Provider>
        </AuthProvider>
      </ErrorBoundary>
  )
}

export default App
