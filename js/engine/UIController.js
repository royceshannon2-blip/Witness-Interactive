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

class UIController {
  /**
   * Initialize the UIController
   * @param {EventBus} eventBus - Event bus for component communication
   * @param {TimelineSelector} timelineSelector - Timeline selector component
   * @param {MissionRegistry} missionRegistry - Mission registry for accessing mission data
   * @param {ConsequenceSystem} consequenceSystem - Consequence system for outcome calculation
   * @param {ResultsCard} resultsCard - Results card generator component
   * @param {object} uiContent - UI text content configuration (from js/content/ui-content.js)
   */
  constructor(eventBus, timelineSelector, missionRegistry, consequenceSystem, resultsCard, uiContent) {
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
    
    this.showScreen('outcome', data);
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
    
    // Apply any atmospheric effects if specified in data
    if (data.atmosphericEffect) {
      this.applyEffect(data.atmosphericEffect);
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
      <div class="landing-content text-center">
        <h1 class="text-gold">${c.title}</h1>
        <h2>${c.subtitle}</h2>
        <p class="tagline">${c.tagline}</p>
        <p class="context">${c.context}</p>
        <button id="begin-button" class="mt-lg">${c.buttonText}</button>
      </div>
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
      <div class="timeline-content">
        <h2 class="text-center text-gold">${c.title}</h2>
        <p class="text-center">${c.subtitle}</p>
        <div id="timeline-container" class="mt-lg">
          <!-- Timeline will be rendered by TimelineSelector component -->
        </div>
      </div>
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
      <div class="role-selection-content">
        <h2 class="text-center text-gold">${c.title}</h2>
        <p class="text-center">${c.subtitle}</p>
        <div id="role-cards-container" class="mt-lg">
          <!-- Role cards will be populated dynamically -->
        </div>
        <div class="endings-counter text-center mt-md">
          <p class="text-secondary">${c.endingsLabel} <span id="endings-count">0/3</span></p>
        </div>
      </div>
    `;
  }

  /**
   * Render scene screen HTML (placeholder, will be populated by renderScene)
   * @returns {string} HTML string
   * @private
   */
  renderSceneScreen() {
    return `
      <div class="scene-content">
        <div id="scene-narrative" class="panel panel-parchment">
          <!-- Scene narrative will be rendered here -->
        </div>
        <div id="scene-choices" class="mt-md">
          <!-- Scene choices will be rendered here -->
        </div>
        <div id="scene-progress" class="text-center mt-md">
          <!-- Progress indicator will be rendered here -->
        </div>
      </div>
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
      <div class="outcome-content text-center">
        <h2 class="text-gold">${c.title}</h2>
        <div id="outcome-result" class="panel panel-parchment mt-lg">
          <!-- Outcome will be populated dynamically -->
        </div>
        <button id="continue-to-ripple" class="mt-lg">${c.buttonText}</button>
      </div>
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
      <div class="ripple-content">
        <h2 class="text-center text-gold">${c.title}</h2>
        <p class="text-center">${c.subtitle}</p>
        <div id="ripple-timeline" class="mt-lg">
          <!-- Ripple events will be rendered here -->
        </div>
        <button id="continue-to-checkpoint" class="mt-lg">${c.buttonText}</button>
      </div>
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
      <div class="checkpoint-content">
        <h2 class="text-center text-gold">${c.title}</h2>
        <p class="text-center">${c.subtitle}</p>
        <div id="checkpoint-questions" class="mt-lg">
          <!-- Questions will be rendered here -->
        </div>
        <button id="view-results" class="mt-lg hidden">${c.buttonText}</button>
      </div>
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
    
    // Generate results card HTML using ResultsCard component
    const cardHTML = this.resultsCard ? this.resultsCard.generateCard(data) : '<p>Error: Results card generator not available.</p>';
    
    return `
      <div class="results-content text-center">
        <h2 class="text-gold">${c.title}</h2>
        <div id="results-card" class="panel panel-parchment mt-lg">
          ${cardHTML}
        </div>
        <button id="copy-results" class="mt-md">${c.copyButtonText}</button>
        <button id="play-again" class="mt-md">${c.playAgainButtonText}</button>
      </div>
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
      
      // Add click handler
      choiceButton.addEventListener('click', () => {
        this.handleChoiceClick(choice);
      });
      
      choicesContainer.appendChild(choiceButton);
    });
    
    // Update progress indicator
    this.updateProgress(sceneIndex + 1, totalScenes);
    
    // Apply atmospheric effect if specified
    if (scene.atmosphericEffect) {
      this.applyEffect(scene.atmosphericEffect);
    }
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
   * Apply atmospheric effect
   * @param {string} effectName - Name of effect: "smoke", "fire", "shake"
   */
  applyEffect(effectName) {
    const validEffects = ['smoke', 'fire', 'shake'];
    
    if (!validEffects.includes(effectName)) {
      console.warn(`UIController.applyEffect: Unknown effect "${effectName}"`);
      return;
    }
    
    // Add effect class to body
    document.body.classList.add(`effect-${effectName}`);
    
    // Remove effect after animation completes (2 seconds)
    setTimeout(() => {
      document.body.classList.remove(`effect-${effectName}`);
    }, 2000);
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
          // Get current mission ID from last mission:selected event
          // For now, default to pearl-harbor
          this.eventBus.emit('mission:selected', { missionId: 'pearl-harbor' });
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
      const roleCard = document.createElement('div');
      roleCard.className = 'role-card';
      
      // Check if role is completed
      const isCompleted = this.completedRoles.has(role.id);
      if (isCompleted) {
        roleCard.classList.add('completed');
      }
      
      // Create card content
      const roleTitle = document.createElement('h3');
      roleTitle.className = 'role-title';
      roleTitle.textContent = role.name;
      
      const roleDescription = document.createElement('p');
      roleDescription.className = 'role-description';
      roleDescription.textContent = role.description;
      
      const selectButton = document.createElement('button');
      selectButton.className = 'role-select-button';
      selectButton.textContent = isCompleted ? 'Play Again' : 'Select Role';
      selectButton.dataset.roleId = role.id;
      
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
    if (endingsCountElement) {
      const totalRoles = mission.roles.length;
      const completedCount = this.completedRoles.size;
      endingsCountElement.textContent = `${completedCount}/${totalRoles}`;
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
      const eventElement = document.createElement('div');
      eventElement.className = 'ripple-event';
      
      // Set animation delay based on event's animationDelay property
      eventElement.style.animationDelay = `${event.animationDelay}ms`;
      
      // Create event header with date
      const eventHeader = document.createElement('div');
      eventHeader.className = 'ripple-event-header';
      
      const eventDate = document.createElement('div');
      eventDate.className = 'ripple-event-date';
      eventDate.textContent = event.date;
      
      eventHeader.appendChild(eventDate);
      
      // Create event title
      const eventTitle = document.createElement('h3');
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
      const questionElement = document.createElement('div');
      questionElement.className = 'checkpoint-question panel panel-parchment mt-md';
      questionElement.dataset.questionId = question.id;
      
      // Question header with number and AP skill
      const questionHeader = document.createElement('div');
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
      questionText.className = 'question-text';
      questionText.textContent = question.question;
      
      // Options container
      const optionsContainer = document.createElement('div');
      optionsContainer.className = 'question-options mt-sm';
      
      // Render each option as a button
      question.options.forEach(option => {
        const optionButton = document.createElement('button');
        optionButton.className = 'option-button';
        optionButton.dataset.optionId = option.id;
        optionButton.dataset.correct = option.correct;
        optionButton.textContent = `${option.id.toUpperCase()}. ${option.text}`;
        
        // Add click handler for answer selection
        optionButton.addEventListener('click', () => {
          this.handleAnswerSelection(question, option, questionElement, optionsContainer);
        });
        
        optionsContainer.appendChild(optionButton);
      });
      
      // Explanation container (initially hidden)
      const explanationContainer = document.createElement('div');
      explanationContainer.className = 'question-explanation hidden mt-md';
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
}

// ES6 module export - no global variables
export default UIController;
