import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { X, Bell } from 'lucide-react';
import { LanguageContext } from '../App';
import Cookies from 'js-cookie';
import { useSmartNotificationStatus } from '../hooks/useSmartNotificationStatus';
import { getMessaging, getToken } from 'firebase/messaging';
import { db, auth } from '../firebase/config';
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc } from 'firebase/firestore';

const VAPID_KEY = 'BC9X8U5hWzbbGbbB8x_net_q4eG5RA798jZxKcOPS5e5joRHXN7XcCS2yv-UwCKY0lZZ59mOOspl_aSWEjSV33M';

const CookieConsent = () => {
  const { language } = useContext(LanguageContext);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const [cookieSettings, setCookieSettings] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    notifications: true // Default to enabled
  });
  const { hasAnyNotificationsEnabled: isSubscribed, forceRefresh: checkSubscriptionStatus } = useSmartNotificationStatus();

  // Better notification permission handler without alerts
  const requestNotificationPermissionSilent = async () => {
    try {
      // Check if notifications are supported
      if (!('Notification' in window)) {
        console.log('Notifications not supported');
        return { success: false, reason: 'not_supported' };
      }

      // Check current permission state
      const permission = Notification.permission;
      
      // If already granted, try to get token
      if (permission === 'granted') {
        return await getNotificationToken();
      }
      
      // If already denied, don't request again
      if (permission === 'denied') {
        console.log('Notifications previously denied');
        return { success: false, reason: 'denied' };
      }

      // Request permission (permission is 'default')
      const newPermission = await Notification.requestPermission();
      
      if (newPermission === 'granted') {
        return await getNotificationToken();
      } else {
        console.log('User denied notification permission');
        return { success: false, reason: 'user_denied' };
      }
      
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return { success: false, reason: 'error', error };
    }
  };

  const getNotificationToken = async () => {
    try {
      const messaging = getMessaging();
      const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
      
      if (currentToken) {
        // Get current user email if available
        const currentUser = auth.currentUser;
        const userEmail = currentUser?.email || null;
        
        // Remove any existing tokens for this user/device to avoid duplicates
        if (userEmail) {
          const tokensCollection = collection(db, 'fcmTokens');
          const existingTokensQuery = query(tokensCollection, where('email', '==', userEmail));
          const existingTokensSnapshot = await getDocs(existingTokensQuery);
          
          // Delete existing tokens for this user
          const deletePromises = existingTokensSnapshot.docs.map(doc => deleteDoc(doc.ref));
          await Promise.all(deletePromises);
        }
        
        // Store the new token with user email
        const tokensCollection = collection(db, 'fcmTokens');
        await addDoc(tokensCollection, {
          token: currentToken,
          email: userEmail,
          createdAt: serverTimestamp(),
        });
        
        console.log('Successfully subscribed to notifications');
        return { success: true, token: currentToken };
      } else {
        console.log('No registration token available');
        return { success: false, reason: 'no_token' };
      }
    } catch (error) {
      console.error('Error getting notification token:', error);
      return { success: false, reason: 'token_error', error };
    }
  };

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = Cookies.get('cookie-consent');
    if (!cookieConsent) {
      setShowCookieConsent(true);
    } else {
      // Load saved preferences
      const savedSettings = Cookies.get('cookie-preferences');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setCookieSettings({
          ...parsedSettings,
          notifications: !!isSubscribed // Sync with smart notification status
        });
      } else {
        // If no saved settings, sync notifications with current status
        setCookieSettings(prev => ({
          ...prev,
          notifications: !!isSubscribed // Sync with smart notification status
        }));
      }
    }
  }, [!!isSubscribed]); // Ensure stable boolean dependency

  const content = {
    en: {
      banner: {
        title: "We use cookies",
        description: "We use cookies to improve your experience on our website and to show you personalized content. Some cookies are necessary for the website to function properly.",
        privacy: "You can find more information in our",
        privacyLink: "Privacy Policy",
        acceptAll: "Accept All",
        customize: "Customize"
      },
      modal: {
        title: "Cookie Settings",
        description: "Choose which cookies you want to accept. You can change these settings at any time.",
        necessary: {
          title: "Necessary Cookies",
          description: "These cookies are essential for the website to function properly and cannot be disabled."
        },
        analytics: {
          title: "Analytics Cookies", 
          description: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously."
        },
        marketing: {
          title: "Marketing Cookies",
          description: "These cookies are used by third parties to display personalized advertising that is relevant to your interests."
        },
        notifications: {
          title: "Push Notifications",
          description: "Get notified when your branding kits are ready, new blog posts are published, or important updates are available."
        },
        savePreferences: "Save Preferences",
        decline: "Decline All"
      }
    },
    de: {
      banner: {
        title: "Wir verwenden Cookies",
        description: "Wir verwenden Cookies, um deine Erfahrung auf unserer Website zu verbessern und dir personalisierte Inhalte zu zeigen. Einige Cookies sind notwendig, damit die Website ordnungsgemäß funktioniert.",
        privacy: "Weitere Informationen findest du in unserer",
        privacyLink: "Datenschutzerklärung",
        acceptAll: "Alle akzeptieren",
        customize: "Anpassen"
      },
      modal: {
        title: "Cookie-Einstellungen",
        description: "Wähle aus, welche Cookies du akzeptieren möchtest. Du kannst diese Einstellungen jederzeit ändern.",
        necessary: {
          title: "Notwendige Cookies",
          description: "Diese Cookies sind für das ordnungsgemäße Funktionieren der Website unerlässlich und können nicht deaktiviert werden."
        },
        analytics: {
          title: "Analyse-Cookies",
          description: "Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, indem sie Informationen anonym sammeln und melden."
        },
        marketing: {
          title: "Marketing-Cookies",
          description: "Diese Cookies werden von Dritten verwendet, um personalisierte Werbung anzuzeigen, die für deine Interessen relevant ist."
        },
        notifications: {
          title: "Push-Benachrichtigungen",
          description: "Erhalte Benachrichtigungen, wenn deine Branding-Kits fertig sind, neue Blog-Posts veröffentlicht werden oder wichtige Updates verfügbar sind."
        },
        savePreferences: "Präferenzen speichern",
        decline: "Alle ablehnen"
      }
    }
  };

  const currentContent = content[language] || content.en;
  const privacyUrl = language === 'en' ? '/privacy' : '/datenschutz';

  const handleAcceptAll = async () => {
    const settings = {
      necessary: true,
      analytics: true,
      marketing: true,
      notifications: true
    };
    
    // Handle notification subscription
    const permissionResult = await requestNotificationPermissionSilent();
    if (!permissionResult.success) {
      console.log('Notification subscription failed:', permissionResult.reason);
      settings.notifications = false;
    } else {
      console.log('Successfully subscribed to notifications');
      // DEVELOPMENT: Set mock FCM token in localStorage
      const currentUser = auth.currentUser;
      if (currentUser) {
        localStorage.setItem(`fcmToken_${currentUser.email}`, 'mock-fcm-token-' + Date.now());
      }
      checkSubscriptionStatus();
    }
    
    setCookieSettings(settings);
    Cookies.set('cookie-consent', 'accepted', { expires: 365 });
    Cookies.set('cookie-preferences', JSON.stringify(settings), { expires: 365 });
    setShowCookieConsent(false);
    setShowCookieSettings(false);
  };

  const handleSavePreferences = async () => {
    let finalSettings = { ...cookieSettings };
    
    // Handle notification subscription based on user choice
    if (cookieSettings.notifications && !isSubscribed) {
      const permissionResult = await requestNotificationPermissionSilent();
      if (!permissionResult.success) {
        console.log('Notification subscription failed:', permissionResult.reason);
        finalSettings.notifications = false;
      } else {
        console.log('Successfully subscribed to notifications');
        // DEVELOPMENT: Set mock FCM token in localStorage
        const currentUser = auth.currentUser;
        if (currentUser) {
          localStorage.setItem(`fcmToken_${currentUser.email}`, 'mock-fcm-token-' + Date.now());
        }
        checkSubscriptionStatus();
      }
    }
    
    Cookies.set('cookie-consent', 'customized', { expires: 365 });
    Cookies.set('cookie-preferences', JSON.stringify(finalSettings), { expires: 365 });
    setCookieSettings(finalSettings);
    setShowCookieConsent(false);
    setShowCookieSettings(false);
  };

  const handleDeclineAll = () => {
    const settings = {
      necessary: true,
      analytics: false,
      marketing: false,
      notifications: false
    };
    setCookieSettings(settings);
    Cookies.set('cookie-consent', 'declined', { expires: 365 });
    Cookies.set('cookie-preferences', JSON.stringify(settings), { expires: 365 });
    setShowCookieConsent(false);
    setShowCookieSettings(false);
  };

  const handleToggleSetting = (setting) => {
    if (setting === 'necessary') return; // Cannot toggle necessary cookies
    
    setCookieSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // Cookie Settings Modal
  const CookieSettingsModal = () => {
    if (!showCookieSettings) return null;

    return (
      <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentContent.modal.title}
                </h2>
                <p className="text-gray-600">
                  {currentContent.modal.description}
                </p>
              </div>
              <button 
                onClick={() => setShowCookieSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Necessary Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {currentContent.modal.necessary.title}
                  </h3>
                  <div className="bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-sm text-gray-600">Always On</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {currentContent.modal.necessary.description}
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {currentContent.modal.analytics.title}
                  </h3>
                  <button
                    onClick={() => handleToggleSetting('analytics')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      cookieSettings.analytics ? 'bg-[#7C3BEC]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        cookieSettings.analytics ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {currentContent.modal.analytics.description}
                </p>
              </div>

              {/* Marketing Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {currentContent.modal.marketing.title}
                  </h3>
                  <button
                    onClick={() => handleToggleSetting('marketing')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      cookieSettings.marketing ? 'bg-[#7C3BEC]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        cookieSettings.marketing ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {currentContent.modal.marketing.description}
                </p>
              </div>

              {/* Push Notifications */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-purple-50 to-indigo-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">
                      {currentContent.modal.notifications.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleToggleSetting('notifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      cookieSettings.notifications ? 'bg-[#7C3BEC]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        cookieSettings.notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {currentContent.modal.notifications.description}
                </p>
                {isSubscribed && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Currently subscribed
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={handleSavePreferences}
                className="flex-1 px-8 py-4 bg-[#7C3BEC] hover:bg-[#6B2BD1] text-white rounded-lg font-medium text-base transition-colors"
              >
                {currentContent.modal.savePreferences}
              </button>
              <button 
                onClick={handleDeclineAll}
                className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-medium text-base transition-colors"
              >
                {currentContent.modal.decline}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Cookie Consent Banner
  const CookieBanner = () => {
    if (!showCookieConsent) return null;

    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200">
        <div className="max-w-none mx-auto px-8 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex-1 text-base text-gray-700 space-y-3">
              <p>
                <strong>{currentContent.banner.title}</strong>
              </p>
              <p>
                {currentContent.banner.description}
              </p>
              <p>
                {currentContent.banner.privacy}{' '}
                <Link to={privacyUrl} className="text-[#7C3BEC] hover:text-[#6B2BD1] underline">
                  {currentContent.banner.privacyLink}
                </Link>.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto lg:flex-shrink-0">
              <button 
                onClick={handleAcceptAll}
                className="px-8 py-4 bg-[#7C3BEC] hover:bg-[#6B2BD1] text-white rounded-lg font-medium text-base transition-colors whitespace-nowrap"
              >
                {currentContent.banner.acceptAll}
              </button>
              <button 
                onClick={() => setShowCookieSettings(true)}
                className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-medium text-base transition-colors whitespace-nowrap"
              >
                {currentContent.banner.customize}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <CookieBanner />
      <CookieSettingsModal />
    </>
  );
};

export default CookieConsent; 