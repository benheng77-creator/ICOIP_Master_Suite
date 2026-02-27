const APP_CONFIG = {
  PROJECT_NAME: "ICOIP Counselling & Client Portal",
  PORTAL_CODE: "COU",
  PRIMARY_SHEET: "CounsellingCases",
  AUDIT_SHEET: 'AuditLog',
  SPREADSHEET_ID: '', // Optional. Leave blank for container-bound Apps Script.
  TIMEZONE: Session.getScriptTimeZone() || 'Asia/Singapore',
  PROGRAMME_NAME: 'Integrated Care & Operations Intelligence Programme (ICOIP)',
  PROGRAMME_DESCRIPTION: 'The Integrated Care & Operations Intelligence Programme (ICOIP) is a unified digital ecosystem that integrates volunteer management, beneficiary intake, counselling services, administrative governance, and AI-powered learning development into a structured operational framework.',
  PAGE_TITLE: "Counselling & Client Portal",
  PAGE_SUBTITLE: "Manage counselling sessions, case notes, follow-up actions, and appointment coordination.",
  TABLE_COLUMNS: [
  "Record ID",
  "Client Name",
  "Contact",
  "Counsellor",
  "Session Date",
  "Case Type",
  "Risk Level",
  "Session Status",
  "Follow Up Required",
  "Next Appointment",
  "Notes",
  "Created At",
  "Updated At"
],
  FORM_FIELDS: [
  {
    "key": "Client Name",
    "label": "Client Name",
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
    "key": "Counsellor",
    "label": "Counsellor",
    "input": "text",
    "required": true
  },
  {
    "key": "Session Date",
    "label": "Session Date",
    "input": "date",
    "required": true
  },
  {
    "key": "Case Type",
    "label": "Case Type",
    "input": "select",
    "required": true,
    "options": [
      "Stress",
      "Family",
      "Financial",
      "Bereavement",
      "Workplace",
      "Other"
    ]
  },
  {
    "key": "Risk Level",
    "label": "Risk Level",
    "input": "select",
    "required": true,
    "options": [
      "Low",
      "Medium",
      "High"
    ]
  },
  {
    "key": "Session Status",
    "label": "Session Status",
    "input": "select",
    "required": true,
    "options": [
      "Scheduled",
      "Completed",
      "Cancelled",
      "Rescheduled"
    ]
  },
  {
    "key": "Follow Up Required",
    "label": "Follow Up Required",
    "input": "select",
    "required": true,
    "options": [
      "Yes",
      "No"
    ]
  },
  {
    "key": "Next Appointment",
    "label": "Next Appointment",
    "input": "date",
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
    "label": "Total Sessions",
    "type": "count"
  },
  {
    "id": "upcoming",
    "label": "Upcoming Sessions",
    "type": "date_gte",
    "field": "Next Appointment"
  },
  {
    "id": "followUp",
    "label": "Follow-Up Required",
    "type": "equals",
    "field": "Follow Up Required",
    "value": "Yes"
  },
  {
    "id": "highRisk",
    "label": "High Risk Cases",
    "type": "equals",
    "field": "Risk Level",
    "value": "High"
  }
],
  SAMPLE_ROWS: [
  [
    "COU-20260227-001",
    "Janet Goh",
    "93880011",
    "Rachel Ong",
    "2026-02-20",
    "Stress",
    "Medium",
    "Completed",
    "Yes",
    "2026-03-05",
    "Client progressing well",
    "2026-02-18 09:30:00",
    "2026-02-20 17:40:00"
  ],
  [
    "COU-20260227-002",
    "Adrian Lim",
    "93880022",
    "Faridah Salleh",
    "2026-02-26",
    "Family",
    "High",
    "Completed",
    "Yes",
    "2026-03-01",
    "Close follow-up needed",
    "2026-02-24 10:10:00",
    "2026-02-26 19:05:00"
  ],
  [
    "COU-20260227-003",
    "Melissa Tan",
    "93880033",
    "Rachel Ong",
    "2026-02-28",
    "Workplace",
    "Low",
    "Scheduled",
    "No",
    "2026-02-28",
    "New intake session",
    "2026-02-27 08:50:00",
    "2026-02-27 08:50:00"
  ]
]
};
