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
    atmosphericEffect: "smoke",
    ambientTrack: null,
    narratorAudio: "audio/narration/hutu-moderate/rw-hm-scene-01.mp3",
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
        consequences: { rw_attended_rally: true },
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
        consequences: { rw_revealed_celestin: true },
        nextScene: "rw-hm-scene-03b"
      }
    ]
  },

  {
    id: "rw-hm-scene-02b",
    narrative: `April 7, evening. The rally is at the communal office. Hundreds of men, some with machetes already. The speaker—a local Hutu Power organizer—shouts about the RPF, about Tutsi plotting to enslave Hutu again. "They killed our president! They want to take everything!"

He calls your name. "Augustin, you're a secretary. You have the lists. You know where they live." The crowd turns. Faces you recognize—teachers, farmers, the man who sold you vegetables last week. All watching.

"We need people at the roadblocks. Identity cards. We stop them from escaping." He hands you a clipboard. "You'll take the checkpoint at the market. Report at dawn."

Your hands are shaking. If you refuse, you're a traitor. If you comply, you're part of this. The crowd chants. RTLM plays from a radio. The smell of banana beer and sweat.`,
    apThemes: ["causation", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: "audio/narration/hutu-moderate/rw-hm-scene-02b.mp3",
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
    id: "rw-hm-scene-02c",
    narrative: `April 7, pre-dawn. You told Celestin to leave. You don't know if he made it. The radio reports massacres at churches, schools, administrative buildings. Prime Minister Uwilingiyimana is dead. Moderate politicians, journalists, civil servants—all targeted in the first hours.

Your wife packs essentials. "We have to go. Now." Your children are crying. Outside, the roadblocks are everywhere. Identity cards. Machetes. The Interahamwe are hunting.

You have a cousin in the countryside, near Gitarama. Maybe it's safer there. Maybe you can disappear. But leaving means abandoning your position, your home, everything. And the roads—every checkpoint is a risk.

The sun rises. Smoke columns across Kigali. You hear screaming from the next street. Your wife grabs your hand. "Augustin. We go now or we die here."`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: "smoke",
    ambientTrack: null,
    narratorAudio: "audio/narration/hutu-moderate/rw-hm-scene-02c.mp3",
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

A truck approaches. Tutsi families, you can tell by their faces. Children in the back. The militia commander hands you a clipboard. "Check the cards. Separate them."

You know what happens next. You've seen the bodies in the ditches. The commander watches you. "You're with us, right Augustin? Or are you one of them?"

Your hands shake as you take the first identity card. The woman holding it looks at you. She's someone's mother. Someone's wife. The militia behind you tap their machetes on the truck bed. Twelve seconds to decide.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: "audio/narration/hutu-moderate/rw-hm-scene-03a.mp3",
    timedChoice: { enabled: true, duration: 12000, defaultChoice: "rw-hm-choice-03a-b" },
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
    timedChoice: { enabled: true, duration: 12000, defaultChoice: "rw-hm-choice-03b-a" },
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
    id: "rw-hm-scene-03c",
    narrative: `April 9. You accepted the roadblock assignment at the rally. Three days now. You've checked hundreds of identity cards. Tutsi. Hutu. The militia takes the Tutsi away. You don't ask where.

The commander trusts you now. He gives you more responsibility. "You're educated. You can read. Help us with the lists." Lists of names. Addresses. Who's hiding where. The administrative machinery of genocide—you're part of it.

At night, you go home. Your wife asks what you did today. You don't answer. Your children play. The radio plays music between the instructions. RTLM announcers joke, laugh, then read more names.

You tell yourself you're surviving. You tell yourself you had no choice. But you know the truth. You chose this. Every day, you choose this.`,
    apThemes: ["causation", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: "audio/narration/hutu-moderate/rw-hm-scene-03c.mp3",
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
    id: "rw-hm-scene-03d",
    narrative: `April 10. You fled Kigali. Your family made it to your cousin's village near Gitarama. The countryside is quieter, but the genocide is here too. Roadblocks on every path. Militia in every village. The radio reaches everywhere.

Your cousin is nervous. "You can stay, but keep quiet. Don't draw attention." You help with farm work. You avoid the village meetings where Hutu Power organizers speak. You hear stories—Tutsi hiding in the marshes, in the forests. Militia hunting them with dogs.

One night, your cousin pulls you aside. "They're asking about you. Why you left Kigali. Why you're not participating." He's scared. "If they think I'm hiding a traitor..."

You're not safe here either. Nowhere is safe. The RPF is advancing from the north. The genocide continues. You're in hiding, but you're Hutu—you're not the primary target. Just a coward. A traitor to the cause.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: "audio/narration/hutu-moderate/rw-hm-scene-03d.mp3",
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
    narratorAudio: "audio/narration/hutu-moderate/rw-hm-scene-04a.mp3",
    choices: [
      {
        id: "rw-hm-choice-04a-a",
        text: "Testify fully—confess everything",
        consequences: { rw_testified_gacaca: true, rw_full_confession: true },
        nextScene: "outcome"
      },
      {
        id: "rw-hm-choice-04a-b",
        text: "Testify partially—protect some names",
        consequences: { rw_testified_gacaca: true, rw_partial_confession: true },
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
    narratorAudio: "audio/narration/hutu-moderate/rw-hm-scene-04b.mp3",
    choices: [
      {
        id: "rw-hm-choice-04b-a",
        text: "Confess fully—accept responsibility",
        consequences: { rw_confessed_complicity: true, rw_accepted_guilt: true },
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
    narratorAudio: "audio/narration/hutu-moderate/rw-hm-scene-04d.mp3",
    choices: [
      {
        id: "rw-hm-choice-04d-a",
        text: "Testify as a witness—help survivors",
        consequences: { rw_testified_as_witness: true, rw_helped_justice: true },
        nextScene: "outcome"
      },
      {
        id: "rw-hm-choice-04d-b",
        text: "Refuse—stay silent about the past",
        consequences: { rw_refused_testimony: true, rw_stayed_silent: true },
        nextScene: "outcome"
      },
      {
        id: "rw-hm-choice-04d-c",
        text: "Relocate again—avoid the questions",
        consequences: { rw_relocated_village: true, rw_avoided_past: true },
        nextScene: "outcome"
      }
    ]
  }
];

const hutuModerateOutcomes = [
  {
    id: "rw-hm-outcome-flight-survived",
    survived: true,
    conditions: {
      rw_fled_kigali: true,
      rw_stayed_hidden: true
    },
    epilogue: `You survived. You left before the worst began. Your cousin's village near Gitarama was quieter — genocide was there too, but you were invisible. Not participating. Not resisting. Just gone. When the RPF captured Kigali in July 1994 and the genocide ended after 100 days, you were alive in a place no one was looking for you.

The years after were complicated in a different way. You didn't kill anyone. You didn't staff roadblocks. You also didn't help anyone. Celestin — you told him to leave that night. You never learned what happened to him. That uncertainty is its own weight.

Rwanda's post-genocide government declared a single identity: Rwandan. No Hutu. No Tutsi. You went back to Kigali in 1997. Your house was occupied by strangers. Your position was gone. A gacaca judge visited your village asking for testimony. You knew things — lists, names, who organized what. You had to decide whether that knowledge was yours to keep or yours to give.

The gacaca courts ran until 2012. Some people who fled, like you, testified as witnesses and were protected. Some stayed silent and were left alone. Some were named by others anyway. You were a bystander. History records bystanders in complicated ways. You carried that ambiguity forward.`
  },

  {
    id: "rw-hm-outcome-flight-witness-survived",
    survived: true,
    conditions: {
      rw_fled_kigali: true,
      rw_testified_as_witness: true
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
      rw_refused_testimony: true
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
    id: "rw-hm-outcome-rescue-survived",
    survived: true,
    conditions: {
      rw_helped_celestin: true,
      rw_saved_at_roadblock: true
    },
    epilogue: `You survived. Celestin survived. You hid him when the militias came, misdirected them when they searched, and risked everything for someone who wasn't family. At the roadblock, you lied again—claimed identity cards were valid when they weren't. The militia believed you. Those people lived because you chose risk over compliance. When the RPF captured Kigali in July, you emerged from hiding. Celestin's wife and two children were killed at a different roadblock you couldn't control. He knows you tried.

The gacaca courts asked you to testify. You told the truth—what you did, what you couldn't do, who you saved, who you couldn't save. The judges gave you community service, not prison. Survivors thanked you. Some perpetrators called you a traitor. Your family struggled with what you'd risked for strangers.

Rwanda's reconciliation asks you to live next to people who made different choices. Some Hutu who sheltered Tutsi were killed alongside them. You weren't. That's luck, not virtue. Celestin's son grows up knowing you helped. Your children grow up knowing you chose risk over safety. The history books call people like you "Righteous Hutu." You just call yourself someone who couldn't look away. You carried that choice forward.`
  },

  {
    id: "rw-hm-outcome-rescue-killed-hero",
    survived: false,
    conditions: {
      rw_helped_celestin: true,
      rw_saved_at_roadblock: true
    },
    deathContext: {
      cause: "Killed by Interahamwe militia after being identified as a Tutsi-protector",
      historicalRate: "Thousands of Hutu moderates who sheltered Tutsi or falsified identity cards were killed when discovered",
      yourChoices: "You hid Celestin, misdirected the militia, and falsified cards at the roadblock to let people through. You were seen. Someone recognized you."
    },
    epilogue: `You didn't survive. You did everything you could—hid Celestin, lied to the militia, falsified cards at the roadblock to let people through. And someone saw. A neighbor. A militiaman who recognized your face from before. "That's Augustin. He's been helping them." The commander's face changed.

They killed you at the roadblock. Quick. An example for others. Celestin had already fled—you'd bought him enough time. The people whose cards you falsified made it through. They're alive. You aren't.

The gacaca courts heard testimony about you in 2007. Survivors described what you did—specifically, carefully, the way people describe acts they don't want forgotten. The historical record classifies you among "Hutu moderates killed after active resistance." Your children grew up knowing you chose the harder path. That's not comfort. But it's true. You carried those choices to the end.`
  },

  {
    id: "rw-hm-outcome-rescue-killed-complied",
    survived: false,
    conditions: {
      rw_helped_celestin: true,
      rw_complied_at_roadblock: true
    },
    deathContext: {
      cause: "Killed by Interahamwe militia after earlier sheltering of Tutsi was discovered",
      historicalRate: "Thousands of Hutu moderates who sheltered Tutsi or refused to participate were killed during the genocide",
      yourChoices: "You helped Celestin hide, but at the roadblock you followed orders. The militia discovered your earlier choice."
    },
    epilogue: `You didn't survive. You helped Celestin at first—hid him, misdirected the militia. But at the roadblock, you followed orders. You waved people through to their deaths. The militia commander praised you. Then someone recognized you. "That's Augustin. He hid a Tutsi last week." The commander's face changed. "You're a traitor." They killed you at the roadblock you'd been staffing.

Celestin survived—he'd already fled when you were discovered. Your family fled to Zaire. When the gacaca courts began, survivors testified about you. Some said you helped. Some said you complied. Both were true. The memorial lists your name in a complicated category: "Hutu moderates killed after initial resistance." Your children grew up with that ambiguity.

You tried to help and then you didn't. You chose risk and then you chose safety. Neither choice saved you. You carried those contradictions to the end.`
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
    id: "rw-hm-outcome-compliance-survived",
    survived: true,
    conditions: {
      rw_staffed_roadblock: true,
      rw_continued_compliance: true
    },
    epilogue: `You survived. You attended the rally. You staffed the roadblock. You checked identity cards and followed orders for days. You didn't kill anyone directly—or maybe you did, you're not sure anymore. The line between checking cards and participating blurs when you know what happens next. You told yourself you were surviving. You told yourself you had no choice. But you had choices. You made them every day.

When the RPF captured Kigali, you fled to Zaire with two million other Hutu refugees. The camps were chaos—perpetrators mixed with bystanders, militia leaders recruiting, aid agencies overwhelmed. You came back in 1996 when the camps collapsed. The gacaca courts called you. Category Two: participation in killings. Multiple witnesses.

You confessed. Partial truth, partial lies. Enough to get community service instead of prison. You rebuilt homes for survivors. You attended reconciliation meetings. You said the words the government wanted. Your children know what you did. Celestin's son knows what you did. You live in the same sector now. You see each other at the market. He doesn't speak to you. You don't blame him. You carried those choices forward.`
  },

  {
    id: "rw-hm-outcome-compliance-killed",
    survived: false,
    conditions: {
      rw_participated_directly: true,
      rw_revealed_celestin: true
    },
    deathContext: {
      cause: "Killed by RPF forces during the advance on Kigali",
      historicalRate: "Thousands of Hutu perpetrators and militia members were killed by RPF forces as they captured territory",
      yourChoices: "You revealed Celestin's hiding place. You participated directly in killings at the roadblock. The RPF found you."
    },
    epilogue: `You didn't survive. The RPF advanced faster than anyone expected. You were still at the roadblock when they arrived. You'd revealed Celestin's location—the militia killed him in your attic. You'd participated directly in killings at the checkpoint. The RPF soldiers knew. They shot you. Quick. Cleaner than what you'd done to others.

Your family fled to Zaire. Your wife told your children you were a victim, that you had no choice, that the RPF killed innocent Hutu. Your children believed her for years. Then the gacaca courts began. Survivors testified. They named you. They described what you did—how you revealed Celestin, how you participated at the roadblock. Your children learned the truth from strangers.

The memorial doesn't list your name. The history books don't record you as a victim. You're a statistic—one of the perpetrators killed during the RPF advance. Celestin's son grew up knowing you revealed his father's hiding place. Your own children grew up knowing what you did. There's no reconciliation for you. You're just gone. You carried those choices to the end.`
  },

  // FALLBACK OUTCOMES - catch-all for paths not covered by specific outcomes
  {
    id: "rw-hm-fallback-survived",
    survived: true,
    conditions: {},
    epilogue: `You survived the genocide. The RPF captured Kigali on July 4th, 1994. One hundred days after it began, it ended. Approximately 800,000 people — 75% of Rwanda's Tutsi population — had been killed. You were not among them.

What you did during those hundred days is recorded in consequence flags this system couldn't fully anticipate. Rwanda's gacaca courts ran from 2005 to 2012 and heard testimony from over 1.2 million cases. Whether you were perpetrator, bystander, resister, or something that doesn't have a clean name, the courts were designed to process exactly the kind of complexity you lived through.

You carry 1994 forward. Rwanda rebuilt. The country you live in now has a different official identity than the one you were born into. Whether that new identity fits you is something only you can answer. You survived. That's not a moral verdict. It's a fact. What you do with it is the rest of the story.`
  },
  {
    id: "rw-hm-fallback-killed",
    survived: false,
    conditions: {},
    epilogue: `You didn't survive the genocide. The RPF captured Kigali on July 4th, 1994, ending 100 days of killing. You didn't reach July 4th.

The circumstances of your death depended on choices this system couldn't fully map to a single epilogue — you lived in the space between the paths, between the clean categories. The genocide killed approximately 800,000 people. It also killed thousands of Hutu who sheltered Tutsi, who refused to participate, who were on the wrong list for the wrong reason at the wrong moment.

Your name is somewhere. A gacaca record. A family's memory. A neighbor who saw what happened and carried it for thirty years. Rwanda built memorials for those who died. Some names are on walls. Some are in documents. Some are only in the memories of people who are also aging, also dying. You were part of what happened in 1994. The full account of what that means didn't fit neatly into the branches this story could trace. It rarely does.`
  }
];

// Export role data
export default {
  scenes: hutuModerateScenes,
  outcomes: hutuModerateOutcomes
};
