/**
 * AmbientSoundManager - Background Audio System
 * 
 * Manages atmospheric background audio playback with crossfading support.
 * Handles mute state, volume control, and graceful degradation for missing files.
 * 
 * Features:
 * - HTML5 Audio API for playback
 * - Crossfading between different ambient sounds
 * - Mute/unmute toggle
 * - Graceful handling of missing audio files
 * - EventBus integration for scene transitions
 * 
 * Requirements: 3.1-3.10, 8.1-8.5
 */

class AmbientSoundManager {
  constructor(eventBus, config = {}) {
    this.eventBus = eventBus;
    
    // Configuration with defaults
    this.config = {
      defaultVolume: config.defaultVolume || 0.6,
      crossfadeDuration: config.crossfadeDuration || 1000,
      preloadOnStart: config.preloadOnStart || true,
      audioPath: config.audioPath || './audio/ambient/'
    };
    
    // Audio elements storage: Map<soundId, HTMLAudioElement>
    this.audioElements = new Map();
    
    // Currently playing sounds: Map<soundId, {element, volume}>
    this.activeSounds = new Map();
    
    // Mute state (stored in memory, not localStorage per requirements)
    this.muted = false;
    
    // Crossfade animation frame ID for cleanup
    this.crossfadeAnimationId = null;
    
    // Subscribe to EventBus events
    this.setupEventListeners();
  }

  /**
   * Setup EventBus event listeners
   */
  setupEventListeners() {
    // Listen for scene transitions to handle ambient sound changes
    this.eventBus.on('scene:transition', (data) => {
      // Scene transition handling will be done by UIController
      // This is here for potential future direct scene-to-sound mapping
    });
    
    // Listen for sound toggle from UI
    this.eventBus.on('sound:toggle', () => {
      this.toggleMute();
    });
  }

