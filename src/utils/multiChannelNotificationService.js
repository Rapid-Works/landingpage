/**
 * Multi-Channel Notification Service
 * Provides reliable cross-platform notifications with intelligent fallbacks
 */

import { auth } from '../firebase/config';
import { getFunctions, httpsCallable } from 'firebase/functions';

class MultiChannelNotificationService {
  constructor() {
    this.functions = getFunctions();
    this.channels = {
      webPush: this.detectWebPushSupport(),
      email: true,
      webSocket: typeof window !== 'undefined',
      sms: false // Enable when needed
    };
  }

  /**
   * Detect if web push notifications are supported and safe to use
   */
  detectWebPushSupport() {
    if (typeof window === 'undefined') return false;
    
    const userAgent = navigator.userAgent;
    const isAndroid = /Android/i.test(userAgent);
    const isiOS = /iPhone|iPad|iPod/i.test(userAgent);
    const isDesktop = !isAndroid && !isiOS;
    const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    const hasNotificationAPI = typeof window.Notification !== 'undefined';
    
    // Web push support matrix
    if (isDesktop && hasNotificationAPI) return true; // Desktop: Full support
    if (isAndroid && hasNotificationAPI) return true; // Android: Partial support
    if (isiOS && isStandalone && hasNotificationAPI) return true; // iOS PWA only
    
    return false; // iOS Safari, old browsers
  }

  /**
   * Send notification through multiple channels with intelligent routing
   */
  async sendNotification(notification) {
    const results = [];
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error('User must be authenticated to send notifications');
    }

    // Channel 1: Real-time WebSocket (for active users)
    if (this.channels.webSocket && this.isUserOnline()) {
      try {
        results.push(await this.sendWebSocketNotification(notification));
      } catch (error) {
        console.warn('WebSocket notification failed:', error.message);
      }
    }

    // Channel 2: Web Push (Android/Desktop)
    if (this.channels.webPush) {
      try {
        results.push(await this.sendWebPushNotification(currentUser, notification));
      } catch (error) {
        console.warn('Web push notification failed:', error.message);
      }
    }

    // Channel 3: Email (Always as fallback)
    try {
      results.push(await this.sendEmailNotification(currentUser, notification));
    } catch (error) {
      console.error('Email notification failed:', error.message);
    }

    // Channel 4: SMS (Urgent notifications only)
    if (notification.urgent && this.channels.sms) {
      try {
        results.push(await this.sendSMSNotification(currentUser, notification));
      } catch (error) {
        console.warn('SMS notification failed:', error.message);
      }
    }

    return results;
  }

  /**
   * Send real-time notification via WebSocket/Firestore listener
   */
  async sendWebSocketNotification(notification) {
    // This works through your existing Firestore real-time listeners
    const updateUserPresence = httpsCallable(this.functions, 'updateUserPresence');
    
    return await updateUserPresence({
      type: 'notification',
      data: notification,
      timestamp: Date.now()
    });
  }

  /**
   * Send web push notification (Android/Desktop only)
   */
  async sendWebPushNotification(user, notification) {
    const sendWebPush = httpsCallable(this.functions, 'sendWebPushNotification');
    
    return await sendWebPush({
      userEmail: user.email,
      notification: {
        title: notification.title,
        body: notification.body,
        icon: notification.icon || '/logo192.png',
        badge: '/logo192.png',
        data: notification.data || {}
      }
    });
  }

  /**
   * Send email notification (Universal fallback)
   */
  async sendEmailNotification(user, notification) {
    const sendEmail = httpsCallable(this.functions, 'sendEmailNotification');
    
    return await sendEmail({
      userEmail: user.email,
      userName: user.displayName || user.email.split('@')[0],
      notification: {
        subject: notification.title,
        body: notification.emailBody || notification.body,
        actionUrl: notification.actionUrl,
        priority: notification.urgent ? 'high' : 'normal'
      }
    });
  }

  /**
   * Send SMS notification (Urgent only)
   */
  async sendSMSNotification(user, notification) {
    const sendSMS = httpsCallable(this.functions, 'sendSMSNotification');
    
    return await sendSMS({
      userEmail: user.email,
      notification: {
        message: notification.smsBody || notification.body,
        urgent: true
      }
    });
  }

  /**
   * Check if user is currently online and active
   */
  isUserOnline() {
    return navigator.onLine && document.visibilityState === 'visible';
  }

  /**
   * Get notification delivery capabilities for current platform
   */
  getCapabilities() {
    const userAgent = navigator.userAgent;
    const isAndroid = /Android/i.test(userAgent);
    const isiOS = /iPhone|iPad|iPod/i.test(userAgent);
    const isDesktop = !isAndroid && !isiOS;
    const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;

    return {
      platform: isDesktop ? 'desktop' : isAndroid ? 'android' : 'ios',
      webPush: this.channels.webPush,
      email: this.channels.email,
      webSocket: this.channels.webSocket,
      reliabilityScore: this.calculateReliabilityScore(isDesktop, isAndroid, isiOS, isStandalone),
      recommendations: this.getRecommendations(isDesktop, isAndroid, isiOS, isStandalone)
    };
  }

  /**
   * Calculate expected notification reliability for current platform
   */
  calculateReliabilityScore(isDesktop, isAndroid, isiOS, isStandalone) {
    if (isDesktop) return 95; // Desktop web push works great
    if (isAndroid) return 75; // Android Chrome has issues but works
    if (isiOS && isStandalone) return 80; // iOS PWA limited but works
    if (isiOS) return 40; // iOS Safari very limited
    return 60; // Other platforms
  }

  /**
   * Get platform-specific recommendations
   */
  getRecommendations(isDesktop, isAndroid, isiOS, isStandalone) {
    if (isDesktop) {
      return ['Web push notifications work reliably', 'Email backup recommended'];
    }
    if (isAndroid) {
      return ['Install our mobile app for better notifications', 'Web push partially supported', 'Email backup included'];
    }
    if (isiOS && isStandalone) {
      return ['Add to home screen completed ✓', 'Limited push support', 'Email backup recommended'];
    }
    if (isiOS) {
      return ['Add to home screen for notifications', 'Email notifications enabled', 'Consider our iOS app'];
    }
    return ['Email notifications enabled', 'Consider our mobile app'];
  }
}

// Predefined notification templates
export const NotificationTemplates = {
  TASK_COMPLETED: {
    title: '✅ Task Completed',
    body: 'Your task has been completed successfully!',
    emailBody: 'Great news! Your task has been completed and is ready for review.',
    icon: '/logo192.png',
    urgent: false
  },
  
  TASK_UPDATE: {
    title: '📝 Task Update',
    body: 'There\'s an update on your task',
    emailBody: 'Your task has been updated with new information.',
    icon: '/logo192.png',
    urgent: false
  },
  
  URGENT_TASK: {
    title: '🚨 Urgent Task',
    body: 'Action required on your task',
    emailBody: 'This task requires your immediate attention.',
    smsBody: 'Urgent: Your RapidWorks task needs attention',
    icon: '/logo192.png',
    urgent: true
  },
  
  PAYMENT_RECEIVED: {
    title: '💰 Payment Received',
    body: 'Payment has been processed successfully',
    emailBody: 'Your payment has been received and processed.',
    icon: '/logo192.png',
    urgent: false
  }
};

const multiChannelNotificationService = new MultiChannelNotificationService();
export default multiChannelNotificationService;
