import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Mail, Calendar, Building, User, Filter, Download } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // all, verified, unverified, organization, personal
  const [sortBy, setSortBy] = useState('createdAt'); // createdAt, displayName, email, lastLogin

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const filterAndSortUsers = React.useCallback(() => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.displayName?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.organizationInfo?.organization?.name?.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    switch (filterBy) {
      case 'organization':
        filtered = filtered.filter(user => user.organizationInfo);
        break;
      case 'personal':
        filtered = filtered.filter(user => !user.organizationInfo);
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'displayName':
          return (a.displayName || '').localeCompare(b.displayName || '');
        case 'email':
          return (a.email || '').localeCompare(b.email || '');
        case 'lastLogin':
          const aLastLogin = a.lastLoginAt?.toDate?.() || a.lastLoginAt || new Date(0);
          const bLastLogin = b.lastLoginAt?.toDate?.() || b.lastLoginAt || new Date(0);
          return new Date(bLastLogin) - new Date(aLastLogin);
        case 'createdAt':
        default:
          const aCreated = a.createdAt?.toDate?.() || a.createdAt || new Date(0);
          const bCreated = b.createdAt?.toDate?.() || b.createdAt || new Date(0);
          return new Date(bCreated) - new Date(aCreated);
      }
    });

    setFilteredUsers(filtered);
  }, [users, searchTerm, filterBy, sortBy]);

  useEffect(() => {
    filterAndSortUsers();
  }, [filterAndSortUsers]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching all users...');
      
      // Fetch all users - try without orderBy first in case there's no createdAt field
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      console.log(`📊 Found ${usersSnapshot.docs.length} users in database`);
      
      // If no users found, try checking if they're in a different collection or if we have permissions
      if (usersSnapshot.docs.length === 0) {
        console.log('⚠️ No users found. This could be due to:');
        console.log('  - Firestore security rules restricting access');
        console.log('  - Users stored in a different collection');
        console.log('  - No users have been created yet');
      }
      
      // Fetch organization memberships to identify organization users
      const orgMembersQuery = query(
        collection(db, 'organizationMembers'),
        where('status', '==', 'active')
      );
      const orgMembersSnapshot = await getDocs(orgMembersQuery);
      console.log(`📊 Found ${orgMembersSnapshot.docs.length} active organization members`);
      
      // Create a map of userId to organization info
      const userOrgMap = {};
      for (const doc of orgMembersSnapshot.docs) {
        const memberData = doc.data();
        userOrgMap[memberData.userId] = {
          organizationId: memberData.organizationId,
          role: memberData.role,
          joinedAt: memberData.joinedAt
        };
      }
      
      // Fetch organization details
      const organizationsQuery = query(collection(db, 'organizations'));
      const organizationsSnapshot = await getDocs(organizationsQuery);
      const organizationsMap = {};
      organizationsSnapshot.docs.forEach(doc => {
        organizationsMap[doc.id] = { id: doc.id, ...doc.data() };
      });
      console.log(`📊 Found ${organizationsSnapshot.docs.length} organizations`);

      // Combine user data with organization info
      const usersData = usersSnapshot.docs.map(doc => {
        const userData = { id: doc.id, ...doc.data() };
        const orgInfo = userOrgMap[doc.id];
        
        return {
          ...userData,
          organizationInfo: orgInfo ? {
            ...orgInfo,
            organization: organizationsMap[orgInfo.organizationId]
          } : null
        };
      });

      console.log(`📊 Processed ${usersData.length} users with organization info`);
      setUsers(usersData);
    } catch (error) {
      console.error('❌ Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };



  const formatDate = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = timestamp?.toDate?.() || timestamp;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const csvData = filteredUsers.map(user => ({
      Name: user.displayName || '',
      Email: user.email || '',
              'Account Status': 'Active',
      'Account Type': user.organizationInfo ? 'Organization' : 'Personal',
      Organization: user.organizationInfo?.organization?.name || '',
      'Org Role': user.organizationInfo?.role || '',
      'Created At': formatDate(user.createdAt),
      'Last Login': formatDate(user.lastLoginAt)
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3BEC] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Platform Users</h1>
          <p className="text-gray-600 mt-1">
            Manage and view all users on the platform ({filteredUsers.length} of {users.length} users)
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-[#7C3BEC] text-white rounded-lg hover:bg-[#6B32D6] transition-colors"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or organization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent"
            >
              <option value="all">All Users</option>
              <option value="organization">Organization Users</option>
              <option value="personal">Personal Accounts</option>
            </select>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-transparent"
          >
            <option value="createdAt">Sort by Join Date</option>
            <option value="displayName">Sort by Name</option>
            <option value="email">Sort by Email</option>
            <option value="lastLogin">Sort by Last Login</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Account Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Organization</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    {/* User Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#7C3BEC] rounded-full flex items-center justify-center">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt={user.displayName}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-sm font-medium">
                              {user.displayName ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 
                               user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.displayName || 'No name'}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Account Type */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {user.organizationInfo ? (
                          <>
                            <Building className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-blue-600 font-medium">Organization</span>
                          </>
                        ) : (
                          <>
                            <User className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-600">Personal</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Organization */}
                    <td className="py-4 px-4">
                      {user.organizationInfo ? (
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.organizationInfo.organization?.name || 'Unknown Organization'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {user.organizationInfo.role === 'admin' ? 'Administrator' : 'Member'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>

                    {/* Last Login */}
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">
                        {formatDate(user.lastLoginAt)}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
