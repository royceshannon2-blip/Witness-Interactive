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

class UIController {
  /**
   * Initialize the UIController
   * @param {EventBus} eventBus - Event bus for component communication
   * @param {TimelineSelector} timelineSelector - Timeline selector component
   * @param {MissionRegistry} missionRegistry - Mission registry for accessing mission data
   * @param {ConsequenceSystem} consequenceSystem - Consequence system for outcome calculation
   * @param {ResultsCard} resultsCard - Results card generator component
   * @param {object} uiContent - UI text content configuration (from js/content/ui-content.js)
   * @param {object} components - Optional interactive polish components
   * @param {TypewriterEffect} components.typewriterEffect - Typewriter text reveal component
   * @param {SceneTransition} components.sceneTransition - Scene transition animation component
   * @param {AtmosphericEffects} components.atmosphericEffects - Atmospheric effects component
   * @param {TimedChoiceSystem} components.timedChoiceSystem - Timed choice system component
   * @param {AmbientSoundManager} components.ambientSoundManager - Ambient sound manager component
   */
  constructor(eventBus, timelineSelector, missionRegistry, consequenceSystem, resultsCard, uiContent, components = {}) {
    // Store reference to event bus
    this.eventBus = eventBus;
    
    // Store UI content configuration (ZERO hardcoded content strings in engine)
    this.content = uiContent;
    
    // Store reference to timeline selector
    this.timelineSelector = timelineSelector;
    
    // Store reference to mission registry
    this.missionRegistry = missionRegistry;
    
    // Store reference to consequence system
    this.consequenceSystem = consequenceSystem;
    
    // Store reference to results card generator
    this.resultsCard = resultsCard;
    
    // Store interactive polish components (if provided)
    this.typewriterEffect = components.typewriterEffect || null;
    this.sceneTransition = components.sceneTransition || null;
    this.atmosphericEffects = components.atmosphericEffects || null;
    this.timedChoiceSystem = components.timedChoiceSystem || null;
    this.ambientSoundManager = components.ambientSoundManager || null;
    
    // Get reference to app container
    this.appContainer = document.getElementById('app');
    
    if (!this.appContainer) {
      console.error('UIController: #app container not found in DOM');
      return;
    }
    
    // Track current screen name
    this.currentScreen = 'loading';
    
    // Track current scene data for rendering
    this.currentSceneData = null;
    
    // Track current mission ID for role selection
    this.currentMissionId = null;
    
    // Track current role ID for outcome calculation
    this.currentRoleId = null;
    
    // Track completed roles in session (no localStorage)
    // Set of roleIds that have been completed
    this.completedRoles = new Set();
    
    // Subscribe to EventBus events
    this.subscribeToEvents();
    
    // Setup sound toggle button
    this.setupSoundToggle();
  }

  /**
   * Subscribe to relevant EventBus events
   * @private
   */
  subscribeToEvents() {
    // Scene transition - render new scene
    this.eventBus.on('scene:transition', this.handleSceneTransition.bind(this));
    
    // Game start - show landing screen
    this.eventBus.on('game:start', this.handleGameStart.bind(this));
    
    // Game complete - show outcome screen and mark role as completed
    this.eventBus.on('game:complete', this.handleGameComplete.bind(this));
    
    // Mission selected - show role selection
    this.eventBus.on('mission:selected', this.handleMissionSelected.bind(this));
    
    // Role selected - start narrative
    this.eventBus.on('role:selected', this.handleRoleSelected.bind(this));
    
    // Checkpoint complete - show results card
    this.eventBus.on('checkpoint:complete', this.handleCheckpointComplete.bind(this));
    
    // Timer events - update timer UI
    this.eventBus.on('timer:started', this.handleTimerStarted.bind(this));
    this.eventBus.on('timer:update', this.handleTimerUpdate.bind(this));
    this.eventBus.on('timer:expired', this.handleTimerExpired.bind(this));
    this.eventBus.on('timer:cancelled', this.handleTimerCancelled.bind(this));
    
    // Sound events - update sound toggle button UI
    this.eventBus.on('sound:muted', this.handleSoundMuted.bind(this));
  }

  /**
   * Setup sound toggle button
   * Connects the existing sound toggle button to the AmbientSoundManager
   * @private
   */
  setupSoundToggle() {
    const soundToggleButton = document.getElementById('sound-toggle');
    
    if (!soundToggleButton) {
      console.warn('UIController.setupSoundToggle: #sound-toggle button not found in DOM');
      return;
    }
    
    // Enable the button if AmbientSoundManager is available
    if (this.ambientSoundManager) {
      soundToggleButton.disabled = false;
      soundToggleButton.setAttribute('aria-label', 'Toggle sound on/off');
      
      // Add click event listener
      soundToggleButton.addEventListener('click', () => {
        this.eventBus.emit('sound:toggle');
      });
      
      // Set initial icon based on mute state
      this.updateSoundToggleIcon(this.ambientSoundManager.isMuted());
    } else {
      console.warn('UIController.setupSoundToggle: AmbientSoundManager not available, button remains disabled');
    }
  }

  /**
   * Handle sound:muted event - update button icon
   * @param {object} data - Event data with muted state
   * @private
   */
  handleSoundMuted(data) {
    if (data && typeof data.muted === 'boolean') {
      this.updateSoundToggleIcon(data.muted);
    }
  }

