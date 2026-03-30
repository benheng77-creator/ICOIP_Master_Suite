const APP_CONFIG = {
  "PROJECT_NAME": "ICOIP Counselling & Client Portal",
  "PORTAL_CODE": "COU",
  "PRIMARY_SHEET": "CounsellingCases",
  "AUDIT_SHEET": "AuditLog",
  "USERS_SHEET": "Users",
  "ATTACHMENTS_SHEET": "Attachments",
  "NOTIFICATIONS_SHEET": "Notifications",
  "SPREADSHEET_ID": "",
  "ATTACHMENT_FOLDER_ID": "",
  "ATTACHMENT_FOLDER_NAME": "COU_Demo_Attachments",
  "TIMEZONE": "Asia/Singapore",
  "PROGRAMME_NAME": "Integrated Care & Operations Intelligence Programme (ICOIP)",
  "PROGRAMME_DESCRIPTION": "The Integrated Care & Operations Intelligence Programme (ICOIP) is a unified digital ecosystem that integrates volunteer management, beneficiary intake, counselling services, administrative governance, and AI-powered learning development into a structured operational framework.",
  "PAGE_TITLE": "Counselling & Client Portal",
  "PAGE_SUBTITLE": "Manage counselling sessions, case notes, follow-up actions, and appointment coordination.",
  "TABLE_COLUMNS": [
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
  "FORM_FIELDS": [
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
  "DASHBOARD_METRICS": [
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
  "SAMPLE_ROWS": [
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
  ],
  "AUDIT_COLUMNS": [
    "Timestamp",
    "User Email",
    "User Name",
    "Role",
    "Action",
    "Record ID",
    "Sheet",
    "Details JSON"
  ],
  "USER_COLUMNS": [
    "Email",
    "Full Name",
    "Role",
    "Department",
    "Status"
  ],
  "ATTACHMENT_COLUMNS": [
    "Attachment ID",
    "Record ID",
    "File Name",
    "Mime Type",
    "File Size",
    "Category",
    "Description",
    "Drive File ID",
    "Drive URL",
    "Uploaded By",
    "Uploaded At"
  ],
  "NOTIFICATION_COLUMNS": [
    "Notification ID",
    "Record ID",
    "To",
    "Cc",
    "Subject",
    "Message",
    "Delivery Status",
    "Triggered By",
    "Triggered At",
    "Sent At"
  ],
  "DEMO_USERS": [
    {
      "email": "admin@icoip.demo",
      "fullName": "Admin User",
      "role": "Admin",
      "department": "Management",
      "status": "Active"
    },
    {
      "email": "manager@icoip.demo",
      "fullName": "Grace Tan",
      "role": "Manager",
      "department": "Clinical Services",
      "status": "Active"
    },
    {
      "email": "officer@icoip.demo",
      "fullName": "Daniel Lee",
      "role": "Officer",
      "department": "Counselling Team",
      "status": "Active"
    },
    {
      "email": "viewer@icoip.demo",
      "fullName": "Client Viewer",
      "role": "Viewer",
      "department": "External Demo",
      "status": "Active"
    }
  ],
  "DEMO_USERS_SEED": [
    [
      "admin@icoip.demo",
      "Admin User",
      "Admin",
      "Management",
      "Active"
    ],
    [
      "manager@icoip.demo",
      "Grace Tan",
      "Manager",
      "Clinical Services",
      "Active"
    ],
    [
      "officer@icoip.demo",
      "Daniel Lee",
      "Officer",
      "Counselling Team",
      "Active"
    ],
    [
      "viewer@icoip.demo",
      "Client Viewer",
      "Viewer",
      "External Demo",
      "Active"
    ]
  ],
  "PERMISSIONS": {
    "Admin": [
      "view",
      "create",
      "edit",
      "delete",
      "workflow",
      "upload",
      "email",
      "export",
      "reset"
    ],
    "Manager": [
      "view",
      "create",
      "edit",
      "workflow",
      "upload",
      "email",
      "export"
    ],
    "Officer": [
      "view",
      "create",
      "edit",
      "workflow",
      "upload",
      "email",
      "export"
    ],
    "Viewer": [
      "view",
      "export"
    ]
  },
  "WORKFLOW": {
    "STATUS_FIELD": "Session Status",
    "ACTIONS": [
      {
        "key": "complete_session",
        "label": "Complete Session",
        "field": "Session Status",
        "from": [
          "Scheduled",
          "Rescheduled"
        ],
        "to": "Completed",
        "roles": [
          "Admin",
          "Manager",
          "Officer"
        ]
      },
      {
        "key": "cancel_session",
        "label": "Cancel Session",
        "field": "Session Status",
        "from": [
          "Scheduled",
          "Rescheduled"
        ],
        "to": "Cancelled",
        "roles": [
          "Admin",
          "Manager",
          "Officer"
        ]
      },
      {
        "key": "reschedule_session",
        "label": "Reschedule Session",
        "field": "Session Status",
        "from": [
          "Scheduled"
        ],
        "to": "Rescheduled",
        "roles": [
          "Admin",
          "Manager",
          "Officer"
        ]
      },
      {
        "key": "mark_followup",
        "label": "Flag Follow-Up",
        "field": "Follow Up Required",
        "from": [
          "No"
        ],
        "to": "Yes",
        "roles": [
          "Admin",
          "Manager",
          "Officer"
        ]
      },
      {
        "key": "clear_followup",
        "label": "Clear Follow-Up",
        "field": "Follow Up Required",
        "from": [
          "Yes"
        ],
        "to": "No",
        "roles": [
          "Admin",
          "Manager"
        ]
      }
    ]
  },
  "ATTACHMENT_CATEGORIES": [
    "Intake Form",
    "Consent Form",
    "Case Notes",
    "Assessment Tool",
    "Referral Document",
    "Other"
  ],
  "NOTIFICATION_TEMPLATES": [
    {
      "key": "appointment",
      "label": "Appointment confirmation",
      "subject": "Counselling appointment update - {{recordId}}"
    },
    {
      "key": "followup",
      "label": "Follow-up reminder",
      "subject": "Counselling follow-up - {{recordId}}"
    }
  ],
  "SUMMARY_FIELDS": [
    "Client Name",
    "Counsellor",
    "Session Date",
    "Case Type",
    "Risk Level",
    "Session Status",
    "Follow Up Required",
    "Next Appointment",
    "Notes"
  ]
};
