# Architecture Rules — Never Violate These

- Engine files in js/engine/ — logic only, zero content strings
- Content files in js/content/missions/ — data only, zero logic
- All communication via EventBus — no direct component coupling
- No global variables — ES6 modules only
- No frameworks, no npm, no build tools
- All new missions added via MissionRegistry only
- CSS custom properties for every color, font, spacing value
- Every scene object must include AP theme tags

## Mission-Specific Constraints (Divided City / ud- namespace)

### Silent Mission Rule
The ud- mission (Urban Design / Divided City) is a silent-only experience:
- NEVER include `ambientTrack` properties in ud- scene objects
- NEVER include `narratorAudio` properties in ud- scene objects
- Immersion comes from narrative text and atmospheric effects only
- This is an intentional design constraint, not a limitation

### Asset Pathing for GitHub Pages
All asset references in mission content files MUST use relative paths:
- ✅ CORRECT: `./audio/ambient/file.mp3` or `../audio/ambient/file.mp3`
- ❌ WRONG: `/audio/ambient/file.mp3` (breaks on GitHub Pages subdirectories)
- This applies to all missions but is critical for ud- mission deployment---
inclusion: always
## Completion Expectation
All tasks in tasks.md are expected to be completed fully in sequence.
Do not stop between tasks. Do not ask for permission to continue.
The implementation is done when every checkbox in tasks.md is marked complete
and the final checkpoint passes.
---
<!------------------------------------------------------------------------------------
   Add rules to this file or a short description and have Kiro refine them for you.
   
   Learn about inclusion modes: https://kiro.dev/docs/steering/#inclusion-modes
-------------------------------------------------------------------------------------> 