import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, Layers, Bell, BellRing, Check, X, Loader2, TestTube, Trash2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RapidWorksHeader from './new_landing_page_header';
import BrandingKits from './BrandingKits';
import UserAvatar from './UserAvatar';
import { requestNotificationPermission } from '../firebase/messaging';
import { testBrandingKitNotification, cleanupInvalidTokens, testBlogNotification } from '../utils/airtableService';

const accent = "#7C3BEC";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [notificationState, setNotificationState] = useState('default'); // 'default', 'loading', 'success', 'error'
  const [notificationMessage, setNotificationMessage] = useState('');
  const [testingNotification, setTestingNotification] = useState(false);
  const [cleaningTokens, setCleaningTokens] = useState(false);
  const [testingBlogNotification, setTestingBlogNotification] = useState(false);

  const handleSubscribeToNotifications = async () => {
    setNotificationState('loading');
    setNotificationMessage('');
    
    try {
      await requestNotificationPermission();
      setNotificationState('success');
      setNotificationMessage('🎉 You\'re subscribed! You\'ll get notified when your branding kits are ready.');
      
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

  const handleTestNotification = async () => {
    if (!currentUser?.email) {
      alert('Please make sure you are logged in');
      return;
    }

    setTestingNotification(true);
    
    try {
      const testKitId = `test-kit-${Date.now()}`;
      await testBrandingKitNotification({
        kitId: testKitId,
        email: currentUser.email
      });
      
      alert(`Test notification sent! A test kit "${testKitId}" was marked as ready for ${currentUser.email}. You should receive a notification if you're subscribed.`);
    } catch (error) {
      console.error('Test notification failed:', error);
      alert('Failed to send test notification. Make sure Firebase functions are deployed.');
    } finally {
      setTestingNotification(false);
    }
  };

  const handleTestBlogNotification = async () => {
    setTestingBlogNotification(true);
    
    try {
      const result = await testBlogNotification();
      
      const details = `
🔍 Blog Notification Test Results:

✅ Status: ${result.success ? 'SUCCESS' : 'FAILED'}
📊 Total FCM Tokens: ${result.totalTokens}
🧪 Tested Tokens: ${result.testedTokens || 0}
✅ Valid Tokens: ${result.validTokens}
📝 Test Blog ID: ${result.testBlogId || 'N/A'}

${result.message}

${result.tokenDetails ? '\n📋 Token Details:\n' + result.tokenDetails.map(t => `• ${t.email || 'No email'}: ${t.tokenPreview}`).join('\n') : ''}

${result.totalTokens === 0 ? '\n❗ No FCM tokens found. Users need to:\n1. Visit /blog\n2. Click "Get Notified"\n3. Allow notifications' : ''}
${result.validTokens === 0 && result.totalTokens > 0 ? '\n❗ All tokens are expired. Run "Cleanup Invalid Tokens" first.' : ''}
      `;
      
      alert(details);
    } catch (error) {
      console.error('Blog notification test failed:', error);
      alert('Failed to test blog notifications. Make sure Firebase functions are deployed.');
    } finally {
      setTestingBlogNotification(false);
    }
  };

  const handleCleanupTokens = async () => {
    setCleaningTokens(true);
    
    try {
      const result = await cleanupInvalidTokens();
      alert(`Token cleanup complete! ${result.message}\n\nValid tokens: ${result.validTokens}\nInvalid tokens removed: ${result.invalidTokens}`);
    } catch (error) {
      console.error('Token cleanup failed:', error);
      alert('Failed to cleanup tokens. Make sure Firebase functions are deployed.');
    } finally {
      setCleaningTokens(false);
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
            <span>Get Notified</span>
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
            <UserAvatar user={currentUser} size={28} />
            <h2 className="text-4xl font-extrabold text-gray-900 mt-6 mb-2 tracking-tight">
              Welcome back, {currentUser?.displayName || currentUser?.email}!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Ready to build your brand today?
            </p>

            {/* Notification Subscription Section */}
            <div className="mb-6 text-center">
              <button 
                onClick={handleSubscribeToNotifications}
                disabled={notificationState === 'loading'}
                className={`${getNotificationButtonStyles()} text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 mb-2`}
              >
                {getNotificationButtonContent()}
              </button>
              <p className="text-sm text-gray-500">
                Get instant notifications when your branding kits are ready
              </p>
              {notificationMessage && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm mt-2 ${notificationState === 'success' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {notificationMessage}
                </motion.p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4 justify-center">
              <button onClick={() => navigate('/branding')} className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-105 transition-transform">
                <Layers className="h-5 w-5" /> Create New Kit
              </button>
              <a href="https://calendly.com/yannick-familie-heeren/30min" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform">
                <Calendar className="h-5 w-5" /> Book a Call
              </a>
            </div>
          </div>
        </motion.div>

        {/* Branding Kits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-10"
        >
          <BrandingKits />
        </motion.div>

        {/* Testing Section - Only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Testing Area (Development Only)
            </h3>
            <p className="text-yellow-700 mb-4 text-sm">
              Use these buttons to test the notification system and debug issues.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleTestNotification}
                disabled={testingNotification}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white rounded-lg font-medium transition-colors"
              >
                {testingNotification ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Test...
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4" />
                    Test Kit Notification
                  </>
                )}
              </button>
              
              <button
                onClick={handleTestBlogNotification}
                disabled={testingBlogNotification}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg font-medium transition-colors"
              >
                {testingBlogNotification ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Testing Blog...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Test Blog Notification
                  </>
                )}
              </button>
              
              <button
                onClick={handleCleanupTokens}
                disabled={cleaningTokens}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg font-medium transition-colors"
              >
                {cleaningTokens ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cleaning...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Cleanup Invalid Tokens
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 