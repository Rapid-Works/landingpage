import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, User, Save, Loader2, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProfileEditModal = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || '',
    photoFile: null,
    photoPreview: currentUser?.photoURL || null
  });

  // Cloudinary configuration
  const cloudinaryConfig = {
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
  };

  const uploadToCloudinary = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloudinaryConfig.uploadPreset);

    try {
      const url = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error during upload:", error);
      throw error;
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be smaller than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        photoFile: file,
        photoPreview: URL.createObjectURL(file)
      }));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let photoURL = currentUser?.photoURL;

      // Upload new image if one was selected
      if (formData.photoFile) {
        setUploadingImage(true);
        photoURL = await uploadToCloudinary(formData.photoFile);
        setUploadingImage(false);
      }

      // Update Firebase Auth profile
      await updateUserProfile(currentUser, {
        displayName: formData.displayName.trim(),
        photoURL: photoURL
      });

      setSuccess('Profile updated successfully!');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2000);

    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
      setUploadingImage(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl w-full max-w-lg mx-auto shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                    {formData.photoPreview ? (
                      <img
                        src={formData.photoPreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#7C3BEC] flex items-center justify-center">
                        <User className="h-10 w-10 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Upload button overlay */}
                  <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-[#7C3BEC] hover:bg-[#6B32D6] text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                    <Camera className="h-4 w-4" />
                  </label>
                  
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                
                <p className="text-sm text-gray-500 text-center">
                  Click the camera icon to upload a new profile picture
                  <br />
                  <span className="text-xs">Max file size: 5MB</span>
                </p>
              </div>

              {/* Display Name */}
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent"
                  placeholder="Enter your display name"
                  required
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={currentUser?.email || ''}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed from here
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#7C3BEC] hover:bg-[#6B32D6] text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {uploadingImage ? 'Uploading...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default ProfileEditModal; 