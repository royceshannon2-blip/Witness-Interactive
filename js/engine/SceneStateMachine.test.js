/**
 * SceneStateMachine Tests
 * 
 * Unit tests for scene transition logic and validation.
 * Tests scene loading, validation, transitions, and completion detection.
 */

import EventBus from './EventBus.js';
import SceneStateMachine from './SceneStateMachine.js';

// Test helper: Create a valid scene object
function createValidScene(id, nextSceneId = null) {
  return {
    id: id,
    narrative: `This is the narrative for ${id}`,
    apThemes: ['causation', 'perspective'],
    choices: [
      {
        id: `${id}-choice-1`,
        text: 'Choice 1',
        consequences: { flag1: true },
        nextScene: nextSceneId || `${id}-next`
      },
      {
        id: `${id}-choice-2`,
        text: 'Choice 2',
        consequences: { flag2: false },
        nextScene: nextSceneId || `${id}-next`
      }
    ],
    atmosphericEffect: null
  };
}

// Test 1: Constructor initializes correctly
console.log('Test 1: Constructor initializes correctly');
const eventBus1 = new EventBus();
const stateMachine1 = new SceneStateMachine(eventBus1);
console.assert(stateMachine1.scenes.length === 0, 'Initial scenes should be empty');
console.assert(stateMachine1.currentSceneIndex === 0, 'Initial scene index should be 0');
console.assert(stateMachine1.currentMissionId === null, 'Initial mission ID should be null');
console.assert(stateMachine1.currentRoleId === null, 'Initial role ID should be null');
console.log('✓ Test 1 passed');

// Test 2: loadRole() loads valid scenes
console.log('\nTest 2: loadRole() loads valid scenes');
const eventBus2 = new EventBus();
const stateMachine2 = new SceneStateMachine(eventBus2);
let transitionEventFired = false;
eventBus2.on('scene:transition', (data) => {
  transitionEventFired = true;
  console.assert(data.sceneId === 'scene-1', 'First scene should be scene-1');
  console.assert(data.sceneIndex === 0, 'Scene index should be 0');
  console.assert(data.totalScenes === 3, 'Total scenes should be 3');
});

const scenes = [
  createValidScene('scene-1', 'scene-2'),
  createValidScene('scene-2', 'scene-3'),
  createValidScene('scene-3', null)
];

stateMachine2.loadRole('test-mission', 'test-role', scenes);
console.assert(stateMachine2.scenes.length === 3, 'Should load 3 scenes');
console.assert(stateMachine2.currentMissionId === 'test-mission', 'Mission ID should be set');
console.assert(stateMachine2.currentRoleId === 'test-role', 'Role ID should be set');
console.assert(transitionEventFired, 'scene:transition event should fire');
console.log('✓ Test 2 passed');

// Test 3: validateScene() rejects invalid scenes
console.log('\nTest 3: validateScene() rejects invalid scenes');
const eventBus3 = new EventBus();
const stateMachine3 = new SceneStateMachine(eventBus3);

// Missing id
const invalidScene1 = {
  narrative: 'Test',
  apThemes: ['causation'],
  choices: []
};
console.assert(!stateMachine3.validateScene(invalidScene1), 'Should reject scene without id');

// Missing narrative
const invalidScene2 = {
  id: 'test',
  apThemes: ['causation'],
  choices: []
};
console.assert(!stateMachine3.validateScene(invalidScene2), 'Should reject scene without narrative');

// Missing apThemes
const invalidScene3 = {
  id: 'test',
  narrative: 'Test',
  choices: []
};
console.assert(!stateMachine3.validateScene(invalidScene3), 'Should reject scene without apThemes');

// Missing choices
const invalidScene4 = {
  id: 'test',
  narrative: 'Test',
  apThemes: ['causation']
};
console.assert(!stateMachine3.validateScene(invalidScene4), 'Should reject scene without choices');

console.log('✓ Test 3 passed');

// Test 4: validateScene() warns on empty apThemes
console.log('\nTest 4: validateScene() warns on empty apThemes');
const eventBus4 = new EventBus();
const stateMachine4 = new SceneStateMachine(eventBus4);
const originalWarn = console.warn;
let warningLogged = false;
console.warn = (msg) => {
  if (msg.includes('empty apThemes array')) {
    warningLogged = true;
  }
};

