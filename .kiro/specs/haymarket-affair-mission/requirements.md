# Requirements Document

## Introduction

The Haymarket Affair mission is the fourth mission in Witness Interactive, covering the events of May 4, 1886 in Chicago. Players experience the labor movement, immigrant working-class life, and law enforcement perspectives through three roles: Lucy Parsons (labor organizer), Karl Brenner (German immigrant machinist), and James Doyle (Pinkerton detective). The mission introduces a new engine mechanic — primary source stimulus documents that unlock mid-scene — and a credibility meter (movement trust) that gates Lucy Parsons' outcomes. Writing follows the Geraldine Brooks register: sensory, immersive, factually grounded. All architecture rules apply: ES6 modules, EventBus, no frameworks, relative asset paths.

This mission is designed for AP US History alignment. Every scene, question, and ripple event is tagged with both AP Reasoning Processes (causation, contextualization, continuity, perspective, argumentation, complexity) and SPICE-T themes (Social, Political, Interaction with Environment, Cultural, Economic, Technological). Unit section numbers (e.g., Unit 6.5) are included alongside key concept codes (KC-5.1.I) for direct teacher curriculum mapping.

## Historical Source Material

All historical content for this mission — scene narratives, stimulus document text, knowledge question stems, ripple event descriptions, and outcome epilogues — MUST be grounded in the primary and secondary sources located at:

**`.kiro/skills/ap-curriculum/references/haymarket_raw_content/`**

This directory contains:
- `Account-of-the-Haymarket-Riot.txt` — Chicago Herald, May 5, 1886 (primary source, Gilder Lehrman Institute). Eyewitness account of the bomb, police response, and crowd. Use for Scene 04 (the bomb) across all three roles and for `hm-doc-4` (Tribune front page framing).
- `ebsco_haymarket_analysis.txt` — EBSCO analysis of the Chicago Herald account (Vaughn, 2021). Covers anti-anarchist media bias, immigrant labor context, August Spies, Albert Parsons, Knights of Labor, and the McCormick shooting causal chain. Use for AP pause question explanations and knowledge question explanations.
- `ebsco_summary.txt` — Summary version of the same EBSCO analysis. Use for quick fact-checking of casualty figures, dates, and key actors.
- `The-Haymarket-Tragedy.txt` — Paul Avrich, *The Haymarket Tragedy* (Princeton UP, 1984). Full scholarly monograph. Use for biographical detail on Albert Parsons, Lucy Parsons, August Spies, Samuel Fielden, Louis Lingg, and the trial/pardon narrative. Consult for outcome epilogues and ripple event descriptions.

**Rule**: Before writing any scene narrative, stimulus document text, or knowledge question, consult the relevant source file(s) above. Do not invent historical details that can be verified or contradicted by these sources. Specific facts to verify: casualty numbers, speaker names and order at the Haymarket meeting, the location of the bomb throw (Crane Brothers building), the identity of the police captain (Captain Ward), the date of the Altgeld pardon (June 26, 1893), and the names of the four executed anarchists (Parsons, Spies, Engel, Fischer).

## Glossary

- **Game_Engine**: The core JavaScript system managing scene transitions, state, and game flow
- **Scene_State_Machine**: The system managing scene transitions and state
- **Consequence_System**: The system tracking player decision flags and calculating outcomes
- **Mission_Registry**: The central catalog of all available missions
- **Event_Bus**: The lightweight pub/sub system for component communication
- **Stimuli_Manager**: New engine component that handles primary source document display mid-scene
- **Stimulus_Document**: A real primary source document (newspaper excerpt, government record, photograph caption) that unlocks during a scene
- **AP_Pause_Question**: An AP-style comprehension question presented after a stimulus document is read
- **Prediction_Question**: An unscored mid-scene question asking the player to predict consequences before they unfold
- **Cross_Role_Question**: A knowledge checkpoint question that asks the player to consider the event from another role's perspective
- **Synthesis_Question**: A post-ripple question connecting Haymarket to broader historical patterns across time
- **Movement_Trust**: A numeric consequence flag (0–5) tracking Lucy Parsons' credibility with the labor movement
- **Knowledge_Checkpoint**: AP-style multiple-choice assessment questions tied to the played role
- **Historical_Ripple**: Animated timeline showing long-term consequences of the Haymarket Affair
- **Briefing_Newspaper**: The Chicago Daily Tribune pre-mission newspaper providing historical context
- **Identity_Card**: The role-specific document displayed before Scene 01
- **Outcome_Condition**: A flag-based or range-based rule evaluated to select the player's epilogue
- **SPICE_T**: The AP framework of six thematic categories: Social, Political, Interaction with Environment, Cultural, Economic, Technological
- **AP_Reasoning_Process**: AP Historical Thinking Skills: causation, contextualization, continuity, perspective, argumentation, complexity
- **hm_**: Prefix for all Haymarket consequence flags (prevents cross-mission contamination)

