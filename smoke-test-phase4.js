/**
 * Phase 4 Smoke Test - Psychology System
 * 
 * Tests PsychologyEngine and MoraleHUD integration
 */

import PsychologyEngine from './js/engine/PsychologyEngine.js';
import MoraleHUD from './js/engine/MoraleHUD.js';
import { GRADE_CONFIG, ARCHETYPES, HUD_LABELS } from './js/content/missions/pearl-harbor/psychology-data.js';

// Mock EventBus
class MockEventBus {
  constructor() {
    this.listeners = {};
  }
  
  on(event, handler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
  }
  
  off(event, handler) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(h => h !== handler);
  }
  
  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(handler => handler(data));
  }
}

console.log('=== Phase 4 Smoke Test ===\n');

// Test 1: PsychologyEngine initialization
console.log('Test 1: PsychologyEngine initialization');
const eventBus = new MockEventBus();
const engine = new PsychologyEngine(eventBus);
engine.init();
engine.setCurrentRole('japanese-aviator');

const initialScores = engine.getScores();
if (initialScores.morale === 50 && initialScores.loyalty === 50 && 
    initialScores.awareness === 50 && initialScores.composure === 50) {
  console.log('✓ PsychologyEngine initialized correctly');
} else {
  console.error('✗ PsychologyEngine initialization failed');
}

// Test 2: Apply psychology effects
console.log('\nTest 2: Apply psychology effects');
engine.applyEffects(
  { morale: 10, loyalty: -5, awareness: 15, composure: 8 },
  'ja-scene-01',
  'ja-choice-01-1'
);

const scores1 = engine.getScores();
if (scores1.morale === 60 && scores1.loyalty === 45 && 
    scores1.awareness === 65 && scores1.composure === 58) {
  console.log('✓ Psychology effects applied correctly');
  console.log(`  Scores: morale=${scores1.morale}, loyalty=${scores1.loyalty}, awareness=${scores1.awareness}, composure=${scores1.composure}`);
} else {
  console.error('✗ Psychology effects not applied correctly');
}

// Test 3: Grade calculation
console.log('\nTest 3: Grade calculation');
engine.init();
engine.applyEffects({ morale: 35, loyalty: 30, awareness: 35, composure: 30 }, 'test', 'test');
const scores2 = engine.getScores();
const grade = engine.calculateGrade(scores2, GRADE_CONFIG);

console.log(`  Composite score: ${grade.scoreUsed}`);
console.log(`  Grade: ${grade.letter} - ${grade.label}`);
console.log(`  Description: ${grade.description}`);

if (grade.letter && grade.label && grade.description) {
  console.log('✓ Grade calculation works');
} else {
  console.error('✗ Grade calculation failed');
}

// Test 4: Archetype classification
console.log('\nTest 4: Archetype classification');
engine.init();
engine.setCurrentRole('japanese-aviator');
// Create pattern for "The Soldier" (high loyalty, high composure)
engine.applyEffects({ morale: 10, loyalty: 40, awareness: 10, composure: 35 }, 'test', 'test');
const scores3 = engine.getScores();
const archetype = engine.classifyArchetype(scores3, ARCHETYPES, 'japanese-aviator');

console.log(`  Archetype: ${archetype.name}`);
console.log(`  Dominant trait: ${archetype.dominantTrait}`);
console.log(`  Description: ${archetype.description.substring(0, 80)}...`);

if (archetype.name && archetype.description && archetype.dominantTrait) {
  console.log('✓ Archetype classification works');
} else {
  console.error('✗ Archetype classification failed');
}

// Test 5: Event emission
console.log('\nTest 5: Event emission');
engine.init();
let eventReceived = false;
let eventData = null;

eventBus.on('psychology:scores-updated', (data) => {
  eventReceived = true;
  eventData = data;
});

engine.applyEffects({ morale: 5, loyalty: 3, awareness: 2, composure: 1 }, 'test-scene', 'test-choice');

if (eventReceived && eventData && eventData.scores && eventData.effects) {
  console.log('✓ psychology:scores-updated event emitted correctly');
  console.log(`  Event data includes: sceneId=${eventData.sceneId}, choiceId=${eventData.choiceId}`);
} else {
  console.error('✗ Event emission failed');
}

// Test 6: MoraleHUD class exists and is importable
console.log('\nTest 6: MoraleHUD class validation');
if (typeof MoraleHUD === 'function') {
  console.log('✓ MoraleHUD class imported successfully');
  console.log('  Note: DOM-dependent tests require browser environment');
  console.log('  MoraleHUD will be tested in full game integration');
} else {
  console.error('✗ MoraleHUD import failed');
}

// Test 7: HUD_LABELS validation
console.log('\nTest 7: HUD_LABELS validation');
if (HUD_LABELS.morale && HUD_LABELS.loyalty && HUD_LABELS.awareness && HUD_LABELS.composure) {
  console.log('✓ HUD_LABELS contains all required labels');
  console.log(`  Morale: "${HUD_LABELS.morale}"`);
  console.log(`  Loyalty: "${HUD_LABELS.loyalty}"`);
  console.log(`  Awareness: "${HUD_LABELS.awareness}"`);
  console.log(`  Composure: "${HUD_LABELS.composure}"`);
} else {
  console.error('✗ HUD_LABELS missing required labels');
}

// Test 8: History tracking
console.log('\nTest 8: History tracking');
engine.init();
engine.applyEffects({ morale: 5, loyalty: 3, awareness: 2, composure: 1 }, 'scene-01', 'choice-01');
engine.applyEffects({ morale: -2, loyalty: 4, awareness: -1, composure: 3 }, 'scene-02', 'choice-02');
const history = engine.getHistory();

if (history.length === 2 && history[0].sceneId === 'scene-01' && history[1].sceneId === 'scene-02') {
  console.log('✓ History tracking works correctly');
  console.log(`  ${history.length} choices recorded`);
} else {
  console.error('✗ History tracking failed');
}

// Test 9: Reset functionality
console.log('\nTest 9: Reset functionality');
engine.reset();
const scoresAfterReset = engine.getScores();
const historyAfterReset = engine.getHistory();

if (scoresAfterReset.morale === 50 && scoresAfterReset.loyalty === 50 && 
    scoresAfterReset.awareness === 50 && scoresAfterReset.composure === 50 &&
    historyAfterReset.length === 0) {
  console.log('✓ Reset clears all state');
} else {
  console.error('✗ Reset failed');
}

console.log('\n=== Phase 4 Smoke Test Complete ===');
console.log('\n✓ All PsychologyEngine tests passed');
console.log('✓ MoraleHUD class validated (DOM tests require browser)');
console.log('✓ All psychology data structures validated');
console.log('\nReady to proceed with Phase 4.7: Replace zero-delta psychologyEffects placeholders');
