/**
 * OutcomeGenerator - Personalized Outcome Generation
 * 
 * Generates personalized epilogue text based on player choices and consequence flags.
 * Reads flags from ConsequenceSystem and selects outcome template from outcomes.js.
 * 
 * Requirements: Outcome Generation
 */

class OutcomeGenerator {
  /**
   * Create OutcomeGenerator instance
   * @param {EventBus} eventBus - Event bus for component communication
   * @param {Object} outcomeTemplates - Outcome templates from outcomes.js
   * @param {Object} consequenceSystem - ConsequenceSystem for reading flags
   * @param {Object} pathClassifier - PathClassifier for path classification
   */
  constructor(eventBus, outcomeTemplates, consequenceSystem, pathClassifier) {
    this.eventBus = eventBus;
    this.outcomeTemplates = outcomeTemplates || {};
    this.consequenceSystem = consequenceSystem;
    this.pathClassifier = pathClassifier;
    
    // Subscribe to terminal scene event
    this.eventBus.on('scene:terminal', (data) => {
      this.generateOutcome(data);
    });
  }

  /**
   * Generate outcome based on flags and role
   * @param {Object} data - Scene terminal data with role and flags
   */
  generateOutcome(data) {
    if (!data || !data.role) {
      return;
    }

    const flags = this.consequenceSystem.getFlags();
    const pathVariant = this.classifyPath(flags);
    
    // Determine survival status
    const survived = this.determineSurvival(flags, data.role);
    
    // Get outcome template
    const templates = this.outcomeTemplates[data.role];
    if (!templates) {
      console.warn(`OutcomeGenerator: No templates for role ${data.role}`);
      return;
    }

    const pathTemplates = templates[pathVariant];
    if (!pathTemplates) {
      console.warn(`OutcomeGenerator: No templates for path ${pathVariant}`);
      return;
    }

    const survivalKey = survived ? 'survived' : 'killed';
    const outcome = pathTemplates[survivalKey];

    if (!outcome) {
      console.warn(`OutcomeGenerator: No outcome for ${data.role}/${pathVariant}/${survivalKey}`);
      return;
    }

    // Emit outcome generated event
    this.eventBus.emit('outcome:generated', {
      role: data.role,
      pathVariant,
      survived,
      epilogue: outcome.epilogue,
      historicalAnchor: outcome.historicalAnchor
    });
  }

  /**
   * Classify path variant from consequence flags
   * @param {Object} flags - Consequence flags
   * @returns {string} 'compliance' | 'instinct' | 'witness'
   */
  classifyPath(flags) {
    if (!this.pathClassifier) {
      return 'witness';
    }

    // Use PathClassifier to determine path
    // This would use the PATH_RULES from psychology-data.js
    return this.pathClassifier.classify(flags, []);
  }

  /**
   * Determine if player survived
   * @param {Object} flags - Consequence flags
   * @param {string} role - Player role
   * @returns {boolean} True if survived
   */
  determineSurvival(flags, role) {
    // Check role-specific survival flags
    if (role === 'japanese-aviator') {
      return !flags.killedInAction;
    } else if (role === 'american-sailor') {
      return !flags.diedOnArizona;
    } else if (role === 'american-civilian') {
      return !flags.civilianCasualty;
    }
    
    // Default: survived
    return true;
  }
}

export default OutcomeGenerator;
