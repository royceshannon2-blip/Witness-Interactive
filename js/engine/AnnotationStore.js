/**
 * AnnotationStore — Session-scoped annotation data store
 *
 * Single source of truth for all student highlight and note data.
 * Pure data store — no EventBus dependency, no DOM access.
 * All data lives in memory for the session only (no localStorage).
 *
 * Data structure:
 * {
 *   [documentId]: {
 *     documentTitle: string,
 *     documentSource: string,
 *     highlights: [
 *       {
 *         id: string,           // 'highlight_<timestamp>_<random>'
 *         text: string,         // selected text
 *         color: 'yellow' | 'blue' | 'pink',
 *         colorLabel: 'Evidence' | 'Context' | 'Perspective',
 *         apConcept: string | null,
 *         note: string,         // may be empty string
 *         createdAt: number     // Date.now()
 *       }
 *     ]
 *   }
 * }
 */

class AnnotationStore {
  constructor() {
    /** @type {Object.<string, {documentTitle: string, documentSource: string, highlights: Array}>} */
    this.data = this._loadFromStorage() || {};
  }

  _loadFromStorage() {
    try {
      const saved = localStorage.getItem('witness_annotations');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('AnnotationStore: failed to load from localStorage', e);
      return null;
    }
  }

  _saveToStorage() {
    try {
      localStorage.setItem('witness_annotations', JSON.stringify(this.data));
    } catch (e) {
      console.warn('AnnotationStore: failed to save to localStorage', e);
    }
  }

  /**
   * Add a new highlight to a document.
   * Creates the document entry if it doesn't exist.
   * @param {string} documentId
   * @param {string} documentTitle
   * @param {string} documentSource
   * @param {{id: string, text: string, color: string, colorLabel: string, apConcept: string|null, note: string, createdAt: number}} highlight
   */
  addHighlight(documentId, documentTitle, documentSource, highlight) {
    const VALID_COLORS = { yellow: 'Evidence', blue: 'Context', pink: 'Perspective' };
    if (!VALID_COLORS[highlight.color]) {
      console.error(`AnnotationStore: invalid color "${highlight.color}" — must be yellow, blue, or pink`);
      return;
    }
    if (!this.data[documentId]) {
      this.data[documentId] = {
        documentTitle,
        documentSource,
        highlights: []
      };
    }
    this.data[documentId].highlights.push(highlight);
    this._saveToStorage();
  }

  /**
   * Update an existing highlight's note and/or apConcept.
   * @param {string} documentId
   * @param {string} highlightId
   * @param {{note?: string, apConcept?: string|null}} changes
   */
  updateHighlight(documentId, highlightId, changes) {
    const doc = this.data[documentId];
    if (!doc) return;
    const highlight = doc.highlights.find(h => h.id === highlightId);
    if (!highlight) return;
    Object.assign(highlight, changes);
    this._saveToStorage();
  }

  /**
   * Delete a highlight by ID.
   * @param {string} documentId
   * @param {string} highlightId
   */
  deleteHighlight(documentId, highlightId) {
    const doc = this.data[documentId];
    if (!doc) return;
    doc.highlights = doc.highlights.filter(h => h.id !== highlightId);
    // Clean up empty document entries
    if (doc.highlights.length === 0) {
      delete this.data[documentId];
    }
    this._saveToStorage();
  }

  /**
   * Get all data for a single document.
   * @param {string} documentId
   * @returns {{documentTitle: string, documentSource: string, highlights: Array} | null}
   */
  getDocument(documentId) {
    return this.data[documentId] || null;
  }

  /**
   * Get all annotated documents as an array.
   * @returns {Array<{documentId: string, documentTitle: string, documentSource: string, highlights: Array}>}
   */
  getAllDocuments() {
    return Object.entries(this.data).map(([documentId, doc]) => ({
      documentId,
      ...doc
    }));
  }

  /**
   * Total number of highlights across all documents.
   * @returns {number}
   */
  getHighlightCount() {
    return Object.values(this.data).reduce((sum, doc) => sum + doc.highlights.length, 0);
  }

  /**
   * Clear all annotation data (e.g., on new game).
   */
  clear() {
    this.data = {};
    localStorage.removeItem('witness_annotations');
  }
}

export default AnnotationStore;
