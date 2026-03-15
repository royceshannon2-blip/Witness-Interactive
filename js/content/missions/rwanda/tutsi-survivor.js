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

Your identity card is in your pocket. The one that says "Tutsi." The one that's a death sentence at every roadblock. Your parents are in Butare—you can't reach them. The phone lines are dead. Outside, you hear trucks. Shouting. The smell of smoke.

Three options. The church—Father Michel knows you. Your friend Jeanne's house—she's Hutu, married to a Tutsi, might hide you. Or the Hôtel des Mille Collines—rumors say UN peacekeepers are there, protecting people. All three mean crossing roadblocks.`,
    apThemes: ["causation", "perspective", "complexity"],
    atmosphericEffect: "dawn",
    ambientTrack: null,
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-01.mp3",
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
    timedChoice: { enabled: true, duration: 12000, defaultChoice: "rw-ts-choice-02a-b" },
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
    id: "rw-ts-scene-02c",
    narrative: `April 7, late afternoon. You're trying to reach the Hôtel des Mille Collines. Marie gave you her student ID—Hutu name, Hutu card. "If they ask, you're my cousin." It might work. It might not.

The streets are chaos. Bodies already. Roadblocks every few blocks. Militia checking cards, pulling people from cars. You see a woman dragged away. Her children screaming. You keep walking. Head down. Don't run. Running means guilt.

The hotel is three blocks away. You can see it. UN vehicles outside. Blue helmets. Safety. But there's a roadblock between you and the gate. Interahamwe, maybe ten men. They're checking everyone. Cards. Questions. Some people get through. Some don't.

You have two cards in your pocket. Your real one—Tutsi. Marie's—Hutu. The militia commander is young, maybe twenty. He looks tired. Bored. Methodical. You're next in line. He holds out his hand. "Identity card."`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: "smoke",
    ambientTrack: null,
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-02c.mp3",
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
      { file: 'rw-sfx-un-vehicle-pass.mp3', triggerAfterMs: 4500 }
    ],
    choices: [
      {
        id: "rw-ts-choice-03a-a",
        text: "Flag down the UN convoy",
        consequences: { rw_reached_un_protection: true },
        nextScene: "rw-ts-scene-04a"
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
      { file: 'rw-sfx-boots-stone.mp3', triggerAfterMs: 3200 },
      { file: 'rw-sfx-suppressed-cough.mp3', triggerAfterMs: 5800 }
    ],
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
    timedChoice: { enabled: true, duration: 10000, defaultChoice: "rw-ts-choice-03d-a" },
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
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-04d.mp3",
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
    id: "rw-ts-outcome-attic-survived",
    survived: true,
    conditions: {
      rw_trusted_protector: true
    },
    epilogue: `You survived. You hid in Jeanne's attic for three weeks, silent and terrified while her Interahamwe brother searched below. She risked everything to protect you—her family, her life, her children. She lied to her brother every day. When the RPF captured Kigali in July, you emerged. Thin. Traumatized. Alive. Most people who hid didn't survive. You did because someone chose to help you.

The years after were complicated. Jeanne's brother served six years for roadblock killings. He came back to the village. The government's reconciliation policy asked you to live next to him. To attend meetings. To speak about coexistence. You did, sometimes. Other times you couldn't. Survivor guilt is a weight that doesn't lift—you lived because Jeanne helped you, because you were lucky, because her brother never looked up.

