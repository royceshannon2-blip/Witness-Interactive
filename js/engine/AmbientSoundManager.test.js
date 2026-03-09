/**
 * AmbientSoundManager Unit Tests
 * 
 * Tests the AmbientSoundManager component for proper audio playback,
 * crossfading, mute/unmute functionality, graceful degradation,
 * and EventBus integration.
 * 
 * Requirements: 3.1-3.10, 8.1-8.5
 */

import EventBus from './EventBus.js';
import AmbientSoundManager from './AmbientSoundManager.js';

// Test suite
let passedTests = 0;
let failedTests = 0;

/**
 * Test helper: Assert equality
 */
function assertEqual(actual, expected, message) {
  if (actual === expected) {
    console.log(`✓ ${message}`);
    passedTests++;
    return true;
  } else {
    console.error(`✗ ${message}`);
    console.error(`  Expected: ${expected}`);
    console.error(`  Actual: ${actual}`);
    failedTests++;
    return false;
  }
}

/**
 * Test helper: Assert truthy
 */
function assertTrue(value, message) {
  if (value) {
    console.log(`✓ ${message}`);
    passedTests++;
    return true;
  } else {
    console.error(`✗ ${message}`);
    console.error(`  Expected truthy value, got: ${value}`);
    failedTests++;
    return false;
  }
}

/**
 * Test helper: Assert falsy
 */
function assertFalse(value, message) {
  if (!value) {
    console.log(`✓ ${message}`);
    passedTests++;
    return true;
  } else {
    console.error(`✗ ${message}`);
    console.error(`  Expected falsy value, got: ${value}`);
    failedTests++;
    return false;
  }
}

console.log('\n=== AmbientSoundManager Tests ===\n');

// Mock Audio element for testing
class MockAudio {
  constructor() {
    this.src = '';
    this.volume = 1;
    this.loop = false;
    this.preload = 'auto';
    this.currentTime = 0;
    this.paused = true;
    this._eventListeners = {};
  }

  play() {
    this.paused = false;
    return Promise.resolve();
  }

  pause() {
    this.paused = true;
  }

  addEventListener(event, handler) {
    if (!this._eventListeners[event]) {
      this._eventListeners[event] = [];
    }
    this._eventListeners[event].push(handler);
  }

  removeEventListener(event, handler) {
    if (this._eventListeners[event]) {
      this._eventListeners[event] = this._eventListeners[event].filter(h => h !== handler);
    }
  }

  _triggerEvent(event, data) {
    if (this._eventListeners[event]) {
      this._eventListeners[event].forEach(handler => handler(data));
    }
  }
}

// Replace global Audio with MockAudio for testing
const OriginalAudio = window.Audio;
window.Audio = MockAudio;

// Test 1: Constructor initializes correctly
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  assertTrue(manager.eventBus === eventBus, 'EventBus reference stored correctly');
  assertEqual(manager.config.defaultVolume, 0.6, 'Default volume set to 0.6');
  assertEqual(manager.config.crossfadeDuration, 1000, 'Default crossfade duration set to 1000ms');
  assertFalse(manager.muted, 'Initial mute state is false');
  assertTrue(manager.audioElements instanceof Map && manager.audioElements.size === 0, 'Audio elements map initialized empty');
  assertTrue(manager.activeSounds instanceof Map && manager.activeSounds.size === 0, 'Active sounds map initialized empty');
})();

// Test 2: Custom configuration
(() => {
  const eventBus = new EventBus();
  const customConfig = {
    defaultVolume: 0.8,
    crossfadeDuration: 2000,
    preloadOnStart: false,
    audioPath: '/custom/audio/path/'
  };
  
  const manager = new AmbientSoundManager(eventBus, customConfig);
  
  assertEqual(manager.config.defaultVolume, 0.8, 'Custom default volume applied');
  assertEqual(manager.config.crossfadeDuration, 2000, 'Custom crossfade duration applied');
  assertEqual(manager.config.audioPath, '/custom/audio/path/', 'Custom audio path applied');
})();

