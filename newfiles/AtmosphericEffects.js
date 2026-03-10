/**
 * AtmosphericEffects - DOM-Based Particle Effects System
 * 
 * Clean border glow effects for immersive but non-distracting atmosphere.
 * Heavy particle effects (smoke, fire, explosion) replaced with border glows
 * for scenes 2, 3, 4. Aftermath, dawn, shake, and ash retained for scene 5.
 * 
 * Supported Effects:
 * - borderGlow: Clean inset box-shadow pulse around screen edges
 * - shake: Screen shake with white flash overlay
 * - aftermath: Desaturation overlay + 8 ash particles
 * - dawn: Soft gradient that fades in over 4s
 * - ocean: Continuous gentle sway of entire effects layer
 * - ash: 10 falling particles with zigzag motion
 * 
 * Timing Rules:
 * - Most effects trigger after typewriter:complete
 * - Shake triggers immediately on scene load (timed choice scenes)
 * - Effects fade out over 800ms on scene:transition
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 7.1
 */

class AtmosphericEffects {
  /**
   * Create AtmosphericEffects manager
   * @param {EventBus} eventBus - Event bus for component communication
   * @param {Object} config - Configuration options
   * @param {boolean} config.respectMotionPrefs - Check prefers-reduced-motion (default: true)
   */
  constructor(eventBus, config = {}) {
    if (!eventBus) {
      throw new Error('AtmosphericEffects requires an EventBus instance');
    }

    this.eventBus = eventBus;
    this.config = {
      respectMotionPrefs: config.respectMotionPrefs !== false,
      defaultDuration: config.defaultDuration || 2000
    };

    // Track active effects
    this.activeEffects = new Set();
    this.activeParticles = [];

    // Track current scene ID for timing decisions
    this.currentSceneId = null;

    // Check if user prefers reduced motion
    this.prefersReducedMotion = this.config.respectMotionPrefs &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize effects layer
    this.initEffectsLayer();

    // Inject required keyframes
    this.injectKeyframes();

    // Subscribe to events
    this.setupEventListeners();
  }

  /**
   * Inject CSS keyframes required for effects
   * @private
   */
  injectKeyframes() {
    if (document.getElementById('atmospheric-keyframes')) return;

    const style = document.createElement('style');
    style.id = 'atmospheric-keyframes';
    style.textContent = `
      @keyframes border-glow-pulse {
        0%   { opacity: 0; }
        20%  { opacity: 1; }
        80%  { opacity: 1; }
        100% { opacity: 0; }
      }
      @keyframes screen-shake {
        0%  { transform: translate(0, 0); }
        15% { transform: translate(-6px, 4px); }
        30% { transform: translate(5px, -3px); }
        45% { transform: translate(-4px, 5px); }
        60% { transform: translate(4px, -2px); }
        75% { transform: translate(-3px, 3px); }
        90% { transform: translate(2px, -1px); }
        100%{ transform: translate(0, 0); }
      }
      @keyframes shake-flash {
        0%   { opacity: 0.6; }
        100% { opacity: 0; }
      }
      @keyframes aftermath-fade-in {
        0%   { opacity: 0; }
        100% { opacity: 1; }
      }
      @keyframes dawn-fade-in {
        0%   { opacity: 0; }
        100% { opacity: 1; }
      }
      @keyframes ash-fall {
        0%   { transform: translateY(0) translateX(0); opacity: 0.6; }
        100% { transform: translateY(110vh) translateX(var(--drift)); opacity: 0; }
      }
      @keyframes ash-zigzag {
        0%   { transform: translateY(0) translateX(0); opacity: 0.6; }
        25%  { transform: translateY(25vh) translateX(calc(var(--drift) * 0.5)); }
        50%  { transform: translateY(50vh) translateX(0); }
        75%  { transform: translateY(75vh) translateX(calc(var(--drift) * -0.5)); }
        100% { transform: translateY(110vh) translateX(var(--drift)); opacity: 0; }
      }
      @keyframes ocean-sway {
        0%   { transform: translateY(0px); }
        50%  { transform: translateY(6px); }
        100% { transform: translateY(0px); }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Setup event listeners
   * @private
   */
  setupEventListeners() {
    // Scene transition - fade out all effects, apply immediate effects
    this.eventBus.on('scene:transition', (data) => {
      this.fadeOutAllEffects();
      if (data && data.scene) {
        this.currentSceneId = data.scene.id;
        this.applyImmediateEffects(data.scene);
      }
    });

    // Typewriter complete - apply delayed effects
    this.eventBus.on('typewriter:complete', (data) => {
      if (data && data.sceneId) {
        this.applyDelayedEffects(data.sceneId);
      }
    });
  }

  /**
   * Initialize the dedicated effects DOM layer
   * @private
   */
  initEffectsLayer() {
    this.effectsLayer = document.createElement('div');
    this.effectsLayer.id = 'effects-layer';
    this.effectsLayer.setAttribute('aria-hidden', 'true');
    this.effectsLayer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 50;
      overflow: hidden;
    `;
    document.body.appendChild(this.effectsLayer);
  }

