import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, UserPlus, Mail, Copy, Check, Loader2 } from 'lucide-react';
import { createInvitation } from '../utils/organizationService';
import { useAuth } from '../contexts/AuthContext';

const InviteUserModal = ({ isOpen, onClose, organization, onInviteCreated }) => {
  const { currentUser } = useAuth();
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePermissions, setInvitePermissions] = useState({
    canRequestExperts: false,
    canSeeAllRequests: false
  });
  const [inviting, setInviting] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInviting(true);
    setError('');

    try {
      const invitation = await createInvitation(
        organization.id,
        currentUser.uid,
        inviteEmail.trim(),
        invitePermissions,
        {
          name: currentUser.displayName || currentUser.email,
          email: currentUser.email
        }
      );

      setInviteLink(invitation.invitationLink);
      setInviteEmail('');
      setInvitePermissions({
        canRequestExperts: false,
        canSeeAllRequests: false
      });

      // Don't call parent callback to avoid re-renders that might close modal
    } catch (error) {
      console.error('Error creating invitation:', error);
      setError('Failed to create invitation. Please try again.');
    } finally {
      setInviting(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleClose = () => {
    setInviteLink('');
    setInviteEmail('');
    setInvitePermissions({
      canRequestExperts: false,
      canSeeAllRequests: false
    });
    setError('');
    setCopiedLink(false);
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4" style={{ backdropFilter: 'blur(8px)' }}>
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#7C3BEC] rounded-lg flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Invite Member</h2>
              <p className="text-sm text-gray-600">Add a new member to {organization.name}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={inviting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {inviteLink ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium mb-2">Invitation Created!</p>
                <p className="text-green-700 text-sm mb-3">Share this link with the person you want to invite:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-green-300 rounded text-sm font-mono"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center gap-1 transition-colors"
                  >
                    {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedLink ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-[#7C3BEC] hover:bg-[#6B32D6] text-white rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="inviteEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    id="inviteEmail"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-[#7C3BEC] outline-none transition-colors"
                    required
                    disabled={inviting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Permissions
                </label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={invitePermissions.canRequestExperts}
                      onChange={(e) => setInvitePermissions(prev => ({
                        ...prev,
                        canRequestExperts: e.target.checked
                      }))}
                      className="mt-1 rounded border-gray-300 text-[#7C3BEC] focus:ring-[#7C3BEC]"
                      disabled={inviting}
                    />
                    <div>
                      <span className="text-sm text-gray-700 font-medium">Can Request Experts</span>
                      <p className="text-xs text-gray-500 mt-1">Allow this member to create new expert requests</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={invitePermissions.canSeeAllRequests}
                      onChange={(e) => setInvitePermissions(prev => ({
                        ...prev,
                        canSeeAllRequests: e.target.checked
                      }))}
                      className="mt-1 rounded border-gray-300 text-[#7C3BEC] focus:ring-[#7C3BEC]"
                      disabled={inviting}
                    />
                    <div>
                      <span className="text-sm text-gray-700 font-medium">Can See All Requests</span>
                      <p className="text-xs text-gray-500 mt-1">Allow this member to view all organization requests (like an admin)</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={inviting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting || !inviteEmail.trim()}
                  className="flex-1 bg-[#7C3BEC] hover:bg-[#6B32D6] text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {inviting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Generate Invitation Link'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default InviteUserModal;
