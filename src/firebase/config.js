// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Add Firebase Storage
import { getFunctions } from "firebase/functions"; // Add this line
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
// Using environment variables for better security practices

// Validate required environment variables
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required Firebase environment variables:', missingEnvVars);
  console.error('Please check your .env file or environment variables in production');
}

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

console.log('🔧 Firebase config loaded:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  hasStorageBucket: !!firebaseConfig.storageBucket,
  hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
  hasAppId: !!firebaseConfig.appId,
  hasAnalyticsId: !!firebaseConfig.measurementId
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services with error handling
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Initialize Analytics with error handling (can fail on mobile with ad blockers)
let analytics;
try {
  analytics = getAnalytics(app);
  console.log('✅ Firebase Analytics initialized');
} catch (error) {
  console.warn('⚠️ Firebase Analytics failed to initialize (non-critical):', error.message);
  analytics = null;
}
export { analytics };

// Initialize Messaging with proper browser support detection
let messaging = null;

// Check if we're in a browser environment and if messaging is supported
const initializeMessaging = async () => {
  if (typeof window === 'undefined') {
    console.log('🔇 Server-side rendering - Firebase Messaging skipped');
    return;
  }

  try {
    // Check if the browser supports Firebase Messaging
    const { isSupported } = await import('firebase/messaging');
    const messagingSupported = await isSupported();
    
    if (!messagingSupported) {
      console.log('📱 Firebase Messaging not supported in this browser (common on mobile)');
      return;
    }

    // Check if required APIs are available
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('📱 Service Worker or Push API not supported - skipping Firebase Messaging');
      return;
    }

    // Additional mobile browser checks
    const isMobileSafari = /iPhone|iPad|iPod/i.test(navigator.userAgent) && /Safari/i.test(navigator.userAgent);
    if (isMobileSafari) {
      console.log('📱 Mobile Safari detected - Firebase Messaging has limited support');
      // Still try to initialize but expect it might fail
    }

    messaging = getMessaging(app);
    console.log('✅ Firebase Messaging initialized successfully');
    
  } catch (error) {
    console.warn('⚠️ Firebase Messaging initialization failed (non-critical):', error.message);
    messaging = null;
  }
};

// Initialize messaging asynchronously to avoid blocking app startup
if (typeof window !== 'undefined') {
  initializeMessaging().catch(error => {
    console.warn('⚠️ Async messaging initialization failed:', error.message);
  });
}

export { messaging };

export default app;