  /**
   * Apply immediate effects (on scene load, before typewriter)
   * Only shake — border glows and atmosphere are always delayed
   * @private
   */
  applyImmediateEffects(scene) {
    if (!scene || !scene.id) return;

    const sceneId = scene.id;

    // Japanese Aviator
    if (sceneId === 'ja-scene-04') {
      this.createShake();
    }

    // American Sailor
    else if (sceneId === 'as-scene-01') {
      this.createOcean();
    } else if (sceneId === 'as-scene-02') {
      this.createShake();
      this.createOcean();
    } else if (sceneId === 'as-scene-03') {
      this.createShake();
    }

    // American Civilian
    else if (sceneId === 'ac-scene-02') {
      this.createShake();
    }
  }

  /**
   * Apply delayed effects (after typewriter completes)
   * Border glows replace smoke/fire/explosion for scenes 2-4
   * @private
   */
  applyDelayedEffects(sceneId) {
    if (!sceneId) return;

    // Japanese Aviator
    if (sceneId === 'ja-scene-01') {
      this.createDawn();
    } else if (sceneId === 'ja-scene-02') {
      // Tense approach over ocean — cool blue-white border
      this.createBorderGlow('rgba(200, 220, 255, 0.5)', 5000);
    } else if (sceneId === 'ja-scene-03') {
      // Pearl Harbor burning — deep orange-red border
      this.createBorderGlow('rgba(255, 80, 0, 0.65)', 6000);
    } else if (sceneId === 'ja-scene-04') {
      // AA fire and chaos — red border after shake
      this.createBorderGlow('rgba(220, 30, 0, 0.55)', 5000);
    } else if (sceneId === 'ja-scene-05') {
      this.createAftermath();
      this.createAsh();
    }

    // American Sailor
    else if (sceneId === 'as-scene-02') {
      this.createBorderGlow('rgba(255, 120, 0, 0.5)', 5000);
    } else if (sceneId === 'as-scene-03') {
      this.createBorderGlow('rgba(255, 60, 0, 0.65)', 6000);
    } else if (sceneId === 'as-scene-04') {
      this.createBorderGlow('rgba(200, 40, 0, 0.55)', 5000);
    } else if (sceneId === 'as-scene-05') {
      this.createAftermath();
      this.createAsh();
    }

    // American Civilian
    else if (sceneId === 'ac-scene-01') {
      this.createDawn();
    } else if (sceneId === 'ac-scene-03') {
      this.createBorderGlow('rgba(255, 100, 0, 0.6)', 5000);
    } else if (sceneId === 'ac-scene-04') {
      this.createBorderGlow('rgba(180, 30, 0, 0.5)', 5000);
      this.createAsh();
    } else if (sceneId === 'ac-scene-05') {
      this.createAftermath();
    }
  }

  /**
   * Create a clean border glow — inset box-shadow pulse around screen edges
   * @param {string} color - CSS color e.g. 'rgba(255, 80, 0, 0.6)'
   * @param {number} duration - Total duration in ms (default: 4000)
   */
  createBorderGlow(color, duration = 4000) {
    if (this.prefersReducedMotion) {
      this.applyStaticOverlay('borderGlow', color);
      return;
    }

    const border = document.createElement('div');
    border.className = 'effect-border-glow';
    border.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-shadow: inset 0 0 120px 30px ${color};
      opacity: 0;
      animation: border-glow-pulse ${duration}ms ease-in-out forwards;
      pointer-events: none;
    `;
    border.addEventListener('animationend', () => border.remove());
    this.effectsLayer.appendChild(border);
    this.activeParticles.push(border);
  }

  /**
   * Create shake effect - screen shake + white flash
   * @private
   */
  createShake() {
    if (this.prefersReducedMotion) return;

    document.documentElement.style.animation = 'screen-shake 800ms ease-out';

    const flash = document.createElement('div');
    flash.className = 'effect-shake-flash';
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      animation: shake-flash 150ms ease-out;
      pointer-events: none;
    `;
    flash.addEventListener('animationend', () => flash.remove());
    this.effectsLayer.appendChild(flash);

    setTimeout(() => {
      document.documentElement.style.animation = '';
    }, 800);
  }

