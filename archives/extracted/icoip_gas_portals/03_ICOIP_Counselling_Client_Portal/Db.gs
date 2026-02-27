function getSpreadsheet_() {
  return APP_CONFIG.SPREADSHEET_ID
    ? SpreadsheetApp.openById(APP_CONFIG.SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
}

function getPrimarySheet_() {
  return getOrCreateSheet_(APP_CONFIG.PRIMARY_SHEET);
}

function getOrCreateSheet_(sheetName) {
  var ss = getSpreadsheet_();
  return ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
}

function listRecords_(searchTerm) {
  var sheet = getPrimarySheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return [];
  }

  var values = sheet.getRange(2, 1, lastRow - 1, APP_CONFIG.TABLE_COLUMNS.length).getValues();
  var loweredSearch = String(searchTerm || '').trim().toLowerCase();

  return values
    .filter(function (row) {
      if (!loweredSearch) return true;
      return row.join(' ').toLowerCase().indexOf(loweredSearch) > -1;
    })
    .map(function (row) {
      var obj = {};
      APP_CONFIG.TABLE_COLUMNS.forEach(function (header, index) {
        obj[header] = normaliseCellValue_(row[index]);
      });
      return obj;
    })
    .sort(function (a, b) {
      return String(b['Updated At'] || '').localeCompare(String(a['Updated At'] || ''));
    });
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
      value = records.reduce(function (total, record) {
        var num = Number(record[metric.field] || 0);
        return total + (isNaN(num) ? 0 : num);
      }, 0);
    } else if (metric.type === 'date_gte') {
      value = records.filter(function (record) {
        var value = parseDateSafe_(record[metric.field]);
        return value && value >= stripTime_(new Date());
      }).length;
    } else if (metric.type === 'date_lt_today') {
      value = records.filter(function (record) {
        var dateValue = parseDateSafe_(record[metric.field]);
        var status = String(record.Status || '').toLowerCase();
        return dateValue && dateValue < stripTime_(new Date()) && status !== 'completed' && status !== 'closed';
      }).length;
    }

    stats[metric.id] = value;
  });

  return stats;
}

function findRowByRecordId_(sheet, recordId) {
  if (!recordId) return 0;
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;
  var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(recordId)) {
      return i + 2;
    }
  }
  return 0;
}

function getRowObject_(sheet, rowIndex) {
  var row = sheet.getRange(rowIndex, 1, 1, APP_CONFIG.TABLE_COLUMNS.length).getValues()[0];
  var obj = {};
  APP_CONFIG.TABLE_COLUMNS.forEach(function (header, index) {
    obj[header] = normaliseCellValue_(row[index]);
  });
  return obj;
}

function appendAuditLog_(action, recordId, payload) {
  var auditSheet = getOrCreateSheet_(APP_CONFIG.AUDIT_SHEET);
  auditSheet.appendRow([
    formatDateTime_(new Date()),
    Session.getActiveUser().getEmail() || 'demo-user',
    action,
    recordId,
    APP_CONFIG.PRIMARY_SHEET,
    JSON.stringify(payload || {})
  ]);
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
