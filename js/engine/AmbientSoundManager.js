/**
 * AmbientSoundManager - Background Audio System with Web Audio API
 * 
 * Manages atmospheric background audio playback with crossfading support.
 * Uses Web Audio API for precise control and better performance.
 * 
 * Features:
 * - Web Audio API (AudioContext) for playback
 * - Crossfading between different ambient sounds
 * - Mute/unmute toggle
 * - Graceful handling of missing audio files
 * - EventBus integration for scene transitions
 * - Proper AudioContext resume after user gesture
 * 
 * Requirements: 3.1-3.10, 8.1-8.5
 */

class AmbientSoundManager {
  constructor(eventBus, audioContext, config = {}) {
    this.eventBus = eventBus;
    this.audioContext = audioContext;
    
    // Configuration with defaults
    this.config = {
      defaultVolume: config.defaultVolume || 0.15, // 15% — balanced against narrator audio
      crossfadeDuration: config.crossfadeDuration || 1500, // 1.5 seconds
      audioPath: config.audioPath || 'audio/ambient/'
    };
    
    // Audio buffers storage: Map<soundId, AudioBuffer>
    this.audioBuffers = new Map();
    
    // Currently playing sounds: Map<soundId, {source, gainNode, startTime}>
    this.activeSounds = new Map();
    
    // Track current ambient track
    this.currentAmbientTrack = null;
    
    // Mute state (stored in memory, not localStorage per requirements)
    this.muted = false;
    
    // Crossfade animation frame ID for cleanup
    this.crossfadeAnimationId = null;
    
    // Track if audio is ready to play
    this.audioReady = false;
    
    // Queue for pending sounds (played when audio unlocks)
    this.pendingSounds = [];
    
    // Subscribe to EventBus events
    this.setupEventListeners();
    
    // Pre-fetch ambient audio files
    this.prefetchAmbientAudio();
  }