  /**
   * Create aftermath effect - desaturation overlay + 8 ash particles
   * @private
   */
  createAftermath() {
    const overlay = document.createElement('div');
    overlay.className = 'effect-aftermath-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(100, 90, 80, 0.4);
      backdrop-filter: saturate(0.2) sepia(0.3);
      animation: aftermath-fade-in 3s ease-in forwards;
      pointer-events: none;
    `;
    this.effectsLayer.appendChild(overlay);
    this.activeParticles.push(overlay);

    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      const size = 20 + Math.random() * 30;
      const startX = Math.random() * 100;
      const duration = 15 + Math.random() * 10;
      const delay = Math.random() * 3;
      const drift = (Math.random() - 0.5) * 60;

      particle.className = 'effect-aftermath-ash';
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        left: ${startX}%;
        top: -${size}px;
        background: rgba(${140 + Math.random() * 40}, ${140 + Math.random() * 40}, ${140 + Math.random() * 40}, 0.5);
        filter: blur(${8 + Math.random() * 8}px);
        animation: ash-fall ${duration}s ${delay}s linear infinite;
        --drift: ${drift}px;
      `;
      this.effectsLayer.appendChild(particle);
      this.activeParticles.push(particle);
    }
  }

  /**
   * Create dawn effect - soft warm gradient fading in
   * @private
   */
  createDawn() {
    const gradient = document.createElement('div');
    gradient.className = 'effect-dawn-gradient';
    gradient.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        to bottom,
        rgba(255, 160, 80, 0.25) 0%,
        rgba(255, 120, 60, 0.15) 40%,
        transparent 100%
      );
      animation: dawn-fade-in 4s ease-in forwards;
      pointer-events: none;
    `;
    this.effectsLayer.appendChild(gradient);
    this.activeParticles.push(gradient);
  }

  /**
   * Create ocean effect - continuous gentle sway
   * @private
   */
  createOcean() {
    if (this.prefersReducedMotion) return;
    this.effectsLayer.style.animation = 'ocean-sway 5s ease-in-out infinite';
  }

  /**
   * Create ash effect - 10 falling particles with zigzag motion
   * @private
   */
  createAsh() {
    if (this.prefersReducedMotion) return;

    for (let i = 0; i < 10; i++) {
      const particle = document.createElement('div');
      const size = 8 + Math.random() * 12;
      const startX = Math.random() * 100;
      const duration = 15 + Math.random() * 10;
      const delay = Math.random() * 5;
      const drift = (Math.random() - 0.5) * 240;

      particle.className = 'effect-ash-particle';
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        left: ${startX}%;
        top: -${size}px;
        background: rgba(180, 180, 180, 0.6);
        animation: ash-zigzag ${duration}s ${delay}s linear infinite;
        --drift: ${drift}px;
      `;
      this.effectsLayer.appendChild(particle);
      this.activeParticles.push(particle);
    }
  }

  /**
   * Apply static overlay for reduced motion users
   * @private
   */
  applyStaticOverlay(effectName, color = null) {
    const overlay = document.createElement('div');
    overlay.className = `effect-static-${effectName}`;

    let background = color || 'rgba(100, 100, 100, 0.2)';
    if (!color) {
      switch (effectName) {
        case 'dawn':      background = 'rgba(255, 160, 80, 0.15)'; break;
        case 'aftermath': background = 'rgba(100, 90, 80, 0.3)'; break;
      }
    }

    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${background};
      pointer-events: none;
    `;
    this.effectsLayer.appendChild(overlay);
    this.activeParticles.push(overlay);
  }

  /**
   * Fade out all active effects over 800ms
   * @private
   */
  fadeOutAllEffects() {
    try {
      this.effectsLayer.style.animation = '';

      this.activeParticles.forEach(particle => {
        if (particle && particle.parentNode) {
          particle.style.transition = 'opacity 800ms ease-out';
          particle.style.opacity = '0';
          setTimeout(() => {
            try {
              if (particle.parentNode) particle.remove();
            } catch (e) {}
          }, 800);
        }
      });
    } catch (e) {
      console.warn('[Effects] fadeOutAllEffects error:', e);
      this.clearAllEffects();
    }

    this.activeParticles = [];
    this.activeEffects.clear();
  }

  /**
   * Immediately clear all effects
   */
  clearAllEffects() {
    this.effectsLayer.style.animation = '';
    this.effectsLayer.innerHTML = '';
    this.activeParticles = [];
    this.activeEffects.clear();
  }
}

// ES6 module export - no global variables
export default AtmosphericEffects;
