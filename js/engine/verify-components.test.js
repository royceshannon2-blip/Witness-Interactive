/**
 * Component Verification Test
 * 
 * This test verifies that the core engine components (EventBus, ConsequenceSystem, 
 * SceneStateMachine, TypewriterEffect, SceneTransition, AtmosphericEffects, 
 * TimedChoiceSystem) load without errors and have no global variables.
 * 
 * Run this test by opening test-components.html in a browser and checking the console.
 */

import EventBus from './EventBus.js';
import ConsequenceSystem from './ConsequenceSystem.js';
import SceneStateMachine from './SceneStateMachine.js';
import TypewriterEffect from './TypewriterEffect.js';
import SceneTransition from './SceneTransition.js';
import AtmosphericEffects from './AtmosphericEffects.js';
import TimedChoiceSystem from './TimedChoiceSystem.js';

console.log('=== Component Verification Test ===');

// Test 1: Verify EventBus loads and instantiates
console.log('\n1. Testing EventBus...');
try {
  const eventBus = new EventBus();
  console.log('✓ EventBus instantiated successfully');
  
  // Test basic pub/sub
  let testPassed = false;
  eventBus.on('test:event', (data) => {
    if (data.value === 'test') {
      testPassed = true;
    }
  });
  eventBus.emit('test:event', { value: 'test' });
  
  if (testPassed) {
    console.log('✓ EventBus pub/sub working correctly');
  } else {
    console.error('✗ EventBus pub/sub failed');
  }
} catch (error) {
  console.error('✗ EventBus failed to load:', error);
}

// Test 2: Verify ConsequenceSystem loads and instantiates
console.log('\n2. Testing ConsequenceSystem...');
try {
  const eventBus = new EventBus();
  const consequenceSystem = new ConsequenceSystem(eventBus);
  console.log('✓ ConsequenceSystem instantiated successfully');
  
  // Test flag setting and retrieval
  consequenceSystem.setFlag('test_flag', true);
  const flagValue = consequenceSystem.getFlag('test_flag');
  
  if (flagValue === true) {
    console.log('✓ ConsequenceSystem flag operations working correctly');
  } else {
    console.error('✗ ConsequenceSystem flag operations failed');
  }
  
  // Test numeric flags
  consequenceSystem.setFlag('numeric_flag', 42);
  const numericValue = consequenceSystem.getFlag('numeric_flag');
  
  if (numericValue === 42) {
    console.log('✓ ConsequenceSystem numeric flags working correctly');
  } else {
    console.error('✗ ConsequenceSystem numeric flags failed');
  }
} catch (error) {
  console.error('✗ ConsequenceSystem failed to load:', error);
}

// Test 3: Verify SceneStateMachine loads and instantiates
console.log('\n3. Testing SceneStateMachine...');
try {
  const eventBus = new EventBus();
  const sceneStateMachine = new SceneStateMachine(eventBus);
  console.log('✓ SceneStateMachine instantiated successfully');
  
  // Test scene loading with valid scene data
  const testScenes = [
    {
      id: 'test-scene-1',
      narrative: 'This is a test scene.',
      apThemes: ['causation'],
      choices: [
        {
          id: 'choice-1',
          text: 'Test choice',
          consequences: { test_flag: true },
          nextScene: 'test-scene-2'
        }
      ],
      atmosphericEffect: null
    },
    {
      id: 'test-scene-2',
      narrative: 'This is the second test scene.',
      apThemes: ['perspective'],
      choices: [],
      atmosphericEffect: null
    }
  ];
  
  sceneStateMachine.loadRole('test-mission', 'test-role', testScenes);
  const currentScene = sceneStateMachine.getCurrentScene();
  
  if (currentScene && currentScene.id === 'test-scene-1') {
    console.log('✓ SceneStateMachine scene loading working correctly');
  } else {
    console.error('✗ SceneStateMachine scene loading failed');
  }
} catch (error) {
  console.error('✗ SceneStateMachine failed to load:', error);
}

// Test 4: Verify TypewriterEffect loads and instantiates
console.log('\n4. Testing TypewriterEffect...');
try {
  const eventBus = new EventBus();
  const typewriterEffect = new TypewriterEffect(eventBus, {
    defaultSpeed: 30,
    skipOnClick: true,
    respectMotionPrefs: true
  });
  console.log('✓ TypewriterEffect instantiated successfully');
  
  // Test that it has the expected methods
  if (typeof typewriterEffect.revealText === 'function' &&
      typeof typewriterEffect.skipToEnd === 'function' &&
      typeof typewriterEffect.isActive === 'function') {
    console.log('✓ TypewriterEffect has required methods');
  } else {
    console.error('✗ TypewriterEffect missing required methods');
  }
  
  // Test EventBus integration - verify it listens to scene:transition
  let transitionHandled = false;
  const originalCleanup = typewriterEffect.cleanup.bind(typewriterEffect);
  typewriterEffect.cleanup = () => {
    transitionHandled = true;
    originalCleanup();
  };
  
  eventBus.emit('scene:transition');
  
  if (transitionHandled) {
    console.log('✓ TypewriterEffect responds to EventBus scene:transition');
  } else {
    console.error('✗ TypewriterEffect does not respond to EventBus events');
  }
} catch (error) {
  console.error('✗ TypewriterEffect failed to load:', error);
}

