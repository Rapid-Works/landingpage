import { requestNotificationPermission, onForegroundMessage } from '../firebase/messaging';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

class NotificationInitService {
  constructor() {
    this.initialized = false;
    this.foregroundListener = null;
  }

  /**
   * Initialize notifications for a user
   * @param {Object} user - Firebase auth user object
   * @param {boolean} silent - Whether to show UI prompts
   */
  async initializeForUser(user, silent = false) {
    if (!user || this.initialized) return;

    console.log('🔔 Initializing notifications for user:', user.email);

    try {
      // Check if user already has valid tokens
      const hasValidTokens = await this.checkUserTokens(user.email);
      
      if (hasValidTokens) {
        console.log('✅ User already has valid notification tokens');
        this.setupForegroundListener();
        this.initialized = true;
        return { success: true, hasTokens: true };
      }

      // If silent mode, don't prompt for permission
      if (silent) {
        console.log('🔇 Silent mode - not prompting for notification permission');
        return { success: false, reason: 'Silent mode - no prompt' };
      }

      // Check device capabilities
      const deviceSupport = this.checkDeviceSupport();
      if (!deviceSupport.supported) {
        console.log('📱 Device does not support notifications:', deviceSupport.reason);
        return { success: false, reason: deviceSupport.reason };
      }

      // For mobile browsers, check PWA status
      if (deviceSupport.requiresPWA && !deviceSupport.isPWA) {
        console.log('📱 Mobile browser detected - PWA installation required');
        return { 
          success: false, 
          reason: 'PWA installation required',
          requiresPWA: true 
        };
      }

      // Auto-request permission for desktop or PWA
      if (!deviceSupport.isMobile || deviceSupport.isPWA) {
        const result = await this.autoRequestPermission(user);
        if (result.success) {
          this.setupForegroundListener();
          this.initialized = true;
        }
        return result;
      }

      return { success: false, reason: 'Manual permission required' };

    } catch (error) {
      console.error('❌ Error initializing notifications:', error);
      return { success: false, reason: error.message };
    }
  }

  /**
   * Check if user has valid FCM tokens
   */
  async checkUserTokens(userEmail) {
    try {
      const tokensQuery = query(
        collection(db, 'fcmTokens'),
        where('email', '==', userEmail)
      );
      const tokensSnapshot = await getDocs(tokensQuery);
      return tokensSnapshot.docs.length > 0;
    } catch (error) {
      console.error('Error checking user tokens:', error);
      return false;
    }
  }

  /**
   * Check device support for notifications
   */
  checkDeviceSupport() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isPWA = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    const isInAppBrowser = /FBAN|FBAV|Instagram|Twitter|LinkedIn|WhatsApp/i.test(navigator.userAgent);

    // Check if Notification API is available
    if (typeof Notification === 'undefined') {
      return {
        supported: false,
        reason: 'Notification API not supported',
        isMobile,
        isPWA
      };
    }

    // Block in-app browsers
    if (isInAppBrowser) {
      return {
        supported: false,
        reason: 'In-app browsers not supported',
        isMobile,
        isPWA
      };
    }

    // iOS Safari browser (not PWA) - requires PWA
    if (isIOS && !isPWA) {
      return {
        supported: true,
        requiresPWA: true,
        reason: 'iOS requires PWA installation',
        isMobile,
        isPWA
      };
    }

    // Mobile browsers (not PWA) - better to use PWA
    if (isMobile && !isPWA) {
      return {
        supported: true,
        requiresPWA: true,
        reason: 'Mobile browsers work better as PWA',
        isMobile,
        isPWA
      };
    }

    return {
      supported: true,
      requiresPWA: false,
      isMobile,
      isPWA
    };
  }

  /**
   * Auto-request notification permission (for desktop/PWA)
   */
  async autoRequestPermission(user) {
    try {
      // Check current permission status
      const currentPermission = Notification.permission;
      
      if (currentPermission === 'granted') {
        // Permission already granted, try to get token
        const result = await requestNotificationPermission();
        return result;
      }

      if (currentPermission === 'denied') {
        return {
          success: false,
          reason: 'Notification permission denied',
          requiresManualEnable: true
        };
      }

      // Permission is 'default', can request automatically
      const result = await requestNotificationPermission();
      return result;

    } catch (error) {
      console.error('Error auto-requesting permission:', error);
      return {
        success: false,
        reason: 'Failed to request permission: ' + error.message
      };
    }
  }

  /**
   * Setup foreground message listener
   */
  setupForegroundListener() {
    if (this.foregroundListener) {
      console.log('🔔 Foreground listener already setup');
      return;
    }

    console.log('🔔 Setting up foreground message listener');
    
    this.foregroundListener = onForegroundMessage((payload) => {
      console.log('📱 Received foreground notification:', payload);
      
      // Show browser notification for foreground messages
      this.showForegroundNotification(payload);
      
      // Dispatch custom event for UI components to listen to
      const event = new CustomEvent('foregroundNotification', {
        detail: payload
      });
      window.dispatchEvent(event);
    });
  }

  /**
   * Show browser notification for foreground messages
   */
  showForegroundNotification(payload) {
    if (Notification.permission !== 'granted') return;

    try {
      const title = payload.notification?.title || 'New Message';
      const body = payload.notification?.body || 'You have a new message';
      const icon = payload.notification?.icon || '/logo192.png';

      const notification = new Notification(title, {
        body,
        icon,
        badge: '/logo192.png',
        tag: payload.data?.type || 'foreground',
        requireInteraction: false,
        silent: false
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Handle click
      notification.onclick = () => {
        window.focus();
        if (payload.data?.url) {
          window.location.href = payload.data.url;
        }
        notification.close();
      };

    } catch (error) {
      console.error('Error showing foreground notification:', error);
    }
  }

  /**
   * Reset initialization state
   */
  reset() {
    this.initialized = false;
    if (this.foregroundListener) {
      // Note: Firebase doesn't provide unsubscribe for onMessage
      // We'll just mark as reset and reinitialize when needed
      this.foregroundListener = null;
    }
  }

  /**
   * Check if notifications are working for user
   */
  async diagnostics(userEmail) {
    const results = {
      timestamp: new Date().toISOString(),
      userEmail,
      deviceSupport: this.checkDeviceSupport(),
      permissionStatus: typeof Notification !== 'undefined' ? Notification.permission : 'not_supported',
      hasTokens: false,
      initialized: this.initialized
    };

    if (userEmail) {
      results.hasTokens = await this.checkUserTokens(userEmail);
    }

    console.log('🔍 Notification diagnostics:', results);
    return results;
  }
}

// Create singleton instance
const notificationInitService = new NotificationInitService();

export default notificationInitService;

// Export individual functions for convenience
export const {
  initializeForUser,
  checkUserTokens,
  checkDeviceSupport,
  diagnostics,
  reset
} = notificationInitService;
