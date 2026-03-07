/**
 * UIController Unit Tests
 * 
 * Tests the UIController component for proper DOM manipulation,
 * screen rendering, and EventBus integration.
 */

import EventBus from './EventBus.js';
import UIController from './UIController.js';

// Test suite
const testOutput = [];
function log(msg) {
  console.log(msg);
  testOutput.push(msg);
}

log('=== UIController Tests ===\n');

// Setup test environment
function setupTestDOM() {
  // Create app container if it doesn't exist
  let appContainer = document.getElementById('app');
  if (!appContainer) {
    appContainer = document.createElement('div');
    appContainer.id = 'app';
    document.body.appendChild(appContainer);
  }
  
  // Clear any existing content
  appContainer.innerHTML = '';
  
  return appContainer;
}

// Test 1: UIController initialization
function testInitialization() {
  log('Test 1: UIController initialization');
  
  const appContainer = setupTestDOM();
  const eventBus = new EventBus();
  const uiController = new UIController(eventBus);
  
  if (uiController.eventBus === eventBus) {
    log('✓ EventBus reference stored correctly');
  } else {
    log('✗ EventBus reference not stored');
  }
  
  if (uiController.appContainer === appContainer) {
    log('✓ App container reference stored correctly');
  } else {
    log('✗ App container reference not stored');
  }
  
  if (uiController.currentScreen === 'loading') {
    log('✓ Initial screen set to loading');
  } else {
    log('✗ Initial screen not set correctly');
  }
  
  log('');
}

// Test 2: Show landing screen
function testShowLandingScreen() {
  console.log('Test 2: Show landing screen');
  
  setupTestDOM();
  const eventBus = new EventBus();
  const uiController = new UIController(eventBus);
  
  uiController.showScreen('landing');
  
  const landingScreen = document.getElementById('landing-screen');
  if (landingScreen) {
    console.log('✓ Landing screen created');
  } else {
    console.error('✗ Landing screen not created');
  }
  
  if (landingScreen && landingScreen.classList.contains('active')) {
    console.log('✓ Landing screen is active');
  } else {
    console.error('✗ Landing screen not active');
  }
  
  const beginButton = document.getElementById('begin-button');
  if (beginButton) {
    console.log('✓ Begin button exists');
  } else {
    console.error('✗ Begin button not found');
  }
  
  console.log('');
}

// Test 3: Scene rendering
function testSceneRendering() {
  console.log('Test 3: Scene rendering');
  
  setupTestDOM();
  const eventBus = new EventBus();
  const uiController = new UIController(eventBus);
  
  // Create test scene
  const testScene = {
    id: 'test-scene-01',
    narrative: 'This is a test narrative.',
    apThemes: ['causation', 'perspective'],
    choices: [
      {
        id: 'choice-01',
        text: 'Choice 1',
        nextScene: 'test-scene-02',
        consequences: { test_flag: true }
      },
      {
        id: 'choice-02',
        text: 'Choice 2',
        nextScene: 'test-scene-03',
        consequences: { test_flag: false }
      }
    ],
    atmosphericEffect: null
  };
  
  uiController.renderScene(testScene, 0, 5);
  
  const sceneScreen = document.getElementById('scene-screen');
  if (sceneScreen) {
    console.log('✓ Scene screen created');
  } else {
    console.error('✗ Scene screen not created');
  }
  
  const narrativeContainer = document.getElementById('scene-narrative');
  if (narrativeContainer && narrativeContainer.textContent.includes('This is a test narrative')) {
    console.log('✓ Scene narrative rendered correctly');
  } else {
    console.error('✗ Scene narrative not rendered');
  }
  
  const choiceButtons = document.querySelectorAll('.choice-button');
  if (choiceButtons.length === 2) {
    console.log('✓ Choice buttons rendered (2 choices)');
  } else {
    console.error(`✗ Expected 2 choice buttons, found ${choiceButtons.length}`);
  }
  
  const progressContainer = document.getElementById('scene-progress');
  if (progressContainer && progressContainer.textContent.includes('Scene 1 of 5')) {
    console.log('✓ Progress indicator rendered correctly');
  } else {
    console.error('✗ Progress indicator not rendered correctly');
  }
  
  console.log('');
}

// Test 4: EventBus integration - game:start
function testGameStartEvent() {
  console.log('Test 4: EventBus integration - game:start');
  
  setupTestDOM();
  const eventBus = new EventBus();
  const uiController = new UIController(eventBus);
  
  // Emit game:start event
  eventBus.emit('game:start');
  
  const landingScreen = document.getElementById('landing-screen');
  if (landingScreen && landingScreen.classList.contains('active')) {
    console.log('✓ game:start event shows landing screen');
  } else {
    console.error('✗ game:start event did not show landing screen');
  }
  
  console.log('');
}

