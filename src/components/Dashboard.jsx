import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RapidWorksHeader from './new_landing_page_header';
import BrandingKits from './BrandingKits';
import UserAvatar from './UserAvatar';
import BrandingKitNotifications from './BrandingKitNotifications';
import BrandingKitTestNotifications from './BrandingKitTestNotifications';

// Debug component to check notification subscription status
const NotificationDebugInfo = () => {
  const { currentUser } = useAuth();
  const [debugInfo, setDebugInfo] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const checkSubscriptionStatus = async () => {
    if (!currentUser?.email) return;
    
    setLoading(true);
    try {
      const { getFirestore, collection, query, where, getDocs } = await import('firebase/firestore');
      const db = getFirestore();
      
      // Check for FCM tokens for this user
      const tokensQuery = query(
        collection(db, 'fcmTokens'),
        where('email', '==', currentUser.email)
      );
      const tokensSnapshot = await getDocs(tokensQuery);
      
      const tokens = [];
      tokensSnapshot.forEach((doc) => {
        tokens.push({
          id: doc.id,
          ...doc.data(),
          tokenPreview: doc.data().token?.substring(0, 20) + '...'
        });
      });
      
      setDebugInfo({
        email: currentUser.email,
        tokensFound: tokens.length,
        tokens: tokens,
        timestamp: new Date().toLocaleString()
      });
    } catch (error) {
      setDebugInfo({
        error: error.message,
        email: currentUser.email
      });
    }
    setLoading(false);
  };

  React.useEffect(() => {
    checkSubscriptionStatus();
  }, [currentUser]);

  if (!debugInfo) return null;

  return (
    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="font-semibold text-yellow-800 mb-2">🔍 Notification Debug Info</h3>
      <div className="text-sm text-yellow-700 space-y-1">
        <p><strong>Email:</strong> {debugInfo.email}</p>
        <p><strong>FCM Tokens Found:</strong> {debugInfo.tokensFound}</p>
        {debugInfo.error && <p className="text-red-600"><strong>Error:</strong> {debugInfo.error}</p>}
        {debugInfo.tokens && debugInfo.tokens.length > 0 && (
          <div>
            <p><strong>Token Details:</strong></p>
            {debugInfo.tokens.map((token, index) => (
              <div key={index} className="ml-4 text-xs">
                <p>• Token {index + 1}: {token.tokenPreview}</p>
                <p>  Created: {token.createdAt?.toDate?.()?.toLocaleString() || 'Unknown'}</p>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-500">Last checked: {debugInfo.timestamp}</p>
      </div>
      <button 
        onClick={checkSubscriptionStatus}
        disabled={loading}
        className="mt-2 text-xs bg-yellow-200 hover:bg-yellow-300 px-2 py-1 rounded"
      >
        {loading ? 'Checking...' : 'Refresh'}
      </button>
    </div>
  );
};

const accent = "#7C3BEC";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <RapidWorksHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-10 mb-8 flex flex-col items-center justify-center overflow-hidden"
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

        {/* Add debug info right after the hero section */}
        <NotificationDebugInfo />

        {/* Notification Subscription Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <BrandingKitNotifications variant="dashboard" />
        </motion.div>

        {/* Branding Kits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <BrandingKits />
        </motion.div>

        {/* Test Notifications Section (Development Only) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <BrandingKitTestNotifications />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 