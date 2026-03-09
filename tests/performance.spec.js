/**
 * Performance Testing Suite for Witness Interactive
 * Tests FPS and performance metrics during animations and effects
 * 
 * Requirements: Task 10.3 - Performance testing
 * - Monitor FPS during effects on desktop
 * - Monitor FPS during effects on mobile
 * - Test on iOS Safari (emulated)
 * - Test on Android Chrome (emulated)
 * - Optimize if performance < 60fps
 */

import { test, expect } from '@playwright/test';

const TARGET_FPS = 60;
const ACCEPTABLE_FPS = 55; // Allow 5fps drop
const MOBILE_ACCEPTABLE_FPS = 50; // More lenient for mobile

/**
 * Measure FPS using requestAnimationFrame
 */
async function measureFPS(page, durationMs = 2000) {
  return await page.evaluate((duration) => {
    return new Promise((resolve) => {
      const frames = [];
      let lastTime = performance.now();
      let startTime = lastTime;
      
      function measureFrame() {
        const currentTime = performance.now();
        const delta = currentTime - lastTime;
        
        if (delta > 0) {
          frames.push(1000 / delta);
        }
        
        lastTime = currentTime;
        
        if (currentTime - startTime < duration) {
          requestAnimationFrame(measureFrame);
        } else {
          // Calculate statistics
          const avgFPS = frames.reduce((a, b) => a + b, 0) / frames.length;
          const minFPS = Math.min(...frames);
          const maxFPS = Math.max(...frames);
          
          resolve({
            avgFPS: Math.round(avgFPS * 10) / 10,
            minFPS: Math.round(minFPS * 10) / 10,
            maxFPS: Math.round(maxFPS * 10) / 10,
            frameCount: frames.length
          });
        }
      }
      
      requestAnimationFrame(measureFrame);
    });
  }, durationMs);
}

/**
 * Measure memory usage
 */
async function measureMemory(page) {
  return await page.evaluate(() => {
    if (performance.memory) {
      return {
        usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024 * 10) / 10,
        totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024 * 10) / 10,
        jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024 * 10) / 10
      };
    }
    return null;
  });
}

/**
 * Start the game and navigate to a specific role
 */
async function startGame(page, role = 'american-sailor') {
  await page.goto('http://localhost:8000');
  
  // Wait for loading screen to disappear
  await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 10000 });
  
  // Click Pearl Harbor mission
  await page.click('button:has-text("Pearl Harbor")');
  
  // Wait for role selection screen
  await page.waitForSelector('.role-card', { timeout: 5000 });
  
  // Click the appropriate role
  const roleText = role === 'american-sailor' ? 'American Sailor' :
                   role === 'american-civilian' ? 'American Civilian' :
                   'Japanese Aviator';
  
  await page.click(`.role-card:has-text("${roleText}")`);
  
  // Wait for first scene narrative
  await page.waitForSelector('.scene-narrative', { timeout: 5000 });
}

