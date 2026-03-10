/**
 * FeedbackSessionStore - Track survey display frequency per session
 *
 * Prevents survey fatigue by limiting how often the survey appears
 * for the same mission/role combination within a session.
 */

class FeedbackSessionStore {
  constructor() {
    // Map of "missionId:roleId" -> completion count
    this.completionCounts = new Map();
    
    // Map of "missionId:roleId" -> last survey timestamp
    this.lastSurveyShown = new Map();
  }

  /**
   * Record a mission completion
   * @param {string} missionId
   * @param {string} roleId
   */
  recordCompletion(missionId, roleId) {
    const key = `${missionId}:${roleId}`;
    const count = this.completionCounts.get(key) || 0;
    this.completionCounts.set(key, count + 1);
  }

  /**
   * Check if survey should be shown based on frequency settings
   * @param {string} missionId
   * @param {string} roleId
   * @param {number} frequency - Show every N completions
   * @returns {boolean}
   */
  shouldShowSurvey(missionId, roleId, frequency = 1) {
    const key = `${missionId}:${roleId}`;
    const count = this.completionCounts.get(key) || 0;
    
    // Show on first completion, then every N completions
    if (count === 0) return true;
    if (frequency <= 1) return true;
    
    return count % frequency === 0;
  }

  /**
   * Mark that survey was shown
   * @param {string} missionId
   * @param {string} roleId
   */
  markSurveyShown(missionId, roleId) {
    const key = `${missionId}:${roleId}`;
    this.lastSurveyShown.set(key, Date.now());
  }

  /**
   * Reset all tracking (for testing)
   */
  reset() {
    this.completionCounts.clear();
    this.lastSurveyShown.clear();
  }
}

export default FeedbackSessionStore;
