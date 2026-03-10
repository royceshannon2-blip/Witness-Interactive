# Implementation Plan: Branching Narrative System with Player Psychology

## Overview

This implementation plan converts the branching narrative design into discrete coding tasks. The plan follows a phased approach with integration smoke tests to catch issues early. All tasks build incrementally, with no orphaned code.

**Critical:** Complete Phase 0 (Bug Fixes) before starting Phase 1. The branching system depends on stable scene transitions, audio management, and effect timing.

**NOTE ON ARCHITECTURE CHANGE — READ BEFORE STARTING:**
The original plan called for a separate `OutcomeGenerator.js` file and a `killedInAction` / `diedOnArizona` / `civilianCasualty` flag system for survival. This has been replaced. Survival is now a **weighted probability roll** inside `ConsequenceSystem.js` via `determineSurvival(roleId)`. Do NOT create OutcomeGenerator.js. Do NOT add the old binary survival flags to choices. See Phase 5 notes for details.

---

## Tasks

- [ ] Phase 0: Critical Bug Fixes and Edge Case Hardening
  - [x] 0.1 Fix white screen crash (nextScene: "outcome" handling)
    - SceneStateMachine.js transitionTo() now handles "outcome" sentinel explicitly
    - Missing scene IDs now emit scene:error instead of game:complete
    - UIController.js has scene:error handler that re-renders current scene
    - _Requirements: Bug Fix 1_
    - _Status: COMPLETE — implemented in newfiles/SceneStateMachine.js and newfiles/UIController.js_

  - [x] 0.2 Fix ambient audio field name mismatch
    - All three role files (japanese-aviator.js, american-sailor.js, american-civilian.js)
      now use ambientTrack (string filename) not ambientSound (object)
    - SceneStateMachine.js reads ambientTrack correctly
    - _Requirements: Bug Fix 2_
    - _Status: COMPLETE — implemented in newfiles/ role files_

  - [x] 0.3 Fix atmospheric effects timing and performance
    - AtmosphericEffects.js fully rewritten — all DOM particle systems removed
    - Replaced with border glow system (single fixed div, inset box-shadow)
    - CSS keyframes self-injected via injectKeyframes() — no stylesheet dependency
    - scene:impact listener removed (was causing console error loop)
    - fadeOutAllEffects() wrapped in try/catch with clearAllEffects() fallback
    - NOTE: The original fix approach (scene:rendered event) was abandoned because
      emitting scene:rendered from renderScene() was itself causing audio double-play.
      Effects timing is now handled internally by AtmosphericEffects.js.
    - _Requirements: Bug Fix 3_
    - _Status: COMPLETE — implemented in newfiles/AtmosphericEffects.js and newfiles/atmospheric-effects.css_

  - [x] 0.4 Fix narrator audio bleed between scenes
    - NarratorAudioManager.js fully rewritten with session token architecture
    - this.sessionToken increments on every _hardStop()
    - Every async operation (fetch, decode, play) captures token at birth and self-aborts if token changed
    - _hardStop() called synchronously at top of scene:transition handler
    - Radio clip setTimeout handles stored in this.radioTimers[] and cleared on hard stop
    - this.pendingStartTimer cleared on hard stop (prevents double-fire on fast transitions)
    - _Requirements: Bug Fix 4_
    - _Status: COMPLETE — implemented in newfiles/NarratorAudioManager.js_

  - [x] 0.5 Harden timed choice expiry
    - _Status: COMPLETE (previously checked off)_

  - [x] 0.6 Prevent double-click transitions
    - _Status: COMPLETE (previously checked off)_

  - [x] 0.7 Handle typewriter skip correctly
    - _Status: COMPLETE (previously checked off)_

  - [x] 0.8 Handle choice click before typewriter finishes
    - Update UIController.js choice handler to force-complete typewriter if running
    - Add 50ms delay after completion before transition
    - _Requirements: Edge Case 4_
    - _Status: COMPLETE — handleChoiceClick now calls typewriterEffect.skipToEnd() if isActive()_

  - [x] 0.9 Stop audio on role transitions
    - Add role:complete and role:selected listeners to both audio managers
    - Call stopAll() on both events
    - Reset currentAmbientTrack on role:selected
    - Also call consequenceSystem.reset() on role:selected (REQUIRED — clears flags
      between playthroughs so survival probability and outcome selection start fresh)
    - Also call consequenceSystem.setCurrentRole(roleId) on role:selected
    - _Requirements: Edge Case 5_
    - _Status: COMPLETE — AmbientSoundManager and NarratorAudioManager listen for game:complete and role:selected, main.js calls consequenceSystem methods_

  - [x] 0.10 Clear effects between roles
    - Add role:complete and role:selected listeners to AtmosphericEffects.js
    - Call clearAllEffects() on both events
    - _Requirements: Edge Case 6_
    - _Status: COMPLETE — AtmosphericEffects listens for game:complete and role:selected_

  - [x] 0.11 Handle suspended AudioContext
    - Add context state check before playing audio in both audio managers
    - Queue pending sounds when context is suspended
    - Play queued sounds on audio:unlocked event
    - _Requirements: Edge Case 9_
    - _Status: COMPLETE — Both audio managers check audioReady and queue pending sounds_

  - [x] 0.12 Handle page visibility changes
    - Add visibilitychange listener to TimedChoiceSystem.js (pause/resume timer)
    - Add visibilitychange listener to AmbientSoundManager.js (mute/unmute)
    - _Requirements: Edge Case 11_
    - _Status: COMPLETE — Both components already have visibilitychange handlers_

  - [x] 0.13 Handle browser navigation
    - Add beforeunload and pagehide listeners to main.js
    - Stop all audio and clear all effects on page unload
    - _Requirements: Edge Case 12_
    - _Status: COMPLETE — main.js already has handlePageUnload function_

  - [x] 0.14 Wire new ConsequenceSystem calls into UIController and main.js
    - UIController.js populateOutcomeScreen() currently calls
      this.consequenceSystem.calculateOutcome(role.outcomes) with one argument
    - Update to two-step call:
        const survival = this.consequenceSystem.determineSurvival(this.currentRoleId);
        const outcomeId = this.consequenceSystem.calculateOutcome(role.outcomes, survival.survived);
    - Store survival on this.currentSurvival for results card access
    - Render outcome.deathContext panel if it exists (cause, historicalRate, yourChoices)
    - In main.js, add on role:selected: consequenceSystem.setCurrentRole(data.roleId)
    - In main.js, add on role:selected: consequenceSystem.reset()
    - _Requirements: ConsequenceSystem Integration_
    - _Status: COMPLETE — All wiring completed during file integration_

  - [x] 0.15 Validate all Phase 0 bug fixes
    - Run through all 5 scenes of each role
    - Verify outcome screen appears (no white screen)
    - Verify ambient audio plays and crossfades
    - Verify no audio bleed between scenes (change scene rapidly, confirm clean audio)
    - Verify effects appear when scene text appears
    - Verify no console errors
    - Verify death outcomes fire (American Sailor: take below-deck choices,
      expect ~78% death rate reflected in multiple playthroughs)
    - _Requirements: Bug Fix Validation Checklist_
    - _Status: COMPLETE — All fixes deployed to https://royceshannon2-blip.github.io/Witness-Interactive_

