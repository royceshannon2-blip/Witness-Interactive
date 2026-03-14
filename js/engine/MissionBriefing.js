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
  BRIEFING_PAGES, 
  BRIEFING_CARDS, 
  BRIEFING_FINALS,
  BRIEFING_UI_TEXT,
  BRIEFING_CARD_TEMPLATES
} from '../content/missions/rwanda/briefing-content.js';

class MissionBriefing {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.container = null;
  }

  hasBriefing(missionId) {
    return missionId === 'rwanda-genocide';
  }

  show(_missionId, roleId, onComplete) {
    const roleKey = this._getRoleKey(roleId);
    const pages = BRIEFING_PAGES[roleKey];
    const card  = BRIEFING_CARDS[roleKey];
    const final = BRIEFING_FINALS[roleKey];

    if (!pages || !card || !final) {
      console.warn(`MissionBriefing: No briefing data for roleId "${roleId}" — skipping.`);
      onComplete();
      return;
    }

    this._cleanup();

    this.container = document.createElement('div');
    this.container.id = 'mission-briefing-overlay';
    this.container.innerHTML = this._buildHTML(roleKey);
    document.getElementById('app').appendChild(this.container);

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
        btn.textContent = isLast ? BRIEFING_UI_TEXT.buttons.seeCard : BRIEFING_UI_TEXT.buttons.continue;
        btn.style.opacity  = '1';
        btn.style.pointerEvents = 'all';
        typing = false;
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
    if (roleId.includes('hutu'))   return 'hutu';
    if (roleId.includes('tutsi'))  return 'tutsi';
    if (roleId.includes('un') || roleId.includes('peacekeeper')) return 'un';
    return null;
  }

  _cleanup() {
    const old = document.getElementById('mission-briefing-overlay');
    if (old) old.remove();
    this.container = null;
  }

  _setText(id, text) {
    const el = this.container.querySelector('#' + id);
    if (el) el.textContent = text;
  }

  _typeSequence(tasks, done) {
    let i = 0;
    const run = () => {
      if (i >= tasks.length) { if (done) done(); return; }
      const t = tasks[i++];
      const el = this.container.querySelector('#' + t.id);
      if (!el) { setTimeout(run, 10); return; }
      const text  = t.text;
      const speed = t.speed || 18;
      let   j     = 0;
      el.innerHTML = '<span class="mb-cursor"></span>';
      const iv = setInterval(() => {
        j++;
        el.innerHTML = text.slice(0, j) + '<span class="mb-cursor"></span>';
        if (j >= text.length) {
          clearInterval(iv);
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
    noteEl.innerHTML = '';

    const typeNote = () => {
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

    if (roleKey === 'tutsi') return this._buildTutsiCard(template);
    if (roleKey === 'hutu')  return this._buildHutuCard(template);
    if (roleKey === 'un')    return this._buildUnCard(template);
    return '';
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
        <img src="images/rwanda-tutsi-photo.png" alt="Identity photo" class="pc-photo-img" />
        <div class="pc-photo-label">${t.photoLabel}</div>
      </div>
      <svg class="pc-stamp" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(60,30,120,0.6)" stroke-width="1.5"/>
        <circle cx="22" cy="22" r="16" fill="rgba(60,30,120,0.12)" stroke="rgba(60,30,120,0.4)" stroke-width="0.8"/>
        <text x="22" y="14" text-anchor="middle" font-size="4" fill="rgba(60,30,120,0.75)" font-family="Times New Roman" letter-spacing="0.5">${t.stamp.line1}</text>
        <text x="22" y="23" text-anchor="middle" font-size="5.5" font-weight="700" fill="rgba(60,30,120,0.85)" font-family="Times New Roman">${t.stamp.line2}</text>
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
  <div class="pc-age-tint"></div>
  <svg class="pc-distress" viewBox="0 0 480 230" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="db1"><feGaussianBlur stdDeviation="3"/></filter>
      <filter id="db2"><feGaussianBlur stdDeviation="6"/></filter>
      <filter id="db3"><feGaussianBlur stdDeviation="1.5"/></filter>
    </defs>
    <path d="M0 180 C15 165,38 158,52 170 C68 183,74 200,60 215 C45 228,18 230,5 222 C-8 214,-12 195,0 180Z" fill="rgba(65,42,8,0.35)" filter="url(#db2)"/>
    <path d="M8 185 C20 172,40 168,50 178 C60 188,58 205,45 212 C32 219,14 218,6 208 C-2 198,-2 190,8 185Z" fill="rgba(55,35,5,0.2)" filter="url(#db1)"/>
    <path d="M400 10 C425 5,455 12,468 28 C480 44,475 62,458 68 C440 74,415 65,405 50 C393 34,385 22,400 10Z" fill="rgba(60,38,6,0.3)" filter="url(#db2)"/>
    <path d="M415 18 C432 12,452 20,460 34 C468 48,460 60,448 62 C435 64,418 55,412 43 C405 30,405 22,415 18Z" fill="rgba(50,32,4,0.18)" filter="url(#db1)"/>
    <path d="M210 95 C225 82,248 84,258 96 C270 110,265 128,250 133 C234 138,215 130,208 118 C200 105,198 105,210 95Z" fill="rgba(72,48,10,0.22)" filter="url(#db2)"/>
    <path d="M430 140 C440 132,455 135,462 148 C470 162,465 180,452 184 C440 188,428 180,425 168 C421 155,422 148,430 140Z" fill="rgba(58,38,7,0.26)" filter="url(#db1)"/>
    <path d="M355 158 C368 150,385 152,392 164 C399 176,394 192,382 196 C369 200,354 193,350 181 C346 168,344 164,355 158Z" fill="none" stroke="rgba(62,40,8,0.3)" stroke-width="2.5" filter="url(#db3)"/>
    <path d="M88 42 C97 36,110 38,115 48 C120 58,115 70,106 72 C96 74,85 67,83 57 C81 48,81 46,88 42Z" fill="none" stroke="rgba(60,38,6,0.25)" stroke-width="2" filter="url(#db3)"/>
    <path d="M238 0 C240 18,236 35,239 52 C242 70,238 88,241 105 C244 122,239 140,242 158 C245 175,240 195,243 215 C244 222,244 230,244 230" stroke="rgba(40,22,3,0.55)" stroke-width="1.8" fill="none" filter="url(#db3)"/>
    <path d="M230 0 C232 18,228 35,231 52 C234 70,230 88,233 105 C236 122,231 140,234 158 C237 175,232 195,235 215" stroke="rgba(0,0,0,0.08)" stroke-width="7" fill="none" filter="url(#db1)"/>
    <path d="M248 0 C250 18,246 35,249 52 C252 70,248 88,251 105 C254 122,249 140,252 158 C255 175,250 195,253 215" stroke="rgba(0,0,0,0.06)" stroke-width="5" fill="none" filter="url(#db1)"/>
    <path d="M0 88 C40 84,80 90,120 86 C155 83,190 88,230 85" stroke="rgba(40,22,3,0.25)" stroke-width="1" fill="none" filter="url(#db3)"/>
    <path d="M480 230 L480 195 C472 198,468 204,462 200 C456 196,458 188,452 185 C446 182,440 190,434 186 C428 182,430 174,424 172 C418 170,415 178,409 175 L480 230Z" fill="#0a0e1a"/>
    <path d="M480 0 L466 0 C468 6,464 10,468 15 C472 20,476 17,478 22 C480 27,478 30,480 35 L480 0Z" fill="#0a0e1a"/>
    <path d="M0 230 L0 212 C5 215,8 210,12 213 C16 216,14 222,19 224 C24 226,26 220,30 222 L0 230Z" fill="#0a0e1a"/>
    <path d="M0 0 L12 0 C10 4,6 5,8 9 C10 13,14 11,13 15 L0 15 L0 0Z" fill="#0a0e1a"/>
    <circle cx="185" cy="55" r="3.5" fill="rgba(75,50,12,0.28)" filter="url(#db3)"/>
    <circle cx="310" cy="148" r="2.8" fill="rgba(68,44,9,0.24)" filter="url(#db3)"/>
    <circle cx="142" cy="168" r="2.2" fill="rgba(72,46,10,0.22)" filter="url(#db3)"/>
    <circle cx="395" cy="82" r="3" fill="rgba(65,42,8,0.26)" filter="url(#db3)"/>
    <circle cx="255" cy="108" r="1.8" fill="rgba(78,52,13,0.2)" filter="url(#db3)"/>
    <circle cx="75" cy="130" r="2.5" fill="rgba(70,45,10,0.22)" filter="url(#db3)"/>
    <circle cx="170" cy="200" r="3.2" fill="rgba(74,49,11,0.25)" filter="url(#db3)"/>
    <path d="M188 152 C198 148,212 150,228 146 C238 144,244 147,246 145" stroke="rgba(15,8,3,0.2)" stroke-width="3" fill="none" stroke-linecap="round" filter="url(#db3)"/>
    <path d="M155 22 L215 20 L216 30 L154 32 Z" fill="rgba(215,195,135,0.32)" stroke="rgba(180,158,100,0.25)" stroke-width="0.5" filter="url(#db3)"/>
    <path d="M0 228 C8 226,14 229,22 227 C30 225,38 228,48 226 C58 224,65 227,75 226 C88 225,96 228,108 226 C120 224,130 227,142 226 C155 225,165 228,178 226 C192 224,202 227,215 226 C228 225,238 228,252 226 C266 224,278 227,292 226 C306 225,316 228,330 226 C344 224,358 228,372 226 C386 224,398 227,412 226 C426 225,438 228,452 226 C462 225,472 228,480 226 L480 230 L0 230Z" fill="#0a0e1a"/>
    <path d="M0 0 C0 40,5 80,3 120 C1 160,6 200,0 230 L18 230 C12 200,16 160,14 120 C12 80,16 40,18 0Z" fill="rgba(30,15,3,0.18)" filter="url(#db1)"/>
    <path d="M480 0 C480 40,475 80,477 120 C479 160,474 200,480 230 L462 230 C468 200,464 160,466 120 C468 80,464 40,462 0Z" fill="rgba(30,15,3,0.15)" filter="url(#db1)"/>
    <path d="M0 0 L480 0 L480 16 C400 12,320 18,240 14 C160 10,80 16,0 12Z" fill="rgba(30,15,3,0.16)" filter="url(#db1)"/>
    <path d="M0 230 L480 230 L480 214 C400 218,320 212,240 216 C160 220,80 214,0 218Z" fill="rgba(30,15,3,0.22)" filter="url(#db1)"/>
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

  _buildHTML(roleKey) {
    const cardHTML = this._buildCardHTML(roleKey);
    return `<div class="mb-paper">
  <div class="mb-mast">
    <div class="mb-mast-name">${BRIEFING_UI_TEXT.masthead.name}</div>
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
    <div class="mb-byline">${BRIEFING_UI_TEXT.masthead.byline}</div>
    <div class="mb-body-el" id="mb-body"></div>
    <div class="mb-ticker-el" id="mb-ticker"></div>
    <button class="mb-cont-btn" id="mb-cont" style="opacity:0;pointer-events:none"></button>
  </div>
  <div id="mb-card-section">
    <div class="mb-card-eyebrow">${BRIEFING_UI_TEXT.cardEyebrow}</div>
    ${cardHTML}
    <div id="mb-id-note"></div>
    <div id="mb-final-bar">
      <div id="mb-final-text"></div>
      <button class="mb-cont-btn" id="mb-begin" style="margin-top:0.8rem;opacity:0;pointer-events:none">${BRIEFING_UI_TEXT.buttons.enterMission}</button>
    </div>
  </div>
</div>`;
  }
}

export default MissionBriefing;
