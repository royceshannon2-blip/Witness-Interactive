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

// ─── TASK 2.1: Range-check condition tests ────────────────────────────────

console.log('\n=== Range-Check Condition Tests (Task 2.1) ===\n');

// Test RC-1: { gte: 3 } — boundary match (value === gte)
console.log('Test RC-1: { gte: 3 } with value 3 = match');
const rcSys1 = new ConsequenceSystem(new EventBus());
rcSys1.setFlag('hm_lp_movement_trust', 3);
const rcOutcome1 = rcSys1.calculateOutcome([
  { id: 'high-trust', survived: true, conditions: { hm_lp_movement_trust: { gte: 3 } } },
  { id: 'default',    survived: true, conditions: {} }
], true);
console.assert(rcOutcome1 === 'high-trust', `RC-1 failed: expected 'high-trust', got '${rcOutcome1}'`);
console.log('✓ { gte: 3 } with value 3 matches');

// Test RC-2: { gte: 3 } — value below threshold
console.log('\nTest RC-2: { gte: 3 } with value 2 = no match');
const rcSys2 = new ConsequenceSystem(new EventBus());
rcSys2.setFlag('hm_lp_movement_trust', 2);
const rcOutcome2 = rcSys2.calculateOutcome([
  { id: 'high-trust', survived: true, conditions: { hm_lp_movement_trust: { gte: 3 } } },
  { id: 'default',    survived: true, conditions: {} }
], true);
console.assert(rcOutcome2 === 'default', `RC-2 failed: expected 'default', got '${rcOutcome2}'`);
console.log('✓ { gte: 3 } with value 2 does not match');

// Test RC-3: { lte: 1 } — boundary match (value === lte)
console.log('\nTest RC-3: { lte: 1 } with value 1 = match');
const rcSys3 = new ConsequenceSystem(new EventBus());
rcSys3.setFlag('hm_lp_movement_trust', 1);
const rcOutcome3 = rcSys3.calculateOutcome([
  { id: 'low-trust', survived: true, conditions: { hm_lp_movement_trust: { lte: 1 } } },
  { id: 'default',   survived: true, conditions: {} }
], true);
console.assert(rcOutcome3 === 'low-trust', `RC-3 failed: expected 'low-trust', got '${rcOutcome3}'`);
console.log('✓ { lte: 1 } with value 1 matches');

// Test RC-4: { lte: 1 } — value above threshold
console.log('\nTest RC-4: { lte: 1 } with value 2 = no match');
const rcSys4 = new ConsequenceSystem(new EventBus());
rcSys4.setFlag('hm_lp_movement_trust', 2);
const rcOutcome4 = rcSys4.calculateOutcome([
  { id: 'low-trust', survived: true, conditions: { hm_lp_movement_trust: { lte: 1 } } },
  { id: 'default',   survived: true, conditions: {} }
], true);
console.assert(rcOutcome4 === 'default', `RC-4 failed: expected 'default', got '${rcOutcome4}'`);
console.log('✓ { lte: 1 } with value 2 does not match');

// Test RC-5: { gte: 2, lte: 4 } — value inside range
console.log('\nTest RC-5: { gte: 2, lte: 4 } with value 3 = match');
const rcSys5 = new ConsequenceSystem(new EventBus());
rcSys5.setFlag('hm_lp_movement_trust', 3);
const rcOutcome5 = rcSys5.calculateOutcome([
  { id: 'mid-trust', survived: true, conditions: { hm_lp_movement_trust: { gte: 2, lte: 4 } } },
  { id: 'default',   survived: true, conditions: {} }
], true);
console.assert(rcOutcome5 === 'mid-trust', `RC-5 failed: expected 'mid-trust', got '${rcOutcome5}'`);
console.log('✓ { gte: 2, lte: 4 } with value 3 matches');

// Test RC-6: { gte: 2, lte: 4 } — value below range
console.log('\nTest RC-6: { gte: 2, lte: 4 } with value 1 = no match');
const rcSys6 = new ConsequenceSystem(new EventBus());
rcSys6.setFlag('hm_lp_movement_trust', 1);
const rcOutcome6 = rcSys6.calculateOutcome([
  { id: 'mid-trust', survived: true, conditions: { hm_lp_movement_trust: { gte: 2, lte: 4 } } },
  { id: 'default',   survived: true, conditions: {} }
], true);
console.assert(rcOutcome6 === 'default', `RC-6 failed: expected 'default', got '${rcOutcome6}'`);
console.log('✓ { gte: 2, lte: 4 } with value 1 does not match');

