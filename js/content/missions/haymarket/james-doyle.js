/**
 * Haymarket Affair Mission — James Doyle Role
 *
 * Six scenes spanning three months before through August 1886.
 * James Doyle: Pinkerton detective, Operative Assignment CHI-1886-114.
 *
 * Architecture: Content layer only — no logic, no engine imports.
 * Requirements: 12.1, 12.8, 19.5, 19.6
 */

const jamesDoyleScenes = [
  {
    id: 'hm-jd-scene-01',
    narrative: `Your name is James Reilly. You have been James Reilly for three months.

The hall on West Indiana Street smells of tallow candles and sawdust. The International Working People's Association meets here on Tuesday evenings. You have attended every meeting since February. You know which men sit in the front row and which ones arrive late. You know who speaks German and who speaks English and who switches between them mid-sentence when they are angry.

You know their names. Not the names in your reports — the names they use with each other. August Spies calls the tall printer Heinrich. The woman who organizes the sewing workers is Lucy Parsons. Her husband Albert speaks at every meeting, his voice carrying to the back of the room without effort.

Captain Ward's instructions were clear: attend the meetings, document the speakers, identify the leaders, report weekly. You have done this. Your reports are thorough. Ward has told you they are the best intelligence the agency has on the IWPA.

What Ward did not tell you — what you have learned on your own, over three months of Tuesday evenings — is that these people are not what the agency's briefing said they were. They are machinists and printers and seamstresses. They are arguing about wages and hours. They are afraid of the same things you were afraid of before you had a steady salary and a Pinkerton badge.

You write your reports. You attend the meetings. You are James Reilly.`,
    apThemes: ['contextualization', 'perspective'],
    apKeyConcept: 'KC-5.4.I',
    apUnit: 'Unit 6.5',
    spiceT: ['Political', 'Cultural'],
    atmosphericEffect: null,
    ambientTrack: './audio/ambient/hm-ambient-westside-evening.mp3',
    narratorAudio: './audio/narration/james-doyle/hm-jd-scene-01.mp3',
    stimuliUnlock: [],
    predictionQuestion: null,
    timedChoice: null,
    deathCheckpoint: false,
    choices: [
      {
        id: 'hm-jd-choice-01-a',
        text: 'Engage genuinely with the IWPA members — the better they trust you, the better your intelligence.',
        consequences: { hm_jd_built_trust: true, hm_jd_gathered_intelligence: true },
        psychologyEffects: { morale: +5, loyalty: +10, humanity: +5, composure: -3 },
        nextScene: 'hm-jd-scene-02'
      },
      {
        id: 'hm-jd-choice-01-b',
        text: 'Keep your distance. You are here to observe, not to become part of what you are observing.',
        consequences: { hm_jd_stayed_detached: true },
        psychologyEffects: { morale: 0, loyalty: +5, humanity: -3, composure: +10 },
        nextScene: 'hm-jd-scene-02'
      }
    ]
  },
  {
    id: 'hm-jd-scene-02',
    narrative: `April. The Pinkerton office on Dearborn Street is on the fourth floor. Captain William Ward sits behind a desk that is too large for the room. He has a glass of water and a stack of your reports and the particular stillness of a man who has already decided what he thinks.

He reads your latest report aloud. The sewing women's meeting on West Indiana Street. Lucy Parsons reading the Arbeiter-Zeitung to thirty women. The names you recorded. The address.

Ward sets the report down. He says the agency has been retained by the McCormick Harvesting Machine Company to monitor labor organizing activity in the West Side German community. He says your reports have been forwarded to the company's legal counsel. He says the names you have provided may be used in future proceedings.

You think about the thirty women in the hall. The smell of tallow candles. The woman named Marta who asked what happens if the bosses refuse.

Ward slides a new assignment across the desk. He wants you to attend the May first march and document the organizers at the front of the column. He wants names, descriptions, any evidence of coordination with the IWPA leadership.

The assignment is clear. The work is what you were hired to do. You pick up the paper.`,
    apThemes: ['perspective', 'causation'],
    apKeyConcept: 'KC-5.4.I',
    apUnit: 'Unit 6.5',
    spiceT: ['Political', 'Economic'],
    atmosphericEffect: null,
    ambientTrack: './audio/ambient/hm-ambient-westside-evening.mp3',
    narratorAudio: './audio/narration/james-doyle/hm-jd-scene-02.mp3',
    stimuliUnlock: ['hm-doc-2'],
    predictionQuestion: null,
    timedChoice: null,
    deathCheckpoint: false,
    choices: [
      {
        id: 'hm-jd-choice-02-a',
        text: 'File a complete, detailed report — names, addresses, the full account of the sewing women\'s meeting.',
        consequences: { hm_jd_filed_full_report: true, hm_jd_reported_lucy: true },
        psychologyEffects: { morale: 0, loyalty: +10, humanity: -8, composure: +5 },
        nextScene: 'hm-jd-scene-03'
      },
      {
        id: 'hm-jd-choice-02-b',
        text: 'File the report but omit the names of the women. Document the meeting without making them targets.',
        consequences: { hm_jd_withheld_details: true },
        psychologyEffects: { morale: +5, loyalty: -5, humanity: +12 },
        nextScene: 'hm-jd-scene-03'
      }
    ]
  },
  {
    id: 'hm-jd-scene-03',
    narrative: `May third. You are at the McCormick gates in your work clothes, your notebook in your coat pocket, your name James Reilly. The locked-out workers have been gathering here since morning. You are among them, watching.

At two in the afternoon the scab workers begin to leave the plant. Someone throws a stone. The police line on Blue Island Avenue moves forward. The Pinkerton guards come through the gate.

The shots come from the police line. You are close enough to see the muzzle flash. You are close enough to see the man who goes down ten feet to your left — a machinist, you have seen him at the IWPA meetings, you do not know his name but you know his face.

The shooting lasts less than a minute. When it stops, there are men on the ground who are not getting up. The police are still in their line. The Pinkerton guards have gone back through the gate.

You have your notebook. You have been trained to observe and record. You write down what you saw: the time, the sequence, the number of shots. You write it the way Ward taught you — facts, no interpretation.

But you know what you saw. And you know that what you write in your report and what you saw are not the same thing, and that the difference between them is a choice you are making right now.`,
    apThemes: ['causation', 'complexity'],
    apKeyConcept: 'KC-5.1.II',
    apUnit: 'Unit 6.5',
    spiceT: ['Political', 'Economic'],
    atmosphericEffect: null,
    ambientTrack: './audio/ambient/hm-ambient-streets-morning.mp3',
    narratorAudio: './audio/narration/james-doyle/hm-jd-scene-03.mp3',
    stimuliUnlock: [],
    predictionQuestion: null,
    timedChoice: null,
    deathCheckpoint: false,
    choices: [
      {
        id: 'hm-jd-choice-03-a',
        text: 'Document everything you witnessed for Ward — the sequence, the shots, the men on the ground.',
        consequences: { hm_jd_documented_shooting: true },
        psychologyEffects: { morale: 0, loyalty: +10, humanity: -5, composure: +8 },
        nextScene: 'hm-jd-scene-04'
      },
      {
        id: 'hm-jd-choice-03-b',
        text: 'Go to the man on the ground before you write anything. He may still be alive.',
        consequences: { hm_jd_helped_wounded: true },
        psychologyEffects: { morale: +5, loyalty: -8, humanity: +15, composure: -10 },
        nextScene: 'hm-jd-scene-04'
      }
    ]
  },
  {
    id: 'hm-jd-scene-04',
    narrative: `May third, evening. Ward's office on Dearborn Street. The gas lamp on his desk is lit. He has already read the Revenge Circular — someone brought him a copy within an hour of it being distributed.

He slides it across the desk to you. The German is direct. Workingmen, to Arms. Your masters sent out their bloodhounds. He points to the line about the meeting at Haymarket Square tomorrow night.

Ward says: you will be there. You will document every speaker. You will record names, descriptions, the content of every speech. He says the agency has been asked by the city to provide intelligence on the meeting. He says this is the most important assignment of the operation.

You look at the Revenge Circular. You have been to the IWPA meetings for three months. You know August Spies wrote this in rage, an hour after watching men shot at the McCormick gates. You know the meeting tomorrow night is a protest, not a conspiracy.

You also know that what you put in your report will become evidence. That the names you write down will be names on a list. That the list will go to Ward, and from Ward to the company's lawyers, and from the lawyers to wherever it goes next.

Ward is waiting for your answer.`,
    apThemes: ['perspective', 'causation'],
    apKeyConcept: 'KC-5.4.I',
    apUnit: 'Unit 6.5',
    spiceT: ['Political', 'Economic'],
    atmosphericEffect: null,
    ambientTrack: './audio/ambient/hm-ambient-haymarket-crowd.mp3',
    narratorAudio: './audio/narration/james-doyle/hm-jd-scene-04.mp3',
    stimuliUnlock: ['hm-doc-3'],
    predictionQuestion: {
      question: 'August Spies has called a protest meeting at Haymarket Square for tomorrow night. Based on what you have witnessed at the McCormick gates and in three months of IWPA meetings, what do you predict will happen?',
      options: [
        { id: 'a', text: 'The meeting will be peaceful and the city will negotiate with labor leaders to prevent further violence.' },
        { id: 'b', text: 'Police will confront the crowd and the confrontation will turn violent, ending the eight-hour movement in Chicago.' },
        { id: 'c', text: 'The meeting will be cancelled — workers will be too afraid to gather after the McCormick shooting.' },
        { id: 'd', text: 'The Pinkerton agency will intervene directly to disperse the crowd before police arrive.' }
      ],
      reveal: 'On the night of May 4th, an unknown person threw a bomb into the police formation as officers moved to disperse the meeting. Seven police officers and at least four workers died. The bombing gave authorities the pretext to arrest the eight IWPA leaders — not for throwing the bomb, but for conspiracy. The Pinkerton reports James filed over three months became evidence in the trial.'
    },
    timedChoice: null,
    deathCheckpoint: false,
    choices: [
      {
        id: 'hm-jd-choice-04-a',
        text: 'Accept the assignment without question. This is the job.',
        consequences: { hm_jd_accepted_orders: true, hm_jd_attended_haymarket: true },
        psychologyEffects: { morale: 0, loyalty: +10, humanity: -10, composure: +5 },
        nextScene: 'hm-jd-scene-05'
      },
      {
        id: 'hm-jd-choice-04-b',
        text: 'Tell Ward you will go, but that the meeting is a protest, not a conspiracy — and that your report will reflect what you actually observe.',
        consequences: { hm_jd_expressed_reservations: true, hm_jd_attended_haymarket: true },
        psychologyEffects: { morale: +8, loyalty: -3, humanity: +10 },
        nextScene: 'hm-jd-scene-05'
      }
    ]
  },
  {
    id: 'hm-jd-scene-05',
    narrative: `Haymarket Square, May fourth, evening. Three thousand people. You are in the crowd as James Reilly, your notebook in your coat pocket, your pencil ready.

August Spies speaks. Albert Parsons speaks. You have heard both of them speak before, at the IWPA meetings on West Indiana Street. You write down what they say. You write down the time. You write down the size of the crowd.

Samuel Fielden is speaking when the police arrive — four hundred officers in formation, filling Desplaines Street from gutter to gutter. The police captain orders the meeting to disperse. Fielden says the meeting is peaceful.

Then the light — a streak of fire from somewhere near the Crane Brothers building, low and fast, and then the explosion that rattles every window on the block.

The people around you are people you know. The man to your left is the printer from the Tuesday meetings. The woman near the platform is someone you have seen at the hall on West Indiana Street. They are running now, or falling, or standing very still with their hands over their ears.

The police are firing into the crowd. The cobblestones are wet. The gas lamps are still burning.

You have your notebook. You have your pencil. You are James Reilly and you are James Doyle and you are standing in the middle of something that your reports helped bring here, and the people around you are people you know.`,
    apThemes: ['perspective', 'complexity'],
    apKeyConcept: 'KC-5.1.I',
    apUnit: 'Unit 6.5',
    spiceT: ['Political', 'Social'],
    atmosphericEffect: 'shake',
    ambientTrack: './audio/ambient/hm-ambient-chaos.mp3',
    narratorAudio: './audio/narration/james-doyle/hm-jd-scene-05.mp3',
    stimuliUnlock: ['hm-doc-4', 'hm-doc-5'],
    predictionQuestion: null,
    timedChoice: { enabled: true, duration: 12000, defaultChoice: 'hm-jd-choice-05-b' },
    deathCheckpoint: false,
    choices: [
      {
        id: 'hm-jd-choice-05-a',
        text: 'Drop the notebook. Go to the people on the ground. James Reilly would do that.',
        consequences: { hm_jd_broke_cover: true, hm_jd_helped_wounded_haymarket: true },
        psychologyEffects: { morale: +10, loyalty: -10, humanity: +15, composure: -10 },
        nextScene: 'hm-jd-scene-06'
      },
      {
        id: 'hm-jd-choice-05-b',
        text: 'Keep writing. Document what you see. This is what you were sent here to do.',
        consequences: { hm_jd_maintained_cover: true, hm_jd_documented_bomb: true },
        psychologyEffects: { morale: -5, loyalty: +10, humanity: -10, composure: +10 },
        nextScene: 'hm-jd-scene-06'
      },
      {
        id: 'hm-jd-choice-05-c',
        text: 'Get out. Leave the notebook, leave the square, leave all of it behind.',
        consequences: { hm_jd_fled_scene: true },
        psychologyEffects: { morale: -10, loyalty: -5, composure: +5 },
        nextScene: 'hm-jd-scene-06'
      }
    ]
  },
  {
    id: 'hm-jd-scene-06',
    narrative: `August 1886. The Criminal Court Building on Hubbard Street. The trial of the eight Haymarket defendants has lasted fifty days. State's Attorney Grinnell has argued that the defendants' speeches and writings incited the unknown bomber — that they are responsible for the deaths even though no one can prove any of them threw the bomb.

Your reports are in evidence. The names you wrote down, the meetings you attended, the speeches you transcribed — all of it is part of the prosecution's case. Grinnell has used your intelligence to establish that the defendants knew each other, organized together, and advocated for violence. He has not needed to prove who threw the bomb. He has only needed to prove a conspiracy.

You are called to testify.

The courtroom is full. The defendants sit in the dock — Spies, Parsons, Fischer, Engel, Fielden, Schwab, Neebe, Lingg. You have seen most of them at the Tuesday meetings. Albert Parsons looks at you from the dock. You do not look away.

The prosecutor asks you to describe what you observed at the IWPA meetings over the three months of your assignment. He asks you to confirm the names in your reports. He asks you to describe the content of the speeches.

You know what your full testimony will do. You know what withholding it will cost you. You know what refusing will mean for your career, your salary, your name.

The prosecutor is waiting.`,
    apThemes: ['argumentation', 'perspective'],
    apKeyConcept: 'KC-5.4.I',
    apUnit: 'Unit 6.5',
    spiceT: ['Political', 'Social'],
    atmosphericEffect: null,
    ambientTrack: './audio/ambient/hm-ambient-courtroom.mp3',
    narratorAudio: './audio/narration/james-doyle/hm-jd-scene-06.mp3',
    stimuliUnlock: [],
    predictionQuestion: null,
    timedChoice: null,
    deathCheckpoint: false,
    choices: [
      {
        id: 'hm-jd-choice-06-a',
        text: 'Testify fully. Confirm everything in your reports. Give the prosecution what it needs.',
        consequences: { hm_jd_testified_fully: true },
        psychologyEffects: { morale: -10, loyalty: +15, humanity: -15, composure: +5 },
        nextScene: 'outcome'
      },
      {
        id: 'hm-jd-choice-06-b',
        text: 'Testify, but withhold the details that would most directly harm the defendants. Answer what is asked. Volunteer nothing.',
        consequences: { hm_jd_withheld_testimony: true },
        psychologyEffects: { morale: +5, loyalty: -5, humanity: +10 },
        nextScene: 'outcome'
      },
      {
        id: 'hm-jd-choice-06-c',
        text: 'Refuse to testify. Whatever the cost, you will not be the instrument of this.',
        consequences: { hm_jd_refused_testimony: true },
        psychologyEffects: { morale: +10, loyalty: -15, humanity: +15, composure: -10 },
        nextScene: 'outcome'
      }
    ]
  }
];

