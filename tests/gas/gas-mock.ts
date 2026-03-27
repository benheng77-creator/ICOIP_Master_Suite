/**
 * GAS Mock — injected into the portal iframe to replace google.script.run
 * with deterministic local responses. Enables full E2E testing in headless
 * Playwright without a live GAS server connection.
 */

export const DEMO_USERS = [
  { email: "admin@icoip.demo",   fullName: "Admin User",    role: "Admin",   department: "Management",        status: "Active" },
  { email: "manager@icoip.demo", fullName: "Grace Tan",     role: "Manager", department: "Volunteer Services", status: "Active" },
  { email: "officer@icoip.demo", fullName: "Daniel Lee",    role: "Officer", department: "Volunteer Services", status: "Active" },
  { email: "viewer@icoip.demo",  fullName: "Client Viewer", role: "Viewer",  department: "External Demo",      status: "Active" },
];

export const PERMISSIONS: Record<string, string[]> = {
  Admin:   ["view","create","edit","delete","workflow","upload","email","export","reset"],
  Manager: ["view","create","edit","workflow","upload","email","export"],
  Officer: ["view","create","edit","workflow","upload","email","export"],
  Viewer:  ["view","export"],
};

/** Returns portal-specific mock config keyed by portal ID */
export function getMockConfig(portalId: string) {
  const base = {
    demoUsers: DEMO_USERS,
    permissions: PERMISSIONS,
    attachmentCategories: ["Identity Document", "Medical Report", "Consent Form", "Other"],
    notificationTemplates: [],
    summaryFields: [],
    workflow: {
      STATUS_FIELD: "Status",
      ACTIONS: [
        { key: "approve",  label: "Approve",  setStatus: "Approved",  roles: ["Admin","Manager"] },
        { key: "reject",   label: "Reject",   setStatus: "Rejected",  roles: ["Admin","Manager"] },
        { key: "complete", label: "Complete", setStatus: "Completed", roles: ["Admin","Manager","Officer"] },
      ],
    },
  };

  const configs: Record<string, object> = {
    "00": {
      ...base,
      projectName: "ICOIP Master Suite Demo",
      portalCode: "MASTER",
      pageTitle: "ICOIP Master Suite",
      pageSubtitle: "Full suite demo",
      programmeName: "ICOIP",
      programmeDescription: "Master suite demo.",
      tableColumns: [
        { key: "id", label: "ID" }, { key: "name", label: "Name" },
        { key: "status", label: "Status" }, { key: "date", label: "Date" },
      ],
      formFields: [
        { key: "name",   label: "Name",   type: "text",   required: true },
        { key: "status", label: "Status", type: "select", required: true,
          options: ["Active","Pending","Closed"] },
      ],
      dashboardMetrics: [
        { label: "Total",   value: 12 }, { label: "Active", value: 8 },
        { label: "Pending", value: 3 },  { label: "Closed", value: 1 },
      ],
    },
    "01": {
      ...base,
      projectName: "ICOIP Volunteer Management Portal",
      portalCode: "VOL",
      pageTitle: "Volunteer Management Portal",
      pageSubtitle: "Manage volunteers end-to-end.",
      programmeName: "ICOIP",
      programmeDescription: "Volunteer management.",
      tableColumns: [
        { key: "id",     label: "ID" },     { key: "fullName",  label: "Name" },
        { key: "status", label: "Status" }, { key: "role",      label: "Role" },
        { key: "joinDate", label: "Join Date" },
      ],
      formFields: [
        { key: "fullName",  label: "Full Name",  type: "text",   required: true },
        { key: "email",     label: "Email",      type: "email",  required: true },
        { key: "phone",     label: "Phone",      type: "text",   required: false },
        { key: "role",      label: "Role",       type: "select", required: true,
          options: ["Volunteer","Team Lead","Coordinator"] },
        { key: "status",    label: "Status",     type: "select", required: true,
          options: ["Active","Pending","Inactive"] },
      ],
      dashboardMetrics: [
        { label: "Total Volunteers", value: 24 }, { label: "Active",  value: 18 },
        { label: "Pending",          value: 4  }, { label: "Inactive", value: 2 },
      ],
    },
    "02": {
      ...base,
      projectName: "ICOIP Intake & Referral Portal",
      portalCode: "INT",
      pageTitle: "Intake & Referral Portal",
      pageSubtitle: "Manage beneficiary intake and referrals.",
      programmeName: "ICOIP",
      programmeDescription: "Intake referral.",
      tableColumns: [
        { key: "id", label: "ID" }, { key: "name", label: "Beneficiary" },
        { key: "status", label: "Status" }, { key: "referralDate", label: "Date" },
      ],
      formFields: [
        { key: "name",          label: "Beneficiary Name", type: "text",   required: true },
        { key: "dob",           label: "Date of Birth",    type: "date",   required: true },
        { key: "referralSource",label: "Referral Source",  type: "text",   required: false },
        { key: "status",        label: "Status",           type: "select", required: true,
          options: ["New","In Review","Approved","Closed"] },
      ],
      dashboardMetrics: [
        { label: "Total Referrals", value: 31 }, { label: "New",       value: 7 },
        { label: "In Review",       value: 12 }, { label: "Completed", value: 12 },
      ],
    },
    "03": {
      ...base,
      projectName: "ICOIP Counselling Client Portal",
      portalCode: "COU",
      pageTitle: "Counselling Client Portal",
      pageSubtitle: "Track counselling sessions and outcomes.",
      programmeName: "ICOIP",
      programmeDescription: "Counselling portal.",
      tableColumns: [
        { key: "id", label: "ID" }, { key: "clientName", label: "Client" },
        { key: "status", label: "Status" }, { key: "sessionDate", label: "Session Date" },
      ],
      formFields: [
        { key: "clientName",   label: "Client Name",    type: "text",   required: true },
        { key: "sessionDate",  label: "Session Date",   type: "date",   required: true },
        { key: "sessionType",  label: "Session Type",   type: "select", required: true,
          options: ["Individual","Group","Crisis"] },
        { key: "status",       label: "Status",         type: "select", required: true,
          options: ["Scheduled","Completed","Cancelled"] },
      ],
      dashboardMetrics: [
        { label: "Total Sessions", value: 45 }, { label: "Scheduled",  value: 8 },
        { label: "Completed",      value: 35 }, { label: "Cancelled",  value: 2 },
      ],
    },
    "04": {
      ...base,
      projectName: "ICOIP Admin Portal",
      portalCode: "ADM",
      pageTitle: "Admin Portal",
      pageSubtitle: "System administration and governance.",
      programmeName: "ICOIP",
      programmeDescription: "Admin portal.",
      tableColumns: [
        { key: "id", label: "ID" }, { key: "title", label: "Title" },
        { key: "status", label: "Status" }, { key: "createdAt", label: "Created" },
      ],
      formFields: [
        { key: "title",    label: "Title",    type: "text",   required: true },
        { key: "category", label: "Category", type: "select", required: true,
          options: ["Policy","Procedure","Notice"] },
        { key: "status",   label: "Status",   type: "select", required: true,
          options: ["Draft","Published","Archived"] },
      ],
      dashboardMetrics: [
        { label: "Total Items", value: 18 }, { label: "Published", value: 11 },
        { label: "Draft",       value: 5  }, { label: "Archived",  value: 2 },
      ],
    },
    "05": {
      ...base,
      projectName: "ICOIP AI Training Curriculum Portal",
      portalCode: "TRN",
      pageTitle: "AI Training Curriculum Portal",
      pageSubtitle: "Manage AI-powered learning and curriculum development.",
      programmeName: "ICOIP",
      programmeDescription: "Training portal.",
      tableColumns: [
        { key: "id", label: "ID" }, { key: "courseName", label: "Course" },
        { key: "status", label: "Status" }, { key: "enrollments", label: "Enrolled" },
      ],
      formFields: [
        { key: "courseName", label: "Course Name", type: "text",   required: true },
        { key: "category",   label: "Category",    type: "select", required: true,
          options: ["AI Fundamentals","Data Skills","Clinical","Leadership"] },
        { key: "duration",   label: "Duration (hrs)", type: "text", required: true },
        { key: "status",     label: "Status",      type: "select", required: true,
          options: ["Draft","Active","Archived"] },
      ],
      dashboardMetrics: [
        { label: "Total Courses", value: 14 }, { label: "Active",  value: 9 },
        { label: "Draft",         value: 3  }, { label: "Archived", value: 2 },
      ],
    },
  };

  return configs[portalId] || configs["01"];
}

