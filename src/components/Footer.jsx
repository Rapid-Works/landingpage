import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { LanguageContext } from '../App'
import NewsletterForm from './NewsletterForm'
import ImpressumModal from './ImpressumModal'

const Footer = ({ showFAQ = false, onFAQClick }) => {
  const { translate } = useContext(LanguageContext)
  const [showImpressum, setShowImpressum] = useState(false)

  return (
    <>
      <footer className="bg-[#0F1115] text-white py-16">
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
                Copyright © 2025 RapidWorks. All rights reserved.
              </div>
              <div className="flex gap-6">
                <button 
                  onClick={() => setShowImpressum(true)} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {translate("nav.impressum")}
                </button>
                {showFAQ && (
                  <button 
                    onClick={onFAQClick}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FAQ
                  </button>
                )}
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                  {translate("footer.privacy")}
                </Link>
                <Link to="#contact" className="text-gray-400 hover:text-white transition-colors">
                  {translate("nav.contact")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Impressum Modal */}
      {showImpressum && (
        <ImpressumModal onClose={() => setShowImpressum(false)} />
      )}
    </>
  )
}

export default Footer 