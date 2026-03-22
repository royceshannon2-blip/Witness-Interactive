/**
 * PauseQuestionModal
 *
 * Framed notice-board modal that appears after the stimulus document is
 * scrolled/read. Replaces the inline .stimuli-pause-question block.
 *
 * Visual design:
 *   - Ornate SVG border with repeating scroll/flourish motifs in #8a6a3a bronze
 *   - Lined paper background for the question body
 *   - Answer options as ledger-line rows with brass radio bullets
 *   - "Submit Answer" — embossed brass plate, glows #d4af37 when answer selected
 *   - "Open Inventory" — secondary brass plate with folder icon
 *   - Cross-Role Perspective card: offset top-right, 80% scale, 2deg rotation
 *   - Backdrop: game scene at 20% opacity, blurred
 *   - Entrance: drops from above with slight bounce
 *
 * Usage:
 *   const modal = new PauseQuestionModal(eventBus, pauseQuestion, documentId, crossRolePrompt);
 *   modal.mount();    // appends to document.body
 *   modal.destroy();  // removes from DOM, cleans up
 *
 * Events emitted via eventBus:
 *   stimuli:answer-submitted  — { documentId, selectedId, correct }
 *   inventory:open-requested  — {}
 *
 * Architecture: engine layer — no content imports, no global variables.
 */

class PauseQuestionModal {
  /**
   * @param {EventBus} eventBus
   * @param {Object}   pauseQuestion  — { question, options[], correctId, explanation }
   * @param {string}   documentId
   * @param {string}   [crossRolePrompt] — optional cross-role perspective text
   */
  constructor(eventBus, pauseQuestion, documentId, crossRolePrompt = null) {
    this._eventBus       = eventBus;
    this._pq             = pauseQuestion;
    this._documentId     = documentId;
    this._crossRolePrompt = crossRolePrompt;

    this._el             = null;   // root .pqm-backdrop element
    this._selectedOptId  = null;
    this._submitted      = false;

    // Bound handlers
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  mount() {
    if (this._el) return;
    this._el = this._build();
    document.body.appendChild(this._el);
    document.addEventListener('keydown', this._onKeyDown);

    // Focus the first option for keyboard users
    const firstOption = this._el.querySelector('.pqm-radio-input');
    if (firstOption) firstOption.focus();
  }

  destroy() {
    document.removeEventListener('keydown', this._onKeyDown);
    this._el?.remove();
    this._el = null;
  }

  // ── Build DOM ──────────────────────────────────────────────────────────────

  _build() {
    const backdrop = document.createElement('div');
    backdrop.className = 'pqm-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-labelledby', 'pqm-question-text');

    const wrapper = document.createElement('div');
    wrapper.className = 'pqm-wrapper';

    // Cross-role card (top-right offset)
    if (this._crossRolePrompt) {
      wrapper.appendChild(this._buildCrossRoleCard());
    }

    // Main frame
    wrapper.appendChild(this._buildFrame());

    backdrop.appendChild(wrapper);
    return backdrop;
  }

  _buildFrame() {
    const frame = document.createElement('div');
    frame.className = 'pqm-frame';

    // Ornate SVG border
    frame.appendChild(this._buildBorderSVG());

    // Header band
    const header = document.createElement('div');
    header.className = 'pqm-header';
    header.innerHTML = `
      <span class="pqm-header-label">AP Primary Source Analysis</span>
      <span class="pqm-spice-tag" aria-hidden="true">AP Skill 2 — Sourcing</span>
    `;
    frame.appendChild(header);

    // Lined paper body
    frame.appendChild(this._buildBody());

    // Actions
    frame.appendChild(this._buildActions());

    return frame;
  }