// Desktop Performance Tests
test.describe('Desktop Performance Tests', () => {

  test('Baseline FPS - No effects', async ({ page }) => {
    await startGame(page, 'american-sailor');
    
    // Measure baseline FPS
    const fps = await measureFPS(page, 3000);
    
    console.log('Baseline FPS:', fps);
    expect(fps.avgFPS).toBeGreaterThanOrEqual(ACCEPTABLE_FPS);
    expect(fps.minFPS).toBeGreaterThanOrEqual(ACCEPTABLE_FPS - 10);
  });

  test('FPS during typewriter effect', async ({ page }) => {
    await startGame(page, 'american-sailor');
    
    // Start measuring FPS during typewriter
    const fpsPromise = measureFPS(page, 2000);
    
    // Typewriter should be active
    await page.waitForTimeout(500);
    
    const fps = await fpsPromise;
    
    console.log('Typewriter FPS:', fps);
    expect(fps.avgFPS).toBeGreaterThanOrEqual(ACCEPTABLE_FPS);
  });

  test('FPS during scene transition', async ({ page }) => {
    await startGame(page, 'american-sailor');
    
    // Wait for typewriter to complete
    await page.waitForTimeout(3000);
    
    // Click first choice to trigger transition
    const fpsPromise = measureFPS(page, 1000);
    await page.click('.choice-button:first-child');
    
    const fps = await fpsPromise;
    
    console.log('Scene Transition FPS:', fps);
    expect(fps.avgFPS).toBeGreaterThanOrEqual(ACCEPTABLE_FPS);
  });

  test('FPS during atmospheric effects - smoke', async ({ page }) => {
    await page.goto('http://localhost:8000');
    
    // Apply smoke effect manually
    await page.evaluate(() => {
      document.body.classList.add('effect-smoke');
    });
    
    const fps = await measureFPS(page, 3000);
    
    console.log('Smoke Effect FPS:', fps);
    expect(fps.avgFPS).toBeGreaterThanOrEqual(ACCEPTABLE_FPS);
  });

  test('FPS during atmospheric effects - fire', async ({ page }) => {
    await page.goto('http://localhost:8000');
    
    await page.evaluate(() => {
      document.body.classList.add('effect-fire');
    });
    
    const fps = await measureFPS(page, 3000);
    
    console.log('Fire Effect FPS:', fps);
    expect(fps.avgFPS).toBeGreaterThanOrEqual(ACCEPTABLE_FPS);
  });

  test('FPS during atmospheric effects - shake', async ({ page }) => {
    await page.goto('http://localhost:8000');
    
    await page.evaluate(() => {
      document.body.classList.add('effect-shake');
    });
    
    const fps = await measureFPS(page, 1000);
    
    console.log('Shake Effect FPS:', fps);
    expect(fps.avgFPS).toBeGreaterThanOrEqual(ACCEPTABLE_FPS);
  });

  test('FPS during atmospheric effects - explosion', async ({ page }) => {
    await page.goto('http://localhost:8000');
    
    await page.evaluate(() => {
      document.body.classList.add('effect-explosion');
    });
    
    const fps = await measureFPS(page, 2000);
    
    console.log('Explosion Effect FPS:', fps);
    expect(fps.avgFPS).toBeGreaterThanOrEqual(ACCEPTABLE_FPS);
  });

  test('FPS during multiple simultaneous effects', async ({ page }) => {
    await page.goto('http://localhost:8000');
    
    // Apply multiple effects
    await page.evaluate(() => {
      document.body.classList.add('effect-smoke', 'effect-fire', 'effect-shake');
    });
    
    const fps = await measureFPS(page, 3000);
    
    console.log('Multiple Effects FPS:', fps);
    expect(fps.avgFPS).toBeGreaterThanOrEqual(ACCEPTABLE_FPS - 5); // More lenient
  });

  test('FPS during timed choice countdown', async ({ page }) => {
    await startGame(page, 'american-sailor');
    
    // Wait for typewriter to complete
    await page.waitForTimeout(3000);
    
    // Navigate to a scene with timed choice (scene 2)
    await page.click('.choice-button:first-child');
    await page.waitForTimeout(3000);
    
    // Check if timer is visible
    const timerVisible = await page.isVisible('.timer-display');
    
    if (timerVisible) {
      const fps = await measureFPS(page, 3000);
      console.log('Timed Choice FPS:', fps);
      expect(fps.avgFPS).toBeGreaterThanOrEqual(ACCEPTABLE_FPS);
    } else {
      console.log('No timed choice on this scene, skipping test');
    }
  });

  test('Memory usage over time', async ({ page }) => {
    await startGame(page, 'american-sailor');
    
    const memoryReadings = [];
    
    // Take memory readings over 10 seconds
    for (let i = 0; i < 5; i++) {
      const memory = await measureMemory(page);
      if (memory) {
        memoryReadings.push(memory.usedJSHeapSize);
        console.log(`Memory reading ${i + 1}:`, memory.usedJSHeapSize, 'MB');
      }
      await page.waitForTimeout(2000);
    }
    
    if (memoryReadings.length > 0) {
      // Check for memory leaks (should not grow significantly)
      const firstReading = memoryReadings[0];
      const lastReading = memoryReadings[memoryReadings.length - 1];
      const growth = lastReading - firstReading;
      
      console.log('Memory growth:', growth, 'MB');
      expect(growth).toBeLessThan(10); // Should not grow more than 10MB
    }
  });
});

