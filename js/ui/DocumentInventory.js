/**
 * DocumentInventory — Desk Drawer Document Browser
 *
 * Renders as a top-down view of a wooden desk drawer with file folders
 * organized by scene/date. Each folder reveals document thumbnail cards.
 * Locked documents show as blank manila cards with a ? stamp.
 *
 * Role-specific: if hm_lp_movement_trust >= 3, Lucy Parsons documents
 * show handwritten margin notes as ::after pseudo-elements.
 *
 * Events consumed:
 *   stimuli:shown      — { documentId } — marks document as unlocked
 *   stimuli:dismissed  — { documentId } — (no-op, already tracked)
 *
 * Events emitted:
 *   inventory:drawer-opened   — {}
 *   inventory:drawer-closed   — {}
 *   inventory:doc-selected    — { documentId }
 *
 * Architecture: UI layer — communicates via EventBus only.
 */

// Folder definitions: each folder groups documents by scene/date context.
// Labels match the Haymarket scene map from the steering file.
const FOLDERS = [
  {
    id: 'folder-briefing',
    label: 'BRIEFING — CHICAGO 1886',
    date: 'Pre-May 1886',
    documentIds: ['hm-doc-0', 'hm-doc-1b']
  },
  {
    id: 'folder-april',
    label: 'APRIL — McCORMICK',
    date: 'April 1886',
    documentIds: ['hm-doc-1a']
  },
  {
    id: 'folder-may3',
    label: 'MAY 3RD — THE SHOOTING',
    date: 'May 3, 1886',
    documentIds: ['hm-doc-2', 'hm-doc-3']
  },
  {
    id: 'folder-may4',
    label: 'MAY 4TH — HAYMARKET',
    date: 'May 4, 1886',
    documentIds: []
  },
  {
    id: 'folder-aftermath',
    label: 'AFTERMATH — TRIAL & PARDON',
    date: 'August 1886 – June 1893',
    documentIds: ['hm-doc-4', 'hm-doc-5']
  }
];

// Human-readable short titles for thumbnail cards (keyed by doc ID)
const DOC_SHORT_TITLES = {
  'hm-doc-0': 'Hayes Troop Order\n1877',
  'hm-doc-1a': 'Arbeiter-Zeitung\nMay 1886',
  'hm-doc-1b': 'BLS Wage Data\n1880s',
  'hm-doc-2': "Harper's Weekly\nMay 15, 1886",
  'hm-doc-3': 'Revenge Circular\nMay 3, 1886',
  'hm-doc-4': 'Chicago Tribune\nMay 5, 1886',
  'hm-doc-5': "Altgeld's Pardon\nJune 1893"
};

// Margin notes shown on Lucy Parsons docs when hm_lp_movement_trust >= 3
const LP_MARGIN_NOTES = {
  'hm-doc-0': 'They used soldiers against us before.',
  'hm-doc-1a': 'Albert read this aloud at the hall.',
  'hm-doc-1b': 'Twelve hours. Six days. For $1.50.',
  'hm-doc-2': 'They called us foreign. We were born here.',
  'hm-doc-3': 'August wrote this in grief, not malice.',
  'hm-doc-4': 'Medill wanted us hanged before the trial began.',
  'hm-doc-5': 'Altgeld knew it would end him. He signed anyway.'
};

class DocumentInventory {
  /**
   * @param {EventBus} eventBus
   * @param {ConsequenceSystem} consequenceSystem
   * @param {string} [roleId] — current role ID, e.g. 'hm-lucy-parsons'
   */
  constructor(eventBus, consequenceSystem, roleId = '') {
    this.eventBus = eventBus;
    this.consequenceSystem = consequenceSystem;
    this.roleId = roleId;

    /** @type {Set<string>} document IDs that have been unlocked this session */
    this.unlockedDocs = new Set();

    /** @type {string|null} currently open folder ID */
    this._openFolderId = null;

    /** @type {boolean} */
    this._drawerOpen = false;

    this._triggerBtn = null;

    this._createTriggerButton();
    this._bindEvents();
  }

  // ── Trigger button ──────────────────────────────────────────────────────────

  _createTriggerButton() {
    const btn = document.createElement('button');
    btn.id = 'doc-inventory-trigger';
    btn.className = 'doc-inventory-trigger';
    btn.setAttribute('aria-label', 'Open document inventory');
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.textContent = 'Open Inventory';
    btn.addEventListener('click', () => this._toggle());
    document.body.appendChild(btn);
    this._triggerBtn = btn;
  }

