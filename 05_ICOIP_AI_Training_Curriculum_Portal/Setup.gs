
function setupProject() {
  setupProject_(true);
}

function setupProject_(resetData) {
  var ss = getSpreadsheet_();

  var primary = getOrCreateSheet_(APP_CONFIG.PRIMARY_SHEET);
  ensureHeaders_(primary, APP_CONFIG.TABLE_COLUMNS);
  if (resetData) {
    if (primary.getLastRow() > 1) {
      primary.getRange(2, 1, Math.max(primary.getLastRow() - 1, 1), APP_CONFIG.TABLE_COLUMNS.length).clearContent();
    }
    if (APP_CONFIG.SAMPLE_ROWS && APP_CONFIG.SAMPLE_ROWS.length) {
      primary.getRange(2, 1, APP_CONFIG.SAMPLE_ROWS.length, APP_CONFIG.TABLE_COLUMNS.length).setValues(APP_CONFIG.SAMPLE_ROWS);
    }
  }
  autoSizeSheet_(primary, APP_CONFIG.TABLE_COLUMNS.length);

  var audit = getOrCreateSheet_(APP_CONFIG.AUDIT_SHEET);
  ensureHeaders_(audit, APP_CONFIG.AUDIT_COLUMNS);
  if (resetData && audit.getLastRow() > 1) {
    audit.getRange(2, 1, Math.max(audit.getLastRow() - 1, 1), APP_CONFIG.AUDIT_COLUMNS.length).clearContent();
  }
  autoSizeSheet_(audit, APP_CONFIG.AUDIT_COLUMNS.length);

  var users = getOrCreateSheet_(APP_CONFIG.USERS_SHEET);
  ensureHeaders_(users, APP_CONFIG.USER_COLUMNS);
  if (resetData) {
    if (users.getLastRow() > 1) {
      users.getRange(2, 1, Math.max(users.getLastRow() - 1, 1), APP_CONFIG.USER_COLUMNS.length).clearContent();
    }
    if (APP_CONFIG.DEMO_USERS_SEED && APP_CONFIG.DEMO_USERS_SEED.length) {
      users.getRange(2, 1, APP_CONFIG.DEMO_USERS_SEED.length, APP_CONFIG.USER_COLUMNS.length).setValues(APP_CONFIG.DEMO_USERS_SEED);
    }
  }
  autoSizeSheet_(users, APP_CONFIG.USER_COLUMNS.length);

  var att = getOrCreateSheet_(APP_CONFIG.ATTACHMENTS_SHEET);
  ensureHeaders_(att, APP_CONFIG.ATTACHMENT_COLUMNS);
  if (resetData && att.getLastRow() > 1) {
    att.getRange(2, 1, Math.max(att.getLastRow() - 1, 1), APP_CONFIG.ATTACHMENT_COLUMNS.length).clearContent();
  }
  autoSizeSheet_(att, APP_CONFIG.ATTACHMENT_COLUMNS.length);

  var noti = getOrCreateSheet_(APP_CONFIG.NOTIFICATIONS_SHEET);
  ensureHeaders_(noti, APP_CONFIG.NOTIFICATION_COLUMNS);
  if (resetData && noti.getLastRow() > 1) {
    noti.getRange(2, 1, Math.max(noti.getLastRow() - 1, 1), APP_CONFIG.NOTIFICATION_COLUMNS.length).clearContent();
  }
  autoSizeSheet_(noti, APP_CONFIG.NOTIFICATION_COLUMNS.length);

  ss.toast(APP_CONFIG.PROJECT_NAME + ' setup complete', 'ICOIP', 5);
}
