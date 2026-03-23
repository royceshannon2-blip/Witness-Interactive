/**
 * UIController - DOM Manipulation and Screen Rendering
 */

import TypewriterEffect from './TypewriterEffect.js';
import SceneTransition from './SceneTransition.js';
import AtmosphericEffects from './AtmosphericEffects.js';
import TimedChoiceSystem from './TimedChoiceSystem.js';
import { HapticFeedback } from './HapticFeedback.js';
import glossaryTooltip from './GlossaryTooltip.js';
import PauseQuestionModal from './PauseQuestionModal.js';

class UIController {
  constructor(eventBus, timelineSelector, missionRegistry, consequenceSystem, resultsCard, uiContent, components = {}) {
    this.eventBus = eventBus;
    this.content = uiContent;
    this.timelineSelector = timelineSelector;
    this.missionRegistry = missionRegistry;
    this.consequenceSystem = consequenceSystem;
    this.resultsCard = resultsCard;
    this.typewriterEffect = components.typewriterEffect || null;
    this.sceneTransition = components.sceneTransition || null;
    this.atmosphericEffects = components.atmosphericEffects || null;
    this.timedChoiceSystem = components.timedChoiceSystem || null;
    this.ambientSoundManager = components.ambientSoundManager || null;
    this.narratorAudioManager = components.narratorAudioManager || null;
    this.annotationStore = components.annotationStore || null;
    this.stimuliManager = components.stimuliManager || null;
    this.haptics = new HapticFeedback();
    this.appContainer = document.getElementById('app');

    if (!this.appContainer) {
      console.error('UIController: #app container not found in DOM');
      return;
    }

    this.currentScreen = 'loading';
    this.currentSceneData = null;
    this.currentMissionId = null;
    this.currentRoleId = null;
    this.completedRoles = new Set();
    this.currentAmbientSound = null;
    this.currentDocHasPauseQuestion = false;

    // Legacy inventory tracking (AnnotationInventory is the primary tracker now)
    this._inventoryDocIds = [];
    this._inventoryDocData = new Map();

    this.subscribeToEvents();
    this.setupSoundToggle();
    this.setupNarratorToggle();
  }

  subscribeToEvents() {
    this.eventBus.on('scene:transition',    this.handleSceneTransition.bind(this));
    this.eventBus.on('game:start',          this.handleGameStart.bind(this));
    this.eventBus.on('game:complete',       this.handleGameComplete.bind(this));
    this.eventBus.on('mission:selected',    this.handleMissionSelected.bind(this));
    this.eventBus.on('role:selected',       this.handleRoleSelected.bind(this));
    this.eventBus.on('briefing:back',       this.handleBriefingBack.bind(this));
    this.eventBus.on('checkpoint:complete', this.handleCheckpointComplete.bind(this));
    this.eventBus.on('timer:started',       this.handleTimerStarted.bind(this));
    this.eventBus.on('timer:update',        this.handleTimerUpdate.bind(this));
    this.eventBus.on('timer:expired',       this.handleTimerExpired.bind(this));
    this.eventBus.on('timer:cancelled',     this.handleTimerCancelled.bind(this));
    this.eventBus.on('sound:muted',         this.handleSoundMuted.bind(this));
    this.eventBus.on('narrator:muted',      this.handleNarratorMuted.bind(this));
    this.eventBus.on('stimuli:shown',       this.handleStimuliShown.bind(this));
    this.eventBus.on('stimuli:dismissed',   this.handleStimuliDismissed.bind(this));
    this.eventBus.on('stimuli:view-ready',  this.handleStimuliViewReady.bind(this));
    this.eventBus.on('scene:error', () => {
      console.warn('UIController: scene:error — re-rendering current scene');
      if (this.currentSceneData?.scene) {
        this.renderScene(
          this.currentSceneData.scene,
          this.currentSceneData.sceneIndex,
          this.currentSceneData.totalScenes
        );
      }
    });
  }

  // ── Audio toggles ───────────────────────────────────────────────────────────

  setupSoundToggle() {
    const btn = document.getElementById('sound-toggle');
    if (!btn) { console.warn('UIController: #sound-toggle not found'); return; }
    if (this.ambientSoundManager) {
      btn.disabled = false;
      btn.addEventListener('click', () => this.eventBus.emit('sound:toggle'));
      this.updateSoundToggleIcon(this.ambientSoundManager.isMuted());
    }
  }

