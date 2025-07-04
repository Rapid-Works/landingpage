import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { User, Settings } from 'lucide-react';
import RapidWorksHeader from './new_landing_page_header';

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <RapidWorksHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {currentUser?.displayName || currentUser?.email}!
            </h2>
            <p className="text-gray-600">
              You're successfully logged in to your account
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Account Status</p>
                  <p className="text-2xl font-bold">Active</p>
                </div>
                <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Email Verified</p>
                  <p className="text-2xl font-bold">
                    {currentUser?.emailVerified ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center">
                  <Settings className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Member Since</p>
                  <p className="text-2xl font-bold">
                    {currentUser?.metadata?.creationTime ? 
                      new Date(currentUser.metadata.creationTime).toLocaleDateString() : 
                      'Today'
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-400 rounded-lg flex items-center justify-center">
                  <Settings className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{currentUser?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Display Name:</span>
                <span className="font-medium">{currentUser?.displayName || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Provider:</span>
                <span className="font-medium">
                  {currentUser?.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 'Email'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 