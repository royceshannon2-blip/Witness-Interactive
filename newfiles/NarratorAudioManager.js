/**
 * NarratorAudioManager - Narrator Voice Playback System
 *
 * Session token architecture:
 * Every async operation captures `this.sessionToken` at birth.
 * `_hardStop()` increments the token, invalidating ALL in-flight operations.
 * This permanently prevents audio overlap across scene transitions.
 *
 * Architecture: Engine logic only, zero content strings.
 */

class NarratorAudioManager {
  constructor(eventBus, audioContext, config = {}) {
    this.eventBus    = eventBus;
    this.audioContext = audioContext;

    this.config = {
      narratorVolume : config.narratorVolume ?? 1.0,
      radioVolume    : config.radioVolume    ?? 0.8,
      audioPath      : config.audioPath      || 'audio/narration/'
    };

    // Cached decoded buffers
    this.audioBuffers = new Map();

    // Currently playing narrator source (radio clips are fire-and-forget)
    this.currentSource   = null;
    this.currentGainNode = null;

    // Mute states
    this.muted       = false;
    this.globalMuted = false;

    // Audio must be unlocked by a user gesture before playing
    this.audioReady       = false;
    this.pendingSceneAudio = null;

    // Session token — incremented on every hard stop.
    // Async ops capture their token; if it changes they self-abort.
    this.sessionToken = 0;

    // Timer handle for the 300 ms start-delay (cancelled on hard stop)
    this.pendingStartTimer = null;

    // Handles for scheduled radio-clip timeouts
    this.radioTimers = [];

    this._setupEventListeners();
  }

  // ─── SETUP ─────────────────────────────────────────────────────────────────

  _setupEventListeners() {
    this.eventBus.on('audio:unlocked', () => {
      this.audioReady = true;
      if (this.pendingSceneAudio) {
        const pending = this.pendingSceneAudio;
        this.pendingSceneAudio = null;
        this._scheduleScene(pending);
      }
    });

    // scene:transition hard-stops everything first, then schedules new audio
    this.eventBus.on('scene:transition', (data) => {
      this._hardStop();
      if (data?.scene) {
        this._scheduleScene(data.scene);
      }
    });

    this.eventBus.on('sound:muted', (data) => {
      this.globalMuted = data.muted;
      this._updateVolume();
    });

    this.eventBus.on('narrator:toggle', () => {
      this.muted = !this.muted;
      this._updateVolume();
      this.eventBus.emit('narrator:muted', { muted: this.muted });
    });
  }

  // ─── HARD STOP ─────────────────────────────────────────────────────────────

  /**
   * Cancel everything immediately and invalidate all in-flight async work.
   * Called synchronously on every scene:transition.
   */
  _hardStop() {
    // Invalidate all in-flight async operations
    this.sessionToken++;

    // Cancel the pending 300 ms start delay
    if (this.pendingStartTimer !== null) {
      clearTimeout(this.pendingStartTimer);
      this.pendingStartTimer = null;
    }

    // Cancel all scheduled radio clip timers
    for (const id of this.radioTimers) clearTimeout(id);
    this.radioTimers = [];

    // Stop the currently playing narrator track
    if (this.currentSource) {
      try { this.currentSource.stop(); }    catch (_) {}
      try { this.currentSource.disconnect(); } catch (_) {}
      this.currentSource = null;
    }
    if (this.currentGainNode) {
      try { this.currentGainNode.disconnect(); } catch (_) {}
      this.currentGainNode = null;
    }
  }

  // ─── SCHEDULE / PLAY ────────────────────────────────────────────────────────

  /**
   * Schedule playback 300 ms after the scene transition.
   * The token guard ensures only the most-recent call ever fires.
   */
  _scheduleScene(scene) {
    if (!this.audioReady) {
      this.pendingSceneAudio = scene;
      return;
    }

    const token = this.sessionToken;

    this.pendingStartTimer = setTimeout(() => {
      this.pendingStartTimer = null;
      if (this.sessionToken !== token) return; // scene changed again
      this._playScene(scene, token);
    }, 300);
  }

  async _playScene(scene, token) {
    if (!scene?.narratorAudio && !scene?.radioClips?.length) return;

    // Play narrator track
    if (scene.narratorAudio) {
      await this._playFile(scene.narratorAudio, 'narrator', token);
      if (this.sessionToken !== token) return;
      this.eventBus.emit('narrator:complete', { sceneId: scene.id });
    }

    // Schedule radio clips (fire-and-forget, token-guarded)
    if (scene.radioClips?.length) {
      for (const clip of scene.radioClips) {
        const delay = clip.triggerAfterMs || 0;
        const id = setTimeout(() => {
          if (this.sessionToken !== token) return;
          this._playFile(clip.src, 'radio', token).catch(() => {});
        }, delay);
        this.radioTimers.push(id);
      }
    }
  }

  /**
   * Decode and play one audio file.
   * Checks the session token at every async boundary.
   */
  _playFile(src, type, token) {
    return new Promise(async (resolve) => {
      if (!src || this.sessionToken !== token) { resolve(); return; }

      try {
        const buffer = await this._loadFile(src);
        if (this.sessionToken !== token) { resolve(); return; }

        const source   = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        source.buffer = buffer;
        source.loop   = false;

        const baseVol  = type === 'radio' ? this.config.radioVolume : this.config.narratorVolume;
        gainNode.gain.value = this._effectiveVolume(baseVol);

        if (type === 'radio') {
          const filter       = this.audioContext.createBiquadFilter();
          filter.type        = 'bandpass';
          filter.frequency.value = 1800;
          filter.Q.value     = 0.8;
          source.connect(filter);
          filter.connect(gainNode);
        } else {
          source.connect(gainNode);
          // Only narrator tracks are tracked for hard-stop
          this.currentSource   = source;
          this.currentGainNode = gainNode;
        }
        gainNode.connect(this.audioContext.destination);

        source.onended = () => {
          if (type === 'narrator') {
            this.currentSource   = null;
            this.currentGainNode = null;
          }
          try { source.disconnect(); }   catch (_) {}
          try { gainNode.disconnect(); } catch (_) {}
          resolve();
        };

        source.start(0);
        this.eventBus.emit('narrator:playing', { src, type });

      } catch (err) {
        console.warn(`[NarratorAudio] Failed to play ${src}:`, err.message);
        this.eventBus.emit('narrator:error', { src, error: err.message });
        resolve();
      }
    });
  }

  async _loadFile(src) {
    if (this.audioBuffers.has(src)) return this.audioBuffers.get(src);
    const res = await fetch(src);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arr    = await res.arrayBuffer();
    const buffer = await this.audioContext.decodeAudioData(arr);
    this.audioBuffers.set(src, buffer);
    return buffer;
  }

  // ─── VOLUME ─────────────────────────────────────────────────────────────────

  _effectiveVolume(base) {
    return (this.globalMuted || this.muted) ? 0 : base;
  }

  _updateVolume() {
    if (this.currentGainNode) {
      // Narrator is always at narratorVolume
      this.currentGainNode.gain.value = this._effectiveVolume(this.config.narratorVolume);
    }
  }

  // ─── PUBLIC API ─────────────────────────────────────────────────────────────

  isMuted()          { return this.muted; }
  isNarratorPlaying(){ return !!this.currentSource; }

  stopAll() { this._hardStop(); }

  destroy() {
    this._hardStop();
    this.audioBuffers.clear();
  }
}

export default NarratorAudioManager;
