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
import knowledgeQuestions from './knowledge-questions.js';

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
  
  // Historical ripple events showing long-term consequences
  // Each event: id, date, title, description, apTheme, animationDelay
  historicalRipple: [
    {
      id: 'ripple-01',
      date: 'December 8, 1941',
      title: 'United States Declares War on Japan',
      description: 'President Franklin D. Roosevelt delivers his "Day of Infamy" speech to Congress. The declaration passes with only one dissenting vote (388-1 in the House, 82-0 in the Senate), formally bringing America into World War II.',
      apTheme: 'causation',
      animationDelay: 800
    },
    {
      id: 'ripple-02',
      date: 'February 19, 1942',
      title: 'Executive Order 9066: Japanese American Internment',
      description: 'President Roosevelt signs Executive Order 9066, leading to the forced relocation and incarceration of approximately 120,000 Japanese Americans. Two-thirds were U.S. citizens. This action, driven by wartime hysteria and racial prejudice, would later be formally apologized for in 1988.',
      apTheme: 'continuity',
      animationDelay: 1600
    },
    {
      id: 'ripple-03',
      date: '1941-1945',
      title: 'Pacific Theater Campaign',
      description: 'The attack on Pearl Harbor triggers a four-year Pacific War spanning from the Aleutian Islands to Australia. Major battles include Midway, Guadalcanal, Iwo Jima, and Okinawa. Over 2.5 million Japanese and Allied forces perish in the conflict.',
      apTheme: 'causation',
      animationDelay: 2400
    },
    {
      id: 'ripple-04',
      date: 'August 6 & 9, 1945',
      title: 'Atomic Bombings of Hiroshima and Nagasaki',
      description: 'The United States drops atomic bombs on Hiroshima (August 6) and Nagasaki (August 9), killing an estimated 150,000-246,000 people. These remain the only uses of nuclear weapons in armed conflict. Japan announces surrender on August 15, 1945.',
      apTheme: 'causation',
      animationDelay: 3200
    },
    {
      id: 'ripple-05',
      date: 'September 2, 1945',
      title: 'Japan Surrenders: World War II Ends',
      description: 'Japan formally signs the instrument of surrender aboard the USS Missouri in Tokyo Bay, ending World War II. The war that began with Pearl Harbor concludes with Allied occupation of Japan, reshaping global geopolitics and ushering in the nuclear age.',
      apTheme: 'continuity',
      animationDelay: 4000
    },
    {
      id: 'ripple-06',
      date: '1945-Present',
      title: 'Post-War Legacy and Remembrance',
      description: 'Pearl Harbor becomes a symbol of American resilience and the cost of unpreparedness. The USS Arizona Memorial honors the 1,177 sailors who perished aboard the ship. The attack fundamentally transformed U.S. foreign policy from isolationism to global engagement.',
      apTheme: 'perspective',
      animationDelay: 4800
    },
    {
      id: 'ripple-07',
      date: '1945-Present',
      title: 'The Nuclear Age and Cold War',
      description: 'The atomic bombings that ended the Pacific War initiated the nuclear arms race and Cold War tensions. The fear of nuclear conflict shaped international relations for decades, leading to deterrence strategies, arms control treaties, and ongoing debates about nuclear ethics.',
      apTheme: 'continuity',
      animationDelay: 5600
    },
    {
      id: 'ripple-08',
      date: '1988',
      title: 'Civil Liberties Act: Reparations for Internment',
      description: 'President Ronald Reagan signs the Civil Liberties Act, formally apologizing for Japanese American internment and authorizing $20,000 payments to surviving detainees. The government acknowledges the actions were based on "race prejudice, war hysteria, and a failure of political leadership."',
      apTheme: 'perspective',
      animationDelay: 6400
    }
  ],
  
  // Knowledge checkpoint questions (will be populated in Task 15.1)
  knowledgeQuestions: knowledgeQuestions
};

// Export pure data - registration happens in main.js
export default pearlHarborMission;
