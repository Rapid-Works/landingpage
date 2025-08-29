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
 * Safely convert various timestamp formats to Date object
 */
const safeToDate = (timestamp) => {
  if (!timestamp) return null;
  
  if (typeof timestamp.toDate === 'function') {
    // Firestore Timestamp
    return timestamp.toDate();
  } else if (timestamp instanceof Date) {
    // Already a Date object
    return timestamp;
  } else if (typeof timestamp === 'string') {
    // String date
    return new Date(timestamp);
  } else if (typeof timestamp === 'number') {
    // Unix timestamp
    return new Date(timestamp);
  }
  
  return null;
};

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
        signedAt: safeToDate(data.signedAt),
        version: data.version,
        signatureValidated: data.signatureValidated || false,
        validatedAt: safeToDate(data.validatedAt),
        validatedBy: data.validatedBy || null
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
 * Check if an organization has signed the framework agreement
 * @param {string} organizationId - The organization's ID
 * @returns {Promise<{signed: boolean, signedBy?: string, signedAt?: Date, organizationName?: string}>}
 */
export const checkOrganizationFrameworkStatus = async (organizationId) => {
  if (!organizationId) {
    return { signed: false };
  }

  try {
    // Query framework agreements by organizationId
    const agreementsRef = collection(db, 'frameworkAgreements');
    const q = query(
      agreementsRef, 
      where('organizationId', '==', organizationId),
      where('signed', '==', true)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Get the first signed agreement for this organization
      const agreementDoc = querySnapshot.docs[0];
      const data = agreementDoc.data();
      
      return {
        signed: true,
        signedBy: data.signedBy || data.userEmail,
        signedAt: safeToDate(data.signedAt),
        organizationName: data.organizationName,
        documentUrl: data.documentUrl
      };
    } else {
      return { signed: false };
    }
  } catch (error) {
    console.error('Error checking organization framework agreement status:', error);
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
 * Save framework agreement status for a user
 * @param {string} userId - User ID
 * @param {string} userEmail - User email
 * @param {string} documentUrl - URL of the uploaded document
 * @param {Object} agreementData - Additional agreement data (optional)
 * @returns {Promise<void>}
 */
export const saveFrameworkAgreement = async (userId, userEmail, documentUrl, agreementData = {}) => {
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
      signatureValidated: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // Include additional organization data
      ...agreementData
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
      const data = doc.data();
      
      agreements.push({
        id: doc.id,
        ...data,
        signedAt: safeToDate(data.signedAt)
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

export const frameworkAgreementApi = {
  checkFrameworkAgreementStatus,
  checkOrganizationFrameworkStatus,
  uploadFrameworkDocument,
  saveFrameworkAgreement,
  getAllSignedAgreements,
  deleteFrameworkAgreement
};

export default frameworkAgreementApi;

/**
 * Mark a customer's framework agreement signature as validated by an expert
 * @param {string} userId - Customer's UID
 * @param {{validatedByEmail?: string, validatedByName?: string}} validator - Info about the validator
 */
export const markFrameworkSignatureValidated = async (userId, validator = {}) => {
  if (!userId) throw new Error('User ID is required');
  try {
    const docRef = doc(db, 'frameworkAgreements', userId);
    await setDoc(docRef, {
      signatureValidated: true,
      validatedAt: serverTimestamp(),
      validatedBy: {
        email: validator.validatedByEmail || null,
        name: validator.validatedByName || null
      },
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error marking signature validated:', error);
    throw new Error('Failed to mark signature validated');
  }
};

/**
 * Flag a customer's framework agreement signature as incorrect
 * (does not reset signed; only adds a note for follow-up communication)
 * @param {string} userId - Customer's UID
 * @param {string} note - Optional note
 */
export const flagFrameworkSignatureIncorrect = async (userId, note = '') => {
  if (!userId) throw new Error('User ID is required');
  try {
    const docRef = doc(db, 'frameworkAgreements', userId);
    await setDoc(docRef, {
      signatureValidated: false,
      validationIssue: {
        notedAt: serverTimestamp(),
        note
      },
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error flagging signature incorrect:', error);
    throw new Error('Failed to flag signature as incorrect');
  }
};

// Named exports already declared above for validation helpers