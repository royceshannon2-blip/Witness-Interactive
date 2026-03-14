/**
 * MissionBriefing - Pre-mission newspaper briefing screen
 *
 * Intercepts the role:selected event and displays a role-specific
 * newspaper briefing before Scene 01 loads. Emits briefing:complete
 * when the student clicks "Enter the mission →", at which point
 * main.js proceeds with sceneStateMachine.loadRole().
 *
 * Only fires for missions that have a briefing defined in their
 * registry entry (mission.briefing === true). Pearl Harbor and other
 * missions without briefings skip straight to scenes as before.
 *
 * Architecture: Engine logic only, content imported from content layer.
 * Requirements: US-2.1, TR-2.2
 */

import { BRIEFING_PAGES, BRIEFING_CARDS, BRIEFING_FINALS } from '../content/missions/rwanda/briefing-content.js';

class MissionBriefing {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.container = null;
    this.pendingRoleData = null;
  }

  /**
   * Returns true if this mission has a briefing defined.
   * Currently only Rwanda ('rwanda-genocide') has one.
   */
  hasBriefing(missionId) {
    return missionId === 'rwanda-genocide';
  }

  /**
   * Show the briefing screen for the given role.
   * Appends a full-screen overlay to #app and types out the pages.
   * Calls onComplete() when the student clicks "Enter the mission →".
   */
  show(missionId, roleId, onComplete) {
    const roleKey = this._getRoleKey(roleId);
    const pages = BRIEFING_PAGES[roleKey];
    const card  = BRIEFING_CARDS[roleKey];
    const final = BRIEFING_FINALS[roleKey];

    if (!pages || !card || !final) {
      console.warn(`MissionBriefing: No briefing data for roleId "${roleId}" — skipping.`);
      onComplete();
      return;
    }

    // Remove any existing briefing
    this._cleanup();

    // Build overlay
    this.container = document.createElement('div');
    this.container.id = 'mission-briefing-overlay';
    this.container.innerHTML = this._buildHTML();
    document.getElementById('app').appendChild(this.container);

    // Run the page sequence
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

      // Sequential typewriter queue
      const tasks = [
        { id: 'mb-dateline', text: p.date.toUpperCase(),  speed: 14, pause: 50 },
        { id: 'hl',          text: p.h,  speed: p.hSize === 'sz-xxl' ? 11 : p.hSize === 'sz-xl' ? 13 : 15, pause: 70 },
        { id: 'mb-deck',     text: p.deck, speed: 11, pause: 50 },
        { id: 'mb-body',     text: p.body, speed: 7,  pause: 70 },
      ];

      if (p.ticker) {
        tasks.push({ id: 'mb-ticker', text: '◆  ' + p.ticker, speed: 11, pause: 40 });
      }

      this._typeSequence(tasks, () => {
        btn.textContent = isLast ? 'See your identity card —' : 'Continue →';
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

    // type card rows one by one
    const rowEls = cardSec.querySelectorAll('.mb-id-val');
    const values = card.rows.map(r => r[1]);
    let ri = 0;

    const typeRows = () => {
      if (ri >= rowEls.length) { typeNote(); return; }
      const el  = rowEls[ri];
      const txt = values[ri];
      el.textContent = '';
      let j = 0;
      const iv = setInterval(() => {
        j++;
        el.textContent = txt.slice(0, j);
        if (j >= txt.length) { clearInterval(iv); ri++; setTimeout(typeRows, 28); }
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
        if (j >= plain.length) { clearInterval(iv); finalEl.innerHTML = final; beginBtn.style.opacity = '1'; beginBtn.style.pointerEvents = 'all'; }
      }, 13);
    };

    // populate static card structure
    cardSec.querySelector('#mb-id-head').textContent = card.title;
    const grid = cardSec.querySelector('#mb-id-grid');
    grid.innerHTML = card.rows.map(r =>
      `<span class="mb-id-lbl">${r[0]}</span><span class="mb-id-val ${r[2] || ''}">${r[1]}</span>`
    ).join('');

    // clear values so they can be typed in
    cardSec.querySelectorAll('.mb-id-val').forEach(el => { el.textContent = ''; });
    cardSec.querySelector('#mb-id-stamp').textContent = card.stamp;

    beginBtn.style.opacity = '0';
    beginBtn.style.pointerEvents = 'none';
    beginBtn.addEventListener('click', () => {
      this._cleanup();
      onComplete();
    });

    typeRows();
  }

  _buildHTML() {
    return `<style>
#mission-briefing-overlay{position:fixed;inset:0;background:#0a0e1a;z-index:9999;display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;padding:1rem 0.5rem 2rem;font-family:Georgia,'Times New Roman',Times,serif;animation:mb-fade-in 0.6s ease forwards}
@keyframes mb-fade-in{from{opacity:0}to{opacity:1}}
.mb-paper{background:#111418;width:100%;max-width:96vw;border:1px solid rgba(212,175,55,0.25);display:flex;flex-direction:column;box-shadow:0 0 60px rgba(0,0,0,0.8),0 0 20px rgba(212,175,55,0.05);position:relative}
.mb-paper::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(to right,transparent,rgba(212,175,55,0.6),transparent)}
.mb-mast{border-bottom:1px solid rgba(212,175,55,0.3);padding:1.2rem 1.4rem 0.8rem;text-align:center;background:#0d1017}
.mb-mast-name{font-family:'Times New Roman',Times,serif;font-size:1.9rem;font-weight:700;color:#d4af37;letter-spacing:2px;line-height:1;font-variant:small-caps;text-shadow:0 0 20px rgba(212,175,55,0.3)}
.mb-rule-double{border-top:2px solid rgba(212,175,55,0.5);border-bottom:1px solid rgba(212,175,55,0.2);height:4px;margin:6px 0 4px}
.mb-meta{display:flex;justify-content:space-between;font-size:0.6rem;color:#8a7a5a;font-style:italic;letter-spacing:0.3px}
#mb-content{padding:1.2rem 1.4rem 1rem;flex:1;display:flex;flex-direction:column}
.mb-dateline-el{font-size:0.58rem;font-style:italic;color:#8a7a5a;letter-spacing:0.8px;text-transform:uppercase;margin-bottom:0.5rem;min-height:0.8em}
.mb-col-rule{display:flex;align-items:center;gap:6px;margin-bottom:0.7rem}
.mb-col-rule::before,.mb-col-rule::after{content:'';flex:1;height:1px;background:rgba(212,175,55,0.3)}
.mb-col-dot{width:4px;height:4px;background:#d4af37;transform:rotate(45deg);flex-shrink:0;opacity:0.7}
.mb-headline{font-family:'Times New Roman',Times,serif;font-weight:700;color:#e8dcc4;line-height:1.15;margin-bottom:0;min-height:1.4em}
.mb-headline.sz-lg{font-size:1.55rem}
.mb-headline.sz-xl{font-size:1.85rem}
.mb-headline.sz-xxl{font-size:2.1rem;letter-spacing:-0.5px}
.mb-headline.alert{color:#c0392b}
.mb-headline.urgent{color:#c0392b}
.mb-deck-el{font-size:0.8rem;font-style:italic;color:#b8a888;line-height:1.5;margin-top:0.5rem;padding-top:0.4rem;border-top:1px solid rgba(212,175,55,0.2);min-height:1em}
.mb-byline{font-size:0.57rem;color:#8a7a5a;letter-spacing:1.2px;text-transform:uppercase;margin:0.5rem 0 0.6rem;padding-bottom:0.4rem;border-bottom:1px solid rgba(212,175,55,0.15)}
.mb-body-el{font-size:0.82rem;color:#c8b898;line-height:1.85;flex:1;white-space:pre-wrap;word-break:break-word}
.mb-ticker-el{border-top:1px solid rgba(212,175,55,0.3);border-bottom:1px solid rgba(212,175,55,0.15);padding:0.35rem 0;margin-top:0.8rem;font-size:0.6rem;color:#d4af37;font-style:italic;text-align:center;min-height:1.2em;letter-spacing:0.3px}
.mb-cont-btn{display:block;width:100%;background:transparent;color:#d4af37;border:1px solid rgba(212,175,55,0.4);cursor:pointer;font-family:Georgia,serif;font-size:0.8rem;font-style:italic;padding:0.7rem;margin-top:0.9rem;transition:all 0.2s ease;letter-spacing:0.5px}
.mb-cont-btn:hover{background:rgba(212,175,55,0.08);border-color:#d4af37;color:#e8c84a}
#mb-card-section{padding:1rem 1.4rem 1.2rem;display:none;background:#0d1017;border-top:1px solid rgba(212,175,55,0.2)}
.mb-card-eyebrow{font-size:0.57rem;letter-spacing:2px;text-transform:uppercase;color:#8a7a5a;text-align:center;margin-bottom:0.7rem;font-style:italic}
.mb-id-card{border:1px solid rgba(212,175,55,0.35);background:#161b22;padding:0.9rem 1rem;position:relative}
.mb-id-head{font-family:'Times New Roman',serif;font-size:0.6rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#d4af37;border-bottom:1px solid rgba(212,175,55,0.3);padding-bottom:0.4rem;margin-bottom:0.6rem;text-align:center}
.mb-id-grid{display:grid;grid-template-columns:auto 1fr;gap:4px 14px}
.mb-id-lbl{font-size:0.6rem;color:#8a7a5a;font-style:italic}
.mb-id-val{font-family:'Times New Roman',Times,serif;font-size:0.72rem;font-weight:700;color:#e8dcc4}
.mb-id-val.tutsi{color:#c0392b}
.mb-id-val.hutu{color:#4a9a5a}
.mb-id-val.un{color:#4a8ab8}
.mb-id-stamp{position:absolute;bottom:8px;right:10px;font-size:0.55rem;color:rgba(212,175,55,0.18);transform:rotate(-5deg);font-style:italic}
#mb-id-note{font-size:0.75rem;font-style:italic;color:#b8a888;line-height:1.75;margin-top:0.8rem;padding-top:0.6rem;border-top:1px solid rgba(212,175,55,0.15);min-height:1em}
#mb-final-bar{padding:0.9rem 0 0;border-top:1px solid rgba(212,175,55,0.3);margin-top:0.9rem;display:none}
#mb-final-text{font-family:'Times New Roman',Times,serif;font-size:0.9rem;font-style:italic;color:#c8b898;line-height:1.7;text-align:center;min-height:1em}
#mb-final-text strong{font-style:normal;font-weight:700;color:#d4af37}
.mb-cursor{display:inline-block;width:2px;height:0.85em;background:#d4af37;vertical-align:middle;animation:mb-blink 0.65s step-end infinite}
@keyframes mb-blink{0%,100%{opacity:1}50%{opacity:0}}
@media(max-width:480px){.mb-mast-name{font-size:1.5rem}.mb-headline.sz-xxl{font-size:1.7rem}.mb-headline.sz-xl{font-size:1.5rem}.mb-headline.sz-lg{font-size:1.3rem}.mb-body-el{font-size:0.78rem}#mb-content{padding:1rem}#mb-card-section{padding:0.8rem 1rem 1rem}}
</style>
<div class="mb-paper">
  <div class="mb-mast">
    <div class="mb-mast-name">La Gazette de Kigali</div>
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
    <div class="mb-byline">Special Correspondent — Rwanda Bureau</div>
    <div class="mb-body-el" id="mb-body"></div>
    <div class="mb-ticker-el" id="mb-ticker"></div>
    <button class="mb-cont-btn" id="mb-cont" style="opacity:0;pointer-events:none"></button>
  </div>
  <div id="mb-card-section">
    <div class="mb-card-eyebrow">— Pièce d'identité officielle —</div>
    <div class="mb-id-card">
      <div class="mb-id-head" id="mb-id-head"></div>
      <div class="mb-id-grid" id="mb-id-grid"></div>
      <div class="mb-id-stamp" id="mb-id-stamp"></div>
    </div>
    <div id="mb-id-note"></div>
    <div id="mb-final-bar">
      <div id="mb-final-text"></div>
      <button class="mb-cont-btn" id="mb-begin" style="margin-top:0.8rem;opacity:0;pointer-events:none">Enter the mission →</button>
    </div>
  </div>
</div>`;
  }
}

export default MissionBriefing;