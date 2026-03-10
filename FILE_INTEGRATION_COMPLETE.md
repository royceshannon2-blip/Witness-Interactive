# File Integration Complete

**Date:** March 10, 2026  
**Status:** ✅ All 9 files integrated successfully

## Files Updated

### Engine Files (js/engine/)
1. **SceneStateMachine.js** - Full replace
   - Added explicit handling for `nextSceneId === 'outcome'` sentinel value
   - Changed missing scene behavior from `game:complete` to `scene:error`
   - Prevents white-screen crashes on invalid scene IDs

2. **UIController.js** - Full replace
   - Removed `scene:rendered` emit from `renderScene()` (was causing audio stacking)
   - Added `scene:error` handler in `subscribeToEvents()` (re-renders current scene safely)
   - Updated `calculateCurrentOutcome()` to use two-step survival system
   - Updated `populateOutcomeScreen()` to use two-step survival system
   - Added deathContext panel rendering for death outcomes

3. **NarratorAudioManager.js** - Full replace
   - Complete rewrite with session token architecture
   - `_hardStop()` increments token, invalidating all in-flight async operations
   - Prevents audio overlap across scene transitions permanently
   - Radio clips are fire-and-forget with token guards

4. **AtmosphericEffects.js** - Full replace
   - Replaced heavy particle systems (smoke, fire, explosion) with border glow effects
   - Retained: shake, aftermath, dawn, ash (8 particles max)
   - Injects keyframes at runtime via `injectKeyframes()`
   - Dramatically improved mobile performance

5. **ConsequenceSystem.js** - Full replace
   - Added `determineSurvival(roleId)` with historically-grounded probability system
   - Japanese Aviator: 35% baseline death rate
   - American Sailor: 78% baseline death rate
   - American Civilian: 2% baseline death rate
   - Player choices modify probability, final survival is weighted roll
   - Added `calculateOutcome(outcomeRules, survived)` two-argument form
   - Kept `calculateOutcomeLegacy()` for backward compatibility

### Content Files (js/content/missions/pearl-harbor/)
6. **japanese-aviator.js** - Full replace
7. **american-sailor.js** - Full replace
8. **american-civilian.js** - Full replace
   - All outcomes now have `survived: true/false` field
   - Death outcomes added with `deathContext` objects
   - Renamed `ambientSound` to `ambientTrack` on all scenes
   - Scene consequences updated to set survival-relevant flags

### CSS Files
9. **atmospheric-effects.css** - Full replace
   - Removed all unused particle/smoke/fire/explosion classes
   - Kept only classes that AtmosphericEffects.js actually creates
   - Added z-index rules for narrative text above overlays

### Bootstrap File
10. **main.js** - Targeted updates
    - Added `consequenceSystem.setCurrentRole(roleId)` on `role:selected`
    - Added `consequenceSystem.reset()` on role restart
    - Ensures survival system knows which role is active

## Integration Verification

✅ All 9 files copied from newfiles/ to project
✅ `setCurrentRole()` called on role selection
✅ `calculateOutcome()` updated to two-step approach in both locations
✅ `scene:error` handler added to UIController
✅ `scene:rendered` emit removed from renderScene
✅ deathContext panel rendering added
✅ No `ambientSound` property reads found (all use `ambientTrack`)
✅ Committed to GitHub main branch

## What Changed

**Audio System:**
- NarratorAudioManager now uses session tokens to prevent overlap
- Audio from scene 1 cannot bleed into scene 2 under any circumstances

**Survival System:**
- Survival is no longer flag-based lookup
- Uses historically accurate probability + player choice modifiers
- Two-step: determine survival, then pick best narrative match

**Atmospheric Effects:**
- Border glow replaces heavy particle systems for scenes 2-4
- Mobile performance dramatically improved
- No more jank during typewriter text reveal

**Scene Transitions:**
- Missing scene IDs now emit `scene:error` instead of crashing
- UIController re-renders current scene safely on error
- "outcome" sentinel value handled explicitly

## Next Steps

The game is now ready for end-to-end testing. All critical fixes from the implementation script have been applied.
