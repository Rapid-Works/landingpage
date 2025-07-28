// Scripts for firebase and firebase messaging
// Version: 1.4 - Added branding kit ready notifications
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
  
  // Customize notification based on type
  let notificationOptions = {
    body: payload.notification.body,
    icon: payload.webpush?.notification?.icon || "https://www.rapid-works.io/opengraphimage.png",
    badge: payload.webpush?.notification?.badge || "https://www.rapid-works.io/logo192.png",
    actions: payload.webpush?.notification?.actions,
    data: {
      url: payload.data.url || "/blog", // Default fallback
      type: payload.data.type || "general",
      kitId: payload.data.kitId || null
    },
  };
  
  // Special handling for branding kit notifications
  if (payload.data.type === "branding_kit_ready") {
    notificationOptions.icon = "https://www.rapid-works.io/opengraphimage.png";
    notificationOptions.badge = "https://www.rapid-works.io/logo192.png";
    notificationOptions.requireInteraction = true; // Keep notification visible until clicked
    notificationOptions.actions = [
      {
        action: 'view',
        title: 'View Kit'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ];
  }

  // console.log("[firebase-messaging-sw.js] Notification options:", notificationOptions);

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  const clickedUrl = event.notification.data.url;
  const notificationType = event.notification.data.type;
  const kitId = event.notification.data.kitId;
  
  // console.log("Notification click received. URL:", clickedUrl, "Type:", notificationType);
  
  event.notification.close();
  
  // Handle different actions for branding kit notifications
  if (notificationType === "branding_kit_ready") {
    if (event.action === 'dismiss') {
      // Just close the notification
      return;
    }
    
    // For branding kit notifications, always go to dashboard
    event.waitUntil(
      clients.openWindow("/dashboard")
    );
  } else {
    // Default behavior for other notifications
  event.waitUntil(
    clients.openWindow(clickedUrl)
  );
  }
});

// console.log('Service worker setup complete');