  _buildBody() {
    const body = document.createElement('div');
    body.className = 'pqm-body';

    const question = document.createElement('p');
    question.className = 'pqm-question';
    question.id = 'pqm-question-text';
    question.textContent = this._pq.question;
    body.appendChild(question);

    const optionsList = document.createElement('ul');
    optionsList.className = 'pqm-options';
    optionsList.setAttribute('role', 'radiogroup');
    optionsList.setAttribute('aria-labelledby', 'pqm-question-text');

    this._pq.options.forEach((opt, i) => {
      const label = ['A', 'B', 'C', 'D'][i] || String(i + 1);
      const row = document.createElement('li');
      row.className = 'pqm-option-row';
      row.dataset.optId = opt.id;
      row.dataset.correct = String(!!opt.correct);

      const radioWrap = document.createElement('span');
      radioWrap.className = 'pqm-radio';
      radioWrap.setAttribute('aria-hidden', 'true');

      const radioInput = document.createElement('input');
      radioInput.type = 'radio';
      radioInput.name = `pqm-${this._documentId}`;
      radioInput.value = opt.id;
      radioInput.className = 'pqm-radio-input';
      radioInput.setAttribute('aria-label', `Option ${label}: ${opt.text}`);
      radioWrap.appendChild(radioInput);

      const optLabel = document.createElement('label');
      optLabel.className = 'pqm-option-label';
      optLabel.textContent = `${label}. ${opt.text}`;

      row.appendChild(radioWrap);
      row.appendChild(optLabel);

      // Click anywhere on row selects it
      row.addEventListener('click', () => {
        if (this._submitted) return;
        radioInput.checked = true;
        this._selectOption(opt.id);
      });

      radioInput.addEventListener('change', () => {
        if (this._submitted) return;
        this._selectOption(opt.id);
      });

      optionsList.appendChild(row);
    });

    body.appendChild(optionsList);

    // Explanation (hidden until submitted)
    const explanation = document.createElement('div');
    explanation.className = 'pqm-explanation hidden';
    explanation.id = 'pqm-explanation';
    explanation.setAttribute('role', 'status');
    explanation.setAttribute('aria-live', 'polite');
    explanation.textContent = this._pq.explanation || '';
    body.appendChild(explanation);

    return body;
  }

  _buildActions() {
    const actions = document.createElement('div');
    actions.className = 'pqm-actions';

    // Submit button
    const submitBtn = document.createElement('button');
    submitBtn.className = 'pqm-btn pqm-btn-submit';
    submitBtn.id = 'pqm-submit';
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-describedby', 'pqm-question-text');
    submitBtn.textContent = 'Submit Answer';
    submitBtn.addEventListener('click', () => this._submit());
    actions.appendChild(submitBtn);

    // Inventory button
    const inventoryBtn = document.createElement('button');
    inventoryBtn.className = 'pqm-btn pqm-btn-inventory';
    inventoryBtn.setAttribute('aria-label', 'Open primary sources inventory');
    inventoryBtn.innerHTML = `<span class="pqm-btn-icon" aria-hidden="true">📁</span> Open Inventory`;
    inventoryBtn.addEventListener('click', () => {
      this._eventBus.emit('inventory:open-requested', {});
    });
    actions.appendChild(inventoryBtn);

    return actions;
  }

  // ── Ornate SVG border ──────────────────────────────────────────────────────

  /**
   * Build an SVG element with repeating scroll/flourish motifs along all four
   * edges in #8a6a3a bronze. The SVG uses a <pattern> for the repeating motif
   * and corner ornaments at each corner.
   */
  _buildBorderSVG() {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'pqm-border-svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('preserveAspectRatio', 'none');

    // Defs: scroll motif pattern + corner ornament symbol
    svg.innerHTML = `
      <defs>
        <!-- Repeating scroll/flourish tile (20×12) -->
        <pattern id="pqm-scroll-h" x="0" y="0" width="20" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 6 C3 2, 7 2, 10 6 C13 10, 17 10, 20 6"
                fill="none" stroke="#8a6a3a" stroke-width="1.2"
                stroke-linecap="round"/>
          <circle cx="10" cy="6" r="1.2" fill="#8a6a3a" opacity="0.6"/>
        </pattern>
        <!-- Vertical scroll tile (12×20) -->
        <pattern id="pqm-scroll-v" x="0" y="0" width="12" height="20" patternUnits="userSpaceOnUse">
          <path d="M6 0 C2 3, 2 7, 6 10 C10 13, 10 17, 6 20"
                fill="none" stroke="#8a6a3a" stroke-width="1.2"
                stroke-linecap="round"/>
          <circle cx="6" cy="10" r="1.2" fill="#8a6a3a" opacity="0.6"/>
        </pattern>
        <!-- Corner flourish symbol -->
        <symbol id="pqm-corner" viewBox="0 0 24 24">
          <path d="M2 22 C2 12, 12 2, 22 2" fill="none" stroke="#8a6a3a" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M2 22 C6 18, 10 14, 14 10 C18 6, 22 2, 22 2" fill="none" stroke="#8a6a3a" stroke-width="0.8" opacity="0.5"/>
          <circle cx="2"  cy="22" r="2.5" fill="#8a6a3a"/>
          <circle cx="22" cy="2"  r="2.5" fill="#8a6a3a"/>
          <circle cx="12" cy="12" r="1.5" fill="#8a6a3a" opacity="0.7"/>
        </symbol>
      </defs>

      <!-- Top edge scroll band -->
      <rect x="20" y="0" width="calc(100% - 40px)" height="12"
            fill="url(#pqm-scroll-h)" opacity="0.9"/>
      <!-- Bottom edge scroll band -->
      <rect x="20" y="calc(100% - 12px)" width="calc(100% - 40px)" height="12"
            fill="url(#pqm-scroll-h)" opacity="0.9"/>
      <!-- Left edge scroll band -->
      <rect x="0" y="20" width="12" height="calc(100% - 40px)"
            fill="url(#pqm-scroll-v)" opacity="0.9"/>
      <!-- Right edge scroll band -->
      <rect x="calc(100% - 12px)" y="20" width="12" height="calc(100% - 40px)"
            fill="url(#pqm-scroll-v)" opacity="0.9"/>

      <!-- Corner ornaments -->
      <use href="#pqm-corner" x="0"           y="0"           width="24" height="24"/>
      <use href="#pqm-corner" x="calc(100% - 24px)" y="0"     width="24" height="24"
           transform-origin="calc(100% - 12px) 12px" transform="scale(-1,1) translate(calc(-100% + 24px), 0)"/>
      <use href="#pqm-corner" x="0"           y="calc(100% - 24px)" width="24" height="24"
           transform-origin="12px calc(100% - 12px)" transform="scale(1,-1) translate(0, calc(-100% + 24px))"/>
      <use href="#pqm-corner" x="calc(100% - 24px)" y="calc(100% - 24px)" width="24" height="24"
           transform-origin="calc(100% - 12px) calc(100% - 12px)"
           transform="scale(-1,-1) translate(calc(-100% + 24px), calc(-100% + 24px))"/>
    `;

    return svg;
  }

