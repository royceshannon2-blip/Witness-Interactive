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

    // Docs unlocked in the current scene
    this._newlyUnlockedDocs = [];

    // Docs from previous scenes waiting for their pause questions to be answered
    this._pendingPauseQuestions = [];
    this._pendingSceneId = null;

    // Active DocAnnotationLayer instance (one per open overlay in inventory)
    this._docAnnotationLayer = null;

    // One-time typewriter listener (stored so we can remove it on scene change)
    this._typewriterHandler = null;

    // Subscribe to events
    this.eventBus.on('scene:transition',          (data) => this._handleSceneTransition(data));
    this.eventBus.on('stimuli:answer-submitted',  (data) => this._handleAnswerSubmitted(data));

    // Briefing pages can unlock stimulus documents
    this.eventBus.on('briefing:stimuli-unlock',    (data) => this._handleBriefingUnlock(data));
  }

  // ─── Scene transition: unlock silently, defer pause questions ───────────────────────

  _handleSceneTransition(data) {
    this._clearTypewriterListener();
    this._pendingSceneId = null;

    // Docs unlocked in the last scene now need their pause questions presented
    if (this._newlyUnlockedDocs.length > 0) {
      this._pendingPauseQuestions.push(...this._newlyUnlockedDocs);
      this._newlyUnlockedDocs = [];
    }

    if (!data?.scene) return;
    this._pendingSceneId = data.scene.id;

    const unlock = data.scene.stimuliUnlock;
    if (Array.isArray(unlock) && unlock.length > 0) {
      // Filter already-shown docs
      const toUnlock = unlock.filter(id => !this.shownDocuments.has(id));
      if (toUnlock.length > 0) {
        toUnlock.forEach(id => {
          this.shownDocuments.add(id);
          this._newlyUnlockedDocs.push(id);
          const documentData = getDocument(id);
          if (documentData) {
            // Emit stimuli:shown for AnnotationInventory/IntelInventory to track
            this.eventBus.emit('stimuli:shown', { documentId: id, documentData });
          }
        });
        
        // Notify UI that new intel was acquired silently
        this.eventBus.emit('stimuli:new-unlocked', { documentIds: toUnlock });
      }
    }

    // Register typewriter:complete listener to trigger pause questions from PREVIOUS scenes
    if (this._pendingPauseQuestions.length > 0) {
      this._typewriterHandler = (twData) => {
        if (twData?.sceneId !== this._pendingSceneId) return;
        this._clearTypewriterListener();
        this._pendingSceneId = null;
        this._showNextPauseQuestion();
      };
      this.eventBus.on('typewriter:complete', this._typewriterHandler);
    }
  }

  _clearTypewriterListener() {
    if (this._typewriterHandler) {
      this.eventBus.off('typewriter:complete', this._typewriterHandler);
      this._typewriterHandler = null;
    }
  }

  // ─── Pause Questions ─────────────────────────────────────────────────────────

  _showNextPauseQuestion() {
    if (this._pendingPauseQuestions.length === 0) {
      // All pause questions answered for this scene
      this.eventBus.emit('stimuli:all-pause-questions-complete', {});
      return;
    }

    const docId = this._pendingPauseQuestions.shift();
    const documentData = getDocument(docId);

    if (documentData && documentData.pauseQuestion) {
      // Tell UIController to render the PauseQuestionModal
      this.eventBus.emit('stimuli:present-pause-question', {
        documentId: docId,
        documentData: documentData
      });
    } else {
      // No pause question for this document, skip to next
      this._showNextPauseQuestion();
    }
  }

  _handleAnswerSubmitted(data) {
    // When UIController's modal is submitted and closed, it emits this.
    // We can show the next one.
    // Small timeout to allow modal transitions
    setTimeout(() => {
      this._showNextPauseQuestion();
    }, 400);
  }

  // ─── Briefing unlock ─────────────────────────────────────────────────────────

  _handleBriefingUnlock(data) {
    if (!Array.isArray(data?.documentIds) || data.documentIds.length === 0) return;

    const toUnlock = data.documentIds.filter(id => !this.shownDocuments.has(id));
    if (toUnlock.length === 0) return;

    toUnlock.forEach(id => {
      this.shownDocuments.add(id);
      this._newlyUnlockedDocs.push(id);
      const documentData = getDocument(id);
      if (documentData) {
        this.eventBus.emit('stimuli:shown', { documentId: id, documentData });
      }
    });

    this.eventBus.emit('stimuli:new-unlocked', { documentIds: toUnlock });
  }

  // ─── Annotation overlay (Called externally by IntelInventory) ────────────────

  attachAnnotationOverlay(documentData, contentEl) {
    if (!contentEl) return;

    // Destroy previous layer if exists
    if (this._docAnnotationLayer) {
      this._docAnnotationLayer.destroy();
      this._docAnnotationLayer = null;
    }

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

  detachAnnotationOverlay() {
    if (this._docAnnotationLayer) {
      this._docAnnotationLayer.destroy();
      this._docAnnotationLayer = null;
    }
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
