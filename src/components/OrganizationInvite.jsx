import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, User, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getInvitationByToken, acceptInvitation } from '../utils/organizationService';
import RapidWorksHeader from './new_landing_page_header';
import LoginModal from './LoginModal';

const OrganizationInvite = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (token) {
      loadInvitation();
    }
  }, [token]);

  const loadInvitation = async () => {
    setLoading(true);
    setError('');
    
    try {
      const invitationData = await getInvitationByToken(token);
      
      if (!invitationData) {
        setError('This invitation is invalid or has expired.');
        return;
      }
      
      setInvitation(invitationData);
    } catch (error) {
      console.error('Error loading invitation:', error);
      setError('Failed to load invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    setAccepting(true);
    setError('');

    try {
      const organization = await acceptInvitation(token, currentUser.uid, currentUser.email);
      setSuccess(true);
      
      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error accepting invitation:', error);
      setError(error.message || 'Failed to accept invitation. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  const handleLoginSuccess = (user) => {
    setShowLoginModal(false);
    // The user will now be logged in, so we can proceed with acceptance
    setTimeout(() => {
      handleAcceptInvitation();
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <RapidWorksHeader />
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#7C3BEC] mx-auto mb-4" />
            <p className="text-gray-600">Loading invitation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <RapidWorksHeader />
        <div className="flex items-center justify-center py-24">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Invitation</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => navigate('/')}
                className="bg-[#7C3BEC] hover:bg-[#6B32D6] text-white px-6 py-3 rounded-lg transition-colors"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <RapidWorksHeader />
        <div className="flex items-center justify-center py-24">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to the Team!</h1>
              <p className="text-gray-600 mb-6">
                You have successfully joined <strong>{invitation.organization.name}</strong>.
                Redirecting to your dashboard...
              </p>
              <div className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-[#7C3BEC]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RapidWorksHeader />
      
      <div className="flex items-center justify-center py-24">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#7C3BEC] to-[#9F7AEA] p-8 text-white text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Organization Invitation</h1>
              <p className="text-purple-100">You've been invited to join an organization</p>
            </div>

            {/* Content */}
            <div className="p-8">
              {invitation && (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-gray-700 mb-4">
                      <strong>{invitation.inviterName}</strong> has invited you to join
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {invitation.organization.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {invitation.organization.street}, {invitation.organization.city}
                      </p>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Your permissions will include:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Organization member access</span>
                      </div>
                      {invitation.permissions?.canRequestExperts && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-700">Can request expert services</span>
                        </div>
                      )}
                      {invitation.permissions?.canSeeAllRequests && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-700">Can view all organization requests</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {/* Email Verification Notice */}
                  {currentUser && currentUser.email !== invitation.inviteeEmail && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
                      <p className="font-medium">Email mismatch</p>
                      <p>This invitation was sent to <strong>{invitation.inviteeEmail}</strong>, but you're logged in as <strong>{currentUser.email}</strong>.</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {!currentUser ? (
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-4">
                          You need to be logged in to accept this invitation
                        </p>
                        <button
                          onClick={() => setShowLoginModal(true)}
                          className="w-full bg-[#7C3BEC] hover:bg-[#6B32D6] text-white px-6 py-3 rounded-lg transition-colors"
                        >
                          Login to Accept Invitation
                        </button>
                      </div>
                    ) : currentUser.email === invitation.inviteeEmail ? (
                      <button
                        onClick={handleAcceptInvitation}
                        disabled={accepting}
                        className="w-full bg-[#7C3BEC] hover:bg-[#6B32D6] text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {accepting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Accepting Invitation...
                          </>
                        ) : (
                          'Accept Invitation'
                        )}
                      </button>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm text-red-600 mb-4">
                          Please log in with the correct email address ({invitation.inviteeEmail}) to accept this invitation.
                        </p>
                        <button
                          onClick={() => setShowLoginModal(true)}
                          className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                          Login with Different Account
                        </button>
                      </div>
                    )}
                    
                    <button
                      onClick={() => navigate('/')}
                      className="w-full text-gray-600 hover:text-gray-800 px-6 py-3 transition-colors"
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
        context="organization_invite"
      />
    </div>
  );
};

export default OrganizationInvite;
