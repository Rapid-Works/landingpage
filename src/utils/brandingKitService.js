import { 
  collection, 
  doc as firestoreDoc, 
  getDocs, 
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Get all branding kits (admin function)
export const getAllBrandingKits = async () => {
  try {
    const brandingKitsRef = collection(db, 'brandkits');
    const snapshot = await getDocs(brandingKitsRef);
    
    const kits = [];
    snapshot.forEach((doc) => {
      const kitData = {
        id: doc.id,
        ...doc.data()
      };
      
      // Filter out test kits (those starting with "test-kit-")
      if (!kitData.id.startsWith('test-kit-')) {
        kits.push(kitData);
      }
    });
    
    return kits;
  } catch (error) {
    console.error('Error fetching branding kits:', error);
    throw new Error('Failed to fetch branding kits');
  }
};

// Get a specific branding kit
export const getBrandingKit = async (kitId) => {
  try {
    const kitRef = firestoreDoc(db, 'brandkits', kitId);
    const kitDoc = await getDoc(kitRef);
    
    if (kitDoc.exists()) {
      return {
        id: kitDoc.id,
        ...kitDoc.data()
      };
    } else {
      throw new Error('Branding kit not found');
    }
  } catch (error) {
    console.error('Error fetching branding kit:', error);
    throw error;
  }
};

// Create branding kit metadata
export const createBrandingKit = async (kitId, kitData) => {
  try {
    const kitRef = firestoreDoc(db, 'brandkits', kitId);
    
    // Check if kit already exists
    const existingKit = await getDoc(kitRef);
    if (existingKit.exists()) {
      throw new Error(`Branding kit with ID "${kitId}" already exists`);
    }
    
    const dataToSave = {
      emails: kitData.emails || [],
      paid: kitData.paid || false,
      ready: kitData.ready || false,
      organizationName: kitData.organizationName || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(kitRef, dataToSave);
    
    return {
      id: kitId,
      ...dataToSave
    };
  } catch (error) {
    console.error('Error creating branding kit metadata:', error);
    throw error;
  }
};

// Update an existing branding kit
export const updateBrandingKit = async (kitId, updates) => {
  try {
    const kitRef = firestoreDoc(db, 'brandkits', kitId);
    
    const dataToUpdate = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(kitRef, dataToUpdate);
    
    return {
      id: kitId,
      ...dataToUpdate
    };
  } catch (error) {
    console.error('Error updating branding kit:', error);
    throw error;
  }
};

// Delete a branding kit
export const deleteBrandingKit = async (kitId) => {
  try {
    const kitRef = firestoreDoc(db, 'brandkits', kitId);
    await deleteDoc(kitRef);
  } catch (error) {
    console.error('Error deleting branding kit:', error);
    throw error;
  }
};

// Get branding kits for a specific organization
export const getOrganizationBrandingKits = async (organizationName) => {
  try {
    const brandingKitsRef = collection(db, 'brandkits');
    const snapshot = await getDocs(brandingKitsRef);
    
    const kits = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.organizationName === organizationName) {
        kits.push({
          id: doc.id,
          ...data
        });
      }
    });
    
    return kits;
  } catch (error) {
    console.error('Error fetching organization branding kits:', error);
    throw new Error('Failed to fetch organization branding kits');
  }
};

// Get personal branding kits (no organization)
export const getPersonalBrandingKits = async () => {
  try {
    const brandingKitsRef = collection(db, 'brandkits');
    const snapshot = await getDocs(brandingKitsRef);
    
    const kits = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (!data.organizationName) {
        kits.push({
          id: doc.id,
          ...data
        });
      }
    });
    
    return kits;
  } catch (error) {
    console.error('Error fetching personal branding kits:', error);
    throw new Error('Failed to fetch personal branding kits');
  }
};

export default {
  getAllBrandingKits,
  getBrandingKit,
  createBrandingKit,
  updateBrandingKit,
  deleteBrandingKit,
  getOrganizationBrandingKits,
  getPersonalBrandingKits
};
