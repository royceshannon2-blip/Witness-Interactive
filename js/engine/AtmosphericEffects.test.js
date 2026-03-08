/**
 * Unit Tests for AtmosphericEffects
 * 
 * Tests CSS-based visual effects manager for Pearl Harbor scenes.
 * Validates effect application, removal, multiple effects, and accessibility.
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 7.1
 */

import AtmosphericEffects from './AtmosphericEffects.js';
import EventBus from './EventBus.js';

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

/**
 * Test helper: Assert throws error
 */
function assertThrows(fn, message) {
  try {
    fn();
    console.error(`✗ ${message}`);
    console.error(`  Expected function to throw, but it didn't`);
    failedTests++;
    return false;
  } catch (error) {
    console.log(`✓ ${message}`);
    passedTests++;
    return true;
  }
}

/**
 * Test helper: Wait for async operations
 */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Clean up function
function cleanup() {
  document.body.className = '';
}

console.log('=== AtmosphericEffects Tests ===\n');

// Test 1: Constructor validation
console.log('--- Constructor Tests ---');
(() => {
  assertThrows(
    () => new AtmosphericEffects(),
    'Constructor should throw error if EventBus is not provided'
  );

  const eventBus = new EventBus();
  const effects = new AtmosphericEffects(eventBus);
  assertEqual(effects.config.defaultDuration, 2000, 'Should initialize with default duration of 2000ms');
  assertEqual(effects.config.respectMotionPrefs, true, 'Should respect motion preferences by default');
  cleanup();
})();

// Test 2: Custom config
(() => {
  const eventBus = new EventBus();
  const effects = new AtmosphericEffects(eventBus, {
    defaultDuration: 3000,
    respectMotionPrefs: false
  });
  assertEqual(effects.config.defaultDuration, 3000, 'Should accept custom duration');
  assertEqual(effects.config.respectMotionPrefs, false, 'Should accept custom motion preference setting');
  cleanup();
})();


// Test 3: Apply effect - basic functionality
console.log('\n--- applyEffect Tests ---');
(async () => {
  const eventBus = new EventBus();
  const effects = new AtmosphericEffects(eventBus, { respectMotionPrefs: false });
  
  effects.applyEffect('smoke');
  assertTrue(document.body.classList.contains('effect-smoke'), 'Should add CSS class to document.body');
  assertTrue(effects.isEffectActive('smoke'), 'Should track active effect');
  
  cleanup();
  effects.clearAllEffects();
})();

// Test 4: EventBus integration
(async () => {
  const eventBus = new EventBus();
  const effects = new AtmosphericEffects(eventBus, { respectMotionPrefs: false });
  
  let eventEmitted = false;
  let eventData = null;
  eventBus.on('effect:applied', (data) => {
    eventEmitted = true;
    eventData = data;
  });
  
  effects.applyEffect('explosion');
  assertTrue(eventEmitted, 'Should emit effect:applied event');
  assertEqual(eventData.effectName, 'explosion', 'Event should contain effect name');
  assertEqual(eventData.duration, 2000, 'Event should contain default duration');
  
  cleanup();
  effects.clearAllEffects();
})();

// Test 5: Custom duration
(async () => {
  const eventBus = new EventBus();
  const effects = new AtmosphericEffects(eventBus, { respectMotionPrefs: false });
  
  let eventData = null;
  eventBus.on('effect:applied', (data) => {
    eventData = data;
  });
  
  effects.applyEffect('fire', 5000);
  assertEqual(eventData.duration, 5000, 'Should use custom duration when provided');
  
  cleanup();
  effects.clearAllEffects();
})();

// Test 6: Multiple simultaneous effects
(async () => {
  const eventBus = new EventBus();
  const effects = new AtmosphericEffects(eventBus, { respectMotionPrefs: false });
  
  effects.applyEffect('smoke');
  effects.applyEffect('fire');
  
  assertTrue(document.body.classList.contains('effect-smoke'), 'Should support first effect');
  assertTrue(document.body.classList.contains('effect-fire'), 'Should support second effect');
  
  const activeEffects = effects.getActiveEffects();
  assertTrue(activeEffects.includes('smoke') && activeEffects.includes('fire'), 
    'Should track multiple active effects');
  
  cleanup();
  effects.clearAllEffects();
})();

// Test 7: Array of effects
(async () => {
  const eventBus = new EventBus();
  const effects = new AtmosphericEffects(eventBus, { respectMotionPrefs: false });
  
  effects.applyEffect(['smoke', 'fire', 'shake']);
  
  assertTrue(document.body.classList.contains('effect-smoke'), 'Should apply first effect from array');
  assertTrue(document.body.classList.contains('effect-fire'), 'Should apply second effect from array');
  assertTrue(document.body.classList.contains('effect-shake'), 'Should apply third effect from array');
  
  cleanup();
  effects.clearAllEffects();
})();

