/**
 * Quick notification test functions for browser console
 * Copy and paste these into the browser console to test notifications
 */

// Test 1: Quick browser notification test
window.testBrowserNotification = async () => {
  if (Notification.permission !== 'granted') {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('❌ Permission denied');
      return;
    }
  }
  
  const notification = new Notification('🧪 Browser Test', {
    body: 'If you see this, browser notifications work!',
    icon: '/logo192.png'
  });
  
  setTimeout(() => notification.close(), 3000);
  console.log('✅ Browser notification test sent');
};

// Test 2: Firebase messaging test
window.testFirebaseMessaging = async () => {
  try {
    const { getMessaging, getToken } = await import('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging.js');
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js');
    
    const app = initializeApp({
      apiKey: 'AIzaSyDoIexsBB5I8ylX2t2N4fxVjVcsst71c5Y',
      authDomain: 'landingpage-606e9.firebaseapp.com',
      projectId: 'landingpage-606e9',
      storageBucket: 'landingpage-606e9.firebasestorage.app',
      messagingSenderId: '449487247565',
      appId: '1:449487247565:web:7bf02a5898cb57a13cb184'
    });
    
    const messaging = getMessaging(app);
    const token = await getToken(messaging, { 
      vapidKey: 'BC9X8U5hWzbbGbbB8x_net_q4eG5RA798jZxKcOPS5e5joRHXN7XcCS2yv-UwCKY0lZZ59mOOspl_aSWEjSV33M' 
    });
    
    if (token) {
      console.log('✅ Firebase token obtained:', token.substring(0, 20) + '...');
      return token;
    } else {
      console.log('❌ Could not get Firebase token');
    }
  } catch (error) {
    console.error('❌ Firebase messaging test failed:', error);
  }
};

// Test 3: Service worker check
window.checkServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    console.log(`Found ${registrations.length} service worker(s):`);
    
    registrations.forEach((reg, index) => {
      console.log(`${index + 1}. Scope: ${reg.scope}`);
      console.log(`   Active: ${reg.active?.state}`);
      console.log(`   Script: ${reg.active?.scriptURL}`);
      
      if (reg.active?.scriptURL.includes('firebase-messaging-sw.js')) {
        console.log('✅ Firebase messaging service worker found');
      }
    });
    
    if (registrations.length === 0) {
      console.log('❌ No service workers registered');
    }
  } else {
    console.log('❌ Service workers not supported');
  }
};

// Test 4: Comprehensive check
window.runFullNotificationCheck = async () => {
  console.log('🔍 Running full notification check...');
  
  console.log('\n1. Browser notification test:');
  await window.testBrowserNotification();
  
  console.log('\n2. Service worker check:');
  await window.checkServiceWorker();
  
  console.log('\n3. Firebase messaging test:');
  await window.testFirebaseMessaging();
  
  console.log('\n4. Permission status:', Notification.permission);
  console.log('5. HTTPS:', location.protocol === 'https:');
  console.log('6. Focus:', !document.hidden);
  
  console.log('\n✅ Full check complete - see results above');
};

console.log('🧪 Notification test functions loaded:');
console.log('• testBrowserNotification() - Test basic browser notifications');
console.log('• testFirebaseMessaging() - Test Firebase token generation');
console.log('• checkServiceWorker() - Check service worker status');
console.log('• runFullNotificationCheck() - Run all tests');
