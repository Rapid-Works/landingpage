import { storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Upload files for a task request
 * @param {File[]} files - Array of files to upload
 * @param {string} userId - The user's UID
 * @param {string} taskId - Optional task ID for organizing files
 * @returns {Promise<Object[]>} Array of uploaded file objects
 */
export const uploadTaskFiles = async (files, userId, taskId = null) => {
  if (!files || files.length === 0) {
    return [];
  }

  if (!userId) {
    throw new Error('User ID is required for file upload');
  }

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp',
    'application/zip', 'application/x-zip-compressed',
    'text/plain', 'text/csv'
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  try {
    const uploadPromises = files.map(async (file, index) => {
      // Validate file size
      if (file.size > maxFileSize) {
        throw new Error(`File "${file.name}" is too large. Maximum size is 10MB.`);
      }

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`File "${file.name}" has an unsupported format. Allowed: PDF, DOC, Images, ZIP, TXT, CSV`);
      }

      // Create unique filename with timestamp
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      
      const basePath = taskId 
        ? `task-files/${userId}/${taskId}` 
        : `task-attachments/${userId}`;
      
      const fileName = `${basePath}/${timestamp}_${randomString}_${sanitizedFileName}`;
      const storageRef = ref(storage, fileName);

      // Upload file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        name: file.name,
        originalName: file.name,
        url: downloadURL,
        storagePath: fileName,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        uploadedBy: userId
      };
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Task file upload failed:', error);
    throw error;
  }
};

/**
 * Delete uploaded files from Firebase Storage
 * @param {string[]} storagePaths - Array of storage paths to delete
 * @returns {Promise<void>}
 */
export const deleteTaskFiles = async (storagePaths) => {
  if (!storagePaths || storagePaths.length === 0) {
    return;
  }

  try {
    const deletePromises = storagePaths.map(async (storagePath) => {
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
    });

    await Promise.all(deletePromises);
    console.log('Files deleted successfully');
  } catch (error) {
    console.error('Error deleting files:', error);
    throw new Error('Failed to delete some files');
  }
};

/**
 * Get file type category for display purposes
 * @param {string} mimeType - File MIME type
 * @returns {string} Category (image, pdf, document, archive, other)
 */
export const getFileCategory = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
  if (mimeType.includes('zip')) return 'archive';
  if (mimeType.startsWith('text/')) return 'text';
  return 'other';
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size string
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @returns {Object} Validation result { isValid: boolean, error?: string }
 */
export const validateFile = (file) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp',
    'application/zip', 'application/x-zip-compressed',
    'text/plain', 'text/csv'
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  if (file.size > maxFileSize) {
    return {
      isValid: false,
      error: `File "${file.name}" is too large. Maximum size is 10MB.`
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File "${file.name}" has an unsupported format.`
    };
  }

  return { isValid: true };
};

export default {
  uploadTaskFiles,
  deleteTaskFiles,
  getFileCategory,
  formatFileSize,
  validateFile
}; 