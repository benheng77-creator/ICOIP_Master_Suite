/**
 * ICOIP Portal — Enterprise E2E Suite
 * ─────────────────────────────────────────────────────────────────────────────
 * Tests all 6 portals × 4 roles.  Uses a google.script.run mock injected into
 * the GAS iframe so the full UI renders in headless Playwright without a live
 * GAS server connection.
 *
 * Every test fills in real form data and exercises every interactive surface.
 */
import { test, expect, Page, Frame } from "@playwright/test";
import { buildGasMockScript, DEMO_USERS, PERMISSIONS, getMockRecords } from "./gas-mock";

// ── Portal manifest ───────────────────────────────────────────────────────────
const PORTALS = [
  { id: "00", name: "Master Suite Demo",       url: "https://script.google.com/macros/s/AKfycbwvqQ8UlVOoXN4UVvCnRmNnVKL99Jp9t6DsBZCrDMFqErNwdP_VmcLm0ahU6dx2-hI/exec" },
  { id: "01", name: "Volunteer Management",    url: "https://script.google.com/macros/s/AKfycbyBtrFEkLnnlGPYRNb_GyB4puln6m_Gl7aldzscrH3OPrSbhmD6CFlBmlMTO73bEx93/exec" },
  { id: "02", name: "Intake & Referral",       url: "https://script.google.com/macros/s/AKfycbwOknQ1OUzbGzPITaKDfd4KPgHAyDYZa1D6RUzbt4mQwbqhKcO5sX64v0QX2Sno4oH8/exec" },
  { id: "03", name: "Counselling Client",      url: "https://script.google.com/macros/s/AKfycbx9g3ptENk5V4x4v7ObNEiSJHvKy1HUOs1qwWELCJwyu7A9WhU4crQ6Zhoigcj1yfWn/exec" },
  { id: "04", name: "Admin Portal",            url: "https://script.google.com/macros/s/AKfycbwK2t_AMjkd4k6jRptx7O9dF0Dh8HoVj6HVnlmme0C7QmO7zpP-oy891cUyTaxy4l40/exec" },
  { id: "05", name: "AI Training Curriculum",  url: "https://script.google.com/macros/s/AKfycbzLCyX4TYykUkLYc3wRnDHobuqGaExEEJEZvcoQXrMmNb4e3u877hMMaJV81I6uE8Ke/exec" },
];

const ROLES = ["Admin", "Manager", "Officer", "Viewer"];