## Requirements

### Requirement 1: Mission Registration and File Structure

**User Story:** As a content creator, I want the Haymarket mission registered in MissionRegistry and organized in the standard directory structure, so that the engine discovers it automatically.

#### Acceptance Criteria

1. THE Mission_Registry SHALL register the Haymarket mission with id `haymarket-affair`, historicalDate `1886-05-04`, era `Modern`, and unlocked `true`
2. THE Game_Engine SHALL load all Haymarket content from `js/content/missions/haymarket/`
3. THE Game_Engine SHALL organize Haymarket content into these files: `mission.js`, `lucy-parsons.js`, `karl-brenner.js`, `james-doyle.js`, `knowledge-questions.js`, `ripple-intros.js`, `briefing-content.js`, `stimulus-documents.js`
4. WHEN the Timeline_Selector renders, THE Game_Engine SHALL display the Haymarket node at the 1886 chronological position
5. ALL asset paths in Haymarket content files SHALL use relative paths (e.g., `./audio/ambient/hm-ambient-westside-evening.mp3`)
6. ALL consequence flags in Haymarket content files SHALL use the `hm_` prefix

### Requirement 2: Briefing Newspaper System

**User Story:** As a player, I want to read a five-page Chicago Daily Tribune briefing before choosing my role, so that I understand the historical context of the Haymarket Affair before the event unfolds.

#### Acceptance Criteria

1. WHEN a player selects the Haymarket mission, THE Game_Engine SHALL display a five-page briefing newspaper before the role selection screen
2. THE Briefing_Newspaper SHALL present these five pages in order: (1) Industrial Transformation 1871–1885, (2) The Workers — immigrant labor and the Arbeiter-Zeitung, (3) The Eight-Hour Movement and the May 1st strike, (4) The Other Side — Pinkertons and the 1877 Railroad Strike, (5) May 3rd 1886 — McCormick shooting and the Revenge Circular
3. WHEN a player reaches mid-page 4 of the briefing, THE Game_Engine SHALL unlock Stimulus Document `hm-doc-0` (Hayes Federal Troop Deployment Order, 1877)
4. THE Briefing_Newspaper SHALL display the masthead as "Chicago Daily Tribune" with byline "Special Report — Labor Bureau"
5. EACH briefing page SHALL include at least one SPICE_T theme tag and one AP_Reasoning_Process tag in its metadata
6. WHEN a player completes the briefing, THE Game_Engine SHALL transition to the role selection screen

### Requirement 3: Role Identity Cards

**User Story:** As a player, I want to see my character's identity document before the first scene, so that I understand who I am playing and feel immersed in the historical moment.

#### Acceptance Criteria

1. WHEN a player selects the Lucy Parsons role, THE Game_Engine SHALL display a Chicago Police Department Surveillance File as the identity card
2. WHEN a player selects the Karl Brenner role, THE Game_Engine SHALL display a McCormick Reaper Works Employee Record #2847 as the identity card
3. WHEN a player selects the James Doyle role, THE Game_Engine SHALL display a Pinkerton National Detective Agency Operative Assignment CHI-1886-114 as the identity card
4. THE Identity_Card SHALL be displayed after the briefing and before Scene 01 of the selected role
5. WHEN a player dismisses the identity card, THE Game_Engine SHALL transition to Scene 01

### Requirement 4: Stimulus Document Unlock Mechanic (New Engine Feature)

**User Story:** As a player, I want real primary source documents to appear mid-scene, so that I can engage with authentic historical evidence as it becomes relevant to the narrative.

#### Acceptance Criteria

