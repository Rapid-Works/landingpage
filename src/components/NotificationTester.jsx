import React, { useState } from 'react';
import { Bell, Send, CheckCircle, AlertTriangle, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import customerNotificationService from '../utils/customerNotificationService';
import NotificationDiagnostics from './NotificationDiagnostics';

const NotificationTester = () => {
  const { currentUser } = useAuth();
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [isHealthCheck, setIsHealthCheck] = useState(false);

  const addTestResult = (result) => {
    setTestResults(prev => [
      { ...result, timestamp: new Date().toLocaleTimeString() },
      ...prev.slice(0, 4) // Keep only last 5 results
    ]);
  };

  const runNotificationTest = async () => {
    if (!currentUser?.email) {
      addTestResult({
        type: 'error',
        message: 'Please log in to test notifications'
      });
      return;
    }

    setIsTesting(true);
    
    try {
      // First check if notifications are enabled
      console.log('🔔 Starting notification test...');
      
      const status = await customerNotificationService.ensureNotificationsEnabled();
      console.log('Permission status:', status);
      
      if (!status.enabled) {
        addTestResult({
          type: 'warning',
          message: `Notifications not enabled: ${status.reason}`
        });
        setIsTesting(false);
        return;
      }

      addTestResult({
        type: 'success',
        message: 'Notifications enabled ✅'
      });

      // Send test notification
      console.log('📤 Sending test notification...');
      const testResult = await customerNotificationService.sendTestNotification(currentUser.email);
      console.log('Test result:', testResult);
      
      if (testResult.success) {
        addTestResult({
          type: 'success',
          message: 'Test notification sent successfully! Check your browser for the notification.'
        });
      } else {
        addTestResult({
          type: 'error',
          message: `Test failed: ${testResult.reason}`
        });
      }

    } catch (error) {
      console.error('Notification test failed:', error);
      addTestResult({
        type: 'error',
        message: `Test failed: ${error.message}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const performHealthCheck = async () => {
    setIsHealthCheck(true);

    try {
      const healthResults = await customerNotificationService.performNotificationHealthCheck();

      // Add individual test results
      addTestResult({
        type: healthResults.browserSupport ? 'success' : 'error',
        message: `Browser Support: ${healthResults.browserSupport ? '✅ Supported' : '❌ Not supported'}`
      });

      addTestResult({
        type: healthResults.serviceWorker ? 'success' : 'error',
        message: `Service Worker: ${healthResults.serviceWorker ? '✅ Registered' : '❌ Not registered'}`
      });

      addTestResult({
        type: healthResults.permission === 'granted' ? 'success' :
             healthResults.permission === 'denied' ? 'error' : 'warning',
        message: `Permission: ${healthResults.permission === 'granted' ? '✅ Granted' :
                               healthResults.permission === 'denied' ? '❌ Denied' : '⚠️ Default'}`
      });

      addTestResult({
        type: healthResults.token ? 'success' : 'error',
        message: `FCM Token: ${healthResults.token ? '✅ Generated' : '❌ Failed'}`
      });

      addTestResult({
        type: healthResults.database ? 'success' : 'error',
        message: `Database: ${healthResults.database ? '✅ Connected' : '❌ Disconnected'}`
      });

      // Overall result
      addTestResult({
        type: healthResults.overall ? 'success' : 'error',
        message: `Overall Health: ${healthResults.overall ? '✅ All systems operational' : '❌ Issues detected'}`
      });

      if (healthResults.error) {
        addTestResult({
          type: 'error',
          message: `Health Check Error: ${healthResults.error}`
        });
      }

    } catch (error) {
      console.error('Health check failed:', error);
      addTestResult({
        type: 'error',
        message: `Health check failed: ${error.message}`
      });
    } finally {
      setIsHealthCheck(false);
    }
  };

  const simulateTaskUpdate = async () => {
    if (!currentUser?.email) {
      addTestResult({
        type: 'error',
        message: 'Please log in to test task notifications'
      });
      return;
    }

    setIsTesting(true);
    
    try {
      // Simulate a task submission notification
      const mockTaskData = {
        id: 'demo-task-' + Date.now(),
        taskName: 'Demo Task for Testing Notifications',
        status: 'pending'
      };

      const result = await customerNotificationService.sendTaskSubmittedNotification(
        mockTaskData,
        currentUser.email
      );

      if (result.success) {
        addTestResult({
          type: 'success',
          message: 'Task submission notification sent! 🎉'
        });
      } else {
        addTestResult({
          type: 'error',
          message: `Task notification failed: ${result.reason}`
        });
      }

    } catch (error) {
      console.error('Task notification test failed:', error);
      addTestResult({
        type: 'error',
        message: `Task notification failed: ${error.message}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Notification Tester
          </h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-6">
          Test push notifications to ensure they're working correctly for task updates.
        </p>

        <div className="space-y-3">
          <button
            onClick={runNotificationTest}
            disabled={isTesting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
          >
            <Send className="h-4 w-4" />
            {isTesting ? 'Testing...' : 'Test Basic Notification'}
          </button>

          <button
            onClick={simulateTaskUpdate}
            disabled={isTesting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors"
          >
            <CheckCircle className="h-4 w-4" />
            {isTesting ? 'Testing...' : 'Test Task Notification'}
          </button>

          <button
            onClick={performHealthCheck}
            disabled={isHealthCheck}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg font-medium transition-colors"
          >
            <Bell className="h-4 w-4" />
            {isHealthCheck ? 'Checking...' : 'Health Check'}
          </button>

          <button
            onClick={() => setShowDiagnostics(!showDiagnostics)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
          >
            <Settings className="h-4 w-4" />
            {showDiagnostics ? 'Hide' : 'Show'} Diagnostics
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Test Results:</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg text-sm ${
                    result.type === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : result.type === 'warning'
                      ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {result.type === 'success' ? (
                      <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p>{result.message}</p>
                      <p className="text-xs opacity-75 mt-1">{result.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> Make sure to enable notifications when prompted. 
            You should see both an in-app toast and a browser notification.
          </p>
        </div>
      </div>

      {showDiagnostics && (
        <NotificationDiagnostics />
      )}
    </div>
  );
};

export default NotificationTester;
