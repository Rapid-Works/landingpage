import React, { createContext, useContext, useState, useEffect } from 'react';
import { onForegroundMessage } from '../firebase/messaging';

const NotificationContext = createContext();

export const useNotifications = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Listen for incoming foreground messages
    const unsubscribe = onForegroundMessage((payload) => {
      console.log('🔔 FOREGROUND MESSAGE RECEIVED:', payload);
      console.log('🔔 Message data:', payload.data);
      console.log('🔔 Notification data:', payload.notification);
      const newNotification = {
        id: payload.messageId || new Date().getTime(),
        title: payload.notification.title,
        body: payload.notification.body,
        url: payload.data?.url || '/blogs',
        timestamp: new Date().toISOString(),
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setNotificationCount(prev => prev + 1);
    });

    // Load initial notifications from storage if they exist
    const savedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
    setNotifications(savedNotifications);
    setNotificationCount(savedNotifications.length);

    return () => {
      // Cleanup the listener when the component unmounts
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const markAsRead = () => {
    setNotificationCount(0);
    localStorage.setItem('notifications', JSON.stringify([])); // Clear storage
    // Optionally, you might want to keep notifications but have a 'read' flag
  };

  const value = {
    notifications,
    notificationCount,
    markAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 