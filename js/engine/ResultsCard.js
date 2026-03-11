/**
 * ResultsCard - Shareable Outcome Card Generator
 * 
 * Generates a shareable results summary card for social media and teacher verification.
 * Displays mission completion details, survival status, checkpoint score, and AP themes engaged.
 * Provides copy-to-clipboard functionality for easy sharing.
 * 
 * Card includes:
 * - Mission name and role played
 * - Path taken (compliance/instinct/witness)
 * - Other available paths
 * - Teammate Grade (letter, label, description)
 * - Personality Archetype (name, role-specific description)
 * - Final psychology scores with bars
 * - Survival status and statistics
 * - Knowledge checkpoint score
 * - Completion timestamp
 * - AP themes engaged during session
 * - Educator note
 * - Game title and call-to-action
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 22.1, 22.2, 22.3, 22.4, 22.5, 27.1, 27.2, 27.4, 27.5, 24.5
 */

import PathClassifier from './PathClassifier.js';
import { PATH_RULES, GRADE_CONFIG, ARCHETYPES, HUD_LABELS } from '../content/missions/pearl-harbor/psychology-data.js';

class ResultsCard {
  /**
   * Initialize the ResultsCard
   * @param {EventBus} eventBus - Event bus for component communication
   * @param {AnalyticsTracker} analyticsTracker - Analytics tracker for session data
   * @param {MissionRegistry} missionRegistry - Mission registry for mission metadata
   * @param {PsychologyEngine} psychologyEngine - Psychology engine for scores and grades
   * @param {ConsequenceSystem} consequenceSystem - Consequence system for flags and survival data
   */
  constructor(eventBus, analyticsTracker, missionRegistry, psychologyEngine, consequenceSystem) {
    this.eventBus = eventBus;
    this.analyticsTracker = analyticsTracker;
    this.missionRegistry = missionRegistry;
    this.psychologyEngine = psychologyEngine;
    this.consequenceSystem = consequenceSystem;
    
    // Store last generated card data for clipboard operations
    this.lastCardData = null;
    
    // Track completed paths in session (no localStorage)
    this.completedPaths = new Set();
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
    
    // Get survival data if available
    const survivalData = sessionData.outcome && sessionData.outcome.survivalData ? sessionData.outcome.survivalData : null;
    
    // Get checkpoint score (from sessionData if provided, otherwise from summary)
    const checkpointScore = sessionData.score !== undefined ? sessionData.score : summary.checkpointScore;
    const totalQuestions = sessionData.totalQuestions !== undefined ? sessionData.totalQuestions : 3;
    
    // Calculate score percentage
    const scorePercentage = totalQuestions > 0 ? Math.round((checkpointScore / totalQuestions) * 100) : 0;
    
    // Get completion timestamp
    const completionTime = summary.endTime ? new Date(summary.endTime).toLocaleString() : new Date().toLocaleString();
    
    // Collect AP themes engaged during session
    const apThemes = this.collectApThemes(mission, summary.roleId);
    
    // Get path classification
    const consequenceFlags = this.consequenceSystem.getAllFlags();
    const pathVariant = PathClassifier.classify(consequenceFlags, PATH_RULES);
    const pathSummary = PathClassifier.getSummary(pathVariant);
    const otherPaths = PathClassifier.getOtherPaths(pathVariant);
    
    // Track completed path
    this.completedPaths.add(pathVariant);
    
    // Get psychology scores and grade
    const psychologyScores = this.psychologyEngine.getScores();
    const grade = this.psychologyEngine.calculateGrade(psychologyScores, GRADE_CONFIG);
    
    // Get archetype classification
    const archetype = this.psychologyEngine.classifyArchetype(psychologyScores, ARCHETYPES, summary.roleId);
    
    // Store card data for clipboard operations
    this.lastCardData = {
      missionTitle: mission.title,
      roleName: role.name,
      pathVariant: pathVariant,
      pathSummary: pathSummary,
      otherPaths: otherPaths,
      grade: grade,
      archetype: archetype,
      psychologyScores: psychologyScores,
      survived: survived,
      survivalData: survivalData,
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
    
    // Render survival stats panel if survival data available
    let survivalStatsHTML = '';
    if (cardData.survivalData) {
      const modifiersText = cardData.survivalData.modifiers && cardData.survivalData.modifiers.length > 0
        ? cardData.survivalData.modifiers.join(', ')
        : 'None';
      
      survivalStatsHTML = `
        <div class="survival-stats panel panel-parchment mt-sm">
          <h5>Survival Statistics</h5>
          <p><strong>Death Probability:</strong> ${Math.round(cardData.survivalData.deathChance * 100)}%</p>
          <p><strong>Modifiers Applied:</strong> ${modifiersText}</p>
        </div>
      `;
    }
    
    // Render psychology scores with bars
    const scoresHTML = Object.entries(cardData.psychologyScores).map(([key, value]) => {
      const label = HUD_LABELS[key] || key;
      return `
        <div class="score-bar-container">
          <div class="score-bar-label">${label}</div>
          <div class="score-bar">
            <div class="score-bar-fill" style="width: ${value}%"></div>
          </div>
          <div class="score-bar-value">${value}</div>
        </div>
      `;
    }).join('');
    
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
          <span class="result-label">Path Taken:</span>
          <span class="result-value">${this.formatPathVariant(cardData.pathVariant)}</span>
          <p class="path-summary text-secondary">${cardData.pathSummary}</p>
        </div>
        
        <div class="result-item">
          <span class="result-label">Other Available Paths:</span>
          <div class="other-paths-list">
            ${cardData.otherPaths.map(path => `<span class="path-badge">${this.formatPathVariant(path)}</span>`).join('')}
          </div>
        </div>
        
        <div class="result-item teammate-grade">
          <span class="result-label">Teammate Grade:</span>
          <div class="grade-display">
            <div class="grade-letter ${this.getGradeClass(cardData.grade.letter)}">${cardData.grade.letter}</div>
            <div class="grade-details">
              <div class="grade-label">${cardData.grade.label}</div>
              <p class="grade-description text-secondary">${cardData.grade.description}</p>
            </div>
          </div>
        </div>
        
        <div class="result-item personality-archetype">
          <span class="result-label">Personality Archetype:</span>
          <div class="archetype-display">
            <div class="archetype-name">${cardData.archetype.name}</div>
            <p class="archetype-description text-secondary">${cardData.archetype.description}</p>
          </div>
        </div>
        
        <div class="result-item final-scores">
          <span class="result-label">Final Psychology Scores:</span>
          <div class="scores-display mt-sm">
            ${scoresHTML}
          </div>
        </div>
        
        <div class="result-item">
          <span class="result-label">Outcome:</span>
          <span class="result-value ${survivalClass}">${survivalStatus}</span>
          ${survivalStatsHTML}
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
        
        <div class="educator-note mt-md">
          <p class="text-secondary"><em>Note for educators: This card demonstrates student engagement with AP History reasoning skills through interactive narrative. Psychology scores reflect decision-making patterns, not personality assessment.</em></p>
        </div>
      </div>
      
      <div class="results-card-footer mt-md">
        <p class="text-secondary text-center">Experience history through multiple perspectives</p>
        <p class="text-secondary text-center">Play at: <span class="text-gold">witness-interactive.github.io</span></p>
      </div>
    `;
  }
  
  /**
   * Format path variant for display
   * @param {string} pathVariant - Path variant identifier
   * @returns {string} Formatted path name
   * @private
   */
  formatPathVariant(pathVariant) {
    const pathNames = {
      'compliance': 'Compliance',
      'instinct': 'Instinct',
      'witness': 'Witness'
    };
    return pathNames[pathVariant] || pathVariant;
  }
  
  /**
   * Get CSS class for grade letter
   * @param {string} letter - Grade letter (A, B, C, D, F)
   * @returns {string} CSS class name
   * @private
   */
  getGradeClass(letter) {
    const gradeClasses = {
      'A': 'grade-a',
      'B': 'grade-b',
      'C': 'grade-c',
      'D': 'grade-d',
      'F': 'grade-f'
    };
    return gradeClasses[letter] || 'grade-default';
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
   * Supports native share API on mobile devices
   * @returns {Promise<boolean>} Promise that resolves to true if copy succeeded
   */
  async copyCardText() {
    if (!this.lastCardData) {
      console.error('ResultsCard.copyCardText: No card data available');
      return false;
    }
    
    // Generate plain text version
    const textContent = this.generatePlainText(this.lastCardData);
    
    // Emit share event for traction metrics
    this.eventBus.emit('share:clicked', { 
      roleId: this.lastCardData.roleId,
      pathVariant: this.lastCardData.pathVariant 
    });
    
    // Try native share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Witness Interactive: Pearl Harbor',
          text: textContent
        });
        console.log('[ResultsCard] Results shared via native API');
        
        // Show call-to-action modal after successful share
        this._showCallToActionModal();
        
        return true;
      } catch (err) {
        // User cancelled or share failed, fall through to clipboard
        if (err.name !== 'AbortError') {
          console.warn('[ResultsCard] Native share failed:', err);
        }
      }
    }
    
    // Fallback to clipboard (desktop or if native share unavailable)
    try {
      await navigator.clipboard.writeText(textContent);
      console.log('[ResultsCard] Results copied to clipboard');
      
      // Show call-to-action modal after successful copy
      this._showCallToActionModal();
      
      return true;
    } catch (err) {
      console.error('[ResultsCard] Failed to copy to clipboard:', err);
      return false;
    }
  }

  /**
   * Show call-to-action modal after sharing
   * @private
   */
  _showCallToActionModal() {
    // Delay modal appearance by 3 seconds as per design
    setTimeout(() => {
      const modal = document.createElement('div');
      modal.className = 'cta-modal-overlay';
      modal.innerHTML = `
        <div class="cta-modal-content">
          <h2>Help Us Improve Witness Interactive</h2>
          <p>Your feedback shapes the future of historical education games.</p>
          
          <div class="cta-buttons">
            <a href="https://forms.gle/placeholder" target="_blank" rel="noopener noreferrer" class="cta-btn cta-btn-primary" id="cta-survey">
              Take 2-Minute Survey
            </a>
            <a href="https://discord.gg/placeholder" target="_blank" rel="noopener noreferrer" class="cta-btn cta-btn-secondary" id="cta-discord">
              Join Our Discord Community
            </a>
          </div>
          
          <button class="cta-btn cta-btn-close" id="cta-close">Close</button>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Fade in
      requestAnimationFrame(() => {
        modal.style.opacity = '1';
      });
      
      // Track survey clicks
      const surveyBtn = modal.querySelector('#cta-survey');
      if (surveyBtn) {
        surveyBtn.addEventListener('click', () => {
          this.eventBus.emit('survey:clicked', { source: 'cta-modal' });
          console.log('[TRACTION] Survey link clicked');
        });
      }
      
      // Track Discord clicks
      const discordBtn = modal.querySelector('#cta-discord');
      if (discordBtn) {
        discordBtn.addEventListener('click', () => {
          this.eventBus.emit('discord:clicked', { source: 'cta-modal' });
          console.log('[TRACTION] Discord link clicked');
        });
      }
      
      // Close button
      const closeBtn = modal.querySelector('#cta-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          modal.style.opacity = '0';
          setTimeout(() => modal.remove(), 300);
        });
      }
      
