function doGet(e) {
  e = e || {};
  var moduleCode = (e.parameter && e.parameter.module) ? String(e.parameter.module).toUpperCase() : ICOIP_MASTER_CONFIG.MODULE_ORDER[0];
  if (e.parameter && e.parameter.mode === 'print' && e.parameter.id) {
    return buildPrintOutput_(moduleCode, e.parameter.id);
  }

  var template = HtmlService.createTemplateFromFile('Index');
  template.bootstrapJson = JSON.stringify(getClientBootstrap_());
  template.initialModule = moduleCode;
  return template.evaluate()
    .setTitle(ICOIP_MASTER_CONFIG.PROJECT_NAME)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function ping() {
  return { ok: true, project: ICOIP_MASTER_CONFIG.PROJECT_NAME, time: new Date().toISOString() };
}

function getModuleState(moduleCode, currentUser, searchTerm) {
  var cfg = getModuleConfig_(moduleCode);
  var profile = resolveCurrentUser_(currentUser);
  return {
    ok: true,
    bootstrap: getClientBootstrap_(),
    moduleConfig: getClientModuleConfig_(moduleCode),
    moduleCards: getModuleCards_(),
    currentUser: profile,
    permissions: getPermissionsForRole_(profile.role),
    stats: getDashboardStats_(cfg),
    records: listRecords_(cfg, searchTerm || ''),
    recentActivity: listRecentActivity_(cfg.PORTAL_CODE, 12),
    notifications: listNotifications_(cfg.PORTAL_CODE, 8)
  };
}

function getRecordBundle(moduleCode, recordId, currentUser) {
  var cfg = getModuleConfig_(moduleCode);
  resolveCurrentUser_(currentUser);
  var record = getRecordById_(cfg, recordId);
  return {
    record: record,
    attachments: listAttachmentsByRecord_(cfg.PORTAL_CODE, recordId),
    timeline: listTimelineByRecord_(cfg.PORTAL_CODE, recordId),
    quickActions: getAvailableWorkflowActions_(cfg, record, currentUser)
  };
}

function saveRecord(moduleCode, payload, currentUser) {
  var cfg = getModuleConfig_(moduleCode);
  var profile = resolveCurrentUser_(currentUser);
  ensurePermission_(profile, 'create', payload && payload['Record ID'] ? 'edit' : 'create');
  return saveRecord_(cfg, payload, profile);
}

function deleteRecord(moduleCode, recordId, currentUser) {
  var cfg = getModuleConfig_(moduleCode);
  var profile = resolveCurrentUser_(currentUser);
  ensurePermission_(profile, 'delete');
  return deleteRecord_(cfg, recordId, profile);
}

function transitionRecord(moduleCode, recordId, actionKey, note, currentUser) {
  var cfg = getModuleConfig_(moduleCode);
  var profile = resolveCurrentUser_(currentUser);
  ensurePermission_(profile, 'workflow');
  return transitionRecord_(cfg, recordId, actionKey, note, profile);
}

function uploadAttachment(moduleCode, payload, currentUser) {
  var cfg = getModuleConfig_(moduleCode);
  var profile = resolveCurrentUser_(currentUser);
  ensurePermission_(profile, 'upload');
  return uploadAttachment_(cfg, payload, profile);
}

function sendRecordEmail(moduleCode, payload, currentUser) {
  var cfg = getModuleConfig_(moduleCode);
  var profile = resolveCurrentUser_(currentUser);
  ensurePermission_(profile, 'email');
  return sendRecordEmail_(cfg, payload, profile);
}

function getPrintableUrl(moduleCode, recordId) {
  var baseUrl = ScriptApp.getService().getUrl();
  return baseUrl ? (baseUrl + '?module=' + encodeURIComponent(moduleCode) + '&mode=print&id=' + encodeURIComponent(recordId)) : '';
}

function resetModuleDemoData(moduleCode, currentUser) {
  var cfg = getModuleConfig_(moduleCode);
  var profile = resolveCurrentUser_(currentUser);
  ensurePermission_(profile, 'reset');
  resetSingleModule_(cfg);
  appendAuditLog_(cfg.PORTAL_CODE, cfg.PAGE_TITLE, 'RESET_MODULE_DEMO_DATA', '', { by: profile.email }, profile, cfg.PRIMARY_SHEET);
  return { ok: true, message: cfg.PAGE_TITLE + ' demo data reset successfully.' };
}

function resetAllDemoData(currentUser) {
  var profile = resolveCurrentUser_(currentUser);
  ensurePermission_(profile, 'reset');
  setupProject_(true);
  appendAuditLog_('SYSTEM', 'ICOIP Master Suite', 'RESET_ALL_DEMO_DATA', '', { by: profile.email }, profile, 'SYSTEM');
  return { ok: true, message: 'All ICOIP master demo data reset successfully.' };
}
