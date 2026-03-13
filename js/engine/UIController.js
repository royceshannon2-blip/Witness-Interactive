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
    this.eventBus.on('checkpoint:complete', this.handleCheckpointComplete.bind(this));
    this.eventBus.on('timer:started', this.handleTimerStarted.bind(this));
    this.eventBus.on('timer:update', this.handleTimerUpdate.bind(this));
    this.eventBus.on('timer:expired', this.handleTimerExpired.bind(this));
    this.eventBus.on('timer:cancelled', this.handleTimerCancelled.bind(this));
    this.eventBus.on('sound:muted', this.handleSoundMuted.bind(this));
    this.eventBus.on('narrator:muted', this.handleNarratorMuted.bind(this));
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
    if (data && data.roleId) {
      this.completedRoles.add(data.roleId);
      this.currentRoleId = data.roleId;
    }
    if (data && data.missionId) {
      this.currentMissionId = data.missionId;
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
    const outcomeId = this.consequenceSystem.calculateOutcome(role.outcomes);
    if (!outcomeId) return null;
    return role.outcomes.find(o => o.id === outcomeId);
  }

  handleMissionSelected(data) {
    if (data && data.missionId) {
      this.currentMissionId = data.missionId;
    }
    this.showScreen('role-selection', data);
  }

  handleRoleSelected(data) {
    this.showScreen('scene');
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
    
    const existingScreens = this.appContainer.querySelectorAll('.screen');
    existingScreens.forEach(screen => screen.classList.remove('active'));
    
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
    return `
      <article class="role-selection-content" role="article" aria-labelledby="role-selection-title">
        <h2 id="role-selection-title" class="text-center text-gold">${c.title}</h2>
        <p class="text-center">${c.subtitle}</p>
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
    return `
      <article class="ripple-content" role="article" aria-labelledby="ripple-title">
        <h2 id="ripple-title" class="text-center text-gold">${c.title}</h2>
        <p class="text-center">${c.subtitle}</p>
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
    return `
      <article class="results-content text-center" role="article" aria-labelledby="results-title">
        <h2 id="results-title" class="text-gold">${c.title}</h2>
        <section id="results-card" class="panel panel-parchment mt-lg" role="region" aria-label="Your game results">
          ${cardHTML}
        </section>
        <button id="copy-results" class="mt-md" aria-label="Copy results to clipboard">${c.copyButtonText}</button>
        <button id="play-again" class="mt-md" aria-label="Play again with a different role">${c.playAgainButtonText}</button>
      </article>
    `;
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
    
    this.disableChoices();
    
    if (this.typewriterEffect) {
      const narrativeParagraph = narrativeContainer.querySelector('p');
      if (narrativeParagraph) {
        this.typewriterEffect.revealText(
          narrativeParagraph,
          scene.narrative,
          30,
          () => {
            this.enableChoices();
            this.eventBus.emit('typewriter:complete', { sceneId: scene.id });
            if (scene.timedChoice && this.timedChoiceSystem) {
              this.startTimedChoice(scene.timedChoice);
            }
          }
        );
      } else {
        this.enableChoices();
        this.eventBus.emit('typewriter:complete', { sceneId: scene.id });
        if (scene.timedChoice && this.timedChoiceSystem) {
          this.startTimedChoice(scene.timedChoice);
        }
      }
    } else {
      this.enableChoices();
      this.eventBus.emit('typewriter:complete', { sceneId: scene.id });
      if (scene.timedChoice && this.timedChoiceSystem) {
        this.startTimedChoice(scene.timedChoice);
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
        if (defaultChoiceButton) {
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
      outcomeResultContainer.innerHTML = '<p>Error: Unable to determine outcome. Mission or role data missing.</p>';
      return;
    }
    
    const mission = this.missionRegistry.getMission(this.currentMissionId);
    if (!mission) {
      outcomeResultContainer.innerHTML = '<p>Error: Mission data not found.</p>';
      return;
    }
    
    const role = mission.roles.find(r => r.id === this.currentRoleId);
    if (!role || !role.outcomes) {
      outcomeResultContainer.innerHTML = '<p>Error: Role outcome data not found.</p>';
      return;
    }
    
    const outcomeId = this.consequenceSystem.calculateOutcome(role.outcomes);
    if (!outcomeId) {
      outcomeResultContainer.innerHTML = '<p>Error: Unable to determine outcome based on your choices.</p>';
      return;
    }
    
    const outcome = role.outcomes.find(o => o.id === outcomeId);
    if (!outcome) {
      outcomeResultContainer.innerHTML = '<p>Error: Outcome data not found.</p>';
      return;
    }
    
    const survivalStatus = outcome.survived ? 'You Survived' : 'You Did Not Survive';
    const survivalClass = outcome.survived ? 'text-success' : 'text-danger';
    
    outcomeResultContainer.innerHTML = `
      <h3 class="${survivalClass}">${survivalStatus}</h3>
      <div class="outcome-epilogue mt-md">
        ${this.formatEpilogue(outcome.epilogue)}
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
      questionsContainer.innerHTML = '<p>Error: Unable to load questions. Mission or role data missing.</p>';
      return;
    }
    
    const mission = this.missionRegistry.getMission(this.currentMissionId);
    if (!mission || !mission.knowledgeQuestions) {
      questionsContainer.innerHTML = '<p>Error: Knowledge questions not found.</p>';
      return;
    }
    
    const roleQuestions = mission.knowledgeQuestions.filter(q => q.roleSpecific === this.currentRoleId);
    if (roleQuestions.length === 0) {
      questionsContainer.innerHTML = '<p>Error: No questions available for this role.</p>';
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
      explanationContainer.innerHTML = `<h4>Explanation:</h4><p>${question.explanation}</p>`;
      
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
      alert('Results copied to clipboard!');
    } else {
      alert('Failed to copy results. Please try again.');
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
}

export default UIController;