import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Witness Interactive
 * Integration testing for interactive polish features
 */
export default defineConfig({
  testDir: './tests',
  
  // Maximum time one test can run
  timeout: 60000,
  
  // Test execution settings
  fullyParallel: false, // Run tests sequentially for stability
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  
  // Reporter configuration
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }]
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL for tests
    baseURL: 'http://localhost:8000',
    
    // Collect trace on failure
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
    
    // Browser context options
    viewport: { width: 1280, height: 720 },
    
    // Ignore HTTPS errors (for local testing)
    ignoreHTTPSErrors: true,
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      // Skip integration-polish tests on webkit due to timing issues with initial page load
      testIgnore: '**/integration-polish.spec.js',
    },

    // Mobile testing
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },

    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
      // Skip integration-polish tests on Mobile Safari due to timing issues with initial page load
      testIgnore: '**/integration-polish.spec.js',
    },
  ],

  // Web server configuration
  webServer: {
    command: 'npx serve . -l 8000',
    port: 8000,
    reuseExistingServer: true,
    timeout: 30000,
  },
});
