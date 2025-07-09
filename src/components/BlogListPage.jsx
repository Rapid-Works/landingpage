import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogPosts } from '../utils/blogService';
import RapidWorksHeader from "./new_landing_page_header";
import { requestNotificationPermission } from '../firebase/messaging';

const BlogListPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleSubscription = () => {
    requestNotificationPermission();
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Our Blog</h1>
          <button 
            onClick={handleSubscription}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Subscribe to Notifications
          </button>
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