/** Seed records — realistic per portal */
export function getMockRecords(portalId: string) {
  const seeds: Record<string, object[]> = {
    "01": [
      { id: "VOL-001", fullName: "Alice Tan",    email: "alice@demo.sg",   role: "Volunteer",   status: "Active",   joinDate: "2025-01-15", phone: "91234567" },
      { id: "VOL-002", fullName: "Bob Lim",      email: "bob@demo.sg",     role: "Team Lead",   status: "Active",   joinDate: "2025-02-10", phone: "92345678" },
      { id: "VOL-003", fullName: "Carol Ng",     email: "carol@demo.sg",   role: "Coordinator", status: "Pending",  joinDate: "2025-03-01", phone: "93456789" },
      { id: "VOL-004", fullName: "David Koh",    email: "david@demo.sg",   role: "Volunteer",   status: "Inactive", joinDate: "2024-11-20", phone: "94567890" },
      { id: "VOL-005", fullName: "Eva Chan",     email: "eva@demo.sg",     role: "Volunteer",   status: "Active",   joinDate: "2025-03-15", phone: "95678901" },
    ],
    "02": [
      { id: "INT-001", name: "Ahmad Bin Ali",  dob: "1985-06-12", referralSource: "Hospital",   status: "Approved",  referralDate: "2025-02-01" },
      { id: "INT-002", name: "Mary Lim",       dob: "1990-03-25", referralSource: "Self",        status: "New",       referralDate: "2025-03-10" },
      { id: "INT-003", name: "Ravi Kumar",     dob: "1978-11-08", referralSource: "GP Clinic",   status: "In Review", referralDate: "2025-03-12" },
      { id: "INT-004", name: "Siti Binte Rahman", dob: "2000-01-30", referralSource: "School", status: "Closed",    referralDate: "2025-01-05" },
    ],
    "03": [
      { id: "COU-001", clientName: "Jenny Wee",    sessionDate: "2025-03-20", sessionType: "Individual", status: "Completed" },
      { id: "COU-002", clientName: "Marcus Ho",    sessionDate: "2025-03-22", sessionType: "Group",      status: "Scheduled" },
      { id: "COU-003", clientName: "Priya Nair",   sessionDate: "2025-03-18", sessionType: "Crisis",     status: "Completed" },
      { id: "COU-004", clientName: "Tom Goh",      sessionDate: "2025-03-25", sessionType: "Individual", status: "Scheduled" },
    ],
    "04": [
      { id: "ADM-001", title: "Data Protection Policy",  category: "Policy",    status: "Published", createdAt: "2025-01-10" },
      { id: "ADM-002", title: "Volunteer Onboarding SOP", category: "Procedure", status: "Published", createdAt: "2025-02-01" },
      { id: "ADM-003", title: "Q1 Budget Notice",         category: "Notice",    status: "Draft",     createdAt: "2025-03-15" },
    ],
    "05": [
      { id: "TRN-001", courseName: "AI for Social Work",     category: "AI Fundamentals", duration: "8",  status: "Active",   enrollments: 22 },
      { id: "TRN-002", courseName: "Data Literacy Basics",   category: "Data Skills",     duration: "4",  status: "Active",   enrollments: 15 },
      { id: "TRN-003", courseName: "Clinical AI Integration", category: "Clinical",        duration: "12", status: "Draft",    enrollments: 0  },
    ],
  };
  const fallback = [
    { id: "REC-001", name: "Demo Record 1", status: "Active",  date: "2025-03-01" },
    { id: "REC-002", name: "Demo Record 2", status: "Pending", date: "2025-03-10" },
    { id: "REC-003", name: "Demo Record 3", status: "Closed",  date: "2025-02-20" },
  ];
  return seeds[portalId] || fallback;
}

