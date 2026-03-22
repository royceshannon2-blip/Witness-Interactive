/**
 * WitnessList — Sidebar tracking named witnesses across Haymarket scenes
 *
 * Renders a fixed sidebar listing August Spies, Albert Parsons, Samuel Fielden,
 * and Lizzie Holmes. Names are crossed out when their arrest/flight flag is set.
 * Updates on every scene:transition event.
 *
 * Only visible during Haymarket mission scenes (hm- prefix).
 *
 * Architecture: UI layer — communicates via EventBus, reads ConsequenceSystem flags.
 * No direct coupling to other components.
 */

const WITNESSES = [
  { id: 'spies',   name: 'August Spies',   flag: 'hm_spies_arrested'   },
  { id: 'parsons', name: 'Albert Parsons',  flag: 'hm_parsons_fled'     },
  { id: 'fielden', name: 'Samuel Fielden',  flag: 'hm_fielden_arrested' },
  { id: 'holmes',  name: 'Lizzie Holmes',   flag: 'hm_holmes_fled'      },
];

class WitnessList {
  /**
   * @param {EventBus} eventBus
   * @param {ConsequenceSystem} consequenceSystem
   */
  constructor(eventBus, consequenceSystem) {
    this.eventBus = eventBus;
    this.cs = consequenceSystem;
    this._container = null;
    this._visible = false;

    this._createContainer();
    this._bindEvents();
  }

  _createContainer() {
    const el = document.createElement('aside');
    el.id = 'witness-list';
    el.className = 'witness-list hidden';
    el.setAttribute('aria-label', 'Haymarket witnesses');
    el.setAttribute('role', 'complementary');

    el.innerHTML = `
      <h4 class="witness-list-heading">Witnesses</h4>
      <ul class="witness-list-items" role="list">
        ${WITNESSES.map(w => `
          <li id="witness-${w.id}" class="witness-item" role="listitem">
            <span class="witness-name">${w.name}</span>
          </li>
        `).join('')}
      </ul>
    `;

    document.body.appendChild(el);
    this._container = el;
  }

  show() {
    this._visible = true;
    this._container?.classList.remove('hidden');
    this._update();
  }

  hide() {
    this._visible = false;
    this._container?.classList.add('hidden');
  }

  _update() {
    if (!this._visible) return;
    WITNESSES.forEach(w => {
      const el = document.getElementById(`witness-${w.id}`);
      if (!el) return;
      const flagSet = !!this.cs.getFlag(w.flag);
      el.classList.toggle('witness-item--crossed', flagSet);
      el.setAttribute('aria-label', flagSet ? `${w.name} — arrested or fled` : w.name);
    });
  }

  _bindEvents() {
    this.eventBus.on('scene:transition', (data) => {
      const sceneId = data?.scene?.id || '';
      if (sceneId.startsWith('hm-')) {
        this.show();
      } else {
        this.hide();
      }
    });

    this.eventBus.on('game:complete', () => this.hide());
  }
}

export default WitnessList;
