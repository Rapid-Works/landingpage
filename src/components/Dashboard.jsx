import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Edit, Package, MessageSquare, FileText, Calculator, ChevronDown, ChevronRight, BellRing } from 'lucide-react';
import { useParams } from 'react-router-dom';
import RapidWorksHeader from './new_landing_page_header';
import BrandingKits from './BrandingKits';
import ProfileEditModal from './ProfileEditModal';
import NotificationSettingsModal from './NotificationSettingsModal';
import TaskList from './TaskList';
import SignedAgreements from './SignedAgreements';
import Invoicing from './Invoicing';
import { isExpert, getExpertByEmail, isAdmin, getAllExperts } from '../utils/expertService';
// notification helpers handled inside NotificationSettingsModal



// const accent = "#7C3BEC";

const Dashboard = () => {
  const { currentUser } = useAuth();
  // const navigate = useNavigate();
  const { kitId } = useParams();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  // Open Notification Settings if history link set the flag
  const initialOpenNotif = typeof window !== 'undefined' && localStorage.getItem('openNotificationSettings') === '1';
  const [activeTab, setActiveTab] = useState('branding');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [expertTasksExpanded, setExpertTasksExpanded] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [unreadTotal, setUnreadTotal] = useState(0);
  // moved to Notification Settings modal
  const [isNotifSettingsOpen, setIsNotifSettingsOpen] = useState(initialOpenNotif);

  if (initialOpenNotif) {
    try { localStorage.removeItem('openNotificationSettings'); } catch (e) {}
  }
  
  // Check if current user is an expert or admin
  const userIsExpert = currentUser ? isExpert(currentUser.email) : false;
  const userIsAdmin = currentUser ? isAdmin(currentUser.email) : false;
  const expertInfo = userIsExpert ? getExpertByEmail(currentUser.email) : null;
  
  // Check if user can access signed agreements (rapid-works.io emails or experts)
  const canAccessSignedAgreements = currentUser && (
    currentUser.email?.endsWith('@rapid-works.io') || 
    userIsExpert || 
    userIsAdmin
  );
  
  // Check if user can access invoicing (rapid-works.io emails only)
  const canAccessInvoicing = currentUser && currentUser.email?.endsWith('@rapid-works.io');

  // Handle navigation from invoicing to task chat
  const handleNavigateToTask = (taskId) => {
    setSelectedTaskId(taskId);
    setActiveTab('tasks');
  };

  // moved enable/test notifications into Notification Settings modal



  return (
    <div className="h-screen bg-gray-100 overflow-hidden flex flex-col">
      <RapidWorksHeader />

      {/* Sidebar Dashboard Layout - Full width like Slack/Gmail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white overflow-hidden h-[calc(100vh-3rem)] mt-12"
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
                      {currentUser?.displayName?.split(' ')[0] || currentUser?.email?.split('@')[0]}
                    </h3>
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
                  </div>
                </button>
                
                {/* Tasks - Expandable for rapid-works.io users */}
                 {userIsExpert && currentUser?.email?.endsWith('@rapid-works.io') ? (
                  <>
                    <button
                      onClick={() => {
                        setExpertTasksExpanded(!expertTasksExpanded);
                        if (!expertTasksExpanded) {
                          setActiveTab('tasks');
                          setSelectedExpert(null);
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === 'tasks' && !selectedExpert
                          ? 'bg-[#7C3BEC] text-white shadow-lg'
                          : 'text-gray-700 hover:bg-white hover:shadow-md'
                      }`}
                    >
                      {expertTasksExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <MessageSquare className="h-5 w-5" />
                      <div className="flex-1">
                        <div className="font-medium">Expert Tasks</div>
                      </div>
                      {unreadTotal > 0 && (
                        <span className="ml-auto inline-flex items-center justify-center text-[10px] font-semibold bg-red-500 text-white rounded-full h-5 px-2">
                          {unreadTotal}
                        </span>
                      )}
                    </button>
                    
                    {/* Expert Sub-items */}
                    {expertTasksExpanded && (
                      <div className="ml-4 mt-2 space-y-1">
                        {/* All Tasks Option */}
                        <button
                          onClick={() => {
                            setActiveTab('tasks');
                            setSelectedExpert(null);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-all duration-200 text-sm ${
                            activeTab === 'tasks' && !selectedExpert
                              ? 'bg-[#7C3BEC] text-white shadow-lg'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                            <MessageSquare className="h-3 w-3 text-white" />
                          </div>
                          <span>All Tasks</span>
                        </button>
                        
                        {/* Individual Experts */}
                        {getAllExperts().map((expert) => (
                          <button
                            key={expert.email}
                            onClick={() => {
                              setActiveTab('tasks');
                              setSelectedExpert(expert);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-all duration-200 text-sm ${
                              activeTab === 'tasks' && selectedExpert?.email === expert.email
                                ? 'bg-[#7C3BEC] text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <div className="w-6 h-6 bg-gradient-to-br from-[#7C3BEC] to-[#9F7AEA] rounded-full flex items-center justify-center overflow-hidden">
                              {expert.avatar ? (
                                <img
                                  src={expert.avatar}
                                  alt={expert.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-white font-semibold text-xs">
                                  {expert.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </span>
                              )}
                            </div>
                            <span>{expert.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
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
                      <div className="font-medium">
                        {userIsExpert ? 'Expert Tasks' : 'My Requests'}
                      </div>
                    </div>
                    {userIsExpert && unreadTotal > 0 && (
                      <span className="ml-auto inline-flex items-center justify-center text-[10px] font-semibold bg-red-500 text-white rounded-full h-5 px-2">
                        {unreadTotal}
                      </span>
                    )}
                  </button>
                )}

                {canAccessSignedAgreements && (
                  <button
                    onClick={() => setActiveTab('agreements')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === 'agreements'
                        ? 'bg-[#7C3BEC] text-white shadow-lg'
                        : 'text-gray-700 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <FileText className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="font-medium">Agreements</div>
                    </div>
                  </button>
                )}

                {canAccessInvoicing && (
                  <button
                    onClick={() => setActiveTab('invoicing')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === 'invoicing'
                        ? 'bg-[#7C3BEC] text-white shadow-lg'
                        : 'text-gray-700 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <Calculator className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="font-medium">Invoicing</div>
                    </div>
                  </button>
                )}

                {/* Profile and Notification Settings moved into sidebar */}
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-gray-700 hover:bg-white hover:shadow-md"
                >
                  <Edit className="h-5 w-5" />
                  <div className="flex-1">
                    <div className="font-medium">Profile</div>
                  </div>
                </button>

                <button
                  onClick={() => setIsNotifSettingsOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-gray-700 hover:bg-white hover:shadow-md"
                >
                  <BellRing className="h-5 w-5" />
                  <div className="flex-1">
                    <div className="font-medium">Notification Settings</div>
                  </div>
                </button>

              </nav>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 flex flex-col">


              {/* Content Area */}
              <div className="flex-1 p-3 bg-gray-50 overflow-y-auto h-full">
                <div className="flex items-center justify-end gap-2 mb-3"></div>
                {activeTab === 'branding' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BrandingKits initialKitId={kitId} />
                  </motion.div>
                )}

                {activeTab === 'tasks' && (
                  <motion.div
                    key="tasks-tab"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg border border-gray-200 h-full p-0 flex flex-col"
                  >
                    <TaskList 
                      key={`task-list-${currentUser?.uid}-${selectedExpert?.email || 'all'}`}
                      userRole={userIsExpert ? 'expert' : 'customer'}
                      expertInfo={expertInfo}
                      initialSelectedTaskId={selectedTaskId}
                      onTaskSelected={() => setSelectedTaskId(null)}
                      selectedExpert={selectedExpert}
                      onUnreadTotalChange={setUnreadTotal}
                    />
                  </motion.div>
                )}

                {activeTab === 'agreements' && canAccessSignedAgreements && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg border border-gray-200 p-6"
                  >
                    <SignedAgreements />
                  </motion.div>
                )}

                {activeTab === 'invoicing' && canAccessInvoicing && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg border border-gray-200 p-6"
                  >
                    <Invoicing onNavigateToTask={handleNavigateToTask} />
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

        {/* Notification Settings Modal */}
        <NotificationSettingsModal
          isOpen={isNotifSettingsOpen}
          onClose={() => setIsNotifSettingsOpen(false)}
        />

      </div>
    );
  };

  export default Dashboard; 