# ICOIP Master Suite + Standalone Demo Pack

This bundle keeps the 5 standalone near-full demos intact and adds a new merged master suite.

## Included folders

- `00_ICOIP_Master_Suite_Demo` → single GAS project / single Sheet / 5 switchable modules
- `01_ICOIP_Volunteer_Management_Portal` → standalone project
- `02_ICOIP_Intake_Referral_Portal` → standalone project
- `03_ICOIP_Counselling_Client_Portal` → standalone project
- `04_ICOIP_Admin_Portal` → standalone project
- `05_ICOIP_AI_Training_Curriculum_Portal` → standalone project

## Master suite architecture

- one shared web app shell
- one shared demo user table
- one shared audit log
- one shared attachments log
- one shared notifications log
- one module card selector on the front-end
- one spreadsheet with five module sheets

## Why this is useful

- lets clients experience one integrated suite
- still preserves separate portal selling options
- easier to demo mix-and-match module strategy
- one codebase for a combined showcase

## Current security posture

- demo role switching only
- no real authentication / SSO
- no production RBAC hardening
- no PDPA-grade data segregation yet

## Best next upgrade after this

1. real authentication
2. true server-side RBAC + row filtering
3. one shared master dashboard across modules
4. cross-module referrals / linked records
5. PDF export to Drive + email attachments
