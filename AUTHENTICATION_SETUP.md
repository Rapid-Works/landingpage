# Firebase Authentication Setup Guide

This project now includes a complete Firebase Authentication system with email/password and Google sign-in functionality. Follow this guide to set up and use the authentication system.

## 🚀 Features

- **Email/Password Authentication**: Users can sign up and log in with email and password
- **Google Authentication**: One-click sign-in with Google
- **Password Reset**: Forgot password functionality via email
- **Protected Routes**: Secure pages that require authentication
- **User Dashboard**: Personalized dashboard for authenticated users
- **Navigation Integration**: Login/logout functionality in the navigation bar
- **Mobile Responsive**: Works perfectly on all devices

## 📋 Setup Instructions

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" and follow the setup wizard
3. Once created, go to your project dashboard

### 2. Enable Authentication

1. In the Firebase Console, navigate to **Authentication** > **Sign-in method**
2. Enable the following providers:
   - **Email/Password**: Click to enable
   - **Google**: Click to enable and configure OAuth consent screen

### 3. Configure Web App

1. In the Firebase Console, go to **Project Settings** (gear icon)
2. In the "Your apps" section, click "Add app" and select the web icon (`</>`)
3. Register your app with a nickname
4. Copy the Firebase configuration object

### 4. Set Up Environment Variables

1. Create a `.env` file in your project root (use the `firebase-config.txt` as a template)
2. Add your Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 5. Configure Google OAuth (Optional)

If you want to use Google sign-in:

1. Go to the [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (or create one)
3. Navigate to **APIs & Services** > **Credentials**
4. Create OAuth 2.0 Client IDs for your web application
5. Add your domain to authorized origins

### 6. Set Up Firebase Security Rules

In the Firebase Console, go to **Firestore Database** > **Rules** and configure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Add other collection rules as needed
  }
}
```

## 🔄 How to Use

### Available Routes

- `/login` - Login page
- `/signup` - Registration page  
- `/forgot-password` - Password reset page
- `/dashboard` - Protected user dashboard
- All other existing routes remain the same

### Authentication Context

The `AuthContext` provides the following methods:

```javascript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { 
    currentUser,        // Current authenticated user object
    signup,            // (email, password) => Promise
    login,             // (email, password) => Promise
    loginWithGoogle,   // () => Promise
    logout,            // () => Promise
    resetPassword,     // (email) => Promise
    updateUserProfile  // (user, profile) => Promise
  } = useAuth();
}
```

### Protected Routes

To protect a route, wrap it with `ProtectedRoute`:

```javascript
import ProtectedRoute from './components/ProtectedRoute';

<Route path="/protected" element={
  <ProtectedRoute>
    <YourProtectedComponent />
  </ProtectedRoute>
} />
```

### Navigation Integration

The navigation bar automatically shows:
- **Not authenticated**: "Sign In" and "Sign Up" buttons
- **Authenticated**: User menu with Dashboard and Sign Out options

## 🎨 Customization

### Styling

All authentication components use Tailwind CSS and are fully customizable:

- `LoginPage.jsx` - Login form component
- `SignupPage.jsx` - Registration form component
- `Dashboard.jsx` - User dashboard component
- `ForgotPassword.jsx` - Password reset component

### Email Templates

You can customize Firebase email templates in the Console:
1. Go to **Authentication** > **Templates**
2. Customize the email templates for:
   - Email verification
   - Password reset
   - Email address change

### User Data

To store additional user data, use Firestore:

```javascript
import { db } from './firebase/config';
import { doc, setDoc } from 'firebase/firestore';

// Save user data
await setDoc(doc(db, 'users', user.uid), {
  email: user.email,
  displayName: user.displayName,
  createdAt: new Date(),
  // Add custom fields
});
```

## 🛡️ Security Best Practices

1. **Environment Variables**: Never commit your `.env` file to version control
2. **Firebase Rules**: Always set up proper Firestore security rules
3. **User Validation**: Validate user input on both client and server
4. **HTTPS**: Always use HTTPS in production
5. **Email Verification**: Consider requiring email verification for new accounts

## 🚨 Troubleshooting

### Common Issues

1. **"Firebase not initialized"**
   - Check your environment variables
   - Ensure all Firebase config values are correct

2. **Google Sign-in not working**
   - Verify OAuth configuration in Google Cloud Console
   - Check authorized domains in Firebase Authentication settings

3. **User not persisting after refresh**
   - This is normal behavior - Firebase handles authentication state
   - The `AuthContext` manages loading state during auth check

### Debug Tips

1. Check browser console for error messages
2. Verify Firebase project settings
3. Test authentication in Firebase Console
4. Check network requests in browser dev tools

## 🔗 Useful Links

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

## 📞 Support

If you encounter any issues:
1. Check the Firebase Console for error logs
2. Review the browser console for JavaScript errors
3. Verify your Firebase project configuration
4. Ensure all required environment variables are set

## 🚀 Next Steps

Consider implementing:
- Email verification for new accounts
- Role-based access control
- Social login with other providers (Facebook, Twitter, etc.)
- Two-factor authentication
- Account management (change password, delete account)
- User profile management with file uploads

Happy coding! 🎉 