import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const useNotificationSubscription = () => {
  const { currentUser } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setIsSubscribed(false);
      setLoading(false);
      return;
    }
    
    checkSubscriptionStatus();
  }, [currentUser]);

  const checkSubscriptionStatus = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // Check if user has FCM tokens (means they're subscribed to notifications)
      const tokensQuery = query(
        collection(db, 'fcmTokens'),
        where('email', '==', currentUser.email)
      );
      const tokensSnapshot = await getDocs(tokensQuery);
      
      setIsSubscribed(tokensSnapshot.docs.length > 0);
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setIsSubscribed(false);
    } finally {
      setLoading(false);
    }
  };

  return { 
    isSubscribed, 
    loading, 
    checkSubscriptionStatus 
  };
}; 