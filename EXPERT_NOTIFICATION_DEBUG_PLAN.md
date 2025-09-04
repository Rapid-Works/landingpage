# 🚨 Expert Message Push Notification Debug Plan
*Based on Firebase Official Documentation & PWA Best Practices*

## **🔍 Issue Summary**
- ✅ Test notifications work on web
- ✅ All diagnostic checks pass (FCM tokens, permissions, service worker)
- ❌ Expert messages don't trigger push notifications in PWA

## **📋 Official Firebase Debugging Checklist**

### **Step 1: Verify Notification Flow Paths**
There are **TWO** notification systems running:

#### **Path A: Frontend Direct Call** (src/utils/taskRequestService.js)
```javascript
addTaskMessage() → sendTaskMessageNotification() → Cloud Function
```

#### **Path B: Firestore Trigger** (functions/index.js)
```javascript
Firestore Update → onTaskUpdated → sendTaskMessageNotification
```

**🎯 ACTION**: Test which path is actually being used

### **Step 2: Firebase Cloud Function Debugging**

#### **Check Cloud Function Logs**
```bash
# Run this command to monitor Firebase Functions
firebase functions:log --only=sendTaskMessageNotification,onTaskUpdated
```

#### **Test Cloud Function Directly**
```javascript
// Test the Cloud Function in browser console
const { httpsCallable } = await import('firebase/functions');
const { functions } = await import('./src/firebase/config.js');

const testNotification = httpsCallable(functions, 'sendTaskMessageNotification');
await testNotification({
  taskId: 'test-task-123',
  senderEmail: 'expert@rapid-works.io',
  senderRole: 'expert',
  recipientEmail: 'YOUR_EMAIL_HERE',
  recipientRole: 'customer',
  messageContent: 'Test expert message',
  messageType: 'message',
  taskData: { id: 'test-task-123', title: 'Test Task', status: 'pending' }
});
```

### **Step 3: Foreground vs Background Message Handling**

#### **Check onMessage Handler** (Firebase Official Pattern)
```javascript
// In your main app component, ensure this is set up:
import { onMessage } from 'firebase/messaging';
import { messaging } from './firebase/config';

onMessage(messaging, (payload) => {
  console.log('🔔 Foreground message received:', payload);
  // Manual notification display for foreground
  new Notification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/logo192.png'
  });
});
```

### **Step 4: Service Worker Message Debugging**

#### **Add Debug Logs to Service Worker**
```javascript
// Add to public/firebase-messaging-sw.js
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message received:', payload);
  console.log('[SW] Message data:', payload.data);
  console.log('[SW] Notification payload:', payload.notification);
  
  // Force notification display
  return self.registration.showNotification(
    payload.notification?.title || 'Expert Message',
    {
      body: payload.notification?.body || 'New message from expert',
      icon: '/logo192.png',
      data: payload.data
    }
  );
});
```

### **Step 5: PWA vs Web Browser Detection**

#### **Check App Context**
```javascript
// Add this to your expert message debugging
const isPWA = window.matchMedia('(display-mode: standalone)').matches;
const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);

console.log('🔍 App Context:', {
  isPWA,
  isMobile,
  userAgent: navigator.userAgent,
  displayMode: window.matchMedia('(display-mode: standalone)').matches
});
```

### **Step 6: Token Validation & User Preference Check**

#### **Verify User Has Valid Tokens & Preferences**
```javascript
// Test user's notification setup
const testUserNotificationSetup = async (userEmail) => {
  console.log('🧪 Testing notification setup for:', userEmail);
  
  // 1. Check FCM tokens
  const tokenQuery = query(
    collection(db, 'fcmTokens'), 
    where('email', '==', userEmail)
  );
  const tokenDocs = await getDocs(tokenQuery);
  console.log('📱 FCM Tokens found:', tokenDocs.size);
  
  // 2. Check notification preferences
  const userId = await getUserIdFromEmail(userEmail);
  if (userId) {
    const prefsDoc = await getDoc(doc(db, 'userNotificationPreferences', userId));
    const prefs = prefsDoc.data()?.preferences || {};
    console.log('⚙️ Task message preferences:', prefs.taskMessages);
  }
  
  return { tokenCount: tokenDocs.size, preferences: prefs };
};
```

