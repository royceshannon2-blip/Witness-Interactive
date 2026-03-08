/**
 * Pearl Harbor Mission - American Civilian Role
 * 
 * Scene sequence for the American Civilian perspective living near Pearl Harbor.
 * Experience the attack from a residential neighborhood on Oahu.
 * 
 * Historical Context:
 * - 49 civilians killed on Oahu, 35 wounded during the attack
 * - 32 civilians killed in Honolulu alone - most from friendly fire
 * - U.S. anti-aircraft shells failed to detonate properly, fell on civilian areas
 * - Civilians ranged from 3 months to 50 years old
 * - Many civilians worked on military bases and were present during attack
 * - Japanese planes did not intentionally target residential areas
 * 
 * Educational Focus:
 * - AP Themes: perspective, causation, continuity
 * - Explores civilian experience of war and unintended consequences
 * - Demonstrates how military conflict affects non-combatants
 * - Highlights the complexity of "friendly fire" casualties
 */

// VERIFIED: Civilian casualty figures from National Park Service and Pearl Harbor National Memorial
// VERIFIED: Friendly fire details from National WWII Museum and historical records
// DRAMATIZED: Individual civilian thoughts and sensory details (composite character)

export const americanCivilianScenes = [
  {
    id: "ac-scene-01",
    narrative: `Sunday morning, 0745 hours. The smell of coffee drifts from the kitchen. Your small house sits in a neighborhood between Pearl Harbor and Honolulu—close enough to hear the morning bugle calls from the naval base, far enough to feel like home. Through the window, you can see neighbors tending gardens, children playing in yards, the peaceful rhythm of a Sunday morning.

You work as a civilian contractor at Pearl Harbor—shipyard maintenance, nothing glamorous. Today is your day off. You're thinking about church services at 10 AM, maybe a drive to Waikiki Beach afterward. The radio plays music, interrupted occasionally by news about the war in Europe and Asia. It all feels very far away.

Then you hear it. A low rumble, growing louder. Aircraft engines, lots of them. You step outside and look up. The sky is full of planes—dozens, maybe hundreds—flying in tight formations toward the harbor. Your neighbor, a Navy wife, is staring too. "Training exercise?" she asks. Then you see the red circles on the wings.`,
    apThemes: ["perspective", "causation"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: null,
    choices: [
      {
        id: "ac-choice-01-a",
        text: "Get your family to safety. Take shelter immediately.",
        consequences: {
          family_priority: true,
          survival_focused: 1
        },
        nextScene: "ac-scene-02"
      },
      {
        id: "ac-choice-01-b",
        text: "Warn the neighbors. Get everyone inside.",
        consequences: {
          community_minded: true,
          helped_neighbors: 1
        },
        nextScene: "ac-scene-02"
      },
      {
        id: "ac-choice-01-c",
        text: "Try to reach Pearl Harbor. They'll need help.",
        consequences: {
          duty_called: true,
          rushed_to_help: 1
        },
        nextScene: "ac-scene-02"
      }
    ]
  },

  {
    id: "ac-scene-02",
    narrative: `0800 hours. The explosions start. Massive booms from the direction of Pearl Harbor shake your windows, rattle dishes in the cupboard. Black smoke rises in columns—thick, oily, blotting out the morning sun. You can hear the aircraft now—the scream of dive bombers, the rattle of machine guns, the thunder of anti-aircraft fire starting to respond.

Your neighborhood erupts in chaos. People running, shouting, trying to understand what's happening. Car engines starting. Children crying. Someone yells "It's the Japs!" The Navy wife next door is screaming—her husband is on the Arizona. An elderly man stands in his yard, staring at the smoke, frozen.

Then you hear a different sound—a whistling, getting louder. Something is falling from the sky. Not a bomb. Something smaller, spinning, shrieking as it falls. An anti-aircraft shell, you realize. Unexploded. It's going to hit—`,
    apThemes: ["perspective", "causation"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: "shake",
    choices: [
      {
        id: "ac-choice-02-a",
        text: "Dive for cover. Protect yourself.",
        consequences: {
          self_preservation: true,
          took_cover: 1
        },
        nextScene: "ac-scene-03"
      },
      {
        id: "ac-choice-02-b",
        text: "Push the elderly man to safety.",
        consequences: {
          saved_neighbor: true,
            heroic_moment: 1
        },
        nextScene: "ac-scene-03"
      },
      {
        id: "ac-choice-02-c",
        text: "Shout a warning. Get everyone down.",
        consequences: {
          warned_others: true,
          leadership_shown: 1
        },
        nextScene: "ac-scene-03"
      }
    ]
  },

  {
    id: "ac-scene-03",
    narrative: `0830 hours. The shell explodes three houses down. The blast wave hits you like a physical force—hot air, flying debris, the sound of shattering glass. When the dust clears, you see the damage. The house is partially collapsed. Smoke. Fire starting to spread. Someone is screaming inside.

All around your neighborhood, more shells are falling. American shells, fired from the ships in the harbor, from the coastal batteries, aimed at the Japanese planes overhead. But they're not exploding in the air like they're supposed to. They're falling short, hitting homes, hitting streets, hitting people. The irony is bitter—your own military's weapons, meant to protect you, are killing civilians.

You can hear sirens now, but they're all heading toward Pearl Harbor and the military bases. No one is coming to help the neighborhoods. The fire in the damaged house is growing. You can still hear someone inside, calling for help. Other neighbors are emerging from their homes, dazed, bleeding, looking for direction.`,
    apThemes: ["perspective", "continuity"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: "smoke",
    choices: [
      {
        id: "ac-choice-03-a",
        text: "Run into the burning house. Save whoever's inside.",
        consequences: {
          rescued_victim: true,
          risked_life: 1
        },
        nextScene: "ac-scene-04"
      },
      {
        id: "ac-choice-03-b",
        text: "Organize neighbors. Fight the fire together.",
        consequences: {
          organized_response: true,
          community_leader: 1
        },
        nextScene: "ac-scene-04"
      },
      {
        id: "ac-choice-03-c",
        text: "Tend to the wounded. Provide first aid.",
        consequences: {
          helped_wounded: true,
          medical_aid: 1
        },
        nextScene: "ac-scene-04"
      }
    ]
  },

  {
    id: "ac-scene-04",
    narrative: `0915 hours. The attack continues. More planes overhead—a second wave. More explosions from the harbor. More shells falling on civilian areas. You've lost count of how many have hit your neighborhood. The house fire is spreading despite your efforts. Three people are wounded, one seriously. The elderly man you saw earlier is dead—killed by shrapnel from an American shell.

A car screeches to a stop. A civilian defense volunteer, armband hastily tied on, shouting instructions: "Evacuate! Get away from the harbor! Head inland!" But where? How? Some people have cars, most don't. The roads are clogged. And the shells keep falling—you can hear them whistling down, random, unpredictable, deadly.

You see a family—mother, two small children—standing in the street, paralyzed with fear. Their house has been hit. The mother is bleeding from a head wound. The children are crying. A shell explodes two blocks away. Another whistles overhead. The Japanese planes are still attacking, but it's the American shells that are killing people in your neighborhood.`,
    apThemes: ["perspective", "causation"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: "fire",
    choices: [
      {
        id: "ac-choice-04-a",
        text: "Take the family to safety. Get them out of here.",
        consequences: {
          saved_family: true,
          protective_instinct: 1
        },
        nextScene: "ac-scene-05"
      },
      {
        id: "ac-choice-04-b",
        text: "Stay and help more people. You can't leave yet.",
        consequences: {
          stayed_to_help: true,
          selfless_action: 1
        },
        nextScene: "ac-scene-05"
      },
      {
        id: "ac-choice-04-c",
        text: "Try to reach Pearl Harbor. They need every hand.",
        consequences: {
          went_to_harbor: true,
          duty_over_safety: 1
        },
        nextScene: "ac-scene-05"
      }
    ]
  },

  {
    id: "ac-scene-05",
    narrative: `1000 hours. The attack is over. The Japanese planes are gone, heading back to their carriers. But the danger isn't over. Fires burn across the island—in the harbor, on the airfields, in civilian neighborhoods. Smoke darkens the sky. The anti-aircraft guns have finally stopped firing, but the damage is done.

You stand in what's left of your neighborhood. Thirty-two civilians dead in Honolulu alone. Forty-nine across Oahu. Most killed not by Japanese bombs, but by American shells that fell short. Children, elderly, families—killed by the weapons meant to protect them. The bitter irony will haunt you.

But you also see something else. Neighbors helping neighbors. Strangers pulling people from rubble. Civilians rushing to Pearl Harbor to help with rescue efforts. The Navy wife whose husband was on the Arizona, organizing first aid despite her own terror. The elderly shopkeeper sharing his supplies. Americans, civilian and military, coming together in the face of catastrophe.

You think about this morning—the coffee, the peaceful Sunday, the plans for church and the beach. You think about how everything changed in two hours. You think about the war that's coming, the war that's already here. And you think about what it means to be a civilian in a world at war.`,
    apThemes: ["causation", "continuity", "argumentation"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: null,
    choices: [
      {
        id: "ac-choice-05-final",
        text: "Join the rescue efforts. There's work to be done.",
        consequences: {
          continued_helping: true
        },
        nextScene: "outcome"
      }
    ]
  }
];

// Outcome rules based on consequence flags
export const americanCivilianOutcomes = [
  {
    id: "ac-outcome-survived-hero",
    conditions: {
      rescued_victim: true,
      saved_family: true
    },
    survived: true,
    epilogue: `You survive the attack on Pearl Harbor. In the chaos and terror of that morning, you ran into burning buildings, pulled people from wreckage, saved lives while shells fell around you. Your neighborhood will remember you as a hero—the civilian who didn't run, who didn't hide, who helped when it mattered most.

But the memories stay with you. The friendly fire. The American shells killing American civilians. The children crying. The elderly man who died from shrapnel marked "U.S. Navy." The bitter knowledge that most civilian deaths that day came not from enemy action, but from misfired defensive weapons.

You'll spend the war years working at Pearl Harbor, helping rebuild the fleet. You'll see the ships raised, repaired, sent back to fight. You'll watch America transform from shocked victim to determined victor. But you'll never forget December 7, 1941—the day you learned that in war, there are no safe places, no clear lines between combatant and civilian, no guarantees that the weapons meant to protect you won't be the ones that kill you.`
  },
  {
    id: "ac-outcome-survived-community",
    conditions: {
      community_minded: true,
      organized_response: true
    },
    survived: true,
    epilogue: `You survive the attack on Pearl Harbor. When the bombs fell and the shells rained down, you didn't think about yourself. You warned neighbors, organized rescue efforts, brought people together in the face of chaos. Your leadership saved lives that morning.

The war that follows will transform Hawaii. Military law, curfews, blackouts, rationing. The Japanese-American community—your neighbors, your friends—will face suspicion and discrimination despite their loyalty. You'll watch the islands become an armed fortress, watch civilian life subordinated to military necessity.

But you'll also see resilience. Communities rebuilding. Civilians and military working together. The spirit of aloha surviving even in wartime. You'll work in the war effort—civilian defense, shipyard support, whatever is needed. And you'll remember that on the worst day, when everything fell apart, ordinary people came together and helped each other survive.`
  },
  {
    id: "ac-outcome-survived-dutiful",
    conditions: {
      duty_called: true,
      went_to_harbor: true
    },
    survived: true,
    epilogue: `You survive the attack on Pearl Harbor. When the attack began, you didn't think about your own safety. You thought about duty, about the men at the harbor who would need help, about the work that would need to be done. You made it to Pearl Harbor and spent the day pulling sailors from burning water, fighting fires, doing whatever was needed.

The Navy will remember your service. Civilian contractors like you kept the fleet running, helped with the rescue efforts, worked around the clock in the days and weeks that followed. You'll spend the war years at Pearl Harbor, watching the Pacific Fleet rebuild from the ashes, watching America prepare for the long fight ahead.

But you'll carry the weight of that day. The ships you couldn't save. The sailors who died before you could reach them. The knowledge that while you were helping at the harbor, your own neighborhood was being hit by friendly fire. The impossible choice between duty and family, between helping the military and protecting civilians. War, you learned, forces impossible choices. And living with those choices is its own kind of battle.`
  },
  {
    id: "ac-outcome-default",
    conditions: {},
    survived: true,
    epilogue: `You survive the attack on Pearl Harbor. In the chaos of that morning—the explosions, the fires, the falling shells—you did what you could. You helped where you were able, protected who you could protect, and somehow made it through when forty-nine other civilians on Oahu didn't.

The war that follows will last four years. You'll live through the transformation of Hawaii from peaceful territory to military fortress. You'll see the harbor rebuilt, the fleet restored, America mobilized for total war. You'll work in the war effort, contribute to the victory, and watch Japan surrender in 1945.

But you'll never forget the morning of December 7, 1941. The peaceful Sunday that became a nightmare. The Japanese planes overhead. The American shells falling on civilian neighborhoods. The bitter irony of being killed by your own side's weapons. The forty-nine civilians who died—including children, elderly, families—most of them victims of friendly fire.

You survived. But you'll spend the rest of your life remembering those who didn't, and wondering why war always finds a way to kill the innocent.`
  }
];

// Export for mission.js to import
export default {
  scenes: americanCivilianScenes,
  outcomes: americanCivilianOutcomes
};
