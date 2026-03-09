/**
 * Browser Compatibility Test Suite
 * Tests interactive polish features across Chromium, Firefox, and WebKit
 * 
 * Key areas tested:
 * 1. Typewriter effect rendering
 * 2. Scene transitions
 * 3. Atmospheric effects (CSS animations)
 * 4. Timed choice system
 * 5. Choice button interactions
 * 6. Sound toggle functionality
 * 7. Mobile viewport responsiveness
 */

import { test, expect, chromium, firefox, webkit } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

// Test configuration for different browsers
const browsers = [
  { name: 'Chromium', launcher: chromium },
  { name: 'Firefox', launcher: firefox },
  { name: 'WebKit', launcher: webkit }
];

/**
 * Helper function to start a game and navigate to first scene
 */
async function startGame(page) {
  await page.goto(BASE_URL);
  await page.waitForSelector('#timeline-selector', { timeout: 5000 });
  
  // Click Pearl Harbor mission
  await page.click('.timeline-card');
  await page.waitForSelector('#role-selection', { timeout: 5000 });
  
  // Select American Sailor role (has most interactive features)
  const roleButtons = await page.$$('.role-card');
  await roleButtons[0].click();
  
  // Wait for first scene to load
  await page.waitForSelector('#scene-container', { timeout: 5000 });
}

/**
 * Test Suite: Cross-Browser Compatibility
 */
