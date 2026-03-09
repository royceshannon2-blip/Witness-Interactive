/**
 * AnalyticsTracker - Session Analytics Foundation
 * 
 * Tracks player session data for future analytics integration.
 * Logs all player actions, choices, consequence flags, and checkpoint responses.
 * Designed for easy integration with external analytics services in future versions.
 * 
 * Session data is logged to console as JSON for MVP.
 * No external analytics service integration in Phase 1.
 * 
 * Requirements: 26.1, 26.2, 26.3, 26.4
 */

class AnalyticsTracker {
  /**
   * Initialize the AnalyticsTracker
   * @param {EventBus} eventBus - Event bus for component communication
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
    
    // Session data structure
    this.sessionData = null;
    
    // Subscribe to all relevant EventBus events
    this.setupEventListeners();
  }

  /**
   * Subscribe to EventBus events for tracking player actions
   * @private
   */
  setupEventListeners() {
    // Track game start
    this.eventBus.on('game:start', () => this.startSession());
    
    // Track mission selection
    this.eventBus.on('mission:selected', (missionId) => {
      // missionId is a simple string
      this.sessionData.missionId = missionId;
      this.logAction('mission_selected', { missionId: missionId });
    });
    
    // Track role selection
    this.eventBus.on('role:selected', (data) => {
      // data is an object with missionId and roleId
      if (data && typeof data === 'object') {
        this.sessionData.missionId = data.missionId;
        this.sessionData.roleId = data.roleId;
        this.logAction('role_selected', { missionId: data.missionId, roleId: data.roleId });
      } else {
        // Fallback for simple string roleId (for backwards compatibility with tests)
        this.sessionData.roleId = data;
        this.logAction('role_selected', { roleId: data });
      }
    });
    
    // Track scene transitions
    this.eventBus.on('scene:transition', (data) => {
      this.logAction('scene_transition', { sceneId: data });
    });
    
    // Track player choices
    this.eventBus.on('choice:made', (data) => {
      this.logAction('choice_made', {
        sceneId: data.sceneId,
        choiceId: data.choiceId,
        consequences: data.consequences
      });
    });
    
    // Track game completion
    this.eventBus.on('game:complete', (data) => {
      this.logAction('game_complete', data);
    });
    
    // Track checkpoint completion
    this.eventBus.on('checkpoint:complete', (data) => {
      this.logAction('checkpoint_complete', {
        score: data.score,
        totalQuestions: data.totalQuestions,
        answers: data.answers
      });
      
      // End session when checkpoint is complete
      this.endSession();
    });
  }

  /**
   * Start tracking a new session
   * Initializes session data structure with unique ID and start time
   */
  startSession() {
    const sessionId = this.generateSessionId();
    const startTime = Date.now();
    
    this.sessionData = {
      sessionId: sessionId,
      startTime: startTime,
      endTime: null,
      duration: null,
      missionId: null,
      roleId: null,
      actions: [],
      choices: [],
      consequenceFlags: {},
      checkpointScore: null,
      checkpointAnswers: []
    };
    
    console.log('[AnalyticsTracker] Session started:', {
      sessionId: sessionId,
      startTime: new Date(startTime).toISOString()
    });
  }

  /**
   * End the current session
   * Calculates duration and logs final session summary
   * @private
   */
  endSession() {
    if (!this.sessionData) {
      console.warn('[AnalyticsTracker] No active session to end');
      return;
    }
    
    this.sessionData.endTime = Date.now();
    this.sessionData.duration = this.sessionData.endTime - this.sessionData.startTime;
    
    // Log final session summary to console
    console.log('[AnalyticsTracker] Session ended:', this.getSessionSummary());
    console.log('[AnalyticsTracker] Full session data (JSON):', this.exportSession());
  }

  /**
   * Log a player action
   * Records action type, data, and timestamp
   * @param {string} actionType - Type of action (e.g., 'choice_made', 'scene_transition')
   * @param {object} data - Action-specific data
   */
  logAction(actionType, data) {
    if (!this.sessionData) {
      console.warn('[AnalyticsTracker] No active session. Call startSession() first.');
      return;
    }
    
    const timestamp = Date.now();
    
    // Record action in actions array
    this.sessionData.actions.push({
      type: actionType,
      timestamp: timestamp,
      data: data
    });
    
    // Update session-level data based on action type
    switch (actionType) {
      case 'mission_selected':
        this.sessionData.missionId = data.missionId;
        break;
        
      case 'role_selected':
        this.sessionData.roleId = data.roleId;
        break;
        
      case 'choice_made':
        // Track choice in choices array
        this.sessionData.choices.push({
          sceneId: data.sceneId,
          choiceId: data.choiceId,
          timestamp: timestamp
        });
        
        // Update consequence flags
        if (data.consequences) {
          this.sessionData.consequenceFlags = {
            ...this.sessionData.consequenceFlags,
            ...data.consequences
          };
        }
        break;
        
      case 'checkpoint_complete':
        this.sessionData.checkpointScore = data.score;
        this.sessionData.checkpointAnswers = data.answers || [];
        break;
    }
  }

  /**
   * Get session summary
   * Returns high-level session information
   * @returns {object} Session summary object
   */
  getSessionSummary() {
    if (!this.sessionData) {
      return null;
    }
    
    return {
      sessionId: this.sessionData.sessionId,
      startTime: new Date(this.sessionData.startTime).toISOString(),
      endTime: this.sessionData.endTime ? new Date(this.sessionData.endTime).toISOString() : null,
      duration: this.sessionData.duration ? `${Math.round(this.sessionData.duration / 1000)}s` : null,
      missionId: this.sessionData.missionId,
      roleId: this.sessionData.roleId,
      totalChoices: this.sessionData.choices.length,
      consequenceFlags: this.sessionData.consequenceFlags,
      checkpointScore: this.sessionData.checkpointScore,
      totalActions: this.sessionData.actions.length
    };
  }

  /**
   * Export session data as JSON string
   * Returns complete session data for external analytics integration
   * @returns {string} JSON string of complete session data
   */
  exportSession() {
    if (!this.sessionData) {
      return null;
    }
    
    return JSON.stringify(this.sessionData, null, 2);
  }

  /**
   * Generate a unique session ID
   * Uses timestamp and random string for uniqueness
   * @returns {string} Unique session identifier
   * @private
   */
  generateSessionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `session_${timestamp}_${random}`;
  }
}

// ES6 module export - no global variables
export default AnalyticsTracker;
