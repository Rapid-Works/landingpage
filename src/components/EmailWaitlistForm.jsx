import React, { useState } from 'react';
import { Check, Mail } from 'lucide-react';

const EmailWaitlistForm = ({ 
  buttonText = "Join the Waitlist", 
  successText = "You're on the List!",
  successDescription = "Thank you for your interest. We'll notify you when we launch.",
  checkboxText = "I agree to receive updates",
  checkboxDescription = "We'll never share your email with anyone else.",
  primaryColor = "indigo", 
  onSubmit,
  additionalFields = null,
  selectedItem = null
}) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const colorClasses = {
    indigo: {
      button: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
      focus: "focus:ring-indigo-500 focus:border-indigo-500",
      text: "text-indigo-600 hover:text-indigo-700",
      checkbox: "text-indigo-600 focus:ring-indigo-500"
    },
    amber: {
      button: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 focus:ring-amber-500",
      focus: "focus:ring-amber-500 focus:border-amber-500",
      text: "text-amber-600 hover:text-amber-700",
      checkbox: "text-amber-600 focus:ring-amber-500"
    }
  };
  
  const colorClass = colorClasses[primaryColor] || colorClasses.indigo;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Call the parent's onSubmit if provided
    if (onSubmit) {
      onSubmit(email, selectedItem);
    }
    
    setSubmitted(true);
    setError('');
  };

  const resetForm = () => {
    setSubmitted(false);
    setEmail('');
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Join the Waitlist</h2>
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  className={`block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 ${colorClass.focus}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
            
            {/* Render additional fields if provided */}
            {additionalFields}
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className={`h-4 w-4 ${colorClass.checkbox} border-gray-300 rounded`}
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  {checkboxText}
                </label>
                <p className="text-gray-500">{checkboxDescription}</p>
              </div>
            </div>
            
            <button
              type="submit"
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white ${colorClass.button} focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              {buttonText}
            </button>
          </form>
        ) : (
          <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{successText}</h3>
            <p className="text-gray-600 mb-4">
              {successDescription}
            </p>
            <button
              onClick={resetForm}
              className={`font-medium ${colorClass.text}`}
            >
              Sign up with another email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailWaitlistForm; 