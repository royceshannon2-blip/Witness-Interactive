/**
 * ConsequenceSystem - Player Decision Tracking
 * 
 * Tracks consequence flags set by player choices throughout the game session.
 * Supports both boolean flags (true/false) and numeric counters.
 * Subscribes to EventBus for choice:made events to automatically set flags.
 * 
 * Requirements: 6.1, 6.2, 6.4, 6.5, 20.1, 20.2
 */

class ConsequenceSystem {
  /**
   * Initialize the ConsequenceSystem
   * @param {EventBus} eventBus - Event bus for component communication
   */
  constructor(eventBus) {
    // Map to store consequence flags (no global variables)
    this.flags = new Map();
    
    // Store reference to event bus
    this.eventBus = eventBus;
    
    // Subscribe to choice:made events to automatically set flags
    this.eventBus.on('choice:made', this.handleChoiceMade.bind(this));
  }

  /**
   * Handle choice:made event from EventBus
   * Automatically sets consequence flags when a player makes a choice
   * @param {object} data - Event data containing choiceId and consequences
   * @private
   */
  handleChoiceMade(data) {
    if (!data || !data.consequences) {
      return; // No consequences to set
    }

    // Set all consequence flags from the choice
    const consequences = data.consequences;
    for (const [flagName, value] of Object.entries(consequences)) {
      this.setFlag(flagName, value);
    }
  }

  /**
   * Set a consequence flag
   * @param {string} flagName - Name of the flag to set
   * @param {boolean|number} value - Value to set (boolean or numeric)
   */
  setFlag(flagName, value) {
    // Validate flag name
    if (typeof flagName !== 'string') {
      console.error('ConsequenceSystem.setFlag: flagName must be a string');
      return;
    }

    // Validate value type (must be boolean or number)
    if (typeof value !== 'boolean' && typeof value !== 'number') {
      console.warn(`ConsequenceSystem.setFlag: Invalid value type for flag "${flagName}". Expected boolean or number, got ${typeof value}`);
      return;
    }

    // Set the flag
    this.flags.set(flagName, value);
  }

  /**
   * Get a flag value
   * @param {string} flagName - Name of the flag to retrieve
   * @returns {boolean|number|undefined} Flag value, or undefined if not set
   */
  getFlag(flagName) {
    return this.flags.get(flagName);
  }

  /**
   * Get all flags as an object
   * @returns {object} Object containing all flag name-value pairs
   */
  getAllFlags() {
    // Convert Map to plain object for easier consumption
    const flagsObject = {};
    for (const [key, value] of this.flags.entries()) {
      flagsObject[key] = value;
    }
    return flagsObject;
  }

  /**
   * Calculate outcome based on outcome rules
   * Evaluates consequence flags against predefined conditions
   * @param {object} outcomeRules - Rules defining outcome conditions
   * @returns {string} Outcome ID that matches the conditions
   */
  calculateOutcome(outcomeRules) {
    if (!outcomeRules || !Array.isArray(outcomeRules)) {
      console.error('ConsequenceSystem.calculateOutcome: outcomeRules must be an array');
      return null;
    }

    // Iterate through outcome rules and find the first match
    for (const rule of outcomeRules) {
      if (!rule.conditions || !rule.id) {
        console.warn('ConsequenceSystem.calculateOutcome: Invalid outcome rule (missing conditions or id)');
        continue;
      }

      // Check if all conditions are met
      const conditionsMet = this.evaluateConditions(rule.conditions);
      
      if (conditionsMet) {
        return rule.id;
      }
    }

    // No matching outcome found
    console.warn('ConsequenceSystem.calculateOutcome: No matching outcome found for current flags');
    return null;
  }

  /**
   * Evaluate if all conditions in a rule are met
   * @param {object} conditions - Object with flag names as keys and expected values
   * @returns {boolean} True if all conditions match current flags
   * @private
   */
  evaluateConditions(conditions) {
    for (const [flagName, expectedValue] of Object.entries(conditions)) {
      const actualValue = this.getFlag(flagName);
      
      // If flag is not set, condition fails
      if (actualValue === undefined) {
        return false;
      }

      // Check if actual value matches expected value
      if (actualValue !== expectedValue) {
        return false;
      }
    }

    // All conditions met
    return true;
  }

  /**
   * Reset all flags (for new game)
   * Clears all consequence flags from the current session
   */
  reset() {
    this.flags.clear();
  }
}

// ES6 module export - no global variables
export default ConsequenceSystem;
