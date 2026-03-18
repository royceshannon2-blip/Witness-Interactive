/**
 * Rwanda Genocide Mission - Hutu Moderate (Augustin) Role
 *
 * Historical Context:
 * - Augustin is a communal secretary in Kigali
 * - April 6, 1994: President Habyarimana's plane shot down
 * - Within hours, roadblocks established, moderate leaders assassinated
 * - Hutu moderates faced impossible choices: comply, resist, or flee
 * - Thousands of Hutu who sheltered Tutsi or refused to participate were killed
 * - Post-genocide: gacaca courts, reconciliation vs. justice tensions
 *
 * BRANCHING STRUCTURE:
 * - Rescue Path: Actively sheltered Tutsi neighbors, risked family safety
 * - Compliance Path: Followed orders, staffed roadblocks, maintained position
 * - Flight Path: Fled Kigali, avoided direct participation, survived in hiding
 *
 * Requirements: US-2.1, US-2.2, US-2.3, TR-2.2
 */

const hutuModerateScenes = [
  {
    id: "rw-hm-scene-01",
    narrative: `April 6, 1994. Evening. You're Augustin, communal secretary in Kigali. The radio crackles with news: President Habyarimana's plane has been shot down. Both presidents dead—Habyarimana and Burundi's Ntaryamira. Your stomach tightens. You've heard the rumors for weeks. Lists. Arms caches. RTLM's broadcasts getting sharper, angrier.

A knock at the door. It's Celestin, your Tutsi neighbor. His hands shake. "They're setting up roadblocks. The presidential guard is moving through the city. I need—" He stops, looks at your children playing in the next room. "I need somewhere safe. Just for tonight."

Your wife catches your eye from the kitchen. Fear. The radio mentioned moderate politicians being targeted. Your name is on lists too—you refused to attend the last Hutu Power rally. Outside, you hear vehicles, shouting. The smell of smoke drifts through the window.`,
    apThemes: ["causation", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: "audio/narration/hutu-moderate/rw-hm-scene-01.mp3",
    soundEffects: [
      { file: 'rw-sfx-radio-static-burst.mp3', triggerAfterMs: 1200 },
      { file: 'rw-sfx-truck-distant.mp3', triggerAfterMs: 3500 },
      { file: 'rw-sfx-door-knock-soft.mp3', triggerAfterMs: 6000 }
    ],
    choices: [
      {
        id: "rw-hm-choice-01-a",
        text: "Hide Celestin in the attic",
        consequences: { rw_helped_celestin: true },
        nextScene: "rw-hm-scene-02a"
      },
      {
        id: "rw-hm-choice-01-b",
        text: "Attend the Hutu Power rally",
        consequences: {},
        nextScene: "rw-hm-scene-02b"
      },
      {
        id: "rw-hm-choice-01-c",
        text: "Tell him to leave quickly",
        consequences: { rw_fled_kigali: true },
        nextScene: "rw-hm-scene-02c"
      }
    ]
  },

  {
    id: "rw-hm-scene-02a",
    narrative: `April 7, morning. Celestin is hidden in your attic. You can hear him breathing through the ceiling. Your children ask questions you can't answer. The radio—RTLM—uses the language it always uses for people like Celestin. Instructions. Locations. Names.

A truck stops outside. Interahamwe militia, maybe twenty men, machetes and clubs. They're checking houses. Your neighbor, the one who always complained about Tutsi taking jobs, is with them now. He points at your door.

The militia leader knocks. "We're looking for cockroaches. You seen any?" He smiles. Your wife grips your arm. Above, a floorboard creaks. The militia leader's eyes flick upward. "What's that noise?"

You have seconds. The roadblock at the end of the street—you know the commander. Or you could lie. Or you could run.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: "audio/narration/hutu-moderate/rw-hm-scene-02a.mp3",
    soundEffects: [
      { file: 'rw-sfx-door-knock.mp3', triggerAfterMs: 2200 },
      { file: 'rw-sfx-floorboard-creak.mp3', triggerAfterMs: 4800 }
    ],
    choices: [
      {
        id: "rw-hm-choice-02a-a",
        text: "Misdirect them to another house",
        consequences: { rw_misdirected_militia: true },
        nextScene: "rw-hm-scene-03a"
      },
      {
        id: "rw-hm-choice-02a-b",
        text: "Comply—reveal Celestin's location",
        consequences: { rw_revealed_celestin: true, rw_participated_directly: true },
        nextScene: "rw-hm-scene-03b"
      }
    ]
  },

  {
    linear: true,
    id: "rw-hm-scene-02b",
    narrative: `April 7, evening. The rally is at the communal office. Hundreds of men, some with machetes already. The speaker—a local Hutu Power organizer—shouts about the RPF, about Tutsi plotting to enslave Hutu again. "They killed our president! They want to take everything!"

He calls your name. "Augustin, you're a secretary. You have the lists. You know where they live." The crowd turns. Faces you recognize—teachers, farmers, the man who sold you vegetables last week. All watching.

"We need people at the roadblocks. Identity cards. We stop them from escaping." He hands you a clipboard. "You'll take the checkpoint at the market. Report at dawn."

Your hands are shaking. If you refuse, you're a traitor. If you comply, you're part of this. The crowd chants. RTLM plays from a radio. The smell of banana beer and sweat.`,
    apThemes: ["causation", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: "audio/narration/hutu-moderate/rw-hm-scene-02b.mp3",
    soundEffects: [
      { file: 'rw-sfx-crowd-chant.mp3', triggerAfterMs: 1800 },
      { file: 'rw-sfx-radio-music-stab.mp3', triggerAfterMs: 4200 }
    ],
    choices: [
      {
        id: "rw-hm-choice-02b-a",
        text: "Accept the roadblock assignment",
        consequences: { rw_staffed_roadblock: true },
        nextScene: "rw-hm-scene-03c"
      }
    ]
  },

  {
    linear: true,
    id: "rw-hm-scene-02c",
    narrative: `April 7, pre-dawn. You told Celestin to leave. You don't know if he made it. The radio reports massacres at churches, schools, administrative buildings. Prime Minister Uwilingiyimana is dead. Moderate politicians, journalists, civil servants—all targeted in the first hours.

Your wife packs essentials. "We have to go. Now." Your children are crying. Outside, the roadblocks are everywhere. Identity cards. Machetes. The Interahamwe are hunting.

You have a cousin in the countryside, near Gitarama. Maybe it's safer there. Maybe you can disappear. But leaving means abandoning your position, your home, everything. And the roads—every checkpoint is a risk.

The sun rises. Smoke columns across Kigali. You hear screaming from the next street. Your wife grabs your hand. "Augustin. We go now or we die here."`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: "audio/narration/hutu-moderate/rw-hm-scene-02c.mp3",
    soundEffects: [
      { file: 'rw-sfx-distant-shouting.mp3', triggerAfterMs: 2000 },
      { file: 'rw-sfx-machete-distant.mp3', triggerAfterMs: 4500 }
    ],
    choices: [
      {
        id: "rw-hm-choice-02c-a",
        text: "Flee Kigali before dawn",
        consequences: { rw_fled_kigali: true },
        nextScene: "rw-hm-scene-03d"
      }
    ]
  },

  {
    id: "rw-hm-scene-03a",
    narrative: `April 8. The roadblock at the market. You're here because you misdirected the militia away from Celestin. They believed you. For now. But now you're assigned here anyway—punishment or test, you're not sure.

A truck approaches. Tutsi families, you can tell by their faces. Children in the back. The militia commander hands you a clipboard. "Check the cards. Separate them." The identity cards—introduced by Belgium decades ago—list each person's ethnicity: Hutu, Tutsi, or Twa. At roadblocks like this, a Tutsi card is a death sentence.

You know what happens next. You've seen the bodies in the ditches. The commander watches you. "You're with us, right Augustin? Or are you one of them?"

Your hands shake as you take the first identity card. The woman holding it looks at you. She's someone's mother. Someone's wife. The militia behind you tap their machetes on the truck bed. Twelve seconds to decide.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: "audio/narration/hutu-moderate/rw-hm-scene-03a.mp3",
    soundEffects: [
      { file: 'rw-sfx-truck-idle.mp3', triggerAfterMs: 800 },
      { file: 'rw-sfx-machete-tap.mp3', triggerAfterMs: 3000 }
    ],
    deathCheckpoint: true,
    choices: [
      {
        id: "rw-hm-choice-03a-a",
        text: "Misdirect again—claim cards are valid",
        consequences: { rw_saved_at_roadblock: true },
        nextScene: "rw-hm-scene-04a"
      },
      {
        id: "rw-hm-choice-03a-b",
        text: "Wave them through—follow orders",
        consequences: { rw_complied_at_roadblock: true },
        nextScene: "rw-hm-scene-04b"
      }
    ]
  },

  {
    id: "rw-hm-scene-03b",
    narrative: `April 8. You revealed Celestin. The militia dragged him out. You heard the machetes. Your wife won't look at you. Your children don't understand.

Now you're at the roadblock anyway. The commander says you proved your loyalty. He hands you a machete. "You're one of us now." The weight of it in your hands. The smell of blood on the blade—it's been used already.

A group approaches. More Tutsi. More identity cards. The militia expects you to participate now. Not just check cards. Actually participate. The commander watches. "Show us you're committed, Augustin."

The radio crackles. RTLM praises the "work" being done. Lists more names. More locations. The genocide is organized, methodical. You're part of the machinery now.`,
    apThemes: ["causation", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: "audio/narration/hutu-moderate/rw-hm-scene-03b.mp3",
    soundEffects: [
      { file: 'rw-sfx-truck-idle.mp3', triggerAfterMs: 800 },
      { file: 'rw-sfx-machete-tap.mp3', triggerAfterMs: 2500 },
      { file: 'rw-sfx-radio-music-stab.mp3', triggerAfterMs: 5000 }
    ],
    deathCheckpoint: true,
    choices: [
      {
        id: "rw-hm-choice-03b-a",
        text: "Participate in the killings",
        consequences: { rw_participated_directly: true },
        nextScene: "rw-hm-scene-04b"
      }
    ]
  },

  {
    linear: true,
    id: "rw-hm-scene-03c",
    narrative: `April 9. You accepted the roadblock assignment at the rally. Three days now. You've checked hundreds of identity cards—the colonial-era cards that list ethnicity, turning bureaucratic records into death warrants. Tutsi. Hutu. The militia takes the Tutsi away. You don't ask where.

The commander trusts you now. He gives you more responsibility. "You're educated. You can read. Help us with the lists." Lists of names. Addresses. Who's hiding where. The administrative machinery of genocide—you're part of it.

At night, you go home. Your wife asks what you did today. You don't answer. Your children play. The radio plays music between the instructions. RTLM announcers joke, laugh, then read more names.

You tell yourself you're surviving. You tell yourself you had no choice. But you know the truth. You chose this. Every day, you choose this.`,
    apThemes: ["causation", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: "audio/narration/hutu-moderate/rw-hm-scene-03c.mp3",
    soundEffects: [
      { file: 'rw-sfx-truck-idle.mp3', triggerAfterMs: 1000 },
      { file: 'rw-sfx-radio-static-burst.mp3', triggerAfterMs: 4000 }
    ],
    choices: [
      {
        id: "rw-hm-choice-03c-a",
        text: "Continue staffing the roadblock",
        consequences: { rw_continued_compliance: true },
        nextScene: "rw-hm-scene-04b"
      }
    ]
  },

  {
    linear: true,
    id: "rw-hm-scene-03d",
    narrative: `April 10. You fled Kigali. Your family made it to your cousin's village near Gitarama. The countryside is quieter, but the genocide is here too. Roadblocks on every path. Militia in every village. The radio reaches everywhere.

Your cousin is nervous. "You can stay, but keep quiet. Don't draw attention." You help with farm work. You avoid the village meetings where Hutu Power organizers speak. You hear stories—Tutsi hiding in the marshes, in the forests. Militia hunting them with dogs.

One night, your cousin pulls you aside. "They're asking about you. Why you left Kigali. Why you're not participating." He's scared. "If they think I'm hiding a traitor..."

You're not safe here either. Nowhere is safe. The RPF is advancing from the north. The genocide continues. You're in hiding, but you're Hutu—you're not the primary target. Just a coward. A traitor to the cause.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: "audio/narration/hutu-moderate/rw-hm-scene-03d.mp3",
    soundEffects: [
      { file: 'rw-sfx-birds-rural.mp3', triggerAfterMs: 1500 },
      { file: 'rw-sfx-dog-bark-distant.mp3', triggerAfterMs: 5500 }
    ],
    choices: [
      {
        id: "rw-hm-choice-03d-a",
        text: "Stay hidden in the countryside",
        consequences: { rw_stayed_hidden: true },
        nextScene: "rw-hm-scene-04d"
      }
    ]
  },

  {
    id: "rw-hm-scene-04a",
    narrative: `July 4, 1994. The RPF captured Kigali. The genocide ended after 100 days. Thirteen years passed.

2007. The gacaca court — a community justice process where perpetrators could confess in exchange for reduced sentences — in your sector. You're here to testify. The judges—your neighbors—sit under a tree. Survivors sit in the front rows. You recognize faces. Celestin is here. He survived. His wife and children didn't.

The judge calls your name. "Augustin. You were communal secretary in April 1994. You staffed a roadblock. Tell us what you did."

You stand. Your hands shake like they did that day. You helped Celestin hide. You misdirected the militia. You saved people at the roadblock. But you also complied. You checked identity cards. You followed orders. You were part of the machinery.

Celestin watches you. His son—the one who survived—sits beside him. The crowd is silent. The judge waits. Gacaca offers reduced sentences for full confessions. But what is "full"? What do you say about the choices you made?`,
    apThemes: ["continuity", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    choices: [
      {
        id: "rw-hm-choice-04a-a",
        text: "Testify fully—confess everything",
        consequences: { rw_full_confession: true },
        nextScene: "outcome"
      },
      {
        id: "rw-hm-choice-04a-b",
        text: "Testify partially—protect some names",
        consequences: { rw_partial_confession: true },
        nextScene: "outcome"
      },
      {
        id: "rw-hm-choice-04a-c",
        text: "Deny participation—claim innocence",
        consequences: { rw_denied_participation: true },
        nextScene: "outcome"
      }
    ]
  },

  {
    id: "rw-hm-scene-04b",
    narrative: `2008. Fourteen years later. The gacaca court. You're here because survivors named you. You staffed the roadblock. You checked identity cards. You followed orders. Some say you did more—that you participated directly.

The judge reads the charges. "Augustin. Category Two: participation in killings. Multiple witnesses." You look at the crowd. Faces you know. Faces that know you. Your wife sits in the back, eyes down. Your children—grown now—aren't here.

You could confess. Gacaca offers reduced sentences—community service instead of prison. But confession means admitting you killed. Means your children know. Means Celestin's son knows you're the reason his mother died.

Or you could deny it. Claim you were forced. Claim you had no choice. Some perpetrators do this. Some get away with it. Some don't. The judge waits. The survivors wait. What do you say about what you did?`,
    apThemes: ["continuity", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    choices: [
      {
        id: "rw-hm-choice-04b-a",
        text: "Confess fully—accept responsibility",
        consequences: { rw_confessed_complicity: true },
        nextScene: "outcome"
      },
      {
        id: "rw-hm-choice-04b-b",
        text: "Claim you were forced—minimize role",
        consequences: { rw_minimized_role: true },
        nextScene: "outcome"
      },
      {
        id: "rw-hm-choice-04b-c",
        text: "Deny everything—fight the charges",
        consequences: { rw_denied_charges: true },
        nextScene: "outcome"
      }
    ]
  },

  {
    id: "rw-hm-scene-04d",
    narrative: `2005. Eleven years later. You're still in the countryside. You never went back to Kigali. Your cousin's village is your home now. You farm. You keep quiet. You avoid the gacaca courts when they come through.

Some people know you fled. Some call you a coward. Some call you smart. You didn't kill anyone. You didn't staff roadblocks. You just... left. Is that guilt? Is that innocence?

The government's "no ethnicity" policy means you're just "Rwandan" now. Rwanda's post-genocide government abolished official ethnic categories — no more Hutu, Tutsi, or Twa on identity cards, only Rwandan. No Hutu. No Tutsi. Just citizens. But everyone remembers. Everyone knows. Your children ask why you left Kigali. Why you don't talk about 1994. Why you flinch when the radio plays.

A gacaca judge visits. "Augustin. We need testimony about what happened in Kigali. You were there. You were a secretary. You knew things." He's not accusing you. He's asking you to help. To speak. To remember. What do you say?`,
    apThemes: ["continuity", "perspective"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    choices: [
      {
        id: "rw-hm-choice-04d-a",
        text: "Testify as a witness—help survivors",
        consequences: { rw_testified_as_witness: true },
        nextScene: "outcome"
      },
      {
        id: "rw-hm-choice-04d-b",
        text: "Refuse—stay silent about the past",
        consequences: { rw_refused_testimony: true },
        nextScene: "outcome"
      },
      {
        id: "rw-hm-choice-04d-c",
        text: "Relocate again—avoid the questions",
        consequences: {},
        nextScene: "outcome"
      }
    ]
  }
];

const hutuModerateOutcomes = [
  {
    id: "rw-hm-outcome-rescue-survived-confessor",
    survived: true,
    conditions: {
      rw_helped_celestin: true,
      rw_misdirected_militia: true,
      rw_saved_at_roadblock: true,
      rw_full_confession: true
    },
    epilogue: `You survived. When the militia leader knocked and his eyes flicked to the ceiling where Celestin was hiding, you looked him in the face and sent him to a neighbor's house instead. At the market roadblock, your shaking hands took the clipboard and lied again — declaring Tutsi identity cards valid and waving families through to safety while the commander watched.

At the gacaca court in 2007, you held nothing back. You detailed every list you processed as communal secretary, named the commander who ran the market checkpoint, and confessed exactly how the bureaucratic machinery of genocide worked from the inside. Celestin sat in the front row and testified on your behalf, telling the village how you hid him in the attic while your children played quietly below. Your full confession helped convict the architects of the local massacres. In Kigali, you are known as a man who chose humanity when choosing otherwise would have been easier — and who then had the courage to tell the truth about the moments when his humanity wavered.`
  },

  {
    id: "rw-hm-outcome-rescue-survived-partial",
    survived: true,
    conditions: {
      rw_helped_celestin: true,
      rw_misdirected_militia: true,
      rw_saved_at_roadblock: true,
      rw_partial_confession: true
    },
    epilogue: `You survived. You hid Celestin in the attic and misdirected the militia leader whose eyes flicked upward at the creaking floorboard. At the market roadblock, your shaking hands handed back Tutsi identity cards, falsely claiming they were valid while the commander watched you.

At the gacaca court in 2007, you testified to your acts of rescue but withheld the names of the militia commanders who assigned you to that checkpoint. They still lived nearby, and you feared retaliation against your wife and children. Celestin watched you omit the darkest portions of what you knew as communal secretary — the names, the lists, the chain of command above the roadblock. The court accepted your testimony. The village knows you saved lives. The village also knows there are gaps in your account. You walk a careful line in the new Rwanda: a man who rescued his neighbor, who lied to protect families at the checkpoint, and who then could not bring himself to name the men who put him there.`
  },

  {
    id: "rw-hm-outcome-rescue-survived-denied",
    survived: true,
    conditions: {
      rw_helped_celestin: true,
      rw_misdirected_militia: true,
      rw_saved_at_roadblock: true,
      rw_denied_participation: true
    },
    epilogue: `You survived. You hid Celestin in the attic, lied to the militia leader whose eyes flicked to the ceiling, and later waved Tutsi families through the market roadblock by falsely claiming their identity cards were valid. You actively defied the machinery of the genocide from inside it.

But at the gacaca court in 2007, when the judge asked you to detail the lists you handled as communal secretary and to name the commanders above you, you claimed you remembered nothing. You denied any administrative role in the killings. You had done enough — you survived, you saved lives, and you refused to endanger your family further by becoming an informant in a village where the perpetrators still lived. Celestin knows what you did for him, and he did not challenge your silence. The official court record notes your refusal to testify. You carry the private pride of what you did in the attic and at the checkpoint alongside the quieter weight of what you chose not to say when it might have mattered.`
  },

  {
    id: "rw-hm-outcome-rescue-comply-survived-confessor",
    survived: true,
    conditions: {
      rw_helped_celestin: true,
      rw_complied_at_roadblock: true,
      rw_confessed_complicity: true
    },
    epilogue: `You survived, but the moral cost was immense. When the militia leader knocked and asked about the noise from above, you looked him in the face and misdirected him, keeping Celestin alive in your attic. Yet when they assigned you to the market roadblock, your courage failed. You took the clipboard. You checked the colonial-era identity cards. You separated the Tutsi for the militia and waved them toward their deaths.

At the gacaca court in 2008, accused under Category Two, you did not hide from what you had done. You confessed fully — detailing how you processed the identity cards at the checkpoint and what happened to the people you separated. Celestin testified that you had hidden him in your attic while widows in the crowd listened to you admit to condemning their husbands. Because of your complete confession, your sentence was reduced to community service alongside prison time. You live in a village that knows you hid a man in your attic, and knows what you did at the market roadblock, and knows that you finally told the truth about both.`
  },

  {
    id: "rw-hm-outcome-rescue-comply-survived-minimized",
    survived: true,
    conditions: {
      rw_helped_celestin: true,
      rw_complied_at_roadblock: true,
      rw_minimized_role: true
    },
    epilogue: `You survived. You hid Celestin in the attic and sent the militia away from your door. But when you were assigned to the market roadblock, you broke. You took the clipboard and processed the identity cards, separating the Tutsi families the militia dragged away.

At the gacaca court in 2008, you leaned heavily on Celestin's testimony about the attic while minimizing your crimes at the checkpoint. You told the judges you were terrified — just a communal secretary forced to hold a clipboard, with machetes behind you. The survivors from the market roadblock hissed at your account. They remembered you managing the lists. The judges, weighing your act of rescue in the attic against your compliance at the checkpoint, issued a moderate sentence. You return to your sector carrying the stigma of a man who saved one neighbor and helped condemn others, and who lacked the courage to own all of it in front of the people it cost.`
  },

  {
    id: "rw-hm-outcome-rescue-comply-survived-denied",
    survived: true,
    conditions: {
      rw_helped_celestin: true,
      rw_complied_at_roadblock: true,
      rw_denied_charges: true
    },
    epilogue: `You survived. You hid Celestin in the attic and lied to the militia leader who came to your door. But when you were assigned to the market roadblock, you complied — taking the clipboard and checking the identity cards that sent Tutsi families to their deaths.

When brought before the gacaca court in 2008, you used Celestin's survival as an absolute shield and flatly denied any participation at the checkpoint. You looked at the widows seated in the grass and demanded proof, claiming you were only present and not responsible for what the militia did with the cards you processed. Conflicting witness accounts created enough doubt for an acquittal on the roadblock charges. You were not convicted. But everyone in the sector sat at that same checkpoint. Everyone saw you holding that clipboard. You live inside the gap between what Rwanda's official record says about you and what the neighborhood knows.`
  },

  {
    id: "rw-hm-outcome-compliance-survived-confessor",
    survived: true,
    conditions: {
      rw_staffed_roadblock: true,
      rw_continued_compliance: true,
      rw_confessed_complicity: true
    },
    epilogue: `You survived. When the Hutu Power organizer called your name at the rally and handed you the clipboard, you took it. For days at the market checkpoint, you processed the colonial-era identity cards, separating Tutsi families and managing the lists of addresses as a communal secretary who had become part of the genocide's administrative machinery.

Years later, you sat on the grass as a Category Two accused at the gacaca court. You did not minimize what you had done. You confessed fully — naming the commander who handed you the clipboard at the rally, detailing how you processed the lists, and describing exactly what happened to the people you separated at the checkpoint. The widows in the crowd listened to your full accounting. Because of your complete confession, your sentence was reduced, blending prison time with community service. You live in a village that knows exactly what you did at that roadblock, and also knows that when it came time to account for it, you told the truth without flinching.`
  },

  {
    id: "rw-hm-outcome-compliance-survived-minimized",
    survived: true,
    conditions: {
      rw_staffed_roadblock: true,
      rw_continued_compliance: true,
      rw_minimized_role: true
    },
    epilogue: `You survived. You accepted the clipboard at the rally and spent days at the market checkpoint, processing identity cards and managing the lists of addresses as part of the genocide's bureaucratic machinery.

At the gacaca court, you minimized your role. You told the judges the commander forced you, that you were a frightened communal secretary just holding a clipboard, that you never personally harmed anyone. The survivors in the crowd hissed. They remembered you reading from those lists by name. The judges, facing contradictory witness accounts and your refusal to offer a complete confession, handed down a moderate sentence. You return to your sector bearing the permanent stigma of a man who participated in the slaughter, who had the opportunity to own it fully before a court, and who chose instead to call it circumstance.`
  },

  {
    id: "rw-hm-outcome-compliance-survived-denied",
    survived: true,
    conditions: {
      rw_staffed_roadblock: true,
      rw_continued_compliance: true,
      rw_denied_charges: true
    },
    epilogue: `You survived. You accepted the assignment at the rally and spent days at the market checkpoint, processing the colonial-era identity cards and managing the address lists as a communal secretary embedded in the machinery of the genocide.

When brought before the gacaca court, you denied everything. You looked at the widows seated in the grass and demanded proof. You claimed mistaken identity. You expressed no remorse and refused the reconciliation process the court was built around. Because you showed zero contrition and rejected the system entirely, the judges handed down the maximum available sentence. You were sent to a central prison. You beat no one. You convinced no one. The village that watched you hold that clipboard every morning at the checkpoint watched you be taken away, and they remembered both.`
  },

  // BETRAYAL PATH OUTCOMES (hide Celestin → reveal Celestin → participate → gacaca 04b)
  // HM-1 fix: paths 7-9. Player hid Celestin then broke and revealed him. Must NOT say "misdirected."
  {
    id: "rw-hm-outcome-betrayal-survived-confessor",
    survived: true,
    conditions: {
      rw_helped_celestin: true,
      rw_revealed_celestin: true,
      rw_participated_directly: true,
      rw_confessed_complicity: true
    },
    epilogue: `You survived, but the weight of what you did never left you. You opened your door to Celestin and hid him in the attic. When the militia leader's eyes flicked to the ceiling and the floorboard creaked, you broke. You told them where he was. You heard the machetes from outside. To prove your loyalty afterward, you participated at the roadblock — not just checking cards, but doing what the commander asked of you.

At the gacaca court in 2008, accused under Category Two, you told the full truth. You confessed to revealing Celestin. You confessed to what you did at the roadblock. The court heard you name the commander, describe the process, account for every choice. Celestin's son sat in the crowd. He was old enough to understand. Because you confessed completely, your sentence was reduced — community service alongside prison time. You live in a village that knows you first tried to protect a man and then betrayed him, and that when given the chance to account for it, you did not flinch.`
  },

  {
    id: "rw-hm-outcome-betrayal-survived-minimized",
    survived: true,
    conditions: {
      rw_helped_celestin: true,
      rw_revealed_celestin: true,
      rw_participated_directly: true,
      rw_minimized_role: true
    },
    epilogue: `You survived. You hid Celestin in the attic. When the militia leader pushed and the floorboard creaked, you broke and told them where he was. You heard the machetes. To prove your loyalty afterward, you participated at the roadblock — doing what the commander required of someone who had just proven themselves.

At the gacaca court in 2008, facing Category Two charges, you minimized. You described yourself as a terrified communal secretary who had tried to hide a neighbor and then panicked under direct threat. You asked the court to weigh your initial instinct to shelter Celestin against what came after. The survivors in the crowd did not accept that framing. Neither, entirely, did the judges. Your sentence was moderate. You return to your sector carrying the particular stigma of a man whose first impulse was human and whose second was not, and who could not bring himself to own the second fully.`
  },

  {
    id: "rw-hm-outcome-betrayal-survived-denied",
    survived: true,
    conditions: {
      rw_helped_celestin: true,
      rw_revealed_celestin: true,
      rw_participated_directly: true,
      rw_denied_charges: true
    },
    epilogue: `You survived. You hid Celestin in the attic. When the militia leader's eyes flicked upward and the pressure became unbearable, you broke and revealed where he was hiding. You heard the machetes. To cement your loyalty, you participated at the roadblock.

When brought before the gacaca court in 2008, you denied the roadblock charges entirely. You presented your initial attempt to hide Celestin as proof of your character, erasing what followed from your account. Celestin's son was in the crowd. He knew the sequence of what had happened in that house. The witnesses who had been at the roadblock knew the other half. The court acquitted you on the direct participation charges due to conflicting accounts. You were not convicted. But the village carries both facts — the attic and what came after — and the official record's silence on one of them is not the same as it not having happened.`
  },

  // FLIGHT PATH SURVIVAL OUTCOMES (flee Kigali → countryside → gacaca witness 04d)
  // HM-2 fix: paths 13-15. Player fled to Gitarama, stayed hidden, reached postwar gacaca as witness.
  // ORDER: relocated first (fewest conditions, catches path 15 "no flag" tie-break),
  //        then witness/silent which score higher on their specific gacaca paths.
  {
    id: "rw-hm-outcome-flight-survived-relocated",
    survived: true,
    conditions: {
      rw_fled_kigali: true,
      rw_stayed_hidden: true
    },
    epilogue: `You survived. You sent Celestin away and packed your family into the dark before dawn, driving south through the roadblocks toward your cousin's village near Gitarama. You made it. You stayed. You farmed and kept quiet for eleven years, and your cousin's village became your home.

In 2005, when the gacaca judge came asking questions about Kigali, you moved again. Not far. Another village. A different distance. You had been a communal secretary. You knew things. You had also done nothing — not participated, not resisted, not stayed. You had just left. Rwanda's new identity policy said you were simply Rwandan now. But your children still asked why you left Kigali. Your wife still flinched at the radio. You relocated because it was the only answer you had ever known how to give.`
  },

  {
    id: "rw-hm-outcome-flight-survived-witness",
    survived: true,
    conditions: {
      rw_fled_kigali: true,
      rw_stayed_hidden: true,
      rw_testified_as_witness: true
    },
    epilogue: `You survived. When the radio announced the president's death and Celestin knocked at your door, you sent him away and packed your family before dawn. You abandoned your post as communal secretary and fled south through the smoke toward your cousin's village near Gitarama. You hid there — farming, staying quiet, avoiding the village meetings, listening to the dogs and the rumors — through all hundred days.

In 2005, when the gacaca judge came to your cousin's village asking for testimony about what had happened in Kigali, you agreed to speak. Not as a perpetrator. As a witness. You described the lists you had seen as communal secretary, the administrative structure of the roadblocks, the names of the commanders. You gave the court the bureaucratic map of what had happened from the inside of the system you had fled. You did not kill anyone. You did not save anyone. You ran. The testimony you gave afterward was the only thing you had left to offer, and you gave it.`
  },

  {
    id: "rw-hm-outcome-flight-survived-silent",
    survived: true,
    conditions: {
      rw_fled_kigali: true,
      rw_stayed_hidden: true,
      rw_refused_testimony: true
    },
    epilogue: `You survived. You turned Celestin away at the door and fled before dawn with your wife and children, south through the checkpoints and the smoke toward your cousin's village near Gitarama. You survived the hundred days in the countryside — hidden, quiet, doing farm work, staying away from the Hutu Power meetings, never knowing if Celestin made it.

In 2005, when the gacaca judge came to the village asking for testimony about Kigali, you refused. You had been a communal secretary. You knew things — the lists, the chain of command, the structure of the roadblocks. But you had also fled. You had not participated. You had not saved anyone. You had simply left, and you had kept leaving in every direction that meant not having to account for what you knew. Your silence was not innocence. It was the shape of the choice you had made in April 1994, extended forward through the years that followed.`
  },

  // DEATH OUTCOMES (Occurring BEFORE gacaca courts)
  {
    id: "rw-hm-outcome-rescue-misdirected-killed",
    survived: false,
    conditions: {
      rw_helped_celestin: true,
      rw_misdirected_militia: true
    },
    deathContext: {
      cause: "Killed during or after the genocide before gacaca proceedings",
      historicalRate: "Thousands of Hutu moderates who sheltered Tutsi were killed if discovered",
      yourChoices: "You hid Celestin and misdirected the militia. You were identified."
    },
    deathEpilogueEarly: `You didn't survive. You hid Celestin in your attic and looked the militia leader in the face when his eyes flicked to the ceiling, sending him to another house instead. In the days that followed, you were assigned to the market roadblock — and whether you held the line there or broke under the pressure and followed orders, it made no difference in the end. The Interahamwe traced the misdirection back to you.

You were killed before the RPF could reach the city, identified as the kind of Hutu moderate the genocide's architects had placed on lists weeks before it began. You died during the hundred days themselves, long before the gacaca courts opened in 2005 to pursue justice. You never stood before a judge. You never heard whether Celestin survived. The choices you made at the checkpoint — in either direction — died with you, unrecorded.`
  },

  {
    id: "rw-hm-outcome-rescue-revealed-killed",
    survived: false,
    conditions: {
      rw_helped_celestin: true,
      rw_revealed_celestin: true
    },
    deathContext: {
      cause: "Killed during or after the genocide before gacaca proceedings",
      historicalRate: "Many who initially sheltered Tutsi but later complied were still targeted",
      yourChoices: "You hid Celestin, then revealed him, then participated. You were identified."
    },
    deathEpilogueEarly: `You didn't survive. You opened your door to Celestin and hid him in the attic. But when the militia leader pushed and your wife gripped your arm and the floorboard creaked above you, you broke. You told them where Celestin was. You heard the machetes. To prove your loyalty afterward, you stood at the roadblock.

Participating in the machinery did not save you. You were killed during the RPF advance in the summer of 1994, executed as a perpetrator before the genocide officially ended. You never saw the gacaca courts. You died carrying the specific, unresolvable weight of having hidden a man in your ceiling and then told armed men where to find him. There was no process after. No confession. No judgment. Only what you did, and then the silence.`
  },

  {
    id: "rw-hm-outcome-compliance-killed",
    survived: false,
    conditions: {
      rw_staffed_roadblock: true
    },
    deathContext: {
      cause: "Killed during or after the genocide before gacaca proceedings",
      historicalRate: "Thousands of Hutu perpetrators were killed or died before the gacaca courts opened in 2005",
      yourChoices: "You staffed the roadblock and followed orders. You were identified before you could claim you were forced."
    },
    deathEpilogueEarly: `You didn't survive. When the Hutu Power organizer called your name at the rally, you took the clipboard. You spent your final days at the market checkpoint, processing the colonial-era identity cards and managing the address lists for the militia commander.

You were killed during the RPF advance in July 1994 as they captured Kigali. The courts that would have heard your case — the gacaca proceedings that began in 2005 — never came. You never stood before the survivors in the grass. You never had the chance to confess or to claim you were forced or to fight the charges. You died as an active participant in the genocide's bureaucratic machinery, at a checkpoint you had chosen to staff, before any process existed to make sense of what you had done.`
  },

  {
    id: "rw-hm-outcome-flight-killed",
    survived: false,
    conditions: {
      rw_fled_kigali: true
    },
    deathContext: {
      cause: "Killed during the genocide after fleeing Kigali",
      historicalRate: "Thousands of Tutsi and Hutu moderates were killed at roadblocks while attempting to flee Kigali",
      yourChoices: "You told Celestin to leave, packed your family, and fled before dawn toward Gitarama. You were identified at a rural checkpoint."
    },
    deathEpilogueEarly: `You didn't survive. When the radio announced the president's death and the smoke began rising over Kigali, you turned Celestin away and packed your family before dawn. You abandoned your post as communal secretary and fled south toward your cousin's village near Gitarama, moving through the dark while the city burned behind you.

But the genocide reached everywhere the roads did. You were stopped at a rural checkpoint during the hundred days of killing. Because you were an educated moderate from Kigali who had abandoned his post — a communal secretary who had refused to attend the last Hutu Power rally, whose name was on lists — the local Interahamwe did not wave you through. You died trying to outrun the machinery of the genocide on a country road, long before the RPF captured Kigali and the killing stopped. You never made it to Gitarama. You never saw your cousin's farm. The flight that felt like survival was not.`
  }
];

// Export role data
export default {
  scenes: hutuModerateScenes,
  outcomes: hutuModerateOutcomes
};
