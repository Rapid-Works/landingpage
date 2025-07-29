// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions"; // Add this line
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
// Using environment variables for better security practices
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDoIexsBB5I8ylX2t2N4fxVjVcsst71c5Y",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "landingpage-606e9.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "landingpage-606e9",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "landingpage-606e9.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "449487247565",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:449487247565:web:7bf02a5898cb57a13cb184",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-7SZ0GLF9L1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const functions = getFunctions(app); // Add this line
export const analytics = getAnalytics(app);
export const messaging = getMessaging(app);

export default app;