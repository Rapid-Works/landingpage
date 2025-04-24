import { useState } from 'react';
import { Calendar } from 'lucide-react';
import WebinarModal from './WebinarModal';
import { getNextWebinarDates } from '../utils/dateUtils';

const WebinarFAB = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Call the imported function, requesting only 1 date now
  const webinarDates = getNextWebinarDates(1);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 animate-pulse hover:animate-none"
        aria-label="Open free biweekly webinar registration"
      >
        <Calendar className="h-5 w-5" />
        <span className="text-sm font-semibold hidden sm:inline">Free Biweekly Webinar!</span>
        <span className="text-sm font-semibold sm:hidden">Webinar</span>
      </button>

      <WebinarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        webinarDates={webinarDates}
      />
    </>
  );
};

export default WebinarFAB; 