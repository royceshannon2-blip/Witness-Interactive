import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Cross-Mission Integration Testing
 * Tests Rwanda and Pearl Harbor missions together
 */
export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report-cross-mission' }]
  ],
  
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/cross-mission-integration.spec.js',
    },
  ],

  webServer: {
    command: 'npx serve . -l 8080',
    port: 8080,
    reuseExistingServer: true,
    timeout: 30000,
  },
});
