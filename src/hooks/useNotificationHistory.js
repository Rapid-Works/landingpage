import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export const useNotificationHistory = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📝 Loading notification history from Firestore...');
      const notificationsRef = collection(db, 'notificationHistory');
      const q = query(
        notificationsRef,
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const notificationsList = [];
          let unread = 0;
          
          snapshot.forEach((doc) => {
            const data = { id: doc.id, ...doc.data() };
            notificationsList.push(data);
            if (!data.read) {
              unread++;
            }
          });
          
          console.log(`📝 Found ${notificationsList.length} notifications, ${unread} unread`);
          setNotifications(notificationsList);
          setUnreadCount(unread);
          setLoading(false);
        },
        (err) => {
          console.log('⚠️ Could not load notification history, showing empty state:', err);
          setNotifications([]);
          setUnreadCount(0);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.log('⚠️ Error setting up notification history listener:', error);
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
    }
  }, [currentUser]);

  return {
    notifications,
    unreadCount,
    loading,
    error
  };
}; 