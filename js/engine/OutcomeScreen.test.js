/**
 * Outcome Screen Logic Tests
 * 
 * Tests the outcome screen population logic in UIController.
 * Verifies that ConsequenceSystem.calculateOutcome() correctly determines
 * outcomes based on consequence flags, and that UIController properly
 * displays survival status and epilogue.
 * 
 * Task 13.2: Create outcome screen logic
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

import EventBus from './EventBus.js';
import ConsequenceSystem from './ConsequenceSystem.js';
import UIController from './UIController.js';
import MissionRegistry from '../content/MissionRegistry.js';
import TimelineSelector from './TimelineSelector.js';
import pearlHarborMission from '../content/missions/pearl-harbor/mission.js';
import uiContent from '../content/ui-content.js';

// Test output
const testResults = [];
function log(msg) {
  console.log(msg);
  testResults.push(msg);
}

log('=== Outcome Screen Logic Tests ===\n');

// Setup test environment
function setupTestEnvironment() {
  // Create app container
  let appContainer = document.getElementById('app');
  if (!appContainer) {
    appContainer = document.createElement('div');
    appContainer.id = 'app';
    document.body.appendChild(appContainer);
  }
  appContainer.innerHTML = '';
  
  // Initialize components
  const eventBus = new EventBus();
  const consequenceSystem = new ConsequenceSystem(eventBus);
  const missionRegistry = new MissionRegistry();
  const timelineSelector = new TimelineSelector(eventBus, missionRegistry);
  const uiController = new UIController(eventBus, timelineSelector, missionRegistry, consequenceSystem, uiContent);
  
  // Register Pearl Harbor mission
  missionRegistry.register(pearlHarborMission);
  
  return { eventBus, consequenceSystem, missionRegistry, uiController };
}

// Test 1: ConsequenceSystem.calculateOutcome() with matching conditions
function testCalculateOutcomeWithMatch() {
  log('Test 1: ConsequenceSystem.calculateOutcome() with matching conditions');
  
  const { consequenceSystem } = setupTestEnvironment();
  
  // Set up test outcome rules
  const outcomeRules = [
    {
      id: 'outcome-hero',
      conditions: {
        saved_others: true,
        rescued_swimmers: true
      },
      survived: true,
      epilogue: 'You are a hero.'
    },
    {
      id: 'outcome-default',
      conditions: {},
      survived: true,
      epilogue: 'You survived.'
    }
  ];
  
  // Set flags that match the first outcome
  consequenceSystem.setFlag('saved_others', true);
  consequenceSystem.setFlag('rescued_swimmers', true);
  
  const outcomeId = consequenceSystem.calculateOutcome(outcomeRules);
  
  if (outcomeId === 'outcome-hero') {
    log('✓ calculateOutcome() returns correct outcome ID for matching conditions');
  } else {
    log(`✗ Expected 'outcome-hero', got '${outcomeId}'`);
  }
  
  log('');
}

// Test 2: ConsequenceSystem.calculateOutcome() falls back to default
function testCalculateOutcomeFallback() {
  log('Test 2: ConsequenceSystem.calculateOutcome() falls back to default');
  
  const { consequenceSystem } = setupTestEnvironment();
  
  const outcomeRules = [
    {
      id: 'outcome-specific',
      conditions: {
        rare_flag: true
      },
      survived: false,
      epilogue: 'Rare outcome.'
    },
    {
      id: 'outcome-default',
      conditions: {},
      survived: true,
      epilogue: 'Default outcome.'
    }
  ];
  
  // Don't set rare_flag, should fall back to default
  consequenceSystem.setFlag('some_other_flag', true);
  
  const outcomeId = consequenceSystem.calculateOutcome(outcomeRules);
  
  if (outcomeId === 'outcome-default') {
    log('✓ calculateOutcome() falls back to default outcome when no specific match');
  } else {
    log(`✗ Expected 'outcome-default', got '${outcomeId}'`);
  }
  
  log('');
}

// Test 3: Outcome screen displays survival status correctly
function testOutcomeScreenSurvivalStatus() {
  log('Test 3: Outcome screen displays survival status correctly');
  
  const { eventBus, consequenceSystem, uiController } = setupTestEnvironment();
  
  // Set up for American Sailor role with survival outcome
  consequenceSystem.setFlag('saved_others', true);
  consequenceSystem.setFlag('rescued_swimmers', true);
  
  // Trigger game complete event
  eventBus.emit('game:complete', {
    missionId: 'pearl-harbor',
    roleId: 'american-sailor'
  });
  
  // Check if outcome screen was created
  const outcomeScreen = document.getElementById('outcome-screen');
  if (!outcomeScreen) {
    log('✗ Outcome screen not created');
    log('');
    return;
  }
  
  // Check for survival status
  const outcomeResult = outcomeScreen.querySelector('#outcome-result');
  if (!outcomeResult) {
    log('✗ Outcome result container not found');
    log('');
    return;
  }
  
  const content = outcomeResult.innerHTML;
  
  if (content.includes('You Survived') || content.includes('You Did Not Survive')) {
    log('✓ Outcome screen displays survival status');
  } else {
    log('✗ Survival status not displayed');
  }
  
  if (content.includes('text-success') || content.includes('text-danger')) {
    log('✓ Survival status has appropriate CSS class');
  } else {
    log('✗ Survival status CSS class not applied');
  }
  
  log('');
}

// Test 4: Outcome screen displays epilogue
function testOutcomeScreenEpilogue() {
  log('Test 4: Outcome screen displays epilogue');
  
  const { eventBus, consequenceSystem } = setupTestEnvironment();
  
  // Set up for American Sailor role with hero outcome
  consequenceSystem.setFlag('saved_others', true);
  consequenceSystem.setFlag('rescued_swimmers', true);
  
  // Trigger game complete event
  eventBus.emit('game:complete', {
    missionId: 'pearl-harbor',
    roleId: 'american-sailor'
  });
  
  const outcomeScreen = document.getElementById('outcome-screen');
  if (!outcomeScreen) {
    log('✗ Outcome screen not created');
    log('');
    return;
  }
  
  const outcomeEpilogue = outcomeScreen.querySelector('.outcome-epilogue');
  if (!outcomeEpilogue) {
    log('✗ Outcome epilogue container not found');
    log('');
    return;
  }
  
  const epilogueContent = outcomeEpilogue.innerHTML;
  
  if (epilogueContent.includes('<p>') && epilogueContent.length > 50) {
    log('✓ Outcome screen displays epilogue text');
  } else {
    log('✗ Epilogue text not displayed or too short');
  }
  
  log('');
}

// Test 5: Continue button emits event to proceed to historical ripple
function testContinueButton() {
  log('Test 5: Continue button proceeds to historical ripple');
  
  const { eventBus, consequenceSystem, uiController } = setupTestEnvironment();
  
  // Set up for American Sailor role
  consequenceSystem.setFlag('saved_others', true);
  consequenceSystem.setFlag('rescued_swimmers', true);
  
  // Trigger game complete event
  eventBus.emit('game:complete', {
    missionId: 'pearl-harbor',
    roleId: 'american-sailor'
  });
  
  const outcomeScreen = document.getElementById('outcome-screen');
  if (!outcomeScreen) {
    log('✗ Outcome screen not created');
    log('');
    return;
  }
  
  const continueButton = outcomeScreen.querySelector('#continue-to-ripple');
  if (!continueButton) {
    log('✗ Continue button not found');
    log('');
    return;
  }
  
  log('✓ Continue button exists on outcome screen');
  
  // Test button click transitions to historical ripple
  let rippleScreenShown = false;
  const originalShowScreen = uiController.showScreen.bind(uiController);
  uiController.showScreen = function(screenName, data) {
    if (screenName === 'historical-ripple') {
      rippleScreenShown = true;
    }
    return originalShowScreen(screenName, data);
  };
  
  continueButton.click();
  
  if (rippleScreenShown) {
    log('✓ Continue button transitions to historical ripple screen');
  } else {
    log('✗ Continue button did not transition to historical ripple');
  }
  
  log('');
}

// Test 6: Outcome reflects player choices (different flags = different outcomes)
function testOutcomeReflectsChoices() {
  log('Test 6: Outcome reflects player choices');
  
  const { eventBus, consequenceSystem } = setupTestEnvironment();
  
  // Test scenario 1: Hero outcome
  consequenceSystem.reset();
  consequenceSystem.setFlag('saved_others', true);
  consequenceSystem.setFlag('rescued_swimmers', true);
  
  eventBus.emit('game:complete', {
    missionId: 'pearl-harbor',
    roleId: 'american-sailor'
  });
  
  let outcomeScreen = document.getElementById('outcome-screen');
  let outcomeResult = outcomeScreen?.querySelector('#outcome-result');
  const heroOutcome = outcomeResult?.innerHTML || '';
  
  // Test scenario 2: Fighter outcome
  document.getElementById('app').innerHTML = '';
  consequenceSystem.reset();
  consequenceSystem.setFlag('fought_back', true);
  consequenceSystem.setFlag('stayed_aboard', true);
  
  eventBus.emit('game:complete', {
    missionId: 'pearl-harbor',
    roleId: 'american-sailor'
  });
  
  outcomeScreen = document.getElementById('outcome-screen');
  outcomeResult = outcomeScreen?.querySelector('#outcome-result');
  const fighterOutcome = outcomeResult?.innerHTML || '';
  
  if (heroOutcome !== fighterOutcome && heroOutcome.length > 0 && fighterOutcome.length > 0) {
    log('✓ Different consequence flags produce different outcomes');
  } else {
    log('✗ Outcomes are identical or empty despite different flags');
  }
  
  log('');
}

// Test 7: Error handling for missing mission/role data
function testErrorHandling() {
  log('Test 7: Error handling for missing mission/role data');
  
  const { eventBus } = setupTestEnvironment();
  
  // Trigger game complete with invalid mission ID
  eventBus.emit('game:complete', {
    missionId: 'invalid-mission',
    roleId: 'invalid-role'
  });
  
  const outcomeScreen = document.getElementById('outcome-screen');
  const outcomeResult = outcomeScreen?.querySelector('#outcome-result');
  
  if (outcomeResult && outcomeResult.innerHTML.includes('Error')) {
    log('✓ Error message displayed for invalid mission/role data');
  } else {
    log('✗ No error handling for invalid data');
  }
  
  log('');
}

// Run all tests
testCalculateOutcomeWithMatch();
testCalculateOutcomeFallback();
testOutcomeScreenSurvivalStatus();
testOutcomeScreenEpilogue();
testContinueButton();
testOutcomeReflectsChoices();
testErrorHandling();

// Summary
log('=== Test Summary ===');
const passed = testResults.filter(r => r.includes('✓')).length;
const failed = testResults.filter(r => r.includes('✗')).length;
log(`Passed: ${passed}`);
log(`Failed: ${failed}`);

if (failed === 0) {
  log('\n✓ All outcome screen logic tests passed!');
} else {
  log(`\n✗ ${failed} test(s) failed`);
}
