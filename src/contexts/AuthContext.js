import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider, functions } from '../firebase/config';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import notificationInitService from '../utils/notificationInitService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  // Create or update user document in Firestore
  const ensureUserDocument = useCallback(async (user) => {
    if (!user) return;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        photoURL: user.photoURL || null,
        updatedAt: serverTimestamp()
      }, { merge: true }); // merge: true preserves existing fields like currentOrganizationId
      
      console.log('✅ User document created/updated for:', user.email);
    } catch (error) {
      console.error('❌ Error creating/updating user document:', error);
    }
  }, [db]);

  // Sign up with email and password
  async function signup(email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await ensureUserDocument(userCredential.user);
    return userCredential;
  }

  // Sign in with email and password
  async function login(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await ensureUserDocument(userCredential.user);
    return userCredential;
  }

  // Sign in with Google
  async function loginWithGoogle() {
    const userCredential = await signInWithPopup(auth, googleProvider);
    await ensureUserDocument(userCredential.user);
    return userCredential;
  }

  // Logout
  function logout() {
    return signOut(auth);
  }

  // Rate limiting for email verification
  const emailVerificationCooldown = new Map();
  const VERIFICATION_COOLDOWN_MS = 60000; // 1 minute

  // Send email verification using custom function with rate limiting
  async function sendVerificationEmail(user) {
    console.log('📧 Starting email verification for:', user.email);
    
    // Development bypass for rate limiting
    const isDevelopment = process.env.NODE_ENV === 'development' || 
                         window.location.hostname === 'localhost' ||
                         window.location.hostname.includes('127.0.0.1');
    
    // Check rate limiting (skip in development)
    if (!isDevelopment) {
      const now = Date.now();
      const lastSent = emailVerificationCooldown.get(user.email);
      
      if (lastSent && (now - lastSent) < VERIFICATION_COOLDOWN_MS) {
        const remainingTime = Math.ceil((VERIFICATION_COOLDOWN_MS - (now - lastSent)) / 1000);
        const error = new Error(`Please wait ${remainingTime} seconds before requesting another verification email`);
        error.code = 'auth/too-many-requests';
        error.isRateLimit = true;
        throw error;
      }
    } else {
      console.log('🚧 Development mode: Skipping rate limiting');
    }
    
    try {
      // Check if functions are available
      if (!functions) {
        console.warn('⚠️ Firebase Functions not initialized, using fallback');
        throw new Error('Functions not available');
      }
      
      console.log('☁️ Calling custom email verification function...');
      
      // Set rate limit before attempting (if not in development)
      if (!isDevelopment) {
        const now = Date.now();
        emailVerificationCooldown.set(user.email, now);
      }
      
      // Use our custom Cloud Function for branded verification emails
      const sendCustomEmailVerification = httpsCallable(functions, 'sendCustomEmailVerification');
      const result = await sendCustomEmailVerification({ 
        email: user.email,
        displayName: user.displayName 
      });
      console.log('✅ Custom email verification sent successfully:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Custom email verification failed:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
      
      // Check for specific errors that shouldn't trigger fallback
      if (error.code === 'auth/too-many-requests' || 
          error.code === 'functions/deadline-exceeded' ||
          error.isRateLimit) {
        // Don't attempt fallback for rate limiting errors
        throw error;
      }
      
      // Fallback to Firebase default if our custom function fails
      console.log('🔄 Falling back to Firebase default email verification');
      try {
        const fallbackResult = await sendEmailVerification(user);
        console.log('✅ Fallback email verification sent');
        return fallbackResult;
      } catch (fallbackError) {
        console.error('❌ Even fallback failed:', fallbackError);
        
        // Provide user-friendly error messages
        if (fallbackError.code === 'auth/too-many-requests') {
          const enhancedError = new Error('Too many verification emails sent. Please wait a few minutes before trying again.');
          enhancedError.code = 'auth/too-many-requests';
          enhancedError.isRateLimit = true;
          throw enhancedError;
        }
        
        throw fallbackError;
      }
    }
  }

  // Reset password using custom function
  async function resetPassword(email) {
    console.log('🔐 Starting password reset for:', email);
    
    try {
      // Check if functions are available
      if (!functions) {
        console.error('❌ Firebase Functions not initialized');
        throw new Error('Functions not available');
      }
      
      console.log('☁️ Calling custom password reset function...');
      // Use our custom Cloud Function for branded password reset emails
      const sendCustomPasswordReset = httpsCallable(functions, 'sendCustomPasswordReset');
      const result = await sendCustomPasswordReset({ email });
      console.log('✅ Custom password reset sent successfully:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Custom password reset failed:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
      
      // Fallback to Firebase default if our custom function fails
      console.log('🔄 Falling back to Firebase default password reset');
      try {
        const fallbackResult = await sendPasswordResetEmail(auth, email);
        console.log('✅ Fallback password reset sent');
        return fallbackResult;
      } catch (fallbackError) {
        console.error('❌ Even fallback failed:', fallbackError);
        throw fallbackError;
      }
    }
  }

  // Update user profile
  function updateUserProfile(user, profile) {
    return updateProfile(user, profile);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      // Ensure user document exists whenever auth state changes
      if (user) {
        await ensureUserDocument(user);
        
        // Initialize notifications silently (no UI prompts)
        // This will check if user has existing tokens and setup listeners
        try {
          await notificationInitService.initializeForUser(user, true);
        } catch (error) {
          console.log('📱 Silent notification initialization skipped:', error.message);
        }
      } else {
        // Reset notification service when user logs out
        notificationInitService.reset();
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [ensureUserDocument]);

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    sendVerificationEmail,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 