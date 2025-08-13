import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Calendar, 
  Shield, 
  Settings,
  Trash2,
  Check,
  Loader2,
  Crown,
  User
} from 'lucide-react';
import { 
  getOrganizationMembers, 
  updateMemberPermissions, 
  removeMember
} from '../utils/organizationService';
import InviteUserModal from './InviteUserModal';

const OrganizationUsers = ({ organization, currentUserPermissions }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  const isAdmin = currentUserPermissions?.role === 'admin' || currentUserPermissions?.permissions?.canManageMembers;

  const loadMembers = useCallback(async () => {
    setLoading(true);
    try {
      const orgMembers = await getOrganizationMembers(organization.id);
      setMembers(orgMembers);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  }, [organization.id]);

  useEffect(() => {
    if (organization) {
      loadMembers();
    }
  }, [organization, loadMembers]);

  const handleUpdatePermissions = async (permissions) => {
    if (!selectedMember) return;

    try {
      await updateMemberPermissions(selectedMember.id, permissions);
      await loadMembers(); // Reload to get updated data
      setShowPermissionsModal(false);
      setSelectedMember(null);
    } catch (error) {
      console.error('Error updating permissions:', error);
      alert('Failed to update permissions. Please try again.');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member from the organization?')) {
      return;
    }

    try {
      await removeMember(memberId);
      await loadMembers(); // Reload to get updated data
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member. Please try again.');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#7C3BEC]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-[#7C3BEC]" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Organization Members</h2>
            <p className="text-sm text-gray-600">
              {members.length === 0 
                ? 'No members yet - invite your first team member!'
                : `${members.length} member${members.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
        </div>
        
        {isAdmin && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-[#7C3BEC] hover:bg-[#6B32D6] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Invite Member
          </button>
        )}
      </div>



      {/* Members Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Users className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
                      <p className="text-gray-600 mb-4 max-w-sm">
                        Start building your team by inviting members to collaborate on branding kits and expert requests.
                      </p>
                      {isAdmin && (
                        <button
                          onClick={() => setShowInviteModal(true)}
                          className="bg-[#7C3BEC] hover:bg-[#6B32D6] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                          <UserPlus className="h-4 w-4" />
                          Invite Your First Member
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        member.type === 'invitation' 
                          ? 'bg-orange-500' 
                          : 'bg-[#7C3BEC]'
                      }`}>
                        {member.type === 'invitation' ? (
                          <Mail className="h-5 w-5 text-white" />
                        ) : member.role === 'admin' ? (
                          <Crown className="h-5 w-5 text-white" />
                        ) : (
                          <User className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {member.userName}
                          {member.type === 'invitation' && (
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                              Invited
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {member.userEmail}
                          {member.type === 'invitation' && (
                            <span className="text-xs text-gray-400 ml-2">
                              by {member.inviterName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.type === 'invitation' 
                        ? 'bg-orange-100 text-orange-800'
                        : member.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.type === 'invitation' 
                        ? 'Pending Invitation'
                        : member.role === 'admin' ? 'Administrator' : 'Member'
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 space-y-1">
                      {member.permissions?.canRequestExperts && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Check className="h-3 w-3" />
                          <span className="text-xs">Can Request Experts</span>
                        </div>
                      )}
                      {member.permissions?.canSeeAllRequests && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <Check className="h-3 w-3" />
                          <span className="text-xs">Can See All Requests</span>
                        </div>
                      )}
                      {member.role === 'admin' && (
                        <div className="flex items-center gap-1 text-purple-600">
                          <Shield className="h-3 w-3" />
                          <span className="text-xs">Full Admin Access</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(member.joinedAt)}
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.type === 'invitation' ? (
                        <span className="text-xs text-gray-400">Invitation sent</span>
                      ) : member.role !== 'admin' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedMember(member);
                              setShowPermissionsModal(true);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                            title="Edit permissions"
                          >
                            <Settings className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-gray-400 hover:text-red-600"
                            title="Remove member"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Modal */}
      {showPermissionsModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Edit Permissions for {selectedMember.userName}
              </h3>
              
              <div className="space-y-3 mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={selectedMember.permissions?.canRequestExperts}
                    className="rounded border-gray-300 text-[#7C3BEC] focus:ring-[#7C3BEC]"
                    onChange={(e) => {
                      setSelectedMember(prev => ({
                        ...prev,
                        permissions: {
                          ...prev.permissions,
                          canRequestExperts: e.target.checked
                        }
                      }));
                    }}
                  />
                  <span className="ml-2 text-sm text-gray-700">Can Request Experts</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={selectedMember.permissions?.canSeeAllRequests}
                    className="rounded border-gray-300 text-[#7C3BEC] focus:ring-[#7C3BEC]"
                    onChange={(e) => {
                      setSelectedMember(prev => ({
                        ...prev,
                        permissions: {
                          ...prev.permissions,
                          canSeeAllRequests: e.target.checked
                        }
                      }));
                    }}
                  />
                  <span className="ml-2 text-sm text-gray-700">Can See All Requests</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPermissionsModal(false);
                    setSelectedMember(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdatePermissions(selectedMember.permissions)}
                  className="flex-1 bg-[#7C3BEC] hover:bg-[#6B32D6] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Update Permissions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      <InviteUserModal
        isOpen={showInviteModal}
        onClose={() => {
          setShowInviteModal(false);
          loadMembers(); // Refresh the members list when modal closes
        }}
        organization={organization}
        onInviteCreated={null}
      />
    </div>
  );
};

export default OrganizationUsers;
