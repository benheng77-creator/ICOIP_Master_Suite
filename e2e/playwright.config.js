const { runManifest } = require('./fixtures/run-manifest');

module.exports = {
  testDir: './tests',
  timeout:        runManifest.timeouts.test,
  expect:         { timeout: runManifest.timeouts.expect },
  fullyParallel:  false,
  retries:        runManifest.retries,
  workers:        1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'reports' }]],
  use: {
    headless:          runManifest.headless,
    trace:             'retain-on-failure',
    screenshot:        'only-on-failure',
    video:             'retain-on-failure',
    actionTimeout:     runManifest.timeouts.action,
    navigationTimeout: runManifest.timeouts.navigation,
  },
  projects: [
    { name: 'smoke',      testMatch: /A-platform/,  use: { ...require('@playwright/test').devices['Desktop Chrome'] } },
    { name: 'auth',       testMatch: /B-auth/,       use: { ...require('@playwright/test').devices['Desktop Chrome'] } },
    { name: 'access',     testMatch: /C-access/,     use: { ...require('@playwright/test').devices['Desktop Chrome'] } },
    { name: 'workflow',   testMatch: /D-workflow/,   use: { ...require('@playwright/test').devices['Desktop Chrome'] } },
    { name: 'regression', testMatch: /E-regression/, use: { ...require('@playwright/test').devices['Desktop Chrome'] } },
  ],
  outputDir: './test-results',
};
