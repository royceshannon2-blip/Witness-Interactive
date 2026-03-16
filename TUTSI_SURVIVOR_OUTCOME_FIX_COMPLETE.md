# Tutsi Survivor Outcome Fix - Complete

## Problem
The Tutsi Survivor role had 24 orphaned flags where aftermath scene choices (scene-04a, scene-04b, scene-04c, scene-04d) produced no variation in epilogues. Players who survived via different paths all received the same generic epilogue regardless of their post-genocide choices.

## Root Cause
Generic fallback outcomes appeared BEFORE specific aftermath outcomes in the outcomes array. When the ConsequenceSystem scored outcomes, ties occurred (both generic and specific had score=3), and the system returned the FIRST match - which was always the generic one.

## Solution
Reordered the outcomes array to prioritize specificity:
1. Most specific outcomes (4+ conditions) come first
2. Generic fallbacks (2-3 conditions) come last
3. Death outcomes remain with their respective paths

## Changes Made

### File: `js/content/missions/rwanda/tutsi-survivor.js`

**Moved generic outcome:**
- `rw-ts-outcome-hidden-ditch-survived` moved from line 488 to after the three specific ditch outcomes (line 658)
- Now appears AFTER: ditch-spoke, ditch-private, ditch-distance

**All specific outcomes already existed and were working:**
- ✓ Testimony path: testimony-full, testimony-protected, testimony-declined
- ✓ Ditch path: ditch-spoke, ditch-private, ditch-distance  
- ✓ Ceiling path: ceiling-spoke, ceiling-private, ceiling-distance
- ✓ Attic path: attic-spoke, attic-silent, attic-declined
- ✓ Enclave path: enclave-spoke, enclave-listened, enclave-private

## Results

### Before Fix
- Paths 7, 9, 11 (ditch hiding) → all hit `rw-ts-outcome-hidden-ditch-survived` (generic)
- 24 orphaned flags
- Players saw identical epilogues despite different aftermath choices

### After Fix
- Path 7 → `rw-ts-outcome-ditch-spoke-survived` ✓
- Path 9 → `rw-ts-outcome-ditch-private-survived` ✓
- Path 11 → `rw-ts-outcome-ditch-distance-survived` ✓
- 6 orphaned flags (intentional metadata)
- All 15 unique decision paths resolve to distinct epilogues

### Test Results
```
Scenes total / unreachable : 12 / 0
Outcomes defined           : 28
Unique decision paths      : 15
Specific outcome matches   : 30
Fallback outcomes          : 0  ✓
Null outcomes              : 0  ✓
Structural problems        : 0  ✓
Orphaned flags             : 6  (intentional)
Unique outcomes reached    : 19 ✓
```

## Remaining Orphaned Flags (Intentional)

These 6 flags are metadata/philosophy descriptors, not used for outcome determination:

1. `rw_sought_hutu_friend` - Superseded by `rw_hid_with_hutu` (seeking ≠ finding)
2. `rw_attempted_hotel` - Superseded by `rw_reached_hotel` (attempting ≠ succeeding)
3. `rw_chose_education` - Meta flag; outcomes use `rw_shared_testimony` instead
4. `rw_chose_privacy` - Meta flag; outcomes use `rw_mourned_privately` instead
5. `rw_chose_distance` - Meta flag; outcomes use `rw_avoided_ceremony` instead
6. `rw_chose_visibility` - Meta flag; outcomes use `rw_shared_hotel_story` instead

This design is intentional: outcomes check for concrete actions, not philosophical motivations.

## Verification

All paths tested and verified:
- ✓ Zero fallback outcomes (all paths hit specific matches)
- ✓ Zero null outcomes
- ✓ All 15 unique decision paths resolve correctly
- ✓ Each aftermath choice produces a distinct epilogue
- ✓ Scoring algorithm correctly prioritizes specific over generic

## Commit
```
fix(rwanda): reorder tutsi-survivor outcomes to prioritize specific aftermath choices
```

Date: 2026-03-15
Status: ✅ Complete
