/**
 * AnnotationInventory - Persistent slide-out annotation panel
 *
 * Renders a fixed toggle button and a slide-out drawer showing all
 * student highlights grouped by document. Reads from AnnotationStore.
 * Communicates via EventBus for analytics and document re-opening.
 *
 * Events emitted:
 *   inventory:opened          - {}
 *   inventory:closed          - {}
 *   annotation:added          - { documentId, highlightId }
 *   annotation:deleted        - { documentId, highlightId }
 *   inventory:reopen-document - { documentId }
 *
 * Events consumed:
 *   annotation:store-updated  - triggers badge count refresh
 */

class AnnotationInventory {
  constructor(annotationStore, eventBus) {
    this.store = annotationStore;
    this.eventBus = eventBus;
    this._panelOpen = false;
    this._toggleBtn = null;
    this._createToggleButton();
    this._bindEvents();
  }

  _createToggleButton() {
    const btn = document.createElement('button');
    btn.id = 'annotation-inventory-toggle';
    btn.className = 'inventory-toggle';
    btn.setAttribute('aria-label', 'Open source annotations inventory');
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.innerHTML = '<span class="inventory-toggle-icon" aria-hidden="true">\uD83D\uDCCB</span>' +
      '<span id="annotation-badge" class="inventory-badge hidden" aria-live="polite" aria-atomic="true"></span>';
    btn.addEventListener('click', () => this._toggle());
    document.body.appendChild(btn);
    this._toggleBtn = btn;
  }

  _updateBadge() {
    const count = this.store.getHighlightCount();
    const badge = document.getElementById('annotation-badge');
    if (!badge) return;
    if (count === 0) {
      badge.classList.add('hidden');
      badge.textContent = '';
    } else {
      badge.classList.remove('hidden');
      badge.textContent = String(count);
    }
    if (this._toggleBtn) {
      const label = this._panelOpen
        ? 'Close source annotations inventory'
        : ('Open source annotations inventory' + (count > 0 ? ' (' + count + ' annotations)' : ''));
      this._toggleBtn.setAttribute('aria-label', label);
    }
  }

  _toggle() {
    if (this._panelOpen) {
      this._close();
    } else {
      this._open();
    }
  }

  _open() {
    this._panelOpen = true;
    this._renderPanel();
    this.eventBus.emit('inventory:opened', {});
    if (this._toggleBtn) {
      this._toggleBtn.setAttribute('aria-label', 'Close source annotations inventory');
    }
  }

  _close() {
    this._panelOpen = false;
    const panel = document.getElementById('annotation-inventory-panel');
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

  _renderPanel() {
    const stale = document.getElementById('annotation-inventory-panel');
    if (stale) stale.remove();
    const staleBackdrop = document.getElementById('annotation-inventory-backdrop');
    if (staleBackdrop) staleBackdrop.remove();

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

    requestAnimationFrame(function() { panel.classList.add('open'); });

    this._attachPanelListeners(panel);
    this._trapFocus(panel);
  }

  _buildPanelHTML() {
    const docs = this.store.getAllDocuments();
    const emptyState = docs.length === 0
      ? '<p class="inventory-empty-state">Annotate primary sources to build your evidence inventory.</p>'
      : '';
    const docsHTML = docs.map((doc) => this._buildDocSection(doc)).join('');
    return '<div class="inventory-header">' +
      '<h3 id="annotation-inventory-heading" class="inventory-heading">Source Annotations</h3>' +
      '<button class="inventory-close-btn" aria-label="Close annotations panel">\u2715</button>' +
      '</div>' +
      '<div class="inventory-body">' + emptyState + docsHTML + '</div>';
  }

  _buildDocSection(doc) {
    const highlightsHTML = doc.highlights.map((h) => this._buildHighlightRow(doc.documentId, h)).join('');
    return '<section class="inventory-doc-section" data-doc-id="' + doc.documentId + '">' +
      '<h4 class="inventory-doc-title">' + this._truncate(doc.documentTitle, 60) + '</h4>' +
      '<p class="inventory-doc-source">' + this._esc(doc.documentSource) + '</p>' +
      '<ul class="inventory-highlights-list" role="list">' + highlightsHTML + '</ul>' +
      '<button class="inventory-reopen-btn" data-doc-id="' + doc.documentId + '" aria-label="Re-open ' + this._esc(doc.documentTitle) + ' for annotation">Open document</button>' +
      '</section>';
  }

  _buildHighlightRow(documentId, h) {
    const apTag = h.apConcept ? '<span class="ap-theme-badge">' + this._esc(h.apConcept) + '</span>' : '';
    const noteHTML = h.note ? '<p class="inventory-highlight-note">' + this._esc(h.note) + '</p>' : '';
    return '<li class="inventory-highlight-row" data-highlight-id="' + h.id + '" data-doc-id="' + documentId + '" role="listitem">' +
      '<span class="annotation-dot annotation-dot--' + h.color + '" aria-label="' + h.colorLabel + ' highlight"></span>' +
      '<div class="inventory-highlight-content">' +
        '<p class="inventory-highlight-quote">&ldquo;' + this._truncate(this._esc(h.text), 80) + '&rdquo;</p>' +
        apTag + noteHTML +
      '</div>' +
      '<div class="inventory-highlight-actions">' +
        '<button class="inventory-edit-btn" data-highlight-id="' + h.id + '" data-doc-id="' + documentId + '" aria-label="Edit annotation">Edit</button>' +
        '<button class="inventory-delete-btn" data-highlight-id="' + h.id + '" data-doc-id="' + documentId + '" aria-label="Delete annotation">Delete</button>' +
      '</div>' +
      '</li>';
  }

  _attachPanelListeners(panel) {
    const closeBtn = panel.querySelector('.inventory-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this._close());

    panel.querySelectorAll('.inventory-reopen-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const docId = btn.dataset.docId;
        this._close();
        this.eventBus.emit('inventory:reopen-document', { documentId: docId });
      });
    });

