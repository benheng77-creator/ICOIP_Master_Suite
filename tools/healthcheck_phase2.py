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
