const APP_CONFIG = {
  PROJECT_NAME: "ICOIP AI Training & Curriculum Development Portal",
  PORTAL_CODE: "TRN",
  PRIMARY_SHEET: "TrainingRequests",
  AUDIT_SHEET: 'AuditLog',
  SPREADSHEET_ID: '', // Optional. Leave blank for container-bound Apps Script.
  TIMEZONE: Session.getScriptTimeZone() || 'Asia/Singapore',
  PROGRAMME_NAME: 'Integrated Care & Operations Intelligence Programme (ICOIP)',
  PROGRAMME_DESCRIPTION: 'The Integrated Care & Operations Intelligence Programme (ICOIP) is a unified digital ecosystem that integrates volunteer management, beneficiary intake, counselling services, administrative governance, and AI-powered learning development into a structured operational framework.',
  PAGE_TITLE: "AI Training & Curriculum Development Portal",
  PAGE_SUBTITLE: "Manage slide requests, curriculum planning, WSQ alignment, and training output readiness.",
  TABLE_COLUMNS: [
  "Record ID",
  "Programme Title",
  "Requestor",
  "Topic",
  "Audience",
  "Delivery Mode",
  "WSQ Alignment",
  "Output Type",
  "Status",
  "Due Date",
  "Notes",
  "Created At",
  "Updated At"
],
  FORM_FIELDS: [
  {
    "key": "Programme Title",
    "label": "Programme Title",
    "input": "text",
    "required": true
  },
  {
    "key": "Requestor",
    "label": "Requestor",
    "input": "text",
    "required": true
  },
  {
    "key": "Topic",
    "label": "Topic",
    "input": "text",
    "required": true
  },
  {
    "key": "Audience",
    "label": "Audience",
    "input": "select",
    "required": true,
    "options": [
      "Frontline Staff",
      "Managers",
      "Volunteers",
      "Caregivers",
      "Students",
      "General Public"
    ]
  },
  {
    "key": "Delivery Mode",
    "label": "Delivery Mode",
    "input": "select",
    "required": true,
    "options": [
      "Classroom",
      "Virtual",
      "Blended",
      "Self-paced"
    ]
  },
  {
    "key": "WSQ Alignment",
    "label": "WSQ Alignment",
    "input": "select",
    "required": true,
    "options": [
      "Yes",
      "Partial",
      "No"
    ]
  },
  {
    "key": "Output Type",
    "label": "Output Type",
    "input": "select",
    "required": true,
    "options": [
      "Slides",
      "Facilitator Guide",
      "Learner Workbook",
      "Assessment Pack",
      "Curriculum Map"
    ]
  },
  {
    "key": "Status",
    "label": "Status",
    "input": "select",
    "required": true,
    "options": [
      "Requested",
      "In Development",
      "Ready for Review",
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
    "key": "Notes",
    "label": "Notes",
    "input": "textarea",
    "required": false
  }
],
  DASHBOARD_METRICS: [
  {
    "id": "totalRecords",
    "label": "Total Requests",
    "type": "count"
  },
  {
    "id": "inDevelopment",
    "label": "In Development",
    "type": "equals",
    "field": "Status",
    "value": "In Development"
  },
  {
    "id": "readyCount",
    "label": "Ready for Review",
    "type": "equals",
    "field": "Status",
    "value": "Ready for Review"
  },
  {
    "id": "overdueCount",
    "label": "Overdue",
    "type": "date_lt_today",
    "field": "Due Date"
  }
],
  SAMPLE_ROWS: [
  [
    "TRN-20260227-001",
    "Motivational Interviewing Basics",
    "Ben Heng",
    "Motivational Interviewing",
    "Frontline Staff",
    "Blended",
    "Yes",
    "Slides",
    "In Development",
    "2026-03-06",
    "Need trainer notes and activity prompts",
    "2026-02-24 09:00:00",
    "2026-02-26 18:25:00"
  ],
  [
    "TRN-20260227-002",
    "Volunteer Induction",
    "Sarah Ng",
    "Volunteer Service Excellence",
    "Volunteers",
    "Virtual",
    "Partial",
    "Learner Workbook",
    "Requested",
    "2026-03-10",
    "Simple orientation pack",
    "2026-02-25 11:30:00",
    "2026-02-25 11:30:00"
  ],
  [
    "TRN-20260227-003",
    "Case Notes Quality",
    "Daniel Teo",
    "Documentation Standards",
    "Managers",
    "Classroom",
    "Yes",
    "Facilitator Guide",
    "Ready for Review",
    "2026-02-28",
    "Needs final QA",
    "2026-02-20 08:15:00",
    "2026-02-27 12:05:00"
  ]
]
};
