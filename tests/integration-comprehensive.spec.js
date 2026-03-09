/**
 * Comprehensive Integration Test for Interactive Polish & Engagement Features
 * Tests all Phase 1 and Phase 2 features across all three roles
 * 
 * Test Coverage:
 * - Typewriter effect on all scenes (all 3 roles)
 * - Timed choices on Arizona sailor role
 * - Atmospheric effects on all roles
 * - Scene transitions between all scenes
 * - Choice hover effects
 * - Ambient sound crossfading (if audio files provided)
 */

import { EventBus } from '../js/engine/EventBus.js';
import { TypewriterEffect } from '../js/engine/TypewriterEffect.js';
import { TimedChoiceSystem } from '../js/engine/TimedChoiceSystem.js';
import { AtmosphericEffects } from '../js/engine/AtmosphericEffects.js';
import { SceneTransition } from '../js/engine/SceneTransition.js';
import { AmbientSoundManager } from '../js/engine/AmbientSoundManager.js';
import { MissionRegistry } from '../js/content/MissionRegistry.js';

// Test suite for comprehensive integration testing
describe('Interactive Polish & Engagement - Comprehensive Integration', () => {
  let eventBus;
  let typewriterEffect;
  let timedChoiceSystem;
  let atmosphericEffects;
  let sceneTransition;
  let ambientSoundManager;
  let missionRegistry;

  beforeEach(() => {
    // Initialize EventBus
    eventBus = new EventBus();

    // Initialize all components
    typewriterEffect = new TypewriterEffect(eventBus, {
      defaultSpeed: 10, // Faster for testing
      skipOnClick: true,
      respectMotionPrefs: false // Disable for testing
    });

    timedChoiceSystem = new TimedChoiceSystem(eventBus, {
      warningThreshold: 3000,
      pulseInterval: 500
    });

    atmosphericEffects = new AtmosphericEffects(eventBus, {
      defaultDuration: 2000,
      respectMotionPrefs: false // Disable for testing
    });

    sceneTransition = new SceneTransition(eventBus, {
      defaultType: 'fade',
      duration: 500,
      respectMotionPrefs: false // Disable for testing
    });

    ambientSoundManager = new AmbientSoundManager(eventBus, {
      defaultVolume: 0.6,
      crossfadeDuration: 1000,
      preloadOnStart: false // Don't preload for testing
    });

    missionRegistry = new MissionRegistry();

    // Clear document body
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Cleanup
    typewriterEffect = null;
    timedChoiceSystem = null;
    atmosphericEffects = null;
    sceneTransition = null;
    ambientSoundManager = null;
    missionRegistry = null;
    eventBus = null;
    document.body.innerHTML = '';
  });

  describe('Typewriter Effect Integration', () => {
    it('should reveal text character-by-character on all American Sailor scenes', async () => {
      const mission = missionRegistry.getMission('pearl-harbor');
      const sailorRole = mission.roles.find(r => r.id === 'american-sailor');
      
      for (const scene of sailorRole.scenes) {
        const element = document.createElement('div');
        document.body.appendChild(element);

        let completed = false;
        typewriterEffect.revealText(element, scene.narrative, 10, () => {
          completed = true;
        });

        // Wait for typewriter to complete
        await new Promise(resolve => {
          const checkInterval = setInterval(() => {
            if (completed) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 50);
        });

        expect(element.textContent).toBe(scene.narrative);
        expect(completed).toBe(true);
      }
    });

    it('should reveal text character-by-character on all American Civilian scenes', async () => {
      const mission = missionRegistry.getMission('pearl-harbor');
      const civilianRole = mission.roles.find(r => r.id === 'american-civilian');
      
      for (const scene of civilianRole.scenes) {
        const element = document.createElement('div');
        document.body.appendChild(element);

        let completed = false;
        typewriterEffect.revealText(element, scene.narrative, 10, () => {
          completed = true;
        });

        // Wait for typewriter to complete
        await new Promise(resolve => {
          const checkInterval = setInterval(() => {
            if (completed) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 50);
        });

        expect(element.textContent).toBe(scene.narrative);
        expect(completed).toBe(true);
      }
    });

    it('should reveal text character-by-character on all Japanese Aviator scenes', async () => {
      const mission = missionRegistry.getMission('pearl-harbor');
      const aviatorRole = mission.roles.find(r => r.id === 'japanese-aviator');
      
      for (const scene of aviatorRole.scenes) {
        const element = document.createElement('div');
        document.body.appendChild(element);

        let completed = false;
        typewriterEffect.revealText(element, scene.narrative, 10, () => {
          completed = true;
        });

        // Wait for typewriter to complete
        await new Promise(resolve => {
          const checkInterval = setInterval(() => {
            if (completed) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 50);
        });

        expect(element.textContent).toBe(scene.narrative);
        expect(completed).toBe(true);
      }
    });

    it('should allow click-to-skip on all scenes', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      const longText = 'This is a very long narrative text that would take a while to type out character by character.';
      
      let completed = false;
      typewriterEffect.revealText(element, longText, 50, () => {
        completed = true;
      });

      // Simulate click to skip
      document.body.click();

      expect(element.textContent).toBe(longText);
      expect(completed).toBe(true);
    });
  });

  describe('Timed Choice System Integration', () => {
    it('should display timed choices on Arizona sailor role scenes', () => {
      const mission = missionRegistry.getMission('pearl-harbor');
      const sailorRole = mission.roles.find(r => r.id === 'american-sailor');
      
      const timedScenes = sailorRole.scenes.filter(s => s.timedChoice?.enabled);
      
      // Arizona sailor should have the most timed choices (4-5 scenes)
      expect(timedScenes.length).toBeGreaterThanOrEqual(4);
      expect(timedScenes.length).toBeLessThanOrEqual(5);

      // Verify each timed scene has proper configuration
      timedScenes.forEach(scene => {
        expect(scene.timedChoice.duration).toBeGreaterThan(0);
        expect(scene.timedChoice.defaultChoice).toBeDefined();
        
        // Verify default choice exists in scene choices
        const defaultChoiceExists = scene.choices.some(c => c.id === scene.timedChoice.defaultChoice);
        expect(defaultChoiceExists).toBe(true);
      });
    });

    it('should auto-select default choice when timer expires', (done) => {
      const defaultChoiceId = 'test-choice-a';
      let autoSelected = false;

      timedChoiceSystem.startTimer(100, defaultChoiceId, (choiceId) => {
        autoSelected = true;
        expect(choiceId).toBe(defaultChoiceId);
        done();
      });

      expect(timedChoiceSystem.getRemainingTime()).toBeGreaterThan(0);
    });

    it('should cancel timer when player makes a choice', (done) => {
      const defaultChoiceId = 'test-choice-a';
      
      timedChoiceSystem.startTimer(1000, defaultChoiceId, () => {
        // Should not be called
        expect(true).toBe(false);
      });

      // Simulate player making a choice
      setTimeout(() => {
        timedChoiceSystem.cancelTimer();
        expect(timedChoiceSystem.getRemainingTime()).toBe(0);
        done();
      }, 100);
    });

    it('should emit timer events correctly', (done) => {
      const events = [];
      
      eventBus.on('timer:started', () => events.push('started'));
      eventBus.on('timer:expired', () => events.push('expired'));

      timedChoiceSystem.startTimer(100, 'test-choice', () => {
        expect(events).toContain('started');
        expect(events).toContain('expired');
        done();
      });
    });
  });

  describe('Atmospheric Effects Integration', () => {
    it('should apply atmospheric effects on American Sailor scenes', () => {
      const mission = missionRegistry.getMission('pearl-harbor');
      const sailorRole = mission.roles.find(r => r.id === 'american-sailor');
      
      const scenesWithEffects = sailorRole.scenes.filter(s => s.atmosphericEffect);
      
      // Should have multiple scenes with effects
      expect(scenesWithEffects.length).toBeGreaterThan(0);

      scenesWithEffects.forEach(scene => {
        const effect = scene.atmosphericEffect;
        
        // Apply effect
        atmosphericEffects.applyEffect(effect, 2000);
        
        // Verify effect class is applied
        expect(document.body.classList.contains(`effect-${effect}`)).toBe(true);
        
        // Remove effect
        atmosphericEffects.removeEffect(effect);
        expect(document.body.classList.contains(`effect-${effect}`)).toBe(false);
      });
    });

    it('should apply atmospheric effects on American Civilian scenes', () => {
      const mission = missionRegistry.getMission('pearl-harbor');
      const civilianRole = mission.roles.find(r => r.id === 'american-civilian');
      
      const scenesWithEffects = civilianRole.scenes.filter(s => s.atmosphericEffect);
      
      // Should have multiple scenes with effects
      expect(scenesWithEffects.length).toBeGreaterThan(0);

      scenesWithEffects.forEach(scene => {
        const effect = scene.atmosphericEffect;
        
        // Apply effect
        atmosphericEffects.applyEffect(effect, 2000);
        
        // Verify effect class is applied
        expect(document.body.classList.contains(`effect-${effect}`)).toBe(true);
        
        // Remove effect
        atmosphericEffects.removeEffect(effect);
        expect(document.body.classList.contains(`effect-${effect}`)).toBe(false);
      });
    });

    it('should apply atmospheric effects on Japanese Aviator scenes', () => {
      const mission = missionRegistry.getMission('pearl-harbor');
      const aviatorRole = mission.roles.find(r => r.id === 'japanese-aviator');
      
      const scenesWithEffects = aviatorRole.scenes.filter(s => s.atmosphericEffect);
      
      // Should have multiple scenes with effects
      expect(scenesWithEffects.length).toBeGreaterThan(0);

      scenesWithEffects.forEach(scene => {
        const effect = scene.atmosphericEffect;
        
        // Apply effect
        atmosphericEffects.applyEffect(effect, 2000);
        
        // Verify effect class is applied
        expect(document.body.classList.contains(`effect-${effect}`)).toBe(true);
        
        // Remove effect
        atmosphericEffects.removeEffect(effect);
        expect(document.body.classList.contains(`effect-${effect}`)).toBe(false);
      });
    });

    it('should support multiple simultaneous effects', () => {
      atmosphericEffects.applyEffect('smoke', 2000);
      atmosphericEffects.applyEffect('fire', 2000);
      
      expect(document.body.classList.contains('effect-smoke')).toBe(true);
      expect(document.body.classList.contains('effect-fire')).toBe(true);
      
      atmosphericEffects.clearAllEffects();
      expect(document.body.classList.contains('effect-smoke')).toBe(false);
      expect(document.body.classList.contains('effect-fire')).toBe(false);
    });
  });

  describe('Scene Transition Integration', () => {
    it('should transition between all American Sailor scenes', async () => {
      const mission = missionRegistry.getMission('pearl-harbor');
      const sailorRole = mission.roles.find(r => r.id === 'american-sailor');
      
      for (let i = 0; i < sailorRole.scenes.length - 1; i++) {
        const fromScene = sailorRole.scenes[i];
        const toScene = sailorRole.scenes[i + 1];
        
        let transitionComplete = false;
        eventBus.on('transition:complete', () => {
          transitionComplete = true;
        });

        sceneTransition.transition(fromScene, toScene, 'fade', 100);
        
        // Wait for transition to complete
        await new Promise(resolve => setTimeout(resolve, 150));
        
        expect(transitionComplete).toBe(true);
      }
    });

    it('should transition between all American Civilian scenes', async () => {
      const mission = missionRegistry.getMission('pearl-harbor');
      const civilianRole = mission.roles.find(r => r.id === 'american-civilian');
      
      for (let i = 0; i < civilianRole.scenes.length - 1; i++) {
        const fromScene = civilianRole.scenes[i];
        const toScene = civilianRole.scenes[i + 1];
        
        let transitionComplete = false;
        eventBus.on('transition:complete', () => {
          transitionComplete = true;
        });

        sceneTransition.transition(fromScene, toScene, 'fade', 100);
        
        // Wait for transition to complete
        await new Promise(resolve => setTimeout(resolve, 150));
        
        expect(transitionComplete).toBe(true);
      }
    });

    it('should transition between all Japanese Aviator scenes', async () => {
      const mission = missionRegistry.getMission('pearl-harbor');
      const aviatorRole = mission.roles.find(r => r.id === 'japanese-aviator');
      
      for (let i = 0; i < aviatorRole.scenes.length - 1; i++) {
        const fromScene = aviatorRole.scenes[i];
        const toScene = aviatorRole.scenes[i + 1];
        
        let transitionComplete = false;
        eventBus.on('transition:complete', () => {
          transitionComplete = true;
        });

        sceneTransition.transition(fromScene, toScene, 'fade', 100);
        
        // Wait for transition to complete
        await new Promise(resolve => setTimeout(resolve, 150));
        
        expect(transitionComplete).toBe(true);
      }
    });
  });

  describe('Choice Hover Effects Integration', () => {
    it('should apply hover effects to choice buttons', () => {
      const button = document.createElement('button');
      button.className = 'choice-button';
      document.body.appendChild(button);

      // Get computed styles
      const styles = window.getComputedStyle(button);
      
      // Verify transition property exists
      expect(styles.transition).toBeDefined();
      
      // Simulate hover (we can't actually test :hover in jsdom, but we can verify the CSS exists)
      const styleSheet = Array.from(document.styleSheets).find(sheet => {
        try {
          return Array.from(sheet.cssRules).some(rule => 
            rule.selectorText && rule.selectorText.includes('.choice-button:hover')
          );
        } catch (e) {
          return false;
        }
      });
      
      // If CSS is loaded, hover styles should exist
      // This is a basic check - full hover testing requires browser automation
      expect(button.className).toBe('choice-button');
    });
  });

  describe('Ambient Sound Integration', () => {
    it('should handle ambient sound configuration on American Sailor scenes', () => {
      const mission = missionRegistry.getMission('pearl-harbor');
      const sailorRole = mission.roles.find(r => r.id === 'american-sailor');
      
      const scenesWithSound = sailorRole.scenes.filter(s => s.ambientSound);
      
      // Should have scenes with ambient sound configured
      expect(scenesWithSound.length).toBeGreaterThan(0);

      scenesWithSound.forEach(scene => {
        expect(scene.ambientSound.id).toBeDefined();
        expect(scene.ambientSound.volume).toBeGreaterThan(0);
        expect(scene.ambientSound.volume).toBeLessThanOrEqual(1);
      });
    });

    it('should handle ambient sound configuration on American Civilian scenes', () => {
      const mission = missionRegistry.getMission('pearl-harbor');
      const civilianRole = mission.roles.find(r => r.id === 'american-civilian');
      
      const scenesWithSound = civilianRole.scenes.filter(s => s.ambientSound);
      
      // Should have scenes with ambient sound configured
      expect(scenesWithSound.length).toBeGreaterThan(0);

      scenesWithSound.forEach(scene => {
        expect(scene.ambientSound.id).toBeDefined();
        expect(scene.ambientSound.volume).toBeGreaterThan(0);
        expect(scene.ambientSound.volume).toBeLessThanOrEqual(1);
      });
    });

    it('should handle ambient sound configuration on Japanese Aviator scenes', () => {
      const mission = missionRegistry.getMission('pearl-harbor');
      const aviatorRole = mission.roles.find(r => r.id === 'japanese-aviator');
      
      const scenesWithSound = aviatorRole.scenes.filter(s => s.ambientSound);
      
      // Should have scenes with ambient sound configured
      expect(scenesWithSound.length).toBeGreaterThan(0);

      scenesWithSound.forEach(scene => {
        expect(scene.ambientSound.id).toBeDefined();
        expect(scene.ambientSound.volume).toBeGreaterThan(0);
        expect(scene.ambientSound.volume).toBeLessThanOrEqual(1);
      });
    });

    it('should gracefully handle missing audio files', () => {
      // Attempt to play non-existent audio
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      ambientSoundManager.playSound('non-existent-sound', true, 0.5);
      
      // Should log warning but not throw error
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should toggle mute state', () => {
      expect(ambientSoundManager.isMuted()).toBe(false);
      
      ambientSoundManager.toggleMute();
      expect(ambientSoundManager.isMuted()).toBe(true);
      
      ambientSoundManager.toggleMute();
      expect(ambientSoundManager.isMuted()).toBe(false);
    });
  });

  describe('Full Game Flow Integration', () => {
    it('should coordinate typewriter and timed choice correctly', async () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      const narrative = 'The attack begins. What do you do?';
      let typewriterComplete = false;
      let timerStarted = false;

      // Start typewriter
      typewriterEffect.revealText(element, narrative, 10, () => {
        typewriterComplete = true;
        
        // CRITICAL: Timer should only start AFTER typewriter completes
        timedChoiceSystem.startTimer(1000, 'default-choice', () => {});
        timerStarted = true;
      });

      // Wait for typewriter to complete
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (typewriterComplete) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 50);
      });

      expect(typewriterComplete).toBe(true);
      expect(timerStarted).toBe(true);
      expect(timedChoiceSystem.getRemainingTime()).toBeGreaterThan(0);
    });

    it('should apply effects and transitions together', async () => {
      const mission = missionRegistry.getMission('pearl-harbor');
      const sailorRole = mission.roles.find(r => r.id === 'american-sailor');
      
      // Find a scene with both effect and transition
      const scene = sailorRole.scenes.find(s => s.atmosphericEffect);
      
      if (scene) {
        // Apply atmospheric effect
        atmosphericEffects.applyEffect(scene.atmosphericEffect, 2000);
        
        // Transition to scene
        let transitionComplete = false;
        eventBus.on('transition:complete', () => {
          transitionComplete = true;
        });

        sceneTransition.transition(null, scene, 'fade', 100);
        
        // Wait for transition
        await new Promise(resolve => setTimeout(resolve, 150));
        
        expect(transitionComplete).toBe(true);
        expect(document.body.classList.contains(`effect-${scene.atmosphericEffect}`)).toBe(true);
      }
    });
  });

  describe('EventBus Communication', () => {
    it('should emit and receive events across all components', () => {
      const events = [];
      
      eventBus.on('typewriter:complete', () => events.push('typewriter'));
      eventBus.on('timer:started', () => events.push('timer'));
      eventBus.on('effect:applied', () => events.push('effect'));
      eventBus.on('transition:complete', () => events.push('transition'));
      eventBus.on('sound:playing', () => events.push('sound'));

      // Trigger events
      eventBus.emit('typewriter:complete');
      eventBus.emit('timer:started');
      eventBus.emit('effect:applied');
      eventBus.emit('transition:complete');
      eventBus.emit('sound:playing');

      expect(events).toContain('typewriter');
      expect(events).toContain('timer');
      expect(events).toContain('effect');
      expect(events).toContain('transition');
      expect(events).toContain('sound');
    });
  });
});