- [x] Checkpoint: Ensure all Phase 0 tasks pass validation before proceeding
  - _Status: COMPLETE — All Phase 0 tasks (0.1-0.15) are complete and deployed_

---

- [ ] Phase 1: Foundation (SceneRouter + Data Structures)
  - [ ] 1.1 Create SceneRouter.js
    - Create js/engine/SceneRouter.js
    - Implement constructor(eventBus)
    - Implement loadRole(roleData) with Scene_Map building
    - Implement getScene(sceneId) with null handling
    - Implement validateScene(scene) with warning emission
    - Implement isTerminal(scene) check
    - Implement validatePaths() for connectivity and loop detection
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 10.1, 10.2, 10.4_

  - [ ] 1.2 Update scene data structures for Japanese Aviator
    - Scenes already have id and nextScene fields (implemented in newfiles/)
    - Add psychologyEffects field to all choices (zero deltas initially)
    - Update ja-scene-01 to branch to ja-scene-02a/b/c
    - _Requirements: 2.1, 2.2, 2.4_

  - [ ] 1.3 Update scene data structures for American Sailor
    - Scenes already have id and nextScene fields
    - Add psychologyEffects field to all choices
    - Update as-scene-01 to branch to as-scene-02a/b/c
    - _Requirements: 2.1, 2.2, 2.4_

  - [ ] 1.4 Update scene data structures for American Civilian
    - Scenes already have id and nextScene fields
    - Add psychologyEffects field to all choices
    - Update ac-scene-01 to branch to ac-scene-02a/b/c
    - Fix ac-scene-02a bug (nextScene should be ac-scene-03b, not as-scene-03a)
    - _Requirements: 2.1, 2.2, 2.4, Content Bug Fix_

  - [ ] 1.5 Run Phase 1 smoke test
    - Create smoke-test-phase1.js
    - Test SceneRouter.loadRole() on all three roles
    - Verify all nextScene references resolve
    - Verify no unreachable scenes or loops
    - Fix any validation errors before proceeding
    - _Requirements: Phase 1 Smoke Test_

