import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogPosts } from '../utils/blogService';
import RapidWorksHeader from "./new_landing_page_header";
import { getMessaging, getToken } from 'firebase/messaging';
import { db, auth } from '../firebase/config';
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { useSmartNotificationStatus } from '../hooks/useSmartNotificationStatus';
import { Bell, BellRing, Check, X, Loader2 } from 'lucide-react';

const VAPID_KEY = 'BC9X8U5hWzbbGbbB8x_net_q4eG5RA798jZxKcOPS5e5joRHXN7XcCS2yv-UwCKY0lZZ59mOOspl_aSWEjSV33M';

const BlogListPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notificationState, setNotificationState] = useState('default'); // 'default', 'loading', 'error'
  const [notificationMessage, setNotificationMessage] = useState('');
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

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const posts = await getAllBlogPosts();
        setBlogPosts(posts);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const handleSubscription = async () => {
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
      const currentUser = auth.currentUser;
      if (currentUser) {
        localStorage.setItem(`fcmToken_${currentUser.email}`, 'mock-fcm-token-' + Date.now());
      }
      
      // Refresh subscription status to show updated state
      checkSubscriptionStatus();
      
      setNotificationState('default');
      setNotificationMessage('🎉 You\'re all set! You\'ll get notified about new blog posts.');
      
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

  const NotificationButton = () => {
    const getButtonContent = () => {
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
            <span className="hidden sm:inline">Notifications Enabled</span>
            <span className="sm:hidden">Enabled</span>
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
              <span className="hidden sm:inline">Get Notified</span>
              <span className="sm:hidden">Notify Me</span>
            </>
          );
      }
    };

    const getButtonStyles = () => {
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
          return 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700';
      }
    };

    return (
      <button 
        onClick={handleSubscription}
        disabled={subscriptionLoading || notificationState === 'loading'}
        className={`${getButtonStyles()} text-white font-semibold py-3 px-4 sm:px-6 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 disabled:hover:-translate-y-0`}
      >
        {getButtonContent()}
      </button>
    );
  };

  if (loading) {
    return (
      <div className="pt-20">
        <RapidWorksHeader />
        <div className="container mx-auto px-6 py-12">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading blog posts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20">
        <RapidWorksHeader />
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Blog</h1>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              Error loading blog posts: {error}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20"> {/* Add padding top to account for fixed header */}
       <RapidWorksHeader />
      <div className="container mx-auto px-6 py-12">
        {/* Header Section with improved notification UI */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Blog</h1>
            <p className="text-gray-600">Stay updated with insights, tips, and stories from the RapidWorks team</p>
          </div>
        </div>

        {/* Notification Feature Banner */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Bell className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Never Miss a Post</h3>
              <p className="text-gray-600 text-sm">Get instant notifications when we publish new articles, insights, and startup tips.</p>
            </div>
            <div className="w-full sm:w-auto">
              <NotificationButton />
            </div>
          </div>
        </div>

        {blogPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No blog posts found.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <div key={post.slug} className="flex flex-col border rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"> {/* Added overflow-hidden */}
              {/* +++ Add Image Section +++ */}
              {post.imageUrl && (
                <Link to={`/blogs/${post.slug}`} className="block aspect-video overflow-hidden"> {/* Aspect ratio container */}
                  <img
                    src={post.imageUrl}
                    alt={`Cover for ${post.title}`}
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105" // Basic styling and hover effect
                  />
                </Link>
              )}
              {/* --- End Image Section --- */}

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-grow"> {/* Added padding and flex structure */}
                <h2 className="text-xl font-semibold mb-2"> {/* Adjusted size */}
                  <Link to={`/blogs/${post.slug}`} className="hover:text-purple-600 transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-sm text-gray-500 mb-3">
                  {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  {post.author && ` by ${post.author}`}
                </p>
                <p className="text-gray-600 mb-4 text-sm flex-grow">{post.excerpt}</p> {/* Adjusted size, added flex-grow */}
                <Link
                  to={`/blogs/${post.slug}`}
                  className="text-purple-600 hover:text-purple-800 font-medium mt-auto self-start" // Aligned button to bottom
                >
                  Read More &rarr;
                </Link>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListPage; 