  // ── Open / close ────────────────────────────────────────────────────────────

  _toggle() {
    this._drawerOpen ? this._close() : this._open();
  }

  _open() {
    this._drawerOpen = true;
    this._render();
    this.eventBus.emit('inventory:drawer-opened', {});
    this._triggerBtn?.setAttribute('aria-label', 'Close document inventory');
    this._triggerBtn?.setAttribute('aria-expanded', 'true');
  }

  _close() {
    this._drawerOpen = false;
    const overlay = document.getElementById('doc-inventory-overlay');
    if (overlay) {
      overlay.classList.remove('open');
      overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
    }
    this.eventBus.emit('inventory:drawer-closed', {});
    this._triggerBtn?.setAttribute('aria-label', 'Open document inventory');
    this._triggerBtn?.setAttribute('aria-expanded', 'false');
    this._triggerBtn?.focus();
  }

  // ── Rendering ───────────────────────────────────────────────────────────────

  _render() {
    document.getElementById('doc-inventory-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'doc-inventory-overlay';
    overlay.className = 'doc-inventory-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'doc-inventory-heading');

    overlay.innerHTML = this._buildHTML();
    document.body.appendChild(overlay);

    requestAnimationFrame(() => overlay.classList.add('open'));

    this._attachListeners(overlay);
    this._trapFocus(overlay);
  }

  _buildHTML() {
    const lpTrust = this._getLPTrust();
    const showMarginNotes = this.roleId === 'hm-lucy-parsons' && lpTrust >= 3;

    const foldersHTML = FOLDERS.map(folder => this._buildFolder(folder, showMarginNotes)).join('');

    return `
      <div class="doc-inventory-drawer" role="document">
        <div class="doc-inventory-header">
          <h2 id="doc-inventory-heading" class="doc-inventory-title">Evidence Drawer</h2>
          <button class="doc-inventory-close" aria-label="Close document inventory">&#x2715;</button>
        </div>
        <div class="doc-inventory-desk">
          <div class="doc-inventory-folders" role="list" aria-label="Document folders">
            ${foldersHTML}
          </div>
          <div class="doc-inventory-cards-area" id="doc-inventory-cards" aria-live="polite" aria-label="Documents in selected folder">
            <p class="doc-inventory-hint">Select a folder to view documents.</p>
          </div>
        </div>
      </div>
    `;
  }

  _buildFolder(folder, showMarginNotes) {
    const isOpen = this._openFolderId === folder.id;
    const unlockedCount = folder.documentIds.filter(id => this.unlockedDocs.has(id)).length;
    const totalCount = folder.documentIds.length;
    const hasAny = totalCount > 0;

    return `
      <div class="doc-folder ${isOpen ? 'doc-folder--open' : ''} ${!hasAny ? 'doc-folder--empty' : ''}"
           role="listitem"
           data-folder-id="${folder.id}">
        <button class="doc-folder-tab"
                aria-expanded="${isOpen}"
                aria-controls="folder-cards-${folder.id}"
                aria-label="${folder.label}${hasAny ? `, ${unlockedCount} of ${totalCount} documents unlocked` : ', no documents'}">
          <span class="doc-folder-label">${folder.label}</span>
          <span class="doc-folder-date">${folder.date}</span>
          ${hasAny ? `<span class="doc-folder-count" aria-hidden="true">${unlockedCount}/${totalCount}</span>` : ''}
        </button>
      </div>
    `;
  }

  _buildCards(folder, showMarginNotes) {
    if (folder.documentIds.length === 0) {
      return `<p class="doc-inventory-hint">No documents filed here yet.</p>`;
    }

    const cards = folder.documentIds.map(docId => {
      const unlocked = this.unlockedDocs.has(docId);
      const shortTitle = DOC_SHORT_TITLES[docId] || docId;
      const marginNote = showMarginNotes && LP_MARGIN_NOTES[docId] ? LP_MARGIN_NOTES[docId] : null;

      if (!unlocked) {
        return `
          <div class="doc-card doc-card--locked"
               aria-label="Locked document"
               role="img">
            <span class="doc-card-stamp" aria-hidden="true">?</span>
          </div>
        `;
      }

      return `
        <button class="doc-card doc-card--unlocked ${marginNote ? 'doc-card--annotated' : ''}"
                data-doc-id="${docId}"
                aria-label="Open document: ${shortTitle.replace('\n', ' ')}"
                ${marginNote ? `data-margin-note="${this._escapeAttr(marginNote)}"` : ''}>
          <span class="doc-card-title">${this._escapeHTML(shortTitle).replace('\n', '<br>')}</span>
          ${marginNote ? `<span class="doc-card-margin-note" aria-hidden="true">${this._escapeHTML(marginNote)}</span>` : ''}
        </button>
      `;
    }).join('');

    return `<div class="doc-cards-grid" id="folder-cards-${folder.id}" role="list">${cards}</div>`;
  }

  // ── Event listeners ─────────────────────────────────────────────────────────

  _attachListeners(overlay) {
    // Close button
    overlay.querySelector('.doc-inventory-close')?.addEventListener('click', () => this._close());

    // Escape key
    overlay.addEventListener('keydown', e => {
      if (e.key === 'Escape') this._close();
    });

    // Click outside drawer
    overlay.addEventListener('click', e => {
      if (e.target === overlay) this._close();
    });

    // Folder tab clicks
    overlay.querySelectorAll('.doc-folder-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const folderId = btn.closest('.doc-folder').dataset.folderId;
        this._selectFolder(folderId, overlay);
      });
    });

    // Document card clicks
    overlay.addEventListener('click', e => {
      const card = e.target.closest('.doc-card--unlocked');
      if (!card) return;
      const docId = card.dataset.docId;
      if (docId) {
        this.eventBus.emit('inventory:doc-selected', { documentId: docId });
        this._close();
      }
    });
  }

  _selectFolder(folderId, overlay) {
    this._openFolderId = this._openFolderId === folderId ? null : folderId;

    const lpTrust = this._getLPTrust();
    const showMarginNotes = this.roleId === 'hm-lucy-parsons' && lpTrust >= 3;

    // Update folder tab states
    overlay.querySelectorAll('.doc-folder').forEach(el => {
      const isOpen = el.dataset.folderId === this._openFolderId;
      el.classList.toggle('doc-folder--open', isOpen);
      el.querySelector('.doc-folder-tab')?.setAttribute('aria-expanded', String(isOpen));
    });

    // Update cards area
    const cardsArea = overlay.querySelector('#doc-inventory-cards');
    if (!cardsArea) return;

    if (!this._openFolderId) {
      cardsArea.innerHTML = `<p class="doc-inventory-hint">Select a folder to view documents.</p>`;
      return;
    }

    const folder = FOLDERS.find(f => f.id === this._openFolderId);
    if (folder) {
      cardsArea.innerHTML = this._buildCards(folder, showMarginNotes);
    }
  }

  // ── EventBus bindings ───────────────────────────────────────────────────────

  _bindEvents() {
    this.eventBus.on('stimuli:shown', data => {
      if (data?.documentId) {
        this.unlockedDocs.add(data.documentId);
        // Refresh open drawer if visible
        if (this._drawerOpen) {
          const overlay = document.getElementById('doc-inventory-overlay');
          if (overlay) {
            const lpTrust = this._getLPTrust();
            const showMarginNotes = this.roleId === 'hm-lucy-parsons' && lpTrust >= 3;
            overlay.querySelectorAll('.doc-folder').forEach(el => {
              const folder = FOLDERS.find(f => f.id === el.dataset.folderId);
              if (!folder) return;
              const tab = el.querySelector('.doc-folder-tab');
              if (!tab) return;
              const unlockedCount = folder.documentIds.filter(id => this.unlockedDocs.has(id)).length;
              const totalCount = folder.documentIds.length;
              const countEl = tab.querySelector('.doc-folder-count');
              if (countEl) countEl.textContent = `${unlockedCount}/${totalCount}`;
            });
            // Refresh cards if this folder is open
            if (this._openFolderId) {
              const folder = FOLDERS.find(f => f.id === this._openFolderId);
              const cardsArea = overlay.querySelector('#doc-inventory-cards');
              if (folder && cardsArea) {
                cardsArea.innerHTML = this._buildCards(folder, showMarginNotes);
              }
            }
          }
        }
      }
    });
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  _getLPTrust() {
    if (!this.consequenceSystem) return 0;
    const val = this.consequenceSystem.getFlag?.('hm_lp_movement_trust');
    return typeof val === 'number' ? val : 0;
  }

  _trapFocus(container) {
    const focusable = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const getEls = () => [...container.querySelectorAll(focusable)].filter(el => !el.disabled);
    container.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const els = getEls();
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
      else            { if (document.activeElement === last)  { e.preventDefault(); first.focus(); } }
    });
    const els = getEls();
    if (els.length) els[0].focus();
  }

  _escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  _escapeAttr(str) {
    return this._escapeHTML(str);
  }
}

export default DocumentInventory;
