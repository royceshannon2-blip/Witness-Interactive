/**
 * MissionRegistry Tests
 * 
 * Unit tests for the MissionRegistry class
 * Validates mission registration, retrieval, and filtering
 */

import MissionRegistry from './MissionRegistry.js';

// Test helper to create a valid mission object
function createTestMission(overrides = {}) {
  return {
    id: 'test-mission',
    title: 'Test Mission',
    historicalDate: '1941-12-07',
    era: 'Modern',
    roles: [
      { id: 'role-1', name: 'Test Role 1' },
      { id: 'role-2', name: 'Test Role 2' }
    ],
    unlocked: true,
    teaser: 'A test mission',
    ...overrides
  };
}

// Test Suite
console.log('Running MissionRegistry Tests...\n');

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

// Test 1: Constructor creates empty registry
test('Constructor creates empty registry', () => {
  const registry = new MissionRegistry();
  assert(registry.getAllMissions().length === 0, 'Registry should start empty');
});

// Test 2: Register valid mission
test('Register valid mission', () => {
  const registry = new MissionRegistry();
  const mission = createTestMission();
  
  registry.register(mission);
  
  const retrieved = registry.getMission('test-mission');
  assert(retrieved !== undefined, 'Mission should be retrievable');
  assert(retrieved.id === 'test-mission', 'Mission ID should match');
  assert(retrieved.title === 'Test Mission', 'Mission title should match');
});

// Test 3: Register mission without required fields
test('Register mission without required fields logs error', () => {
  const registry = new MissionRegistry();
  const invalidMission = { id: 'invalid', title: 'Invalid' }; // Missing required fields
  
  // Should not throw, but should log error
  registry.register(invalidMission);
  
  const retrieved = registry.getMission('invalid');
  assert(retrieved === undefined, 'Invalid mission should not be registered');
});

// Test 4: Register mission with non-array roles
test('Register mission with non-array roles logs error', () => {
  const registry = new MissionRegistry();
  const mission = createTestMission({ roles: 'not-an-array' });
  
  registry.register(mission);
  
  const retrieved = registry.getMission('test-mission');
  assert(retrieved === undefined, 'Mission with invalid roles should not be registered');
});

// Test 5: Register mission with invalid date format
test('Register mission with invalid date format logs warning', () => {
  const registry = new MissionRegistry();
  const mission = createTestMission({ historicalDate: 'December 7, 1941' });
  
  // Should register but log warning
  registry.register(mission);
  
  const retrieved = registry.getMission('test-mission');
  assert(retrieved !== undefined, 'Mission should still be registered despite date warning');
});

// Test 6: Get mission by ID
test('Get mission by ID', () => {
  const registry = new MissionRegistry();
  const mission1 = createTestMission({ id: 'mission-1', title: 'Mission 1' });
  const mission2 = createTestMission({ id: 'mission-2', title: 'Mission 2' });
  
  registry.register(mission1);
  registry.register(mission2);
  
  const retrieved = registry.getMission('mission-2');
  assert(retrieved.title === 'Mission 2', 'Should retrieve correct mission');
});

// Test 7: Get non-existent mission
test('Get non-existent mission returns undefined', () => {
  const registry = new MissionRegistry();
  
  const retrieved = registry.getMission('non-existent');
  assert(retrieved === undefined, 'Non-existent mission should return undefined');
});

// Test 8: Get all missions
test('Get all missions', () => {
  const registry = new MissionRegistry();
  const mission1 = createTestMission({ id: 'mission-1' });
  const mission2 = createTestMission({ id: 'mission-2' });
  const mission3 = createTestMission({ id: 'mission-3' });
  
  registry.register(mission1);
  registry.register(mission2);
  registry.register(mission3);
  
  const allMissions = registry.getAllMissions();
  assert(allMissions.length === 3, 'Should return all 3 missions');
});

// Test 9: Get missions by era
test('Get missions by era', () => {
  const registry = new MissionRegistry();
  const modernMission1 = createTestMission({ id: 'modern-1', era: 'Modern' });
  const modernMission2 = createTestMission({ id: 'modern-2', era: 'Modern' });
  const ancientMission = createTestMission({ id: 'ancient-1', era: 'Ancient' });
  
  registry.register(modernMission1);
  registry.register(modernMission2);
  registry.register(ancientMission);
  
  const modernMissions = registry.getMissionsByEra('Modern');
  assert(modernMissions.length === 2, 'Should return 2 Modern era missions');
  
  const ancientMissions = registry.getMissionsByEra('Ancient');
  assert(ancientMissions.length === 1, 'Should return 1 Ancient era mission');
});

// Test 10: Get missions by non-existent era
test('Get missions by non-existent era returns empty array', () => {
  const registry = new MissionRegistry();
  const mission = createTestMission();
  
  registry.register(mission);
  
  const missions = registry.getMissionsByEra('Medieval');
  assert(missions.length === 0, 'Should return empty array for non-existent era');
});

// Test 11: Register duplicate mission ID
test('Register duplicate mission ID logs warning and overwrites', () => {
  const registry = new MissionRegistry();
  const mission1 = createTestMission({ title: 'First Version' });
  const mission2 = createTestMission({ title: 'Second Version' });
  
  registry.register(mission1);
  registry.register(mission2);
  
  const retrieved = registry.getMission('test-mission');
  assert(retrieved.title === 'Second Version', 'Should overwrite with second version');
  
  const allMissions = registry.getAllMissions();
  assert(allMissions.length === 1, 'Should only have one mission registered');
});

// Test 12: Validate required fields
test('Validate all required fields are checked', () => {
  const registry = new MissionRegistry();
  
  // Missing id
  registry.register({ title: 'Test', historicalDate: '1941-12-07', era: 'Modern', roles: [] });
  assert(registry.getAllMissions().length === 0, 'Should reject mission without id');
  
  // Missing title
  registry.register({ id: 'test', historicalDate: '1941-12-07', era: 'Modern', roles: [] });
  assert(registry.getAllMissions().length === 0, 'Should reject mission without title');
  
  // Missing historicalDate
  registry.register({ id: 'test', title: 'Test', era: 'Modern', roles: [] });
  assert(registry.getAllMissions().length === 0, 'Should reject mission without historicalDate');
  
  // Missing era
  registry.register({ id: 'test', title: 'Test', historicalDate: '1941-12-07', roles: [] });
  assert(registry.getAllMissions().length === 0, 'Should reject mission without era');
  
  // Missing roles
  registry.register({ id: 'test', title: 'Test', historicalDate: '1941-12-07', era: 'Modern' });
  assert(registry.getAllMissions().length === 0, 'Should reject mission without roles');
});

// Print test results
console.log(`\n${'='.repeat(50)}`);
console.log(`Tests Passed: ${passedTests}`);
console.log(`Tests Failed: ${failedTests}`);
console.log(`Total Tests: ${passedTests + failedTests}`);
console.log('='.repeat(50));

if (failedTests === 0) {
  console.log('\n✓ All tests passed!');
} else {
  console.log(`\n✗ ${failedTests} test(s) failed`);
  process.exit(1);
}
