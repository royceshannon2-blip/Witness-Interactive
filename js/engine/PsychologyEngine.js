/**
 * PsychologyEngine - Player Psychology Tracking System
 * 
 * Tracks four psychological scores throughout gameplay:
 * - Morale (State of Mind)
 * - Loyalty (Duty Rating)
 * - Awareness (Humanity/Moral Awareness)
 * - Composure (Under Pressure)
 * 
 * Calculates Teammate Grade and Personality Archetype at mission end.
 * 
 * Requirements: Psychology System
 */

class PsychologyEngine {
  constructor(eventBus) {
    this.eventBus = eventBus;
    
    // Current scores (0-100)
    this.scores = {
      morale: 50,
      loyalty: 50,
      awareness: 50,
      composure: 50
    };
    
    // History of all score changes
    this.history = [];
    
    // Current role ID (needed for archetype descriptions)
    this.currentRole = null;
  }

  /**
   * Initialize scores to 50 for a new session
   * Clear all history
   */
  init() {
    this.scores = {
      morale: 50,
      loyalty: 50,
      awareness: 50,
      composure: 50
    };
    this.history = [];
  }

  /**
   * Set the current role ID
   * @param {string} roleId - Role identifier
   */
  setCurrentRole(roleId) {
    this.currentRole = roleId;
  }

  /**
   * Apply score deltas from a choice's psychologyEffects
   * Clamps all scores to 0-100 after applying
   * Emits psychology:scores-updated event
   * @param {Object} psychologyEffects - { morale, loyalty, awareness, composure }
   * @param {string} sceneId - Scene ID where choice was made
   * @param {string} choiceId - Choice ID that was selected
   */
  applyEffects(psychologyEffects, sceneId, choiceId) {
    if (!psychologyEffects) return;

    // Apply deltas
    if (typeof psychologyEffects.morale === 'number') {
      this.scores.morale += psychologyEffects.morale;
    }
    if (typeof psychologyEffects.loyalty === 'number') {
      this.scores.loyalty += psychologyEffects.loyalty;
    }
    if (typeof psychologyEffects.awareness === 'number') {
      this.scores.awareness += psychologyEffects.awareness;
    }
    if (typeof psychologyEffects.composure === 'number') {
      this.scores.composure += psychologyEffects.composure;
    }

    // Clamp to 0-100
    this.scores.morale = Math.max(0, Math.min(100, this.scores.morale));
    this.scores.loyalty = Math.max(0, Math.min(100, this.scores.loyalty));
    this.scores.awareness = Math.max(0, Math.min(100, this.scores.awareness));
    this.scores.composure = Math.max(0, Math.min(100, this.scores.composure));

    // Record in history
    this.history.push({
      sceneId,
      choiceId,
      effects: { ...psychologyEffects },
      scoresAfter: { ...this.scores }
    });

    // Emit event
    this.eventBus.emit('psychology:scores-updated', {
      sceneId,
      choiceId,
      effects: psychologyEffects,
      scores: { ...this.scores }
    });
  }

  /**
   * Get current snapshot of all four scores
   * @returns {Object} { morale, loyalty, awareness, composure }
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
   * Calculate final Teammate Grade from score snapshot
   * Uses weighted average of scores
   * @param {Object} scores - Score snapshot
   * @param {Object} gradeConfig - Grade configuration from psychology-data.js
   * @returns {Object} { letter, label, description, scoreUsed }
   */
  calculateGrade(scores, gradeConfig) {
    // Calculate weighted average
    const weights = gradeConfig.weights;
    const compositeScore = 
      (scores.morale * weights.morale) +
      (scores.loyalty * weights.loyalty) +
      (scores.awareness * weights.awareness) +
      (scores.composure * weights.composure);

    // Find matching threshold
    const thresholds = gradeConfig.thresholds;
    for (const threshold of thresholds) {
      if (compositeScore >= threshold.min) {
        return {
          letter: threshold.letter,
          label: threshold.label,
          description: threshold.description,
          scoreUsed: Math.round(compositeScore)
        };
      }
    }

    // Fallback (should never reach here if thresholds include min: 0)
    return {
      letter: 'F',
      label: 'Unknown',
      description: 'Unable to calculate grade.',
      scoreUsed: Math.round(compositeScore)
    };
  }

  /**
   * Classify Personality Archetype from score pattern
   * @param {Object} scores - Score snapshot
   * @param {Array} archetypes - Archetype data from psychology-data.js
   * @param {string} role - Role ID for role-specific description
   * @returns {Object} { name, description, dominantTrait }
   */
  classifyArchetype(scores, archetypes, role) {
    // Find highest and lowest scores
    const scoreEntries = Object.entries(scores);
    scoreEntries.sort((a, b) => b[1] - a[1]);
    
    const highest = scoreEntries[0][0];
    const lowest = scoreEntries[scoreEntries.length - 1][0];
    const highestValue = scoreEntries[0][1];
    const lowestValue = scoreEntries[scoreEntries.length - 1][1];

    // Try to match archetype patterns
    for (const archetype of archetypes) {
      const pattern = archetype.dominantPattern;
      
      // Check if pattern matches
      let matches = true;
      
      for (const [trait, requirement] of Object.entries(pattern)) {
        if (requirement === 'highest' && trait !== highest) {
          matches = false;
          break;
        }
        if (requirement === 'lowest' && trait !== lowest) {
          matches = false;
          break;
        }
        if (requirement === 'high' && scores[trait] < 70) {
          matches = false;
          break;
        }
        if (requirement === 'low' && scores[trait] > 30) {
          matches = false;
          break;
        }
        if (requirement === 'mid' && (scores[trait] < 40 || scores[trait] > 60)) {
          matches = false;
          break;
        }
      }

      if (matches) {
        return {
          name: archetype.name,
          description: archetype.descriptions[role] || archetype.descriptions['japanese-aviator'],
          dominantTrait: highest
        };
      }
    }

    // Fallback: use highest score to determine archetype
    const fallbackArchetypes = {
      morale: 'The Idealist',
      loyalty: 'The Soldier',
      awareness: 'The Witness',
      composure: 'The Pragmatist'
    };

    return {
      name: fallbackArchetypes[highest] || 'The Realist',
      description: 'You navigated December 7th in your own way. Every path through history is unique.',
      dominantTrait: highest
    };
  }

  /**
   * Reset all scores and history
   * Call on role restart
   */
  reset() {
    this.init();
  }
}

export default PsychologyEngine;
