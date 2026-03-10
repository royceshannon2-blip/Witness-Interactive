/**
 * Shared Test Utilities
 * Common navigation and setup functions for all test suites
 */

export const BASE_URL = 'http://localhost:8000';

/**
 * Setup page with proper waits for initial load
 */
export async function setupPage(page) {
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => window.__unlockAudioForTesting?.()).catch(() => {});
  
  // Wait for body and ensure page is fully rendered
  await page.waitForSelector('body', { timeout: 10000 });
  await page.waitForLoadState('domcontentloaded');
  
  // Extra wait for rendering
  await page.waitForTimeout(1000);
  
  // Ensure main app container is ready
  await page.waitForSelector('#app', { state: 'attached', timeout: 10000 });
}

/**
 * Navigate from landing screen to mission timeline
 */
export async function navigateToTimeline(page) {
  await setupPage(page);
  
  // Wait for begin button with proper visibility checks
  await page.waitForFunction(() => {
    const btn = document.getElementById('begin-button');
    if (!btn) return false;
    const style = getComputedStyle(btn);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0';
  }, { timeout: 25000 });
  
  await page.waitForTimeout(300);
  await page.click('#begin-button');
  
  // Wait for transition
  await page.waitForTimeout(1000);
  
  // Wait for mission timeline to appear
  const missionBtn = page.locator('button, .timeline-node, [data-mission]').filter({ hasText: /pearl harbor/i }).first();
  await missionBtn.waitFor({ state: 'visible', timeout: 20000 });
}

/**
 * Navigate to role selection screen
 */
export async function navigateToRoleSelect(page) {
  await navigateToTimeline(page);
  
  // Click Pearl Harbor mission
  const missionBtn = page.locator('button, .timeline-node, [data-mission]').filter({ hasText: /pearl harbor/i }).first();
  await page.waitForTimeout(300);
  await missionBtn.click();
  
  // Wait for role selection screen
  await page.waitForSelector('#role-cards-container', { state: 'visible', timeout: 20000 });
}

/**
 * Navigate to a specific role's first scene
 */
export async function navigateToRole(page, role) {
  await navigateToRoleSelect(page);
  
  const selectors = {
    sailor: '.role-select-button[data-role-id="american-sailor"]',
    aviator: '.role-select-button[data-role-id="japanese-aviator"]',
    civilian: '.role-select-button[data-role-id="american-civilian"]'
  };
  
  await page.waitForSelector(selectors[role], { state: 'visible', timeout: 10000 });
  await page.click(selectors[role]);
  await page.waitForSelector('#scene-narrative p', { state: 'visible', timeout: 15000 });
}

/**
 * Wait for scene transition to complete
 */
export async function waitForTransition(page) {
  await page.waitForFunction(() => {
    const app = document.getElementById('app');
    return app && !app.classList.contains('transition-active');
  }, { timeout: 5000 }).catch(() => {});
}

/**
 * Wait for choice buttons to be clickable
 */
export async function waitForChoicesReady(page) {
  await waitForTransition(page);
  
  await page.waitForFunction(() => {
    const btn = document.querySelector('.choice-button');
    if (!btn || btn.disabled) return false;
    const style = getComputedStyle(btn);
    const app = document.getElementById('app');
    return style.opacity !== '0' && 
           style.visibility !== 'hidden' && 
           (!app || !app.classList.contains('transition-active'));
  }, { timeout: 15000 });
  
  await page.waitForTimeout(200);
}

/**
 * Skip typewriter effect by clicking body
 */
export async function skipTypewriter(page) {
  await page.locator('body').click();
  await page.waitForTimeout(500);
}

/**
 * Make a choice and wait for transition
 */
export async function makeChoice(page, index = 0) {
  await waitForChoicesReady(page);
  await page.locator('.choice-button').nth(index).click({ timeout: 5000 });
  await page.waitForTimeout(800);
}
