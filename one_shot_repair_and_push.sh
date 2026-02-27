#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/Admin/Projects/ICOIP_Master_Suite"
LOG="$ROOT/one_shot_repair_$(date +%Y%m%d_%H%M%S).log"
exec > >(tee -a "$LOG") 2>&1

echo "Starting one-shot repair at $(date)"
cd "$ROOT"

PORTALS=(
  "00_ICOIP_Master_Suite_Demo"
  "01_ICOIP_Volunteer_Management_Portal"
  "02_ICOIP_Intake_Referral_Portal"
  "03_ICOIP_Counselling_Client_Portal"
  "04_ICOIP_Admin_Portal"
  "05_ICOIP_AI_Training_Curriculum_Portal"
)

echo "== A) Repair Config.gs + Db.gs =="
python3 - <<'PY'
from pathlib import Path
import re, time

root = Path("/Users/Admin/Projects/ICOIP_Master_Suite")
portals = [
  "00_ICOIP_Master_Suite_Demo",
  "01_ICOIP_Volunteer_Management_Portal",
  "02_ICOIP_Intake_Referral_Portal",
  "03_ICOIP_Counselling_Client_Portal",
  "04_ICOIP_Admin_Portal",
  "05_ICOIP_AI_Training_Curriculum_Portal",
]

# Safe Db hardening
new_get_spreadsheet = """function getSpreadsheet_() {
  var cfgObj = null;
  if (typeof CONFIG !== 'undefined' && CONFIG) cfgObj = CONFIG;
  if (!cfgObj && typeof ICOIP_MASTER_CONFIG !== 'undefined' && ICOIP_MASTER_CONFIG) cfgObj = ICOIP_MASTER_CONFIG;

  var cfgId = String((cfgObj && (cfgObj.SPREADSHEET_ID || cfgObj.MASTER_SPREADSHEET_ID || cfgObj.DATA_SPREADSHEET_ID)) || '').trim();
  if (cfgId) return SpreadsheetApp.openById(cfgId);

  var props = PropertiesService.getScriptProperties();
  var propId = String(props.getProperty('SPREADSHEET_ID') || props.getProperty('MASTER_SPREADSHEET_ID') || props.getProperty('DATA_SPREADSHEET_ID') || '').trim();
  if (propId) return SpreadsheetApp.openById(propId);

  var active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) {
    props.setProperty('SPREADSHEET_ID', active.getId());
    props.setProperty('MASTER_SPREADSHEET_ID', active.getId());
    props.setProperty('DATA_SPREADSHEET_ID', active.getId());
    return active;
  }

  var created = SpreadsheetApp.create('ICOIP_Data_' + new Date().getTime());
  props.setProperty('SPREADSHEET_ID', created.getId());
  props.setProperty('MASTER_SPREADSHEET_ID', created.getId());
  props.setProperty('DATA_SPREADSHEET_ID', created.getId());
  return created;
}"""

new_get_or_create = """function getOrCreateSheet_(name, headers) {
  var ss = getSpreadsheet_();
  if (!ss) throw new Error('Spreadsheet initialization failed');

  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);

  if (headers && headers.length) {
    var current = sh.getLastRow() > 0 ? sh.getRange(1, 1, 1, headers.length).getValues()[0] : [];
    var same = current.length === headers.length && current.every(function(v, i){ return String(v) === String(headers[i]); });
    if (!same) sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  return sh;
}"""

pat_ss = re.compile(r"function\s+getSpreadsheet_\s*\([^)]*\)\s*\{[\s\S]*?\n\}", re.M)
pat_oc = re.compile(r"function\s+getOrCreateSheet_\s*\([^)]*\)\s*\{[\s\S]*?\n\}", re.M)

# Remove problematic alias lines that caused Config syntax errors
alias_line = re.compile(r"^\s*(PRIMARY_COLUMNS|USERS_COLUMNS|ATTACHMENTS_COLUMNS|NOTIFICATIONS_COLUMNS)\s*:\s*[A-Z_]+\s*,?\s*$", re.M)

for portal in portals:
    # Config cleanup (01..05)
    if portal != "00_ICOIP_Master_Suite_Demo":
        cfg = root / portal / "Config.gs"
        if cfg.exists():
            txt = cfg.read_text(encoding="utf-8", errors="ignore")
            clean = alias_line.sub("", txt)
            if clean != txt:
                cfg.with_suffix(f".gs.autofix_{int(time.time())}.bak").write_text(txt, encoding="utf-8")
                cfg.write_text(clean, encoding="utf-8")
                print(f"[FIX] {portal}/Config.gs cleaned")

    # Db hardening (00..05)
    db = root / portal / "Db.gs"
    if db.exists():
        txt = db.read_text(encoding="utf-8", errors="ignore")
        orig = txt
        if pat_ss.search(txt): txt = pat_ss.sub(new_get_spreadsheet, txt, count=1)
        else: txt += "\n\n" + new_get_spreadsheet + "\n"
        if pat_oc.search(txt): txt = pat_oc.sub(new_get_or_create, txt, count=1)
        else: txt += "\n\n" + new_get_or_create + "\n"
        if txt != orig:
            db.with_suffix(f".gs.autofix_{int(time.time())}.bak").write_text(orig, encoding="utf-8")
            db.write_text(txt, encoding="utf-8")
            print(f"[FIX] {portal}/Db.gs hardened")

print("Repair patch complete.")
PY

echo "== B) Local static audit =="
python3 - <<'PY'
from pathlib import Path
import re, json
root = Path("/Users/Admin/Projects/ICOIP_Master_Suite")
portals = [
  "00_ICOIP_Master_Suite_Demo",
  "01_ICOIP_Volunteer_Management_Portal",
  "02_ICOIP_Intake_Referral_Portal",
  "03_ICOIP_Counselling_Client_Portal",
  "04_ICOIP_Admin_Portal",
  "05_ICOIP_AI_Training_Curriculum_Portal",
]
must = ["setupProject","setupProject_","getSpreadsheet_","getOrCreateSheet_","doGet","ping"]
rep = {"summary":{"OK":0,"ERROR":0},"portals":{}}
for p in portals:
    d=root/p
    t="\n".join((f.read_text(encoding="utf-8",errors="ignore") for f in d.glob("*.gs"))) if d.exists() else ""
    miss=[m for m in must if not re.search(rf"\bfunction\s+{m}\s*\(", t)]
    if miss:
        rep["portals"][p]={"status":"ERROR","missing":miss}
        rep["summary"]["ERROR"]+=1
    else:
        rep["portals"][p]={"status":"OK","missing":[]}
        rep["summary"]["OK"]+=1
out=root/"healthcheck_phase2_report.json"
out.write_text(json.dumps(rep,indent=2),encoding="utf-8")
print("Summary:", rep["summary"])
print("Saved:", out)
PY

echo "== C) Push all projects with clasp =="
command -v clasp >/dev/null 2>&1 || npm i -g @google/clasp
clasp login --no-localhost || true

for d in "${PORTALS[@]}"; do
  echo "---- $d ----"
  cd "$ROOT/$d"
  if [ ! -f ".clasp.json" ]; then
    clasp create --type standalone --title "$d" --rootDir . || true
  fi
  clasp push
done

echo "Completed at $(date)"
echo "Log: $LOG"