const sceneWithEmptyThemes = {
  id: 'test',
  narrative: 'Test',
  apThemes: [], // Empty array
  choices: [
    {
      id: 'choice-1',
      text: 'Test choice',
      nextScene: 'next',
      consequences: {}
    }
  ]
};

stateMachine4.validateScene(sceneWithEmptyThemes);
console.assert(warningLogged, 'Should log warning for empty apThemes');
console.warn = originalWarn;
console.log('✓ Test 4 passed');

// Test 5: getCurrentScene() returns current scene
console.log('\nTest 5: getCurrentScene() returns current scene');
const eventBus5 = new EventBus();
const stateMachine5 = new SceneStateMachine(eventBus5);
const scenes5 = [
  createValidScene('scene-1', 'scene-2'),
  createValidScene('scene-2', 'scene-3')
];
stateMachine5.loadRole('test-mission', 'test-role', scenes5);
const currentScene = stateMachine5.getCurrentScene();
console.assert(currentScene !== null, 'Should return a scene');
console.assert(currentScene.id === 'scene-1', 'Should return first scene');
console.log('✓ Test 5 passed');

// Test 6: transitionTo() moves to next scene
console.log('\nTest 6: transitionTo() moves to next scene');
const eventBus6 = new EventBus();
const stateMachine6 = new SceneStateMachine(eventBus6);
let choiceMadeEventFired = false;
let transitionEventCount = 0;

eventBus6.on('choice:made', (data) => {
  choiceMadeEventFired = true;
  console.assert(data.nextSceneId === 'scene-2', 'Should emit correct nextSceneId');
});

eventBus6.on('scene:transition', (data) => {
  transitionEventCount++;
  if (transitionEventCount === 2) { // Second transition (first is from loadRole)
    console.assert(data.sceneId === 'scene-2', 'Should transition to scene-2');
    console.assert(data.sceneIndex === 1, 'Scene index should be 1');
  }
});

const scenes6 = [
  createValidScene('scene-1', 'scene-2'),
  createValidScene('scene-2', 'scene-3')
];
stateMachine6.loadRole('test-mission', 'test-role', scenes6);
stateMachine6.transitionTo('scene-2', { testFlag: true });

console.assert(choiceMadeEventFired, 'choice:made event should fire');
console.assert(stateMachine6.currentSceneIndex === 1, 'Scene index should be 1');
console.assert(stateMachine6.getCurrentScene().id === 'scene-2', 'Current scene should be scene-2');
console.log('✓ Test 6 passed');

// Test 7: isComplete() detects last scene
console.log('\nTest 7: isComplete() detects last scene');
const eventBus7 = new EventBus();
const stateMachine7 = new SceneStateMachine(eventBus7);
const scenes7 = [
  createValidScene('scene-1', 'scene-2'),
  createValidScene('scene-2', 'scene-3')
];
stateMachine7.loadRole('test-mission', 'test-role', scenes7);
console.assert(!stateMachine7.isComplete(), 'Should not be complete on first scene');
stateMachine7.transitionTo('scene-2');
console.assert(stateMachine7.isComplete(), 'Should be complete on last scene');
console.log('✓ Test 7 passed');

// Test 8: transitionTo() emits role:complete on last scene
console.log('\nTest 8: transitionTo() emits role:complete on last scene');
const eventBus8 = new EventBus();
const stateMachine8 = new SceneStateMachine(eventBus8);
let roleCompleteEventFired = false;

eventBus8.on('role:complete', (data) => {
  roleCompleteEventFired = true;
  console.assert(data.missionId === 'test-mission', 'Should emit correct mission ID');
  console.assert(data.roleId === 'test-role', 'Should emit correct role ID');
});

const scenes8 = [
  createValidScene('scene-1', 'scene-2'),
  createValidScene('scene-2', 'scene-3')
];
stateMachine8.loadRole('test-mission', 'test-role', scenes8);
stateMachine8.transitionTo('scene-2');

console.assert(roleCompleteEventFired, 'role:complete event should fire on last scene');
console.log('✓ Test 8 passed');

