// Email Verification Utilities
// Helps manage rate limiting and state for email verification

const EMAIL_VERIFICATION_COOLDOWN = 60000; // 1 minute
const EMAIL_VERIFICATION_CACHE = 300000; // 5 minutes

/**
 * Check if user recently received a verification email
 * @param {string} email - User's email address
 * @returns {Object} - Status object with isRecent, timeRemaining, etc.
 */
export const checkRecentEmailVerification = (email) => {
  if (!email) return { isRecent: false, timeRemaining: 0 };
  
  const key = `email_verification_sent_${email}`;
  const lastSentStr = localStorage.getItem(key);
  
  if (!lastSentStr) {
    return { isRecent: false, timeRemaining: 0 };
  }
  
  const lastSent = parseInt(lastSentStr);
  const now = Date.now();
  const timeSinceLastSent = now - lastSent;
  
  // Check if within cache period (user was recently sent an email)
  const isRecent = timeSinceLastSent < EMAIL_VERIFICATION_CACHE;
  
  // Check cooldown for resending
  const cooldownRemaining = Math.max(0, EMAIL_VERIFICATION_COOLDOWN - timeSinceLastSent);
  const canResend = cooldownRemaining === 0;
  
  return {
    isRecent,
    canResend,
    timeRemaining: Math.ceil(cooldownRemaining / 1000),
    lastSentTime: lastSent,
    timeSinceLastSent
  };
};

/**
 * Mark that a verification email was sent
 * @param {string} email - User's email address
 */
export const markEmailVerificationSent = (email) => {
  if (!email) return;
  
  const key = `email_verification_sent_${email}`;
  const now = Date.now();
  localStorage.setItem(key, now.toString());
};

/**
 * Clear verification email cache (useful for testing or logout)
 * @param {string} email - User's email address
 */
export const clearEmailVerificationCache = (email) => {
  if (!email) return;
  
  const key = `email_verification_sent_${email}`;
  localStorage.removeItem(key);
};

/**
 * Get user-friendly error message for email verification errors
 * @param {Error} error - The error object from Firebase
 * @returns {string} - User-friendly error message
 */
export const getEmailVerificationErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred.';
  
  const errorCode = error.code || '';
  const errorMessage = error.message || '';
  
  // Rate limiting errors
  if (errorCode === 'auth/too-many-requests' || error.isRateLimit) {
    if (errorMessage.includes('wait')) {
      return errorMessage; // Use the specific message with time
    }
    return 'Too many verification emails sent. Please wait a few minutes before trying again.';
  }
  
  // Function-specific errors
  if (errorCode === 'functions/deadline-exceeded') {
    return 'Request timed out. Please check your internet connection and try again.';
  }
  
  if (errorCode === 'functions/internal') {
    return 'Service temporarily unavailable. Please try again in a few minutes.';
  }
  
  if (errorCode === 'functions/unauthenticated') {
    return 'Authentication error. Please sign out and sign back in.';
  }
  
  if (errorCode === 'functions/permission-denied') {
    return 'Permission denied. Please contact support.';
  }
  
  // Auth-specific errors
  if (errorCode === 'auth/invalid-email') {
    return 'Invalid email address. Please check your email and try again.';
  }
  
  if (errorCode === 'auth/user-not-found') {
    return 'No account found with this email address.';
  }
  
  if (errorCode === 'auth/network-request-failed') {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  // Quota errors
  if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
    return 'Service temporarily at capacity. Please try again in a few minutes.';
  }
  
  // Generic fallback
  if (errorMessage.length > 0 && errorMessage.length < 200) {
    return errorMessage;
  }
  
  return 'Failed to send verification email. Please try again or contact support.';
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if we should automatically send verification email
 * @param {Object} user - Current user object
 * @returns {boolean} - Whether to auto-send
 */
export const shouldAutoSendVerification = (user) => {
  if (!user || user.emailVerified) return false;
  
  // Check if we recently sent an email
  const status = checkRecentEmailVerification(user.email);
  
  // Don't auto-send if we recently sent one
  return !status.isRecent;
};
