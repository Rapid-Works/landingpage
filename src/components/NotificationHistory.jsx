import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Clock, ExternalLink, X, Trash2, CheckCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  writeBatch 
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const NotificationHistory = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Real-time listener for notifications
  useEffect(() => {
    if (!currentUser || !isOpen) return;

    setLoading(true);
    setError('');
    
    try {
      console.log('📨 Loading notification history for modal...');
      const notificationsRef = collection(db, 'notificationHistory');
      const q = query(
        notificationsRef,
        where('userId', '==', currentUser.uid)
        // Removed orderBy to avoid index requirement - will sort in client
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const notificationsList = [];
          snapshot.forEach((doc) => {
            notificationsList.push({
              id: doc.id,
              ...doc.data()
            });
          });
          // Sort by createdAt descending on client side
          notificationsList.sort((a, b) => {
            const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
            const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
            return bTime - aTime;
          });
          
          console.log(`📨 Loaded ${notificationsList.length} notifications in modal`);
          setNotifications(notificationsList);
          setLoading(false);
        },
        (err) => {
          console.log('⚠️ Could not load notification history for modal:', err);
          setNotifications([]); // Set empty array instead of error
          setLoading(false);
        }
      );
      
             return () => unsubscribe();
     } catch (error) {
       console.log('⚠️ Error setting up notification history modal listener:', error);
       setNotifications([]);
       setLoading(false);
     }
  }, [currentUser, isOpen]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, 'notificationHistory', notificationId);
      await updateDoc(notificationRef, {
        read: true,
        readAt: new Date()
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark notification as unread
  const markAsUnread = async (notificationId) => {
    try {
      const notificationRef = doc(db, 'notificationHistory', notificationId);
      await updateDoc(notificationRef, {
        read: false,
        readAt: null
      });
    } catch (error) {
      console.error('Error marking notification as unread:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const batch = writeBatch(db);
      const unreadNotifications = notifications.filter(n => !n.read);
      
      unreadNotifications.forEach((notification) => {
        const notificationRef = doc(db, 'notificationHistory', notification.id);
        batch.update(notificationRef, {
          read: true,
          readAt: new Date()
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Mark all notifications as unread
  const markAllAsUnread = async () => {
    try {
      const batch = writeBatch(db);
      const readNotifications = notifications.filter(n => n.read);
      
      readNotifications.forEach((notification) => {
        const notificationRef = doc(db, 'notificationHistory', notification.id);
        batch.update(notificationRef, {
          read: false,
          readAt: null
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error marking all notifications as unread:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await deleteDoc(doc(db, 'notificationHistory', notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate to URL if provided
    if (notification.url) {
      onClose();
      navigate(notification.url);
    }
  };

  // Get notification icon and color based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'branding_kit_ready':
        return { icon: <Check className="h-5 w-5" />, color: 'text-green-500', bg: 'bg-green-100' };
      case 'new_blog_post':
        return { icon: <Bell className="h-5 w-5" />, color: 'text-blue-500', bg: 'bg-blue-100' };
      default:
        return { icon: <Bell className="h-5 w-5" />, color: 'text-gray-500', bg: 'bg-gray-100' };
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays}d ago`;
      } else {
        return date.toLocaleDateString();
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const readCount = notifications.filter(n => n.read).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl w-full max-w-2xl mx-auto shadow-2xl max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#7C3BEC]/10 rounded-lg">
                  <Bell className="h-6 w-6 text-[#7C3BEC]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Notification History</h2>
                  <p className="text-sm text-gray-500">
                    {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-[#7C3BEC] text-white rounded-lg hover:bg-[#6B32D6] transition-colors"
                  >
                    <CheckCheck className="h-4 w-4" />
                    Mark all read
                  </button>
                )}
                {readCount > 0 && (
                  <button
                    onClick={markAllAsUnread}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Bell className="h-4 w-4" />
                    Mark all unread
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3BEC]"></div>
                  <span className="ml-3 text-gray-600">Loading notifications...</span>
                </div>
              ) : error ? (
                <div className="p-6 text-center">
                  <div className="text-red-500 mb-2">⚠️</div>
                  <p className="text-gray-600">{error}</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
                  <p className="text-gray-500">You'll see your notification history here when you receive notifications.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => {
                    const { icon, color, bg } = getNotificationIcon(notification.type);
                    
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative ${
                          !notification.read ? 'bg-blue-50/30' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        {/* Unread indicator */}
                        {!notification.read && (
                          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                        
                        <div className="flex items-start gap-4 ml-4">
                          {/* Icon */}
                          <div className={`p-2 rounded-lg ${bg} flex-shrink-0`}>
                            <div className={color}>
                              {icon}
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </h4>
                                <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
                                  {notification.body}
                                </p>
                              </div>
                              
                              {/* Actions */}
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {notification.url && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNotificationClick(notification);
                                    }}
                                    className="p-1 text-gray-400 hover:text-[#7C3BEC] rounded"
                                    title="Open"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </button>
                                )}
                                {notification.read ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsUnread(notification.id);
                                    }}
                                    className="p-1 text-gray-400 hover:text-blue-500 rounded"
                                    title="Mark as unread"
                                  >
                                    <Bell className="h-4 w-4" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification.id);
                                    }}
                                    className="p-1 text-gray-400 hover:text-green-500 rounded"
                                    title="Mark as read"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-500 rounded"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            
                            {/* Timestamp */}
                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-400">
                                {formatTimestamp(notification.createdAt)}
                              </span>
                              {notification.read && (
                                <span className="text-xs text-gray-400">• Read</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default NotificationHistory; 