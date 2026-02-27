function getSpreadsheet_() {
  var cfgObj = null;
  if (typeof CONFIG !== 'undefined' && CONFIG) cfgObj = CONFIG;
  if (!cfgObj && typeof ICOIP_MASTER_CONFIG !== 'undefined' && ICOIP_MASTER_CONFIG) cfgObj = ICOIP_MASTER_CONFIG;

  var cfgId = String((cfgObj && (cfgObj.SPREADSHEET_ID || cfgObj.MASTER_SPREADSHEET_ID || cfgObj.DATA_SPREADSHEET_ID)) || '').trim();
  if (cfgId) return SpreadsheetApp.openById(cfgId);

  var props = PropertiesService.getScriptProperties();
  var propId = String(props.getProperty('SPREADSHEET_ID') || props.getProperty('MASTER_SPREADSHEET_ID') || props.getProperty('DATA_SPREADSHEET_ID') || '').trim();
  if (propId) return SpreadsheetApp.openById(propId);

  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) {
      props.setProperty('SPREADSHEET_ID', active.getId());
      props.setProperty('MASTER_SPREADSHEET_ID', active.getId());
      props.setProperty('DATA_SPREADSHEET_ID', active.getId());
      return active;
    }
  } catch (e) { Logger.log('getActiveSpreadsheet unavailable: ' + e.message); }

  var created = SpreadsheetApp.create('ICOIP_Data_' + new Date().getTime());
  props.setProperty('SPREADSHEET_ID', created.getId());
  props.setProperty('MASTER_SPREADSHEET_ID', created.getId());
  props.setProperty('DATA_SPREADSHEET_ID', created.getId());
  return created;
}

function getModuleConfig_(moduleCode) {
  var code = String(moduleCode || '').toUpperCase();
  var cfg = ICOIP_MASTER_CONFIG.MODULES[code];
  if (!cfg) {
    throw new Error('Invalid module code: ' + moduleCode);
  }
  return cfg;
}

function getOrCreateSheet_(name, headers) {
  var ss = getSpreadsheet_();
  if (!ss) throw new Error('Spreadsheet initialization failed');

  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);

  if (headers && headers.length) {
    var current = sh.getLastRow() > 0 ? sh.getRange(1, 1, 1, headers.length).getValues()[0] : [];
    var same = current.length === headers.length && current.every(function(v, i){ return String(v) === String(headers[i]); });
    if (!same) sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  return sh;
}

function getPrimarySheet_(cfg) {
  return getOrCreateSheet_(cfg.PRIMARY_SHEET);
}

function ensureHeaders_(sheet, headers) {
  if (sheet.getLastRow() < 1) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    autoSizeSheet_(sheet, headers.length);
    return;
  }

  var existing = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  var mismatch = false;
  for (var i = 0; i < headers.length; i++) {
    if (String(existing[i] || '') !== String(headers[i] || '')) {
      mismatch = true;
      break;
    }
  }
  if (mismatch) {
    sheet.clear();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    autoSizeSheet_(sheet, headers.length);
  }
}

function findRowByRecordId_(sheet, recordId) {
  if (!recordId) return 0;
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;
  var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0] || '') === String(recordId || '')) {
      return i + 2;
    }
  }
  return 0;
}

function rowToObject_(cfg, row) {
  var obj = {};
  cfg.TABLE_COLUMNS.forEach(function (header, index) {
    obj[header] = normaliseCellValue_(row[index]);
  });
  return obj;
}

function listRecords_(cfg, searchTerm) {
  var sheet = getPrimarySheet_(cfg);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var values = sheet.getRange(2, 1, lastRow - 1, cfg.TABLE_COLUMNS.length).getValues();
  var loweredSearch = String(searchTerm || '').trim().toLowerCase();

  return values
    .map(function (row) { return rowToObject_(cfg, row); })
    .filter(function (record) {
      if (!loweredSearch) return true;
      return JSON.stringify(record).toLowerCase().indexOf(loweredSearch) > -1;
    })
    .sort(function (a, b) {
      return String(b['Updated At'] || '').localeCompare(String(a['Updated At'] || ''));
    });
}

function getRecordById_(cfg, recordId) {
  var sheet = getPrimarySheet_(cfg);
  var rowIndex = findRowByRecordId_(sheet, recordId);
  if (!rowIndex) return null;
  var row = sheet.getRange(rowIndex, 1, 1, cfg.TABLE_COLUMNS.length).getValues()[0];
  return rowToObject_(cfg, row);
}

