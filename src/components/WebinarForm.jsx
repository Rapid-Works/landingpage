import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const WebinarForm = ({ webinarDates, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    questions: '',
    selectedDate: webinarDates.length > 0 ? webinarDates[0].toISOString() : '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // --- Placeholder for actual submission logic ---
    console.log('Submitting webinar registration:', formData);
    // Replace with your API call (e.g., fetch to your backend, Airtable, etc.)
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    // --- End Placeholder ---

    setIsSubmitting(false);
    // Example success handling:
    setSubmitMessage('Thank you for registering! We look forward to seeing you.');
    // Optionally reset form or close modal after a delay
    setTimeout(() => {
       onClose();
       setSubmitMessage(''); // Reset message for next time
       setFormData({ // Reset form fields
         name: '',
         email: '',
         phone: '',
         questions: '',
         selectedDate: webinarDates.length > 0 ? webinarDates[0].toISOString() : '',
       });
    }, 3000);

    // Example error handling:
    // setSubmitMessage('An error occurred. Please try again.');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="selectedDate" className="block text-sm font-medium text-gray-700 mb-1">
          Choose Webinar Date <span className="text-red-600">*</span>
        </label>
        <select
          id="selectedDate"
          name="selectedDate"
          value={formData.selectedDate}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
        >
          {webinarDates.map((date) => (
            <option key={date.toISOString()} value={date.toISOString()}>
              {formatDate(date)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-600">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number (Optional)
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="questions" className="block text-sm font-medium text-gray-700 mb-1">
          Your Questions for the Webinar (Optional)
        </label>
        <textarea
          id="questions"
          name="questions"
          rows="3"
          value={formData.questions}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
          placeholder="What topics or specific questions would you like us to cover?"
        ></textarea>
      </div>

       {submitMessage && (
         <p className={`text-sm text-center ${submitMessage.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
           {submitMessage}
         </p>
       )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center items-center gap-2 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
      >
        {isSubmitting ? 'Submitting...' : 'Register Now'}
        {!isSubmitting && <ArrowRight className="h-5 w-5" />}
      </button>
    </form>
  );
};

export default WebinarForm; 