/**
 * StimuliManager — Primary Source Document Display Engine
 *
 * SIMPLIFIED ARCHITECTURE (Bug-fix rewrite):
 *
 * Root cause of the "scene 2 freezes" bug:
 *   The previous version deferred pause questions to the NEXT scene's
 *   typewriter:complete. Scene 3 has a predictionQuestion, so the deferred
 *   docs from scene 2 were silently dropped (the `if (hasPrediction) return`
 *   guard skipped registering the typewriter listener). Choices were disabled
 *   by UIController but `stimuli:all-pause-questions-complete` never fired,
 *   leaving the scene permanently frozen.
 *
 * New flow (same-scene, no deferral):
 *   scene:transition fires
 *     → doc IDs in stimuliUnlock stored as pendingForThisScene
 *     → typewriter:complete fires
 *       → docs are marked shown, stimuli:shown emitted (for inventory)
 *       → stimuli:new-unlocked emitted (toast notification)
 *       → pause questions queue built from docs that HAVE a pauseQuestion
 *       → first pause question presented immediately
 *         → player answers → next pause question
 *           → when queue empty → stimuli:all-pause-questions-complete emitted
 *             → UIController re-enables choices
 *
 * Events emitted:
 *   stimuli:new-unlocked               — { documentIds }  toast notification
 *   stimuli:shown                      — { documentId, documentData }  inventory hook
 *   stimuli:present-pause-question     — { documentId, documentData }  UIController mounts modal
 *   stimuli:pause-question-answered    — { documentId, correct, selectedId }
 *   stimuli:all-pause-questions-complete — {}  UIController re-enables choices
 *
 * Events consumed:
 *   scene:transition          — stores pending doc IDs for current scene
 *   typewriter:complete       — triggers unlock + first pause question
 *   stimuli:answer-submitted  — advances pause question queue
 *   briefing:stimuli-unlock   — unlocks docs from briefing pages (no pause Q)
 *   game:start / role:started — full session reset
 */

import { getDocument } from '../content/missions/haymarket/stimulus-documents.js';
import DocAnnotationLayer from './DocAnnotationLayer.js';

class StimuliManager {
  /**
   * @param {EventBus} eventBus
   * @param {AnnotationStore} [annotationStore]
   */
  constructor(eventBus, annotationStore = null) {
    this.eventBus = eventBus;
    this.annotationStore = annotationStore;

    // Session-scoped deduplication — never show the same doc twice
    this.shownDocuments = new Set();

    // Docs pending for the current scene (set on scene:transition, consumed on typewriter:complete)
    this._pendingForThisScene = [];
    this._pendingSceneId = null;

    // Queue of document IDs whose pause questions still need answering this scene
    this._pauseQuestionQueue = [];

    // Active DocAnnotationLayer (one per open overlay in inventory)
    this._docAnnotationLayer = null;

    // Stored typewriter listener reference so we can remove it cleanly
    this._typewriterHandler = null;

    // Subscribe
    this.eventBus.on('scene:transition',         (data) => this._handleSceneTransition(data));
    this.eventBus.on('stimuli:answer-submitted',  (data) => this._handleAnswerSubmitted(data));
    this.eventBus.on('briefing:stimuli-unlock',   (data) => this._handleBriefingUnlock(data));
    this.eventBus.on('game:start',                ()     => this.reset());
    this.eventBus.on('role:started',              ()     => this.reset());
  }

  // ── Session reset ───────────────────────────────────────────────────────────

  reset() {
    this.shownDocuments.clear();
    this._pendingForThisScene = [];
    this._pendingSceneId = null;
    this._pauseQuestionQueue = [];
    this._clearTypewriterListener();
    this.detachAnnotationOverlay();
  }

  // ── Scene transition ────────────────────────────────────────────────────────

