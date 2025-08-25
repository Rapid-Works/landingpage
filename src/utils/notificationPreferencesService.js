import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

// Default preferences - both mobile and email enabled for all notification types
export const DEFAULT_PREFERENCES = {
  blogNotifications: {
    mobile: true,
    email: true
  },
  brandingKitReady: {
    mobile: true,
    email: true
  },
  taskMessages: {
    mobile: true,
    email: true
  }
};

/**
 * Get user's notification preferences from Firestore
 * @param {string} userId - User's unique ID
 * @returns {Promise<Object>} User's notification preferences or defaults
 */
export const getUserNotificationPreferences = async (userId) => {
  try {
    const docRef = doc(db, 'userNotificationPreferences', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.preferences || DEFAULT_PREFERENCES;
    }
    
    // Return defaults if document doesn't exist
    return DEFAULT_PREFERENCES;
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    // Return defaults on error
    return DEFAULT_PREFERENCES;
  }
};

/**
 * Check if user has mobile notifications enabled for a specific type
 * @param {Object} preferences - User's notification preferences
 * @param {string} notificationType - Type of notification ('blogNotifications', 'brandingKitReady')
 * @returns {boolean} Whether mobile notifications are enabled
 */
export const isMobileNotificationEnabled = (preferences, notificationType) => {
  return preferences?.[notificationType]?.mobile === true;
};

/**
 * Check if user has email notifications enabled for a specific type
 * @param {Object} preferences - User's notification preferences
 * @param {string} notificationType - Type of notification ('blogNotifications', 'brandingKitReady')
 * @returns {boolean} Whether email notifications are enabled
 */
export const isEmailNotificationEnabled = (preferences, notificationType) => {
  return preferences?.[notificationType]?.email === true;
};

/**
 * Filter FCM tokens based on user preferences for mobile notifications
 * @param {Array} tokens - Array of FCM token objects with email
 * @param {string} notificationType - Type of notification
 * @returns {Promise<Array>} Filtered array of tokens for users who want mobile notifications
 */
export const filterTokensForMobileNotifications = async (tokens, notificationType) => {
  const filteredTokens = [];
  
  for (const tokenData of tokens) {
    try {
      // For backward compatibility, if no email is associated, assume they want notifications
      if (!tokenData.email) {
        filteredTokens.push(tokenData);
        continue;
      }
      
      // Get user preferences (this would need to be implemented in Firebase Functions)
      // For now, we'll assume all users want mobile notifications (backward compatibility)
      filteredTokens.push(tokenData);
    } catch (error) {
      console.error('Error checking preferences for token:', error);
      // On error, include the token (fail-safe)
      filteredTokens.push(tokenData);
    }
  }
  
  return filteredTokens;
}; 