/**
 * NarratorAudioManager - Narrator Voice Playback System
 * 
 * Manages narrator voice audio playback for scenes with narration.
 * Handles play/pause, radio clip timing, and respects global mute state.
 * 
 * Features:
 * - HTML5 Audio API for playback
 * - One-shot playback (no looping)
 * - Play/pause toggle control
 * - Timed radio clip playback during narration
 * - Respects global mute state from AmbientSoundManager
 * - EventBus integration for scene transitions
 * - Graceful handling of missing audio files
 * 
 * Architecture: Engine logic only, zero content strings
 */

class NarratorAudioManager {
  constructor(eventBus, config = {}) {
    this.eventBus = eventBus;
    
    // Configuration with defaults
    this.config = {
      defaultVolume: config.defaultVolume || 0.8,
      audioPath: config.audioPath || './audio/narration/'
    };
    
    // Current narrator audio element
    this.narratorAudio = null;
    
    // Current radio clip audio elements
    this.radioClips = [];
    
    // Radio clip timeouts for cleanup
    this.radioTimeouts = [];
    
    // Narrator mute state (separate from ambient sound)
    this.narratorMuted = false;
    
    // Global mute state (from AmbientSoundManager)
    this.globalMuted = false;
    
    // Currently playing state
    this.isPlaying = false;
    
    // Current scene data
    this.currentSceneData = null;
    
    // Subscribe to EventBus events
    this.setupEventListeners();
  }

  /**
   * Setup EventBus event listeners
   */
  setupEventListeners() {
    // Listen for scene rendering to start narration
    this.eventBus.on('scene:rendered', (data) => {
      this.handleSceneRendered(data);
    });
    
    // Listen for scene transitions to stop narration
    this.eventBus.on('scene:transition', () => {
      this.stopNarration();
    });
    
    // Listen for global mute state changes
    this.eventBus.on('sound:muted', (data) => {
      this.globalMuted = data.muted;
      this.updateVolume();
    });
    
    // Listen for narrator toggle
    this.eventBus.on('narrator:toggle', () => {
      this.toggleNarrator();
    });
  }

  /**
   * Handle scene rendered event
   * @param {Object} data - Scene data with narratorAudio and radioClips
   */
  handleSceneRendered(data) {
    // Stop any existing narration
    this.stopNarration();
    
    // Check if scene has narrator audio
    if (!data.scene || !data.scene.narratorAudio) {
      return;
    }
    
    this.currentSceneData = data.scene;
    
    // Play narrator audio if not muted
    if (!this.narratorMuted) {
      this.playNarration(data.scene.narratorAudio, data.scene.radioClips);
    }
  }

