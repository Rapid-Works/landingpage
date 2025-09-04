import React, { useState, useContext, useEffect } from 'react';
import { X, Loader2, CheckCircle, AlertCircle, Clock, Upload, Calendar, FileText, Image, Archive, Building2, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LanguageContext as AppLanguageContext } from '../App';
import { uploadTaskFiles, formatFileSize, getFileCategory } from '../utils/taskFileService';
import { saveTaskRequest } from '../utils/taskRequestService';
import { getExpertEmailByRole } from '../utils/expertService';
import { sendNewTaskNotification, sendSimpleTaskNotification, sendPowerAutomateTaskNotification, testTeamsWebhook } from '../utils/teamsWebhookService';
import { getCurrentUserContext } from '../utils/organizationService';
import CreateOrganizationModal from './CreateOrganizationModal';
import customerNotificationService from '../utils/customerNotificationService';

const NewTaskModal = ({ isOpen, onClose, selectedExpertType = '', expertName = '' }) => {
  const { currentUser } = useAuth();
  const context = useContext(AppLanguageContext);
  const [currentContext, setCurrentContext] = useState(null);
  const [loadingContext, setLoadingContext] = useState(true);
  const [formData, setFormData] = useState({
    taskName: '',
    taskDescription: '',
    dueDate: '',
    dueTime: '',
    files: [] // Will store { name, url, size, type } objects after upload
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false);
  const [isFirstTask, setIsFirstTask] = useState(false);
  const [enablingNotifications, setEnablingNotifications] = useState(false);
  const [lastSubmittedTaskId, setLastSubmittedTaskId] = useState(null);
  const [showNotificationButton, setShowNotificationButton] = useState(true);

  const handleEnableNotifications = async () => {
    if (enablingNotifications) return;
    
    setEnablingNotifications(true);
    try {
      console.log('🔔 Setting up notifications for user...');
      
      // Check if user already has notifications enabled
      const tokenCheck = await customerNotificationService.checkUserHasNotificationTokens(currentUser.email);
      
      if (tokenCheck.hasTokens) {
        console.log('✅ User already has notifications enabled');
        // Hide the button since notifications are already working
        setShowNotificationButton(false);
        return;
      }
      
      // Use the same method as dashboard notification settings
      const { requestNotificationPermission } = await import('../firebase/messaging');
      const notificationResult = await requestNotificationPermission();
      
      console.log('Notification setup result:', notificationResult);
      
      if (notificationResult.success && lastSubmittedTaskId) {
        // Send the notification for the task they just submitted
        const taskData = {
          id: lastSubmittedTaskId,
          taskName: formData.taskName,
          taskDescription: formData.taskDescription,
          dueDate: formData.dueDate
        };
        
        const notificationSent = await customerNotificationService.sendTaskSubmittedNotification(
          taskData,
          currentUser.email
        );
        console.log('Task notification sent:', notificationSent);
      }
      
      // After successful setup, hide the button
      setShowNotificationButton(false);
    } catch (error) {
      console.error('Error enabling notifications:', error);
    } finally {
      setEnablingNotifications(false);
    }
  };

  // Debug: Track expert props
  useEffect(() => {
    console.log('🎯 NewTaskModal props updated:', {
      selectedExpertType,
      expertName,
      isOpen
    });
  }, [selectedExpertType, expertName, isOpen]);

  // Translation content
  const translations = {
    en: {
      title: "Describe your Task",
      description1: "Describe the task (In German or English).",
      description2: "will then directly review it and make sure everything is understood perfectly. He might reach out to you via push notification to make sure the task is understood correct. Once all is clear",
      description3: "will make a work time estimate and send you a fixed price offer. You can then accept or reject this offer. When accepted",
      description4: "will fulfill the task and send you the result once finished. Regardless of how long",
      description5: "took, we will charge you the agreed fixed price in the next monthly invoice.",
      ourExpert: "Our expert",
      taskNameLabel: "Task Name *",
      taskNamePlaceholder: "e.g., Build responsive landing page",
      taskDescriptionLabel: "Task Description *",
      taskDescriptionPlaceholder: "Please provide detailed requirements, specifications, and any specific needs...",
      taskDescriptionHelp: "The more details you provide, the more accurate the estimate will be.",
      dueDateLabel: "Due Date (Optional)",
      dueDatePrefix: "Due:",
      filesLabel: "Additional Files (Optional)",
      filesUploadText: "Click to upload files or drag and drop",
      filesAccepted: "PDF, DOC, Images, ZIP, TXT, CSV files up to 10MB each",
      filesUploading: "Uploading files...",
      filesUploadingWait: "Please wait while your files are being uploaded",
      uploadedFiles: "Uploaded Files:",
      uploaded: "✓ Uploaded",
      viewFile: "View",
      submitButton: "Request Fixed Price Offer",
      submittingButton: "Submitting Request...",
      successTitle: "Task Submitted Successfully!",
      successMessage: "Your task has been sent to our expert for review.",
      successSubtext: "You'll receive push notifications when the expert responds with questions or an estimate.",
      closeButton: "Close",
      errorRequired: "Please fill in all required fields",
      errorLogin: "You must be logged in to submit a task request.",
      errorLoginFiles: "You must be logged in to upload files.",
      errorFileSize: "File size must be less than 10MB",
      // Organization context
      organizationContext: "Organization Required",
      taskFor: "Creating task for",
      personalAccount: "Personal Account",
      noOrganization: "Organization Required",
      noOrganizationMessage: "You need to be part of an organization to create tasks. Please create an organization first.",
      createOrganization: "Create Organization"
    },
    de: {
      title: "Beschreibe deine Aufgabe",
      description1: "Beschreibe die Aufgabe (auf Deutsch oder Englisch).",
      description2: "wird sie dann direkt überprüfen und sicherstellen, dass alles perfekt verstanden wird. Er könnte dich über Push-Benachrichtigung kontaktieren, um sicherzustellen, dass die Aufgabe richtig verstanden wurde. Sobald alles klar ist, wird",
      description3: "eine Arbeitszeitschätzung vornehmen und dir ein Fixpreis-Angebot senden. Du kannst dieses Angebot dann annehmen oder ablehnen. Bei Annahme wird",
      description4: "die Aufgabe erfüllen und dir das Ergebnis nach Abschluss senden. Unabhängig davon, wie lange",
      description5: "gebraucht hat, berechnen wir dir den vereinbarten Fixpreis in der nächsten monatlichen Rechnung.",
      ourExpert: "Unser Experte",
      taskNameLabel: "Aufgabenname *",
      taskNamePlaceholder: "z.B., Responsive Landing Page erstellen",
      taskDescriptionLabel: "Aufgabenbeschreibung *",
      taskDescriptionPlaceholder: "Bitte geben Sie detaillierte Anforderungen, Spezifikationen und alle besonderen Bedürfnisse an...",
      taskDescriptionHelp: "Je mehr Details Sie angeben, desto genauer wird die Schätzung.",
      dueDateLabel: "Fälligkeitsdatum (Optional)",
      dueDatePrefix: "Fällig:",
      filesLabel: "Zusätzliche Dateien (Optional)",
      filesUploadText: "Klicken zum Hochladen oder per Drag & Drop",
      filesAccepted: "PDF, DOC, Bilder, ZIP, TXT, CSV Dateien bis zu 10MB je Datei",
      filesUploading: "Dateien werden hochgeladen...",
      filesUploadingWait: "Bitte warten Sie, während Ihre Dateien hochgeladen werden",
      uploadedFiles: "Hochgeladene Dateien:",
      uploaded: "✓ Hochgeladen",
      viewFile: "Ansehen",
      submitButton: "Fixpreis-Angebot anfragen",
      submittingButton: "Anfrage wird gesendet...",
      successTitle: "Aufgabe erfolgreich eingereicht!",
      successMessage: "Ihre Aufgabe wurde zur Überprüfung an unseren Experten gesendet.",
      successSubtext: "Sie erhalten Push-Benachrichtigungen, wenn der Experte mit Fragen oder einem Kostenvoranschlag antwortet.",
      closeButton: "Schließen",
      errorRequired: "Bitte füllen Sie alle Pflichtfelder aus",
      errorLogin: "Sie müssen angemeldet sein, um eine Aufgabe zu übermitteln.",
      errorLoginFiles: "Sie müssen angemeldet sein, um Dateien hochzuladen.",
      errorFileSize: "Die Dateigröße muss unter 10MB liegen",
      // Organization context
      organizationContext: "Organisation erforderlich",
      taskFor: "Erstelle Aufgabe für",
      personalAccount: "Persönliches Konto",
      noOrganization: "Organisation erforderlich",
      noOrganizationMessage: "Sie müssen Teil einer Organisation sein, um Aufgaben zu erstellen. Bitte erstellen Sie zuerst eine Organisation.",
      createOrganization: "Organisation erstellen"
    }
  };

  const { language } = context || { language: 'en' };
  const t = translations[language] || translations.en;

  // Load user context when modal opens
  useEffect(() => {
    const loadUserContext = async () => {
      if (!currentUser || !isOpen) return;
      
      setLoadingContext(true);
      try {
        const userContext = await getCurrentUserContext(currentUser.uid);
        setCurrentContext(userContext);
        
        // Check if user already has notifications enabled
        const tokenCheck = await customerNotificationService.checkUserHasNotificationTokens(currentUser.email);
        if (tokenCheck.hasTokens) {
          console.log('✅ User already has notifications enabled, hiding button');
          setShowNotificationButton(false);
        } else {
          console.log('⚠️ User has no notification tokens, showing button');
          setShowNotificationButton(true);
        }
      } catch (error) {
        console.error('Error loading user context:', error);
      } finally {
        setLoadingContext(false);
      }
    };

    loadUserContext();
  }, [currentUser, isOpen]);

  // Handle organization context change
  const handleContextChange = (newContext) => {
    setCurrentContext(newContext);
  };

  // Handle organization creation success
  const handleOrganizationCreated = async () => {
    setIsCreateOrgModalOpen(false);
    // Refresh user context after organization creation
    if (currentUser) {
      try {
        const userContext = await getCurrentUserContext(currentUser.uid);
        setCurrentContext(userContext);
      } catch (error) {
        console.error('Error refreshing user context:', error);
      }
    }
  };

  // Check if user has any organizations
  const hasOrganizations = () => {
    return currentContext?.type === 'organization';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Validation
    if (!formData.taskName.trim() || !formData.taskDescription.trim()) {
      setStatus('error');
      setErrorMessage(t.errorRequired);
      return;
    }

    if (!currentUser) {
      setStatus('error');
      setErrorMessage(t.errorLogin);
      return;
    }

    try {
      // Use current organization context
      const userContext = currentContext;
      
      // Get expert email for the selected expert type
      const expertEmail = getExpertEmailByRole(selectedExpertType);
      
      // Prepare task data
      const taskData = {
        taskName: formData.taskName.trim(),
        taskDescription: formData.taskDescription.trim(),
        dueDate: formData.dueDate || null,
        dueTime: formData.dueTime || null,
        dueDatetime: formData.dueDate && formData.dueTime ? `${formData.dueDate}T${formData.dueTime}` : null,
        files: formData.files, // This now contains uploaded file objects with URLs
        expertType: selectedExpertType,
        expertName: expertName,
        expertEmail: expertEmail, // Add expert email for filtering
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || currentUser.email,
        status: 'pending',
        createdAt: new Date().toISOString(),
        exactTimestamp: Date.now(), // Exact millisecond timestamp
        updatedAt: new Date().toISOString(),
        // Organization context
        organizationId: userContext.type === 'organization' ? userContext.organization.id : null,
        organizationName: userContext.type === 'organization' ? userContext.organization.name : null,
        createdBy: currentUser.email // Track who created the task
      };

      console.log('Submitting task request:', taskData);
      
      // Save task request to Firebase
      const taskId = await saveTaskRequest(taskData);
      console.log('Task request saved with ID:', taskId);
      setLastSubmittedTaskId(taskId); // Store for notification setup later
      
      // Check if this is the user's first task submission
      try {
        console.log('🆕 Checking if this is the user\'s first task...');
        const { getUserTaskRequests } = await import('../utils/taskRequestService');
        const userTasks = await getUserTaskRequests(currentUser.uid, 5); // Get a few tasks to be sure
        
        // Filter out the task we just created to get previous tasks
        const previousTasks = userTasks.filter(task => task.id !== taskId);
        const isFirstTask = previousTasks.length === 0; // No previous tasks = first task
        
        console.log(`📊 User has ${userTasks.length} total task(s), ${previousTasks.length} previous task(s). First task: ${isFirstTask}`);
        setIsFirstTask(isFirstTask);
        
        // For all users, try to send a notification (quietly)
        try {
          const tokenCheck = await customerNotificationService.checkUserHasNotificationTokens(currentUser.email);
          
          if (tokenCheck.hasTokens) {
            console.log('✅ User already has notifications enabled');
            const notificationResult = await customerNotificationService.sendTaskSubmittedNotification(
              { ...taskData, id: taskId },
              currentUser.email
            );
            console.log('Task notification sent:', notificationResult);
          } else {
            console.log('⚠️ User has no notification tokens yet');
            // Don't show popup here - we'll show button on success page for first-time users
          }
        } catch (notifError) {
          console.log('Notification check failed:', notifError);
        }
      } catch (taskCheckError) {
        console.error('Error checking user task history:', taskCheckError);
        setIsFirstTask(false); // Default to false if check fails
      }
      
      // Send Teams notification (don't wait for it, run in background)
      try {
        const teamsNotificationData = {
          taskName: taskData.taskName,
          expertType: taskData.expertType,
          expertName: taskData.expertName,
          customerName: taskData.userName,
          customerEmail: taskData.userEmail,
          description: taskData.taskDescription,
          dueDate: taskData.dueDate,
          files: taskData.files,
          taskId: taskId,
          organizationName: taskData.organizationName,
          createdBy: taskData.createdBy
        };
        
        console.log('📤 Sending Teams notification with data:', teamsNotificationData);
        
        // Try different formats in order of likelihood to work with Power Automate
        sendPowerAutomateTaskNotification(teamsNotificationData)
          .then(success => {
            if (!success) {
              console.log('🔄 Power Automate format failed, trying simple text...');
              return sendSimpleTaskNotification(teamsNotificationData);
            }
            return success;
          })
          .then(success => {
            if (!success) {
              console.log('🔄 Simple format failed, trying rich format...');
              return sendNewTaskNotification(teamsNotificationData);
            }
            return success;
          })
          .catch(error => {
            console.error('Teams notification failed (non-critical):', error);
          });
      } catch (error) {
        console.error('Teams notification setup failed (non-critical):', error);
      }
      
      setStatus('success');
      
      // Reset form data immediately but don't close modal
      setFormData({
        taskName: '',
        taskDescription: '', 
        dueDate: '',
        dueTime: '',
        files: []
      });
      
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message || (language === 'de' ? 'Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.' : 'Failed to submit request. Please try again.'));
      console.error("Submission failed:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (files) => {
    if (files.length === 0) return;

    if (!currentUser) {
      setErrorMessage(t.errorLoginFiles);
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
      setErrorMessage(error.message || (language === 'de' ? 'Fehler beim Hochladen der Dateien. Bitte versuchen Sie es erneut.' : 'Failed to upload files. Please try again.'));
    } finally {
      setUploadingFiles(false);
      setUploadProgress({});
    }
  };

  const handleFileInputChange = async (e) => {
    const files = Array.from(e.target.files);
    await handleFileUpload(files);
    // Reset file input
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (uploadingFiles || status === 'loading') return;
    
    const files = Array.from(e.dataTransfer.files);
    await handleFileUpload(files);
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

  const formatDateTimeDisplay = (dateString, timeString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const dateFormatted = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    if (timeString) {
      return `${dateFormatted} at ${timeString}`;
    }
    
    return dateFormatted;
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
            setLastSubmittedTaskId(null);
            setIsFirstTask(false);
            setEnablingNotifications(false);
            setShowNotificationButton(true);
          }}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200 z-10"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="p-8 pt-12">
          {status === 'success' ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{t.successTitle}</h3>
              <p className="text-gray-600 mb-2 text-lg">
                {t.successMessage}
              </p>
              <p className="text-gray-500 mb-6">
                {t.successSubtext}
              </p>
              
              {/* Notification setup for all users */}
              {showNotificationButton && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Bell className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Enable notifications</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Get instant updates when our expert reviews your task and provides feedback.
                      </p>
                      <button
                        onClick={handleEnableNotifications}
                        disabled={enablingNotifications}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white text-sm rounded-md font-medium transition-colors"
                      >
                        {enablingNotifications ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Enabling...
                          </>
                        ) : (
                          <>
                            <Bell className="h-3.5 w-3.5" />
                            Enable
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => {
                  setStatus('idle');
                  setLastSubmittedTaskId(null);
                  setIsFirstTask(false);
                  setEnablingNotifications(false);
                  setShowNotificationButton(true);
                  onClose();
                }}
                className="px-8 py-3 bg-[#7C3BEC] hover:bg-[#6B32D6] text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                {t.closeButton}
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#7C3BEC] to-[#9F7AEA] rounded-full mb-6">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold mb-4 text-gray-900">{t.title}</h2>
                             <div className="max-w-2xl mx-auto">
                   <p className="text-gray-600 leading-relaxed text-lg">
                     {t.description1} {expertName || t.ourExpert} {t.description2} {expertName || t.ourExpert} {t.description3} {expertName || t.ourExpert} {t.description4} {expertName || t.ourExpert} {t.description5}
                   </p>
                 </div>
              </div>

              {/* Organization Context Switcher */}
              {!loadingContext && !hasOrganizations() ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-amber-800 mb-2">{t.noOrganization}</h4>
                      <p className="text-sm text-amber-700 mb-4">{t.noOrganizationMessage}</p>
                      <button 
                        onClick={() => setIsCreateOrgModalOpen(true)}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
                      >
                        {t.createOrganization}
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Task Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t.taskNameLabel}
                </label>
                <input
                  type="text"
                  value={formData.taskName}
                  onChange={(e) => handleInputChange('taskName', e.target.value)}
                  placeholder={t.taskNamePlaceholder}
                  className="w-full h-16 px-6 text-lg border-2 border-gray-300 rounded-xl focus:border-[#7C3BEC] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                  disabled={status === 'loading'}
                  required
                />
              </div>

              {/* Task Description */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t.taskDescriptionLabel}
                </label>
                <textarea
                  value={formData.taskDescription}
                  onChange={(e) => handleInputChange('taskDescription', e.target.value)}
                  placeholder={t.taskDescriptionPlaceholder}
                  rows={6}
                  className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-[#7C3BEC] focus:outline-none transition-colors duration-200 resize-none placeholder-gray-400"
                  disabled={status === 'loading'}
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  {t.taskDescriptionHelp}
                </p>
              </div>

              {/* Due Date & Time */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t.dueDateLabel}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date Input */}
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
                  
                  {/* Time Input */}
                  <div className="relative">
                    <input
                      type="time"
                      value={formData.dueTime}
                      onChange={(e) => handleInputChange('dueTime', e.target.value)}
                      className="w-full h-16 px-6 text-lg border-2 border-gray-300 rounded-xl focus:border-[#7C3BEC] focus:outline-none transition-colors duration-200 text-gray-700 bg-white"
                      disabled={status === 'loading' || !formData.dueDate}
                      placeholder="Select time"
                      style={{
                        colorScheme: 'light'
                      }}
                    />
                  </div>
                </div>
                
                {/* Date/Time Display */}
                {formData.dueDate && (
                  <p className="text-sm text-gray-600 mt-2">
                    {t.dueDatePrefix} {formatDateTimeDisplay(formData.dueDate, formData.dueTime)}
                  </p>
                )}
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t.filesLabel}
                </label>
                                 <div 
                   className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ${
                     uploadingFiles ? 'border-[#7C3BEC] bg-purple-50' : 'border-gray-300 hover:border-[#7C3BEC]'
                   }`}
                   onDragOver={handleDragOver}
                   onDragEnter={handleDragEnter}
                   onDragLeave={handleDragLeave}
                   onDrop={handleDrop}
                 >
                   <input
                     type="file"
                     multiple
                     onChange={handleFileInputChange}
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
                           <p className="text-lg font-medium text-[#7C3BEC] mb-2">{t.filesUploading}</p>
                           <p className="text-sm text-gray-500">{t.filesUploadingWait}</p>
                         </>
                       ) : (
                         <>
                           <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                           <p className="text-lg font-medium text-gray-700 mb-2">{t.filesUploadText}</p>
                           <p className="text-sm text-gray-500">{t.filesAccepted}</p>
                         </>
                       )}
                     </div>
                   </label>
                 </div>
                
                                 {formData.files.length > 0 && (
                   <div className="mt-4 space-y-3">
                     <p className="text-sm font-semibold text-gray-700">{t.uploadedFiles}</p>
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
                               <span className="text-green-600 font-medium">{t.uploaded}</span>
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
                             {t.viewFile}
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
                    status === 'loading' || !hasOrganizations()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#FF6B47] to-[#FF8A65] hover:from-[#E55A3C] hover:to-[#FF7043] hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                  disabled={status === 'loading' || !hasOrganizations()}
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-6 w-6" />
                      {t.submittingButton}
                    </>
                  ) : !hasOrganizations() ? (
                    t.organizationRequired
                  ) : (
                    t.submitButton
                  )}
                </button>
              </div>
            </form>
            </>
          )}
        </div>
      </div>
      
      {/* Create Organization Modal */}
      {isCreateOrgModalOpen && (
        <CreateOrganizationModal
          isOpen={isCreateOrgModalOpen}
          onClose={() => setIsCreateOrgModalOpen(false)}
          onSuccess={handleOrganizationCreated}
        />
      )}
    </div>
  );
};

export default NewTaskModal; 