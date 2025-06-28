import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useState, useEffect, useContext } from "react"
import { LanguageContext } from '../App'

// Function to submit data to Airtable
const submitToAirtable = async (email) => {
  // const apiKey = process.env.REACT_APP_NEWSLETTER_AIRTABLE_API_KEY;
  // const baseId = process.env.REACT_APP_NEWSLETTER_AIRTABLE_BASE_ID;
  const apiKey = process.env.REACT_APP_AIRTABLE_API_KEY;
  const baseId = process.env.REACT_APP_AIRTABLE_BASE_ID;
  const tableName = 'Newsletter';

  const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: {
        Email: email,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit data to Airtable');
  }

  return response.json();
};

// Make component fully controlled by props
const NewsletterPopup = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const context = useContext(LanguageContext)
  
  if (!context) {
    return null // Return null if context is not available
  }

  const { language } = context

  // Translation object
  const translations = {
    en: {
      newsletter: {
        popup: {
          title: "Stay Updated",
          subtitle: "Subscribe to our newsletter for the latest updates and exclusive offers.",
          placeholder: "Enter your email",
          button: "Subscribe",
          success: "✓ Successfully subscribed!",
          error: "× Something went wrong. Please try again."
        }
      }
    },
    de: {
      newsletter: {
        popup: {
          title: "Bleib auf dem Laufenden",
          subtitle: "Abonniere unseren Newsletter für die neuesten Updates und exklusive Angebote.",
          placeholder: "E-Mail eingeben",
          button: "Abonnieren",
          success: "✓ Erfolgreich abonniert!",
          error: "× Etwas ist schiefgelaufen. Bitte versuche es erneut."
        }
      }
    }
  }

  const content = translations[language]?.newsletter?.popup || translations.de.newsletter.popup

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await submitToAirtable(email)
      setStatus(content.success)
      localStorage.setItem('newsletterSubscribed', 'true') // Mark as subscribed
      // Show success state for 2 seconds before closing
      setTimeout(() => {
        onClose() // Use the passed onClose handler
        // Reset status after closing animation might finish
        setTimeout(() => setStatus(''), 500); 
      }, 2000)
    } catch (error) {
      setStatus(content.error)
    }
  }

  return (
    <AnimatePresence>
      {/* Use the passed isOpen prop directly */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
            onClick={onClose} // Use the passed onClose handler
          />

          {/* Popup Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[101]">
            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-[90%] max-w-md bg-white rounded-xl shadow-2xl p-6 relative"
            >
              {/* Close button */}
              <button
                onClick={onClose} // Use the passed onClose handler
                className="absolute -top-3 -right-3 p-1.5 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors z-10"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>

              <div className="text-center">
                <h3 className="text-2xl font-medium mb-3">{content.title}</h3>
                <p className="text-gray-600 text-sm mb-6">
                  {content.subtitle}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={content.placeholder}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm 
                      focus:outline-none focus:ring-1 focus:ring-black
                      text-gray-900 placeholder:text-gray-500"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-2.5 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-900 transition-colors"
                  >
                    {content.button}
                  </button>
                </form>

                {status && (
                  <p className={`text-sm mt-4 ${
                    status.startsWith('✓') 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {status}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NewsletterPopup 