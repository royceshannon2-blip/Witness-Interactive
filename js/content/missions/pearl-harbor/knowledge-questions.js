/**
 * Pearl Harbor Mission - Knowledge Checkpoint Questions
 * 
 * AP US History style multiple-choice questions for each role.
 * Each question is role-specific and tagged with AP reasoning skills.
 * 
 * AP Reasoning Skills:
 * - causation: Understanding cause-and-effect relationships
 * - continuity: Understanding change and continuity over time
 * - perspective: Understanding different historical perspectives
 * - argumentation: Making and supporting historical arguments
 * 
 * Requirements: 9.2, 9.3, 24.4
 */

/**
 * Knowledge Questions Array
 * Each question includes:
 * - id: Unique identifier
 * - roleSpecific: Which role this question is for
 * - apSkill: AP reasoning skill being assessed
 * - question: The question text
 * - options: Array of 4 answer choices with correct flag
 * - explanation: Educational explanation of the correct answer
 */
const knowledgeQuestions = [
  // Japanese Naval Aviator Questions
  {
    id: 'ph-ja-q-01',
    roleSpecific: 'japanese-aviator',
    apSkill: 'causation',
    question: 'Which factor most directly contributed to Japan\'s decision to launch the attack on Pearl Harbor in December 1941?',
    options: [
      {
        id: 'a',
        text: 'The U.S. oil embargo imposed after Japan\'s invasion of French Indochina',
        correct: true
      },
      {
        id: 'b',
        text: 'Japan\'s desire to colonize the Hawaiian Islands',
        correct: false
      },
      {
        id: 'c',
        text: 'The U.S. declaration of war on Germany in 1941',
        correct: false
      },
      {
        id: 'd',
        text: 'Japanese alliance with the Soviet Union',
        correct: false
      }
    ],
    explanation: 'The U.S. oil embargo, imposed in July 1941 after Japan occupied French Indochina, cut off 80% of Japan\'s oil supply. This economic pressure forced Japan to choose between withdrawing from China (unacceptable to military leadership) or seizing oil-rich territories in Southeast Asia. The attack on Pearl Harbor was designed to cripple the U.S. Pacific Fleet and prevent American interference with Japan\'s planned expansion into the Dutch East Indies and Southeast Asia. Content rephrased for compliance with licensing restrictions.'
  },
  {
    id: 'ph-ja-q-02',
    roleSpecific: 'japanese-aviator',
    apSkill: 'perspective',
    question: 'From the Japanese military perspective in 1941, what was the primary strategic objective of attacking Pearl Harbor?',
    options: [
      {
        id: 'a',
        text: 'To force an immediate U.S. surrender',
        correct: false
      },
      {
        id: 'b',
        text: 'To prevent U.S. interference with Japanese expansion in Southeast Asia',
        correct: true
      },
      {
        id: 'c',
        text: 'To capture Hawaii as a military base',
        correct: false
      },
      {
        id: 'd',
        text: 'To demonstrate Japanese air superiority to European powers',
        correct: false
      }
    ],
    explanation: 'Admiral Yamamoto and Japanese military planners viewed the attack as a pre-emptive strike to neutralize the U.S. Pacific Fleet while Japan secured resource-rich territories in Southeast Asia, particularly the Dutch East Indies\' oil fields. The goal was not conquest of Hawaii or immediate U.S. defeat, but rather to buy time for Japan to establish a defensive perimeter before America could mobilize its industrial capacity. However, the attack failed to destroy U.S. aircraft carriers (all were at sea) and unified American public opinion for war. Content rephrased for compliance with licensing restrictions.'
  },
  {
    id: 'ph-ja-q-03',
    roleSpecific: 'japanese-aviator',
    apSkill: 'continuity',
    question: 'What long-term consequence of the Pearl Harbor attack most significantly shaped the Pacific War\'s outcome?',
    options: [
      {
        id: 'a',
        text: 'The destruction of all eight U.S. battleships',
        correct: false
      },
      {
        id: 'b',
        text: 'The survival of U.S. aircraft carriers and the shift to carrier-based warfare',
        correct: true
      },
      {
        id: 'c',
        text: 'The capture of American military codes',
        correct: false
      },
      {
        id: 'd',
        text: 'The immediate Japanese invasion of Hawaii',
        correct: false
      }
    ],
    explanation: 'All three U.S. aircraft carriers (Enterprise, Lexington, Saratoga) were at sea during the attack and survived undamaged. This proved decisive because World War II in the Pacific became primarily a carrier war, not a battleship war. The carriers enabled U.S. victories at Coral Sea and Midway, which turned the tide of the Pacific War. Six of the eight damaged battleships were eventually repaired and returned to service, but carriers—not battleships—determined naval supremacy in the Pacific theater. Content rephrased for compliance with licensing restrictions.'
  },

  // American Sailor (USS Arizona) Questions
  {
    id: 'ph-as-q-01',
    roleSpecific: 'american-sailor',
    apSkill: 'causation',
    question: 'What factor best explains why the USS Arizona suffered such catastrophic casualties (1,177 killed) compared to other battleships at Pearl Harbor?',
    options: [
      {
        id: 'a',
        text: 'The ship was the primary target of the Japanese attack',
        correct: false
      },
      {
        id: 'b',
        text: 'An armor-piercing bomb penetrated the forward magazine, causing a massive explosion',
        correct: true
      },
      {
        id: 'c',
        text: 'The crew was unprepared and failed to respond to the attack',
        correct: false
      },
      {
        id: 'd',
        text: 'The ship was positioned furthest from shore',
        correct: false
      }
    ],
    explanation: 'At approximately 8:06 AM, a 1,760-pound armor-piercing bomb (converted from a naval shell) struck Arizona near Turret II and penetrated to the forward magazine. The resulting explosion of over a million pounds of gunpowder lifted the 33,000-ton battleship out of the water and killed most of the crew instantly. The ship sank in nine minutes. While other battleships were damaged by torpedoes and bombs, none suffered a magazine detonation of this magnitude. The Arizona remains on the harbor bottom as a memorial to the 1,177 sailors who died. Content rephrased for compliance with licensing restrictions.'
  },
  {
    id: 'ph-as-q-02',
    roleSpecific: 'american-sailor',
    apSkill: 'perspective',
    question: 'How did the experience of sailors at Pearl Harbor on December 7, 1941, reflect broader American attitudes toward the war before the attack?',
    options: [
      {
        id: 'a',
        text: 'Sailors were fully prepared for war and expecting an attack',
        correct: false
      },
      {
        id: 'b',
        text: 'The surprise attack mirrored America\'s isolationist stance and unpreparedness for war',
        correct: true
      },
      {
        id: 'c',
        text: 'Sailors had been conducting war games against Japan for months',
        correct: false
      },
      {
        id: 'd',
        text: 'The military had evacuated most personnel in anticipation of conflict',
        correct: false
      }
    ],
    explanation: 'The attack occurred on a Sunday morning when many sailors were ashore on liberty, anti-aircraft ammunition was locked away, and ships were in peacetime configuration. This reflected broader American isolationist sentiment—despite war raging in Europe and Asia, most Americans opposed direct involvement. The shock of Pearl Harbor transformed public opinion overnight: before December 7, polls showed 80% of Americans opposed entering the war; after the attack, millions volunteered for military service. The attack ended American isolationism and united the nation for total war. Content rephrased for compliance with licensing restrictions.'
  },
  {
    id: 'ph-as-q-03',
    roleSpecific: 'american-sailor',
    apSkill: 'argumentation',
    question: 'Which argument best supports the claim that Pearl Harbor was a strategic failure for Japan despite its tactical success?',
    options: [
      {
        id: 'a',
        text: 'Japan lost too many aircraft during the attack',
        correct: false
      },
      {
        id: 'b',
        text: 'The attack unified American public opinion and mobilized U.S. industrial capacity for total war',
        correct: true
      },
      {
        id: 'c',
        text: 'The U.S. immediately launched a counterattack on Japan',
        correct: false
      },
      {
        id: 'd',
        text: 'Japan failed to capture any Hawaiian territory',
        correct: false
      }
    ],
    explanation: 'While Japan achieved tactical surprise and damaged eight battleships, the attack had catastrophic strategic consequences. It transformed American public opinion from isolationist to interventionist overnight, unified the nation for total war, and mobilized America\'s vast industrial capacity against Japan. Admiral Yamamoto reportedly said, "I fear all we have done is to awaken a sleeping giant and fill him with a terrible resolve." Japan won a battle but ensured it could not win the war—America\'s industrial output would eventually produce more ships, aircraft, and weapons than Japan could match. The attack also failed to destroy U.S. carriers or fuel depots, critical oversights. Content rephrased for compliance with licensing restrictions.'
  },

  // American Civilian Questions
  {
    id: 'ph-ac-q-01',
    roleSpecific: 'american-civilian',
    apSkill: 'perspective',
    question: 'What aspect of the Pearl Harbor attack most clearly demonstrates the complexity of civilian experiences during wartime?',
    options: [
      {
        id: 'a',
        text: 'Civilians were not affected by the military attack',
        correct: false
      },
      {
        id: 'b',
        text: 'Most civilian casualties resulted from American anti-aircraft shells falling on residential areas',
        correct: true
      },
      {
        id: 'c',
        text: 'All civilians were evacuated before the attack began',
        correct: false
      },
      {
        id: 'd',
        text: 'Japanese planes specifically targeted civilian neighborhoods',
        correct: false
      }
    ],
    explanation: 'Of the 49 civilians killed on Oahu during the attack, most died from American anti-aircraft shells that failed to detonate in the air and instead fell on residential areas in Honolulu and surrounding neighborhoods. This tragic "friendly fire" illustrates how civilians become casualties of war even when not directly targeted, and how defensive measures can have unintended consequences. The civilian experience at Pearl Harbor—being killed by weapons meant to protect them—demonstrates the moral complexity and human cost of total war, where clear lines between combatant and non-combatant blur. Content rephrased for compliance with licensing restrictions.'
  },
  {
    id: 'ph-ac-q-02',
    roleSpecific: 'american-civilian',
    apSkill: 'continuity',
    question: 'How did the Pearl Harbor attack lead to significant changes in the treatment of Japanese Americans in Hawaii and on the mainland?',
    options: [
      {
        id: 'a',
        text: 'Japanese Americans were immediately granted full citizenship rights',
        correct: false
      },
      {
        id: 'b',
        text: 'Executive Order 9066 led to the forced relocation and internment of approximately 120,000 Japanese Americans',
        correct: true
      },
      {
        id: 'c',
        text: 'The attack had no effect on Japanese American communities',
        correct: false
      },
      {
        id: 'd',
        text: 'Japanese Americans were recruited to serve as translators immediately after the attack',
        correct: false
      }
    ],
    explanation: 'On February 19, 1942, President Roosevelt signed Executive Order 9066, which authorized the forced removal of approximately 120,000 Japanese Americans (two-thirds of whom were U.S. citizens) from the West Coast to internment camps. This action, driven by wartime hysteria, racial prejudice, and unfounded fears of espionage, represented one of the most significant violations of civil liberties in American history. In 1988, the U.S. government formally apologized and provided reparations to surviving internees, acknowledging the actions were based on "race prejudice, war hysteria, and a failure of political leadership." Content rephrased for compliance with licensing restrictions.'
  },
  {
    id: 'ph-ac-q-03',
    roleSpecific: 'american-civilian',
    apSkill: 'causation',
    question: 'What immediate effect did the Pearl Harbor attack have on American foreign policy and public opinion?',
    options: [
      {
        id: 'a',
        text: 'America maintained its isolationist stance but increased military spending',
        correct: false
      },
      {
        id: 'b',
        text: 'The attack transformed America from isolationism to full engagement in World War II',
        correct: true
      },
      {
        id: 'c',
        text: 'Public opinion remained divided about entering the war',
        correct: false
      },
      {
        id: 'd',
        text: 'America declared war on Germany but remained neutral toward Japan',
        correct: false
      }
    ],
    explanation: 'The Pearl Harbor attack instantly transformed American public opinion and foreign policy. Before December 7, 1941, isolationist sentiment dominated—most Americans opposed entering World War II despite conflicts in Europe and Asia. President Roosevelt\'s "Day of Infamy" speech on December 8 led to a declaration of war on Japan (with only one dissenting vote in Congress). Germany and Italy then declared war on the U.S. on December 11, bringing America fully into World War II. The attack ended two decades of isolationism and committed America to global engagement, fundamentally reshaping U.S. foreign policy for the remainder of the 20th century. Content rephrased for compliance with licensing restrictions.'
  }
];

// Export for mission.js to import
export default knowledgeQuestions;