  _handleSceneTransition(data) {
    // Cancel any typewriter listener from the previous scene
    this._clearTypewriterListener();

    // Reset per-scene state
    this._pendingForThisScene = [];
    this._pendingSceneId = null;
    this._pauseQuestionQueue = [];

    if (!data?.scene) return;

    const unlock = data.scene.stimuliUnlock;
    if (!Array.isArray(unlock) || unlock.length === 0) return;

    // Filter docs already shown this session
    const toUnlock = unlock.filter(id => !this.shownDocuments.has(id));
    if (toUnlock.length === 0) return;

    this._pendingForThisScene = toUnlock;
    this._pendingSceneId = data.scene.id;

    // Wait for typewriter to finish before revealing docs / asking questions
    this._typewriterHandler = (twData) => {
      if (twData?.sceneId !== this._pendingSceneId) return;
      this._clearTypewriterListener();
      this._onTypewriterComplete();
    };
    this.eventBus.on('typewriter:complete', this._typewriterHandler);
  }

  _clearTypewriterListener() {
    if (this._typewriterHandler) {
      this.eventBus.off('typewriter:complete', this._typewriterHandler);
      this._typewriterHandler = null;
    }
  }

  // ── Typewriter complete → unlock docs + start pause question queue ──────────

  _onTypewriterComplete() {
    const toUnlock = this._pendingForThisScene;
    this._pendingForThisScene = [];
    this._pendingSceneId = null;

    if (toUnlock.length === 0) return;

    // Mark as shown, emit events
    const docsWithQuestions = [];
    for (const id of toUnlock) {
      if (this.shownDocuments.has(id)) continue;
      this.shownDocuments.add(id);

      const documentData = getDocument(id);
      // Emit for inventory tracking regardless of whether doc has a pause question
      this.eventBus.emit('stimuli:shown', { documentId: id, documentData });

      if (documentData?.pauseQuestion) {
        docsWithQuestions.push(id);
      }
    }

    // Toast notification for newly unlocked intel
    this.eventBus.emit('stimuli:new-unlocked', { documentIds: toUnlock });

    if (docsWithQuestions.length === 0) {
      // No pause questions needed — choices stay enabled
      return;
    }

    // Build the queue and kick off the first question
    this._pauseQuestionQueue = docsWithQuestions;
    this._showNextPauseQuestion();
  }

  // ── Pause question queue ────────────────────────────────────────────────────

  _showNextPauseQuestion() {
    if (this._pauseQuestionQueue.length === 0) {
      // All done — unfreeze the world
      this.eventBus.emit('stimuli:all-pause-questions-complete', {});
      return;
    }

    const docId = this._pauseQuestionQueue.shift();
    const documentData = getDocument(docId);

    if (!documentData?.pauseQuestion) {
      // No question for this doc (shouldn't happen given queue build logic, but be safe)
      this._showNextPauseQuestion();
      return;
    }

    this.eventBus.emit('stimuli:present-pause-question', {
      documentId: docId,
      documentData: documentData
    });
  }

  _handleAnswerSubmitted(data) {
    // Small delay lets the modal's "Continue" animation complete gracefully
    setTimeout(() => {
      this._showNextPauseQuestion();
    }, 400);
  }

  // ── Briefing unlock (no pause questions — briefing IS the reading) ──────────

  _handleBriefingUnlock(data) {
    if (!Array.isArray(data?.documentIds) || data.documentIds.length === 0) return;

    const toUnlock = data.documentIds.filter(id => !this.shownDocuments.has(id));
    if (toUnlock.length === 0) return;

    for (const id of toUnlock) {
      this.shownDocuments.add(id);
      const documentData = getDocument(id);
      if (documentData) {
        this.eventBus.emit('stimuli:shown', { documentId: id, documentData });
      }
    }

    this.eventBus.emit('stimuli:new-unlocked', { documentIds: toUnlock });
  }

  // ── Annotation overlay (called by IntelInventory when player reviews a doc) ─