  /**
   * Play a sound with optional looping and volume
   * @param {string} soundId - Identifier for the sound (e.g., 'ocean-waves')
   * @param {boolean} loop - Whether to loop the sound (default: true)
   * @param {number} volume - Volume level 0.0-1.0 (default: config.defaultVolume)
   */
  playSound(soundId, loop = true, volume = null) {
    if (!soundId) {
      console.error('AmbientSoundManager.playSound: soundId is required');
      return;
    }
    
    const targetVolume = volume !== null ? volume : this.config.defaultVolume;
    
    // Get or create audio element
    let audioElement = this.audioElements.get(soundId);
    
    if (!audioElement) {
      audioElement = this.createAudioElement(soundId);
      if (!audioElement) {
        // Failed to create audio element (file missing or error)
        return;
      }
      this.audioElements.set(soundId, audioElement);
    }
    
    // Configure audio element
    audioElement.loop = loop;
    audioElement.volume = this.muted ? 0 : targetVolume;
    
    // Play audio
    const playPromise = audioElement.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Store as active sound
          this.activeSounds.set(soundId, {
            element: audioElement,
            volume: targetVolume
          });
          
          // Emit event
          this.eventBus.emit('sound:playing', { soundId, volume: targetVolume });
        })
        .catch(error => {
          console.error(`AmbientSoundManager: Failed to play sound "${soundId}":`, error);
          this.eventBus.emit('sound:error', { soundId, error: error.message });
        });
    }
  }

  /**
   * Stop a sound with optional fade out
   * @param {string} soundId - Identifier for the sound to stop
   * @param {boolean} fadeOut - Whether to fade out (default: false)
   */
  stopSound(soundId, fadeOut = false) {
    const activeSound = this.activeSounds.get(soundId);
    
    if (!activeSound) {
      return; // Sound not playing
    }
    
    const { element } = activeSound;
    
    if (fadeOut) {
      // Fade out over 500ms
      this.fadeVolume(element, element.volume, 0, 500, () => {
        element.pause();
        element.currentTime = 0;
        this.activeSounds.delete(soundId);
        this.eventBus.emit('sound:stopped', { soundId });
      });
    } else {
      // Stop immediately
      element.pause();
      element.currentTime = 0;
      this.activeSounds.delete(soundId);
      this.eventBus.emit('sound:stopped', { soundId });
    }
  }

  /**
   * Crossfade from one sound to another
   * @param {string} fromSoundId - Sound to fade out (null if none)
   * @param {string} toSoundId - Sound to fade in
   * @param {number} duration - Crossfade duration in milliseconds
   */
  crossfade(fromSoundId, toSoundId, duration = null) {
    const crossfadeDuration = duration !== null ? duration : this.config.crossfadeDuration;
    
    // If no fromSound, just play the new sound
    if (!fromSoundId || !this.activeSounds.has(fromSoundId)) {
      this.playSound(toSoundId, true);
      return;
    }
    
    // If same sound, do nothing
    if (fromSoundId === toSoundId) {
      return;
    }
    
    const fromSound = this.activeSounds.get(fromSoundId);
    const fromElement = fromSound.element;
    const fromVolume = fromSound.volume;
    
    // Start playing the new sound at volume 0
    const toElement = this.audioElements.get(toSoundId) || this.createAudioElement(toSoundId);
    if (!toElement) {
      // Failed to create new audio element, just stop the old one
      this.stopSound(fromSoundId, true);
      return;
    }
    
    if (!this.audioElements.has(toSoundId)) {
      this.audioElements.set(toSoundId, toElement);
    }
    
    toElement.loop = true;
    toElement.volume = 0;
    
    const playPromise = toElement.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Store as active sound
          this.activeSounds.set(toSoundId, {
            element: toElement,
            volume: this.config.defaultVolume
          });
          
          // Perform crossfade
          this.performCrossfade(fromElement, toElement, fromVolume, this.config.defaultVolume, crossfadeDuration, () => {
            // Stop the old sound after crossfade
            fromElement.pause();
            fromElement.currentTime = 0;
            this.activeSounds.delete(fromSoundId);
            this.eventBus.emit('sound:stopped', { soundId: fromSoundId });
          });
          
          this.eventBus.emit('sound:playing', { soundId: toSoundId, volume: this.config.defaultVolume });
        })
        .catch(error => {
          console.error(`AmbientSoundManager: Failed to crossfade to sound "${toSoundId}":`, error);
          this.eventBus.emit('sound:error', { soundId: toSoundId, error: error.message });
          // Stop the old sound anyway
          this.stopSound(fromSoundId, true);
        });
    }
  }

  /**
   * Toggle mute state
   */
  toggleMute() {
    this.muted = !this.muted;
    
    // Update volume for all active sounds
    this.activeSounds.forEach((soundData, soundId) => {
      const { element, volume } = soundData;
      element.volume = this.muted ? 0 : volume;
    });
    
    // Emit mute state change (for UI updates)
    this.eventBus.emit('sound:muted', { muted: this.muted });
  }

  /**
   * Check if audio is muted
   * @returns {boolean} True if muted
   */
  isMuted() {
    return this.muted;
  }

  /**
   * Create an audio element for a sound
   * @param {string} soundId - Identifier for the sound
   * @returns {HTMLAudioElement|null} Audio element or null if failed
   */
  createAudioElement(soundId) {
    const audio = new Audio();
    
    // Try common audio extensions if soundId doesn't include one
    const extensions = ['.mp3', '.wav', '.flac', '.ogg', '.m4a'];
    const hasExtension = extensions.some(ext => soundId.toLowerCase().endsWith(ext));
    const audioPath = hasExtension 
      ? `${this.config.audioPath}${soundId}`
      : `${this.config.audioPath}${soundId}.mp3`;
    
    audio.src = audioPath;
    audio.preload = 'auto';
    
    // Handle load errors gracefully
    audio.addEventListener('error', (e) => {
      console.warn(`AmbientSoundManager: Audio file not found or failed to load: ${audioPath}`);
      console.warn('Game will continue without this audio. This is expected if audio files have not been provided yet.');
      this.eventBus.emit('sound:error', { soundId, error: 'Failed to load audio file' });
    });
    
    return audio;
  }

  /**
   * Fade volume from one level to another
   * @param {HTMLAudioElement} element - Audio element to fade
   * @param {number} fromVolume - Starting volume
   * @param {number} toVolume - Target volume
   * @param {number} duration - Fade duration in milliseconds
   * @param {Function} onComplete - Callback when fade completes
   */
  fadeVolume(element, fromVolume, toVolume, duration, onComplete) {
    if (this.muted) {
      // If muted, skip fade and complete immediately
      element.volume = 0;
      if (onComplete) onComplete();
      return;
    }
    
    const startTime = performance.now();
    const volumeDelta = toVolume - fromVolume;
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Linear interpolation
      const currentVolume = fromVolume + (volumeDelta * progress);
      element.volume = this.muted ? 0 : currentVolume;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        if (onComplete) onComplete();
      }
    };
    
    requestAnimationFrame(animate);
  }

  /**
   * Perform crossfade between two audio elements
   * @param {HTMLAudioElement} fromElement - Element to fade out
   * @param {HTMLAudioElement} toElement - Element to fade in
   * @param {number} fromVolume - Starting volume for fromElement
   * @param {number} toVolume - Target volume for toElement
   * @param {number} duration - Crossfade duration in milliseconds
   * @param {Function} onComplete - Callback when crossfade completes
   */
  performCrossfade(fromElement, toElement, fromVolume, toVolume, duration, onComplete) {
    if (this.muted) {
      // If muted, skip crossfade and complete immediately
      fromElement.volume = 0;
      toElement.volume = 0;
      if (onComplete) onComplete();
      return;
    }
    
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Fade out old sound
      const currentFromVolume = fromVolume * (1 - progress);
      fromElement.volume = this.muted ? 0 : currentFromVolume;
      
      // Fade in new sound
      const currentToVolume = toVolume * progress;
      toElement.volume = this.muted ? 0 : currentToVolume;
      
      if (progress < 1) {
        this.crossfadeAnimationId = requestAnimationFrame(animate);
      } else {
        this.crossfadeAnimationId = null;
        if (onComplete) onComplete();
      }
    };
    
    this.crossfadeAnimationId = requestAnimationFrame(animate);
  }

  /**
   * Cleanup method - stop all sounds and clear resources
   */
  destroy() {
    // Cancel any ongoing crossfade
    if (this.crossfadeAnimationId) {
      cancelAnimationFrame(this.crossfadeAnimationId);
    }
    
    // Stop all active sounds
    this.activeSounds.forEach((soundData, soundId) => {
      soundData.element.pause();
      soundData.element.currentTime = 0;
    });
    
    // Clear all maps
    this.activeSounds.clear();
    this.audioElements.clear();
  }
}

// ES6 module export - no global variables
export default AmbientSoundManager;
