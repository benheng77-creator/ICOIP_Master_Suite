function generateRecordId_() {
  var stamp = Utilities.formatDate(new Date(), APP_CONFIG.TIMEZONE, 'yyyyMMdd-HHmmss');
  var randomPart = Math.floor(Math.random() * 9000) + 1000;
  return APP_CONFIG.PORTAL_CODE + '-' + stamp + '-' + randomPart;
}

function formatDateTime_(dateObj) {
  return Utilities.formatDate(dateObj, APP_CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
}

function sanitiseValue_(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/[<>]/g, '')
    .trim();
}

function normaliseCellValue_(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, APP_CONFIG.TIMEZONE, 'yyyy-MM-dd');
  }
  return value === null || value === undefined ? '' : value;
}

function parseDateSafe_(value) {
  if (!value) return null;
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
    return stripTime_(value);
  }
  var parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : stripTime_(parsed);
}

function stripTime_(dateObj) {
  return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
}

function styleHeaderRow_(sheet, colCount) {
  sheet.getRange(1, 1, 1, colCount)
    .setFontWeight('bold')
    .setBackground('#E9EEF5')
    .setFontColor('#223046');
}

function autoSizeSheet_(sheet, colCount) {
  for (var i = 1; i <= colCount; i++) {
    sheet.autoResizeColumn(i);
  }
}

function getClientConfig_() {
  return {
    projectName: APP_CONFIG.PROJECT_NAME,
    programmeName: APP_CONFIG.PROGRAMME_NAME,
    programmeDescription: APP_CONFIG.PROGRAMME_DESCRIPTION,
    pageTitle: APP_CONFIG.PAGE_TITLE,
    pageSubtitle: APP_CONFIG.PAGE_SUBTITLE,
    tableColumns: APP_CONFIG.TABLE_COLUMNS,
    formFields: APP_CONFIG.FORM_FIELDS,
    dashboardMetrics: APP_CONFIG.DASHBOARD_METRICS,
    primarySheet: APP_CONFIG.PRIMARY_SHEET
  };
}
