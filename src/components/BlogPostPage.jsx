import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { blogPosts } from '../blogData';
import RapidWorksHeader from "./new_landing_page_header";
import ReactMarkdown from 'react-markdown';
// Import required plugins for proper markdown rendering
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setCopied(false); // Reset copied state when slug changes
  }, [slug]);

  if (!post) {
    return <Navigate to="/blogs" replace />;
  }

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error('Failed to copy: ', err);
      // Optionally, provide feedback to the user that copy failed
    });
  };

  // Find related posts based on shared tags or just show recent posts if no matching tags
  // const relatedPosts = post.tags && post.tags.length > 0
  //   ? blogPosts
  //       .filter(p => p.slug !== slug && p.tags.some(tag => post.tags.includes(tag)))
  //       .slice(0, 2)
  //   : blogPosts.filter(p => p.slug !== slug).slice(0, 2);

  const currentIndex = blogPosts.findIndex(p => p.slug === slug);
  const relatedPosts = [];
  const numPosts = blogPosts.length;

  if (currentIndex !== -1 && numPosts > 1) { // Check if current post is found and there's more than one post
    // First related post (next in sequence, or wraps around)
    const nextPostIndex1 = (currentIndex + 1) % numPosts;
    relatedPosts.push(blogPosts[nextPostIndex1]);

    // Second related post (the one after nextPostIndex1, or wraps around)
    // Only add if there are more than 2 posts in total, to avoid duplicating the first related post
    if (numPosts > 2) {
      const nextPostIndex2 = (currentIndex + 2) % numPosts;
      relatedPosts.push(blogPosts[nextPostIndex2]);
    }
  }

  return (
    <div className="pt-20"> {/* Add padding top for header */}
      <RapidWorksHeader />
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Back to blogs navigation */}
        <div className="max-w-3xl mx-auto mb-6">
          <Link to="/blogs" className="text-purple-600 hover:text-purple-800 font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to all articles
          </Link>
        </div>
        
        <article className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Post Header */}
          <div className="px-6 sm:px-8 pt-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900">{post.title}</h1>
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span>{new Date(post.date).toLocaleDateString('de-DE', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              })}</span>
              {post.author && (
                <>
                  <span className="mx-2">•</span>
                  <span>{post.author}</span>
                </>
              )}
              {post.tags && post.tags.length > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <div className="flex gap-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {/* Cover Image */}
            {post.imageUrl && (
              <div className="mx-auto mb-8">
                <img
                  src={post.imageUrl}
                  alt={`Cover image for ${post.title}`}
                  className="w-full h-56 sm:h-64 md:h-80 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          {/* Post Content */}
          <div className="px-6 sm:px-8 py-6">
            {/* This is the key part: using plugins and applying correct prose classes */}
            <div className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-purple-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
              prose-strong:font-bold prose-strong:text-gray-900
              prose-ul:list-disc prose-ol:list-decimal
              prose-li:text-gray-700 prose-li:my-1
              prose-img:rounded-lg prose-img:shadow-md
              prose-hr:my-8">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]} // Enables GitHub Flavored Markdown support
                rehypePlugins={[rehypeRaw, rehypeSanitize]} // Allows for raw HTML and sanitizes it
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
          
          {/* Social Share */}
          <div className="px-6 sm:px-8 pb-6">
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                {copied ? 'Link Copied!' : 'Share this article'}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={handleShare}
                  title="Share on Twitter (Copy Link)"
                  className="p-2 text-white bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
                <button 
                  onClick={handleShare}
                  title="Share on LinkedIn (Copy Link)"
                  className="p-2 text-white bg-blue-700 hover:bg-blue-800 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>
                <button 
                  onClick={handleShare}
                  title="Copy Link"
                  className="p-2 text-white bg-gray-700 hover:bg-gray-800 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    {/* Using a generic link icon now */}
                    <path d="M17 7h-4v2h4c1.654 0 3 1.346 3 3s-1.346 3-3 3h-4v2h4c2.757 0 5-2.243 5-5s-2.243-5-5-5zm-6 8H7c-1.654 0-3-1.346-3-3s1.346-3 3-3h4V7H7c-2.757 0-5 2.243-5 5s2.243 5 5 5h4v-2zm-1-4h-2v2h2v-2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="max-w-3xl mx-auto mt-12 mb-8">
            <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {relatedPosts.map(related => (
                <div key={related.slug} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {related.imageUrl && (
                    <Link to={`/blogs/${related.slug}`} className="block h-48 overflow-hidden">
                      <img 
                        src={related.imageUrl}
                        alt={related.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  )}
                  <div className="p-5">
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(related.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </p>
                    <h4 className="text-lg font-semibold mb-2">
                      <Link to={`/blogs/${related.slug}`} className="hover:text-purple-600 transition-colors">
                        {related.title}
                      </Link>
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {related.excerpt}
                    </p>
                    <Link 
                      to={`/blogs/${related.slug}`} 
                      className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-800"
                    >
                      Read More
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostPage;