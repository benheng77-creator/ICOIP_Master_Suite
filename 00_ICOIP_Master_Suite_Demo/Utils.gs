function getClientBootstrap_() {
  var modules = {};
  ICOIP_MASTER_CONFIG.MODULE_ORDER.forEach(function (code) {
    modules[code] = getClientModuleConfig_(code);
  });
  return {
    projectName: ICOIP_MASTER_CONFIG.PROJECT_NAME,
    projectCode: ICOIP_MASTER_CONFIG.PROJECT_CODE,
    pageTitle: ICOIP_MASTER_CONFIG.PAGE_TITLE,
    pageSubtitle: ICOIP_MASTER_CONFIG.PAGE_SUBTITLE,
    programmeName: ICOIP_MASTER_CONFIG.PROGRAMME_NAME,
    programmeDescription: ICOIP_MASTER_CONFIG.PROGRAMME_DESCRIPTION,
    moduleOrder: ICOIP_MASTER_CONFIG.MODULE_ORDER,
    modules: modules,
    demoUsers: ICOIP_MASTER_CONFIG.DEMO_USERS,
    permissions: ICOIP_MASTER_CONFIG.PERMISSIONS
  };
}

function getClientModuleConfig_(moduleCode) {
  var cfg = getModuleConfig_(moduleCode);
  return {
    projectName: cfg.PROJECT_NAME,
    portalCode: cfg.PORTAL_CODE,
    primarySheet: cfg.PRIMARY_SHEET,
    pageTitle: cfg.PAGE_TITLE,
    pageSubtitle: cfg.PAGE_SUBTITLE,
    cardIcon: cfg.CARD_ICON || '■',
    cardDescription: cfg.CARD_DESCRIPTION || cfg.PAGE_SUBTITLE,
    tableColumns: cfg.TABLE_COLUMNS,
    formFields: cfg.FORM_FIELDS,
    dashboardMetrics: cfg.DASHBOARD_METRICS,
    workflow: {
      actions: (cfg.WORKFLOW && cfg.WORKFLOW.ACTIONS) ? cfg.WORKFLOW.ACTIONS : []
    },
    attachmentCategories: cfg.ATTACHMENT_CATEGORIES || [],
    notificationTemplates: cfg.NOTIFICATION_TEMPLATES || [],
    summaryFields: cfg.SUMMARY_FIELDS || []
  };
}

function formatDateTime_(value) {
  return Utilities.formatDate(new Date(value), ICOIP_MASTER_CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
}

function normaliseCellValue_(value) {
  if (value === null || value === undefined) return '';
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
    return formatDateTime_(value);
  }
  return value;
}

function sanitiseValue_(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[<>]/g, '').trim();
}

