/**
 * Rwanda Genocide Mission - Tutsi Survivor (Immaculée) Role
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

You made it to the hotel. The Hôtel des Mille Collines. UN peacekeepers at the gate. Blue helmets. Canadian accents. Inside, chaos—twelve hundred people crammed into a building meant for two hundred. Families in hallways. Children crying. Too many people in too small a space.

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
    narrative: `2008. Kigali. You survived Father Michel's church. When the militia came and the grenades hit and the congregation ran, you found a way to stay alive — hidden in the dark, or out through the side door and into the city — while three hundred people in that building did not. You were one of the few who made it out.

Now it's fourteen years later. The church is a genocide memorial. Skulls on shelves. Clothes preserved. Names on walls. You come here once a year. April 7th. Kwibuka—remembrance. The government organizes ceremonies. Speeches about unity and reconciliation. "We are all Rwandans now. No Hutu. No Tutsi."

But you remember exactly how you survived and exactly who didn't. You remember the specific sounds. The specific smells. Survivor guilt is a weight that doesn't lift — not for those who stayed still in the dark, and not for those who ran. The memorial guide asks if you want to speak at the ceremony. Share your story. Help the next generation understand.

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
  {
    id: "rw-ts-outcome-church-testified-survived",
    survived: true,
    conditions: {
      rw_witnessed_massacre: true,
      rw_reached_un_protection: true,
      rw_testified_ictr: true,
      rw_chose_justice: true
    },
    epilogue: `You survived. When the grenades hit Father Michel's church and the militia poured through the doors, you slipped out through the side entrance and ran. You hid in a drainage ditch smelling of sewage and smoke, clutching the images of what you had just witnessed, and flagged down a UN convoy before the Interahamwe could sweep the perimeter.

In 2006, you traveled to Arusha for the ICTR tribunal. You sat across a formal courtroom from the militia commander who had organized the church massacre. You gave the prosecutor every detail — the specific sequence of grenades and machetes, the timeline from Father Michel's death to the moment you reached the side door, the commanders you recognized. Your testimony was the linchpin that secured the conviction. It did not restore what you saw in the church. But it placed the men responsible in the historical and legal record, and it happened because a nineteen-year-old university student ran out a side door and survived to tell the truth about what she witnessed.`
  },

  {
    id: "rw-ts-outcome-church-declined-survived",
    survived: true,
    conditions: {
      rw_witnessed_massacre: true,
      rw_reached_un_protection: true,
      rw_declined_testimony: true,
      rw_chose_healing: true
    },
    epilogue: `You survived. You escaped Father Michel's church through the side door as grenades and machetes tore through the congregation behind you. You hid in a drainage ditch, shaking, and flagged down a UN convoy before the militia's perimeter sweep could find you.

When the ICTR prosecutor called you to Arusha in 2006, you declined to testify. The crawlspace of memory you had sealed shut to survive — the specific faces, the sequence of sounds, the moment Father Michel fell — was not something you could reopen in front of lawyers and the man who ordered it. The court secured a conviction using other survivors' testimony. You watched the verdict on television in your Kigali apartment, knowing you carried the truth of that church quietly, intact, yours — and that choosing your own healing over an international audience was not a failure of justice but a claim on your own survival.`
  },

  {
    id: "rw-ts-outcome-ceiling-spoke-survived",
    survived: true,
    conditions: {
      rw_survived_church_hiding: true,
      rw_shared_testimony: true,
      rw_chose_education: true
    },
    epilogue: `You survived. You spent days in a three-foot crawlspace above the church sacristy, pressed flat against the boards in the heat, holding yourself still while the militia looted the bodies below. The old man beside you in the ceiling died of starvation and dehydration two days after the RPF arrived. You were one of seven people who climbed out of a church that held three hundred.

At the Kigali memorial in 2008, when the guide asked if you would speak at the Kwibuka ceremony, you said yes. You stood before the students and the cameras and described the old man in the ceiling — his shallow breathing, the way he looked at you when he coughed, the apology in his face. You told them what absolute silence costs and what it protects. You made sure that one specific detail of surviving above a massacre — not a statistic, not a speech — became part of what the next generation learned when they came to see the skulls on the shelves.`
  },

  {
    id: "rw-ts-outcome-ceiling-silent-survived",
    survived: true,
    conditions: {
      rw_survived_church_hiding: true,
      rw_mourned_privately: true,
      rw_chose_privacy: true
    },
    epilogue: `You survived. You spent days in the three-foot crawlspace above the church sacristy, motionless in the heat, listening to the militia move through the bodies below. The old man beside you died days after liberation. You were one of seven who climbed down from a church that held three hundred.

When the memorial guide asked you to speak at the Kwibuka ceremony in 2008, you declined. You attended. You sat in the rows with the other survivors, present but silent, while the speeches were made and the cameras filmed. Your survival in that ceiling is not a lesson or an inspiration. It is yours — a private reckoning with what it cost to stay still and what it cost the man beside you. You visit the memorial alone, early, before the crowds arrive, and you mourn on your own terms.`
  },

  {
    id: "rw-ts-outcome-ceiling-distance-survived",
    survived: true,
    conditions: {
      rw_survived_church_hiding: true,
      rw_avoided_ceremony: true,
      rw_chose_distance: true
    },
    epilogue: `You survived. You spent days in the three-foot crawlspace above the church sacristy, holding yourself still above the massacre, listening to the militia return to loot and check and leave again. The old man beside you died days after liberation. You were one of seven from a church that held three hundred.

In 2008, when Kwibuka came, you stayed home. The government's ceremonies, the preserved clothes, the skulls arranged for visitors — you couldn't place your specific survival inside that framing. You know what happened in the ceiling above that sacristy. You know what it weighed. Some years, distance is not avoidance. Some years, it is the only honest response to a wound that hasn't closed.`
  },

  {
    id: "rw-ts-outcome-attic-spoke-survived",
    survived: true,
    conditions: {
      rw_hid_with_hutu: true,
      rw_trusted_protector: true,
      rw_attended_reconciliation: true,
      rw_spoke_truth: true
    },
    epilogue: `You survived. You spent three weeks in Jeanne's four-by-six-foot attic, baking in the heat, listening to her Interahamwe brother interrogate her just below the ceiling panel. Jeanne fed you bread at night and kept her children's silence. Her husband Paul was killed at a roadblock. You climbed down when the RPF arrived.

At the village reconciliation meeting in 2010, you stood up and told the full, complicated truth. You looked at Jeanne's brother — a man who had staffed the roadblocks where Paul was killed — and described what his actions had cost. Then you told the village what his sister had done: three weeks of daily lies to the militia to keep a Tutsi student alive in her attic. You refused to simplify either fact. You didn't forgive him. You didn't pretend the reconciliation was complete. But you made sure Jeanne's defiance was part of the official record of what happened in that village, alongside the true weight of what her brother chose.`
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
    epilogue: `You survived. You endured three weeks in Jeanne's attic — the heat, the bucket, the absolute silence while her brother questioned her downstairs. She kept you alive. Her husband Paul did not survive the roadblocks.

At the village reconciliation meeting in 2010, you attended and sat a few seats from Jeanne's brother. You said nothing. The facilitator asked you to speak; you shook your head. You knew what he had done at the roadblocks. You also knew that the woman who saved your life was watching, and that condemning her brother in that room would do something irreversible to her. You chose silence — not because you had forgiven him, not because the reconciliation was real, but because the sister who hid you in her attic deserved to navigate her own grief without you forcing her hand in public. You carry that silence the way you carry the attic: as something that kept you alive and cost you something real.`
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
    epilogue: `You survived. You spent three weeks in Jeanne's sweltering four-by-six-foot attic, staying absolutely silent while her Interahamwe brother hunted Tutsi just outside the door. Jeanne risked her children and her own life for you. Her husband Paul died at a roadblock. You owe her everything.

When the village reconciliation meetings began, you declined to attend. The government's policy was coexistence — "we are all Rwandans" — and Jeanne's brother had served his six years and returned. You understood why the structure existed. You also understood that sitting in a room and performing forgiveness for a man who helped kill people at the same roadblocks where Paul died was not something you owed anyone. You honor Jeanne privately. You visit her family. Your boundary is not bitterness — it is honesty about what reconciliation requires and what it cannot be made to mean by a government decree.`
  },

  {
    id: "rw-ts-outcome-hotel-public-survived",
    survived: true,
    conditions: {
      rw_reached_hotel: true,
      rw_used_false_id: true,
      rw_shared_hotel_story: true,
      rw_chose_visibility: true
    },
    epilogue: `You survived. You handed the exhausted militia commander Marie's Hutu student ID at the roadblock outside the hotel — "I'm mixed. My mother—" — and he waved you through. You spent three months crammed into a conference room at the Hôtel des Mille Collines with twelve hundred other refugees, living under your roommate's name while the UN blue helmets held the perimeter.

When you accepted the invitation to speak at the survivors' conference in 2007, you reclaimed your name out loud in front of the room: Immaculée. Tutsi. Survivor. You explained what a colonial-era identity card actually was — a Belgian bureaucratic instrument repurposed as a death warrant — and you described what it felt like to hand a piece of paper with another woman's name across to a man who was deciding whether you lived. You turned the specific absurdity and horror of surviving on a borrowed identity into something the next generation of students could hold onto and understand.`
  },

  {
    id: "rw-ts-outcome-hotel-private-survived",
    survived: true,
    conditions: {
      rw_reached_hotel: true,
      rw_used_false_id: true,
      rw_attended_conference: true,
      rw_chose_listening: true
    },
    epilogue: `You survived. You bluffed your way past the militia commander at the roadblock using Marie's Hutu student ID and spent three months inside the Hôtel des Mille Collines living under her name, registered with the UN as someone else, waiting for the RPF.

At the 2007 survivors' conference, you attended but did not speak. You listened to other survivors describe what it was like inside the hotel — the crowding, the threats from outside, the peacekeepers who held the line. Their accounts matched yours exactly, and it was enough to hear them said aloud by others. You reclaimed your name, Immaculée, when the RPF arrived. You did not need a microphone or a panel discussion to confirm that it belongs to you. The conference mattered. Your silence in it was also a choice about what your survival owes to public performance and what it doesn't.`
  },

  {
    id: "rw-ts-outcome-hotel-private-life-survived",
    survived: true,
    conditions: {
      rw_reached_hotel: true,
      rw_used_false_id: true,
      rw_declined_conference: true,
      rw_chose_private_life: true
    },
    epilogue: `You survived. You handed Marie's Hutu ID to the militia commander at the roadblock and spent three months inside the Hôtel des Mille Collines living as her cousin, waiting for the city to be liberated. When the RPF arrived, you reclaimed your name: Immaculée.

When the conference invitation came in 2007, you declined. You survived because your roommate handed you a card, because you could pass, because the commander was tired, because the UN held the perimeter — because of an accumulation of contingencies that had nothing to do with your choices and everything to do with luck. You support the documentation of the genocide. You are glad others testify. But you do not believe your survival obligates you to turn it into a panel discussion or an educational example. You live quietly, privately grateful to Marie for the card, and privately committed to a life that is more than what almost ended it.`
  },

  // DITCH PATH SURVIVAL OUTCOMES (church → escape side door → hid in ditch → memorial 04b)
  // TS-1 fix: paths 4-6. Player escaped through side door and hid in a drainage ditch. NOT the ceiling.
  {
    id: "rw-ts-outcome-ditch-spoke-survived",
    survived: true,
    conditions: {
      rw_escaped_church: true,
      rw_witnessed_massacre: true,
      rw_stayed_hidden_ditch: true,
      rw_shared_testimony: true,
      rw_chose_education: true
    },
    epilogue: `You survived. You slipped out through the side door of Father Michel's church while the militia was still moving through the congregation. You ran two blocks and lowered yourself into a drainage ditch that smelled of sewage and smoke, pulling yourself flat while RTLM played cheerfully from a nearby radio. You lay there until dark, then moved through the city by night until the RPF arrived.

At the Kigali memorial in 2008, you said yes when the guide asked if you would speak at the Kwibuka ceremony. You stood before the students and the cameras and described what you had seen through that side door — Father Michel killed, grenades, machetes, children — and what it had been like to lie in a ditch two blocks away listening to it end. You described the smell of the sewage and the smoke mixing, the cheerful radio announcing while people died. You made sure the specific, embodied reality of surviving outside the building — not statistics, not distance — was part of what the next generation carried out of that ceremony.`
  },

  {
    id: "rw-ts-outcome-ditch-silent-survived",
    survived: true,
    conditions: {
      rw_escaped_church: true,
      rw_witnessed_massacre: true,
      rw_stayed_hidden_ditch: true,
      rw_mourned_privately: true,
      rw_chose_privacy: true
    },
    epilogue: `You survived. You escaped through the side door of Father Michel's church and ran to a drainage ditch two blocks away. You lay there smelling sewage and smoke while the screaming stopped and RTLM resumed. You survived by staying still in the dark, and you eventually made your way out of the city as the RPF advanced.

At Kwibuka in 2008, you attended the ceremony but did not speak. You sat in the rows and watched the memorial guide lead the students through the preserved clothes and the names on the walls. You know what the church looked like from the outside when you ran. You know what it sounded like from the ditch. Those things are yours — not a lesson to deliver from a stage, not a statement for the cameras. You mourn privately, on your own terms, each year on April 7th.`
  },

  {
    id: "rw-ts-outcome-ditch-distance-survived",
    survived: true,
    conditions: {
      rw_escaped_church: true,
      rw_witnessed_massacre: true,
      rw_stayed_hidden_ditch: true,
      rw_avoided_ceremony: true,
      rw_chose_distance: true
    },
    epilogue: `You survived. You got out through the side door while the militia was still inside. You hid in a drainage ditch two blocks away, flat in the sewage smell and the smoke, listening to the screaming end and the radio resume. You survived the hundred days by staying hidden and moving at night, and when the RPF arrived you were still alive.

In 2008, when April 7th came, you stayed home. The Kigali memorial, the preserved clothes, the ceremonies — you understand why they exist. You also understand that the specific experience of lying in a ditch outside a church while hundreds of people died inside it is not something that fits inside the framework of a government ceremony. Some wounds don't close on an annual schedule. Staying home was not avoidance. It was the honest answer to the question of whether you were ready to make your survival into something public, and you weren't.`
  },

  // PROTECT-NAMES OUTCOME (church → escape → UN convoy → testify-but-protect-names)
  // TS-2 fix: path 2. Player testified at ICTR but chose to protect some names. Must NOT say "gave every detail."
  {
    id: "rw-ts-outcome-church-protected-survived",
    survived: true,
    conditions: {
      rw_witnessed_massacre: true,
      rw_reached_un_protection: true,
      rw_testified_ictr: true,
      rw_chose_protection: true
    },
    epilogue: `You survived. After watching Father Michel fall and the congregation cut down with grenades and machetes, you escaped through the side door and hid in a drainage ditch until a UN convoy found you. You carried the faces and the sequence of that morning out of the church and across years.

In 2006, at the ICTR in Arusha, you testified — but not everything. You gave the prosecutor the timeline, the commanders you had seen, the structure of what had happened at the church. You withheld the names of two people who had helped you reach the UN convoy safely, people still living in Rwanda who you feared would face retaliation if identified in an international court record. The defense attorney pressed you on the gaps. You held. The court secured a conviction on the evidence you provided. Not a complete record — but enough. You chose what justice cost you personally and what it could not be allowed to cost the people who had helped you survive.`
  },

  // DEATH OUTCOMES (Occurring BEFORE post-genocide events)
  {
    id: "rw-ts-outcome-church-escaped-killed",
    survived: false,
    conditions: {
      rw_trusted_church: true,
      rw_escaped_church: true
    },
    deathContext: {
      cause: "Killed during the genocide after escaping the church",
      historicalRate: "Most Tutsi who escaped church massacres were caught at subsequent roadblocks",
      yourChoices: "You escaped the church through the side door. You saw what happened. You tried to reach safety."
    },
    deathEpilogueEarly: `You didn't survive. You slipped out through the side door of Father Michel's church while the militia was still moving through the congregation. You carried what you had seen — the grenades, the machetes, Father Michel falling — out into the street and ran.

The Interahamwe were methodical. They swept the perimeters of their massacre sites to catch anyone who had managed to get out. You were found in a drainage ditch before the RPF could reach the city. You died during the hundred days of the genocide, before the ICTR was operational, before any tribunal existed to hear what you had witnessed. You were a nineteen-year-old university student who saw the inside of a massacre and tried to carry it to safety. The testimony that could have convicted the men who organized it died with you.`
  },

  {
    id: "rw-ts-outcome-church-hiding-killed",
    survived: false,
    conditions: {
      rw_trusted_church: true,
      rw_hid_in_church: true
    },
    deathContext: {
      cause: "Discovered during the genocide while hiding in the church ceiling",
      historicalRate: "Militias routinely returned to massacre sites to hunt for survivors in ceilings and crypts",
      yourChoices: "You hid in the ceiling crawlspace. You stayed silent. But they came back."
    },
    deathEpilogueEarly: `You didn't survive. You pulled yourself into the three-foot crawlspace above the sacristy while the massacre unfolded below, pressing flat against the boards, breathing shallow. The old man beside you stayed still. The militia looted the bodies and left. Then they came back.

Whether the old man coughed, or they simply followed the protocol of checking every ceiling and crypt after a massacre site, they found you. You were pulled from the crawlspace and killed during the hundred days of the genocide, long before the memorial was built and the names were put on the walls. Your name is on those walls now. You are one of the three hundred.`
  },

  {
    id: "rw-ts-outcome-attic-killed",
    survived: false,
    conditions: {
      rw_hid_with_hutu: true
    },
    deathContext: {
      cause: "Discovered by militia during house-to-house searches",
      historicalRate: "Interahamwe routinely searched the homes of Hutu suspected of hiding Tutsi",
      yourChoices: "You trusted Jeanne. You hid in the attic. The militia searched the house."
    },
    deathEpilogueEarly: `You didn't survive. You climbed into Jeanne's four-by-six-foot attic and stayed absolutely silent while her Interahamwe brother questioned her below the ceiling panel every day. She kept her children quiet. She kept you fed at night. She lied to him every time he asked.

It wasn't enough. The militia eventually searched the house — whether because her brother finally looked, or because a neighbor reported something, or because the systematic house-to-house sweeps simply reached Jeanne's street. You were discovered in the attic during the hundred days of killing and died alongside the family who tried to save you. Jeanne had risked everything for you. You died knowing that, before the RPF arrived, before any gacaca court could record what she had done.`
  },

  {
    id: "rw-ts-outcome-hotel-killed",
    survived: false,
    conditions: {
      rw_attempted_hotel: true
    },
    deathContext: {
      cause: "Killed during the genocide despite attempting to reach protection",
      historicalRate: "Many were killed at roadblocks just outside protected enclaves",
      yourChoices: "You tried to reach the hotel using Marie's ID. You didn't make it to safety."
    },
    deathEpilogueEarly: `You didn't survive. You reached into your pocket and handed the militia commander Marie's Hutu student ID at the roadblock outside the Hôtel des Mille Collines — "I'm mixed. My mother—" — and waited for him to decide.

He didn't believe you. Or the ID was scrutinized more carefully on a second pass, or someone recognized you from the university, or the commander simply decided to be thorough. You were killed at that roadblock during the hundred days of the genocide, within sight of the UN blue helmets who held the hotel perimeter but could not intervene outside it. You never reached the conference room where twelve hundred people waited out the killing. You never reclaimed your name, Immaculée. You died three blocks from safety.`
  }
];

// Export role data
export default {
  scenes: tutsiSurvivorScenes,
  outcomes: tutsiSurvivorOutcomes
};