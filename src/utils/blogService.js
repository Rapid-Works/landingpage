import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  orderBy, 
  where, 
  limit, 
  updateDoc, 
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

const BLOG_COLLECTION = 'blogs';

// Get all published blog posts
export const getAllBlogPosts = async () => {
  try {
    const blogCollection = collection(db, BLOG_COLLECTION);
    const q = query(
      blogCollection,
      where('published', '==', true),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw new Error('Failed to fetch blog posts');
  }
};

// Get a single blog post by slug
export const getBlogPostBySlug = async (slug) => {
  try {
    const docRef = doc(db, BLOG_COLLECTION, slug);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Increment view count
      await updateDoc(docRef, {
        views: increment(1)
      });
      
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw new Error('Failed to fetch blog post');
  }
};

// Get related blog posts based on tags
export const getRelatedPosts = async (currentSlug, tags = [], limitCount = 2) => {
  try {
    const blogCollection = collection(db, BLOG_COLLECTION);
    let q;
    
    if (tags.length > 0) {
      // Get posts with matching tags
      q = query(
        blogCollection,
        where('published', '==', true),
        where('tags', 'array-contains-any', tags),
        orderBy('date', 'desc'),
        limit(limitCount + 1) // +1 to account for current post
      );
    } else {
      // Get recent posts if no tags
      q = query(
        blogCollection,
        where('published', '==', true),
        orderBy('date', 'desc'),
        limit(limitCount + 1)
      );
    }
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    querySnapshot.forEach((doc) => {
      // Exclude current post
      if (doc.id !== currentSlug) {
        posts.push({
          id: doc.id,
          ...doc.data()
        });
      }
    });
    
    return posts.slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    throw new Error('Failed to fetch related posts');
  }
};

// Get blog posts by tag
export const getBlogPostsByTag = async (tag) => {
  try {
    const blogCollection = collection(db, BLOG_COLLECTION);
    const q = query(
      blogCollection,
      where('published', '==', true),
      where('tags', 'array-contains', tag),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return posts;
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
    throw new Error('Failed to fetch posts by tag');
  }
};

// Get recent blog posts (for homepage, etc.)
export const getRecentBlogPosts = async (limitCount = 3) => {
  try {
    const blogCollection = collection(db, BLOG_COLLECTION);
    const q = query(
      blogCollection,
      where('published', '==', true),
      orderBy('date', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return posts;
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    throw new Error('Failed to fetch recent posts');
  }
};

// Like a blog post
export const likeBlogPost = async (slug) => {
  try {
    const docRef = doc(db, BLOG_COLLECTION, slug);
    await updateDoc(docRef, {
      likes: increment(1),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error liking post:', error);
    throw new Error('Failed to like post');
  }
};

// Get all unique tags
export const getAllTags = async () => {
  try {
    const blogCollection = collection(db, BLOG_COLLECTION);
    const q = query(
      blogCollection,
      where('published', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    const allTags = new Set();
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.tags && Array.isArray(data.tags)) {
        data.tags.forEach(tag => allTags.add(tag));
      }
    });
    
    return Array.from(allTags).sort();
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw new Error('Failed to fetch tags');
  }
}; 