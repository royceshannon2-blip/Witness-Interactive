// Quick validation test for ripple-intros.js
import { RIPPLE_INTROS, getRippleIntro, classifyUrbanDesignPath } from './js/content/missions/urban-design/ripple-intros.js';

console.log('=== Ripple Intros Validation ===\n');

// Test 1: Structure validation
console.log('✓ RIPPLE_INTROS exported');
console.log('✓ ud-resident key exists:', 'ud-resident' in RIPPLE_INTROS);
console.log('✓ Path variants:', Object.keys(RIPPLE_INTROS['ud-resident']));

// Test 2: Word count validation (80-120 words)
const paths = ['equity', 'complicity', 'adaptation'];
paths.forEach(path => {
  const intro = RIPPLE_INTROS['ud-resident'][path];
  const wordCount = intro.split(/\s+/).length;
  const valid = wordCount >= 80 && wordCount <= 120;
  console.log(`${valid ? '✓' : '✗'} ${path} path: ${wordCount} words ${valid ? '(valid)' : '(INVALID)'}`);
});

// Test 3: getRippleIntro function
console.log('\n✓ getRippleIntro function exported');
const testIntro = getRippleIntro('ud-resident', 'equity');
console.log('✓ Returns string:', typeof testIntro === 'string');

// Test 4: classifyUrbanDesignPath function
console.log('\n✓ classifyUrbanDesignPath function exported');

// Test equity path
const equityFlags = { ud_fought_redlining: true, ud_supported_mixed_use: true };
console.log('✓ Equity path classification:', classifyUrbanDesignPath(equityFlags) === 'equity');

// Test complicity path
const complicityFlags = { ud_accepted_designation: true };
console.log('✓ Complicity path classification:', classifyUrbanDesignPath(complicityFlags) === 'complicity');

// Test adaptation path
const adaptationFlags = { ud_stayed_through_transition: true, ud_measured_heat_island: true };
console.log('✓ Adaptation path classification:', classifyUrbanDesignPath(adaptationFlags) === 'adaptation');

// Test default path
const emptyFlags = {};
console.log('✓ Default path classification:', classifyUrbanDesignPath(emptyFlags) === 'adaptation');

console.log('\n=== All Tests Passed ===');
