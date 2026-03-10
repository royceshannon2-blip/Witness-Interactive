/**
 * PathClassifier - Data-Driven Path Classification
 * 
 * Pure utility for classifying player path variant from consequence flags
 * using data-driven rules. No state, no side effects, no EventBus coupling.
 * 
 * Requirements: Path Classification Logic
 */

class PathClassifier {
  /**
   * Classify path variant from consequence flags
   * @param {Object} consequenceFlags - Flags set by player choices
   * @param {Array} pathRules - Array of classification rules
   * @returns {string} 'compliance' | 'instinct' | 'witness'
   */
  static classify(consequenceFlags, pathRules) {
    if (!consequenceFlags || !pathRules) {
      return 'witness'; // Default fallback
    }

    const scores = {
      compliance: 0,
      instinct: 0,
      witness: 0
    };

    // Score each variant based on matching flags
    for (const rule of pathRules) {
      let matches = true;
      
      // Check if all required flags match
      if (rule.requiredFlags) {
        for (const [flagName, flagValue] of Object.entries(rule.requiredFlags)) {
          if (consequenceFlags[flagName] !== flagValue) {
            matches = false;
            break;
          }
        }
      }

      if (matches) {
        scores[rule.variant] += rule.weight;
      }
    }

    // Find variant with highest score
    let maxScore = 0;
    let winningVariant = 'witness'; // Default to witness on tie

    for (const [variant, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        winningVariant = variant;
      }
    }

    // Minimum threshold: variant must have at least weight 4
    if (maxScore < 4) {
      return 'witness';
    }

    return winningVariant;
  }

  /**
   * Get human-readable summary of path
   * @param {string} pathVariant - Path variant name
   * @returns {string} Summary text
   */
  static getSummary(pathVariant) {
    const summaries = {
      compliance: 'You followed orders and maintained discipline throughout the attack.',
      instinct: 'You acted on your conscience and broke protocol when it mattered.',
      witness: 'You observed the attack from a distance, bearing witness to history.'
    };
    return summaries[pathVariant] || 'Your path through the attack.';
  }

  /**
   * Get other available paths
   * @param {string} pathVariant - Current path variant
   * @returns {Array} Array of other path names
   */
  static getOtherPaths(pathVariant) {
    const allPaths = ['compliance', 'instinct', 'witness'];
    return allPaths.filter(p => p !== pathVariant);
  }
}

export default PathClassifier;