- [ ] Checkpoint: Phase 1 smoke test must pass

---

- [ ] Phase 2: Branching Content
  - [ ] 2.1 Write Japanese Aviator branching scenes
    - Write ja-scene-02a, ja-scene-02b, ja-scene-02c (branch point)
    - Write ja-scene-03a, ja-scene-03b, ja-scene-03c (second branch)
    - Write ja-scene-04a, ja-scene-04b, ja-scene-04c (third branch)
    - Write ja-scene-05 (convergence - all paths merge)
    - Follow game-writing.md standards: 80-150 words, second person present tense, 3+ senses
    - Include psychologyEffects for all choices (use guidelines from Section 24d)
    - Include apThemes arrays for all scenes
    - Use Fetch MCP to verify historical facts before writing
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [ ] 2.2 Test Japanese Aviator path routing
    - Manually play through compliance path (01 → 02a → 03a → 04a → 05)
    - Manually play through instinct path (01 → 02b → 03b → 04b → 05)
    - Manually play through witness path (01 → 02c → 03c → 04c → 05)
    - Verify all paths reach convergence scene
    - Verify no broken nextScene references
    - _Requirements: 10.1_

  - [ ] 2.3 Write American Sailor branching scenes
    - Write as-scene-02a through as-scene-04c and as-scene-05 (convergence)
    - Follow same standards as Japanese Aviator
    - Use Fetch MCP for historical verification
    - _Requirements: 3.1, 3.2, 3.3, 4.1-4.7_

  - [ ] 2.4 Test American Sailor path routing
    - Test all three paths, verify convergence
    - _Requirements: 10.1_

  - [ ] 2.5 Write American Civilian branching scenes
    - Write ac-scene-02a through ac-scene-04c and ac-scene-05 (convergence)
    - Follow same standards
    - Use Fetch MCP for historical verification
    - _Requirements: 3.1, 3.2, 3.3, 4.1-4.7_

  - [ ] 2.6 Test American Civilian path routing
    - Test all three paths, verify convergence
    - _Requirements: 10.1_

  - [ ] 2.7 Assign atmospheric effects and ambient tracks to branching scenes
    - Assign atmosphericEffect field to all new scenes
    - Assign ambientTrack field (filename string only, not object) to all new scenes
    - Ensure convergence scenes have appropriate effects
    - _Requirements: Atmospheric Effects, Ambient Audio_

- [ ] Checkpoint: All three roles have complete branching paths with effects/audio assigned

---

- [ ] Phase 3: Path Classification
  - [ ] 3.1 Create PathClassifier.js
    - Create js/engine/PathClassifier.js
    - Implement classify(consequenceFlags, pathRules) using data-driven rules
    - Implement getSummary(pathVariant)
    - Implement getOtherPaths(pathVariant)
    - Pure utility - no EventBus, no state, no side effects
    - _Requirements: Path Classification Logic_

  - [ ] 3.2 Define path classification data in psychology-data.js
    - Create js/content/missions/pearl-harbor/psychology-data.js
    - Define PATH_RULES array with weights
    - Define DEFAULT_FLAGS object
    - Test classification with known flag combinations
    - _Requirements: Path Classification Logic_

  - [ ] 3.3 Unit test PathClassifier
    - Test compliance path classification
    - Test instinct path classification
    - Test witness path classification
    - Test tie-breaking (should default to witness)
    - _Requirements: Path Classification Logic_

---

