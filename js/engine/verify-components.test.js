/**
 * Component Verification Test
 * 
 * This test verifies that the core engine components (EventBus, ConsequenceSystem, 
 * SceneStateMachine) load without errors and have no global variables.
 * 
 * Run this test by opening test-components.html in a browser and checking the console.
 */

import EventBus from './EventBus.js';
import ConsequenceSystem from './ConsequenceSystem.js';
import SceneStateMachine from './SceneStateMachine.js';

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

// Test 4: Check for global variables
console.log('\n4. Checking for global variables...');
const globalsBefore = Object.keys(window);
const suspiciousGlobals = globalsBefore.filter(key => {
  return key.includes('EventBus') || 
         key.includes('Consequence') || 
         key.includes('Scene') ||
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
