function installConsoleGuard(page, bucket) {
  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    bucket.console.push({ type, text });
    if (type === 'error') bucket.severe.push(`console.error: ${text}`);
  });
  page.on('pageerror', (err) => {
    const text = err?.stack || err?.message || String(err);
    bucket.pageErrors.push(text);
    bucket.severe.push(`pageerror: ${text}`);
  });
}

function assertNoSevereConsole(bucket) {
  if (bucket.severe.length) {
    throw new Error(`Severe browser errors detected:\n${bucket.severe.join('\n\n')}`);
  }
}

module.exports = { installConsoleGuard, assertNoSevereConsole };
