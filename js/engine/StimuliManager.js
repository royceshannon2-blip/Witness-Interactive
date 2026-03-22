/**
 * StimuliManager — Primary Source Document Display Engine
 *
 * FIXED ARCHITECTURE:
 *
 * Previous bugs:
 *   1. Documents appeared simultaneously with narrative (no typewriter gate)
 *   2. Pause question mounted via broken scroll detection (fired after 600ms regardless)
 *   3. Archive-to-dismiss race condition silently killed queue advancement
 *   4. StimuliRevealAnimator queried .stimuli-content after UIController painted it —
 *      timing race caused silent animation skips
 *
 * New flow:
 *   scene:transition fires
 *     → pending doc IDs stored, NOT shown yet
 *     → typewriter:complete fires (player has read narrative)
 *       → "View Document" button appears in scene choices area
 *         → player clicks button
 *           → stimuli:dom-ready emitted AFTER overlay is painted (requestAnimationFrame)
 *             → StimuliRevealAnimator receives element reference directly
 *               → player reads document
 *                 → "I've read this" button appears
 *                   → PauseQuestionModal mounts
 *                     → player answers
 *                       → dismiss button appears
 *                         → player clicks dismiss
 *                           → state committed synchronously
 *                             → archive animation plays (cosmetic only)
 *                               → queue advances to next doc
 *
 * Events consumed:
 *   scene:transition          — stores pending doc IDs
 *   typewriter:complete       — triggers "View Document" button
 *   stimuli:answer-submitted  — { documentId, selectedId, correct }
 *   stimuli:dismiss-requested — { documentId }
 *   stimuli:archive-complete  — DOM cleanup only (no queue logic)
 *
 * Events emitted:
 *   stimuli:view-ready        — { documentId } — "View Document" button should appear
 *   stimuli:dom-ready         — { documentId, overlayEl, contentEl } — animator hook
 *   stimuli:shown             — { documentId, documentData } — inventory hook
 *   stimuli:pause-question-answered — { documentId, correct, selectedId }
 *   stimuli:dismissed         — { documentId, answeredCorrectly }
 *   stimuli:archive-requested — { documentId } — triggers StimuliArchiveAnimator
 */

import { getDocument } from '../content/missions/haymarket/stimulus-documents.js';
import DocAnnotationLayer from './DocAnnotationLayer.js';
import StimuliArchiveAnimator from './StimuliArchiveAnimator.js';

class StimuliManager {
  /**
   * @param {EventBus} eventBus
   * @param {AnnotationStore} [annotationStore]
   */
  constructor(eventBus, annotationStore = null) {
    this.eventBus = eventBus;
    this.annotationStore = annotationStore;

    // Session-scoped deduplication
    this.shownDocuments = new Set();

    // Queue of document IDs waiting to be shown for the current scene
    this._queue = [];

    // Pending docs waiting for typewriter:complete
    this._pendingQueue = [];
    this._pendingSceneId = null;

    // The document ID currently being displayed (null if none)
    this._currentDocumentId = null;

    // Whether the current document's pause question has been answered
    this._currentAnswered = false;
    this._currentAnsweredCorrectly = false;

    // Whether dismiss is force-allowed (missing pauseQuestion fallback)
    this._forceAllowDismiss = false;

    // Active DocAnnotationLayer instance (one per open overlay)
    this._docAnnotationLayer = null;

    // Archive animator
    this._archiveAnimator = new StimuliArchiveAnimator(eventBus);

    // One-time typewriter listener (stored so we can remove it on scene change)
    this._typewriterHandler = null;

    // Subscribe to events
    this.eventBus.on('scene:transition',          (data) => this._handleSceneTransition(data));
    this.eventBus.on('typewriter:complete',        (data) => this._handleTypewriterComplete(data));
    this.eventBus.on('stimuli:answer-submitted',   (data) => this._handleAnswerSubmitted(data));
    this.eventBus.on('stimuli:dismiss-requested',  (data) => this._handleDismissRequested(data));
    this.eventBus.on('stimuli:archive-complete',   (data) => this._handleArchiveComplete(data));

    // Briefing pages can unlock stimulus documents
    this.eventBus.on('briefing:stimuli-unlock',    (data) => this._handleBriefingUnlock(data));
  }

