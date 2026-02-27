#!/usr/bin/env bash
# push-all.sh — Push all ICOIP portal folders to Google Apps Script via clasp.
#
# Prerequisites:
#   npm install -g @google/clasp
#   clasp login
#
# Usage:
#   ./push-all.sh          Push all portals
#   ./push-all.sh 01       Push only the portal whose folder starts with "01"

set -euo pipefail

PORTALS=(
  "00_ICOIP_Master_Suite_Demo"
  "01_ICOIP_Volunteer_Management_Portal"
  "02_ICOIP_Intake_Referral_Portal"
  "03_ICOIP_Counselling_Client_Portal"
  "04_ICOIP_Admin_Portal"
  "05_ICOIP_AI_Training_Curriculum_Portal"
)

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
FILTER="${1:-}"

pushed=0
skipped=0
failed=0

for portal in "${PORTALS[@]}"; do
  # If a filter argument was given, skip non-matching portals
  if [[ -n "$FILTER" && "$portal" != "$FILTER"* ]]; then
    continue
  fi

  dir="$ROOT_DIR/$portal"

  if [[ ! -f "$dir/.clasp.json" ]]; then
    echo "⚠  Skipping $portal — no .clasp.json found."
    echo "   Copy .clasp.json.example to .clasp.json and set your Script ID."
    skipped=$((skipped + 1))
    continue
  fi

  echo "🚀 Pushing $portal …"
  if (cd "$dir" && clasp push); then
    echo "✅ $portal pushed successfully."
    pushed=$((pushed + 1))
  else
    echo "❌ $portal push failed."
    failed=$((failed + 1))
  fi
  echo ""
done

echo "———————————————————————————"
echo "Done.  Pushed: $pushed | Skipped: $skipped | Failed: $failed"
