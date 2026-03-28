/**
 * Shell readiness waits — adapted for GAS iframe architecture.
 */
const { runManifest } = require('../fixtures/run-manifest');

/**
 * Wait for the GAS app iframe to contain #loginModal.
 * Returns the app frame.
 */
async function waitForShellReady(page, timeout = runManifest.timeouts.shellCold) {
  const deadline = Date.now() + timeout;
  let frame;
  while (Date.now() < deadline) {
    for (const f of page.frames()) {
      try {
        if (await f.locator('#loginModal').count() > 0) { frame = f; break; }
      } catch { /* detached */ }
    }
    if (frame) break;
    await page.waitForTimeout(600);
  }
  if (!frame) throw new Error(`Shell not ready: #loginModal not found within ${timeout}ms`);
  return frame;
}

/**
 * Wait for login card grid to be populated.
 */
async function waitForLoginCards(frame, timeout = runManifest.timeouts.auth) {
  const { expect } = require('@playwright/test');
  await expect(frame.locator('.user-card').first()).toBeVisible({ timeout });
}

/**
 * Wait for app shell to appear after card-click login.
 */
async function waitForAppShell(frame, timeout = runManifest.timeouts.shellWarm) {
  const { expect } = require('@playwright/test');
  await expect(frame.locator('#appShell')).toBeVisible({ timeout });
  await expect(frame.locator('#loginModal')).toBeHidden({ timeout: 10000 });
}

/**
 * Wait for mock to have fired (data-mock-fired sentinel) and table to render.
 */
async function waitForDataLoaded(frame, timeout = runManifest.timeouts.mockFired) {
  const { expect } = require('@playwright/test');
  await expect(frame.locator('#tableSkeleton')).toBeHidden({ timeout });
  await expect(frame.locator('#tableCard')).toBeVisible({ timeout });
  await frame.waitForFunction(
    () => document.body.getAttribute('data-mock-fired') === '1',
    { timeout }
  );
}

module.exports = { waitForShellReady, waitForLoginCards, waitForAppShell, waitForDataLoaded };
