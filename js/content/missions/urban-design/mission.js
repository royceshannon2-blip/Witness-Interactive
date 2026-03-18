/**
 * Urban Design Mission - Mission Metadata
 * 
 * Defines the Urban Design mission configuration including:
 * - Mission metadata (title, date, era, teaser)
 * - Available roles
 * - Historical ripple events
 * - Knowledge checkpoint questions
 * 
 * This is pure data - no logic, following architecture rules.
 * Registration with MissionRegistry happens in MissionRegistry.js.
 * 
 * Requirements: US-10, US-6, US-7
 */

import udResident from './ud-resident.js';
import knowledgeQuestions from './knowledge-questions.js';

/**
 * Urban Design Mission Configuration
 * June 28, 1934 - The National Housing Act creates lasting spatial inequality
 */
const urbanDesignMission = {
  // Unique mission identifier
  id: 'aphg-urban-design',
  
  // Display title
  title: 'The Divided City',
  
  // Historical date in ISO format (YYYY-MM-DD)
  // National Housing Act signing - "Patient Zero" for urban inequality
  historicalDate: '1934-06-28',
  
  // Historical era for timeline grouping
  era: 'Modern',
  
  // Mission is unlocked and playable
  unlocked: true,
  
  // One-line teaser for timeline tooltip
  teaser: 'Experience how 1930s housing policy created modern urban inequality',
  
  // Role selection screen subtitle
  roleSelectionSubtitle: 'Follow one property through three eras of urban development',
  
  // Single playable role
  roles: [
    {
      id: 'ud-resident',
      name: 'The Legacy Resident',
      description: 'Follow one property and family through 90 years of urban policy',
      scenes: udResident.scenes,
      outcomes: udResident.outcomes
    }
  ],
  
  // Historical ripple events showing long-term consequences
  // Each event: id, date, title, description, apTheme, animationDelay
  historicalRipple: [
    {
      id: 'ud-ripple-01',
      date: '1934-06-28',
      title: 'National Housing Act Formalizes Federal Redlining',
      description: 'President Roosevelt signed the National Housing Act, creating the Federal Housing Administration. Building on the Home Owners\' Loan Corporation established the prior year, the FHA formalized the neighborhood grading system that would deny mortgages across Black America for decades.',
      apTheme: 'causation',
      animationDelay: 1000
    },
    {
      id: 'ud-ripple-02',
      date: '1944-06-22',
      title: 'GI Bill Excludes Black Veterans',
      description: 'The GI Bill offered home loans to returning WWII veterans, but local banks and realtors denied Black veterans access to suburban housing. White veterans bought homes in Levittown and similar suburbs. Black veterans were steered to redlined urban areas. The wealth gap began: home equity became the primary wealth-building tool for white families.',
      apTheme: 'spatial-analysis',
      animationDelay: 2000
    },
    {
      id: 'ud-ripple-03',
      date: '1948-05-03',
      title: 'Shelley v. Kraemer Bans Racial Covenants',
      description: 'The Supreme Court ruled that courts could not enforce racial covenants in property deeds. However, the decision did not ban the covenants themselves, and informal discrimination continued. Redlining persisted through bank policies and realtor practices. The spatial pattern was already set.',
      apTheme: 'continuity',
      animationDelay: 3000
    },
    {
      id: 'ud-ripple-04',
      date: '1956-06-29',
      title: 'Interstate Highway Act Destroys Black Neighborhoods',
      description: 'The Federal-Aid Highway Act funded interstate highways through urban cores. Planners routed highways through Black neighborhoods, destroying homes and businesses. In city after city, I-95, I-10, I-5 cut through redlined districts. The highways created physical barriers, isolating communities and accelerating disinvestment.',
      apTheme: 'human-environment-interaction',
      animationDelay: 4000
    },
    {
      id: 'ud-ripple-05',
      date: '1968-04-11',
      title: 'Fair Housing Act Outlaws Discrimination',
      description: 'One week after Martin Luther King Jr.\'s assassination, Congress passed the Fair Housing Act, banning discrimination in housing sales and rentals. But the law could not undo 34 years of redlining. The wealth gap, the tax base erosion, the infrastructure neglect—all remained. Spatial inequality had become structural.',
      apTheme: 'continuity',
      animationDelay: 5000
    },
    {
      id: 'ud-ripple-06',
      date: '1990-01-01',
      title: 'New Urbanism Proposes Mixed-Use Development',
      description: 'Urban planners promoted New Urbanism: walkable neighborhoods, mixed-use development, public transit. The movement offered solutions to sprawl and car dependency. But in formerly redlined areas, "revitalization" often meant gentrification. Long-term residents faced displacement as property values rose.',
      apTheme: 'comparison',
      animationDelay: 6000
    },
    {
      id: 'ud-ripple-07',
      date: '2015-01-01',
      title: 'Environmental Justice Research Documents Heat Islands',
      description: 'Researchers mapped urban heat islands using satellite data. The pattern was clear: formerly redlined neighborhoods were 5°F to 12°F hotter than green-graded areas. Decades of disinvestment meant fewer trees, more asphalt, less green space. The 1930s maps predicted 21st-century temperatures.',
      apTheme: 'human-environment-interaction',
      animationDelay: 7000
    },
    {
      id: 'ud-ripple-08',
      date: '2024-01-01',
      title: 'The Wealth Gap Persists',
      description: 'Ninety years after the National Housing Act, the median white family holds 8 to 10 times the wealth of the median Black family. Most of that gap is home equity—denied in 1934, compounded over generations. The divided city remains divided. The question is no longer why, but what comes next.',
      apTheme: 'causation',
      animationDelay: 8000
    }
  ],
  
  // Knowledge checkpoint questions (populated from knowledge-questions.js)
  knowledgeQuestions: knowledgeQuestions
};

// Export pure data - registration happens in MissionRegistry.js
export default urbanDesignMission;
