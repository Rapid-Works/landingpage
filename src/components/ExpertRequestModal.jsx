import React, { useState } from 'react';
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Input } from './ui/input'; // Assuming you have shadcn/ui input
import { submitExpertRequestToAirtable } from '../utils/airtableService';

const ExpertRequestModal = ({ isOpen, onClose, expertType }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    try {
      await submitExpertRequestToAirtable({ email, expertType });
      setStatus('success');
      setEmail(''); // Clear email on success
      // Optionally close modal after a delay
      setTimeout(() => {
         onClose();
         setStatus('idle'); // Reset status when modal closes
      }, 2000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message || 'Failed to submit request. Please try again.');
      console.error("Submission failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative transform transition-all duration-300 ease-out scale-100">
        <button
          onClick={() => { onClose(); setStatus('idle'); setEmail(''); }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-2 text-gray-900">Request Expert Access</h2>
        <p className="text-gray-600 mb-6">
          Enter your email to be notified when our <strong className="text-purple-700">{expertType}</strong> becomes available.
        </p>

        {status === 'success' ? (
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-800">Thank You!</p>
            <p className="text-gray-600">We've received your request and will notify you.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Your Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={status === 'loading'}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expert Needed
              </label>
              <Input
                type="text"
                value={expertType}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            {status === 'error' && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className={`w-full inline-flex justify-center items-center px-6 py-3 text-base font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-150 ${
                status === 'loading'
                  ? 'bg-purple-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
              }`}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Submitting...
                </>
              ) : (
                'Notify Me'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ExpertRequestModal; 