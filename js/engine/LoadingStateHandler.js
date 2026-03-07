/**
 * LoadingStateHandler - Module Loading State Management
 * 
 * Manages the loading screen state during ES6 module initialization and asset loading.
 * Subscribes to EventBus events to show/hide loading animations and update progress.
 * 
 * Events subscribed to:
 * - modules:loading - Show loading screen
 * - modules:loaded - Hide loading screen
 * - module:progress - Update loading progress
 * 
 * Requirements: 18.3
 */

class LoadingStateHandler {
  constructor() {
    // Get reference to loading screen DOM element
    this.loadingScreen = document.getElementById('loading-screen');
    this.loadingMessage = this.loadingScreen?.querySelector('.loading-content p');
    
    if (!this.loadingScreen) {
      console.warn('LoadingStateHandler: loading-screen element not found in DOM');
    }
  }

  /**
   * Show loading animation with optional message
   * @param {string} message - Optional loading message to display
   */
  showLoading(message = 'Loading historical experience...') {
    if (!this.loadingScreen) {
      console.warn('LoadingStateHandler: Cannot show loading - element not found');
      return;
    }

    // Update message if provided
    if (this.loadingMessage && message) {
      this.loadingMessage.textContent = message;
    }

    // Show loading screen
    this.loadingScreen.classList.add('active');
  }

  /**
   * Hide loading animation
   */
  hideLoading() {
    if (!this.loadingScreen) {
      console.warn('LoadingStateHandler: Cannot hide loading - element not found');
      return;
    }

    // Hide loading screen with fade out
    this.loadingScreen.classList.remove('active');
  }

  /**
   * Update loading progress
   * @param {number} percent - Progress percentage (0-100)
   */
  updateProgress(percent) {
    if (typeof percent !== 'number' || percent < 0 || percent > 100) {
      console.warn('LoadingStateHandler: Invalid progress value. Must be between 0 and 100.');
      return;
    }

    // Update loading message with progress
    if (this.loadingMessage) {
      this.loadingMessage.textContent = `Loading... ${Math.round(percent)}%`;
    }
  }

  /**
   * Subscribe to EventBus events for automatic loading state management
   * @param {EventBus} eventBus - The application event bus instance
   */
  subscribeToEvents(eventBus) {
    if (!eventBus) {
      console.error('LoadingStateHandler: EventBus instance required for subscribeToEvents');
      return;
    }

    // Show loading when modules start loading
    eventBus.on('modules:loading', (data) => {
      const message = data?.message || 'Loading historical experience...';
      this.showLoading(message);
    });

    // Hide loading when modules finish loading
    eventBus.on('modules:loaded', () => {
      this.hideLoading();
    });

    // Update progress during module loading
    eventBus.on('module:progress', (data) => {
      if (data?.percent !== undefined) {
        this.updateProgress(data.percent);
      }
    });

    // Show loading when game starts initializing
    eventBus.on('game:initializing', (data) => {
      const message = data?.message || 'Initializing game engine...';
      this.showLoading(message);
    });

    // Hide loading when game is ready
    eventBus.on('game:ready', () => {
      this.hideLoading();
    });
  }
}

// ES6 module export - no global variables
export default LoadingStateHandler;