    panel.querySelectorAll('.inventory-edit-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this._openInlineEditor(panel, btn.dataset.docId, btn.dataset.highlightId);
      });
    });

    panel.querySelectorAll('.inventory-delete-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this._confirmDelete(panel, btn.dataset.docId, btn.dataset.highlightId, btn);
      });
    });

    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this._close();
    });
  }

  _openInlineEditor(panel, documentId, highlightId) {
    const existing = panel.querySelector('.inventory-inline-editor');
    if (existing) existing.remove();

    const doc = this.store.getDocument(documentId);
    if (!doc) return;
    const highlight = doc.highlights.find((h) => h.id === highlightId);
    if (!highlight) return;

    const row = panel.querySelector('[data-highlight-id="' + highlightId + '"]');
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
    ['', 'Causation', 'Continuity', 'Comparison', 'Contextualization', 'Complexity'].forEach((val) => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = val || 'None';
      select.appendChild(opt);
    });
    if (highlight.apConcept) select.value = highlight.apConcept;

    const actions = document.createElement('div');
    actions.className = 'inventory-editor-actions';

    const saveBtn = document.createElement('button');
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
      const note = textarea.value.trim();
      const apConcept = select.value || null;
      this.store.updateHighlight(documentId, highlightId, { note: note, apConcept: apConcept });
      editor.remove();
      this._refreshPanelBody(panel);
    });

    cancelBtn.addEventListener('click', () => {
      editor.remove();
    });
  }

  _confirmDelete(panel, documentId, highlightId, triggerBtn) {
    const existing = panel.querySelector('.inventory-delete-confirm');
    if (existing) existing.remove();

    const confirm = document.createElement('div');
    confirm.className = 'inventory-delete-confirm';
    confirm.setAttribute('role', 'status');
    confirm.setAttribute('aria-live', 'polite');

    const label = document.createElement('span');
    label.textContent = 'Remove this annotation?';

    const yesBtn = document.createElement('button');
    yesBtn.className = 'confirm-yes';
    yesBtn.setAttribute('aria-label', 'Yes, remove annotation');
    yesBtn.textContent = 'Yes';

    const noBtn = document.createElement('button');
    noBtn.className = 'confirm-no';
    noBtn.setAttribute('aria-label', 'No, keep annotation');
    noBtn.textContent = 'No';

    confirm.appendChild(label);
    confirm.appendChild(yesBtn);
    confirm.appendChild(noBtn);
    triggerBtn.after(confirm);

    yesBtn.addEventListener('click', () => {
      this.store.deleteHighlight(documentId, highlightId);
      this.eventBus.emit('annotation:deleted', { documentId: documentId, highlightId: highlightId });
      this._updateBadge();
      this._refreshPanelBody(panel);
    });

    noBtn.addEventListener('click', () => {
      confirm.remove();
    });
  }

  _refreshPanelBody(panel) {
    const body = panel.querySelector('.inventory-body');
    if (!body) return;
    const docs = this.store.getAllDocuments();
    if (docs.length === 0) {
      body.innerHTML = '<p class="inventory-empty-state">Annotate primary sources to build your evidence inventory.</p>';
    } else {
      body.innerHTML = docs.map((doc) => this._buildDocSection(doc)).join('');
    }
    this._attachPanelListeners(panel);
  }

  _trapFocus(panel) {
    const focusable = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const getFocusable = function() {
      return Array.from(panel.querySelectorAll(focusable)).filter(function(el) { return !el.disabled; });
    };

    panel.addEventListener('keydown', function(e) {
      if (e.key !== 'Tab') return;
      const els = getFocusable();
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    const els = getFocusable();
    if (els.length > 0) els[0].focus();
  }

  _bindEvents() {
    this.eventBus.on('annotation:store-updated', () => {
      this._updateBadge();
      if (this._panelOpen) {
        const panel = document.getElementById('annotation-inventory-panel');
        if (panel) this._refreshPanelBody(panel);
      }
    });
  }

  _truncate(str, max) {
    if (!str) return '';
    return str.length > max ? str.slice(0, max) + '\u2026' : str;
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
}

export default AnnotationInventory;