// Test 5: Verify SceneTransition loads and instantiates
console.log('\n5. Testing SceneTransition...');
try {
  const eventBus = new EventBus();
  const sceneTransition = new SceneTransition(eventBus, {
    defaultType: 'fade',
    duration: 500,
    respectMotionPrefs: true
  });
  console.log('✓ SceneTransition instantiated successfully');
  
  // Test that it has the expected methods
  if (typeof sceneTransition.transition === 'function' &&
      typeof sceneTransition.isActive === 'function') {
    console.log('✓ SceneTransition has required methods');
  } else {
    console.error('✗ SceneTransition missing required methods');
  }
  
  // Test EventBus integration - verify it emits transition events
  let transitionStarted = false;
  let transitionCompleted = false;
  
  eventBus.on('transition:start', () => {
    transitionStarted = true;
  });
  
  eventBus.on('transition:complete', () => {
    transitionCompleted = true;
  });
  
  // Trigger a transition with type 'none' for instant completion
  sceneTransition.transition(null, null, 'none', 0);
  
  if (transitionStarted && transitionCompleted) {
    console.log('✓ SceneTransition emits EventBus events correctly');
  } else {
    console.error('✗ SceneTransition does not emit EventBus events correctly');
  }
} catch (error) {
  console.error('✗ SceneTransition failed to load:', error);
}

// Test 6: Verify AtmosphericEffects loads and instantiates
console.log('\n6. Testing AtmosphericEffects...');
try {
  const eventBus = new EventBus();
  const atmosphericEffects = new AtmosphericEffects(eventBus, {
    defaultDuration: 2000,
    respectMotionPrefs: false // Disable for testing
  });
  console.log('✓ AtmosphericEffects instantiated successfully');
  
  // Test that it has the expected methods
  if (typeof atmosphericEffects.applyEffect === 'function' &&
      typeof atmosphericEffects.removeEffect === 'function' &&
      typeof atmosphericEffects.clearAllEffects === 'function' &&
      typeof atmosphericEffects.isEffectActive === 'function' &&
      typeof atmosphericEffects.getActiveEffects === 'function') {
    console.log('✓ AtmosphericEffects has required methods');
  } else {
    console.error('✗ AtmosphericEffects missing required methods');
  }
  
  // Test effect application
  atmosphericEffects.applyEffect('smoke');
  if (document.body.classList.contains('effect-smoke')) {
    console.log('✓ AtmosphericEffects applies CSS classes correctly');
  } else {
    console.error('✗ AtmosphericEffects does not apply CSS classes');
  }
  
  // Clean up
  atmosphericEffects.clearAllEffects();
  
  // Test EventBus integration
  let effectApplied = false;
  eventBus.on('effect:applied', () => {
    effectApplied = true;
  });
  
  atmosphericEffects.applyEffect('fire');
  
  if (effectApplied) {
    console.log('✓ AtmosphericEffects emits EventBus events correctly');
  } else {
    console.error('✗ AtmosphericEffects does not emit EventBus events');
  }
  
  // Clean up
  atmosphericEffects.clearAllEffects();
} catch (error) {
  console.error('✗ AtmosphericEffects failed to load:', error);
}

// Test 7: Verify TimedChoiceSystem loads and instantiates
console.log('\n7. Testing TimedChoiceSystem...');
try {
  const eventBus = new EventBus();
  const timedChoiceSystem = new TimedChoiceSystem(eventBus, {
    warningThreshold: 3000,
    pulseInterval: 500
  });
  console.log('✓ TimedChoiceSystem instantiated successfully');
  
  // Test that it has the expected methods
  if (typeof timedChoiceSystem.startTimer === 'function' &&
      typeof timedChoiceSystem.cancelTimer === 'function' &&
      typeof timedChoiceSystem.getRemainingTime === 'function') {
    console.log('✓ TimedChoiceSystem has required methods');
  } else {
    console.error('✗ TimedChoiceSystem missing required methods');
  }
  
  // Test EventBus integration - verify it emits timer events
  let timerStarted = false;
  let timerExpired = false;
  
  eventBus.on('timer:started', () => {
    timerStarted = true;
  });
  
  eventBus.on('timer:expired', () => {
    timerExpired = true;
  });
  
  // Start a very short timer (100ms) to test expiration
  let callbackInvoked = false;
  timedChoiceSystem.startTimer(100, 'test-choice', (choiceId) => {
    callbackInvoked = true;
  });
  
  if (timerStarted) {
    console.log('✓ TimedChoiceSystem emits timer:started event');
  } else {
    console.error('✗ TimedChoiceSystem does not emit timer:started event');
  }
  
  // Wait for timer to expire
  setTimeout(() => {
    if (timerExpired) {
      console.log('✓ TimedChoiceSystem emits timer:expired event');
    } else {
      console.error('✗ TimedChoiceSystem does not emit timer:expired event');
    }
    
    if (callbackInvoked) {
      console.log('✓ TimedChoiceSystem invokes callback on expiration');
    } else {
      console.error('✗ TimedChoiceSystem does not invoke callback');
    }
  }, 200);
} catch (error) {
  console.error('✗ TimedChoiceSystem failed to load:', error);
}

// Test 8: Check for global variables
console.log('\n8. Checking for global variables...');
const globalsBefore = Object.keys(window);
const suspiciousGlobals = globalsBefore.filter(key => {
  return key.includes('EventBus') || 
         key.includes('Consequence') || 
         key.includes('Scene') ||
         key.includes('Typewriter') ||
         key.includes('Transition') ||
         key.includes('Atmospheric') ||
         key.includes('TimedChoice') ||
         key.includes('witness') ||
         key.includes('game');
});

if (suspiciousGlobals.length === 0) {
  console.log('✓ No global variables detected from engine components');
} else {
  console.warn('⚠ Potential global variables detected:', suspiciousGlobals);
}

console.log('\n=== Component Verification Complete ===');
console.log('Check the console output above for any errors or warnings.');
