/**
 * IntelInventory.js
 * Call of Duty style full-screen overlay for collected primary source documents.
 */
class IntelInventory {
  constructor(annotationStore, eventBus, stimuliManager) {
    this.store = annotationStore;
    this.eventBus = eventBus;
    this.stimuliManager = stimuliManager;

    this._collectedDocs = new Map(); // documentId -> documentData
    this._isOpen = false;
    this._currentIndex = 0;
    this._toggleBtn = null;

    this._createToggleButton();

    this.eventBus.on('stimuli:shown', (data) => this._handleStimuliShown(data));
    this.eventBus.on('annotation:store-updated', () => this._updateBadge());
    this.eventBus.on('inventory:open-requested', () => this.open());
  }

  getCollectedDoc(documentId) {
    return this._collectedDocs.get(documentId);
  }

  _createToggleButton() {
    // Attempt to append to hub nav, or fallback to body.
    const nav = document.querySelector('.hub-nav') || document.body;
    
    // Create actual button
    const btn = document.createElement('button');
    btn.id = 'doc-inventory-trigger';
    btn.className = 'hub-nav-btn hub-nav-inventory';
    btn.setAttribute('aria-label', 'Open Intel Inventory');
    btn.innerHTML = `
      <span class="hub-nav-icon" aria-hidden="true">📁</span>
      <span class="hub-nav-label">Intel</span>
      <span id="intel-unread-badge" class="hub-nav-badge hidden">0</span>
    `;
    btn.addEventListener('click', () => this.open());
    nav.appendChild(btn);
    this._toggleBtn = btn;
  }

  _updateBadge() {
    if (!this._toggleBtn) return;
    const badge = document.getElementById('intel-unread-badge');
    if (!badge) return;

    const count = this._collectedDocs.size;
    if (count > 0) {
      badge.textContent = count;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  _handleStimuliShown(data) {
    if (!data?.documentId || !data?.documentData) return;
    this._collectedDocs.set(data.documentId, data.documentData);
    this._updateBadge();
  }

  open() {
    if (this._isOpen) return;
    this._isOpen = true;
    this._currentIndex = 0;
    this._renderOverlay();
  }

  close() {
    if (!this._isOpen) return;
    this._isOpen = false;
    
    // Detach annotation layer from current document before closing
    if (this.stimuliManager) {
      this.stimuliManager.detachAnnotationOverlay();
    }

    const overlay = document.getElementById('intel-inventory-overlay');
    if (overlay) overlay.remove();
    this.eventBus.emit('inventory:closed', {});
  }

  _renderOverlay() {
    document.getElementById('intel-inventory-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'intel-inventory-overlay';
    overlay.className = 'intel-inventory-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Intel Inventory');

    // Add CSS inline strictly for layout logic, but rely on CSS file for rest
    Object.assign(overlay.style, {
      position: 'fixed', top: '0', left: '0', right: '0', bottom: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.9)', zIndex: '9999',
      display: 'flex', flexDirection: 'column', color: '#fff',
      backdropFilter: 'blur(10px)'
    });

    const header = document.createElement('div');
    header.className = 'intel-inventory-header';
    Object.assign(header.style, {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.2)'
    });
    header.innerHTML = `
      <h2 style="margin:0; font-family:var(--font-heading); color:#d4af37; text-transform:uppercase; letter-spacing:2px; font-weight:700">Intel Inventory</h2>
      <button id="intel-close-btn" style="background:rgba(212,175,55,0.05); border:1px solid rgba(212,175,55,0.3); color:rgba(212,175,55,0.8); font-size:20px; cursor:pointer; width:44px; height:44px; border-radius:4px; display:flex; align-items:center; justify-content:center; transition:all 0.2s ease" aria-label="Close inventory" onmouseover="this.style.background='rgba(212,175,55,0.15)';this.style.color='#d4af37';this.style.borderColor='#d4af37'" onmouseout="this.style.background='rgba(212,175,55,0.05)';this.style.color='rgba(212,175,55,0.8)';this.style.borderColor='rgba(212,175,55,0.3)'">✕</button>
    `;

    const body = document.createElement('div');
    body.className = 'intel-inventory-body';
    Object.assign(body.style, {
      display: 'flex', flex: '1', position: 'relative', overflow: 'hidden'
    });

    // Left Arrow
    const btnPrev = document.createElement('button');
    btnPrev.id = 'intel-prev-btn';
    btnPrev.innerHTML = '◀';
    Object.assign(btnPrev.style, {
      position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
      zIndex: '10', background: 'rgba(10,14,26,0.85)', border: '1px solid rgba(212,175,55,0.4)', color: 'rgba(212,175,55,0.8)',
      width: '56px', height: '56px', borderRadius: '50%', cursor: 'pointer', fontSize: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)', transition: 'all 0.2s ease'
    });
    btnPrev.onmouseover = () => { btnPrev.style.background = 'rgba(212,175,55,0.15)'; btnPrev.style.color = '#d4af37'; btnPrev.style.borderColor = '#d4af37'; btnPrev.style.transform = 'translateY(-50%) scale(1.05)'; };
    btnPrev.onmouseout = () => { btnPrev.style.background = 'rgba(10,14,26,0.85)'; btnPrev.style.color = 'rgba(212,175,55,0.8)'; btnPrev.style.borderColor = 'rgba(212,175,55,0.4)'; btnPrev.style.transform = 'translateY(-50%)'; };

