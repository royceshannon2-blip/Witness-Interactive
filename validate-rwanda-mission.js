/**
 * Rwanda Mission Validation Script
 * 
 * Validates scene graph integrity for the Rwanda Genocide mission:
 * - No broken nextScene references
 * - No orphaned scenes (all reachable from start)
 * - All outcome conditions reference settable flags
 * - All scene IDs use correct prefix
 * 
 * Run with: node validate-rwanda-mission.js
 */

import rwandaMission from './js/content/missions/rwanda/mission.js';

const errors = [];
const warnings = [];

console.log('=== Rwanda Mission Validation ===\n');

// Validate each role
rwandaMission.roles.forEach(role => {
  console.log(`\nValidating role: ${role.name} (${role.id})`);
  console.log(`- Scenes: ${role.scenes.length}`);
  console.log(`- Outcomes: ${role.outcomes.length}`);
  
  const sceneIds = new Set(role.scenes.map(s => s.id));
  const reachableScenes = new Set();
  const settableFlags = new Set();
  
  // Determine correct prefix
  let expectedPrefix;
  if (role.id === 'hutu-moderate') expectedPrefix = 'rw-hm-';
  else if (role.id === 'tutsi-survivor') expectedPrefix = 'rw-ts-';
  else if (role.id === 'un-peacekeeper') expectedPrefix = 'rw-un-';
  
  // Check scene ID prefixes
  role.scenes.forEach(scene => {
    if (!scene.id.startsWith(expectedPrefix)) {
      errors.push(`${role.id}: Scene ${scene.id} doesn't use correct prefix ${expectedPrefix}`);
    }
  });
  
  // Collect all settable flags from choices
  role.scenes.forEach(scene => {
    scene.choices.forEach(choice => {
      if (choice.consequences) {
        Object.keys(choice.consequences).forEach(flag => {
          settableFlags.add(flag);
        });
      }
    });
  });
  
  console.log(`- Settable flags: ${settableFlags.size}`);
  
  // Find first scene (should be scene-01)
  const firstScene = role.scenes.find(s => s.id.endsWith('-scene-01'));
  if (!firstScene) {
    errors.push(`${role.id}: No starting scene found (expected *-scene-01)`);
  } else {
    // BFS to find all reachable scenes
    const queue = [firstScene.id];
    reachableScenes.add(firstScene.id);
    
    while (queue.length > 0) {
      const currentId = queue.shift();
      const currentScene = role.scenes.find(s => s.id === currentId);
      
      if (!currentScene) continue;
      
      currentScene.choices.forEach(choice => {
        if (choice.nextScene && choice.nextScene !== null) {
          // Check if nextScene exists
          if (!sceneIds.has(choice.nextScene)) {
            errors.push(`${role.id}: Scene ${currentId} references non-existent scene ${choice.nextScene}`);
          } else if (!reachableScenes.has(choice.nextScene)) {
            reachableScenes.add(choice.nextScene);
            queue.push(choice.nextScene);
          }
        }
      });
    }
  }
  
  console.log(`- Reachable scenes: ${reachableScenes.size}`);
  
  // Check for orphaned scenes
  role.scenes.forEach(scene => {
    if (!reachableScenes.has(scene.id)) {
      warnings.push(`${role.id}: Scene ${scene.id} is orphaned (not reachable from start)`);
    }
  });
  
  // Validate outcomes
  role.outcomes.forEach(outcome => {
    if (!outcome.conditions) {
      errors.push(`${role.id}: Outcome ${outcome.id} has no conditions`);
      return;
    }
    
    // Check if all condition flags are settable
    Object.keys(outcome.conditions).forEach(flag => {
      if (!settableFlags.has(flag)) {
        warnings.push(`${role.id}: Outcome ${outcome.id} references flag "${flag}" that is never set by any choice`);
      }
    });
  });
});

// Print results
console.log('\n=== Validation Results ===\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All validations passed!');
  console.log('- No broken nextScene references');
  console.log('- No orphaned scenes');
  console.log('- All outcome conditions reference settable flags');
  console.log('- All scene IDs use correct prefixes');
} else {
  if (errors.length > 0) {
    console.log(`❌ ${errors.length} ERROR(S):`);
    errors.forEach(err => console.log(`  - ${err}`));
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} WARNING(S):`);
    warnings.forEach(warn => console.log(`  - ${warn}`));
  }
  
  process.exit(1);
}
