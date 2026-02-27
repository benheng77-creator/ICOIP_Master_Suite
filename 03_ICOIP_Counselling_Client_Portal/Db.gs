
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

function getPrimarySheet_() {
  return getOrCreateSheet_(APP_CONFIG.PRIMARY_SHEET);
}

function ensureHeaders_(sheet, headers) {
  if (sheet.getLastRow() < 1) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    autoSizeSheet_(sheet, headers.length);
  } else {
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

function rowToObject_(row) {
  var obj = {};
  APP_CONFIG.TABLE_COLUMNS.forEach(function (header, index) {
    obj[header] = normaliseCellValue_(row[index]);
  });
  return obj;
}

function listRecords_(searchTerm) {
  var sheet = getPrimarySheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var values = sheet.getRange(2, 1, lastRow - 1, APP_CONFIG.TABLE_COLUMNS.length).getValues();
  var loweredSearch = String(searchTerm || '').trim().toLowerCase();

  return values
    .map(rowToObject_)
    .filter(function (record) {
      if (!loweredSearch) return true;
      return JSON.stringify(record).toLowerCase().indexOf(loweredSearch) > -1;
    })
    .sort(function (a, b) {
      return String(b['Updated At'] || '').localeCompare(String(a['Updated At'] || ''));
    });
}

function getRecordById_(recordId) {
  var sheet = getPrimarySheet_();
  var rowIndex = findRowByRecordId_(sheet, recordId);
  if (!rowIndex) return null;
  var row = sheet.getRange(rowIndex, 1, 1, APP_CONFIG.TABLE_COLUMNS.length).getValues()[0];
  return rowToObject_(row);
}

function getDashboardStats_() {
  var records = listRecords_('');
  var stats = {};

  APP_CONFIG.DASHBOARD_METRICS.forEach(function (metric) {
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
        return d2 && stripTime_(d2) < today2 && String(record.Status || record[APP_CONFIG.WORKFLOW.STATUS_FIELD] || '').toLowerCase() !== 'completed' && String(record.Status || record[APP_CONFIG.WORKFLOW.STATUS_FIELD] || '').toLowerCase() !== 'closed';
      }).length;
    }
    stats[metric.id] = value;
  });

  return stats;
}

function saveRecord_(payload, profile) {
  validatePayload_(payload);
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getPrimarySheet_();
    var headers = APP_CONFIG.TABLE_COLUMNS;
    var now = formatDateTime_(new Date());
    var recordId = sanitiseValue_(payload['Record ID']);
    var rowIndex = findRowByRecordId_(sheet, recordId);
    var valuesByHeader = {};

    headers.forEach(function (header) {
      valuesByHeader[header] = '';
    });

    APP_CONFIG.FORM_FIELDS.forEach(function (field) {
      valuesByHeader[field.key] = sanitiseValue_(payload[field.key]);
    });

    if (!rowIndex) {
      recordId = generateRecordId_();
      valuesByHeader['Record ID'] = recordId;
      valuesByHeader['Created At'] = now;
      valuesByHeader['Updated At'] = now;
      var newRow = headers.map(function (header) { return valuesByHeader[header]; });
      sheet.appendRow(newRow);
      appendAuditLog_('CREATE_RECORD', recordId, valuesByHeader, profile);
      autoSizeSheet_(sheet, headers.length);
      return { ok: true, message: 'Record created successfully.', recordId: recordId };
    }

    var existing = getRecordById_(recordId) || {};
    valuesByHeader['Record ID'] = recordId;
    valuesByHeader['Created At'] = existing['Created At'] || now;
    valuesByHeader['Updated At'] = now;

    var updatedRow = headers.map(function (header) { return valuesByHeader[header]; });
    sheet.getRange(rowIndex, 1, 1, headers.length).setValues([updatedRow]);
    appendAuditLog_('UPDATE_RECORD', recordId, valuesByHeader, profile);
    return { ok: true, message: 'Record updated successfully.', recordId: recordId };
  } finally {
    lock.releaseLock();
  }
}

