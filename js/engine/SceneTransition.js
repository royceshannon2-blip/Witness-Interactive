/**
 * SceneTransition - Visual transitions between scenes
 * 
 * Provides smooth visual animations when transitioning between scenes to create
 * a cohesive experience. Respects accessibility preferences and blocks user input
 * during transitions to prevent interaction issues.
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 7.1, 8.1
 */

class SceneTransition {
  /**
   * @param {EventBus} eventBus - Event system for component communication
   * @param {Object} config - Configuration options
   * @param {string} config.defaultType - Default transition type: 'fade', 'flash', 'none' (default: 'fade')
   * @param {number} config.duration - Total transition duration in ms (default: 500)
   * @param {boolean} config.respectMotionPrefs - Check prefers-reduced-motion (default: true)
   */
  constructor(eventBus, config = {}) {
    this.eventBus = eventBus;
    this.config = {
      defaultType: config.defaultType || 'fade',
      duration: config.duration || 500,
      respectMotionPrefs: config.respectMotionPrefs !== false
    };

    // Transition state
    this.active = false;
    this.timeoutId = null;

    // Check for reduced motion preference
    this.prefersReducedMotion = this.config.respectMotionPrefs && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Get the main game container for applying transition classes
    this.container = document.getElementById('app') || document.body;

    // Subscribe to scene transition events
    this.eventBus.on('scene:transition', (data) => {
      // Extract transition type from data if provided
      const type = data?.transitionType || this.config.defaultType;
      const duration = data?.transitionDuration || this.config.duration;
      this.transition(null, null, type, duration);
    });
  }

  /**
   * Execute a transition animation
   * @param {Object} fromScene - Previous scene (optional, for future use)
   * @param {Object} toScene - Next scene (optional, for future use)
   * @param {string} type - Transition type: 'fade', 'flash', 'none'
   * @param {number} duration - Total duration in milliseconds
   */
  transition(fromScene, toScene, type = this.config.defaultType, duration = this.config.duration) {
    // Cleanup any existing transition
    this.cleanup();

    // If reduced motion is preferred, use instant transition
    if (this.prefersReducedMotion) {
      type = 'none';
    }

    // Mark as active
    this.active = true;

    // Block user input during transition
    this.blockInput();

    // Emit transition start event
    this.eventBus.emit('transition:start', { type, duration });

    // Handle instant transition
    if (type === 'none') {
      this.complete();
      return;
    }

    // Calculate half duration for fade out/in
    const halfDuration = duration / 2;

    // Apply transition based on type
    switch (type) {
      case 'fade':
        this.executeFadeTransition(halfDuration);
        break;
      case 'flash':
        this.executeFlashTransition(duration);
        break;
      default:
        console.warn(`SceneTransition: Unknown transition type "${type}", using instant transition`);
        this.complete();
    }
  }

  /**
   * Execute fade transition (fade out, then fade in)
   * @param {number} halfDuration - Duration for each half of the transition
   */
  executeFadeTransition(halfDuration) {
    // Add fade-out class
    this.container.classList.add('scene-transition-fade-out');

    // After fade out completes, switch to fade in
    this.timeoutId = setTimeout(() => {
      this.container.classList.remove('scene-transition-fade-out');
      this.container.classList.add('scene-transition-fade-in');

      // After fade in completes, finish transition
      this.timeoutId = setTimeout(() => {
        this.complete();
      }, halfDuration);
    }, halfDuration);
  }

  /**
   * Execute flash transition (quick white flash)
   * @param {number} duration - Total duration of the flash
   */
  executeFlashTransition(duration) {
    // Add flash class
    this.container.classList.add('scene-transition-flash');

    // Remove flash class after duration
    this.timeoutId = setTimeout(() => {
      this.complete();
    }, duration);
  }

  /**
   * Block user input during transition
   */
  blockInput() {
    // Add a class that can be used to disable pointer events
    this.container.classList.add('transition-active');
  }

  /**
   * Unblock user input after transition
   */
  unblockInput() {
    this.container.classList.remove('transition-active');
  }

  /**
   * Complete the transition and cleanup
   */
  complete() {
    // Remove all transition classes
    this.container.classList.remove(
      'scene-transition-fade-out',
      'scene-transition-fade-in',
      'scene-transition-flash'
    );

    // Unblock user input
    this.unblockInput();

    // Clear timeout
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    // Mark as inactive
    this.active = false;

    // Emit complete event
    this.eventBus.emit('transition:complete');
  }

  /**
   * Cleanup transition state
   */
  cleanup() {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    // Remove all transition classes
    this.container.classList.remove(
      'scene-transition-fade-out',
      'scene-transition-fade-in',
      'scene-transition-flash',
      'transition-active'
    );

    this.active = false;
  }

  /**
   * Check if transition is currently active
   * @returns {boolean} True if transition is running
   */
  isActive() {
    return this.active;
  }
}

// ES6 module export - no global variables
export default SceneTransition;
