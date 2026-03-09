/**
 * ConsequenceSystem Manual Test
 * 
 * Simple test to verify ConsequenceSystem functionality.
 * Run this in the browser console or as a Node.js module.
 */

import EventBus from './EventBus.js';
import ConsequenceSystem from './ConsequenceSystem.js';

console.log('=== ConsequenceSystem Tests ===\n');

// Test 1: setFlag and getFlag with boolean values
console.log('Test 1: setFlag and getFlag with boolean values');
const eventBus = new EventBus();
const system = new ConsequenceSystem(eventBus);

system.setFlag('avoided_aa_fire', true);
system.setFlag('fuel_conserved', false);

console.assert(system.getFlag('avoided_aa_fire') === true, 'Test 1a failed: avoided_aa_fire should be true');
console.assert(system.getFlag('fuel_conserved') === false, 'Test 1b failed: fuel_conserved should be false');
console.log('✓ Boolean flags work correctly');

// Test 2: setFlag and getFlag with numeric values
console.log('\nTest 2: setFlag and getFlag with numeric values');
system.setFlag('civilians_saved', 5);
system.setFlag('damage_taken', 0);

console.assert(system.getFlag('civilians_saved') === 5, 'Test 2a failed: civilians_saved should be 5');
console.assert(system.getFlag('damage_taken') === 0, 'Test 2b failed: damage_taken should be 0');
console.log('✓ Numeric flags work correctly');

// Test 3: getFlag returns undefined for non-existent flags
console.log('\nTest 3: getFlag returns undefined for non-existent flags');
const nonExistent = system.getFlag('does_not_exist');
console.assert(nonExistent === undefined, 'Test 3 failed: non-existent flag should return undefined');
console.log('✓ Non-existent flags return undefined');

// Test 4: getAllFlags returns all flags as object
console.log('\nTest 4: getAllFlags returns all flags as object');
const allFlags = system.getAllFlags();
console.assert(typeof allFlags === 'object', 'Test 4a failed: getAllFlags should return an object');
console.assert(allFlags.avoided_aa_fire === true, 'Test 4b failed: object should contain avoided_aa_fire');
console.assert(allFlags.civilians_saved === 5, 'Test 4c failed: object should contain civilians_saved');
console.assert(Object.keys(allFlags).length === 4, 'Test 4d failed: should have 4 flags');
console.log('✓ getAllFlags returns correct object');

// Test 5: reset clears all flags
console.log('\nTest 5: reset clears all flags');
system.reset();
const flagsAfterReset = system.getAllFlags();
console.assert(Object.keys(flagsAfterReset).length === 0, 'Test 5a failed: flags should be empty after reset');
console.assert(system.getFlag('avoided_aa_fire') === undefined, 'Test 5b failed: flag should be undefined after reset');
console.log('✓ reset clears all flags');

// Test 6: EventBus integration - automatic flag setting on choice:made
console.log('\nTest 6: EventBus integration - automatic flag setting on choice:made');
const eventBus2 = new EventBus();
const system2 = new ConsequenceSystem(eventBus2);

eventBus2.emit('choice:made', {
  choiceId: 'ja-choice-01-a',
  consequences: {
    disciplined_approach: true,
    risk_level: 2
  }
});

console.assert(system2.getFlag('disciplined_approach') === true, 'Test 6a failed: disciplined_approach should be set');
console.assert(system2.getFlag('risk_level') === 2, 'Test 6b failed: risk_level should be 2');
console.log('✓ EventBus integration works - flags set automatically on choice:made');

// Test 7: Multiple choice:made events accumulate flags
console.log('\nTest 7: Multiple choice:made events accumulate flags');
eventBus2.emit('choice:made', {
  choiceId: 'ja-choice-02-b',
  consequences: {
    independent_thinking: true,
    fuel_conserved: true
  }
});

const allFlags2 = system2.getAllFlags();
console.assert(allFlags2.disciplined_approach === true, 'Test 7a failed: previous flag should persist');
console.assert(allFlags2.independent_thinking === true, 'Test 7b failed: new flag should be set');
console.assert(Object.keys(allFlags2).length === 4, 'Test 7c failed: should have 4 total flags');
console.log('✓ Multiple choices accumulate flags correctly');

// Test 8: calculateOutcome with matching conditions
console.log('\nTest 8: calculateOutcome with matching conditions');
const system3 = new ConsequenceSystem(new EventBus());
system3.setFlag('avoided_aa_fire', true);
system3.setFlag('fuel_conserved', true);

const outcomeRules = [
  {
    id: 'survived-returned-home',
    conditions: {
      avoided_aa_fire: true,
      fuel_conserved: true
    }
  },
  {
    id: 'survived-crash-landed',
    conditions: {
      avoided_aa_fire: false,
      fuel_conserved: false
    }
  }
];

const outcome = system3.calculateOutcome(outcomeRules);
console.assert(outcome === 'survived-returned-home', 'Test 8 failed: should match first outcome');
console.log('✓ calculateOutcome returns correct outcome ID');

// Test 9: calculateOutcome with no matching conditions
console.log('\nTest 9: calculateOutcome with no matching conditions');
const system4 = new ConsequenceSystem(new EventBus());
system4.setFlag('some_flag', true);

const outcome2 = system4.calculateOutcome(outcomeRules);
console.assert(outcome2 === null, 'Test 9 failed: should return null when no conditions match');
console.log('✓ calculateOutcome returns null when no match found');

// Test 10: calculateOutcome evaluates rules in order
console.log('\nTest 10: calculateOutcome evaluates rules in order');
const system5 = new ConsequenceSystem(new EventBus());
system5.setFlag('flag_a', true);

const orderedRules = [
  {
    id: 'first-match',
    conditions: { flag_a: true }
  },
  {
    id: 'second-match',
    conditions: { flag_a: true }
  }
];

const outcome3 = system5.calculateOutcome(orderedRules);
console.assert(outcome3 === 'first-match', 'Test 10 failed: should return first matching rule');
console.log('✓ calculateOutcome returns first matching rule');

// Test 11: Invalid flag name handling
console.log('\nTest 11: Invalid flag name handling');
system.setFlag(123, true); // Should log error and not set
system.setFlag('valid_flag', 'invalid_value'); // Should log warning and not set
console.assert(system.getFlag(123) === undefined, 'Test 11a failed: invalid flag name should not be set');
console.assert(system.getFlag('valid_flag') === undefined, 'Test 11b failed: invalid value type should not be set');
console.log('✓ Invalid inputs handled gracefully');

// Test 12: choice:made event with no consequences
console.log('\nTest 12: choice:made event with no consequences');
const eventBus3 = new EventBus();
const system6 = new ConsequenceSystem(eventBus3);

eventBus3.emit('choice:made', { choiceId: 'test-choice' }); // No consequences field
const flags = system6.getAllFlags();
console.assert(Object.keys(flags).length === 0, 'Test 12 failed: no flags should be set');
console.log('✓ choice:made without consequences handled gracefully');

console.log('\n✅ All ConsequenceSystem tests passed!');
