/**
 * TimedChoiceSystem Tests
 * 
 * Tests countdown timer functionality for urgent decisions.
 */

import TimedChoiceSystem from './TimedChoiceSystem.js';
import EventBus from './EventBus.js';

// Test suite
console.log('=== TimedChoiceSystem Tests ===\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✓ ${testName}`);
    passCount++;
  } else {
    console.error(`✗ ${testName}`);
    failCount++;
  }
}

// Test 1: Constructor initializes correctly
(() => {
  const eventBus = new EventBus();
  const system = new TimedChoiceSystem(eventBus, {
    warningThreshold: 3000,
    pulseInterval: 500
  });

  assert(system.eventBus === eventBus, 'Constructor stores EventBus reference');
  assert(system.config.warningThreshold === 3000, 'Constructor stores warningThreshold config');
  assert(system.config.pulseInterval === 500, 'Constructor stores pulseInterval config');
  assert(system.isActive === false, 'Constructor initializes isActive to false');
  assert(system.timerId === null, 'Constructor initializes timerId to null');
})();

// Test 2: startTimer initializes timer state
(() => {
  const eventBus = new EventBus();
  const system = new TimedChoiceSystem(eventBus);
  
  let timerStartedEmitted = false;
  eventBus.on('timer:started', (data) => {
    timerStartedEmitted = true;
    assert(data.duration === 5000, 'timer:started event includes duration');
    assert(data.defaultChoiceId === 'choice-a', 'timer:started event includes defaultChoiceId');
  });

  const onExpire = () => {};
  system.startTimer(5000, 'choice-a', onExpire);

  assert(system.isActive === true, 'startTimer sets isActive to true');
  assert(system.duration === 5000, 'startTimer stores duration');
  assert(system.defaultChoiceId === 'choice-a', 'startTimer stores defaultChoiceId');
  assert(system.onExpireCallback === onExpire, 'startTimer stores onExpire callback');
  assert(system.timerId !== null, 'startTimer creates interval');
  assert(timerStartedEmitted, 'startTimer emits timer:started event');

  system.cancelTimer();
})();

// Test 3: getRemainingTime returns correct value
(() => {
  const eventBus = new EventBus();
  const system = new TimedChoiceSystem(eventBus);

  // Before timer starts
  assert(system.getRemainingTime() === 0, 'getRemainingTime returns 0 when no timer active');

  // After timer starts
  system.startTimer(5000, 'choice-a', () => {});
  const remaining = system.getRemainingTime();
  assert(remaining > 4900 && remaining <= 5000, 'getRemainingTime returns correct initial value');

  system.cancelTimer();
})();

// Test 4: cancelTimer clears state and emits event
(() => {
  const eventBus = new EventBus();
  const system = new TimedChoiceSystem(eventBus);

  let timerCancelledEmitted = false;
  eventBus.on('timer:cancelled', () => {
    timerCancelledEmitted = true;
  });

  system.startTimer(5000, 'choice-a', () => {});
  system.cancelTimer();

  assert(system.isActive === false, 'cancelTimer sets isActive to false');
  assert(system.timerId === null, 'cancelTimer clears timerId');
  assert(system.startTime === null, 'cancelTimer clears startTime');
  assert(system.duration === null, 'cancelTimer clears duration');
  assert(system.defaultChoiceId === null, 'cancelTimer clears defaultChoiceId');
  assert(system.onExpireCallback === null, 'cancelTimer clears onExpireCallback');
  assert(timerCancelledEmitted, 'cancelTimer emits timer:cancelled event');
})();

// Test 5: Timer auto-selects default choice on expiration
(async () => {
  const eventBus = new EventBus();
  const system = new TimedChoiceSystem(eventBus);

  let expiredEmitted = false;
  let expireCallbackInvoked = false;
  let selectedChoiceId = null;

  eventBus.on('timer:expired', (data) => {
    expiredEmitted = true;
    assert(data.defaultChoiceId === 'choice-b', 'timer:expired event includes defaultChoiceId');
  });

  const onExpire = (choiceId) => {
    expireCallbackInvoked = true;
    selectedChoiceId = choiceId;
  };

  // Start timer with very short duration
  system.startTimer(200, 'choice-b', onExpire);

  // Wait for timer to expire
  await new Promise(resolve => setTimeout(resolve, 300));

  assert(expiredEmitted, 'Timer expiration emits timer:expired event');
  assert(expireCallbackInvoked, 'Timer expiration invokes onExpire callback');
  assert(selectedChoiceId === 'choice-b', 'Timer expiration passes correct choiceId to callback');
  assert(system.isActive === false, 'Timer expiration sets isActive to false');
})();

