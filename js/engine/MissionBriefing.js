/**
 * MissionBriefing - Pre-mission newspaper briefing screen
 *
 * Intercepts the role:selected event and displays a role-specific
 * newspaper briefing before Scene 01 loads. Calls onComplete()
 * when the student clicks "Enter the mission".
 *
 * Architecture: Engine logic only, content imported from content layer.
 * CSS in css/style.css, all text content in briefing-content.js
 * Requirements: US-2.1, TR-2.2
 */

import { 
  BRIEFING_PAGES    as RW_PAGES,
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
  BRIEFING_PAGES_KEYED as HM_PAGES,
  BRIEFING_CARDS_KEYED as HM_CARDS,
  BRIEFING_FINALS_KEYED as HM_FINALS,
  BRIEFING_UI_TEXT  as HM_UI_TEXT,
  BRIEFING_CARD_TEMPLATES as HM_TEMPLATES
} from '../content/missions/haymarket/briefing-content.js';

import glossaryTooltip from './GlossaryTooltip.js';

// Merge all missions' content into unified lookup objects keyed by roleKey.
// Rwanda roleKeys: 'hutu' | 'tutsi' | 'un'
// Urban Design roleKey: 'ud-resident'
// Haymarket roleKeys: 'hm-lucy-parsons' | 'hm-karl-brenner' | 'hm-james-doyle'
const BRIEFING_PAGES          = { ...RW_PAGES,     ...UD_PAGES,     ...HM_PAGES     };
const BRIEFING_CARDS          = { ...RW_CARDS,     ...UD_CARDS,     ...HM_CARDS     };
const BRIEFING_FINALS         = { ...RW_FINALS,    ...UD_FINALS,    ...HM_FINALS    };
const BRIEFING_CARD_TEMPLATES = { ...RW_TEMPLATES, ...UD_TEMPLATES, ...HM_TEMPLATES };

// UI text is per-mission (masthead name differs). Resolved in show() by missionId.
const BRIEFING_UI_TEXT_MAP = {
  'rwanda-genocide':   RW_UI_TEXT,
  'aphg-urban-design': UD_UI_TEXT,
  'haymarket-affair':  HM_UI_TEXT
};

