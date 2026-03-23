/**
 * MissionBriefing - Pre-mission newspaper briefing screen
 *
 * Intercepts the role:selected event and displays a role-specific
 * newspaper briefing before Scene 01 loads. Calls onComplete()
 * when the student clicks "Enter the mission".
 *
 * Architecture: Engine logic only, content imported from content layer.
 * CSS in css/style.css + css/chicago-tribune-briefing.css (Haymarket only)
 * Requirements: US-2.1, TR-2.2
 *
 * FIX: Tribune CSS is now disabled when not showing a Haymarket briefing,
 * preventing its styles from bleeding into Rwanda/Urban Design briefings.
 * The <link> element is kept in <head> after first load (no re-download)
 * but toggled via the `disabled` property.
 */
import { BRIEFING_PAGES    as RW_PAGES,
         BRIEFING_CARDS    as RW_CARDS,
         BRIEFING_FINALS   as RW_FINALS,
         BRIEFING_UI_TEXT  as RW_UI_TEXT,
         BRIEFING_CARD_TEMPLATES as RW_TEMPLATES
} from '../content/missions/rwanda/briefing-content.js';

import {
  BRIEFING_PAGES    as UD_PAGES,
  BRIEFING_CARDS    as UD_CARDS,
  BRIEFING_FINALS   as UD_FINALS,
  BRIEFING_UI_TEXT  as UD_UI_TEXT,
  BRIEFING_CARD_TEMPLATES as UD_TEMPLATES
} from '../content/missions/urban-design/briefing-content.js';

import {
  BRIEFING_PAGES    as HM_PAGES,
  BRIEFING_CARDS    as HM_CARDS,
  BRIEFING_FINALS   as HM_FINALS,
  BRIEFING_UI_TEXT  as HM_UI_TEXT
} from '../content/missions/haymarket/briefing-content.js';

import glossaryTooltip from './GlossaryTooltip.js';

// Merge mission content into unified lookup objects
const BRIEFING_PAGES          = { ...RW_PAGES, ...UD_PAGES };
const BRIEFING_CARDS          = { ...RW_CARDS, ...UD_CARDS, ...HM_CARDS };
const BRIEFING_FINALS         = { ...RW_FINALS, ...UD_FINALS, ...HM_FINALS };
const BRIEFING_CARD_TEMPLATES = { ...RW_TEMPLATES, ...UD_TEMPLATES };

// UI text is per-mission
const BRIEFING_UI_TEXT_MAP = {
  'rwanda-genocide':   RW_UI_TEXT,
  'aphg-urban-design': UD_UI_TEXT,
  'haymarket-affair':  HM_UI_TEXT
};

