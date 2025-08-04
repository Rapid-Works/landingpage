import { db, storage } from '../firebase/config';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

/**
 * Check if a user has signed the framework agreement
 * @param {string} userId - The user's UID
 * @returns {Promise<{signed: boolean, documentUrl?: string, signedAt?: Date}>}
 */
export const checkFrameworkAgreementStatus = async (userId) => {
  if (!userId) {
    return { signed: false };
  }

  try {
    const docRef = doc(db, 'frameworkAgreements', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        signed: data.signed || false,
        documentUrl: data.documentUrl,
        signedAt: data.signedAt?.toDate(),
        version: data.version
      };
    } else {
      return { signed: false };
    }
  } catch (error) {
    console.error('Error checking framework agreement status:', error);
    return { signed: false };
  }
};

/**
 * Upload signed framework agreement document
 * @param {File} file - The PDF file to upload
 * @param {string} userId - The user's UID
 * @returns {Promise<string>} - Download URL of uploaded file
 */
export const uploadFrameworkDocument = async (file, userId) => {
  if (!file || !userId) {
    throw new Error('File and user ID are required');
  }

  if (file.type !== 'application/pdf') {
    throw new Error('Only PDF files are allowed');
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    throw new Error('File size must be less than 10MB');
  }

  try {
    // Create a reference to the file location
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const fileName = `${userId}_framework_agreement_${timestamp}.pdf`;
    const storageRef = ref(storage, `framework-agreements/${fileName}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading framework document:', error);
    throw new Error('Failed to upload document. Please try again.');
  }
};

/**
 * Save framework agreement status to Firestore
 * @param {string} userId - The user's UID
 * @param {string} userEmail - The user's email
 * @param {string} documentUrl - URL of the uploaded document
 * @returns {Promise<void>}
 */
export const saveFrameworkAgreement = async (userId, userEmail, documentUrl) => {
  if (!userId || !userEmail || !documentUrl) {
    throw new Error('User ID, email, and document URL are required');
  }

  try {
    const docRef = doc(db, 'frameworkAgreements', userId);
    
    await setDoc(docRef, {
      userId,
      userEmail,
      signed: true,
      documentUrl,
      signedAt: serverTimestamp(),
      version: 'v1.0', // Can be updated when agreement changes
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('Framework agreement saved successfully');
  } catch (error) {
    console.error('Error saving framework agreement:', error);
    throw new Error('Failed to save agreement status. Please try again.');
  }
};

/**
 * Get all users who have signed the framework agreement (admin function)
 * @returns {Promise<Array>} - Array of user agreement data
 */
export const getAllSignedAgreements = async () => {
  try {
    const agreementsRef = collection(db, 'frameworkAgreements');
    const q = query(agreementsRef, where('signed', '==', true));
    const querySnapshot = await getDocs(q);
    
    const agreements = [];
    querySnapshot.forEach((doc) => {
      agreements.push({
        id: doc.id,
        ...doc.data(),
        signedAt: doc.data().signedAt?.toDate()
      });
    });
    
    return agreements;
  } catch (error) {
    console.error('Error getting signed agreements:', error);
    throw new Error('Failed to fetch agreement data');
  }
};

/**
 * Delete framework agreement (admin function)
 * @param {string} userId - The user's UID
 * @returns {Promise<void>}
 */
export const deleteFrameworkAgreement = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    // First get the document to find the file URL
    const status = await checkFrameworkAgreementStatus(userId);
    
    // Delete the file from storage if it exists
    if (status.documentUrl) {
      try {
        const storageRef = ref(storage, status.documentUrl);
        await deleteObject(storageRef);
      } catch (storageError) {
        console.warn('Could not delete file from storage:', storageError);
        // Continue with document deletion even if file deletion fails
      }
    }
    
    // Delete the Firestore document
    const docRef = doc(db, 'frameworkAgreements', userId);
    await setDoc(docRef, {
      signed: false,
      documentUrl: null,
      deletedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    console.log('Framework agreement deleted successfully');
  } catch (error) {
    console.error('Error deleting framework agreement:', error);
    throw new Error('Failed to delete agreement');
  }
};

export default {
  checkFrameworkAgreementStatus,
  uploadFrameworkDocument,
  saveFrameworkAgreement,
  getAllSignedAgreements,
  deleteFrameworkAgreement
}; 