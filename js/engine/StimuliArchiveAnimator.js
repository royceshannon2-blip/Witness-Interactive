/**
 * StimuliArchiveAnimator
 *
 * Plays an ~800ms "document flies into filing cabinet" animation when the
 * player clicks Close / Archive on a stimulus document.
 *
 * Animation sequence:
 *   0–300ms    Document shrinks, lifts, tilts. Spotlight dims.
 *   200–500ms  Inventory button pulses gold (magnetism ripple × 2).
 *   300–650ms  Document flies along a calculated vector to the inventory
 *              button, scaling 0.85 → 0.2 with slight mid-flight rotation.
 *   620–700ms  Inventory button "absorbs" the doc: scale punch + gold flash
 *              + "+1" badge bounce-in.
 *   650–800ms  World unfreezes (blur removed, choices re-enabled).
 *              Document card removed from DOM on transitionend.
 *
 * After archiving, the inventory drawer highlights the newly added document
 * with a gold left-border accent that fades over 2 seconds.
 *
 * Reduced-motion: all timings collapse to a 150ms cross-fade.
 *
 * Events consumed:
 *   stimuli:archive-requested — { documentId } — triggers play()
 *
 * Events emitted:
 *   stimuli:archive-complete  — { documentId } — animation finished, world thawed
 *
 * Architecture: engine layer — no content imports, no global variables.
 */

class StimuliArchiveAnimator {
  /**
   * @param {EventBus} eventBus
   */
  constructor(eventBus) {
    this._eventBus = eventBus;
    this._reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Track frozen elements so we can thaw them
    this._frozenEls = [];

    // Bound handler
    this._onArchiveRequested = this._onArchiveRequested.bind(this);
    this._eventBus.on('stimuli:archive-requested', this._onArchiveRequested);
  }

  // ── EventBus handler ───────────────────────────────────────────────────────

