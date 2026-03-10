/**
 * SceneRouter - Scene Graph Navigation and Validation
 * 
 * Manages scene-to-scene routing for branching narratives.
 * Builds a Scene_Map from role data and validates connectivity.
 * Pure routing logic - no state, no content strings.
 * 
 * Architecture:
 * - Loads role data and builds Scene_Map (id -> scene object)
 * - Validates all nextScene references resolve
 * - Detects unreachable scenes and infinite loops
 * - Identifies terminal scenes (no choices or nextScene: "outcome")
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 10.1, 10.2, 10.4
 */

class SceneRouter {
  /**
   * Create SceneRouter
   * @param {EventBus} eventBus - Event bus for warnings
   */
  constructor(eventBus) {
    if (!eventBus) {
      throw new Error('SceneRouter requires an EventBus instance');
    }
    
    this.eventBus = eventBus;
    
    // Scene_Map: sceneId -> scene object
    this.sceneMap = new Map();
    
    // Track current role for error reporting
    this.currentRoleId = null;
    this.currentMissionId = null;
  }

  /**
   * Load a role's scenes and build Scene_Map
   * @param {object} roleData - Role object with scenes array
   * @returns {boolean} True if load successful
   */
  loadRole(roleData) {
    if (!roleData || !roleData.id || !Array.isArray(roleData.scenes)) {
      console.error('SceneRouter.loadRole: Invalid role data');
      return false;
    }
    
    this.currentRoleId = roleData.id;
    this.sceneMap.clear();
    
    // Build Scene_Map
    for (const scene of roleData.scenes) {
      if (!this.validateScene(scene)) {
        console.warn(`SceneRouter: Skipping invalid scene in role "${roleData.id}"`);
        continue;
      }
      
      this.sceneMap.set(scene.id, scene);
    }
    
    if (this.sceneMap.size === 0) {
      console.error(`SceneRouter.loadRole: No valid scenes found in role "${roleData.id}"`);
      return false;
    }
    
    // Validate connectivity
    const validationResult = this.validatePaths();
    if (!validationResult.valid) {
      console.error(`SceneRouter.loadRole: Path validation failed for role "${roleData.id}"`);
      console.error('Validation errors:', validationResult.errors);
      
      // Emit warning event
      this.eventBus.emit('router:validation-failed', {
        roleId: roleData.id,
        errors: validationResult.errors
      });
      
      return false;
    }
    
    console.log(`✓ SceneRouter loaded role "${roleData.id}" with ${this.sceneMap.size} scenes`);
    return true;
  }

  /**
   * Get a scene by ID
   * @param {string} sceneId - Scene identifier
   * @returns {object|null} Scene object or null if not found
   */
  getScene(sceneId) {
    if (typeof sceneId !== 'string') {
      console.error('SceneRouter.getScene: sceneId must be a string');
      return null;
    }
    
    // Handle "outcome" sentinel
    if (sceneId === 'outcome') {
      return null;
    }
    
    const scene = this.sceneMap.get(sceneId);
    
    if (!scene) {
      console.warn(`SceneRouter.getScene: Scene "${sceneId}" not found in role "${this.currentRoleId}"`);
      this.eventBus.emit('router:scene-not-found', {
        sceneId,
        roleId: this.currentRoleId
      });
    }
    
    return scene || null;
  }

  /**
   * Validate a scene object structure
   * @param {object} scene - Scene to validate
   * @returns {boolean} True if valid
   */
  validateScene(scene) {
    if (!scene || typeof scene !== 'object') {
      console.error('SceneRouter.validateScene: Scene must be an object');
      return false;
    }
    
    // Required fields
    if (typeof scene.id !== 'string' || scene.id.trim() === '') {
      console.error('SceneRouter.validateScene: Scene missing required field "id"');
      return false;
    }
    
    if (typeof scene.narrative !== 'string' || scene.narrative.trim() === '') {
      console.error(`SceneRouter.validateScene: Scene "${scene.id}" missing "narrative"`);
      return false;
    }
    
    if (!Array.isArray(scene.choices)) {
      console.error(`SceneRouter.validateScene: Scene "${scene.id}" missing "choices" array`);
      return false;
    }
    
    // Validate choices
    for (const choice of scene.choices) {
      if (!choice || typeof choice !== 'object') {
        console.error(`SceneRouter.validateScene: Invalid choice in scene "${scene.id}"`);
        return false;
      }
      
      if (typeof choice.id !== 'string' || choice.id.trim() === '') {
        console.error(`SceneRouter.validateScene: Choice in scene "${scene.id}" missing "id"`);
        return false;
      }
      
      if (typeof choice.text !== 'string' || choice.text.trim() === '') {
        console.error(`SceneRouter.validateScene: Choice "${choice.id}" missing "text"`);
        return false;
      }
      
      if (typeof choice.nextScene !== 'string') {
        console.error(`SceneRouter.validateScene: Choice "${choice.id}" missing "nextScene"`);
        return false;
      }
    }
    
    return true;
  }

