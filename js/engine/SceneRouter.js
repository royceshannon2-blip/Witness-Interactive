/**
 * SceneRouter.js
 * 
 * Manages scene navigation by ID, validates scene graph integrity,
 * and routes players through branching narratives.
 * 
 * Pure routing logic - no content strings, EventBus communication only.
 */

export class SceneRouter {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.sceneMap = new Map();
    this.startSceneId = null;
    this.roleData = null;
  }

  /**
   * Builds Scene_Map from role scene array. Sets startScene.
   * Validates all nextScene references exist. Logs all broken routes before returning.
   * @param {Object} roleData - Role data containing scenes array and startScene
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  loadRole(roleData) {
    const errors = [];
    
    // Clear previous role data
    this.sceneMap.clear();
    this.startSceneId = null;
    this.roleData = roleData;

    // Validate roleData structure
    if (!roleData) {
      errors.push('Role data is null or undefined');
      return { valid: false, errors };
    }

    if (!roleData.scenes || !Array.isArray(roleData.scenes)) {
      errors.push('Role data missing scenes array');
      return { valid: false, errors };
    }

    if (!roleData.startScene) {
      errors.push('Role data missing startScene field');
      return { valid: false, errors };
    }

    // Build scene map
    for (const scene of roleData.scenes) {
      if (!scene.id) {
        errors.push('Scene missing id field');
        continue;
      }

      if (this.sceneMap.has(scene.id)) {
        errors.push(`Duplicate scene ID: ${scene.id}`);
        continue;
      }

      this.sceneMap.set(scene.id, scene);

      // Validate scene structure
      const warnings = this.validateScene(scene);
      if (warnings.length > 0) {
        this.eventBus.emit('scene:validation-warning', {
          sceneId: scene.id,
          warnings
        });
      }
    }

    // Set start scene
    this.startSceneId = roleData.startScene;

    // Validate start scene exists
    if (!this.sceneMap.has(this.startSceneId)) {
      errors.push(`Start scene not found: ${this.startSceneId}`);
    }

    // Validate all nextScene references
    for (const scene of roleData.scenes) {
      if (!scene.choices || !Array.isArray(scene.choices)) {
        continue;
      }

      for (const choice of scene.choices) {
        if (choice.nextScene && !this.sceneMap.has(choice.nextScene)) {
          errors.push(`Scene ${scene.id} choice "${choice.id}" references non-existent scene: ${choice.nextScene}`);
        }
      }
    }

    // Log all errors if any exist
    if (errors.length > 0) {
      console.error('[SceneRouter] Role validation failed:', errors);
      return { valid: false, errors };
    }

    return { valid: true, errors: [] };
  }

  /**
   * Returns scene object for given ID. Returns null and logs error if not found.
   * @param {string} sceneId - Scene identifier
   * @returns {Object|null} Scene object or null
   */
  getScene(sceneId) {
    if (!sceneId) {
      console.error('[SceneRouter] getScene called with null/undefined sceneId');
      return null;
    }

    const scene = this.sceneMap.get(sceneId);
    
    if (!scene) {
      console.error(`[SceneRouter] Scene not found: ${sceneId}`);
      return null;
    }

    return scene;
  }

  /**
   * Validates a scene object has required fields. Emits warnings for violations.
   * @param {Object} scene - Scene object to validate
   * @returns {string[]} Array of warning strings (empty if valid)
   */
  validateScene(scene) {
    const warnings = [];

    // Required fields
    if (!scene.id) {
      warnings.push('Missing required field: id');
    }

    if (!scene.narrative) {
      warnings.push('Missing required field: narrative');
    }

    if (!scene.choices || !Array.isArray(scene.choices)) {
      warnings.push('Missing or invalid choices array');
    }

    // AP themes validation
    if (!scene.apThemes || !Array.isArray(scene.apThemes) || scene.apThemes.length === 0) {
      warnings.push('Missing or empty apThemes array');
    }

    // Narrative length validation (80-150 words)
    if (scene.narrative) {
      const wordCount = scene.narrative.trim().split(/\s+/).length;
      if (wordCount > 150) {
        warnings.push(`Narrative exceeds 150 words (${wordCount} words)`);
      }
    }

    // Choice count validation (2-8 choices recommended)
    if (scene.choices && Array.isArray(scene.choices)) {
      if (scene.choices.length < 2) {
        warnings.push(`Scene has fewer than 2 choices (${scene.choices.length})`);
      }
      if (scene.choices.length > 8) {
        warnings.push(`Scene has more than 8 choices (${scene.choices.length})`);
      }

      // Validate each choice has required fields
      for (let i = 0; i < scene.choices.length; i++) {
        const choice = scene.choices[i];
        if (!choice.id) {
          warnings.push(`Choice ${i} missing id field`);
        }
        if (!choice.text) {
          warnings.push(`Choice ${i} missing text field`);
        }
      }
    }

    return warnings;
  }

  /**
   * Returns the start scene for the loaded role
   * @returns {Object|null} Start scene object or null
   */
  getStartScene() {
    if (!this.startSceneId) {
      console.error('[SceneRouter] No start scene set');
      return null;
    }

    return this.getScene(this.startSceneId);
  }

  /**
   * Returns true if scene is terminal (all choices have no nextScene)
   * @param {Object} scene - Scene object to check
   * @returns {boolean} True if terminal
   */
  isTerminal(scene) {
    if (!scene || !scene.choices || !Array.isArray(scene.choices)) {
      return false;
    }

    // A scene is terminal if ALL choices have no nextScene (null or undefined)
    return scene.choices.every(choice => !choice.nextScene);
  }

  /**
   * Validates complete path connectivity from start to terminal scenes
   * Detects unreachable scenes and routing loops
   * @returns {Object} { valid: boolean, unreachableScenes: string[], loops: string[][] }
   */
  validatePaths() {
    const reachableScenes = new Set();
    const loops = [];
    const unreachableScenes = [];

    // Depth-first search to find all reachable scenes
    const visited = new Set();
    const recursionStack = new Set();

    const dfs = (sceneId, path = []) => {
      if (!sceneId) return;

      // Mark as reachable
      reachableScenes.add(sceneId);

      // Detect loop
      if (recursionStack.has(sceneId)) {
        const loopStart = path.indexOf(sceneId);
        const loop = path.slice(loopStart).concat(sceneId);
        loops.push(loop);
        return;
      }

      // Already fully explored this branch
      if (visited.has(sceneId)) {
        return;
      }

      visited.add(sceneId);
      recursionStack.add(sceneId);
      path.push(sceneId);

      const scene = this.getScene(sceneId);
      if (scene && scene.choices) {
        for (const choice of scene.choices) {
          if (choice.nextScene) {
            dfs(choice.nextScene, [...path]);
          }
        }
      }

      recursionStack.delete(sceneId);
    };

    // Start DFS from start scene
    if (this.startSceneId) {
      dfs(this.startSceneId);
    }

    // Find unreachable scenes
    for (const sceneId of this.sceneMap.keys()) {
      if (!reachableScenes.has(sceneId)) {
        unreachableScenes.push(sceneId);
      }
    }

    const valid = unreachableScenes.length === 0 && loops.length === 0;

    if (!valid) {
      console.warn('[SceneRouter] Path validation issues detected:');
      if (unreachableScenes.length > 0) {
        console.warn('  Unreachable scenes:', unreachableScenes);
      }
      if (loops.length > 0) {
        console.warn('  Routing loops detected:', loops);
      }
    }

    return {
      valid,
      unreachableScenes,
      loops
    };
  }
}
