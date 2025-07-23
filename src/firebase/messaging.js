import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { db, auth } from './config';
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';

const VAPID_KEY = 'BC9X8U5hWzbbGbbB8x_net_q4eG5RA798jZxKcOPS5e5joRHXN7XcCS2yv-UwCKY0lZZ59mOOspl_aSWEjSV33M';

let messaging;
try {
  messaging = getMessaging();
} catch (err) {
  console.error('Failed to initialize Firebase Messaging', err);
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
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // console.log('Notification permission granted.');

      const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (currentToken) {
        // console.log('FCM Token:', currentToken);
        
        // Get current user email if available
        const currentUser = auth.currentUser;
        const userEmail = currentUser?.email || null;
        
        // Check if this exact token already exists
        const tokensCollection = collection(db, 'fcmTokens');
        const existingTokenQuery = query(tokensCollection, where('token', '==', currentToken));
        const existingTokenSnapshot = await getDocs(existingTokenQuery);
        
        if (existingTokenSnapshot.empty) {
          // Token doesn't exist, create new one
          await addDoc(tokensCollection, {
            token: currentToken,
            email: userEmail,
            createdAt: serverTimestamp(),
            deviceType: 'web',
          });
        } else {
          // Token exists, update it with email if user is now logged in
          const existingDoc = existingTokenSnapshot.docs[0];
          const existingData = existingDoc.data();
          
          if (!existingData.email && userEmail) {
            // Update existing token with email since user is now logged in
            await updateDoc(existingDoc.ref, {
              email: userEmail,
              updatedAt: serverTimestamp(),
            });
          }
        }
        
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

// Specific function for branding kit notifications (requires authentication)
export const requestBrandingKitNotifications = async () => {
  if (!messaging) {
    throw new Error('Messaging is not supported in this browser.');
  }

  // Check if user is authenticated
  const currentUser = auth.currentUser;
  if (!currentUser?.email) {
    throw new Error('You must be logged in to subscribe to branding kit notifications.');
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission was denied.');
    }

    const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (!currentToken) {
      throw new Error('Could not get notification token. Please ensure you have granted permission.');
    }

    const tokensCollection = collection(db, 'fcmTokens');
    
    // Check if this exact token already exists
    const existingTokenQuery = query(tokensCollection, where('token', '==', currentToken));
    const existingTokenSnapshot = await getDocs(existingTokenQuery);
    
    if (existingTokenSnapshot.empty) {
      // Token doesn't exist, create new one with email
      await addDoc(tokensCollection, {
        token: currentToken,
        email: currentUser.email,
        createdAt: serverTimestamp(),
        deviceType: 'web',
        subscriptionType: 'branding_kit', // Mark as branding kit subscription
      });
    } else {
      // Token exists, ensure it has the user's email
      const existingDoc = existingTokenSnapshot.docs[0];
      await updateDoc(existingDoc.ref, {
        email: currentUser.email,
        updatedAt: serverTimestamp(),
        subscriptionType: 'both', // Both blog and branding kit
      });
    }

    return { success: true, message: 'Successfully subscribed to branding kit notifications!' };
  } catch (error) {
    console.error('Error subscribing to branding kit notifications:', error);
    throw error;
  }
}; 