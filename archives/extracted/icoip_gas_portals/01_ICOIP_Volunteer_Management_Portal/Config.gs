const APP_CONFIG = {
  PROJECT_NAME: "ICOIP Volunteer Management Portal",
  PORTAL_CODE: "VOL",
  PRIMARY_SHEET: "Volunteers",
  AUDIT_SHEET: 'AuditLog',
  SPREADSHEET_ID: '', // Optional. Leave blank for container-bound Apps Script.
  TIMEZONE: Session.getScriptTimeZone() || 'Asia/Singapore',
  PROGRAMME_NAME: 'Integrated Care & Operations Intelligence Programme (ICOIP)',
  PROGRAMME_DESCRIPTION: 'The Integrated Care & Operations Intelligence Programme (ICOIP) is a unified digital ecosystem that integrates volunteer management, beneficiary intake, counselling services, administrative governance, and AI-powered learning development into a structured operational framework.',
  PAGE_TITLE: "Volunteer Management Portal",
  PAGE_SUBTITLE: "Manage volunteer registration, onboarding, scheduling, engagement tracking, and reporting.",
  TABLE_COLUMNS: [
  "Record ID",
  "Volunteer Name",
  "Email",
  "Phone",
  "Volunteer Role",
  "Preferred Area",
  "Status",
  "Onboarding Status",
  "Last Activity Date",
  "Hours Contributed",
  "Notes",
  "Created At",
  "Updated At"
],
  FORM_FIELDS: [
  {
    "key": "Volunteer Name",
    "label": "Volunteer Name",
    "input": "text",
    "required": true
  },
  {
    "key": "Email",
    "label": "Email",
    "input": "email",
    "required": true
  },
  {
    "key": "Phone",
    "label": "Phone",
    "input": "text",
    "required": false
  },
  {
    "key": "Volunteer Role",
    "label": "Volunteer Role",
    "input": "select",
    "required": true,
    "options": [
      "Befriender",
      "Driver",
      "Programme Support",
      "Event Support",
      "Admin Support"
    ]
  },
  {
    "key": "Preferred Area",
    "label": "Preferred Area",
    "input": "select",
    "required": true,
    "options": [
      "Active Ageing",
      "Counselling Support",
      "Community Outreach",
      "Training Events",
      "Operations"
    ]
  },
  {
    "key": "Status",
    "label": "Status",
    "input": "select",
    "required": true,
    "options": [
      "Active",
      "Inactive",
      "Pending"
    ]
  },
  {
    "key": "Onboarding Status",
    "label": "Onboarding Status",
    "input": "select",
    "required": true,
    "options": [
      "Pending",
      "In Progress",
      "Completed"
    ]
  },
  {
    "key": "Last Activity Date",
    "label": "Last Activity Date",
    "input": "date",
    "required": false
  },
  {
    "key": "Hours Contributed",
    "label": "Hours Contributed",
    "input": "number",
    "required": false
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
    "label": "Total Volunteers",
    "type": "count"
  },
  {
    "id": "statusActive",
    "label": "Active Volunteers",
    "type": "equals",
    "field": "Status",
    "value": "Active"
  },
  {
    "id": "onboardingPending",
    "label": "Pending Onboarding",
    "type": "equals",
    "field": "Onboarding Status",
    "value": "Pending"
  },
  {
    "id": "sumHours",
    "label": "Hours Contributed",
    "type": "sum",
    "field": "Hours Contributed"
  }
],
  SAMPLE_ROWS: [
  [
    "VOL-20260227-001",
    "Alicia Tan",
    "alicia@example.com",
    "91234567",
    "Befriender",
    "Active Ageing",
    "Active",
    "Completed",
    "2026-02-20",
    24,
    "Consistent volunteer",
    "2026-02-01 09:00:00",
    "2026-02-20 18:20:00"
  ],
  [
    "VOL-20260227-002",
    "Marcus Lee",
    "marcus@example.com",
    "98765432",
    "Event Support",
    "Community Outreach",
    "Pending",
    "Pending",
    "2026-02-14",
    6,
    "Awaiting full briefing",
    "2026-02-03 11:00:00",
    "2026-02-14 17:05:00"
  ],
  [
    "VOL-20260227-003",
    "Priya Nair",
    "priya@example.com",
    "92345678",
    "Admin Support",
    "Operations",
    "Active",
    "Completed",
    "2026-02-25",
    14,
    "Good with admin work",
    "2026-02-05 08:45:00",
    "2026-02-25 19:15:00"
  ]
]
};
