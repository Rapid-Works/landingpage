# Task Deep Linking Implementation

## Overview
This implementation enables direct deep linking to specific tasks in the Dashboard from Microsoft Teams notifications. When a user submits a task request via the team page, experts receive a Teams notification with a direct link to view that specific task.

## How It Works

### 1. Route Structure
- **General Dashboard**: `/dashboard`
- **Dashboard with Kit**: `/dashboard/:kitId` 
- **Dashboard with Task**: `/dashboard/task/:taskId` ← NEW

### 2. URL Parameter Handling
The Dashboard component now extracts both `kitId` and `taskId` from the URL parameters:
```jsx
const { kitId, taskId } = useParams();
```

### 3. Automatic Navigation
When a `taskId` is present in the URL:
1. The dashboard automatically switches to the "tasks" tab
2. The specific task is auto-selected
3. The URL parameter is cleaned up to prevent re-selection on refresh

### 4. Teams Notification Updates
All three notification formats now include:
- **Primary Action**: "View Task" button that opens the specific task
- **Secondary Action**: "Open Dashboard" button that opens the general dashboard
- **Text Links**: Direct clickable links in the notification body

## User Flow

1. **Customer** submits a task request on the team page
2. **System** saves the task and generates a unique `taskId`
3. **Teams notification** is sent to the expert with a deep link: 
   `https://rapid-works.io/dashboard/task/{taskId}`
4. **Expert** clicks the "View Task" button or link
5. **Browser** opens the dashboard and automatically:
   - Navigates to the tasks tab
   - Selects the specific task
   - Opens the task chat/details

## Benefits

- **Instant Access**: Experts can jump directly to the relevant task
- **Improved UX**: No need to search through tasks to find the new request
- **Better Engagement**: Faster response times due to easier access
- **Mobile Friendly**: Works on mobile devices with responsive design

## Technical Implementation

### Files Modified:
1. **`/src/App.js`**: Added new route pattern for task deep linking
2. **`/src/components/Dashboard.jsx`**: Added URL parameter handling and auto-navigation
3. **`/src/utils/teamsWebhookService.js`**: Updated all notification formats with deep links
4. **`/src/utils/linkService.js`**: Created utility functions for link generation

### Utility Functions:
```javascript
// Generate task deep link
generateTaskDeepLink(taskId) // → https://rapid-works.io/dashboard/task/{taskId}

// Extract task ID from URL
extractTaskIdFromUrl(url) // → taskId or null

// Generate dashboard link with options
generateDashboardLink({ tab: 'tasks', kitId: 'kit123' })
```

## Testing

To test the deep linking functionality:

1. **Manual Testing**: 
   - Navigate to `/dashboard/task/test-task-id`
   - Verify it switches to tasks tab and selects the task

2. **From Teams**: 
   - Submit a task request
   - Check Teams notification has "View Task" button
   - Click button and verify navigation

3. **Mobile Testing**:
   - Test deep links on mobile devices
   - Verify responsive design works correctly

## Environment Support

The link generation automatically detects the environment:
- **Production**: `https://rapid-works.io`
- **Development**: `http://localhost:3000`

## Future Enhancements

Potential improvements:
- Add deep linking to specific branding kits
- Support query parameters for filtering tasks
- Add analytics tracking for deep link usage
- Support deep linking to specific expert conversations
