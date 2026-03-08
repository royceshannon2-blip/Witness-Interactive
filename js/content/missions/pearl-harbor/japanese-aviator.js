/**
 * Pearl Harbor Mission - Japanese Naval Aviator Role
 * 
 * Scene sequence for the Japanese Naval Aviator perspective.
 * Experience the attack from the cockpit of a Mitsubishi A6M Zero fighter.
 * 
 * Historical Context:
 * - First wave: 183 aircraft launched at 6:00 AM from six carriers
 * - Commander Mitsuo Fuchida led the attack coordination
 * - Signal "Tora! Tora! Tora!" confirmed complete surprise
 * - Japanese losses: 29 aircraft, 64 men killed
 * 
 * Educational Focus:
 * - AP Themes: causation, perspective, continuity
 * - Explores Japanese strategic motivations and moral complexity
 * - Demonstrates the human cost of strategic decisions
 */

// VERIFIED: Historical timeline and force composition from Naval History and Heritage Command
// DRAMATIZED: Individual pilot thoughts and sensory details (composite character)

const japaneseAviatorScenes = [
  {
    id: "ja-scene-01",
    narrative: `The carrier deck pitches beneath your boots. 0545 hours. Your Mitsubishi A6M Zero sits fueled and armed, engine cowling still warm from the pre-flight check. Around you, 182 other aircraft crowd the decks of six carriers—the entire Kido Butai strike force.

Commander Fuchida's briefing echoes in your mind: "Decisive blow. End the conflict before it begins." The words felt clean in the ready room. Out here, with salt spray on your face and the target coordinates committed to memory, they feel heavier.

Below deck, you know some men are writing letters they hope they'll never need to send. The deck officer raises his flag. Your squadron leader's engine roars to life.`,
    apThemes: ["perspective", "causation"],
    apKeyConcept: "KC-7.1.I",
    atmosphericEffect: null,
    choices: [
      {
        id: "ja-choice-01-a",
        text: "Focus on duty. This is war.",
        consequences: {
          disciplined_mindset: true,
          emotional_distance: 1
        },
        nextScene: "ja-scene-02"
      },
      {
        id: "ja-choice-01-b",
        text: "Think of the sailors below. They don't know.",
        consequences: {
          moral_awareness: true,
          emotional_conflict: 1
        },
        nextScene: "ja-scene-02"
      },
      {
        id: "ja-choice-01-c",
        text: "Remember the oil embargo. They forced this.",
        consequences: {
          justified_action: true,
          strategic_focus: 1
        },
        nextScene: "ja-scene-02"
      }
    ]
  },

  {
    id: "ja-scene-02",
    narrative: `0715 hours. Oahu's northern coast appears through the morning haze—green mountains, white beaches, peaceful. Your formation holds tight, 183 aircraft in perfect discipline. No radar warning. No interceptors rising to meet you.

The radio crackles: "All units, all units—" Then Fuchida's voice, calm and clear: "Tora! Tora! Tora!" Complete surprise achieved. Around you, torpedo bombers peel off toward the harbor. Dive bombers climb for altitude. Your squadron—fighters—will suppress the airfields first.

Below, you can see Wheeler Field. Rows of aircraft parked wingtip to wingtip, gleaming in the sun. Perfect targets. Defenseless. Your squadron leader banks left. Your finger rests on the trigger.`,
    apThemes: ["causation", "perspective"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: null,
    choices: [
      {
        id: "ja-choice-02-a",
        text: "Follow formation exactly. Discipline wins wars.",
        consequences: {
          followed_orders: true,
          disciplined_approach: true
        },
        nextScene: "ja-scene-03"
      },
      {
        id: "ja-choice-02-b",
        text: "Take a wider approach. Avoid potential AA fire.",
        consequences: {
          tactical_caution: true,
          independent_thinking: true
        },
        nextScene: "ja-scene-03"
      },
      {
        id: "ja-choice-02-c",
        text: "Scan for threats. Something feels wrong.",
        consequences: {
          heightened_awareness: true,
          survival_instinct: 1
        },
        nextScene: "ja-scene-03"
      }
    ]
  },

  {
    id: "ja-scene-03",
    narrative: `0755 hours. Pearl Harbor spreads below you like a photograph from the briefing room—Battleship Row, Ford Island, the fuel depots. Except the photograph didn't show the men. Tiny figures running on decks. Sailors in white uniforms scattering like rice grains.

A massive explosion erupts from one of the battleships—orange flame, black smoke mushrooming upward. The shockwave reaches you at 3,000 feet, rattling your canopy. The ship is breaking apart. You can see men jumping into water that's already burning with oil.

Your fuel gauge shows three-quarters remaining. Your ammunition counter reads full. The radio traffic is chaos—targets called, hits confirmed, damage reports. A voice cuts through: "Second wave inbound. All fighters, maintain air superiority." But you also hear: "Akagi, this is Soryu-5. Fuel critical. Requesting—" Static.`,
    apThemes: ["perspective", "continuity"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: "smoke",
    choices: [
      {
        id: "ja-choice-03-a",
        text: "Continue the mission. Maximum damage.",
        consequences: {
          mission_priority: true,
          aggressive_action: 1
        },
        nextScene: "ja-scene-04"
      },
      {
        id: "ja-choice-03-b",
        text: "Conserve ammunition. Long flight home.",
        consequences: {
          fuel_conserved: true,
          strategic_thinking: 1
        },
        nextScene: "ja-scene-04"
      },
      {
        id: "ja-choice-03-c",
        text: "Cover the bombers. Protect your squadron.",
        consequences: {
          protected_squadron: true,
          loyalty_to_unit: 1
        },
        nextScene: "ja-scene-04"
      }
    ]
  },

  {
    id: "ja-scene-04",
    narrative: `0845 hours. Anti-aircraft fire fills the sky now—black puffs of flak, tracer rounds arcing up like deadly fireworks. An American fighter—a P-40, you think—screams past your canopy, guns blazing. Your wingman's Zero trails smoke, spiraling down toward the harbor.

The second wave has arrived. The sky is crowded with aircraft, both sides now. You spot a damaged Kate torpedo bomber limping north, one engine dead, losing altitude. It won't make it back to the carriers. The pilot is waving frantically, pointing at his engine.

Your fuel gauge reads half. Enough to escort him partway, maybe. Or enough to make one more pass over the harbor, finish your assigned targets. The radio crackles: "All units, all units—prepare for withdrawal. Rendezvous point Alpha."`,
    apThemes: ["perspective", "causation"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: "shake",
    choices: [
      {
        id: "ja-choice-04-a",
        text: "Escort the damaged bomber. Leave no one behind.",
        consequences: {
          helped_comrade: true,
          honor_code: 1,
          fuel_risk: true
        },
        nextScene: "ja-scene-05"
      },
      {
        id: "ja-choice-04-b",
        text: "Follow withdrawal orders. Return to carrier.",
        consequences: {
          followed_orders: true,
          fuel_conserved: true,
          disciplined_approach: true
        },
        nextScene: "ja-scene-05"
      },
      {
        id: "ja-choice-04-c",
        text: "One more pass. Complete the mission.",
        consequences: {
          mission_priority: true,
          aggressive_action: 2,
          fuel_risk: true
        },
        nextScene: "ja-scene-05"
      }
    ]
  },

  {
    id: "ja-scene-05",
    narrative: `1015 hours. The carrier Akagi rises from the horizon, flight deck waiting. Your fuel gauge needle touches red. Behind you, Pearl Harbor burns—a column of black smoke visible for fifty miles. Eight battleships sunk or damaged. The American Pacific Fleet crippled.

But as you circle for landing, you notice what's missing from the harbor photographs now being transmitted: the American aircraft carriers. All three—Enterprise, Lexington, Saratoga—were at sea. Untouched. Your squadron lost four Zeros. The bomber groups lost more.

You touch down on Akagi's deck. Deck crews swarm your aircraft. An officer approaches with a clipboard, already asking for your damage assessment. Around you, pilots climb from cockpits, some jubilant, others silent. Commander Fuchida is arguing with Admiral Nagumo about a third wave strike.

You think about the burning ships, the men in the water, the carriers that weren't there. You think about what happens next.`,
    apThemes: ["causation", "continuity", "argumentation"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: null,
    choices: [
      {
        id: "ja-choice-05-final",
        text: "Complete your report.",
        consequences: {
          mission_complete: true
        },
        nextScene: "outcome"
      }
    ]
  }
];

// Outcome rules based on consequence flags
// Historical accuracy: 29 Japanese aircraft lost, 64 Japanese killed
const japaneseAviatorOutcomes = [
  {
    id: "ja-outcome-died-combat",
    conditions: {
      took_risks: true,
      aggressive_attack: true
    },
    survived: false,
    epilogue: `You do not survive the attack on Pearl Harbor.

American anti-aircraft fire finds your Zero over the harbor. Perhaps you flew too low, pressed the attack too aggressively, stayed too long over the target. The tracers converge on your aircraft. Your engine catches fire. You try to gain altitude, to make it back to the carrier, but the controls don't respond.

You are one of 64 Japanese servicemen who die in the attack. Your body will be recovered from the wreckage and buried at sea with military honors. Your family will receive notification that you died gloriously in service to the Emperor. They will never know the details—the fear, the pain, the regret in those final moments.

The war you helped start will last four years and claim millions of lives. Japan will lose. The attack on Pearl Harbor, which seemed like such a brilliant victory, will be remembered as the beginning of Japan's defeat. You will not live to see it. You died believing you were winning a war. History will remember differently.`
  },
  {
    id: "ja-outcome-died-heroic",
    conditions: {
      helped_comrade: true,
      sacrificed_self: true
    },
    survived: false,
    epilogue: `You do not survive the attack on Pearl Harbor.

When your wingman's aircraft was hit by anti-aircraft fire, you could have continued your mission. You could have let him fall. Instead, you stayed with him, tried to escort him back to the carrier, drew enemy fire to protect him. It cost you your life.

Your wingman will make it back to the Akagi. He will report your sacrifice. Your squadron will honor your memory. The Navy will commend your loyalty to your comrades. Your family will be told you died a hero's death.

But you will not see the war that follows. You will not see Midway, where four Japanese carriers are sunk. You will not see the tide turn against Japan. You will not see the atomic bombs, the surrender, the occupation. You died on December 7, 1941, believing Japan would win this war. You were wrong. But you died with honor, and that is something.`
  },
  {
    id: "ja-outcome-survived-conflicted",
    conditions: {
      moral_awareness: true,
      helped_comrade: true
    },
    survived: true,
    epilogue: `You return to the Akagi. Your mission was successful—eight battleships destroyed or damaged, 188 American aircraft destroyed. But the carriers escaped. And you can't stop thinking about the sailors in the water, the burning oil, the men who never saw it coming.

Over the next four years, you will fly in the battles of Midway, the Philippine Sea, and dozens of smaller engagements. You will see most of your squadron die. In August 1945, when the Emperor announces surrender, you will think of December 7, 1941, and wonder if Commander Fuchida was wrong. Perhaps it didn't end the conflict before it began. Perhaps it only ensured Japan could never win.

You survive the war. You never speak of Pearl Harbor.`
  },
  {
    id: "ja-outcome-survived-dutiful",
    conditions: {
      disciplined_approach: true,
      followed_orders: true
    },
    survived: true,
    epilogue: `You return to the Akagi. Your report is precise, professional, complete. You followed every order, maintained formation discipline, executed your mission exactly as briefed. Admiral Nagumo commends your squadron's performance.

The war that follows will demand that same discipline. You will fly in the Coral Sea, at Midway, in the Philippine Sea. You will watch the tide turn against Japan, watch carriers burn, watch the Empire shrink. You will follow orders until there are no more orders to follow.

In 1945, you will return to a Japan you barely recognize. The discipline that made you an elite pilot will help you survive the peace. You will never question whether the attack was the right decision. A soldier's duty is to serve, not to question.`
  },
  {
    id: "ja-outcome-survived-strategic",
    conditions: {
      strategic_thinking: true,
      fuel_conserved: true
    },
    survived: true,
    epilogue: `You return to the Akagi with fuel to spare. Your strategic thinking—conserving ammunition, avoiding unnecessary risks, planning for the long flight home—marks you as a survivor. Your squadron leader notes it in his report.

That strategic mindset will serve you well in the years ahead. You will survive Midway when others don't. You will recognize when battles are lost and withdraw before it's too late. You will see the war's trajectory long before the high command admits it.

By 1944, you will be training new pilots—boys, really, with barely fifty hours of flight time. You will teach them what you learned over Pearl Harbor: that tactical brilliance means nothing without strategic wisdom. That winning a battle and winning a war are not the same thing. Most of them will not survive to understand.`
  },
  {
    id: "ja-outcome-default",
    conditions: {},
    survived: true,
    epilogue: `You return to the Akagi. The mission is complete. Pearl Harbor burns behind you, the American Pacific Fleet crippled. Around you, pilots celebrate a perfect strike—complete surprise, devastating damage, minimal losses.

But you notice Commander Fuchida's face as he argues for a third wave strike. You notice Admiral Nagumo's refusal. You notice the missing carriers in the reconnaissance photographs. You notice the fuel depots and repair facilities still intact.

The war that follows will last four years. You will fly in battles across the Pacific. You will see the tide turn at Midway, watch the Empire's reach contract, witness the fire bombings of Japanese cities. And you will remember this morning, December 7, 1941, when Japan won a battle and lost a war.`
  }
];

// Export for mission.js to import
export default {
  scenes: japaneseAviatorScenes,
  outcomes: japaneseAviatorOutcomes
};
