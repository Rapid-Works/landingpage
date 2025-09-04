const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {onCall} = require("firebase-functions/v2/https");
const {onDocumentUpdated} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const {GoogleGenerativeAI} = require("@google/generative-ai");
const nodemailer = require("nodemailer");

admin.initializeApp();

const db = admin.firestore();

// Email Configuration from environment variables
const emailConfig = {
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // Microsoft 365 email
    pass: process.env.SMTP_PASSWORD // Microsoft 365 password
  },
  tls: {
    ciphers: 'SSLv3'
  }
};

// Fallback to Gmail if Microsoft 365 SMTP is disabled
const gmailConfig = {
  service: 'gmail',
  auth: {
    user: 'noreplyrapidworks@gmail.com',
    pass: 'lipl ggum cmef bjpp' // Temporary fallback
  }
};

// Create email transporter
const emailTransporter = nodemailer.createTransport(emailConfig);

// Email Verification Template
const createEmailVerificationTemplate = (verificationLink, userName = '') => {
  const t = emailTranslations.en.emailVerification;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.subject}</title>
      <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #7C3BEC 0%, #6B32D6 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; }
        .header p { color: #e0d4f7; margin: 10px 0 0 0; font-size: 16px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; color: #2d3748; margin-bottom: 20px; font-weight: 600; }
        .message { font-size: 16px; color: #4a5568; line-height: 1.6; margin-bottom: 30px; }
        .button-container { text-align: center; margin: 40px 0; }
        .verify-button { 
          display: inline-block; 
          background: linear-gradient(135deg, #7C3BEC 0%, #6B32D6 100%); 
          color: #ffffff; 
          text-decoration: none; 
          padding: 16px 32px; 
          border-radius: 8px; 
          font-weight: bold; 
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(124, 59, 236, 0.3);
        }
        .verify-button:hover { background: linear-gradient(135deg, #6B32D6 0%, #5a2bb8 100%); }
        .expiry-notice { font-size: 14px; color: #718096; text-align: center; margin: 20px 0; }
        .ignore-notice { font-size: 14px; color: #718096; margin: 30px 0; }
        .footer { background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
        .footer-text { font-size: 12px; color: #a0aec0; margin-bottom: 10px; }
        .copyright { font-size: 12px; color: #a0aec0; }
        @media only screen and (max-width: 600px) {
          .content { padding: 30px 20px; }
          .header { padding: 30px 20px; }
          .verify-button { padding: 14px 28px; font-size: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>RapidWorks</h1>
          <p>${t.headerSubtitle}</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            ${t.greetingText}${userName ? ' ' + userName + '!' : ''}
          </div>
          
          <div class="message">
            ${t.bodyText}
          </div>
          
          <div class="button-container">
            <a href="${verificationLink}" class="verify-button">${t.buttonText}</a>
          </div>
          
          <div class="expiry-notice">
            ⏰ ${t.expiryText}
          </div>
          
          <div class="ignore-notice">
            ${t.ignoreText}
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-text">${t.footerText}</div>
          <div class="copyright">${t.copyrightText}</div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Password Reset Email Template
const createPasswordResetEmailTemplate = (resetLink, userName = '') => {
  const t = emailTranslations.en.passwordReset;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.subject}</title>
      <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #7C3BEC 0%, #6B32D6 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; }
        .header p { color: #e0d4f7; margin: 10px 0 0 0; font-size: 16px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; color: #2d3748; margin-bottom: 20px; }
        .message { font-size: 16px; color: #4a5568; line-height: 1.6; margin-bottom: 30px; }
        .button-container { text-align: center; margin: 40px 0; }
        .reset-button { 
          display: inline-block; 
          background: linear-gradient(135deg, #7C3BEC 0%, #6B32D6 100%); 
          color: #ffffff; 
          text-decoration: none; 
          padding: 16px 32px; 
          border-radius: 8px; 
          font-weight: bold; 
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(124, 59, 236, 0.3);
        }
        .reset-button:hover { background: linear-gradient(135deg, #6B32D6 0%, #5a2bb8 100%); }
        .expiry-notice { font-size: 14px; color: #718096; text-align: center; margin: 20px 0; }
        .ignore-notice { font-size: 14px; color: #718096; margin: 30px 0; }
        .footer { background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
        .footer-text { font-size: 12px; color: #a0aec0; margin-bottom: 10px; }
        .copyright { font-size: 12px; color: #a0aec0; }
        @media only screen and (max-width: 600px) {
          .content { padding: 30px 20px; }
          .header { padding: 30px 20px; }
          .reset-button { padding: 14px 28px; font-size: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>RapidWorks</h1>
          <p>${t.headerSubtitle}</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            ${t.greetingText}${userName ? ' ' + userName : ''}
          </div>
          
          <div class="message">
            ${t.bodyText}
          </div>
          
          <div class="button-container">
            <a href="${resetLink}" class="reset-button">${t.buttonText}</a>
          </div>
          
          <div class="expiry-notice">
            ⏰ ${t.expiryText}
          </div>
          
          <div class="ignore-notice">
            ${t.ignoreText}
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-text">${t.footerText}</div>
          <div class="copyright">${t.copyrightText}</div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Email Translation Strings
const emailTranslations = {
  en: {
    emailVerification: {
      subject: "✅ Verify Your RapidWorks Email Address",
      headerSubtitle: "Email Verification Required",
      greetingText: "Welcome to RapidWorks!",
      bodyText: "Please verify your email address to complete your account setup. Click the button below to verify your email:",
      buttonText: "Verify Email Address",
      expiryText: "This verification link will expire in 1 hour for security reasons.",
      ignoreText: "If you didn't create a RapidWorks account, you can safely ignore this email.",
      footerText: "You're receiving this because you signed up for a RapidWorks account.",
      copyrightText: "© 2024 RapidWorks. All rights reserved."
    },
    passwordReset: {
      subject: "🔐 Reset Your RapidWorks Password",
      headerSubtitle: "Password Reset Request",
      greetingText: "Hello,",
      bodyText: "You requested to reset your password for your RapidWorks account. Click the button below to set a new password:",
      buttonText: "Reset Password",
      expiryText: "This link will expire in 1 hour for security reasons.",
      ignoreText: "If you didn't request this password reset, you can safely ignore this email.",
      footerText: "You're receiving this because a password reset was requested for your account.",
      copyrightText: "© 2024 RapidWorks. All rights reserved."
    },
    taskUpdate: {
      subject: "📋 Task Update: {taskName}",
      headerSubtitle: "Task Update Notification",
      buttonText: "View Dashboard",
      footerText: "You're receiving this because you have notifications enabled for task updates.",
      copyrightText: "© 2024 RapidWorks. All rights reserved."
    },
    taskCompleted: {
      subject: "✅ Task Completed: {taskName}",
      headerSubtitle: "Task Completed!",
      completedText: "Your task has been completed successfully!",
      estimateLabel: "Estimated completion time:",
      buttonText: "View Results",
      footerText: "You're receiving this because you have notifications enabled for task updates.",
      copyrightText: "© 2024 RapidWorks. All rights reserved."
    },
    expertMessage: {
      subject: "💬 New Message from {expertName}",
      headerSubtitle: "New Expert Message",
      fromLabel: "From:",
      buttonText: "Reply in Dashboard",
      footerText: "You're receiving this because you have notifications enabled for task messages.",
      copyrightText: "© 2024 RapidWorks. All rights reserved."
    }
  },
  de: {
    taskUpdate: {
      subject: "📋 Aufgaben-Update: {taskName}",
      headerSubtitle: "Aufgaben-Update Benachrichtigung",
      buttonText: "Dashboard anzeigen",
      footerText: "Sie erhalten diese E-Mail, weil Sie Benachrichtigungen für Aufgaben-Updates aktiviert haben.",
      copyrightText: "© 2024 RapidWorks. Alle Rechte vorbehalten."
    },
    taskCompleted: {
      subject: "✅ Aufgabe abgeschlossen: {taskName}",
      headerSubtitle: "Aufgabe abgeschlossen!",
      completedText: "Ihre Aufgabe wurde erfolgreich abgeschlossen!",
      estimateLabel: "Geschätzte Bearbeitungszeit:",
      buttonText: "Ergebnisse anzeigen",
      footerText: "Sie erhalten diese E-Mail, weil Sie Benachrichtigungen für Aufgaben-Updates aktiviert haben.",
      copyrightText: "© 2024 RapidWorks. Alle Rechte vorbehalten."
    },
    expertMessage: {
      subject: "💬 Neue Nachricht von {expertName}",
      headerSubtitle: "Neue Experten-Nachricht",
      fromLabel: "Von:",
      buttonText: "Im Dashboard antworten",
      footerText: "Sie erhalten diese E-Mail, weil Sie Benachrichtigungen für Aufgaben-Nachrichten aktiviert haben.",
      copyrightText: "© 2024 RapidWorks. Alle Rechte vorbehalten."
    }
  }
};

// Email Templates with Language Support
const emailTemplates = {
  taskUpdate: (taskName, message, dashboardUrl, language = 'en') => {
    const t = emailTranslations[language] || emailTranslations['en'];
    return {
      subject: t.taskUpdate.subject.replace('{taskName}', taskName),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">RapidWorks</h1>
            <p style="color: white; margin: 5px 0 0 0; opacity: 0.9;">${t.taskUpdate.headerSubtitle}</p>
          </div>
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">📋 ${taskName}</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
              <p style="margin: 0; color: #555; line-height: 1.6;">${message}</p>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${dashboardUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">${t.taskUpdate.buttonText}</a>
            </div>
          </div>
          <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>${t.taskUpdate.footerText}</p>
            <p>${t.taskUpdate.copyrightText}</p>
          </div>
        </div>
      `
    };
  },
  
  taskCompleted: (taskName, estimateTime, dashboardUrl, language = 'en') => {
    const t = emailTranslations[language] || emailTranslations['en'];
    return {
      subject: t.taskCompleted.subject.replace('{taskName}', taskName),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">RapidWorks</h1>
            <p style="color: white; margin: 5px 0 0 0; opacity: 0.9;">${t.taskCompleted.headerSubtitle}</p>
          </div>
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">🎉 ${taskName}</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #11998e;">
              <p style="margin: 0 0 15px 0; color: #555; line-height: 1.6;">${t.taskCompleted.completedText}</p>
              ${estimateTime ? `<p style="margin: 0; color: #666;"><strong>${t.taskCompleted.estimateLabel}</strong> ${estimateTime}</p>` : ''}
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${dashboardUrl}" style="background: #11998e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">${t.taskCompleted.buttonText}</a>
            </div>
          </div>
          <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>${t.taskCompleted.footerText}</p>
            <p>${t.taskCompleted.copyrightText}</p>
          </div>
        </div>
      `
    };
  },

  expertMessage: (taskName, expertName, message, dashboardUrl, language = 'en') => {
    const t = emailTranslations[language] || emailTranslations['en'];
    return {
      subject: t.expertMessage.subject.replace('{expertName}', expertName),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">RapidWorks</h1>
            <p style="color: white; margin: 5px 0 0 0; opacity: 0.9;">${t.expertMessage.headerSubtitle}</p>
          </div>
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">💬 ${taskName}</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
              <p style="margin: 0 0 15px 0; color: #555;"><strong>${t.expertMessage.fromLabel}</strong> ${expertName}</p>
              <p style="margin: 0; color: #555; line-height: 1.6;">${message}</p>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${dashboardUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">${t.expertMessage.buttonText}</a>
            </div>
          </div>
          <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>${t.expertMessage.footerText}</p>
            <p>${t.expertMessage.copyrightText}</p>
          </div>
        </div>
      `
    };
  }
};

// Email sending function
const sendEmail = async (to, template) => {
  try {
    const mailOptions = {
      from: {
        name: 'RapidWorks',
        address: process.env.SMTP_FROM || process.env.SMTP_USER
      },
      to: to,
      subject: template.subject,
      html: template.html
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Email Notification Functions
exports.sendTaskUpdateEmail = onCall(async (request) => {
  try {
    const { userEmail, taskName, message, taskId, language = 'en' } = request.data;

    if (!userEmail || !taskName || !message) {
      throw new Error('Missing required fields: userEmail, taskName, message');
    }

    // Get user preferences
    const userId = await getUserIdFromEmail(userEmail);
    const preferences = userId ? await getUserNotificationPreferences(userId) : DEFAULT_PREFERENCES;

    // Check if email notifications are enabled
    if (!preferences.taskMessages?.email) {
      console.log(`Email notifications disabled for user: ${userEmail}`);
      return { success: false, reason: 'Email notifications disabled by user' };
    }

    const dashboardUrl = taskId 
      ? `https://rapid-works.io/dashboard/task/${taskId}`
      : 'https://rapid-works.io/dashboard';

    const template = emailTemplates.taskUpdate(taskName, message, dashboardUrl, language);
    const result = await sendEmail(userEmail, template);

    if (result.success) {
      console.log(`Task update email sent to ${userEmail} for task: ${taskName} (language: ${language})`);
    }

    return result;
  } catch (error) {
    console.error('Error sending task update email:', error);
    return { success: false, error: error.message };
  }
});

exports.sendTaskCompletedEmail = onCall(async (request) => {
  try {
    const { userEmail, taskName, estimateTime, taskId, language = 'en' } = request.data;

    if (!userEmail || !taskName) {
      throw new Error('Missing required fields: userEmail, taskName');
    }

    // Get user preferences
    const userId = await getUserIdFromEmail(userEmail);
    const preferences = userId ? await getUserNotificationPreferences(userId) : DEFAULT_PREFERENCES;

    // Check if email notifications are enabled
    if (!preferences.taskMessages?.email) {
      console.log(`Email notifications disabled for user: ${userEmail}`);
      return { success: false, reason: 'Email notifications disabled by user' };
    }

    const dashboardUrl = taskId 
      ? `https://rapid-works.io/dashboard/task/${taskId}`
      : 'https://rapid-works.io/dashboard';

    const template = emailTemplates.taskCompleted(taskName, estimateTime, dashboardUrl, language);
    const result = await sendEmail(userEmail, template);

    if (result.success) {
      console.log(`Task completed email sent to ${userEmail} for task: ${taskName} (language: ${language})`);
    }

    return result;
  } catch (error) {
    console.error('Error sending task completed email:', error);
    return { success: false, error: error.message };
  }
});

exports.sendExpertMessageEmail = onCall(async (request) => {
  try {
    const { userEmail, taskName, expertName, message, taskId, language = 'en' } = request.data;

    if (!userEmail || !taskName || !expertName || !message) {
      throw new Error('Missing required fields: userEmail, taskName, expertName, message');
    }

    // Get user preferences
    const userId = await getUserIdFromEmail(userEmail);
    const preferences = userId ? await getUserNotificationPreferences(userId) : DEFAULT_PREFERENCES;

    // Check if email notifications are enabled
    if (!preferences.taskMessages?.email) {
      console.log(`Email notifications disabled for user: ${userEmail}`);
      return { success: false, reason: 'Email notifications disabled by user' };
    }

    const dashboardUrl = taskId 
      ? `https://rapid-works.io/dashboard/task/${taskId}`
      : 'https://rapid-works.io/dashboard';

    const template = emailTemplates.expertMessage(taskName, expertName, message, dashboardUrl, language);
    const result = await sendEmail(userEmail, template);

    if (result.success) {
      console.log(`Expert message email sent to ${userEmail} from ${expertName} (language: ${language})`);
    }

    return result;
  } catch (error) {
    console.error('Error sending expert message email:', error);
    return { success: false, error: error.message };
  }
});

// Test email function
exports.sendTestEmail = onCall(async (request) => {
  try {
    const { userEmail, language = 'en' } = request.data;

    if (!userEmail) {
      throw new Error('Missing required field: userEmail');
    }

    // Use translated test content
    const testContent = language === 'de' 
      ? 'Dies ist eine Test-E-Mail, um zu überprüfen, ob Ihre E-Mail-Benachrichtigungen ordnungsgemäß funktionieren.'
      : 'This is a test email to verify your email notifications are working correctly.';

    const template = emailTemplates.taskUpdate(
      'Test Task',
      testContent,
      'https://rapid-works.io/dashboard',
      language
    );

    const result = await sendEmail(userEmail, template);
    
    if (result.success) {
      console.log(`Test email sent successfully to ${userEmail} (language: ${language})`);
    }

    return result;
  } catch (error) {
    console.error('Error sending test email:', error);
    return { success: false, error: error.message };
  }
});

// Default notification preferences
const DEFAULT_PREFERENCES = {
  blogNotifications: {
    mobile: true,
    email: true,
  },
  brandingKitReady: {
    mobile: true,
    email: true,
  },
  taskMessages: {
    mobile: true,
    email: true,
  },
};

// Helper function to get user notification preferences
const getUserNotificationPreferences = async (userId) => {
  try {
    const doc = await db.collection("userNotificationPreferences")
        .doc(userId).get();
    if (doc.exists) {
      const data = doc.data();
      return data.preferences || DEFAULT_PREFERENCES;
    }
    return DEFAULT_PREFERENCES;
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return DEFAULT_PREFERENCES;
  }
};

// Helper function to get user ID from email
const getUserIdFromEmail = async (email) => {
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    return userRecord.uid;
  } catch (error) {
    console.error(`Error getting user ID for email ${email}:`, error);
    return null;
  }
};

// Helper function to save notification to history
const saveNotificationToHistory = async (userId, notificationData) => {
  try {
    await db.collection("notificationHistory").add({
      userId: userId,
      title: notificationData.title,
      body: notificationData.body,
      type: notificationData.type,
      url: notificationData.url,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      metadata: notificationData.metadata || {},
    });
    console.log(`💾 Notification saved to history for user: ${userId}`);
  } catch (error) {
    console.error("Error saving notification to history:", error);
  }
};

// Helper function to submit data to Airtable
const submitToAirtableTable = async (tableName, fields) => {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    throw new Error("Airtable API key or Base ID not configured");
  }

  const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: fields,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Airtable Error Details:", errorData);
      const errorMessage = `Failed to submit data to Airtable: ` +
        `${response.statusText} (Status: ${response.status})`;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting to Airtable:", error);
    throw error;
  }
};

// Callable function for general service requests
exports.submitServiceRequest = onCall(async (request) => {
  const {email, service, notes = ""} = request.data;

  if (!email || !service) {
    throw new Error("Email and service are required");
  }

  try {
    const result = await submitToAirtableTable("Table 1", {
      "Email": email,
      "Service": service,
      "Notes": notes,
    });

    // Track activity in notification history for specific services
    try {
      const userId = await getUserIdFromEmail(email);
      if (userId) {
        let activityData = null;

        // Handle newsletter opt-ins from webinar registration
        if (service.includes("Newsletter")) {
          activityData = {
            title: "📧 Newsletter Subscription Successful",
            body: service.includes("Webinar") ?
              "You subscribed to our newsletter during webinar registration" :
              "You successfully subscribed to our newsletter",
            type: "newsletter_subscription",
            url: "/dashboard",
            metadata: {
              email: email,
              source: service.includes("Webinar") ?
                "webinar_optin" : "service_request",
              service: service,
              notes: notes,
            },
          };
        } else if (service) {
          // Handle other service requests (coaching, consulting, etc.)
          activityData = {
            title: "📝 Service Request Submitted",
            body: `You submitted a request for: ${service}`,
            type: "service_request",
            url: "/dashboard",
            metadata: {
              email: email,
              service: service,
              notes: notes,
            },
          };
        }

        if (activityData) {
          await saveNotificationToHistory(userId, activityData);
          console.log(`📝 Service request tracked for user: ${email}`);
        }
      }
    } catch (historyError) {
      console.log(`⚠️ Could not track activity for ${email}:`, historyError);
      // Don't fail the main request if history saving fails
    }

    return {success: true, data: result};
  } catch (error) {
    console.error("Error in submitServiceRequest:", error);
    throw new Error(`Failed to submit service request: ${error.message}`);
  }
});

// Callable function for webinar registrations
exports.submitWebinarRegistration = onCall(async (request) => {
  const {
    name,
    email,
    phone,
    questions,
    selectedDate,
    selectedDateString,
  } = request.data;

  if (!name || !email || !selectedDate) {
    throw new Error("Name, email, and selected date are required");
  }

  try {
    const result = await submitToAirtableTable("Webinar", {
      "Name": name,
      "Email": email,
      "Phone": phone || "",
      "Questions": questions || "",
      "Selected Date": selectedDate,
      "Selected Display Time": selectedDateString,
    });

    // Track activity in notification history (for logged-in users)
    try {
      const userId = await getUserIdFromEmail(email);
      if (userId) {
        await saveNotificationToHistory(userId, {
          title: "🎯 Webinar Registration Successful",
          body: `You registered for the webinar on ${selectedDateString}`,
          type: "webinar_registration",
          url: "/dashboard", // or wherever webinars are managed
          metadata: {
            webinarDate: selectedDate,
            webinarDateString: selectedDateString,
            name: name,
            phone: phone || "",
            questions: questions || "",
          },
        });
        console.log(`📅 Webinar registration tracked for user: ${email}`);
      }
    } catch (historyError) {
      console.log(`⚠️ Could not track activity for ${email}:`, historyError);
      // Don't fail the main request if history saving fails
    }

    return {success: true, data: result};
  } catch (error) {
    console.error("Error in submitWebinarRegistration:", error);
    const errorMessage = `Failed to submit webinar registration: ` +
      `${error.message}`;
    throw new Error(errorMessage);
  }
});

// Callable function for partner interest
exports.submitPartnerInterest = onCall(async (request) => {
  const {email, partnerNeedsString} = request.data;

  if (!email || !partnerNeedsString) {
    throw new Error("Email and partner needs are required");
  }

  try {
    const result = await submitToAirtableTable("Partners", {
      "Email": email,
      "Partner Needs": partnerNeedsString,
    });

    // Track activity in notification history (for logged-in users)
    try {
      const userId = await getUserIdFromEmail(email);
      if (userId) {
        await saveNotificationToHistory(userId, {
          title: "🤝 Partner Interest Submitted",
          body: "Your partnership inquiry has been submitted successfully",
          type: "partner_interest",
          url: "/partners", // or wherever partner info is displayed
          metadata: {
            email: email,
            partnerNeeds: partnerNeedsString,
          },
        });
        console.log(`🤝 Partner interest tracked for user: ${email}`);
      }
    } catch (historyError) {
      console.log(`⚠️ Could not track activity for ${email}:`, historyError);
      // Don't fail the main request if history saving fails
    }

    return {success: true, data: result};
  } catch (error) {
    console.error("Error in submitPartnerInterest:", error);
    throw new Error(`Failed to submit partner interest: ${error.message}`);
  }
});

// Callable function for expert requests
exports.submitExpertRequest = onCall(async (request) => {
  const {email, expertType} = request.data;

  if (!email || !expertType) {
    throw new Error("Email and expert type are required");
  }

  try {
    const result = await submitToAirtableTable("Expert Request", {
      "Email": email,
      "Type": expertType,
    });

    return {success: true, data: result};
  } catch (error) {
    console.error("Error in submitExpertRequest:", error);
    throw new Error(`Failed to submit expert request: ${error.message}`);
  }
});

// Callable function for newsletter subscriptions
exports.submitNewsletterSubscription = onCall(async (request) => {
  const {email} = request.data;

  if (!email) {
    throw new Error("Email is required");
  }

  try {
    const result = await submitToAirtableTable("Newsletter", {
      "Email": email,
    });

    // Track activity in notification history (for logged-in users)
    try {
      const userId = await getUserIdFromEmail(email);
      if (userId) {
        await saveNotificationToHistory(userId, {
          title: "📧 Newsletter Subscription Successful",
          body: "You successfully subscribed to our newsletter",
          type: "newsletter_subscription",
          url: "/dashboard", // or wherever newsletter settings are managed
          metadata: {
            email: email,
            source: "direct_subscription",
          },
        });
        console.log(`📧 Newsletter subscription tracked for user: ${email}`);
      }
    } catch (historyError) {
      console.log(`⚠️ Could not track activity for ${email}:`, historyError);
      // Don't fail the main request if history saving fails
    }

    return {success: true, data: result};
  } catch (error) {
    console.error("Error in submitNewsletterSubscription:", error);
    const errorMessage = `Failed to submit newsletter subscription: ` +
      `${error.message}`;
    throw new Error(errorMessage);
  }
});

// Callable function for AI prompt logging
exports.submitAIPrompt = onCall(async (request) => {
  const {
    userPrompt,
    aiResponse,
    language,
    sessionId,
    userEmail,
    timestamp,
  } = request.data;

  if (!userPrompt || !aiResponse) {
    throw new Error("User prompt and AI response are required");
  }

  try {
    const result = await submitToAirtableTable("AI user prompts", {
      "User Prompt": userPrompt,
      "AI Response": aiResponse,
      "Language": language || "de",
      "Session ID": sessionId || "",
      "User Email": userEmail || "",
      "Timestamp": timestamp || new Date().toISOString(),
    });

    return {success: true, data: result};
  } catch (error) {
    console.error("Error in submitAIPrompt:", error);
    throw new Error(`Failed to submit AI prompt: ${error.message}`);
  }
});

// New function for branding kit ready notifications
exports.onBrandingKitUpdated = onDocumentUpdated(
    "brandkits/{kitId}",
    async (event) => {
      console.log("🔥 BRANDING KIT NOTIFICATION TRIGGER FIRED");

      const beforeData = event.data.before.data();
      const afterData = event.data.after.data();

      console.log("🛠️ Branding kit update:", {
        kitId: event.params.kitId,
        beforeReady: beforeData.ready,
        afterReady: afterData.ready,
        email: afterData.email,
      });

      // Check if the ready field changed from false/undefined to true
      const wasReady = beforeData.ready === true;
      const isNowReady = afterData.ready === true;

      if (!wasReady && isNowReady) {
        console.log("🎉 Branding kit is ready, sending notification");

        try {
          // Get user email(s) - can be string or array
          let userEmails = [];
          if (typeof afterData.email === "string") {
            userEmails = [afterData.email];
          } else if (Array.isArray(afterData.email)) {
            userEmails = afterData.email;
          }

          if (userEmails.length === 0) {
            console.log("❌ No email found in branding kit document");
            return;
          }

          console.log("📧 Branding kit ready for emails:", userEmails);

          // Get kit name from afterData or use default
          const kitName = afterData.name || afterData.id ||
            "Your branding kit";

          // Send notification to tokens for users whose kit is ready
          const message = {
            notification: {
              title: "🎉 Your Branding Kit is Ready!",
              body: `${kitName} has been completed and is ready for ` +
                "download.",
            },
            data: {
              url: `/dashboard/${event.params.kitId}`,
              type: "branding_kit_ready",
              kitId: event.params.kitId,
            },
          };

          // Send notifications and save to history
          const sendPromises = userEmails.map(async (userEmail) => {
            // Get user ID for history saving
            const userId = await getUserIdFromEmail(userEmail);
            if (!userId) {
              console.log(`⚠️ Could not find user ID for email: ${userEmail}`);
              return;
            }

            // Save notification to history first
            await saveNotificationToHistory(userId, {
              title: message.notification.title,
              body: message.notification.body,
              type: "branding_kit_ready",
              url: `/dashboard/${event.params.kitId}`,
              metadata: {
                kitId: event.params.kitId,
                kitName: kitName,
              },
            });

            // Check if user wants mobile notifications
            const preferences = await getUserNotificationPreferences(userId);
            const wantsMobileNotifications = preferences
                .brandingKitReady?.mobile === true;

            if (!wantsMobileNotifications) {
              console.log(`📵 User ${userEmail} has disabled mobile ` +
                "notifications for branding kits");
              return;
            }

            // Get FCM tokens for this user
            const tokensQuery = db.collection("fcmTokens")
                .where("email", "==", userEmail);
            const tokensSnapshot = await tokensQuery.get();

            // Send to each token for this user
            const tokenPromises = [];
            tokensSnapshot.forEach((doc) => {
              const tokenData = doc.data();
              const token = tokenData.token;

              tokenPromises.push((async () => {
                try {
                  await admin.messaging().send({
                    ...message,
                    token: token,
                  });
                  console.log(`✅ Branding kit notification sent to token: ` +
                    `${token.substring(0, 10)}...`);
                } catch (error) {
                  console.error(`❌ Failed to send branding kit notification ` +
                    `to token ${token.substring(0, 10)}...:`, error);
                  // Remove invalid tokens from database
                  if (error.code ===
                    "messaging/registration-token-not-registered") {
                    const tokenQuery = await db.collection("fcmTokens")
                        .where("token", "==", token).get();
                    tokenQuery.forEach(async (doc) => {
                      await doc.ref.delete();
                    });
                    console.log(`🗑️ Removed invalid token: ` +
                      token.substring(0, 10) + "...");
                  }
                }
              })());
            });

            await Promise.all(tokenPromises);
          });

          await Promise.all(sendPromises);

          console.log("🎉 Branding kit ready notifications " +
            "completed for kit: " + event.params.kitId);
        } catch (error) {
          console.error("💥 Error sending branding kit ready notification:",
              error);
        }
      } else {
        console.log("ℹ️ Branding kit updated but not marked as ready, " +
          "skipping notification");
      }
    },
);

// Callable function for testing branding kit notifications
exports.testBrandingKitReady = onCall(async (request) => {
  const {kitId, email} = request.data;

  if (!kitId || !email) {
    throw new Error("Kit ID and email are required for testing");
  }

  try {
    // Update or create a test branding kit document
    const kitRef = db.collection("brandkits").doc(kitId);

    // Set the document with ready: true to trigger the notification
    await kitRef.set({
      id: kitId,
      email: email,
      name: `Test Kit - ${kitId}`,
      ready: true,
      paid: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, {merge: true});

    return {
      success: true,
      message: `Test branding kit ${kitId} marked as ready for ${email}`,
      kitId: kitId,
    };
  } catch (error) {
    console.error("Error in testBrandingKitReady:", error);
    throw new Error(`Failed to test branding kit notification: ` +
      `${error.message}`);
  }
});

// Callable function for cleaning up invalid FCM tokens
exports.cleanupInvalidTokens = onCall(async (request) => {
  try {
    console.log("Starting FCM token cleanup...");

    // Get all FCM tokens
    const tokensSnapshot = await db.collection("fcmTokens").get();
    const tokens = [];
    const tokenDocs = [];

    tokensSnapshot.forEach((doc) => {
      const tokenData = doc.data();
      tokens.push(tokenData.token);
      tokenDocs.push(doc);
    });

    if (tokens.length === 0) {
      return {success: true, message: "No tokens to clean up"};
    }

    console.log(`Testing ${tokens.length} tokens...`);

    // Test each token by trying to send a dry-run message
    const invalidTokens = [];

    for (let i = 0; i < tokens.length; i++) {
      try {
        await admin.messaging().send({
          token: tokens[i],
          data: {test: "dry-run"},
        }, true); // dry-run mode
      } catch (error) {
        if (error.code === "messaging/registration-token-not-registered" ||
            error.code === "messaging/invalid-registration-token") {
          invalidTokens.push(i);
        }
      }
    }

    // Delete invalid tokens
    const deletePromises = invalidTokens.map(async (index) => {
      await tokenDocs[index].ref.delete();
    });

    await Promise.all(deletePromises);

    console.log(`Cleaned up ${invalidTokens.length} invalid tokens`);

    return {
      success: true,
      message: `Cleaned up ${invalidTokens.length} invalid tokens out ` +
        `of ${tokens.length}`,
      totalTokens: tokens.length,
      invalidTokens: invalidTokens.length,
      validTokens: tokens.length - invalidTokens.length,
    };
  } catch (error) {
    console.error("Error cleaning up tokens:", error);
    throw new Error(`Failed to cleanup tokens: ${error.message}`);
  }
});

// Test function for blog notifications
exports.testBlogNotification = onCall(async (request) => {
  try {
    console.log("Testing blog notification system...");

    // 1. Check FCM tokens
    const tokensSnapshot = await db.collection("fcmTokens").get();
    const tokens = [];
    const validTokens = [];

    console.log(`Found ${tokensSnapshot.size} FCM tokens in database`);

    tokensSnapshot.forEach((doc) => {
      const tokenData = doc.data();
      tokens.push({
        token: tokenData.token,
        email: tokenData.email,
        createdAt: tokenData.createdAt,
      });
    });

    if (tokens.length === 0) {
      return {
        success: false,
        message: "No FCM tokens found. Users need to subscribe to " +
          "notifications first.",
        tokens: 0,
        validTokens: 0,
      };
    }

    // 2. Test token validity (sample a few)
    const testTokens = tokens.slice(0, 3); // Test first 3 tokens
    for (const tokenData of testTokens) {
      try {
        await admin.messaging().send({
          token: tokenData.token,
          data: {test: "validity-check"},
        }, true); // dry-run mode
        validTokens.push(tokenData);
      } catch (error) {
        console.log(`Invalid token found: ` +
          `${tokenData.token.substring(0, 10)}...`);
      }
    }

    // 3. Create a test blog post to trigger notifications
    const testBlogRef = await db.collection("blogs").add({
      title: "🧪 Test Blog Post - Notification Check",
      excerpt: "This is a test post to verify blog notifications " +
        "are working.",
      content: "Test content for notification verification.",
      published: true,
      date: admin.firestore.FieldValue.serverTimestamp(),
      author: "System Test",
      tags: ["test", "notifications"],
    });

    console.log(`Test blog post created with ID: ${testBlogRef.id}`);

    return {
      success: true,
      message: `Blog notification test completed. Created test blog ` +
        `post: ${testBlogRef.id}`,
      totalTokens: tokens.length,
      testedTokens: testTokens.length,
      validTokens: validTokens.length,
      testBlogId: testBlogRef.id,
      tokenDetails: tokens.map((t) => ({
        email: t.email,
        tokenPreview: t.token.substring(0, 10) + "...",
        createdAt: t.createdAt,
      })),
    };
  } catch (error) {
    console.error("Error testing blog notifications:", error);
    throw new Error(`Blog notification test failed: ${error.message}`);
  }
});

// Alternative: Firestore-triggered functions
exports.onServiceRequestCreated = onDocumentCreated(
    "serviceRequests/{requestId}",
    async (event) => {
      const snapshot = event.data;
      if (!snapshot) {
        console.log("No data associated with the event");
        return;
      }

      const requestData = snapshot.data();

      try {
        await submitToAirtableTable("Table 1", {
          "Email": requestData.email,
          "Service": requestData.service,
          "Notes": requestData.notes || "",
        });

        // Update the document to mark as synced
        await snapshot.ref.update({
          syncedToAirtable: true,
          syncedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log("Service request synced to Airtable successfully");
      } catch (error) {
        console.error("Failed to sync service request to Airtable:", error);

        // Update the document to mark sync failure
        await snapshot.ref.update({
          syncedToAirtable: false,
          syncError: error.message,
          syncedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    },
);

exports.onWebinarRegistrationCreated = onDocumentCreated(
    "webinarRegistrations/{registrationId}",
    async (event) => {
      const snapshot = event.data;
      if (!snapshot) {
        console.log("No data associated with the event");
        return;
      }

      const registrationData = snapshot.data();

      try {
        await submitToAirtableTable("Webinar", {
          "Name": registrationData.name,
          "Email": registrationData.email,
          "Phone": registrationData.phone || "",
          "Questions": registrationData.questions || "",
          "Selected Date": registrationData.selectedDate,
          "Selected Display Time": registrationData.selectedDateString,
        });

        await snapshot.ref.update({
          syncedToAirtable: true,
          syncedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log("Webinar registration synced to Airtable successfully");
      } catch (error) {
        const errorMessage = "Failed to sync webinar registration to " +
          "Airtable:";
        console.error(errorMessage, error);

        await snapshot.ref.update({
          syncedToAirtable: false,
          syncError: error.message,
          syncedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    },
);

exports.onPartnerInterestCreated = onDocumentCreated(
    "partnerInterests/{interestId}",
    async (event) => {
      const snapshot = event.data;
      if (!snapshot) {
        console.log("No data associated with the event");
        return;
      }

      const interestData = snapshot.data();

      try {
        await submitToAirtableTable("Partners", {
          "Email": interestData.email,
          "Partner Needs": interestData.partnerNeedsString,
        });

        await snapshot.ref.update({
          syncedToAirtable: true,
          syncedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log("Partner interest synced to Airtable successfully");
      } catch (error) {
        console.error("Failed to sync partner interest to Airtable:", error);

        await snapshot.ref.update({
          syncedToAirtable: false,
          syncError: error.message,
          syncedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    },
);

exports.onExpertRequestCreated = onDocumentCreated(
    "expertRequests/{requestId}",
    async (event) => {
      const snapshot = event.data;
      if (!snapshot) {
        console.log("No data associated with the event");
        return;
      }

      const requestData = snapshot.data();

      try {
        await submitToAirtableTable("Expert Request", {
          "Email": requestData.email,
          "Type": requestData.expertType,
        });

        await snapshot.ref.update({
          syncedToAirtable: true,
          syncedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log("Expert request synced to Airtable successfully");
      } catch (error) {
        console.error("Failed to sync expert request to Airtable:", error);

        await snapshot.ref.update({
          syncedToAirtable: false,
          syncError: error.message,
          syncedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    },
);

exports.onAIPromptCreated = onDocumentCreated(
    "aiPrompts/{promptId}",
    async (event) => {
      const snapshot = event.data;
      if (!snapshot) {
        console.log("No data associated with the event");
        return;
      }

      const promptData = snapshot.data();

      try {
        await submitToAirtableTable("AI user prompts", {
          "User Prompt": promptData.userPrompt,
          "AI Response": promptData.aiResponse,
          "Language": promptData.language || "de",
          "Session ID": promptData.sessionId || "",
          "User Email": promptData.userEmail || "",
          "Timestamp": promptData.createdAt ?
            promptData.createdAt.toDate().toISOString() :
            new Date().toISOString(),
        });

        await snapshot.ref.update({
          syncedToAirtable: true,
          syncedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log("AI prompt synced to Airtable successfully");
      } catch (error) {
        console.error("Failed to sync AI prompt to Airtable:", error);

        await snapshot.ref.update({
          syncedToAirtable: false,
          syncError: error.message,
          syncedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    },
);

// Your existing blog notification function
exports.sendNewBlogNotification = onDocumentCreated(
    "blogs/{blogId}",
    async (event) => {
      console.log("🔥 BLOG NOTIFICATION TRIGGER FIRED");

      const snapshot = event.data;
      if (!snapshot) {
        console.log("❌ No snapshot data in blog notification trigger");
        return;
      }

      const blogData = snapshot.data();
      console.log("📝 Blog data:", {
        id: snapshot.id,
        title: blogData.title,
        published: blogData.published,
        hasExcerpt: !!blogData.excerpt,
        slug: blogData.slug,
      });

      // Only send notifications for published blogs
      if (!blogData.published) {
        console.log("⏸️ Blog not published, skipping notification");
        return;
      }

      try {
        console.log("📡 Getting FCM tokens for blog notification...");

        // Get all FCM tokens
        const tokensSnapshot = await db.collection("fcmTokens").get();

        // Create the notification
        const notificationTitle = `📝 New Blog Post: ${blogData.title}`;
        const notificationBody = blogData.excerpt ||
          "A new blog post has been published!";

        console.log("📬 Sending blog notifications:", {
          title: notificationTitle,
          body: notificationBody,
          recipientCount: tokensSnapshot.docs.length,
        });

        // Send notifications to users and save to history
        const sendPromises = [];
        const processedUsers = new Set(); // Track users to avoid duplicates

        for (const doc of tokensSnapshot.docs) {
          const tokenData = doc.data();

          // Get user email and ID
          const userEmail = tokenData.email;
          if (!userEmail) continue; // Skip tokens without email

          // Avoid processing the same user multiple times
          if (processedUsers.has(userEmail)) continue;
          processedUsers.add(userEmail);

          const userId = await getUserIdFromEmail(userEmail);
          if (!userId) {
            console.log(`⚠️ Could not find user ID for email: ${userEmail}`);
            continue;
          }

          // Save notification to history for this user
          // Use slug if available, fallback to ID
          const blogSlug = blogData.slug || snapshot.id;
          await saveNotificationToHistory(userId, {
            title: notificationTitle,
            body: notificationBody,
            type: "new_blog_post",
            url: `/blogs/${blogSlug}`,
            metadata: {
              blogId: snapshot.id,
              blogSlug: blogSlug,
              blogTitle: blogData.title,
            },
          });

          // Check if user wants mobile notifications for blog posts
          const preferences = await getUserNotificationPreferences(userId);
          const wantsMobileNotifications = preferences
              .blogNotifications?.mobile === true;

          if (!wantsMobileNotifications) {
            console.log(`📵 User ${userEmail} has disabled mobile ` +
              "notifications for blog posts");
            continue;
          }

          // Get all tokens for this user and send notifications
          const userTokensQuery = db.collection("fcmTokens")
              .where("email", "==", userEmail);
          const userTokensSnapshot = await userTokensQuery.get();

          userTokensSnapshot.forEach((tokenDoc) => {
            const userTokenData = tokenDoc.data();
            const token = userTokenData.token;

            sendPromises.push((async () => {
              try {
                await admin.messaging().send({
                  notification: {
                    title: notificationTitle,
                    body: notificationBody,
                  },
                  data: {
                    url: `/blogs/${blogSlug}`,
                    type: "new_blog_post",
                    blogId: snapshot.id,
                    blogSlug: blogSlug,
                  },
                  token: token,
                });
                console.log(`✅ Blog notification sent to: ` +
                  `${token.substring(0, 10)}...`);
              } catch (error) {
                console.error(`❌ Failed to send blog notification to ` +
                  `${token.substring(0, 10)}...:`, error);

                // Remove invalid tokens
                if (error.code ===
                  "messaging/registration-token-not-registered") {
                  const tokenQuery = await db.collection("fcmTokens")
                      .where("token", "==", token).get();
                  tokenQuery.forEach(async (doc) => {
                    await doc.ref.delete();
                  });
                  console.log(`🗑️ Removed invalid token: ` +
                    token.substring(0, 10) + "...");
                }
              }
            })());
          });
        }

        await Promise.all(sendPromises);
        console.log(`🎉 Blog notifications completed for: ${blogData.title}`);
      } catch (error) {
        console.error("💥 Error sending blog notification:", error);
      }
    },
);

// Callable function for AI chat using Gemini
exports.chatWithAI = onCall(async (request) => {
  const {message, language = "de"} = request.data;

  if (!message) {
    throw new Error("Message is required");
  }

  const apiKey = process.env.GEMINI_API_KEY ||
    "AIzaSyCkcAo0KV6xD7v9FoEiL8sUsdQ1wTjOmf4";
  if (!apiKey) {
    throw new Error("Gemini API key not configured");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash-latest"});

    // Context about RapidWorks
    const systemContext = `You are Rapi, the AI Assistant for RapidWorks, ` +
      `a platform that helps startups in Germany find the right experts, ` +
      `secure funding, receive coaching, develop MVPs, launch products, ` +
      `and grow sustainably.

ROLE & MISSION:
Your mission is to answer user questions, explain services, help identify ` +
      `the right solutions for their situation, and guide them toward the ` +
      `next best steps (webinar, consultation, or form submission).

PRIMARY RESPONSIBILITIES:
• Respond to questions about RapidWorks services: Branding, Coaching, ` +
      `Experts, Financing, MVP, Partners
• Explain prices, timeframes, and package details
• Provide technical support and ongoing collaboration information
• Explain why these services are essential for founders
• Share the mission, background, and unique approach of RapidWorks
• Discuss geographic coverage (Germany, with future expansion)
• Explain funding application support (up to €300,000, no commissions)
• Discuss available Developers, Designers, Marketing, and Finance experts

IMPORTANT PROMOTION:
At every suitable opportunity, mention that every two weeks, we host a ` +
      `free "Rapid Answers" webinar where founders can get all their ` +
      `questions answered. Invite users to sign up via the website.

FREE OFFERS:
1. Free call with RapidWorks via navigation bar button - all questions ` +
      `about services answered free of charge
2. "Rapid Answers" Webinars every 2 weeks with CEO Yannick (founder ` +
      `of 3 startups) answering startup questions live
3. Try one "Rapid Expert" for free for 1 hour (call or task)
4. "Rapid Financing" - show founders lucrative startup subsidies ` +
      `and help create applications completely free

SERVICES & PRICING:
• Rapid Branding: Entry-level service at €999 fixed price
• Customizations: €40/hour
• Lean startup methodology coaching
• Demand validation before expensive product development

FINANCING:
• All German businesses eligible for €100,000 in Deminimis Funding ` +
      `per year
• Up to €300,000 over 3 years in grants
• Help founders use this potential early
• Show most lucrative subsidies they could receive

KEY DIFFERENTIATORS:
• Full transparency
• Full cost control
• Holistic approach
• Capital-efficient methods
• Focused around startups and founders

TONE & STYLE:
• Supportive, friendly, professional
• Act like a coach or mentor
• Use clear, simple language focused on founder needs
• Keep responses short and easy to understand for small chat window
• Break information into bullet points if needed
• If question too general - ask clarifying question

COACHING APPROACH:
If user appears uncertain or lost:
• Be supportive, ask about their main bottleneck
• Suggest relevant solutions
• If no solution fits - recommend webinar or free consultation

LANGUAGES:
Communicate in either German or English, automatically based on the ` +
      `user's language.

DATA HANDLING:
• Never ask for or store personal data
• If users offer personal info - politely decline
• Chat history saved anonymously for internal analysis

LIMITATIONS:
If user asks about something unrelated to RapidWorks, politely explain ` +
      `that you only respond to questions about RapidWorks services.

GREETING:
When starting conversations: "Hi! 👋 Welcome to RapidWorks — your ` +
      `startup's all-in-one support hub 🚀 We help founders in Germany ` +
      `with everything from branding and MVP building to funding, coaching, ` +
      `and expert matching — all capital-efficient, transparent, and ` +
      `startup-focused. How can I support you today?"

IMPORTANT: Always respond in ${language === "de" ? "German" : "English"} ` +
      `language. User interface language is ${language}.`;


    const prompt = `${systemContext}\n\nUser Question: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      response: text,
    };
  } catch (error) {
    console.error("Error with Gemini AI:", error);
    throw new Error("Failed to process AI request");
  }
});

// Callable function for sending task message notifications (simplified)
exports.sendTaskMessageNotification = onCall(async (request) => {
  const {
    taskId,
    senderEmail,
    senderRole,
    recipientEmail,
    recipientRole,
    messageContent = "New message",
    messageType = "message",
    taskData,
  } = request.data || {};

  if (!recipientEmail) {
    throw new Error("recipientEmail is required");
  }

  try {
    console.log(
        `📬 [Simple] Send: ${messageType} ` +
        `from ${senderRole} to ${recipientRole} (${recipientEmail})`,
    );

    // Create notification content (no auth or preferences lookup)
    const taskTitle = taskData?.title || taskData?.service || "Task";
    let title;
    let body;

    switch (messageType) {
      case "task_created":
        title = "🆕 New Task Assignment";
        body = `You have a new task: "${taskTitle}"`;
        break;
      case "estimate":
        title = "💰 Estimate Received";
        body = `Estimate for "${taskTitle}": ${messageContent}`;
        break;
      default:
        if (senderRole === "expert") {
          title = "👨‍💼 Message from Expert";
          const preview = messageContent.substring(0, 50);
          const ellipsis = messageContent.length > 50 ? "..." : "";
          body = `Expert replied to "${taskTitle}": ${preview}${ellipsis}`;
        } else {
          title = "👤 Message from Client";
          const preview = messageContent.substring(0, 50);
          const ellipsis = messageContent.length > 50 ? "..." : "";
          body = `Client message for "${taskTitle}": ${preview}${ellipsis}`;
        }
        break;
    }

    const url = taskId ? `https://rapid-works.io/dashboard/task/${taskId}` : "https://rapid-works.io/dashboard";

    // Fetch tokens for the recipient email and send push (no preference checks)
    let notificationsSent = 0;
    try {
      console.log(
          `📱 [Simple] Looking for FCM tokens for: ${recipientEmail}`,
      );
      const tokensSnapshot = await db.collection("fcmTokens")
          .where("email", "==", recipientEmail)
          .get();

      console.log(
          `📊 [Simple] Found ${tokensSnapshot.size} token(s) for ` +
          `${recipientEmail}`,
      );

      if (!tokensSnapshot.empty) {
        const tokens = tokensSnapshot.docs.map((doc) => doc.data().token);
        const message = {
          notification: {title, body},
          data: {url, type: "task_message", taskId: taskId || "",
            senderRole: senderRole || ""},
        };

        for (const token of tokens) {
          try {
            await admin.messaging().send({...message, token});
            notificationsSent++;
          } catch (tokenError) {
            console.error(
                `[Simple] Failed to send to token ` +
                `${token.substring(0, 10)}...:`,
                tokenError,
            );
            // Best-effort cleanup for invalid tokens
            if (
              tokenError.code ===
                "messaging/registration-token-not-registered" ||
              tokenError.code === "messaging/invalid-registration-token"
            ) {
              try {
                const invalidTokenDocs = await db
                    .collection("fcmTokens")
                    .where("token", "==", token)
                    .get();
                invalidTokenDocs.forEach((doc) => doc.ref.delete());
              } catch (cleanupError) {
                console.error(
                    "[Simple] Error cleaning up invalid token:",
                    cleanupError,
                );
              }
            }
          }
        }
      }
    } catch (sendError) {
      console.error(
          "[Simple] Error while sending push notifications:", sendError,
      );
    }

    // Best-effort: save to history only if we can resolve user (do not block)
    try {
      const recipientUserId = await getUserIdFromEmail(recipientEmail);
      if (recipientUserId) {
        await saveNotificationToHistory(recipientUserId, {
          title: title,
          body: body,
          type: "task_message",
          url: url,
          metadata: {
            taskId: taskId || "",
            senderEmail: senderEmail || "",
            senderRole: senderRole || "",
            messageType: messageType || "message",
            taskTitle: taskTitle,
          },
        });
      }
    } catch (historyError) {
      console.log(
          "[Simple] Skipping history save:",
          (historyError && historyError.message) || historyError,
      );
    }

    // Send email notification as backup/additional channel
    let emailSent = false;
    try {
      console.log(`📧 Attempting to send email notification to: ${recipientEmail}`);
      
      // Determine notification type for email
      let emailType = 'expert_message';
      if (messageType === 'task_completed') {
        emailType = 'task_completed';
      } else if (messageType === 'task_update') {
        emailType = 'task_update';
      }
      
      // Get user language preference (default to 'en')
      let userLanguage = 'en';
      try {
        const recipientUserId = await getUserIdFromEmail(recipientEmail);
        if (recipientUserId) {
          const userPrefs = await getUserNotificationPreferences(recipientUserId);
          userLanguage = userPrefs.language || 'en';
        }
      } catch (langError) {
        console.log('Could not determine user language, using default:', langError.message);
      }
      
      if (emailType === 'expert_message') {
        // Get proper expert name from email or use fallback
        let expertName = 'Expert';
        if (senderEmail) {
          // Extract name from email or get from task data
          if (taskData?.expertName) {
            expertName = taskData.expertName;
          } else if (senderEmail.includes('samuel')) {
            expertName = 'Samuel Donkor';
          } else if (senderEmail.includes('prince')) {
            expertName = 'Prince Ardiabah';
          } else {
            // Use email username as fallback
            expertName = senderEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          }
        }
        
        const template = emailTemplates.expertMessage(
          taskTitle || 'Task Update',
          expertName,
          messageContent || body,
          url,
          userLanguage
        );
        const emailResult = await sendEmail(recipientEmail, template);
        emailSent = emailResult.success;
        
        if (emailSent) {
          console.log(`✅ Email notification sent to ${recipientEmail}`);
        } else {
          console.log(`❌ Email notification failed for ${recipientEmail}:`, emailResult.error);
        }
      } else if (emailType === 'task_completed') {
        const template = emailTemplates.taskCompleted(
          taskTitle || 'Task',
          null, // estimateTime
          url,
          userLanguage
        );
        const emailResult = await sendEmail(recipientEmail, template);
        emailSent = emailResult.success;
        
        if (emailSent) {
          console.log(`✅ Task completion email sent to ${recipientEmail}`);
        } else {
          console.log(`❌ Task completion email failed for ${recipientEmail}:`, emailResult.error);
        }
      } else if (emailType === 'task_update') {
        const template = emailTemplates.taskUpdate(
          taskTitle || 'Task',
          body,
          url,
          userLanguage
        );
        const emailResult = await sendEmail(recipientEmail, template);
        emailSent = emailResult.success;
        
        if (emailSent) {
          console.log(`✅ Task update email sent to ${recipientEmail}`);
        } else {
          console.log(`❌ Task update email failed for ${recipientEmail}:`, emailResult.error);
        }
      }
    } catch (emailError) {
      console.error(`❌ Error sending email notification to ${recipientEmail}:`, emailError);
    }

    let responseMessage = `No push tokens for recipient. Email ${emailSent ? 'sent' : 'failed'}. Notification saved to history if possible.`;
    if (notificationsSent > 0) {
      responseMessage = `Sent ${notificationsSent} push notification(s)${emailSent ? ' and email' : ', email failed'}`;
    }

    return {
      success: true,
      notificationsSent: notificationsSent,
      emailSent: emailSent,
      recipientEmail: recipientEmail,
      messageType: messageType,
      hasTokens: notificationsSent > 0,
      message: responseMessage,
    };
  } catch (error) {
    console.error(
        "[Simple] Error sending task message notification:", error,
    );
    throw new Error(`Failed to send task notification: ${error.message}`);
  }
});

// Firestore trigger: Auto send notifications when task documents are updated
exports.onTaskUpdated = onDocumentUpdated("taskRequests/{taskId}",
    async (event) => {
      const beforeData = event.data.before.data();
      const afterData = event.data.after.data();
      const taskId = event.params.taskId;

      console.log(`📝 Task ${taskId} was updated`);

      try {
        // Check if messages were added (length increased)
        const beforeMessages = beforeData.messages || [];
        const afterMessages = afterData.messages || [];

        if (afterMessages.length > beforeMessages.length) {
          // New message(s) were added
          const newMessages = afterMessages.slice(beforeMessages.length);
          console.log(`📬 ${newMessages.length} new message(s) detected ` +
            `in task ${taskId}`);

          for (const message of newMessages) {
            console.log(`Processing new message from: ${message.sender}`);

            // Skip system messages to avoid duplicate notifications
            if (message.sender === "system") {
              console.log("⏭️ Skipping system message");
              continue;
            }

            // Determine sender and recipient
            const senderRole = message.sender; // "expert" or "customer"
            const senderEmail = senderRole === "expert" ?
              afterData.expertEmail : afterData.userEmail;
            const recipientRole = senderRole === "expert" ?
              "customer" : "expert";
            const recipientEmail = senderRole === "expert" ?
              afterData.userEmail : afterData.expertEmail;

            if (!senderEmail || !recipientEmail) {
              if (!afterData.expertEmail) {
                console.log(`⚠️ Task ${taskId} has no assigned expert yet ` +
                  `(expertEmail is null). This is normal for tasks that ` +
                  `haven't been assigned to a specific expert.`);
                console.log(`📝 Skipping notification until expert is assigned.`);
              } else {
                console.log("⚠️ Missing email addresses, skipping notification");
                console.log(`   senderEmail: ${senderEmail}`);
                console.log(`   recipientEmail: ${recipientEmail}`);
                console.log(`   expertEmail: ${afterData.expertEmail}`);
                console.log(`   userEmail: ${afterData.userEmail}`);
              }
              continue;
            }

            console.log(`📤 Sending notification: ${senderRole} → ` +
              `${recipientRole}`);

            // Determine message type
            let messageType = "message";
            if (message.type === "estimate" ||
              message.content?.includes("€") ||
              message.content?.includes("$")) {
              messageType = "estimate";
            }

            // Get recipient's user ID and notification preferences
            const recipientUserId = await getUserIdFromEmail(recipientEmail);
            if (!recipientUserId) {
              console.log(`⚠️ Recipient user not found for email: ` +
                `${recipientEmail}`);
              continue;
            }

            const preferences =
              await getUserNotificationPreferences(recipientUserId);

            // Create notification content
            let title;
            let body;
            const taskTitle = afterData.taskName || afterData.service || "Task";

            switch (messageType) {
              case "estimate":
                title = "💰 Estimate Received";
                body = `Estimate for "${taskTitle}": ` +
                  `${message.content.substring(0, 50)}` +
                  `${message.content.length > 50 ? "..." : ""}`;
                break;
              default:
                if (senderRole === "expert") {
                  title = "👨‍💼 Message from Expert";
                  body = `Expert replied to "${taskTitle}": ` +
                    `${message.content.substring(0, 50)}` +
                    `${message.content.length > 50 ? "..." : ""}`;
                } else {
                  title = "👤 Message from Client";
                  body = `Client message for "${taskTitle}": ` +
                    `${message.content.substring(0, 50)}` +
                    `${message.content.length > 50 ? "..." : ""}`;
                }
                break;
            }

            const url = `/dashboard?task=${taskId}`;

            // Send mobile push notification if user wants them
            const shouldSendMobile = preferences.taskMessages?.mobile === true;

            if (shouldSendMobile) {
              try {
                console.log(`📱 Looking for FCM tokens for: ` +
                  `${recipientEmail}`);
                const tokensSnapshot = await db.collection("fcmTokens")
                    .where("email", "==", recipientEmail)
                    .get();

                console.log(`📊 Found ${tokensSnapshot.size} FCM token(s) ` +
                  `for ${recipientEmail}`);

                if (!tokensSnapshot.empty) {
                  const tokens = tokensSnapshot.docs
                      .map((doc) => doc.data().token);

                  const messagePayload = {
                    notification: {
                      title: title,
                      body: body,
                    },
                    data: {
                      url: url,
                      type: "task_message",
                      taskId: taskId,
                      senderRole: senderRole,
                    },
                  };

                  // Send to all user's devices
                  for (const token of tokens) {
                    try {
                      await admin.messaging().send({
                        ...messagePayload,
                        token: token,
                      });
                      console.log(`✅ Push notification sent to ` +
                        `${recipientEmail}`);
                    } catch (tokenError) {
                      console.error(`❌ Failed to send to token: ` +
                        `${tokenError.message}`);
                      // Remove invalid token
                      try {
                        const invalidTokenDocs = await db
                            .collection("fcmTokens")
                            .where("token", "==", token)
                            .get();
                        invalidTokenDocs.forEach((doc) => doc.ref.delete());
                      } catch (cleanupError) {
                        console.error("Error cleaning up invalid token:",
                            cleanupError);
                      }
                    }
                  }
                } else {
                  console.log(`📱 No FCM tokens found for: ` +
                    `${recipientEmail}`);
                  console.log(`❗ TASK NOTIFICATION ISSUE: User ${recipientEmail} ` +
                    `has not enabled task notifications yet.`);
                  console.log(`💡 SOLUTION: User needs to:`);
                  console.log(`   1. Visit the dashboard/website`);
                  console.log(`   2. Enable task notifications when prompted`);
                  console.log(`   3. Or manually enable them in notification settings`);
                  console.log(`📝 Notification will be saved to history instead.`);
                }
              } catch (error) {
                console.error("Error sending mobile notification:", error);
              }
            } else {
              console.log(`📵 User ${recipientEmail} has disabled mobile ` +
                "notifications for task messages");
            }

            // Save notification to history
            try {
              await saveNotificationToHistory(recipientUserId, {
                title: title,
                body: body,
                type: "task_message",
                url: url,
                metadata: {
                  taskId: taskId,
                  senderEmail: senderEmail,
                  senderRole: senderRole,
                  messageType: messageType,
                  taskTitle: taskTitle,
                },
              });
              console.log(`📝 Notification saved to history for: ` +
                `${recipientEmail}`);
            } catch (historyError) {
              console.error("Error saving notification to history:",
                  historyError);
            }
          }
        }

        console.log(`✅ Task update processing completed for ${taskId}`);
      } catch (error) {
        console.error(`❌ Error processing task update for ${taskId}:`,
            error);
      }
    });

// Mobile-specific notification test function
exports.sendTestMobileNotification = onCall(async (request) => {
  const {userEmail, testType = "mobile_test"} = request.data;

  if (!userEmail) {
    throw new Error("User email is required for mobile notification test");
  }

  try {
    console.log(`📱 Testing mobile notifications for: ${userEmail}`);

    // Get user ID
    const userId = await getUserIdFromEmail(userEmail);
    if (!userId) {
      throw new Error(`User not found for email: ${userEmail}`);
    }

    // Get FCM tokens for this user
    const tokensSnapshot = await db.collection("fcmTokens")
        .where("email", "==", userEmail)
        .get();

    console.log(`📊 Found ${tokensSnapshot.size} FCM token(s) for ${userEmail}`);

    if (tokensSnapshot.empty) {
      return {
        success: false,
        reason: "no_tokens",
        message: `No FCM tokens found for ${userEmail}. User needs to enable notifications first.`,
        userEmail: userEmail,
        tokenCount: 0,
      };
    }

    const tokens = tokensSnapshot.docs.map((doc) => doc.data().token);

    // Create mobile-optimized test notification
    const testNotification = {
      notification: {
        title: "📱 Mobile Test Notification",
        body: `Mobile notifications are working for ${userEmail}! This is a test message.`,
      },
      data: {
        url: "/dashboard",
        type: "mobile_test",
        testType: testType,
        timestamp: Date.now().toString(),
      },
    };

    let sentCount = 0;
    const errors = [];

    // Send to all user's tokens
    for (const token of tokens) {
      try {
        await admin.messaging().send({
          ...testNotification,
          token: token,
        });
        sentCount++;
        console.log(`✅ Mobile test notification sent to token: ${token.substring(0, 10)}...`);
      } catch (error) {
        console.error(`❌ Failed to send to token ${token.substring(0, 10)}...:`, error);
        errors.push({
          token: token.substring(0, 10) + "...",
          error: error.message,
        });

        // Remove invalid tokens
        if (error.code === "messaging/registration-token-not-registered") {
          try {
            const invalidTokenDocs = await db.collection("fcmTokens")
                .where("token", "==", token)
                .get();
            invalidTokenDocs.forEach((doc) => doc.ref.delete());
            console.log(`🗑️ Removed invalid token: ${token.substring(0, 10)}...`);
          } catch (cleanupError) {
            console.error("Error cleaning up invalid token:", cleanupError);
          }
        }
      }
    }

    // Save test notification to history
    await saveNotificationToHistory(userId, {
      title: testNotification.notification.title,
      body: testNotification.notification.body,
      type: "mobile_test",
      url: "/dashboard",
      metadata: {
        testType: testType,
        sentCount: sentCount,
        totalTokens: tokens.length,
        errors: errors,
      },
    });

    return {
      success: sentCount > 0,
      userEmail: userEmail,
      tokenCount: tokens.length,
      sentCount: sentCount,
      errors: errors,
      message: sentCount > 0 ?
        `Successfully sent ${sentCount}/${tokens.length} test notifications` :
        `Failed to send any notifications. ${errors.length} errors occurred.`,
    };
  } catch (error) {
    console.error("Error in mobile notification test:", error);
    throw new Error(`Mobile notification test failed: ${error.message}`);
  }
});

// Test function for task message notifications
exports.testTaskNotification = onCall(async (request) => {
  const {taskId, userEmail, expertEmail, messageContent = "Test task message"} = request.data;

  if (!taskId || !userEmail || !expertEmail) {
    throw new Error("Task ID, user email, and expert email are required for testing");
  }

  try {
    console.log(`🧪 Testing task notifications for task: ${taskId}`);

    // Simulate a task message update by directly triggering the notification logic
    const recipientUserId = await getUserIdFromEmail(userEmail);
    if (!recipientUserId) {
      throw new Error(`User not found for email: ${userEmail}`);
    }

    // Get user preferences
    const preferences = await getUserNotificationPreferences(recipientUserId);
    console.log("User task notification preferences:", preferences.taskMessages);

    // Check if user wants task message notifications
    const shouldSendMobile = preferences.taskMessages?.mobile === true;

    if (!shouldSendMobile) {
      return {
        success: false,
        reason: "user_preferences_disabled",
        message: `User ${userEmail} has task notifications disabled in preferences`,
        preferences: preferences.taskMessages,
      };
    }

    // Get FCM tokens for this user
    const tokensSnapshot = await db.collection("fcmTokens")
        .where("email", "==", userEmail)
        .get();

    console.log(`📊 Found ${tokensSnapshot.size} FCM token(s) for ${userEmail}`);

    if (tokensSnapshot.empty) {
      return {
        success: false,
        reason: "no_tokens",
        message: `No FCM tokens found for ${userEmail}. User needs to enable notifications first.`,
        userEmail: userEmail,
        tokenCount: 0,
        preferences: preferences.taskMessages,
      };
    }

    const tokens = tokensSnapshot.docs.map((doc) => doc.data().token);

    // Create test task message notification
    const testNotification = {
      notification: {
        title: "🧪 Test Task Message",
        body: `Test message for task ${taskId}: ${messageContent}`,
      },
      data: {
        url: `/dashboard?task=${taskId}`,
        type: "task_message",
        taskId: taskId,
        senderRole: "expert",
      },
    };

    let sentCount = 0;
    const errors = [];

    // Send to all user's tokens
    for (const token of tokens) {
      try {
        await admin.messaging().send({
          ...testNotification,
          token: token,
        });
        sentCount++;
        console.log(`✅ Test task notification sent to token: ${token.substring(0, 10)}...`);
      } catch (error) {
        console.error(`❌ Failed to send to token ${token.substring(0, 10)}...:`, error);
        errors.push({
          token: token.substring(0, 10) + "...",
          error: error.message,
        });

        // Remove invalid tokens
        if (error.code === "messaging/registration-token-not-registered") {
          try {
            const invalidTokenDocs = await db.collection("fcmTokens")
                .where("token", "==", token)
                .get();
            invalidTokenDocs.forEach((doc) => doc.ref.delete());
            console.log(`🗑️ Removed invalid token: ${token.substring(0, 10)}...`);
          } catch (cleanupError) {
            console.error("Error cleaning up invalid token:", cleanupError);
          }
        }
      }
    }

    // Save test notification to history
    await saveNotificationToHistory(recipientUserId, {
      title: testNotification.notification.title,
      body: testNotification.notification.body,
      type: "task_message_test",
      url: `/dashboard?task=${taskId}`,
      metadata: {
        taskId: taskId,
        testType: "task_notification_test",
        sentCount: sentCount,
        totalTokens: tokens.length,
        errors: errors,
      },
    });

    return {
      success: sentCount > 0,
      userEmail: userEmail,
      taskId: taskId,
      tokenCount: tokens.length,
      sentCount: sentCount,
      errors: errors,
      preferences: preferences.taskMessages,
      message: sentCount > 0 ?
        `Successfully sent ${sentCount}/${tokens.length} task test notifications` :
        `Failed to send any notifications. ${errors.length} errors occurred.`,
    };
  } catch (error) {
    console.error("Error in task notification test:", error);
    throw new Error(`Task notification test failed: ${error.message}`);
  }
});

// Custom Email Verification Function
exports.sendCustomEmailVerification = onCall(async (request) => {
  try {
    const { email, displayName } = request.data;
    
    if (!email) {
      throw new Error('Email is required');
    }

    console.log(`📧 Custom email verification requested for: ${email}`);
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    
    // Check for email service configuration
    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
      console.error('❌ Email configuration missing');
      throw new Error('Email service not configured');
    }
    
    // Add timeout and retry logic
    const generateLinkWithRetry = async (email, maxRetries = 2) => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`📧 Attempt ${attempt} to generate verification link for: ${email}`);
          return await admin.auth().generateEmailVerificationLink(email, {
            url: 'https://landingpage-606e9.firebaseapp.com/__/auth/action',
            handleCodeInApp: false,
          });
        } catch (error) {
          console.error(`❌ Attempt ${attempt} failed:`, error.message);
          if (attempt === maxRetries) throw error;
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    };
    
    // Generate email verification link with retry
    const verificationLink = await generateLinkWithRetry(email);
    
    // Extract user's first name for personalization
    let userName = '';
    if (displayName) {
      userName = displayName.split(' ')[0]; // First name only
    }
    
    // Create email content
    const emailHtml = createEmailVerificationTemplate(verificationLink, userName);
    const t = emailTranslations.en.emailVerification;
    
    // Send email using nodemailer with timeout
    const mailOptions = {
      from: `"RapidWorks" <${emailConfig.auth.user}>`,
      to: email,
      subject: t.subject,
      html: emailHtml,
    };
    
    // Set a timeout for email sending
    const sendMailWithTimeout = (options, timeout = 10000) => {
      return Promise.race([
        emailTransporter.sendMail(options),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email send timeout')), timeout)
        )
      ]);
    };
    
    await sendMailWithTimeout(mailOptions);
    
    console.log(`✅ Custom email verification sent to: ${email}`);
    
    return {
      success: true,
      message: 'Email verification sent successfully',
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error in custom email verification:', error);
    
    // Enhanced error handling with more specific messages
    let errorMessage = 'Failed to send verification email. Please try again.';
    let errorCode = 'unknown';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email address';
      errorCode = 'user-not-found';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
      errorCode = 'invalid-email';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many requests. Please wait before trying again.';
      errorCode = 'rate-limited';
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Request timed out. Please check your connection and try again.';
      errorCode = 'timeout';
    } else if (error.message?.includes('configuration') || error.message?.includes('configured')) {
      errorMessage = 'Email service temporarily unavailable. Please try again later.';
      errorCode = 'service-unavailable';
    } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
      errorMessage = 'Service temporarily at capacity. Please try again in a few minutes.';
      errorCode = 'quota-exceeded';
    }
    
    // Create error object with additional context
    const enhancedError = new Error(errorMessage);
    enhancedError.code = `custom-verification/${errorCode}`;
    enhancedError.originalError = error.message;
    
    throw enhancedError;
  }
});

// Custom Password Reset Function
exports.sendCustomPasswordReset = onCall(async (request) => {
  try {
    const { email } = request.data;
    
    if (!email) {
      throw new Error('Email is required');
    }

    console.log(`🔐 Custom password reset requested for: ${email}`);
    
    // Generate password reset link using Firebase Admin
    const resetLink = await admin.auth().generatePasswordResetLink(email, {
      url: 'https://landingpage-606e9.firebaseapp.com/__/auth/action',
      handleCodeInApp: false,
    });
    
    // Get user info for personalization
    let userName = '';
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      userName = userRecord.displayName || '';
    } catch (userError) {
      console.log('User not found or error getting user info:', userError.message);
      // Continue anyway - email might be valid but user record not created yet
    }
    
    // Create email content
    const emailHtml = createPasswordResetEmailTemplate(resetLink, userName);
    const t = emailTranslations.en.passwordReset;
    
    // Send email using nodemailer
    await emailTransporter.sendMail({
      from: `"RapidWorks" <${emailConfig.auth.user}>`,
      to: email,
      subject: t.subject,
      html: emailHtml,
    });
    
    console.log(`✅ Custom password reset email sent to: ${email}`);
    
    return {
      success: true,
      message: 'Password reset email sent successfully'
    };
    
  } catch (error) {
    console.error('Error in custom password reset:', error);
    
    // Return user-friendly error messages
    if (error.code === 'auth/user-not-found') {
      throw new Error('No account found with this email address');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    } else {
      throw new Error('Failed to send password reset email. Please try again.');
    }
  }
});

// Twilio WhatsApp Message Function
exports.sendTwilioWhatsApp = onCall(async (request) => {
  try {
    const { phoneNumber, userName, orgName } = request.data;
    
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    console.log(`📱 Twilio WhatsApp request for: ${phoneNumber}`);
    
    // Twilio configuration from environment variables (.env file)
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioWhatsAppFrom = process.env.TWILIO_WHATSAPP_FROM;
    
    if (!twilioAccountSid || !twilioAuthToken || !twilioWhatsAppFrom) {
      throw new Error('Twilio configuration missing');
    }
    
    // Format phone number
    const formatPhoneNumber = (number) => {
      const cleaned = number.replace(/\D/g, '');
      
      // Ghana numbers
      if (cleaned.startsWith('233')) {
        return `+${cleaned}`;
      } 
      // German numbers with country code
      else if (cleaned.startsWith('49')) {
        return `+${cleaned}`;
      }
      // Local numbers starting with 0
      else if (cleaned.startsWith('0')) {
        if (cleaned.length === 10) {
          // Ghana local: 0501311059 -> +233501311059
          return `+233${cleaned.substring(1)}`;
        } else if (cleaned.length >= 11) {
          // German local: 054123456789 -> +49541234567 (remove leading 0)
          return `+49${cleaned.substring(1)}`;
        } else {
          // Default to Ghana for shorter numbers
          return `+233${cleaned.substring(1)}`;
        }
      } 
      // Numbers without country code
      else if (!cleaned.startsWith('+')) {
        return `+${cleaned}`;
      }
      
      return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
    };
    
    const formattedNumber = formatPhoneNumber(phoneNumber);
    const message = `Welcome to RapidWorks ${userName || 'User'}. Your organization ${orgName || 'your personal account'} was created successfully`;
    
    // Call Twilio API
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
    
    const formData = new URLSearchParams();
    formData.append('To', `whatsapp:${formattedNumber}`);
    formData.append('From', twilioWhatsAppFrom);
    formData.append('Body', message);
    
    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Twilio API error: ${error.message || 'Unknown error'}`);
    }
    
    const result = await response.json();
    console.log(`✅ WhatsApp message sent successfully: ${result.sid}`);
    
    return {
      success: true,
      messageSid: result.sid,
      to: formattedNumber,
      message: 'WhatsApp message sent successfully'
    };
    
  } catch (error) {
    console.error('Error sending Twilio WhatsApp message:', error);
    throw new Error(`Failed to send WhatsApp message: ${error.message}`);
  }
});