  _onArchiveRequested(data) {
    if (!data?.documentId) return;
    this.play(data.documentId);
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * Play the archive animation for the given document.
   * @param {string} documentId
   */
  play(documentId) {
    if (this._reduced) {
      this._playReduced(documentId);
      return;
    }
    this._playFull(documentId);
  }

  // ── Reduced-motion path ────────────────────────────────────────────────────

  _playReduced(documentId) {
    const content = document.querySelector('.stimuli-content');
    const overlay = document.querySelector('.stimuli-overlay');

    if (content) {
      content.style.transition = 'opacity 150ms ease';
      content.style.opacity = '0';
    }
    if (overlay) {
      overlay.style.transition = 'opacity 150ms ease';
      overlay.style.opacity = '0';
    }

    this._incrementBadge();

    setTimeout(() => {
      this._thawWorld();
      content?.remove();
      overlay?.remove();
      this._eventBus.emit('stimuli:archive-complete', { documentId });
      this._highlightNewInventoryItem(documentId);
    }, 150);
  }

  // ── Full animation path ────────────────────────────────────────────────────

  _playFull(documentId) {
    const content  = document.querySelector('.stimuli-content');
    const overlay  = document.querySelector('.stimuli-overlay');
    const invBtn   = document.getElementById('doc-inventory-trigger');

    if (!content) {
      // Nothing to animate — just emit complete
      this._eventBus.emit('stimuli:archive-complete', { documentId });
      return;
    }

    // ── Phase 1 (0–300ms): document shrinks, lifts, tilts ─────────────────
    content.classList.add('saa-doc--shrink');

    // Dim the spotlight overlay
    if (overlay) overlay.classList.add('saa-overlay--dimming');

    // ── Phase 2 (200–500ms): inventory button magnetism pulse ─────────────
    if (invBtn) {
      setTimeout(() => {
        invBtn.classList.add('saa-btn--pulse');
        // Remove after two ripple cycles (each ~300ms)
        setTimeout(() => invBtn.classList.remove('saa-btn--pulse'), 700);
      }, 200);
    }

    // ── Phase 3 (300–650ms): document flight ──────────────────────────────
    setTimeout(() => {
      this._flyToInventory(content, invBtn, documentId, overlay);
    }, 300);
  }

  // ── Document flight ────────────────────────────────────────────────────────

  /**
   * Calculate the vector from the document card to the inventory button,
   * then animate the card flying there.
   * @param {HTMLElement} content
   * @param {HTMLElement|null} invBtn
   * @param {string} documentId
   * @param {HTMLElement|null} overlay
   * @private
   */
  _flyToInventory(content, invBtn, documentId, overlay) {
    const docRect = content.getBoundingClientRect();

    // Snapshot current visual position before switching to fixed layout
    content.style.left   = `${docRect.left}px`;
    content.style.top    = `${docRect.top}px`;
    content.style.width  = `${docRect.width}px`;
    content.style.height = `${docRect.height}px`;
    content.style.margin = '0';

    // Target: inventory button center, or bottom-right corner as fallback
    let targetX, targetY;
    if (invBtn) {
      const btnRect = invBtn.getBoundingClientRect();
      targetX = btnRect.left + btnRect.width  / 2;
      targetY = btnRect.top  + btnRect.height / 2;
    } else {
      targetX = window.innerWidth  - 48;
      targetY = window.innerHeight - 48;
    }

    const docCenterX = docRect.left + docRect.width  / 2;
    const docCenterY = docRect.top  + docRect.height / 2;

    const deltaX = targetX - docCenterX;
    const deltaY = targetY - docCenterY;

    // Set CSS custom properties for the keyframe animation
    content.style.setProperty('--saa-fly-x', `${deltaX}px`);
    content.style.setProperty('--saa-fly-y', `${deltaY}px`);

    // Remove shrink class, add flight class
    content.classList.remove('saa-doc--shrink');
    content.classList.add('saa-doc--flying');

    // ── Phase 4 (620–700ms): absorption at inventory button ───────────────
    setTimeout(() => {
      this._absorbAtButton(invBtn);
    }, 320); // 300 (flight start) + 320 = 620ms total

    // ── Phase 5 (650–800ms): world unfreeze + DOM cleanup ─────────────────
    setTimeout(() => {
      this._thawWorld();

      // Fade out overlay
      if (overlay) {
        overlay.style.transition = 'opacity 150ms ease';
        overlay.style.opacity = '0';
        overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
      }

      // Remove content card after its own transition ends
      content.addEventListener('transitionend', () => content.remove(), { once: true });
      // Fallback removal in case transitionend doesn't fire
      setTimeout(() => content.remove(), 200);

      this._eventBus.emit('stimuli:archive-complete', { documentId });
      this._highlightNewInventoryItem(documentId);
    }, 350); // 300 + 350 = 650ms total
  }

  // ── Inventory button absorption ────────────────────────────────────────────

  /**
   * Scale punch + gold flash + badge increment on the inventory button.
   * @param {HTMLElement|null} invBtn
   * @private
   */
  _absorbAtButton(invBtn) {
    if (!invBtn) {
      this._incrementBadge();
      return;
    }

    // Scale punch
    invBtn.classList.add('saa-btn--absorb');
    setTimeout(() => invBtn.classList.remove('saa-btn--absorb'), 80);

    // Gold flash
    invBtn.classList.add('saa-btn--flash');
    setTimeout(() => invBtn.classList.remove('saa-btn--flash'), 200);

    this._incrementBadge(invBtn);
  }

  // ── Badge counter ──────────────────────────────────────────────────────────

  /**
   * Increment (or create) the +1 badge on the inventory button.
   * @param {HTMLElement|null} [invBtn]
   * @private
   */
  _incrementBadge(invBtn) {
    const btn = invBtn || document.getElementById('doc-inventory-trigger');
    if (!btn) return;

    let badge = btn.querySelector('.saa-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'saa-badge';
      badge.setAttribute('aria-hidden', 'true');
      badge.textContent = '0';
      btn.appendChild(badge);
    }

    const current = parseInt(badge.textContent, 10) || 0;
    badge.textContent = String(current + 1);

    // Bounce-in animation
    badge.classList.remove('saa-badge--bounce');
    // Force reflow to restart animation
    void badge.offsetWidth;
    badge.classList.add('saa-badge--bounce');
  }

  // ── Inventory highlight ────────────────────────────────────────────────────

  /**
   * After archiving, highlight the newly added document card in the inventory
   * drawer (if it's open) with a gold left-border accent that fades over 2s.
   * @param {string} documentId
   * @private
   */
  _highlightNewInventoryItem(documentId) {
    // The inventory drawer may or may not be open — check for the card
    const card = document.querySelector(`.doc-card--unlocked[data-doc-id="${documentId}"]`);
    if (!card) return;

    card.classList.add('saa-card--just-archived');
    // Remove after 2s fade
    setTimeout(() => card.classList.remove('saa-card--just-archived'), 2200);
  }

  // ── World freeze / thaw ────────────────────────────────────────────────────

  /**
   * Re-enable scene narrative and choice buttons.
   * @private
   */
  _thawWorld() {
    const targets = [
      document.getElementById('scene-narrative'),
      document.getElementById('scene-choices')
    ].filter(Boolean);

    targets.forEach(el => {
      el.classList.remove('sra-world-frozen'); // reuse existing freeze class
      el.querySelectorAll('button').forEach(btn => {
        btn.disabled = false;
        btn.removeAttribute('aria-disabled');
      });
    });
    this._frozenEls = [];
  }
}

export default StimuliArchiveAnimator;
