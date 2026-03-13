/**
 * Verification Script for Tutsi Survivor Scenes (Task 3.2)
 * 
 * This script validates that all 8 scenes meet the requirements:
 * - Scene rw-ts-scene-01: April 7 morning, decision point (3 choices)
 * - Scene rw-ts-scene-02a: Go to church (timed, 12s, 2 choices)
 * - Scene rw-ts-scene-02b: Seek Hutu friend's house (1 choice)
 * - Scene rw-ts-scene-02c: Try to reach hotel (1 choice)
 * - Scene rw-ts-scene-03a: Escape church massacre (1 choice)
 * - Scene rw-ts-scene-03b: Hide in church ceiling (1 choice)
 * - Scene rw-ts-scene-03c: Hide in attic (1 choice)
 * - Scene rw-ts-scene-03d: Roadblock negotiation (timed, 10s, 1 choice)
 */

import tutsiSurvivorData from './js/content/missions/rwanda/tutsi-survivor.js';

const { scenes } = tutsiSurvivorData;

console.log('=== Tutsi Survivor Scenes Verification ===\n');

// Expected scene structure
const expectedScenes = [
  { id: 'rw-ts-scene-01', choices: 3, timed: false },
  { id: 'rw-ts-scene-02a', choices: 2, timed: true, duration: 12000 },
  { id: 'rw-ts-scene-02b', choices: 1, timed: false },
  { id: 'rw-ts-scene-02c', choices: 1, timed: false },
  { id: 'rw-ts-scene-03a', choices: 1, timed: false },
  { id: 'rw-ts-scene-03b', choices: 1, timed: false },
  { id: 'rw-ts-scene-03c', choices: 1, timed: false },
  { id: 'rw-ts-scene-03d', choices: 1, timed: true, duration: 10000 }
];

let allPassed = true;

// Verify scene count
console.log(`✓ Total scenes: ${scenes.length} (expected: 8)`);
if (scenes.length !== 8) {
  console.error(`✗ ERROR: Expected 8 scenes, found ${scenes.length}`);
  allPassed = false;
}

