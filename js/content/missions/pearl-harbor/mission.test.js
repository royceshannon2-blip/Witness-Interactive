/**
 * Pearl Harbor Mission Configuration Tests
 * 
 * Validates the Pearl Harbor mission configuration structure
 */

import pearlHarborMission from './mission.js';
import MissionRegistry from '../../MissionRegistry.js';

console.log('Running Pearl Harbor Mission Configuration Tests...\n');

let passedTests = 0;
let failedTests = 0;

function test(description, testFn) {
  try {
    testFn();
    console.log(`✓ ${description}`);
    passedTests++;
  } catch (error) {
    console.error(`✗ ${description}`);
    console.error(`  ${error.message}`);
    failedTests++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// Test 1: Mission has required metadata fields
test('Mission has all required metadata fields', () => {
  assert(pearlHarborMission.id === 'pearl-harbor', 'Mission ID should be pearl-harbor');
  assert(pearlHarborMission.title === 'Pearl Harbor', 'Mission title should be Pearl Harbor');
  assert(pearlHarborMission.historicalDate === '1941-12-07', 'Historical date should be 1941-12-07');
  assert(pearlHarborMission.era === 'Modern', 'Era should be Modern');
  assert(pearlHarborMission.unlocked === true, 'Mission should be unlocked');
  assert(typeof pearlHarborMission.teaser === 'string', 'Teaser should be a string');
});

// Test 2: Mission has three roles
test('Mission has exactly three roles', () => {
  assert(Array.isArray(pearlHarborMission.roles), 'Roles should be an array');
  assert(pearlHarborMission.roles.length === 3, 'Should have exactly 3 roles');
});

// Test 3: Japanese Aviator role is defined
test('Japanese Aviator role is properly defined', () => {
  const aviator = pearlHarborMission.roles.find(r => r.id === 'japanese-aviator');
  assert(aviator !== undefined, 'Japanese Aviator role should exist');
  assert(aviator.name === 'Japanese Naval Aviator', 'Role name should match');
  assert(typeof aviator.description === 'string', 'Role should have description');
  assert(Array.isArray(aviator.scenes), 'Role should have scenes array');
});

// Test 4: American Sailor role is defined
test('American Sailor role is properly defined', () => {
  const sailor = pearlHarborMission.roles.find(r => r.id === 'american-sailor');
  assert(sailor !== undefined, 'American Sailor role should exist');
  assert(sailor.name === 'American Sailor (USS Arizona)', 'Role name should match');
  assert(typeof sailor.description === 'string', 'Role should have description');
  assert(Array.isArray(sailor.scenes), 'Role should have scenes array');
});

// Test 5: American Civilian role is defined
test('American Civilian role is properly defined', () => {
  const civilian = pearlHarborMission.roles.find(r => r.id === 'american-civilian');
  assert(civilian !== undefined, 'American Civilian role should exist');
  assert(civilian.name === 'American Civilian', 'Role name should match');
  assert(typeof civilian.description === 'string', 'Role should have description');
  assert(Array.isArray(civilian.scenes), 'Role should have scenes array');
});

// Test 6: Mission can be registered with MissionRegistry
test('Mission can be registered with MissionRegistry', () => {
  const registry = new MissionRegistry();
  registry.register(pearlHarborMission);
  
  const retrieved = registry.getMission('pearl-harbor');
  assert(retrieved !== undefined, 'Mission should be retrievable after registration');
  assert(retrieved.id === 'pearl-harbor', 'Retrieved mission should match');
});

// Test 7: Historical date is in ISO format
test('Historical date is in ISO format', () => {
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
  assert(isoDatePattern.test(pearlHarborMission.historicalDate), 
    'Historical date should be in ISO format (YYYY-MM-DD)');
});

// Test 8: Mission has placeholder arrays for future content
test('Mission has placeholder arrays for future content', () => {
  assert(Array.isArray(pearlHarborMission.historicalRipple), 
    'Historical ripple should be an array');
  assert(Array.isArray(pearlHarborMission.knowledgeQuestions), 
    'Knowledge questions should be an array');
});

// Print test results
console.log(`\n${'='.repeat(50)}`);
console.log(`Tests Passed: ${passedTests}`);
console.log(`Tests Failed: ${failedTests}`);
console.log(`Total Tests: ${passedTests + failedTests}`);
console.log('='.repeat(50));

if (failedTests === 0) {
  console.log('\n✓ All Pearl Harbor mission configuration tests passed!');
} else {
  console.log(`\n✗ ${failedTests} test(s) failed`);
  process.exit(1);
}
