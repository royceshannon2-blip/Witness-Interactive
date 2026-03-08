/**
 * TimedChoiceSystem - Countdown Timer for Urgent Decisions
 * 
 * Adds time pressure to critical choices in Pearl Harbor scenes.
 * Displays a countdown timer and auto-selects a default choice if time expires.
 * 
 * Features:
 * - Configurable timer duration per scene
 * - Visual countdown with warning threshold
 * - Auto-select default choice on expiration
 * - Cancels on player choice or scene transition
 * - EventBus integration for decoupled communication
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.7, 8.1
 */

class TimedChoiceSystem {
  /**
   * @param {EventBus} eventBus - Event system for component communication
   * @param {Object} config - Configuration options
   * @param {number} config.warningThreshold - Time in ms to show warning (default: 3000)
   * @param {number} config.pulseInterval - Pulse animation interval in ms (default: 500)
   */
  constructor(eventBus, config = {}) {
    this.eventBus = eventBus;
    this.config = {
      warningThreshold: config.warningThreshold || 3000,
      pulseInterval: config.pulseInterval || 500
    };

    // Timer state
    this.timerId = null;
    this.startTime = null;
    this.duration = null;
    this.defaultChoiceId = null;
    this.onExpireCallback = null;
    this.isActive = false;

    // Subscribe to events
    this.eventBus.on('scene:transition', () => this.cancelTimer());
    this.eventBus.on('choice:made', () => this.cancelTimer());
  }

  /**
   * Start countdown timer for a timed choice
   * @param {number} duration - Timer duration in milliseconds
   * @param {string} defaultChoiceId - Choice ID to auto-select on expiration
   * @param {Function} onExpire - Callback to invoke when timer expires
   */
  startTimer(duration, defaultChoiceId, onExpire) {
    // Cancel any existing timer
    this.cancelTimer();

    // Validate parameters
    if (typeof duration !== 'number' || duration <= 0) {
      console.error('TimedChoiceSystem: duration must be a positive number');
      return;
    }

    if (typeof defaultChoiceId !== 'string' || !defaultChoiceId) {
      console.error('TimedChoiceSystem: defaultChoiceId must be a non-empty string');
      return;
    }

    if (typeof onExpire !== 'function') {
      console.error('TimedChoiceSystem: onExpire must be a function');
      return;
    }

    // Initialize timer state
    this.startTime = Date.now();
    this.duration = duration;
    this.defaultChoiceId = defaultChoiceId;
    this.onExpireCallback = onExpire;
    this.isActive = true;

    // Emit timer started event
    this.eventBus.emit('timer:started', {
      duration: this.duration,
      defaultChoiceId: this.defaultChoiceId
    });

    // Start countdown interval (update every 100ms for smooth UI)
    this.timerId = setInterval(() => {
      const remaining = this.getRemainingTime();

      // Emit update event for UI
      this.eventBus.emit('timer:update', {
        remaining: remaining,
        isWarning: remaining <= this.config.warningThreshold
      });

      // Check if timer expired
      if (remaining <= 0) {
        this._handleExpiration();
      }
    }, 100);
  }

  /**
   * Cancel the active timer
   */
  cancelTimer() {
    if (!this.isActive) {
      return; // No active timer
    }

    // Clear interval
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }

    // Emit cancelled event
    this.eventBus.emit('timer:cancelled');

    // Reset state
    this.isActive = false;
    this.startTime = null;
    this.duration = null;
    this.defaultChoiceId = null;
    this.onExpireCallback = null;
  }

  /**
   * Get remaining time in milliseconds
   * @returns {number} Remaining time in ms (0 if expired or no active timer)
   */
  getRemainingTime() {
    if (!this.isActive || this.startTime === null || this.duration === null) {
      return 0;
    }

    const elapsed = Date.now() - this.startTime;
    const remaining = Math.max(0, this.duration - elapsed);
    
    return remaining;
  }

  /**
   * Handle timer expiration
   * @private
   */
  _handleExpiration() {
    if (!this.isActive) {
      return; // Already handled
    }

    // Store callback before clearing state
    const callback = this.onExpireCallback;
    const choiceId = this.defaultChoiceId;

    // Emit expired event
    this.eventBus.emit('timer:expired', {
      defaultChoiceId: choiceId
    });

    // Cancel timer (clears state)
    this.cancelTimer();

    // Invoke callback to auto-select default choice
    if (callback) {
      callback(choiceId);
    }
  }
}

// ES6 module export - no global variables
export default TimedChoiceSystem;