function getModuleCards_() {
  return ICOIP_MASTER_CONFIG.MODULE_ORDER.map(function (code) {
    var cfg = getModuleConfig_(code);
    var sheet = getPrimarySheet_(cfg);
    var total = Math.max(sheet.getLastRow() - 1, 0);
    return {
      moduleCode: code,
      title: cfg.PAGE_TITLE,
      subtitle: cfg.PAGE_SUBTITLE,
      description: cfg.CARD_DESCRIPTION || cfg.PAGE_SUBTITLE,
      icon: cfg.CARD_ICON || '■',
      totalRecords: total,
      primarySheet: cfg.PRIMARY_SHEET
    };
  });
}

function getDashboardStats_(cfg) {
  var records = listRecords_(cfg, '');
  var stats = {};
  cfg.DASHBOARD_METRICS.forEach(function (metric) {
    var value = 0;
    if (metric.type === 'count') {
      value = records.length;
    } else if (metric.type === 'equals') {
      value = records.filter(function (record) {
        return String(record[metric.field] || '') === String(metric.value || '');
      }).length;
    } else if (metric.type === 'sum') {
      value = records.reduce(function (sum, record) {
        var num = Number(record[metric.field] || 0);
        return sum + (isNaN(num) ? 0 : num);
      }, 0);
    } else if (metric.type === 'date_gte') {
      var today = stripTime_(new Date());
      value = records.filter(function (record) {
        var d = parseDateSafe_(record[metric.field]);
        return d && stripTime_(d) >= today;
      }).length;
    } else if (metric.type === 'date_lt_today') {
      var today2 = stripTime_(new Date());
      value = records.filter(function (record) {
        var d2 = parseDateSafe_(record[metric.field]);
        var statusValue = String(getPrimaryStatusValue_(record) || '').toLowerCase();
        return d2 && stripTime_(d2) < today2 && statusValue !== 'completed' && statusValue !== 'closed' && statusValue !== 'inactive';
      }).length;
    }
    stats[metric.id] = value;
  });
  return stats;
}

function saveRecord_(cfg, payload, profile) {
  validatePayload_(cfg, payload);
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getPrimarySheet_(cfg);
    var headers = cfg.TABLE_COLUMNS;
    var now = formatDateTime_(new Date());
    var recordId = sanitiseValue_(payload['Record ID']);
    var rowIndex = findRowByRecordId_(sheet, recordId);
    var valuesByHeader = {};

    headers.forEach(function (header) { valuesByHeader[header] = ''; });
    cfg.FORM_FIELDS.forEach(function (field) {
      valuesByHeader[field.key] = sanitiseValue_(payload[field.key]);
    });

    if (!rowIndex) {
      recordId = generateRecordId_(cfg.PORTAL_CODE);
      valuesByHeader['Record ID'] = recordId;
      valuesByHeader['Created At'] = now;
      valuesByHeader['Updated At'] = now;
      var newRow = headers.map(function (header) { return valuesByHeader[header]; });
      sheet.appendRow(newRow);
      appendAuditLog_(cfg.PORTAL_CODE, cfg.PAGE_TITLE, 'CREATE_RECORD', recordId, valuesByHeader, profile, cfg.PRIMARY_SHEET);
      autoSizeSheet_(sheet, headers.length);
      return { ok: true, message: 'Record created successfully.', recordId: recordId };
    }

    var existing = getRecordById_(cfg, recordId) || {};
    valuesByHeader['Record ID'] = recordId;
    valuesByHeader['Created At'] = existing['Created At'] || now;
    valuesByHeader['Updated At'] = now;

    var updatedRow = headers.map(function (header) { return valuesByHeader[header]; });
    sheet.getRange(rowIndex, 1, 1, headers.length).setValues([updatedRow]);
    appendAuditLog_(cfg.PORTAL_CODE, cfg.PAGE_TITLE, 'UPDATE_RECORD', recordId, valuesByHeader, profile, cfg.PRIMARY_SHEET);
    return { ok: true, message: 'Record updated successfully.', recordId: recordId };
  } finally {
    lock.releaseLock();
  }
}

function deleteRecord_(cfg, recordId, profile) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getPrimarySheet_(cfg);
    var rowIndex = findRowByRecordId_(sheet, recordId);
    if (!rowIndex) throw new Error('Record not found.');
    sheet.deleteRow(rowIndex);
    appendAuditLog_(cfg.PORTAL_CODE, cfg.PAGE_TITLE, 'DELETE_RECORD', recordId, { recordId: recordId }, profile, cfg.PRIMARY_SHEET);
    return { ok: true, message: 'Record deleted successfully.' };
  } finally {
    lock.releaseLock();
  }
}

