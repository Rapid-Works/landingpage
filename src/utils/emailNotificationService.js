import { getFunctions, httpsCallable } from 'firebase/functions';

/**
 * Email Notification Service
 * Provides reliable email notifications as an alternative to FCM
 */
class EmailNotificationService {
  constructor() {
    this.functions = getFunctions();
  }

  /**
   * Send task update email notification
   */
  async sendTaskUpdateEmail(userEmail, taskName, message, taskId = null, language = 'en') {
    try {
      const sendEmail = httpsCallable(this.functions, 'sendTaskUpdateEmail');
      const result = await sendEmail({
        userEmail,
        taskName,
        message,
        taskId,
        language
      });

      console.log('✅ Task update email sent:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Failed to send task update email:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send task completed email notification
   */
  async sendTaskCompletedEmail(userEmail, taskName, estimateTime = null, taskId = null, language = 'en') {
    try {
      const sendEmail = httpsCallable(this.functions, 'sendTaskCompletedEmail');
      const result = await sendEmail({
        userEmail,
        taskName,
        estimateTime,
        taskId,
        language
      });

      console.log('✅ Task completed email sent:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Failed to send task completed email:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send expert message email notification
   */
  async sendExpertMessageEmail(userEmail, taskName, expertName, message, taskId = null, language = 'en') {
    try {
      const sendEmail = httpsCallable(this.functions, 'sendExpertMessageEmail');
      const result = await sendEmail({
        userEmail,
        taskName,
        expertName,
        message,
        taskId,
        language
      });

      console.log('✅ Expert message email sent:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Failed to send expert message email:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send test email to verify email notifications work
   */
  async sendTestEmail(userEmail, language = 'en') {
    try {
      const sendEmail = httpsCallable(this.functions, 'sendTestEmail');
      const result = await sendEmail({
        userEmail,
        language
      });

      console.log('✅ Test email sent:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Failed to send test email:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send notification via email (universal method)
   * Automatically detects notification type and sends appropriate email
   */
  async sendNotification(type, userEmail, data, language = 'en') {
    switch (type) {
      case 'task_update':
        return await this.sendTaskUpdateEmail(
          userEmail,
          data.taskName,
          data.message,
          data.taskId,
          language
        );

      case 'task_completed':
        return await this.sendTaskCompletedEmail(
          userEmail,
          data.taskName,
          data.estimateTime,
          data.taskId,
          language
        );

      case 'expert_message':
        return await this.sendExpertMessageEmail(
          userEmail,
          data.taskName,
          data.expertName,
          data.message,
          data.taskId,
          language
        );

      case 'test':
        return await this.sendTestEmail(userEmail, language);

      default:
        console.warn('Unknown notification type:', type);
        return { success: false, error: 'Unknown notification type' };
    }
  }

  /**
   * Multi-channel notification sender
   * Tries email as primary, with optional SMS for urgent notifications
   */
  async sendReliableNotification(userEmail, notificationData, isUrgent = false) {
    const results = [];

    // Always send email
    const emailResult = await this.sendNotification(
      notificationData.type,
      userEmail,
      notificationData
    );
    results.push({ channel: 'email', ...emailResult });

    // TODO: Add SMS for urgent notifications
    if (isUrgent) {
      console.log('🚨 Urgent notification - consider implementing SMS backup');
      // Future: SMS implementation here
    }

    return {
      success: results.some(r => r.success),
      results,
      primaryChannel: 'email'
    };
  }

  /**
   * Check if email notifications are available
   * Always returns true since email is universally supported
   */
  isEmailNotificationAvailable() {
    return true;
  }

  /**
   * Get email notification status
   */
  getEmailNotificationStatus() {
    return {
      available: true,
      reliable: true,
      supportsRichContent: true,
      platform: 'universal',
      deliveryRate: '~99%'
    };
  }

  /**
   * Get user's current language preference
   * Reads from localStorage or defaults to 'en'
   */
  getUserLanguage() {
    try {
      return localStorage.getItem('language') || 'en';
    } catch (error) {
      console.warn('Could not read language from localStorage:', error);
      return 'en';
    }
  }

  /**
   * Send notification with automatic language detection
   * Uses the current user's language preference from localStorage
   */
  async sendNotificationWithUserLanguage(type, userEmail, data) {
    const language = this.getUserLanguage();
    console.log(`📧 Sending ${type} email notification in ${language} to ${userEmail}`);
    return await this.sendNotification(type, userEmail, data, language);
  }
}

// Create and export singleton instance
const emailNotificationService = new EmailNotificationService();
export default emailNotificationService;

// Named exports for specific functions
export {
  EmailNotificationService
};
