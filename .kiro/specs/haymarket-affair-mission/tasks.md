# Implementation Plan: Haymarket Affair Mission


## Overview

Five phases: (1) engine extensions, (2) content scaffolding + data tests, (3) content writing, (4) integration, (5) final checkpoint. Engine changes must be complete and tested before content writing begins — content files reference the new `stimuliUnlock`, `predictionQuestion`, `spiceT`, and `apUnit` fields.

Tasks marked `*` are optional and can be skipped for a faster MVP.

## Historical Source Material

Before executing any content task (Tasks 5–11), consult the raw source files at:

**`.kiro/skills/ap-curriculum/references/haymarket_raw_content/`**

- `Account-of-the-Haymarket-Riot.txt` — Chicago Herald eyewitness account (May 5, 1886). Required reading for Scene 04 bomb narratives and `hm-doc-4`.
- `ebsco_haymarket_analysis.txt` — Scholarly analysis of the Herald account. Required for AP pause question explanations and sourcing questions on `hm-doc-2` and `hm-doc-4`.
- `ebsco_summary.txt` — Quick reference for casualty figures, dates, and key actors.
- `The-Haymarket-Tragedy.txt` — Paul Avrich monograph. Required for biographical detail on Lucy Parsons, Albert Parsons, August Spies, Samuel Fielden, and the trial/pardon narrative.

## Tasks

- [x] 1. Engine: StimuliManager
  - [x] 1.1 Create `js/engine/StimuliManager.js`
    - Class with `constructor(eventBus)`
    - Subscribe to `scene:transition`; read `scene.stimuliUnlock` array
    - If array is absent/null/empty, do nothing (no events emitted)
    - Track shown document IDs in a session-scoped `Set` (`this.shownDocuments`)
    - Before showing any document, check `this.shownDocuments.has(id)` — skip if already shown
    - Queue documents for sequential display; show one at a time
    - Emit `stimuli:shown` when a document is displayed
    - Show `pauseQuestion` after document text; require answer before dismiss
    - Emit `stimuli:pause-question-answered` with `{ documentId, correct, selectedId }`
    - Emit `stimuli:dismissed` when player dismisses
    - All communication via EventBus only — no direct DOM access
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 23.3, 25.4_

  - [ ]* 1.2 Write property test: StimuliManager document+question flow
    - **Property 4: Stimulus Document Flow**
    - **Validates: Requirements 4.1, 4.3**
    - fast-check: generate random arrays of document IDs; verify `stimuli:shown` fires for each
    - `// Feature: haymarket-affair-mission, Property 4: Stimulus document flow`

  - [ ]* 1.3 Write property test: StimuliManager no-op on empty stimuliUnlock
    - **Property 5: StimuliManager No-Op on Empty stimuliUnlock**
    - **Validates: Requirements 4.8**
    - Test with null, undefined, and `[]` — verify zero `stimuli:shown` events

  - [ ]* 1.4 Write property test: StimuliManager deduplication
    - **Property 17: StimuliManager Document Deduplication**
    - **Validates: Requirements 25.4**
    - For any document ID shown once, showing it again should emit zero additional `stimuli:shown` events
    - `// Feature: haymarket-affair-mission, Property 17: Document deduplication`

  - [x] 1.5 Wire StimuliManager into `js/main.js`
    - Import and instantiate with eventBus after EventBus initialization
    - _Requirements: 23.3_

- [x] 2. Engine: ConsequenceSystem Range-Check + Haymarket Survival
  - [x] 2.1 Extend `calculateOutcome()` in `js/engine/ConsequenceSystem.js`
    - Add range-check branch: if conditionValue is an object, evaluate `gte`/`lte` bounds
    - Existing boolean matching unchanged — extension is additive only
    - Log warning and treat as non-match for invalid range condition types
    - _Requirements: 13.4, 13.5_

  - [x] 2.2 Add Haymarket survival cases to `determineSurvival()`
    - `hm-lucy-parsons`, `hm-karl-brenner`, `hm-james-doyle` all return `{ survived: true, deathChance: 0, modifiers: {} }`
    - _Requirements: 22.1, 22.2_

  - [x] 2.3 Add `initFlags` support to `SceneStateMachine.loadRole()`
    - WHEN loading a role, IF the role export includes an `initFlags` object, apply each flag via `consequenceSystem.setFlag()` before the first scene loads
    - This is how `hm_lp_movement_trust` is initialized to 0 — preventing it from inheriting any default value
    - _Requirements: 13.1, 13.4 (movement_trust starting value bug prevention)_

  - [ ]* 2.3 Write property test: range-check condition evaluation
    - **Property 15: Range-Check Condition Evaluation**
    - **Validates: Requirements 13.4**
    - fast-check: `fc.integer()` for value, `fc.record({gte: fc.integer(), lte: fc.integer()})` for condition
    - Verify evaluator returns true iff V >= gte AND V <= lte
    - `// Feature: haymarket-affair-mission, Property 15: Range-check condition evaluation`

  - [ ]* 2.4 Write property test: Haymarket survival always true
    - **Property 16: Haymarket Survival Always True**
    - **Validates: Requirements 22.1**
    - `fc.constantFrom('hm-lucy-parsons', 'hm-karl-brenner', 'hm-james-doyle')`
    - Verify `determineSurvival()` returns `survived: true`, `deathChance: 0` for all three