function getAvailableWorkflowActions_(cfg, record, currentUser) {
  if (!record) return [];
  var profile = resolveCurrentUser_(currentUser);
  return (cfg.WORKFLOW.ACTIONS || []).filter(function (action) {
    var fieldValue = String(record[action.field] || '');
    var allowedRole = !action.roles || action.roles.indexOf(profile.role) > -1;
    return allowedRole && (!action.from || action.from.indexOf(fieldValue) > -1);
  });
}

function transitionRecord_(cfg, recordId, actionKey, note, profile) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var record = getRecordById_(cfg, recordId);
    if (!record) throw new Error('Record not found.');
    var action = (cfg.WORKFLOW.ACTIONS || []).filter(function (item) { return item.key === actionKey; })[0];
    if (!action) throw new Error('Invalid workflow action.');
    if (action.roles && action.roles.indexOf(profile.role) === -1) {
      throw new Error('Your role cannot perform this action.');
    }
    var currentValue = String(record[action.field] || '');
    if (action.from && action.from.indexOf(currentValue) === -1) {
      throw new Error('Action not allowed from current status: ' + currentValue);
    }

    var sheet = getPrimarySheet_(cfg);
    var rowIndex = findRowByRecordId_(sheet, recordId);
    var headers = cfg.TABLE_COLUMNS;
    var row = headers.map(function (header) { return record[header] || ''; });
    var fieldIndex = headers.indexOf(action.field);
    var updatedIndex = headers.indexOf('Updated At');
    if (fieldIndex === -1) throw new Error('Workflow field not found in table.');
    row[fieldIndex] = action.to;
    if (updatedIndex > -1) row[updatedIndex] = formatDateTime_(new Date());
    sheet.getRange(rowIndex, 1, 1, headers.length).setValues([row]);

    appendAuditLog_(cfg.PORTAL_CODE, cfg.PAGE_TITLE, 'WORKFLOW_' + action.key.toUpperCase(), recordId, {
      field: action.field,
      from: currentValue,
      to: action.to,
      note: note || ''
    }, profile, cfg.PRIMARY_SHEET);

    return { ok: true, message: action.label + ' completed.', recordId: recordId };
  } finally {
    lock.releaseLock();
  }
}

function listTimelineByRecord_(moduleCode, recordId) {
  var sheet = getOrCreateSheet_(ICOIP_MASTER_CONFIG.AUDIT_SHEET);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var values = sheet.getRange(2, 1, lastRow - 1, ICOIP_MASTER_CONFIG.AUDIT_COLUMNS.length).getValues();
  return values
    .filter(function (row) { return String(row[1] || '') === String(moduleCode || '') && String(row[7] || '') === String(recordId || ''); })
    .map(function (row) {
      return {
        timestamp: normaliseCellValue_(row[0]),
        moduleCode: String(row[1] || ''),
        moduleTitle: String(row[2] || ''),
        email: String(row[3] || ''),
        fullName: String(row[4] || ''),
        role: String(row[5] || ''),
        action: String(row[6] || ''),
        details: String(row[9] || '')
      };
    })
    .reverse();
}

function getAttachmentRootFolder_() {
  if (ICOIP_MASTER_CONFIG.ATTACHMENT_ROOT_FOLDER_ID) {
    try { return DriveApp.getFolderById(ICOIP_MASTER_CONFIG.ATTACHMENT_ROOT_FOLDER_ID); } catch (err) {}
  }
  var root = DriveApp.getRootFolder();
  var existing = root.getFoldersByName(ICOIP_MASTER_CONFIG.ATTACHMENT_ROOT_FOLDER_NAME);
  if (existing.hasNext()) return existing.next();
  return root.createFolder(ICOIP_MASTER_CONFIG.ATTACHMENT_ROOT_FOLDER_NAME);
}

function getAttachmentFolder_(cfg) {
  var root = getAttachmentRootFolder_();
  var name = cfg.PORTAL_CODE + '_' + cfg.PRIMARY_SHEET;
  var existing = root.getFoldersByName(name);
  if (existing.hasNext()) return existing.next();
  return root.createFolder(name);
}

