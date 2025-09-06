// Scripts for firebase and firebase messaging
// Version: 1.6 - Add iOS Safari browser protection
/* eslint-env serviceworker */
/* global importScripts, firebase, clients */

// Check if we're in a supported browser before loading Firebase scripts
const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
const isStandalone = (typeof self !== 'undefined' && self.matchMedia && self.matchMedia('(display-mode: standalone)').matches);

// Only load Firebase on supported browsers
if (!isiOS || isStandalone) {
  importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js");
  importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js");
} else {
  console.log('[firebase-messaging-sw.js] iOS Safari browser detected - Firebase messaging disabled');
}

// Only initialize Firebase if we're in a supported browser
if (!isiOS || isStandalone) {
  // console.log('Firebase messaging service worker loaded');

  // Initialize the Firebase app in the service worker by passing in
  // the messagingSenderId.
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
  firebase.messaging();

  // console.log('Firebase messaging instance created');

  // iOS FIX: Use push event listener instead of onBackgroundMessage
  self.addEventListener('push', function(event) {
    console.log("[firebase-messaging-sw.js] 🚨 PUSH EVENT RECEIVED");
    
    if (event.data) {
      const payload = event.data.json();
      console.log("[firebase-messaging-sw.js] 🚨 EXPERT MESSAGE RECEIVED:", payload);
      console.log("[firebase-messaging-sw.js] Notification data:", payload.notification);
      console.log("[firebase-messaging-sw.js] Custom data:", payload.data);
      
      // Mobile-specific handling
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  // iOS Safari PWA requires ALL notifications to be displayed
  if (isiOS) {
    console.log("[firebase-messaging-sw.js] iOS detected - ensuring notification is displayed");
  }
  
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

  // CRITICAL: Use event.waitUntil() to prevent iOS token unregistration
  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
    }
  });

// Handle notification clicks with mobile optimizations
self.addEventListener("notificationclick", (event) => {
  const clickedUrl = event.notification.data?.url || "/dashboard";
  const notificationType = event.notification.data?.type || "general";
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

} else {
  // iOS Safari browser - provide minimal service worker functionality
  console.log('[firebase-messaging-sw.js] iOS Safari service worker - Firebase messaging skipped');
}

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