  /**
   * Update sound toggle button icon based on mute state
   * @param {boolean} muted - Whether sound is muted
   * @private
   */
  updateSoundToggleIcon(muted) {
    const soundToggleButton = document.getElementById('sound-toggle');
    
    if (!soundToggleButton) {
      return;
    }
    
    const soundIcon = soundToggleButton.querySelector('.sound-icon');
    
    if (!soundIcon) {
      return;
    }
    
    // Update icon and aria-label based on mute state
    if (muted) {
      soundIcon.textContent = '🔇';
      soundToggleButton.setAttribute('aria-label', 'Sound is muted. Click to unmute.');
    } else {
      soundIcon.textContent = '🔊';
      soundToggleButton.setAttribute('aria-label', 'Sound is on. Click to mute.');
    }
  }

  /**
   * Handle game:start event
   * @param {object} data - Event data
   * @private
   */
  handleGameStart(data) {
    this.showScreen('landing');
  }

  /**
   * Handle scene:transition event
   * @param {object} data - Event data containing scene information
   * @private
   */
  handleSceneTransition(data) {
    if (!data || !data.scene) {
      console.error('UIController.handleSceneTransition: Invalid scene data');
      return;
    }
    
    this.currentSceneData = data;
    this.renderScene(data.scene, data.sceneIndex, data.totalScenes);
  }

  /**
   * Handle game:complete event
   * @param {object} data - Event data containing roleId and missionId
   * @private
   */
  handleGameComplete(data) {
    // Mark role as completed in session
    if (data && data.roleId) {
      this.completedRoles.add(data.roleId);
      this.currentRoleId = data.roleId;
    }
    
    if (data && data.missionId) {
      this.currentMissionId = data.missionId;
    }
    
    // Calculate outcome immediately and store it
    this.currentOutcome = this.calculateCurrentOutcome();
    
    this.showScreen('outcome', data);
  }
  
  /**
   * Calculate the current outcome based on consequence flags
   * @returns {object|null} Outcome object with survived and epilogue properties
   * @private
   */
  calculateCurrentOutcome() {
    if (!this.currentMissionId || !this.currentRoleId) {
      return null;
    }
    
    const mission = this.missionRegistry.getMission(this.currentMissionId);
    if (!mission) {
      return null;
    }
    
    const role = mission.roles.find(r => r.id === this.currentRoleId);
    if (!role || !role.outcomes) {
      return null;
    }
    
    // Calculate outcome using ConsequenceSystem
    const outcomeId = this.consequenceSystem.calculateOutcome(role.outcomes);
    if (!outcomeId) {
      return null;
    }
    
    // Find the matching outcome object
    const outcome = role.outcomes.find(o => o.id === outcomeId);
    return outcome;
  }

  /**
   * Handle mission:selected event
   * @param {object} data - Event data containing missionId
   * @private
   */
  handleMissionSelected(data) {
    // Store current mission ID for role selection
    if (data && data.missionId) {
      this.currentMissionId = data.missionId;
    }
    
    this.showScreen('role-selection', data);
  }

  /**
   * Handle role:selected event
   * @param {object} data - Event data containing roleId
   * @private
   */
  handleRoleSelected(data) {
    // Scene rendering will be handled by scene:transition event
    // This just prepares the UI for scene display
    this.showScreen('scene');
  }

  /**
   * Handle checkpoint:complete event
   * @param {object} data - Event data
   * @private
   */
  handleCheckpointComplete(data) {
    this.showScreen('results-card', data);
  }

  /**
   * Render a specific screen
   * @param {string} screenName - Name of the screen to display
   * @param {object} data - Optional data for screen rendering
   */
  showScreen(screenName, data = {}) {
    // Validate screen name
    const validScreens = [
      'loading',
      'landing',
      'timeline',
      'role-selection',
      'scene',
      'outcome',
      'historical-ripple',
      'knowledge-checkpoint',
      'results-card'
    ];
    
    if (!validScreens.includes(screenName)) {
      console.error(`UIController.showScreen: Invalid screen name "${screenName}"`);
      return;
    }
    
    // Hide all existing screens
    const existingScreens = this.appContainer.querySelectorAll('.screen');
    existingScreens.forEach(screen => {
      screen.classList.remove('active');
    });
    
    // Check if screen already exists
    let screenElement = document.getElementById(`${screenName}-screen`);
    
    if (screenElement) {
      // Screen exists, just show it
      screenElement.classList.add('active');
    } else {
      // Screen doesn't exist, create it
      screenElement = this.createScreen(screenName, data);
      if (screenElement) {
        this.appContainer.appendChild(screenElement);
        screenElement.classList.add('active');
      }
    }
    
    // Update current screen tracker
    this.currentScreen = screenName;
    
    // Apply any atmospheric effects if specified in data (using AtmosphericEffects component)
    if (data.atmosphericEffect && this.atmosphericEffects) {
      this.atmosphericEffects.applyEffect(data.atmosphericEffect);
    }
  }

  /**
   * Create a new screen element
   * @param {string} screenName - Name of the screen to create
   * @param {object} data - Data for screen rendering
   * @returns {HTMLElement} Created screen element
   * @private
   */
  createScreen(screenName, data) {
    const screen = document.createElement('div');
    screen.id = `${screenName}-screen`;
    screen.className = 'screen';
    
    // Render screen content based on type
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
    
    // Attach event listeners after rendering
    this.attachEventListeners(screen, screenName);
    
    return screen;
  }

  /**
   * Render landing screen HTML
   * @returns {string} HTML string
   * @private
   */
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

