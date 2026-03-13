/**
 * PathClassifier Unit Tests
 */

import PathClassifier from './PathClassifier.js';
import { PATH_RULES } from '../content/missions/pearl-harbor/psychology-data.js';

console.log('=== PathClassifier Unit Tests ===\n');

// Test 1: Compliance path classification
console.log('Test 1: Compliance path classification');
const complianceFlags = {
  disciplined_mindset: true,
  followed_orders: true,
  disciplined_approach: true,
  perfect_execution: true,
  obedience: true
};

const result1 = PathClassifier.classify(complianceFlags, PATH_RULES);
if (result1 === 'compliance') {
  console.log('✓ Correctly classified compliance path');
} else {
  console.error(`✗ Expected 'compliance', got '${result1}'`);
}

// Test 2: Instinct path classification
console.log('\nTest 2: Instinct path classification');
const instinctFlags = {
  strategic_focus: true,
  tactical_caution: true,
  fuel_conserved: true,
  strategic_thinking: 2,
  survival_instinct: 2,
  resource_management: true,
  strategic_preservation: true
};

const result2 = PathClassifier.classify(instinctFlags, PATH_RULES);
if (result2 === 'instinct') {
  console.log('✓ Correctly classified instinct path');
} else {
  console.error(`✗ Expected 'instinct', got '${result2}'`);
}

// Test 3: Witness path classification
console.log('\nTest 3: Witness path classification');
const witnessFlags = {
  moral_awareness: true,
  emotional_conflict: 2,
  selective_targeting: true,
  moral_acceptance: true,
  compassionate_risk: true,
  helped_comrade: true,
  honor_code: 2
};

const result3 = PathClassifier.classify(witnessFlags, PATH_RULES);
if (result3 === 'witness') {
  console.log('✓ Correctly classified witness path');
} else {
  console.error(`✗ Expected 'witness', got '${result3}'`);
}

// Test 4: Tie-breaking (should default to witness)
console.log('\nTest 4: Tie-breaking with empty flags');
const emptyFlags = {};
const result4 = PathClassifier.classify(emptyFlags, PATH_RULES);
if (result4 === 'witness') {
  console.log('✓ Correctly defaults to witness on tie');
} else {
  console.error(`✗ Expected 'witness' default, got '${result4}'`);
}

// Test 5: Get summary
console.log('\nTest 5: Get path summary');
const summary = PathClassifier.getSummary('compliance');
if (summary.name && summary.description && Array.isArray(summary.characteristics)) {
  console.log('✓ Summary has required fields');
  console.log(`  Name: ${summary.name}`);
  console.log(`  Description: ${summary.description}`);
} else {
  console.error('✗ Summary missing required fields');
}

// Test 6: Get other paths
console.log('\nTest 6: Get other paths');
const otherPaths = PathClassifier.getOtherPaths('compliance');
if (Array.isArray(otherPaths) && otherPaths.length === 2) {
  console.log('✓ Returns 2 other paths');
  const variants = otherPaths.map(p => p.variant);
  if (variants.includes('instinct') && variants.includes('witness')) {
    console.log('✓ Returns correct path variants');
  } else {
    console.error('✗ Incorrect path variants returned');
  }
} else {
  console.error('✗ Should return 2 other paths');
}

// Test 7: Validate rules
console.log('\nTest 7: Validate path rules');
const validation = PathClassifier.validateRules(PATH_RULES);
if (validation.valid) {
  console.log('✓ Path rules are valid');
} else {
  console.error('✗ Path rules validation failed:');
  validation.errors.forEach(err => console.error(`  - ${err}`));
}

// Test 8: Mixed flags (should pick highest score)
console.log('\nTest 8: Mixed flags classification');
const mixedFlags = {
  // Some compliance flags
  followed_orders: true,
  disciplined_approach: true,
  // More instinct flags with higher weights
  strategic_focus: true,
  fuel_conserved: true,
  strategic_thinking: 3,
  survival_instinct: 3,
  resource_management: true,
  strategic_preservation: true,
  tactical_awareness: true
};

const result8 = PathClassifier.classify(mixedFlags, PATH_RULES);
console.log(`  Classified as: ${result8}`);
if (result8 === 'instinct') {
  console.log('✓ Correctly chose path with highest score');
} else {
  console.log(`  Note: Expected 'instinct' but got '${result8}' - check flag weights`);
}

console.log('\n=== PathClassifier Tests Complete ===');
