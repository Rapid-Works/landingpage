import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { db } from './config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
        console.log('Keeping Firebase messaging service worker:', registration.scope);
        continue; // Skip unregistering this one
      }
      
      await registration.unregister();
      console.log('Service worker unregistered:', registration.scope);
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
      console.log('Notification permission granted.');

      const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (currentToken) {
        console.log('FCM Token:', currentToken);
        const tokensCollection = collection(db, 'fcmTokens');
        await addDoc(tokensCollection, {
          token: currentToken,
          createdAt: serverTimestamp(),
        });
        alert('You have successfully subscribed to notifications!');
      } else {
        console.log('No registration token available. Request permission to generate one.');
        alert('Could not get notification token. Please ensure you have granted permission.');
      }
    } else {
      console.log('Unable to get permission to notify.');
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
      console.log('Message received in foreground: ', payload);
      callback(payload);
    });
  }
}; 