/**
 * Pearl Harbor Mission - Japanese Naval Aviator Role
 *
 * Historical Context:
 * - First wave: 183 aircraft launched at 6:00 AM from six carriers
 * - Commander Mitsuo Fuchida led the attack coordination
 * - Signal "Tora! Tora! Tora!" confirmed complete surprise
 * - Japanese losses: 29 aircraft, 64 men killed (35% death rate among lost crews)
 *
 * SURVIVAL ODDS (historically grounded):
 * - Baseline death chance: 35%
 * - Aggressive choices, extra attack runs, low-fuel decisions push it higher
 * - Disciplined, cautious choices lower it
 * - Final survival is a weighted probability roll in ConsequenceSystem
 */

const japaneseAviatorScenes = [
  {
    id: "ja-scene-01",
    narrative: `The carrier deck pitches beneath your boots. 0545 hours. Your Mitsubishi A6M Zero sits fueled and armed, engine cowling still warm from the pre-flight check. Around you, 182 other aircraft crowd the decks of six carriers—the entire Kido Butai strike force.

Commander Fuchida's briefing echoes in your mind: "Decisive blow. End the conflict before it begins." The words felt clean in the ready room. Out here, with salt spray on your face and the target coordinates committed to memory, they feel heavier.

Below deck, you know some men are writing letters they hope they'll never need to send. The deck officer raises his flag. Your squadron leader's engine roars to life.`,
    apThemes: ["perspective", "causation"],
    apKeyConcept: "KC-7.1.I",
    atmosphericEffect: null,
    ambientTrack: "425268__77pacer__airplanetank-engine-sound.wav",
    narratorAudio: "audio/narration/japanese-aviator/ja-scene-01.mp3",
    choices: [
      {
        id: "ja-choice-01-a",
        text: "Focus on duty. This is war.",
        consequences: { disciplined_mindset: true, emotional_distance: 1 },
        nextScene: "ja-scene-02"
      },
      {
        id: "ja-choice-01-b",
        text: "Think of the sailors below. They don't know.",
        consequences: { moral_awareness: true, emotional_conflict: 1 },
        nextScene: "ja-scene-02"
      },
      {
        id: "ja-choice-01-c",
        text: "Remember the oil embargo. They forced this.",
        consequences: { justified_action: true, strategic_focus: 1 },
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
    ambientTrack: "161120__fight2flyphoto__a6m-zero-chasing-p-51d-mustang.wav",
    narratorAudio: "audio/narration/japanese-aviator/ja-scene-02.mp3",
    radioClips: [
      { id: "tora-signal",  src: "audio/narration/japanese-aviator/ja-radio-tora.mp3",      triggerAfterMs: 8000 },
      { id: "all-units",   src: "audio/narration/japanese-aviator/ja-radio-all-units-01.mp3", triggerAfterMs: 15000 }
    ],
    choices: [
      {
        id: "ja-choice-02-a",
        text: "Follow formation exactly. Discipline wins wars.",
        consequences: { followed_orders: true, disciplined_approach: true },
        nextScene: "ja-scene-03"
      },
      {
        id: "ja-choice-02-b",
        text: "Take a wider approach. Avoid potential AA fire.",
        consequences: { tactical_caution: true, independent_thinking: true },
        nextScene: "ja-scene-03"
      },
      {
        id: "ja-choice-02-c",
        text: "Scan for threats. Something feels wrong.",
        consequences: { heightened_awareness: true, survival_instinct: 1 },
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
    ambientTrack: "149966__nenadsimic__muffled-distant-explosion.wav",
    narratorAudio: "audio/narration/japanese-aviator/ja-scene-03.mp3",
    radioClips: [
      { id: "second-wave", src: "audio/narration/japanese-aviator/ja-radio-second-wave.mp3", triggerAfterMs: 12000 },
      { id: "soryu-five",  src: "audio/narration/japanese-aviator/ja-radio-soryu-five.mp3",  triggerAfterMs: 18000 }
    ],
    timedChoice: { enabled: true, duration: 10000, defaultChoice: "ja-choice-03-c" },
    choices: [
      {
        id: "ja-choice-03-a",
        text: "Continue the mission. Maximum damage.",
        consequences: { mission_priority: true, aggressive_action: 1 },
        nextScene: "ja-scene-04"
      },
      {
        id: "ja-choice-03-b",
        text: "Conserve ammunition. Long flight home.",
        consequences: { fuel_conserved: true, strategic_thinking: 1 },
        nextScene: "ja-scene-04"
      },
      {
        id: "ja-choice-03-c",
        text: "Cover the bombers. Protect your squadron.",
        consequences: { protected_squadron: true, loyalty_to_unit: 1 },
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
    ambientTrack: "161120__fight2flyphoto__a6m-zero-chasing-p-51d-mustang.wav",
    narratorAudio: "audio/narration/japanese-aviator/ja-scene-04.mp3",
    radioClips: [
      { id: "withdrawal", src: "audio/narration/japanese-aviator/ja-radio-withdrawal.mp3", triggerAfterMs: 15000 }
    ],
    timedChoice: { enabled: true, duration: 12000, defaultChoice: "ja-choice-04-b" },
    choices: [
      {
        id: "ja-choice-04-a",
        text: "Escort the damaged bomber. Leave no one behind.",
        consequences: { helped_comrade: true, honor_code: 1, fuel_risk: true },
        nextScene: "ja-scene-05"
      },
      {
        id: "ja-choice-04-b",
        text: "Follow withdrawal orders. Return to carrier.",
        consequences: { followed_orders: true, fuel_conserved: true, disciplined_approach: true },
        nextScene: "ja-scene-05"
      },
      {
        id: "ja-choice-04-c",
        text: "One more pass. Complete the mission.",
        consequences: { mission_priority: true, aggressive_action: 2, fuel_risk: true },
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
    ambientTrack: "425268__77pacer__airplanetank-engine-sound.wav",
    narratorAudio: "audio/narration/japanese-aviator/ja-scene-05.mp3",
    choices: [
      {
        id: "ja-choice-05-final",
        text: "Complete your report.",
        consequences: { mission_complete: true },
        nextScene: "outcome"
      }
    ]
  }
];

// === OUTCOMES =========================================================
// Survival is determined by ConsequenceSystem.determineSurvival('japanese-aviator')
// before these are evaluated. Each outcome has a `survived` field.
// The system picks the best-scoring match within the correct survived bucket.
//
// DEATH RATE CONTEXT: 64 Japanese airmen killed at Pearl Harbor.
// Most deaths occurred during the attack run itself — AA fire,
// collision, engine failure from combat damage.

const japaneseAviatorOutcomes = [
  // == DEATH OUTCOMES ===================================================

  {
    id: "ja-outcome-died-low-fuel",
    survived: false,
    conditions: { fuel_risk: true, aggressive_action: 2 },
    deathContext: {
      cause: "Shot down over Pearl Harbor — low fuel, no escape margin",
      historicalRate: "35% of aircraft that pressed multiple attack runs did not return",
      yourChoices: "You flew multiple aggressive passes and continued combat with critically low fuel. When AA fire damaged your engine, you had no fuel reserve to reach the carriers."
    },
    epilogue: `You do not return to the Akagi.

Anti-aircraft fire finds your Zero during your final attack pass. A round tears through your engine cowling. Oil pressure drops immediately. You pull up, trying to gain altitude, trying to make it north toward the carriers — but the fuel gauge has been reading empty for minutes. The engine seizes at 2,000 feet.

You are one of 64 Japanese airmen who die in the attack on Pearl Harbor. Your aircraft goes down in the waters north of Oahu. The Akagi's crew will list you as missing in action. Your family in Kagoshima will wait months for confirmation.

Historically, the Japanese airmen who pressed the most aggressive attack runs had the highest loss rates. At Midway six months later, the carriers that launched you will burn and sink. The war you helped start will end with Japan's unconditional surrender in 1945. You died believing Japan was winning. The outcome was already being written in the carrier photographs that weren't in Pearl Harbor that morning.`
  },

  {
    id: "ja-outcome-died-escort",
    survived: false,
    conditions: { helped_comrade: true, fuel_risk: true },
    deathContext: {
      cause: "Ran out of fuel escorting a damaged aircraft",
      historicalRate: "Several Japanese pilots who broke formation to assist others did not return",
      yourChoices: "You broke withdrawal orders to escort a damaged bomber. The detour consumed your remaining fuel. You ditched in open ocean."
    },
    epilogue: `You do not return to the Akagi.

You stayed with the damaged bomber, flying slower than you should, burning fuel you couldn't afford. You watched the Kate torpedo bomber make a forced landing in the ocean — the crew scrambled onto a life raft, alive. You circled once, confirmed they were safe, then turned north toward the carriers.

Your fuel ran out forty miles short.

You ditched in the Pacific at 1130 hours. The water was warm. You inflated your life vest, marked your position, waited. No rescue aircraft came. You are listed as missing in action — one of 64 Japanese airmen who did not return from Pearl Harbor.

Your wingman, whom you saved, will survive the war. He will carry your name with him to the end.`
  },

  {
    id: "ja-outcome-died-combat",
    survived: false,
    conditions: { mission_priority: true, aggressive_action: 1 },
    deathContext: {
      cause: "Shot down by American AA fire over Pearl Harbor",
      historicalRate: "29 of 183 Japanese aircraft (16%) were shot down during the attack",
      yourChoices: "You prioritized mission completion over caution, making additional attack runs that kept you in the AA kill zone longer than necessary."
    },
    epilogue: `You do not return to the Akagi.

The flak finds you on your second attack pass over the harbor. A 1.1-inch round detonates beneath your cockpit. The Zero is a fast, maneuverable aircraft — but it was designed without armor to save weight. There is nothing between you and the fragments.

You are one of 29 Japanese aircraft shot down during the attack. Your Zero spirals into the harbor near Ford Island. American sailors, still under fire themselves, will pull your body from the wreckage later that day.

You died completing your mission. The harbor burns. Battleship Row is destroyed. But the aircraft carriers you needed to sink were at sea. Japan will win this battle and lose the war. History will remember Pearl Harbor as the most strategically counterproductive victory of the 20th century.`
  },

  {
    id: "ja-outcome-died-default",
    survived: false,
    conditions: {},
    deathContext: {
      cause: "Shot down over Pearl Harbor",
      historicalRate: "35% of Japanese aircraft involved in the attack did not return to their carriers",
      yourChoices: "You flew into one of the most heavily defended targets in the Pacific. Some did not come back."
    },
    epilogue: `You do not return to the Akagi.

Anti-aircraft fire, a midair collision, engine failure from combat damage — the records will not be specific. You are one of 64 Japanese airmen who die in the attack on Pearl Harbor, one of 29 aircraft that do not make it back to the carriers.

The attack succeeds. Pearl Harbor burns. Eight battleships are sunk or damaged, 188 American aircraft destroyed, 2,403 Americans killed. Japan achieves complete strategic surprise.

But the carriers were at sea. The fuel depots and repair facilities survived. Within six months, at the Battle of Midway, four Japanese fleet carriers — including some that launched your attack — will be sunk in a single day. The war you helped start will end with Japan's unconditional surrender. You died in the opening hour of a war Japan could not win.`
  },

  // == SURVIVAL OUTCOMES ================================================

  {
    id: "ja-outcome-survived-conflicted",
    survived: true,
    conditions: { moral_awareness: true, helped_comrade: true },
    epilogue: `You return to the Akagi. Your mission was successful — eight battleships destroyed or damaged, 188 American aircraft destroyed. But the carriers escaped. And you can't stop thinking about the sailors in the water, the burning oil, the men who never saw it coming.

Over the next four years, you will fly in the battles of Midway, the Philippine Sea, and dozens of smaller engagements. You will see most of your squadron die. In August 1945, when the Emperor announces surrender, you will think of December 7, 1941, and wonder if Commander Fuchida was wrong. Perhaps it didn't end the conflict before it began. Perhaps it only ensured Japan could never win.

You survive the war. You never speak of Pearl Harbor.`
  },

  {
    id: "ja-outcome-survived-dutiful",
    survived: true,
    conditions: { disciplined_approach: true, followed_orders: true },
    epilogue: `You return to the Akagi. Your report is precise, professional, complete. You followed every order, maintained formation discipline, executed your mission exactly as briefed. Admiral Nagumo commends your squadron's performance.

The war that follows will demand that same discipline. You will fly in the Coral Sea, at Midway, in the Philippine Sea. You will watch the tide turn against Japan, watch carriers burn, watch the Empire shrink. You will follow orders until there are no more orders to follow.

In 1945, you will return to a Japan you barely recognize. The discipline that made you an elite pilot will help you survive the peace. You will never question whether the attack was the right decision. A soldier's duty is to serve, not to question.`
  },

  {
    id: "ja-outcome-survived-strategic",
    survived: true,
    conditions: { strategic_thinking: true, fuel_conserved: true },
    epilogue: `You return to the Akagi with fuel to spare. Your strategic thinking — conserving ammunition, avoiding unnecessary risks, planning for the long flight home — marks you as a survivor. Your squadron leader notes it in his report.

That strategic mindset will serve you well in the years ahead. You will survive Midway when others don't. You will recognize when battles are lost and withdraw before it's too late. You will see the war's trajectory long before the high command admits it.

By 1944, you will be training new pilots — boys, really, with barely fifty hours of flight time. You will teach them what you learned over Pearl Harbor: that tactical brilliance means nothing without strategic wisdom. That winning a battle and winning a war are not the same thing. Most of them will not survive to understand.`
  },

  {
    id: "ja-outcome-survived-default",
    survived: true,
    conditions: {},
    epilogue: `You return to the Akagi. The mission is complete. Pearl Harbor burns behind you, the American Pacific Fleet crippled. Around you, pilots celebrate a perfect strike — complete surprise, devastating damage, minimal losses.

But you notice Commander Fuchida's face as he argues for a third wave strike. You notice Admiral Nagumo's refusal. You notice the missing carriers in the reconnaissance photographs. You notice the fuel depots and repair facilities still intact.

The war that follows will last four years. You will fly in battles across the Pacific. You will see the tide turn at Midway, watch the Empire's reach contract, witness the fire bombings of Japanese cities. And you will remember this morning, December 7, 1941, when Japan won a battle and lost a war.`
  }
];

export default {
  scenes: japaneseAviatorScenes,
  outcomes: japaneseAviatorOutcomes
};
