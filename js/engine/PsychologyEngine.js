/**
 * PsychologyEngine - Player Psychology Tracking System
 * 
 * Tracks four psychological dimensions throughout gameplay:
 * - Morale: State of mind and emotional resilience
 * - Loyalty: Duty to orders and unit
 * - Humanity: Compassion and moral concern
 * - Composure: Ability to stay calm under pressure
 * 
 * Calculates Teammate Grade and Personality Archetype based on final scores.
 * 
 * Requirements: Psychology System
 */

class PsychologyEngine {
  /**
   * Create PsychologyEngine instance
   * @param {EventBus} eventBus - Event bus for component communication
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
    
    // Current scores (0-100)
    this.scores = {
      morale: 50,
      loyalty: 50,
      humanity: 50,
      composure: 50
    };
    
    // History of score changes
    this.history = [];
    
    // Subscribe to events
    this.eventBus.on('scene:terminal', () => {
      this.calculateGradeAndArchetype();
    });
  }

  /**
   * Initialize scores to 50 for new session
   */
  init() {
    this.scores = {
      morale: 50,
      loyalty: 50,
      humanity: 50,
      composure: 50
    };
    this.history = [];
  }

  /**
   * Apply score deltas from choice
   * @param {Object} psychologyEffects - Delta object with morale, loyalty, humanity, composure
   */
  applyEffects(psychologyEffects) {
    if (!psychologyEffects) {
      return;
    }

    // Apply deltas and clamp to 0-100
    if (psychologyEffects.morale) {
      this.scores.morale = Math.max(0, Math.min(100, this.scores.morale + psychologyEffects.morale));
    }
    if (psychologyEffects.loyalty) {
      this.scores.loyalty = Math.max(0, Math.min(100, this.scores.loyalty + psychologyEffects.loyalty));
    }
    if (psychologyEffects.humanity) {
      this.scores.humanity = Math.max(0, Math.min(100, this.scores.humanity + psychologyEffects.humanity));
    }
    if (psychologyEffects.composure) {
      this.scores.composure = Math.max(0, Math.min(100, this.scores.composure + psychologyEffects.composure));
    }

    // Emit update event
    this.eventBus.emit('psychology:scores-updated', {
      effects: psychologyEffects,
      scores: { ...this.scores }
    });
  }

  /**
   * Get current score snapshot
   * @returns {Object} Current scores
   */
  getScores() {
    return { ...this.scores };
  }

  /**
   * Get score change history
   * @returns {Array} Array of ChoiceImpact objects
   */
  getHistory() {
    return [...this.history];
  }

  /**
   * Calculate Teammate Grade from scores
   * @param {Object} scores - Score snapshot
   * @param {Object} gradeConfig - Grade configuration with thresholds
   * @returns {Object} Grade result with letter, label, description
   */
  calculateGrade(scores, gradeConfig) {
    if (!gradeConfig || !gradeConfig.thresholds) {
      return { letter: 'C', label: 'Average', description: 'You performed adequately.' };
    }

    // Calculate weighted average
    const weights = gradeConfig.weights || {
      morale: 0.30,
      loyalty: 0.25,
      humanity: 0.30,
      composure: 0.15
    };

    const composite = 
      (scores.morale * weights.morale) +
      (scores.loyalty * weights.loyalty) +
      (scores.humanity * weights.humanity) +
      (scores.composure * weights.composure);

    // Find matching threshold
    for (const threshold of gradeConfig.thresholds) {
      if (composite >= threshold.min) {
        return {
          letter: threshold.letter,
          label: threshold.label,
          description: threshold.description,
          scoreUsed: Math.round(composite)
        };
      }
    }

    return { letter: 'F', label: 'Failed', description: 'You did not survive.' };
  }

  /**
   * Classify Personality Archetype from scores
   * @param {Object} scores - Score snapshot
   * @param {Array} archetypes - Array of archetype definitions
   * @param {string} role - Current role for role-specific descriptions
   * @returns {Object} Archetype result with name, description, dominantTrait
   */
  classifyArchetype(scores, archetypes, role) {
    if (!archetypes || archetypes.length === 0) {
      return { name: 'The Survivor', description: 'You made it through.' };
    }

    // Find dominant trait
    let dominantTrait = 'morale';
    let maxScore = scores.morale;

    for (const [trait, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        dominantTrait = trait;
      }
    }

    // Find matching archetype
    for (const archetype of archetypes) {
      if (this.matchesPattern(scores, archetype.dominantPattern)) {
        return {
          name: archetype.name,
          description: archetype.descriptions[role] || archetype.descriptions.default || archetype.name,
          dominantTrait
        };
      }
    }

    // Default archetype
    return {
      name: 'The Survivor',
      description: 'You made it through December 7th.',
      dominantTrait
    };
  }

  /**
   * Check if scores match archetype pattern
   * @private
   */
  matchesPattern(scores, pattern) {
    if (!pattern) return false;

    for (const [trait, condition] of Object.entries(pattern)) {
      const score = scores[trait];
      
      if (condition === 'highest') {
        // Check if this is the highest score
        const isHighest = Object.values(scores).every(s => s <= score);
        if (!isHighest) return false;
      } else if (condition === 'high') {
        if (score < 65) return false;
      } else if (condition === 'mid') {
        if (score < 35 || score > 65) return false;
      } else if (condition === 'low') {
        if (score >= 35) return false;
      } else if (condition === 'lowest') {
        const isLowest = Object.values(scores).every(s => s >= score);
        if (!isLowest) return false;
      }
    }

    return true;
  }

  /**
   * Calculate grade and archetype on scene terminal
   * @private
   */
  calculateGradeAndArchetype() {
    // This will be called by event listener
    // Actual calculation happens in dependent components
  }

  /**
   * Reset all scores and history
   */
  reset() {
    this.init();
  }
}

export default PsychologyEngine;