// Test 8: Auto-remove after duration
(async () => {
  const eventBus = new EventBus();
  const effects = new AtmosphericEffects(eventBus, { respectMotionPrefs: false });
  
  effects.applyEffect('explosion', 100);
  assertTrue(document.body.classList.contains('effect-explosion'), 'Effect should be active initially');
  
  await wait(150);
  assertFalse(document.body.classList.contains('effect-explosion'), 'Effect should be removed after duration');
  assertFalse(effects.isEffectActive('explosion'), 'Effect should not be tracked as active');
  
  cleanup();
})();


// Test 9: Remove effect
console.log('\n--- removeEffect Tests ---');
(async () => {
  const eventBus = new EventBus();
  const effects = new AtmosphericEffects(eventBus, { respectMotionPrefs: false });
  
  effects.applyEffect('ocean');
  assertTrue(document.body.classList.contains('effect-ocean'), 'Effect should be applied');
  
  let eventEmitted = false;
  eventBus.on('effect:removed', (data) => {
    eventEmitted = true;
    assertEqual(data.effectName, 'ocean', 'Event should contain effect name');
  });
  
  effects.removeEffect('ocean');
  assertFalse(document.body.classList.contains('effect-ocean'), 'Should remove CSS class from document.body');
  assertFalse(effects.isEffectActive('ocean'), 'Should clear timeout for effect');
  assertTrue(eventEmitted, 'Should emit effect:removed event');
  
  cleanup();
})();

// Test 10: Clear all effects
console.log('\n--- clearAllEffects Tests ---');
(async () => {
  const eventBus = new EventBus();
  const effects = new AtmosphericEffects(eventBus, { respectMotionPrefs: false });
  
  effects.applyEffect('smoke');
  effects.applyEffect('fire');
  effects.applyEffect('shake');
  
  assertEqual(effects.getActiveEffects().length, 3, 'Should have 3 active effects');
  
  effects.clearAllEffects();
  
  assertEqual(effects.getActiveEffects().length, 0, 'Should remove all active effects');
  assertFalse(document.body.classList.contains('effect-smoke'), 'Should remove smoke class');
  assertFalse(document.body.classList.contains('effect-fire'), 'Should remove fire class');
  assertFalse(document.body.classList.contains('effect-shake'), 'Should remove shake class');
  
  cleanup();
})();

// Test 11: Scene transition clears effects
console.log('\n--- EventBus Integration Tests ---');
(async () => {
  const eventBus = new EventBus();
  const effects = new AtmosphericEffects(eventBus, { respectMotionPrefs: false });
  
  effects.applyEffect('smoke');
  effects.applyEffect('fire');
  
  assertEqual(effects.getActiveEffects().length, 2, 'Should have 2 active effects');
  
  eventBus.emit('scene:transition', { sceneId: 'test-scene' });
  
  assertEqual(effects.getActiveEffects().length, 0, 'Should clear effects on scene:transition');
  assertFalse(document.body.classList.contains('effect-smoke'), 'Should remove smoke class');
  assertFalse(document.body.classList.contains('effect-fire'), 'Should remove fire class');
  
  cleanup();
})();

// Test 12: All supported effects
console.log('\n--- Supported Effects Tests ---');
(() => {
  const eventBus = new EventBus();
  const effects = new AtmosphericEffects(eventBus, { respectMotionPrefs: false });
  
  const supportedEffects = [
    'smoke', 'fire', 'shake', 'dawn', 'explosion',
    'aftermath', 'rain', 'ocean', 'ash'
  ];
  
  supportedEffects.forEach(effect => {
    effects.applyEffect(effect);
    assertTrue(
      document.body.classList.contains(`effect-${effect}`),
      `Should apply ${effect} effect`
    );
    
    effects.removeEffect(effect);
    assertFalse(
      document.body.classList.contains(`effect-${effect}`),
      `Should remove ${effect} effect`
    );
  });
  
  cleanup();
})();

// Test 13: Helper methods
console.log('\n--- Helper Methods Tests ---');
(() => {
  const eventBus = new EventBus();
  const effects = new AtmosphericEffects(eventBus, { respectMotionPrefs: false });
  
  assertFalse(effects.isEffectActive('rain'), 'isEffectActive should return false for inactive effects');
  
  effects.applyEffect('rain');
  assertTrue(effects.isEffectActive('rain'), 'isEffectActive should return true for active effects');
  
  effects.applyEffect('smoke');
  effects.applyEffect('fire');
  
  const activeEffects = effects.getActiveEffects();
  assertEqual(activeEffects.length, 3, 'getActiveEffects should return correct count');
  assertTrue(
    activeEffects.includes('rain') && activeEffects.includes('smoke') && activeEffects.includes('fire'),
    'getActiveEffects should return all active effect names'
  );
  
  cleanup();
  effects.clearAllEffects();
})();

// Summary
console.log('\n=== Test Summary ===');
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);
console.log(`Total: ${passedTests + failedTests}`);

if (failedTests === 0) {
  console.log('\n✓ All tests passed!');
} else {
  console.error(`\n✗ ${failedTests} test(s) failed`);
}
