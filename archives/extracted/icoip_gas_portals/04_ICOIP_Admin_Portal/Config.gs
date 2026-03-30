const APP_CONFIG = {
  PROJECT_NAME: "ICOIP Admin Portal",
  PORTAL_CODE: "ADM",
  PRIMARY_SHEET: "AdminTasks",
  AUDIT_SHEET: 'AuditLog',
  SPREADSHEET_ID: '', // Optional. Leave blank for container-bound Apps Script.
  TIMEZONE: Session.getScriptTimeZone() || 'Asia/Singapore',
  PROGRAMME_NAME: 'Integrated Care & Operations Intelligence Programme (ICOIP)',
  PROGRAMME_DESCRIPTION: 'The Integrated Care & Operations Intelligence Programme (ICOIP) is a unified digital ecosystem that integrates volunteer management, beneficiary intake, counselling services, administrative governance, and AI-powered learning development into a structured operational framework.',
  PAGE_TITLE: "Admin Portal",
  PAGE_SUBTITLE: "Track users, workflows, governance tasks, reporting items, and management oversight.",
  TABLE_COLUMNS: [
  "Record ID",
  "Title",
  "Workstream",
  "Owner",
  "Priority",
  "Status",
  "Due Date",
  "Access Level",
  "Report Category",
  "Notes",
  "Created At",
  "Updated At"
],
  FORM_FIELDS: [
  {
    "key": "Title",
    "label": "Title",
    "input": "text",
    "required": true
  },
  {
    "key": "Workstream",
    "label": "Workstream",
    "input": "select",
    "required": true,
    "options": [
      "Operations",
      "HR",
      "Governance",
      "Finance",
      "IT",
      "Training"
    ]
  },
  {
    "key": "Owner",
    "label": "Owner",
    "input": "text",
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
      "Critical"
    ]
  },
  {
    "key": "Status",
    "label": "Status",
    "input": "select",
    "required": true,
    "options": [
      "Open",
      "In Progress",
      "Pending Approval",
      "Completed"
    ]
  },
  {
    "key": "Due Date",
    "label": "Due Date",
    "input": "date",
    "required": true
  },
  {
    "key": "Access Level",
    "label": "Access Level",
    "input": "select",
    "required": true,
    "options": [
      "Admin",
      "Manager",
      "Officer",
      "Viewer"
    ]
  },
  {
    "key": "Report Category",
    "label": "Report Category",
    "input": "select",
    "required": true,
    "options": [
      "Weekly Ops",
      "Board",
      "Audit",
      "Management",
      "Compliance"
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
    "label": "Total Items",
    "type": "count"
  },
  {
    "id": "openCount",
    "label": "Open Items",
    "type": "equals",
    "field": "Status",
    "value": "Open"
  },
  {
    "id": "overdueCount",
    "label": "Overdue",
    "type": "date_lt_today",
    "field": "Due Date"
  },
  {
    "id": "completedCount",
    "label": "Completed",
    "type": "equals",
    "field": "Status",
    "value": "Completed"
  }
],
  SAMPLE_ROWS: [
  [
    "ADM-20260227-001",
    "Prepare monthly KPI pack",
    "Operations",
    "Darren Lim",
    "High",
    "In Progress",
    "2026-03-03",
    "Manager",
    "Management",
    "Pending final numbers",
    "2026-02-20 10:00:00",
    "2026-02-26 18:00:00"
  ],
  [
    "ADM-20260227-002",
    "Review access matrix",
    "IT",
    "Farah Aziz",
    "Critical",
    "Open",
    "2026-02-28",
    "Admin",
    "Audit",
    "Need to confirm portal roles",
    "2026-02-22 09:15:00",
    "2026-02-22 09:15:00"
  ],
  [
    "ADM-20260227-003",
    "Board report formatting",
    "Governance",
    "Julian Tay",
    "Medium",
    "Completed",
    "2026-02-21",
    "Viewer",
    "Board",
    "Submitted to CEO office",
    "2026-02-18 08:40:00",
    "2026-02-21 16:30:00"
  ]
]
};
