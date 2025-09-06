import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Link, FileText, ExternalLink } from 'lucide-react';

const EditTrackingLinkModal = ({ isOpen, onClose, onSubmit, linkData }) => {
  const [formData, setFormData] = useState({
    name: '',
    destinationUrl: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Populate form when linkData changes
  useEffect(() => {
    if (linkData) {
      setFormData({
        name: linkData.name || '',
        destinationUrl: linkData.destinationUrl || '',
        description: linkData.description || ''
      });
    }
  }, [linkData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.destinationUrl.trim()) {
      newErrors.destinationUrl = 'Destination URL is required';
    } else {
      // Auto-add https:// if no protocol is specified for validation
      let url = formData.destinationUrl.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      // Basic URL validation
      try {
        new URL(url);
        // Validation passed - URL is valid
      } catch {
        newErrors.destinationUrl = 'Please enter a valid URL (e.g., example.com or https://example.com)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Ensure URL has proper protocol before submitting
      const finalFormData = { ...formData };
      if (!finalFormData.destinationUrl.startsWith('http://') && !finalFormData.destinationUrl.startsWith('https://')) {
        finalFormData.destinationUrl = 'https://' + finalFormData.destinationUrl;
      }
      
      await onSubmit(linkData.id, finalFormData);
      
      // Reset form and errors
      setFormData({
        name: '',
        destinationUrl: '',
        description: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error updating tracking link:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    // Reset form and errors when closing
    setFormData({
      name: '',
      destinationUrl: '',
      description: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen || !linkData) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div 
        className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
              <Link className="h-6 w-6 text-blue-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Edit Tracking Link
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Update the name, destination URL, and description of your tracking link.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g. 30 Flyers for event XYZ"
                  disabled={isSubmitting}
                />
                <FileText className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="destinationUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Destination URL *
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="destinationUrl"
                  value={formData.destinationUrl}
                  onChange={(e) => handleInputChange('destinationUrl', e.target.value)}
                  onBlur={(e) => {
                    // Auto-add https:// when user leaves the field
                    const url = e.target.value.trim();
                    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                      handleInputChange('destinationUrl', 'https://' + url);
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.destinationUrl ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="example.com or https://example.com"
                  disabled={isSubmitting}
                />
                <ExternalLink className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              {errors.destinationUrl && <p className="mt-1 text-xs text-red-600">{errors.destinationUrl}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. We will hand those to people at the event."
                disabled={isSubmitting}
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong> The tracking link and QR code will remain the same. Only the name, destination URL, and description will be updated.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Tracking Link'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default EditTrackingLinkModal;
