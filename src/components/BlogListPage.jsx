import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogPosts } from '../utils/blogService';
import RapidWorksHeader from "./new_landing_page_header";
import { requestNotificationPermission } from '../firebase/messaging';
import { Bell, BellRing, Check, X, Loader2 } from 'lucide-react';

const BlogListPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notificationState, setNotificationState] = useState('default'); // 'default', 'loading', 'success', 'error'
  const [notificationMessage, setNotificationMessage] = useState('');

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
    setNotificationState('loading');
    setNotificationMessage('');
    
    try {
      await requestNotificationPermission();
      setNotificationState('success');
      setNotificationMessage('🎉 You\'re all set! You\'ll get notified about new blog posts.');
      
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

  const NotificationButton = () => {
    const getButtonContent = () => {
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
              <span className="hidden sm:inline">Get Notified</span>
              <span className="sm:hidden">Notify Me</span>
            </>
          );
      }
    };

    const getButtonStyles = () => {
      switch (notificationState) {
        case 'loading':
          return 'bg-gray-500 cursor-not-allowed';
        case 'success':
          return 'bg-green-500 hover:bg-green-600';
        case 'error':
          return 'bg-red-500 hover:bg-red-600';
        default:
          return 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700';
      }
    };

    return (
      <button 
        onClick={handleSubscription}
        disabled={notificationState === 'loading'}
        className={`${getButtonStyles()} text-white font-semibold py-3 px-4 sm:px-6 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0`}
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
            // Use flex column layout for the card
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