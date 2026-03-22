/**
 * DocAnnotationLayer
 *
 * Adds two annotation tools on top of .stimuli-text inside a document overlay:
 *
 *   1. Charcoal Underline — mousedown+drag over text wraps selected words in
 *      <span class="doc-charcoal-underline"> with a randomised --jitter CSS
 *      custom property (2–3px) applied on mouseup for hand-drawn feel.
 *
 *   2. Sticky Note — clicking the note toolbar button spawns a draggable
 *      <div class="doc-sticky-note"> near the cursor, styled as a torn ledger
 *      scrap with a brass paperclip SVG. Notes are stored in component state
 *      only (this._notes Map) — no EventBus, no persistence.
 *
 * Usage:
 *   const layer = new DocAnnotationLayer(containerEl);
 *   layer.mount();   // attaches toolbar + listeners
 *   layer.destroy(); // removes everything (call on overlay dismiss)
 *
 * Architecture: engine layer — no content imports, no global variables.
 */

class DocAnnotationLayer {
  /**
   * @param {HTMLElement} container — the .stimuli-content element
   */
  constructor(container) {
    this._container = container;
    this._textEl = container.querySelector('.stimuli-text');
    this._toolbar = null;
    this._underlineActive = false;
    this._dragStartNode = null;
    this._dragStartOffset = null;

    // Component state: Map<id, { el, text, x, y }>
    this._notes = new Map();
    this._noteCounter = 0;

    // Bound handlers for clean removal
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseUp   = this._onMouseUp.bind(this);
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  mount() {
    if (!this._textEl) return;
    this._buildToolbar();
    this._textEl.addEventListener('mousedown', this._onMouseDown);
    document.addEventListener('mouseup', this._onMouseUp);
  }

  destroy() {
    this._textEl?.removeEventListener('mousedown', this._onMouseDown);
    document.removeEventListener('mouseup', this._onMouseUp);
    this._toolbar?.remove();
    // Remove all sticky notes
    this._notes.forEach(({ el }) => el.remove());
    this._notes.clear();
  }

  // ── Toolbar ────────────────────────────────────────────────────────────────

  _buildToolbar() {
    const toolbar = document.createElement('div');
    toolbar.className = 'doc-annotation-toolbar';
    toolbar.setAttribute('role', 'toolbar');
    toolbar.setAttribute('aria-label', 'Document annotation tools');

    const label = document.createElement('span');
    label.className = 'doc-annotation-toolbar-label';
    label.textContent = 'Annotate';
    label.setAttribute('aria-hidden', 'true');

    // Underline toggle button
    const underlineBtn = document.createElement('button');
    underlineBtn.className = 'doc-annotation-btn';
    underlineBtn.setAttribute('aria-label', 'Charcoal underline — drag over text to underline');
    underlineBtn.setAttribute('aria-pressed', 'false');
    underlineBtn.title = 'Underline (drag)';
    underlineBtn.innerHTML = '<u style="font-family:serif;font-size:1.1rem;">A</u>';
    underlineBtn.addEventListener('click', () => {
      this._underlineActive = !this._underlineActive;
      underlineBtn.classList.toggle('active', this._underlineActive);
      underlineBtn.setAttribute('aria-pressed', String(this._underlineActive));
      if (this._underlineActive) {
        this._textEl.style.cursor = 'crosshair';
      } else {
        this._textEl.style.cursor = '';
      }
    });

    // Sticky note button
    const noteBtn = document.createElement('button');
    noteBtn.className = 'doc-annotation-btn';
    noteBtn.setAttribute('aria-label', 'Add sticky note');
    noteBtn.title = 'Sticky note';
    noteBtn.textContent = '📌';
    noteBtn.addEventListener('click', (e) => {
      // Position near the button itself
      const rect = noteBtn.getBoundingClientRect();
      const containerRect = this._container.getBoundingClientRect();
      this._spawnNote(
        rect.left - containerRect.left + 20,
        rect.bottom - containerRect.top + 8
      );
    });

    toolbar.appendChild(label);
    toolbar.appendChild(underlineBtn);
    toolbar.appendChild(noteBtn);

    // Insert toolbar before .stimuli-text
    this._textEl.parentNode.insertBefore(toolbar, this._textEl);
    this._toolbar = toolbar;
  }

  // ── Charcoal underline ─────────────────────────────────────────────────────

  _onMouseDown(e) {
    if (!this._underlineActive) return;
    // Record start position in text
    const sel = window.getSelection();
    if (sel) sel.removeAllRanges();
  }

  _onMouseUp(e) {
    if (!this._underlineActive) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    if (!this._textEl.contains(range.commonAncestorContainer)) {
      sel.removeAllRanges();
      return;
    }

    this._applyCharcoalUnderline(range);
    sel.removeAllRanges();
  }

  /**
   * Wrap the selected range in a charcoal underline span.
   * Randomises --jitter (2–3px) on the span for hand-drawn feel.
   * @param {Range} range
   */
  _applyCharcoalUnderline(range) {
    try {
      const span = document.createElement('span');
      span.className = 'doc-charcoal-underline';
      // Random jitter: 2–3px, occasionally negative for slight dip
      const jitter = (Math.random() * 1.5 + 1.5).toFixed(1); // 1.5–3.0px
      const sign = Math.random() > 0.4 ? '' : '-';
      span.style.setProperty('--jitter', `${sign}${jitter}px`);
      span.setAttribute('aria-label', 'Underlined passage');
      range.surroundContents(span);
    } catch {
      // Cross-element selection — silently skip
    }
  }

  // ── Sticky notes ───────────────────────────────────────────────────────────

  /**
   * Spawn a sticky note at (x, y) relative to this._container.
   * @param {number} x
   * @param {number} y
   */
  _spawnNote(x, y) {
    const id = `note-${++this._noteCounter}`;

    // Slight random rotation per note: -2.5 to +2.5 deg
    const rotation = ((Math.random() - 0.5) * 5).toFixed(2);

    const note = document.createElement('div');
    note.className = 'doc-sticky-note';
    note.id = id;
    note.style.left = `${x}px`;
    note.style.top  = `${y}px`;
    note.style.setProperty('--note-rotation', `${rotation}deg`);
    note.setAttribute('role', 'note');
    note.setAttribute('aria-label', 'Sticky note');

    // Brass paperclip SVG
    const clip = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    clip.setAttribute('class', 'doc-sticky-note-clip');
    clip.setAttribute('viewBox', '0 0 28 28');
    clip.setAttribute('aria-hidden', 'true');
    clip.innerHTML = `
      <g fill="none" stroke="#b8860b" stroke-width="2" stroke-linecap="round">
        <!-- outer loop -->
        <path d="M8 22 C4 22 4 6 8 6 C12 6 12 20 8 20"/>
        <!-- inner loop -->
        <path d="M8 20 C6 20 6 8 8 8 C10 8 10 18 8 18"/>
        <!-- top bar -->
        <line x1="8" y1="6" x2="18" y2="6"/>
        <line x1="18" y1="6" x2="18" y2="14"/>
      </g>
    `;
    note.appendChild(clip);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'doc-sticky-note-close';
    closeBtn.setAttribute('aria-label', 'Remove sticky note');
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', () => this._removeNote(id));
    note.appendChild(closeBtn);

    // Editable text area
    const textarea = document.createElement('textarea');
    textarea.className = 'doc-sticky-note-text';
    textarea.placeholder = 'Note…';
    textarea.setAttribute('aria-label', 'Sticky note text');
    textarea.rows = 3;
    note.appendChild(textarea);

    // Drag behaviour — move note within container
    this._attachNoteDrag(note);

    // Append to container (position: relative needed — set inline if missing)
    const containerPos = getComputedStyle(this._container).position;
    if (containerPos === 'static') {
      this._container.style.position = 'relative';
    }
    this._container.appendChild(note);

    this._notes.set(id, { el: note });
    textarea.focus();
  }

  /**
   * Remove a sticky note by id.
   * @param {string} id
   */
  _removeNote(id) {
    const entry = this._notes.get(id);
    if (!entry) return;
    entry.el.remove();
    this._notes.delete(id);
  }

  /**
   * Attach mouse-drag repositioning to a sticky note.
   * @param {HTMLElement} noteEl
   */
  _attachNoteDrag(noteEl) {
    let dragging = false;
    let startX, startY, origLeft, origTop;

    const onDown = (e) => {
      // Don't drag when clicking textarea or close button
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      origLeft = parseInt(noteEl.style.left, 10) || 0;
      origTop  = parseInt(noteEl.style.top,  10) || 0;
      noteEl.style.zIndex = '35';
      e.preventDefault();
    };

    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      noteEl.style.left = `${origLeft + dx}px`;
      noteEl.style.top  = `${origTop  + dy}px`;
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      noteEl.style.zIndex = '30';
    };

    noteEl.addEventListener('mousedown', onDown);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);

    // Store cleanup on the element for destroy()
    noteEl._cleanupDrag = () => {
      noteEl.removeEventListener('mousedown', onDown);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }
}

export default DocAnnotationLayer;
