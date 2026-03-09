/**
 * TypewriterEffect - Character-by-character text reveal animation
 * 
 * Creates narrative immersion by revealing text sequentially rather than
 * displaying it all at once. Respects accessibility preferences and allows
 * users to skip the animation.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 7.1, 8.1
 */

class TypewriterEffect {
  /**
   * @param {EventBus} eventBus - Event system for component communication
   * @param {Object} config - Configuration options
   * @param {number} config.defaultSpeed - Milliseconds per character (default: 30)
   * @param {boolean} config.skipOnClick - Allow click to complete (default: true)
   * @param {boolean} config.respectMotionPrefs - Check prefers-reduced-motion (default: true)
   */
  constructor(eventBus, config = {}) {
    this.eventBus = eventBus;
    this.config = {
      defaultSpeed: config.defaultSpeed || 30,
      skipOnClick: config.skipOnClick !== false,
      respectMotionPrefs: config.respectMotionPrefs !== false
    };

    // Animation state
    this.active = false;
    this.animationId = null;
    this.currentElement = null;
    this.fullText = '';
    this.currentIndex = 0;
    this.onCompleteCallback = null;
    this.lastFrameTime = 0;
    this.speed = this.config.defaultSpeed;

    // Check for reduced motion preference
    this.prefersReducedMotion = this.config.respectMotionPrefs && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Subscribe to scene transitions to cleanup
    this.eventBus.on('scene:transition', () => this.cleanup());

    // Bind click handler for skip functionality
    this.skipHandler = () => this.skipToEnd();
  }

  /**
   * Reveal text character by character
   * @param {HTMLElement} element - DOM element to display text in
   * @param {string} text - Full text to reveal
   * @param {number} speed - Milliseconds per character (optional, uses default if not provided)
   * @param {Function} onComplete - Callback when animation finishes
   */
  revealText(element, text, speed, onComplete) {
    // Cleanup any existing animation
    this.cleanup();

    // Store parameters
    this.currentElement = element;
    this.fullText = text;
    this.speed = speed || this.config.defaultSpeed;
    this.onCompleteCallback = onComplete;
    this.currentIndex = 0;
    this.active = true;

    // Clear element content
    if (this.currentElement) {
      this.currentElement.textContent = '';
    }

    // If reduced motion is preferred, show text instantly
    if (this.prefersReducedMotion) {
      this.skipToEnd();
      return;
    }

    // Add click listener for skip functionality after a small delay
    // This prevents the click that triggered the scene transition from immediately skipping
    if (this.config.skipOnClick) {
      setTimeout(() => {
        if (this.active) {
          document.addEventListener('click', this.skipHandler);
        }
      }, 100);
    }

    // Start animation
    this.lastFrameTime = performance.now();
    this.animate(this.lastFrameTime);
  }

  /**
   * Animation loop using requestAnimationFrame
   * @param {number} currentTime - Current timestamp from requestAnimationFrame
   */
  animate(currentTime) {
    if (!this.active) {
      return;
    }

    // Calculate time elapsed since last character
    const elapsed = currentTime - this.lastFrameTime;

    // Check if enough time has passed to reveal next character
    if (elapsed >= this.speed) {
      // Reveal next character
      if (this.currentIndex < this.fullText.length) {
        this.currentIndex++;
        if (this.currentElement) {
          this.currentElement.textContent = this.fullText.substring(0, this.currentIndex);
        }
        this.lastFrameTime = currentTime;
      } else {
        // Animation complete
        this.complete();
        return;
      }
    }

    // Continue animation
    this.animationId = requestAnimationFrame((time) => this.animate(time));
  }

  /**
   * Skip to end of animation and show full text immediately
   */
  skipToEnd() {
    if (!this.active) {
      return;
    }

    // Show full text
    if (this.currentElement) {
      this.currentElement.textContent = this.fullText;
    }

    // Emit skipped event
    this.eventBus.emit('typewriter:skipped');

    // Complete animation
    this.complete();
  }

  /**
   * Complete the animation and cleanup
   */
  complete() {
    // Cancel animation frame
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // Remove click listener
    if (this.config.skipOnClick) {
      document.removeEventListener('click', this.skipHandler);
    }

    // Mark as inactive
    this.active = false;

    // Emit complete event
    this.eventBus.emit('typewriter:complete');

    // Call completion callback
    if (this.onCompleteCallback) {
      this.onCompleteCallback();
    }
  }

  /**
   * Cleanup animation state
   */
  cleanup() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.config.skipOnClick) {
      document.removeEventListener('click', this.skipHandler);
    }

    this.active = false;
    this.currentElement = null;
    this.fullText = '';
    this.currentIndex = 0;
    this.onCompleteCallback = null;
  }

  /**
   * Check if animation is currently active
   * @returns {boolean} True if animation is running
   */
  isActive() {
    return this.active;
  }
}

// ES6 module export - no global variables
export default TypewriterEffect;