  // ─── Scene transition: store pending, do NOT show yet ───────────────────────

  _handleSceneTransition(data) {
    // Cancel any pending typewriter listener from previous scene
    this._clearTypewriterListener();

    // Reset pending state
    this._pendingQueue = [];
    this._pendingSceneId = null;

    if (!data?.scene) return;

    const unlock = data.scene.stimuliUnlock;
    if (!Array.isArray(unlock) || unlock.length === 0) return;

    // Filter already-shown docs
    const toShow = unlock.filter(id => !this.shownDocuments.has(id));
    if (toShow.length === 0) return;

    // Store pending — wait for typewriter to finish
    this._pendingQueue = toShow;
    this._pendingSceneId = data.scene.id;

    // Register typewriter:complete listener (fires once for this scene)
    this._typewriterHandler = (twData) => {
      if (twData?.sceneId !== this._pendingSceneId) return;
      this._clearTypewriterListener();
      this._queue = [...this._pendingQueue];
      this._pendingQueue = [];
      this._pendingSceneId = null;
      // Signal UIController to show the "View Document" button
      // The first doc ID is passed so UIController can label the button
      if (this._queue.length > 0) {
        this.eventBus.emit('stimuli:view-ready', {
          documentId: this._queue[0],
          count: this._queue.length
        });
      }
    };

    this.eventBus.on('typewriter:complete', this._typewriterHandler);
  }

  _clearTypewriterListener() {
    if (this._typewriterHandler) {
      this.eventBus.off('typewriter:complete', this._typewriterHandler);
      this._typewriterHandler = null;
    }
  }

  // ─── Called by UIController when player clicks "View Document" ───────────────

  /**
   * Called externally by UIController when the player clicks the
   * "View Document" button that appears after typewriter:complete.
   * Kicks off the actual document display pipeline.
   */
  playerRequestedView() {
    this._showNext();
  }

  // ─── Show next document in queue ─────────────────────────────────────────────

  _showNext() {
    if (this._queue.length === 0) return;
    const nextId = this._queue.shift();
    this._showDocument(nextId);
  }

  _showDocument(documentId) {
    if (this.shownDocuments.has(documentId)) {
      // Already shown this session — skip and advance
      this._showNext();
      return;
    }

    this.shownDocuments.add(documentId);
    this._currentDocumentId = documentId;
    this._currentAnswered = false;
    this._currentAnsweredCorrectly = false;
    this._forceAllowDismiss = false;

    const documentData = getDocument(documentId);

    if (!documentData) {
      console.warn(`StimuliManager: No document data for "${documentId}" — skipping`);
      this._forceAllowDismiss = true;
    }

    if (documentData && !documentData.pauseQuestion) {
      this._forceAllowDismiss = true;
    }

    // Emit stimuli:shown so AnnotationInventory can track collected docs
    this.eventBus.emit('stimuli:shown', { documentId, documentData });

    // After UIController paints the overlay, it will emit stimuli:dom-ready
    // with element references. StimuliRevealAnimator listens for that directly.
    // We attach the annotation layer once dom-ready fires.
    if (this.annotationStore && documentData) {
      const domReadyHandler = (domData) => {
        if (domData?.documentId !== documentId) return;
        this.eventBus.off('stimuli:dom-ready', domReadyHandler);
        this._attachAnnotationOverlay(documentData, domData.contentEl);
      };
      this.eventBus.on('stimuli:dom-ready', domReadyHandler);
    }
  }

  // ─── Answer submitted ─────────────────────────────────────────────────────────

  _handleAnswerSubmitted(data) {
    if (!data || data.documentId !== this._currentDocumentId) return;

    this._currentAnswered = true;
    this._currentAnsweredCorrectly = !!data.correct;

    this.eventBus.emit('stimuli:pause-question-answered', {
      documentId: data.documentId,
      correct: !!data.correct,
      selectedId: data.selectedId
    });
  }

