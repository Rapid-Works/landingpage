import React from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../blogData'; // Import sample data
import RapidWorksHeader from "./new_landing_page_header"; // Assuming you want the standard header
import { messaging, db } from '../firebase/config'; // Import Firebase config
import { getToken } from 'firebase/messaging';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { requestNotificationPermission } from '../firebase/messaging'; // Use the new function

const BlogListPage = () => {

  const handleSubscription = () => {
    requestNotificationPermission();
  };

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
      </div>
    </div>
  );
};

export default BlogListPage; 