1. WHEN a scene object includes a `stimuliUnlock` array, THE Stimuli_Manager SHALL display each listed document at the appropriate moment during that scene
2. THE Stimuli_Manager SHALL present each stimulus document as an overlay panel with the document title, source attribution, date, and full authentic text
3. WHEN a stimulus document is displayed, THE Stimuli_Manager SHALL present an AP_Pause_Question after the player reads the document
4. THE AP_Pause_Question SHALL include the question text, four answer options, the correct answer, and an explanation citing historical evidence
5. WHEN a player answers an AP_Pause_Question, THE Stimuli_Manager SHALL display whether the answer was correct and show the explanation
6. WHEN a player dismisses a stimulus document panel, THE Game_Engine SHALL resume the scene narrative
7. THE Stimuli_Manager SHALL communicate with other components exclusively via the Event_Bus
8. IF a `stimuliUnlock` array is absent or empty on a scene object, THE Stimuli_Manager SHALL take no action for that scene

### Requirement 5: Three-Phase Question Architecture

**User Story:** As an educator, I want questions woven throughout the experience — before the event, during the story, and after the ripple — so that students build AP-level understanding progressively rather than only at the end.

#### Acceptance Criteria

1. THE Haymarket mission SHALL implement questions in three distinct phases: Before (briefing AP_Pause_Questions on stimulus documents), During (mid-scene Prediction_Questions and AP_Pause_Questions), and After (post-ripple Synthesis_Questions)
2. THE Before phase SHALL use AP_Pause_Questions attached to stimulus documents in the briefing (hm-doc-0 unlocks mid-page 4)
3. THE During phase SHALL include at least one Prediction_Question per role, placed before the bomb scene, asking the player to predict the most immediate consequence of their current decision
4. THE Prediction_Question SHALL be unscored — it presents the question, accepts any answer, and reveals what actually happened after the player responds
5. THE After phase SHALL include at least one Synthesis_Question per role in the knowledge checkpoint that connects Haymarket to a broader historical pattern (labor law, state power, immigrant rights, Red Scare)
6. THE Synthesis_Question SHALL require students to use evidence from all three phases (briefing context, story choices, ripple consequences) to evaluate a historical argument

### Requirement 6: Cross-Role Perspective Questions

**User Story:** As an educator, I want students playing one role to be asked about another role's perspective, so that they develop the AP skill of analyzing multiple viewpoints within a single playthrough.

#### Acceptance Criteria

1. EACH role's knowledge checkpoint SHALL include at least one Cross_Role_Question that asks the player to consider the same event from a different role's perspective
2. THE Cross_Role_Question for Lucy Parsons SHALL ask about the Pinkerton or machinist perspective on the eight-hour movement
3. THE Cross_Role_Question for Karl Brenner SHALL ask about the labor organizer or Pinkerton perspective on the McCormick shooting
4. THE Cross_Role_Question for James Doyle SHALL ask about the labor organizer or machinist perspective on the Haymarket trial
5. EACH Cross_Role_Question SHALL be tagged with AP_Reasoning_Process `perspective` and SPICE_T theme `Political`

### Requirement 7: SPICE-T Tagging

**User Story:** As an educator, I want every scene, ripple event, and knowledge question tagged with SPICE-T themes, so that I can map gameplay to the full AP framework and ensure all six thematic categories are covered.

#### Acceptance Criteria

1. EVERY scene object SHALL include a `spiceT` array with at least one of: `Social`, `Political`, `Interaction with Environment`, `Cultural`, `Economic`, `Technological`
2. EVERY historical ripple event SHALL include a `spiceT` field with at least one SPICE_T theme
3. EVERY knowledge question SHALL include a `spiceT` field with at least one SPICE_T theme
4. ACROSS the three roles' eighteen scenes combined, all six SPICE_T themes SHALL appear at least twice each
5. THE briefing newspaper pages SHALL each include a `spiceT` metadata field

### Requirement 8: AP Reasoning Process Tagging (Extended)

**User Story:** As an educator, I want scenes tagged with the full set of AP Reasoning Processes including contextualization, so that early scenes establishing the pre-event world are correctly labeled.

#### Acceptance Criteria