  setupNarratorToggle() {
    if (!this.narratorAudioManager) return;
    let btn = document.getElementById('narrator-toggle');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'narrator-toggle';
      btn.className = 'narrator-toggle';
      btn.innerHTML = '<span class="narrator-icon">🔊</span>';
      const soundBtn = document.getElementById('sound-toggle');
      if (soundBtn?.parentNode) soundBtn.parentNode.insertBefore(btn, soundBtn.nextSibling);
      else document.body.appendChild(btn);
    }
    btn.setAttribute('aria-label', 'Toggle narrator audio on/off');
    btn.addEventListener('click', () => { this.haptics.light(); this.eventBus.emit('narrator:toggle'); });
    this.updateNarratorToggleIcon(this.narratorAudioManager.isMuted());
  }

  handleSoundMuted(data) {
    if (data && typeof data.muted === 'boolean') this.updateSoundToggleIcon(data.muted);
  }

  handleNarratorMuted(data) {
    if (data && typeof data.muted === 'boolean') this.updateNarratorToggleIcon(data.muted);
  }

  updateSoundToggleIcon(muted) {
    const btn = document.getElementById('sound-toggle');
    const icon = btn?.querySelector('.sound-icon');
    if (!icon) return;
    icon.textContent = muted ? '🔇' : '🔊';
    btn.setAttribute('aria-label', muted ? 'Sound is muted. Click to unmute.' : 'Sound is on. Click to mute.');
  }

  updateNarratorToggleIcon(muted) {
    const btn = document.getElementById('narrator-toggle');
    const icon = btn?.querySelector('.narrator-icon');
    if (!icon) return;
    icon.textContent = muted ? '🔇' : '🔊';
    btn.setAttribute('aria-label', muted ? 'Narrator is muted. Click to unmute.' : 'Narrator is on. Click to mute.');
    btn.classList.toggle('muted', muted);
  }

  // ── Game flow handlers ──────────────────────────────────────────────────────

  handleGameStart() {
    this.showScreen('landing');
    if (this.ambientSoundManager) {
      const track = this.content.landing?.ambientTrack;
      if (track) {
        this.ambientSoundManager.fadeIn(track, 1500);
        this.currentAmbientSound = track;
      }
    }
  }

  handleSceneTransition(data) {
    if (!data?.scene) { console.error('UIController.handleSceneTransition: Invalid scene data'); return; }
    this.currentSceneData = data;
    this.renderScene(data.scene, data.sceneIndex, data.totalScenes);
  }

  handleGameComplete(data) {
    const roleId = data?.roleId || data?.role;
    if (roleId) { this.completedRoles.add(roleId); this.currentRoleId = roleId; }
    if (data?.missionId) this.currentMissionId = data.missionId;

    this.earlyDeathContext = data?.diedEarly
      ? { diedEarly: true, deathReason: data.deathReason, deathChance: data.deathChance }
      : null;

    this.updateEndingsCounter();
    this.currentOutcome = this.calculateCurrentOutcome();
    this.showScreen('outcome', data);
  }

  calculateCurrentOutcome() {
    if (!this.currentMissionId || !this.currentRoleId) return null;
    const mission = this.missionRegistry.getMission(this.currentMissionId);
    const role = mission?.roles.find(r => r.id === this.currentRoleId);
    if (!role?.outcomes) return null;

    const survivalResult = this.earlyDeathContext?.diedEarly
      ? { survived: false, deathChance: this.earlyDeathContext.deathChance, modifiers: {} }
      : this.consequenceSystem.determineSurvival(this.currentRoleId);

    const outcomeId = this.consequenceSystem.calculateOutcome(role.outcomes, survivalResult.survived);
    return outcomeId ? role.outcomes.find(o => o.id === outcomeId) : null;
  }

  handleMissionSelected(data) {
    if (data?.missionId) { this.currentMissionId = data.missionId; this._setMissionTheme(data.missionId); }
    this.showScreen('role-selection', data);
  }

  handleRoleSelected(data) {
    if (data?.roleId) this.currentRoleId = data.roleId;
    this.showScreen('scene');
  }

  handleBriefingBack(data) {
    const missionId = data?.missionId || this.currentMissionId;
    if (missionId) this.eventBus.emit('mission:selected', { missionId });
    else this.showScreen('timeline');
  }

  handleCheckpointComplete(data) {
    this.showScreen('results-card', data);
  }

  // ── Stimuli handlers ────────────────────────────────────────────────────────

  handleStimuliShown(data) {
    if (!data?.documentId || !data?.documentData) return;
    // AnnotationInventory tracks docs itself via this same event.
    // UIController only renders the overlay DOM.
    this._renderStimulusOverlay(data.documentData);
  }

  handleStimuliDismissed(data) {
    // Remove the overlay from DOM after archive animation completes
    document.getElementById('stimuli-overlay')?.remove();
  }

  handleStimuliViewReady(data) {
    // StimuliManager signals a document is ready to view.
    // Insert a "View Document" button above choice buttons.
    if (!data?.documentId) return;
    const choicesContainer = document.getElementById('scene-choices');
    if (!choicesContainer) return;
    document.getElementById('stimuli-view-doc-btn')?.remove();

    const btn = document.createElement('button');
    btn.id = 'stimuli-view-doc-btn';
    btn.className = 'stimuli-view-doc-btn mt-sm';
    btn.setAttribute('aria-label', 'View primary source document');
    const count = data.count || 1;
    btn.textContent = count > 1 ? `📄 View Primary Sources (${count})` : '📄 View Primary Source';
    btn.addEventListener('click', () => {
      btn.remove();
      this.stimuliManager?.playerRequestedView();
    });
    choicesContainer.insertBefore(btn, choicesContainer.firstChild);
  }

  // ── Screen management ───────────────────────────────────────────────────────

  showScreen(screenName, data = {}) {
    const validScreens = [
      'loading', 'landing', 'timeline', 'role-selection', 'scene',
      'outcome', 'historical-ripple', 'knowledge-checkpoint', 'results-card'
    ];
    if (!validScreens.includes(screenName)) {
      console.error(`UIController.showScreen: Invalid screen name "${screenName}"`);
      return;
    }

    if (screenName === 'timeline' || screenName === 'landing') this._setMissionTheme(null);

    this.appContainer.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

    const alwaysRecreate = ['role-selection', 'outcome', 'historical-ripple', 'knowledge-checkpoint', 'results-card'];
    if (alwaysRecreate.includes(screenName)) document.getElementById(`${screenName}-screen`)?.remove();

    let screenElement = document.getElementById(`${screenName}-screen`);
    if (!screenElement) {
      screenElement = this.createScreen(screenName, data);
      if (screenElement) this.appContainer.appendChild(screenElement);
    }
    if (screenElement) screenElement.classList.add('active');
    this.currentScreen = screenName;
  }

  createScreen(screenName, data) {
    const screen = document.createElement('div');
    screen.id = `${screenName}-screen`;
    screen.className = 'screen';

    switch (screenName) {
      case 'landing':              screen.innerHTML = this.renderLandingScreen(); break;
      case 'timeline':             screen.innerHTML = this.renderTimelineScreen(); break;
      case 'role-selection':       screen.innerHTML = this.renderRoleSelectionScreen(data); break;
      case 'scene':                screen.innerHTML = this.renderSceneScreen(); break;
      case 'outcome':              screen.innerHTML = this.renderOutcomeScreen(data); break;
      case 'historical-ripple':    screen.innerHTML = this.renderHistoricalRippleScreen(data); break;
      case 'knowledge-checkpoint': screen.innerHTML = this.renderKnowledgeCheckpointScreen(data); break;
      case 'results-card':         screen.innerHTML = this.renderResultsCardScreen(data); break;
      default: console.error(`UIController.createScreen: Unknown screen "${screenName}"`); return null;
    }

    this.attachEventListeners(screen, screenName);
    return screen;
  }

  // ── Screen HTML renderers ───────────────────────────────────────────────────

  renderLandingScreen() {
    const c = this.content.landing;
    return `
      <article class="landing-content text-center" role="article" aria-labelledby="landing-title">
        <h1 id="landing-title" class="text-gold">${c.title}</h1>
        <h2>${c.subtitle}</h2>
        <p class="tagline">${c.tagline}</p>
        <p class="context">${c.context}</p>
        <button id="begin-button" class="mt-lg" aria-label="Begin game and view mission timeline">${c.buttonText}</button>
      </article>
    `;
  }

  renderTimelineScreen() {
    const c = this.content.timeline;
    return `
      <article class="timeline-content" role="article" aria-labelledby="timeline-title">
        <h2 id="timeline-title" class="text-center text-gold">${c.title}</h2>
        <p class="text-center">${c.subtitle}</p>
        <nav id="timeline-container" class="mt-lg" role="navigation" aria-label="Historical mission timeline"></nav>
      </article>
    `;
  }

  renderRoleSelectionScreen(data) {
    const c = this.content.roleSelection;
    const mission = this.missionRegistry.getMission(this.currentMissionId);
    const subtitle = mission?.roleSelectionSubtitle || c.subtitle;
    return `
      <article class="role-selection-content" role="article" aria-labelledby="role-selection-title">
        <button id="back-to-timeline" class="back-button" aria-label="Back to timeline">← Back</button>
        <h2 id="role-selection-title" class="text-center text-gold">${c.title}</h2>
        <p class="text-center">${subtitle}</p>
        <section id="all-roles-completed-message" class="panel panel-parchment mt-lg hidden" role="region" aria-live="polite">
          <h3 class="text-gold text-center">${c.allRolesCompletedTitle}</h3>
          <p class="text-center">${c.allRolesCompletedMessage}</p>
        </section>
        <section id="role-cards-container" class="mt-lg" role="region" aria-label="Available roles"></section>
        <div class="endings-counter text-center mt-md" role="status" aria-live="polite">
          <p class="text-secondary">${c.endingsLabel} <span id="endings-count">0/3</span></p>
        </div>
      </article>
    `;
  }

  renderSceneScreen() {
    return `
      <article class="scene-content" role="article" aria-labelledby="scene-narrative">
        <section id="scene-narrative" class="panel panel-parchment" role="region" aria-label="Scene narrative"></section>
        <div id="timer-display" class="timer-display hidden" role="timer" aria-live="assertive" aria-atomic="true">
          <div class="timer-circle">
            <svg class="timer-progress" viewBox="0 0 100 100" aria-hidden="true">
              <circle class="timer-progress-bg" cx="50" cy="50" r="45"></circle>
              <circle class="timer-progress-fill" cx="50" cy="50" r="45"></circle>
            </svg>
            <div class="timer-text">
              <span id="timer-seconds" class="timer-seconds">10</span>
              <span class="timer-label">seconds</span>
            </div>
          </div>
        </div>
        <nav id="scene-choices" class="mt-md" role="navigation" aria-label="Available choices"></nav>
        <div id="scene-progress" class="text-center mt-md" role="status" aria-live="polite"></div>
      </article>
    `;
  }

  renderOutcomeScreen() {
    const c = this.content.outcome;
    return `
      <article class="outcome-content text-center" role="article" aria-labelledby="outcome-title">
        <h2 id="outcome-title" class="text-gold">${c.title}</h2>
        <section id="outcome-result" class="panel panel-parchment mt-lg" role="region" aria-label="Your outcome"></section>
        <button id="continue-to-ripple" class="mt-lg">${c.buttonText}</button>
      </article>
    `;
  }

  renderHistoricalRippleScreen() {
    const c = this.content.historicalRipple;
    const mission = this.missionRegistry?.getMission(this.currentMissionId);
    const subtitle = mission?.rippleSubtitle || c.subtitle;
    return `
      <article class="ripple-content" role="article" aria-labelledby="ripple-title">
        <h2 id="ripple-title" class="text-center text-gold">${c.title}</h2>
        <p class="text-center">${subtitle}</p>
        <section id="ripple-timeline" class="mt-lg" role="region" aria-label="Historical consequences timeline"></section>
        <button id="continue-to-checkpoint" class="mt-lg">${c.buttonText}</button>
      </article>
    `;
  }

  renderKnowledgeCheckpointScreen() {
    const c = this.content.knowledgeCheckpoint;
    return `
      <article class="checkpoint-content" role="article" aria-labelledby="checkpoint-title">
        <h2 id="checkpoint-title" class="text-center text-gold">${c.title}</h2>
        <p class="text-center">${c.subtitle}</p>
        <section id="checkpoint-questions" class="mt-lg" role="region" aria-label="Knowledge assessment questions"></section>
        <button id="view-results" class="mt-lg hidden">${c.buttonText}</button>
      </article>
    `;
  }

  renderResultsCardScreen(data) {
    const c = this.content.resultsCard;
    const cardData = { ...data, outcome: this.currentOutcome };
    const cardHTML = this.resultsCard
      ? this.resultsCard.generateCard(cardData)
      : '<p>Error: Results card generator not available.</p>';

    let annotationsHTML = '';
    if (this.annotationStore?.getHighlightCount() > 0) {
      const docsHTML = this.annotationStore.getAllDocuments().map(doc => {
        const highlightsHTML = doc.highlights.map(h => {
          const apTag   = h.apConcept ? `<span class="ap-theme-badge">${this._escapeHTML(h.apConcept)}</span>` : '';
          const noteHTML = h.note     ? `<p class="annotation-note">${this._escapeHTML(h.note)}</p>` : '';
          return `<div class="results-annotation-item">
            <span class="annotation-dot annotation-dot--${h.color}" aria-label="${h.colorLabel} highlight"></span>
            <div><p class="annotation-quote">&ldquo;${this._escapeHTML(h.text)}&rdquo;</p>${noteHTML}${apTag}</div>
          </div>`;
        }).join('');
        return `<div class="results-annotation-doc">
          <h4>${this._escapeHTML(doc.documentTitle)}</h4>
          <p class="text-secondary">${this._escapeHTML(doc.documentSource)}</p>
          ${highlightsHTML}
        </div>`;
      }).join('');
      annotationsHTML = `
        <section class="results-annotations mt-lg" role="region" aria-label="Your source annotations">
          <h3 class="text-gold">Your Source Annotations</h3>
          <p class="text-secondary">These are the primary sources you annotated during the mission.</p>
          ${docsHTML}
        </section>`;
    }

    return `
      <article class="results-content text-center" role="article" aria-labelledby="results-title">
        <h2 id="results-title" class="text-gold">${c.title}</h2>
        <section id="results-card" class="panel panel-parchment mt-lg" role="region" aria-label="Your game results">
          ${cardHTML}
        </section>
        ${annotationsHTML}
        <button id="copy-results" class="mt-md">${c.copyButtonText}</button>
        <button id="play-again" class="mt-md">${c.playAgainButtonText}</button>
      </article>
    `;
  }

  _escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // ── Scene rendering ─────────────────────────────────────────────────────────

  renderScene(scene, sceneIndex, totalScenes) {
    if (!scene?.narrative || !scene?.choices) {
      console.error('UIController.renderScene: Invalid scene object');
      return;
    }

    this.sceneTransition?.transition(null, scene, 'fade', 500);
    if (this.currentScreen !== 'scene') this.showScreen('scene');

    const narrativeContainer = document.getElementById('scene-narrative');
    const choicesContainer   = document.getElementById('scene-choices');
    const progressContainer  = document.getElementById('scene-progress');
    if (!narrativeContainer || !choicesContainer || !progressContainer) {
      console.error('UIController.renderScene: Scene containers not found');
      return;
    }

    narrativeContainer.innerHTML = `<p>${scene.narrative}</p>`;
    choicesContainer.innerHTML = '';

    scene.choices.forEach((choice, index) => {
      const btn = document.createElement('button');
      btn.className = 'choice-button mt-sm';
      btn.textContent = choice.text;
      btn.dataset.choiceId = choice.id;
      btn.dataset.nextScene = choice.nextScene;
      btn.dataset.consequences = JSON.stringify(choice.consequences || {});
      btn.setAttribute('aria-label', `Choice ${index + 1}: ${choice.text}`);
      btn.addEventListener('click', () => { this.haptics.selection(); this.handleChoiceClick(choice); });
      choicesContainer.appendChild(btn);
    });

    if (scene.predictionQuestion) {
      this._renderPredictionQuestion(choicesContainer, scene.predictionQuestion, scene.id);
    }

    this.disableChoices();

    const onTypewriterComplete = () => {
      glossaryTooltip.apply(narrativeContainer);
      this.enableChoices();
      this.eventBus.emit('typewriter:complete', { sceneId: scene.id });
      if (this.currentSceneData?.scene?.timedChoice?.enabled && this.timedChoiceSystem) {
        this.startTimedChoice(this.currentSceneData.scene.timedChoice);
      }
    };

    if (this.typewriterEffect) {
      const p = narrativeContainer.querySelector('p');
      if (p) {
        this.typewriterEffect.revealText(p, scene.narrative, 30, onTypewriterComplete);
      } else {
        onTypewriterComplete();
      }
    } else {
      onTypewriterComplete();
    }

    this.updateProgress(sceneIndex + 1, totalScenes);

    if (scene.ambientTrack && this.ambientSoundManager) {
      this.ambientSoundManager.crossfade(this.currentAmbientSound || null, scene.ambientTrack, 1500);
      this.currentAmbientSound = scene.ambientTrack;
    }
  }

  enableChoices() {
    document.querySelectorAll('.choice-button').forEach(btn => {
      btn.disabled = false;
      btn.style.pointerEvents = 'auto';
      btn.style.opacity = '1';
    });
  }

  disableChoices() {
    document.querySelectorAll('.choice-button').forEach(btn => {
      btn.disabled = true;
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '0.5';
    });
  }

  startTimedChoice(timedChoiceConfig) {
    if (!this.timedChoiceSystem) { console.warn('UIController: TimedChoiceSystem not available'); return; }
    if (!timedChoiceConfig.duration || !timedChoiceConfig.defaultChoice) {
      console.error('UIController: Invalid timedChoice config'); return;
    }

    let defaultBtn = null;
    document.querySelectorAll('.choice-button').forEach(btn => {
      if (btn.dataset.choiceId === timedChoiceConfig.defaultChoice) defaultBtn = btn;
    });

    if (!defaultBtn) { console.error(`UIController: Default choice "${timedChoiceConfig.defaultChoice}" not found`); return; }

    this.timedChoiceSystem.startTimer(
      timedChoiceConfig.duration,
      timedChoiceConfig.defaultChoice,
      () => {
        if (defaultBtn.disabled) {
          defaultBtn.disabled = false;
          defaultBtn.style.pointerEvents = 'auto';
          defaultBtn.style.opacity = '1';
        }
        defaultBtn.click();
      }
    );
  }

  handleChoiceClick(choice) {
    this.eventBus.emit('choice:made', {
      choiceId:     choice.id,
      nextSceneId:  choice.nextScene,
      consequences: choice.consequences || {}
    });
  }

  updateProgress(current, total) {
    const container = document.getElementById('scene-progress');
    if (!container) return;
    container.innerHTML = `
      <p class="text-secondary">${this.content.progress?.sceneLabel || 'Scene'} ${current} of ${total}</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${(current / total) * 100}%"></div>
      </div>
    `;
  }

  // ── Event listener attachment ───────────────────────────────────────────────

  attachEventListeners(screen, screenName) {
    if (screenName === 'landing') {
      screen.querySelector('#begin-button')?.addEventListener('click', () => {
        this.haptics.light(); this.showScreen('timeline');
      });
    }
    if (screenName === 'timeline') {
      const container = screen.querySelector('#timeline-container');
      if (container && this.timelineSelector) this.timelineSelector.render(container);
    }
    if (screenName === 'role-selection') {
      this.populateRoleCards(screen);
      screen.querySelector('#back-to-timeline')?.addEventListener('click', () => {
        this.haptics.light(); this.showScreen('timeline');
      });
    }
    if (screenName === 'outcome') {
      this.populateOutcomeScreen(screen);
      screen.querySelector('#continue-to-ripple')?.addEventListener('click', () => this.showScreen('historical-ripple'));
    }
    if (screenName === 'historical-ripple') {
      this.populateHistoricalRipple(screen);
      screen.querySelector('#continue-to-checkpoint')?.addEventListener('click', () => this.showScreen('knowledge-checkpoint'));
    }
    if (screenName === 'knowledge-checkpoint') {
      this.populateKnowledgeCheckpoint(screen);
    }
    if (screenName === 'results-card') {
      screen.querySelector('#copy-results')?.addEventListener('click', () => this.copyResultsToClipboard());
      screen.querySelector('#play-again')?.addEventListener('click', () => {
        this.eventBus.emit('mission:selected', { missionId: this.currentMissionId });
      });
    }
  }

  // ── Role cards ──────────────────────────────────────────────────────────────

  populateRoleCards(screen) {
    const container = screen.querySelector('#role-cards-container');
    if (!container || !this.currentMissionId) return;

    const mission = this.missionRegistry.getMission(this.currentMissionId);
    if (!mission?.roles) return;

    container.innerHTML = '';
    mission.roles.forEach(role => {
      const card = document.createElement('article');
      card.className = 'role-card';
      card.setAttribute('aria-labelledby', `role-title-${role.id}`);
      const isCompleted = this.completedRoles.has(role.id);
      if (isCompleted) card.classList.add('completed');

      const c = this.content.roleSelection;

      if (isCompleted) {
        const badge = document.createElement('span');
        badge.className = 'completion-badge';
        badge.textContent = c.completionBadge;
        card.appendChild(badge);
      }

      card.innerHTML += `
        <h3 id="role-title-${role.id}" class="role-title">${role.name}</h3>
        <p class="role-description">${role.description}</p>
        <button class="role-select-button" data-role-id="${role.id}"
                aria-label="${isCompleted ? c.playAgainAriaLabel : c.selectRoleAriaLabel}: ${role.name}">
          ${isCompleted ? c.playAgainButton : c.selectRoleButton}
        </button>
      `;

      card.querySelector('.role-select-button').addEventListener('click', () => {
        this.haptics.medium();
        this.eventBus.emit('role:selected', { missionId: this.currentMissionId, roleId: role.id });
      });
      container.appendChild(card);
    });

    const total = mission.roles.length;
    const done  = this.completedRoles.size;
    const countEl = screen.querySelector('#endings-count');
    if (countEl) countEl.textContent = `${done}/${total}`;
    if (done === total) screen.querySelector('#all-roles-completed-message')?.classList.remove('hidden');
  }

  updateEndingsCounter() {
    const el = document.getElementById('endings-count');
    if (!el || !this.currentMissionId) return;
    const mission = this.missionRegistry.getMission(this.currentMissionId);
    if (!mission) return;
    el.textContent = `${this.completedRoles.size}/${mission.roles.length}`;
    if (this.completedRoles.size === mission.roles.length) {
      document.getElementById('all-roles-completed-message')?.classList.remove('hidden');
    }
  }

  _setMissionTheme(missionId) {
    document.body.classList.remove('mission-haymarket', 'mission-pearl-harbor', 'mission-rwanda', 'mission-urban');
    const map = {
      'haymarket-affair':  'mission-haymarket',
      'pearl-harbor':      'mission-pearl-harbor',
      'rwanda-genocide':   'mission-rwanda',
      'aphg-urban-design': 'mission-urban'
    };
    if (missionId && map[missionId]) document.body.classList.add(map[missionId]);
  }

  // ── Outcome screen ──────────────────────────────────────────────────────────

  populateOutcomeScreen(screen) {
    const container = screen.querySelector('#outcome-result');
    if (!container) return;

    if (!this.currentMissionId || !this.currentRoleId) {
      container.innerHTML = `<p>Error: Unable to determine outcome.</p>`; return;
    }

    const mission = this.missionRegistry.getMission(this.currentMissionId);
    const role    = mission?.roles.find(r => r.id === this.currentRoleId);
    if (!role?.outcomes) { container.innerHTML = `<p>Error: Role outcome data not found.</p>`; return; }

    const survivalResult = this.consequenceSystem.determineSurvival(this.currentRoleId);
    const outcomeId      = this.consequenceSystem.calculateOutcome(role.outcomes, survivalResult.survived);
    const outcome        = outcomeId ? role.outcomes.find(o => o.id === outcomeId) : null;
    if (!outcome) { container.innerHTML = `<p>Error: Outcome not found.</p>`; return; }

    const survived     = outcome.survived;
    const statusClass  = survived ? 'text-success' : 'text-danger';
    const statusLabel  = survived
      ? (this.content.outcome?.survivedLabel || 'You Survived')
      : (this.content.outcome?.didNotSurviveLabel || 'You Did Not Survive');

    let epilogue = (this.earlyDeathContext?.diedEarly && outcome.deathEpilogueEarly)
      ? outcome.deathEpilogueEarly
      : outcome.epilogue;

    container.innerHTML = `
      <h3 class="${statusClass}">${statusLabel}</h3>
      <div class="outcome-epilogue mt-md">${this.formatEpilogue(epilogue)}</div>
    `;
  }

  formatEpilogue(epilogue) {
    return (epilogue || '').split('\n\n')
      .filter(p => p.trim())
      .map(p => `<p>${p.trim()}</p>`)
      .join('');
  }

  // ── Historical ripple ───────────────────────────────────────────────────────

  populateHistoricalRipple(screen) {
    const container = screen.querySelector('#ripple-timeline');
    if (!container || !this.currentMissionId) return;

    const mission = this.missionRegistry.getMission(this.currentMissionId);
    if (!mission?.historicalRipple) return;

    container.innerHTML = '';
    mission.historicalRipple.forEach((event, index) => {
      const el = document.createElement('article');
      el.className = 'ripple-event';
      el.setAttribute('aria-labelledby', `ripple-event-title-${index}`);
      el.style.animationDelay = `${event.animationDelay}ms`;
      el.innerHTML = `
        <header class="ripple-event-header">
          <time class="ripple-event-date" datetime="${event.date}">${event.date}</time>
        </header>
        <h3 id="ripple-event-title-${index}" class="ripple-event-title">${event.title}</h3>
        <p class="ripple-event-description">${event.description}</p>
        <span class="ripple-event-theme" aria-label="AP theme: ${event.apTheme}">
          ${this.content.historicalRipple?.apThemeLabel || 'AP Theme:'} ${this.formatApTheme(event.apTheme)}
        </span>
      `;
      container.appendChild(el);
    });

    if (mission.postRippleQuestion) this._renderPostRippleQuestion(container, mission.postRippleQuestion);
  }

  _buildQuestExplainer(type) {
    const map = this.content.questExplainer || {};
    const { icon = '', text = '' } = map[type] || {};
    return `<div class="quest-explainer"><div class="quest-explainer-icon">${icon}</div><span class="quest-explainer-text">${text}</span></div>`;
  }

  _renderPostRippleQuestion(container, prq) {
    const wrapper = document.createElement('article');
    wrapper.className = 'post-ripple-synthesis panel panel-parchment mt-lg';
    wrapper.setAttribute('aria-labelledby', 'post-ripple-question-text');
    wrapper.insertAdjacentHTML('afterbegin', this._buildQuestExplainer('synthesis'));

    const skillTag = document.createElement('span');
    skillTag.className = 'ap-skill-tag';
    skillTag.textContent = `AP Skill: ${this.formatApTheme(prq.apSkill)}`;

    const questionText = document.createElement('p');
    questionText.id = 'post-ripple-question-text';
    questionText.className = 'question-text mt-sm';
    questionText.textContent = prq.question;

    const optionsContainer = document.createElement('nav');
    optionsContainer.className = 'question-options mt-sm';

    const explanationEl = document.createElement('section');
    explanationEl.className = 'question-explanation hidden mt-md';
    explanationEl.innerHTML = `<h4>${this.content.stimuliOverlay?.apAnalysisHeading || ''}</h4><p>${prq.explanation}</p>`;

    ['A','B','C','D'].forEach((label, i) => {
      const option = prq.options[i];
      if (!option) return;
      const btn = document.createElement('button');
      btn.className = 'option-button quest-option-button';
      btn.textContent = `${label}. ${option.text}`;
      btn.addEventListener('click', () => {
        this.haptics.light();
        optionsContainer.querySelectorAll('.option-button').forEach(b => {
          b.disabled = true;
          if (b.dataset.correct === 'true') b.classList.add('correct');
        });
        btn.classList.add(option.correct ? 'correct' : 'incorrect');
        explanationEl.classList.remove('hidden');
      });
      btn.dataset.correct = option.correct;
      optionsContainer.appendChild(btn);
    });

    wrapper.appendChild(skillTag);
    wrapper.appendChild(questionText);
    wrapper.appendChild(optionsContainer);
    wrapper.appendChild(explanationEl);
    container.appendChild(wrapper);
  }

  formatApTheme(theme) {
    if (!theme) return '';
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  }

  // ── Knowledge checkpoint ────────────────────────────────────────────────────

  populateKnowledgeCheckpoint(screen) {
    const container = screen.querySelector('#checkpoint-questions');
    if (!container || !this.currentMissionId || !this.currentRoleId) return;

    const mission = this.missionRegistry.getMission(this.currentMissionId);
    const roleQuestions = mission?.knowledgeQuestions?.filter(q => q.roleSpecific === this.currentRoleId);
    if (!roleQuestions?.length) {
      container.innerHTML = `<p>Error: No questions available for this role.</p>`; return;
    }

    this.checkpointAnswers = new Map();
    this.checkpointScore = 0;
    this.checkpointTotalQuestions = roleQuestions.length;
    container.innerHTML = '';

    roleQuestions.forEach((question, index) => {
      const el = document.createElement('article');
      el.className = 'checkpoint-question panel panel-parchment mt-md';
      el.setAttribute('aria-labelledby', `question-${index}-text`);

      const header = document.createElement('header');
      header.className = 'question-header';
      header.insertAdjacentHTML('afterbegin', this._buildQuestExplainer('checkpoint'));
      const num = document.createElement('h3');
      num.className = 'question-number';
      num.textContent = `Question ${index + 1}`;
      const skillTag = document.createElement('span');
      skillTag.className = 'ap-skill-tag';
      skillTag.textContent = `AP Skill: ${this.formatApTheme(question.apSkill)}`;
      header.appendChild(num);
      header.appendChild(skillTag);

      const qText = document.createElement('p');
      qText.id = `question-${index}-text`;
      qText.className = 'question-text';
      qText.textContent = question.question;

      const optContainer = document.createElement('nav');
      optContainer.className = 'question-options mt-sm';

      const explanation = document.createElement('section');
      explanation.className = 'question-explanation hidden mt-md';
      explanation.innerHTML = `<h4>${this.content.knowledgeCheckpoint?.explanationHeading || 'Explanation:'}</h4><p>${question.explanation}</p>`;

      const shuffled = [...question.options].sort(() => Math.random() - 0.5);
      shuffled.forEach((option, di) => {
        const label = ['A','B','C','D'][di] || String(di + 1);
        const btn = document.createElement('button');
        btn.className = 'option-button';
        btn.textContent = `${label}. ${option.text}`;
        btn.dataset.optionId = option.id;
        btn.dataset.correct  = option.correct;
        btn.addEventListener('click', () => {
          this.haptics.light();
          this.handleAnswerSelection(question, option, el, optContainer);
        });
        optContainer.appendChild(btn);
      });

      el.appendChild(header);
      el.appendChild(qText);
      el.appendChild(optContainer);
      el.appendChild(explanation);
      container.appendChild(el);
    });
  }

  handleAnswerSelection(question, selectedOption, questionEl, optContainer) {
    if (this.checkpointAnswers.has(question.id)) return;

    const isCorrect = selectedOption.correct === true;
    this.checkpointAnswers.set(question.id, { selectedAnswer: selectedOption.id, correct: isCorrect });
    if (isCorrect) this.checkpointScore++;

    optContainer.querySelectorAll('.option-button').forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.optionId === selectedOption.id) btn.classList.add(isCorrect ? 'correct' : 'incorrect');
      else if (btn.dataset.correct === 'true') btn.classList.add('correct');
    });

    questionEl.querySelector('.question-explanation')?.classList.remove('hidden');
    if (this.checkpointAnswers.size === this.checkpointTotalQuestions) this.showCheckpointResults();
  }

  showCheckpointResults() {
    const btn = document.getElementById('view-results');
    if (!btn) return;
    btn.classList.remove('hidden');
    btn.addEventListener('click', () => {
      this.eventBus.emit('checkpoint:complete', {
        score: this.checkpointScore,
        totalQuestions: this.checkpointTotalQuestions
      });
    });

    const pct = Math.round((this.checkpointScore / this.checkpointTotalQuestions) * 100);
    const scoreEl = document.createElement('div');
    scoreEl.className = `checkpoint-score text-center mt-lg ${pct >= 70 ? 'text-success' : 'text-warning'}`;
    scoreEl.innerHTML = `<h3>Score: ${this.checkpointScore}/${this.checkpointTotalQuestions}</h3><p>${pct}% Correct</p>`;
    btn.parentNode?.insertBefore(scoreEl, btn);
  }

  async copyResultsToClipboard() {
    if (!this.resultsCard) return;
    const success = await this.resultsCard.copyCardText();
    alert(success
      ? (this.content.resultsCard?.copySuccessMessage || 'Copied!')
      : (this.content.resultsCard?.copyFailMessage   || 'Failed to copy.')
    );
  }

  // ── Timer display ───────────────────────────────────────────────────────────

  handleTimerStarted(data) {
    const el = document.getElementById('timer-display');
    if (!el) return;
    el.classList.remove('hidden');
    this.updateTimerDisplay(data.duration, data.duration);
  }

  handleTimerUpdate(data) {
    const el = document.getElementById('timer-display');
    if (!el) return;
    this.updateTimerDisplay(data.remaining, null);
    el.classList.toggle('timer-warning', data.isWarning);
  }

  handleTimerExpired() {
    const el = document.getElementById('timer-display');
    if (el) { el.classList.add('hidden'); el.classList.remove('timer-warning'); }
  }

  handleTimerCancelled() {
    const el = document.getElementById('timer-display');
    if (el) { el.classList.add('hidden'); el.classList.remove('timer-warning'); }
  }

  updateTimerDisplay(remaining, duration) {
    const secondsEl = document.getElementById('timer-seconds');
    if (!secondsEl) return;
    secondsEl.textContent = Math.ceil(remaining / 1000);

    const fill = document.querySelector('.timer-progress-fill');
    if (fill && duration) {
      const offset = 2 * Math.PI * 45 * (1 - remaining / duration);
      fill.style.strokeDashoffset = offset;
    }
  }

  // ── Prediction question ─────────────────────────────────────────────────────

  _renderPredictionQuestion(choicesContainer, pq, sceneId) {
    const wrapper = document.createElement('div');
    wrapper.className = 'prediction-question panel panel-parchment mt-md';
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-label', 'Prediction question');

    wrapper.insertAdjacentHTML('afterbegin', this._buildQuestExplainer('prediction'));

    const questionText = document.createElement('p');
    questionText.className = 'question-text mt-sm';
    questionText.textContent = pq.question;

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'prediction-options mt-sm';

    const revealEl = document.createElement('div');
    revealEl.className = 'prediction-reveal panel mt-sm hidden';
    revealEl.setAttribute('aria-live', 'polite');
    revealEl.innerHTML = `<p class="text-secondary">${pq.reveal}</p>`;

    pq.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-button quest-option-button mt-sm';
      btn.textContent = opt.text;
      btn.addEventListener('click', () => {
        optionsContainer.querySelectorAll('.option-button').forEach(b => { b.disabled = true; b.style.opacity = '0.6'; });
        btn.style.opacity = '1';
        btn.classList.add('selected');
        revealEl.classList.remove('hidden');
        this.eventBus.emit('prediction:answered', { sceneId, selectedId: opt.id });
      });
      optionsContainer.appendChild(btn);
    });

    wrapper.appendChild(questionText);
    wrapper.appendChild(optionsContainer);
    wrapper.appendChild(revealEl);

    const firstChoice = choicesContainer.querySelector('.choice-button');
    if (firstChoice) choicesContainer.insertBefore(wrapper, firstChoice);
    else choicesContainer.appendChild(wrapper);
  }

  // ── Stimulus overlay ────────────────────────────────────────────────────────

  _stimuliDocTypeClass(doc) {
    const type = doc.documentType || '';
    if (type === 'arbeiter-zeitung') return 'doc-type--arbeiter-zeitung';
    if (type === 'pinkerton-report') return 'doc-type--pinkerton-report';
    if (type === 'harper-weekly')    return 'doc-type--harper-weekly';
    if (type === 'court-transcript') return 'doc-type--court-transcript';

    const id = doc.id || '';
    if (id === 'hm-doc-1a' || id === 'hm-doc-1b' || id === 'hm-doc-3') return 'doc-type--arbeiter-zeitung';
    if (id === 'hm-doc-0')  return 'doc-type--pinkerton-report';
    if (id === 'hm-doc-2' || id === 'hm-doc-4') return 'doc-type--harper-weekly';
    if (id === 'hm-doc-5')  return 'doc-type--court-transcript';
    return 'doc-type--default';
  }

  _injectDustParticles(overlay) {
    const dust = document.createElement('div');
    dust.className = 'stimuli-dust';
    dust.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 5; i++) {
      const p = document.createElement('div');
      p.className = 'stimuli-dust-particle';
      p.style.setProperty('--drift-duration', `${7 + Math.random() * 6}s`);
      p.style.setProperty('--drift-delay', `${Math.random() * 4}s`);
      p.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 60}px`);
      p.style.left = `${10 + Math.random() * 80}%`;
      p.style.bottom = '0';
      dust.appendChild(p);
    }
    overlay.appendChild(dust);
  }

  _renderStimulusOverlay(doc) {
    document.getElementById('stimuli-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'stimuli-overlay';
    overlay.className = 'stimuli-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'stimuli-doc-title');

    this._injectDustParticles(overlay);

    const typeClass = this._stimuliDocTypeClass(doc);
    const spiceStr  = (doc.spiceT || []).join(' · ');

    const illustrationHTML = typeClass === 'doc-type--harper-weekly'
      ? `<div class="stimuli-illustration-placeholder" aria-hidden="true">[ ${this.content.stimuliOverlay?.illustrationLabel || 'Engraving'} — ${doc.title} ]</div>`
      : '';
    const signatureHTML = typeClass === 'doc-type--court-transcript'
      ? `<div class="stimuli-signature" aria-label="Document signature line">${this.content.stimuliOverlay?.signatureLine || '_________________________'}</div>`
      : '';

    const content = document.createElement('div');
    content.className = `stimuli-content ${typeClass}`;
    content.innerHTML = `
      <div class="stimuli-meta">
        <span class="ap-skill-tag">${spiceStr}</span>
        <span class="stimuli-unit text-secondary">${doc.apUnit || ''}</span>
      </div>
      <h3 id="stimuli-doc-title" class="stimuli-title mt-sm">${doc.title}</h3>
      <p class="stimuli-source">${doc.source} — ${doc.date}</p>
      ${illustrationHTML}
      <div class="stimuli-text mt-md">${doc.text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</div>
      ${signatureHTML}
    `;

    overlay.appendChild(content);
    document.body.appendChild(overlay);

    // Emit dom-ready AFTER paint so StimuliRevealAnimator has the element
    requestAnimationFrame(() => {
      this.eventBus.emit('stimuli:dom-ready', {
        documentId: doc.id,
        overlayEl:  overlay,
        contentEl:  content
      });
    });

    this._attachReadConfirmButton(content, doc);
  }

  _attachReadConfirmButton(contentEl, doc) {
    const crossRolePrompt = doc.crossRolePrompt || null;
    let questionMounted = false;

    const btn = document.createElement('button');
    btn.id = 'stimuli-read-confirm';
    btn.className = 'stimuli-read-confirm-btn mt-lg';
    btn.setAttribute('aria-label', 'I have read this document — answer the question');
    btn.textContent = "I've read this document →";
    contentEl.appendChild(btn);

    btn.addEventListener('click', () => {
      if (questionMounted) return;
      questionMounted = true;
      btn.remove();

      if (!doc.pauseQuestion) {
        this._showDismissButton(contentEl, doc.id);
        this.eventBus.emit('stimuli:answer-submitted', { documentId: doc.id, selectedId: null, correct: false });
        return;
      }
      this._mountPauseQuestion(contentEl, doc, crossRolePrompt);
    });
  }

  _openInventory() {
    document.getElementById('annotation-inventory-toggle')?.click();
  }

  _mountPauseQuestion(contentEl, doc, crossRolePrompt) {
    this.currentDocHasPauseQuestion = true;

    const modal = new PauseQuestionModal(this.eventBus, doc.pauseQuestion, doc.id, crossRolePrompt || null);

    const onAnswered = (data) => {
      if (data.documentId !== doc.id) return;
      this.eventBus.off('stimuli:pause-question-answered', onAnswered);
      this.eventBus.off('inventory:open-requested', onInventoryOpen);
      setTimeout(() => {
        modal.destroy();
        this._showDismissButton(contentEl, doc.id);
      }, 800);
    };

    const onInventoryOpen = () => this._openInventory();

    this.eventBus.on('stimuli:pause-question-answered', onAnswered);
    this.eventBus.on('inventory:open-requested', onInventoryOpen);
    modal.mount();
  }

  _showDismissButton(contentEl, documentId) {
    if (contentEl.querySelector('#stimuli-dismiss-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'stimuli-dismiss-btn';
    btn.className = 'stimuli-dismiss-btn mt-lg';
    btn.textContent = this.content.stimuliOverlay?.dismissButton || 'Continue →';
    btn.setAttribute('aria-label', 'Continue and archive this document');
    btn.addEventListener('click', () => {
      this.eventBus.emit('stimuli:dismiss-requested', {
        documentId,
        noPauseQuestion: !this.currentDocHasPauseQuestion
      });
    });
    contentEl.appendChild(btn);
    btn.focus();
  }

}

export default UIController;