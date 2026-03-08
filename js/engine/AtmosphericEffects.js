/**
 * AtmosphericEffects - CSS-based Visual Effects Manager
 * 
 * Triggers CSS-based visual effects for dramatic moments in Pearl Harbor scenes.
 * All effects are implemented in css/atmospheric-effects.css using GPU-accelerated
 * properties for 60fps performance.
 * 
 * Supported Effects:
 * - smoke: Dark particles rising (burning ships, fires)
 * - fire: Orange/red flickering glow (explosions, burning oil)
 * - shake: Screen shake animation (explosions, bomb impacts)
 * - dawn: Soft orange/pink gradient (peaceful morning before attack)
 * - explosion: Bright white flash + fade (magazine detonation, bomb hits)
 * - aftermath: Desaturated hazy overlay (post-attack devastation)
 * - rain: Subtle rain particles (weather conditions)
 * - ocean: Gentle wave motion blur (aboard ships)
 * - ash: Gray ash particles falling (post-attack fallout)
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 7.1
 */

class AtmosphericEffects {
  /**
   * Create AtmosphericEffects manager
   * @param {EventBus} eventBus - Event bus for component communication
   * @param {Object} config - Configuration options
   * @param {number} config.defaultDuration - Default effect duration in ms (default: 2000)
   * @param {boolean} config.respectMotionPrefs - Check prefers-reduced-motion (default: true)
   */
  constructor(eventBus, config = {}) {
    if (!eventBus) {
      throw new Error('AtmosphericEffects requires an EventBus instance');
    }

    this.eventBus = eventBus;
    this.config = {
      defaultDuration: config.defaultDuration || 2000,
      respectMotionPrefs: config.respectMotionPrefs !== false
    };

    // Track active effects and their timeout IDs
    // Map<effectName, timeoutId>
    this.activeEffects = new Map();

    // Check if user prefers reduced motion
    this.prefersReducedMotion = this.config.respectMotionPrefs && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Subscribe to scene transitions to clear effects
    this.eventBus.on('scene:transition', () => {
      this.clearAllEffects();
    });
  }

  /**
   * Apply an atmospheric effect
   * @param {string|string[]} effectName - Name of effect(s) to apply
   * @param {number} duration - Duration in milliseconds (optional, uses default if not specified)
   */
  applyEffect(effectName, duration) {
    // Handle array of effects
    if (Array.isArray(effectName)) {
      effectName.forEach(effect => this.applyEffect(effect, duration));
      return;
    }

    // Validate effect name
    if (typeof effectName !== 'string' || !effectName) {
      console.error('AtmosphericEffects.applyEffect: effectName must be a non-empty string');
      return;
    }

    // Skip if user prefers reduced motion
    if (this.prefersReducedMotion) {
      console.log(`AtmosphericEffects: Skipping effect "${effectName}" due to prefers-reduced-motion`);
      return;
    }

    // Use default duration if not specified
    const effectDuration = typeof duration === 'number' ? duration : this.config.defaultDuration;

    // Add CSS class to body
    const className = `effect-${effectName}`;
    document.body.classList.add(className);

    // Clear existing timeout for this effect if it exists
    if (this.activeEffects.has(effectName)) {
      clearTimeout(this.activeEffects.get(effectName));
    }

    // Set timeout to auto-remove effect
    const timeoutId = setTimeout(() => {
      this.removeEffect(effectName);
    }, effectDuration);

    // Track active effect
    this.activeEffects.set(effectName, timeoutId);

    // Emit event
    this.eventBus.emit('effect:applied', { effectName, duration: effectDuration });
  }

  /**
   * Remove an atmospheric effect
   * @param {string} effectName - Name of effect to remove
   */
  removeEffect(effectName) {
    if (typeof effectName !== 'string' || !effectName) {
      console.error('AtmosphericEffects.removeEffect: effectName must be a non-empty string');
      return;
    }

    // Remove CSS class from body
    const className = `effect-${effectName}`;
    document.body.classList.remove(className);

    // Clear timeout if exists
    if (this.activeEffects.has(effectName)) {
      clearTimeout(this.activeEffects.get(effectName));
      this.activeEffects.delete(effectName);
    }

    // Emit event
    this.eventBus.emit('effect:removed', { effectName });
  }

  /**
   * Clear all active atmospheric effects
   */
  clearAllEffects() {
    // Remove all effect classes and clear timeouts
    this.activeEffects.forEach((timeoutId, effectName) => {
      clearTimeout(timeoutId);
      const className = `effect-${effectName}`;
      document.body.classList.remove(className);
    });

    // Clear the map
    this.activeEffects.clear();
  }

  /**
   * Check if an effect is currently active
   * @param {string} effectName - Name of effect to check
   * @returns {boolean} True if effect is active
   */
  isEffectActive(effectName) {
    return this.activeEffects.has(effectName);
  }

  /**
   * Get list of all active effects
   * @returns {string[]} Array of active effect names
   */
  getActiveEffects() {
    return Array.from(this.activeEffects.keys());
  }
}

// ES6 module export - no global variables
export default AtmosphericEffects;
