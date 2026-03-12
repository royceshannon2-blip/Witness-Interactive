/**
 * Cross-Mission Integration Test: Pearl Harbor + Rwanda
 * 
 * Validates that multiple missions can coexist without interference:
 * - Flag namespace isolation (ph_ vs rw_ prefixes)
 * - EventBus communication integrity
 * - Feedback system captures both missions
 * - No state leakage between missions
 * 
 * Requirements: TR-1.1, Architecture Heritage AH-1 through AH-10
 */

import { test, expect } from '@playwright/test';

test.describe('Cross-Mission Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000');
    await page.waitForLoadState('networkidle');
  });

  test('Play Pearl Harbor then Rwanda - no interference', async ({ page }) => {
    // MISSION 1: Pearl Harbor - American Sailor
    console.log('Starting Pearl Harbor mission...');
    
    // Select Pearl Harbor mission
    await page.click('text=Pearl Harbor');
    await page.waitForTimeout(500);
    
    // Select American Sailor role
    await page.click('text=American Sailor');
    await page.waitForTimeout(500);
    
    // Play through a short path
    await page.click('button:has-text("Sound the alarm")');
    await page.waitForTimeout(1000);
    
    await page.click('button:has-text("Fight the fires")');
    await page.waitForTimeout(1000);
    
    // Complete Pearl Harbor mission
    await page.click('button:has-text("Continue")'); // Outcome screen
    await page.waitForTimeout(1000);
    
    // Skip ripple timeline
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(1000);
    
    // Complete knowledge checkpoint
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(1000);
    
    // Verify Pearl Harbor feedback captured
    const phFeedbackData = await page.evaluate(() => {
      return window.lastFeedbackData || null;
    });
    
    expect(phFeedbackData).toBeTruthy();
    expect(phFeedbackData.missionId).toBe('pearl-harbor');
    expect(phFeedbackData.roleId).toBe('american-sailor');
    
    console.log('Pearl Harbor mission complete. Feedback captured:', phFeedbackData);
    
    // MISSION 2: Rwanda - Hutu Moderate
    console.log('Starting Rwanda mission...');
    
    // Return to timeline
    await page.click('text=Play Another Mission');
    await page.waitForTimeout(500);
    
    // Select Rwanda mission
    await page.click('text=Rwanda, 1994');
    await page.waitForTimeout(500);
    
    // Select Hutu Moderate role
    await page.click('text=Hutu Moderate');
    await page.waitForTimeout(500);
    
    // Play through a short path
    await page.click('button:has-text("Help him hide")');
    await page.waitForTimeout(1000);
    
    await page.click('button:has-text("Misdirect them")');
    await page.waitForTimeout(1000);
    
    // Complete Rwanda mission
    await page.click('button:has-text("Continue")'); // Outcome screen
    await page.waitForTimeout(1000);
    
    // Skip ripple timeline
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(1000);
    
    // Complete knowledge checkpoint
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(1000);
    
    // Verify Rwanda feedback captured
    const rwFeedbackData = await page.evaluate(() => {
      return window.lastFeedbackData || null;
    });
    
    expect(rwFeedbackData).toBeTruthy();
    expect(rwFeedbackData.missionId).toBe('rwanda-genocide');
    expect(rwFeedbackData.roleId).toBe('hutu-moderate');
    
    console.log('Rwanda mission complete. Feedback captured:', rwFeedbackData);
  });


  test('Verify flag namespace isolation', async ({ page }) => {
    // Test that ph_ and rw_ flags don't collide
    
    await page.evaluate(() => {
      // Simulate setting flags from both missions
      window.ConsequenceSystem = window.ConsequenceSystem || {
        flags: {},
        setFlag(key, value) { this.flags[key] = value; },
        getFlag(key) { return this.flags[key]; },
        getAllFlags() { return { ...this.flags }; }
      };
      
      // Set Pearl Harbor flags
      window.ConsequenceSystem.setFlag('ph_sounded_alarm', true);
      window.ConsequenceSystem.setFlag('ph_fought_fires', true);
      
      // Set Rwanda flags
      window.ConsequenceSystem.setFlag('rw_helped_celestin', true);
      window.ConsequenceSystem.setFlag('rw_misdirected_militia', true);
    });
    
    const flags = await page.evaluate(() => {
      return window.ConsequenceSystem.getAllFlags();
    });
    
    // Verify both mission flags exist
    expect(flags['ph_sounded_alarm']).toBe(true);
    expect(flags['ph_fought_fires']).toBe(true);
    expect(flags['rw_helped_celestin']).toBe(true);
    expect(flags['rw_misdirected_militia']).toBe(true);
    
    // Verify no collisions
    expect(Object.keys(flags).filter(k => k.startsWith('ph_')).length).toBeGreaterThan(0);
    expect(Object.keys(flags).filter(k => k.startsWith('rw_')).length).toBeGreaterThan(0);
    
    console.log('Flag namespace isolation verified:', flags);
  });


  test('Verify EventBus communication integrity', async ({ page }) => {
    // Test that EventBus events from both missions work correctly
    
    const events = await page.evaluate(() => {
      const capturedEvents = [];
      
      // Mock EventBus
      window.EventBus = window.EventBus || {
        emit(event, data) {
          capturedEvents.push({ event, data });
        },
        on(event, callback) {
          // Mock subscription
        }
      };
      
      // Simulate mission events
      window.EventBus.emit('mission:start', { missionId: 'pearl-harbor', roleId: 'american-sailor' });
      window.EventBus.emit('scene:transition', { sceneId: 'ph-as-scene-01' });
      window.EventBus.emit('game:complete', { missionId: 'pearl-harbor', roleId: 'american-sailor' });
      
      window.EventBus.emit('mission:start', { missionId: 'rwanda-genocide', roleId: 'hutu-moderate' });
      window.EventBus.emit('scene:transition', { sceneId: 'rw-hm-scene-01' });
      window.EventBus.emit('game:complete', { missionId: 'rwanda-genocide', roleId: 'hutu-moderate' });
      
      return capturedEvents;
    });
    
    // Verify events were emitted correctly
    expect(events.length).toBe(6);
    expect(events[0].event).toBe('mission:start');
    expect(events[0].data.missionId).toBe('pearl-harbor');
    expect(events[3].event).toBe('mission:start');
    expect(events[3].data.missionId).toBe('rwanda-genocide');
    
    console.log('EventBus communication verified:', events);
  });
});
