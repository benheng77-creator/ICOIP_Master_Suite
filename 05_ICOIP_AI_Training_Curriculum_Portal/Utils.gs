
function getClientConfig_() {
  return {
    projectName: APP_CONFIG.PROJECT_NAME,
    portalCode: APP_CONFIG.PORTAL_CODE,
    pageTitle: APP_CONFIG.PAGE_TITLE,
    pageSubtitle: APP_CONFIG.PAGE_SUBTITLE,
    programmeName: APP_CONFIG.PROGRAMME_NAME,
    programmeDescription: APP_CONFIG.PROGRAMME_DESCRIPTION,
    tableColumns: APP_CONFIG.TABLE_COLUMNS,
    formFields: APP_CONFIG.FORM_FIELDS,
    dashboardMetrics: APP_CONFIG.DASHBOARD_METRICS,
    demoUsers: APP_CONFIG.DEMO_USERS,
    permissions: APP_CONFIG.PERMISSIONS,
    workflow: APP_CONFIG.WORKFLOW,
    attachmentCategories: APP_CONFIG.ATTACHMENT_CATEGORIES || [],
    notificationTemplates: APP_CONFIG.NOTIFICATION_TEMPLATES || [],
    summaryFields: APP_CONFIG.SUMMARY_FIELDS || []
  };
}

function formatDateTime_(value) {
  return Utilities.formatDate(new Date(value), APP_CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
}

function formatDateOnly_(value) {
  return Utilities.formatDate(new Date(value), APP_CONFIG.TIMEZONE, 'yyyy-MM-dd');
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

function generateRecordId_() {
  var seq = Utilities.getUuid().split('-')[0].toUpperCase();
  return APP_CONFIG.PORTAL_CODE + '-' + Utilities.formatDate(new Date(), APP_CONFIG.TIMEZONE, 'yyyyMMdd') + '-' + seq;
}

function generateAttachmentId_() {
  return 'ATT-' + Utilities.getUuid().split('-')[0].toUpperCase();
}

function generateNotificationId_() {
  return 'NOTI-' + Utilities.getUuid().split('-')[0].toUpperCase();
}

function getBaseWebAppUrl_(e) {
  try {
    return ScriptApp.getService().getUrl() || '';
  } catch (err) {
    return '';
  }
}

function buildSummaryHtml_(record) {
  if (!record) return '<p>Record not found.</p>';
  var fields = APP_CONFIG.SUMMARY_FIELDS || APP_CONFIG.TABLE_COLUMNS;
  var html = ['<div class="print-wrap">'];
  html.push('<div class="print-header"><h1>' + escapeHtml_(APP_CONFIG.PAGE_TITLE) + '</h1><p>' + escapeHtml_(APP_CONFIG.PROGRAMME_NAME) + '</p></div>');
  html.push('<div class="print-chip">Record ID: ' + escapeHtml_(record['Record ID'] || '') + '</div>');
  html.push('<table class="print-table">');
  fields.forEach(function (field) {
    html.push('<tr><th>' + escapeHtml_(field) + '</th><td>' + escapeHtml_(String(record[field] == null ? '' : record[field])) + '</td></tr>');
  });
  html.push('</table>');
  html.push('<div class="print-meta">Generated on ' + escapeHtml_(formatDateTime_(new Date())) + '</div>');
  html.push('</div>');
  return html.join('');
}

function buildPrintOutput_(recordId) {
  var record = getRecordById_(recordId);
  var body = buildSummaryHtml_(record);
  var html = '<!DOCTYPE html><html><head><base target="_top"><meta name="viewport" content="width=device-width, initial-scale=1"><style>' +
    'body{font-family:Arial,sans-serif;padding:24px;color:#1f2937}.print-wrap{max-width:860px;margin:0 auto}.print-header h1{margin:0 0 4px 0}.print-header p{margin:0 0 16px 0;color:#6b7280}.print-chip{display:inline-block;border:1px solid #d1d5db;border-radius:999px;padding:8px 12px;margin-bottom:14px}.print-table{width:100%;border-collapse:collapse}.print-table th,.print-table td{border:1px solid #e5e7eb;padding:10px 12px;text-align:left;vertical-align:top}.print-table th{background:#f9fafb;width:240px}.print-meta{margin-top:18px;color:#6b7280;font-size:12px}@media print{body{padding:0}.print-wrap{max-width:none}}' +
    '</style></head><body>' + body + '<script>window.onload=function(){setTimeout(function(){window.print();},300);};</script></body></html>';
  return HtmlService.createHtmlOutput(html)
    .setTitle(APP_CONFIG.PROJECT_NAME + ' - ' + recordId);
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
  var sheet = getOrCreateSheet_(APP_CONFIG.USERS_SHEET);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var values = sheet.getRange(2, 1, lastRow - 1, APP_CONFIG.USER_COLUMNS.length).getValues();
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
  return APP_CONFIG.PERMISSIONS[role] || [];
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

function validatePayload_(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload.');
  }

  APP_CONFIG.FORM_FIELDS.forEach(function (field) {
    if (field.required) {
      var value = payload[field.key];
      if (value === null || value === undefined || String(value).trim() === '') {
        throw new Error(field.label + ' is required.');
      }
    }
  });
}

function appendAuditLog_(action, recordId, payload, profile) {
  var auditSheet = getOrCreateSheet_(APP_CONFIG.AUDIT_SHEET);
  if (auditSheet.getLastRow() < 1) {
    auditSheet.appendRow(APP_CONFIG.AUDIT_COLUMNS);
  }
  auditSheet.appendRow([
    formatDateTime_(new Date()),
    profile && profile.email ? profile.email : (Session.getActiveUser().getEmail() || 'demo-user'),
    profile && profile.fullName ? profile.fullName : '',
    profile && profile.role ? profile.role : '',
    action,
    recordId || '',
    APP_CONFIG.PRIMARY_SHEET,
    JSON.stringify(payload || {})
  ]);
}

function appendNotificationLog_(payload) {
  var sheet = getOrCreateSheet_(APP_CONFIG.NOTIFICATIONS_SHEET);
  if (sheet.getLastRow() < 1) {
    sheet.appendRow(APP_CONFIG.NOTIFICATION_COLUMNS);
  }
  sheet.appendRow(payload);
}

function listNotifications_(limit) {
  var sheet = getOrCreateSheet_(APP_CONFIG.NOTIFICATIONS_SHEET);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var values = sheet.getRange(2, 1, lastRow - 1, APP_CONFIG.NOTIFICATION_COLUMNS.length).getValues();
  return values.map(function (row) {
    return {
      notificationId: String(row[0] || ''),
      recordId: String(row[1] || ''),
      to: String(row[2] || ''),
      cc: String(row[3] || ''),
      subject: String(row[4] || ''),
      message: String(row[5] || ''),
      deliveryStatus: String(row[6] || ''),
      triggeredBy: String(row[7] || ''),
      triggeredAt: normaliseCellValue_(row[8]),
      sentAt: normaliseCellValue_(row[9])
    };
  }).slice(-1 * (limit || 8)).reverse();
}
