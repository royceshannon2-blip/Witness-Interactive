# Architecture Rules — Never Violate These

- Engine files in js/engine/ — logic only, zero content strings
- Content files in js/content/missions/ — data only, zero logic
- All communication via EventBus — no direct component coupling
- No global variables — ES6 modules only
- No frameworks, no npm, no build tools
- All new missions added via MissionRegistry only
- CSS custom properties for every color, font, spacing value
- Every scene object must include AP theme tags---
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