function deleteRecord_(recordId, profile) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getPrimarySheet_();
    var rowIndex = findRowByRecordId_(sheet, recordId);
    if (!rowIndex) throw new Error('Record not found.');
    sheet.deleteRow(rowIndex);
    appendAuditLog_('DELETE_RECORD', recordId, { recordId: recordId }, profile);
    return { ok: true, message: 'Record deleted successfully.' };
  } finally {
    lock.releaseLock();
  }
}

function getAvailableWorkflowActions_(record, currentUser) {
  if (!record) return [];
  var profile = resolveCurrentUser_(currentUser);
  return (APP_CONFIG.WORKFLOW.ACTIONS || []).filter(function (action) {
    var fieldValue = String(record[action.field] || '');
    var allowedRole = !action.roles || action.roles.indexOf(profile.role) > -1;
    return allowedRole && (!action.from || action.from.indexOf(fieldValue) > -1);
  });
}

function transitionRecord_(recordId, actionKey, note, profile) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var record = getRecordById_(recordId);
    if (!record) throw new Error('Record not found.');
    var action = (APP_CONFIG.WORKFLOW.ACTIONS || []).filter(function (item) { return item.key === actionKey; })[0];
    if (!action) throw new Error('Invalid workflow action.');
    if (action.roles && action.roles.indexOf(profile.role) === -1) {
      throw new Error('Your role cannot perform this action.');
    }
    var currentValue = String(record[action.field] || '');
    if (action.from && action.from.indexOf(currentValue) === -1) {
      throw new Error('Action not allowed from current status: ' + currentValue);
    }

    var sheet = getPrimarySheet_();
    var rowIndex = findRowByRecordId_(sheet, recordId);
    var headers = APP_CONFIG.TABLE_COLUMNS;
    var row = headers.map(function (header) { return record[header] || ''; });
    var fieldIndex = headers.indexOf(action.field);
    var updatedIndex = headers.indexOf('Updated At');

    if (fieldIndex === -1) throw new Error('Workflow field not found in table.');
    row[fieldIndex] = action.to;
    if (updatedIndex > -1) row[updatedIndex] = formatDateTime_(new Date());
    sheet.getRange(rowIndex, 1, 1, headers.length).setValues([row]);

    appendAuditLog_('WORKFLOW_' + action.key.toUpperCase(), recordId, {
      field: action.field,
      from: currentValue,
      to: action.to,
      note: note || ''
    }, profile);

    return {
      ok: true,
      message: action.label + ' completed.',
      recordId: recordId
    };
  } finally {
    lock.releaseLock();
  }
}

function listTimelineByRecord_(recordId) {
  var sheet = getOrCreateSheet_(APP_CONFIG.AUDIT_SHEET);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var values = sheet.getRange(2, 1, lastRow - 1, APP_CONFIG.AUDIT_COLUMNS.length).getValues();
  return values
    .filter(function (row) { return String(row[5] || '') === String(recordId || ''); })
    .map(function (row) {
      return {
        timestamp: normaliseCellValue_(row[0]),
        email: String(row[1] || ''),
        fullName: String(row[2] || ''),
        role: String(row[3] || ''),
        action: String(row[4] || ''),
        details: String(row[7] || '')
      };
    })
    .reverse();
}

function getAttachmentFolder_() {
  if (APP_CONFIG.ATTACHMENT_FOLDER_ID) {
    try { return DriveApp.getFolderById(APP_CONFIG.ATTACHMENT_FOLDER_ID); } catch (err) {}
  }
  var root = DriveApp.getRootFolder();
  var existing = root.getFoldersByName(APP_CONFIG.ATTACHMENT_FOLDER_NAME);
  if (existing.hasNext()) return existing.next();
  return root.createFolder(APP_CONFIG.ATTACHMENT_FOLDER_NAME);
}