// Test 3: playSound() creates and plays audio
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  let soundPlayingEmitted = false;
  eventBus.on('sound:playing', (data) => {
    soundPlayingEmitted = true;
    assertEqual(data.soundId, 'ocean-waves', 'sound:playing event has correct soundId');
    assertEqual(data.volume, 0.6, 'sound:playing event has correct volume');
  });
  
  manager.playSound('ocean-waves');
  
  setTimeout(() => {
    assertTrue(manager.audioElements.has('ocean-waves'), 'Audio element created and stored');
    assertTrue(manager.activeSounds.has('ocean-waves'), 'Sound added to active sounds');
    
    const audioElement = manager.audioElements.get('ocean-waves');
    assertTrue(audioElement.loop === true, 'Audio element set to loop');
    assertEqual(audioElement.volume, 0.6, 'Audio element volume set correctly');
    assertFalse(audioElement.paused, 'Audio element is playing');
    assertTrue(soundPlayingEmitted, 'sound:playing event emitted');
  }, 50);
})();

// Test 4: playSound() with custom volume
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  manager.playSound('rain', true, 0.3);
  
  setTimeout(() => {
    const audioElement = manager.audioElements.get('rain');
    assertEqual(audioElement.volume, 0.3, 'Custom volume applied correctly');
    
    const activeSound = manager.activeSounds.get('rain');
    assertEqual(activeSound.volume, 0.3, 'Custom volume stored in active sounds');
  }, 50);
})();

// Test 5: stopSound() stops playback
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  let soundStoppedEmitted = false;
  eventBus.on('sound:stopped', (data) => {
    soundStoppedEmitted = true;
    assertEqual(data.soundId, 'thunder', 'sound:stopped event has correct soundId');
  });
  
  manager.playSound('thunder');
  
  setTimeout(() => {
    manager.stopSound('thunder');
    
    const audioElement = manager.audioElements.get('thunder');
    assertTrue(audioElement.paused, 'Audio element paused');
    assertEqual(audioElement.currentTime, 0, 'Audio element reset to start');
    assertFalse(manager.activeSounds.has('thunder'), 'Sound removed from active sounds');
    assertTrue(soundStoppedEmitted, 'sound:stopped event emitted');
  }, 50);
})();

// Test 6: toggleMute() changes mute state
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  let mutedEventCount = 0;
  let lastMutedState = null;
  
  eventBus.on('sound:muted', (data) => {
    mutedEventCount++;
    lastMutedState = data.muted;
  });
  
  assertFalse(manager.isMuted(), 'Initial mute state is false');
  
  manager.toggleMute();
  assertTrue(manager.isMuted(), 'Mute state toggled to true');
  assertTrue(lastMutedState === true, 'sound:muted event emitted with muted=true');
  
  manager.toggleMute();
  assertFalse(manager.isMuted(), 'Mute state toggled back to false');
  assertEqual(mutedEventCount, 2, 'sound:muted event emitted twice');
  assertFalse(lastMutedState, 'sound:muted event emitted with muted=false');
})();

// Test 7: toggleMute() affects active sounds
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  manager.playSound('wind', true, 0.5);
  
  setTimeout(() => {
    const audioElement = manager.audioElements.get('wind');
    assertEqual(audioElement.volume, 0.5, 'Initial volume is 0.5');
    
    manager.toggleMute();
    assertEqual(audioElement.volume, 0, 'Volume set to 0 when muted');
    
    manager.toggleMute();
    assertEqual(audioElement.volume, 0.5, 'Volume restored to 0.5 when unmuted');
  }, 50);
})();

// Test 8: EventBus sound:toggle integration
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  let mutedEventEmitted = false;
  eventBus.on('sound:muted', () => {
    mutedEventEmitted = true;
  });
  
  eventBus.emit('sound:toggle');
  
  assertTrue(manager.isMuted(), 'sound:toggle event toggles mute state');
  assertTrue(mutedEventEmitted, 'sound:muted event emitted in response');
})();

// Test 9: Graceful degradation for missing files
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  let errorEventEmitted = false;
  eventBus.on('sound:error', (data) => {
    errorEventEmitted = true;
    assertEqual(data.soundId, 'missing-sound', 'sound:error event has correct soundId');
  });
  
  const audioElement = manager.createAudioElement('missing-sound');
  assertTrue(audioElement !== null, 'Audio element created even for missing file');
  
  audioElement._triggerEvent('error', { message: 'File not found' });
  
  setTimeout(() => {
    assertTrue(errorEventEmitted, 'Error handled gracefully with event emission');
  }, 50);
})();

