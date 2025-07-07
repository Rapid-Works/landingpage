// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDoIexsBB5I8ylX2t2N4fxVjVcsst71c5Y",
  authDomain: "landingpage-606e9.firebaseapp.com",
  projectId: "landingpage-606e9",
  storageBucket: "landingpage-606e9.firebasestorage.app",
  messagingSenderId: "449487247565",
  appId: "1:449487247565:web:7bf02a5898cb57a13cb184",
  measurementId: "G-7SZ0GLF9L1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const messaging = getMessaging(app);

export default app; 