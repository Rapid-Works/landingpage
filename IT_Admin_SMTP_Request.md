# Microsoft 365 SMTP Authentication Enable Request

**To:** IT Admin
**From:** Samuel Donkor
**Subject:** Enable SMTP Authentication for Microsoft 365 Tenant

---

## Request Summary
I need SMTP Authentication enabled for our Microsoft 365 tenant to send automated emails from our RapidWorks application using the noreply@rapid-works.io email address.

## Current Issue
When attempting to send emails via SMTP, I receive this error:
```
535 5.7.139 Authentication unsuccessful, SmtpClientAuthentication is disabled for the Tenant
```

## What Needs to Be Done

### Option 1: Enable SMTP AUTH for Entire Tenant (Recommended)
1. **Go to Microsoft 365 Admin Center** (admin.microsoft.com)
2. **Navigate to Exchange Admin Center**
3. **Go to Mail flow > Auth policies**
4. **Enable "Authenticated SMTP" for the organization**

### Option 2: Enable SMTP AUTH for Specific User
1. **Go to Exchange Admin Center**
2. **Recipients > Mailboxes**
3. **Select user: samuel.donkor@rapid-works.io**
4. **Click "Manage email apps settings"**
5. **Enable "Authenticated SMTP"**

## Alternative: PowerShell Command
You can also run this PowerShell command:
```powershell
Set-CASMailbox -Identity "samuel.donkor@rapid-works.io" -SmtpClientAuthenticationDisabled $false
```

## Technical Details
- **SMTP Server:** smtp.office365.com
- **Port:** 587
- **Security:** STARTTLS
- **Purpose:** Sending automated email verification and notifications from RapidWorks application

## Business Justification
This is required for our customer onboarding system to send:
- Email verification messages
- Password reset emails  
- Important account notifications

## Security Note
SMTP Authentication is widely used and considered secure when combined with TLS encryption (which we're using).

## Timeline
This change is needed for our production application. Please let me know if you need any additional information.

Thank you!

---
**Contact:** samuel.donkor@rapid-works.io
**Application:** RapidWorks Platform
