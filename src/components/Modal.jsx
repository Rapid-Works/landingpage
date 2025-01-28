import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

const Modal = ({ isOpen, onClose }) => {
  const formUrl = "https://forms.office.com/pages/responsepage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAMAANEznbRUMkVHMFpWTTVaTjREWlc4Wk5WOEdNOFhMTi4u&embed=true"

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[101]">
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-[95%] max-w-4xl h-[90vh] md:h-[80vh] bg-white rounded-2xl shadow-2xl relative overflow-hidden"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>

              {/* Modal content with embedded form */}
              <div className="w-full h-full pt-4">
                <iframe
                  src={formUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  className="border-0"
                  title="Microsoft Form"
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Modal 