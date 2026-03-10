/**
 * UpdateNotesPanel - Pre-game "What's New" update panel
 *
 * Displays latest changes and updates before the first mission starts.
 * Auto-updates from config/update-notes.json.
 */

import { VERSION } from '../../config/version.js';

class UpdateNotesPanel {
  constructor() {
    this.panel = null;
    this.isVisible = false;
    this.hasShownThisSession = false;
  }

  /**
   * Show the update notes panel
   * @returns {Promise<void>}
   */
  async show() {
    // Only show once per session
    if (this.hasShownThisSession || this.isVisible) {
      return;
    }
    
    // Load update notes
    const notes = await this._loadUpdateNotes();
    if (!notes) {
      console.warn('[UpdateNotesPanel] Failed to load update notes');
      return;
    }
    
    this.panel = this._createPanel(notes);
    document.body.appendChild(this.panel);
    this.isVisible = true;
    this.hasShownThisSession = true;
    
    // Fade in
    requestAnimationFrame(() => {
      this.panel.classList.add('visible');
    });
  }

  /**
   * Load update notes from config
   */
  async _loadUpdateNotes() {
    try {
      const response = await fetch('./config/update-notes.json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('[UpdateNotesPanel] Failed to load update notes:', error);
      return null;
    }
  }

  /**
   * Create the panel DOM
   */
  _createPanel(notes) {
    const panel = document.createElement('div');
    panel.className = 'update-notes-panel';
    
    const newItems = notes.new.map(item => `<li>${this._escapeHtml(item)}</li>`).join('');
    const fixedItems = notes.fixed.map(item => `<li>${this._escapeHtml(item)}</li>`).join('');
    
    panel.innerHTML = `
      <div class="update-notes-content">
        <div class="update-notes-header">
          <h2 class="update-notes-title">What's New in This Update</h2>
          <span class="update-notes-version">Version ${this._escapeHtml(notes.version)}</span>
        </div>
        
        <div class="update-notes-body">
          ${notes.new.length > 0 ? `
            <div class="update-notes-section">
              <h3 class="update-notes-section-title">New</h3>
              <ul class="update-notes-list">
                ${newItems}
              </ul>
            </div>
          ` : ''}
          
          ${notes.fixed.length > 0 ? `
            <div class="update-notes-section">
              <h3 class="update-notes-section-title">Fixed</h3>
              <ul class="update-notes-list">
                ${fixedItems}
              </ul>
            </div>
          ` : ''}
        </div>
        
        <div class="update-notes-actions">
          <button class="update-notes-btn">Start Mission</button>
        </div>
      </div>
    `;
    
    // Attach event listener
    const startBtn = panel.querySelector('.update-notes-btn');
    startBtn.addEventListener('click', () => {
      this.hide();
    });
    
    return panel;
  }

  /**
   * Hide the panel
   */
  hide() {
    if (!this.panel || !this.isVisible) return;
    
    this.panel.classList.remove('visible');
    
    setTimeout(() => {
      if (this.panel && this.panel.parentNode) {
        this.panel.parentNode.removeChild(this.panel);
      }
      this.panel = null;
      this.isVisible = false;
    }, 300);
  }

  /**
   * Escape HTML to prevent XSS
   */
  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

export default UpdateNotesPanel;
