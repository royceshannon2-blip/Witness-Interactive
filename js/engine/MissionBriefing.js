/**
 * MissionBriefing - Pre-mission newspaper briefing screen
 *
 * Intercepts the role:selected event and displays a role-specific
 * newspaper briefing before Scene 01 loads. Calls onComplete()
 * when the student clicks "Enter the mission".
 *
 * Architecture: Engine logic only, content imported from content layer.
 * CSS in css/style.css + css/chicago-tribune-briefing.css (Haymarket)
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
    this._tributeStyleLoaded = false;
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

    // Load Tribune CSS for Haymarket (lazy)
    if (isHaymarket && !this._tributeStyleLoaded) {
      this._loadTribuneCSS();
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
      const p = pages[i];
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

  // ─── Tribune-specific methods ────────────────────────────────────────────────

  /**
   * Lazily inject the Tribune CSS link into <head>
   */
  _loadTribuneCSS() {
    const link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = 'css/chicago-tribune-briefing.css';
    document.head.appendChild(link);
    this._tributeStyleLoaded = true;
  }

  /**
   * Render one Tribune-style page
   * Uses fast typewriter on the body, instant render for structural elements
   */
  _showTribunePage(page, isLast, uiText) {
    const token = ++this._seqToken;

    // Clear article content areas
    const bodyEl = this.container.querySelector('#trib-body-text');
    const deckEl = this.container.querySelector('#trib-deck-text');
    const hlEl   = this.container.querySelector('#trib-headline-text');
    const tickEl = this.container.querySelector('#trib-ticker-text');
    const btn    = this.container.querySelector('#mb-cont');

    if (!bodyEl || !deckEl || !hlEl) return;

    // Update static meta fields
    this._setText('trib-vol',   page.vol   || '');
    this._setText('trib-date',  page.date  || '');
    this._setText('trib-price', page.price || '');

    // Headline + deck — instant (structural)
    hlEl.className    = `trib-headline ${page.hSize || 'sz-md'} ${page.hClass || ''}`;
    hlEl.textContent  = '';
    deckEl.textContent = '';
    bodyEl.textContent = '';
    if (tickEl) tickEl.textContent = '';
    btn.style.opacity = '0';
    btn.style.pointerEvents = 'none';
    btn.textContent = '';

    // Type sequence: headline → deck → body
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
      // Apply glossary to body
      glossaryTooltip.apply(bodyEl);
    });
  }

  /**
   * Type sequence using direct element references (more reliable than IDs)
   */
  _typeSequenceEl(tasks, token, done) {
    if (this._activeIv) {
      clearInterval(this._activeIv);
      this._activeIv = null;
    }

    let i = 0;
    const run = () => {
      if (token !== this._seqToken || !this.container) return;
      if (i >= tasks.length) { if (done) done(); return; }

      const t    = tasks[i++];
      const el   = t.el;
      const text = t.text;
      const speed = t.speed || 12;
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
      }, speed);
    };
    run();
  }

  /**
   * Build the full Tribune HTML shell.
   * Three-column newspaper layout with authentic 1880s typesetting.
   */
  _buildTribuneHTML(roleId, uiText, card) {
    const cardHTML = this._buildTribuneCardHTML(roleId, card);
    return `<button id="mb-back-button" class="trib-back" aria-label="Back to role selection">← Back</button>
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
        <div class="trib-ad" style="margin-top: 12px;">
          <div class="trib-ad-head">Pinkerton's<br>National Detective Agency</div>
          <div class="trib-ad-body">We Never Sleep.<br>Chicago Office: Dearborn St.<br><br>Labor Intelligence.<br>Strike Protection.<br>Operative Infiltration.</div>
        </div>
      </div>
    </div><!-- /article grid -->
    <button class="trib-cont-btn" id="mb-cont" style="opacity:0;pointer-events:none;margin-top:10px;"></button>
  </div><!-- /mb-content -->
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
</div><!-- /mb-paper -->`;
  }
