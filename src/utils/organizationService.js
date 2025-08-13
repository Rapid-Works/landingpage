import { 
  collection, 
  doc as firestoreDoc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  writeBatch,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Organization CRUD operations
export const createOrganization = async (userId, orgData) => {
  try {
    const batch = writeBatch(db);
    
    // Create organization document
    const orgRef = firestoreDoc(collection(db, 'organizations'));
    const organizationData = {
      ...orgData,
      createdBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    batch.set(orgRef, organizationData);
    
    // Create organization member (creator as admin)
    const memberRef = firestoreDoc(collection(db, 'organizationMembers'));
    const memberData = {
      organizationId: orgRef.id,
      userId: userId,
      role: 'admin',
      permissions: {
        canRequestExperts: true,
        canSeeAllRequests: true,
        canManageMembers: true
      },
      joinedAt: serverTimestamp(),
      invitedBy: userId,
      status: 'active'
    };
    batch.set(memberRef, memberData);
    
    // Update user's currentOrganizationId (create document if it doesn't exist)
    const userRef = firestoreDoc(db, 'users', userId);
    batch.set(userRef, {
      currentOrganizationId: orgRef.id,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    await batch.commit();
    
    return { id: orgRef.id, ...organizationData };
  } catch (error) {
    console.error('Error creating organization:', error);
    throw new Error('Failed to create organization');
  }
};

export const getOrganization = async (organizationId) => {
  try {
    const orgDoc = await getDoc(firestoreDoc(db, 'organizations', organizationId));
    if (orgDoc.exists()) {
      return { id: orgDoc.id, ...orgDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting organization:', error);
    throw new Error('Failed to get organization');
  }
};

export const getUserOrganizations = async (userId) => {
  try {
    const membersQuery = query(
      collection(db, 'organizationMembers'),
      where('userId', '==', userId),
      where('status', '==', 'active')
    );
    
    const memberDocs = await getDocs(membersQuery);
    const organizations = [];
    
    for (const memberDoc of memberDocs.docs) {
      const memberData = memberDoc.data();
      const org = await getOrganization(memberData.organizationId);
      if (org) {
        organizations.push({
          ...org,
          membershipId: memberDoc.id,
          role: memberData.role,
          permissions: memberData.permissions,
          joinedAt: memberData.joinedAt
        });
      }
    }
    
    return organizations;
  } catch (error) {
    console.error('Error getting user organizations:', error);
    throw new Error('Failed to get user organizations');
  }
};

export const switchToOrganization = async (userId, organizationId) => {
  try {
    const userRef = firestoreDoc(db, 'users', userId);
    await setDoc(userRef, {
      currentOrganizationId: organizationId,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    // Notify other components that organization context changed
    window.dispatchEvent(new CustomEvent('organizationContextChanged'));
  } catch (error) {
    console.error('Error switching to organization:', error);
    throw new Error('Failed to switch to organization');
  }
};

export const switchToPersonal = async (userId) => {
  try {
    const userRef = firestoreDoc(db, 'users', userId);
    await setDoc(userRef, {
      currentOrganizationId: null,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    // Notify other components that organization context changed
    window.dispatchEvent(new CustomEvent('organizationContextChanged'));
  } catch (error) {
    console.error('Error switching to personal:', error);
    throw new Error('Failed to switch to personal account');
  }
};

// Organization member management
export const getOrganizationMembers = async (organizationId) => {
  try {
    // Get active members
    const membersQuery = query(
      collection(db, 'organizationMembers'),
      where('organizationId', '==', organizationId),
      where('status', '==', 'active'),
      orderBy('joinedAt', 'desc')
    );
    
    const memberDocs = await getDocs(membersQuery);
    const members = [];
    
    for (const memberDoc of memberDocs.docs) {
      const memberData = memberDoc.data();
      
      // Get user details
      const userDoc = await getDoc(firestoreDoc(db, 'users', memberData.userId));
      const userData = userDoc.exists() ? userDoc.data() : {};
      
      // Better fallback for missing user data
      let userEmail = 'Unknown';
      let userName = 'Unknown';
      
      if (userData.email) {
        userEmail = userData.email;
        userName = userData.displayName || userData.email.split('@')[0];
      } else if (memberData.userId) {
        // If no user document exists, show the user ID as a fallback
        userName = `User ${memberData.userId.substring(0, 8)}...`;
        userEmail = `Missing user data (${memberData.userId.substring(0, 8)}...)`;
      }
      
      members.push({
        id: memberDoc.id,
        type: 'member',
        ...memberData,
        userEmail,
        userName
      });
    }
    
    // Get pending invitations
    const invitationsQuery = query(
      collection(db, 'organizationInvitations'),
      where('organizationId', '==', organizationId),
      where('status', '==', 'pending')
    );
    
    const invitationDocs = await getDocs(invitationsQuery);
    
    for (const invitationDoc of invitationDocs.docs) {
      const invitationData = invitationDoc.data();
      
      // Check if invitation hasn't expired
      const isExpired = invitationData.expiresAt.toDate() < new Date();
      
      if (!isExpired) {
        members.push({
          id: invitationDoc.id,
          type: 'invitation',
          userEmail: invitationData.inviteeEmail,
          userName: invitationData.inviteeEmail.split('@')[0],
          role: 'member',
          permissions: invitationData.permissions,
          joinedAt: invitationData.createdAt,
          status: 'pending',
          inviterName: invitationData.inviterName || 'Unknown'
        });
      }
    }
    
    // Sort by joinedAt/createdAt desc
    members.sort((a, b) => {
      const aDate = a.joinedAt?.toDate?.() || new Date(a.joinedAt);
      const bDate = b.joinedAt?.toDate?.() || new Date(b.joinedAt);
      return bDate - aDate;
    });
    
    return members;
  } catch (error) {
    console.error('Error getting organization members:', error);
    throw new Error('Failed to get organization members');
  }
};

export const generateInvitationToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const createInvitation = async (organizationId, inviterUserId, inviteeEmail, permissions = {}, inviterInfo = {}) => {
  try {
    const invitationData = {
      organizationId,
      inviterUserId,
      inviterName: inviterInfo.name || 'Unknown',
      inviterEmail: inviterInfo.email || '',
      inviteeEmail: inviteeEmail.toLowerCase(),
      permissions: {
        canRequestExperts: permissions.canRequestExperts || false,
        canSeeAllRequests: permissions.canSeeAllRequests || false,
        canManageMembers: false // Only admins can manage members initially
      },
      token: generateInvitationToken(),
      status: 'pending',
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    };
    
    const invitationRef = await addDoc(collection(db, 'organizationInvitations'), invitationData);
    
    return {
      id: invitationRef.id,
      ...invitationData,
      invitationLink: `${window.location.origin}/organization/invite/${invitationData.token}`
    };
  } catch (error) {
    console.error('Error creating invitation:', error);
    throw new Error('Failed to create invitation');
  }
};

export const getInvitationByToken = async (token) => {
  try {
    const invitationsQuery = query(
      collection(db, 'organizationInvitations'),
      where('token', '==', token),
      where('status', '==', 'pending')
    );
    
    const invitationDocs = await getDocs(invitationsQuery);
    
    if (invitationDocs.empty) {
      return null;
    }
    
    const invitationData = invitationDocs.docs[0].data();
    const invitationId = invitationDocs.docs[0].id;
    
    // Check if invitation has expired
    if (invitationData.expiresAt.toDate() < new Date()) {
      return null;
    }
    
    // Get organization details
    const org = await getOrganization(invitationData.organizationId);
    
    return {
      id: invitationId,
      ...invitationData,
      organization: org,
      inviterName: invitationData.inviterName || 'Unknown'
    };
  } catch (error) {
    console.error('Error getting invitation:', error);
    throw new Error('Failed to get invitation');
  }
};

export const acceptInvitation = async (token, userId, userEmail) => {
  try {
    const invitation = await getInvitationByToken(token);
    
    if (!invitation) {
      throw new Error('Invalid or expired invitation');
    }
    
    if (invitation.inviteeEmail !== userEmail.toLowerCase()) {
      throw new Error('This invitation was sent to a different email address');
    }
    
    // Check if user is already a member
    const existingMemberQuery = query(
      collection(db, 'organizationMembers'),
      where('organizationId', '==', invitation.organizationId),
      where('userId', '==', userId),
      where('status', '==', 'active')
    );
    
    const existingMembers = await getDocs(existingMemberQuery);
    if (!existingMembers.empty) {
      throw new Error('You are already a member of this organization');
    }
    
    const batch = writeBatch(db);
    
    // Create organization member
    const memberRef = firestoreDoc(collection(db, 'organizationMembers'));
    const memberData = {
      organizationId: invitation.organizationId,
      userId: userId,
      role: 'member',
      permissions: invitation.permissions,
      joinedAt: serverTimestamp(),
      invitedBy: invitation.inviterUserId,
      status: 'active'
    };
    batch.set(memberRef, memberData);
    
    // Update invitation status
    const invitationRef = firestoreDoc(db, 'organizationInvitations', invitation.id);
    batch.update(invitationRef, {
      status: 'accepted',
      acceptedBy: userId,
      acceptedAt: serverTimestamp()
    });
    
    // Switch user to the organization
    const userRef = firestoreDoc(db, 'users', userId);
    batch.set(userRef, {
      currentOrganizationId: invitation.organizationId,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    // Add user to organization branding kits
    try {
      console.log('🔍 Adding user to organization branding kits...');
      const brandingKitsRef = collection(db, 'brandkits');
      const brandingKitsSnapshot = await getDocs(brandingKitsRef);
      
      let kitsUpdated = 0;
      brandingKitsSnapshot.forEach((kitDoc) => {
        const kitData = kitDoc.data();
        
        // Check if this kit belongs to the organization
        if (kitData.organizationName === invitation.organization.name) {
          console.log(`📦 Found organization kit: ${kitDoc.id}`);
          
          // Get current email list (handle both array and single email formats)
          let currentEmails = [];
          if (Array.isArray(kitData.email)) {
            currentEmails = [...kitData.email];
          } else if (kitData.email) {
            currentEmails = [kitData.email];
          }
          
          // Add user email if not already present
          if (!currentEmails.includes(userEmail.toLowerCase())) {
            currentEmails.push(userEmail.toLowerCase());
            
            // Update the kit in the batch
            const kitRef = firestoreDoc(db, 'brandkits', kitDoc.id);
            batch.update(kitRef, {
              email: currentEmails,
              updatedAt: serverTimestamp()
            });
            
            kitsUpdated++;
            console.log(`✅ Added ${userEmail} to kit: ${kitDoc.id}`);
          } else {
            console.log(`ℹ️ User ${userEmail} already in kit: ${kitDoc.id}`);
          }
        }
      });
      
      console.log(`📊 Updated ${kitsUpdated} organization branding kits`);
    } catch (error) {
      console.error('⚠️ Error adding user to organization branding kits:', error);
      // Don't fail the entire invitation process if branding kit update fails
    }
    
    await batch.commit();
    
    return invitation.organization;
  } catch (error) {
    console.error('Error accepting invitation:', error);
    throw error;
  }
};

export const updateMemberPermissions = async (membershipId, permissions) => {
  try {
    const memberRef = firestoreDoc(db, 'organizationMembers', membershipId);
    await updateDoc(memberRef, {
      permissions,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating member permissions:', error);
    throw new Error('Failed to update member permissions');
  }
};

export const removeMember = async (membershipId) => {
  try {
    // Get member info first to remove from branding kits
    const memberRef = firestoreDoc(db, 'organizationMembers', membershipId);
    const memberDoc = await getDoc(memberRef);
    
    if (!memberDoc.exists()) {
      throw new Error('Member not found');
    }
    
    const memberData = memberDoc.data();
    
    // Get user email for branding kit removal
    let userEmail = null;
    if (memberData.userId) {
      const userDoc = await getDoc(firestoreDoc(db, 'users', memberData.userId));
      if (userDoc.exists()) {
        userEmail = userDoc.data().email;
      }
    }
    
    // Get organization info
    let organizationName = null;
    if (memberData.organizationId) {
      const orgDoc = await getDoc(firestoreDoc(db, 'organizations', memberData.organizationId));
      if (orgDoc.exists()) {
        organizationName = orgDoc.data().name;
      }
    }
    
    const batch = writeBatch(db);
    
    // Remove member
    batch.update(memberRef, {
      status: 'removed',
      removedAt: serverTimestamp()
    });
    
    // Remove user from organization branding kits
    if (userEmail && organizationName) {
      try {
        console.log('🔍 Removing user from organization branding kits...');
        const brandingKitsRef = collection(db, 'brandkits');
        const brandingKitsSnapshot = await getDocs(brandingKitsRef);
        
        let kitsUpdated = 0;
        brandingKitsSnapshot.forEach((kitDoc) => {
          const kitData = kitDoc.data();
          
          // Check if this kit belongs to the organization
          if (kitData.organizationName === organizationName) {
            console.log(`📦 Found organization kit: ${kitDoc.id}`);
            
            // Get current email list (handle both array and single email formats)
            let currentEmails = [];
            if (Array.isArray(kitData.email)) {
              currentEmails = [...kitData.email];
            } else if (kitData.email) {
              currentEmails = [kitData.email];
            }
            
            // Remove user email if present
            const emailIndex = currentEmails.findIndex(email => 
              email.toLowerCase() === userEmail.toLowerCase()
            );
            
            if (emailIndex !== -1) {
              currentEmails.splice(emailIndex, 1);
              
              // Update the kit in the batch
              const kitRef = firestoreDoc(db, 'brandkits', kitDoc.id);
              batch.update(kitRef, {
                email: currentEmails,
                updatedAt: serverTimestamp()
              });
              
              kitsUpdated++;
              console.log(`✅ Removed ${userEmail} from kit: ${kitDoc.id}`);
            } else {
              console.log(`ℹ️ User ${userEmail} not in kit: ${kitDoc.id}`);
            }
          }
        });
        
        console.log(`📊 Updated ${kitsUpdated} organization branding kits`);
      } catch (error) {
        console.error('⚠️ Error removing user from organization branding kits:', error);
        // Don't fail the entire removal process if branding kit update fails
      }
    }
    
    await batch.commit();
  } catch (error) {
    console.error('Error removing member:', error);
    throw new Error('Failed to remove member');
  }
};

// Check user permissions in organization
export const getUserOrgPermissions = async (userId, organizationId) => {
  try {
    const memberQuery = query(
      collection(db, 'organizationMembers'),
      where('userId', '==', userId),
      where('organizationId', '==', organizationId),
      where('status', '==', 'active')
    );
    
    const memberDocs = await getDocs(memberQuery);
    
    if (memberDocs.empty) {
      return null;
    }
    
    const memberData = memberDocs.docs[0].data();
    return {
      role: memberData.role,
      permissions: memberData.permissions
    };
  } catch (error) {
    console.error('Error getting user org permissions:', error);
    return null;
  }
};

// Get current user context (personal vs organization)
export const getCurrentUserContext = async (userId) => {
  try {
    const userDoc = await getDoc(firestoreDoc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return { type: 'personal', organization: null, permissions: null };
    }
    
    const userData = userDoc.data();
    const currentOrgId = userData.currentOrganizationId;
    
    if (!currentOrgId) {
      return { type: 'personal', organization: null, permissions: null };
    }
    
    const organization = await getOrganization(currentOrgId);
    const permissions = await getUserOrgPermissions(userId, currentOrgId);
    
    return {
      type: 'organization',
      organization,
      permissions
    };
  } catch (error) {
    console.error('Error getting current user context:', error);
    return { type: 'personal', organization: null, permissions: null };
  }
};

const organizationService = {
  createOrganization,
  getOrganization,
  getUserOrganizations,
  switchToOrganization,
  switchToPersonal,
  getOrganizationMembers,
  createInvitation,
  getInvitationByToken,
  acceptInvitation,
  updateMemberPermissions,
  removeMember,
  getUserOrgPermissions,
  getCurrentUserContext
};

// Utility functions for debugging and fixing data issues
export const debugOrganizationMembers = async (organizationId) => {
  try {
    console.log('🔍 Debugging organization members for:', organizationId);
    
    // Get all members
    const membersQuery = query(
      collection(db, 'organizationMembers'),
      where('organizationId', '==', organizationId)
    );
    const memberDocs = await getDocs(membersQuery);
    
    console.log(`Found ${memberDocs.size} organization members:`);
    
    for (const memberDoc of memberDocs.docs) {
      const memberData = memberDoc.data();
      console.log('Member:', {
        id: memberDoc.id,
        userId: memberData.userId,
        role: memberData.role,
        status: memberData.status,
        joinedAt: memberData.joinedAt?.toDate?.()
      });
      
      // Check if user document exists
      if (memberData.userId) {
        const userDoc = await getDoc(firestoreDoc(db, 'users', memberData.userId));
        console.log(`User ${memberData.userId} exists:`, userDoc.exists());
        if (userDoc.exists()) {
          console.log('User data:', userDoc.data());
        }
      }
    }
    
    // Get all invitations
    const invitationsQuery = query(
      collection(db, 'organizationInvitations'),
      where('organizationId', '==', organizationId)
    );
    const invitationDocs = await getDocs(invitationsQuery);
    
    console.log(`Found ${invitationDocs.size} invitations:`);
    invitationDocs.forEach(invitationDoc => {
      console.log('Invitation:', { id: invitationDoc.id, ...invitationDoc.data() });
    });
    
  } catch (error) {
    console.error('Error debugging organization members:', error);
  }
};

export const cleanupDuplicateInvitations = async (organizationId) => {
  try {
    console.log('🧹 Cleaning up duplicate invitations for:', organizationId);
    
    const invitationsQuery = query(
      collection(db, 'organizationInvitations'),
      where('organizationId', '==', organizationId),
      where('status', '==', 'pending')
    );
    
    const invitationDocs = await getDocs(invitationsQuery);
    const invitationsByEmail = new Map();
    const duplicatesToDelete = [];
    
    // Group invitations by email
    invitationDocs.forEach(doc => {
      const data = doc.data();
      const email = data.inviteeEmail;
      
      if (invitationsByEmail.has(email)) {
        // This is a duplicate - mark for deletion (keep the first one)
        duplicatesToDelete.push(doc.id);
      } else {
        invitationsByEmail.set(email, doc.id);
      }
    });
    
    // Delete duplicates
    const batch = writeBatch(db);
    duplicatesToDelete.forEach(invitationId => {
      const invitationRef = firestoreDoc(db, 'organizationInvitations', invitationId);
      batch.delete(invitationRef);
    });
    
    if (duplicatesToDelete.length > 0) {
      await batch.commit();
      console.log(`Deleted ${duplicatesToDelete.length} duplicate invitations`);
    }
    
    return duplicatesToDelete.length;
  } catch (error) {
    console.error('Error cleaning up duplicate invitations:', error);
    throw error;
  }
};

export const fixMissingUserData = async (organizationId, currentUserId, currentUserData) => {
  try {
    console.log('🔧 Fixing missing user data for organization:', organizationId);
    
    const membersQuery = query(
      collection(db, 'organizationMembers'),
      where('organizationId', '==', organizationId),
      where('status', '==', 'active')
    );
    
    const memberDocs = await getDocs(membersQuery);
    let fixedCount = 0;
    
    const batch = writeBatch(db);
    
    for (const memberDoc of memberDocs.docs) {
      const memberData = memberDoc.data();
      
      if (memberData.userId) {
        const userRef = firestoreDoc(db, 'users', memberData.userId);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          console.log(`Creating missing user document for: ${memberData.userId}`);
          
          // If this is the current user, use their data
          if (memberData.userId === currentUserId) {
            batch.set(userRef, {
              email: currentUserData.email,
              displayName: currentUserData.displayName,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
            fixedCount++;
          } else {
            // For other users, create a placeholder document
            // This will be updated when they log in next time
            batch.set(userRef, {
              email: `user-${memberData.userId.substring(0, 8)}@placeholder.com`,
              displayName: `User ${memberData.userId.substring(0, 8)}`,
              isPlaceholder: true,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
            fixedCount++;
            console.log(`Created placeholder user data for ${memberData.userId}`);
          }
        }
      }
    }
    
    if (fixedCount > 0) {
      await batch.commit();
      console.log(`Fixed ${fixedCount} user records`);
    }
    
    return fixedCount;
  } catch (error) {
    console.error('Error fixing missing user data:', error);
    throw error;
  }
};

// Admin function to get all organizations
export const getAllOrganizations = async () => {
  try {
    const organizationsRef = collection(db, 'organizations');
    const q = query(organizationsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const organizations = [];
    for (const organizationDoc of snapshot.docs) {
      const orgData = { id: organizationDoc.id, ...organizationDoc.data() };
      
      // Get member count for each organization
      const membersRef = collection(db, 'organizationMembers');
      const membersQuery = query(
        membersRef, 
        where('organizationId', '==', organizationDoc.id),
        where('status', '==', 'active')
      );
      const membersSnapshot = await getDocs(membersQuery);
      orgData.memberCount = membersSnapshot.size;
      
      // Get admin info
      const adminQuery = query(
        membersRef,
        where('organizationId', '==', organizationDoc.id),
        where('role', '==', 'admin'),
        where('status', '==', 'active')
      );
      const adminSnapshot = await getDocs(adminQuery);
      if (!adminSnapshot.empty) {
        const adminData = adminSnapshot.docs[0].data();
        // Create user document reference
        const adminUserRef = firestoreDoc(db, 'users', adminData.userId);
        const adminUserDoc = await getDoc(adminUserRef);
        if (adminUserDoc.exists()) {
          const adminUser = adminUserDoc.data();
          orgData.adminName = adminUser.displayName || adminUser.email?.split('@')[0] || 'Unknown';
          orgData.adminEmail = adminUser.email || 'Unknown';
        } else {
          orgData.adminName = 'Unknown';
          orgData.adminEmail = 'Unknown';
        }
      }
      
      organizations.push(orgData);
    }
    
    return organizations;
  } catch (error) {
    console.error('Error fetching all organizations:', error);
    throw new Error('Failed to fetch organizations');
  }
};

export default organizationService;
