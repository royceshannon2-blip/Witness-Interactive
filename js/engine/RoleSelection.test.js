/**
 * Role Selection UI Tests
 * 
 * Tests for Task 9.1: Create role selection UI
 * Validates Requirements: 4.1, 4.3, 4.5, 23.1, 23.2, 23.3
 */

import EventBus from './EventBus.js';
import UIController from './UIController.js';
import MissionRegistry from '../content/MissionRegistry.js';
import TimelineSelector from './TimelineSelector.js';

/**
 * Test: Role selection screen displays mission title and role cards
 * Requirement 4.1: Display available roles for selected mission
 */
function testRoleSelectionDisplaysRoles() {
  console.log('\n=== Test: Role selection displays roles ===');
  
  // Setup
  const eventBus = new EventBus();
  const missionRegistry = new MissionRegistry();
  const timelineSelector = new TimelineSelector(eventBus, missionRegistry);
  
  // Register test mission with 3 roles
  missionRegistry.register({
    id: 'test-mission',
    title: 'Test Mission',
    historicalDate: '1941-12-07',
    era: 'Modern',
    unlocked: true,
    roles: [
      {
        id: 'role-1',
        name: 'Test Role 1',
        description: 'First test role description',
        scenes: []
      },
      {
        id: 'role-2',
        name: 'Test Role 2',
        description: 'Second test role description',
        scenes: []
      },
      {
        id: 'role-3',
        name: 'Test Role 3',
        description: 'Third test role description',
        scenes: []
      }
    ]
  });
  
  const uiController = new UIController(eventBus, timelineSelector, missionRegistry);
  
  // Emit mission:selected event
  eventBus.emit('mission:selected', { missionId: 'test-mission' });
  
  // Verify role selection screen is displayed
  const roleSelectionScreen = document.getElementById('role-selection-screen');
  if (!roleSelectionScreen) {
    console.error('✗ FAIL: Role selection screen not created');
    return false;
  }
  
  // Verify role cards container exists
  const roleCardsContainer = roleSelectionScreen.querySelector('#role-cards-container');
  if (!roleCardsContainer) {
    console.error('✗ FAIL: Role cards container not found');
    return false;
  }
  
  // Verify 3 role cards are displayed
  const roleCards = roleCardsContainer.querySelectorAll('.role-card');
  if (roleCards.length !== 3) {
    console.error(`✗ FAIL: Expected 3 role cards, found ${roleCards.length}`);
    return false;
  }
  
  // Verify each role card has name, description, and button
  let allCardsValid = true;
  roleCards.forEach((card, index) => {
    const title = card.querySelector('.role-title');
    const description = card.querySelector('.role-description');
    const button = card.querySelector('.role-select-button');
    
    if (!title || !description || !button) {
      console.error(`✗ FAIL: Role card ${index + 1} missing required elements`);
      allCardsValid = false;
    }
  });
  
  if (!allCardsValid) {
    return false;
  }
  
  console.log('✓ PASS: Role selection displays all roles with name, description, and button');
  return true;
}

/**
 * Test: Role selection buttons emit role:selected event
 * Requirement 4.3: Role selection initializes narrative sequence
 */
function testRoleSelectionEmitsEvent() {
  console.log('\n=== Test: Role selection emits role:selected event ===');
  
  // Setup
  const eventBus = new EventBus();
  const missionRegistry = new MissionRegistry();
  const timelineSelector = new TimelineSelector(eventBus, missionRegistry);
  
  missionRegistry.register({
    id: 'test-mission',
    title: 'Test Mission',
    historicalDate: '1941-12-07',
    era: 'Modern',
    unlocked: true,
    roles: [
      {
        id: 'test-role',
        name: 'Test Role',
        description: 'Test description',
        scenes: []
      }
    ]
  });
  
  const uiController = new UIController(eventBus, timelineSelector, missionRegistry);
  
  // Listen for role:selected event
  let eventEmitted = false;
  let eventData = null;
  eventBus.on('role:selected', (data) => {
    eventEmitted = true;
    eventData = data;
  });
  
  // Show role selection screen
  eventBus.emit('mission:selected', { missionId: 'test-mission' });
  
  // Click role selection button
  const roleButton = document.querySelector('.role-select-button');
  if (!roleButton) {
    console.error('✗ FAIL: Role selection button not found');
    return false;
  }
  
  roleButton.click();
  
  // Verify event was emitted
  if (!eventEmitted) {
    console.error('✗ FAIL: role:selected event not emitted');
    return false;
  }
  
  // Verify event data contains roleId and missionId
  if (!eventData || !eventData.roleId || !eventData.missionId) {
    console.error('✗ FAIL: role:selected event missing roleId or missionId');
    return false;
  }
  
  if (eventData.roleId !== 'test-role') {
    console.error(`✗ FAIL: Expected roleId 'test-role', got '${eventData.roleId}'`);
    return false;
  }
  
  console.log('✓ PASS: Role selection button emits role:selected event with correct data');
  return true;
}

/**
 * Test: Endings discovered counter displays correctly
 * Requirement 23.3: Display "endings discovered" counter
 */
