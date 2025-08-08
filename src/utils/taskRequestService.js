import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  getDoc, 
  getDocs,
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  limit,
  onSnapshot
} from 'firebase/firestore';

/**
 * Save a new task request to Firestore
 * @param {Object} taskData - Task request data
 * @returns {Promise<string>} - Document ID of created task
 */
export const saveTaskRequest = async (taskData) => {
  try {
    const taskRequest = {
      ...taskData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // Add additional fields for tracking
      viewedByExpert: false,
      estimateProvided: false,
      estimateAccepted: null,
      completedAt: null,
      messages: [], // For storing chat messages
      notifications: [] // For storing notification history
    };

    const docRef = await addDoc(collection(db, 'taskRequests'), taskRequest);
    console.log('Task request saved with ID:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving task request:', error);
    throw new Error('Failed to save task request. Please try again.');
  }
};

/**
 * Get task requests for a specific user
 * @param {string} userId - User ID
 * @param {number} limitCount - Maximum number of tasks to return
 * @returns {Promise<Array>} - Array of task requests
 */
export const getUserTaskRequests = async (userId, limitCount = 50) => {
  try {
    const q = query(
      collection(db, 'taskRequests'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const tasks = [];
    
    querySnapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        completedAt: doc.data().completedAt?.toDate()
      });
    });

    return tasks;
  } catch (error) {
    console.error('Error getting user task requests:', error);
    throw new Error('Failed to load task requests.');
  }
};

/**
 * Subscribe to a user's task requests in realtime
 */
export const subscribeUserTaskRequests = (userId, callback, limitCount = 50) => {
  const q = query(
    collection(db, 'taskRequests'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate(),
      updatedAt: d.data().updatedAt?.toDate(),
      completedAt: d.data().completedAt?.toDate()
    }));
    callback(tasks);
  });
};

/**
 * Get task requests assigned to a specific expert by email
 * @param {string} expertEmail - Expert's email address
 * @param {number} limitCount - Maximum number of tasks to return
 * @returns {Promise<Array>} - Array of task requests
 */
export const getExpertTaskRequestsByEmail = async (expertEmail, limitCount = 50) => {
  try {
    const q = query(
      collection(db, 'taskRequests'),
      where('expertEmail', '==', expertEmail),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const tasks = [];
    
    querySnapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        completedAt: doc.data().completedAt?.toDate()
      });
    });

    return tasks;
  } catch (error) {
    console.error('Error getting expert task requests by email:', error);
    throw new Error('Failed to load expert tasks.');
  }
};

/**
 * Subscribe to expert tasks by email in realtime
 */
export const subscribeExpertTaskRequestsByEmail = (expertEmail, callback, limitCount = 50) => {
  const q = query(
    collection(db, 'taskRequests'),
    where('expertEmail', '==', expertEmail),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate(),
      updatedAt: d.data().updatedAt?.toDate(),
      completedAt: d.data().completedAt?.toDate()
    }));
    callback(tasks);
  });
};

/**
 * Get task requests assigned to a specific expert (legacy method - kept for compatibility)
 * @param {string} expertType - Expert type/role
 * @param {string} expertName - Expert name (optional)
 * @returns {Promise<Array>} - Array of task requests
 */
export const getExpertTaskRequests = async (expertType, expertName = null) => {
  try {
    let q;
    
    if (expertName) {
      q = query(
        collection(db, 'taskRequests'),
        where('expertName', '==', expertName),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, 'taskRequests'),
        where('expertType', '==', expertType),
        orderBy('createdAt', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    const tasks = [];
    
    querySnapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        completedAt: doc.data().completedAt?.toDate()
      });
    });

    return tasks;
  } catch (error) {
    console.error('Error getting expert task requests:', error);
    throw new Error('Failed to load expert tasks.');
  }
};

/**
 * Update task request status
 * @param {string} taskId - Task document ID
 * @param {string} status - New status
 * @param {Object} additionalData - Additional data to update
 * @returns {Promise<void>}
 */
export const updateTaskStatus = async (taskId, status, additionalData = {}) => {
  try {
    const taskRef = doc(db, 'taskRequests', taskId);
    
    const updateData = {
      status,
      updatedAt: serverTimestamp(),
      ...additionalData
    };

    // Add completion timestamp if status is completed
    if (status === 'completed') {
      updateData.completedAt = serverTimestamp();
    }

    await updateDoc(taskRef, updateData);
    console.log('Task status updated:', taskId, status);
  } catch (error) {
    console.error('Error updating task status:', error);
    throw new Error('Failed to update task status.');
  }
};

/**
 * Add a message to a task request
 * @param {string} taskId - Task document ID
 * @param {Object} message - Message object
 * @returns {Promise<void>}
 */
export const addTaskMessage = async (taskId, message) => {
  try {
    const taskRef = doc(db, 'taskRequests', taskId);
    const taskDoc = await getDoc(taskRef);
    
    if (!taskDoc.exists()) {
      throw new Error('Task not found');
    }

    const currentMessages = taskDoc.data().messages || [];
    const newMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    await updateDoc(taskRef, {
      messages: [...currentMessages, newMessage],
      updatedAt: serverTimestamp()
    });

    console.log('Message added to task:', taskId);
  } catch (error) {
    console.error('Error adding task message:', error);
    throw new Error('Failed to add message.');
  }
};

