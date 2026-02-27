# ICOIP Master Suite Demo (Merged)

This folder contains **one Google Apps Script web app** that merges all five ICOIP demo modules into a single master suite:

- Volunteer Management Portal
- Intake & Referral Portal
- Counselling & Client Portal
- Admin Portal
- AI Training & Curriculum Development Portal

## What this master suite does

- module selector (5 portal cards)
- demo user switcher (Admin / Manager / Officer / Viewer)
- role-based UI permissions
- full CRUD per module
- workflow action buttons per module
- attachment upload to Drive
- email notification sending
- audit log
- printable / PDF-style record summary
- reset current module demo data
- reset all demo data

## Fastest setup

1. Create **one new Google Sheet**
2. Open **Extensions → Apps Script**
3. Paste all files from this folder into the script project
4. Run **setupProject()** once
5. Deploy as **Web app**

## Important notes

- Leave `SPREADSHEET_ID` blank for the fastest setup if using a container-bound script attached to the Sheet.
- Attachment upload and email sending require Google permissions on first run.
- This is **near-full demo functionality**, not production authentication / security.
- Demo users are seeded into the `Users` sheet.

## Sheets created by setupProject()

Shared:
- Users
- AuditLog
- Attachments
- Notifications

Modules:
- Volunteers
- IntakeReferrals
- CounsellingCases
- AdminTasks
- TrainingRequests
