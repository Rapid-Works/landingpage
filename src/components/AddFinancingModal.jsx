import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../contexts/AuthContext';
import { X, DollarSign, Calendar, ExternalLink, FileCheck, Tag } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/config';

const AddFinancingModal = ({ isOpen, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    subsidy: '',
    amount: '',
    status: 'Pending',
    applicationDate: '',
    applicationLink: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subsidyTypes = [
    'Digital Innovation Grant',
    'Small Business Support Fund',
    'Green Technology Initiative',
    'Export Development Program',
    'Research & Development Grant',
    'Startup Accelerator Fund',
    'Women Entrepreneur Grant',
    'Youth Business Initiative',
    'Regional Development Fund',
    'Innovation Voucher',
    'Training & Skills Development',
    'Other'
  ];

  const statusOptions = [
    'Pending',
    'Under Review',
    'Approved',
    'Rejected',
    'Withdrawn'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.subsidy || !formData.amount || !formData.applicationDate || !formData.description) {
        throw new Error('Please fill in all required fields');
      }

      // Validate application link format if provided
      if (formData.applicationLink && !formData.applicationLink.startsWith('http')) {
        throw new Error('Application link must be a valid URL starting with http:// or https://');
      }

      // Save to Firebase
      await addDoc(collection(db, 'financingApplications'), {
        ...formData,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Reset form
      setFormData({
        subsidy: '',
        amount: '',
        status: 'Pending',
        applicationDate: '',
        applicationLink: '',
        description: ''
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving financing application:', err);
      setError(err.message || 'Failed to save financing application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        subsidy: '',
        amount: '',
        status: 'Pending',
        applicationDate: '',
        applicationLink: '',
        description: ''
      });
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] overflow-y-auto">
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
              disabled={loading}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Add Financing Application
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Subsidy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Tag className="h-4 w-4 inline mr-1" />
              Subsidy/Grant Type *
            </label>
            <select
              name="subsidy"
              value={formData.subsidy}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent"
            >
              <option value="">Select subsidy type</option>
              {subsidyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <DollarSign className="h-4 w-4 inline mr-1" />
              Amount *
            </label>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="e.g., €15,000 or $20,000"
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent"
            />
          </div>

          {/* Application Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="h-4 w-4 inline mr-1" />
              Application Date *
            </label>
            <input
              type="date"
              name="applicationDate"
              value={formData.applicationDate}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Application Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <ExternalLink className="h-4 w-4 inline mr-1" />
              Application Link (Optional)
            </label>
            <input
              type="url"
              name="applicationLink"
              value={formData.applicationLink}
              onChange={handleInputChange}
              placeholder="https://example.com/application"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FileCheck className="h-4 w-4 inline mr-1" />
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the purpose of the funding, project details, or application notes..."
              required
              disabled={loading}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#7C3BEC] text-white rounded-md hover:bg-[#6B2DBD] focus:outline-none focus:ring-2 focus:ring-[#7C3BEC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Application'}
            </button>
          </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AddFinancingModal;
