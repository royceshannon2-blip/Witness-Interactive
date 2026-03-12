# Implementation Plan: Rwanda Genocide Mission

## Overview

This implementation plan creates the Rwanda Genocide Mission (April–July 1994) as a playable historical experience with 3 roles, true branching narratives, and aftermath scenes. The mission reuses all existing Pearl Harbor engine systems without modification, proving the platform's scalability.

## Tasks

- [x] 1. Create mission file structure and metadata
  - Create `js/content/missions/rwanda/` directory
  - Create `mission.js` with mission metadata (id, title, date, era, teaser)
  - Define 8 historical ripple events (April 1994 to present)
  - Export mission object with empty roles array (populated later)
  - _Requirements: US-1.1, US-1.2, US-1.3, US-7.1, US-7.2, TR-2.1_

- [x] 2. Implement Hutu Moderate role (Augustin)
  - [x] 2.1 Create hutu-moderate.js file structure
    - Export ROLE_DATA object with id, name, description
    - Create empty scenes array (9 scenes total)
    - Create empty outcomes array (4 outcomes total)
    - _Requirements: US-2.1, US-2.2, US-2.3, TR-2.2_

  - [x] 2.2 Write Hutu Moderate branch scenes (scenes 01-03)
    - Scene rw-hm-scene-01: April 6 evening, Celestin at door (3 choices)
    - Scene rw-hm-scene-02a: Help Celestin hide (2 choices)
    - Scene rw-hm-scene-02b: Attend Hutu Power rally (1 choice)
    - Scene rw-hm-scene-02c: Flee Kigali (1 choice)
    - Scene rw-hm-scene-03a: Roadblock - misdirect militia (timed, 12s)
    - Scene rw-hm-scene-03b: Roadblock - comply with orders (timed, 12s)
    - Scene rw-hm-scene-03c: Staff roadblock (1 choice)
    - Scene rw-hm-scene-03d: Hide in countryside (1 choice)
    - All scenes: 100-160 words, second person present tense, 3+ sensory details
    - All scenes: AP themes from [causation, continuity, perspective, complexity]
    - All scenes: Audio paths, ambient tracks, atmospheric effects
    - _Requirements: US-3.1, US-3.2, US-6.1, US-6.2, US-10.1, US-10.2, US-11.1, US-12.5, TR-3.1, TR-3.2, TR-3.3_

  - [x] 2.3 Write Hutu Moderate aftermath scene (scene 04)
    - Scene rw-hm-scene-04a: Gacaca testimony (rescue path)
    - 120-150 words, references earlier choices by name
    - Presents justice vs. reconciliation tension
    - No "correct" path endorsed
    - _Requirements: US-5.1, US-5.2, US-5.3_

  - [x] 2.4 Write Hutu Moderate outcomes (4 outcomes)
    - Outcome rw-hm-outcome-rescue-survived
    - Outcome rw-hm-outcome-rescue-killed
    - Outcome rw-hm-outcome-compliance-survived
    - Outcome rw-hm-outcome-compliance-killed
    - Each: 150-200 words, conditions match consequence flags
    - Each: Epilogue references player choices, historical anchor
    - _Requirements: US-4.3, TR-5.1, TR-5.2_

- [x] 3. Implement Tutsi Survivor role (Immaculée)
  - [x] 3.1 Create tutsi-survivor.js file structure
    - Export ROLE_DATA object with id, name, description
    - Create empty scenes array (9 scenes total)
    - Create empty outcomes array (4 outcomes total)
    - _Requirements: US-2.1, US-2.2, US-2.3, TR-2.2_

  - [x] 3.2 Write Tutsi Survivor branch scenes (scenes 01-03)
    - Scene rw-ts-scene-01: April 7 morning, decision point (3 choices)
    - Scene rw-ts-scene-02a: Go to church (timed, 12s, 2 choices)
    - Scene rw-ts-scene-02b: Seek Hutu friend's house (1 choice)
    - Scene rw-ts-scene-02c: Try to reach hotel (1 choice)
    - Scene rw-ts-scene-03a: Escape church massacre (1 choice)
    - Scene rw-ts-scene-03b: Hide in church ceiling (1 choice)
    - Scene rw-ts-scene-03c: Hide in attic (1 choice)
    - Scene rw-ts-scene-03d: Roadblock negotiation (timed, 10s, 1 choice)
    - All scenes: 100-160 words, trauma-informed writing
    - All scenes: No direct dehumanizing language
    - _Requirements: US-3.1, US-3.2, US-6.1, US-6.3, US-12.1, US-12.2, US-12.3, US-12.5_

  - [x] 3.3 Write Tutsi Survivor aftermath scene (scene 04)
    - Scene rw-ts-scene-04a: ICTR testimony (testimony path)
    - Scene rw-ts-scene-04b: Survivor guilt (hidden path)
    - Scene rw-ts-scene-04c: Reconciliation meeting (hidden path)
    - Scene rw-ts-scene-04d: Hotel survivor (enclave path)
    - 120-150 words each, references earlier choices
    - _Requirements: US-5.1, US-5.2, US-5.3_

  - [x] 3.4 Write Tutsi Survivor outcomes (4 outcomes)
    - Outcome rw-ts-outcome-hidden-survived
    - Outcome rw-ts-outcome-hidden-killed
    - Outcome rw-ts-outcome-enclave-survived
    - Outcome rw-ts-outcome-testimony-survived
    - Each: 150-200 words, conditions match flags
    - _Requirements: US-4.3, TR-5.1, TR-5.2_

