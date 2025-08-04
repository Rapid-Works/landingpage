import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  Check, 
  CheckCheck, 
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  Euro,
  FileText,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { addTaskMessage, updateTaskStatus, getTaskRequest } from '../utils/taskRequestService';
import { formatFileSize } from '../utils/taskFileService';

const CustomerTaskView = ({ taskData, onBack }) => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showPriceOffer, setShowPriceOffer] = useState(false);
  const [sending, setSending] = useState(false);
  const [currentTaskData, setCurrentTaskData] = useState(taskData);
  const messagesEndRef = useRef(null);

  // Load messages from task data
  useEffect(() => {
    if (taskData?.messages) {
      setMessages(taskData.messages);
      
      // Check if there's a pending price offer
      const hasPriceOffer = taskData.messages.some(msg => msg.type === 'price_offer');
      setShowPriceOffer(hasPriceOffer && ['estimate_provided', 'estimated'].includes(taskData.status));
    }
    setCurrentTaskData(taskData);
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

  const handleSendMessage = async () => {
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      const newMessage = {
        sender: 'customer',
        content: message.trim(),
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
      setMessage('');

      // Refresh task data to get updated messages from Firebase
      setTimeout(async () => {
        try {
          const updatedTask = await getTaskRequest(taskData.id);
          setMessages(updatedTask.messages || []);
          setCurrentTaskData(updatedTask);
        } catch (error) {
          console.error('Error refreshing task data:', error);
        }
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleAcceptOffer = async () => {
    try {
      // Send acceptance message
      const acceptMessage = {
        sender: 'customer',
        content: 'I accept your offer! Please proceed with the project.',
        read: false,
        senderName: currentUser?.displayName || currentUser?.email || 'Customer',
        senderEmail: currentUser?.email
      };

      await addTaskMessage(taskData.id, acceptMessage);

      // Update task status to accepted
      await updateTaskStatus(taskData.id, 'accepted', {
        estimateAccepted: true,
        acceptedAt: new Date().toISOString()
      });

      // Update local state
      const messageWithId = {
        ...acceptMessage,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, messageWithId]);
      setShowPriceOffer(false);
      setCurrentTaskData(prev => ({ ...prev, status: 'accepted' }));

    } catch (error) {
      console.error('Error accepting offer:', error);
      alert('Failed to accept offer. Please try again.');
    }
  };

  const handleDeclineOffer = async () => {
    try {
      // Send decline message
      const declineMessage = {
        sender: 'customer',
        content: 'Thank you for the offer, but I need to decline at this time.',
        read: false,
        senderName: currentUser?.displayName || currentUser?.email || 'Customer',
        senderEmail: currentUser?.email
      };

      await addTaskMessage(taskData.id, declineMessage);

      // Update task status to declined
      await updateTaskStatus(taskData.id, 'declined', {
        estimateAccepted: false,
        declinedAt: new Date().toISOString()
      });

      // Update local state
      const messageWithId = {
        ...declineMessage,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, messageWithId]);
      setShowPriceOffer(false);
      setCurrentTaskData(prev => ({ ...prev, status: 'declined' }));

    } catch (error) {
      console.error('Error declining offer:', error);
      alert('Failed to decline offer. Please try again.');
    }
  };

  const formatPrice = (price) => `€${price.toLocaleString()}`;

  const MessageBubble = ({ msg }) => {
    const isCurrentUser = msg.sender === 'customer';
    const isSystem = msg.sender === 'system';

    if (msg.type === 'price_offer') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-white border-2 border-[#7C3BEC] rounded-2xl p-6 max-w-lg w-full shadow-lg">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#7C3BEC] rounded-full mb-3">
                <Euro className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Fixed Price Offer</h3>
              <div className="text-3xl font-bold text-[#7C3BEC] mt-2">
                {formatPrice(msg.content.price)}
              </div>
              <p className="text-gray-600 text-sm">
                {msg.content.hours} hours • Delivery in {msg.content.deadline}
              </p>
            </div>

            {/* Breakdown */}
            {msg.content.breakdown && (
              <div className="space-y-2 mb-4">
                <h4 className="font-semibold text-gray-900 text-sm">Work Breakdown:</h4>
                {msg.content.breakdown.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.item}</span>
                    <span className="font-medium">{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Deliverables */}
            {msg.content.deliverables && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 text-sm mb-2">Deliverables:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {msg.content.deliverables.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {showPriceOffer && (
              <div className="flex gap-3">
                <button
                  onClick={handleDeclineOffer}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={handleAcceptOffer}
                  className="flex-1 px-4 py-2 bg-[#7C3BEC] hover:bg-[#6B32D6] text-white rounded-lg font-medium transition-colors"
                >
                  Accept Offer
                </button>
              </div>
            )}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`flex gap-3 max-w-[70%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
          {!isCurrentUser && (
            <div className="w-8 h-8 bg-[#7C3BEC] rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-white" />
            </div>
          )}
          
          <div>
            <div className={`rounded-2xl px-4 py-3 ${
              isCurrentUser 
                ? 'bg-[#7C3BEC] text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
            
            <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
              isCurrentUser ? 'justify-end' : 'justify-start'
            }`}>
              <span>{new Date(msg.timestamp || msg.createdAt).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}</span>
              {isCurrentUser && (
                <div className="ml-1">
                  {msg.read ? (
                    <CheckCheck className="h-3 w-3 text-blue-500" />
                  ) : (
                    <Check className="h-3 w-3" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const TaskDetailsSection = () => {
    if (!currentTaskData.taskDescription && !currentTaskData.files?.length) return null;

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-2">Original Task Request</h4>
            
            {currentTaskData.taskDescription && (
              <div className="mb-3">
                <p className="text-sm text-blue-800 leading-relaxed">
                  {currentTaskData.taskDescription}
                </p>
              </div>
            )}

            {currentTaskData.dueDate && (
              <div className="mb-3">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {new Date(currentTaskData.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            )}

            {currentTaskData.files && currentTaskData.files.length > 0 && (
              <div>
                <p className="text-sm font-medium text-blue-900 mb-2">Attached Files:</p>
                <div className="space-y-2">
                  {currentTaskData.files.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-blue-700 bg-white rounded px-2 py-1">
                      <Paperclip className="h-3 w-3" />
                      <span className="flex-1">{file.name}</span>
                      {file.size && (
                        <span className="text-xs text-blue-500">
                          {formatFileSize(file.size)}
                        </span>
                      )}
                      {file.url && (
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Download className="h-3 w-3" />
                        </a>
                      )}
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

  return (
    <div className="bg-white rounded-2xl shadow-xl h-[600px] flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
          )}
          
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#7C3BEC] rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{currentTaskData.expertName || 'Expert'}</h3>
                <p className="text-sm text-gray-600">{currentTaskData.expertType}</p>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">{currentTaskData.taskName}</div>
            <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
              currentTaskData.status === 'estimate_provided' || currentTaskData.status === 'estimated' ? 'bg-purple-100 text-purple-800' :
              currentTaskData.status === 'accepted' ? 'bg-green-100 text-green-800' :
              currentTaskData.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              currentTaskData.status === 'completed' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {(currentTaskData.status === 'estimate_provided' || currentTaskData.status === 'estimated') && 'Awaiting Your Response'}
              {currentTaskData.status === 'accepted' && 'Accepted'}
              {currentTaskData.status === 'in_progress' && 'In Progress'}
              {currentTaskData.status === 'completed' && 'Completed'}
              {currentTaskData.status === 'pending' && 'Pending'}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <TaskDetailsSection />
        <div className="space-y-1">
          {messages.map((msg) => (
            <MessageBubble key={msg.id || `${msg.timestamp}-${msg.content}`} msg={msg} />
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-6">
        <div className="flex gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Paperclip className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="Type your message..."
              disabled={sending}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || sending}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                message.trim() && !sending
                  ? 'bg-[#7C3BEC] hover:bg-[#6B32D6] text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
  );
};

export default CustomerTaskView; 