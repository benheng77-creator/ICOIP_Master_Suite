/**
 * Gate D — Business workflows end-to-end.
 * @workflow @critical
 */
const { test, expect } = require('@playwright/test');
const { runManifest }  = require('../fixtures/run-manifest');
const { injectMockAndGetFrame } = require('../helpers/gas-mock-injector');
const { waitForLoginCards, waitForAppShell, waitForDataLoaded } = require('../helpers/shell-waits');
const { setupPageGuards, finalizePageGuards } = require('../helpers/test-hooks');

async function loginAs(page, role) {
  const frame = await injectMockAndGetFrame(page, role);
  await waitForLoginCards(frame);
  await frame.locator('.user-card').filter({ hasText: role }).first().click();
  await waitForAppShell(frame);
  await waitForDataLoaded(frame);
  return frame;
}

async function fillAndSaveRecord(frame) {
  // Fill all visible text/email/date inputs
  const inputs = frame.locator('#formGrid input[type="text"], #formGrid input[type="email"], #formGrid input[type="date"]');
  const count = await inputs.count();
  for (let i = 0; i < count; i++) {
    const inp = inputs.nth(i);
    if (!await inp.inputValue().catch(() => '')) {
      const type = await inp.getAttribute('type');
      await inp.fill(type === 'date' ? '2026-04-01' : `E2E Value ${i + 1}`);
    }
  }
  // Fill selects
  const selects = frame.locator('#formGrid select');
  const selCount = await selects.count();
  for (let i = 0; i < selCount; i++) {
    const sel = selects.nth(i);
    const opts = await sel.locator('option').all();
    for (const opt of opts) {
      const v = await opt.getAttribute('value');
      if (v && v !== '') { await sel.selectOption(v); break; }
    }
  }
  await frame.locator('#saveRecordBtn').click();
}

test.describe('D workflow', () => {
  let bucket;

  test.beforeEach(async ({ page }) => {
    bucket = await setupPageGuards(page);
    await page.goto(runManifest.baseURL, { waitUntil: 'domcontentloaded', timeout: runManifest.timeouts.navigation });
  });

  test.afterEach(async ({ page }, testInfo) => {
    await finalizePageGuards(page, bucket, testInfo);
  });

  test('@workflow @critical D01 Admin creates a record end-to-end', async ({ page }) => {
    const frame = await loginAs(page, 'Admin');

    await frame.locator('#addBtn').click();
    await expect(frame.locator('#recordModal')).toBeVisible({ timeout: 10000 });
    await expect(frame.locator('#recordModal')).toHaveAttribute('role', 'dialog');
    await expect(frame.locator('#recordModal')).toHaveAttribute('aria-modal', 'true');

    await fillAndSaveRecord(frame);

    await expect(frame.locator('#recordModal')).toBeHidden({ timeout: 15000 });
  });

  test('@workflow @critical D02 Admin opens record workspace', async ({ page }) => {
    const frame = await loginAs(page, 'Admin');
    const openBtn = frame.locator('#tableBody tr button', { hasText: /open/i }).first();
    if (await openBtn.isVisible().catch(() => false)) {
      await openBtn.click();
      await expect(frame.locator('#detailModal')).toBeVisible({ timeout: 15000 });
      await expect(frame.locator('#summaryGrid')).toBeVisible();
      await expect(frame.locator('#workflowButtons')).toBeVisible();
      await expect(frame.locator('#attachmentList')).toBeVisible();
      await expect(frame.locator('#recordTimeline')).toBeVisible();
      await frame.locator('#detailModal .icon-btn').first().click();
      await expect(frame.locator('#detailModal')).toBeHidden({ timeout: 10000 });
    }
  });

  test('@workflow D03 Admin triggers reset confirm modal then cancels', async ({ page }) => {
    const frame = await loginAs(page, 'Admin');
    const resetBtn = frame.locator('#resetBtn');
    if (await resetBtn.isVisible().catch(() => false)) {
      await resetBtn.click();
      await expect(frame.locator('#customConfirmModal')).toBeVisible({ timeout: 10000 });
      await expect(frame.locator('#customConfirmModal')).toHaveAttribute('role', 'dialog');
      await frame.locator('#customConfirmModal .btn-ghost').click();
      await expect(frame.locator('#customConfirmModal')).toBeHidden({ timeout: 10000 });
    }
  });

  test('@workflow D04 search and clear table reload', async ({ page }) => {
    const frame = await loginAs(page, 'Admin');
    await frame.locator('#searchInput').fill('E2E');
    await frame.locator('button', { hasText: 'Search' }).first().click();
    await waitForDataLoaded(frame);
    await frame.locator('button', { hasText: 'Clear' }).first().click();
    await waitForDataLoaded(frame);
  });
});
