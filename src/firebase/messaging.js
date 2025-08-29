import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { db, auth, messaging } from './config';
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, updateDoc, doc as firestoreDoc } from 'firebase/firestore';

const VAPID_KEY = 'BC9X8U5hWzbbGbbB8x_net_q4eG5RA798jZxKcOPS5e5joRHXN7XcCS2yv-UwCKY0lZZ59mOOspl_aSWEjSV33M';

// Register the Firebase messaging service worker
const registerServiceWorker = async () => {
  // Check if we're on iOS Safari browser (not PWA)
  const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  
  if (isiOS && !isStandalone) {
    throw new Error('Service Worker registration skipped on iOS Safari browser');
  }
  
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      // Take control of existing clients asap
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'PING' });
      }
      console.log('Firebase messaging service worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Firebase messaging service worker registration failed:', error);
      throw error;
    }
  } else {
    throw new Error('Service Worker not supported');
  }
};

// Ensure a token document exists (upsert) without removing other device tokens
const upsertFcmToken = async (token, userEmail, metadata = {}) => {
  const tokensCollection = collection(db, 'fcmTokens');
  // See if this exact token already exists
  const existingByToken = await getDocs(query(tokensCollection, where('token', '==', token)));
  if (!existingByToken.empty) {
    // Update email/lastUsed if needed
    const tokenDoc = existingByToken.docs[0];
    try {
      await updateDoc(tokenDoc.ref, {
        email: userEmail || tokenDoc.data().email || null,
        lastUsed: serverTimestamp(),
        userAgent: navigator.userAgent,
        ...metadata
      });
    } catch (e) {
      // non-fatal
    }
    return tokenDoc.id;
  }

  // If not existing, create new
  const created = await addDoc(tokensCollection, {
    token,
    email: userEmail || null,
    createdAt: serverTimestamp(),
    lastUsed: serverTimestamp(),
    userAgent: navigator.userAgent,
    ...metadata
  });
  return created.id;
};

// Initialize messaging - register service worker when module loads
export const initializeMessaging = async () => {
  try {
    await registerServiceWorker();
    console.log('Firebase messaging initialized successfully');

    // Silent token ensure if permission already granted (no extra prompt)
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted' && messaging) {
      try {
        const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (currentToken) {
          const currentUser = auth.currentUser;
          const userEmail = currentUser?.email || null;
          await upsertFcmToken(currentToken, userEmail, {
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
          });
        }
      } catch (e) {
        // ignore; will retry on explicit enable
      }
    }
  } catch (error) {
    console.error('Failed to initialize Firebase messaging:', error);
  }
};

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  // Wait for window load to avoid race conditions with CRA assets
  if (document.readyState === 'complete') {
    initializeMessaging();
  } else {
    window.addEventListener('load', () => initializeMessaging());
  }
}

// Function to unregister problematic service workers (but keep Firebase messaging)
export const unregisterServiceWorkers = async () => {
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      // Only unregister service workers that are NOT the Firebase messaging worker
      if (registration.scope.includes('firebase-cloud-messaging-push-scope') || 
          registration.scope.includes('firebase-messaging-sw.js')) {
        // console.log('Keeping Firebase messaging service worker:', registration.scope);
        continue; // Skip unregistering this one
      }
      
      await registration.unregister();
      // console.log('Service worker unregistered:', registration.scope);
    }
  } catch (error) {
    console.error('Error managing service workers: ', error);
  }
};

