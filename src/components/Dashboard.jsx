import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Edit, Package, MessageSquare, FileCheck, Receipt, ChevronDown, ChevronRight, BellRing, Users, Building, BarChart3 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import RapidWorksHeader from './new_landing_page_header';
import BrandingKits from './BrandingKits';
import ProfileEditModal from './ProfileEditModal';
import NotificationSettingsModal from './NotificationSettingsModal';
import TaskList from './TaskList';
import SignedAgreements from './SignedAgreements';
import Invoicing from './Invoicing';
import OrganizationSwitcher from './OrganizationSwitcher';
import CreateOrganizationModal from './CreateOrganizationModal';
import OrganizationUsers from './OrganizationUsers';
import OrganizationsList from './OrganizationsList';
import Analytics from './Analytics';
import AllUsers from './AllUsers';

import { isExpert, getExpertByEmail, isAdmin, getAllExperts } from '../utils/expertService';
import { getCurrentUserContext } from '../utils/organizationService';
// notification helpers handled inside NotificationSettingsModal



// const accent = "#7C3BEC";

const Dashboard = () => {
  const { currentUser } = useAuth();
  // const navigate = useNavigate();
  const { kitId, taskId } = useParams();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  // Open Notification Settings if history link set the flag
  const initialOpenNotif = typeof window !== 'undefined' && localStorage.getItem('openNotificationSettings') === '1';
  
  // Persist active tab across refreshes
  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('dashboardActiveTab');
      return savedTab || 'branding';
    }
    return 'branding';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [expertTasksExpanded, setExpertTasksExpanded] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [unreadTotal, setUnreadTotal] = useState(0);
  // moved to Notification Settings modal
  const [isNotifSettingsOpen, setIsNotifSettingsOpen] = useState(initialOpenNotif);
  
  // Organization state
  const [currentContext, setCurrentContext] = useState(null);
  const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false);
  const [contextLoading, setContextLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (initialOpenNotif) {
    try { localStorage.removeItem('openNotificationSettings'); } catch (e) {}
  }

  // Save active tab to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboardActiveTab', activeTab);
    }
  }, [activeTab]);

  // Close mobile menu on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load user context (personal vs organization)
  useEffect(() => {
    const loadContext = async () => {
      if (!currentUser) {
        setContextLoading(false);
        return;
      }
      
      setContextLoading(true);
      try {
        const context = await getCurrentUserContext(currentUser.uid);
        setCurrentContext(context);
      } catch (error) {
        console.error('Error loading user context:', error);
      } finally {
        setContextLoading(false);
      }
    };

    loadContext();
  }, [currentUser]);

  // Handle deep linking to specific task via URL parameter
  useEffect(() => {
    if (taskId && !contextLoading) {
      console.log('🔗 Deep linking to task:', taskId);
      // Navigate to tasks tab and select the specific task
      setActiveTab('tasks');
      setSelectedTaskId(taskId);
      // URL will be cleared by handleTaskSelected callback
    }
  }, [taskId, contextLoading]);
  
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
  
  // Check if user can access organizations admin panel (rapid-works.io emails only)
  const canAccessOrganizations = currentUser && currentUser.email?.endsWith('@rapid-works.io');
  
  // Check if user can access analytics (available to all authenticated users)
  const canAccessAnalytics = currentUser !== null;
  
  // Check if user can access all users list (rapid-works.io emails only)
  const canAccessAllUsers = currentUser && currentUser.email?.endsWith('@rapid-works.io');

  // Handle navigation from invoicing to task chat
  const handleNavigateToTask = (taskId) => {
    setSelectedTaskId(taskId);
    setActiveTab('tasks');
  };

  // Handle task successfully selected (callback from TaskList)
  const handleTaskSelected = () => {
    // Clear the taskId from URL when task is successfully selected
    if (taskId) {
      const currentPath = window.location.pathname;
      const newPath = currentPath.replace(`/task/${taskId}`, '');
      window.history.replaceState(null, '', newPath);
    }
    // Don't clear selectedTaskId here as we want to keep the task selected
  };

  // moved enable/test notifications into Notification Settings modal

  const handleOrganizationCreated = (organization) => {
    // Update context after organization creation
    setCurrentContext({
      type: 'organization',
      organization,
      permissions: {
        role: 'admin',
        permissions: {
          canRequestExperts: true,
          canSeeAllRequests: true,
          canManageMembers: true
        }
      }
    });
  };

  const handleContextChange = (newContext) => {
    setCurrentContext(newContext);
  };

  // Check if user can see Members tab (only in organization context and has appropriate permissions)
  const canAccessMembers = currentContext?.type === 'organization' && 
    (currentContext.permissions?.role === 'admin' || currentContext.permissions?.permissions?.canManageMembers);

  // Check if user can edit profile (personal account or organization admin)
  const canEditProfile = currentContext?.type === 'personal' || 
    (currentContext?.type === 'organization' && currentContext.permissions?.role === 'admin');

  if (contextLoading) {
    return (
      <div className="h-screen bg-gray-100 overflow-hidden flex flex-col">
        <RapidWorksHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3BEC] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 overflow-hidden flex flex-col">
      <RapidWorksHeader />

      {/* Sidebar Dashboard Layout - Responsive like Slack/Gmail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white overflow-hidden h-[calc(100vh-3rem)] mt-12"
      >
          <div className="flex h-full relative">
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}

            {/* Left Sidebar */}
            <div className={`${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 fixed lg:relative top-0 left-0 z-50 lg:z-auto w-72 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0 h-full transition-transform duration-300 ease-in-out lg:transition-none`}>
              {/* Sidebar Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  {/* Profile Avatar */}
                  <div className="relative group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-md ${
                      currentContext?.type === 'organization' ? 'bg-blue-600' : 'bg-[#7C3BEC]'
                    }`}>
                      {currentContext?.type === 'organization' ? (
                        <span className="font-bold text-white text-sm">
                          {currentContext.organization.name.substring(0, 2).toUpperCase()}
                        </span>
                      ) : currentUser?.photoURL ? (
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
                    
                    {/* Edit Button Overlay - Only show for personal accounts or org admins */}
                    {canEditProfile && (
                      <button
                        onClick={() => setIsProfileModalOpen(true)}
                        className="absolute -bottom-1 -right-1 bg-[#7C3BEC] hover:bg-[#6B32D6] text-white p-1 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 opacity-0 group-hover:opacity-100"
                        title="Edit Profile"
                      >
                        <Edit className="h-2.5 w-2.5" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {currentContext?.type === 'organization' 
                        ? currentContext.organization.name
                        : (currentUser?.displayName?.split(' ')[0] || currentUser?.email?.split('@')[0])
                      }
                    </h3>
                    {currentContext?.type === 'organization' && (
                      <p className="text-xs text-gray-500 truncate">
                        {currentContext.permissions?.role === 'admin' ? 'Administrator' : 'Member'}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Organization Switcher */}
                <OrganizationSwitcher 
                  onCreateOrganization={() => setIsCreateOrgModalOpen(true)}
                  currentContext={currentContext}
                  onContextChange={handleContextChange}
                />
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 p-4 space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('branding');
                    // Don't clear selectedTaskId - let TaskList preserve its state
                    setIsMobileMenuOpen(false); // Close mobile menu
                  }}
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
                          // Don't clear selectedTaskId when expanding - preserve user selection
                        }
                        setIsMobileMenuOpen(false); // Close mobile menu
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
                            // Don't clear selectedTaskId - preserve user selection
                            setIsMobileMenuOpen(false); // Close mobile menu
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
                              // Clear selectedTaskId when switching experts since tasks will be different
                              setSelectedTaskId(null);
                              setIsMobileMenuOpen(false); // Close mobile menu
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
                  // Only show Tasks tab for experts or organization members (not personal accounts)
                  (userIsExpert || currentContext?.type === 'organization') && (
                    <button
                      onClick={() => {
                        setActiveTab('tasks');
                        // Don't clear selectedTaskId - preserve user selection
                        setIsMobileMenuOpen(false); // Close mobile menu
                      }}
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
                  )
                )}

                {canAccessSignedAgreements && (
                  <button
                    onClick={() => {
                      setActiveTab('agreements');
                      setSelectedTaskId(null); // Clear when leaving tasks area
                      setIsMobileMenuOpen(false); // Close mobile menu
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === 'agreements'
                        ? 'bg-[#7C3BEC] text-white shadow-lg'
                        : 'text-gray-700 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <FileCheck className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="font-medium">Agreements</div>
                    </div>
                  </button>
                )}

                {canAccessInvoicing && (
                  <button
                    onClick={() => {
                      setActiveTab('invoicing');
                      setSelectedTaskId(null); // Clear when leaving tasks area
                      setIsMobileMenuOpen(false); // Close mobile menu
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === 'invoicing'
                        ? 'bg-[#7C3BEC] text-white shadow-lg'
                        : 'text-gray-700 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <Receipt className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="font-medium">Invoicing</div>
                    </div>
                  </button>
                )}

                {canAccessOrganizations && (
                  <>
                    <button
                      onClick={() => {
                        setActiveTab('organizations');
                        setSelectedTaskId(null); // Clear when leaving tasks area
                        setIsMobileMenuOpen(false); // Close mobile menu
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === 'organizations'
                          ? 'bg-[#7C3BEC] text-white shadow-lg'
                          : 'text-gray-700 hover:bg-white hover:shadow-md'
                      }`}
                    >
                      <Building className="h-5 w-5" />
                      <div className="flex-1">
                        <div className="font-medium">Organizations</div>
                      </div>
                    </button>
                  </>
                )}

                {canAccessAllUsers && (
                  <button
                    onClick={() => {
                      setActiveTab('users');
                      setSelectedTaskId(null); // Clear when leaving tasks area
                      setIsMobileMenuOpen(false); // Close mobile menu
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === 'users'
                        ? 'bg-[#7C3BEC] text-white shadow-lg'
                        : 'text-gray-700 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="font-medium">Users</div>
                    </div>
                  </button>
                )}

                {canAccessAnalytics && (
                  <button
                    onClick={() => {
                      setActiveTab('analytics');
                      setSelectedTaskId(null); // Clear when leaving tasks area
                      setIsMobileMenuOpen(false); // Close mobile menu
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === 'analytics'
                        ? 'bg-[#7C3BEC] text-white shadow-lg'
                        : 'text-gray-700 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <BarChart3 className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="font-medium">Rapid Analytics</div>
                    </div>
                  </button>
                )}

                {canAccessMembers && (
                  <button
                    onClick={() => {
                      setActiveTab('members');
                      setSelectedTaskId(null); // Clear when leaving tasks area
                      setIsMobileMenuOpen(false); // Close mobile menu
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === 'members'
                        ? 'bg-[#7C3BEC] text-white shadow-lg'
                        : 'text-gray-700 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="font-medium">Members</div>
                    </div>
                  </button>
                )}

                {/* Profile and Notification Settings moved into sidebar */}
                {canEditProfile && (
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(true);
                      setIsMobileMenuOpen(false); // Close mobile menu
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-gray-700 hover:bg-white hover:shadow-md"
                  >
                    <Edit className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="font-medium">Profile</div>
                    </div>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsNotifSettingsOpen(true);
                    setIsMobileMenuOpen(false); // Close mobile menu
                  }}
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
            <div className="flex-1 flex flex-col min-w-0">
              {/* Mobile Header */}
              <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center gap-3">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-lg font-semibold text-gray-900 truncate">
                  {activeTab === 'branding' && 'Branding Kits'}
                  {activeTab === 'tasks' && (userIsExpert ? 'Expert Tasks' : 'My Requests')}
                  {activeTab === 'agreements' && 'Agreements'}
                  {activeTab === 'invoicing' && 'Invoicing'}
                  {activeTab === 'organizations' && 'Organizations'}
                  {activeTab === 'users' && 'Users'}
                  {activeTab === 'analytics' && 'Rapid Analytics'}
                  {activeTab === 'members' && 'Members'}
                </h1>
              </div>


              {/* Content Area */}
              <div className="flex-1 p-3 lg:p-3 bg-gray-50 overflow-y-auto h-full">
                <div className="flex items-center justify-end gap-2 mb-3 hidden lg:flex"></div>
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
                      onTaskSelected={handleTaskSelected}
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
                    className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6"
                  >
                    <SignedAgreements />
                  </motion.div>
                )}

                {activeTab === 'invoicing' && canAccessInvoicing && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6"
                  >
                    <Invoicing onNavigateToTask={handleNavigateToTask} />
                  </motion.div>
                )}

                {activeTab === 'organizations' && canAccessOrganizations && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6"
                  >
                    <OrganizationsList onNavigateToTask={handleNavigateToTask} />
                  </motion.div>
                )}

                {activeTab === 'users' && canAccessAllUsers && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6"
                  >
                    <AllUsers />
                  </motion.div>
                )}

                {activeTab === 'analytics' && canAccessAnalytics && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6"
                  >
                    <Analytics />
                  </motion.div>
                )}

                {activeTab === 'members' && canAccessMembers && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6"
                  >
                    <OrganizationUsers 
                      organization={currentContext.organization}
                      currentUserPermissions={currentContext.permissions}
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

        {/* Notification Settings Modal */}
        <NotificationSettingsModal
          isOpen={isNotifSettingsOpen}
          onClose={() => setIsNotifSettingsOpen(false)}
        />

        {/* Create Organization Modal */}
        <CreateOrganizationModal
          isOpen={isCreateOrgModalOpen}
          onClose={() => setIsCreateOrgModalOpen(false)}
          onOrganizationCreated={handleOrganizationCreated}
        />

      </div>
    );
  };

  export default Dashboard; 