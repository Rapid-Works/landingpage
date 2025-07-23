import React, { useState } from 'react';
import { testBrandingKitNotification } from '../utils/airtableService';
import { useAuth } from '../contexts/AuthContext';
import { Send, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const BrandingKitTestNotifications = ({ className = "" }) => {
  const { currentUser } = useAuth();
  const [testState, setTestState] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = useState('');
  const [kitId, setKitId] = useState('test-kit-' + Date.now());

  const handleTest = async () => {
    if (!currentUser?.email) {
      setTestState('error');
      setMessage('Please log in to test notifications');
      return;
    }

    setTestState('loading');
    setMessage('');

    try {
      const result = await testBrandingKitNotification({
        kitId: kitId,
        email: currentUser.email
      });

      setTestState('success');
      setMessage(`✅ Test notification sent! Kit "${kitId}" marked as ready for ${currentUser.email}`);
      
      // Reset after 10 seconds
      setTimeout(() => {
        setTestState('idle');
        setMessage('');
      }, 10000);
      
    } catch (error) {
      setTestState('error');
      setMessage(`❌ Failed to send test notification: ${error.message}`);
      
      // Reset after 10 seconds
      setTimeout(() => {
        setTestState('idle');
        setMessage('');
      }, 10000);
    }
  };

  const getButtonContent = () => {
    switch (testState) {
      case 'loading':
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Sending...</span>
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="h-4 w-4" />
            <span>Sent!</span>
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="h-4 w-4" />
            <span>Try Again</span>
          </>
        );
      default:
        return (
          <>
            <Send className="h-4 w-4" />
            <span>Test Notification</span>
          </>
        );
    }
  };

  const getButtonStyles = () => {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2";
    
    switch (testState) {
      case 'loading':
        return `${baseStyles} bg-gray-500 text-white cursor-not-allowed`;
      case 'success':
        return `${baseStyles} bg-green-500 text-white hover:bg-green-600`;
      case 'error':
        return `${baseStyles} bg-red-500 text-white hover:bg-red-600`;
      default:
        return `${baseStyles} bg-blue-500 text-white hover:bg-blue-600`;
    }
  };

  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="h-5 w-5 text-yellow-600" />
        <h3 className="font-semibold text-yellow-800">Test Branding Kit Notifications</h3>
      </div>
      
      <p className="text-sm text-yellow-700 mb-4">
        This will create a test branding kit and trigger a notification to your device. 
        Make sure you've subscribed to notifications first!
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex-1">
          <input
            type="text"
            value={kitId}
            onChange={(e) => setKitId(e.target.value)}
            placeholder="Test Kit ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={testState === 'loading'}
          />
        </div>
        
        <button
          onClick={handleTest}
          disabled={testState === 'loading' || !kitId.trim()}
          className={getButtonStyles()}
        >
          {getButtonContent()}
        </button>
      </div>
      
      {message && (
        <div className={`mt-3 p-3 rounded-md text-sm ${
          testState === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : testState === 'error'
            ? 'bg-red-100 text-red-800 border border-red-200'
            : 'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          {message}
        </div>
      )}
      
      <div className="mt-3 text-xs text-yellow-600">
        <strong>Note:</strong> This is a development feature. Remove this component in production.
      </div>
    </div>
  );
};

export default BrandingKitTestNotifications; 