/**
 * Haymarket Affair Mission — Lucy Parsons Role
 *
 * Six scenes spanning late April through August 1886.
 * Lucy Parsons: labor organizer, Chicago Police Dept Surveillance File.
 *
 * Architecture: Content layer only — no logic, no engine imports.
 * Requirements: 10.1, 10.8, 13.1, 19.5, 19.6
 */

const lucyParsonsScenes = [
  {
    id: 'hm-lp-scene-01',
    narrative: `The hall on West Indiana Street smells of tallow candles and damp wool. Thirty women sit on wooden chairs arranged in two rows, their hands still rough from the day's work — buttonholes, seams, the repetitive pull of thread through fabric. The gas lamp above the door throws a yellow circle on the floor. Outside, the April wind pushes against the windows.

You hold the Arbeiter-Zeitung open in both hands. The German-language type is small and close-set. You have read this passage three times already, alone, before coming here. Now you read it aloud.

The paper reports what the Bureau of Labor Statistics confirmed last year: the average Chicago manufacturing worker earns a dollar and a half a day for ten hours of labor, six days a week. The eight-hour movement is asking for the same wage for two fewer hours. Eighty thousand workers across the city have pledged to strike on May first if the demand is not met.

A woman in the second row — her name is Marta, she presses collars at a shop on Canal Street — leans forward. She asks what happens if the bosses refuse.

You lower the paper. The candle flame bends in a draft from under the door. The movement is already in motion, you tell her. The question is whether each of you will be part of it when it arrives.`,
    apThemes: ['contextualization', 'perspective'],
    apKeyConcept: 'KC-5.1.I',
    apUnit: 'Unit 6.5',
    spiceT: ['Social', 'Economic'],
    atmosphericEffect: null,
    ambientTrack: './audio/ambient/hm-ambient-westside-evening.mp3',
    narratorAudio: './audio/narration/lucy-parsons/hm-lp-scene-01.mp3',
    stimuliUnlock: ['hm-doc-1a'],
    predictionQuestion: null,
    timedChoice: null,
    deathCheckpoint: false,
    choices: [
      {
        id: 'hm-lp-choice-01-a',
        text: 'Read the Arbeiter-Zeitung aloud to the women — let the numbers speak for themselves.',
        consequences: {
          hm_lp_movement_trust: 1,
          hm_lp_spoke_publicly: true
        },
        psychologyEffects: { morale: 1, humanity: 1 },
        nextScene: 'hm-lp-scene-02'
      },
      {
        id: 'hm-lp-choice-01-b',
        text: 'Pass the paper quietly around the room. Let each woman read it herself.',
        consequences: {
          hm_lp_stayed_quiet: true
        },
        psychologyEffects: { composure: 1 },
        nextScene: 'hm-lp-scene-02'
      }
    ]
  },
  {
    id: 'hm-lp-scene-02',
    narrative: `Three days before May fourth. The street outside is dark and the gas lamps on West Indiana Street are lit. You are locking the hall door when Wilhelm finds you.

He works the ink press at the Arbeiter-Zeitung — has for six years. His hands are permanently stained, the creases of his knuckles black with printer's ink. He is a union man. He has attended the meetings. You have trusted him the way you trust anyone who works the labor press.

He speaks quietly, close to the wall. He tells you the Pinkerton National Detective Agency has a man inside the IWPA. Has had one for months. The meetings are being transcribed. Names are being filed. He does not say how he knows this.

You stand with the key still in your hand. The irony of it settles over you slowly, the way cold does: a man who sets type for the labor movement's own newspaper, who handles the words that call workers to organize — this man has been carrying those same workers' names to the agency that breaks strikes for a living. The press that prints the Arbeiter-Zeitung and the Pinkerton files are, in some sense, the same instrument, turned in opposite directions.

Wilhelm does not meet your eyes. He says he thought you should know. Then he walks away down the street without looking back.`,
    apThemes: ['perspective', 'complexity'],
    apKeyConcept: 'KC-5.4.I',
    apUnit: 'Unit 6.5',
    spiceT: ['Political', 'Social'],
    atmosphericEffect: null,
    ambientTrack: './audio/ambient/hm-ambient-westside-evening.mp3',
    narratorAudio: './audio/narration/lucy-parsons/hm-lp-scene-02.mp3',
    stimuliUnlock: ['hm-doc-2'],
    predictionQuestion: null,
    timedChoice: null,
    deathCheckpoint: false,
    choices: [
      {
        id: 'hm-lp-choice-02-a',
        text: 'Warn the other organizers tonight — they need to know before the May fourth meeting.',
        consequences: {
          hm_lp_movement_trust: 1,
          hm_lp_warned_others: true
        },
        psychologyEffects: { morale: 1, loyalty: 1 },
        nextScene: 'hm-lp-scene-03'
      },
      {
        id: 'hm-lp-choice-02-b',
        text: 'Keep the warning to yourself. Telling others could cause panic — or reach the wrong ears.',
        consequences: {
          hm_lp_stayed_quiet: true
        },
        psychologyEffects: { composure: 1 },
        nextScene: 'hm-lp-scene-03'
      }
    ]
  },
  {
    id: 'hm-lp-scene-03',
    narrative: `May fourth, evening. You are standing on Randolph Street, one block from Haymarket Square. Albert is somewhere in that crowd. You can hear the speakers — August Spies's voice carrying over the heads of three thousand people gathered around the barrels and boxes that serve as a platform at the corner of Randolph and Desplaines.

Your daughter holds your coat with both hands. Your son stands close against your side. The air smells of rain coming and coal smoke and the particular density of a crowd that has been standing still for a long time.

Mayor Harrison was here earlier — you saw him ride past on horseback, watching. The meeting has been peaceful. Spies spoke. Albert spoke. Samuel Fielden is speaking now, his black slouch hat visible above the crowd. He is saying that the newspapers call the socialists cowards. He is saying they are here to prove otherwise.

The clouds above the square are low and dark. The crowd has thinned since the rain began to threaten. You can feel your children's weight against you.

From somewhere to the south, on Desplaines Street, you hear the sound of boots on cobblestone — measured, in unison. A great many boots.`,
    apThemes: ['causation', 'perspective'],
    apKeyConcept: 'KC-5.1.II',
    apUnit: 'Unit 6.5',
    spiceT: ['Political', 'Social'],
    atmosphericEffect: null,
    ambientTrack: './audio/ambient/hm-ambient-haymarket-crowd.mp3',
    narratorAudio: './audio/narration/lucy-parsons/hm-lp-scene-03.mp3',
    stimuliUnlock: [],
    predictionQuestion: {
      question: 'The Revenge Circular has been distributed. What do you predict will be the most immediate consequence of workers gathering at Haymarket Square tonight?',
      options: [
        { id: 'a', text: 'The rally disperses peacefully as the rain arrives and the crowd goes home.' },
        { id: 'b', text: 'A bomb is thrown into the police ranks, killing officers and workers alike.' },
        { id: 'c', text: 'Police arrest the speakers before the meeting can begin.' },
        { id: 'd', text: 'Mayor Harrison orders the meeting cancelled and the crowd disperses without incident.' }
      ],
      reveal: 'On the evening of May 4th, 1886, as police moved to disperse the crowd, an unknown person threw a bomb into the police ranks at the corner of Randolph and Desplaines streets. The explosion and the gunfire that followed killed seven police officers and at least four workers. Sixty-seven officers were wounded. The identity of the bomber was never conclusively established. Eight anarchist leaders were arrested and charged with conspiracy to murder — none was proven to have thrown the bomb.'
    },
    timedChoice: { enabled: true, duration: 10000, defaultChoice: 'hm-lp-choice-03-b' },
    deathCheckpoint: false,
    choices: [
      {
        id: 'hm-lp-choice-03-a',
        text: 'Push forward toward the square — Albert is in there and the movement needs witnesses.',
        consequences: {
          hm_lp_entered_square: true
        },
        psychologyEffects: { morale: 1, loyalty: 1 },
        nextScene: 'hm-lp-scene-04'
      },
      {
        id: 'hm-lp-choice-03-b',
        text: 'Stay back with the children. The sound of those boots is not a sound you trust.',
        consequences: {
          hm_lp_stayed_with_children: true
        },
        psychologyEffects: { humanity: 1 },
        nextScene: 'hm-lp-scene-04'
      }
    ]
  },
  {
    id: 'hm-lp-scene-04',
    narrative: `The sound arrives before the light does — a crack that is not thunder, that is not a gun, that is something you have no word for yet. Then the light: a burst of orange and white at the intersection, low to the ground, and then the windows of the buildings on Desplaines Street rattle in their frames.

Your daughter's fingers tighten on your coat. Your son presses his face against your arm.

The screaming starts immediately. Not one voice — dozens, from different directions, different registers. The crowd that had been thinning suddenly reverses, people running toward you and past you, some of them falling on the wet cobblestones. A man goes down ten feet away and does not get up. You cannot see what is wrong with him. The gas lamps are still burning. In their light you can see the smoke rising from the intersection, pale against the dark sky.

From inside the square, gunfire. Pistol shots, rapid and irregular, then a sustained volley. The sound bounces off the brick buildings and comes at you from every direction at once.

Your children are still holding your coat. Their hands are shaking, or yours are — you cannot tell which.

The street in front of you is filling with people running away from the square. Some of them are bleeding. The cobblestones are wet and dark.`,
    apThemes: ['causation', 'complexity'],
    apKeyConcept: 'KC-5.1.I',
    apUnit: 'Unit 6.5',
    spiceT: ['Political', 'Social', 'Interaction with Environment'],
    atmosphericEffect: 'shake',
    ambientTrack: './audio/ambient/hm-ambient-chaos.mp3',
    narratorAudio: './audio/narration/lucy-parsons/hm-lp-scene-04.mp3',
    stimuliUnlock: [],
    predictionQuestion: null,
    timedChoice: { enabled: true, duration: 14000, defaultChoice: 'hm-lp-choice-04-c' },
    deathCheckpoint: false,
    choices: [
      {
        id: 'hm-lp-choice-04-a',
        text: 'Run toward the square — Albert is in there. You have to find him.',
        consequences: {
          hm_lp_ran_toward_square: true
        },
        psychologyEffects: { loyalty: 1 },
        nextScene: 'hm-lp-scene-05'
      },
      {
        id: 'hm-lp-choice-04-b',
        text: 'Shout to the people running past — tell them to stand their ground, that the movement cannot be scattered by one bomb.',
        consequences: {
          hm_lp_movement_trust: 1,
          hm_lp_spoke_publicly: true
        },
        psychologyEffects: { morale: 1 },
        nextScene: 'hm-lp-scene-05'
      },
      {
        id: 'hm-lp-choice-04-c',
        text: 'Pull the children away from the square and run. Whatever is happening in there, they cannot be part of it.',
        consequences: {
          hm_lp_fled_with_children: true
        },
        psychologyEffects: { humanity: 1 },
        nextScene: 'hm-lp-scene-05'
      }
    ]
  },
  {
    id: 'hm-lp-scene-05',
    narrative: `May fifth, morning. The Tribune is on every corner. You read the headline standing on the sidewalk, the paper damp from the vendor's stack. The word "anarchist" appears in the first sentence, the second, the third. The bombing is described as a premeditated attack on law and order. The names of the dead officers are listed. The names of the dead workers are not.

Albert is gone. He left the city last night — you do not know where. The police are already making arrests. August Spies is in custody. The Arbeiter-Zeitung office on Fifth Avenue has been raided.

You stand at the corner of Randolph and Clark with the Tribune in your hands. The paper's owner, Joseph Medill, has been calling the eight-hour movement a threat to civilization for months. Now he has his story.

The Arbeiter-Zeitung is still printing. Its press is still running. The question is what it will say tomorrow — and whether saying it will cost more than silence.

Around you, the city moves as it always does: delivery wagons, the smell of horse and coal, the sound of the elevated railway two blocks north. The world has not stopped. But something in it has shifted, the way a bone shifts when it breaks — not gone, but no longer where it was.`,
    apThemes: ['perspective', 'argumentation'],
    apKeyConcept: 'KC-5.4.I',
    apUnit: 'Unit 6.5',
    spiceT: ['Political', 'Cultural', 'Technological'],
    atmosphericEffect: null,
    ambientTrack: './audio/ambient/hm-ambient-streets-morning.mp3',
    narratorAudio: './audio/narration/lucy-parsons/hm-lp-scene-05.mp3',
    stimuliUnlock: ['hm-doc-4'],
    predictionQuestion: null,
    timedChoice: null,
    deathCheckpoint: false,
    choices: [
      {
        id: 'hm-lp-choice-05-a',
        text: 'Publish in the Arbeiter-Zeitung — tell the workers\' story before the Tribune buries it.',
        consequences: {
          hm_lp_movement_trust: 1,
          hm_lp_published_arbeiter: true
        },
        psychologyEffects: { morale: 1 },
        nextScene: 'hm-lp-scene-06'
      },
      {
        id: 'hm-lp-choice-05-b',
        text: 'Go underground. The arrests are happening fast. Publishing now means giving them your name.',
        consequences: {
          hm_lp_went_underground: true
        },
        psychologyEffects: { composure: 1 },
        nextScene: 'hm-lp-scene-06'
      }
    ]
  },
  {
    id: 'hm-lp-scene-06',
    narrative: `August 1886. The courtroom in the Criminal Court Building on Hubbard Street smells of wood polish and sweat and the particular staleness of a room that has been full of people for months. The trial lasted fifty days. You attended when they let you. You watched Judge Gary conduct the proceedings with a certainty that had nothing to do with evidence.

Today is sentencing. Seven men will be sentenced to death. Oscar Neebe will receive fifteen years. Albert is among the seven.

He stands in the dock in a dark coat. He looks at you across the courtroom. You do not look away.

The judge reads the sentences in a flat voice. The gallery is quiet. Outside, on Hubbard Street, you can hear the ordinary sounds of the city — a horse, a cart, someone calling a name.

Albert Parsons will hang on November 11, 1887, along with August Spies, Adolph Fischer, and George Engel. Louis Lingg will die in his cell the night before, a blasting cap between his teeth. The governor will not intervene.

You know none of this yet. You know only what is in front of you: the dock, the judge, the sentence, and Albert's eyes across the room.

The question is what you do with what comes next.`,
    apThemes: ['argumentation', 'continuity'],
    apKeyConcept: 'KC-5.1.I',
    apUnit: 'Unit 6.5',
    spiceT: ['Political', 'Social'],
    atmosphericEffect: null,
    ambientTrack: './audio/ambient/hm-ambient-courtroom.mp3',
    narratorAudio: './audio/narration/lucy-parsons/hm-lp-scene-06.mp3',
    stimuliUnlock: ['hm-doc-5'],
    predictionQuestion: null,
    timedChoice: null,
    deathCheckpoint: false,
    choices: [
      {
        id: 'hm-lp-choice-06-a',
        text: 'Vow to continue the fight publicly — the movement does not end with a sentence.',
        consequences: {
          hm_lp_movement_trust: 1,
          hm_lp_vowed_to_continue: true
        },
        psychologyEffects: { morale: 1, loyalty: 1 },
        nextScene: 'outcome'
      },
      {
        id: 'hm-lp-choice-06-b',
        text: 'Grieve privately. Protect what remains of your family and your life.',
        consequences: {
          hm_lp_grieved_privately: true
        },
        psychologyEffects: { humanity: 1 },
        nextScene: 'outcome'
      }
    ]
  }
];

