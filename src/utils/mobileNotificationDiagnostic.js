/**
 * Mobile Notification Diagnostic and Fixes
 * Common issues with mobile push notifications and their solutions
 */

export const runMobileNotificationDiagnostic = async () => {
  const results = {
    timestamp: new Date().toISOString(),
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    issues: [],
    checks: {},
    fixes: []
  };

  console.log('📱 Starting mobile notification diagnostic...');

  // 1. Check if running on mobile
  results.checks.isMobile = results.isMobile;
  if (results.isMobile) {
    console.log('📱 Mobile device detected');
  }

  // 2. Check PWA installation status
  results.checks.isPWA = window.matchMedia('(display-mode: standalone)').matches;
  results.checks.canInstallPWA = 'serviceWorker' in navigator && 'PushManager' in window;
  
  if (results.isMobile && !results.checks.isPWA) {
    results.issues.push('⚠️ App not installed as PWA - mobile notifications may be unreliable');
    results.fixes.push('Install app to home screen for better notification delivery');
  }

  // 3. Check battery optimization (Android)
  if (results.isMobile && navigator.userAgent.includes('Android')) {
    results.issues.push('⚠️ Android: Check battery optimization settings');
    results.fixes.push('Android: Disable battery optimization for this app in system settings');
  }

  // 4. Check iOS Safari restrictions
  if (results.isMobile && navigator.userAgent.includes('iPhone')) {
    results.checks.isIOSSafari = true;
    results.issues.push('⚠️ iOS Safari: Limited notification support');
    results.fixes.push('iOS: Add to home screen and open from there for notifications');
  }

  // 5. Check service worker state
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      const firebaseWorker = registrations.find(reg => 
        reg.scope.includes('firebase-messaging-sw.js') || 
        reg.active?.scriptURL.includes('firebase-messaging-sw.js')
      );
      
      results.checks.serviceWorkerActive = !!firebaseWorker;
      results.checks.serviceWorkerState = firebaseWorker?.active?.state;
      
      if (!firebaseWorker) {
        results.issues.push('❌ Firebase service worker not active');
        results.fixes.push('Refresh page to re-register service worker');
      } else if (firebaseWorker.active?.state !== 'activated') {
        results.issues.push('⚠️ Service worker not in activated state');
        results.fixes.push('Wait for service worker activation or refresh page');
      }
    } catch (error) {
      results.issues.push(`❌ Service worker check failed: ${error.message}`);
    }
  }

  // 6. Check notification permission with mobile-specific handling
  results.checks.permission = Notification.permission;
  if (results.checks.permission !== 'granted') {
    if (results.isMobile) {
      results.issues.push('❌ Mobile notification permission not granted');
      results.fixes.push('Mobile: Tap notification button and grant permission in browser popup');
    } else {
      results.issues.push('❌ Notification permission not granted');
    }
  }

  // 7. Check push subscription
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      results.checks.hasPushSubscription = !!subscription;
      
      if (!subscription && results.checks.permission === 'granted') {
        results.issues.push('⚠️ No push subscription found despite permission');
        results.fixes.push('Re-enable notifications to create new push subscription');
      }
    } catch (error) {
      results.issues.push(`❌ Push subscription check failed: ${error.message}`);
    }
  }

  // 8. Check for background app refresh (iOS)
  if (results.isMobile && navigator.userAgent.includes('iPhone')) {
    results.issues.push('⚠️ iOS: Check Background App Refresh settings');
    results.fixes.push('iOS Settings > General > Background App Refresh > Enable for Safari/Chrome');
  }

  // 9. Check visibility API support
  results.checks.visibilityAPISupported = 'visibilityState' in document;
  results.checks.documentVisible = !document.hidden;

  // 10. Mobile-specific Firebase messaging issues
  try {
    const { getMessaging, isSupported } = await import('firebase/messaging');
    const supported = await isSupported();
    results.checks.firebaseMessagingSupported = supported;
    
    if (!supported && results.isMobile) {
      results.issues.push('❌ Firebase messaging not supported on this mobile browser');
      results.fixes.push('Try using Chrome or Firefox on mobile for better notification support');
    }
  } catch (error) {
    results.issues.push(`❌ Firebase messaging check failed: ${error.message}`);
  }

  console.log('📱 Mobile diagnostic completed:', results);
  return results;
};

// Mobile-specific notification enablement
export const enableMobileNotifications = async () => {
  console.log('📱 Enabling mobile notifications with mobile-specific optimizations...');
  
  try {
    // 1. Check if mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // 2. For iOS, show specific instructions
    if (isMobile && navigator.userAgent.includes('iPhone')) {
      console.log('📱 iOS detected - showing iOS-specific instructions');
      
      // Check if running as PWA
      const isPWA = window.matchMedia('(display-mode: standalone)').matches;
      if (!isPWA) {
        alert(`📱 iOS Instructions:
1. Tap the Share button in Safari
2. Select "Add to Home Screen"
3. Open the app from your home screen
4. Then enable notifications

For best results, use the installed app for notifications.`);
        return { success: false, reason: 'iOS requires PWA installation for reliable notifications' };
      }
    }

    // 3. Request permission with mobile-optimized messaging
    console.log('📱 Requesting notification permission...');
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      let message = 'Permission denied';
      if (isMobile) {
        message = 'Mobile notification permission denied. Check browser settings.';
      }
      return { success: false, reason: message };
    }

    // 4. Initialize Firebase messaging with mobile optimizations
    const { requestNotificationPermission } = await import('../firebase/messaging');
    const result = await requestNotificationPermission();
    
    if (result.success) {
      // 5. Mobile-specific post-setup
      if (isMobile) {
        console.log('📱 Mobile notifications enabled successfully');
        
        // Test with mobile-optimized notification
        try {
          const testNotif = new Notification('📱 Mobile Test', {
            body: 'Mobile notifications are working!',
            icon: '/logo192.png',
            badge: '/logo192.png',
            requireInteraction: false, // Don't require interaction on mobile
            silent: false,
            vibrate: [200, 100, 200] // Mobile vibration pattern
          });
          
          setTimeout(() => testNotif.close(), 5000);
        } catch (notifError) {
          console.log('Test notification failed (non-critical):', notifError);
        }
      }
    }
    
    return result;
    
  } catch (error) {
    console.error('Mobile notification setup failed:', error);
    return { success: false, reason: `Mobile setup failed: ${error.message}` };
  }
};

// Test mobile notification delivery
export const testMobileNotification = async (userEmail) => {
  console.log('📱 Testing mobile notification delivery...');
  
  try {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) {
      console.log('📱 Not on mobile device');
      return { success: false, reason: 'Not on mobile device' };
    }

    // Check permission
    if (Notification.permission !== 'granted') {
      return { success: false, reason: 'Notification permission not granted' };
    }

    // Send test notification via Firebase Function
    const { getFunctions, httpsCallable } = await import('firebase/functions');
    const functions = getFunctions();
    const sendTestNotification = httpsCallable(functions, 'sendTestMobileNotification');
    
    const result = await sendTestNotification({
      userEmail: userEmail,
      testType: 'mobile_test'
    });
    
    console.log('📱 Mobile test notification result:', result.data);
    return { success: true, result: result.data };
    
  } catch (error) {
    console.error('Mobile notification test failed:', error);
    return { success: false, reason: error.message };
  }
};
