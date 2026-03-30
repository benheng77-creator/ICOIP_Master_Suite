# ICOIP GAS Demo Portals — Handover

You asked for **5 separate Google Apps Script projects**, each with its own spreadsheet-backed portal so clients can later mix and match modules.

## Included portals
1. Volunteer Management Portal
2. Intake & Referral Portal
3. Counselling & Client Portal
4. Admin Portal
5. AI Training & Curriculum Development Portal

## Shared architecture pattern
Every project uses:
- HTML Service web app with `doGet()`
- `google.script.run` for async client → server calls
- Google Sheets as the database
- `LockService` for safer writes
- One primary data tab + one `AuditLog` tab
- Generic CRUD driven by `Config.gs`

## Why this pattern
This keeps all five demos visually consistent while still allowing each one to have:
- its own sheet schema
- its own dashboard metrics
- its own dropdown options
- its own sample data

## Intended next upgrade path
Future AI / developer can:
- add RBAC and session validation
- add file uploads with Drive
- add PDF exports
- add WhatsApp / email notifications
- merge selected modules into one unified multi-portal ICOIP project
- connect all portals to one master reporting sheet

## Recommended merge approach later
When client wants a customised bundle:
- keep the current `Config.gs` schema-driven pattern
- merge all modules into one Apps Script project
- convert each portal to one route / view
- centralise audit, users, and shared lookups

## Deployment model
Fastest demo deployment:
- one spreadsheet per portal
- one container-bound script per spreadsheet
- deploy each as a separate web app

This is the lowest-step route for demos and avoids needing spreadsheet IDs.
