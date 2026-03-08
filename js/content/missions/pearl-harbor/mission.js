/**
 * Pearl Harbor Mission - Mission Metadata
 * 
 * Defines the Pearl Harbor mission configuration including:
 * - Mission metadata (title, date, era, teaser)
 * - Available roles
 * - Historical ripple events
 * - Knowledge checkpoint questions
 * 
 * This is pure data - no logic, following architecture rules.
 * Registration with MissionRegistry happens in main.js during bootstrap.
 * 
 * Requirements: 3.3, 4.2, 3A.3
 */

import japaneseAviator from './japanese-aviator.js';
import americanSailor from './american-sailor.js';
import americanCivilian from './american-civilian.js';

/**
 * Pearl Harbor Mission Configuration
 * December 7, 1941 - The attack that brought America into World War II
 */
const pearlHarborMission = {
  // Unique mission identifier
  id: 'pearl-harbor',
  
  // Display title
  title: 'Pearl Harbor',
  
  // Historical date in ISO format (YYYY-MM-DD)
  historicalDate: '1941-12-07',
  
  // Historical era for timeline grouping
  era: 'Modern',
  
  // Mission is unlocked and playable
  unlocked: true,
  
  // One-line teaser for timeline tooltip
  teaser: 'Experience the attack that brought America into World War II from three perspectives',
  
  // Three playable roles
  roles: [
    {
      id: 'japanese-aviator',
      name: 'Japanese Naval Aviator',
      description: 'Pilot a Mitsubishi A6M Zero fighter in the first wave of the attack',
      scenes: japaneseAviator.scenes,
      outcomes: japaneseAviator.outcomes
    },
    {
      id: 'american-sailor',
      name: 'American Sailor (USS Arizona)',
      description: 'Serve aboard the USS Arizona during the surprise attack',
      scenes: americanSailor.scenes,
      outcomes: americanSailor.outcomes
    },
    {
      id: 'american-civilian',
      name: 'American Civilian',
      description: 'Experience the attack as a civilian living near Pearl Harbor',
      scenes: americanCivilian.scenes,
      outcomes: americanCivilian.outcomes
    }
  ],
  
  // Historical ripple events (will be populated in Task 14.1)
  historicalRipple: [],
  
  // Knowledge checkpoint questions (will be populated in Task 15.1)
  knowledgeQuestions: []
};

// Export pure data - registration happens in main.js
export default pearlHarborMission;
