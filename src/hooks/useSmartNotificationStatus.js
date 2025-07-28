import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

// DEVELOPMENT MODE: LocalStorage-only approach to avoid Firestore errors
export const useSmartNotificationStatus = () => {
  const { currentUser } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hasAnyNotificationsEnabled, setHasAnyNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      setIsSubscribed(false);
      setHasAnyNotificationsEnabled(false);
      setLoading(false);
      return;
    }
    
    checkSmartSubscriptionStatus();
  }, [currentUser, refreshTrigger]);

  const checkSmartSubscriptionStatus = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    
    // DEVELOPMENT: Simulate FCM token check with localStorage
    const mockFCMToken = localStorage.getItem(`fcmToken_${currentUser.email}`);
    const hasFCMTokens = !!mockFCMToken;
    
    // Check user notification preferences - try Firestore first, then localStorage
    let hasEnabledPreferences = true; // Default to enabled for first-time users
    
    try {
      // Try Firestore first (authoritative source, same as server functions)
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('../firebase/config');
      
      const docRef = doc(db, 'userNotificationPreferences', currentUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const preferences = docSnap.data().preferences;
        console.log('📊 Found Firestore preferences:', preferences);
        
        const blogEnabled = preferences.blogNotifications?.mobile || preferences.blogNotifications?.email;
        const brandingEnabled = preferences.brandingKitReady?.mobile || preferences.brandingKitReady?.email;
        hasEnabledPreferences = blogEnabled || brandingEnabled;
        
        console.log('🔔 Notification status check (Firestore):', {
          blogEnabled,
          brandingEnabled,
          hasEnabledPreferences,
          blogPrefs: preferences.blogNotifications,
          brandingPrefs: preferences.brandingKitReady
        });
        
        // Sync to localStorage for consistency
        localStorage.setItem(`notificationPreferences_${currentUser.uid}`, JSON.stringify(preferences));
      } else {
        // Fallback to localStorage
        const localPrefs = localStorage.getItem(`notificationPreferences_${currentUser.uid}`);
        if (localPrefs) {
          const preferences = JSON.parse(localPrefs);
          console.log('📱 No Firestore, using localStorage preferences:', preferences);
          
          const blogEnabled = preferences.blogNotifications?.mobile || preferences.blogNotifications?.email;
          const brandingEnabled = preferences.brandingKitReady?.mobile || preferences.brandingKitReady?.email;
          hasEnabledPreferences = blogEnabled || brandingEnabled;
          
          console.log('🔔 Notification status check (localStorage):', {
            blogEnabled,
            brandingEnabled,
            hasEnabledPreferences
          });
        } else {
          console.log('❌ No preferences found anywhere - defaulting to enabled (first time user)');
        }
      }
    } catch (error) {
      console.log('⚠️ Error loading preferences, using localStorage fallback:', error);
      // Final fallback to localStorage only  
      const localPrefs = localStorage.getItem(`notificationPreferences_${currentUser.uid}`);
      if (localPrefs) {
        try {
          const preferences = JSON.parse(localPrefs);
          console.log('📱 Error fallback - using localStorage preferences:', preferences);
          
          const blogEnabled = preferences.blogNotifications?.mobile || preferences.blogNotifications?.email;
          const brandingEnabled = preferences.brandingKitReady?.mobile || preferences.brandingKitReady?.email;
          hasEnabledPreferences = blogEnabled || brandingEnabled;
        } catch (parseError) {
          console.log('⚠️ Parse error, defaulting to enabled');
          hasEnabledPreferences = true;
        }
      }
    }
    
    setIsSubscribed(hasFCMTokens);
    setHasAnyNotificationsEnabled(hasFCMTokens && hasEnabledPreferences);
    setLoading(false);
  };

  const forceRefresh = () => {
    console.log('🔄 Forcing smart notification status refresh...');
    setRefreshTrigger(prev => prev + 1);
  };

  return { 
    isSubscribed, // FCM token exists
    hasAnyNotificationsEnabled, // FCM token exists AND preferences allow notifications
    loading, 
    checkSmartSubscriptionStatus,
    forceRefresh
  };
}; 