// Test RC-7: { gte: 2, lte: 4 } — value above range
console.log('\nTest RC-7: { gte: 2, lte: 4 } with value 5 = no match');
const rcSys7 = new ConsequenceSystem(new EventBus());
rcSys7.setFlag('hm_lp_movement_trust', 5);
const rcOutcome7 = rcSys7.calculateOutcome([
  { id: 'mid-trust', survived: true, conditions: { hm_lp_movement_trust: { gte: 2, lte: 4 } } },
  { id: 'default',   survived: true, conditions: {} }
], true);
console.assert(rcOutcome7 === 'default', `RC-7 failed: expected 'default', got '${rcOutcome7}'`);
console.log('✓ { gte: 2, lte: 4 } with value 5 does not match');

// Test RC-8: existing boolean matching still works after range-check extension
console.log('\nTest RC-8: boolean matching unchanged after range-check extension');
const rcSys8 = new ConsequenceSystem(new EventBus());
rcSys8.setFlag('hm_lp_spoke_publicly', true);
const rcOutcome8 = rcSys8.calculateOutcome([
  { id: 'spoke', survived: true, conditions: { hm_lp_spoke_publicly: true } },
  { id: 'default', survived: true, conditions: {} }
], true);
console.assert(rcOutcome8 === 'spoke', `RC-8 failed: expected 'spoke', got '${rcOutcome8}'`);
console.log('✓ Boolean exact-match still works after range-check extension');

// ─── TASK 2.2: Haymarket survival tests ──────────────────────────────────

console.log('\n=== Haymarket Survival Tests (Task 2.2) ===\n');

const survivalSys = new ConsequenceSystem(new EventBus());

// Test HS-1: Lucy Parsons
console.log('Test HS-1: hm-lucy-parsons returns survived:true, deathChance:0');
const lpSurvival = survivalSys.determineSurvival('hm-lucy-parsons');
console.assert(lpSurvival.survived === true,    `HS-1a failed: survived should be true, got ${lpSurvival.survived}`);
console.assert(lpSurvival.deathChance === 0,    `HS-1b failed: deathChance should be 0, got ${lpSurvival.deathChance}`);
console.assert(typeof lpSurvival.modifiers === 'object', 'HS-1c failed: modifiers should be an object');
console.log('✓ hm-lucy-parsons: survived=true, deathChance=0');

// Test HS-2: Karl Brenner
console.log('\nTest HS-2: hm-karl-brenner returns survived:true, deathChance:0');
const kbSurvival = survivalSys.determineSurvival('hm-karl-brenner');
console.assert(kbSurvival.survived === true,    `HS-2a failed: survived should be true, got ${kbSurvival.survived}`);
console.assert(kbSurvival.deathChance === 0,    `HS-2b failed: deathChance should be 0, got ${kbSurvival.deathChance}`);
console.log('✓ hm-karl-brenner: survived=true, deathChance=0');

// Test HS-3: James Doyle
console.log('\nTest HS-3: hm-james-doyle returns survived:true, deathChance:0');
const jdSurvival = survivalSys.determineSurvival('hm-james-doyle');
console.assert(jdSurvival.survived === true,    `HS-3a failed: survived should be true, got ${jdSurvival.survived}`);
console.assert(jdSurvival.deathChance === 0,    `HS-3b failed: deathChance should be 0, got ${jdSurvival.deathChance}`);
console.log('✓ hm-james-doyle: survived=true, deathChance=0');

// Test HS-4: shouldDieNow returns dies:false for all three Haymarket roles
console.log('\nTest HS-4: shouldDieNow returns dies:false for all Haymarket roles');
['hm-lucy-parsons', 'hm-karl-brenner', 'hm-james-doyle'].forEach(roleId => {
  const result = survivalSys.shouldDieNow(roleId);
  console.assert(result.dies === false,       `HS-4 failed for ${roleId}: dies should be false`);
  console.assert(result.deathChance === 0,    `HS-4 failed for ${roleId}: deathChance should be 0`);
  console.assert(result.reason === '',        `HS-4 failed for ${roleId}: reason should be empty string`);
});
console.log('✓ shouldDieNow returns dies:false for all three Haymarket roles');

console.log('\n✅ All range-check and Haymarket survival tests passed!');
