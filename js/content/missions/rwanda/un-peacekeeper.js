/**
 * Rwanda Genocide Mission - UN Peacekeeper (Captain Marcus Webb) Role
 *
 * Historical Context:
 * - Captain Marcus Webb, Canadian UNAMIR officer, April 1994
 * - UNAMIR mandate: monitor ceasefire, not intervene in internal conflicts
 * - After 10 Belgian peacekeepers killed, UN reduced force from 2,500 to 270
 * - General Dallaire's "genocide fax" warned of planned massacres — ignored
 * - Peacekeepers protected enclaves (hotel, stadium) but couldn't stop massacres
 * - Moral dilemma: follow orders to withdraw vs. stay and protect civilians
 * - Post-genocide: PTSD, guilt, advocacy, testimony at inquiries
 *
 * BRANCHING STRUCTURE:
 * Scene 01 → three paths: Hotel/protect (02a), Evacuate (02b), Document (02c)
 *
 * Hotel path (02a):
 *   → Defy orders, stay → 03a (300 more refugees at gate) → 04a (Canadian inquiry)
 *   → Follow mandate, hold → 03b (militia attacks, casualties) → 04b (return to Kigali)
 *
 * Evacuation path (02b):
 *   → Follow orders, leave Rwandans → 03c (airport: go home or return) → 04c (documentary)
 *   → Take Rwandans, risk convoy → 03c (airport: go home or return) → 04c (documentary)
 *
 * Documentation path (02c):
 *   → Stay and document → 03d (survivor asks for extraction) → 04d (Hague testimony)
 *   → Intervene physically → 03d (survivor asks for extraction) → 04d (Hague testimony)
 *
 * Requirements: US-2.1, US-2.2, US-2.3, TR-2.2
 */

