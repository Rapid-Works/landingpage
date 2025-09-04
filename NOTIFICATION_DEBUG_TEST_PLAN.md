# 🚨 Push Notification Debug Test Plan

## Step-by-Step Testing Checklist

### **Step 1: Test Notification Infrastructure** ✅ 
- [x] Test notifications work from Notification Settings
- [x] User has valid FCM token
- [x] Browser permissions granted
- **Result**: ✅ Working (shown in screenshot)

### **Step 2: Test Task Creation Flow**
1. **Create a new task** as customer
2. **Check browser console** for logs:
   ```
   ✅ LOOK FOR: "Submitting task request:"
   ✅ LOOK FOR: "Task request saved with ID:"
   ✅ LOOK FOR: "🔔 NOTIFICATION SERVICE: Attempting to send task notification"
   ```

### **Step 3: Test Expert Message Flow** 🎯 **MAIN TEST**
1. **Expert opens task** in dashboard
2. **Expert types message** and clicks send
3. **Check browser console** for these EXACT logs:

```javascript
// STEP 3A: Message addition
✅ LOOK FOR: "Message added to task: [taskId]"

// STEP 3B: Notification condition check
✅ LOOK FOR: "🔔 Checking notification conditions: {
  sendNotification: true,
  messageSender: 'expert',
  userEmail: '[customer-email]',
  expertEmail: '[expert-email]',
  shouldSendNotification: true/false  // ⚠️ KEY VALUE
}"

// STEP 3C: Notification attempt (if shouldSendNotification = true)
✅ LOOK FOR: "🚀 About to send task message notification:"

// STEP 3D: Cloud function call
✅ LOOK FOR: "📤 Sending notification with data:"

// STEP 3E: Success/failure
✅ LOOK FOR: "✅ Task message notification sent successfully"
OR
❌ LOOK FOR: "❌ Failed to send task message notification:"
```

### **Step 4: Debug Points Based on Results**

#### **🟢 If `shouldSendNotification: true` but no push received:**
- Check **Firebase Functions logs** for Cloud Function execution
- Check **user FCM tokens** in Firebase console
- Check **notification preferences** in user settings

#### **🔴 If `shouldSendNotification: false`:**
Check which condition failed:
- `sendNotification`: Should be `true`
- `message.sender`: Should be `'expert'`
- `taskData.userEmail`: Should be customer email
- `taskData.expertEmail`: Should be expert email ⚠️ **LIKELY CULPRIT**

#### **🟡 If no logs at all:**
- `addTaskMessage` function not called
- Message not being sent properly
- JavaScript error preventing execution

## Common Issues & Solutions

### **Issue 1: Missing expertEmail**
**Symptom**: `expertEmail: null` or `undefined`
**Solution**: Check task creation - ensure `expertEmail` field is set

### **Issue 2: Wrong expert assigned**
**Symptom**: `expertEmail` doesn't match current expert
**Solution**: Check task assignment logic

### **Issue 3: Cloud Function fails**
**Symptom**: Logs show notification attempt but Cloud Function errors
**Solution**: Check Firebase Functions console logs

### **Issue 4: No FCM tokens**
**Symptom**: `hasTokens: false` in Cloud Function response
**Solution**: User needs to enable notifications

## Test Commands

```javascript
// Check task data in console
console.log('Current task data:', taskData);

// Check user notification tokens
console.log('User email:', currentUser?.email);

// Manual notification test
// (Run in browser console on dashboard)
import('./src/utils/taskNotificationService.js').then(service => {
  service.sendTaskMessageNotification({
    taskId: 'test-task-id',
    senderEmail: 'expert@rapid-works.io',
    senderRole: 'expert',
    recipientEmail: 'customer@example.com',
    recipientRole: 'customer',
    messageContent: 'Test message',
    messageType: 'message',
    taskData: { id: 'test', title: 'Test Task', status: 'pending' }
  });
});
```

## Next Steps After Testing

1. **Run the test** and collect console logs
2. **Identify the failure point** using the debug points above
3. **Apply specific fix** based on the issue found
4. **Re-test** to confirm fix

---
**🎯 The key is to see EXACTLY where the flow breaks in Step 3!**
