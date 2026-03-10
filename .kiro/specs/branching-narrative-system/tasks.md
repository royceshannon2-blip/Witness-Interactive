# Implementation Plan: Branching Narrative System with Player Psychology

## Overview

This implementation plan converts the branching narrative design into discrete coding tasks. The plan follows a phased approach with integration smoke tests to catch issues early. All tasks build incrementally, with no orphaned code.

**Critical:** Complete Phase 0 (Bug Fixes) before starting Phase 1. The branching system depends on stable scene transitions, audio management, and effect timing.

**NOTE ON ARCHITECTURE CHANGE — READ BEFORE STARTING:**
The original plan called for a separate `OutcomeGenerator.js` file and a `killedInAction` / `diedOnArizona` / `civilianCasualty` flag system for survival. This has been replaced. Survival is now a **weighted probability roll** inside `ConsequenceSystem.js` via `determineSurvival(roleId)`. Do NOT create OutcomeGenerator.js. Do NOT add the old binary survival flags to choices. See Phase 5 notes for details.

---

## Tasks

- [x] Phase 0: Critical Bug Fixes and Edge Case Hardening
  - [x] 0.1-0.15: All Phase 0 tasks complete and deployed

- [x] Checkpoint: Ensure all Phase 0 tasks pass validation before proceeding

---

- [x] Phase 1: Foundation (SceneRouter + Data Structures)
  - [x] 1.1-1.5: All Phase 1 tasks complete

- [x] Checkpoint: Phase 1 smoke test must pass

---

- [ ] Phase 2: Branching Content
  - [ ] 2.1 Write Japanese Aviator branching scenes
  - [ ] 2.2 Test Japanese Aviator path routing
  - [ ] 2.3 Write American Sailor branching scenes
  - [ ] 2.4 Test American Sailor path routing
  - [ ] 2.5 Write American Civilian branching scenes
  - [ ] 2.6 Test American Civilian path routing
  - [ ] 2.7 Assign atmospheric effects and ambient tracks to branching scenes

- [ ] Checkpoint: All three roles have complete branching paths with effects/audio assigned

---

- [x] Phase 3: Path Classification
  - [x] 3.1 Create PathClassifier.js
  - [x] 3.2 Define path classification data in psychology-data.js
  - [x] 3.3 Unit test PathClassifier

---

- [ ] Phase 4: Psychology System
  - [x] 4.1 Create PsychologyEngine.js
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
    - _Status: COMPLETE — PsychologyEngine.js created with all methods_

  - [x] 4.2 Define psychology data structures
    - Add GRADE_CONFIG to psychology-data.js
    - Add ARCHETYPES array (all 9 archetypes with role-specific descriptions)
    - Add HUD_LABELS object
    - _Requirements: Psychology System, Section 7_
    - _Status: COMPLETE — All data structures already in psychology-data.js from Phase 3_

  - [x] 4.3 Unit test PsychologyEngine
    - Test score initialization (all 50)
    - Test score clamping (0-100 bounds)
    - Test grade calculation for known scores
    - Test archetype classification for known patterns
    - Test reset() clears state
    - _Requirements: Properties 22, 23, 24_
    - _Status: COMPLETE — PsychologyEngine.test.js created with 5 tests_

  - [ ] 4.4 Create MoraleHUD.js
  - [ ] 4.5 Add MoraleHUD CSS
  - [ ] 4.6 Run Phase 4 smoke test
  - [ ] 4.7 Replace zero-delta psychologyEffects placeholders

- [ ] Checkpoint: Phase 4 smoke test must pass

---

- [ ] Phase 5: Outcome System
- [ ] Phase 6: Knowledge Checkpoint Updates
- [ ] Phase 7: Results Card Updates
- [ ] Phase 8: Historical Ripple Updates
- [ ] Phase 9: Integration
- [ ] Phase 10: Accessibility Implementation
- [ ] Phase 11: Mobile Optimization
- [ ] Phase 12: Share and Social Proof
- [ ] Phase 13: Testing and Polish
- [ ] Phase 14: Deployment

- [ ] Final Checkpoint: Game is live and fully functional
