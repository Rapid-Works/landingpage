import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

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

  // Reset password
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
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
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 