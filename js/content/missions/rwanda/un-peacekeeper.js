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

Your mandate is clear: peacekeeping, not peace enforcement. You can't fire unless fired upon. You can't protect civilians unless they're in designated safe zones. But civilians are being killed at roadblocks three blocks from here. The radio crackles. Three options. The Hôtel des Mille Collines is requesting protection—twelve hundred Tutsi sheltering there. Or evacuate foreign nationals as ordered. Or stay mobile, document what's happening, send evidence to New York. Fifteen seconds to decide.`,
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
    narrative: `2006. Toronto, Canada. Twelve years later. You completed your evacuation orders and left Rwanda. Whether you followed the mandate at every checkpoint or broke it at one of them, you boarded a plane and went home. You filed your report. You did your job — or the parts of it you could live with.

But the faces stay. The woman with the child. The embassy workers at the checkpoint. Whatever choice you made at that roadblock, you know what happened to the people on the other side of it. Some peacekeepers carry guilt for leaving. Some carry a different weight for what breaking the rule cost them and others. Most who went home carry something.

You have PTSD. Nightmares. Your therapist says you made the choices available to you. Your family says you did what you could. You're not sure either framing is right. You've become an advocate — op-eds, university talks, pushing for stronger mandates. "Never again" means nothing if we don't act. But it doesn't change what happened at that checkpoint.

A documentary filmmaker wants to interview you. To tell your story. To show what the mandate actually required of individual officers. Do you participate?`,
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
    epilogue: `You survived. When Dallaire's radio crackle signaled the UN withdrawal and the militia commander outside the Hôtel des Mille Collines smiled at the news, you refused to leave. You held the hotel with eight peacekeepers against the surrounding Interahamwe, relying on your blue helmets, Rusesabagina's bribes, and the militia's uncertainty, until the RPF captured Kigali and all twelve hundred refugees walked out alive.

