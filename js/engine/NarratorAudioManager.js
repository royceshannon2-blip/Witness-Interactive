/**
 * NarratorAudioManager - Narrator Voice Playback System with Web Audio API
 * 
 * Manages narrator voice audio playback for scenes with narration.
 * Implements sequential audio queue to prevent overlapping narration and radio clips.
 * 
 * Features:
 * - Web Audio API (AudioContext) for playback
 * - Sequential audio queue (narrator first, then radio clips in order)
 * - Radio clip filtering with bandpass filter
 * - Respects global mute state
 * - EventBus integration for scene transitions
 * - Graceful handling of missing audio files
 * 
 * Architecture: Engine logic only, zero content strings
 */

class NarratorAudioManager {
  constructor(eventBus, audioContext, config = {}) {
    this.eventBus = eventBus;
    this.audioContext = audioContext;
    
    // Configuration with defaults
    this.config = {
      narratorVolume: config.narratorVolume || 1.0, // 100% volume for narrator
      radioVolume: config.radioVolume || 0.8, // 80% volume for radio clips
      audioPath: config.audioPath || 'audio/narration/'
    };
    
    // Audio buffers storage: Map<filename, AudioBuffer>
    this.audioBuffers = new Map();
    
    // Currently playing source and gain node
    this.currentSource = null;
    this.currentGainNode = null;
    
    // Audio queue for sequential playback
    this.audioQueue = [];
    this.isPlaying = false;
    
    // Mute state
    this.muted = false;
    this.globalMuted = false;
    
    // Track if audio is ready to play
    this.audioReady = false;
    
    // Queue for pending scene audio (played when audio unlocks)
    this.pendingSceneAudio = null;
    
    // Current scene ID for tracking
    this.currentSceneId = null;
    
    // Subscribe to EventBus events
    this.setupEventListeners();
  }

