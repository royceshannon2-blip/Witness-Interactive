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

// Mock UI content for tests
const mockUIContent = {
  landing: {
    title: "Test Title",
    subtitle: "Test Subtitle",
    tagline: "Test Tagline",
    context: "Test Context",
    buttonText: "Test Button"
  },
  timeline: {
    title: "Timeline Title",
    subtitle: "Timeline Subtitle"
  },
  roleSelection: {
    title: "Role Selection",
    subtitle: "Choose Role",
    endingsLabel: "Endings:",
    allRolesCompletedTitle: "All Complete",
    allRolesCompletedMessage: "All roles completed"
  },
  outcome: {
    title: "Outcome",
    buttonText: "Continue"
  },
  historicalRipple: {
    title: "Historical Ripple",
    subtitle: "Ripple Subtitle",
    buttonText: "Continue",
    apThemeLabel: "AP Theme:"
  },
  knowledgeCheckpoint: {
    title: "Checkpoint",
    subtitle: "Test your knowledge",
    buttonText: "View Results"
  },
  resultsCard: {
    title: "Results",
    copyButtonText: "Copy",
    playAgainButtonText: "Play Again"
  },
  progress: {
    sceneLabel: "Scene"
  }
};

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
  const uiController = new UIController(eventBus, null, null, null, null, mockUIContent);
  
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
  const uiController = new UIController(eventBus, null, null, null, null, mockUIContent);
  
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
  const uiController = new UIController(eventBus, null, null, null, null, mockUIContent);
  
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
  const uiController = new UIController(eventBus, null, null, null, null, mockUIContent);
  
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
  const uiController = new UIController(eventBus, null, null, null, null, mockUIContent);
  
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
  const uiController = new UIController(eventBus, null, null, null, null, mockUIContent);
  
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
  const uiController = new UIController(eventBus, null, null, null, null, mockUIContent);
  
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
  const uiController = new UIController(eventBus, null, null, null, null, mockUIContent);
  
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

// Test 9: Enable and disable choices
function testEnableDisableChoices() {
  console.log('Test 9: Enable and disable choices');
  
  setupTestDOM();
  const eventBus = new EventBus();
  const uiController = new UIController(eventBus, null, null, null, null, mockUIContent);
  
  // Create test scene with choices
  const testScene = {
    id: 'test-scene-01',
    narrative: 'Test narrative.',
    apThemes: ['causation'],
    choices: [
      {
        id: 'choice-01',
        text: 'Choice 1',
        nextScene: 'test-scene-02',
        consequences: {}
      },
      {
        id: 'choice-02',
        text: 'Choice 2',
        nextScene: 'test-scene-03',
        consequences: {}
      }
    ],
    atmosphericEffect: null
  };
  
  // Render scene (choices should be disabled initially)
  uiController.renderScene(testScene, 0, 3);
  
  const choiceButtons = document.querySelectorAll('.choice-button');
  
  // Check that choices are initially disabled
  let allDisabled = true;
  choiceButtons.forEach(button => {
    if (!button.disabled || button.style.pointerEvents !== 'none' || button.style.opacity !== '0.5') {
      allDisabled = false;
    }
  });
  
  if (allDisabled && choiceButtons.length === 2) {
    console.log('✓ Choices are disabled initially after renderScene');
  } else {
    console.error('✗ Choices are not properly disabled initially');
  }
  
  // Test enableChoices method
  uiController.enableChoices();
  
  let allEnabled = true;
  choiceButtons.forEach(button => {
    if (button.disabled || button.style.pointerEvents !== 'auto' || button.style.opacity !== '1') {
      allEnabled = false;
    }
  });
  
  if (allEnabled) {
    console.log('✓ enableChoices() enables all choice buttons');
  } else {
    console.error('✗ enableChoices() did not enable all buttons');
  }
  
  // Test disableChoices method
  uiController.disableChoices();
  
  allDisabled = true;
  choiceButtons.forEach(button => {
    if (!button.disabled || button.style.pointerEvents !== 'none' || button.style.opacity !== '0.5') {
      allDisabled = false;
    }
  });
  
  if (allDisabled) {
    console.log('✓ disableChoices() disables all choice buttons');
  } else {
    console.error('✗ disableChoices() did not disable all buttons');
  }
  
  console.log('');
}

