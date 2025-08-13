import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Package, Building2, User, Edit } from 'lucide-react';
import { getAllBrandingKits } from '../utils/brandingKitService';
import EditKitModal from './EditKitModal';

const ListedKitsModal = ({ isOpen, onClose, onCreateNew }) => {
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingKit, setEditingKit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);


  useEffect(() => {
    if (isOpen) {
      loadKits();
    }
  }, [isOpen]);

  const loadKits = async () => {
    setLoading(true);
    setError('');
    try {
      const allKits = await getAllBrandingKits();
      setKits(allKits);
    } catch (err) {
      console.error('Error loading branding kits:', err);
      setError('Failed to load branding kits');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleEditKit = (kit) => {
    setEditingKit(kit);
    setShowEditModal(true);
  };



  const handleEditSuccess = async () => {
    console.log('🔄 Edit success - refreshing kit list...');
    setShowEditModal(false);
    setEditingKit(null);
    await loadKits(); // Refresh the list
    console.log('✅ Kit list refreshed');
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#7C3BEC] rounded-md flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Branding Kit Management</h2>
              <p className="text-sm text-gray-500">Manage kit metadata and access permissions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onCreateNew}
              className="bg-[#7C3BEC] hover:bg-[#6B32D6] text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Kit
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600 mx-auto mb-4"></div>
                <p className="text-gray-500 text-sm">Loading branding kits...</p>
              </div>
            </div>
          ) : kits.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Branding Kits</h3>
              <p className="text-gray-500 mb-6 text-sm">Get started by adding your first branding kit metadata.</p>
              <button
                onClick={onCreateNew}
                className="bg-[#7C3BEC] hover:bg-[#6B32D6] text-white px-4 py-2 rounded-md flex items-center gap-2 mx-auto transition-colors text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                Add First Kit
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Kits</p>
                      <p className="text-2xl font-semibold text-gray-900 mt-1">{kits.length}</p>
                    </div>
                    <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                      <Package className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</p>
                      <p className="text-2xl font-semibold text-gray-900 mt-1">
                        {kits.filter(kit => kit.organizationName).length}
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Personal</p>
                      <p className="text-2xl font-semibold text-gray-900 mt-1">
                        {kits.filter(kit => !kit.organizationName).length}
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Kits Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kit Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Organization
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Access
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {kits.map((kit, index) => (
                        <tr key={kit.id} className={`${index !== kits.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                                <Package className="h-4 w-4 text-gray-500" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{kit.id}</div>
                                <div className="text-xs text-gray-500">Branding Kit</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {kit.organizationName || (
                                <span className="text-gray-400 italic">Personal</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {(() => {
                                // Handle both array and single email formats
                                const emailList = Array.isArray(kit.email) ? kit.email : 
                                                 Array.isArray(kit.emails) ? kit.emails :
                                                 kit.email ? [kit.email] :
                                                 kit.emails ? [kit.emails] : [];
                                
                                if (emailList.length > 0) {
                                  return (
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">{emailList.length} user{emailList.length !== 1 ? 's' : ''}</div>
                                      <div className="text-xs text-gray-500 max-w-xs truncate">
                                        {emailList.slice(0, 2).join(', ')}{emailList.length > 2 ? `, +${emailList.length - 2} more` : ''}
                                      </div>
                                    </div>
                                  );
                                } else {
                                  return <span className="text-gray-400 text-sm">No users assigned</span>;
                                }
                              })()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${
                                kit.paid 
                                  ? 'bg-green-50 text-green-700 border border-green-200' 
                                  : 'bg-gray-50 text-gray-700 border border-gray-200'
                              }`}>
                                {kit.paid ? 'Paid' : 'Unpaid'}
                              </span>
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${
                                kit.ready 
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                                  : 'bg-gray-50 text-gray-700 border border-gray-200'
                              }`}>
                                {kit.ready ? 'Ready' : 'Draft'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button 
                                onClick={() => handleEditKit(kit)}
                                className="text-gray-400 hover:text-[#7C3BEC] transition-colors p-2 rounded-md hover:bg-purple-50"
                                title="Edit Kit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Kit Modal */}
      {showEditModal && (
        <EditKitModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingKit(null);
          }}
          onSuccess={handleEditSuccess}
          kit={editingKit}
        />
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ListedKitsModal;
