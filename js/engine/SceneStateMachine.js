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
  constructor(eventBus) {
    this.eventBus = eventBus;

    // Current role's scene sequence
    this.scenes = [];

    // Current scene index
    this.currentSceneIndex = 0;

    // Current mission and role IDs
    this.currentMissionId = null;
    this.currentRoleId    = null;

    // Track current ambient track for crossfading
    this.currentAmbientTrack = null;
  }

  /**
   * Load a role's scene sequence
   * @param {string} missionId
   * @param {string} roleId
   * @param {Array}  scenes
   */
  loadRole(missionId, roleId, scenes) {
    if (typeof missionId !== 'string' || typeof roleId !== 'string') {
      console.error('SceneStateMachine.loadRole: missionId and roleId must be strings');
      return;
    }

    if (!Array.isArray(scenes) || scenes.length === 0) {
      console.error('SceneStateMachine.loadRole: scenes must be a non-empty array');
      return;
    }

    const validScenes = scenes.filter(scene => {
      if (this.validateScene(scene)) return true;
      console.error('SceneStateMachine.loadRole: Invalid scene object, skipping:', scene);
      return false;
    });

    if (validScenes.length === 0) {
      console.error('SceneStateMachine.loadRole: No valid scenes found in role');
      return;
    }

    this.currentMissionId    = missionId;
    this.currentRoleId       = roleId;
    this.scenes              = validScenes;
    this.currentSceneIndex   = 0;

    const firstScene = this.getCurrentScene();
    if (firstScene) {
      this.eventBus.emit('scene:transition', {
        sceneId    : firstScene.id,
        sceneIndex : this.currentSceneIndex,
        totalScenes: this.scenes.length,
        scene      : firstScene
      });
    }
  }

  /**
   * Validate a scene object
   */
  validateScene(scene) {
    if (!scene || typeof scene !== 'object') {
      console.error('SceneStateMachine.validateScene: Scene must be an object');
      return false;
    }
    if (typeof scene.id !== 'string' || scene.id.trim() === '') {
      console.error('SceneStateMachine.validateScene: Scene missing required field "id"');
      return false;
    }
    if (typeof scene.narrative !== 'string' || scene.narrative.trim() === '') {
      console.error(`SceneStateMachine.validateScene: Scene "${scene.id}" missing "narrative"`);
      return false;
    }
    if (!Array.isArray(scene.apThemes)) {
      console.error(`SceneStateMachine.validateScene: Scene "${scene.id}" missing "apThemes"`);
      return false;
    }
    if (scene.apThemes.length === 0) {
      console.warn(`SceneStateMachine.validateScene: Scene "${scene.id}" has empty apThemes`);
    }
    if (!Array.isArray(scene.choices)) {
      console.error(`SceneStateMachine.validateScene: Scene "${scene.id}" missing "choices"`);
      return false;
    }
    return scene.choices.every(choice => this.validateChoice(choice, scene.id));
  }

  /**
   * Validate a choice object
   */
  validateChoice(choice, sceneId) {
    if (!choice || typeof choice !== 'object') {
      console.error(`SceneStateMachine.validateChoice: Choice in "${sceneId}" must be an object`);
      return false;
    }
    if (typeof choice.id !== 'string' || choice.id.trim() === '') {
      console.error(`SceneStateMachine.validateChoice: Choice in "${sceneId}" missing "id"`);
      return false;
    }
    if (typeof choice.text !== 'string' || choice.text.trim() === '') {
      console.error(`SceneStateMachine.validateChoice: Choice "${choice.id}" missing "text"`);
      return false;
    }
    if (typeof choice.nextScene !== 'string') {
      console.error(`SceneStateMachine.validateChoice: Choice "${choice.id}" missing "nextScene"`);
      return false;
    }
    if (choice.consequences !== undefined && typeof choice.consequences !== 'object') {
      console.error(`SceneStateMachine.validateChoice: Choice "${choice.id}" has invalid "consequences"`);
      return false;
    }
    return true;
  }

  /**
   * Get current scene
   */
  getCurrentScene() {
    if (this.scenes.length === 0 || this.currentSceneIndex >= this.scenes.length) {
      return null;
    }
    return this.scenes[this.currentSceneIndex];
  }

  /**
   * Transition to the scene with the given ID.
   *
   * FIX: If nextSceneId is "outcome" or any ID not found in the scenes array,
   * emit scene:error (which UIController handles by re-rendering the current scene
   * and keeping the player on screen) rather than game:complete.
   * game:complete is only emitted after the final real scene is played.
   */
  transitionTo(nextSceneId) {
    if (typeof nextSceneId !== 'string') {
      console.error('SceneStateMachine.transitionTo: nextSceneId must be a string');
      return;
    }

    // "outcome" is a sentinel value in choice data meaning "end of narrative"
    // Treat it the same as a missing scene — trigger game:complete gracefully
    if (nextSceneId === 'outcome') {
      this.eventBus.emit('game:complete', {
        missionId: this.currentMissionId,
        roleId   : this.currentRoleId
      });
      return;
    }

    const nextSceneIndex = this.scenes.findIndex(s => s.id === nextSceneId);

    if (nextSceneIndex === -1) {
      // ── FIX: was game:complete, now scene:error ──────────────────────────
      // game:complete was firing for genuinely missing scene IDs, causing a
      // white-screen crash. scene:error lets UIController re-render safely.
      console.warn(`SceneStateMachine.transitionTo: Scene "${nextSceneId}" not found — emitting scene:error`);
      this.eventBus.emit('scene:error', {
        attempted: nextSceneId,
        missionId: this.currentMissionId,
        roleId   : this.currentRoleId
      });
      return;
    }

    this.currentSceneIndex = nextSceneIndex;
    const newScene = this.getCurrentScene();

    // Handle ambient audio crossfade
    if (newScene.ambientTrack && this.currentAmbientTrack !== newScene.ambientTrack) {
      this.eventBus.emit('ambient:crossfade', {
        from    : this.currentAmbientTrack,
        to      : newScene.ambientTrack,
        duration: 1500
      });
      this.currentAmbientTrack = newScene.ambientTrack;
    }

    this.eventBus.emit('scene:transition', {
      sceneId    : newScene.id,
      sceneIndex : this.currentSceneIndex,
      totalScenes: this.scenes.length,
      scene      : newScene
    });

    if (this.isComplete()) {
      this.eventBus.emit('game:complete', {
        missionId: this.currentMissionId,
        roleId   : this.currentRoleId
      });
    }
  }

  /**
   * True when the current scene is the last one
   */
  isComplete() {
    return this.currentSceneIndex >= this.scenes.length - 1;
  }
}

export default SceneStateMachine;