// ── Smart form-filler data ────────────────────────────────────────────────────
const FORM_FILL: Record<string, Record<string, string>> = {
  "01": { fullName: "E2E Test Volunteer", email: "e2e-vol@test.icoip", phone: "98765432", role: "Volunteer", status: "Active" },
  "02": { name: "E2E Beneficiary",        dob: "1990-06-15",           referralSource: "E2E Test",           status: "New" },
  "03": { clientName: "E2E Client",       sessionDate: "2026-04-01",   sessionType: "Individual",            status: "Scheduled" },
  "04": { title: "E2E Policy Doc",        category: "Policy",          status: "Draft" },
  "05": { courseName: "E2E AI Course",    category: "AI Fundamentals", duration: "6",                        status: "Active" },
  "00": { name: "E2E Master Record",      status: "Active" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Navigate to the portal, inject the GAS mock into the app frame, then return
 * that frame for all subsequent interactions.
 */
async function loadPortalWithMock(
  page: Page,
  url: string,
  portalId: string,
  role: string
): Promise<Frame> {
  const mockScript = buildGasMockScript(portalId, role);

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

  // Find the frame containing #loginModal
  let frame: Frame | undefined;
  const deadline = Date.now() + 75000;
  while (Date.now() < deadline) {
    for (const f of page.frames()) {
      try {
        const cnt = await f.locator("#loginModal").count();
        if (cnt > 0) { frame = f; break; }
      } catch { /* detached */ }
    }
    if (frame) break;
    await page.waitForTimeout(600);
  }
  if (!frame) throw new Error(`Frame with #loginModal not found for portal ${portalId}`);

  // Inject mock directly via evaluate — reset guard so it always installs fresh
  const mockError = await frame.evaluate((script: string) => {
    try {
      (window as any).__gasMockInstalled = false;
      // eslint-disable-next-line no-new-func
      (new Function(script))();
      return null;
    } catch (e: any) {
      return e.message || String(e);
    }
  }, mockScript);
  if (mockError) throw new Error(`Mock injection failed for portal ${portalId}: ${mockError}`);

  // Verify mock is in place
  const mockInstalled = await frame.evaluate(() => !!(window as any).__gasMockInstalled);
  if (!mockInstalled) throw new Error(`Mock not installed after injection for portal ${portalId}`);

  return frame;
}

/** Wait for user cards to appear (mock fires them in 50ms) */
async function waitForLoginCards(frame: Frame) {
  await expect(frame.locator(".user-card").first()).toBeVisible({ timeout: 15000 });
}

/** Click a role card and wait for app shell */
async function loginAs(frame: Frame, role: string) {
  await waitForLoginCards(frame);
  const card = frame.locator(".user-card").filter({ hasText: role }).first();
  await expect(card).toBeVisible({ timeout: 10000 });
  await card.click();
  await expect(frame.locator("#appShell")).toBeVisible({ timeout: 30000 });
  await expect(frame.locator("#loginModal")).toBeHidden({ timeout: 10000 });
}

/** Wait for table data to render — requires mock to have fired (not just real GAS failure) */
async function waitForTable(frame: Frame) {
  await expect(frame.locator("#tableSkeleton")).toBeHidden({ timeout: 20000 });
  await expect(frame.locator("#tableCard")).toBeVisible({ timeout: 20000 });
  // Wait for the mock's data-mock-fired signal (proves mock responded, not real GAS failure)
  await frame.waitForFunction(
    () => document.body.getAttribute('data-mock-fired') === '1',
    { timeout: 15000 }
  );
}

/**
 * Smart form filler — fills every visible field in a form-grid with
 * realistic data, selects first option for any select without a preset value.
 */
async function fillForm(frame: Frame, portalId: string) {
  const data = FORM_FILL[portalId] || FORM_FILL["01"];

  // Fill text/email/date inputs
  for (const [key, value] of Object.entries(data)) {
    const input = frame.locator(`#formGrid input[id="${key}"], #formGrid input[name="${key}"]`).first();
    if (await input.isVisible().catch(() => false)) {
      await input.clear();
      await input.fill(value);
    }
  }

  // Fill any remaining visible text/email/date inputs by placeholder/label order
  const allInputs = frame.locator("#formGrid input[type='text'], #formGrid input[type='email'], #formGrid input[type='date']");
  const inputCount = await allInputs.count();
  for (let i = 0; i < inputCount; i++) {
    const inp = allInputs.nth(i);
    const val = await inp.inputValue().catch(() => "");
    if (!val) {
      const type = await inp.getAttribute("type");
      await inp.fill(type === "date" ? "2026-04-01" : `E2E Value ${i + 1}`);
    }
  }

  // Handle all selects — pick preset value or first non-empty option
  const selects = frame.locator("#formGrid select");
  const selectCount = await selects.count();
  for (let i = 0; i < selectCount; i++) {
    const sel = selects.nth(i);
    const selId = await sel.getAttribute("id") || "";
    if (data[selId]) {
      await sel.selectOption({ label: data[selId] }).catch(() =>
        sel.selectOption({ value: data[selId] }).catch(() => {})
      );
    } else {
      const opts = await sel.locator("option").all();
      for (const opt of opts) {
        const v = await opt.getAttribute("value");
        if (v && v !== "") { await sel.selectOption(v); break; }
      }
    }
  }
}

/** Switch back to login screen */
async function switchUser(frame: Frame) {
  await frame.locator("button", { hasText: /switch/i }).first().click();
  await expect(frame.locator("#loginModal")).toBeVisible({ timeout: 10000 });
}

// ── Test Suite ────────────────────────────────────────────────────────────────

for (const portal of PORTALS) {
  test.describe(`[${portal.id}] ${portal.name}`, () => {

    // ── Login modal: all 4 cards + ARIA ──────────────────────────────────────
    test("login modal — 4 role cards + aria attributes", async ({ page }) => {
      const frame = await loadPortalWithMock(page, portal.url, portal.id, "Admin");
      await waitForLoginCards(frame);

      for (const role of ROLES) {
        await expect(
          frame.locator(".user-card").filter({ hasText: role }).first()
        ).toBeVisible();
      }
      await expect(frame.locator("#loginModal")).toHaveAttribute("role", "dialog");
      await expect(frame.locator("#loginModal")).toHaveAttribute("aria-modal", "true");
      await expect(frame.locator(".login-instruction")).toBeVisible();
    });

    // ── Full functional flow for each role ────────────────────────────────────
    for (const role of ROLES) {
      test(`[${role}] full functional flow`, async ({ page }) => {
        const frame = await loadPortalWithMock(page, portal.url, portal.id, role);
        await loginAs(frame, role);

        const user = DEMO_USERS.find(u => u.role === role)!;
        const perms = PERMISSIONS[role];

        // ── Wait for data load (skeleton hides = GAS mock fired) ─────────────
        await waitForTable(frame);

        // ── Profile card ────────────────────────────────────────────────────
        await expect(frame.locator("#currentUserName")).toContainText(user.fullName, { timeout: 10000 });
        await expect(frame.locator("#permissionChips")).toBeVisible();

        // ── Stats ────────────────────────────────────────────────────────────
        await expect(frame.locator("#statsGrid")).toBeVisible();
        const recordCount = frame.locator("#recordCountLabel");
        await expect(recordCount).toBeVisible();

        // ── Search ───────────────────────────────────────────────────────────
        await frame.locator("#searchInput").fill("E2E");
        await frame.locator("button", { hasText: "Search" }).first().click();
        await waitForTable(frame);
        await frame.locator("button", { hasText: "Clear" }).first().click();
        await waitForTable(frame);

        // ── Add Record (roles with create permission) ─────────────────────────
        const canCreate = perms.includes("create");
        const addBtn = frame.locator("#addBtn");
        const addBtnVisible = await addBtn.isVisible().catch(() => false);

        if (canCreate && addBtnVisible) {
          await addBtn.click();
          await expect(frame.locator("#recordModal")).toBeVisible({ timeout: 10000 });
          await expect(frame.locator("#recordModal")).toHaveAttribute("role", "dialog");
          await expect(frame.locator("#recordModal")).toHaveAttribute("aria-modal", "true");

          // Fill every form field
          await fillForm(frame, portal.id);

          // Submit the form
          const saveBtn = frame.locator("#saveRecordBtn");
          await expect(saveBtn).toBeVisible();
          await saveBtn.click();

          // Modal closes on success
          await expect(frame.locator("#recordModal")).toBeHidden({ timeout: 15000 });
        }

        // ── Open first record workspace ───────────────────────────────────────
        const openBtn = frame.locator("#tableBody tr button", { hasText: /open/i }).first();
        if (await openBtn.isVisible().catch(() => false)) {
          await openBtn.click();
          await expect(frame.locator("#detailModal")).toBeVisible({ timeout: 15000 });
          await expect(frame.locator("#detailModal")).toHaveAttribute("role", "dialog");
          await expect(frame.locator("#summaryGrid")).toBeVisible();
          await expect(frame.locator("#workflowButtons")).toBeVisible();
          await expect(frame.locator("#attachmentList")).toBeVisible();
          await expect(frame.locator("#recordTimeline")).toBeVisible();

          // ── Workflow action (if permitted) ──────────────────────────────────
          if (perms.includes("workflow")) {
            const wfBtn = frame.locator("#workflowButtons .btn").first();
            if (await wfBtn.isVisible().catch(() => false)) {
              // Add a workflow note first
              const wfNote = frame.locator("#workflowNote");
              if (await wfNote.isVisible().catch(() => false)) {
                await wfNote.fill(`E2E workflow note by ${role} — ${new Date().toISOString()}`);
              }
              await wfBtn.click();
              // May trigger confirm modal or direct state change — handle both
              const confirmVisible = await frame.locator("#customConfirmModal").isVisible().catch(() => false);
              if (confirmVisible) {
                await frame.locator("#customConfirmModal .btn-danger").click();
                await expect(frame.locator("#customConfirmModal")).toBeHidden({ timeout: 10000 });
              }
            }
          }

          // ── Email modal (if permitted) ──────────────────────────────────────
          if (perms.includes("email")) {
            const emailBtn = frame.locator("#detailButtons .btn, #detailButtons button")
              .filter({ hasText: /email|notify/i }).first();
            if (await emailBtn.isVisible().catch(() => false)) {
              await emailBtn.click();
              await expect(frame.locator("#emailModal")).toBeVisible({ timeout: 10000 });
              // Fill all fields
              await frame.locator("#emailTo").fill("test@icoip.demo");
              await frame.locator("#emailCc").fill("cc@icoip.demo");
              await frame.locator("#emailSubject").fill(`E2E Test Email — ${portal.name}`);
              await frame.locator("#emailMessage").fill("This is an automated E2E test email. Portal functional check passed.");
              await frame.locator("#sendEmailBtn").click();
              await expect(frame.locator("#emailModal")).toBeHidden({ timeout: 10000 });
            }
          }

          // ── Attachment upload (if permitted) ────────────────────────────────
          if (perms.includes("upload")) {
            const uploadBtn = frame.locator("button[onclick='openAttachmentModal()']").first();
            const uploadBtnVisible = await uploadBtn.isVisible().catch(() => false);
            if (uploadBtnVisible) {
              await uploadBtn.click();
              const attachModalOpened = await frame.locator("#attachmentModal").isVisible().catch(() => false) ||
                await frame.waitForSelector("#attachmentModal:not(.hidden)", { timeout: 3000 }).then(() => true).catch(() => false);
              if (attachModalOpened) {
                await expect(frame.locator("#attachmentModal")).toHaveAttribute("role", "dialog");
                const catSel = frame.locator("#attachmentCategory");
                const opts = await catSel.locator("option").all();
                for (const opt of opts) {
                  const v = await opt.getAttribute("value");
                  if (v && v !== "") { await catSel.selectOption(v); break; }
                }
                await frame.locator("#attachmentDescription").fill("E2E test attachment — automated upload check");
                await frame.locator("#attachmentModal .icon-btn").click();
                await expect(frame.locator("#attachmentModal")).toBeHidden({ timeout: 10000 });
              }
            }
          }

          // Close detail modal
          await frame.locator("#detailModal .icon-btn").first().click();
          await expect(frame.locator("#detailModal")).toBeHidden({ timeout: 10000 });
        }

        // ── Admin: Reset → custom confirm modal → cancel ──────────────────────
        if (role === "Admin") {
          const resetBtn = frame.locator("#resetBtn");
          if (await resetBtn.isVisible().catch(() => false)) {
            await resetBtn.click();
            await expect(frame.locator("#customConfirmModal")).toBeVisible({ timeout: 10000 });
            await expect(frame.locator("#customConfirmModal")).toHaveAttribute("role", "dialog");
            await expect(frame.locator("#customConfirmModal")).toHaveAttribute("aria-modal", "true");
            // Cancel — do NOT reset data
            await frame.locator("#customConfirmModal .btn-ghost").click();
            await expect(frame.locator("#customConfirmModal")).toBeHidden({ timeout: 10000 });
          }
        }

        // ── Viewer: Add Record NOT visible ────────────────────────────────────
        if (role === "Viewer") {
          const addBtnVis = await frame.locator("#addBtn").isVisible().catch(() => false);
          expect(addBtnVis).toBe(false);
        }

        // ── Activity & Notification feeds ─────────────────────────────────────
        await expect(frame.locator("#activityFeed")).toBeVisible();
        await expect(frame.locator("#notificationFeed")).toBeVisible();

        // ── Switch back ───────────────────────────────────────────────────────
        await switchUser(frame);
        await waitForLoginCards(frame);
      });
    }

    // ── Accessibility contract ────────────────────────────────────────────────
    test("accessibility: aria-live, announcer, toast, table label", async ({ page }) => {
      const frame = await loadPortalWithMock(page, portal.url, portal.id, "Admin");
      await loginAs(frame, "Admin");

      await expect(frame.locator("#ariaAnnouncer")).toHaveAttribute("aria-live", "polite");
      await expect(frame.locator("#toastContainer")).toHaveAttribute("role", "status");
      await expect(frame.locator("#toastContainer")).toHaveAttribute("aria-live", "polite");
      await expect(frame.locator("#recordCountLabel")).toHaveAttribute("aria-live", "polite");
      await expect(frame.locator("table")).toHaveAttribute("aria-label", "Records table");
    });

  });
}
