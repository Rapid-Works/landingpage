import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { LanguageContext } from '../App'
import NewsletterForm from './NewsletterForm'

const Footer = ({ showFAQ = false, onFAQClick }) => {
  const context = useContext(LanguageContext)
  
  if (!context) {
    return null // Return null if context is not available
  }

  const { language } = context

  // Translation object
  const translations = {
    en: {
      footer: {
        copyright: "© 2025 RapidWorks. All rights reserved.",
        terms: "Terms of Service",
        privacy: "Privacy Policy",
        faq: "FAQ",
        contact: "Contact"
      }
    },
    de: {
      footer: {
        copyright: "© 2025 RapidWorks. Alle Rechte vorbehalten.",
        terms: "AGB",
        privacy: "Datenschutz",
        faq: "FAQ",
        contact: "Kontakt"
      }
    }
  }

  const content = translations[language]?.footer || translations.de.footer

  return (
    <>
      <footer className="bg-[#1D0D37] text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
                {content.copyright}
              </div>
              <div className="flex gap-6">
                <Link 
                  to="/agb" 
                  className="text-gray-400 hover:text-[#7C3BEC] transition-colors"
                >
                  {content.terms}
                </Link>
                <Link 
                  to="/datenschutz" 
                  className="text-gray-400 hover:text-[#7C3BEC] transition-colors"
                >
                  {content.privacy}
                </Link>
                {showFAQ && (
                  <button 
                    onClick={onFAQClick}
                    className="text-gray-400 hover:text-[#7C3BEC] transition-colors"
                  >
                    {content.faq}
                  </button>
                )}
                <Link to="#contact" className="text-gray-400 hover:text-[#7C3BEC] transition-colors">
                  {content.contact}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer 