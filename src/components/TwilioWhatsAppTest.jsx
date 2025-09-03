import React, { useState } from 'react';
import { Send, MessageCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/config';

const TwilioWhatsAppTest = ({ currentUser, currentContext }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Using secure Firebase Function instead of environment variables

  const formatPhoneNumber = (number) => {
    // Remove all non-digit characters
    const cleaned = number.replace(/\D/g, '');
    
    // Add + if not present and ensure it's a valid international format
    if (cleaned.startsWith('233')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('0')) {
      // Convert local Ghana format (0xxx) to international (+233xxx)
      return `+233${cleaned.substring(1)}`;
    } else if (!cleaned.startsWith('+')) {
      return `+${cleaned}`;
    }
    
    return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
  };

  const sendWhatsAppMessage = async () => {
    if (!phoneNumber.trim()) {
      setStatus({ type: 'error', message: 'Please enter a phone number' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Prepare data for Firebase Function
      const username = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
      const orgName = currentContext?.type === 'organization' ? currentContext.organization?.name : 'your personal account';
      
      // Call Firebase Function instead of direct Twilio API
      const sendTwilioWhatsApp = httpsCallable(functions, 'sendTwilioWhatsApp');
      const result = await sendTwilioWhatsApp({
        phoneNumber: phoneNumber,
        userName: username,
        orgName: orgName
      });

      if (result.data.success) {
        setStatus({ 
          type: 'success', 
          message: `WhatsApp message sent successfully! Message SID: ${result.data.messageSid}` 
        });
        setPhoneNumber(''); // Clear the input
      } else {
        setStatus({ 
          type: 'error', 
          message: result.data.message || 'Failed to send message' 
        });
      }
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      setStatus({ 
        type: 'error', 
        message: `Failed to send message: ${error.message}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      sendWhatsAppMessage();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Twilio WhatsApp Test</h2>
            <p className="text-sm text-gray-600">Send a test WhatsApp message using Twilio API</p>
          </div>
        </div>

        {/* Status Message */}
        {status.message && (
          <div className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
            status.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {status.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                status.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {status.message}
              </p>
            </div>
          </div>
        )}

        {/* Phone Number Input */}
        <div className="space-y-4">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="+233501311059"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          <button
            onClick={sendWhatsAppMessage}
            disabled={isLoading || !phoneNumber.trim()}
            className="w-full bg-[#7C3BEC] hover:bg-[#6B32D6] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send WhatsApp Message
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwilioWhatsAppTest;
