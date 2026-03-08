/**
 * Outcome Calculation Logic Tests (Node.js compatible)
 * 
 * Tests the ConsequenceSystem.calculateOutcome() method in isolation.
 * Verifies that outcome calculation correctly matches consequence flags
 * to outcome rules.
 * 
 * Task 13.2: Create outcome screen logic
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

import EventBus from './EventBus.js';
import ConsequenceSystem from './ConsequenceSystem.js';

// Test output
const testResults = [];
function log(msg) {
  console.log(msg);
  testResults.push(msg);
}

log('=== Outcome Calculation Logic Tests ===\n');

// Test 1: Calculate outcome with exact match
function testExactMatch() {
  log('Test 1: Calculate outcome with exact matching conditions');
  
  const eventBus = new EventBus();
  const consequenceSystem = new ConsequenceSystem(eventBus);
  
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
  
  // Set flags that exactly match the first outcome
  consequenceSystem.setFlag('saved_others', true);
  consequenceSystem.setFlag('rescued_swimmers', true);
  
  const outcomeId = consequenceSystem.calculateOutcome(outcomeRules);
  
  if (outcomeId === 'outcome-hero') {
    log('✓ Returns correct outcome ID for exact match');
  } else {
    log(`✗ Expected 'outcome-hero', got '${outcomeId}'`);
  }
  
  log('');
}

// Test 2: Calculate outcome with partial match (should fail)
function testPartialMatch() {
  log('Test 2: Calculate outcome with partial match (should not match)');
  
  const eventBus = new EventBus();
  const consequenceSystem = new ConsequenceSystem(eventBus);
  
  const outcomeRules = [
    {
      id: 'outcome-specific',
      conditions: {
        flag_a: true,
        flag_b: true,
        flag_c: true
      },
      survived: false,
      epilogue: 'Specific outcome.'
    },
    {
      id: 'outcome-default',
      conditions: {},
      survived: true,
      epilogue: 'Default outcome.'
    }
  ];
  
  // Set only some of the required flags
  consequenceSystem.setFlag('flag_a', true);
  consequenceSystem.setFlag('flag_b', true);
  // flag_c is missing
  
  const outcomeId = consequenceSystem.calculateOutcome(outcomeRules);
  
  if (outcomeId === 'outcome-default') {
    log('✓ Falls back to default when partial match fails');
  } else {
    log(`✗ Expected 'outcome-default', got '${outcomeId}'`);
  }
  
  log('');
}

// Test 3: Calculate outcome with default (empty conditions)
function testDefaultOutcome() {
  log('Test 3: Calculate outcome with default (empty conditions)');
  
  const eventBus = new EventBus();
  const consequenceSystem = new ConsequenceSystem(eventBus);
  
  const outcomeRules = [
    {
      id: 'outcome-rare',
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
  
  // Don't set rare_flag, should match default
  consequenceSystem.setFlag('some_other_flag', true);
  
  const outcomeId = consequenceSystem.calculateOutcome(outcomeRules);
  
  if (outcomeId === 'outcome-default') {
    log('✓ Matches default outcome with empty conditions');
  } else {
    log(`✗ Expected 'outcome-default', got '${outcomeId}'`);
  }
  
  log('');
}

// Test 4: Calculate outcome with numeric flags
function testNumericFlags() {
  log('Test 4: Calculate outcome with numeric flag conditions');
  
  const eventBus = new EventBus();
  const consequenceSystem = new ConsequenceSystem(eventBus);
  
  const outcomeRules = [
    {
      id: 'outcome-high-score',
      conditions: {
        score: 100
      },
      survived: true,
      epilogue: 'Perfect score!'
    },
    {
      id: 'outcome-default',
      conditions: {},
      survived: true,
      epilogue: 'Default outcome.'
    }
  ];
  
  // Set numeric flag
  consequenceSystem.setFlag('score', 100);
  
  const outcomeId = consequenceSystem.calculateOutcome(outcomeRules);
  
  if (outcomeId === 'outcome-high-score') {
    log('✓ Correctly matches numeric flag conditions');
  } else {
    log(`✗ Expected 'outcome-high-score', got '${outcomeId}'`);
  }
  
  log('');
}

// Test 5: Calculate outcome with wrong numeric value
function testWrongNumericValue() {
  log('Test 5: Calculate outcome with wrong numeric value');
  
  const eventBus = new EventBus();
  const consequenceSystem = new ConsequenceSystem(eventBus);
  
  const outcomeRules = [
    {
      id: 'outcome-specific',
      conditions: {
        score: 100
      },
      survived: true,
      epilogue: 'Specific outcome.'
    },
    {
      id: 'outcome-default',
      conditions: {},
      survived: true,
      epilogue: 'Default outcome.'
    }
  ];
  
  // Set different numeric value
  consequenceSystem.setFlag('score', 50);
  
  const outcomeId = consequenceSystem.calculateOutcome(outcomeRules);
  
  if (outcomeId === 'outcome-default') {
    log('✓ Falls back to default when numeric value does not match');
  } else {
    log(`✗ Expected 'outcome-default', got '${outcomeId}'`);
  }
  
  log('');
}

// Test 6: Calculate outcome with multiple conditions
function testMultipleConditions() {
  log('Test 6: Calculate outcome with multiple conditions (all must match)');
  
  const eventBus = new EventBus();
  const consequenceSystem = new ConsequenceSystem(eventBus);
  
  const outcomeRules = [
    {
      id: 'outcome-complex',
      conditions: {
        flag_a: true,
        flag_b: false,
        flag_c: 5
      },
      survived: true,
      epilogue: 'Complex outcome.'
    },
    {
      id: 'outcome-default',
      conditions: {},
      survived: true,
      epilogue: 'Default outcome.'
    }
  ];
  
  // Set all flags correctly
  consequenceSystem.setFlag('flag_a', true);
  consequenceSystem.setFlag('flag_b', false);
  consequenceSystem.setFlag('flag_c', 5);
  
  const outcomeId = consequenceSystem.calculateOutcome(outcomeRules);
  
  if (outcomeId === 'outcome-complex') {
    log('✓ Correctly matches all conditions in complex outcome');
  } else {
    log(`✗ Expected 'outcome-complex', got '${outcomeId}'`);
  }
  
  log('');
}

// Test 7: Calculate outcome with first match wins
function testFirstMatchWins() {
  log('Test 7: Calculate outcome returns first matching rule');
  
  const eventBus = new EventBus();
  const consequenceSystem = new ConsequenceSystem(eventBus);
  
  const outcomeRules = [
    {
      id: 'outcome-first',
      conditions: {
        flag_a: true
      },
      survived: true,
      epilogue: 'First outcome.'
    },
    {
      id: 'outcome-second',
      conditions: {
        flag_a: true
      },
      survived: false,
      epilogue: 'Second outcome.'
    },
    {
      id: 'outcome-default',
      conditions: {},
      survived: true,
      epilogue: 'Default outcome.'
    }
  ];
  
  consequenceSystem.setFlag('flag_a', true);
  
  const outcomeId = consequenceSystem.calculateOutcome(outcomeRules);
  
  if (outcomeId === 'outcome-first') {
    log('✓ Returns first matching outcome (order matters)');
  } else {
    log(`✗ Expected 'outcome-first', got '${outcomeId}'`);
  }
  
  log('');
}

// Test 8: Error handling for invalid outcome rules
function testInvalidOutcomeRules() {
  log('Test 8: Error handling for invalid outcome rules');
  
  const eventBus = new EventBus();
  const consequenceSystem = new ConsequenceSystem(eventBus);
  
  // Test with null
  let outcomeId = consequenceSystem.calculateOutcome(null);
  if (outcomeId === null) {
    log('✓ Returns null for null outcome rules');
  } else {
    log(`✗ Expected null, got '${outcomeId}'`);
  }
  
  // Test with non-array
  outcomeId = consequenceSystem.calculateOutcome({ not: 'an array' });
  if (outcomeId === null) {
    log('✓ Returns null for non-array outcome rules');
  } else {
    log(`✗ Expected null, got '${outcomeId}'`);
  }
  
  log('');
}

// Test 9: Real-world scenario - American Sailor outcomes
function testAmericanSailorOutcomes() {
  log('Test 9: Real-world scenario - American Sailor outcomes');
  
  const eventBus = new EventBus();
  const consequenceSystem = new ConsequenceSystem(eventBus);
  
  // Simplified American Sailor outcome rules
  const outcomeRules = [
    {
      id: 'as-outcome-survived-hero',
      conditions: {
        saved_others: true,
        rescued_swimmers: true
      },
      survived: true,
      epilogue: 'Hero ending'
    },
    {
      id: 'as-outcome-survived-fighter',
      conditions: {
        fought_back: true,
        stayed_aboard: true
      },
      survived: true,
      epilogue: 'Fighter ending'
    },
    {
      id: 'as-outcome-survived-survivor',
      conditions: {
        survival_priority: true,
        abandoned_ship: true
      },
      survived: true,
      epilogue: 'Survivor ending'
    },
    {
      id: 'as-outcome-default',
      conditions: {},
      survived: true,
      epilogue: 'Default ending'
    }
  ];
  
  // Test hero path
  consequenceSystem.reset();
  consequenceSystem.setFlag('saved_others', true);
  consequenceSystem.setFlag('rescued_swimmers', true);
  let outcomeId = consequenceSystem.calculateOutcome(outcomeRules);
  
  if (outcomeId === 'as-outcome-survived-hero') {
    log('✓ Hero path outcome calculated correctly');
  } else {
    log(`✗ Hero path: Expected 'as-outcome-survived-hero', got '${outcomeId}'`);
  }
  
  // Test fighter path
  consequenceSystem.reset();
  consequenceSystem.setFlag('fought_back', true);
  consequenceSystem.setFlag('stayed_aboard', true);
  outcomeId = consequenceSystem.calculateOutcome(outcomeRules);
  
  if (outcomeId === 'as-outcome-survived-fighter') {
    log('✓ Fighter path outcome calculated correctly');
  } else {
    log(`✗ Fighter path: Expected 'as-outcome-survived-fighter', got '${outcomeId}'`);
  }
  
  // Test survivor path
  consequenceSystem.reset();
  consequenceSystem.setFlag('survival_priority', true);
  consequenceSystem.setFlag('abandoned_ship', true);
  outcomeId = consequenceSystem.calculateOutcome(outcomeRules);
  
  if (outcomeId === 'as-outcome-survived-survivor') {
    log('✓ Survivor path outcome calculated correctly');
  } else {
    log(`✗ Survivor path: Expected 'as-outcome-survived-survivor', got '${outcomeId}'`);
  }
  
  // Test default path
  consequenceSystem.reset();
  consequenceSystem.setFlag('some_random_flag', true);
  outcomeId = consequenceSystem.calculateOutcome(outcomeRules);
  
  if (outcomeId === 'as-outcome-default') {
    log('✓ Default path outcome calculated correctly');
  } else {
    log(`✗ Default path: Expected 'as-outcome-default', got '${outcomeId}'`);
  }
  
  log('');
}

// Run all tests
testExactMatch();
testPartialMatch();
testDefaultOutcome();
testNumericFlags();
testWrongNumericValue();
testMultipleConditions();
testFirstMatchWins();
testInvalidOutcomeRules();
testAmericanSailorOutcomes();

// Summary
log('=== Test Summary ===');
const passed = testResults.filter(r => r.includes('✓')).length;
const failed = testResults.filter(r => r.includes('✗')).length;
log(`Passed: ${passed}`);
log(`Failed: ${failed}`);

if (failed === 0) {
  log('\n✓ All outcome calculation tests passed!');
  log('Task 13.2 verification: ConsequenceSystem.calculateOutcome() works correctly');
} else {
  log(`\n✗ ${failed} test(s) failed`);
  process.exit(1);
}
