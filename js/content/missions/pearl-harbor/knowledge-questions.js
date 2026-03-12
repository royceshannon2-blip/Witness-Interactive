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
,

  // Japanese Naval Aviator — Questions 4-7
  {
    id: 'ph-ja-q-04',
    roleSpecific: 'japanese-aviator',
    apSkill: 'argumentation',
    question: 'Which evidence best supports the argument that Japan\'s military leadership underestimated American resolve before the Pearl Harbor attack?',
    options: [
      { id: 'a', text: 'Japan believed the attack would force the U.S. to negotiate a peace settlement', correct: true },
      { id: 'b', text: 'Japan expected the U.S. to surrender its Pacific territories immediately', correct: false },
      { id: 'c', text: 'Japanese admirals predicted the U.S. would need ten years to rebuild', correct: false },
      { id: 'd', text: 'Japan assumed Britain would pressure the U.S. to stay neutral', correct: false }
    ],
    explanation: 'Japanese strategists hoped that a decisive blow against the Pacific Fleet would discourage the U.S. from prolonged war, leading to a negotiated settlement. Admiral Yamamoto, who planned the attack, privately doubted this — he had studied in the U.S. and understood American industrial capacity. His warning about awakening a sleeping giant reflected this concern. The miscalculation was cultural and political: Japanese leadership underestimated how completely the attack would unify American public opinion against Japan.'
  },
  {
    id: 'ph-ja-q-05',
    roleSpecific: 'japanese-aviator',
    apSkill: 'continuity',
    question: 'How did Japan\'s imperial expansion in the 1930s contribute to the conditions that made the Pearl Harbor attack inevitable?',
    options: [
      { id: 'a', text: 'Japan\'s invasion of Manchuria in 1931 began a pattern of expansion that escalated into conflict with the U.S.', correct: true },
      { id: 'b', text: 'Japan\'s alliance with the Soviet Union threatened American interests in the Pacific', correct: false },
      { id: 'c', text: 'Japan\'s democratic reforms in the 1930s were rejected by Western powers', correct: false },
      { id: 'd', text: 'Japan\'s economic depression forced military leaders to seek overseas markets', correct: false }
    ],
    explanation: 'Japan\'s seizure of Manchuria in 1931, followed by full-scale invasion of China in 1937, placed it on a collision course with the U.S. Each step — the Rape of Nanjing, the occupation of French Indochina, the Tripartite Pact with Germany and Italy — triggered increasingly severe American responses, culminating in the 1941 oil embargo. The attack on Pearl Harbor was the endpoint of a decade-long escalation driven by Japanese imperial ambition and American resistance to Asian hegemony.'
  },
  {
    id: 'ph-ja-q-06',
    roleSpecific: 'japanese-aviator',
    apSkill: 'perspective',
    question: 'How did Japanese naval aviators who participated in the Pearl Harbor attack generally describe their experience in postwar accounts?',
    options: [
      { id: 'a', text: 'Most expressed pride in a flawless military operation but acknowledged the strategic miscalculation', correct: true },
      { id: 'b', text: 'Most refused to discuss the attack due to shame over the surprise nature of the raid', correct: false },
      { id: 'c', text: 'Most claimed they were unaware the attack would target a naval base', correct: false },
      { id: 'd', text: 'Most described the attack as an act they personally opposed but were ordered to carry out', correct: false }
    ],
    explanation: 'Postwar accounts from Japanese aviators — including Commander Mitsuo Fuchida, who led the attack — reflect professional pride in the mission alongside acknowledgment that it failed strategically. Fuchida later became a Christian minister and reconciled with American survivors. Many Japanese veterans expressed that they believed they were fighting for their country\'s survival and resource security. Their accounts reveal the complexity of soldiers following orders in a war they did not individually choose.'
  },
  {
    id: 'ph-ja-q-07',
    roleSpecific: 'japanese-aviator',
    apSkill: 'causation',
    question: 'What was the significance of Japan failing to destroy the U.S. Pacific Fleet\'s fuel storage facilities at Pearl Harbor?',
    options: [
      { id: 'a', text: 'The intact fuel depots allowed the U.S. Navy to resume Pacific operations within days', correct: true },
      { id: 'b', text: 'The fuel tanks were protected by underground bunkers Japan could not penetrate', correct: false },
      { id: 'c', text: 'Destroying fuel storage was not part of Japan\'s tactical objectives', correct: false },
      { id: 'd', text: 'The fuel was transferred to civilian ships before the attack began', correct: false }
    ],
    explanation: 'Admiral Nagumo\'s decision not to launch a third wave left approximately 4.5 million barrels of fuel oil untouched at Pearl Harbor. Had these been destroyed, the U.S. Pacific Fleet would have been forced to operate from the West Coast, effectively ceding the Pacific to Japan for months or years. Military historians consider this one of the costliest oversights of the attack. Combined with the survival of the aircraft carriers, the intact fuel reserves allowed the U.S. to mount the Doolittle Raid on Tokyo just four months later.'
  },

  // American Sailor — Questions 4-7
  {
    id: 'ph-as-q-04',
    roleSpecific: 'american-sailor',
    apSkill: 'continuity',
    question: 'How did the USS Arizona Memorial, established in 1962, reflect changing American attitudes toward World War II commemoration?',
    options: [
      { id: 'a', text: 'It marked a shift toward preserving sites of loss as permanent national memorials rather than removing wreckage', correct: true },
      { id: 'b', text: 'It was built to replace the battleship with a replica for educational purposes', correct: false },
      { id: 'c', text: 'It represented a compromise between veterans who wanted the ship raised and those who did not', correct: false },
      { id: 'd', text: 'It was funded entirely by Japanese reparations as part of the 1951 peace treaty', correct: false }
    ],
    explanation: 'The USS Arizona Memorial, dedicated in 1962 and designed by Alfred Preis, represented a new approach to war commemoration — leaving the wreck in place as a tomb for the 1,177 men still aboard. Oil still seeps from the ship daily. The memorial has become a site of reconciliation: Japanese officials including Prime Ministers have visited to pay respects, and surviving American and Japanese veterans have met there. It reflects how national memory evolves from raw grief toward complex historical reckoning.'
  },
  {
    id: 'ph-as-q-05',
    roleSpecific: 'american-sailor',
    apSkill: 'causation',
    question: 'What role did intelligence failures play in the surprise achieved at Pearl Harbor?',
    options: [
      { id: 'a', text: 'U.S. intelligence had intercepted signals indicating a Japanese attack was imminent but failed to identify Pearl Harbor as the target', correct: true },
      { id: 'b', text: 'American codebreakers had no knowledge of Japanese intentions before the attack', correct: false },
      { id: 'c', text: 'The U.S. deliberately allowed the attack to justify entering the war', correct: false },
      { id: 'd', text: 'Japan used unbreakable codes that American cryptographers could not penetrate', correct: false }
    ],
    explanation: 'U.S. signals intelligence had broken Japanese diplomatic codes and knew war was imminent — a war warning was sent to Pacific commanders on November 27, 1941. However, analysts expected an attack on British Malaya or the Philippines, not Hawaii. Pearl Harbor was considered too shallow for torpedo attacks and too far from Japan for a carrier strike. This combination of correct intelligence and incorrect threat assessment produced one of history\'s most consequential intelligence failures.'
  },
  {
    id: 'ph-as-q-06',
    roleSpecific: 'american-sailor',
    apSkill: 'perspective',
    question: 'How did African American sailors\' experience at Pearl Harbor reflect broader racial inequalities in the U.S. military in 1941?',
    options: [
      { id: 'a', text: 'Black sailors were largely restricted to mess duties but some performed heroic acts during the attack', correct: true },
      { id: 'b', text: 'The Navy was fully integrated by 1941 following Roosevelt\'s executive order', correct: false },
      { id: 'c', text: 'African Americans were not permitted to serve in the Navy until after Pearl Harbor', correct: false },
      { id: 'd', text: 'Black sailors commanded their own segregated ships during the battle', correct: false }
    ],
    explanation: 'In 1941, the Navy assigned Black sailors almost exclusively to mess attendant roles. Doris "Dorie" Miller, a mess attendant aboard the USS West Virginia, became one of Pearl Harbor\'s most celebrated heroes when he manned an anti-aircraft gun he had never been trained to use and fired on Japanese aircraft. He was awarded the Navy Cross but remained barred from combat roles. His story illustrates the contradiction of Black Americans fighting for a democracy that denied them equal rights.'
  },
  {
    id: 'ph-as-q-07',
    roleSpecific: 'american-sailor',
    apSkill: 'argumentation',
    question: 'Which evidence best supports the argument that the U.S. military\'s peacetime posture at Pearl Harbor reflected broader American isolationism?',
    options: [
      { id: 'a', text: 'Anti-aircraft ammunition was stored in locked magazines and ships were in reduced readiness on Sunday morning', correct: true },
      { id: 'b', text: 'The Pacific Fleet had been deliberately moved to Pearl Harbor to provoke Japan', correct: false },
      { id: 'c', text: 'Congress had passed legislation prohibiting military preparedness in the Pacific', correct: false },
      { id: 'd', text: 'Military commanders had received no intelligence about Japanese naval movements', correct: false }
    ],
    explanation: 'The attack found Pearl Harbor in peacetime configuration: ammunition locked, aircraft parked in neat rows, and many officers ashore. This was not negligence but reflected the assumption that war would begin with diplomacy breaking down over days, not a Sunday morning surprise. American isolationism had kept military spending low through the 1930s and created a culture of unpreparedness. The attack exposed the gap between isolationist assumptions and the reality of modern global conflict.'
  },

  // American Civilian — Questions 4-6
  {
    id: 'ph-ac-q-04',
    roleSpecific: 'american-civilian',
    apSkill: 'argumentation',
    question: 'Which argument best explains why the internment of Japanese Americans is considered one of the greatest civil liberties failures in U.S. history?',
    options: [
      { id: 'a', text: 'It targeted U.S. citizens based solely on ethnicity despite no evidence of widespread disloyalty', correct: true },
      { id: 'b', text: 'It violated a specific constitutional amendment protecting Asian Americans', correct: false },
      { id: 'c', text: 'It was carried out without presidential authorization', correct: false },
      { id: 'd', text: 'It applied only to Japanese Americans while ignoring German and Italian Americans entirely', correct: false }
    ],
    explanation: 'Executive Order 9066 authorized the removal of approximately 120,000 people of Japanese ancestry — two-thirds of whom were American citizens — from the West Coast. No equivalent mass internment was imposed on German Americans or Italian Americans. The Supreme Court upheld internment in Korematsu v. United States (1944), a decision widely criticized as wrong. In 1988, the Civil Liberties Act formally apologized and provided $20,000 reparations to surviving internees. The Korematsu decision was formally repudiated by the Supreme Court in 2018.'
  },
  {
    id: 'ph-ac-q-05',
    roleSpecific: 'american-civilian',
    apSkill: 'causation',
    question: 'How did the Pearl Harbor attack transform the role of American women in the wartime economy?',
    options: [
      { id: 'a', text: 'Millions of women entered industrial jobs as men left for military service, permanently expanding women\'s participation in the workforce', correct: true },
      { id: 'b', text: 'Women were immediately conscripted into military service following the attack', correct: false },
      { id: 'c', text: 'Women\'s workforce participation actually declined as families prioritized domestic stability', correct: false },
      { id: 'd', text: 'The government barred women from defense industry jobs to preserve male employment', correct: false }
    ],
    explanation: 'Pearl Harbor\'s entry of the U.S. into WWII triggered massive industrial mobilization that drew millions of women into factory work, symbolized by Rosie the Riveter. Women worked in shipyards, aircraft factories, and munitions plants. By 1944, women comprised 37% of the total workforce. While many were pressured back into domestic roles after the war, the shift permanently altered expectations about women\'s economic capabilities and contributed to the foundation of the postwar women\'s movement.'
  },
  {
    id: 'ph-ac-q-06',
    roleSpecific: 'american-civilian',
    apSkill: 'continuity',
    question: 'How did the Pearl Harbor attack reshape American foreign policy for the remainder of the 20th century?',
    options: [
      { id: 'a', text: 'It ended American isolationism and established a pattern of international engagement that defined the Cold War era', correct: true },
      { id: 'b', text: 'It caused the U.S. to withdraw from international organizations to focus on Pacific security', correct: false },
      { id: 'c', text: 'It led directly to the creation of NATO as a defense against Japanese aggression', correct: false },
      { id: 'd', text: 'It reinforced isolationism by demonstrating the costs of Pacific involvement', correct: false }
    ],
    explanation: 'Pearl Harbor ended two decades of American isolationism rooted in the disillusionment of World War I. After 1945, the U.S. never returned to pre-war disengagement: it joined the United Nations, implemented the Marshall Plan, formed NATO, stationed permanent military bases worldwide, and entered the Korean and Vietnam conflicts. The never-again lesson of Pearl Harbor — that threats must be confronted before they reach American shores — became the foundational logic of Cold War containment policy.'
  }

];

// Export for mission.js to import
export default knowledgeQuestions;
