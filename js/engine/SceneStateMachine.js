/**
 * SceneStateMachine - Scene Transition and State Management
 * 
 * Manages scene transitions, validates scene data structure, and tracks narrative progress.
 * Processes scene definitions as pure JavaScript objects and emits events via EventBus.
 * 
 * Scene Data Structure:
 * {
 *   id: string,              // Unique scene identifier
 *   narrative: string,       // Main story text
 *   apThemes: string[],      // AP reasoning skills: ["causation", "perspective"]
 *   choices: [
 *     {
 *       id: string,
 *       text: string,
 *       consequences: {       // Flags set by this choice
 *         flagName: boolean | number
 *       },
 *       nextScene: string
 *     }
 *   ],
 *   atmosphericEffect: string | null  // "smoke", "fire", "shake", null
 * }
 * 
 * Requirements: 2.4, 5.4, 6.5, 20.3
 */

class SceneStateMachine {
  /**
   * Initialize the SceneStateMachine
   * @param {EventBus} eventBus - Event bus for component communication
   */
  constructor(eventBus) {
    // Store reference to event bus
    this.eventBus = eventBus;
    
    // Current role's scene sequence
    this.scenes = [];
    
    // Current scene index
    this.currentSceneIndex = 0;
    
    // Current mission and role IDs
    this.currentMissionId = null;
    this.currentRoleId = null;
  }

  /**
   * Load a role's scene sequence
   * @param {string} missionId - ID of the mission
   * @param {string} roleId - ID of the role to load
   * @param {Array} scenes - Array of scene objects for this role
   */
  loadRole(missionId, roleId, scenes) {
    // Validate inputs
    if (typeof missionId !== 'string' || typeof roleId !== 'string') {
      console.error('SceneStateMachine.loadRole: missionId and roleId must be strings');
      return;
    }

    if (!Array.isArray(scenes) || scenes.length === 0) {
      console.error('SceneStateMachine.loadRole: scenes must be a non-empty array');
      return;
    }

    // Validate all scenes in the sequence
    const validScenes = [];
    for (const scene of scenes) {
      if (this.validateScene(scene)) {
        validScenes.push(scene);
      } else {
        console.error(`SceneStateMachine.loadRole: Invalid scene object, skipping:`, scene);
      }
    }

    if (validScenes.length === 0) {
      console.error('SceneStateMachine.loadRole: No valid scenes found in role');
      return;
    }

    // Load the role
    this.currentMissionId = missionId;
    this.currentRoleId = roleId;
    this.scenes = validScenes;
    this.currentSceneIndex = 0;

    // Emit scene:transition event for the first scene
    const firstScene = this.getCurrentScene();
    if (firstScene) {
      this.eventBus.emit('scene:transition', {
        sceneId: firstScene.id,
        sceneIndex: this.currentSceneIndex,
        totalScenes: this.scenes.length,
        scene: firstScene
      });
    }
  }

  /**
   * Validate a scene object has required fields
   * @param {object} scene - Scene object to validate
   * @returns {boolean} True if scene is valid
   * @private
   */
  validateScene(scene) {
    // Check if scene is an object
    if (!scene || typeof scene !== 'object') {
      console.error('SceneStateMachine.validateScene: Scene must be an object');
      return false;
    }

    // Check required fields
    if (typeof scene.id !== 'string' || scene.id.trim() === '') {
      console.error('SceneStateMachine.validateScene: Scene missing required field "id" (string)');
      return false;
    }

    if (typeof scene.narrative !== 'string' || scene.narrative.trim() === '') {
      console.error('SceneStateMachine.validateScene: Scene missing required field "narrative" (string)');
      return false;
    }

    if (!Array.isArray(scene.apThemes)) {
      console.error(`SceneStateMachine.validateScene: Scene "${scene.id}" missing required field "apThemes" (array)`);
      return false;
    }

    // Log warning if apThemes array is empty
    if (scene.apThemes.length === 0) {
      console.warn(`SceneStateMachine.validateScene: Scene "${scene.id}" has empty apThemes array - educational integrity compromised`);
    }

    if (!Array.isArray(scene.choices)) {
      console.error(`SceneStateMachine.validateScene: Scene "${scene.id}" missing required field "choices" (array)`);
      return false;
    }

    // Validate each choice
    for (const choice of scene.choices) {
      if (!this.validateChoice(choice, scene.id)) {
        return false;
      }
    }

    // Scene is valid
    return true;
  }