export const requestNotificationPermission = async () => {
  // Enhanced mobile browser detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  const isInAppBrowser = /FBAN|FBAV|Instagram|Twitter|LinkedIn|WhatsApp/i.test(navigator.userAgent);
  
  // Block FCM requests on mobile browsers (not PWA) to prevent white screens
  if (isMobile && !isStandalone) {
    return {
      success: false,
      reason: isInAppBrowser 
        ? 'Push notifications are not supported in in-app browsers. Please open in your device browser and add to home screen.'
        : 'Push notifications require installing the app to your home screen. Tap Share → Add to Home Screen.',
      token: null,
      notSupported: true,
      requiresPWA: true
    };
  }
  
  // Check if Notification API is available
  if (typeof Notification === 'undefined') {
    return {
      success: false,
      reason: 'Notification API is not supported in this browser (common on mobile).',
      token: null,
      notSupported: true
    };
  }

  if (!messaging) {
    return {
      success: false,
      reason: 'Firebase Messaging is not supported in this browser.',
      token: null,
      notSupported: true
    };
  }

  try {
    // Ensure service worker is registered (in case auto-init failed)
    await registerServiceWorker();
    
    // Mobile-specific permission handling
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    // For iOS, check if running as PWA
    if (isIOS) {
      const isPWA = window.matchMedia('(display-mode: standalone)').matches;
      if (!isPWA) {
        console.warn('iOS detected but not running as PWA - notifications may be limited');
        return {
          success: false,
          reason: 'iOS requires PWA installation for reliable notifications. Please add to home screen.',
          token: null,
          requiresPWA: true
        };
      }
    }
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');

      const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (currentToken) {
        console.log('FCM Token:', currentToken);
        
        // Get current user email if available
        const currentUser = auth.currentUser;
        const userEmail = currentUser?.email || null;
        
        // Upsert token without deleting other device tokens
        await upsertFcmToken(currentToken, userEmail, {
          isMobile: isMobile,
          isIOS: isIOS
        });
        
        // Initialize notification preferences for this user if they don't exist
        if (userEmail && currentUser) {
          try {
            const { doc, getDoc, setDoc } = await import('firebase/firestore');
            const preferencesRef = doc(db, 'userNotificationPreferences', currentUser.uid);
            const preferencesSnap = await getDoc(preferencesRef);
            
            if (!preferencesSnap.exists()) {
              console.log('🔧 Initializing notification preferences for user');
              // Set default preferences with all notifications enabled
              await setDoc(preferencesRef, {
                preferences: {
                  blogNotifications: {
                    mobile: true,
                    email: true
                  },
                  brandingKitReady: {
                    mobile: true,
                    email: true
                  },
                  taskMessages: {
                    mobile: true,
                    email: true
                  }
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
              });
              console.log('✅ Notification preferences initialized');
            } else {
              // Update existing preferences to ensure taskMessages is enabled
              const existingPrefs = preferencesSnap.data().preferences || {};
              if (!existingPrefs.taskMessages) {
                console.log('🔧 Adding task message preferences to existing user');
                await setDoc(preferencesRef, {
                  preferences: {
                    ...existingPrefs,
                    taskMessages: {
                      mobile: true,
                      email: true
                    }
                  },
                  updatedAt: serverTimestamp()
                }, { merge: true });
                console.log('✅ Task message preferences added');
              }
            }
          } catch (prefError) {
            console.error('Error setting up notification preferences:', prefError);
            // Don't fail the main notification setup if preferences fail
          }
        }
        
        // Send test notification for mobile devices
        if (isMobile) {
          try {
            const testNotif = new Notification('📱 Mobile Notifications Enabled!', {
              body: 'You will now receive push notifications on this device.',
              icon: '/logo192.png',
              badge: '/logo192.png',
              requireInteraction: false,
              silent: false,
              vibrate: [200, 100, 200] // Mobile vibration
            });
            
            setTimeout(() => testNotif.close(), 4000);
          } catch (testError) {
            console.log('Test notification failed (non-critical):', testError);
          }
        }
        
        return {
          success: true,
          reason: isMobile ? 'Mobile notifications enabled successfully!' : 'Notifications enabled successfully!',
          token: currentToken,
          isMobile: isMobile
        };
      } else {
        console.log('No registration token available. Request permission to generate one.');
        return {
          success: false,
          reason: 'Could not get notification token. Please ensure you have granted permission.',
          token: null
        };
      }
    } else {
      console.log('Unable to get permission to notify.');
      return {
        success: false,
        reason: permission === 'denied' ? 
          'Notification permission denied. Please enable in browser settings.' :
          'Notification permission not granted.',
        token: null
      };
    }
  } catch (error) {
    console.error('An error occurred while subscribing to notifications:', error);
    return {
      success: false,
      reason: `An error occurred while subscribing: ${error.message}`,
      token: null
    };
  }
};

export const onForegroundMessage = (callback) => {
  if (messaging) {
    onMessage(messaging, (payload) => {
      // console.log('Message received in foreground: ', payload);
      callback(payload);
    });
  }
};

// Add iOS-specific token refresh monitoring
export const monitorTokenRefresh = (onTokenUpdate) => {
  if (!messaging) return;
  
  // Listen for token refresh (iOS Safari PWA issue)
  messaging.onTokenRefresh && messaging.onTokenRefresh(async () => {
    try {
      console.log('🔄 FCM Token refreshed (iOS Safari PWA)');
      const newToken = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (newToken && onTokenUpdate) {
        console.log('📱 Updating server with new iOS token:', newToken);
        onTokenUpdate(newToken);
      }
    } catch (error) {
      console.error('Failed to get refreshed token:', error);
    }
  });
}; 

