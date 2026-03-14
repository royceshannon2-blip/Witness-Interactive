---
inclusion: always
---

# Frontend Design Rules

## Design Philosophy
Dark. Serious. Present. This is not a bright educational app — it is atmospheric and immersive. The interface disappears; the student feels like they're reading a historical document.

## Color System (CSS custom properties — always use these)
```css
--color-background:       #0a0a0a;
--color-surface:          #111111;
--color-surface-raised:   #1a1a1a;
--color-text-primary:     #E8DCC8;   /* warm parchment */
--color-text-secondary:   #A89880;
--color-text-dim:         #6B5D4F;
--color-crisis:           #8B0000;   /* dark red — danger only */
--color-safe:             #1a3a1a;   /* dark green */
--color-un-blue:          #009EDB;
--color-dawn:             #FF6B35;
--color-smoke:            #4a4a4a;
--color-gold:             #B8860B;   /* epilogue */
--color-choice-default:   #1E1E1E;
--color-choice-hover:     #2A2A2A;
--color-choice-border:    #3D3D3D;
```
Never use pure white. Never use `--color-crisis` decoratively.

## Typography
- Narrative text: serif (`Georgia`), 1.1rem, line-height 1.8, **max-width 680px**
- UI elements: system-ui sans-serif, 0.9rem
- Dates/metadata: `Courier New` monospace, 0.85rem
- Never bold in scene narrative. Emphasis comes from sentence construction.

## Z-index Hierarchy
```
Choice buttons:   z-index 20  ← UNTOUCHABLE, always on top
Animations:       z-index 10
Atmospheric:      z-index 5
Scene content:    z-index 1
```

## Accessibility
- WCAG AA contrast (4.5:1 minimum)
- All elements keyboard-navigable
- `prefers-reduced-motion` respected — all animations respect it
- Minimum touch target: 44px height

## What the UI Never Does
- Uses bright colors as chrome
- Shows scores or progress bars during narrative
- Uses rounded corners larger than 4px on narrative elements
- Shows achievement badges, stars, or gamification elements
- Auto-plays audio without player action
