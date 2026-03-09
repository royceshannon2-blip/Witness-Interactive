/**
 * HapticFeedback - Provides haptic feedback for mobile devices
 * Uses Vibration API for tactile feedback on supported devices
 */
export class HapticFeedback {
  constructor() {
    this.isSupported = 'vibrate' in navigator;
  }

  /**
   * Light tap feedback (button press, selection)
   */
  light() {
    if (this.isSupported) {
      navigator.vibrate(10);
    }
  }

  /**
   * Medium feedback (important action, toggle)
   */
  medium() {
    if (this.isSupported) {
      navigator.vibrate(20);
    }
  }

  /**
   * Heavy feedback (error, warning, significant event)
   */
  heavy() {
    if (this.isSupported) {
      navigator.vibrate(40);
    }
  }

  /**
   * Success pattern (task completion)
   */
  success() {
    if (this.isSupported) {
      navigator.vibrate([10, 50, 10]);
    }
  }

  /**
   * Error pattern (invalid action)
   */
  error() {
    if (this.isSupported) {
      navigator.vibrate([20, 100, 20, 100, 20]);
    }
  }

  /**
   * Selection pattern (choice made)
   */
  selection() {
    if (this.isSupported) {
      navigator.vibrate([5, 30, 5]);
    }
  }
}
