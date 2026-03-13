/**
 * LoadingStateHandler - Module Loading State Management
 *
 * Manages the loading screen state during ES6 module initialization and asset loading.
 * Subscribes to EventBus events to show/hide loading animations and update progress.
 *
 * Events subscribed to:
 * - modules:loading - Show loading screen
 * - modules:loaded  - Hide loading screen
 * - module:progress - Update loading progress
 *
 * Requirements: 18.3
 */
class LoadingStateHandler {
  constructor() {
    this.loadingScreen = document.getElementById('loading-screen');
    this.loadingMessage = this.loadingScreen?.querySelector('.loading-content p');

    if (!this.loadingScreen) {
      console.warn('LoadingStateHandler: loading-screen element not found in DOM');
    }

    console.log('✓ LoadingStateHandler initialized');
  }

  showLoading(message = 'Loading historical experience...') {
    if (!this.loadingScreen) {
      console.warn('LoadingStateHandler: Cannot show loading - element not found');
      return;
    }
    if (this.loadingMessage && message) {
      this.loadingMessage.textContent = message;
    }
    this.loadingScreen.classList.add('active');
  }

  hideLoading() {
    if (!this.loadingScreen) {
      console.warn('LoadingStateHandler: Cannot hide loading - element not found');
      return;
    }
    this.loadingScreen.classList.remove('active');
  }

  updateProgress(percent) {
    if (typeof percent !== 'number' || percent < 0 || percent > 100) {
      console.warn('LoadingStateHandler: Invalid progress value. Must be between 0 and 100.');
      return;
    }
    if (this.loadingMessage) {
      this.loadingMessage.textContent = `Loading... ${Math.round(percent)}%`;
    }
  }

  subscribeToEvents(eventBus) {
    if (!eventBus) {
      console.error('LoadingStateHandler: EventBus instance required for subscribeToEvents');
      return;
    }
    eventBus.on('modules:loading', (data) => {
      const message = data?.message || 'Loading historical experience...';
      this.showLoading(message);
    });
    eventBus.on('modules:loaded', () => {
      this.hideLoading();
    });
    eventBus.on('module:progress', (data) => {
      if (data?.percent !== undefined) {
        this.updateProgress(data.percent);
      }
    });
    eventBus.on('game:initializing', (data) => {
      const message = data?.message || 'Initializing game engine...';
      this.showLoading(message);
    });
    eventBus.on('game:ready', () => {
      this.hideLoading();
    });
  }
}

export default LoadingStateHandler;