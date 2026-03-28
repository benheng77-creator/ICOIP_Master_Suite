/**
 * Gate E — Regression and persistence.
 * @regression @critical
 */
const { test, expect } = require('@playwright/test');
const { runManifest }  = require('../fixtures/run-manifest');
const { injectMockAndGetFrame } = require('../helpers/gas-mock-injector');
const { waitForLoginCards, waitForAppShell, waitForDataLoaded } = require('../helpers/shell-waits');
const { assertProfileCard, assertSharedSurface } = require('../helpers/role-assertions');
const { setupPageGuards, finalizePageGuards } = require('../helpers/test-hooks');

test.describe('E regression', () => {
  let bucket;

  test.beforeEach(async ({ page }) => {
    bucket = await setupPageGuards(page);
    await page.goto(runManifest.baseURL, { waitUntil: 'domcontentloaded', timeout: runManifest.timeouts.navigation });
  });

  test.afterEach(async ({ page }, testInfo) => {
    await finalizePageGuards(page, bucket, testInfo);
  });

  test('@regression @critical E01 accessibility: aria-live, announcer, toast, table', async ({ page }) => {
    const frame = await injectMockAndGetFrame(page, 'Admin');
    await waitForLoginCards(frame);
    await frame.locator('.user-card').filter({ hasText: 'Admin' }).first().click();
    await waitForAppShell(frame);
    await waitForDataLoaded(frame);

    await expect(frame.locator('#ariaAnnouncer')).toHaveAttribute('aria-live', 'polite');
    await expect(frame.locator('#toastContainer')).toHaveAttribute('role', 'status');
    await expect(frame.locator('#toastContainer')).toHaveAttribute('aria-live', 'polite');
    await expect(frame.locator('#recordCountLabel')).toHaveAttribute('aria-live', 'polite');
    await expect(frame.locator('table')).toHaveAttribute('aria-label', 'Records table');
  });

  for (const [role, cfg] of Object.entries(runManifest.roles)) {
    test(`@regression E02-${role} ${role} surface loads stable stats and feeds`, async ({ page }) => {
      test.setTimeout(runManifest.timeouts.shellCold + 60000);
      const frame = await injectMockAndGetFrame(page, role);
      await waitForLoginCards(frame);
      await frame.locator('.user-card').filter({ hasText: cfg.cardText }).first().click();
      await waitForAppShell(frame);
      await waitForDataLoaded(frame);
      await assertProfileCard(frame, cfg.displayName);
      await assertSharedSurface(frame);
    });
  }
});
