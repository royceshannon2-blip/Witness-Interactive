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
   */
  constructor(eventBus, timelineSelector) {
    // Store reference to event bus
    this.eventBus = eventBus;
    
    // Store reference to timeline selector
    this.timelineSelector = timelineSelector;
    
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
    
    // Game complete - show outcome screen
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
   * @param {object} data - Event data
   * @private
   */
  handleGameComplete(data) {
    this.showScreen('outcome', data);
  }

  /**
   * Handle mission:selected event
   * @param {object} data - Event data containing missionId
   * @private
   */
  handleMissionSelected(data) {
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
    return `
      <div class="landing-content text-center">
        <h1 class="text-gold">Witness Interactive</h1>
        <h2>Pearl Harbor</h2>
        <p class="tagline">December 7, 1941 — A Date Which Will Live in Infamy</p>
        <p class="context">
          Experience the attack on Pearl Harbor from three different perspectives.
          Your choices matter. History remembers.
        </p>
        <button id="begin-button" class="mt-lg">Begin Experience</button>
      </div>
    `;
  }

  /**
   * Render timeline screen HTML
   * @returns {string} HTML string
   * @private
   */
  renderTimelineScreen() {
    return `
      <div class="timeline-content">
        <h2 class="text-center text-gold">Historical Timeline</h2>
        <p class="text-center">Select a mission to begin</p>
        <div id="timeline-container" class="mt-lg">
          <!-- Timeline will be rendered by TimelineSelector component -->
        </div>
      </div>
    `;
  }

  /**
   * Render role selection screen HTML
   * @param {object} data - Mission data
   * @returns {string} HTML string
   * @private
   */
  renderRoleSelectionScreen(data) {
    return `
      <div class="role-selection-content">
        <h2 class="text-center text-gold">Choose Your Perspective</h2>
        <p class="text-center">Experience Pearl Harbor through different eyes</p>
        <div id="role-cards-container" class="mt-lg">
          <!-- Role cards will be populated dynamically -->
        </div>
        <div class="endings-counter text-center mt-md">
          <p class="text-secondary">Endings Discovered: <span id="endings-count">0/3</span></p>
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
    return `
      <div class="outcome-content text-center">
        <h2 class="text-gold">Your Story</h2>
        <div id="outcome-result" class="panel panel-parchment mt-lg">
          <!-- Outcome will be populated dynamically -->
        </div>
        <button id="continue-to-ripple" class="mt-lg">Continue</button>
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
    return `
      <div class="ripple-content">
        <h2 class="text-center text-gold">Historical Consequences</h2>
        <p class="text-center">The ripples of December 7, 1941</p>
        <div id="ripple-timeline" class="mt-lg">
          <!-- Ripple events will be rendered here -->
        </div>
        <button id="continue-to-checkpoint" class="mt-lg">Continue</button>
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
    return `
      <div class="checkpoint-content">
        <h2 class="text-center text-gold">Knowledge Checkpoint</h2>
        <p class="text-center">Test your understanding of the historical context</p>
        <div id="checkpoint-questions" class="mt-lg">
          <!-- Questions will be rendered here -->
        </div>
        <button id="view-results" class="mt-lg hidden">View Results</button>
      </div>
    `;
  }

  /**
   * Render results card screen HTML
   * @param {object} data - Results data
   * @returns {string} HTML string
   * @private
   */
  renderResultsCardScreen(data) {
    return `
      <div class="results-content text-center">
        <h2 class="text-gold">Mission Complete</h2>
        <div id="results-card" class="panel panel-parchment mt-lg">
          <!-- Results card will be populated dynamically -->
        </div>
        <button id="copy-results" class="mt-md">Copy Results</button>
        <button id="play-again" class="mt-md">Play Another Role</button>
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
    
    progressContainer.innerHTML = `
      <p class="text-secondary">Scene ${current} of ${total}</p>
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
    
    // Outcome screen
    if (screenName === 'outcome') {
      const continueButton = screen.querySelector('#continue-to-ripple');
      if (continueButton) {
        continueButton.addEventListener('click', () => {
          this.showScreen('historical-ripple');
        });
      }
    }
    
    // Historical ripple screen
    if (screenName === 'historical-ripple') {
      const continueButton = screen.querySelector('#continue-to-checkpoint');
      if (continueButton) {
        continueButton.addEventListener('click', () => {
          this.showScreen('knowledge-checkpoint');
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
          this.showScreen('role-selection');
        });
      }
    }
  }

  /**
   * Copy results text to clipboard
   * @private
   */
  copyResultsToClipboard() {
    const resultsCard = document.getElementById('results-card');
    if (!resultsCard) {
      return;
    }
    
    const resultsText = resultsCard.innerText;
    
    navigator.clipboard.writeText(resultsText).then(() => {
      alert('Results copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy results:', err);
    });
  }
}

// ES6 module export - no global variables
export default UIController;
