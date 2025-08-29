import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect based on authentication and email verification status
  useEffect(() => {
    if (!currentUser) {
      // No user logged in - redirect to homepage
      navigate('/', { replace: true });
    } else if (!currentUser.emailVerified) {
      // User logged in but email not verified - redirect to verification page
      navigate('/verify-email', { replace: true });
    }
  }, [currentUser, navigate]);

  // If user is logged in and email is verified, show the protected content
  if (currentUser && currentUser.emailVerified) {
    return children;
  }

  // If user is not logged in, show loading or redirect (handled by useEffect)
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3BEC] mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default ProtectedRoute; 