1. EVERY scene object SHALL include a non-empty `apThemes` array with at least one AP_Reasoning_Process
2. THE valid AP_Reasoning_Process values SHALL be: `causation`, `contextualization`, `continuity`, `perspective`, `argumentation`, `complexity`
3. EVERY scene object SHALL include an `apKeyConcept` field referencing an AP US History key concept (e.g., `KC-5.1.I`)
4. EVERY scene object SHALL include an `apUnit` field with the AP US History unit section number (e.g., `Unit 6.5`)
5. SCENES set before May 4th 1886 (briefing-adjacent scenes establishing the pre-event world) SHALL use `contextualization` as a primary or secondary theme
6. ACROSS the three roles' eighteen scenes combined, all six AP_Reasoning_Process values SHALL appear at least twice each

### Requirement 9: Unit Section Numbers

**User Story:** As a teacher, I want unit section numbers on every scene and question, so that I can directly map gameplay to my AP US History curriculum without cross-referencing key concept codes.

#### Acceptance Criteria

1. EVERY scene object SHALL include an `apUnit` field (e.g., `Unit 6.5`, `Unit 6.6`, `Unit 7.1`)
2. EVERY knowledge question SHALL include an `apUnit` field
3. EVERY historical ripple event SHALL include an `apUnit` field
4. THE Haymarket mission metadata in `mission.js` SHALL include an `apUnits` array listing all unit sections covered: `['Unit 6.5', 'Unit 6.6', 'Unit 7.1']`
5. THE briefing newspaper pages SHALL each include an `apUnit` metadata field

### Requirement 10: Lucy Parsons Role — Six Scenes

**User Story:** As a player choosing Lucy Parsons, I want to experience six scenes spanning late April through August 1886, so that I understand the labor organizer's perspective on the Haymarket Affair.

#### Acceptance Criteria

1. THE Lucy_Parsons role SHALL contain exactly six scenes with IDs `hm-lp-scene-01` through `hm-lp-scene-06`
2. Scene 01 SHALL be set in late April 1886 at a West Indiana Street hall during a sewing women's meeting
3. Scene 02 SHALL present a Pinkerton informant warning three days before May 4th; the informant SHALL be named Wilhelm, an ink pressman who is a named character with specific identifying detail
4. Scene 03 SHALL place Lucy one block from Haymarket Square on the evening of May 4th with children present; SHALL include a Prediction_Question AND a timed choice with duration 10000ms and default choice set to the "stay with children" option (historically grounded — Lucy Parsons did not enter the square)
5. Scene 04 SHALL depict the bomb explosion and chaos with children holding her coat; SHALL use timedChoice with duration 14000ms
6. Scene 05 SHALL be set on the morning of May 5th with the Tribune front page and the Arbeiter-Zeitung decision
7. Scene 06 SHALL be set in August 1886 during the trial sentencing with a final choice about what comes next
8. EACH scene SHALL include `apThemes`, `apKeyConcept`, `apUnit`, `spiceT`, `ambientTrack`, `narratorAudio`, and `stimuliUnlock` fields
9. THE `psychologyEffects` field on choices SHALL use only these keys: `morale`, `loyalty`, `humanity`, `composure` — NOT `awareness`
10. ALL consequence flags SHALL use the `hm_lp_` prefix

### Requirement 11: Karl Brenner Role — Six Scenes

**User Story:** As a player choosing Karl Brenner, I want to experience six scenes as a German immigrant machinist locked out of McCormick, so that I understand the working-class immigrant perspective on the labor movement.

#### Acceptance Criteria

1. THE Karl_Brenner role SHALL contain exactly six scenes with IDs `hm-kb-scene-01` through `hm-kb-scene-06`
2. Scene 01 SHALL establish Karl as a German immigrant machinist reading the Arbeiter-Zeitung during the McCormick lockout; SHALL be tagged with `contextualization` and SPICE_T `Economic`
3. Scene 02 SHALL depict the May 1st eight-hour strike march
4. Scene 03 SHALL place Karl at the McCormick gates on May 3rd during the shooting of strikers; SHALL include a Prediction_Question
5. Scene 04 SHALL show Karl receiving the Revenge Circular and deciding whether to attend the Haymarket meeting
6. Scene 05 SHALL place Karl at Haymarket Square during the bomb explosion
7. Scene 06 SHALL depict the aftermath — the Red Scare arrests and Karl's decision about his identity and future
8. EACH scene SHALL include `apThemes`, `apKeyConcept`, `apUnit`, `spiceT`, `ambientTrack`, `narratorAudio`, and `stimuliUnlock` fields
9. ALL consequence flags SHALL use the `hm_kb_` prefix
10. Karl's coworker Heinrich Müller SHALL appear in at least two scenes as a named character