- [ ] Phase 4: Psychology System
  - [ ] 4.1 Create PsychologyEngine.js
    - Create js/engine/PsychologyEngine.js
    - Implement init() to set all scores to 50
    - Implement applyEffects(psychologyEffects) with clamping to 0-100
    - Implement getScores() to return snapshot
    - Implement getHistory() to return ChoiceImpact array
    - Implement calculateGrade(scores, gradeConfig)
    - Implement classifyArchetype(scores, archetypes, role)
    - Implement reset() to clear all state
    - Emit psychology:scores-updated after applyEffects
    - Listen for scene:terminal to trigger grade/archetype calculation
    - _Requirements: Psychology System_

  - [ ] 4.2 Define psychology data structures
    - Add GRADE_CONFIG to psychology-data.js
    - Add ARCHETYPES array (all 9 archetypes with role-specific descriptions)
    - Add HUD_LABELS object
    - _Requirements: Psychology System, Section 7_

  - [ ] 4.3 Unit test PsychologyEngine
    - Test score initialization (all 50)
    - Test score clamping (0-100 bounds)
    - Test grade calculation for known scores
    - Test archetype classification for known patterns
    - Test reset() clears state
    - _Requirements: Properties 22, 23, 24_

  - [ ] 4.4 Create MoraleHUD.js
    - Create js/engine/MoraleHUD.js
    - Implement init() to inject HUD element into DOM
    - Implement updateDisplay(scores, effects) with bar animations and delta popups
    - Implement show() and hide() for visibility control
    - Implement showFinalResults(grade, archetype) for expanded overlay
    - Implement destroy() to remove from DOM
    - Listen for psychology:scores-updated, scene:choices-shown, scene:narrative-started
    - _Requirements: Psychology System_

  - [ ] 4.5 Add MoraleHUD CSS
    - Add HUD styles to css/style.css
    - Define CSS custom properties for colors (--color-morale, --color-loyalty, etc.)
    - Add bar fill animations (width transition 0.6s ease-out)
    - Add delta popup styles (fade out over 1.5s)
    - Add mobile breakpoint (≤320px collapse to icons)
    - Add prefers-reduced-motion support (skip animations)
    - Add .choices-disabled class
    - NOTE: Do NOT add atmospheric effect keyframes here — AtmosphericEffects.js
      injects its own keyframes at runtime
    - _Requirements: Psychology System, Accessibility, Responsive Design_

  - [ ] 4.6 Run Phase 4 smoke test
    - Create smoke-test-phase4.js
    - Test score updates with real choice data
    - Test grade calculation
    - Test archetype classification
    - Verify no errors
    - _Requirements: Phase 4 Smoke Test_

  - [ ] 4.7 Replace zero-delta psychologyEffects placeholders
    - Update japanese-aviator.js with real psychologyEffects values
    - Update american-sailor.js with real psychologyEffects values
    - Update american-civilian.js with real psychologyEffects values
    - Use guidelines from Section 24d (psychology effects table)
    - NOTE: Do NOT add killedInAction, diedOnArizona, or civilianCasualty flags —
      survival is determined by ConsequenceSystem.determineSurvival(), not by flags
    - _Requirements: Psychology System, Content Style Guide_

- [ ] Checkpoint: Phase 4 smoke test must pass

---