function uploadAttachment_(payload, profile) {
  if (!payload || !payload.recordId || !payload.fileName || !payload.base64Data) {
    throw new Error('Attachment payload is incomplete.');
  }
  var bytes = Utilities.base64Decode(payload.base64Data);
  if (bytes.length > 4 * 1024 * 1024) {
    throw new Error('Attachment exceeds 4MB demo limit.');
  }
  var blob = Utilities.newBlob(bytes, payload.mimeType || 'application/octet-stream', payload.fileName);
  var folder = getAttachmentFolder_();
  var file = folder.createFile(blob);

  var row = [
    generateAttachmentId_(),
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

  var sheet = getOrCreateSheet_(APP_CONFIG.ATTACHMENTS_SHEET);
  ensureHeaders_(sheet, APP_CONFIG.ATTACHMENT_COLUMNS);
  sheet.appendRow(row);

  appendAuditLog_('UPLOAD_ATTACHMENT', payload.recordId, {
    fileName: payload.fileName,
    category: payload.category || 'Other',
    driveUrl: file.getUrl()
  }, profile);

  return { ok: true, message: 'Attachment uploaded successfully.', driveUrl: file.getUrl(), fileName: payload.fileName };
}

function listAttachmentsByRecord_(recordId) {
  var sheet = getOrCreateSheet_(APP_CONFIG.ATTACHMENTS_SHEET);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var values = sheet.getRange(2, 1, lastRow - 1, APP_CONFIG.ATTACHMENT_COLUMNS.length).getValues();
  return values.filter(function (row) {
    return String(row[1] || '') === String(recordId || '');
  }).map(function (row) {
    return {
      attachmentId: String(row[0] || ''),
      recordId: String(row[1] || ''),
      fileName: String(row[2] || ''),
      mimeType: String(row[3] || ''),
      fileSize: Number(row[4] || 0),
      category: String(row[5] || ''),
      description: String(row[6] || ''),
      driveFileId: String(row[7] || ''),
      driveUrl: String(row[8] || ''),
      uploadedBy: String(row[9] || ''),
      uploadedAt: normaliseCellValue_(row[10])
    };
  }).reverse();
}

function sendRecordEmail_(payload, profile) {
  if (!payload || !payload.recordId || !payload.to || !payload.subject) {
    throw new Error('Email payload is incomplete.');
  }
  var record = getRecordById_(payload.recordId);
  if (!record) throw new Error('Record not found.');

  var plainBody = payload.message || 'Please refer to the record update.';
  var htmlBody = '<div style="font-family:Arial,sans-serif;color:#1f2937;">' +
    '<p>' + escapeHtml_(plainBody).replace(/\n/g, '<br>') + '</p>' +
    '<hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">' +
    buildSummaryHtml_(record) +
    '</div>';

  MailApp.sendEmail({
    to: payload.to,
    cc: payload.cc || '',
    subject: payload.subject,
    body: plainBody + '\n\nRecord ID: ' + payload.recordId,
    htmlBody: htmlBody
  });

  var row = [
    generateNotificationId_(),
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
  appendAuditLog_('SEND_EMAIL', payload.recordId, {
    to: payload.to,
    cc: payload.cc || '',
    subject: payload.subject
  }, profile);

  return { ok: true, message: 'Email sent successfully.' };
}

function listRecentActivity_(limit) {
  var sheet = getOrCreateSheet_(APP_CONFIG.AUDIT_SHEET);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var values = sheet.getRange(2, 1, lastRow - 1, APP_CONFIG.AUDIT_COLUMNS.length).getValues();
  return values.map(function (row) {
    return {
      timestamp: normaliseCellValue_(row[0]),
      email: String(row[1] || ''),
      fullName: String(row[2] || ''),
      role: String(row[3] || ''),
      action: String(row[4] || ''),
      recordId: String(row[5] || ''),
      details: String(row[7] || '')
    };
  }).slice(-1 * (limit || 10)).reverse();
}
