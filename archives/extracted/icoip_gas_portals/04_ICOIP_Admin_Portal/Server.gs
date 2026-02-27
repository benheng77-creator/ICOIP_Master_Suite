function doGet() {
  var template = HtmlService.createTemplateFromFile('Index');
  template.appConfigJson = JSON.stringify(getClientConfig_());
  return template.evaluate()
    .setTitle(APP_CONFIG.PROJECT_NAME)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getAppState() {
  return {
    config: getClientConfig_(),
    stats: getDashboardStats_(),
    records: listRecords_('')
  };
}

function listRecords(searchTerm) {
  return listRecords_(searchTerm || '');
}

function getRecordById(recordId) {
  var records = listRecords_('');
  return records.find(function (item) { return item['Record ID'] === recordId; }) || null;
}

function saveRecord(payload) {
  validatePayload_(payload);
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getPrimarySheet_();
    var headers = APP_CONFIG.TABLE_COLUMNS;
    var now = formatDateTime_(new Date());
    var valuesByHeader = {};
    headers.forEach(function (header) {
      valuesByHeader[header] = '';
    });

    Object.keys(payload).forEach(function (key) {
      if (headers.indexOf(key) > -1) {
        valuesByHeader[key] = sanitiseValue_(payload[key]);
      }
    });

    var recordId = sanitiseValue_(payload['Record ID']);
    var rowIndex = findRowByRecordId_(sheet, recordId);

    if (!rowIndex) {
      recordId = generateRecordId_();
      valuesByHeader['Record ID'] = recordId;
      valuesByHeader['Created At'] = now;
      valuesByHeader['Updated At'] = now;
      var row = headers.map(function (header) { return valuesByHeader[header]; });
      sheet.appendRow(row);
      appendAuditLog_('CREATE', recordId, valuesByHeader);
      autoSizeSheet_(sheet, headers.length);
      return { ok: true, message: 'Record created.', recordId: recordId };
    }

    valuesByHeader['Record ID'] = recordId;
    var existing = getRowObject_(sheet, rowIndex);
    valuesByHeader['Created At'] = existing['Created At'] || now;
    valuesByHeader['Updated At'] = now;
    var updatedRow = headers.map(function (header) { return valuesByHeader[header]; });
    sheet.getRange(rowIndex, 1, 1, headers.length).setValues([updatedRow]);
    appendAuditLog_('UPDATE', recordId, valuesByHeader);
    autoSizeSheet_(sheet, headers.length);
    return { ok: true, message: 'Record updated.', recordId: recordId };
  } finally {
    lock.releaseLock();
  }
}

function deleteRecord(recordId) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getPrimarySheet_();
    var rowIndex = findRowByRecordId_(sheet, recordId);
    if (!rowIndex) {
      return { ok: false, message: 'Record not found.' };
    }
    var payload = getRowObject_(sheet, rowIndex);
    sheet.deleteRow(rowIndex);
    appendAuditLog_('DELETE', recordId, payload);
    return { ok: true, message: 'Record deleted.' };
  } finally {
    lock.releaseLock();
  }
}
