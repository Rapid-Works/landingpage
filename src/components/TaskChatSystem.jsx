import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getTaskRequest, markMessagesAsRead, subscribeTaskRequest } from '../utils/taskRequestService';
import CustomerTaskView from './CustomerTaskView';
import ExpertTaskView from './ExpertTaskView';

const TaskChatSystem = ({ taskId, userRole = "customer", onBack, viewOnly = false }) => {
  const { currentUser } = useAuth();
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load task data from Firebase whenever taskId changes
  useEffect(() => {
    if (!taskId) return;
    setLoading(true);
    setError('');
    let first = true;
    const unsub = subscribeTaskRequest(taskId, async (task) => {
      if (!task) {
        setError('Task not found');
        setLoading(false);
        return;
      }
      setTaskData(task);
      setLoading(false);
      // Mark messages read on initial load and when new messages arrive
      try {
        await markMessagesAsRead(taskId, userRole === 'expert' ? 'expert' : 'customer');
      } catch {}
      first = false;
    });
    return () => unsub && unsub();
  }, [taskId, userRole]);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white p-8 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#7C3BEC] mb-4" />
        <p className="text-gray-600">Loading chat...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white p-8 flex flex-col items-center justify-center min-h-[400px]">
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
      <div className="bg-white p-8 flex flex-col items-center justify-center min-h-[400px]">
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
    <div className="h-full min-h-[70vh] flex flex-col">
      {userRole === "customer" ? (
        <CustomerTaskView taskData={taskData} onBack={onBack} viewOnly={viewOnly} />
      ) : (
        <ExpertTaskView taskData={taskData} onBack={onBack} viewOnly={viewOnly} />
      )}
    </div>
  );
};

export default TaskChatSystem; 