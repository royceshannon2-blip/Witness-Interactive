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
 * Scene 01 → three paths: Church (02a), Jeanne's house (02b), Hotel (02c)
 *
 * Church path (02a):
 *   → Run escape → 03a (witness/drainage ditch) → 04a (ICTR testimony)
 *   → Hide in ceiling → 03b (old man coughs) → 04b (Kwibuka memorial ceremony)
 *
 * Jeanne path (02b):
 *   → Stay in attic → 03c (child questioned) → 04c (reconciliation meeting)
 *   → Go with Paul to hotel → 03e (Paul stopped at roadblock) → 04d (hotel aftermath)
 *
 * Hotel path (02c):
 *   → Show Marie's card → 03d (inside the hotel) → 04d (hotel aftermath)
 *   → Turn back → 03f (stadium) → 04e (stadium aftermath)
 *
 * Requirements: US-2.1, US-2.2, US-2.3, TR-2.2
 */

const tutsiSurvivorScenes = [

  // ============================================================
  // SCENE 01 — Opening choice
  // ============================================================
  {
    id: "rw-ts-scene-01",
    narrative: `April 7, 1994. Morning. You're Immaculée, nineteen, university student. The radio woke you before dawn—President Habyarimana's plane shot down. Now RTLM broadcasts instructions. Roadblocks. Identity cards. The language they use for people like you.

Your roommate, Marie, is Hutu. She's packing. "My brother says get out of Kigali. Now." She looks at you. "You should... I don't know. The church? Father Michel always said it was sanctuary."

She presses her student ID card into your hand before she leaves. Her name. Her ethnicity. "Keep it. In case."

Your identity card is in your pocket. The one that says "Tutsi." The one that's a death sentence at every roadblock. Your parents are in Butare—you can't reach them. The phone lines are dead. Outside, you hear trucks. Shouting. The smell of smoke.

Three options. The church—Father Michel knows you. Your friend Jeanne's house—she's Hutu, married to a Tutsi, might hide you. Or the Hôtel des Mille Collines—rumors say UN peacekeepers are there, protecting people. All three mean crossing roadblocks.`,
    apThemes: ["causation", "perspective", "complexity"],
    atmosphericEffect: "dawn",
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
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
        text: "Try to reach the Hôtel des Mille Collines",
        consequences: { rw_attempted_hotel: true },
        nextScene: "rw-ts-scene-02c"
      }
    ]
  },

  // ============================================================
  // SCENE 02a — Church
  // ============================================================
  {
    id: "rw-ts-scene-02a",
    narrative: `April 7, mid-morning. You're at the church. Father Michel is here, but so are hundreds of others—Tutsi families, children crying, old people praying. The church smells like fear-sweat and incense. Everyone trusts this place. Churches are sanctuary. Always have been.

But you hear trucks outside. Militia voices. Interahamwe. They're surrounding the church. Father Michel is arguing with someone at the door. "This is God's house! You cannot—" A gunshot. Screaming.

The militia pours in. Machetes. Grenades. People running. The altar is no protection. The pews are no shield. You see what happens to those who stay in the main hall. You have seconds. The ceiling—there's a crawlspace above the sacristy. Or run. Try to escape in the chaos. Twelve seconds to choose.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: "shake",
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-02a.mp3",
    soundEffects: [
      { src: "audio/ambient/rw-sfx-gunshot-muffled.mp3", triggerAfterMs: 10000 },
      { src: "audio/ambient/rw-sfx-grenade-muffled.mp3", triggerAfterMs: 13000 }
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

  // ============================================================
  // SCENE 02b — Jeanne's house
  // ============================================================
  {
    id: "rw-ts-scene-02b",
    narrative: `April 7, afternoon. You made it to Jeanne's house. She opened the door, pulled you inside fast. "Immaculée. God. I heard the radio." Her husband, Paul, is Tutsi too. He's in the back room with their children. "We're all targets now."

Jeanne's hands shake as she makes tea. "My brother is Interahamwe. He came by this morning. Asked if I'd seen anyone. I said no. But he'll come back. They always come back."

Paul emerges from the back room. He's made a decision. "I'm not staying here. Théoneste knows this house—every room." He looks at you both. "There are UN peacekeepers at the Hôtel des Mille Collines. Twelve hundred people inside already. I'm going tonight. I know a route around the main roadblocks."

Jeanne grips your arm. "You could go with him. Or—" she looks at the ceiling panel above the kitchen "—the attic. Small. Hot. But my brother won't find you there. Not if I'm careful." Paul watches you. He's leaving either way.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-02b.mp3",
    choices: [
      {
        id: "rw-ts-choice-02b-a",
        text: "Stay—hide in the attic",
        consequences: { rw_hid_with_hutu: true },
        nextScene: "rw-ts-scene-03c"
      },
      {
        id: "rw-ts-choice-02b-b",
        text: "Go with Paul to the hotel",
        consequences: { rw_left_with_paul: true },
        nextScene: "rw-ts-scene-03e"
      }
    ]
  },

  // ============================================================
  // SCENE 02c — Roadblock before hotel
  // ============================================================
  {
    id: "rw-ts-scene-02c",
    narrative: `April 7, late afternoon. You're trying to reach the Hôtel des Mille Collines. In your pocket: your real card—Tutsi—and Marie's card with her Hutu name.

The streets are chaos. Bodies already. Roadblocks every few blocks. Militia checking cards, pulling people from cars. You keep walking. Head down. Don't run.

The hotel is three blocks away. You can see UN vehicles, blue helmets at the gate. But there's a roadblock between you and the entrance. Interahamwe, maybe ten men. The militia commander is young, maybe twenty. Methodical. You're next in line. He holds out his hand.

Behind you, a man in line whispers: "Turn back. They pulled three people out in the last hour. Someone is pointing out Tutsi faces. Someone who knows this neighborhood." The gate is right there. Safety is right there.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: "smoke",
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-02c.mp3",
    soundEffects: [
      { src: "audio/ambient/rw-sfx-boots-stone.mp3", triggerAfterMs: 8000 }
    ],
    choices: [
      {
        id: "rw-ts-choice-02c-a",
        text: "Show Marie's Hutu card—go through",
        consequences: { rw_used_false_id: true, rw_reached_hotel: true },
        nextScene: "rw-ts-scene-03d"
      },
      {
        id: "rw-ts-choice-02c-b",
        text: "Turn back—find another way",
        consequences: { rw_turned_back: true },
        nextScene: "rw-ts-scene-03f"
      }
    ]
  },

  // ============================================================
  // SCENE 03a — Drainage ditch (witness path)
  // ============================================================
  {
    id: "rw-ts-scene-03a",
    narrative: `April 7, evening. You ran. You escaped the church through the side door during the chaos. You saw what happened inside. Father Michel killed. Grenades. Machetes. Children. You can't unsee it.

Now you're hiding in a drainage ditch two blocks away. Your clothes torn. Hands shaking. The screams have stopped. Just RTLM radio music—cheerful announcers between instructions.

A UN convoy passes. White vehicles, blue helmets. You could flag them down—get to safety, but expose yourself in the open street. Or wait until dark and try to move on your own toward the RPF lines. Moving alone means no protection, but no one to make you relive what you just saw until you're ready.

The convoy is slowing at the next corner. This is your window.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-03a.mp3",
    soundEffects: [
      { src: "audio/ambient/rw-sfx-un-vehicle-pass.mp3", triggerAfterMs: 14000 }
    ],
    choices: [
      {
        id: "rw-ts-choice-03a-a",
        text: "Flag down the UN convoy",
        consequences: { rw_reached_un_protection: true },
        nextScene: "rw-ts-scene-04a"
      },
      {
        id: "rw-ts-choice-03a-b",
        text: "Stay hidden—wait for dark and move alone",
        consequences: { rw_moved_alone: true },
        nextScene: "rw-ts-scene-04a"
      }
    ]
  },

  // ============================================================
  // SCENE 03b — Church ceiling
  // ============================================================
  {
    id: "rw-ts-scene-03b",
    narrative: `April 8. You've been in the church ceiling for twenty-four hours. The crawlspace is barely three feet high. You can't stand. Can't move without noise. Below, the massacre continued for hours. Then silence. Then militia returned to loot. Then silence again.

Someone else is up here. An old man, maybe seventy. He doesn't speak. Just breathes. Shallow. Scared. Your water bottle is empty.

He coughs. Quiet, but not quiet enough. Below, footsteps stop. "You hear that?" A militia voice. "Check the ceiling."

Your heart stops. The old man looks at you. Terror. Apology. Below, someone drags a pew toward the wall to climb up. You have one choice: stay completely still and hope they look in the wrong corner—or shift position deliberately, make a sound in a different direction, draw them toward you and away from him.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-03b.mp3",
    soundEffects: [
      { src: "audio/ambient/rw-sfx-suppressed-cough.mp3", triggerAfterMs: 16000 },
      { src: "audio/ambient/rw-sfx-boots-stone.mp3", triggerAfterMs: 18000 }
    ],
    choices: [
      {
        id: "rw-ts-choice-03b-a",
        text: "Stay completely still—don't move",
        consequences: { rw_stayed_still: true, rw_survived_church_hiding: true },
        nextScene: "rw-ts-scene-04b"
      },
      {
        id: "rw-ts-choice-03b-b",
        text: "Shift—draw them toward you, away from him",
        consequences: { rw_protected_emmanuel: true, rw_survived_church_hiding: true },
        nextScene: "rw-ts-scene-04b"
      }
    ]
  },

  // ============================================================
  // SCENE 03c — Attic, child questioned
  // ============================================================
  {
    id: "rw-ts-scene-03c",
    narrative: `April 11. Four days in Jeanne's attic. The space is four feet by six feet. You haven't stood up since you climbed in. Below, Jeanne's children—six and eight—have been perfect. Quiet. They know you're up here.

Then you hear Théoneste's voice. But this time he's not talking to Jeanne. He's talking to Didier. The eight-year-old.

"Your mama says no one's here. But I want to hear it from you." A pause. "Didier. You'd tell your uncle if there was someone hiding, wouldn't you? Someone who shouldn't be here?"

You hear Didier breathing. You hear Théoneste crouch down—the creak of his knees. "It's not safe to lie. Even for children."

Jeanne is in the kitchen. She can't hear this. You could come down now—reveal yourself, take the risk away from Didier. Or stay hidden and trust that an eight-year-old has learned what silence costs, and has chosen it anyway.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-03c.mp3",
    soundEffects: [
      { src: "audio/ambient/rw-sfx-floorboard-creak.mp3", triggerAfterMs: 10000 }
    ],
    choices: [
      {
        id: "rw-ts-choice-03c-a",
        text: "Stay hidden—trust Didier",
        consequences: { rw_trusted_child: true },
        nextScene: "rw-ts-scene-04c"
      },
      {
        id: "rw-ts-choice-03c-b",
        text: "Come down—take the weight off him",
        consequences: { rw_revealed_self: true },
        nextScene: "rw-ts-scene-04c"
      }
    ]
  },

  // ============================================================
  // SCENE 03d — Inside the hotel (Marie's card worked)
  // ============================================================
  {
    id: "rw-ts-scene-03d",
    narrative: `April 7, evening. The militia commander looked at Marie's card. Looked at you. A long pause. "Go. Quickly."

Inside the Hôtel des Mille Collines: twelve hundred people in a building meant for two hundred. A Belgian peacekeeper registers you under Marie's name. You don't correct him.

Weeks pass. Food runs short. Water runs short. The militia threatens the gates daily.

In week three, a man approaches you quietly. "You're not Marie. I knew the Uwimana family from Nyamata. You're not from there." He doesn't say it as a threat. "I'm not going to say anything. But my daughter is sick. The UN medic won't see her—too many patients. You speak French. I've heard you. Could you ask for her?"

If you help him, you draw attention to the name you're carrying. If you don't, his daughter goes without care.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-03d.mp3",
    choices: [
      {
        id: "rw-ts-choice-03d-a",
        text: "Help him—speak to the UN medic",
        consequences: { rw_helped_stranger: true, rw_at_hotel: true },
        nextScene: "rw-ts-scene-04d"
      },
      {
        id: "rw-ts-choice-03d-b",
        text: "Refuse—you can't risk the false name being questioned",
        consequences: { rw_protected_identity: true, rw_at_hotel: true },
        nextScene: "rw-ts-scene-04d"
      }
    ]
  },

  // ============================================================
  // SCENE 03e — Paul stopped at roadblock
  // ============================================================
  {
    id: "rw-ts-scene-03e",
    narrative: `April 8, pre-dawn. You and Paul left Jeanne's house in darkness. His route works for two hours—side streets, silence, the city wrong at night. Then a roadblock you didn't know was there.

Paul has his real card. Tutsi. Without a word, he hands it to you and puts Marie's card—the one Jeanne gave him for this—in his own pocket. It's not his name. Not his face.

The militia commander looks at Paul's card, then at Paul. "Uwimana. Female name." He waves you through with Paul's card. Paul is pulled to the side.

You are ten meters past the checkpoint. The hotel gate is ahead. You look back. Paul's hands are raised slightly. The commander is asking him something. Paul sees you looking. He moves his eyes toward the gate. Go.

You could walk back toward him. Cause a scene. It might help or it might get you both killed. Or you walk through the gate. Paul knew the risks. He gave you the card.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: "smoke",
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-03e.mp3",
    soundEffects: [
      { src: "audio/ambient/rw-sfx-boots-stone.mp3", triggerAfterMs: 12000 }
    ],
    choices: [
      {
        id: "rw-ts-choice-03e-a",
        text: "Walk through the gate—Paul told you to go",
        consequences: { rw_reached_hotel: true, rw_left_paul: true, rw_at_hotel: true },
        nextScene: "rw-ts-scene-04d"
      },
      {
        id: "rw-ts-choice-03e-b",
        text: "Turn back toward Paul",
        consequences: { rw_stayed_with_paul: true, rw_reached_hotel: true, rw_at_hotel: true },
        nextScene: "rw-ts-scene-04d"
      }
    ]
  },

  // ============================================================
  // SCENE 03f — Turned back, heading to stadium
  // ============================================================
  {
    id: "rw-ts-scene-03f",
    narrative: `April 7, dusk. You turned back from the roadblock. Behind you, a shout—someone was pulled from the line just after you left. The man's warning was right.

You know the city. There's another option: Amahoro Stadium, northeast Kigali. UN peacekeepers there too. Fifteen thousand people eventually. Less watched by the militia than the hotel. A longer walk through streets that are not safe.

You move through back alleys. Twice you hear militia and press yourself into doorways. Once, a woman opens her door—Hutu, you think, from the absence of fear on her face—and waves you in. "Wait. Ten minutes. There's a patrol." She gives you water. Doesn't ask your name.

At the stadium perimeter, a UN peacekeeper stops you. "Papers." He's processing people fast. You have two cards. He's looking at your face.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-03f.mp3",
    soundEffects: [
      { src: "audio/ambient/rw-sfx-un-vehicle-pass.mp3", triggerAfterMs: 15000 }
    ],
    choices: [
      {
        id: "rw-ts-choice-03f-a",
        text: "Give Marie's name—register as Hutu",
        consequences: { rw_used_false_id: true, rw_reached_stadium: true },
        nextScene: "rw-ts-scene-04e"
      },
      {
        id: "rw-ts-choice-03f-b",
        text: "Give your real name—register as yourself",
        consequences: { rw_used_real_id: true, rw_reached_stadium: true },
        nextScene: "rw-ts-scene-04e"
      }
    ]
  },

  // ============================================================
  // AFTERMATH — SCENE 04a (testimony/ICTR)
  // ============================================================
  {
    id: "rw-ts-scene-04a",
    narrative: `2006. Arusha, Tanzania. The International Criminal Tribunal for Rwanda. You survived—by UN convoy or alone through Kigali's nights until the RPF arrived. Either way, you carried what you saw at the church. Father Michel killed at the door. Grenades. Machetes. Children. The faces.

Now the prosecutor has your name. The militia commander who organized the massacre is in a cell in Arusha. He is sixty-one. He looks tired. He doesn't look at you.

The courtroom is formal. Translators. Judges from three countries. The prosecutor asks you to describe what you saw. Every detail. Names. Times. Who gave orders. The defense attorney will cross-examine—your position, your sightlines, your memory over twelve years.

The prosecutor waits. The judges wait. The defendant stares at the table. You have the microphone. What you say becomes part of the permanent record.`,
    apThemes: ["continuity", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-04a.mp3",
    soundEffects: [
      { src: "audio/ambient/rw-sfx-camera-shutter.mp3", triggerAfterMs: 8000 }
    ],
    choices: [
      {
        id: "rw-ts-choice-04a-a",
        text: "Testify fully—every detail, every name",
        consequences: { rw_testified_fully: true },
        nextScene: "outcome"
      },
      {
        id: "rw-ts-choice-04a-b",
        text: "Testify partially—the facts, but protect some names",
        consequences: { rw_testified_partial: true },
        nextScene: "outcome"
      },
      {
        id: "rw-ts-choice-04a-c",
        text: "Decline—you gave your statement. You won't relive it in cross-examination.",
        consequences: { rw_declined_testimony: true },
        nextScene: "outcome"
      }
    ]
  },

  // ============================================================
  // AFTERMATH — SCENE 04b (Kwibuka ceremony)
  // ============================================================
  {
    id: "rw-ts-scene-04b",
    narrative: `2008. Kigali. You survived the ceiling. You stayed still—or you shifted to draw the militia toward yourself—while they searched below. The RPF arrived three days later. You climbed down. Seven survivors, from a church that held three hundred.

The old man's name was Emmanuel. You learned it afterward from a neighbor. He was a retired teacher. He gave you his last water on the third day. He died four days after liberation. You have thought about this every April since.

The church is a genocide memorial now. The guide has asked if you'll speak at tomorrow's Kwibuka ceremony. April 7th. Hundreds will attend. Students. Government officials. Cameras.

But Théoneste will be there—the man from this neighborhood who led the militia to the church door. He completed his community service in 2007. He attends every Kwibuka now. The government calls this reconciliation. You will be in the same room.`,
    apThemes: ["continuity", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-04b.mp3",
    choices: [
      {
        id: "rw-ts-choice-04b-a",
        text: "Speak—say Emmanuel's name publicly",
        consequences: { rw_spoke_at_kwibuka: true },
        nextScene: "outcome"
      },
      {
        id: "rw-ts-choice-04b-b",
        text: "Attend but stay silent—private mourning only",
        consequences: { rw_attended_silently: true },
        nextScene: "outcome"
      },
      {
        id: "rw-ts-choice-04b-c",
        text: "Stay home—you won't be in the same room as Théoneste",
        consequences: { rw_stayed_home: true },
        nextScene: "outcome"
      }
    ]
  },

  // ============================================================
  // AFTERMATH — SCENE 04c (reconciliation meeting)
  // ============================================================
  {
    id: "rw-ts-scene-04c",
    narrative: `2010. Your village outside Kigali. You survived the attic—hidden, or by coming down and facing Théoneste directly. Either way, Jeanne's family protected you. Paul was killed at a roadblock on April 12th. Five days after you hid. Jeanne told you months after liberation, quietly, without meeting your eyes. Her brother staffed that roadblock. She has never said this aloud. She doesn't need to.

The gacaca courts have concluded. Théoneste confessed. He served six years. He is back in the village, carrying bricks at the school where Paul once taught. The government has organized a reconciliation meeting tonight. Jeanne is asking you to attend.

You owe Jeanne everything. She lied to her brother every day for three weeks. She is asking for one evening in return.

But Théoneste will speak at this meeting. He will describe his crimes in the language of confession that earns reduced sentences. And you will be expected to sit across from him and call that reconciliation.`,
    apThemes: ["continuity", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-04c.mp3",
    choices: [
      {
        id: "rw-ts-choice-04c-a",
        text: "Attend and speak—say what is true, not what is expected",
        consequences: { rw_spoke_at_reconciliation: true },
        nextScene: "outcome"
      },
      {
        id: "rw-ts-choice-04c-b",
        text: "Attend for Jeanne—but stay silent about Théoneste",
        consequences: { rw_attended_for_jeanne: true },
        nextScene: "outcome"
      },
      {
        id: "rw-ts-choice-04c-c",
        text: "Don't go—you're not ready, and Jeanne will understand",
        consequences: { rw_declined_meeting: true },
        nextScene: "outcome"
      }
    ]
  },

  // ============================================================
  // AFTERMATH — SCENE 04d (hotel conference)
  // ============================================================
  {
    id: "rw-ts-scene-04d",
    narrative: `2007. Kigali. You survived the Hôtel des Mille Collines. You got through the roadblock—with Marie's card, or by turning back with Paul and arriving another way. Either way, you were inside that hotel for three months. Under a borrowed name, or your own. When the RPF arrived in July you reclaimed yourself: Immaculée. Tutsi. Survivor.

The hotel still operates. The manager became famous. Then, in 2021, he was convicted of terrorism and extradited to Rwanda. The story of what happened here got complicated in ways that are hard to explain to people who weren't inside.

A survivor's organization has asked you to speak at a conference. Journalists. Students. Researchers. They want the hotel story from someone who was there—not the manager's version. The survivor's version.

Marie's family will be in the audience. Her parents. They know their daughter's card was used. They have never asked you directly.`,
    apThemes: ["continuity", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-04d.mp3",
    choices: [
      {
        id: "rw-ts-choice-04d-a",
        text: "Speak—tell the full story, including Marie's card",
        consequences: { rw_told_full_story: true },
        nextScene: "outcome"
      },
      {
        id: "rw-ts-choice-04d-b",
        text: "Speak—but leave Marie out of it",
        consequences: { rw_told_partial_story: true },
        nextScene: "outcome"
      },
      {
        id: "rw-ts-choice-04d-c",
        text: "Decline—your survival isn't a lesson for researchers",
        consequences: { rw_declined_conference: true },
        nextScene: "outcome"
      }
    ]
  },

  // ============================================================
  // AFTERMATH — SCENE 04e (stadium / curriculum)
  // ============================================================
  {
    id: "rw-ts-scene-04e",
    narrative: `2009. Kigali. You survived Amahoro Stadium. Eighty-eight days. Fifteen thousand people in a sports complex. Less famous than the hotel. More hunger. More disease. The UN held the perimeter. When the RPF captured Kigali on July 4th, you walked out and rebuilt from what remained.

A researcher is now documenting survivor testimonies for a new government curriculum—the first generation of Rwandan students who were too young to remember 1994 is in secondary school. They will learn about the genocide from textbooks, films, and people like you.

The researcher asks you to record your story. It will be edited, fact-checked, used in classrooms for decades. Your words will outlast you.

But the curriculum is framed around unity and reconciliation. Rwanda rising. Your story—the woman at the door who gave you water and didn't ask your name, the choice you made at the stadium gate about which name to carry inside—doesn't fit that frame cleanly.`,
    apThemes: ["continuity", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-04e.mp3",
    choices: [
      {
        id: "rw-ts-choice-04e-a",
        text: "Record your testimony—even if the framing isn't yours",
        consequences: { rw_recorded_testimony: true },
        nextScene: "outcome"
      },
      {
        id: "rw-ts-choice-04e-b",
        text: "Record it—but insist they include the parts that complicate the narrative",
        consequences: { rw_insisted_full_record: true },
        nextScene: "outcome"
      },
      {
        id: "rw-ts-choice-04e-c",
        text: "Decline—your story isn't theirs to frame",
        consequences: { rw_declined_curriculum: true },
        nextScene: "outcome"
      }
    ]
  }
];

// ============================================================
// OUTCOMES
// ============================================================

const tutsiSurvivorOutcomes = [

  {
    id: "rw-ts-outcome-testimony",
    survived: true,
    conditions: { rw_witnessed_massacre: true },
    epilogue: `You survived to testify. You saw what happened at the church—Father Michel killed at the door, grenades in the nave, machetes, children—and you carried it out through the side door and into twelve years of carrying it. You flagged down the UN convoy, or you moved alone through Kigali's nights until the RPF arrived. Either way, you were a witness before you were a survivor.

The ICTR called you to Arusha in 2006. The defendant sat behind glass and didn't look at you. The defense attorney cross-examined you for two hours—your position in the drainage ditch, your sightlines, whether you could have seen what you said you saw from that angle, in that light. Your field-of-vision account, drawn from memory nine months before the trial, matched the architectural survey of the church within two meters. You held.

The verdict came down in 2008. Guilty. Your testimony was cited fourteen times in the judgment.

Some survivors find that meaningful. You found it meaningful and exhausting in equal measure—a ratio you've made peace with. You testified because someone had to. Because Father Michel's name needed to be in an official record said by someone who saw him fall. That's what you gave. It cost something. Both things are true.

Every April 7th you go to the memorial. You stand near the back and read the wall of names, and you find the ones you recognize, and you stay until you've said each of them once. That takes about forty minutes. Then you go home.`
  },

  {
    id: "rw-ts-outcome-ceiling",
    survived: true,
    conditions: { rw_survived_church_hiding: true },
    epilogue: `You survived the ceiling. Three days. Seven people climbed down when the RPF arrived, from a church that held three hundred.

The old man's name was Emmanuel—you learned it afterward from a neighbor who identified him. He was a retired teacher from the primary school. He gave you his last water on the third day. He died four days after liberation. Dehydration and what the medical workers called exhaustion, which was a word for several things at once. You stayed still to survive, or you shifted to protect him. Either way, he didn't make it. You have held that since 1994.

You went back to the church once, in 2001. The memorial preserved it exactly as the RPF found it. You didn't go again until 2009, when a prosecutor asked you to confirm details for the RTLM Media Trial. Your account of what you heard from the ceiling—the voices, the orders, the sequence of commands—was entered into evidence. The verdict came down that year. You read it online in a café in Kigali and then went home and made dinner. Both things were true at the same time.

Théoneste—the man who led the militia to the church door—attended Kwibuka. You made your own decision about whether to be in that room. There was no right answer. There was only what you could carry and what you couldn't, and you learned the difference between those two things slowly, over years, and not all at once.`
  },

  {
    id: "rw-ts-outcome-attic",
    survived: true,
    conditions: { rw_hid_with_hutu: true },
    epilogue: `You survived the attic. Three weeks. Jeanne lied to her brother every day. When Théoneste questioned Didier in the kitchen, you trusted the eight-year-old to hold—or you came down and faced the moment yourself. Either way, you were alive when the RPF arrived in July.

Paul was killed at a roadblock on April 12th. Five days after you hid. Jeanne told you months after liberation, quietly, once, without looking at you. Her brother staffed that roadblock. You found out at the gacaca hearing in 2007 when a neighbor's testimony placed Théoneste at that checkpoint on that date. Jeanne sat four rows ahead of you in the hearing room. You didn't speak afterward.

Théoneste confessed in 2005. He named the roadblock, the dates, the commanders. He received eight hundred hours of community service—rebuilding the school where Paul had taught. You saw him there once, carrying bricks. He saw you. Neither of you stopped walking.

Didier is in his twenties now. You've never asked what he told his uncle that day, or what it cost a child to hold that silence, or what he understood about why. You don't think you ever will. Some things are held in silence because that's the only form that fits them.

You made your decision about the reconciliation meeting. What you gave Jeanne—your presence, your words, your silence, or your absence—was the only answer you had. You owe her everything. That debt doesn't expire. But it also doesn't mean the meeting was easy, or that easy was ever the point.`
  },

  {
    id: "rw-ts-outcome-hotel",
    survived: true,
    conditions: { rw_at_hotel: true },
    epilogue: `You survived the Hôtel des Mille Collines. You got there—through the roadblock with Marie's card, or through what happened at the gate with Paul. Either way, you were inside for three months. When the RPF arrived you went to the registration desk and said your real name. The peacekeeper crossed out one name and wrote another without a word. That was the whole ceremony of reclaiming yourself.

Paul was killed at a roadblock on April 12th. Jeanne's brother staffed that roadblock. Jeanne has never said this to you directly. You have known it since 2007 when a gacaca hearing placed Théoneste at that checkpoint. You were sitting five rows behind Jeanne in the room when the testimony was read. She didn't turn around.

The man in the hotel whose daughter was sick—you helped him, or you didn't. Either way he survived. His daughter's name was Clarisse. He sent a letter in 2002 to the address you'd registered under at liberation. He'd found it through the survivor network. He wrote that she was eleven now and healthy, and that he understood why you might not write back.

The manager of the hotel became famous. Then convicted of terrorism in 2021. The story of what happened there got complicated. You stopped explaining it to people who hadn't been inside around 2015.

Marie's parents have never asked about the card. Marie herself has never asked for it back. You see her at Kwibuka, in the rows marked for Hutu who helped survivors—a category the government created in 2004. You've talked around April 1994 for thirty years. That's its own kind of conversation. It's been enough.`
  },

  {
    id: "rw-ts-outcome-stadium",
    survived: true,
    conditions: { rw_reached_stadium: true },
    epilogue: `You survived Amahoro Stadium. Eighty-eight days. Fifteen thousand people in a sports complex built for forty thousand—there was room, but there was no food, no medicine, no certainty. The peacekeepers held the perimeter. The militia tested it twice and pulled back. You were there from April 7th to July 4th, the day the RPF captured Kigali.

You registered under Marie's name, or your own. Either way, when liberation came you walked out and rebuilt from what remained. Less famous than the hotel. That was its own kind of relief—to have survived somewhere people weren't already writing books about.

The woman who waved you into her doorway on the walk to the stadium—the Hutu woman who gave you water and said wait, ten minutes—you went back to find her in 1998. Her name was Claudette. She was still in the same house. She remembered you. She didn't think what she'd done was significant. You disagreed, and you said so, and she made tea, and that was that. Some debts are owed to people who don't keep a ledger.

When the researcher came in 2009 asking for your testimony for the school curriculum, you made your decision. Whatever you chose—record it, demand the complicated parts be included, or keep your story your own—it was yours to make. The curriculum can have a version of you, or none of you, but the whole of it lives in you and has since 1994 and will until you decide otherwise. Nobody else gets to frame that.`
  },

  {
    id: "rw-ts-outcome-killed",
    survived: false,
    conditions: { rw_trusted_church: true, rw_hid_in_church: false },
    deathContext: {
      cause: "Killed during church massacre by Interahamwe militia",
      historicalRate: "Churches became massacre sites across Rwanda. An estimated 800,000 Tutsi died in 100 days—approximately 75% of the Tutsi population.",
      yourChoices: "You went to the church because it was supposed to be safe. Father Michel said so. It had always meant sanctuary."
    },
    epilogue: `You didn't survive. The church was supposed to be sanctuary. Father Michel said so. He was killed at the door. The militia poured in with machetes and grenades and you tried to run but there was nowhere to go.

Your name is on the wall. The church became a memorial after the RPF arrived—clothes preserved, skulls on shelves, three hundred names carved into stone. Students visit. They learn that across Rwanda, churches became massacre sites. That sanctuary was weaponized. That tens of thousands died in places of worship in a single week.

Marie survived. She testified at gacaca in 2006. She said you were her closest friend. She said you trusted people—really trusted them, not naively, but as a choice you made again and again because the alternative was to stop believing anything meant anything. She said she gave you her identity card before she left that morning. She thinks about it every April 7th.

Your story is in the memorial's educational materials. Not your name—there are too many names and the guide can only carry so many. But your path: the girl who went to the church because she believed it was safe, because that had always meant something. The guide tells visitors that trust was weaponized during the genocide. That the places people ran to became the places they were found. That understanding this is part of understanding what happened.`
  },

  {
    id: "rw-ts-outcome-fallback-survived",
    survived: true,
    conditions: {},
    epilogue: `You survived. The path you took—the choices you made in those hundred days and the years after—led you here. Alive. Carrying what you saw and what you did and who you lost.

Reconciliation was policy before it was feeling. The gacaca courts asked for testimony and got it, imperfectly, from people who were still inside what had happened. You gave what you could. You held back what you needed to hold back. Both were survival.

Rwanda rebuilt around you. New roads. New laws. A policy that said there was no Hutu, no Tutsi—only Rwandan. You understood why the policy existed. You also remembered 1994 every April 7th, every roadblock you passed, every identity card you saw. Memory doesn't follow policy.

You're here. That's not nothing. For most people who were in Kigali in April 1994, surviving was not the outcome. You carry their names with yours. You carry what happened forward. That's what survivors do—not because it's asked of them, but because it's what remains.`
  },

  {
    id: "rw-ts-outcome-fallback-killed",
    survived: false,
    conditions: {},
    deathContext: {
      cause: "Killed during the 1994 Rwandan Genocide",
      historicalRate: "Between 500,000 and 800,000 Tutsi were killed in 100 days—approximately 75% of the Tutsi population in Rwanda.",
      yourChoices: "The choices you made could not overcome the systematic violence surrounding you."
    },
    epilogue: `You didn't survive. In 1994, between 500,000 and 800,000 Tutsi were killed in one hundred days. Three quarters of the Tutsi population of Rwanda. The genocide was planned, organized, and executed with a speed and totality that the world watched and did not stop.

Your name—Immaculée, nineteen, university student—is one of hundreds of thousands. The memorial in Kigali holds the names of 250,000 identified victims. Many more were never identified. Mass graves are still found. The work of naming continues.

What happened to you happened to hundreds of thousands of people who made every choice correctly and were killed anyway. The genocide was not a series of individual failures. It was organized. It was systematic. It was known and not stopped. That is the lesson the memorial asks every visitor to carry: not just what happened, but who decided to let it happen.`
  }
];

// Export role data
export default {
  scenes: tutsiSurvivorScenes,
  outcomes: tutsiSurvivorOutcomes
};
