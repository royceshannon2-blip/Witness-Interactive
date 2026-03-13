# Task 10.1: Hutu Moderate Role Testing Report

## Test Date
March 12, 2026

## Test Objective
Test all 3 branching paths for the Hutu Moderate role (Augustin) in the Rwanda Genocide mission.

## Test Environment
- Browser: Playwright (Chromium)
- Server: Python HTTP server (localhost:8000)
- Mission: Rwanda Genocide (rwanda-1994)
- Role: Hutu Moderate (hutu-moderate)

## Test Results Summary

### ✅ RESCUE PATH (Path 1)
**Tested Choices:**
1. Scene 1: "Hide Celestin in the attic" → Scene 2 (rw-hm-scene-02a)
2. Scene 2: "Misdirect them to another house" → Scene 5 (rw-hm-scene-03a)
3. Scene 5: "Misdirect again—claim cards are valid" → Scene 8 (rw-hm-scene-04a - BLOCKED)

**Status:** ✅ Branching works correctly through 3 scenes
**Issue:** Terminal scene (rw-hm-scene-04a) rejected due to validation error

### ✅ COMPLIANCE PATH (Path 2)
**Tested Choices:**
1. Scene 1: "Attend the Hutu Power rally" → Scene 3 (rw-hm-scene-02b)
2. Scene 3: "Accept the roadblock assignment" → Scene 7 (rw-hm-scene-03c)
3. Scene 7: "Continue staffing the roadblock" → Scene 8 (rw-hm-scene-04b - BLOCKED)

**Status:** ✅ Branching works correctly through 3 scenes
**Issue:** Terminal scene (rw-hm-scene-04b) rejected due to validation error

### ✅ FLIGHT PATH (Path 3)
**Tested Choices:**
1. Scene 1: "Tell him to leave quickly" → Scene 4 (rw-hm-scene-02c)
2. Scene 4: "Flee Kigali before dawn" → Scene 8 (rw-hm-scene-03d - BLOCKED)

**Status:** ✅ Branching works correctly through 2 scenes
**Issue:** Terminal scene (rw-hm-scene-03d) rejected due to validation error
**Result:** Game jumped to outcome screen with error message

## Branching Verification

### ✅ Path Divergence Confirmed
- **Rescue Path:** Scenes 02a → 03a → 04a (gacaca testimony)
- **Compliance Path:** Scenes 02b → 03c → 04b (gacaca confession)
- **Flight Path:** Scenes 02c → 03d (countryside hiding)

Each path leads to genuinely different scenes with unique narratives, confirming true branching implementation.

### ✅ Scene Content Quality
- Historical accuracy maintained across all paths
- AP themes properly tagged (causation, perspective, complexity, continuity)
- Atmospheric effects configured (smoke, ambient audio)
- Timed choices implemented where appropriate
- Narrative quality is compelling and educational

## Technical Issues Found

### ❌ Critical: Terminal Scene Validation Error
**Error:** `SceneStateMachine.validateChoice: Choice "rw-hm-choice-04a-a" missing "nextScene"`

**Root Cause:** Terminal scenes (04a, 04b, 04d) have choices with `nextScene: null`, which fails validation in SceneStateMachine.js line 136.

**Impact:** 
- Players cannot reach final scenes or outcomes
- Game either loops previous scene or shows error message
- Feedback survey appears but outcome is "Unable to determine outcome"

**Affected Scenes:**
- rw-hm-scene-04a (rescue path ending)
- rw-hm-scene-04b (compliance path ending)
- rw-hm-scene-04d (flight path ending)

**Console Errors:**
```
SceneStateMachine.validateChoice: Choice "rw-hm-choice-04a-a" missing "nextScene"
SceneStateMachine.loadRole: Invalid scene object, skipping
```

### ✅ Feedback System Working
- Feedback survey panel appeared correctly after mission completion
- Survey includes all required fields (experience rating, likes, issues)
- EventBus communication working properly

### ⚠️ Expected Errors (Non-Critical)
- Missing audio files (404 errors) - expected in development
- Missing narrator audio files - expected in development

## Requirements Verification

### US-3.3: Branching Narrative Paths
✅ **VERIFIED** - All 3 paths diverge correctly with unique scenes

### US-4.1: Consequence System
✅ **PARTIALLY VERIFIED** - Flags are being set correctly, but outcomes cannot be reached due to terminal scene validation issue

### US-4.2: Historical Accuracy
✅ **VERIFIED** - Content is historically accurate with proper AP themes

## Recommendations

### 1. Fix Terminal Scene Validation (CRITICAL)
The SceneStateMachine needs to handle terminal scenes that lead to outcomes rather than other scenes. Options:
- Allow `nextScene: null` for terminal scenes
- Use a special value like `nextScene: "OUTCOME"` 
- Add a `isTerminal: true` flag to scene objects

### 2. Test Knowledge Questions
Once terminal scenes are fixed, verify that knowledge questions display correctly before outcomes.

### 3. Test Outcome Generation
Verify that the OutcomeGenerator correctly matches flags to outcomes for all 3 paths.

## Conclusion

**Task 10.1 Status: ⚠️ PARTIALLY COMPLETE**

The branching narrative system works correctly - all 3 paths diverge as designed with unique scenes and compelling narratives. However, a critical validation bug prevents players from reaching terminal scenes and outcomes. The branching logic itself is sound; the issue is in the scene validation layer.

**Next Steps:**
1. Fix terminal scene validation in SceneStateMachine
2. Re-test all 3 paths to completion
3. Verify knowledge questions display
4. Verify outcomes match player choices
5. Mark task as fully complete
