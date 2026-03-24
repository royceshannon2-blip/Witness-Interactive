/**
 * MissionBriefing - Pre-mission newspaper briefing screen
 *
 * Intercepts the role:selected event and displays a role-specific
 * newspaper briefing before Scene 01 loads. Calls onComplete()
 * when the student clicks "Enter the mission".
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
    this._tributeStyleEl = null;
  }

  hasBriefing(missionId) {
    return (missionId === 'rwanda-genocide' ||
            missionId === 'aphg-urban-design' ||
            missionId === 'haymarket-affair');
  }

  show(_missionId, roleId, onComplete) {
    const isHaymarket = _missionId === 'haymarket-affair';

    const pages  = isHaymarket
      ? HM_PAGES 
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

    glossaryTooltip.showIntro();

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

      this._setText('m-vol',   p.vol);
      this._setText('m-date',  p.date);
      this._setText('m-price', p.price);

      const hl = this.container.querySelector('#hl');
      hl.className = 'mb-headline ' + p.hSize + (p.hClass ? ' ' + p.hClass : '');
      hl.innerHTML = '';

      ['mb-dateline','mb-deck','mb-body','mb-ticker'].forEach(id => {
        const el = this.container.querySelector('#' + id);
        if (el) el.innerHTML = '';
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

  _enableTribuneCSS() {
    if (!this._tributeStyleEl) {
      const link = document.createElement('link');
      link.rel  = 'stylesheet';
      link.href = 'css/chicago-tribune-briefing.css';
      link.id   = 'tribune-briefing-css';
      document.head.appendChild(link);
      this._tributeStyleEl = link;
    }
    this._tributeStyleEl.disabled = false;
  }

  _disableTribuneCSS() {
    const el = document.getElementById('tribune-briefing-css');
    if (el) {
      el.disabled = true;
    }
  }

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

  _buildTribuneHTML(roleId, uiText, card) {
    const cardHTML = this._buildTribuneCardHTML(roleId, card);
    return `
<button id="mb-back-button" class="trib-back" aria-label="Back to role selection">← Back</button>
<div class="mb-paper">
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
  <div id="mb-content" class="trib-content">
    <div class="trib-section-rule">Latest Intelligence From the City and the Nation</div>
    <div class="trib-article-grid">
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
      <div class="trib-col">
        <div class="trib-ornament">— ✦ —</div>
        <div class="trib-body" id="trib-body-text"></div>
      </div>
      <div class="trib-col">
        <span class="trib-dateline">Dispatches</span>
        <div class="trib-col-rule"></div>
        <div class="trib-sidebar-item">
          <div class="trib-sidebar-head">THE STRIKE SITUATION</div>
          <div class="trib-sidebar-text">Eighty thousand workingmen have pledged to lay down their tools on May the first.</div>
        </div>
        <div class="trib-ticker" id="trib-ticker-text"></div>
      </div>
    </div>
    <button class="trib-cont-btn" id="mb-cont" style="opacity:0;pointer-events:none;margin-top:10px;"></button>
  </div>
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
        <div style="width:110px;height:140px;background:#b8a070;border:1px solid #6a5030;overflow:hidden;background-image:url('images/haymarket-lucy-parsons.png');background-size:cover;background-position:center;"></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:7px;padding-top:2px;">
        ${rows.map((row, i) => `<div style="border-bottom:0.5px solid rgba(70,50,20,0.3);padding-bottom:5px;"><div style="font-size:0.52rem;text-transform:uppercase;letter-spacing:0.8px;color:#4a3a10;font-family:'IM Fell English',serif;font-style:italic;margin-bottom:1px;">${row[0]}</div><div style="font-size:${row[2]==='redlined'?'1.1rem':'0.95rem'};font-weight:${i===0?'700':'400'};color:${row[2]==='redlined'?'#8a1212':'#1a0e04'};font-family:'Playfair Display',serif;" class="id-field-value"></div></div>`).join('')}
      </div>
    </div>
  </div>`;
  }

  _buildEmployeeRecordCard(card) {
    const rows = card.rows || [];
    return `<div class="physical-card" style="background:linear-gradient(135deg,#ddd4b0 0%,#cdc4a0 100%);border:1px solid #8a7a4a;font-family:'Libre Baskerville',serif;max-width:620px;margin:0 auto;box-shadow:0 6px 24px rgba(0,0,0,0.35);">
    <div style="background:#2a2010;padding:8px 14px;text-align:center;border-bottom:2px solid #8a6a2a;">
      <div style="color:#c8a840;font-size:0.55rem;letter-spacing:4px;text-transform:uppercase;font-family:'IM Fell English',serif;">McCormick Harvesting Machine Company</div>
      <div style="color:#c8a840;font-family:'UnifrakturMaguntia',cursive;font-size:1.1rem;margin:3px 0;">Employee Record</div>
    </div>
    <div style="display:grid;grid-template-columns:110px 1fr;gap:14px;padding:12px 16px 14px;">
      
      <div>
        <div style="width:110px;height:140px;background:#c0b494;border:1px solid #8a7a4a;overflow:hidden;background-image:url('images/karlbrenner.png');background-size:cover;background-position:center;"></div>
      </div>

      <div style="display:flex;flex-direction:column;gap:6px;">
        ${rows.map(row=>`<div style="border-bottom:0.5px solid rgba(70,50,20,0.3);padding-bottom:4px;"><div style="font-size:0.5rem;text-transform:uppercase;letter-spacing:0.8px;color:#5a4a20;font-family:'IM Fell English',serif;font-style:italic;margin-bottom:1px;">${row[0]}</div><div style="font-size:0.9rem;color:#1a0e04;font-family:'IM Fell DW Pica',serif;" class="id-field-value"></div></div>`).join('')}
      </div>

  _buildPinkertonCard(card) {
    const rows = card.rows || [];
    return `<div class="physical-card" style="background:linear-gradient(135deg,#e8e0cc 0%,#dcd4bc 100%);border:1px solid #6a6050;font-family:'Libre Baskerville',serif;max-width:620px;margin:0 auto;box-shadow:0 6px 24px rgba(0,0,0,0.35);">
    <div style="background:#1a1810;padding:8px 14px;display:flex;align-items:center;justify-content:space-between;">
      <div style="text-align:center;"><div style="color:#c8a840;font-family:'Playfair Display',serif;font-size:0.9rem;font-weight:700;letter-spacing:2px;">PINKERTON'S</div></div>
    </div>
    <div style="display:grid;grid-template-columns:110px 1fr;gap:14px;padding:12px 16px 14px;">
      
      <div>
        <div style="width:110px;height:140px;background:#d4ccb8;border:1px solid #6a6050;overflow:hidden;background-image:url('images/jamesdoyle.png');background-size:cover;background-position:center;"></div>
      </div>

      <div style="display:flex;flex-direction:column;gap:6px;">
        ${rows.map(row=>`<div style="border-bottom:0.5px solid rgba(70,60,40,0.3);padding-bottom:4px;"><div style="font-size:0.5rem;text-transform:uppercase;letter-spacing:1px;color:#5a5040;font-family:'IM Fell English',serif;font-style:italic;margin-bottom:1px;">${row[0]}</div><div style="font-size:${row[2]==='un'?'0.75rem':'0.9rem'};color:#1a1810;font-family:'IM Fell DW Pica',serif;" class="id-field-value"></div></div>`).join('')}
      </div>
    </div>
  </div>`;
  }

  _buildHTML(roleKey, uiText) {
    const template = BRIEFING_CARD_TEMPLATES[roleKey];
    let cardHTML = '';
    if (template) {
       if (roleKey === 'tutsi') cardHTML = `<div class="physical-card tutsi-card"><div class="pc-header-band pc-green"><span class="pc-republic">${template.headerBand.republic}</span><span class="pc-type">${template.headerBand.type}</span></div><div class="pc-body"><div class="pc-fields">${template.fields.map(f=>`<div class="pc-field"><span class="pc-lbl">${f.label}</span><span class="${f.cssClass} id-field-value"></span></div>`).join('')}</div></div></div>`;
       else if (roleKey === 'hutu') cardHTML = `<div class="physical-card hutu-card"><div class="pc-header-band pc-green"><span class="pc-republic">${template.headerBand.republic}</span><span class="pc-type">${template.headerBand.type}</span></div><div class="pc-body"><div class="pc-fields">${template.fields.map(f=>`<div class="pc-field"><span class="pc-lbl">${f.label}</span><span class="${f.cssClass} id-field-value"></span></div>`).join('\n')}</div></div></div>`;
       else if (roleKey === 'un') cardHTML = `<div class="physical-card un-card"><div class="pc-header-band pc-un"><span class="pc-republic" style="letter-spacing:2px;">${template.headerBand.republic}</span><span class="pc-type">${template.headerBand.type}</span></div><div class="pc-body"><div class="pc-fields">${template.fields.map(f=>`<div class="pc-field"><span class="pc-lbl un-lbl">${f.label}</span><span class="${f.cssClass} id-field-value"></span></div>`).join('\n')}</div></div></div>`;
       else if (roleKey === 'ud-resident') cardHTML = `<div class="physical-card ud-deed-card"><div class="pc-header-band pc-deed-header"><span class="pc-republic" style="letter-spacing:2px;">${template.headerBand.republic}</span><span class="pc-type">${template.headerBand.type}</span></div><div class="pc-body"><div class="pc-fields">${template.fields.map(f=>`<div class="pc-field"><span class="pc-lbl ud-lbl">${f.label}</span><span class="${f.cssClass} id-field-value"></span></div>`).join('\n')}</div></div></div>`;
    }

    return `
<button id="mb-back-button" class="back-button" aria-label="Back to role selection">← Back</button>
<div class="mb-paper">
  <div class="mb-mast">
    <div class="mb-mast-name">${uiText.masthead.name}</div>
    <div class="mb-meta">
      <span id="m-vol">Vol. LXI</span>
      <span id="m-date">Kigali, Rwanda</span>
      <span id="m-price">Cinq francs</span>
    </div>
  </div>
  <div id="mb-content">
    <div class="mb-dateline-el" id="mb-dateline"></div>
    <div class="mb-headline sz-lg" id="hl"></div>
    <div class="mb-body-el" id="mb-body"></div>
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

    const fieldEls    = cardSec.querySelectorAll('.id-field-value');
    const fieldValues = (card.rows || []).map(r => r[1]);
    let fi = 0;

    const typeFields = () => {
      if (fi >= fieldEls.length) { typeNote(); return; }
      const el  = fieldEls[fi];
      const txt = fieldValues[fi] || ''; 
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
      const text = card.note || '';
      if (!text) { setTimeout(typeFinal, 80); return; }
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
      const rawText = final || '';
      const plain   = rawText.replace(/<[^>]+>/g, '');
      let j = 0;
      finalEl.innerHTML = '<span class="mb-cursor"></span>';
      const iv = setInterval(() => {
        j++;
        finalEl.innerHTML = plain.slice(0, j) + '<span class="mb-cursor"></span>';
        if (j >= plain.length) {
          clearInterval(iv);
          finalEl.innerHTML = rawText;
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

  _getRoleKey(roleId) {
    if (roleId === 'ud-resident') return 'ud-resident';
    if (roleId.includes('hutu'))  return 'hutu';
    if (roleId.includes('tutsi')) return 'tutsi';
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

  _cleanup() {
    if (this._activeIv) { clearInterval(this._activeIv); this._activeIv = null; }
    this._seqToken = (this._seqToken || 0) + 1;
    const old = document.getElementById('mission-briefing-overlay');
    if (old) old.remove();
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
      const text  = t.text || '';
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
