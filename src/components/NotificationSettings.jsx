import React, { useState, useEffect } from 'react';
import { Bell, BellOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import customerNotificationService from '../utils/customerNotificationService';

const NotificationSettings = ({ className = '' }) => {
  const { currentUser } = useAuth();
  const [notificationStatus, setNotificationStatus] = useState('checking');
  const [isTestingNotification, setIsTestingNotification] = useState(false);
  const [lastTestResult, setLastTestResult] = useState(null);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    if (!('Notification' in window)) {
      setNotificationStatus('unsupported');
      return;
    }

    const permission = Notification.permission;
    setNotificationStatus(permission);
  };

  const handleEnableNotifications = async () => {
    setIsTestingNotification(true);
    try {
      const result = await customerNotificationService.ensureNotificationsEnabled();
      
      if (result.enabled) {
        setNotificationStatus('granted');
        setLastTestResult({ success: true, message: 'Notifications enabled successfully!' });
        
        // Send a test notification
        setTimeout(async () => {
          const testResult = await customerNotificationService.sendTestNotification(currentUser.email);
          setLastTestResult(testResult);
        }, 1000);
      } else {
        setLastTestResult({ success: false, message: result.reason });
      }
    } catch (error) {
      setLastTestResult({ success: false, message: error.message });
    } finally {
      setIsTestingNotification(false);
    }
  };

  const handleTestNotification = async () => {
    if (!currentUser?.email) {
      setLastTestResult({ success: false, message: 'Please log in to test notifications' });
      return;
    }

    setIsTestingNotification(true);
    try {
      const result = await customerNotificationService.sendTestNotification(currentUser.email);
      setLastTestResult(result);
    } catch (error) {
      setLastTestResult({ success: false, message: error.message });
    } finally {
      setIsTestingNotification(false);
    }
  };

  const getStatusInfo = () => {
    switch (notificationStatus) {
      case 'granted':
        return {
          icon: <Bell className="h-5 w-5 text-green-600" />,
          title: 'Notifications Enabled',
          description: 'You\'ll receive push notifications for task updates',
          actionButton: (
            <button
              onClick={handleTestNotification}
              disabled={isTestingNotification}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isTestingNotification ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                  Testing...
                </>
              ) : (
                'Send Test Notification'
              )}
            </button>
          )
        };
      case 'denied':
        return {
          icon: <BellOff className="h-5 w-5 text-red-600" />,
          title: 'Notifications Blocked',
          description: 'Enable notifications in your browser settings to receive task updates',
          actionButton: (
            <button
              onClick={() => {
                alert('To enable notifications:\\n\\n1. Click the lock icon in your address bar\\n2. Set notifications to \"Allow\"\\n3. Refresh this page');
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Show Instructions
            </button>
          )
        };
      case 'default':
        return {
          icon: <Bell className="h-5 w-5 text-yellow-600" />,
          title: 'Enable Notifications',
          description: 'Get notified when your tasks receive updates or estimates',
          actionButton: (
            <button
              onClick={handleEnableNotifications}
              disabled={isTestingNotification}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isTestingNotification ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                  Enabling...
                </>
              ) : (
                'Enable Notifications'
              )}
            </button>
          )
        };
      case 'unsupported':
        return {
          icon: <BellOff className="h-5 w-5 text-gray-600" />,
          title: 'Notifications Not Supported',
          description: 'Your browser doesn\'t support push notifications',
          actionButton: null
        };
      default:
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin text-gray-600" />,
          title: 'Checking...',
          description: 'Checking notification status',
          actionButton: null
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          {statusInfo.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {statusInfo.title}
          </h3>
          <p className="text-gray-600 mb-4">
            {statusInfo.description}
          </p>
          
          {statusInfo.actionButton && (
            <div className="mb-4">
              {statusInfo.actionButton}
            </div>
          )}

          {lastTestResult && (
            <div className={`p-3 rounded-lg flex items-start gap-2 ${
              lastTestResult.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              {lastTestResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`text-sm font-medium ${
                  lastTestResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {lastTestResult.success ? 'Success!' : 'Error'}
                </p>
                <p className={`text-sm ${
                  lastTestResult.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {lastTestResult.message || lastTestResult.reason}
                </p>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 mt-4">
            <p>💡 <strong>What you'll be notified about:</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Task submission confirmations</li>
              <li>Expert messages and updates</li>
              <li>Price estimates and quotes</li>
              <li>Task completion notifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
