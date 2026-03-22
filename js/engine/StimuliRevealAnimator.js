/**
 * StimuliRevealAnimator
 *
 * Plays a dramatic ~900ms cinematic reveal whenever a stimulus document
 * appears. Triggered by the stimuli:shown EventBus event.
 *
 * Animation sequence:
 *   0ms        World freeze — blur/dim #scene-narrative and #scene-choices
 *   0–150ms    Examination surface slides up from translateY(40px)
 *   100–300ms  Spotlight beam sweeps down onto surface
 *   200–400ms  Document card slams down with spring + micro-thud shake
 *   300ms+     Dust motes spawn and float upward
 *   500–900ms  Title → body text → pause button fade in sequentially
 *
 * Respects prefers-reduced-motion — collapses all timings to 0.
 *
 * Events consumed:
 *   stimuli:shown     — { documentId, documentData } — triggers play()
 *   stimuli:dismissed — { documentId }               — triggers teardown()
 *
 * Events emitted:
 *   stimuli-reveal:complete — { documentId } — document is now readable
 *
 * Architecture: engine layer — no content imports, no global variables.
 */

// Map document IDs to their type class for styling
const DOC_TYPE_MAP = {
  'hm-doc-0':  'pinkerton-report',   // Hayes federal order — official govt doc
  'hm-doc-1a': 'arbeiter-zeitung',   // Arbeiter-Zeitung newspaper
  'hm-doc-1b': 'court-transcript',   // BLS wage data — ledger/report format
  'hm-doc-2':  'harper-weekly',      // Harper's Weekly illustration
  'hm-doc-3':  'arbeiter-zeitung',   // Revenge Circular — printed broadside
  'hm-doc-4':  'harper-weekly',      // Chicago Tribune front page
  'hm-doc-5':  'court-transcript'    // Altgeld pardon — official document
};

// Web Audio context — created lazily on first user interaction
let _audioCtx = null;

class StimuliRevealAnimator {
  /**
   * @param {EventBus} eventBus
   */
  constructor(eventBus) {
    this._eventBus = eventBus;
    this._reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Active elements
    this._surfaceEl  = null;
    this._dustEl     = null;
    this._overlayEl  = null;

    // IDs of frozen elements
    this._frozenEls  = [];

    // Bound handlers
    this._onShown     = this._onShown.bind(this);
    this._onDismissed = this._onDismissed.bind(this);

    this._eventBus.on('stimuli:shown',     this._onShown);
    this._eventBus.on('stimuli:dismissed', this._onDismissed);

    // Unlock audio on first user gesture
    document.addEventListener('pointerdown', () => this._unlockAudio(), { once: true });
  }

  // ── EventBus handlers ──────────────────────────────────────────────────────

  _onShown(data) {
    if (!data) return;
    const docType = DOC_TYPE_MAP[data.documentId] || 'default';
    this.play(data.documentId, docType);
  }