  // ── Cross-role card ────────────────────────────────────────────────────────

  _buildCrossRoleCard() {
    const card = document.createElement('div');
    card.className = 'pqm-cross-role-card';
    card.setAttribute('role', 'complementary');
    card.setAttribute('aria-label', 'Cross-Role Perspective');

    card.innerHTML = `
      <div class="pqm-cross-role-header">
        <span class="pqm-cross-role-label">Cross-Role Perspective</span>
      </div>
      <div class="pqm-cross-role-body">${this._escapeHTML(this._crossRolePrompt)}</div>
    `;

    return card;
  }

  // ── Interaction ────────────────────────────────────────────────────────────

  _selectOption(optId) {
    this._selectedOptId = optId;

    // Update row visual state
    this._el.querySelectorAll('.pqm-option-row').forEach(row => {
      row.classList.toggle('selected', row.dataset.optId === optId);
    });

    // Enable + glow submit button
    const submitBtn = this._el.querySelector('#pqm-submit');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.add('ready');
    }
  }

  _submit() {
    if (!this._selectedOptId || this._submitted) return;
    this._submitted = true;

    const correctId = this._pq.correctId;
    const isCorrect = this._selectedOptId === correctId;

    // Mark all rows
    this._el.querySelectorAll('.pqm-option-row').forEach(row => {
      row.classList.add('disabled');
      if (row.dataset.optId === correctId) row.classList.add('correct');
      if (row.dataset.optId === this._selectedOptId && !isCorrect) row.classList.add('incorrect');
    });

    // Show explanation
    const explanation = this._el.querySelector('#pqm-explanation');
    if (explanation) explanation.classList.remove('hidden');

    // Swap submit button to Continue
    const submitBtn = this._el.querySelector('#pqm-submit');
    if (submitBtn) {
      submitBtn.textContent = 'Continue';
      submitBtn.classList.remove('ready');
      submitBtn.disabled = false;
      submitBtn.removeEventListener('click', this._submit);
      submitBtn.addEventListener('click', () => {
        this._eventBus.emit('stimuli:answer-submitted', {
          documentId: this._documentId,
          selectedId: this._selectedOptId,
          correct: isCorrect
        });
        this.destroy();
      });
      submitBtn.focus();
    }

    this._eventBus.emit('stimuli:pause-question-answered', {
      documentId: this._documentId,
      correct: isCorrect,
      selectedId: this._selectedOptId
    });
  }

  _onKeyDown(e) {
    if (e.key === 'Escape') {
      // Don't close on Escape — player must answer. Just focus first option.
      const first = this._el?.querySelector('.pqm-radio-input');
      if (first) first.focus();
    }
    if (e.key === 'Enter') {
      const submitBtn = this._el?.querySelector('#pqm-submit');
      if (submitBtn && !submitBtn.disabled) submitBtn.click();
    }
  }

  _escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

export default PauseQuestionModal;
