import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Calendar, 
  Shield, 
  Settings,
  Trash2,
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

  // Calculate statistics
  const activeMembers = members.filter(m => m.type === 'member').length;
  const pendingInvitations = members.filter(m => m.type === 'invitation').length;
  const adminCount = members.filter(m => m.role === 'admin').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Team Members</h1>
          <p className="text-gray-600 mt-1">Manage your organization's team members and permissions</p>
        </div>
        
        {isAdmin && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-[#7C3BEC] hover:bg-[#6B32D6] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <UserPlus className="h-4 w-4" />
            Invite Member
          </button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-semibold text-gray-900">{activeMembers}</p>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Invites</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingInvitations}</p>
            </div>
            <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Mail className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Administrators</p>
              <p className="text-2xl font-semibold text-gray-900">{adminCount}</p>
            </div>
            <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Crown className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>



      {/* Members Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Team Directory</h3>
          <p className="text-sm text-gray-500 mt-1">A complete list of all team members and their access levels</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Access Level
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
                  <td colSpan={isAdmin ? 5 : 4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
                      <p className="text-gray-500 mb-6 max-w-sm">
                        Get started by inviting team members to collaborate and manage your organization together.
                      </p>
                      {isAdmin && (
                        <button
                          onClick={() => setShowInviteModal(true)}
                          className="bg-[#7C3BEC] hover:bg-[#6B32D6] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
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
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        member.type === 'invitation' 
                          ? 'bg-orange-100' 
                          : member.role === 'admin'
                          ? 'bg-purple-100'
                          : 'bg-gray-100'
                      }`}>
                        {member.type === 'invitation' ? (
                          <Mail className="h-5 w-5 text-orange-600" />
                        ) : member.role === 'admin' ? (
                          <Crown className="h-5 w-5 text-purple-600" />
                        ) : (
                          <User className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.userEmail}
                          {member.type === 'invitation' && (
                            <span className="text-xs text-gray-400 ml-2">
                              • Invited by {member.inviterName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.type === 'invitation' 
                        ? 'bg-orange-100 text-orange-800'
                        : member.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {member.type === 'invitation' 
                        ? 'Pending'
                        : member.role === 'admin' ? 'Admin' : 'Active'
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {member.role === 'admin' ? (
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-purple-500" />
                          <span className="text-sm font-medium text-gray-900">Full Access</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {member.permissions?.canRequestExperts && (
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">Request Experts</span>
                            </div>
                          )}
                          {member.permissions?.canSeeAllRequests && (
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">View All Requests</span>
                            </div>
                          )}
                          {!member.permissions?.canRequestExperts && !member.permissions?.canSeeAllRequests && member.type !== 'invitation' && (
                            <span className="text-sm text-gray-500">Basic Access</span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {formatDate(member.joinedAt)}
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4">
                      {member.type === 'invitation' ? (
                        <span className="text-sm text-gray-400">Invitation sent</span>
                      ) : member.role !== 'admin' && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedMember(member);
                              setShowPermissionsModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit permissions"
                          >
                            <Settings className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Access Permissions
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Update permissions for {selectedMember.userName}
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Request Experts</div>
                    <div className="text-sm text-gray-500">Allow creating new expert requests</div>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={selectedMember.permissions?.canRequestExperts}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
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
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">View All Requests</div>
                    <div className="text-sm text-gray-500">See all organization requests, not just their own</div>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={selectedMember.permissions?.canSeeAllRequests}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
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
                </div>
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
                  className="flex-1 bg-[#7C3BEC] hover:bg-[#6B32D6] text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  Save Changes
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
