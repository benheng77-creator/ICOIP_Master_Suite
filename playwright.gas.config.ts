import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/gas",
  timeout: 180000,
  expect: { timeout: 20000 },
  fullyParallel: false,
  retries: 1,
  workers: 2,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report-gas" }]],
  use: {
    bypassCSP: true,           // required: GAS iframe CSP blocks Playwright injection
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },
  projects: [
    {
      name: "gas-chrome",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
