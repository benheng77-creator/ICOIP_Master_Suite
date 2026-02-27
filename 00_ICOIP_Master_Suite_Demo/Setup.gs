function setupProject() {
  setupProject_(true);
}

function setupProject_(resetData) {
  var ss = getSpreadsheet_();

  ICOIP_MASTER_CONFIG.MODULE_ORDER.forEach(function (code) {
    var cfg = getModuleConfig_(code);
    resetSingleModule_(cfg, resetData);
  });

  var users = getOrCreateSheet_(ICOIP_MASTER_CONFIG.USERS_SHEET);
  ensureHeaders_(users, ICOIP_MASTER_CONFIG.USER_COLUMNS);
  if (resetData) {
    clearSheetBody_(users, ICOIP_MASTER_CONFIG.USER_COLUMNS.length);
    if (ICOIP_MASTER_CONFIG.DEMO_USERS_SEED && ICOIP_MASTER_CONFIG.DEMO_USERS_SEED.length) {
      users.getRange(2, 1, ICOIP_MASTER_CONFIG.DEMO_USERS_SEED.length, ICOIP_MASTER_CONFIG.USER_COLUMNS.length).setValues(ICOIP_MASTER_CONFIG.DEMO_USERS_SEED);
    }
  }
  autoSizeSheet_(users, ICOIP_MASTER_CONFIG.USER_COLUMNS.length);

  var audit = getOrCreateSheet_(ICOIP_MASTER_CONFIG.AUDIT_SHEET);
  ensureHeaders_(audit, ICOIP_MASTER_CONFIG.AUDIT_COLUMNS);
  if (resetData) clearSheetBody_(audit, ICOIP_MASTER_CONFIG.AUDIT_COLUMNS.length);
  autoSizeSheet_(audit, ICOIP_MASTER_CONFIG.AUDIT_COLUMNS.length);

  var att = getOrCreateSheet_(ICOIP_MASTER_CONFIG.ATTACHMENTS_SHEET);
  ensureHeaders_(att, ICOIP_MASTER_CONFIG.ATTACHMENT_COLUMNS);
  if (resetData) clearSheetBody_(att, ICOIP_MASTER_CONFIG.ATTACHMENT_COLUMNS.length);
  autoSizeSheet_(att, ICOIP_MASTER_CONFIG.ATTACHMENT_COLUMNS.length);

  var noti = getOrCreateSheet_(ICOIP_MASTER_CONFIG.NOTIFICATIONS_SHEET);
  ensureHeaders_(noti, ICOIP_MASTER_CONFIG.NOTIFICATION_COLUMNS);
  if (resetData) clearSheetBody_(noti, ICOIP_MASTER_CONFIG.NOTIFICATION_COLUMNS.length);
  autoSizeSheet_(noti, ICOIP_MASTER_CONFIG.NOTIFICATION_COLUMNS.length);

  ss.toast(ICOIP_MASTER_CONFIG.PROJECT_NAME + ' setup complete', 'ICOIP', 5);
}

function resetSingleModule_(cfg, resetData) {
  var primary = getOrCreateSheet_(cfg.PRIMARY_SHEET);
  ensureHeaders_(primary, cfg.TABLE_COLUMNS);
  if (resetData !== false) {
    clearSheetBody_(primary, cfg.TABLE_COLUMNS.length);
    if (cfg.SAMPLE_ROWS && cfg.SAMPLE_ROWS.length) {
      primary.getRange(2, 1, cfg.SAMPLE_ROWS.length, cfg.TABLE_COLUMNS.length).setValues(cfg.SAMPLE_ROWS);
    }
  }
  autoSizeSheet_(primary, cfg.TABLE_COLUMNS.length);
}

function clearSheetBody_(sheet, width) {
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, width).clearContent();
  }
}