- [x] 3. Checkpoint — Engine tests pass
  - Ensure all engine tests pass before proceeding to content. Ask the user if questions arise.

- [x] 4. Content Scaffolding
  - [x] 4.1 Create `js/content/missions/haymarket/` directory and stub files
    - Create all eight content files as stubs with correct exports and no content strings
    - All imports use `.js` extensions and relative paths
    - _Requirements: 1.2, 1.3_

  - [x] 4.2 Create `js/content/missions/haymarket/stimulus-documents.js` stubs
    - Define all 7 stimulus document objects: `hm-doc-0` through `hm-doc-5`
    - Each with `id`, `title`, `source`, `date`, `text` (placeholder), `spiceT`, `apUnit`, `pauseQuestion` (placeholder)
    - Export named array `STIMULUS_DOCUMENTS` and lookup function `getDocument(id)`
    - _Requirements: 14.1, 14.3_

  - [x] 4.3 Create `js/content/missions/haymarket/lucy-parsons.js` stub
    - 6 scene stubs (`hm-lp-scene-01` through `hm-lp-scene-06`)
    - Each with: `id`, `narrative` (placeholder), `apThemes`, `apKeyConcept`, `apUnit`, `spiceT`, `atmosphericEffect: null`, `ambientTrack`, `narratorAudio`, `stimuliUnlock: []`, `predictionQuestion: null`, `timedChoice: null`, `deathCheckpoint: false`, `choices: []`
    - 4 outcome stubs (3 named + 1 default `conditions: {}` as last item)
    - Include `initFlags: { hm_lp_movement_trust: 0 }` on the role export — explicit initialization to 0
    - _Requirements: 10.1, 10.8, 13.1, 19.5, 19.6_

  - [x] 4.4 Create `js/content/missions/haymarket/karl-brenner.js` stub
    - 6 scene stubs (`hm-kb-scene-01` through `hm-kb-scene-06`), same structure
    - 4 outcome stubs
    - _Requirements: 11.1, 11.8, 19.5, 19.6_

  - [x] 4.5 Create `js/content/missions/haymarket/james-doyle.js` stub
    - 6 scene stubs (`hm-jd-scene-01` through `hm-jd-scene-06`), same structure
    - 4 outcome stubs
    - _Requirements: 12.1, 12.8, 19.5, 19.6_

  - [x] 4.6 Create `js/content/missions/haymarket/mission.js`
    - Mission metadata: `id`, `title`, `historicalDate`, `era`, `unlocked`, `teaser`, `roleSelectionSubtitle`, `apUnits: ['Unit 6.5', 'Unit 6.6', 'Unit 7.1']`
    - Import and wire all three role files, knowledge-questions.js
    - 6 historical ripple event stubs (each with `spiceT` and `apUnit` fields)
    - _Requirements: 1.1, 9.4, 20.1, 20.3_

  - [x] 4.7 Register Haymarket in `js/content/MissionRegistry.js`
    - Add import for `./missions/haymarket/mission.js`
    - Add to missions array
    - Verify exact casing matches filename
    - _Requirements: 1.1_

  - [ ]* 4.8 Write property tests for Haymarket data invariants
    - **Property 2: Relative Asset Paths** — iterate all scene `ambientTrack`/`narratorAudio` fields
    - **Property 3: hm_ Flag Prefix** — iterate all choice `consequences` keys
    - **Property 6: Prediction Question Structure** — iterate all scenes with `predictionQuestion`
    - **Property 7: SPICE-T Non-Empty Per Scene** — iterate all scenes
    - **Property 8: All Six SPICE-T Themes Covered** — aggregate all `spiceT` values
    - **Property 9: AP Tagging Completeness** — iterate all scenes for `apThemes`, `apKeyConcept`, `apUnit`
    - **Property 11: Default Catch-All Outcome Last** — check last outcome per role
    - **Property 12: No Death Checkpoints** — iterate all Haymarket scenes
    - `// Feature: haymarket-affair-mission, Property 2/3/6/7/8/9/11/12`

