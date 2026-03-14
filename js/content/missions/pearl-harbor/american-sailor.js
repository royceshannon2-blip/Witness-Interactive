/**
 * Pearl Harbor Mission - American Sailor (USS Arizona) Role
 *
 * Historical Context:
 * - USS Arizona (BB-39) moored at Battleship Row, berth F-7
 * - Attack began at 7:55 AM Hawaiian time
 * - Armor-piercing bomb struck forward magazine at approximately 8:06 AM
 * - Catastrophic explosion: 33,000-ton ship lifted out of the water
 * - 1,177 of 1,512 crew members killed — 77.8% fatality rate
 * - Ship sank in nine minutes
 *
 * SURVIVAL ODDS (historically grounded):
 * - Baseline death chance: 78%
 * - Being below deck when the magazine explodes = nearly certain death
 * - Getting off the ship early is the primary survival factor
 * - The 335 who survived (22%) were almost all topside or jumped overboard early
 */

const americanSailorScenes = [
  {
    id: "as-scene-01",
    narrative: `Sunday morning, 0745 hours. The mess deck smells like coffee and pancakes. Around you, sailors in dungarees joke about shore leave, complain about the heat, argue about last night's boxing match. Through the porthole, you can see the other battleships of Battleship Row—California, Maryland, Oklahoma, Tennessee, West Virginia, Nevada. Eight battleships lined up like steel dominoes.

You're scheduled for the 0800 watch, but you're early. Some of the crew are still ashore—Saturday night liberty in Honolulu. The ship feels quiet, peaceful. A few men are topside preparing for the morning colors ceremony. The band is setting up on the fantail of the Nevada.

Your buddy nudges you, points at the sky. "Aircraft. Lot of 'em." You squint into the morning sun. Planes, dozens of them, coming in low from the north. Training exercise? Nobody mentioned a drill. Then you see the red circles on the wings.`,
    apThemes: ["perspective", "causation"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: null,
    ambientTrack: "578524__samsterbirdies__calm-ocean-waves.flac",
    timedChoice: { enabled: true, duration: 8000, defaultChoice: "as-choice-01-c" },
    choices: [
      {
        id: "as-choice-01-a",
        text: "Sound the alarm. Get to battle stations.",
        consequences: { quick_reaction: true, leadership_shown: 1 },
        nextScene: "as-scene-02"
      },
      {
        id: "as-choice-01-b",
        text: "Grab life jackets. Prepare for the worst.",
        consequences: { survival_priority: true, prepared_for_disaster: 1 },
        nextScene: "as-scene-02"
      },
      {
        id: "as-choice-01-c",
        text: "Freeze. This can't be real.",
        consequences: { shock_response: true, delayed_action: 1 },
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
    ambientTrack: "161120__fight2flyphoto__a6m-zero-chasing-p-51d-mustang.wav",
    timedChoice: { enabled: true, duration: 10000, defaultChoice: "as-choice-02-b" },
    choices: [
      {
        id: "as-choice-02-a",
        text: "Help man the anti-aircraft guns. Fight back.",
        consequences: { fought_back: true, combat_action: 1 },
        nextScene: "as-scene-03"
      },
      {
        id: "as-choice-02-b",
        text: "Help wounded sailors. Get them to safety.",
        consequences: { helped_wounded: true, compassion_shown: 1 },
        nextScene: "as-scene-03"
      },
      {
        id: "as-choice-02-c",
        text: "Get below. Secure the magazines.",
        consequences: { damage_control: true, duty_focused: 1 },
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
    ambientTrack: "149966__nenadsimic__muffled-distant-explosion.wav",
    timedChoice: { enabled: true, duration: 12000, defaultChoice: "as-choice-03-a" },
    choices: [
      {
        id: "as-choice-03-a",
        text: "Jump overboard. Swim for Ford Island.",
        consequences: { abandoned_ship: true, survival_swim: 1 },
        nextScene: "as-scene-04"
      },
      {
        id: "as-choice-03-b",
        text: "Help others get off the ship first.",
        consequences: { saved_others: true, selfless_action: 1 },
        nextScene: "as-scene-04"
      },
      {
        id: "as-choice-03-c",
        text: "Stay and fight the fires. The ship can be saved.",
        consequences: { stayed_aboard: true, refused_to_quit: 1 },
        nextScene: "as-scene-04"
      }
    ]
  },

  {
    id: "as-scene-04",
    narrative: `0820 hours. Arizona is settling fast, her superstructure wreathed in fire. The oil on the harbor surface is burning—thick black smoke, orange flame, men screaming in the water. You've made it this far. But the water around the ship is a death trap of burning fuel.

Across the harbor, other ships are fighting back now. The Nevada is actually moving—making a run for the channel, the only battleship to get underway. AA guns on every ship are firing. But it's chaos—no coordination, no clear command structure. Every officer who knew the battle plan is dead or missing.

A launch from Ford Island is pulling men from the water, but it's overwhelmed. You see a group of men trapped on Arizona's fantail, cut off from the water by fire. You also see a line of men swimming toward you from a different direction, exhausted, going under.`,
    apThemes: ["perspective", "causation"],
    apKeyConcept: "KC-7.3.I",
    atmosphericEffect: "shake",
    ambientTrack: "149966__nenadsimic__muffled-distant-explosion.wav",
    timedChoice: { enabled: true, duration: 10000, defaultChoice: "as-choice-04-c" },
    choices: [
      {
        id: "as-choice-04-a",
        text: "Stay with the ship. Keep fighting.",
        consequences: { stayed_aboard: true, refused_to_quit: 1 },
        nextScene: "as-scene-05"
      },
      {
        id: "as-choice-04-b",
        text: "Swim to another ship. Continue the fight there.",
        consequences: { tactical_retreat: true, strategic_thinking: 1 },
        nextScene: "as-scene-05"
      },
      {
        id: "as-choice-04-c",
        text: "Help rescue swimmers from the burning water.",
        consequences: { rescued_swimmers: true, saved_lives: 1 },
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
    ambientTrack: "149966__nenadsimic__muffled-distant-explosion.wav",
    choices: [
      {
        id: "as-choice-05-final",
        text: "Report for duty. The war has just begun.",
        consequences: { ready_for_war: true },
        nextScene: "outcome"
      }
    ]
  }
];

// ΓöÇΓöÇΓöÇ OUTCOMES ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
// DEATH RATE CONTEXT:
// 1,177 of 1,512 Arizona crew died = 77.8% fatality rate.
// The 335 survivors were almost exclusively men who were topside
// and got off the ship before or immediately after the magazine explosion.
// Anyone below deck at 0806 had virtually no chance of survival.

const americanSailorOutcomes = [
  // ΓöÇΓöÇ DEATH OUTCOMES ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

  {
    id: "as-outcome-died-below-deck",
    survived: false,
    conditions: { damage_control: true, duty_focused: 1 },
    deathContext: {
      cause: "Killed below deck when forward magazine detonated",
      historicalRate: "77.8% of USS Arizona crew died. Those below deck at 0806 had near-zero survival rate.",
      yourChoices: "You went below to secure the magazines — the exact location of the catastrophic explosion. When the armor-piercing bomb detonated 500 tons of gunpowder, there was no escape from below decks."
    },
    epilogue: `You do not survive the attack on Pearl Harbor.

You were below deck when it happened. Doing your duty — trying to secure the magazines, protect the ship, follow your training. The armor-piercing bomb punched through the forward deck and into the magazine at 0806 hours. Five hundred tons of gunpowder. One hundred eighty thousand gallons of aviation fuel. All of it at once.

The explosion lifted a 33,000-ton battleship out of the water. Below deck, there was no warning, no time, nothing.

You are one of 1,177 sailors who died aboard USS Arizona on December 7, 1941. Your body will never be recovered — the ship rests on the harbor bottom, a tomb for you and 1,176 others. In 1962, a memorial will be built above the wreck. Your name will be engraved on the marble wall. Millions of visitors will stand above you and read it.

The Navy's investigation will note that the men who went below to secure the magazines acted with exceptional duty and courage. It will also note that none of them survived.`
  },

  {
    id: "as-outcome-died-stayed-aboard",
    survived: false,
    conditions: { stayed_aboard: true, refused_to_quit: 1 },
    deathContext: {
      cause: "Died aboard USS Arizona as the ship sank",
      historicalRate: "Of the crew members who remained aboard after the explosion, survival was extremely rare. The ship sank in 9 minutes.",
      yourChoices: "You stayed aboard to fight. USS Arizona sank in nine minutes. The men who survived were almost exclusively those who jumped overboard immediately after the explosion."
    },
    epilogue: `You do not survive the attack on Pearl Harbor.

You stayed. You weren't going to abandon your ship, your crew, your post. Even as Arizona burned and settled, you fought the fires, tried to save what couldn't be saved, refused to believe the ship was gone.

Arizona sank in nine minutes. That's how long it took from the magazine explosion to the ship settling on the harbor bottom. Nine minutes. You didn't have enough time.

You are one of 1,177 sailors who died aboard USS Arizona. The official Navy records will note that you were among those who remained at their posts. There is honor in that. But there is also the hard truth that in the chaos of that morning, the men who survived were the ones who got off the ship immediately — and the men who stayed, however brave, were almost all lost.

Your name is on the memorial wall. The harbor water flows over you still.`
  },

  {
    id: "as-outcome-died-heroic",
    survived: false,
    conditions: { saved_others: true, fought_back: true },
    deathContext: {
      cause: "Died helping others escape while the ship sank",
      historicalRate: "Several sailors who stayed to help others escape did not survive themselves.",
      yourChoices: "You prioritized others over yourself. You stayed to help men get off the ship when you could have jumped immediately. It cost you the window of escape."
    },
    epilogue: `You do not survive the attack on Pearl Harbor.

You could have jumped immediately. You could have been in the water, swimming for Ford Island, before the ship began to sink. Instead you helped others — pulled men from the deck, kept the path to the side clear, made sure others went first.

The men you helped will survive. They will remember your name. The Navy will award you the Navy Cross posthumously. Your family will receive it at a ceremony they will barely remember through their grief.

You are one of 1,177 sailors on the Arizona memorial wall. But among those who survived, your name will be spoken differently — as someone who had the chance to live and chose not to take it alone.

That choice cost you your life. It gave others theirs.`
  },

  {
    id: "as-outcome-died-default",
    survived: false,
    conditions: {},
    deathContext: {
      cause: "Killed during the attack on USS Arizona",
      historicalRate: "1,177 of 1,512 USS Arizona crew members died — a 77.8% fatality rate, the highest of any U.S. warship in history.",
      yourChoices: "You were aboard USS Arizona on December 7, 1941. The odds were never in your favor."
    },
    epilogue: `You do not survive the attack on Pearl Harbor.

One thousand one hundred and seventy-seven sailors died on USS Arizona on December 7, 1941. You are one of them. The greatest loss ever suffered by a single U.S. Navy ship. The ship that has become the symbol of that day — still on the harbor bottom, still leaking oil more than eighty years later, what sailors call "the tears of the Arizona."

A memorial stands above the wreck now. Your name is on the white marble wall inside. Millions of people visit each year. They stand above the ship, look down through the water at the rusted hull, and read the names. They read your name.

December 7, 1941. You served. You were there. You did not come home. And the country you served went to war, won that war, and built a memorial above your grave so that no one would ever forget.`
  },

  // ΓöÇΓöÇ SURVIVAL OUTCOMES ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

  {
    id: "as-outcome-survived-hero",
    survived: true,
    conditions: { saved_others: true, rescued_swimmers: true },
    epilogue: `You survive the attack on Pearl Harbor. In the chaos and fire, you pulled men from burning water, helped sailors escape the sinking ship, refused to think about your own safety until others were safe. The Navy will award you a commendation for your actions that day.

But the memories stay with you. The explosion. The fires. The faces of men you couldn't save. You'll serve throughout the war — in the Coral Sea, at Midway, in the Philippine Sea. You'll see more combat, more death, more ships sinking. But nothing will ever match the shock of that Sunday morning.

After the war, you'll return to Pearl Harbor once. You'll stand at the Arizona Memorial, looking down at the rusted hull beneath the water, and you'll remember the 1,177 men who never left. You'll remember that you survived because you kept moving, kept helping, refused to stop. And you'll carry that weight — the weight of the ones you couldn't reach — for the rest of your life.`
  },

  {
    id: "as-outcome-survived-fighter",
    survived: true,
    conditions: { fought_back: true, abandoned_ship: true },
    epilogue: `You survive the attack on Pearl Harbor. When the bombs fell and the ship exploded, you didn't freeze. You manned the guns, fought back against impossible odds, then got off the ship when it was clear she was gone. The Navy will note your courage in the official reports.

The war that follows will give you many chances to fight. You'll serve on other ships, see action across the Pacific, watch the tide turn from disaster to victory. You'll be at Tokyo Bay when Japan surrenders, standing on the deck of a battleship, thinking about another battleship that never got to see this day.

You'll never forget December 7, 1941. The surprise. The fury. The helplessness of watching your ship die. But you'll also remember that America didn't quit. That sailors like you stood and fought even when everything seemed lost. That from the wreckage of Pearl Harbor came the determination that won a war.`
  },

  {
    id: "as-outcome-survived-escape",
    survived: true,
    conditions: { abandoned_ship: true, tactical_retreat: true },
    epilogue: `You survive the attack on Pearl Harbor. When the magazine exploded and Arizona began to sink, you made the hardest choice a sailor can make — you got off the ship. You jumped into burning water, swam through oil and debris, fought to stay alive. Some will call it instinct. You know it was survival.

The guilt will follow you through the war. You'll serve on other ships, do your duty, fight in other battles. But you'll always think about the men who stayed, the men who died trying to save others, the men who went down with the ship. You'll wonder if you should have done more.

After the war, you'll learn that survival isn't something to apologize for. That living through Pearl Harbor gave you the chance to fight in the battles that followed. That the men who died on Arizona would have wanted you to live, to remember them, to tell their story. You'll spend the rest of your life making sure the world never forgets what happened that Sunday morning. That's your duty now.`
  },

  {
    id: "as-outcome-survived-default",
    survived: true,
    conditions: {},
    epilogue: `You survive the attack on Pearl Harbor. In the chaos of that morning — the explosions, the fires, the dying ship — you did what you could. You followed your instincts, helped where you were able, and somehow made it through when 1,177 of your shipmates didn't.

The war that follows will last four years. You'll serve in the Pacific Fleet, watch America build new ships to replace the ones lost at Pearl Harbor, see the Navy grow from disaster to dominance. You'll fight in battles across the Pacific, and you'll see Japan surrender in Tokyo Bay.

But you'll never forget Arizona. The ship that was your home. The men who were your family. The morning that changed everything. December 7, 1941 — a date that will live in infamy. You were there. You survived. And you'll carry the memory of that day, and the men who didn't survive, for the rest of your life.`
  }
];

export default {
  scenes: americanSailorScenes,
  outcomes: americanSailorOutcomes
};
