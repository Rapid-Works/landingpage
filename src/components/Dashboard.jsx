import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Edit, Package, MessageSquare, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import RapidWorksHeader from './new_landing_page_header';
import BrandingKits from './BrandingKits';
import UserAvatar from './UserAvatar';
import ProfileEditModal from './ProfileEditModal';
import TaskList from './TaskList';
import { isExpert, getExpertByEmail, isAdmin } from '../utils/expertService';



const accent = "#7C3BEC";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { kitId } = useParams();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('branding');
  
  // Check if current user is an expert or admin
  const userIsExpert = currentUser ? isExpert(currentUser.email) : false;
  const userIsAdmin = currentUser ? isAdmin(currentUser.email) : false;
  const expertInfo = userIsExpert ? getExpertByEmail(currentUser.email) : null;



  return (
    <div className="min-h-screen bg-gray-100">
      <RapidWorksHeader />

      {/* Sidebar Dashboard Layout - Full width like Slack/Gmail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white shadow-sm overflow-hidden h-[calc(100vh-5rem)] mt-20"
      >
          <div className="flex h-full">
            {/* Left Sidebar */}
            <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0">
              {/* Sidebar Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  {/* Profile Avatar */}
                  <div className="relative group">
                    <div className="w-10 h-10 bg-[#7C3BEC] rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                      {currentUser?.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt={currentUser.displayName || 'User'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-bold text-white text-sm">
                          {currentUser?.displayName 
                            ? currentUser.displayName.split(' ').length > 1
                              ? `${currentUser.displayName.split(' ')[0][0]}${currentUser.displayName.split(' ')[currentUser.displayName.split(' ').length - 1][0]}`.toUpperCase()
                              : currentUser.displayName.substring(0, 2).toUpperCase()
                            : 'NN'
                          }
                        </span>
                      )}
                    </div>
                    
                    {/* Edit Button Overlay */}
                    <button
                      onClick={() => setIsProfileModalOpen(true)}
                      className="absolute -bottom-1 -right-1 bg-[#7C3BEC] hover:bg-[#6B32D6] text-white p-1 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 opacity-0 group-hover:opacity-100"
                      title="Edit Profile"
                    >
                      <Edit className="h-2.5 w-2.5" />
                    </button>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      Welcome back, {currentUser?.displayName?.split(' ')[0] || currentUser?.email?.split('@')[0]}
                    </h3>
                    <p className="text-xs text-gray-600">
                      Dashboard
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 p-4 space-y-2">
                <button
                  onClick={() => setActiveTab('branding')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === 'branding'
                      ? 'bg-[#7C3BEC] text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <Package className="h-5 w-5" />
                  <div className="flex-1">
                    <div className="font-medium">Branding Kits</div>
                    <div className={`text-xs ${activeTab === 'branding' ? 'text-purple-100' : 'text-gray-500'}`}>
                      Create and manage your brand assets
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === 'tasks'
                      ? 'bg-[#7C3BEC] text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <MessageSquare className="h-5 w-5" />
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-2">
                      {userIsExpert ? (userIsAdmin ? 'All Tasks' : 'Expert Tasks') : 'My Requests'}
                      {userIsExpert && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          activeTab === 'tasks' 
                            ? 'bg-white/20 text-white' 
                            : 'bg-[#7C3BEC] text-white'
                        }`}>
                          {userIsAdmin ? 'Admin' : 'Expert'}
                        </span>
                      )}
                    </div>
                    <div className={`text-xs ${activeTab === 'tasks' ? 'text-purple-100' : 'text-gray-500'}`}>
                      {userIsExpert 
                        ? (userIsAdmin 
                          ? 'Manage all expert tasks and team communications' 
                          : 'Manage assigned tasks and communicate with clients')
                        : 'Track requests and chat with experts'}
                    </div>
                  </div>
                </button>

              </nav>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 flex flex-col">
              {/* Content Header */}
              <div className="px-8 py-6 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {activeTab === 'branding' ? 'Branding Kits' : userIsExpert ? (userIsAdmin ? 'All Tasks' : 'Expert Tasks') : 'My Requests'}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {activeTab === 'branding' 
                        ? 'Design and customize your brand identity'
                        : userIsExpert
                          ? (userIsAdmin 
                            ? 'Manage all expert tasks and team communications' 
                            : 'Manage your assigned tasks and client communications')
                          : 'Track your task requests and communicate with experts'
                      }
                    </p>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-3">
                    {activeTab === 'tasks' && userIsExpert && (
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {userIsAdmin ? 'Admin Mode' : 'Expert Mode'}
                        </div>
                        <div className="text-xs text-gray-500">{expertInfo?.role}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
                {activeTab === 'branding' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200"
                  >
                    <BrandingKits initialKitId={kitId} />
                  </motion.div>
                )}

                {activeTab === 'tasks' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                  >
                    <TaskList 
                      userRole={userIsExpert ? 'expert' : 'customer'}
                      expertInfo={expertInfo}
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Edit Modal */}
        <ProfileEditModal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
        />

      </div>
    );
  };

  export default Dashboard; 