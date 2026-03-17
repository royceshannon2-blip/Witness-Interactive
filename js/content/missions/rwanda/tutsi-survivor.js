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
  {
    id: "rw-ts-outcome-church-testified-survived",
    survived: true,
    conditions: {
      rw_witnessed_massacre: true,
      rw_reached_un_protection: true,
      rw_testified_fully: true
    },
    epilogue: `You survived. After watching Father Michel murdered and the congregation slaughtered with machetes and grenades, you slipped out the side door, hid in a drainage ditch, and miraculously flagged down a passing UN convoy. 

In 2006, you traveled to Arusha for the ICTR tribunal. Sitting in that formal courtroom, you stared directly at the militia commander who orchestrated the church massacre. You gave them every detail—the screams, the smell, the exact timeline. Your testimony was the linchpin that put the commander behind bars. It didn't bring back the children you saw murdered, but your courage as a nineteen-year-old student solidified the historical record. You wielded your trauma as a weapon of justice.`
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
    epilogue: `You survived. You fled the massacre at Father Michel's church, escaping through the side door to hide in a drainage ditch before a UN convoy saved you. 

When called to Arusha for the ICTR tribunal in 2006, you declined to testify. The memory of the grenades, the machetes, and the sheer terror of that day was too heavy a burden to unpack in front of a room of lawyers and the very commander who caused it. The court secured a conviction using other testimony. You watched the verdict on television in your apartment in Kigali, knowing you carried the truth of what happened quietly, prioritizing your own healing over an international audience.`
  },

  {
    id: "rw-ts-outcome-ceiling-spoke-survived",
    survived: true,
    conditions: {
      rw_survived_church_hiding: true,
      rw_shared_testimony: true
    },
    epilogue: `You survived. You spent days trapped in a three-foot crawlspace above the church sacristy, holding your breath while the Interahamwe looted the bodies of your community below. You lived, while the seventy-year-old man who hid beside you died of starvation shortly after liberation.

Ten years later, at the Kigali memorial where the skulls of the congregation are now kept, you chose to speak. You stood before the students and cameras and told them about the old man in the ceiling, about the smell of death, and the absolute silence required to stay alive. You ensured that the specific, intimate horror of surviving in the dark above a massacre became part of the next generation's education.`
  },

  {
    id: "rw-ts-outcome-ceiling-silent-survived",
    survived: true,
    conditions: {
      rw_survived_church_hiding: true,
      rw_avoided_ceremony: true
    },
    epilogue: `You survived. You huddled in the dark crawlspace above the church sacristy, suffocating in the heat and the smell of the massacre below, holding perfectly still while the militia searched. The old man beside you died of starvation just days after the RPF arrived, but you made it out.

When the memorial guide asked you to speak at the ceremony ten years later, you refused. The church is full of tourists and preserved clothes now, but you don't need a microphone to remember what happened. You visit the memorial alone, early in the morning before the crowds arrive. Your survival in that ceiling is a private triumph and an enduring solitary grief.`
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
    epilogue: `You survived. You spent three agonizing weeks in Jeanne's sweltering four-by-six-foot attic, listening to her Interahamwe brother downstairs interrogate her about hidden Tutsi. Jeanne risked her own children's lives to keep you alive.

Years later, at the community gacaca court, you stood up and spoke the complicated truth. You looked at Jeanne's brother—a man who had killed others at roadblocks—and you told the village exactly what he had done. But you also told the village what his sister, a Hutu, had sacrificed to save a Tutsi. You didn't forgive him, but you cemented Jeanne's heroism in the official record. You navigated the impossible terrain of post-genocide Rwanda with absolute, unflinching honesty.`
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
    epilogue: `You survived. Jeanne hid you in her attic for three weeks, lying to her Interahamwe brother daily while you baked in the heat of a four-by-six-foot prison. She saved your life.

At the gacaca sector meeting, you sat in the audience, mere seats away from Jeanne's brother. You knew he had murdered people at the roadblocks, but you also knew his sister was the reason you were breathing. Caught in the crushing complexity of Rwandan reconciliation, you chose silence. You couldn't condemn the brother without complicating the life of the sister who saved you. You live with the quiet knowledge of who they both are, holding the boundaries of your own survival.`
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
    epilogue: `You survived. You endured three weeks hidden in Jeanne's attic, staying absolutely silent while her Interahamwe brother hunted Tutsi just outside the door. You owe your life to Jeanne's defiance.

When the reconciliation meetings began in your village years later, you declined to attend. The government mandated that you live side-by-side with perpetrators like Jeanne's brother, but you refused to participate in the performance of forgiveness. You established your boundaries, choosing to privately honor Jeanne's courage without subjecting yourself to the trauma of facing her brother in public.`
  },

  {
    id: "rw-ts-outcome-hotel-public-survived",
    survived: true,
    conditions: {
      rw_reached_hotel: true,
      rw_used_false_id: true,
      rw_spoke_at_conference: true,
      rw_chose_public_life: true
    },
    epilogue: `You survived. Armed with your Hutu roommate Marie's student ID, you bluffed your way past the exhausted militia commander at the roadblock. You spent three months inside the Hôtel des Mille Collines, a Tutsi university student passing as a Hutu cousin among twelve hundred desperate refugees guarded by UN peacekeepers.

Years later, you accepted the invitation to speak at an international academic conference in Kigali. You reclaimed your real name—Immaculée—and told the world how a piece of Belgian colonial bureaucracy and a friend's ID card were the only difference between life and death. You turned your three months of terrified impersonation into a public testament to the sheer absurdity and horror of the genocide.`
  },

  {
    id: "rw-ts-outcome-hotel-private-survived",
    survived: true,
    conditions: {
      rw_reached_hotel: true,
      rw_used_false_id: true,
      rw_declined_conference: true,
      rw_chose_private_life: true
    },
    epilogue: `You survived. You stared down the Interahamwe commander at the roadblock and handed him Marie's Hutu ID. For three months, you lived crammed inside a conference room at the Hôtel des Mille Collines, protected by blue helmets and the fiction of a stolen identity card.

When the international conference called years later asking you to speak on your survival, you declined. You survived because your Hutu roommate handed you a card, because you could pass, because you were lucky. You support the documentation of the genocide, but you have no desire to turn your trauma into a panel discussion. You reclaimed your name, Immaculée, and you live your life quietly, privately honoring the friend who saved you.`
  },

  // DEATH OUTCOMES (Occurring BEFORE post-genocide events)
  {
    id: "rw-ts-outcome-church-escaped-killed",
    survived: false,
    conditions: {
      rw_trusted_church: true
    },
    deathContext: {
      cause: "Killed during the genocide after escaping the church",
      historicalRate: "Most Tutsi who escaped church massacres were caught at subsequent roadblocks",
      yourChoices: "You escaped the church. You saw what happened. You tried to reach safety."
    },
    deathEpilogueEarly: `You didn't survive. You managed to escape Father Michel's church through the side door while the militia was distracted by the slaughter inside. You carried the memory of the grenades and the children out into the street. 

But the Interahamwe were methodical. They swept the perimeters of their massacres to catch anyone who had run. You were found hiding in a drainage ditch before the RPF could reach Kigali. You died during the 100 days of the genocide, clutching the memory of what happened in that church—a witness who never got the chance to testify at the ICTR.`
  },

  {
    id: "rw-ts-outcome-ceiling-killed",
    survived: false,
    conditions: {
      rw_survived_church_hiding: true,
      rw_hid_in_church: true
    },
    deathContext: {
      cause: "Discovered during the genocide while hiding in the church",
      historicalRate: "Militias routinely returned to massacre sites to hunt for survivors in ceilings and crypts",
      yourChoices: "You hid in the ceiling. You stayed silent. But they came back."
    },
    deathEpilogueEarly: `You didn't survive. You spent agonized hours in the cramped, three-foot crawlspace above the sacristy, holding your breath while the militia slaughtered the congregation below. 

But militias always returned to loot the bodies, and they eventually checked the ceiling. Whether the old man beside you coughed, or they simply followed protocol, you were discovered. You were pulled from the ceiling and killed during the height of the genocide, long before the memorial was built or the ceremonies began. Your name is now on the wall with the three hundred others who perished there.`
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
    deathEpilogueEarly: `You didn't survive. You trusted your friend Jeanne, climbing into her sweltering four-by-six-foot attic while her Interahamwe brother patrolled the streets outside. 

But silence in the attic wasn't enough. Jeanne's brother or his militia compatriots eventually searched the house. You were discovered during the 100 days of slaughter and killed alongside the Hutu family who tried to save you. You died knowing Jeanne risked everything for you, but you never lived to see the gacaca courts where you could have testified to her bravery.`
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
    deathEpilogueEarly: `You didn't survive. Armed with Marie's Hutu ID, you tried to bluff your way past the militia commander at the roadblock outside the Hôtel des Mille Collines. 

Whether the commander saw through the false ID, or you were caught in a subsequent assault on the perimeter, you were killed before reaching the safety of the UN blue helmets. You died during the genocide, before the RPF captured Kigali and the killing stopped. You never got to reclaim your real name, Immaculée.`
  }
];
// Export role data
export default {
  scenes: tutsiSurvivorScenes,
  outcomes: tutsiSurvivorOutcomes
};
