/**
 * Rwanda Genocide Mission - Mission Metadata
 * 
 * Defines the Rwanda Genocide mission configuration including:
 * - Mission metadata (title, date, era, teaser)
 * - Available roles
 * - Historical ripple events
 * - Knowledge checkpoint questions
 * 
 * This is pure data - no logic, following architecture rules.
 * Registration with MissionRegistry happens in main.js during bootstrap.
 * 
 * Requirements: US-1.1, US-1.2, US-1.3, US-7.1, US-7.2, TR-2.1
 */

import hutuModerate from './hutu-moderate.js';
import tutsiSurvivor from './tutsi-survivor.js';
import unPeacekeeper from './un-peacekeeper.js';
import knowledgeQuestions from './knowledge-questions.js';

/**
 * Rwanda Genocide Mission Configuration
 * April 6, 1994 - The 100 days that shook the world
 */
const rwandaMission = {
  // Unique mission identifier
  id: 'rwanda-genocide',
  
  // Display title
  title: 'Rwanda, 1994',
  
  // Historical date in ISO format (YYYY-MM-DD)
  historicalDate: '1994-04-06',
  
  // Historical era for timeline grouping
  era: 'Modern',
  
  // Mission is unlocked and playable
  unlocked: true,
  
  // One-line teaser for timeline tooltip
  teaser: 'Experience the 100 days that shook the world from three impossible perspectives',
  
  // Three playable roles
  roles: [
    {
      id: 'hutu-moderate',
      name: 'Hutu Moderate',
      description: 'Augustin, communal secretary in Kigali facing impossible choices',
      scenes: hutuModerate.scenes,
      outcomes: hutuModerate.outcomes
    },
    {
      id: 'tutsi-survivor',
      name: 'Tutsi Survivor',
      description: 'Immaculée, 19-year-old university student fighting to survive',
      scenes: tutsiSurvivor.scenes,
      outcomes: tutsiSurvivor.outcomes
    },
    {
      id: 'un-peacekeeper',
      name: 'UN Peacekeeper',
      description: 'Captain Marcus Webb, Canadian UNAMIR officer witnessing atrocities',
      scenes: unPeacekeeper.scenes,
      outcomes: unPeacekeeper.outcomes
    }
  ],
  
  // Historical ripple events showing long-term consequences
  // Each event: id, date, title, description, apTheme, animationDelay
  historicalRipple: [
    {
      id: 'rw-ripple-01',
      date: '1994-04-07',
      title: 'Moderate Leaders Assassinated',
      description: 'Within hours of the plane crash, presidential guards and Interahamwe militias systematically killed Prime Minister Agathe Uwilingiyimana and other moderate Hutu politicians. Roadblocks went up across Kigali. The genocide had begun.',
      apTheme: 'causation',
      animationDelay: 1000
    },
    {
      id: 'rw-ripple-02',
      date: '1994-04-21',
      title: 'UN Reduces UNAMIR to 270 Troops',
      description: 'After ten Belgian peacekeepers were murdered, the UN Security Council voted to cut UNAMIR from 2,500 to 270 troops. General Dallaire and remaining soldiers protected enclaves but could not stop the massacres spreading across Rwanda.',
      apTheme: 'perspective',
      animationDelay: 2000
    },
    {
      id: 'rw-ripple-03',
      date: '1994-04-06 to 1994-07-04',
      title: '100 Days: 500,000"“800,000 Killed',
      description: 'Between April and July 1994, extremist Hutu militias, soldiers, and ordinary citizens killed between 500,000 and 800,000 Tutsi and thousands of Hutu moderates. Machetes, clubs, and small arms. Churches became massacre sites. Identity cards determined life or death.',
      apTheme: 'complexity',
      animationDelay: 3000
    },
    {
      id: 'rw-ripple-04',
      date: '1994-07-04',
      title: 'RPF Captures Kigali',
      description: 'The Rwandan Patriotic Front, led by Paul Kagame, captured Kigali and ended the genocide. Two million Hutu refugees"”including many perpetrators"”fled to Zaire and Tanzania. The RPF formed a Government of National Unity.',
      apTheme: 'causation',
      animationDelay: 4000
    },
    {
      id: 'rw-ripple-05',
      date: '1994-11-08',
      title: 'International Criminal Tribunal Created',
      description: 'The UN Security Council established the International Criminal Tribunal for Rwanda (ICTR) in Arusha, Tanzania. Over 17 years, ICTR tried 69 cases, convicting 59 people including media leaders who broadcast hate propaganda.',
      apTheme: 'continuity',
      animationDelay: 5000
    },
    {
      id: 'rw-ripple-06',
      date: '2003-2004',
      title: '20,000 Detainees Released',
      description: 'Rwanda held 130,000 genocide suspects in overcrowded prisons. Facing a massive backlog, authorities released 20,000 lower-level detainees based on confessions or lack of evidence. Survivors feared renewed intimidation.',
      apTheme: 'complexity',
      animationDelay: 6000
    },
    {
      id: 'rw-ripple-07',
      date: '2005-2012',
      title: 'Gacaca Courts Conclude',
      description: 'Rwanda created 11,000 community gacaca courts with lay judges to try 1.2"“1.5 million genocide cases. Survivors testified publicly. Perpetrators confessed for reduced sentences. The system prioritized speed and coexistence over due process. Ethnic identity was banned from politics.',
      apTheme: 'continuity',
      animationDelay: 7000
    },
    {
      id: 'rw-ripple-08',
      date: '1994-Present',
      title: 'HÃ´tel des Mille Collines Legacy',
      description: 'The hotel where 1,200 people sheltered during the genocide became a symbol of survival and moral complexity. Paul Rusesabagina, the manager, was later convicted in Rwanda of terrorism charges. Debates over heroism, complicity, and memory continue.',
      apTheme: 'perspective',
      animationDelay: 8000
    }
  ],
  
  // Knowledge checkpoint questions (populated in Task 5)
  knowledgeQuestions: knowledgeQuestions
};

// Export pure data - registration happens in main.js
export default rwandaMission;