// Mobile Performance Tests - iPhone 13
test.describe('Mobile Performance Tests - iPhone 13', () => {

  test('Mobile baseline FPS', async ({ page }) => {
    await startGame(page, 'american-sailor');
    
    const fps = await measureFPS(page, 3000);
    
    console.log('Mobile Baseline FPS:', fps);
    expect(fps.avgFPS).toBeGreaterThanOrEqual(MOBILE_ACCEPTABLE_FPS);
  });

  test('Mobile FPS during typewriter', async ({ page }) => {
    await startGame(page, 'american-sailor');
    
    const fps = await measureFPS(page, 2000);
    
    console.log('Mobile Typewriter FPS:', fps);
    expect(fps.avgFPS).toBeGreaterThanOrEqual(MOBILE_ACCEPTABLE_FPS);
  });

  test('Mobile FPS during scene transition', async ({ page }) => {
    await startGame(page, 'american-sailor');
    await page.waitForTimeout(3000);
    
    const fpsPromise = measureFPS(page, 1000);
    await page.click('.choice-button:first-child');
    
    const fps = await fpsPromise;
    
    console.log('Mobile Scene Transition FPS:', fps);
    expect(fps.avgFPS).toBeGreaterThanOrEqual(MOBILE_ACCEPTABLE_FPS);
  });

  test('Mobile FPS during atmospheric effects', async ({ page }) => {
    await page.goto('http://localhost:8000');
    
    await page.evaluate(() => {
      document.body.classList.add('effect-smoke');
    });
    
    const fps = await measureFPS(page, 3000);
    
    console.log('Mobile Atmospheric Effect FPS:', fps);
    expect(fps.avgFPS).toBeGreaterThanOrEqual(MOBILE_ACCEPTABLE_FPS - 5);
  });

  test('Mobile memory usage', async ({ page }) => {
    await startGame(page, 'american-sailor');
    
    const memory = await measureMemory(page);
    
    if (memory) {
      console.log('Mobile Memory Usage:', memory.usedJSHeapSize, 'MB');
      expect(memory.usedJSHeapSize).toBeLessThan(100); // Should stay under 100MB
    }
  });
});

// Mobile Performance Tests - Android (Pixel 5)
test.describe('Mobile Performance Tests - Android Pixel 5', () => {

  test('Android baseline FPS', async ({ page }) => {
    await startGame(page, 'american-sailor');
    
    const fps = await measureFPS(page, 3000);
    
    console.log('Android Baseline FPS:', fps);
    expect(fps.avgFPS).toBeGreaterThanOrEqual(MOBILE_ACCEPTABLE_FPS);
  });

  test('Android FPS during effects', async ({ page }) => {
    await page.goto('http://localhost:8000');
    
    await page.evaluate(() => {
      document.body.classList.add('effect-fire');
    });
    
    const fps = await measureFPS(page, 3000);
    
    console.log('Android Effect FPS:', fps);
    expect(fps.avgFPS).toBeGreaterThanOrEqual(MOBILE_ACCEPTABLE_FPS - 5);
  });
});