const unPeacekeeperScenes = [

  // ============================================================
  // SCENE 01 — Opening choice
  // ============================================================
  {
    id: "rw-un-scene-01",
    narrative: `April 7, 1994. 5:47 AM. You are Captain Marcus Webb, Canadian Forces, UNAMIR.

You woke to gunfire at 4 AM. By 5 AM you knew the Prime Minister was dead. Ten Belgian peacekeepers—men you knew, men you'd eaten with—were killed protecting her. Their bodies are at a roadblock on Boulevard de la Révolution.

One of them was Lieutenant Pieter Claes. Twenty-six years old. He showed you photographs of his daughter three weeks ago. She was learning to walk. He was going home in six weeks.

Now you're at UNAMIR headquarters with the radio on. Dallaire has been on the line with New York since midnight. The mandate is explicit: monitor and report. Do not intervene in internal conflicts. New York is not changing that mandate.

Through the window, three blocks away, you can see a roadblock. Interahamwe — the Hutu militia — are pulling people from cars. Checking identity cards. You've watched for eleven minutes. Four people have been pulled aside. You haven't seen them again.

The Hôtel des Mille Collines has radioed requesting protection. Twelve hundred Tutsi are sheltering there. The militia is surrounding the building. Expatriate evacuation orders have just come through. And you have a vehicle, a radio, and a camera.

Pieter's photograph of his daughter is still on the break room table.`,
    apThemes: ["causation", "perspective", "complexity"],
    atmosphericEffect: "smoke",
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    soundEffects: [
      { src: "audio/ambient/rw-sfx-gunshot-muffled.mp3", triggerAfterMs: 10000 }
    ],
    timedChoice: { enabled: true, duration: 15000, defaultChoice: "rw-un-choice-01-b" },
    choices: [
      {
        id: "rw-un-choice-01-a",
        text: "Deploy to hotel—protect civilians",
        consequences: { rw_chose_protection: true },
        nextScene: "rw-un-scene-02a"
      },
      {
        id: "rw-un-choice-01-b",
        text: "Evacuate expatriates as ordered",
        consequences: { rw_followed_evacuation_orders: true },
        nextScene: "rw-un-scene-02b"
      },
      {
        id: "rw-un-choice-01-c",
        text: "Document atrocities—gather evidence",
        consequences: { rw_chose_documentation: true },
        nextScene: "rw-un-scene-02c"
      }
    ]
  },

  // ============================================================
  // SCENE 02a — Hotel, militia outside
  // ============================================================
  {
    id: "rw-un-scene-02a",
    narrative: `April 8. Hôtel des Mille Collines. You deployed here with eight peacekeepers. Twelve hundred Tutsi refugees inside. Interahamwe militia surrounding the building—chanting, threatening, testing the perimeter. Your orders are to hold the position but not engage unless fired upon. The hotel manager, Rusesabagina, is negotiating. Bribing. Calling in favors. It's working. Barely.

A militia commander approaches your checkpoint. "UN. You're leaving soon, yes? Like the Belgians?" He's right to ask. New York is moving toward full withdrawal. The Security Council voted to cut UNAMIR from 2,500 to 270 troops. The militia knows this. "When you leave, we come in."

Your radio crackles. Dallaire: "All units. Prepare for possible evacuation order. Stand by." The militia commander smiles. The refugees inside can hear the radio. They're terrified. You have a choice: defy the coming order, commit to staying no matter what—or follow the mandate, hold position for now, and see what happens when the order arrives.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    timedChoice: { enabled: true, duration: 15000, defaultChoice: "rw-un-choice-02a-b" },
    choices: [
      {
        id: "rw-un-choice-02a-a",
        text: "Defy orders now—commit to staying no matter what",
        consequences: { rw_defied_orders: true },
        nextScene: "rw-un-scene-03a"
      },
      {
        id: "rw-un-choice-02a-b",
        text: "Follow the mandate—hold position for now",
        consequences: { rw_followed_mandate: true },
        nextScene: "rw-un-scene-03b"
      }
    ]
  },

  // ============================================================
  // SCENE 02b — Evacuation convoy
  // ============================================================
  {
    id: "rw-un-scene-02b",
    narrative: `April 9. Evacuation convoy. You're escorting foreign nationals to Kigali airport. Americans. Europeans. Canadians. Terrified but alive. They have passports. They have governments that care. The convoy passes roadblocks. Militia waves you through every time—blue helmets, UN vehicles, diplomatic immunity.

At one checkpoint, Rwandans are begging to board. "Please. We worked for the embassy. We have families." Your orders are explicit: foreign nationals only. No Rwandans. The militia is watching. If you take Rwandans, the convoy may be stopped. Everyone may die. If you don't, these people will be killed at this roadblock. You can see it already in the militia commander's face.

A woman holds up a child toward your window. Your sergeant looks at you. The convoy is idling. The airport is twenty minutes away. The militia commander is walking over. You have seconds.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: "smoke",
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    soundEffects: [
      { src: "audio/ambient/rw-sfx-un-vehicle-pass.mp3", triggerAfterMs: 3000 },
      { src: "audio/ambient/rw-sfx-boots-stone.mp3", triggerAfterMs: 15000 }
    ],
    timedChoice: { enabled: true, duration: 12000, defaultChoice: "rw-un-choice-02b-a" },
    choices: [
      {
        id: "rw-un-choice-02b-a",
        text: "Follow orders—expatriates only",
        consequences: { rw_evacuated_expatriates: true, rw_left_rwandans: true },
        nextScene: "rw-un-scene-03c"
      },
      {
        id: "rw-un-choice-02b-b",
        text: "Take Rwandans—risk the convoy",
        consequences: { rw_saved_rwandans: true, rw_defied_orders: true },
        nextScene: "rw-un-scene-03c"
      }
    ]
  },

  // ============================================================
  // SCENE 02c — At the church, documenting
  // ============================================================
  {
    id: "rw-un-scene-02c",
    narrative: `April 10. You're documenting. Camera. Notebook. Radio reports to HQ. You've seen roadblocks. Identity card checks. Bodies in streets. Now you've reached a church. Screaming inside. Grenades. Machetes. Hundreds of people.

The militia sees your UN vehicle and stops. They're not sure what to do—you're a witness, and witnesses make them nervous, or make them bold. The militia commander comes to your window. "UN. You have no mandate here. Leave." The screaming inside the church is getting quieter.

Your radio crackles. Dallaire: "All units. Document and report only. Avoid direct confrontation." The order is clear. But you have a vehicle. You have a uniform. You have the weight of the UN flag on your door. You could stay in the vehicle and document—make them feel watched, get everything on camera. Or you could get out. Step between the militia and the church door. Your physical presence might stop them. Or it might get you killed like the ten Belgians.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: "smoke",
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    soundEffects: [
      { src: "audio/ambient/rw-sfx-grenade-muffled.mp3", triggerAfterMs: 8000 },
      { src: "audio/ambient/rw-sfx-camera-shutter.mp3", triggerAfterMs: 16000 }
    ],
    choices: [
      {
        id: "rw-un-choice-02c-a",
        text: "Stay in vehicle—document everything on camera",
        consequences: { rw_documented_massacre: true, rw_witnessed_massacre: true },
        nextScene: "rw-un-scene-03d"
      },
      {
        id: "rw-un-choice-02c-b",
        text: "Get out—step between the militia and the door",
        consequences: { rw_intervened_physically: true, rw_witnessed_massacre: true },
        nextScene: "rw-un-scene-03d"
      }
    ]
  },

  // ============================================================
  // SCENE 03a — Defied orders, 300 more refugees at gate
  // ============================================================
  {
    id: "rw-un-scene-03a",
    narrative: `April 15. You defied the withdrawal order. When the UN pulled back, you stayed. Eight peacekeepers. Twelve hundred refugees. The hotel is an island—militia surrounding it, water cut, power cut, daily threats. But no attack. Your blue helmets hold them back. Barely.

Then: a crowd arrives at the hotel gate. Three hundred more people, mostly women and children, who fled here on foot from a church massacre two kilometers away. They're wounded. Terrified. They're begging to be let in.

Your sergeant speaks quietly: "Sir. We're already stretched. Twelve hundred people, eight of us, limited ammunition. If we open the gate, we're at fifteen hundred. The militia sees us taking in survivors from the church—they'll know we're not neutral anymore. They may attack tonight." He's right. But three hundred people are standing at the gate. The militia is watching from across the street, waiting to see what you do.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    soundEffects: [
      { src: "audio/ambient/rw-sfx-door-knock.mp3", triggerAfterMs: 8000 }
    ],
    choices: [
      {
        id: "rw-un-choice-03a-a",
        text: "Open the gate—take them all in",
        consequences: { rw_opened_gate: true, rw_took_more_refugees: true },
        nextScene: "rw-un-scene-04a"
      },
      {
        id: "rw-un-choice-03a-b",
        text: "Hold what you have—you can't protect more",
        consequences: { rw_held_perimeter: true, rw_turned_away_refugees: true },
        nextScene: "rw-un-scene-04a"
      }
    ]
  },

  // ============================================================
  // SCENE 03b — Followed mandate, militia attacks
  // ============================================================
  {
    id: "rw-un-scene-03b",
    narrative: `April 20. You held the mandate as long as it held you. When the withdrawal order came you prepared to comply—but Rusesabagina's negotiations bought time, and a skeleton crew of four peacekeepers was authorized to remain. You're one of them. Four men. Twelve hundred refugees. Not enough. But something.

Then the militia attacks. Not a probe this time—real force. Automatic weapons. They breach the outer perimeter. One of your peacekeepers takes a round in the shoulder. Not fatal, but he's down. You've held them back for forty minutes. The refugees are moving toward the rear of the building. You don't know if there's an exit back there that works.

You can keep holding the front—your position is defensible, the RPF is reportedly days away, and leaving the front means the militia walks through the door. Or you abandon the front and lead an evacuation through the back—get the refugees out, disperse them into the city, and hope enough of them reach the stadium or RPF lines alive. Both options cost people. The question is which cost you can accept.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    soundEffects: [
      { src: "audio/ambient/rw-sfx-gunshot-muffled.mp3", triggerAfterMs: 6000 },
      { src: "audio/ambient/rw-sfx-boots-stone.mp3", triggerAfterMs: 14000 }
    ],
    choices: [
      {
        id: "rw-un-choice-03b-a",
        text: "Keep holding the front—the RPF is days away",
        consequences: { rw_held_position: true },
        nextScene: "rw-un-scene-04b"
      },
      {
        id: "rw-un-choice-03b-b",
        text: "Fall back—lead evacuation through the rear",
        consequences: { rw_evacuated_rear: true },
        nextScene: "rw-un-scene-04b"
      }
    ]
  },

  // ============================================================
  // SCENE 03c — Airport (evacuation aftermath)
  // ============================================================
  {
    id: "rw-un-scene-03c",
    narrative: `April 12. Kigali airport. The expatriates are boarding. You followed orders, or you risked the convoy taking Rwandans—either way you're here now, watching planes leave. Your tour of duty is technically complete. You did what you were assigned to do. The machine worked, or it didn't, but it processed you through and deposited you here.

You have a seat on the next flight to Nairobi. Then home. Canada. Your family. A debrief. A report. The normal machinery of military life resuming around something that was not normal.

But Dallaire's 270 peacekeepers are still in the city. The genocide continues. You have training, a uniform, and a vehicle. You could go back—rejoin the skeleton crew, document what's happening, be another body in the force holding the last enclaves. Or you get on the plane. You filed your report. You did your assignment. The faces at the checkpoint—the woman with the child, the embassy workers—you carry those either way.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    choices: [
      {
        id: "rw-un-choice-03c-a",
        text: "Board the plane—go home",
        consequences: { rw_went_home: true, rw_left_rwanda: true },
        nextScene: "rw-un-scene-04c"
      },
      {
        id: "rw-un-choice-03c-b",
        text: "Return to Kigali—rejoin Dallaire's force",
        consequences: { rw_returned_to_duty: true },
        nextScene: "rw-un-scene-04c"
      }
    ]
  },

  // ============================================================
  // SCENE 03d — Documenting, survivor asks for extraction
  // ============================================================
  {
    id: "rw-un-scene-03d",
    narrative: `April 11. You documented the church—from your vehicle, or by stepping out and planting yourself between the militia and the door. Either way, you were there. Either way, you have what happened on camera and in your notebook. You sent reports to Dallaire. To New York. To anyone who would receive them.

Now you're at a roadblock checkpoint you've been monitoring. A woman approaches your vehicle from the side street, moving low. She has two children with her. She's seen your vehicle here three times in two days. She speaks English, educated. "You have a car. You know where the stadium is. My children—" she stops. "I'm not asking for myself."

Your vehicle can carry four people. You know the route to Amahoro Stadium. The UN peacekeepers there are holding fifteen thousand refugees. It would take forty minutes. You would be gone from your documentation post for forty minutes, and these four people would be alive.

Or you stay. You have a systematic record of this checkpoint—the commanders, the process, the timing. Leaving breaks that record. The evidence you're building will matter at tribunals. But it will matter later. These children are here now.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: "smoke",
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    soundEffects: [
      { src: "audio/ambient/rw-sfx-camera-shutter.mp3", triggerAfterMs: 10000 }
    ],
    choices: [
      {
        id: "rw-un-choice-03d-a",
        text: "Take them—drive to the stadium",
        consequences: { rw_extracted_survivors: true },
        nextScene: "rw-un-scene-04d"
      },
      {
        id: "rw-un-choice-03d-b",
        text: "Stay—the documentation record can't have a gap",
        consequences: { rw_continued_documentation: true },
        nextScene: "rw-un-scene-04d"
      }
    ]
  },

  // ============================================================
  // AFTERMATH — SCENE 04a (Canadian inquiry)
  // ============================================================
  {
    id: "rw-un-scene-04a",
    narrative: `2004. Ottawa. The Canadian Senate Special Committee on Rwanda. You defied withdrawal orders in April 1994. You stayed at the hotel—and you opened the gate to three hundred more, or you held what you had. Either way, the RPF arrived in July. Most of the refugees survived.

Canada did not court-martial you. Dallaire's book came out in 2003—Shake Hands with the Devil. You're in it. The inquiry is partly because of that book. Senators want to understand what happened. Why the UN failed. Why Canadian soldiers were put in an impossible position. Why the genocide fax was ignored.

Your testimony could do several things: put on record what orders actually were, what you actually did, and what the difference cost. The committee chair has told you privately that your account may influence Canada's position on the Responsibility to Protect doctrine currently being drafted at the UN. This is not just about Rwanda. It's about what comes after Rwanda.

But you also have PTSD. Nightmares. The faces of the people outside the gate you turned away—or the faces of the fifteen hundred inside when the perimeter nearly broke. Testifying means saying all of it in a room with cameras.`,
    apThemes: ["continuity", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    choices: [
      {
        id: "rw-un-choice-04a-a",
        text: "Testify fully—the orders, the decisions, all of it",
        consequences: { rw_testified_fully: true },
        nextScene: "outcome"
      },
      {
        id: "rw-un-choice-04a-b",
        text: "Testify on policy—not on the personal decisions",
        consequences: { rw_testified_policy: true },
        nextScene: "outcome"
      },
      {
        id: "rw-un-choice-04a-c",
        text: "Decline—you've given your written report. That's enough.",
        consequences: { rw_declined_inquiry: true },
        nextScene: "outcome"
      }
    ]
  },

  // ============================================================
  // AFTERMATH — SCENE 04b (return to Kigali ceremony)
  // ============================================================
  {
    id: "rw-un-scene-04b",
    narrative: `2010. Kigali. You're back for the first time since 1994. The hotel still operates. Tourists visit. They ask questions. The manager who negotiated with the militia became famous—then, in 2021, was convicted of terrorism. The narrative is complicated in ways that are hard to explain to people who weren't inside.

You held the front until the RPF arrived, or you led an evacuation through the rear when the front broke. Either way, there were survivors. There were also people who didn't make it during the evacuation or who died in the rooms above while you held the gate. You carry both.

A survivor has organized a gathering for the peacekeepers who stayed. She's tracked down four of you. She wants the children who were inside the hotel in 1994—now teenagers—to meet the people who chose to stay. "They need to know that individuals make choices," she says. "That it wasn't just systems."

She's asking you to speak tomorrow. Not to the cameras. To the children.`,
    apThemes: ["continuity", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    choices: [
      {
        id: "rw-un-choice-04b-a",
        text: "Speak to the children—tell them what you decided and why",
        consequences: { rw_spoke_to_survivors: true },
        nextScene: "outcome"
      },
      {
        id: "rw-un-choice-04b-b",
        text: "Attend but let the other peacekeepers speak",
        consequences: { rw_attended_silently: true },
        nextScene: "outcome"
      },
      {
        id: "rw-un-choice-04b-c",
        text: "Meet the survivor privately—not in a group setting",
        consequences: { rw_met_privately: true },
        nextScene: "outcome"
      }
    ]
  },

  // ============================================================
  // AFTERMATH — SCENE 04c (documentary)
  // ============================================================
  {
    id: "rw-un-scene-04c",
    narrative: `2006. Toronto. You evacuated the expatriates and came home—or you went back to Dallaire's force after the airport and returned to Canada in August. Either way, you're here now. Twelve years out.

You have PTSD. Nightmares. The faces at the checkpoint—the woman with the child, the embassy workers you left, or the Rwandans you risked the convoy for. You've been doing advocacy work: op-eds, university lectures, pushing for stronger peacekeeping mandates. Responsibility to Protect passed at the UN in 2005. Your name is in some of the documentation that helped push it through.

A documentary filmmaker has found you. She's spent three years interviewing UNAMIR veterans. She wants your account—specifically the checkpoint decision. The moment. What you thought, what you chose, what it cost. The film will be shown in schools. In thirty years, students will watch your face when you describe what you did or didn't do at that roadblock.

That's a long time to be answerable to a decision you made in twelve seconds.`,
    apThemes: ["continuity", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    choices: [
      {
        id: "rw-un-choice-04c-a",
        text: "Participate—tell the full truth, including the checkpoint",
        consequences: { rw_told_full_truth: true },
        nextScene: "outcome"
      },
      {
        id: "rw-un-choice-04c-b",
        text: "Participate—but focus on policy failures, not personal decisions",
        consequences: { rw_focused_on_policy: true },
        nextScene: "outcome"
      },
      {
        id: "rw-un-choice-04c-c",
        text: "Decline—you're not ready to have that decision preserved on film",
        consequences: { rw_declined_documentary: true },
        nextScene: "outcome"
      }
    ]
  },

  // ============================================================
  // AFTERMATH — SCENE 04d (Hague testimony)
  // ============================================================
  {
    id: "rw-un-scene-04d",
    narrative: `2003. The Hague. The International Criminal Tribunal for Rwanda — the RTLM Media Trial. The defendants are radio broadcasters who used RTLM to name names, direct militia to locations, call for killing. Your documentation is central to the prosecution's case. Your photographs of roadblocks, your recordings of broadcast instructions, your timestamped field reports showing the sequence between broadcast and massacre.

You took the children to the stadium, or you stayed and kept the record unbroken. Either way, your documentation is here, being entered into evidence by a prosecutor who has read every page.

The defense will argue that broadcast speech is not the same as action. That you cannot prove causation between a radio transmission and a death. Your field reports are the closest thing to proof that the prosecution has. The defense attorney will cross-examine your methods, your proximity, your chain of custody. Your photographs will be on a screen in front of the judges.

You have been waiting nine years to sit in this room.`,
    apThemes: ["continuity", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: "656124__itsthegoodstuff__nature-ambiance.wav",
    soundEffects: [
      { src: "audio/ambient/rw-sfx-camera-shutter.mp3", triggerAfterMs: 12000 }
    ],
    choices: [
      {
        id: "rw-un-choice-04d-a",
        text: "Testify fully—every photograph, every field report",
        consequences: { rw_testified_fully: true },
        nextScene: "outcome"
      },
      {
        id: "rw-un-choice-04d-b",
        text: "Testify carefully—submit evidence but protect field sources",
        consequences: { rw_protected_sources: true },
        nextScene: "outcome"
      },
      {
        id: "rw-un-choice-04d-c",
        text: "Submit the evidence in writing—you won't testify in person",
        consequences: { rw_submitted_written: true },
        nextScene: "outcome"
      }
    ]
  }
];

// ============================================================
// OUTCOMES
// ============================================================

const unPeacekeeperOutcomes = [

  {
    id: "rw-un-outcome-defied-stayed",
    survived: true,
    conditions: { rw_defied_orders: true, rw_chose_protection: true },
    epilogue: `You survived. You defied the withdrawal order and stayed at the hotel with eight peacekeepers, twelve hundred refugees, and a mandate that no longer covered what you were doing. The militia surrounded the building for weeks. They cut water. They cut power. They did not attack—your blue helmets held the line that UN policy had abandoned.

When the RPF captured Kigali in July, the refugees walked out. You opened the gate to three hundred more when they came, or you held the perimeter and turned them away. Either decision cost something. You've turned both over since.

Canada didn't court-martial you. Dallaire's book named you. The Canadian Senate inquiry called you in 2004. You testified, or gave your written report, or declined. Whatever you gave them, your account is part of the record that shaped the Responsibility to Protect doctrine adopted at the UN in 2005. Whether that matters to you depends on the day.

You have PTSD. Nightmares about the sounds outside the gate. About the faces of people you could see from the roof who were not inside the perimeter. You saved twelve hundred—or fifteen hundred. Hundreds of thousands died. Your therapist has pointed out that arithmetic is not the right unit of measure for what you did. You're still not sure what the right unit is.

A woman whose daughter was born inside the hotel in May 1994 sent you a letter in 2002. She said the daughter was named for one of your peacekeepers—the one who took the shoulder wound. She said she wanted you to know that your names were still being said. That's what you carry forward.`
  },

  {
    id: "rw-un-outcome-followed-held",
    survived: true,
    conditions: { rw_followed_mandate: true },
    epilogue: `You survived. You followed the mandate until the mandate ran out, then you held with four peacekeepers against an attack that the mandate had never anticipated. One of your men took a round. You held the front until the RPF arrived, or you led the evacuation through the rear when holding became impossible. Either way, there were survivors. There were also people who didn't make it. You hold both.

Rusesabagina negotiated through all of it. His name became famous afterward. Then, in 2021, he was convicted of terrorism charges related to a different conflict. The story of the hotel became complicated in ways that people who weren't inside find hard to understand. You stopped trying to explain it around 2012.

The Canadian Senate inquiry called you in 2004. The thing they kept asking was whether you should have defied orders earlier—whether the lives lost in the weeks before the attack would have been saved if you'd committed to staying from the start rather than waiting for the order to arrive. You don't know the answer. You know what you did. You know it was within the mandate until it wasn't, and then you stayed anyway. That's the account you gave them.

You returned to Kigali in 2010. A survivor had organized a gathering for peacekeepers who stayed. She wanted the children who were inside the hotel—now teenagers—to meet the people who chose to remain. You spoke, or you listened, or you asked to meet her privately instead. Whatever you gave her, you were there. That was what she had asked for.`
  },

  {
    id: "rw-un-outcome-evacuated",
    survived: true,
    conditions: { rw_followed_evacuation_orders: true },
    epilogue: `You survived. You evacuated the expatriates. You followed orders, or you broke them and took Rwandans in the convoy—either way you were at the airport by April 12th, watching planes leave. You filed your report. You came home.

The faces at the checkpoint stayed with you. The woman with the child. The embassy workers. If you followed orders, you know they were killed at that roadblock. If you took Rwandans in the convoy, you know the militia let you through on reputation alone and that it could have gone differently. Neither version is clean.

You went home, or you went back to Dallaire's skeleton crew first. Either way, you were in Canada by August. The debrief. The report. The machinery of military life processing you back in. Your family said you were different. They were right.

You've been doing advocacy work since 1996. Op-eds. University lectures. You pushed for stronger peacekeeping mandates. Responsibility to Protect passed at the UN in 2005. Your testimony—written, or on film, or declined—is part of the record.

The documentary filmmaker found you in 2006. You participated, or you didn't, or you gave her the policy version and kept the checkpoint to yourself. That decision—twelve seconds at a roadblock in April 1994—is either on film for classrooms, or it lives only in you. You've thought about which is better. You haven't decided.`
  },

  {
    id: "rw-un-outcome-documented",
    survived: true,
    conditions: { rw_chose_documentation: true },
    epilogue: `You survived. You documented. You drove through Kigali with a camera and a notebook and you recorded what was happening while it happened. You stayed in the vehicle and filmed, or you got out at the church and stood between the militia and the door. You sent reports to Dallaire, to New York, to anyone receiving. The world saw. The world didn't act.

The RTLM Media Trial at the Hague opened in 2000. Your field reports were submitted to the prosecution in 2001. Your photographs of roadblocks, your recordings of the broadcast instructions, your timestamped entries showing the sequence between radio transmission and massacre—the prosecution built its causation argument on your documentation. The verdict came down in 2003. Guilty on all counts. Your name is in the judgment forty-one times.

The woman at the roadblock checkpoint—the one with two children who asked you to drive them to the stadium—you took them, or you stayed. If you took them, you have a letter from her from 2005, a single page, saying her children were in secondary school and healthy. If you stayed, you don't know what happened to them. You know what you were doing instead. The record of that checkpoint is complete and unbroken and it helped convict the people responsible. Whether that is the right exchange is a question you have not finished answering.

You testified at The Hague, or submitted your evidence in writing, or protected your sources and gave the court what you could. Whatever you gave, it was enough. The record exists. It will outlast you. That was what you were there to make.`
  },

  {
    id: "rw-un-outcome-killed",
    survived: false,
    conditions: { rw_defied_orders: true, rw_opened_gate: true },
    deathContext: {
      cause: "Killed defending the hotel enclave during militia assault",
      historicalRate: "Most UN peacekeepers who stayed in Rwanda survived. Some were killed in direct confrontations defending protected sites.",
      yourChoices: "You defied the withdrawal order. You opened the gate to three hundred more refugees. The militia attacked in force that night."
    },
    epilogue: `You didn't survive. You defied the withdrawal order and stayed. You opened the gate when three hundred more people arrived from the church massacre. The militia saw it. That night they attacked in force—not the probes and threats of the previous weeks, but a real assault. Automatic weapons. Grenades at the gate.

You held them for two hours. Long enough for most of the refugees to reach the back of the building, to find the service exits, to scatter into the city in the dark. The RPF arrived two days later. Most of them made it.

Your body was recovered by the RPF on July 6th. Canada repatriated you with full military honors. The Governor General presented the posthumous award to your family at a ceremony in Ottawa. Your daughter was eleven. Your son was eight.

General Dallaire spoke at your funeral. He said you embodied what UNAMIR should have been—the protection of civilians as the mission, not the protection of the mission. He said that fifteen hundred people were alive because you made two decisions: to stay, and to open the gate.

The hotel has a plaque. Students visit. They learn that individual choices inside institutional failures can determine whether people live or die. They learn your name. You are one of the names they learn. That is what remains.`
  },

  {
    id: "rw-un-outcome-fallback-survived",
    survived: true,
    conditions: {},
    epilogue: `You survived. The path you took—the orders you followed or defied, the choices you made at checkpoints and hotel gates and church doors—led you here. Alive. Carrying what you saw and what you decided and who you left behind.

The UN's failure in Rwanda was systematic. The genocide fax was ignored. The force was cut. The mandate prohibited intervention. You were one person inside a machine that had already decided not to act. Everything you did was either within that machine or outside it, and outside it had no support, no reinforcement, no extraction.

You've testified, or advocated, or declined to speak, or kept the documentary camera out of your face. Whatever you gave the record, the record exists. The ICTR prosecuted. The gacaca courts processed thousands of cases. The Responsibility to Protect doctrine passed in 2005. Rwanda rebuilt.

You have PTSD, or you've been lucky enough to manage it. You have the faces of specific people—at roadblocks, at gates, at church doors. You carry them. That's not a resolution. It's just what's true. The choices you made in April 1994 are part of history now, and history is not finished deciding what to do with them.`
  },

  {
    id: "rw-un-outcome-fallback-killed",
    survived: false,
    conditions: {},
    deathContext: {
      cause: "Killed during the 1994 Rwandan Genocide while serving with UNAMIR",
      historicalRate: "Ten Belgian peacekeepers were killed on April 7th alone. Others died defending protected sites throughout the genocide.",
      yourChoices: "You were present. You made decisions. The violence found you anyway."
    },
    epilogue: `You didn't survive. You were a UN peacekeeper in Rwanda in April 1994 with a mandate that prohibited you from doing what the situation required. You made choices within that contradiction—to stay or go, to document or intervene, to follow orders or defy them—and the violence found you anyway.

General Dallaire wrote about what UNAMIR could have done with adequate force and a real mandate. He believed five thousand properly equipped soldiers could have stopped the genocide. You were one of 270 who remained after the Security Council voted to withdraw. The math of what was possible and what existed is a political failure, not a personal one. But you were the person inside it.

Your name is in the UNAMIR records. Your service is documented. The choices you made—the specific decisions at specific moments—are part of what researchers and historians use to understand what individual agency looks like inside institutional failure.

That is what remains of you in the record. It is not nothing.`
  }
];

// Export role data
export default {
  scenes: unPeacekeeperScenes,
  outcomes: unPeacekeeperOutcomes
};