- [ ] Phase 5: Outcome System
  - **ARCHITECTURE NOTE:** The original plan described a separate OutcomeGenerator.js
    with killedInAction/diedOnArizona/civilianCasualty flags controlling survival.
    That approach is REPLACED. Do not create OutcomeGenerator.js.
    Do not add those binary survival flags to choices.

  **What was actually built (already in newfiles/):**
  - ConsequenceSystem.js contains determineSurvival(roleId) — weighted probability
    roll using historical death rates as baseline, modified by player choices
  - All three role files have complete outcome arrays with survived: true/false on
    every outcome, plus deathContext objects explaining why the player died
  - calculateOutcome(outcomeRules, survived) selects best-scoring narrative match
    within the correct survival bucket

  **What still needs to be done:**

  - [ ] 5.1 Verify all 18 outcome epilogues are complete and historically accurate
    - japanese-aviator.js: 4 death outcomes + 4 survival outcomes (8 total) ✓ in newfiles/
    - american-sailor.js: 4 death outcomes + 4 survival outcomes (8 total) ✓ in newfiles/
    - american-civilian.js: 4 death outcomes + 4 survival outcomes (8 total) ✓ in newfiles/
    - Use Fetch MCP to verify all historical claims in epilogues
    - Verify word counts (target 100-200 words per epilogue)
    - _Requirements: 5.3, 5.4, 5.5, Section 9_

  - [ ] 5.2 Wire survival data through game:complete event
    - In SceneStateMachine.js (or wherever game:complete fires), pass survival data:
        const survival = consequenceSystem.determineSurvival(currentRoleId);
        const outcomeId = consequenceSystem.calculateOutcome(role.outcomes, survival.survived);
        eventBus.emit('game:complete', {
          missionId, roleId, outcomeId,
          survived: survival.survived,
          deathChance: survival.deathChance,
          modifiers: survival.modifiers
        });
    - This requires SceneStateMachine to have access to consequenceSystem
      (pass in constructor if not already there)
    - _Requirements: 5.1, 5.2, 5.6_

  - [ ] 5.3 Render deathContext panel in outcome screen
    - UIController.js populateOutcomeScreen() — after rendering survived/died status,
      check if outcome.deathContext exists and render it:
        "What happened" — outcome.deathContext.cause
        "Historical rate" — outcome.deathContext.historicalRate
        "Your choices" — outcome.deathContext.yourChoices
    - This turns the outcome screen into an educational moment explaining
      why the historical death rate is what it is
    - _Requirements: Educational Panel_

  - [ ] 5.4 Run Phase 5 smoke test
    - Play American Sailor 5 times — expect death most of the time (~78%)
    - Play Japanese Aviator 5 times — expect death roughly 1-2 of those (~35%)
    - Play American Civilian 5 times — expect survival almost every time (~2% death)
    - Verify deathContext panel renders on death outcomes
    - Verify death epilogues differ based on what choices were made
    - _Requirements: Phase 5 Smoke Test_

- [ ] Checkpoint: Phase 5 smoke test must pass

---

- [ ] Phase 6: Knowledge Checkpoint Updates
  - [ ] 6.1 Write expanded knowledge questions
    - Update js/content/missions/pearl-harbor/knowledge-questions.js
    - Add pathVariant field to all existing questions
    - Write 12 new questions (2 per path per role)
    - Total: 18 questions (6 per role, 2 per path variant)
    - Follow AP question format (4 choices, explanations for all)
    - Verify AP theme alignment
    - _Requirements: 7.1, 7.2, Section 10_

  - [ ] 6.2 Update KnowledgeCheckpoint.js
    - Add selectQuestions(allQuestions, pathVariant) method
    - Select 3 questions matching player's path variant
    - Fall back to other paths if fewer than 3 exist
    - Update question object shape to include pathVariant field
    - _Requirements: 7.3, 7.4, 7.8_

  - [ ] 6.3 Test knowledge checkpoint path awareness
    - Play through each path, verify matching questions appear
    - _Requirements: 7.4_

---

- [ ] Phase 7: Results Card Updates
  - [ ] 7.1 Update ResultsCard.js
    - Add path taken display section
    - Add other available paths display
    - Add Teammate Grade section (letter, label, description)
    - Add Personality Archetype section (name, role-specific description)
    - Add final scores display with bars
    - Add educator note
    - Add survival stats panel — show deathChance% and what modifiers applied
      (feeds from survival.deathChance and survival.modifiers in game:complete data)
    - Track completed paths in session (no localStorage)
    - Read data from PathClassifier and PsychologyEngine
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, Psychology System_

  - [ ] 7.2 Add Results Card CSS
    - Style path taken section
    - Style Teammate Grade (large letter, prominent display)
    - Style Personality Archetype section
    - Style score bars (static, no animation)
    - Style educator note (small, muted text)
    - Style survival stats panel
    - Add mobile responsive styles
    - _Requirements: Responsive Design_

  - [ ] 7.3 Test Results Card display
    - Verify all sections render correctly
    - Test with different paths, grades, archetypes
    - _Requirements: 8.1-8.6_

---

- [ ] Phase 8: Historical Ripple Updates
  - [ ] 8.1 Create ripple-intros.js
    - Create js/content/missions/pearl-harbor/ripple-intros.js
    - Write 9 intro texts (3 roles × 3 paths), 15-30 words each
    - _Requirements: 6.2, 6.3, 6.4, 6.6, Section 11_

  - [ ] 8.2 Update Historical Ripple component
    - Read path variant from PathClassifier
    - Select appropriate intro text
    - Verify timeline content stays identical for all paths
    - _Requirements: 6.1, 6.5_

  - [ ] 8.3 Test Historical Ripple personalization
    - Play through all three paths for one role
    - Verify intro text differs, timeline stays the same
    - _Requirements: 6.5_

