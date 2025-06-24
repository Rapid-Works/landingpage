import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Minus } from "lucide-react"
import { useState } from "react"

// Export FAQItem so it can be used in other components
export const FAQItem = ({ question, answer, isDark = false }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={isDark ? "py-4" : "py-6"}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left"
      >
        <h3 className={`text-lg font-medium pr-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {question}
        </h3>
        {isOpen ? (
          <Minus className={`w-6 h-6 flex-shrink-0 ${isDark ? 'text-white' : 'text-violet-500'}`} />
        ) : (
          <Plus className={`w-6 h-6 flex-shrink-0 ${isDark ? 'text-white' : 'text-violet-500'}`} />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p 
              className={`mt-3 font-light ${isDark ? 'text-white/90' : 'text-gray-600'}`}
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const FAQModal = ({ isOpen, onClose, faqItems }) => {
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
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[90vh]">
                <h2 className="text-3xl font-light mb-8 text-center">FAQ</h2>
                <div className="divide-y divide-gray-200">
                  {faqItems.map((item, index) => (
                    <FAQItem
                      key={index}
                      question={item.question}
                      answer={item.answer}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FAQModal 