class MissionBriefing {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.container = null;
    this._activeIv  = null;
    this._seqToken  = 0;
    // Tracks the injected <link> element so we can disable/enable it
    // rather than injecting a fresh one each time (avoids re-download).
    this._tributeStyleEl = null;
  }

  hasBriefing(missionId) {
    return (missionId === 'rwanda-genocide' ||
            missionId === 'aphg-urban-design' ||
            missionId === 'haymarket-affair');
  }

  show(_missionId, roleId, onComplete) {
    const isHaymarket = _missionId === 'haymarket-affair';

    // All Haymarket roles share the same five pages
    const pages  = isHaymarket
      ? HM_PAGES  // HM_PAGES is a flat array, not keyed by role
      : BRIEFING_PAGES[this._getRoleKey(roleId)];
    const card   = BRIEFING_CARDS[this._getCardKey(roleId)];
    const final  = BRIEFING_FINALS[this._getFinalKey(roleId)];
    const uiText = BRIEFING_UI_TEXT_MAP[_missionId] || RW_UI_TEXT;

    if (!pages || !card || !final) {
      console.warn(`MissionBriefing: No briefing data for roleId "${roleId}" — skipping.`);
      onComplete();
      return;
    }

    this._cleanup();

    // Tribune CSS: load once on first Haymarket visit, then toggle disabled
    // so it never bleeds into Rwanda/Urban Design briefings.
    if (isHaymarket) {
      this._enableTribuneCSS();
    } else {
      this._disableTribuneCSS();
    }

    this.container = document.createElement('div');
    this.container.id = 'mission-briefing-overlay';
    if (isHaymarket) this.container.classList.add('trib');

    this.container.innerHTML = isHaymarket
      ? this._buildTribuneHTML(roleId, uiText, card)
      : this._buildHTML(this._getRoleKey(roleId), uiText);

    document.getElementById('app').appendChild(this.container);

    // Show intro tooltip immediately
    glossaryTooltip.showIntro();

    // Back button
    const backButton = this.container.querySelector('#mb-back-button');
    if (backButton) {
      backButton.addEventListener('click', () => {
        this._cleanup();
        this.eventBus.emit('briefing:back', { missionId: _missionId });
      });
    }

    let pageIdx = 0;
    let typing  = false;

    const showPage = (i) => {
      const p      = pages[i];
      const isLast = (i === pages.length - 1);
      typing = true;

      if (isHaymarket) {
        this._showTribunePage(p, isLast, uiText);
        return;
      }

      // Original Rwanda/UD rendering
      this._setText('m-vol',   p.vol);
      this._setText('m-date',  p.date);
      this._setText('m-price', p.price);

      const hl = this.container.querySelector('#hl');
      hl.className = 'mb-headline ' + p.hSize + (p.hClass ? ' ' + p.hClass : '');
      hl.innerHTML = '';

      ['mb-dateline','mb-deck','mb-body','mb-ticker'].forEach(id => {
        this.container.querySelector('#' + id).innerHTML = '';
      });

      const btn = this.container.querySelector('#mb-cont');
      btn.style.opacity = '0';
      btn.style.pointerEvents = 'none';
      btn.textContent = '';

      const tasks = [
        { id: 'mb-dateline', text: p.date.toUpperCase(), speed: 14, pause: 50 },
        { id: 'hl',          text: p.h, speed: p.hSize === 'sz-xxl' ? 11 : p.hSize === 'sz-xl' ? 13 : 15, pause: 70 },
        { id: 'mb-deck',     text: p.deck, speed: 11, pause: 50 },
        { id: 'mb-body',     text: p.body, speed: 7,  pause: 70 },
      ];
      if (p.ticker) {
        tasks.push({ id: 'mb-ticker', text: '\u25C6  ' + p.ticker, speed: 11, pause: 40 });
      }

      this._typeSequence(tasks, () => {
        btn.textContent = isLast ? uiText.buttons.seeCard : uiText.buttons.continue;
        btn.style.opacity  = '1';
        btn.style.pointerEvents = 'all';
        typing = false;
        ['mb-dateline', 'hl', 'mb-deck', 'mb-body', 'mb-ticker'].forEach(id => {
          const el = this.container.querySelector('#' + id);
          if (el) glossaryTooltip.apply(el);
        });
      });
    };

    this.container.querySelector('#mb-cont').addEventListener('click', () => {
      if (typing && !isHaymarket) return;
      pageIdx++;
      if (pageIdx < pages.length) {
        showPage(pageIdx);
      } else {
        this._showCard(card, final, onComplete, isHaymarket);
      }
    });

    showPage(0);
  }

  // ─── Tribune CSS management ──────────────────────────────────────────────────

  /**
   * Inject the Tribune <link> on first call, then un-disable it.
   * Keeping the element in the DOM avoids re-downloading the file;
   * toggling `disabled` prevents it from applying when not needed.
   */
  _enableTribuneCSS() {
    if (!this._tributeStyleEl) {
      const link = document.createElement('link');
      link.rel  = 'stylesheet';
      link.href = 'css/chicago-tribune-briefing.css';
      link.id   = 'tribune-briefing-css';
      document.head.appendChild(link);
      this._tributeStyleEl = link;
    }
    // Re-enable in case it was disabled by a previous non-Haymarket briefing
    this._tributeStyleEl.disabled = false;
  }

  /**
   * Disable the Tribune stylesheet so its rules don't affect
   * Rwanda / Urban Design briefings shown later in the same session.
   */
  _disableTribuneCSS() {
    if (this._tributeStyleEl) {
      this._tributeStyleEl.disabled = true;
    }
  }

  // ─── Tribune-specific methods ────────────────────────────────────────────────

  /**
   * Render one Tribune-style page.
   * Uses fast typewriter on the body, instant render for structural elements.
   */
  _showTribunePage(page, isLast, uiText) {
    const token  = ++this._seqToken;
    const bodyEl = this.container.querySelector('#trib-body-text');
    const deckEl = this.container.querySelector('#trib-deck-text');
    const hlEl   = this.container.querySelector('#trib-headline-text');
    const tickEl = this.container.querySelector('#trib-ticker-text');
    const btn    = this.container.querySelector('#mb-cont');
    if (!bodyEl || !deckEl || !hlEl) return;

    this._setText('trib-vol',   page.vol   || '');
    this._setText('trib-date',  page.date  || '');
    this._setText('trib-price', page.price || '');

    hlEl.className    = `trib-headline ${page.hSize || 'sz-md'} ${page.hClass || ''}`;
    hlEl.textContent  = '';
    deckEl.textContent = '';
    bodyEl.textContent = '';
    if (tickEl) tickEl.textContent = '';

    btn.style.opacity = '0';
    btn.style.pointerEvents = 'none';
    btn.textContent = '';

    const tasks = [
      { el: hlEl,   text: page.h    || '', speed: 12, pause: 60 },
      { el: deckEl, text: page.deck || '', speed: 9,  pause: 50 },
      { el: bodyEl, text: page.body || '', speed: 5,  pause: 80 },
    ];
    if (page.ticker && tickEl) {
      tasks.push({ el: tickEl, text: '◆  ' + page.ticker, speed: 10, pause: 40 });
    }

    this._typeSequenceEl(tasks, token, () => {
      if (token !== this._seqToken) return;
      btn.textContent = isLast ? uiText.buttons.seeCard : uiText.buttons.continue;
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'all';
      glossaryTooltip.apply(bodyEl);
    });
  }

  /** Type sequence using direct element references */
  _typeSequenceEl(tasks, token, done) {
    if (this._activeIv) { clearInterval(this._activeIv); this._activeIv = null; }
    let i = 0;
    const run = () => {
      if (token !== this._seqToken || !this.container) return;
      if (i >= tasks.length) { if (done) done(); return; }
      const t    = tasks[i++];
      const el   = t.el;
      const text = t.text;
      let j = 0;
      el.innerHTML = '<span class="trib-cursor"></span>';
      this._activeIv = setInterval(() => {
        if (token !== this._seqToken) { clearInterval(this._activeIv); return; }
        j++;
        el.innerHTML = text.slice(0, j) + '<span class="trib-cursor"></span>';
        if (j >= text.length) {
          clearInterval(this._activeIv);
          this._activeIv = null;
          el.innerHTML = text;
          setTimeout(run, t.pause || 40);
        }
      }, t.speed || 12);
    };
    run();
  }

  /** Build the full Tribune HTML shell — three-column newspaper layout */
  _buildTribuneHTML(roleId, uiText, card) {
    const cardHTML = this._buildTribuneCardHTML(roleId, card);
    return `
<button id="mb-back-button" class="trib-back" aria-label="Back to role selection">← Back</button>
<div class="mb-paper">
  <!-- ═══ MASTHEAD ═══ -->
  <div class="mb-mast">
    <div class="trib-rule-top"></div>
    <div class="trib-meta-strip">
      <span id="trib-vol">VOL. XLII — NO. 124</span>
      <span>Established 1847</span>
      <span id="trib-price">TWO CENTS</span>
    </div>
    <div class="trib-name-row"><span class="trib-name">Chicago Daily Tribune</span></div>
    <div class="trib-tagline">"I WILL — CHICAGO"</div>
    <div class="trib-edition">
      <span id="trib-date">CHICAGO, MAY 1886</span>
      <span>MORNING EDITION</span>
      <span>PRICE: TWO CENTS</span>
    </div>
  </div>
  <!-- ═══ ARTICLE CONTENT ═══ -->
  <div id="mb-content" class="trib-content">
    <div class="trib-section-rule">Latest Intelligence From the City and the Nation</div>
    <div class="trib-article-grid">
      <!-- LEFT COL -->
      <div class="trib-col">
        <span class="trib-dateline">Chicago, Illinois</span>
        <div class="trib-col-rule"></div>
        <h2 class="trib-headline sz-lg" id="trib-headline-text"></h2>
        <div class="trib-cross-rule"></div>
        <p class="trib-deck" id="trib-deck-text"></p>
        <div class="trib-byline">By Our Labor Correspondent</div>
        <div class="trib-ad">
          <div class="trib-ad-head">McCormick Reaper Works</div>
          <div class="trib-ad-body">The Greatest Labor-Saving Machine<br>Known to Civilization.<br><br>Blue Island Ave., Chicago.</div>
        </div>
      </div>
      <!-- CENTER COL -->
      <div class="trib-col">
        <div class="trib-ornament">— ✦ —</div>
        <div class="trib-body" id="trib-body-text"></div>
      </div>
      <!-- RIGHT COL -->
      <div class="trib-col">
        <span class="trib-dateline">Dispatches</span>
        <div class="trib-col-rule"></div>
        <div class="trib-sidebar-item">
          <div class="trib-sidebar-head">THE STRIKE SITUATION</div>
          <div class="trib-sidebar-text">Eighty thousand workingmen have pledged to lay down their tools on May the first. The demand: eight hours of labor for eight hours' pay.</div>
        </div>
        <div class="trib-sidebar-item">
          <div class="trib-sidebar-head">ANARCHIST AGITATORS</div>
          <div class="trib-sidebar-text">Foreign-born radicals continue to distribute inflammatory literature in the German quarter. The Arbeiter-Zeitung calls for open insurrection.</div>
        </div>
        <div class="trib-sidebar-item">
          <div class="trib-sidebar-head">PINKERTON GUARDS</div>
          <div class="trib-sidebar-text">The National Detective Agency has deployed additional operatives to monitor labor meetings across the West Side.</div>
        </div>
        <div class="trib-ticker" id="trib-ticker-text"></div>
        <div class="trib-ad" style="margin-top:12px;">
          <div class="trib-ad-head">Pinkerton's<br>National Detective Agency</div>
          <div class="trib-ad-body">We Never Sleep.<br>Chicago Office: Dearborn St.<br><br>Labor Intelligence.<br>Strike Protection.<br>Operative Infiltration.</div>
        </div>
      </div>
    </div>
    <button class="trib-cont-btn" id="mb-cont" style="opacity:0;pointer-events:none;margin-top:10px;"></button>
  </div>
  <!-- ═══ IDENTITY CARD SECTION ═══ -->
  <div id="mb-card-section" class="trib-card-section">
    <div class="trib-card-eyebrow">${uiText.cardEyebrow}</div>
    ${cardHTML}
    <div id="mb-id-note" class="trib-note"></div>
    <div id="mb-final-bar" class="trib-final">
      <div id="mb-final-text" class="trib-final-text"></div>
      <button id="mb-begin" class="trib-begin" style="opacity:0;pointer-events:none;">${uiText.buttons.enterMission}</button>
    </div>
  </div>
</div>`;
  }

  /** Build Tribune-specific identity cards */
  _buildTribuneCardHTML(roleId, card) {
    if (!card) return '';
    if (roleId === 'hm-lucy-parsons') return this._buildPoliceSurveillanceCard(card);
    if (roleId === 'hm-karl-brenner') return this._buildEmployeeRecordCard(card);
    if (roleId === 'hm-james-doyle')  return this._buildPinkertonCard(card);
    return '';
  }

  _buildPoliceSurveillanceCard(card) {
    const rows = card.rows || [];
    return `<div class="physical-card" style="background:linear-gradient(135deg,#d4c8a8 0%,#c8bc98 100%);border:1px solid #6a5a3a;font-family:'Libre Baskerville',serif;max-width:620px;margin:0 auto;box-shadow:0 6px 24px rgba(0,0,0,0.4);">
  <div style="background:#1a1408;padding:8px 14px;display:flex;justify-content:space-between;align-items:center;">
    <div style="color:#c8a84a;font-size:0.55rem;letter-spacing:3px;text-transform:uppercase;font-family:'IM Fell English',serif;">City of Chicago</div>
    <div style="color:#c8a84a;font-size:0.7rem;font-weight:bold;letter-spacing:1px;font-family:'IM Fell English',serif;">★ POLICE DEPARTMENT ★</div>
    <div style="color:#c8a84a;font-size:0.55rem;letter-spacing:2px;font-family:'IM Fell English',serif;">${card.classification || 'SURVEILLANCE FILE'}</div>
  </div>
  <div style="display:grid;grid-template-columns:120px 1fr;gap:14px;padding:14px 18px 16px;">
    <div>
      <div style="width:110px;height:140px;background:#b8a070;border:1px solid #6a5030;display:flex;align-items:center;justify-content:center;font-family:'IM Fell English',serif;font-style:italic;font-size:0.6rem;color:#4a3010;text-align:center;line-height:1.4;">[Photograph<br>Not Available]</div>
      <div style="font-size:0.45rem;color:#4a3010;text-align:center;margin-top:3px;font-style:italic;font-family:'IM Fell English',serif;">Subject likeness</div>
      <div style="border:2px solid rgba(140,20,20,0.7);color:rgba(140,20,20,0.8);font-family:'Playfair Display',serif;font-weight:900;font-size:0.65rem;letter-spacing:2px;text-align:center;padding:3px 0;margin-top:8px;transform:rotate(-3deg);">DANGEROUS</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:7px;padding-top:2px;">
      ${rows.map((row, i) => `<div style="border-bottom:0.5px solid rgba(70,50,20,0.3);padding-bottom:5px;"><div style="font-size:0.52rem;text-transform:uppercase;letter-spacing:0.8px;color:#4a3a10;font-family:'IM Fell English',serif;font-style:italic;margin-bottom:1px;">${row[0]}</div><div style="font-size:${row[2]==='redlined'?'1.1rem':'0.95rem'};font-weight:${i===0?'700':'400'};color:${row[2]==='redlined'?'#8a1212':'#1a0e04'};font-family:'Playfair Display',serif;" class="id-field-value"></div></div>`).join('')}
      <div style="margin-top:4px;"><div style="font-size:0.45rem;text-transform:uppercase;letter-spacing:1px;color:#4a3a10;font-family:'IM Fell English',serif;font-style:italic;">Filed By</div><div style="font-size:0.7rem;font-style:italic;color:#1a0e04;font-family:'IM Fell DW Pica',serif;">${card.stamp || ''}</div></div>
    </div>
  </div>
  <div style="background:#1a1408;padding:4px 14px;display:flex;justify-content:space-between;">
    <span style="font-size:0.42rem;color:#8a7a4a;font-family:'IM Fell English',serif;">File No. CPD-1886-0441</span>
    <span style="font-size:0.42rem;color:#8a7a4a;font-family:'IM Fell English',serif;font-style:italic;">Active Surveillance — April 1886</span>
    <span style="font-size:0.42rem;color:#8a7a4a;font-family:'IM Fell English',serif;">Chicago P.D.</span>
  </div>
</div>`;
  }

  _buildEmployeeRecordCard(card) {
    const rows = card.rows || [];
    return `<div class="physical-card" style="background:linear-gradient(135deg,#ddd4b0 0%,#cdc4a0 100%);border:1px solid #8a7a4a;font-family:'Libre Baskerville',serif;max-width:620px;margin:0 auto;box-shadow:0 6px 24px rgba(0,0,0,0.35);">
  <div style="background:#2a2010;padding:8px 14px;text-align:center;border-bottom:2px solid #8a6a2a;">
    <div style="color:#c8a840;font-size:0.55rem;letter-spacing:4px;text-transform:uppercase;font-family:'IM Fell English',serif;">McCormick Harvesting Machine Company</div>
    <div style="color:#c8a840;font-family:'UnifrakturMaguntia',cursive;font-size:1.1rem;margin:3px 0;">Employee Record</div>
    <div style="color:#8a7a4a;font-size:0.48rem;letter-spacing:2px;font-family:'IM Fell English',serif;font-style:italic;">Blue Island Avenue, Chicago, Illinois — Est. 1847</div>
  </div>
  <div style="display:grid;grid-template-columns:110px 1fr;gap:14px;padding:12px 16px 14px;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
      <svg viewBox="0 0 90 90" width="90" height="90"><circle cx="45" cy="45" r="42" fill="none" stroke="#8a6a2a" stroke-width="2"/><circle cx="45" cy="45" r="36" fill="rgba(180,140,60,0.15)" stroke="#8a6a2a" stroke-width="1"/><circle cx="45" cy="45" r="14" fill="none" stroke="#6a5020" stroke-width="3"/><circle cx="45" cy="45" r="6" fill="#6a5020"/>${[0,30,60,90,120,150,180,210,240,270,300,330].map(a=>`<rect x="43" y="12" width="4" height="10" fill="#6a5020" transform="rotate(${a} 45 45)"/>`).join('')}<text x="45" y="72" text-anchor="middle" font-size="5" fill="#6a5020" font-family="Times New Roman" letter-spacing="0.5">McCORMICK</text><text x="45" y="79" text-anchor="middle" font-size="4" fill="#8a6a2a" font-family="Times New Roman" font-style="italic">Est. 1847</text></svg>
      <div style="border:1px solid rgba(140,20,20,0.6);color:rgba(140,20,20,0.75);font-family:'Playfair Display',serif;font-weight:900;font-size:0.55rem;letter-spacing:1px;text-align:center;padding:3px 6px;transform:rotate(-2deg);">LOCKED OUT<br>Feb. 1886</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:6px;">
      ${rows.map(row=>`<div style="border-bottom:0.5px solid rgba(70,50,20,0.3);padding-bottom:4px;"><div style="font-size:0.5rem;text-transform:uppercase;letter-spacing:0.8px;color:#5a4a20;font-family:'IM Fell English',serif;font-style:italic;margin-bottom:1px;">${row[0]}</div><div style="font-size:0.9rem;color:#1a0e04;font-family:'IM Fell DW Pica',serif;" class="id-field-value"></div></div>`).join('')}
    </div>
  </div>
  <div style="background:#2a2010;padding:4px 14px;display:flex;justify-content:space-between;">
    <span style="font-size:0.42rem;color:#8a7a4a;font-family:'IM Fell English',serif;font-style:italic;">Employment suspended February 16, 1886</span>
    <span style="font-size:0.42rem;color:#8a7a4a;font-family:'IM Fell English',serif;">Pinkerton Security on Premises</span>
  </div>
</div>`;
  }

  _buildPinkertonCard(card) {
    const rows = card.rows || [];
    return `<div class="physical-card" style="background:linear-gradient(135deg,#e8e0cc 0%,#dcd4bc 100%);border:1px solid #6a6050;font-family:'Libre Baskerville',serif;max-width:620px;margin:0 auto;box-shadow:0 6px 24px rgba(0,0,0,0.35);">
  <div style="background:#1a1810;padding:8px 14px;display:flex;align-items:center;justify-content:space-between;">
    <svg viewBox="0 0 40 24" width="50" height="30"><ellipse cx="20" cy="12" rx="18" ry="10" fill="none" stroke="#c8a840" stroke-width="1.5"/><circle cx="20" cy="12" r="5" fill="none" stroke="#c8a840" stroke-width="1.5"/><circle cx="20" cy="12" r="2" fill="#c8a840"/>${[-12,-6,0,6,12].map(x=>`<line x1="${20+x}" y1="2" x2="${20+x*0.9}" y2="5" stroke="#c8a840" stroke-width="1"/>`).join('')}</svg>
    <div style="text-align:center;"><div style="color:#c8a840;font-family:'Playfair Display',serif;font-size:0.9rem;font-weight:700;letter-spacing:2px;">PINKERTON'S</div><div style="color:#8a8070;font-family:'IM Fell English',serif;font-size:0.5rem;letter-spacing:3px;">NATIONAL DETECTIVE AGENCY</div><div style="color:#c8a840;font-family:'IM Fell English',serif;font-style:italic;font-size:0.55rem;margin-top:1px;">We Never Sleep.</div></div>
    <div style="text-align:right;"><div style="color:#8a8070;font-size:0.45rem;font-family:'IM Fell English',serif;font-style:italic;">Chicago Office<br>Dearborn Street</div></div>
  </div>
  <div style="background:#2a2818;padding:4px 14px;text-align:center;border-bottom:1px solid #c8a840;"><span style="color:#c8a840;font-family:'IM Fell English',serif;font-size:0.55rem;letter-spacing:3px;text-transform:uppercase;">▸ ${card.classification || 'OPERATIVE ASSIGNMENT — ACTIVE'} ◂</span></div>
  <div style="display:grid;grid-template-columns:110px 1fr;gap:14px;padding:12px 16px 14px;">
    <div>
      <div style="width:100px;height:130px;background:#b8b0a0;border:1px solid #8a8070;display:flex;align-items:center;justify-content:center;font-size:0.55rem;color:#5a5040;font-family:'IM Fell English',serif;font-style:italic;text-align:center;">[Operative<br>Photo<br>On File]</div>
      <div style="font-size:0.42rem;text-align:center;color:#5a5040;margin-top:3px;font-family:'IM Fell English',serif;font-style:italic;">Cover identity</div>
      <div style="border:1px solid rgba(200,168,64,0.5);margin-top:8px;padding:4px 6px;text-align:center;background:rgba(200,168,64,0.08);"><div style="font-size:0.42rem;color:#8a8070;font-family:'IM Fell English',serif;font-style:italic;letter-spacing:1px;text-transform:uppercase;">Cover name</div><div style="font-size:0.75rem;color:#1a1810;font-family:'Playfair Display',serif;font-weight:700;">James Reilly</div></div>
    </div>
    <div style="display:flex;flex-direction:column;gap:6px;">
      ${rows.map(row=>`<div style="border-bottom:0.5px solid rgba(70,60,40,0.3);padding-bottom:4px;"><div style="font-size:0.5rem;text-transform:uppercase;letter-spacing:1px;color:#5a5040;font-family:'IM Fell English',serif;font-style:italic;margin-bottom:1px;">${row[0]}</div><div style="font-size:${row[2]==='un'?'0.75rem':'0.9rem'};color:#1a1810;font-family:'IM Fell DW Pica',serif;" class="id-field-value"></div></div>`).join('')}
      <div style="margin-top:6px;padding:5px 8px;border:1px dashed rgba(70,60,40,0.4);font-size:0.52rem;color:#5a5040;font-family:'IM Fell English',serif;font-style:italic;line-height:1.4;">This document is the property of the Pinkerton National Detective Agency. Unauthorized disclosure is prohibited. Operative identity must not be revealed.</div>
    </div>
  </div>
  <div style="background:#1a1810;padding:4px 14px;display:flex;justify-content:space-between;">
    <span style="font-size:0.42rem;color:#8a8070;font-family:'IM Fell English',serif;">Assignment CHI-1886-114</span>
    <span style="font-size:0.42rem;color:#c8a840;font-family:'IM Fell English',serif;font-style:italic;">We Never Sleep.</span>
    <span style="font-size:0.42rem;color:#8a8070;font-family:'IM Fell English',serif;">Pinkerton N.D.A.</span>
  </div>
</div>`;
  }

  // ─── Original _buildHTML for Rwanda / Urban Design ───────────────────────────

  _buildCardHTML(roleKey) {
    const template = BRIEFING_CARD_TEMPLATES[roleKey];
    if (!template) return '';
    if (roleKey === 'tutsi')       return this._buildTutsiCard(template);
    if (roleKey === 'hutu')        return this._buildHutuCard(template);
    if (roleKey === 'un')          return this._buildUnCard(template);
    if (roleKey === 'ud-resident') return this._buildUrbanResidentCard(template);
    return '';
  }

  _buildUrbanResidentCard(t) {
    return `<div class="physical-card ud-deed-card"><div class="pc-header-band pc-deed-header"><span class="pc-republic" style="letter-spacing:2px;">${t.headerBand.republic}</span><span class="pc-type">${t.headerBand.type}</span></div><div class="pc-body"><div class="pc-photo-col"><div class="pc-photo-box pc-photo-deed"><svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" width="70" height="70" style="opacity:0.85;"><polygon points="40,8 72,32 8,32" fill="#8a6a3a" stroke="#5a4020" stroke-width="1.5"/><rect x="16" y="32" width="48" height="36" fill="#c8a870" stroke="#8a6a3a" stroke-width="1"/><rect x="32" y="48" width="16" height="20" fill="#6a4a20" stroke="#5a3a10" stroke-width="0.8"/><rect x="20" y="36" width="10" height="10" fill="#d4c090" stroke="#8a6a3a" stroke-width="0.6"/><rect x="50" y="36" width="10" height="10" fill="#d4c090" stroke="#8a6a3a" stroke-width="0.6"/></svg><div class="pc-photo-label" style="color:#5a3a10;">${t.photoLabel}</div></div><svg class="pc-stamp" viewBox="0 0 44 44" style="transform:rotate(-8deg);opacity:0.82;"><circle cx="22" cy="22" r="20" fill="none" stroke="rgba(160,20,20,0.7)" stroke-width="2"/><circle cx="22" cy="22" r="16" fill="rgba(160,20,20,0.1)" stroke="rgba(160,20,20,0.4)" stroke-width="1"/><text x="22" y="13" text-anchor="middle" font-size="3" fill="rgba(160,20,20,0.85)" font-family="Times New Roman">${t.stamp.line1}</text><text x="22" y="24" text-anchor="middle" font-size="6" font-weight="700" fill="rgba(160,20,20,0.95)" font-family="Times New Roman">${t.stamp.line2}</text><text x="22" y="31" text-anchor="middle" font-size="3" fill="rgba(160,20,20,0.75)" font-family="Times New Roman">${t.stamp.line3}</text></svg></div><div class="pc-fields">${t.fields.map(f=>`<div class="pc-field"><span class="pc-lbl ud-lbl">${f.label}</span><span class="${f.cssClass} id-field-value"></span></div>`).join('\n')}</div></div><div class="pc-footer ud-deed-footer"><span>${t.footer.issued}</span><span>${t.footer.valid}</span><span>${t.footer.number}</span></div><div class="pc-age-tint pc-age-pristine"></div></div>`;
  }

  _buildTutsiCard(t) {
    return `<div class="physical-card tutsi-card"><div class="pc-header-band pc-green"><span class="pc-republic">${t.headerBand.republic}</span><span class="pc-type">${t.headerBand.type}</span></div><div class="pc-body"><div class="pc-photo-col"><div class="pc-photo-box"><img src="images/rwanda-tutsi-photo.png" alt="Identity photo" class="pc-photo-img"/><div class="pc-photo-label">${t.photoLabel}</div></div><svg class="pc-stamp" viewBox="0 0 44 44" style="transform:rotate(-12deg);opacity:0.7;"><circle cx="22" cy="22" r="20" fill="none" stroke="rgba(60,30,120,0.6)" stroke-width="1.5"/><circle cx="22" cy="22" r="16" fill="rgba(60,30,120,0.12)" stroke="rgba(60,30,120,0.4)" stroke-width="0.8"/><text x="22" y="14" text-anchor="middle" font-size="4" fill="rgba(60,30,120,0.75)" font-family="Times New Roman">${t.stamp.line1}</text><text x="22" y="23" text-anchor="middle" font-size="5.5" font-weight="700" fill="rgba(60,30,120,0.85)" font-family="Times New Roman">${t.stamp.line2}</text><text x="22" y="30" text-anchor="middle" font-size="3.5" fill="rgba(60,30,120,0.65)" font-family="Times New Roman">${t.stamp.line3}</text></svg></div><div class="pc-fields">${t.fields.map(f=>`<div class="pc-field"><span class="pc-lbl">${f.label}</span><span class="${f.cssClass} id-field-value"></span></div>`).join('')}</div></div><div class="pc-footer pc-green-footer"><span>${t.footer.issued}</span><span>${t.footer.valid}</span><span>${t.footer.number}</span></div></div>`;
  }

  _buildHutuCard(t) {
    return `<div class="physical-card hutu-card"><div class="pc-header-band pc-green"><span class="pc-republic">${t.headerBand.republic}</span><span class="pc-type">${t.headerBand.type}</span></div><div class="pc-body"><div class="pc-photo-col"><div class="pc-photo-box"><img src="images/rwanda-hutu-photo.png" alt="Identity photo" class="pc-photo-img"/><div class="pc-photo-label">${t.photoLabel}</div></div><svg class="pc-stamp" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="none" stroke="rgba(60,30,120,0.65)" stroke-width="1.5"/><circle cx="22" cy="22" r="16" fill="rgba(60,30,120,0.1)" stroke="rgba(60,30,120,0.4)" stroke-width="0.8"/><text x="22" y="14" text-anchor="middle" font-size="3.5" fill="rgba(60,30,120,0.78)" font-family="Times New Roman">${t.stamp.line1}</text><text x="22" y="23" text-anchor="middle" font-size="4.8" font-weight="700" fill="rgba(60,30,120,0.88)" font-family="Times New Roman">${t.stamp.line2}</text><text x="22" y="30" text-anchor="middle" font-size="3.5" fill="rgba(60,30,120,0.65)" font-family="Times New Roman">${t.stamp.line3}</text></svg></div><div class="pc-fields">${t.fields.map(f=>`<div class="pc-field"><span class="pc-lbl">${f.label}</span><span class="${f.cssClass} id-field-value"></span></div>`).join('\n')}</div></div><div class="pc-footer pc-green-footer"><span>${t.footer.issued}</span><span>${t.footer.valid}</span><span>${t.footer.number}</span></div></div>`;
  }

  _buildUnCard(t) {
    return `<div class="physical-card un-card"><div class="un-stripe"></div><div class="pc-header-band pc-un"><span class="pc-republic" style="letter-spacing:2px;">${t.headerBand.republic}</span><span class="pc-type">${t.headerBand.type}</span></div><div class="pc-body" style="padding-left:18px;"><div class="pc-photo-col"><div class="pc-photo-box pc-photo-un"><img src="images/rwanda-un-photo.png" alt="Personnel photo" class="pc-photo-img"/><div class="pc-photo-label" style="color:#3a5a7a;">${t.photoLabel}</div></div><svg class="pc-stamp" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="none" stroke="rgba(0,88,154,0.6)" stroke-width="1.5"/><circle cx="22" cy="22" r="16" fill="rgba(0,88,154,0.1)" stroke="rgba(0,88,154,0.35)" stroke-width="0.8"/><text x="22" y="13" text-anchor="middle" font-size="3.2" fill="rgba(0,88,154,0.8)" font-family="Arial">${t.stamp.line1}</text><text x="22" y="23" text-anchor="middle" font-size="5" font-weight="700" fill="rgba(0,88,154,0.9)" font-family="Arial">${t.stamp.line2}</text><text x="22" y="30" text-anchor="middle" font-size="3.2" fill="rgba(0,88,154,0.7)" font-family="Arial">${t.stamp.line3}</text></svg></div><div class="pc-fields">${t.fields.map(f=>`<div class="pc-field"><span class="pc-lbl un-lbl">${f.label}</span><span class="${f.cssClass} id-field-value"></span></div>`).join('\n')}</div></div><div class="un-rank-bar"><div class="un-rank-badge">${t.rankBar.badge}</div><div class="un-medals"><div class="un-medal un-medal-blue"></div><div class="un-medal un-medal-purple"></div></div><span class="un-brassard">${t.rankBar.brassard}</span></div><div class="pc-footer pc-un-footer"><span>${t.footer.issued}</span><span>${t.footer.valid}</span><span>${t.footer.number}</span></div></div>`;
  }

  _buildHTML(roleKey, uiText) {
    const cardHTML = this._buildCardHTML(roleKey);
    return `
<button id="mb-back-button" class="back-button" aria-label="Back to role selection">← Back</button>
<div class="mb-paper">
  <div class="mb-mast">
    <div class="mb-mast-name">${uiText.masthead.name}</div>
    <div class="mb-rule-double"></div>
    <div class="mb-meta">
      <span id="m-vol">Vol. LXI</span>
      <span id="m-date">Kigali, Rwanda</span>
      <span id="m-price">Cinq francs</span>
    </div>
  </div>
  <div id="mb-content">
    <div class="mb-dateline-el" id="mb-dateline"></div>
    <div class="mb-col-rule"><div class="mb-col-dot"></div></div>
    <div class="mb-headline sz-lg" id="hl"></div>
    <div class="mb-deck-el" id="mb-deck"></div>
    <div class="mb-byline">${uiText.masthead.byline}</div>
    <div class="mb-body-el" id="mb-body"></div>
    <div class="mb-ticker-el" id="mb-ticker"></div>
    <button class="mb-cont-btn" id="mb-cont" style="opacity:0;pointer-events:none"></button>
  </div>
  <div id="mb-card-section">
    <div class="mb-card-eyebrow">${uiText.cardEyebrow}</div>
    ${cardHTML}
    <div id="mb-id-note"></div>
    <div id="mb-final-bar">
      <div id="mb-final-text"></div>
      <button class="mb-cont-btn" id="mb-begin" style="margin-top:0.8rem;opacity:0;pointer-events:none">${uiText.buttons.enterMission}</button>
    </div>
  </div>
</div>`;
  }

  _showCard(card, final, onComplete, isHaymarket = false) {
    const content = this.container.querySelector('#mb-content');
    content.style.display = 'none';
    const cardSec = this.container.querySelector('#mb-card-section');
    cardSec.style.display = 'block';

    const fieldEls   = cardSec.querySelectorAll('.id-field-value');
    const fieldValues = card.rows.map(r => r[1]);
    let fi = 0;

    const typeFields = () => {
      if (fi >= fieldEls.length) { typeNote(); return; }
      const el  = fieldEls[fi];
      const txt = fieldValues[fi];
      el.textContent = '';
      let j = 0;
      const iv = setInterval(() => {
        j++;
        el.textContent = txt.slice(0, j);
        if (j >= txt.length) { clearInterval(iv); fi++; setTimeout(typeFields, 28); }
      }, 16);
    };

    const noteEl = cardSec.querySelector('#mb-id-note');
    noteEl.innerHTML = '';

    const typeNote = () => {
      const text = card.note;
      let j = 0;
      noteEl.innerHTML = '<span class="mb-cursor"></span>';
      const iv = setInterval(() => {
        j++;
        noteEl.innerHTML = text.slice(0, j) + '<span class="mb-cursor"></span>';
        if (j >= text.length) { clearInterval(iv); noteEl.innerHTML = text; setTimeout(typeFinal, 80); }
      }, 9);
    };

    const finalBar = cardSec.querySelector('#mb-final-bar');
    const finalEl  = cardSec.querySelector('#mb-final-text');
    const beginBtn = cardSec.querySelector('#mb-begin');

    const typeFinal = () => {
      finalBar.style.display = 'block';
      const plain = final.replace(/<[^>]+>/g, '');
      let j = 0;
      finalEl.innerHTML = '<span class="mb-cursor"></span>';
      const iv = setInterval(() => {
        j++;
        finalEl.innerHTML = plain.slice(0, j) + '<span class="mb-cursor"></span>';
        if (j >= plain.length) {
          clearInterval(iv);
          finalEl.innerHTML = final;
          beginBtn.style.opacity = '1';
          beginBtn.style.pointerEvents = 'all';
        }
      }, 13);
    };

    beginBtn.style.opacity = '0';
    beginBtn.style.pointerEvents = 'none';
    beginBtn.addEventListener('click', () => { this._cleanup(); onComplete(); });
    typeFields();
  }

  // ─── Key mapping helpers ────────────────────────────────────────────────────

  _getRoleKey(roleId) {
    if (roleId === 'ud-resident')                                return 'ud-resident';
    if (roleId.includes('hutu'))                                 return 'hutu';
    if (roleId.includes('tutsi'))                                return 'tutsi';
    if (roleId.includes('un') || roleId.includes('peacekeeper')) return 'un';
    return null;
  }

  _getCardKey(roleId) {
    if (roleId === 'hm-lucy-parsons') return 'hm-lucy-parsons';
    if (roleId === 'hm-karl-brenner') return 'hm-karl-brenner';
    if (roleId === 'hm-james-doyle')  return 'hm-james-doyle';
    return this._getRoleKey(roleId);
  }

  _getFinalKey(roleId) {
    if (roleId === 'hm-lucy-parsons') return 'hm-lucy-parsons';
    if (roleId === 'hm-karl-brenner') return 'hm-karl-brenner';
    if (roleId === 'hm-james-doyle')  return 'hm-james-doyle';
    if (roleId === 'ud-resident')     return 'ud-resident';
    return this._getRoleKey(roleId);
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  _cleanup() {
    if (this._activeIv) { clearInterval(this._activeIv); this._activeIv = null; }
    this._seqToken = (this._seqToken || 0) + 1;
    const old = document.getElementById('mission-briefing-overlay');
    if (old) old.remove();
    // Disable Tribune CSS when closing any briefing — it will be re-enabled
    // next time a Haymarket briefing opens via _enableTribuneCSS().
    this._disableTribuneCSS();
    this.container = null;
  }

  _setText(id, text) {
    const el = this.container.querySelector('#' + id);
    if (el) el.textContent = text;
  }

  _typeSequence(tasks, done) {
    if (this._activeIv) { clearInterval(this._activeIv); this._activeIv = null; }
    const token = ++this._seqToken;
    let i = 0;
    const run = () => {
      if (token !== this._seqToken || !this.container) return;
      if (i >= tasks.length) { if (done) done(); return; }
      const t    = tasks[i++];
      const el   = this.container.querySelector('#' + t.id);
      if (!el) { setTimeout(run, 10); return; }
      const text  = t.text;
      const speed = t.speed || 18;
      let   j     = 0;
      el.innerHTML = '<span class="mb-cursor"></span>';
      this._activeIv = setInterval(() => {
        if (token !== this._seqToken) { clearInterval(this._activeIv); return; }
        j++;
        el.innerHTML = text.slice(0, j) + '<span class="mb-cursor"></span>';
        if (j >= text.length) {
          clearInterval(this._activeIv);
          this._activeIv = null;
          el.innerHTML = text;
          setTimeout(run, t.pause || 40);
        }
      }, speed);
    };
    run();
  }
}

export default MissionBriefing;