### Requirement 12: James Doyle Role — Six Scenes

**User Story:** As a player choosing James Doyle, I want to experience six scenes as an undercover Pinkerton operative inside the IWPA, so that I understand the law enforcement and surveillance perspective on the labor movement.

#### Acceptance Criteria

1. THE James_Doyle role SHALL contain exactly six scenes with IDs `hm-jd-scene-01` through `hm-jd-scene-06`
2. Scene 01 SHALL establish James as undercover operative "James Reilly" inside the IWPA, three months into his assignment; SHALL be tagged with `contextualization`
3. Scene 02 SHALL depict James filing a surveillance report on Lucy Parsons and the sewing women's meeting
4. Scene 03 SHALL place James at the McCormick gates on May 3rd in his undercover capacity; SHALL include a Prediction_Question
5. Scene 04 SHALL show James receiving orders from handler Captain William Ward about the Haymarket meeting
6. Scene 05 SHALL place James at Haymarket Square during the bomb explosion, creating a crisis of identity
7. Scene 06 SHALL depict the aftermath — the trials, James's testimony, and the moral weight of his role
8. EACH scene SHALL include `apThemes`, `apKeyConcept`, `apUnit`, `spiceT`, `ambientTrack`, `narratorAudio`, and `stimuliUnlock` fields
9. ALL consequence flags SHALL use the `hm_jd_` prefix
10. Handler Captain William Ward SHALL appear in at least two scenes as a named character

### Requirement 13: Movement Trust Credibility Meter (Lucy Parsons)

**User Story:** As a game designer, I want Lucy Parsons' outcomes to be gated by a movement trust score, so that her choices about solidarity, public speech, and the Arbeiter-Zeitung have meaningful cumulative impact.

#### Acceptance Criteria

1. THE Consequence_System SHALL track a numeric flag `hm_lp_movement_trust` initialized to 0 at role start, with a valid range of 0 to 5
2. WHEN a player makes choices that demonstrate solidarity or public commitment, THE Consequence_System SHALL increment `hm_lp_movement_trust` by 1
3. WHEN a player makes choices that prioritize personal safety over public action, THE Consequence_System SHALL not increment `hm_lp_movement_trust`
4. THE `hm_lp_movement_trust` flag SHALL be explicitly set to 0 in the Lucy Parsons role initialization — it MUST NOT inherit any default value from the psychology system or any other system
4. THE Consequence_System's `calculateOutcome()` function SHALL support range-check conditions of the form `{ hm_lp_movement_trust: { gte: 3 } }` in addition to exact boolean matches
5. WHEN evaluating Lucy Parsons outcomes, THE Game_Engine SHALL select the outcome whose conditions best match the current flags including range-check conditions
6. THE Lucy_Parsons role SHALL have at least three distinct outcomes differentiated by `hm_lp_movement_trust` range

### Requirement 14: Stimulus Documents — Real Primary Sources

**User Story:** As an educator, I want all stimulus documents to contain authentic, quoted primary source text, so that students engage with real historical evidence rather than paraphrased summaries.

#### Acceptance Criteria

