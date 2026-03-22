/**
 * GlossaryTooltip
 * Manages the floating tooltip shown when hovering glossary terms.
 * Singleton — one tooltip element reused for all terms.
 */

import { applyGlossaryToElement, GLOSSARY_INTRO_TERMS } from '../content/glossary.js';

class GlossaryTooltip {
  constructor() {
    this.tooltip = null;
    this.introShown = false;
    this._init();
  }
  
  _init() {
    // Create tooltip element
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'glossary-tooltip';
    document.body.appendChild(this.tooltip);
    
    // Global event delegation — works for dynamically added content
    document.addEventListener('mouseover', (e) => {
      const term = e.target.closest('.glossary-term');
      if (term) this._show(term);
    });
    
    document.addEventListener('mouseout', (e) => {
      const term = e.target.closest('.glossary-term');
      if (term) this._hide();
    });
    
    document.addEventListener('mousemove', (e) => {
      if (this.tooltip.classList.contains('visible')) {
        this._position(e.clientX, e.clientY);
      }
    });
    
    // Keyboard accessibility
    document.addEventListener('focusin', (e) => {
      const term = e.target.closest('.glossary-term');
      if (term) {
        const rect = term.getBoundingClientRect();
        this._show(term);
        this._position(rect.left + rect.width / 2, rect.bottom + 8);
      }
    });
    
    document.addEventListener('focusout', (e) => {
      const term = e.target.closest('.glossary-term');
      if (term) this._hide();
    });
  }
  
  _show(termEl) {
    const def = termEl.dataset.def;
    const termText = termEl.textContent;
    if (!def) return;
    this.tooltip.innerHTML = `<strong>${termText}</strong>${def}`;
    this.tooltip.classList.add('visible');
  }
  
  _hide() {
    this.tooltip.classList.remove('visible');
  }
  
  _position(x, y) {
    const pad = 16;
    const tw = this.tooltip.offsetWidth;
    const th = this.tooltip.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    
    let left = x + pad;
    let top  = y + pad;
    
    if (left + tw > vw - pad) left = x - tw - pad;
    if (top  + th > vh - pad) top  = y - th - pad;
    
    this.tooltip.style.left = `${Math.max(pad, left)}px`;
    this.tooltip.style.top  = `${Math.max(pad, top)}px`;
  }
  
  /**
   * Apply glossary highlighting to a DOM element.
   * Call this after any text is injected into the DOM.
   */
  apply(el) {
    applyGlossaryToElement(el);
  }
  
  /**
   * Show the one-time intro message explaining the feature.
   * Resolves when the student dismisses it.
   */
  showIntro(missionId = null) {
    return new Promise((resolve) => {
      if (this.introShown) { resolve(); return; }
      this.introShown = true;

      const terms = GLOSSARY_INTRO_TERMS[missionId] || GLOSSARY_INTRO_TERMS['rwanda-genocide'];

      const overlay = document.createElement('div');
      overlay.className = 'glossary-intro-overlay';
      overlay.innerHTML = `
        <div class="glossary-intro-box">
          <h3>— Historical Terms —</h3>
          <p>
            Words like <span class="glossary-intro-demo">${terms[0]}</span>, 
            <span class="glossary-intro-demo">${terms[1]}</span>, and 
            <span class="glossary-intro-demo">${terms[2]}</span> appear throughout.<br><br>
            Hover over any underlined term to see its definition.
          </p>
          <button class="glossary-intro-btn">Understood →</button>
        </div>
      `;
      
      document.body.appendChild(overlay);
      
      overlay.querySelector('.glossary-intro-btn').addEventListener('click', () => {
        overlay.remove();
        resolve();
      });
    });
  }
}

export default new GlossaryTooltip();
