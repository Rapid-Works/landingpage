/**
 * Debug script for notification issues
 * Run this in the browser console to diagnose notification problems
 */

// Run diagnostic for specific user
async function debugNotificationsForUser(userEmail = 'calvinsamueldonkor@gmail.com') {
  console.log(`🔍 DEBUGGING NOTIFICATIONS FOR: ${userEmail}`);
  console.log('='.repeat(60));
  
  try {
    // 1. Run general browser diagnostic
    console.log('📋 Step 1: Running browser notification diagnostic...');
    const { runNotificationDiagnostic } = await import('./src/utils/notificationDiagnostic.js');
    const diagnostic = await runNotificationDiagnostic();
    
    console.log('🔍 Browser Diagnostic Results:', diagnostic);
    console.log('-'.repeat(40));
    
    // 2. Check Firebase authentication status
    console.log('🔐 Step 2: Checking Firebase auth...');
    const { getAuth } = await import('firebase/auth');
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (currentUser) {
      console.log('✅ User is authenticated:', currentUser.email);
    } else {
      console.log('❌ User is NOT authenticated - this is a major issue!');
      console.log('💡 User must be logged in to receive notifications');
      return { error: 'User not authenticated' };
    }
    console.log('-'.repeat(40));
    
    // 3. Check FCM tokens for the specific user
    console.log(`📱 Step 3: Checking FCM tokens for ${userEmail}...`);
    const { default: customerNotificationService } = await import('./src/utils/customerNotificationService.js');
    const tokenCheck = await customerNotificationService.checkUserHasNotificationTokens(userEmail);
    console.log('🎯 Token Check Result:', tokenCheck);
    
    if (!tokenCheck.hasTokens) {
      console.log('❌ CRITICAL ISSUE: No FCM tokens found!');
      console.log('💡 This means the user has never enabled notifications');
      console.log('� SOLUTION: User needs to enable notifications');
    } else {
      console.log('✅ User has FCM tokens registered');
    }
    console.log('-'.repeat(40));
    
    // 4. Check notification permissions
    console.log('🔔 Step 4: Checking notification permissions...');
    console.log('Current permission:', Notification.permission);
    
    switch (Notification.permission) {
      case 'granted':
        console.log('✅ Notification permission granted');
        break;
      case 'denied':
        console.log('❌ CRITICAL: Notification permission DENIED');
        console.log('💡 User must manually enable in browser settings');
        break;
      case 'default':
        console.log('⚠️ Notification permission not requested yet');
        break;
    }
    console.log('-'.repeat(40));
    
    // 5. Test Firebase messaging setup
    console.log('🔥 Step 5: Testing Firebase messaging...');
    try {
      const { getMessaging, getToken } = await import('firebase/messaging');
      const messaging = getMessaging();
      const VAPID_KEY = 'BC9X8U5hWzbbGbbB8x_net_q4eG5RA798jZxKcOPS5e5joRHXN7XcCS2yv-UwCKY0lZZ59mOOspl_aSWEjSV33M';
      
      if (Notification.permission === 'granted') {
        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (token) {
          console.log('✅ Successfully got FCM token:', token.substring(0, 20) + '...');
        } else {
          console.log('❌ Could not get FCM token despite permission');
        }
      } else {
        console.log('⚠️ Cannot test FCM token without permission');
      }
    } catch (fcmError) {
      console.log('❌ Firebase messaging error:', fcmError.message);
    }
    console.log('-'.repeat(40));
    
    // 6. Test browser notification
    console.log('🧪 Step 6: Testing browser notification...');
    if (Notification.permission === 'granted') {
      try {
        const testNotif = new Notification('🧪 Debug Test for ' + userEmail, {
          body: 'If you see this, browser notifications work!',
          icon: '/logo192.png',
          tag: 'debug-test'
        });
        setTimeout(() => testNotif.close(), 4000);
        console.log('✅ Browser notification test sent');
      } catch (error) {
        console.log('❌ Browser notification failed:', error.message);
      }
    } else {
      console.log('⚠️ Cannot test browser notifications without permission');
    }
    console.log('-'.repeat(40));
    
    // 7. Check environment requirements
    console.log('🌐 Step 7: Checking environment...');
    console.log('Protocol:', window.location.protocol);
    console.log('Hostname:', window.location.hostname);
    console.log('Service Worker support:', 'serviceWorker' in navigator);
    console.log('Notification support:', 'Notification' in window);
    console.log('-'.repeat(40));
    
    // 8. Provide detailed diagnosis
    console.log('📊 DETAILED DIAGNOSIS:');
    console.log('='.repeat(30));
    
    const issues = [];
    const recommendations = [];
    
    if (diagnostic.issues.length > 0) {
      issues.push(...diagnostic.issues);
    }
    
    if (!tokenCheck.hasTokens) {
      issues.push('❌ User has no FCM tokens registered');
      recommendations.push('🔧 User needs to enable notifications via the notification button');
    }
    
    if (Notification.permission !== 'granted') {
      issues.push('❌ Browser notification permission not granted');
      recommendations.push('🔧 User needs to allow notifications in browser');
    }
    
    if (!currentUser || currentUser.email !== userEmail) {
      issues.push('❌ User authentication mismatch');
      recommendations.push('🔧 Ensure user is logged in with correct email');
    }
    
    if (issues.length === 0) {
      console.log('✅ No obvious issues found!');
      console.log('🔍 Check these additional areas:');
      console.log('   1. Firebase Function logs (Firebase Console > Functions)');
      console.log('   2. Expert correctly sent the message');
      console.log('   3. Task has proper expertEmail assigned');
      console.log('   4. Message was not a system message');
    } else {
      console.log('❌ Issues found:');
      issues.forEach(issue => console.log('  ', issue));
      console.log('');
      console.log('🔧 Recommendations:');
      recommendations.forEach(rec => console.log('  ', rec));
    }
    
    console.log('');
    console.log('📋 FOR FIREBASE FUNCTION DEBUGGING:');
    console.log('1. Go to Firebase Console > Functions');
    console.log('2. Look for "onTaskUpdated" function logs');
    console.log(`3. Search for logs containing: "${userEmail}"`);
    console.log('4. Check for "FCM tokens found" or "No FCM tokens found" messages');
    
    return {
      diagnostic,
      tokenCheck,
      permission: Notification.permission,
      isAuthenticated: !!currentUser,
      userEmail: currentUser?.email,
      issues,
      recommendations,
      status: issues.length === 0 ? 'LIKELY_OK' : 'ISSUES_FOUND'
    };
    
  } catch (error) {
    console.error('❌ Debug script failed:', error);
    return { error: error.message };
  }
}

