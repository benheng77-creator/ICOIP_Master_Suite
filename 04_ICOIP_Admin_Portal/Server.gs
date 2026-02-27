
function doGet(e) {
  e = e || {};
  if (e.parameter && e.parameter.mode === 'print' && e.parameter.id) {
    return buildPrintOutput_(e.parameter.id);
  }

  var template = HtmlService.createTemplateFromFile('Index');
  template.appConfigJson = JSON.stringify(getClientConfig_());
  template.baseUrl = getBaseWebAppUrl_(e);
  return template.evaluate()
    .setTitle(APP_CONFIG.PROJECT_NAME)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function ping() {
  return { ok: true, project: APP_CONFIG.PROJECT_NAME, time: new Date().toISOString() };
}

function getAppState(currentUser, searchTerm) {
  var profile = resolveCurrentUser_(currentUser);
  return {
    ok: true,
    config: getClientConfig_(),
    currentUser: profile,
    permissions: getPermissionsForRole_(profile.role),
    stats: getDashboardStats_(),
    records: listRecords_(searchTerm || ''),
    recentActivity: listRecentActivity_(12),
    users: listUsers_(),
    notifications: listNotifications_(8)
  };
}

function listRecords(searchTerm, currentUser) {
  resolveCurrentUser_(currentUser);
  return listRecords_(searchTerm || '');
}

function getRecordBundle(recordId, currentUser) {
  resolveCurrentUser_(currentUser);
  var record = getRecordById_(recordId);
  return {
    record: record,
    attachments: listAttachmentsByRecord_(recordId),
    timeline: listTimelineByRecord_(recordId),
    quickActions: getAvailableWorkflowActions_(record, currentUser)
  };
}

function saveRecord(payload, currentUser) {
  var profile = resolveCurrentUser_(currentUser);
  ensurePermission_(profile, 'create', payload && payload['Record ID'] ? 'edit' : 'create');
  return saveRecord_(payload, profile);
}

function deleteRecord(recordId, currentUser) {
  var profile = resolveCurrentUser_(currentUser);
  ensurePermission_(profile, 'delete');
  return deleteRecord_(recordId, profile);
}

function transitionRecord(recordId, actionKey, note, currentUser) {
  var profile = resolveCurrentUser_(currentUser);
  ensurePermission_(profile, 'workflow');
  return transitionRecord_(recordId, actionKey, note, profile);
}

function uploadAttachment(payload, currentUser) {
  var profile = resolveCurrentUser_(currentUser);
  ensurePermission_(profile, 'upload');
  return uploadAttachment_(payload, profile);
}

function sendRecordEmail(payload, currentUser) {
  var profile = resolveCurrentUser_(currentUser);
  ensurePermission_(profile, 'email');
  return sendRecordEmail_(payload, profile);
}

function getPrintableUrl(recordId) {
  var baseUrl = ScriptApp.getService().getUrl();
  return baseUrl ? (baseUrl + '?mode=print&id=' + encodeURIComponent(recordId)) : '';
}

function resetDemoData(currentUser) {
  var profile = resolveCurrentUser_(currentUser);
  ensurePermission_(profile, 'reset');
  setupProject_(true);
  appendAuditLog_('RESET_DEMO_DATA', '', { by: profile.email }, profile);
  return { ok: true, message: 'Demo data reset successfully.' };
}
