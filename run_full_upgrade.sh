#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/Admin/Projects/ICOIP_Master_Suite"
cd "$ROOT"

PORTALS=(
  "00_ICOIP_Master_Suite_Demo"
  "01_ICOIP_Volunteer_Management_Portal"
  "02_ICOIP_Intake_Referral_Portal"
  "03_ICOIP_Counselling_Client_Portal"
  "04_ICOIP_Admin_Portal"
  "05_ICOIP_AI_Training_Curriculum_Portal"
)

echo "== 1) Patch Db.gs + Config.gs =="
python3 - <<'PY'
from pathlib import Path
import re

root = Path("/Users/Admin/Projects/ICOIP_Master_Suite")
portals = [
  "00_ICOIP_Master_Suite_Demo",
  "01_ICOIP_Volunteer_Management_Portal",
  "02_ICOIP_Intake_Referral_Portal",
  "03_ICOIP_Counselling_Client_Portal",
  "04_ICOIP_Admin_Portal",
  "05_ICOIP_AI_Training_Curriculum_Portal",
]

db_get_spreadsheet = """function getSpreadsheet_() {
  var cfgObj = null;
  if (typeof CONFIG !== 'undefined' && CONFIG) cfgObj = CONFIG;
  if (!cfgObj && typeof ICOIP_MASTER_CONFIG !== 'undefined' && ICOIP_MASTER_CONFIG) cfgObj = ICOIP_MASTER_CONFIG;

  var cfgId = String(
    (cfgObj && (cfgObj.SPREADSHEET_ID || cfgObj.MASTER_SPREADSHEET_ID || cfgObj.DATA_SPREADSHEET_ID)) || ''
  ).trim();
  if (cfgId) return SpreadsheetApp.openById(cfgId);

  var props = PropertiesService.getScriptProperties();
  var propId = String(
    props.getProperty('SPREADSHEET_ID') ||
    props.getProperty('MASTER_SPREADSHEET_ID') ||
    props.getProperty('DATA_SPREADSHEET_ID') ||
    ''
  ).trim();
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

db_get_or_create = """function getOrCreateSheet_(name, headers) {
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

pat_get_ss = re.compile(r"function\s+getSpreadsheet_\s*\([^)]*\)\s*\{[\s\S]*?\n\}", re.M)
pat_get_oc = re.compile(r"function\s+getOrCreateSheet_\s*\([^)]*\)\s*\{[\s\S]*?\n\}", re.M)

for portal in portals:
    db = root / portal / "Db.gs"
    if db.exists():
        s = db.read_text(encoding="utf-8", errors="ignore")
        orig = s
        if pat_get_ss.search(s): s = pat_get_ss.sub(db_get_spreadsheet, s, count=1)
        else: s += "\n\n" + db_get_spreadsheet + "\n"
        if pat_get_oc.search(s): s = pat_get_oc.sub(db_get_or_create, s, count=1)
        else: s += "\n\n" + db_get_or_create + "\n"
        if s != orig:
            db.with_suffix(".gs.bak").write_text(orig, encoding="utf-8")
            db.write_text(s, encoding="utf-8")
            print(f"patched Db.gs: {portal}")

# Add compatibility aliases to 01..05 Config.gs
aliases = [
  ("PRIMARY_COLUMNS","TABLE_COLUMNS"),
  ("USERS_COLUMNS","USER_COLUMNS"),
  ("ATTACHMENTS_COLUMNS","ATTACHMENT_COLUMNS"),
  ("NOTIFICATIONS_COLUMNS","NOTIFICATION_COLUMNS"),
]
for portal in portals[1:]:
    cfg = root / portal / "Config.gs"
    if not cfg.exists(): 
        continue
    t = cfg.read_text(encoding="utf-8", errors="ignore")
    o = t
    missing = [f"  {k}: {v}," for k,v in aliases if not re.search(rf"\\b{k}\\b\\s*[:=]", t)]
    if missing:
        idx = t.rfind("};")
        if idx == -1: idx = t.rfind("}")
        if idx != -1:
            t = t[:idx] + "\n" + "\n".join(missing) + "\n" + t[idx:]
            cfg.with_suffix(".gs.bak").write_text(o, encoding="utf-8")
            cfg.write_text(t, encoding="utf-8")
            print(f"patched Config.gs: {portal}")
PY

echo "== 2) Write and run deep healthcheck =="
mkdir -p tools
cat > tools/healthcheck_phase2.py <<'PY'
#!/usr/bin/env python3
from pathlib import Path
import re, json

ROOT = Path(__file__).resolve().parents[1]
PORTALS = [
    "00_ICOIP_Master_Suite_Demo",
    "01_ICOIP_Volunteer_Management_Portal",
    "02_ICOIP_Intake_Referral_Portal",
    "03_ICOIP_Counselling_Client_Portal",
    "04_ICOIP_Admin_Portal",
    "05_ICOIP_AI_Training_Curriculum_Portal",
]
REQ_FILES = ["Db.gs","Setup.gs","Server.gs"]
REQ_FUNCS = ["setupProject","setupProject_","getSpreadsheet_","getOrCreateSheet_","doGet","ping"]

def read(p): return p.read_text(encoding="utf-8", errors="ignore") if p.exists() else ""
def funcs(txt): return set(re.findall(r"\bfunction\s+([A-Za-z0-9_]+)\s*\(", txt))

report = {"summary":{"OK":0,"WARNING":0,"ERROR":0},"portals":{}}
for portal in PORTALS:
    d = ROOT / portal
    item = {"status":"OK","errors":[],"warnings":[]}
    if not d.exists():
        item["status"]="ERROR"; item["errors"].append("missing folder")
        report["summary"]["ERROR"] += 1; report["portals"][portal]=item; continue

    miss = [f for f in REQ_FILES if not (d/f).exists()]
    if miss:
        item["status"]="ERROR"; item["errors"].append("missing files: " + ", ".join(miss))

    all_gs = "\n".join(read(p) for p in d.glob("*.gs"))
    fns = funcs(all_gs)
    missing_fns = [f for f in REQ_FUNCS if f not in fns]
    if missing_fns:
        item["status"]="ERROR"; item["errors"].append("missing functions: " + ", ".join(missing_fns))

    cfg = read(d/"Config.gs")
    if re.search(r"\b(SPREADSHEET_ID|MASTER_SPREADSHEET_ID|DATA_SPREADSHEET_ID)\b\s*[:=]\s*['\"]\s*['\"]", cfg):
        if item["status"]=="OK": item["status"]="WARNING"
        item["warnings"].append("blank Spreadsheet ID found (fallback required)")

    report["portals"][portal] = item
    report["summary"][item["status"]] += 1

print("=== FULL AUDIT REPORT ===")
for p,r in report["portals"].items():
    print(f"\n[{p}] {r['status']}")
    for e in r["errors"]: print("  ERROR:", e)
    for w in r["warnings"]: print("  WARN :", w)
    if not r["errors"] and not r["warnings"]: print("  OK   : passed")
print("\nSummary:", report["summary"])
(ROOT / "healthcheck_phase2_report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print("Saved: healthcheck_phase2_report.json")
PY
chmod +x tools/healthcheck_phase2.py
python3 tools/healthcheck_phase2.py

echo "== 3) Push all portals to GAS with clasp =="
if ! command -v clasp >/dev/null 2>&1; then
  npm i -g @google/clasp
fi

clasp login || true

for d in "${PORTALS[@]}"; do
  echo ""
  echo "---- $d ----"
  cd "$ROOT/$d"

  # If no project binding, create new standalone GAS project
  if [ ! -f ".clasp.json" ]; then
    clasp create --type standalone --title "$d" --rootDir . || true
  fi

  clasp push
done

echo ""
echo "DONE: Patch + Audit + Push complete."
