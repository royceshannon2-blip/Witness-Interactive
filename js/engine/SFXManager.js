/**
 * SFXManager - One-shot sound effects tied to scene events
 * 
 * Listens for scene:transition, reads scene.soundEffects array,
 * and plays each file after its triggerAfterMs delay.
 * All timers are cancelled on the next scene transition.
 * Fails silently if a file is missing or audio is not yet unlocked.
 * 
 * Architecture: Engine logic only, zero content strings.
 * EventBus integration for loose coupling.
 */

class SFXManager {
  constructor(eventBus, audioContext, config = {}) {
    this.eventBus     = eventBus;
    this.audioContext = audioContext;
    this.audioPath    = config.audioPath || 'audio/ambient/';
    this.volume       = config.volume ?? 0.6;
    this.muted        = false;
    this.audioReady   = false;
    this.timers       = [];
    this.bufferCache  = new Map();
    
    this._setupListeners();
  }
  
  /**
   * Setup EventBus event listeners
   */
  _setupListeners() {
    this.eventBus.on('audio:unlocked', () => {
      this.audioReady = true;
    });
    
    this.eventBus.on('scene:transition', (data) => {
      this._cancelAll();
      if (data?.scene?.soundEffects?.length) {
        this._scheduleEffects(data.scene.soundEffects);
      }
    });
    
    this.eventBus.on('role:selected', () => { this._cancelAll(); });
    this.eventBus.on('game:complete',  () => { this._cancelAll(); });
    
    this.eventBus.on('sound:muted', (data) => {
      this.muted = data.muted;
    });
  }
  
  /**
   * Cancel all scheduled sound effects
   */
  _cancelAll() {
    for (const id of this.timers) clearTimeout(id);
    this.timers = [];
  }
  
  /**
   * Schedule sound effects to play at specified delays
   * @param {Array} effects - Array of {file, triggerAfterMs} objects
   */
  _scheduleEffects(effects) {
    for (const effect of effects) {
      if (!effect.file || typeof effect.triggerAfterMs !== 'number') continue;
      const id = setTimeout(() => {
        this._play(effect.file);
      }, effect.triggerAfterMs);
      this.timers.push(id);
    }
  }
  
  /**
   * Play a one-shot sound effect
   * @param {string} filename - Audio filename to play
   */
  async _play(filename) {
    if (this.muted || !this.audioReady || !this.audioContext) return;
    
    try {
      let buffer = this.bufferCache.get(filename);
      if (!buffer) {
        const response = await fetch(this.audioPath + filename);
        if (!response.ok) return; // silent fail on 404
        const arrayBuffer = await response.arrayBuffer();
        buffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.bufferCache.set(filename, buffer);
      }
      
      const source   = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      source.buffer  = buffer;
      source.loop    = false;
      gainNode.gain.value = this.volume;
      
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      source.start(0);
      
      this.eventBus.emit('sfx:playing', { filename });
    } catch (_) {
      // silent fail — missing files, decode errors, context issues
    }
  }
}

export default SFXManager;