const lucyParsonsOutcomes = [
  {
    id: 'hm-lp-outcome-voice',
    survived: true,
    conditions: { hm_lp_movement_trust: { gte: 3 }, hm_lp_published_arbeiter: true },
    epilogue: `Albert Parsons is hanged on November 11, 1887. You are not permitted to see him before the execution. You learn of his death from a newspaper, standing on a street corner in Chicago, the same way you learned of the sentencing.

You do not stop.

In the months after the execution you travel — St. Louis, Kansas City, Denver, San Francisco. You speak in union halls and on street corners and in the back rooms of saloons where the only light comes from a single lamp on a table. You carry Albert's name with you the way you carry your own. You tell the story of what happened at Haymarket and what happened in the courtroom and what happened on the scaffold, and you tell it in the plain language of someone who was there.

The newspapers call you dangerous. The Chicago police keep a file on you that grows thicker every year. Pinkerton operatives attend your speeches and take notes. You know this and you speak anyway.

The eight-hour workday that Albert and August Spies and the eighty thousand marchers demanded in May of 1886 will not become federal law until June 25, 1938 — fifty-two years after the march, thirty-seven years after Albert's death. You will live to see it. You will be eighty-nine years old, nearly blind, living in a small house in Chicago, when President Roosevelt signs the Fair Labor Standards Act into law.

You will not call it a victory. You will call it a beginning that took too long.

The voice that would not stop is still speaking. It will be speaking long after you are gone.`
  },
  {
    id: 'hm-lp-outcome-movement-man',
    survived: true,
    conditions: { hm_lp_movement_trust: { gte: 2, lte: 3 } },
    epilogue: `Albert Parsons is hanged on November 11, 1887. You are in Chicago when it happens. The city goes about its business. The stockyards open. The elevated railway runs. The Tribune prints its morning edition.

You grieve in the way that people grieve when they cannot afford to stop moving — in pieces, at odd hours, in the middle of other things. You continue to organize. You attend meetings. You write. But the center of it has shifted. The movement carries on, and you carry on with it, but the particular fire that made you stand in front of rooms full of strangers and read the Arbeiter-Zeitung aloud — that fire burns lower now.

You honor Albert's memory through the work. You speak at the annual commemorations of the Haymarket martyrs. You correspond with Emma Goldman and other labor voices who carry the thread forward. You are present at the founding of the Industrial Workers of the World in 1905, though you will later break with them over questions of tactics.

The movement and the man are not the same thing. You have always known this. But you did not know, until now, how much of the movement you had built around the man — and how much of the man you had built around the movement.

What remains is real. The work is real. The names of the dead are real. You carry them forward, at the pace you can manage, for as long as you are able.`
  },
  {
    id: 'hm-lp-outcome-private-grief',
    survived: true,
    conditions: { hm_lp_movement_trust: { lte: 1 } },
    epilogue: `Albert Parsons is hanged on November 11, 1887. You are in Chicago. You do not go to the courthouse. You stay in the house on West Indiana Street with the children and you wait for it to be over.

In the weeks that follow, you withdraw from the meetings. The movement continues without you at its center — it has its own momentum now, its own voices. You watch it from a distance, the way you watch the elevated railway from a window: present, moving, not yours to direct.

The grief is not dramatic. It does not announce itself. It is the weight of a coat that is always slightly too heavy, the way a room feels different when someone who used to be in it is no longer there.

You are not finished. You will organize again, in smaller ways, in later years. You will attend the commemorations of the Haymarket martyrs. You will write letters. You will not disappear entirely from the movement that Albert gave his life to.

But the public voice — the voice that stood in front of rooms full of women and read the numbers aloud, that said the question is whether each of you will be part of it — that voice goes quiet for a long time.

The movement carries on. The eight-hour workday becomes federal law in 1938. The names of the martyrs are remembered. History does not require your loudness to proceed. It only requires that you were there.`
  },
  {
    id: 'hm-lp-outcome-default',
    survived: true,
    conditions: {},
    epilogue: `Albert Parsons is hanged on November 11, 1887, alongside August Spies, Adolph Fischer, and George Engel. Louis Lingg dies in his cell the night before. The three surviving defendants — Samuel Fielden, Michael Schwab, and Oscar Neebe — remain in prison until 1893, when Governor John Peter Altgeld pardons them, concluding that the trial had been conducted with "malicious ferocity" and that no evidence connected any of the eight men to throwing the bomb.

Altgeld's pardon ends his political career. He knows it will before he signs it.

Lucy Parsons continues to organize for the rest of her long life. She is a founding member of the Industrial Workers of the World in 1905. She speaks, writes, and agitates into her eighties. She dies in a house fire in Chicago in 1942, at the age of eighty-nine. The Chicago police confiscate her papers and library immediately after her death.

The eight-hour workday she and Albert marched for in 1886 becomes federal law on June 25, 1938, with the passage of the Fair Labor Standards Act — fifty-two years after the march.`
  }
];

export default {
  id: 'hm-lucy-parsons',
  name: 'Lucy Parsons',
  initFlags: { hm_lp_movement_trust: 0 },
  scenes: lucyParsonsScenes,
  outcomes: lucyParsonsOutcomes
};
