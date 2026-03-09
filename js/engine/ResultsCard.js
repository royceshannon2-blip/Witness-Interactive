/**
 * ResultsCard - Shareable Outcome Card Generator
 * 
 * Generates a shareable results summary card for social media and teacher verification.
 * Displays mission completion details, survival status, checkpoint score, and AP themes engaged.
 * Provides copy-to-clipboard functionality for easy sharing.
 * 
 * Card includes:
 * - Mission name and role played
 * - Survival status
 * - Knowledge checkpoint score
 * - Completion timestamp
 * - AP themes engaged during session
 * - Game title and call-to-action
 * 
 * Requirements: 22.1, 22.2, 22.3, 22.4, 22.5, 27.1, 27.2, 27.4, 27.5, 24.5
 */

class ResultsCard {
  /**
   * Initialize the ResultsCard
   * @param {EventBus} eventBus - Event bus for component communication
   * @param {AnalyticsTracker} analyticsTracker - Analytics tracker for session data
   * @param {MissionRegistry} missionRegistry - Mission registry for mission metadata
   */
  constructor(eventBus, analyticsTracker, missionRegistry) {
    this.eventBus = eventBus;
    this.analyticsTracker = analyticsTracker;
    this.missionRegistry = missionRegistry;
    
    // Store last generated card data for clipboard operations
    this.lastCardData = null;
  }

  /**
   * Generate results card HTML with session data
   * @param {object} sessionData - Session data from AnalyticsTracker, including outcome
   * @returns {string} HTML string for results card
   */
  generateCard(sessionData) {
    // Validate session data
    if (!sessionData) {
      console.error('ResultsCard.generateCard: No session data provided');
      return '<p>Error: Unable to generate results card. No session data available.</p>';
    }
    
    // Get session summary from AnalyticsTracker
    const summary = this.analyticsTracker.getSessionSummary();
    
    if (!summary) {
      console.error('ResultsCard.generateCard: Unable to get session summary');
      return '<p>Error: Unable to generate results card. Session summary not available.</p>';
    }
    
    // Get mission metadata
    const mission = this.missionRegistry.getMission(summary.missionId);
    
    if (!mission) {
      console.error(`ResultsCard.generateCard: Mission "${summary.missionId}" not found`);
      return '<p>Error: Mission data not found.</p>';
    }
    
    // Find role metadata
    const role = mission.roles.find(r => r.id === summary.roleId);
    
    if (!role) {
      console.error(`ResultsCard.generateCard: Role "${summary.roleId}" not found`);
      return '<p>Error: Role data not found.</p>';
    }
    
    // Extract survival status from outcome data (passed from UIController)
    const survived = sessionData.outcome ? sessionData.outcome.survived : true; // Default to true if outcome not provided
    
    // Get checkpoint score (from sessionData if provided, otherwise from summary)
    const checkpointScore = sessionData.score !== undefined ? sessionData.score : summary.checkpointScore;
    const totalQuestions = sessionData.totalQuestions !== undefined ? sessionData.totalQuestions : 3;
    
    // Calculate score percentage
    const scorePercentage = totalQuestions > 0 ? Math.round((checkpointScore / totalQuestions) * 100) : 0;
    
    // Get completion timestamp
    const completionTime = summary.endTime ? new Date(summary.endTime).toLocaleString() : new Date().toLocaleString();
    
    // Collect AP themes engaged during session
    const apThemes = this.collectApThemes(mission, summary.roleId);
    
    // Store card data for clipboard operations
    this.lastCardData = {
      missionTitle: mission.title,
      roleName: role.name,
      survived: survived,
      checkpointScore: checkpointScore,
      totalQuestions: totalQuestions,
      scorePercentage: scorePercentage,
      completionTimestamp: completionTime,
      apThemesEngaged: apThemes
    };
    
    // Generate HTML
    return this.renderCardHTML(this.lastCardData);
  }