      // Close on overlay click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.opacity = '0';
          setTimeout(() => modal.remove(), 300);
        }
      });
    }, 3000);
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
    const otherPathsList = cardData.otherPaths.map(path => this.formatPathVariant(path)).join(', ');
    
    // Format psychology scores
    const scoresText = Object.entries(cardData.psychologyScores)
      .map(([key, value]) => `${HUD_LABELS[key] || key}: ${value}`)
      .join(', ');
    
    // Format survival stats if available
    let survivalStatsText = '';
    if (cardData.survivalData) {
      const modifiersText = cardData.survivalData.modifiers && cardData.survivalData.modifiers.length > 0
        ? cardData.survivalData.modifiers.join(', ')
        : 'None';
      survivalStatsText = `\nDeath Probability: ${Math.round(cardData.survivalData.deathChance * 100)}%\nModifiers: ${modifiersText}`;
    }
    
    return `
WITNESS INTERACTIVE - ${cardData.missionTitle}

Role Played: ${cardData.roleName}
Path Taken: ${this.formatPathVariant(cardData.pathVariant)}
Path Summary: ${cardData.pathSummary}
Other Available Paths: ${otherPathsList}

Teammate Grade: ${cardData.grade.letter} - ${cardData.grade.label}
${cardData.grade.description}

Personality Archetype: ${cardData.archetype.name}
${cardData.archetype.description}

Final Psychology Scores: ${scoresText}

Outcome: ${survivalStatus}${survivalStatsText}
Knowledge Score: ${cardData.checkpointScore}/${cardData.totalQuestions} (${cardData.scorePercentage}%)
Completed: ${cardData.completionTimestamp}

AP Themes Engaged: ${apThemesList}

Note for educators: This card demonstrates student engagement with AP History reasoning skills through interactive narrative. Psychology scores reflect decision-making patterns, not personality assessment.

Experience history through multiple perspectives
Play at: witness-interactive.github.io
    `.trim();
  }
}

// ES6 module export - no global variables
export default ResultsCard;
