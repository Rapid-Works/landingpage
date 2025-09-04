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
 * @param {boolean} sendNotification - Whether to send notification to expert (default: true)
 * @returns {Promise<string>} - Document ID of created task
 */
export const saveTaskRequest = async (taskData, sendNotification = true) => {
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
    
    // Send notification to expert about new task
    if (sendNotification && taskData.expertEmail && taskData.userEmail) {
      try {
        // Import notification service dynamically
        const { sendTaskCreatedNotification } = await import('./taskNotificationService.js');
        
        await sendTaskCreatedNotification({
          taskId: docRef.id,
          customerEmail: taskData.userEmail,
          expertEmail: taskData.expertEmail,
          taskData: {
            id: docRef.id,
            title: taskData.title || taskData.service || taskData.expertType,
            status: 'pending'
          }
        });
      } catch (notificationError) {
        console.error('Failed to send task creation notification:', notificationError);
        // Don't fail the task creation if notification fails
      }
    }
    
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
export const subscribeUserTaskRequests = (userId, callback, organizationId = null, limitCount = 50) => {
  let q;
  
  if (organizationId) {
    // Filter by user and organization - order by most recent activity
    q = query(
      collection(db, 'taskRequests'),
      where('userId', '==', userId),
      where('organizationId', '==', organizationId),
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    );
  } else {
    // Personal tasks only (no organization) - order by most recent activity
    q = query(
      collection(db, 'taskRequests'),
      where('userId', '==', userId),
      where('organizationId', '==', null),
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    );
  }
  
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
 * Subscribe to all task requests for a specific organization
 * @param {string} organizationId - Organization ID
 * @param {function} callback - Callback function to handle task updates
 * @param {number} limitCount - Maximum number of tasks to return
 * @returns {function} - Unsubscribe function
 */
export const subscribeOrganizationTaskRequests = (organizationId, callback, limitCount = 50) => {
  const q = query(
    collection(db, 'taskRequests'),
    where('organizationId', '==', organizationId),
    orderBy('updatedAt', 'desc'),
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
    orderBy('updatedAt', 'desc'),
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
 * Update invoice payment status for a task
 * @param {string} taskId
 * @param {('Pending'|'Due'|'Paid'|'Overdue')} paymentStatus
 */
export const updateInvoicePaymentStatus = async (taskId, paymentStatus) => {
  try {
    const taskRef = doc(db, 'taskRequests', taskId);
    const updateData = {
      'invoiceData.paymentStatus': paymentStatus,
      updatedAt: serverTimestamp()
    };
    if (paymentStatus === 'Paid') {
      updateData['invoiceData.paidAt'] = serverTimestamp();
    }
    await updateDoc(taskRef, updateData);
  } catch (error) {
    console.error('Error updating invoice payment status:', error);
    throw new Error('Failed to update invoice payment status.');
  }
};

/**
 * Add a message to a task request
 * @param {string} taskId - Task document ID
 * @param {Object} message - Message object
 * @param {boolean} sendNotification - Whether to send notification (default: true)
 * @returns {Promise<void>}
 */
export const addTaskMessage = async (taskId, message, sendNotification = true) => {
  try {
    const taskRef = doc(db, 'taskRequests', taskId);
    const taskDoc = await getDoc(taskRef);
    
    if (!taskDoc.exists()) {
      throw new Error('Task not found');
    }

    const taskData = taskDoc.data();
    const currentMessages = taskData.messages || [];
    const newMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      read: false // Mark as unread initially
    };

    await updateDoc(taskRef, {
      messages: [...currentMessages, newMessage],
      updatedAt: serverTimestamp()
    });

    console.log('Message added to task:', taskId);

    // Send notification if enabled and we have recipient information
    console.log('🔔 Checking notification conditions:', {
      sendNotification,
      messageSender: message.sender,
      userEmail: taskData.userEmail,
      expertEmail: taskData.expertEmail,
      shouldSendNotification: sendNotification && message.sender && taskData.userEmail && taskData.expertEmail
    });

    if (sendNotification && message.sender && taskData.userEmail && taskData.expertEmail) {
      try {
        // Import notification service dynamically to avoid circular dependencies
        const { sendTaskMessageNotification } = await import('./taskNotificationService.js');
        
        // Determine sender and recipient
        const senderRole = message.sender;
        const senderEmail = senderRole === 'expert' ? taskData.expertEmail : taskData.userEmail;
        const recipientRole = senderRole === 'expert' ? 'customer' : 'expert';
        const recipientEmail = senderRole === 'expert' ? taskData.userEmail : taskData.expertEmail;

        // Determine message type
        let messageType = 'message';
        if (message.type === 'estimate') {
          messageType = 'estimate';
        } else if (message.content && message.content.includes('€')) {
          messageType = 'estimate';
        }

        console.log('🚀 About to send task message notification:', {
          taskId,
          senderEmail,
          senderRole,
          recipientEmail,
          recipientRole,
          messageContent: (message.content || message.text || '').substring(0, 50),
          messageType
        });

        await sendTaskMessageNotification({
          taskId,
          senderEmail,
          senderRole,
          recipientEmail,
          recipientRole,
          messageContent: message.content || message.text || '',
          messageType,
          taskData: {
            id: taskId,
            title: taskData.title || taskData.service || taskData.expertType,
            status: taskData.status
          }
        });

        console.log('✅ Task message notification sent successfully');
      } catch (notificationError) {
        console.error('Failed to send task message notification:', notificationError);
        // Don't fail the message sending if notification fails
      }
    }
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
    orderBy('updatedAt', 'desc'),
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

const taskRequestService = {
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

export default taskRequestService;