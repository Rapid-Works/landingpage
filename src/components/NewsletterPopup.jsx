import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useState, useEffect } from "react"

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    // First check if user has already subscribed
    const isSubscribed = localStorage.getItem('newsletterSubscribed') === 'true'
    if (isSubscribed) return // Don't show if already subscribed

    // Check if we've shown the popup recently
    const lastShown = localStorage.getItem('newsletterLastShown')
    const oneDayInMs = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    
    if (!lastShown || Date.now() - parseInt(lastShown) > oneDayInMs) {
      const timer = setTimeout(() => {
        setIsOpen(true)
        // Store the current timestamp
        localStorage.setItem('newsletterLastShown', Date.now().toString())
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle newsletter signup logic here
    console.log('Newsletter signup:', email)
    // After successful signup, prevent popup from showing again
    localStorage.setItem('newsletterSubscribed', 'true')
    setIsOpen(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
            onClick={() => setIsOpen(false)}
          />

          {/* Popup Container - Added flex container for better centering */}
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
                onClick={() => setIsOpen(false)}
                className="absolute -top-3 -right-3 p-1.5 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors z-10"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>

              <div className="text-center">
                <h3 className="text-2xl font-medium mb-3">Stay Updated</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Subscribe to our newsletter for the latest updates and exclusive offers.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-2.5 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-900 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NewsletterPopup 