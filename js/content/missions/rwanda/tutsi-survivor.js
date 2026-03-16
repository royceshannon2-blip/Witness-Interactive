/**
 * Rwanda Genocide Mission - Tutsi Survivor (Immacul├⌐e) Role
 *
 * Historical Context:
 * - Immaculée is a 19-year-old university student in Kigali
 * - April 7, 1994: Genocide begins, roadblocks everywhere, identity cards = death sentences
 * - Tutsi faced impossible choices: hide, flee to enclaves, trust churches (often massacre sites)
 * - 500,000-800,000 Tutsi killed in 100 days
 * - Survivors carry testimony, trauma, and the weight of those who didn't survive
 * - Post-genocide: ICTR testimony, reconciliation meetings, survivor guilt
 *
 * BRANCHING STRUCTURE:
 * - Hidden Path: Sheltered by Hutu friends/family, survived in concealment
 * - Enclave Path: Reached UN-protected site (hotel, stadium), survived in crowd
 * - Testimony Path: Witnessed massacres, documented atrocities, carried evidence
 *
 * Requirements: US-2.1, US-2.2, US-2.3, TR-2.2
 */

const tutsiSurvivorScenes = [
  {
    id: "rw-ts-scene-01",
    narrative: `April 7, 1994. Morning. You're Immaculée, nineteen, university student. The radio woke you before dawn—President Habyarimana's plane shot down. Now RTLM broadcasts instructions. Roadblocks. Identity cards. The language they use for people like you.

Your roommate, Marie, is Hutu. She's packing. "My brother says get out of Kigali. Now." She looks at you. "You should... I don't know. The church? Father Michel always said it was sanctuary."

Your identity card is in your pocket. Belgium introduced these cards decades ago, listing each person as Hutu, Tutsi, or Twa. Now militia at roadblocks use them to identify who lives and who dies. Yours says "Tutsi"—a death sentence at every checkpoint. Your parents are in Butare—you can't reach them. The phone lines are dead. Outside, you hear trucks. Shouting. The smell of smoke.

Three options. The church—Father Michel knows you. Your friend Jeanne's house—she's Hutu, married to a Tutsi, might hide you. Or the Hôtel des Mille Collines—rumors say UN peacekeepers are there, protecting people. All three mean crossing roadblocks.`,
    apThemes: ["causation", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-01.mp3",
    soundEffects: [
      { file: 'rw-sfx-radio-static-burst.mp3', triggerAfterMs: 1000 },
      { file: 'rw-sfx-truck-distant.mp3', triggerAfterMs: 3800 },
      { file: 'rw-sfx-distant-shouting.mp3', triggerAfterMs: 6200 }
    ],
    choices: [
      {
        id: "rw-ts-choice-01-a",
        text: "Go to the church",
        consequences: { rw_trusted_church: true },
        nextScene: "rw-ts-scene-02a"
      },
      {
        id: "rw-ts-choice-01-b",
        text: "Seek your friend Jeanne's house",
        consequences: { rw_sought_hutu_friend: true },
        nextScene: "rw-ts-scene-02b"
      },
      {
        id: "rw-ts-choice-01-c",
        text: "Try to reach the hotel",
        consequences: { rw_attempted_hotel: true },
        nextScene: "rw-ts-scene-02c"
      }
    ]
  },

  {
    id: "rw-ts-scene-02a",
    narrative: `April 7, mid-morning. You're at the church. Father Michel is here, but so are hundreds of others—Tutsi families, children crying, old people praying. The church smells like fear-sweat and incense. Everyone trusts this place. Churches are sanctuary. Always have been.

But you hear trucks outside. Militia voices. Interahamwe. They're surrounding the church. Father Michel is arguing with someone at the door. "This is God's house! You cannot—" A gunshot. Screaming.

The militia pours in. Machetes. Grenades. People running. The altar is no protection. The pews are no shield. You see what happens to those who stay in the main hall. You have seconds. The ceiling—there's a crawlspace above the sacristy. Or run. Try to escape in the chaos. Twelve seconds to choose.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: "shake",
    ambientTrack: null,
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-02a.mp3",
    soundEffects: [
      { file: 'rw-sfx-gunshot-muffled.mp3', triggerAfterMs: 2800 },
      { file: 'rw-sfx-grenade-muffled.mp3', triggerAfterMs: 5200 }
    ],
    choices: [
      {
        id: "rw-ts-choice-02a-a",
        text: "Run—escape through side door",
        consequences: { rw_escaped_church: true, rw_witnessed_massacre: true },
        nextScene: "rw-ts-scene-03a"
      },
      {
        id: "rw-ts-choice-02a-b",
        text: "Hide in ceiling crawlspace",
        consequences: { rw_hid_in_church: true },
        nextScene: "rw-ts-scene-03b"
      }
    ]
  },

  {
    linear: true,
    id: "rw-ts-scene-02b",
    narrative: `April 7, afternoon. You made it to Jeanne's house. She opened the door, pulled you inside fast. "Immaculée. God. I heard the radio." Her husband, Paul, is Tutsi too. He's in the back room with their children. "We're all targets now."

Jeanne's hands shake as she makes tea. "My brother is Interahamwe. He came by this morning. Asked if I'd seen any... if I knew where people were hiding." She looks at you. "I said no. But he'll come back. They always come back."

The house is small. One bedroom. A kitchen. An attic—barely big enough for one person, accessed through a ceiling panel. Jeanne's brother knows this house. He knows every hiding place. But maybe he won't look. Maybe family means something.

Outside, you hear the roadblock. Voices. Machetes on pavement. The radio plays from somewhere—RTLM, always RTLM. Jeanne grips your hand. "The attic. Now. Don't make a sound. Not for anything."`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-02b.mp3",
    soundEffects: [
      { file: 'rw-sfx-door-knock.mp3', triggerAfterMs: 800 },
      { file: 'rw-sfx-floorboard-creak.mp3', triggerAfterMs: 3000 }
    ],
    choices: [
      {
        id: "rw-ts-choice-02b-a",
        text: "Hide in the attic",
        consequences: { rw_hid_with_hutu: true },
        nextScene: "rw-ts-scene-03c"
      }
    ]
  },

  {
    linear: true,
    id: "rw-ts-scene-02c",
    narrative: `April 7, late afternoon. You're trying to reach the Hôtel des Mille Collines. Marie gave you her student ID—Hutu name, Hutu card. "If they ask, you're my cousin." It might work. It might not.

The streets are chaos. Bodies already. Roadblocks every few blocks. Militia checking cards, pulling people from cars. You see a woman dragged away. Her children screaming. You keep walking. Head down. Don't run. Running means guilt.

The hotel is three blocks away. You can see it. UN vehicles outside. Blue helmets. Safety. But there's a roadblock between you and the gate. Interahamwe, maybe ten men. They're checking everyone—examining the colonial-era identity cards that list ethnicity, using Belgian bureaucracy as a tool for murder. Cards. Questions. Some people get through. Some don't.

You have two cards in your pocket. Your real one—Tutsi. Marie's—Hutu. The militia commander is young, maybe twenty. He looks tired. Bored. Methodical. You're next in line. He holds out his hand. "Identity card."`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-02c.mp3",
    soundEffects: [
      { file: 'rw-sfx-distant-shouting.mp3', triggerAfterMs: 1500 },
      { file: 'rw-sfx-machete-distant.mp3', triggerAfterMs: 4000 },
      { file: 'rw-sfx-truck-idle.mp3', triggerAfterMs: 6500 }
    ],
    choices: [
      {
        id: "rw-ts-choice-02c-a",
        text: "Show Marie's Hutu card",
        consequences: { rw_used_false_id: true },
        nextScene: "rw-ts-scene-03d"
      }
    ]
  },

  {
    id: "rw-ts-scene-03a",
    narrative: `April 7, evening. You ran. You escaped the church through the side door during the chaos. You saw what happened inside. Father Michel killed. Grenades. Machetes. Children. You can't unsee it.

Now you're hiding in a drainage ditch two blocks away. The smell of sewage and smoke. Your clothes torn. Hands shaking. You're alive. Most people in that church aren't. The screams have stopped. Just RTLM radio music. Cheerful announcers between instructions.

You have to move. The RPF is advancing from the north. If you can survive until they arrive... days. Weeks. You need shelter. Food. Water. And you need to remember. Someone has to remember what happened in that church.

A UN convoy passes. White vehicles. You could flag them down. Or keep hiding. Wait for dark. You're a witness now. That's a burden. That's also a purpose.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-03a.mp3",
    soundEffects: [
      { file: 'rw-sfx-water-drip.mp3', triggerAfterMs: 2000 },
      { file: 'rw-sfx-truck-heavy-passing.mp3', triggerAfterMs: 5500 }
    ],
    deathCheckpoint: true,
    choices: [
      {
        id: "rw-ts-choice-03a-a",
        text: "Flag down the UN convoy",
        consequences: { rw_reached_un_protection: true },
        nextScene: "rw-ts-scene-04a"
      },
      {
        id: "rw-ts-choice-03a-b",
        text: "Stay hidden—wait for dark",
        consequences: { rw_stayed_hidden_ditch: true, rw_witnessed_massacre: true },
        nextScene: "rw-ts-scene-04b"
      }
    ]
  },

  {
    id: "rw-ts-scene-03b",
    narrative: `April 8. You've been in the church ceiling for twenty-four hours. The crawlspace is barely three feet high. You can't stand. Can't move without noise. Below, the massacre continued for hours. Then silence. Then militia returned to loot. Then silence again.

Someone else is up here. An old man, maybe seventy. He doesn't speak. Just breathes. Shallow. Scared. The smell is terrible—blood, smoke, bodies below. Your water bottle empty. Stomach cramps with hunger and fear.

Through a crack, you see the church floor. Bodies everywhere. Militia comes back periodically. Checking. Making sure no one survived. They haven't looked up yet. But they will.

The old man coughs. Quiet, but not quiet enough. Below, footsteps stop. "You hear that?" A militia voice. "Check the ceiling." Your heart pounds. The old man looks at you. Terror. Apology.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-03b.mp3",
    soundEffects: [
      { file: 'rw-sfx-boots-stone.mp3', triggerAfterMs: 3500 },
      { file: 'rw-sfx-boots-stone.mp3', triggerAfterMs: 7000 }
    ],
    deathCheckpoint: true,
    choices: [
      {
        id: "rw-ts-choice-03b-a",
        text: "Stay absolutely silent—don't move",
        consequences: { rw_survived_church_hiding: true },
        nextScene: "rw-ts-scene-04b"
      }
    ]
  },

  {
    id: "rw-ts-scene-03c",
    narrative: `April 10. Three days in Jeanne's attic. You haven't stood up in seventy-two hours. The space is four feet by six feet. A blanket. A water bottle Jeanne refills at night. A bucket for waste. The smell. The heat. The silence.

Below, you hear Jeanne's brother. He visits every day. "You sure you haven't seen anyone? The roadblock commander says people are hiding in houses. Hutu who help them get killed too." Jeanne's voice is steady. "I told you. No one's here."

Her children know you're up here. Six and eight. They don't speak about it. They play quietly. Children learn fast during genocide. Silence is survival.

At night, Jeanne brings food. Bread. Water. "Paul is talking about leaving. Going to the hotel." She looks at you. "But if we leave, you're alone. And if my brother comes..." The attic is safety and trap.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-03c.mp3",
    soundEffects: [
      { file: 'rw-sfx-door-creak.mp3', triggerAfterMs: 2800 },
      { file: 'rw-sfx-floorboard-creak.mp3', triggerAfterMs: 5500 }
    ],
    deathCheckpoint: true,
    choices: [
      {
        id: "rw-ts-choice-03c-a",
        text: "Stay hidden and trust Jeanne",
        consequences: { rw_trusted_protector: true },
        nextScene: "rw-ts-scene-04c"
      }
    ]
  },

  {
    id: "rw-ts-scene-03d",
    narrative: `April 7, evening. You showed Marie's card. The militia commander looked at it. Looked at you. "This says Hutu." You nod. "You don't look Hutu." Your heart stops. "I'm mixed. My mother—" He waves you through. "Go. Quickly."

You made it to the hotel. The H├┤tel des Mille Collines. UN peacekeepers at the gate. Blue helmets. Canadian accents. Inside, chaos—twelve hundred people crammed into a building meant for two hundred. Families in hallways. Children crying. Too many people in too small a space.

A Belgian peacekeeper registers you. "Name. Age." You give Marie's name. Safer. He doesn't question it. "You're lucky. We're not sure how long we can hold this position."

You find a corner in a conference room. Thirty people in a space meant for ten. An old woman whispers, "The militia is outside. They want us. The UN won't fight." She's right. You hear them. Chanting. Threatening. The peacekeepers hold the perimeter but don't engage. You're safe. For now.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-03d.mp3",
    soundEffects: [
      { file: 'rw-sfx-truck-idle.mp3', triggerAfterMs: 800 },
      { file: 'rw-sfx-machete-tap.mp3', triggerAfterMs: 3200 }
    ],
    deathCheckpoint: true,
    choices: [
      {
        id: "rw-ts-choice-03d-a",
        text: "Stay at the hotel—wait for RPF",
        consequences: { rw_reached_hotel: true },
        nextScene: "rw-ts-scene-04d"
      }
    ]
  },

  // AFTERMATH SCENES (2005-2012)

  {
    id: "rw-ts-scene-04a",
    narrative: `2006. Arusha, Tanzania. The International Criminal Tribunal for Rwanda — the UN court established in 1994 to prosecute genocide organizers. You're here to testify. You flagged down that UN convoy. You survived. You carried what you saw at the church—Father Michel killed, grenades, machetes, children. The prosecutor needs your testimony to convict the militia commander who organized the massacre.

The courtroom is formal. Translators. Judges from three countries. The defendant sits behind glass. He looks older. Tired. He doesn't look at you. The prosecutor asks you to describe what you saw. Every detail. Names. Times. Who gave orders. Who carried them out.

You remember everything. The screams. The smell. The faces. Speaking it aloud makes it real again. The defense attorney will cross-examine. He'll question your memory, your motives, your credibility. Some survivors find power in testimony. Others find only re-traumatization.

The prosecutor waits. The judges wait. The defendant stares at the table. You have the microphone. You have the truth. What you say here becomes part of the historical record. Justice depends on witnesses like you. But so does your ability to move forward.`,
    apThemes: ["continuity", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-04a.mp3",
    choices: [
      {
        id: "rw-ts-choice-04a-a",
        text: "Testify fully—every detail",
        consequences: { rw_testified_ictr: true, rw_chose_justice: true },
        nextScene: "outcome"
      },
      {
        id: "rw-ts-choice-04a-b",
        text: "Testify but protect some names",
        consequences: { rw_testified_ictr: true, rw_chose_protection: true },
        nextScene: "outcome"
      },
      {
        id: "rw-ts-choice-04a-c",
        text: "Decline to testify further",
        consequences: { rw_declined_testimony: true, rw_chose_healing: true },
        nextScene: "outcome"
      }
    ]
  },

  {
    id: "rw-ts-scene-04b",
    narrative: `2008. Kigali. You survived the church ceiling. You stayed silent when the militia searched below. The old man next to you coughed, but they didn't hear. Or they didn't care. After three days, the RPF arrived. You climbed down. Bodies everywhere. You were one of seven survivors from a church that held three hundred.

Now it's fourteen years later. The church is a genocide memorial. Skulls on shelves. Clothes preserved. Names on walls. You come here once a year. April 7th. Kwibuka—remembrance. The government organizes ceremonies. Speeches about unity and reconciliation. "We are all Rwandans now. No Hutu. No Tutsi."

But you remember who hid you and who hunted you. You remember the old man who coughed. He died two days after liberation—starvation, dehydration. You lived. He didn't. Survivor guilt is a weight that doesn't lift. The memorial guide asks if you want to speak at the ceremony. Share your story. Help the next generation understand.

Some survivors find meaning in speaking. Others find it exhausting. The ceremony is tomorrow. Hundreds will attend. Cameras. Students. Government officials. Your story could educate. Or it could reopen wounds that barely healed.`,
    apThemes: ["continuity", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-04b.mp3",
    choices: [
      {
        id: "rw-ts-choice-04b-a",
        text: "Speak at the ceremony",
        consequences: { rw_shared_testimony: true, rw_chose_education: true },
        nextScene: "outcome"
      },
      {
        id: "rw-ts-choice-04b-b",
        text: "Attend silently—private mourning",
        consequences: { rw_mourned_privately: true, rw_chose_privacy: true },
        nextScene: "outcome"
      },
      {
        id: "rw-ts-choice-04b-c",
        text: "Stay home this year",
        consequences: { rw_avoided_ceremony: true, rw_chose_distance: true },
        nextScene: "outcome"
      }
    ]
  },

  {
    id: "rw-ts-scene-04c",
    narrative: `2010. Your village outside Kigali. You survived because Jeanne hid you in her attic. Three weeks. Silent. Terrified. Her brother was Interahamwe. He came by every day. She lied to him. She risked her family for you. When the RPF arrived, you climbed down. Jeanne's husband Paul was killed at a roadblock. Her children survived.

Now it's sixteen years later. The government's gacaca courts have concluded. Community justice. Perpetrators confessed for reduced sentences. Survivors testified. Jeanne's brother confessed to participating in roadblock killings. He served six years. He's back in the village now. The government says reconciliation is necessary. "We must live together. We are all Rwandans."

Jeanne invites you to a reconciliation meeting. Her brother will be there. Other perpetrators. Other survivors. The facilitator will ask everyone to speak. To acknowledge what happened. To commit to coexistence. Some survivors find these meetings healing. Others find them insulting—forced forgiveness for atrocities.

Jeanne saved your life. She's asking you to attend. But her brother helped kill people like you. The meeting is tonight. The village expects you. Reconciliation is policy. But it's also personal. And it's complicated.`,
    apThemes: ["continuity", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-04c.mp3",
    choices: [
      {
        id: "rw-ts-choice-04c-a",
        text: "Attend and speak honestly",
        consequences: { rw_attended_reconciliation: true, rw_spoke_truth: true },
        nextScene: "outcome"
      },
      {
        id: "rw-ts-choice-04c-b",
        text: "Attend but stay silent",
        consequences: { rw_attended_reconciliation: true, rw_stayed_silent: true },
        nextScene: "outcome"
      },
      {
        id: "rw-ts-choice-04c-c",
        text: "Decline—you're not ready",
        consequences: { rw_declined_reconciliation: true, rw_chose_boundaries: true },
        nextScene: "outcome"
      }
    ]
  },

  {
    id: "rw-ts-scene-04d",
    narrative: `July 4, 1994. The RPF captured Kigali. The genocide ended. Years passed.

2007. Kigali. You survived the hotel. Twelve hundred people crammed into the Hôtel des Mille Collines. You used Marie's Hutu identity card to get past the roadblock. You gave her name to the UN peacekeeper. You lived as someone else for three months. When the RPF captured Kigali, you reclaimed your real name. Immaculée. Tutsi. Survivor.

Now it's thirteen years later. The hotel still operates. Tourists come to see where people sheltered. They take photos. They ask questions. The manager became famous. Then controversial. The narrative is complicated.

You're invited to speak at a survivor's conference here. The organizers want you to share your story. How you survived with a borrowed identity. How you reclaimed yourself. Some survivors embrace public testimony. Others find it performative—trauma as education, survival as inspiration.

The conference is next week. Journalists will attend. Students. Researchers. Your story could help people understand. Or it could reduce your survival to a lesson. You're more than what happened to you. But what happened is also part of who you are.`,
    apThemes: ["continuity", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    choices: [
      {
        id: "rw-ts-choice-04d-a",
        text: "Speak at the conference",
        consequences: { rw_shared_hotel_story: true, rw_chose_visibility: true },
        nextScene: "outcome"
      },
      {
        id: "rw-ts-choice-04d-b",
        text: "Attend but don't speak publicly",
        consequences: { rw_attended_conference: true, rw_chose_listening: true },
        nextScene: "outcome"
      },
      {
        id: "rw-ts-choice-04d-c",
        text: "Decline the invitation",
        consequences: { rw_declined_conference: true, rw_chose_private_life: true },
        nextScene: "outcome"
      }
    ]
  }
];

const tutsiSurvivorOutcomes = [
  // GENERIC PATH FALLBACKS - lower specificity, catch paths without aftermath choices
  {
    id: "rw-ts-outcome-attic-survived",
    survived: true,
    conditions: {
      rw_hid_with_hutu: true
    },
    epilogue: `You survived. You hid in Jeanne's attic for three weeks, silent and terrified while her Interahamwe brother searched below. She risked everything to protect you—her family, her life, her children. She lied to her brother every day. When the RPF captured Kigali in July, you emerged. Thin. Traumatized. Alive. Most people who hid didn't survive. You did because someone chose to help you.

The years after were complicated. Jeanne's brother served six years for roadblock killings. He came back to the village. The government's reconciliation policy asked you to live next to him. To attend meetings. To speak about coexistence. You did, sometimes. Other times you couldn't. Survivor guilt is a weight that doesn't lift—you lived because Jeanne helped you, because you were lucky, because her brother never looked up.

The gacaca courts asked you to testify. You told what you knew—who helped, who hunted, who looked away. You spoke about Jeanne's courage. Some survivors found power in testimony. You found exhaustion. The memorial lists the names of those who didn't survive. Your family. Your neighbors. Your friends. You visit once a year. April 7th. Kwibuka. You remember. You carry their names forward. You survived, and that's both gift and burden.`
  },

  {
    id: "rw-ts-outcome-ceiling-survived",
    survived: true,
    conditions: {
      rw_hid_in_church: true
    },
    epilogue: `You survived. You hid in the church ceiling for three days, silent and terrified while militia searched below. The crawlspace was barely three feet high. You couldn't stand. Couldn't move. An old man hid with you—he coughed, but they didn't hear. Or they didn't care. When the RPF arrived, you climbed down. Bodies everywhere. You were one of seven survivors from a church that held three hundred. Most people who hid didn't survive. You did because you stayed silent.

The years after were complicated. The church became a genocide memorial. Skulls on shelves. Clothes preserved. Names on walls. You visit once a year. April 7th. Kwibuka—remembrance. The government organizes ceremonies about unity and reconciliation. But you remember who hid you and who hunted you. You remember the old man who coughed. He died two days after liberation—starvation, dehydration. You lived. He didn't.

Survivor guilt is a weight that doesn't lift. The memorial guide asks if you want to speak at ceremonies. Share your story. Help the next generation understand. Sometimes you do. Sometimes you can't. The memorial lists the names of those who didn't survive. Your family. Your neighbors. Your friends. You remember. You carry their names forward. You survived, and that's both gift and burden.`
  },

  {
    id: "rw-ts-outcome-church-approach-killed",
    survived: false,
    conditions: {
      rw_trusted_church: true
    },
    deathContext: {
      cause: "Killed during the genocide after seeking sanctuary at the church",
      historicalRate: "Churches became massacre sites across Rwanda. Thousands of Tutsi who sought sanctuary in churches were killed there.",
      yourChoices: "You trusted the church as sanctuary. The militia attacked."
    },
    epilogue: `You didn't survive. You went to the church — Father Michel, sanctuary, safety. Churches had always been safe. But not this time. The Interahamwe surrounded the building. They killed Father Michel at the door. They poured in with machetes and grenades. Whether you were killed in the initial assault, while trying to hide, or in the systematic searches that followed, you died with hundreds of others in a place that was supposed to be sacred.

Your body was found when the RPF arrived. Your family identified you by your clothes. The church became a genocide memorial. Your name is on the wall with three hundred others who died there. Students visit now. They see the skulls on shelves, the clothes preserved, the names. They learn that churches became massacre sites, that sanctuary was a lie, that trust was weaponized.

Your friend Marie survived. She testified at the gacaca courts about what happened. She said you were kind, that you trusted people, that you believed in safety. The memorial guide tells your story to visitors — how you went to the church seeking sanctuary, how you died there, how trust became a trap. You're remembered. You're a name on a wall. You carried that trust to the end.`
  },

  {
    id: "rw-ts-outcome-ceiling-approach-killed",
    survived: false,
    conditions: {
      rw_hid_in_church: true,
      rw_survived_church_hiding: true
    },
    deathContext: {
      cause: "Killed during the genocide after hiding in the church",
      historicalRate: "Militia systematically searched churches for survivors in the days following massacres. Many who hid in ceilings and crawlspaces were eventually found.",
      yourChoices: "You hid in the ceiling crawlspace. The militia searched for survivors."
    },
    epilogue: `You didn't survive. You made it to the ceiling crawlspace — barely three feet high, silent, terrified. You held absolutely still while the massacre happened below. The militia returned to search — they always came back — and eventually you were discovered. Whether they found you in the crawlspace, or you were forced out by thirst and starvation, or you were caught trying to escape when you thought it was safe, the end came before the RPF arrived.

The church was documented by the RPF when they captured the area. The crawlspace above the sacristy was noted in their records — evidence of people who had tried to hide there. The church became a genocide memorial. Tourists visit now. They see the skulls arranged on shelves, the clothes preserved, the names on the walls. The guide explains that some survivors tried to hide in the ceiling for days.

Your name is on the wall with three hundred others. You lasted longer than most. You were quiet when it counted. It wasn't enough, and that wasn't a failure — it was the arithmetic of what happened there. Three hundred names. You are one of them. You were nineteen years old and you held still as long as you could.`
  },

  {
    id: "rw-ts-outcome-enclave-survived",
    survived: true,
    conditions: {
      rw_used_false_id: true
    },
    epilogue: `You survived. You made it to the Hôtel des Mille Collines. You showed Marie's Hutu identity card at the roadblock. The militia commander looked at you, looked at the card, waved you through. You lived as someone else for three months—Marie's name, Marie's identity, Marie's safety. Twelve hundred people crammed into that hotel. UN peacekeepers held the perimeter. The militia threatened daily but never breached the gates. When the RPF captured Kigali, you reclaimed your real name. Immaculée. Tutsi. Survivor.

The years after were complicated. You carried guilt for using a false identity—you survived because you could pass, because you had a Hutu friend, because you were lucky. Thousands who looked like you didn't have those options. The hotel became famous. Tourists visit. They take photos. They ask questions. You're invited to speak at conferences, to share your story, to educate. Sometimes you do. Sometimes you can't.

Marie survived too. She knows you used her card. She never asked for it back. She never told anyone. You see her sometimes—at memorials, at reconciliation meetings. You don't talk about 1994. You don't need to. She knows what she gave you. You know what it cost her. You both carry that forward. You survived, and that's both gift and burden.`
  },

  {
    id: "rw-ts-outcome-testimony-survived",
    survived: true,
    conditions: {
      rw_witnessed_massacre: true,
      rw_escaped_church: true
    },
    epilogue: `You survived. You witnessed the church massacre—Father Michel killed, grenades, machetes, children. You escaped through the side door during the chaos. You flagged down a UN convoy. You carried what you saw. Most people in that church didn't survive. You did, and you remember everything. The screams. The smell. The faces. You're a witness. That's a burden. That's also a purpose.

The International Criminal Tribunal for Rwanda called you to testify in 2006. You flew to Arusha, Tanzania. You sat in a formal courtroom with translators and judges from three countries. You described what you saw. Every detail. Names. Times. Who gave orders. Who carried them out. The defense attorney cross-examined you. He questioned your memory, your motives, your credibility. You held steady. Your testimony helped convict the militia commander who organized the massacre.

Some survivors find power in testimony. You found both power and exhaustion. Speaking the truth made it real again. But it also made it matter. The historical record includes your voice. Justice depended on witnesses like you. The memorial lists the names of those who died. You visit once a year. You speak their names. You carry their stories forward. You survived to remember, and that's both gift and burden.`
  },

  {
    id: "rw-ts-outcome-testimony-killed",
    survived: false,
    conditions: {
      rw_witnessed_massacre: true,
      rw_escaped_church: true,
      rw_trusted_church: true
    },
    deathContext: {
      cause: "Killed during the genocide after escaping the church",
      historicalRate: "Most Tutsi who escaped church massacres were caught at subsequent roadblocks",
      yourChoices: "You escaped the church. You saw what happened. You tried to reach safety."
    },
    epilogue: `You didn't survive. You escaped the church — ran through the side door while the militia was still inside. You saw what happened. Father Michel. The grenades. The children. You carried that out with you into the street and tried to survive long enough for it to matter.

Whether you were caught at a roadblock, killed while hiding, or found during the systematic searches that continued throughout the genocide, you didn't make it to safety. Your identity card. Your face. The organized nature of the killing. The combination was lethal.

The church became a genocide memorial. The RPF documented what happened there. Witnesses testified at the ICTR about the massacre — people who escaped through other doors, who survived different roadblocks. Your story was told by them. The memorial lists your name with the three hundred who died that day. You were nineteen years old. You had seen everything. You just didn't survive long enough to say it.`
  },

  {
    id: "rw-ts-outcome-ceiling-killed",
    survived: false,
    conditions: {
      rw_survived_church_hiding: true,
      rw_trusted_church: true
    },
    deathContext: {
      cause: "Killed during the genocide after hiding in the church ceiling",
      historicalRate: "Militia systematically searched churches for survivors in the days following massacres",
      yourChoices: "You hid in the ceiling crawlspace. The militia searched for survivors."
    },
    epilogue: `You didn't survive. You held absolutely still in the ceiling for as long as you could. The old man beside you held still too. The militia returned to search — they always came back. Whether they found you in the crawlspace, or you were forced out by thirst and starvation, or you were caught trying to escape, you were discovered before the RPF arrived.

The church was documented by the RPF when they captured the area. The crawlspace above the sacristy was noted in their records — evidence of people who had tried to hide there. The church became a genocide memorial. Tourists visit now. They see the skulls arranged on shelves, the clothes preserved, the names on the walls. The guide explains that some survivors hid in the ceiling for days before being found.

Your name is on the wall with three hundred others. You lasted longer than most. You were quiet when it counted. It wasn't enough, and that wasn't a failure — it was the arithmetic of what happened there. Three hundred names. You are one of them. You were nineteen years old and you held still as long as you could.`
  },

  {
    id: "rw-ts-outcome-attic-killed",
    survived: false,
    conditions: {
      rw_hid_with_hutu: true
    },
    deathContext: {
      cause: "Killed during the genocide after being discovered in hiding",
      historicalRate: "Many Hutu who sheltered Tutsi were betrayed by family members who were militia",
      yourChoices: "You hid in Jeanne's attic. Her brother was Interahamwe. Your hiding place was eventually discovered."
    },
    epilogue: `You didn't survive. Jeanne hid you in her attic. Her brother was Interahamwe. He came by repeatedly, asking questions, searching. Eventually you were discovered — whether he found you himself, whether someone else informed on Jeanne, whether you were forced out by circumstances beyond anyone's control, the protection that had kept you alive for days or weeks ultimately failed.

Jeanne was arrested for sheltering a Tutsi. She survived the genocide — released when the RPF arrived — but her brother served six years for roadblock killings and for what happened to you. The gacaca courts heard testimony about that attic. Jeanne's children testified about the time you spent up there. About the silence. About how they'd learned not to speak.

You were hidden by someone who risked everything to protect you. That protection wasn't enough, and that failure wasn't Jeanne's — it was the systematic, organized nature of what was happening. Militia members were searching houses. Family members were informing on family members. Jeanne's courage was real. The genocide was more organized than her courage could contain. Your name is in the gacaca record alongside hers. She still visits the memorial on April 7th. She says your name out loud every year.`
  },

  {
    id: "rw-ts-outcome-enclave-killed",
    survived: false,
    conditions: {
      rw_used_false_id: true
    },
    deathContext: {
      cause: "Killed during the genocide despite reaching UN protection",
      historicalRate: "While most people in the Hôtel des Mille Collines survived, the threat of militia breach was constant and some protected sites were overrun",
      yourChoices: "You made it to the hotel with Marie's identity card. You were inside the UN-protected perimeter."
    },
    epilogue: `You didn't survive. You made it to the hotel — showed Marie's card, got through the roadblock, registered under her name. Twelve hundred people in a building meant for two hundred. UN peacekeepers at the gate. For a time it held.

Whether the militia eventually breached the perimeter, whether you were discovered using a false identity, whether you were killed during an evacuation attempt or in the chaos of the genocide's final weeks, you died despite reaching what should have been safety. The protection was real but incomplete. The hotel became a symbol of survival, but not everyone inside survived.

The hotel became famous after the genocide. A film was made about it. The manager who negotiated for the people inside became an international figure. The twelve hundred who survived are cited in every account of the genocide as evidence that protection was possible. You were inside that protection. It just didn't hold long enough to include you. Your name is recorded among those who sought sanctuary and didn't survive. Marie knows what happened to her card. She carries that knowledge forward.`
  },

  // TESTIMONY PATH - SPECIFIC AFTERMATH OUTCOMES
  {
    id: "rw-ts-outcome-testimony-full-survived",
    survived: true,
    conditions: {
      rw_witnessed_massacre: true,
      rw_reached_un_protection: true,
      rw_testified_ictr: true,
      rw_chose_justice: true
    },
    epilogue: `You survived. You testified fully — every name, every detail. Arusha 2006. The International Criminal Tribunal for Rwanda. The defense attorney cross-examined you for three days. He questioned your memory, your timeline, your motives. You held steady. You described Father Michel's death. The grenades. The children. The militia commander who gave the orders. Your testimony helped convict him.

The weight of speaking is different from the weight of silence. You carry both now: what you saw and what you said about it. Some survivors found power in testimony. You found exhaustion and purpose in equal measure. The historical record includes your voice. Justice depended on witnesses like you. That matters. It also cost something.

You visit the memorial each April 7th. Kwibuka. The church is preserved as it was — skulls on shelves, clothes behind glass, names on walls. Three hundred died there. You saw it happen. You spoke about it in a courtroom in Tanzania. The guide asks if you want to speak at the ceremony. Sometimes you do. Sometimes you can't. Both are true. You survived to remember, and you remembered out loud. That's both gift and burden.`
  },

  {
    id: "rw-ts-outcome-testimony-protected-survived",
    survived: true,
    conditions: {
      rw_witnessed_massacre: true,
      rw_reached_un_protection: true,
      rw_testified_ictr: true,
      rw_chose_protection: true
    },
    epilogue: `You survived. You testified but withheld some names — people who helped you escape who might face reprisals. The judges accepted the partial account. Three convictions came from what you gave. The names you kept are still with you. You don't know if protecting them was the right choice or just the human one.

Rwanda's reconciliation process assumed full disclosure. You gave partial truth and received full protection. Both facts sit in the same file. The defense attorney pressed you on the gaps in your testimony. You held the line. Some information belongs to you. Some belongs to the court. You decided which was which.

The memorial lists the names of those who died. You visit once a year. April 7th. You speak some names out loud. Others you carry silently. The gacaca courts asked you to testify locally. You declined. You'd given what you could give in Arusha. The rest stays with you. You survived to remember, and you remembered on your terms. That's both gift and burden.`
  },

  {
    id: "rw-ts-outcome-testimony-declined-survived",
    survived: true,
    conditions: {
      rw_witnessed_massacre: true,
      rw_reached_un_protection: true,
      rw_declined_testimony: true,
      rw_chose_healing: true
    },
    epilogue: `You survived. You were called to testify and declined. The ICTR noted your refusal without reprimand — witnesses couldn't be compelled. The militia commander who organized the church massacre was convicted on other testimony. You watched the verdict on television in your apartment in Kigali. You had seen everything. The court managed without your seeing.

You don't know if that's relief or its own weight. Some survivors found power in testimony. You found the prospect exhausting. Speaking the truth would have made it real again in a way you weren't ready for. Maybe you never will be. That's allowed. Justice happened without you. The memorial still stands. The names are still on the wall.

You visit once a year. April 7th. Kwibuka. You don't speak at ceremonies. You stand at the wall of names for twenty minutes and leave. That's your testimony. It belongs to you. Rwanda's reconciliation process asks survivors to participate publicly. You participate privately. Both are valid. You survived to remember, and you remember on your terms. That's both gift and burden.`
  },

  // DITCH HIDING PATH - SPECIFIC AFTERMATH OUTCOMES
  {
    id: "rw-ts-outcome-ditch-spoke-survived",
    survived: true,
    conditions: {
      rw_stayed_hidden_ditch: true,
      rw_witnessed_massacre: true,
      rw_shared_testimony: true
    },
    epilogue: `You survived by staying invisible during the genocide. You spent the years after doing the opposite — speaking at commemorations, telling what you saw at the church. The memorial guide asked you to help train volunteer speakers. You did for three years, then stopped. Speaking helped and then it didn't. You're allowed to stop.

The drainage ditch kept you alive for one night. The RPF arrived weeks later. You emerged thin, traumatized, a witness to something most people didn't believe was happening while it happened. You chose to speak about it. Students listened. Journalists recorded. Researchers cited. Your testimony became part of the historical record.

Then it became exhausting. The same questions. The same details. The same faces looking for lessons in your survival. You stopped accepting speaking invitations. The memorial still has your recorded testimony. That's enough. You visit on April 7th. Kwibuka. You stand at the wall of names. You don't speak anymore. You already said what needed saying. You survived to remember, and you remembered out loud until you didn't need to anymore. That's both gift and burden.`
  },

  {
    id: "rw-ts-outcome-ditch-private-survived",
    survived: true,
    conditions: {
      rw_stayed_hidden_ditch: true,
      rw_witnessed_massacre: true,
      rw_mourned_privately: true
    },
    epilogue: `You survived by staying invisible. You attended the Kwibuka ceremony once and didn't go back. Not because you don't remember — you remember everything — but because remembering publicly and remembering privately are different acts and you chose the second. The gacaca courts asked if you had testimony to give. You said you didn't know who gave orders. That was partly true. You carry the rest.

The drainage ditch kept you alive for one night. The RPF arrived weeks later. You emerged and reclaimed your life quietly. No speeches. No interviews. No public testimony. Some survivors found meaning in speaking. You found meaning in silence. Both are valid responses to what happened.

The memorial exists. The names are on the wall. You know where it is. You don't go. Your remembering happens in your apartment, in your thoughts, in the way you move through Kigali knowing what happened in every neighborhood. That's your ceremony. It belongs to you. Rwanda's reconciliation process asks survivors to participate publicly. You participate by living. That's enough. You survived to remember, and you remember privately. That's both gift and burden.`
  },

  {
    id: "rw-ts-outcome-ditch-distance-survived",
    survived: true,
    conditions: {
      rw_stayed_hidden_ditch: true,
      rw_witnessed_massacre: true,
      rw_avoided_ceremony: true
    },
    epilogue: `You survived by staying invisible. The ceremony is every April 7th. You leave Kigali that week. You go to your cousin's in Butare and come back on the 15th. You don't explain it to your children. They're old enough to know what Kwibuka is and young enough not to ask why you leave. The church is a memorial now. You haven't been back. You don't need to go back to know what's there.

The drainage ditch kept you alive for one night. The RPF arrived weeks later. You emerged and built a life that doesn't center on 1994. Some survivors found meaning in commemoration. You found meaning in distance. Both are valid responses to what happened. Rwanda's reconciliation process asks survivors to remember together. You remember alone.

The memorial guide called once asking if you'd speak. You said no. You didn't explain and they stopped asking. Your silence is its own testimony. You know what happened. You carry it. You don't need an audience for that carrying. You survived to remember, and you remember at a distance. That's both gift and burden.`
  },

  // CEILING HIDING PATH - SPECIFIC AFTERMATH OUTCOMES
  {
    id: "rw-ts-outcome-ceiling-spoke-survived",
    survived: true,
    conditions: {
      rw_survived_church_hiding: true,
      rw_hid_in_church: true,
      rw_shared_testimony: true
    },
    epilogue: `Three days in the ceiling. Seven survivors from three hundred. You speak about it now — at schools, at the memorial, at international conferences. The old man who hid with you and died two days after liberation: you say his name at every talk. You didn't know him before April 7th. You know his name now better than most people in your life.

The crawlspace was barely three feet high. You couldn't stand. Couldn't move without noise. The militia searched below. You held still. The old man held still. When the RPF arrived, you climbed down. Bodies everywhere. He died of starvation and dehydration two days later. You lived. That difference is arbitrary and permanent.

You speak about it because someone has to. Students ask questions. Researchers take notes. Journalists record. Your testimony is part of the historical record now. Some survivors found power in speaking. You found obligation. The memorial guide thanks you after every talk. You nod. You'll do it again next month. You survived to remember, and you remember out loud. That's both gift and burden.`
  },

  {
    id: "rw-ts-outcome-ceiling-private-survived",
    survived: true,
    conditions: {
      rw_survived_church_hiding: true,
      rw_hid_in_church: true,
      rw_mourned_privately: true
    },
    epilogue: `Seven survivors. Three hundred dead. You don't attend the memorial ceremonies. You go on April 7th before anyone arrives, before the chairs are set up, before the guides come. You stand at the wall of names for twenty minutes and leave. That's your ceremony. It belongs to you.

Three days in the ceiling. The old man beside you died two days after liberation. You lived. That difference is arbitrary and permanent. The memorial guide calls every year asking if you'll speak. You always say no. You don't explain. Your silence is its own testimony. The crawlspace is still there. Tourists look up at it now. You don't need to be in the room for it to hold what it holds.

Some survivors found meaning in public remembrance. You found meaning in private mourning. Both are valid. The names are on the wall. You know where they are. You visit alone, early, before the ceremony. That's enough. You survived to remember, and you remember privately. That's both gift and burden.`
  },

  {
    id: "rw-ts-outcome-ceiling-distance-survived",
    survived: true,
    conditions: {
      rw_survived_church_hiding: true,
      rw_hid_in_church: true,
      rw_avoided_ceremony: true
    },
    epilogue: `Seven survivors. Three hundred dead. The memorial guide calls every year asking if you'll speak. You always say no. You don't explain and the guide has stopped asking for explanations. Your silence is its own testimony. The ceiling is still there. Tourists look up at it now. You don't need to be in the room for it to hold what it holds.

Three days in the crawlspace. The old man beside you died two days after liberation. You lived. You don't attend Kwibuka. You don't visit the memorial. You don't speak at ceremonies. Not because you don't remember — you remember everything — but because remembering publicly and remembering privately are different acts and you chose the second.

Some survivors found meaning in commemoration. You found meaning in distance. Both are valid responses to what happened. The church is a memorial now. The names are on the wall. You know they're there. You don't need to see them to carry them. You survived to remember, and you remember at a distance. That's both gift and burden.`
  },

  // ATTIC HIDING PATH - SPECIFIC AFTERMATH OUTCOMES
  {
    id: "rw-ts-outcome-attic-spoke-survived",
    survived: true,
    conditions: {
      rw_hid_with_hutu: true,
      rw_trusted_protector: true,
      rw_attended_reconciliation: true,
      rw_spoke_truth: true
    },
    epilogue: `You attended the reconciliation meeting and spoke. 2010. Sixteen years after Jeanne hid you in her attic for three weeks while her Interahamwe brother searched the house. The gacaca courts concluded. He confessed to roadblock killings. He served six years. He's back in the village now. Jeanne invited you to the meeting. You came. You spoke.

You described what Jeanne did — the three weeks, the lies she told her brother, the risk she carried. You described what her brother did — the roadblocks, the killings, the searches of the house. You didn't forgive. You didn't condemn. You spoke what happened. Jeanne's brother sat four seats away. He didn't look at you while you spoke. When you finished, he looked at you. He didn't apologize. He nodded once.

That's not reconciliation. That's acknowledgment. Rwanda asks people to live in the difference. You attend the meetings when Jeanne asks. You speak when you have something to say. Jeanne sits beside you. After, over tea in her kitchen, she says "thank you for coming." You say "thank you for hiding me." Both are still true. You survived because someone chose to help you. You speak because someone needs to say what happened. That's both gift and burden.`
  },

  {
    id: "rw-ts-outcome-attic-silent-survived",
    survived: true,
    conditions: {
      rw_hid_with_hutu: true,
      rw_trusted_protector: true,
      rw_attended_reconciliation: true,
      rw_stayed_silent: true
    },
    epilogue: `You attended the reconciliation meeting but stayed silent. 2010. Sixteen years after Jeanne hid you in her attic for three weeks while her Interahamwe brother searched the house. The gacaca courts concluded. He confessed to roadblock killings. He served six years. He's back in the village now. Jeanne invited you to the meeting. You came. You sat in the circle. You listened.

Jeanne's brother gave his partial account — he mentioned the roadblocks, the orders he followed, the people he turned away. He didn't mention searching Jeanne's house three times. He didn't mention that he knew people were hiding in houses like hers. You didn't correct him. The facilitator asked if anyone else wanted to speak. You shook your head. Jeanne looked at you. Her brother looked at the floor.

That silence has weight. It's not forgiveness. It's not absolution. It's the space where you hold what you know and he holds what he knows and Jeanne holds what she did between you. The meeting ended. Jeanne walked you home. She didn't ask why you stayed silent. She knows. You attend the meetings when she asks. Sometimes you speak. Sometimes you don't. Your silence is also testimony. You survived because someone chose to help you. You carry that forward in the way you choose. That's both gift and burden.`
  },

  {
    id: "rw-ts-outcome-attic-declined-survived",
    survived: true,
    conditions: {
      rw_hid_with_hutu: true,
      rw_trusted_protector: true,
      rw_declined_reconciliation: true,
      rw_chose_boundaries: true
    },
    epilogue: `You declined the reconciliation meeting. Not yet. Maybe never. 2010. Sixteen years after Jeanne hid you in her attic for three weeks while her Interahamwe brother searched the house. The gacaca courts concluded. He confessed to roadblock killings. He served six years. He's back in the village now. Jeanne invited you to a meeting with him. You said no.

The facilitator called and said this was your right. Jeanne came to your house the next day. She brought tea. She said "I understand." You said "I'm grateful to you. I'm not ready to sit across from him." She nodded. "I know." Her brother is back in the sector. You see him at the market sometimes. He sees you. You don't avoid the market. You don't speak to him. He doesn't speak to you. That's the boundary.

Rwanda's reconciliation policy is designed for people who can sit in rooms together and speak about what happened. Some people can't. Some people won't. That's also valid. Jeanne saved your life. Her brother participated in killings. Both facts are permanent. You carry gratitude and you carry boundaries. You survived because someone chose to help you. You honor that by choosing what you can and cannot do. That's both gift and burden.`
  },

  // ENCLAVE PATH - SPECIFIC AFTERMATH OUTCOMES
  {
    id: "rw-ts-outcome-enclave-spoke-survived",
    survived: true,
    conditions: {
      rw_reached_hotel: true,
      rw_used_false_id: true,
      rw_shared_hotel_story: true
    },
    epilogue: `You survived because you had a Hutu friend, because you could pass, because you were lucky. You speak at conferences about the hotel now. You're careful about what you say. You always say that part first — the conditions of your survival. The audiences want to hear about survival. You make them hear about the conditions.

Marie gave you her identity card. You showed it at the roadblock. The militia commander waved you through. You lived as someone else for three months. Twelve hundred people crammed into the Hôtel des Mille Collines. UN peacekeepers held the perimeter. When the RPF captured Kigali, you reclaimed your real name. Immaculée. Tutsi. Survivor.

Marie comes to some of the talks. Sits in the back. You have coffee after. You don't talk about 1994 during the talks. You talk about it after, in the café, where the real conversation happens. She knows what she gave you. You know what it cost her. You both carry that forward. You speak because someone needs to say what happened and how it happened. You survived because of specific conditions. You speak about those conditions. That's both gift and burden.`
  },

  {
    id: "rw-ts-outcome-enclave-listened-survived",
    survived: true,
    conditions: {
      rw_reached_hotel: true,
      rw_used_false_id: true,
      rw_attended_conference: true,
      rw_chose_listening: true
    },
    epilogue: `You survived because you had a Hutu friend, because you could pass, because you were lucky. You attended the conference and listened. Other survivors spoke. You didn't raise your hand. The moderator asked if anyone else wanted to share. You shook your head. The man next to you — another hotel survivor — leaned over and said "you don't have to." You already knew that. It helped to hear it anyway.

Marie gave you her identity card. You showed it at the roadblock. The militia commander waved you through. You lived as someone else for three months. Twelve hundred people crammed into the Hôtel des Mille Collines. UN peacekeepers held the perimeter. When the RPF captured Kigali, you reclaimed your real name. Immaculée. Tutsi. Survivor.

You attend conferences sometimes. You listen. You don't speak publicly. Some survivors found meaning in testimony. You find meaning in listening to others. Both are valid. Marie knows you attended. She doesn't ask if you spoke. She knows you didn't. That's fine. You survived because of specific conditions. You carry that forward quietly. That's both gift and burden.`
  },

  {
    id: "rw-ts-outcome-enclave-private-survived",
    survived: true,
    conditions: {
      rw_reached_hotel: true,
      rw_used_false_id: true,
      rw_declined_conference: true,
      rw_chose_private_life: true
    },
    epilogue: `You survived because you had a Hutu friend, because you could pass, because you were lucky. You declined the conference invitation. The conference was about survivor testimony and international accountability. You support both. You just don't want to be the one in the chair. Marie's card got you through the roadblock. You've spent thirty years making sure Marie's children know what their mother did. That's your contribution. It doesn't need an audience.

You lived as someone else for three months. Twelve hundred people crammed into the Hôtel des Mille Collines. UN peacekeepers held the perimeter. When the RPF captured Kigali, you reclaimed your real name. Immaculée. Tutsi. Survivor. The hotel became famous. A film was made. The manager became an international figure. You're cited in accounts as one of the twelve hundred who survived.

You don't speak at conferences. You don't give interviews. You live your life. Marie's children know what their mother did. That's what matters. Some survivors found meaning in public testimony. You found meaning in private gratitude. Both are valid. You survived because someone chose to help you. You honor that privately. That's both gift and burden.`
  },


];

// Export role data
export default {
  scenes: tutsiSurvivorScenes,
  outcomes: tutsiSurvivorOutcomes
};