  /**
   * Play narrator audio with optional radio clips
   * @param {string} audioPath - Path to narrator audio file
   * @param {Array} radioClips - Array of radio clip objects {id, src, triggerAfterMs}
   */
  playNarration(audioPath, radioClips = []) {
    if (!audioPath) {
      return;
    }
    
    // Create audio element
    this.narratorAudio = new Audio(audioPath);
    this.narratorAudio.volume = this.getEffectiveVolume();
    this.narratorAudio.preload = 'auto';
    
    // Handle audio errors gracefully
    this.narratorAudio.addEventListener('error', () => {
      console.warn(`NarratorAudioManager: Failed to load narrator audio: ${audioPath}`);
      console.warn('Game will continue without narrator audio.');
      this.eventBus.emit('narrator:error', { audioPath, error: 'Failed to load audio file' });
    });
    
    // Handle audio end
    this.narratorAudio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.eventBus.emit('narrator:ended', { audioPath });
    });
    
    // Play audio
    const playPromise = this.narratorAudio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.eventBus.emit('narrator:playing', { audioPath });
          
          // Schedule radio clips if provided
          if (radioClips && radioClips.length > 0) {
            this.scheduleRadioClips(radioClips);
          }
        })
        .catch(error => {
          console.error(`NarratorAudioManager: Failed to play narrator audio:`, error);
          this.eventBus.emit('narrator:error', { audioPath, error: error.message });
        });
    }
  }

  /**
   * Schedule radio clips to play at specific times during narration
   * @param {Array} radioClips - Array of {id, src, triggerAfterMs}
   */
  scheduleRadioClips(radioClips) {
    radioClips.forEach(clip => {
      const timeout = setTimeout(() => {
        this.playRadioClip(clip.src);
      }, clip.triggerAfterMs);
      
      this.radioTimeouts.push(timeout);
    });
  }

  /**
   * Play a radio clip
   * @param {string} clipPath - Path to radio clip audio file
   */
  playRadioClip(clipPath) {
    if (!clipPath) {
      return;
    }
    
    const radioAudio = new Audio(clipPath);
    radioAudio.volume = this.getEffectiveVolume();
    radioAudio.preload = 'auto';
    
    // Handle errors gracefully
    radioAudio.addEventListener('error', () => {
      console.warn(`NarratorAudioManager: Failed to load radio clip: ${clipPath}`);
    });
    
    // Clean up after playing
    radioAudio.addEventListener('ended', () => {
      const index = this.radioClips.indexOf(radioAudio);
      if (index > -1) {
        this.radioClips.splice(index, 1);
      }
    });
    
    // Play clip
    const playPromise = radioAudio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.radioClips.push(radioAudio);
          this.eventBus.emit('narrator:radio-clip-playing', { clipPath });
        })
        .catch(error => {
          console.error(`NarratorAudioManager: Failed to play radio clip:`, error);
        });
    }
  }

  /**
   * Stop all narration and radio clips
   */
  stopNarration() {
    // Stop narrator audio
    if (this.narratorAudio) {
      this.narratorAudio.pause();
      this.narratorAudio.currentTime = 0;
      this.narratorAudio = null;
      this.isPlaying = false;
    }
    
    // Stop all radio clips
    this.radioClips.forEach(clip => {
      clip.pause();
      clip.currentTime = 0;
    });
    this.radioClips = [];
    
    // Clear all radio timeouts
    this.radioTimeouts.forEach(timeout => clearTimeout(timeout));
    this.radioTimeouts = [];
    
    this.currentSceneData = null;
  }

  /**
   * Toggle narrator play/pause
   */
  toggleNarrator() {
    this.narratorMuted = !this.narratorMuted;
    
    if (this.narratorMuted) {
      // Pause narration
      if (this.narratorAudio && this.isPlaying) {
        this.narratorAudio.pause();
      }
      // Pause all radio clips
      this.radioClips.forEach(clip => clip.pause());
    } else {
      // Resume narration
      if (this.narratorAudio && !this.isPlaying) {
        this.narratorAudio.play().catch(error => {
          console.error('NarratorAudioManager: Failed to resume narration:', error);
        });
      }
      // Resume all radio clips
      this.radioClips.forEach(clip => {
        clip.play().catch(error => {
          console.error('NarratorAudioManager: Failed to resume radio clip:', error);
        });
      });
    }
    
    // Update volume
    this.updateVolume();
    
    // Emit state change
    this.eventBus.emit('narrator:muted', { muted: this.narratorMuted });
  }

  /**
   * Update volume for all audio elements
   */
  updateVolume() {
    const volume = this.getEffectiveVolume();
    
    if (this.narratorAudio) {
      this.narratorAudio.volume = volume;
    }
    
    this.radioClips.forEach(clip => {
      clip.volume = volume;
    });
  }

  /**
   * Get effective volume based on mute states
   * @returns {number} Volume level 0.0-1.0
   */
  getEffectiveVolume() {
    if (this.globalMuted || this.narratorMuted) {
      return 0;
    }
    return this.config.defaultVolume;
  }

  /**
   * Check if narrator is muted
   * @returns {boolean} True if muted
   */
  isMuted() {
    return this.narratorMuted;
  }

  /**
   * Check if narrator is currently playing
   * @returns {boolean} True if playing
   */
  isNarratorPlaying() {
    return this.isPlaying;
  }

  /**
   * Cleanup method - stop all audio and clear resources
   */
  destroy() {
    this.stopNarration();
  }
}

// ES6 module export - no global variables
export default NarratorAudioManager;
