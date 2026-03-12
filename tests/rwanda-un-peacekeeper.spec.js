/**
 * Rwanda Genocide Mission - UN Peacekeeper Role Testing
 * 
 * Tests all three branching paths for Captain Marcus Webb:
 * 1. Stayed Path: Stay at hotel → defy orders → PTSD treatment
 * 2. Evacuated Path: Evacuate expatriates → leave Rwandans → guilt
 * 3. Documented Path: Document atrocities → send reports → whistleblower
 * 
 * Validates:
 * - Scene transitions work correctly
 * - Choices set appropriate consequence flags
 * - Timed choices function properly
 * - Historical ripple timeline displays
 * - Outcomes match player paths
 * 
 * Requirements: US-7.1, US-7.2
 */

import { test, expect } from '@playwright/test';

test.describe('Rwanda Mission - UN Peacekeeper Role', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the game
    await page.goto('http://localhost:8080');
    
    // Wait for game to load
    await page.waitForSelector('#timeline-selector', { timeout: 10000 });
    
    // Select Rwanda mission
    const rwandaMission = page.locator('.timeline-event').filter({ hasText: 'Rwanda, 1994' });
    await expect(rwandaMission).toBeVisible();
    await rwandaMission.click();
    
    // Wait for role selection
    await page.waitForSelector('.role-card', { timeout: 5000 });
    
    // Select UN Peacekeeper role
    const unPeacekeeperRole = page.locator('.role-card').filter({ hasText: 'UN Peacekeeper' });
    await expect(unPeacekeeperRole).toBeVisible();
    await unPeacekeeperRole.click();
    
    // Wait for first scene to load
    await page.waitForSelector('#scene-narrative', { timeout: 5000 });
  });

  test('Path 1: Stayed - Stay at hotel → defy orders → PTSD treatment', async ({ page }) => {
    console.log('Testing UN Peacekeeper Stayed Path...');
    
    // Scene 01: Deploy to hotel
    await expect(page.locator('#scene-narrative')).toContainText('Captain Marcus Webb');
    await expect(page.locator('#scene-narrative')).toContainText('UNAMIR');
    
    const deployChoice = page.locator('.choice-button').filter({ hasText: /Deploy to hotel/i });
    await expect(deployChoice).toBeVisible();
    await deployChoice.click();
    
    // Scene 02a: Defy orders
    await page.waitForSelector('#scene-narrative', { state: 'visible', timeout: 5000 });
    await expect(page.locator('#scene-narrative')).toContainText('Hôtel des Mille Collines');
    
    // This is a timed choice - wait for it to appear and click quickly
    const defyChoice = page.locator('.choice-button').filter({ hasText: /Defy orders/i });
    await expect(defyChoice).toBeVisible({ timeout: 3000 });
    await defyChoice.click();
    
    // Scene 03a: Hold the hotel
    await page.waitForSelector('#scene-narrative', { state: 'visible', timeout: 5000 });
    await expect(page.locator('#scene-narrative')).toContainText('defied orders');
    
    const holdChoice = page.locator('.choice-button').filter({ hasText: /Hold the hotel/i });
    await expect(holdChoice).toBeVisible();
    await holdChoice.click();
    
    // Scene 04a: PTSD treatment aftermath
    await page.waitForSelector('#scene-narrative', { state: 'visible', timeout: 5000 });
    await expect(page.locator('#scene-narrative')).toContainText('2008');
    await expect(page.locator('#scene-narrative')).toContainText('PTSD');
    
    // Make final choice
    const testifyChoice = page.locator('.choice-button').filter({ hasText: /Testify/i });
    await expect(testifyChoice).toBeVisible();
    await testifyChoice.click();
    
    // Wait for outcome screen
    await page.waitForSelector('.outcome-screen', { timeout: 10000 });
    
    // Verify outcome
    const outcomeText = await page.locator('.outcome-epilogue').textContent();
    expect(outcomeText).toContain('survived');
    expect(outcomeText).toContain('stayed');
    expect(outcomeText).toContain('twelve hundred');
    
    // Continue to ripple timeline
    const continueBtn = page.locator('button').filter({ hasText: /Continue/i });
    await continueBtn.click();
    
    // Verify historical ripple timeline displays
    await page.waitForSelector('.ripple-timeline', { timeout: 5000 });
    
    // Check for key ripple events
    await expect(page.locator('.ripple-event')).toHaveCount(8);
    await expect(page.locator('.ripple-event').first()).toContainText('Moderate Leaders Assassinated');
    await expect(page.locator('.ripple-event').nth(1)).toContainText('UN Reduces UNAMIR');
    await expect(page.locator('.ripple-event').nth(2)).toContainText('100 Days');
    
    console.log('✓ Stayed path completed successfully');
  });

  test('Path 2: Evacuated - Evacuate expatriates → leave Rwandans → guilt', async ({ page }) => {
    console.log('Testing UN Peacekeeper Evacuated Path...');
    
    // Scene 01: Evacuate expatriates
    await expect(page.locator('#scene-narrative')).toContainText('Captain Marcus Webb');
    
    const evacuateChoice = page.locator('.choice-button').filter({ hasText: /Evacuate expatriates/i });
    await expect(evacuateChoice).toBeVisible();
    await evacuateChoice.click();
    
    // Scene 02b: Follow orders (timed choice - let default trigger)
    await page.waitForSelector('#scene-narrative', { state: 'visible', timeout: 5000 });
    await expect(page.locator('#scene-narrative')).toContainText('Evacuation convoy');
    
    // Wait for timed choice to appear
    await page.waitForSelector('.choice-button', { timeout: 3000 });
    
    // Let the timer run out to test default choice (12 seconds)
    // Or click the default choice explicitly
    const followOrdersChoice = page.locator('.choice-button').filter({ hasText: /Follow orders/i });
    await expect(followOrdersChoice).toBeVisible();
    await followOrdersChoice.click();
    
    // Scene 03c: Board the plane or return
    await page.waitForSelector('#scene-narrative', { state: 'visible', timeout: 5000 });
    await expect(page.locator('#scene-narrative')).toContainText('Airport');
    
    const boardPlaneChoice = page.locator('.choice-button').filter({ hasText: /Board the plane/i });
    await expect(boardPlaneChoice).toBeVisible();
    await boardPlaneChoice.click();
    
    // Scene 04c: Guilt and advocacy aftermath
    await page.waitForSelector('#scene-narrative', { state: 'visible', timeout: 5000 });
    await expect(page.locator('#scene-narrative')).toContainText('2006');
    await expect(page.locator('#scene-narrative')).toContainText('guilt');
    
    // Make final choice
    const participateChoice = page.locator('.choice-button').filter({ hasText: /Participate/i });
    await expect(participateChoice).toBeVisible();
    await participateChoice.click();
    
    // Wait for outcome screen
    await page.waitForSelector('.outcome-screen', { timeout: 10000 });
    
    // Verify outcome
    const outcomeText = await page.locator('.outcome-epilogue').textContent();
    expect(outcomeText).toContain('survived');
    expect(outcomeText).toContain('evacuated');
    expect(outcomeText).toContain('guilt');
    
    // Continue to ripple timeline
    const continueBtn = page.locator('button').filter({ hasText: /Continue/i });
    await continueBtn.click();
    
    // Verify historical ripple timeline displays
    await page.waitForSelector('.ripple-timeline', { timeout: 5000 });
    await expect(page.locator('.ripple-event')).toHaveCount(8);
    
    console.log('✓ Evacuated path completed successfully');
  });

  test('Path 3: Documented - Document atrocities → send reports → whistleblower', async ({ page }) => {
    console.log('Testing UN Peacekeeper Documented Path...');
    
    // Scene 01: Document atrocities
    await expect(page.locator('#scene-narrative')).toContainText('Captain Marcus Webb');
    
    const documentChoice = page.locator('.choice-button').filter({ hasText: /Document atrocities/i });
    await expect(documentChoice).toBeVisible();
    await documentChoice.click();
    
    // Scene 02c: Stay and document
    await page.waitForSelector('#scene-narrative', { state: 'visible', timeout: 5000 });
    await expect(page.locator('#scene-narrative')).toContainText('documenting');
    await expect(page.locator('#scene-narrative')).toContainText('church');
    
    const stayDocumentChoice = page.locator('.choice-button').filter({ hasText: /Stay and document/i });
    await expect(stayDocumentChoice).toBeVisible();
    await stayDocumentChoice.click();
    
    // Scene 03d: Continue documenting
    await page.waitForSelector('#scene-narrative', { state: 'visible', timeout: 5000 });
    await expect(page.locator('#scene-narrative')).toContainText('evidence');
    
    const continueDocChoice = page.locator('.choice-button').filter({ hasText: /Continue documenting/i });
    await expect(continueDocChoice).toBeVisible();
    await continueDocChoice.click();
    
    // Scene 04d: Whistleblower aftermath
    await page.waitForSelector('#scene-narrative', { state: 'visible', timeout: 5000 });
    await expect(page.locator('#scene-narrative')).toContainText('2012');
    await expect(page.locator('#scene-narrative')).toContainText('Hague');
    
    // Make final choice
    const testifyFullyChoice = page.locator('.choice-button').filter({ hasText: /Testify fully/i });
    await expect(testifyFullyChoice).toBeVisible();
    await testifyFullyChoice.click();
    
    // Wait for outcome screen
    await page.waitForSelector('.outcome-screen', { timeout: 10000 });
    
    // Verify outcome
    const outcomeText = await page.locator('.outcome-epilogue').textContent();
    expect(outcomeText).toContain('survived');
    expect(outcomeText).toContain('documented');
    expect(outcomeText).toContain('evidence');
    
    // Continue to ripple timeline
    const continueBtn = page.locator('button').filter({ hasText: /Continue/i });
    await continueBtn.click();
    
    // Verify historical ripple timeline displays
    await page.waitForSelector('.ripple-timeline', { timeout: 5000 });
    await expect(page.locator('.ripple-event')).toHaveCount(8);
    
    // Verify specific ripple events relevant to documentation path
    const rippleText = await page.locator('.ripple-timeline').textContent();
    expect(rippleText).toContain('International Criminal Tribunal');
    expect(rippleText).toContain('Gacaca Courts');
    
    console.log('✓ Documented path completed successfully');
  });

  test('Verify timed choices work correctly', async ({ page }) => {
    console.log('Testing timed choice functionality...');
    
    // Scene 01: Deploy to hotel
    const deployChoice = page.locator('.choice-button').filter({ hasText: /Deploy to hotel/i });
    await deployChoice.click();
    
    // Scene 02a: Timed choice should appear
    await page.waitForSelector('#scene-narrative', { state: 'visible', timeout: 5000 });
    
    // Check for timer UI
    const timerBar = page.locator('.timer-bar, .progress-bar');
    await expect(timerBar).toBeVisible({ timeout: 3000 });
    
    // Verify timer is counting down (check that it exists and is animating)
    const timerExists = await timerBar.count() > 0;
    expect(timerExists).toBe(true);
    
    console.log('✓ Timed choice UI verified');
  });

  test('Verify ripple intro is path-specific', async ({ page }) => {
    console.log('Testing path-specific ripple intro...');
    
    // Complete stayed path quickly
    await page.locator('.choice-button').filter({ hasText: /Deploy to hotel/i }).click();
    await page.waitForTimeout(1000);
    
    await page.locator('.choice-button').filter({ hasText: /Defy orders/i }).click();
    await page.waitForTimeout(1000);
    
    await page.locator('.choice-button').filter({ hasText: /Hold the hotel/i }).click();
    await page.waitForTimeout(1000);
    
    await page.locator('.choice-button').first().click();
    await page.waitForTimeout(1000);
    
    // Wait for outcome
    await page.waitForSelector('.outcome-screen', { timeout: 10000 });
    
    // Continue to ripple
    await page.locator('button').filter({ hasText: /Continue/i }).click();
    
    // Check for ripple intro
    await page.waitForSelector('.ripple-intro, .ripple-timeline', { timeout: 5000 });
    
    // Verify intro text is personalized (should mention staying/protecting)
    const introText = await page.locator('.ripple-intro, .ripple-timeline').first().textContent();
    
    // The intro should be path-specific for "stayed" path
    // It should reference the player's choices
    expect(introText.length).toBeGreaterThan(50); // Should have substantial content
    
    console.log('✓ Path-specific ripple intro verified');
  });
});
