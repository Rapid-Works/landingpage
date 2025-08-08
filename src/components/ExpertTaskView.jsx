import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  Check, 
  CheckCheck, 
  Clock,
  User,
  Calculator,
  FileText,
  Upload,
  Euro,
  AlertCircle,
  CheckCircle,
  Calendar,
  Download,
  X,
  ArrowDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { addTaskMessage, updateTaskStatus, getTaskRequest, markMessagesAsRead } from '../utils/taskRequestService';
import { formatFileSize } from '../utils/taskFileService';
import { storage } from '../firebase/config';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const ExpertTaskView = ({ taskData, onBack, viewOnly = false }) => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [currentTaskData, setCurrentTaskData] = useState(taskData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [estimate, setEstimate] = useState({
    hours: 8,
    price: 320,
    deadline: '3 business days'
  });
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  // Helper function to format dates in a readable format
  const formatReadableDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    const formatted = d.toLocaleDateString('en-GB', options);
    
    // Add ordinal suffix (1st, 2nd, 3rd, etc.)
    const day = d.getDate();
    let suffix = 'th';
    if (day % 10 === 1 && day !== 11) suffix = 'st';
    else if (day % 10 === 2 && day !== 12) suffix = 'nd';
    else if (day % 10 === 3 && day !== 13) suffix = 'rd';
    
    return formatted.replace(/^\d+/, `${day}${suffix}`);
  };

  // Load messages from task data and check for existing estimate
  useEffect(() => {
    if (taskData?.messages) {
      setMessages(taskData.messages);
    }
    setCurrentTaskData(taskData);
    if (taskData?.id) {
      // Mark customer messages read when expert opens chat
      markMessagesAsRead(taskData.id, 'expert');
    }
    
    // If there's existing estimate data, populate the estimate form
    if (taskData?.estimateData) {
      setEstimate({
        hours: taskData.estimateData.hours || 8,
        price: taskData.estimateData.price || 320,
        deadline: taskData.estimateData.deadline || '3 business days'
      });
    }
  }, [taskData]);

  // Only auto-scroll when new messages are added, not on initial load
  const [initialLoad, setInitialLoad] = useState(true);
  
  useEffect(() => {
    if (!initialLoad) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setInitialLoad(false);
    }
  }, [messages]);

  // Track scroll position to show a scroll-to-bottom button when away from bottom
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const onScroll = () => {
      const threshold = 40;
      const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= threshold;
      setShowScrollToBottom(!atBottom);
    };
    container.addEventListener('scroll', onScroll);
    onScroll();
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    messagesContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      const newMessage = {
        sender: 'expert',
        content: message.trim(),
        read: false,
        senderName: currentUser?.displayName || currentUser?.email || 'Expert',
        senderEmail: currentUser?.email
      };

      // Add message to Firebase
      await addTaskMessage(taskData.id, newMessage);

      // Update local messages immediately for better UX
      const messageWithId = {
        ...newMessage,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, messageWithId]);
      setMessage('');

      // No manual refresh needed; realtime listener will sync

    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploadingFile(true);
    
    try {
      // Upload to Firebase Storage and send as a message
      const path = `taskAttachments/${taskData.id}/${Date.now()}_${file.name}`;
      const ref = storageRef(storage, path);
      await uploadBytes(ref, file);
      const downloadURL = await getDownloadURL(ref);

      const fileMessage = {
        sender: 'expert',
        content: `Sent file: ${file.name}`,
        read: false,
        senderName: currentUser?.displayName || currentUser?.email || 'Expert',
        senderEmail: currentUser?.email,
        fileAttachment: {
          name: file.name,
          size: file.size,
          type: file.type,
          url: downloadURL,
          storagePath: path
        }
      };

      await addTaskMessage(taskData.id, fileMessage);

      // Update local messages immediately for better UX
      const messageWithId = {
        ...fileMessage,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, messageWithId]);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploadingFile(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };


  const sendEstimate = async () => {
    try {
      const isEditing = currentTaskData?.estimateData;
      
      if (!isEditing) {
        // Create new estimate message only if one doesn't exist
        const estimateMessage = {
          sender: 'system',
          type: 'price_offer',
          content: {
            hours: estimate.hours,
            price: estimate.price,
            deadline: estimate.deadline,
            rate: estimate.hours > 0 ? Math.round(estimate.price / estimate.hours) : 0
          },
          read: false,
          senderName: 'System',
          senderEmail: 'system@rapidworks.de'
        };

        // Add message to Firebase
        await addTaskMessage(taskData.id, estimateMessage);
        
        // Update local messages
        const messageWithId = {
          ...estimateMessage,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, messageWithId]);
      } else {
        // Update existing estimate in messages
        const updatedMessages = messages.map(msg => {
          if (msg.type === 'price_offer') {
            return {
              ...msg,
              content: {
                hours: estimate.hours,
                price: estimate.price,
                deadline: estimate.deadline,
                rate: estimate.hours > 0 ? Math.round(estimate.price / estimate.hours) : 0
              }
            };
          }
          return msg;
        });
        setMessages(updatedMessages);
      }

      // Update task status and estimate data
      await updateTaskStatus(taskData.id, 'estimate_provided', {
        estimateProvided: true,
        estimateData: {
          hours: estimate.hours,
          price: estimate.price,
          deadline: estimate.deadline,
          rate: estimate.hours > 0 ? Math.round(estimate.price / estimate.hours) : 0,
          providedAt: currentTaskData?.estimateData?.providedAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          providedBy: currentUser?.email
        }
      });

      setShowEstimateModal(false);
      setCurrentTaskData(prev => ({ ...prev, status: 'estimate_provided' }));

    } catch (error) {
      console.error('Error sending estimate:', error);
      alert('Failed to send estimate. Please try again.');
    }
  };

  const MessageBubble = React.memo(({ msg }) => {
    const isExpert = msg.sender === 'expert';
    const isCustomer = msg.sender === 'customer';

    if (msg.type === 'price_offer') {
      return (
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 max-w-lg w-full">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mb-3">
                <Euro className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Estimate Sent</h3>
              <div className="text-3xl font-bold text-green-600 mt-2">
                {msg.content.hours}h - €{msg.content.price.toLocaleString()}
              </div>
              <p className="text-gray-600 text-sm">
                €{msg.content.rate}/hour • Delivery in {msg.content.deadline}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Waiting for customer response...</p>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        className={`flex mb-4 ${isExpert ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`flex gap-3 max-w-[70%] ${isExpert ? 'flex-row-reverse' : 'flex-row'}`}>
          {isCustomer && (
            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-white" />
            </div>
          )}
          
          <div>
            <div className={`rounded-2xl px-4 py-3 ${
              isExpert 
                ? 'bg-blue-600 text-white' 
                : isCustomer
                ? `bg-gray-100 text-gray-900 ${!msg.read ? 'ring-2 ring-blue-200' : ''}`
                : 'bg-yellow-100 text-gray-900'
            }`}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
              
              {/* File Attachment */}
              {msg.fileAttachment && (
                <div className={`mt-3 p-3 rounded-lg ${
                  isExpert 
                    ? 'bg-white/20' 
                    : 'bg-gray-100 border border-gray-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isExpert 
                        ? 'bg-white/20' 
                        : 'bg-gray-200'
                    }`}>
                      <Paperclip className={`h-5 w-5 ${
                        isExpert ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        isExpert ? 'text-white' : 'text-gray-900'
                      }`}>
                        {msg.fileAttachment.name}
                      </p>
                      <p className={`text-xs ${
                        isExpert ? 'text-white/75' : 'text-gray-500'
                      }`}>
                        {formatFileSize(msg.fileAttachment.size)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {msg.fileAttachment.type?.startsWith('image/') && (
                        <button
                          onClick={() => {
                            setSelectedFile(msg.fileAttachment);
                            setShowFileModal(true);
                          }}
                          className={`px-3 py-1 rounded text-xs transition-colors ${
                            isExpert 
                              ? 'bg-white/20 hover:bg-white/30 text-white' 
                              : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                          }`}
                        >
                          Preview
                        </button>
                      )}
                      <a
                        href={msg.fileAttachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-3 py-1 rounded text-xs transition-colors ${
                          isExpert 
                            ? 'bg-white/20 hover:bg-white/30 text-white' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
              isExpert ? 'justify-end' : 'justify-start'
            }`}>
              <span>{new Date(msg.timestamp || msg.createdAt).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}</span>
              {isExpert && (
                <div className="ml-1">
                  {msg.read ? (
                    <CheckCheck className="h-3 w-3 text-blue-500" />
                  ) : (
                    <Check className="h-3 w-3" />
                  )}
                </div>
              )}
              {isCustomer && !msg.read && (
                <div className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  });

  const EstimateModal = React.memo(() => {
    if (!showEstimateModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#7C3BEC] to-[#9F7AEA] text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold mb-1">
                  {currentTaskData?.estimateData ? 'Edit Price Estimate' : 'Create Price Estimate'}
                </h3>
                <p className="text-purple-100">
                  {currentTaskData?.estimateData ? 'Update your ' : 'Detailed breakdown for '}
                  {currentTaskData?.estimateData ? 'estimate' : (currentTaskData.userName || currentTaskData.userEmail)}
                </p>
              </div>
              <button
                onClick={() => setShowEstimateModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* Simple Time and Price Form */}
            <div className="max-w-lg mx-auto space-y-8">
              {/* Hours and Price */}
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-6">
                  {/* Hours Input */}
                  <div className="text-center">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hours</label>
                    <input
                      type="number"
                      value={estimate.hours}
                      onChange={(e) => setEstimate(prev => ({ ...prev, hours: parseFloat(e.target.value) || 0 }))}
                      className="w-20 text-3xl font-bold text-center border-0 border-b-2 border-gray-300 focus:border-[#7C3BEC] focus:outline-none bg-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">hours</p>
                  </div>

                  <div className="text-3xl font-bold text-gray-400">-</div>

                  {/* Price Input */}
                  <div className="text-center">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={estimate.price}
                        onChange={(e) => setEstimate(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        className="w-28 text-3xl font-bold text-center border-0 border-b-2 border-gray-300 focus:border-[#7C3BEC] focus:outline-none bg-transparent pl-6"
                      />
                      <span className="absolute left-0 top-0 text-3xl font-bold text-gray-600">€</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">total</p>
                  </div>
                </div>

                {/* Rate Calculation Display */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    Rate: <span className="font-semibold">€{estimate.hours > 0 ? Math.round(estimate.price / estimate.hours) : 0}/hour</span>
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">Delivery Time</label>
                <select
                  value={estimate.deadline}
                  onChange={(e) => setEstimate(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC]/50 focus:border-[#7C3BEC] text-center font-medium bg-white"
                >
                  <option value="1 business day">1 business day</option>
                  <option value="2 business days">2 business days</option>
                  <option value="3 business days">3 business days</option>
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="1 month">1 month</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
            <div className="flex gap-3">
              <button
                onClick={() => setShowEstimateModal(false)}
                className="flex-1 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={sendEstimate}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#7C3BEC] to-[#9F7AEA] hover:shadow-lg text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02]"
              >
                {currentTaskData?.estimateData ? 'Update Estimate' : 'Send Estimate to Client'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  });

  const TaskDetailsSection = () => {
    if (!currentTaskData.taskDescription && !currentTaskData.files?.length) return null;

    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <FileText className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2">Customer's Original Request</h4>
            
            {currentTaskData.taskDescription && (
              <div className="mb-3">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {currentTaskData.taskDescription}
                </p>
              </div>
            )}

            {currentTaskData.dueDate && (
              <div className="mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {formatReadableDate(currentTaskData.dueDate)}</span>
                </div>
              </div>
            )}

            {currentTaskData.files && currentTaskData.files.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Customer's Files:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {currentTaskData.files.map((file, index) => (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                      {/* File Preview */}
                      {file.type?.startsWith('image/') && file.url && (
                        <div className="aspect-video bg-gray-100 overflow-hidden">
                          <img 
                            src={file.url} 
                            alt={file.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            onClick={() => {
                              setSelectedFile(file);
                              setShowFileModal(true);
                            }}
                          />
                        </div>
                      )}
                      
                      {/* File Info */}
                      <div className="p-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-shrink-0">
                            {file.type?.startsWith('image/') ? (
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <FileText className="h-3 w-3 text-blue-600" />
                              </div>
                            ) : file.type === 'application/pdf' ? (
                              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                <FileText className="h-3 w-3 text-red-600" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <Paperclip className="h-3 w-3 text-gray-600" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                            {file.size && (
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          {file.type?.startsWith('image/') && file.url && (
                            <button
                              onClick={() => {
                                setSelectedFile(file);
                                setShowFileModal(true);
                              }}
                              className="flex-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 py-1 px-2 rounded transition-colors"
                            >
                              Preview
                            </button>
                          )}
                          {file.url && (
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 py-1 px-2 rounded transition-colors text-center"
                              title="Download file"
                            >
                              Download
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!currentTaskData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3BEC]"></div>
      </div>
    );
  }

  const unreadCount = messages.filter(msg => msg.sender === 'customer' && !msg.read).length;

  return (
    <div className="h-full min-h-[70vh] flex flex-col relative">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-10 border-b border-gray-200 px-6 pt-8 pb-6 flex-shrink-0 bg-white backdrop-blur-sm bg-white/95">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
          )}
          
          <div className="w-10 h-10 bg-gradient-to-br from-[#7C3BEC] to-[#9F7AEA] rounded-full flex items-center justify-center shadow-sm">
            <User className="h-5 w-5 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 text-lg">{currentTaskData.userName || currentTaskData.userEmail}</h3>
            </div>
            <p className="text-sm text-gray-600">{currentTaskData.taskName}</p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={scrollToTop}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50"
                title="View task details"
              >
                View task
              </button>
              {currentTaskData.status !== 'pending' && (
                <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                  currentTaskData.status === 'estimate_provided' || currentTaskData.status === 'estimated' ? 'bg-purple-100 text-purple-800' :
                  currentTaskData.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  currentTaskData.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  currentTaskData.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {(currentTaskData.status === 'estimate_provided' || currentTaskData.status === 'estimated') && 'Pending'}
                  {currentTaskData.status === 'accepted' && 'Accepted'}
                  {currentTaskData.status === 'in_progress' && 'Active'}
                  {currentTaskData.status === 'completed' && 'Done'}
                </div>
              )}
            </div>
            {currentTaskData.createdAt && (
              <p className="text-xs text-gray-500">
                {formatReadableDate(currentTaskData.createdAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 pb-24 relative">
        <TaskDetailsSection />
        <div className="space-y-1">
          {messages.map((msg) => (
            <MessageBubble key={msg.id || `${msg.timestamp}-${msg.content}`} msg={msg} />
          ))}
        </div>
        <div ref={messagesEndRef} />
        {showScrollToBottom && (
          <button
            onClick={scrollToBottom}
            className="absolute right-6 bottom-28 bg-white/90 border border-gray-200 shadow-sm hover:shadow-md rounded-full p-2"
            title="Scroll to latest"
          >
            <ArrowDown className="h-4 w-4 text-gray-700" />
          </button>
        )}
      </div>

      {/* Action Buttons and Message Input - Sticky at bottom */}
      {!viewOnly ? (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 pt-6 pb-16 backdrop-blur-sm bg-white/95">
          <div className="flex gap-3 mb-4">
            {/* Only show estimate button if task is not accepted/completed */}
            {!['accepted', 'completed', 'declined'].includes(currentTaskData?.status) && (
              <button
              onClick={() => setShowEstimateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors"
            >
              <Calculator className="h-4 w-4" />
              {currentTaskData?.estimateData ? 'Edit Estimate' : 'Create Estimate'}
            </button>
          )}
        </div>
        
        <div className="flex items-end gap-3">
          <button 
            onClick={triggerFileUpload}
            className="p-3 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0 mb-1"
          >
            <Paperclip className="h-5 w-5 text-gray-600" />
          </button>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt,.zip"
          />
          
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="Type your message..."
                disabled={sending}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:opacity-50 bg-gray-50 focus:bg-white transition-colors resize-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || sending}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-xl font-medium transition-all duration-200 ${
                  message.trim() && !sending
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-lg hover:scale-105 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {sending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Close sticky action container */}
      </div>
      ) : (
        <div className="sticky bottom-0 bg-amber-50 border-t border-amber-200 px-6 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 text-amber-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">View Only Mode</span>
              <span className="text-sm">You can view this conversation but cannot send messages or estimates</span>
            </div>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {showFileModal && selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{selectedFile.name}</h3>
              <button
                onClick={() => setShowFileModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-6">
              {selectedFile.type?.startsWith('image/') ? (
                <div className="flex justify-center">
                  <img 
                    src={selectedFile.url} 
                    alt={selectedFile.name}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Preview not available for this file type</p>
                  <a
                    href={selectedFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <EstimateModal />
    </div>
  );
};

export default ExpertTaskView; 