  attachAnnotationOverlay(documentData, contentEl) {
    if (!contentEl) return;

    this.detachAnnotationOverlay();

    const textContainer = contentEl.querySelector('.stimuli-text');
    if (!textContainer) return;

    this._docAnnotationLayer = new DocAnnotationLayer(contentEl);
    this._docAnnotationLayer.mount();

    this._restoreHighlights(textContainer, documentData.id);

    const onSelectionEnd = () => {
      const selection = window.getSelection();
      const selectedText = selection ? selection.toString().trim() : '';
      if (!selectedText) return;
      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      if (!range || !textContainer.contains(range.commonAncestorContainer)) return;
      this._showHighlightToolbar(range, selectedText, documentData);
    };

    textContainer.addEventListener('mouseup', onSelectionEnd);
    textContainer.addEventListener('touchend', onSelectionEnd);

    textContainer.addEventListener('click', (e) => {
      const mark = e.target.closest('mark.annotation-highlight');
      if (!mark) return;
      const highlightId = mark.dataset.highlightId;
      if (highlightId) this._openNoteEditor(mark, documentData.id, highlightId);
    });
  }

  detachAnnotationOverlay() {
    if (this._docAnnotationLayer) {
      this._docAnnotationLayer.destroy();
      this._docAnnotationLayer = null;
    }
  }

  // ── Highlight toolbar ───────────────────────────────────────────────────────

