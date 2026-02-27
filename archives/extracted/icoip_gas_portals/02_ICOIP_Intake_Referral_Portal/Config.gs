const APP_CONFIG = {
  PROJECT_NAME: "ICOIP Intake & Referral Portal",
  PORTAL_CODE: "INT",
  PRIMARY_SHEET: "IntakeReferrals",
  AUDIT_SHEET: 'AuditLog',
  SPREADSHEET_ID: '', // Optional. Leave blank for container-bound Apps Script.
  TIMEZONE: Session.getScriptTimeZone() || 'Asia/Singapore',
  PROGRAMME_NAME: 'Integrated Care & Operations Intelligence Programme (ICOIP)',
  PROGRAMME_DESCRIPTION: 'The Integrated Care & Operations Intelligence Programme (ICOIP) is a unified digital ecosystem that integrates volunteer management, beneficiary intake, counselling services, administrative governance, and AI-powered learning development into a structured operational framework.',
  PAGE_TITLE: "Intake & Referral Portal",
  PAGE_SUBTITLE: "Manage beneficiary intake, referrals, eligibility screening, prioritisation, and case assignment.",
  TABLE_COLUMNS: [
  "Record ID",
  "Beneficiary Name",
  "Contact",
  "Referral Source",
  "Programme",
  "Eligibility Status",
  "Case Status",
  "Assigned Officer",
  "Intake Date",
  "Priority",
  "Notes",
  "Created At",
  "Updated At"
],
  FORM_FIELDS: [
  {
    "key": "Beneficiary Name",
    "label": "Beneficiary Name",
    "input": "text",
    "required": true
  },
  {
    "key": "Contact",
    "label": "Contact",
    "input": "text",
    "required": true
  },
  {
    "key": "Referral Source",
    "label": "Referral Source",
    "input": "select",
    "required": true,
    "options": [
      "Self Referral",
      "Hospital",
      "Community Partner",
      "Family Member",
      "School",
      "Agency"
    ]
  },
  {
    "key": "Programme",
    "label": "Programme",
    "input": "select",
    "required": true,
    "options": [
      "Active Ageing",
      "Counselling",
      "Financial Support",
      "Volunteer Support",
      "Training"
    ]
  },
  {
    "key": "Eligibility Status",
    "label": "Eligibility Status",
    "input": "select",
    "required": true,
    "options": [
      "Pending",
      "Eligible",
      "Not Eligible"
    ]
  },
  {
    "key": "Case Status",
    "label": "Case Status",
    "input": "select",
    "required": true,
    "options": [
      "Open",
      "In Review",
      "Assigned",
      "Closed"
    ]
  },
  {
    "key": "Assigned Officer",
    "label": "Assigned Officer",
    "input": "text",
    "required": false
  },
  {
    "key": "Intake Date",
    "label": "Intake Date",
    "input": "date",
    "required": true
  },
  {
    "key": "Priority",
    "label": "Priority",
    "input": "select",
    "required": true,
    "options": [
      "Low",
      "Medium",
      "High",
      "Urgent"
    ]
  },
  {
    "key": "Notes",
    "label": "Notes",
    "input": "textarea",
    "required": false
  }
],
  DASHBOARD_METRICS: [
  {
    "id": "totalRecords",
    "label": "Total Cases",
    "type": "count"
  },
  {
    "id": "statusOpen",
    "label": "Open Cases",
    "type": "equals",
    "field": "Case Status",
    "value": "Open"
  },
  {
    "id": "eligibleCount",
    "label": "Eligible Cases",
    "type": "equals",
    "field": "Eligibility Status",
    "value": "Eligible"
  },
  {
    "id": "priorityUrgent",
    "label": "Urgent Cases",
    "type": "equals",
    "field": "Priority",
    "value": "Urgent"
  }
],
  SAMPLE_ROWS: [
  [
    "INT-20260227-001",
    "Mdm Lim",
    "97771111",
    "Hospital",
    "Active Ageing",
    "Eligible",
    "Assigned",
    "Sarah Ng",
    "2026-02-19",
    "High",
    "Home visit requested",
    "2026-02-19 09:00:00",
    "2026-02-21 10:20:00"
  ],
  [
    "INT-20260227-002",
    "Mr Kumar",
    "96662222",
    "Community Partner",
    "Counselling",
    "Pending",
    "In Review",
    "Daniel Teo",
    "2026-02-23",
    "Urgent",
    "Immediate psychosocial check needed",
    "2026-02-23 13:10:00",
    "2026-02-24 11:45:00"
  ],
  [
    "INT-20260227-003",
    "Ms Wong",
    "95553333",
    "Self Referral",
    "Training",
    "Eligible",
    "Open",
    "",
    "2026-02-26",
    "Medium",
    "Seeking caregiver skills workshop",
    "2026-02-26 08:25:00",
    "2026-02-26 08:25:00"
  ]
]
};