  // ─── Dismiss requested ────────────────────────────────────────────────────────

  _handleDismissRequested(data) {
    if (!data || data.documentId !== this._currentDocumentId) return;

    const canDismiss = this._currentAnswered
      || this._forceAllowDismiss
      || !!data.noPauseQuestion;

    if (!canDismiss) return;

    // CRITICAL FIX: Commit all state synchronously BEFORE the async animation.
    // Previous bug: archive animation (800ms async) completed after state was
    // already mutated by the next scene transition, causing silent queue failure.
    const docId = this._currentDocumentId;
    const answeredCorrectly = this._currentAnsweredCorrectly;

    // Clear tracking immediately — re-entrant events cannot corrupt state
    this._currentDocumentId = null;
    this._currentAnswered = false;
    this._currentAnsweredCorrectly = false;
    this._forceAllowDismiss = false;

    // Destroy annotation layer
    if (this._docAnnotationLayer) {
      this._docAnnotationLayer.destroy();
      this._docAnnotationLayer = null;
    }

    // Trigger archive animation (purely cosmetic from this point)
    this.eventBus.emit('stimuli:archive-requested', { documentId: docId });

    // Advance queue and emit dismissed after archive animation completes.
    // 820ms = slightly longer than the 800ms archive animation.
    setTimeout(() => {
      this.eventBus.emit('stimuli:dismissed', { documentId: docId, answeredCorrectly });
      // If more docs in queue, emit view-ready for next one
      if (this._queue.length > 0) {
        this.eventBus.emit('stimuli:view-ready', {
          documentId: this._queue[0],
          count: this._queue.length
        });
      }
    }, 820);
  }

  // ─── Archive complete: DOM cleanup ONLY, no queue logic ──────────────────────

  _handleArchiveComplete(data) {
    // Archive animator has finished the flight animation.
    // Just ensure the overlay DOM is gone. Queue was already advanced above.
    const overlay = document.getElementById('stimuli-overlay');
    if (overlay) overlay.remove();
  }

  // ─── Typewriter complete handler (stored on instance, removed per-scene) ─────

  _handleTypewriterComplete(data) {
    // This is only used as a fallback — the real handler is registered
    // per-scene in _handleSceneTransition via _typewriterHandler.
    // This global listener is intentionally empty.
  }

  // ─── Briefing unlock (same flow as scene unlock, but no typewriter gate) ─────

  _handleBriefingUnlock(data) {
    if (!Array.isArray(data?.documentIds) || data.documentIds.length === 0) return;

    const toShow = data.documentIds.filter(id => !this.shownDocuments.has(id));
    if (toShow.length === 0) return;

    // Briefing docs bypass the typewriter gate — they appear when unlocked
    // because the briefing itself IS the reading experience
    this._queue = [...this._queue, ...toShow];

    if (this._currentDocumentId === null) {
      this.eventBus.emit('stimuli:view-ready', {
        documentId: this._queue[0],
        count: this._queue.length
      });
    }
  }

  // ─── Annotation overlay ───────────────────────────────────────────────────────

  _attachAnnotationOverlay(documentData, contentEl) {
    if (!contentEl) {
      contentEl = document.querySelector('.stimuli-content');
    }
    if (!contentEl) return;

    const textContainer = contentEl.querySelector('.stimuli-text');
    if (!textContainer) return;

    // Mount DocAnnotationLayer (charcoal underline + sticky notes)
    this._docAnnotationLayer = new DocAnnotationLayer(contentEl);
    this._docAnnotationLayer.mount();

    // Restore any existing highlights for this document
    this._restoreHighlights(textContainer, documentData.id);

    // Selection → highlight toolbar
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

    // Click existing highlight → note editor
    textContainer.addEventListener('click', (e) => {
      const mark = e.target.closest('mark.annotation-highlight');
      if (!mark) return;
      const highlightId = mark.dataset.highlightId;
      if (highlightId) this._openNoteEditor(mark, documentData.id, highlightId);
    });
  }

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
    const doc = this.annotationStore?.getDocument(documentId);
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
      } catch (_) { /* skip */ }
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
