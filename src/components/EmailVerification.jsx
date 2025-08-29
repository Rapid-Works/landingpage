import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';

const EmailVerification = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const { currentUser, sendVerificationEmail, logout } = useAuth();
  const navigate = useNavigate();

  // Check if user is already verified
  useEffect(() => {
    if (currentUser?.emailVerified) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  // Send verification email automatically on component mount
  useEffect(() => {
    if (currentUser && !currentUser.emailVerified && !verificationSent) {
      handleSendVerification();
    }
  }, [currentUser]);

  const handleSendVerification = async () => {
    if (!currentUser) {
      setError('No user found. Please sign up again.');
      return;
    }

    try {
      setError('');
      setMessage('');
      setLoading(true);
      
      await sendVerificationEmail(currentUser);
      setVerificationSent(true);
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      setError('Failed to send verification email. Please try again.');
      console.error('Email verification error:', error);
    }
    setLoading(false);
  };

  const handleCheckVerification = async () => {
    if (!currentUser) return;

    try {
      // Reload user to get fresh verification status
      await currentUser.reload();
      
      if (currentUser.emailVerified) {
        setMessage('Email verified successfully! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError('Email not yet verified. Please check your email and click the verification link.');
      }
    } catch (error) {
      setError('Error checking verification status. Please try again.');
      console.error('Check verification error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <p className="text-gray-600 mb-4">No user session found.</p>
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Please sign up again
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We've sent a verification link to{' '}
            <span className="font-semibold text-gray-900">{currentUser.email}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {message}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleCheckVerification}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            I've Verified My Email
          </button>

          <button
            onClick={handleSendVerification}
            disabled={loading}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Resend Verification Email
              </>
            )}
          </button>
        </div>

        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-gray-600">
            Didn't receive the email? Check your spam folder or try resending.
          </p>
          
          <div className="flex items-center justify-center space-x-4 text-sm">
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 underline"
            >
              Sign out
            </button>
            <span className="text-gray-300">•</span>
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-700 underline inline-flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Having trouble? Contact support at{' '}
            <a href="mailto:support@rapid-works.io" className="text-blue-600 hover:text-blue-700">
              support@rapid-works.io
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerification;
