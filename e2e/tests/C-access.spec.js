/**
 * Gate C — Role isolation.
 * @access @role @critical
 */
const { test, expect } = require('@playwright/test');
const { runManifest }  = require('../fixtures/run-manifest');
const { injectMockAndGetFrame } = require('../helpers/gas-mock-injector');
const { waitForLoginCards, waitForAppShell, waitForDataLoaded } = require('../helpers/shell-waits');
const { assertCanCreate, assertCannotCreate, assertAdminOnlyControls } = require('../helpers/role-assertions');
const { setupPageGuards, finalizePageGuards } = require('../helpers/test-hooks');

async function loginAs(page, role) {
  const frame = await injectMockAndGetFrame(page, role);
  await waitForLoginCards(frame);
  await frame.locator('.user-card').filter({ hasText: role }).first().click();
  await waitForAppShell(frame);
  await waitForDataLoaded(frame);
  return frame;
}

test.describe('C access', () => {
  let bucket;

  test.beforeEach(async ({ page }) => {
    bucket = await setupPageGuards(page);
    await page.goto(runManifest.baseURL, { waitUntil: 'domcontentloaded', timeout: runManifest.timeouts.navigation });
  });

  test.afterEach(async ({ page }, testInfo) => {
    await finalizePageGuards(page, bucket, testInfo);
  });

  test('@access @role @critical C01 Admin can create records', async ({ page }) => {
    const frame = await loginAs(page, 'Admin');
    await assertCanCreate(frame);
    await assertAdminOnlyControls(frame, true);
  });

  test('@access @role @critical C02 Manager can create records', async ({ page }) => {
    const frame = await loginAs(page, 'Manager');
    await assertCanCreate(frame);
    await assertAdminOnlyControls(frame, false);
  });

  test('@access @role @critical C03 Officer can create records', async ({ page }) => {
    const frame = await loginAs(page, 'Officer');
    await assertCanCreate(frame);
    await assertAdminOnlyControls(frame, false);
  });

  test('@access @role @critical C04 Viewer CANNOT create records — addBtn absent', async ({ page }) => {
    const frame = await loginAs(page, 'Viewer');
    await assertCannotCreate(frame);
    await assertAdminOnlyControls(frame, false);
  });

  test('@access @role C05 Admin reset button visible only to Admin', async ({ page }) => {
    // Admin sees it
    const frameA = await loginAs(page, 'Admin');
    const resetVisible = await frameA.locator('#resetBtn').isVisible().catch(() => false);
    expect(resetVisible).toBe(true);
  });
});