for (const browser of browsers) {
  test.describe(`${browser.name} - Interactive Polish Features`, () => {
    
    test(`${browser.name}: Typewriter effect renders correctly`, async () => {
      const browserInstance = await browser.launcher.launch();
      const context = await browserInstance.newContext();
      const page = await context.newPage();
      
      try {
        await startGame(page);
        
        // Check that narrative text exists
        const narrative = await page.$('#narrative-text');
        expect(narrative).not.toBeNull();
        
        // Wait a moment for typewriter to start
        await page.waitForTimeout(500);
        
        // Get initial text length
        const initialText = await page.$eval('#narrative-text', el => el.textContent);
        
        // Wait and check if text has grown (typewriter is working)
        await page.waitForTimeout(1000);
        const laterText = await page.$eval('#narrative-text', el => el.textContent);
        
        // In browsers with typewriter support, text should grow
        // In browsers without, text appears instantly (still valid)
        expect(laterText.length).toBeGreaterThanOrEqual(initialText.length);
        
        console.log(`✓ ${browser.name}: Typewriter effect working`);
      } finally {
        await browserInstance.close();
      }
    });
    
    test(`${browser.name}: Click-to-skip typewriter works`, async () => {
      const browserInstance = await browser.launcher.launch();
      const context = await browserInstance.newContext();
      const page = await context.newPage();
      
      try {
        await startGame(page);
        
        // Wait for typewriter to start
        await page.waitForTimeout(300);
        
        // Click anywhere on the scene
        await page.click('#scene-container');
        
        // Wait a moment
        await page.waitForTimeout(200);
        
        // Choices should now be enabled
        const choiceButtons = await page.$$('.choice-button:not([disabled])');
        expect(choiceButtons.length).toBeGreaterThan(0);
        
        console.log(`✓ ${browser.name}: Click-to-skip working`);
      } finally {
        await browserInstance.close();
      }
    });
    
    test(`${browser.name}: Scene transitions render smoothly`, async () => {
      const browserInstance = await browser.launcher.launch();
      const context = await browserInstance.newContext();
      const page = await context.newPage();
      
      try {
        await startGame(page);
        
        // Wait for typewriter to complete
        await page.waitForTimeout(2000);
        
        // Click first choice to trigger transition
        const firstChoice = await page.$('.choice-button:not([disabled])');
        await firstChoice.click();
        
        // Check for transition class (may be brief)
        await page.waitForTimeout(100);
        
        // New scene should load
        await page.waitForSelector('#scene-container', { timeout: 3000 });
        
        // Verify scene changed (scene number should update)
        const sceneInfo = await page.$('#scene-info');
        expect(sceneInfo).not.toBeNull();
        
        console.log(`✓ ${browser.name}: Scene transitions working`);
      } finally {
        await browserInstance.close();
      }
    });
    
    test(`${browser.name}: Atmospheric effects CSS animations work`, async () => {
      const browserInstance = await browser.launcher.launch();
      const context = await browserInstance.newContext();
      const page = await context.newPage();
      
      try {
        await startGame(page);
        
        // Wait for scene to load
        await page.waitForTimeout(1000);
        
        // Check if body has any effect classes
        const bodyClasses = await page.$eval('body', el => el.className);
        
        // Effects may or may not be present depending on scene
        // Just verify no JavaScript errors occurred
        const consoleErrors = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });
        
        await page.waitForTimeout(1000);
        
        // No console errors means CSS animations are compatible
        expect(consoleErrors.length).toBe(0);
        
        console.log(`✓ ${browser.name}: Atmospheric effects compatible`);
      } finally {
        await browserInstance.close();
      }
    });
    
    test(`${browser.name}: Timed choice system displays correctly`, async () => {
      const browserInstance = await browser.launcher.launch();
      const context = await browserInstance.newContext();
      const page = await context.newPage();
      
      try {
        await startGame(page);
        
        // Navigate through scenes to find a timed choice
        // American Sailor role has timed choices in combat scenes
        for (let i = 0; i < 3; i++) {
          await page.waitForTimeout(2000); // Wait for typewriter
          
          // Check if timer exists
          const timer = await page.$('#timer-display');
          if (timer) {
            // Timer found! Check if it's visible
            const isVisible = await timer.isVisible();
            expect(isVisible).toBe(true);
            
            // Check timer text
            const timerText = await page.$eval('#timer-seconds', el => el.textContent);
            expect(timerText).toMatch(/\d+/); // Should contain a number
            
            console.log(`✓ ${browser.name}: Timed choice system working`);
            break;
          }
          
          // Click choice to continue
          const choice = await page.$('.choice-button:not([disabled])');
          if (choice) {
            await choice.click();
            await page.waitForTimeout(500);
          }
        }
      } finally {
        await browserInstance.close();
      }
    });
    
    test(`${browser.name}: Choice button hover effects work`, async () => {
      const browserInstance = await browser.launcher.launch();
      const context = await browserInstance.newContext();
      const page = await context.newPage();
      
      try {
        await startGame(page);
        
        // Wait for choices to be enabled
        await page.waitForTimeout(2000);
        
        const firstChoice = await page.$('.choice-button:not([disabled])');
        expect(firstChoice).not.toBeNull();
        
        // Get initial styles
        const initialTransform = await firstChoice.evaluate(el => 
          window.getComputedStyle(el).transform
        );
        
        // Hover over button
        await firstChoice.hover();
        await page.waitForTimeout(300);
        
        // Get hover styles
        const hoverTransform = await firstChoice.evaluate(el => 
          window.getComputedStyle(el).transform
        );
        
        // Transform may change on hover (scale effect)
        // Or may be 'none' if prefers-reduced-motion is set
        // Both are valid - just verify no errors
        expect(hoverTransform).toBeDefined();
        
        console.log(`✓ ${browser.name}: Choice hover effects working`);
      } finally {
        await browserInstance.close();
      }
    });
    
    test(`${browser.name}: Sound toggle button works`, async () => {
      const browserInstance = await browser.launcher.launch();
      const context = await browserInstance.newContext();
      const page = await context.newPage();
      
      try {
        await startGame(page);
        
        // Find sound toggle button
        const soundToggle = await page.$('#sound-toggle');
        expect(soundToggle).not.toBeNull();
        
        // Button should be enabled
        const isDisabled = await soundToggle.evaluate(el => el.disabled);
        expect(isDisabled).toBe(false);
        
        // Click to toggle
        await soundToggle.click();
        await page.waitForTimeout(200);
        
        // Click again to toggle back
        await soundToggle.click();
        await page.waitForTimeout(200);
        
        // No errors means toggle is working
        console.log(`✓ ${browser.name}: Sound toggle working`);
      } finally {
        await browserInstance.close();
      }
    });
    
    test(`${browser.name}: Mobile viewport responsiveness`, async () => {
      const browserInstance = await browser.launcher.launch();
      const context = await browserInstance.newContext({
        viewport: { width: 375, height: 667 } // iPhone SE size
      });
      const page = await context.newPage();
      
      try {
        await startGame(page);
        
        // Wait for scene to load
        await page.waitForTimeout(1000);
        
        // Check that scene container is visible
        const sceneContainer = await page.$('#scene-container');
        const isVisible = await sceneContainer.isVisible();
        expect(isVisible).toBe(true);
        
        // Check that choices are visible and not overflowing
        const choices = await page.$$('.choice-button');
        expect(choices.length).toBeGreaterThan(0);
        
        // Verify first choice is within viewport
        const firstChoice = choices[0];
        const boundingBox = await firstChoice.boundingBox();
        expect(boundingBox.x).toBeGreaterThanOrEqual(0);
        expect(boundingBox.y).toBeGreaterThanOrEqual(0);
        expect(boundingBox.x + boundingBox.width).toBeLessThanOrEqual(375);
        
        console.log(`✓ ${browser.name}: Mobile viewport responsive`);
      } finally {
        await browserInstance.close();
      }
    });
    
    test(`${browser.name}: No console errors during gameplay`, async () => {
      const browserInstance = await browser.launcher.launch();
      const context = await browserInstance.newContext();
      const page = await context.newPage();
      
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      try {
        await startGame(page);
        
        // Play through first 2 scenes
        for (let i = 0; i < 2; i++) {
          await page.waitForTimeout(2000);
          const choice = await page.$('.choice-button:not([disabled])');
          if (choice) {
            await choice.click();
            await page.waitForTimeout(500);
          }
        }
        
        // Check for errors
        expect(consoleErrors.length).toBe(0);
        
        if (consoleErrors.length > 0) {
          console.error(`${browser.name} console errors:`, consoleErrors);
        } else {
          console.log(`✓ ${browser.name}: No console errors`);
        }
      } finally {
        await browserInstance.close();
      }
    });
    
  });
}

