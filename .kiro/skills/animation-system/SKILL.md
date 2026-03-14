---
name: animation-system
description: Build, wire, or modify scene animations in Witness Interactive. Use when implementing any interactive animation (identity card flip, machete sweep, screen shake, vignette, roadblock silhouettes, UN vehicle, dawn-to-smoke), or when connecting animations to specific scene IDs via AnimationSystem.js.
---

# Animation System Skill

All animations in Witness Interactive are non-blocking, pointer-events: none, and triggered via EventBus. Choice buttons are always z-index 20 — animations are always z-index 10 or below. Nothing ever covers a choice button.

## Architecture Rules
- Animations live in `js/engine/AnimationSystem.js`
- Triggered via: `eventBus.emit('animation:play', { id: 'animation-id', options: {} })`
- Every animation must have a `cleanup()` method that removes all DOM elements and CSS classes it created
- Animations are mapped to scene IDs in the scene data object: `scene.animation: { id, options }`
- `prefers-reduced-motion` must be respected — all animations check this before running

## Z-index Hierarchy (Never Violate)
```
Choice buttons:  z-index 20  ← UNTOUCHABLE
Animations:      z-index 10
Atmospheric:     z-index 5
Scene content:   z-index 1
```

## Available Animations
See `references/animation-specs.md` for full implementation specs on all 10 animations:
- `identity-card-flip` — roadblock scenes
- `machete-sweep` — church massacre scenes (implied violence only, no gore)
- `screen-shake` — grenade/gunshot moments
- `vignette-tighten` — hiding scenes (attic, ceiling, drainage ditch)
- `dust-particles` — enclosed space scenes
- `dawn-to-smoke` — scene 01 of each Rwanda role
- `roadblock-silhouettes` — roadblock scenes
- `typewriter-cursor-pulse` — all scenes (crisis = red, hiding = dim, epilogue = amber)
- `un-vehicle-pass` — UN evacuation scenes
- `radio-static-flash` — scene 01 RTLM radio moments

## When Adding a New Animation
1. Add implementation to `AnimationSystem.js`
2. Add CSS keyframes to `css/animations.css`
3. Add the `animation` field to the relevant scene objects in content files
4. Never add animation logic inside UIController.js — AnimationSystem owns all animations
5. Test with `prefers-reduced-motion: reduce` active before committing