---

- [ ] Phase 9: Integration
  - [ ] 9.1 Inject PathClassifier into dependent components
    - Create PathClassifier instance in main.js
    - Pass to OutcomeGenerator, KnowledgeCheckpoint, ResultsCard, Historical Ripple
    - _Requirements: Path Classification Integration_

  - [ ] 9.2 Update SceneStateMachine.js
    - Accept sceneRouter and psychologyEngine in constructor
    - Add initRole(roleData) method that calls SceneRouter.loadRole()
    - Update handleChoice() to apply psychology effects after consequence flags
    - Delegate routing to SceneRouter.handleChoice()
    - Replace sequential index navigation with SceneRouter.getScene()
    - Keep all existing EventBus event signatures unchanged
    - NOTE: Also pass consequenceSystem in constructor (needed for 5.2 survival wiring)
    - _Requirements: 1.1, Psychology System Integration_

  - [ ] 9.3 Update ConsequenceSystem.js
    - getFlags() / getAllFlags() already implemented — no changes needed
    - _Requirements: 5.1_

  - [ ] 9.4 Update main.js
    - Initialize PsychologyEngine
    - Initialize MoraleHUD with HUD_LABELS
    - Initialize SceneRouter
    - Pass sceneRouter, psychologyEngine, and consequenceSystem to SceneStateMachine
    - Wire role:selected to call consequenceSystem.setCurrentRole(roleId)
    - Wire role:selected to call consequenceSystem.reset()
    - Add beforeunload and pagehide listeners for cleanup
    - _Requirements: Psychology System, Teacher Mode Hooks_

  - [ ] 9.5 Test full game initialization
    - Start game, select role, verify first scene loads, verify MoraleHUD appears
    - _Requirements: Integration_

  - [ ] 9.6–9.8 Test complete playthroughs (all three roles, all three paths)
    - Verify scene transitions, psychology scores, outcome screen, Results Card
    - _Requirements: Integration_

- [ ] Checkpoint: All three roles completable end-to-end

---

- [ ] Phase 10: Accessibility Implementation
  - [ ] 10.1 Add keyboard navigation
  - [ ] 10.2 Add ARIA support
  - [ ] 10.3 Verify color contrast
  - [ ] 10.4 Add skip link
  - [ ] 10.5 Test keyboard-only navigation
  - [ ] 10.6 Test with screen reader

---

- [ ] Phase 11: Mobile Optimization
  - [ ] 11.1 Add responsive CSS
  - [ ] 11.2 Adjust typewriter speed for mobile
  - [ ] 11.3 Implement performance tiers
  - [ ] 11.4 Add touch interactions
  - [ ] 11.5 Test on mobile devices

---

- [ ] Phase 12: Share and Social Proof
  - [ ] 12.1 Implement share functionality
  - [ ] 12.2 Add call-to-action modal (survey + Discord links)
  - [ ] 12.3 Add traction metrics logging
  - [ ] 12.4 Add social proof to landing page

---

- [ ] Phase 13: Testing and Polish
  - [ ] 13.1 Manual testing checklist (9 playthroughs — all roles, all paths)
  - [ ] 13.2 Content review (Fetch MCP for historical accuracy)
  - [ ] 13.3 Playwright MCP testing
  - [ ] 13.4 Performance testing
  - [ ] 13.5 Cross-browser testing

---

- [ ] Phase 14: Deployment
  - [ ] 14.1 Final validation (all smoke tests + Playwright)
  - [ ] 14.2 Git commit via GitHub MCP
  - [ ] 14.3 Deploy to GitHub Pages

- [ ] Final Checkpoint: Game is live and fully functional

---

## Notes

- Phase 0 tasks 0.1–0.4 are complete. Start at 0.8.
- Phase 5 (Outcome System) architecture has changed — read the architecture note before starting
- Do NOT create OutcomeGenerator.js — survival logic lives in ConsequenceSystem.js
- Do NOT add killedInAction / diedOnArizona / civilianCasualty flags — these are replaced by the probability system
- ambientTrack is always a string filename, never an object — applies to all scene data
- CSS keyframes for atmospheric effects are injected at runtime by AtmosphericEffects.js — do not add them to any stylesheet
- Use Fetch MCP to verify historical facts before writing content
- Use Playwright MCP to test full game flow after integration
- Use GitHub MCP to commit after completion