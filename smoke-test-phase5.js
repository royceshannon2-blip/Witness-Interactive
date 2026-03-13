/**
 * Phase 5 Smoke Test: Outcome System
 * 
 * Tests survival probability system and outcome selection.
 * This is a manual test - run multiple times to verify probability distribution.
 * 
 * Expected results:
 * - American Sailor: ~78% death rate (most playthroughs should result in death)
 * - Japanese Aviator: ~35% death rate (roughly 1-2 deaths in 5 playthroughs)
 * - American Civilian: ~2% death rate (almost always survival)
 * - deathContext panel should render on death outcomes
 * - Different death epilogues based on choices made
 */

import ConsequenceSystem from './js/engine/ConsequenceSystem.js';
import EventBus from './js/engine/EventBus.js';
import japaneseAviatorRole from './js/content/missions/pearl-harbor/japanese-aviator.js';
import americanSailorRole from './js/content/missions/pearl-harbor/american-sailor.js';
import americanCivilianRole from './js/content/missions/pearl-harbor/american-civilian.js';

console.log('=== Phase 5 Smoke Test: Outcome System ===\n');

const eventBus = new EventBus();
const consequenceSystem = new ConsequenceSystem(eventBus);

let passCount = 0;
let failCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✓ ${description}`);
    passCount++;
  } catch (err) {
    console.error(`✗ ${description}`);
    console.error(`  ${err.message}`);
    failCount++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// ─── TEST 1: American Sailor High Death Rate ────────────────────────────────

console.log('\n--- Test 1: American Sailor Survival Probability ---');
console.log('Running 10 simulations with high-risk choices (below deck + stayed aboard)...\n');

consequenceSystem.reset();
consequenceSystem.setCurrentRole('american-sailor');

// Simulate high-risk choices
consequenceSystem.setFlag('damage_control', true);
consequenceSystem.setFlag('duty_focused', 1);
consequenceSystem.setFlag('stayed_aboard', true);

let sailorDeaths = 0;
const sailorResults = [];

for (let i = 0; i < 10; i++) {
  const survival = consequenceSystem.determineSurvival('american-sailor');
  sailorResults.push(survival);
  if (!survival.survived) sailorDeaths++;
}

console.log(`Deaths: ${sailorDeaths}/10 (${(sailorDeaths/10*100).toFixed(0)}%)`);
console.log(`Expected: ~90% death rate with high-risk choices`);

test('American Sailor: High death rate with risky choices', () => {
  assert(sailorDeaths >= 7, `Expected 7+ deaths, got ${sailorDeaths}`);
});

// ─── TEST 2: American Sailor Low Death Rate ─────────────────────────────────

console.log('\n--- Test 2: American Sailor with Survival Choices ---');
console.log('Running 10 simulations with survival-focused choices...\n');

consequenceSystem.reset();
consequenceSystem.setCurrentRole('american-sailor');

// Simulate survival-focused choices
consequenceSystem.setFlag('abandoned_ship', true);
consequenceSystem.setFlag('quick_reaction', true);
consequenceSystem.setFlag('survival_priority', true);
consequenceSystem.setFlag('prepared_for_disaster', 1);

let sailorSurvivals = 0;

for (let i = 0; i < 10; i++) {
  const survival = consequenceSystem.determineSurvival('american-sailor');
  if (survival.survived) sailorSurvivals++;
}

console.log(`Survivals: ${sailorSurvivals}/10 (${(sailorSurvivals/10*100).toFixed(0)}%)`);
console.log(`Expected: ~50-60% survival rate with good choices`);

test('American Sailor: Improved survival with good choices', () => {
  assert(sailorSurvivals >= 3, `Expected 3+ survivals, got ${sailorSurvivals}`);
});

// ─── TEST 3: Japanese Aviator Moderate Death Rate ───────────────────────────

console.log('\n--- Test 3: Japanese Aviator Survival Probability ---');
console.log('Running 10 simulations with baseline choices...\n');

consequenceSystem.reset();
consequenceSystem.setCurrentRole('japanese-aviator');

// Simulate baseline choices (no extreme risk or caution)
consequenceSystem.setFlag('followed_orders', true);
consequenceSystem.setFlag('disciplined_approach', true);

let aviatorDeaths = 0;

for (let i = 0; i < 10; i++) {
  const survival = consequenceSystem.determineSurvival('japanese-aviator');
  if (!survival.survived) aviatorDeaths++;
}

console.log(`Deaths: ${aviatorDeaths}/10 (${(aviatorDeaths/10*100).toFixed(0)}%)`);
console.log(`Expected: ~28% death rate with disciplined choices (baseline 35% - 7% modifier)`);

test('Japanese Aviator: Moderate death rate', () => {
  assert(aviatorDeaths >= 1 && aviatorDeaths <= 5, `Expected 1-5 deaths, got ${aviatorDeaths}`);
});

// ─── TEST 4: Japanese Aviator High Risk ─────────────────────────────────────

console.log('\n--- Test 4: Japanese Aviator with Aggressive Choices ---');
console.log('Running 10 simulations with high-risk choices...\n');

consequenceSystem.reset();
consequenceSystem.setCurrentRole('japanese-aviator');

// Simulate aggressive choices
consequenceSystem.setFlag('aggressive_action', 2);
consequenceSystem.setFlag('mission_priority', true);
consequenceSystem.setFlag('fuel_risk', true);

let aviatorHighRiskDeaths = 0;

for (let i = 0; i < 10; i++) {
  const survival = consequenceSystem.determineSurvival('japanese-aviator');
  if (!survival.survived) aviatorHighRiskDeaths++;
}

console.log(`Deaths: ${aviatorHighRiskDeaths}/10 (${(aviatorHighRiskDeaths/10*100).toFixed(0)}%)`);
console.log(`Expected: ~80% death rate with aggressive choices (35% + 45% modifiers)`);

test('Japanese Aviator: High death rate with aggressive choices', () => {
  assert(aviatorHighRiskDeaths >= 6, `Expected 6+ deaths, got ${aviatorHighRiskDeaths}`);
});

// ─── TEST 5: American Civilian Low Death Rate ───────────────────────────────

console.log('\n--- Test 5: American Civilian Survival Probability ---');
console.log('Running 20 simulations with baseline choices...\n');

consequenceSystem.reset();
consequenceSystem.setCurrentRole('american-civilian');

// Simulate baseline choices
consequenceSystem.setFlag('family_priority', true);
consequenceSystem.setFlag('survival_focused', 1);

let civilianDeaths = 0;

for (let i = 0; i < 20; i++) {
  const survival = consequenceSystem.determineSurvival('american-civilian');
  if (!survival.survived) civilianDeaths++;
}

console.log(`Deaths: ${civilianDeaths}/20 (${(civilianDeaths/20*100).toFixed(0)}%)`);
console.log(`Expected: ~1% death rate with safe choices (2% - 1% modifier)`);

test('American Civilian: Very low death rate', () => {
  assert(civilianDeaths <= 2, `Expected 0-2 deaths, got ${civilianDeaths}`);
});

// ─── TEST 6: American Civilian High Risk ────────────────────────────────────

console.log('\n--- Test 6: American Civilian with High-Risk Choices ---');
console.log('Running 20 simulations with high-risk choices...\n');

consequenceSystem.reset();
consequenceSystem.setCurrentRole('american-civilian');

// Simulate high-risk choices
consequenceSystem.setFlag('rushed_to_help', true);
consequenceSystem.setFlag('went_to_harbor', true);
consequenceSystem.setFlag('rescued_victim', true);
consequenceSystem.setFlag('stayed_to_help', true);

let civilianHighRiskDeaths = 0;

for (let i = 0; i < 20; i++) {
  const survival = consequenceSystem.determineSurvival('american-civilian');
  if (!survival.survived) civilianHighRiskDeaths++;
}

console.log(`Deaths: ${civilianHighRiskDeaths}/20 (${(civilianHighRiskDeaths/20*100).toFixed(0)}%)`);
console.log(`Expected: ~24% death rate with high-risk choices (2% + 22% modifiers)`);

test('American Civilian: Elevated death rate with risky choices', () => {
  assert(civilianHighRiskDeaths >= 2, `Expected 2+ deaths, got ${civilianHighRiskDeaths}`);
});

// ─── TEST 7: Outcome Selection (Survived) ───────────────────────────────────

console.log('\n--- Test 7: Outcome Selection for Survival ---');

consequenceSystem.reset();
consequenceSystem.setCurrentRole('japanese-aviator');
consequenceSystem.setFlag('moral_awareness', true);
consequenceSystem.setFlag('helped_comrade', true);

const outcomeIdSurvived = consequenceSystem.calculateOutcome(
  japaneseAviatorRole.outcomes,
  true // survived
);

test('Outcome selection returns valid ID for survival', () => {
  assert(outcomeIdSurvived, 'Expected outcome ID, got null');
  assert(typeof outcomeIdSurvived === 'string', 'Expected string ID');
});

const outcomeSurvived = japaneseAviatorRole.outcomes.find(o => o.id === outcomeIdSurvived);

test('Selected outcome matches survival status', () => {
  assert(outcomeSurvived, `Outcome ${outcomeIdSurvived} not found`);
  assert(outcomeSurvived.survived === true, 'Expected survived=true');
});

test('Selected outcome has epilogue', () => {
  assert(outcomeSurvived.epilogue, 'Expected epilogue text');
  assert(outcomeSurvived.epilogue.length > 50, 'Expected substantial epilogue');
});

console.log(`Selected outcome: ${outcomeIdSurvived}`);
console.log(`Epilogue length: ${outcomeSurvived.epilogue.length} characters`);

// ─── TEST 8: Outcome Selection (Death) ──────────────────────────────────────

console.log('\n--- Test 8: Outcome Selection for Death ---');

consequenceSystem.reset();
consequenceSystem.setCurrentRole('american-sailor');
consequenceSystem.setFlag('damage_control', true);
consequenceSystem.setFlag('duty_focused', 1);

const outcomeIdDeath = consequenceSystem.calculateOutcome(
  americanSailorRole.outcomes,
  false // died
);

test('Outcome selection returns valid ID for death', () => {
  assert(outcomeIdDeath, 'Expected outcome ID, got null');
  assert(typeof outcomeIdDeath === 'string', 'Expected string ID');
});

const outcomeDeath = americanSailorRole.outcomes.find(o => o.id === outcomeIdDeath);

test('Selected death outcome has deathContext', () => {
  assert(outcomeDeath, `Outcome ${outcomeIdDeath} not found`);
  assert(outcomeDeath.survived === false, 'Expected survived=false');
  assert(outcomeDeath.deathContext, 'Expected deathContext object');
});

test('deathContext has required fields', () => {
  assert(outcomeDeath.deathContext.cause, 'Expected cause field');
  assert(outcomeDeath.deathContext.historicalRate, 'Expected historicalRate field');
  assert(outcomeDeath.deathContext.yourChoices, 'Expected yourChoices field');
});

console.log(`Selected outcome: ${outcomeIdDeath}`);
console.log(`Death cause: ${outcomeDeath.deathContext.cause}`);

// ─── TEST 9: All Roles Have Complete Outcomes ───────────────────────────────

console.log('\n--- Test 9: Outcome Data Completeness ---');

const roles = [
  { name: 'Japanese Aviator', data: japaneseAviatorRole },
  { name: 'American Sailor', data: americanSailorRole },
  { name: 'American Civilian', data: americanCivilianRole }
];

roles.forEach(role => {
  test(`${role.name}: Has outcomes array`, () => {
    assert(Array.isArray(role.data.outcomes), 'Expected outcomes array');
    assert(role.data.outcomes.length >= 8, `Expected 8+ outcomes, got ${role.data.outcomes.length}`);
  });

  const deathOutcomes = role.data.outcomes.filter(o => !o.survived);
  const survivalOutcomes = role.data.outcomes.filter(o => o.survived);

  test(`${role.name}: Has death outcomes`, () => {
    assert(deathOutcomes.length >= 4, `Expected 4+ death outcomes, got ${deathOutcomes.length}`);
  });

  test(`${role.name}: Has survival outcomes`, () => {
    assert(survivalOutcomes.length >= 4, `Expected 4+ survival outcomes, got ${survivalOutcomes.length}`);
  });

  test(`${role.name}: All death outcomes have deathContext`, () => {
    deathOutcomes.forEach(outcome => {
      assert(outcome.deathContext, `Outcome ${outcome.id} missing deathContext`);
      assert(outcome.deathContext.cause, `Outcome ${outcome.id} missing cause`);
      assert(outcome.deathContext.historicalRate, `Outcome ${outcome.id} missing historicalRate`);
      assert(outcome.deathContext.yourChoices, `Outcome ${outcome.id} missing yourChoices`);
    });
  });

  test(`${role.name}: All outcomes have epilogues`, () => {
    role.data.outcomes.forEach(outcome => {
      assert(outcome.epilogue, `Outcome ${outcome.id} missing epilogue`);
      assert(outcome.epilogue.length >= 100, `Outcome ${outcome.id} epilogue too short`);
    });
  });
});

// ─── SUMMARY ─────────────────────────────────────────────────────────────────

console.log('\n' + '='.repeat(60));
console.log('PHASE 5 SMOKE TEST SUMMARY');
console.log('='.repeat(60));
console.log(`✓ Passed: ${passCount}`);
console.log(`✗ Failed: ${failCount}`);
console.log('='.repeat(60));

if (failCount === 0) {
  console.log('\n✓ All Phase 5 tests passed!');
  console.log('\nManual verification checklist:');
  console.log('□ Play American Sailor 5 times - expect death most of the time (~78%)');
  console.log('□ Play Japanese Aviator 5 times - expect death roughly 1-2 times (~35%)');
  console.log('□ Play American Civilian 5 times - expect survival almost every time (~2%)');
  console.log('□ Verify deathContext panel renders on death outcomes');
  console.log('□ Verify death epilogues differ based on choices made');
  console.log('□ Verify no console errors during gameplay');
} else {
  console.log(`\n✗ ${failCount} test(s) failed. Fix issues before proceeding.`);
  process.exit(1);
}
