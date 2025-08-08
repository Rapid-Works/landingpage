// Expert service for managing expert-related functionality
import SamuelAvatar from '../images/SamuelProfile.jpg';
import PrinceAvatar from '../images/princeardiabah.png';

/**
 * Expert database mapping roles to emails and information
 */
export const EXPERTS = {
  'Samuel Donkor': {
    email: 'samuel.donkor@rapid-works.io',
    role: 'Software Expert',
    name: 'Samuel Donkor',
    avatar: SamuelAvatar,
    skills: ['Backend Development', 'Frontend Development', 'API Integration']
  },
  'Prince Ardiabah': {
    email: 'prince.ardiabah@rapid-works.io',
    role: 'Marketing Expert', 
    name: 'Prince Ardiabah',
    avatar: PrinceAvatar,
    skills: ['Digital Marketing', 'SEO', 'Content Strategy']
  }
};

/**
 * Expert email to name mapping for quick lookups
 */
export const EXPERT_EMAIL_MAP = {
  'samuel.donkor@rapid-works.io': 'Samuel Donkor',
  'prince.ardiabah@rapid-works.io': 'Prince Ardiabah'
};

/**
 * Expert role to email mapping
 */
export const EXPERT_ROLE_EMAIL_MAP = {
  'Software Expert': 'samuel.donkor@rapid-works.io',
  'Marketing Expert': 'prince.ardiabah@rapid-works.io',
  'Design Expert': null, // Coming soon
  'Finance Expert': null, // Coming soon
  'Data Analysis Expert': null, // Coming soon
  'AI Expert': null, // Coming soon
  'DevOps Expert': null, // Coming soon
  'Software Test Expert': null, // Coming soon
  'Database Expert': null, // Coming soon
  'Social Media Expert': null // Coming soon
};

/**
 * Check if a user is an expert based on their email
 * @param {string} email - User's email address
 * @returns {boolean} - True if user is an expert
 */
export const isExpert = (email) => {
  if (!email) return false;
  return Object.keys(EXPERT_EMAIL_MAP).includes(email.toLowerCase());
};

/**
 * Get expert information by email
 * @param {string} email - Expert's email address
 * @returns {Object|null} - Expert information or null if not found
 */
export const getExpertByEmail = (email) => {
  if (!email) return null;
  
  const expertName = EXPERT_EMAIL_MAP[email.toLowerCase()];
  if (!expertName) return null;
  
  return EXPERTS[expertName];
};

/**
 * Get expert information by name
 * @param {string} name - Expert's name
 * @returns {Object|null} - Expert information or null if not found
 */
export const getExpertByName = (name) => {
  if (!name) return null;
  return EXPERTS[name] || null;
};

/**
 * Get expert email by role
 * @param {string} role - Expert role (e.g., 'Software Expert')
 * @returns {string|null} - Expert email or null if not available
 */
export const getExpertEmailByRole = (role) => {
  if (!role) return null;
  return EXPERT_ROLE_EMAIL_MAP[role] || null;
};

/**
 * Get expert name by role
 * @param {string} role - Expert role
 * @returns {string|null} - Expert name or null if not available
 */
export const getExpertNameByRole = (role) => {
  const email = getExpertEmailByRole(role);
  if (!email) return null;
  return EXPERT_EMAIL_MAP[email];
};

/**
 * Get all available experts
 * @returns {Array} - Array of expert objects
 */
export const getAllExperts = () => {
  return Object.values(EXPERTS);
};

/**
 * Get all available expert emails
 * @returns {Array} - Array of expert email addresses
 */
export const getAllExpertEmails = () => {
  return Object.keys(EXPERT_EMAIL_MAP);
};

/**
 * Check if an expert role is available (has an assigned expert)
 * @param {string} role - Expert role
 * @returns {boolean} - True if role has an assigned expert
 */
export const isExpertRoleAvailable = (role) => {
  const email = getExpertEmailByRole(role);
  return email !== null;
};

/**
 * Get user role (expert or customer)
 * @param {string} email - User's email
 * @returns {string} - 'expert' or 'customer'
 */
export const getUserRole = (email) => {
  return isExpert(email) ? 'expert' : 'customer';
};

/**
 * Get expert dashboard display name based on role
 * @param {string} role - Expert role
 * @returns {string} - Display name for dashboard
 */
export const getExpertDashboardTitle = (role) => {
  const expertName = getExpertNameByRole(role);
  return expertName ? `${expertName} - ${role}` : 'Expert Dashboard';
};

/**
 * Check if a user is an admin based on their email
 * @param {string} email - User's email address
 * @returns {boolean} - True if user is an admin
 */
export const isAdmin = (email) => {
  if (!email) return false;
  const expert = getExpertByEmail(email);
  return expert?.isAdmin === true;
};

/**
 * Check if user has admin or expert access
 * @param {string} email - User's email address
 * @returns {boolean} - True if user is admin or expert
 */
export const hasExpertAccess = (email) => {
  return isAdmin(email) || isExpert(email);
};

export default {
  EXPERTS,
  EXPERT_EMAIL_MAP,
  EXPERT_ROLE_EMAIL_MAP,
  isExpert,
  getExpertByEmail,
  getExpertByName,
  getExpertEmailByRole,
  getExpertNameByRole,
  getAllExperts,
  getAllExpertEmails,
  isExpertRoleAvailable,
  getUserRole,
  getExpertDashboardTitle,
  isAdmin,
  hasExpertAccess
}; 