/**
 * Rwanda Genocide Mission - UN Peacekeeper (Captain Marcus Webb) Role
 *
 * Historical Context:
 * - Captain Marcus Webb, Canadian UNAMIR officer, April 1994
 * - UNAMIR mandate: monitor ceasefire, not intervene in internal conflicts
 * - After 10 Belgian peacekeepers killed, UN reduced force from 2,500 to 270
 * - General Dallaire's "genocide fax" warned of planned massacres - ignored
 * - Peacekeepers protected enclaves (hotel, stadium) but couldn't stop massacres
 * - Moral dilemma: follow orders to withdraw vs. stay and protect civilians
 * - Post-genocide: PTSD, guilt, advocacy, testimony at inquiries
 *
 * BRANCHING STRUCTURE:
 * - Stayed Path: Remained in Rwanda, protected civilians at hotel/stadium
 * - Evacuated Path: Followed orders to withdraw, left Rwandans behind
 * - Documented Path: Stayed to gather evidence, sent reports, defied orders
 *
 * Requirements: US-2.1, US-2.2, US-2.3, TR-2.2
 */

const unPeacekeeperScenes = [
  {
    id: "rw-un-scene-01",
    narrative: `April 7, 1994. Dawn. You're Captain Marcus Webb, Canadian Forces, UNAMIR. United Nations Assistance Mission for Rwanda. You've been here six months monitoring the ceasefire between the government and RPF. Yesterday, President Habyarimana's plane was shot down. Now everything's falling apart.

UNAMIR headquarters in Kigali. Radio chatter. Reports of roadblocks. Presidential guard killing moderate politicians. Prime Minister Uwilingiyimana is dead. Ten Belgian peacekeepers murdered trying to protect her. Your commander, General Dallaire, sent the genocide fax three months ago—warning of planned massacres, arms caches, hit lists. New York ignored it. "Monitor and report only. Do not intervene."

Your mandate is clear: peacekeeping, not peace enforcement. You can't fire unless fired upon. You can't protect civilians unless they're in designated safe zones. But civilians are being killed at roadblocks three blocks from here. The radio crackles. Three options. The H├┤tel des Mille Collines is requesting protection—twelve hundred Tutsi sheltering there. Or evacuate foreign nationals as ordered. Or stay mobile, document what's happening, send evidence to New York. Fifteen seconds to decide.`,
    apThemes: ["causation", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    soundEffects: [
      { file: 'rw-sfx-military-radio.mp3', triggerAfterMs: 1200 },
      { file: 'rw-sfx-radio-static-burst.mp3', triggerAfterMs: 4500 }
    ],
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
        consequences: {},
        nextScene: "rw-un-scene-02b"
      },
      {
        id: "rw-un-choice-01-c",
        text: "Document atrocities—gather evidence",
        consequences: { rw_documented_evidence: true },
        nextScene: "rw-un-scene-02c"
      }
    ]
  },

  {
    id: "rw-un-scene-02a",
    narrative: `April 8. Hôtel des Mille Collines. You deployed here with eight peacekeepers. Twelve hundred Tutsi refugees inside. Interahamwe militia outside. They want in. They're chanting. Threatening. Testing the perimeter. Your orders are to hold the position but not engage unless fired upon. The hotel manager, Rusesabagina, is negotiating. Bribing. Calling in favors. It's working. Barely.

A militia commander approaches your checkpoint. "UN. You're leaving soon, yes? Like the Belgians?" He's right. New York is talking about full withdrawal. The Security Council voted to cut UNAMIR from 2,500 to 270 troops. You might be ordered out tomorrow. The militia knows this. "When you leave, we come in. Those people are ours."

Your radio crackles. Dallaire's voice. "All units. Prepare for possible evacuation order. Stand by." The militia commander smiles. The refugees inside can hear this. They're terrified. You have a choice. Defy orders and stay no matter what. Or follow the mandate, hold position until ordered to withdraw. Fifteen seconds.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    soundEffects: [
      { file: 'rw-sfx-militia-chant-distant.mp3', triggerAfterMs: 2000 },
      { file: 'rw-sfx-military-radio.mp3', triggerAfterMs: 5500 }
    ],
    choices: [
      {
        id: "rw-un-choice-02a-a",
        text: "Defy orders—stay no matter what",
        consequences: { rw_defied_orders: true, rw_stayed_after_withdrawal: true },
        nextScene: "rw-un-scene-03a"
      },
      {
        id: "rw-un-choice-02a-b",
        text: "Hold position—follow mandate for now",
        consequences: { rw_followed_mandate: true, rw_protected_hotel: true },
        nextScene: "rw-un-scene-03b"
      }
    ]
  },

  {
    id: "rw-un-scene-02b",
    narrative: `April 9. Evacuation convoy. You're escorting foreign nationals to the airport. Americans. Europeans. Canadians. They're terrified but they'll be fine. They have passports. They have governments that care. The convoy passes roadblocks. Militia waves you through. Blue helmets. UN vehicles. Immunity.

At one checkpoint, Rwandans are begging to board. "Please. Take us. We worked for the embassy. We have families." Your orders are clear: foreign nationals only. No Rwandans. The militia is watching. If you take Rwandans, the convoy might be stopped. Everyone might die. If you don't, these people will be killed at the roadblock. You can see it in the militia's eyes.

A woman holds up a child. "Please. Just the children." Your sergeant looks at you. The convoy is idling. The airport is twenty minutes away. The militia commander is walking over. You have seconds. Follow orders—foreign nationals only. Or take Rwandans and risk the convoy. Twelve seconds to decide.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    soundEffects: [
      { file: 'rw-sfx-truck-idle.mp3', triggerAfterMs: 1000 },
      { file: 'rw-sfx-desperate-voices.mp3', triggerAfterMs: 3500 },
      { file: 'rw-sfx-truck-idle.mp3', triggerAfterMs: 6000 }
    ],
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

  {
    id: "rw-un-scene-02c",
    narrative: `April 10. You're documenting. Camera. Notebook. Radio reports to HQ. You've seen roadblocks where militia check identity cards—colonial-era documents listing ethnicity that have become death warrants for anyone marked Tutsi. Bodies in streets. Churches surrounded by militia. You're gathering evidence. Someone has to record this. Someone has to make the world see.

You reach a church. Screaming inside. Grenades. Machetes. Hundreds of people. The militia sees your UN vehicle. They stop. They're not sure what to do. You're a witness. That makes them nervous. Or it makes them bold. "UN. You have no mandate here. Leave." You could leave. Document from a distance. Or stay. Your presence might stop them. Or it might get you killed like the Belgians.

Your radio crackles. Dallaire. "All units. Avoid direct confrontation. Document and report only." The militia commander is waiting. The screaming inside the church is getting quieter. You have your camera. You have your weapon. You have your orders. What do you do?`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    soundEffects: [
      { file: 'rw-sfx-camera-shutter.mp3', triggerAfterMs: 1500 },
      { file: 'rw-sfx-camera-shutter.mp3', triggerAfterMs: 3800 }
    ],
    deathCheckpoint: true,
    choices: [
      {
        id: "rw-un-choice-02c-a",
        text: "Stay and document—be a witness",
        consequences: { rw_documented_evidence: true },
        nextScene: "rw-un-scene-03d"
      }
    ]
  },

  {
    id: "rw-un-scene-03a",
    narrative: `April 15. You defied orders. When the withdrawal came, you stayed. Eight peacekeepers. Twelve hundred refugees. The hotel is an island. Militia surrounds it. They cut water. They cut power. They threaten daily. But they don't attack. Your presence—blue helmets, UN flag—holds them back. Barely.

Dallaire calls. "Webb. You're not supposed to be there. New York is furious." You know. You don't care. "If you stay, you're on your own. No reinforcements. No resupply. No extraction if it goes bad." You understand. The refugees understand too. They know you stayed when you could have left. That means something.

The militia commander returns. "Captain. Your government will abandon you. The UN will abandon you. Why die for these people?" He's not wrong. Canada might court-martial you. The UN might disavow you. But if you leave now, twelve hundred people die. You've made your choice. You're staying. The question is: how long can you hold?`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    soundEffects: [
      { file: 'rw-sfx-militia-chant-distant.mp3', triggerAfterMs: 1800 },
      { file: 'rw-sfx-military-radio.mp3', triggerAfterMs: 4800 }
    ],
    deathCheckpoint: true,
    choices: [
      {
        id: "rw-un-choice-03a-a",
        text: "Hold the hotel—wait for RPF",
        consequences: { rw_saved_civilians: true },
        nextScene: "rw-un-scene-04a"
      }
    ]
  },

  {
    id: "rw-un-scene-03b",
    narrative: `April 20. You followed the mandate. You held the hotel. You didn't defy orders. When the withdrawal order came, you prepared to leave. The refugees panicked. "You're leaving us?" Rusesabagina negotiated. Bribed. Called in every favor. He convinced the militia to wait. He convinced New York to let a skeleton crew stay. You're part of that crew. Four peacekeepers. Twelve hundred refugees. It's not enough. But it's something.

The RPF is advancing. If you can hold until they arrive... weeks. Maybe days. The militia knows this. They're getting desperate. More aggressive. Testing the perimeter. Your ammunition is limited. Your mandate is still "monitor and report." But the refugees are counting on you. Dallaire is counting on you. History is watching.

A militia attack on the hotel seems imminent. You can see them massing. Your radio is silent—New York doesn't want to know. You have four peacekeepers, limited ammunition, and twelve hundred civilians. You followed orders this far. Now you have to decide: hold at all costs, or prepare to evacuate if it's hopeless.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    soundEffects: [
      { file: 'rw-sfx-militia-chant-distant.mp3', triggerAfterMs: 2000 },
      { file: 'rw-sfx-military-radio.mp3', triggerAfterMs: 5000 }
    ],
    deathCheckpoint: true,
    choices: [
      {
        id: "rw-un-choice-03b-a",
        text: "Hold at all costs—no retreat",
        consequences: { rw_held_position: true },
        nextScene: "rw-un-scene-04b"
      }
    ]
  },

  {
    id: "rw-un-scene-03c",
    narrative: `April 12. Airport. You evacuated the expatriates. Mission complete. They're boarding planes. Going home. Safe. You followed orders. You did your job. But the Rwandans at the checkpoint—the ones begging to board—you can't stop seeing their faces. The woman with the child. The embassy workers. They're dead now. You know they're dead.

Your orders are to return to HQ. Dallaire is consolidating the remaining 270 peacekeepers. The mission is over. The genocide continues. New York is debating whether to even call it genocide—if they do, the Genocide Convention obligates intervention. So they don't call it that. They call it "acts of genocide." Semantics. Politics. People are dying.

You're at the airport. You could board a plane. Go home. File your report. Or you could go back. Rejoin Dallaire's skeleton crew. Document what's happening. Be a witness. Your tour is over. Your duty is done. But your conscience isn't quiet.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    soundEffects: [
      { file: 'rw-sfx-aircraft-engines-distant.mp3', triggerAfterMs: 1500 },
      { file: 'rw-sfx-military-radio.mp3', triggerAfterMs: 5000 }
    ],
    deathCheckpoint: true,
    choices: [
      {
        id: "rw-un-choice-03c-a",
        text: "Board the plane—go home",
        consequences: { rw_left_rwanda: true },
        nextScene: "rw-un-scene-04c"
      },
      {
        id: "rw-un-choice-03c-b",
        text: "Return to HQ—stay and document",
        consequences: { rw_returned_to_duty: true, rw_documented_evidence: true },
        nextScene: "rw-un-scene-04d"
      }
    ]
  },

  {
    linear: true,
    id: "rw-un-scene-03d",
    narrative: `April 11. You stayed at the church. You documented. Camera. Notebook. Radio reports. The militia let you watch. They wanted you to see. They wanted the world to know they weren't afraid. Three hundred people killed. You have photos. You have names. You have evidence.

You send reports to New York. To Dallaire. To anyone who will listen. The media picks it up. CNN. BBC. The world sees. But the world doesn't act. The Security Council debates. The US says "acts of genocide," not "genocide." France abstains. No one wants to intervene. Your evidence matters. But it doesn't stop the killing.

You continue documenting. Roadblocks. Massacres. Refugee movements. You're building a case. For tribunals. For history. For justice. But justice is later. Right now, people are dying. You're a witness. That's important. But is it enough? You could do more. You could protect enclaves. You could defy orders. Or you keep documenting. Keep gathering evidence. Keep making the world see.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    soundEffects: [
      { file: 'rw-sfx-camera-shutter.mp3', triggerAfterMs: 2200 },
      { file: 'rw-sfx-radio-static-burst.mp3', triggerAfterMs: 5000 }
    ],
    choices: [
      {
        id: "rw-un-choice-03d-a",
        text: "Continue documenting—build the case",
        consequences: { rw_continued_documentation: true, rw_sent_genocide_fax: true },
        nextScene: "rw-un-scene-04d"
      }
    ]
  },

  // AFTERMATH SCENES (Post-1994)

  {
    id: "rw-un-scene-04a",
    narrative: `2008. Ottawa, Canada. Fourteen years later. You stayed. You defied orders. You held the hotel until the RPF arrived in July. Twelve hundred people survived because you didn't leave. Canada didn't court-martial you—they gave you a medal. The UN called you a hero. General Dallaire wrote about you in his book.

But you have PTSD. Nightmares. Flashbacks. The smell of smoke. The sound of machetes on pavement. The faces of people you couldn't save at other sites. You saved twelve hundred. Hundreds of thousands died. The math doesn't comfort you. Your therapist says you did what you could. Your family says you're a hero. You don't feel like one.

The Canadian government is holding an inquiry into Rwanda. They want you to testify. To explain what happened. Why the UN failed. Why the world watched. Your testimony could change policy. Could prevent future genocides. Or it could just be more words. More reports. More evidence that gets ignored. You're tired. You've testified before. But maybe this time it matters.`,
    apThemes: ["continuity", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    choices: [
      {
        id: "rw-un-choice-04a-a",
        text: "Testify—push for policy change",
        consequences: { rw_testified_inquiry: true, rw_advocated_change: true },
        nextScene: "outcome"
      },
      {
        id: "rw-un-choice-04a-b",
        text: "Decline—focus on healing",
        consequences: { rw_declined_testimony: true, rw_chose_healing: true },
        nextScene: "outcome"
      },
      {
        id: "rw-un-choice-04a-c",
        text: "Testify but privately—no media",
        consequences: { rw_testified_privately: true, rw_avoided_spotlight: true },
        nextScene: "outcome"
      }
    ]
  },

  {
    id: "rw-un-scene-04b",
    narrative: `2010. Kigali, Rwanda. Sixteen years later. You held the hotel. You followed the mandate as long as you could, then you held at all costs when the attack came. Four peacekeepers. Twelve hundred civilians. You held until the RPF arrived. Everyone survived. You did your job. You followed orders until orders didn't matter anymore. Then you did what was right.

Now you're back. First time since 1994. The hotel still operates. Tourists come. They take photos. They ask questions. The manager, Rusesabagina, became famous. Then controversial. The narrative is complicated. You're here for a memorial ceremony. Survivors want to thank you. The government wants to honor you. You're not sure you deserve it.

A survivor approaches. "Captain Webb. You stayed. You didn't have to. You saved my family." She's crying. You're crying. You saved twelve hundred. You couldn't save hundreds of thousands. The math still doesn't comfort you. But maybe it's not about math. Maybe it's about the twelve hundred who lived. The ceremony is tomorrow. You're invited to speak. To share your story. To help people understand.`,
    apThemes: ["continuity", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    choices: [
      {
        id: "rw-un-choice-04b-a",
        text: "Speak at ceremony—share your story",
        consequences: { rw_spoke_publicly: true, rw_honored_survivors: true },
        nextScene: "outcome"
      },
      {
        id: "rw-un-choice-04b-b",
        text: "Attend silently—let survivors speak",
        consequences: { rw_attended_silently: true, rw_centered_survivors: true },
        nextScene: "outcome"
      },
      {
        id: "rw-un-choice-04b-c",
        text: "Meet survivors privately—no ceremony",
        consequences: { rw_met_privately: true, rw_avoided_ceremony: true },
        nextScene: "outcome"
      }
    ]
  },

  {
    id: "rw-un-scene-04c",
    narrative: `2006. Toronto, Canada. Twelve years later. You evacuated the expatriates. You followed orders. You left Rwandans at the checkpoint. You went home. You filed your report. You did your job. But the faces—the woman with the child, the embassy workers—they haunt you. You know they died. You know you could have saved them. You chose not to.

You have PTSD. Guilt. Nightmares. Your therapist says you followed orders. Your family says you did what you could. But you know the truth. You had a choice. You chose safety over risk. You chose orders over conscience. Most peacekeepers made the same choice. That doesn't make it easier.

You've become an advocate. You speak at universities. You write op-eds. You push for stronger peacekeeping mandates. "Never again" means nothing if we don't act. Your advocacy matters. It changes policy. It educates people. But it doesn't bring back the Rwandans you left behind. A documentary filmmaker wants to interview you. To tell your story. To show the cost of inaction. Do you participate?`,
    apThemes: ["continuity", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    choices: [
      {
        id: "rw-un-choice-04c-a",
        text: "Participate—tell the full truth",
        consequences: { rw_participated_documentary: true, rw_shared_guilt: true },
        nextScene: "outcome"
      },
      {
        id: "rw-un-choice-04c-b",
        text: "Decline—keep advocating privately",
        consequences: { rw_declined_documentary: true, rw_private_advocacy: true },
        nextScene: "outcome"
      },
      {
        id: "rw-un-choice-04c-c",
        text: "Participate but focus on policy, not guilt",
        consequences: { rw_participated_policy_focus: true, rw_forward_looking: true },
        nextScene: "outcome"
      }
    ]
  },

  {
    id: "rw-un-scene-04d",
    narrative: `July 4, 1994. The RPF captured Kigali. The genocide ended after 100 days. Twelve years later.

2012. The Hague, Netherlands. You documented everything. Churches. Roadblocks. Massacres. Identity card checks. You sent reports to New York. To Dallaire. To the media. The world saw. The world didn't act. But your evidence mattered later. The International Criminal Tribunal for Rwanda used your photos, your testimony, your reports. Militia leaders were convicted. RTLM broadcasters were convicted. Justice was slow. But it came.

Now you're testifying again. A war crimes trial. The defendant organized the church massacre you documented. Your photos are evidence. Your testimony is crucial. The defense attorney will question your credibility, your motives, your methods. But you were there. You saw. You documented. The truth is in your camera. The truth is in your notebook. The truth is in your memory.

Some peacekeepers who documented felt like they did nothing. You gathered evidence while people died. But evidence matters. Justice matters. The historical record matters. Your documentation helped convict perpetrators. It helped survivors get justice. It helped the world understand. The prosecutor waits. The judges wait. The defendant stares at you. You have the microphone. You have the truth.`,
    apThemes: ["continuity", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    choices: [
      {
        id: "rw-un-choice-04d-a",
        text: "Testify fully—every detail",
        consequences: { rw_testified_tribunal: true, rw_provided_evidence: true },
        nextScene: "outcome"
      },
      {
        id: "rw-un-choice-04d-b",
        text: "Testify but protect sources",
        consequences: { rw_testified_carefully: true, rw_protected_sources: true },
        nextScene: "outcome"
      },
      {
        id: "rw-un-choice-04d-c",
        text: "Submit evidence without testifying",
        consequences: { rw_submitted_evidence: true, rw_avoided_testimony: true },
        nextScene: "outcome"
      }
    ]
  }
];

const unPeacekeeperOutcomes = [
  // STAYED PATH - DEFIED ORDERS - Aftermath variants
  {
    id: "rw-un-outcome-stayed-advocate-survived",
    survived: true,
    conditions: {
      rw_defied_orders: true,
      rw_stayed_after_withdrawal: true,
      rw_saved_civilians: true,
      rw_testified_inquiry: true,
      rw_advocated_change: true
    },
    epilogue: `He testified at three parliamentary inquiries and a UN internal review. He pushed for the Responsibility to Protect doctrine that was eventually adopted in 2005. He speaks at West Point, at Sandhurst, at the Canadian Forces College. The twelve hundred survivors send a delegation to Ottawa every five years. He meets them every time. He never feels like he deserves to be in the same room.

The advocacy work matters. The R2P doctrine changed how the UN approaches mass atrocities. His testimony was cited in the 2004 Canadian Senate report. Students read his depositions in international relations courses. But the doctrine came eleven years after Rwanda. Eight hundred thousand people died before the world decided "never again" needed enforcement mechanisms.

He carries both numbers. The twelve hundred who lived because he stayed. The hundreds of thousands who died while the Security Council debated semantics. His therapist says he can't hold himself responsible for structural failures. He knows that intellectually. The nightmares don't care about intellectual distinctions. He keeps testifying anyway. Someone has to say the names.`
  },

  {
    id: "rw-un-outcome-stayed-healed-survived",
    survived: true,
    conditions: {
      rw_defied_orders: true,
      rw_stayed_after_withdrawal: true,
      rw_saved_civilians: true,
      rw_declined_testimony: true,
      rw_chose_healing: true
    },
    epilogue: `He declined the inquiry testimony. His therapist said it was the right call at the time. He spent two years in treatment before he could sleep through the night. The twelve hundred survivors — he checks the survivor association website sometimes. He doesn't reach out. He doesn't need them to thank him again. He knows what he did. That's enough. Some days it's enough.

Canada gave him a medal. He keeps it in a drawer. Dallaire wrote about him — not by name, at his request, but the story is recognizable to anyone who knows UNAMIR. He read that section once. He hasn't opened the book since. The story is accurate. That doesn't mean he needs to live inside it.

His daughter asked once if he was a hero. He said he was a soldier who stayed when he was supposed to leave. She was eight. She didn't understand the difference yet. She's twenty-two now. She understands. She doesn't ask anymore. They have dinner once a week. They talk about her work, about his garden, about ordinary things. That's the relationship he can sustain. That's the healing he's managed.`
  },

  {
    id: "rw-un-outcome-stayed-private-survived",
    survived: true,
    conditions: {
      rw_defied_orders: true,
      rw_stayed_after_withdrawal: true,
      rw_saved_civilians: true,
      rw_testified_privately: true,
      rw_avoided_spotlight: true
    },
    epilogue: `He gave a private deposition — on record but not public. The UN review used it without naming him. He went home to Winnipeg and told his family he'd done his job. His daughter asked if he was a hero. He said he was a soldier who stayed when he was supposed to leave. She was eight. She didn't understand the difference yet. He's still waiting to find out if she'll need to.

The private testimony mattered. Policy analysts cited it. The Responsibility to Protect doctrine drew on depositions like his. But his name isn't in the public record. The survivors know. Dallaire knows. The UN review board knows. That's enough witnesses. He doesn't need the world to know. He needs to know he told the truth to people who could use it.

He works in veteran services now. He helps other peacekeepers process what they saw. He doesn't talk about Rwanda unless they ask directly. Most of them ask eventually. He tells them what he told the review board: you do what you can with the mandate you're given, and sometimes the mandate is wrong, and you carry both of those facts forward. They understand. That's the audience that matters.`
  },

  {
    id: "rw-un-outcome-stayed-survived",
    survived: true,
    conditions: {
      rw_stayed_after_withdrawal: true,
      rw_defied_orders: true,
      rw_chose_protection: true
    },
    epilogue: `You survived. You defied orders. When the UN withdrew most of UNAMIR, you stayed. Eight peacekeepers. Twelve hundred refugees at the Hôtel des Mille Collines. The militia surrounded you. They cut water. They cut power. They threatened daily. But they didn't attack. Your presence—blue helmets, UN flag—held them back. When the RPF captured Kigali in July, everyone survived. Twelve hundred people lived because you didn't leave.

Canada gave you a medal. The UN called you a hero. General Dallaire wrote about you. But you have PTSD. Nightmares. Flashbacks. The faces of people you couldn't save at other sites. You saved twelve hundred. Hundreds of thousands died. The math doesn't comfort you. Your therapist says you did what you could. Your family says you're a hero. You don't feel like one.

You testified at inquiries. You advocated for stronger peacekeeping mandates. You spoke at universities. Your story changed policy. It educated people. But it didn't bring back those who died. You return to Rwanda sometimes. Survivors thank you. They say you gave them life. You carry that forward—both the lives you saved and the weight of those you couldn't. You stayed when you could have left. That matters.`
  },

  {
    id: "rw-un-outcome-stayed-killed",
    survived: false,
    conditions: {
      rw_stayed_after_withdrawal: true,
      rw_defied_orders: true
    },
    deathContext: {
      cause: "Killed during the genocide while defending civilians",
      historicalRate: "While most UN peacekeepers who stayed survived, some were killed defending protected sites",
      yourChoices: "You defied withdrawal orders and held the hotel. The militia attacked."
    },
    deathEpilogueEarly: `You didn't survive. You defied orders. You stayed when the UN withdrew. You held the hotel with a handful of peacekeepers against hundreds of militia. For weeks, your presence kept them back. You were killed in June or July 1994 during a militia assault on the hotel, before the RPF captured Kigali and the genocide ended.

Your death occurred during the hundred days. You died defending civilians, following the mandate you believed you should have had rather than the one you were given. Most of the refugees survived because you bought them time. Your body was recovered when the RPF arrived.

Canada gave you a posthumous medal. The UN named a peacekeeping award after you. General Dallaire spoke at your funeral. He said you embodied what UNAMIR should have been — protection over politics, civilians over mandates, courage over orders. The hotel has a plaque. Students visit. They learn that some peacekeepers stayed, that some died defending civilians, that courage matters even when mandates fail. You're remembered. You're honored. You carried that choice to the end.`,
    epilogue: `You didn't survive. You defied orders. You stayed when the UN withdrew. You held the hotel with a handful of peacekeepers against hundreds of militia. For weeks, your presence kept them back. Whether you were killed during a direct assault, in an ambush, or in the chaos of the genocide's final weeks, you died defending civilians. Most of the refugees survived because you bought them time.

The RPF arrived and secured the area. Your body was recovered. Canada gave you a posthumous medal. The UN named a peacekeeping award after you. General Dallaire spoke at your funeral. He said you embodied what UNAMIR should have been — protection over politics, civilians over mandates, courage over orders.

Your family grieved. Your children grew up knowing you died a hero. The survivors you protected remember your name. The hotel has a plaque. Students visit. They learn that some peacekeepers stayed, that some died defending civilians, that courage matters even when mandates fail. You're remembered. You're honored. You carried that choice to the end.`
  },

  // EVACUATED PATH - FOLLOWED ORDERS - Aftermath variants
  {
    id: "rw-un-outcome-evacuated-documentary-survived",
    survived: true,
    conditions: {
      rw_evacuated_expatriates: true,
      rw_left_rwandans: true
    },
    epilogue: `He agreed to the documentary and told the full story: the convoy, the checkpoint, the woman with the child, the embassy workers he left behind, the plane ride home, the filing of the report that no one questioned. The documentary aired in twelve countries. Rwandans watched it. Some of the families of people he left at that checkpoint watched it. He didn't watch it. He knew what it said.

The filmmaker asked if he felt guilty. He said yes. The filmmaker asked if he'd do it differently. He said he didn't know. The filmmaker asked what he wanted viewers to understand. He said he wanted them to understand that following orders and doing the right thing are not always the same calculation, and that peacekeepers are given impossible mandates and twelve seconds to resolve them. The documentary used that quote. It's the part people remember.

His family watched it. His daughter called afterward. She didn't say anything for thirty seconds. Then she said, "I understand now." He asked what she understood. She said, "Why you don't sleep." The documentary didn't fix anything. It made the guilt public. He's not sure if that was courage or a different kind of avoidance. The families at the checkpoint know his name now. He carries that forward.`
  },

  {
    id: "rw-un-outcome-evacuated-private-survived",
    survived: true,
    conditions: {
      rw_evacuated_expatriates: true,
      rw_left_rwandans: true,
      rw_left_rwanda: true
    },
    epilogue: `He declined the documentary. He advocates privately — letters to parliamentarians, testimony to closed committees, funding for peacekeeping reform organisations. Nobody films it. He prefers it that way. The guilt doesn't need an audience. The policy work doesn't either. He's made his accounting in private. Whether that's courage or avoidance is a question he's stopped answering.

The Responsibility to Protect doctrine was adopted in 2005. His testimony to the closed committee was cited in the Canadian brief. His name isn't in the public record. The policy analysts know. The committee members know. That's enough. He didn't save the people at the checkpoint. He can't bring them back. He can make sure the next peacekeeper has a mandate that doesn't force the same choice. That's the work he can do.

His therapist asked once why he avoids public testimony but maintains the private advocacy. He said public testimony is about him. Private advocacy is about the mandate. He doesn't need to be the story. He needs the mandate to change. Eleven years after Rwanda, it did. The doctrine isn't perfect. It's better than what he had. He carries that forward.`
  },

  {
    id: "rw-un-outcome-evacuated-policy-survived",
    survived: true,
    conditions: {
      rw_evacuated_expatriates: true,
      rw_left_rwandans: true,
      rw_left_rwanda: true,
      rw_participated_policy_focus: true,
      rw_forward_looking: true
    },
    epilogue: `He participated in the documentary but redirected every question about guilt toward policy. What should the mandate have said. What Security Council veto reform would have looked like. What the Responsibility to Protect doctrine changed. The interviewer kept trying to get to the checkpoint. He kept returning to the structural failure. Both things are true. He knows which one he can live inside.

The documentary aired. Policy analysts cited it. Students watched it in international relations courses. The reviews said it was "clinical" and "policy-focused" and "less emotional than other Rwanda documentaries." That was correct. He wasn't interested in performing guilt. He was interested in explaining why the mandate was wrong and what changed afterward. The people at the checkpoint are dead. The policy is different. He can't fix the first thing. He contributed to the second.

His daughter watched it and said it felt like he was hiding. He said he was focusing. She asked what the difference was. He said hiding is about protecting yourself, focusing is about directing attention where it can matter. She wasn't satisfied with that answer. Neither is he. But the Responsibility to Protect doctrine exists. The mandate changed. He carries both things forward.`
  },

  // DOCUMENTED PATH - Aftermath variants
  {
    id: "rw-un-outcome-documented-full-survived",
    survived: true,
    conditions: {
      rw_sent_genocide_fax: true,
      rw_documented_evidence: true,
      rw_continued_documentation: true
    },
    epilogue: `His fax preceded Dallaire's by six days. He testified at the ICTR and the Belgian Senate inquiry and the UN internal review. His documentation filled four evidence files. He spent eleven years answering questions about what he saw and what he reported and why the world didn't act. He stopped counting how many times someone told him the documentation mattered. He knows it did. It still took a hundred days and eight hundred thousand deaths.

The ICTR used his evidence in seven cases. Five convictions. His photographs are in the Kigali Genocide Memorial. His testimony is cited in the UN's 1999 independent inquiry report — the one that concluded the Security Council failed Rwanda. Students read his depositions in international law courses. He's testified at universities, at military academies, at UN training sessions. He's told the story so many times it's become a script. He's not sure if that's processing or performance.

His therapist asked what he needs the documentation to have accomplished. He said he needs it to have prevented the next genocide. She asked if it did. He said Darfur happened. Syria happened. The Rohingya happened. She asked if the documentation still mattered. He said he doesn't know how to answer that. The five convictions happened. The memorial exists. The world still watches. He carries all of it forward.`
  },

  {
    id: "rw-un-outcome-documented-careful-survived",
    survived: true,
    conditions: {
      rw_sent_genocide_fax: true,
      rw_documented_evidence: true,
      rw_continued_documentation: true,
      rw_testified_carefully: true,
      rw_protected_sources: true
    },
    epilogue: `He testified carefully — gave the tribunal what it needed and protected the names of Rwandans who'd trusted him with information. The protection cost something: some perpetrators the evidence might have placed at specific sites couldn't be fully placed there without testimony he withheld. He weighed this. He chose protection. Three convictions came anyway. Two didn't. He knows which two.

The sources he protected are still alive. Some of them still live in communities alongside perpetrators who were acquitted. One of them wrote to him in 2008: "You kept your promise. My family is safe. The man who killed my brother walks free. Both things are true because of your choice." He keeps that letter. He's never been certain the choice was right. His therapist says protecting sources was ethical. The tribunal judges accepted it. The two acquitted perpetrators are free. The sources are alive. The math doesn't resolve.

Dallaire wrote about the impossible calculations peacekeepers made. Webb's careful testimony is one of them. The ICTR noted his source protection in its final report — acknowledged the limitation and the reasoning. Three convictions. Two acquittals. Multiple protected sources still living in Rwanda. He testified at universities about this calculation. Students ask if he'd do it differently. He says he'd want a world where the choice didn't exist. They're not satisfied with that answer. Neither is he.`
  },

  {
    id: "rw-un-outcome-documented-submitted-survived",
    survived: true,
    conditions: {
      rw_sent_genocide_fax: true,
      rw_documented_evidence: true,
      rw_continued_documentation: true,
      rw_submitted_evidence: true,
      rw_avoided_testimony: true
    },
    epilogue: `He submitted the documentation and declined to testify in person. The ICTR noted the refusal and accepted the evidence anyway. He's asked about this sometimes — why document if not testify? He says the documentation was always the point. His presence in a courtroom was optional. The photographs, the reports, the fax: those couldn't be cross-examined. They just existed. He trusted them more than his own memory by the time the trials came.

Two convictions followed from his evidence. The prosecutors wanted him there. They said his testimony would strengthen the cases. He said the evidence was sufficient. They said his presence would matter to survivors. He said the convictions would matter to survivors. Both things might be true. The two convictions happened. Three other cases where his evidence might have been used didn't proceed to trial. He doesn't know if his testimony would have changed that.

His therapist suggested the avoided testimony was about self-protection. He said it was about trusting the documentation. His daughter asked if he was hiding. He said he was letting the evidence speak. She asked what the difference was. He said one is about fear and one is about method. She wasn't convinced. Neither is he. But the photographs exist. The reports exist. The two convictions exist. He submitted the evidence. That was the job. He carries the question forward.`
  },

  // STAYED PATH - FOLLOWED MANDATE - Aftermath variants
  {
    id: "rw-un-outcome-mandate-spoke-survived",
    survived: true,
    conditions: {
      rw_followed_mandate: true,
      rw_protected_hotel: true
    },
    epilogue: `He speaks at the ceremony and tells the part he always tells: that he held position, that twelve hundred people survived, that the mandate was inadequate and he stayed inside it anyway. He doesn't tell the other part: the roadblocks he drove past, the reports he filed that no one acted on, the math that doesn't resolve. The audience applauds. The survivors in the front row don't applaud. They nod. That's the part he brings home.

The Kwibuka commemoration happens every April. He's spoken at four of them. The organizers ask him back because he doesn't claim heroism. He describes the mandate, the limitations, the twelve hundred who lived and the calculation that produced that number. Students ask questions afterward. They want to know if he'd do it differently. He says he'd want a different mandate. They ask if he'd defy orders. He says he held position within his authorization and that was the choice he made. They're not satisfied with that answer. Neither is he.

His therapist says public testimony can be part of processing. He's not sure if he's processing or performing. The survivors nod when he speaks. That's the metric he uses. If they nod, he's telling it right. If they applaud, he's told it wrong. He watches the front row. He brings that home.`
  },

  {
    id: "rw-un-outcome-mandate-silent-survived",
    survived: true,
    conditions: {
      rw_followed_mandate: true,
      rw_protected_hotel: true
    },
    epilogue: `He attended the Kwibuka commemoration in Ottawa and sat in the back. When they asked if any former UNAMIR personnel wanted to stand, he didn't stand. The ceremony wasn't for him. It was for the people in the front rows who lost everyone. He was there because he needed to be in the same room as that grief once a year. He doesn't know if that's processing or penance. His therapist says the distinction might not matter.

The survivors speak. They describe what happened at roadblocks, in churches, at the stadium. They describe the twelve hundred who lived at the hotel. They don't name the peacekeepers who held position. That's correct. The story isn't about the peacekeepers. He held position within his mandate. Twelve hundred people survived. Hundreds of thousands didn't. The ceremony is for everyone. He sits in the back and listens.

He returns every year. Same seat. Same silence. After the ceremony, survivors sometimes recognize him. They shake his hand. They don't thank him. They acknowledge him. That's the right verb. He was there. He held position. They survived. Those are facts. The ceremony puts them in the same room once a year. That's enough.`
  },

  {
    id: "rw-un-outcome-mandate-private-survived",
    survived: true,
    conditions: {
      rw_followed_mandate: true,
      rw_protected_hotel: true,
      rw_held_position: true,
      rw_met_privately: true,
      rw_avoided_ceremony: true
    },
    epilogue: `He doesn't attend ceremonies. He meets privately with survivor families once a year — a coffee, sometimes dinner, a conversation that isn't about what happened at the hotel because everyone at the table already knows. It's about what came after: their children, the gacaca verdicts, what Rwanda looks like now. The ceremonies are for making memory public. These dinners are for keeping it human. He needs the second kind.

One of the families — a woman who lost her husband but whose three children survived — sends him photos every December. The children are adults now. One is a doctor. One teaches secondary school. One works for the Ministry of Justice. He keeps the photos in a drawer with his service medal. He doesn't display them. They're not for display. They're evidence of a specific math: twelve hundred people survived, and those twelve hundred had children, and those children have lives. The mandate he held was forty meters wide. The consequences extend further.

His therapist asked once why he avoids ceremonies but maintains these private relationships. He said ceremonies are about what happened. The dinners are about what's happening. He can't change 1994. He can witness 2010. That's the part he can sustain.`
  },

  {
    id: "rw-un-outcome-mandate-public-survived",
    survived: true,
    conditions: {
      rw_followed_mandate: true,
      rw_protected_hotel: true,
      rw_held_position: true
    },
    epilogue: `He followed the mandate as far as it would take him, then held position when the numbers dropped to four peacekeepers. When the RPF arrived in July, twelve hundred people walked out of that hotel alive. He did his job within the authorization he was given, and when the authorization became insufficient, he held anyway. That's the story he tells at ceremonies and inquiries and university lectures.

The public testimony matters to him in a way the private conversations don't quite reach. He needs people to understand that the mandate was inadequate but that inadequate mandates can still save lives if the people holding them refuse to abandon their posts. He speaks at Kwibuka commemorations, at UN training sessions, at military academies. Students ask if he'd do it differently. He says he'd want a better mandate but he'd make the same choice within the one he had.

The Responsibility to Protect doctrine came eleven years after Rwanda. His testimony was cited in the Canadian brief that supported it. He speaks about this: how twelve hundred people survived because he held a forty-meter perimeter, and how the doctrine that followed tried to make sure the next peacekeeper wouldn't have to make survival math with such small numbers. The ceremonies applaud. The survivors in the front rows nod. He watches for the nods. That's how he knows he's telling it right.`
  },

  // EVACUATED PATH - SAVED RWANDANS - Aftermath variants
  {
    id: "rw-un-outcome-savers-documentary-survived",
    survived: true,
    conditions: {
      rw_saved_rwandans: true,
      rw_defied_orders: true
    },
    epilogue: `He loaded seven people onto the convoy and was reprimanded for it. He told that story in the documentary. The seven people he saved also gave interviews. One of them — a woman who lost her husband at that same checkpoint — said she doesn't know what to feel about his choice. "He saved me. He didn't save Joseph." The documentary ends on that. Webb's face when he hears it. He's watched that clip once. That was enough.

The documentary aired in eight countries. The reviews called it "morally complex" and "unflinching." The woman's quote — about being saved while her husband wasn't — became the most-cited line. Webb's daughter asked him about it. He said the woman was right. His daughter asked if he regretted saving her. He said no. She asked if he regretted not saving more. He said yes. She asked how he lives with that. He said he doesn't know yet.

The seven people he saved have their own lives now. Three of them testified at the ICTR. One works for a survivor organization in Kigali. One lives in Brussels. One died in 2003. Webb went to that funeral. The family thanked him for the extra nine years. He didn't know what to say to that. The documentary didn't resolve anything. It made the complexity public. He carries that forward.`
  },

  {
    id: "rw-un-outcome-savers-private-survived",
    survived: true,
    conditions: {
      rw_saved_rwandans: true,
      rw_defied_orders: true,
      rw_left_rwanda: true
    },
    epilogue: `He declined the documentary. The seven people he saved have their own stories. He doesn't need to be in them. He and one of them — the woman with the child, now grown — exchange letters every year. Not about 1994. About her daughter's school results, about his retirement, about the price of things. Ordinary letters. That's the relationship. He's glad the documentary doesn't have it.

The woman's daughter is twenty-three now. She's studying international law at the University of Rwanda. She wants to work for the ICTR successor mechanism. The woman wrote that her daughter exists because Webb loaded them onto the convoy. He wrote back that her daughter exists because her mother survived, and that survival is its own achievement. The woman wrote back that both things are true. He keeps that letter.

His advocacy is private. He testifies to closed committees. He writes policy briefs. He funds peacekeeping reform organizations. Nobody films it. The seven people he saved know what he does. That's enough witnesses. He didn't save everyone at the checkpoint. He saved seven. The woman's daughter is studying law. That's a consequence that extends. He carries that forward.`
  },

  {
    id: "rw-un-outcome-savers-policy-survived",
    survived: true,
    conditions: {
      rw_saved_rwandans: true,
      rw_defied_orders: true,
      rw_left_rwanda: true,
      rw_participated_policy_focus: true,
      rw_forward_looking: true
    },
    epilogue: `He participated in the documentary but made it about the mandate. "The system told me to leave Rwandans behind. I didn't, and I was reprimanded. That's the problem I want to talk about." The seven people he saved appreciated this framing. It made their survival about injustice rather than luck. Whether that's honest or a kind of management, he isn't certain.

The documentary focused on the mandate failure. The evacuation orders. The "foreign nationals only" directive. The reprimand he received for loading Rwandans. The Responsibility to Protect doctrine that came eleven years later. The interviewer asked about the seven people. He redirected to the eight hundred thousand. The interviewer asked about his choice. He redirected to the mandate that forced it. The reviews said it was "policy-focused" and "less personal than expected." That was intentional.

The seven people he saved have mixed feelings about this approach. One of them said in a separate interview that Webb "turned us into a policy argument." Another said, "He saved us and then made sure the next peacekeeper wouldn't have to make that choice. Both things matter." Webb watched that interview. He's not sure which person is right. He knows the mandate changed. He knows seven people are alive. He carries both things forward.`
  },

  // EVACUATED PATH - SAVED RWANDANS, RETURNED TO DOCUMENT - Aftermath variants
  {
    id: "rw-un-outcome-savers-docs-full-survived",
    survived: true,
    conditions: {
      rw_documented_evidence: true,
      rw_returned_to_duty: true
    },
    epilogue: `He saved seven people from the convoy and then went back and documented what he couldn't stop. The ICTR used his evidence in four cases. He testified fully — named names, gave dates, described what he saw at specific sites on specific days. His deposition runs to 340 pages. He's never read it in full. He knows what's in it.

The seven people he saved attended the tribunal. They sat in the gallery when he testified. One of them told him afterward, "You saved us and then you made sure they'd be held accountable. Both things mattered." He's not sure about that equation. He saved seven. He documented evidence that helped convict four perpetrators. Eight hundred thousand people died. The math doesn't resolve. But the tribunal happened. The convictions happened. The seven people are alive. Those are facts.

Dallaire wrote about peacekeepers who stayed to document. He said they carried an impossible burden — witnessing atrocities they couldn't stop, gathering evidence for justice that came too late. Webb's testimony is cited in three separate ICTR judgments. His photographs are in the Kigali Genocide Memorial. The seven people he saved have children now. He carries all of it forward.`
  },

  {
    id: "rw-un-outcome-savers-docs-careful-survived",
    survived: true,
    conditions: {
      rw_documented_evidence: true,
      rw_returned_to_duty: true,
      rw_testified_carefully: true,
      rw_protected_sources: true
    },
    epilogue: `He testified carefully — gave what the tribunal needed without exposing the Rwandans who'd helped him document. Some of those sources were still living in communities alongside perpetrators. Full disclosure would have endangered them. The judges accepted this. Three convictions, no compromised sources. Whether that balance was right is a question he revisits.

The seven people he saved understood the calculation. One of them had been a source — had given him names, locations, details that went into his reports. That person's family still lives in Kigali. Webb's careful testimony protected them. But it also meant some perpetrators couldn't be fully placed at specific sites. The tribunal accepted the limitation. The defense attorneys exploited it. Three convictions. Two acquittals. He knows which two.

His therapist asked if he regrets the careful approach. He said he regrets the choice existing. The sources trusted him. He protected them. The perpetrators who were acquitted are free. The sources are alive. Both things are true. The seven people he saved have told him the careful testimony was right. He's not sure they're the right judges of that. He carries the question forward.`
  },

  {
    id: "rw-un-outcome-savers-docs-silent-survived",
    survived: true,
    conditions: {
      rw_documented_evidence: true,
      rw_returned_to_duty: true,
      rw_submitted_evidence: true,
      rw_avoided_testimony: true
    },
    epilogue: `He submitted the evidence and didn't testify in person. The ICTR accepted the documentation. Two convictions followed from it. He watched the verdict announcements on a television in a hotel room in Geneva. He was there for a different UN meeting. That seemed appropriate somehow — the verdict happening in a margin of something else he was already doing.

The seven people he saved asked why he didn't testify. He said the evidence spoke for itself. They said his presence would have mattered. He said his presence in 1994 was what mattered — he was there, he documented, the photographs and reports exist independent of his testimony. They weren't satisfied with that answer. Neither is he. But the convictions happened. The evidence was sufficient. His voice wasn't required.

His therapist suggested the avoided testimony was about protecting himself from re-traumatization. He said it was about trusting the documentation over his memory. Both things might be true. The seven people he saved are alive. The two perpetrators are in prison. The evidence existed without his voice. Whether that's sufficient is a question he carries forward.`
  },

  {
    id: "rw-un-outcome-saved-rwandans-killed",
    survived: false,
    conditions: {
      rw_saved_rwandans: true,
      rw_defied_orders: true
    },
    deathContext: {
      cause: "Killed during the genocide after defying orders to protect Rwandan civilians",
      historicalRate: "Some peacekeepers who defied orders to protect civilians were killed during confrontations with militia",
      yourChoices: "You loaded Rwandan civilians onto the evacuation convoy. The militia confronted you."
    },
    deathEpilogueEarly: `You didn't survive. You loaded Rwandans onto the convoy. The militia saw what you were doing. You were killed at that roadblock in April 1994, during the first weeks of the genocide. You died trying to protect civilians you were explicitly ordered to leave behind.

Your death occurred during the hundred days, before the RPF captured Kigali. The UN investigated later. The report noted that you had violated your mandate and been killed as a result. It also noted that you had attempted to protect civilians in a situation where protection was explicitly prohibited. Both things were recorded. Neither resolved the other.

Canada gave you a posthumous commendation. Your family received it. Dallaire spoke at a memorial service and said your name alongside the ten Belgians killed on April 7th. He said the genocide produced too many names like yours — people who tried to act within a system designed to prevent action. You carried that choice to the end. Some of the people you tried to save survived. Some didn't. You died trying.`,
    epilogue: `You didn't survive. You loaded Rwandans onto the convoy. The militia saw what you were doing. Whether you were killed at that roadblock, during a subsequent confrontation, or in the violence that followed your defiance of orders, you died trying to protect civilians you were explicitly ordered to leave behind.

The UN investigated. The report noted that you had violated your mandate and been killed as a result. It also noted that you had attempted to protect civilians in a situation where protection was explicitly prohibited. Both things were recorded. Neither resolved the other.

Canada gave you a posthumous commendation. Your family received it. Dallaire spoke at a memorial service and said your name alongside the ten Belgians killed on April 7th. He said the genocide produced too many names like yours — people who tried to act within a system designed to prevent action. You carried that choice to the end. Some of the people you tried to save survived. Some didn't. You died trying.`
  },

  {
    id: "rw-un-outcome-mandate-held-killed",
    survived: false,
    conditions: {
      rw_protected_hotel: true
    },
    deathContext: {
      cause: "Killed during the genocide while following mandate to protect civilians",
      historicalRate: "Some peacekeepers who remained to protect civilians were killed during militia attacks on protected sites",
      yourChoices: "You followed your mandate and held position at the hotel. The militia attacked."
    },
    deathEpilogueEarly: `You didn't survive. You followed your orders exactly — held position, protected the designated safe zone, did not defy the mandate. When the Security Council cut UNAMIR to 270 soldiers and your detachment was reduced, you stayed at the gate. You'd done everything correctly within the rules you were given.

You were killed in June or July 1994 during a militia assault on the hotel, before the RPF captured Kigali and the genocide ended. You died following the mandate you were given. The mandate was inadequate. You followed it anyway. That's what soldiers do.

Canada gave you a posthumous service medal. The UN noted your compliance with the mandate in its post-genocide review — the same review that concluded the mandate itself had been inadequate. You followed the rules. The rules were wrong. Both things are recorded in the same document. Dallaire wrote later that the soldiers who died in Rwanda following their mandates deserved better mandates. He was right. You were one of the people he was writing about.`,
    epilogue: `You didn't survive. You followed your orders exactly — held position, protected the designated safe zone, did not defy the mandate. When the Security Council cut UNAMIR to 270 soldiers and your detachment was reduced, you stayed at the gate. You'd done everything correctly within the rules you were given.

Whether you were killed during a militia assault, in an ambush, or in the chaos of the genocide's final weeks, you died following the mandate you were given. The mandate was inadequate. You followed it anyway. That's what soldiers do.

Canada gave you a posthumous service medal. The UN noted your compliance with the mandate in its post-genocide review — the same review that concluded the mandate itself had been inadequate. You followed the rules. The rules were wrong. Both things are recorded in the same document. Dallaire wrote later that the soldiers who died in Rwanda following their mandates deserved better mandates. He was right. You were one of the people he was writing about.`
  },

  {
    id: "rw-un-outcome-evacuated-killed",
    survived: false,
    conditions: {
      rw_evacuated_expatriates: true,
      rw_left_rwandans: true
    },
    deathContext: {
      cause: "Killed during the evacuation operation",
      historicalRate: "Several evacuation convoys were stopped and threatened by militia during the withdrawal from Rwanda",
      yourChoices: "You followed orders and evacuated expatriates only. The operation turned deadly."
    },
    deathEpilogueEarly: `You didn't survive. You followed your orders. Foreign nationals only — no Rwandans. You left the people at the checkpoint behind. The woman with the child. The embassy workers. You were killed at a roadblock during the evacuation in April 1994, during the first weeks of the genocide. You died following orders that asked you to prioritize certain lives over others.

Your death occurred during the hundred days, before the RPF captured Kigali. The foreign nationals you were protecting made it to the airport. They went home. They were debriefed. Some of them testified later about what they saw during the evacuation — the roadblocks, the bodies, the people left behind at checkpoints. They mentioned peacekeepers who died protecting them. Your name is in those depositions.

You followed your orders to the end. The orders asked you to prioritize certain lives over others. You did. Then you died doing it. The gap between those two facts is what the subsequent inquiries spent years trying to understand. Canada gave you a posthumous medal. Your family received it. The people at the checkpoint you left behind are also names now.`,
    epilogue: `You didn't survive. You followed your orders. Foreign nationals only — no Rwandans. You left the people at the checkpoint behind. The woman with the child. The embassy workers. Whether you were killed at a roadblock during the evacuation, in an ambush, or in the violence that followed, you died following orders that asked you to prioritize certain lives over others.

The foreign nationals you were protecting made it to the airport. They went home. They were debriefed. Some of them testified later about what they saw during the evacuation — the roadblocks, the bodies, the people left behind at checkpoints. They mentioned peacekeepers who died protecting them. Your name is in those depositions.

You followed your orders to the end. The orders asked you to prioritize certain lives over others. You did. Then you died doing it. The gap between those two facts is what the subsequent inquiries spent years trying to understand. Canada gave you a posthumous medal. Your family received it. The people at the checkpoint you left behind are also names now.`
  },

  {
    id: "rw-un-outcome-documented-killed",
    survived: false,
    conditions: {
      rw_documented_evidence: true
    },
    deathContext: {
      cause: "Killed during the genocide while documenting atrocities",
      historicalRate: "Journalists and peacekeepers who stayed to document the genocide faced significant danger, and several were killed",
      yourChoices: "You stayed to document what was happening. You sent reports to New York. The militia viewed your documentation as a threat."
    },
    deathEpilogueEarly: `You didn't survive. You stayed. You documented. You sent the reports — photos, testimony, names, dates, the specific language the militia commanders used when they thought no one official was listening. You sent them to Dallaire, to New York, to the media contacts you had. The world received your reports and debated their implications while you were still in the field generating more of them.

You were killed in June or July 1994 at a massacre site you were documenting, before the RPF captured Kigali and the genocide ended. Your presence as a witness was viewed as a threat. You died gathering evidence during the hundred days.

Your documentation survived you. The photos you took were entered into evidence at the ICTR later. The reports you filed are in the UN archives. Three militia leaders were convicted partly on the basis of evidence you collected. You didn't live to testify. Your camera did it for you. Dallaire cited your work specifically in his memoir — not your name, because your family asked for privacy, but your work. The evidence existed. The convictions followed. You were the reason.`,
    epilogue: `You didn't survive. You stayed. You documented. You sent the reports — photos, testimony, names, dates, the specific language the militia commanders used when they thought no one official was listening. You sent them to Dallaire, to New York, to the media contacts you had. The world received your reports and debated their implications while you were still in the field generating more of them.

Whether you were killed at a specific site you were documenting, during an ambush, or in the violence that followed, your presence as a witness was viewed as a threat. You died gathering evidence.

Your documentation survived you. The photos you took were entered into evidence at the ICTR. The reports you filed are in the UN archives. Three militia leaders were convicted partly on the basis of evidence you collected. You didn't live to testify. Your camera did it for you. Dallaire cited your work specifically in his memoir — not your name, because your family asked for privacy, but your work. The evidence existed. The convictions followed. You were the reason.`
  },


];

// Export role data
export default {
  scenes: unPeacekeeperScenes,
  outcomes: unPeacekeeperOutcomes
};
