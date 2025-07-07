// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js");

console.log('Firebase messaging service worker loaded');

// Initialize the Firebase app in the service worker by passing in
// the messagingSenderId.
// TODO: REPLACE WITH YOUR FIREBASE CONFIG
firebase.initializeApp({
  apiKey: 'AIzaSyDoIexsBB5I8ylX2t2N4fxVjVcsst71c5Y',
  authDomain: 'landingpage-606e9.firebaseapp.com',
  projectId: 'landingpage-606e9',
  storageBucket: 'landingpage-606e9.firebasestorage.app',
  messagingSenderId: '449487247565',
  appId: '1:449487247565:web:7bf02a5898cb57a13cb184'
});

console.log('Firebase initialized in service worker');

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

console.log('Firebase messaging instance created');

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Extract notification data
  const notificationTitle = payload.notification?.title || 'New Blog Post!';
  const notificationBody = payload.notification?.body || 'Check out our latest article.';
  
  console.log('Showing notification:', notificationTitle, notificationBody);
  
  // Customize notification here
  const notificationOptions = {
    body: notificationBody,
    icon: '/logo192.png',
    badge: '/logo192.png',
    tag: 'blog-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Read Now',
        icon: '/logo192.png'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ],
    data: {
      url: 'https://landingpage-606e9.web.app/blog'
    }
  };

  console.log('About to show notification with options:', notificationOptions);
  
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    console.log('Opening blog page');
    // Open the blog page
    event.waitUntil(
      clients.openWindow('https://landingpage-606e9.web.app/blog')
    );
  }
});

console.log('Service worker setup complete');

