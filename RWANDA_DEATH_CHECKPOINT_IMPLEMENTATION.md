missions/rwanda/tutsi-survivor.js` - Added `deathEpilogueEarly` to ditch hiding outcome

## Commit

```
feat(rwanda): implement mid-story death checkpoint system

- Add shouldDieNow() methods to ConsequenceSystem for all Rwanda roles
- Hook death checkpoints into SceneStateMachine scene transitions
- Update UIController to use deathEpilogueEarly when player dies mid-story
- Add early death epilogues to key Hutu Moderate and Tutsi Survivor outcomes
```
rvivor attic hiding path outcomes
- Tutsi Survivor hotel enclave path outcomes
- UN Peacekeeper documentation path outcomes

These can be added incrementally as the pattern is now established.

## Files Modified

- `js/engine/ConsequenceSystem.js` - Added `shouldDieNow()` and role-specific death check methods
- `js/engine/UIController.js` - Added early death context handling and epilogue selection
- `js/content/missions/rwanda/hutu-moderate.js` - Added `deathEpilogueEarly` to rescue path outcome
- `js/content/nue to ICTR testimony scenes

4. **UN Protection Path (Tutsi Survivor):**
   - Go to church → Escape → Flag UN convoy
   - Story should almost always continue to aftermath (very low death chance)

## Remaining Work

Additional early death epilogues needed for:
- Tutsi Survivor ceiling hiding path outcomes
- Tutsi Su- Story should ALWAYS continue to gacaca (these players survive genocide)

3. **Church Escape Path (Tutsi Survivor):**
   - Go to church → Escape during massacre → Stay hidden in ditch
   - Story should sometimes end at the ditch scene with death message
   - Should NOT conti happened at the moment the player's choices made it inevitable - not as a retrospective label applied after the full story completes.

## Testing Verification

To verify the system works:

1. **Rescue Path (Hutu Moderate):**
   - Hide Celestin → Misdirect militia → Falsify cards at roadblock
   - Story should sometimes end AT the roadblock scene with death message
   - Should NOT continue to gacaca scenes

2. **Compliance Path (Hutu Moderate):**
   - Attend rally → Staff roadblock → Continue compliance
    Content - Early Death Epilogues

Added `deathEpilogueEarly` fields to key outcomes:

**Hutu Moderate:**
- `rw-hm-outcome-rescue-killed-hero`: Death at roadblock in April 1994, posthumous gacaca testimony

**Tutsi Survivor:**
- `rw-ts-outcome-hidden-ditch-killed`: Found in ditch night of April 7, 1994
- Additional outcomes need early epilogues (in progress)

**UN Peacekeeper:**
- Outcomes already handle mid-story death appropriately (most reference specific 1994 events)

## Key Principle

Death should feel like itscene-03c`, `rw-ts-scene-03d` (Tutsi Survivor escape/hiding scenes)
- `rw-un-scene-02c`, `rw-un-scene-03a`, `rw-un-scene-03b`, `rw-un-scene-03c` (UN Peacekeeper defiance/evacuation scenes)

### 4. UIController.js - Early Death Epilogue Handling

Updated outcome rendering:
- Stores `earlyDeathContext` when `game:complete` includes `diedEarly: true`
- Uses `outcome.deathEpilogueEarly` if present and player died mid-story
- Falls back to `outcome.epilogue` for players who reached aftermath scenes

### 5. OutcomeStateMachine.js - Death Checkpoint Hook

Already implemented (no changes needed):
- Before loading next scene, checks if current scene has `deathCheckpoint: true`
- Calls `consequenceSystem.shouldDieNow(roleId)`
- If player dies, emits `game:complete` with `diedEarly: true` instead of loading next scene

### 3. Scene Content - Death Checkpoint Flags

Already in place on appropriate scenes:
- `rw-hm-scene-03a`, `rw-hm-scene-03b` (Hutu Moderate roadblock scenes)
- `rw-ts-scene-03a`, `rw-ts-scene-03b`, `rw-ts-aftermath, terminate with early death epilogue

**Tutsi Survivor:**
- Escaped church path without reaching safety: 45-75% death chance (varies by choices)
- Rolls for death at scene-03a/03b/03c/03d checkpoints
- If dies: skip scene-04 aftermath, terminate with early death epilogue

**UN Peacekeeper:**
- Defied orders + held hotel: 50% death chance
- Left Rwanda: 1% death chance
- Rolls for death at scene-03a/03b/03c checkpoints
- If dies: skip scene-04 aftermath, terminate with early death epilogue

### 2. Scene005-2008
- Death epilogues referenced gacaca courts and testimony the player never reached
- The narrative was broken - players "died" after living through their own aftermath

## Solution Implemented

### 1. ConsequenceSystem.js - New `shouldDieNow()` Method

Added death checkpoint logic that evaluates mid-story death probability:

**Hutu Moderate:**
- Rescue path (helped Celestin + misdirected militia + saved at roadblock): 80% death chance
- Rolls for death at scene-03a checkpoint
- If dies: skip scene-04 eir choices make death inevitable, rather than experiencing post-genocide aftermath scenes before death is determined.

## Problem Statement

Previously, players who took high-risk paths (hiding Celestin + falsifying cards, escaping church without reaching safety) had high death chances but the story ALWAYS continued to gacaca/ICTR aftermath scenes (2005-2012) before death was determined. This meant:

- A player killed at a roadblock in April 1994 still experienced scenes set in 2emented a mid-story death checkpoint system that ensures players die at the moment thth Checkpoint System - Implementation Complete

## Overview

Impl# Rwanda Dea