  /**
   * Setup EventBus event listeners
   */
  setupEventListeners() {
    // Listen for audio unlock after user gesture
    this.eventBus.on('audio:unlocked', () => {
      this.audioReady = true;
      console.log('[Audio] AmbientSoundManager ready');
      
      // Play any pending sounds
      this.playPendingSounds();
    });
    
    // Listen for sound toggle from UI
    this.eventBus.on('sound:toggle', () => {
      this.toggleMute();
    });
    
    // Listen for ambient crossfade requests from SceneStateMachine
    this.eventBus.on('ambient:crossfade', (data) => {
      this.crossfade(data.from, data.to, data.duration);
    });
    
    // Listen for role transitions - stop all audio
    this.eventBus.on('game:complete', () => {
      this.stopAll();
    });
    
    this.eventBus.on('role:selected', () => {
      this.stopAll();
      this.currentAmbientTrack = null;
    });
    
    // Handle page visibility changes - mute/unmute on hide/show
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Page is hidden - mute ambient sound
        if (!this.muted) {
          this.toggleMute();
        }
      } else {
        // Page is visible - unmute ambient sound
        if (this.muted) {
          this.toggleMute();
        }
      }
    });
  }

  /**
   * Play any sounds that were queued while audio was locked
   */
  async playPendingSounds() {
    if (this.pendingSounds.length === 0) {
      return;
    }
    
    console.log(`[Audio] Playing ${this.pendingSounds.length} pending ambient sounds`);
    
    for (const pending of this.pendingSounds) {
      if (pending.type === 'fadeIn') {
        await this.fadeIn(pending.filename, pending.duration);
      } else if (pending.type === 'crossfade') {
        await this.crossfade(pending.from, pending.to, pending.duration);
      }
    }
    
    this.pendingSounds = [];
  }

  /**
   * Pre-fetch and decode all ambient audio files
   */
  async prefetchAmbientAudio() {
    const ambientFiles = [
      '149966__nenadsimic__muffled-distant-explosion.wav',
      '161120__fight2flyphoto__a6m-zero-chasing-p-51d-mustang.wav',
      '369483__alcappuccino__small-aircraft-katana-dv20-inside.wav',
      '425268__77pacer__airplanetank-engine-sound.wav',
      '578524__samsterbirdies__calm-ocean-waves.flac',
      '656124__itsthegoodstuff__nature-ambiance.wav'
    ];

    console.log('[Audio] Pre-fetching ambient audio files...');
    
    for (const filename of ambientFiles) {
      try {
        await this.loadAudioFile(filename);
      } catch (error) {
        console.warn(`[Audio] Failed to pre-fetch ${filename}:`, error.message);
      }
    }
    
    console.log(`[Audio] Pre-fetched ${this.audioBuffers.size}/${ambientFiles.length} ambient files`);
  }

  /**
   * Load and decode an audio file
   * @param {string} filename - Audio filename
   * @returns {Promise<AudioBuffer>}
   */
  async loadAudioFile(filename) {
    // Check if already loaded
    if (this.audioBuffers.has(filename)) {
      return this.audioBuffers.get(filename);
    }

    const url = `${this.config.audioPath}${filename}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      this.audioBuffers.set(filename, audioBuffer);
      console.log(`[Audio] Loaded: ${filename}`);
      
      return audioBuffer;
    } catch (error) {
      console.warn(`[Audio] Failed to load ${url}:`, error.message);
      this.eventBus.emit('sound:error', { soundId: filename, error: error.message });
      throw error;
    }
  }

  /**
   * Play a sound with looping
   * @param {string} filename - Audio filename to play
   * @param {number} volume - Volume level 0.0-1.0 (default: config.defaultVolume)
   */
  async playSound(filename, volume = null) {
    if (!filename) {
      console.error('[Audio] AmbientSoundManager.playSound: filename is required');
      return;
    }

    // Check AudioContext state
    if (this.audioContext.state === 'suspended') {
      console.log('[Audio] AudioContext suspended, resuming...');
      try {
        await this.audioContext.resume();
        this.eventBus.emit('audio:unlocked');
      } catch (error) {
        console.error('[Audio] Failed to resume AudioContext:', error);
        return;
      }
    }

    // Wait for audio to be ready
    if (!this.audioReady) {
      console.log('[Audio] Waiting for user gesture to unlock audio...');
      return;
    }

    const targetVolume = volume !== null ? volume : this.config.defaultVolume;
    
    try {
      // Load audio buffer if not already loaded
      const audioBuffer = await this.loadAudioFile(filename);
      
      // Create audio source
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = true;
      
      // Create gain node for volume control
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = this.muted ? 0 : targetVolume;
      
      // Connect: source -> gain -> destination
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Start playback
      source.start(0);
      
      // Store as active sound
      this.activeSounds.set(filename, {
        source,
        gainNode,
        volume: targetVolume,
        startTime: this.audioContext.currentTime
      });
      
      // Emit event
      this.eventBus.emit('sound:playing', { soundId: filename, volume: targetVolume });
      
      console.log(`[Audio] Playing: ${filename}`);
    } catch (error) {
      console.error(`[Audio] Failed to play sound "${filename}":`, error);
      this.eventBus.emit('sound:error', { soundId: filename, error: error.message });
    }
  }

  /**
   * Stop a sound
   * @param {string} filename - Filename of sound to stop
   */
  stopSound(filename) {
    const activeSound = this.activeSounds.get(filename);
    
    if (!activeSound) {
      return; // Sound not playing
    }
    
    const { source, gainNode } = activeSound;
    
    try {
      // Stop the source
      source.stop();
      
      // Disconnect nodes
      source.disconnect();
      gainNode.disconnect();
      
      // Remove from active sounds
      this.activeSounds.delete(filename);
      
      this.eventBus.emit('sound:stopped', { soundId: filename });
      console.log(`[Audio] Stopped: ${filename}`);
    } catch (error) {
      console.warn(`[Audio] Error stopping sound "${filename}":`, error.message);
    }
  }

  /**
   * Fade out a sound over duration
   * @param {string} filename - Filename of sound to fade out
   * @param {number} duration - Fade duration in milliseconds
   */
  fadeOut(filename, duration = 1500) {
    const activeSound = this.activeSounds.get(filename);
    
    if (!activeSound) {
      return;
    }
    
    const { source, gainNode, volume } = activeSound;
    const currentTime = this.audioContext.currentTime;
    const endTime = currentTime + (duration / 1000);
    
    // Schedule fade out
    gainNode.gain.setValueAtTime(this.muted ? 0 : volume, currentTime);
    gainNode.gain.linearRampToValueAtTime(0, endTime);
    
    // Stop and cleanup after fade completes
    setTimeout(() => {
      this.stopSound(filename);
    }, duration);
    
    console.log(`[Audio] Fading out: ${filename} over ${duration}ms`);
  }

  /**
   * Fade in a sound over duration
   * @param {string} filename - Filename of sound to fade in
   * @param {number} duration - Fade duration in milliseconds
   */
  async fadeIn(filename, duration = 1500) {
    if (!filename) {
      return;
    }

    // Check AudioContext state
    if (this.audioContext.state === 'suspended') {
      console.log('[Audio] AudioContext suspended, resuming...');
      try {
        await this.audioContext.resume();
        this.eventBus.emit('audio:unlocked');
      } catch (error) {
        console.error('[Audio] Failed to resume AudioContext:', error);
        return;
      }
    }

    // If audio not ready, queue the sound
    if (!this.audioReady) {
      console.log(`[Audio] Queueing fadeIn: ${filename} (audio not unlocked yet)`);
      this.pendingSounds.push({ type: 'fadeIn', filename, duration });
      return;
    }

    try {
      // Load audio buffer if not already loaded
      const audioBuffer = await this.loadAudioFile(filename);
      
      // Create audio source
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = true;
      
      // Create gain node for volume control
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = 0; // Start at 0
      
      // Connect: source -> gain -> destination
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Start playback
      const currentTime = this.audioContext.currentTime;
      source.start(0);
      
      // Schedule fade in
      const targetVolume = this.muted ? 0 : this.config.defaultVolume;
      const endTime = currentTime + (duration / 1000);
      gainNode.gain.linearRampToValueAtTime(targetVolume, endTime);
      
      // Store as active sound
      this.activeSounds.set(filename, {
        source,
        gainNode,
        volume: this.config.defaultVolume,
        startTime: currentTime
      });
      
      // Emit event
      this.eventBus.emit('sound:playing', { soundId: filename, volume: this.config.defaultVolume });
      
      console.log(`[Audio] Fading in: ${filename} over ${duration}ms`);
    } catch (error) {
      console.error(`[Audio] Failed to fade in sound "${filename}":`, error);
      this.eventBus.emit('sound:error', { soundId: filename, error: error.message });
    }
  }

  /**
   * Crossfade from one sound to another
   * @param {string} fromFilename - Sound to fade out (null if none)
   * @param {string} toFilename - Sound to fade in
   * @param {number} duration - Crossfade duration in milliseconds (default: 1500ms)
   */
  async crossfade(fromFilename, toFilename, duration = null) {
    const crossfadeDuration = duration !== null ? duration : this.config.crossfadeDuration;
    
    // If audio not ready, queue the crossfade
    if (!this.audioReady) {
      console.log(`[Audio] Queueing crossfade: ${fromFilename} -> ${toFilename} (audio not unlocked yet)`);
      this.pendingSounds.push({ type: 'crossfade', from: fromFilename, to: toFilename, duration: crossfadeDuration });
      return;
    }
    
    // If no fromSound, just fade in the new sound
    if (!fromFilename || !this.activeSounds.has(fromFilename)) {
      await this.fadeIn(toFilename, crossfadeDuration);
      return;
    }
    
    // If same sound, do nothing
    if (fromFilename === toFilename) {
      return;
    }
    
    console.log(`[Audio] Crossfading: ${fromFilename} -> ${toFilename}`);
    
    // Start fade out of old sound
    this.fadeOut(fromFilename, crossfadeDuration);
    
    // Start fade in of new sound
    await this.fadeIn(toFilename, crossfadeDuration);
  }

  /**
   * Toggle mute state
   */
  toggleMute() {
    this.muted = !this.muted;
    
    // Update volume for all active sounds
    this.activeSounds.forEach((soundData) => {
      const { gainNode, volume } = soundData;
      const currentTime = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(this.muted ? 0 : volume, currentTime);
    });
    
    // Emit mute state change (for UI updates)
    this.eventBus.emit('sound:muted', { muted: this.muted });
    console.log(`[Audio] Ambient sound ${this.muted ? 'muted' : 'unmuted'}`);
  }

  /**
   * Check if audio is muted
   * @returns {boolean} True if muted
   */
  isMuted() {
    return this.muted;
  }

  /**
   * Stop all sounds
   */
  stopAll() {
    const filenames = Array.from(this.activeSounds.keys());
    filenames.forEach(filename => this.stopSound(filename));
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
    this.stopAll();
    
    // Clear all maps
    this.activeSounds.clear();
    this.audioBuffers.clear();
  }
}

// ES6 module export - no global variables
export default AmbientSoundManager;