// Helper function to enable notifications for testing
async function enableNotificationsForUser() {
  console.log('🔔 Attempting to enable notifications...');
  
  try {
    // Request permission
    const permission = await Notification.requestPermission();
    console.log('Permission result:', permission);
    
    if (permission === 'granted') {
      // Import and use the Firebase messaging setup
      const { requestNotificationPermission } = await import('./src/firebase/messaging.js');
      const result = await requestNotificationPermission();
      console.log('Firebase messaging setup result:', result);
      
      if (result.success) {
        console.log('✅ Notifications successfully enabled!');
        console.log('Token:', result.token?.substring(0, 20) + '...');
        return true;
      } else {
        console.log('❌ Failed to setup Firebase messaging:', result.reason);
        return false;
      }
    } else {
      console.log('❌ Permission denied');
      return false;
    }
  } catch (error) {
    console.error('❌ Error enabling notifications:', error);
    return false;
  }
}

// Auto-run for the specific user (use the correct email)
console.log('🚀 Starting notification debug for calvinsamueldonkor...');
debugNotificationsForUser('calvinsamueldonkor@gmail.com');

// Make functions available globally for manual testing
window.debugNotificationsForUser = debugNotificationsForUser;
window.enableNotificationsForUser = enableNotificationsForUser;

console.log('');
console.log('🛠️  MANUAL TESTING FUNCTIONS AVAILABLE:');
console.log('- debugNotificationsForUser("email@example.com")');
console.log('- enableNotificationsForUser()');
console.log('');
