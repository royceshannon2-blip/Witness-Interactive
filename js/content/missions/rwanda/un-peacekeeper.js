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
    atmosphericEffect: "dawn",
    ambientTrack: null,
    narratorAudio: "audio/narration/un-peacekeeper/rw-un-scene-01.mp3",
    choices: [
      {
        id: "rw-un-choice-01-a",
        text: "Deploy to hotel—protect civilians",
        consequences: { rw_chose_protection: true, rw_stayed_path: 4 },
        nextScene: "rw-un-scene-02a"
      },
      {
        id: "rw-un-choice-01-b",
        text: "Evacuate expatriates as ordered",
        consequences: { rw_followed_evacuation_orders: true, rw_evacuated_path: 4 },
        nextScene: "rw-un-scene-02b"
      },
      {
        id: "rw-un-choice-01-c",
        text: "Document atrocities—gather evidence",
        consequences: { rw_chose_documentation: true, rw_documented_path: 4 },
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
    narratorAudio: "audio/narration/un-peacekeeper/rw-un-scene-02a.mp3",
    timedChoice: { enabled: true, duration: 15000, defaultChoice: "rw-un-choice-02a-b" },
    choices: [
      {
        id: "rw-un-choice-02a-a",
        text: "Defy orders—stay no matter what",
        consequences: { rw_defied_orders: true, rw_stayed_after_withdrawal: true, rw_stayed_path: 3 },
        nextScene: "rw-un-scene-03a"
      },
      {
        id: "rw-un-choice-02a-b",
        text: "Hold position—follow mandate for now",
        consequences: { rw_followed_mandate: true, rw_protected_hotel: true, rw_stayed_path: 2 },
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
    atmosphericEffect: "smoke",
    ambientTrack: null,
    narratorAudio: "audio/narration/un-peacekeeper/rw-un-scene-02b.mp3",
    timedChoice: { enabled: true, duration: 12000, defaultChoice: "rw-un-choice-02b-a" },
    choices: [
      {
        id: "rw-un-choice-02b-a",
        text: "Follow orders—expatriates only",
        consequences: { rw_evacuated_expatriates: true, rw_left_rwandans: true, rw_evacuated_path: 3 },
        nextScene: "rw-un-scene-03c"
      },
      {
        id: "rw-un-choice-02b-b",
        text: "Take Rwandans—risk the convoy",
        consequences: { rw_saved_rwandans: true, rw_defied_orders: true, rw_evacuated_path: 2 },
        nextScene: "rw-un-scene-03c"
      }
    ]
  },

  {
    id: "rw-un-scene-02c",
    narrative: `April 10. You're documenting. Camera. Notebook. Radio reports to HQ. You've seen roadblocks. Identity card checks. Bodies in streets. Churches surrounded by militia. You're gathering evidence. Someone has to record this. Someone has to make the world see.

You reach a church. Screaming inside. Grenades. Machetes. Hundreds of people. The militia sees your UN vehicle. They stop. They're not sure what to do. You're a witness. That makes them nervous. Or it makes them bold. "UN. You have no mandate here. Leave." You could leave. Document from a distance. Or stay. Your presence might stop them. Or it might get you killed like the Belgians.

Your radio crackles. Dallaire. "All units. Avoid direct confrontation. Document and report only." The militia commander is waiting. The screaming inside the church is getting quieter. You have your camera. You have your weapon. You have your orders. What do you do?`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: "smoke",
    ambientTrack: null,
    narratorAudio: "audio/narration/un-peacekeeper/rw-un-scene-02c.mp3",
    choices: [
      {
        id: "rw-un-choice-02c-a",
        text: "Stay and document—be a witness",
        consequences: { rw_documented_evidence: true, rw_witnessed_massacre: true, rw_documented_path: 3 },
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
    narratorAudio: "audio/narration/un-peacekeeper/rw-un-scene-03a.mp3",
    choices: [
      {
        id: "rw-un-choice-03a-a",
        text: "Hold the hotel—wait for RPF",
        consequences: { rw_held_hotel: true, rw_saved_civilians: true },
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
    narratorAudio: "audio/narration/un-peacekeeper/rw-un-scene-03b.mp3",
    choices: [
      {
        id: "rw-un-choice-03b-a",
        text: "Hold at all costs—no retreat",
        consequences: { rw_held_position: true, rw_protected_civilians: true },
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
    narratorAudio: "audio/narration/un-peacekeeper/rw-un-scene-03c.mp3",
    choices: [
      {
        id: "rw-un-choice-03c-a",
        text: "Board the plane—go home",
        consequences: { rw_went_home: true, rw_left_rwanda: true },
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
    id: "rw-un-scene-03d",
    narrative: `April 11. You stayed at the church. You documented. Camera. Notebook. Radio reports. The militia let you watch. They wanted you to see. They wanted the world to know they weren't afraid. Three hundred people killed. You have photos. You have names. You have evidence.

You send reports to New York. To Dallaire. To anyone who will listen. The media picks it up. CNN. BBC. The world sees. But the world doesn't act. The Security Council debates. The US says "acts of genocide," not "genocide." France abstains. No one wants to intervene. Your evidence matters. But it doesn't stop the killing.

You continue documenting. Roadblocks. Massacres. Refugee movements. You're building a case. For tribunals. For history. For justice. But justice is later. Right now, people are dying. You're a witness. That's important. But is it enough? You could do more. You could protect enclaves. You could defy orders. Or you keep documenting. Keep gathering evidence. Keep making the world see.`,
    apThemes: ["perspective", "complexity"],
    atmosphericEffect: "smoke",
    ambientTrack: null,
    narratorAudio: "audio/narration/un-peacekeeper/rw-un-scene-03d.mp3",
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
    narratorAudio: "audio/narration/un-peacekeeper/rw-un-scene-04a.mp3",
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
    narratorAudio: "audio/narration/un-peacekeeper/rw-un-scene-04b.mp3",
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
    narratorAudio: "audio/narration/un-peacekeeper/rw-un-scene-04c.mp3",
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
    narrative: `2012. The Hague, Netherlands. Eighteen years later. You documented everything. Churches. Roadblocks. Massacres. Identity card checks. You sent reports to New York. To Dallaire. To the media. The world saw. The world didn't act. But your evidence mattered later. The International Criminal Tribunal for Rwanda used your photos, your testimony, your reports. Militia leaders were convicted. RTLM broadcasters were convicted. Justice was slow. But it came.

Now you're testifying again. A war crimes trial. The defendant organized the church massacre you documented. Your photos are evidence. Your testimony is crucial. The defense attorney will question your credibility, your motives, your methods. But you were there. You saw. You documented. The truth is in your camera. The truth is in your notebook. The truth is in your memory.

Some peacekeepers who documented felt like they did nothing. You gathered evidence while people died. But evidence matters. Justice matters. The historical record matters. Your documentation helped convict perpetrators. It helped survivors get justice. It helped the world understand. The prosecutor waits. The judges wait. The defendant stares at you. You have the microphone. You have the truth.`,
    apThemes: ["continuity", "perspective", "complexity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: "audio/narration/un-peacekeeper/rw-un-scene-04d.mp3",
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
      cause: "Killed defending civilians during militia attack on hotel enclave",
      historicalRate: "While most UN peacekeepers who stayed survived, some were killed defending protected sites",
      yourChoices: "You defied withdrawal orders and held the hotel. The militia attacked in force. You held them off but were killed in the assault."
    },
    epilogue: `You didn't survive. You defied orders. You stayed when the UN withdrew. You held the hotel with four peacekeepers against hundreds of militia. For weeks, your presence kept them back. Then they attacked in force. Grenades. Automatic weapons. You held them off long enough for most refugees to escape through the back. But you were killed in the assault. Quick. Defending the gate.

The RPF arrived two days later. Most of the refugees survived because you bought them time. Your body was recovered. Canada gave you a posthumous medal. The UN named a peacekeeping award after you. General Dallaire spoke at your funeral. He said you embodied what UNAMIR should have been—protection over politics, conscience over orders.

Your family grieved. Your children grew up knowing you died a hero. The survivors you protected remember your name. The hotel has a plaque. Students visit. They learn that some peacekeepers stayed, that some died defending civilians, that courage matters even when mandates fail. You're remembered. You're honored. You carried that choice to the end.`
  },

  {
    id: "rw-un-outcome-evacuated-survived",
    survived: true,
    conditions: {
      rw_evacuated_expatriates: true,
      rw_left_rwandans: true
    },
    epilogue: `You survived. You evacuated the expatriates. You followed orders. You left Rwandans at the checkpoint—the woman with the child, the embassy workers, people begging to board. You went home. You filed your report. You did your job. But the faces haunt you. You know they died. You know you could have saved them. You chose not to.

You have PTSD. Guilt. Nightmares. Your therapist says you followed orders. Your family says you did what you could. But you know the truth. You had a choice. You chose safety over risk. You chose orders over conscience. Most peacekeepers made the same choice. That doesn't make it easier. The guilt doesn't lift.

You became an advocate. You speak at universities. You write op-eds. You push for stronger peacekeeping mandates. "Never again" means nothing if we don't act. Your advocacy matters. It changes policy. It educates people. But it doesn't bring back the Rwandans you left behind. You carry that guilt forward. You use it. You make sure the world remembers what happens when we follow orders instead of conscience. You survived, but part of you stayed at that checkpoint.`
  },

  {
    id: "rw-un-outcome-documented-survived",
    survived: true,
    conditions: {
      rw_documented_evidence: true,
      rw_sent_genocide_fax: true
    },
    epilogue: `You survived. You documented everything. Churches. Roadblocks. Massacres. Identity card checks. You sent reports to New York. To Dallaire. To the media. The world saw. The world didn't act. But your evidence mattered later. The International Criminal Tribunal for Rwanda used your photos, your testimony, your reports. Militia leaders were convicted. RTLM broadcasters were convicted. Justice was slow. But it came.

Some peacekeepers who documented felt like they did nothing. You gathered evidence while people died. But evidence matters. Justice matters. The historical record matters. Your documentation helped convict perpetrators. It helped survivors get justice. It helped the world understand. Without witnesses like you, there would be no accountability. No trials. No historical record.

You testified at The Hague. You spoke at inquiries. You educated students. Your photos are in museums. Your testimony is in archives. You didn't save lives in the moment. But you saved truth. You saved justice. You saved memory. The survivors you photographed—some lived, some died—they're remembered because you documented them. You carried that responsibility forward. You were a witness. That matters.`
  },

  {
    id: "rw-un-outcome-mandate-held-survived",
    survived: true,
    conditions: {
      rw_protected_hotel: true,
      rw_held_position: true
    },
    epilogue: `You survived. You followed the mandate and held the hotel. You didn't defy orders — you held position within your authorization and refused to retreat when the militia threatened. Eight peacekeepers. Twelve hundred refugees. The militia surrounded you, cut power, cut water, threatened daily. You held. When the RPF captured Kigali in July, everyone inside survived.

The distinction matters to you: you didn't defy your orders, you fulfilled them. Your mandate said protect the designated safe zone. You protected it. The UN didn't reprimand you. Canada gave you a service medal. You went home and told people you'd done your job.

But you know what the mandate excluded. You watched roadblocks from your vehicle windows. You filed reports. You observed and reported, exactly as instructed, while the killing continued outside the perimeter you were holding. Twelve hundred people are alive because you held position. Hundreds of thousands died because the position you held was forty meters wide. You carry both numbers. You did your job. You've never been sure that was enough.`
  },

  {
    id: "rw-un-outcome-saved-rwandans-survived",
    survived: true,
    conditions: {
      rw_saved_rwandans: true,
      rw_defied_orders: true
    },
    epilogue: `You survived. You took Rwandans onto the convoy. You risked the whole evacuation — every foreign national on board, your own soldiers, your career. The militia commander walked over and you didn't stop. You loaded the woman with the child. The embassy workers. Seven people who didn't have the right passport. The convoy got through. Everyone survived.

The UN reprimanded you. Officially. You had violated your mandate, endangered a sanctioned evacuation, exceeded your authority. The reprimand is in your file. You don't regret it. The seven people you loaded are alive. They testified at the ICTR later. One of them named you specifically — not as a hero, but as the peacekeeper who didn't stop moving when he should have stopped.

Dallaire wrote about cases like yours in his memoir. Moments where individual soldiers made choices the institution couldn't sanction and couldn't honestly condemn. You lived in that contradiction. The genocide killed 800,000 people in 100 days. You saved seven. The math is impossible to sit with. You carry it anyway. You made the choice you could make in the twelve seconds you had. That's all anyone gets.`
  },

  {
    id: "rw-un-outcome-saved-rwandans-killed",
    survived: false,
    conditions: {
      rw_saved_rwandans: true,
      rw_defied_orders: true
    },
    deathContext: {
      cause: "Killed when militia stopped the convoy after Rwandan civilians were loaded",
      historicalRate: "Some peacekeepers who defied orders to protect civilians were killed during confrontations with militia",
      yourChoices: "You loaded Rwandan civilians onto the evacuation convoy. The militia stopped the vehicle. You didn't survive the confrontation."
    },
    epilogue: `You didn't survive. You loaded Rwandans onto the convoy. The militia commander had walked over because he saw what you were doing. He stopped the vehicle. You refused to unload the civilians. The confrontation lasted four minutes. You were killed. The seven people you'd loaded were taken off the truck. Most of them were killed at the roadblock.

The UN investigated. The report noted that you had violated your mandate, endangered the evacuation, and been killed as a direct result. It also noted that you had attempted to protect civilians in a situation where protection was explicitly prohibited. Both things were recorded. Neither resolved the other.

Canada gave you a posthumous commendation. Your family received it. Dallaire spoke at a memorial service and said your name alongside the ten Belgians killed on April 7th. He said the genocide produced too many names like yours — people who tried to act within a system designed to prevent action. You carried that choice to the end. The seven people you tried to save are also names now.`
  },

  // FALLBACK OUTCOMES - catch-all for paths not covered by specific outcomes
  {
    id: "rw-un-fallback-survived",
    survived: true,
    conditions: {},
    epilogue: `You survived your deployment to Rwanda. The genocide ended on July 4th, 1994, when the RPF captured Kigali. You were there for some portion of what happened between April 6th and that date — as witness, as peacekeeper, as someone operating under a mandate that was structurally inadequate for what it was asked to observe.

The UN Security Council's decision to cut UNAMIR from 2,500 to 270 troops after the 10 Belgian peacekeepers were killed is part of the historical record. General Dallaire's January 1994 fax warning of mass killing — ignored by New York — is part of the historical record. The Responsibility to Protect doctrine, adopted by the UN in 2005 partly in response to Rwanda, is part of the historical record. Your choices during those 100 days are part of a record too, even when they don't map cleanly to named outcomes.

You carry what you saw. The Canadian Senate held a Special Committee on Rwanda in 2004. Inquiries were held across multiple countries. The world spent years trying to understand how it watched and didn't act. You were inside that watching. What you did with your twelve seconds, your mandate, your conscience — that's the part only you can account for.`
  },
  {
    id: "rw-un-fallback-killed",
    survived: false,
    conditions: {},
    epilogue: `You didn't survive your deployment. The genocide killed approximately 800,000 civilians in 100 days. It also killed ten Belgian peacekeepers on April 7th — their deaths triggered the UN withdrawal that reduced UNAMIR to 270 soldiers. You died in a conflict you were mandated only to observe.

The specific circumstances of your death — whether in defense of civilians, in a confrontation you couldn't avoid, or in the chaos that surrounded a mission without adequate authorization — aren't fully captured in this path. UNAMIR operated in impossible conditions: present, visible, and prohibited from acting. Some peacekeepers died for that contradiction.

General Dallaire's 2003 memoir, Shake Hands with the Devil, is dedicated to the soldiers who served under him in Rwanda. Canada recognized its UNAMIR veterans. The Responsibility to Protect doctrine — adopted at the UN in 2005 — exists in part because of what happened in Rwanda and what happened to people like you. You were there. That matters, even when the outcome couldn't be recorded cleanly.`
  }
];

// Export role data
export default {
  scenes: unPeacekeeperScenes,
  outcomes: unPeacekeeperOutcomes
};
