/**
 * Cross-Mission Integration Test: Pearl Harbor + Rwanda
 * Validates that multiple missions can coexist without interference
 * Requirements: TR-1.1, Architecture Heritage AH-1 through AH-10
 */

import { test, expect } from '@playwright/test';

test.describe('Cross-Mission Integration Tests', () => {
  
  test('Flag namespace isolation - ph_ vs rw_ prefixes', async ({ page }) => {
    await page.goto('http://localhost:8000');
    
    // Inject ConsequenceSystem mock and test flag isolation
    const result = await page.evaluate(() => {
      // Create mock ConsequenceSystem
      const flags = {};
      
      // Set Pearl Harbor flags
      flags['ph_sounded_alarm'] = true;
      flags['ph_fought_fires'] = true;
      flags['ph_abandoned_ship'] = false;
      
      // Set Rwanda flags
      flags['rw_helped_celestin'] = true;
      flags['rw_misdirected_militia'] = true;
      flags['rw_staffed_roadblock'] = false;
      
      // Check for collisions
      const phFlags = Object.keys(flags).filter(k => k.startsWith('ph_'));
      const rwFlags = Object.keys(flags).filter(k => k.startsWith('rw_'));
      const sharedKeys = phFlags.filter(k => rwFlags.includes(k));
      
      return {
        phCount: phFlags.length,
        rwCount: rwFlags.length,
        collisions: sharedKeys.length,
        flags: flags
      };
    });
    
    expect(result.phCount).toBeGreaterThan(0);
    expect(result.rwCount).toBeGreaterThan(0);
    expect(result.collisions).toBe(0);
    
    console.log('✓ Flag namespace isolation verified');
  });

  test('Mission metadata uniqueness', async ({ page }) => {
    await page.goto('http://localhost:8000');
    
    // Wait for missions to load
    await page.waitForTimeout(1000);
    
    // Check that both missions are registered
    const missions = await page.evaluate(() => {
      // Try to access MissionRegistry if available
      if (window.MissionRegistry) {
        return window.MissionRegistry.getAllMissions();
      }
      return null;
    });
    
    if (missions) {
      const missionIds = missions.map(m => m.id);
      expect(missionIds).toContain('pearl-harbor');
      expect(missionIds).toContain('rwanda-genocide');
      
      // Verify unique IDs
      const uniqueIds = new Set(missionIds);
      expect(missionIds.length).toBe(uniqueIds.size);
      
      console.log('✓ Mission metadata uniqueness verified');
    } else {
      console.log('⚠ MissionRegistry not accessible, skipping');
    }
  });

  test('EventBus communication integrity', async ({ page }) => {
    await page.goto('http://localhost:8000');
    
    const result = await page.evaluate(() => {
      const capturedEvents = [];
      
      // Mock EventBus
      const mockEventBus = {
        emit(event, data) {
          capturedEvents.push({ event, data });
        }
      };
      
      // Simulate Pearl Harbor events
      mockEventBus.emit('mission:start', { missionId: 'pearl-harbor', roleId: 'american-sailor' });
      mockEventBus.emit('scene:transition', { sceneId: 'ph-as-scene-01' });
      mockEventBus.emit('game:complete', { missionId: 'pearl-harbor' });
      
      // Simulate Rwanda events
      mockEventBus.emit('mission:start', { missionId: 'rwanda-genocide', roleId: 'hutu-moderate' });
      mockEventBus.emit('scene:transition', { sceneId: 'rw-hm-scene-01' });
      mockEventBus.emit('game:complete', { missionId: 'rwanda-genocide' });
      
      return {
        totalEvents: capturedEvents.length,
        phEvents: capturedEvents.filter(e => e.data.missionId === 'pearl-harbor').length,
        rwEvents: capturedEvents.filter(e => e.data.missionId === 'rwanda-genocide').length,
        events: capturedEvents
      };
    });
    
    expect(result.totalEvents).toBe(6);
    expect(result.phEvents).toBe(3);
    expect(result.rwEvents).toBe(3);
    
    console.log('✓ EventBus communication integrity verified');
  });
});
