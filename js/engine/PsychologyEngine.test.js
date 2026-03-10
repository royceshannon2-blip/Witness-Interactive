/**
 * PsychologyEngine Unit Tests
 */

import PsychologyEngine from './PsychologyEngine.js';
import { GRADE_CONFIG, ARCHETYPES } from '../content/missions/pearl-harbor/psychology-data.js';

// Mock EventBus
class MockEventBus {
  constructor() {
    this.events = [];
  }
  emit(eventName, data) {
    this.events.push({ eventName, data });
  }
}

console.log('=== PsychologyEngine Unit Tests ===');

// Test 1: Score initialization
console.log('\nTest 1: Score initialization');
const eventBus = new MockEventBus();
const engine = new PsychologyEngine(eventBus);
engine.init();
const initialScores = engine.getScores();

if (initialScores.morale === 50 && 
    initialScores.loyalty === 50 && 
    initialScores.awareness === 50 && 
    initialScores.composure === 50) {
  console.log('✓ All scores initialized to 50');
} else {
  console.error('✗ Scores not initialized correctly:', initialScores);
}

// Test 2: Apply effects
console.log('\nTest 2: Apply effects');
engine.applyEffects({ morale: 10, loyalty: -5, awareness: 15, composure: 0 }, 'test-scene-01', 'test-choice-01');
const scores1 = engine.getScores();

if (scores1.morale === 60 && scores1.loyalty === 45 && scores1.awareness === 65 && scores1.composure === 50) {
  console.log('✓ Effects applied correctly');
} else {
  console.error('✗ Effects not applied correctly:', scores1);
}

// Test 3: Score clamping (upper bound)
console.log('\nTest 3: Score clamping (upper bound)');
engine.applyEffects({ morale: 100, loyalty: 100, awareness: 100, composure: 100 }, 'test-scene-02', 'test-choice-02');
const scores2 = engine.getScores();

if (scores2.morale === 100 && scores2.loyalty === 100 && scores2.awareness === 100 && scores2.composure === 100) {
  console.log('✓ Scores clamped to 100');
} else {
  console.error('✗ Scores not clamped correctly:', scores2);
}

// Test 4: Score clamping (lower bound)
console.log('\nTest 4: Score clamping (lower bound)');
engine.init();
engine.applyEffects({ morale: -100, loyalty: -100, awareness: -100, composure: -100 }, 'test-scene-03', 'test-choice-03');
const scores3 = engine.getScores();

if (scores3.morale === 0 && scores3.loyalty === 0 && scores3.awareness === 0 && scores3.composure === 0) {
  console.log('✓ Scores clamped to 0');
} else {
  console.error('✗ Scores not clamped correctly:', scores3);
}

// Test 5: Reset functionality
console.log('\nTest 5: Reset functionality');
engine.init();
engine.applyEffects({ morale: 20, loyalty: 15, awareness: 10, composure: 5 }, 'test', 'test');
engine.reset();
const scoresAfterReset = engine.getScores();
const historyAfterReset = engine.getHistory();

if (scoresAfterReset.morale === 50 && 
    scoresAfterReset.loyalty === 50 && 
    scoresAfterReset.awareness === 50 && 
    scoresAfterReset.composure === 50 &&
    historyAfterReset.length === 0) {
  console.log('✓ Reset clears scores and history');
} else {
  console.error('✗ Reset did not clear state correctly');
}

console.log('\n=== PsychologyEngine Tests Complete ===');
