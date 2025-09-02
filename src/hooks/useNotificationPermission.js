import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { requestNotificationPermission } from '../firebase/messaging';

export const useNotificationPermission = () => {
  const [permissionStatus, setPermissionStatus] = useState('unknown'); // 'unknown', 'granted', 'denied', 'default'
  const [isLoading, setIsLoading] = useState(false);
  const [needsPWA, setNeedsPWA] = useState(false);
  const [hasTokens, setHasTokens] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    checkPermissionStatus();
  }, [currentUser]);

  const checkPermissionStatus = async () => {
    if (!currentUser) {
      setPermissionStatus('unknown');
      return;
    }

    // Check if Notification API is available
    if (typeof Notification === 'undefined') {
      setPermissionStatus('not_supported');
      return;
    }

    const permission = Notification.permission;
    setPermissionStatus(permission);

    // Check if mobile and needs PWA
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    setNeedsPWA(isMobile && !isStandalone);

    // If permission is granted, check if we have valid FCM tokens
    if (permission === 'granted') {
      await checkFCMTokens();
    }
  };

  const checkFCMTokens = async () => {
    if (!currentUser) return;

    try {
      const { db } = await import('../firebase/config');
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      
      const tokensQuery = query(
        collection(db, 'fcmTokens'),
        where('email', '==', currentUser.email)
      );
      const tokensSnapshot = await getDocs(tokensQuery);
      setHasTokens(tokensSnapshot.docs.length > 0);
    } catch (error) {
      console.error('Error checking FCM tokens:', error);
      setHasTokens(false);
    }
  };

  const requestPermission = async () => {
    setIsLoading(true);
    try {
      const result = await requestNotificationPermission();
      
      if (result.success) {
        setPermissionStatus('granted');
        setHasTokens(true);
        return { success: true, message: 'Notifications enabled successfully!' };
      } else if (result.requiresPWA) {
        setNeedsPWA(true);
        return { 
          success: false, 
          message: 'Please install the app to your home screen for notifications',
          requiresPWA: true 
        };
      } else {
        setPermissionStatus('denied');
        return { 
          success: false, 
          message: result.reason || 'Failed to enable notifications' 
        };
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return { 
        success: false, 
        message: 'Error enabling notifications: ' + error.message 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const shouldShowBanner = () => {
    if (!currentUser) return false;
    if (permissionStatus === 'not_supported') return false;
    if (permissionStatus === 'granted' && hasTokens) return false;
    
    // Show banner if permission is default, denied (with instructions), or granted but no tokens
    return ['default', 'denied'].includes(permissionStatus) || 
           (permissionStatus === 'granted' && !hasTokens);
  };

  return {
    permissionStatus,
    isLoading,
    needsPWA,
    hasTokens,
    shouldShowBanner: shouldShowBanner(),
    requestPermission,
    checkPermissionStatus,
    checkFCMTokens
  };
};
