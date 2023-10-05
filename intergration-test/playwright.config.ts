import {defineConfig, devices} from '@playwright/test';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 200000,
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  // retries: process.env.CI ? 2 : 0,
  retries: 2,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : undefined,
  // Limit the number of failures on CI to save resources
  maxFailures: process.env.CI ? 20 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'blob' : 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        locale: 'en',
        ...devices['Desktop Chrome'],
        baseURL: process.env.CI ? `${process.env.BASE_URL}` : 'https://tidebit-defi.com/',
      },
    },
    {
      name: 'chromium TW',
      use: {
        locale: 'tw',
        ...devices['Desktop Chrome'],
        baseURL: process.env.CI ? `${process.env.BASE_URL}/tw/` : 'https://tidebit-defi.com/tw/',
      },
    },
    {
      name: 'chromium CN',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.CI ? `${process.env.BASE_URL}/cn/` : 'https://tidebit-defi.com/cn/',
        locale: 'cn',
      },
    },
    // firefox is not supported yet
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // webkit is not supported yet
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