## **🎯 Step-by-Step Testing Protocol**

### **Test 1: Manual Cloud Function Call**
```javascript
// Run in browser console on dashboard
(async () => {
  const { httpsCallable } = await import('firebase/functions');
  const { functions } = await import('./src/firebase/config.js');
  
  const testFn = httpsCallable(functions, 'sendTaskMessageNotification');
  const result = await testFn({
    taskId: 'test-123',
    senderEmail: 'expert@rapid-works.io',
    senderRole: 'expert',
    recipientEmail: 'YOUR_EMAIL_HERE', // Replace with your email
    recipientRole: 'customer',
    messageContent: 'Manual test message',
    messageType: 'message',
    taskData: { id: 'test-123', title: 'Manual Test', status: 'pending' }
  });
  console.log('Manual test result:', result.data);
})();
```

### **Test 2: Check Frontend Flow**
```javascript
// Add to ExpertTaskView.jsx in handleSendMessage
console.log('🚀 Expert sending message:', {
  taskId: taskData.id,
  expertEmail: currentUser?.email,
  message: message.trim()
});

// After addTaskMessage call:
console.log('✅ Message added, notification should be triggered');
```

### **Test 3: Monitor Firestore Trigger**
```javascript
// Check if Firestore trigger is firing
// In Firebase Console → Functions → Logs, look for:
// "📝 Task [taskId] was updated"
// "📬 X new message(s) detected in task [taskId]"
```

## **🔧 Common Issues & Solutions**

### **Issue 1: Firestore Trigger Not Firing**
**Symptoms**: No logs in Firebase Functions console
**Solution**: Check if both paths are triggering
```javascript
// Temporarily disable frontend notification call
const sendNotification = false; // Set to false
await addTaskMessage(taskData.id, newMessage, sendNotification);
```

### **Issue 2: Cloud Function Receives Call But No Notification**
**Symptoms**: Cloud Function logs show execution but no push
**Solution**: Check token validity and user preferences
```javascript
// In Cloud Function, add debugging:
console.log('📊 Token count for recipient:', tokensSnapshot.size);
console.log('⚙️ User preferences:', preferences);
```

### **Issue 3: PWA vs Web Different Behavior**
**Symptoms**: Works in web browser but not in PWA
**Solution**: Check service worker scope and registration
```javascript
// Check if service worker is active
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Active service workers:', registrations.length);
  registrations.forEach(reg => console.log('SW scope:', reg.scope));
});
```

### **Issue 4: iOS Safari PWA Limitations**
**Symptoms**: Works on Android PWA but not iOS
**Solution**: iOS Safari PWA has restrictions
```javascript
// Check iOS specific conditions
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
const isPWA = window.matchMedia('(display-mode: standalone)').matches;
console.log('iOS PWA status:', { isIOS, isPWA });
```

## **📱 Mobile-Specific Debugging**

### **Chrome DevTools Mobile Debugging**
1. Connect Android device via USB
2. Open `chrome://inspect/#devices`
3. Inspect your PWA
4. Monitor console logs during expert message

### **Safari DevTools iOS Debugging**
1. Enable Web Inspector on iOS device
2. Connect to Mac Safari Developer menu
3. Monitor console during expert message

## **🔍 Next Steps Based on Results**

1. **Run Test 1** - If manual Cloud Function works → Frontend flow issue
2. **Run Test 2** - If frontend logs show but no notification → Cloud Function issue  
3. **Run Test 3** - If no Firestore trigger logs → Database trigger issue
4. **Check Mobile Context** - PWA vs web browser differences

## **📊 Expected Debug Output**

When expert sends message, you should see:
```
🚀 Expert sending message: { taskId: "abc123", expertEmail: "expert@...", message: "Hello" }
Message added to task: abc123
🔔 Checking notification conditions: { shouldSendNotification: true, expertEmail: "...", userEmail: "..." }
🚀 About to send task message notification: { taskId: "abc123", senderRole: "expert" }
📤 [Frontend] Sending notification via Cloud Function: { taskId: "abc123" }
[SW] Background message received: { notification: {...}, data: {...} }
```

**Missing any of these logs = exact failure point identified! 🎯**
