/**
 * Haymarket Affair Mission — Karl Brenner Role
 *
 * Six scenes spanning April through August 1886.
 * Karl Brenner: German immigrant machinist, McCormick Reaper Works Employee Record #2847.
 *
 * Architecture: Content layer only — no logic, no engine imports.
 * Requirements: 11.1, 11.8, 19.5, 19.6
 */

const karlBrennerScenes = [
  {
    id: 'hm-kb-scene-01',
    narrative: `The tenement room on Blue Island Avenue smells of coal smoke and boiled cabbage. The window faces the alley. Through it, in the evenings, you can hear the sound of the McCormick plant — the distant clang of metal on metal, the hiss of steam — even though the plant has been locked since February.

You are reading the Arbeiter-Zeitung by lamplight. The German type is dense and close. Heinrich Müller sits across the table from you, his machinist's hands wrapped around a tin cup. He has been locked out the same as you — same plant, same gate, same foreman who told you both not to come back until you signed the new contract.

The paper reports that eighty thousand workers across Chicago have pledged to strike on May first if the eight-hour demand is not met. The number is printed in bold. Eighty thousand.

Heinrich sets down his cup. He says the number in German, slowly, as if testing its weight. Achtzigtausend.

You have worked the McCormick plant for four years. You came from Württemberg in 1882 with a machinist's certificate and forty dollars. You have sent money home every month. You know the sound of every machine on the floor. You know which foremen are fair and which ones are not.

The Arbeiter-Zeitung says the time has come. The question is what you do with that.`,
    apThemes: ['contextualization', 'perspective'],
    apKeyConcept: 'KC-5.2.I',
    apUnit: 'Unit 6.5',
    spiceT: ['Economic', 'Cultural', 'Technological'],
    atmosphericEffect: null,
    ambientTrack: 'hm-ambient-westside-evening.mp3',
    narratorAudio: 'audio/narration/karl-brenner/hm-kb-scene-01.mp3',
    stimuliUnlock: ['hm-doc-1a', 'hm-doc-1b'],
    predictionQuestion: null,
    timedChoice: null,
    deathCheckpoint: false,
    choices: [
      {
        id: 'hm-kb-choice-01-a',
        text: 'Read the Arbeiter-Zeitung aloud to Heinrich — the numbers need to be heard out loud.',
        consequences: {
          hm_kb_read_arbeiter: true,
          hm_kb_solidarity_with_heinrich: true
        },
        psychologyEffects: { morale: +8, loyalty: +5, humanity: +5 },
        nextScene: 'hm-kb-scene-02'
      },
      {
        id: 'hm-kb-choice-01-b',
        text: 'Keep reading quietly. You have a family to think about. Eighty thousand is someone else\'s number.',
        consequences: {
          hm_kb_stayed_quiet: true
        },
        psychologyEffects: { morale: -5, composure: +8 },
        nextScene: 'hm-kb-scene-02'
      }
    ]
  },
  {
    id: 'hm-kb-scene-02',
    narrative: `May first, 1886. You are on Michigan Avenue and the street is full of people as far as you can see in both directions.

Heinrich is beside you. He is wearing his good coat — the one he keeps for church — because he said this is the kind of day that deserves a good coat. You did not argue with him.

The march is not loud the way you expected. It is steady. The sound of it is boots on pavement, thousands of them, and the occasional voice calling out a number — eight hours for work, eight hours for rest, eight hours for what we will. The chant moves through the crowd in waves, in German and English and Polish and Czech, the same words in different mouths.

You pass the Tribune building on Dearborn Street. Men in suits watch from the upper windows. You do not look away from them.

Heinrich says he has never seen anything like this. You tell him you have not either. You came from a country where workers organized and were broken for it. You came here because you thought it would be different.

The march turns south on State Street. The crowd is still moving behind you, still coming, still filling the street. Eighty thousand was the number in the paper. Standing inside it, you believe it.`,
    apThemes: ['causation', 'continuity'],
    apKeyConcept: 'KC-5.1.I',
    apUnit: 'Unit 6.5',
    spiceT: ['Social', 'Economic'],
    atmosphericEffect: null,
    ambientTrack: 'hm-ambient-haymarket-crowd.mp3',
    narratorAudio: 'audio/narration/karl-brenner/hm-kb-scene-02.mp3',
    stimuliUnlock: ['hm-doc-2'],
    predictionQuestion: null,
    timedChoice: null,
    deathCheckpoint: false,
    choices: [
      {
        id: 'hm-kb-choice-02-a',
        text: 'March at the front with Heinrich — be visible, be counted.',
        consequences: {
          hm_kb_marched_front: true,
          hm_kb_attended_march: true
        },
        psychologyEffects: { morale: +10, loyalty: +10, humanity: +3, composure: -5 },
        nextScene: 'hm-kb-scene-03'
      },
      {
        id: 'hm-kb-choice-02-b',
        text: 'Stay near the back. You want to be here, but you do not want your name on a list.',
        consequences: {
          hm_kb_attended_march: true
        },
        psychologyEffects: { morale: +5, loyalty: +3, composure: +5 },
        nextScene: 'hm-kb-scene-03'
      }
    ]
  },
  {
    id: 'hm-kb-scene-03',
    narrative: `May third. The McCormick plant has been running again for two days — scab labor, men brought in from outside the city. You and Heinrich came to the gates this morning with the other locked-out workers. Not to fight. To stand there. To be seen.

The Pinkerton guards are on the other side of the fence. You can see their badges. The police arrived an hour ago and formed a line on Blue Island Avenue.

At two o'clock in the afternoon, the scab workers begin to leave the plant. Someone throws a stone. You do not see who. Then another stone, and then the police line moves forward and the Pinkerton guards come through the gate and the sound changes — it becomes something you have no word for in German or English.

The shots come from the police line. You see a man go down ten feet to your left. You see another man running with his hand pressed to his side. Heinrich grabs your arm.

The shooting lasts less than a minute. When it stops, there are men on the ground who are not getting up. The police are still in their line. The Pinkerton guards have gone back through the gate.

You are standing in the same place you were standing before. Nothing has changed except that some of the men who were standing near you are now on the ground.`,
    apThemes: ['causation', 'complexity'],
    apKeyConcept: 'KC-5.1.II',
    apUnit: 'Unit 6.5',
    spiceT: ['Political', 'Economic'],
    atmosphericEffect: 'shake',
    ambientTrack: 'hm-ambient-streets-morning.mp3',
    narratorAudio: 'audio/narration/karl-brenner/hm-kb-scene-03.mp3',
    stimuliUnlock: [],
    predictionQuestion: {
      question: 'You have just seen workers shot at the McCormick gates. What do you predict will happen next?',
      options: [
        { id: 'a', text: 'The police will be held accountable and the strike will be settled through negotiation.' },
        { id: 'b', text: 'Workers will call a mass protest meeting to respond to the shootings.' },
        { id: 'c', text: 'The labor movement will collapse — workers will be too afraid to organize further.' },
        { id: 'd', text: 'McCormick management will offer to rehire the locked-out workers to prevent further violence.' }
      ],
      reveal: 'August Spies witnessed the McCormick shooting from the crowd. That evening, May 3rd, he wrote the Revenge Circular — a document calling workers to arms and announcing a protest meeting at Haymarket Square for the following night. The shooting did not end the movement. It accelerated it. The Haymarket meeting was the direct causal link between employer violence at the McCormick gates and the police response that would end the eight-hour movement in Chicago for a generation.'
    },
    timedChoice: null,
    deathCheckpoint: false,
    choices: [
      {
        id: 'hm-kb-choice-03-a',
        text: 'Go to the men on the ground — some of them may still be alive.',
        consequences: {
          hm_kb_helped_wounded: true
        },
        psychologyEffects: { humanity: -3, loyalty: +5, composure: -8 },
        nextScene: 'hm-kb-scene-04'
      },
      {
        id: 'hm-kb-choice-03-b',
        text: 'Pull Heinrich away from the gates before the police turn on the rest of the crowd.',
        consequences: {
          hm_kb_protected_heinrich: true
        },
        psychologyEffects: { morale: +5, loyalty: +15, humanity: +3, composure: +5 },
        nextScene: 'hm-kb-scene-04'
      }
    ]
  },
  {
    id: 'hm-kb-scene-04',
    narrative: `The Revenge Circular arrives that evening. Someone slides it under the door of the tenement — you find it when you come back from the pump. The paper is cheap and the ink is still slightly wet at the edges.

You read it standing in the doorway. The German is direct and unadorned. It says: Workingmen, to Arms. It says: Your masters sent out their bloodhounds — the police — they killed six of your brothers at McCormick's this afternoon. It says: To arms we call you, to arms.

Heinrich comes up the stairs behind you. He reads it over your shoulder. He is quiet for a long time.

The circular says there will be a meeting tomorrow night at Haymarket Square. August Spies will speak. Albert Parsons will speak. It says to come armed and ready to defend yourselves.

You think about the men on the ground at the McCormick gates this afternoon. You think about the police line that did not move until it moved forward. You think about the four years you have worked in this city, the money you have sent home, the machinist's certificate that is worth nothing when the gate is locked.

Heinrich folds the circular and puts it in his coat pocket. He says he is going. He asks if you are coming.`,
    apThemes: ['causation', 'perspective'],
    apKeyConcept: 'KC-5.1.I',
    apUnit: 'Unit 6.5',
    spiceT: ['Political', 'Social'],
    atmosphericEffect: null,
    ambientTrack: 'hm-ambient-westside-evening.mp3',
    narratorAudio: 'audio/narration/karl-brenner/hm-kb-scene-04.mp3',
    stimuliUnlock: ['hm-doc-3'],
    predictionQuestion: null,
    timedChoice: null,
    deathCheckpoint: false,
    choices: [
      {
        id: 'hm-kb-choice-04-a',
        text: 'Go with Heinrich to the Haymarket meeting.',
        consequences: {
          hm_kb_attended_haymarket: true
        },
        psychologyEffects: { morale: +8, loyalty: +10, humanity: +5, composure: -5 },
        nextScene: 'hm-kb-scene-05'
      },
      {
        id: 'hm-kb-choice-04-b',
        text: 'Stay home. You have seen what happens when workers stand in front of police lines.',
        consequences: {
          hm_kb_stayed_home: true
        },
        psychologyEffects: { morale: -8, loyalty: -3, composure: +10 },
        nextScene: 'hm-kb-scene-05'
      }
    ]
  },
  {
    id: 'hm-kb-scene-05',
    narrative: `Haymarket Square, May fourth, evening. Three thousand people around the barrels and boxes that serve as a platform at the corner of Randolph and Desplaines. August Spies spoke first. Then Albert Parsons. Now Samuel Fielden is speaking, his black hat visible above the crowd, his voice carrying over the sound of the wind coming in from the lake.

Heinrich is beside you. The crowd has thinned since the rain began to threaten. Mayor Harrison rode through on horseback an hour ago and left. The meeting has been peaceful.

Then from the south, on Desplaines Street, the sound of boots in formation. Four hundred police officers in platoons, filling the street from gutter to gutter. The gas lamps on Randolph Street catch their badges and buttons.

The police captain orders the meeting to disperse. Fielden says the meeting is peaceful. The captain insists.

Then the light — a streak of fire from somewhere near the Crane Brothers building, low and fast, and then the explosion that rattles every window on the block. The smoke rises from the intersection. The screaming starts.

Heinrich's hand finds your arm in the dark. The police are firing into the crowd. People are running in every direction. The cobblestones are wet and the gas lamps are still burning and the street is filling with people who are falling and not getting up.

You cannot see where Heinrich is anymore.`,
    apThemes: ['causation', 'complexity'],
    apKeyConcept: 'KC-5.1.I',
    apUnit: 'Unit 6.5',
    spiceT: ['Political', 'Social'],
    atmosphericEffect: 'shake',
    ambientTrack: 'hm-ambient-chaos.mp3',
    narratorAudio: 'audio/narration/karl-brenner/hm-kb-scene-05.mp3',
    stimuliUnlock: ['hm-doc-4'],
    predictionQuestion: null,
    timedChoice: { enabled: true, duration: 12000, defaultChoice: 'hm-kb-choice-05-b' },
    deathCheckpoint: false,
    choices: [
      {
        id: 'hm-kb-choice-05-a',
        text: 'Push back through the crowd to find Heinrich — you are not leaving without him.',
        consequences: {
          hm_kb_searched_for_heinrich: true,
          // hm_kb_arrested: historically, arrests of crowd members occurred the morning of May 5th —
          // this flag represents being identified by police at the square, leading to arrest next morning
          hm_kb_arrested: true
        },
        psychologyEffects: { morale: 0, loyalty: +15, humanity: +5, composure: -10 },
        nextScene: 'hm-kb-scene-06'
      },
      {
        id: 'hm-kb-choice-05-b',
        text: 'Get out through the alley on Randolph Street — Heinrich knows the way home.',
        consequences: {
          hm_kb_escaped_arrest: true
        },
        psychologyEffects: { morale: -5, loyalty: +3, composure: +10 },
        nextScene: 'hm-kb-scene-06'
      },
      {
        id: 'hm-kb-choice-05-c',
        text: 'Leave Chicago tonight. You know what comes next for German workers whose names are in the papers.',
        consequences: {
          hm_kb_fled_chicago: true
        },
        psychologyEffects: { morale: -10, loyalty: -5, composure: +5 },
        nextScene: 'hm-kb-scene-06'
      }
    ]
  },
  {
    id: 'hm-kb-scene-06',
    narrative: `The arrests begin the morning of May fifth and do not stop for weeks. The newspapers call it a conspiracy. They print the names of the defendants — Spies, Parsons, Fischer, Engel, Fielden, Schwab, Neebe, Lingg — and they print the word "anarchist" next to each name the way you would print a verdict.

The city is different now. On Blue Island Avenue, men speak German more quietly than they did before. The Arbeiter-Zeitung has been raided. The IWPA meeting hall is closed. Men you know from the march, from the plant, from the tenement — some of them have been picked up. Some of them have not come back.

You sit in the room on Blue Island Avenue. The Revenge Circular is still in your coat pocket. You have not thrown it away. You are not sure why.

The question that the city is asking — the question that the newspapers are asking, that the police are asking, that the courts will spend the next three months asking — is whether the men who organized the meeting are responsible for the bomb. You were there. You know what you saw.

The question that you are asking is different. It is about what you do with your name, your language, your four years in this city, the machinist's certificate that is worth nothing when the gate is locked. It is about whether you stay or go. Whether you keep what you are or become something the city will accept.`,
    apThemes: ['continuity', 'perspective'],
    apKeyConcept: 'KC-5.4.I',
    apUnit: 'Unit 6.5',
    spiceT: ['Political', 'Social'],
    atmosphericEffect: null,
    ambientTrack: 'hm-ambient-courtroom.mp3',
    narratorAudio: 'audio/narration/karl-brenner/hm-kb-scene-06.mp3',
    stimuliUnlock: [],
    predictionQuestion: null,
    timedChoice: null,
    deathCheckpoint: false,
    choices: [
      {
        id: 'hm-kb-choice-06-a',
        text: 'Stay in Chicago. Keep your name, your language, your identity. Let them come if they come.',
        consequences: {
          hm_kb_stayed_chicago: true,
          hm_kb_kept_identity: true
        },
        psychologyEffects: { morale: +10, loyalty: +10, humanity: +10, composure: -5 },
        nextScene: 'outcome'
      },
      {
        id: 'hm-kb-choice-06-b',
        text: 'Anglicize your name. Speak English at the market. Become someone the city will not notice.',
        consequences: {
          hm_kb_assimilated: true
        },
        psychologyEffects: { morale: -8, loyalty: -5, humanity: -3, composure: +8 },
        nextScene: 'outcome'
      }
    ]
  }
];

