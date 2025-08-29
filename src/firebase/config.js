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

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services with mobile-safe error handling
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize functions safely
let functionsInstance;
try {
  functionsInstance = getFunctions(app);
} catch (error) {
  console.warn('Firebase Functions initialization failed:', error);
  functionsInstance = null;
}
export const functions = functionsInstance;

// Initialize analytics safely (can cause issues on mobile)
let analyticsInstance;
try {
  // Only initialize analytics on desktop or when explicitly supported
  const isMobile = typeof navigator !== 'undefined' &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (!isMobile) {
    analyticsInstance = getAnalytics(app);
    console.log('✅ Firebase Analytics initialized (desktop)');
  } else {
    console.log('📱 Skipping Firebase Analytics on mobile to prevent conflicts');
  }
} catch (error) {
  console.warn('Firebase Analytics initialization failed:', error);
  analyticsInstance = null;
}
export const analytics = analyticsInstance;

// Initialize messaging safely for mobile
let messagingInstance;
try {
  messagingInstance = getMessaging(app);
  console.log('✅ Firebase Messaging initialized');
} catch (error) {
  console.warn('Firebase Messaging initialization failed:', error);
  messagingInstance = null;
}
export const messaging = messagingInstance;

export default app;