// Test 10: crossfade() transitions between sounds
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  manager.playSound('birds');
  
  setTimeout(() => {
    let soundStoppedEmitted = false;
    let soundPlayingEmitted = false;
    
    eventBus.on('sound:stopped', (data) => {
      if (data.soundId === 'birds') {
        soundStoppedEmitted = true;
      }
    });
    
    eventBus.on('sound:playing', (data) => {
      if (data.soundId === 'crickets') {
        soundPlayingEmitted = true;
      }
    });
    
    manager.crossfade('birds', 'crickets', 100);
    
    setTimeout(() => {
      assertTrue(manager.audioElements.has('crickets'), 'New audio element created for crossfade');
      assertTrue(manager.activeSounds.has('crickets'), 'New sound added to active sounds');
      
      setTimeout(() => {
        assertFalse(manager.activeSounds.has('birds'), 'Old sound removed after crossfade');
        assertTrue(soundStoppedEmitted, 'sound:stopped event emitted for old sound');
        assertTrue(soundPlayingEmitted, 'sound:playing event emitted for new sound');
      }, 150);
    }, 50);
  }, 50);
})();

// Test 11: crossfade() with no active sound
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  manager.crossfade(null, 'waterfall');
  
  setTimeout(() => {
    assertTrue(manager.activeSounds.has('waterfall'), 'New sound plays when no active sound exists');
  }, 50);
})();

// Test 12: crossfade() with same sound does nothing
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  manager.playSound('forest');
  
  setTimeout(() => {
    const initialSize = manager.activeSounds.size;
    
    manager.crossfade('forest', 'forest');
    
    setTimeout(() => {
      assertEqual(manager.activeSounds.size, initialSize, 'Crossfade to same sound does nothing');
      assertTrue(manager.activeSounds.has('forest'), 'Original sound still active');
    }, 50);
  }, 50);
})();

// Test 13: destroy() cleans up resources
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  manager.playSound('sound1');
  manager.playSound('sound2');
  
  setTimeout(() => {
    assertEqual(manager.activeSounds.size, 2, 'Multiple sounds active before destroy');
    
    manager.destroy();
    
    assertEqual(manager.activeSounds.size, 0, 'Active sounds cleared after destroy');
    assertEqual(manager.audioElements.size, 0, 'Audio elements cleared after destroy');
  }, 50);
})();

// Test 14: playSound() without soundId logs error
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  const originalError = console.error;
  let errorLogged = false;
  console.error = (msg) => {
    if (msg.includes('soundId is required')) {
      errorLogged = true;
    }
  };
  
  manager.playSound(null);
  
  console.error = originalError;
  
  assertTrue(errorLogged, 'Error logged when soundId is missing');
  assertEqual(manager.activeSounds.size, 0, 'No sound added when soundId is missing');
})();

// Test 15: Audio element configuration
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus, {
    audioPath: '/test/audio/'
  });
  
  const audioElement = manager.createAudioElement('test-sound');
  
  assertTrue(audioElement.src.includes('/test/audio/test-sound.mp3'), 'Audio src path configured correctly');
  assertEqual(audioElement.preload, 'auto', 'Audio preload set to auto');
})();

// Test 16: stopSound() with fadeOut parameter
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  manager.playSound('fade-test');
  
  setTimeout(() => {
    manager.stopSound('fade-test', true);
    
    // Sound should still be in active sounds during fade
    setTimeout(() => {
      // After fade completes, sound should be stopped
      setTimeout(() => {
        assertFalse(manager.activeSounds.has('fade-test'), 'Sound removed after fade out');
      }, 550);
    }, 50);
  }, 50);
})();

// Test 17: isMuted() returns correct state
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  assertFalse(manager.isMuted(), 'isMuted() returns false initially');
  
  manager.toggleMute();
  assertTrue(manager.isMuted(), 'isMuted() returns true after toggle');
  
  manager.toggleMute();
  assertFalse(manager.isMuted(), 'isMuted() returns false after second toggle');
})();

// Test 18: Multiple sounds can play simultaneously
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  manager.playSound('sound-a');
  manager.playSound('sound-b');
  manager.playSound('sound-c');
  
  setTimeout(() => {
    assertEqual(manager.activeSounds.size, 3, 'Multiple sounds can play simultaneously');
    assertTrue(manager.activeSounds.has('sound-a'), 'Sound A is active');
    assertTrue(manager.activeSounds.has('sound-b'), 'Sound B is active');
    assertTrue(manager.activeSounds.has('sound-c'), 'Sound C is active');
  }, 50);
})();

