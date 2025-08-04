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
import { getUserTaskRequests, getExpertTaskRequestsByEmail, getAllTaskRequests } from '../utils/taskRequestService';
import { formatFileSize } from '../utils/taskFileService';
import { isAdmin } from '../utils/expertService';
import TaskChatSystem from './TaskChatSystem';

const TaskList = ({ userRole, expertInfo }) => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Load tasks based on user role
  useEffect(() => {
    const loadTasks = async () => {
      if (!currentUser) return;

      setLoading(true);
      setError('');

      try {
        let taskData = [];
        
        if (userRole === 'expert' && expertInfo?.email) {
          // Check if user is admin - if so, load all tasks
          if (isAdmin(currentUser.email)) {
            console.log('Admin user detected, loading all tasks');
            taskData = await getAllTaskRequests();
          } else {
            // Load tasks assigned to this expert
            taskData = await getExpertTaskRequestsByEmail(expertInfo.email);
          }
        } else {
          // Load user's own task requests
          taskData = await getUserTaskRequests(currentUser.uid);
        }

        setTasks(taskData);
      } catch (err) {
        console.error('Error loading tasks:', err);
        setError(err.message || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [currentUser, userRole, expertInfo]);

  // Filter tasks based on search and status
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchTerm || 
      task.taskName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.taskDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    
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
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  // If a task is selected, show the chat system
  if (selectedTaskId) {
    return (
      <TaskChatSystem 
        taskId={selectedTaskId}
        userRole={userRole}
        onBack={() => setSelectedTaskId(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {userRole === 'expert' ? 'Assigned Tasks' : 'Your Requests'}
          </h2>
          <p className="text-gray-600 mt-1">
            {userRole === 'expert' 
              ? `Manage tasks assigned to you as ${expertInfo?.role}` 
              : 'Track your task requests and communicate with experts'}
          </p>
        </div>
        
        {userRole === 'customer' && (
          <button
            onClick={() => {/* TODO: Open new task modal */}}
            className="inline-flex items-center px-4 py-2 bg-[#7C3BEC] hover:bg-[#6B32D6] text-white font-medium text-sm rounded-lg transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </button>
        )}
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
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="estimate_provided">Estimate Provided</option>
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

      {/* Task List */}
      {!loading && !error && filteredTasks.length > 0 && (
        <div className="space-y-4">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => setSelectedTaskId(task.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Task Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {task.taskName}
                    </h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyle(task.status)}`}>
                      {getStatusIcon(task.status)}
                      {getStatusText(task.status)}
                    </span>
                  </div>

                  {/* Task Description */}
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {task.taskDescription}
                  </p>

                  {/* Task Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    {userRole === 'expert' && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{task.userName || task.userEmail}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{task.createdAt?.toLocaleDateString()}</span>
                    </div>

                    {task.dueDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}

                    {task.files && task.files.length > 0 && (
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{task.files.length} file{task.files.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{task.messages?.length || 0} message{(task.messages?.length || 0) !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="ml-4 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTaskId(task.id);
                    }}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-[#7C3BEC] hover:bg-[#7C3BEC] hover:text-white border border-[#7C3BEC] rounded-lg transition-colors duration-200"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
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