/**
 * AnnotationInventory - Single unified inventory panel
 *
 * FIXED ARCHITECTURE:
 * Previous state: Three competing inventory systems
 *   - DocumentInventory.js (folder-based, hardcoded)
 *   - AnnotationInventory.js (annotations only)
 *   - UIController._renderInventoryPanel (inline, separate button)
 *
 * New state: ONE panel, ONE toggle button, TWO sections:
 *   1. "Documents Collected" — tracks stimuli:shown events, allows re-opening
 *   2. "Your Annotations"   — tracks highlights from AnnotationStore
 *
 * Single source of truth: this class owns _collectedDocs.
 * DocumentInventory.js is deleted entirely.
 * UIController._inventoryDocIds, _inventoryDocData, _renderInventoryPanel removed.
 *
 * Events consumed:
 *   stimuli:shown            — { documentId, documentData } — adds to doc collection
 *   annotation:store-updated — triggers badge + panel refresh
 *
 * Events emitted:
 *   inventory:opened               — {}
 *   inventory:closed               — {}
 *   annotation:deleted             — { documentId, highlightId }
 *   inventory:reopen-document      — { documentId } — UIController re-opens overlay
 */

class AnnotationInventory {
  constructor(annotationStore, eventBus) {
    this.store    = annotationStore;
    this.eventBus = eventBus;

    this._panelOpen = false;
    this._toggleBtn = null;

    // Collected documents: Map<documentId, documentData>
    // Populated by stimuli:shown events — single source of truth
    this._collectedDocs = new Map();

    this._createToggleButton();
    this._bindEvents();
  }

  // ── Toggle button ───────────────────────────────────────────────────────────

  _createToggleButton() {
    const btn = document.createElement('button');
    btn.id = 'annotation-inventory-toggle';
    btn.className = 'inventory-toggle';
    btn.setAttribute('aria-label', 'Open evidence inventory');
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.innerHTML =
      '<span class="inventory-toggle-icon" aria-hidden="true">📋</span>' +
      '<span id="annotation-badge" class="inventory-badge hidden" aria-live="polite" aria-atomic="true"></span>';
    btn.addEventListener('click', () => this._toggle());
    document.body.appendChild(btn);
    this._toggleBtn = btn;
  }

  _updateBadge() {
    const docCount        = this._collectedDocs.size;
    const annotationCount = this.store.getHighlightCount();
    const total           = docCount + annotationCount;

    const badge = document.getElementById('annotation-badge');
    if (!badge) return;

    if (total === 0) {
      badge.classList.add('hidden');
      badge.textContent = '';
    } else {
      badge.classList.remove('hidden');
      badge.textContent = String(total);
    }

    if (this._toggleBtn) {
      const label = this._panelOpen
        ? 'Close evidence inventory'
        : `Open evidence inventory (${docCount} document${docCount !== 1 ? 's' : ''}` +
          (annotationCount > 0 ? `, ${annotationCount} annotation${annotationCount !== 1 ? 's' : ''}` : '') +
          ')';
      this._toggleBtn.setAttribute('aria-label', label);
    }
  }

  // ── Open / Close ────────────────────────────────────────────────────────────

  _toggle() {
    this._panelOpen ? this._close() : this._open();
  }

  _open() {
    this._panelOpen = true;
    this._renderPanel();
    this.eventBus.emit('inventory:opened', {});
  }

