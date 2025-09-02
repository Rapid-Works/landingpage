# 🔍 Debug Chat Notifications

## Browser Console Debug Commands

### 1. Check Current User & Tokens
```javascript
// Check if you're logged in
console.log('Current user:', auth.currentUser?.email);

// Check your FCM tokens in Firestore
(async () => {
  const { collection, query, where, getDocs } = await import('firebase/firestore');
  const { db } = await import('./src/firebase/config.js');
  
  const tokensQuery = query(
    collection(db, 'fcmTokens'),
    where('email', '==', auth.currentUser.email)
  );
  const tokens = await getDocs(tokensQuery);
  console.log('Your FCM tokens:', tokens.docs.map(doc => doc.data()));
})();
```

### 2. Check Notification Preferences
```javascript
(async () => {
  const { doc, getDoc } = await import('firebase/firestore');
  const { db } = await import('./src/firebase/config.js');
  
  const prefsRef = doc(db, 'userNotificationPreferences', auth.currentUser.uid);
  const prefs = await getDoc(prefsRef);
  console.log('Your notification preferences:', prefs.data());
})();
```

### 3. Manual Notification Test
```javascript
(async () => {
  const { httpsCallable } = await import('firebase/functions');
  const { functions } = await import('./src/firebase/config.js');
  
  const sendTestNotification = httpsCallable(functions, 'sendTestMobileNotification');
  const result = await sendTestNotification({
    userEmail: auth.currentUser.email,
    testType: 'manual_test'
  });
  console.log('Test notification result:', result.data);
})();
```

### 4. Send Test Task Message Notification
```javascript
(async () => {
  const { httpsCallable } = await import('firebase/functions');
  const { functions } = await import('./src/firebase/config.js');
  
  const sendTaskNotification = httpsCallable(functions, 'sendTaskMessageNotification');
  const result = await sendTaskNotification({
    taskId: 'test-task-123',
    senderEmail: 'sender@example.com',
    senderRole: 'expert',
    recipientEmail: auth.currentUser.email,
    recipientRole: 'customer',
    messageContent: 'Test message from debug',
    messageType: 'message',
    taskData: {
      id: 'test-task-123',
      title: 'Debug Test Task',
      status: 'active'
    }
  });
  console.log('Task notification result:', result.data);
})();
```

## What to Look For

### ✅ Good Logs (Notifications Should Work):
```
🔔 Checking notification conditions: {
  sendNotification: true,
  messageSender: "customer",
  userEmail: "user@example.com", 
  expertEmail: "expert@example.com",
  shouldSendNotification: true  ← This should be true
}

🔔 NOTIFICATION SERVICE: Attempting to send task notification: {
  taskId: "abc123",
  recipientEmail: "expert@example.com",
  ...
}

✅ Task message notification sent successfully: {
  notificationsSent: 1,
  hasTokens: true
}
```

### ❌ Problem Logs:
```
🔔 Checking notification conditions: {
  shouldSendNotification: false  ← Problem!
}

// OR

Failed to send task message notification: Error: ...
```

## Common Fixes

### Fix 1: No FCM Tokens
If you see `hasTokens: false` or empty tokens array:
1. Clear localStorage: `localStorage.clear()`
2. Refresh page and enable notifications again
3. Check that notification permission is granted

### Fix 2: Wrong Email Addresses
If userEmail or expertEmail is null:
1. Check that the task document has both emails populated
2. Verify you're testing with actual task between real users

### Fix 3: System Messages
If sender is "system":
- System messages don't trigger notifications by design
- Only "customer" and "expert" messages trigger notifications

### Fix 4: Notification Preferences Disabled
If taskMessages.mobile is false:
1. Go to Dashboard → Notification Settings
2. Enable "Task Messages" notifications
3. Or manually update in Firestore

### Fix 5: Permission Denied
If Notification.permission is "denied":
1. Click lock icon in browser address bar
2. Change notifications to "Allow"
3. Refresh page