    // Right Arrow
    const btnNext = document.createElement('button');
    btnNext.id = 'intel-next-btn';
    btnNext.innerHTML = '▶';
    Object.assign(btnNext.style, {
      position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
      zIndex: '10', background: 'rgba(10,14,26,0.85)', border: '1px solid rgba(212,175,55,0.4)', color: 'rgba(212,175,55,0.8)',
      width: '56px', height: '56px', borderRadius: '50%', cursor: 'pointer', fontSize: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)', transition: 'all 0.2s ease'
    });
    btnNext.onmouseover = () => { btnNext.style.background = 'rgba(212,175,55,0.15)'; btnNext.style.color = '#d4af37'; btnNext.style.borderColor = '#d4af37'; btnNext.style.transform = 'translateY(-50%) scale(1.05)'; };
    btnNext.onmouseout = () => { btnNext.style.background = 'rgba(10,14,26,0.85)'; btnNext.style.color = 'rgba(212,175,55,0.8)'; btnNext.style.borderColor = 'rgba(212,175,55,0.4)'; btnNext.style.transform = 'translateY(-50%)'; };

    const contentArea = document.createElement('div');
    contentArea.id = 'intel-content-area';
    Object.assign(contentArea.style, {
      flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: '40px', overflowY: 'auto'
    });

    body.appendChild(btnPrev);
    body.appendChild(contentArea);
    body.appendChild(btnNext);

    overlay.appendChild(header);
    overlay.appendChild(body);
    document.body.appendChild(overlay);

    overlay.querySelector('#intel-close-btn').addEventListener('click', () => this.close());
    btnPrev.addEventListener('click', () => this._navigate(-1));
    btnNext.addEventListener('click', () => this._navigate(1));

    // Handle initial render
    this._renderCurrentDoc();

    // Close on escape
    const escListener = (e) => {
      if (e.key === 'Escape') {
        this.close();
        document.removeEventListener('keydown', escListener);
      }
    };
    document.addEventListener('keydown', escListener);
  }

  _navigate(dir) {
    const docs = Array.from(this._collectedDocs.values());
    this._currentIndex += dir;
    if (this._currentIndex < 0) this._currentIndex = docs.length - 1;
    if (this._currentIndex >= docs.length) this._currentIndex = 0;
    this._renderCurrentDoc();
  }

  _renderCurrentDoc() {
    const docs = Array.from(this._collectedDocs.values());
    const contentArea = document.getElementById('intel-content-area');
    if (!contentArea) return;

    if (docs.length === 0) {
      contentArea.innerHTML = '<div style="display:flex; flex-direction:column; align-items:center; gap:20px; opacity:0.6"><div style="font-size:48px">📁</div><p style="font-family:\'Courier New\', monospace; color:#d4af37; font-size:1.2em; letter-spacing:4px">NO INTEL COLLECTED</p></div>';
      document.getElementById('intel-prev-btn').style.display = 'none';
      document.getElementById('intel-next-btn').style.display = 'none';
      return;
    }

    const doc = docs[this._currentIndex];

    // Clear old annotation layer before replacing DOM
    if (this.stimuliManager) {
      this.stimuliManager.detachAnnotationOverlay();
    }

    // Reuse the old _renderStimulusOverlay HTML structure from UIController so old CSS applies
    const type = doc.documentType || '';
    let typeClass = 'doc-type--default';
    if (type === 'arbeiter-zeitung') typeClass = 'doc-type--arbeiter-zeitung';
    if (type === 'pinkerton-report') typeClass = 'doc-type--pinkerton-report';
    if (type === 'harper-weekly')    typeClass = 'doc-type--harper-weekly';
    if (type === 'court-transcript') typeClass = 'doc-type--court-transcript';

    const id = doc.id || '';
    if (id === 'hm-doc-1a' || id === 'hm-doc-1b' || id === 'hm-doc-3') typeClass = 'doc-type--arbeiter-zeitung';
    if (id === 'hm-doc-0')  typeClass = 'doc-type--pinkerton-report';
    if (id === 'hm-doc-2' || id === 'hm-doc-4') typeClass = 'doc-type--harper-weekly';
    if (id === 'hm-doc-5')  typeClass = 'doc-type--court-transcript';

    const spiceStr  = (doc.spiceT || []).join(' · ');

    contentArea.innerHTML = '';
    
    // We create a wrapper that matches what the stimuli overlay looked like
    const docWrapper = document.createElement('div');
    docWrapper.className = `stimuli-content ${typeClass} intel-doc-view`;
    Object.assign(docWrapper.style, {
      position: 'relative', maxWidth: '800px', width: '100%', margin: '0 auto',
      background: '#fff', color: '#000', maxHeight: 'none', transform: 'none',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)', overflow: 'visible',
      padding: '40px', borderRadius: '4px' // Added some default padding just in case CSS doesn't apply
    });

    const illustrationHTML = typeClass === 'doc-type--harper-weekly'
      ? `<div class="stimuli-illustration-placeholder" aria-hidden="true" style="margin:20px 0; padding:40px; border:1px dashed #ccc; text-align:center;">[ Engraving — ${doc.title} ]</div>`
      : '';

    docWrapper.innerHTML = `
      <div class="stimuli-meta" style="margin-bottom:20px; text-transform:uppercase; font-size:0.8em; color:#666">
        <span class="ap-skill-tag">${spiceStr}</span>
        <span class="stimuli-unit text-secondary">${doc.apUnit || ''}</span>
      </div>
      <h3 id="stimuli-doc-title" class="stimuli-title mt-sm" style="font-family:serif; font-size:1.8em; margin:0 0 5px 0">${doc.title}</h3>
      <p class="stimuli-source" style="font-style:italic; margin:0 0 20px 0">${doc.source} — ${doc.date}</p>
      ${illustrationHTML}
      <div class="stimuli-text mt-md" style="line-height:1.6; font-size:1.1em">${doc.text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</div>
    `;

    contentArea.appendChild(docWrapper);

    // Update arrows visibility if there's only 1 doc
    document.getElementById('intel-prev-btn').style.display = docs.length > 1 ? 'block' : 'none';
    document.getElementById('intel-next-btn').style.display = docs.length > 1 ? 'block' : 'none';

    // Hook up annotation layer using the exact same logic we salvaged in StimuliManager!
    if (this.stimuliManager) {
      // Must wait for paint
      requestAnimationFrame(() => {
        this.stimuliManager.attachAnnotationOverlay(doc, docWrapper);
      });
    }
  }
}

export default IntelInventory;
