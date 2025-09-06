import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DollarSign, Calendar, ExternalLink, AlertCircle, FileCheck, Plus } from 'lucide-react';
import { getFinancingApplications } from '../utils/financingService';
import AddFinancingModal from './AddFinancingModal';

const RapidFinancing = () => {
  const { currentUser } = useAuth();
  const [financingApplications, setFinancingApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFinancingApplications();
  }, [currentUser]);

  const loadFinancingApplications = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const applications = await getFinancingApplications(currentUser.uid);
      setFinancingApplications(applications);
    } catch (err) {
      console.error('Error loading financing applications:', err);
      setError('Failed to load financing applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalSuccess = () => {
    loadFinancingApplications(); // Refresh the list after adding new application
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3BEC]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rapid Financing</h2>
          <p className="text-gray-600 mt-1">Your subsidy and financing application history</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-[#7C3BEC] text-white text-sm font-medium rounded-md hover:bg-[#6B2DBD] focus:outline-none focus:ring-2 focus:ring-[#7C3BEC] transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Application
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subsidy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application Link
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {financingApplications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No financing applications found</h3>
                    <p className="text-gray-600">You haven't submitted any financing or subsidy applications yet.</p>
                  </td>
                </tr>
              ) : (
                financingApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{application.subsidy}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">{application.amount}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{formatDate(application.applicationDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <FileCheck className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-900">{application.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {application.applicationLink ? (
                        <a
                          href={application.applicationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-[#7C3BEC] hover:text-[#6B2DBD] font-medium"
                        >
                          View Application
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">No link</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddFinancingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default RapidFinancing;
