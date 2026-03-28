const { expect } = require('@playwright/test');

/** Admin/Manager/Officer see #addBtn; Viewer does not. */
async function assertCanCreate(frame) {
  await expect(frame.locator('#addBtn')).toBeVisible({ timeout: 10000 });
}
async function assertCannotCreate(frame) {
  await expect(frame.locator('#addBtn')).toBeHidden({ timeout: 10000 });
}

/** All roles see the profile card and permission chips. */
async function assertProfileCard(frame, expectedName) {
  await expect(frame.locator('#currentUserName')).toContainText(expectedName, { timeout: 10000 });
  await expect(frame.locator('#permissionChips')).toBeVisible();
}

/** All roles see stats, activity, notifications. */
async function assertSharedSurface(frame) {
  await expect(frame.locator('#statsGrid')).toBeVisible();
  await expect(frame.locator('#activityFeed')).toBeVisible();
  await expect(frame.locator('#notificationFeed')).toBeVisible();
}

/** Reset button only visible to Admin.
 *  Portal CSS overrides [hidden] attr with display:flex on .btn, so we must
 *  check the DOM .hidden property directly, not CSS visibility. */
async function assertAdminOnlyControls(frame, isAdmin) {
  // Wait for applyPermissionVisibility to run (already done via waitForDataLoaded).
  const isHidden = await frame.evaluate(() => {
    const el = document.getElementById('resetBtn');
    return !el || el.hidden;
  });
  if (isAdmin) {
    expect(isHidden).toBe(false);
  } else {
    expect(isHidden).toBe(true);
  }
}

module.exports = { assertCanCreate, assertCannotCreate, assertProfileCard, assertSharedSurface, assertAdminOnlyControls };