class MissionBriefing {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.container = null;
    this._activeIv  = null;   // active setInterval handle
    this._seqToken  = 0;      // increments each time a new sequence starts
  }

  hasBriefing(missionId) {
    return missionId === 'rwanda-genocide'
        || missionId === 'aphg-urban-design'
        || missionId === 'haymarket-affair';
  }

  show(_missionId, roleId, onComplete) {
    const roleKey  = this._getRoleKey(roleId);
    const uiText   = BRIEFING_UI_TEXT_MAP[_missionId] || RW_UI_TEXT;
    const pages    = BRIEFING_PAGES[roleKey];
    const card     = BRIEFING_CARDS[roleKey];
    const final    = BRIEFING_FINALS[roleKey];

    if (!pages || !card || !final) {
      console.warn(`MissionBriefing: No briefing data for roleId "${roleId}" — skipping.`);
      onComplete();
      return;
    }

    this._cleanup();

    this.container = document.createElement('div');
    this.container.id = 'mission-briefing-overlay';
    this.container.innerHTML = this._buildHTML(roleKey, uiText);
    document.getElementById('app').appendChild(this.container);
    
    // Show intro tooltip immediately (non-blocking)
    // Do NOT apply glossary highlighting yet — it mutates innerHTML and corrupts the typewriter
    glossaryTooltip.showIntro(_missionId);

    // Add back button handler
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
      const p = pages[i];
      const isLast = (i === pages.length - 1);
      typing = true;

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

        // Fire stimulus documents for this briefing page (Haymarket Phase 1)
        // StimuliManager listens for briefing:stimuli-unlock and handles deduplication
        if (p.stimuliUnlock && p.stimuliUnlock.length > 0) {
          this.eventBus.emit('briefing:stimuli-unlock', { documentIds: p.stimuliUnlock });
        }
        
        // Apply glossary only to text content elements, NOT the whole container.
        // Passing this.container rewrites all innerHTML including the button, resetting it to hidden.
        ['mb-dateline', 'hl', 'mb-deck', 'mb-body', 'mb-ticker'].forEach(id => {
          const el = this.container.querySelector('#' + id);
          if (el) glossaryTooltip.apply(el);
        });
      });
    };

    this.container.querySelector('#mb-cont').addEventListener('click', () => {
      if (typing) return;
      pageIdx++;
      if (pageIdx < pages.length) {
        showPage(pageIdx);
      } else {
        this._showCard(card, final, onComplete);
      }
    });

    showPage(0);
  }

  // --- Private helpers ------------------------------------------------------

  _getRoleKey(roleId) {
    if (roleId === 'ud-resident')                                    return 'ud-resident';
    if (roleId === 'hm-lucy-parsons')                                return 'hm-lucy-parsons';
    if (roleId === 'hm-karl-brenner')                                return 'hm-karl-brenner';
    if (roleId === 'hm-james-doyle')                                 return 'hm-james-doyle';
    if (roleId.includes('hutu'))                                     return 'hutu';
    if (roleId.includes('tutsi'))                                    return 'tutsi';
    if (roleId.includes('un') || roleId.includes('peacekeeper'))     return 'un';
    return null;
  }

  _cleanup() {
    if (this._activeIv) {
      clearInterval(this._activeIv);
      this._activeIv = null;
    }
    // Invalidate any in-flight sequence
    this._seqToken = (this._seqToken || 0) + 1;
    const old = document.getElementById('mission-briefing-overlay');
    if (old) old.remove();
    this.container = null;
  }

  _setText(id, text) {
    const el = this.container.querySelector('#' + id);
    if (el) el.textContent = text;
  }

  _typeSequence(tasks, done) {
    // Kill any previously running interval before starting a new sequence.
    // Without this, old intervals race with the new sequence and the `done`
    // callback (which reveals the continue button) never fires reliably.
    if (this._activeIv) {
      clearInterval(this._activeIv);
      this._activeIv = null;
    }

    // Capture a sequence token so a stale interval from a cancelled sequence
    // can detect it has been superseded and bail out.
    const token = ++this._seqToken;

    let i = 0;
    const run = () => {
      // Bail if this sequence has been superseded or container is gone
      if (token !== this._seqToken || !this.container) return;

      if (i >= tasks.length) { if (done) done(); return; }
      const t     = tasks[i++];
      const el    = this.container.querySelector('#' + t.id);
      if (!el) { setTimeout(run, 10); return; }
      const text  = t.text;
      const speed = t.speed || 18;
      let   j     = 0;
      el.innerHTML = '<span class="mb-cursor"></span>';

      this._activeIv = setInterval(() => {
        // Bail if superseded mid-interval
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

  _showCard(card, final, onComplete) {
    const content = this.container.querySelector('#mb-content');
    content.style.display = 'none';

    const cardSec = this.container.querySelector('#mb-card-section');
    cardSec.style.display = 'block';

    const fieldEls = cardSec.querySelectorAll('.id-field-value');
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
    if (noteEl) noteEl.innerHTML = '';

    const typeNote = () => {
      if (!noteEl) { typeFinal(); return; }
      const text = card.note;
      let j = 0;
      noteEl.innerHTML = '<span class="mb-cursor"></span>';
      const iv = setInterval(() => {
        j++;
        noteEl.innerHTML = text.slice(0, j) + '<span class="mb-cursor"></span>';
        if (j >= text.length) {
          clearInterval(iv);
          noteEl.innerHTML = text;
          setTimeout(typeFinal, 80);
        }
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
    beginBtn.addEventListener('click', () => {
      this._cleanup();
      onComplete();
    });

    typeFields();
  }

  _buildCardHTML(roleKey) {
    const template = BRIEFING_CARD_TEMPLATES[roleKey];
    if (!template) return '';

    if (roleKey === 'tutsi')          return this._buildTutsiCard(template);
    if (roleKey === 'hutu')           return this._buildHutuCard(template);
    if (roleKey === 'un')             return this._buildUnCard(template);
    if (roleKey === 'ud-resident')    return this._buildUrbanResidentCard(template);
    if (roleKey === 'hm-lucy-parsons'
     || roleKey === 'hm-karl-brenner'
     || roleKey === 'hm-james-doyle') return this._buildHaymarketCard(template, roleKey);
    return '';
  }

  _buildHaymarketCard(t, roleKey) {
    if (roleKey === 'hm-lucy-parsons') return this._buildLucyParsonsCard(t);
    if (roleKey === 'hm-karl-brenner') return this._buildKarlBrennerCard(t);
    if (roleKey === 'hm-james-doyle')  return this._buildJamesDoyleCard(t);
    return '';
  }

  _buildLucyParsonsCard(t) {
    const cardData = BRIEFING_CARDS['hm-lucy-parsons'];
    const rowsHTML = (cardData?.rows || []).map(([label]) =>
      `<div class="surv-field"><div class="surv-field-label">${label}</div><div class="surv-field-value id-field-value"></div></div>`
    ).join('\n        ');

    return `<div class="hm-surveillance-card">
  <div class="surv-header">
    <div>
      <div class="surv-dept">City of Chicago</div>
      <div class="surv-dept" style="font-size:0.7rem;color:#e8dcc4;">Police Department</div>
      <div class="surv-dept" style="margin-top:2px;">Bureau of Criminal Intelligence</div>
    </div>
    <svg class="surv-shield" viewBox="0 0 40 46" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2 L38 10 L38 30 C38 38 20 44 20 44 C20 44 2 38 2 30 L2 10 Z" fill="none" stroke="#c8c0a0" stroke-width="2"/>
      <path d="M20 8 L33 14 L33 29 C33 35 20 40 20 40 C20 40 7 35 7 29 L7 14 Z" fill="rgba(200,192,160,0.12)" stroke="#c8c0a0" stroke-width="1"/>
      <text x="20" y="23" text-anchor="middle" font-size="6" fill="#c8c0a0" font-family="serif" font-style="italic">CHICAGO</text>
      <text x="20" y="30" text-anchor="middle" font-size="5" fill="#c8c0a0" font-family="serif">I WILL</text>
    </svg>
  </div>
  <div class="surv-classification">▲ CONFIDENTIAL — LABOR INTELLIGENCE FILE ▲</div>
  <div class="surv-body">
    <div class="surv-photo-col">
      <div class="surv-photo-frame">
        <svg viewBox="0 0 130 160" xmlns="http://www.w3.org/2000/svg">
          <rect width="130" height="160" fill="#a09070"/>
          <path d="M35 95 Q50 110 65 115 Q80 110 95 95 L100 155 L30 155 Z" fill="#5a4020" opacity="0.8"/>
          <path d="M45 60 Q50 65 65 67 Q80 65 85 60 L90 95 Q80 98 65 100 Q50 98 40 95 Z" fill="#4a3018" opacity="0.9"/>
          <rect x="61" y="45" width="8" height="18" fill="#c8a870" opacity="0.9" rx="2"/>
          <ellipse cx="65" cy="36" rx="17" ry="20" fill="#c8a870" opacity="0.95"/>
          <path d="M48 26 Q50 15 65 14 Q80 15 82 26 Q78 18 65 17 Q52 18 48 26Z" fill="#3a2010" opacity="0.9"/>
          <path d="M65 14 L65 8 Q72 10 76 16" stroke="#3a2010" stroke-width="2" fill="none" opacity="0.7"/>
          <path d="M50 60 Q56 55 65 54 Q74 55 80 60" stroke="#8a7050" stroke-width="1.5" fill="none" opacity="0.8"/>
          <rect x="58" y="53" width="14" height="6" rx="3" fill="#8a7050" opacity="0.7"/>
          <path d="M40 75 Q32 85 34 100" stroke="#4a3018" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.8"/>
          <path d="M90 75 Q98 85 96 100" stroke="#4a3018" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.8"/>
          <ellipse cx="34" cy="103" rx="5" ry="6" fill="#c8a870" opacity="0.8"/>
          <ellipse cx="96" cy="103" rx="5" ry="6" fill="#c8a870" opacity="0.8"/>
          <rect x="0" y="140" width="130" height="20" fill="#3a2a10" opacity="0.3"/>
        </svg>
      </div>
      <div class="surv-photo-label">SUBJECT PHOTOGRAPH<br>ON FILE — BUREAU COPY</div>
      <div class="surv-file-num">FILE NO. CPD-1886-0441</div>
    </div>
    <div class="surv-fields">
      ${rowsHTML}
    </div>
  </div>
  <div class="surv-notes">
    <span class="surv-notes-label">Intelligence Notes — Filed by Det. Sgt. M. Bonfield</span>
    <span id="mb-id-note" style="display:block;"></span>
  </div>
  <svg class="surv-stamp" viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <path id="topArc" d="M17 55 a38 38 0 1 1 76 0"/>
      <path id="botArc" d="M93 55 a38 38 0 1 1 -76 0"/>
    </defs>
    <circle cx="55" cy="55" r="52" fill="none" stroke="#8b1a1a" stroke-width="3"/>
    <circle cx="55" cy="55" r="44" fill="none" stroke="#8b1a1a" stroke-width="1.5"/>
    <text font-size="8" font-family="Oswald,sans-serif" font-weight="700" fill="#8b1a1a" letter-spacing="3">
      <textPath href="#topArc">ACTIVE · SURVEILLANCE · CPD</textPath>
    </text>
    <text font-size="7" font-family="Oswald,sans-serif" fill="#8b1a1a" letter-spacing="2">
      <textPath href="#botArc">BUREAU OF CRIMINAL INTELLIGENCE</textPath>
    </text>
    <text x="55" y="52" text-anchor="middle" font-size="9" font-weight="700" font-family="Oswald,sans-serif" fill="#8b1a1a">1886</text>
    <text x="55" y="63" text-anchor="middle" font-size="7" font-family="Oswald,sans-serif" fill="#8b1a1a">CHICAGO</text>
  </svg>
  <div class="surv-footer">
    <span>${t.footer.issued}</span>
    <span>Reviewed: Weekly</span>
    <span>Classification: RESTRICTED</span>
  </div>
</div>`;
  }

  _buildKarlBrennerCard(t) {
    const cardData = BRIEFING_CARDS['hm-karl-brenner'];
    const rowsHTML = (cardData?.rows || []).map(([label]) =>
      `<div class="emp-row"><div class="emp-row-label">${label}</div><div class="emp-row-value id-field-value"></div></div>`
    ).join('\n        ');

    return `<div class="hm-employee-card">
  <div class="emp-header">
    <div>
      <div class="emp-company">McCormick Harvesting Machine Co.</div>
      <div class="emp-est" style="margin-top:3px;font-style:italic;">Blue Island Avenue · Chicago, Illinois</div>
    </div>
    <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" opacity="0.7">
      <circle cx="18" cy="18" r="16" fill="none" stroke="#c8a830" stroke-width="1.5"/>
      <path d="M8 26 Q12 16 18 12 Q24 8 30 10" stroke="#c8a830" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="8" cy="26" r="3" fill="#c8a830"/>
      <line x1="8" y1="26" x2="5" y2="30" stroke="#c8a830" stroke-width="2"/>
      <line x1="8" y1="26" x2="10" y2="30" stroke="#c8a830" stroke-width="2"/>
      <text x="18" y="34" text-anchor="middle" font-size="4" fill="#c8a830" font-family="serif">EST. 1847</text>
    </svg>
  </div>
  <div class="emp-rule"></div>
  <div class="emp-title-band">
    <div class="emp-doc-title">Employee Record &amp; Service Ledger</div>
    <div class="emp-year">FISCAL YEAR 1886</div>
  </div>
  <div class="emp-body">
    <div class="emp-worker-banner">
      <div>
        <div class="emp-worker-number">EMPLOYEE #2847</div>
        <div class="emp-worker-label">Foundry — Press Operations</div>
      </div>
      <div class="emp-status">LOCKOUT</div>
    </div>
    <div class="emp-grid">
      ${rowsHTML}
    </div>
    <div class="emp-note">
      <span class="emp-note-label">Superintendent's Note</span>
      <span id="mb-id-note" style="display:block;"></span>
    </div>
  </div>
  <svg class="emp-stamp" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
    <circle cx="45" cy="45" r="40" fill="none" stroke="#2a3520" stroke-width="3"/>
    <circle cx="45" cy="45" r="12" fill="#2a3520"/>
    <circle cx="45" cy="45" r="5" fill="#f2ead8"/>
    <g fill="#2a3520">
      <rect x="42" y="3" width="6" height="10" rx="1"/>
      <rect x="42" y="77" width="6" height="10" rx="1"/>
      <rect x="3" y="42" width="10" height="6" rx="1"/>
      <rect x="77" y="42" width="10" height="6" rx="1"/>
      <rect x="15" y="14" width="8" height="8" rx="1" transform="rotate(45 19 18)"/>
      <rect x="65" y="14" width="8" height="8" rx="1" transform="rotate(45 69 18)"/>
      <rect x="15" y="64" width="8" height="8" rx="1" transform="rotate(45 19 68)"/>
      <rect x="65" y="64" width="8" height="8" rx="1" transform="rotate(45 69 68)"/>
    </g>
    <text x="45" y="52" text-anchor="middle" font-size="7" font-family="Oswald,sans-serif" fill="#f2ead8" font-weight="700">McCORMICK</text>
  </svg>
  <div class="emp-footer">
    <span>${t.footer.number}</span>
    <span>${t.footer.valid}</span>
    <span>Pinkerton copies: on file</span>
  </div>
</div>`;
  }

  _buildJamesDoyleCard(t) {
    const cardData = BRIEFING_CARDS['hm-james-doyle'];
    const rowsHTML = (cardData?.rows || []).map(([label]) =>
      `<div class="pink-field"><div class="pink-field-label">${label}</div><div class="pink-field-value id-field-value"></div></div>`
    ).join('\n        ');

    return `<div class="hm-pinkerton-card">
  <div class="pink-header">
    <div>
      <div class="pink-agency">Pinkerton National Detective Agency</div>
      <div style="font-family:'Courier Prime',monospace;font-size:0.5rem;color:#7a6a40;letter-spacing:1px;margin-top:2px;">CHICAGO FIELD OFFICE — 191 DEARBORN STREET</div>
    </div>
    <div class="pink-eye">
      <svg width="38" height="28" viewBox="0 0 38 28" xmlns="http://www.w3.org/2000/svg" opacity="0.8">
        <path d="M2 14 Q10 2 19 2 Q28 2 36 14 Q28 26 19 26 Q10 26 2 14Z" fill="none" stroke="#c8a830" stroke-width="1.5"/>
        <circle cx="19" cy="14" r="6" fill="none" stroke="#c8a830" stroke-width="1.5"/>
        <circle cx="19" cy="14" r="2.5" fill="#c8a830"/>
        <line x1="19" y1="3" x2="19" y2="6" stroke="#c8a830" stroke-width="1"/>
        <line x1="19" y1="22" x2="19" y2="25" stroke="#c8a830" stroke-width="1"/>
      </svg>
      <div class="pink-eye-text">We Never<br>Sleep</div>
    </div>
  </div>
  <div class="pink-case-band">
    <div>
      <div style="font-size:0.48rem;color:#6a4a10;letter-spacing:2px;font-family:'Oswald',sans-serif;text-transform:uppercase;">Assignment No.</div>
      <div class="pink-case-num">CHI-1886-114</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:0.48rem;color:#6a4a10;letter-spacing:2px;font-family:'Oswald',sans-serif;text-transform:uppercase;margin-bottom:2px;">Opened</div>
      <div class="pink-date">03 FEB 1886</div>
    </div>
  </div>
  <div class="pink-body">
    <div class="pink-classify-bar">◆ &nbsp; OPERATIVE ASSIGNMENT — INTERNAL USE ONLY &nbsp; ◆</div>
    ${rowsHTML}
    <div class="pink-divider"></div>
    <div class="pink-instructions">
      <span class="pink-instructions-label">Standing Instructions / Notes</span>
      <div class="pink-instructions-text">
        <span id="mb-id-note"></span>
      </div>
    </div>
  </div>
  <svg class="pink-stamp" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 30 Q20 4 40 4 Q60 4 78 30 Q60 56 40 56 Q20 56 2 30Z" fill="none" stroke="#1a1a1a" stroke-width="4"/>
    <circle cx="40" cy="30" r="14" fill="none" stroke="#1a1a1a" stroke-width="4"/>
    <circle cx="40" cy="30" r="6" fill="#1a1a1a"/>
  </svg>
  <div class="pink-footer">
    <span>${t.footer.issued} · ${t.footer.valid}</span>
    <span class="pink-warning">UNAUTHORIZED DISCLOSURE PROHIBITED</span>
  </div>
</div>`;
  }

  _buildUrbanResidentCard(t) {
    return `<div class="physical-card ud-deed-card">
  <div class="pc-header-band pc-deed-header">
    <span class="pc-republic" style="letter-spacing:2px;">${t.headerBand.republic}</span>
    <span class="pc-type">${t.headerBand.type}</span>
  </div>
  <div class="pc-body">
    <div class="pc-photo-col">
      <div class="pc-photo-box pc-photo-deed">
        <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" width="70" height="70" style="opacity:0.85;">
          <polygon points="40,8 72,32 8,32" fill="#8a6a3a" stroke="#5a4020" stroke-width="1.5"/>
          <rect x="16" y="32" width="48" height="36" fill="#c8a870" stroke="#8a6a3a" stroke-width="1"/>
          <rect x="32" y="48" width="16" height="20" fill="#6a4a20" stroke="#5a3a10" stroke-width="0.8"/>
          <rect x="20" y="36" width="10" height="10" fill="#d4c090" stroke="#8a6a3a" stroke-width="0.6"/>
          <rect x="50" y="36" width="10" height="10" fill="#d4c090" stroke="#8a6a3a" stroke-width="0.6"/>
        </svg>
        <div class="pc-photo-label" style="color:#5a3a10;">${t.photoLabel}</div>
      </div>
      <svg class="pc-stamp" viewBox="0 0 44 44" style="transform:rotate(-8deg); opacity:0.82;">
        <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(160,20,20,0.7)" stroke-width="2"/>
        <circle cx="22" cy="22" r="16" fill="rgba(160,20,20,0.1)" stroke="rgba(160,20,20,0.4)" stroke-width="1"/>
        <text x="22" y="13" text-anchor="middle" font-size="3" fill="rgba(160,20,20,0.85)" font-family="Times New Roman">${t.stamp.line1}</text>
        <text x="22" y="24" text-anchor="middle" font-size="6" font-weight="700" fill="rgba(160,20,20,0.95)" font-family="Times New Roman">${t.stamp.line2}</text>
        <text x="22" y="31" text-anchor="middle" font-size="3" fill="rgba(160,20,20,0.75)" font-family="Times New Roman">${t.stamp.line3}</text>
      </svg>
    </div>
    <div class="pc-fields">
      ${t.fields.map(f => `<div class="pc-field"><span class="pc-lbl ud-lbl">${f.label}</span><span class="${f.cssClass} id-field-value"></span></div>`).join('\n      ')}
    </div>
  </div>
  <div class="pc-footer ud-deed-footer">
    <span>${t.footer.issued}</span><span>${t.footer.valid}</span><span>${t.footer.number}</span>
  </div>
  <div class="pc-age-tint pc-age-pristine"></div>
</div>`;
  }

_buildTutsiCard(t) {
    return `<div class="physical-card tutsi-card">
      <div class="pc-header-band pc-green">
        <span class="pc-republic">${t.headerBand.republic}</span>
        <span class="pc-type">${t.headerBand.type}</span>
      </div>
      <div class="pc-body">
        <div class="pc-photo-col">
          <div class="pc-photo-box">
            <img src="images/rwanda-tutsi-photo.png" alt="Identity photo" class="pc-photo-img" style="filter: sepia(0.3) contrast(1.1) brightness(0.9);" />
            <div class="pc-photo-label">${t.photoLabel}</div>
          </div>
          <svg class="pc-stamp" viewBox="0 0 44 44" style="transform: rotate(-12deg); filter: url(#inkBleed); opacity: 0.7;">
            <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(60,30,120,0.6)" stroke-width="1.5"/>
            <circle cx="22" cy="22" r="16" fill="rgba(60,30,120,0.12)" stroke="rgba(60,30,120,0.4)" stroke-width="0.8"/>
            <text x="22" y="14" text-anchor="middle" font-size="4" fill="rgba(60,30,120,0.75)" font-family="Times New Roman" letter-spacing="0.5">${t.stamp.line1}</text>
            <text x="22" y="23" text-anchor="middle" font-size="5.5" font-weight="700" fill="rgba(60,30,120,0.85)" font-family="Times New Roman">${t.stamp.line2}</text>
            <text x="22" y="30" text-anchor="middle" font-size="3.5" fill="rgba(60,30,120,0.65)" font-family="Times New Roman">${t.stamp.line3}</text>
          </svg>
        </div>
        <div class="pc-fields" style="filter: url(#inkBleed);">
          ${t.fields.map(f => `<div class="pc-field"><span class="pc-lbl">${f.label}</span><span class="${f.cssClass} id-field-value"></span></div>`).join('')}
        </div>
      </div>
      <div class="pc-footer pc-green-footer">
        <span>${t.footer.issued}</span><span>${t.footer.valid}</span><span>${t.footer.number}</span>
      </div>
      <div class="pc-age-tint" style="background: radial-gradient(circle, transparent 20%, rgba(101, 67, 33, 0.15) 80%, rgba(60, 40, 20, 0.35) 100%);"></div>
      <svg class="pc-distress" viewBox="0 0 480 230" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style="mix-blend-mode: multiply;">
        <defs>
          <filter id="db1"><feGaussianBlur stdDeviation="3"/></filter>
          <filter id="db2"><feGaussianBlur stdDeviation="6"/></filter>
          <filter id="fray">
            <feTurbulence type="fractalNoise" baseFrequency="0.12" numOctaves="4" seed="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
          </filter>
          <filter id="inkBleed">
            <feGaussianBlur stdDeviation="0.4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <rect x="239" y="0" width="2" height="230" fill="rgba(0,0,0,0.2)" filter="url(#db1)" />
        <rect x="240" y="0" width="1" height="230" fill="rgba(255,255,255,0.1)" />
        <path d="M210 95 C250 80, 280 110, 250 140 C220 160, 190 120, 210 95Z" fill="rgba(72,48,10,0.2)" filter="url(#db2)"/>
        <path d="M40 160 C80 150, 100 200, 60 220 C20 240, 10 180, 40 160Z" fill="rgba(58,38,7,0.25)" filter="url(#db2)"/>
        <g filter="url(#fray)">
          <path d="M480 230 L480 190 C450 195, 430 170, 400 175 L480 230Z" fill="#0a0e1a"/>
          <path d="M0 230 L0 205 C30 210, 40 225, 60 220 L0 230Z" fill="#0a0e1a"/>
          <path d="M0 0 L15 0 C10 10, 5 15, 0 20 L0 0Z" fill="#0a0e1a"/>
          <path d="M480 0 L460 0 C470 15, 475 25, 480 30 L480 0Z" fill="#0a0e1a"/>
        </g>
      </svg>
    </div>`;
  }

  _buildHutuCard(t) {
    return `<div class="physical-card hutu-card">
  <div class="pc-header-band pc-green">
    <span class="pc-republic">${t.headerBand.republic}</span>
    <span class="pc-type">${t.headerBand.type}</span>
  </div>
  <div class="pc-body">
    <div class="pc-photo-col">
      <div class="pc-photo-box">
        <img src="images/rwanda-hutu-photo.png" alt="Identity photo" class="pc-photo-img" />
        <div class="pc-photo-label">${t.photoLabel}</div>
      </div>
      <svg class="pc-stamp" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(60,30,120,0.65)" stroke-width="1.5"/>
        <circle cx="22" cy="22" r="16" fill="rgba(60,30,120,0.1)" stroke="rgba(60,30,120,0.4)" stroke-width="0.8"/>
        <text x="22" y="14" text-anchor="middle" font-size="3.5" fill="rgba(60,30,120,0.78)" font-family="Times New Roman">${t.stamp.line1}</text>
        <text x="22" y="23" text-anchor="middle" font-size="4.8" font-weight="700" fill="rgba(60,30,120,0.88)" font-family="Times New Roman">${t.stamp.line2}</text>
        <text x="22" y="30" text-anchor="middle" font-size="3.5" fill="rgba(60,30,120,0.65)" font-family="Times New Roman">${t.stamp.line3}</text>
      </svg>
    </div>
    <div class="pc-fields">
      ${t.fields.map(f => `<div class="pc-field"><span class="pc-lbl">${f.label}</span><span class="${f.cssClass} id-field-value"></span></div>`).join('\n      ')}
    </div>
  </div>
  <div class="pc-footer pc-green-footer">
    <span>${t.footer.issued}</span><span>${t.footer.valid}</span><span>${t.footer.number}</span>
  </div>
  <div class="pc-age-tint pc-age-pristine"></div>
</div>`;
  }

  _buildUnCard(t) {
    return `<div class="physical-card un-card">
  <div class="un-stripe"></div>
  <div class="pc-header-band pc-un">
    <span class="pc-republic" style="letter-spacing:2px;">${t.headerBand.republic}</span>
    <span class="pc-type">${t.headerBand.type}</span>
  </div>
  <div class="pc-body" style="padding-left:18px;">
    <div class="pc-photo-col">
      <div class="pc-photo-box pc-photo-un">
        <img src="images/rwanda-un-photo.png" alt="Personnel photo" class="pc-photo-img" />
        <div class="pc-photo-label" style="color:#3a5a7a;">${t.photoLabel}</div>
      </div>
      <svg class="pc-stamp" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(0,88,154,0.6)" stroke-width="1.5"/>
        <circle cx="22" cy="22" r="16" fill="rgba(0,88,154,0.1)" stroke="rgba(0,88,154,0.35)" stroke-width="0.8"/>
        <text x="22" y="13" text-anchor="middle" font-size="3.2" fill="rgba(0,88,154,0.8)" font-family="Arial">${t.stamp.line1}</text>
        <text x="22" y="23" text-anchor="middle" font-size="5" font-weight="700" fill="rgba(0,88,154,0.9)" font-family="Arial">${t.stamp.line2}</text>
        <text x="22" y="30" text-anchor="middle" font-size="3.2" fill="rgba(0,88,154,0.7)" font-family="Arial">${t.stamp.line3}</text>
      </svg>
    </div>
    <div class="pc-fields">
      ${t.fields.map(f => `<div class="pc-field"><span class="pc-lbl un-lbl">${f.label}</span><span class="${f.cssClass} id-field-value"></span></div>`).join('\n      ')}
    </div>
  </div>
  <div class="un-rank-bar">
    <div class="un-rank-badge">${t.rankBar.badge}</div>
    <div class="un-medals">
      <div class="un-medal un-medal-blue"></div>
      <div class="un-medal un-medal-purple"></div>
    </div>
    <span class="un-brassard">${t.rankBar.brassard}</span>
  </div>
  <div class="pc-footer pc-un-footer">
    <span>${t.footer.issued}</span><span>${t.footer.valid}</span><span>${t.footer.number}</span>
  </div>
</div>`;
  }

  _buildHTML(roleKey, uiText) {
    const cardHTML = this._buildCardHTML(roleKey);
    const isHaymarket = roleKey && roleKey.startsWith('hm-');
    // Haymarket cards embed #mb-id-note inside the card itself; other cards need it outside.
    const noteDiv = isHaymarket ? '' : '<div id="mb-id-note"></div>';
    return `<button id="mb-back-button" class="back-button" aria-label="Back to role selection">← Back</button>
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
    ${noteDiv}
    <div id="mb-final-bar">
      <div id="mb-final-text"></div>
      <button class="mb-cont-btn" id="mb-begin" style="margin-top:0.8rem;opacity:0;pointer-events:none">${uiText.buttons.enterMission}</button>
    </div>
  </div>
</div>`;
  }
}

export default MissionBriefing;