The gacaca courts asked you to testify. You told what you knew—who helped, who hunted, who looked away. You spoke about Jeanne's courage. Some survivors found power in testimony. You found exhaustion. The memorial lists the names of those who didn't survive. Your family. Your neighbors. Your friends. You visit once a year. April 7th. Kwibuka. You remember. You carry their names forward. You survived, and that's both gift and burden.`
  },

  {
    id: "rw-ts-outcome-ceiling-survived",
    survived: true,
    conditions: {
      rw_survived_church_hiding: true
    },
    epilogue: `You survived. You hid in the church ceiling for three days, silent and terrified while militia searched below. The crawlspace was barely three feet high. You couldn't stand. Couldn't move. An old man hid with you—he coughed, but they didn't hear. Or they didn't care. When the RPF arrived, you climbed down. Bodies everywhere. You were one of seven survivors from a church that held three hundred. Most people who hid didn't survive. You did because you stayed silent.

The years after were complicated. The church became a genocide memorial. Skulls on shelves. Clothes preserved. Names on walls. You visit once a year. April 7th. Kwibuka—remembrance. The government organizes ceremonies about unity and reconciliation. But you remember who hid you and who hunted you. You remember the old man who coughed. He died two days after liberation—starvation, dehydration. You lived. He didn't.

Survivor guilt is a weight that doesn't lift. The memorial guide asks if you want to speak at ceremonies. Share your story. Help the next generation understand. Sometimes you do. Sometimes you can't. The memorial lists the names of those who didn't survive. Your family. Your neighbors. Your friends. You remember. You carry their names forward. You survived, and that's both gift and burden.`
  },

  {
    id: "rw-ts-outcome-hidden-killed",
    survived: false,
    conditions: {
      rw_trusted_church: true,
      rw_hid_in_church: false
    },
    deathContext: {
      cause: "Killed during church massacre by Interahamwe militia",
      historicalRate: "Churches became massacre sites across Rwanda. Thousands of Tutsi who sought sanctuary in churches were killed there.",
      yourChoices: "You trusted the church as sanctuary. You stayed in the main hall when the militia attacked. You didn't escape."
    },
    epilogue: `You didn't survive. You went to the church—Father Michel, sanctuary, safety. Churches had always been safe. But not this time. The Interahamwe surrounded the building. They killed Father Michel at the door. They poured in with machetes and grenades. You tried to run but there was nowhere to go. The pews offered no protection. The altar was no shield. You died with hundreds of others in a place that was supposed to be sacred.

Your body was found weeks later when the RPF arrived. Your family identified you by your clothes. The church became a genocide memorial. Your name is on the wall with three hundred others who died there that day. Students visit now. They see the skulls on shelves, the clothes preserved, the names. They learn that churches became massacre sites, that sanctuary was a lie, that trust was weaponized.

Your friend Marie survived. She testified at the gacaca courts about what happened. She said you were kind, that you trusted people, that you believed in safety. The memorial guide tells your story to visitors—how you went to the church, how you died there, how trust became a trap. You're remembered. You're a name on a wall. You carried that trust to the end.`
  },

  {
    id: "rw-ts-outcome-enclave-survived",
    survived: true,
    conditions: {
      rw_reached_hotel: true,
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

  // FALLBACK OUTCOMES - catch-all for paths not covered by specific outcomes
  {
    id: "rw-ts-fallback-survived",
    survived: true,
    conditions: {},
    epilogue: `You survived. The RPF captured Kigali on July 4th, 1994. The genocide ended. Of Rwanda's Tutsi population — roughly 930,000 people — approximately 75% were killed in 100 days. You were among those who lived.

How you survived involved a series of choices that this system couldn't reduce to a single clear path. Most survivors' stories are like that — not one decision but dozens, not one person who helped but several, not one close call but a sequence of them that could have broken anywhere and didn't.

The years after survival have their own weight. Kwibuka — Rwanda's national remembrance, held each April 7th — asks survivors to remember publicly and together. Some find that necessary. Some find it impossible. Some find it both at once. You carry what happened. Rwanda is being rebuilt by people who mostly weren't alive in 1994. That future is partly yours and partly something you'll watch from the edges. You're alive. That is the beginning of whatever comes next.`
  },
  {
    id: "rw-ts-fallback-killed",
    survived: false,
    conditions: {},
    epilogue: `You didn't survive. The genocide killed approximately 800,000 people in 100 days — an average of 8,000 per day, the fastest mass killing in recorded history. You were one of them.

The specific circumstances — which church, which roadblock, which choice that ended in the wrong place at the wrong moment — aren't fully captured in the path this story traced. The genocide was methodical but not perfectly predictable. Survival often came down to location, to who happened to be at a particular checkpoint, to whether a neighbor spoke or stayed silent. You encountered the wrong version of those variables.

Your name belongs in the memorial. Rwanda has the Kigali Genocide Memorial, which holds the remains of over 250,000 victims and lists names on its walls. April 7th — Kwibuka — is the day Rwanda remembers. Your story is part of what that day is for. You were 19 years old, a student, a person who had plans. 1994 ended them. That is what the genocide did, one person at a time, 800,000 times.`
  }
];

// Export role data
export default {
  scenes: tutsiSurvivorScenes,
  outcomes: tutsiSurvivorOutcomes
};
