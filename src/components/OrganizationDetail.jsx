import React, { useState, useEffect } from 'react';
import { Building2, Users, Calendar, MapPin, Mail, User, Loader2, MessageSquare, Package, FileText, ExternalLink, ChevronRight } from 'lucide-react';
import { getOrganizationMembers } from '../utils/organizationService';
import { subscribeOrganizationTaskRequests } from '../utils/taskRequestService';

const OrganizationDetail = ({ organization, onNavigateToTask }) => {
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [brandingKits, setBrandingKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadOrganizationData = async () => {
      setLoading(true);
      try {
        // Load members
        const orgMembers = await getOrganizationMembers(organization.id);
        setMembers(orgMembers);

        // Subscribe to organization tasks
        const unsubscribeTasks = subscribeOrganizationTaskRequests(
          organization.id,
          (taskData) => {
            setTasks(taskData);
          },
          true, // canSeeAllRequests = true for admin view
          null, // userId not needed for admin view
          50 // limit
        );

        // TODO: Load branding kits for this organization
        // This would require filtering branding kits by organizationName
        setBrandingKits([]);

        setLoading(false);

        // Cleanup subscription on unmount
        return () => {
          if (unsubscribeTasks) unsubscribeTasks();
        };
      } catch (error) {
        console.error('Error loading organization data:', error);
        setLoading(false);
      }
    };

    if (organization) {
      loadOrganizationData();
    }
  }, [organization]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusColorSaaS = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'accepted':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'completed':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleTaskClick = (taskId) => {
    if (onNavigateToTask) {
      onNavigateToTask(taskId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading organization details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Organization Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
              <span className="font-semibold text-gray-700 text-xl">
                {organization.name?.substring(0, 2).toUpperCase() || 'OR'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{organization.name || 'Unnamed Organization'}</h1>
              <p className="text-gray-600 mt-1">Organization ID: {organization.id}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created {formatDate(organization.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {organization.memberCount || 0} members
                </div>
                {organization.city && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {organization.city}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Organization Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</dt>
                <dd className="text-sm text-gray-900">{organization.adminName || 'Unknown'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</dt>
                <dd className="text-sm text-gray-900">{organization.adminEmail || 'Unknown'}</dd>
              </div>
            </dl>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Address</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Street</dt>
                <dd className="text-sm text-gray-900">{organization.street || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">City & Postal Code</dt>
                <dd className="text-sm text-gray-900">
                  {organization.city || 'N/A'} {organization.postalCode && `(${organization.postalCode})`}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Establishment</dt>
                <dd className="text-sm text-gray-900">
                  {organization.dateOfEstablishment ? 
                    new Date(organization.dateOfEstablishment).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'
                  }
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: Building2 },
              { id: 'members', name: 'Members', icon: Users, count: members.length },
              { id: 'requests', name: 'Requests', icon: MessageSquare, count: tasks.length },
              { id: 'branding', name: 'Branding Kits', icon: Package, count: brandingKits.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
                {tab.count !== undefined && (
                  <span className={`${
                    activeTab === tab.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                  } ml-2 py-0.5 px-2 rounded-full text-xs font-medium`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Members</p>
                    <p className="text-2xl font-semibold text-gray-900">{members.filter(m => m.type === 'member').length}</p>
                  </div>
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Users className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Requests</p>
                    <p className="text-2xl font-semibold text-gray-900">{tasks.length}</p>
                  </div>
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Branding Kits</p>
                    <p className="text-2xl font-semibold text-gray-900">{brandingKits.length}</p>
                  </div>
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Package className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-4">
              {members.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No members found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.userName || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">{member.userEmail || 'Unknown'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                          member.role === 'admin' 
                            ? 'bg-gray-100 text-gray-800 border-gray-300' 
                            : 'bg-white text-gray-600 border-gray-300'
                        }`}>
                          {member.role || 'member'}
                        </span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                          member.type === 'invitation' 
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                            : 'bg-green-50 text-green-700 border-green-200'
                        }`}>
                          {member.type === 'invitation' ? 'Pending' : 'Active'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No requests found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm cursor-pointer transition-all duration-200"
                      onClick={() => handleTaskClick(task.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{task.taskName || 'Unnamed Task'}</p>
                          <p className="text-sm text-gray-500">
                            Created by {task.createdBy?.split('@')[0] || 'Unknown'} • {formatDate(task.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getTaskStatusColorSaaS(task.status)}`}>
                          {task.status || 'pending'}
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Branding kits functionality coming soon</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetail;
