import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/config';

/**
 * Handle missing FCM tokens by attempting to register for notifications
 * @param {string} userEmail - Email of user who needs notification registration
 */
const handleMissingFCMTokens = async (userEmail) => {
  // Check if this is the current user
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  if (currentUser.email === userEmail) {
    console.log('🔔 Current user missing FCM tokens - attempting auto-registration');
    
    // Try to import and use the notification registration from messaging
    try {
      const { requestNotificationPermission } = await import('../firebase/messaging');
      await requestNotificationPermission();
      console.log('✅ Successfully auto-registered for notifications');
      return true;
    } catch (error) {
      console.log('⚠️ Auto-registration failed, user needs to manually enable:', error);
      
      // Show a non-intrusive notification to the user
      if ('Notification' in window && Notification.permission === 'default') {
        console.log('💡 Showing notification prompt suggestion');
        // Could show a toast or banner here
      }
      return false;
    }
  } else {
    console.log('📧 Notification for different user - cannot auto-register');
    return false;
  }
};

/**
 * Send notification when a new task message is added
 * @param {Object} params - Notification parameters
 * @param {string} params.taskId - Task ID
 * @param {string} params.senderEmail - Email of message sender
 * @param {string} params.senderRole - Role of sender ('expert' or 'customer')
 * @param {string} params.recipientEmail - Email of message recipient
 * @param {string} params.recipientRole - Role of recipient ('expert' or 'customer')
 * @param {string} params.messageContent - Content of the message
 * @param {string} params.messageType - Type of message ('message', 'estimate', 'task_created')
 * @param {Object} params.taskData - Basic task information
 */
export const sendTaskMessageNotification = async ({
  taskId,
  senderEmail,
  senderRole,
  recipientEmail,
  recipientRole,
  messageContent,
  messageType = 'message',
  taskData
}) => {
  try {
    console.log('🔔 NOTIFICATION SERVICE: Attempting to send task notification:', {
      taskId,
      senderEmail,
      senderRole,
      recipientEmail,
      recipientRole,
      messageType,
      messagePreview: messageContent.substring(0, 50)
    });

    const sendTaskNotification = httpsCallable(functions, 'sendTaskMessageNotification');
    
    const notificationData = {
      taskId,
      senderEmail,
      senderRole,
      recipientEmail,
      recipientRole,
      messageContent: messageContent.substring(0, 100), // Limit content length for notification
      messageType,
      taskData: {
        id: taskData.id,
        title: taskData.title || taskData.service || 'Task',
        status: taskData.status
      }
    };

    console.log('📤 Sending notification with data:', notificationData);
    
    const result = await sendTaskNotification(notificationData);
    
    console.log('✅ Task message notification sent successfully:', result.data);
    
    // If no FCM tokens were found, try to prompt user to enable notifications
    if (result.data && !result.data.hasTokens) {
      console.log('💡 No FCM tokens found for recipient - user should enable notifications');
      
      // Try to automatically register for notifications if possible
      try {
        await handleMissingFCMTokens(recipientEmail);
      } catch (autoRegisterError) {
        console.log('⚠️ Could not auto-register for notifications:', autoRegisterError);
      }
    }
    
    return result.data;
  } catch (error) {
    console.error('❌ Error sending task message notification:', error);
    console.error('❌ Error details:', {
      code: error.code,
      message: error.message,
      details: error.details
    });
    // Don't throw error to prevent message sending from failing
    // Notifications are nice-to-have, not critical
  }
};

/**
 * Send notification when a new task is created
 * @param {Object} params - Task creation parameters
 */
export const sendTaskCreatedNotification = async ({
  taskId,
  customerEmail,
  expertEmail,
  taskData
}) => {
  if (!expertEmail) {
    console.log('No expert email provided, skipping task creation notification');
    return;
  }

  return sendTaskMessageNotification({
    taskId,
    senderEmail: customerEmail,
    senderRole: 'customer',
    recipientEmail: expertEmail,
    recipientRole: 'expert',
    messageContent: `New task created: ${taskData.title || taskData.service}`,
    messageType: 'task_created',
    taskData
  });
};

/**
 * Send notification when an estimate is provided
 * @param {Object} params - Estimate parameters
 */
export const sendEstimateNotification = async ({
  taskId,
  expertEmail,
  customerEmail,
  estimateAmount,
  taskData
}) => {
  return sendTaskMessageNotification({
    taskId,
    senderEmail: expertEmail,
    senderRole: 'expert',
    recipientEmail: customerEmail,
    recipientRole: 'customer',
    messageContent: `Estimate provided: €${estimateAmount}`,
    messageType: 'estimate',
    taskData
  });
};

export default {
  sendTaskMessageNotification,
  sendTaskCreatedNotification,
  sendEstimateNotification
};
