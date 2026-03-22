/**
 * QuestionIntroAnimator
 *
 * Plays a ~1.2s cinematic intro sequence before a prediction question or
 * mid-story knowledge question becomes interactive. The sequence:
 *
 *   0–200ms   Backdrop blur + dark vignette fade in
 *   200–500ms Question type badge slides down
 *   400–800ms Modal scales in with spring bounce; SVG border draws itself
 *   800–1200ms Question text reveals word-by-word; options stagger in
 *
 * After the sequence completes, the question is interactive.
 * Respects prefers-reduced-motion — collapses all timings to 0.
 *
 * Usage:
 *   const animator = new QuestionIntroAnimator(eventBus);
 *   // Plays intro, then mounts PauseQuestionModal when ready:
 *   animator.play('prediction', pauseQuestion, documentId, crossRolePrompt);
 *   // Or for a knowledge check:
 *   animator.play('knowledge', pauseQuestion, documentId);
 *
 * Events consumed:
 *   stimuli:shown  — triggers play() when question type is detected
 *
 * Events emitted:
 *   question-intro:complete — { documentId, type } — fired when interactive
 *
 * Architecture: engine layer — no content imports, no global variables.
 */

import PauseQuestionModal from './PauseQuestionModal.js';

class QuestionIntroAnimator {
  /**
   * @param {EventBus} eventBus
   */
  constructor(eventBus) {
    this._eventBus = eventBus;
    this._reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Active DOM elements (cleaned up after each play)
    this._backdropEl = null;
    this._badgeEl    = null;
    this._modal      = null;

    // Bound cleanup
    this._cleanup = this._cleanup.bind(this);
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * Play the cinematic intro then mount the question modal.
   *
   * @param {'prediction'|'knowledge'} type
   * @param {Object}  pauseQuestion  — { question, options[], correctId?, explanation }
   * @param {string}  documentId
   * @param {string}  [crossRolePrompt]
   * @returns {Promise<void>} resolves when the question is interactive
   */
  play(type, pauseQuestion, documentId, crossRolePrompt = null) {
    if (this._reduced) {
      return this._playReduced(type, pauseQuestion, documentId, crossRolePrompt);
    }
    return this._playFull(type, pauseQuestion, documentId, crossRolePrompt);
  }

  // ── Reduced-motion path ────────────────────────────────────────────────────

  _playReduced(type, pauseQuestion, documentId, crossRolePrompt) {
    this._modal = new PauseQuestionModal(
      this._eventBus, pauseQuestion, documentId, crossRolePrompt
    );
    this._modal.mount();
    this._eventBus.emit('question-intro:complete', { documentId, type });
    return Promise.resolve();
  }

  // ── Full animation path ────────────────────────────────────────────────────

  _playFull(type, pauseQuestion, documentId, crossRolePrompt) {
    return new Promise(resolve => {
      // ── Phase 1 (0–200ms): backdrop blur + vignette ──────────────────────
      this._backdropEl = this._createBackdrop();
      document.body.appendChild(this._backdropEl);

      // Trigger reflow then animate in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this._backdropEl.classList.add('qia-backdrop--visible');
        });
      });

      // ── Phase 2 (200–500ms): badge slides down ───────────────────────────
      this._delay(200).then(() => {
        this._badgeEl = this._createBadge(type);
        document.body.appendChild(this._badgeEl);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this._badgeEl.classList.add('qia-badge--visible');
          });
        });
      });

      // ── Phase 3 (400ms): mount modal (it animates itself 400–800ms) ──────
      this._delay(400).then(() => {
        this._modal = new PauseQuestionModal(
          this._eventBus, pauseQuestion, documentId, crossRolePrompt
        );
        // Mount with intro class — suppresses default entrance, we drive it
        this._modal.mount();

        const frame = document.querySelector('.pqm-frame');
        const wrapper = document.querySelector('.pqm-wrapper');
        if (wrapper) wrapper.classList.add('qia-modal-enter');
        if (frame)   this._animateBorderSVG(frame);
      });

      // ── Phase 4 (800ms): reveal question text + options ──────────────────
      this._delay(800).then(() => {
        this._revealQuestionText();
        this._revealOptions();

        this._delay(400).then(() => {
          // Remove intro overlay elements — question is now interactive
          this._removeIntroElements();
          this._eventBus.emit('question-intro:complete', { documentId, type });
          resolve();
        });
      });
    });
  }

  // ── DOM builders ──────────────────────────────────────────────────────────

  _createBackdrop() {
    const el = document.createElement('div');
    el.className = 'qia-backdrop';
    el.setAttribute('aria-hidden', 'true');
    return el;
  }

  _createBadge(type) {
    const isPrediction = type === 'prediction';
    const el = document.createElement('div');
    el.className = `qia-badge qia-badge--${isPrediction ? 'prediction' : 'knowledge'}`;
    el.setAttribute('aria-hidden', 'true'); // modal has the real label
    el.textContent = isPrediction ? 'Prediction' : 'Knowledge Check';
    return el;
  }

  // ── SVG border draw-in ─────────────────────────────────────────────────────

  /**
   * Animate the ornate SVG border paths using stroke-dasharray/dashoffset
   * so they "draw themselves in" over 400ms.
   * @param {HTMLElement} frame — .pqm-frame element
   */
  _animateBorderSVG(frame) {
    const svg = frame.querySelector('.pqm-border-svg');
    if (!svg) return;

    const paths = svg.querySelectorAll('path');
    paths.forEach(path => {
      try {
        const len = path.getTotalLength();
        if (!len) return;
        path.style.strokeDasharray  = `${len}`;
        path.style.strokeDashoffset = `${len}`;
        path.style.transition = 'stroke-dashoffset 400ms ease-out';
        // Trigger draw
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            path.style.strokeDashoffset = '0';
          });
        });
      } catch (_) {
        // getTotalLength not available on non-path elements — skip
      }
    });
  }

  // ── Text reveal ────────────────────────────────────────────────────────────

  _revealQuestionText() {
    const questionEl = document.querySelector('.pqm-question');
    if (!questionEl) return;

    const text = questionEl.textContent || '';
    const words = text.split(/(\s+)/); // preserve whitespace tokens

    questionEl.innerHTML = '';
    questionEl.style.opacity = '1';

    let wordIndex = 0;
    words.forEach(token => {
      if (/^\s+$/.test(token)) {
        // Whitespace — append as text node
        questionEl.appendChild(document.createTextNode(token));
        return;
      }
      const span = document.createElement('span');
      span.className = 'qia-word';
      span.textContent = token;
      span.style.animationDelay = `${wordIndex * 30}ms`;
      questionEl.appendChild(span);
      wordIndex++;
    });
  }

  _revealOptions() {
    const rows = document.querySelectorAll('.pqm-option-row');
    rows.forEach((row, i) => {
      row.classList.add('qia-option-hidden');
      // Stagger: 60ms per option, starting after question reveal begins
      setTimeout(() => {
        row.classList.remove('qia-option-hidden');
        row.classList.add('qia-option-reveal');
      }, i * 60);
    });
  }

  // ── Cleanup ────────────────────────────────────────────────────────────────

  _removeIntroElements() {
    this._backdropEl?.remove();
    this._backdropEl = null;
    this._badgeEl?.remove();
    this._badgeEl = null;

    // Remove intro class from modal wrapper
    document.querySelector('.pqm-wrapper')?.classList.remove('qia-modal-enter');
  }

  _cleanup() {
    this._removeIntroElements();
    this._modal?.destroy();
    this._modal = null;
  }

  // ── Utility ────────────────────────────────────────────────────────────────

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default QuestionIntroAnimator;
