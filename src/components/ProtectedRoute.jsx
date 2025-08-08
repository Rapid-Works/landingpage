import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(!currentUser);

  // If user is logged in, show the protected content
  if (currentUser) {
    return children;
  }

  // If user is not logged in, show login modal
  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign into your account</h2>
          <p className="text-gray-600 mb-6">Please sign in to access this page.</p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={(user) => {
          setShowLoginModal(false);
        }}
        context="protected-route"
      />
    </>
  );
};

export default ProtectedRoute; 