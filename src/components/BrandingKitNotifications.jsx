import React, { useState } from 'react';
import { Bell, BellRing, Check, X, Loader2 } from 'lucide-react';
import { requestNotificationPermission } from '../firebase/messaging';

const BrandingKitNotifications = ({ 
  className = "", 
  variant = "default" // "default", "compact", "dashboard"
}) => {
  const [notificationState, setNotificationState] = useState('default'); // 'default', 'loading', 'success', 'error'
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleSubscription = async () => {
    setNotificationState('loading');
    setNotificationMessage('');
    
    try {
      await requestNotificationPermission();
      setNotificationState('success');
      setNotificationMessage('🎉 Perfect! You\'ll get notified when your branding kits are ready.');
      
      // Reset to default after 5 seconds
      setTimeout(() => {
        setNotificationState('default');
        setNotificationMessage('');
      }, 5000);
    } catch (err) {
      setNotificationState('error');
      setNotificationMessage('Failed to subscribe. Please try again.');
      
      // Reset to default after 5 seconds
      setTimeout(() => {
        setNotificationState('default');
        setNotificationMessage('');
      }, 5000);
    }
  };

  const getButtonContent = () => {
    switch (notificationState) {
      case 'loading':
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Subscribing...</span>
          </>
        );
      case 'success':
        return (
          <>
            <Check className="h-4 w-4" />
            <span>Subscribed!</span>
          </>
        );
      case 'error':
        return (
          <>
            <X className="h-4 w-4" />
            <span>Try Again</span>
          </>
        );
      default:
        return (
          <>
            <BellRing className="h-4 w-4" />
            <span>Get Kit Notifications</span>
          </>
        );
    }
  };

  const getButtonStyles = () => {
    const baseStyles = "font-semibold py-2 px-4 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0";
    
    switch (notificationState) {
      case 'loading':
        return `${baseStyles} bg-gray-500 cursor-not-allowed text-white`;
      case 'success':
        return `${baseStyles} bg-green-500 hover:bg-green-600 text-white`;
      case 'error':
        return `${baseStyles} bg-red-500 hover:bg-red-600 text-white`;
      default:
        if (variant === "dashboard") {
          return `${baseStyles} bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white`;
        }
        return `${baseStyles} bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white`;
    }
  };

  if (variant === "compact") {
    return (
      <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 ${className}`}>
        <button 
          onClick={handleSubscription}
          disabled={notificationState === 'loading'}
          className={getButtonStyles()}
        >
          {getButtonContent()}
        </button>
        {notificationMessage && (
          <p className={`text-sm ${notificationState === 'success' ? 'text-green-600' : notificationState === 'error' ? 'text-red-600' : 'text-gray-600'}`}>
            {notificationMessage}
          </p>
        )}
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className={`bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 ${className}`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Bell className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Stay Updated on Your Kits
            </h3>
            <p className="text-gray-600 mb-4">
              Get instant notifications when your branding kits are ready for download. Never miss an update!
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button 
                onClick={handleSubscription}
                disabled={notificationState === 'loading'}
                className={getButtonStyles()}
              >
                {getButtonContent()}
              </button>
              {notificationMessage && (
                <p className={`text-sm ${notificationState === 'success' ? 'text-green-600' : notificationState === 'error' ? 'text-red-600' : 'text-gray-600'}`}>
                  {notificationMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <Bell className="h-6 w-6 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Branding Kit Notifications
        </h3>
      </div>
      <p className="text-gray-600 mb-4">
        Get notified when your branding kits are ready for download.
      </p>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <button 
          onClick={handleSubscription}
          disabled={notificationState === 'loading'}
          className={getButtonStyles()}
        >
          {getButtonContent()}
        </button>
        {notificationMessage && (
          <p className={`text-sm ${notificationState === 'success' ? 'text-green-600' : notificationState === 'error' ? 'text-red-600' : 'text-gray-600'}`}>
            {notificationMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default BrandingKitNotifications; 