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
 * Get all financing applications for a specific user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Array of financing applications
 */
export const getFinancingApplications = async (userId) => {
  try {
    const q = query(
      collection(db, 'financingApplications'),
      where('userId', '==', userId),
      orderBy('applicationDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const applications = [];
    
    querySnapshot.forEach((doc) => {
      applications.push({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to date string if needed
        applicationDate: doc.data().applicationDate,
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
      });
    });
    
    return applications;
  } catch (error) {
    console.error('Error fetching financing applications:', error);
    throw new Error('Failed to fetch financing applications');
  }
};

/**
 * Add a new financing application
 * @param {Object} applicationData - The financing application data
 * @param {string} userId - The user ID
 * @returns {Promise<string>} The ID of the created application
 */
export const addFinancingApplication = async (applicationData, userId) => {
  try {
    const docRef = await addDoc(collection(db, 'financingApplications'), {
      ...applicationData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding financing application:', error);
    throw new Error('Failed to add financing application');
  }
};

/**
 * Update an existing financing application
 * @param {string} applicationId - The application ID
 * @param {Object} updateData - The data to update
 * @returns {Promise<void>}
 */
export const updateFinancingApplication = async (applicationId, updateData) => {
  try {
    const applicationRef = doc(db, 'financingApplications', applicationId);
    await updateDoc(applicationRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating financing application:', error);
    throw new Error('Failed to update financing application');
  }
};

/**
 * Delete a financing application
 * @param {string} applicationId - The application ID
 * @returns {Promise<void>}
 */
export const deleteFinancingApplication = async (applicationId) => {
  try {
    await deleteDoc(doc(db, 'financingApplications', applicationId));
  } catch (error) {
    console.error('Error deleting financing application:', error);
    throw new Error('Failed to delete financing application');
  }
};

/**
 * Get financing applications by status
 * @param {string} userId - The user ID
 * @param {string} status - The status to filter by
 * @returns {Promise<Array>} Array of financing applications
 */
export const getFinancingApplicationsByStatus = async (userId, status) => {
  try {
    const q = query(
      collection(db, 'financingApplications'),
      where('userId', '==', userId),
      where('status', '==', status),
      orderBy('applicationDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const applications = [];
    
    querySnapshot.forEach((doc) => {
      applications.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
      });
    });
    
    return applications;
  } catch (error) {
    console.error('Error fetching financing applications by status:', error);
    throw new Error('Failed to fetch financing applications');
  }
};

/**
 * Get total funding amounts by status
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} Object with total amounts by status
 */
export const getFundingSummary = async (userId) => {
  try {
    const applications = await getFinancingApplications(userId);
    const summary = {
      total: 0,
      approved: 0,
      pending: 0,
      underReview: 0,
      rejected: 0
    };
    
    applications.forEach((app) => {
      // Extract numeric value from amount string (e.g., "€15,000" -> 15000)
      const amount = parseFloat(app.amount.replace(/[^\d.-]/g, '')) || 0;
      
      summary.total += amount;
      
      switch (app.status.toLowerCase()) {
        case 'approved':
          summary.approved += amount;
          break;
        case 'pending':
          summary.pending += amount;
          break;
        case 'under review':
          summary.underReview += amount;
          break;
        case 'rejected':
          summary.rejected += amount;
          break;
        default:
          break;
      }
    });
    
    return summary;
  } catch (error) {
    console.error('Error calculating funding summary:', error);
    throw new Error('Failed to calculate funding summary');
  }
};
