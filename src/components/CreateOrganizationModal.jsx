import React, { useState } from 'react';
import { X, Building2, MapPin, Calendar, Loader2 } from 'lucide-react';
import { createOrganization } from '../utils/organizationService';
import { useAuth } from '../contexts/AuthContext';

const CreateOrganizationModal = ({ isOpen, onClose, onOrganizationCreated }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    postalCode: '',
    dateOfEstablishment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.name.trim()) {
      setError('Organization name is required');
      return;
    }
    
    if (!formData.street.trim() || !formData.city.trim() || !formData.postalCode.trim()) {
      setError('Complete address is required');
      return;
    }
    
    if (!formData.dateOfEstablishment) {
      setError('Date of establishment is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const organization = await createOrganization(currentUser.uid, formData);
      
      // Reset form
      setFormData({
        name: '',
        street: '',
        city: '',
        postalCode: '',
        dateOfEstablishment: ''
      });
      
      onOrganizationCreated(organization);
      onClose();
    } catch (error) {
      console.error('Error creating organization:', error);
      setError(error.message || 'Failed to create organization. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#7C3BEC] rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create Organization</h2>
              <p className="text-sm text-gray-600">Set up your organization account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Organization Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter organization name"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-[#7C3BEC] outline-none transition-colors"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin className="h-4 w-4" />
              <span>Address</span>
            </div>

            {/* Street */}
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="Enter street address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-[#7C3BEC] outline-none transition-colors"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* City and Postal Code */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-[#7C3BEC] outline-none transition-colors"
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code *
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Enter postal code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-[#7C3BEC] outline-none transition-colors"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
          </div>

          {/* Date of Establishment */}
          <div>
            <label htmlFor="dateOfEstablishment" className="block text-sm font-medium text-gray-700 mb-2">
              Date of Establishment *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                id="dateOfEstablishment"
                name="dateOfEstablishment"
                value={formData.dateOfEstablishment}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-[#7C3BEC] outline-none transition-colors"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#7C3BEC] hover:bg-[#6B32D6] text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Organization'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrganizationModal;