// Test 6: choice:made event cancels timer
(() => {
  const eventBus = new EventBus();
  const system = new TimedChoiceSystem(eventBus);

  system.startTimer(5000, 'choice-a', () => {});
  assert(system.isActive === true, 'Timer is active before choice:made event');

  eventBus.emit('choice:made', { choiceId: 'choice-b' });
  assert(system.isActive === false, 'choice:made event cancels timer');
})();

// Test 7: scene:transition event cancels timer
(() => {
  const eventBus = new EventBus();
  const system = new TimedChoiceSystem(eventBus);

  system.startTimer(5000, 'choice-a', () => {});
  assert(system.isActive === true, 'Timer is active before scene:transition event');

  eventBus.emit('scene:transition', { sceneId: 'next-scene' });
  assert(system.isActive === false, 'scene:transition event cancels timer');
})();

// Test 8: startTimer cancels existing timer
(() => {
  const eventBus = new EventBus();
  const system = new TimedChoiceSystem(eventBus);

  system.startTimer(5000, 'choice-a', () => {});
  const firstTimerId = system.timerId;

  system.startTimer(3000, 'choice-b', () => {});
  const secondTimerId = system.timerId;

  assert(firstTimerId !== secondTimerId, 'startTimer creates new interval');
  assert(system.duration === 3000, 'startTimer updates duration');
  assert(system.defaultChoiceId === 'choice-b', 'startTimer updates defaultChoiceId');

  system.cancelTimer();
})();

// Test 9: Parameter validation
(() => {
  const eventBus = new EventBus();
  const system = new TimedChoiceSystem(eventBus);

  // Invalid duration
  system.startTimer(-100, 'choice-a', () => {});
  assert(system.isActive === false, 'startTimer rejects negative duration');

  system.startTimer(0, 'choice-a', () => {});
  assert(system.isActive === false, 'startTimer rejects zero duration');

  // Invalid defaultChoiceId
  system.startTimer(5000, '', () => {});
  assert(system.isActive === false, 'startTimer rejects empty defaultChoiceId');

  system.startTimer(5000, null, () => {});
  assert(system.isActive === false, 'startTimer rejects null defaultChoiceId');

  // Invalid onExpire
  system.startTimer(5000, 'choice-a', null);
  assert(system.isActive === false, 'startTimer rejects null onExpire callback');

  system.startTimer(5000, 'choice-a', 'not-a-function');
  assert(system.isActive === false, 'startTimer rejects non-function onExpire');
})();

// Test 10: timer:update events are emitted during countdown
(async () => {
  const eventBus = new EventBus();
  const system = new TimedChoiceSystem(eventBus);

  let updateCount = 0;
  let lastUpdate = null;

  eventBus.on('timer:update', (data) => {
    updateCount++;
    lastUpdate = data;
  });

  system.startTimer(300, 'choice-a', () => {});

  // Wait for some updates
  await new Promise(resolve => setTimeout(resolve, 250));

  assert(updateCount > 0, 'timer:update events are emitted during countdown');
  assert(lastUpdate !== null, 'timer:update event includes data');
  assert(typeof lastUpdate.remaining === 'number', 'timer:update includes remaining time');
  assert(typeof lastUpdate.isWarning === 'boolean', 'timer:update includes isWarning flag');

  system.cancelTimer();
})();

// Test 11: Default config values
(() => {
  const eventBus = new EventBus();
  const system = new TimedChoiceSystem(eventBus);

  assert(system.config.warningThreshold === 3000, 'Default warningThreshold is 3000ms');
  assert(system.config.pulseInterval === 500, 'Default pulseInterval is 500ms');
})();

// Test 12: cancelTimer is safe to call multiple times
(() => {
  const eventBus = new EventBus();
  const system = new TimedChoiceSystem(eventBus);

  system.startTimer(5000, 'choice-a', () => {});
  system.cancelTimer();
  system.cancelTimer(); // Should not throw error
  system.cancelTimer(); // Should not throw error

  assert(system.isActive === false, 'Multiple cancelTimer calls are safe');
})();

// Summary
console.log('\n=== Test Summary ===');
console.log(`Passed: ${passCount}`);
console.log(`Failed: ${failCount}`);
console.log(`Total: ${passCount + failCount}`);

if (failCount === 0) {
  console.log('\n✓ All tests passed!');
} else {
  console.error(`\n✗ ${failCount} test(s) failed`);
}