/** Build the JS to inject into the GAS iframe frame */
export function buildGasMockScript(portalId: string, role: string): string {
  const config   = getMockConfig(portalId);
  const records  = getMockRecords(portalId);
  const perms    = PERMISSIONS[role] || ["view"];
  const user     = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];

  const activity = [
    { title: "Record updated",  detail: "VOL-001 status changed", fullName: "Admin User", timestamp: "2026-03-27 09:00:00" },
    { title: "Record created",  detail: "New record added",        fullName: "Grace Tan",  timestamp: "2026-03-26 14:30:00" },
  ];
  const notifications = [
    { title: "Email sent",  detail: "Welcome email dispatched", fullName: "System", role: "Auto", timestamp: "2026-03-27 09:01:00" },
  ];

  const appState = {
    ok: true,
    config,
    currentUser: user,
    permissions: perms,
    stats: (config as any).dashboardMetrics || [],
    records,
    recentActivity: activity,
    users: DEMO_USERS,
    notifications,
  };

  return `
(function() {
  if (window.__gasMockInstalled) return;
  window.__gasMockInstalled = true;

  // Clear any stale session that may cause auto-login before mock is ready
  try { sessionStorage.clear(); } catch(e) {}

  var _calls = {};
  var _appState = ${JSON.stringify(appState)};
  var _config   = ${JSON.stringify(config)};
  var _records  = ${JSON.stringify(records)};
  var _perms    = ${JSON.stringify(perms)};
  var _user     = ${JSON.stringify(user)};

  function makeRunner(handler, errHandler) {
    return {
      withSuccessHandler: function(fn) { handler = fn; return this; },
      withFailureHandler: function(fn) { errHandler = fn; return this; },
      getAppState:        function(u)   { setTimeout(function() { document.body && document.body.setAttribute('data-mock-fired','1'); handler(_appState); }, 50); },
      getClientConfig:    function()    { setTimeout(function() { handler(_config); }, 50); },
      getPermissionsForRole: function(r){ setTimeout(function() { handler(_perms); }, 50); },
      loadAppState:       function(u,s) { setTimeout(function() { document.body && document.body.setAttribute('data-mock-fired','1'); handler(_appState); }, 50); },
      listRecords:        function(s,u) { setTimeout(function() { handler({ ok:true, records:_records }); }, 80); },
      saveRecord:         function(d,u) {
        var rec = Object.assign({ id: 'NEW-' + Date.now() }, d);
        _records.push(rec);
        setTimeout(function() { handler({ ok:true, record:rec }); }, 100);
      },
      updateRecord:       function(id,d,u) { setTimeout(function() { handler({ ok:true }); }, 100); },
      deleteRecord:       function(id,u) {
        _records = _records.filter(function(r){ return r.id !== id; });
        setTimeout(function() { handler({ ok:true }); }, 100);
      },
      updateWorkflowStatus: function(id,action,note,u) { setTimeout(function() { handler({ ok:true }); }, 100); },
      transitionRecord:   function(id,action,note,u) { setTimeout(function() { handler({ ok:true }); }, 100); },
      uploadAttachment:   function(d,u) { setTimeout(function() { handler({ ok:true, attachment: d }); }, 150); },
      saveAttachment:     function(d,u) { setTimeout(function() { handler({ ok:true, attachment: d }); }, 150); },
      sendRecordEmail:    function(d,u) { setTimeout(function() { handler({ ok:true }); }, 100); },
      sendEmail:          function(d,u) { setTimeout(function() { handler({ ok:true }); }, 100); },
      resetDemoData:      function(u)   { setTimeout(function() { handler({ ok:true }); }, 200); },
      // Portal 00 Master Suite — module-scoped variants (moduleCode is 1st arg)
      getModuleState:     function(mc,u,s) { _getModuleStateCallCount++; setTimeout(function() { document.body && document.body.setAttribute('data-mock-fired','1'); handler(Object.assign({}, _appState, { moduleCards: [] })); }, 50); },
      getModuleCards:     function()       { setTimeout(function() { handler({ ok:true, moduleCards:[] }); }, 50); },
      // saveRecord / deleteRecord / getRecordBundle for portal 00 pass moduleCode first
      // The mock ignores the extra arg and works fine
      getRecordBundle:    function() {
        var id = arguments[1] !== undefined ? arguments[1] : arguments[0];
        var r = _records.find(function(x){ return x.id === id; }) || _records[0];
        var qa = (_appState.config && _appState.config.workflow && _appState.config.workflow.ACTIONS || [])
          .filter(function(a){ return !a.roles || a.roles.indexOf(_user.role) > -1; });
        setTimeout(function() { handler({ ok:true, record:r, quickActions:qa, attachments:[], timeline:[] }); }, 80);
      },
      getRecord:          function(id)  {
        var r = _records.find(function(x){ return x.id === id; }) || _records[0];
        setTimeout(function() { handler({ ok:true, record:r, attachments:[], timeline:[] }); }, 80);
      },
    };
  }

  // Proxy for google.script.run — captured in variable so it can be locked
  var _withSuccessHandlerCallCount = 0;
  var _getModuleStateCallCount = 0;

  var _proxyRun = new Proxy({ __isMockProxy: true }, {
    get: function(target, prop) {
      if (prop === '__isMockProxy') return true;
      if (prop === '__withSuccessHandlerCalls') return _withSuccessHandlerCallCount;
      if (prop === '__getModuleStateCalls') return _getModuleStateCallCount;
      if (prop === 'withSuccessHandler') {
        return function(fn) { _withSuccessHandlerCallCount++; return makeRunner(fn, null); };
      }
      if (prop === 'withFailureHandler') {
        return function(fn) { return makeRunner(null, fn); };
      }
      return function() {};
    }
  });

  var _mockScript = {
    history: { push: function(){}, replace: function(){} },
    host: { close: function(){}, setHeight: function(){}, setWidth: function(){} },
    url: { getLocation: function(cb){ cb({ href: window.location.href, hash: '', parameter: {}, parameters: {} }); } }
  };

  // Lock _mockScript.run so GAS runtime cannot overwrite our proxy
  try {
    Object.defineProperty(_mockScript, 'run', {
      get: function() { return _proxyRun; },
      set: function() { /* intentionally ignore */ },
      configurable: true, enumerable: true
    });
  } catch(e) { _mockScript.run = _proxyRun; }

  var _mockGoogle = {};

  // Lock _mockGoogle.script so GAS cannot replace it
  try {
    Object.defineProperty(_mockGoogle, 'script', {
      get: function() { return _mockScript; },
      set: function() { /* intentionally ignore */ },
      configurable: true, enumerable: true
    });
  } catch(e) { _mockGoogle.script = _mockScript; }

  // Lock window.google so real GAS runtime cannot overwrite our mock
  try {
    Object.defineProperty(window, 'google', {
      get: function() { return _mockGoogle; },
      set: function() { /* intentionally ignore */ },
      configurable: true, enumerable: true
    });
  } catch(e) {
    window.google = _mockGoogle;
  }

  console.log('[GAS MOCK] Installed for portal role: ' + _user.role);
})();
`;
}
