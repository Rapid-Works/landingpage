import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sendTaskMessageNotification } from '../utils/taskNotificationService';
import { Bell, Send, User, UserCheck, Loader2, Search, Settings } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Test component for task message notifications
 * This component is for testing purposes only
 */
const TaskNotificationTest = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [testData, setTestData] = useState({
    taskId: 'test-task-123',
    senderEmail: currentUser?.email || 'expert@rapid-works.io',
    recipientEmail: currentUser?.email || 'client@example.com',
    message: 'Hello! I have reviewed your request and will provide an estimate shortly.'
  });

  const handleDirectNotificationTest = async () => {
    setLoading(true);
    setResult('');
    
    try {
      // Check notification permission first
      const permission = Notification.permission;
      console.log('🔔 Browser notification permission:', permission);
      
      const result = await sendTaskMessageNotification({
        taskId: testData.taskId,
        senderEmail: testData.senderEmail,
        senderRole: 'expert',
        recipientEmail: testData.recipientEmail,
        recipientRole: 'customer',
        messageContent: testData.message,
        messageType: 'message',
        taskData: {
          id: testData.taskId,
          title: 'Test Task - Brand Identity Design',
          status: 'pending'
        }
      });
      
      const status = result.hasTokens ? '✅ Push notification sent!' : '📝 Saved to history (no push tokens)';
      setResult(`🔔 Browser permission: ${permission}\n${status}\n\nDetails: ${JSON.stringify(result, null, 2)}`);
      
      // Try to show a test browser notification
      if (permission === 'granted' && result.hasTokens) {
        console.log('🧪 Attempting to show test browser notification...');
        try {
          new Notification('🧪 Test Notification', {
            body: 'If you see this, browser notifications are working!',
            icon: '/favicon.ico'
          });
        } catch (notifError) {
          console.error('❌ Failed to show test notification:', notifError);
        }
      }
      
    } catch (error) {
      setResult(`❌ Error sending notification: ${error.message}`);
      console.error('Notification test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEstimateNotificationTest = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const permission = Notification.permission;
      console.log('🔔 Browser notification permission (estimate):', permission);
      
      const result = await sendTaskMessageNotification({
        taskId: testData.taskId,
        senderEmail: testData.senderEmail,
        senderRole: 'expert',
        recipientEmail: testData.recipientEmail,
        recipientRole: 'customer',
        messageContent: 'Estimate: €2,500 for complete brand identity package',
        messageType: 'estimate',
        taskData: {
          id: testData.taskId,
          title: 'Test Task - Brand Identity Design',
          status: 'pending'
        }
      });
      
      const status = result.hasTokens ? '✅ Push notification sent!' : '📝 Saved to history (no push tokens)';
      setResult(`🔔 Browser permission: ${permission}\n${status}\n\nDetails: ${JSON.stringify(result, null, 2)}`);
      
      // Try to show a test browser notification
      if (permission === 'granted' && result.hasTokens) {
        console.log('🧪 Attempting to show test estimate notification...');
        try {
          new Notification('💰 Estimate Received', {
            body: 'Estimate: €2,500 for complete brand identity package',
            icon: '/favicon.ico'
          });
        } catch (notifError) {
          console.error('❌ Failed to show estimate notification:', notifError);
        }
      }
      
    } catch (error) {
      setResult(`❌ Error sending estimate notification: ${error.message}`);
      console.error('Estimate notification test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreationTest = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const permission = Notification.permission;
      console.log('🔔 Browser notification permission (task creation):', permission);
      
      const result = await sendTaskMessageNotification({
        taskId: testData.taskId,
        senderEmail: testData.recipientEmail,
        senderRole: 'customer',
        recipientEmail: testData.senderEmail,
        recipientRole: 'expert',
        messageContent: 'New task created: Brand Identity Design',
        messageType: 'task_created',
        taskData: {
          id: testData.taskId,
          title: 'Test Task - Brand Identity Design',
          status: 'pending'
        }
      });
      
      const status = result.hasTokens ? '✅ Push notification sent!' : '📝 Saved to history (no push tokens)';
      setResult(`🔔 Browser permission: ${permission}\n${status}\n\nDetails: ${JSON.stringify(result, null, 2)}`);
      
      // Try to show a test browser notification
      if (permission === 'granted' && result.hasTokens) {
        console.log('🧪 Attempting to show test task creation notification...');
        try {
          new Notification('📋 New Task Created', {
            body: 'New task created: Brand Identity Design',
            icon: '/favicon.ico'
          });
        } catch (notifError) {
          console.error('❌ Failed to show task creation notification:', notifError);
        }
      }
      
    } catch (error) {
      setResult(`❌ Error sending task creation notification: ${error.message}`);
      console.error('Task creation test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFCMTokens = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const tokensCollection = collection(db, 'fcmTokens');
      const userTokensQuery = query(tokensCollection, where('email', '==', currentUser?.email));
      const querySnapshot = await getDocs(userTokensQuery);
      
      const tokens = [];
      querySnapshot.forEach((doc) => {
        tokens.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || 'Unknown'
        });
      });
      
      setResult(`🔍 FCM Tokens for ${currentUser?.email}:\n\n${JSON.stringify(tokens, null, 2)}`);
    } catch (error) {
      setResult(`❌ Error checking FCM tokens: ${error.message}`);
      console.error('FCM token check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const enableNotifications = async () => {
    setLoading(true);
    setResult('');
    
    try {
      // Import the messaging service
      const { requestNotificationPermission } = await import('../firebase/messaging');
      const result = await requestNotificationPermission();
      
      if (result.success) {
        setResult(`✅ Notifications enabled successfully!\n\nToken: ${result.token}`);
      } else {
        setResult(`❌ Failed to enable notifications: ${result.reason}`);
      }
    } catch (error) {
      setResult(`❌ Error enabling notifications: ${error.message}`);
      console.error('Enable notifications error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || !currentUser.email?.endsWith('@rapid-works.io')) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
          <p className="text-gray-600">
            Task notification testing is only available for rapid-works.io administrators.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="h-6 w-6 text-[#7C3BEC]" />
        <h3 className="text-lg font-semibold text-gray-900">Task Notification Testing</h3>
      </div>

      {/* Current User Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Current User Info:</h4>
        <div className="text-sm text-blue-800">
          <p><strong>Email:</strong> {currentUser?.email || 'Not logged in'}</p>
          <p><strong>UID:</strong> {currentUser?.uid || 'N/A'}</p>
          <p><strong>Display Name:</strong> {currentUser?.displayName || 'N/A'}</p>
        </div>
      </div>

      {/* Test Configuration */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task ID
          </label>
          <input
            type="text"
            value={testData.taskId}
            onChange={(e) => setTestData({ ...testData, taskId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-[#7C3BEC] outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sender Email (Expert)
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={testData.senderEmail}
                onChange={(e) => setTestData({ ...testData, senderEmail: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-[#7C3BEC] outline-none"
              />
              <button
                onClick={() => setTestData({ ...testData, senderEmail: currentUser?.email || '' })}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm"
                title="Use current user email"
              >
                Me
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Email (Client)
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={testData.recipientEmail}
                onChange={(e) => setTestData({ ...testData, recipientEmail: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-[#7C3BEC] outline-none"
              />
              <button
                onClick={() => setTestData({ ...testData, recipientEmail: currentUser?.email || '' })}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm"
                title="Use current user email"
              >
                Me
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Message
          </label>
          <textarea
            value={testData.message}
            onChange={(e) => setTestData({ ...testData, message: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3BEC] focus:border-[#7C3BEC] outline-none"
          />
        </div>
      </div>

      {/* Test Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={handleDirectNotificationTest}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Test Message
        </button>

        <button
          onClick={handleEstimateNotificationTest}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <User className="h-4 w-4" />}
          Test Estimate
        </button>

        <button
          onClick={handleTaskCreationTest}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
          Test Task Creation
        </button>
      </div>

      {/* FCM Token Management */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-t pt-6">
        <button
          onClick={checkFCMTokens}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Check FCM Tokens
        </button>

        <button
          onClick={enableNotifications}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings className="h-4 w-4" />}
          Enable Notifications
        </button>

        <div className="flex items-center justify-center text-sm text-gray-600">
          <span>👆 Click to register for push notifications</span>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Test Result:</h4>
          <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto">
            {result}
          </pre>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">How Task Notifications Work:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• <strong>Push Notifications:</strong> Sent to mobile devices via FCM tokens (not email)</li>
          <li>• <strong>User Lookup:</strong> System finds user by email, then sends push notification</li>
          <li>• <strong>Requirements:</strong> Recipient must exist in Firebase Auth and have FCM token</li>
          <li>• <strong>Testing:</strong> Click "Me" buttons to use your current email for testing</li>
          <li>• <strong>Debugging:</strong> Check browser console and Firebase Functions logs</li>
          <li>• <strong>FCM Token:</strong> Enable notifications on blog page to register your device</li>
        </ul>
      </div>
    </div>
  );
};

export default TaskNotificationTest;
