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
    this.eventBus.on('stimuli:new-unlocked',         this.handleStimuliNewUnlocked.bind(this));
    this.eventBus.on('stimuli:present-pause-question', this.handleStimuliPresentPauseQuestion.bind(this));
    this.eventBus.on('stimuli:all-pause-questions-complete', this.handleStimuliAllPauseQuestionsComplete.bind(this));
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

  handleStimuliNewUnlocked(data) {
    if (!data?.documentIds?.length) return;
    
    const toast = document.createElement('div');
    toast.className = 'intel-unlocked-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `<span class="toast-icon">📁</span> New Intel Acquired`;
    document.body.appendChild(toast);
    
    // Base inline styles for the toast (can be overridden by CSS classes later)
    Object.assign(toast.style, {
      position: 'fixed', top: '20px', right: '20px', backgroundColor: '#8a6a3a', 
      color: '#fff', padding: '12px 20px', borderRadius: '4px', zIndex: '9999',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '8px',
      transform: 'translateX(120%)', transition: 'transform 0.4s ease-out', fontWeight: 'bold'
    });
    
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });
    
    setTimeout(() => {
      toast.style.transform = 'translateX(120%)';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
    
    this.haptics.medium();
  }

  handleStimuliPresentPauseQuestion(data) {
    if (!data?.documentId || !data?.documentData) return;
    
    // Lock the world so the player MUST answer the question before advancing
    const appEl = document.getElementById('app');
    if (appEl) appEl.inert = true;
    
    document.getElementById('scene-choices').style.pointerEvents = 'none';
    document.getElementById('scene-choices').style.opacity = '0.5';
    this.disableChoices();

    const doc = data.documentData;
    this._mountPauseQuestion(doc, doc.crossRolePrompt);
  }

  handleStimuliAllPauseQuestionsComplete(data) {
    // Thaw the world
    const appEl = document.getElementById('app');
    if (appEl) {
      appEl.inert = false;
    }
    
    const choicesEl = document.getElementById('scene-choices');
    if (choicesEl) {
      choicesEl.style.pointerEvents = 'all';
      choicesEl.style.opacity = '1';
    }

    // Force enable all buttons to ensure no "deadlock" state
    document.querySelectorAll('.choice-button, .prediction-option, .quest-option-button').forEach(btn => {
      btn.disabled = false;
      btn.style.pointerEvents = 'all';
      btn.style.opacity = '1';
    });

    this.enableChoices();
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
      // Update Background Image if present
      const appWrap = document.getElementById('app');
      if (appWrap) {
        if (scene.backgroundImage) {
          appWrap.style.backgroundImage = `url('${scene.backgroundImage}')`;
          appWrap.style.backgroundSize = 'cover';
          appWrap.style.backgroundPosition = 'center';
          appWrap.style.backgroundRepeat = 'no-repeat';
          appWrap.classList.add('has-background');
        } else {
          appWrap.style.backgroundImage = 'none';
          appWrap.classList.remove('has-background');
        }
      }

      this.enableChoices();
      this.currentSceneId = scene.id;
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
    document.querySelectorAll('.choice-button, .prediction-option').forEach(btn => {
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

  _openInventory() {
    // Attempt to open the unified inventory toggle (supports the new IntelInventory)
    document.getElementById('doc-inventory-trigger')?.click();
  }

  /**
   * Shows a small popup/hint reminding the player they can use their inventory
   * to reference stimuli while answering a pause question.
   */
  _showInventoryReminder() {
    const hint = document.createElement('div');
    hint.className = 'pqm-inventory-hint';
    hint.setAttribute('role', 'status');
    hint.setAttribute('aria-live', 'polite');
    hint.innerHTML = `
      <span class="pqm-inventory-hint-icon" aria-hidden="true">📁</span>
      <div class="pqm-inventory-hint-text">If needed, open your Intel Inventory to reference the source material.</div>
    `;
    
    document.body.appendChild(hint);

    // Auto-dismiss after 6 seconds, or if the user clicks anywhere
    const dismiss = () => {
      if (!hint.parentNode) return;
      hint.classList.add('fade-out');
      setTimeout(() => hint.remove(), 500);
      document.removeEventListener('mousedown', dismiss);
    };

    setTimeout(dismiss, 6000);
    document.addEventListener('mousedown', dismiss);
  }

  _mountPauseQuestion(doc, crossRolePrompt) {
    this.currentDocHasPauseQuestion = true;

    const modal = new PauseQuestionModal(this.eventBus, doc.pauseQuestion, doc.id, crossRolePrompt || null);

    const onInventoryOpen = () => this._openInventory();
    this.eventBus.on('inventory:open-requested', onInventoryOpen);

    // Clean up inventory listener when the modal is submitted and closed
    const onAnswerSubmitted = (data) => {
      if (data.documentId !== doc.id) return;
      this.eventBus.off('inventory:open-requested', onInventoryOpen);
      this.eventBus.off('stimuli:answer-submitted', onAnswerSubmitted);
    };
    this.eventBus.on('stimuli:answer-submitted', onAnswerSubmitted);

    modal.mount();

    // Show the inventory reminder after a short delay
    setTimeout(() => this._showInventoryReminder(), 800);
  }

}

export default UIController;