function parseDateSafe_(value) {
  if (!value) return null;
  var d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function stripTime_(dateObj) {
  return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
}

function autoSizeSheet_(sheet, columnCount) {
  for (var i = 1; i <= columnCount; i++) {
    try { sheet.autoResizeColumn(i); } catch (err) {}
  }
  if (sheet.getFrozenRows() < 1) sheet.setFrozenRows(1);
}

function generateRecordId_(moduleCode) {
  var seq = Utilities.getUuid().split('-')[0].toUpperCase();
  return String(moduleCode || 'REC') + '-' + Utilities.formatDate(new Date(), ICOIP_MASTER_CONFIG.TIMEZONE, 'yyyyMMdd') + '-' + seq;
}

function generateAttachmentId_() {
  return 'ATT-' + Utilities.getUuid().split('-')[0].toUpperCase();
}

function generateNotificationId_() {
  return 'NOTI-' + Utilities.getUuid().split('-')[0].toUpperCase();
}

function getPrimaryStatusValue_(record) {
  var candidates = ['Status', 'Case Status', 'Session Status', 'Onboarding Status'];
  for (var i = 0; i < candidates.length; i++) {
    if (record[candidates[i]] !== undefined) return record[candidates[i]];
  }
  return '';
}

function buildSummaryHtml_(cfg, record) {
  if (!record) return '<p>Record not found.</p>';
  var fields = cfg.SUMMARY_FIELDS || cfg.TABLE_COLUMNS;
  var html = ['<div class="print-wrap">'];
  html.push('<div class="print-header"><h1>' + escapeHtml_(cfg.PAGE_TITLE) + '</h1><p>' + escapeHtml_(ICOIP_MASTER_CONFIG.PROGRAMME_NAME) + '</p></div>');
  html.push('<div class="print-chip">Module: ' + escapeHtml_(cfg.PORTAL_CODE) + ' · Record ID: ' + escapeHtml_(record['Record ID'] || '') + '</div>');
  html.push('<table class="print-table">');
  fields.forEach(function (field) {
    html.push('<tr><th>' + escapeHtml_(field) + '</th><td>' + escapeHtml_(String(record[field] == null ? '' : record[field])) + '</td></tr>');
  });
  html.push('</table>');
  html.push('<div class="print-meta">Generated on ' + escapeHtml_(formatDateTime_(new Date())) + '</div>');
  html.push('</div>');
  return html.join('');
}

function buildPrintOutput_(moduleCode, recordId) {
  var cfg = getModuleConfig_(moduleCode);
  var record = getRecordById_(cfg, recordId);
  var body = buildSummaryHtml_(cfg, record);
  var html = '<!DOCTYPE html><html><head><base target="_top"><meta name="viewport" content="width=device-width, initial-scale=1"><style>' +
    'body{font-family:Arial,sans-serif;padding:24px;color:#1f2937}.print-wrap{max-width:860px;margin:0 auto}.print-header h1{margin:0 0 4px 0}.print-header p{margin:0 0 16px 0;color:#6b7280}.print-chip{display:inline-block;border:1px solid #d1d5db;border-radius:999px;padding:8px 12px;margin-bottom:14px}.print-table{width:100%;border-collapse:collapse}.print-table th,.print-table td{border:1px solid #e5e7eb;padding:10px 12px;text-align:left;vertical-align:top}.print-table th{background:#f9fafb;width:240px}.print-meta{margin-top:18px;color:#6b7280;font-size:12px}@media print{body{padding:0}.print-wrap{max-width:none}}' +
    '</style></head><body>' + body + '<script>window.onload=function(){setTimeout(function(){window.print();},300);};</script></body></html>';
  return HtmlService.createHtmlOutput(html)
    .setTitle(cfg.PROJECT_NAME + ' - ' + recordId);
}

function escapeHtml_(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function listUsers_() {
  var sheet = getOrCreateSheet_(ICOIP_MASTER_CONFIG.USERS_SHEET);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var values = sheet.getRange(2, 1, lastRow - 1, ICOIP_MASTER_CONFIG.USER_COLUMNS.length).getValues();
  return values.map(function (row) {
    return {
      email: String(row[0] || ''),
      fullName: String(row[1] || ''),
      role: String(row[2] || ''),
      department: String(row[3] || ''),
      status: String(row[4] || '')
    };
  });
}

function resolveCurrentUser_(currentUser) {
  var users = listUsers_();
  var email = currentUser && currentUser.email ? String(currentUser.email) : '';
  var match = users.filter(function (u) { return u.email === email; })[0];
  if (!match) {
    match = users[0] || {
      email: 'viewer@icoip.demo',
      fullName: 'Client Viewer',
      role: 'Viewer',
      department: 'External Demo',
      status: 'Active'
    };
  }
  return match;
}

function getPermissionsForRole_(role) {
  return ICOIP_MASTER_CONFIG.PERMISSIONS[role] || [];
}

function ensurePermission_(user, requiredPermission, fallbackPermission) {
  var perms = getPermissionsForRole_(user.role);
  var target = requiredPermission;
  if (fallbackPermission && perms.indexOf(requiredPermission) === -1) {
    target = fallbackPermission;
  }
  if (perms.indexOf(target) === -1) {
    throw new Error('Permission denied for ' + target + '. Current role: ' + user.role);
  }
}

function validatePayload_(cfg, payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload.');
  }
  cfg.FORM_FIELDS.forEach(function (field) {
    if (field.required) {
      var value = payload[field.key];
      if (value === null || value === undefined || String(value).trim() === '') {
        throw new Error(field.label + ' is required.');
      }
    }
  });
}

function appendAuditLog_(moduleCode, moduleTitle, action, recordId, payload, profile, primarySheet) {
  var auditSheet = getOrCreateSheet_(ICOIP_MASTER_CONFIG.AUDIT_SHEET);
  if (auditSheet.getLastRow() < 1) {
    auditSheet.appendRow(ICOIP_MASTER_CONFIG.AUDIT_COLUMNS);
  }
  auditSheet.appendRow([
    formatDateTime_(new Date()),
    moduleCode || '',
    moduleTitle || '',
    profile && profile.email ? profile.email : (Session.getActiveUser().getEmail() || 'demo-user'),
    profile && profile.fullName ? profile.fullName : '',
    profile && profile.role ? profile.role : '',
    action,
    recordId || '',
    primarySheet || '',
    JSON.stringify(payload || {})
  ]);
}

function appendNotificationLog_(payload) {
  var sheet = getOrCreateSheet_(ICOIP_MASTER_CONFIG.NOTIFICATIONS_SHEET);
  if (sheet.getLastRow() < 1) {
    sheet.appendRow(ICOIP_MASTER_CONFIG.NOTIFICATION_COLUMNS);
  }
  sheet.appendRow(payload);
}

function listNotifications_(moduleCode, limit) {
  var sheet = getOrCreateSheet_(ICOIP_MASTER_CONFIG.NOTIFICATIONS_SHEET);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var values = sheet.getRange(2, 1, lastRow - 1, ICOIP_MASTER_CONFIG.NOTIFICATION_COLUMNS.length).getValues();
  return values
    .filter(function (row) { return String(row[1] || '') === String(moduleCode || ''); })
    .map(function (row) {
      return {
        notificationId: String(row[0] || ''),
        moduleCode: String(row[1] || ''),
        moduleTitle: String(row[2] || ''),
        recordId: String(row[3] || ''),
        to: String(row[4] || ''),
        cc: String(row[5] || ''),
        subject: String(row[6] || ''),
        message: String(row[7] || ''),
        deliveryStatus: String(row[8] || ''),
        triggeredBy: String(row[9] || ''),
        triggeredAt: normaliseCellValue_(row[10]),
        sentAt: normaliseCellValue_(row[11])
      };
    }).slice(-1 * (limit || 8)).reverse();
}