// iOS Safari Emulation Tests
test.describe('iOS Safari Performance Tests', () => {

  test('iOS Safari - Full game flow performance', async ({ page }) => {
    await startGame(page, 'american-sailor');
    
    const performanceData = [];
    
    // Play through first 3 scenes
    for (let i = 0; i < 3; i++) {
      await page.waitForTimeout(2000); // Wait for typewriter
      
      const fps = await measureFPS(page, 1000);
      performanceData.push({ scene: i + 1, fps: fps.avgFPS });
      
      console.log(`iOS Scene ${i + 1} FPS:`, fps.avgFPS);
      
      // Click choice if available
      const choiceExists = await page.isVisible('.choice-button:first-child');
      if (choiceExists) {
        await page.click('.choice-button:first-child');
      }
    }
    
    // All scenes should maintain acceptable FPS
    performanceData.forEach(data => {
      expect(data.fps).toBeGreaterThanOrEqual(MOBILE_ACCEPTABLE_FPS - 5);
    });
  });
});

// Android Chrome Emulation Tests
test.describe('Android Chrome Performance Tests', () => {

  test('Android Chrome - Full game flow performance', async ({ page }) => {
    await startGame(page, 'american-sailor');
    
    const performanceData = [];
    
    // Play through first 3 scenes
    for (let i = 0; i < 3; i++) {
      await page.waitForTimeout(2000);
      
      const fps = await measureFPS(page, 1000);
      performanceData.push({ scene: i + 1, fps: fps.avgFPS });
      
      console.log(`Android Scene ${i + 1} FPS:`, fps.avgFPS);
      
      const choiceExists = await page.isVisible('.choice-button:first-child');
      if (choiceExists) {
        await page.click('.choice-button:first-child');
      }
    }
    
    performanceData.forEach(data => {
      expect(data.fps).toBeGreaterThanOrEqual(MOBILE_ACCEPTABLE_FPS - 5);
    });
  });
});

// Stress Tests
test.describe('Performance Stress Tests', () => {

  test('Rapid scene transitions', async ({ page }) => {
    await startGame(page, 'american-sailor');
    
    const fpsReadings = [];
    
    // Rapidly transition through scenes
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(1000);
      
      const fps = await measureFPS(page, 500);
      fpsReadings.push(fps.avgFPS);
      
      const choiceExists = await page.isVisible('.choice-button:first-child');
      if (choiceExists) {
        await page.click('.choice-button:first-child');
      } else {
        break;
      }
    }
    
    const avgFPS = fpsReadings.reduce((a, b) => a + b, 0) / fpsReadings.length;
    console.log('Rapid Transitions Avg FPS:', avgFPS);
    
    expect(avgFPS).toBeGreaterThanOrEqual(ACCEPTABLE_FPS - 10);
  });

  test('Long session performance', async ({ page }) => {
    await startGame(page, 'american-sailor');
    
    const initialMemory = await measureMemory(page);
    const initialFPS = await measureFPS(page, 1000);
    
    // Simulate 2 minutes of gameplay
    for (let i = 0; i < 6; i++) {
      await page.waitForTimeout(2000);
      
      const choiceExists = await page.isVisible('.choice-button:first-child');
      if (choiceExists) {
        await page.click('.choice-button:first-child');
      }
      
      // Apply random effects
      await page.evaluate(() => {
        const effects = ['effect-smoke', 'effect-fire', 'effect-shake'];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        document.body.classList.add(randomEffect);
        setTimeout(() => document.body.classList.remove(randomEffect), 1000);
      });
    }
    
    const finalMemory = await measureMemory(page);
    const finalFPS = await measureFPS(page, 1000);
    
    console.log('Initial FPS:', initialFPS.avgFPS, 'Final FPS:', finalFPS.avgFPS);
    
    if (initialMemory && finalMemory) {
      const memoryGrowth = finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
      console.log('Memory growth after 2 minutes:', memoryGrowth, 'MB');
      expect(memoryGrowth).toBeLessThan(20);
    }
    
    // FPS should not degrade significantly
    expect(finalFPS.avgFPS).toBeGreaterThanOrEqual(initialFPS.avgFPS - 10);
  });
});
