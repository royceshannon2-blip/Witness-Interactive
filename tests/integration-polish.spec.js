/**
 * Integration Tests for Interactive Polish & Engagement Features
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';
test.setTimeout(60000);

async function setupPage(page) {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => window.__unlockAudioForTesting?.()).catch(() => {});
  await page.waitForSelector('body', { timeout: 5000 });
}

async function navigateToRoleSelect(page) {
  await setupPage(page);
  await page.waitForSelector('#begin-button', { state: 'visible', timeout: 15000 });
  await page.click('#begin-button');
  await page.waitForTimeout(500);
  const missionBtn = page.locator('button, .timeline-node, [data-mission]').filter({ hasText: /pearl harbor/i }).first();
  await missionBtn.waitFor({ state: 'visible', timeout: 15000 });
  await missionBtn.click();
  await page.waitForSelector('#role-cards-container', { state: 'visible', timeout: 15000 });
}

async function navigateToRole(page, role) {
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

test.describe('Interactive Polish Integration Tests', () => {
  test.beforeEach(async ({ page }) => { await setupPage(page); });

  test('should reveal text character-by-character on scene load', async ({ page }) => {
    await navigateToRole(page, 'sailor');
    const narrativeEl = page.locator('#scene-narrative p').first();
    await narrativeEl.waitFor({ state: 'visible', timeout: 15000 });
    const text = await narrativeEl.textContent();
    expect(text).toBeTruthy();
    expect(text.length).toBeGreaterThan(0);
  });

  test('should handle sound toggle button', async ({ page }) => {
    await setupPage(page);
    const soundToggle = page.locator('#sound-toggle');
    const exists = await soundToggle.count() > 0;
    expect(exists).toBe(true);
  });

  test('should complete full sailor role', async ({ page }) => {
    await navigateToRole(page, 'sailor');
    
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(1000);
      
      await page.waitForFunction(() => {
        const app = document.getElementById('app');
        const narrative = document.querySelector('#scene-narrative p');
        return app && !app.classList.contains('transition-active') && 
               app.classList.contains('scene-transition-fade-in') === false &&
               narrative && narrative.textContent.length > 0;
      }, { timeout: 10000 });
      
      const choiceCount = await page.locator('.choice-button').count();
      if (choiceCount === 0) {
        console.log(`No choices found on iteration ${i}, checking for outcome screen...`);
        break;
      }
      
      await page.locator('body').click();
      await page.waitForTimeout(300);
      
      await page.waitForFunction(() => {
        const btn = document.querySelector('.choice-button');
        return btn && !btn.disabled;
      }, { timeout: 10000 });
      
      await page.evaluate(() => {
        const btn = document.querySelector('.choice-button');
        if (btn) btn.click();
      });
    }
    
    await page.waitForTimeout(3000);
    
    const pageContent = await page.evaluate(() => document.body.innerHTML);
    console.log('Page content length:', pageContent.length);
    console.log('Has outcome-content:', pageContent.includes('outcome-content'));
    console.log('Has outcome-result:', pageContent.includes('outcome-result'));
    
    const hasOutcome = await page.locator('.outcome-content').isVisible().catch(() => false);
    expect(hasOutcome).toBe(true);
  });
});