// Test 10: TypewriterEffect integration with choices
function testTypewriterIntegration() {
  console.log('Test 10: TypewriterEffect integration with choices');
  
  setupTestDOM();
  const eventBus = new EventBus();
  
  // Create mock TypewriterEffect
  let revealTextCalled = false;
  let completionCallback = null;
  const mockTypewriter = {
    revealText: (element, text, speed, onComplete) => {
      revealTextCalled = true;
      completionCallback = onComplete;
    }
  };
  
  const uiController = new UIController(
    eventBus,
    null, // timelineSelector
    null, // missionRegistry
    null, // consequenceSystem
    null, // resultsCard
    mockUIContent, // uiContent
    { typewriterEffect: mockTypewriter }
  );
  
  const testScene = {
    id: 'test-scene-01',
    narrative: 'Test narrative with typewriter.',
    apThemes: ['causation'],
    choices: [
      {
        id: 'choice-01',
        text: 'Choice 1',
        nextScene: 'test-scene-02',
        consequences: {}
      }
    ],
    atmosphericEffect: null
  };
  
  uiController.renderScene(testScene, 0, 3);
  
  if (revealTextCalled) {
    console.log('✓ TypewriterEffect.revealText() called when rendering scene');
  } else {
    console.error('✗ TypewriterEffect.revealText() not called');
  }
  
  // Verify choices are disabled before typewriter completes
  const choiceButtons = document.querySelectorAll('.choice-button');
  let allDisabled = true;
  choiceButtons.forEach(button => {
    if (!button.disabled) {
      allDisabled = false;
    }
  });
  
  if (allDisabled) {
    console.log('✓ Choices disabled while typewriter is active');
  } else {
    console.error('✗ Choices not disabled during typewriter');
  }
  
  // Simulate typewriter completion
  if (completionCallback) {
    completionCallback();
  }
  
  // Verify choices are enabled after typewriter completes
  let allEnabled = true;
  choiceButtons.forEach(button => {
    if (button.disabled) {
      allEnabled = false;
    }
  });
  
  if (allEnabled) {
    console.log('✓ Choices enabled after typewriter completion callback');
  } else {
    console.error('✗ Choices not enabled after typewriter completion');
  }
  
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
testEnableDisableChoices();
testTypewriterIntegration();

log('=== All UIController Tests Complete ===');

// Display results in test output div
const outputDiv = document.getElementById('test-output');
if (outputDiv) {
  outputDiv.textContent = testOutput.join('\n');
}

// Test: Sound toggle button integration
function testSoundToggleIntegration() {
  log('\nTest: Sound toggle button integration');
  
  const appContainer = setupTestDOM();
  
  // Create sound toggle button in DOM
  const soundToggleButton = document.createElement('button');
  soundToggleButton.id = 'sound-toggle';
  soundToggleButton.disabled = true;
  soundToggleButton.setAttribute('aria-label', 'Sound toggle (coming soon)');
  
  const soundIcon = document.createElement('span');
  soundIcon.className = 'sound-icon';
  soundIcon.textContent = '🔇';
  soundToggleButton.appendChild(soundIcon);
  
  document.body.appendChild(soundToggleButton);
  
  const eventBus = new EventBus();
  
  // Create mock AmbientSoundManager
  const mockAmbientSoundManager = {
    muted: false,
    isMuted() {
      return this.muted;
    },
    toggleMute() {
      this.muted = !this.muted;
      eventBus.emit('sound:muted', { muted: this.muted });
    }
  };
  
  // Listen for sound:toggle event
  let soundToggleEmitted = false;
  eventBus.on('sound:toggle', () => {
    soundToggleEmitted = true;
    mockAmbientSoundManager.toggleMute();
  });
  
  // Create UIController with AmbientSoundManager
  const uiController = new UIController(
    eventBus,
    null,
    null,
    null,
    null,
    mockUIContent,
    { ambientSoundManager: mockAmbientSoundManager }
  );
  
  // Test 1: Button should be enabled
  if (!soundToggleButton.disabled) {
    log('✓ Sound toggle button enabled when AmbientSoundManager provided');
  } else {
    log('✗ Sound toggle button not enabled');
  }
  
  // Test 2: Initial icon should be unmuted
  if (soundIcon.textContent === '🔊') {
    log('✓ Initial icon is unmuted (🔊)');
  } else {
    log('✗ Initial icon incorrect: ' + soundIcon.textContent);
  }
  
  // Test 3: Click button to mute
  soundToggleButton.click();
  
  if (soundToggleEmitted) {
    log('✓ sound:toggle event emitted on button click');
  } else {
    log('✗ sound:toggle event not emitted');
  }
  
  // Test 4: Icon should change to muted
  if (soundIcon.textContent === '🔇') {
    log('✓ Icon changed to muted (🔇) after click');
  } else {
    log('✗ Icon not changed: ' + soundIcon.textContent);
  }
  
  // Test 5: Aria-label should update
  const ariaLabel = soundToggleButton.getAttribute('aria-label');
  if (ariaLabel.includes('muted')) {
    log('✓ Aria-label updated to indicate muted state');
  } else {
    log('✗ Aria-label not updated: ' + ariaLabel);
  }
  
  // Test 6: Click again to unmute
  soundToggleEmitted = false;
  soundToggleButton.click();
  
  if (soundToggleEmitted) {
    log('✓ sound:toggle event emitted on second click');
  } else {
    log('✗ sound:toggle event not emitted on second click');
  }
  
  // Test 7: Icon should change back to unmuted
  if (soundIcon.textContent === '🔊') {
    log('✓ Icon changed back to unmuted (🔊)');
  } else {
    log('✗ Icon not changed back: ' + soundIcon.textContent);
  }
  
  // Test 8: Button remains disabled without AmbientSoundManager
  document.body.removeChild(soundToggleButton);
  
  const soundToggleButton2 = document.createElement('button');
  soundToggleButton2.id = 'sound-toggle';
  soundToggleButton2.disabled = true;
  document.body.appendChild(soundToggleButton2);
  
  const uiController2 = new UIController(
    new EventBus(),
    null,
    null,
    null,
    null,
    mockUIContent,
    {} // No AmbientSoundManager
  );
  
  if (soundToggleButton2.disabled) {
    log('✓ Button remains disabled without AmbientSoundManager');
  } else {
    log('✗ Button should remain disabled without AmbientSoundManager');
  }
  
  // Cleanup
  document.body.removeChild(soundToggleButton2);
  
  log('Sound toggle integration tests complete\n');
}

// Run the new test
testSoundToggleIntegration();
