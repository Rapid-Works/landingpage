import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, Building2, User, Plus, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getUserOrganizations, 
  switchToOrganization, 
  switchToPersonal,
  getCurrentUserContext
} from '../utils/organizationService';

const OrganizationSwitcher = ({ onCreateOrganization, currentContext, onContextChange }) => {
  const { currentUser } = useAuth();
  
  // Check if user is rapid-works admin
  const isRapidWorksAdmin = currentUser?.email?.endsWith('@rapid-works.io');
  const [isOpen, setIsOpen] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [switching, setSwitching] = useState(false);
  const dropdownRef = useRef(null);

  const loadOrganizations = useCallback(async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const userOrgs = await getUserOrganizations(currentUser.uid);
      setOrganizations(userOrgs);
    } catch (error) {
      console.error('Error loading organizations:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadOrganizations();
    }
  }, [currentUser, loadOrganizations]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchToPersonal = async () => {
    setSwitching(true);
    try {
      await switchToPersonal(currentUser.uid);
      const newContext = await getCurrentUserContext(currentUser.uid);
      onContextChange(newContext);
      setIsOpen(false);
    } catch (error) {
      console.error('Error switching to personal:', error);
    } finally {
      setSwitching(false);
    }
  };

  const handleSwitchToOrganization = async (organizationId) => {
    setSwitching(true);
    try {
      await switchToOrganization(currentUser.uid, organizationId);
      const newContext = await getCurrentUserContext(currentUser.uid);
      onContextChange(newContext);
      setIsOpen(false);
    } catch (error) {
      console.error('Error switching to organization:', error);
    } finally {
      setSwitching(false);
    }
  };

  const handleCreateOrganization = () => {
    setIsOpen(false);
    onCreateOrganization();
  };

  const getCurrentDisplayName = () => {
    if (currentContext?.type === 'organization' && currentContext.organization) {
      return currentContext.organization.name;
    }
    return isRapidWorksAdmin ? 'Rapid Works' : 'Personal Account';
  };

  const getCurrentIcon = () => {
    if (currentContext?.type === 'organization') {
      return <Building2 className="h-4 w-4" />;
    }
    return isRapidWorksAdmin ? <Building2 className="h-4 w-4" /> : <User className="h-4 w-4" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={switching}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200 bg-gray-50"
      >
        <div className="flex-shrink-0">
          {getCurrentIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">
            {getCurrentDisplayName()}
          </div>
          <div className="text-xs text-gray-500">
            {currentContext?.type === 'organization' ? 'Organization' : (isRapidWorksAdmin ? 'Company' : 'Personal')}
          </div>
        </div>
        {switching ? (
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        ) : (
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
          {/* Personal Account Option */}
          <button
            onClick={handleSwitchToPersonal}
            disabled={switching}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
              currentContext?.type === 'personal' ? 'bg-blue-50' : ''
            }`}
          >
            {isRapidWorksAdmin ? <Building2 className="h-4 w-4 text-gray-600" /> : <User className="h-4 w-4 text-gray-600" />}
            <div className="flex-1">
              <div className="font-medium text-sm">{isRapidWorksAdmin ? 'Rapid Works' : 'Personal Account'}</div>
              <div className="text-xs text-gray-500">{isRapidWorksAdmin ? 'Company workspace' : 'Your personal workspace'}</div>
            </div>
            {currentContext?.type === 'personal' && (
              <Check className="h-4 w-4 text-blue-600" />
            )}
          </button>

          {/* Separator */}
          {organizations.length > 0 && (
            <div className="border-t border-gray-100 my-1" />
          )}

          {/* Organization Options */}
          {loading ? (
            <div className="px-4 py-3 text-center text-gray-500 text-sm">
              <Loader2 className="h-4 w-4 animate-spin mx-auto mb-1" />
              Loading organizations...
            </div>
          ) : (
            organizations.map((org) => (
              <button
                key={org.id}
                onClick={() => handleSwitchToOrganization(org.id)}
                disabled={switching}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  currentContext?.organization?.id === org.id ? 'bg-blue-50' : ''
                }`}
              >
                <Building2 className="h-4 w-4 text-gray-600" />
                <div className="flex-1">
                  <div className="font-medium text-sm truncate">{org.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{org.role}</div>
                </div>
                {currentContext?.organization?.id === org.id && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </button>
            ))
          )}

          {/* Create Organization Option - Only show if user doesn't have any organizations and is not rapid-works admin */}
          {!isRapidWorksAdmin && organizations.length === 0 && (
            <div className="border-t border-gray-100 mt-1">
              <button
                onClick={handleCreateOrganization}
                disabled={switching}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 text-[#7C3BEC]"
              >
                <Plus className="h-4 w-4" />
                <div className="font-medium text-sm">Create Organization</div>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrganizationSwitcher;
