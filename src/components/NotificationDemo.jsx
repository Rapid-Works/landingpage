import React, { useState, useEffect } from 'react';
import multiChannelNotificationService, { NotificationTemplates } from '../utils/multiChannelNotificationService';
import { useAuth } from '../contexts/AuthContext';

const NotificationDemo = () => {
  const { currentUser } = useAuth();
  const [capabilities, setCapabilities] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadCapabilities();
    }
  }, [currentUser]);

  const loadCapabilities = async () => {
    try {
      const caps = multiChannelNotificationService.getCapabilities();
      setCapabilities(caps);
    } catch (error) {
      console.error('Failed to load capabilities:', error);
    }
  };

  const testNotification = async (template, urgent = false) => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const notification = {
        ...NotificationTemplates[template],
        urgent,
        data: { taskId: 'demo-task-123' },
        actionUrl: '/dashboard',
        type: 'taskUpdates'
      };

      const results = await multiChannelNotificationService.sendNotification(notification);
      setTestResults(prev => [...prev, {
        timestamp: new Date(),
        template,
        results,
        success: results.some(r => r.success !== false)
      }]);
    } catch (error) {
      console.error('Test notification failed:', error);
      setTestResults(prev => [...prev, {
        timestamp: new Date(),
        template,
        error: error.message,
        success: false
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Please log in to test notifications</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Platform Capabilities */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">📱 Your Platform Capabilities</h3>
        {capabilities && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Platform:</span>
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {capabilities.platform}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Web Push:</span>
              <span className={`px-2 py-1 rounded ${capabilities.webPush ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {capabilities.webPush ? '✅ Supported' : '❌ Not Supported'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Email:</span>
              <span className="px-2 py-1 rounded bg-green-100 text-green-800">
                ✅ Supported
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Real-time (WebSocket):</span>
              <span className={`px-2 py-1 rounded ${capabilities.webSocket ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {capabilities.webSocket ? '✅ Supported' : '❌ Not Supported'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Reliability Score:</span>
              <span className="font-bold text-lg">
                {capabilities.reliabilityScore}%
              </span>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {capabilities?.recommendations && (
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <h4 className="font-medium text-blue-900 mb-2">💡 Recommendations:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {capabilities.recommendations.map((rec, index) => (
                <li key={index}>• {rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Test Notifications */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">🧪 Test Notifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => testNotification('TASK_COMPLETED')}
            disabled={loading}
            className="p-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Test Task Completed
          </button>
          <button
            onClick={() => testNotification('TASK_UPDATE')}
            disabled={loading}
            className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Test Task Update
          </button>
          <button
            onClick={() => testNotification('URGENT_TASK', true)}
            disabled={loading}
            className="p-3 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            Test Urgent Notification
          </button>
          <button
            onClick={() => testNotification('PAYMENT_RECEIVED')}
            disabled={loading}
            className="p-3 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            Test Payment Received
          </button>
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">📊 Test Results</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className={`p-3 rounded border-l-4 ${result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">{result.template}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      {result.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {result.success ? 'Success' : 'Failed'}
                  </span>
                </div>
                {result.error && (
                  <p className="text-sm text-red-600 mt-1">{result.error}</p>
                )}
                {result.results && (
                  <div className="text-sm text-gray-600 mt-1">
                    Channels attempted: {result.results.length}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDemo;