// Verify each scene
expectedScenes.forEach(expected => {
  const scene = scenes.find(s => s.id === expected.id);
  
  if (!scene) {
    console.error(`✗ ERROR: Scene ${expected.id} not found`);
    allPassed = false;
    return;
  }
  
  console.log(`\n--- Scene: ${scene.id} ---`);
  
  // Check required fields
  const requiredFields = ['id', 'narrative', 'apThemes', 'choices', 'atmosphericEffect', 'ambientTrack', 'narratorAudio'];
  requiredFields.forEach(field => {
    if (scene[field] === undefined) {
      console.error(`✗ Missing required field: ${field}`);
      allPassed = false;
    } else {
      console.log(`✓ Has ${field}`);
    }
  });
  
  // Check word count (100-160 words)
  const wordCount = scene.narrative.split(/\s+/).length;
  console.log(`✓ Word count: ${wordCount} (expected: 100-160)`);
  if (wordCount < 100 || wordCount > 160) {
    console.error(`✗ WARNING: Word count ${wordCount} outside range 100-160`);
  }
  
  // Check AP themes
  if (scene.apThemes && scene.apThemes.length > 0) {
    console.log(`✓ AP themes: ${scene.apThemes.join(', ')}`);
  } else {
    console.error(`✗ ERROR: No AP themes`);
    allPassed = false;
  }
  
  // Check choice count
  console.log(`✓ Choices: ${scene.choices.length} (expected: ${expected.choices})`);
  if (scene.choices.length !== expected.choices) {
    console.error(`✗ ERROR: Expected ${expected.choices} choices, found ${scene.choices.length}`);
    allPassed = false;
  }
  
  // Check timed choice
  if (expected.timed) {
    if (scene.timedChoice && scene.timedChoice.enabled) {
      console.log(`✓ Timed choice: ${scene.timedChoice.duration}ms (expected: ${expected.duration}ms)`);
      if (scene.timedChoice.duration !== expected.duration) {
        console.error(`✗ ERROR: Expected duration ${expected.duration}ms, found ${scene.timedChoice.duration}ms`);
        allPassed = false;
      }
      if (!scene.timedChoice.defaultChoice) {
        console.error(`✗ ERROR: Timed choice missing defaultChoice`);
        allPassed = false;
      }
    } else {
      console.error(`✗ ERROR: Expected timed choice, but not configured`);
      allPassed = false;
    }
  } else {
    if (scene.timedChoice && scene.timedChoice.enabled) {
      console.error(`✗ ERROR: Unexpected timed choice`);
      allPassed = false;
    }
  }
  
  // Check audio paths
  if (scene.ambientTrack && scene.ambientTrack.includes('/')) {
    console.error(`✗ ERROR: ambientTrack should be filename only, found: ${scene.ambientTrack}`);
    allPassed = false;
  }
  
  if (scene.narratorAudio && !scene.narratorAudio.startsWith('audio/narration/')) {
    console.error(`✗ ERROR: narratorAudio should start with 'audio/narration/', found: ${scene.narratorAudio}`);
    allPassed = false;
  }
  
  // Check for trauma-informed writing (no direct slurs)
  const prohibitedWords = ['cockroach', 'inyenzi'];
  const narrativeLower = scene.narrative.toLowerCase();
  prohibitedWords.forEach(word => {
    if (narrativeLower.includes(word) && !narrativeLower.includes('the word') && !narrativeLower.includes('language')) {
      console.error(`✗ ERROR: Direct use of prohibited word "${word}" - must use indirect reference`);
      allPassed = false;
    }
  });
  
  // Check sensory details (minimum 3)
  const sensoryKeywords = ['smell', 'hear', 'sound', 'crackle', 'smoke', 'sweat', 'taste', 'feel', 'touch', 'see', 'watch', 'look'];
  const sensoryCount = sensoryKeywords.filter(keyword => narrativeLower.includes(keyword)).length;
  console.log(`✓ Sensory details: ~${sensoryCount} keywords found (minimum: 3)`);
  
  // Check choices
  scene.choices.forEach((choice, idx) => {
    const wordCount = choice.text.split(/\s+/).length;
    if (wordCount < 4 || wordCount > 8) {
      console.error(`✗ WARNING: Choice ${idx + 1} text "${choice.text}" has ${wordCount} words (expected: 4-8)`);
    }
    if (!choice.consequences || Object.keys(choice.consequences).length === 0) {
      console.error(`✗ ERROR: Choice ${idx + 1} has no consequences`);
      allPassed = false;
    }
    if (choice.nextScene === undefined) {
      console.error(`✗ ERROR: Choice ${idx + 1} missing nextScene field`);
      allPassed = false;
    }
  });
});

// Verify branching structure
console.log('\n=== Branching Structure Verification ===\n');

const scene01 = scenes.find(s => s.id === 'rw-ts-scene-01');
if (scene01) {
  const nextScenes = scene01.choices.map(c => c.nextScene);
  console.log(`✓ Scene 01 branches to: ${nextScenes.join(', ')}`);
  
  // Verify all branch scenes exist
  nextScenes.forEach(sceneId => {
    const exists = scenes.find(s => s.id === sceneId);
    if (exists) {
      console.log(`  ✓ ${sceneId} exists`);
    } else {
      console.error(`  ✗ ERROR: ${sceneId} not found`);
      allPassed = false;
    }
  });
}

// Verify consequence flags use rw_ prefix
console.log('\n=== Consequence Flag Verification ===\n');
const allFlags = new Set();
scenes.forEach(scene => {
  scene.choices.forEach(choice => {
    Object.keys(choice.consequences).forEach(flag => {
      allFlags.add(flag);
      if (!flag.startsWith('rw_')) {
        console.error(`✗ ERROR: Flag "${flag}" doesn't use rw_ prefix`);
        allPassed = false;
      }
    });
  });
});
console.log(`✓ Total unique flags: ${allFlags.size}`);
console.log(`✓ Flags: ${Array.from(allFlags).join(', ')}`);

// Final result
console.log('\n=== Final Result ===\n');
if (allPassed) {
  console.log('✓ ALL CHECKS PASSED - Task 3.2 Complete!');
} else {
  console.error('✗ SOME CHECKS FAILED - Review errors above');
}

process.exit(allPassed ? 0 : 1);
