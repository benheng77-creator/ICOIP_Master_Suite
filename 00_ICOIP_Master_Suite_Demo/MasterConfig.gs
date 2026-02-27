const ICOIP_MASTER_CONFIG = {
  "PROJECT_NAME": "ICOIP Master Suite Demo",
  "PROJECT_CODE": "ICOIP-MASTER",
  "TIMEZONE": "Asia/Singapore",
  "PROGRAMME_NAME": "Integrated Care & Operations Intelligence Programme (ICOIP)",
  "PROGRAMME_DESCRIPTION": "The Integrated Care & Operations Intelligence Programme (ICOIP) is a unified digital ecosystem that integrates volunteer management, beneficiary intake, counselling services, administrative governance, and AI-powered learning development into a structured operational framework. Designed for social service organisations, ICOIP strengthens service coordination, operational accountability, governance standards, and workforce capability through intelligent digital infrastructure.",
  "PAGE_TITLE": "Integrated Care & Operations Intelligence Programme (ICOIP)",
  "PAGE_SUBTITLE": "Client-facing near-full demo master suite with five switchable operational modules in one GAS web app.",
  "SPREADSHEET_ID": "",
  "ATTACHMENT_ROOT_FOLDER_ID": "",
  "ATTACHMENT_ROOT_FOLDER_NAME": "ICOIP_Master_Demo_Attachments",
  "USERS_SHEET": "Users",
  "AUDIT_SHEET": "AuditLog",
  "ATTACHMENTS_SHEET": "Attachments",
  "NOTIFICATIONS_SHEET": "Notifications",
  "MODULE_ORDER": [
    "VOL",
    "INT",
    "COU",
    "ADM",
    "TRN"
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
      "department": "Volunteer Services",
      "status": "Active"
    },
    {
      "email": "officer@icoip.demo",
      "fullName": "Daniel Lee",
      "role": "Officer",
      "department": "Volunteer Services",
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
      "Volunteer Services",
      "Active"
    ],
    [
      "officer@icoip.demo",
      "Daniel Lee",
      "Officer",
      "Volunteer Services",
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
  "AUDIT_COLUMNS": [
    "Timestamp",
    "Module Code",
    "Module Title",
    "User Email",
    "User Name",
    "Role",
    "Action",
    "Record ID",
    "Primary Sheet",
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
    "Module Code",
    "Module Title",
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
    "Module Code",
    "Module Title",
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
  "MODULES": {
    "VOL": {
      "PROJECT_NAME": "ICOIP Volunteer Management Portal",
      "PORTAL_CODE": "VOL",
      "PRIMARY_SHEET": "Volunteers",
      "PAGE_TITLE": "Volunteer Management Portal",
      "PAGE_SUBTITLE": "Manage volunteer registration, onboarding, scheduling, engagement tracking, and reporting.",
      "TABLE_COLUMNS": [
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
      "FORM_FIELDS": [
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
      "DASHBOARD_METRICS": [
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
      "SAMPLE_ROWS": [
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
      ],
      "WORKFLOW": {
        "STATUS_FIELD": "Onboarding Status",
        "ACTIONS": [
          {
            "key": "start_onboarding",
            "label": "Start Onboarding",
            "field": "Onboarding Status",
            "from": [
              "Pending"
            ],
            "to": "In Progress",
            "roles": [
              "Admin",
              "Manager",
              "Officer"
            ]
          },
          {
            "key": "complete_onboarding",
            "label": "Complete Onboarding",
            "field": "Onboarding Status",
            "from": [
              "In Progress"
            ],
            "to": "Completed",
            "roles": [
              "Admin",
              "Manager",
              "Officer"
            ]
          },
          {
            "key": "reopen_onboarding",
            "label": "Reopen Onboarding",
            "field": "Onboarding Status",
            "from": [
              "Completed"
            ],
            "to": "In Progress",
            "roles": [
              "Admin",
              "Manager"
            ]
          },
          {
            "key": "activate_volunteer",
            "label": "Activate Volunteer",
            "field": "Status",
            "from": [
              "Pending",
              "Inactive"
            ],
            "to": "Active",
            "roles": [
              "Admin",
              "Manager"
            ]
          },
          {
            "key": "deactivate_volunteer",
            "label": "Deactivate Volunteer",
            "field": "Status",
            "from": [
              "Active"
            ],
            "to": "Inactive",
            "roles": [
              "Admin",
              "Manager"
            ]
          }
        ]
      },
      "ATTACHMENT_CATEGORIES": [
        "NRIC/ID Check",
        "Volunteer Form",
        "Training Certificate",
        "Consent Form",
        "Photo",
        "Other"
      ],
      "NOTIFICATION_TEMPLATES": [
        {
          "key": "welcome",
          "label": "Welcome / Next Steps",
          "subject": "Volunteer onboarding update - {{recordId}}"
        },
        {
          "key": "schedule",
          "label": "Volunteer schedule update",
          "subject": "Volunteer schedule update - {{recordId}}"
        }
      ],
      "SUMMARY_FIELDS": [
        "Volunteer Name",
        "Volunteer Role",
        "Preferred Area",
        "Status",
        "Onboarding Status",
        "Hours Contributed",
        "Last Activity Date",
        "Notes"
      ],
      "CARD_ICON": "🤝",
      "CARD_DESCRIPTION": "Volunteer onboarding, scheduling, hours, and engagement tracking."
    },
    "INT": {
      "PROJECT_NAME": "ICOIP Intake & Referral Portal",
      "PORTAL_CODE": "INT",
      "PRIMARY_SHEET": "IntakeReferrals",
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
      ],
      "CARD_ICON": "🧾",
      "CARD_DESCRIPTION": "Beneficiary intake, screening, referrals, and case assignment workflows."
    },
    "COU": {
      "PROJECT_NAME": "ICOIP Counselling & Client Portal",
      "PORTAL_CODE": "COU",
      "PRIMARY_SHEET": "CounsellingCases",
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
      ],
      "CARD_ICON": "💬",
      "CARD_DESCRIPTION": "Counselling sessions, risk tracking, appointments, and follow-up actions."
    },
    "ADM": {
      "PROJECT_NAME": "ICOIP Admin Portal",
      "PORTAL_CODE": "ADM",
      "PRIMARY_SHEET": "AdminTasks",
      "PAGE_TITLE": "Admin Portal",
      "PAGE_SUBTITLE": "Track users, workflows, governance tasks, reporting items, and management oversight.",
      "TABLE_COLUMNS": [
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
      "FORM_FIELDS": [
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
      "DASHBOARD_METRICS": [
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
      "SAMPLE_ROWS": [
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
      ],
      "WORKFLOW": {
        "STATUS_FIELD": "Status",
        "ACTIONS": [
          {
            "key": "start_work",
            "label": "Start Work",
            "field": "Status",
            "from": [
              "Open"
            ],
            "to": "In Progress",
            "roles": [
              "Admin",
              "Manager",
              "Officer"
            ]
          },
          {
            "key": "submit_for_approval",
            "label": "Submit for Approval",
            "field": "Status",
            "from": [
              "In Progress"
            ],
            "to": "Pending Approval",
            "roles": [
              "Admin",
              "Manager",
              "Officer"
            ]
          },
          {
            "key": "approve_item",
            "label": "Approve / Complete",
            "field": "Status",
            "from": [
              "Pending Approval"
            ],
            "to": "Completed",
            "roles": [
              "Admin",
              "Manager"
            ]
          },
          {
            "key": "reopen_item",
            "label": "Reopen Item",
            "field": "Status",
            "from": [
              "Completed"
            ],
            "to": "Open",
            "roles": [
              "Admin",
              "Manager"
            ]
          }
        ]
      },
      "ATTACHMENT_CATEGORIES": [
        "Policy",
        "Report",
        "Board Paper",
        "Evidence",
        "Screenshot",
        "Other"
      ],
      "NOTIFICATION_TEMPLATES": [
        {
          "key": "approval",
          "label": "Approval request",
          "subject": "Approval required - {{recordId}}"
        },
        {
          "key": "completion",
          "label": "Completion update",
          "subject": "Task completion update - {{recordId}}"
        }
      ],
      "SUMMARY_FIELDS": [
        "Title",
        "Workstream",
        "Owner",
        "Priority",
        "Status",
        "Due Date",
        "Access Level",
        "Report Category",
        "Notes"
      ],
      "CARD_ICON": "🛠️",
      "CARD_DESCRIPTION": "Administrative oversight, governance tasks, reporting, and approvals."
    },
    "TRN": {
      "PROJECT_NAME": "ICOIP AI Training & Curriculum Development Portal",
      "PORTAL_CODE": "TRN",
      "PRIMARY_SHEET": "TrainingRequests",
      "PAGE_TITLE": "AI Training & Curriculum Development Portal",
      "PAGE_SUBTITLE": "Manage slide requests, curriculum planning, WSQ alignment, and training output readiness.",
      "TABLE_COLUMNS": [
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
      "FORM_FIELDS": [
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
      "DASHBOARD_METRICS": [
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
      "SAMPLE_ROWS": [
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
      ],
      "WORKFLOW": {
        "STATUS_FIELD": "Status",
        "ACTIONS": [
          {
            "key": "start_development",
            "label": "Start Development",
            "field": "Status",
            "from": [
              "Requested"
            ],
            "to": "In Development",
            "roles": [
              "Admin",
              "Manager",
              "Officer"
            ]
          },
          {
            "key": "submit_review",
            "label": "Submit for Review",
            "field": "Status",
            "from": [
              "In Development"
            ],
            "to": "Ready for Review",
            "roles": [
              "Admin",
              "Manager",
              "Officer"
            ]
          },
          {
            "key": "complete_request",
            "label": "Complete Request",
            "field": "Status",
            "from": [
              "Ready for Review"
            ],
            "to": "Completed",
            "roles": [
              "Admin",
              "Manager"
            ]
          },
          {
            "key": "reopen_request",
            "label": "Reopen Request",
            "field": "Status",
            "from": [
              "Completed"
            ],
            "to": "In Development",
            "roles": [
              "Admin",
              "Manager"
            ]
          }
        ]
      },
      "ATTACHMENT_CATEGORIES": [
        "Slide Draft",
        "Facilitator Guide",
        "Workbook",
        "Assessment Pack",
        "Reference Material",
        "Other"
      ],
      "NOTIFICATION_TEMPLATES": [
        {
          "key": "request",
          "label": "Request received",
          "subject": "Training request received - {{recordId}}"
        },
        {
          "key": "review",
          "label": "Ready for review",
          "subject": "Training output ready for review - {{recordId}}"
        }
      ],
      "SUMMARY_FIELDS": [
        "Programme Title",
        "Requestor",
        "Topic",
        "Audience",
        "Delivery Mode",
        "WSQ Alignment",
        "Output Type",
        "Status",
        "Due Date",
        "Notes"
      ],
      "CARD_ICON": "🧠",
      "CARD_DESCRIPTION": "Training requests, curriculum planning, WSQ alignment, and deliverable tracking."
    }
  }
};
