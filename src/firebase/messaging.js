import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { db, auth } from './config';
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc } from 'firebase/firestore';

const VAPID_KEY = 'BC9X8U5hWzbbGbbB8x_net_q4eG5RA798jZxKcOPS5e5joRHXN7XcCS2yv-UwCKY0lZZ59mOOspl_aSWEjSV33M';

let messaging;
try {
  messaging = getMessaging();
} catch (err) {
  console.error('Failed to initialize Firebase Messaging', err);
}

// Register the Firebase messaging service worker
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
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

// Initialize messaging - register service worker when module loads
export const initializeMessaging = async () => {
  try {
    await registerServiceWorker();
    console.log('Firebase messaging initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase messaging:', error);
  }
};

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  initializeMessaging();
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
  if (!messaging) {
    alert('Messaging is not supported in this browser.');
    return;
  }

  try {
    // Ensure service worker is registered (in case auto-init failed)
    await registerServiceWorker();
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // console.log('Notification permission granted.');

      const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (currentToken) {
        // console.log('FCM Token:', currentToken);
        
        // Get current user email if available
        const currentUser = auth.currentUser;
        const userEmail = currentUser?.email || null;
        
        // Remove any existing tokens for this user/device to avoid duplicates
        if (userEmail) {
          const tokensCollection = collection(db, 'fcmTokens');
          const existingTokensQuery = query(tokensCollection, where('email', '==', userEmail));
          const existingTokensSnapshot = await getDocs(existingTokensQuery);
          
          // Delete existing tokens for this user
          const deletePromises = existingTokensSnapshot.docs.map(doc => deleteDoc(doc.ref));
          await Promise.all(deletePromises);
        }
        
        // Store the new token with user email
        const tokensCollection = collection(db, 'fcmTokens');
        await addDoc(tokensCollection, {
          token: currentToken,
          email: userEmail,
          createdAt: serverTimestamp(),
        });
        
        alert('You have successfully subscribed to notifications!');
      } else {
        // console.log('No registration token available. Request permission to generate one.');
        alert('Could not get notification token. Please ensure you have granted permission.');
      }
    } else {
      // console.log('Unable to get permission to notify.');
      alert('You have denied notification permissions.');
    }
  } catch (error) {
    console.error('An error occurred while subscribing to notifications:', error);
    alert('An error occurred while subscribing. Please try again.');
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