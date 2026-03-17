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
    epilogue: `You survived. You successfully hid Celestin in the attic when the militia knocked, and you misdirected the commander who came looking for "cockroaches." Later, at the market roadblock, you risked your life to wave Tutsi families through by falsely claiming their identity cards were valid. You actively resisted the genocide from inside the machinery.

At the gacaca court, you held nothing back. You detailed the lists you saw as a communal secretary, named the commander who ran the market roadblock, and confessed how the system worked. Celestin testified on your behalf, telling the village how you hid him while your children stayed silent. You helped convict the architects of the local massacres. You are known in Kigali as a righteous man, a Hutu who chose humanity when it meant death.`
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
    epilogue: `You survived. You hid Celestin in the attic and misdirected the militia leader whose eyes flicked upward at the creaking floorboard. At the market roadblock, your shaking hands handed back Tutsi identity cards, falsely claiming they were valid. 

At the gacaca court, you testified to your heroics but held back the names of the militia commanders. You knew they still lived nearby, and you feared retaliation against your wife and children. Celestin watched you omit the darkest truths of your time as communal secretary. The court accepted your testimony, but the village knows there are gaps. You walk a delicate line in the new Rwanda—a savior who couldn't afford to be a complete witness.`
  },

  {
    id: "rw-hm-outcome-rescue-survived-denied",
    survived: true,
    conditions: {
      rw_helped_celestin: true,
      rw_misdirected_militia: true,
      rw_saved_at_roadblock: true,
      rw_denied_knowledge: true
    },
    epilogue: `You survived. You saved Celestin by hiding him in the attic and lying to the militia leader who came to your door. You saved families at the market roadblock by falsifying identity checks. But the trauma of those days broke your willingness to participate in the aftermath.

At the gacaca court, when asked to detail the lists you handled as a communal secretary, you claimed you remembered nothing. You denied knowledge of the organizers. You had done enough by surviving and saving lives; you refused to endanger your family further by becoming an informant. Celestin knows what you did for him, but the official court record only notes your refusal to testify. You carry the guilt of silence alongside the pride of having saved lives.`
  },

  {
    id: "rw-hm-outcome-rescue-comply-survived-confessor",
    survived: true,
    conditions: {
      rw_helped_celestin: true,
      rw_complied_at_roadblock: true,
      rw_confessed_complicity: true
    },
    epilogue: `You survived, but the moral cost was immense. You hid Celestin in your attic and lied to the militia to protect him. Yet, when assigned to the market roadblock, your courage failed. When the commander handed you the clipboard and watched you check identity cards, you waved the Tutsi through to be killed, participating in the very machinery you had just defied.

At the gacaca court as a Category Two accused, you didn't hide from what you became. You confessed fully, detailing how you processed the lists and separated the families at the market. Celestin testified that you saved him, while widows in the crowd listened to you admit to condemning their husbands. Because of your complete confession, your sentence was reduced. You live in a village that knows exactly what you did, and exactly what you saved.`
  },

  {
    id: "rw-hm-outcome-rescue-comply-survived-minimized",
    survived: true,
    conditions: {
      rw_helped_celestin: true,
      rw_complied_at_roadblock: true,
      rw_minimized_role: true
    },
    epilogue: `You survived. You successfully hid Celestin in the attic, but when you were forced to staff the market roadblock, you broke under the pressure. You checked the colonial identity cards and separated the Tutsi, letting the militia drag them away.

At the gacaca court, you leaned heavily on Celestin's testimony of your heroism while minimizing your crimes. You claimed the commander forced you, that you were just a terrified communal secretary holding a clipboard. The survivors from the market roadblock hissed at your excuses. The judges, weighing your lifesaving actions in the attic against your participation at the checkpoint, gave you a moderate sentence. You return to your sector bearing the stigma of a man who participated in the slaughter and lacked the courage to fully own up to it.`
  },

  {
    id: "rw-hm-outcome-rescue-comply-survived-denied",
    survived: true,
    conditions: {
      rw_helped_celestin: true,
      rw_complied_at_roadblock: true,
      rw_denied_charges: true
    },
    epilogue: `You survived. You hid Celestin in the attic, but when you went to the market roadblock, you followed the commander's orders and checked the identity cards that sent Tutsi families to their deaths.

When brought before the gacaca court, you used Celestin's survival as your absolute shield and flatly denied participating at the roadblock. You looked at the widows in the grass and demanded proof, claiming you were only present, not participating. Due to conflicting witness accounts, you were acquitted on the roadblock charges. You beat the system legally, but everyone in the sector remembers you holding that clipboard. You live inside the gap between Rwanda's official record and the neighborhood's memory.`
  },

  {
    id: "rw-hm-outcome-compliance-survived-confessor",
    survived: true,
    conditions: {
      rw_staffed_roadblock: true,
      rw_continued_compliance: true,
      rw_confessed_complicity: true
    },
    epilogue: `You survived. When the Hutu Power organizer called your name at the rally, you accepted the clipboard. You staffed the market roadblock. You checked the colonial-era identity cards, separating Tutsi to be killed by the militia. You survived by becoming part of the genocide's bureaucracy.

Years later, you sat on the grass as a Category Two accused at the gacaca court. You didn't hide. You confessed fully, naming the commander who gave you the clipboard and detailing exactly how you processed the lists as a communal secretary. The widows in the crowd listened to your full accounting. Because of your complete confession, your sentence was reduced, blending prison time with community service. You live in a village that knows exactly what you did, but also knows you finally told the truth.`
  },

  {
    id: "rw-hm-outcome-compliance-survived-minimized",
    survived: true,
    conditions: {
      rw_staffed_roadblock: true,
      rw_continued_compliance: true,
      rw_minimized_role: true
    },
    epilogue: `You survived. You staffed the market roadblock after accepting the assignment at the rally, checking identity cards and letting the militia take the Tutsi away. 

At the gacaca court, you minimized your role. You claimed the commander forced you, that you never actually touched a machete, that you were just a terrified secretary holding a clipboard. The survivors in the crowd hissed. They remembered you managing the lists. The judges, lacking the full truth and facing contradictory witness statements, gave you a moderate sentence. You return to your sector bearing the stigma of an unrepentant participant who lacked the courage to own their actions.`
  },

  {
    id: "rw-hm-outcome-compliance-survived-denied",
    survived: true,
    conditions: {
      rw_staffed_roadblock: true,
      rw_continued_compliance: true,
      rw_denied_charges: true
    },
    epilogue: `You survived. You staffed the roadblock, managing the lists of addresses and identifying the Tutsi for the militia commander. 

When brought before the gacaca court, you flatly denied everything. You looked at the widows in the grass and demanded proof. You claimed you were home, that you were mistaken for someone else. Your arrogant denial outraged the community. Because you showed zero remorse and refused the reconciliation process, the judges handed down the maximum penalty. You were sent to a central prison, an unrepentant cog in the bureaucratic machinery of the genocide.`
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
    deathEpilogueEarly: `You didn't survive. You made the brave choice to hide Celestin in your attic, and you misdirected the militia commander who knocked on your door. But secrets rarely lasted in Kigali. 

Before the genocide ended, the Interahamwe discovered your deception. You were executed for sheltering a Tutsi, paying the ultimate price for your humanity. Your death happened during the hundred days of slaughter, long before the gacaca courts were established to seek justice. You died as a moderate who refused to let your neighbor be murdered.`
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
    deathEpilogueEarly: `You didn't survive. You initially hid Celestin in your attic, but when the militia commander pushed, you broke. You revealed his location, letting them drag your neighbor out. To prove your loyalty afterward, you participated at the roadblock. 

Despite joining the machinery of the genocide, it didn't save you. You were killed during the RPF advance in the summer of 1994, executed as a perpetrator before the genocide officially ended. You never saw the gacaca courts. You died carrying the horrific guilt of betraying the man hiding in your ceiling.`
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
    deathEpilogueEarly: `You didn't survive. When your name was called at the rally, you took the clipboard. You spent your final weeks staffing the market roadblock, checking identity cards and separating Tutsi for the militia. 

You were killed during the RPF advance in July 1994 as they captured Kigali and summarily executed known perpetrators. Your death occurred in the chaos of the war's end, long before the gacaca courts opened in 2005. You never got the chance to stand before the widows, to confess, or to make excuses. You died as an active participant in the genocide.`
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
      yourChoices: "You told Celestin to leave, packed your family, and fled before dawn. You were identified."
    },
    deathEpilogueEarly: `You didn't survive. When the radio announced the president's death, you turned Celestin away and fled Kigali with your wife and children before dawn. You abandoned your post as communal secretary and ran toward Gitarama. 

But the genocide was everywhere. You were caught at a rural roadblock during the 100 days of slaughter, long before the gacaca courts opened. Because you were an educated moderate from the capital who had abandoned your post, the local Interahamwe targeted you. You died trying to outrun the machinery of the genocide.`
  }
];-

// Export role data
export default {
  scenes: hutuModerateScenes,
  outcomes: hutuModerateOutcomes
};
