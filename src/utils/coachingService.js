import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Get all coaching sessions for a specific user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Array of coaching sessions
 */
export const getCoachingSessions = async (userId) => {
  try {
    const q = query(
      collection(db, 'coachingSessions'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const sessions = [];
    
    querySnapshot.forEach((doc) => {
      sessions.push({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to date string if needed
        date: doc.data().date,
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
      });
    });
    
    return sessions;
  } catch (error) {
    console.error('Error fetching coaching sessions:', error);
    throw new Error('Failed to fetch coaching sessions');
  }
};

/**
 * Add a new coaching session
 * @param {Object} sessionData - The coaching session data
 * @param {string} userId - The user ID
 * @returns {Promise<string>} The ID of the created session
 */
export const addCoachingSession = async (sessionData, userId) => {
  try {
    const docRef = await addDoc(collection(db, 'coachingSessions'), {
      ...sessionData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding coaching session:', error);
    throw new Error('Failed to add coaching session');
  }
};

/**
 * Update an existing coaching session
 * @param {string} sessionId - The session ID
 * @param {Object} updateData - The data to update
 * @returns {Promise<void>}
 */
export const updateCoachingSession = async (sessionId, updateData) => {
  try {
    const sessionRef = doc(db, 'coachingSessions', sessionId);
    await updateDoc(sessionRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating coaching session:', error);
    throw new Error('Failed to update coaching session');
  }
};

/**
 * Delete a coaching session
 * @param {string} sessionId - The session ID
 * @returns {Promise<void>}
 */
export const deleteCoachingSession = async (sessionId) => {
  try {
    await deleteDoc(doc(db, 'coachingSessions', sessionId));
  } catch (error) {
    console.error('Error deleting coaching session:', error);
    throw new Error('Failed to delete coaching session');
  }
};

/**
 * Get coaching sessions by status
 * @param {string} userId - The user ID
 * @param {string} status - The status to filter by
 * @returns {Promise<Array>} Array of coaching sessions
 */
export const getCoachingSessionsByStatus = async (userId, status) => {
  try {
    const q = query(
      collection(db, 'coachingSessions'),
      where('userId', '==', userId),
      where('status', '==', status),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const sessions = [];
    
    querySnapshot.forEach((doc) => {
      sessions.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
      });
    });
    
    return sessions;
  } catch (error) {
    console.error('Error fetching coaching sessions by status:', error);
    throw new Error('Failed to fetch coaching sessions');
  }
};
