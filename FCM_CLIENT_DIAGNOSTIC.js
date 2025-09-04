// FCM Client Diagnostic Test
// Run this in your PWA browser console to diagnose FCM issues

(async () => {
  console.log('🔍 FCM CLIENT DIAGNOSTIC STARTING...');
  
  try {
    // 1. Check Firebase imports
    console.log('1️⃣ Checking Firebase imports...');
    const { getMessaging, getToken, onMessage } = await import('firebase/messaging');
    const { messaging } = await import('./src/firebase/config.js');
    console.log('✅ Firebase messaging imported successfully');
    
    // 2. Check messaging instance
    console.log('2️⃣ Checking messaging instance...');
    console.log('Messaging instance:', messaging);
    console.log('Is messaging supported?', messaging ? 'YES' : 'NO');
    
    // 3. Check current FCM token
    console.log('3️⃣ Checking current FCM token...');
    const currentToken = await getToken(messaging, {
      vapidKey: 'BEl62iUYgUivxIkv69yViEuiBIa40HI8l8V7VgV3JwB4Jp2e9Hc2WqyyH2L0KzYxtq1S8X5eF7jA9sB2cD4eF6gH8iJ0kL2mN4oP6qR8sT0uV2wX4yZ6'
    });
    console.log('Current FCM token:', currentToken);
    console.log('Token length:', currentToken ? currentToken.length : 'NO TOKEN');
    
    // 4. Check notification permission
    console.log('4️⃣ Checking notification permission...');
    const permission = Notification.permission;
    console.log('Notification permission:', permission);
    
    // 5. Check if service worker is registered
    console.log('5️⃣ Checking service worker...');
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      console.log('Service worker registered:', registration ? 'YES' : 'NO');
      if (registration) {
        console.log('Service worker scope:', registration.scope);
        console.log('Service worker state:', registration.active?.state);
      }
    } else {
      console.log('❌ Service worker not supported');
    }
    
    // 6. Test foreground message listener
    console.log('6️⃣ Testing foreground message listener...');
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('🚨 FOREGROUND MESSAGE RECEIVED IN TEST:', payload);
    });
    console.log('✅ Foreground listener attached');
    
    // 7. Check if NotificationProvider is working
    console.log('7️⃣ Checking NotificationProvider...');
    const { onForegroundMessage } = await import('./src/firebase/messaging.js');
    console.log('onForegroundMessage function:', onForegroundMessage);
    
    // 8. Manual test notification
    console.log('8️⃣ Testing manual notification...');
    if (Notification.permission === 'granted') {
      const testNotification = new Notification('FCM Test', {
        body: 'This is a test notification to verify the system works',
        icon: '/logo192.png'
      });
      console.log('✅ Manual notification created');
    } else {
      console.log('❌ Cannot create manual notification - permission denied');
    }
    
    console.log('🎯 DIAGNOSTIC COMPLETE - Check results above');
    
    // Cleanup
    setTimeout(() => {
      unsubscribe();
      console.log('🧹 Cleaned up test listener');
    }, 30000);
    
  } catch (error) {
    console.error('❌ DIAGNOSTIC ERROR:', error);
  }
})();
