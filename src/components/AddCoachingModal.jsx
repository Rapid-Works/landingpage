import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../contexts/AuthContext';
import { X, Calendar, Clock, User, FileText, Tag } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/config';

const AddCoachingModal = ({ isOpen, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    date: '',
    duration: '',
    type: '',
    coach: '',
    description: '',
    status: 'Scheduled'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const coachingTypes = [
    'Business Strategy',
    'Marketing',
    'Financial Planning',
    'Sales Training',
    'Leadership Development',
    'Digital Transformation',
    'Operations Management',
    'HR & Recruitment',
    'Legal Consultation',
    'Other'
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
      if (!formData.date || !formData.duration || !formData.type || !formData.coach || !formData.description) {
        throw new Error('Please fill in all required fields');
      }

      // Save to Firebase
      await addDoc(collection(db, 'coachingSessions'), {
        ...formData,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Reset form
      setFormData({
        date: '',
        duration: '',
        type: '',
        coach: '',
        description: '',
        status: 'Scheduled'
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving coaching session:', err);
      setError(err.message || 'Failed to save coaching session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        date: '',
        duration: '',
        type: '',
        coach: '',
        description: '',
        status: 'Scheduled'
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
                Add Coaching Session
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="h-4 w-4 inline mr-1" />
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock className="h-4 w-4 inline mr-1" />
              Duration *
            </label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent"
            >
              <option value="">Select duration</option>
              <option value="30 minutes">30 minutes</option>
              <option value="45 minutes">45 minutes</option>
              <option value="60 minutes">60 minutes</option>
              <option value="90 minutes">90 minutes</option>
              <option value="2 hours">2 hours</option>
              <option value="2.5 hours">2.5 hours</option>
              <option value="3 hours">3 hours</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Tag className="h-4 w-4 inline mr-1" />
              Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent"
            >
              <option value="">Select type</option>
              {coachingTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Coach */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="h-4 w-4 inline mr-1" />
              Coach *
            </label>
            <input
              type="text"
              name="coach"
              value={formData.coach}
              onChange={handleInputChange}
              placeholder="Enter coach name"
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FileText className="h-4 w-4 inline mr-1" />
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the coaching session content, objectives, or topics covered..."
              required
              disabled={loading}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent resize-none"
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
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
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
              {loading ? 'Saving...' : 'Save Session'}
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

export default AddCoachingModal;
