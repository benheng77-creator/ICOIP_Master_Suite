const APP_CONFIG = {
  "PROJECT_NAME": "ICOIP Intake & Referral Portal",
  "PORTAL_CODE": "INT",
  "PRIMARY_SHEET": "IntakeReferrals",
  "AUDIT_SHEET": "AuditLog",
  "USERS_SHEET": "Users",
  "ATTACHMENTS_SHEET": "Attachments",
  "NOTIFICATIONS_SHEET": "Notifications",
  "SPREADSHEET_ID": "",
  "ATTACHMENT_FOLDER_ID": "",
  "ATTACHMENT_FOLDER_NAME": "INT_Demo_Attachments",
  "TIMEZONE": "Asia/Singapore",
  "PROGRAMME_NAME": "Integrated Care & Operations Intelligence Programme (ICOIP)",
  "PROGRAMME_DESCRIPTION": "The Integrated Care & Operations Intelligence Programme (ICOIP) is a unified digital ecosystem that integrates volunteer management, beneficiary intake, counselling services, administrative governance, and AI-powered learning development into a structured operational framework.",
  "PAGE_TITLE": "Intake & Referral Portal",
  "PAGE_SUBTITLE": "Manage beneficiary intake, referrals, eligibility screening, prioritisation, and case assignment.",
  "TABLE_COLUMNS": [
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
  "FORM_FIELDS": [
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
  "DASHBOARD_METRICS": [
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
  "SAMPLE_ROWS": [
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
      "department": "Client Services",
      "status": "Active"
    },
    {
      "email": "officer@icoip.demo",
      "fullName": "Daniel Lee",
      "role": "Officer",
      "department": "Intake Team",
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
      "Client Services",
      "Active"
    ],
    [
      "officer@icoip.demo",
      "Daniel Lee",
      "Officer",
      "Intake Team",
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
    "STATUS_FIELD": "Case Status",
    "ACTIONS": [
      {
        "key": "move_to_review",
        "label": "Move to Review",
        "field": "Case Status",
        "from": [
          "Open"
        ],
        "to": "In Review",
        "roles": [
          "Admin",
          "Manager",
          "Officer"
        ]
      },
      {
        "key": "assign_case",
        "label": "Assign Case",
        "field": "Case Status",
        "from": [
          "In Review"
        ],
        "to": "Assigned",
        "roles": [
          "Admin",
          "Manager",
          "Officer"
        ]
      },
      {
        "key": "close_case",
        "label": "Close Case",
        "field": "Case Status",
        "from": [
          "Assigned",
          "In Review"
        ],
        "to": "Closed",
        "roles": [
          "Admin",
          "Manager"
        ]
      },
      {
        "key": "reopen_case",
        "label": "Reopen Case",
        "field": "Case Status",
        "from": [
          "Closed"
        ],
        "to": "Open",
        "roles": [
          "Admin",
          "Manager"
        ]
      },
      {
        "key": "mark_eligible",
        "label": "Mark Eligible",
        "field": "Eligibility Status",
        "from": [
          "Pending"
        ],
        "to": "Eligible",
        "roles": [
          "Admin",
          "Manager",
          "Officer"
        ]
      },
      {
        "key": "mark_not_eligible",
        "label": "Mark Not Eligible",
        "field": "Eligibility Status",
        "from": [
          "Pending"
        ],
        "to": "Not Eligible",
        "roles": [
          "Admin",
          "Manager",
          "Officer"
        ]
      }
    ]
  },
  "ATTACHMENT_CATEGORIES": [
    "Referral Form",
    "Supporting Document",
    "Assessment Form",
    "Consent Form",
    "Photo",
    "Other"
  ],
  "NOTIFICATION_TEMPLATES": [
    {
      "key": "ack",
      "label": "Referral acknowledgement",
      "subject": "Intake acknowledgement - {{recordId}}"
    },
    {
      "key": "assignment",
      "label": "Case assignment update",
      "subject": "Case assignment update - {{recordId}}"
    }
  ],
  "SUMMARY_FIELDS": [
    "Beneficiary Name",
    "Referral Source",
    "Programme",
    "Eligibility Status",
    "Case Status",
    "Assigned Officer",
    "Priority",
    "Notes"
  ]
};
