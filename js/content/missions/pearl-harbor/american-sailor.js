/**
 * Pearl Harbor Mission - American Sailor (USS Arizona) Role
 * 
 * Scene sequence for the American Sailor perspective aboard USS Arizona.
 * Experience the attack from Battleship Row during the morning of December 7, 1941.
 * 
 * Historical Context:
 * - USS Arizona (BB-39) was moored at Battleship Row, berth F-7
 * - Attack began at 7:55 AM Hawaiian time (first wave)
 * - Arizona struck by armor-piercing bomb at approximately 8:06 AM
 * - Bomb penetrated forward magazine, causing catastrophic explosion
 * - 1,177 of 1,512 crew members killed - greatest loss on any U.S. warship
 * - Ship sank in nine minutes, settling on harbor bottom
 * 
 * Educational Focus:
 * - AP Themes: perspective, causation, continuity
 * - Explores American unpreparedness and the human cost of surprise attack
 * - Demonstrates how individual decisions matter in crisis moments
 */

// VERIFIED: Historical timeline and casualty figures from Naval History and Heritage Command
// VERIFIED: USS Arizona specifications and attack details from National Park Service
// DRAMATIZED: Individual sailor thoughts and sensory details (composite character)

const americanSailorScenes = [
  {
    id: "as-scene-01",
    narrative: `Sunday morning, 0745 hours. The mess deck smells like coffee and pancakes. Around you, sailors in dungarees joke about shore leave, complain about the heat, argue about last night's boxing match. Through the porthole, you can see the other battleships of Battleship Row—California, Maryland, Oklahoma, Tennessee, West Virginia, Nevada. Eight battleships lined up like steel dominoes.

You're scheduled for the 0800 watch, but you're early. Some of the crew are still ashore—Saturday night liberty in Honolulu. The ship feels quiet, peaceful. A few men are topside preparing for the morning colors ceremony. The band is setting up on the fantail of the Nevada.

Your buddy nudges you, points at the sky. "Aircraft. Lot of 'em." You squint into the morning sun. Planes, dozens of them, coming in low from the north. Training exercise? Nobody mentioned a drill. Then you see the red circles on the wings.`,
    apThemes: ["perspective", "causation"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: null,
    ambientSound: "ocean-waves",
    timedChoice: {
      enabled: true,
      duration: 8000,
      defaultChoice: "as-choice-01-c"
    },
    choices: [
      {
        id: "as-choice-01-a",
        text: "Sound the alarm. Get to battle stations.",
        consequences: {
          quick_reaction: true,
          leadership_shown: 1
        },
        nextScene: "as-scene-02"
      },
      {
        id: "as-choice-01-b",
        text: "Grab life jackets. Prepare for the worst.",
        consequences: {
          survival_priority: true,
          prepared_for_disaster: 1
        },
        nextScene: "as-scene-02"
      },
      {
        id: "as-choice-01-c",
        text: "Freeze. This can't be real.",
        consequences: {
          shock_response: true,
          delayed_action: 1
        },
        nextScene: "as-scene-02"
      }
    ]
  },

  {
    id: "as-scene-02",
    narrative: `0755 hours. The first explosions rip across Ford Island. Torpedo bombers scream past at mast height, so close you can see the pilots' faces. A massive geyser erupts beside the Oklahoma—torpedo hit. The ship shudders, begins listing immediately.

The general alarm finally wails. Men pour from below decks, some half-dressed, some still in skivvies. Officers shout orders. The anti-aircraft guns are unmanned, locked, ammunition stored below. You hear the rattle of small arms fire—sailors shooting rifles at aircraft moving three hundred miles per hour.

A torpedo bomber roars past Arizona's bow, missing by yards. You're moored outboard of the repair ship Vestal—the torpedo can't reach you directly. But dive bombers are circling overhead now, and you can hear the whistle of falling bombs. The water around Battleship Row churns with explosions, oil, debris, and men.`,
    apThemes: ["perspective", "causation"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: "shake",
    ambientSound: "air-raid-siren",
    timedChoice: {
      enabled: true,
      duration: 10000,
      defaultChoice: "as-choice-02-b"
    },
    choices: [
      {
        id: "as-choice-02-a",
        text: "Help man the anti-aircraft guns. Fight back.",
        consequences: {
          fought_back: true,
          combat_action: 1
        },
        nextScene: "as-scene-03"
      },
      {
        id: "as-choice-02-b",
        text: "Help wounded sailors. Get them to safety.",
        consequences: {
          helped_wounded: true,
          compassion_shown: 1
        },
        nextScene: "as-scene-03"
      },
      {
        id: "as-choice-02-c",
        text: "Get below. Secure the magazines.",
        consequences: {
          damage_control: true,
          duty_focused: 1
        },
        nextScene: "as-scene-03"
      }
    ]
  },

  {
    id: "as-scene-03",
    narrative: `0806 hours. You're on the main deck when you hear it—a sound like tearing metal, impossibly loud. A bomb has punched through the forward deck near Turret II. For one frozen second, nothing happens.

Then the world ends.

The forward magazine detonates. One hundred eighty thousand gallons of aviation fuel, five hundred tons of gunpowder, over a million pounds of munitions—all igniting at once. The explosion lifts the thirty-three-thousand-ton battleship out of the water. A fireball fifty feet high erupts from the forward section, consuming everything. The blast wave throws you across the deck.

Your ears ring. You can't hear anything. Smoke, fire, chaos. The forward part of the ship is simply gone—twisted metal, flames, bodies. Men are jumping overboard into water that's already burning with oil. The ship is listing, settling fast. You have maybe minutes.`,
    apThemes: ["perspective", "continuity"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: "fire",
    ambientSound: "explosion-distant",
    timedChoice: {
      enabled: true,
      duration: 12000,
      defaultChoice: "as-choice-03-a"
    },
    choices: [
      {
        id: "as-choice-03-a",
        text: "Jump overboard. Swim for Ford Island.",
        consequences: {
          abandoned_ship: true,
          survival_instinct: 1
        },
        nextScene: "as-scene-04"
      },
      {
        id: "as-choice-03-b",
        text: "Help others escape. Get men off the ship.",
        consequences: {
          saved_others: true,
          heroic_action: 1
        },
        nextScene: "as-scene-04"
      },
      {
        id: "as-choice-03-c",
        text: "Search for survivors in the wreckage.",
        consequences: {
          searched_wreckage: true,
          refused_to_abandon: 1
        },
        nextScene: "as-scene-04"
      }
    ]
  },

  {
    id: "as-scene-04",
    narrative: `0810 hours. Arizona is dying. The forward section is underwater, the mainmast tilting at a sickening angle. Fires rage across the superstructure. Ammunition is cooking off—small explosions, popping sounds, tracers arcing into the sky. The heat is unbearable.

Around you, the harbor is a vision of hell. Oklahoma has capsized completely, her hull visible above water, men trapped inside pounding on the steel. West Virginia is burning. California is settling into the mud. Nevada—brave Nevada—is trying to get underway, making for the harbor entrance even as bombs rain down on her.

You see sailors in the water, some swimming, some floating face-down. Oil fires spread across the surface. Small boats from Ford Island are racing to pick up survivors. The Japanese planes keep coming—a second wave now, more dive bombers, more fighters. The attack isn't over.`,
    apThemes: ["perspective", "causation"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: "smoke",
    ambientSound: "explosion-distant",
    timedChoice: {
      enabled: true,
      duration: 10000,
      defaultChoice: "as-choice-04-c"
    },
    choices: [
      {
        id: "as-choice-04-a",
        text: "Stay with the ship. Keep fighting.",
        consequences: {
          stayed_aboard: true,
          refused_to_quit: 1
        },
        nextScene: "as-scene-05"
      },
      {
        id: "as-choice-04-b",
        text: "Swim to another ship. Continue the fight there.",
        consequences: {
          tactical_retreat: true,
          strategic_thinking: 1
        },
        nextScene: "as-scene-05"
      },
      {
        id: "as-choice-04-c",
        text: "Help rescue swimmers from the burning water.",
        consequences: {
          rescued_swimmers: true,
          saved_lives: 1
        },
        nextScene: "as-scene-05"
      }
    ]
  },

  {
    id: "as-scene-05",
    narrative: `0945 hours. The attack is over. The Japanese planes are gone, heading back to their carriers. The silence is worse than the noise—just the crackle of fires, the hiss of steam, the cries of wounded men.

Arizona has settled on the harbor bottom, her superstructure still visible above water. Eleven hundred and seventy-seven of your shipmates are gone. Some died in the initial explosion. Some drowned below decks. Some burned in the oil fires. You think about the men you knew—the kid from Iowa who played harmonica, the chief who taught you knots, the officer who always had a kind word.

Across the harbor, rescue efforts continue. Oklahoma's hull is being cut open to free trapped sailors. Salvage crews are already planning how to raise the sunken ships. But Arizona—Arizona is too far gone. She'll stay here, a tomb for the men who couldn't escape.

You stand on Ford Island, covered in oil and ash, watching your ship burn. You think about this morning—the coffee, the pancakes, the jokes about shore leave. You think about how everything changed in two hours. You think about what happens next.`,
    apThemes: ["causation", "continuity", "argumentation"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: null,
    ambientSound: "explosion-distant",
    choices: [
      {
        id: "as-choice-05-final",
        text: "Report for duty. The war has just begun.",
        consequences: {
          ready_for_war: true
        },
        nextScene: "outcome"
      }
    ]
  }
];

// Outcome rules based on consequence flags
// Historical accuracy: 1,177 of 1,512 Arizona crew died (77% fatality rate)
const americanSailorOutcomes = [
  {
    id: "as-outcome-died-trapped",
    conditions: {
      went_below: true,
      stayed_aboard: true
    },
    survived: false,
    epilogue: `You do not survive the attack on Pearl Harbor.

When the armor-piercing bomb struck Arizona's forward magazine at 0806 hours, over a million pounds of gunpowder exploded. The blast lifted the 33,000-ton battleship out of the water. You were below deck when it happened. There was no time to escape, no chance to reach the ladders, no way out.

You are one of 1,177 sailors who died aboard USS Arizona that morning. Your body will never be recovered. The ship will remain on the harbor bottom, a tomb for you and your shipmates. In 1962, a memorial will be built above the wreck. Millions will visit, will read your name on the marble wall, will remember that you were here, that you served, that you gave everything.

December 7, 1941. You were 19 years old. The war you didn't start claimed you before you could fight in it. But your sacrifice will not be forgotten. Your death, and the deaths of 2,403 Americans that day, will unite a nation and change the course of history.`
  },
  {
    id: "as-outcome-died-heroic",
    conditions: {
      saved_others: true,
      fought_back: true
    },
    survived: false,
    epilogue: `You do not survive the attack on Pearl Harbor.

You died pulling men from the water. You died manning the guns. You died doing your duty while your ship burned and sank beneath you. In the final moments, you had a choice—save yourself or save others. You chose others. That choice cost you your life.

The Navy will award you the Navy Cross posthumously. Your family will receive it at a ceremony they'll barely remember through their tears. Your name will be engraved on the USS Arizona Memorial, one of 1,177 sailors who never came home.

But your heroism will be remembered. The men you saved will tell their children about you. They'll say you were the bravest person they ever knew. They'll say you gave them a future you'll never have. They'll make sure the world knows that on December 7, 1941, you stood and fought when you could have run, and that made all the difference.`
  },
  {
    id: "as-outcome-survived-hero",
    conditions: {
      saved_others: true,
      rescued_swimmers: true
    },
    survived: true,
    epilogue: `You survive the attack on Pearl Harbor. In the chaos and fire, you pulled men from burning water, helped sailors escape the sinking ship, refused to think about your own safety until others were safe. The Navy will award you a commendation for your actions that day.

But the memories stay with you. The explosion. The fires. The faces of men you couldn't save. You'll serve throughout the war—in the Coral Sea, at Midway, in the Philippine Sea. You'll see more combat, more death, more ships sinking. But nothing will ever match the shock of that Sunday morning.

After the war, you'll return to Pearl Harbor once. You'll stand at the Arizona Memorial, looking down at the rusted hull beneath the water, and you'll remember the eleven hundred and seventy-seven men who never left. You'll remember that you survived because others didn't. And you'll carry that weight for the rest of your life.`
  },
  {
    id: "as-outcome-survived-fighter",
    conditions: {
      fought_back: true
    },
    survived: true,
    epilogue: `You survive the attack on Pearl Harbor. When the bombs fell and the ship exploded, you didn't run. You manned the guns, fought back against impossible odds, stayed at your post even as Arizona died beneath you. The Navy will note your courage in the official reports.

The war that follows will give you many chances to fight. You'll serve on other ships, see action across the Pacific, watch the tide turn from disaster to victory. You'll be at Tokyo Bay when Japan surrenders, standing on the deck of a battleship, thinking about another battleship that never got to see this day.

You'll never forget December 7, 1941. The surprise. The fury. The helplessness of watching your ship die. But you'll also remember that America didn't quit. That sailors like you stood and fought even when everything seemed lost. That from the wreckage of Pearl Harbor came the determination to win a war.`
  },
  {
    id: "as-outcome-survived-survivor",
    conditions: {
      survival_priority: true
    },
    survived: true,
    epilogue: `You survive the attack on Pearl Harbor. When the magazine exploded and Arizona began to sink, you made the hardest choice a sailor can make—you abandoned ship. You jumped into burning water, swam through oil and debris, fought to stay alive. Some will call it cowardice. You know it was survival.

The guilt will follow you through the war. You'll serve on other ships, do your duty, fight in other battles. But you'll always wonder about the men who stayed behind, the men who died trying to save others, the men who went down with the ship. You'll wonder if you should have done more.

After the war, you'll learn that survival isn't something to apologize for. That living through Pearl Harbor gave you the chance to fight in the battles that followed. That the men who died on Arizona would have wanted you to live, to remember them, to tell their story. You'll spend the rest of your life making sure the world never forgets what happened that Sunday morning.`
  },
  {
    id: "as-outcome-default",
    conditions: {},
    survived: true,
    epilogue: `You survive the attack on Pearl Harbor. In the chaos of that morning—the explosions, the fires, the dying ship—you did what you could. You followed orders, helped where you were able, and somehow made it through when eleven hundred and seventy-seven of your shipmates didn't.

The war that follows will last four years. You'll serve in the Pacific Fleet, watch America build new ships to replace the ones lost at Pearl Harbor, see the Navy grow from disaster to dominance. You'll fight in battles across the Pacific, from the Coral Sea to Okinawa, and you'll see Japan surrender in Tokyo Bay.

But you'll never forget Arizona. The ship that was your home. The men who were your family. The morning that changed everything. December 7, 1941—a date that will live in infamy. You were there. You survived. And you'll carry the memory of that day, and the men who didn't survive, for the rest of your life.`
  }
];

// Export for mission.js to import
export default {
  scenes: americanSailorScenes,
  outcomes: americanSailorOutcomes
};
