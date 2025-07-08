// Scripts for firebase and firebase messaging
// Version: 1.3 - Using opengraphimage.jpg for notification icon
importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js");

// console.log('Firebase messaging service worker loaded');

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

// console.log('Firebase initialized in service worker');

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// console.log('Firebase messaging instance created');

messaging.onBackgroundMessage((payload) => {
  // console.log("[firebase-messaging-sw.js] Received background message ", payload);

  // The browser may already display the notification automatically from the F-A-P
  // but we are creating it manually here to control the click behavior.
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.webpush?.notification?.icon || "https://www.rapid-works.io/opengraphimage.jpg",
    badge: payload.webpush?.notification?.badge || "https://www.rapid-works.io/logo192.png",
    actions: payload.webpush?.notification?.actions,
    data: {
      url: payload.data.url, // Pass the URL from our data payload
    },
  };

  // console.log("[firebase-messaging-sw.js] Notification options:", notificationOptions);

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  const clickedUrl = event.notification.data.url;
  // console.log("Notification click received. URL:", clickedUrl);
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(clickedUrl)
  );
});

// console.log('Service worker setup complete');

