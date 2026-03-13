/**
 * Japanese Aviator - Branching Scenes (Phase 2)
 * 
 * This file contains the branching narrative variants that will replace
 * the linear scenes 02-05 in japanese-aviator.js
 * 
 * Structure:
 * - Scene 01: Entry point (already exists, branches to 02a/b/c)
 * - Scenes 02a/b/c: First branch (compliance/witness/instinct paths)
 * - Scenes 03a/b/c: Second branch
 * - Scenes 04a/b/c: Third branch  
 * - Scene 05: Convergence (all paths merge)
 */

// Path A: Compliance/Duty (disciplined_mindset from scene-01 choice A)
// Path B: Witness/Moral (moral_awareness from scene-01 choice B)
// Path C: Instinct/Strategic (justified_action from scene-01 choice C)

const branchingScenes = [
  // ═══ SCENE 02 VARIANTS ═══
  {
    id: "ja-scene-02a",
    narrative: `0715 hours. Your Zero cuts through morning air in perfect formation. Discipline. Order. These are the principles that built the Imperial Navy. Below, Oahu's coast emerges—green mountains, white sand, the enemy unprepared.

"Tora! Tora! Tora!" Fuchida's voice crackles through your headset. Complete surprise. Your training takes over. Wheeler Field spreads below—rows of P-40s parked wingtip to wingtip. Your squadron leader signals the attack pattern. You follow exactly, maintaining formation spacing, altitude, approach angle. Every pilot in position. This is how wars are won.`,
    apThemes: ["causation", "perspective"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: null,
    ambientTrack: "161120__fight2flyphoto__a6m-zero-chasing-p-51d-mustang.wav",
    choices: [
      {
        id: "ja-choice-02a-1",
        text: "Execute the briefed attack pattern precisely.",
        consequences: { perfect_execution: true },
        psychologyEffects: { morale: 5, loyalty: 10, awareness: -5 },
        nextScene: "ja-scene-03a"
      },
      {
        id: "ja-choice-02a-2",
        text: "Maintain radio discipline. Report targets only.",
        consequences: { professional_conduct: true },
        psychologyEffects: { morale: 3, loyalty: 8, awareness: 0 },
        nextScene: "ja-scene-03a"
      },
      {
        id: "ja-choice-02a-3",
        text: "Focus on assigned sector. Trust your wingmen.",
        consequences: { unit_cohesion: true },
        psychologyEffects: { morale: 5, loyalty: 12, awareness: -3 },
        nextScene: "ja-scene-03a"
      }
    ]
  },

  {
    id: "ja-scene-02b",
    narrative: `0715 hours. Oahu appears through the haze. You think about the sailors below—men like you, waking to coffee and morning routines. They don't know what's coming. The radio crackles: "Tora! Tora! Tora!" Your hand tightens on the stick.

Wheeler Field spreads below. American aircraft parked in neat rows. Defenseless. You see ground crew walking between planes. Someone waves at the sky—thinking you're friendlies on a training run. Your finger rests on the trigger. This is the moment. Once you fire, there's no going back.`,
    apThemes: ["perspective", "continuity"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: null,
    ambientTrack: "161120__fight2flyphoto__a6m-zero-chasing-p-51d-mustang.wav",
    choices: [
      {
        id: "ja-choice-02b-1",
        text: "Fire on the aircraft. Avoid the ground crew.",
        consequences: { selective_targeting: true },
        psychologyEffects: { morale: -5, loyalty: 5, awareness: 10 },
        nextScene: "ja-scene-03b"
      },
      {
        id: "ja-choice-02b-2",
        text: "Remember your orders. This is war.",
        consequences: { duty_over_doubt: true },
        psychologyEffects: { morale: 0, loyalty: 8, awareness: 5 },
        nextScene: "ja-scene-03b"
      },
      {
        id: "ja-choice-02b-3",
        text: "Think of your family. They're counting on you.",
        consequences: { personal_motivation: true },
        psychologyEffects: { morale: 5, loyalty: 3, awareness: 8 },
        nextScene: "ja-scene-03b"
      }
    ]
  },

  {
    id: "ja-scene-02c",
    narrative: `0715 hours. Oahu's northern coast. Your fuel gauge reads full, ammunition loaded. Strategic thinking: the oil embargo forced this. America chose economic warfare. Japan responded with military action. Cause and effect.

"Tora! Tora! Tora!" Complete surprise achieved. Wheeler Field below—perfect targets. But you scan the horizon. Where are their carriers? The briefing said Enterprise might be at sea. Your tactical mind calculates: destroy the airfields, cripple their response capability, secure air superiority for the second wave. Every decision matters.`,
    apThemes: ["causation", "argumentation"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: null,
    ambientTrack: "161120__fight2flyphoto__a6m-zero-chasing-p-51d-mustang.wav",
    choices: [
      {
        id: "ja-choice-02c-1",
        text: "Prioritize high-value targets. Maximize damage.",
        consequences: { strategic_targeting: true },
        psychologyEffects: { morale: 8, loyalty: 5, awareness: 10 },
        nextScene: "ja-scene-03c"
      },
      {
        id: "ja-choice-02c-2",
        text: "Conserve ammunition. Long mission ahead.",
        consequences: { resource_management: true },
        psychologyEffects: { morale: 10, loyalty: 3, awareness: 12 },
        nextScene: "ja-scene-03c"
      },
      {
        id: "ja-choice-02c-3",
        text: "Watch for American fighters. Stay alert.",
        consequences: { tactical_awareness: true },
        psychologyEffects: { morale: 5, loyalty: 5, awareness: 15 },
        nextScene: "ja-scene-03c"
      }
    ]
  },

  // ═══ SCENE 03 VARIANTS ═══
  {
    id: "ja-scene-03a",
    narrative: `0755 hours. Pearl Harbor. Your squadron executes the attack with textbook precision. Every pilot maintains formation. Every target engaged according to plan. Below, battleships burn. The Arizona explodes—a massive fireball that rattles your canopy even at 3,000 feet.

Radio traffic is disciplined, professional. "Akagi, Soryu-1. Battleship Row engaged. Eight capital ships confirmed hit." Your squadron leader's voice: "All fighters, maintain air superiority. Second wave inbound." You check your fuel: three-quarters. Ammunition: 60% remaining. Everything by the numbers.`,
    apThemes: ["perspective", "continuity"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: "smoke",
    ambientTrack: "149966__nenadsimic__muffled-distant-explosion.wav",
    timedChoice: { enabled: true, duration: 10000, defaultChoice: "ja-choice-03a-2" },
    choices: [
      {
        id: "ja-choice-03a-1",
        text: "Continue patrol pattern. Protect the bombers.",
        consequences: { mission_discipline: true },
        psychologyEffects: { morale: 5, loyalty: 10, awareness: 0 },
        nextScene: "ja-scene-04a"
      },
      {
        id: "ja-choice-03a-2",
        text: "Report fuel and ammunition status.",
        consequences: { proper_procedure: true },
        psychologyEffects: { morale: 3, loyalty: 8, awareness: 5 },
        nextScene: "ja-scene-04a"
      },
      {
        id: "ja-choice-03a-3",
        text: "Acknowledge orders. Maintain position.",
        consequences: { obedience: true },
        psychologyEffects: { morale: 5, loyalty: 12, awareness: -5 },
        nextScene: "ja-scene-04a"
      }
    ]
  },

  {
    id: "ja-scene-03b",
    narrative: `0755 hours. Pearl Harbor burns below. The Arizona—you watched it explode. The fireball consumed the forward section. Men jumped into water already burning with oil. You can see them from here. Tiny figures. Swimming. Drowning. Burning.

Your radio crackles with target confirmations, damage reports. Professional voices describing destruction. Eight battleships hit. Hundreds dead. Maybe thousands. You think about the pilot who waved at you over Wheeler Field. Wonder if he made it to a shelter. Wonder if it matters.`,
    apThemes: ["perspective", "continuity"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: "smoke",
    ambientTrack: "149966__nenadsimic__muffled-distant-explosion.wav",
    timedChoice: { enabled: true, duration: 10000, defaultChoice: "ja-choice-03b-2" },
    choices: [
      {
        id: "ja-choice-03b-1",
        text: "Focus on the mission. Don't think about it.",
        consequences: { emotional_suppression: true },
        psychologyEffects: { morale: -5, loyalty: 8, awareness: 5 },
        nextScene: "ja-scene-04b"
      },
      {
        id: "ja-choice-03b-2",
        text: "Remember: they would have done the same to us.",
        consequences: { rationalization: true },
        psychologyEffects: { morale: 0, loyalty: 5, awareness: 10 },
        nextScene: "ja-scene-04b"
      },
      {
        id: "ja-choice-03b-3",
        text: "This is the cost of war. Both sides pay it.",
        consequences: { moral_acceptance: true },
        psychologyEffects: { morale: -3, loyalty: 3, awareness: 15 },
        nextScene: "ja-scene-04b"
      }
    ]
  },

  {
    id: "ja-scene-03c",
    narrative: `0755 hours. Pearl Harbor. Strategic assessment: eight battleships hit, multiple cruisers damaged, airfields suppressed. American response capability degraded by approximately 70%. But the carriers aren't here. Enterprise, Lexington, Saratoga—all at sea. That's the real target. Battleships are yesterday's war.

Your fuel gauge: 70% remaining. Ammunition: sufficient for one more engagement. Radio traffic indicates second wave inbound. You calculate: if American fighters scramble from undamaged fields, they'll hit the second wave during their attack run. Someone needs to provide top cover.`,
    apThemes: ["causation", "argumentation"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: "smoke",
    ambientTrack: "149966__nenadsimic__muffled-distant-explosion.wav",
    timedChoice: { enabled: true, duration: 10000, defaultChoice: "ja-choice-03c-2" },
    choices: [
      {
        id: "ja-choice-03c-1",
        text: "Position for carrier search. They're out there.",
        consequences: { strategic_initiative: true },
        psychologyEffects: { morale: 10, loyalty: 0, awareness: 15 },
        nextScene: "ja-scene-04c"
      },
      {
        id: "ja-choice-03c-2",
        text: "Cover the second wave. Maximize their effectiveness.",
        consequences: { tactical_support: true },
        psychologyEffects: { morale: 8, loyalty: 8, awareness: 10 },
        nextScene: "ja-scene-04c"
      },
      {
        id: "ja-choice-03c-3",
        text: "Conserve fuel. Long flight back to carriers.",
        consequences: { survival_calculation: true },
        psychologyEffects: { morale: 12, loyalty: 3, awareness: 12 },
        nextScene: "ja-scene-04c"
      }
    ]
  },

  // ═══ SCENE 04 VARIANTS ═══
  {
    id: "ja-scene-04a",
    narrative: `0845 hours. Anti-aircraft fire intensifies. Black puffs of flak fill the sky. An American P-40 screams past—they got some fighters up. Your wingman's Zero trails smoke, spiraling down. He doesn't bail out.

The radio: "All units, prepare for withdrawal. Rendezvous point Alpha." Your squadron leader acknowledges. You check formation—three Zeros remaining from your original four. Fuel gauge: half. The mission parameters called for withdrawal at this point. Orders are orders.`,
    apThemes: ["perspective", "causation"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: "shake",
    ambientTrack: "161120__fight2flyphoto__a6m-zero-chasing-p-51d-mustang.wav",
    timedChoice: { enabled: true, duration: 12000, defaultChoice: "ja-choice-04a-2" },
    choices: [
      {
        id: "ja-choice-04a-1",
        text: "Form up for withdrawal. Follow the plan.",
        consequences: { disciplined_withdrawal: true },
        psychologyEffects: { morale: 5, loyalty: 10, awareness: 0 },
        nextScene: "ja-scene-05"
      },
      {
        id: "ja-choice-04a-2",
        text: "Cover the damaged aircraft. Protect the formation.",
        consequences: { unit_protection: true },
        psychologyEffects: { morale: 3, loyalty: 15, awareness: 5 },
        nextScene: "ja-scene-05"
      },
      {
        id: "ja-choice-04a-3",
        text: "Maintain radio discipline during withdrawal.",
        consequences: { professional_retreat: true },
        psychologyEffects: { morale: 5, loyalty: 8, awareness: 3 },
        nextScene: "ja-scene-05"
      }
    ]
  },

  {
    id: "ja-scene-04b",
    narrative: `0845 hours. The sky is chaos now. Flak, tracers, smoke. Your wingman goes down—you see the parachute open. He'll be captured. Spend the war in a POW camp. If he survives the landing.

A damaged Kate torpedo bomber limps north, one engine dead. The pilot waves frantically. He won't make it back. You could escort him partway, burn fuel you might need. Or follow withdrawal orders, let him take his chances. The radio: "All units, withdrawal authorized." What's the right choice when all choices are bad?`,
    apThemes: ["perspective", "causation"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: "shake",
    ambientTrack: "161120__fight2flyphoto__a6m-zero-chasing-p-51d-mustang.wav",
    timedChoice: { enabled: true, duration: 12000, defaultChoice: "ja-choice-04b-2" },
    choices: [
      {
        id: "ja-choice-04b-1",
        text: "Escort the bomber. Leave no one behind.",
        consequences: { compassionate_risk: true, fuel_risk: true },
        psychologyEffects: { morale: -5, loyalty: 10, awareness: 15 },
        nextScene: "ja-scene-05"
      },
      {
        id: "ja-choice-04b-2",
        text: "Follow withdrawal orders. You can't save everyone.",
        consequences: { pragmatic_choice: true },
        psychologyEffects: { morale: -10, loyalty: 5, awareness: 10 },
        nextScene: "ja-scene-05"
      },
      {
        id: "ja-choice-04b-3",
        text: "Radio his position. Hope rescue finds him.",
        consequences: { compromise_solution: true },
        psychologyEffects: { morale: -3, loyalty: 8, awareness: 12 },
        nextScene: "ja-scene-05"
      }
    ]
  },

  {
    id: "ja-scene-04c",
    narrative: `0845 hours. Tactical situation: second wave completing attack runs, American AA fire increasing, fuel status critical for some aircraft. Your gauge reads half—enough for one more engagement or a safe return. Not both.

A damaged bomber struggles north. Escorting him means burning fuel you calculated for safety margin. But losing experienced crews means losing the war. Strategic calculus: one bomber crew versus your own survival. The radio: "Withdrawal authorized." Mathematics doesn't care about honor.`,
    apThemes: ["perspective", "causation"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: "shake",
    ambientTrack: "161120__fight2flyphoto__a6m-zero-chasing-p-51d-mustang.wav",
    timedChoice: { enabled: true, duration: 12000, defaultChoice: "ja-choice-04c-2" },
    choices: [
      {
        id: "ja-choice-04c-1",
        text: "Calculate fuel burn. Escort if mathematically viable.",
        consequences: { calculated_risk: true },
        psychologyEffects: { morale: 8, loyalty: 5, awareness: 15 },
        nextScene: "ja-scene-05"
      },
      {
        id: "ja-choice-04c-2",
        text: "Withdraw immediately. Preserve your aircraft.",
        consequences: { strategic_preservation: true },
        psychologyEffects: { morale: 10, loyalty: 0, awareness: 10 },
        nextScene: "ja-scene-05"
      },
      {
        id: "ja-choice-04c-3",
        text: "One more pass. Maximize mission effectiveness.",
        consequences: { aggressive_tactics: true, fuel_risk: true },
        psychologyEffects: { morale: 12, loyalty: 5, awareness: 5 },
        nextScene: "ja-scene-05"
      }
    ]
  },

  // ═══ SCENE 05: CONVERGENCE ═══
  {
    id: "ja-scene-05",
    narrative: `1015 hours. The carrier Akagi rises from the horizon. Your fuel gauge needle touches red—or doesn't, depending on your choices. Behind you, Pearl Harbor burns. Eight battleships sunk or damaged. The American Pacific Fleet crippled. Mission accomplished.

But as you circle for landing, you see what's missing: the carriers. Enterprise, Lexington, Saratoga—all at sea. Untouched. Your squadron lost aircraft. The bomber groups lost more. You touch down. Deck crews swarm your Zero. An officer with a clipboard asks for your damage assessment.

Around you, pilots climb from cockpits. Some jubilant. Some silent. Commander Fuchida argues with Admiral Nagumo about a third wave strike. You think about the burning ships, the men in the water, the carriers that weren't there. You think about what happens next.`,
    apThemes: ["causation", "continuity", "argumentation"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: null,
    ambientTrack: "425268__77pacer__airplanetank-engine-sound.wav",
    choices: [
      {
        id: "ja-choice-05-final",
        text: "Complete your report.",
        consequences: { mission_complete: true },
        psychologyEffects: { morale: 0, loyalty: 0, awareness: 0 },
        nextScene: "outcome"
      }
    ]
  }
];

export default branchingScenes;