// Test 9: transitionTo() handles non-existent scene gracefully
console.log('\nTest 9: transitionTo() handles non-existent scene gracefully');
const eventBus9 = new EventBus();
const stateMachine9 = new SceneStateMachine(eventBus9);
let roleCompleteEventFired9 = false;

eventBus9.on('role:complete', () => {
  roleCompleteEventFired9 = true;
});

const scenes9 = [
  createValidScene('scene-1', 'scene-2'),
  createValidScene('scene-2', 'scene-3')
];
stateMachine9.loadRole('test-mission', 'test-role', scenes9);
stateMachine9.transitionTo('non-existent-scene');

console.assert(roleCompleteEventFired9, 'Should emit role:complete when scene not found');
console.assert(stateMachine9.currentSceneIndex === 0, 'Should remain on current scene');
console.log('✓ Test 9 passed');

// Test 9.5: transitionTo() handles "outcome" signal correctly
console.log('\nTest 9.5: transitionTo() handles "outcome" signal correctly');
const eventBus9_5 = new EventBus();
const stateMachine9_5 = new SceneStateMachine(eventBus9_5);
let roleCompleteEventFired9_5 = false;

eventBus9_5.on('role:complete', (data) => {
  roleCompleteEventFired9_5 = true;
  console.assert(data.missionId === 'test-mission', 'Should emit correct mission ID');
  console.assert(data.roleId === 'test-role', 'Should emit correct role ID');
});

const scenes9_5 = [
  createValidScene('scene-1', 'scene-2'),
  createValidScene('scene-2', 'scene-3')
];
stateMachine9_5.loadRole('test-mission', 'test-role', scenes9_5);
stateMachine9_5.transitionTo('outcome');

console.assert(roleCompleteEventFired9_5, 'Should emit role:complete when nextScene is "outcome"');
console.assert(stateMachine9_5.currentSceneIndex === 0, 'Should remain on current scene');
console.log('✓ Test 9.5 passed');

// Test 9.6: transitionTo() handles null nextScene (terminal)
console.log('\nTest 9.6: transitionTo() handles null nextScene (terminal)');
const eventBus9_6 = new EventBus();
const stateMachine9_6 = new SceneStateMachine(eventBus9_6);

let roleCompleteEventFired9_6 = false;
eventBus9_6.on('role:complete', () => {
  roleCompleteEventFired9_6 = true;
});

const testSceneForNull = createValidScene('test-scene-null');
stateMachine9_6.loadRole('test-mission', 'test-role', [testSceneForNull]);
stateMachine9_6.transitionTo(null);

console.assert(roleCompleteEventFired9_6, 'Should emit role:complete when nextScene is null');
console.assert(stateMachine9_6.currentSceneIndex === 0, 'Should remain on current scene');
console.log('✓ Test 9.6 passed');

// Test 10: validateChoice() validates choice structure
console.log('\nTest 10: validateChoice() validates choice structure');
const eventBus10 = new EventBus();
const stateMachine10 = new SceneStateMachine(eventBus10);

// Valid choice
const validChoice = {
  id: 'choice-1',
  text: 'Test choice',
  nextScene: 'next-scene',
  consequences: { flag: true }
};
console.assert(stateMachine10.validateChoice(validChoice, 'test-scene'), 'Should accept valid choice');

// Missing id
const invalidChoice1 = {
  text: 'Test choice',
  nextScene: 'next-scene'
};
console.assert(!stateMachine10.validateChoice(invalidChoice1, 'test-scene'), 'Should reject choice without id');

// Missing text
const invalidChoice2 = {
  id: 'choice-1',
  nextScene: 'next-scene'
};
console.assert(!stateMachine10.validateChoice(invalidChoice2, 'test-scene'), 'Should reject choice without text');

// Missing nextScene
const invalidChoice3 = {
  id: 'choice-1',
  text: 'Test choice'
};
console.assert(!stateMachine10.validateChoice(invalidChoice3, 'test-scene'), 'Should reject choice without nextScene');

console.log('✓ Test 10 passed');

console.log('\n✅ All SceneStateMachine tests passed!');
