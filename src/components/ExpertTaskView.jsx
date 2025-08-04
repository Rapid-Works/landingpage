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
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { addTaskMessage, updateTaskStatus, getTaskRequest, addTaskEstimate } from '../utils/taskRequestService';
import { formatFileSize } from '../utils/taskFileService';

const ExpertTaskView = ({ taskData, onBack }) => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [currentTaskData, setCurrentTaskData] = useState(taskData);
  const [estimate, setEstimate] = useState({
    items: [{ description: '', hours: 0, rate: 80 }],
    deliverables: [''],
    deadline: '3 business days',
    notes: ''
  });
  const messagesEndRef = useRef(null);

  // Load messages from task data
  useEffect(() => {
    if (taskData?.messages) {
      setMessages(taskData.messages);
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

  const addEstimateItem = () => {
    setEstimate(prev => ({
      ...prev,
      items: [...prev.items, { description: '', hours: 0, rate: 80 }]
    }));
  };

  const updateEstimateItem = (index, field, value) => {
    setEstimate(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeEstimateItem = (index) => {
    if (estimate.items.length > 1) {
      setEstimate(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const addDeliverable = () => {
    setEstimate(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, '']
    }));
  };

  const updateDeliverable = (index, value) => {
    setEstimate(prev => ({
      ...prev,
      deliverables: prev.deliverables.map((item, i) => 
        i === index ? value : item
      )
    }));
  };

  const removeDeliverable = (index) => {
    if (estimate.deliverables.length > 1) {
      setEstimate(prev => ({
        ...prev,
        deliverables: prev.deliverables.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateTotal = () => {
    return estimate.items.reduce((total, item) => total + (item.hours * item.rate), 0);
  };

  const sendEstimate = async () => {
    try {
      const total = calculateTotal();
      const totalHours = estimate.items.reduce((sum, item) => sum + item.hours, 0);

      // Create the estimate message
      const estimateMessage = {
        sender: 'system',
        type: 'price_offer',
        content: {
          hours: totalHours,
          price: total,
          breakdown: estimate.items.map(item => ({
            item: item.description,
            hours: item.hours,
            price: item.hours * item.rate
          })),
          deliverables: estimate.deliverables.filter(d => d.trim()),
          deadline: estimate.deadline,
          notes: estimate.notes
        },
        read: false,
        senderName: 'System',
        senderEmail: 'system@rapidworks.de'
      };

      // Add message to Firebase
      await addTaskMessage(taskData.id, estimateMessage);

      // Update task status to estimate_provided
      await updateTaskStatus(taskData.id, 'estimate_provided', {
        estimateProvided: true,
        estimateData: {
          hours: totalHours,
          price: total,
          breakdown: estimate.items.map(item => ({
            item: item.description,
            hours: item.hours,
            price: item.hours * item.rate
          })),
          deliverables: estimate.deliverables.filter(d => d.trim()),
          deadline: estimate.deadline,
          notes: estimate.notes,
          providedAt: new Date().toISOString(),
          providedBy: currentUser?.email
        }
      });

      // Update local state
      const messageWithId = {
        ...estimateMessage,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, messageWithId]);
      setShowEstimateModal(false);
      setCurrentTaskData(prev => ({ ...prev, status: 'estimate_provided' }));
      
      // Reset estimate
      setEstimate({
        items: [{ description: '', hours: 0, rate: 80 }],
        deliverables: [''],
        deadline: '3 business days',
        notes: ''
      });

    } catch (error) {
      console.error('Error sending estimate:', error);
      alert('Failed to send estimate. Please try again.');
    }
  };

  const MessageBubble = ({ msg }) => {
    const isExpert = msg.sender === 'expert';
    const isCustomer = msg.sender === 'customer';

    if (msg.type === 'price_offer') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 max-w-lg w-full">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mb-3">
                <Euro className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Estimate Sent</h3>
              <div className="text-2xl font-bold text-green-600 mt-2">
                €{msg.content.price.toLocaleString()}
              </div>
              <p className="text-gray-600 text-sm">
                {msg.content.hours} hours • {msg.content.deadline}
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
        initial={{ opacity: 0, y: 10 }}
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
                ? 'bg-[#7C3BEC] text-white' 
                : isCustomer
                ? `bg-gray-100 text-gray-900 ${!msg.read ? 'ring-2 ring-blue-200' : ''}`
                : 'bg-yellow-100 text-gray-900'
            }`}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
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
  };

  const EstimateModal = () => {
    if (!showEstimateModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Create Price Estimate</h3>
                <p className="text-gray-600">Provide a detailed breakdown for {currentTaskData.userName || currentTaskData.userEmail}</p>
              </div>
              <button
                onClick={() => setShowEstimateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Work Items */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Work Breakdown</h4>
              {estimate.items.map((item, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Work description"
                    value={item.description}
                    onChange={(e) => updateEstimateItem(index, 'description', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Hours"
                    value={item.hours}
                    onChange={(e) => updateEstimateItem(index, 'hours', parseFloat(e.target.value) || 0)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) => updateEstimateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent"
                  />
                  <div className="w-24 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 flex items-center">
                    €{(item.hours * item.rate).toFixed(0)}
                  </div>
                  {estimate.items.length > 1 && (
                    <button
                      onClick={() => removeEstimateItem(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              
              <button
                onClick={addEstimateItem}
                className="text-[#7C3BEC] hover:text-[#6B32D6] text-sm font-medium"
              >
                + Add work item
              </button>
            </div>

            {/* Deliverables */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Deliverables</h4>
              {estimate.deliverables.map((deliverable, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="What will be delivered"
                    value={deliverable}
                    onChange={(e) => updateDeliverable(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent"
                  />
                  {estimate.deliverables.length > 1 && (
                    <button
                      onClick={() => removeDeliverable(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              
              <button
                onClick={addDeliverable}
                className="text-[#7C3BEC] hover:text-[#6B32D6] text-sm font-medium"
              >
                + Add deliverable
              </button>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Timeline</h4>
              <select
                value={estimate.deadline}
                onChange={(e) => setEstimate(prev => ({ ...prev, deadline: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent"
              >
                <option value="1 business day">1 business day</option>
                <option value="2 business days">2 business days</option>
                <option value="3 business days">3 business days</option>
                <option value="1 week">1 week</option>
                <option value="2 weeks">2 weeks</option>
                <option value="1 month">1 month</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Additional Notes</h4>
              <textarea
                placeholder="Any additional information or requirements..."
                value={estimate.notes}
                onChange={(e) => setEstimate(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent"
              />
            </div>

            {/* Total */}
            <div className="bg-[#7C3BEC]/5 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900">Total Estimate</p>
                  <p className="text-sm text-gray-600">
                    {estimate.items.reduce((sum, item) => sum + item.hours, 0)} hours total
                  </p>
                </div>
                <div className="text-3xl font-bold text-[#7C3BEC]">
                  €{calculateTotal().toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex gap-3">
            <button
              onClick={() => setShowEstimateModal(false)}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={sendEstimate}
              className="flex-1 px-6 py-3 bg-[#7C3BEC] hover:bg-[#6B32D6] text-white rounded-lg font-medium transition-colors"
            >
              Send Estimate
            </button>
          </div>
        </div>
      </div>
    );
  };

  const TaskDetailsSection = () => {
    if (!currentTaskData.taskDescription && !currentTaskData.files?.length) return null;

    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <FileText className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-green-900 mb-2">Customer's Original Request</h4>
            
            {currentTaskData.taskDescription && (
              <div className="mb-3">
                <p className="text-sm text-green-800 leading-relaxed">
                  {currentTaskData.taskDescription}
                </p>
              </div>
            )}

            {currentTaskData.dueDate && (
              <div className="mb-3">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {new Date(currentTaskData.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            )}

            {currentTaskData.files && currentTaskData.files.length > 0 && (
              <div>
                <p className="text-sm font-medium text-green-900 mb-2">Customer's Files:</p>
                <div className="space-y-2">
                  {currentTaskData.files.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-green-700 bg-white rounded px-2 py-1">
                      <Paperclip className="h-3 w-3" />
                      <span className="flex-1">{file.name}</span>
                      {file.size && (
                        <span className="text-xs text-green-500">
                          {formatFileSize(file.size)}
                        </span>
                      )}
                      {file.url && (
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800"
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

  const unreadCount = messages.filter(msg => msg.sender === 'customer' && !msg.read).length;

  return (
    <>
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
                <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{currentTaskData.userName || currentTaskData.userEmail}</h3>
                    {unreadCount > 0 && (
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{currentTaskData.userEmail}</p>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{currentTaskData.taskName}</div>
              <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                currentTaskData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                currentTaskData.status === 'estimate_provided' || currentTaskData.status === 'estimated' ? 'bg-purple-100 text-purple-800' :
                currentTaskData.status === 'accepted' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {currentTaskData.status === 'pending' && 'Needs Review'}
                {(currentTaskData.status === 'estimate_provided' || currentTaskData.status === 'estimated') && 'Awaiting Customer'}
                {currentTaskData.status === 'accepted' && 'Accepted'}
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
          <div className="flex gap-3 mb-3">
            <button
              onClick={() => setShowEstimateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors"
            >
              <Calculator className="h-4 w-4" />
              Create Estimate
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors">
              <Upload className="h-4 w-4" />
              Send Files
            </button>
          </div>
          
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

      <EstimateModal />
    </>
  );
};

export default ExpertTaskView; 