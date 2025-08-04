import React, { useState } from 'react';
import { X, Loader2, CheckCircle, AlertCircle, Clock, Upload, Calendar, FileText, Image, Archive } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { uploadTaskFiles, formatFileSize, getFileCategory } from '../utils/taskFileService';
import { saveTaskRequest } from '../utils/taskRequestService';
import { getExpertEmailByRole } from '../utils/expertService';

const NewTaskModal = ({ isOpen, onClose, selectedExpertType = '', expertName = '' }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    taskName: '',
    taskDescription: '',
    dueDate: '',
    files: [] // Will store { name, url, size, type } objects after upload
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Validation
    if (!formData.taskName.trim() || !formData.taskDescription.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields');
      return;
    }

    if (!currentUser) {
      setStatus('error');
      setErrorMessage('You must be logged in to submit a task request.');
      return;
    }

    try {
      // Get expert email for the selected expert type
      const expertEmail = getExpertEmailByRole(selectedExpertType);
      
      // Prepare task data
      const taskData = {
        taskName: formData.taskName.trim(),
        taskDescription: formData.taskDescription.trim(),
        dueDate: formData.dueDate || null,
        files: formData.files, // This now contains uploaded file objects with URLs
        expertType: selectedExpertType,
        expertName: expertName,
        expertEmail: expertEmail, // Add expert email for filtering
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || currentUser.email,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Submitting task request:', taskData);
      
      // Save task request to Firebase
      const taskId = await saveTaskRequest(taskData);
      console.log('Task request saved with ID:', taskId);
      
      setStatus('success');
      
      // Reset form and close modal after delay
      setTimeout(() => {
        setFormData({
          taskName: '',
          taskDescription: '', 
          dueDate: '',
          files: []
        });
        setStatus('idle');
        onClose();
      }, 2000);
      
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message || 'Failed to submit request. Please try again.');
      console.error("Submission failed:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (!currentUser) {
      setErrorMessage('You must be logged in to upload files.');
      return;
    }

    setUploadingFiles(true);
    setErrorMessage('');
    
    try {
      // Use the task file service to upload files
      const uploadedFiles = await uploadTaskFiles(files, currentUser.uid);
      
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...uploadedFiles]
      }));

    } catch (error) {
      console.error('File upload failed:', error);
      setErrorMessage(error.message || 'Failed to upload files. Please try again.');
    } finally {
      setUploadingFiles(false);
      setUploadProgress({});
      // Reset file input
      e.target.value = '';
    }
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const getFileIcon = (fileType) => {
    const category = getFileCategory(fileType);
    switch (category) {
      case 'image':
        return <Image className="h-4 w-4 text-white" />;
      case 'pdf':
        return <FileText className="h-4 w-4 text-white" />;
      case 'archive':
        return <Archive className="h-4 w-4 text-white" />;
      case 'document':
        return <FileText className="h-4 w-4 text-white" />;
      default:
        return <FileText className="h-4 w-4 text-white" />;
    }
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto relative transform transition-all duration-300 ease-out scale-100">
        <button
          onClick={() => { 
            onClose(); 
            setStatus('idle'); 
            setFormData({
              taskName: '',
              taskDescription: '',
              dueDate: '',
              files: []
            });
          }}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200 z-10"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="p-8 pt-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#7C3BEC] to-[#9F7AEA] rounded-full mb-6">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Describe your Task</h2>
                         <div className="max-w-2xl mx-auto">
               <p className="text-gray-600 leading-relaxed text-lg">
                 Describe the task (In German or English). <span className="text-[#7C3BEC] font-semibold">{expertName || 'Our expert'}</span> will then directly 
                 review it and make sure everything is understood perfectly. He 
                 might reach out to you via push notification to make sure the task is 
                 understood correct. Once all is clear <span className="text-[#7C3BEC] font-semibold">{expertName || 'our expert'}</span> will make a work time 
                 estimate and send you a fixed price offer. You can then accept or 
                 reject this offer. When accepted <span className="text-[#7C3BEC] font-semibold">{expertName || 'our expert'}</span> will fulfill the task and send 
                 you the result once finished. Regardless of how long <span className="text-[#7C3BEC] font-semibold">{expertName || 'our expert'}</span> took, we 
                 will charge you the agreed fixed price in the next monthly invoice.
               </p>
             </div>
          </div>

          {status === 'success' ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Task Request Submitted!</h3>
              <p className="text-gray-600 mb-2 text-lg">
                Your task has been sent to our expert for review.
              </p>
              <p className="text-gray-500">
                You'll receive a fixed price offer soon via push notification.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Task Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Task Name *
                </label>
                <input
                  type="text"
                  value={formData.taskName}
                  onChange={(e) => handleInputChange('taskName', e.target.value)}
                  placeholder="e.g., Build responsive landing page"
                  className="w-full h-16 px-6 text-lg border-2 border-gray-300 rounded-xl focus:border-[#7C3BEC] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                  disabled={status === 'loading'}
                  required
                />
              </div>

              {/* Task Description */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Task Description *
                </label>
                <textarea
                  value={formData.taskDescription}
                  onChange={(e) => handleInputChange('taskDescription', e.target.value)}
                  placeholder="Please provide detailed requirements, specifications, and any specific needs..."
                  rows={6}
                  className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-[#7C3BEC] focus:outline-none transition-colors duration-200 resize-none placeholder-gray-400"
                  disabled={status === 'loading'}
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  The more details you provide, the more accurate the estimate will be.
                </p>
              </div>

              {/* Due Date */}
                             <div className="space-y-2">
                 <label className="block text-sm font-semibold text-gray-700 mb-3">
                   Due Date (Optional)
                 </label>
                 <div className="relative">
                   <input
                     type="date"
                     value={formData.dueDate}
                     onChange={(e) => handleInputChange('dueDate', e.target.value)}
                     className="w-full h-16 px-6 text-lg border-2 border-gray-300 rounded-xl focus:border-[#7C3BEC] focus:outline-none transition-colors duration-200 text-gray-700 bg-white date-input"
                     disabled={status === 'loading'}
                     style={{
                       colorScheme: 'light',
                       WebkitAppearance: 'none',
                       MozAppearance: 'textfield'
                     }}
                   />
                   <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 pointer-events-none" />
                 </div>
                 {formData.dueDate && (
                   <p className="text-sm text-gray-600 mt-2">
                     Due: {formatDateDisplay(formData.dueDate)}
                   </p>
                 )}
               </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Additional Files (Optional)
                </label>
                                 <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ${
                   uploadingFiles ? 'border-[#7C3BEC] bg-purple-50' : 'border-gray-300 hover:border-[#7C3BEC]'
                 }`}>
                   <input
                     type="file"
                     multiple
                     onChange={handleFileUpload}
                     className="hidden"
                     id="file-upload"
                     accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.webp,.zip,.txt,.csv"
                     disabled={uploadingFiles || status === 'loading'}
                   />
                   <label htmlFor="file-upload" className={`cursor-pointer ${uploadingFiles ? 'pointer-events-none' : ''}`}>
                     <div className="text-gray-500">
                       {uploadingFiles ? (
                         <>
                           <Loader2 className="h-12 w-12 mx-auto mb-4 text-[#7C3BEC] animate-spin" />
                           <p className="text-lg font-medium text-[#7C3BEC] mb-2">Uploading files...</p>
                           <p className="text-sm text-gray-500">Please wait while your files are being uploaded</p>
                         </>
                       ) : (
                         <>
                           <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                           <p className="text-lg font-medium text-gray-700 mb-2">Click to upload files or drag and drop</p>
                           <p className="text-sm text-gray-500">PDF, DOC, Images, ZIP, TXT, CSV files up to 10MB each</p>
                         </>
                       )}
                     </div>
                   </label>
                 </div>
                
                                 {formData.files.length > 0 && (
                   <div className="mt-4 space-y-3">
                     <p className="text-sm font-semibold text-gray-700">Uploaded Files:</p>
                     {formData.files.map((file, index) => (
                       <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                         <div className="flex items-center space-x-3">
                           <div className="w-8 h-8 bg-[#7C3BEC] rounded-lg flex items-center justify-center">
                             {getFileIcon(file.type)}
                           </div>
                           <div className="flex-1">
                             <p className="text-sm font-medium text-gray-900">{file.name}</p>
                             <div className="flex items-center space-x-2 text-xs text-gray-500">
                               <span>{formatFileSize(file.size)}</span>
                               <span>•</span>
                               <span className="text-green-600 font-medium">✓ Uploaded</span>
                             </div>
                           </div>
                         </div>
                         <div className="flex items-center space-x-2">
                           <a
                             href={file.url}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="text-[#7C3BEC] hover:text-[#6B32D6] text-xs font-medium"
                           >
                             View
                           </a>
                           <button
                             type="button"
                             onClick={() => removeFile(index)}
                             className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors duration-200"
                           >
                             <X className="h-4 w-4" />
                           </button>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
              </div>

              {errorMessage && (
                <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className={`w-full inline-flex justify-center items-center px-8 py-5 text-white rounded-xl font-bold text-lg transition-all duration-200 transform ${
                    status === 'loading'
                      ? 'bg-orange-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#FF6B47] to-[#FF8A65] hover:from-[#E55A3C] hover:to-[#FF7043] hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-6 w-6" />
                      Submitting Request...
                    </>
                  ) : (
                    'Request Fixed Price Offer'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewTaskModal; 