  /**
   * Render timeline screen HTML
   * @returns {string} HTML string
   * @private
   */
  renderTimelineScreen() {
    const c = this.content.timeline;
    return `
      <article class="timeline-content" role="article" aria-labelledby="timeline-title">
        <h2 id="timeline-title" class="text-center text-gold">${c.title}</h2>
        <p class="text-center">${c.subtitle}</p>
        <nav id="timeline-container" class="mt-lg" role="navigation" aria-label="Historical mission timeline">
          <!-- Timeline will be rendered by TimelineSelector component -->
        </nav>
      </article>
    `;
  }

  /**
   * Render role selection screen HTML
   * @param {object} data - Mission data containing missionId
   * @returns {string} HTML string
   * @private
   */
  renderRoleSelectionScreen(data) {
    const c = this.content.roleSelection;
    // Get mission from registry (will be populated in attachEventListeners)
    return `
      <article class="role-selection-content" role="article" aria-labelledby="role-selection-title">
        <h2 id="role-selection-title" class="text-center text-gold">${c.title}</h2>
        <p class="text-center">${c.subtitle}</p>
        <section id="all-roles-completed-message" class="panel panel-parchment mt-lg hidden" role="region" aria-live="polite">
          <h3 class="text-gold text-center">${c.allRolesCompletedTitle}</h3>
          <p class="text-center">${c.allRolesCompletedMessage}</p>
        </section>
        <section id="role-cards-container" class="mt-lg" role="region" aria-label="Available roles">
          <!-- Role cards will be populated dynamically -->
        </section>
        <div class="endings-counter text-center mt-md" role="status" aria-live="polite">
          <p class="text-secondary">${c.endingsLabel} <span id="endings-count" aria-label="Roles completed">0/3</span></p>
        </div>
      </article>
    `;
  }

  /**
   * Render scene screen HTML (placeholder, will be populated by renderScene)
   * @returns {string} HTML string
   * @private
   */
  renderSceneScreen() {
    return `
      <article class="scene-content" role="article" aria-labelledby="scene-narrative">
        <section id="scene-narrative" class="panel panel-parchment" role="region" aria-label="Scene narrative">
          <!-- Scene narrative will be rendered here -->
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
          <!-- Scene choices will be rendered here -->
        </nav>
        <div id="scene-progress" class="text-center mt-md" role="status" aria-live="polite">
          <!-- Progress indicator will be rendered here -->
        </div>
      </article>
    `;
  }

  /**
   * Render outcome screen HTML
   * @param {object} data - Outcome data
   * @returns {string} HTML string
   * @private
   */
  renderOutcomeScreen(data) {
    const c = this.content.outcome;
    return `
      <article class="outcome-content text-center" role="article" aria-labelledby="outcome-title">
        <h2 id="outcome-title" class="text-gold">${c.title}</h2>
        <section id="outcome-result" class="panel panel-parchment mt-lg" role="region" aria-label="Your outcome">
          <!-- Outcome will be populated dynamically -->
        </section>
        <button id="continue-to-ripple" class="mt-lg" aria-label="Continue to historical ripple timeline">${c.buttonText}</button>
      </article>
    `;
  }

  /**
   * Render historical ripple screen HTML
   * @param {object} data - Ripple data
   * @returns {string} HTML string
   * @private
   */
  renderHistoricalRippleScreen(data) {
    const c = this.content.historicalRipple;
    return `
      <article class="ripple-content" role="article" aria-labelledby="ripple-title">
        <h2 id="ripple-title" class="text-center text-gold">${c.title}</h2>
        <p class="text-center">${c.subtitle}</p>
        <section id="ripple-timeline" class="mt-lg" role="region" aria-label="Historical consequences timeline">
          <!-- Ripple events will be rendered here -->
        </section>
        <button id="continue-to-checkpoint" class="mt-lg" aria-label="Continue to knowledge checkpoint">${c.buttonText}</button>
      </article>
    `;
  }

  /**
   * Render knowledge checkpoint screen HTML
   * @param {object} data - Checkpoint data
   * @returns {string} HTML string
   * @private
   */
  renderKnowledgeCheckpointScreen(data) {
    const c = this.content.knowledgeCheckpoint;
    return `
      <article class="checkpoint-content" role="article" aria-labelledby="checkpoint-title">
        <h2 id="checkpoint-title" class="text-center text-gold">${c.title}</h2>
        <p class="text-center">${c.subtitle}</p>
        <section id="checkpoint-questions" class="mt-lg" role="region" aria-label="Knowledge assessment questions">
          <!-- Questions will be rendered here -->
        </section>
        <button id="view-results" class="mt-lg hidden" aria-label="View your results">${c.buttonText}</button>
      </article>
    `;
  }

