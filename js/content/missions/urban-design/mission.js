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
      description: 'The Servicemen\'s Readjustment Act of 1944 provided low-interest home loans to returning veterans. Administration ran through local banks operating under FHA underwriting criteria, which continued to reference HOLC grade designations. Black veterans were denied access to suburban mortgage markets at documented rates. White veterans purchased homes in Levittown and comparable developments. Black veterans were directed to urban areas carrying D-grade designations. The Urban Institute (2018) estimates that differential home equity accumulation in this period accounts for a significant share of the current racial wealth disparity.',
      apTheme: 'spatial-analysis',
      animationDelay: 2000
    },
    {
      id: 'ud-ripple-03',
      date: '1948-05-03',
      title: 'Shelley v. Kraemer Bans Racial Covenants',
      description: 'The Supreme Court ruled in Shelley v. Kraemer that courts could not enforce racially restrictive covenants in property deeds. The decision did not prohibit the covenants themselves. The FHA Underwriting Manual had recommended restrictive covenants as a tool for maintaining neighborhood grade stability. Informal discrimination in lending and real estate practice continued. The spatial distribution of capital established by the HOLC grading system remained in effect.',
      apTheme: 'continuity',
      animationDelay: 3000
    },
    {
      id: 'ud-ripple-04',
      date: '1956-06-29',
      title: 'Interstate Highway Act Destroys Black Neighborhoods',
      description: 'The Federal-Aid Highway Act of 1956 funded interstate highway construction through urban cores. Route selection in multiple cities placed highways through neighborhoods carrying HOLC D-grade designations. The Federal Highway Administration\'s own post-construction studies documented displacement of residents and businesses, physical fragmentation of neighborhoods, and accelerated disinvestment in adjacent areas. In cities including Miami, New Orleans, and Syracuse, the highway corridors followed the boundaries of formerly redlined districts.',
      apTheme: 'human-environment-interaction',
      animationDelay: 4000
    },
    {
      id: 'ud-ripple-05',
      date: '1968-04-11',
      title: 'Fair Housing Act Outlaws Discrimination',
      description: 'The Fair Housing Act of 1968 prohibited discrimination in housing sales, rentals, and financing. The Act did not include a mechanism to reverse the capital distribution patterns established by 34 years of HOLC and FHA policy. The Federal Reserve Bank of Chicago (2017) documents that the racial wealth gap — primarily attributable to differential home equity accumulation — was already structurally embedded in the spatial distribution of property values, tax bases, and infrastructure investment.',
      apTheme: 'continuity',
      animationDelay: 5000
    },
    {
      id: 'ud-ripple-06',
      date: '1990-01-01',
      title: 'New Urbanism Proposes Mixed-Use Development',
      description: 'Urban planners and architects associated with the Congress for the New Urbanism promoted mixed-use, walkable neighborhood design as a response to suburban sprawl and urban disinvestment. Applied to formerly D-grade areas, mixed-use development increased property values and reduced heat island effects through green infrastructure. The National Low Income Housing Coalition documented that in comparable developments, market rents increased 20 to 40 percent within five years, displacing long-term residents who had remained through decades of reduced municipal services.',
      apTheme: 'comparison',
      animationDelay: 6000
    },
    {
      id: 'ud-ripple-07',
      date: '2015-01-01',
      title: 'Environmental Justice Research Documents Heat Islands',
      description: 'Researchers at the University of Richmond\'s Digital Scholarship Lab, Portland State University, and Virginia Commonwealth University published findings from the "Mapping Inequality" project and subsequent peer-reviewed studies. Hoffman, Shandas, and Pendleton (2020) overlaid digitized HOLC maps on satellite thermal imaging across 108 U.S. cities. Neighborhoods graded D in the 1930s recorded surface temperatures 5°F to 12°F higher than A-grade areas in the same cities. The mechanism: reduced tree canopy coverage and higher impervious surface ratios resulting from decades of reduced capital investment following the D-grade designation.',
      apTheme: 'human-environment-interaction',
      animationDelay: 7000
    },
    {
      id: 'ud-ripple-08',
      date: '2024-01-01',
      title: 'The Wealth Gap Persists',
      description: 'The Federal Reserve\'s Survey of Consumer Finances (2022) documents a median white family net worth of approximately $285,000 against a median Black family net worth of approximately $44,900. The Federal Reserve Bank of Chicago (2017) attributes a substantial portion of this disparity to differential home equity accumulation beginning in the 1930s. Most of the gap is in home equity — the primary intergenerational wealth transfer mechanism in postwar America, access to which was determined in significant part by HOLC grade designations assigned between 1935 and 1940.',
      apTheme: 'causation',
      animationDelay: 8000
    }
  ],
  
  // Knowledge checkpoint questions (populated from knowledge-questions.js)
  knowledgeQuestions: knowledgeQuestions
};

// Export pure data - registration happens in MissionRegistry.js
export default urbanDesignMission;