const jamesDoyleOutcomes = [
  {
    id: 'hm-jd-outcome-testimony',
    survived: true,
    conditions: { hm_jd_testified_fully: true },
    epilogue: `You testified fully. You confirmed the names in your reports. You described the meetings, the speeches, the organizational structure of the IWPA. You answered every question the prosecutor asked.

On August 20, 1886, seven of the eight defendants are sentenced to death. Oscar Neebe receives fifteen years. Judge Gary reads the sentences in a flat voice. The gallery is quiet.

The Pinkerton agency commends your work. Ward writes a letter of recommendation that goes into your file. You are assigned to a new operation in St. Louis before the executions.

On November 11, 1887, August Spies, Albert Parsons, Adolph Fischer, and George Engel are hanged at the Cook County Jail. Louis Lingg dies in his cell the night before. You read about it in the St. Louis paper. You fold the paper and put it in your coat pocket.

You think about the Tuesday meetings on West Indiana Street. The smell of tallow candles. Albert Parsons's voice carrying to the back of the room without effort. The woman named Marta who asked what happens if the bosses refuse.

You did your job. Your reports were accurate. The names you wrote down were the names of people who were there. You did not invent anything. You did not lie.

In 1893, Governor Altgeld pardons the three surviving defendants, concluding that the trial was conducted with "malicious ferocity" and that no evidence connected any of the eight men to throwing the bomb. You read about the pardon in the newspaper. You do not write anything in your notebook.

You keep working. You are good at the job. You do not think about Haymarket often. When you do, you think about the notebook, and the pencil, and the names.`
  },
  {
    id: 'hm-jd-outcome-withheld',
    survived: true,
    conditions: { hm_jd_withheld_testimony: true },
    epilogue: `You testified. You answered what was asked. You confirmed the meetings, the dates, the general structure of the IWPA. But you did not volunteer the details that would have been most damaging — the specific conversations, the names of the women at the sewing meeting, the things you had heard that were said in confidence.

The prosecution noticed. Ward noticed. After the trial, Ward calls you into his office and tells you that your testimony was incomplete. He does not use the word "inadequate." He uses the word "incomplete." He says the agency expects its operatives to provide full cooperation with legal proceedings.

You are reassigned. Not fired — reassigned. A less prominent operation. Less pay. Ward does not explain further.

Seven defendants are sentenced to death. Four are hanged on November 11, 1887. You read about it in the paper. You think about what your full testimony might have added, and what it might not have changed, and whether the difference matters.

In 1893, Governor Altgeld pardons the three surviving defendants, concluding that the trial was conducted with "malicious ferocity." You read the pardon message carefully. Altgeld writes that the jury was improperly selected and that no evidence connected any defendant to the bombing.

You think about the things you withheld. You think about whether they would have changed anything. You do not know. You will not know. That is the particular weight of a partial truth — it is never heavy enough to be certain about, and never light enough to put down.`
  },
  {
    id: 'hm-jd-outcome-refusal',
    survived: true,
    conditions: { hm_jd_refused_testimony: true },
    epilogue: `You refused to testify. You told the prosecutor that you would not provide testimony in this proceeding. You did not explain why. You did not need to.

Ward fires you the same afternoon. He does not raise his voice. He says the agency cannot employ operatives who refuse to cooperate with legal proceedings. He says your file will reflect this. He says you should not expect a reference.

You leave the Pinkerton office on Dearborn Street for the last time. The street is ordinary — delivery wagons, the smell of horse and coal, the sound of the elevated railway two blocks north.

The trial proceeds without your testimony. The prosecution uses the written reports you filed over three months — they are already in evidence. Seven defendants are sentenced to death. Four are hanged on November 11, 1887.

You find other work. Not detective work — that door is closed. You work at a machine shop on the North Side for a year, then at a warehouse on the river. The pay is less than the Pinkerton salary. The hours are longer.

In 1893, Governor Altgeld pardons the three surviving defendants. You read the pardon message in the newspaper. Altgeld writes that the trial was conducted with "malicious ferocity" and that no evidence connected any defendant to the bombing. He knows the pardon will end his political career. He signs it anyway.

You think about that. You think about what it costs to refuse, and what it costs to comply, and whether the cost is ever the same for the people who make the decision and the people who live with it.`
  },
  {
    id: 'hm-jd-outcome-default',
    survived: true,
    conditions: {},
    epilogue: `The Haymarket trial ends on August 20, 1886. Seven men are sentenced to death. Oscar Neebe receives fifteen years. On November 11, 1887, August Spies, Albert Parsons, Adolph Fischer, and George Engel are hanged at the Cook County Jail. Louis Lingg dies in his cell the night before.

In 1893, Governor John Peter Altgeld pardons the three surviving defendants — Fielden, Schwab, and Neebe — concluding that the trial had been conducted with "malicious ferocity" and that no evidence connected any of the eight men to throwing the bomb. The pardon ends Altgeld's political career.

The Pinkerton National Detective Agency continues to operate. It will be hired to break strikes at the Carnegie Steel Company in Homestead, Pennsylvania in 1892, where Pinkerton guards and striking workers fight a pitched battle that leaves ten men dead. The pattern established at McCormick and Haymarket — private detective agencies as instruments of labor suppression — continues for decades.

The identity of the Haymarket bomber is never conclusively established.`
  }
];

export default {
  id: 'hm-james-doyle',
  name: 'James Doyle',
  scenes: jamesDoyleScenes,
  outcomes: jamesDoyleOutcomes
};
