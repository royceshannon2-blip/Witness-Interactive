/**
 * SceneRouter.test.js
 * 
 * Unit tests for SceneRouter.js
 */

import { SceneRouter } from './SceneRouter.js';
import EventBus from './EventBus.js';

// Test data
const validRoleData = {
  id: 'test-role',
  startScene: 'scene-01',
  scenes: [
    {
      id: 'scene-01',
      narrative: 'This is the first scene with enough words to meet the minimum requirement for narrative length validation.',
      apThemes: ['causation'],
      choices: [
        { id: 'choice-1a', text: 'Go left', nextScene: 'scene-02a' },
        { id: 'choice-1b', text: 'Go right', nextScene: 'scene-02b' }
      ]
    },
    {
      id: 'scene-02a',
      narrative: 'You went left and found something interesting here in this branching path of the narrative.',
      apThemes: ['perspective'],
      choices: [
        { id: 'choice-2a', text: 'Continue', nextScene: 'scene-03' }
      ]
    },
    {
      id: 'scene-02b',
      narrative: 'You went right and discovered a different path through the story with unique consequences.',
      apThemes: ['continuity-and-change'],
      choices: [
        { id: 'choice-2b', text: 'Continue', nextScene: 'scene-03' }
      ]
    },
    {
      id: 'scene-03',
      narrative: 'Both paths converge here at the final scene where all narrative threads come together.',
      apThemes: ['causation', 'continuity-and-change'],
      choices: [
        { id: 'choice-3', text: 'End', nextScene: null }
      ]
    }
  ]
};

const roleWithBrokenReference = {
  id: 'broken-role',
  startScene: 'scene-01',
  scenes: [
    {
      id: 'scene-01',
      narrative: 'First scene',
      apThemes: ['causation'],
      choices: [
        { id: 'choice-1', text: 'Go', nextScene: 'scene-99' } // Non-existent scene
      ]
    }
  ]
};

const roleWithLoop = {
  id: 'loop-role',
  startScene: 'scene-01',
  scenes: [
    {
      id: 'scene-01',
      narrative: 'First scene that loops back to itself creating an infinite cycle.',
      apThemes: ['causation'],
      choices: [
        { id: 'choice-1', text: 'Loop', nextScene: 'scene-02' }
      ]
    },
    {
      id: 'scene-02',
      narrative: 'Second scene that completes the loop back to the first scene.',
      apThemes: ['causation'],
      choices: [
        { id: 'choice-2', text: 'Back', nextScene: 'scene-01' }
      ]
    }
  ]
};

const roleWithUnreachableScene = {
  id: 'unreachable-role',
  startScene: 'scene-01',
  scenes: [
    {
      id: 'scene-01',
      narrative: 'First scene that leads to the second scene only.',
      apThemes: ['causation'],
      choices: [
        { id: 'choice-1', text: 'Go', nextScene: 'scene-02' }
      ]
    },
    {
      id: 'scene-02',
      narrative: 'Second scene that is terminal and ends the story.',
      apThemes: ['causation'],
      choices: [
        { id: 'choice-2', text: 'End', nextScene: null }
      ]
    },
    {
      id: 'scene-03',
      narrative: 'This scene is unreachable because no choice points to it.',
      apThemes: ['causation'],
      choices: [
        { id: 'choice-3', text: 'End', nextScene: null }
      ]
    }
  ]
};

// Test suite
console.log('=== SceneRouter Unit Tests ===\n');

let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passCount++;
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(`  ${error.message}`);
    failCount++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// Test 1: Constructor initializes correctly
test('Constructor initializes correctly', () => {
  const eventBus = new EventBus();
  const router = new SceneRouter(eventBus);
  
  assert(router.eventBus === eventBus, 'EventBus should be stored');
  assert(router.sceneMap instanceof Map, 'Scene map should be initialized');
  assert(router.sceneMap.size === 0, 'Scene map should be empty');
  assert(router.startSceneId === null, 'Start scene ID should be null');
});

// Test 2: loadRole with valid data succeeds
test('loadRole with valid data succeeds', () => {
  const eventBus = new EventBus();
  const router = new SceneRouter(eventBus);
  
  const result = router.loadRole(validRoleData);
  
  assert(result.valid === true, 'Should return valid: true');
  assert(result.errors.length === 0, 'Should have no errors');
  assert(router.sceneMap.size === 4, 'Should load all 4 scenes');
  assert(router.startSceneId === 'scene-01', 'Should set start scene');
});

// Test 3: loadRole detects broken nextScene references
test('loadRole detects broken nextScene references', () => {
  const eventBus = new EventBus();
  const router = new SceneRouter(eventBus);
  
  const result = router.loadRole(roleWithBrokenReference);
  
  assert(result.valid === false, 'Should return valid: false');
  assert(result.errors.length > 0, 'Should have errors');
  assert(result.errors.some(e => e.includes('scene-99')), 'Should mention missing scene');
});

// Test 4: getScene returns correct scene
test('getScene returns correct scene', () => {
  const eventBus = new EventBus();
  const router = new SceneRouter(eventBus);
  router.loadRole(validRoleData);
  
  const scene = router.getScene('scene-01');
  
  assert(scene !== null, 'Should return scene object');
  assert(scene.id === 'scene-01', 'Should return correct scene');
  assert(scene.narrative.includes('first scene'), 'Should have correct narrative');
});

// Test 5: getScene returns null for non-existent scene
test('getScene returns null for non-existent scene', () => {
  const eventBus = new EventBus();
  const router = new SceneRouter(eventBus);
  router.loadRole(validRoleData);
  
  const scene = router.getScene('scene-99');
  
  assert(scene === null, 'Should return null for non-existent scene');
});

