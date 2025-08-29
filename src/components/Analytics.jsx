import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, 
  Plus, 
  ExternalLink, 
  Copy, 
  QrCode, 
  TrendingUp,
  Users,
  MousePointer,
  Trash2,
  Globe,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getCurrentUserContext } from '../utils/organizationService';
import { 
  createTrackingLink, 
  getTrackingLinks, 
  getAnalyticsSummary,
  deleteTrackingLink,
  getReferrerAnalytics,
  getVisitTrends
} from '../utils/analyticsService';
import QRCodeModal from './QRCodeModal';
import CreateTrackingLinkModal from './CreateTrackingLinkModal';

const Analytics = () => {
  const { currentUser } = useAuth();
  const [trackingLinks, setTrackingLinks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [referrerData, setReferrerData] = useState(null);
  const [trendsData, setTrendsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [copiedLink, setCopiedLink] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [hoveredDataPoint, setHoveredDataPoint] = useState(null);
  const [selectedLinkFilter, setSelectedLinkFilter] = useState('all');

  // Get current context (personal vs organization) - using the same pattern as BrandingKits
  const [currentContext, setCurrentContext] = useState(null);

  // Load organization context using the same service as BrandingKits
  useEffect(() => {
    const loadContext = async () => {
      if (!currentUser) {
        setCurrentContext(null);
        return;
      }
      
      try {
        const context = await getCurrentUserContext(currentUser.uid);
        console.log('🔄 Context loaded via getCurrentUserContext:', context);
        setCurrentContext(context);
      } catch (error) {
        console.error('Error loading user context in analytics:', error);
      }
    };

    loadContext();
  }, [currentUser]);

  // Listen for context changes using the same pattern as header
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'organizationContextChanged') {
        // Reload context when organization changes
        if (currentUser) {
          getCurrentUserContext(currentUser.uid)
            .then(context => {
              console.log('🔄 Context reloaded after storage change:', context);
              setCurrentContext(context);
            })
            .catch(error => console.error('Error reloading context:', error));
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from same window
    const handleContextChange = () => {
      if (currentUser) {
        getCurrentUserContext(currentUser.uid)
          .then(context => {
            console.log('🔄 Context reloaded after custom event:', context);
            setCurrentContext(context);
          })
          .catch(error => console.error('Error reloading context:', error));
      }
    };

    window.addEventListener('organizationContextChanged', handleContextChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('organizationContextChanged', handleContextChange);
    };
  }, [currentUser]);

  // Debug function to check current context (call from browser console)
  useEffect(() => {
    window.debugAnalyticsContext = () => {
      console.log('🔍 Analytics Context Debug:');
      console.log('  - currentContext state:', currentContext);
      console.log('  - localStorage raw:', localStorage.getItem('currentOrganizationContext'));
      try {
        const stored = JSON.parse(localStorage.getItem('currentOrganizationContext') || '{}');
        console.log('  - localStorage parsed:', stored);
      } catch (e) {
        console.log('  - localStorage parse error:', e);
      }
      console.log('  - currentUser:', currentUser?.email);
    };
    
    return () => {
      delete window.debugAnalyticsContext;
    };
  }, [currentContext, currentUser]);

  const loadAnalytics = useCallback(async () => {
    if (!currentUser || !currentContext) {
      setLoading(false);
      return;
    }

    console.log('🔄 Loading analytics for user:', currentUser.email, 'context:', currentContext);

    try {
      setLoading(true);
      
      // Use the same logic as BrandingKits for determining organizationId
      const organizationId = currentContext.type === 'organization' 
        ? currentContext.organization?.id 
        : null;

      console.log('📊 Context Analysis (using getCurrentUserContext):');
      console.log('  - currentContext.type:', currentContext.type);
      console.log('  - currentContext.organization:', currentContext.organization);
      console.log('  - Resolved organizationId:', organizationId);
      console.log('  - Should query for:', organizationId ? 'ORGANIZATION data' : 'PERSONAL data');
      console.log('📊 User ID:', currentUser.uid);

      const [linksData, summaryData, referrerAnalytics, visitsData] = await Promise.all([
        getTrackingLinks(currentUser.uid, organizationId),
        getAnalyticsSummary(currentUser.uid, organizationId),
        getReferrerAnalytics(currentUser.uid, organizationId),
        getVisitTrends(currentUser.uid, organizationId, 30)
      ]);

      console.log('📊 Links data received:', linksData);
      console.log('📊 Links with organizationId:', linksData.filter(link => link.organizationId));
      console.log('📊 Links without organizationId (personal):', linksData.filter(link => !link.organizationId));

      console.log('✅ Analytics loaded:', { 
        links: linksData.length, 
        summary: summaryData,
        referrers: referrerAnalytics.sources.length,
        trends: visitsData.length
      });

      setTrackingLinks(linksData);
      setSummary(summaryData);
      setReferrerData(referrerAnalytics);
      setTrendsData(visitsData);
    } catch (error) {
      console.error('❌ Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, currentContext]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // Reload trends data when link filter changes
  useEffect(() => {
    const loadFilteredTrends = async () => {
      if (!currentUser || !currentContext) return;

      try {
        const organizationId = currentContext.type === 'organization' 
          ? currentContext.organization?.id 
          : null;

        console.log('🔄 Loading filtered trends for:', selectedLinkFilter, 'with organizationId:', organizationId);

        const visitsData = await getVisitTrends(
          currentUser.uid, 
          organizationId, 
          30, 
          selectedLinkFilter === 'all' ? null : selectedLinkFilter
        );

        setTrendsData(visitsData);
      } catch (error) {
        console.error('❌ Error loading filtered trends:', error);
      }
    };

    // Only reload trends when we have context and tracking links loaded
    if (currentContext && trackingLinks.length > 0) {
      loadFilteredTrends();
    }
  }, [selectedLinkFilter, currentUser, currentContext, trackingLinks.length]);

  const handleCreateLink = async (linkData) => {
    try {
      const organizationId = currentContext.type === 'organization' 
        ? currentContext.organization?.id 
        : null;

      const newLink = await createTrackingLink({
        ...linkData,
        userId: currentUser.uid,
        organizationId,
        createdBy: currentUser.email
      });

      setTrackingLinks(prev => [newLink, ...prev]);
      setShowCreateModal(false);
      
      // Refresh summary
      await loadAnalytics();
    } catch (error) {
      console.error('Error creating tracking link:', error);
      alert('Failed to create tracking link. Please try again.');
    }
  };

  const handleCopyLink = async (trackingUrl) => {
    try {
      await navigator.clipboard.writeText(trackingUrl);
      setCopiedLink(trackingUrl);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const handleShowQR = (link) => {
    setSelectedLink(link);
    setShowQRModal(true);
  };

  const handleDeleteLink = async (linkId) => {
    if (!window.confirm('Are you sure you want to delete this tracking link? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteTrackingLink(linkId);
      setTrackingLinks(prev => prev.filter(link => link.id !== linkId));
      await loadAnalytics(); // Refresh summary
    } catch (error) {
      console.error('Error deleting tracking link:', error);
      alert('Failed to delete tracking link. Please try again.');
    }
  };





  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3BEC]"></div>
        <span className="ml-3 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Rapid Analytics</h1>
          <p className="text-gray-600 mt-1">
            Track and analyze your marketing campaigns with custom links and QR codes
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#7C3BEC] hover:bg-[#6B32D6] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Create Tracking Link
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-[#7C3BEC] text-[#7C3BEC]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-[#7C3BEC] text-[#7C3BEC]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Rapid Analytics
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
                {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Links</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{summary.totalLinks}</p>
              </div>
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Visits</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{summary.totalVisits}</p>
              </div>
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <MousePointer className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Click Rate</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{summary.conversionRate}%</p>
              </div>
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-[#7C3BEC] group"
            onClick={() => setActiveTab('analytics')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider group-hover:text-[#7C3BEC] transition-colors">View Trends</p>
                <p className="text-sm font-medium text-gray-600 mt-1 flex items-center group-hover:text-[#7C3BEC] transition-colors">
                  Analytics →
                </p>
              </div>
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-[#7C3BEC] transition-colors">
                <TrendingUp className="h-5 w-5 text-gray-600 group-hover:text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Links Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Traffic Tracking Links</h2>
        </div>

        {trackingLinks.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tracking links yet</h3>
            <p className="text-gray-500 mb-6">
              Create your first tracking link to start monitoring your campaigns
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#7C3BEC] hover:bg-[#6B32D6] text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Create Your First Link
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination Link
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking Link
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    QR Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Analytics Link
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trackingLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{link.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        <a 
                          href={link.destinationUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          {link.destinationUrl}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {link.trackingUrl}
                        </code>
                        <button
                          onClick={() => handleCopyLink(link.trackingUrl)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Copy link"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        {copiedLink === link.trackingUrl && (
                          <span className="text-xs text-green-600">Copied!</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleShowQR(link)}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                      >
                        <QrCode className="h-3 w-3 mr-1" />
                        View QR
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {link.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{link.visits || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {link.topReferrers && link.topReferrers.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {link.topReferrers.slice(0, 3).map((source, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {source.source} ({source.count})
                              </span>
                            ))}
                            {link.topReferrers.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{link.topReferrers.length - 3} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">No data yet</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete link"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
        </>
      )}

      {/* Charts & Graphs Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Enhanced Visit Trends Chart */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Chart Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Visit Trends</h3>
                    <p className="text-sm text-gray-500">Track your campaign performance over time</p>
                  </div>
                </div>
                
                {/* Link Filter */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Filter by link:</span>
                  <select 
                    value={selectedLinkFilter}
                    onChange={(e) => setSelectedLinkFilter(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent bg-white"
                  >
                    <option value="all">All Links</option>
                    {trackingLinks.map(link => (
                      <option key={link.id} value={link.id}>
                        {link.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Chart Content */}
            <div className="p-6">
              {trendsData.length > 0 ? (
                <div className="relative">
                  {/* Chart Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {trendsData.reduce((sum, day) => sum + day.visits, 0)}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Total Visits</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {Math.round(trendsData.reduce((sum, day) => sum + day.visits, 0) / trendsData.length)}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Daily Average</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {Math.max(...trendsData.map(d => d.visits))}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Peak Day</div>
                    </div>
                  </div>

                  {/* Interactive Chart */}
                  <div className="h-80 relative">
                    <svg viewBox="0 0 800 280" className="w-full h-full">
                      {/* Grid lines */}
                      {[0, 1, 2, 3, 4, 5, 6].map(i => (
                        <line 
                          key={i}
                          x1="40" 
                          y1={40 + i * 35} 
                          x2="760" 
                          y2={40 + i * 35} 
                          stroke="#e5e7eb" 
                          strokeWidth="1"
                          strokeDasharray="2,2"
                        />
                      ))}
                      
                      {/* Y-axis labels */}
                      {[0, 1, 2, 3, 4, 5, 6].map(i => {
                        const maxVisits = Math.max(...trendsData.map(d => d.visits)) || 1;
                        let value;
                        
                        if (maxVisits <= 6) {
                          // For small numbers, show exact integers
                          value = Math.max(0, maxVisits - i);
                        } else {
                          // For larger numbers, use the original calculation
                          value = Math.round((maxVisits / 6) * (6 - i));
                        }
                        
                        return (
                          <text 
                            key={i}
                            x="30" 
                            y={45 + i * 35} 
                            fill="#6B7280"
                            fontSize="11"
                            textAnchor="end"
                          >
                            {value}
                          </text>
                        );
                      })}
                      
                      {/* Gradient definition */}
                      <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#7C3BEC" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#7C3BEC" stopOpacity="0.05"/>
                        </linearGradient>
                      </defs>
                      
                      {/* Area under curve */}
                      <path
                        fill="url(#chartGradient)"
                        d={`M 40 250 ${trendsData.slice(-14).map((day, index) => {
                          const maxVisits = Math.max(...trendsData.map(d => d.visits)) || 1;
                          const x = 40 + (index / 13) * 720;
                          const y = 250 - ((day.visits / maxVisits) * 210);
                          return `L ${x} ${y}`;
                        }).join(' ')} L 760 250 Z`}
                      />
                      
                      {/* Line chart */}
                      <polyline
                        fill="none"
                        stroke="#7C3BEC"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={trendsData.slice(-14).map((day, index) => {
                          const maxVisits = Math.max(...trendsData.map(d => d.visits)) || 1;
                          const x = 40 + (index / 13) * 720;
                          const y = 250 - ((day.visits / maxVisits) * 210);
                          return `${x},${y}`;
                        }).join(' ')}
                      />
                      
                      {/* Interactive Data points */}
                      {trendsData.slice(-14).map((day, index) => {
                        const maxVisits = Math.max(...trendsData.map(d => d.visits)) || 1;
                        const x = 40 + (index / 13) * 720;
                        const y = 250 - ((day.visits / maxVisits) * 210);
                        const isHovered = hoveredDataPoint === index;
                        
                        return (
                          <g key={`${day.date}-${index}`}>
                            {/* Invisible larger circle for easier hovering */}
                            <circle
                              cx={x}
                              cy={y}
                              r="12"
                              fill="transparent"
                              style={{ cursor: 'pointer' }}
                              onMouseEnter={() => setHoveredDataPoint(index)}
                              onMouseLeave={() => setHoveredDataPoint(null)}
                            />
                            
                            {/* Visible data point */}
                            <circle
                              cx={x}
                              cy={y}
                              r={isHovered ? "8" : "5"}
                              fill="#7C3BEC"
                              stroke="white"
                              strokeWidth="2"
                              style={{ 
                                cursor: 'pointer',
                                transition: 'r 0.2s ease',
                                pointerEvents: 'none' // Let the invisible circle handle events
                              }}
                            />
                            
                            {/* Tooltip */}
                            {isHovered && (
                              <g style={{ pointerEvents: 'none' }}>
                                <rect
                                  x={x - 50}
                                  y={y - 50}
                                  width="100"
                                  height="35"
                                  fill="rgba(0, 0, 0, 0.9)"
                                  rx="6"
                                  ry="6"
                                />
                                {/* Tooltip arrow */}
                                <polygon
                                  points={`${x-5},${y-15} ${x+5},${y-15} ${x},${y-8}`}
                                  fill="rgba(0, 0, 0, 0.9)"
                                />
                                <text 
                                  x={x} 
                                  y={y - 32} 
                                  fill="white"
                                  fontSize="12"
                                  fontWeight="600"
                                  textAnchor="middle"
                                >
                                  {day.visits} visits
                                </text>
                                <text 
                                  x={x} 
                                  y={y - 20} 
                                  fill="rgba(255, 255, 255, 0.8)"
                                  fontSize="11"
                                  textAnchor="middle"
                                >
                                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </text>
                              </g>
                            )}
                          </g>
                        );
                      })}
                      
                      {/* X-axis */}
                      <line x1="40" y1="250" x2="760" y2="250" stroke="#d1d5db" strokeWidth="2"/>
                      
                      {/* X-axis labels */}
                      {trendsData.slice(-14).filter((_, index) => index % 3 === 0).map((day, filteredIndex) => {
                        const originalIndex = filteredIndex * 3;
                        const x = 40 + (originalIndex / 13) * 720;
                        return (
                          <text 
                            key={day.date}
                            x={x} 
                            y={270} 
                            className="text-xs fill-gray-500"
                            textAnchor="middle"
                          >
                            {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </text>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No data yet</h4>
                    <p className="text-sm text-gray-500">Start sharing your tracking links to see visit trends</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Traffic Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Referrer Sources */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {/* Section Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Globe className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Traffic Sources</h3>
                    <p className="text-sm text-gray-500">Where your visitors come from</p>
                  </div>
                </div>
              </div>

              {/* Sources List */}
              <div className="p-6">
                {referrerData && referrerData.sources.length > 0 ? (
                  <div className="space-y-4">
                    {referrerData.sources.slice(0, 8).map((source, index) => {
                      const colors = [
                        'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500',
                        'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-gray-500'
                      ];
                      return (
                        <div key={source.source} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`}></div>
                            <div>
                              <span className="text-sm font-medium text-gray-900">{source.source}</span>
                              <div className="text-xs text-gray-500">{source.percentage}% of total traffic</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">{source.count}</div>
                            <div className="text-xs text-gray-500">visits</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Globe className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No traffic sources yet</h4>
                    <p className="text-sm text-gray-500">Share your links to see where visitors come from</p>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Top Performing Links */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {/* Section Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Top Performing Links</h3>
                    <p className="text-sm text-gray-500">Your best converting campaigns</p>
                  </div>
                </div>
              </div>

              {/* Links List */}
              <div className="p-6">
                {trackingLinks.length > 0 ? (
                  <div className="space-y-4">
                    {trackingLinks
                      .sort((a, b) => (b.visits || 0) - (a.visits || 0))
                      .slice(0, 5)
                      .map((link, index) => {
                        const maxVisits = Math.max(...trackingLinks.map(l => l.visits || 0));
                        const percentage = maxVisits > 0 ? ((link.visits || 0) / maxVisits) * 100 : 0;
                        const rankColors = ['bg-yellow-500', 'bg-gray-400', 'bg-orange-600', 'bg-blue-500', 'bg-green-500'];
                        
                        return (
                          <div key={link.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 ${rankColors[index]} rounded-lg flex items-center justify-center text-sm font-bold text-white`}>
                                  #{index + 1}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {link.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Created {new Date(link.createdAt?.toDate ? link.createdAt.toDate() : link.createdAt || Date.now()).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-gray-900">{link.visits || 0}</div>
                                <div className="text-xs text-gray-500">visits</div>
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-[#7C3BEC] h-2 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${Math.max(percentage, 2)}%` }}
                              ></div>
                            </div>
                            
                            {/* Performance Badge */}
                            {index === 0 && link.visits > 0 && (
                              <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                🏆 Top Performer
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h4>
                    <p className="text-sm text-gray-500">Create tracking links to see performance data</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateTrackingLinkModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateLink}
        />
      )}

      {showQRModal && selectedLink && (
        <QRCodeModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          link={selectedLink}
        />
      )}
    </div>
  );
};

export default Analytics;