  /**
   * Check if a scene is terminal (end of narrative)
   * @param {object} scene - Scene to check
   * @returns {boolean} True if terminal
   */
  isTerminal(scene) {
    if (!scene) {
      return false;
    }
    
    // Scene with no choices is terminal
    if (!Array.isArray(scene.choices) || scene.choices.length === 0) {
      return true;
    }
    
    // Scene where all choices point to "outcome" is terminal
    const allPointToOutcome = scene.choices.every(choice => choice.nextScene === 'outcome');
    return allPointToOutcome;
  }

  /**
   * Validate all scene paths for connectivity and loops
   * @returns {object} { valid: boolean, errors: string[] }
   */
  validatePaths() {
    const errors = [];
    const sceneIds = Array.from(this.sceneMap.keys());
    
    if (sceneIds.length === 0) {
      errors.push('No scenes loaded');
      return { valid: false, errors };
    }
    
    // 1. Check that all nextScene references resolve
    for (const [sceneId, scene] of this.sceneMap) {
      if (!scene.choices) continue;
      
      for (const choice of scene.choices) {
        const nextSceneId = choice.nextScene;
        
        // "outcome" is a valid sentinel value
        if (nextSceneId === 'outcome') {
          continue;
        }
        
        // Check if nextScene exists in Scene_Map
        if (!this.sceneMap.has(nextSceneId)) {
          errors.push(`Scene "${sceneId}" choice "${choice.id}" points to non-existent scene "${nextSceneId}"`);
        }
      }
    }
    
    // 2. Check for unreachable scenes (except first scene)
    const firstSceneId = sceneIds[0]; // Assume first scene in array is entry point
    const reachable = new Set();
    const visited = new Set();
    
    const traverse = (sceneId) => {
      if (visited.has(sceneId)) return;
      visited.add(sceneId);
      reachable.add(sceneId);
      
      const scene = this.sceneMap.get(sceneId);
      if (!scene || !scene.choices) return;
      
      for (const choice of scene.choices) {
        if (choice.nextScene !== 'outcome' && this.sceneMap.has(choice.nextScene)) {
          traverse(choice.nextScene);
        }
      }
    };
    
    traverse(firstSceneId);
    
    for (const sceneId of sceneIds) {
      if (!reachable.has(sceneId)) {
        errors.push(`Scene "${sceneId}" is unreachable from entry point "${firstSceneId}"`);
      }
    }
    
    // 3. Check for infinite loops (scenes with no path to terminal)
    const canReachTerminal = new Set();
    
    const checkTerminalPath = (sceneId, path = []) => {
      // Detect cycles
      if (path.includes(sceneId)) {
        return false; // Cycle detected
      }
      
      // Already checked this scene
      if (canReachTerminal.has(sceneId)) {
        return true;
      }
      
      const scene = this.sceneMap.get(sceneId);
      if (!scene) return false;
      
      // Terminal scene
      if (this.isTerminal(scene)) {
        canReachTerminal.add(sceneId);
        return true;
      }
      
      // Check if any choice leads to terminal
      const newPath = [...path, sceneId];
      for (const choice of scene.choices) {
        if (choice.nextScene === 'outcome') {
          canReachTerminal.add(sceneId);
          return true;
        }
        
        if (checkTerminalPath(choice.nextScene, newPath)) {
          canReachTerminal.add(sceneId);
          return true;
        }
      }
      
      return false;
    };
    
    for (const sceneId of sceneIds) {
      if (!checkTerminalPath(sceneId)) {
        errors.push(`Scene "${sceneId}" has no path to a terminal scene (infinite loop)`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get all scene IDs in current role
   * @returns {string[]} Array of scene IDs
   */
  getAllSceneIds() {
    return Array.from(this.sceneMap.keys());
  }

  /**
   * Get current role ID
   * @returns {string|null} Current role ID
   */
  getCurrentRoleId() {
    return this.currentRoleId;
  }

  /**
   * Clear all loaded scenes
   */
  clear() {
    this.sceneMap.clear();
    this.currentRoleId = null;
    this.currentMissionId = null;
  }
}

// ES6 module export
export default SceneRouter;
