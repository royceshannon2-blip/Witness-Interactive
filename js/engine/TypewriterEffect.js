/**
 * TypewriterEffect - Text Reveal Animation
 * 
 * Provides a typewriter-style text reveal effect for narrative text.
 * Supports skip-to-end functionality and completion callbacks.
 * 
 * Requirements: 7.1
 */

class TypewriterEffect {
  constructor() {
    // Track active animation state
    this.active = false;
    
    // Store current animation timeout ID for cancellation
    this.timeoutId = null;
    
    // Store current element being animated
    this.currentElement = null;
    
    // Store completion callback
    this.onComplete = null;
    
    // Store full text for skip functionality
    this.fullText = '';
    
    // Detect mobile devices for performance optimization
    this.isMobile = this.detectMobile();
  }

  /**
   * Detect if the user is on a mobile device
   * @returns {boolean} True if mobile device detected
   * @private
   */
  detectMobile() {
    // Check for touch support and small screen size
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    
    // Check user agent for mobile keywords
    const mobileKeywords = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobileUA = mobileKeywords.test(navigator.userAgent);
    
    return (hasTouchScreen && isSmallScreen) || isMobileUA;
  }

  /**
   * Reveal text character by character with typewriter effect
   * @param {HTMLElement} element - Target element to animate
   * @param {string} text - Full text to reveal
   * @param {number} speed - Speed in milliseconds per character (default: 30ms)
   * @param {Function} onComplete - Callback function when animation completes
   */
  revealText(element, text, speed = 30, onComplete = null) {
    // Validate inputs
    if (!element || typeof text !== 'string') {
      console.error('TypewriterEffect.revealText: Invalid element or text');
      if (onComplete) onComplete();
      return;
    }
    
    // Cancel any existing animation
    this.cancel();
    
    // Adjust speed for mobile devices (30% faster)
    const adjustedSpeed = this.isMobile ? Math.round(speed * 0.7) : speed;
    
    // Store state
    this.active = true;
    this.currentElement = element;
    this.fullText = text;
    this.onComplete = onComplete;
    
    // Clear element and prepare for animation
    element.textContent = '';
    element.style.opacity = '1';
    
    // Start character-by-character reveal
    this.animateCharacters(element, text, adjustedSpeed, 0);
  }

  /**
   * Animate characters recursively
   * @param {HTMLElement} element - Target element
   * @param {string} text - Full text
   * @param {number} speed - Speed per character
   * @param {number} index - Current character index
   * @private
   */
  animateCharacters(element, text, speed, index) {
    // Check if animation was cancelled
    if (!this.active) {
      return;
    }
    
    // Check if we've reached the end
    if (index >= text.length) {
      this.complete();
      return;
    }
    
    // Add next character
    element.textContent = text.substring(0, index + 1);
    
    // Schedule next character
    this.timeoutId = setTimeout(() => {
      this.animateCharacters(element, text, speed, index + 1);
    }, speed);
  }

  /**
   * Skip to end of animation immediately
   */
  skipToEnd() {
    if (!this.active || !this.currentElement) {
      return;
    }
    
    // Cancel ongoing animation
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    // Show full text immediately
    this.currentElement.textContent = this.fullText;
    
    // Complete the animation
    this.complete();
  }

  /**
   * Complete the animation and trigger callback
   * @private
   */
  complete() {
    this.active = false;
    
    // Clear timeout if any
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    // Trigger completion callback
    if (this.onComplete) {
      const callback = this.onComplete;
      this.onComplete = null; // Clear callback to prevent double-firing
      callback();
    }
    
    // Clear references
    this.currentElement = null;
    this.fullText = '';
  }

  /**
   * Cancel the current animation without triggering completion callback
   */
  cancel() {
    if (!this.active) {
      return;
    }
    
    this.active = false;
    
    // Clear timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    // Clear state without triggering callback
    this.onComplete = null;
    this.currentElement = null;
    this.fullText = '';
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
