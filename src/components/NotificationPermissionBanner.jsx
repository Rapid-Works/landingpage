import React, { useState, useEffect } from 'react';
import { X, Bell, Smartphone, Share } from 'lucide-react';
import { requestNotificationPermission } from '../firebase/messaging';
import { useAuth } from '../contexts/AuthContext';

const NotificationPermissionBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bannerType, setBannerType] = useState('permission'); // 'permission', 'pwa', 'success'
  const { currentUser } = useAuth();

  console.log('🔔 NotificationPermissionBanner rendered, isVisible:', isVisible);

  useEffect(() => {
    const checkAndSetStatus = async () => {
      await checkNotificationStatus();
      
      // TEMPORARY: Force show banner for testing (remove this after testing)
      if (currentUser) {
        console.log('🔔 FORCE SHOWING BANNER FOR TESTING');
        console.log('🔔 Setting isVisible to true...');
        setIsVisible(true);
        setBannerType('permission');
        console.log('🔔 Banner should now be visible');
      } else {
        console.log('🔔 No currentUser, cannot force show banner');
      }
    };
    
    checkAndSetStatus();
  }, [currentUser]);

  const checkNotificationStatus = async () => {
    console.log('🔔 NotificationPermissionBanner: Checking notification status');
    console.log('🔔 Current user:', currentUser ? currentUser.email : 'null');
    
    // Only show for logged in users
    if (!currentUser) {
      console.log('🔔 No current user, hiding banner');
      setIsVisible(false);
      return;
    }

    // Check if user has already dismissed the banner
    const dismissed = localStorage.getItem('notificationBannerDismissed');
    console.log('🔔 Banner dismissed status:', dismissed);
    if (dismissed === 'true') {
      console.log('🔔 Banner was dismissed, not showing');
      return;
    }

    // Check current notification permission status
    if (typeof Notification === 'undefined') {
      console.log('🔔 Notification API not supported');
      setIsVisible(false);
      return;
    }

    const permission = Notification.permission;
    console.log('🔔 Current notification permission:', permission);
    
    if (permission === 'granted') {
      console.log('🔔 Permission granted, checking FCM tokens...');
      // Permission already granted, check if we have FCM tokens
      try {
        const { db } = await import('../firebase/config');
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        
        const tokensQuery = query(
          collection(db, 'fcmTokens'),
          where('email', '==', currentUser.email)
        );
        const tokensSnapshot = await getDocs(tokensQuery);
        console.log('🔔 Found FCM tokens:', tokensSnapshot.docs.length);
        
        if (tokensSnapshot.docs.length === 0) {
          console.log('🔔 No FCM tokens found, showing permission banner');
          setBannerType('permission');
          setIsVisible(true);
        } else {
          console.log('🔔 User has FCM tokens, not showing banner');
        }
      } catch (error) {
        console.error('🔔 Error checking FCM tokens:', error);
        // Show banner if we can't check tokens
        setBannerType('permission');
        setIsVisible(true);
      }
      return;
    }

    if (permission === 'denied') {
      console.log('🔔 Permission denied, showing denied banner');
      setBannerType('denied');
      setIsVisible(true);
      return;
    }

    // Permission is 'default', check if mobile/PWA
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    console.log('🔔 Device info:', { isMobile, isStandalone, isIOS, permission });

    if (isMobile && !isStandalone) {
      console.log('🔔 Mobile browser detected, showing PWA banner');
      setBannerType('pwa');
      setIsVisible(true);
    } else {
      console.log('🔔 Desktop or PWA detected, showing permission banner');
      setBannerType('permission');
      setIsVisible(true);
    }
  };

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      const result = await requestNotificationPermission();
      
      if (result.success) {
        setBannerType('success');
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setIsVisible(false);
          localStorage.setItem('notificationBannerDismissed', 'true');
        }, 3000);
      } else if (result.requiresPWA) {
        setBannerType('pwa');
      } else {
        // Permission denied or other error
        setBannerType('denied');
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      setBannerType('denied');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('notificationBannerDismissed', 'true');
  };

  const renderBannerContent = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    switch (bannerType) {
      case 'permission':
        return (
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Bell className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                📱 Enable push notifications for chat messages
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Get instant notifications when you receive new task messages and updates
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleEnableNotifications}
                disabled={isLoading}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Enabling...' : 'Enable'}
              </button>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        );

      case 'pwa':
        return (
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Smartphone className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                📱 Install app for notifications
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {isIOS 
                  ? "Tap Share → Add to Home Screen, then open from home screen to enable notifications"
                  : "Install this app to receive push notifications for chat messages"
                }
              </p>
            </div>
            <div className="flex gap-2">
              {isMobile && (
                <div className="flex items-center gap-1 text-blue-600">
                  <Share className="h-4 w-4" />
                  <span className="text-xs font-medium">Add to Home</span>
                </div>
              )}
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        );

      case 'denied':
        return (
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Bell className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                🔕 Notifications blocked
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {isMobile 
                  ? "Enable notifications in your browser settings to receive chat messages"
                  : "Click the 🔒 icon in your address bar to enable notifications"
                }
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        );

      case 'success':
        return (
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Bell className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                ✅ Notifications enabled!
              </p>
              <p className="text-xs text-gray-600 mt-1">
                You'll now receive push notifications for chat messages and task updates
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed left-0 right-0 z-[60] bg-white border-b border-gray-200 shadow-sm" style={{ top: '70px' }}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        {renderBannerContent()}
      </div>
    </div>
  );
};

export default NotificationPermissionBanner;
