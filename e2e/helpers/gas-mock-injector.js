/**
 * GAS mock injector — replaces window.google.script.run with a deterministic
 * local mock. Adapted from tests/gas/gas-mock.ts for the enterprise blueprint.
 */
const { runManifest } = require('../fixtures/run-manifest');

const DEMO_USERS = [
  { email: "admin@icoip.demo",   fullName: "Admin User",    role: "Admin",   department: "Management",        status: "Active" },
  { email: "manager@icoip.demo", fullName: "Grace Tan",     role: "Manager", department: "Volunteer Services", status: "Active" },
  { email: "officer@icoip.demo", fullName: "Daniel Lee",    role: "Officer", department: "Volunteer Services", status: "Active" },
  { email: "viewer@icoip.demo",  fullName: "Client Viewer", role: "Viewer",  department: "External Demo",      status: "Active" },
];

const PERMISSIONS = {
  Admin:   ["view","create","edit","delete","workflow","upload","email","export","reset"],
  Manager: ["view","create","edit","workflow","upload","email","export"],
  Officer: ["view","create","edit","workflow","upload","email","export"],
  Viewer:  ["view","export"],
};

const RECORDS = [
  { id: "REC-001", name: "Demo Record 1", status: "Active",  date: "2025-03-01" },
  { id: "REC-002", name: "Demo Record 2", status: "Pending", date: "2025-03-10" },
  { id: "REC-003", name: "Demo Record 3", status: "Closed",  date: "2025-02-20" },
];

function buildMockScript(role) {
  const user  = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
  const perms = PERMISSIONS[role] || ["view"];
  const appState = {
    ok: true,
    currentUser: user,
    permissions: perms,
    stats: [
      { label: "Total", value: 12 }, { label: "Active", value: 8 },
      { label: "Pending", value: 3 }, { label: "Closed", value: 1 },
    ],
    records: RECORDS,
    recentActivity: [
      { title: "Record updated", detail: "REC-001 status changed", fullName: "Admin User", timestamp: "2026-03-28 09:00:00" },
    ],
    notifications: [
      { title: "Email sent", detail: "Welcome email dispatched", fullName: "System", role: "Auto", timestamp: "2026-03-28 09:01:00" },
    ],
    users: DEMO_USERS,
  };

  return `
(function() {
  if (window.__gasMockInstalled) return;
  window.__gasMockInstalled = true;
  try { sessionStorage.clear(); } catch(e) {}

  var _appState = ${JSON.stringify(appState)};
  var _records  = ${JSON.stringify(RECORDS)};

  function makeRunner(handler, errHandler) {
    return {
      withSuccessHandler: function(fn) { handler = fn; return this; },
      withFailureHandler: function(fn) { errHandler = fn; return this; },
      getAppState:        function()    { setTimeout(function() { document.body.setAttribute('data-mock-fired','1'); handler(_appState); }, 50); },
      loadAppState:       function(u,s) { setTimeout(function() { document.body.setAttribute('data-mock-fired','1'); handler(_appState); }, 50); },
      getModuleState:     function(mc,u,s) { setTimeout(function() { document.body.setAttribute('data-mock-fired','1'); handler(Object.assign({}, _appState, { moduleCards: [] })); }, 50); },
      listRecords:        function(s,u) { setTimeout(function() { handler({ ok:true, records:_records }); }, 80); },
      saveRecord:         function()    { setTimeout(function() { handler({ ok:true, record:{ id:'REC-NEW-'+Date.now() } }); }, 100); },
      updateRecord:       function()    { setTimeout(function() { handler({ ok:true }); }, 100); },
      deleteRecord:       function()    { setTimeout(function() { handler({ ok:true }); }, 100); },
      transitionRecord:   function()    { setTimeout(function() { handler({ ok:true }); }, 100); },
      updateWorkflowStatus: function()  { setTimeout(function() { handler({ ok:true }); }, 100); },
      uploadAttachment:   function(d)   { setTimeout(function() { handler({ ok:true, attachment:d }); }, 150); },
      saveAttachment:     function(d)   { setTimeout(function() { handler({ ok:true, attachment:d }); }, 150); },
      sendRecordEmail:    function()    { setTimeout(function() { handler({ ok:true }); }, 100); },
      sendEmail:          function()    { setTimeout(function() { handler({ ok:true }); }, 100); },
      resetDemoData:      function()    { setTimeout(function() { handler({ ok:true }); }, 200); },
      getRecordBundle:    function() {
        var id = arguments[1] !== undefined ? arguments[1] : arguments[0];
        var r = _records.find(function(x){ return x.id === id; }) || _records[0];
        setTimeout(function() { handler({ ok:true, record:r, quickActions:[], attachments:[], timeline:[] }); }, 80);
      },
      getRecord:          function(id) {
        var r = _records.find(function(x){ return x.id === id; }) || _records[0];
        setTimeout(function() { handler({ ok:true, record:r, attachments:[], timeline:[] }); }, 80);
      },
    };
  }

  var _proxyRun = new Proxy({ __isMockProxy: true }, {
    get: function(target, prop) {
      if (prop === '__isMockProxy') return true;
      if (prop === 'withSuccessHandler') return function(fn) { return makeRunner(fn, null); };
      if (prop === 'withFailureHandler') return function(fn) { return makeRunner(null, fn); };
      return function() {};
    }
  });

  var _mockScript = {
    history: { push: function(){}, replace: function(){} },
    host:    { close: function(){}, setHeight: function(){}, setWidth: function(){} },
    url:     { getLocation: function(cb){ cb({ href: window.location.href, hash:'', parameter:{}, parameters:{} }); } },
  };
  try { Object.defineProperty(_mockScript, 'run', { get: function(){ return _proxyRun; }, set: function(){}, configurable:true, enumerable:true }); }
  catch(e) { _mockScript.run = _proxyRun; }

  var _mockGoogle = {};
  try { Object.defineProperty(_mockGoogle, 'script', { get: function(){ return _mockScript; }, set: function(){}, configurable:true, enumerable:true }); }
  catch(e) { _mockGoogle.script = _mockScript; }

  try { Object.defineProperty(window, 'google', { get: function(){ return _mockGoogle; }, set: function(){}, configurable:true, enumerable:true }); }
  catch(e) { window.google = _mockGoogle; }
})();
`;
}

/**
 * Find the GAS app frame, inject mock, verify installed.
 * Returns the frame.
 */
async function injectMockAndGetFrame(page, role) {
  const mockScript = buildMockScript(role);
  const deadline = Date.now() + runManifest.timeouts.shellCold;
  let frame;

  while (Date.now() < deadline) {
    for (const f of page.frames()) {
      try {
        const cnt = await f.locator('#loginModal').count();
        if (cnt > 0) { frame = f; break; }
      } catch { /* detached */ }
    }
    if (frame) break;
    await page.waitForTimeout(600);
  }
  if (!frame) throw new Error('GAS app frame not found (no #loginModal)');

  const err = await frame.evaluate((script) => {
    try {
      window.__gasMockInstalled = false;
      (new Function(script))();
      return null;
    } catch (e) { return e.message || String(e); }
  }, mockScript);
  if (err) throw new Error(`Mock injection failed: ${err}`);

  const ok = await frame.evaluate(() => !!window.__gasMockInstalled);
  if (!ok) throw new Error('Mock not installed after injection');

  return frame;
}

module.exports = { injectMockAndGetFrame, DEMO_USERS, PERMISSIONS };