const karlBrennerOutcomes = [
  {
    id: 'hm-kb-outcome-witness',
    survived: true,
    conditions: { hm_kb_attended_haymarket: true, hm_kb_escaped_arrest: true },
    epilogue: `You escaped the square on the night of May fourth. Heinrich found you the next morning at the tenement — he had gone out through a different alley, had walked home in the dark, had sat up until dawn waiting to hear your boots on the stairs.

The arrests sweep through the German community on the West Side for weeks. You are not arrested. Your name is not in the papers. You were there and you got out and no one can prove it.

August Spies, Albert Parsons, Adolph Fischer, George Engel, Samuel Fielden, Michael Schwab, Oscar Neebe, Louis Lingg — eight men charged with conspiracy to murder. The trial lasts fifty days. On August 20th, seven are sentenced to death. Neebe receives fifteen years.

You attend the sentencing. You sit in the gallery and you watch Judge Gary read the sentences in a flat voice and you watch the defendants stand in the dock and you do not look away.

On November 11, 1887, four of them are hanged. Lingg dies in his cell the night before. You read about it in the Arbeiter-Zeitung — the paper is still printing, though more quietly than before.

You keep working. The McCormick plant rehires some of the locked-out men in the fall of 1886. You are not among them. You find work at a smaller machine shop on the North Side. The pay is less. The hours are the same.

Heinrich stays. You both stay. You do not talk about Haymarket often. But you were there, and you know what you saw, and that is something no one can take from you.`
  },
  {
    id: 'hm-kb-outcome-arrested',
    survived: true,
    conditions: { hm_kb_attended_haymarket: true, hm_kb_arrested: true },
    epilogue: `You were arrested on the morning of May fifth. Not at the square — you had gotten out of the square — but on Blue Island Avenue, two blocks from the tenement, when a police officer recognized you from the march on May first. Your name was on a list.

The cell in the Desplaines Street Station holds twelve men. Most of them are German. None of them threw the bomb. None of them know who did.

You are held for four days and then released without charge. The police are looking for the bomb-thrower and they have not found him. They are arresting everyone who was at the square and releasing most of them and keeping the ones whose names appear in the Arbeiter-Zeitung or the IWPA membership rolls.

Your name is not in those rolls. You are released.

The experience of those four days — the cell, the questions, the particular way the police look at you when they say the word "anarchist" — does not leave you. It settles into the way you move through the city. You speak German more quietly. You take different routes to work.

Heinrich was not arrested. He waited at the tenement for four days and did not sleep. When you came back he did not say anything. He put a cup of coffee on the table and sat down across from you and that was enough.

You keep working. You keep your name. You do not forget what you saw at the McCormick gates or at Haymarket Square. You carry it the way you carry the machinist's certificate — something that cost you something, something that is yours.`
  },
  {
    id: 'hm-kb-outcome-exile',
    survived: true,
    conditions: { hm_kb_fled_chicago: true },
    epilogue: `You left Chicago on the night of May fourth. You took the train to Milwaukee and from there to Cincinnati and from there you kept moving until the city was far enough behind you that the newspapers were different.

You did not say goodbye to Heinrich. You did not have time. You left a note under his door that said you were going and that you were sorry and that he should keep the Arbeiter-Zeitung.

In Cincinnati you find work at a machine shop on the river. The foreman does not ask where you came from. You give him a name that is easier for Americans to say. You work the same hours for the same pay. The machines are different but the work is the same.

You read about the Haymarket trial in the Cincinnati papers. The coverage is different here — less German, more English, more certain about who was guilty. You read the names of the defendants and you remember the Revenge Circular and the sound of the boots on Desplaines Street and the light from the bomb.

On November 11, 1887, four men are hanged in Chicago. You read about it in the paper the next morning. You fold the paper and put it in your coat pocket and go to work.

Heinrich writes to you once, in the spring of 1887. He says the plant is running again. He says the neighborhood is quieter. He says he hopes you are well. You write back. You do not tell him where you are.

You are well. You are alive. You are somewhere else. That is what you chose, and you live with it.`
  },
  {
    id: 'hm-kb-outcome-default',
    survived: true,
    conditions: {},
    epilogue: `The Haymarket trial ends on August 20, 1886. Seven men are sentenced to death. Oscar Neebe receives fifteen years. On November 11, 1887, August Spies, Albert Parsons, Adolph Fischer, and George Engel are hanged at the Cook County Jail. Louis Lingg dies in his cell the night before, a blasting cap between his teeth.

In 1893, Governor John Peter Altgeld pardons the three surviving defendants — Fielden, Schwab, and Neebe — concluding that the trial had been conducted with "malicious ferocity" and that no evidence connected any of the eight men to throwing the bomb. The pardon ends Altgeld's political career. He knows it will before he signs it.

The eight-hour workday that Karl Brenner and eighty thousand workers marched for on May first, 1886, becomes federal law on June 25, 1938, with the passage of the Fair Labor Standards Act — fifty-two years after the march.

Heinrich Müller continues to work in Chicago. He anglicizes his name in 1892. He does not talk about Haymarket.`
  }
];

export default {
  id: 'hm-karl-brenner',
  name: 'Karl Brenner',
  scenes: karlBrennerScenes,
  outcomes: karlBrennerOutcomes
};
