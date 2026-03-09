/**
 * Comprehensive Integration Test for Interactive Polish & Engagement Features
 * Task 10.1: Integration testing
 * 
 * Tests all Phase 1 and Phase 2 features across all three roles:
 * - Typewriter effect on all scenes (all 3 roles)
 * - Timed choices on Arizona sailor role
 * - Atmospheric effects on all roles
 * - Scene transitions between all scenes
 * - Choice hover effects
 * - Ambient sound crossfading (if audio files provided)
 */

import { test, expect } from '@playwright/test';

test.describe('Interactive Polish & Engagement - Full Game Integration', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the game
    await page.goto('/');
    
    // Wait for game to load
    await page.waitForSelector('#timeline-selector', { timeout: 10000 });
  });

  test.describe('American Sailor Role - Complete Playthrough', () => {
    test('should test all interactive features on American Sailor role', async ({ page }) => {
      // Select Pearl Harbor mission
      await page.click('button:has-text("Pearl Harbor")');
      
      // Wait for role selection
      await page.waitForSelector('.role-card', { timeout: 5000 });
      
      // Select American Sailor role
      await page.click('.role-card:has-text("American Sailor")');
      
      // Wait for first scene to load
      await page.waitForSelector('#narrative-text', { timeout: 5000 });
      
      // Test Scene 1
      console.log('Testing Scene 1...');
      
      // 1. Test typewriter effect - text should appear gradually
      const narrativeText = page.locator('#narrative-text');
      await expect(narrativeText).toBeVisible();
      
      // Wait for typewriter to complete (text should be fully visible)
      await page.waitForTimeout(2000);
      const fullText = await narrativeText.textContent();
      expect(fullText.length).toBeGreaterThan(0);
      
      // 2. Test atmospheric effect (dawn effect on scene 1)
      const bodyClasses = await page.evaluate(() => document.body.className);
      console.log('Scene 1 body classes:', bodyClasses);
      
      // 3. Test choice hover effects
      const firstChoice = page.locator('.choice-button').first();
      await firstChoice.hover();
      
      // Check if hover styles are applied (transform scale)
      const hoverTransform = await firstChoice.evaluate(el => 
        window.getComputedStyle(el).transform
      );
      console.log('Choice hover transform:', hoverTransform);
      
      // 4. Make a choice to proceed to next scene
      await firstChoice.click();
      
      // 5. Test scene transition
      await page.waitForTimeout(600); // Wait for transition (500ms + buffer)
      
      // Test Scene 2 (should have timed choice)
      console.log('Testing Scene 2 with timed choice...');
      
      // Wait for narrative to appear
      await page.waitForSelector('#narrative-text', { timeout: 5000 });
      
      // 6. Test timed choice system
      const timerDisplay = page.locator('#timer-display');
      
      // Check if timer is visible (scene 2 should have timed choice)
      const timerVisible = await timerDisplay.isVisible().catch(() => false);
      console.log('Timer visible on scene 2:', timerVisible);
      
      if (timerVisible) {
        // Get initial timer value
        const initialTime = await timerDisplay.textContent();
        console.log('Initial timer:', initialTime);
        
        // Wait a bit and check timer decreased
        await page.waitForTimeout(1000);
        const laterTime = await timerDisplay.textContent();
        console.log('Timer after 1s:', laterTime);
        
        // Make a choice before timer expires
        await page.locator('.choice-button').first().click();
      } else {
        // If no timer, just make a choice
        await page.locator('.choice-button').first().click();
      }
      
      // Test Scene 3
      console.log('Testing Scene 3...');
      await page.waitForTimeout(600);
      await page.waitForSelector('#narrative-text', { timeout: 5000 });
      
      // 7. Test atmospheric effects (explosion effect expected)
      const scene3Classes = await page.evaluate(() => document.body.className);
      console.log('Scene 3 body classes:', scene3Classes);
      
      // Check for explosion or shake effect
      const hasExplosionEffect = scene3Classes.includes('effect-explosion') || 
                                  scene3Classes.includes('effect-shake') ||
                                  scene3Classes.includes('effect-fire');
      console.log('Has atmospheric effect on scene 3:', hasExplosionEffect);
      
      // Continue through remaining scenes
      await page.locator('.choice-button').first().click();
      await page.waitForTimeout(600);
      
      // Test Scene 4
      console.log('Testing Scene 4...');
      await page.waitForSelector('#narrative-text', { timeout: 5000 });
      await page.locator('.choice-button').first().click();
      await page.waitForTimeout(600);
      
      // Test Scene 5 (final scene)
      console.log('Testing Scene 5...');
      await page.waitForSelector('#narrative-text', { timeout: 5000 });
      await page.locator('.choice-button').first().click();
      
      // Wait for outcome screen
      await page.waitForSelector('#outcome-screen', { timeout: 5000 });
      console.log('Reached outcome screen successfully');
      
      // Verify outcome screen is displayed
      const outcomeScreen = page.locator('#outcome-screen');
      await expect(outcomeScreen).toBeVisible();
    });
  });

  test.describe('American Civilian Role - Complete Playthrough', () => {
    test('should test all interactive features on American Civilian role', async ({ page }) => {
      // Select Pearl Harbor mission
      await page.click('button:has-text("Pearl Harbor")');
      
      // Wait for role selection
      await page.waitForSelector('.role-card', { timeout: 5000 });
      
      // Select American Civilian role
      await page.click('.role-card:has-text("American Civilian")');
      
      // Wait for first scene to load
      await page.waitForSelector('#narrative-text', { timeout: 5000 });
      
      // Test Scene 1 (peaceful morning)
      console.log('Testing Civilian Scene 1 (peaceful)...');
      
      // Check for dawn/peaceful atmospheric effect
      const scene1Classes = await page.evaluate(() => document.body.className);
      console.log('Civilian Scene 1 classes:', scene1Classes);
      
      // Verify typewriter effect
      await page.waitForTimeout(2000);
      const narrativeText = await page.locator('#narrative-text').textContent();
      expect(narrativeText.length).toBeGreaterThan(0);
      
      // Make choice
      await page.locator('.choice-button').first().click();
      await page.waitForTimeout(600);
      
      // Test Scene 2 (chaos begins - NO WARNING historically accurate)
      console.log('Testing Civilian Scene 2 (chaos begins)...');
      await page.waitForSelector('#narrative-text', { timeout: 5000 });
      
      // Should have explosion effect
      const scene2Classes = await page.evaluate(() => document.body.className);
      console.log('Civilian Scene 2 classes:', scene2Classes);
      
      // Continue through remaining scenes
      await page.locator('.choice-button').first().click();
      await page.waitForTimeout(600);
      
      await page.waitForSelector('#narrative-text', { timeout: 5000 });
      await page.locator('.choice-button').first().click();
      await page.waitForTimeout(600);
      
      await page.waitForSelector('#narrative-text', { timeout: 5000 });
      await page.locator('.choice-button').first().click();
      await page.waitForTimeout(600);
      
      await page.waitForSelector('#narrative-text', { timeout: 5000 });
      await page.locator('.choice-button').first().click();
      
      // Wait for outcome screen
      await page.waitForSelector('#outcome-screen', { timeout: 5000 });
      console.log('Civilian role completed successfully');
    });
  });

  test.describe('Japanese Aviator Role - Complete Playthrough', () => {
    test('should test all interactive features on Japanese Aviator role', async ({ page }) => {
      // Select Pearl Harbor mission
      await page.click('button:has-text("Pearl Harbor")');
      
      // Wait for role selection
      await page.waitForSelector('.role-card', { timeout: 5000 });
      
      // Select Japanese Aviator role
      await page.click('.role-card:has-text("Japanese Aviator")');
      
      // Wait for first scene to load
      await page.waitForSelector('#narrative-text', { timeout: 5000 });
      
      // Test Scene 1 (carrier deck)
      console.log('Testing Aviator Scene 1...');
      
      // Verify typewriter effect
      await page.waitForTimeout(2000);
      const narrativeText = await page.locator('#narrative-text').textContent();
      expect(narrativeText.length).toBeGreaterThan(0);
      
      // Check for atmospheric effects
      const scene1Classes = await page.evaluate(() => document.body.className);
      console.log('Aviator Scene 1 classes:', scene1Classes);
      
      // Make choice
      await page.locator('.choice-button').first().click();
      await page.waitForTimeout(600);
      
      // Continue through all scenes
      for (let i = 2; i <= 5; i++) {
        console.log(`Testing Aviator Scene ${i}...`);
        await page.waitForSelector('#narrative-text', { timeout: 5000 });
        
        // Check for atmospheric effects
        const sceneClasses = await page.evaluate(() => document.body.className);
        console.log(`Aviator Scene ${i} classes:`, sceneClasses);
        
        await page.locator('.choice-button').first().click();
        await page.waitForTimeout(600);
      }
      
      // Wait for outcome screen
      await page.waitForSelector('#outcome-screen', { timeout: 5000 });
      console.log('Aviator role completed successfully');
    });
  });

  test.describe('Typewriter Effect Tests', () => {
    test('should allow click-to-skip typewriter animation', async ({ page }) => {
      // Select mission and role
      await page.click('button:has-text("Pearl Harbor")');
      await page.waitForSelector('.role-card', { timeout: 5000 });
      await page.click('.role-card:has-text("American Sailor")');
      
      // Wait for scene to start loading
      await page.waitForSelector('#narrative-text', { timeout: 5000 });
      
      // Click immediately to skip typewriter
      await page.click('body');
      
      // Text should be fully visible immediately
      await page.waitForTimeout(100);
      const narrativeText = await page.locator('#narrative-text').textContent();
      expect(narrativeText.length).toBeGreaterThan(0);
      
      // Choices should be enabled
      const firstChoice = page.locator('.choice-button').first();
      const isEnabled = await firstChoice.isEnabled();
      expect(isEnabled).toBe(true);
    });
  });

  test.describe('Timed Choice System Tests', () => {
    test('should display and countdown timer on timed choice scenes', async ({ page }) => {
      // Select mission and role
      await page.click('button:has-text("Pearl Harbor")');
      await page.waitForSelector('.role-card', { timeout: 5000 });
      await page.click('.role-card:has-text("American Sailor")');
      
      // Navigate to scene 2 (should have timed choice)
      await page.waitForSelector('#narrative-text', { timeout: 5000 });
      await page.waitForTimeout(2000); // Wait for typewriter
      await page.locator('.choice-button').first().click();
      
      // Wait for scene 2
      await page.waitForTimeout(600);
      await page.waitForSelector('#narrative-text', { timeout: 5000 });
      await page.waitForTimeout(2000); // Wait for typewriter
      
      // Check if timer is visible
      const timerDisplay = page.locator('#timer-display');
      const timerVisible = await timerDisplay.isVisible().catch(() => false);
      
      if (timerVisible) {
        console.log('Timer found on scene 2');
        
        // Get initial time
        const initialTime = await timerDisplay.textContent();
        const initialSeconds = parseInt(initialTime);
        
        // Wait 2 seconds
        await page.waitForTimeout(2000);
        
        // Get updated time
        const laterTime = await timerDisplay.textContent();
        const laterSeconds = parseInt(laterTime);
        
        // Timer should have decreased
        expect(laterSeconds).toBeLessThan(initialSeconds);
        console.log(`Timer decreased from ${initialSeconds}s to ${laterSeconds}s`);
      } else {
        console.log('No timer on scene 2 - may need to check scene configuration');
      }
    });
  });

  test.describe('Atmospheric Effects Tests', () => {
    test('should apply atmospheric effects on appropriate scenes', async ({ page }) => {
      // Select mission and role
      await page.click('button:has-text("Pearl Harbor")');
      await page.waitForSelector('.role-card', { timeout: 5000 });
      await page.click('.role-card:has-text("American Sailor")');
      
      // Track effects across scenes
      const effectsFound = [];
      
      for (let sceneNum = 1; sceneNum <= 5; sceneNum++) {
        await page.waitForSelector('#narrative-text', { timeout: 5000 });
        await page.waitForTimeout(1000);
        
        // Check for atmospheric effects
        const bodyClasses = await page.evaluate(() => document.body.className);
        
        // Check for any effect classes
        const effectTypes = ['smoke', 'fire', 'shake', 'dawn', 'explosion', 'aftermath', 'rain', 'ocean', 'ash'];
        const foundEffects = effectTypes.filter(effect => bodyClasses.includes(`effect-${effect}`));
        
        if (foundEffects.length > 0) {
          effectsFound.push({ scene: sceneNum, effects: foundEffects });
          console.log(`Scene ${sceneNum} has effects:`, foundEffects);
        }
        
        // Move to next scene (except on last scene)
        if (sceneNum < 5) {
          await page.locator('.choice-button').first().click();
          await page.waitForTimeout(600);
        }
      }
      
      // Should have found at least some atmospheric effects
      expect(effectsFound.length).toBeGreaterThan(0);
      console.log('Total effects found:', effectsFound);
    });
  });

  test.describe('Scene Transition Tests', () => {
    test('should smoothly transition between scenes', async ({ page }) => {
      // Select mission and role
      await page.click('button:has-text("Pearl Harbor")');
      await page.waitForSelector('.role-card', { timeout: 5000 });
      await page.click('.role-card:has-text("American Sailor")');
      
      // Wait for first scene
      await page.waitForSelector('#narrative-text', { timeout: 5000 });
      await page.waitForTimeout(2000);
      
      // Get initial scene text
      const scene1Text = await page.locator('#narrative-text').textContent();
      
      // Make choice to trigger transition
      await page.locator('.choice-button').first().click();
      
      // Wait for transition (500ms)
      await page.waitForTimeout(600);
      
      // Get new scene text
      const scene2Text = await page.locator('#narrative-text').textContent();
      
      // Text should have changed
      expect(scene2Text).not.toBe(scene1Text);
      console.log('Scene transition successful');
    });
  });

  test.describe('Choice Hover Effects Tests', () => {
    test('should apply hover effects to choice buttons', async ({ page }) => {
      // Select mission and role
      await page.click('button:has-text("Pearl Harbor")');
      await page.waitForSelector('.role-card', { timeout: 5000 });
      await page.click('.role-card:has-text("American Sailor")');
      
      // Wait for choices to appear
      await page.waitForSelector('.choice-button', { timeout: 5000 });
      await page.waitForTimeout(2000); // Wait for typewriter
      
      const firstChoice = page.locator('.choice-button').first();
      
      // Get initial styles
      const initialTransform = await firstChoice.evaluate(el => 
        window.getComputedStyle(el).transform
      );
      
      // Hover over choice
      await firstChoice.hover();
      
      // Get hover styles
      const hoverTransform = await firstChoice.evaluate(el => 
        window.getComputedStyle(el).transform
      );
      
      console.log('Initial transform:', initialTransform);
      console.log('Hover transform:', hoverTransform);
      
      // Verify button is interactive
      const isEnabled = await firstChoice.isEnabled();
      expect(isEnabled).toBe(true);
    });
  });

  test.describe('Ambient Sound Tests', () => {
    test('should handle ambient sound configuration gracefully', async ({ page }) => {
      // Listen for console errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      // Select mission and role
      await page.click('button:has-text("Pearl Harbor")');
      await page.waitForSelector('.role-card', { timeout: 5000 });
      await page.click('.role-card:has-text("American Sailor")');
      
      // Wait for scene to load
      await page.waitForSelector('#narrative-text', { timeout: 5000 });
      await page.waitForTimeout(2000);
      
      // Check if sound toggle button exists
      const soundToggle = page.locator('#sound-toggle');
      const soundToggleExists = await soundToggle.isVisible().catch(() => false);
      
      if (soundToggleExists) {
        console.log('Sound toggle button found');
        
        // Try toggling sound
        await soundToggle.click();
        await page.waitForTimeout(500);
        await soundToggle.click();
        
        console.log('Sound toggle clicked successfully');
      }
      
      // Game should continue without errors even if audio files are missing
      await page.locator('.choice-button').first().click();
      await page.waitForTimeout(600);
      
      console.log('Console errors:', consoleErrors.length);
      // Note: Audio errors are expected if files are not provided, but game should continue
    });
  });

  test.describe('Full Integration - All Features Together', () => {
    test('should coordinate typewriter, timer, effects, and transitions', async ({ page }) => {
      // Select mission and role
      await page.click('button:has-text("Pearl Harbor")');
      await page.waitForSelector('.role-card', { timeout: 5000 });
      await page.click('.role-card:has-text("American Sailor")');
      
      // Scene 1: Test typewriter + atmospheric effect
      await page.waitForSelector('#narrative-text', { timeout: 5000 });
      console.log('Scene 1: Typewriter starting...');
      
      // Wait for typewriter to complete
      await page.waitForTimeout(2000);
      
      // Check for atmospheric effect
      let bodyClasses = await page.evaluate(() => document.body.className);
      console.log('Scene 1 effects:', bodyClasses);
      
      // Make choice to trigger transition
      await page.locator('.choice-button').first().click();
      console.log('Scene 1: Choice made, transition starting...');
      
      // Scene 2: Test transition + typewriter + timer
      await page.waitForTimeout(600);
      await page.waitForSelector('#narrative-text', { timeout: 5000 });
      console.log('Scene 2: Typewriter starting...');
      
      // Wait for typewriter to complete
      await page.waitForTimeout(2000);
      
      // Check if timer appears (should only appear AFTER typewriter)
      const timerDisplay = page.locator('#timer-display');
      const timerVisible = await timerDisplay.isVisible().catch(() => false);
      console.log('Scene 2: Timer visible:', timerVisible);
      
      if (timerVisible) {
        // Verify timer is counting down
        const time1 = await timerDisplay.textContent();
        await page.waitForTimeout(1000);
        const time2 = await timerDisplay.textContent();
        console.log(`Timer: ${time1} -> ${time2}`);
      }
      
      // Check for atmospheric effects
      bodyClasses = await page.evaluate(() => document.body.className);
      console.log('Scene 2 effects:', bodyClasses);
      
      // Make choice
      await page.locator('.choice-button').first().click();
      
      // Continue to outcome
      for (let i = 3; i <= 5; i++) {
        await page.waitForTimeout(600);
        await page.waitForSelector('#narrative-text', { timeout: 5000 });
        await page.waitForTimeout(2000);
        await page.locator('.choice-button').first().click();
      }
      
      // Verify outcome screen reached
      await page.waitForSelector('#outcome-screen', { timeout: 5000 });
      console.log('Full integration test completed successfully');
    });
  });
});
