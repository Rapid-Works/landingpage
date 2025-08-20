import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, QrCode, Download, Copy } from 'lucide-react';

const QRCodeModal = ({ isOpen, onClose, link }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (isOpen && link) {
      // Generate QR code using a free QR code API
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link.trackingUrl)}`;
      setQrCodeUrl(qrApiUrl);
    }
  }, [isOpen, link]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(link.trackingUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const handleDownloadQR = () => {
    if (!qrCodeUrl) return;
    
    const link_element = document.createElement('a');
    link_element.href = qrCodeUrl;
    link_element.download = `${link.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qr_code.png`;
    document.body.appendChild(link_element);
    link_element.click();
    document.body.removeChild(link_element);
  };

  if (!isOpen || !link) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div 
        className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
              <QrCode className="h-6 w-6 text-purple-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                QR Code
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {link.name}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            {/* QR Code Display */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                {qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="w-64 h-64 object-contain"
                    onError={() => setQrCodeUrl('')}
                  />
                ) : (
                  <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Generating QR Code...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Link Display */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tracking URL
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-white px-3 py-2 rounded border text-gray-900">
                  {link.trackingUrl}
                </code>
                <button
                  onClick={handleCopyLink}
                  className="p-2 text-gray-400 hover:text-gray-600 border rounded"
                  title="Copy link"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              {copiedLink && (
                <p className="text-xs text-green-600 mt-1">Link copied to clipboard!</p>
              )}
            </div>

            {/* Description */}
            {link.description && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <p className="text-sm text-gray-900">{link.description}</p>
              </div>
            )}

            {/* Stats */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-semibold text-gray-900">{link.visits || 0}</p>
                  <p className="text-sm text-gray-600">Total Visits</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900">
                    {link.createdAt ? new Date(link.createdAt.toDate ? link.createdAt.toDate() : link.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">Created</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleDownloadQR}
                disabled={!qrCodeUrl}
                className="flex-1 bg-[#7C3BEC] hover:bg-[#6B32D6] text-white px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download QR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default QRCodeModal;