  /**
   * Setup EventBus event listeners
   */
  setupEventListeners() {
    // Listen for audio unlock after user gesture
    this.eventBus.on('audio:unlocked', () => {
      this.audioReady = true;
      console.log('[Audio] NarratorAudioManager ready');
      
      // Play any pending scene audio
      if (this.pendingSceneAudio) {
        console.log('[Audio] Playing pending scene audio');
        this.playSceneAudio(this.pendingSceneAudio);
        this.pendingSceneAudio = null;
      }
    });
    
    // Listen for scene rendering to start narration
    this.eventBus.on('scene:rendered', (data) => {
      if (data && data.scene) {
        this.playSceneAudio(data.scene);
      }
    });
    
    // Listen for scene transitions to stop narration
    this.eventBus.on('scene:transition', () => {
      this.stopAll();
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
   * Play scene audio (narrator + radio clips in sequence)
   * @param {Object} scene - Scene object with narratorAudio and radioClips
   */
  async playSceneAudio(scene) {
    if (!scene) {
      return;
    }

    // If audio not ready, queue the scene audio
    if (!this.audioReady) {
      console.log(`[Audio] Queueing scene audio for ${scene.id} (audio not unlocked yet)`);
      this.pendingSceneAudio = scene;
      return;
    }

    // Stop anything currently playing
    this.stopAll();
    
    this.currentSceneId = scene.id;
    
    // Build the queue: narrator first, then radio clips in order
    this.audioQueue = [];
    
    if (scene.narratorAudio) {
      this.audioQueue.push({ 
        src: scene.narratorAudio, 
        type: 'narrator' 
      });
    }
    
    if (scene.radioClips && scene.radioClips.length > 0) {
      // Sort radio clips by triggerAfterMs so they play in intended order
      const sorted = [...scene.radioClips].sort((a, b) => a.triggerAfterMs - b.triggerAfterMs);
      sorted.forEach(clip => this.audioQueue.push({ 
        src: clip.src, 
        type: 'radio' 
      }));
    }
    
    // If queue is empty, nothing to play
    if (this.audioQueue.length === 0) {
      return;
    }
    
    console.log(`[Audio] Playing scene audio for ${scene.id}: ${this.audioQueue.length} items in queue`);
    
    // Play each item in the queue sequentially
    try {
      for (const item of this.audioQueue) {
        await this.playAudioFile(item.src, item.type);
      }
      
      // All audio complete
      this.eventBus.emit('narrator:complete', { sceneId: scene.id });
      console.log(`[Audio] Scene audio complete for ${scene.id}`);
    } catch (error) {
      console.error(`[Audio] Error playing scene audio:`, error);
    }
  }

  /**
   * Play a single audio file and wait for it to complete
   * @param {string} src - Audio file path
   * @param {string} type - 'narrator' or 'radio'
   * @returns {Promise} Resolves when audio finishes playing
   */
  playAudioFile(src, type) {
    return new Promise(async (resolve, reject) => {
      if (!src) {
        resolve();
        return;
      }

      try {
        // Load audio buffer
        const audioBuffer = await this.loadAudioFile(src);
        
        // Create audio source
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = false; // One-shot playback
        
        // Create gain node for volume control
        const gainNode = this.audioContext.createGain();
        const volume = type === 'radio' ? this.config.radioVolume : this.config.narratorVolume;
        gainNode.gain.value = this.getEffectiveVolume(volume);
        
        // Apply radio filter if this is a radio clip
        if (type === 'radio') {
          // Create bandpass filter to simulate radio transmission
          const filter = this.audioContext.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.value = 1800; // Center frequency in Hz
          filter.Q.value = 0.8; // Quality factor
          
          // Connect: source -> filter -> gain -> destination
          source.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(this.audioContext.destination);
        } else {
          // Connect: source -> gain -> destination
          source.connect(gainNode);
          gainNode.connect(this.audioContext.destination);
        }
        
        // Store current source and gain node
        this.currentSource = source;
        this.currentGainNode = gainNode;
        this.isPlaying = true;
        
        // Set up completion handler
        source.onended = () => {
          this.isPlaying = false;
          this.currentSource = null;
          this.currentGainNode = null;
          
          // Disconnect nodes
          try {
            source.disconnect();
            gainNode.disconnect();
          } catch (e) {
            // Already disconnected
          }
          
          console.log(`[Audio] Finished playing: ${src}`);
          resolve();
        };
        
        // Start playback
        source.start(0);
        
        const typeLabel = type === 'radio' ? 'Radio clip' : 'Narrator';
        console.log(`[Audio] ${typeLabel} playing: ${src}`);
        this.eventBus.emit('narrator:playing', { src, type });
        
      } catch (error) {
        console.error(`[Audio] Failed to play ${src}:`, error);
        this.eventBus.emit('narrator:error', { src, error: error.message });
        resolve(); // Continue to next item in queue even if this one fails
      }
    });
  }

  /**
   * Load and decode an audio file
   * @param {string} src - Audio file path
   * @returns {Promise<AudioBuffer>}
   */
  async loadAudioFile(src) {
    // Check if already loaded
    if (this.audioBuffers.has(src)) {
      return this.audioBuffers.get(src);
    }

    try {
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      this.audioBuffers.set(src, audioBuffer);
      console.log(`[Audio] Loaded: ${src}`);
      
      return audioBuffer;
    } catch (error) {
      console.warn(`[Audio] Failed to load ${src}:`, error.message);
      throw error;
    }
  }

  /**
   * Stop all narration and clear queue
   */
  stopAll() {
    // Stop current playback
    if (this.currentSource) {
      try {
        this.currentSource.stop();
        this.currentSource.disconnect();
      } catch (e) {
        // Already stopped
      }
      this.currentSource = null;
    }
    
    if (this.currentGainNode) {
      try {
        this.currentGainNode.disconnect();
      } catch (e) {
        // Already disconnected
      }
      this.currentGainNode = null;
    }
    
    // Clear queue
    this.audioQueue = [];
    this.isPlaying = false;
    this.currentSceneId = null;
    
    console.log('[Audio] Stopped all narrator audio');
  }

  /**
   * Toggle narrator mute
   */
  toggleNarrator() {
    this.muted = !this.muted;
    this.updateVolume();
    
    // Emit state change
    this.eventBus.emit('narrator:muted', { muted: this.muted });
    console.log(`[Audio] Narrator ${this.muted ? 'muted' : 'unmuted'}`);
  }

  /**
   * Update volume for current audio
   */
  updateVolume() {
    if (this.currentGainNode) {
      const volume = this.currentGainNode.gain.value > 0.9 ? 
        this.config.narratorVolume : this.config.radioVolume;
      this.currentGainNode.gain.value = this.getEffectiveVolume(volume);
    }
  }

  /**
   * Get effective volume based on mute states
   * @param {number} baseVolume - Base volume level
   * @returns {number} Volume level 0.0-1.0
   */
  getEffectiveVolume(baseVolume) {
    if (this.globalMuted || this.muted) {
      return 0;
    }
    return baseVolume;
  }

  /**
   * Check if narrator is muted
   * @returns {boolean} True if muted
   */
  isMuted() {
    return this.muted;
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
    this.stopAll();
    this.audioBuffers.clear();
  }
}

// ES6 module export - no global variables
export default NarratorAudioManager;
