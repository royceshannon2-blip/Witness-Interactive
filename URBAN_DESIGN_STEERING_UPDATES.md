# Urban Design Mission - Steering Updates Complete

## Summary
Updated steering files, hooks, and engine logic to properly support the Urban Design mission ("Divided City") with AP Human Geography curriculum alignment and data-driven narrative requirements.

## Files Updated

### 1. `.kiro/skills/ap-curriculum.md`
**Added:** AP Human Geography skills section
- `spatial-analysis`: Location and distance influence on policy
- `human-environment-interaction`: How redlining shaped physical environment
- `scale-analysis`: Connecting local to national patterns
- `patterns-and-processes`: Geographic patterns of disinvestment

**Why:** Urban Design mission requires APHG skills, not just AP US/World History skills. Scenes must be tagged with appropriate APHG themes.

### 2. `.kiro/skills/historical-accuracy.md`
**Added:** Data-Narrative Mapping section
- HOLC redlining map verification requirements
- Temperature and environmental data standards
- `// DATA-VERIFIED` and `// ESTIMATED` comment conventions
- Sources: University of Richmond "Mapping Inequality" project

**Why:** Urban Design spans 90 years and requires anchoring to verifiable data (HOLC maps, heat island effects) rather than single-event narratives.

### 3. `.kiro/skills/game-writing.md`
**Added:** Urban Resident role tone guidelines
- Observant, weary, resilient across decades
- Vocabulary: block, neighborhood, property, investment, decline
- Sample line demonstrating systemic barriers

**Added:** Urban Heat Sensory Rule
- Phase 2 scenes (1960s-1980s) MUST include physical temperature descriptions
- Required elements: radiating heat, lack of shade, physical discomfort
- Ensures environmental racism is conveyed through sensory experience

**Why:** Urban Design requires different writing approach than military/conflict missions. Heat must be visceral, not abstract.

### 4. `.kiro/steering/scope.md`
**Updated:** IN SCOPE section
- Added: "Rwanda Genocide mission, 3 roles, 4 scenes each"
- Added: "Urban Design mission (Divided City), 1 role, 4 scenes"
- Added: "Multiple missions support via MissionRegistry"
- Clarified: "Real audio files (placeholder audio only)"

**Removed from OUT OF SCOPE:**
- "Multiple simultaneous missions" (now supported)

**Why:** Officially documents that Urban Design and Rwanda are in scope, not future features.

### 5. `.kiro/hooks/architecture-guard.kiro.hook`
**Updated:** Prompt to allow mission prefix logic
- EXCEPTION: SceneStateMachine.js may contain mission prefix logic (ph-, rw-, ud-)
- Allows aftermath detection logic for Urban Design mission

**Why:** SceneStateMachine needs to recognize `ud-` prefix for scene routing, which is minimal content coupling but architecturally necessary.

### 6. `.kiro/hooks/github-pages-check.kiro.hook`
**Updated:** Prompt to emphasize relative paths
- CRITICAL: Mission content files must use `./audio/` not `/audio/`
- Explicitly mentions ud-resident.js as example

**Why:** Absolute paths break on GitHub Pages when deployed to subdirectories. Urban Design mission must use relative paths for all assets.

### 7. `js/engine/SceneStateMachine.js`
**Updated:** Aftermath detection logic
- Changed: `if (newScene.id.startsWith('rw-')` 
- To: `if ((newScene.id.startsWith('rw-') || newScene.id.startsWith('ud-'))`
- Now recognizes both Rwanda and Urban Design scene-04 as aftermath triggers

**Why:** Urban Design mission follows same 4-scene structure as Rwanda, needs aftermath detection for scene-04.

### 8. `.kiro/steering/urban-design-mission.md` (NEW)
**Created:** Mission-specific steering file
- Inclusion mode: `fileMatch` with pattern `**/missions/urban-design/**`
- Documents data-driven narrative requirements
- HOLC map verification standards
- Heat and Canopy atmospheric effects
- APHG skill alignment requirements
- Scene ID conventions (ud- prefix)
- Asset path requirements for GitHub Pages

**Why:** Consolidates all Urban Design-specific requirements in one place, auto-included when working on Urban Design mission files.

## Architecture Compliance

All updates maintain architectural rules:
- ✅ Engine/content separation preserved
- ✅ EventBus communication pattern unchanged
- ✅ No global variables introduced
- ✅ No frameworks or build tools required
- ✅ CSS custom properties for all styling
- ✅ AP theme tags required for all scenes

## Testing Recommendations

Before implementing Urban Design mission content:
1. Verify SceneStateMachine recognizes `ud-` prefix
2. Test aftermath detection fires for `ud-resident-scene-04`
3. Verify relative audio paths work in GitHub Pages deployment
4. Confirm APHG skills appear in ap-curriculum.md
5. Test Heat and Canopy atmospheric effects render correctly

## Next Steps

The steering system is now ready for Urban Design mission implementation:
1. Create `js/content/missions/urban-design/` directory
2. Implement `ud-resident.js` with 4 scenes
3. Add mission to MissionRegistry
4. Create knowledge questions with APHG alignment
5. Implement Heat and Canopy atmospheric effects in AtmosphericEffects.js
6. Test full mission flow with relative asset paths

## Key Differences from Other Missions

**Pearl Harbor / Rwanda:**
- Single day, multiple roles
- Event-driven narrative
- AP US/World History skills
- Military/conflict focus

**Urban Design:**
- 90 years, single role
- Data-driven narrative
- AP Human Geography skills
- Policy/environment focus
- Requires sensory heat descriptions
- Must anchor to HOLC maps and environmental data

---

**Date:** March 16, 2026
**Status:** ✅ Complete - All steering files updated and ready for Urban Design implementation