/**
 * Get a specific task request by ID
 * @param {string} taskId - Task document ID
 * @returns {Promise<Object>} - Task request object
 */
export const getTaskRequest = async (taskId) => {
  try {
    const taskRef = doc(db, 'taskRequests', taskId);
    const taskDoc = await getDoc(taskRef);
    
    if (!taskDoc.exists()) {
      throw new Error('Task not found');
    }

    const data = taskDoc.data();
    return {
      id: taskDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      completedAt: data.completedAt?.toDate()
    };
  } catch (error) {
    console.error('Error getting task request:', error);
    throw new Error('Failed to load task details.');
  }
};

/**
 * Subscribe to a single task by ID (realtime)
 * @param {string} taskId
 * @param {(task: object|null) => void} callback
 * @returns {() => void} unsubscribe
 */
export const subscribeTaskRequest = (taskId, callback) => {
  const taskRef = doc(db, 'taskRequests', taskId);
  return onSnapshot(taskRef, (taskDoc) => {
    if (!taskDoc.exists()) {
      callback(null);
      return;
    }
    const data = taskDoc.data();
    callback({
      id: taskDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      completedAt: data.completedAt?.toDate()
    });
  });
};

/**
 * Mark task as viewed by expert
 * @param {string} taskId - Task document ID
 * @returns {Promise<void>}
 */
export const markTaskViewedByExpert = async (taskId) => {
  try {
    const taskRef = doc(db, 'taskRequests', taskId);
    
    await updateDoc(taskRef, {
      viewedByExpert: true,
      viewedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('Task marked as viewed by expert:', taskId);
  } catch (error) {
    console.error('Error marking task as viewed:', error);
    throw new Error('Failed to update task view status.');
  }
};

/**
 * Add price estimate to task
 * @param {string} taskId - Task document ID
 * @param {Object} estimate - Estimate object with price, hours, description
 * @returns {Promise<void>}
 */
export const addTaskEstimate = async (taskId, estimate) => {
  try {
    const taskRef = doc(db, 'taskRequests', taskId);
    
    const estimateData = {
      ...estimate,
      providedAt: serverTimestamp(),
      status: 'pending' // pending, accepted, rejected
    };

    await updateDoc(taskRef, {
      estimate: estimateData,
      estimateProvided: true,
      status: 'estimate_provided',
      updatedAt: serverTimestamp()
    });

    console.log('Estimate added to task:', taskId);
  } catch (error) {
    console.error('Error adding task estimate:', error);
    throw new Error('Failed to add estimate.');
  }
};

/**
 * Get all task requests for admin users
 * @param {number} limitCount - Maximum number of tasks to return
 * @returns {Promise<Array>} - Array of all task requests
 */
export const getAllTaskRequests = async (limitCount = 100) => {
  try {
    const q = query(
      collection(db, 'taskRequests'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const tasks = [];
    
    querySnapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        completedAt: doc.data().completedAt?.toDate()
      });
    });

    return tasks;
  } catch (error) {
    console.error('Error getting all task requests:', error);
    throw new Error('Failed to load all tasks.');
  }
};

/**
 * Subscribe to all tasks (admin) in realtime
 */
export const subscribeAllTaskRequests = (callback, limitCount = 100) => {
  const q = query(
    collection(db, 'taskRequests'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate(),
      updatedAt: d.data().updatedAt?.toDate(),
      completedAt: d.data().completedAt?.toDate()
    }));
    callback(tasks);
  });
};

export default {
  saveTaskRequest,
  getUserTaskRequests,
  getExpertTaskRequests,
  getExpertTaskRequestsByEmail,
  updateTaskStatus,
  addTaskMessage,
  getTaskRequest,
  markTaskViewedByExpert,
  addTaskEstimate,
  getAllTaskRequests
}; 

/**
 * Mark messages as read in a task for a given reader role.
 * This will set read=true for messages sent by the opposite role.
 * @param {string} taskId
 * @param {('expert'|'customer')} readerRole
 */
export const markMessagesAsRead = async (taskId, readerRole) => {
  try {
    const taskRef = doc(db, 'taskRequests', taskId);
    const taskDoc = await getDoc(taskRef);
    if (!taskDoc.exists()) return;

    const data = taskDoc.data();
    const messages = Array.isArray(data.messages) ? data.messages : [];
    const updated = messages.map(m => {
      const isFromOpposite = readerRole === 'expert' ? m.sender === 'customer' : m.sender === 'expert';
      if (isFromOpposite && m.read === false) {
        return { ...m, read: true };
      }
      return m;
    });

    // Only write if something changed
    const changed = updated.some((m, i) => m !== messages[i]);
    if (!changed) return;

    await updateDoc(taskRef, { messages: updated, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error('Failed to mark messages read:', error);
  }
};