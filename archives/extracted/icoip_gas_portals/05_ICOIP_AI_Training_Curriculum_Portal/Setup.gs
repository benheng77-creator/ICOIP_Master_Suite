function setupProject() {
  var ss = getSpreadsheet_();
  var dataSheet = getOrCreateSheet_(APP_CONFIG.PRIMARY_SHEET);
  var auditSheet = getOrCreateSheet_(APP_CONFIG.AUDIT_SHEET);

  dataSheet.clearContents();
  dataSheet.clearFormats();
  auditSheet.clearContents();
  auditSheet.clearFormats();

  dataSheet.getRange(1, 1, 1, APP_CONFIG.TABLE_COLUMNS.length).setValues([APP_CONFIG.TABLE_COLUMNS]);
  styleHeaderRow_(dataSheet, APP_CONFIG.TABLE_COLUMNS.length);
  dataSheet.setFrozenRows(1);

  if (APP_CONFIG.SAMPLE_ROWS && APP_CONFIG.SAMPLE_ROWS.length) {
    dataSheet.getRange(2, 1, APP_CONFIG.SAMPLE_ROWS.length, APP_CONFIG.TABLE_COLUMNS.length)
      .setValues(APP_CONFIG.SAMPLE_ROWS);
  }

  auditSheet.getRange(1, 1, 1, 6).setValues([['Timestamp', 'User', 'Action', 'Record ID', 'Primary Sheet', 'Payload']]);
  styleHeaderRow_(auditSheet, 6);
  auditSheet.setFrozenRows(1);

  autoSizeSheet_(dataSheet, APP_CONFIG.TABLE_COLUMNS.length);
  autoSizeSheet_(auditSheet, 6);

  return {
    ok: true,
    message: APP_CONFIG.PROJECT_NAME + ' setup completed.',
    spreadsheetUrl: ss.getUrl()
  };
}

function seedDemoData() {
  return setupProject();
}

function clearDemoData() {
  var sheet = getPrimarySheet_();
  if (sheet.getLastRow() > 1) {
    sheet.deleteRows(2, sheet.getLastRow() - 1);
  }
  return { ok: true, message: 'Demo data cleared.' };
}
