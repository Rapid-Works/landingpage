// Simple Push Notification Test - Mobile Only
(async () => {
  console.log('📱 Testing PUSH NOTIFICATIONS ONLY...');
  
  try {
    // Get FCM token
    const { getToken } = await import('firebase/messaging');
    const { messaging } = await import('./src/firebase/config.js');
    
    const token = await getToken(messaging, {
      vapidKey: 'BC9X8U5hWzbbGbbB8x_net_q4eG5RA798jZxKcOPS5e5joRHXN7XcCS2yv-UwCKY0lZZ59mOOspl_aSWEjSV33M'
    });
    
    if (!token) {
      console.log('❌ No FCM token - enable notifications first');
      return;
    }
    
    console.log('✅ FCM Token found');
    
    // Use the mobile test function (no email required)
    const { httpsCallable } = await import('firebase/functions');
    const { functions } = await import('./src/firebase/config.js');
    
    const testFn = httpsCallable(functions, 'sendTestMobileNotification');
    const result = await testFn({
      userEmail: 'test@example.com', // Just need any email for token lookup
      testType: 'push_only'
    });
    
    console.log('🚀 Test result:', result.data);
    
    if (result.data.success) {
      console.log('✅ PUSH NOTIFICATION SENT!');
      console.log('📱 Check your device for the notification');
    } else {
      console.log('❌ Failed:', result.data.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
})();
