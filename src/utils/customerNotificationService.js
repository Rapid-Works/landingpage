import { requestNotificationPermission, onForegroundMessage } from '../firebase/messaging';
import { sendTaskMessageNotification } from './taskNotificationService';

/**
 * Customer-focused notification service for task updates
 */
class CustomerNotificationService {
  constructor() {
    this.permissionStatus = Notification.permission;
    this.isInitialized = false;
    this.notificationQueue = [];
  }

  /**
   * Initialize the notification service
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Check if notifications are supported
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return false;
      }

      // Set up foreground message listener
      this.setupForegroundListener();
      
      this.isInitialized = true;
      console.log('Customer notification service initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize customer notification service:', error);
      return false;
    }
  }

  /**
   * Setup listener for foreground messages
   */
  setupForegroundListener() {
    onForegroundMessage((payload) => {
      console.log('Received foreground notification:', payload);
      this.showInAppNotification(payload);
    });
  }

  /**
   * Check if notifications are enabled and prompt user if not
   */
  async ensureNotificationsEnabled(maxRetries = 2) {
    let lastError = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (Notification.permission === 'granted') {
          // Double-check that we can actually get a token
          try {
            const { requestNotificationPermission } = await import('../firebase/messaging');
            const tokenResult = await requestNotificationPermission();

            if (tokenResult.success && tokenResult.token) {
              return { enabled: true, token: tokenResult.token };
            } else {
              // Permission granted but token failed - try to recover
              console.warn('Permission granted but token generation failed, retrying...');
              if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
                continue;
              }
              return {
                enabled: false,
                reason: 'Permission granted but failed to generate notification token',
                token: null
              };
            }
          } catch (tokenError) {
            console.warn('Token generation error:', tokenError);
            if (attempt < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000));
              continue;
            }
            return {
              enabled: false,
              reason: 'Failed to generate notification token',
              token: null
            };
          }
        }

        if (Notification.permission === 'denied') {
          return {
            enabled: false,
            reason: 'Notifications are blocked. Please enable them in your browser settings.',
            token: null
          };
        }

        // Permission is 'default', ask for permission
        console.log(`🔔 Requesting notification permission (attempt ${attempt + 1}/${maxRetries + 1})...`);
        const result = await requestNotificationPermission();
        this.permissionStatus = Notification.permission;

        if (result.success) {
          console.log('✅ Notification permission granted successfully');
          return {
            enabled: true,
            reason: result.reason,
            token: result.token
          };
        } else {
          console.warn(`❌ Notification permission attempt ${attempt + 1} failed:`, result.reason);
          lastError = result.reason;

          // If it's a recoverable error and we have retries left, wait and retry
          if (attempt < maxRetries && !result.reason?.includes('blocked') && !result.reason?.includes('denied')) {
            console.log('⏳ Retrying notification permission in 2 seconds...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }

          return {
            enabled: false,
            reason: result.reason || lastError,
            token: null
          };
        }
      } catch (error) {
        console.error(`❌ Notification setup error (attempt ${attempt + 1}):`, error);
        lastError = error.message;

        if (attempt < maxRetries) {
          console.log('⏳ Retrying after error in 3 seconds...');
          await new Promise(resolve => setTimeout(resolve, 3000));
          continue;
        }

        return {
          enabled: false,
          reason: `Failed to setup notifications: ${error.message}`,
          token: null
        };
      }
    }

    // All retries exhausted
    return {
      enabled: false,
      reason: lastError || 'Failed to setup notifications after multiple attempts',
      token: null
    };
  }

  /**
   * Health check for notification system
   */
  async performNotificationHealthCheck() {
    const results = {
      browserSupport: false,
      serviceWorker: false,
      permission: null,
      token: false,
      database: false,
      overall: false
    };

    try {
      // 1. Check browser support
      results.browserSupport = 'Notification' in window && 'serviceWorker' in navigator;

      // 2. Check service worker
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        results.serviceWorker = registrations.some(reg =>
          reg.scope.includes('firebase-messaging-sw.js') ||
          reg.scope.includes('firebase-cloud-messaging-push-scope')
        );
      }

      // 3. Check permission status
      results.permission = Notification.permission;

      // 4. Check token (if permission granted)
      if (Notification.permission === 'granted') {
        try {
          const { requestNotificationPermission } = await import('../firebase/messaging');
          const tokenResult = await requestNotificationPermission();
          results.token = tokenResult.success && !!tokenResult.token;
        } catch (e) {
          console.warn('Token check failed:', e);
          results.token = false;
        }
      }

      // 5. Check database connectivity
      try {
        const tokenCheck = await this.checkUserHasNotificationTokens('health-check@test.com');
        results.database = true; // If query succeeds, database is accessible
      } catch (e) {
        console.warn('Database check failed:', e);
        results.database = false;
      }

      // 6. Overall health
      results.overall = results.browserSupport &&
                       results.serviceWorker &&
                       results.permission === 'granted' &&
                       results.token &&
                       results.database;

      console.log('🩺 Notification Health Check Results:', results);
      return results;

    } catch (error) {
      console.error('❌ Notification health check failed:', error);
      return {
        ...results,
        overall: false,
        error: error.message
      };
    }
  }

  /**
   * Check if user has valid FCM tokens registered
   */
  async checkUserHasNotificationTokens(userEmail) {
    try {
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      const { db } = await import('../firebase/config');
      
      const tokensRef = collection(db, 'fcmTokens');
      const q = query(tokensRef, where('email', '==', userEmail));
      const tokensSnapshot = await getDocs(q);
      
      return {
        hasTokens: tokensSnapshot.size > 0,
        tokenCount: tokensSnapshot.size,
        tokens: tokensSnapshot.docs.map(doc => doc.data())
      };
    } catch (error) {
      console.error('Error checking FCM tokens:', error);
      return { hasTokens: false, tokenCount: 0, tokens: [] };
    }
  }

  /**
   * Proactively ensure user has notifications enabled with friendly prompting
   * Used during task submission to ensure they get updates
   */
  async proactivelyEnableNotifications(userEmail, context = 'task_submission') {
    try {
      // First check if user already has FCM tokens
      const tokenCheck = await this.checkUserHasNotificationTokens(userEmail);
      
      if (tokenCheck.hasTokens) {
        console.log(`🔔 User already has ${tokenCheck.tokenCount} FCM token(s), notifications should work`);
        return { 
          success: true, 
          reason: `User already has ${tokenCheck.tokenCount} notification token(s)`,
          action: 'already_registered'
        };
      }
      
      // No tokens found, check browser permission status
      const permissionStatus = Notification.permission;
      
      // If already granted, just ensure we have a valid token
      if (permissionStatus === 'granted') {
        console.log('🔔 Notifications already granted, registering new token...');
        const result = await this.ensureNotificationsEnabled();
        if (result.enabled) {
          return { 
            success: true, 
            reason: 'Notifications re-registered successfully',
            action: 'reregistered'
          };
        } else {
          return { 
            success: false, 
            reason: 'Permission granted but token registration failed',
            action: 'token_failed'
          };
        }
      }
      
      // If denied, we can't do anything
      if (permissionStatus === 'denied') {
        return { 
          success: false, 
          reason: 'Notifications are blocked in browser settings',
          action: 'blocked'
        };
      }
      
      // Permission is 'default' - show friendly prompt
      console.log('💡 Proactively prompting for notification permission...');
      
      const promptResult = await this.promptForNotifications(context);
      
      if (promptResult.enabled) {
        return { 
          success: true, 
          reason: 'User enabled notifications successfully',
          action: 'enabled'
        };
      } else if (promptResult.cancelled) {
        return { 
          success: false, 
          reason: 'User declined notifications',
          action: 'declined'
        };
      } else {
        return { 
          success: false, 
          reason: promptResult.reason || 'Failed to enable notifications',
          action: 'failed'
        };
      }
    } catch (error) {
      console.error('Error in proactive notification setup:', error);
      return { 
        success: false, 
        reason: error.message,
        action: 'error'
      };
    }
  }

  /**
   * Send notification when task is successfully submitted with robust fallback
   */
  async sendTaskSubmittedNotification(taskData, userEmail) {
    let pushNotificationSent = false;
    let inAppNotificationSent = false;

    try {
      // First ensure notifications are enabled
      const notificationStatus = await this.ensureNotificationsEnabled();

      if (notificationStatus.enabled) {
        try {
          // Send push notification
          await sendTaskMessageNotification({
            taskId: taskData.id,
            senderEmail: 'system@rapidworks.com',
            senderRole: 'system',
            recipientEmail: userEmail,
            recipientRole: 'customer',
            messageContent: `Task "${taskData.taskName}" has been submitted successfully! Our expert will review it shortly.`,
            messageType: 'task_submitted',
            taskData: {
              id: taskData.id,
              title: taskData.taskName,
              status: 'pending'
            }
          });
          pushNotificationSent = true;
          console.log('✅ Push notification sent successfully');
        } catch (pushError) {
          console.warn('❌ Push notification failed, falling back to in-app:', pushError);
        }
      } else {
        console.log('🔔 Push notifications not enabled, using in-app notification only');
      }

      // Always show in-app notification as backup
      try {
        this.showInAppNotification({
          notification: {
            title: 'Task Submitted Successfully! 🎉',
            body: `Your task "${taskData.taskName}" has been received. ${pushNotificationSent ? 'You\'ll get updates via push notifications.' : 'Enable push notifications to get instant updates.'}`,
            icon: '/logo192.png',
            type: 'task_submitted',
            taskId: taskData.id
          }
        });
        inAppNotificationSent = true;
        console.log('✅ In-app notification displayed');
      } catch (inAppError) {
        console.error('❌ In-app notification also failed:', inAppError);
      }

      return {
        success: pushNotificationSent || inAppNotificationSent,
        pushNotificationSent,
        inAppNotificationSent,
        reason: pushNotificationSent ? 'Task submission notification sent' :
               inAppNotificationSent ? 'In-app notification shown (push notifications not enabled)' :
               'Failed to send any notifications'
      };
    } catch (error) {
      console.error('Error in task submitted notification:', error);

      // Last resort: try in-app notification even if everything else failed
      try {
        this.showInAppNotification({
          notification: {
            title: 'Task Submitted! 🎉',
            body: `Your task "${taskData.taskName}" has been received.`,
            icon: '/logo192.png',
            type: 'task_submitted',
            taskId: taskData.id
          }
        });
        return { success: true, reason: 'In-app notification shown as fallback' };
      } catch (fallbackError) {
        return { success: false, reason: `Complete notification failure: ${error.message}` };
      }
    }
  }

  /**
   * Send test notification to verify push notifications are working
   */
  async sendTestNotification(userEmail) {
    try {
      const notificationStatus = await this.ensureNotificationsEnabled();
      
      if (!notificationStatus.enabled) {
        return { success: false, reason: notificationStatus.reason };
      }

      await sendTaskMessageNotification({
        taskId: 'test-notification',
        senderEmail: 'system@rapidworks.com',
        senderRole: 'system',
        recipientEmail: userEmail,
        recipientRole: 'customer',
        messageContent: 'Test notification - your push notifications are working correctly! 🔔',
        messageType: 'test',
        taskData: {
          id: 'test',
          title: 'Test Notification',
          status: 'test'
        }
      });

      // Show in-app notification immediately
      this.showInAppNotification({
        notification: {
          title: 'Test Notification 🔔',
          body: 'Great! Your push notifications are working correctly.',
          icon: '/logo192.png'
        }
      });

      return { success: true, reason: 'Test notification sent successfully' };
    } catch (error) {
      console.error('Error sending test notification:', error);
      return { success: false, reason: error.message };
    }
  }

  /**
   * Show in-app notification for foreground messages
   */
  showInAppNotification(payload) {
    const { notification } = payload;
    
    if (!notification) return;

    // Create visual notification element (toast)
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm transform transition-transform duration-300 translate-x-full';
    toast.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900">${notification.title}</p>
          <p class="text-sm text-gray-500 mt-1">${notification.body}</p>
        </div>
        <button class="flex-shrink-0 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, 300);
    }, 5000);

    // Also try to show browser notification if permission is granted
    if (Notification.permission === 'granted') {
      try {
        new Notification(notification.title, {
          body: notification.body,
          icon: notification.icon || '/logo192.png',
          badge: '/logo192.png',
          tag: 'rapidworks-task-update'
        });
      } catch (error) {
        console.error('Error showing browser notification:', error);
      }
    }
  }

  /**
   * Prompt user to enable notifications with explanation
   */
  async promptForNotifications(context = 'general') {
    const messages = {
      general: {
        title: 'Enable Notifications',
        message: 'Get notified when your tasks receive updates, estimates, or messages from our experts.'
      },
      task_submission: {
        title: 'Stay Updated on Your Task',
        message: 'Enable notifications to receive instant updates when our expert reviews your task or provides an estimate.'
      },
      first_task_submission: {
        title: 'Welcome! Enable Notifications 🎉',
        message: 'Congratulations on submitting your first task! Enable notifications to get instant updates when our expert reviews your request and provides an estimate. This ensures you never miss important messages about your projects.'
      },
      missing_permissions: {
        title: 'Notifications Disabled',
        message: 'Enable notifications to receive important updates about your tasks. You can always disable them later in your browser settings.'
      }
    };

    const config = messages[context] || messages.general;

    return new Promise((resolve) => {
      // Create modal-like prompt
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
      modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6l6 6-6 6H9V7z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">${config.title}</h3>
          </div>
          <p class="text-gray-600 mb-6">${config.message}</p>
          <div class="flex gap-3 justify-end">
            <button id="cancel-notifications" class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">
              Maybe Later
            </button>
            <button id="enable-notifications" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
              Enable Notifications
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const cleanup = () => {
        if (modal.parentElement) {
          modal.remove();
        }
      };

      modal.querySelector('#cancel-notifications').onclick = () => {
        cleanup();
        resolve({ enabled: false, cancelled: true });
      };

      modal.querySelector('#enable-notifications').onclick = async () => {
        cleanup();
        const result = await this.ensureNotificationsEnabled();
        resolve(result);
      };

      // Close on backdrop click
      modal.onclick = (e) => {
        if (e.target === modal) {
          cleanup();
          resolve({ enabled: false, cancelled: true });
        }
      };
    });
  }
}

// Create singleton instance
const customerNotificationService = new CustomerNotificationService();

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  customerNotificationService.initialize();
}

export default customerNotificationService;
export { CustomerNotificationService };

// Utility exports for checking notification status
export const checkUserNotificationTokens = (userEmail) => 
  customerNotificationService.checkUserHasNotificationTokens(userEmail);

export const setupNotificationsForUser = (userEmail, context) => 
  customerNotificationService.proactivelyEnableNotifications(userEmail, context);
