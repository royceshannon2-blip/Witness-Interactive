/**
 * StimuliManager — Primary Source Document Display Engine
 *
 * Handles real primary source documents that unlock mid-scene.
 * Presents each document as an overlay, followed by an AP pause question.
 * Player must answer the pause question before dismissing.
 *
 * Communicates exclusively via EventBus — no direct DOM access.
 * Tracks shown document IDs in a session-scoped Set to prevent duplicates.
 *
 * Events consumed:
 *   scene:transition          — reads data.scene.stimuliUnlock array
 *   stimuli:answer-submitted  — { documentId, selectedId, correct }
 *   stimuli:dismiss-requested — { documentId, noPauseQuestion? }
 *
 * Events emitted:
 *   stimuli:shown                  — { documentId, documentData }
 *   stimuli:pause-question-answered — { documentId, correct, selectedId }
 *   stimuli:dismissed              — { documentId, answeredCorrectly }
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 23.3, 25.4
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

    // Session-scoped deduplication set (Property 17)
    this.shownDocuments = new Set();

    // Queue of document IDs waiting to be shown for the current scene
    this._queue = [];

    // The document ID currently being displayed (null if none)
    this._currentDocumentId = null;

    // Whether the current document's pause question has been answered
    this._currentAnswered = false;
    this._currentAnsweredCorrectly = false;

    // Whether dismiss is force-allowed (missing pauseQuestion fallback)
    this._forceAllowDismiss = false;

    // Active DocAnnotationLayer instance (one per open overlay)
    this._docAnnotationLayer = null;

    // Archive animator — handles the "fly to filing cabinet" sequence
    this._archiveAnimator = new StimuliArchiveAnimator(eventBus);

    // Subscribe to events
    this.eventBus.on('scene:transition', (data) => this.handleSceneTransition(data));
    this.eventBus.on('stimuli:answer-submitted', (data) => this._handleAnswerSubmitted(data));
    this.eventBus.on('stimuli:dismiss-requested', (data) => this._handleDismissRequested(data));
    // Briefing pages can also unlock stimulus documents (Haymarket Phase 1)
    this.eventBus.on('briefing:stimuli-unlock', (data) => this._handleBriefingUnlock(data));
    // Archive complete — proceed with normal dismiss flow after animation finishes
    this.eventBus.on('stimuli:archive-complete', (data) => this._handleArchiveComplete(data));
  }

  /**
   * Called when a scene:transition event fires.
   * Reads stimuliUnlock from the scene object and queues documents.
   * @param {Object|null|undefined} data — event payload
   */
  handleSceneTransition(data) {
    // Guard: null/undefined payload
    if (!data || !data.scene) return;

    const scene = data.scene;
    const unlock = scene.stimuliUnlock;

    // Guard: absent, null, or empty array — no-op (Requirement 4.8)
    if (!unlock || !Array.isArray(unlock) || unlock.length === 0) return;

    // Reset queue and state for new scene
    this._queue = [];
    this._currentDocumentId = null;
    this._currentAnswered = false;
    this._currentAnsweredCorrectly = false;
    this._forceAllowDismiss = false;

    // Filter out already-shown documents (deduplication, Property 17)
    for (const docId of unlock) {
      if (!this.shownDocuments.has(docId)) {
        this._queue.push(docId);
      }
    }

    // Show the first document in the queue
    this._showNext();
  }

  /**
   * Display a single stimulus document.
   * Marks it as shown in the session Set and emits stimuli:shown.
   * @param {string} documentId
   */
  showDocument(documentId) {
    if (this.shownDocuments.has(documentId)) return; // already shown — skip silently

    this.shownDocuments.add(documentId);
    this._currentDocumentId = documentId;
    this._currentAnswered = false;
    this._currentAnsweredCorrectly = false;
    this._forceAllowDismiss = false;

    const documentData = getDocument(documentId);
    if (!documentData) {
      console.warn(`StimuliManager: No document data found for "${documentId}" — allowing immediate dismissal`);
      this._forceAllowDismiss = true;
    }

    this.eventBus.emit('stimuli:shown', { documentId, documentData });

    // If no pause question on the document, force-allow dismiss
    if (documentData && !documentData.pauseQuestion) {
      console.warn(`StimuliManager: Document "${documentId}" has no pauseQuestion — allowing immediate dismissal`);
      this._forceAllowDismiss = true;
    }

    // Attach annotation highlight system after UIController renders the overlay
    // Small delay ensures the overlay DOM is present before we attach
    if (this.annotationStore && documentData) {
      setTimeout(() => this._attachAnnotationOverlay(documentData), 50);
    }
  }

  /**
   * Show the AP pause question for the current document.
   * (Called externally by UIController after rendering the document text.)
   * @param {Object} pauseQuestion
   */
  showPauseQuestion(pauseQuestion) {
    if (!pauseQuestion) {
      console.warn('StimuliManager: pauseQuestion is missing — allowing immediate dismissal');
      this._forceAllowDismiss = true;
    }
    // Actual rendering is handled by UIController listening to stimuli:shown
  }

  /**
   * Force-allow dismissal for the given document (missing pauseQuestion fallback).
   * @param {string} documentId
   */
  forceAllowDismiss(documentId) {
    if (documentId !== this._currentDocumentId) return;
    this._forceAllowDismiss = true;
  }

  /**
   * Dismiss the current document and advance to the next in queue.
   * Only callable after the pause question has been answered (or force-allowed).
   */
  dismissDocument() {
    if (!this._currentDocumentId) return;
    if (!this._currentAnswered && !this._forceAllowDismiss) return;

    const docId = this._currentDocumentId;
    const answeredCorrectly = this._currentAnsweredCorrectly;

    // Clear current state
    this._currentDocumentId = null;
    this._currentAnswered = false;
    this._currentAnsweredCorrectly = false;
    this._forceAllowDismiss = false;

    this.eventBus.emit('stimuli:dismissed', { documentId: docId, answeredCorrectly });

    // Destroy annotation layer for the dismissed overlay
    if (this._docAnnotationLayer) {
      this._docAnnotationLayer.destroy();
      this._docAnnotationLayer = null;
    }

    // Show next document in queue
    this._showNext();
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  /**
   * Show the next document in the queue, if any.
   * @private
   */
  _showNext() {
    if (this._queue.length === 0) return;
    const nextId = this._queue.shift();
    this.showDocument(nextId);
  }

  /**
   * Handle stimuli:answer-submitted event.
   * @private
   */
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

  /**
   * Handle stimuli:dismiss-requested event.
   * @private
   */
  _handleDismissRequested(data) {
    if (!data || data.documentId !== this._currentDocumentId) return;

    // Allow dismiss if: answered, force-allowed, or noPauseQuestion flag set
    const canDismiss = this._currentAnswered || this._forceAllowDismiss || !!data.noPauseQuestion;
    if (!canDismiss) return;

    // If noPauseQuestion flag, treat as force-allowed
    if (data.noPauseQuestion) {
      this._forceAllowDismiss = true;
    }

    // Route through the archive animator — it emits stimuli:archive-complete
    // when the flight animation finishes, which then calls dismissDocument().
    this.eventBus.emit('stimuli:archive-requested', { documentId: data.documentId });
  }

  /**
   * Handle stimuli:archive-complete — called by StimuliArchiveAnimator after
   * the document-flight animation finishes. Proceeds with the normal dismiss flow.
   * @private
   */
  _handleArchiveComplete(data) {
    if (!data || data.documentId !== this._currentDocumentId) return;
    this.dismissDocument();
  }

  /**
   * Handle briefing:stimuli-unlock event.
   * Queues documents from a briefing page — same deduplication rules apply.
   * @private
   */
  _handleBriefingUnlock(data) {
    if (!data || !Array.isArray(data.documentIds) || data.documentIds.length === 0) return;

    // Reset queue for this briefing page's documents
    this._queue = [];

    for (const docId of data.documentIds) {
      if (!this.shownDocuments.has(docId)) {
        this._queue.push(docId);
      }
    }

    this._showNext();
  }

  // ── Annotation highlight injection ────────────────────────────────────────

  /**
   * Attach text-selection highlight functionality to .stimuli-text inside the overlay.
   * Also mounts the DocAnnotationLayer (charcoal underline + sticky notes).
   * Called after stimuli:shown fires and UIController has rendered the overlay DOM.
   * @param {Object} documentData
   * @private
   */
  _attachAnnotationOverlay(documentData) {
    const overlay = document.getElementById('stimuli-overlay');
    if (!overlay) return;

    const textContainer = overlay.querySelector('.stimuli-text');
    if (!textContainer) return;

    // Mount DocAnnotationLayer (charcoal underline + sticky notes)
    const contentEl = overlay.querySelector('.stimuli-content');
    if (contentEl) {
      this._docAnnotationLayer = new DocAnnotationLayer(contentEl);
      this._docAnnotationLayer.mount();
    }

    // Re-render any existing highlights for this document
    this._restoreHighlights(textContainer, documentData.id);

    // Selection handler
    const onSelectionEnd = (e) => {
      const selection = window.getSelection();
      const selectedText = selection ? selection.toString().trim() : '';
      if (!selectedText) return;

      // Ensure selection is within .stimuli-text
      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      if (!range) return;
      if (!textContainer.contains(range.commonAncestorContainer)) return;

      this._showHighlightToolbar(range, selectedText, documentData);
    };

    textContainer.addEventListener('mouseup', onSelectionEnd);
    textContainer.addEventListener('touchend', onSelectionEnd);

    // Click on existing highlight mark → open note editor
    textContainer.addEventListener('click', (e) => {
      const mark = e.target.closest('mark.annotation-highlight');
      if (!mark) return;
      const highlightId = mark.dataset.highlightId;
      if (highlightId) this._openNoteEditor(mark, documentData.id, highlightId);
    });
  }

  /**
   * Show the floating color-picker toolbar near the current selection.
   * @param {Range} range
   * @param {string} selectedText
   * @param {Object} documentData
   * @private
   */
  _showHighlightToolbar(range, selectedText, documentData) {
    // Remove any existing toolbar
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
      // Default to yellow when adding note directly
      const highlightId = this._applyHighlight(range, selectedText, 'yellow', 'Evidence', documentData);
      if (highlightId) {
        const mark = document.querySelector(`mark[data-highlight-id="${highlightId}"]`);
        if (mark) this._openNoteEditor(mark, documentData.id, highlightId);
      }
    });
    toolbar.appendChild(noteBtn);

    document.body.appendChild(toolbar);

    // Position toolbar above the selection, clamped to viewport
    const top = Math.max(8, rect.top + window.scrollY - toolbar.offsetHeight - 8);
    const left = Math.min(
      window.innerWidth - toolbar.offsetWidth - 8,
      Math.max(8, rect.left + window.scrollX + rect.width / 2 - toolbar.offsetWidth / 2)
    );
    toolbar.style.top = `${top}px`;
    toolbar.style.left = `${left}px`;

    // Dismiss toolbar on outside click
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

  /**
   * Wrap the selected range in a <mark> element and save to AnnotationStore.
   * Returns the new highlight ID, or null on failure.
   * @param {Range} range
   * @param {string} selectedText
   * @param {string} color
   * @param {string} colorLabel
   * @param {Object} documentData
   * @returns {string|null}
   * @private
   */
  _applyHighlight(range, selectedText, color, colorLabel, documentData) {
    try {
      const id = `highlight_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
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

      // Clear browser selection
      window.getSelection()?.removeAllRanges();
      return id;
    } catch (err) {
      // surroundContents fails on cross-element selections — silently ignore
      console.warn('StimuliManager: Could not apply highlight (cross-element selection):', err.message);
      window.getSelection()?.removeAllRanges();
      return null;
    }
  }

  /**
   * Open an inline note editor below the given mark element.
   * @param {HTMLElement} mark
   * @param {string} documentId
   * @param {string} highlightId
   * @private
   */
  _openNoteEditor(mark, documentId, highlightId) {
    // Remove any existing editor
    document.getElementById('annotation-note-editor')?.remove();

    const doc = this.annotationStore.getDocument(documentId);
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
    if (highlight && highlight.apConcept) select.value = highlight.apConcept;

    // Insert after the mark in the DOM
    mark.after(editor);
    editor.querySelector('textarea').focus();

    editor.querySelector('.annotation-save-btn').addEventListener('click', () => {
      const note = editor.querySelector('textarea').value.trim();
      const apConcept = select.value || null;
      this.annotationStore.updateHighlight(documentId, highlightId, { note, apConcept });
      // Update mark visual indicator
      if (note) mark.classList.add('has-note');
      else mark.classList.remove('has-note');
      editor.remove();
      this.eventBus.emit('annotation:store-updated', {});
    });

    editor.querySelector('.annotation-cancel-btn').addEventListener('click', () => {
      editor.remove();
    });
  }

  /**
   * Re-apply highlight marks for a document that was already annotated.
   * Called when the overlay is re-opened from the inventory.
   * NOTE: Because the text is re-rendered as HTML each time, we cannot
   * restore exact DOM ranges. Instead we wrap matching text spans.
   * @param {HTMLElement} textContainer
   * @param {string} documentId
   * @private
   */
  _restoreHighlights(textContainer, documentId) {
    const doc = this.annotationStore ? this.annotationStore.getDocument(documentId) : null;
    if (!doc || doc.highlights.length === 0) return;

    // Walk text nodes and wrap matching text
    doc.highlights.forEach(h => {
      this._wrapTextInContainer(textContainer, h.text, h.color, h.colorLabel, h.id, !!h.note);
    });
  }

  /**
   * Find the first occurrence of `text` in `container`'s text nodes and wrap it.
   * @private
   */
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
      } catch (_) {
        // Skip if range wrapping fails
      }
      return; // Only restore first occurrence
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

// ES6 module export — no global variables
export default StimuliManager;