// Test 5: EventBus integration - scene:transition
function testSceneTransitionEvent() {
  console.log('Test 5: EventBus integration - scene:transition');
  
  setupTestDOM();
  const eventBus = new EventBus();
  const uiController = new UIController(eventBus);
  
  const testScene = {
    id: 'test-scene-01',
    narrative: 'Test narrative for scene transition.',
    apThemes: ['causation'],
    choices: [
      {
        id: 'choice-01',
        text: 'Test choice',
        nextScene: 'test-scene-02',
        consequences: {}
      }
    ],
    atmosphericEffect: null
  };
  
  // Emit scene:transition event
  eventBus.emit('scene:transition', {
    sceneId: testScene.id,
    sceneIndex: 0,
    totalScenes: 3,
    scene: testScene
  });
  
  const narrativeContainer = document.getElementById('scene-narrative');
  if (narrativeContainer && narrativeContainer.textContent.includes('Test narrative for scene transition')) {
    console.log('✓ scene:transition event renders scene correctly');
  } else {
    console.error('✗ scene:transition event did not render scene');
  }
  
  console.log('');
}

// Test 6: Progress indicator update
function testProgressUpdate() {
  console.log('Test 6: Progress indicator update');
  
  setupTestDOM();
  const eventBus = new EventBus();
  const uiController = new UIController(eventBus);
  
  // Create scene screen first
  uiController.showScreen('scene');
  
  // Update progress
  uiController.updateProgress(3, 5);
  
  const progressContainer = document.getElementById('scene-progress');
  if (progressContainer && progressContainer.textContent.includes('Scene 3 of 5')) {
    console.log('✓ Progress indicator updates correctly');
  } else {
    console.error('✗ Progress indicator not updated correctly');
  }
  
  const progressFill = document.querySelector('.progress-fill');
  if (progressFill && progressFill.style.width === '60%') {
    console.log('✓ Progress bar width calculated correctly (60%)');
  } else {
    console.error('✗ Progress bar width not calculated correctly');
  }
  
  console.log('');
}

// Test 7: Invalid screen name handling
function testInvalidScreenName() {
  console.log('Test 7: Invalid screen name handling');
  
  setupTestDOM();
  const eventBus = new EventBus();
  const uiController = new UIController(eventBus);
  
  // Capture console errors
  const originalError = console.error;
  let errorCaught = false;
  console.error = (msg) => {
    if (msg.includes('Invalid screen name')) {
      errorCaught = true;
    }
  };
  
  uiController.showScreen('invalid-screen');
  
  console.error = originalError;
  
  if (errorCaught) {
    console.log('✓ Invalid screen name logged error');
  } else {
    console.error('✗ Invalid screen name did not log error');
  }
  
  console.log('');
}

// Test 8: Atmospheric effects
function testAtmosphericEffects() {
  console.log('Test 8: Atmospheric effects');
  
  setupTestDOM();
  const eventBus = new EventBus();
  const uiController = new UIController(eventBus);
  
  // Test smoke effect
  uiController.applyEffect('smoke');
  if (document.body.classList.contains('effect-smoke')) {
    console.log('✓ Smoke effect applied to body');
  } else {
    console.error('✗ Smoke effect not applied');
  }
  
  // Wait for effect to be removed (2 seconds in real implementation, but we'll check immediately)
  // In a real test, we'd use setTimeout or a testing framework with async support
  
  // Test fire effect
  document.body.classList.remove('effect-smoke');
  uiController.applyEffect('fire');
  if (document.body.classList.contains('effect-fire')) {
    console.log('✓ Fire effect applied to body');
  } else {
    console.error('✗ Fire effect not applied');
  }
  
  // Test shake effect
  document.body.classList.remove('effect-fire');
  uiController.applyEffect('shake');
  if (document.body.classList.contains('effect-shake')) {
    console.log('✓ Shake effect applied to body');
  } else {
    console.error('✗ Shake effect not applied');
  }
  
  // Clean up
  document.body.classList.remove('effect-shake');
  
  console.log('');
}

// Run all tests
testInitialization();
testShowLandingScreen();
testSceneRendering();
testGameStartEvent();
testSceneTransitionEvent();
testProgressUpdate();
testInvalidScreenName();
testAtmosphericEffects();

log('=== All UIController Tests Complete ===');

// Display results in test output div
const outputDiv = document.getElementById('test-output');
if (outputDiv) {
  outputDiv.textContent = testOutput.join('\n');
}
