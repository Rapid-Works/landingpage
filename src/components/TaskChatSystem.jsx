import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getTaskRequest } from '../utils/taskRequestService';
import CustomerTaskView from './CustomerTaskView';
import ExpertTaskView from './ExpertTaskView';

const TaskChatSystem = ({ taskId, userRole = "customer", onBack }) => {
  const { currentUser } = useAuth();
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load task data from Firebase
  useEffect(() => {
    const loadTask = async () => {
      if (!taskId) return;

      setLoading(true);
      setError('');

      try {
        const task = await getTaskRequest(taskId);
        setTaskData(task);
      } catch (err) {
        console.error('Error loading task:', err);
        setError(err.message || 'Failed to load task');
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [taskId]);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#7C3BEC] mb-4" />
        <p className="text-gray-600">Loading chat...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  // No task data
  if (!taskData) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="h-8 w-8 text-gray-500 mb-4" />
        <p className="text-gray-600 mb-4">Task not found</p>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7C3BEC] to-[#9F7AEA] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button 
                onClick={onBack} 
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 text-white" />
              </button>
            )}
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">{taskData.taskName}</h2>
              <p className="text-white/80 text-sm">
                {userRole === "expert" 
                  ? `Chat with ${taskData.userName || taskData.userEmail}` 
                  : `Chat with ${taskData.expertName || 'Expert'}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-white text-sm font-medium">
                Status: {taskData.status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
              <div className="text-white/80 text-xs">
                Created: {taskData.createdAt?.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Content */}
      <div className="p-6">
        {userRole === "customer" ? (
          <CustomerTaskView taskData={taskData} onBack={onBack} />
        ) : (
          <ExpertTaskView taskData={taskData} onBack={onBack} />
        )}
      </div>
    </div>
  );
};

export default TaskChatSystem; 