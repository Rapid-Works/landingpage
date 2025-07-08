import { useState } from 'react';
import { ArrowRight, CheckCircle, Mail } from 'lucide-react';
import { submitWebinarRegistrationToAirtable, submitToAirtable } from '../utils/airtableService';

const WebinarForm = ({ webinarDates, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    questions: '',
    selectedDate: webinarDates.length > 0 ? webinarDates[0].toISOString() : '',
  });
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [submissionState, setSubmissionState] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setNewsletterOptIn(checked);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionState('submitting');
    setErrorMessage('');

    let webinarSuccess = false;

    try {
      const selectedDateObject = webinarDates.find(
        date => date.toISOString() === formData.selectedDate
      );
      const displayDateString = selectedDateObject ? formatDate(selectedDateObject) : 'N/A';

      // console.log('Submitting webinar registration:', {
      //    ...formData,
      //    selectedDateString: displayDateString
      //  });

      await submitWebinarRegistrationToAirtable({
        ...formData,
        selectedDate: formData.selectedDate,
        selectedDateString: displayDateString
      });
      // console.log('Webinar registration successful');
      webinarSuccess = true;

      if (newsletterOptIn) {
        //  console.log('Submitting email to newsletter list:', formData.email);
         await submitToAirtable({
           email: formData.email,
           service: "Newsletter (Opt-in via Webinar)",
           notes: `Opted-in during webinar registration for date: ${displayDateString}`
         });
        //  console.log('Newsletter submission successful');
         localStorage.setItem('newsletterSubscribed', 'true');
      }

      setSubmissionState('success');

    } catch (error) {
      console.error("Failed to submit registration:", error);
      if (webinarSuccess && newsletterOptIn) {
          setErrorMessage('Webinar registration successful, but failed to add to newsletter. Please try subscribing separately if needed.');
      } else {
          setErrorMessage('An error occurred during registration. Please check your details or try again later.');
      }
      setSubmissionState('error');
    }
  };

  const formatDate = (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short'
    };
    const mergedOptions = { ...defaultOptions, ...options };
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    return dateObject.toLocaleDateString(undefined, mergedOptions);
  };

  const SuccessView = () => (
    <div className="text-center py-8 px-4 flex flex-col items-center">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Registration Successful!</h3>
      <p className="text-gray-600 mb-4">
        Thank you for registering. We've reserved your spot for the webinar on:
      </p>
      <p className="font-medium text-gray-800 bg-gray-100 px-3 py-1 rounded">
        {formatDate(formData.selectedDate)}
      </p>
       {newsletterOptIn && (
         <p className="text-sm text-gray-500 mt-2">You've also been subscribed to our newsletter.</p>
       )}
       <button
         onClick={onClose}
         className="mt-6 px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
       >
         Close
       </button>
    </div>
  );

  if (submissionState === 'success') {
    return <SuccessView />;
  }

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
          disabled={submissionState === 'submitting'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm disabled:bg-gray-50"
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
          disabled={submissionState === 'submitting'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm disabled:bg-gray-50"
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
          disabled={submissionState === 'submitting'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm disabled:bg-gray-50"
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
          disabled={submissionState === 'submitting'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm disabled:bg-gray-50"
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
          disabled={submissionState === 'submitting'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm disabled:bg-gray-50"
          placeholder="What topics or specific questions would you like us to cover?"
        ></textarea>
      </div>

      <div className="relative flex items-start">
        <div className="flex items-center h-5">
          <input
            id="newsletterOptIn"
            name="newsletterOptIn"
            type="checkbox"
            checked={newsletterOptIn}
            onChange={handleInputChange}
            disabled={submissionState === 'submitting'}
            className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300 rounded disabled:opacity-50"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="newsletterOptIn" className="font-medium text-gray-700 select-none">
            Subscribe to Newsletter
          </label>
          <p className="text-gray-500">Receive updates and news from RapidWorks.</p>
        </div>
      </div>

       {submissionState === 'error' && errorMessage && (
         <p className="text-sm text-center text-red-600">
           {errorMessage}
         </p>
       )}

      <button
        type="submit"
        disabled={submissionState === 'submitting'}
        className="w-full flex justify-center items-center gap-2 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
      >
        {submissionState === 'submitting' ? 'Submitting...' : 'Register Now'}
        {submissionState !== 'submitting' && <ArrowRight className="h-5 w-5" />}
      </button>
    </form>
  );
};

export default WebinarForm; 