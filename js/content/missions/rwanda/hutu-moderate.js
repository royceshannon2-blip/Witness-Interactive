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
  // GAP 1 FIX: Misdirection path that ends at death checkpoint before roadblock
  {
    id: "rw-hm-outcome-rescue-misdirected-survived",
    survived: true,
    conditions: {
      rw_helped_celestin: true,
      rw_misdirected_militia: true
    },
    epilogue: `You survived. You hid Celestin when he came to your door that first night, and when the militia came searching, you lied to their faces. You misdirected them to another house. They believed you. Celestin fled before they came back. You never reached the roadblock scene — the story ended before you had to make that choice.

The gacaca courts asked about the militia visit thirteen years later. You told them what you did. The mitigation is real: you lied to Interahamwe to protect a Tutsi neighbor. The record shows that. Category Two charges were filed based on your position as communal secretary, but the testimony about misdirecting the militia reduced your sentence to community service.

Celestin survived. He testified on your behalf at the hearing. His wife and children were killed at a different roadblock you had no control over. He knows you tried. He knows you stopped at misdirection, never knowing what you would have done if the militia had come back, if you'd been assigned to a roadblock anyway, if the choices had continued past that moment.

You carry the weight of having stopped there — not resolution, but the specific uncertainty of a path that ended before its final test. Rwanda's reconciliation asks you to live with what you did and what you didn't have to do. You do. One week at a time.`
  },
  {
    id: "rw-hm-outcome-rescue-misdirected-killed",
    survived: false,
    conditions: {
      rw_helped_celestin: true,
      rw_misdirected_militia: true
    },
    deathContext: {
      cause: "Killed during the genocide after being identified as someone who protected Tutsi",
      historicalRate: "Hutu who lied to Interahamwe and were discovered were killed immediately — discovery of deception carried the same death sentence as sheltering Tutsi",
      yourChoices: "You hid Celestin and lied to the militia when they came. Your protection of a Tutsi neighbor was eventually discovered."
    },
    epilogue: `You didn't survive. You hid Celestin and misdirected the militia when they came to your door. You lied to Interahamwe. Celestin fled. Your deception was eventually discovered — a neighbor saw, or someone talked, or the militia returned and searched more carefully. The discovery of your lie carried the same death sentence as sheltering Tutsi directly.

The militia made an example of you. Whether this happened at a roadblock where you were identified, during a house search, or in the chaotic violence of the genocide's final weeks, the outcome was the same. You were killed for protecting a Tutsi neighbor. The specific moment matters less than the fact of it.

Celestin survived. The gacaca courts recorded your name posthumously in 2007 in the category of Hutu moderates killed for protecting Tutsi. Your children grew up knowing what you did — that you lied to armed militia to save a neighbor, that you were discovered, that you died for it.

The historical record classifies you among those who resisted and paid the price. Your family knows you hid Celestin, that you lied when the militia came, that your courage was discovered and punished. You died for that choice, carrying it to whatever end found you.`
  },
  {
    id: "rw-hm-outcome-flight-survived",
    survived: true,
    conditions: {
      rw_fled_kigali: true,
      rw_stayed_hidden: true
    },
    epilogue: `You survived. You left before the worst began. Your cousin's village near Gitarama was quieter — genocide was there too, but you were invisible. Not participating. Not resisting. Just gone. When the RPF captured Kigali in July 1994 and the genocide ended after 100 days, you were alive in a place no one was looking for you.

The years after were complicated in a different way. You didn't kill anyone. You didn't staff roadblocks. You also didn't help anyone. Celestin — you told him to leave that night. You never learned what happened to him. That uncertainty is its own weight.

Rwanda's post-genocide government declared a single identity: Rwandan. No Hutu. No Tutsi. You relocated — maybe back to Kigali briefly in 1997, maybe to another village entirely. Your house was occupied by strangers. Your position was gone. A gacaca judge visited asking for testimony. You knew things — lists, names, who organized what. Some people who fled testified. Some stayed silent. Some relocated again to avoid the questions entirely. You had to decide whether that knowledge was yours to keep or yours to give, whether to stay or to move again.

The gacaca courts ran until 2012. You were a bystander who fled. History records bystanders in complicated ways. You carried that ambiguity forward — the weight of what you didn't do, the uncertainty of what happened to those you left behind, the choice of whether to speak or stay silent or simply disappear into Rwanda's new identity.`
  },

  {
    id: "rw-hm-outcome-flight-witness-survived",
    survived: true,
    conditions: {
      rw_fled_kigali: true,
      rw_testified_as_witness: true,
      rw_stayed_hidden: true
    },
    epilogue: `You survived. You fled Kigali before the worst began, and you testified when the gacaca courts came to your village. You knew things — communal secretary, access to records, knowledge of who organized what. You gave it. Names. Structures. How the roadblocks were coordinated. You didn't participate. You also didn't look away entirely.

The gacaca courts ran from 2005 to 2012 across roughly 12,000 community sites. Lay judges — your neighbors — heard testimony from perpetrators and witnesses alike. Your information helped place people at specific locations on specific dates. Three convictions came from evidence you provided.

You didn't return to Kigali. The person you were there — communal secretary, list-keeper, the wrong kind of Hutu — didn't fit the person you were trying to become. You farmed. You watched your children grow up with the national curriculum that said "no ethnicity," only "Rwandan." They believe it more than you do. That might be the point. Rwanda is being built for them, not for you. You carry 1994 quietly. You did what you could with what you knew. That's the most honest thing you can say about it.`
  },

  {
    id: "rw-hm-outcome-flight-silent-survived",
    survived: true,
    conditions: {
      rw_fled_kigali: true,
      rw_refused_testimony: true,
      rw_stayed_hidden: true
    },
    epilogue: `You survived. You fled and you stayed quiet. When the gacaca judge came to your village asking what you knew about the coordination of roadblocks in Kigali, you said you didn't remember. That was a lie. You were a communal secretary. You remembered everything.

Some survivors were protected when they testified. Some were intimidated into silence by perpetrators who returned to the same communities. Some witnesses were killed before they could speak. You chose silence for your own reasons. Maybe fear. Maybe exhaustion. Maybe because naming names felt like choosing sides in a country that had officially abolished sides.

The gacaca courts closed in 2012 without your testimony. The records have gaps where your knowledge would have been. Some perpetrators were acquitted for lack of evidence you could have provided. You don't know their names. You carry that without quite knowing what to call it. Rwanda rebuilt itself around you. You rebuilt yourself around what you didn't say. Both are still standing.`
  },

  {
    id: "rw-hm-outcome-rescue-survived-confessor",
    survived: true,
    conditions: {
      rw_helped_celestin: true,
      rw_saved_at_roadblock: true,
      rw_full_confession: true
    },
    epilogue: `You survived. Celestin survived. You hid him, misdirected the militia, falsified cards at the roadblock. And then, thirteen years later at the gacaca court, you told the whole truth—what you did, what you couldn't do, who you saved, who you couldn't reach. The judges gave you community service. Celestin's son sat in the front row and listened to every word.

The confession cost you more than the hiding did. The hiding was fear. The confession was choice. You named names. You described the machinery. You said, publicly and on record, that you were part of a system you tried to subvert. Some perpetrators called you a traitor for helping Tutsi. Survivors called you a traitor for participating at all, even with falsified cards. Both were partly right.

Celestin's wife and two children were killed at a roadblock you couldn't control. He knows you tried. He knows you told the truth. Whether that constitutes forgiveness is his to decide, not yours. Rwanda's reconciliation asks you to live next to the weight of what happened. You confessed. You did your community service. You still flinch at the sound of truck engines. You carried all of it forward.`
  },

  {
    id: "rw-hm-outcome-rescue-survived-denied",
    survived: true,
    conditions: {
      rw_helped_celestin: true,
      rw_saved_at_roadblock: true,
      rw_denied_participation: true
    },
    epilogue: `You survived. You hid Celestin. You falsified cards at the roadblock. And then at the gacaca court you denied the parts that felt too dangerous to admit — not the saving, but the context around it. The lists you had access to as communal secretary. The names you knew. The things you saw and didn't report. You told the court what made you look like a resister and omitted what complicated that story.

The judges accepted it. You weren't on trial — you were a witness, and witnesses weren't required to incriminate themselves. The gacaca system had no mechanism to compel full disclosure from people it wasn't charging. You used that gap.

Celestin testified about what you did for him. That testimony is in the record alongside your incomplete account. Researchers who study the gacaca archives can read both. The gap between them is visible to anyone who looks. You saved Celestin's life and you protected your own reputation at the same time. Both are true. You carry the complete truth privately. The record carries the version you gave it. Rwanda asks its citizens to live with exactly that kind of complexity, one week at a time.`
  },

  {
    id: "rw-hm-outcome-rescue-survived-partial",
    survived: true,
    conditions: {
      rw_helped_celestin: true,
      rw_saved_at_roadblock: true,
      rw_partial_confession: true
    },
    epilogue: `You survived. Celestin survived. You hid him, misdirected the militia, falsified cards at the roadblock. And at the gacaca court you told part of the truth — the part about hiding Celestin, the part about the cards. You didn't tell everything. You left out the names you knew from the communal secretary records. The meetings you'd attended before you decided to resist. The things you'd seen before you decided to act.

The judges accepted the partial account. You received community service. Celestin testified fully — he didn't know what you'd omitted. His testimony covered what he'd witnessed, which was your courage. The parts you left out were things he hadn't seen.

Rwanda's reconciliation process was designed for full confession. You gave a partial one and received the same reduced sentence. The system worked as designed — incentivize disclosure, accept what comes. What you kept to yourself stays with you. The record has the version you gave it. You carry the rest privately. Whether that's guilt or pragmatism, only you can say.`
  },

  {
    id: "rw-hm-outcome-compliance-survived-confessor",
    survived: true,
    conditions: {
      rw_staffed_roadblock: true,
      rw_continued_compliance: true,
      rw_confessed_complicity: true
    },
    epilogue: `You survived. You attended the rally, staffed the roadblock, checked cards for days. You didn't ask where the people were taken. You confessed this at the gacaca court—all of it, without minimizing. Category Two: participation in killings. Multiple witnesses confirmed what you said before they said it themselves.

The confession bought you community service instead of prison. You rebuilt homes. You attended reconciliation meetings. You said the words. Some were true. Some felt like performance. The gacaca courts ran from 2005 to 2012, and every session was a renegotiation of what accountability means in a country trying to stay alive.

Celestin's son knows what you did. You live in the same sector. You see each other at the market. He doesn't speak to you. You don't blame him. You confessed because the gacaca system offered reduced sentences, and because part of you needed someone to hear it. Both reasons were true at the same time. Rwanda's new identity says you're just Rwandan now. You know what you were in April 1994. You carry that forward, one week at a time.`
  },

  {
    id: "rw-hm-outcome-compliance-survived-denied",
    survived: true,
    conditions: {
      rw_staffed_roadblock: true,
      rw_continued_compliance: true,
      rw_denied_charges: true
    },
    epilogue: `You survived. You attended the rally, staffed the roadblock, checked cards for days. At the gacaca court you denied everything. Claimed you were forced. Claimed you had no choice. The judges heard this many times — it was the most common defense. Some perpetrators who denied were convicted anyway when witnesses outnumbered them. Some were acquitted for lack of evidence.

You were acquitted. Not enough witnesses willing to testify against you specifically. The gacaca record shows your name, the charges, and the outcome: insufficient evidence. That record is public. Anyone in Rwanda can access it. Your children can access it. Celestin's son can access it.

Rwanda's reconciliation process asked perpetrators to confess in exchange for reduced sentences. You didn't take that offer. You live with the acquittal and everything it didn't resolve. The gacaca courts closed in 2012. The cases they couldn't close stayed open in other ways — in the market, in the sector meetings, in the faces of people who were there and remember what you did regardless of what the record says. You carry that forward. The record says one thing. The neighborhood knows another.`
  },

  {
    id: "rw-hm-outcome-compliance-survived-minimized",
    survived: true,
    conditions: {
      rw_staffed_roadblock: true,
      rw_continued_compliance: true,
      rw_minimized_role: true
    },
    epilogue: `You survived. You attended the rally, staffed the roadblock, checked cards for days. At the gacaca court you claimed you were forced. That you had no choice. That you were following orders from people above you who gave you no alternative. Some of this was true. None of it was the whole truth.

The gacaca judges heard partial confessions like yours constantly — the kind that acknowledged presence without acknowledging agency. They gave you a reduced sentence anyway. Community service. Eighteen months rebuilding infrastructure in the sector where you'd staffed the roadblock. You worked next to survivors who knew exactly what you'd done and exactly what you'd said at the court. They didn't speak to you. You didn't blame them.

Rwanda's reconciliation process was designed for full confessions, not partial ones. The reduced sentence was the incentive to tell the whole truth. You took the reduced sentence and gave a partial truth. The system accepted it because it needed to keep moving. You live in what that acceptance cost everyone, including you. Some things don't get resolved by a court's decision. You carry the partial accounting forward, one week at a time.`
  },

  {
    id: "rw-hm-outcome-compliance-killed-denied",
    survived: false,
    conditions: {
      rw_staffed_roadblock: true,
      rw_continued_compliance: true
    },
    deathContext: {
      cause: "Killed during or after the genocide before gacaca proceedings",
      historicalRate: "Thousands of perpetrators were killed by RPF forces or in acts of revenge before the gacaca courts began in 2005",
      yourChoices: "You staffed the roadblock and followed orders. You were identified by survivors."
    },
    epilogue: `You didn't survive to deny anything. You staffed the roadblock, checked cards, followed orders. Survivors identified you — to RPF soldiers during the advance, or in the weeks and months afterward when the accounting began. You were on the lists. Multiple witnesses.

The gacaca courts didn't open until 2005. You didn't reach 2005. What happened to you during the RPF advance, in the immediate aftermath, or in the years of violence that followed was documented in RPF records and later in ICTR proceedings as part of the broader accounting. Your death is noted. The charges that would have been filed against you are noted alongside it.

Your family fled to Zaire. Your children grew up in the camps. They came back in 1996 when the camps collapsed. They were told you were a victim. Survivors in the sector knew otherwise. The gacaca record lists the charges and notes that you died before proceedings. That is the official account. The neighborhood account is more specific. Both exist. Neither resolves the other.`
  },

  {
    id: "rw-hm-outcome-compliance-killed-minimized",
    survived: false,
    conditions: {
      rw_staffed_roadblock: true,
      rw_continued_compliance: true,
      rw_minimized_role: true
    },
    deathContext: {
      cause: "Killed during or after the genocide before gacaca proceedings",
      historicalRate: "Thousands of Hutu perpetrators were killed or died before the gacaca courts opened in 2005",
      yourChoices: "You staffed the roadblock and followed orders. You were identified before you could claim you were forced."
    },
    epilogue: `You didn't survive to claim you were forced. You attended the rally, staffed the roadblock, checked cards for days. Survivors identified you — naming people, describing what happened at specific locations on specific dates. Your name came up. Whether you were killed during the RPF advance, in the immediate aftermath, or in the years of violence that followed, you never reached the gacaca courts.

You never got to court. You never got to explain the coercion, the pressure, the lack of alternatives. Those arguments might have worked — gacaca courts did reduce sentences for perpetrators who could demonstrate they'd been threatened into participation. You didn't get the chance to make the case.

The gacaca record lists you as a perpetrator killed before proceedings. Category Two. No mitigating testimony on file because there was no hearing. Your family fled to Zaire. Your children came back in 1996. The charges and the outcome are in the record. The context you would have provided is not. That's the version that exists.`
  },

  {
    id: "rw-hm-outcome-flight-killed",
    survived: false,
    conditions: {
      rw_fled_kigali: true
    },
    deathContext: {
      cause: "Killed during the genocide after fleeing Kigali",
      historicalRate: "Thousands of Tutsi and Hutu moderates were killed at roadblocks while attempting to flee Kigali in the first days of the genocide",
      yourChoices: "You told Celestin to leave and fled before dawn. The roads out of Kigali were controlled by Interahamwe."
    },
    epilogue: `You didn't survive. You fled before dawn — told Celestin to go, packed your family, took the road toward Gitarama. The roadblocks were everywhere. Identity cards. Machetes. The Interahamwe had been positioned on every route out of Kigali and throughout the countryside. You were on lists — communal secretary who refused the rally, moderate who wouldn't participate.

Your family was separated from you during the flight. Your wife and children made it to Gitarama — Hutu cards, no flags against them. You were identified as a moderate. Whether at a roadblock in the first days, during the chaos of the RPF advance, or in the violence that followed, you were killed for who you were and what you refused to do.

The gacaca courts later recorded your name in the category of Hutu moderates killed during the genocide — people who neither participated nor resisted, who simply tried to leave and couldn't. Your children grew up knowing you tried to protect them by leaving. That you were killed for who you were, not for what you did. You carried that identity to the end.`
  },

  {
    id: "rw-hm-outcome-revealed-participated-survived",
    survived: true,
    conditions: {
      rw_helped_celestin: true,
      rw_revealed_celestin: true,
      rw_participated_directly: true
    },
    epilogue: `You survived. You hid Celestin first — brought him in, told him he was safe. Then you revealed him. The militia dragged him out of your attic. You heard what happened. Then you went to the roadblock and you participated. Not just checked cards. Participated. You told yourself the first choice cancelled out the second. It didn't work that way.

The gacaca courts have a specific category for people like you: Category One if you organized or planned; Category Two if you participated directly. You were Category Two. Multiple witnesses. The judges didn't care that you'd hidden Celestin first. The law looks at what you did across the whole period, not just the moment that makes you look better.

You confessed or denied — either way the witnesses were consistent. You received a sentence. Community service, if you confessed enough. Prison, if you didn't. Either way you came back to a sector where people knew both things about you: that you hid Celestin and that you revealed him. Rwanda's reconciliation asks you to live with both. You do. One week at a time.`
  },

  {
    id: "rw-hm-outcome-revealed-participated-killed",
    survived: false,
    conditions: {
      rw_helped_celestin: true,
      rw_revealed_celestin: true,
      rw_participated_directly: true
    },
    deathContext: {
      cause: "Killed during or after the genocide",
      historicalRate: "Thousands of Hutu perpetrators were killed by RPF forces as they captured territory in July 1994",
      yourChoices: "You hid Celestin then revealed him. You participated directly in killings at the roadblock. You were identified."
    },
    epilogue: `You didn't survive. You hid Celestin and then you revealed him. Both things happened. You participated at the roadblock after that — not reluctantly, not under immediate threat, but because the machinery was moving and you moved with it. Survivors identified you. Witnesses had been talking. Your name was on the lists for the roadblock. What happened to Celestin was also documented — neighbors had seen.

Whether you were killed during the RPF advance, in the immediate aftermath, or in the violence that followed, you never reached the gacaca courts. You were identified as a Category Two perpetrator. The end came before any accounting could happen.

The gacaca courts recorded the charges posthumously. Category Two perpetrator, killed before proceedings. The record notes that witnesses also described you hiding Celestin in the first days. Both entries are in the same file. Celestin's son can read it. Your children can read it. The file holds both things without resolving them. That's the only kind of accounting Rwanda has for people who did both.`
  },

  {
    id: "rw-hm-outcome-rescue-comply-survived-confessor",
    survived: true,
    conditions: {
      rw_helped_celestin: true,
      rw_complied_at_roadblock: true,
      rw_confessed_complicity: true
    },
    epilogue: `You survived. You hid Celestin — that part is true. You misdirected the militia when they came to your door. Then at the roadblock you followed orders. You checked identity cards and waved people through to their deaths. You told yourself you'd already done enough by hiding Celestin. You told yourself the balance was even. The gacaca courts did not agree with that accounting.

You confessed. Fully, at the hearing. You described what you did at the roadblock — not the hiding, the other part. The judges gave you community service. Celestin testified on your behalf about the attic. His testimony and the witnesses from the roadblock sit in the same file. Both are true. Neither cancels the other.

Rwanda's reconciliation asks you to hold contradictions without resolving them. You hid a man and then you helped kill others. You confessed to the second part. Celestin's son knows both things about you. You live in the same sector. He doesn't speak to you about either. You carry both forward.`
  },

  {
    id: "rw-hm-outcome-rescue-comply-survived-minimized",
    survived: true,
    conditions: {
      rw_helped_celestin: true,
      rw_complied_at_roadblock: true,
      rw_minimized_role: true
    },
    epilogue: `You survived. You hid Celestin, misdirected the militia, and then at the roadblock you followed orders. At the gacaca court you claimed you were forced. That you had no choice once you were assigned to the checkpoint. You emphasized the hiding, minimized the compliance. The judges had heard this pattern before.

You received a reduced sentence. Community service. The reduction came partly from Celestin's testimony — he spoke about the attic, about the risk you took. The judges weighed that against the roadblock witnesses. The accounting was complicated. It always is when someone did both.

You did your community service. You rebuilt homes in the sector where you'd staffed the roadblock. Survivors worked alongside you who recognized you from the checkpoint. Some spoke to you. Some didn't. The gacaca record shows Category Two with mitigating circumstances. That's the official version. Everyone in the sector knows both the mitigation and the circumstance.`
  },

  {
    id: "rw-hm-outcome-rescue-comply-survived-denied",
    survived: true,
    conditions: {
      rw_helped_celestin: true,
      rw_complied_at_roadblock: true,
      rw_denied_charges: true
    },
    epilogue: `You survived. You hid Celestin. You also followed orders at the roadblock. At the gacaca court you denied the second part — claimed the witnesses were wrong, claimed you'd only been present, not participating. Celestin testified about the attic. You hoped that would be enough. It wasn't, quite.

The judges acquitted you on the roadblock charges — insufficient evidence to convict specifically. The denial worked, legally. The roadblock witnesses described a man matching your description but couldn't all agree on the specific moments. The record shows acquittal.

What the record doesn't show is the sector's memory. People who were at that checkpoint remember you. Celestin knows about the attic. He also knows what people say about the roadblock. He's never asked you directly. You've never offered. Rwanda's official identity says you're just Rwandan now — no categories, no distinctions. The unofficial memory is more specific. You live inside the gap between the two.`
  },


];

// Export role data
export default {
  scenes: hutuModerateScenes,
  outcomes: hutuModerateOutcomes
};
