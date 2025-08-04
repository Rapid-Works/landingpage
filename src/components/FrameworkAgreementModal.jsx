import React, { useState } from 'react';
import { X, Download, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  uploadFrameworkDocument, 
  saveFrameworkAgreement 
} from '../utils/frameworkAgreementService';

const FrameworkAgreementModal = ({ isOpen, onClose, onAgreementSigned, userName = '' }) => {
  const { currentUser } = useAuth();
  const [hasUploadedAgreement, setHasUploadedAgreement] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setErrorMessage('');
    
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      setErrorMessage('Please upload a PDF file.');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setErrorMessage('File size must be less than 10MB.');
      return;
    }
    
    setUploadedFile(file);
    setHasUploadedAgreement(true);
  };

  const handleSubmit = async () => {
    if (!hasUploadedAgreement) {
      setErrorMessage('Please upload the signed Framework Agreement first.');
      return;
    }

    if (!currentUser) {
      setErrorMessage('You must be logged in to upload the agreement.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    
    try {
      console.log('Uploading framework agreement...');
      
      // Upload the document to Firebase Storage
      const documentUrl = await uploadFrameworkDocument(uploadedFile, currentUser.uid);
      console.log('Document uploaded, URL:', documentUrl);
      
      // Save the agreement status to Firestore
      await saveFrameworkAgreement(
        currentUser.uid, 
        currentUser.email, 
        documentUrl
      );
      console.log('Agreement status saved to Firestore');
      
      setStatus('success');
      
      // Call the callback to indicate agreement is signed
      setTimeout(() => {
        onAgreementSigned();
        onClose();
        setStatus('idle');
        setUploadedFile(null);
        setHasUploadedAgreement(false);
        setErrorMessage('');
      }, 1500);
      
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
          <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">Rapid Experts Framework Agreement</h2>
          
          {status === 'success' ? (
            <div className="text-center py-12">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Agreement Uploaded!</h3>
              <p className="text-gray-600 mb-2">
                Your signed Framework Agreement has been received.
              </p>
              <p className="text-sm text-gray-500">
                You can now request fixed price tasks from our experts.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <p className="text-gray-600 leading-relaxed">
                  Hello <span className="font-semibold text-[#7C3BEC]">{userName || 'FIRST-NAME'}</span>. It seems like you are trying to request a fixed 
                  price offer for the first time. In order to do so you first need to sign 
                  our <span className="font-semibold">Rapid Experts Framework Agreement</span>. All further Requests of 
                  Rapid Experts will from then on rely on the terms agreed upon in this 
                  Framework Agreement. Once signed you can then always request 
                  fixed price offers with no further barriers.
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
                    Download Framework Agreement PDF
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    Rapid Experts Framework Agreement.pdf
                  </p>
                </div>

                {/* Upload Signed Agreement */}
                <div className="border-2 border-gray-400 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="agreement-upload"
                  />
                  <label htmlFor="agreement-upload" className="cursor-pointer">
                    <div className="text-gray-600">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold mb-2">Upload signed Framework Agreement</h3>
                      <p className="text-sm">Click to select your signed PDF file</p>
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
                    disabled={!hasUploadedAgreement || status === 'loading'}
                    className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                      hasUploadedAgreement && status !== 'loading'
                        ? 'bg-[#FF6B47] hover:bg-[#E55A3C] text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 inline" />
                        Uploading...
                      </>
                    ) : (
                      'Confirm Agreement Upload'
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FrameworkAgreementModal; 