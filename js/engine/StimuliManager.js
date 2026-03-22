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

class StimuliManager {
  /**
   * @param {EventBus} eventBus
   */
  constructor(eventBus) {
    this.eventBus = eventBus;

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

    // Subscribe to events
    this.eventBus.on('scene:transition', (data) => this.handleSceneTransition(data));
    this.eventBus.on('stimuli:answer-submitted', (data) => this._handleAnswerSubmitted(data));
    this.eventBus.on('stimuli:dismiss-requested', (data) => this._handleDismissRequested(data));
    // Briefing pages can also unlock stimulus documents (Haymarket Phase 1)
    this.eventBus.on('briefing:stimuli-unlock', (data) => this._handleBriefingUnlock(data));
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
}

// ES6 module export — no global variables
export default StimuliManager;
