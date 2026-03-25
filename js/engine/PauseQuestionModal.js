/**
 * PauseQuestionModal
 * Architecture: engine layer — no content imports, no global variables.
 */

class PauseQuestionModal {
  constructor(eventBus, pauseQuestion, documentId, crossRolePrompt = null) {
    this._eventBus = eventBus;
    this._pq = pauseQuestion;
    this._documentId = documentId;
    this._crossRolePrompt = crossRolePrompt;
    
    this._el = null;
    this._selectedOptId = null;
    this._submitted = false;

    // 1. PERFECT FIX: Bind handlers in constructor so they can be reliably removed
    this._onKeyDown = this._onKeyDown.bind(this);
    this._submit = this._submit.bind(this);
  }

  mount() {
    this._el = this._buildDOM();
    document.body.appendChild(this._el);
    
    // Attach document-level keyboard listener
    document.addEventListener('keydown', this._onKeyDown);
    
    // Auto-focus the first option for accessibility
    const firstOption = this._el.querySelector('.pqm-radio-input');
    if (firstOption) firstOption.focus();
  }

  destroy() {
    // EDGE CASE FIX: Prevent memory leaks and ghost Enter presses
    document.removeEventListener('keydown', this._onKeyDown);
    
    if (this._el && this._el.parentNode) {
      this._el.parentNode.removeChild(this._el);
    }
    this._el = null;
  }

  // ... (Assume _buildDOM and other rendering methods are here)

  _buildActions(actionsContainer) {
    const submitBtn = document.createElement('button');
    submitBtn.id = 'pqm-submit';
    submitBtn.textContent = 'Submit Answer';
    submitBtn.className = 'pqm-btn';
    submitBtn.disabled = true; // Disabled until an option is selected
    
    // 2. PERFECT FIX: Pass the bound reference to the event listener
    submitBtn.addEventListener('click', this._submit); 
    
    actionsContainer.appendChild(submitBtn);
  }

  // 3. PERFECT FIX: The updated Submit Handler
  _submit() {
    // EDGE CASE FIX: Prevent double-clicks from running the logic twice
    if (!this._selectedOptId || this._submitted) return;
    this._submitted = true;

    const correctId = this._pq.correctId;
    const isCorrect = this._selectedOptId === correctId;

    // Mark all rows (correct/incorrect) and disable them visually
    const rows = this._el.querySelectorAll('.pqm-option-row');
    if (rows) {
      rows.forEach(row => {
        row.classList.add('disabled');
        if (row.dataset.optId === correctId) row.classList.add('correct');
        if (row.dataset.optId === this._selectedOptId && !isCorrect) row.classList.add('incorrect');
      });
    }

    // Show explanation
    const explanation = this._el.querySelector('#pqm-explanation');
    if (explanation) explanation.classList.remove('hidden');

    // Swap submit button to "Continue"
    const submitBtn = this._el.querySelector('#pqm-submit');
    if (submitBtn) {
      submitBtn.textContent = 'Continue';
      submitBtn.classList.remove('ready');
      submitBtn.disabled = false;
      
      // Successfully remove the old bound listener! No more ghost triggers.
      submitBtn.removeEventListener('click', this._submit);
      
      // Attach the new listener for the Continue phase
      submitBtn.addEventListener('click', () => {
        
        // This advances the StimuliManager queue
        this._eventBus.emit('stimuli:answer-submitted', {
          documentId: this._documentId,
          selectedId: this._selectedOptId,
          correct: isCorrect
        });
        
        // This satisfies the architecture outline in your StimuliManager header
        this._eventBus.emit('stimuli:dismiss-requested', { 
          documentId: this._documentId 
        });
        
        // Safely wipe the modal from the DOM
        this.destroy();
      });
      
      // Auto-focus the Continue button so the user can just press Enter
      submitBtn.focus();
    }

    // Emit the event signifying the question has been answered (but not yet dismissed)
    this._eventBus.emit('stimuli:pause-question-answered', {
      documentId: this._documentId,
      correct: isCorrect,
      selectedId: this._selectedOptId
    });
  }

  _onKeyDown(e) {
    if (e.key === 'Escape') {
      // Don't close on Escape — player must answer. Just refocus the UI.
      const first = this._el?.querySelector('.pqm-radio-input');
      if (first) first.focus();
    }
    
    // EDGE CASE FIX: Pressing Enter will trigger whatever phase the button is in
    if (e.key === 'Enter') {
      const submitBtn = this._el?.querySelector('#pqm-submit');
      if (submitBtn && !submitBtn.disabled) {
        submitBtn.click(); 
        // NOTE: Because we safely swapped out the event listener in _submit(), 
        // pressing 'Enter' on the continue phase will flawlessly trigger the 
        // new dismiss logic without re-triggering the submit logic.
      }
    }
  }
}
