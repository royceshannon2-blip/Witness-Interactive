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
    epilogue: `You survived. You explicitly defied New York's evacuation order, refusing to abandon the Hôtel des Mille Collines. Alongside your skeleton crew and the negotiations of Rusesabagina, you stared down the Interahamwe militia for weeks until the RPF captured Kigali, ensuring all twelve hundred refugees survived.

In 2008, you traveled to Ottawa and testified publicly at the Canadian inquiry, detailing exactly how the UN's "monitor and report" rules enabled a massacre. General Dallaire’s book cited you, and the UN called you a hero. Your public testimony forced international policy to reckon with your defiance. You carry both the twelve hundred lives you saved and the guilt of those you couldn't.`
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
    epilogue: `You survived. You explicitly defied New York's evacuation order, refusing to abandon the Hôtel des Mille Collines. When Dallaire's voice came over the radio signaling the UN withdrawal, you looked at the Interahamwe waiting to massacre twelve hundred people, and you refused to leave.

By 2008, when the Canadian government called you to Ottawa to testify about your actions, you declined. The PTSD and nightmares outweighed the heroism of saving the hotel. Your therapist agreed it was the right choice. You don't need to sit in front of a committee to know that those twelve hundred people lived because you ignored the rules. That private truth is enough.`
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
    epilogue: `You survived. You explicitly defied New York's evacuation order, refusing to abandon the Hôtel des Mille Collines. You and your eight peacekeepers held the line against the militia until the RPF arrived, ensuring twelve hundred refugees walked out alive.

When the Canadian inquiry called you in 2008, you gave a private deposition—on the record, but safe from the media glare. You explained exactly how you relied on Rusesabagina's bribes and sheer bluffing to keep the militia back. You avoided the spotlight, preferring the quiet knowledge that you told the truth to the people who could actually change the rules for the next generation of peacekeepers.`
  },

  {
    id: "rw-un-outcome-mandate-spoke-survived",
    survived: true,
    conditions: {
      rw_followed_mandate: true,
      rw_protected_hotel: true,
      rw_spoke_publicly: true,
      rw_honored_survivors: true
    },
    epilogue: `You survived. You initially followed Dallaire's mandate, holding the Hôtel des Mille Collines while Rusesabagina negotiated. When the attack finally seemed imminent and you had only four peacekeepers left, you drew the line and held position at all costs until the RPF arrived. 

In 2010, you returned to Kigali. Standing at the hotel where you once faced down the militia commander, you spoke publicly at the memorial ceremony. You acknowledged the failure of the "monitor and report" mandate, and you honored the twelve hundred who lived because, at the final hour, you did what was right instead of what was ordered.`
  },

  {
    id: "rw-un-outcome-mandate-silent-survived",
    survived: true,
    conditions: {
      rw_followed_mandate: true,
      rw_protected_hotel: true,
      rw_attended_silently: true,
      rw_centered_survivors: true
    },
    epilogue: `You survived. You held the Hôtel des Mille Collines, strictly following the mandate until it became clear doing so meant slaughter. Then, alongside a skeleton crew of four peacekeepers, you held the line at all costs until the RPF arrived in July.

When you returned to Kigali in 2010 for the memorial ceremony, you declined to speak. You watched the survivors who once sheltered behind your UN flag tell their own stories. You stood silently in the crowd, centering their grief and resilience, finding peace in the fact that they were alive to speak for themselves.`
  },

  {
    id: "rw-un-outcome-mandate-private-survived",
    survived: true,
    conditions: {
      rw_followed_mandate: true,
      rw_protected_hotel: true,
      rw_met_privately: true,
      rw_avoided_ceremony: true
    },
    epilogue: `You survived. You held the Hôtel des Mille Collines, strictly following the mandate until it became clear doing so meant slaughter. Then, alongside a skeleton crew of four peacekeepers, you held the line at all costs until the RPF arrived in July.

When you returned to Kigali in 2010, you avoided the public memorial ceremony entirely. Instead, you met privately with the survivors who once sheltered behind your UN flag. You didn't want the applause of the government or the cameras; you simply wanted to look the people you protected in the eye. You shared tears in private, honoring the fact that they survived the nightmare.`
  },

  {
    id: "rw-un-outcome-evacuated-documentary-survived",
    survived: true,
    conditions: {
      rw_evacuated_expatriates: true,
      rw_left_rwandans: true,
      rw_left_rwanda: true,
      rw_participated_documentary: true,
      rw_shared_guilt: true
    },
    epilogue: `You survived. You followed orders, escorting the convoy of Americans and Europeans to the airport. You stared into the eyes of the Rwandan woman holding her child at the roadblock, pleading for you to take them, and you left her behind. You flew back to Canada safe.

In 2006, haunted by the faces at that checkpoint, you sat down with a documentary filmmaker and confessed to the world that you abandoned the embassy workers to the Interahamwe because New York told you to. Your raw, public guilt exposed the fatal flaw of international peacekeeping. You couldn't save the Rwandans at the checkpoint, but you spent the rest of your life making sure the world knew exactly how they were abandoned.`
  },

  {
    id: "rw-un-outcome-evacuated-private-survived",
    survived: true,
    conditions: {
      rw_evacuated_expatriates: true,
      rw_left_rwandans: true,
      rw_left_rwanda: true,
      rw_declined_documentary: true,
      rw_private_advocacy: true
    },
    epilogue: `You survived. You followed your orders to the letter, escorting the expatriates to the airport while leaving the desperate Rwandan embassy workers and the woman with her child at the militia roadblock. You boarded the plane home and lived.

By 2006, the guilt drove you to become a private advocate for peacekeeping reform. When the documentary filmmaker called, you declined. You chose instead to funnel your grief into closed-door committees, arguing fiercely for mandates that would never again force a soldier to abandon civilians. Your private advocacy ensured that the deadly failure of your specific convoy would never be repeated.`
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
    epilogue: `You survived. You followed your orders, escorting the expatriates to the airport while leaving the desperate Rwandan embassy workers and the woman with her child at the militia roadblock. You boarded the plane home and lived.

When the documentary filmmaker called in 2006, you agreed to participate, but you refused to focus on your personal guilt. Instead, you coldly detailed the structural failure of the UN mandate that forced you to abandon the Rwandans at that checkpoint. You didn't bleed for the cameras; you used your experience to ruthlessly dismantle the logic of the "monitor and report" doctrine for the historical record.`
  },

  {
    id: "rw-un-outcome-documented-full-survived",
    survived: true,
    conditions: {
      rw_sent_genocide_fax: true,
      rw_documented_evidence: true,
      rw_continued_documentation: true,
      rw_testified_tribunal: true,
      rw_provided_evidence: true
    },
    epilogue: `You survived. While the UN debated the definition of "acts of genocide," you stayed at the church where hundreds were massacred. You raised your camera and documented the blood, the grenades, and the specific militia commanders who thought they had impunity. 

In 2012, you took the stand at the International Criminal Tribunal in The Hague. You stared directly at the man who organized that church massacre and provided every detail, photograph, and specific name from your notebook. Because you stayed to be a witness when New York refused to act, your camera secured the convictions of the men responsible. You used your trauma as a weapon for justice.`
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
    epilogue: `You survived. You stayed at the massacred church, holding your camera steady while the Interahamwe slaughtered hundreds. You gathered the grim evidence, sending it straight to Dallaire and the global media to build a historical record.

When called to The Hague in 2012, you testified, but you carefully withheld specific details that would identify the Rwandan sources who helped you gather evidence. While protecting your sources meant some men were acquitted, your core documentation still sent the primary architects of the church massacre to prison. You navigated the impossible balance of achieving international justice while fiercely protecting the vulnerable informants who trusted you.`
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
    epilogue: `You survived. You stayed at the massacred church, holding your camera steady while the Interahamwe slaughtered hundreds. You gathered the grim evidence, sending it straight to Dallaire and the global media to build a historical record.

When called to The Hague in 2012, you submitted your photos and notebooks to the prosecutors but refused to testify in person. You let the photographs of the church massacre speak for themselves. The physical evidence you gathered while defying the UN's inaction was enough to secure convictions, allowing you to achieve justice without repeatedly breaking yourself on the witness stand.`
  },

  {
    id: "rw-un-outcome-savers-documentary-survived",
    survived: true,
    conditions: {
      rw_evacuated_expatriates: true,
      rw_saved_rwandans: true,
      rw_returned_to_duty: true,
      rw_testified_tribunal: true
    },
    epilogue: `You survived. After defying orders to smuggle Rwandans onto the expatriate convoy at the risk of everyone's lives, you dropped them at the airport and refused to board the plane home. You returned to General Dallaire's skeleton crew in Kigali, grabbed your camera, and spent the rest of the genocide documenting the massacres. 

Years later at the Hague, you testified fully about what you had seen. The Rwandans you smuggled past that militia commander lived to see the men you documented go to prison based on your 340-page deposition. You carried the impossible burden of having saved a few while watching thousands die, but your decision to return to the fire ensured that both your defiance and your evidence changed history.`
  },

  {
    id: "rw-un-outcome-savers-careful-survived",
    survived: true,
    conditions: {
      rw_evacuated_expatriates: true,
      rw_saved_rwandans: true,
      rw_returned_to_duty: true,
      rw_testified_carefully: true
    },
    epilogue: `You survived. After defying orders to smuggle Rwandans onto the expatriate convoy, you dropped them at the airport and returned to General Dallaire's skeleton crew in Kigali. You spent the rest of the genocide documenting the massacres. 

Years later at the Hague, you testified carefully, strictly protecting the Rwandan informants who had helped you map the violence. The people you smuggled past the militia commander at the convoy checkpoint lived because of your defiance. Your careful testimony resulted in fewer total convictions, but you ensured that the vulnerable people who trusted you were protected from retaliation.`
  },

  {
    id: "rw-un-outcome-savers-submitted-survived",
    survived: true,
    conditions: {
      rw_evacuated_expatriates: true,
      rw_saved_rwandans: true,
      rw_returned_to_duty: true,
      rw_submitted_evidence: true
    },
    epilogue: `You survived. After defying orders to smuggle Rwandans onto the expatriate convoy, you dropped them at the airport and returned to General Dallaire's skeleton crew in Kigali. You spent the rest of the genocide documenting the massacres. 

Years later at the Hague, you submitted your physical evidence but refused to testify in person. The people you smuggled past the militia commander at the convoy checkpoint lived because of your defiance, and the photos you took during your return to duty were enough to secure convictions. You let your actions and your camera speak for you.`
  },

  // DEATH OUTCOMES (Occurring BEFORE post-genocide inquiries)
  {
    id: "rw-un-outcome-stayed-killed",
    survived: false,
    conditions: {
      rw_stayed_after_withdrawal: true,
      rw_defied_orders: true,
      rw_saved_civilians: false
    },
    deathContext: {
      cause: "Killed defending civilians after defying UN withdrawal orders",
      historicalRate: "Ten Belgian peacekeepers were killed on the first day; others survived only by avoiding direct combat or negotiating",
      yourChoices: "You defied Dallaire's warning and the UN withdrawal order to stay at the Hôtel des Mille Collines. The militia eventually overwhelmed your position."
    },
    deathEpilogueEarly: `You didn't survive. You defied New York's orders and Dallaire's warning, choosing to stay with your eight peacekeepers at the Hôtel des Mille Collines to protect the twelve hundred refugees inside. 

But without reinforcements, your blue helmet couldn't keep the Interahamwe commander at bay forever. The militia's patience ran out before the RPF could arrive. You were killed defending the perimeter of the hotel in a direct assault during the 100 days of genocide. Canada awarded you a posthumous medal, and you died exactly as General Dallaire later wrote that UNAMIR should have acted: choosing protection over politics.`
  },

  {
    id: "rw-un-outcome-evacuated-killed",
    survived: false,
    conditions: {
      rw_evacuated_expatriates: true,
      rw_saved_rwandans: true
    },
    deathContext: {
      cause: "Killed while attempting to evacuate Rwandans against orders",
      historicalRate: "Militias strictly enforced the separation of foreign nationals from Tutsi targets; intervening risked the entire convoy",
      yourChoices: "You defied your mandate to only evacuate foreign nationals. The militia at the checkpoint discovered the Rwandans and attacked."
    },
    deathEpilogueEarly: `You didn't survive. At the checkpoint on the way to the airport, you looked at the Rwandan woman holding her child and the terrified embassy workers, and you defied your orders. You loaded them onto the expatriate convoy. 

The militia commander saw what you did. By breaking the unwritten rule that gave UN vehicles immunity—that you would only save white foreigners—you sacrificed yourself. You were killed at that roadblock during the first weeks of the genocide alongside the Rwandans you tried to save. You refused to accept a mandate that valued some lives more than others, and the Interahamwe killed you for it.`
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
      yourChoices: "You stayed at the church to photograph the massacre. The militia viewed your documentation as a threat."
    },
    deathEpilogueEarly: `You didn't survive. You drove to the church, heard the screams and the grenades, and instead of driving away to safety, you raised your camera. You documented the faces of the Interahamwe commanders as they slaughtered hundreds of people.

But witnesses are dangerous to perpetrators. Realizing you were gathering evidence of their war crimes, the militia turned on your UN vehicle. You were killed during the 100 days of the genocide, dying with your camera and notebook in hand. However, when the RPF secured the area, your photographs were recovered. Years later, Dallaire and the ICTR used the very images you died capturing to secure convictions.`
  }
];
// Export role data
export default {
  scenes: unPeacekeeperScenes,
  outcomes: unPeacekeeperOutcomes
};
