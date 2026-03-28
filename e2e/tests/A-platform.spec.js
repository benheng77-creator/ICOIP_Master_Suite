/**
 * Gate A — Platform alive.
 * @smoke @critical-smoke
 */
const { test, expect } = require('@playwright/test');
const { runManifest }  = require('../fixtures/run-manifest');
const { waitForShellReady } = require('../helpers/shell-waits');
const { setupPageGuards, finalizePageGuards } = require('../helpers/test-hooks');
const { injectMockAndGetFrame } = require('../helpers/gas-mock-injector');

test.describe('A platform', () => {
  let bucket;

  test.beforeEach(async ({ page }) => {
    bucket = await setupPageGuards(page);
    await page.goto(runManifest.baseURL, { waitUntil: 'domcontentloaded', timeout: runManifest.timeouts.navigation });
  });

  test.afterEach(async ({ page }, testInfo) => {
    await finalizePageGuards(page, bucket, testInfo);
  });

  test('@smoke @critical-smoke A01 shell loads and GAS iframe resolves', async ({ page }) => {
    const frame = await waitForShellReady(page, runManifest.timeouts.shellCold);
    await expect(frame.locator('#loginModal')).toBeVisible();
    await expect(page.locator('body')).toBeVisible();
  });

  test('@smoke A02 login modal has 4 role cards', async ({ page }) => {
    const frame = await injectMockAndGetFrame(page, 'Admin');
    await expect(frame.locator('.user-card').first()).toBeVisible({ timeout: runManifest.timeouts.auth });
    const cards = await frame.locator('.user-card').count();
    expect(cards).toBeGreaterThanOrEqual(4);
  });

  test('@smoke A03 login modal has correct ARIA attributes', async ({ page }) => {
    await injectMockAndGetFrame(page, 'Admin');
    const frame = page.frames().find(f => f.url().includes('script.google.com') || true);
    const gasFrame = await waitForShellReady(page);
    await expect(gasFrame.locator('#loginModal')).toHaveAttribute('role', 'dialog');
    await expect(gasFrame.locator('#loginModal')).toHaveAttribute('aria-modal', 'true');
  });
});
