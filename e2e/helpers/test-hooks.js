const fs   = require('fs');
const path = require('path');
const { installConsoleGuard, assertNoSevereConsole } = require('./console-guard');
const { installNetworkGuard, assertNoCriticalNetwork } = require('./network-guard');

function createBuckets() {
  return { console: [], pageErrors: [], network: [], severe: [] };
}

async function setupPageGuards(page) {
  const bucket = createBuckets();
  installConsoleGuard(page, bucket);
  installNetworkGuard(page, bucket);
  return bucket;
}

async function finalizePageGuards(page, bucket, testInfo) {
  const failed = testInfo.status !== testInfo.expectedStatus;

  if (failed) {
    const output = {
      title:  testInfo.title,
      status: testInfo.status,
      url:    page.url(),
      console:    bucket.console,
      pageErrors: bucket.pageErrors,
      network:    bucket.network,
    };
    const safeName = testInfo.title.replace(/[^\w.-]+/g, '_').slice(0, 120);
    const logsDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
    fs.writeFileSync(path.join(logsDir, `${safeName}.failure.json`), JSON.stringify(output, null, 2));

    const ssDir = path.join(__dirname, '..', 'screenshots');
    if (!fs.existsSync(ssDir)) fs.mkdirSync(ssDir, { recursive: true });
    await page.screenshot({ path: path.join(ssDir, `${safeName}.png`), fullPage: true }).catch(() => {});
  }

  assertNoSevereConsole(bucket);
  assertNoCriticalNetwork(bucket);
}

module.exports = { setupPageGuards, finalizePageGuards };
