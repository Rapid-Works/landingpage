import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { requestNotificationPermission } from '../firebase/messaging';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const NotificationDiagnostics = () => {
  const { currentUser } = useAuth();
  const [diagnostics, setDiagnostics] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    if (!currentUser?.email) {
      setDiagnostics({ error: 'Please log in to run diagnostics' });
      return;
    }

    setIsRunning(true);
    const results = {};

    try {
      // 1. Check browser notification permission
      results.browserPermission = {
        status: Notification.permission,
        supported: 'Notification' in window
      };

      // 2. Check if FCM tokens exist in database
      try {
        const tokensRef = collection(db, 'fcmTokens');
        const q = query(tokensRef, where('email', '==', currentUser.email));
        const tokensSnapshot = await getDocs(q);
        
        results.fcmTokens = {
          count: tokensSnapshot.size,
          tokens: tokensSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            tokenPreview: doc.data().token ? doc.data().token.substring(0, 20) + '...' : 'N/A'
          }))
        };
      } catch (error) {
        results.fcmTokens = { error: error.message };
      }

      // 3. Check Firebase Messaging registration
      try {
        const registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
        results.serviceWorker = {
          registered: !!registration,
          active: registration?.active?.state || 'unknown'
        };
      } catch (error) {
        results.serviceWorker = { error: error.message };
      }

      // 4. Test token generation
      if (Notification.permission === 'granted') {
        try {
          const result = await requestNotificationPermission();
          results.tokenGeneration = {
            success: result.success,
            token: result.token ? result.token.substring(0, 20) + '...' : null,
            reason: result.reason
          };
        } catch (error) {
          results.tokenGeneration = { error: error.message };
        }
      } else {
        results.tokenGeneration = { skipped: 'Permission not granted' };
      }

      setDiagnostics(results);
    } catch (error) {
      setDiagnostics({ error: error.message });
    } finally {
      setIsRunning(false);
    }
  };

  const forceRegisterNotifications = async () => {
    setIsRunning(true);
    try {
      const result = await requestNotificationPermission();
      if (result.success) {
        alert('✅ Notifications registered successfully! Run diagnostics again to verify.');
      } else {
        alert(`❌ Registration failed: ${result.reason}`);
      }
    } catch (error) {
      alert(`❌ Registration error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'good' || status === 'granted' || status === true) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else if (status === 'warning' || status === 'default') {
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    } else {
      return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <RefreshCw className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Notification Diagnostics</h3>
          <p className="text-sm text-gray-600">Check why push notifications aren't working</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium"
        >
          {isRunning ? 'Running Diagnostics...' : 'Run Diagnostics'}
        </button>

        <button
          onClick={forceRegisterNotifications}
          disabled={isRunning}
          className="ml-3 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium"
        >
          {isRunning ? 'Registering...' : 'Force Re-register'}
        </button>
      </div>

      {diagnostics && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Diagnostic Results:</h4>
          
          {diagnostics.error ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
              Error: {diagnostics.error}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Browser Permission */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Browser Permission</p>
                  <p className="text-sm text-gray-600">
                    Status: {diagnostics.browserPermission?.status || 'unknown'}
                    {!diagnostics.browserPermission?.supported && ' (Not supported)'}
                  </p>
                </div>
                {getStatusIcon(diagnostics.browserPermission?.status)}
              </div>

              {/* FCM Tokens */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">FCM Tokens in Database</p>
                  <p className="text-sm text-gray-600">
                    {diagnostics.fcmTokens?.error ? (
                      `Error: ${diagnostics.fcmTokens.error}`
                    ) : (
                      `Found ${diagnostics.fcmTokens?.count || 0} token(s) for ${currentUser.email}`
                    )}
                  </p>
                  {diagnostics.fcmTokens?.tokens?.map((token, index) => (
                    <p key={index} className="text-xs text-gray-500 mt-1">
                      Token {index + 1}: {token.tokenPreview}
                    </p>
                  ))}
                </div>
                {getStatusIcon(diagnostics.fcmTokens?.count > 0 ? 'good' : 'bad')}
              </div>

              {/* Service Worker */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Service Worker</p>
                  <p className="text-sm text-gray-600">
                    {diagnostics.serviceWorker?.error ? (
                      `Error: ${diagnostics.serviceWorker.error}`
                    ) : (
                      `Registered: ${diagnostics.serviceWorker?.registered ? 'Yes' : 'No'} | 
                       State: ${diagnostics.serviceWorker?.active}`
                    )}
                  </p>
                </div>
                {getStatusIcon(diagnostics.serviceWorker?.registered)}
              </div>

              {/* Token Generation */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Token Generation</p>
                  <p className="text-sm text-gray-600">
                    {diagnostics.tokenGeneration?.error ? (
                      `Error: ${diagnostics.tokenGeneration.error}`
                    ) : diagnostics.tokenGeneration?.skipped ? (
                      diagnostics.tokenGeneration.skipped
                    ) : (
                      `Success: ${diagnostics.tokenGeneration?.success ? 'Yes' : 'No'} | 
                       Token: ${diagnostics.tokenGeneration?.token || 'None'}`
                    )}
                  </p>
                </div>
                {getStatusIcon(diagnostics.tokenGeneration?.success)}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {diagnostics && !diagnostics.error && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">🔧 Recommendations:</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                {diagnostics.browserPermission?.status !== 'granted' && (
                  <li>• Enable browser notifications permission</li>
                )}
                {diagnostics.fcmTokens?.count === 0 && (
                  <li>• <strong>Main Issue:</strong> No FCM tokens found - click "Force Re-register" to fix this</li>
                )}
                {!diagnostics.serviceWorker?.registered && (
                  <li>• Service worker not registered - refresh the page</li>
                )}
                {diagnostics.fcmTokens?.count > 0 && diagnostics.browserPermission?.status === 'granted' && (
                  <li className="text-green-700">• ✅ Everything looks good! Test notifications should work.</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDiagnostics;
