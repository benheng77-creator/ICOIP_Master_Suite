# ICOIP Master Suite + Standalone GAS Portal Packs

This repo contains:

## Main build
- 00_ICOIP_Master_Suite_Demo
- 01_ICOIP_Volunteer_Management_Portal
- 02_ICOIP_Intake_Referral_Portal
- 03_ICOIP_Counselling_Client_Portal
- 04_ICOIP_Admin_Portal
- 05_ICOIP_AI_Training_Curriculum_Portal
- HANDOVER.md

## Archived extracted folders
- archives/extracted/icoip_gas_portals
- archives/extracted/icoip_gas_portals_near_full

## Pushing to Google Apps Script

Each portal folder is a self-contained Google Apps Script project. Use [clasp](https://github.com/google/clasp) to push these files to Google Apps Script.

### One-time setup

```bash
# 1. Install clasp globally
npm install -g @google/clasp

# 2. Log in to your Google account
clasp login
```

### Per-portal setup

For each portal you want to deploy:

1. Create a new Google Apps Script project at https://script.google.com or use an existing Script ID.
2. Copy the example config and fill in your Script ID:
   ```bash
   cd 01_ICOIP_Volunteer_Management_Portal
   cp .clasp.json.example .clasp.json
   # Edit .clasp.json and replace YOUR_SCRIPT_ID_HERE with the real Script ID
   ```
3. Push the files:
   ```bash
   clasp push
   ```

### Push all portals at once

After configuring `.clasp.json` in each portal folder, run:

```bash
./push-all.sh          # Push all portals
./push-all.sh 01       # Push only the portal starting with "01"
```

> **Note:** `.clasp.json` files are git-ignored because they contain project-specific Script IDs. Each developer creates their own from the `.clasp.json.example` template.
