/**
 * MissionRegistry - Central Mission Catalog
 * 
 * Maintains the catalog of all available missions.
 * New missions register themselves here for automatic discovery.
 * 
 * Requirements: 2.1, 15.1, 15.2, 15.3, 15.5, 3A.12
 */

class MissionRegistry {
  constructor() {
    // Map of mission IDs to mission objects
    // No global variables - all state contained in instance
    this.missions = new Map();
  }

  /**
   * Register a new mission in the catalog
   * @param {Object} mission - Mission configuration object
   * @param {string} mission.id - Unique mission identifier
   * @param {string} mission.title - Display title of the mission
   * @param {string} mission.historicalDate - ISO format date (e.g., "1941-12-07")
   * @param {string} mission.era - Historical era (e.g., "Modern", "Ancient", "Medieval")
   * @param {Array} mission.roles - Array of playable role objects
   * @param {boolean} [mission.unlocked] - Whether mission is playable (defaults to false)
   * @param {string} [mission.teaser] - One-line description for timeline tooltip
   */
  register(mission) {
    // Validate required fields
    const requiredFields = ['id', 'title', 'historicalDate', 'era', 'roles'];
    const missingFields = requiredFields.filter(field => !mission[field]);
    
    if (missingFields.length > 0) {
      console.error(
        `MissionRegistry.register: Mission missing required fields: ${missingFields.join(', ')}`,
        mission
      );
      return;
    }

    // Validate roles is an array
    if (!Array.isArray(mission.roles)) {
      console.error(
        `MissionRegistry.register: Mission "${mission.id}" roles must be an array`,
        mission
      );
      return;
    }

    // Validate historicalDate is in ISO format (basic check)
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!isoDatePattern.test(mission.historicalDate)) {
      console.warn(
        `MissionRegistry.register: Mission "${mission.id}" historicalDate "${mission.historicalDate}" is not in ISO format (YYYY-MM-DD). Timeline positioning may be incorrect.`
      );
    }

    // Check for duplicate mission IDs
    if (this.missions.has(mission.id)) {
      console.warn(
        `MissionRegistry.register: Mission "${mission.id}" is already registered. Overwriting previous registration.`
      );
    }

    // Register the mission
    this.missions.set(mission.id, mission);
  }

  /**
   * Get a mission by its ID
   * @param {string} missionId - Unique mission identifier
   * @returns {Object|undefined} Mission object or undefined if not found
   */
  getMission(missionId) {
    if (typeof missionId !== 'string') {
      console.error('MissionRegistry.getMission: missionId must be a string');
      return undefined;
    }

    const mission = this.missions.get(missionId);
    
    if (!mission) {
      console.warn(`MissionRegistry.getMission: Mission "${missionId}" not found`);
    }

    return mission;
  }

  /**
   * Get all registered missions
   * @returns {Array} Array of all mission objects
   */
  getAllMissions() {
    return Array.from(this.missions.values());
  }

  /**
   * Get missions filtered by historical era
   * @param {string} era - Historical era to filter by (e.g., "Modern", "Ancient")
   * @returns {Array} Array of mission objects matching the era
   */
  getMissionsByEra(era) {
    if (typeof era !== 'string') {
      console.error('MissionRegistry.getMissionsByEra: era must be a string');
      return [];
    }

    return this.getAllMissions().filter(mission => mission.era === era);
  }
}

// ES6 module export - no global variables
export default MissionRegistry;