  /**
   * Validate a choice object has required fields
   * @param {object} choice - Choice object to validate
   * @param {string} sceneId - ID of the parent scene (for error messages)
   * @returns {boolean} True if choice is valid
   * @private
   */
  validateChoice(choice, sceneId) {
    if (!choice || typeof choice !== 'object') {
      console.error(`SceneStateMachine.validateChoice: Choice in scene "${sceneId}" must be an object`);
      return false;
    }

    if (typeof choice.id !== 'string' || choice.id.trim() === '') {
      console.error(`SceneStateMachine.validateChoice: Choice in scene "${sceneId}" missing required field "id" (string)`);
      return false;
    }

    if (typeof choice.text !== 'string' || choice.text.trim() === '') {
      console.error(`SceneStateMachine.validateChoice: Choice "${choice.id}" in scene "${sceneId}" missing required field "text" (string)`);
      return false;
    }

    if (typeof choice.nextScene !== 'string') {
      console.error(`SceneStateMachine.validateChoice: Choice "${choice.id}" in scene "${sceneId}" missing required field "nextScene" (string)`);
      return false;
    }

    // consequences is optional, but if present must be an object
    if (choice.consequences !== undefined && typeof choice.consequences !== 'object') {
      console.error(`SceneStateMachine.validateChoice: Choice "${choice.id}" in scene "${sceneId}" has invalid "consequences" field (must be object)`);
      return false;
    }

    return true;
  }

  /**
   * Get current scene data
   * @returns {object|null} Current scene object, or null if no scene loaded
   */
  getCurrentScene() {
    if (this.scenes.length === 0 || this.currentSceneIndex >= this.scenes.length) {
      return null;
    }

    return this.scenes[this.currentSceneIndex];
  }

  /**
   * Transition to next scene based on choice
   * @param {string} nextSceneId - ID of the next scene to transition to
   */
  transitionTo(nextSceneId) {
    // Validate nextSceneId
    if (typeof nextSceneId !== 'string') {
      console.error('SceneStateMachine.transitionTo: nextSceneId must be a string');
      return;
    }

    // Find the next scene by ID
    const nextSceneIndex = this.scenes.findIndex(scene => scene.id === nextSceneId);

    if (nextSceneIndex === -1) {
      console.error(`SceneStateMachine.transitionTo: Scene "${nextSceneId}" not found in current role's scene sequence`);
      // End the narrative sequence gracefully
      this.eventBus.emit('game:complete', {
        missionId: this.currentMissionId,
        roleId: this.currentRoleId
      });
      return;
    }

    // Update current scene index
    this.currentSceneIndex = nextSceneIndex;

    // Get the new current scene
    const newScene = this.getCurrentScene();

    // Emit scene:transition event
    this.eventBus.emit('scene:transition', {
      sceneId: newScene.id,
      sceneIndex: this.currentSceneIndex,
      totalScenes: this.scenes.length,
      scene: newScene
    });

    // Check if this is the last scene
    if (this.isComplete()) {
      this.eventBus.emit('game:complete', {
        missionId: this.currentMissionId,
        roleId: this.currentRoleId
      });
    }
  }

  /**
   * Check if narrative is complete
   * @returns {boolean} True if on the last scene
   */
  isComplete() {
    return this.currentSceneIndex >= this.scenes.length - 1;
  }
}

// ES6 module export - no global variables
export default SceneStateMachine;