  _showHighlightToolbar(range, selectedText, documentData) {
    document.getElementById('annotation-toolbar')?.remove();

    const rect = range.getBoundingClientRect();
    const toolbar = document.createElement('div');
    toolbar.id = 'annotation-toolbar';
    toolbar.className = 'annotation-toolbar';
    toolbar.setAttribute('role', 'toolbar');
    toolbar.setAttribute('aria-label', 'Highlight options');

    const colors = [
      { color: 'yellow', label: 'Evidence' },
      { color: 'blue',   label: 'Context' },
      { color: 'pink',   label: 'Perspective' }
    ];

    colors.forEach(({ color, label }) => {
      const btn = document.createElement('button');
      btn.className = `annotation-toolbar-color annotation-toolbar-color--${color}`;
      btn.setAttribute('aria-label', `Highlight as ${label}`);
      btn.title = label;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toolbar.remove();
        this._applyHighlight(range, selectedText, color, label, documentData);
      });
      toolbar.appendChild(btn);
    });

    const noteBtn = document.createElement('button');
    noteBtn.className = 'annotation-toolbar-note';
    noteBtn.textContent = 'Add Note';
    noteBtn.setAttribute('aria-label', 'Add note to selection');
    noteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toolbar.remove();
      const highlightId = this._applyHighlight(range, selectedText, 'yellow', 'Evidence', documentData);
      if (highlightId) {
        const mark = document.querySelector(`mark[data-highlight-id="${highlightId}"]`);
        if (mark) this._openNoteEditor(mark, documentData.id, highlightId);
      }
    });
    toolbar.appendChild(noteBtn);
    document.body.appendChild(toolbar);

    const pad = 8;
    const tw  = toolbar.offsetWidth;
    const top = Math.max(pad, rect.top + window.scrollY - toolbar.offsetHeight - pad);
    const left = Math.min(
      window.innerWidth - tw - pad,
      Math.max(pad, rect.left + window.scrollX + rect.width / 2 - tw / 2)
    );
    toolbar.style.top  = `${top}px`;
    toolbar.style.left = `${left}px`;

    const dismiss = (e) => {
      if (!toolbar.contains(e.target)) {
        toolbar.remove();
        document.removeEventListener('mousedown', dismiss);
        document.removeEventListener('touchstart', dismiss);
      }
    };
    setTimeout(() => {
      document.addEventListener('mousedown', dismiss);
      document.addEventListener('touchstart', dismiss);
    }, 0);
  }

  _applyHighlight(range, selectedText, color, colorLabel, documentData) {
    if (!this.annotationStore) return null;
    try {
      const id   = `highlight_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const mark = document.createElement('mark');
      mark.className = `annotation-highlight annotation-highlight--${color}`;
      mark.dataset.highlightId = id;
      mark.setAttribute('aria-label', `${colorLabel} highlight: ${selectedText}`);
      mark.setAttribute('tabindex', '0');
      range.surroundContents(mark);

      this.annotationStore.addHighlight(
        documentData.id,
        documentData.title,
        `${documentData.source} — ${documentData.date}`,
        { id, text: selectedText, color, colorLabel, apConcept: null, note: '', createdAt: Date.now() }
      );

      this.eventBus.emit('annotation:added', { documentId: documentData.id, highlightId: id });
      this.eventBus.emit('annotation:store-updated', {});
      window.getSelection()?.removeAllRanges();
      return id;
    } catch (err) {
      console.warn('StimuliManager: Could not apply highlight (cross-element selection):', err.message);
      window.getSelection()?.removeAllRanges();
      return null;
    }
  }

  _openNoteEditor(mark, documentId, highlightId) {
    if (!this.annotationStore) return;
    document.getElementById('annotation-note-editor')?.remove();

    const doc       = this.annotationStore.getDocument(documentId);
    const highlight = doc ? doc.highlights.find(h => h.id === highlightId) : null;

    const editor = document.createElement('div');
    editor.id = 'annotation-note-editor';
    editor.className = 'annotation-note-editor';
    editor.innerHTML = `
      <textarea class="annotation-note-input" maxlength="300" rows="3"
        placeholder="What does this tell you? How does it connect to the historical argument?">${highlight ? this._escapeHTML(highlight.note) : ''}</textarea>
      <select class="annotation-concept-select" aria-label="AP concept">
        <option value="">None</option>
        <option value="Causation">Causation</option>
        <option value="Continuity">Continuity</option>
        <option value="Comparison">Comparison</option>
        <option value="Contextualization">Contextualization</option>
        <option value="Complexity">Complexity</option>
      </select>
      <div class="annotation-editor-actions">
        <button class="annotation-save-btn">Save</button>
        <button class="annotation-cancel-btn">Cancel</button>
      </div>
    `;

    const select = editor.querySelector('.annotation-concept-select');
    if (highlight?.apConcept) select.value = highlight.apConcept;

    mark.after(editor);
    editor.querySelector('textarea').focus();

    editor.querySelector('.annotation-save-btn').addEventListener('click', () => {
      const note      = editor.querySelector('textarea').value.trim();
      const apConcept = select.value || null;
      this.annotationStore.updateHighlight(documentId, highlightId, { note, apConcept });
      if (note) mark.classList.add('has-note');
      else mark.classList.remove('has-note');
      editor.remove();
      this.eventBus.emit('annotation:store-updated', {});
    });

    editor.querySelector('.annotation-cancel-btn').addEventListener('click', () => {
      editor.remove();
    });
  }

  _restoreHighlights(textContainer, documentId) {
    if (!this.annotationStore) return;
    const doc = this.annotationStore.getDocument(documentId);
    if (!doc || doc.highlights.length === 0) return;
    doc.highlights.forEach(h => {
      this._wrapTextInContainer(textContainer, h.text, h.color, h.colorLabel, h.id, !!h.note);
    });
  }

  _wrapTextInContainer(container, text, color, colorLabel, highlightId, hasNote) {
    if (!text) return;
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const idx = node.nodeValue.indexOf(text);
      if (idx === -1) continue;
      try {
        const range = document.createRange();
        range.setStart(node, idx);
        range.setEnd(node, idx + text.length);
        const mark = document.createElement('mark');
        mark.className = `annotation-highlight annotation-highlight--${color}${hasNote ? ' has-note' : ''}`;
        mark.dataset.highlightId = highlightId;
        mark.setAttribute('aria-label', `${colorLabel} highlight: ${text}`);
        mark.setAttribute('tabindex', '0');
        range.surroundContents(mark);
      } catch (_) { /* skip cross-element selections */ }
      return;
    }
  }

  _escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

export default StimuliManager;
