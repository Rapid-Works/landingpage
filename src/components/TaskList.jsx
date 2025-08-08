import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Calendar,
  FileText,
  Euro,
  Eye,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { 
  getUserTaskRequests, 
  getExpertTaskRequestsByEmail, 
  getAllTaskRequests,
  subscribeAllTaskRequests,
  subscribeExpertTaskRequestsByEmail,
  subscribeUserTaskRequests
} from '../utils/taskRequestService';
import { formatFileSize } from '../utils/taskFileService';
import { isAdmin, getAllExperts } from '../utils/expertService';
import TaskChatSystem from './TaskChatSystem';

const TaskList = ({ userRole, expertInfo, initialSelectedTaskId, onTaskSelected, selectedExpert, onUnreadTotalChange }) => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Check if current user is from rapid-works.io (admin access to all experts)
  const isRapidWorksAdmin = currentUser?.email?.endsWith('@rapid-works.io');

  // Handle initial selected task from external navigation
  useEffect(() => {
    if (initialSelectedTaskId) {
      setSelectedTaskId(initialSelectedTaskId);
      if (onTaskSelected) {
        onTaskSelected();
      }
    }
  }, [initialSelectedTaskId, onTaskSelected]);

  // Simplified date formatting for tables
  const formatSimpleDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Load tasks based on user role (realtime subscriptions)
  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    setError('');

    let unsubscribe = null;
    const onData = (rawTasks) => {
      let taskData = rawTasks || [];
      if (userRole === 'expert' && expertInfo?.email) {
        if (isRapidWorksAdmin && selectedExpert) {
          taskData = taskData.filter(t => t.expertEmail === selectedExpert.email || t.expertName === selectedExpert.name);
        }
      }
      setTasks(taskData);
      if (userRole === 'expert' && typeof onUnreadTotalChange === 'function') {
        const totalUnread = taskData.reduce((sum, t) => {
          const unread = Array.isArray(t.messages)
            ? t.messages.filter(m => m.sender === 'customer' && m.read === false).length
            : 0;
          return sum + unread;
        }, 0);
        onUnreadTotalChange(totalUnread);
      }
      setLoading(false);
    };

    try {
      if (userRole === 'expert' && expertInfo?.email) {
        if (isRapidWorksAdmin) {
          unsubscribe = subscribeAllTaskRequests(onData);
        } else {
          unsubscribe = subscribeExpertTaskRequestsByEmail(expertInfo.email, onData);
        }
      } else {
        unsubscribe = subscribeUserTaskRequests(currentUser.uid, onData);
      }
    } catch (err) {
      console.error('Error subscribing to tasks:', err);
      setError(err.message || 'Failed to load tasks');
      setLoading(false);
    }

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [currentUser, userRole, expertInfo?.email, isRapidWorksAdmin, selectedExpert]);

  // Compute unread counts per task from messages
  const tasksWithUnread = tasks.map(t => {
    const unread = Array.isArray(t.messages)
      ? t.messages.filter(m => m.sender === 'customer' && m.read === false).length
      : 0;
    return { ...t, unreadCount: unread };
  });

  // Filter tasks based on search and status
  const filteredTasks = tasksWithUnread.filter(task => {
    const matchesSearch = !searchTerm || 
      task.taskName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.taskDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = ['pending', 'in_progress', 'estimate_provided', 'accepted'].includes(task.status);
    } else if (statusFilter === 'completed') {
      matchesStatus = ['completed', 'cancelled', 'declined'].includes(task.status);
    }
    
    return matchesSearch && matchesStatus;
  });

  // Get status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'estimate_provided':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <AlertCircle className="h-4 w-4" />;
      case 'estimate_provided':
        return <Euro className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Format status text
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'in_progress':
        return 'In Progress';
      case 'estimate_provided':
        return 'Estimate Provided';
      case 'accepted':
        return 'Accepted';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'declined':
        return 'Declined';
      default:
        return status;
    }
  };

  // Get payment status
  const getPaymentStatus = (task) => {
    if (task.status !== 'accepted' && task.status !== 'completed') {
      return 'N/A';
    }
    
    if (task.invoiceData?.paymentStatus) {
      return task.invoiceData.paymentStatus;
    }
    
    // Default logic based on task status
    if (task.status === 'accepted') {
      return 'Pending';
    } else if (task.status === 'completed') {
      return 'Due';
    }
    
    return 'Pending';
  };

  // Get payment status styling
  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Due':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  // Get price from task data
  const getTaskPrice = (task) => {
    if (task.invoiceData?.price) {
      return `€${task.invoiceData.price.toLocaleString()}`;
    } else if (task.estimateData?.price) {
      return `€${task.estimateData.price.toLocaleString()}`;
    }
    return '-';
  };

  // If a task is selected, show the chat system
  if (selectedTaskId) {
    // Determine view-only mode for experts: full access only if task is assigned to them
    const selectedTask = tasks.find(task => task.id === selectedTaskId);
    const isViewOnly = userRole === 'expert' && selectedTask?.expertEmail &&
                      selectedTask.expertEmail !== currentUser?.email;
    
    return (
      <div className="h-full min-h-[70vh]">
        <TaskChatSystem 
          taskId={selectedTaskId}
          userRole={userRole}
          onBack={() => setSelectedTaskId(null)}
          viewOnly={isViewOnly}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full overflow-y-auto px-4 md:px-6 pt-4 md:pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {userRole === 'expert' 
              ? (selectedExpert ? `${selectedExpert.name}'s Tasks` : 'Expert Tasks')
              : 'Your Requests'
            }
          </h2>
          <p className="text-gray-600 mt-1">
            {userRole === 'expert' 
              ? (selectedExpert 
                ? `Viewing tasks assigned to ${selectedExpert.name}` 
                : (isRapidWorksAdmin 
                  ? 'Viewing all expert tasks - select an expert from sidebar to filter'
                  : `Manage tasks assigned to you as ${expertInfo?.role}`
                )
              )
              : 'Track your task requests and communicate with experts'
            }
          </p>
        </div>
        
      </div>


      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent bg-white"
          >
            <option value="all">All Tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3BEC]"></div>
          <span className="ml-2 text-gray-600">Loading tasks...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' 
              ? 'No tasks match your filters' 
              : userRole === 'expert' 
                ? 'No tasks assigned yet' 
                : 'No requests yet'
            }
          </h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : userRole === 'expert'
                ? 'New task assignments will appear here'
                : 'Create your first task request to get started'
            }
          </p>
        </div>
      )}

      {/* Task Table */}
      {!loading && !error && filteredTasks.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table Header */}
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {userRole === 'expert' ? 'Customer' : 'Expert'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                </tr>
              </thead>
              
              {/* Table Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map((task, index) => (
                  <motion.tr
                    key={task.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    onClick={() => setSelectedTaskId(task.id)}
                  >
                    {/* Task Name with unread dot */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {(task.unreadCount && task.unreadCount > 0) && (
                          <span className="inline-block w-2 h-2 rounded-full bg-red-500" aria-label="unread" />
                        )}
                        <div className="text-sm font-medium text-gray-900 truncate hover:text-[#7C3BEC] transition-colors cursor-pointer">
                          {task.taskName}
                        </div>
                      </div>
                    </td>

                    {/* Expert/Customer Name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {userRole === 'expert' 
                          ? (task.userName || task.userEmail?.split('@')[0] || 'Unknown')
                          : (task.expertName || task.expertEmail?.split('@')[0] || 'Pending')
                        }
                      </div>
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatSimpleDate(task.createdAt)}
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {task.dueDate ? formatSimpleDate(task.dueDate) : '-'}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getTaskPrice(task)}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(task.status)}`}>
                        {getStatusIcon(task.status)}
                        {getStatusText(task.status)}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusStyle(getPaymentStatus(task))}`}>
                        {getPaymentStatus(task)}
                      </span>
                    </td>

                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Task Count */}
      {!loading && !error && filteredTasks.length > 0 && (
        <div className="text-center text-sm text-gray-500 pt-4">
          Showing {filteredTasks.length} of {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default TaskList; 