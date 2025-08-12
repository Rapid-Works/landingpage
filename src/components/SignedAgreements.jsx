import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  CheckCircle, 
  Loader2, 
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAllSignedAgreements } from '../utils/frameworkAgreementService';

const SignedAgreements = () => {
  const { currentUser } = useAuth();
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Helper function to format dates in a readable format
  // readable date helper was unused; removed

  useEffect(() => {
    const loadAgreements = async () => {
      setLoading(true);
      setError('');

      try {
        console.log('Loading all signed agreements from Firebase...');
        const allAgreements = await getAllSignedAgreements();
        console.log('Loaded agreements:', allAgreements.length);
        
        // Transform the data to match our UI structure
        const transformedAgreements = allAgreements.map(agreement => ({
          id: agreement.id,
          type: 'Framework Agreement',
          status: 'signed',
          signedAt: agreement.signedAt,
          documentUrl: agreement.documentUrl,
          version: agreement.version || 'v1.0',
          userName: agreement.userEmail, // Use email as fallback if no display name
          userEmail: agreement.userEmail,
          userId: agreement.userId
        }));
        
        setAgreements(transformedAgreements);
      } catch (err) {
        console.error('Error loading agreements:', err);
        setError('Failed to load agreements');
      } finally {
        setLoading(false);
      }
    };

    loadAgreements();
  }, []);

  // Download removed per requirements

  const handleView = (documentUrl) => {
    if (documentUrl && documentUrl !== '#') {
      // Open in new tab for viewing
      window.open(documentUrl, '_blank');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#7C3BEC] mx-auto mb-4" />
          <p className="text-gray-600">Loading signed agreements...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Agreements</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#7C3BEC] hover:bg-[#6B32D6] text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // No agreements state
  if (!loading && agreements.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-6" />
        <h3 className="text-xl font-semibold text-gray-900 mb-3">No Signed Agreements</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          No clients have signed framework agreements yet. Signed agreements will appear here once clients complete the framework agreement process.
        </p>
        <div className="bg-blue-50 rounded-lg p-4 max-w-lg mx-auto">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-medium text-blue-900 mb-1">About Framework Agreements</p>
              <p className="text-sm text-blue-700">
                Framework Agreements establish the terms for clients requesting fixed-price tasks from experts. 
                Once signed, clients can request multiple tasks without additional paperwork.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Client Signed Agreements</h2>
          <p className="text-gray-600 mt-1">View and manage all client signed contracts and agreements</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Total agreements</div>
          <div className="text-2xl font-bold text-[#7C3BEC]">{agreements.length}</div>
        </div>
      </div>

      {/* Agreement List - Clean Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Signed Date
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {agreements.map((agreement, index) => (
              <motion.tr
                key={agreement.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{agreement.userName}</div>
                    <div className="text-xs text-gray-500">{agreement.userEmail}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(agreement.signedAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit', 
                      year: 'numeric'
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => handleView(agreement.documentUrl)}
                      className="text-[#7C3BEC] hover:text-[#6B32D6] transition-colors"
                    >
                      View
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default SignedAgreements;