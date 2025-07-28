import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Bell, Mail, Smartphone, Save, Loader2, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const NotificationSettingsModal = ({ isOpen, onClose, onPreferencesSaved }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Default settings - both mobile and email enabled for all notification types
  const [settings, setSettings] = useState({
    blogNotifications: {
      mobile: true,
      email: true
    },
    brandingKitReady: {
      mobile: true,
      email: true
    }
  });

  // Notification types configuration
  const notificationTypes = [
    {
      id: 'blogNotifications',
      label: 'New Blog Posts',
      description: 'Get notified when we publish new blog articles',
      icon: <Bell className="h-5 w-5 text-blue-500" />
    },
    {
      id: 'brandingKitReady',
      label: 'Branding Kit Ready',
      description: 'Get notified when your branding kits are completed',
      icon: <Check className="h-5 w-5 text-green-500" />
    }
  ];

  // Load user's notification preferences
  useEffect(() => {
    if (isOpen && currentUser) {
      loadUserPreferences();
    }
  }, [isOpen, currentUser]);

  const loadUserPreferences = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Try Firestore first (authoritative source)
      const docRef = doc(db, 'userNotificationPreferences', currentUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const firestorePrefs = data.preferences || settings;
        setSettings(firestorePrefs);
        console.log('📊 Loaded preferences from Firestore:', firestorePrefs);
        
        // Sync to localStorage for client-side status
        localStorage.setItem(`notificationPreferences_${currentUser.uid}`, JSON.stringify(firestorePrefs));
      } else {
        // Fallback to localStorage if no Firestore document
        const localPrefs = localStorage.getItem(`notificationPreferences_${currentUser.uid}`);
        if (localPrefs) {
          const parsedPrefs = JSON.parse(localPrefs);
          setSettings(parsedPrefs);
          console.log('📱 No Firestore prefs, using localStorage:', parsedPrefs);
        } else {
          console.log('❌ No preferences found anywhere, using defaults');
        }
      }
    } catch (error) {
      console.log('⚠️ Error loading from Firestore, trying localStorage:', error);
      // Fallback to localStorage
      const localPrefs = localStorage.getItem(`notificationPreferences_${currentUser.uid}`);
      if (localPrefs) {
        try {
          setSettings(JSON.parse(localPrefs));
          console.log('📱 Loaded fallback preferences from localStorage');
        } catch (parseError) {
          console.log('⚠️ Error parsing localStorage preferences, using defaults');
        }
      }
    }
    
    setLoading(false);
  };

  const savePreferences = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // Save to both Firestore AND localStorage
      console.log('💾 Saving preferences to Firestore AND localStorage:', settings);
      
      // Save to Firestore (for server-side functions)
      const docRef = doc(db, 'userNotificationPreferences', currentUser.uid);
      await setDoc(docRef, {
        userId: currentUser.uid,
        email: currentUser.email,
        preferences: settings,
        updatedAt: serverTimestamp()
      });
      console.log('✅ Saved to Firestore successfully');
      
      // Also save to localStorage (for client-side status)
      localStorage.setItem(`notificationPreferences_${currentUser.uid}`, JSON.stringify(settings));
      console.log('✅ Saved to localStorage successfully');
      
      setSuccess('✅ Notification preferences saved!');
    } catch (error) {
      console.log('⚠️ Firestore failed, saving to localStorage only:', error);
      // Fallback to localStorage only
      localStorage.setItem(`notificationPreferences_${currentUser.uid}`, JSON.stringify(settings));
      setSuccess('✅ Notification preferences saved locally!');
    }
    
    // Notify parent component to refresh notification status
    if (onPreferencesSaved) {
      console.log('💾 Preferences saved, triggering status refresh...');
      onPreferencesSaved();
    }
    
    // Auto-close success message after 3 seconds
    setTimeout(() => {
      setSuccess('');
    }, 3000);
    
    setSaving(false);
  };

  const handleToggle = (notificationType, method) => {
    setSettings(prev => ({
      ...prev,
      [notificationType]: {
        ...prev[notificationType],
        [method]: !prev[notificationType][method]
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl w-full max-w-2xl mx-auto shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#7C3BEC]/10 rounded-lg">
                  <Settings className="h-6 w-6 text-[#7C3BEC]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Notification Settings</h2>
                  <p className="text-sm text-gray-500">Manage how you receive notifications</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#7C3BEC]" />
                  <span className="ml-3 text-gray-600">Loading your preferences...</span>
                </div>
              ) : (
                <>
                  {/* Settings Table */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="overflow-hidden">
                      {/* Table Header */}
                      <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-200 mb-4">
                        <div className="font-semibold text-gray-700">Notification Type</div>
                        <div className="flex items-center justify-center gap-2 font-semibold text-gray-700">
                          <Smartphone className="h-4 w-4" />
                          Mobile Push
                        </div>
                        <div className="flex items-center justify-center gap-2 font-semibold text-gray-700">
                          <Mail className="h-4 w-4" />
                          Email
                        </div>
                      </div>

                      {/* Table Rows */}
                      {notificationTypes.map((type) => (
                        <div key={type.id} className="grid grid-cols-3 gap-4 py-4 border-b border-gray-100 last:border-b-0">
                          {/* Notification Type */}
                          <div className="flex items-start gap-3">
                            {type.icon}
                            <div>
                              <h3 className="font-medium text-gray-900">{type.label}</h3>
                              <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                            </div>
                          </div>

                          {/* Mobile Checkbox */}
                          <div className="flex items-center justify-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings[type.id]?.mobile || false}
                                onChange={() => handleToggle(type.id, 'mobile')}
                                className="sr-only peer"
                              />
                              <div className="w-6 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7C3BEC]/20 rounded border-2 border-gray-300 peer-checked:bg-[#7C3BEC] peer-checked:border-[#7C3BEC] transition-all duration-200">
                                <Check className={`h-4 w-4 text-white absolute top-0.5 left-0.5 transition-opacity duration-200 ${settings[type.id]?.mobile ? 'opacity-100' : 'opacity-0'}`} />
                              </div>
                            </label>
                          </div>

                          {/* Email Checkbox */}
                          <div className="flex items-center justify-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings[type.id]?.email || false}
                                onChange={() => handleToggle(type.id, 'email')}
                                className="sr-only peer"
                              />
                              <div className="w-6 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7C3BEC]/20 rounded border-2 border-gray-300 peer-checked:bg-[#7C3BEC] peer-checked:border-[#7C3BEC] transition-all duration-200">
                                <Check className={`h-4 w-4 text-white absolute top-0.5 left-0.5 transition-opacity duration-200 ${settings[type.id]?.email ? 'opacity-100' : 'opacity-0'}`} />
                              </div>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Messages */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                      {error}
                    </div>
                  )}

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4"
                    >
                      {success}
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={savePreferences}
                      disabled={saving}
                      className="flex-1 bg-[#7C3BEC] hover:bg-[#6B32D6] text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Preferences
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default NotificationSettingsModal; 