// Test 19: stopSound() on non-existent sound does nothing
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  // Should not throw error
  try {
    manager.stopSound('non-existent');
    assertTrue(true, 'stopSound() safe for non-existent sound');
  } catch (error) {
    assertFalse(true, 'stopSound() should not throw for non-existent sound');
  }
})();

// Test 20: EventBus scene:transition listener exists
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  // Emit scene:transition event (should not throw error)
  try {
    eventBus.emit('scene:transition', { sceneId: 'test' });
    assertTrue(true, 'scene:transition event handled without error');
  } catch (error) {
    assertFalse(true, 'scene:transition event should not throw error');
  }
})();

// Test 21: EventBus sound:toggle event toggles mute state
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  assertFalse(manager.isMuted(), 'Initial mute state is false');
  
  // Emit sound:toggle event
  eventBus.emit('sound:toggle');
  
  assertTrue(manager.isMuted(), 'sound:toggle event toggles mute to true');
  
  // Emit again
  eventBus.emit('sound:toggle');
  
  assertFalse(manager.isMuted(), 'sound:toggle event toggles mute back to false');
})();

// Test 22: EventBus sound:playing emitted when audio starts
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  let eventEmitted = false;
  let eventData = null;
  
  eventBus.on('sound:playing', (data) => {
    eventEmitted = true;
    eventData = data;
  });
  
  manager.playSound('test-sound', true, 0.5);
  
  setTimeout(() => {
    assertTrue(eventEmitted, 'sound:playing event emitted when audio starts');
    assertEqual(eventData.soundId, 'test-sound', 'Event contains correct soundId');
    assertEqual(eventData.volume, 0.5, 'Event contains correct volume');
  }, 50);
})();

// Test 23: EventBus sound:stopped emitted when audio ends
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  let eventEmitted = false;
  let eventData = null;
  
  eventBus.on('sound:stopped', (data) => {
    eventEmitted = true;
    eventData = data;
  });
  
  manager.playSound('stop-test');
  
  setTimeout(() => {
    manager.stopSound('stop-test');
    
    setTimeout(() => {
      assertTrue(eventEmitted, 'sound:stopped event emitted when audio ends');
      assertEqual(eventData.soundId, 'stop-test', 'Event contains correct soundId');
    }, 50);
  }, 50);
})();

// Test 24: EventBus sound:muted emitted when mute state changes
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  let eventCount = 0;
  let lastEventData = null;
  
  eventBus.on('sound:muted', (data) => {
    eventCount++;
    lastEventData = data;
  });
  
  manager.toggleMute();
  
  assertTrue(lastEventData.muted === true, 'sound:muted event emitted with muted=true');
  
  manager.toggleMute();
  
  assertEqual(eventCount, 2, 'sound:muted event emitted twice');
  assertFalse(lastEventData.muted, 'sound:muted event emitted with muted=false');
})();

// Test 25: EventBus sound:error emitted when audio fails to load
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  let eventEmitted = false;
  let eventData = null;
  
  eventBus.on('sound:error', (data) => {
    eventEmitted = true;
    eventData = data;
  });
  
  const audioElement = manager.createAudioElement('error-test');
  audioElement._triggerEvent('error', { message: 'Load failed' });
  
  setTimeout(() => {
    assertTrue(eventEmitted, 'sound:error event emitted when audio fails');
    assertEqual(eventData.soundId, 'error-test', 'Event contains correct soundId');
    assertTrue(eventData.error.includes('Failed to load'), 'Event contains error message');
  }, 50);
})();

// Test 26: EventBus sound:toggle affects active sounds
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  manager.playSound('toggle-test', true, 0.7);
  
  setTimeout(() => {
    const audioElement = manager.audioElements.get('toggle-test');
    assertEqual(audioElement.volume, 0.7, 'Initial volume is 0.7');
    
    // Emit sound:toggle to mute
    eventBus.emit('sound:toggle');
    
    assertEqual(audioElement.volume, 0, 'Volume set to 0 after sound:toggle');
    
    // Emit sound:toggle to unmute
    eventBus.emit('sound:toggle');
    
    assertEqual(audioElement.volume, 0.7, 'Volume restored to 0.7 after second sound:toggle');
  }, 50);
})();

