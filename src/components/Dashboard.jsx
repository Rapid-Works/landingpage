import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, Layers, Bell, BellRing, Check, X, Loader2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RapidWorksHeader from './new_landing_page_header';
import BrandingKits from './BrandingKits';
import UserAvatar from './UserAvatar';
import ProfileEditModal from './ProfileEditModal';
import { requestNotificationPermission } from '../firebase/messaging';

const accent = "#7C3BEC";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [notificationState, setNotificationState] = useState('default'); // 'default', 'loading', 'success', 'error'
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleSubscribeToNotifications = async () => {
    setNotificationState('loading');
    setNotificationMessage('');
    
    try {
      await requestNotificationPermission();
      setNotificationState('success');
      setNotificationMessage('🎉 Perfect! You\'ll get notified when your branding kits are ready.');
      
      // Reset to default after 5 seconds
      setTimeout(() => {
        setNotificationState('default');
        setNotificationMessage('');
      }, 5000);
    } catch (err) {
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
    switch (notificationState) {
      case 'loading':
        return (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Subscribing...</span>
          </>
        );
      case 'success':
        return (
          <>
            <Check className="h-5 w-5" />
            <span>Subscribed!</span>
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
    switch (notificationState) {
      case 'loading':
        return 'bg-gray-500 cursor-not-allowed';
      case 'success':
        return 'bg-green-500 hover:bg-green-600';
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
                disabled={notificationState === 'loading'}
                className={`${getNotificationButtonStyles()} text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100`}
              >
                {getNotificationButtonContent()}
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
    </div>
  );
};

export default Dashboard; 