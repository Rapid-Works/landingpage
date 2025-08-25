// Scripts for firebase and firebase messaging
// Version: 1.5 - Add skipWaiting and clientsClaim
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
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  
  // Mobile-specific handling
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // The browser may already display the notification automatically from the F-A-P
  // but we are creating it manually here to control the click behavior.
  const notificationTitle = payload.notification?.title || 'New Message';
  
  // Customize notification based on type with mobile optimizations
  let notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: payload.webpush?.notification?.icon || "/logo192.png",
    badge: payload.webpush?.notification?.badge || "/logo192.png",
    data: {
      url: payload.data?.url || "/dashboard", 
      type: payload.data?.type || "general",
      taskId: payload.data?.taskId || null,
      kitId: payload.data?.kitId || null
    },
    // Mobile-specific optimizations
    requireInteraction: !isMobile, // Don't require interaction on mobile
    silent: false,
    renotify: true,
    tag: payload.data?.type || 'general' // Prevent duplicate notifications
  };
  
  // Add vibration for mobile devices
  if (isMobile) {
    notificationOptions.vibrate = [200, 100, 200];
  }
  
  // Special handling for branding kit notifications
  if (payload.data?.type === "branding_kit_ready") {
    notificationOptions.icon = "/logo192.png";
    notificationOptions.badge = "/logo192.png";
    notificationOptions.requireInteraction = !isMobile; // Less intrusive on mobile
    notificationOptions.actions = isMobile ? [] : [ // Remove actions on mobile for compatibility
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
  
  // Special handling for task message notifications
  if (payload.data?.type === "task_message") {
    notificationOptions.icon = "/logo192.png";
    notificationOptions.badge = "/logo192.png";
    notificationOptions.requireInteraction = !isMobile; // Less intrusive on mobile
    notificationOptions.data.url = payload.data?.url || "/dashboard"; 
    notificationOptions.tag = `task_${payload.data?.taskId || 'message'}`; // Unique tag per task
  }

  console.log("[firebase-messaging-sw.js] Showing notification with options:", notificationOptions);

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks with mobile optimizations
self.addEventListener("notificationclick", (event) => {
  const clickedUrl = event.notification.data?.url || "/dashboard";
  const notificationType = event.notification.data?.type || "general";
  const kitId = event.notification.data?.kitId;
  const taskId = event.notification.data?.taskId;
  
  console.log("Notification click received. URL:", clickedUrl, "Type:", notificationType);
  
  event.notification.close();
  
  // Handle different actions for branding kit notifications
  if (notificationType === "branding_kit_ready") {
    if (event.action === 'dismiss') {
      // Just close the notification
      return;
    }
    
    // For branding kit notifications, always go to dashboard
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
        // Check if there's already a window open
        for (const client of clients) {
          if (client.url.includes('/dashboard') && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow("/dashboard");
        }
      })
    );
  } else if (notificationType === "task_message") {
    // For task message notifications, go to dashboard with task focus
    const taskUrl = taskId ? `/dashboard?task=${taskId}` : "/dashboard";
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
        // Check if there's already a window open
        for (const client of clients) {
          if ('focus' in client) {
            // Navigate existing window to task
            client.navigate && client.navigate(taskUrl);
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(taskUrl);
        }
      })
    );
  } else {
    // Default behavior for other notifications with mobile-friendly handling
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
        // Try to focus existing window first (better for mobile)
        for (const client of clients) {
          if ('focus' in client) {
            client.navigate && client.navigate(clickedUrl);
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(clickedUrl);
        }
      })
    );
  }
});

// Activate immediately when updated
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Optional: respond to pings from the page
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PING') {
    // console.log('Service worker alive');
  }
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// console.log('Service worker setup complete');