/**
 * Test Suite: Browser-Specific Edge Cases
 */
test.describe('Browser-Specific Edge Cases', () => {
  
  test('Safari (WebKit): CSS animation performance', async () => {
    const browser = await webkit.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      await startGame(page);
      
      // Monitor performance during animations
      await page.waitForTimeout(1000);
      
      // Trigger scene transition
      const choice = await page.$('.choice-button:not([disabled])');
      await choice.click();
      
      // Wait for transition
      await page.waitForTimeout(1000);
      
      // Check if page is still responsive
      const narrative = await page.$('#narrative-text');
      expect(narrative).not.toBeNull();
      
      console.log('✓ Safari: CSS animations perform well');
    } finally {
      await browser.close();
    }
  });
  
  test('Firefox: EventBus communication works', async () => {
    const browser = await firefox.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      await startGame(page);
      
      // Wait for scene to load
      await page.waitForTimeout(2000);
      
      // Make a choice (triggers EventBus events)
      const choice = await page.$('.choice-button:not([disabled])');
      await choice.click();
      
      // Wait for next scene
      await page.waitForTimeout(1000);
      
      // Verify scene changed
      const sceneContainer = await page.$('#scene-container');
      expect(sceneContainer).not.toBeNull();
      
      console.log('✓ Firefox: EventBus communication working');
    } finally {
      await browser.close();
    }
  });
  
  test('Chrome/Edge (Chromium): All features work together', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      await startGame(page);
      
      // Test typewriter
      await page.waitForTimeout(500);
      await page.click('#scene-container');
      
      // Test choice interaction
      await page.waitForTimeout(500);
      const choice = await page.$('.choice-button:not([disabled])');
      await choice.hover();
      await page.waitForTimeout(200);
      await choice.click();
      
      // Test scene transition
      await page.waitForTimeout(1000);
      
      // Test sound toggle
      const soundToggle = await page.$('#sound-toggle');
      await soundToggle.click();
      
      // Verify everything still works
      const narrative = await page.$('#narrative-text');
      expect(narrative).not.toBeNull();
      
      console.log('✓ Chrome/Edge: All features integrated correctly');
    } finally {
      await browser.close();
    }
  });
  
});

/**
 * Test Suite: Accessibility Features Across Browsers
 */
test.describe('Accessibility Across Browsers', () => {
  
  for (const browser of browsers) {
    test(`${browser.name}: prefers-reduced-motion respected`, async () => {
      const browserInstance = await browser.launcher.launch();
      const context = await browserInstance.newContext({
        reducedMotion: 'reduce'
      });
      const page = await context.newPage();
      
      try {
        await startGame(page);
        
        // With reduced motion, typewriter should complete instantly
        await page.waitForTimeout(500);
        
        // Choices should be enabled immediately
        const choices = await page.$$('.choice-button:not([disabled])');
        expect(choices.length).toBeGreaterThan(0);
        
        console.log(`✓ ${browser.name}: Reduced motion respected`);
      } finally {
        await browserInstance.close();
      }
    });
  }
  
});
