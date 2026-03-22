/**
 * Haymarket Affair Mission — Mission Metadata
 *
 * Defines the Haymarket mission configuration including:
 * - Mission metadata (id, title, date, era, teaser)
 * - Available roles (Lucy Parsons, Karl Brenner, James Doyle)
 * - Historical ripple events (6 events, 1886–1938)
 * - Post-ripple synthesis question
 * - Knowledge checkpoint questions
 *
 * Architecture: Content layer only — no logic, no engine imports.
 * Registration with MissionRegistry happens in main.js.
 * Requirements: 1.1, 9.4, 20.1, 20.3
 */

import lucyParsons from './lucy-parsons.js';
import karlBrenner from './karl-brenner.js';
import jamesDoyle from './james-doyle.js';
import knowledgeQuestions from './knowledge-questions.js';

const haymarketMission = {
  id: 'haymarket-affair',
  title: 'The Haymarket Affair',
  historicalDate: '1886-05-04',
  era: 'Modern',
  unlocked: true,
  teaser: 'Chicago, 1886 — a bomb, a trial, and the birth of the labor movement',
  roleSelectionSubtitle: 'Three perspectives on the night that changed American labor',
  apUnits: ['Unit 6.5', 'Unit 6.6', 'Unit 7.1'],
  rippleSubtitle: 'The consequences of May 4th, 1886',

  roles: [
    {
      id: 'hm-lucy-parsons',
      name: 'Lucy Parsons',
      description: 'Labor organizer and editor — the voice of the movement',
      cardType: 'Chicago Police Department Surveillance File',
      initFlags: lucyParsons.initFlags,
      scenes: lucyParsons.scenes,
      outcomes: lucyParsons.outcomes
    },
    {
      id: 'hm-karl-brenner',
      name: 'Karl Brenner',
      description: 'German immigrant machinist — locked out of McCormick',
      cardType: 'McCormick Reaper Works Employee Record #2847',
      scenes: karlBrenner.scenes,
      outcomes: karlBrenner.outcomes
    },
    {
      id: 'hm-james-doyle',
      name: 'James Doyle',
      description: 'Pinkerton operative — undercover inside the IWPA',
      cardType: 'Pinkerton National Detective Agency Operative Assignment CHI-1886-114',
      scenes: jamesDoyle.scenes,
      outcomes: jamesDoyle.outcomes
    }
  ],

  historicalRipple: [
    {
      id: 'hm-ripple-01',
      date: '1886-08-20',
      title: 'Eight Defendants Sentenced — Four to Death',
      description: 'Judge Joseph Gary sentenced seven of the eight Haymarket defendants to death and one to fifteen years in prison. No defendant was proven to have thrown the bomb; the prosecution argued a conspiracy theory — that their speeches and writings had incited the unknown bomber. The Illinois Supreme Court and the United States Supreme Court both upheld the convictions on appeal.',
      apTheme: 'argumentation',
      spiceT: ['Political'],
      apUnit: 'Unit 6.5',
      animationDelay: 1000
    },
    {
      id: 'hm-ripple-02',
      date: '1887-11-11',
      title: 'Four Haymarket Martyrs Executed',
      description: 'August Spies, Albert Parsons, Adolph Fischer, and George Engel were hanged at the Cook County Jail on November 11, 1887. Louis Lingg died in his cell the night before — a blasting cap between his teeth. Samuel Fielden and Michael Schwab had their sentences commuted to life imprisonment. The executions made the defendants international symbols of labor martyrdom and accelerated the global labor movement.',
      apTheme: 'causation',
      spiceT: ['Political'],
      apUnit: 'Unit 6.5',
      animationDelay: 2000
    },
    {
      id: 'hm-ripple-03',
      date: '1889-07-14',
      title: "May Day Adopted as International Workers' Day",
      description: "The Second International, meeting in Paris on July 14, 1889, designated May 1st as International Workers' Day in explicit commemoration of the Haymarket martyrs and the eight-hour movement they died for. May Day is now observed in more than eighty countries as a labor holiday. It is not a federal holiday in the United States — the country where the movement began.",
      apTheme: 'continuity',
      spiceT: ['Social', 'Political'],
      apUnit: 'Unit 6.6',
      animationDelay: 3000
    },
    {
      id: 'hm-ripple-04',
      date: '1893-06-26',
      title: 'Governor Altgeld Pardons the Surviving Defendants',
      description: "Governor John Peter Altgeld of Illinois issued an 18,000-word pardon message on June 26, 1893, concluding that Judge Gary had conducted the trial with 'malicious ferocity,' that the jury had been improperly selected, and that no evidence connected any of the eight defendants to throwing the bomb. Altgeld knew the pardon would end his political career before he signed it. It did.",
      apTheme: 'argumentation',
      spiceT: ['Political'],
      apUnit: 'Unit 6.5',
      animationDelay: 4000
    },
    {
      id: 'hm-ripple-05',
      date: '1938-06-25',
      title: 'Fair Labor Standards Act Establishes Eight-Hour Workday',
      description: 'President Franklin Roosevelt signed the Fair Labor Standards Act on June 25, 1938, establishing the forty-hour workweek, federal minimum wage, and overtime pay protections for approximately eleven million American workers. The eight-hour workday that eighty thousand Chicago workers marched for on May 1, 1886 became federal law fifty-two years after the march — and thirty-seven years after Albert Parsons was hanged for demanding it.',
      apTheme: 'causation',
      spiceT: ['Economic', 'Political'],
      apUnit: 'Unit 7.1',
      animationDelay: 5000
    },
    {
      id: 'hm-ripple-06',
      date: '1919-01-01',
      title: 'Red Scare — The Haymarket Framework Intensifies',
      description: 'The anti-anarchist legal framework established at Haymarket — conspiracy charges, anti-immigrant framing, the equation of labor radicalism with foreign subversion — was intensified during the post-WWI Red Scare. The 1903 Immigration Act had already barred anarchists from entering the country. The Palmer Raids of 1919–1920 resulted in the arrest of thousands and the deportation of hundreds of labor organizers, using the same tools the Haymarket prosecution had pioneered.',
      apTheme: 'continuity',
      spiceT: ['Political', 'Social'],
      apUnit: 'Unit 7.1',
      animationDelay: 6000
    }
  ],

  postRippleQuestion: {
    questionType: 'synthesis',
    apSkill: 'argumentation',
    spiceT: ['Political', 'Economic', 'Social'],
    apUnit: 'Unit 6.6',
    question: 'Which of the following best explains the most significant long-term consequence of the Haymarket Affair for American labor and political history?',
    options: [
      {
        id: 'a',
        text: 'The Haymarket bombing permanently discredited the labor movement, preventing the passage of labor protections for decades',
        correct: false
      },
      {
        id: 'b',
        text: 'The Haymarket trial established a precedent for using conspiracy charges against labor organizers, while simultaneously galvanizing international labor solidarity and contributing to the eventual passage of the eight-hour workday',
        correct: true
      },
      {
        id: 'c',
        text: 'The Haymarket Affair had no lasting impact because the labor movement quickly recovered and achieved its goals within five years',
        correct: false
      },
      {
        id: 'd',
        text: 'The Haymarket bombing proved that anarchist violence was the primary obstacle to labor reform in the Gilded Age',
        correct: false
      }
    ],
    correctId: 'b',
    explanation: 'The correct answer models AP skill 6.D complexity: the Haymarket trial did establish a dangerous precedent (conspiracy charges without proof of individual guilt, upheld in Spies v. Illinois 1887), AND it galvanized international labor solidarity (May Day 1889) and contributed to the long arc toward the FLSA 1938. The event had contradictory effects — suppressing American labor organizing in the short term while energizing it internationally and in the long term.'
  },

  knowledgeQuestions: knowledgeQuestions
};

export default haymarketMission;
