/**
 * Comprehensive notification diagnostic tool
 * Use this to debug notification issues
 */

export const runNotificationDiagnostic = async () => {
  const results = {
    timestamp: new Date().toISOString(),
    browser: navigator.userAgent,
    issues: [],
    checks: {}
  };

  console.log('🔍 Starting notification diagnostic...');

  // 1. Check if notifications are supported
  results.checks.notificationSupport = 'Notification' in window;
  if (!results.checks.notificationSupport) {
    results.issues.push('❌ Notifications not supported in this browser');
    return results;
  }

  // 2. Check notification permission
  results.checks.permission = Notification.permission;
  if (results.checks.permission === 'denied') {
    results.issues.push('❌ Notification permission denied - user must enable in browser settings');
  } else if (results.checks.permission === 'default') {
    results.issues.push('⚠️ Notification permission not requested yet');
  }

  // 3. Check service worker support
  results.checks.serviceWorkerSupport = 'serviceWorker' in navigator;
  if (!results.checks.serviceWorkerSupport) {
    results.issues.push('❌ Service Worker not supported');
    return results;
  }

  // 4. Check service worker registration
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    results.checks.serviceWorkerRegistrations = registrations.length;
    
    const firebaseWorker = registrations.find(reg => 
      reg.scope.includes('firebase-messaging-sw.js') || 
      reg.active?.scriptURL.includes('firebase-messaging-sw.js')
    );
    
    results.checks.firebaseServiceWorkerActive = !!firebaseWorker;
    
    if (!firebaseWorker) {
      results.issues.push('❌ Firebase messaging service worker not found');
    } else {
      results.checks.firebaseServiceWorkerScope = firebaseWorker.scope;
      results.checks.firebaseServiceWorkerState = firebaseWorker.active?.state;
    }
  } catch (error) {
    results.issues.push(`❌ Error checking service workers: ${error.message}`);
  }

  // 5. Check Firebase messaging
  try {
    const { getMessaging, getToken, isSupported } = await import('firebase/messaging');
    
    const supported = await isSupported();
    results.checks.firebaseMessagingSupported = supported;
    
    if (!supported) {
      results.issues.push('❌ Firebase messaging not supported in this environment');
      return results;
    }

    const messaging = getMessaging();
    results.checks.firebaseMessagingInitialized = !!messaging;

    // Try to get token
    const VAPID_KEY = 'BC9X8U5hWzbbGbbB8x_net_q4eG5RA798jZxKcOPS5e5joRHXN7XcCS2yv-UwCKY0lZZ59mOOspl_aSWEjSV33M';
    
    if (results.checks.permission === 'granted') {
      try {
        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        results.checks.hasToken = !!token;
        results.checks.tokenPreview = token ? token.substring(0, 20) + '...' : null;
        
        if (!token) {
          results.issues.push('❌ Could not get FCM token despite having permission');
        }
      } catch (tokenError) {
        results.issues.push(`❌ Error getting FCM token: ${tokenError.message}`);
      }
    }
  } catch (error) {
    results.issues.push(`❌ Error with Firebase messaging: ${error.message}`);
  }

  // 6. Test browser notification
  if (results.checks.permission === 'granted') {
    try {
      const testNotification = new Notification('🧪 Test Notification', {
        body: 'If you see this, browser notifications work!',
        icon: '/logo192.png',
        tag: 'test-notification'
      });
      
      results.checks.browserNotificationTest = true;
      
      // Close test notification after 3 seconds
      setTimeout(() => {
        testNotification.close();
      }, 3000);
      
    } catch (notifError) {
      results.issues.push(`❌ Browser notification test failed: ${notifError.message}`);
      results.checks.browserNotificationTest = false;
    }
  }

  // 7. Check if page is served over HTTPS
  results.checks.isHTTPS = location.protocol === 'https:';
  if (!results.checks.isHTTPS && location.hostname !== 'localhost') {
    results.issues.push('❌ Page not served over HTTPS - required for notifications');
  }

  // 8. Check for focus/visibility issues
  results.checks.documentHidden = document.hidden;
  results.checks.documentVisibilityState = document.visibilityState;

  console.log('🔍 Diagnostic completed:', results);
  return results;
};

export const testNotificationFlow = async () => {
  console.log('🧪 Testing complete notification flow...');
  
  try {
    // 1. Run diagnostic first
    const diagnostic = await runNotificationDiagnostic();
    
    if (diagnostic.issues.length > 0) {
      console.log('❌ Issues found that may prevent notifications:', diagnostic.issues);
      return { success: false, diagnostic };
    }

    // 2. Request permission if needed
    if (Notification.permission !== 'granted') {
      console.log('📝 Requesting notification permission...');
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('❌ Permission denied');
        return { success: false, reason: 'Permission denied' };
      }
    }

    // 3. Test Firebase messaging
    const { requestNotificationPermission } = await import('../firebase/messaging');
    const result = await requestNotificationPermission();
    
    console.log('🔔 Firebase messaging result:', result);
    
    if (!result.success) {
      return { success: false, reason: result.reason, diagnostic };
    }

    // 4. Test sending a notification via the service
    const { default: customerNotificationService } = await import('./customerNotificationService');
    
    // Get current user
    const { useAuth } = await import('../contexts/AuthContext');
    const auth = useAuth();
    
    if (auth.currentUser) {
      console.log('📤 Testing notification service...');
      const testResult = await customerNotificationService.sendTaskSubmittedNotification(
        {
          id: 'test-task',
          taskName: 'Test Notification',
          taskDescription: 'This is a test notification'
        },
        auth.currentUser.email
      );
      
      console.log('📬 Notification service test result:', testResult);
    }

    return { 
      success: true, 
      token: result.token, 
      diagnostic 
    };
    
  } catch (error) {
    console.error('❌ Notification test failed:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Helper function to show diagnostic results in a modal
export const showDiagnosticModal = (results) => {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
  
  const content = `
    <div class="bg-white rounded-lg p-6 max-w-2xl mx-4 shadow-xl max-h-96 overflow-y-auto">
      <h3 class="text-lg font-semibold mb-4">🔍 Notification Diagnostic Results</h3>
      
      <div class="mb-4">
        <strong>Browser:</strong> ${results.browser.substring(0, 50)}...
      </div>
      
      ${results.issues.length > 0 ? `
        <div class="mb-4">
          <strong class="text-red-600">Issues Found:</strong>
          <ul class="list-disc list-inside mt-2">
            ${results.issues.map(issue => `<li class="text-sm">${issue}</li>`).join('')}
          </ul>
        </div>
      ` : '<div class="text-green-600 mb-4">✅ No issues found!</div>'}
      
      <div class="mb-4">
        <strong>Checks:</strong>
        <ul class="text-sm mt-2 space-y-1">
          <li>Notification Support: ${results.checks.notificationSupport ? '✅' : '❌'}</li>
          <li>Permission: ${results.checks.permission} ${results.checks.permission === 'granted' ? '✅' : '⚠️'}</li>
          <li>Service Worker Support: ${results.checks.serviceWorkerSupport ? '✅' : '❌'}</li>
          <li>Firebase Service Worker: ${results.checks.firebaseServiceWorkerActive ? '✅' : '❌'}</li>
          <li>Firebase Messaging: ${results.checks.firebaseMessagingSupported ? '✅' : '❌'}</li>
          <li>Has FCM Token: ${results.checks.hasToken ? '✅' : '❌'}</li>
          <li>HTTPS: ${results.checks.isHTTPS ? '✅' : '❌'}</li>
          <li>Browser Test: ${results.checks.browserNotificationTest ? '✅' : '❌'}</li>
        </ul>
      </div>
      
      <button onclick="this.parentElement.parentElement.remove()" 
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Close
      </button>
    </div>
  `;
  
  modal.innerHTML = content;
  document.body.appendChild(modal);
  
  // Close on backdrop click
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  };
};