  _onDismissed() {
    this._teardown();
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * Play the full reveal sequence.
   * @param {string} documentId
   * @param {string} docType — one of: arbeiter-zeitung | pinkerton-report | harper-weekly | court-transcript | default
   */
  play(documentId, docType) {
    if (this._reduced) {
      this._playReduced(documentId, docType);
      return;
    }
    this._playFull(documentId, docType);
  }

  // ── Reduced-motion path ────────────────────────────────────────────────────

  _playReduced(documentId, docType) {
    this._applyDocType(docType);
    this._eventBus.emit('stimuli-reveal:complete', { documentId });
  }

  // ── Full animation path ────────────────────────────────────────────────────

  _playFull(documentId, docType) {
    // Phase 1 (0ms): freeze world
    this._freezeWorld();

    // Phase 2 (0–150ms): examination surface slides up
    this._surfaceEl = this._createSurface();
    document.body.appendChild(this._surfaceEl);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this._surfaceEl.classList.add('sra-surface--visible');
      });
    });

    // Phase 3 (100ms): spotlight sweeps down
    setTimeout(() => {
      this._surfaceEl.classList.add('sra-surface--spotlight');
    }, 100);

    // Phase 4 (200ms): document slams down
    setTimeout(() => {
      this._applyDocType(docType);
      const content = document.querySelector('.stimuli-content');
      if (content) {
        content.classList.add('sra-doc--slam');
        // Micro-thud at ~380ms after slam start (180ms into slam)
        setTimeout(() => {
          content.classList.add('sra-doc--thud');
          this._playThudSound();
          setTimeout(() => content.classList.remove('sra-doc--thud'), 120);
        }, 180);
      }
    }, 200);

    // Phase 5 (300ms): spawn dust motes
    setTimeout(() => {
      this._spawnDust();
    }, 300);

    // Phase 6 (500ms): reveal document content sequentially
    setTimeout(() => {
      this._revealContent(documentId);
    }, 500);

    // Sequence complete at 900ms
    setTimeout(() => {
      this._eventBus.emit('stimuli-reveal:complete', { documentId });
    }, 900);
  }

  // ── World freeze ───────────────────────────────────────────────────────────

  _freezeWorld() {
    const targets = [
      document.getElementById('scene-narrative'),
      document.getElementById('scene-choices')
    ].filter(Boolean);

    targets.forEach(el => {
      el.classList.add('sra-world-frozen');
      // Disable all buttons inside choices
      el.querySelectorAll('button').forEach(btn => {
        btn.disabled = true;
        btn.setAttribute('aria-disabled', 'true');
      });
      this._frozenEls.push(el);
    });
  }

  _thawWorld() {
    this._frozenEls.forEach(el => {
      el.classList.remove('sra-world-frozen');
      el.querySelectorAll('button').forEach(btn => {
        btn.disabled = false;
        btn.removeAttribute('aria-disabled');
      });
    });
    this._frozenEls = [];
  }

  // ── Examination surface ────────────────────────────────────────────────────

  _createSurface() {
    const el = document.createElement('div');
    el.className = 'sra-surface';
    el.setAttribute('aria-hidden', 'true');
    return el;
  }

  // ── Document type class ────────────────────────────────────────────────────

  _applyDocType(docType) {
    const content = document.querySelector('.stimuli-content');
    if (!content) return;
    // Remove any existing doc-type class
    content.classList.forEach(cls => {
      if (cls.startsWith('doc-type--')) content.classList.remove(cls);
    });
    content.classList.add(`doc-type--${docType}`);
  }

  // ── Dust motes ─────────────────────────────────────────────────────────────

  _spawnDust() {
    const content = document.querySelector('.stimuli-content');
    if (!content) return;

    const rect = content.getBoundingClientRect();
    const container = document.createElement('div');
    container.className = 'sra-dust';
    container.setAttribute('aria-hidden', 'true');
    document.body.appendChild(container);
    this._dustEl = container;

    const count = 6 + Math.floor(Math.random() * 3); // 6–8
    for (let i = 0; i < count; i++) {
      const mote = document.createElement('div');
      mote.className = 'sra-dust-mote';

      // Random position near document edges
      const edge = Math.random();
      let x, y;
      if (edge < 0.5) {
        // Top edge
        x = rect.left + Math.random() * rect.width;
        y = rect.top + Math.random() * 30;
      } else {
        // Side edges
        x = edge < 0.75
          ? rect.left + Math.random() * 20
          : rect.right - Math.random() * 20;
        y = rect.top + Math.random() * rect.height * 0.6;
      }

      const driftX = (Math.random() - 0.5) * 40; // ±20px
      const duration = 2.5 + Math.random() * 1.5; // 2.5–4s
      const delay    = Math.random() * 0.4;        // 0–400ms

      mote.style.cssText = [
        `left:${x}px`,
        `top:${y}px`,
        `--drift-x:${driftX}px`,
        `animation-duration:${duration}s`,
        `animation-delay:${delay}s`
      ].join(';');

      container.appendChild(mote);
    }
  }

  // ── Content reveal ─────────────────────────────────────────────────────────

  _revealContent(documentId) {
    const content = document.querySelector('.stimuli-content');
    if (!content) return;

    // Apply letterpress SVG filter to text
    this._applyLetterpressFilter(content);

    // Title
    const title = content.querySelector('.stimuli-title');
    if (title) title.classList.add('sra-reveal-title');

    // Body text (300ms after title)
    setTimeout(() => {
      const text = content.querySelector('.stimuli-text');
      if (text) text.classList.add('sra-reveal-text');
    }, 300);

    // Pause question button / prompt (200ms after text)
    setTimeout(() => {
      const pq = content.querySelector('.stimuli-pause-question, #stimuli-dismiss');
      if (pq) pq.classList.add('sra-reveal-action');
    }, 500);
  }

  // ── Letterpress SVG filter ─────────────────────────────────────────────────

  _applyLetterpressFilter(content) {
    // Inject SVG filter defs once into the document
    if (!document.getElementById('sra-letterpress-filter')) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('id', 'sra-filter-defs');
      svg.setAttribute('aria-hidden', 'true');
      svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
      svg.innerHTML = `
        <defs>
          <filter id="sra-letterpress-filter" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4"
                          seed="2" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise"
                               scale="1.2" xChannelSelector="R" yChannelSelector="G"
                               result="displaced"/>
            <feComposite in="displaced" in2="SourceGraphic" operator="in"/>
          </filter>
        </defs>
      `;
      document.body.appendChild(svg);
    }

    const textEl = content.querySelector('.stimuli-text');
    if (textEl) textEl.style.filter = 'url(#sra-letterpress-filter)';
  }

  // ── Web Audio thud ─────────────────────────────────────────────────────────

  _unlockAudio() {
    try {
      _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (_) { /* audio not available */ }
  }

  _playThudSound() {
    if (!_audioCtx) return;
    try {
      // Short low-frequency thud: noise burst filtered to ~80Hz
      const bufferSize = _audioCtx.sampleRate * 0.08; // 80ms
      const buffer = _audioCtx.createBuffer(1, bufferSize, _audioCtx.sampleRate);
      const data   = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
      }

      const source = _audioCtx.createBufferSource();
      source.buffer = buffer;

      // Low-pass filter to shape into a thud
      const filter = _audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 120;
      filter.Q.value = 0.8;

      const gain = _audioCtx.createGain();
      gain.gain.setValueAtTime(0.18, _audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, _audioCtx.currentTime + 0.08);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(_audioCtx.destination);
      source.start();
    } catch (_) { /* audio error — silent fallback */ }
  }

  // ── Teardown ───────────────────────────────────────────────────────────────

  _teardown() {
    this._thawWorld();
    this._surfaceEl?.remove();
    this._surfaceEl = null;
    this._dustEl?.remove();
    this._dustEl = null;

    // Remove reveal classes from content
    const content = document.querySelector('.stimuli-content');
    if (content) {
      content.classList.remove('sra-doc--slam', 'sra-doc--thud');
      content.style.filter = '';
      const textEl = content.querySelector('.stimuli-text');
      if (textEl) textEl.style.filter = '';
      ['sra-reveal-title', 'sra-reveal-text', 'sra-reveal-action'].forEach(cls => {
        content.querySelectorAll(`.${cls}`).forEach(el => el.classList.remove(cls));
      });
    }

    // Remove SVG filter defs
    document.getElementById('sra-filter-defs')?.remove();
  }
}

export default StimuliRevealAnimator;