In 2008, you traveled to Ottawa and testified publicly at the Canadian government's Rwanda inquiry. You described exactly how the "monitor and report" mandate had functioned as permission for a genocide — how New York's word choice of "acts of genocide" instead of "genocide" was not semantics but policy, and how you defied that policy with eight peacekeepers and a UN flag. General Dallaire cited your account in his own testimony. Your public record of that defiance became part of the formal argument for reforming peacekeeping mandates. You carry the twelve hundred who survived and the hundreds of thousands you couldn't reach, and you gave the inquiry both.`
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
    epilogue: `You survived. When the withdrawal order came and the militia commander smiled at the news, you stayed. Eight peacekeepers. Twelve hundred refugees. You held the Hôtel des Mille Collines against the Interahamwe until the RPF arrived, relying on blue helmets, Rusesabagina's negotiations, and the militia's unwillingness to test you directly. Every one of the twelve hundred walked out.

When the Canadian inquiry called you to Ottawa in 2008, you declined. The PTSD and the nightmares and the weight of the faces you couldn't save at sites beyond the hotel perimeter — it was not something you could organize into testimony for a committee. Canada had given you a medal; Dallaire had written about you. The record existed. What you needed was not another room full of people asking you to describe the smell of smoke and the sound of machetes. You chose your own healing over another public reckoning, and the twelve hundred who lived because you stayed were sufficient evidence that the choice you made at that hotel was right.`
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
    epilogue: `You survived. You refused the UN's withdrawal order, held the Hôtel des Mille Collines with eight peacekeepers against the surrounding Interahamwe, and kept all twelve hundred refugees alive until the RPF captured Kigali. Canada gave you a medal. New York was furious. You didn't care about either.

When the Canadian inquiry called in 2008, you gave a private deposition — on the record, available to policymakers, but closed to media. You described exactly how you and Rusesabagina had bluffed the militia commander day after day, how the UN's mandate had created a legal structure that functioned as permission for the genocide, and what it had actually required to hold a perimeter with eight people against a crowd that knew reinforcements weren't coming. You told the truth to the people who could change the rules for the next generation of peacekeepers, without turning your defiance into a press tour.`
  },

  {
    id: "rw-un-outcome-mandate-spoke-survived",
    survived: true,
    conditions: {
      rw_followed_mandate: true,
      rw_protected_hotel: true,
      rw_held_position: true,
      rw_spoke_publicly: true,
      rw_honored_survivors: true
    },
    epilogue: `You survived. You followed Dallaire's mandate, holding the Hôtel des Mille Collines while Rusesabagina negotiated and bribed. When the full withdrawal came and you were reduced to four peacekeepers, you held position at all costs as the militia massed outside. You held until the RPF arrived. Every one of the twelve hundred refugees walked out of the hotel.

In 2010, you returned to Kigali for the first time since July 1994. You stood in the hotel where you had once watched the militia commander measure your resolve every morning, and you spoke at the memorial ceremony. You described what the "monitor and report" mandate had actually meant in practice — how you had followed it as long as you could and then held the line when following it would have meant massacre. You acknowledged the failure of the system that put four peacekeepers between twelve hundred people and the Interahamwe. You honored the survivors who were alive to hear you say it.`
  },

  {
    id: "rw-un-outcome-mandate-silent-survived",
    survived: true,
    conditions: {
      rw_followed_mandate: true,
      rw_protected_hotel: true,
      rw_held_position: true,
      rw_attended_silently: true,
      rw_centered_survivors: true
    },
    epilogue: `You survived. You held the Hôtel des Mille Collines on Dallaire's mandate until the mandate ran out, then held it with four peacekeepers at all costs until the RPF arrived. Every one of the twelve hundred refugees survived. You followed orders until orders required abandoning people to be killed, and then you held.

In 2010, you returned to Kigali and attended the memorial ceremony at the hotel. You did not speak. The survivors who had sheltered behind your UN flag for three months told their own stories — what the wait felt like, what the chanting outside sounded like, what it meant when they watched you stay when the other peacekeepers left. You stood in the back of the crowd and listened. The twelve hundred were alive to speak for themselves. That was what you had stayed for. It remained enough.`
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
    epilogue: `You survived. You held the Hôtel des Mille Collines under Dallaire's mandate until four peacekeepers were all that remained, then held at all costs until the RPF arrived and the twelve hundred refugees walked out alive.

In 2010, you came back to Kigali but avoided the government ceremony entirely. Instead you met privately with a group of the survivors — in a conference room of the hotel itself, the same room where thirty people had once slept on the floor. No cameras. No speeches. No officials. A woman whose children you had watched play in the hotel hallway for three months shook your hand and thanked you and cried. You thanked her for surviving. You had not held that hotel for the government's ceremony or the UN's record. You held it for the people in that room. You wanted to see them in person, not from a stage.`
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
    epilogue: `You survived. You ran the evacuation convoy to the airport, following your orders. At the checkpoint along the route, the woman holding her child and the embassy workers who had spent years working alongside the people you were protecting — you looked at them and drove past. You followed the mandate: foreign nationals only. You boarded a plane to Canada and filed your report.

In 2006, haunted by that checkpoint, you sat down with a documentary filmmaker and said it plainly on camera: you abandoned them because New York told you to, and you did it, and they died. Not because you had no choice, but because you made the choice that kept the convoy safe and left the Rwandans at the roadblock. Your raw public accounting of that moment — not justified, not explained away — exposed the operational logic of the UN's "foreign nationals only" order as a policy that decided some lives mattered more than others. You spent the rest of your life making sure that specific decision, at that specific checkpoint, was part of the historical record.`
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
    epilogue: `You survived. You drove the evacuation convoy to the airport and followed your orders at the checkpoint — foreign nationals only, no Rwandans, move the convoy. The woman with the child and the embassy workers who begged to board were still standing there when you pulled away. You boarded the plane. You filed your report.

By 2006, you had become a private advocate for peacekeeping reform — closed-door committee testimony, policy papers, back-channel briefings to officers being deployed to future missions. When the documentary filmmaker called, you declined. You were not interested in performing your guilt for a camera. You were interested in making sure that no future convoy commander would be given orders that required them to drive past a woman holding a child and call it a mandate. The faces at that checkpoint drove you into rooms where policy was made, not onto screens.`
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
    epilogue: `You survived. You ran the convoy to the airport, followed the mandate at the checkpoint, and left the Rwandans behind. You boarded the plane. You went home. You did your job exactly as ordered.

When the documentary filmmaker called in 2006, you agreed to participate on one condition: you would not perform personal guilt. Instead, you delivered a cold, precise account of the structural failure — how the UN's "foreign nationals only" order functioned at an operational checkpoint, what choices it created for convoy commanders, and what it required them to do in practice. You did not bleed for the cameras. You used your presence in that documentary to dismantle the logic of the mandate itself: the specific sequence of decisions at the institutional level that made your specific decision at that specific checkpoint the only available option. You let the policy bear the weight rather than the person who carried it out.`
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
    epilogue: `You survived. You stayed at the church when the militia told you to leave. You raised your camera while they were still moving through the congregation and photographed the commanders who believed they had impunity. You spent the rest of the genocide documenting roadblocks, mass graves, RTLM broadcast locations, and the chain of command that organized it all — sending reports to Dallaire and the media while New York chose the phrase "acts of genocide" to avoid triggering the Genocide Convention.

In 2012, you took the stand at the International Criminal Tribunal in The Hague. You stared at the man who had organized the church massacre and delivered every photograph, every name from your notebook, and every timestamp from your field reports. Your documentation was the evidentiary spine of the prosecution. The conviction required a witness who had been there and stayed. Because you raised a camera instead of driving away, the men who ordered those massacres were held accountable in an international court of law.`
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
    epilogue: `You survived. You stayed at the church, photographed the commanders, and spent the genocide documenting massacres and sending evidence to Dallaire and the international press. You built a case while New York debated word choice and the killing continued.

At The Hague in 2012, you testified carefully — providing every photograph and every date from your notebook, but withholding the specific identities of the Rwandan informants who had helped you map the command structure. Your caution meant some secondary figures were acquitted for lack of direct evidence. The primary architects of the church massacre were convicted. You navigated the impossible calculation of international justice: the more evidence you gave, the more you exposed the people who had trusted you. You chose to protect them and accepted the incomplete verdict that followed.`
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
    epilogue: `You survived. You stayed at the church, raised your camera, and documented the genocide from inside it — photographs, field notes, command structure maps, broadcast records — sending reports to Dallaire and the press while the world watched and debated.

At The Hague in 2012, you submitted your complete archive of photographs and notebooks to the prosecution and declined to testify in person. The physical evidence you had gathered while defying the UN's inaction was sufficient. The church massacre conviction rested on your photos and timestamped field reports. You did not need to reenter that courtroom and relive each frame through cross-examination to achieve the outcome. You let the camera's record stand for itself — which is what you had intended when you raised it.`
  },

  {
    id: "rw-un-outcome-savers-full-survived",
    survived: true,
    conditions: {
      rw_evacuated_expatriates: true,
      rw_saved_rwandans: true,
      rw_returned_to_duty: true,
      rw_testified_tribunal: true,
      rw_provided_evidence: true
    },
    epilogue: `You survived. At the checkpoint on the way to the airport, you looked at the woman holding her child and loaded her and the embassy workers onto the convoy against your orders, gambling that the militia commander wouldn't stop a UN vehicle over a few extra passengers. You dropped them at the airport and refused to board the plane home. You drove back to Dallaire's skeleton crew in Kigali, picked up your camera, and spent the rest of the genocide documenting the massacres.

At The Hague in 2012, you gave a full deposition: every photograph, every name from your notebook, every timestamp. The Rwandans you had smuggled past the militia checkpoint lived to see the church massacre commanders convicted on the basis of your 340-page evidentiary record. You made two decisions that bent the arc of what happened — one at a checkpoint outside an airport, and one when you turned the car around.`
  },

  {
    id: "rw-un-outcome-savers-careful-survived",
    survived: true,
    conditions: {
      rw_evacuated_expatriates: true,
      rw_saved_rwandans: true,
      rw_returned_to_duty: true,
      rw_testified_carefully: true,
      rw_protected_sources: true
    },
    epilogue: `You survived. You defied the mandate at the checkpoint and loaded Rwandans onto the expatriate convoy. You dropped them at the airport and drove back to Kigali instead of boarding a plane. You spent the remainder of the genocide documenting massacres and feeding evidence to Dallaire and the international press.

At The Hague in 2012, you testified carefully — full photographs, full dates, but protected identities for the Rwandan informants who had helped you map the command structure. The primary perpetrators were convicted. Some secondary figures were acquitted for lack of direct evidence. The people you smuggled past the militia checkpoint at the convoy roadblock were alive. The people who trusted you with information were protected. You accepted the incomplete verdict as the price of keeping both promises.`
  },

  {
    id: "rw-un-outcome-savers-submitted-survived",
    survived: true,
    conditions: {
      rw_evacuated_expatriates: true,
      rw_saved_rwandans: true,
      rw_returned_to_duty: true,
      rw_submitted_evidence: true,
      rw_avoided_testimony: true
    },
    epilogue: `You survived. You loaded Rwandan civilians onto the expatriate convoy against your orders, drove them to the airport, and turned the car around. You returned to Dallaire's skeleton crew and spent the rest of the genocide documenting massacres with your camera and notebook.

At The Hague in 2012, you submitted your full archive to the prosecution and declined to testify in person. The photographs and field notes were sufficient. The church massacre conviction was secured on documentary evidence alone. The people you smuggled past the checkpoint lived. The evidence you gathered when you drove back toward the killing instead of away from it put the men responsible in a prison cell. You let the record you made stand for what you did.`
  },

  // LEFT-RWANDANS → RETURNED-TO-DOCUMENT → TRIBUNAL outcomes
  // UN-3 fix: paths 10-12. Player followed orders at checkpoint (left Rwandans), then returned to document.
  // Must NOT say "you smuggled Rwandans past the checkpoint."
  {
    id: "rw-un-outcome-left-document-full-survived",
    survived: true,
    conditions: {
      rw_evacuated_expatriates: true,
      rw_left_rwandans: true,
      rw_returned_to_duty: true,
      rw_documented_evidence: true,
      rw_testified_tribunal: true,
      rw_provided_evidence: true
    },
    epilogue: `You survived. You followed your orders at the checkpoint — foreign nationals only — and drove the convoy to the airport while the woman holding her child and the embassy workers were left behind. You stood at the gate, watched the planes boarding, and chose not to get on one. You drove back into Kigali and rejoined Dallaire's skeleton crew. You picked up your camera.

You spent the rest of the genocide documenting what your mandate had prevented you from stopping — roadblocks, mass graves, church perimeters, the faces of commanders. At The Hague in 2012, you provided every photograph, every name, every timestamp. The conviction of the church massacre organizer rested substantially on your archive. You had followed orders at the checkpoint and lived with what that required. You spent the rest of the genocide making sure that the people you had driven past were not forgotten by the historical record, even if you could not bring them back.`
  },

  {
    id: "rw-un-outcome-left-document-careful-survived",
    survived: true,
    conditions: {
      rw_evacuated_expatriates: true,
      rw_left_rwandans: true,
      rw_returned_to_duty: true,
      rw_documented_evidence: true,
      rw_testified_carefully: true,
      rw_protected_sources: true
    },
    epilogue: `You survived. You followed your orders at the checkpoint — foreign nationals only — and the embassy workers and the woman with the child were left behind. You drove to the airport and turned around instead of boarding. You rejoined Dallaire's crew and documented the genocide for the remainder of the hundred days.

At The Hague in 2012, you testified carefully, withholding the identities of Rwandan informants who had helped you map the command structure. Some secondary perpetrators were acquitted for lack of direct evidence. The core convictions held. You had left people behind at one checkpoint because your orders required it. You protected different people years later because your conscience required that. The two decisions lived alongside each other for the rest of your life.`
  },

  {
    id: "rw-un-outcome-left-document-submitted-survived",
    survived: true,
    conditions: {
      rw_evacuated_expatriates: true,
      rw_left_rwandans: true,
      rw_returned_to_duty: true,
      rw_documented_evidence: true,
      rw_submitted_evidence: true,
      rw_avoided_testimony: true
    },
    epilogue: `You survived. You followed your orders at the checkpoint, left the Rwandans behind, drove to the airport, and turned back. You spent the rest of the genocide with your camera instead of a boarding pass, building a documentary record of what the mandate had allowed to happen.

At The Hague in 2012, you submitted your full archive and declined to testify in person. The photographs and field notes were sufficient for the convictions. You had already said everything you needed to say — in every image you had taken and every page you had written — about what following orders at one checkpoint had looked like, and what it had looked like to go back. The record stood for itself.`
  },

  // SAVED-RWANDANS → LEFT-RWANDA → DOCUMENTARY outcomes
  // UN-2 fix: paths 13-15. Player SAVED Rwandans at checkpoint (defied orders), then left Rwanda.
  // Must NOT say "you followed orders" or "left Rwandans behind."
  {
    id: "rw-un-outcome-savers-left-documentary-survived",
    survived: true,
    conditions: {
      rw_saved_rwandans: true,
      rw_defied_orders: true,
      rw_left_rwanda: true,
      rw_participated_documentary: true,
      rw_shared_guilt: true
    },
    epilogue: `You survived. At the checkpoint on the way to the airport, you defied your orders and loaded the embassy workers and the woman with the child onto the convoy. You drove them to the airport and this time you boarded the plane yourself — saving who you could reach, then leaving. You filed your report. You went home to Canada.

In 2006, when the documentary filmmaker called, you said yes and told the full story: the checkpoint, the defiance, the boarding. You had saved people by breaking the rule and then exercised the rule's original exemption for yourself. You were not sure what to call that. The filmmaker called it complicated. You let it be complicated on camera. Your willingness to hold both things at once — the act of rescue and the act of departure — made the documentary a more honest account of what UN peacekeeping actually required of individual officers than any official report had managed to be.`
  },

  {
    id: "rw-un-outcome-savers-left-private-survived",
    survived: true,
    conditions: {
      rw_saved_rwandans: true,
      rw_defied_orders: true,
      rw_left_rwanda: true,
      rw_declined_documentary: true,
      rw_private_advocacy: true
    },
    epilogue: `You survived. You defied your orders at the checkpoint, loaded the Rwandans onto the convoy, drove them to the airport, and then boarded a plane yourself. You saved some people. You left the rest of the country to the genocide. You filed your report and went home.

You became a private advocate for peacekeeping reform — closed-door testimony, policy papers, briefings for officers being deployed to future crises. When the documentary filmmaker called, you declined. You had broken the mandate at one checkpoint and then honored it by leaving. That contradiction was not something you wanted to perform for a camera. It was something you wanted to use — in rooms where policy was actually written — to make sure that no future officer would be handed a mandate that made the contradiction inevitable.`
  },

  {
    id: "rw-un-outcome-savers-left-policy-survived",
    survived: true,
    conditions: {
      rw_saved_rwandans: true,
      rw_defied_orders: true,
      rw_left_rwanda: true,
      rw_participated_policy_focus: true,
      rw_forward_looking: true
    },
    epilogue: `You survived. You defied your orders at the checkpoint, loaded the embassy workers and the woman with the child onto the convoy, and drove them to the airport. Then you boarded a plane and left Rwanda while the genocide continued.

When the documentary filmmaker called in 2006, you agreed to participate — but you refused to center your personal decision at the checkpoint. Instead, you described the structural logic that had made that checkpoint the fulcrum of an impossible choice: a mandate that immunized UN vehicles by requiring them to carry only certain kinds of people, a system that traded one group's safety for another group's death. You had broken the system once and then used it yourself. You would not perform the contradiction for the cameras. You would use it to dismantle the policy that had created it.`
  },

  // MANDATE PATH DEATH — paths 4-6: followed mandate → held at costs → died
  // Player followed orders, was NOT a defier from the start. stayed-killed says "defied orders" — wrong.
  {
    id: "rw-un-outcome-mandate-held-killed",
    survived: false,
    conditions: {
      rw_followed_mandate: true,
      rw_protected_hotel: true,
      rw_held_position: true
    },
    deathContext: {
      cause: "Killed defending civilians while holding the hotel under a skeleton mandate",
      historicalRate: "Peacekeepers who remained at exposed positions with minimal force faced lethal risk as the militia grew bolder",
      yourChoices: "You followed the mandate as long as it held, then refused to abandon the refugees when it ran out. The militia's patience ran out first."
    },
    deathEpilogueEarly: `You didn't survive. You followed Dallaire's mandate for as long as it gave you something to stand on — holding the Hôtel des Mille Collines while Rusesabagina negotiated and the militia tested the perimeter. When the withdrawal came and you were down to four peacekeepers, you drew the line and held.

Their patience ran out before the RPF arrived. You were killed defending the hotel during the hundred days of the genocide, long before the inquiry in Ottawa or the memorial ceremonies in 2010. You had followed your orders until following them would have meant abandoning twelve hundred people to be killed. Then you stopped following them. You died at the exact point where your mandate ended and your conscience began.`
  },

  // SAVERS-THEN-LEFT/RETURNED DEATH — paths 13-18: saved Rwandans at checkpoint → left or returned → died
  // Player defied orders at convoy checkpoint, then either left Rwanda or returned to document.
  // stayed-killed describes dying at the hotel, which this player never went to. Wrong story entirely.
  {
    id: "rw-un-outcome-savers-convoy-killed",
    survived: false,
    conditions: {
      rw_saved_rwandans: true,
      rw_defied_orders: true
    },
    deathContext: {
      cause: "Killed during or after the convoy checkpoint defiance or while documenting",
      historicalRate: "UN personnel who broke with the convoy mandate or remained in Kigali to document faced lethal risk throughout the hundred days",
      yourChoices: "You loaded Rwandans onto the convoy against your orders. Whether you left Rwanda after or returned to document, the genocide reached you."
    },
    deathEpilogueEarly: `You didn't survive. At the checkpoint on the route to the airport, you looked at the woman holding her child and the embassy workers, and you loaded them onto the convoy against your orders. You drove them to safety. Then — whether you left Rwanda afterward or turned the car back toward Kigali to document what was happening — the genocide reached you.

You were killed during the hundred days, before Ottawa, before The Hague, before any of the institutional reckoning that followed. You had broken the rule that gave UN vehicles immunity at militia checkpoints — the rule that required you to save only certain kinds of people. You paid for breaking it. The people you loaded onto that convoy survived. Whether they ever learned your name is not recorded.`
  },

  // DEATH OUTCOMES (Occurring BEFORE post-genocide inquiries)
  // UN-4 fix: documented-killed moved FIRST to win tie-break over stayed-killed for document paths.
  // UN-4 fix: added rw_continued_documentation to conditions to raise score above stayed-killed.
  {
    id: "rw-un-outcome-documented-killed",
    survived: false,
    conditions: {
      rw_documented_evidence: true,
      rw_continued_documentation: true
    },
    deathContext: {
      cause: "Killed during the genocide while documenting atrocities",
      historicalRate: "Journalists and peacekeepers who stayed to document the genocide faced significant danger, and several were killed",
      yourChoices: "You stayed at the church to photograph the massacre. The militia viewed your documentation as a threat."
    },
    deathEpilogueEarly: `You didn't survive. You drove to the church, heard the grenades and the screaming, and instead of leaving you raised your camera. You documented the faces of the Interahamwe commanders as they moved through the congregation, recording the names and the sequence and the chain of command of people who believed absolutely that no one would ever hold them accountable.

They saw what you were doing. Witnesses with cameras were a different threat than witnesses without them. You were killed during the hundred days of the genocide before the RPF secured the area. When they did, your camera and your notebook were recovered. Years later, Dallaire and the ICTR prosecutors used the photographs you died taking to build the evidentiary case that convicted the men you had photographed. You did not survive to testify. The camera testified for you.`
  },

  // UN-1 fix: New death outcome for evacuation/left-Rwanda paths (7-18).
  // Previously these paths incorrectly resolved to rw-un-outcome-stayed-killed (hotel defense).
  {
    id: "rw-un-outcome-evacuation-path-died",
    survived: false,
    conditions: {
      rw_evacuated_expatriates: true,
      rw_left_rwandans: true
    },
    deathContext: {
      cause: "Killed during the genocide while on evacuation duty or after returning to document",
      historicalRate: "UN personnel who remained in Rwanda after the withdrawal faced ongoing risk from militia and crossfire",
      yourChoices: "You completed your evacuation orders or returned to document. You did not survive the hundred days."
    },
    deathEpilogueEarly: `You didn't survive. You ran the evacuation convoy to the airport — foreign nationals only, per your orders — and left the Rwandans at the checkpoint behind. Whether you boarded a plane and returned, or never left Kigali at all, the genocide reached you before the RPF did.

You died during the hundred days, before the inquiry in Ottawa, before The Hague, before any of the institutional reckoning that came later. You followed your mandate at the checkpoint. You made the choices available to you. You died in the country your orders had brought you to, carrying the specific memory of the faces at that roadblock — the woman with the child, the embassy workers — that you had driven past because the mandate required it.`
  },

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
    deathEpilogueEarly: `You didn't survive. When Dallaire's voice came over the radio and the militia commander smiled at the news of the UN withdrawal, you refused to leave. You stayed with eight peacekeepers at the Hôtel des Mille Collines, holding the perimeter against the Interahamwe, relying on your blue helmets and the militia's uncertainty about whether killing a UN officer would complicate their impunity.

Their patience ran out before the RPF arrived. You were killed in a direct assault on the hotel perimeter during the hundred days of the genocide. Without reinforcements, without resupply, without New York's authorization to do what you had already done, the position eventually became impossible to hold. Canada awarded you a posthumous medal. Dallaire wrote about you as the kind of officer UNAMIR should have been authorized to be. You died doing what the mandate had explicitly prohibited: choosing protection over politics.`
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
    deathEpilogueEarly: `You didn't survive. At the checkpoint on the route to the airport, you looked at the woman holding her child and loaded her and the embassy workers onto the convoy. You broke the unwritten rule that gave UN vehicles immunity through these militia checkpoints: you would take white foreigners, and they would let you pass. By taking Rwandans, you challenged the premise that some lives were categorically worth more than others.

The militia commander didn't let it go. You were killed at that checkpoint during the first weeks of the genocide, alongside the Rwandans you had tried to protect. You died refusing the operational logic of a mandate that required you to choose who got to board based on their passport. The UN's official record would later classify your death as a result of exceeding your mandate. You had decided that was acceptable.`
  }
];

// Export role data
export default {
  scenes: unPeacekeeperScenes,
  outcomes: unPeacekeeperOutcomes
};
