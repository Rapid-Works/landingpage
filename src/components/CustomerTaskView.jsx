import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  Check, 
  CheckCheck, 
  User,
  Download,
  Euro,
  FileText,
  Calendar,
  X,
  AlertCircle,
  ArrowDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { addTaskMessage, updateTaskStatus, markMessagesAsRead } from '../utils/taskRequestService';
import { storage } from '../firebase/config';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { formatFileSize } from '../utils/taskFileService';

const CustomerTaskView = ({ taskData, onBack, viewOnly = false }) => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showPriceOffer, setShowPriceOffer] = useState(false);
  const [sending, setSending] = useState(false);
  const [currentTaskData, setCurrentTaskData] = useState(taskData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineFeedback, setDeclineFeedback] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const fileInputRef = useRef(null);

  // Load messages from task data when task changes or on initial load
  useEffect(() => {
    if (taskData?.id && (!currentTaskData || taskData.id !== currentTaskData.id)) {
      console.log('Loading new task data:', taskData.id, 'with messages:', taskData.messages?.length || 0);
      
      // Ensure we always have the latest messages by setting them from taskData
      const latestMessages = taskData.messages || [];
      setMessages(latestMessages);
      setCurrentTaskData(taskData);
      
      // Check if there's a pending price offer
      if (latestMessages.length > 0) {
        const hasPriceOffer = latestMessages.some(msg => msg.type === 'price_offer');
        setShowPriceOffer(hasPriceOffer && ['estimate_provided', 'estimated'].includes(taskData.status));
      }
      // Mark expert messages read when customer opens chat
      markMessagesAsRead(taskData.id, 'customer');
    }
    // Also update messages if the same task has new messages
    else if (taskData?.id === currentTaskData?.id && taskData.messages) {
      const currentMessageCount = messages.length;
      const newMessageCount = taskData.messages.length;
      
      if (newMessageCount > currentMessageCount) {
        console.log('Updating messages for existing task:', newMessageCount - currentMessageCount, 'new messages');
        setMessages(taskData.messages);
      }
    }
  }, [taskData?.id, taskData?.messages?.length]); // Depend on both task ID and message count

  // Separate effect for status changes that don't affect messages
  useEffect(() => {
    if (taskData?.status && currentTaskData?.id === taskData.id) {
      setCurrentTaskData(prev => prev ? { ...prev, status: taskData.status } : taskData);
      
      // Update showPriceOffer based on current status and messages
      const hasPriceOffer = messages.some(msg => msg.type === 'price_offer');
      setShowPriceOffer(hasPriceOffer && ['estimate_provided', 'estimated'].includes(taskData.status));
    }
  }, [taskData?.status, taskData?.id, currentTaskData?.id, messages]);

  // Only auto-scroll when new messages are added, not on initial load
  const [initialLoad, setInitialLoad] = useState(true);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  
  useEffect(() => {
    // Only scroll if we have more messages than before and it's not the initial load
    if (!initialLoad && messages.length > lastMessageCount) {
      // Small delay to ensure DOM is updated
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (initialLoad) {
      setInitialLoad(false);
    }
    setLastMessageCount(messages.length);
  }, [messages]);

  // Track scroll to toggle scroll-to-bottom button
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

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || sending) return;

    setSending(true);
    const messageContent = message.trim();
    setMessage(''); // Clear immediately to prevent blinking

    try {
      const newMessage = {
        sender: 'customer',
        content: messageContent,
        read: false,
        senderName: currentUser?.displayName || currentUser?.email || 'Customer',
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

    } catch (error) {
      console.error('Error sending message:', error);
      setMessage(messageContent); // Restore message on error
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  }, [message, sending, currentUser?.email, currentUser?.displayName, taskData.id]);

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
      // Upload to Firebase Storage and send message with download URL
      const path = `taskAttachments/${taskData.id}/${Date.now()}_${file.name}`;
      const ref = storageRef(storage, path);
      await uploadBytes(ref, file);
      const downloadURL = await getDownloadURL(ref);

      const fileMessage = {
        sender: 'customer',
        content: `Sent file: ${file.name}`,
        read: false,
        senderName: currentUser?.displayName || currentUser?.email || 'Customer',
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

  const handleAcceptOffer = async () => {
    try {
      // Get the current estimate data from the task
      const estimateData = currentTaskData.estimateData;
      
      // Update task status to accepted and save order information for invoicing
      await updateTaskStatus(taskData.id, 'accepted', {
        estimateAccepted: true,
        acceptedAt: new Date().toISOString(),
        orderConfirmed: true,
        invoiceData: {
          customerName: currentUser?.displayName || currentUser?.email,
          customerEmail: currentUser?.email,
          taskName: currentTaskData.taskName,
          taskId: taskData.id,
          hours: estimateData?.hours || 0,
          price: estimateData?.price || 0,
          rate: estimateData?.rate || 0,
          deadline: estimateData?.deadline || '',
          orderedAt: new Date().toISOString(),
          status: 'pending_work' // For tracking work completion
        }
      });

      // Create a single unified status message visible to both parties
      const unifiedAcceptanceMessage = {
        sender: 'system',
        type: 'status_update',
        content: `✅ Estimate accepted by ${currentUser?.displayName || currentUser?.email || 'Customer'}.`,
        read: false,
        senderName: 'System',
        senderEmail: 'system@rapidworks.de'
      };

      await addTaskMessage(taskData.id, unifiedAcceptanceMessage);

      // Do not append locally to avoid duplicates; the realtime data will update messages
      setShowPriceOffer(false);
      setCurrentTaskData(prev => ({ ...prev, status: 'accepted' }));

    } catch (error) {
      console.error('Error accepting offer:', error);
      alert('Failed to accept offer. Please try again.');
    }
  };

  const handleDeclineOffer = async () => {
    try {
      // Update task status to declined
      await updateTaskStatus(taskData.id, 'declined', {
        estimateAccepted: false,
        declinedAt: new Date().toISOString(),
        declineFeedback: declineFeedback || ''
      });

      // Create a single unified status message visible to both parties
      const unifiedDeclineMessage = {
        sender: 'system',
        type: 'status_update',
        content: `❌ Estimate declined by ${currentUser?.displayName || currentUser?.email || 'Customer'}.${declineFeedback ? `\nFeedback: ${declineFeedback}` : ''}`,
        read: false,
        senderName: 'System',
        senderEmail: 'system@rapidworks.de'
      };

      await addTaskMessage(taskData.id, unifiedDeclineMessage);

      // Do not append locally to avoid duplicates; the realtime data will update messages
      setShowPriceOffer(false);
      setShowDeclineModal(false);
      setDeclineFeedback('');
      setCurrentTaskData(prev => ({ ...prev, status: 'declined' }));

    } catch (error) {
      console.error('Error declining offer:', error);
      alert('Failed to decline offer. Please try again.');
    }
  };

  const formatPrice = (price) => `€${price.toLocaleString()}`;

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

  const MessageBubble = React.memo(({ msg }) => {
    const isCurrentUser = msg.sender === 'customer';

    if (msg.type === 'price_offer') {
      return (
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-white border-2 border-[#7C3BEC] rounded-2xl p-6 max-w-lg w-full shadow-lg">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#7C3BEC] rounded-full mb-3">
                <Euro className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Fixed Price Offer</h3>
              <div className="text-4xl font-bold text-[#7C3BEC] mt-2">
                {msg.content.hours}h - {formatPrice(msg.content.price)}
              </div>
              <p className="text-gray-600 text-sm">
                €{msg.content.rate}/hour • Delivery in {msg.content.deadline}
              </p>
            </div>

            {showPriceOffer && (
              <div className="space-y-3">
                <button
                  onClick={handleAcceptOffer}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  Order Now with Obligation to Pay
                </button>
                <button
                  onClick={() => setShowDeclineModal(true)}
                  className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Decline
                </button>
              </div>
            )}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        className={`flex mb-6 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`flex gap-3 max-w-[75%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
          {!isCurrentUser && (
            <div className="w-10 h-10 bg-gradient-to-br from-[#7C3BEC] to-[#9F7AEA] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <User className="h-5 w-5 text-white" />
            </div>
          )}
          
          <div className="flex flex-col">
            <div className={`rounded-2xl px-4 py-3 shadow-sm ${
              isCurrentUser 
                ? 'bg-blue-600 text-white' 
                : 'bg-white border border-gray-200 text-gray-900'
            }`}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
              
              {/* File Attachment */}
              {msg.fileAttachment && (
                <div className={`mt-3 p-3 rounded-lg ${
                  isCurrentUser 
                    ? 'bg-white/20' 
                    : 'bg-gray-100 border border-gray-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isCurrentUser 
                        ? 'bg-white/20' 
                        : 'bg-gray-200'
                    }`}>
                      <Paperclip className={`h-5 w-5 ${
                        isCurrentUser ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        isCurrentUser ? 'text-white' : 'text-gray-900'
                      }`}>
                        {msg.fileAttachment.name}
                      </p>
                      <p className={`text-xs ${
                        isCurrentUser ? 'text-white/75' : 'text-gray-500'
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
                            isCurrentUser 
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
                          isCurrentUser 
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
            
            <div className={`flex items-center gap-1 mt-2 text-xs text-gray-500 ${
              isCurrentUser ? 'justify-end' : 'justify-start'
            }`}>
              <span>{new Date(msg.timestamp || msg.createdAt).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}</span>
              {isCurrentUser && (
                <div className="ml-1">
                  {msg.read ? (
                    <CheckCheck className="h-3 w-3 text-green-500" />
                  ) : (
                    <Check className="h-3 w-3 text-gray-400" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  });

  const TaskDetailsSection = useMemo(() => {
    // Show section if there's any task data to display
    const hasDescription = currentTaskData.taskDescription && currentTaskData.taskDescription.trim() !== '';
    const hasFiles = currentTaskData.files && currentTaskData.files.length > 0;
    const hasDueDate = currentTaskData.dueDate;
    
    if (!hasDescription && !hasFiles && !hasDueDate) {
      return null;
    }

    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4" data-testid="task-details-section">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <FileText className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2">Original Task Request</h4>
            
            {hasDescription && (
              <div className="mb-3" data-testid="task-description">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {currentTaskData.taskDescription}
                </p>
              </div>
            )}

            {hasDueDate && (
              <div className="mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {formatReadableDate(currentTaskData.dueDate)}</span>
                </div>
              </div>
            )}

            {hasFiles && (
              <div data-testid="task-files">
                <p className="text-sm font-medium text-gray-900 mb-2">Attached Files:</p>
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
  }, [currentTaskData?.taskDescription, currentTaskData?.files, currentTaskData?.dueDate]);

  if (!currentTaskData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3BEC]"></div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-[70vh] flex flex-col relative">
      {/* Simple Header - Sticky */}
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
            <h3 className="font-semibold text-gray-900 text-lg">{currentTaskData.expertName || 'Expert'}</h3>
            <p className="text-sm text-gray-600">{currentTaskData.taskName}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              {/* Order Now Button for Pending Estimates */}
              {showPriceOffer && (currentTaskData.status === 'estimate_provided' || currentTaskData.status === 'estimated') && (
                <button
                  onClick={handleAcceptOffer}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                >
                  Order Now
                </button>
              )}
              <button
                onClick={scrollToTop}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50"
                title="View task details"
              >
                View task
              </button>
              
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
                {currentTaskData.status === 'pending' && 'New Task'}
              </div>
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
        {TaskDetailsSection}
        <div className="space-y-1">
          {messages
            .filter(msg => {
              // Hide legacy system-only messages that previously showed different content per role
              if (msg.sender === 'system' && typeof msg.content === 'string' && (
                msg.content.includes('Please begin work immediately') ||
                msg.content.includes('was cancelled') ||
                msg.content.includes('accepted your fixed price offer')
              )) {
                return false;
              }
              return true;
            })
            .map((msg) => (
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

      {/* Message Input - Sticky at bottom */}
      {!viewOnly ? (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 pt-8 pb-16 backdrop-blur-sm bg-white/95">
        <div className="flex items-end gap-3">
          <button 
            onClick={triggerFileUpload}
            disabled={uploadingFile}
            className="p-3 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0 mb-1 disabled:opacity-50"
            title={uploadingFile ? 'Uploading...' : 'Attach file'}
          >
            {uploadingFile ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
            ) : (
              <Paperclip className="h-5 w-5 text-gray-600" />
            )}
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
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7C3BEC]/50 focus:border-[#7C3BEC] disabled:opacity-50 bg-gray-50 focus:bg-white transition-colors resize-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || sending}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-xl font-medium transition-all duration-200 ${
                  message.trim() && !sending
                    ? 'bg-gradient-to-r from-[#7C3BEC] to-[#9F7AEA] hover:shadow-lg hover:scale-105 text-white'
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
      </div>
      ) : (
        <div className="sticky bottom-0 bg-amber-50 border-t border-amber-200 px-6 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 text-amber-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">View Only Mode</span>
              <span className="text-sm">You can view this conversation but cannot interact</span>
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
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

      {/* Decline Feedback Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Decline Offer</h3>
                <p className="text-gray-600">
                  We are sorry for not meeting your expectations. To improve our services we would be happy if you let us know in which way we failed your expectations.
                </p>
              </div>
              
              <textarea
                value={declineFeedback}
                onChange={(e) => setDeclineFeedback(e.target.value)}
                placeholder="Please share your feedback (optional)..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none mb-6"
              />
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeclineModal(false);
                    setDeclineFeedback('');
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeclineOffer}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Decline Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerTaskView; 