  /**
   * Render results card screen HTML
   * @param {object} data - Results data from checkpoint:complete event
   * @returns {string} HTML string
   * @private
   */
  renderResultsCardScreen(data) {
    const c = this.content.resultsCard;
    
    // Add outcome data to the session data for ResultsCard
    const cardData = {
      ...data,
      outcome: this.currentOutcome
    };
    
    // Generate results card HTML using ResultsCard component
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

  /**
   * Render current scene with narrative and choices
   * @param {object} scene - Scene object to render
   * @param {number} sceneIndex - Current scene index
   * @param {number} totalScenes - Total number of scenes
   */
  renderScene(scene, sceneIndex, totalScenes) {
    // Validate scene object
    if (!scene || !scene.narrative || !scene.choices) {
      console.error('UIController.renderScene: Invalid scene object');
      return;
    }
    
    // Apply scene transition animation before rendering (Task 7.2)
    if (this.sceneTransition) {
      this.sceneTransition.transition(null, scene, 'fade', 500);
    }
    
    // Ensure scene screen exists
    if (this.currentScreen !== 'scene') {
      this.showScreen('scene');
    }
    
    // Get scene containers
    const narrativeContainer = document.getElementById('scene-narrative');
    const choicesContainer = document.getElementById('scene-choices');
    const progressContainer = document.getElementById('scene-progress');
    
    if (!narrativeContainer || !choicesContainer || !progressContainer) {
      console.error('UIController.renderScene: Scene containers not found in DOM');
      return;
    }
    
    // Render narrative text
    narrativeContainer.innerHTML = `<p>${scene.narrative}</p>`;
    
    // Render choices
    choicesContainer.innerHTML = '';
    scene.choices.forEach((choice, index) => {
      const choiceButton = document.createElement('button');
      choiceButton.className = 'choice-button mt-sm';
      choiceButton.textContent = choice.text;
      choiceButton.dataset.choiceId = choice.id;
      choiceButton.dataset.nextScene = choice.nextScene;
      choiceButton.dataset.consequences = JSON.stringify(choice.consequences || {});
      choiceButton.setAttribute('aria-label', `Choice ${index + 1}: ${choice.text}`);
      
      // Add click handler
      choiceButton.addEventListener('click', () => {
        this.handleChoiceClick(choice);
      });
      
      choicesContainer.appendChild(choiceButton);
    });
    
    // Disable choices initially (will be enabled after typewriter completes)
    this.disableChoices();
    
    // If typewriter effect is available, use it for narrative reveal
    if (this.typewriterEffect) {
      const narrativeParagraph = narrativeContainer.querySelector('p');
      if (narrativeParagraph) {
        this.typewriterEffect.revealText(
          narrativeParagraph,
          scene.narrative,
          30, // speed in ms per character
          () => {
            // Enable choices after typewriter completes
            this.enableChoices();
            
            // Start timed choice AFTER typewriter completes (if specified)
            if (scene.timedChoice && this.timedChoiceSystem) {
              this.startTimedChoice(scene.timedChoice);
            }
          }
        );
      } else {
        // Fallback: enable choices immediately if paragraph not found
        this.enableChoices();
        
        // Start timed choice if specified
        if (scene.timedChoice && this.timedChoiceSystem) {
          this.startTimedChoice(scene.timedChoice);
        }
      }
    } else {
      // No typewriter effect available, enable choices immediately
      this.enableChoices();
      
      // Start timed choice if specified
      if (scene.timedChoice && this.timedChoiceSystem) {
        this.startTimedChoice(scene.timedChoice);
      }
    }
    
    // Update progress indicator
    this.updateProgress(sceneIndex + 1, totalScenes);
    
    // Apply atmospheric effect if specified (using AtmosphericEffects component)
    if (scene.atmosphericEffect && this.atmosphericEffects) {
      this.atmosphericEffects.applyEffect(scene.atmosphericEffect);
    }
    
    // Change ambient sound if specified (Task 7.2)
    if (scene.ambientSound && this.ambientSoundManager) {
      this.ambientSoundManager.playSound(
        scene.ambientSound.id,
        true, // loop
        scene.ambientSound.volume || 0.6
      );
    }
  }

  /**
   * Enable choice buttons to make them clickable
   * Called after typewriter effect completes
   */
  enableChoices() {
    const choiceButtons = document.querySelectorAll('.choice-button');
    choiceButtons.forEach(button => {
      button.disabled = false;
      button.style.pointerEvents = 'auto';
      button.style.opacity = '1';
    });
  }

  /**
   * Disable choice buttons to prevent clicks during typewriter animation
   * Called at the start of scene rendering
   */
  disableChoices() {
    const choiceButtons = document.querySelectorAll('.choice-button');
    choiceButtons.forEach(button => {
      button.disabled = true;
      button.style.pointerEvents = 'none';
      button.style.opacity = '0.5';
    });
  }

  /**
   * Start timed choice countdown
   * @param {object} timedChoiceConfig - Timed choice configuration from scene
   * @private
   */
  startTimedChoice(timedChoiceConfig) {
    if (!this.timedChoiceSystem) {
      console.warn('UIController.startTimedChoice: TimedChoiceSystem not available');
      return;
    }

    // Validate configuration
    if (!timedChoiceConfig.duration || !timedChoiceConfig.defaultChoice) {
      console.error('UIController.startTimedChoice: Invalid timedChoice configuration');
      return;
    }

    // Find the default choice object
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

    // Start the timer with callback to auto-select default choice
    this.timedChoiceSystem.startTimer(
      timedChoiceConfig.duration,
      timedChoiceConfig.defaultChoice,
      (choiceId) => {
        // Auto-select the default choice when timer expires
        if (defaultChoiceButton) {
          defaultChoiceButton.click();
        }
      }
    );
  }

  /**
   * Handle choice button click
   * @param {object} choice - Choice object
   * @private
   */
  handleChoiceClick(choice) {
    // Emit choice:made event (ConsequenceSystem will handle flag setting)
    // SceneStateMachine will handle transition
    this.eventBus.emit('choice:made', {
      choiceId: choice.id,
      nextSceneId: choice.nextScene,
      consequences: choice.consequences || {}
    });
    
    // SceneStateMachine will call transitionTo, which will emit scene:transition
    // That will trigger handleSceneTransition and re-render the scene
  }

  /**
   * Show loading animation
   */
  showLoading() {
    this.showScreen('loading');
  }

  /**
   * Update progress indicator
   * @param {number} current - Current scene number (1-indexed)
   * @param {number} total - Total number of scenes
   */
  updateProgress(current, total) {
    const progressContainer = document.getElementById('scene-progress');
    
    if (!progressContainer) {
      return;
    }
    
    const c = this.content.progress;
    progressContainer.innerHTML = `
      <p class="text-secondary">${c.sceneLabel} ${current} of ${total}</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${(current / total) * 100}%"></div>
      </div>
    `;
  }

  /**
   * Attach event listeners to screen elements
   * @param {HTMLElement} screen - Screen element
   * @param {string} screenName - Name of the screen
   * @private
   */
  attachEventListeners(screen, screenName) {
    // Landing screen
    if (screenName === 'landing') {
      const beginButton = screen.querySelector('#begin-button');
      if (beginButton) {
        beginButton.addEventListener('click', () => {
          this.showScreen('timeline');
        });
      }
    }
    
    // Timeline screen - render timeline using TimelineSelector
    if (screenName === 'timeline') {
      const timelineContainer = screen.querySelector('#timeline-container');
      if (timelineContainer && this.timelineSelector) {
        this.timelineSelector.render(timelineContainer);
      }
    }
    
    // Role selection screen - populate role cards
    if (screenName === 'role-selection') {
      this.populateRoleCards(screen);
    }
    
    // Outcome screen - populate outcome data
    if (screenName === 'outcome') {
      this.populateOutcomeScreen(screen);
      
      const continueButton = screen.querySelector('#continue-to-ripple');
      if (continueButton) {
        continueButton.addEventListener('click', () => {
          this.showScreen('historical-ripple');
        });
      }
    }
    
    // Historical ripple screen
    if (screenName === 'historical-ripple') {
      this.populateHistoricalRipple(screen);
      
      const continueButton = screen.querySelector('#continue-to-checkpoint');
      if (continueButton) {
        continueButton.addEventListener('click', () => {
          this.showScreen('knowledge-checkpoint');
        });
      }
    }
    
    // Knowledge checkpoint screen
    if (screenName === 'knowledge-checkpoint') {
      this.populateKnowledgeCheckpoint(screen);
      
      const viewResultsButton = screen.querySelector('#view-results');
      if (viewResultsButton) {
        viewResultsButton.addEventListener('click', () => {
          this.eventBus.emit('checkpoint:complete', {
            score: this.checkpointScore,
            totalQuestions: this.checkpointTotalQuestions
          });
        });
      }
    }
    
    // Results card screen
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
          // Emit mission:selected event with just the missionId string
          this.eventBus.emit('mission:selected', 'pearl-harbor');
        });
      }
    }
  }

  /**
   * Populate role cards in the role selection screen
   * @param {HTMLElement} screen - Role selection screen element
   * @private
   */
  populateRoleCards(screen) {
    const roleCardsContainer = screen.querySelector('#role-cards-container');
    const endingsCountElement = screen.querySelector('#endings-count');
    const allRolesCompletedMessage = screen.querySelector('#all-roles-completed-message');
    
    if (!roleCardsContainer) {
      console.error('UIController.populateRoleCards: #role-cards-container not found');
      return;
    }
    
    // Get current mission from stored mission ID
    if (!this.currentMissionId) {
      console.error('UIController.populateRoleCards: No mission ID stored');
      return;
    }
    
    const mission = this.missionRegistry.getMission(this.currentMissionId);
    
    if (!mission || !mission.roles) {
      console.error(`UIController.populateRoleCards: Mission "${this.currentMissionId}" not found or has no roles`);
      return;
    }
    
    // Clear existing cards
    roleCardsContainer.innerHTML = '';
    
    // Create a card for each role
    mission.roles.forEach(role => {
      const roleCard = document.createElement('article');
      roleCard.className = 'role-card';
      roleCard.setAttribute('role', 'article');
      roleCard.setAttribute('aria-labelledby', `role-title-${role.id}`);
      
      // Check if role is completed
      const isCompleted = this.completedRoles.has(role.id);
      if (isCompleted) {
        roleCard.classList.add('completed');
      }
      
      // Create card content
      const roleTitle = document.createElement('h3');
      roleTitle.id = `role-title-${role.id}`;
      roleTitle.className = 'role-title';
      roleTitle.textContent = role.name;
      
      const roleDescription = document.createElement('p');
      roleDescription.className = 'role-description';
      roleDescription.textContent = role.description;
      
      const selectButton = document.createElement('button');
      selectButton.className = 'role-select-button';
      selectButton.textContent = isCompleted ? 'Play Again' : 'Select Role';
      selectButton.dataset.roleId = role.id;
      selectButton.setAttribute('aria-label', `${isCompleted ? 'Play again as' : 'Select role'}: ${role.name}`);
      
      // Add completion indicator if completed
      if (isCompleted) {
        const completionBadge = document.createElement('span');
        completionBadge.className = 'completion-badge';
        completionBadge.textContent = '✓ Completed';
        completionBadge.setAttribute('aria-label', 'Role completed');
        roleCard.appendChild(completionBadge);
      }
      
      // Add click handler
      selectButton.addEventListener('click', () => {
        this.handleRoleSelection(role.id);
      });
      
      // Assemble card
      roleCard.appendChild(roleTitle);
      roleCard.appendChild(roleDescription);
      roleCard.appendChild(selectButton);
      
      roleCardsContainer.appendChild(roleCard);
    });
    
    // Update endings counter
    const totalRoles = mission.roles.length;
    const completedCount = this.completedRoles.size;
    
    if (endingsCountElement) {
      endingsCountElement.textContent = `${completedCount}/${totalRoles}`;
    }
    
    // Show special message if all roles completed
    if (allRolesCompletedMessage && completedCount === totalRoles) {
      allRolesCompletedMessage.classList.remove('hidden');
    }
  }

  /**
   * Handle role selection button click
   * @param {string} roleId - ID of the selected role
   * @private
   */
  handleRoleSelection(roleId) {
    // Emit role:selected event
    this.eventBus.emit('role:selected', {
      missionId: this.currentMissionId,
      roleId: roleId
    });
  }

  /**
   * Populate outcome screen with calculated outcome data
   * @param {HTMLElement} screen - Outcome screen element
   * @private
   */
  populateOutcomeScreen(screen) {
    const outcomeResultContainer = screen.querySelector('#outcome-result');
    
    if (!outcomeResultContainer) {
      console.error('UIController.populateOutcomeScreen: #outcome-result container not found');
      return;
    }
    
    // Get current mission and role
    if (!this.currentMissionId || !this.currentRoleId) {
      console.error('UIController.populateOutcomeScreen: No mission or role ID stored');
      outcomeResultContainer.innerHTML = '<p>Error: Unable to determine outcome. Mission or role data missing.</p>';
      return;
    }
    
    const mission = this.missionRegistry.getMission(this.currentMissionId);
    
    if (!mission) {
      console.error(`UIController.populateOutcomeScreen: Mission "${this.currentMissionId}" not found`);
      outcomeResultContainer.innerHTML = '<p>Error: Mission data not found.</p>';
      return;
    }
    
    // Find the current role
    const role = mission.roles.find(r => r.id === this.currentRoleId);
    
    if (!role || !role.outcomes) {
      console.error(`UIController.populateOutcomeScreen: Role "${this.currentRoleId}" not found or has no outcomes`);
      outcomeResultContainer.innerHTML = '<p>Error: Role outcome data not found.</p>';
      return;
    }
    
    // Calculate outcome using ConsequenceSystem
    const outcomeId = this.consequenceSystem.calculateOutcome(role.outcomes);
    
    if (!outcomeId) {
      console.error('UIController.populateOutcomeScreen: No matching outcome found for current flags');
      outcomeResultContainer.innerHTML = '<p>Error: Unable to determine outcome based on your choices.</p>';
      return;
    }
    
    // Find the matching outcome object
    const outcome = role.outcomes.find(o => o.id === outcomeId);
    
    if (!outcome) {
      console.error(`UIController.populateOutcomeScreen: Outcome "${outcomeId}" not found in role outcomes`);
      outcomeResultContainer.innerHTML = '<p>Error: Outcome data not found.</p>';
      return;
    }
    
    // Populate the outcome screen
    const survivalStatus = outcome.survived ? 'You Survived' : 'You Did Not Survive';
    const survivalClass = outcome.survived ? 'text-success' : 'text-danger';
    
    outcomeResultContainer.innerHTML = `
      <h3 class="${survivalClass}">${survivalStatus}</h3>
      <div class="outcome-epilogue mt-md">
        ${this.formatEpilogue(outcome.epilogue)}
      </div>
    `;
  }

  /**
   * Format epilogue text with paragraph breaks
   * @param {string} epilogue - Raw epilogue text
   * @returns {string} HTML formatted epilogue
   * @private
   */
  formatEpilogue(epilogue) {
    // Split epilogue into paragraphs (separated by double newlines)
    const paragraphs = epilogue.split('\n\n').filter(p => p.trim() !== '');
    
    // Wrap each paragraph in <p> tags
    return paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
  }

  /**
   * Populate historical ripple timeline with events from mission data
   * @param {HTMLElement} screen - Historical ripple screen element
   * @private
   */
  populateHistoricalRipple(screen) {
    const rippleTimelineContainer = screen.querySelector('#ripple-timeline');
    
    if (!rippleTimelineContainer) {
      console.error('UIController.populateHistoricalRipple: #ripple-timeline container not found');
      return;
    }
    
    // Get current mission from stored mission ID
    if (!this.currentMissionId) {
      console.error('UIController.populateHistoricalRipple: No mission ID stored');
      return;
    }
    
    const mission = this.missionRegistry.getMission(this.currentMissionId);
    
    if (!mission || !mission.historicalRipple) {
      console.error(`UIController.populateHistoricalRipple: Mission "${this.currentMissionId}" not found or has no historical ripple events`);
      return;
    }
    
    // Clear existing events
    rippleTimelineContainer.innerHTML = '';
    
    // Create a ripple event element for each event in the mission data
    mission.historicalRipple.forEach((event, index) => {
      const eventElement = document.createElement('article');
      eventElement.className = 'ripple-event';
      eventElement.setAttribute('role', 'article');
      eventElement.setAttribute('aria-labelledby', `ripple-event-title-${index}`);
      
      // Set animation delay based on event's animationDelay property
      eventElement.style.animationDelay = `${event.animationDelay}ms`;
      
      // Create event header with date
      const eventHeader = document.createElement('header');
      eventHeader.className = 'ripple-event-header';
      
      const eventDate = document.createElement('time');
      eventDate.className = 'ripple-event-date';
      eventDate.textContent = event.date;
      eventDate.setAttribute('datetime', event.date);
      
      eventHeader.appendChild(eventDate);
      
      // Create event title
      const eventTitle = document.createElement('h3');
      eventTitle.id = `ripple-event-title-${index}`;
      eventTitle.className = 'ripple-event-title';
      eventTitle.textContent = event.title;
      
      // Create event description
      const eventDescription = document.createElement('p');
      eventDescription.className = 'ripple-event-description';
      eventDescription.textContent = event.description;
      
      // Create AP theme tag
      const eventTheme = document.createElement('span');
      eventTheme.className = 'ripple-event-theme';
      eventTheme.textContent = `${this.content.historicalRipple.apThemeLabel} ${this.formatApTheme(event.apTheme)}`;
      eventTheme.setAttribute('aria-label', `AP History theme: ${event.apTheme}`);
      
      // Assemble event element
      eventElement.appendChild(eventHeader);
      eventElement.appendChild(eventTitle);
      eventElement.appendChild(eventDescription);
      eventElement.appendChild(eventTheme);
      
      rippleTimelineContainer.appendChild(eventElement);
    });
  }

  /**
   * Format AP theme name for display
   * @param {string} theme - AP theme identifier (e.g., "causation", "continuity")
   * @returns {string} Formatted theme name
   * @private
   */
  formatApTheme(theme) {
    // Capitalize first letter
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  }

  /**
   * Populate knowledge checkpoint with role-specific questions
   * @param {HTMLElement} screen - Knowledge checkpoint screen element
   * @private
   */
  populateKnowledgeCheckpoint(screen) {
    const questionsContainer = screen.querySelector('#checkpoint-questions');
    const viewResultsButton = screen.querySelector('#view-results');
    
    if (!questionsContainer) {
      console.error('UIController.populateKnowledgeCheckpoint: #checkpoint-questions container not found');
      return;
    }
    
    // Get current mission and role
    if (!this.currentMissionId || !this.currentRoleId) {
      console.error('UIController.populateKnowledgeCheckpoint: No mission or role ID stored');
      questionsContainer.innerHTML = '<p>Error: Unable to load questions. Mission or role data missing.</p>';
      return;
    }
    
    const mission = this.missionRegistry.getMission(this.currentMissionId);
    
    if (!mission || !mission.knowledgeQuestions) {
      console.error(`UIController.populateKnowledgeCheckpoint: Mission "${this.currentMissionId}" not found or has no knowledge questions`);
      questionsContainer.innerHTML = '<p>Error: Knowledge questions not found.</p>';
      return;
    }
    
    // Filter questions by roleSpecific field
    const roleQuestions = mission.knowledgeQuestions.filter(q => q.roleSpecific === this.currentRoleId);
    
    if (roleQuestions.length === 0) {
      console.error(`UIController.populateKnowledgeCheckpoint: No questions found for role "${this.currentRoleId}"`);
      questionsContainer.innerHTML = '<p>Error: No questions available for this role.</p>';
      return;
    }
    
    // Initialize checkpoint tracking
    this.checkpointAnswers = new Map(); // questionId -> {selectedAnswer, correct}
    this.checkpointScore = 0;
    this.checkpointTotalQuestions = roleQuestions.length;
    
    // Clear existing questions
    questionsContainer.innerHTML = '';
    
    // Render each question
    roleQuestions.forEach((question, index) => {
      const questionElement = document.createElement('article');
      questionElement.className = 'checkpoint-question panel panel-parchment mt-md';
      questionElement.dataset.questionId = question.id;
      questionElement.setAttribute('role', 'article');
      questionElement.setAttribute('aria-labelledby', `question-${index}-text`);
      
      // Question header with number and AP skill
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
      
      // Question text
      const questionText = document.createElement('p');
      questionText.id = `question-${index}-text`;
      questionText.className = 'question-text';
      questionText.textContent = question.question;
      
      // Options container
      const optionsContainer = document.createElement('nav');
      optionsContainer.className = 'question-options mt-sm';
      optionsContainer.setAttribute('role', 'navigation');
      optionsContainer.setAttribute('aria-label', `Answer options for question ${index + 1}`);
      
      // Render each option as a button
      question.options.forEach(option => {
        const optionButton = document.createElement('button');
        optionButton.className = 'option-button';
        optionButton.dataset.optionId = option.id;
        optionButton.dataset.correct = option.correct;
        optionButton.textContent = `${option.id.toUpperCase()}. ${option.text}`;
        optionButton.setAttribute('aria-label', `Option ${option.id.toUpperCase()}: ${option.text}`);
        
        // Add click handler for answer selection
        optionButton.addEventListener('click', () => {
          this.handleAnswerSelection(question, option, questionElement, optionsContainer);
        });
        
        optionsContainer.appendChild(optionButton);
      });
      
      // Explanation container (initially hidden)
      const explanationContainer = document.createElement('section');
      explanationContainer.className = 'question-explanation hidden mt-md';
      explanationContainer.setAttribute('role', 'region');
      explanationContainer.setAttribute('aria-label', 'Answer explanation');
      explanationContainer.innerHTML = `
        <h4>Explanation:</h4>
        <p>${question.explanation}</p>
      `;
      
      // Assemble question element
      questionElement.appendChild(questionHeader);
      questionElement.appendChild(questionText);
      questionElement.appendChild(optionsContainer);
      questionElement.appendChild(explanationContainer);
      
      questionsContainer.appendChild(questionElement);
    });
  }

  /**
   * Handle answer selection for a knowledge checkpoint question
   * @param {object} question - Question object
   * @param {object} selectedOption - Selected option object
   * @param {HTMLElement} questionElement - Question container element
   * @param {HTMLElement} optionsContainer - Options container element
   * @private
   */
  handleAnswerSelection(question, selectedOption, questionElement, optionsContainer) {
    // Check if question has already been answered
    if (this.checkpointAnswers.has(question.id)) {
      return; // Don't allow re-answering
    }
    
    // Record the answer
    const isCorrect = selectedOption.correct === true;
    this.checkpointAnswers.set(question.id, {
      selectedAnswer: selectedOption.id,
      correct: isCorrect
    });
    
    // Update score if correct
    if (isCorrect) {
      this.checkpointScore++;
    }
    
    // Disable all option buttons
    const optionButtons = optionsContainer.querySelectorAll('.option-button');
    optionButtons.forEach(button => {
      button.disabled = true;
      
      // Add visual feedback
      const buttonCorrect = button.dataset.correct === 'true';
      if (button.dataset.optionId === selectedOption.id) {
        // This is the selected answer
        if (isCorrect) {
          button.classList.add('correct');
        } else {
          button.classList.add('incorrect');
        }
      } else if (buttonCorrect) {
        // Show the correct answer
        button.classList.add('correct');
      }
    });
    
    // Show explanation
    const explanationContainer = questionElement.querySelector('.question-explanation');
    if (explanationContainer) {
      explanationContainer.classList.remove('hidden');
    }
    
    // Check if all questions have been answered
    if (this.checkpointAnswers.size === this.checkpointTotalQuestions) {
      this.showCheckpointResults();
    }
  }

  /**
   * Show checkpoint results and enable "View Results" button
   * @private
   */
  showCheckpointResults() {
    const viewResultsButton = document.getElementById('view-results');
    
    if (!viewResultsButton) {
      console.error('UIController.showCheckpointResults: #view-results button not found');
      return;
    }
    
    // Show the button
    viewResultsButton.classList.remove('hidden');
    
    // Add score display above the button
    const checkpointContent = document.querySelector('.checkpoint-content');
    if (checkpointContent) {
      // Check if score display already exists
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
        
        // Insert before the view results button
        checkpointContent.insertBefore(scoreDisplay, viewResultsButton);
      }
    }
  }

  /**
   * Copy results text to clipboard using ResultsCard component
   * @private
   */
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

  /**
   * Handle timer:started event - show timer UI
   * @param {object} data - Event data with duration and defaultChoiceId
   * @private
   */
  handleTimerStarted(data) {
    const timerDisplay = document.getElementById('timer-display');
    if (!timerDisplay) return;
    
    // Show timer display
    timerDisplay.classList.remove('hidden');
    
    // Initialize timer display with full duration
    const seconds = Math.ceil(data.duration / 1000);
    this.updateTimerDisplay(data.duration, data.duration);
  }

  /**
   * Handle timer:update event - update timer UI
   * @param {object} data - Event data with remaining time and warning flag
   * @private
   */
  handleTimerUpdate(data) {
    const timerDisplay = document.getElementById('timer-display');
    if (!timerDisplay) return;
    
    // Update timer display
    this.updateTimerDisplay(data.remaining, null);
    
    // Add warning class if time is running out
    if (data.isWarning) {
      timerDisplay.classList.add('timer-warning');
    } else {
      timerDisplay.classList.remove('timer-warning');
    }
  }

  /**
   * Handle timer:expired event - hide timer UI
   * @param {object} data - Event data
   * @private
   */
  handleTimerExpired(data) {
    const timerDisplay = document.getElementById('timer-display');
    if (!timerDisplay) return;
    
    // Hide timer display
    timerDisplay.classList.add('hidden');
    timerDisplay.classList.remove('timer-warning');
  }

  /**
   * Handle timer:cancelled event - hide timer UI
   * @param {object} data - Event data
   * @private
   */
  handleTimerCancelled(data) {
    const timerDisplay = document.getElementById('timer-display');
    if (!timerDisplay) return;
    
    // Hide timer display
    timerDisplay.classList.add('hidden');
    timerDisplay.classList.remove('timer-warning');
  }

  /**
   * Update timer display with remaining time
   * @param {number} remaining - Remaining time in milliseconds
   * @param {number} duration - Total duration in milliseconds (optional, for progress calculation)
   * @private
   */
  updateTimerDisplay(remaining, duration) {
    const timerSeconds = document.getElementById('timer-seconds');
    const timerProgressFill = document.querySelector('.timer-progress-fill');
    
    if (!timerSeconds) return;
    
    // Update seconds text
    const seconds = Math.ceil(remaining / 1000);
    timerSeconds.textContent = seconds;
    
    // Update circular progress indicator if duration is provided
    if (timerProgressFill && duration) {
      const progress = remaining / duration;
      const circumference = 2 * Math.PI * 45; // radius = 45
      const offset = circumference * (1 - progress);
      timerProgressFill.style.strokeDashoffset = offset;
    }
  }
}

// ES6 module export - no global variables
export default UIController;
