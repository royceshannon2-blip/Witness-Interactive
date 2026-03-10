/**
 * AtmosphericEffects - DOM-Based Particle Effects System
 * 
 * Complete rewrite with real DOM particles for precise timing and visual quality.
 * Replaces CSS pseudo-elements with actual particle divs for multi-layer effects.
 * 
 * Supported Effects:
 * - smoke: 12 rising particles with blur and drift
 * - fire: 3-layer flickering glow + 6 ember particles
 * - shake: Screen shake with white flash overlay
 * - explosion: 3-phase (flash, bloom, afterglow)
 * - aftermath: Desaturation overlay + 8 ash particles
 * - dawn: Soft gradient that fades in over 4s
 * - ocean: Continuous gentle sway of entire effects layer
 * - ash: 10 falling particles with zigzag motion
 * - rain: Continuous rain particles (future)
 * 
 * Timing Rules:
 * - Most effects trigger after typewriter:complete
 * - Shake and explosion trigger immediately on scene load (timed choice scenes)
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

    // Subscribe to events
    this.setupEventListeners();
  }

  /**
   * Setup event listeners
   * @private
   */
  setupEventListeners() {
    // Scene transition - fade out all effects
    this.eventBus.on('scene:transition', (data) => {
      this.fadeOutAllEffects();
      if (data && data.scene) {
        this.currentSceneId = data.scene.id;
        // Apply immediate effects (shake, explosion for timed choice scenes)
        this.applyImmediateEffects(data.scene);
      }
    });
    
    // Typewriter complete - apply delayed effects
    this.eventBus.on('typewriter:complete', (data) => {
      if (data && data.sceneId) {
        this.applyDelayedEffects(data.sceneId);
      }
    });
    
    // Scene impact - explosion moment (synced with audio)
    this.eventBus.on('scene:impact', () => {
      this.createExplosion();
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
   * These are for timed choice scenes where the effect IS the thing being reacted to
   * @private
   */
  applyImmediateEffects(scene) {
    if (!scene || !scene.id) return;

    const sceneId = scene.id;
    
    // Japanese Aviator immediate effects
    if (sceneId === 'ja-scene-03') {
      // Explosion at scene load, fire starts 600ms later
      this.createExplosion();
      setTimeout(() => this.createFire(), 600);
    } else if (sceneId === 'ja-scene-04') {
      // Shake at scene load
      this.createShake();
    }
    
    // American Sailor immediate effects
    else if (sceneId === 'as-scene-01') {
      // Ocean at scene load
      this.createOcean();
    } else if (sceneId === 'as-scene-02') {
      // Shake at scene load, ocean continuous
      this.createShake();
      this.createOcean();
    } else if (sceneId === 'as-scene-03') {
      // Explosion immediate, fire at 600ms
      this.createExplosion();
      setTimeout(() => this.createFire(), 600);
    }
    
    // American Civilian immediate effects
    else if (sceneId === 'ac-scene-02') {
      // Shake at scene load immediately
      this.createShake();
    }
  }

  /**
   * Apply delayed effects (after typewriter completes)
   * These are atmospheric effects that enhance the narrative
   * @private
   */
  applyDelayedEffects(sceneId) {
    if (!sceneId) return;

    // Japanese Aviator delayed effects
    if (sceneId === 'ja-scene-01') {
      this.createDawn();
    } else if (sceneId === 'ja-scene-02') {
      this.createSmoke();
    } else if (sceneId === 'ja-scene-04') {
      // Smoke after typewriter (shake was immediate)
      this.createSmoke();
    } else if (sceneId === 'ja-scene-05') {
      this.createAftermath();
      this.createAsh();
    }
    
    // American Sailor delayed effects
    else if (sceneId === 'as-scene-04') {
      this.createSmoke();
      this.createFire();
    } else if (sceneId === 'as-scene-05') {
      this.createAftermath();
      this.createAsh();
    }
    
    // American Civilian delayed effects
    else if (sceneId === 'ac-scene-01') {
      this.createDawn();
    } else if (sceneId === 'ac-scene-03') {
      this.createSmoke();
      this.createFire();
    } else if (sceneId === 'ac-scene-04') {
      this.createFire();
      this.createAsh();
    } else if (sceneId === 'ac-scene-05') {
      this.createAftermath();
    }
  }

  /**
   * Apply an atmospheric effect (legacy method for backward compatibility)
   * @param {string|string[]} effectName - Name of effect(s) to apply
   * @param {Object} options - Effect options
   */
  applyEffect(effectName, options = {}) {
    // Handle array of effects
    if (Array.isArray(effectName)) {
      effectName.forEach(effect => this.applyEffect(effect, options));
      return;
    }

    // Skip if user prefers reduced motion
    if (this.prefersReducedMotion) {
      this.applyStaticOverlay(effectName);
      return;
    }

    // Apply the specific effect
    switch (effectName) {
      case 'smoke':
        this.createSmoke();
        break;
      case 'fire':
        this.createFire();
        break;
      case 'shake':
        this.createShake();
        break;
      case 'explosion':
        this.createExplosion();
        break;
      case 'aftermath':
        this.createAftermath();
        break;
      case 'dawn':
        this.createDawn();
        break;
      case 'ocean':
        this.createOcean();
        break;
      case 'ash':
        this.createAsh();
        break;
      case 'rain':
        this.createRain();
        break;
      default:
        console.warn(`AtmosphericEffects: Unknown effect "${effectName}"`);
    }

    this.activeEffects.add(effectName);
    this.eventBus.emit('effect:applied', { effectName });
  }

  /**
   * Create smoke effect - 12 rising particles
   * @private
   */
  createSmoke() {
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      const size = 80 + Math.random() * 120;
      const startX = Math.random() * 100;
      const duration = 6 + Math.random() * 8;
      const delay = Math.random() * 3;
      const drift = (Math.random() - 0.5) * 80;
      const gray = 30 + Math.random() * 50;
      const opacity = 0.3 + Math.random() * 0.3;

      particle.className = 'effect-particle effect-smoke-particle';
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        left: ${startX}%;
        bottom: -${size}px;
        background: rgba(${gray}, ${gray}, ${gray}, ${opacity});
        filter: blur(${15 + Math.random() * 15}px);
        animation: smoke-particle-rise ${duration}s ${delay}s ease-out forwards;
        --drift: ${drift}px;
      `;

      particle.addEventListener('animationend', () => particle.remove());
      this.effectsLayer.appendChild(particle);
      this.activeParticles.push(particle);
    }
  }

  /**
   * Create fire effect - 3 glow layers + 6 embers
   * @private
   */
  createFire() {
    // Layer 1: Base glow
    const baseGlow = document.createElement('div');
    baseGlow.className = 'effect-fire-base';
    baseGlow.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 20%;
      width: 60%;
      height: 40%;
      background: rgba(255, 80, 0, 0.25);
      border-radius: 50% 50% 30% 30%;
      filter: blur(30px);
      animation: fire-flicker-base 1.2s ease-in-out infinite;
    `;
    this.effectsLayer.appendChild(baseGlow);
    this.activeParticles.push(baseGlow);

    // Layer 2: Mid flame
    const midFlame = document.createElement('div');
    midFlame.className = 'effect-fire-mid';
    midFlame.style.cssText = `
      position: absolute;
      bottom: 5%;
      left: 25%;
      width: 50%;
      height: 35%;
      background: rgba(255, 140, 0, 0.2);
      border-radius: 50% 50% 30% 30%;
      filter: blur(25px);
      animation: fire-flicker-mid 0.8s ease-in-out infinite 0.3s;
    `;
    this.effectsLayer.appendChild(midFlame);
    this.activeParticles.push(midFlame);

    // Layer 3: Hot core
    const hotCore = document.createElement('div');
    hotCore.className = 'effect-fire-core';
    hotCore.style.cssText = `
      position: absolute;
      bottom: 10%;
      left: 40%;
      width: 20%;
      height: 20%;
      background: rgba(255, 220, 100, 0.15);
      border-radius: 50% 50% 30% 30%;
      filter: blur(20px);
      animation: fire-flicker-core 0.5s ease-in-out infinite 0.6s;
    `;
    this.effectsLayer.appendChild(hotCore);
    this.activeParticles.push(hotCore);

    // Create 6 ember particles
    for (let i = 0; i < 6; i++) {
      const ember = document.createElement('div');
      const startX = 30 + Math.random() * 40;
      const duration = 2 + Math.random() * 3;
      const delay = Math.random() * 2;
      const drift = (Math.random() - 0.5) * 30;

      ember.className = 'effect-fire-ember';
      ember.style.cssText = `
        position: absolute;
        width: 3px;
        height: 3px;
        border-radius: 50%;
        left: ${startX}%;
        bottom: 10%;
        background: rgba(255, 180, 0, 0.8);
        animation: ember-rise ${duration}s ${delay}s ease-out infinite;
        --drift: ${drift}px;
      `;

      this.effectsLayer.appendChild(ember);
      this.activeParticles.push(ember);
    }
  }

  /**
   * Create shake effect - screen shake + white flash
   * @private
   */
  createShake() {
    // Apply shake to document root
    document.documentElement.style.animation = 'screen-shake 800ms ease-out';

    // Create white flash overlay
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

    // Remove shake animation after completion
    setTimeout(() => {
      document.documentElement.style.animation = '';
    }, 800);
  }

  /**
   * Create explosion effect - 3-phase sequence
   * @private
   */
  createExplosion() {
    // Phase 1: White flash (0-150ms)
    const flash = document.createElement('div');
    flash.className = 'effect-explosion-flash';
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      animation: explosion-flash 150ms ease-out;
      pointer-events: none;
    `;
    flash.addEventListener('animationend', () => flash.remove());
    this.effectsLayer.appendChild(flash);

    // Phase 2: Orange bloom (100-600ms)
    setTimeout(() => {
      const bloom = document.createElement('div');
      bloom.className = 'effect-explosion-bloom';
      bloom.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 80%;
        background: radial-gradient(circle, rgba(255, 180, 0, 0.8) 0%, rgba(255, 100, 0, 0.4) 40%, transparent 70%);
        animation: explosion-bloom 500ms ease-out;
        pointer-events: none;
      `;
      bloom.addEventListener('animationend', () => bloom.remove());
      this.effectsLayer.appendChild(bloom);
    }, 100);

    // Phase 3: Afterglow (400ms-4000ms)
    setTimeout(() => {
      const afterglow = document.createElement('div');
      afterglow.className = 'effect-explosion-afterglow';
      afterglow.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 30%;
        background: rgba(255, 120, 40, 0.15);
        animation: explosion-afterglow 3600ms ease-out;
        pointer-events: none;
      `;
      afterglow.addEventListener('animationend', () => afterglow.remove());
      this.effectsLayer.appendChild(afterglow);
      this.activeParticles.push(afterglow);
    }, 400);
  }

  /**
   * Create aftermath effect - desaturation + ash
   * @private
   */
  createAftermath() {
    // Desaturation overlay
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

    // Create 8 ash particles
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
   * Create dawn effect - soft gradient
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
   * Create ocean effect - continuous sway
   * @private
   */
  createOcean() {
    this.effectsLayer.style.animation = 'ocean-sway 5s ease-in-out infinite';
  }

  /**
   * Create ash effect - 10 falling particles
   * @private
   */
  createAsh() {
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
   * Create rain effect - continuous particles
   * @private
   */
  createRain() {
    // Future implementation
    console.log('Rain effect not yet implemented');
  }

  /**
   * Apply static overlay for reduced motion users
   * @private
   */
  applyStaticOverlay(effectName) {
    const overlay = document.createElement('div');
    overlay.className = `effect-static-${effectName}`;
    
    let background = '';
    switch (effectName) {
      case 'smoke':
        background = 'rgba(40, 40, 40, 0.3)';
        break;
      case 'fire':
        background = 'rgba(255, 100, 0, 0.2)';
        break;
      case 'dawn':
        background = 'rgba(255, 160, 80, 0.15)';
        break;
      case 'aftermath':
        background = 'rgba(100, 90, 80, 0.3)';
        break;
      default:
        background = 'rgba(100, 100, 100, 0.2)';
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
    // Stop ocean sway
    this.effectsLayer.style.animation = '';

    // Fade out all particles
    this.activeParticles.forEach(particle => {
      if (particle && particle.parentNode) {
        particle.style.transition = 'opacity 800ms ease-out';
        particle.style.opacity = '0';
        setTimeout(() => {
          if (particle.parentNode) {
            particle.remove();
          }
        }, 800);
      }
    });

    // Clear tracking arrays
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
