import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { blogPosts } from '../blogData'; // Import sample data
import RapidWorksHeader from "./new_landing_page_header"; // Assuming you want the standard header
import ReactMarkdown from 'react-markdown';

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    // Optional: Redirect to a 404 page or the blog list if post not found
    return <Navigate to="/blogs" replace />;
  }

  // Placeholder for Related/Next posts logic
  const relatedPosts = blogPosts.filter(p => p.slug !== slug).slice(0, 2); // Simple example: show 2 other posts

  return (
    <div className="pt-20"> {/* Add padding top to account for fixed header */}
      <RapidWorksHeader />
      <div className="container mx-auto px-4 sm:px-6 py-12"> {/* Adjusted horizontal padding */}
        <article className="max-w-3xl mx-auto">
          {/* Post Header */}
          <div className="mb-8"> {/* Increased bottom margin */}
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">{post.title}</h1> {/* Adjusted size */}
            <p className="text-sm text-gray-500 mb-6">
              Published on {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              {post.author && ` by ${post.author}`}
            </p>
            {/* +++ Add Cover Image +++ */}
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={`Cover image for ${post.title}`}
                className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg shadow-md mb-8" // Added styling
              />
            )}
            {/* --- End Cover Image --- */}
          </div>

          {/* Post Content */}
          <div className="prose prose-lg lg:prose-xl max-w-none"> {/* Adjusted prose size */}
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Related Posts Section */}
          <div className="mt-16 pt-10 border-t"> {/* Adjusted spacing */}
            <h3 className="text-2xl font-semibold mb-6">Related Articles</h3> {/* Adjusted spacing */}
            {relatedPosts.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2"> {/* Adjusted gap */}
                {relatedPosts.map(related => (
                   <div key={related.slug} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"> {/* Added hover effect */}
                     <h4 className="text-lg font-semibold mb-1"> {/* Adjusted size */}
                       <Link to={`/blogs/${related.slug}`} className="hover:text-purple-600 transition-colors">
                         {related.title}
                       </Link>
                     </h4>
                     <p className="text-xs text-gray-500 mb-2">{new Date(related.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                     <p className="text-sm text-gray-600 line-clamp-3">{related.excerpt}</p> {/* Added line-clamp */}
                  </div>
                ))}
              </div>
            ) : (
              <p>No related articles found.</p>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPostPage; 