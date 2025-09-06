// Quick FCM Test - Run in PWA Console
(async () => {
  console.log('🧪 Testing FCM fixes...');
  
  // 1. Check if NotificationProvider is working
  console.log('1. NotificationProvider active:', window.React ? 'YES' : 'NO');
  
  // 2. Check FCM token
  const { getToken } = await import('firebase/messaging');
  const { messaging } = await import('./src/firebase/config.js');
  const token = await getToken(messaging, {
    vapidKey: 'BC9X8U5hWzbbGbbB8x_net_q4eG5RA798jZxKcOPS5e5joRHXN7XcCS2yv-UwCKY0lZZ59mOOspl_aSWEjSV33M'
  });
  console.log('2. FCM Token:', token ? 'VALID' : 'MISSING');
  
  // 3. Test notification permission
  console.log('3. Notification permission:', Notification.permission);
  
  // 4. Check service worker
  const sw = await navigator.serviceWorker.getRegistration();
  console.log('4. Service worker:', sw ? 'REGISTERED' : 'MISSING');
  
  // 5. Manual test expert notification
  if (token) {
    const { httpsCallable } = await import('firebase/functions');
    const { functions } = await import('./src/firebase/config.js');
    
    const testFn = httpsCallable(functions, 'sendTaskMessageNotification');
    const result = await testFn({
      taskId: 'test-fix-verification',
      senderEmail: 'expert@rapid-works.io',
      senderRole: 'expert',
      recipientEmail: 'YOUR_EMAIL_HERE', // Replace with your email
      recipientRole: 'customer',
      messageContent: '🧪 Testing FCM fixes - iOS unregistration should be fixed!',
      messageType: 'message',
      taskData: {
        id: 'test-fix-verification',
        title: 'FCM Fix Test',
        status: 'pending'
      }
    });
    
    console.log('5. Test notification result:', result.data);
    console.log('✅ If you received a notification, the fixes are working!');
  } else {
    console.log('5. Cannot test - no FCM token');
  }
})();
