/**
 * Gate B — Auth truth.
 * GAS portals: login = click a role card (no password).
 * @auth @critical
 */
const { test, expect } = require('@playwright/test');
const { runManifest }  = require('../fixtures/run-manifest');
const { injectMockAndGetFrame } = require('../helpers/gas-mock-injector');
const { waitForLoginCards, waitForAppShell, waitForDataLoaded } = require('../helpers/shell-waits');
const { assertProfileCard } = require('../helpers/role-assertions');
const { setupPageGuards, finalizePageGuards } = require('../helpers/test-hooks');

const ROLES = Object.values(runManifest.roles);

test.describe('B auth', () => {
  let bucket;

  test.beforeEach(async ({ page }) => {
    bucket = await setupPageGuards(page);
    await page.goto(runManifest.baseURL, { waitUntil: 'domcontentloaded', timeout: runManifest.timeouts.navigation });
  });

  test.afterEach(async ({ page }, testInfo) => {
    await finalizePageGuards(page, bucket, testInfo);
  });

  for (const roleConfig of ROLES) {
    test(`@auth @critical B-${roleConfig.role} card-click login succeeds`, async ({ page }) => {
      const frame = await injectMockAndGetFrame(page, roleConfig.role);
      await waitForLoginCards(frame);

      const card = frame.locator('.user-card').filter({ hasText: roleConfig.cardText }).first();
      await expect(card).toBeVisible({ timeout: runManifest.timeouts.auth });
      await card.click();

      await waitForAppShell(frame);
      await waitForDataLoaded(frame);
      await assertProfileCard(frame, roleConfig.displayName);
    });
  }

  test('@auth @critical B05 switch user returns to login modal', async ({ page }) => {
    const frame = await injectMockAndGetFrame(page, 'Admin');
    await waitForLoginCards(frame);
    await frame.locator('.user-card').filter({ hasText: 'Admin' }).first().click();
    await waitForAppShell(frame);
    await waitForDataLoaded(frame);

    // Switch back
    await frame.locator('button', { hasText: /switch/i }).first().click();
    await expect(frame.locator('#loginModal')).toBeVisible({ timeout: 10000 });
    await expect(frame.locator('.user-card').first()).toBeVisible({ timeout: runManifest.timeouts.auth });
  });
});