  _close() {
    this._panelOpen = false;
    const panel    = document.getElementById('annotation-inventory-panel');
    const backdrop = document.getElementById('annotation-inventory-backdrop');

    if (panel) {
      panel.classList.remove('open');
      panel.addEventListener('transitionend', function handler() {
        panel.remove();
        panel.removeEventListener('transitionend', handler);
      });
    }
    if (backdrop) backdrop.remove();

    this.eventBus.emit('inventory:closed', {});
    if (this._toggleBtn) this._toggleBtn.focus();
    this._updateBadge();
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  _renderPanel() {
    document.getElementById('annotation-inventory-panel')?.remove();
    document.getElementById('annotation-inventory-backdrop')?.remove();

    // Backdrop (mobile tap-to-close)
    const backdrop = document.createElement('div');
    backdrop.id = 'annotation-inventory-backdrop';
    backdrop.className = 'inventory-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    backdrop.addEventListener('click', () => this._close());
    document.body.appendChild(backdrop);

    const panel = document.createElement('div');
    panel.id = 'annotation-inventory-panel';
    panel.className = 'annotation-inventory-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'annotation-inventory-heading');
    panel.innerHTML = this._buildPanelHTML();
    document.body.appendChild(panel);

    requestAnimationFrame(() => panel.classList.add('open'));

    this._attachPanelListeners(panel);
    this._trapFocus(panel);
  }

  // ── Panel HTML ──────────────────────────────────────────────────────────────

  _buildPanelHTML() {
    const docs        = [...this._collectedDocs.values()];
    const annotations = this.store.getAllDocuments();

    return `
      <div class="inventory-header">
        <h3 id="annotation-inventory-heading" class="inventory-heading">Evidence Inventory</h3>
        <button class="inventory-close-btn" aria-label="Close evidence inventory">✕</button>
      </div>
      <div class="inventory-body">
        ${this._buildDocumentsSection(docs)}
        ${this._buildAnnotationsSection(annotations)}
      </div>
    `;
  }

  // ── Section: Collected Documents ────────────────────────────────────────────

  _buildDocumentsSection(docs) {
    const heading = `
      <div class="inventory-section-heading">
        <span class="inventory-section-icon" aria-hidden="true">📄</span>
        <h4 class="inventory-section-title">Documents Collected</h4>
        <span class="inventory-section-count">${docs.length}</span>
      </div>
    `;

    if (docs.length === 0) {
      return `
        <section class="inventory-section inventory-section--docs" aria-label="Collected documents">
          ${heading}
          <p class="inventory-empty-state">
            Primary source documents will appear here as you encounter them.
          </p>
        </section>
      `;
    }

    const docsHTML = docs.map(doc => this._buildDocRow(doc)).join('');

    return `
      <section class="inventory-section inventory-section--docs" aria-label="Collected documents">
        ${heading}
        <ul class="inventory-doc-list" role="list">
          ${docsHTML}
        </ul>
      </section>
    `;
  }

  _buildDocRow(doc) {
    const docId     = doc.id || doc.documentId || '';
    const title     = doc.title || 'Untitled Document';
    const source    = doc.source || '';
    const date      = doc.date   || '';
    const spiceStr  = Array.isArray(doc.spiceT) ? doc.spiceT.join(' · ') : '';
    const hasAnnotations = this.store.getDocument(docId)?.highlights.length > 0;

    return `
      <li class="inventory-doc-row" role="listitem" data-doc-id="${this._esc(docId)}">
        <div class="inventory-doc-info">
          <span class="inventory-doc-title">${this._esc(title)}</span>
          <span class="inventory-doc-meta">
            ${this._esc(source)}${date ? ' — ' + this._esc(date) : ''}
          </span>
          ${spiceStr ? `<span class="inventory-doc-spice">${this._esc(spiceStr)}</span>` : ''}
          ${hasAnnotations ? '<span class="inventory-doc-annotated-flag" aria-label="Contains your annotations">✎</span>' : ''}
        </div>
        <button
          class="inventory-reopen-btn"
          data-doc-id="${this._esc(docId)}"
          aria-label="Re-open ${this._esc(title)}">
          Review ↗
        </button>
      </li>
    `;
  }

  // ── Section: Annotations ────────────────────────────────────────────────────

  _buildAnnotationsSection(annotatedDocs) {
    const totalHighlights = this.store.getHighlightCount();

    const heading = `
      <div class="inventory-section-heading">
        <span class="inventory-section-icon" aria-hidden="true">✎</span>
        <h4 class="inventory-section-title">Your Annotations</h4>
        <span class="inventory-section-count">${totalHighlights}</span>
      </div>
    `;

    if (totalHighlights === 0) {
      return `
        <section class="inventory-section inventory-section--annotations" aria-label="Your annotations">
          ${heading}
          <p class="inventory-empty-state">
            Highlight text in any document to build your annotation record.
          </p>
        </section>
      `;
    }

    const annotationsHTML = annotatedDocs.map(doc => this._buildAnnotationDocGroup(doc)).join('');

    return `
      <section class="inventory-section inventory-section--annotations" aria-label="Your annotations">
        ${heading}
        ${annotationsHTML}
      </section>
    `;
  }

  _buildAnnotationDocGroup(doc) {
    const highlightsHTML = doc.highlights.map(h => this._buildHighlightRow(doc.documentId, h)).join('');
    return `
      <div class="inventory-annotation-group" data-doc-id="${this._esc(doc.documentId)}">
        <h5 class="inventory-annotation-group-title">${this._truncate(this._esc(doc.documentTitle), 60)}</h5>
        <p class="inventory-doc-source">${this._esc(doc.documentSource)}</p>
        <ul class="inventory-highlights-list" role="list">
          ${highlightsHTML}
        </ul>
      </div>
    `;
  }

  _buildHighlightRow(documentId, h) {
    const apTag   = h.apConcept
      ? `<span class="ap-theme-badge">${this._esc(h.apConcept)}</span>`
      : '';
    const noteHTML = h.note
      ? `<p class="inventory-highlight-note">${this._esc(h.note)}</p>`
      : '';

    return `
      <li class="inventory-highlight-row"
          data-highlight-id="${h.id}"
          data-doc-id="${this._esc(documentId)}"
          role="listitem">
        <span class="annotation-dot annotation-dot--${h.color}"
              aria-label="${h.colorLabel} highlight"></span>
        <div class="inventory-highlight-content">
          <p class="inventory-highlight-quote">
            &ldquo;${this._truncate(this._esc(h.text), 80)}&rdquo;
          </p>
          ${apTag}
          ${noteHTML}
        </div>
        <div class="inventory-highlight-actions">
          <button class="inventory-edit-btn"
                  data-highlight-id="${h.id}"
                  data-doc-id="${this._esc(documentId)}"
                  aria-label="Edit annotation">Edit</button>
          <button class="inventory-delete-btn"
                  data-highlight-id="${h.id}"
                  data-doc-id="${this._esc(documentId)}"
                  aria-label="Delete annotation">Delete</button>
        </div>
      </li>
    `;
  }

  // ── Panel event listeners ───────────────────────────────────────────────────

  _attachPanelListeners(panel) {
    // Close button
    panel.querySelector('.inventory-close-btn')
      ?.addEventListener('click', () => this._close());

    // Escape key
    panel.addEventListener('keydown', e => {
      if (e.key === 'Escape') this._close();
    });

    // Re-open document buttons
    panel.querySelectorAll('.inventory-reopen-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const docId = btn.dataset.docId;
        this._close();
        this.eventBus.emit('inventory:reopen-document', { documentId: docId });
      });
    });

    // Edit annotation
    panel.querySelectorAll('.inventory-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this._openInlineEditor(panel, btn.dataset.docId, btn.dataset.highlightId);
      });
    });

    // Delete annotation
    panel.querySelectorAll('.inventory-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this._confirmDelete(panel, btn.dataset.docId, btn.dataset.highlightId, btn);
      });
    });
  }

  // ── Inline editor ───────────────────────────────────────────────────────────

  _openInlineEditor(panel, documentId, highlightId) {
    panel.querySelector('.inventory-inline-editor')?.remove();

    const doc       = this.store.getDocument(documentId);
    const highlight = doc?.highlights.find(h => h.id === highlightId);
    if (!highlight) return;

    const row = panel.querySelector(`[data-highlight-id="${highlightId}"]`);
    if (!row) return;

    const editor = document.createElement('div');
    editor.className = 'inventory-inline-editor';

    const textarea = document.createElement('textarea');
    textarea.className = 'annotation-note-input';
    textarea.maxLength = 300;
    textarea.rows = 3;
    textarea.placeholder = 'What does this tell you? How does it connect to the historical argument?';
    textarea.value = highlight.note || '';

    const select = document.createElement('select');
    select.className = 'annotation-concept-select';
    select.setAttribute('aria-label', 'AP concept');
    ['', 'Causation', 'Continuity', 'Comparison', 'Contextualization', 'Complexity'].forEach(val => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = val || 'None';
      select.appendChild(opt);
    });
    if (highlight.apConcept) select.value = highlight.apConcept;

    const actions  = document.createElement('div');
    actions.className = 'inventory-editor-actions';

    const saveBtn   = document.createElement('button');
    saveBtn.className = 'inventory-editor-save';
    saveBtn.textContent = 'Save';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'inventory-editor-cancel';
    cancelBtn.textContent = 'Cancel';

    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);
    editor.appendChild(textarea);
    editor.appendChild(select);
    editor.appendChild(actions);
    row.after(editor);
    textarea.focus();

    saveBtn.addEventListener('click', () => {
      this.store.updateHighlight(documentId, highlightId, {
        note: textarea.value.trim(),
        apConcept: select.value || null
      });
      editor.remove();
      this._refreshPanelBody(panel);
      this.eventBus.emit('annotation:store-updated', {});
    });

    cancelBtn.addEventListener('click', () => editor.remove());
  }

  // ── Delete confirm ──────────────────────────────────────────────────────────

  _confirmDelete(panel, documentId, highlightId, triggerBtn) {
    panel.querySelector('.inventory-delete-confirm')?.remove();

    const confirm = document.createElement('div');
    confirm.className = 'inventory-delete-confirm';
    confirm.setAttribute('role', 'status');
    confirm.setAttribute('aria-live', 'polite');

    const label  = document.createElement('span');
    label.textContent = 'Remove this annotation?';

    const yesBtn = document.createElement('button');
    yesBtn.className = 'confirm-yes';
    yesBtn.setAttribute('aria-label', 'Yes, remove annotation');
    yesBtn.textContent = 'Yes';

    const noBtn  = document.createElement('button');
    noBtn.className = 'confirm-no';
    noBtn.setAttribute('aria-label', 'No, keep annotation');
    noBtn.textContent = 'No';

    confirm.appendChild(label);
    confirm.appendChild(yesBtn);
    confirm.appendChild(noBtn);
    triggerBtn.after(confirm);

    yesBtn.addEventListener('click', () => {
      this.store.deleteHighlight(documentId, highlightId);
      this.eventBus.emit('annotation:deleted', { documentId, highlightId });
      this._updateBadge();
      this._refreshPanelBody(panel);
    });

    noBtn.addEventListener('click', () => confirm.remove());
  }

  // ── Panel refresh ───────────────────────────────────────────────────────────

  _refreshPanelBody(panel) {
    const body = panel.querySelector('.inventory-body');
    if (!body) return;

    const docs        = [...this._collectedDocs.values()];
    const annotations = this.store.getAllDocuments();

    body.innerHTML = `
      ${this._buildDocumentsSection(docs)}
      ${this._buildAnnotationsSection(annotations)}
    `;

    this._attachPanelListeners(panel);
  }

  // ── EventBus bindings ───────────────────────────────────────────────────────

  _bindEvents() {
    // Track collected documents
    this.eventBus.on('stimuli:shown', (data) => {
      if (data?.documentId && data?.documentData) {
        this._collectedDocs.set(data.documentId, data.documentData);
        this._updateBadge();
        if (this._panelOpen) {
          const panel = document.getElementById('annotation-inventory-panel');
          if (panel) this._refreshPanelBody(panel);
        }
      }
    });

    // Refresh on annotation changes
    this.eventBus.on('annotation:store-updated', () => {
      this._updateBadge();
      if (this._panelOpen) {
        const panel = document.getElementById('annotation-inventory-panel');
        if (panel) this._refreshPanelBody(panel);
      }
    });
  }

  // ── Focus trap ──────────────────────────────────────────────────────────────

  _trapFocus(panel) {
    const focusable = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const getEls = () => [...panel.querySelectorAll(focusable)].filter(el => !el.disabled);

    panel.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const els = getEls();
      if (!els.length) return;
      const first = els[0];
      const last  = els[els.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    });

    const els = getEls();
    if (els.length) els[0].focus();
  }

  // ── Utilities ───────────────────────────────────────────────────────────────

  _truncate(str, max) {
    if (!str) return '';
    return str.length > max ? str.slice(0, max) + '…' : str;
  }

  _esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
 
  /**
   * Called by main.js inventory:reopen-document handler.
   * @param {string} documentId
   * @returns {Object|undefined} documentData
   */
  getCollectedDoc(documentId) {
    return this._collectedDocs.get(documentId);
  }
}
 
export default AnnotationInventory;
 
