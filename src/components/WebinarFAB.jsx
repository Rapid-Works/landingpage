import { useState } from 'react';
import { Calendar } from 'lucide-react';
import WebinarModal from './WebinarModal'; // We'll create this next

const WebinarFAB = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate the next few webinar dates (biweekly starting April 25, 2025)
  // This is a simplified calculation; a robust solution would use a date library
  const getNextWebinarDates = () => {
    const dates = [];
    let currentDate = new Date('2025-04-25T10:00:00'); // Assuming 10:00 AM local time
    const now = new Date();

    // Find the first upcoming webinar date
    while (currentDate < now) {
      currentDate.setDate(currentDate.getDate() + 14);
    }

    // Add the next 3 upcoming dates
    for (let i = 0; i < 3; i++) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 14);
    }
    return dates;
  };

  const webinarDates = getNextWebinarDates();

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