import { chromium, FullConfig } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";

export default async function globalSetup(config: FullConfig) {
  const authFile = path.join(__dirname, "../../playwright/.auth/google.json");
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  // Launch using the user's real Chrome profile to inherit Google session
  const userDataDir = "C:\\Users\\jvben\\AppData\\Local\\Google\\Chrome\\User Data";
  const browser = await chromium.launchPersistentContext(userDataDir, {
    channel: "chrome",
    headless: false, // must be false to load existing profile properly
    args: ["--profile-directory=Default", "--no-first-run", "--no-default-browser-check"],
    timeout: 30000,
  });

  const page = browser.pages()[0] || await browser.newPage();

  // Visit one GAS URL to ensure session is active and cookies are loaded
  await page.goto(
    "https://script.google.com/macros/s/AKfycbxlgbYm8pIi8lhsOh_bW86vXUhqYORBfi0wqmyW5fSLuT7pcy-gSYWVC2NWTqQ_2qxw/exec",
    { waitUntil: "domcontentloaded", timeout: 60000 }
  );
  await page.waitForTimeout(3000);

  // Save storage state (cookies + localStorage) for reuse in tests
  await browser.storageState({ path: authFile });
  await browser.close();

  console.log("✓ Google auth captured →", authFile);
}
