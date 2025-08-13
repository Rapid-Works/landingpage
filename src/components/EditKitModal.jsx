import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Edit, Package, AlertTriangle, Building2 } from 'lucide-react';
import { updateBrandingKit } from '../utils/brandingKitService';

const EditKitModal = ({ isOpen, onClose, onSuccess, kit }) => {
  const [formData, setFormData] = useState({
    organizationName: '',
    emails: '',
    paid: false,
    ready: false
  });
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  // Initialize form data when kit changes
  useEffect(() => {
    if (kit) {
      // Handle both array and single email formats
      const emailList = Array.isArray(kit.email) ? kit.email : 
                       Array.isArray(kit.emails) ? kit.emails :
                       kit.email ? [kit.email] :
                       kit.emails ? [kit.emails] : [];
      
      setFormData({
        organizationName: kit.organizationName || '',
        emails: emailList.join(', '),
        paid: kit.paid || false,
        ready: kit.ready || false
      });
    }
  }, [kit]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kit) return;

    setUpdating(true);
    setError('');

    try {
      const emailArray = formData.emails.split(',').map(email => email.trim()).filter(email => email);
      
      const kitData = {
        organizationName: formData.organizationName || null,
        email: emailArray, // Use 'email' field (singular) to match existing data structure
        paid: formData.paid,
        ready: formData.ready
      };

      console.log('🔄 Updating kit with data:', kitData);
      await updateBrandingKit(kit.id, kitData);
      console.log('✅ Kit updated successfully');
      onSuccess();
    } catch (err) {
      console.error('Error updating branding kit:', err);
      setError(err.message || 'Failed to update branding kit');
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen || !kit) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#7C3BEC] rounded-lg flex items-center justify-center">
              <Edit className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit Branding Kit</h2>
              <p className="text-sm text-gray-600">Update metadata for "{kit.id}"</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={updating}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Kit Name (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kit Name (Document ID)
              </label>
              <input
                type="text"
                value={kit.id}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                disabled
                readOnly
              />
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <strong>Note:</strong> Kit name cannot be changed as it's used as the Firebase document ID.
                </div>
              </div>
            </div>

            {/* Organization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="inline h-4 w-4 mr-1" />
                Organization Name (optional)
              </label>
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent"
                placeholder="Leave empty for personal kits"
              />
              <p className="mt-1 text-xs text-gray-500">
                If specified, this kit will only be visible to members of this organization
              </p>
            </div>

            {/* Emails */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Authorized Emails *
              </label>
              <textarea
                name="emails"
                value={formData.emails}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent"
                placeholder="email1@example.com, email2@example.com, email3@example.com"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Comma-separated list of emails that can access this kit
              </p>
            </div>

            {/* Status Checkboxes */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Kit Status</h3>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="paid"
                  checked={formData.paid}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#7C3BEC] focus:ring-[#7C3BEC] border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Paid - Kit has been paid for
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="ready"
                  checked={formData.ready}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#7C3BEC] focus:ring-[#7C3BEC] border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Ready - Kit is ready for download
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={updating}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="bg-[#7C3BEC] hover:bg-[#6B32D6] text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4" />
                    Update Kit
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default EditKitModal;
