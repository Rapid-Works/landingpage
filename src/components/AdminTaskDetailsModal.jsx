import React, { useState, useEffect } from 'react';
import { X, ExternalLink, AlertCircle } from 'lucide-react';
import { getTaskRequest } from '../utils/taskRequestService';

const AdminTaskDetailsModal = ({ isOpen, onClose, taskId, taskName, onViewChat }) => {
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load task details when modal opens
  useEffect(() => {
    if (isOpen && taskId) {
      loadTaskDetails();
    }
  }, [isOpen, taskId]);

  const loadTaskDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const task = await getTaskRequest(taskId);
      setTaskData(task);
    } catch (err) {
      console.error('Error loading task details:', err);
      setError('Failed to load task details');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format dates
  const formatReadableDate = (date) => {
    if (!date) return 'Not specified';
    const d = new Date(date);
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return d.toLocaleDateString('en-GB', options);
  };

  // Get status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  // Count deliverables and messages
  const getTaskStats = (task) => {
    if (!task) return { files: 0, messages: 0, customerMessages: 0, expertMessages: 0 };
    
    const messages = task.messages || [];
    const files = task.files || [];
    
    return {
      files: files.length,
      messages: messages.length,
      customerMessages: messages.filter(msg => msg.sender === 'customer').length,
      expertMessages: messages.filter(msg => msg.sender === 'expert').length
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7C3BEC] to-[#9F7AEA] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{taskName}</h2>
              <p className="text-purple-100 text-sm mt-1">Task Details & Invoice Verification</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">{error}</p>
            </div>
          ) : taskData ? (
            <div className="space-y-6">
              {/* Invoice Summary */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#7C3BEC]">€{taskData.invoiceData?.price || 0}</div>
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Amount</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{taskData.invoiceData?.hours || 0}h</div>
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Hours</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">€{taskData.invoiceData?.rate || 0}</div>
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Rate</div>
                  </div>
                  <div>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(taskData.status)}`}>
                      {taskData.status === 'completed' ? 'Completed' : 
                       taskData.status === 'accepted' ? 'Accepted' : taskData.status}
                    </div>
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mt-1">Status</div>
                  </div>
                </div>
              </div>

              {/* Customer & Expert */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3">Customer</h4>
                  <div className="space-y-2">
                    <div className="font-medium text-gray-900">{taskData.userName}</div>
                    <div className="text-sm text-gray-600">{taskData.userEmail}</div>
                    <div className="text-xs text-blue-700">{getTaskStats(taskData).customerMessages} messages</div>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-3">Expert</h4>
                  <div className="space-y-2">
                    <div className="font-medium text-gray-900">{taskData.expertName || 'Unassigned'}</div>
                    <div className="text-sm text-gray-600">{taskData.expertType}</div>
                    <div className="text-xs text-purple-700">{getTaskStats(taskData).expertMessages} messages</div>
                  </div>
                </div>
              </div>

              {/* Task Description */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Task Description</h4>
                <p className="text-gray-700 leading-relaxed">{taskData.taskDescription}</p>
              </div>

              {/* Timeline & Stats */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">{new Date(taskData.createdAt).toLocaleDateString()}</span>
                    </div>
                    {taskData.invoiceData?.orderedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ordered:</span>
                        <span className="font-medium">{new Date(taskData.invoiceData.orderedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    {taskData.completedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completed:</span>
                        <span className="font-medium">{new Date(taskData.completedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Activity</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Messages:</span>
                      <span className="font-medium">{getTaskStats(taskData).messages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Files:</span>
                      <span className="font-medium">{taskData.files?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">{new Date(taskData.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    if (onViewChat) {
                      onViewChat(taskId);
                    }
                    onClose();
                  }}
                  className="inline-flex items-center px-4 py-2 bg-[#7C3BEC] text-white rounded-lg hover:bg-[#6B32D6] transition-colors font-medium"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Chat
                </button>
                
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No task data found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTaskDetailsModal;