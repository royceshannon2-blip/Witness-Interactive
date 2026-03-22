/**
 * UIController - DOM Manipulation and Screen Rendering
 * 
 * Handles all DOM manipulation and screen rendering for the game.
 * Subscribes to EventBus for state changes and renders appropriate screens.
 * Communicates only via EventBus - no direct component coupling.
 * 
 * Screen Types:
 * - landing: Title and intro
 * - timeline: Interactive historical timeline
 * - role-selection: Choose perspective
 * - scene: Narrative with choices
 * - outcome: Survival result and epilogue
 * - historical-ripple: Animated timeline
 * - knowledge-checkpoint: AP questions
 * - results-card: Shareable completion card
 * 
 * Requirements: 5.2, 5.3, 5.5, 18.4
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

    // Inventory: tracks all document IDs shown this session (briefing + scenes)
    
    
    this.subscribeToEvents();
    this.setupSoundToggle();
    this.setupNarratorToggle();
  }

  subscribeToEvents() {
    this.eventBus.on('scene:transition', this.handleSceneTransition.bind(this));
    this.eventBus.on('game:start', this.handleGameStart.bind(this));
    this.eventBus.on('game:complete', this.handleGameComplete.bind(this));
    this.eventBus.on('mission:selected', this.handleMissionSelected.bind(this));
    this.eventBus.on('role:selected', this.handleRoleSelected.bind(this));
    this.eventBus.on('briefing:back', this.handleBriefingBack.bind(this));
    this.eventBus.on('checkpoint:complete', this.handleCheckpointComplete.bind(this));
    this.eventBus.on('timer:started', this.handleTimerStarted.bind(this));
    this.eventBus.on('timer:update', this.handleTimerUpdate.bind(this));
    this.eventBus.on('timer:expired', this.handleTimerExpired.bind(this));
    this.eventBus.on('timer:cancelled', this.handleTimerCancelled.bind(this));
    this.eventBus.on('sound:muted', this.handleSoundMuted.bind(this));
    this.eventBus.on('narrator:muted', this.handleNarratorMuted.bind(this));
    this.eventBus.on('stimuli:view-ready', this.handleStimuliViewReady.bind(this));
    this.eventBus.on('stimuli:shown',      this.handleStimuliShown.bind(this));
    this.eventBus.on('stimuli:dismissed',  this.handleStimuliDismissed.bind(this));
    this.eventBus.on('scene:error', () => {
      console.warn('UIController: scene:error received — re-rendering current scene');
      if (this.currentSceneData && this.currentSceneData.scene) {
        this.renderScene(
          this.currentSceneData.scene,
          this.currentSceneData.sceneIndex,
          this.currentSceneData.totalScenes
        );
      }
    });
  }

  setupSoundToggle() {
    const soundToggleButton = document.getElementById('sound-toggle');
    
    if (!soundToggleButton) {
      console.warn('UIController.setupSoundToggle: #sound-toggle button not found in DOM');
      return;
    }
    
    if (this.ambientSoundManager) {
      soundToggleButton.disabled = false;
      soundToggleButton.setAttribute('aria-label', 'Toggle sound on/off');
      soundToggleButton.addEventListener('click', () => {
        this.eventBus.emit('sound:toggle');
      });
      this.updateSoundToggleIcon(this.ambientSoundManager.isMuted());
    } else {
      console.warn('UIController.setupSoundToggle: AmbientSoundManager not available, button remains disabled');
    }
  }

  setupNarratorToggle() {
    if (!this.narratorAudioManager) {
      return;
    }
    
    let narratorToggleButton = document.getElementById('narrator-toggle');
    
    if (!narratorToggleButton) {
      narratorToggleButton = document.createElement('button');
      narratorToggleButton.id = 'narrator-toggle';
      narratorToggleButton.className = 'narrator-toggle';
      narratorToggleButton.setAttribute('aria-label', 'Toggle narrator audio on/off');
      
      const narratorIcon = document.createElement('span');
      narratorIcon.className = 'narrator-icon';
      narratorIcon.textContent = '🔊';
      narratorToggleButton.appendChild(narratorIcon);
      
      const soundToggleButton = document.getElementById('sound-toggle');
      if (soundToggleButton && soundToggleButton.parentNode) {
        soundToggleButton.parentNode.insertBefore(narratorToggleButton, soundToggleButton.nextSibling);
      } else {
        document.body.appendChild(narratorToggleButton);
      }
    }
    
    narratorToggleButton.addEventListener('click', () => {
      this.haptics.light();
      this.eventBus.emit('narrator:toggle');
    });
    
    this.updateNarratorToggleIcon(this.narratorAudioManager.isMuted());
  }

  handleSoundMuted(data) {
    if (data && typeof data.muted === 'boolean') {
      this.updateSoundToggleIcon(data.muted);
    }
  }

  handleNarratorMuted(data) {
    if (data && typeof data.muted === 'boolean') {
      this.updateNarratorToggleIcon(data.muted);
    }
  }

  updateSoundToggleIcon(muted) {
    const soundToggleButton = document.getElementById('sound-toggle');
    if (!soundToggleButton) return;
    
    const soundIcon = soundToggleButton.querySelector('.sound-icon');
    if (!soundIcon) return;
    
    if (muted) {
      soundIcon.textContent = '🔇';
      soundToggleButton.setAttribute('aria-label', 'Sound is muted. Click to unmute.');
    } else {
      soundIcon.textContent = '🔊';
      soundToggleButton.setAttribute('aria-label', 'Sound is on. Click to mute.');
    }
  }

  updateNarratorToggleIcon(muted) {
    const narratorToggleButton = document.getElementById('narrator-toggle');
    if (!narratorToggleButton) return;
    
    const narratorIcon = narratorToggleButton.querySelector('.narrator-icon');
    if (!narratorIcon) return;
    
    if (muted) {
      narratorIcon.textContent = '🔇';
      narratorToggleButton.setAttribute('aria-label', 'Narrator is muted. Click to unmute.');
      narratorToggleButton.classList.add('muted');
    } else {
      narratorIcon.textContent = '🔊';
      narratorToggleButton.setAttribute('aria-label', 'Narrator is on. Click to mute.');
      narratorToggleButton.classList.remove('muted');
    }
  }

  handleGameStart(data) {
    this.showScreen('landing');
    if (this.ambientSoundManager) {
      this.ambientSoundManager.fadeIn('656124__itsthegoodstuff__nature-ambiance.wav', 1500);
      this.currentAmbientSound = '656124__itsthegoodstuff__nature-ambiance.wav';
    }
  }

  handleSceneTransition(data) {
    if (!data || !data.scene) {
      console.error('UIController.handleSceneTransition: Invalid scene data');
      return;
    }
    this.currentSceneData = data;
    this.renderScene(data.scene, data.sceneIndex, data.totalScenes);
  }

  handleGameComplete(data) {
    // Handle both data.roleId and data.role for compatibility
    const roleId = data?.roleId || data?.role;
    if (roleId) {
      this.completedRoles.add(roleId);
      this.currentRoleId = roleId;
    }
    if (data && data.missionId) {
      this.currentMissionId = data.missionId;
    }
    
    // Store early death context if present
    if (data && data.diedEarly) {
      this.earlyDeathContext = {
        diedEarly: true,
        deathReason: data.deathReason,
        deathChance: data.deathChance
      };
    } else {
      this.earlyDeathContext = null;
    }
    
    // Update endings counter immediately
    this.updateEndingsCounter();
    
    // Check if all roles completed
    if (this.currentMissionId) {
      const mission = this.missionRegistry.getMission(this.currentMissionId);
      if (mission && this.completedRoles.size === mission.roles.length) {
        console.log('[UIController] All roles completed for mission:', this.currentMissionId);
      }
    }
    
    this.currentOutcome = this.calculateCurrentOutcome();
    this.showScreen('outcome', data);
  }

  calculateCurrentOutcome() {
    if (!this.currentMissionId || !this.currentRoleId) return null;
    const mission = this.missionRegistry.getMission(this.currentMissionId);
    if (!mission) return null;
    const role = mission.roles.find(r => r.id === this.currentRoleId);
    if (!role || !role.outcomes) return null;
    
    // If player died early (mid-story), use survived=false
    let survivalResult;
    if (this.earlyDeathContext && this.earlyDeathContext.diedEarly) {
      survivalResult = {
        survived: false,
        deathChance: this.earlyDeathContext.deathChance,
        modifiers: { 'early_death': this.earlyDeathContext.deathReason }
      };
    } else {
      survivalResult = this.consequenceSystem.determineSurvival(this.currentRoleId);
    }
    
    const outcomeId = this.consequenceSystem.calculateOutcome(role.outcomes, survivalResult.survived);
    if (!outcomeId) return null;
    return role.outcomes.find(o => o.id === outcomeId);
  }

  handleMissionSelected(data) {
    if (data && data.missionId) {
      this.currentMissionId = data.missionId;
      this._setMissionTheme(data.missionId);
    }
    this.showScreen('role-selection', data);
  }

  handleRoleSelected(data) {
  if (data && data.roleId) {
    this.currentRoleId = data.roleId;
  }
  this.showScreen('scene');
}

  handleStimuliViewReady(data) {
  // Called by StimuliManager after typewriter:complete, before any document shows.
  // We inject a "View Document" button into the scene choices area.
  // When the player clicks it, we call stimuliManager.playerRequestedView().
  if (!data?.documentId) return;
 
  const choicesContainer = document.getElementById('scene-choices');
  if (!choicesContainer) return;
 
  // Remove any existing view-doc button (e.g. from previous doc in queue)
  document.getElementById('stimuli-view-doc-btn')?.remove();
 
  const btn = document.createElement('button');
  btn.id = 'stimuli-view-doc-btn';
  btn.className = 'stimuli-view-doc-btn mt-sm';
  btn.setAttribute('aria-label', 'View primary source document');
 
  const count = data.count || 1;
  btn.textContent = count > 1
    ? `📄 View Primary Sources (${count})`
    : '📄 View Primary Source';
 
  btn.addEventListener('click', () => {
    btn.remove();
    if (this.stimuliManager) {
      this.stimuliManager.playerRequestedView();
    }
  });
 
  // Insert BEFORE choice buttons so it appears above them
  choicesContainer.insertBefore(btn, choicesContainer.firstChild);
}
  handleBriefingBack(data) {
    if (data && data.missionId) {
      this.eventBus.emit('mission:selected', { missionId: data.missionId });
    } else if (this.currentMissionId) {
      this.eventBus.emit('mission:selected', { missionId: this.currentMissionId });
    } else {
      this.showScreen('timeline');
    }
  }

  handleCheckpointComplete(data) {
    this.showScreen('results-card', data);
  }

  showScreen(screenName, data = {}) {
  const validScreens = [
    'loading', 'landing', 'timeline', 'role-selection', 'scene',
    'outcome', 'historical-ripple', 'knowledge-checkpoint', 'results-card'
  ];

  if (!validScreens.includes(screenName)) {
    console.error(`UIController.showScreen: Invalid screen name "${screenName}"`);
    return;
  }

  if (screenName === 'timeline' || screenName === 'landing') {
    this._setMissionTheme(null);
  }

  const existingScreens = this.appContainer.querySelectorAll('.screen');
  existingScreens.forEach(screen => screen.classList.remove('active'));

  // Destroy and recreate these screens every visit so content is always fresh
  const alwaysRecreate = ['role-selection', 'outcome', 'historical-ripple', 'knowledge-checkpoint', 'results-card'];
  if (alwaysRecreate.includes(screenName)) {
    const stale = document.getElementById(`${screenName}-screen`);
    if (stale) stale.remove();
  }

  let screenElement = document.getElementById(`${screenName}-screen`);

  if (screenElement) {
    screenElement.classList.add('active');
  } else {
    screenElement = this.createScreen(screenName, data);
    if (screenElement) {
      this.appContainer.appendChild(screenElement);
      screenElement.classList.add('active');
    }
  }

  this.currentScreen = screenName;
}

  createScreen(screenName, data) {
    const screen = document.createElement('div');
    screen.id = `${screenName}-screen`;
    screen.className = 'screen';
    
    switch (screenName) {
      case 'landing':
        screen.innerHTML = this.renderLandingScreen();
        break;
      case 'timeline':
        screen.innerHTML = this.renderTimelineScreen();
        break;
      case 'role-selection':
        screen.innerHTML = this.renderRoleSelectionScreen(data);
        break;
      case 'scene':
        screen.innerHTML = this.renderSceneScreen();
        break;
      case 'outcome':
        screen.innerHTML = this.renderOutcomeScreen(data);
        break;
      case 'historical-ripple':
        screen.innerHTML = this.renderHistoricalRippleScreen(data);
        break;
      case 'knowledge-checkpoint':
        screen.innerHTML = this.renderKnowledgeCheckpointScreen(data);
        break;
      case 'results-card':
        screen.innerHTML = this.renderResultsCardScreen(data);
        break;
      default:
        console.error(`UIController.createScreen: Unknown screen type "${screenName}"`);
        return null;
    }
    
    this.attachEventListeners(screen, screenName);
    return screen;
  }

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
        <nav id="timeline-container" class="mt-lg" role="navigation" aria-label="Historical mission timeline">
        </nav>
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
        <section id="role-cards-container" class="mt-lg" role="region" aria-label="Available roles">
        </section>
        <div class="endings-counter text-center mt-md" role="status" aria-live="polite">
          <p class="text-secondary">${c.endingsLabel} <span id="endings-count" aria-label="Roles completed">0/3</span></p>
        </div>
      </article>
    `;
  }

  renderSceneScreen() {
    return `
      <article class="scene-content" role="article" aria-labelledby="scene-narrative">
        <section id="scene-narrative" class="panel panel-parchment" role="region" aria-label="Scene narrative">
        </section>
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
        <nav id="scene-choices" class="mt-md" role="navigation" aria-label="Available choices">
        </nav>
        <div id="scene-progress" class="text-center mt-md" role="status" aria-live="polite">
        </div>
      </article>
    `;
  }

  renderOutcomeScreen(data) {
    const c = this.content.outcome;
    return `
      <article class="outcome-content text-center" role="article" aria-labelledby="outcome-title">
        <h2 id="outcome-title" class="text-gold">${c.title}</h2>
        <section id="outcome-result" class="panel panel-parchment mt-lg" role="region" aria-label="Your outcome">
        </section>
        <button id="continue-to-ripple" class="mt-lg" aria-label="Continue to historical ripple timeline">${c.buttonText}</button>
      </article>
    `;
  }

  renderHistoricalRippleScreen(data) {
    const c = this.content.historicalRipple;
    const mission = this.missionRegistry ? this.missionRegistry.getMission(this.currentMissionId) : null;
    const subtitle = mission?.rippleSubtitle || c.subtitle;
    return `
      <article class="ripple-content" role="article" aria-labelledby="ripple-title">
        <h2 id="ripple-title" class="text-center text-gold">${c.title}</h2>
        <p class="text-center">${subtitle}</p>
        <section id="ripple-timeline" class="mt-lg" role="region" aria-label="Historical consequences timeline">
        </section>
        <button id="continue-to-checkpoint" class="mt-lg" aria-label="Continue to knowledge checkpoint">${c.buttonText}</button>
      </article>
    `;
  }

  renderKnowledgeCheckpointScreen(data) {
    const c = this.content.knowledgeCheckpoint;
    return `
      <article class="checkpoint-content" role="article" aria-labelledby="checkpoint-title">
        <h2 id="checkpoint-title" class="text-center text-gold">${c.title}</h2>
        <p class="text-center">${c.subtitle}</p>
        <section id="checkpoint-questions" class="mt-lg" role="region" aria-label="Knowledge assessment questions">
        </section>
        <button id="view-results" class="mt-lg hidden" aria-label="View your results">${c.buttonText}</button>
      </article>
    `;
  }

  renderResultsCardScreen(data) {
    const c = this.content.resultsCard;
    const cardData = { ...data, outcome: this.currentOutcome };
    const cardHTML = this.resultsCard ? this.resultsCard.generateCard(cardData) : '<p>Error: Results card generator not available.</p>';

    // Build annotations section if any highlights exist
    let annotationsHTML = '';
    if (this.annotationStore && this.annotationStore.getHighlightCount() > 0) {
      const docs = this.annotationStore.getAllDocuments();
      const docsHTML = docs.map(doc => {
        const highlightsHTML = doc.highlights.map(h => {
          const apTag = h.apConcept ? `<span class="ap-theme-badge">${this._escapeHTML(h.apConcept)}</span>` : '';
          const noteHTML = h.note ? `<p class="annotation-note">${this._escapeHTML(h.note)}</p>` : '';
          return `
            <div class="results-annotation-item">
              <span class="annotation-dot annotation-dot--${h.color}" aria-label="${h.colorLabel} highlight"></span>
              <div>
                <p class="annotation-quote">&ldquo;${this._escapeHTML(h.text)}&rdquo;</p>
                ${noteHTML}
                ${apTag}
              </div>
            </div>`;
        }).join('');
        return `
          <div class="results-annotation-doc">
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
        <button id="copy-results" class="mt-md" aria-label="Copy results to clipboard">${c.copyButtonText}</button>
        <button id="play-again" class="mt-md" aria-label="Play again with a different role">${c.playAgainButtonText}</button>
      </article>
    `;
  }

  // Escape HTML for safe insertion into the DOM
  _escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  renderScene(scene, sceneIndex, totalScenes) {
    if (!scene || !scene.narrative || !scene.choices) {
      console.error('UIController.renderScene: Invalid scene object');
      return;
    }
    
    if (this.sceneTransition) {
      this.sceneTransition.transition(null, scene, 'fade', 500);
    }
    
    if (this.currentScreen !== 'scene') {
      this.showScreen('scene');
    }
    
    const narrativeContainer = document.getElementById('scene-narrative');
    const choicesContainer = document.getElementById('scene-choices');
    const progressContainer = document.getElementById('scene-progress');
    
    if (!narrativeContainer || !choicesContainer || !progressContainer) {
      console.error('UIController.renderScene: Scene containers not found in DOM');
      return;
    }
    
    narrativeContainer.innerHTML = `<p>${scene.narrative}</p>`;
    
    choicesContainer.innerHTML = '';
    scene.choices.forEach((choice, index) => {
      const choiceButton = document.createElement('button');
      choiceButton.className = 'choice-button mt-sm';
      choiceButton.textContent = choice.text;
      choiceButton.dataset.choiceId = choice.id;
      choiceButton.dataset.nextScene = choice.nextScene;
      choiceButton.dataset.consequences = JSON.stringify(choice.consequences || {});
      choiceButton.setAttribute('aria-label', `Choice ${index + 1}: ${choice.text}`);
      choiceButton.addEventListener('click', () => {
        this.haptics.selection();
        this.handleChoiceClick(choice);
      });
      choicesContainer.appendChild(choiceButton);
    });

    // Render prediction question above choices if present (Haymarket Phase 2)
    if (scene.predictionQuestion) {
      this._renderPredictionQuestion(choicesContainer, scene.predictionQuestion, scene.id);
    }
    
    this.disableChoices();
    
    if (this.typewriterEffect) {
      const narrativeParagraph = narrativeContainer.querySelector('p');
      if (narrativeParagraph) {
        this.typewriterEffect.revealText(
          narrativeParagraph,
          scene.narrative,
          30,
          () => {
            // Apply glossary highlighting after typewriter completes
            glossaryTooltip.apply(narrativeContainer);
            this.enableChoices();
            this.eventBus.emit('typewriter:complete', { sceneId: scene.id });
            // Start timer AFTER choices are enabled
            if (this.currentSceneData?.timedChoice?.enabled && this.timedChoiceSystem) {
              this.startTimedChoice(this.currentSceneData.timedChoice);
            }
          }
        );
      } else {
        glossaryTooltip.apply(narrativeContainer);
        this.enableChoices();
        this.eventBus.emit('typewriter:complete', { sceneId: scene.id });
        // Start timer AFTER choices are enabled
        if (this.currentSceneData?.timedChoice?.enabled && this.timedChoiceSystem) {
          this.startTimedChoice(this.currentSceneData.timedChoice);
        }
      }
    } else {
      glossaryTooltip.apply(narrativeContainer);
      this.enableChoices();
      this.eventBus.emit('typewriter:complete', { sceneId: scene.id });
      // Start timer AFTER choices are enabled
      if (this.currentSceneData?.timedChoice?.enabled && this.timedChoiceSystem) {
        this.startTimedChoice(this.currentSceneData.timedChoice);
      }
    }
    
    this.updateProgress(sceneIndex + 1, totalScenes);
    
    if (scene.ambientTrack && this.ambientSoundManager) {
      const currentAmbient = this.currentAmbientSound || null;
      const newAmbient = scene.ambientTrack;
      this.ambientSoundManager.crossfade(currentAmbient, newAmbient, 1500);
      this.currentAmbientSound = newAmbient;
    }
  }

  enableChoices() {
    const choiceButtons = document.querySelectorAll('.choice-button');
    choiceButtons.forEach(button => {
      button.disabled = false;
      button.style.pointerEvents = 'auto';
      button.style.opacity = '1';
    });
  }

  disableChoices() {
    const choiceButtons = document.querySelectorAll('.choice-button');
    choiceButtons.forEach(button => {
      button.disabled = true;
      button.style.pointerEvents = 'none';
      button.style.opacity = '0.5';
    });
  }

  startTimedChoice(timedChoiceConfig) {
    if (!this.timedChoiceSystem) {
      console.warn('UIController.startTimedChoice: TimedChoiceSystem not available');
      return;
    }
    if (!timedChoiceConfig.duration || !timedChoiceConfig.defaultChoice) {
      console.error('UIController.startTimedChoice: Invalid timedChoice configuration');
      return;
    }
    
    const choiceButtons = document.querySelectorAll('.choice-button');
    let defaultChoiceButton = null;
    choiceButtons.forEach(button => {
      if (button.dataset.choiceId === timedChoiceConfig.defaultChoice) {
        defaultChoiceButton = button;
      }
    });
    
    if (!defaultChoiceButton) {
      console.error(`UIController.startTimedChoice: Default choice "${timedChoiceConfig.defaultChoice}" not found`);
      return;
    }
    
    this.timedChoiceSystem.startTimer(
      timedChoiceConfig.duration,
      timedChoiceConfig.defaultChoice,
      (choiceId) => {
        // Ensure button is enabled before clicking
        if (defaultChoiceButton && !defaultChoiceButton.disabled) {
          defaultChoiceButton.click();
        } else if (defaultChoiceButton) {
          // Button still disabled — enable it first then click
          defaultChoiceButton.disabled = false;
          defaultChoiceButton.style.pointerEvents = 'auto';
          defaultChoiceButton.style.opacity = '1';
          defaultChoiceButton.click();
        }
      }
    );
  }

  handleChoiceClick(choice) {
    this.eventBus.emit('choice:made', {
      choiceId: choice.id,
      nextSceneId: choice.nextScene,
      consequences: choice.consequences || {}
    });
  }

  showLoading() {
    this.showScreen('loading');
  }

  updateProgress(current, total) {
    const progressContainer = document.getElementById('scene-progress');
    if (!progressContainer) return;
    
    const c = this.content.progress;
    progressContainer.innerHTML = `
      <p class="text-secondary">${c.sceneLabel} ${current} of ${total}</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${(current / total) * 100}%"></div>
      </div>
    `;
  }

  attachEventListeners(screen, screenName) {
    if (screenName === 'scene') {
      // Inventory is managed by AnnotationInventory component (body-level toggle)
      // No scene-screen inventory button to wire up
    }

    if (screenName === 'landing') {
      const beginButton = screen.querySelector('#begin-button');
      if (beginButton) {
        beginButton.addEventListener('click', () => {
          this.haptics.light();
          this.showScreen('timeline');
        });
      }
    }
    
    if (screenName === 'timeline') {
      const timelineContainer = screen.querySelector('#timeline-container');
      if (timelineContainer && this.timelineSelector) {
        this.timelineSelector.render(timelineContainer);
      }
    }
    
    if (screenName === 'role-selection') {
      this.populateRoleCards(screen);
      const backButton = screen.querySelector('#back-to-timeline');
      if (backButton) {
        backButton.addEventListener('click', () => {
          this.haptics.light();
          this.showScreen('timeline');
        });
      }
    }
    
    if (screenName === 'outcome') {
      this.populateOutcomeScreen(screen);
      const continueButton = screen.querySelector('#continue-to-ripple');
      if (continueButton) {
        continueButton.addEventListener('click', () => {
          this.showScreen('historical-ripple');
        });
      }
    }
    
    if (screenName === 'historical-ripple') {
      this.populateHistoricalRipple(screen);
      const continueButton = screen.querySelector('#continue-to-checkpoint');
      if (continueButton) {
        continueButton.addEventListener('click', () => {
          this.showScreen('knowledge-checkpoint');
        });
      }
    }
    
    if (screenName === 'knowledge-checkpoint') {
      this.populateKnowledgeCheckpoint(screen);
    }
    
    if (screenName === 'results-card') {
      const copyButton = screen.querySelector('#copy-results');
      if (copyButton) {
        copyButton.addEventListener('click', () => {
          this.copyResultsToClipboard();
        });
      }
      const playAgainButton = screen.querySelector('#play-again');
      if (playAgainButton) {
        playAgainButton.addEventListener('click', () => {
          this.eventBus.emit('mission:selected', 'pearl-harbor');
        });
      }
    }
  }

  populateRoleCards(screen) {
    const roleCardsContainer = screen.querySelector('#role-cards-container');
    const endingsCountElement = screen.querySelector('#endings-count');
    const allRolesCompletedMessage = screen.querySelector('#all-roles-completed-message');
    
    if (!roleCardsContainer) {
      console.error('UIController.populateRoleCards: #role-cards-container not found');
      return;
    }
    if (!this.currentMissionId) {
      console.error('UIController.populateRoleCards: No mission ID stored');
      return;
    }
    
    const mission = this.missionRegistry.getMission(this.currentMissionId);
    if (!mission || !mission.roles) {
      console.error(`UIController.populateRoleCards: Mission "${this.currentMissionId}" not found or has no roles`);
      return;
    }
    
    roleCardsContainer.innerHTML = '';
    
    mission.roles.forEach(role => {
      const roleCard = document.createElement('article');
      roleCard.className = 'role-card';
      roleCard.setAttribute('role', 'article');
      roleCard.setAttribute('aria-labelledby', `role-title-${role.id}`);
      
      const isCompleted = this.completedRoles.has(role.id);
      if (isCompleted) roleCard.classList.add('completed');
      
      const roleTitle = document.createElement('h3');
      roleTitle.id = `role-title-${role.id}`;
      roleTitle.className = 'role-title';
      roleTitle.textContent = role.name;
      
      const roleDescription = document.createElement('p');
      roleDescription.className = 'role-description';
      roleDescription.textContent = role.description;
      
      const selectButton = document.createElement('button');
      selectButton.className = 'role-select-button';
      selectButton.textContent = isCompleted ? this.content.roleSelection.playAgainButton : this.content.roleSelection.selectRoleButton;
      selectButton.dataset.roleId = role.id;
      selectButton.setAttribute('aria-label', `${isCompleted ? this.content.roleSelection.playAgainAriaLabel : this.content.roleSelection.selectRoleAriaLabel}: ${role.name}`);
      
      if (isCompleted) {
        const completionBadge = document.createElement('span');
        completionBadge.className = 'completion-badge';
        completionBadge.textContent = this.content.roleSelection.completionBadge;
        completionBadge.setAttribute('aria-label', this.content.roleSelection.completionBadgeAriaLabel);
        roleCard.appendChild(completionBadge);
      }
      
      selectButton.addEventListener('click', () => {
        this.haptics.medium();
        this.handleRoleSelection(role.id);
      });
      
      roleCard.appendChild(roleTitle);
      roleCard.appendChild(roleDescription);
      roleCard.appendChild(selectButton);
      roleCardsContainer.appendChild(roleCard);
    });
    
    const totalRoles = mission.roles.length;
    const completedCount = this.completedRoles.size;
    
    if (endingsCountElement) {
      endingsCountElement.textContent = `${completedCount}/${totalRoles}`;
    }
    if (allRolesCompletedMessage && completedCount === totalRoles) {
      allRolesCompletedMessage.classList.remove('hidden');
    }
  }

  _setMissionTheme(missionId) {
    document.body.classList.remove('mission-haymarket', 'mission-pearl-harbor', 'mission-rwanda', 'mission-urban');
    if (missionId === 'haymarket-affair') {
      document.body.classList.add('mission-haymarket');
    } else if (missionId === 'pearl-harbor') {
      document.body.classList.add('mission-pearl-harbor');
    } else if (missionId === 'rwanda-genocide') {
      document.body.classList.add('mission-rwanda');
    } else if (missionId === 'aphg-urban-design') {
      document.body.classList.add('mission-urban');
    }
  }

  updateEndingsCounter() {
    // Update the endings counter immediately when a role is completed
    const endingsCountElement = document.getElementById('endings-count');
    if (!endingsCountElement || !this.currentMissionId) return;
    
    const mission = this.missionRegistry.getMission(this.currentMissionId);
    if (!mission) return;
    
    const totalRoles = mission.roles.length;
    const completedCount = this.completedRoles.size;
    
    endingsCountElement.textContent = `${completedCount}/${totalRoles}`;
    
    // Show all-roles-completed message if all roles are done
    const allRolesCompletedMessage = document.getElementById('all-roles-completed-message');
    if (allRolesCompletedMessage && completedCount === totalRoles) {
      allRolesCompletedMessage.classList.remove('hidden');
    }
  }

  handleRoleSelection(roleId) {
    this.eventBus.emit('role:selected', {
      missionId: this.currentMissionId,
      roleId: roleId
    });
  }

  populateOutcomeScreen(screen) {
    const outcomeResultContainer = screen.querySelector('#outcome-result');
    if (!outcomeResultContainer) {
      console.error('UIController.populateOutcomeScreen: #outcome-result container not found');
      return;
    }
    if (!this.currentMissionId || !this.currentRoleId) {
      outcomeResultContainer.innerHTML = `<p>${this.content.errors?.outcomeScreen?.noMissionOrRole || 'Error: Unable to determine outcome.'}</p>`;
      return;
    }
    
    const mission = this.missionRegistry.getMission(this.currentMissionId);
    if (!mission) {
      outcomeResultContainer.innerHTML = `<p>${this.content.errors?.outcomeScreen?.missionNotFound || 'Error: Mission data not found.'}</p>`;
      return;
    }
    
    const role = mission.roles.find(r => r.id === this.currentRoleId);
    if (!role || !role.outcomes) {
      outcomeResultContainer.innerHTML = `<p>${this.content.errors?.outcomeScreen?.roleNotFound || 'Error: Role outcome data not found.'}</p>`;
      return;
    }
    
    const survivalResult = this.consequenceSystem.determineSurvival(this.currentRoleId);
    const outcomeId = this.consequenceSystem.calculateOutcome(role.outcomes, survivalResult.survived);
    if (!outcomeId) {
      outcomeResultContainer.innerHTML = `<p>${this.content.errors?.outcomeScreen?.noOutcomeId || 'Error: Unable to determine outcome based on your choices.'}</p>`;
      return;
    }
    
    const outcome = role.outcomes.find(o => o.id === outcomeId);
    if (!outcome) {
      outcomeResultContainer.innerHTML = `<p>${this.content.errors?.outcomeScreen?.outcomeNotFound || 'Error: Outcome data not found.'}</p>`;
      return;
    }
    
    const survivalStatus = outcome.survived
      ? this.content.outcome?.survivedLabel
      : this.content.outcome?.didNotSurviveLabel;
    const survivalClass = outcome.survived ? 'text-success' : 'text-danger';
    
    // Use early death epilogue if player died mid-story
    let epilogueText;
    if (this.earlyDeathContext && this.earlyDeathContext.diedEarly) {
      if (outcome.deathEpilogueEarly) {
        epilogueText = outcome.deathEpilogueEarly;
      } else {
        console.warn('[UIController] Outcome', outcome.id, 'is missing deathEpilogueEarly — falling back to regular epilogue. Add this field.');
        epilogueText = outcome.epilogue;
      }
    } else {
      epilogueText = outcome.epilogue;
    }
    
    outcomeResultContainer.innerHTML = `
      <h3 class="${survivalClass}">${survivalStatus}</h3>
      <div class="outcome-epilogue mt-md">
        ${this.formatEpilogue(epilogueText)}
      </div>
    `;
  }

  formatEpilogue(epilogue) {
    const paragraphs = epilogue.split('\n\n').filter(p => p.trim() !== '');
    return paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
  }

  populateHistoricalRipple(screen) {
    const rippleTimelineContainer = screen.querySelector('#ripple-timeline');
    if (!rippleTimelineContainer) {
      console.error('UIController.populateHistoricalRipple: #ripple-timeline container not found');
      return;
    }
    if (!this.currentMissionId) {
      console.error('UIController.populateHistoricalRipple: No mission ID stored');
      return;
    }
    
    const mission = this.missionRegistry.getMission(this.currentMissionId);
    if (!mission || !mission.historicalRipple) {
      console.error(`UIController.populateHistoricalRipple: Mission "${this.currentMissionId}" not found or has no historical ripple events`);
      return;
    }
    
    rippleTimelineContainer.innerHTML = '';
    
    mission.historicalRipple.forEach((event, index) => {
      const eventElement = document.createElement('article');
      eventElement.className = 'ripple-event';
      eventElement.setAttribute('role', 'article');
      eventElement.setAttribute('aria-labelledby', `ripple-event-title-${index}`);
      eventElement.style.animationDelay = `${event.animationDelay}ms`;
      
      const eventHeader = document.createElement('header');
      eventHeader.className = 'ripple-event-header';
      
      const eventDate = document.createElement('time');
      eventDate.className = 'ripple-event-date';
      eventDate.textContent = event.date;
      eventDate.setAttribute('datetime', event.date);
      eventHeader.appendChild(eventDate);
      
      const eventTitle = document.createElement('h3');
      eventTitle.id = `ripple-event-title-${index}`;
      eventTitle.className = 'ripple-event-title';
      eventTitle.textContent = event.title;
      
      const eventDescription = document.createElement('p');
      eventDescription.className = 'ripple-event-description';
      eventDescription.textContent = event.description;
      
      const eventTheme = document.createElement('span');
      eventTheme.className = 'ripple-event-theme';
      eventTheme.textContent = `${this.content.historicalRipple.apThemeLabel} ${this.formatApTheme(event.apTheme)}`;
      eventTheme.setAttribute('aria-label', `AP History theme: ${event.apTheme}`);
      
      eventElement.appendChild(eventHeader);
      eventElement.appendChild(eventTitle);
      eventElement.appendChild(eventDescription);
      eventElement.appendChild(eventTheme);
      rippleTimelineContainer.appendChild(eventElement);
    });

    // Render post-ripple synthesis question if present (Haymarket and future missions)
    if (mission.postRippleQuestion) {
      this._renderPostRippleQuestion(rippleTimelineContainer, mission.postRippleQuestion);
    }
  }

  _buildQuestExplainer(type) {
    const map = this.content.questExplainer || {};
    const { icon = '', text = '' } = map[type] || {};
    return `<div class="quest-explainer"><div class="quest-explainer-icon">${icon}</div><span class="quest-explainer-text">${text}</span></div>`;
  }

  _renderPostRippleQuestion(container, prq) {
    const wrapper = document.createElement('article');
    wrapper.className = 'post-ripple-synthesis panel panel-parchment mt-lg';
    wrapper.setAttribute('role', 'article');
    wrapper.setAttribute('aria-labelledby', 'post-ripple-question-text');

    wrapper.insertAdjacentHTML('afterbegin', this._buildQuestExplainer('synthesis'));

    const skillTag = document.createElement('span');
    skillTag.className = 'ap-skill-tag';
    skillTag.textContent = `AP Skill: ${this.formatApTheme(prq.apSkill)}`;
    skillTag.setAttribute('aria-label', `AP reasoning skill: ${prq.apSkill}`);

    const questionText = document.createElement('p');
    questionText.id = 'post-ripple-question-text';
    questionText.className = 'question-text mt-sm';
    questionText.textContent = prq.question;

    const optionsContainer = document.createElement('nav');
    optionsContainer.className = 'question-options mt-sm';
    optionsContainer.setAttribute('role', 'navigation');
    optionsContainer.setAttribute('aria-label', 'Post-ripple synthesis question options');

    const explanationEl = document.createElement('section');
    explanationEl.className = 'question-explanation hidden mt-md';
    explanationEl.setAttribute('role', 'region');
    explanationEl.setAttribute('aria-label', 'Answer explanation');
    explanationEl.innerHTML = `<h4>${this.content.stimuliOverlay?.apAnalysisHeading || ''}</h4><p>${prq.explanation}</p>`;

    const displayLabels = ['A', 'B', 'C', 'D'];
    prq.options.forEach((option, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-button quest-option-button';
      btn.dataset.optionId = option.id;
      btn.dataset.correct = option.correct;
      btn.textContent = `${displayLabels[i] || (i + 1)}. ${option.text}`;
      btn.setAttribute('aria-label', `Option ${displayLabels[i]}: ${option.text}`);
      btn.addEventListener('click', () => {
        this.haptics.light();
        optionsContainer.querySelectorAll('.option-button').forEach(b => {
          b.disabled = true;
          if (b.dataset.correct === 'true') b.classList.add('correct');
        });
        btn.classList.add(option.correct ? 'correct' : 'incorrect');
        explanationEl.classList.remove('hidden');
      });
      optionsContainer.appendChild(btn);
    });

    wrapper.appendChild(skillTag);
    wrapper.appendChild(questionText);
    wrapper.appendChild(optionsContainer);
    wrapper.appendChild(explanationEl);
    container.appendChild(wrapper);
  }

  formatApTheme(theme) {
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  }

  populateKnowledgeCheckpoint(screen) {
    const questionsContainer = screen.querySelector('#checkpoint-questions');
    if (!questionsContainer) {
      console.error('UIController.populateKnowledgeCheckpoint: #checkpoint-questions container not found');
      return;
    }
    if (!this.currentMissionId || !this.currentRoleId) {
      questionsContainer.innerHTML = `<p>${this.content.errors?.knowledgeCheckpoint?.noMissionOrRole || 'Error: Unable to load questions.'}</p>`;
      return;
    }
    
    const mission = this.missionRegistry.getMission(this.currentMissionId);
    if (!mission || !mission.knowledgeQuestions) {
      questionsContainer.innerHTML = `<p>${this.content.errors?.knowledgeCheckpoint?.noQuestions || 'Error: Knowledge questions not found.'}</p>`;
      return;
    }
    
    const roleQuestions = mission.knowledgeQuestions.filter(q => q.roleSpecific === this.currentRoleId);
    if (roleQuestions.length === 0) {
      questionsContainer.innerHTML = `<p>${this.content.errors?.knowledgeCheckpoint?.noRoleQuestions || 'Error: No questions available for this role.'}</p>`;
      return;
    }
    
    this.checkpointAnswers = new Map();
    this.checkpointScore = 0;
    this.checkpointTotalQuestions = roleQuestions.length;
    questionsContainer.innerHTML = '';
    
    roleQuestions.forEach((question, index) => {
      const questionElement = document.createElement('article');
      questionElement.className = 'checkpoint-question panel panel-parchment mt-md';
      questionElement.dataset.questionId = question.id;
      questionElement.setAttribute('role', 'article');
      questionElement.setAttribute('aria-labelledby', `question-${index}-text`);
      
      const questionHeader = document.createElement('header');
      questionHeader.className = 'question-header';
      questionHeader.insertAdjacentHTML('afterbegin', this._buildQuestExplainer('checkpoint'));
      
      const questionNumber = document.createElement('h3');
      questionNumber.className = 'question-number';
      questionNumber.textContent = `Question ${index + 1}`;
      
      const apSkillTag = document.createElement('span');
      apSkillTag.className = 'ap-skill-tag';
      apSkillTag.textContent = `AP Skill: ${this.formatApTheme(question.apSkill)}`;
      apSkillTag.setAttribute('aria-label', `AP reasoning skill: ${question.apSkill}`);
      
      questionHeader.appendChild(questionNumber);
      questionHeader.appendChild(apSkillTag);
      
      const questionText = document.createElement('p');
      questionText.id = `question-${index}-text`;
      questionText.className = 'question-text';
      questionText.textContent = question.question;
      
      const optionsContainer = document.createElement('nav');
      optionsContainer.className = 'question-options mt-sm';
      optionsContainer.setAttribute('role', 'navigation');
      optionsContainer.setAttribute('aria-label', `Answer options for question ${index + 1}`);
      
      const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
      const displayLabels = ['A', 'B', 'C', 'D'];
      
      shuffledOptions.forEach((option, displayIndex) => {
        const label = displayLabels[displayIndex] || String(displayIndex + 1);
        const optionButton = document.createElement('button');
        optionButton.className = 'option-button';
        optionButton.dataset.optionId = option.id;
        optionButton.dataset.correct = option.correct;
        optionButton.textContent = `${label}. ${option.text}`;
        optionButton.setAttribute('aria-label', `Option ${label}: ${option.text}`);
        optionButton.addEventListener('click', () => {
          this.haptics.light();
          this.handleAnswerSelection(question, option, questionElement, optionsContainer);
        });
        optionsContainer.appendChild(optionButton);
      });
      
      const explanationContainer = document.createElement('section');
      explanationContainer.className = 'question-explanation hidden mt-md';
      explanationContainer.setAttribute('role', 'region');
      explanationContainer.setAttribute('aria-label', 'Answer explanation');
      explanationContainer.innerHTML = `<h4>${this.content.knowledgeCheckpoint?.explanationHeading || 'Explanation:'}</h4><p>${question.explanation}</p>`;
      
      questionElement.appendChild(questionHeader);
      questionElement.appendChild(questionText);
      questionElement.appendChild(optionsContainer);
      questionElement.appendChild(explanationContainer);
      questionsContainer.appendChild(questionElement);
    });
  }

  handleAnswerSelection(question, selectedOption, questionElement, optionsContainer) {
    if (this.checkpointAnswers.has(question.id)) return;
    
    const isCorrect = selectedOption.correct === true;
    this.checkpointAnswers.set(question.id, {
      selectedAnswer: selectedOption.id,
      correct: isCorrect
    });
    
    if (isCorrect) this.checkpointScore++;
    
    const optionButtons = optionsContainer.querySelectorAll('.option-button');
    optionButtons.forEach(button => {
      button.disabled = true;
      const buttonCorrect = button.dataset.correct === 'true';
      if (button.dataset.optionId === selectedOption.id) {
        button.classList.add(isCorrect ? 'correct' : 'incorrect');
      } else if (buttonCorrect) {
        button.classList.add('correct');
      }
    });
    
    const explanationContainer = questionElement.querySelector('.question-explanation');
    if (explanationContainer) explanationContainer.classList.remove('hidden');
    
    if (this.checkpointAnswers.size === this.checkpointTotalQuestions) {
      this.showCheckpointResults();
    }
  }

  showCheckpointResults() {
    const viewResultsButton = document.getElementById('view-results');
    if (!viewResultsButton) {
      console.error('UIController.showCheckpointResults: #view-results button not found');
      return;
    }
    
    viewResultsButton.classList.remove('hidden');
    viewResultsButton.addEventListener('click', () => {
      this.eventBus.emit('checkpoint:complete', {
        score: this.checkpointScore,
        totalQuestions: this.checkpointTotalQuestions
      });
    });
    
    const checkpointContent = document.querySelector('.checkpoint-content');
    if (checkpointContent) {
      let scoreDisplay = document.getElementById('checkpoint-score');
      if (!scoreDisplay) {
        scoreDisplay = document.createElement('div');
        scoreDisplay.id = 'checkpoint-score';
        scoreDisplay.className = 'checkpoint-score text-center mt-lg';
        const scorePercentage = Math.round((this.checkpointScore / this.checkpointTotalQuestions) * 100);
        const scoreClass = scorePercentage >= 70 ? 'text-success' : 'text-warning';
        scoreDisplay.innerHTML = `
          <h3 class="${scoreClass}">Your Score: ${this.checkpointScore}/${this.checkpointTotalQuestions}</h3>
          <p class="text-secondary">${scorePercentage}% Correct</p>
        `;
        checkpointContent.insertBefore(scoreDisplay, viewResultsButton);
      }
    }
  }

  async copyResultsToClipboard() {
    if (!this.resultsCard) {
      console.error('UIController.copyResultsToClipboard: ResultsCard component not available');
      return;
    }
    const success = await this.resultsCard.copyCardText();
    if (success) {
      alert(this.content.resultsCard?.copySuccessMessage || '');
    } else {
      alert(this.content.resultsCard?.copyFailMessage || '');
    }
  }

  handleTimerStarted(data) {
    const timerDisplay = document.getElementById('timer-display');
    if (!timerDisplay) return;
    timerDisplay.classList.remove('hidden');
    this.updateTimerDisplay(data.duration, data.duration);
  }

  handleTimerUpdate(data) {
    const timerDisplay = document.getElementById('timer-display');
    if (!timerDisplay) return;
    this.updateTimerDisplay(data.remaining, null);
    if (data.isWarning) {
      timerDisplay.classList.add('timer-warning');
    } else {
      timerDisplay.classList.remove('timer-warning');
    }
  }

  handleTimerExpired(data) {
    const timerDisplay = document.getElementById('timer-display');
    if (!timerDisplay) return;
    timerDisplay.classList.add('hidden');
    timerDisplay.classList.remove('timer-warning');
  }

  handleTimerCancelled(data) {
    const timerDisplay = document.getElementById('timer-display');
    if (!timerDisplay) return;
    timerDisplay.classList.add('hidden');
    timerDisplay.classList.remove('timer-warning');
  }

  updateTimerDisplay(remaining, duration) {
    const timerSeconds = document.getElementById('timer-seconds');
    const timerProgressFill = document.querySelector('.timer-progress-fill');
    if (!timerSeconds) return;
    
    const seconds = Math.ceil(remaining / 1000);
    timerSeconds.textContent = seconds;
    
    if (timerProgressFill && duration) {
      const progress = remaining / duration;
      const circumference = 2 * Math.PI * 45;
      const offset = circumference * (1 - progress);
      timerProgressFill.style.strokeDashoffset = offset;
    }
  }

  // ── Prediction Question (Haymarket Phase 2) ──────────────────────────────

  _renderPredictionQuestion(choicesContainer, pq, sceneId) {
    const wrapper = document.createElement('div');
    wrapper.className = 'prediction-question panel panel-parchment mt-md';
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-label', 'Prediction question');

    const label = document.createElement('p');
    label.className = 'prediction-label text-secondary';
    label.textContent = this.content.predictionQuestion?.label || '';

    wrapper.insertAdjacentHTML('afterbegin', this._buildQuestExplainer('prediction'));

    const questionText = document.createElement('p');
    questionText.className = 'question-text mt-sm';
    questionText.textContent = pq.question;

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'prediction-options mt-sm';

    const revealEl = document.createElement('div');
    revealEl.className = 'prediction-reveal panel mt-sm hidden';
    revealEl.setAttribute('role', 'status');
    revealEl.setAttribute('aria-live', 'polite');
    revealEl.innerHTML = `<p class="text-secondary">${pq.reveal}</p>`;

    pq.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-button quest-option-button mt-sm';
      btn.textContent = opt.text;
      btn.dataset.predId = opt.id;
      btn.setAttribute('aria-label', opt.text);
      btn.addEventListener('click', () => {
        optionsContainer.querySelectorAll('.option-button').forEach(b => {
          b.disabled = true;
          b.style.opacity = '0.6';
        });
        btn.style.opacity = '1';
        btn.classList.add('selected');
        revealEl.classList.remove('hidden');
        this.eventBus.emit('prediction:answered', { sceneId, selectedId: opt.id });
      });
      optionsContainer.appendChild(btn);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(questionText);
    wrapper.appendChild(optionsContainer);
    wrapper.appendChild(revealEl);

    // Insert before the first choice button so choices appear below
    const firstChoice = choicesContainer.querySelector('.choice-button');
    if (firstChoice) {
      choicesContainer.insertBefore(wrapper, firstChoice);
    } else {
      choicesContainer.appendChild(wrapper);
    }
  }

  // ── Stimulus Document Overlay (Haymarket Phase 1 / StimuliManager) ────────

  handleStimuliShown(data) {
  if (!data?.documentId || !data?.documentData) return;
  // AnnotationInventory listens to stimuli:shown and tracks docs itself.
  // UIController only needs to render the overlay DOM.
  this._renderStimulusOverlay(data.documentData);
}
  /**
   * Resolve a CSS class for the document card based on its id or documentType field.
   * @param {Object} doc
   * @returns {string}
   * @private
   */
  _stimuliDocTypeClass(doc) {
    const type = doc.documentType || '';
    if (type === 'arbeiter-zeitung') return 'doc-type--arbeiter-zeitung';
    if (type === 'pinkerton-report') return 'doc-type--pinkerton-report';
    if (type === 'harper-weekly')    return 'doc-type--harper-weekly';
    if (type === 'court-transcript') return 'doc-type--court-transcript';

    // Fall back to id-based mapping for Haymarket docs
    const id = doc.id || '';
    if (id === 'hm-doc-1a' || id === 'hm-doc-1b' || id === 'hm-doc-3') return 'doc-type--arbeiter-zeitung';
    if (id === 'hm-doc-0')  return 'doc-type--pinkerton-report';
    if (id === 'hm-doc-2')  return 'doc-type--harper-weekly';
    if (id === 'hm-doc-4')  return 'doc-type--harper-weekly';   // Chicago Tribune — same heavy-press style
    if (id === 'hm-doc-5')  return 'doc-type--court-transcript'; // Altgeld pardon — legal document
    return 'doc-type--default';
  }

  /**
   * Inject floating dust particle divs into the overlay backdrop.
   * @param {HTMLElement} overlay
   * @private
   */
  _injectDustParticles(overlay) {
    const dust = document.createElement('div');
    dust.className = 'stimuli-dust';
    dust.setAttribute('aria-hidden', 'true');
    const count = 5;
    for (let i = 0; i < count; i++) {
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
    // Remove any existing overlay
    const existing = document.getElementById('stimuli-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'stimuli-overlay';
    overlay.className = 'stimuli-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'stimuli-doc-title');

    // Inject dust particles into backdrop
    this._injectDustParticles(overlay);

    const spiceStr = (doc.spiceT || []).join(' · ');
    const pq = doc.pauseQuestion;
    const typeClass = this._stimuliDocTypeClass(doc);

    // Illustration placeholder for Harper's Weekly visual sources
    const illustrationHTML = typeClass === 'doc-type--harper-weekly'
      ? `<div class="stimuli-illustration-placeholder" aria-hidden="true">[ ${this.content.stimuliOverlay?.illustrationLabel || 'Engraving'} — ${doc.title} ]</div>`
      : '';

    // Signature line for court transcripts
    const signatureHTML = typeClass === 'doc-type--court-transcript'
      ? `<div class="stimuli-signature" aria-label="Document signature line">${this.content.stimuliOverlay?.signatureLine || '_________________________'}</div>`
      : '';

    // Build options HTML
    const optionsHTML = pq ? pq.options.map((opt, i) => {
      const label = ['A', 'B', 'C', 'D'][i] || (i + 1);
      return `<button class="option-button stimuli-option quest-option-button mt-sm" data-opt-id="${opt.id}" data-correct="${opt.correct}" aria-label="Option ${label}: ${opt.text}">${label}. ${opt.text}</button>`;
    }).join('') : '';

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
      <button id="stimuli-dismiss" class="mt-lg hidden" aria-label="${this.content.stimuliOverlay?.continueButton || 'Continue'}">${this.content.stimuliOverlay?.continueButton || 'Continue'}</button>
    `;

    overlay.appendChild(content);
    document.body.appendChild(overlay);

    const dismissBtn = overlay.querySelector('#stimuli-dismiss');

    if (!pq) {
      // No pause question — allow immediate dismiss
      dismissBtn.classList.remove('hidden');
    } else {
      // Show pause question modal once document is scrolled to bottom
      this._attachScrollTrigger(content, doc, pq, dismissBtn);
    }

    // Wire dismiss button (shown after modal answered)
    dismissBtn.addEventListener('click', () => {
      this.eventBus.emit('stimuli:dismiss-requested', { documentId: doc.id });
    });
  }

  /**
   * Attach a scroll-to-bottom trigger on the stimuli content element.
   * Once the player has scrolled to the bottom (or the doc is short enough
   * to not need scrolling), mount the PauseQuestionModal.
   * After the modal is answered, show the dismiss button.
   *
   * @param {HTMLElement} contentEl   — .stimuli-content
   * @param {Object}      doc         — full document data
   * @param {Object}      pq          — pauseQuestion object
   * @param {HTMLElement} dismissBtn  — #stimuli-dismiss button
   * @private
   */
  _attachScrollTrigger(contentEl, doc, pq, dismissBtn) {
    // Cross-role prompt: pull from doc if present, else null
    const crossRolePrompt = doc.crossRolePrompt || null;

    let modalMounted = false;

    const maybeShowModal = () => {
      if (modalMounted) return;
      // Check if scrolled to bottom (within 40px tolerance)
      const atBottom = contentEl.scrollHeight - contentEl.scrollTop - contentEl.clientHeight < 40;
      if (!atBottom) return;

      modalMounted = true;
      contentEl.removeEventListener('scroll', maybeShowModal);

      const modal = new PauseQuestionModal(this.eventBus, pq, doc.id, crossRolePrompt);

      // After answer submitted, destroy modal and show dismiss button
      const onAnswered = (data) => {
        if (data.documentId !== doc.id) return;
        this.eventBus.off('stimuli:pause-question-answered', onAnswered);
        // Small delay so player sees the explanation before dismiss appears
        setTimeout(() => {
          modal.destroy();
          dismissBtn.classList.remove('hidden');
          dismissBtn.focus();
        }, 800);
      };
      this.eventBus.on('stimuli:pause-question-answered', onAnswered);

      // Inventory open: toggle inventory panel without closing modal
      const onInventoryOpen = () => {
        this._renderInventoryPanel();
      };
      this.eventBus.on('inventory:open-requested', onInventoryOpen);

      // Clean up inventory listener when modal is gone
      const origDestroy = modal.destroy.bind(modal);
      modal.destroy = () => {
        this.eventBus.off('inventory:open-requested', onInventoryOpen);
        origDestroy();
      };

      modal.mount();
    };

    // If content is short enough to not scroll, show immediately after a beat
    const isScrollable = contentEl.scrollHeight > contentEl.clientHeight + 40;
    if (!isScrollable) {
      setTimeout(maybeShowModal, 600);
    } else {
      contentEl.addEventListener('scroll', maybeShowModal, { passive: true });
      // Also check on initial render in case content fits
      setTimeout(maybeShowModal, 400);
    }
  }

  // ── Document Inventory ────────────────────────────────────────────────────

  /**
   * Update the inventory toggle button count and visibility.
   * Called whenever a new document is added to the inventory.
   */
  _updateInventoryButton() {
    const btn = document.getElementById('inventory-toggle');
    if (!btn) return;
    const count = this._inventoryDocIds.length;
    if (count === 0) {
      btn.classList.add('hidden');
      return;
    }
    btn.classList.remove('hidden');
    const countEl = btn.querySelector('#inventory-count');
    if (countEl) countEl.textContent = count;
    btn.setAttribute('aria-label', `View collected primary sources (${count})`);
  }

  /**
   * Render the inventory panel — a list of all collected documents.
   * Clicking a document re-opens the stimulus overlay for review.
   */
  _renderInventoryPanel() {
    const existing = document.getElementById('inventory-panel');
    if (existing) { existing.remove(); return; } // toggle off

    const panel = document.createElement('div');
    panel.id = 'inventory-panel';
    panel.className = 'inventory-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'inventory-panel-title');

    const heading = document.createElement('h3');
    heading.id = 'inventory-panel-title';
    heading.className = 'inventory-panel-title text-gold';
    heading.textContent = this.content.inventory?.panelTitle || 'Primary Sources Collected';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'inventory-close';
    closeBtn.setAttribute('aria-label', 'Close primary sources panel');
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', () => panel.remove());

    const list = document.createElement('ul');
    list.className = 'inventory-list';
    list.setAttribute('role', 'list');

    this._inventoryDocIds.forEach(docId => {
      const doc = this._inventoryDocData.get(docId);
      if (!doc) return;

      const item = document.createElement('li');
      item.className = 'inventory-item';
      item.setAttribute('role', 'listitem');

      const btn = document.createElement('button');
      btn.className = 'inventory-doc-button';
      btn.setAttribute('aria-label', `Review: ${doc.title}`);
      btn.innerHTML = `
        <span class="inventory-doc-title">${doc.title}</span>
        <span class="inventory-doc-meta text-secondary">${doc.source}</span>
      `;
      btn.addEventListener('click', () => {
        panel.remove();
        this._renderStimulusOverlay(doc);
      });

      item.appendChild(btn);
      list.appendChild(item);
    });

    panel.appendChild(closeBtn);
    panel.appendChild(heading);
    panel.appendChild(list);
    document.body.appendChild(panel);
    closeBtn.focus();
  }

}

export default UIController;
