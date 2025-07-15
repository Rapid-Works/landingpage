import { httpsCallable } from 'firebase/functions';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { functions, db } from '../firebase/config'; // Updated path - adjust as needed

// Replace your existing submitToAirtable function
export const submitToAirtable = async ({ email, service, notes = '' }) => {
  try {
    const submitServiceRequest = httpsCallable(functions, 'submitServiceRequest');
    const result = await submitServiceRequest({
      email,
      service,
      notes
    });
    
    return result.data;
  } catch (error) {
    console.error("Error submitting service request:", error);
    throw error;
  }
};

// Replace your existing submitWebinarRegistrationToAirtable function
export const submitWebinarRegistrationToAirtable = async ({ 
  name, 
  email, 
  phone, 
  questions, 
  selectedDate, 
  selectedDateString 
}) => {
  try {
    const submitWebinarRegistration = httpsCallable(functions, 'submitWebinarRegistration');
    const result = await submitWebinarRegistration({
      name,
      email,
      phone,
      questions,
      selectedDate,
      selectedDateString
    });
    
    return result.data;
  } catch (error) {
    console.error("Error submitting webinar registration:", error);
    throw error;
  }
};

// Replace your existing submitPartnerInterestToAirtable function
export const submitPartnerInterestToAirtable = async ({ email, partnerNeedsString }) => {
  try {
    const submitPartnerInterest = httpsCallable(functions, 'submitPartnerInterest');
    const result = await submitPartnerInterest({
      email,
      partnerNeedsString
    });
    
    return result.data;
  } catch (error) {
    console.error("Error submitting partner interest:", error);
    throw error;
  }
};

// Replace your existing submitExpertRequestToAirtable function
export const submitExpertRequestToAirtable = async ({ email, expertType }) => {
  try {
    const submitExpertRequest = httpsCallable(functions, 'submitExpertRequest');
    const result = await submitExpertRequest({
      email,
      expertType
    });
    
    return result.data;
  } catch (error) {
    console.error("Error submitting expert request:", error);
    throw error;
  }
};

// New function for newsletter subscriptions
export const submitNewsletterSubscription = async (email) => {
  try {
    const submitNewsletter = httpsCallable(functions, 'submitNewsletterSubscription');
    const result = await submitNewsletter({
      email
    });
    
    return result.data;
  } catch (error) {
    console.error("Error submitting newsletter subscription:", error);
    throw error;
  }
};


// Alternative approach: Store in Firestore first (for better reliability)
export const submitToFirestore = {
  serviceRequest: async ({ email, service, notes = '' }) => {
    try {
      const docRef = await addDoc(collection(db, 'serviceRequests'), {
        email,
        service,
        notes,
        createdAt: serverTimestamp(),
        syncedToAirtable: false
      });
      
      return { id: docRef.id, success: true };
    } catch (error) {
      console.error("Error adding service request:", error);
      throw error;
    }
  },

  webinarRegistration: async ({ 
    name, 
    email, 
    phone, 
    questions, 
    selectedDate, 
    selectedDateString 
  }) => {
    try {
      const docRef = await addDoc(collection(db, 'webinarRegistrations'), {
        name,
        email,
        phone,
        questions,
        selectedDate,
        selectedDateString,
        createdAt: serverTimestamp(),
        syncedToAirtable: false
      });
      
      return { id: docRef.id, success: true };
    } catch (error) {
      console.error("Error adding webinar registration:", error);
      throw error;
    }
  },

  partnerInterest: async ({ email, partnerNeedsString }) => {
    try {
      const docRef = await addDoc(collection(db, 'partnerInterests'), {
        email,
        partnerNeedsString,
        createdAt: serverTimestamp(),
        syncedToAirtable: false
      });
      
      return { id: docRef.id, success: true };
    } catch (error) {
      console.error("Error adding partner interest:", error);
      throw error;
    }
  },

  expertRequest: async ({ email, expertType }) => {
    try {
      const docRef = await addDoc(collection(db, 'expertRequests'), {
        email,
        expertType,
        createdAt: serverTimestamp(),
        syncedToAirtable: false
      });
      
      return { id: docRef.id, success: true };
    } catch (error) {
      console.error("Error adding expert request:", error);
      throw error;
    }
  }
};

// Utility function to check sync status (for Firestore approach)
export const checkSyncStatus = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        synced: data.syncedToAirtable,
        syncError: data.syncError,
        syncedAt: data.syncedAt
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error checking sync status:", error);
    throw error;
  }
};