// Test 6: getStartScene returns correct scene
test('getStartScene returns correct scene', () => {
  const eventBus = new EventBus();
  const router = new SceneRouter(eventBus);
  router.loadRole(validRoleData);
  
  const scene = router.getStartScene();
  
  assert(scene !== null, 'Should return scene object');
  assert(scene.id === 'scene-01', 'Should return start scene');
});

// Test 7: isTerminal detects terminal scenes
test('isTerminal detects terminal scenes', () => {
  const eventBus = new EventBus();
  const router = new SceneRouter(eventBus);
  router.loadRole(validRoleData);
  
  const scene01 = router.getScene('scene-01');
  const scene03 = router.getScene('scene-03');
  
  assert(router.isTerminal(scene01) === false, 'scene-01 should not be terminal');
  assert(router.isTerminal(scene03) === true, 'scene-03 should be terminal');
});

// Test 8: validateScene detects missing required fields
test('validateScene detects missing required fields', () => {
  const eventBus = new EventBus();
  const router = new SceneRouter(eventBus);
  
  const invalidScene = {
    id: 'test',
    // Missing narrative
    // Missing apThemes
    choices: []
  };
  
  const warnings = router.validateScene(invalidScene);
  
  assert(warnings.length > 0, 'Should have warnings');
  assert(warnings.some(w => w.includes('narrative')), 'Should warn about missing narrative');
  assert(warnings.some(w => w.includes('apThemes')), 'Should warn about missing apThemes');
});

// Test 9: validateScene detects narrative length issues
test('validateScene detects narrative length issues', () => {
  const eventBus = new EventBus();
  const router = new SceneRouter(eventBus);
  
  const longNarrative = 'word '.repeat(200); // 200 words
  const sceneWithLongNarrative = {
    id: 'test',
    narrative: longNarrative,
    apThemes: ['causation'],
    choices: [{ id: 'c1', text: 'Go', nextScene: null }]
  };
  
  const warnings = router.validateScene(sceneWithLongNarrative);
  
  assert(warnings.some(w => w.includes('150 words')), 'Should warn about narrative length');
});

// Test 10: validatePaths detects unreachable scenes
test('validatePaths detects unreachable scenes', () => {
  const eventBus = new EventBus();
  const router = new SceneRouter(eventBus);
  router.loadRole(roleWithUnreachableScene);
  
  const result = router.validatePaths();
  
  assert(result.valid === false, 'Should return valid: false');
  assert(result.unreachableScenes.length > 0, 'Should detect unreachable scenes');
  assert(result.unreachableScenes.includes('scene-03'), 'Should identify scene-03 as unreachable');
});

// Test 11: validatePaths detects loops
test('validatePaths detects loops', () => {
  const eventBus = new EventBus();
  const router = new SceneRouter(eventBus);
  router.loadRole(roleWithLoop);
  
  const result = router.validatePaths();
  
  assert(result.valid === false, 'Should return valid: false');
  assert(result.loops.length > 0, 'Should detect loops');
});

// Test 12: validatePaths passes for valid role
test('validatePaths passes for valid role', () => {
  const eventBus = new EventBus();
  const router = new SceneRouter(eventBus);
  router.loadRole(validRoleData);
  
  const result = router.validatePaths();
  
  assert(result.valid === true, 'Should return valid: true');
  assert(result.unreachableScenes.length === 0, 'Should have no unreachable scenes');
  assert(result.loops.length === 0, 'Should have no loops');
});

// Test 13: loadRole handles null roleData
test('loadRole handles null roleData', () => {
  const eventBus = new EventBus();
  const router = new SceneRouter(eventBus);
  
  const result = router.loadRole(null);
  
  assert(result.valid === false, 'Should return valid: false');
  assert(result.errors.length > 0, 'Should have errors');
});

// Test 14: loadRole handles missing scenes array
test('loadRole handles missing scenes array', () => {
  const eventBus = new EventBus();
  const router = new SceneRouter(eventBus);
  
  const result = router.loadRole({ id: 'test', startScene: 'scene-01' });
  
  assert(result.valid === false, 'Should return valid: false');
  assert(result.errors.some(e => e.includes('scenes array')), 'Should mention missing scenes array');
});

// Test 15: loadRole handles duplicate scene IDs
test('loadRole handles duplicate scene IDs', () => {
  const eventBus = new EventBus();
  const router = new SceneRouter(eventBus);
  
  const roleWithDuplicates = {
    id: 'dup-role',
    startScene: 'scene-01',
    scenes: [
      {
        id: 'scene-01',
        narrative: 'First scene',
        apThemes: ['causation'],
        choices: [{ id: 'c1', text: 'Go', nextScene: null }]
      },
      {
        id: 'scene-01', // Duplicate
        narrative: 'Another first scene',
        apThemes: ['causation'],
        choices: [{ id: 'c2', text: 'Go', nextScene: null }]
      }
    ]
  };
  
  const result = router.loadRole(roleWithDuplicates);
  
  assert(result.valid === false, 'Should return valid: false');
  assert(result.errors.some(e => e.includes('Duplicate')), 'Should detect duplicate scene ID');
});

// Summary
console.log('\n=== Test Summary ===');
console.log(`Passed: ${passCount}`);
console.log(`Failed: ${failCount}`);
console.log(`Total: ${passCount + failCount}`);

if (failCount === 0) {
  console.log('\n✓ All tests passed!');
} else {
  console.log(`\n✗ ${failCount} test(s) failed`);
  process.exit(1);
}