- [x] 5. Content: Briefing Newspaper and Identity Cards
  - [x] 5.1 Write `js/content/missions/haymarket/briefing-content.js`
    - `BRIEFING_PAGES` for `hm-lucy-parsons`, `hm-karl-brenner`, `hm-james-doyle` (all three roles share the same 5 pages)
    - Page 1: Industrial Transformation 1871–1885 — Chicago fire, McCormick plant, wage data; `spiceT: ['Economic', 'Technological']`, `apUnit: 'Unit 6.5'`, `apTheme: 'contextualization'`
    - Page 2: The Workers — immigrant labor, Arbeiter-Zeitung, eight-hour demand; `spiceT: ['Social', 'Cultural', 'Economic']`, `apUnit: 'Unit 6.5'`; **include `stimuliUnlock: ['hm-doc-1b']`** so all three roles see the BLS wage data on this page
    - Page 3: The Eight-Hour Movement — May 1st strike, 80,000 marchers, national scope; `spiceT: ['Economic', 'Political']`, `apUnit: 'Unit 6.5'`
    - Page 4: The Other Side — Pinkertons, 1877 Railroad Strike, Hayes troop order; `hm-doc-0` unlocks mid-page; `spiceT: ['Political', 'Economic']`, `apUnit: 'Unit 6.5'`
    - Page 5: May 3rd 1886 — McCormick shooting, Revenge Circular, Haymarket called; `spiceT: ['Political', 'Social']`, `apUnit: 'Unit 6.5'`
    - `BRIEFING_CARDS`: three identity cards (Chicago PD Surveillance File, McCormick Employee Record #2847, Pinkerton Assignment CHI-1886-114)
    - `BRIEFING_FINALS`: role-specific final lines before Scene 01
    - `BRIEFING_UI_TEXT`: masthead "Chicago Daily Tribune", byline "Special Report — Labor Bureau"
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 9.5, 25.1, 25.2_

- [x] 6. Content: Stimulus Documents — Real Primary Source Text
  - [x] 6.1 Write `hm-doc-0`: Hayes Federal Troop Deployment Order, 1877
    - Authentic text: President Hayes's order deploying federal troops against the 1877 Railroad Strike
    - `spiceT: ['Political', 'Economic']`, `apUnit: 'Unit 6.5'`
    - Pause question: tests understanding of federal power vs. labor (causation, Political)
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

  - [x] 6.2 Write `hm-doc-1a`: Arbeiter-Zeitung excerpt, May 1886
    - Authentic excerpt from the German-language labor newspaper calling for the eight-hour day
    - `spiceT: ['Cultural', 'Economic']`, `apUnit: 'Unit 6.5'`
    - Pause question: tests understanding of immigrant labor press (contextualization, Cultural)
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

  - [x] 6.3 Write `hm-doc-1b`: BLS wage data, 1880s
    - Authentic Bureau of Labor Statistics data on wages and hours in Chicago manufacturing
    - `spiceT: ['Economic', 'Social']`, `apUnit: 'Unit 6.5'`
    - Pause question: tests reading of quantitative historical evidence (causation, Economic)
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

  - [x] 6.4 Write `hm-doc-2`: Harper's Weekly cartoon description, 1886
    - Accurate description of the Harper's Weekly illustration depicting the Haymarket bomb; include caption text
    - `spiceT: ['Political', 'Cultural']`, `apUnit: 'Unit 6.5'`
    - Pause question MUST address AP Historical Thinking Skill 2 (Sourcing and Situation): ask about the illustrator's intended audience, the publication's political stance, or how Harper's Weekly's readership limits the source's reliability as evidence of working-class perspectives
    - Example stem: "Which of the following best explains how the source of this illustration limits its usefulness as evidence about the Haymarket Affair?"
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 21.7_

  - [x] 6.5 Write `hm-doc-3`: Revenge Circular, May 3 1886
    - Full authentic text of August Spies's circular calling workers to arms after McCormick shooting
    - `spiceT: ['Political', 'Social']`, `apUnit: 'Unit 6.5'`
    - Pause question: tests causation (McCormick → Haymarket meeting)
    - Unlocks in: Karl Brenner Scene 04, James Doyle Scene 04
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.6_

  - [x] 6.6 Write `hm-doc-4`: Chicago Tribune front page, May 5 1886
    - Authentic headline and lead paragraph from the Tribune's coverage of the Haymarket bombing
    - `spiceT: ['Political', 'Cultural']`, `apUnit: 'Unit 6.5'`
    - Pause question MUST address AP Historical Thinking Skill 2 (Sourcing and Situation): ask about the Tribune's editorial stance, its relationship to business interests, or how the newspaper's purpose shapes its framing of the bombing
    - Example stem: "The Chicago Tribune's framing of the Haymarket bombing as an 'anarchist conspiracy' best reflects which of the following about the source?"
    - Unlocks in: Lucy Parsons Scene 05
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.7, 21.7_

  - [x] 6.7 Write `hm-doc-5`: Governor Altgeld pardon message, June 26 1893
    - Key passages from Altgeld's 18,000-word pardon message critiquing the trial
    - `spiceT: ['Political', 'Economic']`, `apUnit: 'Unit 6.5'`
    - Pause question: tests argumentation (evaluating Altgeld's critique of judicial process)
    - Unlocks in: Lucy Parsons Scene 06
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.8_

  - [ ]* 6.8 Write property test: stimulus document structural completeness
    - **Property 10: Stimulus Document Structural Completeness**
    - **Validates: Requirements 14.3, 14.4**
    - Iterate all documents; verify all required fields present including `spiceT` and `apUnit`
    - `// Feature: haymarket-affair-mission, Property 10: Stimulus document structure`

- [x] 7. Content: Lucy Parsons — Six Scenes and Outcomes
  - [x] 7.1 Write Scene 01: The Sewing Women's Meeting
    - Late April 1886, West Indiana Street hall; gas lamps, fabric smell, women's voices
    - Introduce the eight-hour demand and movement momentum
    - 2–3 choices; solidarity choices increment `hm_lp_movement_trust` by 1
    - `stimuliUnlock: ['hm-doc-1a']` (Arbeiter-Zeitung excerpt — Lucy is reading it aloud to the women)
    - `predictionQuestion: null`
    - `ambientTrack: './audio/ambient/hm-ambient-westside-evening.mp3'`
    - `apThemes: ['contextualization', 'perspective']`, `apKeyConcept: 'KC-5.1.I'`, `apUnit: 'Unit 6.5'`
    - `spiceT: ['Social', 'Economic']`
    - _Requirements: 10.2, 10.8, 10.9, 10.10, 13.2, 13.3, 25.3_

  - [x] 7.2 Write Scene 02: The Intelligence
    - Three days before May 4th; Wilhelm (an ink pressman — a print trade worker) delivers a Pinkerton warning to Lucy
    - Wilhelm's occupation is intentionally ironic: a worker in the labor press is informing on the labor movement; this detail must be in the narrative
    - Lucy learns the meeting is being watched; choices about warning others vs. proceeding quietly
    - `stimuliUnlock: ['hm-doc-2']` (Harper's Weekly cartoon)
    - `ambientTrack: './audio/ambient/hm-ambient-westside-evening.mp3'`
    - `apThemes: ['perspective', 'complexity']`, `apKeyConcept: 'KC-5.4.I'`, `apUnit: 'Unit 6.5'`
    - `spiceT: ['Political', 'Social']`
    - _Requirements: 10.3, 10.8_

  - [x] 7.3 Write Scene 03: One Block Away
    - May 4th evening, Randolph Street, children present; crowd noise building from Haymarket Square
    - Include BOTH a `predictionQuestion` AND a `timedChoice`
    - `predictionQuestion.question`: "The Revenge Circular has been distributed. What do you predict will be the most immediate consequence of workers gathering at Haymarket Square tonight?"
    - `predictionQuestion.reveal`: historically accurate account of what actually happened
    - `timedChoice: { enabled: true, duration: 10000, defaultChoice: 'hm-lp-choice-03-b' }` — default is "stay with children" (historically grounded: Lucy Parsons did not enter the square that night)
    - `stimuliUnlock: []`
    - `ambientTrack: './audio/ambient/hm-ambient-haymarket-crowd.mp3'`
    - `apThemes: ['causation', 'perspective']`, `apKeyConcept: 'KC-5.1.II'`, `apUnit: 'Unit 6.5'`
    - `spiceT: ['Political', 'Social']`
    - _Requirements: 10.4, 10.8, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 18.1_

  - [x] 7.4 Write Scene 04: The Bomb
    - Explosion; chaos; children holding her coat; sensory detail (smoke, screaming, cobblestones)
    - `timedChoice: { enabled: true, duration: 14000, defaultChoice: 'hm-lp-choice-04-c' }`
    - `atmosphericEffect: 'shake'`
    - `stimuliUnlock: []`
    - `ambientTrack: './audio/ambient/hm-ambient-chaos.mp3'`
    - `apThemes: ['causation', 'complexity']`, `apKeyConcept: 'KC-5.1.I'`, `apUnit: 'Unit 6.5'`
    - `spiceT: ['Political', 'Social']`
    - _Requirements: 10.5, 10.8, 18.1, 18.2_

  - [x] 7.5 Write Scene 05: The Arrest
    - May 5th morning; Tribune front page; Arbeiter-Zeitung decision (publish or go underground)
    - `stimuliUnlock: ['hm-doc-4']` (Tribune front page)
    - `ambientTrack: './audio/ambient/hm-ambient-streets-morning.mp3'`
    - `apThemes: ['perspective', 'argumentation']`, `apKeyConcept: 'KC-5.4.I'`, `apUnit: 'Unit 6.5'`
    - `spiceT: ['Political', 'Cultural']`
    - _Requirements: 10.6, 10.8, 14.7_

  - [x] 7.6 Write Scene 06: The Trial
    - August 1886; sentencing; final choice about what comes next
    - `stimuliUnlock: ['hm-doc-5']` (Altgeld pardon — framed as "what will come")
    - `ambientTrack: './audio/ambient/hm-ambient-courtroom.mp3'`
    - `apThemes: ['argumentation', 'continuity']`, `apKeyConcept: 'KC-5.1.I'`, `apUnit: 'Unit 6.5'`
    - `spiceT: ['Political', 'Social']`
    - _Requirements: 10.7, 10.8, 14.8_

  - [x] 7.7 Write Lucy Parsons outcomes (3 named + 1 default)
    - "The Voice That Would Not Stop": `{ hm_lp_movement_trust: { gte: 3 }, hm_lp_published_arbeiter: true }`
    - "The Movement and the Man": `{ hm_lp_movement_trust: { gte: 2, lte: 3 } }`
    - "The Private Grief": `{ hm_lp_movement_trust: { lte: 1 } }`
    - Default catch-all: `conditions: {}` — must be last in array
    - Each epilogue 200–300 words, Geraldine Brooks register, historically grounded
    - All outcomes: `survived: true`, `deathCheckpoint` absent from all scenes
    - _Requirements: 19.1, 19.4, 19.5, 19.6_

  - [ ]* 7.8 Write property test: movement_trust range invariant
    - **Property 14: Movement Trust Range Invariant**
    - **Validates: Requirements 13.1**
    - Generate random sequences of Lucy Parsons choices; apply to ConsequenceSystem
    - Verify `hm_lp_movement_trust` stays in [0, 5] after every sequence
    - `// Feature: haymarket-affair-mission, Property 14: Movement trust range invariant`

- [x] 8. Content: Karl Brenner — Six Scenes and Outcomes
  - [x] 8.1 Write Scene 01: The Lockout
    - Karl reading Arbeiter-Zeitung during McCormick lockout; introduce Heinrich Müller
    - Establish immigrant working-class world: tenement, German language, machinery sounds
    - `stimuliUnlock: ['hm-doc-1a']` (Arbeiter-Zeitung excerpt — Karl is reading the same paper; StimuliManager deduplication means it only shows if not already seen in briefing)
    - `ambientTrack: './audio/ambient/hm-ambient-westside-evening.mp3'`
    - `apThemes: ['contextualization', 'perspective']`, `apKeyConcept: 'KC-5.2.I'`, `apUnit: 'Unit 6.5'`
    - `spiceT: ['Economic', 'Cultural']`
    - _Requirements: 11.2, 11.8, 11.10, 25.3_

  - [x] 8.2 Write Scene 02: The March
    - May 1st eight-hour strike march; 80,000 workers; Heinrich Müller marching alongside
    - `stimuliUnlock: []`
    - `ambientTrack: './audio/ambient/hm-ambient-haymarket-crowd.mp3'`
    - `apThemes: ['causation', 'continuity']`, `apKeyConcept: 'KC-5.1.I'`, `apUnit: 'Unit 6.5'`
    - `spiceT: ['Social', 'Economic']`
    - _Requirements: 11.3, 11.8_

  - [x] 8.3 Write Scene 03: The McCormick Gates
    - May 3rd; Pinkerton guards and police shoot strikers; Karl witnesses the shooting
    - Include `predictionQuestion`: "You have just seen workers shot at the McCormick gates. What do you predict will happen next?"
    - `atmosphericEffect: 'shake'`
    - `ambientTrack: './audio/ambient/hm-ambient-streets-morning.mp3'`
    - `apThemes: ['causation', 'complexity']`, `apKeyConcept: 'KC-5.1.II'`, `apUnit: 'Unit 6.5'`
    - `spiceT: ['Political', 'Economic']`
    - _Requirements: 11.4, 11.8, 15.1, 15.2_

  - [x] 8.4 Write Scene 04: The Circular
    - Karl receives the Revenge Circular; decides whether to attend Haymarket
    - `stimuliUnlock: ['hm-doc-3']` (Revenge Circular)
    - `ambientTrack: './audio/ambient/hm-ambient-westside-evening.mp3'`
    - `apThemes: ['causation', 'perspective']`, `apKeyConcept: 'KC-5.1.I'`, `apUnit: 'Unit 6.5'`
    - `spiceT: ['Political', 'Social']`
    - _Requirements: 11.5, 11.8, 14.6_

  - [x] 8.5 Write Scene 05: Haymarket Square
    - Karl at the square during the bomb explosion; chaos; where is Heinrich?
    - `timedChoice: { enabled: true, duration: 12000, defaultChoice: 'hm-kb-choice-05-b' }`
    - `atmosphericEffect: 'shake'`
    - `ambientTrack: './audio/ambient/hm-ambient-chaos.mp3'`
    - `apThemes: ['causation', 'complexity']`, `apKeyConcept: 'KC-5.1.I'`, `apUnit: 'Unit 6.5'`
    - `spiceT: ['Political', 'Social']`
    - _Requirements: 11.6, 11.8, 18.3_

  - [x] 8.6 Write Scene 06: The Red Scare
    - Aftermath; mass arrests; Karl's decision about his German identity and future in America
    - `ambientTrack: './audio/ambient/hm-ambient-courtroom.mp3'`
    - `apThemes: ['continuity', 'perspective']`, `apKeyConcept: 'KC-5.4.I'`, `apUnit: 'Unit 6.6'`
    - `spiceT: ['Political', 'Social']`
    - _Requirements: 11.7, 11.8_

  - [x] 8.7 Write Karl Brenner outcomes (3 named + 1 default)
    - "The Witness": `{ hm_kb_attended_haymarket: true, hm_kb_escaped_arrest: true }`
    - "The Arrested": `{ hm_kb_attended_haymarket: true, hm_kb_arrested: true }`
    - "The Exile": `{ hm_kb_fled_chicago: true }`
    - Default catch-all: `conditions: {}` — must be last
    - Each epilogue 200–300 words, historically grounded
    - _Requirements: 19.2, 19.4, 19.5_

- [x] 9. Content: James Doyle — Six Scenes and Outcomes
  - [x] 9.1 Write Scene 01: Three Months Under
    - James as "James Reilly" inside IWPA; three months undercover; establish the double life
    - Introduce the moral tension: he knows these people, attends their meetings
    - `stimuliUnlock: []`
    - `ambientTrack: './audio/ambient/hm-ambient-westside-evening.mp3'`
    - `apThemes: ['contextualization', 'perspective']`, `apKeyConcept: 'KC-5.4.I'`, `apUnit: 'Unit 6.5'`
    - `spiceT: ['Political', 'Cultural']`
    - _Requirements: 12.2, 12.8_

  - [x] 9.2 Write Scene 02: The Surveillance Report
    - James files report on Lucy Parsons and the sewing women's meeting; Captain Ward present
    - `stimuliUnlock: ['hm-doc-0']` (Hayes troop order — context for Pinkerton role in labor suppression)
    - `ambientTrack: './audio/ambient/hm-ambient-westside-evening.mp3'`
    - `apThemes: ['perspective', 'causation']`, `apKeyConcept: 'KC-5.4.I'`, `apUnit: 'Unit 6.5'`
    - `spiceT: ['Political', 'Economic']`
    - _Requirements: 12.3, 12.8, 12.10_

  - [x] 9.3 Write Scene 03: McCormick Gates
    - James at McCormick on May 3rd in undercover capacity; witnesses the shooting
    - Include `predictionQuestion`: "You have just watched police and Pinkertons shoot striking workers. What do you predict your handler Captain Ward will order you to do next?"
    - `ambientTrack: './audio/ambient/hm-ambient-streets-morning.mp3'`
    - `apThemes: ['causation', 'complexity']`, `apKeyConcept: 'KC-5.1.II'`, `apUnit: 'Unit 6.5'`
    - `spiceT: ['Political', 'Economic']`
    - _Requirements: 12.4, 12.8, 12.10, 15.1, 15.2_

  - [x] 9.4 Write Scene 04: Orders from Ward
    - Captain William Ward orders James to attend the Haymarket meeting and document speakers
    - `stimuliUnlock: ['hm-doc-3']` (Revenge Circular — James receives it as intelligence)
    - `ambientTrack: './audio/ambient/hm-ambient-haymarket-crowd.mp3'`
    - `apThemes: ['perspective', 'causation']`, `apKeyConcept: 'KC-5.4.I'`, `apUnit: 'Unit 6.5'`
    - `spiceT: ['Political', 'Economic']`
    - _Requirements: 12.5, 12.8, 12.10, 14.6_

  - [x] 9.5 Write Scene 05: The Bomb — Crisis of Identity
    - James at Haymarket during the explosion; undercover identity vs. human response
    - The people around him are people he knows; the crisis is personal
    - `timedChoice: { enabled: true, duration: 12000, defaultChoice: 'hm-jd-choice-05-b' }`
    - `atmosphericEffect: 'shake'`
    - `ambientTrack: './audio/ambient/hm-ambient-chaos.mp3'`
    - `apThemes: ['perspective', 'complexity']`, `apKeyConcept: 'KC-5.1.I'`, `apUnit: 'Unit 6.5'`
    - `spiceT: ['Political', 'Social']`
    - _Requirements: 12.6, 12.8, 18.3_

  - [x] 9.6 Write Scene 06: The Testimony
    - The trials; James's testimony; the moral weight of what his reports enabled
    - `ambientTrack: './audio/ambient/hm-ambient-courtroom.mp3'`
    - `apThemes: ['argumentation', 'perspective']`, `apKeyConcept: 'KC-5.4.I'`, `apUnit: 'Unit 6.5'`
    - `spiceT: ['Political', 'Social']`
    - _Requirements: 12.7, 12.8_

  - [x] 9.7 Write James Doyle outcomes (3 named + 1 default)
    - "The Full Testimony": `{ hm_jd_testified_fully: true }`
    - "The Withheld Truth": `{ hm_jd_withheld_testimony: true }`
    - "The Refusal": `{ hm_jd_refused_testimony: true }`
    - Default catch-all: `conditions: {}` — must be last
    - Each epilogue 200–300 words, historically grounded
    - _Requirements: 19.3, 19.4, 19.5_

- [x] 10. Content: Knowledge Questions (4+ per role, all four types)
  - [x] 10.1 Write Lucy Parsons questions (4 questions)
    - Q1 `before` / `contextualization` / `spiceT: ['Economic','Social']` / `apUnit: 'Unit 6.5'`
      - Topic: wage conditions and the eight-hour demand in 1880s Chicago
      - Stem format: "Which of the following best explains why Chicago workers demanded an eight-hour workday in 1886?"
    - Q2 `during` / `causation` / `spiceT: ['Political','Social']` / `apUnit: 'Unit 6.5'`
      - Topic: the Haymarket bomb and the trial's use of conspiracy charges
      - Stem format: "Which of the following most directly caused the conviction of the Haymarket defendants despite no proof of individual guilt?"
    - Q3 `cross-role` / `perspective` / `spiceT: ['Political']` / `apUnit: 'Unit 6.5'`
      - Topic: how a Pinkerton operative or machinist would view the eight-hour movement
      - Stem format: "A Pinkerton detective assigned to monitor labor meetings in 1886 would most likely have interpreted the eight-hour movement as..."
    - Q4 `synthesis` / `argumentation` / `spiceT: ['Political','Economic']` / `apUnit: 'Unit 6.6'`
      - Topic: connect Haymarket trial to broader pattern of state suppression of labor (KC-5.1.I, KC-5.4.I) AND reference an event outside 1886–1938 (e.g., Reconstruction-era federal intervention)
      - Correct answer must model 6.D complexity — qualify the argument, not just support it
      - Stem format: "Which of the following best evaluates the long-term significance of the Haymarket trial for American labor history?"
    - Each question: 4 options, one correct, explanation citing historical evidence
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5, 21.6, 6.1, 6.2, 16.1, 16.2_

  - [x] 10.2 Write Karl Brenner questions (4 questions)
    - Q1 `before` / `contextualization` / `spiceT: ['Economic','Cultural']` / `apUnit: 'Unit 6.5'`
      - Topic: immigrant labor and the German-language labor press (Arbeiter-Zeitung)
      - Stem format: "Which of the following best explains the role of the Arbeiter-Zeitung in the 1886 labor movement?"
    - Q2 `during` / `causation` / `spiceT: ['Social','Political']` / `apUnit: 'Unit 6.5'`
      - Topic: McCormick shooting → Revenge Circular → Haymarket meeting causal chain
      - Stem format: "Which of the following most directly led to the calling of the Haymarket meeting on May 4, 1886?"
    - Q3 `cross-role` / `perspective` / `spiceT: ['Political']` / `apUnit: 'Unit 6.5'`
      - Topic: how Lucy Parsons or James Doyle would view the McCormick shooting
      - Stem format: "A labor organizer like Lucy Parsons would most likely have interpreted the McCormick shooting as evidence of..."
    - Q4 `synthesis` / `argumentation` / `spiceT: ['Economic','Social']` / `apUnit: 'Unit 6.6'`
      - Topic: immigrant political engagement in labor movements (KC-5.2.I) — connect to broader Unit 6 immigration patterns AND reference cross-period comparison
      - Correct answer must model 6.D complexity
      - Stem format: "Which of the following best evaluates the relationship between immigration and labor organizing in the Gilded Age?"
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5, 21.6, 6.1, 6.3, 16.3_

  - [x] 10.3 Write James Doyle questions (4 questions)
    - Q1 `before` / `contextualization` / `spiceT: ['Political','Economic']` / `apUnit: 'Unit 6.5'`
      - Topic: Pinkerton agency as private labor suppression — 1877 Railroad Strike context
      - Stem format: "Which of the following best explains why employers hired Pinkerton detectives to monitor labor organizations in the 1880s?"
    - Q2 `during` / `perspective` / `spiceT: ['Political']` / `apUnit: 'Unit 6.5'`
      - Topic: undercover surveillance and the IWPA — what the Pinkerton reports revealed
      - Stem format: "The use of undercover Pinkerton operatives inside labor organizations best reflects which of the following about Gilded Age labor relations?"
    - Q3 `cross-role` / `perspective` / `spiceT: ['Social','Political']` / `apUnit: 'Unit 6.5'`
      - Topic: how Lucy Parsons or Karl Brenner would view the Haymarket trial and testimony
      - Stem format: "A German immigrant machinist who attended the Haymarket meeting would most likely have viewed the subsequent trial as..."
    - Q4 `synthesis` / `argumentation` / `spiceT: ['Political','Economic']` / `apUnit: 'Unit 7.1'`
      - Topic: private and state power used against labor (KC-5.4.I, KC-7.1.I) — connect to Red Scare, Palmer Raids AND reference cross-period comparison
      - Correct answer must model 6.D complexity
      - Stem format: "Which of the following best evaluates the continuity between the suppression of labor organizing after Haymarket and the Red Scare of 1919–1920?"
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5, 21.6, 6.1, 6.4, 16.4_

  - [ ]* 10.4 Write property test: question set completeness per role
    - **Property 13: Question Set Completeness Per Role**
    - **Validates: Requirements 21.2, 21.3, 9.2, 9.3**
    - Group questions by `roleSpecific`; verify each group has at least one of each `questionType`
    - Verify every question has non-empty `apUnit` and `spiceT`
    - `// Feature: haymarket-affair-mission, Property 13: Question set completeness`

- [x] 11. Content: Historical Ripple Events, Post-Ripple Question, and Ripple Intros
  - [x] 11.1 Write 6 historical ripple events in `mission.js`
    - Use the full event objects from the design document (already specified with text, spiceT, apUnit)
    - 1886 sentencing, 1887 execution, 1889 May Day, 1893 Altgeld pardon, 1938 FLSA, Red Scare legacy
    - Each: `id`, `date`, `title`, `description` (2–3 sentences, factually grounded), `apTheme`, `spiceT`, `apUnit`, `animationDelay`
    - _Requirements: 20.1, 20.2, 20.3, 20.4_

  - [x] 11.2 Write `postRippleQuestion` in `mission.js`
    - Single synthesis question displayed after all ripple events animate, before the knowledge checkpoint
    - Same question for all three roles; stored as `mission.postRippleQuestion`
    - Use the full question object from the design document (already specified with correct answer modeling 6.D complexity)
    - `questionType: 'synthesis'`, `apSkill: 'argumentation'`, `spiceT: ['Political','Economic','Social']`, `apUnit: 'Unit 6.6'`
    - Stem: "Which of the following best explains the most significant long-term consequence of the Haymarket Affair for American labor and political history?"
    - Correct answer must qualify the argument (state suppression AND international galvanization)
    - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5_

  - [x] 11.3 Write `js/content/missions/haymarket/ripple-intros.js`
    - `RIPPLE_INTROS` object with keys for each role × path combination
    - Lucy Parsons paths: `voice`, `grief`, `movement`
    - Karl Brenner paths: `witness`, `arrested`, `exile`
    - James Doyle paths: `testimony`, `withheld`, `refusal`
    - `getRippleIntro(roleId, path)` export with fallback
    - _Requirements: 20.5_

- [x] 12. Checkpoint — All content written, all data tests pass
  - Ensure all property tests pass against the written content. Ask the user if questions arise.

- [x] 13. Integration and Version Update
  - [x] 13.1 Verify MissionRegistry import and registration
    - Confirm `haymarket-affair` appears in `getAllMissions()`
    - Confirm timeline renders Haymarket at 1886 position
    - _Requirements: 1.1, 1.4_

  - [x] 13.2 Update `config/update-notes.json` and `config/version.js`
    - Add to "new" array: "New mission: The Haymarket Affair — Experience the 1886 labor uprising from three perspectives (AP US History Unit 6.5)"
    - Increment version number
    - _Requirements: 23.7_

  - [ ]* 13.3 Write property test: mission registration round-trip
    - **Property 1: Mission Registration Round-Trip**
    - **Validates: Requirements 1.1**
    - Register Haymarket mission; verify `getMission('haymarket-affair')` returns correct id and roles
    - `// Feature: haymarket-affair-mission, Property 1: Mission registration round-trip`

- [x] 14. Final Checkpoint — All tests pass, full playthroughs verified
  - Ensure all property tests and unit tests pass
  - Run Playwright full playthrough for all three roles
  - Verify `hm_lp_movement_trust` starts at 0 (not 50 or any other default) — check ConsequenceSystem flags after role loads, before any choice is made
  - Verify Scene 03 (LP) has BOTH a prediction question AND a timed choice (10s, default "stay with children")
  - Verify Wilhelm appears by name in Lucy Parsons Scene 02 narrative
  - Verify stimulus documents appear mid-scene for all `stimuliUnlock` arrays
  - Verify `hm-doc-1b` (BLS wage data) appears on briefing page 2 for all three roles
  - Verify `hm-doc-1a` (Arbeiter-Zeitung) does NOT appear twice if seen in briefing and again in scene (deduplication)
  - Verify prediction questions appear and reveal fires after answer selection
  - Verify post-ripple question appears after all ripple events animate, before checkpoint
  - Verify knowledge checkpoint shows all four question types per role
  - Verify sourcing questions on hm-doc-2 and hm-doc-4 ask about author purpose/audience
  - Verify synthesis question correct answers model 6.D complexity (qualify, not just support)
  - Verify no cross-mission flag contamination (play Pearl Harbor after Haymarket)
  - Verify timeline shows Haymarket at 1886 position
  - Ask the user if questions arise.

## Notes

- **Historical sources**: All content tasks MUST consult `.kiro/skills/ap-curriculum/references/haymarket_raw_content/` — see "Historical Source Material" section above
- Tasks marked `*` are optional and can be skipped for a faster MVP
- All consequence flags must use role-specific prefixes: `hm_lp_`, `hm_kb_`, `hm_jd_`
- `psychologyEffects` valid keys: `morale`, `loyalty`, `humanity`, `composure` — never `awareness`
- `deathCheckpoint` must be `false` (or absent) on every Haymarket scene
- Default catch-all outcome (`conditions: {}`) must be the last item in every role's outcomes array
- `hm_lp_movement_trust` MUST be initialized to 0 via `initFlags` on the Lucy Parsons role export — never inherits from psychology system defaults
- Lucy Parsons Scene 03 has BOTH a `predictionQuestion` AND a `timedChoice` (10s, default "stay with children")
- Wilhelm (ink pressman) must appear by name in Lucy Parsons Scene 02
- All audio paths are placeholders — NarratorAudioManager null guard handles missing files
- StimuliManager must be initialized in `main.js` before any scene loads
- StimuliManager tracks shown document IDs in a session-scoped Set — documents shown in briefing will not repeat in scenes
- ConsequenceSystem range-check extension is additive — existing boolean matching unchanged
- SceneStateMachine.loadRole() must apply `initFlags` before the first scene loads
- Every scene requires `apThemes`, `apKeyConcept`, `apUnit`, and `spiceT` — all four fields
- Briefing pages require `spiceT`, `apUnit`, and `apTheme` metadata fields
- Stimulus documents require `spiceT` and `apUnit` fields
- Knowledge questions require `questionType`, `spiceT`, and `apUnit` fields
- All six SPICE-T themes must appear across the 18 scenes combined
- All six AP Reasoning Processes must appear across the 18 scenes combined
- Pre-event scenes (01 for all roles) must use `contextualization` as a primary theme
- AI Regeneration Prompt is OUT OF SCOPE for this spec — deferred to future engine enhancement
- `apUnit` uses APUSH numbering; future APWH/APHG missions will need `apCourse` field extension
