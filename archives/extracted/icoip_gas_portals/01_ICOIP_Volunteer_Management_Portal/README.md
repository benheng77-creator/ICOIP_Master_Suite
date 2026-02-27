# ICOIP Volunteer Management Portal

This folder is a ready-to-paste **Google Apps Script web app** for the **Volunteer Management Portal** under the **Integrated Care & Operations Intelligence Programme (ICOIP)**.

## What this project already does
- Responsive HTMLService web app
- Google Sheets-backed CRUD
- Dashboard counters
- Search
- Edit / delete
- Audit log sheet
- Demo seed data
- Neutral enterprise UI

## Files and purpose
- `appsscript.json` — GAS manifest
- `Config.gs` — portal-specific labels, columns, dropdowns, metrics, and sample rows
- `Setup.gs` — setup and reset demo data
- `Server.gs` — web app entry and CRUD server actions
- `Db.gs` — spreadsheet read/write logic
- `Utils.gs` — helpers, formatting, and validation support
- `Index.html` — main app shell
- `Styles.html` — UI styling
- `Scripts.html` — client-side rendering and event handling

## Fastest setup
1. Create **one new Google Sheet** for this portal.
2. Open that sheet → **Extensions → Apps Script**.
3. Delete the default files.
4. Copy every file from this folder into the Apps Script project.
5. Save.
6. Run `setupProject()` once and approve permissions.
7. Deploy → **New deployment** → **Web app**.
8. Execute as **Me**.
9. Who has access: **Anyone with the link** (for demo) or your preferred restricted mode.

## Optional standalone mode
If this is **not** a container-bound script, paste the Spreadsheet ID into:
`Config.gs` → `SPREADSHEET_ID`

## Main data tabs created
- `Volunteers`
- `AuditLog`

## Notes
- This build is **demo-first**. It does **not** include login/RBAC yet.
- It is designed so you can later merge multiple portals into one larger ICOIP suite.
