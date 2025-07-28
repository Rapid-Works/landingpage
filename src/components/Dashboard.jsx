import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, Layers, Bell, BellRing, Check, X, Loader2, Edit, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RapidWorksHeader from './new_landing_page_header';
import BrandingKits from './BrandingKits';
import UserAvatar from './UserAvatar';
import ProfileEditModal from './ProfileEditModal';
import NotificationHistory from './NotificationHistory';
import { getMessaging, getToken } from 'firebase/messaging';
import { db, auth } from '../firebase/config';
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { useSmartNotificationStatus } from '../hooks/useSmartNotificationStatus';

const accent = "#7C3BEC";
const VAPID_KEY = 'BC9X8U5hWzbbGbbB8x_net_q4eG5RA798jZxKcOPS5e5joRHXN7XcCS2yv-UwCKY0lZZ59mOOspl_aSWEjSV33M';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [notificationState, setNotificationState] = useState('default'); // 'default', 'loading', 'error'
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationHistoryOpen, setIsNotificationHistoryOpen] = useState(false);
  const { hasAnyNotificationsEnabled: isSubscribed, loading: subscriptionLoading, forceRefresh: checkSubscriptionStatus } = useSmartNotificationStatus();

  // Better notification permission handler without alerts
  const requestNotificationPermissionSilent = async () => {
    try {
      // Check if notifications are supported
      if (!('Notification' in window)) {
        console.log('Notifications not supported');
        return { success: false, reason: 'not_supported' };
      }

      // Check current permission state
      const permission = Notification.permission;
      
      // If already granted, try to get token
      if (permission === 'granted') {
        return await getNotificationToken();
      }
      
      // If already denied, don't request again
      if (permission === 'denied') {
        console.log('Notifications previously denied');
        return { success: false, reason: 'denied' };
      }

      // Request permission (permission is 'default')
      const newPermission = await Notification.requestPermission();
      
      if (newPermission === 'granted') {
        return await getNotificationToken();
      } else {
        console.log('User denied notification permission');
        return { success: false, reason: 'user_denied' };
      }
      
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return { success: false, reason: 'error', error };
    }
  };

  const getNotificationToken = async () => {
    try {
      const messaging = getMessaging();
      const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
      
      if (currentToken) {
        // Get current user email if available
        const currentUser = auth.currentUser;
        const userEmail = currentUser?.email || null;
        
        // Remove any existing tokens for this user/device to avoid duplicates
        if (userEmail) {
          const tokensCollection = collection(db, 'fcmTokens');
          const existingTokensQuery = query(tokensCollection, where('email', '==', userEmail));
          const existingTokensSnapshot = await getDocs(existingTokensQuery);
          
          // Delete existing tokens for this user
          const deletePromises = existingTokensSnapshot.docs.map(doc => deleteDoc(doc.ref));
          await Promise.all(deletePromises);
        }
        
        // Store the new token with user email
        const tokensCollection = collection(db, 'fcmTokens');
        await addDoc(tokensCollection, {
          token: currentToken,
          email: userEmail,
          createdAt: serverTimestamp(),
        });
        
        console.log('Successfully subscribed to notifications');
        return { success: true, token: currentToken };
      } else {
        console.log('No registration token available');
        return { success: false, reason: 'no_token' };
      }
    } catch (error) {
      console.error('Error getting notification token:', error);
      return { success: false, reason: 'token_error', error };
    }
  };

  const handleSubscribeToNotifications = async () => {
    // If already subscribed, show a friendly message
    if (isSubscribed) {
      setNotificationMessage('You are already subscribed to notifications! 🎉');
      setTimeout(() => {
        setNotificationMessage('');
      }, 3000);
      return;
    }
    
    setNotificationState('loading');
    setNotificationMessage('');
    
    const permissionResult = await requestNotificationPermissionSilent();
    
    if (permissionResult.success) {
      // DEVELOPMENT: Set mock FCM token in localStorage
      localStorage.setItem(`fcmToken_${currentUser.email}`, 'mock-fcm-token-' + Date.now());
      
      // Refresh subscription status to show updated state
      checkSubscriptionStatus();
      
      setNotificationState('default');
      setNotificationMessage('🎉 Perfect! You\'ll get notified when your branding kits are ready.');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setNotificationMessage('');
      }, 3000);
    } else {
      setNotificationState('error');
      setNotificationMessage('Failed to subscribe. Please try again.');
      
      // Reset to default after 5 seconds
      setTimeout(() => {
        setNotificationState('default');
        setNotificationMessage('');
      }, 5000);
    }
  };

  const getNotificationButtonContent = () => {
    // Show loading state while checking subscription status
    if (subscriptionLoading) {
      return (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Checking...</span>
        </>
      );
    }

    // Show subscribed state if user is already subscribed
    if (isSubscribed) {
      return (
        <>
          <Check className="h-5 w-5" />
          <span>Notifications Enabled</span>
        </>
      );
    }

    // Show appropriate state based on subscription process
    switch (notificationState) {
      case 'loading':
        return (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Subscribing...</span>
          </>
        );
      case 'error':
        return (
          <>
            <X className="h-5 w-5" />
            <span>Try Again</span>
          </>
        );
      default:
        return (
          <>
            <BellRing className="h-5 w-5" />
            <span>Enable Notifications</span>
          </>
        );
    }
  };

  const getNotificationButtonStyles = () => {
    // If loading subscription status
    if (subscriptionLoading) {
      return 'bg-gray-400 cursor-not-allowed';
    }

    // If already subscribed, show green success state
    if (isSubscribed) {
      return 'bg-green-500 hover:bg-green-600 cursor-pointer';
    }

    // Show appropriate state based on subscription process
    switch (notificationState) {
      case 'loading':
        return 'bg-gray-500 cursor-not-allowed';
      case 'error':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <RapidWorksHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-10 mb-10 flex flex-col items-center justify-center overflow-hidden"
          style={{ boxShadow: `0 8px 32px 0 ${accent}22` }}
        >
          {/* Glassmorphism background effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/60 to-white/80 pointer-events-none rounded-2xl" style={{ zIndex: 0 }} />
          <div className="relative z-10 flex flex-col items-center">
            {/* Profile Avatar with Edit Button */}
            <div className="relative group">
              <div className="w-28 h-28 min-w-28 min-h-28 bg-[#7C3BEC] rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-xl" style={{ aspectRatio: '1 / 1' }}>
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-full h-full object-cover"
                    style={{ aspectRatio: '1 / 1' }}
                  />
                ) : (
                  <span className="font-bold text-white text-2xl">
                    {currentUser?.displayName 
                      ? currentUser.displayName.split(' ').length > 1
                        ? `${currentUser.displayName.split(' ')[0][0]}${currentUser.displayName.split(' ')[currentUser.displayName.split(' ').length - 1][0]}`.toUpperCase()
                        : currentUser.displayName.substring(0, 2).toUpperCase()
                      : 'NN'
                    }
                  </span>
                )}
              </div>
              
              {/* Edit Button Overlay */}
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="absolute bottom-2 right-2 bg-[#7C3BEC] hover:bg-[#6B32D6] text-white p-2 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 group-hover:scale-100 opacity-90 hover:opacity-100"
                title="Edit Profile"
              >
                <Edit className="h-3 w-3" />
              </button>
            </div>
            
            <h2 className="text-4xl font-extrabold text-gray-900 mt-6 mb-2 tracking-tight">
              Welcome back, {currentUser?.displayName || currentUser?.email}!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Ready to build your brand today?
            </p>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <button onClick={() => navigate('/branding')} className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-105 transition-transform">
                <Layers className="h-5 w-5" /> Create New Kit
              </button>
              
              <button 
                onClick={handleSubscribeToNotifications}
                disabled={subscriptionLoading || notificationState === 'loading'}
                className={`${getNotificationButtonStyles()} text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100`}
              >
                {getNotificationButtonContent()}
              </button>
              
              <button 
                onClick={() => setIsNotificationHistoryOpen(true)} 
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
              >
                <History className="h-5 w-5" /> Notifications
              </button>
              
              <a href="https://calendly.com/yannick-familie-heeren/30min" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform">
                <Calendar className="h-5 w-5" /> Book a Call
              </a>
            </div>

            {/* Notification Status Message */}
            {notificationMessage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 px-4 py-2 rounded-full text-sm font-medium ${
                  notificationState === 'success' 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}
              >
                {notificationMessage}
              </motion.div>
            )}
          </div>
        </motion.div>



        {/* Branding Kits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <BrandingKits />
        </motion.div>
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />

      {/* Notification History Modal */}
      <NotificationHistory 
        isOpen={isNotificationHistoryOpen} 
        onClose={() => setIsNotificationHistoryOpen(false)} 
      />
    </div>
  );
};

export default Dashboard; 