function testEndingsCounter() {
  console.log('\n=== Test: Endings discovered counter ===');
  
  // Setup
  const eventBus = new EventBus();
  const missionRegistry = new MissionRegistry();
  const timelineSelector = new TimelineSelector(eventBus, missionRegistry);
  
  missionRegistry.register({
    id: 'test-mission',
    title: 'Test Mission',
    historicalDate: '1941-12-07',
    era: 'Modern',
    unlocked: true,
    roles: [
      { id: 'role-1', name: 'Role 1', description: 'Desc 1', scenes: [] },
      { id: 'role-2', name: 'Role 2', description: 'Desc 2', scenes: [] },
      { id: 'role-3', name: 'Role 3', description: 'Desc 3', scenes: [] }
    ]
  });
  
  const uiController = new UIController(eventBus, timelineSelector, missionRegistry);
  
  // Show role selection screen
  eventBus.emit('mission:selected', { missionId: 'test-mission' });
  
  // Verify initial counter shows 0/3
  let endingsCount = document.getElementById('endings-count');
  if (!endingsCount) {
    console.error('✗ FAIL: Endings count element not found');
    return false;
  }
  
  if (endingsCount.textContent !== '0/3') {
    console.error(`✗ FAIL: Expected initial count '0/3', got '${endingsCount.textContent}'`);
    return false;
  }
  
  // Simulate completing a role
  eventBus.emit('game:complete', { roleId: 'role-1' });
  
  // Return to role selection
  eventBus.emit('mission:selected', { missionId: 'test-mission' });
  
  // Verify counter updated to 1/3
  endingsCount = document.getElementById('endings-count');
  if (endingsCount.textContent !== '1/3') {
    console.error(`✗ FAIL: Expected count '1/3' after completion, got '${endingsCount.textContent}'`);
    return false;
  }
  
  console.log('✓ PASS: Endings counter displays correctly and updates after completion');
  return true;
}

/**
 * Test: Completed roles show completion badge
 * Requirement 23.2: Show completion status for each role
 */
function testCompletionBadge() {
  console.log('\n=== Test: Completed roles show badge ===');
  
  // Setup
  const eventBus = new EventBus();
  const missionRegistry = new MissionRegistry();
  const timelineSelector = new TimelineSelector(eventBus, missionRegistry);
  
  missionRegistry.register({
    id: 'test-mission',
    title: 'Test Mission',
    historicalDate: '1941-12-07',
    era: 'Modern',
    unlocked: true,
    roles: [
      { id: 'role-1', name: 'Role 1', description: 'Desc 1', scenes: [] },
      { id: 'role-2', name: 'Role 2', description: 'Desc 2', scenes: [] }
    ]
  });
  
  const uiController = new UIController(eventBus, timelineSelector, missionRegistry);
  
  // Show role selection screen
  eventBus.emit('mission:selected', { missionId: 'test-mission' });
  
  // Verify no completion badges initially
  let badges = document.querySelectorAll('.completion-badge');
  if (badges.length !== 0) {
    console.error(`✗ FAIL: Expected 0 completion badges initially, found ${badges.length}`);
    return false;
  }
  
  // Complete role-1
  eventBus.emit('game:complete', { roleId: 'role-1' });
  
  // Return to role selection
  eventBus.emit('mission:selected', { missionId: 'test-mission' });
  
  // Verify completion badge appears for role-1
  badges = document.querySelectorAll('.completion-badge');
  if (badges.length !== 1) {
    console.error(`✗ FAIL: Expected 1 completion badge after completing role, found ${badges.length}`);
    return false;
  }
  
  // Verify completed role card has 'completed' class
  const roleCards = document.querySelectorAll('.role-card');
  const completedCards = Array.from(roleCards).filter(card => card.classList.contains('completed'));
  if (completedCards.length !== 1) {
    console.error(`✗ FAIL: Expected 1 completed role card, found ${completedCards.length}`);
    return false;
  }
  
  console.log('✓ PASS: Completed roles show completion badge and styling');
  return true;
}

/**
 * Test: Session-only tracking (no localStorage)
 * Requirement 23.5: Track completion only for current browser session
 */
function testSessionOnlyTracking() {
  console.log('\n=== Test: Session-only tracking (no localStorage) ===');
  
  // Verify no localStorage is used
  const initialLocalStorageLength = localStorage.length;
  
  // Setup and complete a role
  const eventBus = new EventBus();
  const missionRegistry = new MissionRegistry();
  const timelineSelector = new TimelineSelector(eventBus, missionRegistry);
  
  missionRegistry.register({
    id: 'test-mission',
    title: 'Test Mission',
    historicalDate: '1941-12-07',
    era: 'Modern',
    unlocked: true,
    roles: [
      { id: 'role-1', name: 'Role 1', description: 'Desc 1', scenes: [] }
    ]
  });
  
  const uiController = new UIController(eventBus, timelineSelector, missionRegistry);
  
  eventBus.emit('mission:selected', { missionId: 'test-mission' });
  eventBus.emit('game:complete', { roleId: 'role-1' });
  
  // Verify localStorage was not used
  if (localStorage.length !== initialLocalStorageLength) {
    console.error('✗ FAIL: localStorage was modified (should be session-only tracking)');
    return false;
  }
  
  console.log('✓ PASS: Role completion tracked in session only (no localStorage)');
  return true;
}

/**
 * Run all tests
 */
export function runRoleSelectionTests() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║  Role Selection UI Tests (Task 9.1)   ║');
  console.log('╚════════════════════════════════════════╝');
  
  const results = [];
  
  results.push(testRoleSelectionDisplaysRoles());
  results.push(testRoleSelectionEmitsEvent());
  results.push(testEndingsCounter());
  results.push(testCompletionBadge());
  results.push(testSessionOnlyTracking());
  
  const passed = results.filter(r => r === true).length;
  const failed = results.filter(r => r === false).length;
  
  console.log('\n' + '='.repeat(40));
  console.log(`Tests Passed: ${passed}/${results.length}`);
  console.log(`Tests Failed: ${failed}/${results.length}`);
  console.log('='.repeat(40));
  
  return failed === 0;
}

// Auto-run tests if this file is loaded directly
if (import.meta.url === `file://${process.cwd()}/js/engine/RoleSelection.test.js`) {
  runRoleSelectionTests();
}