1. THE Haymarket mission SHALL include these seven stimulus documents with authentic text: `hm-doc-0` (Hayes Federal Troop Deployment Order 1877), `hm-doc-1a` (Arbeiter-Zeitung excerpt, May 1886), `hm-doc-1b` (BLS wage data, 1880s), `hm-doc-2` (Harper's Weekly cartoon caption/description, 1886), `hm-doc-3` (Revenge Circular, May 3 1886), `hm-doc-4` (Chicago Tribune front page, May 5 1886), `hm-doc-5` (Governor Altgeld pardon message, June 26 1893)
2. EACH stimulus document SHALL contain the authentic quoted text of the primary source (or, for visual sources like the Harper's Weekly cartoon, an accurate description of the image and its caption)
3. EACH stimulus document SHALL include: `id`, `title`, `source`, `date`, `text`, `spiceT`, `apUnit`, and `pauseQuestion` fields
4. THE `pauseQuestion` field SHALL include `question`, `options` (array of four), `correctId`, and `explanation` citing specific historical evidence
5. `hm-doc-0` SHALL unlock during the briefing newspaper at mid-page 4
6. `hm-doc-3` (Revenge Circular) SHALL unlock during Karl Brenner Scene 04 and James Doyle Scene 04
7. `hm-doc-4` (Tribune front page) SHALL unlock during Lucy Parsons Scene 05
8. `hm-doc-5` (Altgeld pardon) SHALL unlock during Lucy Parsons Scene 06

### Requirement 15: Prediction Questions

**User Story:** As an educator, I want unscored prediction questions mid-scene, so that students practice the AP skill of predicting consequences before seeing them unfold.

#### Acceptance Criteria

1. EACH role SHALL include at least one Prediction_Question placed in the scene immediately before the bomb explosion
2. THE Prediction_Question SHALL ask: "What do you predict will be the most immediate consequence of [current situation]?"
3. THE Prediction_Question SHALL present four plausible options without marking any as correct
4. AFTER the player selects an option, THE Game_Engine SHALL reveal what actually happened with a brief historical note
5. THE Prediction_Question SHALL be stored in the scene object as a `predictionQuestion` field (separate from `stimuliUnlock`)
6. THE Prediction_Question SHALL be tagged with `apTheme: 'causation'` and `spiceT: 'Political'`

### Requirement 16: Synthesis Questions

**User Story:** As an educator, I want synthesis questions that connect Haymarket to broader historical patterns across periods, so that students demonstrate AP-level understanding that goes beyond the immediate event.

#### Acceptance Criteria

1. EACH role's knowledge checkpoint SHALL include at least one Synthesis_Question connecting Haymarket to a broader historical pattern
2. THE Synthesis_Question for Lucy Parsons SHALL connect the Haymarket trial to the broader pattern of state suppression of labor organizing (KC-5.1.I, KC-5.4.I) AND SHALL reference at least one event outside the immediate 1886–1938 labor movement period (e.g., Reconstruction-era federal intervention, or post-WWII labor law)
3. THE Synthesis_Question for Karl Brenner SHALL connect immigrant labor participation in the eight-hour movement to the broader pattern of immigrant political engagement (KC-5.2.I) AND SHALL reference the broader immigration patterns of Unit 6 or Unit 7
4. THE Synthesis_Question for James Doyle SHALL connect Pinkerton surveillance to the broader pattern of private and state power used against labor (KC-5.4.I, KC-7.1.I) AND SHALL reference at least one event outside the 1886 period (e.g., Palmer Raids 1919, or HUAC)
5. EACH Synthesis_Question SHALL be tagged with `apSkill: 'argumentation'`, `spiceT: ['Political', 'Economic']`, and the relevant `apUnit`
6. THE correct answer option for each Synthesis_Question SHALL model AP skill 6.D complexity — qualifying or complicating a historical argument rather than simply supporting it (e.g., "X demonstrates Y, but also reveals Z which limited its effectiveness")

### Requirement 17: Ambient Audio System

**User Story:** As a player, I want ambient audio tracks to match each scene's setting, so that the experience feels immersive and historically grounded.

#### Acceptance Criteria

1. THE Haymarket mission SHALL use these ambient audio tracks: `hm-ambient-westside-evening.mp3`, `hm-ambient-haymarket-crowd.mp3`, `hm-ambient-chaos.mp3`, `hm-ambient-streets-morning.mp3`, `hm-ambient-courtroom.mp3`
2. WHEN a scene transitions, THE Game_Engine SHALL crossfade from the current ambient track to the new scene's ambient track
3. ALL ambient audio paths SHALL use relative paths (e.g., `./audio/ambient/hm-ambient-westside-evening.mp3`)
4. ALL narrator audio paths SHALL use relative paths (e.g., `./audio/narration/lucy-parsons/hm-lp-scene-01.mp3`)
5. IF an audio file is not yet present, THE Game_Engine SHALL handle the missing file gracefully without crashing

### Requirement 18: Timed Choice System

**User Story:** As a player, I want certain high-tension scenes to have timed choices, so that the urgency of the historical moment is felt.

#### Acceptance Criteria

1. WHEN a scene object includes `timedChoice: { enabled: true, duration: N, defaultChoice: 'choice-id' }`, THE Game_Engine SHALL display a countdown timer and auto-select the default choice when the timer expires
2. Lucy Parsons Scene 04 (the bomb) SHALL use a timed choice with duration 14000ms
3. Karl Brenner Scene 05 and James Doyle Scene 05 SHALL each use a timed choice with duration 12000ms
4. THE `defaultChoice` field SHALL reference a valid choice ID within the same scene

### Requirement 19: Outcome Calculation — Three Roles

**User Story:** As a player, I want my outcome to reflect the specific choices I made throughout the mission, so that the epilogue feels earned and historically meaningful.

#### Acceptance Criteria

1. THE Lucy_Parsons role SHALL have at least three outcomes: "The Voice That Would Not Stop" (high movement trust, public action), "The Private Grief" (low movement trust, personal survival), "The Movement and the Man" (mid movement trust, mixed choices)
2. THE Karl_Brenner role SHALL have at least three outcomes differentiated by whether Karl attended Haymarket, was arrested, or fled
3. THE James_Doyle role SHALL have at least three outcomes differentiated by whether James testified fully, withheld information, or refused to testify
4. EACH outcome SHALL include `id`, `survived`, `conditions`, and `epilogue` fields
5. EACH role SHALL include a default catch-all outcome with empty `conditions: {}` as the last item in the outcomes array
6. THE `deathCheckpoint` field SHALL be `false` for all Haymarket scenes — all three characters survive all outcomes

### Requirement 20: Historical Ripple Effects

**User Story:** As an educator, I want students to see how the Haymarket Affair connects to long-term historical consequences, so that they understand its significance beyond the immediate event.

#### Acceptance Criteria

1. THE Haymarket mission SHALL include at least six historical ripple events
2. THE Historical_Ripple SHALL include: the eight defendants' sentences (1886), the Haymarket martyrs' execution (1887), the founding of May Day internationally (1889), the Altgeld pardon (1893), the FLSA eight-hour workday (1938), and the Red Scare legacy of anarchist persecution
3. EACH ripple event SHALL include `id`, `date`, `title`, `description`, `apTheme`, `spiceT`, `apUnit`, and `animationDelay` fields
4. THE Historical_Ripple SHALL connect to AP US History key concepts KC-5.1.I, KC-5.1.II, KC-5.2.I, KC-5.4.I, KC-7.1.I
5. THE `ripple-intros.js` file SHALL provide path-specific intro texts for each of the three roles

### Requirement 21: Knowledge Checkpoint — Full Structure

**User Story:** As an educator, I want role-specific AP-style questions covering before/during/after phases plus cross-role perspective and synthesis, so that students demonstrate comprehensive AP-level understanding.

#### Acceptance Criteria

1. THE Knowledge_Checkpoint SHALL present at least four questions per role (twelve questions minimum total)
2. EACH role's questions SHALL include: at least one question about the pre-event context (Before phase), at least one question about the event itself (During phase), at least one Cross_Role_Question (perspective), and at least one Synthesis_Question (argumentation, connecting to broader history)
3. EACH question SHALL be tagged with `roleSpecific`, `apSkill`, `spiceT`, and `apUnit`
4. EACH question SHALL include four answer options with one correct answer and an explanation citing historical evidence
5. THE Knowledge_Checkpoint questions SHALL cover AP key concepts KC-5.1.I, KC-5.1.II, KC-5.2.I, KC-5.4.I, KC-7.1.I across the three roles
6. ALL question stems SHALL use standard APUSH exam phrasing, such as: "Which of the following best explains...", "The excerpt best supports which of the following arguments...", "Which of the following represents the most significant long-term effect of...", or "Which of the following most directly caused..."
7. AT LEAST two AP_Pause_Questions on stimulus documents (one on hm-doc-2 and one on hm-doc-4) SHALL explicitly address AP Historical Thinking Skill 2 (Sourcing and Situation) — asking about the author's purpose, intended audience, or how the source's origin limits its reliability

### Requirement 22: Survival System Integration

**User Story:** As a game designer, I want the ConsequenceSystem to handle Haymarket roles correctly, so that all three characters survive all outcomes without triggering the death mechanic.

#### Acceptance Criteria

1. THE Consequence_System SHALL include cases for `hm-lucy-parsons`, `hm-karl-brenner`, and `hm-james-doyle` role IDs in `determineSurvival()` returning `{ survived: true, deathChance: 0, modifiers: {} }`
2. NO Haymarket scene SHALL include `deathCheckpoint: true`
3. THE `shouldDieNow()` method SHALL return `{ dies: false }` for all Haymarket role IDs

### Requirement 24: Post-Ripple Synthesis Moment

**User Story:** As an educator, I want a single synthesis question displayed after the ripple timeline completes and before the knowledge checkpoint, so that students reflect on the long-term consequences they just witnessed before answering formal questions.

#### Acceptance Criteria

1. AFTER all historical ripple events have animated and BEFORE the knowledge checkpoint begins, THE Game_Engine SHALL display a single post-ripple synthesis question
2. THE post-ripple question SHALL ask students to evaluate the long-term significance of the Haymarket Affair based on the ripple events they just saw
3. THE post-ripple question SHALL be stored in `mission.js` as a `postRippleQuestion` field (not in `knowledge-questions.js`)
4. THE post-ripple question SHALL use `questionType: 'synthesis'`, `apSkill: 'argumentation'`, and SHALL be the same for all three roles
5. WHEN a player answers the post-ripple question, THE Game_Engine SHALL display the explanation and then transition to the knowledge checkpoint

### Requirement 25: Stimulus Document Unlock Coverage Across All Roles

**User Story:** As an educator, I want all three roles to encounter economic context documents, so that every player has a primary source anchor for before-phase economic questions regardless of which role they chose.

#### Acceptance Criteria

1. THE briefing newspaper SHALL display `hm-doc-1b` (BLS wage data) as a stimulus document available to all three roles during the briefing phase — not only during Karl Brenner's scenes
2. THE `hm-doc-1b` unlock in the briefing SHALL occur on page 2 (The Workers) for all roles
3. THE `hm-doc-1a` (Arbeiter-Zeitung excerpt) SHALL unlock in Lucy Parsons Scene 01 AND SHALL also be referenced in Karl Brenner Scene 01 (Karl is reading the Arbeiter-Zeitung — the document is the same source)
4. WHEN a stimulus document has already been shown to a player (e.g., in the briefing), THE Stimuli_Manager SHALL not show it again if it appears in a `stimuliUnlock` array for a later scene

### Requirement 23: Architecture Compliance

**User Story:** As a developer, I want the Haymarket mission to follow all existing architecture rules, so that the codebase remains maintainable and consistent.

#### Acceptance Criteria

1. ALL Haymarket engine changes SHALL be placed in `js/engine/` with zero content strings
2. ALL Haymarket content SHALL be placed in `js/content/missions/haymarket/` with zero logic
3. THE Stimuli_Manager SHALL communicate exclusively via the Event_Bus — no direct component coupling
4. NO Haymarket file SHALL use global variables — ES6 modules only
5. NO Haymarket file SHALL use frameworks, npm packages, or build tools
6. ALL CSS values for Haymarket UI elements SHALL use CSS custom properties defined in `css/style.css`
7. WHEN the Haymarket mission is added, THE `config/update-notes.json` SHALL be updated with a player-facing description and the version SHALL be incremented

### Requirement 26: Scope Decisions and Future Architecture Notes

**User Story:** As a developer, I want documented scope decisions, so that future missions don't rediscover constraints that were already resolved.

#### Acceptance Criteria

1. THE AI Regeneration Prompt feature (described in the master roadmap as unlocking after all paths are completed) is OUT OF SCOPE for the Haymarket mission MVP — it SHALL NOT be implemented as part of this spec; it is deferred to a future engine enhancement spec
2. THE Haymarket mission uses 6 scenes per role (expanded from the original 4–5 scene baseline) because the Haymarket narrative requires: pre-event context (Scene 01), intelligence/warning (Scene 02), the gathering (Scene 03), the bomb (Scene 04), the immediate aftermath (Scene 05), and the trial (Scene 06) — this is the minimum viable arc
3. THE Knowledge Checkpoint uses 4 questions per role plus one shared post-ripple question (expanded from the original 3-question baseline) to support the before/during/cross-role/synthesis question architecture required by AP curriculum alignment
4. THE `apUnit` field uses APUSH unit numbering (Unit 6.5, Unit 6.6, Unit 7.1) — WHEN AP World History or AP Human Geography missions are added in future, THE mission schema SHALL be extended with an `apCourse` field (e.g., `'APUSH'`, `'APWH'`, `'APHG'`) and the `apUnit` field SHALL use the appropriate course's unit numbering; this extension SHALL NOT require changes to existing Haymarket content
