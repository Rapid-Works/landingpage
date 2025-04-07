import { useEffect } from 'react';
import { X } from 'lucide-react';
import CountdownTimer from './CountdownTimer'; // We'll create this next
import WebinarForm from './WebinarForm'; // We'll create this next

const WebinarModal = ({ isOpen, onClose, webinarDates }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const nextWebinarDate = webinarDates[0]; // The soonest upcoming date

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose} // Close on overlay click
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50">
           <div>
             <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Join Our Free Biweekly Webinar!</h2>
             <p className="text-sm text-gray-600 mt-1">Get your startup questions answered live.</p>
           </div>
           <button
             onClick={onClose}
             className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
             aria-label="Close modal"
           >
             <X className="h-5 w-5" />
           </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 flex-grow overflow-y-auto">
          {/* Countdown */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Next Webinar Starts In:</h3>
            {nextWebinarDate && <CountdownTimer targetDate={nextWebinarDate} />}
            {!nextWebinarDate && <p className="text-lg font-semibold text-gray-700">Loading dates...</p>}
          </div>

          {/* Form */}
          <WebinarForm webinarDates={webinarDates} onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default WebinarModal; 