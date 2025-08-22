// Utility functions for generating deep links and URLs

/**
 * Generate a deep link URL to a specific task in the dashboard
 * @param {string} taskId - The task ID to link to
 * @returns {string} - The complete URL to the task
 */
export const generateTaskDeepLink = (taskId) => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://rapid-works.io' 
    : 'http://localhost:3000';
  
  return `${baseUrl}/dashboard/task/${taskId}`;
};

/**
 * Generate a deep link URL to the dashboard with optional parameters
 * @param {Object} options - Options for the dashboard link
 * @param {string} options.tab - The tab to open (optional)
 * @param {string} options.kitId - The kit ID to open (optional)
 * @returns {string} - The complete URL to the dashboard
 */
export const generateDashboardLink = (options = {}) => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://rapid-works.io' 
    : 'http://localhost:3000';
  
  let url = `${baseUrl}/dashboard`;
  
  if (options.kitId) {
    url += `/${options.kitId}`;
  }
  
  if (options.tab) {
    // Save the tab preference to localStorage when the link is generated
    // This will be picked up by the Dashboard component
    url += `?tab=${options.tab}`;
  }
  
  return url;
};

/**
 * Extract task ID from a task deep link URL
 * @param {string} url - The URL to extract the task ID from
 * @returns {string|null} - The task ID or null if not found
 */
export const extractTaskIdFromUrl = (url) => {
  const match = url.match(/\/dashboard\/task\/([^/?]+)/);
  return match ? match[1] : null;
};
