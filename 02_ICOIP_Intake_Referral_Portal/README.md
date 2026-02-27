# ICOIP Intake & Referral Portal

This folder is a **client-facing near-full demo** for a standalone Google Apps Script portal under ICOIP.

## What this version includes
- demo login with 4 roles: Admin / Manager / Officer / Viewer
- role-based feature visibility
- live CRUD records
- workflow action buttons
- attachment upload to Google Drive (max 4MB per upload in this demo)
- email notification sending
- audit log
- printable / PDF-style summary page
- recent activity feed
- notifications log

## Files
- `Config.gs` - portal-specific config, workflow, fields, seed data
- `Setup.gs` - one-click sheet setup and demo reset
- `Server.gs` - GAS web app entry points and callable functions
- `Db.gs` - sheet, record, workflow, attachment, notification logic
- `Utils.gs` - helpers, permissions, print builder
- `Index.html` - portal UI shell
- `Styles.html` - responsive styling
- `Scripts.html` - client-side UI logic
- `appsscript.json` - manifest

## Fastest setup
1. Create a **new Google Sheet**
2. Open **Extensions > Apps Script**
3. Replace the default files with these files
4. Save all files
5. Run `setupProject()` once
6. Deploy as **Web app**
7. Open the web app and choose a demo user

## Demo notes
- This is **near-full demo** quality, not production security.
- The login is a **demo user switcher**, not Google authentication.
- Attachments are uploaded into a Google Drive folder created automatically.
- Email sending uses Apps Script mail permissions.

## Best demo flow
1. Enter as **Admin**
2. Open a record
3. Run a workflow action
4. Upload an attachment
5. Send an email
6. Open print view

## Future production upgrade path
- real sign-in / RBAC
- row-level access policy
- PDPA controls
- approval routing and SLA engine
- Drive folder segregation by case
- PDF generation and e-signature
- calendar booking
- WhatsApp / SMS integration