- [x] 4. Implement UN Peacekeeper role (Captain Marcus Webb)
  - [x] 4.1 Create un-peacekeeper.js file structure
    - Export ROLE_DATA object with id, name, description
    - Create empty scenes array (9 scenes total)
    - Create empty outcomes array (4 outcomes total)
    - _Requirements: US-2.1, US-2.2, US-2.3, TR-2.2_

  - [x] 4.2 Write UN Peacekeeper branch scenes (scenes 01-03)
    - Scene rw-un-scene-01: April 7 UNAMIR HQ (3 choices)
    - Scene rw-un-scene-02a: Stay at hotel (timed, 15s, 2 choices)
    - Scene rw-un-scene-02b: Evacuate expatriates (timed, 12s, 1 choice)
    - Scene rw-un-scene-02c: Document atrocities (1 choice)
    - Scene rw-un-scene-03a: Defy orders to evacuate (1 choice)
    - Scene rw-un-scene-03b: Protect civilians, follow mandate (1 choice)
    - Scene rw-un-scene-03c: Leave Rwandans behind (1 choice)
    - Scene rw-un-scene-03d: Send reports to HQ (1 choice)
    - All scenes: Reference Dallaire's genocide fax, UNAMIR mandate
    - _Requirements: US-3.1, US-3.2, US-6.1, US-6.2, US-6.3_

  - [x] 4.3 Write UN Peacekeeper aftermath scene (scene 04)
    - Scene rw-un-scene-04a: PTSD treatment (stayed path)
    - Scene rw-un-scene-04b: Inquiry testimony (stayed path)
    - Scene rw-un-scene-04c: Guilt and advocacy (evacuated path)
    - Scene rw-un-scene-04d: Whistleblower (documented path)
    - 120-150 words each, references earlier choices
    - _Requirements: US-5.1, US-5.2, US-5.3_

  - [x] 4.4 Write UN Peacekeeper outcomes (4 outcomes)
    - Outcome rw-un-outcome-stayed-survived
    - Outcome rw-un-outcome-evacuated-survived
    - Outcome rw-un-outcome-documented-survived
    - Outcome rw-un-outcome-stayed-killed
    - Each: 150-200 words, conditions match flags
    - _Requirements: US-4.3, TR-5.1, TR-5.2_

- [x] 5. Create knowledge questions (9 questions)
  - [x] 5.1 Write Hutu Moderate questions (3 questions)
    - Question 1: RTLM's role in mobilization (causation)
    - Question 2: Identity cards as genocide tool (complexity)
    - Question 3: Concept of "bystander" vs. perpetrator (perspective)
    - Each: 4 choices, 1 correct, 4 explanations
    - _Requirements: US-8.1, US-8.2, US-8.3_

  - [x] 5.2 Write Tutsi Survivor questions (3 questions)
    - Question 1: Churches as massacre sites (perspective)
    - Question 2: Arusha Accords failure (causation)
    - Question 3: Gacaca courts vs. ICTR (continuity)
    - Each: Grounded in role experience
    - _Requirements: US-8.1, US-8.2, US-8.3_

  - [x] 5.3 Write UN Peacekeeper questions (3 questions)
    - Question 1: Dallaire's genocide fax (causation)
    - Question 2: Peacekeeping mandate limits (complexity)
    - Question 3: Genocide Convention obligations (perspective)
    - Each: Reference events player witnessed
    - _Requirements: US-8.1, US-8.2, US-8.3_

