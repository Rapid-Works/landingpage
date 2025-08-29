import React, { useState, useContext, useEffect } from 'react';
import { X, Download, Upload, Loader2, CheckCircle, AlertCircle, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LanguageContext as AppLanguageContext } from '../App';
import { 
  uploadFrameworkDocument, 
  saveFrameworkAgreement 
} from '../utils/frameworkAgreementService';
import { getCurrentUserContext, hasUserOrganizationMembership } from '../utils/organizationService';
import CreateOrganizationModal from './CreateOrganizationModal';

const FrameworkAgreementModal = ({ isOpen, onClose, onAgreementSigned, userName = '', message = '' }) => {
  const [currentMessage, setCurrentMessage] = useState(message);
  const { currentUser } = useAuth();
  const context = useContext(AppLanguageContext);
  const [hasUploadedAgreement, setHasUploadedAgreement] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [currentContext, setCurrentContext] = useState(null);
  const [loadingContext, setLoadingContext] = useState(true);
  const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false);

  // Translation content
  const translations = {
    en: {
      title: "Rapid Experts Framework Agreement",
      greeting: "Hello",
      description: "It seems like you are trying to request a fixed price offer for the first time. In order to do so you first need to sign our",
      frameworkAgreement: "Rapid Experts Framework Agreement",
      explanation: "All further Requests of Rapid Experts will from then on rely on the terms agreed upon in this Framework Agreement. Once signed you can then always request fixed price offers with no further barriers.",
      downloadButton: "Download Framework Agreement PDF",
      downloadFilename: "Rapid Experts Framework Agreement.pdf",
      uploadTitle: "Upload signed Framework Agreement",
      uploadDescription: "Click to select your signed PDF file or drag and drop here",
      confirmButton: "Confirm Agreement Upload",
      uploading: "Uploading...",
      successTitle: "Agreement Uploaded!",
      successMessage: "Your signed Framework Agreement has been received.",
      successSubtext: "You can now request fixed price tasks from our experts.",
      nextButton: "Next",
      errorPdfOnly: "Please upload a PDF file.",
      errorFileSize: "File size must be less than 10MB.",
      errorUploadFirst: "Please upload the signed Framework Agreement first.",
      errorLoginRequired: "You must be logged in to upload the agreement.",
      // Organization context
      organizationContext: "Organization Required",
      signingAs: "Signing as",
      personalAccount: "Personal Account",
      adminRequired: "Administrator Required",
      adminRequiredMessage: "Only organization administrators can sign framework agreements. Please contact your administrator to sign the agreement for your organization.",
      contactAdmin: "Contact Administrator",
      memberAccess: "Member Access",
      cannotSign: "As a member, you cannot sign legal agreements for this organization.",
      noOrganization: "Organization Required",
      noOrganizationMessage: "You need to be part of an organization to sign framework agreements. Please create an organization first.",
      createOrganization: "Create Organization"
    },
    de: {
      title: "Rapid Experts Rahmenvertrag",
      greeting: "Hallo",
      description: "Es scheint, als würdest du zum ersten Mal versuchen, ein Fixpreis-Angebot anzufordern. Dafür musst du zuerst unseren",
      frameworkAgreement: "Rapid Experts Rahmenvertrag",
      explanation: "unterzeichnen. Alle weiteren Anfragen bei Rapid Experts basieren dann auf den in diesem Rahmenvertrag vereinbarten Bedingungen. Nach der Unterzeichnung kannst du jederzeit Fixpreis-Angebote ohne weitere Hürden anfordern.",
      downloadButton: "Rahmenvertrag PDF herunterladen",
      downloadFilename: "Rapid_Experts_Rahmenvertrag.pdf",
      uploadTitle: "Unterzeichneten Rahmenvertrag hochladen",
      uploadDescription: "Klicken Sie hier oder ziehen Sie Ihre unterzeichnete PDF-Datei hierher",
      confirmButton: "Upload des Vertrags bestätigen",
      uploading: "Wird hochgeladen...",
      successTitle: "Vertrag hochgeladen!",
      successMessage: "Ihr unterzeichneter Rahmenvertrag wurde empfangen.",
      successSubtext: "Sie können nun Fixpreis-Aufgaben von unseren Experten anfordern.",
      nextButton: "Weiter",
      errorPdfOnly: "Bitte laden Sie eine PDF-Datei hoch.",
      errorFileSize: "Die Dateigröße muss unter 10MB liegen.",
      errorUploadFirst: "Bitte laden Sie zuerst den unterzeichneten Rahmenvertrag hoch.",
      errorLoginRequired: "Sie müssen angemeldet sein, um den Vertrag hochzuladen.",
      // Organization context
      organizationContext: "Organisation erforderlich",
      signingAs: "Unterzeichnet als",
      personalAccount: "Persönliches Konto",
      adminRequired: "Administrator erforderlich",
      adminRequiredMessage: "Nur Organisationsadministratoren können Rahmenverträge unterzeichnen. Bitte kontaktieren Sie Ihren Administrator, um den Vertrag für Ihre Organisation zu unterzeichnen.",
      contactAdmin: "Administrator kontaktieren",
      memberAccess: "Mitgliederzugang",
      cannotSign: "Als Mitglied können Sie keine rechtlichen Vereinbarungen für diese Organisation unterzeichnen.",
      noOrganization: "Organisation erforderlich",
      noOrganizationMessage: "Sie müssen Teil einer Organisation sein, um Rahmenverträge zu unterzeichnen. Bitte erstellen Sie zuerst eine Organisation.",
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
        // Check if user has any organization membership
        const hasOrganization = await hasUserOrganizationMembership(currentUser.uid);
        
        if (hasOrganization) {
          const userContext = await getCurrentUserContext(currentUser.uid);
          setCurrentContext(userContext);
        } else {
          // User has no organization
          setCurrentContext(null);
        }
      } catch (error) {
        console.error('Error loading user context:', error);
      } finally {
        setLoadingContext(false);
      }
    };

    loadUserContext();
  }, [currentUser, isOpen]);

  // Update current message when prop changes
  useEffect(() => {
    setCurrentMessage(message);
  }, [message]);

  // Handle organization creation success
  const handleOrganizationCreated = async () => {
    setIsCreateOrgModalOpen(false);
    // Clear the message since user now has an organization
    setCurrentMessage('');
    
    // Refresh user context after organization creation
    if (currentUser) {
      try {
        setLoadingContext(true);
        // Check if user has any organization membership
        const hasOrganization = await hasUserOrganizationMembership(currentUser.uid);
        
        if (hasOrganization) {
          const userContext = await getCurrentUserContext(currentUser.uid);
          setCurrentContext(userContext);
        } else {
          // User has no organization
          setCurrentContext(null);
        }
      } catch (error) {
        console.error('Error refreshing user context:', error);
      } finally {
        setLoadingContext(false);
      }
    }
  };

  // Check if user can sign agreements
  const canSignAgreement = () => {
    if (!currentContext) return false;
    // Only organization admins can sign agreements
    return currentContext.permissions?.role === 'admin';
  };

  // Check if user has any organizations
  const hasOrganizations = () => {
    return currentContext !== null;
  };

  const handleFileUpload = (file) => {
    setErrorMessage('');
    
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      setErrorMessage(t.errorPdfOnly);
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setErrorMessage(t.errorFileSize);
      return;
    }
    
    setUploadedFile(file);
    setHasUploadedAgreement(true);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
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

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!hasUploadedAgreement) {
      setErrorMessage(t.errorUploadFirst);
      return;
    }

    if (!currentUser) {
      setErrorMessage(t.errorLoginRequired);
      return;
    }

    if (!canSignAgreement()) {
      setErrorMessage(t.cannotSign);
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    
    try {
      console.log('Uploading framework agreement...');
      
      // Upload the document to Firebase Storage
      const documentUrl = await uploadFrameworkDocument(uploadedFile, currentUser.uid);
      console.log('Document uploaded, URL:', documentUrl);
      
      // Prepare agreement data with organization context
      const agreementData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        documentUrl: documentUrl,
        organizationId: currentContext?.type === 'organization' ? currentContext.organization.id : null,
        organizationName: currentContext?.type === 'organization' ? currentContext.organization.name : null,
        signedBy: currentUser.displayName || currentUser.email,
        signedAsRole: currentContext?.type === 'organization' ? currentContext.permissions?.role : 'personal',
        signedAt: new Date().toISOString()
      };
      
      // Save the agreement status to Firestore
      await saveFrameworkAgreement(
        currentUser.uid, 
        currentUser.email, 
        documentUrl,
        agreementData
      );
      console.log('Agreement status saved to Firestore with organization context');
      
      setStatus('success');
      
      // Don't auto-close anymore, let user click "Next" button
      
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message || 'Failed to upload agreement. Please try again.');
      console.error('Agreement upload failed:', error);
    }
  };

  const downloadAgreement = () => {
    // In real implementation, this would download the actual PDF
    console.log('Downloading Rapid Experts Framework Agreement...');
    // Create a mock download
    const link = document.createElement('a');
    link.href = '#'; // Replace with actual PDF URL
    link.download = 'Rapid_Experts_Framework_Agreement.pdf';
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 ease-out scale-100">
        <button
          onClick={onClose}
          className="sticky top-4 right-4 float-right text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          {status === 'success' ? (
            <div className="text-center py-12">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{t.successTitle}</h3>
              <p className="text-gray-600 mb-2">
                {t.successMessage}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                {t.successSubtext}
              </p>
              <button
                onClick={() => {
                  onAgreementSigned();
                  onClose();
                  setStatus('idle');
                  setUploadedFile(null);
                  setHasUploadedAgreement(false);
                  setErrorMessage('');
                }}
                className="px-8 py-3 bg-[#7C3BEC] hover:bg-[#6B32D6] text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                {t.nextButton}
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">{t.title}</h2>
              
              {/* Organization Status */}
              {loadingContext ? (
                <div className="flex items-center justify-center py-4 mb-6">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400 mr-2" />
                  <span className="text-gray-500">Loading organization status...</span>
                </div>
              ) : currentMessage === 'no-organization' ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-amber-800 mb-2">Organization Required</h4>
                      <p className="text-sm text-amber-700 mb-4">Either create an organization or ask the admin of your company to invite you to an existing organization.</p>
                      <button 
                        onClick={() => setIsCreateOrgModalOpen(true)}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Create Organization
                      </button>
                    </div>
                  </div>
                </div>
              ) : currentMessage === 'admin-required' ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-amber-800 mb-2">Administrator Required</h4>
                      <p className="text-sm text-amber-700 mb-4">Only organization administrators can sign framework agreements. Please contact your administrator to sign the agreement for your organization.</p>
                      <button 
                        onClick={onClose}
                        className="text-sm font-medium text-amber-800 hover:text-amber-900 underline"
                      >
                        Contact Administrator
                      </button>
                    </div>
                  </div>
                </div>
              ) : currentMessage === 'organization-not-found' ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-red-800 mb-2">Organization Not Found</h4>
                      <p className="text-sm text-red-700 mb-4">Organization information not found. Please try again.</p>
                    </div>
                  </div>
                </div>
              ) : currentMessage === 'user-not-found' ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-red-800 mb-2">User Not Found</h4>
                      <p className="text-sm text-red-700 mb-4">User information not found. Please try again.</p>
                    </div>
                  </div>
                </div>
              ) : currentMessage === 'error' ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-red-800 mb-2">Error</h4>
                      <p className="text-sm text-red-700 mb-4">An error occurred while checking permissions. Please try again.</p>
                    </div>
                  </div>
                </div>
              ) : !hasOrganizations() ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-amber-800 mb-2">Organization Required</h4>
                      <p className="text-sm text-amber-700 mb-4">Either create an organization or ask the admin of your company to invite you to an existing organization.</p>
                      <button 
                        onClick={() => setIsCreateOrgModalOpen(true)}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Create Organization
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}



              <div className="text-center mb-8">
                <p className="text-gray-600 leading-relaxed">
                  {t.greeting} <span className="font-semibold text-gray-900">{userName || 'FIRST-NAME'}</span>. {t.description} <span className="font-semibold">{t.frameworkAgreement}</span>. {t.explanation}
                </p>
              </div>

              <div className="space-y-6">
                {/* Download Agreement */}
                <div className="text-center">
                  <button
                    onClick={downloadAgreement}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Download className="h-5 w-5" />
                    {t.downloadButton}
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    {t.downloadFilename}
                  </p>
                </div>

                {/* Upload Signed Agreement */}
                <div 
                  className="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center hover:border-[#7C3BEC] transition-colors duration-200"
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="agreement-upload"
                  />
                  <label htmlFor="agreement-upload" className="cursor-pointer">
                    <div className="text-gray-600">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold mb-2">{t.uploadTitle}</h3>
                      <p className="text-sm">{t.uploadDescription}</p>
                    </div>
                  </label>
                  
                  {uploadedFile && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-center gap-2 text-green-700">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">{uploadedFile.name}</span>
                      </div>
                    </div>
                  )}
                </div>

                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    onClick={handleSubmit}
                    disabled={!hasUploadedAgreement || status === 'loading' || !canSignAgreement() || currentMessage !== ''}
                    className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                      hasUploadedAgreement && status !== 'loading' && canSignAgreement() && currentMessage === ''
                        ? 'bg-[#FF6B47] hover:bg-[#E55A3C] text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 inline" />
                        {t.uploading}
                      </>
                    ) : (
                      t.confirmButton
                    )}
                  </button>
                  {!canSignAgreement() && currentContext && currentMessage === '' && (
                    <p className="text-sm text-gray-500 mt-2">
                      {currentContext.permissions?.role !== 'admin'
                        ? 'Member Access'
                        : ''
                      }
                    </p>
                  )}
                </div>
              </div>
              </>
            )}
        </div>
      </div>

      {/* Create Organization Modal */}
      <CreateOrganizationModal 
        isOpen={isCreateOrgModalOpen}
        onClose={() => setIsCreateOrgModalOpen(false)}
        onOrganizationCreated={handleOrganizationCreated}
      />
    </div>
  );
};

export default FrameworkAgreementModal; 