  /**
   * Render results card HTML
   * @param {object} cardData - Card data object
   * @returns {string} HTML string
   * @private
   */
  renderCardHTML(cardData) {
    const survivalStatus = cardData.survived ? 'Survived' : 'Did Not Survive';
    const survivalClass = cardData.survived ? 'text-success' : 'text-danger';
    const scoreClass = cardData.scorePercentage >= 70 ? 'text-success' : 'text-warning';
    
    return `
      <div class="results-card-header">
        <h3 class="text-gold">Witness Interactive</h3>
        <h4>${cardData.missionTitle}</h4>
      </div>
      
      <div class="results-card-body mt-md">
        <div class="result-item">
          <span class="result-label">Role Played:</span>
          <span class="result-value">${cardData.roleName}</span>
        </div>
        
        <div class="result-item">
          <span class="result-label">Outcome:</span>
          <span class="result-value ${survivalClass}">${survivalStatus}</span>
        </div>
        
        <div class="result-item">
          <span class="result-label">Knowledge Score:</span>
          <span class="result-value ${scoreClass}">${cardData.checkpointScore}/${cardData.totalQuestions} (${cardData.scorePercentage}%)</span>
        </div>
        
        <div class="result-item">
          <span class="result-label">Completed:</span>
          <span class="result-value">${cardData.completionTimestamp}</span>
        </div>
        
        <div class="result-item">
          <span class="result-label">AP Themes Engaged:</span>
          <div class="ap-themes-list">
            ${cardData.apThemesEngaged.map(theme => `<span class="ap-theme-badge">${this.formatApTheme(theme)}</span>`).join('')}
          </div>
        </div>
      </div>
      
      <div class="results-card-footer mt-md">
        <p class="text-secondary text-center">Experience history through multiple perspectives</p>
        <p class="text-secondary text-center">Play at: <span class="text-gold">witness-interactive.github.io</span></p>
      </div>
    `;
  }

  /**
   * Collect all unique AP themes engaged during the role's scenes
   * @param {object} mission - Mission object
   * @param {string} roleId - Role ID
   * @returns {string[]} Array of unique AP theme names
   * @private
   */
  collectApThemes(mission, roleId) {
    const role = mission.roles.find(r => r.id === roleId);
    
    if (!role || !role.scenes) {
      return [];
    }
    
    // Collect all AP themes from all scenes
    const themes = new Set();
    
    role.scenes.forEach(scene => {
      if (scene.apThemes && Array.isArray(scene.apThemes)) {
        scene.apThemes.forEach(theme => themes.add(theme));
      }
    });
    
    // Convert Set to Array and sort alphabetically
    return Array.from(themes).sort();
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
   * Copy card text to clipboard
   * Generates plain text version of the results card for sharing
   * @returns {Promise<boolean>} Promise that resolves to true if copy succeeded
   */
  async copyCardText() {
    if (!this.lastCardData) {
      console.error('ResultsCard.copyCardText: No card data available');
      return false;
    }
    
    // Generate plain text version
    const textContent = this.generatePlainText(this.lastCardData);
    
    try {
      await navigator.clipboard.writeText(textContent);
      console.log('[ResultsCard] Results copied to clipboard');
      return true;
    } catch (err) {
      console.error('[ResultsCard] Failed to copy to clipboard:', err);
      return false;
    }
  }

  /**
   * Generate plain text version of results card
   * @param {object} cardData - Card data object
   * @returns {string} Plain text representation
   * @private
   */
  generatePlainText(cardData) {
    const survivalStatus = cardData.survived ? 'Survived' : 'Did Not Survive';
    const apThemesList = cardData.apThemesEngaged.map(theme => this.formatApTheme(theme)).join(', ');
    
    return `
WITNESS INTERACTIVE - ${cardData.missionTitle}

Role Played: ${cardData.roleName}
Outcome: ${survivalStatus}
Knowledge Score: ${cardData.checkpointScore}/${cardData.totalQuestions} (${cardData.scorePercentage}%)
Completed: ${cardData.completionTimestamp}

AP Themes Engaged: ${apThemesList}

Experience history through multiple perspectives
Play at: witness-interactive.github.io
    `.trim();
  }
}

// ES6 module export - no global variables
export default ResultsCard;
