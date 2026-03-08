/**
 * Unit Tests for AmbientSoundManager
 * 
 * Tests ambient sound playback, crossfading, mute functionality,
 * and graceful degradation for missing audio files.
 */

import AmbientSoundManager from './AmbientSoundManager.js';
import EventBus from './EventBus.js';

// Mock HTMLAudioElement for testing
class MockAudio {
  constructor() {
    this.src = '';
    this.volume = 1;
    this.loop = false;
    this.currentTime = 0;
    this.preload = 'auto';
    this.paused = true;
    this._eventListeners = new Map();
  }

  play() {
    this.paused = false;
    return Promise.resolve();
  }

  pause() {
    this.paused = true;
  }

  addEventListener(event, callback) {
    if (!this._eventListeners.has(event)) {
      this._eventListeners.set(event, []);
    }
    this._eventListeners.get(event).push(callback);
  }

  removeEventListener(event, callback) {
    if (!this._eventListeners.has(event)) return;
    const callbacks = this._eventListeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  triggerError() {
    const errorCallbacks = this._eventListeners.get('error') || [];
    errorCallbacks.forEach(cb => cb(new Event('error')));
  }
}

// Replace global Audio constructor
const originalAudio = window.Audio;
window.Audio = MockAudio;

describe('AmbientSoundManager', () => {
  let eventBus;
  let manager;

  beforeEach(() => {
    eventBus = new EventBus();
    manager = new AmbientSoundManager(eventBus, {
      defaultVolume: 0.6,
      crossfadeDuration: 1000,
      audioPath: '/audio/ambient/'
    });
  });

  afterEach(() => {
    if (manager) {
      manager.destroy();
    }
  });

  describe('Constructor', () => {
    test('should initialize with default config', () => {
      const mgr = new AmbientSoundManager(eventBus);
      expect(mgr.config.defaultVolume).toBe(0.6);
      expect(mgr.config.crossfadeDuration).toBe(1000);
      expect(mgr.config.audioPath).toBe('/audio/ambient/');
      mgr.destroy();
    });

    test('should accept custom config', () => {
      const mgr = new AmbientSoundManager(eventBus, {
        defaultVolume: 0.8,
        crossfadeDuration: 500,
        audioPath: '/custom/path/'
      });
      expect(mgr.config.defaultVolume).toBe(0.8);
      expect(mgr.config.crossfadeDuration).toBe(500);
      expect(mgr.config.audioPath).toBe('/custom/path/');
      mgr.destroy();
    });

    test('should initialize with muted false', () => {
      expect(manager.isMuted()).toBe(false);
    });

    test('should subscribe to EventBus events', () => {
      const toggleSpy = jest.spyOn(manager, 'toggleMute');
      eventBus.emit('sound:toggle');
      expect(toggleSpy).toHaveBeenCalled();
    });
  });

  describe('playSound', () => {
    test('should create and play audio element', async () => {
      const soundPlayedPromise = new Promise(resolve => {
        eventBus.on('sound:playing', (data) => {
          resolve(data);
        });
      });

      manager.playSound('ocean-waves', true, 0.7);

      const data = await soundPlayedPromise;
      expect(data.soundId).toBe('ocean-waves');
      expect(data.volume).toBe(0.7);
      expect(manager.activeSounds.has('ocean-waves')).toBe(true);
    });

    test('should use default volume if not specified', async () => {
      const soundPlayedPromise = new Promise(resolve => {
        eventBus.on('sound:playing', resolve);
      });

      manager.playSound('ocean-waves');

      const data = await soundPlayedPromise;
      expect(data.volume).toBe(0.6); // default volume
    });

    test('should set loop property', async () => {
      manager.playSound('ocean-waves', true);
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const activeSound = manager.activeSounds.get('ocean-waves');
      expect(activeSound.element.loop).toBe(true);
    });

    test('should handle missing soundId', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      manager.playSound(null);
      expect(consoleError).toHaveBeenCalledWith(
        'AmbientSoundManager.playSound: soundId is required'
      );
      consoleError.mockRestore();
    });

    test('should emit sound:error on audio load failure', async () => {
      const errorPromise = new Promise(resolve => {
        eventBus.on('sound:error', resolve);
      });

      manager.playSound('missing-file');
      await new Promise(resolve => setTimeout(resolve, 10));

      const audio = manager.audioElements.get('missing-file');
      audio.triggerError();

      const errorData = await errorPromise;
      expect(errorData.soundId).toBe('missing-file');
    });

    test('should respect mute state when playing', async () => {
      manager.toggleMute(); // Mute
      manager.playSound('ocean-waves', true, 0.7);
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const activeSound = manager.activeSounds.get('ocean-waves');
      expect(activeSound.element.volume).toBe(0);
    });
  });

  describe('stopSound', () => {
    test('should stop playing sound immediately', async () => {
      manager.playSound('ocean-waves');
      await new Promise(resolve => setTimeout(resolve, 10));

      const stoppedPromise = new Promise(resolve => {
        eventBus.on('sound:stopped', resolve);
      });

      manager.stopSound('ocean-waves', false);

      const data = await stoppedPromise;
      expect(data.soundId).toBe('ocean-waves');
      expect(manager.activeSounds.has('ocean-waves')).toBe(false);
    });

    test('should handle stopping non-playing sound', () => {
      // Should not throw error
      expect(() => manager.stopSound('non-existent')).not.toThrow();
    });

    test('should reset currentTime when stopping', async () => {
      manager.playSound('ocean-waves');
      await new Promise(resolve => setTimeout(resolve, 10));

      const activeSound = manager.activeSounds.get('ocean-waves');
      activeSound.element.currentTime = 5;

      manager.stopSound('ocean-waves', false);
      expect(activeSound.element.currentTime).toBe(0);
    });
  });

  describe('crossfade', () => {
    test('should crossfade between two sounds', async () => {
      // Play first sound
      manager.playSound('ocean-waves');
      await new Promise(resolve => setTimeout(resolve, 10));

      const playingPromise = new Promise(resolve => {
        eventBus.on('sound:playing', (data) => {
          if (data.soundId === 'aircraft-engines') {
            resolve(data);
          }
        });
      });

      // Crossfade to second sound
      manager.crossfade('ocean-waves', 'aircraft-engines', 100);

      const data = await playingPromise;
      expect(data.soundId).toBe('aircraft-engines');
    });

    test('should just play new sound if no fromSound', async () => {
      const playingPromise = new Promise(resolve => {
        eventBus.on('sound:playing', resolve);
      });

      manager.crossfade(null, 'ocean-waves', 100);

      const data = await playingPromise;
      expect(data.soundId).toBe('ocean-waves');
    });

    test('should do nothing if same sound', () => {
      manager.playSound('ocean-waves');
      const initialSize = manager.activeSounds.size;
      
      manager.crossfade('ocean-waves', 'ocean-waves', 100);
      
      expect(manager.activeSounds.size).toBe(initialSize);
    });

    test('should stop old sound after crossfade completes', async () => {
      manager.playSound('ocean-waves');
      await new Promise(resolve => setTimeout(resolve, 10));

      const stoppedPromise = new Promise(resolve => {
        eventBus.on('sound:stopped', (data) => {
          if (data.soundId === 'ocean-waves') {
            resolve(data);
          }
        });
      });

      manager.crossfade('ocean-waves', 'aircraft-engines', 50);

      // Wait for crossfade to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      const data = await stoppedPromise;
      expect(data.soundId).toBe('ocean-waves');
    });
  });

  describe('toggleMute', () => {
    test('should toggle mute state', () => {
      expect(manager.isMuted()).toBe(false);
      manager.toggleMute();
      expect(manager.isMuted()).toBe(true);
      manager.toggleMute();
      expect(manager.isMuted()).toBe(false);
    });

    test('should emit sound:muted event', () => {
      const mutedPromise = new Promise(resolve => {
        eventBus.on('sound:muted', resolve);
      });

      manager.toggleMute();

      return mutedPromise.then(data => {
        expect(data.muted).toBe(true);
      });
    });

    test('should update volume of active sounds', async () => {
      manager.playSound('ocean-waves', true, 0.7);
      await new Promise(resolve => setTimeout(resolve, 10));

      const activeSound = manager.activeSounds.get('ocean-waves');
      expect(activeSound.element.volume).toBe(0.7);

      manager.toggleMute();
      expect(activeSound.element.volume).toBe(0);

      manager.toggleMute();
      expect(activeSound.element.volume).toBe(0.7);
    });
  });

  describe('isMuted', () => {
    test('should return current mute state', () => {
      expect(manager.isMuted()).toBe(false);
      manager.muted = true;
      expect(manager.isMuted()).toBe(true);
    });
  });

  describe('createAudioElement', () => {
    test('should create audio element with correct path', () => {
      const audio = manager.createAudioElement('ocean-waves');
      expect(audio.src).toContain('/audio/ambient/ocean-waves.mp3');
      expect(audio.preload).toBe('auto');
    });

    test('should add error event listener', () => {
      const audio = manager.createAudioElement('test-sound');
      expect(audio._eventListeners.has('error')).toBe(true);
    });
  });

  describe('destroy', () => {
    test('should stop all active sounds', async () => {
      manager.playSound('ocean-waves');
      manager.playSound('aircraft-engines');
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(manager.activeSounds.size).toBe(2);

      manager.destroy();

      expect(manager.activeSounds.size).toBe(0);
      expect(manager.audioElements.size).toBe(0);
    });

    test('should cancel ongoing crossfade', async () => {
      manager.playSound('ocean-waves');
      await new Promise(resolve => setTimeout(resolve, 10));

      manager.crossfade('ocean-waves', 'aircraft-engines', 1000);
      expect(manager.crossfadeAnimationId).not.toBeNull();

      manager.destroy();
      expect(manager.crossfadeAnimationId).toBeNull();
    });
  });

  describe('EventBus Integration', () => {
    test('should respond to sound:toggle event', () => {
      expect(manager.isMuted()).toBe(false);
      eventBus.emit('sound:toggle');
      expect(manager.isMuted()).toBe(true);
    });

    test('should emit sound:playing event', async () => {
      const events = [];
      eventBus.on('sound:playing', (data) => events.push(data));

      manager.playSound('ocean-waves');
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(events.length).toBe(1);
      expect(events[0].soundId).toBe('ocean-waves');
    });

    test('should emit sound:stopped event', async () => {
      const events = [];
      eventBus.on('sound:stopped', (data) => events.push(data));

      manager.playSound('ocean-waves');
      await new Promise(resolve => setTimeout(resolve, 10));

      manager.stopSound('ocean-waves');

      expect(events.length).toBe(1);
      expect(events[0].soundId).toBe('ocean-waves');
    });

    test('should emit sound:error event on load failure', async () => {
      const events = [];
      eventBus.on('sound:error', (data) => events.push(data));

      manager.playSound('missing-file');
      await new Promise(resolve => setTimeout(resolve, 10));

      const audio = manager.audioElements.get('missing-file');
      audio.triggerError();

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(events.length).toBe(1);
      expect(events[0].soundId).toBe('missing-file');
    });
  });

  describe('Graceful Degradation', () => {
    test('should continue gameplay when audio fails to load', async () => {
      const consoleWarn = jest.spyOn(console, 'warn').mockImplementation();
      
      manager.playSound('missing-file');
      await new Promise(resolve => setTimeout(resolve, 10));

      const audio = manager.audioElements.get('missing-file');
      audio.triggerError();

      await new Promise(resolve => setTimeout(resolve, 10));

      // Should log warning but not throw error
      expect(consoleWarn).toHaveBeenCalled();
      
      consoleWarn.mockRestore();
    });

    test('should allow other sounds to play after one fails', async () => {
      // Fail first sound
      manager.playSound('missing-file');
      await new Promise(resolve => setTimeout(resolve, 10));
      const audio1 = manager.audioElements.get('missing-file');
      audio1.triggerError();

      // Play second sound successfully
      const playingPromise = new Promise(resolve => {
        eventBus.on('sound:playing', (data) => {
          if (data.soundId === 'ocean-waves') {
            resolve(data);
          }
        });
      });

      manager.playSound('ocean-waves');

      const data = await playingPromise;
      expect(data.soundId).toBe('ocean-waves');
    });
  });
});

// Restore original Audio constructor
window.Audio = originalAudio;

console.log('✓ AmbientSoundManager tests completed');