- [x] 6. Create ripple intros (9 intros)
  - Write 3 intros per role (rescue/compliance/flight, hidden/enclave/testimony, stayed/evacuated/documented)
  - Each: 80-120 words, second person, reflective tone
  - Each: Connect personal choices to macro-historical consequences
  - No congratulatory tone, acknowledge complexity and cost
  - _Requirements: US-9.1, US-9.2_

- [x] 7. Register mission in main.js
  - Import rwanda mission: `import rwandaMission from './content/missions/rwanda/mission.js'`
  - Register: `MissionRegistry.registerMission(rwandaMission)`
  - Verify mission appears in timeline selector
  - _Requirements: TR-6.1_

- [x] 8. Update version and release notes
  - Update `config/version.js` to next version
  - Update `config/update-notes.json` with:
    - "New mission: Rwanda, 1994 - Experience the genocide from three perspectives"
    - "9 branching narrative paths with aftermath scenes"
    - "Gacaca courts and reconciliation themes"
  - _Requirements: UX feedback system compliance_

- [x] 9. Checkpoint - Validate scene graph integrity
  - Run scene graph validation for all 3 roles
  - Verify no broken nextScene references
  - Verify no orphaned scenes (all reachable from start)
  - Verify all consequence flags in outcomes are settable by choices
  - Verify all scene IDs use correct prefix (rw-hm-, rw-ts-, rw-un-)
  - Ensure all tests pass, ask the user if questions arise

- [~] 10. Full playthrough testing
  - [x] 10.1 Test Hutu Moderate role (all 3 paths)
    - Play rescue path: Help Celestin → misdirect militia → gacaca testimony
    - Play compliance path: Attend rally → staff roadblock → confession
    - Play flight path: Flee Kigali → hide in countryside → refugee camp
    - Verify branching works, outcomes match paths, knowledge questions display
    - _Requirements: US-3.3, US-4.1, US-4.2_

  - [x] 10.2 Test Tutsi Survivor role (all 3 paths)
    - Play hidden path: Seek friend → hide in attic → reconciliation
    - Play enclave path: Try hotel → roadblock → hotel survivor
    - Play testimony path: Go to church → escape massacre → ICTR testimony
    - Verify timed choices work, defaults are pedagogically meaningful
    - _Requirements: US-6.2, US-6.3_

  - [x] 10.3 Test UN Peacekeeper role (all 3 paths)
    - Play stayed path: Stay at hotel → defy orders → PTSD treatment
    - Play evacuated path: Evacuate expatriates → leave Rwandans → guilt
    - Play documented path: Document atrocities → send reports → whistleblower
    - Verify historical ripple timeline displays correctly
    - _Requirements: US-7.1, US-7.2_

- [~] 11. Cross-mission integration test
  - Play Pearl Harbor mission, then Rwanda mission in same session
  - Verify missions don't interfere with each other
  - Verify consequence flags don't collide (ph_ vs rw_ prefixes)
  - Verify feedback system captures both missions correctly
  - _Requirements: TR-1.1, Architecture Heritage AH-1 through AH-10_

- [~] 12. Accessibility and mobile testing
  - Test screen reader (NVDA/JAWS) on all 3 roles
  - Test keyboard navigation (Tab, Enter, Arrow keys)
  - Test mobile viewports (320px, 768px, 1280px)
  - Verify color contrast meets WCAG AA
  - _Requirements: NFR-3.1_

- [~] 13. Final checkpoint - Ensure all tests pass
  - All 9 playthroughs complete without errors
  - All knowledge questions display and score correctly
  - All ripple intros display based on path classification
  - No console errors during gameplay
  - Feedback survey appears after mission completion
  - Update panel shows new mission on fresh load
  - Ensure all tests pass, ask the user if questions arise

## Notes

- All content must be verified against `docs/RwandanGenocide(1990–Aftermath).md`
- Trauma-informed writing guidelines must be followed for all scenes
- No engine modifications allowed - reuse existing systems only
- All consequence flags must use `rw_` prefix
- All audio paths must follow convention: `audio/narration/{role-id}/rw-xx-scene-XX.mp3`
- Ambient tracks are placeholder filenames only (developer sources actual files)
- Tasks marked with `*` are optional and can be skipped for faster MVP

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-15  
**Status:** Ready for Implementation
