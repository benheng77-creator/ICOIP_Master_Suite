function installNetworkGuard(page, bucket) {
  page.on('requestfailed', (req) => {
    bucket.network.push({ type: 'requestfailed', url: req.url(), method: req.method(), failure: req.failure()?.errorText || 'unknown' });
  });
  page.on('response', async (res) => {
    const status = res.status();
    if (status >= 400) bucket.network.push({ type: 'badresponse', url: res.url(), status });
  });
}

// GAS portals commonly block cross-origin requests (fonts, analytics, CSP).
// Only treat as critical: 5xx responses and non-Google requestfailed.
const GAS_INFRA_DOMAINS = ['google.com', 'googleapis.com', 'googleusercontent.com', 'gstatic.com', 'fonts.'];

function assertNoCriticalNetwork(bucket) {
  const critical = bucket.network.filter((item) => {
    const url = item.url || '';
    const isGasInfra = GAS_INFRA_DOMAINS.some(d => url.includes(d));
    if (item.type === 'requestfailed' && !isGasInfra) return true;
    if (item.type === 'badresponse' && item.status >= 500) return true;
    return false;
  });
  if (critical.length) {
    throw new Error(`Critical network failures:\n${JSON.stringify(critical, null, 2)}`);
  }
}

module.exports = { installNetworkGuard, assertNoCriticalNetwork };