function uploadAttachment_(cfg, payload, profile) {
  if (!payload || !payload.recordId || !payload.fileName || !payload.base64Data) {
    throw new Error('Attachment payload is incomplete.');
  }
  var bytes = Utilities.base64Decode(payload.base64Data);
  if (bytes.length > 4 * 1024 * 1024) {
    throw new Error('Attachment exceeds 4MB demo limit.');
  }
  var blob = Utilities.newBlob(bytes, payload.mimeType || 'application/octet-stream', payload.fileName);
  var folder = getAttachmentFolder_(cfg);
  var file = folder.createFile(blob);

  var row = [
    generateAttachmentId_(),
    cfg.PORTAL_CODE,
    cfg.PAGE_TITLE,
    payload.recordId,
    payload.fileName,
    payload.mimeType || '',
    bytes.length,
    payload.category || 'Other',
    sanitiseValue_(payload.description || ''),
    file.getId(),
    file.getUrl(),
    profile.email,
    formatDateTime_(new Date())
  ];

  var sheet = getOrCreateSheet_(ICOIP_MASTER_CONFIG.ATTACHMENTS_SHEET);
  ensureHeaders_(sheet, ICOIP_MASTER_CONFIG.ATTACHMENT_COLUMNS);
  sheet.appendRow(row);

  appendAuditLog_(cfg.PORTAL_CODE, cfg.PAGE_TITLE, 'UPLOAD_ATTACHMENT', payload.recordId, {
    fileName: payload.fileName,
    category: payload.category || 'Other',
    driveUrl: file.getUrl()
  }, profile, cfg.PRIMARY_SHEET);

  return { ok: true, message: 'Attachment uploaded successfully.', driveUrl: file.getUrl(), fileName: payload.fileName };
}

function listAttachmentsByRecord_(moduleCode, recordId) {
  var sheet = getOrCreateSheet_(ICOIP_MASTER_CONFIG.ATTACHMENTS_SHEET);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var values = sheet.getRange(2, 1, lastRow - 1, ICOIP_MASTER_CONFIG.ATTACHMENT_COLUMNS.length).getValues();
  return values.filter(function (row) {
    return String(row[1] || '') === String(moduleCode || '') && String(row[3] || '') === String(recordId || '');
  }).map(function (row) {
    return {
      attachmentId: String(row[0] || ''),
      moduleCode: String(row[1] || ''),
      moduleTitle: String(row[2] || ''),
      recordId: String(row[3] || ''),
      fileName: String(row[4] || ''),
      mimeType: String(row[5] || ''),
      fileSize: Number(row[6] || 0),
      category: String(row[7] || ''),
      description: String(row[8] || ''),
      driveFileId: String(row[9] || ''),
      driveUrl: String(row[10] || ''),
      uploadedBy: String(row[11] || ''),
      uploadedAt: normaliseCellValue_(row[12])
    };
  }).reverse();
}

function sendRecordEmail_(cfg, payload, profile) {
  if (!payload || !payload.recordId || !payload.to || !payload.subject) {
    throw new Error('Email payload is incomplete.');
  }
  var record = getRecordById_(cfg, payload.recordId);
  if (!record) throw new Error('Record not found.');

  var plainBody = payload.message || 'Please refer to the record update.';
  var htmlBody = '<div style="font-family:Arial,sans-serif;color:#1f2937;">' +
    '<p>' + escapeHtml_(plainBody).replace(/\n/g, '<br>') + '</p>' +
    '<hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">' +
    buildSummaryHtml_(cfg, record) +
    '</div>';

  MailApp.sendEmail({
    to: payload.to,
    cc: payload.cc || '',
    subject: payload.subject,
    body: plainBody + '\n\nRecord ID: ' + payload.recordId + '\nModule: ' + cfg.PAGE_TITLE,
    htmlBody: htmlBody
  });

  var row = [
    generateNotificationId_(),
    cfg.PORTAL_CODE,
    cfg.PAGE_TITLE,
    payload.recordId,
    payload.to,
    payload.cc || '',
    payload.subject,
    plainBody,
    'SENT',
    profile.email,
    formatDateTime_(new Date()),
    formatDateTime_(new Date())
  ];

  appendNotificationLog_(row);
  appendAuditLog_(cfg.PORTAL_CODE, cfg.PAGE_TITLE, 'SEND_EMAIL', payload.recordId, {
    to: payload.to,
    cc: payload.cc || '',
    subject: payload.subject
  }, profile, cfg.PRIMARY_SHEET);

  return { ok: true, message: 'Email sent successfully.' };
}

function listRecentActivity_(moduleCode, limit) {
  var sheet = getOrCreateSheet_(ICOIP_MASTER_CONFIG.AUDIT_SHEET);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var values = sheet.getRange(2, 1, lastRow - 1, ICOIP_MASTER_CONFIG.AUDIT_COLUMNS.length).getValues();
  return values
    .filter(function (row) { return String(row[1] || '') === String(moduleCode || ''); })
    .map(function (row) {
      return {
        timestamp: normaliseCellValue_(row[0]),
        moduleCode: String(row[1] || ''),
        moduleTitle: String(row[2] || ''),
        email: String(row[3] || ''),
        fullName: String(row[4] || ''),
        role: String(row[5] || ''),
        action: String(row[6] || ''),
        recordId: String(row[7] || ''),
        primarySheet: String(row[8] || ''),
        details: String(row[9] || '')
      };
    })
    .slice(-1 * (limit || 10))
    .reverse();
}