// Test 27: EventBus sound:playing emitted during crossfade
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  let playingEvents = [];
  let stoppedEvents = [];
  
  eventBus.on('sound:playing', (data) => {
    playingEvents.push(data.soundId);
  });
  
  eventBus.on('sound:stopped', (data) => {
    stoppedEvents.push(data.soundId);
  });
  
  manager.playSound('crossfade-from');
  
  setTimeout(() => {
    // Clear the initial playing event
    playingEvents = [];
    
    manager.crossfade('crossfade-from', 'crossfade-to', 100);
    
    setTimeout(() => {
      assertTrue(playingEvents.includes('crossfade-to'), 'sound:playing emitted for new sound during crossfade');
      
      setTimeout(() => {
        assertTrue(stoppedEvents.includes('crossfade-from'), 'sound:stopped emitted for old sound after crossfade');
      }, 200);
    }, 100);
  }, 100);
})();

// Test 28: EventBus sound:error emitted during playSound failure
(() => {
  const eventBus = new EventBus();
  
  let errorEmitted = false;
  let errorData = null;
  
  eventBus.on('sound:error', (data) => {
    errorEmitted = true;
    errorData = data;
  });
  
  // Create a custom Audio class that fails on play
  const FailingAudio = class extends MockAudio {
    play() {
      this.paused = false;
      return Promise.reject(new Error('Playback failed'));
    }
  };
  
  // Temporarily replace Audio
  const originalAudio = window.Audio;
  window.Audio = FailingAudio;
  
  const manager = new AmbientSoundManager(eventBus);
  manager.playSound('fail-test');
  
  setTimeout(() => {
    assertTrue(errorEmitted, 'sound:error emitted when playSound fails');
    assertEqual(errorData.soundId, 'fail-test', 'Error event contains correct soundId');
    assertTrue(errorData.error.includes('Playback failed'), 'Error event contains error message');
    
    // Restore original Audio
    window.Audio = originalAudio;
  }, 100);
})();

// Test 29: EventBus sound:error emitted during crossfade failure
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  let errorEmitted = false;
  let errorData = null;
  
  eventBus.on('sound:error', (data) => {
    errorEmitted = true;
    errorData = data;
  });
  
  manager.playSound('crossfade-fail-from');
  
  setTimeout(() => {
    // Create a custom Audio class that fails on play
    const FailingAudio = class extends MockAudio {
      play() {
        this.paused = false;
        return Promise.reject(new Error('Crossfade playback failed'));
      }
    };
    
    // Temporarily replace Audio
    const originalAudio = window.Audio;
    window.Audio = FailingAudio;
    
    manager.crossfade('crossfade-fail-from', 'crossfade-fail-to', 100);
    
    setTimeout(() => {
      assertTrue(errorEmitted, 'sound:error emitted when crossfade fails');
      assertEqual(errorData.soundId, 'crossfade-fail-to', 'Error event contains correct soundId');
      
      // Restore original Audio
      window.Audio = originalAudio;
    }, 100);
  }, 100);
})();

// Test 30: Multiple EventBus listeners can subscribe to same event
(() => {
  const eventBus = new EventBus();
  const manager = new AmbientSoundManager(eventBus);
  
  let listener1Called = false;
  let listener2Called = false;
  
  eventBus.on('sound:playing', () => {
    listener1Called = true;
  });
  
  eventBus.on('sound:playing', () => {
    listener2Called = true;
  });
  
  manager.playSound('multi-listener-test');
  
  setTimeout(() => {
    assertTrue(listener1Called, 'First listener called for sound:playing');
    assertTrue(listener2Called, 'Second listener called for sound:playing');
  }, 100);
})();

// Wait for all async tests to complete before showing summary
setTimeout(() => {
  console.log('\n=== Test Summary ===');
  console.log(`Total: ${passedTests + failedTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);

  if (failedTests === 0) {
    console.log('\n✓ All AmbientSoundManager tests passed!\n');
  } else {
    console.log(`\n✗ ${failedTests} test(s) failed\n`);
  }
  
  // Restore original Audio
  window.Audio = OriginalAudio;
}, 1500);

export { passedTests, failedTests };
